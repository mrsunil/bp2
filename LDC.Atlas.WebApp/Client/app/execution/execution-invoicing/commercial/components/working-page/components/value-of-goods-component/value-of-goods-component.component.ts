import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as agGrid from 'ag-grid-community';
import { map } from 'rxjs/operators';
import { AgGridUserPreferencesComponent } from '../../../../../../../shared/components/ag-grid-user-preferences/ag-grid-user-preferences.component';
import { BaseFormComponent } from '../../../../../../../shared/components/base-form-component/base-form-component.component';
import { AtlasAgGridParam } from '../../../../../../../shared/entities/atlas-ag-grid-param.entity';
import { InvoiceLineRecord } from '../../../../../../../shared/entities/invoice-line-record.entity';
import { MasterData } from '../../../../../../../shared/entities/masterdata.entity';
import { CostDirectionType } from '../../../../../../../shared/enums/cost-direction-type.enum';
import { CostSigns } from '../../../../../../../shared/enums/cost-sign.enum';
import { DiscountBasis } from '../../../../../../../shared/enums/discount-basis.enum';
import { DiscountTypes } from '../../../../../../../shared/enums/discount-type.enum';
import { InvoiceTypes } from '../../../../../../../shared/enums/invoice-type.enum';
import { PricingOptions } from '../../../../../../../shared/enums/pricing-options.enum';
import { AgGridService } from '../../../../../../../shared/services/ag-grid.service';
import { ContractsToInvoice } from '../../../../../../../shared/services/execution/dtos/contracts-to-invoice';
import { InvoiceRecord } from '../../../../../../../shared/services/execution/dtos/invoice-record';
import { InvoiceSummaryRecord } from '../../../../../../../shared/services/execution/dtos/invoice-summary-record';
import { FormConfigurationProviderService } from '../../../../../../../shared/services/form-configuration-provider.service';
import { GridConfigurationProviderService } from '../../../../../../../shared/services/grid-configuration-provider.service';
import { UiService } from '../../../../../../../shared/services/ui.service';

@Component({
    selector: 'atlas-value-of-goods-component',
    templateUrl: './value-of-goods-component.component.html',
    styleUrls: ['./value-of-goods-component.component.scss'],
})
export class CommercialValueOfGoodsComponent extends BaseFormComponent implements OnInit {
    @ViewChild('userPreferences') userPreferencesComponent: AgGridUserPreferencesComponent;

    @Output() readonly totalAmountCalculated = new EventEmitter<any>();
    @Output() readonly costCurrency = new EventEmitter<any>();
    @Input() defaultWeightCode: string;

    company: string;
    valueOfGoodsGridOptions: agGrid.GridOptions = {};
    valueOfGoodsGridColumns: agGrid.ColDef[];
    atlasAgGridParam: AtlasAgGridParam;
    gridColumnApi: agGrid.ColumnApi;
    valueOfGoodsGridRows: ContractsToInvoice[];
    isGroupingEnabled: boolean = false;
    totalQuantity: number = 0;
    total: number = 0;
    weightCode: string = '';
    currencyCode: string = '';
    pricingOptionValue: number = 0;
    decimalOptionValue: number = 2;
    weightedAverage: number = 0;
    contractsForWeightedAverage: ContractsToInvoice[];
    invoiceType: number;
    debitCredit: string = '';
    componentId: string = 'valueOfGoodsGrid';
    hasGridSharing: boolean = false;
    formatType: string = 'en-US';
    rowGroupPanelShow: string;
    debitCreditSign: string;
    defaultConversionFactor: number = 0;
    masterdata: MasterData = new MasterData();

    constructor(protected formConfigurationProvider: FormConfigurationProviderService,
        private route: ActivatedRoute,
        protected uiService: UiService,
        private gridConfigurationProvider: GridConfigurationProviderService,
        public gridService: AgGridService,
    ) {
        super(formConfigurationProvider);
        this.atlasAgGridParam = this.gridService.getAgGridParam();
    }

    ngOnInit() {
        this.masterdata = this.route.snapshot.data.masterdata;
        this.invoiceType = Number(decodeURIComponent(this.route.snapshot.paramMap.get('invoiceTypeId')));
        this.route.paramMap
            .pipe(
                map((params) => params.get('company')),
            )
            .subscribe((company) => {
                this.company = company;
            });

        this.gridConfigurationProvider.getConfiguration(this.company, this.componentId)
            .subscribe((configuration) => {
                this.initializeGridColumns();
                // -- used later if this will become L&S maybe
                // this.columnConfiguration = configuration.columns;
                // this.configurationLoaded.emit();
                // this.initColumns(this.columnConfiguration);
                this.hasGridSharing = configuration.hasMultipleViewsPerUser;
            });
        const defaultWeightCodeSetup = this.masterdata.weightUnits.find((weightUnit) =>
            weightUnit.weightCode === this.defaultWeightCode);
        if (defaultWeightCodeSetup) {
            this.defaultConversionFactor = defaultWeightCodeSetup.conversionFactor;
        }
    }

    onGridReady(params) {
        params.columnDefs = this.valueOfGoodsGridColumns;
        this.valueOfGoodsGridOptions = params;
        this.gridColumnApi = params.columnApi;

        this.autoSizeGridHeader();
    }
    autoSizeGridHeader() {
        const allColumnIds = [];
        if (this.valueOfGoodsGridColumns) {
            this.valueOfGoodsGridColumns.forEach((columnDefs) => {
                allColumnIds.push(columnDefs.field);
            });
            this.gridColumnApi.autoSizeColumns(allColumnIds);
        }
    }

    onGridSizeChanged(params) {
        this.autoSizeGridHeader();
    }

    initializeGridColumns() {
        this.valueOfGoodsGridColumns = [
            {
                headerName: 'Contract Commodity',
                field: 'commodity',
                colId: 'commodity',
                hide: false,
                rowGroup: this.isGroupingEnabled,
                enableRowGroup: this.isGroupingEnabled,
            },
            {
                headerName: 'Price',
                field: 'price',
                colId: 'price',
                type: 'numericColumn',
                hide: false,
                valueFormatter: (params) => (this.decimalFormatter(
                    (!params.node.group ? params.data.price : params.value),
                    this.decimalOptionValue,
                    this.formatType)),
                rowGroup: this.isGroupingEnabled,
                enableRowGroup: this.isGroupingEnabled,
                aggFunc: 'sum',
                enableValue: true,
            },
            {
                headerName: 'Premium/Discount',
                field: 'premiumDiscountValue',
                colId: 'premiumDiscountValue',
                valueFormatter: this.formatPremiumDiscount,
                hide: false,
            },
            {
                headerName: 'Contract Reference',
                field: 'contractReference',
                colId: 'contractReference',
                hide: false,
            },
            {
                headerName: 'Quantity To Invoice',
                field: 'quantityToInvoice',
                colId: 'quantityToInvoice',
                type: 'numericColumn',
                hide: false,
                aggFunc: 'sum',
                enableValue: true,
                valueFormatter: (params) => (this.decimalFormatter(
                    (!params.node.group ? params.data.quantityToInvoice : params.value),
                    this.decimalOptionValue,
                    this.formatType)),
            },
            {
                headerName: 'Quantity Code',
                field: 'quantityCode',
                colId: 'quantityCode',
                hide: true,
            },
            {
                headerName: 'Currency Code',
                field: 'currencyCode',
                colId: 'currencyCode',
                hide: true,
            },
            {
                headerName: 'Invoice Value',
                field: 'totalInvoiceValue',
                colId: 'totalInvoiceValue',
                type: 'numericColumn',
                hide: false,
                valueFormatter: (params) => (this.decimalFormatter(
                    (!params.node.group ? params.data.totalInvoiceValue : params.value),
                    this.decimalOptionValue,
                    this.formatType)),
                aggFunc: 'sum',
                enableValue: true,
                valueGetter: this.getInvoiceValue.bind(this),
            },
            {
                headerName: 'Contract Quantity',
                field: 'contractQuantity',
                colId: 'contractQuantity',
                type: 'numericColumn',
                hide: false,
                valueFormatter: (params) => (this.decimalFormatter(
                    (!params.node.group ? params.data.contractQuantity : params.value),
                    this.decimalOptionValue,
                    this.formatType)),
            },
        ];
        this.rowGroupPanelShow = this.isGroupingEnabled ? 'always' : '';
    }

    formatPremiumDiscount(params) {
        if (params.data.premiumDiscountType === DiscountTypes.Premium) {
            return '+' + params.data.premiumDiscountValue;
        } else if (params.data.premiumDiscountType === DiscountTypes.Discount) {
            return '-' + params.data.premiumDiscountValue;
        } else {
            return params.data.premiumDiscountValue;
        }
    }

    getInvoiceValue(params) {
        if (params.data.quantityToInvoice && params.data.price &&
            params.data.priceConversionFactor && params.data.weightConversionFactor) {
            if (params.data.premiumDiscountType === DiscountTypes.Premium) {
                params.data.totalInvoiceValue = this.SetInvoiceValueForPremium(params.data);
            } else if (params.data.premiumDiscountType === DiscountTypes.Discount) {
                params.data.totalInvoiceValue = this.setInvoiceValueForDiscount(params.data);
            }
        }
        this.calculateTotalAndTotalQuantity();
        return params.data.totalInvoiceValue;
    }

    private setInvoiceValueForDiscount(params: ContractsToInvoice): number {
        if (params) {
            if (params.premiumDiscountBasis === DiscountBasis.Rate) {
                return params.quantityToInvoice *
                    (params.price - params.premiumDiscountValue) *
                    params.priceConversionFactor * params.weightConversionFactor;
            } else if (params.premiumDiscountBasis === DiscountBasis.Percent) {
                return params.quantityToInvoice *
                    (params.price * (1 - (params.premiumDiscountValue / 100))) *
                    params.priceConversionFactor * params.weightConversionFactor;
            } else {
                return params.quantityToInvoice * params.price *
                    params.priceConversionFactor * params.weightConversionFactor;
            }
        }
    }

    private SetInvoiceValueForPremium(params: ContractsToInvoice): number {
        if (params) {
            if (params.premiumDiscountBasis === DiscountBasis.Rate) {
                return params.quantityToInvoice *
                    (params.price + params.premiumDiscountValue) *
                    params.priceConversionFactor * params.weightConversionFactor;
            } else if (params.premiumDiscountBasis === DiscountBasis.Percent) {
                return params.quantityToInvoice *
                    (params.price * (1 + (params.premiumDiscountValue / 100))) *
                    params.priceConversionFactor * params.weightConversionFactor;
            } else {
                return params.quantityToInvoice * params.price *
                    params.priceConversionFactor * params.weightConversionFactor;
            }
        }
    }

    decimalFormatter(input, decimaloption: number, format: string) {
        const formattedInput = new Intl.NumberFormat(format,
            { minimumFractionDigits: decimaloption }).format(input);
        return formattedInput.toLocaleString();
    }

    calculateWeightedAverage() {

        // calculating the weighted average of each selected contract
        this.contractsForWeightedAverage.forEach(
            (contract) => {
                this.weightedAverage += contract.price * contract.quantityToInvoice;
            },
        );
        // Assigning the calculated weighted average to the price of each selected contract
        this.contractsForWeightedAverage.forEach(
            (contract) => {
                contract.price = this.weightedAverage / this.totalQuantity;
            },
        );
        this.initializeGridColumns();
        this.valueOfGoodsGridRows = this.contractsForWeightedAverage;
    }

    formatQuantityAndTotal(input: number) {
        const formattedInput = new Intl.NumberFormat(this.formatType,
            { minimumFractionDigits: this.decimalOptionValue }).format(input);
        return formattedInput.toLocaleString();
    }

    contractToBeSelected(contracts: ContractsToInvoice[]) {
        if (contracts.length > 0) {
            this.calculateTotalQuantity(contracts);
            this.isGroupingEnabled = (this.pricingOptionValue === PricingOptions.GroupbycommodityPrice);
            if (this.pricingOptionValue === PricingOptions.OutrightAverage) {
                // creating copy of selected contracts, so the calculations are not impacting the original price
                this.contractsForWeightedAverage = contracts.map((x) => ({ ...x }));
                this.calculateWeightedAverage();
            } else {
                this.valueOfGoodsGridRows = contracts;
                this.initializeGridColumns();
            }
        }
    }

    calculateTotalAndTotalQuantity() {
        this.totalQuantity = 0;
        this.total = 0;
        this.valueOfGoodsGridOptions.api.forEachNode((rowNode) => {
            if (rowNode.data.totalInvoiceValue) {
                this.total += rowNode.data.totalInvoiceValue;
                if (this.defaultConversionFactor && this.defaultConversionFactor != 0) {
                    this.totalQuantity += (rowNode.data.quantityToInvoice *
                        rowNode.data.weightConversionFactor) / this.defaultConversionFactor;
                } else {
                    this.totalQuantity += rowNode.data.quantityToInvoice;

                }
            }
        },
        );
        if (this.valueOfGoodsGridRows.length > 0) {
            this.weightCode = this.defaultWeightCode ? this.defaultWeightCode : this.valueOfGoodsGridRows[0].quantityCode;
            this.currencyCode = this.valueOfGoodsGridRows[0].currencyCode;
            this.costCurrency.emit(this.currencyCode);
        }
        this.debitCredit = (this.invoiceType === InvoiceTypes.Purchase) ? 'Cr' : 'Dr';
        this.debitCreditSign = CostSigns[CostDirectionType[this.debitCredit]];
        this.totalAmountCalculated.emit({
            amount: this.total,
            decimalOption: this.decimalOptionValue,
            currencyCode: this.currencyCode,
            debitCredit: this.debitCredit,
        });

    }

    calculateTotalQuantity(contracts: ContractsToInvoice[]) {
        this.totalQuantity = 0;
        contracts.forEach(
            (contract) => {
                this.totalQuantity = this.totalQuantity + contract.quantityToInvoice;
            },
        );
    }

    pricingAndDecimalOptionSelected(pricingOption: number, decimalOption: number) {
        this.pricingOptionValue = pricingOption;
        this.decimalOptionValue = decimalOption;
    }

    populateEntity(entity: any): any {
        const valueOfGoods = entity as InvoiceRecord;
        valueOfGoods.currency = this.currencyCode;
        valueOfGoods.totalGoodsValue = this.totalQuantity;
        valueOfGoods.totalInvoiceValue = this.total;
        valueOfGoods.invoiceLines = this.getInvoiceLines();
        return valueOfGoods;
    }

    onColumnVisibilityChanged(col) {
        this.userPreferencesComponent.onChangeColumnVisibility(col);
        this.autoSizeGridHeader();
    }

    getInvoiceLines() {
        const invoiceLines: InvoiceLineRecord[] = [];
        this.valueOfGoodsGridRows.map((data, index) => {
            const invoiceLine = new InvoiceLineRecord();
            invoiceLine.lineNumber = index + 1;
            invoiceLine.sectionID = data.sectionId;
            invoiceLine.price = data.price;
            invoiceLine.quantity = data.quantityToInvoice.toString();
            invoiceLine.priceUnitId = data.priceUnitId;
            invoiceLine.weightUnitId = data.quantityUnitId;
            invoiceLine.currencyCode = data.currencyCode;
            invoiceLine.lineAmount = data.totalInvoiceValue;
            invoiceLine.invoicePercent = (data.quantityToInvoice / data.contractQuantity) * 100;
            invoiceLines.push(invoiceLine);
        });
        return invoiceLines;
    }

    /* summary redirection code */
    contractToBeSelectedFromGrid(summaryRecord: InvoiceSummaryRecord) {
        if (summaryRecord.summaryLines) {
            this.isGroupingEnabled = false;
            this.invoiceType = summaryRecord.invoiceType;
            this.currencyCode = summaryRecord.currency;
            this.valueOfGoodsGridRows = this.getContractsForSummary(summaryRecord.summaryLines, this.currencyCode);
            this.initializeGridColumnsFromSummary();
            this.calculateTotalForSummary(summaryRecord.summaryLines);
        }
    }

    contractToBeSelectedForSummary(contracts: ContractsToInvoice[], summaryRecord: InvoiceSummaryRecord[]) {
        this.valueOfGoodsGridRows = this.getContractsForSummary(summaryRecord, this.currencyCode);
        this.initializeGridColumnsFromSummary();
        this.calculateTotalForSummary(summaryRecord);
    }

    calculateTotalForSummary(summaryLines) {
        this.total = 0;
        this.totalQuantity = 0;
        summaryLines.forEach((line) => {
            this.total = line.lineAmount + this.total;
            this.totalQuantity = this.totalQuantity + line.quantity;
            this.weightCode = line.weightCode;
        });

        this.debitCredit = (this.invoiceType === InvoiceTypes.Purchase) ? 'Cr' : 'Dr';
        this.debitCreditSign = CostSigns[CostDirectionType[this.debitCredit]];
    }

    initializeGridColumnsFromSummary() {
        this.valueOfGoodsGridColumns = [
            {
                headerName: 'Contract Commodity',
                field: 'commodity',
                colId: 'commodity',
                hide: false,
                rowGroup: this.isGroupingEnabled,
                enableRowGroup: this.isGroupingEnabled,
            },
            {
                headerName: 'Price',
                field: 'price',
                colId: 'price',
                hide: false,
                valueFormatter: this.decimalFormatterForSummary.bind(this),
                aggFunc: 'sum',
                enableValue: true,
            },
            {
                headerName: 'Contract Reference',
                field: 'contractReference',
                colId: 'contractReference',
                hide: false,
            },
            {
                headerName: 'Invoiced Quantity',
                field: 'invoicedQuantity',
                colId: 'invoicedQuantity',
                type: 'numericColumn',
                hide: false,
                aggFunc: 'sum',
                enableValue: true,
                valueFormatter: this.decimalFormatterForSummary.bind(this),
            },
            {
                headerName: 'Quantity Code',
                field: 'quantityCode',
                colId: 'quantityCode',
                hide: false,
            },
            {
                headerName: 'Currency Code',
                field: 'currencyCode',
                colId: 'currencyCode',
                hide: false,
            },
            {
                headerName: 'Invoice Value',
                field: 'totalInvoiceValue',
                colId: 'totalInvoiceValue',
                hide: false,
                valueFormatter: this.decimalFormatterForSummary.bind(this),
            },
            {
                headerName: 'Contract Quantity',
                field: 'contractQuantity',
                colId: 'contractQuantity',
                type: 'numericColumn',
                hide: false,
            },
        ];
    }

    decimalFormatterForSummary(params) {
        const formattedInput = new Intl.NumberFormat(this.formatType,
            { minimumFractionDigits: this.decimalOptionValue }).format(params.value);
        return formattedInput.toLocaleString();
    }

    getContractsForSummary(summaryLines, currencyCode) {
        const contracts: ContractsToInvoice[] = [];
        summaryLines.map((record) => {
            if (record.sectionId) {
                const contract = new ContractsToInvoice();
                contract.commodity = record.principalCommodity;
                contract.price = record.price;
                contract.contractReference = record.contractReference;
                contract.invoicedQuantity = record.quantity;
                contract.quantityCode = record.weightCode;
                contract.currencyCode = currencyCode;
                contract.totalInvoiceValue = record.lineAmount;
                contract.contractQuantity = record.contractQuantity;
                contract.quantityToInvoice = record.quantity;
                contracts.push(contract);
            }
        });
        return contracts;
    }

    getInvoiceValueForSummary(params) {
        return params.data.invoicedQuantity;
    }
}
