import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BaseFormComponent } from '../../../../../../../shared/components/base-form-component/base-form-component.component';
import { inDropdownListValidator } from '../../../../../../../shared/directives/autocomplete-dropdown.directive';
import { AtlasFormControl } from '../../../../../../../shared/entities/atlas-form-control';
import { Counterparty } from '../../../../../../../shared/entities/counterparty.entity';
import { MasterData } from '../../../../../../../shared/entities/masterdata.entity';
import { InvoiceRecord } from '../../../../../../../shared/services/execution/dtos/invoice-record';
import { FormConfigurationProviderService } from '../../../../../../../shared/services/form-configuration-provider.service';
import { MasterdataService } from '../../../../../../../shared/services/http-services/masterdata.service';
import { nameof, UtilService } from '../../../../../../../shared/services/util.service';

@Component({
    selector: 'atlas-cost-invoicee-options',
    templateUrl: './cost-invoicee-options.component.html',
    styleUrls: ['./cost-invoicee-options.component.scss'],
})
export class CostInvoiceeOptionsComponent extends BaseFormComponent implements OnInit {
    invoiceeCtrl = new AtlasFormControl('invoiceeCtrl');
    invoiceeDescriptionCtrl = new AtlasFormControl('invoiceeDescriptionCtrl');
    masterdata: MasterData;
    @Output() readonly userSupplier = new EventEmitter<string>();
    supplierSelected: string;
    filteredCounterPartyList: Counterparty[];
    supplierDescription: Counterparty;
    @Output() readonly supplier = new EventEmitter<any>();
    constructor(
        private route: ActivatedRoute,
        protected formBuilder: FormBuilder,
        protected utilService: UtilService,
        protected formConfigurationProvider: FormConfigurationProviderService,
        protected masterdataService: MasterdataService) {
        super(formConfigurationProvider);
    }

    ngOnInit() {
        this.masterdata = this.route.snapshot.data.masterdata;
        this.filteredCounterPartyList = this.masterdata.counterparties;
        this.invoiceeCtrl.valueChanges.subscribe((input) => {
            this.filteredCounterPartyList = this.utilService.filterListforAutocomplete(
                input,
                this.masterdata.counterparties,
                ['counterpartyCode', 'description'],
            );
        });
        this.setValidators();
        this.bindConfiguration();
    }

    getFormGroup() {
        this.formGroup = this.formBuilder.group({
            invoiceeCtrl: this.invoiceeCtrl,
        });
        return super.getFormGroup();
    }
    onSupplierSelected(supplier) {
        if (!supplier.isLineSelected) {
            this.clearValidators();
        } else if (!supplier.supplierSelected) {
            this.setValidators();
        } else {
            this.invoiceeCtrl.patchValue(supplier.supplierSelected);
            this.supplierDescription = this.filteredCounterPartyList.find((counterparty) => counterparty.counterpartyCode === supplier.supplierSelected);
            if (this.supplierDescription) {
                this.invoiceeDescriptionCtrl.patchValue(this.supplierDescription.description);
            }

            if (this.masterdata.counterparties) {
                const invoicee = this.masterdata.counterparties.find(
                    (counterParty) => counterParty.counterpartyCode === supplier.supplierSelected);
                if (invoicee) {
                    this.userSupplier.emit(invoicee.counterpartyCode);
                }
            }
        }
    }

    onSelectionChange(value: any) {
        const selectedCounterparty = this.masterdata.counterparties.find(
            (counterparty) => counterparty.counterpartyCode === value,
        );
        if (selectedCounterparty) {
            const cpDescription = selectedCounterparty.description;
            this.invoiceeDescriptionCtrl.patchValue(cpDescription);
        }
        this.userSupplier.emit(value);

    }

    setValidators() {
        this.invoiceeCtrl.setValidators(
            Validators.compose([
                inDropdownListValidator(
                    this.masterdata.counterparties,
                    nameof<Counterparty>('counterpartyCode'),
                ),
            ]));
        this.invoiceeCtrl.setValidators(Validators.compose([Validators.required]));
        this.invoiceeCtrl.updateValueAndValidity();
    }
    clearValidators() {
        this.invoiceeCtrl.patchValue('');
        this.invoiceeDescriptionCtrl.patchValue('');
        this.invoiceeCtrl.clearValidators();
        this.invoiceeCtrl.updateValueAndValidity();
    }

    populateEntity(entity: InvoiceRecord): InvoiceRecord {
        const invoiceeOption = entity;
        invoiceeOption.counterpartyCode = this.invoiceeCtrl.value;
        return invoiceeOption;
    }

}
