import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSlideToggleChange } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { BaseFormComponent } from '../../../../../../shared/components/base-form-component/base-form-component.component';
import { inDropdownListValidator } from '../../../../../../shared/directives/autocomplete-dropdown.directive';
import { AtlasFormControl } from '../../../../../../shared/entities/atlas-form-control';
import { CompanyConfiguration } from '../../../../../../shared/entities/company-configuration.entity';
import { InterfaceSetup } from '../../../../../../shared/entities/interface-setup.entity';
import { InterfaceTypes } from '../../../../../../shared/entities/interface-type.entity';
import { MasterData } from '../../../../../../shared/entities/masterdata.entity';
import { InterfaceType } from '../../../../../../shared/enums/interface-type.enum';
import { FormConfigurationProviderService } from '../../../../../../shared/services/form-configuration-provider.service';
import { ConfigurationService } from '../../../../../../shared/services/http-services/configuration.service';
import { SnackbarService } from '../../../../../../shared/services/snackbar.service';
import { nameof, UtilService } from '../../../../../../shared/services/util.service';

@Component({
    selector: 'atlas-treasury-system',
    templateUrl: './treasury-system.component.html',
    styleUrls: ['./treasury-system.component.scss'],
})
export class TreasurySystemComponent extends BaseFormComponent implements OnInit {
    @Output() readonly discardChanges = new EventEmitter<any>();
    @Output() readonly saveMandatory = new EventEmitter();
    @Output() readonly treasuryInterfaceStatus = new EventEmitter<boolean>();
    @Output() readonly isSideNavOpened = new EventEmitter<boolean>();
    interfaceSetupIdCtrl = new AtlasFormControl('InterfaceSetupId');
    interfaceActiveCtrl = new AtlasFormControl('InterfaceActive');
    interfaceSystemCtrl = new AtlasFormControl('InterfaceSystem');
    traxLegalEntityCodeCtrl = new AtlasFormControl('traxLegalEntityCode');
    isInterfaceActive: boolean = false;
    interfaceSetupList: InterfaceSetup[];
    masterData: MasterData;
    filteredInterfaceTypeList: InterfaceTypes[];
    companyConfiguration: CompanyConfiguration;
    treasurySystemFormGroup: FormGroup;
    interfaceSetup: InterfaceSetup;
    checkEdit: boolean;
    interfaceActive: string;
    currentCompany: string;
    companyId: string;
    treasuryInterfaceErrorMap: Map<string, string> = new Map()
        .set('required', 'Required *')
        .set('inDropdownList', 'Invalid entry. Value not in the list.');
    legalEntityCodeErrorMap: Map<string, string> = new Map()
        .set('required', 'Required *');

    constructor(protected formConfigurationProvider: FormConfigurationProviderService,
        private route: ActivatedRoute,
        protected configurationService: ConfigurationService,
        protected snackBarService: SnackbarService,
        protected utilService: UtilService,
        protected formBuilder: FormBuilder) { super(formConfigurationProvider); }

    ngOnInit() {
        this.currentCompany = decodeURIComponent(this.route.snapshot.paramMap.get('company'));
        this.companyId = this.route.snapshot.paramMap.get('companyId');
        this.masterData = this.route.snapshot.data.masterdata;
        this.filteredInterfaceType();
        if (!this.companyId) {
            this.interfaceActiveCtrl.setValue(false);
            this.checkEdit = true;
        }
        this.interfaceActive = (this.isInterfaceActive) ? 'Active' : 'InActive';
        this.setValidations();
        this.treasuryInterfaceStatus.emit(this.isInterfaceActive);
        if (!this.isInterfaceActive) {
            this.traxLegalEntityCodeCtrl.disable();
            this.interfaceSystemCtrl.disable();
        }
        this.setValidators();
    }

    filteredInterfaceType() {
        let interfaceTypeList: InterfaceTypes[] = [];
        this.filteredInterfaceTypeList = this.masterData.interfaceType.filter(
            (e) => e.interfaceTypeId !== InterfaceType.AccountingInterface);
        interfaceTypeList = this.filteredInterfaceTypeList;
        this.interfaceSystemCtrl.valueChanges.subscribe((input) => {
            this.filteredInterfaceTypeList = this.utilService.filterListforAutocomplete(
                input,
                interfaceTypeList,
                ['interfaceType', 'interfaceTypeId'],
            );
        });
    }

    initForm(companyConfigurationRecord, isEdit) {
        this.checkEdit = isEdit;
        this.interfaceSetupList = companyConfigurationRecord.interfaceSetup;
        const accountingInterfaceValue = this.interfaceSetupList.find(
            (e) => e.interfaceTypeId === InterfaceType.PaymentRequestInterface);
        if (accountingInterfaceValue) {
            this.interfaceSetupIdCtrl.setValue(accountingInterfaceValue.interfaceSetUpId);
            this.interfaceActiveCtrl.setValue(accountingInterfaceValue.isActive);
            this.traxLegalEntityCodeCtrl.setValue(accountingInterfaceValue.legalEntityCode);
            this.isInterfaceActive = accountingInterfaceValue.isActive;
            this.treasuryInterfaceStatus.emit(this.isInterfaceActive);
            this.setValidations();
            if (accountingInterfaceValue.interfaceTypeId) {
                this.interfaceSystemCtrl.setValue(this.getInterfaceCodeFromId(accountingInterfaceValue.interfaceTypeId));
            }
        }
        if (!isEdit) {
            this.treasurySystemFormGroup.disable();
        } else {
            this.treasurySystemFormGroup.enable();
        }
        if (isEdit && !this.isInterfaceActive) {
            this.interfaceSystemCtrl.disable();
            this.traxLegalEntityCodeCtrl.disable();
        }
        return companyConfigurationRecord;
    }

    getInterfaceCodeFromId(interfaceId: number) {
        const interfacType = this.masterData.interfaceType.find(
            (e) => e.interfaceTypeId === interfaceId);
        if (interfacType) {
            return interfacType.interfaceType;
        }

    }

    getFormGroup() {
        this.treasurySystemFormGroup = this.formBuilder.group({
            interfaceActiveCtrl: this.interfaceActiveCtrl,
            interfaceSystemCtrl: this.interfaceSystemCtrl,
            traxLegalEntityCodeCtrl: this.traxLegalEntityCodeCtrl,
        });
        return super.getFormGroup();
    }

    onDiscardButtonClicked() {
        this.discardChanges.emit({ selectedOptionName: 'TreasurySystemComponent' });
    }

    onSaveButtonClicked() {
        this.utilService.updateFormGroupValidity(this.treasurySystemFormGroup);
        if (!this.treasurySystemFormGroup.valid) {
            this.snackBarService.throwErrorSnackBar(
                'Interface tab - Treasury system is invalid. Please resolve the errors.',
            );
            return;
        }
        this.isSideNavOpened.emit(false);
        this.saveMandatory.emit();
    }

    getTreasurySystemValues() {
        this.companyConfiguration = new CompanyConfiguration();
        const treasuryInterfaceSystem: InterfaceSetup = new InterfaceSetup();
        treasuryInterfaceSystem.interfaceSetUpId = this.interfaceSetupIdCtrl.value === '' ? null : this.interfaceSetupIdCtrl.value;
        treasuryInterfaceSystem.legalEntityCode = (this.traxLegalEntityCodeCtrl.value) ? this.traxLegalEntityCodeCtrl.value : '';
        treasuryInterfaceSystem.isActive = this.interfaceActiveCtrl.value ? true : false;
        treasuryInterfaceSystem.interfaceTypeId = this.interfaceSystemCtrl.value.interfaceTypeId
            ? this.interfaceSystemCtrl.value.interfaceTypeId : this.getInterfaceIdFromCode(this.interfaceSystemCtrl.value);
        this.interfaceSetup = treasuryInterfaceSystem;
    }

    populateEntity(entity: CompanyConfiguration): CompanyConfiguration {
        const CompanyConfigurationEntity = entity;
        CompanyConfigurationEntity.interfaceSetup = [];
        this.getTreasurySystemValues();
        CompanyConfigurationEntity.interfaceSetup.push(this.interfaceSetup);
        return CompanyConfigurationEntity;
    }

    getInterfaceIdFromCode(interfaceCode: string): number {
        const interfaceId = this.masterData.interfaceType.find(
            (e) => e.interfaceType === interfaceCode);
        if (interfaceId) {
            return interfaceId.interfaceTypeId;
        }
    }

    setValidators() {
        this.interfaceSystemCtrl.setValidators(
            Validators.compose([
                inDropdownListValidator(
                    this.filteredInterfaceTypeList,
                    nameof<InterfaceTypes>('interfaceType'),
                ), Validators.required,
            ]),
        );
    }

    setValidations() {
        if (!this.isInterfaceActive) {
            this.traxLegalEntityCodeCtrl.disable();
            this.interfaceSystemCtrl.disable();
            this.traxLegalEntityCodeCtrl.clearValidators();
            this.interfaceSystemCtrl.clearValidators();
        } else {
            this.traxLegalEntityCodeCtrl.enable();
            this.interfaceSystemCtrl.enable();
            this.traxLegalEntityCodeCtrl.setValidators(Validators.compose([Validators.required]));
            this.interfaceSystemCtrl.setValidators(Validators.compose([Validators.required]));
        }
        this.traxLegalEntityCodeCtrl.updateValueAndValidity();
        this.interfaceSystemCtrl.updateValueAndValidity();
    }

    onInterfaceActiveToggleChanged(value: MatSlideToggleChange) {
        this.isInterfaceActive = value.checked;
        this.setValidations();
        this.treasuryInterfaceStatus.emit(this.isInterfaceActive);
    }
}
