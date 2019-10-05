import { Component, OnInit } from '@angular/core';
import { AtlasFormControl } from '../../../../../../shared/entities/atlas-form-control'
import { BaseFormComponent } from '../../../../../../shared/components/base-form-component/base-form-component.component';
import { FormConfigurationProviderService } from '../../../../../../shared/services/form-configuration-provider.service';
import { FormBuilder, Validators } from '@angular/forms';
import { UtilService, nameof } from '../../../../../../shared/services/util.service';
import { MasterdataService } from '../../../../../../shared/services/http-services/masterdata.service';
import { MasterData } from '../../../../../../shared/entities/masterdata.entity';
import { MasterDataProps } from '../../../../../../shared/entities/masterdata-props.entity';
import { ContractTerm } from '../../../../../../shared/entities/contract-term.entity';
import { inDropdownListValidator } from '../../../../../../shared/directives/autocomplete-dropdown.directive';
import { Counterparty } from '../../../../../../shared/entities/counterparty.entity';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'atlas-customer-default-card',
    templateUrl: './customer-default-card.component.html',
    styleUrls: ['./customer-default-card.component.scss']
})
export class CustomerDefaultCardComponent extends BaseFormComponent implements OnInit {
    contractTermsCtrl = new AtlasFormControl('contractTermsCtrl');
    introductoryBrockerCtrl = new AtlasFormControl('introductoryBrockerCtrl');
    filteredContractTerms: ContractTerm[];
    contractTermControl: ContractTerm;

    masterdata: MasterData;
    masterdataList: string[] = [
        MasterDataProps.ContractTerms
    ];

    constructor(protected formBuilder: FormBuilder,
        protected formConfigurationProvider: FormConfigurationProviderService,
        protected utilService: UtilService,
        private route: ActivatedRoute,
        protected masterdataService: MasterdataService, ) {
        super(formConfigurationProvider);
    }


    ngOnInit() {
        this.masterdataService
            .getMasterData(this.masterdataList)
            .subscribe((data) => {
                this.masterdata = data;

                this.filteredContractTerms = this.masterdata.contractTerms;
                this.contractTermsCtrl.valueChanges.subscribe((input) => {
                    this.filteredContractTerms = this.utilService.filterListforAutocomplete(
                        input,
                        this.masterdata.contractTerms,
                        ['contractTermCode', 'description'],
                    );
                });
                this.setValidators();
            });
    }

    getFormGroup() {
        this.formGroup = this.formBuilder.group({
            contractTermsCtrl: this.contractTermsCtrl,
            introductoryBrockerCtrl: this.introductoryBrockerCtrl,
        });

        return super.getFormGroup();
    }

    setValidators() {
        this.contractTermsCtrl.setValidators(
            Validators.compose([
                Validators.required,
                inDropdownListValidator(
                    this.masterdata.contractTerms,
                    nameof<ContractTerm>('contractTermCode'),
                ),
            ]),
        );

        this.introductoryBrockerCtrl.setValidators(
            Validators.compose([Validators.maxLength(160)]),
        );
    }

    populateEntity(model: Counterparty) {
        model.contractTermId = (this.contractTermsCtrl.value) ? this.contractTermsCtrl.value.contractTermId : null;
        model.introductoryBrocker = this.introductoryBrockerCtrl.value;
    }

    populateContractTermValue(model: Counterparty) {
        this.masterdata = this.route.snapshot.data.masterdata;
        this.filteredContractTerms = this.masterdata.contractTerms;

        if (model.contractTermId) {
            this.contractTermControl = this.filteredContractTerms.find((contractTerm) => contractTerm.contractTermId === model.contractTermId);
            this.contractTermsCtrl.patchValue(this.contractTermControl);
        }
        if (model.introductoryBrocker) {
            this.introductoryBrockerCtrl.patchValue(model.introductoryBrocker);
        }

    }
}
