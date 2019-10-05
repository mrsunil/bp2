import { Component, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog, MatSidenav } from '@angular/material';
import { Subscription } from 'rxjs';
import { AuthorizationService } from '../../../core/services/authorization.service';
import { ListAndSearchFilterDto } from '../../dtos/list-and-search/list-and-search-filter-dto.dto';
import { ListAndSearchUserFilterSetDto } from '../../dtos/list-and-search/user-filter-set-dto.dto';
import { AtlasFormControl } from '../../entities/atlas-form-control';
import { ColumnConfigurationProperties } from '../../entities/grid-column-configuration.entity';
import { ListAndSearchFilter } from '../../entities/list-and-search/list-and-search-filter.entity';
import { FilterProviderService } from '../../services/filter-provider.service';
import { FilterService } from '../../services/filter-service.service';
import { GridConfigurationService } from '../../services/http-services/grid-configuration.service';
import { SnackbarService } from '../../services/snackbar.service';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { FilterSetEditorComponent } from '../filter-set-editor/filter-set-editor.component';
import { FilterSetEditDialogComponent } from './filter-set-edit-dialog/filter-set-edit-dialog.component';

@Component({
    selector: 'atlas-filter-set-display',
    templateUrl: './filter-set-display.component.html',
    styleUrls: ['./filter-set-display.component.scss'],
})
export class FilterSetDisplayComponent implements OnInit, OnDestroy {

    @Input() gridCode: string;
    @Input() columnConfiguration: ColumnConfigurationProperties[];
    @Input() company: string;

    @Input() savingEnabled = true;
    @Input() favouriteMenuEnabled = true;
    @Input() deleteEnabled = true;
    @Input() shareEnabled = true;
    @Input() searchCode: string = null;

    @Output() readonly filtersChanged = new EventEmitter<ListAndSearchFilter[]>();

    @ViewChild('filterSetEditorSideNav') filterSetEditorSideNav: MatSidenav;
    @ViewChild('filterSetEditor') filterSetEditorComponent: FilterSetEditorComponent;

    filterSets: ListAndSearchUserFilterSetDto[];
    chipStringList: string[];
    filterSetCtrl = new AtlasFormControl('FilterSet');
    selectedFilterSet: ListAndSearchUserFilterSetDto;
    localFilters: ListAndSearchFilter[];
    ifAdministrator = false;
    filterSetFocus = false;
    tradeReportListGridCode: string = 'tradeReportList';

    getUserFilterSetsSubscription: Subscription;

    constructor(protected filterService: FilterService,
        protected snackBarService: SnackbarService,
        protected gridConfiguration: GridConfigurationService,
        protected filterProvider: FilterProviderService,
        protected dialog: MatDialog,
        protected authorizationService: AuthorizationService,
    ) { }

    ngOnInit() {
        this.initFilterSets();
        this.checkIfAdministrator();
    }

    @HostListener('window:beforeunload', ['$event']) unloadNotification($event: any) {
        if (this.filterSetCtrl.dirty) {
            $event.returnValue = true;
        }
    }

    ngOnDestroy() {
        this.getUserFilterSetsSubscription.unsubscribe();
    }

    initFilterSets() {
        this.getUserFilterSetsSubscription = this.gridConfiguration
            .getUserFilterSets(this.gridCode)
            .subscribe((filterSets) => {
                this.filterSets = filterSets.value;

                // normally we're suppose to have at least a company default. If not the case, it's a system issue
                this.selectedFilterSet = this.filterSets.find((filterSet: ListAndSearchUserFilterSetDto) => filterSet.isUserDefault);
                if (!this.selectedFilterSet) {
                    this.selectedFilterSet = this.filterSets.find((filterSet: ListAndSearchUserFilterSetDto) => filterSet.isDefault);
                }
                this.filterSetCtrl.patchValue(this.selectedFilterSet);
                if (this.selectedFilterSet) {
                    this.loadFilterDetails(this.selectedFilterSet.filterSetId);
                } else {
                    this.selectedFilterSet = new ListAndSearchUserFilterSetDto();
                    this.loadFilters([]);
                }
            });
    }

    loadFilterDetails(filterSetId: number, forceRefresh = false) {
        this.filterProvider.getFilters(this.company, this.gridCode, filterSetId, forceRefresh)
            .subscribe((filters: ListAndSearchFilterDto[]) => {
                this.selectedFilterSet.isModified = false;
                if (this.searchCode && this.gridCode === this.tradeReportListGridCode) {
                    filters[0].operator = 'in';
                    filters[0].value1 = this.searchCode;
                }
                this.loadFilters(filters);
            });
    }

    loadFilters(filters: ListAndSearchFilterDto[]) {
        const localFilters: ListAndSearchFilter[] = filters.map((filter: ListAndSearchFilterDto) => {
            return new ListAndSearchFilter(filter);
        });

        const appliedFilters = localFilters ? localFilters.filter((filter: ListAndSearchFilter) => {
            return filter.isActive === true;
        }) : [];

        this.chipStringList = [];

        appliedFilters.forEach((filter: ListAndSearchFilter) => {
            this.chipStringList.push(this.filterService.getFilterCompleteStringValue(filter));
        });
        this.localFilters = localFilters;

        this.filtersChanged.emit(appliedFilters);
    }

    onSaveFiltersButtonClicked() {
        const saveDialog = this.dialog.open(FilterSetEditDialogComponent, {
            width: '30%',
            minWidth: '500px',
            data: {
                company: this.company,
                gridCode: this.gridCode,
                filterSet: this.selectedFilterSet,
                filterSetList: this.filterSets,
                chipStringList: this.chipStringList,
                localFilters: this.localFilters ? this.localFilters.filter((filter) => filter.isActive) : [],
                onlyShareOptions: false,
            },
        });
        saveDialog.afterClosed().subscribe((answer) => {
            if (answer) {
                this.getUserFilterSetsSubscription = this.gridConfiguration
                    .getUserFilterSets(this.gridCode)
                    .subscribe((filterSets) => {
                        this.filterSets = filterSets.value;
                        this.selectedFilterSet = this.filterSets.find((filter) => filter.filterSetId === answer);
                        this.filterSetCtrl.patchValue(this.selectedFilterSet);
                        this.loadFilterDetails(this.selectedFilterSet.filterSetId, true);
                    });
            }
        });
    }

    onShareFiltersButtonClicked() {
        if (this.selectedFilterSet.isModified) {
            this.dialog.open(ConfirmationDialogComponent, {
                data: {
                    text: 'Please save before share',
                    okButton: 'Ok',
                },
            });
        } else {
            const saveDialog = this.dialog.open(FilterSetEditDialogComponent, {
                width: '30%',
                minWidth: '500px',
                data: {
                    company: this.company,
                    gridCode: this.gridCode,
                    filterSet: this.selectedFilterSet,
                    filterSetList: this.filterSets,
                    chipStringList: this.chipStringList,
                    localFilters: this.localFilters ? this.localFilters.filter((filter) => filter.isActive) : [],
                    onlyShareOptions: true,
                },
            });
            saveDialog.afterClosed().subscribe((answer) => {
                if (answer) {
                    this.getUserFilterSetsSubscription = this.gridConfiguration
                        .getUserFilterSets(this.gridCode)
                        .subscribe((filterSets) => {
                            this.filterSets = filterSets.value;
                            this.selectedFilterSet = this.filterSets.find((filter) => filter.filterSetId === answer);
                            this.filterSetCtrl.patchValue(this.selectedFilterSet);
                            this.loadFilterDetails(this.selectedFilterSet.filterSetId, true);
                        });
                }
            });
        }
    }

    onDeleteFiltersButtonClicked() {
        if (!this.selectedFilterSet) {
            this.dialog.open(ConfirmationDialogComponent, {
                data: {
                    text: 'Please select a filter set',
                    okButton: 'Ok',
                },
            });
        } else {
            const confirmDialog = this.dialog.open(ConfirmationDialogComponent, {
                data: {
                    title: 'Filter Set Deletion',
                    text: (this.selectedFilterSet.isDefault ?
                        'This filter set is the one by default, deleting it will affect all users. ' : '')
                        + 'Deleting a set is permanent. All your criteria for this set will be forgotten. '
                        + 'It will be unavailable for all the users it was shared to',
                    okButton: 'Delete anyway',
                    cancelButton: 'Cancel',
                },
            });
            confirmDialog.afterClosed().subscribe((answer) => {
                if (answer) {
                    this.gridConfiguration.deleteUserFilterSet(this.gridCode, this.selectedFilterSet.filterSetId).subscribe(() => {
                        this.snackBarService.informationSnackBar('The filter set was deleted');
                        this.initFilterSets();
                    });
                }
            });
        }
    }

    onSetAsFavoriteButtonClicked() {
        if (this.selectedFilterSet.isModified) {
            this.dialog.open(ConfirmationDialogComponent, {
                data: {
                    text: 'Please save before changing this filter as your favorite',
                    okButton: 'Ok',
                },
            });
        } else {
            this.gridConfiguration.setFavoriteUserFilterSet(this.gridCode, this.selectedFilterSet.filterSetId).subscribe(() => {
                this.snackBarService.informationSnackBar('The filter set has been saved as favorite');
                this.initFilterSets();
            });
        }

    }

    onApplyFilters(filters: ListAndSearchFilter[]) {
        this.filterSetEditorSideNav.close();
        const appliedFilters = this.loadFilterSet(filters, this.filterSetEditorComponent.filtersHaveBeenChanged);
        this.filtersChanged.emit(appliedFilters);
    }

    onFilterSetSelectionChange() {
        let selectedFilterSet = this.filterSetCtrl.value as ListAndSearchUserFilterSetDto;
        if (typeof this.filterSetCtrl.value === 'string') {
            selectedFilterSet = this.filterSets.find((filter) => filter.name === this.filterSetCtrl.value);
        }
        if (selectedFilterSet) {
            this.chipStringList = null;
            this.selectedFilterSet = selectedFilterSet;
            this.loadFilterDetails(this.selectedFilterSet.filterSetId);
        } else {
            this.filterSetCtrl.setValue(this.selectedFilterSet);
        }
    }

    onEditFilterSetButtonClicked() {
        this.filterSetEditorComponent.readyFilterSetEditor(this.columnConfiguration, this.localFilters);
        this.filterSetEditorComponent.filtersHaveBeenChanged = this.selectedFilterSet.isModified;
        this.filterSetEditorSideNav.open();
    }

    checkIfFavorite(): boolean {
        if ((this.selectedFilterSet) && this.selectedFilterSet.isUserDefault) {
            return true;
        }

        if (this.selectedFilterSet && this.selectedFilterSet.isDefault
            && this.filterSets && this.filterSets.filter((filter) => filter.isUserDefault).length === 0) {
            return true;
        }

        return false;
    }

    getIcon(filterSet: ListAndSearchUserFilterSetDto): string {
        if (filterSet.isSharedWithAllCompanies && filterSet.isSharedWithAllUsers) {
            return 'public';
        } else if (filterSet.isSharedWithAllCompanies) {
            return 'domain';
        } else if (filterSet.isSharedWithAllUsers) {
            return 'people';
        } else {
            return 'person';
        }
    }

    displayFilterSetSelection(filterSet: ListAndSearchUserFilterSetDto) {
        return filterSet ? filterSet.name : '';
    }

    checkIfAdministrator() {
        const companyPermission = this.authorizationService.user.permissions.find((permission) => permission.companyId === this.company);
        if (companyPermission) {
            if (companyPermission.profileName === 'Administrator') {
                this.ifAdministrator = true;
            }
        }
    }

    loadFilterSet(filters: ListAndSearchFilter[], filterSetChanged?: boolean): ListAndSearchFilter[] {
        this.selectedFilterSet.isModified = (filterSetChanged !== undefined) ? filterSetChanged : true;

        this.localFilters = filters ? filters : [];
        const appliedFilters = this.localFilters.filter((filter: ListAndSearchFilter) => {
            return filter.isActive === true;
        });

        this.chipStringList = [];

        appliedFilters.forEach((filter: ListAndSearchFilter) => {
            this.chipStringList.push(this.filterService.getFilterCompleteStringValue(filter));
        });

        return appliedFilters;
    }
}
