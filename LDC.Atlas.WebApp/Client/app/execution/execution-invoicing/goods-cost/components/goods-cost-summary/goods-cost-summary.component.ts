import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BaseFormComponent } from '../../../../../shared/components/base-form-component/base-form-component.component';
import { CompanyBankAccounts } from '../../../../../shared/entities/company-bankaccounts.entity';
import { CostDirections } from '../../../../../shared/enums/cost-direction.enum';
import { InvoiceTypes } from '../../../../../shared/enums/invoice-type.enum';
import { ContractsToCostInvoice } from '../../../../../shared/services/execution/dtos/contracts-to-cost-invoice';
import { ContractsToInvoice } from '../../../../../shared/services/execution/dtos/contracts-to-invoice';
import { CostInvoiceRecord } from '../../../../../shared/services/execution/dtos/cost-invoice-record';
import { InvoiceRecord } from '../../../../../shared/services/execution/dtos/invoice-record';
import { InvoiceSummaryRecord } from '../../../../../shared/services/execution/dtos/invoice-summary-record';
import { TaxRecord } from '../../../../../shared/services/execution/dtos/tax-record';
import { FormConfigurationProviderService } from '../../../../../shared/services/form-configuration-provider.service';
import { HeaderComponent } from '../../../header/header.component';
import { GoodsCostAdditionalCostComponent } from '../goods-cost-working-page/components/goods-cost-additional-cost/goods-cost-additional-cost.component';
import { GoodsCostPaymentsComponent } from '../goods-cost-working-page/components/goods-cost-payments/goods-cost-payments.component';
import { GoodsCostTaxCostComponent } from '../goods-cost-working-page/components/goods-cost-tax-cost/goods-cost-tax-cost.component';
import { GoodsCostTaxGoodsComponent } from '../goods-cost-working-page/components/goods-cost-tax-goods/goods-cost-tax-goods.component';
import { GoodsCostTotalComponent } from '../goods-cost-working-page/components/goods-cost-total/goods-cost-total.component';
import { GoodsCostValueOfGoodsComponent } from '../goods-cost-working-page/components/goods-cost-value-of-goods/goods-cost-value-of-goods.component';

@Component({
    selector: 'atlas-goods-cost-summary',
    templateUrl: './goods-cost-summary.component.html',
    styleUrls: ['./goods-cost-summary.component.scss'],
})
export class GoodsCostSummaryComponent extends BaseFormComponent implements OnInit {
    @Input() defaultVATCode: string;
    @Input() isCreationMode: boolean;
    private formComponents: BaseFormComponent[] = [];

    @ViewChild('summaryHeaderComponent') summaryHeaderComponent: HeaderComponent;
    @ViewChild('valueOfGoodsComponent') valueOfGoodsComponent: GoodsCostValueOfGoodsComponent;
    @ViewChild('additionalCostComponent') additionalCostComponent: GoodsCostAdditionalCostComponent;
    @ViewChild('taxGoodsComponent') taxGoodsComponent: GoodsCostTaxGoodsComponent;
    @ViewChild('taxCostComponent') taxCostComponent: GoodsCostTaxCostComponent;
    @ViewChild('paymentsComponent') paymentsComponent: GoodsCostPaymentsComponent;
    @ViewChild('totalComponent') totalComponent: GoodsCostTotalComponent;

    @Input() invoiceTaxContracts: TaxRecord[];
    @Input() invoiceTaxTotal: TaxRecord;
    @Input() invoiceCostContracts: ContractsToCostInvoice[];
    @Input() invoiceGoodsContracts: ContractsToInvoice[];
    @Input() goodsTaxCode: string;
    @Input() filteredCompanyBankAccounts: CompanyBankAccounts[];

    invoiceTypeId: number;
    originalInvoiceTypeId: number;
    invoiceWorkingFormGroup: FormGroup;
    selectedGoodsVatCode: string;
    totalRecordForGoodCost: InvoiceRecord = new InvoiceRecord();
    valueOfGoodsTotal: number = 0;
    valueOfGoodsDecimalOption: number = 2;
    valueOfGoodsCurrency: string;
    valueOfGoodsCostDirection: string;
    additionalCostRate: number = 0;
    additionalCostCostDirection: string;

    invoiceSummaryFormGroup: FormGroup;
    model: InvoiceRecord;
    invoiceLabel: string;
    quantityToInvoice: string;
    costContracts: ContractsToCostInvoice[];
    contracts: ContractsToInvoice[];
    costTaxes: TaxRecord[];
    goodsTaxes: string;
    totalData: TaxRecord;
    decimalOptionValue: number = 0;
    pricingOptionValue: number = 0;
    defaultDecimalOption: number = 2;
    contract: ContractsToCostInvoice;
    contractType: string = 'Contract';
    taxForCostInvoice: CostInvoiceRecord;
    constructor(protected formBuilder: FormBuilder,
        protected formConfigurationProvider: FormConfigurationProviderService,
        private route: ActivatedRoute) {
        super(formConfigurationProvider);
        this.invoiceTypeId = Number(decodeURIComponent(this.route.snapshot.paramMap.get('invoiceTypeId')));
    }

    ngOnInit() {
        this.invoiceSummaryFormGroup = this.formBuilder.group({
            paymentsComponent: this.paymentsComponent.getFormGroup(),
            taxCostComponent: this.taxCostComponent.getFormGroup(),
            additionalCostComponent: this.additionalCostComponent.getFormGroup(),
            summaryHeaderComponent: this.summaryHeaderComponent.getFormGroup(),
        });
        this.invoiceSummaryFormGroup.disable();

        this.formComponents.push(
            this.paymentsComponent,
            this.taxCostComponent,
            this.additionalCostComponent,
            this.summaryHeaderComponent);
    }

    setDecimalAndPricingOption(decimalOptionValue, pricingOptionValue) {
        this.decimalOptionValue = decimalOptionValue;
        this.pricingOptionValue = pricingOptionValue;
    }

    populateInvoiceRecord(record: InvoiceRecord) {
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
            this.valueOfGoodsComponent.contractToBeSelected(this.contracts);
        }
        if (this.costContracts) {
            this.additionalCostComponent.contractToBeSelected(this.costContracts);
        }
        if (this.costTaxes) {
            this.taxCostComponent.taxRecordsSelected(this.costTaxes);
        }
        if (this.goodsTaxes) {
            this.taxGoodsComponent.setDefaultVatCode(this.goodsTaxes);
        }
        if (this.model) {
            this.paymentsComponent.setPaymentFieldsForSummary(this.model);
            this.summaryHeaderComponent.setHeaderFieldsForSummary(this.model, this.filteredCompanyBankAccounts);
        }
        this.additionalCostComponent.isAdditionalCostForSummary = true;

    }

    calculateTaxTotal(model) {
        this.totalComponent.setValuesForTotalTax(model);
    }

    calculateTotalWithoutTax() {
        this.totalRecordForGoodCost.totalInvoiceValue = this.additionalCostRate + this.valueOfGoodsTotal;
        this.totalRecordForGoodCost.decimalOption = this.valueOfGoodsDecimalOption;
        this.totalRecordForGoodCost.currency = this.valueOfGoodsCurrency;
        if (this.valueOfGoodsCostDirection === this.additionalCostCostDirection) {
            this.totalRecordForGoodCost.costDirection = CostDirections[this.additionalCostCostDirection];
        } else {
            this.setCostDirection();
        }
        this.totalComponent.setValuesForTotalWithoutTax(this.totalRecordForGoodCost);
    }

    setCostDirection() {
        this.totalRecordForGoodCost.costDirection = (Math.abs(this.additionalCostRate) > Math.abs(this.valueOfGoodsTotal))
            ? CostDirections[this.additionalCostCostDirection]
            : CostDirections[this.valueOfGoodsCostDirection];
    }

    ontotalAmountCalculated(model) {
        this.valueOfGoodsTotal = model.amount;
        this.valueOfGoodsDecimalOption = model.decimalOption;
        this.valueOfGoodsCurrency = model.currencyCode;
        this.originalInvoiceTypeId = model.originalInvoiceType;
        if (this.invoiceTypeId === InvoiceTypes.GoodsCostPurchase || this.originalInvoiceTypeId === InvoiceTypes.GoodsCostPurchase) {
            this.valueOfGoodsTotal = -(this.valueOfGoodsTotal);
            this.valueOfGoodsCostDirection = CostDirections[CostDirections.Payable];
        } else {
            this.valueOfGoodsCostDirection = CostDirections[CostDirections.Receivable];
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
            this.taxCostComponent.getTaxesForSelectedVat(model);
            this.calculateTotalWithoutTax();
        }
    }

    setSummaryFieldsFromGrid(summaryRecord: InvoiceSummaryRecord) {
        this.invoiceTypeId = summaryRecord.invoiceType;
        if (summaryRecord.summaryLines) {
            this.taxGoodsComponent.setDataForTaxGoods(summaryRecord.summaryLines, this.defaultVATCode);
        }
        if (summaryRecord) {
            this.additionalCostComponent.contractToBeSelectedFromGrid(summaryRecord);
            this.valueOfGoodsComponent.contractToBeSelectedFromGrid(summaryRecord);
            this.paymentsComponent.setValuesForSummaryFromGrid(summaryRecord);
            this.summaryHeaderComponent.setHeaderFieldsFromGrid(summaryRecord);
        }
        this.additionalCostComponent.isAdditionalCostForSummary = true;
    }
}
