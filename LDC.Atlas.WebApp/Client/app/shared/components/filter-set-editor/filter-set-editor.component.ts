import { Component, EventEmitter, Inject, OnDestroy, OnInit, Output } from '@angular/core';
import * as agGrid from 'ag-grid-community';
import { CellValueChangedEvent } from 'ag-grid-community';
import 'ag-grid-enterprise';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AtlasAgGridParam } from '../../entities/atlas-ag-grid-param.entity';
import { EnumEntity } from '../../entities/enum-entity.entity';
import { ColumnConfigurationProperties } from '../../entities/grid-column-configuration.entity';
import { FilterSetEditorRowData } from '../../entities/list-and-search/filter-set-editor-row-data.entity';
import { ListAndSearchFilter } from '../../entities/list-and-search/list-and-search-filter.entity';
import { WINDOW } from '../../entities/window-injection-token';
import { ListAndSearchFilterType } from '../../enums/list-and-search-filter-type.enum';
import { AgGridService } from '../../services/ag-grid.service';
import { GridConfigurationProviderService } from '../../services/grid-configuration-provider.service';
import { MasterdataService } from '../../services/http-services/masterdata.service';
import { UiService } from '../../services/ui.service';
import { AgGridListAndSearchPicklistFieldComponent } from '../ag-grid-list-and-search-picklist-field/ag-grid-list-and-search-picklist-field.component';
import { FilterService } from './../../services/filter-service.service';
import { AgGridCheckboxComponent } from './../ag-grid-checkbox/ag-grid-checkbox.component';

@Component({
    selector: 'atlas-filter-set-editor',
    templateUrl: './filter-set-editor.component.html',
    styleUrls: ['./filter-set-editor.component.scss'],
})
export class FilterSetEditorComponent implements OnInit, OnDestroy {

    @Output() readonly cancelFiltering = new EventEmitter();
    @Output() readonly applyFiltering = new EventEmitter<ListAndSearchFilter[]>();

    destroy$ = new Subject();

    gridEditableFilters: ListAndSearchFilter[];
    optionSetData: Map<number, string[]>; // do the same for picklist
    picklistData: Map<number, { dataEntity: string, gridId: string }>;

    frameworkComponents: any = {
        picklistFieldComponent: AgGridListAndSearchPicklistFieldComponent,
    };

    gridOptions: agGrid.GridOptions;
    gridApi: agGrid.GridApi;
    gridColumnApi: agGrid.ColumnApi;
    columnDefs: agGrid.ColDef[] = [
        {
            colId: 'filterName',
            field: 'fieldName',
            hide: true,
        },
        {
            colId: 'fieldFriendlyName',
            headerName: 'Filter Name',
            field: 'fieldFriendlyName',
        },
        {
            colId: 'filterValue',
            headerName: 'Value',
            field: 'value',
            editable: true,
            cellClassRules: {
                'ag-grid-valid-mandatory-field':
                    ((params) => {
                        if (params.data) {
                            return params.data.isValid;
                        }
                    }),
                'ag-grid-invalid-mandatory-field': ((params) => {
                    if (params.data) {
                        return !params.data.isValid;
                    }
                }),
            },
            cellEditorSelector: (params) => {
                switch ((params.data as FilterSetEditorRowData).filterType) {
                    case (ListAndSearchFilterType.OptionSet):
                        return {
                            component: 'agRichSelect',
                            params: {
                                values: this.optionSetData.get((params.data as FilterSetEditorRowData).fieldId),
                            },
                        };
                        break;

                    default: return null;
                }
            },
            cellRendererSelector: (params) => {
                if (!params.node.group) {
                    switch ((params.data as FilterSetEditorRowData).filterType) {
                        case (ListAndSearchFilterType.Picklist):
                            return {
                                component: 'picklistFieldComponent',

                                params: {
                                    dataEntity: this.picklistData.get((params.data as FilterSetEditorRowData).fieldId).dataEntity,
                                    gridId: this.picklistData.get((params.data as FilterSetEditorRowData).fieldId).gridId,
                                },
                            };
                            break;
                        default: return null;
                    }
                } else {
                    return null;
                }
            },
        },
        {
            colId: 'filterActive',
            headerName: 'Filtered',
            field: 'isActive',
            cellRenderer: 'agGroupCellRenderer',
            cellRendererParams: {
                innerRendererFramework: AgGridCheckboxComponent,
            },
        },
        {
            headerName: 'GroupName',
            field: 'groupName',
            rowGroup: true,
            hide: true,
        },
    ];
    autoGroupColumnDef = {
        headerName: '',
        maxWidth: 100,
        cellRendererParams: {
            suppressCount: true,
        },
    };
    gridId: string;
    company: string;
    rowData: FilterSetEditorRowData[];
    atlasAgGridParam: AtlasAgGridParam;
    groupDefaultExpanded = 1;
    hideEmptyFilters = false;
    originalRowData: FilterSetEditorRowData[];
    filtersHaveBeenChanged = false;

    constructor(protected uiService: UiService,
        protected filterService: FilterService,
        protected masterDataService: MasterdataService,
        protected gridConfigurationProvider: GridConfigurationProviderService,
        @Inject(WINDOW) private window: Window,
        public gridService: AgGridService,

    ) {
        this.atlasAgGridParam = this.gridService.getAgGridParam();
    }

    ngOnInit() {
    }

    onCellValueChanged(cell: CellValueChangedEvent) {
        if (cell.oldValue !== cell.newValue) {
            this.filtersHaveBeenChanged = true;
            const colId = cell.column.getId();
            const filter: ListAndSearchFilter = this.gridEditableFilters.find(
                (filtr: ListAndSearchFilter) => filtr.fieldId === cell.data.fieldId);
            if (colId === 'filterActive') {
                filter.isActive = cell.newValue;
            }
            if (colId === 'filterValue') {
                const rowCell: FilterSetEditorRowData = cell.data as FilterSetEditorRowData;
                if (cell.newValue) {
                    // if there is a string input
                    filter.predicate = this.filterService.validateInput(cell.newValue, rowCell.filterType);
                    if (filter.predicate) {
                        rowCell.value = this.filterService.getFilterStringValue(filter);
                        rowCell.isActive = true;
                        rowCell.isValid = true;
                    } else {
                        rowCell.isValid = false;
                    }
                } else {
                    // if the user has erased the input
                    rowCell.isActive = false;
                    rowCell.isValid = true;
                    if (this.hideEmptyFilters) {
                        this.removeEmptyFilters();
                    }
                }

                const params = { force: true };
                this.gridApi.refreshCells(params);
            }
        }
    }

    readyFilterSetEditor(gridColumnsConfig: ColumnConfigurationProperties[], filters: ListAndSearchFilter[]) {
        this.gridEditableFilters = [];
        const filterableColumns = this.getFilterableColumns(gridColumnsConfig);
        this.gridEditableFilters = this.getFiltersListFromColumnsDefinition(filterableColumns, filters);
        // fetch data for the option sets
        this.loadOptionSetsData(gridColumnsConfig);
        this.loadPicklistsData(gridColumnsConfig);

        this.rowData = this.originalRowData = this.gridEditableFilters.map((filter: ListAndSearchFilter) => {
            return {
                fieldId: filter.fieldId,
                fieldFriendlyName: filter.fieldFriendlyName,
                gridColumnId: filter.gridColumnId,
                fieldName: filter.fieldName,
                value: this.filterService.getFilterStringValue(filter),
                isActive: filter.isActive,
                filterType: filter.predicate.filterType,
                isValid: true,
                groupName: filter.groupName,
            };
        });

        if (this.gridApi) {
            if (this.gridApi) { this.gridApi.sizeColumnsToFit(); }
        }
        if (this.hideEmptyFilters) {
            this.removeEmptyFilters();
        }
    }

    private loadOptionSetsData(gridColumnsConfig: ColumnConfigurationProperties[]) {
        this.optionSetData = new Map<number, string[]>();
        const optionSets = gridColumnsConfig ? gridColumnsConfig.filter((config: ColumnConfigurationProperties) => {
            return config.filterType === ListAndSearchFilterType.OptionSet;
        }) : [];

        const optionSetArray: string[] = optionSets.map((set: ColumnConfigurationProperties) => {
            return set.optionSet;
        });
        this.masterDataService.getMasterData(optionSetArray)
            .pipe(
                takeUntil(this.destroy$),
            )
            .subscribe((masterdata) => {
                optionSets.forEach((set) => {
                    const masterDataForOptionSet = masterdata[set.optionSet] as EnumEntity[];
                    const values = (masterDataForOptionSet ? masterDataForOptionSet : []).map((entity) => entity.enumEntityValue);
                    this.optionSetData.set(set.fieldId, values);
                });
            });

    }
    private loadPicklistsData(gridColumnsConfig: ColumnConfigurationProperties[]) {
        this.picklistData = new Map<number, { dataEntity: string, gridId: string }>();
        const picklists = gridColumnsConfig ? gridColumnsConfig.filter((config: ColumnConfigurationProperties) => {
            return config.filterType === ListAndSearchFilterType.Picklist;
        }) : [];

        // for now we are considering simple picklists
        picklists.forEach((picker) => {
            this.picklistData.set(
                picker.fieldId,
                {
                    dataEntity: picker.optionSet,
                    gridId: this.gridConfigurationProvider.getGridIdForDataEntity(picker.optionSet),
                });
        });
    }

    getFilterableColumns(gridColumnsConfig: ColumnConfigurationProperties[]): ColumnConfigurationProperties[] {
        const res = gridColumnsConfig ? gridColumnsConfig.filter((column: ColumnConfigurationProperties) => {
            return column.isFilterable;
        }) : [];

        return res;
    }

    getFiltersListFromColumnsDefinition(gridColumnsConfig: ColumnConfigurationProperties[],
        filters: ListAndSearchFilter[]): ListAndSearchFilter[] {
        const editableFilters = gridColumnsConfig.map((column: ColumnConfigurationProperties) => {
            let gridFilter: ListAndSearchFilter = filters.find((filter: ListAndSearchFilter) => {
                return filter.fieldId === column.fieldId;
            });

            // if a filter does not exist on a filterable column
            if (!gridFilter) {
                gridFilter = new ListAndSearchFilter();
                gridFilter.gridColumnId = column.gridColumnId;
                gridFilter.fieldId = column.fieldId;
                gridFilter.isActive = false;
            }
            gridFilter.fieldName = column.fieldName;
            gridFilter.fieldFriendlyName = column.friendlyName;
            gridFilter.groupName = column.groupName;

            const filterTypeKey: string = Object.keys(ListAndSearchFilterType)
                .find((key) => ListAndSearchFilterType[key] === column.filterType.toLocaleLowerCase());
            const filterType: ListAndSearchFilterType = ListAndSearchFilterType[filterTypeKey];
            gridFilter.predicate.filterType = filterType;
            return gridFilter;
        });

        return editableFilters;
    }

    onDiscardButtonClicked() {
        this.cancelFiltering.emit();
    }

    onApplyFiltersButtonClicked() {
        const applicableFilters: ListAndSearchFilter[] = [];
        this.rowData.forEach((row) => {
            const filter = this.gridEditableFilters.find((filtr: ListAndSearchFilter) => {
                return (filtr.fieldId === row.fieldId);
            });

            if (filter.predicate && filter.predicate.operator) {
                filter.isActive = row.isActive;
                applicableFilters.push(filter);
            }
        });
        this.applyFiltering.emit(applicableFilters);
    }

    onGridReady(params) {
        this.gridOptions = params;
        this.gridOptions.columnDefs = this.columnDefs;
        this.gridApi = this.gridOptions.api;
        this.gridColumnApi = this.gridOptions.columnApi;

        this.gridColumnApi.autoSizeAllColumns();
    }

    areFiltersValid(): boolean {
        let isValid = true;
        if (this.rowData) {
            this.rowData.filter((filter) => filter.isActive).forEach((filter: FilterSetEditorRowData) => {
                isValid = isValid && filter.isValid;
            });
        }
        return isValid;
    }

    onGridSizeChanged(params) {
        this.gridColumnApi = params.columnApi;
        this.gridColumnApi.autoSizeAllColumns();
    }

    onHideEmptyFilters() {
        this.hideEmptyFilters = !this.hideEmptyFilters;
        if (this.hideEmptyFilters) {
            this.removeEmptyFilters();
        } else {
            this.rowData = this.originalRowData;
        }
    }

    removeEmptyFilters() {
        this.rowData = this.rowData ? this.rowData.filter((row) => {
            return row.value;
        }) : [];
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
