import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import * as agGrid from 'ag-grid-community';
import { AuthorizationService } from '../../../../../../../core/services/authorization.service';
import { AgContextualMenuComponent } from '../../../../../../../shared/components/ag-contextual-menu/ag-contextual-menu.component';
import { AgGridCheckboxComponent } from '../../../../../../../shared/components/ag-grid-checkbox/ag-grid-checkbox.component';
import { AgGridUserPreferencesComponent } from '../../../../../../../shared/components/ag-grid-user-preferences/ag-grid-user-preferences.component';
import { AgGridAutocompleteComponent } from '../../../../../../../shared/components/ag-grid/autocomplete/ag-grid-autocomplete.component';
import { AgGridContextualSearchComponent } from '../../../../../../../shared/components/ag-grid/contextual-search/ag-grid-contextual-search.component';
import { BaseFormComponent } from '../../../../../../../shared/components/base-form-component/base-form-component.component';
import { CellEditorNumericComponent } from '../../../../../../../shared/components/cell-editor-numeric/cell-editor-numeric.component';
import { CellEditorSelectComponent } from '../../../../../../../shared/components/cell-editor-select/cell-editor-select.component';
import { ConfirmationDialogComponent } from '../../../../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { AgContextualMenuAction } from '../../../../../../../shared/entities/ag-contextual-menu-action.entity';
import { AtlasAgGridParam } from '../../../../../../../shared/entities/atlas-ag-grid-param.entity';
import { BulkCost } from '../../../../../../../shared/entities/bulk-edit-cost.entity';
import { CostDirection } from '../../../../../../../shared/entities/cost-direction.entity';
import { MasterData } from '../../../../../../../shared/entities/masterdata.entity';
import { RateType } from '../../../../../../../shared/entities/rate-type.entity';
import { CostDirections } from '../../../../../../../shared/enums/cost-direction.enum';
import { RateTypes } from '../../../../../../../shared/enums/rate-type.enum';
import { CustomNumberMask } from '../../../../../../../shared/numberMask';
import { AgGridService } from '../../../../../../../shared/services/ag-grid.service';
import { FormConfigurationProviderService } from '../../../../../../../shared/services/form-configuration-provider.service';
import { MasterdataService } from '../../../../../../../shared/services/http-services/masterdata.service';
import { TradingService } from '../../../../../../../shared/services/http-services/trading.service';
import { SecurityService } from '../../../../../../../shared/services/security.service';
import { SnackbarService } from '../../../../../../../shared/services/snackbar.service';

@Component({
    selector: 'atlas-edit-costs',
    templateUrl: './edit-costs.component.html',
    styleUrls: ['./edit-costs.component.scss'],
})
export class EditCostsComponent extends BaseFormComponent implements OnInit {

    costsBulkEditMenuActions: { [key: string]: string } = {
        deleteCost: 'delete',
    };

    gridComponents = {
        atlasSelect: CellEditorSelectComponent,
        atlasNumeric: CellEditorNumericComponent,
        atlasCheckbox: AgGridCheckboxComponent,
    };
    @Input() noActPrivilege: boolean;
    @Input() pnlPrivilege: boolean;
    @ViewChild('userPreferences') userPreferencesComponent: AgGridUserPreferencesComponent;
    costContractGridOptions: agGrid.GridOptions = {};
    atlasAgGridParam: AtlasAgGridParam;
    costContractGridColumns: agGrid.ColDef[];
    gridApi: agGrid.GridApi;
    gridColumnApi: agGrid.ColumnApi;
    isLoading: boolean;
    componentId: string = 'EditCostsGrid';
    company: string;
    masterdata: MasterData;
    rateTypes: RateType[];
    costDirections: CostDirection[];
    costEditBulkUpdateGridContextualMenuActions: AgContextualMenuAction[];
    hasGridSharing: boolean = false;
    costContractGridRows: BulkCost[];
    costsToSummary: BulkCost[] = [];
    updatedCostsToSummary: BulkCost[] = [];
    existingCosts: BulkCost[] = [];
    dataVersionId: number;
    costsToDelete: BulkCost[] = [];
    costsDeletePrivilege: boolean;

    gridContext = {
        gridEditable: true,
        componentParent: this,
        editPrivileges: true,
        deletePrivileges: this.costsDeletePrivilege,
        inPNLPrivileges: true,
    };

    constructor(protected masterDataService: MasterdataService,
        private route: ActivatedRoute,
        protected formBuilder: FormBuilder,
        protected formConfigurationProvider: FormConfigurationProviderService,
        protected tradingService: TradingService,
        private snackbarService: SnackbarService,
        protected dialog: MatDialog,
        private authorizationService: AuthorizationService,
        private securityService: SecurityService,
        public gridService: AgGridService) {
        super(formConfigurationProvider);
    }

    ngOnInit() {
        this.masterdata = this.route.snapshot.data.masterdata;
        this.atlasAgGridParam = this.gridService.getAgGridParam();
        this.company = this.route.snapshot.paramMap.get('company');
        this.securityService.isSecurityReady().subscribe(() => {
            if (this.authorizationService.isPrivilegeAllowed(this.company, 'Trades')
                && this.authorizationService.isPrivilegeAllowed(this.company, 'CostTab')) {
                this.costsDeletePrivilege = this.authorizationService.isPrivilegeAllowed(this.company, 'COSTSDEL');
            }
        });
        this.init();
        this.rateTypes = [
            {
                code: RateTypes[RateTypes.Rate],
                description: '',
            },
            {
                code: RateTypes[RateTypes.Amount],
                description: '',
            },
            {
                code: RateTypes[RateTypes.Percent],
                description: '',
            },
        ];

        this.costDirections = [
            {
                costDirectionId: CostDirections.Payable,
                costDirection: 'Pay',
            },
            {
                costDirectionId: CostDirections.Receivable,
                costDirection: 'Receive',
            },
        ];

        this.initializeGridColumns();
    }

    isGridEditable(params): boolean {
        // edit based on invoice percent
        if (params.data.invoicePercent === 100) {
            params.data.fullyInvoiced = false;
            return params.data.fullyInvoiced;
        } else {
            params.data.fullyInvoiced = true;
            return params.data.fullyInvoiced;
        }
    }

    init() {
        this.costEditBulkUpdateGridContextualMenuActions = [
            {
                icon: 'delete',
                text: 'Delete',
                action: this.costsBulkEditMenuActions.deleteCost,
                disabled: (!this.costsDeletePrivilege),
            },
        ];
    }

    onGridReady(params) {
        this.gridApi = params.api;
        params.columnDefs = this.costContractGridColumns;
        this.costContractGridOptions = params;
        this.gridColumnApi = params.columnApi;

        this.gridService.sizeColumns(this.costContractGridOptions);

        window.onresize = () => {
            this.gridService.sizeColumns(this.costContractGridOptions);
        };

        this.gridApi.showNoRowsOverlay();
    }

    isCostInvoicedRowStyle(node) {
        if (node.data.invoicePercent === 100) {
            return { background: 'rgba(199, 194, 196, 0.5)', color: '#928D8F' };
        }
    }

    initializeGridColumns() {
        this.costContractGridOptions = {
            context: this.gridContext,
            getRowStyle: this.isCostInvoicedRowStyle.bind(this),
        };
        this.costContractGridColumns = [
            {
                headerName: 'Status',
                colId: 'rowStatus',
                field: 'rowStatus',
                width: 110,
                minWidth: 110,
                maxWidth: 110,
                cellRenderer: (params) => {
                    if (params.value) {
                        return '<mat-chip-list><mat-chip class="status-flag-chip">' + params.value + '</mat-chip></mat-chip-list>';
                    }
                    return '';
                },
                pinned: 'left',
                sort: 'desc',
            },
            {
                headerName: 'Contract Reference',
                field: 'contractReference',
                colId: 'contractReference',
                hide: false,
                editable: false,
                pinned: 'left',
            },
            {
                headerName: 'Cost type*',
                field: 'costTypeCode',
                colId: 'costTypeCode',
                cellRendererFramework: AgGridAutocompleteComponent,
                cellRendererParams: (params) => {
                    return {
                        context: {
                            componentParent: this,
                            gridEditable: this.isGridEditable(params),
                        },
                        options: this.masterdata.costTypes.filter((cost) => cost.isATradeCost === true)
                            .sort((a, b) => a.costTypeCode.localeCompare(b.costTypeCode)),
                        valueProperty: 'costTypeCode',
                        codeProperty: 'costTypeCode',
                        displayProperty: 'costTypeCode',
                        isRequired: true,
                    };
                },
                onCellValueChanged: (params) => {
                    const filteredCostType = this.masterdata.costTypes.find(
                        (e) => e.costTypeCode === params.data.costTypeCode);

                    if (filteredCostType) {
                        params.node.setDataValue('description', filteredCostType.name);
                        params.node.setDataValue('inPL', filteredCostType.inPNL);
                        params.node.setDataValue('noAction', filteredCostType.noAction);
                    }
                },
            },
            {
                headerName: 'Description',
                field: 'description',
                colId: 'description',
            },
            {
                headerName: 'Matrix Name',
                field: 'costMatrixName',
                colId: 'costMatrixName',
                hide: false,
            },
            {
                headerName: 'Supplier',
                field: 'supplierCode',
                cellRendererFramework: AgGridContextualSearchComponent,
                cellRendererParams: (params) => {
                    return {
                        context: {
                            componentParent: this,
                            gridEditable: this.isGridEditable(params),
                        },
                        gridId: 'counterpartiesGrid',
                        options: this.masterdata.counterparties,
                        isRequired: false,
                        displayProperty: 'counterpartyCode',
                        valueProperty: 'counterpartyCode',
                        lightBoxTitle: 'Results for Counterparty',
                        showContextualSearchIcon: this.isGridEditable(params),
                    };
                },
                onCellValueChanged: (params) => {
                    if ((params.data.supplierCode || params.data.supplierCode === '') && this.masterdata.counterparties) {
                        const selectedClientAccount = this.masterdata.counterparties.find(
                            (clientAccount) => clientAccount.counterpartyCode === params.data.supplierCode);
                        if (selectedClientAccount) {
                            params.node.data.isDirty = true;
                        } else if (params.data.supplierCode === '') {
                            params.node.data.isDirty = true;
                        }
                    }
                },
            },
            {
                headerName: 'CCY',
                field: 'currencyCode',
                colId: 'currencyCode',
                cellRendererFramework: AgGridAutocompleteComponent,
                cellRendererParams: (params) => {
                    return {
                        context: {
                            componentParent: this,
                            gridEditable: this.isGridEditable(params),
                        },
                        options: this.masterdata.currencies,
                        valueProperty: 'currencyCode',
                        codeProperty: 'currencyCode',
                        displayProperty: 'description',
                        isRequired: true,

                    };
                },
                onCellValueChanged: (params) => {
                    if (params.data.currencyCode && this.masterdata.currencies) {
                        const currencyCode = this.masterdata.currencies.find((currency) => currency.currencyCode === params.data.currencyCode);
                        if (currencyCode) {
                            params.node.setDataValue('currencyCode', currencyCode);
                            params.node.data.isDirty = true;
                        }
                    }
                },
                width: 120,
            },
            {
                headerName: 'Rate Type*',
                field: 'rateTypeCode',
                editable: (params) => this.isGridEditable(params),
                cellRenderer: this.requiredCell,
                cellEditor: 'agRichSelectCellEditor',
                cellEditorParams: {
                    values: this.rateTypes.map((rateType) => rateType.code),
                    valuePropertyName: 'code',
                    displayFormat: 'code',
                    context: this.masterdata,
                },
                onCellValueChanged: this.onRateTypeChange.bind(this),
                width: 120,
            },
            {
                headerName: 'Price Code',
                field: 'priceCode',
                colId: 'priceCode',
                editable: this.isPriceCodeEditable.bind(this),
                cellEditor: 'agRichSelectCellEditor',
                cellRenderer: this.priceCodeRequired.bind(this),
                cellEditorParams: {
                    values: this.masterdata.priceUnits.map((priceUnit) => priceUnit.priceCode),
                    displayPropertyName: 'description',
                    valuePropertyName: 'priceCode',
                    displayFormat: 'priceCode | description',
                    context: this.masterdata,
                },
                width: 120,
            },
            {
                headerName: 'Pay/Rec*',
                field: 'costDirection',
                editable: (params) => this.isGridEditable(params),
                cellRenderer: this.requiredCell,
                cellEditor: 'agRichSelectCellEditor',
                cellEditorParams: {
                    values: this.costDirections.map((costDirection) => costDirection.costDirection),
                    displayPropertyName: 'costDirection',
                    valuePropertyName: 'costDirection',
                    displayFormat: 'costDirection',
                },
            },
            {
                headerName: 'Rate/Amount',
                field: 'rate',
                editable: (params) => this.isGridEditable(params),
                cellEditor: 'atlasNumeric',
                type: 'numberColumn',
                onCellValueChanged: this.onRateAmountChanged.bind(this),
                cellEditorParams: {
                    displayMask: CustomNumberMask(12, 10, false),
                    isRightAligned: false,
                },
            },
            {
                headerName: 'in P&L',
                field: 'inPL',
                colId: 'inPL',
                cellRenderer: 'atlasCheckbox',
                cellRendererParams: (params) => {
                    return {
                        disabled: !this.pnlPrivilege || (!params.data.fullyInvoiced),
                        params: this.gridContext,
                    };
                },
            },
            {
                headerName: 'No Act',
                field: 'noAction',
                colId: 'noAction',
                cellRenderer: 'atlasCheckbox',
                cellRendererParams: (params) => {
                    return {
                        disabled: !this.noActPrivilege || (!params.data.fullyInvoiced),
                        params: this.gridContext,
                    };
                },
            },
            {
                headerName: '%Invoiced',
                field: 'invoicePercent',
                colId: 'invoicePercent',
                width: 120,
                type: 'numericColumn',
            },
            {
                pinned: 'right',
                cellRendererFramework: AgContextualMenuComponent,
                cellRendererParams: {
                    context: {
                        componentParent: this,
                        actionContext: this.gridContext,
                    },
                    menuActions: this.costEditBulkUpdateGridContextualMenuActions,
                },
                cellClass: 'ag-contextual-menu',
                width: 40,
            },
        ];
    }

    requiredCell(params) {
        if (!params.value || params.value === '') {
            return '<div class=\'cost-cell-value-required\'>Required*</div>';
        }
        return params.value;
    }

    isPriceCodeEditable(params): boolean {
        if (params.data.rateTypeCode === RateTypes[RateTypes.Rate]) {
            return params.context.gridEditable;
        } else {
            params.node.setDataValue('priceCode', '');
        }
    }

    priceCodeRequired(params) {
        if ((!params.value || params.value === '') && (params.data.rateTypeCode === RateTypes[RateTypes.Rate])) {
            params.node.setDataValue('priceCode', this.requiredCell(this));
        }
        return params.value;
    }

    onRateTypeChange(params) {
        if (params.newValue === RateTypes[RateTypes.Rate]) {
            this.priceCodeRequired(params);
        } else if (params.newValue === RateTypes[RateTypes.Amount]) {
            this.isPriceCodeEditable(params);
        } else {
            this.isPriceCodeEditable(params);
        }
    }

    getRateCodeFromId(id: number) {
        const rateCode = RateTypes[id];
        return rateCode;
    }

    getPriceCodeFromId(id: number) {
        const priceCode = this.masterdata.priceUnits.find(
            (e) => e.priceUnitId === id);
        return priceCode ? priceCode.priceCode : '';
    }

    getCostDirectionCodeFromId(id, costDirections: CostDirection[]) {
        const costDirection = costDirections.find(
            (e) => e.costDirectionId === id);
        return costDirection ? costDirection.costDirection : '';
    }

    getCostTypeCodeFromId(id: number, masterdata: MasterData): string {
        const costTypeCode = masterdata.costTypes.find(
            (e) => e.costTypeId === id);
        return costTypeCode ? costTypeCode.costTypeCode : null;
    }

    getCostTypeDescriptionFromId(id: number, masterdata: MasterData): string {
        const descrption = masterdata.costTypes.find(
            (e) => e.costTypeId === id);
        return descrption ? descrption.name : null;
    }

    setCostsBySectionIds(sectionIds: number[]) {
        if (sectionIds) {
            this.tradingService.getCostForSelectedContracts(sectionIds)
                .subscribe((data) => {
                    this.existingCosts = data.value as BulkCost[];
                    if (this.existingCosts) {
                        this.existingCosts.forEach((cost) => {
                            cost.rateTypeCode = this.getRateCodeFromId(cost.rateTypeId);
                            cost.priceCode = this.getPriceCodeFromId(cost.priceUnitId);
                            cost.costDirection = this.getCostDirectionCodeFromId(cost.costDirectionId, this.costDirections);
                            cost.costTypeCode = this.getCostTypeCodeFromId(cost.costTypeId, this.masterdata);
                            cost.description = this.getCostTypeDescriptionFromId(cost.costTypeId, this.masterdata);
                        });
                        this.costContractGridRows = this.existingCosts;
                    }
                });
        }

    }

    setNewCosts(costs: BulkCost[]) {
        costs.forEach((cost) => {
            if (cost.costId) {
                // overriding existing costs and update the rowstatus as amended
                if (this.existingCosts) {
                    const index: number = this.existingCosts.findIndex((existingCost) => existingCost.costId === cost.costId);
                    if (index !== -1) {
                        if (this.existingCosts[index].invoicePercent > 0) {
                            this.existingCosts[index].invoicePercent = (this.existingCosts[index].invoicePercent * this.existingCosts[index].rate) / cost.rate;
                        }
                        this.existingCosts[index].rate = cost.rate;
                        this.existingCosts[index].costMatrixName = cost.costMatrixName;
                        this.existingCosts[index].supplierCode = cost.supplierCode;
                        this.existingCosts[index].currencyCode = cost.currencyCode;
                        this.existingCosts[index].rateTypeCode = cost.rateTypeCode;
                        this.existingCosts[index].priceCode = cost.priceCode;
                        this.existingCosts[index].rate = cost.rate;
                        this.existingCosts[index].inPL = cost.inPL;
                        this.existingCosts[index].noAction = cost.noAction;
                        this.existingCosts[index].costDirection = cost.costDirection;
                        this.existingCosts[index].rowStatus = 'A';

                        // Calculate invoice percent here
                        this.gridApi.updateRowData({ update: [this.existingCosts[index]] });
                    }
                }
            } else if (this.existingCosts) {
                if (!this.costContractGridRows) {
                    this.costContractGridRows = [];
                }
                this.costContractGridRows.push(cost);
                this.gridApi.updateRowData({ add: [cost] });
            }
        });
        this.gridApi.refreshCells();
    }

    getGridData() {
        this.gridApi.forEachNode((rowData) => {
            this.costsToSummary.push(rowData.data);
            this.updatedCostsToSummary = this.costsToSummary;
        });
        return this.updatedCostsToSummary;
    }

    onCellValueChanged(params) {
        if (params.oldValue !== params.newValue) {
            params.node.data.isDirty = true;
            params.node.setDataValue('rowStatus', params.node.data.costId ? 'A' : 'N');
            this.gridColumnApi.autoSizeAllColumns();
        }
    }

    getFormGroup() {
        return super.getFormGroup();
    }

    populateEntity(entity: BulkCost[]): BulkCost[] {
        const selectedCosts = entity;
        if (this.costsToDelete && this.costsToDelete.length > 0) {
            this.costsToDelete.forEach((costToDelete) => {
                const cost = new BulkCost();
                cost.costId = costToDelete.costId;
                cost.sectionId = costToDelete.sectionId;
                cost.rowStatus = costToDelete.rowStatus;
                cost.costTypeCode = costToDelete.costTypeCode;
                cost.description = costToDelete.description;
                cost.costMatrixName = costToDelete.costMatrixName;
                cost.supplierCode = costToDelete.supplierCode;
                cost.currencyCode = costToDelete.currencyCode;
                cost.rateTypeId = this.getRateTypeIdFromCode(costToDelete.rateTypeCode);
                cost.priceUnitId = costToDelete.priceUnitId ? costToDelete.priceUnitId : (costToDelete.priceCode ?
                    this.masterdata.priceUnits.find((priceUnit) =>
                        priceUnit.priceCode === costToDelete.priceCode).priceUnitId : null);
                cost.rate = costToDelete.rate;
                cost.inPL = costToDelete.inPL;
                cost.noAction = costToDelete.noAction;
                cost.invoicingStatusId = costToDelete.invoicingStatusId;
                cost.costDirectionId = costToDelete.costDirection ?
                    this.costDirections.find((costDirection) =>
                        costDirection.costDirection === costToDelete.costDirection).costDirectionId : null;
                cost.isDelete = costToDelete.isDelete;
                if (costToDelete.rowStatus) {
                    selectedCosts.push(cost);
                }
            });

        }

        this.gridApi.forEachNode((rowData) => {
            if (rowData.data && (rowData.data.rowStatus && (rowData.data.rowStatus === 'N' || rowData.data.rowStatus === 'A'))) {
                const cost = new BulkCost();
                cost.costId = rowData.data.costId;
                cost.sectionId = rowData.data.sectionId;
                cost.rowStatus = rowData.data.rowStatus;
                cost.costTypeCode = rowData.data.costTypeCode;
                cost.description = rowData.data.description;
                cost.costMatrixName = rowData.data.costMatrixName;
                cost.supplierCode = rowData.data.supplierCode;
                cost.currencyCode = rowData.data.currencyCode;
                cost.rateTypeId = this.getRateTypeIdFromCode(rowData.data.rateTypeCode);
                cost.priceUnitId = rowData.data.priceUnitId ? rowData.data.priceUnitId : (rowData.data.priceCode ?
                    this.masterdata.priceUnits.find((priceUnit) =>
                        priceUnit.priceCode === rowData.data.priceCode).priceUnitId : null);
                cost.rate = rowData.data.rate;
                cost.inPL = rowData.data.inPL;
                cost.noAction = rowData.data.noAction;
                cost.invoicingStatusId = rowData.data.invoicingStatusId;
                cost.costDirectionId = rowData.data.costDirection ?
                    this.costDirections.find((costDirection) =>
                        costDirection.costDirection === rowData.data.costDirection).costDirectionId : null;
                cost.invoicePercent = rowData.data.invoicePercent;
                if (rowData.data.rowStatus) {
                    selectedCosts.push(cost);
                }
            }
        });

        return selectedCosts;
    }

    getRateTypeIdFromCode(code: string) {
        const rateTypeId = RateTypes[code];
        return rateTypeId;
    }

    handleAction(action: string, cost: BulkCost) {
        switch (action) {
            case this.costsBulkEditMenuActions.deleteCost:
                const confirmDialog = this.dialog.open(ConfirmationDialogComponent, {
                    data: {
                        title: 'Cost Deletion',
                        text: 'Deleting a cost is permanent. Do you wish to proceed?',
                        okButton: 'Delete anyway',
                        cancelButton: 'Cancel',
                    },
                });
                const confirmationSubscription = confirmDialog.afterClosed().subscribe((answer) => {
                    if (answer) {
                        if (cost.costId && cost.invoicePercent === 0) {
                            cost.isDelete = true;
                            cost.rowStatus = 'D';
                            this.costsToDelete.push(cost);
                            if (this.gridApi) {
                                this.gridApi.refreshCells({
                                    force: true,
                                });
                            }
                        } else if (!(cost.costId)) {
                            this.gridApi.updateRowData({ remove: [cost] });
                        } else {
                            this.snackbarService.informationSnackBar('Cannot delete invoiced cost');
                        }
                    }
                });
                this.subscriptions.push(confirmationSubscription);
                break;
            default:
                break;
        }
    }

    onRateAmountChanged(params) {
        if (params && params.data && params.data.invoicePercent) {
            if (params.newValue && params.newValue !== 0) {
                const invoicePercent = (params.data.invoicePercent * params.oldValue) / params.newValue;
                if (invoicePercent > 100) {
                    params.data.invoicePercent = 100;
                } else {
                    params.data.invoicePercent = invoicePercent;
                }
            } else {
                params.data.rate = params.oldValue;
            }
        }
        if (this.gridApi) {
            this.gridApi.refreshCells(params.data);
        }
    }
}
