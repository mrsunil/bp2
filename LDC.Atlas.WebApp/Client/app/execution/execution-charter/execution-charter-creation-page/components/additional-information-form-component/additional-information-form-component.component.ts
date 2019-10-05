import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CompanyManagerService } from '../../../../../core/services/company-manager.service';
import { BaseFormComponent } from '../../../../../shared/components/base-form-component/base-form-component.component';
import { inDropdownListValidator } from '../../../../../shared/directives/autocomplete-dropdown.directive';
import { AtlasFormControl } from '../../../../../shared/entities/atlas-form-control';
import { Charter } from '../../../../../shared/entities/charter.entity';
import { Currency } from '../../../../../shared/entities/currency.entity';
import { Department } from '../../../../../shared/entities/department.entity';
import { MasterData } from '../../../../../shared/entities/masterdata.entity';
import { WeightUnit } from '../../../../../shared/entities/weight-unit.entity';
import { FormConfigurationProviderService } from '../../../../../shared/services/form-configuration-provider.service';
import { nameof, UtilService } from '../../../../../shared/services/util.service';

@Component({
    selector: 'atlas-additional-information-form-component',
    templateUrl: './additional-information-form-component.component.html',
    styleUrls: ['./additional-information-form-component.component.scss'],
})
export class AdditionalInformationFormComponent extends BaseFormComponent implements OnInit {

    @Input() isCreateOrEdit: boolean = true;

    charterDeptCntrl = new AtlasFormControl('charterDeptCntrl');
    charterQuantityCntrl = new AtlasFormControl('charterQuantityCntrl');
    charterCurrencyCntrl = new AtlasFormControl('charterCurrencyCntrl');

    filteredCurrencies: Currency[];
    filteredDepartments: Department[];
    filteredQuantities: WeightUnit[];
    masterdata: MasterData;
    showErrorIcon: boolean;
    isFormControlRequired: Map<string, boolean> = new Map<string, boolean>();
    currencyCodeControl: Currency;
    departmentControl: Department;
    quantityControl: WeightUnit;
    defaultQuantity: string = 'MT';
    defaultCurrency: string = 'USD';
    defaultCurrencyCntrl: Currency;
    defaultQuantityCntrl: WeightUnit;
    departmentErrorMap: Map<string, string> = new Map()
        .set('required', 'Required *')
        .set('inDropdownList', 'Invalid entry. Department not in the list or not authorized.');

    constructor(protected formbuilder: FormBuilder,
        protected utilService: UtilService,
        protected route: ActivatedRoute,
        private companyManager: CompanyManagerService,
        protected formConfigurationProvider: FormConfigurationProviderService) {
        super(formConfigurationProvider);
    }

    ngOnInit() {

        this.masterdata = this.route.snapshot.data.masterdata;

        this.filteredCurrencies = this.masterdata.currencies;
        this.charterCurrencyCntrl.valueChanges.subscribe((input) => {
            this.filteredCurrencies =
                this.utilService.filterListforAutocomplete(
                    input,
                    this.masterdata.currencies,
                    ['currencyCode', 'description']);
        });

        this.filteredDepartments = this.masterdata.departments;
        this.charterDeptCntrl.valueChanges.subscribe((input) => {
            this.filteredDepartments =
                this.utilService.filterListforAutocomplete(
                    input,
                    this.masterdata.departments,
                    ['departmentCode', 'description']);
        });
        this.filteredQuantities = this.masterdata.weightUnits;
        this.charterQuantityCntrl.valueChanges.subscribe((input) => {
            this.filteredQuantities =
                this.utilService.filterListforAutocomplete(
                    input,
                    this.masterdata.weightUnits,
                    ['weightCode', 'description']);
        });

        const companyDetails = this.companyManager.getCurrentCompany();
        if (companyDetails) {
            const currency = this.masterdata.currencies.find((e) => e.currencyCode === companyDetails.functionalCurrencyCode);
            this.charterCurrencyCntrl.patchValue(currency);
            const weightUnit = this.masterdata.weightUnits.find((e) => e.weightCode === companyDetails.weightCode);
            this.charterQuantityCntrl.patchValue(weightUnit);
        }

        if (this.isCreateOrEdit) {
            this.enableControl();
            this.setValidators();
        } else {
            this.disbaleControl();
        }
    }

    disbaleControl() {
        this.charterDeptCntrl.disable();
        this.charterCurrencyCntrl.disable();
        this.charterQuantityCntrl.disable();
    }

    enableControl() {
        this.charterDeptCntrl.enable();
        this.charterCurrencyCntrl.enable();
        this.charterQuantityCntrl.enable();
    }

    clearValueOfControl() {
        this.charterDeptCntrl.patchValue('');
        this.charterQuantityCntrl.patchValue('');
        this.charterCurrencyCntrl.patchValue('');
    }

    initForm(entity: any, isEdit: boolean = false) {
        this.assignValues(entity, isEdit);
        this.charterCurrencyCntrl.patchValue(this.currencyCodeControl);
        this.charterQuantityCntrl.patchValue(this.quantityControl);
        this.charterDeptCntrl.patchValue(this.departmentControl);
    }

    assignValues(entity: Charter, isEdit: boolean = false) {
        const charter = entity as Charter;
        this.currencyCodeControl = this.masterdata.currencies.find((currenctCode) => currenctCode.currencyCode === charter.currency);
        this.departmentControl = this.masterdata.departments.find((department) => department.departmentId === charter.departmentId);
        this.quantityControl = this.masterdata.weightUnits.find((quantity) => quantity.weightUnitId === charter.weightUnitId);
    }

    setValidators() {
        this.charterDeptCntrl.setValidators(
            Validators.compose([
                inDropdownListValidator(
                    this.masterdata.departments,
                    nameof<Department>('departmentCode'),
                ),
            ]),
        );

        this.charterCurrencyCntrl.setValidators(
            Validators.compose([
                inDropdownListValidator(
                    this.masterdata.currencies,
                    nameof<Currency>('currencyCode'),
                ),
            ]),
        );

        this.charterCurrencyCntrl.setValidators(Validators.compose([Validators.required]));

        this.charterQuantityCntrl.setValidators(
            Validators.compose([
                inDropdownListValidator(
                    this.masterdata.weightUnits,
                    nameof<WeightUnit>('weightCode'),
                ),
            ]),
        );

        this.charterQuantityCntrl.setValidators(Validators.compose([Validators.required]));

        this.isFormControlRequired[
            'charterCurrencyCntrl'
        ] = this.utilService.isRequired(this.charterCurrencyCntrl);
        this.isFormControlRequired[
            'charterQuantityCntrl'
        ] = this.utilService.isRequired(this.charterQuantityCntrl);

        this.formGroup.updateValueAndValidity();
    }

    getFormGroup() {
        this.formGroup = this.formbuilder.group({
            charterDeptCntrl: this.charterDeptCntrl,
            charterQuantityCntrl: this.charterQuantityCntrl,
            charterCurrencyCntrl: this.charterCurrencyCntrl,
        });
        return super.getFormGroup();
    }

    findDepartmentByCode(departmentCode: string): Department {
        return this.masterdata.departments.find((x) => x.departmentCode === departmentCode);
    }

    findWeightByCode(weightCode: string): WeightUnit {
        return this.masterdata.weightUnits.find((x) => x.weightCode === weightCode);
    }

    populateEntity(entity: any): any {
        const section = entity as Charter;
        const currency: Currency = this.charterCurrencyCntrl.value;
        section.currency = currency ? currency.currencyCode : '';

        if (this.charterQuantityCntrl.value && this.charterQuantityCntrl.value !== '') {
            const weightCode: WeightUnit = this.findWeightByCode(this.charterQuantityCntrl.value.weightCode);
            section.weightUnitId = weightCode ? weightCode.weightUnitId : null;
        }

        if (this.charterDeptCntrl.value && this.charterDeptCntrl.value !== '') {
            const department: Department = this.findDepartmentByCode(
                this.charterDeptCntrl.value.departmentCode,
            );
            section.departmentId = department ? department.departmentId : null;
        }
        return section;
    }
}
