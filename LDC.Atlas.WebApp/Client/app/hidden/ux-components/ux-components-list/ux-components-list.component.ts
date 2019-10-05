import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import * as agGrid from 'ag-grid-community';
import 'ag-grid-enterprise';
import { forkJoin as observableForkJoin, Observable, Subject } from "rxjs";
import { concatMap, map, startWith, takeUntil } from "rxjs/operators";
import { AtlasTranslationService } from '../../../core/services/atlas-translation.service';
import { FABType } from "../../../shared/components/floating-action-button/floating-action-button-type.enum";
import { AtlasAgGridParam } from '../../../shared/entities/atlas-ag-grid-param.entity';
import { FloatingActionButtonActions } from '../../../shared/entities/floating-action-buttons-actions.entity';
import { AgGridService } from '../../../shared/services/ag-grid.service';
import { MockDataProviderService } from '../../mock-data-provider.service';
import hiddenEnRessourceFile from './translations/en.json';
import hiddenFrRessourceFile from './translations/fr.json';
import { ListSearchDialogComponent } from './ux-dialog-list-search.component';
import { DialogComponent } from "./ux-dialog-text.component";

export interface User {
    name: string;
}

@Component({
    selector: 'atlas-ux-components-list',
    templateUrl: './ux-components-list.component.html',
    styleUrls: ['./ux-components-list.component.scss'],
})
export class UxComponentsListComponent implements OnInit {
    // --String ressources
    translationRessourceMap: Map<string, string> = new Map([
        ['DIALOG_CLOSED', ''],
    ]);

    destroy$ = new Subject();
    constructor(
        private http: HttpClient,
        private dialog: MatDialog,
        public gridService: AgGridService,
        public translateService: TranslateService,
        public atlasTranslationService: AtlasTranslationService,
        private agGridDataProvider: MockDataProviderService,
    ) {
        translateService.setTranslation('en', hiddenEnRessourceFile, true);
        translateService.setTranslation('fr', hiddenFrRessourceFile, true);
        this.names = [
            { name: 'Child 1', selected: false },
            { name: 'Child 2', selected: false },
            { name: 'Child 3', selected: false },
        ];

        this.atlasAgGridParam = this.gridService.getAgGridParam();

        translateService.onLangChange
            .pipe(
                concatMap((event: LangChangeEvent) => this.getTranslatedColumnDefs()),
            )
            .subscribe(() => {
                this.atlasTranslationService.getTranslatedRessourceMap(this.translationRessourceMap);
                this.gridApi.refreshHeader();
            });
    }
    links = ['First', 'Second', 'Third'];
    activeLink = this.links[0];

    selectedIndex: number = 0;
    atlasAgGridParam: AtlasAgGridParam;

    /**
     * For Dialog
     */

    dialogRef: MatDialogRef<DialogComponent>;

    /**
	 *  For checkbox
	 */
    names: any;
    selectedAll: any;
    indeterminate: false;

    // ag grid

    private gridApi: agGrid.GridApi;
    private gridColumnApi;
    rowData: any;
    quickSumModeActivated = false;
    selectedColumnsArray: Array<{ 'name': string, 'sum': number }> = new Array();
    columnDefs: agGrid.ColDef[];

    /**
	 * For Autocomplete
	 */
    myControl = new FormControl();
    options: User[] = [{ name: 'Mary' }, { name: 'Shelley' }, { name: 'Igor' }];
    filteredOptions: Observable<User[]>;

    /**
	 *  For custom input
	 */
    email = new FormControl('', [Validators.required, Validators.email]);
    animal: string;
    fname: string;

    /**
     * For FAB
     */

    fabMenuActions: FloatingActionButtonActions[];
    fabTitle: string;
    fabType: FABType;

    onGridReady(params) {
        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;
        this.gridColumnApi.autoSizeAllColumns();
        this.getTranslatedColumnDefs()
            .pipe(
                takeUntil(this.destroy$),
            ).subscribe(() => {
                this.gridApi.refreshHeader();
            });
    }

    showOrHideColum(event, col) {
        this.gridColumnApi.setColumnVisible(col.colId, col.hide || false);
        event.stopPropagation();
        return false;
    }
    onAddOrDeleteColumn(event) {
        const cols = this.columnDefs.filter(
            (col) => col.colId === event.column.colId,
        );
        if (cols.length !== 1) { return; }
        cols[0].hide = !event.visible;
    }
    onRangeSelectionChanged(event) {
        this.selectedColumnsArray = [];
        const rangeSelections = this.gridApi.getRangeSelections();
        if (!rangeSelections || rangeSelections.length === 0) {
            return;
        }
        const firstRange = rangeSelections[0];
        const startRow = Math.min(firstRange.start.rowIndex, firstRange.end.rowIndex);
        const endRow = Math.max(firstRange.start.rowIndex, firstRange.end.rowIndex);
        const api = this.gridApi;
        const columnIndex = 0;
        let sum = 0;
        let columnName: string;
        const selectedColumnsArray = this.selectedColumnsArray;
        firstRange.columns.forEach(function (column: any) {
            sum = 0;
            for (let rowIndex = startRow; rowIndex <= endRow; rowIndex++) {
                columnName = column.colDef.headerName;
                const rowModel = api.getModel();
                const rowNode = rowModel.getRow(rowIndex);
                const value = api.getValue(column, rowNode);
                if (typeof value === 'number') {
                    sum += value;
                }
            }
            selectedColumnsArray.push({ name: columnName, sum });
        });
        this.selectedColumnsArray = selectedColumnsArray;
    }

    toggleQuickSum() {
        this.quickSumModeActivated = !this.quickSumModeActivated;
        this.selectedColumnsArray = [];
    }
    onClearRange() {
        this.gridApi.clearRangeSelection();
        this.selectedColumnsArray = [];
    }
    applyFilter(filterValue: string) {
        this.gridApi.setQuickFilter(filterValue.trim().toLowerCase());
    }

    ngOnInit() {
        this.atlasTranslationService.getTranslatedRessourceMap(this.translationRessourceMap);
        // for ag-grid
        this.columnDefs = this.agGridDataProvider.getColumnDef();
        this.rowData = this.http.get('https://api.myjson.com/bins/15psn9');
        /**
		 * For Autocomplete
		 */
        this.filteredOptions = this.myControl.valueChanges.pipe(
            startWith<string | User>(''),
            map((value) => (typeof value === 'string' ? value : value.name)),
            map((name) => (name ? this._filter(name) : this.options.slice())),
        );
        // For FAB
        this.initFAB();
    }

    ngOnDestroy() {
        this.destroy$.next();
    }

    /**
	 * For Autocomplete
	 */
    displayFn(user?: User): string | undefined {
        return user ? user.name : undefined;
    }

    private _filter(name: string): User[] {
        const filterValue = name.toLowerCase();

        return this.options.filter(
            (option) => option.name.toLowerCase().indexOf(filterValue) === 0,
        );
    }

    getErrorMessage() {
        return this.email.hasError('required')
            ? 'You must enter a value'
            : this.email.hasError('email')
                ? 'Not a valid email'
                : '';
    }
    /**
	 *  For checkbox
	 */
    selectAll() {
        for (let i = 0; i < this.names.length; i++) {
            this.names[i].selected = this.selectedAll;
        }
    }
    checkIfAllSelected() {
        this.selectedAll = this.names.every(function (item: any) {
            return item.selected === true;
        });
    }
    checkIfOneSelected() {
        if (this.selectedAll === true) {
            this.indeterminate = false;
        } else {
            this.indeterminate = this.names.some(function (item: any) {
                return item.selected === true;
            });
        }
    }
    openAddFileDialog(): void {
        const dialogRef = this.dialog.open(DialogComponent, {
            width: '250px',
            data: { fname: this.fname, animal: this.animal },
        });

        dialogRef.afterClosed()
            .pipe(
                takeUntil(this.destroy$),
            ).subscribe((result) => {
                console.log(this.translationRessourceMap['DIALOG_CLOSED']);
                this.animal = result;
            });
    }

    openDialog(): void {
        const dialogRef = this.dialog.open(ListSearchDialogComponent, {
            width: '80%',
        });
    }

    // for tab matching index
    onSelectedIndexChanged(value: number) {
        this.selectedIndex = value;
    }

    /**
     * For FAB
     */
    initFAB() {
        this.fabTitle = 'FAB Button';
        this.fabType = FABType.MiniFAB;
        this.fabMenuActions = [
            {
                icon: 'edit',
                text: 'Edit Trade',
                action: 'editTrade',
                disabled: false,
                index: 1,
            },
            {
                icon: 'add',
                text: 'Create Trade',
                action: 'createTrade',
                disabled: false,
                index: 0,
            },
        ];
    }

    onFabActionClicked(action: string) {
        switch (action) {
            case 'createTrade': {
                console.log('createTrade');
                break;
            }
            case 'editTrade': {
                console.log('editTrade');
                break;
            }
        }
    }

    getTranslatedColumnDefs(): Observable<agGrid.ColDef[]> {
        const observableList: Array<Observable<string>> = [];
        this.columnDefs.forEach((column) => {
            if (column.colId) {
                const headerToTranslate: string = column.colId;
                observableList.push(this.translateService.get(headerToTranslate));
            }
        });

        return observableForkJoin(observableList).pipe(
            map((result: string[]) => {
                for (let i = 0; i < this.columnDefs.length; i++) {
                    if (this.columnDefs[i].colId) {
                        const headerNameTranslation: string = result[i];
                        this.gridApi.getColumnDef(this.columnDefs[i].colId).headerName = headerNameTranslation;
                    }
                }
                return this.columnDefs;
            }));
    }
}
