import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import * as agGrid from 'ag-grid-community';
import { AgGridUserPreferencesComponent } from '../../../../../../../shared/components/ag-grid-user-preferences/ag-grid-user-preferences.component';
import { BaseFormComponent } from '../../../../../../../shared/components/base-form-component/base-form-component.component';
import { ConfirmationDialogComponent } from '../../../../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { AtlasAgGridParam } from '../../../../../../../shared/entities/atlas-ag-grid-param.entity';
import { RateTypes } from '../../../../../../../shared/enums/rate-type.enum';
import { ToleranceTypes } from '../../../../../../../shared/enums/tolerance-type.enum';
import { AgGridService } from '../../../../../../../shared/services/ag-grid.service';
import { ContractsToCostInvoice } from '../../../../../../../shared/services/execution/dtos/contracts-to-cost-invoice';
import { ContractsToInvoice } from '../../../../../../../shared/services/execution/dtos/contracts-to-invoice';
import { FormConfigurationProviderService } from '../../../../../../../shared/services/form-configuration-provider.service';
import { GridConfigurationProviderService } from '../../../../../../../shared/services/grid-configuration-provider.service';
import { ExecutionService } from '../../../../../../../shared/services/http-services/execution.service';
import { SnackbarService } from '../../../../../../../shared/services/snackbar.service';
import { UiService } from '../../../../../../../shared/services/ui.service';
import { CommonMethods } from '../../../../../../services/execution-cash-common-methods';
import { ApportionDialogComponent } from '../../../../../dialog-boxes/apportion-dialog/apportion-dialog.component';

@Component({
    selector: 'atlas-goods-cost-contracts-cost',
    templateUrl: './goods-cost-contracts-cost.component.html',
    styleUrls: ['./goods-cost-contracts-cost.component.scss'],
})
export class GoodsCostContractsCostComponent extends BaseFormComponent implements OnInit {
    @ViewChild('userPreferences') userPreferencesComponent: AgGridUserPreferencesComponent;
    @Output() readonly costContractsSelected = new EventEmitter<boolean>();
    costContractGridOptions: agGrid.GridOptions = {};
    atlasAgGridParam: AtlasAgGridParam;
    costContractGridColumns: agGrid.ColDef[];
    costContractGridRows: ContractsToCostInvoice[];
    contractsToInvoice: ContractsToCostInvoice[];
    selectedCostContracts: ContractsToCostInvoice[];
    gridApi: agGrid.GridApi;
    gridColumnApi: agGrid.ColumnApi;
    isLoading: boolean;
    isApportion: boolean = true;
    dataLength: number = 0;
    invoiceType: number;
    company: string;
    componentId: string = 'invoiceCostSelectionGrid';
    hasGridSharing: boolean = false;
    isContractSelected: boolean = false;
    tolerancePercentage: number;
    counterParty: string;
    formatType: string = 'en-US';
    rateType: RateTypes;
    isApportionDisable: boolean = true;
    totalQuantity: number = 0;
    totalInvocieValue: number = 0;
    isCostAmountChanged: boolean = true;
    selected: boolean = false;

    constructor(private executionService: ExecutionService,
        private route: ActivatedRoute, protected formConfigurationProvider: FormConfigurationProviderService,
        protected uiService: UiService,
        protected dialog: MatDialog,
        private gridConfigurationProvider: GridConfigurationProviderService,
        private snackbarService: SnackbarService,
        public gridService: AgGridService,

    ) {
        super(formConfigurationProvider);
        this.atlasAgGridParam = this.gridService.getAgGridParam();
    }

    ngOnInit() {
        this.invoiceType = Number(decodeURIComponent(this.route.snapshot.paramMap.get('invoiceTypeId')));
        this.company = this.route.snapshot.paramMap.get('company');
        this.gridConfigurationProvider.getConfiguration(this.company, this.componentId)
            .subscribe((configuration) => {
                this.initializeGridColumns();
                // -- used later if this will become L&S maybe
                // this.columnConfiguration = configuration.columns;
                // this.configurationLoaded.emit();
                // this.initColumns(this.columnConfiguration);
                this.hasGridSharing = configuration.hasMultipleViewsPerUser;
            });
    }

    onGridReady(params) {
        params.columnDefs = this.costContractGridColumns;
        this.costContractGridOptions = params;
        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;
        this.gridApi.showNoRowsOverlay();
        this.autoSizeContractsGrid();
    }

    autoSizeContractsGrid() {
        if (this.gridColumnApi !== undefined) {
            const allColumnIds = [];
            if (this.costContractGridColumns) {
                this.costContractGridColumns.forEach((columnDefs) => {
                    allColumnIds.push(columnDefs.field);
                });
            }
            this.gridColumnApi.autoSizeColumns(allColumnIds);
        }
    }

    onGridSizeChanged(params) {
        this.autoSizeContractsGrid();
    }

    initializeGridColumns() {
        this.costContractGridColumns = [
            {
                headerName: 'Contract Reference',
                field: 'contractReference',
                colId: 'contractReference',
                hide: false,
                headerCheckboxSelection: true,
                checkboxSelection: true,
            },
            {
                headerName: 'Commodity',
                field: 'principalCommodity',
                colId: 'principalCommodity',
                hide: false,
            },
            {
                headerName: 'Supplier',
                field: 'supplierCode',
                colId: 'supplierCode',
                hide: false,
            },
            {
                headerName: 'Contract Term',
                field: 'contractTermCode',
                colId: 'contractTermCode',
                hide: false,
            },
            {
                headerName: 'Charter Reference',
                field: 'charterReference',
                colId: 'charterReference',
                hide: false,
            },
            {
                headerName: 'Contract Quantity',
                field: 'quantity',
                colId: 'quantity',
                hide: false,
                valueFormatter: this.amountFormatter.bind(this),
                editable: this.onRowSelectionChanged.bind(this),
                type: 'numericColumn',
                onCellValueChanged: this.onQuantityChanged.bind(this),
            },
            {
                headerName: 'Quantity Code',
                field: 'weightCode',
                colId: 'weightCode',
                hide: false,
            },
            {
                headerName: 'Cost Type',
                field: 'costTypeCode',
                colId: 'costTypeCode',
                hide: false,
            },
            {
                headerName: 'Pay/Rec',
                field: 'costDirection',
                colId: 'costDirection',
                hide: false,
            },
            {
                headerName: 'Currency',
                field: 'currencyCode',
                colId: 'currencyCode',
                hide: false,
            },
            {
                headerName: 'Rate/Amount',
                field: 'rate',
                colId: 'rate',
                hide: false,
                valueFormatter: this.amountFormatter.bind(this),
            },
            {
                headerName: 'Cost Amount',
                field: 'costAmount',
                colId: 'costAmount',
                valueGetter: this.calculateCostAmount.bind(this),
                valueFormatter: this.formatValue.bind(this),
                hide: false,
            },
            {
                headerName: 'Cost Amount to Invoice',
                field: 'costAmountToInvoice',
                colId: 'costAmountToInvoice',
                editable: this.onRowSelectionChanged.bind(this),
                valueSetter: this.setCostAmountToInvoice.bind(this),
                valueFormatter: this.formatValue.bind(this),
                onCellValueChanged: this.onQuantityChanged.bind(this),
                hide: false,
            },
            {
                headerName: '%Invoiced',
                field: 'invoicePercent',
                colId: 'invoicePercent',
                hide: false,
                valueSetter: this.setInvoicePercent.bind(this),
                valueFormatter: this.formatValue.bind(this),
                editable: this.onRowSelectionChanged.bind(this),
            },
            {
                headerName: 'Narrative',
                field: 'narrative',
                colId: 'narrative',
                hide: false,
            },
        ];
    }

    onRowSelectionChanged(event): boolean {
        const isSelected = event.node.selected ? true : false;
        return isSelected;
    }

    formatValue(param) {
        if (isNaN(param.value) || param.value === null) { return ''; }
        return new Intl.NumberFormat(this.formatType, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(param.value);
    }

    amountFormatter(param) {
        if (param && param.value) {
            const commonMethods = new CommonMethods();
            if (param.colDef.colId.toLowerCase() === 'quantity') {
                return commonMethods.getFormattedNumberValue(param.value, 3);
            } else {
                return commonMethods.getFormattedNumberValue(param.value, 4);
            }
        }
    }

    setCostAmountToInvoice(params) {
        if (params.newValue <= 0) {
            this.snackbarService.informationSnackBar('0 or negative cost cannot be invoiced');
            params.data.costAmountToInvoice = params.data.costAmount;
        } else {
            const costAmount = params.data ? params.data.costAmount : params.costAmount;
            const tolerance: number = this.tolerancePercentage * 100;
            if (this.tolerancePercentage !== ToleranceTypes.Percentage) {
                const minToleranceBand: number = costAmount -
                    (costAmount * this.tolerancePercentage);
                const maxToleranceBand: number = costAmount +
                    (costAmount * this.tolerancePercentage);
                if (params.newValue < minToleranceBand || params.newValue > maxToleranceBand) {
                    this.dialog.open(ConfirmationDialogComponent, {
                        data: {
                            title: 'Tolerance Information',
                            text: 'Cost Amount to Invoice is greater/less than ' + tolerance + '% – than the cost originally estimated',
                            okButton: 'Ok',
                        },
                    });
                }
            }
            if (params.newValue) {
                params.data.costAmountToInvoice = Number(params.newValue);
            }
        }
        return true;
    }

    calculateCostAmount(params) {
        if (this.isCostAmountChanged) {
            if (params.data.rateTypeCode === RateTypes[RateTypes.Amount]) {
                params.data.costAmount = params.data.rate;
            } else if (params.data.rateTypeCode === RateTypes[RateTypes.Percent]) {
                params.data.costAmount = (Number(params.data.quantity) * params.data.price * params.data.rate * params.data.priceConversionFactor * params.data.weightConversionFactor / 100);
            } else if (params.data.rateTypeCode === RateTypes[RateTypes.Rate]) {
                params.data.costAmount =
                    Number(params.data.quantity) * params.data.priceConversionFactor * (params.data.weightConversionFactor) * params.data.rate;
            }
        }
        return params.data.costAmount;
    }

    calculateCostAmountOnSelection(contract) {
        if (contract.rateTypeCode === RateTypes[RateTypes.Amount]) {
            contract.costAmount = contract.rate;
        } else if (contract.rateTypeCode === RateTypes[RateTypes.Percent]) {
            contract.costAmount = (Number(contract.quantity) * contract.price * contract.weightConversionFactor * contract.priceConversionFactor * contract.rate / 100);
        } else if (contract.rateTypeCode === RateTypes[RateTypes.Rate]) {
            contract.costAmount =
                Number(contract.quantity) * contract.priceConversionFactor * (contract.weightConversionFactor) * contract.rate;
        }
        return contract.costAmount;
    }

    getContractsToInvoice(sectionIds: number[], contracts: ContractsToInvoice[]) {
        this.isLoading = true;
        this.subscriptions.push(this.executionService.getCostForSelectedContracts(sectionIds)
            .subscribe((data) => {
                this.contractsToInvoice = data.value;
                contracts.forEach(
                    (selectedContractToInvoice: ContractsToInvoice) => {
                        this.contractsToInvoice.forEach((contractToInvoice: ContractsToCostInvoice) => {
                            if (contractToInvoice.sectionId === selectedContractToInvoice.sectionId) {
                                const oldContractQuantity = contractToInvoice.quantity;
                                const contractQuantity = selectedContractToInvoice.quantityToInvoice.toString();
                                contractToInvoice.quantityToInvoice = selectedContractToInvoice.quantityToInvoice;
                                contractToInvoice.originalQuantity = oldContractQuantity;
                            }
                        });

                    },
                );

                this.initializeGridColumns();
                this.costContractGridRows = this.contractsToInvoice;
                this.dataLength = this.costContractGridRows.length;
                this.autoSizeContractsGrid();
                this.isLoading = false;
                if (this.dataLength) {
                    this.counterParty = this.costContractGridRows[0].supplierCode;
                }

            }));
    }

    onSelectionChanged(event) {
        const invoicedPercentage: number = 100;
        this.isApportionDisable = true;
        this.isApportion = true;
        const selectedRows: ContractsToCostInvoice[] = this.gridApi.getSelectedRows();
        if (!event.node.selected) {
            event.data.costAmountToInvoice = null;
            event.data.invoicePercent = null;
            event.data.costAmountToInvoice = null;
            event.data.invoicePercent = null;
            event.data.quantity = null;
        } else {
            selectedRows.forEach(
                (selectedContract: ContractsToCostInvoice) => {
                    if (!selectedContract.costAmount) {
                        selectedContract.costAmountToInvoice = this.calculateCostAmountOnSelection(selectedContract);
                        selectedContract.invoicePercent = invoicedPercentage;
                        this.setCostAmountToInvoice(selectedContract);
                    } else {
                        selectedContract.costAmountToInvoice = selectedContract.costAmount;
                        selectedContract.invoicePercent = invoicedPercentage;
                        this.setCostAmountToInvoice(selectedContract);
                    }
                    const oldContractQuantity = selectedContract.quantity;
                    if (selectedContract.quantityToInvoice) {
                        selectedContract.quantity = selectedContract.quantityToInvoice.toString();
                        selectedContract.quantityToInvoice = null;
                        this.quantityOnSelectionChanged(selectedContract.quantity, oldContractQuantity, selectedContract);
                    } else if (!selectedContract.quantity) {
                        selectedContract.quantity = selectedContract.originalQuantity;
                        selectedContract.invoicePercent = invoicedPercentage;
                        selectedContract.costAmountToInvoice = this.calculateCostAmountOnSelection(selectedContract);
                        this.quantityOnSelectionChanged(selectedContract.quantity, selectedContract.quantity, selectedContract);
                    } else {
                        selectedContract.invoicePercent = invoicedPercentage;
                        selectedContract.costAmountToInvoice = this.calculateCostAmountOnSelection(selectedContract);
                        this.quantityOnSelectionChanged(selectedContract.quantity, selectedContract.originalQuantity, selectedContract);
                    }
                },
            );

            if (selectedRows.length > 1) {
                let costDirection: string;
                let costTypeCode: string;
                this.isApportionDisable = false;
                for (const row of selectedRows) {
                    if (!costDirection && row) {
                        costDirection = row.costDirection;
                    }
                    if (!costTypeCode && row) {
                        costTypeCode = row.costTypeCode;
                    }
                    if (row && ((costDirection !== row.costDirection)
                        || (costTypeCode !== row.costTypeCode))) {
                        this.isApportion = false;
                    }
                }

            }
        }
        this.isContractSelected = selectedRows.length > 0;
        this.costContractsSelected.emit(this.isContractSelected);
        this.selectedCostContracts = selectedRows;
    }

    onColumnVisibilityChanged(col) {
        this.userPreferencesComponent.onChangeColumnVisibility(col);
        this.autoSizeContractsGrid();
    }

    setTolerancePercentage(tolerancePercentage) {
        this.tolerancePercentage = tolerancePercentage;
    }

    onRowDataChanged(params) {
        if (this.counterParty) {
            const counterPartyFilterComponent = this.gridApi.getFilterInstance('supplierCode');
            counterPartyFilterComponent.setModel({
                type: 'set',
                values: [this.counterParty],
            });
            this.gridApi.onFilterChanged();
        }
    }
    onQuantityChanged(params) {
        let validQuantity = true;
        if (params.newValue > params.data.originalQuantity) {
            validQuantity = false;
            params.data.quantity = Number(params.oldValue);

        } else {
            params.data.quantity = Number(params.newValue);
        }

        if (!validQuantity) {
            this.snackbarService.informationSnackBar('Quantity cannot be greater than contract quantity');
        } else {
            if (params && params.data) {
                const invoicePercercentage = (100 * params.newValue) / params.oldValue;
                params.data.invoicePercent = (params.data.invoicePercent * invoicePercercentage) / 100;
                params.data.costAmount = (params.data.costAmount * invoicePercercentage) / 100;
                params.data.costAmountToInvoice = (params.data.costAmountToInvoice * invoicePercercentage) / 100;

            }
        }

        if (this.gridApi) {
            this.gridApi.refreshCells(params.data);
        }
    }

    quantityOnSelectionChanged(quantity: string, oldQuantity: string, contractToInvoice: ContractsToCostInvoice) {
        if (quantity) {
            const invoicePercercentage = (100 * parseInt(quantity)) / parseInt(oldQuantity);

            contractToInvoice.invoicePercent = (contractToInvoice.invoicePercent * invoicePercercentage) / 100;
            contractToInvoice.costAmount = (contractToInvoice.costAmount * invoicePercercentage) / 100;
            contractToInvoice.costAmountToInvoice = (contractToInvoice.costAmountToInvoice * invoicePercercentage) / 100;
        }

    }

    onApportionButtonClicked() {
        if (this.isApportion) {
            this.getTotalQuantityAndTotalInvoiceValue();
            const openApportiontDialog = this.dialog.open(ApportionDialogComponent, {
                width: '40%',
                height: '60%',
                data: {
                    selectedRows: this.selectedCostContracts,
                    totalQuantity: this.totalQuantity,
                    totalInvoiceValue: this.totalInvocieValue,
                },

            });

            openApportiontDialog.afterClosed().subscribe((updatedCostContracts: ContractsToCostInvoice[]) => {
                this.updateSelectedCostRows(updatedCostContracts);
                this.isCostAmountChanged = false;
            });
        } else {
            this.snackbarService.informationSnackBar('Apportion Cannot be done for multiple costs types or if there is a mix of Pay/Rec');
        }
    }

    getTotalQuantityAndTotalInvoiceValue() {
        this.totalQuantity = 0;
        this.totalInvocieValue = 0;
        if (this.selectedCostContracts) {
            this.selectedCostContracts.forEach((costContract) => {
                this.totalQuantity += Number(costContract.quantity);
                this.totalInvocieValue += costContract.costAmountToInvoice;
            });
        }
    }

    updateSelectedCostRows(updatedCostContracts: ContractsToCostInvoice[]) {
        if (updatedCostContracts) {
            this.gridApi.updateRowData({ update: updatedCostContracts });
        }
    }

    setInvoicePercent(params): boolean {
        if (params.newValue <= 0 || !params.data.invoicePercent) {
            this.snackbarService.informationSnackBar('Invoice Percentage cannot be 0 or negative');
            params.data.invoicePercent = params.oldValue < 1 ? 1 : params.oldValue;
        } else if (params.newValue > 100) {
            this.snackbarService.informationSnackBar('Invoice Percentage cannot be greater than 100');
            params.data.invoicePercent = params.oldValue < 100 ? params.oldValue : 100;
        } else if ((params.newValue > params.oldValue)) {
            this.snackbarService.informationSnackBar('Invoice Percentage cannot be greater available percentage');
            params.data.invoicePercent = params.oldValue;
        } else {
            params.data.invoicePercent = params.newValue;
        }
        return true;
    }
}
