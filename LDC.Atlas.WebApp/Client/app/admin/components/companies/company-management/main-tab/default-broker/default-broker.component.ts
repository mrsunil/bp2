import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BaseFormComponent } from '../../../../../../shared/components/base-form-component/base-form-component.component';
import { inDropdownListValidator } from '../../../../../../shared/directives/autocomplete-dropdown.directive';
import { AtlasFormControl } from '../../../../../../shared/entities/atlas-form-control';
import { Counterparty } from '../../../../../../shared/entities/counterparty.entity';
import { MasterData } from '../../../../../../shared/entities/masterdata.entity';
import { CompanyConfigurationRecord } from '../../../../../../shared/services/configuration/dtos/company-configuration-record';
import { FormConfigurationProviderService } from '../../../../../../shared/services/form-configuration-provider.service';
import { BankBrokerContextualDataLoader } from '../../../../../../shared/services/trading/bank-broker-contextual-data-loader';
import { nameof, UtilService } from '../../../../../../shared/services/util.service';

@Component({
    selector: 'atlas-default-broker',
    templateUrl: './default-broker.component.html',
    styleUrls: ['./default-broker.component.scss'],
    providers: [BankBrokerContextualDataLoader],
})
export class DefaultBrokerComponent extends BaseFormComponent implements OnInit {

    defaultBrokerCtrl = new AtlasFormControl('DefaultBroker');
    defaultBrokerDescriptionCtrl = new AtlasFormControl('DefaultBrokerDescription');

    formGroup: FormGroup;
    masterdata: MasterData;
    filteredCounterparties: Counterparty[];
    counterparties: Counterparty[];
    bankBrokerId: number;
    brokerDescription: string;

    brokerErrorMap: Map<string, string> = new Map()

        .set('inDropdownList', 'Invalid entry. Bank not in the list or not authorized.');

    brokerDescriptionErrorMap: Map<string, string> = new Map()
        .set('maxLength', 'Maximum length should be 200 characters');

    constructor(protected route: ActivatedRoute,
        protected utilService: UtilService,
        protected formBuilder: FormBuilder,
        public bankBrokerContextualDataLoader: BankBrokerContextualDataLoader,
        protected formConfigurationProvider: FormConfigurationProviderService) {
        super(formConfigurationProvider);
    }

    ngOnInit() {
        this.masterdata = this.route.snapshot.data.masterdata;
        this.defaultBrokerDescriptionCtrl.disable();
        this.bankBrokerContextualDataLoader.getData().subscribe((data) => {
            if (data) {
                this.filteredCounterparties = data;
                this.counterparties = data;
                this.defaultBrokerCtrl.valueChanges.subscribe((input) => {
                    this.filteredCounterparties = this.utilService.filterListforAutocomplete(
                        input,
                        this.counterparties,
                        ['counterpartyCode', 'description'],
                    );
                });
                this.bankValidator();
            }
        });
    }

    bankValidator() {
        this.defaultBrokerCtrl.setValidators(
            Validators.compose([
                inDropdownListValidator(
                    this.filteredCounterparties,
                    nameof<Counterparty>('counterpartyCode'),
                ),
            ]),
        );
    }

    onCounterpartyCodeSelected(value: Counterparty) {
        if (value) {
            const selectedCounterparty = this.masterdata.counterparties.find(
                (item) => item.counterpartyCode === value.counterpartyCode,
            );
            if (selectedCounterparty) {
                this.defaultBrokerDescriptionCtrl.patchValue(selectedCounterparty.description);
                this.bankBrokerId = selectedCounterparty.counterpartyID;

            }
        }
    }

    onCounterpartyValueChanged(value) {
        this.defaultBrokerDescriptionCtrl.patchValue(value.description);
    }

    initForm(entity: CompanyConfigurationRecord, isEdit): CompanyConfigurationRecord {
        const companyConfiguration = entity;
        if (companyConfiguration && companyConfiguration.companySetup) {
            if (companyConfiguration.companySetup.defaultBrokerId) {
                const counterpartyValue: Counterparty = this.getCounterparty(companyConfiguration.companySetup.defaultBrokerId);
                if (counterpartyValue) {
                    this.defaultBrokerCtrl.setValue(counterpartyValue.counterpartyCode);
                    this.defaultBrokerDescriptionCtrl.patchValue(counterpartyValue.description);
                }
            }
        }
        if (!isEdit) {
            this.formGroup.disable();
        } else {
            this.formGroup.enable();
        }
        return entity;
    }

    getCounterparty(counterpartyId: number): Counterparty {
        const counterparty = this.filteredCounterparties.find(
            (e) => e.counterpartyID === counterpartyId);
        if (counterparty) {
            return counterparty;
        }
    }

    getFormGroup() {
        this.formGroup = this.formBuilder.group({
            defaultBrokerCtrl: this.defaultBrokerCtrl,
            defaultBrokerDescriptionCtrl: this.defaultBrokerDescriptionCtrl,
        });

        return super.getFormGroup();
    }

}
