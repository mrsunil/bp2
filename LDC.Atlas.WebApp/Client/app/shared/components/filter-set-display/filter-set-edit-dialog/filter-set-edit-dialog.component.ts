import { Component, Inject, OnInit, HostListener } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ListAndSearchFilterDto } from './../../../dtos/list-and-search/list-and-search-filter-dto.dto';
import { ListAndSearchUserFilterSetDto } from './../../../dtos/list-and-search/user-filter-set-dto.dto';
import { ListAndSearchFilter } from './../../../entities/list-and-search/list-and-search-filter.entity';
import { GridConfigurationService } from './../../../services/http-services/grid-configuration.service';
import { SnackbarService } from './../../../services/snackbar.service';
import { ConfirmationDialogComponent } from './../../confirmation-dialog/confirmation-dialog.component';

@Component({
    selector: 'atlas-filter-set-edit-dialog',
    templateUrl: './filter-set-edit-dialog.component.html',
    styleUrls: ['./filter-set-edit-dialog.component.scss'],
})
export class FilterSetEditDialogComponent implements OnInit {

    filterSet: ListAndSearchUserFilterSetDto = new ListAndSearchUserFilterSetDto();
    filterSetList: ListAndSearchUserFilterSetDto[];
    chipStringList: string[];
    localFilters: ListAndSearchFilter[];
    gridCode: string;
    company: string;
    filterSetNameCtrl: FormControl;
    shareWithCompanyCtrl: FormControl;
    shareWithAllCompaniesCtrl: FormControl;
    formGroup: FormGroup;
    isLoading = false;
    onlyShareOptions = false;
    warningMessageAllUsers: string;
    warningMessageAllCompanies: string;
    warningMessageGeneric: string;
    unsharedForUsers = false;
    unsharedForCompanies = false;

    constructor(
        public dialogRef: MatDialogRef<FilterSetEditDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: {
            company: string;
            gridCode: string;
            filterSet: ListAndSearchUserFilterSetDto,
            filterSetList: ListAndSearchUserFilterSetDto[],
            chipStringList: string[],
            localFilters: ListAndSearchFilter[],
            onlyShareOptions: boolean,
        },
        protected gridConfigurationService: GridConfigurationService,
        protected snackbarService: SnackbarService,
        protected formBuilder: FormBuilder,
        protected dialog: MatDialog,
    ) {
        this.filterSet = data.filterSet;
        this.filterSetList = data.filterSetList;
        this.chipStringList = data.chipStringList;
        this.gridCode = data.gridCode;
        this.company = data.company;
        this.localFilters = data.localFilters;
        this.onlyShareOptions = data.onlyShareOptions ? data.onlyShareOptions : false;
    }

    ngOnInit() {
        this.initForm();
    }

    initForm() {
        if (!this.filterSet.isDefault) {
            this.filterSetNameCtrl = new FormControl(this.filterSet.name, Validators.required);
            this.shareWithCompanyCtrl = new FormControl(this.filterSet.isSharedWithAllUsers);
            this.shareWithAllCompaniesCtrl = new FormControl(this.filterSet.isSharedWithAllCompanies);
        } else {
            this.filterSetNameCtrl = new FormControl('', Validators.required);
            this.shareWithCompanyCtrl = new FormControl(false);
            this.shareWithAllCompaniesCtrl = new FormControl(false);
        }
        this.formGroup = this.formBuilder.group({
            filterSetNameCtrl: this.filterSetNameCtrl,
            shareWithCompanyCtrl: this.shareWithCompanyCtrl,
            shareWithAllCompaniesCtrl: this.shareWithAllCompaniesCtrl,
        });
        this.onNameOrSharingOptionChanged();
    }

    @HostListener('window:beforeunload', ['$event'])
    unloadNotification($event: any) {
        if (this.formGroup.dirty) {
            $event.returnValue = true;
        }
    }


    getFilterSetFromForm(): ListAndSearchUserFilterSetDto {
        const filterSet = new ListAndSearchUserFilterSetDto();
        filterSet.companyId = this.company;
        filterSet.filters = this.localFilters.map((filter: ListAndSearchFilter) => new ListAndSearchFilterDto(filter));
        filterSet.isSharedWithAllCompanies = this.shareWithAllCompaniesCtrl.value ? this.shareWithAllCompaniesCtrl.value : false;
        filterSet.isSharedWithAllUsers = this.shareWithCompanyCtrl.value ? this.shareWithCompanyCtrl.value : false;
        filterSet.name = this.filterSetNameCtrl.value;
        filterSet.gridCode = this.gridCode;
        return filterSet;
    }

    onSaveButtonClicked() {
        if (this.formGroup.valid) {
            this.isLoading = true;
            const filterSet: ListAndSearchUserFilterSetDto = this.getFilterSetFromForm();
            filterSet.filterSetId = this.filterSet.filterSetId;

            this.gridConfigurationService.updateUserFilterSet(this.gridCode, filterSet).subscribe(
                () => {
                    this.snackbarService.informationSnackBar('Filter Set Updated');
                    this.dialogRef.close(filterSet.filterSetId);
                },
                (err) => {
                    this.isLoading = false;
                    this.dialogRef.close();
                    throw err;
                });
        } else {
            this.snackbarService.throwErrorSnackBar('Please resolve errors');
        }
    }

    onSaveAsNewButtonClicked() {
        if (this.formGroup.valid) {
            this.isLoading = true;
            const filterSet: ListAndSearchUserFilterSetDto = this.getFilterSetFromForm();

            if (this.filterSetList.find((filter) => filter.name === filterSet.name
                && filter.isSharedWithAllCompanies === filterSet.isSharedWithAllCompanies
                && filter.isSharedWithAllUsers === filterSet.isSharedWithAllUsers)) {
                const confirmDialog = this.dialog.open(ConfirmationDialogComponent, {
                    data: {
                        title: 'Filter Set Creation',
                        text: 'A set of filters with the same name already exists for this user(s)/company(ies). '
                            + 'If you continue, there will be a duplicate.',
                        okButton: 'Continue',
                        cancelButton: 'Cancel',
                    },
                });
                confirmDialog.afterClosed().subscribe((answer) => {
                    if (answer) {
                        this.createFilterSet(filterSet);
                    } else {
                        this.isLoading = false;
                    }
                });
            } else {
                this.createFilterSet(filterSet);
            }
        } else {
            this.snackbarService.throwErrorSnackBar('Please resolve errors');
        }
    }

    createFilterSet(filterSet: ListAndSearchUserFilterSetDto) {
        this.gridConfigurationService.createUserFilterSet(this.gridCode, filterSet).subscribe(
            (filterSetId) => {
                this.snackbarService.informationSnackBar('Filter Set Created');
                this.dialogRef.close(filterSetId);
            },
            (err) => {
                this.isLoading = false;
                this.dialogRef.close();
                throw err;
            });
    }

    onNameOrSharingOptionChanged() {
        const filtersWithSameName = this.filterSetList ? this.filterSetList.filter((filter) => filter.name === this.filterSetNameCtrl.value
            && filter.filterSetId !== this.filterSet.filterSetId) : [];
        this.warningMessageGeneric = null;
        this.warningMessageAllCompanies = null;
        this.warningMessageAllUsers = null;

        if (filtersWithSameName.length > 0) {
            const filterDuplicate = filtersWithSameName.filter((filter) => filter.isSharedWithAllUsers === this.shareWithCompanyCtrl.value
                && filter.isSharedWithAllCompanies === this.shareWithAllCompaniesCtrl.value);
            if (filterDuplicate.filter((filter) => filter.isSharedWithAllUsers && filter.isSharedWithAllCompanies).length > 0) {
                this.warningMessageGeneric = '"' + this.filterSetNameCtrl.value + '" already exists for all users and all companies';
            } else if (filterDuplicate.filter((filter) => !filter.isSharedWithAllUsers && filter.isSharedWithAllCompanies).length > 0) {
                this.warningMessageGeneric = '"' + this.filterSetNameCtrl.value + '" already exists for all companies';
            } else if (filterDuplicate.filter((filter) => filter.isSharedWithAllUsers && !filter.isSharedWithAllCompanies).length > 0) {
                this.warningMessageGeneric = '"' + this.filterSetNameCtrl.value + '" already exists for all users';
            }
        }
    }

    onShareAllCompaniesChanged() {
        if (!this.shareWithAllCompaniesCtrl.value) {
            this.unsharedForCompanies = true;
        }
        this.onNameOrSharingOptionChanged();
    }

    onShareAllUsersChanged() {
        if (!this.shareWithCompanyCtrl.value) {
            this.unsharedForUsers = true;
        }
        this.onNameOrSharingOptionChanged();
    }
}
