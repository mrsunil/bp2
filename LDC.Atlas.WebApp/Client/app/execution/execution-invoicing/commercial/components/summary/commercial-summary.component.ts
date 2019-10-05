import { Type } from '@angular/compiler';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BaseFormComponent } from '../../../../../shared/components/base-form-component/base-form-component.component';
import { CompanyBankAccounts } from '../../../../../shared/entities/company-bankaccounts.entity';
import { CostDirectionType } from '../../../../../shared/enums/cost-direction-type.enum';
import { CostDirections } from '../../../../../shared/enums/cost-direction.enum';
import { CostSigns } from '../../../../../shared/enums/cost-sign.enum';
import { InvoiceTypes } from '../../../../../shared/enums/invoice-type.enum';
import { ContractsToCostInvoice } from '../../../../../shared/services/execution/dtos/contracts-to-cost-invoice';
import { ContractsToInvoice } from '../../../../../shared/services/execution/dtos/contracts-to-invoice';
import { InvoiceRecord } from '../../../../../shared/services/execution/dtos/invoice-record';
import { InvoiceSummaryRecord } from '../../../../../shared/services/execution/dtos/invoice-summary-record';
import { TaxRecord } from '../../../../../shared/services/execution/dtos/tax-record';
import { FormConfigurationProviderService } from '../../../../../shared/services/form-configuration-provider.service';
import { HeaderComponent } from '../../../header/header.component';
import { AddCostTaxComponent } from '../working-page/components/add-cost-tax/add-cost-tax.component';
import { AddCostTotalComponent } from '../working-page/components/add-cost-total/add-cost-total.component';
import { AddCostComponent } from '../working-page/components/add-cost/add-cost.component';
import { CommercialPaymentsComponent } from '../working-page/components/payments-component/payments-component.component';
import { TaxesComponent } from '../working-page/components/taxes-component/taxes-component.component';
import { CommercialValueOfGoodsComponent } from '../working-page/components/value-of-goods-component/value-of-goods-component.component';

@Component({
    selector: 'atlas-commercial-summary',
    templateUrl: './commercial-summary.component.html',
    styleUrls: ['./commercial-summary.component.scss'],
})
export class CommercialSummaryComponent extends BaseFormComponent implements OnInit {

    private formComponents: BaseFormComponent[] = [];

    @ViewChild('paymentComponent') paymentComponent: CommercialPaymentsComponent;
    @ViewChild('taxesComponent') taxesComponent: TaxesComponent;
    @ViewChild('valueOfGoodsComponent') valueOfGoodsComponent: CommercialValueOfGoodsComponent;
    @ViewChild('summaryHeaderComponent') summaryHeaderComponent: HeaderComponent;
    @ViewChild('summaryAddCostComponent') summaryAddCostComponent: AddCostComponent;
    @ViewChild('summaryTaxCostsComponent') summaryTaxCostsComponent: AddCostTaxComponent;
    @ViewChild('summaryCostTotalAmountComponent') summaryCostTotalAmountComponent: AddCostTotalComponent;
    @Input() invoiceRecordFromGrid: InvoiceSummaryRecord;
    @Input() defaultVATCode: string;
    @Input() isCreationMode: boolean;
    @Input() filteredCompanyBankAccounts: CompanyBankAccounts[];
    @Input() invoiceCostContracts: ContractsToCostInvoice[];
    @Input() invoiceTaxContracts: TaxRecord[];
    @Input() invoiceTaxTotal: TaxRecord;
    invoiceSummaryFormGroup: FormGroup;
    model: InvoiceRecord;
    invoiceLabel: string;
    quantityToInvoice: string;
    contracts: ContractsToInvoice[];
    decimalOptionValue: number = 0;
    pricingOptionValue: number = 0;
    defaultDecimalOption: number = 2;
    contract: ContractsToInvoice;
    contractType: string = 'Contract';
    costContracts: ContractsToCostInvoice[];
    additionalCostRate: number = 0;
    additionalCostCostDirection: string;
    costTaxes: TaxRecord[];
    totalData: TaxRecord;
    valueOfGoodsDecimalOption: number = 2;
    valueOfGoodsCurrency: string;
    valueOfGoodsTotal: number = 0;
    valueOfGoodsCostDirection: string;
    totalRecordForGoods: InvoiceRecord = new InvoiceRecord();
    constructor(protected formBuilder: FormBuilder,
        protected formConfigurationProvider: FormConfigurationProviderService) {
        super(formConfigurationProvider);
    }

    ngOnInit() {
        this.invoiceSummaryFormGroup = this.formBuilder.group({
            paymentComponent: this.paymentComponent.getFormGroup(),
            taxesComponent: this.taxesComponent.getFormGroup(),
            valueOfGoodsComponent: this.valueOfGoodsComponent.getFormGroup(),
            summaryHeaderComponent: this.summaryHeaderComponent.getFormGroup(),
            summaryAddCostComponent: this.summaryAddCostComponent.getFormGroup(),
            summaryTaxCostsComponent: this.summaryTaxCostsComponent.getFormGroup(),
        });
        this.invoiceSummaryFormGroup.disable();

        this.formComponents.push(this.paymentComponent,
            this.taxesComponent,
            this.valueOfGoodsComponent,
            this.summaryHeaderComponent,
            this.summaryAddCostComponent,
            this.summaryTaxCostsComponent);
        this.summaryAddCostComponent.isAdditionalCostForSummary = true;
    }

    contractToBeSelected(contracts: ContractsToInvoice[]) {
        this.contracts = contracts;
    }

    costContractToBeSelected(costContracts: ContractsToCostInvoice[]) {
        this.costContracts = costContracts;
    }

    setDecimalAndPricingOption(decimalOptionValue: number, pricingOptionValue: number) {
        this.decimalOptionValue = decimalOptionValue;
        this.pricingOptionValue = pricingOptionValue;
    }

    populateInvoiceRecord(record: InvoiceRecord) {
        this.model = record;
        // this.costContracts = this.invoiceCostContracts;
        this.costTaxes = this.invoiceTaxContracts;
        this.totalData = this.invoiceTaxTotal;
        this.populateSummaryFields();
    }

    populateSummaryFields() {
        this.valueOfGoodsComponent.pricingAndDecimalOptionSelected(this.pricingOptionValue, this.decimalOptionValue);
        if (this.contracts) {
            this.valueOfGoodsComponent.contractToBeSelected(this.contracts);
        }
        if (this.costContracts) {
            this.summaryAddCostComponent.contractToBeSelected(this.costContracts);
        }
        if (this.costTaxes) {
            this.summaryTaxCostsComponent.taxRecordsSelected(this.costTaxes);
        }
        if (this.model) {
            this.paymentComponent.invoicePayTermsCntrl.patchValue(this.model.paymentTerms);
            this.paymentComponent.invoiceDueDateCntrl.patchValue(this.model.dueDate);
            this.summaryCostTotalAmountComponent.amount = this.model.totalInvoiceValue;
            this.summaryCostTotalAmountComponent.currencyCode = this.model.currency;
            this.summaryCostTotalAmountComponent.costDirectionSign = CostSigns[this.model.costDirection];
            this.summaryTaxCostsComponent.currencyCode = this.model.currency;
            this.summaryAddCostComponent.currencyCodeSelected = this.model.currency;
            this.summaryCostTotalAmountComponent.decimalOption = this.decimalOptionValue;
            this.summaryCostTotalAmountComponent.totalCostDirectionSign = (this.model.invoiceType === InvoiceTypes.Purchase) ?
                CostSigns[CostDirectionType.Cr] : CostSigns[CostDirectionType.Dr];
            this.summaryHeaderComponent.setHeaderFieldsForSummary(this.model, this.filteredCompanyBankAccounts);

            if (this.model.invoiceLines.length > 0) {
                if (this.model.invoiceLines[0].vatCode) {
                    this.taxesComponent.currencyCode = this.model.invoiceLines[0].currencyCode;
                    this.taxesComponent.setDefaultVatCode(this.model.invoiceLines[0].vatCode);
                }
            }
        }
        this.summaryAddCostComponent.isAdditionalCostForSummary = true;
        this.summaryCostTotalAmountComponent.summaryTotalCalculated();
    }

    setSummaryFieldsFromGrid(summaryRecord: InvoiceSummaryRecord) {
        this.summaryAddCostComponent.contractToBeSelectedFromGrid(summaryRecord);
        this.valueOfGoodsComponent.pricingAndDecimalOptionSelected(this.pricingOptionValue, this.defaultDecimalOption);
        this.valueOfGoodsComponent.contractToBeSelectedFromGrid(summaryRecord);
        this.paymentComponent.setValuesForSummaryFromGrid(summaryRecord);
        this.taxesComponent.setDataForTaxGoods(summaryRecord, this.defaultVATCode);
        this.summaryCostTotalAmountComponent.setValuesForTotalFromGrid(summaryRecord);
        this.summaryHeaderComponent.setHeaderFieldsFromGrid(summaryRecord);
        this.summaryAddCostComponent.isAdditionalCostForSummary = true;

    }

    onTotalCostTaxCalculated(model) {
        this.totalData = model;
        this.calculateTaxTotal(model);
    }
    calculateTaxTotal(model: any) {
        this.summaryCostTotalAmountComponent.setValuesForTotalTax(model);
    }
    calculateTotalWithoutTax() {
        this.totalRecordForGoods.totalInvoiceValue = this.additionalCostRate + this.valueOfGoodsTotal;
        this.totalRecordForGoods.decimalOption = this.valueOfGoodsDecimalOption;
        this.totalRecordForGoods.currency = this.valueOfGoodsCurrency;
        if (this.valueOfGoodsCostDirection === this.additionalCostCostDirection) {
            this.totalRecordForGoods.costDirection = CostDirections[this.additionalCostCostDirection];
        } else {
            this.setCostDirection();
        }
        this.summaryCostTotalAmountComponent.setValuesForTotalWithoutTax(this.totalRecordForGoods);
    }

    setCostDirection() {
        this.totalRecordForGoods.costDirection = (Math.abs(this.additionalCostRate) > Math.abs(this.valueOfGoodsTotal)) ?
            CostDirections[this.additionalCostCostDirection] : CostDirections[this.valueOfGoodsCostDirection];
    }

    onChangedCostContract(model: any) {
        if (model) {
            this.additionalCostRate = model.rate;
            this.additionalCostCostDirection = model.costDirection;
            if (this.additionalCostCostDirection === CostDirections[CostDirections.Payable]) {
                this.additionalCostRate = -(this.additionalCostRate);
            }
            this.summaryTaxCostsComponent.getTaxesForSelectedVat(model);
            this.calculateTotalWithoutTax();
        }
    }
}
