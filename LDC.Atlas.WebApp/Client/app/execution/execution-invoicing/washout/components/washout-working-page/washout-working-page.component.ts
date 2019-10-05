import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseFormComponent } from '../../../../../shared/components/base-form-component/base-form-component.component';
import { CostDirectionType } from '../../../../../shared/enums/cost-direction-type.enum';
import { CostDirections } from '../../../../../shared/enums/cost-direction.enum';
import { ContractsToWashoutInvoice } from '../../../../../shared/services/execution/dtos/contracts-to-washout-invoice';
import { InvoiceRecord } from '../../../../../shared/services/execution/dtos/invoice-record';
import { TaxRecord } from '../../../../../shared/services/execution/dtos/tax-record';
import { FormConfigurationProviderService } from '../../../../../shared/services/form-configuration-provider.service';
import { ExecutionService } from '../../../../../shared/services/http-services/execution.service';
import { AdditionalCostComponent } from './components/additional-cost/additional-cost.component';
import { InvoiceDocumentComponent } from './components/invoice-document/invoice-document.component';
import { WashoutPaymentsComponent } from './components/payments/payments.component';
import { SelectionComponent } from './components/selection/selection.component';
import { TaxCostsComponent } from './components/tax-costs/tax-costs.component';
import { TaxGoodsComponent } from './components/tax-goods/tax-goods.component';
import { WashoutValueOfGoodsComponent } from './components/value-of-goods/value-of-goods.component';
import { WashoutTotalComponent } from './components/washout-total/washout-total.component';

@Component({
    selector: 'atlas-washout-working-page',
    templateUrl: './washout-working-page.component.html',
    styleUrls: ['./washout-working-page.component.scss'],
})
export class WashoutWorkingPageComponent extends BaseFormComponent implements OnInit {
    private formComponents: BaseFormComponent[] = [];
    @ViewChild('additionalCostComponent') additionalCostComponent: AdditionalCostComponent;
    @ViewChild('invoiceDocumentComponent') invoiceDocumentComponent: InvoiceDocumentComponent;
    @ViewChild('washoutPaymentComponent') washoutPaymentComponent: WashoutPaymentsComponent;
    @ViewChild('washoutSelectionComponent') washoutSelectionComponent: SelectionComponent;
    @ViewChild('valueOfGoodsComponent') valueOfGoodsComponent: WashoutValueOfGoodsComponent;
    @ViewChild('taxGoodsComponent') taxGoodsComponent: TaxGoodsComponent;
    @ViewChild('taxCostsComponent') taxCostsComponent: TaxCostsComponent;
    @ViewChild('totalComponent') totalComponent: WashoutTotalComponent;

    @Output() readonly valueOfGoodsRecord = new EventEmitter<any>();
    @Output() readonly totalCostAndVatCode = new EventEmitter<number>();
    @Output() readonly totalCostTaxCalculated = new EventEmitter<number>();
    @Output() readonly isDocumentTemplateSelected = new EventEmitter<boolean>();
    @Output() readonly narrativeLength = new EventEmitter<boolean>();

    invoiceWashoutWorkingFormGroup: FormGroup;
    invoiceTypeId: number;
    totalData: TaxRecord;
    totalRecordForWashout: InvoiceRecord = new InvoiceRecord();
    valueOfGoodsTotal: number = 0;
    valueOfGoodsDecimalOption: number = 2;
    valueOfGoodsCurrency: string;
    valueOfGoodsCreditDebit: string;
    additionalCostRate: number = 0;
    additionalCostCostDirection: string;
    selectedGoodsVatCode: string;
    valueOfGoodsCostDirection: string;
    isSave: boolean = false;

    constructor(private executionService: ExecutionService,
        protected formBuilder: FormBuilder,
        protected formConfigurationProvider: FormConfigurationProviderService,
        private route: ActivatedRoute,
        private router: Router) {
        super(formConfigurationProvider);
        this.invoiceTypeId = Number(decodeURIComponent(this.route.snapshot.paramMap.get('invoiceTypeId')));
    }

    ngOnInit() {
        this.invoiceWashoutWorkingFormGroup = this.formBuilder.group({
            invoiceDocumentComponent: this.invoiceDocumentComponent.getFormGroup(),
            washoutPaymentComponent: this.washoutPaymentComponent.getFormGroup(),
            washoutSelectionComponent: this.washoutSelectionComponent.getFormGroup(),
            valueOfGoodsComponent: this.valueOfGoodsComponent.getFormGroup(),
            additionalCostComponent: this.additionalCostComponent.getFormGroup(),
            taxGoodsComponent: this.taxGoodsComponent.getFormGroup(),
            taxCostsComponent: this.taxCostsComponent.getFormGroup(),
            totalComponent: this.totalComponent.getFormGroup(),
        });

        this.formComponents.push(
            this.invoiceDocumentComponent,
            this.washoutPaymentComponent,
            this.washoutSelectionComponent,
            this.valueOfGoodsComponent,
            this.additionalCostComponent,
            this.taxGoodsComponent,
            this.taxCostsComponent,
            this.totalComponent,
        );
    }

    populateEntity(model: InvoiceRecord): InvoiceRecord {
        this.formComponents.forEach((comp) => {
            comp.populateEntity(model);
        });
        return model;
    }

    contractsSelected(contracts: ContractsToWashoutInvoice[]) {
        this.washoutSelectionComponent.selectedWashoutContracts(contracts);
        this.valueOfGoodsComponent.selectedWashoutContracts(contracts);
        this.invoiceDocumentComponent.selectedWashoutContracts(contracts);
        if (contracts && contracts.length > 0) {
            this.additionalCostComponent.setDefaultCurrency(contracts[0].currencyCode);
        }
    }

    pricingAndDecimalOptionSelected(pricingOption: number, decimalOption: number) {
        this.valueOfGoodsComponent.decimalOptionSelected(decimalOption);
    }

    onTotalCostTaxCalculated(model) {
        this.totalData = model;
        this.calculateTaxTotal(model);
        this.totalCostTaxCalculated.emit(model);
    }

    calculateTaxTotal(model) {
        this.totalComponent.setValuesForTotalTax(model);
    }

    calculateTotalWithoutTax() {
        this.totalRecordForWashout.totalInvoiceValue = this.additionalCostRate + this.valueOfGoodsTotal;
        this.totalRecordForWashout.decimalOption = this.valueOfGoodsDecimalOption;
        this.totalRecordForWashout.currency = this.valueOfGoodsCurrency;
        if (this.valueOfGoodsCostDirection === this.additionalCostCostDirection) {
            this.totalRecordForWashout.costDirection = CostDirections[this.additionalCostCostDirection];
        } else {
            if (Math.abs(this.additionalCostRate) > Math.abs(this.valueOfGoodsTotal)) {
                this.totalRecordForWashout.costDirection = CostDirections[this.additionalCostCostDirection];
            } else {
                this.totalRecordForWashout.costDirection = CostDirections[this.valueOfGoodsCostDirection];
            }
        }

        this.totalComponent.setValuesForTotalWithoutTax(this.totalRecordForWashout);
    }

    onChangeCostContract(model) {
        if (model) {
            this.additionalCostRate = model.rate;
            this.additionalCostCostDirection = model.costDirection;
            if (this.additionalCostCostDirection === CostDirections[CostDirections.Payable]) {
                this.additionalCostRate = -(this.additionalCostRate);
            }
            this.taxCostsComponent.getTaxesForSelectedVat(model);
            this.totalCostAndVatCode.emit(model);
            this.calculateTotalWithoutTax();
        }
    }

    ontotalAmountCalculated(model) {
        this.valueOfGoodsTotal = model.amount;
        this.valueOfGoodsDecimalOption = model.decimalOption;
        this.valueOfGoodsCurrency = model.currencyCode;
        this.valueOfGoodsCostDirection = CostDirections[CostDirectionType[model.creditDebit]];
        this.valueOfGoodsRecord.emit(model);
        if (this.valueOfGoodsCostDirection === CostDirections[CostDirections.Payable]) {
            this.valueOfGoodsTotal = -(this.valueOfGoodsTotal);
        }
        this.calculateTotalWithoutTax();
    }

    onChangeGoodsTaxCode(vatCode: string) {
        this.selectedGoodsVatCode = vatCode;
    }

    onDocumentTemplateSelected(value) {
        this.isDocumentTemplateSelected.emit(value);
    }

    invoiceDateChanged(documentTypeValue: Date) {
        this.washoutPaymentComponent.invoiceDateChanged = documentTypeValue;
    }

    onNarrativeValueChange(maxLength: boolean) {
        this.narrativeLength.emit(maxLength);
    }

    validateCostGrid() {
        // calling the costgrid component to set the required field validation
        return this.additionalCostComponent.validate();
    }

    getWashoutRecords() {
        const washoutRecordForBankingOption = new InvoiceRecord();
        washoutRecordForBankingOption.currency = this.totalComponent.currencyCode;
        washoutRecordForBankingOption.counterpartyCode = this.washoutSelectionComponent.counterpartyCtrl.value;

        (this.totalComponent.totalCostDirection === CostDirectionType[CostDirectionType.Cr]) ?
            washoutRecordForBankingOption.costDirection = CostDirections.Payable :
            washoutRecordForBankingOption.costDirection = CostDirections.Receivable;
        return washoutRecordForBankingOption;
    }
}
