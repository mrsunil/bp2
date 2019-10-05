import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { finalize, map, mergeMap, takeUntil } from 'rxjs/operators';
import { WINDOW } from '../../../shared/entities/window-injection-token';
import { DocumentEntityTypes } from '../../../shared/enums/document-entity-type.enum';
import { PricingMethods } from '../../../shared/enums/pricing-method.enum';
import { DocumentPopupService } from '../../../shared/services/document-popup.service';
import { UtilService } from '../../../shared/services/util.service';
import { DocumentUploadDialogBoxComponent } from '../dialog-boxes/document-upload-dialog-box/document-upload-dialog-box.component';
import { ListAndSearchComponent } from './../../../shared/components/list-and-search/list-and-search.component';
import { AgContextualMenuAction } from './../../../shared/entities/ag-contextual-menu-action.entity';
import { Charter } from './../../../shared/entities/charter.entity';
import { PhysicalDocument } from './../../../shared/entities/document-generated.entity';
import { PhysicalDocumentReference } from './../../../shared/entities/document-reference.entity';
import { ListAndSearchFilter } from './../../../shared/entities/list-and-search/list-and-search-filter.entity';
import { Section } from './../../../shared/entities/section.entity';
import { ListAndSearchFilterType } from './../../../shared/enums/list-and-search-filter-type.enum';
import { DocumentService } from './../../../shared/services/http-services/document.service';
import { ExecutionService } from './../../../shared/services/http-services/execution.service';
import { TradingService } from './../../../shared/services/http-services/trading.service';
import { DocumentDataLoader } from './../../../shared/services/list-and-search/document-data-loader';
import { SecurityService } from './../../../shared/services/security.service';
import { SnackbarService } from './../../../shared/services/snackbar.service';
import { TitleService } from './../../../shared/services/title.service';

@Component({
    selector: 'atlas-document-generation-document-list',
    templateUrl: './document-list.component.html',
    styleUrls: ['./document-list.component.scss'],
    providers: [DocumentDataLoader],
})
export class DocumentListComponent implements OnInit, OnDestroy {
    @ViewChild('listAndSearchComponent') listAndSearchComponent: ListAndSearchComponent;
    gridCode: string = 'DocumentListAndSearchGrid';
    company: string;
    isLoading = true;
    destroy$ = new Subject();

    menuActions: { [key: string]: string } = {
        download: 'download',
        edit: 'edit',
    };
    gridContextualMenuActions: AgContextualMenuAction[];
    additionalFilters: ListAndSearchFilter[] = [];

    constructor(
        private securityService: SecurityService,
        private snackbarService: SnackbarService,
        private documentService: DocumentService,
        private route: ActivatedRoute,
        private dialog: MatDialog,
        public dataLoader: DocumentDataLoader,
        @Inject(WINDOW) private window: Window,
        private utilService: UtilService,
        private tradingService: TradingService,
        private executionService: ExecutionService,
        private documentPopupService: DocumentPopupService,
        private titleService: TitleService,
    ) { }

    ngOnInit() {
        this.company = this.route.snapshot.paramMap.get('company');
        this.titleService.setTitle(this.route.snapshot.data.title);
        this.securityService.isSecurityReady().subscribe(() => {
            this.init();
        });
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    init() {
        this.initMenuAction();
    }

    initMenuAction() {
        this.gridContextualMenuActions = [
            {
                icon: 'arrow_downward',
                text: 'Download',
                action: this.menuActions.download,
            },
            {
                icon: 'edit',
                text: 'Edit',
                action: this.menuActions.edit,
            },
        ];
        if (this.listAndSearchComponent) {
            this.listAndSearchComponent.gridContextualMenuActions = this.gridContextualMenuActions;
            this.listAndSearchComponent.addMenuAction();
        }
    }

    initAdditionnalFilters() {
        const entity = this.route.snapshot.paramMap.get('entity');
        const recordId = this.route.snapshot.paramMap.get('recordId');
        let getRecord: Observable<string>;

        if (!entity || !recordId) {
            this.listAndSearchComponent.waitBeforeLoadingData = false;
            this.listAndSearchComponent.loadData();
            return;
        }

        let field;
        switch (entity) {
            case 'section':
                field = this.listAndSearchComponent.columnConfiguration
                    .find((column) => column.fieldName === 'Contract');
                getRecord = this.tradingService.getSection(Number(recordId), PricingMethods.Priced).pipe(
                    takeUntil(this.destroy$),
                    map((section: Section) => {
                        return section.contractLabel;
                    }));
                break;
            case 'charter':
                field = this.listAndSearchComponent.columnConfiguration
                    .find((column) => column.fieldName === 'Charter');
                getRecord = this.executionService.getCharterById(Number(recordId)).pipe(
                    takeUntil(this.destroy$),
                    map((charter: Charter) => {
                        return charter.charterCode;
                    }),
                );
                break;
            default:
                break;
        }
        if (!field || !this.listAndSearchComponent) {
            this.listAndSearchComponent.waitBeforeLoadingData = false;
            this.listAndSearchComponent.loadData();
            return;
        }

        getRecord.subscribe((record) => {
            if (!record) {
                this.listAndSearchComponent.waitBeforeLoadingData = false;
                this.listAndSearchComponent.loadData();
                return;
            }

            const filter = new ListAndSearchFilter();
            filter.fieldId = field.fieldId;
            filter.fieldName = field.fieldName;
            filter.predicate = {
                filterType: ListAndSearchFilterType.Text,
                operator: 'eq',
                value1: record,
            };
            filter.isActive = true;
            this.additionalFilters = [filter];
            this.listAndSearchComponent.waitBeforeLoadingData = false;
            this.listAndSearchComponent.additionalFilters = this.additionalFilters;
            this.listAndSearchComponent.loadData(true);
        });
    }

    onMenuActionClicked(data) {
        const action = data.action;
        const document: PhysicalDocument = data.rowData;
        switch (action) {
            case this.menuActions.download:
                this.documentService.getGeneratedDocumentContent(document.physicalDocumentId)
                    .pipe(
                        takeUntil(this.destroy$),
                    )
                    .subscribe((response: HttpResponse<Blob>) => {
                        this.downloadDocument(response);
                    });
                break;
            case this.menuActions.edit:
                this.editDocument(document);
                break;
            default: // throw Action not recognized exception
                break;
        }
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

    editDocument(document: PhysicalDocument) {
        const dialog = this.dialog.open(DocumentUploadDialogBoxComponent, {
            data: {
                title: 'Edit Document',
            },
        });
        dialog.componentInstance.isWorkInProgress = true;
        dialog.componentInstance.processMessage = 'Downloading document...';
        this.documentService.getGeneratedDocumentContent(document.physicalDocumentId)
            .pipe(
                finalize(() => {
                    dialog.componentInstance.processMessage = '';
                    dialog.componentInstance.isWorkInProgress = false;
                }),
                takeUntil(this.destroy$),
            )
            .subscribe((response: HttpResponse<Blob>) => {
                this.downloadDocument(response);
            });

        dialog.componentInstance.documentSelected
            .pipe(
                takeUntil(this.destroy$),
            )
            .subscribe((file: File) => {
                this.onFileSelected(dialog, document, file);
            });

        dialog.afterClosed()
            .pipe(
                takeUntil(this.destroy$),
            )
            .subscribe((answer) => {
            });
    }

    onFileSelected(dialog: MatDialogRef<DocumentUploadDialogBoxComponent>,
        originalDocument: PhysicalDocument,
        file: File) {
        dialog.componentInstance.isWorkInProgress = true;
        dialog.componentInstance.processMessage = 'Uploading document...';
        this.documentService.uploadDocument(
            originalDocument.recordId,
            originalDocument.physicalDocumentType,
            originalDocument.documentTemplate,
            true,
            file)
            .pipe(
                mergeMap((documentReference: PhysicalDocumentReference) => {
                    dialog.componentInstance.processMessage = 'Updating document...';
                    return this.documentService.updateDocument(originalDocument, documentReference.physicalDocumentId);
                }),
                finalize(() => {
                    dialog.componentInstance.processMessage = '';
                    dialog.componentInstance.isWorkInProgress = false;
                }),
                takeUntil(this.destroy$),
            )
            .subscribe(
                (documentReference: PhysicalDocumentReference) => {
                    dialog.close();
                    this.snackbarService.informationSnackBar('Document has been successfully updated.');
                    this.listAndSearchComponent.loadData();
                },
                (error: HttpErrorResponse) => {
                    dialog.componentInstance.errorMessage = this.documentPopupService.getErrorMessage(error, DocumentEntityTypes.Unknown);
                });
    }
}
