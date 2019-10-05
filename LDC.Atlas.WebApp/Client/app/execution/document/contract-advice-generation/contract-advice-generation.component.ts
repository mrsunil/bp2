import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import * as _moment from 'moment';
import { of, Subject } from 'rxjs';
import { finalize, mergeMap, takeUntil } from 'rxjs/operators';
import { DocumentPopupButtonSettings } from '../../../shared/entities/document-popup-button-settings.entity';
import { PhysicalDocumentReference } from '../../../shared/entities/document-reference.entity';
import { PhysicalDocumentTemplate } from '../../../shared/entities/document-template.entity';
import { ProblemDetail } from '../../../shared/entities/problem-detail.entity';
import { WINDOW } from '../../../shared/entities/window-injection-token';
import { DocumentEntityTypes } from '../../../shared/enums/document-entity-type.enum';
import { Gaps } from '../../../shared/enums/gaps.enum';
import { DocumentPopupService } from '../../../shared/services/document-popup.service';
import { FeatureFlagService } from '../../../shared/services/http-services/feature-flag.service';
import { SecurityService } from '../../../shared/services/security.service';
import { UtilService } from '../../../shared/services/util.service';
import { DocumentGenerationConfirmationDialogBoxComponent } from './../../../shared/components/document-generation-confirmation-dialog-box/document-generation-confirmation-dialog-box.component';
import { AtlasFormControl } from './../../../shared/entities/atlas-form-control';
import { DocumentTypes } from './../../../shared/enums/document-type.enum';
import { GenerateDocumentActions } from './../../../shared/enums/generate-document-action.enum';
import { DocumentService } from './../../../shared/services/http-services/document.service';
import { SnackbarService } from './../../../shared/services/snackbar.service';
import { DocumentListCardComponent } from './../list/card/document-list-card.component';
import { ContractTemplateSelecionComponent } from './form-components/contract-template-selection/contract-template-selection.component';
import { ContractAdviceGenerationSelectionFormComponent } from './form-components/selection-form/selection-form.component';

@Component({
    selector: 'atlas-contract-advice-generation',
    templateUrl: './contract-advice-generation.component.html',
    styleUrls: ['./contract-advice-generation.component.scss'],
})
export class ContractAdviceGenerationComponent implements OnInit, OnDestroy {
    company: string;
    isLoading = true;
    recordId: number;
    previewDocumentCtrl: FormControl;
    destroy$ = new Subject();
    sectionId: any;
    isGap117 = false;

    @ViewChild('SelectionForm') selectionForm: ContractAdviceGenerationSelectionFormComponent;
    @ViewChild('DocumentList') documentList: DocumentListCardComponent;

    constructor(private securityService: SecurityService,
        private route: ActivatedRoute,
        private documentService: DocumentService,
        private snackbarService: SnackbarService,
        @Inject(WINDOW) private window: Window,
        private dialog: MatDialog,
        private utilService: UtilService,
        private documentPopupService: DocumentPopupService,
        protected router: Router,
        private featureFlagService: FeatureFlagService,
    ) { }

    ngOnInit() {
        this.securityService.isSecurityReady().subscribe(() => {
            this.initView();
            this.isLoading = false;
        });
        this.previewDocumentCtrl = new AtlasFormControl('previewDocumentCtrl', true);
        this.sectionId = Number(this.route.snapshot.paramMap.get('recordId'));
        this.featureFlagService.getFlagInfo(Gaps.gap003).subscribe((flagAuth) => {
            this.isGap117 = (flagAuth && flagAuth.active);
        });
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    initView() {
        this.company = this.route.snapshot.paramMap.get('company');
        this.recordId = Number(this.route.snapshot.paramMap.get('recordId'));
    }

    downloadDocument(response: HttpResponse<Blob>) {
        const newBlob = new Blob([response.body],
            { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
        const data = this.window.URL.createObjectURL(newBlob);
        const link = document.createElement('a');
        link.href = data;
        link.download = this.utilService.getFileNameFromContentDisposition(response);
        link.click();
    }

    onGenerateDocumentClicked() {
        const templateCtrl = this.selectionForm.documentTemplateCtrl.value;
        if (!templateCtrl || (templateCtrl && templateCtrl.length === 0)) {
            this.snackbarService.throwErrorSnackBar('Please select a template');
            return;
        }
        this.generateNextDocument(0);
    }

    generateNextDocument(index: number) {
        if (this.selectionForm.documentTemplateCtrl.value.length > index) {
            if (this.previewDocumentCtrl.value) {
                this.generateAndOpenDocument(index, true);
            } else {
                this.generateAndOpenDocument(index);
            }
        }
    }

    generateAndOpenDocument(index: number, isPreview = false) {
        const template = this.selectionForm.documentTemplateCtrl.value[index] as PhysicalDocumentTemplate;
        this.isLoading = true;
        this.snackbarService.informationSnackBar('Generating ' + (isPreview ? 'preview' : 'final') + ' document. Please wait...');
        this.documentService.generateContractAdvice(this.recordId, template.path, isPreview)
            .pipe(
                finalize(() => {
                    this.isLoading = false;
                }),
                takeUntil(this.destroy$),
            )
            .subscribe((documentReference: PhysicalDocumentReference) => {

                if (!documentReference.physicalDocumentId) {
                    this.snackbarService.informationSnackBar('Error generating the document');
                    return;
                }

                this.snackbarService.informationSnackBar('Document generated successfully');
                this.documentService.getGeneratedDocumentContent(documentReference.physicalDocumentId, isPreview)
                    .pipe(
                        takeUntil(this.destroy$),
                    )
                    .subscribe((response: HttpResponse<Blob>) => {
                        this.downloadDocument(response);
                        if (isPreview) {
                            this.previewDocument(index);
                        } else {
                            this.generateNextDocument(index + 1);
                        }
                    });
            });
    }

    previewDocument(index: number) {
        const template = this.selectionForm.documentTemplateCtrl.value[index] as PhysicalDocumentTemplate;
        const dialog = this.documentPopupService.showDocumentGenerationPopup(
            'Contract [' + template.name + ']',
            'contract advice',
            new DocumentPopupButtonSettings(),
            this.previewDocumentCtrl.value,
            false,
        );

        dialog.componentInstance.documentSelected
            .pipe(
                takeUntil(this.destroy$),
            )
            .subscribe((file: File) => {
                this.onFileSelected(dialog, template.path, file);
            });

        dialog.afterClosed()
            .pipe(
                takeUntil(this.destroy$),
            )
            .subscribe((answer) => {
                this.onDialogClosed(answer, index);
            });
    }

    onFileSelected(dialog: MatDialogRef<DocumentGenerationConfirmationDialogBoxComponent>,
        templatePath: string,
        file: File) {
        this.documentPopupService.startDialogWork(dialog, 'Uploading document...');
        this.documentService.uploadDocument(
            this.recordId,
            DocumentTypes.ContractAdvice,
            templatePath,
            true,
            file)
            .pipe(
                mergeMap((document: PhysicalDocumentReference) => {
                    dialog.componentInstance.processMessage = 'Generating final document...';
                    return this.documentService.assignContractAdviceToSection(
                        this.recordId,
                        document.physicalDocumentId,
                        templatePath);
                }),
                mergeMap((document: PhysicalDocumentReference) => {
                    dialog.componentInstance.processMessage = 'Downloading final document...';
                    return this.documentService.getGeneratedDocumentContent(document.physicalDocumentId);
                }),
                finalize(() => {
                    this.documentPopupService.finishDialogWork(dialog);
                }),
                takeUntil(this.destroy$),
            )
            .subscribe(
                (response: HttpResponse<Blob> | string) => {
                    if (typeof response === 'string') {
                        dialog.componentInstance.errorMessage = response as string;
                    } else {
                        this.downloadDocument(response);
                        dialog.close();
                    }
                },
                (error: HttpErrorResponse) => {
                    dialog.componentInstance.errorMessage = this.documentPopupService.getErrorMessage(error, DocumentEntityTypes.Contract);
                });
    }

    onCancelButtonClicked() {
        if (this.sectionId) {
            this.router.navigate(['/' + this.company + '/trades/display/', this.sectionId]);
        }
    }

    onDialogClosed(dialogAnswer: any, index: number) {
        if (dialogAnswer && dialogAnswer['buttonClicked']) {
            if (dialogAnswer['buttonClicked'] === GenerateDocumentActions.ConfirmDocumentGeneration) {
                this.generateAndOpenDocument(index);
            }
        } else {
            this.generateNextDocument(index + 1);
        }
    }
}
