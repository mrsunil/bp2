import { ChangeDetectorRef, Component, EventEmitter, HostListener, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BaseFormComponent } from '../../../../../shared/components/base-form-component/base-form-component.component';
import { DocumentTemplateSelectedEvent } from '../../../../../shared/document-template-event.entity';
import { MasterData } from '../../../../../shared/entities/masterdata.entity';
import { CostDirectionType } from '../../../../../shared/enums/cost-direction-type.enum';
import { CostDirections } from '../../../../../shared/enums/cost-direction.enum';
import { DocumentTypes } from '../../../../../shared/enums/document-type.enum';
import { InvoiceTypes } from '../../../../../shared/enums/invoice-type.enum';
import { InvoiceRecord } from '../../../../../shared/services/execution/dtos/invoice-record';
import { TaxRecord } from '../../../../../shared/services/execution/dtos/tax-record';
import { FormConfigurationProviderService } from '../../../../../shared/services/form-configuration-provider.service';
import { ExecutionService } from '../../../../../shared/services/http-services/execution.service';
import { DocumentTemplateComponent } from '../../../components/document-template/document-template.component';
import { GoodsCostAdditionalCostComponent } from './components/goods-cost-additional-cost/goods-cost-additional-cost.component';
import { GoodsCostDetailsComponent } from './components/goods-cost-details/goods-cost-details.component';
import { GoodsCostPaymentsComponent } from './components/goods-cost-payments/goods-cost-payments.component';
import { GoodsCostTaxCostComponent } from './components/goods-cost-tax-cost/goods-cost-tax-cost.component';
import { GoodsCostTaxGoodsComponent } from './components/goods-cost-tax-goods/goods-cost-tax-goods.component';
import { GoodsCostTotalComponent } from './components/goods-cost-total/goods-cost-total.component';
import { GoodsCostValueOfGoodsComponent } from './components/goods-cost-value-of-goods/goods-cost-value-of-goods.component';

@Component({
    selector: 'atlas-goods-cost-working-page',
    templateUrl: './goods-cost-working-page.component.html',
    styleUrls: ['./goods-cost-working-page.component.scss'],
})

export class GoodsCostWorkingPageComponent extends BaseFormComponent implements OnInit {
    private formComponents: BaseFormComponent[] = [];

    @ViewChild('detailsComponent') detailsComponent: GoodsCostDetailsComponent;
    @ViewChild('documentComponent') documentComponent: DocumentTemplateComponent;
    @ViewChild('valueOfGoodsComponent') valueOfGoodsComponent: GoodsCostValueOfGoodsComponent;
    @ViewChild('additionalCostComponent') additionalCostComponent: GoodsCostAdditionalCostComponent;
    @ViewChild('taxGoodsComponent') taxGoodsComponent: GoodsCostTaxGoodsComponent;
    @ViewChild('taxCostComponent') taxCostComponent: GoodsCostTaxCostComponent;
    @ViewChild('paymentsComponent') paymentsComponent: GoodsCostPaymentsComponent;
    @ViewChild('totalComponent') totalComponent: GoodsCostTotalComponent;

    @Output() readonly valueOfGoodsRecord = new EventEmitter<any>();
    @Output() readonly totalCostAndVatCode = new EventEmitter<any>();
    @Output() readonly totalCostTaxCalculated = new EventEmitter<any>();
    @Output() readonly documentTemplateSelected = new EventEmitter<DocumentTemplateSelectedEvent>();
    @Output() readonly narrativeLength = new EventEmitter<boolean>();

    invoiceTypeId: number;
    totalData: TaxRecord;
    invoiceWorkingFormGroup: FormGroup;
    selectedGoodsVatCode: string;
    masterdata: MasterData = new MasterData();
    totalRecordForGoodCost: InvoiceRecord = new InvoiceRecord();
    valueOfGoodsTotal: number = 0;
    valueOfGoodsDecimalOption: number = 2;
    valueOfGoodsCurrency: string;
    valueOfGoodsCostDirection: string;
    additionalCostRate: number = 0;
    additionalCostCostDirection: string;
    isSave: boolean = false;
    DocumentTypes = DocumentTypes;
    InvoiceTypes = InvoiceTypes;

    constructor(private route: ActivatedRoute,
        private executionService: ExecutionService,
        protected formBuilder: FormBuilder,
        protected formConfigurationProvider: FormConfigurationProviderService,
        private cdr: ChangeDetectorRef) {
        super(formConfigurationProvider);
    }

    ngOnInit() {
        this.invoiceWorkingFormGroup = this.formBuilder.group({
            detailsComponent: this.detailsComponent.getFormGroup(),
            documentComponent: this.documentComponent.getFormGroup(),
            valueOfGoodsComponent: this.valueOfGoodsComponent.getFormGroup(),
            additionalCostComponent: this.additionalCostComponent.getFormGroup(),
            taxGoodsComponent: this.taxGoodsComponent.getFormGroup(),
            taxCostComponent: this.taxCostComponent.getFormGroup(),
            paymentsComponent: this.paymentsComponent.getFormGroup(),
            totalComponent: this.totalComponent.getFormGroup(),
        });

        this.formComponents.push(this.detailsComponent, this.documentComponent,
            this.valueOfGoodsComponent, this.additionalCostComponent,
            this.taxGoodsComponent, this.taxCostComponent,
            this.paymentsComponent, this.totalComponent);
        this.invoiceTypeId = Number(decodeURIComponent(this.route.snapshot.paramMap.get('invoiceTypeId')));
        this.masterdata = this.route.snapshot.data.masterdata;
    }

    calculateTaxTotal(model) {
        this.totalComponent.setValuesForTotalTax(model);
    }

    calculateTotalWithoutTax() {
        this.totalRecordForGoodCost.totalInvoiceValue = this.additionalCostRate + this.valueOfGoodsTotal;
        this.totalRecordForGoodCost.decimalOption = this.valueOfGoodsDecimalOption;
        this.totalRecordForGoodCost.currency = this.valueOfGoodsCurrency;
        if (this.additionalCostCostDirection) {
            if (this.valueOfGoodsCostDirection === this.additionalCostCostDirection) {
                this.totalRecordForGoodCost.costDirection = CostDirections[this.additionalCostCostDirection];
            } else {
                if (Math.abs(this.additionalCostRate) > Math.abs(this.valueOfGoodsTotal)) {
                    this.totalRecordForGoodCost.costDirection = CostDirections[this.additionalCostCostDirection];
                } else {
                    this.totalRecordForGoodCost.costDirection = CostDirections[this.valueOfGoodsCostDirection];
                }
            }
        } else {
            this.totalRecordForGoodCost.costDirection = CostDirections[this.valueOfGoodsCostDirection];
        }

        this.totalComponent.setValuesForTotalWithoutTax(this.totalRecordForGoodCost);
    }

    ontotalAmountCalculated(model) {
        this.valueOfGoodsTotal = model.amount;
        this.valueOfGoodsDecimalOption = model.decimalOption;
        this.valueOfGoodsCurrency = model.currencyCode;
        this.cdr.detectChanges();
        this.valueOfGoodsRecord.emit(model);

        if (this.invoiceTypeId === InvoiceTypes.GoodsCostPurchase) {
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
        this.totalCostTaxCalculated.emit(model);
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
            this.totalCostAndVatCode.emit(model);
            this.calculateTotalWithoutTax();
        }

    }

    onDocumentTemplateSelected(event: DocumentTemplateSelectedEvent) {
        this.documentTemplateSelected.emit(event);
    }

    onInvoiceDateSelected(invoiceDate: Date) {
        this.paymentsComponent.setinvoiceDateSelected(invoiceDate);
    }

    setInvoiceSetupByCompany(data) {
        this.taxCostComponent.setDefaultVatCode(data.defaultVATCode);
        this.taxGoodsComponent.setDefaultVatCode(data.defaultVATCode);
        this.additionalCostComponent.setDefaultVatCode(data.defaultVATCode);
        this.detailsComponent.setDefaultAuthorizeForPosting(data.authorizedForPosting);
    }

    populateEntity(model: InvoiceRecord): InvoiceRecord {
        this.formComponents.forEach((comp) => {
            comp.populateEntity(model);
        });
        return model;
    }

    pricingAndDecimalOptionSelected(pricingOption: number, decimalOption: number) {
        this.valueOfGoodsComponent.pricingAndDecimalOptionSelected(pricingOption, decimalOption);
        this.additionalCostComponent.pricingAndDecimalOptionSelected(pricingOption, decimalOption);
    }

    onNarrativeValueChange(maxLength: boolean) {
        this.narrativeLength.emit(maxLength);
    }

    validateCostGrid() {
        // calling the costgrid component to set the required field validation
        return this.additionalCostComponent.validate();
    }

    getGoodsCostRecords() {
        const goodCostRecordForBankingOption = new InvoiceRecord();
        goodCostRecordForBankingOption.currency = this.totalComponent.currencyCode;
        goodCostRecordForBankingOption.counterpartyCode = this.detailsComponent.counterpartyCtrl.value;

        (this.totalComponent.totalCostDirection === CostDirectionType[CostDirectionType.Cr]) ?
            goodCostRecordForBankingOption.costDirection = CostDirections.Payable :
            goodCostRecordForBankingOption.costDirection = CostDirections.Receivable;
        return goodCostRecordForBankingOption;
    }

    @HostListener('window:beforeunload', ['$event']) unloadNotification($event: any) {
        if (this.invoiceWorkingFormGroup.dirty) {
            $event.returnValue = true;
        }
    }
}
