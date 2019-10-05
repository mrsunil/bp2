import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as agGrid from 'ag-grid-community';
import { MultipleAutocompleteDropdownComponent } from '../../../../../shared/components/multiple-autocomplete-dropdown/multiple-autocomplete-dropdown.component';
import { inDropdownListValidator } from '../../../../../shared/directives/autocomplete-dropdown.directive';
import { Company } from '../../../../../shared/entities/company.entity';
import { Department } from '../../../../../shared/entities/department.entity';
import { MasterDataProps } from '../../../../../shared/entities/masterdata-props.entity';
import { MasterData } from '../../../../../shared/entities/masterdata.entity';
import { Profile } from '../../../../../shared/entities/profile.entity';
import { UserPermission } from '../../../../../shared/entities/user-permission.entity';
import { MasterdataService } from '../../../../../shared/services/http-services/masterdata.service';
import { SnackbarService } from '../../../../../shared/services/snackbar.service';
import { nameof } from '../../../../../shared/services/util.service';

@Component({
    selector: 'permission-line',
    templateUrl: './permission-line.component.html',
    styleUrls: ['./permission-line.component.scss'],
})
export class PermissionLineComponent implements OnInit {

    @Input() companies: Company[] = [];
    @Input() profiles: Profile[] = [];

    @Input() permission: UserPermission = new UserPermission();
    @Input() permissionList: UserPermission[] = [];
    @Input() isNew = false;
    @Input() isTrader = false;
    @Input() isCharterManager = false;
    @Input() gridApi: agGrid.GridApi;
    @ViewChild('multipleAutocompleteDropdownComponent') multipleAutocompleteDropdownComponent: MultipleAutocompleteDropdownComponent;
    @Output() readonly removePermissionEvent = new EventEmitter();

    // New component Input
    allOptionsElement: Department = {
        departmentId: 0,
        departmentCode: 'All',
        description: 'All',
        profitCenterId: 0,
        companyId: 0,
        companyCode: null,
    };

    fieldCtrl: FormControl;

    public permissionForm: FormGroup;
    companyCtrl: FormControl;
    profileCtrl: FormControl;
    departmentCtrl: FormControl;
    allDepartmentsCtrl: FormControl;
    filteredCompanies: Company[];
    filteredProfiles: any[];
    traderCtrl: FormControl;
    charterManagerCtrl: FormControl;
    departments: Department[] = [];

    constructor(private snackBarService: SnackbarService,
        private masterDataService: MasterdataService) {
    }

    ngOnInit() {
        this.fieldCtrl = new FormControl('', [Validators.required]);
        this.initForm();
        this.initDepartments(true);
    }

    initDepartments(isLoad = false) {
        if (this.permission.companyId != null) {
            this.masterDataService.getMasterData(
                [MasterDataProps.Departments],
                this.permission.companyId).subscribe((masterData: MasterData) => {
                    this.departments = masterData.departments;
                    this.multipleAutocompleteDropdownComponent.options = this.departments;
                    this.multipleAutocompleteDropdownComponent.optionsChanged();
                    if (isLoad) {
                        this.multipleAutocompleteDropdownComponent.selectedOptions = this.permission.departments;
                    }
                });
        }
    }

    initForm() {
        this.companyCtrl = new FormControl({ value: this.permission.companyId, disabled: !this.isNew }, [Validators.required]);
        this.profileCtrl = new FormControl({ value: this.permission.profileName }, [Validators.required]);
        this.departmentCtrl = new FormControl();
        this.allDepartmentsCtrl = new FormControl();
        this.traderCtrl = new FormControl();
        this.charterManagerCtrl = new FormControl();
        this.addValidators();

        this.permissionForm = new FormGroup({
            companyCtrl: this.companyCtrl,
            profileCtrl: this.profileCtrl,
            allDepartmentsCtrl: this.allDepartmentsCtrl,
            departmentCtrl: this.departmentCtrl,
            traderCtrl: this.traderCtrl,
            charterManagerCtrl: this.charterManagerCtrl,
        });

        this.permissionForm.patchValue({
            companyCtrl: this.permission.companyId,
            profileCtrl: this.permission.profileName,
            traderCtrl: this.permission.isTrader,
            charterManagerCtrl: this.permission.isCharterManager,
        });
        this.initAutocomplete();
        this.companyCtrl.valueChanges.subscribe((company) => {
            this.filteredCompanies = this.getAvailableCompanies().filter((c: Company) => c.companyId.startsWith(company));
            this.permission.companyId = company;
            this.initDepartments();
        });
        this.profileCtrl.valueChanges.subscribe((profile) => {
            this.filteredProfiles = this.profiles.filter((p: any) => p.name.startsWith(profile));
        });
    }

    addValidators() {
        this.companyCtrl.setValidators(Validators.compose([Validators.required,
        inDropdownListValidator(this.companies, nameof<Company>('companyId'))]));
        this.profileCtrl.setValidators(Validators.compose([Validators.required,
        inDropdownListValidator(this.profiles, nameof<Profile>('name'))]));
    }

    initAutocomplete() {
        this.filteredCompanies = this.getAvailableCompanies(this.permission.companyId);
        this.filteredProfiles = this.profiles
            .filter((p) => this.profileCtrl.value == null || p.name.startsWith(this.profileCtrl.value));
        this.isTrader = this.isTrader;
        this.isCharterManager = this.isCharterManager;
    }

    getAvailableCompanies(company: string = ''): Company[] {
        const companiesUsed = this.permissionList.map((p) => p.companyId).filter((c) => c !== company);
        return this.companies.filter((c) => companiesUsed.indexOf(c.companyId) === -1);
    }

    addPermission() {
        if ((this.multipleAutocompleteDropdownComponent.selectedOptions.length > 0 ||
            this.multipleAutocompleteDropdownComponent.allSelected) && this.permissionForm.valid
            && this.getAvailableCompanies().filter((c) => c.companyId === this.companyCtrl.value).length > 0) {
            const newPermission = new UserPermission();
            newPermission.companyId = this.companyCtrl.value;
            newPermission.profileName = this.profileCtrl.value;
            newPermission.allDepartments = this.multipleAutocompleteDropdownComponent.allSelected;

            if (this.multipleAutocompleteDropdownComponent.allSelected) {
                newPermission.departments = this.departments;
            } else {
                newPermission.departments = this.multipleAutocompleteDropdownComponent.getSelectedOptions();
            }

            const profileSelected = this.profiles.find((profile) => profile.name === newPermission.profileName);
            newPermission.profileId = profileSelected ? profileSelected.profileId : null;

            newPermission.isTrader = this.traderCtrl.value ? true : false;
            newPermission.isCharterManager = this.charterManagerCtrl.value ? true : false;

            this.permissionList.push(newPermission);

            this.multipleAutocompleteDropdownComponent.resetComponent();

            this.permissionForm.reset();
            this.initAutocomplete();

            this.gridApi.updateRowData({ add: [newPermission] });
        } else {
            this.snackBarService.throwErrorSnackBar('This permission is not valid');
        }
    }

    removePermission() {
        this.removePermissionEvent.emit(this.companyCtrl.value);
    }
}
