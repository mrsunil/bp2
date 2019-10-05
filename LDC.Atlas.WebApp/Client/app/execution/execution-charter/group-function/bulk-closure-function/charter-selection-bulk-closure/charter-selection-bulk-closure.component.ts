import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { AgGridUserPreferencesComponent } from '../../../../../shared/components/ag-grid-user-preferences/ag-grid-user-preferences.component'
import { MatPaginator, MatSort } from '@angular/material';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AtlasFormControl } from '../../../../../shared/entities/atlas-form-control';
import { CharterDisplayView } from '../../../../../shared/models/charter-display-view';
import { TitleService } from '../../../../../shared/services/title.service';
import { MasterdataService } from '../../../../../shared/services/http-services/masterdata.service';
import { MasterData } from '../../../../../shared/entities/masterdata.entity';
import * as agGrid from 'ag-grid-community';
import { CharterStatus } from '../../../../../shared/enums/charter-status.enum';
import { UiService } from '../../../../../shared/services/ui.service';
import { ActivatedRoute } from '@angular/router';
import { AtlasAgGridParam } from '../../../../../shared/entities/atlas-ag-grid-param.entity';
import { FormatDatePipe } from '../../../../../shared/pipes/format-date-pipe.pipe';
import { AgGridService } from '../../../../../shared/services/ag-grid.service';
import { GridConfigurationProviderService } from '../../../../../shared/services/grid-configuration-provider.service';
import { concatMap, map } from 'rxjs/operators';
import { SecurityService } from '../../../../../shared/services/security.service';
import { MasterDataProps } from '../../../../../shared/entities/masterdata-props.entity';
import { ExecutionService } from '../../../../../shared/services/http-services/execution.service';
import { Vessel } from '../../../../../shared/entities/vessel.entity';
import { Charter } from '../../../../../shared/entities/charter.entity';
import { TransportType } from '../../../../../shared/entities/transport-type.entity';

@Component({
    selector: 'atlas-charter-selection-bulk-closure',
    templateUrl: './charter-selection-bulk-closure.component.html',
    styleUrls: ['./charter-selection-bulk-closure.component.scss']
})
export class CharterSelectionBulkClosureComponent implements OnInit {
    @ViewChild('userPreferences') userPreferencesComponent: AgGridUserPreferencesComponent;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    @Output() readonly charterSelected = new EventEmitter<boolean>();
    searchForm: FormGroup;
    searchCharterReferenceCtrl = new AtlasFormControl('searchCharterReferenceCtrl');
    charterGridRows: CharterDisplayView[];
    masterdata: MasterData;
    atlasAgGridParam: AtlasAgGridParam;
    company: string;
    charters: CharterDisplayView[];
    dataLength = 0;
    isLoading: boolean = true;
    transportTypeRecord: TransportType[];
    charterGridOptions: agGrid.GridOptions = {};
    gridColumnApi: agGrid.ColumnApi;
    excelStyles: any;
    searchTerm: string;
    gridApi: agGrid.GridApi;
    selectedCharterForBulkFunctions: Charter[];

    charterGridColumns: agGrid.ColDef[] = [
        {
            headerName: '',
            colId: 'selection',
            headerCheckboxSelection: true,
            checkboxSelection: true,
            minWidth: 40,
            maxWidth: 40,
            pinned: 'left',
        },
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
    componentId: string = 'charterList';
    hasGridSharing: boolean = false;
    masterDataList = [
        MasterDataProps.Ports,
        MasterDataProps.TransportTypes,
        MasterDataProps.Vessels,
    ];

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



    constructor(private formBuilder: FormBuilder, protected titleService: TitleService,
        public masterdataService: MasterdataService, protected uiService: UiService,
        protected route: ActivatedRoute, private formatDate: FormatDatePipe, public gridService: AgGridService,
        private gridConfigurationProvider: GridConfigurationProviderService, private securityService: SecurityService,
        private executionService: ExecutionService, ) {
        this.searchForm = this.formBuilder.group({
            searchCharterReferenceCtrl: this.searchCharterReferenceCtrl,
        });
        this.excelStyles = [
            {
                id: 'dateFormat',
                dataType: 'dateTime',
                numberFormat: {
                    format: 'dd/mm/yyyy',
                },
            },
        ];
    }

    ngOnInit() {
        this.titleService.setTitle('Charters');
        this.masterdata = this.route.snapshot.data.masterdata;
        this.atlasAgGridParam = this.gridService.getAgGridParam();
        this.company = this.route.snapshot.paramMap.get('company')

        this.securityService.isSecurityReady().pipe(
            concatMap(() => {
                return this.gridConfigurationProvider.getConfiguration(this.company, this.componentId);
            }),
        ).subscribe((configuration) => {
            this.hasGridSharing = configuration.hasMultipleViewsPerUser;
            this.getAllCharters();
        });
    }

    getAllCharters() {
        this.masterdataService.getMasterData(this.masterDataList).subscribe((masterData: MasterData) => {
            this.initView(masterData);
        });
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
                this.charterGridRows = this.charters.filter((charter) =>
                    charter.charterStatusId !== CharterStatus.Closed
                );
                this.dataLength = this.charterGridRows.length;
            });
    }

    onGridReady(params) {
        params.columnDefs = this.charterGridColumns;
        this.charterGridOptions = params;
        this.gridColumnApi = this.charterGridOptions.columnApi;
        this.gridApi = this.charterGridOptions.api;
        this.gridColumnApi.autoSizeAllColumns();
        window.onresize = () => {
            this.gridColumnApi.autoSizeAllColumns();
        };
    }

    onGridSizeChanged(params) {
        this.gridColumnApi = params.columnApi;
        this.gridColumnApi.autoSizeAllColumns();
    }

    initView(masterData: MasterData) {

        this.executionService.getCharters()
            .subscribe((data) => {
                this.charters = data.value.map((charter) => {
                    return new CharterDisplayView(this.getDescriptions(masterData, charter));
                });
                this.charterGridRows = this.charters.filter((charter) =>
                    charter.charterStatusId !== CharterStatus.Closed
                );

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
    onSelectionChanged(event) {
        const selectedRows = this.gridApi.getSelectedRows();
        if (selectedRows.length > 0) {
            this.charterSelected.emit(true);
        }
        else {
            this.charterSelected.emit(false);
        }
        this.gridApi.refreshCells(event.data);
        this.selectedCharterForBulkFunctions = selectedRows;

    }
    onColumnVisibilityChanged(col) {
        this.userPreferencesComponent.onChangeColumnVisibility(col);
    }
}
