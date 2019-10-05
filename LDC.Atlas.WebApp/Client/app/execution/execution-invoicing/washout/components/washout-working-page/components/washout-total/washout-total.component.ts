import { Component, OnInit } from '@angular/core';
import { BaseFormComponent } from '../../../../../../../shared/components/base-form-component/base-form-component.component';
import { CostDirection } from '../../../../../../../shared/entities/cost-direction.entity';
import { CostDirectionType } from '../../../../../../../shared/enums/cost-direction-type.enum';
import { CostDirections } from '../../../../../../../shared/enums/cost-direction.enum';
import { CostSigns } from '../../../../../../../shared/enums/cost-sign.enum';
import { InvoicePaymentType } from '../../../../../../../shared/enums/invoice-payment-type';
import { InvoiceRecord } from '../../../../../../../shared/services/execution/dtos/invoice-record';
import { InvoiceSummaryLineRecord } from '../../../../../../../shared/services/execution/dtos/invoice-summary-line-record';
import { InvoiceSummaryRecord } from '../../../../../../../shared/services/execution/dtos/invoice-summary-record';
import { TaxRecord } from '../../../../../../../shared/services/execution/dtos/tax-record';
import { FormConfigurationProviderService } from '../../../../../../../shared/services/form-configuration-provider.service';

@Component({
    selector: 'atlas-washout-total',
    templateUrl: './washout-total.component.html',
    styleUrls: ['./washout-total.component.scss'],
})
export class WashoutTotalComponent extends BaseFormComponent implements OnInit {
    total: number = 0;
    amount: number = 0;
    taxTotal: number = 0;
    currencyCode: string;
    decimalOption: number;
    formatType: string = 'en-US';
    defaultDecimalOption: number = 2;
    costDirectionDisplay: string;
    totalCostDirection: string;
    debit: string = 'Dr';
    credit: string = 'Cr';
    costDirections: CostDirection[];
    costDirectionSign: string;
    totalCostDirectionSign: string;
    taxCostDirectionSign: string = CostSigns[CostDirections.Payable];
    invoiceLabel: string;

    constructor(protected formConfigurationProvider: FormConfigurationProviderService) {
        super(formConfigurationProvider);
    }

    ngOnInit() {
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
    }

    formatAmount(input: number) {
        const formattedInput = new Intl.NumberFormat(this.formatType,
            { minimumFractionDigits: this.decimalOption }).format(input);
        return formattedInput.toLocaleString();
    }

    setValuesForTotalWithoutTax(model: InvoiceRecord) {
        this.amount = Math.abs(model.totalInvoiceValue);
        this.decimalOption = model.decimalOption;
        this.currencyCode = model.currency;
        if (model.costDirection === CostDirections.Payable) {
            this.costDirectionDisplay = this.credit;
        } else if (model.costDirection === CostDirections.Receivable) {
            this.costDirectionDisplay = this.debit;
        }
        this.costDirectionSign = CostSigns[model.costDirection];
        if (this.amount >= 0) {
            this.setTotalForGoodCost();
        }
    }

    setTotalForGoodCost() {
        if (this.costDirectionDisplay) {
            if (this.costDirectionDisplay === this.credit) {
                this.total = this.taxTotal + this.amount;
                this.totalCostDirection = this.credit;
            } else {
                this.total = this.amount - this.taxTotal;
                this.totalCostDirection = this.debit;
            }
            this.invoiceLabel = InvoicePaymentType[CostDirectionType[this.costDirectionDisplay]];
            this.totalCostDirectionSign = CostSigns[CostDirectionType[this.costDirectionDisplay]];
        } else {
            this.total = this.taxTotal;
            this.totalCostDirection = this.credit;
            this.totalCostDirectionSign = CostSigns[CostDirections.Payable];
            this.invoiceLabel = InvoicePaymentType[CostDirections.Payable];
        }
    }

    setValuesForTotalTax(model: TaxRecord) {
        this.taxTotal = Math.abs(model.amount);
        this.decimalOption = model.decimalOption;
        this.currencyCode = model.currencyCode;
        this.total = this.taxTotal + this.amount;
        if (this.taxTotal) {
            this.setTotalForGoodCost();
        }
    }

    setValuesForTotalFromGrid(summaryRecord: InvoiceSummaryRecord) {
        const invoiceLines = summaryRecord.summaryLines as InvoiceSummaryLineRecord[];
        let total: number = 0;
        invoiceLines.forEach((tax) => {
            total = total + tax.vatAmount;
        });
        this.taxTotal = total;
        this.decimalOption = this.defaultDecimalOption;
        this.currencyCode = summaryRecord.currency;
        this.amount = summaryRecord.totalInvoiceValue;
        this.calculateCostDirection(invoiceLines);
        this.setTotalForGoodCost();
    }

    calculateCostDirection(contracts: InvoiceSummaryLineRecord[]) {
        let totalCR: number = 0;
        let totalDR: number = 0;
        let costDirectionId: number;
        contracts.forEach(
            (contract) => {
                costDirectionId = this.getCostDirectionIdFromCode(contract.costDirection);
                if (costDirectionId === CostDirections.Payable) {
                    totalCR = totalCR + contract.lineAmount;
                } else {
                    totalDR = totalDR + contract.lineAmount;
                }
            },
        );
        this.costDirectionDisplay = (totalCR > totalDR) ? CostDirectionType[CostDirectionType.Cr] : CostDirectionType[CostDirectionType.Dr];
    }

    getCostDirectionIdFromCode(code: string): number {
        if (code) {
            const selectedCostDirection = this.costDirections.find(
                (e) => e.costDirection === code);
            return selectedCostDirection.costDirectionId;
        }
    }

    populateEntity(entity: InvoiceRecord): InvoiceRecord {
        const invoiceDetails = entity;
        invoiceDetails.costDirection = (this.totalCostDirectionSign === CostSigns[CostDirections.Payable])
            ? CostDirections.Payable : CostDirections.Receivable;
        return invoiceDetails;
    }
}
