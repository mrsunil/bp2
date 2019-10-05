import { Component, EventEmitter, HostListener, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BaseFormComponent } from '../../../../../shared/components/base-form-component/base-form-component.component';
import { FormConfigurationProviderService } from '../../../../../shared/services/form-configuration-provider.service';
import { ContractSelectionFormComponent } from './components/contract-selection-form-component/contract-selection-form-component.component';
import { InvoiceSelectionFormComponent } from './components/invoice-selection-form-component/invoice-selection-form-component.component';
import { PricingOptionsComponent } from './components/pricing-options/pricing-options.component';

@Component({
    selector: 'atlas-commercial-selection',
    templateUrl: './commercial-selection.component.html',
    styleUrls: ['./commercial-selection.component.scss'],
})

export class CommercialSelectionComponent extends BaseFormComponent implements OnInit {

    @Output() readonly pricingAndDecimalOptionSelected = new EventEmitter<any>();
    @Output() readonly contractsSelected = new EventEmitter<boolean>();
    @Input() companyWeightCode: string;

    private formComponents: BaseFormComponent[] = [];

    @ViewChild('contractSelectionComponent') contractSelectionComponent: ContractSelectionFormComponent;
    @ViewChild('pricingOptionsComponent') pricingOptionsComponent: PricingOptionsComponent;
    @ViewChild('InvoiceSelectionFormComponent') InvoiceSelectionFormComponent: InvoiceSelectionFormComponent;

    invoiceSelectionContractFormGroup: FormGroup;

    constructor(protected formBuilder: FormBuilder,
        protected formConfigurationProvider: FormConfigurationProviderService) {
        super(formConfigurationProvider);
    }

    ngOnInit() {
        this.invoiceSelectionContractFormGroup = this.formBuilder.group({
            InvoiceSelectionFormComponent: this.InvoiceSelectionFormComponent.getFormGroup(),
            contractSelectionComponent: this.contractSelectionComponent.getFormGroup(),
            pricingOptionsComponent: this.pricingOptionsComponent.getFormGroup(),
        });
        this.formComponents.push(this.InvoiceSelectionFormComponent, this.pricingOptionsComponent, this.contractSelectionComponent);
    }

    onPricingAndDecimalOptionSelected(model: any) {
        this.pricingAndDecimalOptionSelected.emit({ pricingSelected: model.pricingOption, decimalOptionSelected: model.decimalOption });

    }

    onDifferentCommoditySelected({ differentCommoditySelected, differentPricesSelected }) {
        this.pricingOptionsComponent.onDifferentCommoditySelected(differentCommoditySelected, differentPricesSelected);
    }

    onContractsSelected(contractsSelected: boolean) {
        this.contractsSelected.emit(contractsSelected);

    }

    populateEntity(model: any): any {
        this.formComponents.forEach((comp) => {
            comp.populateEntity(model);
        });
        return model;
    }
}
