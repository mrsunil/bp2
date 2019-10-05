import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BaseFormComponent } from '../../../../../shared/components/base-form-component/base-form-component.component';
import { ContractsToCostInvoice } from '../../../../../shared/services/execution/dtos/contracts-to-cost-invoice';
import { CostInvoiceRecord } from '../../../../../shared/services/execution/dtos/cost-invoice-record';
import { InvoiceRecord } from '../../../../../shared/services/execution/dtos/invoice-record';
import { InvoiceSummaryRecord } from '../../../../../shared/services/execution/dtos/invoice-summary-record';
import { TaxRecord } from '../../../../../shared/services/execution/dtos/tax-record';
import { FormConfigurationProviderService } from '../../../../../shared/services/form-configuration-provider.service';
import { HeaderComponent } from '../../../header/header.component';
import { TotalAmountComponent } from '../../../total-amount/total-amount.component';
import { CostPaymentsComponent } from '../cost-working-page/components/payments/cost-payments.component';
import { InvoiceCostSelectedCostComponent } from '../cost-working-page/components/selected-cost/invoice-cost-selected-cost.component';
import { InvoicingCostTaxesComponent } from '../cost-working-page/components/taxes/invoicing-cost-taxes.component';
import { CompanyBankAccounts } from '../../../../../shared/entities/company-bankaccounts.entity';

@Component({
    selector: 'atlas-cost-summary',
    templateUrl: './cost-summary.component.html',
    styleUrls: ['./cost-summary.component.scss'],
})
export class CostSummaryComponent extends BaseFormComponent implements OnInit {

    private formComponents: BaseFormComponent[] = [];

    @ViewChild('costPaymentsComponent') costPaymentsComponent: CostPaymentsComponent;
    @ViewChild('invoicingCostTaxesComponent') invoicingCostTaxesComponent: InvoicingCostTaxesComponent;
    @ViewChild('totalAmountComponent') totalAmountComponent: TotalAmountComponent;
    @ViewChild('invoiceCostSelectedCostComponent') invoiceCostSelectedCostComponent: InvoiceCostSelectedCostComponent;
    @ViewChild('summaryHeaderComponent') summaryHeaderComponent: HeaderComponent;

    @Input() invoiceTaxContracts: TaxRecord[];
    @Input() invoiceTaxTotal: TaxRecord;
    @Input() invoiceCostContracts: ContractsToCostInvoice[];
    @Input() filteredCompanyBankAccounts: CompanyBankAccounts[];

    invoiceSummaryFormGroup: FormGroup;
    model: InvoiceRecord;
    invoiceLabel: string;
    quantityToInvoice: string;
    contracts: ContractsToCostInvoice[];
    taxes: TaxRecord[];
    totalData: TaxRecord;
    decimalOptionValue: number = 0;
    pricingOptionValue: number = 0;
    defaultDecimalOption: number = 2;
    contract: ContractsToCostInvoice;
    contractType: string = 'Contract';
    taxForCostInvoice: CostInvoiceRecord;
    constructor(protected formBuilder: FormBuilder,
        protected formConfigurationProvider: FormConfigurationProviderService) {
        super(formConfigurationProvider);
    }

    ngOnInit() {
        this.invoiceSummaryFormGroup = this.formBuilder.group({
            costPaymentsComponent: this.costPaymentsComponent.getFormGroup(),
            invoicingCostTaxesComponent: this.invoicingCostTaxesComponent.getFormGroup(),
            invoiceCostSelectedCostComponent: this.invoiceCostSelectedCostComponent.getFormGroup(),
            summaryHeaderComponent: this.summaryHeaderComponent.getFormGroup(),
        });
        this.invoiceSummaryFormGroup.disable();

        this.formComponents.push(
            this.costPaymentsComponent,
            this.invoicingCostTaxesComponent,
            this.invoiceCostSelectedCostComponent,
            this.summaryHeaderComponent);
        this.invoiceCostSelectedCostComponent.isAddDeleteButtonInvisible = true;

    }

    contractToBeSelected(contracts: ContractsToCostInvoice[]) {
        this.contracts = contracts;
    }

    setDecimalAndPricingOption(decimalOptionValue, pricingOptionValue) {
        this.decimalOptionValue = decimalOptionValue;
        this.pricingOptionValue = pricingOptionValue;
    }

    populateInvoiceRecord(record) {
        this.contracts = this.invoiceCostContracts;
        this.taxes = this.invoiceTaxContracts;
        this.totalData = this.invoiceTaxTotal;
        this.model = record;
        this.populateSummaryFields();
    }

    populateSummaryFields() {
        this.invoiceCostSelectedCostComponent.contractToBeSelected(this.contracts);
        this.invoicingCostTaxesComponent.taxRecordsSelected(this.taxes);
        if (this.totalData) {
            this.invoicingCostTaxesComponent.setDirectionAndCurrency(this.totalData);
            this.totalAmountComponent.setTotalAmountForSummary(this.totalData);
        }
        if (this.model) {
            this.costPaymentsComponent.setPaymentFieldsForSummary(this.model);
            this.summaryHeaderComponent.setHeaderFieldsForSummary(this.model, this.filteredCompanyBankAccounts);
        }
    }

    populateInvoiceRecordFromGrid(record) {
        if (this.contract) {
            this.contract.principalCommodity = record.principalCommodity;
            this.contract.rate = record.price;
            this.contract.quantity = record.quantity;
            this.contracts.push(this.contract);
        }
    }

    setSummaryFieldsFromGrid(summaryRecord: InvoiceSummaryRecord) {
        if (summaryRecord) {
            this.invoiceCostSelectedCostComponent.contractToBeSelectedFromGrid(summaryRecord);
            this.invoicingCostTaxesComponent.setDataForTaxCostGrid(summaryRecord);
            this.costPaymentsComponent.setValuesForSummaryFromGrid(summaryRecord);
            this.totalAmountComponent.setValuesForTotalFromGrid(summaryRecord);
            this.summaryHeaderComponent.setHeaderFieldsFromGrid(summaryRecord);
        }
    }
}
