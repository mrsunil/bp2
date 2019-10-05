import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BaseFormComponent } from '../../../../../shared/components/base-form-component/base-form-component.component';
import { CostDirectionType } from '../../../../../shared/enums/cost-direction-type.enum';
import { CostDirections } from '../../../../../shared/enums/cost-direction.enum';
import { ContractsToCostInvoice } from '../../../../../shared/services/execution/dtos/contracts-to-cost-invoice';
import { ContractsToWashoutInvoice } from '../../../../../shared/services/execution/dtos/contracts-to-washout-invoice';
import { InvoiceRecord } from '../../../../../shared/services/execution/dtos/invoice-record';
import { InvoiceSummaryRecord } from '../../../../../shared/services/execution/dtos/invoice-summary-record';
import { TaxRecord } from '../../../../../shared/services/execution/dtos/tax-record';
import { FormConfigurationProviderService } from '../../../../../shared/services/form-configuration-provider.service';
import { HeaderComponent } from '../../../header/header.component';
import { AdditionalCostComponent } from '../washout-working-page/components/additional-cost/additional-cost.component';
import { WashoutPaymentsComponent } from '../washout-working-page/components/payments/payments.component';
import { TaxCostsComponent } from '../washout-working-page/components/tax-costs/tax-costs.component';
import { TaxGoodsComponent } from '../washout-working-page/components/tax-goods/tax-goods.component';
import { WashoutValueOfGoodsComponent } from '../washout-working-page/components/value-of-goods/value-of-goods.component';
import { WashoutTotalComponent } from '../washout-working-page/components/washout-total/washout-total.component';
import { CompanyBankAccounts } from '../../../../../shared/entities/company-bankaccounts.entity';

@Component({
    selector: 'atlas-washout-summary',
    templateUrl: './washout-summary.component.html',
    styleUrls: ['./washout-summary.component.scss'],
})
export class WashoutSummaryComponent extends BaseFormComponent implements OnInit {

    private formComponents: BaseFormComponent[] = [];
    @Input() defaultVATCode: string;
    @Input() isCreationMode: boolean;
    @ViewChild('summaryHeaderComponent') summaryHeaderComponent: HeaderComponent;
    @ViewChild('summaryValueOfGoodsComponent') summaryValueOfGoodsComponent: WashoutValueOfGoodsComponent;
    @ViewChild('summaryAdditionalCostComponent') summaryAdditionalCostComponent: AdditionalCostComponent;
    @ViewChild('summaryTaxGoodsComponent') summaryTaxGoodsComponent: TaxGoodsComponent;
    @ViewChild('summaryTaxCostsComponent') summaryTaxCostsComponent: TaxCostsComponent;
    @ViewChild('summaryPaymentComponent') summaryPaymentComponent: WashoutPaymentsComponent;
    @ViewChild('summaryTotalAmountComponent') summaryTotalAmountComponent: WashoutTotalComponent;

    @Input() invoiceTaxContracts: TaxRecord[];
    @Input() invoiceTaxTotal: TaxRecord;
    @Input() invoiceCostContracts: ContractsToCostInvoice[];
    @Input() invoiceGoodsContracts: ContractsToWashoutInvoice[];
    @Input() goodsTaxCode: string;
    @Input() filteredCompanyBankAccounts: CompanyBankAccounts[];

    invoiceTypeId: number;
    invoiceWorkingFormGroup: FormGroup;
    selectedGoodsVatCode: string;
    totalRecordForWashout: InvoiceRecord = new InvoiceRecord();
    valueOfGoodsTotal: number = 0;
    valueOfGoodsDecimalOption: number = 2;
    valueOfGoodsCurrency: string;
    valueOfGoodsCreditDebit: string;
    additionalCostRate: number = 0;
    additionalCostCostDirection: string;
    valueOfGoodsCostDirection: string;

    washoutSummaryFormGroup: FormGroup;
    model: InvoiceRecord;
    contracts: ContractsToWashoutInvoice[];
    taxRecord: TaxRecord;
    costContracts: ContractsToCostInvoice[];
    costTaxes: TaxRecord[];
    goodsTaxes: string;
    totalData: TaxRecord;

    constructor(protected formBuilder: FormBuilder,
        protected formConfigurationProvider: FormConfigurationProviderService) {
        super(formConfigurationProvider);
    }

    ngOnInit() {
        this.washoutSummaryFormGroup = this.formBuilder.group({
            summaryValueOfGoodsComponent: this.summaryValueOfGoodsComponent.getFormGroup(),
            summaryAdditionalCostComponent: this.summaryAdditionalCostComponent.getFormGroup(),
            summaryTaxGoodsComponent: this.summaryTaxGoodsComponent.getFormGroup(),
            summaryTaxCostsComponent: this.summaryTaxCostsComponent.getFormGroup(),
            summaryPaymentComponent: this.summaryPaymentComponent.getFormGroup(),
            summaryHeaderComponent: this.summaryHeaderComponent.getFormGroup(),
            summaryTotalAmountComponent: this.summaryTotalAmountComponent.getFormGroup(),
        });
        this.washoutSummaryFormGroup.disable();

        this.formComponents.push(
            this.summaryValueOfGoodsComponent,
            this.summaryAdditionalCostComponent,
            this.summaryTaxGoodsComponent,
            this.summaryTaxCostsComponent,
            this.summaryPaymentComponent,
            this.summaryHeaderComponent,
            this.summaryTotalAmountComponent);
            this.summaryAdditionalCostComponent.isAdditionalCostForSummary = true;
    
    }
    washoutContracts(contracts: ContractsToWashoutInvoice[]) {
        this.contracts = contracts;
    }

    populateInvoiceRecord(record) {
        this.contracts = this.invoiceGoodsContracts;
        this.costContracts = this.invoiceCostContracts;
        this.costTaxes = this.invoiceTaxContracts;
        this.totalData = this.invoiceTaxTotal;
        this.goodsTaxes = this.goodsTaxCode;
        this.model = record;
        this.populateSummaryFields();
    }

    populateSummaryFields() {
        if (this.contracts) {
            this.summaryValueOfGoodsComponent.selectedWashoutContracts(this.contracts);
        }
        if (this.costContracts) {
            this.summaryAdditionalCostComponent.contractToBeSelected(this.costContracts);
        }
        if (this.costTaxes) {
            this.summaryTaxCostsComponent.taxRecordsSelected(this.costTaxes);
        }
        if (this.goodsTaxes) {
            this.summaryTaxGoodsComponent.setDefaultVatCode(this.goodsTaxes);
        }
        if (this.model) {
            this.summaryPaymentComponent.setPaymentFieldsForSummary(this.model);
            this.summaryHeaderComponent.setHeaderFieldsForSummary(this.model, this.filteredCompanyBankAccounts);
        }
        this.summaryAdditionalCostComponent.isAdditionalCostForSummary = true;
    }

    calculateTaxTotal(model) {
        this.summaryTotalAmountComponent.setValuesForTotalTax(model);
    }

    calculateTotalWithoutTax() {
        this.totalRecordForWashout.totalInvoiceValue = this.additionalCostRate + this.valueOfGoodsTotal;
        this.totalRecordForWashout.decimalOption = this.valueOfGoodsDecimalOption;
        this.totalRecordForWashout.currency = this.valueOfGoodsCurrency;
        if (this.valueOfGoodsCostDirection === this.additionalCostCostDirection) {
            this.totalRecordForWashout.costDirection = CostDirections[this.additionalCostCostDirection];
        } else {
            this.setCostDirection();
        }
        this.summaryTotalAmountComponent.setValuesForTotalWithoutTax(this.totalRecordForWashout);
    }

    setCostDirection() {
        this.totalRecordForWashout.costDirection = (Math.abs(this.additionalCostRate) > Math.abs(this.valueOfGoodsTotal)) ?
            CostDirections[this.additionalCostCostDirection] : CostDirections[this.valueOfGoodsCostDirection];
    }

    ontotalAmountCalculated(model) {
        this.valueOfGoodsTotal = model.amount;
        this.valueOfGoodsDecimalOption = model.decimalOption;
        this.valueOfGoodsCurrency = model.currencyCode;
        this.valueOfGoodsCostDirection = CostDirections[CostDirectionType[model.creditDebit]];
        if (this.valueOfGoodsCostDirection === CostDirections[CostDirections.Payable]) {
            this.valueOfGoodsTotal = -(this.valueOfGoodsTotal);
        }
        this.calculateTotalWithoutTax();
    }

    onTotalCostTaxCalculated(model) {
        this.totalData = model;
        this.calculateTaxTotal(model);
    }

    onChangeGoodsTaxCode(vatCode: string) {
        this.selectedGoodsVatCode = vatCode;
    }

    onChangeCostContract(model) {
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

    setSummaryFieldsFromGrid(summaryRecord: InvoiceSummaryRecord) {
        if (summaryRecord.summaryLines) {
            this.summaryTaxGoodsComponent.setDataForTaxGoods(summaryRecord.summaryLines, this.defaultVATCode);
        }
        if (summaryRecord) {
            this.summaryAdditionalCostComponent.contractToBeSelectedFromGrid(summaryRecord);
            this.summaryValueOfGoodsComponent.contractToBeSelectedFromGrid(summaryRecord);
            this.summaryPaymentComponent.setValuesForSummaryFromGrid(summaryRecord);
            this.summaryHeaderComponent.setHeaderFieldsFromGrid(summaryRecord);
        }
        this.summaryAdditionalCostComponent.isAdditionalCostForSummary = true;
    }

}
