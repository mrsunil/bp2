import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import * as agGrid from 'ag-grid-community';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { AccountingEntriesSearchResult } from '../../../../../shared/dtos/accountingEntries-search-result';
import { DocumentReferenceSearchResult } from '../../../../../shared/dtos/list-and-search/document-reference-search-result';
import { AtlasAgGridParam } from '../../../../../shared/entities/atlas-ag-grid-param.entity';
import { AtlasFormControl } from '../../../../../shared/entities/atlas-form-control';
import { ReversalAccountingDocument } from '../../../../../shared/entities/reversal-accounting-document.entity';
import { ReversalDocumentDisplayView } from '../../../../../shared/models/reversal-document-display-view';
import { TransactionDetailDisplayView } from '../../../../../shared/models/transaction-detail-display-view';
import { AgGridService } from '../../../../../shared/services/ag-grid.service';
import { FormConfigurationProviderService } from '../../../../../shared/services/form-configuration-provider.service';
import { PreaccountingService } from '../../../../../shared/services/http-services/preaccounting.service';
import { AllDocumentReferenceDataLoader } from '../../../../../shared/services/preaccounting/all-document-reference-data-loader';
import { SnackbarService } from '../../../../../shared/services/snackbar.service';
import { UiService } from '../../../../../shared/services/ui.service';
import { UrlManagementService } from '../../../../../shared/services/url-management.service';
import { UtilService } from '../../../../../shared/services/util.service';
import { MasterData } from './../../../../../shared/entities/masterdata.entity';
import { TitleService } from './../../../../../shared/services/title.service';
import { AccountingEditBaseComponent } from './../../accounting-edit-base/accounting-edit-base.component';
import { FinancialsEditDocumentDataLoader } from './../../../../../shared/services/list-and-search/financials-edit-document-data-loader';
import { ListAndSearchFilter } from './../../../../../shared/entities/list-and-search/list-and-search-filter.entity';
import { ListAndSearchComponent } from './../../../../../shared/components/list-and-search/list-and-search.component';
import { ColumnConfigurationProperties } from './../../../../../shared/entities/grid-column-configuration.entity';
@Component({
    selector: 'atlas-accounting-edit-summary',
    templateUrl: './accounting-edit-summary.component.html',
    styleUrls: ['./accounting-edit-summary.component.scss'],
    providers: [AllDocumentReferenceDataLoader, FinancialsEditDocumentDataLoader],
})
export class AccountingEditSummaryComponent extends AccountingEditBaseComponent implements OnInit {
    @ViewChild('listAndSearchComponent') listAndSearchComponent: ListAndSearchComponent;
    reverseDocumentGridCols: agGrid.ColDef[];
    agGridOptions: agGrid.GridOptions = {};
    agGridCols: agGrid.ColDef[];
    agGridApi: agGrid.GridApi;
    agGridColumnApi: agGrid.ColumnApi;
    company: string;
    filteredDocumentReferences: DocumentReferenceSearchResult[];
    allDocumentReferences: DocumentReferenceSearchResult[];
    searchTerm: string;
    searchForm: FormGroup;
    accountingId: number;
    accountingDocumentLine: AccountingEntriesSearchResult[];
    documentRefData: ReversalDocumentDisplayView[];
    accountingDocumentData: ReversalAccountingDocument;
    documentCtrl = new AtlasFormControl('documentCtrl');
    editDocumentFormGroup: FormGroup;
    private getAccountingLinesByDocumentIdSubscription: Subscription;
    private getTransactionDetailSunscription: Subscription;
    transactionData: TransactionDetailDisplayView[];
    transactionDocumentId: number;
    documentReference: string;
    transactionDocumentTypeId: number;
    disableButton: boolean = true;
    subscription: Subscription[] = [];
    isEditDisable: boolean = true;
    isSave: boolean = false;
    masterdata: MasterData;
    filterList: ListAndSearchFilter[] = [];
    gridCode = 'accountingLineByIdGrid';

    atlasAgGridParam: AtlasAgGridParam;

    constructor(private route: ActivatedRoute,
        private router: Router,
        protected utilService: UtilService,
        public documentReferenceDataLoader: AllDocumentReferenceDataLoader,
        private formBuilder: FormBuilder,
        private snackbarService: SnackbarService,
        private preaccountingService: PreaccountingService,
        private uiService: UiService,
        private urlManagementService: UrlManagementService,
        protected formConfigurationProvider: FormConfigurationProviderService,
        protected dialog: MatDialog,
        public gridService: AgGridService,
        private titleService: TitleService,
        public financialsEditDocumentDataLoader: FinancialsEditDocumentDataLoader,
    ) {
        super(formConfigurationProvider);
        this.searchForm = this.formBuilder.group({
            searchReferenceCtrl: ['', Validators.required],
        });
        this.atlasAgGridParam = this.gridService.getAgGridParam();

    }

    ngOnInit() {
        this.company = this.route.snapshot.paramMap.get('company');
        this.masterdata = this.route.snapshot.data.masterdata;
        this.titleService.setTitle(this.route.snapshot.data.title);
        this.documentReferenceDataLoader.getData().subscribe((documents) => {
            this.filteredDocumentReferences = documents;
            this.allDocumentReferences = documents;
        });

        this.documentCtrl.valueChanges.subscribe((input) => {
            this.filteredDocumentReferences = this.utilService.filterListforAutocomplete(
                input,
                this.allDocumentReferences,
                ['documentReference'],
            );
        });

        this.getFormGroup();
    }

    getFormGroup() {
        this.editDocumentFormGroup = this.formBuilder.group({
            documentCtrl: this.documentCtrl,
        });
        return super.getFormGroup();
    }

    onGridReady(params) {
        this.agGridOptions.columnDefs = this.reverseDocumentGridCols;
        this.agGridApi = this.agGridOptions.api;
        this.agGridColumnApi = this.agGridOptions.columnApi;
        this.gridService.sizeColumns(this.agGridOptions);
        this.agGridApi.setRowData([]);
    }

    displayNotFoundError() {
        this.agGridApi.setRowData([]);
        this.accountingId = null;
        this.documentReference = null;
        this.accountingDocumentLine = [];
        this.snackbarService.throwErrorSnackBar('Document reference not existing');
    }

    OnChangeValue(refrerence) {
        this.searchTerm = this.documentCtrl.value;
        if (this.filteredDocumentReferences && this.searchTerm) {
            if (typeof this.searchTerm === 'object') {
                this.accountingId = this.documentCtrl.value.accountingId;
                this.documentReference = this.documentCtrl.value.documentReference;
            } else {
                const documentSelected = this.filteredDocumentReferences.filter((searchData) =>
                    searchData.documentReference.toUpperCase() === this.searchTerm.toUpperCase());

                if (documentSelected.length === 0) {
                    this.displayNotFoundError();
                } else {
                    this.accountingId = documentSelected[0].accountingId;
                    this.documentReference = documentSelected[0].documentReference;
                }
            }
        }

        if (this.accountingId) {
            this.getTransactionDetailSunscription = this.preaccountingService.getTransactionDetail(this.accountingId).pipe(
                map((data) => {

                    this.transactionData = data.value.map((transactionData) => {
                        return new TransactionDetailDisplayView(transactionData);
                    });
                    if (this.transactionData) {
                        this.transactionDocumentId = this.transactionData[0].transactionDocumentId;
                        this.transactionDocumentTypeId = this.transactionData[0].transactionDocumentTypeId;
                    }
                }))
                .subscribe();

            this.financialsEditDocumentDataLoader.getData(this.filterList, this.accountingId).subscribe((document) => {
                if (document) {
                    this.listAndSearchComponent.agGridRows = document.value;
                }
            });
        }
    }

    ngOnDestroy(): void {
        if (this.getTransactionDetailSunscription) {
            this.getTransactionDetailSunscription.unsubscribe();
        }
        if (this.getAccountingLinesByDocumentIdSubscription) {
            this.getAccountingLinesByDocumentIdSubscription.unsubscribe();
        }
    }

    valueChanged(value) {
        this.documentCtrl.patchValue(value);
        this.isEditDisable = false;
        this.OnChangeValue(value);
    }
    onEditClicked() {
        this.isSave = true;
        this.router.navigate(['/' + this.urlManagementService.getCurrentCompanyId() + '/financial/edit/document/' + this.accountingId]);
    }

    onCancelButtonClicked() {
        this.isSave = true;
        this.router.navigate(['/' + this.urlManagementService.getCurrentCompanyId() + '/financial/accounting/entries/']);
    }

    @HostListener('window:beforeunload', ['$event']) unloadNotification($event: any) {
        if (this.editDocumentFormGroup.dirty) {
            $event.returnValue = true;
        }
    }

    canDeactivate() {
        if (this.editDocumentFormGroup.dirty && this.isSave === false) {
            return window.confirm('Leave an unsave form? \nYour changes won\'t be applied!');
        }
        return true;
    }

    numberFormatter(params) {
        if (isNaN(params.value) || params.value === null) { return ''; }
        return new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(params.value);
    }
}
