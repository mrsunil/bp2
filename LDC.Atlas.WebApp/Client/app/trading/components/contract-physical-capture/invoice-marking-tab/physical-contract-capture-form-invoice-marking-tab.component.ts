import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BaseFormComponent } from '../../../../shared/components/base-form-component/base-form-component.component';
import { FormConfigurationProviderService } from '../../../../shared/services/form-configuration-provider.service';
import { DetailedViewComponent } from './components/detailed-view/detailed-view.component';
import { InvoiceStatusComponent } from './components/invoice-status/invoice-status.component';
import { InvoiceTotalsComponent } from './components/invoice-totals/invoice-totals.component';
import { InvoiceViewModeComponent } from './components/invoice-view-mode/invoice-view-mode.component';
import { TopCardComponent } from './components/top-card/top-card.component';

@Component({
    selector: 'atlas-physical-contract-capture-form-invoice-marking-tab',
    templateUrl: './physical-contract-capture-form-invoice-marking-tab.component.html',
    styleUrls: ['./physical-contract-capture-form-invoice-marking-tab.component.scss'],
})
export class PhysicalContractCaptureFormInvoiceMarkingTabComponent extends BaseFormComponent implements OnInit {
    @Output() readonly setCashMatchDate = new EventEmitter<any>();
    @ViewChild('detailedViewComponent') detailedViewComponent: DetailedViewComponent;
    @ViewChild('invoiceTotalsComponent') invoiceTotalsComponent: InvoiceTotalsComponent;
    @ViewChild('invoiceStatusComponent') invoiceStatusComponent: InvoiceStatusComponent;
    @ViewChild('invoiceViewModeComponent') invoiceViewModeComponent: InvoiceViewModeComponent;
    @ViewChild('topCardComponent') topCardComponent: TopCardComponent;
    @Output() readonly totalInvoicePercent = new EventEmitter<any>();

    @Output() readonly totalValuesCalculated = new EventEmitter<any>();

    formComponents: BaseFormComponent[] = [];
    invoiceMarkingForm: FormGroup;
    documentType: string[];
    isEditToggle: boolean = false;

    constructor(protected formBuilder: FormBuilder, protected formConfigurationProvider: FormConfigurationProviderService) {
        super(formConfigurationProvider);
    }

    ngOnInit() {

        this.invoiceMarkingForm = this.formBuilder.group({

            detailedViewComponent: this.detailedViewComponent.getFormGroup(),
            invoiceTotalsComponent: this.invoiceTotalsComponent.getFormGroup(),
            invoiceStatusComponent: this.invoiceStatusComponent.getFormGroup(),
            topCardComponent: this.topCardComponent.getFormGroup(),
            invoiceViewModeComponent: this.invoiceViewModeComponent.getFormGroup(),
        });

        this.formComponents.push(
            this.detailedViewComponent,
            this.invoiceTotalsComponent,
            this.invoiceStatusComponent,
            this.topCardComponent,
            this.invoiceViewModeComponent,
        );
    }

    initForm(entity: any, isEdit: boolean): any {
        this.formComponents.forEach((comp) => {
            comp.initForm(entity, isEdit);
        });
    }

    populateEntity(entity: any): any {
        this.formComponents.forEach((comp) => {
            entity = comp.populateEntity(entity);
        });
        return entity;
    }

    onTotalValuesCalculated(model: any) {
        this.invoiceTotalsComponent.totalQuantity = model.totalQuantity;
        this.invoiceTotalsComponent.totalQuantityPercent = model.totalQuantityPercent;
        this.invoiceTotalsComponent.totalInvoiceValue = model.totalInvoiceValue;
        this.invoiceTotalsComponent.totalInvoiceValuePercent = model.totalInvoiceValuePercent;
        (this.isEditToggle) ? this.invoiceStatusComponent.setInvoiceStatusOnChange(model) :
            this.invoiceStatusComponent.setInvoiceStatusOnPageLoad(model);
        this.totalValuesCalculated.emit(model);
        this.totalInvoicePercent.emit({ totalInvoiceValuePercent: this.invoiceTotalsComponent.totalInvoiceValuePercent });
    }

    documentTypeSelected(documentTypeValue: string[]) {
        this.documentType = documentTypeValue;
    }

    editToggleChanged(value: boolean) {
        this.isEditToggle = value;
    }

    onGetCashMatchDate(cashMatchDate: any) {
        this.setCashMatchDate.emit(cashMatchDate);
    }

    onTabSelected() {
        this.detailedViewComponent.onTabActive();
    }
}
