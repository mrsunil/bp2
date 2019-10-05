import { DatePipe, Location } from '@angular/common';
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import * as agGrid from 'ag-grid-community';
import * as _moment from 'moment';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { AgGridContextualSearchComponent } from '../../../../shared/components/ag-grid/contextual-search/ag-grid-contextual-search.component';
import { ConfirmationDialogComponent } from '../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { SectionSearchResult } from '../../../../shared/dtos/section-search-result';
import { AccountLineType } from '../../../../shared/entities/account-line-type.entity';
import { AccountingDocumentLine } from '../../../../shared/entities/accounting-document-line.entity';
import { AtlasAgGridParam } from '../../../../shared/entities/atlas-ag-grid-param.entity';
import { AtlasFormControl } from '../../../../shared/entities/atlas-form-control';
import { Charter } from '../../../../shared/entities/charter.entity';
import { CostType } from '../../../../shared/entities/cost-type.entity';
import { Counterparty } from '../../../../shared/entities/counterparty.entity';
import { Department } from '../../../../shared/entities/department.entity';
import { ListAndSearchFilter } from '../../../../shared/entities/list-and-search/list-and-search-filter.entity';
import { LockFunctionalContext } from '../../../../shared/entities/lock-functional-context.entity';
import { LockResourceInformation } from '../../../../shared/entities/lock-resource-information.entity';
import { MasterData } from '../../../../shared/entities/masterdata.entity';
import { NominalAccount } from '../../../../shared/entities/nominal-account.entity';
import { PostingManagement } from '../../../../shared/entities/posting-management.entity';
import { PostingManagementDisplayView } from '../../../../shared/models/posting-management-display-view';
import { CustomNumberMask } from '../../../../shared/numberMask';
import { AgGridService } from '../../../../shared/services/ag-grid.service';
import { CharterDataLoader } from '../../../../shared/services/execution/charter-data-loader';
import { FormConfigurationProviderService } from '../../../../shared/services/form-configuration-provider.service';
import { LockService } from '../../../../shared/services/http-services/lock.service';
import { PreaccountingService } from '../../../../shared/services/http-services/preaccounting.service';
import { TradeDataLoader } from '../../../../shared/services/list-and-search/trade-data-loader';
import { SnackbarService } from '../../../../shared/services/snackbar.service';
import { UrlManagementService } from '../../../../shared/services/url-management.service';
import { isDateTwoBeforeDateOne } from '../../../../shared/validators/date-validators.validator';
import { AccountingEditBaseComponent } from './../accounting-edit-base/accounting-edit-base.component';
import { PostingDocumentType } from '../../../../shared/enums/posting-document-type.enum';
import { FormConfigurationService } from '../../../../shared/services/http-services/form-configuration.service';
import { ItemConfigurationProperties } from '../../../../shared/entities/form-configuration.entity';

const moment = _moment;
@Component({
    selector: 'atlas-accounting-edit',
    templateUrl: './accounting-edit.component.html',
    styleUrls: ['./accounting-edit.component.scss'],
    providers: [CharterDataLoader, TradeDataLoader, DatePipe],
})

export class AccountingEditComponent extends AccountingEditBaseComponent implements OnInit, OnDestroy {

    valueDateFormCtrl = new AtlasFormControl('valueDateFormCtrl');
    docDateFormCtrl = new AtlasFormControl("docDateFormCtrl");
    dmsidFormCtrl = new AtlasFormControl('dmsidFormCtrl');
    company: string;
    accountingId: number;
    columnDefs: agGrid.ColDef[];
    agGridOptions: agGrid.GridOptions = {};
    agGridCols: agGrid.ColDef[];
    agGridApi: agGrid.GridApi;
    agGridColumnApi: agGrid.ColumnApi;
    filteredCounterpartyList: Counterparty[];
    filteredAccountLineType: AccountLineType[];
    filteredCharter: Charter[];
    filteredDepartments: Department[];
    filteredContracts: SectionSearchResult[];
    filteredCostTypes: CostType[];
    masterdata: MasterData;
    documentDate: string;
    originalValueDate: string;
    editDocumentFormGroup: FormGroup;
    glDate: string;
    currency: string;
    accountingPeriod: any;
    isNarrativeValid: boolean = true;
    documentDateFormat: Date;
    isCostCenterValid: boolean = true;
    isSave: boolean = false;
    isMtmSelecetd: boolean = false;
    documentRefData: PostingManagementDisplayView[];
    private getAccountinglinesSubscription: Subscription;
    accountingDocumentLine: AccountingDocumentLine[];
    filteredNominalAccountList: NominalAccount[];
    filteredAccountLineTypeForMtm: AccountLineType[] = [];
    accountingDocumentData: PostingManagement;
    mask = CustomNumberMask(12, 10, true);
    resourcesInformation: LockResourceInformation[] = new Array<LockResourceInformation>();
    accountCreationConfiguration: ItemConfigurationProperties[] = new Array<ItemConfigurationProperties>();

    atlasAgGridParam: AtlasAgGridParam;

    constructor(
        private route: ActivatedRoute,
        private preaccountingService: PreaccountingService,
        public charterDataLoader: CharterDataLoader,
        protected snackbarService: SnackbarService,
        protected formBuilder: FormBuilder,
        protected router: Router,
        private location: Location,
        public tradeDataLoader: TradeDataLoader,
        protected dialog: MatDialog,
        private datePipe: DatePipe,
        private urlManagementService: UrlManagementService,
        protected formConfigurationProvider: FormConfigurationProviderService,
        protected lockService: LockService,
        public gridService: AgGridService,
        private formConfigurationService: FormConfigurationService,
    ) { super(formConfigurationProvider); }

    ngOnInit() {
        this.formConfigurationService.getMandatoryFieldsConfigurationForFinancial().subscribe((templates) => {
            this.accountCreationConfiguration = templates.value;
        this.company = this.route.snapshot.paramMap.get('company');
        this.accountingId = Number(this.route.snapshot.paramMap.get('accountingId'));
        this.masterdata = this.route.snapshot.data.masterdata;
        this.filteredCounterpartyList = this.masterdata.counterparties;
        this.filteredAccountLineType = this.masterdata.accountLineTypes;
        this.filteredNominalAccountList = this.masterdata.nominalAccounts.filter(
            (nominal) => nominal.accountNumber = nominal.accountNumber);
        this.filteredDepartments = this.masterdata.departments;
        this.filteredCostTypes = this.masterdata.costTypes;
        if (this.filteredAccountLineType && this.filteredAccountLineType.length > 0) {
            this.filteredAccountLineType.forEach((account) => {
                if (account.accountLineTypeCode === 'L' || account.accountLineTypeCode == 'B') {
                    this.filteredAccountLineTypeForMtm.push(account);
                }
            });
        }
        const filterList: ListAndSearchFilter[] = [];
        this.tradeDataLoader.getData(filterList).subscribe((trade) => {
            this.filteredContracts = trade.value;
        });
        this.charterDataLoader.getData().subscribe((charter) => {
            this.filteredCharter = charter;
        });
        this.initView();
        this.getFormGroup();
        this.setValidation();
        this.disableControl();
        this.atlasAgGridParam = this.gridService.getAgGridParam();

       

        });
    }
    setValidation()
    {  
        if (this.isRequired('valueDate')) 
        {
            this.valueDateFormCtrl.setValidators(Validators.compose([Validators.required]));
        }
    }

    disableControl()
    {
        if (!this.isEditable('valueDate')) 
        {
            this.valueDateFormCtrl.disable();
        }     
    }

    initView() {

        this.subscriptions.push(this.lockService.lockAccountingDocument(this.accountingId, LockFunctionalContext.AccountingDocumentEdition)
            .subscribe(
                () => {
                    this.getAccountinglinesSubscription = this.preaccountingService.getAccoutingDocumentData(this.accountingId).pipe(
                        map((data) => {
                            this.documentRefData = data.value.map((docRef) => {
                                return new PostingManagementDisplayView(docRef);
                            });
                            if (this.documentRefData) {
                                this.accountingDocumentData = this.documentRefData[0];
                                if (this.accountingDocumentData.transactionDocumentTypeId === PostingDocumentType.TA && this.accountingDocumentData.taTypeId === 3) {
                                    this.isMtmSelecetd = true;
                                }
                                this.accountingDocumentLine = this.accountingDocumentData.accountingDocumentLines;
                                this.initializeGridColumns();
                                this.assignValuesToControl();
                                this.startLockRefresh(this.accountingId, this.accountingDocumentData.documentReference);
                            }

                        }))
                        .subscribe();
                },
                (err) => {
                    const confirmDialog = this.dialog.open(ConfirmationDialogComponent, {
                        data: {
                            title: 'Lock',
                            text: err.error.detail,
                            okButton: 'Got it',
                        },
                    });
                    this.router.navigate(['/' + this.urlManagementService.getCurrentCompanyId() + '/financial/accounting/entries']);
                }));

    }
    getFormGroup() {
        this.editDocumentFormGroup = this.formBuilder.group({
            valueDateFormCtrl: this.valueDateFormCtrl,
            dmsidFormCtrl: this.dmsidFormCtrl,
        });

        return super.getFormGroup();
    }
    initializeGridColumns() {
        this.columnDefs = [
            {
                headerName: 'Posting Number',
                field: 'postingLineNumber',
                colId: 'postingLineNumber',
                hide: false,
                editable: false,
            },
            {
                headerName: 'Nom. Account',
                field: 'accountReference',
                colId: 'accountReference',
                hide: false,
                editable: false,
                tooltip: (params) => this.getTooltip(
                    params, 'detailedDescription', 'accountNumber', this.filteredNominalAccountList),
            },
            {
                headerName: 'Cli. account',
                colId: 'clientAccountId',
                field: 'clientAccountId',
                valueFormatter: this.clientAccountTypeFormatter.bind(this),
                hide: false,
                editable: false,
                tooltip: (params) => this.getTooltip(params, 'description', 'counterpartyID', this.filteredCounterpartyList),
            },
            {
                headerName: 'Amount',
                colId: 'amount',
                field: 'amount',
                hide: false,
                type: 'numericColumn',
                valueFormatter: this.numberFormatter.bind(this),
                editable: false,
            },
            {
                headerName: 'Department',
                colId: 'departmentId',
                field: 'departmentId',
                valueFormatter: this.departmentCodeFormatter.bind(this),
                hide: false,
                editable:false,
                tooltip: (params) => this.getTooltip(params, 'description', 'departmentId', this.masterdata.departments),
            },
            {

                headerName: 'Cost types',
                colId: 'costTypeId',
                field: 'costTypeId',
                hide: false,
                valueFormatter: this.costTypesFormatter.bind(this),
                editable: false,
                tooltip: (params) => this.getTooltip(params, 'name', 'costTypeId', this.masterdata.costTypes),
            },
            {
                headerName: 'Contract Number',
                colId: 'sectionReference',
                field: 'sectionReference',
                hide: false,
                editable: false,
            },
            {
                headerName: 'Associated Acc.',
                colId: 'associatedAccountCode',
                field: 'associatedAccountCode',
                cellRendererFramework: AgGridContextualSearchComponent,
                cellRendererParams: (params) => {
                    return {
                        context: {
                            componentParent: this,
                            gridEditable: this.isEditable('associatedAccountId'),
                        },
                        gridId: 'counterpartiesGrid',
                        options: this.filteredCounterpartyList,
                        isRequired: this.isRequired('associatedAccountId'),
                        isEditable: this.isEditable('associatedAccountId'),
                        displayProperty: 'counterpartyCode',
                        codeProperty: 'counterpartyCode',
                        descriptionProperty: 'description',
                        valueProperty: 'counterpartyCode',
                        lightBoxTitle: 'Results for Counterparty',
                        showContextualSearchIcon: this.isEditable('associatedAccountId'),
                    };
                },
                onCellValueChanged: this.onAssociatedAccountSelected.bind(this),
                tooltip: (params) => this.getTooltip(params, 'description', 'counterpartyCode', this.filteredCounterpartyList),
            },
            {
                headerName: 'Acc. L. Type',
                colId: 'accountLineTypeId',
                field: 'accountLineTypeId',
                cellRendererFramework: AgGridContextualSearchComponent,
                cellRendererParams: (params) => {
                    return {
                        context: {
                            componentParent: this,
                            gridEditable: (this.isMtmSelecetd) ? false : this.isEditable('accountLineTypeId'),
                        },
                        gridId: 'accountLineTypeGrid',
                        options: (this.isMtmSelecetd) ? this.filteredAccountLineTypeForMtm : this.filteredAccountLineType,
                        isRequired: this.isRequired('accountLineTypeId'),
                        isEditable: (this.isMtmSelecetd) ? false : this.isEditable('accountLineTypeId'),
                        displayProperty: 'accountLineTypeCode',
                        descriptionProperty: 'description',
                        codeProperty: 'accountLineTypeCode',
                        valueProperty: 'accountLineTypeId',
                        lightBoxTitle: 'Results for  Account Line Type',
                        showContextualSearchIcon: (this.isMtmSelecetd) ? false : this.isEditable('accountLineTypeId'),
                        filterContextualSearchFunction: this.filterAccountLineTypes.bind(this),
                    };
                },
                onCellValueChanged: (params) => { },
                tooltip: (params) => this.getTooltip(params, 'description', 'accountLineTypeId', this.filteredAccountLineType),
            },
            {
                headerName: 'Charter',
                colId: 'charterId',
                field: 'charterId',
                cellRendererFramework: AgGridContextualSearchComponent,
                cellRendererParams: (params) => {
                    return {
                        context: {
                            componentParent: this,
                            gridEditable: this.isEditable('charterId'),
                        },
                        gridId: 'charterGrid',
                        colId: 'charterId',
                        isEditable: this.isEditable('charterId'),
                        isRequired: this.isRequired('charterId'),
                        displayProperty: 'charterCode',
                        descriptionProperty: 'description',
                        valueProperty: 'charterId',
                        codeProperty: 'charterCode',
                        lightBoxTitle: 'Results for Charters',
                        dataLoader: this.charterDataLoader,
                        options: this.filteredCharter,
                        showContextualSearchIcon: this.isEditable('charterId'),
                    };
                },
                onCellValueChanged: this.onCharterSelected.bind(this),
                tooltip: (params) => this.getTooltip(params, 'description', 'charterId', this.filteredCharter),
            },
            {
                headerName: 'Narrative',
                colId: 'narrative',
                field: 'narrative',
                onCellValueChanged: this.onNarrativeValueChanged.bind(this),
                hide: false,
                editable: this.isEditable('narrative'),
                cellRenderer: this.requiredCell.bind(this),

            },
            {
                headerName: 'CC-1',
                colId: 'costCenter',
                field: 'costCenter',
                hide: false,
                onCellValueChanged: this.onCostCenterValueChanged.bind(this),
                cellRenderer: this.requiredCell.bind(this),
                editable: this.isEditable('costCenter'),

            },
        ];

    }
    onGridReady(params) {
        this.agGridOptions = params;
        this.agGridOptions.columnDefs = this.agGridCols;
        this.agGridApi = this.agGridOptions.api;
        this.agGridColumnApi = this.agGridOptions.columnApi;
        this.agGridColumnApi.autoSizeAllColumns();
    }

    processCellForClipboard(params) {
        if (!params.value || !params.column.colDef.cellRendererParams) {
            return params.value;
        }
        let value = params.value;
        const cellRenderedParams = params.column.colDef.cellRendererParams(null);
        const object = cellRenderedParams.valueProperty ? cellRenderedParams.options
            .find((option) => option[cellRenderedParams.valueProperty] === value) : null;
        value = typeof value !== 'string' && cellRenderedParams.displayProperty ? value[cellRenderedParams.displayProperty] : value;
        if (object && cellRenderedParams.displayCode && cellRenderedParams.codeProperty) {
            return object[cellRenderedParams.codeProperty];
        }
        return cellRenderedParams.displayProperty && object ? object[cellRenderedParams.displayProperty] : value;
    }

    accountLineValueFormatter(params) {
        if (params.value && typeof params.value !== 'string') {
            const value: string = this.filteredAccountLineType.find(
                (accountLine) => accountLine.accountLineTypeId === params.value).accountLineTypeCode;
            params.value = value;
        }
        return params.value;
    }

    onCharterSelected(params) {
        if (params.newValue && params.oldValue !== params.newValue) {
            const selectedCharter = this.filteredCharter.filter(
                (charter) => charter.charterCode.toUpperCase() === params.newValue.toUpperCase(),
            );
            if (selectedCharter.length === 0) {
                this.snackbarService.throwErrorSnackBar('Not allowed : It is not an existing charter');
                params.node.setDataValue('charterId', '');
            }
        }
    }

    onAssociatedAccountSelected(params) {
        {
            if (params.newValue && params.oldValue !== params.newValue) {
                const selectedClientAccount = this.filteredCounterpartyList.filter(
                    (clientAccount) => clientAccount.counterpartyCode.toUpperCase() === params.newValue.toUpperCase(),
                );
                if (selectedClientAccount.length === 0) {
                    this.snackbarService.throwErrorSnackBar('Not allowed : ' + 'Value does not exist');
                    params.node.setDataValue('associatedAccountCode', '');
                }
            }
        }
    }

    filterAccountLineTypes(value: any, options: any[], rowData: any): any[] {
        let accountLineTypeList = [];
        accountLineTypeList = options;
        if (rowData.accountReferenceId && typeof rowData.accountReferenceId === 'string') {
            const nominalAccountSelected = this.filteredNominalAccountList.find(
                (nominalAccount) => nominalAccount.accountNumber.toUpperCase()
                    === rowData.accountReferenceId.toUpperCase());

            if (nominalAccountSelected && nominalAccountSelected.clientAccountMandatory === 1) {

                accountLineTypeList = options.filter((accountType) =>
                    accountType.description === 'Customer' || accountType.description === 'Vendor');
            }
        }

        options = accountLineTypeList;
        return this.filterAccountLineTypesOnEdit(options, rowData);
    }

    filterAccountLineTypesOnEdit(options: any[], rowData: any): any[] {
        let accountLineTypeList = [];
        accountLineTypeList = options;
        if (rowData.accountReference && typeof rowData.accountReference === 'string') {
            const nominalAccountSelected = this.filteredNominalAccountList.find(
                (nominalAccount) => nominalAccount.accountNumber.toUpperCase()
                    === rowData.accountReference.toUpperCase());

            if (nominalAccountSelected) {
                if (this.isMtmSelecetd) {
                    if (nominalAccountSelected && nominalAccountSelected.clientAccountMandatory === 1) {
                        accountLineTypeList = options.filter((accountType) =>
                            accountType.description === 'Bank');
                    }
                    else {
                        accountLineTypeList = options.filter((accountType) =>
                            accountType.description === 'Ledger');
                    }
                }

            }
            else {
                if (nominalAccountSelected && nominalAccountSelected.clientAccountMandatory === 1) {

                    accountLineTypeList = options.filter((accountType) =>
                        accountType.description === 'Customer' || accountType.description === 'Vendor');
                }
            }
        }
        options = accountLineTypeList;
        return options;
    }

    departmentCodeFormatter(params) {
        if (params.value) {
            const departement = this.filteredDepartments.find((x) => x.departmentId === params.value);
            return departement ? departement.departmentCode : '';
        } else { return ''; }
    }

    costTypesFormatter(params) {
        if (params.value) {
            const costType = this.filteredCostTypes.find((x) => x.costTypeId === params.value);
            return costType ? costType.costTypeCode : '';
        } else { return ''; }
    }

    clientAccountTypeFormatter(params) {
        if (params.value) {
            const counterparty = this.filteredCounterpartyList.find((x) => x.counterpartyID === params.value);
            return counterparty ? counterparty.counterpartyCode : '';
        } else { return ''; }
    }

    onNarrativeValueChanged(params) {
        this.isNarrativeValid = true;
        if (params.newValue && params.oldValue !== params.newValue && params.newValue.length > 130) {
            this.isNarrativeValid = false;
            this.snackbarService.throwErrorSnackBar('Length of narrative can not be more than 130 chars');
        }
    }


    onCostCenterValueChanged(params) {
        this.isCostCenterValid = true;
        if (params.newValue && params.oldValue !== params.newValue && params.newValue.length > 10) {
            this.isCostCenterValid = false;
            this.snackbarService.throwErrorSnackBar('Length of CC-1 can not be more than 10 chars');
        }
    }

    submitForm() {
        this.isSave = true;
        this.agGridApi.stopEditing();
        if (this.editDocumentFormGroup.valid) {
            const errorMessage = this.validateGridData();
            if (errorMessage === '') {
                this.getGridData();
                this.accountingDocumentData.valueDate = this.valueDateFormCtrl.value;
                this.accountingDocumentData.dmsId = this.dmsidFormCtrl.value;
                this.accountingDocumentData.accountingDocumentLines.forEach((accountLine) => {
                    accountLine.postingLineId = accountLine.postingLineNumber;
                })
                this.preaccountingService
                    .updateAccoutingDocuments(this.accountingDocumentData, false)
                    .subscribe(
                        (data) => {
                            this.snackbarService.informationSnackBar('Accounting Document updated');
                            this.router.navigate(['/' + this.urlManagementService.getCurrentCompanyId() + '/financial/accounting/entries']);
                        },
                        (error) => {
                            console.error(error);
                        });

            } else { this.snackbarService.throwErrorSnackBar(errorMessage); }
        } else {
            this.snackbarService.throwErrorSnackBar('Form is invalid. Please resolve the errors.');
        }
    }

    // Validate Grid Data of each row
    validateGridData(): string {
        let isRowDataValid: Boolean = false;
        if (!this.isNarrativeValid || !this.isCostCenterValid) {
            return 'Grid data is invalid. Please resolve the errors.';
        }
        else
        {
            let errorMessage = '';
            this.agGridApi.forEachNode((rowData) => {
                if (!isRowDataValid)
                {
                    let item = this.getRequiredColumn();
                    item.forEach((column) => {
                        if (!isRowDataValid) {
                            isRowDataValid = this.validateEmpty(column.id, rowData);
                        }
                    });
                    if (isRowDataValid) {
                        errorMessage = 'Grid data is invalid. Please resolve the errors.';                
                    }
                }
            });
            return errorMessage;
        }
    }

    // Find Required Column As defined in DB
    getRequiredColumn() {        
        return this.accountCreationConfiguration.filter((x) => x.isEditable);
    }

    // Method to validate empty of null record
    validateEmpty(colId: string, rowData: any) {
        let fieldNotRequiredValidation = ["valueDate","accountingPeriod","paymentDocumentDate",'accuralNumber' ];
        let inValidRow : boolean = false;
        if (this.isRequired(colId)) {
            if(colId == 'associatedAccountId')
            {
                colId = 'associatedAccountCode';
            }
            if (fieldNotRequiredValidation.includes(colId) || 
               (rowData.data[colId] && 
               rowData.data[colId].toString().trim() !='' && 
               rowData.data[colId].toString().trim() !== 'Required*')) {
                inValidRow = false;
            } 
            else
            {
                inValidRow = true; 
            }                    
        }        
        return inValidRow;
    }

    // Find Grid Record
    getGridData() {
        this.accountingDocumentData.accountingDocumentLines.forEach((accountingLineElement) => {

            accountingLineElement.associatedAccountId = (accountingLineElement.associatedAccountCode === null ||
                accountingLineElement.associatedAccountCode.trim() === '') ? null :
                this.filteredCounterpartyList.find((client) =>
                    client.counterpartyCode.toUpperCase() === accountingLineElement.associatedAccountCode.toUpperCase()).counterpartyID;

            if (typeof accountingLineElement.accountLineTypeId === 'string'
                && String(accountingLineElement.accountLineTypeId).length === 1) {
                const accountLineTypeId = String(accountingLineElement.accountLineTypeId);
                accountingLineElement.accountLineTypeId = (accountLineTypeId === null ||
                    accountLineTypeId.trim() === '') ? null :
                    this.filteredAccountLineType.find((accountType) =>
                        accountType.accountLineTypeCode.toUpperCase() === accountLineTypeId.toUpperCase()).accountLineTypeId;
            } else if (typeof accountingLineElement.accountLineTypeId === 'string') {
                const accountLineTypeId = String(accountingLineElement.accountLineTypeId);
                accountingLineElement.accountLineTypeId = (accountLineTypeId === null ||
                    accountLineTypeId.trim() === '') ? null :
                    this.filteredAccountLineType.find((accountType) =>
                        accountType.description.toUpperCase() === accountLineTypeId.toUpperCase()).accountLineTypeId;
            }

            if (typeof accountingLineElement.charterId === 'string') {
                const charterAssigned = String(accountingLineElement.charterId);
                accountingLineElement.charterId = (charterAssigned === null ||
                    charterAssigned.trim() === '') ? null :
                    this.filteredCharter.find((charter) =>
                        charter.charterCode.toUpperCase() === charterAssigned.toUpperCase()).charterId;

            }
            accountingLineElement.accountReferenceId = (accountingLineElement.accountReference === null ||
                accountingLineElement.accountReference.trim() === '') ? null :
                this.filteredNominalAccountList.find((nominal) =>
                    nominal.accountNumber.toUpperCase() === accountingLineElement.accountReference.toUpperCase()).nominalAccountId;

            accountingLineElement.sectionId = (accountingLineElement.sectionReference === null ||
                accountingLineElement.sectionReference.trim() === '') ? null :
                this.filteredContracts.find((contract) =>
                    contract.contractLabel.toUpperCase() === accountingLineElement.sectionReference.toUpperCase()).sectionId;

        });

    }

    onLoadPreviousPageButtonClicked() {
        this.isSave = true;
        this.location.back();
    }

    onCancelButtonClicked() {
        this.isSave = true;
        const confirmDiscardDialog = this.dialog.open(ConfirmationDialogComponent, {
            data: {
                title: 'Discard Changes',
                text: 'You have some modification pending. Close and lose changes?',
                okButton: 'Ok',
                cancelButton: 'Cancel',
            },
        });
        confirmDiscardDialog.afterClosed().subscribe((answer) => {
            if (answer) {
                this.router.navigate(['/' + this.urlManagementService.getCurrentCompanyId() + '/financial/edit/document/summary']);
            }
        });
    }
    assignValuesToControl() {
        this.documentDate = this.accountingDocumentData.documentDate ?
            this.datePipe.transform(this.accountingDocumentData.documentDate, 'dd/MM/yyyy').toString().toUpperCase() : null;
        this.originalValueDate = this.accountingDocumentData.originalValueDate ?
            this.datePipe.transform(this.accountingDocumentData.originalValueDate, 'dd/MM/yyyy').toString().toUpperCase() : null;
        this.glDate = this.accountingDocumentData.glDate ?
            this.datePipe.transform(this.accountingDocumentData.glDate, 'dd/MM/yyyy').toString().toUpperCase() : null;
        this.accountingPeriod = this.accountingDocumentData.accountingPeriod ?
            this.datePipe.transform(this.accountingDocumentData.accountingPeriod, 'MMM yyyy').toString().toUpperCase() : null;
        this.currency = this.accountingDocumentData.currencyCode;
        this.valueDateFormCtrl.patchValue(this.accountingDocumentData.valueDate);
        this.dmsidFormCtrl.patchValue(this.accountingDocumentData.dmsId);
        this.initializeGridColumns();

    }

    startLockRefresh(accountingId: number, documentReference: string) {
        this.resourcesInformation = new Array<LockResourceInformation>();
        const resourceInformation = new LockResourceInformation();
        resourceInformation.resourceType = 'Accounting Document';
        resourceInformation.resourceId = accountingId;
        resourceInformation.resourceCode = documentReference;
        resourceInformation.needRefresh = true;
        this.resourcesInformation.push(resourceInformation);
    }

    stopLockRefresh() {
        this.resourcesInformation = new Array<LockResourceInformation>();
    }

    @HostListener('window:beforeunload', ['$event']) unloadNotification($event: any) {
        if (this.editDocumentFormGroup.dirty) {
            $event.returnValue = true;
        }
        this.agGridApi.forEachNode((rowData) => {
            if (rowData.data.isDirty) {
                $event.returnValue = true;
            }
        });
    }

    canDeactivate() {
        if (this.editDocumentFormGroup.dirty && this.isSave === false) {
            return window.confirm('Leave an unsave form? \nYour changes won\'t be applied!');
        }
        this.agGridApi.forEachNode((rowData) => {
            if (rowData.data.isDirty) {
                return window.confirm('Leave an unsave form? \nYour changes won\'t be applied!');
            }
        });
        return true;
    }

    ngOnDestroy(): void {
        this.stopLockRefresh();
        this.subscriptions.push(this.lockService.unlockAccountingDocument(
            this.accountingId, LockFunctionalContext.AccountingDocumentEdition)
            .subscribe(() => {
                this.subscriptions.forEach((subscription: Subscription) => {
                    subscription.unsubscribe();
                });
            }));
    }

    //Format Amount in 2 decimal
    numberFormatter(params) {
        if (isNaN(params.value) || params.value === null) { return ''; }
        return new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(params.value);
    }

    isValueDateBeforeDocumentDate() {
        if (this.documentDate && this.valueDateFormCtrl.value) {
            this.documentDateFormat = moment(this.documentDate).toDate();
            const result = isDateTwoBeforeDateOne(this.accountingDocumentData.documentDate, this.valueDateFormCtrl.value);
            if (result) {
                return result;
            }
        }
    }

    // To Validate if Field is Editable
    isEditable(params: string): boolean {
        if (this.accountCreationConfiguration.length > 0) {
            const result = this.accountCreationConfiguration[this.accountCreationConfiguration.findIndex((x) => x.id === params)];
            if(result.isEditable)
            {
                return result.isEditable;
            }   
        }
        return false;
    }

    // To Validate if Field is required
    isRequired(params: string): boolean {
        if (this.accountCreationConfiguration.length > 0) {
            const result = this.accountCreationConfiguration[this.accountCreationConfiguration.findIndex((x) => x.id === params)];
            if(result)
            {
                return result.isMandatory;
            }           
        }
        return false;
    }

    //Apply CSS if Field is required.
    requiredCell(params) {
        if (!params.value || params.value === '' ) {           
            if (this.isRequired(params.colDef.colId)) {
                return '<div class=\'document-cell-value-required\'>Required*</div>';
            }
        }
        return params.value;
    }
}
