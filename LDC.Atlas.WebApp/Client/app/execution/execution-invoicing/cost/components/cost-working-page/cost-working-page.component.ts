import { Component, EventEmitter, HostListener, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BaseFormComponent } from '../../../../../shared/components/base-form-component/base-form-component.component';
import { DocumentTemplateSelectedEvent } from '../../../../../shared/document-template-event.entity';
import { InvoiceSetupResult } from '../../../../../shared/dtos/invoice-setup-result';
import { CostDirectionType } from '../../../../../shared/enums/cost-direction-type.enum';
import { CostDirections } from '../../../../../shared/enums/cost-direction.enum';
import { CostSigns } from '../../../../../shared/enums/cost-sign.enum';
import { InvoicePaymentType } from '../../../../../shared/enums/invoice-payment-type';
import { InvoiceSourceType } from '../../../../../shared/enums/invoice-source-type.enum';
import { CostInvoiceRecord } from '../../../../../shared/services/execution/dtos/cost-invoice-record';
import { TaxRecord } from '../../../../../shared/services/execution/dtos/tax-record';
import { FormConfigurationProviderService } from '../../../../../shared/services/form-configuration-provider.service';
import { BankAccountDialogComponent } from '../../../dialog-boxes/bank-account-dialog/bank-account-dialog.component';
import { TotalAmountComponent } from '../../../total-amount/total-amount.component';
import { CostInvoiceeOptionsComponent } from '../cost-selection/components/cost-invoicee-options/cost-invoicee-options.component';
import { CostDocumentTemplateComponent } from './components/document-template/cost-document-template.component';
import { CostPaymentsComponent } from './components/payments/cost-payments.component';
import { InvoiceCostSelectedCostComponent } from './components/selected-cost/invoice-cost-selected-cost.component';
import { CostInvoiceSelectionComponent } from './components/selection/cost-invoice-selection.component';
import { InvoicingCostTaxesComponent } from './components/taxes/invoicing-cost-taxes.component';

@Component({
    selector: 'atlas-cost-working-page',
    templateUrl: './cost-working-page.component.html',
    styleUrls: ['./cost-working-page.component.scss'],
})

export class CostWorkingPageComponent extends BaseFormComponent implements OnInit {
    private formComponents: BaseFormComponent[] = [];
    @ViewChild('costDocumentTemplateComponent') costDocumentTemplateComponent: CostDocumentTemplateComponent;
    @ViewChild('costInvoiceSelectionComponent') costInvoiceSelectionComponent: CostInvoiceSelectionComponent;
    @ViewChild('invoiceCostSelectedCostComponent') invoiceCostSelectedCostComponent: InvoiceCostSelectedCostComponent;
    @ViewChild('invoicingCostTaxesComponent') invoicingCostTaxesComponent: InvoicingCostTaxesComponent;
    @ViewChild('costPaymentsComponent') costPaymentsComponent: CostPaymentsComponent;
    @ViewChild('costInvoiceeOptionsComponent') costInvoiceeOptionsComponent: CostInvoiceeOptionsComponent;
    @ViewChild('totalAmountComponent') totalAmountComponent: TotalAmountComponent;
    @ViewChild('bankAccountDialogComponent') bankAccountDialogComponent: BankAccountDialogComponent;
    @Output() readonly totalCostAndVatCode = new EventEmitter<number>();
    @Output() readonly totalCostTaxCalculated = new EventEmitter<number>();
    @Output() readonly documentTemplateSelected = new EventEmitter<DocumentTemplateSelectedEvent>();
    @Output() readonly narrativeLength = new EventEmitter<boolean>();

    @Input() invoiceSetupData: InvoiceSetupResult;
    decimalOption: number = 2;
    totalData: TaxRecord;
    invoiceCostWorkingFormGroup: FormGroup;
    isSave: boolean = false;
    constructor(protected formBuilder: FormBuilder,
        protected formConfigurationProvider: FormConfigurationProviderService) {
        super(formConfigurationProvider);
    }

    ngOnInit() {
        this.invoiceCostWorkingFormGroup = this.formBuilder.group({
            costDocumentTemplateComponent: this.costDocumentTemplateComponent.getFormGroup(),
            costInvoiceSelectionComponent: this.costInvoiceSelectionComponent.getFormGroup(),
            costPaymentsComponent: this.costPaymentsComponent.getFormGroup(),
            totalAmountComponent: this.totalAmountComponent.getFormGroup(),
        });

        this.formComponents.push(
            this.costDocumentTemplateComponent,
            this.costInvoiceSelectionComponent,
            this.costPaymentsComponent,
            this.invoiceCostSelectedCostComponent,
            this.totalAmountComponent);
    }

    onSupplierSelected(supplier) {
        this.costInvoiceeOptionsComponent.onSupplierSelected(supplier);
    }

    onChangeCostContract(model: CostInvoiceRecord) {
        this.invoicingCostTaxesComponent.getTaxesForSelectedVat(model);
    }

    onNarrativeValueChange(maxLength: boolean) {
        this.narrativeLength.emit(maxLength);
    }
    onTotalCostTaxCalculated(model: TaxRecord) {
        this.totalData = model;
        this.totalAmountComponent.amount = model.amount;
        this.totalAmountComponent.decimalOption = model.decimalOption;
        this.totalAmountComponent.currencyCode = model.currencyCode;
        this.totalAmountComponent.totalCostDirectionSign = CostSigns[CostDirectionType[model.costDirection]];
        this.totalAmountComponent.invoiceLabel = InvoicePaymentType[CostDirectionType[model.costDirection]];
        if (this.invoicingCostTaxesComponent.totalCostDirection === CostDirections[CostDirections.Payable]) {
            this.costDocumentTemplateComponent.invoiceExtInHouseCtrl.patchValue((InvoiceSourceType[InvoiceSourceType.External]));
        } else {
            this.costDocumentTemplateComponent.invoiceExtInHouseCtrl.patchValue((InvoiceSourceType[InvoiceSourceType.Inhouse]));
        }
    }

    onDocumentTemplateSelected(event: DocumentTemplateSelectedEvent) {
        this.documentTemplateSelected.emit(event);
    }

    populateEntity(model: any): any {
        this.formComponents.forEach((comp) => {
            comp.populateEntity(model);
        });
        return model;
    }

    validateCostGrid() {
        //  calling the costgrid component to set the required field validation
        return this.invoiceCostSelectedCostComponent.validate();
    }

    onInvoiceDateSelected(invoiceDate: Date) {
        this.costPaymentsComponent.setinvoiceDateSelected(invoiceDate);
    }
}
