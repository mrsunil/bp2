import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ColDef, ColumnApi, GridOptions } from 'ag-grid-community';
import { Subject } from 'rxjs';
import { AuthorizationService } from '../../../../../../core/services/authorization.service';
import { FreezeType } from '../../../../../../shared/enums/freeze-type.enum';
import { FormatDatePipe } from '../../../../../../shared/pipes/format-date-pipe.pipe';
import { AgGridService } from '../../../../../../shared/services/ag-grid.service';
import { UiService } from '../../../../../../shared/services/ui.service';
import { AgContextualMenuComponent } from './../../../../../../shared/components/ag-contextual-menu/ag-contextual-menu.component';
import { AgContextualMenuAction } from './../../../../../../shared/entities/ag-contextual-menu-action.entity';
import { AtlasAgGridParam } from './../../../../../../shared/entities/atlas-ag-grid-param.entity';
import { Freeze } from './../../../../../../shared/entities/freeze.entity';
import { SnackbarService } from './../../../../../../shared/services/snackbar.service';
import { TitleService } from './../../../../../../shared/services/title.service';

@Component({
    selector: 'atlas-freeze-grid',
    templateUrl: './freeze-grid.component.html',
    styleUrls: ['./freeze-grid.component.scss'],
    providers: [DatePipe],
})
export class FreezeGridComponent implements OnInit, OnDestroy {

    @Input() freezeMenuActions: { [key: string]: string };
    @Input() freezeGridContextualMenuActions: AgContextualMenuAction[] = [];
    @Output() readonly menuActionClicked = new EventEmitter();
    @Input() multipleSelection = false;
    @Input() isLoading = false;
    atlasAgGridParam: AtlasAgGridParam;
    gridOptions: GridOptions;
    columnApi: ColumnApi;
    checkExportedFormat: boolean = false;
    excelStyles = [
        {
            id: 'dateFormat',
            dataType: 'dateTime',
            numberFormat: {
                format: 'dd/mm/yyyy',
            },
        },
    ];
    userActiveDirectoryName: string;
    columnDefs: ColDef[] = [
        {
            headerCheckboxSelection: true,
            checkboxSelection: true,
            width: 92,
            colId: 'checkbox',
            hide: !this.multipleSelection,
        },
        {
            headerName: 'Date of freeze',
            colId: 'freezeDate',
            field: 'freezeDate',
            valueFormatter: (params) => {
                if (params.data) {
                    return params.data.dataVersionTypeId === FreezeType.Monthly ?
                        this.uiService.monthFormatter(params) : this.uiService.dateFormatter(params);
                }
            },
            cellClass: 'dateFormat',
            valueGetter: (params) => {
                const dateFormat: FormatDatePipe = this.formatDate;
                const val = dateFormat.transformdate(params.data.freezeDate);

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
            headerName: 'User',
            colId: 'createdBy',
            field: 'createdBy',
        },
        {
            headerName: 'Date of run',
            colId: 'startDateTime',
            field: 'startDateTime',
            valueFormatter: (params) => this.uiService.dateFormatter(params),
            cellClass: 'dateFormat',
            valueGetter: (params) => {
                const dateFormat: FormatDatePipe = this.formatDate;
                const val = dateFormat.transformdate(params.data.startDateTime);

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
            headerName: 'Time of run',
            colId: 'endDateTime',
            field: 'endDateTime',
            valueFormatter: this.uiService.timeFormatter,
        },
    ];

    @Input() rowData: Freeze[] = [];
    isNew = false;
    company: string;
    destroy$ = new Subject();

    constructor(private uiService: UiService,
        private route: ActivatedRoute,
        private formatDate: FormatDatePipe,
        private datePipe: DatePipe,
        private authorizationService: AuthorizationService,
        private snackBarService: SnackbarService,
        public gridService: AgGridService,
        private titleService: TitleService,
    ) {
        this.company = route.snapshot.paramMap.get('company');
        this.isNew = this.route.snapshot.data.isNew;
        this.atlasAgGridParam = this.gridService.getAgGridParam();
        this.userActiveDirectoryName = this.authorizationService.getCurrentUser().samAccountName;
    }

    ngOnInit() {
        this.initMultipleSelection();
        this.titleService.setTitle('View Frozen Database');
    }

    initMenuAction() {
        if (this.freezeGridContextualMenuActions.length > 0 && !this.columnDefs.find((def) => def.colId === 'menuAction')) {
            this.columnDefs.push(
                {
                    headerName: '',
                    colId: 'menuAction',
                    cellRendererFramework: AgContextualMenuComponent,
                    cellRendererParams: {
                        context: {
                            componentParent: this,
                        },
                        menuActions: this.freezeGridContextualMenuActions,
                    },
                    cellClass: 'ag-contextual-menu',
                    width: 92,
                });
            if (this.gridOptions && this.gridOptions.api) {
                this.gridOptions.api.setColumnDefs(this.columnDefs);
            }
        }
    }

    initMultipleSelection() {
        const checkboxColumn = this.columnDefs.find((col) => col.colId === 'checkbox');
        if (checkboxColumn) {
            checkboxColumn.hide = !this.multipleSelection;
        }
    }

    populateGrid(rowData: Freeze[]) {
        if (this.gridOptions && this.gridOptions.api) {
            this.gridOptions.api.setRowData(rowData);
        }
    }

    onGridReady(params) {
        this.initMenuAction();
        params.columnDefs = this.columnDefs;
        this.gridOptions = params;
        this.gridOptions.api.setRowData(this.rowData);
        this.columnApi = params.columnApi;
    }

    onFirstDataRendered(params) {
        params.api.sizeColumnsToFit();
    }

    autoSizeGridHeader() {
        if (this.gridOptions && this.gridOptions.api) { this.gridOptions.api.sizeColumnsToFit(); }
    }

    onGridSizeChanged(params) {
        this.autoSizeGridHeader();
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    handleAction(action: string, freeze: Freeze) {
        this.menuActionClicked.emit([{ action, freeze }]);
    }

    OnExportButton() {
        const dateFormat: FormatDatePipe = this.formatDate;
        if (!this.checkExportedFormat) {
            this.gridOptions.api.forEachNode((node) => {
                if (node.data.endDateTime) {
                    node.data.endDateTime = dateFormat.transformtime(node.data.endDateTime);
                }
            });
            this.checkExportedFormat = true;
        }
    }

    onExportButtonClickedAsExcel() {
        const screenName: string = 'Freezes';
        const now = new Date();
        const todayDate = this.datePipe.transform(now, 'yyyyMMdd_hhmm').toString().toUpperCase();
        const params = {
            fileName: todayDate + '_' + this.company + '_' + screenName + '_' + this.userActiveDirectoryName + '.xlsx',
        };
        this.gridOptions.api.exportDataAsExcel(params);
    }

    onExportButtonClickedAsCSV() {
        const screenName: string = 'Freezes';
        const now = new Date();
        const todayDate = this.datePipe.transform(now, 'yyyyMMdd_hhmm').toString().toUpperCase();
        const params = {
            fileName: todayDate + '_' + this.company + '_' + screenName + '_' + this.userActiveDirectoryName + '.csv',
        };
        this.gridOptions.api.exportDataAsCsv(params);
    }

    onBulkMenuActionClicked(action: AgContextualMenuAction) {
        const selectedRows = this.gridOptions.api.getSelectedRows();
        if (selectedRows.length === 0) {
            this.snackBarService.informationSnackBar('Please select at least one freeze');
        } else {
            this.menuActionClicked.emit(selectedRows.map((freeze) => {
                return { action: action.action, freeze };
            }));
        }
    }
}
