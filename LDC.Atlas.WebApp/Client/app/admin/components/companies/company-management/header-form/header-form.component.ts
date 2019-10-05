import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { CompanyManagerService } from '../../../../../core/services/company-manager.service';
import { BaseFormComponent } from '../../../../../shared/components/base-form-component/base-form-component.component';
import { AtlasFormControl } from '../../../../../shared/entities/atlas-form-control';
import { CompanyConfiguration } from '../../../../../shared/entities/company-configuration.entity';
import { Counterparty } from '../../../../../shared/entities/counterparty.entity';
import { MasterData } from '../../../../../shared/entities/masterdata.entity';
import { CompanyConfigurationRecord } from '../../../../../shared/services/configuration/dtos/company-configuration-record';
import { FormConfigurationProviderService } from '../../../../../shared/services/form-configuration-provider.service';
import { ConfigurationService } from '../../../../../shared/services/http-services/configuration.service';
import { SnackbarService } from '../../../../../shared/services/snackbar.service';
import { UtilService } from '../../../../../shared/services/util.service';

@Component({
    selector: 'atlas-header-form',
    templateUrl: './header-form.component.html',
    styleUrls: ['./header-form.component.scss'],
})
export class HeaderFormComponent extends BaseFormComponent implements OnInit {

    companyFriendlyCodeCtrl = new AtlasFormControl('CompanyFriendlyCode');
    companyNameCtrl = new AtlasFormControl('CompanyName');
    companyClientCodeCtrl = new AtlasFormControl('CompanyClientCode');
    companyCodeCtrl = new AtlasFormControl('CompanyCode');
    companyIdCtrl = new AtlasFormControl('CompanyId');
    isUnique: boolean;
    counterpartyErrorMap: Map<string, string> = new Map()
        .set('required', 'Required *')
        .set('inDropdownList', 'Invalid entry. Value not in the list.');
    companyCodeErrorMap: Map<string, string> = new Map()
        .set('required', 'Required *')
        .set('maxLength', 'Company Id should be of 2 characters maximum')
        .set('notUnique', 'CompanyId is already used');
    companyFriendlyCodeErrorMap: Map<string, string> = new Map()
        .set('required', 'Required *')
        .set('maxLength', 'Company Friendly Code should be of 4 characters maximum');
    companyNameErrorMap: Map<string, string> = new Map()
        .set('required', 'Required *')
        .set('maxLength', 'Company Name should be of 50 characters maximum');
    companyErrorMap: Map<string, string> = new Map()
        .set('required', 'Required *');
    filteredCounterparties: Counterparty[];
    masterData: MasterData;
    model: CompanyConfigurationRecord;
    currentCompany: string;
    companyId: string;
    isCopyCompany: boolean;
    isEdit: boolean;

    constructor(
        protected formConfigurationProvider: FormConfigurationProviderService,
        private companyManager: CompanyManagerService,
        protected formBuilder: FormBuilder,
        protected configurationService: ConfigurationService,
        protected utilService: UtilService,
        private route: ActivatedRoute,
        protected snackbarService: SnackbarService,
        public dialog: MatDialog,
        private companyManagerService: CompanyManagerService,
    ) {
        super(formConfigurationProvider);
    }

    ngOnInit() {
        this.currentCompany = decodeURIComponent(this.route.snapshot.paramMap.get('company'));
        this.companyId = this.route.snapshot.paramMap.get('companyId');
        this.isCopyCompany = (this.route.snapshot.data.isCopy) ? true : false;
        this.isEdit = (this.route.snapshot.data.isEdit) ? true : false;
        this.masterData = this.route.snapshot.data.masterdata;
        this.filterCounterparties();
        this.setValidators();
    }

    initForm(entity: CompanyConfigurationRecord, isEdit): CompanyConfigurationRecord {
        const companyConfiguration = entity;
        this.model = companyConfiguration;

        if (companyConfiguration) {
            this.companyIdCtrl.setValue(companyConfiguration.companySetup.id);
            this.companyFriendlyCodeCtrl.setValue(companyConfiguration.companySetup.companyFriendlyCode);
            this.companyCodeCtrl.setValue(companyConfiguration.companySetup.companyId);
            this.companyNameCtrl.setValue(companyConfiguration.companySetup.description);
            if (companyConfiguration.companySetup.counterpartyId) {
                this.companyClientCodeCtrl.setValue(this.getCounterpartyCodeFromId(companyConfiguration.companySetup.counterpartyId));
            }
        }
        if (!isEdit) {
            this.formGroup.disable();
        } else {
            this.formGroup.enable();
        }
        this.companyCodeCtrl.disable();

        return entity;
    }

    getCounterpartyId(counterpartyCode: string): number {
        if (counterpartyCode) {
            const counterpartyId = this.masterData.counterparties.find(
                (e) => e.counterpartyCode === counterpartyCode).counterpartyID;
            return counterpartyId;
        }
    }

    getCounterpartyCodeFromId(counterpartyId: number): string {
        const CounterpartyCode = this.masterData.counterparties.filter(
            (e) => e.counterpartyID === counterpartyId)[0].counterpartyCode;
        return CounterpartyCode;
    }

    getFormGroup() {
        this.formGroup = this.formBuilder.group({
            companyCodeCtrl: this.companyCodeCtrl,
            companyFriendlyCodeCtrl: this.companyFriendlyCodeCtrl,
            companyNameCtrl: this.companyNameCtrl,
            companyClientCodeCtrl: this.companyClientCodeCtrl,
        });
        return super.getFormGroup();
    }

    populateEntity(entity: CompanyConfiguration): CompanyConfiguration {
        const companyConfiguration = entity;
        companyConfiguration.companyId = this.companyCodeCtrl.value;
        if (!this.isCopyCompany && this.companyId) {
            companyConfiguration.companySetup.id = this.companyIdCtrl.value;
        }
        companyConfiguration.companySetup.companyId = this.companyCodeCtrl.value;
        companyConfiguration.companySetup.companyFriendlyCode = this.companyFriendlyCodeCtrl.value;
        companyConfiguration.companySetup.companyName = this.companyNameCtrl.value;
        companyConfiguration.companySetup.counterpartyId = this.getCounterpartyId(this.companyClientCodeCtrl.value);
        return companyConfiguration;
    }

    setValidators() {
        this.companyCodeCtrl.setValidators(Validators.compose([Validators.required, Validators.maxLength(2)]));
        this.companyFriendlyCodeCtrl.setValidators(Validators.compose([Validators.required, Validators.maxLength(4)]));
        this.companyNameCtrl.setValidators(Validators.compose([Validators.required, Validators.maxLength(50)]));
        this.companyCodeCtrl.valueChanges.subscribe((val) => {
            if (this.companyId) {
                if (this.isCopyCompany) {
                    if (val !== this.companyId) {
                        this.checkUnicityOfCompanyName(val);
                    } else {
                        this.companyCodeCtrl.setErrors({ notUnique: true });
                    }
                }
            } else {
                this.checkUnicityOfCompanyName(val);
            }
        });
    }

    checkUnicityOfCompanyName(val: string): void {
        if (val) {
            this.companyManagerService.checkCompanyNameExists(val)
                .subscribe((isNotUnique: boolean) => {
                    this.isUnique = !isNotUnique;
                    if (!this.isUnique) {
                        this.companyCodeCtrl.setErrors({ notUnique: true });
                        this.snackbarService.throwErrorSnackBar(
                            'The company already exsists.',
                        );
                    }
                });
        } else {
            this.isUnique = true;
        }
    }

    filterCounterparties() {
        this.filteredCounterparties = this.masterData.counterparties;
        this.companyClientCodeCtrl.valueChanges.subscribe((input) => {
            this.filteredCounterparties = this.utilService.filterListforAutocomplete(
                input,
                this.masterData.counterparties,
                ['counterpartyCode', 'description'],
            );
            if (this.companyClientCodeCtrl.valid) {
                this.counterpartyCodeSelected(this.companyClientCodeCtrl.value);
            }
        });
    }

    counterpartyCodeSelected(value: Counterparty) {
        if (value) {
            const selectedCounterparty = this.masterData.counterparties.find(
                (item) => item.counterpartyCode === value.counterpartyCode,
            );
            if (selectedCounterparty) {
                this.companyClientCodeCtrl.patchValue(selectedCounterparty.counterpartyCode);
            }
        }
    }

}
