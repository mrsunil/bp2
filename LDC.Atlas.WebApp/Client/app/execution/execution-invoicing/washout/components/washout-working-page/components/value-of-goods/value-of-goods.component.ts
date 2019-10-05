import { DatePipe } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import * as agGrid from 'ag-grid-community';
import { AuthorizationService } from '../../../../../../../core/services/authorization.service';
import { CompanyManagerService } from '../../../../../../../core/services/company-manager.service';
import { BaseFormComponent } from '../../../../../../../shared/components/base-form-component/base-form-component.component';
import { AtlasAgGridParam } from '../../../../../../../shared/entities/atlas-ag-grid-param.entity';
import { InvoiceLineRecord } from '../../../../../../../shared/entities/invoice-line-record.entity';
import { ContractTypes } from '../../../../../../../shared/enums/contract-type.enum';
import { CostDirectionType } from '../../../../../../../shared/enums/cost-direction-type.enum';
import { CostSigns } from '../../../../../../../shared/enums/cost-sign.enum';
import { DiscountBasis } from '../../../../../../../shared/enums/discount-basis.enum';
import { DiscountTypes } from '../../../../../../../shared/enums/discount-type.enum';
import { AgGridService } from '../../../../../../../shared/services/ag-grid.service';
import { ContractsToWashoutInvoice } from '../../../../../../../shared/services/execution/dtos/contracts-to-washout-invoice';
import { InvoiceRecord } from '../../../../../../../shared/services/execution/dtos/invoice-record';
import { InvoiceSummaryRecord } from '../../../../../../../shared/services/execution/dtos/invoice-summary-record';
import { FormConfigurationProviderService } from '../../../../../../../shared/services/form-configuration-provider.service';
import { UiService } from '../../../../../../../shared/services/ui.service';

@Component({
    selector: 'atlas-value-of-goods',
    templateUrl: './value-of-goods.component.html',
    styleUrls: ['./value-of-goods.component.scss'],
    providers: [DatePipe],
})
export class WashoutValueOfGoodsComponent extends BaseFormComponent implements OnInit {
    @Output() readonly totalAmountCalculated = new EventEmitter<any>();
    currencyCode: string = '';
    creditDebit: string = '';
    decimalOptionValue: number = 2;
    valueOfGoodsGridOptions: agGrid.GridOptions = {};
    valueOfGoodsGridColumns: agGrid.ColDef[];
    valueOfGoodsGridRows: ContractsToWashoutInvoice[];
    atlasAgGridParam: AtlasAgGridParam;
    gridApi: agGrid.GridApi;
    gridColumnApi: agGrid.ColumnApi;
    gridContext = {
        gridEditable: false,
    };
    totalQuantity: number = 0;
    total: number = 0;
    formatType: string = 'en-US';
    weightCode: string = '';
    weightedAverage: number = 0;
    invoiceType: number;
    debitCredit: string = '';
    userActiveDirectoryName: string;
    company: string;
    debitCreditSign: string;

    constructor(protected formBuilder: FormBuilder,
        protected formConfigurationProvider: FormConfigurationProviderService,
        protected uiService: UiService,
        private datePipe: DatePipe,
        private authorizationService: AuthorizationService,
        private companyManagerService: CompanyManagerService,
        public gridService: AgGridService) {
        super(formConfigurationProvider);
        this.atlasAgGridParam = this.gridService.getAgGridParam();
        this.userActiveDirectoryName = this.authorizationService.getCurrentUser().samAccountName;
        this.company = this.companyManagerService.getCurrentCompanyId();
    }

    ngOnInit() {
        this.gridContext.gridEditable = false;
        this.initializeGridColumns();
    }

    onGridReady(params) {
        this.gridApi = params.api;
        params.columnDefs = this.valueOfGoodsGridColumns;
        this.valueOfGoodsGridOptions = params;
        this.gridColumnApi = params.columnApi;
        this.gridColumnApi.autoSizeAllColumns();
    }

    // this will be removed once testing is done for grid autosize
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
        this.valueOfGoodsGridOptions = {
            context: this.gridContext,
        };
        this.valueOfGoodsGridColumns = [
            {
                headerName: 'Counter party',
                field: 'counterparty',
                colId: 'counterparty',
                hide: false,
            },
            {
                headerName: 'Contract Reference',
                field: 'contractReference',
                colId: 'contractReference',
                hide: false,
            },
            {
                headerName: 'Contract Commodity',
                field: 'principalCommodity',
                colId: 'principalCommodity',
                hide: false,
            },
            {
                headerName: 'Contract Quantity',
                field: 'quantity',
                colId: 'quantity',
                type: 'numericColumn',
                hide: false,
                valueFormatter: (params) => (this.decimalFormatter(
                    (!params.node.group ? params.data.quantity : params.value),
                    this.decimalOptionValue,
                    this.formatType)),
            },
            {
                headerName: 'Premium/Discount',
                field: 'premiumDiscountValue',
                colId: 'premiumDiscountValue',
                valueFormatter: this.formatPremiumDiscount,
                hide: false,
            },
            {
                headerName: 'Quantity Code',
                field: 'quantityCode',
                colId: 'quantityCode',
                hide: false,
            },
            {
                headerName: 'Price Code',
                field: 'priceCode',
                colId: 'priceCode',
                hide: false,
            },
            {
                headerName: 'Price',
                field: 'price',
                colId: 'price',
                type: 'numericColumn',
                valueFormatter: (params) => (this.decimalFormatter(
                    (!params.node.group ? params.data.price : params.value),
                    this.decimalOptionValue,
                    this.formatType)),
                hide: false,
            },
            {
                headerName: 'Currency Code',
                field: 'currencyCode',
                colId: 'currencyCode',
                hide: false,
            },
            {
                headerName: 'Amount',
                field: 'totalInvoiceValue',
                colId: 'totalInvoiceValue',
                type: 'numericColumn',
                valueFormatter: (params) => (this.decimalFormatter(
                    (!params.node.group ? params.data.totalInvoiceValue : params.value),
                    this.decimalOptionValue,
                    this.formatType)),
                valueGetter: this.getAmount.bind(this),
                hide: false,
            },
        ];
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

    selectedWashoutContracts(contracts: ContractsToWashoutInvoice[]) {
        if (contracts.length > 0) {
            this.initializeGridColumns();
            this.valueOfGoodsGridRows = contracts;
            this.calculateTotal(contracts);
        }
    }

    getAmount(params): number {
        if (params.data.premiumDiscountType === DiscountTypes.Premium) {
            params.data.totalInvoiceValue = this.setInvoiceValueForPremium(params.data);
        } else if (params.data.premiumDiscountType === DiscountTypes.Discount) {
            params.data.totalInvoiceValue = this.setInvoiceValueForDiscount(params.data);
        }
        this.calculateTotal(this.valueOfGoodsGridRows);
        return (params.data.totalInvoiceValue);
    }
    private setInvoiceValueForDiscount(params: ContractsToWashoutInvoice): number {
        if (params) {
            if (params.quantity && params.price &&
                params.priceConversionFactor && params.weightConversionFactor) {
                if (params.premiumDiscountBasis === DiscountBasis.Rate) {
                    return params.quantity *
                        (params.price - params.premiumDiscountValue) *
                        params.priceConversionFactor * params.weightConversionFactor;
                } else if (params.premiumDiscountBasis === DiscountBasis.Percent) {
                    return params.quantity *
                        (params.price * (1 - (params.premiumDiscountValue / 100))) *
                        params.priceConversionFactor * params.weightConversionFactor;
                } else {
                    return params.quantity * params.price *
                        params.priceConversionFactor * params.weightConversionFactor;
                }
            }

        }
    }

    private setInvoiceValueForPremium(params: ContractsToWashoutInvoice): number {
        if (params) {
            if (params.premiumDiscountBasis === DiscountBasis.Rate) {
                return params.quantity *
                    (params.price + params.premiumDiscountValue) *
                    params.priceConversionFactor * params.weightConversionFactor;
            } else if (params.premiumDiscountBasis === DiscountBasis.Percent) {
                return params.quantity *
                    (params.price * (1 + (params.premiumDiscountValue / 100))) *
                    params.priceConversionFactor * params.weightConversionFactor;
            } else {
                return params.quantity * params.price *
                    params.priceConversionFactor * params.weightConversionFactor;
            }
        }
    }

    decimalFormatter(input, decimalOption: number, format: string) {
        const formattedInput = new Intl.NumberFormat(format,
            { minimumFractionDigits: decimalOption }).format(input);
        return formattedInput.toLocaleString();
    }

    decimalOptionSelected(decimalOption: number) {
        this.decimalOptionValue = decimalOption;
    }

    formatQuantityAndTotal(input: number) {
        const formattedInput = new Intl.NumberFormat(this.formatType,
            { minimumFractionDigits: this.decimalOptionValue }).format(input);
        return formattedInput.toLocaleString();
    }

    calculateTotal(contracts: ContractsToWashoutInvoice[]) {
        this.totalQuantity = 0;
        this.total = 0;
        let totalCR: number = 0;
        let totalDR: number = 0;
        contracts.forEach(
            (contract) => {
                this.currencyCode = contract.currencyCode;
                const totalValue = contract.totalInvoiceValue;
                this.totalQuantity = this.totalQuantity + (contract.quantity - contract.invoicedQuantity);
                if (contract.contractType === ContractTypes.Purchase) {
                    totalCR = totalCR + totalValue;
                } else {
                    totalDR = totalDR + totalValue;
                }
            },
        );
        if (totalCR > totalDR) {
            this.total = totalCR - totalDR;
            this.creditDebit = 'Cr';
        } else {
            this.total = totalDR - totalCR;
            this.creditDebit = 'Dr';
        }
        this.debitCreditSign = CostSigns[CostDirectionType[this.creditDebit]];
        this.totalAmountCalculated.emit({
            amount: this.total,
            decimalOption: this.decimalOptionValue,
            creditDebit: this.creditDebit,
            currencyCode: this.currencyCode,
        });
    }

    populateEntity(entity: InvoiceRecord): InvoiceRecord {
        const valueOfGoods = entity as InvoiceRecord;
        valueOfGoods.currency = this.currencyCode;
        valueOfGoods.totalGoodsValue = this.totalQuantity;
        valueOfGoods.totalInvoiceValue = this.total;
        if (valueOfGoods.invoiceLines && valueOfGoods.invoiceLines.length > 0) {
            const invoiceLines: InvoiceLineRecord[] = this.getInvoiceLines(valueOfGoods.invoiceLines.length);
            invoiceLines.forEach((line) => {
                valueOfGoods.invoiceLines.push(line);
            });
        } else {
            valueOfGoods.invoiceLines = this.getInvoiceLines();
        }
        return valueOfGoods;
    }

    getInvoiceLines(index: number = 0): InvoiceLineRecord[] {
        const invoiceLines: InvoiceLineRecord[] = [];
        this.valueOfGoodsGridRows.map((data) => {
            const invoiceLine = new InvoiceLineRecord();
            invoiceLine.lineNumber = index + 1;
            invoiceLine.sectionID = data.sectionId;
            invoiceLine.price = data.price;
            invoiceLine.currencyCode = data.currencyCode;
            invoiceLine.lineAmount = (data.price * (data.quantity - data.invoicedQuantity));
            invoiceLine.quantity = (data.quantity - data.invoicedQuantity).toString();
            invoiceLine.invoicePercent = ((data.quantity - data.invoicedQuantity) / Number(data.quantity)) * 100;
            invoiceLine.contractType = data.contractType;
            invoiceLines.push(invoiceLine);
            index++;
        });
        return invoiceLines;
    }
    /* Summary redirection from grid */

    contractToBeSelectedFromGrid(summaryRecord: InvoiceSummaryRecord) {
        if (summaryRecord.summaryLines) {
            this.initializeGridColumnsFromSummary();
            this.valueOfGoodsGridRows = this.getContractsForSummary(summaryRecord.summaryLines.filter(
                (filteredSummaryLine) => filteredSummaryLine.costId == null),
                summaryRecord.currency, summaryRecord.counterparty);

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
        invoiceRecord.summaryLines.forEach(
            (contract) => {
                this.currencyCode = invoiceRecord.currency;
                const totalValue: number = contract.price * Number(contract.quantity);
                this.totalQuantity = this.totalQuantity + Number(contract.quantity);
                if (contract.contractType === ContractTypes.Purchase) {
                    totalCR = totalCR + totalValue;
                } else {
                    totalDR = totalDR + totalValue;
                }
            },
        );
        if (totalCR > totalDR) {
            this.total = totalCR - totalDR;
            this.creditDebit = 'Cr';
        } else {
            this.total = totalDR - totalCR;
            this.creditDebit = 'Dr';
        }
        this.debitCreditSign = CostSigns[CostDirectionType[this.creditDebit]];
        this.totalAmountCalculated.emit({
            amount: this.total,
            decimalOption: this.decimalOptionValue,
            creditDebit: this.creditDebit,
            currencyCode: this.currencyCode,
        });
    }

    initializeGridColumnsFromSummary() {
        this.valueOfGoodsGridOptions = {
            context: this.gridContext,
        };
        this.valueOfGoodsGridColumns = [
            {
                headerName: 'Counter party',
                field: 'counterparty',
                colId: 'counterparty',
                hide: false,
            },
            {
                headerName: 'Contract Reference',
                field: 'contractReference',
                colId: 'contractReference',
                hide: false,
            },
            {
                headerName: 'Contract Commodity',
                field: 'principalCommodity',
                colId: 'principalCommodity',
                hide: false,
            },
            {
                headerName: 'Contract Quantity',
                field: 'quantity',
                colId: 'quantity',
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
                valueFormatter: this.decimalFormatterForSummary.bind(this),
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
                headerName: 'Currency Code',
                field: 'currencyCode',
                colId: 'currencyCode',
                hide: false,
            },
            {
                headerName: 'Amount',
                field: 'totalInvoiceValue',
                colId: 'totalInvoiceValue',
                hide: false,
                valueFormatter: this.decimalFormatterForSummary.bind(this),
            },
        ];
    }

    decimalFormatterForSummary(params) {
        const formattedInput = new Intl.NumberFormat(this.formatType,
            { minimumFractionDigits: this.decimalOptionValue }).format(params.value);
        return formattedInput.toLocaleString();
    }

    getContractsForSummary(summaryLines, currency: string, counterparty: string) {
        const contracts: ContractsToWashoutInvoice[] = [];
        summaryLines.map((record) => {
            if (record.sectionId) {
                const contract = new ContractsToWashoutInvoice();
                contract.counterparty = counterparty;
                contract.contractReference = record.contractReference;
                contract.principalCommodity = record.principalCommodity;
                contract.quantity = record.quantity;
                contract.quantityCode = record.weightCode;
                contract.price = record.price;
                contract.currencyCode = currency;
                contract.totalInvoiceValue = record.lineAmount;
                contracts.push(contract);
            }
        });
        return contracts;
    }

    onExportButtonClickedAsExcel() {
        const screenName: string = 'Value of Good';
        const now = new Date();
        const todayDate = this.datePipe.transform(now, 'yyyyMMdd_hhmm').toString().toUpperCase();
        const params = {
            fileName: todayDate + '_' + this.company + '_' + screenName + '_' + this.userActiveDirectoryName + '.xlsx',
        };
        this.gridApi.exportDataAsExcel(params);
    }
    onExportButtonClickedAsCSV() {
        const screenName: string = 'Value of Good';
        const now = new Date();
        const todayDate = this.datePipe.transform(now, 'yyyyMMdd_hhmm').toString().toUpperCase();
        const params = {
            fileName: todayDate + '_' + this.company + '_' + screenName + '_' + this.userActiveDirectoryName + '.csv',
        };
        this.gridApi.exportDataAsCsv(params);
    }
}
