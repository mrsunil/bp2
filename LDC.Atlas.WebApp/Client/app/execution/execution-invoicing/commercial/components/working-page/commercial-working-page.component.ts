import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BaseFormComponent } from '../../../../../shared/components/base-form-component/base-form-component.component';
import { DocumentTemplateSelectedEvent } from '../../../../../shared/document-template-event.entity';
import { CostDirectionType } from '../../../../../shared/enums/cost-direction-type.enum';
import { CostDirections } from '../../../../../shared/enums/cost-direction.enum';
import { CostSigns } from '../../../../../shared/enums/cost-sign.enum';
import { DocumentTypes } from '../../../../../shared/enums/document-type.enum';
import { InvoicePaymentType } from '../../../../../shared/enums/invoice-payment-type';
import { InvoiceTypes } from '../../../../../shared/enums/invoice-type.enum';
import { ContractsToInvoice } from '../../../../../shared/services/execution/dtos/contracts-to-invoice';
import { InvoiceRecord } from '../../../../../shared/services/execution/dtos/invoice-record';
import { TaxRecord } from '../../../../../shared/services/execution/dtos/tax-record';
import { FormConfigurationProviderService } from '../../../../../shared/services/form-configuration-provider.service';
import { DocumentTemplateComponent } from '../../../components/document-template/document-template.component';
import { TotalAmountComponent } from '../../../total-amount/total-amount.component';
import { AddCostTaxComponent } from './components/add-cost-tax/add-cost-tax.component';
import { AddCostTotalComponent } from './components/add-cost-total/add-cost-total.component';
import { AddCostComponent } from './components/add-cost/add-cost.component';
import { CommercialPaymentsComponent } from './components/payments-component/payments-component.component';
import { SelectionFormComponentComponent } from './components/selection-form-component/selection-form-component.component';
import { TaxesComponent } from './components/taxes-component/taxes-component.component';
import { CommercialValueOfGoodsComponent } from './components/value-of-goods-component/value-of-goods-component.component';

@Component({
    selector: 'atlas-commercial-working-page',
    templateUrl: './commercial-working-page.component.html',
    styleUrls: ['./commercial-working-page.component.scss'],
})
export class CommercialWorkingPageComponent extends BaseFormComponent implements OnInit {
    @Output() readonly totalAmountCalculated = new EventEmitter<number>();
    @Output() readonly templateSelected = new EventEmitter<DocumentTemplateSelectedEvent>();
    @Output() readonly totalCostTaxCalculated = new EventEmitter<number>();
    @Output() readonly totalCostAndVatCode = new EventEmitter<number>();
    @Output() readonly narrativeLength = new EventEmitter<boolean>();
    private formComponents: BaseFormComponent[] = [];

    @ViewChild('paymentComponent') paymentComponent: CommercialPaymentsComponent;
    @ViewChild('taxesComponent') taxesComponent: TaxesComponent;
    @ViewChild('totalAmountComponent') totalAmountComponent: TotalAmountComponent;
    @ViewChild('documentTemplateComponent') documentTemplateComponent: DocumentTemplateComponent;
    @ViewChild('selectionFormComponent') selectionFormComponent: SelectionFormComponentComponent;
    @ViewChild('valueOfGoodsComponent') valueOfGoodsComponent: CommercialValueOfGoodsComponent;
    @ViewChild('addCostComponent') addCostComponent: AddCostComponent;
    @ViewChild('taxCostsComponent') taxCostsComponent: AddCostTaxComponent;
    @ViewChild('totalComponent') totalComponent: AddCostTotalComponent;
    invoiceWorkingFormGroup: FormGroup;
    DocumentTypes = DocumentTypes;
    InvoiceTypes = InvoiceTypes;
    additionalCostRate: number = 0;
    additionalCostCostDirection: string;
    totalData: TaxRecord;
    totalRecordForWashout: InvoiceRecord = new InvoiceRecord();
    valueOfGoodsDecimalOption: number = 2;
    valueOfGoodsCurrency: string;
    valueOfGoodsCostDirection: string;
    valueOfGoodsTotal: number = 0;
    selectedGoodsVatCode: string;
    @Input() companyWeightCode: string;

    constructor(protected formBuilder: FormBuilder,
        protected formConfigurationProvider: FormConfigurationProviderService) {
        super(formConfigurationProvider);
    }

    ngOnInit() {
        this.invoiceWorkingFormGroup = this.formBuilder.group({
            selectionFormComponent: this.selectionFormComponent.getFormGroup(),
            paymentComponent: this.paymentComponent.getFormGroup(),
            taxesComponent: this.taxesComponent.getFormGroup(),
            documentTemplateComponent: this.documentTemplateComponent.getFormGroup(),
            totalComponent: this.totalComponent.getFormGroup(),
            addCostComponent: this.addCostComponent.getFormGroup(),
            taxCostsComponent: this.taxCostsComponent.getFormGroup(),
        });

        this.formComponents.push(
            this.paymentComponent,
            this.taxesComponent,
            this.documentTemplateComponent,
            this.selectionFormComponent,
            this.valueOfGoodsComponent,
            this.totalComponent,
            this.addCostComponent,
            this.taxCostsComponent);
    }

    contractsSelected(contracts: ContractsToInvoice[]) {
        this.selectionFormComponent.contractToBeSelected(contracts);
        this.valueOfGoodsComponent.contractToBeSelected(contracts);
        if (contracts && contracts.length > 0) {
            this.addCostComponent.setDefaultCurrency(contracts[0].currencyCode);
        }
    }
    pricingAndDecimalOptionSelected(pricingOption: number, decimalOption: number) {
        this.valueOfGoodsComponent.pricingAndDecimalOptionSelected(pricingOption, decimalOption);
    }

    onInvoiceDateSelected(invoiceDate: Date) {
        this.paymentComponent.setinvoiceDateSelected(invoiceDate);
    }

    ontotalAmountCalculated(model: any) {
        if (model) {
            this.totalComponent.amount = model.amount;
            this.valueOfGoodsTotal = model.amount;
            this.valueOfGoodsCurrency = model.currencyCode;
            this.valueOfGoodsCostDirection = CostDirections[CostDirectionType[model.debitCredit]];
            this.totalComponent.decimalOption = model.decimalOption;
            this.totalComponent.currencyCode = model.currencyCode;
            this.totalComponent.totalCostDirectionSign = CostSigns[CostDirectionType[model.debitCredit]];
            this.totalComponent.invoiceLabel = InvoicePaymentType[CostDirectionType[model.debitCredit]];
            this.taxesComponent.currencyCode = model.currencyCode;
            if (this.valueOfGoodsCostDirection === CostDirections[CostDirections.Payable]) {
                this.valueOfGoodsTotal = -(this.valueOfGoodsTotal);
            }
            this.calculateTotalWithoutTax();
        }
    }

    onTemplateSelected(event: DocumentTemplateSelectedEvent) {
        this.templateSelected.emit(event);
    }

    onCostCurrency(currency: any) {
        this.addCostComponent.currencyCodeSelected = currency;
        this.taxCostsComponent.currencyCode = currency;
    }

    populateEntity(model: any): any {
        this.formComponents.forEach((comp) => {
            comp.populateEntity(model);
        });
        return model;
    }
    onChangeCostContract(model: any) {
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

    onChangeGoodsTaxCode(vatCode: string) {
        this.selectedGoodsVatCode = vatCode;
    }

    onTotalCostTaxCalculated(model: any) {
        this.totalData = model;
        this.calculateTaxTotal(model);
        this.totalCostTaxCalculated.emit(model);
    }
    calculateTaxTotal(model: any) {
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

    onNarrativeValueChanged(maxLength: boolean) {
        this.narrativeLength.emit(maxLength);
    }

    validateCostGrid() {
        // calling the costgrid component to set the required field validation
        return this.addCostComponent.validate();
    }

}
