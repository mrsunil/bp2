import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BaseFormComponent } from '../../../../shared/components/base-form-component/base-form-component.component';
import { FormConfigurationProviderService } from '../../../../shared/services/form-configuration-provider.service';
import { AllocationInfoFormComponentComponent } from '../form-components/allocation-info-form-component/allocation-info-form-component.component';
import { AmendmentAuditFormComponentComponent } from '../form-components/amendment-audit-form-component/amendment-audit-form-component.component';
import { CashAgainstInvoiceFormComponentComponent } from '../form-components/cash-against-invoice-form-component/cash-against-invoice-form-component.component';
import { CharterFormComponentComponent } from '../form-components/charter-form-component/charter-form-component.component';
import { DocumentStatusFormComponentComponent } from '../form-components/document-status-form-component/document-status-form-component.component';
import { InvoicingFormComponentComponent } from '../form-components/invoicing-form-component/invoicing-form-component.component';
@Component({
    selector: 'atlas-physical-contract-capture-form-status-tab',
    templateUrl: './physical-contract-capture-form-status-tab.component.html',
    styleUrls: ['./physical-contract-capture-form-status-tab.component.scss'],
})
export class PhysicalContractCaptureFormStatusTabComponent extends BaseFormComponent implements OnInit {
    @ViewChild('AllocationInfoFormComponentComponent') allocationInfoComponent: AllocationInfoFormComponentComponent;
    @ViewChild('AmendmentAuditFormComponentComponent') amendmentAuditComponent: AmendmentAuditFormComponentComponent;
    @ViewChild('CashAgainstInvoiceFormComponentComponent') cashAgainstInvoiceComponent: CashAgainstInvoiceFormComponentComponent;
    @ViewChild('CharterFormComponentComponent') charterComponent: CharterFormComponentComponent;
    @ViewChild('DocumentStatusFormComponentComponent') documentStatusComponent: DocumentStatusFormComponentComponent;
    @ViewChild('InvoicingFormComponentComponent') invoicingComponent: InvoicingFormComponentComponent;

    formComponents: BaseFormComponent[] = [];
    constructor(protected formConfigurationProvider: FormConfigurationProviderService, protected formBuilder: FormBuilder) {
        super(formConfigurationProvider);
    }
    ngOnInit() {
        this.formComponents.push(
            this.charterComponent,
            this.allocationInfoComponent,
            this.amendmentAuditComponent,
            this.documentStatusComponent,
            this.invoicingComponent,
            this.cashAgainstInvoiceComponent,
        );
    }

    initForm(entity: any, isEdit: boolean) {
        this.formComponents.forEach((comp) => {
            comp.initForm(entity, isEdit);
        });
        return entity;
    }

    getFormGroup() {
        this.formGroup = this.formBuilder.group({
            charterGroup: this.charterComponent.getFormGroup(),
            allocationGroup: this.allocationInfoComponent.getFormGroup(),
            amendmentGroup: this.amendmentAuditComponent.getFormGroup(),
            cashGroup: this.cashAgainstInvoiceComponent.getFormGroup(),
            documentGroup: this.documentStatusComponent.getFormGroup(),
            invoiceGroup: this.invoicingComponent.getFormGroup(),
        });
        return super.getFormGroup();
    }
    populateEntity(entity: any): any {
        this.formComponents.forEach((comp) => {
            entity = comp.populateEntity(entity);
        });
        return entity;
    }

    totalValuesCalculated(model: any) {
        this.invoicingComponent.totalValuesCalculated(model);
    }

}
