import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseFormComponent } from '../../../../../../shared/components/base-form-component/base-form-component.component';
import { inDropdownListValidator } from '../../../../../../shared/directives/autocomplete-dropdown.directive';
import { AtlasFormControl } from '../../../../../../shared/entities/atlas-form-control';
import { CompanyConfiguration } from '../../../../../../shared/entities/company-configuration.entity';
import { Currency } from '../../../../../../shared/entities/currency.entity';
import { EnumEntity } from '../../../../../../shared/entities/enum-entity.entity';
import { MasterDataProps } from '../../../../../../shared/entities/masterdata-props.entity';
import { MasterData } from '../../../../../../shared/entities/masterdata.entity';
import { CompanyConfigurationRecord } from '../../../../../../shared/services/configuration/dtos/company-configuration-record';
import { FormConfigurationProviderService } from '../../../../../../shared/services/form-configuration-provider.service';
import { ConfigurationService } from '../../../../../../shared/services/http-services/configuration.service';
import { MasterdataService } from '../../../../../../shared/services/http-services/masterdata.service';
import { nameof, UtilService } from '../../../../../../shared/services/util.service';

@Component({
    selector: 'atlas-identity',
    templateUrl: './identity.component.html',
    styleUrls: ['./identity.component.scss'],
})
export class IdentityComponent extends BaseFormComponent implements OnInit {
    legalEntityCtrl = new AtlasFormControl('LegalEntity');
    legalEntityNameCtrl = new AtlasFormControl('LegalEntityName');
    functionalCcyCtrl = new AtlasFormControl('FunctionalCcy');
    statutoryCcyCtrl = new AtlasFormControl('StatutoryCcy');
    companyTypeCtrl = new AtlasFormControl('CompanyType');
    companyPlatformCtrl = new AtlasFormControl('CompanyPlatform');
    filteredFunctionalCurrencies: Currency[];
    filteredStatutoryCurrencies: Currency[];
    filteredCompanyTypeList: EnumEntity[];
    filteredCompanyPlatformList: EnumEntity[];
    masterData: MasterData;
    masterdataList: string[] = [
        MasterDataProps.CompanyPlatforms,
        MasterDataProps.CompanyTypes,
    ];
    company: string;
    model: CompanyConfigurationRecord;
    currencyErrorMap: Map<string, string> = new Map()
        .set('required', 'Required *')
        .set('inDropdownList', 'Invalid entry. Value not in the list.');
    companyErrorMap: Map<string, string> = new Map()
        .set('required', 'Required *')
        .set('inDropdownList', 'Invalid entry. Value not in the list.');
    currentCompany: string;
    companyId: string;
    isCopyCompany: boolean;
    isTransactionExists: boolean = false;

    constructor(protected formConfigurationProvider: FormConfigurationProviderService,
        protected utilService: UtilService,
        private route: ActivatedRoute,
        protected configurationService: ConfigurationService,
        protected masterdataService: MasterdataService,
        private router: Router,
        protected formBuilder: FormBuilder) {
        super(formConfigurationProvider);
    }

    ngOnInit() {
        this.currentCompany = decodeURIComponent(this.route.snapshot.paramMap.get('company'));
        this.companyId = this.route.snapshot.paramMap.get('companyId');
        this.isCopyCompany = (this.route.snapshot.data.isCopy) ? true : false;
        this.masterData = this.route.snapshot.data.masterdata;
        this.masterdataService
            .getMasterData(this.masterdataList)
            .subscribe((data) => {
                this.filteredCompanyTypeList = data.companyTypes;
                this.companyTypeCtrl.valueChanges.subscribe((input) => {
                    this.filteredCompanyTypeList = this.utilService.filterListforAutocomplete(
                        input,
                        data.companyTypes,
                        ['enumEntityValue'],
                    );
                });

                this.filteredCompanyPlatformList = data.companyTypes;
                this.companyPlatformCtrl.valueChanges.subscribe((input) => {
                    this.filteredCompanyPlatformList = this.utilService.filterListforAutocomplete(
                        input,
                        data.companyPlatforms,
                        ['enumEntityValue'],
                    );
                });

                this.setValidators();
            });
        this.filterFunctionalCurrencies();
        this.filterStatutoryCurrencies();
        if (!this.isCopyCompany) {
            if (this.companyId) {
                this.checkTransactionDataExistsForCompany(this.companyId);
            }
        }
        this.setValidators();
    }

    checkTransactionDataExistsForCompany(companyId: string) {
        this.configurationService.checkTransationExistsByCompanyId(companyId).subscribe((data: boolean) => {
            this.isTransactionExists = data;
        });
    }

    getFormGroup() {
        this.formGroup = this.formBuilder.group({
            legalEntityCtrl: this.legalEntityCtrl,
            legalEntityNameCtrl: this.legalEntityNameCtrl,
            functionalCcyCtrl: this.functionalCcyCtrl,
            statutoryCcyCtrl: this.statutoryCcyCtrl,
            companyTypeCtrl: this.companyTypeCtrl,
            companyPlatformCtrl: this.companyPlatformCtrl,
        });
        return super.getFormGroup();
    }

    setLegalEntityValidators() {
        this.legalEntityCtrl.setValidators(Validators.maxLength(4));
        this.legalEntityNameCtrl.setValidators(Validators.maxLength(50));
    }

    setValidators() {
        this.functionalCcyCtrl.setValidators(
            Validators.compose([
                inDropdownListValidator(
                    this.masterData.currencies,
                    nameof<Currency>('currencyCode'),
                ), Validators.required,
            ]),
        );

        this.statutoryCcyCtrl.setValidators(
            Validators.compose([
                inDropdownListValidator(
                    this.masterData.currencies,
                    nameof<Currency>('currencyCode'),
                ), Validators.required,
            ]),
        );
        this.companyTypeCtrl.setValidators(Validators.required);
        this.companyPlatformCtrl.setValidators(Validators.required);
        this.legalEntityCtrl.setValidators(Validators.compose([Validators.maxLength(4)]));
        this.legalEntityNameCtrl.setValidators(Validators.compose([Validators.maxLength(15)]));
    }

    filterFunctionalCurrencies() {
        this.functionalCcyCtrl.valueChanges.subscribe((input) => {
            this.filteredFunctionalCurrencies = this.utilService.filterListforAutocomplete(
                input,
                this.masterData.currencies,
                ['currencyCode', 'description'],
            );
            if (this.functionalCcyCtrl.valid) {
                this.functionalCurrencyCodeSelected(this.functionalCcyCtrl.value);
            }
        });
    }

    filterStatutoryCurrencies() {
        this.statutoryCcyCtrl.valueChanges.subscribe((input) => {
            this.filteredStatutoryCurrencies = this.utilService.filterListforAutocomplete(
                input,
                this.masterData.currencies,
                ['currencyCode', 'description'],
            );
            if (this.statutoryCcyCtrl.valid) {
                this.statutoryCurrencyCodeSelected(this.statutoryCcyCtrl.value);
            }
        });
    }

    functionalCurrencyCodeSelected(value: Currency) {
        const selectedCurrency = this.masterData.currencies.find(
            (currency) => currency.currencyCode === value.currencyCode,
        );
        if (selectedCurrency) {
            this.functionalCcyCtrl.patchValue(selectedCurrency.currencyCode);
        }
    }

    statutoryCurrencyCodeSelected(value: Currency) {
        const selectedCurrency = this.masterData.currencies.find(
            (currency) => currency.currencyCode === value.currencyCode,
        );
        if (selectedCurrency) {
            this.statutoryCcyCtrl.patchValue(selectedCurrency.currencyCode);
        }
    }

    initForm(companyConfigurationRecord, isEdit) {
        this.model = companyConfigurationRecord;

        this.legalEntityCtrl.setValue(this.model.companySetup.legalEntity);
        this.legalEntityNameCtrl.setValue(this.model.companySetup.legalEntityCode);
        this.functionalCcyCtrl.setValue(this.model.companySetup.functionalCurrencyCode);
        this.statutoryCcyCtrl.setValue(this.model.companySetup.statutoryCurrencyCode);
        this.companyTypeCtrl.setValue(this.model.companySetup.companyType);
        this.companyPlatformCtrl.setValue(this.model.companySetup.companyPlatform);

        this.setLegalEntityValidators();

        if (!isEdit) {
            this.formGroup.disable();
        } else {
            this.formGroup.enable();
        }
        if (this.isTransactionExists) {
            this.functionalCcyCtrl.disable();
            this.statutoryCcyCtrl.disable();
        }
        return companyConfigurationRecord;
    }

    populateEntity(entity: CompanyConfiguration): CompanyConfiguration {
        const companyConfiguration = entity;

        companyConfiguration.companySetup.legalEntityCode = this.legalEntityNameCtrl.value;
        companyConfiguration.companySetup.legalEntity = this.legalEntityCtrl.value;

        companyConfiguration.companySetup.functionalCurrencyCode = this.functionalCcyCtrl.value;
        companyConfiguration.companySetup.statutoryCurrencyCode = this.statutoryCcyCtrl.value;
        companyConfiguration.companySetup.companyTypeId = this.companyTypeCtrl.value.enumEntityValue
            ? this.getCompanyTypeIdFromCode(this.companyTypeCtrl.value.enumEntityValue)
            : this.getCompanyTypeIdFromCode(this.companyTypeCtrl.value);
        companyConfiguration.companySetup.companyPlatformId = (this.companyPlatformCtrl.value.enumEntityValue)
            ? this.getCompanyPlatformFromCode(this.companyPlatformCtrl.value.enumEntityValue)
            : this.getCompanyPlatformFromCode(this.companyPlatformCtrl.value);
        companyConfiguration.companySetup.legalEntity = this.legalEntityCtrl.value;
        companyConfiguration.companySetup.legalEntityCode = this.legalEntityNameCtrl.value;
        return companyConfiguration;
    }

    getCompanyTypeIdFromCode(companyTypeCode: string): number {
        const selectedCompanyType = this.masterData.companyTypes.find(
            (companyType) => companyType.enumEntityValue === companyTypeCode,
        );
        if (selectedCompanyType) {
            return selectedCompanyType.enumEntityId;
        }
    }

    getCompanyPlatformFromCode(companyPlatformCode: string): number {
        const selectedCompanyPlatform = this.masterData.companyPlatforms.find(
            (companyPlatform) => companyPlatform.enumEntityValue === companyPlatformCode,
        );
        if (selectedCompanyPlatform) {
            return selectedCompanyPlatform.enumEntityId;
        }
    }
}
