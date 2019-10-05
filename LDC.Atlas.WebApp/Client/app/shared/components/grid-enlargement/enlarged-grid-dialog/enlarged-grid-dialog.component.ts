import { AfterViewInit, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatSlideToggleChange } from '@angular/material';
import * as agGrid from 'ag-grid-community';
import { Subject } from 'rxjs';
import { UserGridViewDto } from '../../../dtos/user-grid-view-dto.dto';
import { AtlasContextualAction } from '../../../entities/atlas-contextual-action.entity';
import { UserGridPreferencesParameters } from '../../../entities/user-grid-preferences-parameters.entity';
import { AgGridService } from '../../../services/ag-grid.service';
import { AgGridUserPreferencesComponent } from '../../ag-grid-user-preferences/ag-grid-user-preferences.component';

@Component({
    selector: 'atlas-enlarged-grid-dialog',
    templateUrl: './enlarged-grid-dialog.component.html',
    styleUrls: ['./enlarged-grid-dialog.component.scss'],
})
export class EnlargedGridDialogComponent implements OnInit, AfterViewInit {

    @ViewChild('userPreferences') userPreferencesComponent: AgGridUserPreferencesComponent;
    gridPreferencesParameters: UserGridPreferencesParameters;

    loadUserPreferences: boolean = false;
    enlargedGridOptions: agGrid.GridOptions = { alignedGrids: [] };

    // row Selection handling
    hasRangeSelectionOption: boolean = false;
    singleRowSelectionClass: string = 'ag-theme-material pointer-cursor';
    multipleCellSelectionClass: string = 'ag-theme-material pointer-cursor cell-selection';
    appliedSelectionClass: string;
    selectedColumnsArray: Array<{ 'name': string, 'sum': number }> = new Array();
    summableColumns: string[] = [];
    isQuickSumActivated: boolean = false;
    // --

    /* format :[{
        Text : string,
        Action: string,
        Disabled: boolean
    }]
    */
    additionalActions: AtlasContextualAction[] = [];

    private cellClickedSubject = new Subject();
    private cellValueChangedSubject = new Subject();
    private rowClickedSubject = new Subject();
    private rowSelectedSubject = new Subject();
    private rowDataChangedSubject = new Subject();
    private columnVisibleSubject = new Subject();
    private columnRowGroupChangedSubject = new Subject();

    private additionalActionClickedSubject = new Subject();
    private customExportButtonClickedSubject = new Subject();

    constructor(public dialog: MatDialogRef<EnlargedGridDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private gridService: AgGridService) { }
    /*
    https://www.ag-grid.com/javascript-grid-aligned-grids/
    Data Structure Injected should be the following:
    - Ag Grid Options
    - user preferences parameters

    data: {
            gridOptions: agGrid.GridOptions,
            gridPreferencesParameters: UserGridPreferencesParameters,
            hasRangeSelectionOption: boolean,
            summableColumns: string[],
            additionalActions: { action: string, text: string, disabled: boolean},
        },
    //*/

    ngOnInit() {
        this.gridPreferencesParameters = this.data.gridPreferencesParameters;

        this.hasRangeSelectionOption = this.data.hasRangeSelectionOption;
        this.summableColumns = this.data.summableColumns;

        this.enlargedGridOptions = { ...this.data.gridOptions };
        this.enlargedGridOptions.alignedGrids = [this.data.gridOptions];
        this.enlargedGridOptions.domLayout = 'normal';
        this.enlargedGridOptions.paginationAutoPageSize = true;

        this.additionalActions = this.data.additionalActions ? this.data.additionalActions : [];
        // --
        this.appliedSelectionClass = this.singleRowSelectionClass;
    }

    ngAfterViewInit(): void {

        if (this.gridPreferencesParameters) {
            this.userPreferencesComponent.loadGridViews(this.gridPreferencesParameters.gridViews);
            if (this.gridPreferencesParameters.selectedGridViewId) {
                this.userPreferencesComponent.loadGridView(this.gridPreferencesParameters.selectedGridViewId, false);
            }
        }
    }

    getGridOptions(): agGrid.GridOptions {
        return this.enlargedGridOptions;
    }

    public actionTriggered() {
        return this.additionalActionClickedSubject;
    }
    // -- AG grid events
    public rowClicked(): Subject<any> {
        return this.rowClickedSubject;
    }

    public rowDataChanged(): Subject<any> {
        return this.rowDataChangedSubject;
    }

    public rowSelected(): Subject<any> {
        return this.rowSelectedSubject;
    }

    public cellClicked(): Subject<any> {
        return this.cellClickedSubject;
    }

    public cellValueChanged(): Subject<any> {
        return this.cellValueChangedSubject;
    }

    public columnRowGroupChanged(): Subject<any> {
        return this.columnRowGroupChangedSubject;
    }

    public columnVisibiltyChanged(): Subject<any> {
        return this.columnVisibleSubject;
    }

    public customExport(): Subject<any> {
        return this.customExportButtonClickedSubject;
    }

    onRowDataChanged(rowData: any) {
        this.rowDataChangedSubject.next(rowData);
    }

    onRowSelected(rowData: any) {
        this.rowSelectedSubject.next(rowData);
    }

    onRowClicked(rowData: any) {
        this.rowClickedSubject.next(rowData);
    }

    onCellClicked(selectedCell: any) {
        this.cellClickedSubject.next(selectedCell);
    }

    onCellValueChanged(selectedCell: any) {
        this.cellValueChangedSubject.next(selectedCell);
    }

    onColumnVisibilityChanged(column: any) {
        this.columnRowGroupChangedSubject.next(column);
    }

    onColumnRowGroupChanged(columnRow: any) {
        this.columnRowGroupChangedSubject.next(columnRow);
    }

    // --

    getCurrentGridView(): UserGridViewDto {
        if (this.userPreferencesComponent) {
            return this.userPreferencesComponent.getCurrentGridView();
        }
        return null;
    }

    getGridViews(): UserGridViewDto[] {
        if (this.userPreferencesComponent) {
            return this.userPreferencesComponent.getLoadedGridViews();
        }
        return null;
    }

    onActionButtonClicked(action: string) {
        this.additionalActionClickedSubject.next(action);
    }

    onCustomExportButtonClicked(value: any, type: string) {
        this.customExportButtonClickedSubject.next([value, type]);
    }

    refreshGrid() {
        this.enlargedGridOptions.api.setRowData((this.data.gridOptions as agGrid.GridOptions).rowData);
        this.enlargedGridOptions.rowData = (this.data.gridOptions as agGrid.GridOptions).rowData;
    }

    onGridReady(params) {
        // set the columns the same as parent
        const savedColumnStates = this.data.gridOptions.columnApi ?
            (this.data.gridOptions as agGrid.GridOptions).columnApi.getColumnState() : [];

        this.enlargedGridOptions.columnApi.setColumnState(savedColumnStates);

        // make sure the data is the same
        this.enlargedGridOptions.api.setRowData((this.data.gridOptions as agGrid.GridOptions).rowData);
        this.enlargedGridOptions.rowData = (this.data.gridOptions as agGrid.GridOptions).rowData;

        // if there is selection, make sure it's ticked the same
        (this.data.gridOptions as agGrid.GridOptions).api.getSelectedNodes().forEach((selectedNode) => {
            const node = this.enlargedGridOptions.api.getRowNode(selectedNode.id);
            node.setSelected(true);
        });

        // filter the data in case there is column filtering
        this.enlargedGridOptions.api.setFilterModel((this.data.gridOptions as agGrid.GridOptions).api.getFilterModel());

    }

    // row selection handling
    onQuickSumToggleChange(toggleEvent: MatSlideToggleChange) {
        this.onClearSelectionButtonClicked();

        this.isQuickSumActivated = toggleEvent.checked;
        this.appliedSelectionClass = toggleEvent.checked ? this.multipleCellSelectionClass : this.singleRowSelectionClass;
    }

    onClearSelectionButtonClicked() {
        this.enlargedGridOptions.api.clearRangeSelection();
        this.selectedColumnsArray = [];
    }

    onRangeSelectionChanged(event) {

        this.selectedColumnsArray = [];
        const rangeSelections = this.enlargedGridOptions.api.getRangeSelections();

        if (rangeSelections && rangeSelections.length !== 0) {
            const firstRange = rangeSelections[0];
            const startRow = Math.min(firstRange.start.rowIndex, firstRange.end.rowIndex);
            const endRow = Math.max(firstRange.start.rowIndex, firstRange.end.rowIndex);

            firstRange.columns.forEach((column) => {
                if (this.summableColumns.includes(column.getColDef().colId)) {
                    let selectedSum = 0;
                    for (let rowIndex = startRow; rowIndex <= endRow; rowIndex++) {
                        const rowModel = this.enlargedGridOptions.api.getModel();
                        const rowNode = rowModel.getRow(rowIndex);
                        const value = this.enlargedGridOptions.api.getValue(column, rowNode);
                        selectedSum += Number(value);
                    }
                    this.selectedColumnsArray.push({ name: column.getColDef().headerName, sum: selectedSum });
                }
            });
        }
    }

}
