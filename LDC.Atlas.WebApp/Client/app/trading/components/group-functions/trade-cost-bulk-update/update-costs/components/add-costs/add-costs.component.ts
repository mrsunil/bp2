import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import * as agGrid from 'ag-grid-community';
import { AgGridCheckboxComponent } from '../../../../../../../shared/components/ag-grid-checkbox/ag-grid-checkbox.component';
import { AgGridAutocompleteComponent } from '../../../../../../../shared/components/ag-grid/autocomplete/ag-grid-autocomplete.component';
import { AgGridContextualSearchComponent } from '../../../../../../../shared/components/ag-grid/contextual-search/ag-grid-contextual-search.component';
import { CellEditorNumericComponent } from '../../../../../../../shared/components/cell-editor-numeric/cell-editor-numeric.component';
import { CellEditorSelectComponent } from '../../../../../../../shared/components/cell-editor-select/cell-editor-select.component';
import { AtlasAgGridParam } from '../../../../../../../shared/entities/atlas-ag-grid-param.entity';
import { AtlasFormControl } from '../../../../../../../shared/entities/atlas-form-control';
import { BulkCost } from '../../../../../../../shared/entities/bulk-edit-cost.entity';
import { CostBulkEditAllUpdateOptions } from '../../../../../../../shared/entities/cost-bulk-edit-options.entity';
import { CostDirection } from '../../../../../../../shared/entities/cost-direction.entity';
import { MasterData } from '../../../../../../../shared/entities/masterdata.entity';
import { RateType } from '../../../../../../../shared/entities/rate-type.entity';
import { CostDirections } from '../../../../../../../shared/enums/cost-direction.enum';
import { CostBulkEditUpdateOptions } from '../../../../../../../shared/enums/cost-edit-options.enum';
import { CurrencyCodes } from '../../../../../../../shared/enums/currency-codes.enum';
import { InvoicingStatus } from '../../../../../../../shared/enums/invoicing-status.enum';
import { RateTypes } from '../../../../../../../shared/enums/rate-type.enum';
import { CustomNumberMask } from '../../../../../../../shared/numberMask';
import { AgGridService } from '../../../../../../../shared/services/ag-grid.service';
import { MasterdataService } from '../../../../../../../shared/services/http-services/masterdata.service';
import { TradingService } from '../../../../../../../shared/services/http-services/trading.service';
import { SnackbarService } from '../../../../../../../shared/services/snackbar.service';
import { ContractsForBulkFunctions } from '../../../../../../../shared/services/trading/dtos/contracts-for-bulk-functions';
import { Costmatrix } from '../../../../../../../shared/services/trading/dtos/costmatrix';
import { CostmatrixLine } from '../../../../../../../shared/services/trading/dtos/costmatrixLine';
import { CostMatrixDialogComponent } from '../../../../../../../trading/components/contract-physical-capture/costs-tab/cost-matrix-dialog/cost-matrix-dialog.component';
import { EditCostsDialogComponent } from '../edit-costs-dialog/edit-costs-dialog.component';

@Component({
    selector: 'atlas-add-costs',
    templateUrl: './add-costs.component.html',
    styleUrls: ['./add-costs.component.scss'],
})
export class AddCostsComponent implements OnInit {
    @Output() readonly newCostsAdded = new EventEmitter<any>();
    @Input() noActPrivilege: boolean;
    @Input() pnlPrivilege: boolean;

    addNewLineCtrl = new AtlasFormControl('addNewLineCtrl');
    gridComponents = {
        atlasSelect: CellEditorSelectComponent,
        atlasNumeric: CellEditorNumericComponent,
        atlasCheckbox: AgGridCheckboxComponent,
    };
    gridContext = {
        contractStatus: '',
        gridEditable: true,
        editPrivileges: true,
        deletePrivileges: true,
        inPNLPrivileges: true,
    };
    costsGridCols: agGrid.ColDef[];
    costsGridRows: BulkCost[];
    gridApi: agGrid.GridApi;
    gridColumnApi: agGrid.ColumnApi;
    atlasAgGridParam: AtlasAgGridParam;
    masterdata: MasterData;
    rateTypes: RateType[];
    company: string;
    costMatrix: Costmatrix[];
    costMatrixLine: CostmatrixLine[];
    filteredLines: CostmatrixLine[] = [];
    costGridOptions: agGrid.GridOptions = {};
    costDirections: CostDirection[];
    updateOptions: CostBulkEditAllUpdateOptions[];
    isProRataCheck: boolean = false;
    selectCostmatrix: string;
    costMatrixId: number;
    existingCosts: BulkCost[];
    contracts: string[];
    fullyInvoicedContracts: string[];
    newCosts: BulkCost[] = [];
    existingSectionIds: number[] = [];
    totalQuantity: number = 0;
    selectedContracts: ContractsForBulkFunctions[] = [];
    costIdsForOverrideCosts: number[] = [];
    sectionIdsForAddNewCosts: number[] = [];
    costIdsForFullyInvoicedCosts: number[] = [];
    contractReferenceForFullyInvoicedCosts: string[] = [];
    contractSelected: number[] = [];
    contractLabelSelected: string[] = [];

    constructor(protected masterdataService: MasterdataService,
        protected dialog: MatDialog,
        protected tradingService: TradingService,
        protected route: ActivatedRoute,
        protected snackbarService: SnackbarService,
        public gridService: AgGridService) {
    }

    ngOnInit() {
        this.masterdata = this.route.snapshot.data.masterdata;
        this.atlasAgGridParam = this.gridService.getAgGridParam();
        this.company = this.route.snapshot.paramMap.get('company');
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
        this.updateOptions = [
            {
                option: CostBulkEditUpdateOptions.AddNewCost,
            },
            {
                option: CostBulkEditUpdateOptions.OverRideCost,
            },
        ];
        this.initCostsGridColumns();
    }

    onGridReady(params) {
        this.gridApi = params.api;
        params.columnDefs = this.costsGridCols;
        this.costGridOptions = params;
        this.gridColumnApi = params.columnApi;
        this.gridService.sizeColumns(this.costGridOptions);
        window.onresize = () => {
            this.gridService.sizeColumns(this.costGridOptions);
        };
        this.gridApi.showNoRowsOverlay();
    }

    initCostsGridColumns() {
        this.costGridOptions = {
            context: this.gridContext,
        };
        this.costsGridCols = [
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
            },
            {
                headerName: 'Supplier',
                field: 'supplierCode',
                cellRendererFramework: AgGridContextualSearchComponent,
                cellRendererParams: () => {
                    return {
                        context: {
                            componentParent: this,
                        },
                        gridId: 'counterpartiesGrid',
                        options: this.masterdata.counterparties,
                        isRequired: false,
                        displayProperty: 'counterpartyCode',
                        valueProperty: 'counterpartyCode',
                        lightBoxTitle: 'Results for Counterparty',
                        showContextualSearchIcon: true,
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
                        const currencyCode = this.masterdata.currencies.find((currency) =>
                            currency.currencyCode === params.data.currencyCode);
                        if (currencyCode) {
                            params.node.setDataValue('currencyCode', params.data.currencyCode);
                            params.node.data.isDirty = true;
                        }
                    }
                },
            },
            {
                headerName: 'Rate Type*',
                field: 'rateTypeCode',
                editable: this.isGridEditable.bind(this),
                cellRenderer: this.requiredCell,
                cellEditor: 'agRichSelectCellEditor',
                cellEditorParams: {
                    values: this.rateTypes.map((rateType) => rateType.code),
                    valuePropertyName: 'code',
                    displayFormat: 'code',
                    context: this.masterdata,
                },
                onCellValueChanged: (params) => {
                    this.onRateTypeChange(params);
                },
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
            },
            {
                headerName: 'Pay/Rec*',
                field: 'costDirection',
                editable: true,
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
                editable: this.isGridEditable.bind(this),
                cellEditor: 'atlasNumeric',
                type: 'numberColumn',
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
                cellRendererParams: {
                    disabled: !this.pnlPrivilege,
                    params: this.gridContext,
                },
            },
            {
                headerName: 'No Act',
                field: 'noAction',
                colId: 'noAction',
                cellRenderer: 'atlasCheckbox',
                cellRendererParams: {
                    disabled: !this.noActPrivilege,
                    params: this.gridContext,
                },
            },
            {
                headerName: '%Invoiced',
                field: 'invoicePercent',
                hide: true,
            },
            {
                headerName: 'Add or Override?',
                field: 'isAddOrOverride',
                editable: false,
                hide: true,
            },
            {
                headerName: 'Pro Rata',
                field: 'isProRata',
                colId: 'isProRata',
                cellRenderer: 'atlasCheckbox',
                cellRendererParams: {
                    disabled: () => !this.isProRataCheck,
                    params: this.gridContext,
                },
                pinned: 'right',
            },

            {
                headerName: 'Update Options',
                field: 'updateOptions',
                editable: this.isGridEditable.bind(this),
                cellRenderer: this.requiredCell,
                cellEditor: 'agRichSelectCellEditor',
                cellEditorParams: {
                    values: this.updateOptions.map((options) => options.option),
                    displayPropertyName: 'option',
                    valuePropertyName: 'option',
                    displayFormat: 'option',
                },
                onCellValueChanged: this.onUpdateOptionChange.bind(this),
                pinned: 'right',
            },

        ];
    }

    requiredCell(params) {
        if (!params.value || params.value === '') {
            return '<div class=\'cost-cell-value-required\'>Required*</div>';
        }
        return params.value;
    }

    isGridEditable(params): boolean {
        return params.context.gridEditable;
    }

    isPriceCodeEditable(params): boolean {
        if (params.data.rateTypeCode === RateTypes[RateTypes.Rate]) {
            return params.context.gridEditable;
        } else {
            params.node.setDataValue('priceCode', '');
        }
    }

    onRateTypeChange(params) {
        if (params.newValue === RateTypes[RateTypes.Rate]) {
            this.priceCodeRequired(params);
        } else if (params.newValue === RateTypes[RateTypes.Amount]) {
            this.isPriceCodeEditable(params);
        } else {
            this.isPriceCodeEditable(params);
        }
        // prorata check
        this.isProRataCheck = (params.data.rateTypeCode === RateTypes[RateTypes.Amount]);

        if (this.gridApi) {
            this.gridApi.refreshCells({
                rowNodes: [params.node],
                force: true,
            });
        }
    }

    priceCodeRequired(params) {
        if ((!params.value || params.value === '') && (params.data.rateTypeCode === RateTypes[RateTypes.Rate])) {
            params.node.setDataValue('priceCode', this.requiredCell(this));
        }
        return params.value;
    }

    onAddRowButtonClicked(numberOfLines: number) {
        if (numberOfLines && numberOfLines > 0) {
            this.gridContext.gridEditable = true;
            this.gridApi.onFilterChanged();
            for (let count = 1; count <= numberOfLines; count++) {
                const newItem = this.createNewRowData();
                this.gridApi.updateRowData({ add: [newItem], addIndex: 0 });
            }
            this.addNewLineCtrl.setValue('');
        }
    }

    createNewRowData() {
        const newCostRow = new BulkCost();
        newCostRow.costDirectionId = CostDirections.Payable;
        newCostRow.currencyCode = CurrencyCodes.USD;
        newCostRow.rowStatus = 'N';
        newCostRow.costIds = [];
        newCostRow.invoicingStatusId = InvoicingStatus.Uninvoiced;
        return newCostRow;
    }

    onCellValueChanged(params) {
        if (params.oldValue !== params.newValue) {
            params.node.data.isDirty = true;
            this.gridService.sizeColumns(this.costGridOptions);
        }
    }

    onAddCostMatrixClicked() {
        this.tradingService.getCostmatricesByCompanyId(this.company).subscribe((data) => {
            this.costMatrix = data.value;
            if (this.costMatrix) {
                const openCostMatrixDialog = this.dialog.open(CostMatrixDialogComponent, {
                    data:
                    {
                        matrixData: this.costMatrix,
                    },
                    width: '45%',
                });
                openCostMatrixDialog.afterClosed().subscribe((matrixId) => {
                    if (matrixId) {
                        this.importMatrices(matrixId);
                    }
                });
            }
        });
    }

    importMatrices(matrixId: number) {
        this.tradingService.getCostmatricesListByCostmatrixId(matrixId).subscribe((data) => {
            this.selectCostmatrix = data.name;
            data.costMatrixLines.filter((line) => {
                data.costMatrixId = line.costMatrixId;
                this.filteredLines = data.costMatrixLines;
            });
            if (this.filteredLines && this.filteredLines.length > 0) {
                this.addCostMatrixLinesToCostGrid();
            }
        });
    }

    addCostMatrixLinesToCostGrid() {
        this.filteredLines.forEach((rows) => {
            const costRow = new BulkCost();
            costRow.costMatrixName = this.selectCostmatrix;
            costRow.costTypeCode = this.getCostTypeCodeFromId(rows.costTypeId);
            costRow.description = rows.description;
            costRow.supplierCode = this.getSupplierCodeFromId(rows.supplierId);
            costRow.costDirection = this.getCostDirectionCodeFromId(rows.payReceive, this.costDirections);
            costRow.currencyCode = rows.currencyCode;
            costRow.rateTypeCode = this.getRateCodeFromId(rows.rateType);
            costRow.priceCode = this.getPriceCodeFromId(rows.priceUnitId);
            costRow.rate = rows.rateAmount;
            costRow.inPL = rows.inPL;
            costRow.noAction = rows.noAct;
            costRow.narrative = rows.narrative;
            costRow.costMatrixLineId = rows.costMatrixLineId;
            costRow.isAddOrOverride = 'No';
            this.gridApi.updateRowData({ add: [costRow] });
        });
    }

    getCostTypeCodeFromId(id: number): string {
        const costTypeCode = this.masterdata.costTypes.find(
            (e) => e.costTypeId === id);
        return costTypeCode ? costTypeCode.costTypeCode : null;
    }

    getSupplierCodeFromId(id: number) {
        const counterparty = this.masterdata.counterparties.find((e) => e.counterpartyID === id);
        return counterparty ? counterparty.counterpartyCode : null;
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

    setCostsBySectionIds(contracts: ContractsForBulkFunctions[], quantity: number) {
        if (contracts) {
            this.selectedContracts = contracts;
            const sectionIds: number[] = contracts.map((contract) => contract.sectionId);
            this.contractSelected = sectionIds;
            const contractLabel: string[] = contracts.map((contract) => contract.contractLabel);
            this.contractLabelSelected = contractLabel;
            this.totalQuantity = quantity;
            this.existingSectionIds = sectionIds;
            this.tradingService.getCostForSelectedContracts(sectionIds)
                .subscribe((data) => {
                    this.existingCosts = data.value;
                    if (this.existingCosts) {
                        this.existingCosts.forEach((cost) => {
                            cost.costTypeCode = this.getCostTypeCodeFromId(cost.costTypeId);
                            cost.rateTypeCode = this.getRateCodeFromId(cost.rateTypeId);
                            cost.priceCode = this.getPriceCodeFromId(cost.priceUnitId);
                            cost.costDirection = this.getCostDirectionCodeFromId(cost.costDirectionId, this.costDirections);
                        });
                    }
                });
        }
    }

    onUpdateOptionChange(params) {
        this.contracts = [];
        let costIds: number[] = [];
        let sectionIds: number[] = [];
        // override cost is selected
        if (params.data.updateOptions === this.updateOptions[1].option) {
            if (this.existingCosts && this.existingCosts.length > 0 && params.data.costTypeCode) {
                // the list of contracts without the cost type code & cost direction different from new cost
                // to be displyed in the dialog with an option to add as new cost
                this.sectionIdsForAddNewCosts = Array.from(new Set(this.existingCosts.filter((cost) =>
                    cost.costTypeCode === params.data.costTypeCode && cost.costDirection === params.data.costDirection)
                    .map((contract) => contract.sectionId)));

                const costsUpdated = this.existingCosts.filter((cost) =>
                    cost.costTypeCode === params.data.costTypeCode && cost.costDirection === params.data.costDirection);
                const costsUpdatedFullyInvoiced = costsUpdated.filter((cost) => cost.invoicePercent === 100);

                this.costIdsForFullyInvoicedCosts = Array.from(new Set(costsUpdatedFullyInvoiced.map((contract) => contract.costId)));
                this.contractReferenceForFullyInvoicedCosts = Array.from(new Set(costsUpdatedFullyInvoiced
                    .map((contract) => contract.contractReference)));
                this.costIdsForOverrideCosts = Array.from(new Set(costsUpdated.filter((cost) => cost.invoicePercent < 100)
                    .map((contract) => contract.costId)));

                // section ids where the cost will be added when yes is selected from dialog
                const costToOverride = this.existingCosts.filter((cost) =>
                    !this.costIdsForOverrideCosts.includes(cost.costId) && !this.sectionIdsForAddNewCosts.includes(cost.sectionId));
                this.contracts = Array.from(new Set(costToOverride.map((contract) => contract.contractReference)));

                sectionIds = costToOverride.map((contract) => contract.sectionId);
                costIds = costToOverride.map((contract) => contract.costId);

                if (this.costIdsForFullyInvoicedCosts && this.costIdsForFullyInvoicedCosts.length > 0) {
                    this.fullyInvoicedContracts = this.contractReferenceForFullyInvoicedCosts;
                    this.snackbarService.throwErrorSnackBar(
                        'Some costs could not be overridden, since they are fully invoiced ' + this.fullyInvoicedContracts,
                    );
                }

                if (this.contracts && this.contracts.length > 0) {
                    const overrideDialog = this.dialog.open(EditCostsDialogComponent, {
                        width: '40%',
                        data: {
                            confirmationMessage: 'The cost ' + params.data.costTypeCode + ' to ' +
                                params.data.costDirection + ' doesn’t exist in the following trades. Do you want to add the cost item?',
                            contractReference: this.contracts,
                        },
                    });
                    overrideDialog.afterClosed().subscribe((result) => {
                        params.data.isAddOrOverride = result ? 'Yes' : 'No';
                        if (result) {
                            params.data.sectionIds = sectionIds;
                        }
                        this.gridApi.refreshCells();
                    });
                }
            } else if (this.existingCosts && this.existingCosts.length === 0 && params.data.costTypeCode) {
                // the list of contracts without the cost type code & cost direction different from new cost
                // to be displyed in the dialog with an option to add as new cost

                this.sectionIdsForAddNewCosts = this.contractSelected;
                this.contracts = this.contractLabelSelected;
                if (this.contracts && this.contracts.length > 0) {
                    const overrideDialog = this.dialog.open(EditCostsDialogComponent, {
                        width: '40%',
                        data: {
                            confirmationMessage: 'The cost ' + params.data.costTypeCode + ' to ' +
                                params.data.costDirection + ' doesn’t exist in the following trades. Do you want to add the cost item?',
                            contractReference: this.contracts,
                        },
                    });
                    overrideDialog.afterClosed().subscribe((result) => {
                        params.data.isAddOrOverride = result ? 'Yes' : 'No';
                        if (result) {
                            params.data.sectionIds = this.sectionIdsForAddNewCosts;
                        }
                        this.gridApi.refreshCells();
                    });
                }
            } else {
                this.showErroMessageForRequiredFields();
                params.data.updateOptions = '';
                this.gridApi.refreshCells();
            }
            // Add new cost is selected
        } else if (params.data.updateOptions === this.updateOptions[0].option) {
            if (this.existingCosts && params.data.costTypeCode) {
                // the list of contracts with the cost type code & cost direction same as new cost
                // to be displyed in the dialog, with an option to override
                const contractsSameCostTypeAndDirection = this.existingCosts.filter((cost) =>
                    cost.costTypeCode === params.data.costTypeCode && cost.costDirection === params.data.costDirection);
                this.contracts = Array.from(new Set(contractsSameCostTypeAndDirection.map((contract) => contract.contractReference)));

                const costsInvoiced = contractsSameCostTypeAndDirection.filter((cost) => cost.invoicePercent === 100);
                this.costIdsForFullyInvoicedCosts = Array.from(new Set(costsInvoiced.map((contract) => contract.costId)));
                this.contractReferenceForFullyInvoicedCosts = Array.from(new Set(costsInvoiced
                    .map((contract) => contract.contractReference)));

                // costids where the override has to take place
                costIds = contractsSameCostTypeAndDirection.filter((cost) => cost.invoicePercent < 100).map((contract) => contract.costId);

                // section ids where the costs have to be newly added
                this.sectionIdsForAddNewCosts = Array.from(new Set(this.existingCosts.filter((cost) =>
                    !this.contracts.includes(cost.contractReference)).map((contract) => contract.sectionId)));
                if (this.contracts && this.contracts.length > 0) {
                    const overrideDialog = this.dialog.open(EditCostsDialogComponent, {
                        width: '40%',
                        data: {
                            confirmationMessage: 'The cost ' + params.data.costTypeCode + ' to ' +
                                params.data.costDirection +
                                ' already exists in the following trades. Do you want to override the cost item?',
                            contractReference: this.contracts,
                        },
                    });
                    overrideDialog.afterClosed().subscribe((result) => {
                        params.data.isAddOrOverride = result ? 'Yes' : 'No';
                        if (result) {
                            params.data.costIds = costIds;
                            if (this.costIdsForFullyInvoicedCosts && this.costIdsForFullyInvoicedCosts.length > 0) {
                                this.fullyInvoicedContracts = this.contractReferenceForFullyInvoicedCosts;
                                this.snackbarService.throwErrorSnackBar(
                                    'Some costs could not be overridden, since they are fully invoiced ' + this.fullyInvoicedContracts,
                                );
                            }
                        }
                        this.gridApi.refreshCells();
                    });
                }
            } else {
                this.showErroMessageForRequiredFields();
                params.data.updateOptions = '';
                this.gridApi.refreshCells();
            }
        }
    }

    onProceedButtonClicked() {
        if (!this.validate()) {
            this.snackbarService.throwErrorSnackBar(
                'Form is invalid. Please resolve the errors.',
            );
            return;
        } else {
            this.newCosts = [];
            this.gridApi.forEachNode((row) => {
                if ((row.data.costIds && row.data.costIds.length > 0)) {
                    if (row.data.updateOptions === CostBulkEditUpdateOptions.AddNewCost && row.data.isAddOrOverride === 'Yes') {
                        // override existing cost when cost type & cost direction is different
                        row.data.costIds.forEach((costId) => {
                            const newCost = new BulkCost();
                            this.GetRowDataForNewCost(newCost, row);
                            newCost.costId = costId;
                            newCost.sectionId = this.getSectionIdFromExistingCosts(costId);
                            newCost.contractReference = this.getContractReferenceByCostId(costId);
                            newCost.quantity = this.getContractQuantityByCostId(costId);
                            this.newCosts.push(newCost);
                        });
                        // add new costs for the rest of the contracts selected
                        if (this.sectionIdsForAddNewCosts && this.sectionIdsForAddNewCosts.length > 0) {
                            this.sectionIdsForAddNewCosts.forEach((sectionId) => {
                                const newCost = new BulkCost();
                                newCost.sectionId = sectionId;
                                this.GetRowDataForNewCost(newCost, row);
                                newCost.contractReference = this.getContractReferenceBySectionId(sectionId);
                                newCost.quantity = this.getContractQuantityBySectionId(sectionId);
                                this.newCosts.push(newCost);
                            });
                        }
                    }
                } else if ((row.data.sectionIds && row.data.sectionIds.length > 0)) {
                    if (row.data.updateOptions === CostBulkEditUpdateOptions.OverRideCost && row.data.isAddOrOverride === 'Yes') {
                        // Add new cost item when update option is Override when cost type and
                        // cost direction is different
                        row.data.sectionIds.forEach((sectionId) => {
                            const newCost = new BulkCost();
                            this.GetRowDataForNewCost(newCost, row);
                            newCost.sectionId = sectionId;
                            newCost.contractReference = this.getContractReferenceBySectionId(sectionId);
                            newCost.quantity = this.getContractQuantityBySectionId(sectionId);
                            this.newCosts.push(newCost);
                        });
                        // override costs for the rest of the contracts selected if costtype & cost direction is same
                        if (this.costIdsForOverrideCosts && this.costIdsForOverrideCosts.length > 0) {
                            this.costIdsForOverrideCosts.forEach((costId) => {
                                const newCost = new BulkCost();
                                this.GetRowDataForNewCost(newCost, row);
                                newCost.costId = costId;
                                newCost.sectionId = this.getSectionIdFromExistingCosts(costId);
                                newCost.contractReference = this.getContractReferenceByCostId(costId);
                                newCost.quantity = this.getContractQuantityByCostId(costId);
                                this.newCosts.push(newCost);
                            },
                            );
                        }
                    }
                } else {
                    if (row.data.updateOptions === CostBulkEditUpdateOptions.OverRideCost) {
                        // Override the existing costs if cost type and cost direction is same
                        this.existingCosts.forEach((cost) => {
                            if (cost.costTypeCode === row.data.costTypeCode && cost.costDirection === row.data.costDirection
                                && cost.invoicePercent < 100) {
                                const newCost = new BulkCost();
                                newCost.costId = cost.costId;
                                newCost.sectionId = cost.sectionId;
                                this.GetRowDataForNewCost(newCost, row);
                                newCost.contractReference = cost.contractReference;
                                newCost.quantity = this.getContractQuantityByCostId(cost.costId);
                                this.newCosts.push(newCost);
                            }
                        });
                    } else if (row.data.updateOptions === CostBulkEditUpdateOptions.AddNewCost) {
                        this.existingSectionIds.forEach((sectionId) => {
                            const newCost = new BulkCost();
                            newCost.sectionId = sectionId;
                            this.GetRowDataForNewCost(newCost, row);
                            newCost.contractReference = this.getContractReferenceBySectionId(sectionId);
                            newCost.quantity = this.getContractQuantityBySectionId(sectionId);
                            this.newCosts.push(newCost);
                        });
                    }
                }
            });
            // check for prorata and perform the calculation if isProrata is set to YES
            if (this.existingSectionIds.length > 1) {
                this.newCosts.forEach((newCost) => {
                    if (newCost.isProRata) {
                        if (newCost.rate) {
                            newCost.rate = (newCost.rate * newCost.quantity) / this.totalQuantity;
                        }
                    }
                });
            }
            this.newCostsAdded.emit({
                costs: this.newCosts,
            });
            // setting the grid to empty on click of proceed button
            this.gridApi.setRowData([]);
        }
    }

    GetRowDataForNewCost(newCost: BulkCost, row: agGrid.RowNode) {
        newCost.rowStatus = row.data.rowStatus;
        newCost.costTypeCode = row.data.costTypeCode;
        newCost.description = row.data.description;
        newCost.costMatrixName = row.data.costMatrixName;
        newCost.supplierCode = row.data.supplierCode;
        newCost.currencyCode = row.data.currencyCode;
        newCost.rateTypeCode = row.data.rateTypeCode;
        newCost.priceCode = row.data.priceCode;
        newCost.rate = row.data.rate;
        newCost.inPL = row.data.inPL;
        newCost.noAction = row.data.noAction;
        newCost.costDirection = row.data.costDirection;
        newCost.isProRata = row.data.isProRata;
    }

    getContractReferenceByCostId(costId: number): string {
        if (costId) {
            return this.existingCosts.find((cost) => cost.costId === costId).contractReference;
        }
    }

    getSectionIdFromExistingCosts(costId: number): number {
        if (costId) {
            return this.existingCosts.find((cost) => cost.costId === costId).sectionId;
        }
    }

    getContractQuantityByCostId(costId: number): number {
        if (costId) {
            return this.existingCosts.find((cost) => cost.costId === costId).quantity;
        }
    }

    getContractReferenceBySectionId(sectionId: number): string {
        if (sectionId) {
            return this.selectedContracts.find((contract) => contract.sectionId === sectionId).contractLabel;
        }
    }

    validate(): boolean {
        let isValid = true;
        this.gridApi.forEachNode((rowData) => {
            if (rowData.data.costTypeCode && rowData.data.costDirection
                && rowData.data.currencyCode && rowData.data.rateTypeCode && rowData.data.updateOptions) {
                if (((rowData.data.rateTypeCode === 'Rate') && (rowData.data.priceCode.includes('Required*')))) {
                    isValid = false;

                }
            } else if (!(rowData.data.costTypeCode || rowData.data.costDirection
                || rowData.data.currencyCode || rowData.data.rateTypeCode || rowData.data.updateOptions)) {
                isValid = false;
            } else if (!(rowData.data.costTypeCode && rowData.data.costDirection
                && rowData.data.currencyCode && rowData.data.rateTypeCode && rowData.data.updateOptions)) {
                isValid = false;
            }
        });

        return isValid;
    }

    getContractQuantityBySectionId(sectionId: number): number {
        if (sectionId) {
            return this.selectedContracts.find((contract) => contract.sectionId === sectionId).quantity;
        }
    }

    showErroMessageForRequiredFields() {
        this.snackbarService.throwErrorSnackBar('Select cost type and cost direction to proceed');
    }

}
