import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BaseFormComponent } from '../../../../../../shared/components/base-form-component/base-form-component.component';
import { inDropdownListValidator } from '../../../../../../shared/directives/autocomplete-dropdown.directive';
import { AtlasFormControl } from '../../../../../../shared/entities/atlas-form-control';
import { CompanyConfiguration } from '../../../../../../shared/entities/company-configuration.entity';
import { DefaultAccountingSetup } from '../../../../../../shared/entities/default-accounting-setup.entity';
import { Department } from '../../../../../../shared/entities/department.entity';
import { CompanyConfigurationRecord } from '../../../../../../shared/services/configuration/dtos/company-configuration-record';
import { FormConfigurationProviderService } from '../../../../../../shared/services/form-configuration-provider.service';
import { nameof, UtilService } from '../../../../../../shared/services/util.service';

@Component({
    selector: 'atlas-others',
    templateUrl: './others.component.html',
    styleUrls: ['./others.component.scss'],
})
export class OthersComponent extends BaseFormComponent implements OnInit {
    @Output() readonly discardChanges = new EventEmitter<any>();
    @Output() readonly saveMandatory = new EventEmitter();
    @Output() readonly isSideNavOpened = new EventEmitter<boolean>();
    filteredDepartments: Department[];
    defaultAccountingSetup: DefaultAccountingSetup;
    masterdata: any;
    checkEdit: boolean = false;
    isCreate: boolean;
    companyId: string;
    deptCntrl = new AtlasFormControl('deptCntrl');
    departmentErrorMap: Map<string, string> = new Map()
        .set('required', 'Required *')
        .set('inDropdownList', 'Invalid entry. Department not in the list or not authorized.');

    constructor(protected formConfigurationProvider: FormConfigurationProviderService,
        protected route: ActivatedRoute, protected utilService: UtilService ) {
        super(formConfigurationProvider);
    }

    ngOnInit() {
        this.companyId = this.route.snapshot.paramMap.get('companyId');
        this.isCreate = false;
        if (!this.companyId) {
            this.isCreate = true;
            this.checkEdit = true;
        }
        this.masterdata = this.route.snapshot.data.masterdata;
        this.filteredDepartments = this.masterdata.departments;
        this.deptCntrl.valueChanges.subscribe((input) => {
            this.filteredDepartments =
                this.utilService.filterListforAutocomplete(
                    input,
                    this.masterdata.departments,
                    ['departmentCode', 'description']);
        });

        this.setValidators();
    }

    initForm(companyConfigurationRecord: CompanyConfigurationRecord, isEdit: boolean) {
        this.defaultAccountingSetup = companyConfigurationRecord.defaultAccountingSetup;
        this.deptCntrl.patchValue(companyConfigurationRecord.defaultAccountingSetup.yepDepartment);
        this.checkEdit = isEdit;
        return companyConfigurationRecord;
    }
    onSaveButtonClicked() {
        this.isSideNavOpened.emit(false);
        this.saveMandatory.emit();
    }

    onDiscardButtonClicked() {
        this.discardChanges.emit({ selectedOptionName: 'OthersComponent' });
    }

    setValidators() {
        this.deptCntrl.setValidators(
            Validators.compose([
                inDropdownListValidator(
                    this.masterdata.departments,
                    nameof<Department>('description'),
                ),
            ]),
        );
    }

    populateEntity(entity: CompanyConfiguration): CompanyConfiguration {
        const companyConfiguration = entity;
        if (this.deptCntrl.value) {
        companyConfiguration.defaultAccountingSetup.yepDepartmentId = this.getDepartmentIdFromCode(this.deptCntrl.value.description);
        }
        return companyConfiguration;
    }

    getDepartmentIdFromCode(departmentCode: string): number {
        const selectedDepartment = this.masterdata.departments.find(
            (department) => department.description === departmentCode,
        );
        if (selectedDepartment) {
            return selectedDepartment.departmentId;
        }
    }
}
