import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatPaginator, MatSort } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import * as agGrid from 'ag-grid-community';
import { concatMap, map } from 'rxjs/operators';
import { AuthorizationService } from '../../../core/services/authorization.service';
import { AgGridUserPreferencesComponent } from '../../../shared/components/ag-grid-user-preferences/ag-grid-user-preferences.component';
import { ConfirmationDialogComponent } from '../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { FABType } from '../../../shared/components/floating-action-button/floating-action-button-type.enum';
import { ListAndSearchComponent } from '../../../shared/components/list-and-search/list-and-search.component';
import { AtlasAgGridParam } from '../../../shared/entities/atlas-ag-grid-param.entity';
import { Charter } from '../../../shared/entities/charter.entity';
import { FloatingActionButtonActions } from '../../../shared/entities/floating-action-buttons-actions.entity';
import { ListAndSearchFilter } from '../../../shared/entities/list-and-search/list-and-search-filter.entity';
import { MasterDataProps } from '../../../shared/entities/masterdata-props.entity';
import { MasterData } from '../../../shared/entities/masterdata.entity';
import { TransportType } from '../../../shared/entities/transport-type.entity';
import { UserGridPreferencesParameters } from '../../../shared/entities/user-grid-preferences-parameters.entity';
import { CharterStatus } from '../../../shared/enums/charter-status.enum';
import { ListAndSearchFilterType } from '../../../shared/enums/list-and-search-filter-type.enum';
import { PermissionLevels } from '../../../shared/enums/permission-level.enum';
import { CharterDisplayView } from '../../../shared/models/charter-display-view';
import { FormatDatePipe } from '../../../shared/pipes/format-date-pipe.pipe';
import { AgGridService } from '../../../shared/services/ag-grid.service';
import { GridConfigurationProviderService } from '../../../shared/services/grid-configuration-provider.service';
import { ExecutionService } from '../../../shared/services/http-services/execution.service';
import { MasterdataService } from '../../../shared/services/http-services/masterdata.service';
import { CharterListDataLoader } from '../../../shared/services/list-and-search/charterList-data-loader';
import { SecurityService } from '../../../shared/services/security.service';
import { TitleService } from '../../../shared/services/title.service';
import { UtilService } from '../../../shared/services/util.service';
import { ExecutionActionsService } from '../../services/execution-actions.service';
import { AtlasFormControl } from './../../../shared/entities/atlas-form-control';
import { Vessel } from './../../../shared/entities/vessel.entity';
import { UiService } from './../../../shared/services/ui.service';

@Component({
    selector: 'atlas-execution-charter-list-page',
    templateUrl: './execution-charter-list-page.component.html',
    styleUrls: ['./execution-charter-list-page.component.scss'],
    providers: [CharterListDataLoader],
})

export class ExecutionCharterListPageComponent implements OnInit {

    @ViewChild('userPreferences') userPreferencesComponent: AgGridUserPreferencesComponent;
    @ViewChild('listAndSearchComponent') listAndSearchComponent: ListAndSearchComponent;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    transportTypeRecord: TransportType[];
    company: string;
    charterModel: Charter[];
    searchForm: FormGroup;
    searchCharterReferenceCtrl = new AtlasFormControl('searchCharterReferenceCtrl');
    charterManagerCtrl = new AtlasFormControl('charterManagerCtrl');
    charters: CharterDisplayView[];
    dataLength = 0;
    isLoading: boolean;
    searchTerm: string;
    gridColumnApi: agGrid.ColumnApi;
    masterdata: MasterData;
    additionalFilters: ListAndSearchFilter[] = [];
    dataVersionId: number;
    gridCode: string = 'charterlist';
    loadOnInit = false;

    charterGridOptions: agGrid.GridOptions = {};
    excelStyles: any;
    charterGridColumns: agGrid.ColDef[] = [
        {
            headerName: 'Reference',
            field: 'charterCode',
            colId: 'charterCode',
            hide: false,
            sort: 'asc',
        },
        {
            headerName: 'Transport Type',
            field: 'transportType',
            colId: 'transportType',
            hide: true,
        },
        {
            headerName: 'Vessel',
            field: 'vessel',
            colId: 'vessel',
            hide: false,
        },
        {
            headerName: 'Description',
            field: 'description',
            colId: 'description',
            hide: false,
        },
        {
            headerName: 'Charter Status',
            field: 'charterStatusId',
            colId: 'charterStatusId',
            valueFormatter: this.charterStatusFormatter,
            hide: false,
        },
        {
            headerName: 'Charter Manager',
            field: 'charterManagerSamAccountName',
            colId: 'charterManagerSamAccountName',
            hide: false,
        },
        {
            headerName: 'Dept',
            colId: 'departmentId',
            field: 'departmentId',
            valueFormatter: this.departmentDescriptionFormatter.bind(this),
            hide: false,
        },
        {
            headerName: 'Charter B/L Date',
            field: 'blDate',
            colId: 'blDate',
            hide: false,
            valueFormatter: (params) => {
                return this.uiService.dateFormatter(params);
            },
            cellClass: 'dateFormat',
            valueGetter: (params) => {
                const dateFormat: FormatDatePipe = this.formatDate;
                const val = dateFormat.transformdate(params.data.blDate);

                if (val) {
                    if (val.indexOf('/') < 0) {
                        return val;
                    } else {
                        const split = val.split('/');
                        return split[2] + '-' + split[1] + '-' + split[0];
                    }
                }
            },
        },
        {
            headerName: 'Created By',
            field: 'createdBy',
            colId: 'createdBy',
            hide: false,
        },
        {
            headerName: 'Date Created',
            field: 'creationDate',
            colId: 'creationDate',
            hide: false,
            valueFormatter: (params) => {
                return this.uiService.dateFormatter(params);
            },
            cellClass: 'dateFormat',
            valueGetter: (params) => {
                const dateFormat: FormatDatePipe = this.formatDate;
                const val = dateFormat.transformdate(params.data.creationDate);

                if (val) {
                    if (val.indexOf('/') < 0) {
                        return val;
                    } else {
                        const split = val.split('/');
                        return split[2] + '-' + split[1] + '-' + split[0];
                    }
                }
            },
        },
    ];
    charterGridRows: CharterDisplayView[];
    componentId: string = 'charterList';
    hasGridSharing: boolean = false;
    atlasAgGridParam: AtlasAgGridParam;

    masterData: MasterData = new MasterData();
    listOfMasterData = [
        MasterDataProps.Ports,
        MasterDataProps.TransportTypes,
        MasterDataProps.Vessels,
    ];

    gridPreferences: UserGridPreferencesParameters;

    // FAB
    fabMenuActions: FloatingActionButtonActions[] = [];
    fabTitle: string;
    fabType: FABType;
    isLoaded: boolean = false;

    constructor(public masterdataService: MasterdataService, public utilService: UtilService, private securityService: SecurityService,
        private executionService: ExecutionService,
        private masterDataService: MasterdataService,
        private route: ActivatedRoute,
        private router: Router,
        protected dialog: MatDialog,
        protected executionActionsService: ExecutionActionsService,
        private formBuilder: FormBuilder,
        private formatDate: FormatDatePipe,
        private titleService: TitleService,
        private gridConfigurationProvider: GridConfigurationProviderService,
        private uiService: UiService,
        private authorizationService: AuthorizationService,
        public gridService: AgGridService,
        public dataLoader: CharterListDataLoader,

    ) {
        this.isLoading = true;
        this.excelStyles = [
            {
                id: 'dateFormat',
                dataType: 'dateTime',
                numberFormat: {
                    format: 'dd/mm/yyyy',
                },
            },
        ];
        this.checkIfUserHasRequiredPrivileges();
    }

    departmentDescriptionFormatter(params) {
        const department = this.masterdata.departments.find((dept) => dept.departmentId === params.value);
        if (params.value && department) {
            return department.description;
        }
        return '';
    }

    charterStatusFormatter(params) {
        if (params.value && CharterStatus[params.value]) {
            return CharterStatus[params.value].toString();
        }
        return '';
    }

    ngOnInit() {
        this.titleService.setTitle('Charters');
        this.masterdata = this.route.snapshot.data.masterdata;
        this.dataVersionId = this.route.snapshot.paramMap.get('dataVersionId') ?
            Number(this.route.snapshot.paramMap.get('dataVersionId')) : null;
        this.atlasAgGridParam = this.gridService.getAgGridParam();

        this.route.paramMap
            .pipe(
                map((params) => params.get('company')),
            )
            .subscribe((company) => {
                this.company = company;
            });

        this.securityService.isSecurityReady().pipe(
            concatMap(() => {
                return this.gridConfigurationProvider.getConfiguration(this.company, this.componentId);
            }),
        ).subscribe((configuration) => {
            // -- used later if this will become L&S maybe
            // this.columnConfiguration = configuration.columns;
            // this.configurationLoaded.emit();
            // this.initColumns(this.columnConfiguration);
            this.hasGridSharing = configuration.hasMultipleViewsPerUser;
            this.gridPreferences = {
                company: this.company,
                gridId: this.componentId,
                gridOptions: this.charterGridOptions,
                sharingEnabled: this.hasGridSharing,
            };
            this.gridPreferences = new UserGridPreferencesParameters(this.gridPreferences);
            this.getAllCharters();
        });
    }

    onGridReady(params) {

        this.gridService.sizeColumns(this.charterGridOptions);
        this.charterGridOptions.columnDefs = this.charterGridColumns;
        this.gridColumnApi = this.charterGridOptions.columnApi;

    }

    getAllCharters() {
        this.masterDataService.getMasterData(this.listOfMasterData).pipe(
            map((masterData: MasterData) => {
                this.initView(masterData);
            })).subscribe();
    }

    initView(masterData: MasterData) {

        this.executionService.getCharters()
            .subscribe((data) => {
                this.charters = data.value.map((charter) => {
                    return new CharterDisplayView(this.getDescriptions(masterData, charter));
                });
                this.charterGridRows = this.charters;
                this.initFABActions();
                this.isLoading = false;
                this.dataLength = this.charterGridRows.length;
            });

    }

    getDescriptions(masterData: MasterData, charter: Charter): Charter {

        if (charter.transportTypeCode) {
            this.transportTypeRecord = masterData.transportTypes
                .filter((transport) => transport.transportTypeCode
                    .toLowerCase().trim() === charter.transportTypeCode.toString()
                        .toLowerCase().trim());
        }

        if (this.transportTypeRecord && this.transportTypeRecord.length > 0) {
            charter.transportTypeCode = this.transportTypeRecord[0].description;
        }

        let vesselRecord: Vessel;
        if (charter.vesselCode) {
            vesselRecord = masterData.vessels
                .find((vessel) => vessel.vesselName.toLowerCase().trim() === charter.vesselCode.toString().toLowerCase().trim());
        }
        if (vesselRecord) {
            charter.vesselCode = vesselRecord.vesselName;
        }

        return charter;
    }

    onSearchCharters() {
        this.searchTerm = this.searchForm.get('searchCharterReferenceCtrl').value;
        if (!this.searchTerm) {
            return;
        }

        this.executionService.findChartersByReference(this.searchTerm)
            .subscribe((data) => {
                this.charters = data.value.map((charter) => {
                    return new CharterDisplayView(charter);
                });
                this.charterGridRows = this.charters;
                this.dataLength = this.charterGridRows.length;
                if (this.charters == null || this.charters.length === 0) {

                    const confirmDialog = this.dialog.open(ConfirmationDialogComponent, {
                        data: {
                            title: this.searchTerm + '  doesn\'t exist',
                            text: '  Do you want to create a Charter with this Reference'
                            ,
                            okButton: 'START CREATION',
                            cancelButton: 'DISCARD',
                        },
                    });
                    confirmDialog.afterClosed().subscribe((answer) => {
                        if (answer) {
                            this.router.navigate(['/' + this.company + '/execution/charter/new/', { ref: this.searchTerm }]);
                        }
                    });

                } else if (this.charters && this.charters.length === 1) {
                    this.router.navigate([this.company + '/execution/charter/details', this.charters[0].charterId]);
                    return;
                }

            });
    }

    onCharterRowClicked(event) {
        const charterId = event.data.charterId;
        this.router.navigate([this.company + '/execution/charter/details', charterId]);
    }

    onQuickNavigate(event) {
        const charterId = event.charterId;
        this.router.navigate([this.company + '/execution/charter/details', charterId]);
    }

    onColumnVisibilityChanged(col) {
        this.userPreferencesComponent.onChangeColumnVisibility(col);
    }

    // For FAB
    initFABActions() {
        this.fabType = FABType.ExtendedMenu;
        this.fabTitle = 'Charter Actions';
        const actionCreateCharter: FloatingActionButtonActions = {
            icon: 'add',
            text: 'Create Charter',
            action: 'createCharter',
            disabled: false,
            index: 0,
        };
        const actionGroupFunction: FloatingActionButtonActions = {
            icon: 'gamepad',
            text: 'Group Functions',
            action: 'groupFunctions',
            disabled: false,
            index: 1,
        };

        if (this.checkIfUserHasRequiredPrivileges()) {
            this.fabMenuActions.push(actionCreateCharter);
        }
        this.fabMenuActions.push(actionGroupFunction);
    }

    onFabActionClicked(action: string) {
        if (action === 'createCharter') {
            this.router.navigate([this.company + '/execution/charter/new']);
        }
        if (action === 'groupFunctions') {
            this.executionActionsService.charterGroupFunctionsSubject.next();

        }
    }

    onQuickSearchButtonClicked() {
        this.additionalFilters = [];
        const charterRefField = this.listAndSearchComponent.columnConfiguration
            .find((column) => column.fieldName === 'CharterCode');
        const charterManagerField = this.listAndSearchComponent.columnConfiguration
            .find((column) => column.fieldName === 'CharterManagerSamAccountName');
        if (!this.listAndSearchComponent) {
            return;
        } else {
            if (this.searchCharterReferenceCtrl.value && charterRefField) {
                const filterCharterReference = new ListAndSearchFilter();
                filterCharterReference.fieldId = charterRefField.fieldId;
                filterCharterReference.fieldName = charterRefField.fieldName;
                filterCharterReference.predicate = {
                    filterType: ListAndSearchFilterType.Text,
                    operator: 'eq',
                    value1: this.searchCharterReferenceCtrl.value + '%',
                };
                filterCharterReference.isActive = true;
                this.additionalFilters = [filterCharterReference];
            }
        }
        if (this.charterManagerCtrl.value && charterManagerField) {
            const filterCharterManager = new ListAndSearchFilter();
            filterCharterManager.fieldId = charterManagerField.fieldId;
            filterCharterManager.fieldName = charterManagerField.fieldName;
            filterCharterManager.predicate = {
                filterType: ListAndSearchFilterType.Text,
                operator: 'eq',
                value1: this.charterManagerCtrl.value + '%',
            };
            filterCharterManager.isActive = true;
            this.additionalFilters.push(filterCharterManager);
        }
        this.listAndSearchComponent.additionalFilters = this.additionalFilters;
        this.listAndSearchComponent.loadData(true);
    }

    checkIfUserHasRequiredPrivileges() {
        if (this.authorizationService.isPrivilegeAllowed(this.company, 'Charters')) {
            if (this.authorizationService.isPrivilegeAllowed(
                this.company, 'ChartersView', PermissionLevels.ReadWrite)) {
                return true;
            } else {
                return false;
            }
        }
    }

}
