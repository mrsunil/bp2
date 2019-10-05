import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSlideToggleChange } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { BaseFormComponent } from '../../../../../../shared/components/base-form-component/base-form-component.component';
import { inDropdownListValidator } from '../../../../../../shared/directives/autocomplete-dropdown.directive';
import { AtlasFormControl } from '../../../../../../shared/entities/atlas-form-control';
import { Branch } from '../../../../../../shared/entities/branch.entity';
import { CompanyConfiguration } from '../../../../../../shared/entities/company-configuration.entity';
import { CompanySetup } from '../../../../../../shared/entities/company-setup.entity';
import { EnumEntity } from '../../../../../../shared/entities/enum-entity.entity';
import { IntercoNoIntercoEmailSetup } from '../../../../../../shared/entities/interco-no-interco-email-setup.entity';
import { MasterData } from '../../../../../../shared/entities/masterdata.entity';
import { PriceUnit } from '../../../../../../shared/entities/price-unit.entity';
import { Province } from '../../../../../../shared/entities/province.entity';
import { TradeConfiguration } from '../../../../../../shared/entities/trade-configuration-entity';
import { WeightUnit } from '../../../../../../shared/entities/weight-unit.entity';
import { CompanyConfigurationRecord } from '../../../../../../shared/services/configuration/dtos/company-configuration-record';
import { IntercoNoIntercoEmails } from '../../../../../../shared/services/configuration/dtos/interco-no-interco-emails';
import { IntercoNoIntercoUsers } from '../../../../../../shared/services/configuration/dtos/interco-no-interco-users';
import { FormConfigurationProviderService } from '../../../../../../shared/services/form-configuration-provider.service';
import { ConfigurationService } from '../../../../../../shared/services/http-services/configuration.service';
import { MasterdataService } from '../../../../../../shared/services/http-services/masterdata.service';
import { SnackbarService } from '../../../../../../shared/services/snackbar.service';
import { nameof, UtilService } from '../../../../../../shared/services/util.service';

@Component({
    selector: 'atlas-physicals-main',
    templateUrl: './physicals-main.component.html',
    styleUrls: ['./physicals-main.component.scss'],
})
export class PhysicalsMainComponent extends BaseFormComponent implements OnInit {
    @Output() readonly discardChanges = new EventEmitter<any>();
    @Output() readonly savePhysicals = new EventEmitter();
    @Output() readonly isSideNavOpened = new EventEmitter<boolean>();
    @Output() readonly provinceConfigurationStatus = new EventEmitter<boolean>();
    @Output() readonly branchConfigurationStatus = new EventEmitter<boolean>();
    cropYearCtrl = new AtlasFormControl('CropYear');
    intercoEmailCtrl = new AtlasFormControl('IntercoEmail');
    noIntercoEmailCtrl = new AtlasFormControl('NoIntercoEmail');
    businessSectorTradingCtrl = new AtlasFormControl('BusinessSectorForTrading');
    businessSectorPostingCtrl = new AtlasFormControl('BusinessSectorForPosting');
    provinceConfigurationCtrl = new AtlasFormControl('ProvinceConfiguration');
    branchConfigurationCtrl = new AtlasFormControl('BranchConfiguration');
    provinceActivationCtrl = new AtlasFormControl('ProvinceActivation');
    priceUnitCtrl = new AtlasFormControl('PriceUnit');
    model: CompanyConfigurationRecord;
    masterData: MasterData;
    physicalsTabMainPhysicalsFormGroup: FormGroup;
    company: string;
    cropYearFormats: EnumEntity[] = [];
    isPanelExpanded: boolean = true;
    weightUnits: WeightUnit[];
    interCoChipStringList: string[] = [];
    noInterCoChipStringList: string[] = [];
    interCoEmailChipStringList: string[] = [];
    noInterCoEmailChipStringList: string[] = [];
    isInterCo: boolean = false;
    isEdit: boolean = false;
    companySetup: CompanySetup;
    companyConfiguration: CompanyConfiguration;
    intercoNoIntercoUsers: IntercoNoIntercoUsers[] = [];
    filteredCropYearFormats: EnumEntity[] = [];
    filteredIntercoUserList: IntercoNoIntercoUsers[] = [];
    filteredNoIntercoUserList: IntercoNoIntercoUsers[] = [];
    filteredPriceUnits: PriceUnit[] = [];
    companyId: string;
    currentCompany: string;
    isProvinceActivationToggleChecked: boolean = false;
    filteredProvince: Province[];
    filteredBranch: Branch[];
    companyCodeForIL: string = 'il';

    constructor(
        protected formConfigurationProvider: FormConfigurationProviderService,
        protected formBuilder: FormBuilder,
        protected route: ActivatedRoute,
        protected utilService: UtilService,
        protected snackbarService: SnackbarService,
        protected masterdataService: MasterdataService,
        protected configurationService: ConfigurationService,
    ) {
        super(formConfigurationProvider);
    }

    ngOnInit() {
        this.currentCompany = decodeURIComponent(this.route.snapshot.paramMap.get('company'));
        this.companyId = this.route.snapshot.paramMap.get('companyId');
        this.company = (this.companyId) ? this.companyId : this.currentCompany;
        this.masterData = this.route.snapshot.data.masterdata;
        this.cropYearFormats = this.masterData.companyCropYearFormats;
        this.filteredCropYearFormats = this.masterData.companyCropYearFormats;
        this.filteredPriceUnits = this.masterData.priceUnits;
        this.priceUnitCtrl.valueChanges.subscribe((input) => {
            this.filteredPriceUnits = this.utilService.filterListforAutocomplete(
                input,
                this.masterData.priceUnits,
                ['priceCode', 'description'],
            );
        });

        this.filteredProvince = this.masterData.provinces;
        this.provinceConfigurationCtrl.valueChanges.subscribe((input) => {
            this.filteredProvince = this.utilService.filterListforAutocomplete(
                input,
                this.masterData.provinces,
                ['stateCode', 'description'],
            );
        });

        this.filteredBranch = this.masterData.branches;

        if (this.companyId) {
            this.getIntercoUsers(this.companyId);
        } else {
            this.isEdit = true;
            this.getIntercoUsers(this.currentCompany);
        }
        this.businessSectorPostingCtrl.disable();
        this.setValidators();
        this.provinceConfigurationStatus.emit(this.isProvinceActivationToggleChecked);
        this.provinceConfigurationCtrl.disable();
        if (this.company && this.company.toLowerCase() === this.companyCodeForIL) {
            this.provinceActivationCtrl.setValue(true);
            this.provinceActivationCtrl.enable();
            this.provinceConfigurationCtrl.enable();
            this.setValidationsForProvinces(true);
        }
        this.branchConfigurationStatus.emit(this.isProvinceActivationToggleChecked);
        if (this.company && this.company.toLowerCase() === this.companyCodeForIL) {
            this.provinceActivationCtrl.setValue(true);
            this.provinceActivationCtrl.enable();
        }
    }

    onProvinceSelected(provinceCode: string) {
        const selectedProvince = this.masterData.provinces.find(
            (p) => p.stateCode === provinceCode,
        );
        if (selectedProvince) {
            this.provinceConfigurationCtrl.patchValue(
                selectedProvince.stateCode,
            );
        }
    }

    clearDescription() {
        if (!this.provinceConfigurationCtrl.value) {
            this.provinceConfigurationCtrl.patchValue('');
        }
    }

    getIntercoUsers(companyId: string) {
        this.subscriptions.push(this.configurationService.getInterCoNoInterCoUsers(companyId)
            .subscribe((data: IntercoNoIntercoUsers[]) => {
                if (data) {
                    this.intercoNoIntercoUsers = data;
                    this.intercoEmailCtrl.valueChanges.subscribe((input) => {
                        this.filteredIntercoUserList = this.utilService.filterListforAutocomplete(
                            input,
                            data,
                            ['email'],
                        );
                    });

                    this.noIntercoEmailCtrl.valueChanges.subscribe((input) => {
                        this.filteredNoIntercoUserList = this.utilService.filterListforAutocomplete(
                            input,
                            data,
                            ['email'],
                        );
                    });
                }
            }));
    }

    getFormGroup() {
        this.physicalsTabMainPhysicalsFormGroup = this.formBuilder.group({
            priceUnitCtrl: this.priceUnitCtrl,
            cropYearCtrl: this.cropYearCtrl,
            intercoEmailCtrl: this.intercoEmailCtrl,
            noIntercoEmailCtrl: this.noIntercoEmailCtrl,
            businessSectorTradingCtrl: this.businessSectorTradingCtrl,
            businessSectorPostingCtrl: this.businessSectorPostingCtrl,
            provinceConfigurationCtrl: this.provinceConfigurationCtrl,
            provinceActivationCtrl: this.provinceActivationCtrl,
        });
        return super.getFormGroup();
    }

    setValidators() {
        this.priceUnitCtrl.setValidators(
            Validators.compose([
                inDropdownListValidator(
                    this.masterData.priceUnits,
                    nameof<PriceUnit>('priceUnitId'),
                ),
            ]),
        );
        this.priceUnitCtrl.setValidators([
            Validators.compose([Validators.required]),
        ]);
    }

    onIntercoAddToListClicked() {
        const interCoUserEmailId = this.intercoEmailCtrl.value;
        if (interCoUserEmailId) {
            this.interCoEmailChipStringList.push(interCoUserEmailId);
            this.interCoChipStringList = [];

            this.interCoEmailChipStringList.forEach((emailId: string) => {
                if (this.interCoChipStringList.filter((item) => item === emailId).length === 0) {
                    this.interCoChipStringList.push(emailId);
                }
            });
            this.intercoEmailCtrl.clearValidators();
            this.intercoEmailCtrl.updateValueAndValidity();
            this.intercoEmailCtrl.setValue('');
        }
    }

    onInterCoRemoveClicked(value) {
        if (this.isEdit) {
            const index = this.interCoChipStringList.indexOf(value);
            const emailIdIndex = this.interCoEmailChipStringList.indexOf(value);
            if (index > -1) {
                this.interCoChipStringList.splice(index, 1);
            }
            if (emailIdIndex > -1) {
                this.interCoEmailChipStringList.splice(index, 1);
            }
        }
    }

    onNoInterCoRemoveClicked(value) {
        if (this.isEdit) {
            const index = this.noInterCoChipStringList.indexOf(value);
            const emailIdIndex = this.noInterCoEmailChipStringList.indexOf(value);
            if (index > -1) {
                this.noInterCoChipStringList.splice(index, 1);
            }
            if (emailIdIndex > -1) {
                this.noInterCoEmailChipStringList.splice(index, 1);
            }
        }
    }

    onNoIntercoAddToListClicked() {
        const noInterCoUserEmailId = this.noIntercoEmailCtrl.value;
        if (noInterCoUserEmailId) {
            this.noInterCoEmailChipStringList.push(noInterCoUserEmailId);
            this.noInterCoChipStringList = [];

            this.noInterCoEmailChipStringList.forEach((emailId: string) => {
                if (this.noInterCoChipStringList.filter((item) => item === emailId).length === 0) {
                    this.noInterCoChipStringList.push(emailId);
                }
            });
            this.noIntercoEmailCtrl.clearValidators();
            this.noIntercoEmailCtrl.updateValueAndValidity();
            this.noIntercoEmailCtrl.setValue('');
        }
    }

    onDiscardButtonClicked() {
        this.discardChanges.emit({ selectedOptionName: 'PhysicalsMainComponent' });
    }

    onSaveButtonClicked() {
        this.utilService.updateFormGroupValidity(this.physicalsTabMainPhysicalsFormGroup);
        if (!this.physicalsTabMainPhysicalsFormGroup.valid) {
            this.snackbarService.throwErrorSnackBar(
                'Physicals tab - Main physicals is invalid. Please resolve the errors.',
            );
            return;
        }
        this.getMainPhysicalsDataToSave();
        this.isSideNavOpened.emit(false);
        this.savePhysicals.emit();
    }

    getPriceUnit(priceCode: string): PriceUnit {
        const priceUnitValue = this.masterData.priceUnits.find(
            (priceUnit) => priceUnit.priceCode === priceCode);
        if (priceUnitValue) {
            return priceUnitValue;
        }
    }

    getMainPhysicalsDataToSave() {
        this.companyConfiguration = new CompanyConfiguration();
        const companySetup = new CompanySetup();
        const tradeConfiguration = new TradeConfiguration();
        const intercoNoIntercoEmailSetup: IntercoNoIntercoEmailSetup[] = new Array<IntercoNoIntercoEmailSetup>();

        companySetup.cropYearFormatId = this.cropYearCtrl.value;
        const priceCode = this.priceUnitCtrl.value.priceCode ? this.priceUnitCtrl.value.priceCode
            : this.priceUnitCtrl.value;
        const priceUnit = this.getPriceUnit(priceCode);
        if (priceUnit) {
            companySetup.priceUnitId = priceUnit.priceUnitId;
        }
        tradeConfiguration.companyId = this.company;
        if (this.model && this.model.tradeConfiguration.tradeSetupId) {
            tradeConfiguration.tradeSetupId = this.model.tradeConfiguration.tradeSetupId;
        }
        tradeConfiguration.businessSectorNominalTradingOperation = this.businessSectorTradingCtrl.value ? true : false;
        tradeConfiguration.businessSectorNominalPostingPurpose = this.businessSectorPostingCtrl.value ? true : false;
        if (this.provinceActivationCtrl.value) {
            if (this.provinceConfigurationCtrl.value) {
                const matchedProvince = this.filteredProvince.find((p) =>
                    p.stateCode === this.provinceConfigurationCtrl.value);
                if (matchedProvince) {
                    companySetup.defaultProvinceId = matchedProvince.provinceId;
                    companySetup.defaultBranchId = this.masterData.branches[0].branchId;
                }
            }
            companySetup.isProvinceEnable = this.provinceActivationCtrl.value;
        }

        for (let i = 0; i < this.interCoChipStringList.length; i++) {
            const intercoEmail = new IntercoNoIntercoEmailSetup();
            const intercoUser = this.intercoNoIntercoUsers.find((e) => e.email === this.interCoChipStringList[i]);
            if (this.model && this.model.interCoNoInterCoEmailSetup) {
                const intercoConfigId = this.model.interCoNoInterCoEmailSetup.find((d) => d.email === this.interCoChipStringList[i]
                    && d.isInterCo === true);
                if (intercoConfigId) {
                    intercoEmail.configId = intercoConfigId.configId;
                }
            }
            intercoEmail.companyId = this.company;
            intercoEmail.userId = intercoUser.userId;
            intercoEmail.isDeactivated = intercoUser.isDisabled;
            intercoEmail.isInterCo = true;

            intercoNoIntercoEmailSetup.push(intercoEmail);
        }

        for (let i = 0; i < this.noInterCoChipStringList.length; i++) {
            const noIntercoEmail = new IntercoNoIntercoEmailSetup();
            const noIntercoUser = this.intercoNoIntercoUsers.find((e) => e.email === this.noInterCoChipStringList[i]);
            if (this.model && this.model.interCoNoInterCoEmailSetup) {
                const noIntercoConfigId = this.model.interCoNoInterCoEmailSetup.find((d) => d.email === this.noInterCoChipStringList[i]
                    && d.isInterCo === false);
                if (noIntercoConfigId) {
                    noIntercoEmail.configId = noIntercoConfigId.configId;
                }
            }
            noIntercoEmail.companyId = this.company;
            noIntercoEmail.userId = noIntercoUser.userId;
            noIntercoEmail.isDeactivated = noIntercoUser.isDisabled;
            noIntercoEmail.isInterCo = false;

            intercoNoIntercoEmailSetup.push(noIntercoEmail);
        }

        this.companyConfiguration.companySetup = companySetup;
        this.companyConfiguration.tradeConfiguration = tradeConfiguration;
        this.companyConfiguration.intercoNoIntercoEmailSetup = intercoNoIntercoEmailSetup;
    }

    displayQuantityUnit(weightUnitId: number): string {
        if (this.masterData.weightUnits && weightUnitId) {
            const selectedUnit = this.masterData.weightUnits.filter(
                (weightUnit) => weightUnit.weightUnitId === weightUnitId,
            );

            if (selectedUnit.length > 0) {
                return selectedUnit[0].weightCode;
            }
        }

        return '';
    }

    onBusinessSectorTradingToggleChanged(event: MatSlideToggleChange) {
        if (event.checked) {
            this.businessSectorPostingCtrl.enable();
        } else {
            this.businessSectorPostingCtrl.disable();
        }
    }

    onBusinessSectorPostingToggleChanged(event: MatSlideToggleChange) {
        if (event.checked) {
            this.businessSectorTradingCtrl.disable();
        } else {
            this.businessSectorTradingCtrl.enable();
        }
    }

    initForm(companyConfigurationRecord: CompanyConfigurationRecord, isEdit: boolean) {
        this.isEdit = isEdit;
        this.model = companyConfigurationRecord;
        if (this.model.tradeConfiguration) {
            this.businessSectorTradingCtrl.setValue(this.model.tradeConfiguration.businessSectorNominalTradingOperation);
            this.businessSectorPostingCtrl.setValue(this.model.tradeConfiguration.businessSectorNominalPostingPurpose);
        }
        if (this.model.companySetup) {
            this.isProvinceActivationToggleChecked = this.model.companySetup.isProvinceEnable;

            if (this.isProvinceActivationToggleChecked) {
                this.provinceActivationCtrl.patchValue(this.model.companySetup.isProvinceEnable);

                const selectedProvince = this.masterData.provinces.find(
                    (p) => p.provinceId === this.model.companySetup.defaultProvinceId,
                );
                if (selectedProvince) {
                    this.provinceConfigurationCtrl.patchValue(
                        selectedProvince.stateCode,
                    );
                }
            }
            this.priceUnitCtrl.setValue(this.model.companySetup.priceCode);
            if (this.model.companySetup.cropYearId) {
                this.cropYearCtrl.patchValue(this.model.companySetup.cropYearId);
                this.cropYearCtrl.clearValidators();
                this.cropYearCtrl.updateValueAndValidity();
            }
            if (this.model.interCoNoInterCoEmailSetup) {
                let intercoNoIntercoEmails: IntercoNoIntercoEmails[] = new Array<IntercoNoIntercoEmails>();
                intercoNoIntercoEmails = this.model.interCoNoInterCoEmailSetup.filter((e) => e.isInterCo === true);
                this.interCoChipStringList = [];
                this.interCoEmailChipStringList = [];
                for (let i = 0; i < intercoNoIntercoEmails.length; i++) {
                    const intercoUser = this.intercoNoIntercoUsers.find((e) => e.userId === intercoNoIntercoEmails[i].userId);
                    if (intercoUser) {
                        this.interCoChipStringList.push(intercoUser.email);
                        this.interCoEmailChipStringList.push(intercoUser.email);
                    }
                }

                let noIntercoNoIntercoEmails: IntercoNoIntercoEmails[] = new Array<IntercoNoIntercoEmails>();
                noIntercoNoIntercoEmails = this.model.interCoNoInterCoEmailSetup.filter((e) => e.isInterCo === false);
                this.noInterCoChipStringList = [];
                this.noInterCoEmailChipStringList = [];
                for (let i = 0; i < noIntercoNoIntercoEmails.length; i++) {
                    const noIntercoUser = this.intercoNoIntercoUsers.find((e) => e.userId === noIntercoNoIntercoEmails[i].userId);
                    if (noIntercoUser) {
                        this.noInterCoChipStringList.push(noIntercoUser.email);
                        this.noInterCoEmailChipStringList.push(noIntercoUser.email);
                    }
                }
            }

            if (this.interCoChipStringList.length > 0) {
                this.intercoEmailCtrl.clearValidators();
                this.intercoEmailCtrl.updateValueAndValidity();
            }
            if (this.noInterCoChipStringList.length > 0) {
                this.noIntercoEmailCtrl.clearValidators();
                this.noIntercoEmailCtrl.updateValueAndValidity();
            }
            this.provinceConfigurationStatus.emit(this.isProvinceActivationToggleChecked);
            this.branchConfigurationStatus.emit(this.isProvinceActivationToggleChecked);
        }

        if (!isEdit) {
            this.businessSectorPostingCtrl.disable();
            this.businessSectorTradingCtrl.disable();
            this.physicalsTabMainPhysicalsFormGroup.disable();
        } else {
            this.physicalsTabMainPhysicalsFormGroup.enable();
            if (this.businessSectorTradingCtrl.value) {
                if (this.businessSectorPostingCtrl.value) {
                    this.businessSectorTradingCtrl.disable();
                    this.businessSectorPostingCtrl.enable();
                } else {
                    this.businessSectorPostingCtrl.enable();
                    this.businessSectorTradingCtrl.enable();
                }
            } else {
                this.businessSectorTradingCtrl.enable();
                this.businessSectorPostingCtrl.disable();
            }
        }
        return companyConfigurationRecord;
    }

    checkBusinessSector(value: boolean) {
        this.businessSectorTradingCtrl.setValue(value);
    }

    populateEntity(entity: CompanyConfiguration): CompanyConfiguration {
        const CompanyConfigurationEntity = entity;
        this.getMainPhysicalsDataToSave();
        CompanyConfigurationEntity.companySetup = this.companyConfiguration.companySetup;
        CompanyConfigurationEntity.tradeConfiguration = this.companyConfiguration.tradeConfiguration;
        CompanyConfigurationEntity.intercoNoIntercoEmailSetup = this.companyConfiguration.intercoNoIntercoEmailSetup;
        return CompanyConfigurationEntity;
    }

    onProvinceActivation(value: MatSlideToggleChange) {
        this.isProvinceActivationToggleChecked = value.checked;
        this.setValidationsForProvinces(this.isProvinceActivationToggleChecked);
    }

    setValidationsForProvinces(value: boolean) {
        if (!value) {
            this.provinceConfigurationCtrl.disable();
            this.provinceConfigurationCtrl.setValidators(null);
        } else {
            this.provinceConfigurationCtrl.enable();
            this.provinceConfigurationCtrl.setValidators([Validators.required]);
            this.provinceConfigurationCtrl.setValidators(
                Validators.compose([
                    inDropdownListValidator(
                        this.masterData.provinces,
                        nameof<Province>('stateCode'),
                    ),
                ]),
            );
        }
        this.provinceConfigurationCtrl.updateValueAndValidity();
    }
}
