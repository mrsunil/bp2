import { Component, HostListener, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatStepper } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { CompanyManagerService } from '../../../core/services/company-manager.service';
import { BaseFormComponent } from '../../../shared/components/base-form-component/base-form-component.component';
import { ConfirmationDialogComponent } from '../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { ReversalRowSelection } from '../../../shared/entities/reversal-row-selection.entity';
import { WINDOW } from '../../../shared/entities/window-injection-token';
import { InvoiceTypes } from '../../../shared/enums/invoice-type.enum';
import { PermissionLevels } from '../../../shared/enums/permission-level.enum';
import { DocumentPopupService } from '../../../shared/services/document-popup.service';
import { InvoiceRecord } from '../../../shared/services/execution/dtos/invoice-record';
import { InvoiceSummaryRecord } from '../../../shared/services/execution/dtos/invoice-summary-record';
import { FormConfigurationProviderService } from '../../../shared/services/form-configuration-provider.service';
import { DocumentService } from '../../../shared/services/http-services/document.service';
import { ExecutionService } from '../../../shared/services/http-services/execution.service';
import { PreaccountingService } from '../../../shared/services/http-services/preaccounting.service';
import { SnackbarService } from '../../../shared/services/snackbar.service';
import { UtilService } from '../../../shared/services/util.service';
import { InvoicingBaseFormComponent } from '../invoicing-base-form/invoicing-base-form.component';
import { ReversalSelectionComponent } from './components/reversal-selection/reversal-selection.component';
import { ReversalSummaryComponent } from './components/reversal-summary/reversal-summary.component';
@Component({
    selector: 'atlas-reversal',
    templateUrl: './reversal.component.html',
    styleUrls: ['./reversal.component.scss'],
})
export class ReversalComponent extends InvoicingBaseFormComponent implements OnInit {
    protected formComponents: BaseFormComponent[] = [];

    @ViewChild('reversalSelectionComponent') reversalSelectionComponent: ReversalSelectionComponent;
    @ViewChild('reversalSummaryComponent') reversalSummaryComponent: ReversalSummaryComponent;
    @ViewChild('stepper') stepper: MatStepper;

    summaryRecord: InvoiceSummaryRecord;
    inverseReversalFormGroup: FormGroup;
    InvoiceTypes = InvoiceTypes;
    company: string;
    invoiceTypeId: number;
    currentStep: number = 0;
    PermissionLevels = PermissionLevels;
    transactionDocumentId: number;
    documentTypeId: number;
    documentDate: Date;
    invoicingSteps: { [key: string]: number } = {
        invoiceCreationStep: 0,
        summaryStep: 1,
    };
    isCreateInvoiceButtonClicked = false;
    isCreationMode: boolean = true;
    isSave: boolean = false;
    isInvoiceSelected = false;
    originalInvoiceId: number;
    originalInvoiceType: InvoiceTypes;

    /*
	-----------------------------------------------------------------------------------------------------------------------------------
	GLOBAL FUNCTIONS
	-----------------------------------------------------------------------------------------------------------------------------------
	*/

    constructor(
        protected dialog: MatDialog,
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
        super(dialog, router, companyManager, snackbarService, documentService, window, utilService,
            executionService, route, formBuilder, preaccountingService, formConfigurationProvider, documentPopupService);
        this.invoiceTypeId = Number(decodeURIComponent(this.route.snapshot.paramMap.get('invoiceTypeId')));
        this.company = this.companyManager.getCurrentCompanyId();
    }

    ngOnInit() {
        this.company = this.route.snapshot.paramMap.get('company');
        this.inverseReversalFormGroup = this.formBuilder.group({
            reversalSelectionComponent: this.reversalSelectionComponent.getFormGroup(),
        });
        this.formComponents.push(this.reversalSelectionComponent);
        this.getInvoiceSetupByCompany();
    }

    @HostListener('window:beforeunload', ['$event']) unloadNotification($event: any) {
        if (this.reversalSelectionComponent.invoiceSelectionFormGroup.dirty && this.isSave === false) {
            $event.returnValue = true;
        }
    }

    onChangeStepAction(event) {
        this.currentStep = event.selectedIndex;
    }

    getInvoiceSetupByCompany() {

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
            }
        });
    }

    newSearchButtonClicked() {
        this.router.navigate(['/' + this.companyManager.getCurrentCompanyId() + '/execution/invoicing/new']);
    }

    onNextInvoiceButtonClicked() {
        let searchContractRef: string = '';
        let searchCounterParty: string = '';
        let searchCharterRef: string = '';
        let searchInvoiceRef: string = '';
        let invoiceType: number = 0;
        searchContractRef = this.reversalSelectionComponent.documentSearchComponent.searchContractReference;
        searchCounterParty = this.reversalSelectionComponent.documentSearchComponent.searchCounterParty;
        searchCharterRef = this.reversalSelectionComponent.documentSearchComponent.saveCharterReference;
        searchInvoiceRef = this.reversalSelectionComponent.documentSearchComponent.searchInvoiceReference;
        invoiceType = this.reversalSelectionComponent.
            documentSearchComponent.invoiceType;
        this.router.navigate(
            ['/' + this.companyManager.getCurrentCompanyId() +
                '/execution/invoicing/' + encodeURIComponent(invoiceType.toString())],
            {
                queryParams: {
                    savedContractReference: searchContractRef, savedCounterParty: searchCounterParty,
                    savedCharterReference: searchCharterRef, savedInvoiceReference: searchInvoiceRef,
                },
                skipLocationChange: true,
            });
    }

    goToInvoiceHome() {
        this.router.navigate(['/' + this.companyManager.getCurrentCompanyId() + '/execution/invoicing/home']);
    }

    beforeInvoiceActions(invoiceRecord: InvoiceRecord) {
        this.originalInvoiceId = invoiceRecord.invoiceId;
    }

    afterInvoiceActions(invoiceRecord: InvoiceRecord) {
        this.isLoading = true;
        this.stepper.next();
        const documentDate = this.reversalSelectionComponent.documentTypeComponent.
            getFormGroup().value.documentDateCtrl;
        this.subscriptions.push(
            forkJoin([this.executionService.getInvoiceById(this.originalInvoiceId),
            this.executionService.getInvoiceSetupByCompany()])
                .pipe(
                    finalize(() => {
                        this.isLoading = false;
                    }),
                )
                .subscribe(([invoice, setup]) => {
                    invoice.invoiceDate = documentDate;
                    this.reversalSummaryComponent.populateInvoiceRecord(invoice, setup);
                }));
    }

    onOpenDialogOnPreviewAndReverseClicked() {
        // variable which checks for existing template (To be set once template card is implemented)
        this.isSave = true;
        this.isLoading = true;
        if (this.invoiceTypeId !== InvoiceTypes.Cost) {
            if (this.reversalSelectionComponent.invoiceSelectionFormGroup.valid && this.isInvoiceSelected) {
                this.showConfirmationModal(this.hasTemplate && this.previewDocumentCtrl.value);
            } else {
                this.snackbarService.informationSnackBar('Form is invalid. Please resolve the errors and/or select invoice to reverse.');
                this.isLoading = false;
            }
        }
    }

    onRowSelected(row: ReversalRowSelection) {
        this.isInvoiceSelected = row.isRowSelected;
        if (row.data) {
            this.originalInvoiceType = row.data.invoiceTypeId;
        }
    }
}
