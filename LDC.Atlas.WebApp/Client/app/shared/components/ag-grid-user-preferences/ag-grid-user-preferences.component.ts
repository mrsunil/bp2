import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material';
import * as agGrid from 'ag-grid-community';
import { ColumnState } from 'ag-grid-community/dist/lib/columnController/columnController';
import { Subject, Subscription } from 'rxjs';
import { finalize, map, takeUntil } from 'rxjs/operators';
import { AuthorizationService } from '../../../core/services/authorization.service';
import { UserGridViewDto } from '../../dtos/user-grid-view-dto.dto';
import { AtlasFormControl } from '../../entities/atlas-form-control';
import { AgGridService } from '../../services/ag-grid.service';
import { GridConfigurationService } from '../../services/http-services/grid-configuration.service';
import { SecurityService } from '../../services/security.service';
import { SnackbarService } from '../../services/snackbar.service';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { GridViewSaveDialogComponent } from './grid-view-save-dialog/grid-view-save-dialog.component';
@Component({
    selector: 'atlas-ag-grid-user-preferences',
    templateUrl: './ag-grid-user-preferences.component.html',
    styleUrls: ['./ag-grid-user-preferences.component.scss'],
    providers: [DatePipe],
})
export class AgGridUserPreferencesComponent implements OnInit, OnDestroy {

    // If inputs change, please also change the UserGridPreferencesParameters class
    @Input() gridOptions: agGrid.GridOptions;
    @Input() company: string;
    @Input() gridId: string;
    @Input() savingEnabled = true;
    @Input() sharingEnabled = false;
    @Input() favouriteMenuEnabled = true;
    @Input() isAutosize = true;
    @Input() hasDeleteViewPrivilege = true;
    @Input() hasColumnHandling = true;
    @Input() showExport = true;
    @Input() isSetColumnStateEnabled: boolean = true;
    @Input() defaultViewIsLatestView = false;

    @Input() isCustomExportEnabled: boolean = false;
    @Input() isCsvExportEnabled: boolean = true;
    @Output() readonly exportClicked = new EventEmitter<boolean>();

    // exploited by gridEnlargement
    // this is used to avoid calling API to get the list of gridViews onInit
    // loading grdViews can be also done by calling the function loadGridViews
    @Input() loadOnInit = true;
    // to be called when we are sure the component is done loading (so after data load)
    @Output() readonly componentLoaded = new EventEmitter();
    @Output() readonly gridViewSelected = new EventEmitter();
    // If you need to override some columns when the gridCode is shared by 2 pages with different behaviors, use columnStateSetToGrid
    @Output() readonly columnStateSetToGrid = new EventEmitter();

    destroy$ = new Subject();

    columnDefs: agGrid.ColDef[];
    savedColumnStates: ColumnState[];
    getUserPreferenceColumnSubscription: Subscription;
    currentColumnState: agGrid.ColDef[];
    userActiveDirectoryName: string;

    gridViewCtrl = new AtlasFormControl('GridViewTitle');
    userGridViews: UserGridViewDto[];
    filteredUserGridViews: UserGridViewDto[];
    gridViewFocus: boolean = false;
    columnsChanged: boolean = false;

    isOwner = false;
    isAdmin = false;

    constructor(
        private gridConfigurationService: GridConfigurationService,
        private securityService: SecurityService,
        protected dialog: MatDialog,
        protected snackbarService: SnackbarService,
        private authorizationService: AuthorizationService,
        private datePipe: DatePipe,
        private agGridService: AgGridService,
        private cdr: ChangeDetectorRef, ) {
        this.userActiveDirectoryName = this.authorizationService.getCurrentUser().samAccountName;
    }

    ngOnInit() {

        this.securityService.isSecurityReady().subscribe(() => {
            this.isAdmin = this.authorizationService.isAdministrator(this.company);
            // remove headerName:'' from the column list of available column to remove (i.e. action column, thickbox column...)
            const filteredColumns = this.gridOptions.columnDefs.filter((colDef) => colDef.headerName !== '');
            this.columnDefs = filteredColumns;
            this.initFavoriteColumns();
        });
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    @HostListener('window:beforeunload', ['$event']) unloadNotification($event: any) {
        if (this.columnsChanged) {
            $event.returnValue = true;
        }
    }

    loadGridViews(userGridViews: UserGridViewDto[], defaultGridViewId: number = null, applyGridView: boolean = true) {
        this.userGridViews = userGridViews;
        this.filteredUserGridViews = this.userGridViews;

        // Order the views
        if (this.userGridViews && this.userGridViews.length > 1) {
            this.filteredUserGridViews = [];
            this.filteredUserGridViews = this.userGridViews.filter((defaultview) => defaultview.isDefault === true)
                .sort((a, b) => a.name.localeCompare(b.name));
            this.filteredUserGridViews.concat(
                this.userGridViews.filter((defaultview) => defaultview.isDefault === false)
                    .sort((a, b) => a.name.localeCompare(b.name)),
            );
        }

        this.gridViewCtrl.patchValue(new UserGridViewDto());
        this.savedColumnStates = this.gridOptions.columnApi ? this.gridOptions.columnApi.getColumnState() : [];
        if (this.userGridViews && this.userGridViews.length > 0 && applyGridView) {
            this.initDefaultGridView(defaultGridViewId);
        }

        this.updateCurrentColumnState();
        this.loadOnInit = true;
        this.cdr.detectChanges();
    }

    getLoadedGridViews(): UserGridViewDto[] {
        return this.userGridViews;
    }

    initFavoriteColumns(defaultId: number = null) {
        if (this.loadOnInit) {

            this.gridConfigurationService
                .getUserGridViews(this.gridId)
                .pipe(
                    takeUntil(this.destroy$),
                    map((params) => {
                        return params ? params.value : null;
                    }))
                .subscribe(
                    (userGridViews) => {
                        this.loadGridViews(userGridViews, defaultId);
                    },
                    (err: HttpErrorResponse) => {
                        if (err.status === 403) {
                            this.snackbarService.throwErrorSnackBar(err.message);
                            this.gridViewCtrl.patchValue(new UserGridViewDto());
                            this.savedColumnStates = this.gridOptions.columnApi ? this.gridOptions.columnApi.getColumnState() : [];

                            this.updateCurrentColumnState();
                        } else {
                            throw (err);
                        }
                    },
                    () => { this.componentLoaded.emit(); },
                );
        }
        else {
            this.componentLoaded.emit();
        }

        this.gridViewCtrl.valueChanges.subscribe((input) => {
            if (typeof input === 'string') {
                this.filteredUserGridViews = this.userGridViews.filter((view) => {
                    return view.name.toLocaleLowerCase().startsWith(input.toLocaleLowerCase());
                });
            }
        });
    }

    initDefaultGridView(defaultId: number) {
        if (defaultId) {
            this.gridViewCtrl.patchValue(
                this.userGridViews.find((gridView) => gridView.gridViewId === defaultId),
            );
        } else {
            // look if there is a default
            let userFavorite: UserGridViewDto[] = this.userGridViews.filter((gridView) => {
                return gridView.isFavorite;
            });
            if (userFavorite.length > 0) {
                this.gridViewCtrl.patchValue(userFavorite[0]);
            } else {
                const nonDefaultView = this.userGridViews.filter((gridView) => gridView.isDefault === false);
                if (nonDefaultView.length > 0 && this.defaultViewIsLatestView) {
                    userFavorite = nonDefaultView.sort((gridViewA, gridViewB) => {
                        return gridViewB.gridViewId - gridViewA.gridViewId;
                    });
                } else {
                    userFavorite = this.userGridViews.filter((gridView) => {
                        return gridView.isDefault;
                    });
                }

                if (userFavorite.length > 0) {
                    this.gridViewCtrl.patchValue(userFavorite[0]);
                } else {
                    this.gridViewCtrl.patchValue(this.userGridViews[0]);
                }
            }
        }
        const defaultGridView: UserGridViewDto = this.gridViewCtrl.value;
        // if there is a default
        if (defaultGridView && defaultGridView.gridViewColumnConfig) {
            this.savedColumnStates = JSON.parse(defaultGridView.gridViewColumnConfig);
            this.gridViewSelected.emit(defaultGridView.gridViewId);
        } else {
            this.savedColumnStates = this.gridOptions.columnApi ? this.gridOptions.columnApi.getColumnState() : [];
        }
        if (this.isSetColumnStateEnabled) {
            this.gridOptions.columnApi.setColumnState(this.savedColumnStates);
            this.columnStateSetToGrid.emit();
        } else {
            this.loadColumnsOnDetailMode();
        }
    }

    loadGridView(gridViewId: number, applyGridView: boolean = true) {
        const selectedGridView = this.userGridViews.find((gridView) => gridView.gridViewId === gridViewId);
        if (selectedGridView) {
            this.gridViewCtrl.patchValue(selectedGridView);

            if (applyGridView) {
                this.savedColumnStates = JSON.parse(selectedGridView.gridViewColumnConfig);
                this.updateCurrentColumnState();
            }
        }
        this.cdr.detectChanges();
    }

    getCurrentGridView(): UserGridViewDto {
        if ((this.gridViewCtrl.value as UserGridViewDto).gridViewId) {
            return this.gridViewCtrl.value as UserGridViewDto;
        }
        return null;
    }

    onShowOrHideColumCheckboxClicked(event, col: agGrid.ColDef) {
        const columnStates = this.gridOptions.columnApi ? this.gridOptions.columnApi.getColumnState() : [];

        if (columnStates.find((column) => column.colId === 'ag-Grid-AutoColumn-' + col.colId)) { // column is grouped
            this.snackbarService.informationSnackBar('You cannot hide a column that is used for grouping');
            col.hide = !col.hide;
            return;
        }
        this.columnsChanged = true;
        this.gridOptions.columnApi.setColumnVisible(col.colId, (col.hide || false));
        this.gridOptions.columnApi.moveColumns([col.colId], this.columnDefs.length - 1);
        this.agGridService.sizeColumns(this.gridOptions);
        event.stopPropagation();
        return false;
    }

    onSaveGridViewButtonClicked() {
        if (!this.gridViewCtrl.value || !this.gridViewCtrl.value.gridViewId || this.gridViewCtrl.value.gridViewId === 0) {
            // New grid view
            this.gridViewCtrl.patchValue(new UserGridViewDto());
        }
        const saveDialog = this.dialog.open(GridViewSaveDialogComponent, {
            width: '30%',
            minWidth: '500px',
            data: {
                company: this.company,
                gridCode: this.gridId,
                gridView: this.gridViewCtrl.value,
                gridViewList: this.userGridViews,
            },
        });
        saveDialog.afterClosed().subscribe((answer) => {
            if (answer > -1) {
                (this.gridViewCtrl.value as UserGridViewDto).gridViewColumnConfig = JSON.stringify(this.gridOptions.columnApi ?
                    this.gridOptions.columnApi.getColumnState() :
                    []);

                const action = (answer === 0) ?
                    this.gridConfigurationService.createUserGridViews(this.gridId, (this.gridViewCtrl.value as UserGridViewDto)) :
                    this.gridConfigurationService.updateUserGridViews(this.gridId, (this.gridViewCtrl.value as UserGridViewDto));
                action
                    .pipe(
                        finalize(() => {
                            this.columnsChanged = false;
                        }),
                    )
                    .subscribe((gridViewId) => {
                        // reload grid view list
                        const selectedId = (gridViewId !== null && gridViewId !== undefined) ?
                            gridViewId : (this.gridViewCtrl.value as UserGridViewDto).gridViewId;
                        this.snackbarService.informationSnackBar('View Succesfully created');

                        this.initFavoriteColumns(selectedId);
                    });
            }
        });
    }

    onDeleteGridViewButtonClicked() {
        const gridView = (this.gridViewCtrl.value as UserGridViewDto);
        if (!gridView) {
            this.dialog.open(ConfirmationDialogComponent, {
                data: {
                    text: 'Please select a grid view',
                    okButton: 'Ok',
                },
            });
        } else {
            const confirmDialog = this.dialog.open(ConfirmationDialogComponent, {
                data: {
                    title: 'View Deletion',
                    text: 'Deleting a view is Permanent. It will be unavailable for all users it was shared to.',
                    okButton: 'Delete anyway',
                    cancelButton: 'Cancel',
                },
            });
            confirmDialog.afterClosed().subscribe((answer) => {
                if (answer) {
                    this.gridConfigurationService.deleteUserGridViews(this.gridId, gridView.gridViewId)
                        .subscribe(
                            (res) => {
                                this.snackbarService.informationSnackBar('View Succesfully deleted');
                                this.initFavoriteColumns();
                            },
                            (err: HttpErrorResponse) => {
                                if (err.status === 403) {
                                    this.snackbarService.throwErrorSnackBar(err.message);
                                } else {
                                    throw (err);
                                }
                            });
                }
            });
        }
    }

    onGridViewSelectionChange(selectedGridView: UserGridViewDto) {
        if (selectedGridView && selectedGridView.gridViewColumnConfig) {
            this.savedColumnStates = JSON.parse(selectedGridView.gridViewColumnConfig);
            if (this.isSetColumnStateEnabled) {
                this.gridOptions.columnApi.setColumnState(this.savedColumnStates);
                this.columnStateSetToGrid.emit();
            } else {
                this.loadColumnsOnDetailMode();
            }
            this.updateCurrentColumnState();
            this.agGridService.sizeColumns(this.gridOptions);
            this.gridViewSelected.emit(selectedGridView.gridViewId);
        }
    }

    getIcon(gridView: UserGridViewDto): string {
        if (gridView.isSharedWithAllCompanies && gridView.isSharedWithAllUsers) {
            return 'public';
        } else if (gridView.isSharedWithAllCompanies) {
            return 'domain';
        } else if (gridView.isSharedWithAllUsers) {
            return 'people';
        } else {
            return 'person';
        }
    }

    onResetButtonClicked() {
        if (this.savedColumnStates && this.isSetColumnStateEnabled) {
            this.gridOptions.columnApi.setColumnState(this.savedColumnStates);
            this.columnStateSetToGrid.emit();
        } else {
            this.loadColumnsOnDetailMode();
        }
        this.updateCurrentColumnState();
        this.agGridService.sizeColumns(this.gridOptions);
    }

    onChangeColumnVisibility(col: agGrid.ColDef) {
        this.updateCurrentColumnState();
    }

    onSetGridViewAsFavoriteButtonClicked() {
        (this.gridViewCtrl.value as UserGridViewDto).gridViewColumnConfig = JSON.stringify(this.gridOptions.columnApi ?
            this.gridOptions.columnApi.getColumnState() :
            []);
        this.gridConfigurationService.setFavoriteUserGridViews(this.gridId, (this.gridViewCtrl.value as UserGridViewDto))
            .subscribe(
                (response) => {
                    // display snakbar to say it has been updated
                    this.snackbarService.informationSnackBar('View Succesfully updated');

                    this.initFavoriteColumns();
                },
                (err: HttpErrorResponse) => {
                    if (err.status === 403) {
                        this.snackbarService.throwErrorSnackBar(err.message);

                    } else {
                        throw (err);
                    }
                });
    }

    displayGridViewName(gridView?: UserGridViewDto) {
        return gridView ? gridView.name : '';
    }

    updateCurrentColumnState() {
        if (!this.gridOptions || !this.gridOptions.columnApi) {
            this.currentColumnState = [];
        }
        const columnStates = this.gridOptions.columnApi ? this.gridOptions.columnApi.getColumnState() : [];

        this.currentColumnState = this.columnDefs ? this.columnDefs
            .filter((colDef) => columnStates.find((column) => column.colId === colDef.colId)) // should exist in the grid config
            .map((colDef) => {
                const displayResult: any = colDef;
                if (columnStates
                    .find((column) => column.colId === 'ag-Grid-AutoColumn-' + colDef.colId)) {
                    // column grouped
                    colDef.hide = false;
                } else {
                    displayResult.hide = columnStates.find((column) => column.colId === colDef.colId).hide;
                }
                return displayResult;
            }) : [];

        this.isOwner = (this.gridViewCtrl.value as UserGridViewDto).createdBy ===
            this.authorizationService.getCurrentUser().samAccountName;
    }

    generateFileName(isCsv: boolean = false): string {
        const now = new Date();
        const todayDate = this.datePipe.transform(now, 'yyyyMMdd_hhmm').toString().toUpperCase();
        return todayDate + '_' + this.company + '_' + this.gridId + '_' + this.userActiveDirectoryName + (isCsv ? '.csv' : '.xlsx');
    }

    showExportStartedMessage() {
        this.snackbarService.informationSnackBar('The export has started. Your document will be available soon.');
    }

    onExportButtonClickedAsExcel() {
        this.showExportStartedMessage();
        if (this.isCustomExportEnabled === true) {
            this.exportClicked.emit(true);
        } else {
            const params = {
                fileName: this.generateFileName(),
            };
            this.gridOptions.api.exportDataAsExcel(params);
        }
    }

    onExportButtonClickedAsCSV() {
        this.showExportStartedMessage();
        if (this.isCustomExportEnabled === true) {
            this.exportClicked.emit(true);
        } else {
            const params = {
                fileName: this.generateFileName(true),
            };
            this.gridOptions.api.exportDataAsCsv(params);
        }
    }

    loadColumnsOnDetailMode() {
        const savedColumnStatesDetail: ColumnState[] = [];
        if (this.savedColumnStates && this.savedColumnStates.length > 0) {
            this.savedColumnStates.forEach((column) => {
                if (!column.colId.startsWith('ag-Grid-AutoColumn')) {
                    column.rowGroupIndex = null;
                    if (this.gridId === 'nominalReportTransactionGrid' && (column.colId === 'nominalAccount' || column.colId === 'currency')) {
                        column.hide = false;
                    } else if (this.gridId === 'clientReportTransactionGrid' && (column.colId === 'clientAccount' || column.colId === 'currency' || column.colId === 'accountLineType' || column.colId === 'department')) {
                        column.hide = false;
                    }
                    savedColumnStatesDetail.push(column);
                }
            });
        }
        this.gridOptions.columnApi.setColumnState(savedColumnStatesDetail);
        this.columnStateSetToGrid.emit();
    }
}
