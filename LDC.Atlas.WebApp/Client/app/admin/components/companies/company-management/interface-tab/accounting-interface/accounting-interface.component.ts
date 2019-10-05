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
import { SnackbarService } from '../../../../../../shared/services/snackbar.service';
import { nameof, UtilService } from '../../../../../../shared/services/util.service';

@Component({
    selector: 'atlas-accounting-interface',
    templateUrl: './accounting-interface.component.html',
    styleUrls: ['./accounting-interface.component.scss'],
})
export class AccountingInterfaceComponent extends BaseFormComponent implements OnInit {
    @Output() readonly isSideNavOpened = new EventEmitter<boolean>();
    interfaceSetupIdCtrl = new AtlasFormControl('InterfaceSetupId');
    interfaceActiveCtrl = new AtlasFormControl('InterfaceActive');
    interfaceCodeCtrl = new AtlasFormControl('InterfaceCode');
    interfaceTargetSystemCtrl = new AtlasFormControl('InterfaceTargetSystem');
    @Output() readonly discardChanges = new EventEmitter<any>();
    @Output() readonly saveMandatory = new EventEmitter();
    @Output() readonly accountingInterfaceStatus = new EventEmitter<boolean>();
    isIntefaceToggleChecked: boolean = false;
    isEdit: boolean;
    masterData: MasterData;
    filteredInterfaceTypeList: InterfaceTypes[];
    companyConfiguration: CompanyConfiguration;
    interfaceSetupList: InterfaceSetup[];
    accountingInterfaceFormGroup: FormGroup;
    interfaceActiveStatus: string;
    currentCompany: string;
    companyId: string;
    interfaceSetup: InterfaceSetup;
    accountingInterfaceErrorMap: Map<string, string> = new Map()
        .set('required', 'Required *')
        .set('inDropdownList', 'Invalid entry. Value not in the list.');
    interfaceCodeErrorMap: Map<string, string> = new Map()
        .set('required', 'Required *')
        .set('maxLength', 'Interface code should be of 15 characters maximum');
    showHintForToggleActivation: boolean;

    constructor(
        protected formConfigurationProvider: FormConfigurationProviderService,
        private route: ActivatedRoute,
        protected utilService: UtilService,
        protected snackBarService: SnackbarService,
        protected formBuilder: FormBuilder) {
        super(formConfigurationProvider);
    }

    ngOnInit() {
        this.currentCompany = decodeURIComponent(this.route.snapshot.paramMap.get('company'));
        this.companyId = this.route.snapshot.paramMap.get('companyId');
        this.masterData = this.route.snapshot.data.masterdata;
        this.filteredInterfaceType();
        this.accountingInterfaceStatus.emit(this.isIntefaceToggleChecked);
        this.setValidations();
        if (!this.companyId) {
            this.isEdit = true;
        }
        if (!this.isIntefaceToggleChecked) {
            this.interfaceCodeCtrl.disable();
            this.interfaceTargetSystemCtrl.disable();
        }
        this.setValidators();
    }

    initForm(companyConfigurationRecord, isEdit) {
        this.isEdit = isEdit;
        this.interfaceSetupList = companyConfigurationRecord.interfaceSetup;
        const accountingInterfaceValue = this.interfaceSetupList.find(
            (e) => e.interfaceTypeId !== InterfaceType.PaymentRequestInterface);
        if (accountingInterfaceValue) {
            this.interfaceSetupIdCtrl.setValue(accountingInterfaceValue.interfaceSetUpId);
            this.interfaceActiveCtrl.setValue(accountingInterfaceValue.isActive);
            this.interfaceCodeCtrl.setValue(accountingInterfaceValue.interfaceCode);
            this.isIntefaceToggleChecked = accountingInterfaceValue.isActive;
            this.accountingInterfaceStatus.emit(this.isIntefaceToggleChecked);
            this.setValidations();
            if (accountingInterfaceValue.interfaceTypeId) {
                this.interfaceTargetSystemCtrl.setValue(this.getInterfaceCodeFromId(accountingInterfaceValue.interfaceTypeId));
            }
        }
        if (!isEdit) {
            this.accountingInterfaceFormGroup.disable();
        } else {
            this.accountingInterfaceFormGroup.enable();
        }
        if (isEdit && !this.isIntefaceToggleChecked) {
            this.interfaceCodeCtrl.disable();
            this.interfaceTargetSystemCtrl.disable();
        }
        return companyConfigurationRecord;
    }

    getInterfaceCodeFromId(interfaceId: number) {
        const interfaceCode = this.masterData.interfaceType.find(
            (e) => e.interfaceTypeId === interfaceId);
        if (interfaceCode) {
            return interfaceCode.interfaceType;
        }
    }

    getFormGroup() {
        this.accountingInterfaceFormGroup = this.formBuilder.group({
            interfaceActiveCtrl: this.interfaceActiveCtrl,
            interfaceTargetSystemCtrl: this.interfaceTargetSystemCtrl,
            interfaceCodeCtrl: this.interfaceCodeCtrl,
        });
        return super.getFormGroup();
    }

    setValidators() {
        this.interfaceTargetSystemCtrl.setValidators(
            Validators.compose([
                inDropdownListValidator(
                    this.filteredInterfaceTypeList,
                    nameof<InterfaceTypes>('interfaceType'),
                ),
            ]),
        );
        this.interfaceCodeCtrl.setValidators(Validators.compose([Validators.maxLength(15)]));
    }

    onDiscardButtonClicked() {
        this.discardChanges.emit({ selectedOptionName: 'AccountingInterfaceComponent' });
    }

    onSaveButtonClicked() {
        this.utilService.updateFormGroupValidity(this.accountingInterfaceFormGroup);
        if (!this.accountingInterfaceFormGroup.valid) {
            this.snackBarService.throwErrorSnackBar(
                'Interface tab - Accounting Interface system is invalid. Please resolve the errors.',
            );
            return;
        }
        this.isSideNavOpened.emit(false);
        this.saveMandatory.emit();
    }

    getAccountingInterfaceValues() {
        this.companyConfiguration = new CompanyConfiguration();
        const accountingInterfaceSystem: InterfaceSetup = new InterfaceSetup();
        accountingInterfaceSystem.interfaceSetUpId = this.interfaceSetupIdCtrl.value === '' ? null : this.interfaceSetupIdCtrl.value;
        accountingInterfaceSystem.interfaceCode = this.interfaceCodeCtrl.value;
        accountingInterfaceSystem.legalEntityCode = '';
        accountingInterfaceSystem.isActive = this.interfaceActiveCtrl.value ? true : false;
        accountingInterfaceSystem.interfaceTypeId = this.interfaceTargetSystemCtrl.value.interfaceTypeId
            ? this.interfaceTargetSystemCtrl.value.interfaceTypeId : this.getInterfaceIdFromCode(this.interfaceTargetSystemCtrl.value);
        this.interfaceSetup = accountingInterfaceSystem;
    }

    populateEntity(entity: CompanyConfiguration): CompanyConfiguration {
        const CompanyConfigurationEntity = entity;
        CompanyConfigurationEntity.interfaceSetup = [];
        this.getAccountingInterfaceValues();
        CompanyConfigurationEntity.interfaceSetup.push(this.interfaceSetup);
        return CompanyConfigurationEntity;
    }

    getInterfaceIdFromCode(interfaceCode: string): number {
        const interfaceType = this.masterData.interfaceType.find(
            (e) => e.interfaceType === interfaceCode);
        if (interfaceType) {
            return interfaceType.interfaceTypeId;
        }

    }

    onInterfaceActiveToggleChanged(value: MatSlideToggleChange) {
        this.isIntefaceToggleChecked = value.checked;
        this.setValidations();
        this.accountingInterfaceStatus.emit(this.isIntefaceToggleChecked);
    }

    setValidations() {
        if (!this.isIntefaceToggleChecked) {
            this.interfaceCodeCtrl.disable();
            this.interfaceTargetSystemCtrl.disable();
            this.interfaceTargetSystemCtrl.clearValidators();
            this.interfaceCodeCtrl.clearValidators();
            this.showHintForToggleActivation = false;
        } else {
            this.interfaceCodeCtrl.enable();
            this.interfaceTargetSystemCtrl.enable();
            this.interfaceTargetSystemCtrl.setValidators(Validators.compose([Validators.required]));
            this.interfaceCodeCtrl.setValidators(Validators.compose([Validators.required]));
            this.showHintForToggleActivation = true;
        }
        this.interfaceTargetSystemCtrl.updateValueAndValidity();
        this.interfaceCodeCtrl.updateValueAndValidity();
    }

    filteredInterfaceType() {
        let interfaceTypeList: InterfaceTypes[] = [];
        this.filteredInterfaceTypeList = this.masterData.interfaceType.filter(
            (e) => e.interfaceTypeId !== InterfaceType.PaymentRequestInterface);
        interfaceTypeList = this.filteredInterfaceTypeList;
        this.interfaceTargetSystemCtrl.valueChanges.subscribe((input) => {
            this.filteredInterfaceTypeList = this.utilService.filterListforAutocomplete(
                input,
                interfaceTypeList,
                ['interfaceType', 'interfaceTypeId'],
            );
        });
    }
}
