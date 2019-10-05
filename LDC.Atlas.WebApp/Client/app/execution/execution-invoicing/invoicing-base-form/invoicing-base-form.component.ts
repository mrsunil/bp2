import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, HostListener, Inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, of, throwError } from 'rxjs';
import { catchError, finalize, mergeMap } from 'rxjs/operators';
import { CompanyManagerService } from '../../../core/services/company-manager.service';
import { BaseFormComponent } from '../../../shared/components/base-form-component/base-form-component.component';
import { ConfirmationDialogComponent } from '../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { DocumentGenerationConfirmationDialogBoxComponent } from '../../../shared/components/document-generation-confirmation-dialog-box/document-generation-confirmation-dialog-box.component';
import { DocumentTemplateSelectedEvent } from '../../../shared/document-template-event.entity';
import { DocumentPopupButtonSettings } from '../../../shared/entities/document-popup-button-settings.entity';
import { PhysicalDocumentReference } from '../../../shared/entities/document-reference.entity';
import { PhysicalDocumentTemplate } from '../../../shared/entities/document-template.entity';
import { ProblemDetail } from '../../../shared/entities/problem-detail.entity';
import { WINDOW } from '../../../shared/entities/window-injection-token';
import { DocumentEntityTypes } from '../../../shared/enums/document-entity-type.enum';
import { DocumentTypes } from '../../../shared/enums/document-type.enum';
import { InvoiceTypes } from '../../../shared/enums/invoice-type.enum';
import { DocumentPopupService } from '../../../shared/services/document-popup.service';
import { InvoiceRecord } from '../../../shared/services/execution/dtos/invoice-record';
import { FormConfigurationProviderService } from '../../../shared/services/form-configuration-provider.service';
import { ExecutionService } from '../../../shared/services/http-services/execution.service';
import { PreaccountingService } from '../../../shared/services/http-services/preaccounting.service';
import { UtilService } from '../../../shared/services/util.service';
import { AtlasFormControl } from './../../../shared/entities/atlas-form-control';
import { GenerateDocumentActions } from './../../../shared/enums/generate-document-action.enum';
import { DocumentService } from './../../../shared/services/http-services/document.service';
import { SnackbarService } from './../../../shared/services/snackbar.service';

@Component({
    selector: 'atlas-invoicing-base-form',
    templateUrl: './invoicing-base-form.component.html',
    styleUrls: ['./invoicing-base-form.component.scss'],
})
export class InvoicingBaseFormComponent extends BaseFormComponent {
    isCreateInvoiceButtonClicked = false;
    protected formComponents: BaseFormComponent[] = [];
    currentStep: number = 0;
    hasTemplate = false;
    previewDocumentCtrl = new AtlasFormControl('previewDocumentCtrl');
    selectedTemplate: PhysicalDocumentTemplate;
    isLoading = false;
    selectedbankAccountId: number;
    messageGenerated: string;
    mappingFields = new Array();

    constructor(protected dialog: MatDialog,
        protected router: Router,
        protected companyManager: CompanyManagerService,
        protected snackbarService: SnackbarService,
        protected documentService: DocumentService,
        @Inject(WINDOW) protected window: Window,
        protected utilService: UtilService,
        protected executionService: ExecutionService,
        protected route: ActivatedRoute,
        protected formBuilder: FormBuilder,
        protected preaccountingService: PreaccountingService,
        protected formConfigurationProvider: FormConfigurationProviderService,
        protected documentPopupService: DocumentPopupService) {
        super(formConfigurationProvider);
    }

    onDiscardButtonClicked() {

        const confirmDialog = this.dialog.open(ConfirmationDialogComponent, {
            data: {
                title: 'Discard Changes',
                text: 'You have some modification pending. Close and lose changes?',
                okButton: 'Ok',
                cancelButton: 'Cancel',
            },
        });
        confirmDialog.afterClosed().subscribe((answer) => {
            if (answer) {
                this.goToInvoiceHome();
            } else {
                this.isLoading = false;
            }
        });
    }

    @HostListener('window:beforeunload', ['$event']) unloadNotification($event: any) {
        if (this.formGroup.dirty) {
            $event.returnValue = true;
        }
    }

    goToInvoiceHome() {
        this.router.navigate(['/' + this.companyManager.getCurrentCompanyId() + '/execution/invoicing/home']);
    }

    newSearchButtonClicked() {
        this.router.navigate(['/' + this.companyManager.getCurrentCompanyId() + '/execution/invoicing/new']);
    }

    getCreateInvoiceInfo(): InvoiceRecord {
        this.isCreateInvoiceButtonClicked = true;
        let invoiceRecord = new InvoiceRecord();
        this.formComponents.forEach((comp) => {
            invoiceRecord = comp.populateEntity(invoiceRecord);
        });

        invoiceRecord.bankAccountId = this.selectedbankAccountId;

        return invoiceRecord;
    }

    onChangeStepAction(event) {
        this.currentStep = event.selectedIndex;
    }

    showConfirmationModal(hasPreview: boolean | string) {
        if (hasPreview) {
            this.createInvoice(true);
        } else {
            this.createInvoice();
        }
    }

    createInvoice(isDraft = false) {
        this.isLoading = true;
        let dialog: MatDialogRef<DocumentGenerationConfirmationDialogBoxComponent>;
        const messageGenerating = 'Generating invoice' + (isDraft ? ' preview' : '') + '... Please wait.';
        if (isDraft) {
            dialog = this.documentPopupService.showDocumentGenerationPopup(
                'Document Invoice',
                'invoice',
                new DocumentPopupButtonSettings(),
            );
            this.documentPopupService.startDialogWork(dialog, messageGenerating);
        } else {
            this.snackbarService.informationSnackBar(messageGenerating);
        }

        const invoiceRecord = this.getCreateInvoiceInfo();
        invoiceRecord.isDraft = isDraft;
        this.beforeInvoiceActions(invoiceRecord);
        this.executionService.createInvoice(invoiceRecord)
            .pipe(
                mergeMap((invoice: InvoiceRecord) => {
                    if (invoice.c2CCode && invoice.costAlternativeCode && invoice.departmentAlternativeCode
                        && invoice.nominalAlternativeAccount && invoice.taxInterfaceCode) {
                        this.messageGenerated = 'Invoice ' + invoice.documentReference + ' generated successfully';
                    } else {
                        if (!invoice.costAlternativeCode) {
                            this.mappingFields.push('"Cost Alternative Code"');
                        }
                        if (!invoice.departmentAlternativeCode) {
                            this.mappingFields.push('"Department Alternative Code"');
                        }
                        if (!invoice.nominalAlternativeAccount) {
                            this.mappingFields.push('"Nominal Account"');
                        }
                        if (!invoice.taxInterfaceCode) {
                            this.mappingFields.push('"Tax Code"');
                        }
                        if (!invoice.c2CCode) {
                            this.mappingFields.push('"C2C code"');
                        }
                        const mappingErrorFields = this.mappingFields.join(', ');
                        this.messageGenerated = 'The document ' + invoice.invoiceLabel +
                            ' will not be sent to the accounting interface because the accounting interface code for '
                            + mappingErrorFields + ' is/are not filled in. Please contact the accountant';
                    }
                    if (dialog) {
                        dialog.componentInstance.processMessage = this.messageGenerated;
                    } else {
                        this.snackbarService.informationAndCopySnackBar(this.messageGenerated, this.messageGenerated);
                    }
                    return combineLatest(
                        (invoice.physicalDocumentId) ?
                            this.documentService.getGeneratedDocumentContent(invoice.physicalDocumentId, isDraft)
                            : of(null),
                        of(invoice));
                }),
                catchError((error) => {
                    if (dialog) {
                        dialog.close();
                    }

                    return throwError(error);
                }),
                finalize(() => {
                    this.isLoading = false;
                    this.documentPopupService.finishDialogWork(dialog);
                }),
            )
            .subscribe(([response, invoice]) => {
                if (!isDraft) {
                    this.afterInvoiceActions(invoice);
                } else {
                    this.handleDialogEvents(invoice, dialog);
                }
                if (response) {
                    this.downloadFile(response);
                }
            }
                , (error) => {
                    this.snackbarService.throwErrorSnackBar(error.error.detail);
                });
    }

    beforeInvoiceActions(invoiceRecord: InvoiceRecord): void {
        // overwritten in base child classes
    }

    afterInvoiceActions(invoiceRecord: InvoiceRecord, summaryRecord?: InvoiceRecord): void {
        // overwritten in base child classes
    }

    downloadFile(response: HttpResponse<Blob>) {
        const newBlob = new Blob([response.body],
            { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
        const data = this.window.URL.createObjectURL(newBlob);
        const link = document.createElement('a');
        link.href = data;
        link.download = this.utilService.getFileNameFromContentDisposition(response);
        link.click();
    }

    handleDialogEvents(invoiceRecord: InvoiceRecord,
        dialog: MatDialogRef<DocumentGenerationConfirmationDialogBoxComponent>) {

        this.subscriptions.push(dialog.componentInstance.documentSelected
            .subscribe((file: File) => {
                this.onFileSelected(dialog, invoiceRecord, file);
            }));

        this.subscriptions.push(dialog.afterClosed()
            .subscribe((answer) => {
                this.onDialogClosed(answer);
            }));
    }

    onFileSelected(dialog: MatDialogRef<DocumentGenerationConfirmationDialogBoxComponent>,
        invoiceRecord: InvoiceRecord,
        file: File) {
        this.documentPopupService.startDialogWork(dialog, 'Uploading document...');
        const documentType = this.mapInvoiceTypeToPhysicalDocumentType(invoiceRecord.invoiceType);
        this.subscriptions.push(this.documentService.uploadDocument(
            invoiceRecord.invoiceId,
            documentType,
            invoiceRecord.template,
            true,
            file)
            .pipe(
                mergeMap((document: PhysicalDocumentReference) => {
                    dialog.componentInstance.processMessage = 'Generating final document...';
                    const invoiceInfo = this.getCreateInvoiceInfo();
                    invoiceInfo.physicalDocumentId = document.physicalDocumentId;
                    this.beforeInvoiceActions(invoiceInfo);
                    return this.executionService.createInvoice(invoiceInfo);
                }),
                mergeMap((invoice: InvoiceRecord) => {
                    dialog.componentInstance.processMessage = 'Downloading final document...';
                    return combineLatest(this.documentService.getGeneratedDocumentContent(invoice.physicalDocumentId), of(invoice));
                }),
                finalize(() => {
                    this.documentPopupService.finishDialogWork(dialog);
                }),
            )
            .subscribe(
                ([response, invoice]) => {
                    this.downloadFile(response);
                    this.afterInvoiceActions(invoice);
                    dialog.close();
                },
                (error: HttpErrorResponse) => {
                    dialog.componentInstance.errorMessage = this.documentPopupService.getErrorMessage(error, DocumentEntityTypes.Invoice);
                },
            ));
    }

    mapInvoiceTypeToPhysicalDocumentType(invoiceType: InvoiceTypes): DocumentTypes {
        switch (invoiceType) {
            case InvoiceTypes.Purchase:
            case InvoiceTypes.Sales:
                return DocumentTypes.InvoiceGoodsInvoice;
            case InvoiceTypes.Cost:
            case InvoiceTypes.CostReceivable:
            case InvoiceTypes.CostCreditNote:
            case InvoiceTypes.CostDebitNote:
                return DocumentTypes.InvoiceCostsInvoice;
            case InvoiceTypes.GoodsCostPurchase:
            case InvoiceTypes.GoodsCostSales:
                return DocumentTypes.InvoiceGoodsCostInvoice;
            case InvoiceTypes.Washout:
                return DocumentTypes.InvoiceWashout;
            case InvoiceTypes.Reversal:
                return DocumentTypes.InvoiceCancellation;
            default:
                console.error('Invalid invoice selection type: %s', invoiceType);
                break;
        }
    }

    onDialogClosed(dialogAnswer: any) {
        if (dialogAnswer && dialogAnswer['buttonClicked']) {
            if (dialogAnswer['buttonClicked'] === GenerateDocumentActions.ConfirmDocumentGeneration) {
                this.createInvoice();
            }
        }
    }

    onDocumentTemplateSelected(documentSelectedEvent: DocumentTemplateSelectedEvent) {
        this.hasTemplate = documentSelectedEvent.hasTemplate;
        this.previewDocumentCtrl.setValue(this.hasTemplate);
        this.selectedTemplate = documentSelectedEvent.template || undefined;
    }
}
