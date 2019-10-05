import { Component, OnInit } from '@angular/core';
import { BaseFormComponent } from '../../../../../../../shared/components/base-form-component/base-form-component.component';
import { CostDirection } from '../../../../../../../shared/entities/cost-direction.entity';
import { CostDirectionType } from '../../../../../../../shared/enums/cost-direction-type.enum';
import { CostDirections } from '../../../../../../../shared/enums/cost-direction.enum';
import { CostSigns } from '../../../../../../../shared/enums/cost-sign.enum';
import { InvoicePaymentType } from '../../../../../../../shared/enums/invoice-payment-type';
import { InvoiceRecord } from '../../../../../../../shared/services/execution/dtos/invoice-record';
import { TaxRecord } from '../../../../../../../shared/services/execution/dtos/tax-record';
import { FormConfigurationProviderService } from '../../../../../../../shared/services/form-configuration-provider.service';

@Component({
    selector: 'atlas-goods-cost-total',
    templateUrl: './goods-cost-total.component.html',
    styleUrls: ['./goods-cost-total.component.scss'],
})
export class GoodsCostTotalComponent extends BaseFormComponent implements OnInit {
    total: number = 0;
    amount: number = 0;
    taxTotal: number = 0;
    currencyCode: string;
    decimalOption: number;
    formatType: string = 'en-US';
    defaultDecimalOption: number = 2;
    minDecimalOptionValue: number = 2;
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
            { minimumFractionDigits: this.minDecimalOptionValue, maximumFractionDigits: this.decimalOption }).format(input);
        return formattedInput.toLocaleString();
    }

    setValuesForTotalWithoutTax(model: InvoiceRecord) {
        this.amount = (model.totalInvoiceValue);
        this.decimalOption = model.decimalOption;
        this.currencyCode = model.currency;
        if (model.costDirection === CostDirections.Payable) {
            this.costDirectionDisplay = this.credit;

        } else if (model.costDirection === CostDirections.Receivable) {
            this.costDirectionDisplay = this.debit;
        }
        this.costDirectionSign = CostSigns[model.costDirection];
        // if (this.amount) {
        this.setTotalForGoodCost();
        // }
    }

    setTotalForGoodCost() {
        if (this.costDirectionDisplay) {
            if (this.costDirectionDisplay === this.credit) {
                this.total = Number(this.taxTotal) + Number(this.amount);
                this.totalCostDirection = this.credit;
            } else {
                this.total = Number(this.amount) - Number(this.taxTotal);
                this.totalCostDirection = this.debit;
            }

            this.invoiceLabel = this.total < 0 ? InvoicePaymentType[CostDirectionType.Cr] : InvoicePaymentType[CostDirectionType.Dr];
            //  this.totalCostDirectionSign = CostSigns[CostDirectionType[this.costDirectionDisplay]];
        } else {
            this.total = this.taxTotal;
            this.totalCostDirection = this.credit;
            this.totalCostDirectionSign = CostSigns[CostDirections.Payable];
            this.invoiceLabel = InvoicePaymentType[CostDirections.Payable];
        }
    }

    setValuesForTotalTax(model: TaxRecord) {
        this.taxTotal = (model.amount);
        this.decimalOption = model.decimalOption;
        this.currencyCode = model.currencyCode;
        this.total = Number(this.taxTotal) + Number(this.amount);
        if (this.taxTotal) {
            this.setTotalForGoodCost();
        }
    }

    getCostDirectionIdFromCode(code: string): number {
        if (code) {
            const selectedCostDirection = this.costDirections.find(
                (e) => e.costDirection === code);
            return selectedCostDirection.costDirectionId;
        }
    }

    populateEntity(entity: InvoiceRecord): InvoiceRecord {
        const selectedInvoiceCosts = entity;
        selectedInvoiceCosts.totalInvoiceValue = this.total;
        return selectedInvoiceCosts;
    }
}
