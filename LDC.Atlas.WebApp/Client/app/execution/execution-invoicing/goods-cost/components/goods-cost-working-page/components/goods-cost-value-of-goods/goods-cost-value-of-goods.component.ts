import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as agGrid from 'ag-grid-community';
import { map } from 'rxjs/operators';
import { AgGridUserPreferencesComponent } from '../../../../../../../shared/components/ag-grid-user-preferences/ag-grid-user-preferences.component';
import { BaseFormComponent } from '../../../../../../../shared/components/base-form-component/base-form-component.component';
import { AtlasAgGridParam } from '../../../../../../../shared/entities/atlas-ag-grid-param.entity';
import { InvoiceLineRecord } from '../../../../../../../shared/entities/invoice-line-record.entity';
import { ContractTypes } from '../../../../../../../shared/enums/contract-type.enum';
import { CostDirectionType } from '../../../../../../../shared/enums/cost-direction-type.enum';
import { CostSigns } from '../../../../../../../shared/enums/cost-sign.enum';
import { DiscountBasis } from '../../../../../../../shared/enums/discount-basis.enum';
import { DiscountTypes } from '../../../../../../../shared/enums/discount-type.enum';
import { InvoiceTypes } from '../../../../../../../shared/enums/invoice-type.enum';
import { PricingOptions } from '../../../../../../../shared/enums/pricing-options.enum';
import { AgGridService } from '../../../../../../../shared/services/ag-grid.service';
import { ContractsToInvoice } from '../../../../../../../shared/services/execution/dtos/contracts-to-invoice';
import { InvoiceRecord } from '../../../../../../../shared/services/execution/dtos/invoice-record';
import { InvoiceSummaryLineRecord } from '../../../../../../../shared/services/execution/dtos/invoice-summary-line-record';
import { InvoiceSummaryRecord } from '../../../../../../../shared/services/execution/dtos/invoice-summary-record';
import { FormConfigurationProviderService } from '../../../../../../../shared/services/form-configuration-provider.service';
import { GridConfigurationProviderService } from '../../../../../../../shared/services/grid-configuration-provider.service';
import { UiService } from '../../../../../../../shared/services/ui.service';

@Component({
    selector: 'atlas-goods-cost-value-of-goods',
    templateUrl: './goods-cost-value-of-goods.component.html',
    styleUrls: ['./goods-cost-value-of-goods.component.scss'],
})

export class GoodsCostValueOfGoodsComponent extends BaseFormComponent implements OnInit {
    @ViewChild('userPreferences') userPreferencesComponent: AgGridUserPreferencesComponent;

    @Output() readonly totalAmountCalculated = new EventEmitter<any>();
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
    originalInvoiceType: number;
    debitCredit: string = '';
    componentId: string = 'valueOfGoodsGrid';
    hasGridSharing: boolean = false;
    formatType: string = 'en-US';
    rowGroupPanelShow: string;
    debitCreditSign: string;

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
    }

    onGridReady(params) {
        params.columnDefs = this.valueOfGoodsGridColumns;
        this.valueOfGoodsGridOptions = params;
        this.gridColumnApi = params.columnApi;

        this.gridColumnApi.autoSizeAllColumns();

    }
    // to be removed once testing done for grid autosize
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
        this.gridColumnApi.autoSizeAllColumns();
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
                headerName: 'Contract Reference',
                field: 'contractReference',
                colId: 'contractReference',
                hide: false,
            },

            {
                headerName: 'Premium/Discount',
                field: 'premiumDiscountValue',
                colId: 'premiumDiscountValue',
                valueFormatter: this.formatPremiumDiscount,
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
            {
                headerName: 'Price Code',
                field: 'priceCode',
                colId: 'priceCode',
                hide: false,
            },
        ];
        this.rowGroupPanelShow = this.isGroupingEnabled ? 'always' : '';
    }

    getInvoiceValue(params) {
        if (params.data.premiumDiscountType === DiscountTypes.Premium) {
            params.data.totalInvoiceValue = this.SetInvoiceValueForPremium(params.data);
        } else if (params.data.premiumDiscountType === DiscountTypes.Discount) {
            params.data.totalInvoiceValue = this.setInvoiceValueForDiscount(params.data);
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
        const formattedInput = new Intl.NumberFormat(format, { minimumFractionDigits: decimaloption }).format(input);
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
        const formattedInput = new Intl.NumberFormat(this.formatType, { minimumFractionDigits: this.decimalOptionValue }).format(input);
        return formattedInput.toLocaleString();
    }

    contractToBeSelected(contracts: ContractsToInvoice[]) {
        if (contracts.length > 0) {
            this.calculateTotalQuantity(contracts);
            this.isGroupingEnabled = false;
            if (this.pricingOptionValue === PricingOptions.OutrightAverage) {
                // creating copy of selected contracts, so the calculations are not impacting the original price
                this.contractsForWeightedAverage = contracts.map((x) => ({ ...x }));
                this.calculateWeightedAverage();
            } else {
                this.isGroupingEnabled = (this.pricingOptionValue === PricingOptions.GroupbycommodityPrice);
                this.initializeGridColumns();
                this.valueOfGoodsGridRows = contracts;
            }
        }
    }
    calculateTotalQuantity(contracts: ContractsToInvoice[]) {
        this.totalQuantity = 0;
        contracts.forEach(
            (contract) => {
                this.totalQuantity = this.totalQuantity + contract.quantityToInvoice;
            },
        );
    }

    calculateTotalAndTotalQuantity() {
        this.total = 0;
        this.valueOfGoodsGridOptions.api.forEachNode((rowNode) => {
            if (rowNode.data.totalInvoiceValue) {
                this.total += rowNode.data.totalInvoiceValue;
            }
        },
        );
        if (this.valueOfGoodsGridRows.length > 0) {
            this.weightCode = this.valueOfGoodsGridRows[0].quantityCode;
            this.currencyCode = this.valueOfGoodsGridRows[0].currencyCode;
        }
        this.debitCredit = (this.invoiceType === InvoiceTypes.GoodsCostPurchase ||
            this.originalInvoiceType === InvoiceTypes.GoodsCostPurchase) ? 'Cr' : 'Dr';
        this.debitCreditSign = CostSigns[CostDirectionType[this.debitCredit]];
        this.totalAmountCalculated.emit({
            amount: this.total,
            decimalOption: this.decimalOptionValue,
            currencyCode: this.currencyCode,
            creditDebit: this.debitCredit,
            originalInvoiceType: this.originalInvoiceType,
        });

    }

    pricingAndDecimalOptionSelected(pricingOption: number, decimalOption: number) {
        this.pricingOptionValue = pricingOption;
        this.decimalOptionValue = decimalOption;
    }

    populateEntity(entity: InvoiceRecord): InvoiceRecord {
        const valueOfGoods = entity as InvoiceRecord;
        valueOfGoods.currency = this.currencyCode;
        valueOfGoods.totalGoodsValue = this.totalQuantity;
        if (valueOfGoods.invoiceLines && valueOfGoods.invoiceLines.length > 0) {
            const invoiceLines: InvoiceLineRecord[] = this.getInvoiceLines(valueOfGoods.invoiceLines.length);
            invoiceLines.forEach((line) => {
                valueOfGoods.invoiceLines.push(line);
            });
        } else {
            valueOfGoods.invoiceLines = this.getInvoiceLines(0);
        }
        return valueOfGoods;
    }

    onColumnVisibilityChanged(col) {
        this.userPreferencesComponent.onChangeColumnVisibility(col);
        this.gridColumnApi.autoSizeAllColumns();
    }

    getInvoiceLines(index: number = 0) {
        const invoiceLines: InvoiceLineRecord[] = [];
        this.valueOfGoodsGridRows.map((data) => {
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
            invoiceLine.contractType = ContractTypes[data.contractTypeCode];
            invoiceLines.push(invoiceLine);
            index++;
        });
        return invoiceLines;
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

    contractToBeSelectedFromGrid(summaryRecord: InvoiceSummaryRecord) {
        if (summaryRecord.summaryLines) {
            const valueOfGoodsGridRows = summaryRecord.summaryLines.filter(
                (filteredSummaryLine) => filteredSummaryLine.costId == null);
            this.invoiceType = summaryRecord.invoiceType;
            this.currencyCode = summaryRecord.currency;
            this.valueOfGoodsGridRows = this.getContractsForSummary(valueOfGoodsGridRows, summaryRecord.currency);
            this.initializeGridColumnsFromSummary();
            if (this.valueOfGoodsGridRows.length > 0) {
                this.calculateTotalForSummary(summaryRecord);
            }
        }
    }

    calculateTotalForSummary(summaryRecord: InvoiceSummaryRecord) {
        const invoiceRecord: InvoiceSummaryRecord = summaryRecord;
        this.totalQuantity = 0;
        this.total = 0;
        let totalCR: number = 0;
        let totalDR: number = 0;
        this.originalInvoiceType = summaryRecord.originalInvoiceType;
        invoiceRecord.summaryLines.filter(
            (filteredSummaryLine) => filteredSummaryLine.costId == null).forEach(
                (contract) => {
                    this.currencyCode = invoiceRecord.currency;
                    const totalValue: number = contract.lineAmount;
                    this.totalQuantity = this.totalQuantity + Number(contract.quantity);
                    if (this.invoiceType === InvoiceTypes.GoodsCostPurchase ||
                        this.originalInvoiceType === InvoiceTypes.GoodsCostPurchase) {
                        totalCR = totalCR + totalValue;
                    } else {
                        totalDR = totalDR + totalValue;
                    }
                },
            );
        if (totalCR > totalDR) {
            this.total = totalCR - totalDR;
            this.debitCredit = 'Cr';
        } else {
            this.total = totalDR - totalCR;
            this.debitCredit = 'Dr';
        }
        this.debitCreditSign = CostSigns[CostDirectionType[this.debitCredit]];
        this.totalAmountCalculated.emit({
            amount: this.total,
            decimalOption: this.decimalOptionValue,
            creditDebit: this.debitCredit,
            currencyCode: this.currencyCode,
            originalInvoiceType: this.originalInvoiceType,
        });
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
        ];
    }

    decimalFormatterForSummary(params) {
        const formattedInput = new Intl.NumberFormat(this.formatType, {
            minimumFractionDigits: this.decimalOptionValue,
        }).format(params.value);
        return formattedInput.toLocaleString();
    }

    getContractsForSummary(summaryLines: InvoiceSummaryLineRecord[], currencyCode: string) {
        const contracts: ContractsToInvoice[] = [];
        summaryLines.map((record) => {
            if (record.sectionId) {
                const contract = new ContractsToInvoice();
                contract.commodity = record.principalCommodity;
                contract.price = record.price;
                contract.contractReference = record.contractReference;
                contract.quantityToInvoice = record.quantity;
                contract.quantityCode = record.weightCode;
                contract.currencyCode = currencyCode;
                contract.totalInvoiceValue = record.lineAmount;
                contract.invoicedQuantity = record.quantity;
                //  contract.priceCode = record.priceCode;
                contracts.push(contract);
            }
        });
        return contracts;
    }

    getInvoiceValueForSummary(params) {
        return params.data.invoicedQuantity;
    }
}
