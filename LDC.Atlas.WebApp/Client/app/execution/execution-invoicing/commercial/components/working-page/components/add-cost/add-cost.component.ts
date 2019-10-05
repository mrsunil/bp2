import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
// import { DatePipe } from '@angular/common';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import * as agGrid from 'ag-grid-community';
import { map } from 'rxjs/operators';
import { AuthorizationService } from '../../../../../../../core/services/authorization.service';
import { AgContextualMenuComponent } from '../../../../../../../shared/components/ag-contextual-menu/ag-contextual-menu.component';
import { AgGridAutocompleteComponent } from '../../../../../../../shared/components/ag-grid/autocomplete/ag-grid-autocomplete.component';
import { BaseFormComponent } from '../../../../../../../shared/components/base-form-component/base-form-component.component';
import { CellEditorSelectComponent } from '../../../../../../../shared/components/cell-editor-select/cell-editor-select.component';
import { InvoiceSetupResult } from '../../../../../../../shared/dtos/invoice-setup-result';
import { AgContextualMenuAction } from '../../../../../../../shared/entities/ag-contextual-menu-action.entity';
import { AtlasAgGridParam } from '../../../../../../../shared/entities/atlas-ag-grid-param.entity';
import { AtlasFormControl } from '../../../../../../../shared/entities/atlas-form-control';
import { CostDirection } from '../../../../../../../shared/entities/cost-direction.entity';
import { InvoiceLineRecord } from '../../../../../../../shared/entities/invoice-line-record.entity';
import { MasterData } from '../../../../../../../shared/entities/masterdata.entity';
import { Vat } from '../../../../../../../shared/entities/vat.entity';
import { CostDirections } from '../../../../../../../shared/enums/cost-direction.enum';
import { CostSigns } from '../../../../../../../shared/enums/cost-sign.enum';
import { CurrencyCodes } from '../../../../../../../shared/enums/currency-codes.enum';
import { AgGridService } from '../../../../../../../shared/services/ag-grid.service';
import { ContractsToCostInvoice } from '../../../../../../../shared/services/execution/dtos/contracts-to-cost-invoice';
import { CostInvoiceRecord } from '../../../../../../../shared/services/execution/dtos/cost-invoice-record';
import { InvoiceRecord } from '../../../../../../../shared/services/execution/dtos/invoice-record';
import { InvoiceSummaryLineRecord } from '../../../../../../../shared/services/execution/dtos/invoice-summary-line-record';
import { InvoiceSummaryRecord } from '../../../../../../../shared/services/execution/dtos/invoice-summary-record';
import { FormConfigurationProviderService } from '../../../../../../../shared/services/form-configuration-provider.service';
import { ExecutionService } from '../../../../../../../shared/services/http-services/execution.service';
import { SnackbarService } from '../../../../../../../shared/services/snackbar.service';
import { UiService } from '../../../../../../../shared/services/ui.service';

@Component({
    selector: 'atlas-add-cost',
    templateUrl: './add-cost.component.html',
    styleUrls: ['./add-cost.component.scss'],
})
export class AddCostComponent extends BaseFormComponent implements OnInit {

    invoiceCostMenuActions: { [key: string]: string } = {
        deleteInvoiceCost: 'delete',
    };
    @Output() readonly totalCostAndVatCode = new EventEmitter<any>();
    costVatCodeCtrl = new AtlasFormControl('CostVatCode');
    useGoodsTaxCodeCtrl = new AtlasFormControl('UseGoodsTaxCode');
    @Output() readonly narrativeLength = new EventEmitter<boolean>();
    @Input() invoiceSetupData: InvoiceSetupResult;
    @Input() selectedGoodsVat: string;

    company: string;
    costDirections: CostDirection[];
    selectedCostGridOptions: agGrid.GridOptions = {};
    selectedCostGridColumns: agGrid.ColDef[];
    atlasAgGridParam: AtlasAgGridParam;
    gridApi: agGrid.GridApi;
    gridColumnApi: agGrid.ColumnApi;
    selectedCostGridRows: ContractsToCostInvoice[] = [];

    invoiceType: number;
    componentId: string = 'selectedCost';
    isAddRow: boolean;
    rowSelection: string;
    masterData: MasterData;
    invoicedPercentage: number = 100;
    currencyCodeSelected: string;
    gridComponents = {
        atlasSelect: CellEditorSelectComponent,
    };
    gridContext = {
        gridEditable: false,
    };
    costVatCodeOptions: Vat[];
    taxRateCalculated: number = 0;
    vatRate: number[];

    total: number = 0;
    taxTotal: number = 0;
    totalCostDirection: string;
    costDirectionDisplay: string = '';
    debit: string = 'Dr';
    credit: string = 'Cr';
    vatCodeAvailable: Vat[];
    currencyCode: string = '';
    pricingOptionValue: number = 0;
    decimalOptionValue: number = 2;
    formatType: string = 'en-US';
    defaultVatCode: string;
    isAdditionalCostForSummary: boolean = false;
    selectedCostVat: string;
    costNarrativePrefix: string = 'ADD ';
    userActiveDirectoryName: string;
    totalCostDirectionSign: string;
    addNewLineCtrl = new AtlasFormControl('addNewLineCtrl');
    invoiceCostGridContextualMenuActions: AgContextualMenuAction[];
    inPNL: boolean = false;
    noAction: boolean = false;

    constructor(private executionService: ExecutionService, protected formBuilder: FormBuilder,
        protected formConfigurationProvider: FormConfigurationProviderService,
        private route: ActivatedRoute,
        protected uiService: UiService,
        // private datePipe: DatePipe,
        private authorizationService: AuthorizationService,
        protected snackbar: SnackbarService,
        public gridService: AgGridService) {
        super(formConfigurationProvider);
        this.atlasAgGridParam = this.gridService.getAgGridParam();
        this.userActiveDirectoryName = this.authorizationService.getCurrentUser().samAccountName;
    }

    ngOnInit() {
        this.invoiceType = Number(decodeURIComponent(this.route.snapshot.paramMap.get('invoiceTypeId')));
        this.company = this.route.snapshot.paramMap.get('company');
        this.masterData = this.route.snapshot.data.masterdata;
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
        this.gridContext.gridEditable = false;
        this.costVatCodeOptions = this.masterData.vats;
        this.costVatCodeCtrl.patchValue(this.masterData.vats[0].vatCode);
        this.selectedCostVat = this.costVatCodeCtrl.value;
        this.init();
        this.initializeGridColumns();
        this.addNewLineCtrl.patchValue(1);
        this.useGoodsTaxCodeCtrl.patchValue(true);
        this.onChanges();
    }

    init() {
        this.invoiceCostGridContextualMenuActions = [
            {
                icon: 'delete',
                text: 'Delete',
                action: this.invoiceCostMenuActions.deleteInvoiceCost,
            },
        ];
    }

    handleAction(action: string, costLine: ContractsToCostInvoice) {
        switch (action) {
            case this.invoiceCostMenuActions.deleteInvoiceCost:
                this.onDeleteSelectedButtonClicked(costLine);
                break;
            default:
                break;
        }
    }

    getFormGroup() {
        this.formGroup = this.formBuilder.group({
            costVatCodeCtrl: this.costVatCodeCtrl,
            useGoodsTaxCodeCtrl: this.useGoodsTaxCodeCtrl,
        });
        return super.getFormGroup();
    }

    onChanges() {
        this.useGoodsTaxCodeCtrl.valueChanges.subscribe((val) => {
            if (val) {
                this.onUseGoodsTaxCodeToggleChange(this.selectedGoodsVat);
            } else {
                this.onUseGoodsTaxCodeToggleChange(this.selectedCostVat);
            }
        });
    }

    onUseGoodsTaxCodeToggleChange(value: string) {
        if (value) {
            this.costVatCodeCtrl.patchValue(value);
            const changedVatCode = [];
            this.gridApi.forEachNode((rowNode) => {
                if (rowNode.data) {
                    const data = rowNode.data;
                    data.vatCode = value;
                    changedVatCode.push(data);
                }
            });
            this.gridApi.updateRowData({ update: changedVatCode });
            this.calculateTotalOnUpdateGrid();
        }
    }

    setVatCodeAvailable() {
        if (this.selectedGoodsVat) {
            this.costVatCodeCtrl.patchValue(this.selectedGoodsVat);
            this.vatCodeAvailable = this.masterData.vats.filter((option) => option.vatCode === this.selectedGoodsVat);
            this.totalCostAndVatDetails();
        }
    }

    onGridReady(params) {
        this.gridApi = params.api;
        params.columnDefs = this.selectedCostGridColumns;
        this.selectedCostGridOptions = params;
        this.gridColumnApi = params.columnApi;
        this.autoSizeGridHeader();
        this.gridColumnApi.autoSizeAllColumns();
        window.onresize = () => {
            this.gridColumnApi.autoSizeAllColumns();
        };
    }
    autoSizeGridHeader() {
        const allColumnIds = [];
        this.selectedCostGridColumns.forEach((columnDefs) => {
            allColumnIds.push(columnDefs.field);
        });
        this.gridColumnApi.autoSizeColumns(allColumnIds);
    }

    onGridSizeChanged(params) {
        this.autoSizeGridHeader();
    }

    initializeGridColumns() {
        this.selectedCostGridOptions = {
            context: this.gridContext,
        };
        this.selectedCostGridColumns = [
            {
                headerName: 'Cost Type',
                field: 'costTypeCode',
                colId: 'costTypeCode',
                hide: false,
                width: 250,
                minWidth: 250,
                maxWidth: 250,
                suppressSizeToFit: true,
                cellRendererFramework: AgGridAutocompleteComponent,
                cellRendererParams: {
                    context: this.masterData,
                    options: this.masterData.costTypes.filter((cost) => cost.isATradeCost === true)
                        .sort((a, b) => a.costTypeCode.localeCompare(b.costTypeCode)),
                    valueProperty: 'costTypeCode',
                    codeProperty: 'costTypeCode',
                    isRequired: true,
                    displayProperty: 'name',

                },
                onCellValueChanged: this.onCostTypeChange.bind(this),
            },
            {
                headerName: '%Invoiced',
                field: 'percentageInvoiced',
                colId: 'percentageInvoiced',
                valueGetter: this.getpercentageInvoiced.bind(this),
                hide: false,
            },
            {
                headerName: 'Currency',
                field: 'currencyCode',
                colId: 'currencyCode',
                hide: false,
            },
            {
                headerName: 'Pay/Rec',
                field: 'costDirection',
                colId: 'costDirection',
                hide: false,
                editable: this.isGridEditable,
                cellRenderer: this.requiredCell.bind(this),
                cellEditor: 'agRichSelectCellEditor',
                cellEditorParams: {
                    values: this.costDirections.map((costDirection) => costDirection.costDirection),
                    displayPropertyName: 'costDirection',
                    valuePropertyName: 'costDirection',
                    displayFormat: 'costDirection',
                },
                onCellValueChanged: this.onCostDirectionChange.bind(this),
            },
            {
                headerName: 'VAT Code',
                field: 'vatCode',
                colId: 'vatCode',
                hide: false,
                editable: true,
                cellRenderer: this.requiredCell.bind(this),
                cellEditor: 'agRichSelectCellEditor',
                cellEditorParams: {
                    values: this.masterData.vats.map((vat) => vat.vatCode),
                    displayPropertyName: 'vatCode',
                    valuePropertyName: 'vatCode',
                    displayFormat: 'vatCode',
                    context: this.masterData,
                },
                onCellValueChanged: this.onVatCodeChange.bind(this),
            },
            {
                headerName: 'Cost Amount',
                field: 'costAmountToInvoice',
                colId: 'costAmountToInvoice',
                hide: false,
                editable: this.isGridEditable,
                cellRenderer: this.requiredCell.bind(this),
                valueSetter: this.setCostAmountToInvoice,
                onCellValueChanged: this.onCostAmountToInvoiceChange.bind(this),
            },
            {
                headerName: 'Cost Narrative',
                field: 'narrative',
                colId: 'narrative',
                hide: false,
                editable: this.isGridEditable,
                valueSetter: this.setCostNarrative.bind(this),
                cellStyle: this.narrativeMaxLength.bind(this),
            },
            {
                headerName: '',
                cellRendererFramework: AgContextualMenuComponent,
                cellRendererParams: {
                    context: {
                        componentParent: this,
                        actionContext: this.gridContext,
                    },
                    menuActions: this.invoiceCostGridContextualMenuActions,
                },
                hide: this.isAdditionalCostForSummary === true,
                maxWidth: 80,
            },
        ];
        this.rowSelection = 'multiple';
    }

    isGridEditable(params): boolean {
        if (!params.data.contractReference) {
            return params.context.gridEditable;
        } else {
            return false;
        }
    }

    setCostAmountToInvoice(params): boolean {
        params.data.costAmountToInvoice = (params.newValue <= 0) ? 0 : params.newValue;
        return true;
    }

    setCostNarrative(params): boolean {
        if (params.newValue.length <= 0) {
            params.data.narrative = this.costNarrativePrefix;
        } else {
            const narrativeText = params.newValue as string;
            params.data.narrative = (narrativeText).startsWith('ADD') ? params.newValue :
                this.costNarrativePrefix.concat(params.newValue);
        }
        return true;
    }
    onCostTypeChange(params) {
        const filteredCostType = params.colDef.cellRendererParams.context.costTypes.find(
            (e) => e.costTypeCode === params.data.costTypeCode);
        if (filteredCostType) {
            this.inPNL = filteredCostType.inPNL;
            this.noAction = filteredCostType.noAction;
        }

    }

    narrativeMaxLength(params) {
        if (params.data && params.value) {
            if (params.value.length > 30) {
                this.narrativeLength.emit(true);
                this.snackbar.informationSnackBar(
                    'Narrative length should be less than 30',
                );
                return { color: 'red' };
            } else {
                this.narrativeLength.emit(false);
                return { color: 'black' };
            }
        }
        return params.value;
    }

    validate(): boolean {
        let isValid = true;
        if (this.isAddRow) {
            this.gridApi.forEachNode((rowData) => {
                if (!(rowData.data.costTypeCode && rowData.data.costDirection && rowData.data.vatCode
                    && rowData.data.costAmountToInvoice)) {
                    isValid = false;
                }
            });
        }
        return isValid;
    }

    contractToBeSelected(costContracts: ContractsToCostInvoice[]) {
        if (costContracts.length > 0) {
            this.initializeGridColumns();
            if (this.defaultVatCode) {
                costContracts.map((costContract) => costContract.vatCode = this.defaultVatCode);
            }
            this.selectedCostGridRows = costContracts;
            this.selectedCostGridOptions.pagination = (costContracts.length > 10) ? true : false;
            if (this.masterData.vats.length > 0) {
                this.costVatCodeCtrl.patchValue(this.masterData.vats[0].vatCode);
            }
            this.calculateTotalAmountAndGetVatCode(costContracts);
        }
    }

    setDefaultCurrency(currency: string) {
        if (currency) {
            this.currencyCodeSelected = currency;
        }
    }

    getpercentageInvoiced(params) {
        params.data.percentageInvoiced = this.invoicedPercentage;
        return params.data.percentageInvoiced;
    }

    onCostDirectionChange(params) {
        if (params.data.costAmountToInvoice) {
            this.calculateTotalOnUpdateGrid();
        }
        return true;
    }
    onCostAmountToInvoiceChange(params) {
        if (params.data.costDirection) {
            this.calculateTotalOnUpdateGrid();
        }
        return true;
    }

    onAddRowButtonClicked(numberOfLines: number) {
        this.isAddRow = true;
        this.gridContext.gridEditable = true;
        this.gridApi.onFilterChanged();
        for (let count = 1; count <= numberOfLines; count++) {
            const newItem = this.createNewCostRowData();
            this.gridApi.updateRowData({ add: [newItem], addIndex: 0 });
        }
    }

    onDeleteSelectedButtonClicked(costLine: ContractsToCostInvoice) {
        if (!costLine.contractReference) {
            this.total = 0;
            this.gridApi.updateRowData({ remove: [costLine] });
            this.calculationOfCRAndDR();
            this.calculateTotalOnUpdateGrid();

        } else { this.snackbar.informationSnackBar('You cannot delete a cost which is not added in Invoice Working Page'); }

    }

    calculationOfCRAndDR() {
        let totalCR: number = 0;
        let totalDR: number = 0;
        const costDirectionPay: string = 'Pay';
        this.gridApi.forEachNode((rowNode) => {
            if (rowNode.data) {
                if (rowNode.data.costDirection === costDirectionPay) {
                    totalCR = totalCR + Number(rowNode.data.costAmountToInvoice);
                } else {
                    totalDR = totalDR + Number(rowNode.data.costAmountToInvoice);
                }
            }
        });
        this.updateTotals(totalCR, totalDR);
        this.totalCostAndVatDetails();
    }

    updateTotals(totalCR, totalDR) {
        if (totalCR > totalDR) {
            this.total = totalCR - totalDR;
            this.costDirectionDisplay = this.credit;
            this.totalCostDirectionSign = CostSigns[CostDirections.Payable];
            this.totalCostDirection = CostDirections[CostDirections.Payable];
        } else {
            this.total = totalDR - totalCR;
            this.costDirectionDisplay = this.debit;
            this.totalCostDirectionSign = CostSigns[CostDirections.Receivable];
            this.totalCostDirection = CostDirections[CostDirections.Receivable];
        }
    }

    totalCostAndVatDetails() {
        this.totalCostAndVatCode.emit({
            rate: this.total,
            decimalOption: this.decimalOptionValue,
            costDirection: this.totalCostDirection,
            currencyCode: this.currencyCodeSelected,
            vatAvailable: this.vatCodeAvailable,
        });
        this.vatCodeAvailable.forEach(
            (tax) => {
                this.taxTotal = this.taxTotal + Math.abs(tax.rate);
            },
        );
    }

    createNewCostRowData() {
        const newData = new ContractsToCostInvoice();
        newData.invoicePercent = this.invoicedPercentage;
        newData.currencyCode = this.currencyCodeSelected;
        newData.narrative = this.costNarrativePrefix;
        newData.vatCode = this.defaultVatCode;
        return newData;
    }

    setDefaultVatCode(defaultVatCode) {
        this.defaultVatCode = defaultVatCode;
    }

    setTaxDataForSummary(costInvoiceRecord: CostInvoiceRecord) {
        this.selectedCostGridRows = this.getCostContractsForSummary(costInvoiceRecord);
        this.initializeGridColumns();
        this.calculateTotalForSummary(costInvoiceRecord);
    }

    getCostContractsForSummary(costInvoiceRecord: CostInvoiceRecord): ContractsToCostInvoice[] {
        const contracts: ContractsToCostInvoice[] = [];
        if (costInvoiceRecord) {
            const contract = new ContractsToCostInvoice();
            contract.vatCode = costInvoiceRecord.vatCode;
            contract.principalCommodity = costInvoiceRecord.principalCommodity;
            contract.rate = costInvoiceRecord.price;
            contract.quantity = costInvoiceRecord.quantity;
            contract.costAmountToInvoice = costInvoiceRecord.lineAmount;
            contract.invoicePercent = costInvoiceRecord.totalInvoiceValue;
            contracts.push(contract);
        }
        return contracts;
    }

    getCostDirectionIdFromCode(code: string): number {
        if (code) {
            const selectedCostDirection = this.costDirections.find(
                (e) => e.costDirection === code);
            return selectedCostDirection.costDirectionId;
        }
    }

    calculateTotalAmountAndGetVatCode(contracts: ContractsToCostInvoice[]) {
        this.total = 0;
        let totalCR: number = 0;
        let totalDR: number = 0;
        let costDirectionId: number;
        this.vatCodeAvailable = [];
        contracts.forEach(
            (contract) => {
                let vatCode: Vat[];
                // creating copy of selected vatCode, so the calculations are not impacting the original data
                vatCode = this.masterData.vats
                    .filter((vat) => (vat.vatCode === contract.vatCode)).map((x) => ({ ...x }));
                if (vatCode.length > 0) {
                    vatCode.map((code) => {
                        return code.rate = code.rate / 100 * contract.costAmountToInvoice;
                    });
                    if (this.vatCodeAvailable.length === 0) {
                        this.vatCodeAvailable.push(vatCode[0]);
                    } else {
                        this.vatCodeAvailable.map((code) =>
                            (code.vatCode === vatCode[0].vatCode) ? (code.rate = code.rate + vatCode[0].rate) :
                                this.vatCodeAvailable.push(vatCode[0]));
                    }
                }
                costDirectionId = this.getCostDirectionIdFromCode(contract.costDirection);
                if (costDirectionId === CostDirections.Payable) {
                    totalCR = totalCR + contract.costAmountToInvoice;
                } else {
                    totalDR = totalDR + contract.costAmountToInvoice;
                }
            },
        );
        if (contracts.length > 0) {
            this.currencyCode = contracts[0].currencyCode;
        }
        this.updateTotals(totalCR, totalDR);
        this.totalCostAndVatDetails();
    }

    calculateTotalOnUpdateGrid() {
        let totalCR: number = 0;
        let totalDR: number = 0;
        const costDirectionPay: string = 'Pay';
        const vatMasterData = this.masterData.vats;
        let vatCodeAvailable = [];
        this.gridApi.forEachNode((rowNode) => {
            if (rowNode.data) {
                let vatCode: Vat[] = [];
                if (rowNode.data.costDirection === costDirectionPay) {
                    totalCR = totalCR + Number(rowNode.data.costAmountToInvoice);
                } else {
                    totalDR = totalDR + Number(rowNode.data.costAmountToInvoice);
                }
                vatCode = vatMasterData
                    .filter((vat) => (vat.vatCode === rowNode.data.vatCode)).map((x) => ({ ...x }));
                if (vatCode.length > 0) {
                    vatCode.map((code) => {

                        return code.rate = code.rate / 100 * rowNode.data.costAmountToInvoice;
                    });
                    if (vatCodeAvailable.length === 0) {
                        if (rowNode.data.costDirection === costDirectionPay) {
                            vatCode[0].rate = -(vatCode[0].rate);
                        }
                        vatCodeAvailable.push(vatCode[0]);
                    } else {
                        let isAvailable: boolean = false;
                        vatCodeAvailable.map((code) => {
                            if (code.vatCode === vatCode[0].vatCode) {
                                if (vatCodeAvailable.filter((selectedVatCode) => selectedVatCode.vatCode === vatCode[0].vatCode)) {
                                    if (rowNode.data.costDirection === costDirectionPay) {
                                        vatCode[0].rate = -(vatCode[0].rate);
                                    }
                                    code.rate = code.rate + vatCode[0].rate;
                                    isAvailable = true;
                                }
                            }
                        });
                        if (!isAvailable) {
                            vatCodeAvailable = vatCodeAvailable.filter((code) => code.vatCode !== vatCode[0].vatCode);
                            if (rowNode.data.costDirection === costDirectionPay) {
                                vatCode[0].rate = -(vatCode[0].rate);
                            }
                            vatCodeAvailable.push(vatCode[0]);
                        }
                    }
                }
            }
        });

        this.updateTotals(totalCR, totalDR);
        if (this.useGoodsTaxCodeCtrl.value) {
            this.setVatCodeAvailable();
        } else {
            this.vatCodeAvailable = vatCodeAvailable.map((x) => ({ ...x }));
            this.totalCostAndVatDetails();
        }
    }

    formatQuantityAndTotal(input: number) {
        const formattedInput = new Intl.NumberFormat(this.formatType,
            { minimumFractionDigits: this.decimalOptionValue }).format(input);
        return formattedInput.toLocaleString();
    }

    calculateTotalForSummary(costInvoiceRecord: CostInvoiceRecord) {
        this.total = costInvoiceRecord.totalVatAmount;
        this.currencyCode = costInvoiceRecord.currencyCode;
    }

    onVatCodeChange(params) {
        if (params.data.costAmountToInvoice) {
            this.calculateTotalOnUpdateGrid();
        }
    }

    requiredCell(params) {
        if (params.data && params.context.gridEditable) {
            if (!params.value || params.value === '') {
                return '<div class=\'cost-cell-value-required\'>Required*</div>';
            }
        }
        return params.value;
    }

    onCostVatCodeSelected() {
        if (!this.useGoodsTaxCodeCtrl.value) {
            const vat = this.costVatCodeCtrl.value;
            this.selectedCostVat = vat;
            const changedVatCode = [];
            this.gridApi.forEachNode((rowNode) => {
                if (rowNode.data) {
                    const data = rowNode.data;
                    data.vatCode = vat;
                    changedVatCode.push(data);
                }
            });
            this.gridApi.updateRowData({ update: changedVatCode });
            this.calculateTotalOnUpdateGrid();
        }
    }

    populateEntity(entity: InvoiceRecord): InvoiceRecord {
        const selectedInvoiceCosts = entity;
        selectedInvoiceCosts.currency = this.currencyCodeSelected;
        selectedInvoiceCosts.totalInvoiceValue = this.total;
        if (selectedInvoiceCosts.invoiceLines && selectedInvoiceCosts.invoiceLines.length > 0) {
            const invoiceLines: InvoiceLineRecord[] = this.getInvoiceCostLines(selectedInvoiceCosts.invoiceLines.length);
            invoiceLines.forEach((line) => {
                selectedInvoiceCosts.invoiceLines.push(line);
            });
        } else {
            selectedInvoiceCosts.invoiceLines = this.getInvoiceCostLines();
        }
        return selectedInvoiceCosts;
    }

    getAllInvoiceCostLines(): ContractsToCostInvoice[] {
        const selectedCostRows: ContractsToCostInvoice[] = [];
        this.gridApi.forEachNode((rowData) => {
            if (rowData.data) {
                const costInvoiceline = new ContractsToCostInvoice();
                costInvoiceline.costId = rowData.data.costId;
                costInvoiceline.sectionId = rowData.data.sectionId;
                costInvoiceline.costAmountToInvoice = rowData.data.costAmountToInvoice;
                costInvoiceline.quantity = rowData.data.quantity;
                costInvoiceline.costTypeCode = rowData.data.costTypeCode;
                costInvoiceline.currencyCode = rowData.data.currencyCode;
                costInvoiceline.vatCode = rowData.data.vatCode;
                costInvoiceline.narrative = rowData.data.narrative;
                costInvoiceline.invoicePercent = this.invoicedPercentage;
                costInvoiceline.rateTypeCode = rowData.data.rateTypeCode;
                costInvoiceline.costDirection = rowData.data.costDirection;
                selectedCostRows.push(costInvoiceline);
            }
        });

        return selectedCostRows;
    }

    getInvoiceCostLines(index: number = 0): InvoiceLineRecord[] {
        const invoiceLines: InvoiceLineRecord[] = [];
        this.selectedCostGridRows = this.getAllInvoiceCostLines();
        this.selectedCostGridRows.map((data) => {
            const invoiceLine = new InvoiceLineRecord();
            invoiceLine.costID = data.costId;
            invoiceLine.sectionID = data.sectionId;
            invoiceLine.lineAmount = data.costAmountToInvoice;
            const selectedCostDirection = this.costDirections.find(
                (e) => e.costDirection === data.costDirection);
            invoiceLine.costDirectionId = selectedCostDirection ? selectedCostDirection.costDirectionId : null;
            invoiceLine.costTypeCode = data.costTypeCode;
            invoiceLine.currencyCode = data.currencyCode;
            invoiceLine.rateTypeId = 1; // RateType to be defaulted as Amount as per the FS.
            invoiceLine.vatCode = data.vatCode;
            invoiceLine.vatAmount = data.vatAmount;
            invoiceLine.invoicePercent = this.invoicedPercentage;
            invoiceLine.narrative = data.narrative;
            invoiceLine.inPL = this.inPNL;
            invoiceLine.noAct = this.noAction;
            invoiceLines.push(invoiceLine);
            index++;
        });
        return invoiceLines;
    }

    /* Code for home grid to summary redirection */

    contractToBeSelectedFromGrid(summaryRecord: InvoiceSummaryRecord) {
        if (summaryRecord) {
            this.selectedCostGridRows = this.getCostContractsForSummaryFromGrid(summaryRecord.summaryLines);
            this.initializeGridColumnsFromSummary();
            if (this.selectedCostGridRows.length > 0) {
                this.calculateTotalAmountAndGetVatCode(this.selectedCostGridRows);
            } else {
                this.currencyCodeSelected = summaryRecord.currency;
                summaryRecord.summaryLines.forEach((record) => {
                    if (record.vatCode) {
                        this.vatCodeAvailable = this.masterData.vats.filter((option) => option.vatCode === record.vatCode);
                    }
                });
                this.totalCostAndVatCode.emit({
                    rate: this.total,
                    decimalOption: this.decimalOptionValue,
                    costDirection: this.totalCostDirection,
                    currencyCode: this.currencyCodeSelected,
                    vatAvailable: this.vatCodeAvailable,
                });
            }
        }
    }

    initializeGridColumnsFromSummary() {
        this.selectedCostGridColumns = [
            {
                headerName: 'Cost Type',
                field: 'costTypeCode',
                colId: 'costTypeCode',
                hide: false,
            },
            {
                headerName: 'Cost Amount',
                field: 'costAmountToInvoice',
                colId: 'costAmountToInvoice',
                hide: false,
            },
            {
                headerName: 'Contract Commodity',
                field: 'principalCommodity',
                colId: 'principalCommodity',
                hide: false,
            },
            {
                headerName: 'Quantity',
                field: 'quantity',
                colId: 'quantity',
                hide: false,
            },
            {
                headerName: 'Price',
                field: 'rate',
                colId: 'rate',
                hide: false,
            },
            {
                headerName: '% Invoiced',
                field: 'percentageInvoiced',
                colId: 'percentageInvoiced',
                hide: false,
            },
            {
                headerName: 'Pay/Rec',
                field: 'costDirection',
                colId: 'costDirection',
                hide: false,
            },
            {
                headerName: 'VAT Code',
                field: 'vatCode',
                colId: 'vatCode',
                hide: false,
            },
        ];
    }

    getCostContractsForSummaryFromGrid(summaryLines: InvoiceSummaryLineRecord[]) {
        const contracts: ContractsToCostInvoice[] = [];
        summaryLines.map((record) => {
            if (record.costId > 0) {
                const contract = new ContractsToCostInvoice();
                contract.costTypeCode = record.costTypeCode;
                contract.principalCommodity = record.principalCommodity;
                contract.rate = record.price;
                contract.quantity = record.quantity.toString();
                contract.weightCode = record.weightCode;
                contract.costAmountToInvoice = record.lineAmount;
                contract.costDirection = record.costDirection;
                contract.vatCode = record.vatCode;
                contract.invoicePercent = record.invoicePercent;
                contracts.push(contract);
            }
        });
        return contracts;
    }

    setAllInvoiceCostLines() {
        this.selectedCostGridRows = [];
        this.gridApi.forEachNode((rowData) => {
            if (rowData.data) {
                const costInvoiceline = new ContractsToCostInvoice();
                costInvoiceline.costId = rowData.data.costId;
                costInvoiceline.sectionId = rowData.data.sectionId;
                costInvoiceline.costAmountToInvoice = rowData.data.costAmountToInvoice;
                costInvoiceline.quantity = rowData.data.quantity;
                costInvoiceline.costTypeCode = rowData.data.costTypeCode;
                costInvoiceline.currencyCode = rowData.data.currencyCode;
                costInvoiceline.vatCode = rowData.data.vatCode;
                costInvoiceline.invoicePercent = this.invoicedPercentage;
                costInvoiceline.narrative = rowData.data.narrative;
                costInvoiceline.costDirection = rowData.data.costDirection;
                this.selectedCostGridRows.push(costInvoiceline);
            }
        });

    }
}

