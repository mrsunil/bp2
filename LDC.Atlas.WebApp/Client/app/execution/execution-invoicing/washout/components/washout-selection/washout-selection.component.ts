import { Component, OnInit, ViewChild, EventEmitter, Output, HostListener } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BaseFormComponent } from '../../../../../shared/components/base-form-component/base-form-component.component';
import { FormConfigurationProviderService } from '../../../../../shared/services/form-configuration-provider.service';
import { DecimalsComponent } from './components/decimals/decimals.component';
import { InvoiceTypeSelectionComponent } from './components/invoice-type-selection/invoice-type-selection.component';
import { WashoutSearchComponent } from './components/washout-search/washout-search.component';
import { InvoiceRecord } from '../../../../../shared/services/execution/dtos/invoice-record';

@Component({
    selector: 'atlas-washout-selection',
    templateUrl: './washout-selection.component.html',
    styleUrls: ['./washout-selection.component.scss'],
})
export class WashoutSelectionComponent extends BaseFormComponent implements OnInit {
    private formComponents: BaseFormComponent[] = [];
    @ViewChild('invoiceTypeSelectionComponent') invoiceTypeSelectionComponent: InvoiceTypeSelectionComponent;
    @ViewChild('washoutSearchComponent') washoutSearchComponent: WashoutSearchComponent;
    @ViewChild('washoutDecimalsComponent') washoutDecimalsComponent: DecimalsComponent;
    @Output() readonly counterPartySelected = new EventEmitter<String>();
    @Output() readonly washoutContractsSelected = new EventEmitter<boolean>();

    invoiceSelectionFormGroup: FormGroup;

    constructor(protected formBuilder: FormBuilder,
        protected formConfigurationProvider: FormConfigurationProviderService) {
        super(formConfigurationProvider);
    }

    ngOnInit() {
        this.invoiceSelectionFormGroup = this.formBuilder.group({
            invoiceTypeSelectionComponent: this.invoiceTypeSelectionComponent.getFormGroup(),
            washoutSearchComponent: this.washoutSearchComponent.getFormGroup(),
            washoutDecimalsComponent: this.washoutDecimalsComponent.getFormGroup(),
        });
        this.formComponents.push(
            this.invoiceTypeSelectionComponent,
            this.washoutSearchComponent,
            this.washoutDecimalsComponent);
    }

    onCounterPartySelected(counterParty) {
        this.counterPartySelected.emit(counterParty);
    }

    onContractsSelected(contractsSelected: boolean) {
        this.washoutContractsSelected.emit(contractsSelected);
    }

    populateEntity(model: InvoiceRecord): InvoiceRecord {
        this.formComponents.forEach((comp) => {
            comp.populateEntity(model);
        });
        return model;
    }

}
