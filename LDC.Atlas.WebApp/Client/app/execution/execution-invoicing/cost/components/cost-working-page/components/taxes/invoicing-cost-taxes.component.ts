import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as agGrid from 'ag-grid-community';
import { BaseFormComponent } from '../../../../../../../shared/components/base-form-component/base-form-component.component';
import { AtlasAgGridParam } from '../../../../../../../shared/entities/atlas-ag-grid-param.entity';
import { CostDirection } from '../../../../../../../shared/entities/cost-direction.entity';
import { MasterData } from '../../../../../../../shared/entities/masterdata.entity';
import { Vat } from '../../../../../../../shared/entities/vat.entity';
import { CostDirections } from '../../../../../../../shared/enums/cost-direction.enum';
import { CostSigns } from '../../../../../../../shared/enums/cost-sign.enum';
import { AgGridService } from '../../../../../../../shared/services/ag-grid.service';
import { ContractsToCostInvoice } from '../../../../../../../shared/services/execution/dtos/contracts-to-cost-invoice';
import { CostInvoiceRecord } from '../../../../../../../shared/services/execution/dtos/cost-invoice-record';
import { InvoiceSummaryLineRecord } from '../../../../../../../shared/services/execution/dtos/invoice-summary-line-record';
import { InvoiceSummaryRecord } from '../../../../../../../shared/services/execution/dtos/invoice-summary-record';
import { TaxRecord } from '../../../../../../../shared/services/execution/dtos/tax-record';
import { FormConfigurationProviderService } from '../../../../../../../shared/services/form-configuration-provider.service';
import { UiService } from '../../../../../../../shared/services/ui.service';

@Component({
    selector: 'atlas-invoicing-cost-taxes',
    templateUrl: './invoicing-cost-taxes.component.html',
    styleUrls: ['./invoicing-cost-taxes.component.scss'],
})
export class InvoicingCostTaxesComponent extends BaseFormComponent implements OnInit {
    @Output() readonly totalCostTaxCalculated = new EventEmitter<any>();
    taxesGridOptions: agGrid.GridOptions = {};
    taxesGridColumns: agGrid.ColDef[];
    atlasAgGridParam: AtlasAgGridParam;
    gridColumnApi: agGrid.ColumnApi;
    rowGroupPanelShow: string;
    isGroupingEnabled: boolean = false;
    taxesGridRows: TaxRecord[];
    costDirection: CostDirection;
    totalCostDirection: string;
    costDirectionDisplay: string = '';
    debit: string = 'Dr';
    credit: string = 'Cr';
    masterdata: MasterData = new MasterData();
    vatCode: Vat[];
    vatCodeAvailable: TaxRecord[];
    costDirections: CostDirection[];
    costDirectionPay: string = 'Pay';

    costTotal: number = 0;
    total: number = 0;
    taxTotal: number = 0;
    currencyCode: string = '';
    pricingOptionValue: number = 0;
    decimalOptionValue: number = 2;
    formatType: string = 'en-US';
    taxCostDirectionSign: string = CostSigns[CostDirections.Payable];

    constructor(protected formConfigurationProvider: FormConfigurationProviderService,
        private route: ActivatedRoute,
        protected uiService: UiService,
        public gridService: AgGridService,
    ) {
        super(formConfigurationProvider);
        this.atlasAgGridParam = this.gridService.getAgGridParam();
    }

    ngOnInit() {
        this.initializeGridColumns();
        this.masterdata = this.route.snapshot.data.masterdata;
    }
    onGridReady(params) {
        params.columnDefs = this.taxesGridColumns;
        this.taxesGridOptions = params;
        this.gridColumnApi = params.columnApi;

        this.gridColumnApi.autoSizeAllColumns();
        window.onresize = () => {
            this.gridColumnApi.autoSizeAllColumns();
        };
    }

    initializeGridColumns() {
        this.taxesGridColumns = [
            {
                headerName: 'VAT Code',
                field: 'vatCode',
                colId: 'vatCode',
                hide: false,
            },
            {
                headerName: 'Description',
                field: 'vatDescription',
                colId: 'vatDescription',
                hide: false,
            },
            {
                headerName: 'VAT Amount',
                field: 'rate',
                colId: 'rate',
                type: 'numericColumn',
                hide: false,
                valueFormatter: this.vatAmountFormatter.bind(this),
            },
        ];
    }

    vatAmountFormatter(param) {
        return Math.abs(param.value);
    }

    taxRecordsSelected(taxesRecord: TaxRecord[]) {
        if (taxesRecord.length > 0) {
            this.initializeGridColumns();
            this.taxesGridRows = taxesRecord;
            this.calculateTotalAmount(taxesRecord);
        }
    }

    setDirectionAndCurrency(data: TaxRecord) {
        this.costDirectionDisplay = data.costDirection;
        this.currencyCode = data.currencyCode;
    }

    calculateTotalAmount(taxes: TaxRecord[]) {
        this.total = 0;
        this.taxTotal = 0;
        taxes.forEach(
            (tax) => {
                this.taxTotal = this.taxTotal + Math.abs(tax.rate);
            },
        );
        if (this.costTotal) {
            this.total = (this.costDirectionDisplay === this.credit) ? this.taxTotal + this.costTotal : this.costTotal - this.taxTotal;
        }
        this.totalCostTaxCalculated.emit({
            amount: this.total,
            decimalOption: this.decimalOptionValue,
            currencyCode: this.currencyCode,
            costDirection: this.costDirectionDisplay,
        });
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
    getTaxesForSelectedVat(model: CostInvoiceRecord) {
        if (model) {
            this.costTotal = model.rate;
            this.decimalOptionValue = model.decimalOption;
            this.currencyCode = model.currencyCode;
            this.totalCostDirection = model.costDirection;
            if (model.costDirection === CostDirections[CostDirections.Payable]) {
                this.costDirectionDisplay = this.credit;
            } else if (model.costDirection === CostDirections[CostDirections.Receivable]) {
                this.costDirectionDisplay = this.debit;
            }
            this.taxRecordsSelected(model.vatAvailable);
        }
    }

    /* redirection from invoice home grid*/
    setDataForTaxCostGrid(summaryRecord: InvoiceSummaryRecord) {
        if (summaryRecord) {
            this.getCostContractsForSummary(summaryRecord.summaryLines);
            this.currencyCode = summaryRecord.currency;
        }
    }

    getCostContractsForSummary(summaryLines: InvoiceSummaryLineRecord[]) {
        const contracts: ContractsToCostInvoice[] = [];
        summaryLines.map((record) => {
            if (record.costId) {
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
        this.calculateTotalAmountAndGetVatCode(contracts);
    }

    calculateTotalAmountAndGetVatCode(contracts: ContractsToCostInvoice[]) {
        const vatMasterData = this.masterdata.vats;
        let vatCodeAvailable = [];
        contracts.forEach((contract) => {
            let vatCode: Vat[] = [];
            vatCode = vatMasterData
                .filter((vat) => (vat.vatCode === contract.vatCode)).map((x) => ({ ...x }));
            if (vatCode.length > 0) {
                vatCode.map((code) => {

                    return code.rate = code.rate / 100 * contract.costAmountToInvoice;
                });
                if (vatCodeAvailable.length === 0) {
                    if (contract.costDirection === this.costDirectionPay) {
                        vatCode[0].rate = -(vatCode[0].rate);
                    }
                    vatCodeAvailable.push(vatCode[0]);
                } else {
                    let isAvailable: boolean = false;
                    vatCodeAvailable.map((code) => {
                        if (code.vatCode === vatCode[0].vatCode) {
                            if (vatCodeAvailable.filter((selectedVatCode) => selectedVatCode.vatCode === vatCode[0].vatCode)) {
                                if (contract.costDirection === this.costDirectionPay) {
                                    vatCode[0].rate = -(vatCode[0].rate);
                                }
                                code.rate = code.rate + vatCode[0].rate;
                                isAvailable = true;
                            }
                        }
                    });
                    if (!isAvailable) {
                        vatCodeAvailable = vatCodeAvailable.filter((code) => code.vatCode !== vatCode[0].vatCode);
                        if (contract.costDirection === this.costDirectionPay) {
                            vatCode[0].rate = -(vatCode[0].rate);
                        }
                        vatCodeAvailable.push(vatCode[0]);
                    }
                }
            }
        });

        this.vatCodeAvailable = vatCodeAvailable.map((x) => ({ ...x }));
        this.taxesGridRows = this.vatCodeAvailable;
        this.initializeGridColumns();
        this.calculateTotalTaxForSummary(this.vatCodeAvailable);
    }

    calculateTotalTaxForSummary(taxes: TaxRecord[]) {
        this.taxTotal = 0;
        taxes.forEach(
            (tax) => {
                this.taxTotal = this.taxTotal + Math.abs(tax.rate);
            },
        );
    }

}
