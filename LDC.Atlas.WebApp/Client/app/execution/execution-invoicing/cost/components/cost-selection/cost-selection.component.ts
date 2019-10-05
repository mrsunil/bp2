import { Component, EventEmitter, OnInit, Output, ViewChild, HostListener } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BaseFormComponent } from '../../../../../shared/components/base-form-component/base-form-component.component';
import { FormConfigurationProviderService } from '../../../../../shared/services/form-configuration-provider.service';
import { ContractSearchComponent } from '../cost-selection/components/contract-search/contract-search.component';
import { InvoiceSelectionComponent } from '../cost-selection/components/invoice-selection/invoice-selection.component';
import { CostInvoiceeOptionsComponent } from './components/cost-invoicee-options/cost-invoicee-options.component';
@Component({
    selector: 'atlas-cost-selection',
    templateUrl: './cost-selection.component.html',
    styleUrls: ['./cost-selection.component.scss'],
})
export class CostSelectionComponent extends BaseFormComponent implements OnInit {

    private formComponents: BaseFormComponent[] = [];
    @ViewChild('invoiceSelectionComponent') invoiceSelectionComponent: InvoiceSelectionComponent;
    @ViewChild('contractSearchComponent') contractSearchComponent: ContractSearchComponent;
    @ViewChild('costInvoiceeOptionsComponent') costInvoiceeOptionsComponent: CostInvoiceeOptionsComponent;
    @Output() readonly costContractsSelected = new EventEmitter<boolean>();
    @Output() readonly userSupplier = new EventEmitter<string>();

    invoiceSelectionFormGroup: FormGroup;

    constructor(protected formBuilder: FormBuilder,
        protected formConfigurationProvider: FormConfigurationProviderService) {
        super(formConfigurationProvider);
    }

    ngOnInit() {
        this.invoiceSelectionFormGroup = this.formBuilder.group({
            invoiceSelectionComponent: this.invoiceSelectionComponent.getFormGroup(),
            contractSearchComponent: this.contractSearchComponent.getFormGroup(),
            costInvoiceeOptionsComponent: this.costInvoiceeOptionsComponent.getFormGroup(),
        });
        this.formComponents.push(
            this.invoiceSelectionComponent,
            this.contractSearchComponent,
            this.costInvoiceeOptionsComponent,
        );
    }

    onSupplierSelected(supplier) {
        this.costInvoiceeOptionsComponent.onSupplierSelected(supplier);
    }

    onCostContractsSelected(costContractsSelected: boolean) {
        this.costContractsSelected.emit(costContractsSelected);
    }

    populateEntity(model: any): any {
        this.formComponents.forEach((comp) => {
            comp.populateEntity(model);
        });
        return model;
    }

    onUserSupplierValueChanged(userSupplier) {
        this.userSupplier.emit(userSupplier);
    }
}
