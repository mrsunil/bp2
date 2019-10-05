import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CompanyManagerService } from '../../../../../core/services/company-manager.service';
import { BaseFormComponent } from '../../../../../shared/components/base-form-component/base-form-component.component';
import { inDropdownListValidator } from '../../../../../shared/directives/autocomplete-dropdown.directive';
import { AtlasFormControl } from '../../../../../shared/entities/atlas-form-control';
import { Company } from '../../../../../shared/entities/company.entity';
import { Counterparty } from '../../../../../shared/entities/counterparty.entity';
import { FxDealDetail } from '../../../../../shared/entities/fxdeal-detail.entity';
import { MasterData } from '../../../../../shared/entities/masterdata.entity';
import { FormConfigurationProviderService } from '../../../../../shared/services/form-configuration-provider.service';
import { BankBrokerContextualDataLoader } from '../../../../../shared/services/trading/bank-broker-contextual-data-loader';
import { nameof, UtilService } from '../../../../../shared/services/util.service';

@Component({
    selector: 'atlas-bank-form',
    templateUrl: './bank-form.component.html',
    styleUrls: ['./bank-form.component.scss'],
    providers: [BankBrokerContextualDataLoader],
})

export class BankFormComponent extends BaseFormComponent implements OnInit {
    financeFxCtrl = new AtlasFormControl('FinanceFx');
    financeCtrl = new AtlasFormControl('Finance');
    bankReferenceCtrl = new AtlasFormControl('BankReference');

    counterPartyId: number;
    filteredCounterparties: Counterparty[];
    counterparties: Counterparty[];
    masterdata: MasterData;
    company: Company;
    financetErrorMap: Map<string, string> = new Map()
        .set('required', 'Required *')
        .set('inDropdownList', 'Invalid entry. Bank not in the list or not authorized.');

    financeFxErrorMap: Map<string, string> = new Map()
        .set('required', 'Required *');

    constructor(
        protected route: ActivatedRoute,
        protected companyManagerService: CompanyManagerService,
        protected utilService: UtilService,
        protected formBuilder: FormBuilder,
        public bankBrokerContextualDataLoader: BankBrokerContextualDataLoader,
        protected formConfigurationProvider: FormConfigurationProviderService) {
        super(formConfigurationProvider);
    }

    ngOnInit() {
        this.masterdata = this.route.snapshot.data.masterdata;
        this.financeFxCtrl.disable();
        this.bankBrokerContextualDataLoader.getData().subscribe((data) => {
            if (data) {
                this.filteredCounterparties = data;
                this.counterparties = data;
                this.financeCtrl.valueChanges.subscribe((input) => {
                    this.filteredCounterparties = this.utilService.filterListforAutocomplete(
                        input,
                        this.counterparties,
                        ['counterpartyCode', 'description'],
                    );
                });
                this.tradeValidator();
            }
        });

        this.company = this.companyManagerService.getCurrentCompany();

        if (this.company) {
        const counterparty = this.getBroker(this.company.defaultBrokerId);
        if (counterparty) {
            this.financeCtrl.patchValue(counterparty);
            this.financeFxCtrl.patchValue(counterparty.description);
        } else {
            this.financeCtrl.patchValue('');
            this.financeFxCtrl.patchValue('');
        }
    }

        this.setValidators();
    }

    tradeValidator() {
        this.financeCtrl.setValidators(
            Validators.compose([Validators.required,
            inDropdownListValidator(
                this.filteredCounterparties,
                nameof<Counterparty>('counterpartyCode'),
            ),
            ]),
        );
    }

    setValidators() {
        this.financeFxCtrl.setValidators([Validators.required, Validators.maxLength(200)]);
        this.bankReferenceCtrl.setValidators([Validators.maxLength(15)]);
    }

    getFormGroup() {
        this.formGroup = this.formBuilder.group({
            financeFxCtrl: this.financeFxCtrl,
            financeCtrl: this.financeCtrl,
            bankReferenceCtrl: this.bankReferenceCtrl,
        });
        return super.getFormGroup();
    }

    initForm(fxDealDetail: FxDealDetail, isEdit: boolean) {
        if (fxDealDetail) {
            const counterparty = this.getBroker(fxDealDetail.brokerId);
            if (counterparty) {
                this.financeCtrl.patchValue(counterparty.counterpartyCode);
                this.financeFxCtrl.patchValue(counterparty.description);
            } else {
                this.financeCtrl.patchValue('');
                this.financeFxCtrl.patchValue('');
            }
            this.bankReferenceCtrl.patchValue(fxDealDetail.bankReference);
            if (!isEdit) {
                this.disableFields();
            }
        }
    }

    disableFields() {
        this.financeCtrl.disable();
        this.financeFxCtrl.disable();
        this.bankReferenceCtrl.disable();
    }

    populateEntity(model: FxDealDetail) {
        if (!model.isEditMode) {
            model.brokerId = this.getBrokerId(this.financeCtrl.value.counterpartyCode);
        } else {
            if (this.financeCtrl.value.counterpartyCode) {
                model.brokerId = this.getBrokerId(this.financeCtrl.value.counterpartyCode);
            } else {
                model.brokerId = this.getBrokerId(this.financeCtrl.value);
            }
        }
        model.bankReference = this.bankReferenceCtrl.value;
    }

    counterpartyCodeSelected(value: Counterparty) {
        if (value) {
            const selectedCounterparty = this.masterdata.counterparties.find(
                (item) => item.counterpartyCode === value.counterpartyCode,
            );
            if (selectedCounterparty) {
                this.financeFxCtrl.patchValue(selectedCounterparty.description);
            }
        }
    }

    onValueChanged(value) {
        this.financeFxCtrl.patchValue(value.description);
    }

    getBrokerId(code: string): number {
        const counterparty = this.masterdata.counterparties.find((cp) => cp.counterpartyCode === code);
        if (counterparty) {
            return counterparty.counterpartyID;
        }
        return null;
    }

    getBroker(id: number): Counterparty {
        const counterparty = this.masterdata.counterparties.find((cp) => cp.counterpartyID === id);
        return counterparty;
    }
}
