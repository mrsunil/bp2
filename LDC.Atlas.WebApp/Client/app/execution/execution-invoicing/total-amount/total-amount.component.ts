import { Component, HostListener, OnInit } from '@angular/core';
import { BaseFormComponent } from '../../../shared/components/base-form-component/base-form-component.component';
import { CostDirection } from '../../../shared/entities/cost-direction.entity';
import { CostDirectionType } from '../../../shared/enums/cost-direction-type.enum';
import { CostDirections } from '../../../shared/enums/cost-direction.enum';
import { CostSigns } from '../../../shared/enums/cost-sign.enum';
import { InvoicePaymentType } from '../../../shared/enums/invoice-payment-type';
import { InvoiceTypes } from '../../../shared/enums/invoice-type.enum';
import { InvoiceSummaryLineRecord } from '../../../shared/services/execution/dtos/invoice-summary-line-record';
import { InvoiceSummaryRecord } from '../../../shared/services/execution/dtos/invoice-summary-record';
import { TaxRecord } from '../../../shared/services/execution/dtos/tax-record';
import { FormConfigurationProviderService } from '../../../shared/services/form-configuration-provider.service';

@Component({
    selector: 'atlas-total-amount',
    templateUrl: './total-amount.component.html',
    styleUrls: ['./total-amount.component.scss'],
})
export class TotalAmountComponent extends BaseFormComponent implements OnInit {

    amount: number;
    currencyCode: string;
    decimalOption: number;
    formatType: string = 'en-US';
    defaultDecimalOption: number = 2;
    costDirectionDisplay: string = '';
    costDirections: CostDirection[];
    totalCostDirectionSign: string;
    invoiceLabel: string;

    constructor(protected formConfigurationProvider: FormConfigurationProviderService,
    ) {
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

    @HostListener('window:beforeunload', ['$event']) unloadNotification($event: any) {
        if (this.formGroup.dirty) {
            $event.returnValue = true;
        }
    }

    formatAmount(input: number) {
        const formattedInput = new Intl.NumberFormat(this.formatType,
            { minimumFractionDigits: this.decimalOption }).format(input);
        return formattedInput.toLocaleString();
    }

    setTotalAmountForSummary(summaryRecord: TaxRecord) {
        this.amount = summaryRecord.amount;
        this.currencyCode = summaryRecord.currencyCode;
        this.decimalOption = this.defaultDecimalOption;
        this.costDirectionDisplay = summaryRecord.costDirection;
        this.totalCostDirectionSign = CostSigns[CostDirectionType[summaryRecord.costDirection]];
        this.invoiceLabel = InvoicePaymentType[CostDirectionType[summaryRecord.costDirection]];
    }

    setValuesForTotal(model) {
        this.amount = model.amount;
        this.decimalOption = model.decimalOption;
        this.currencyCode = model.currencyCode;
        this.costDirectionDisplay = model.costDirection;
    }

    setValuesForTotalFromGrid(model: InvoiceSummaryRecord) {
        this.amount = model.totalInvoiceValue;
        this.decimalOption = this.defaultDecimalOption;
        this.currencyCode = model.currency;
        (model.invoiceType === InvoiceTypes.Purchase || model.invoiceType === InvoiceTypes.Sales) ?
            this.setCostDirection(model) : this.calculateCostDirection(model.summaryLines);
    }

    setCostDirection(model: InvoiceSummaryRecord) {
        (model.invoiceType === InvoiceTypes.Purchase) ? this.totalCostDirectionSign = CostSigns[CostDirections.Payable] :
            this.totalCostDirectionSign = CostSigns[CostDirections.Receivable];
        this.invoiceLabel = InvoicePaymentType[CostSigns[this.totalCostDirectionSign]];
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
        if (totalCR > totalDR) {
            this.costDirectionDisplay = CostDirectionType[CostDirectionType.Cr];
            this.totalCostDirectionSign = CostSigns[CostDirections.Payable];
        } else {
            this.costDirectionDisplay = CostDirectionType[CostDirectionType.Dr];
            this.totalCostDirectionSign = CostSigns[CostDirections.Receivable];
        }
    }
    getCostDirectionIdFromCode(code: string): number {
        if (code) {
            const selectedCostDirection = this.costDirections.find(
                (e) => e.costDirection === code);
            this.invoiceLabel = selectedCostDirection.costDirection;
            return selectedCostDirection.costDirectionId;
        }
    }
}
