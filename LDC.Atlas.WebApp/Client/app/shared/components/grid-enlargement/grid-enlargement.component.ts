import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { Router } from '@angular/router';
import * as agGrid from 'ag-grid-community';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UserGridViewDto } from '../../dtos/user-grid-view-dto.dto';
import { AtlasContextualAction } from '../../entities/atlas-contextual-action.entity';
import { UserGridPreferencesParameters } from '../../entities/user-grid-preferences-parameters.entity';
import { EnlargedGridDialogComponent } from './enlarged-grid-dialog/enlarged-grid-dialog.component';

@Component({
    selector: 'atlas-grid-enlargement',
    templateUrl: './grid-enlargement.component.html',
    styleUrls: ['./grid-enlargement.component.scss'],
})
export class GridEnlargementComponent implements OnInit, OnDestroy {
    @Input() gridOptions: agGrid.GridOptions;

    /* format :[{
        Text : string,
        Action: string,
        Disabled: boolean
    }]*/
    @Input() additionnalActions: AtlasContextualAction[] = null;
    @Input() hasRangeSelectionOption = false;
    @Input() summableColumns: string[] = [];
    userPreferences: UserGridPreferencesParameters;
    @Input() set userPreferencesParameters(parameters: UserGridPreferencesParameters) {
        this.userPreferences = parameters;
    }

    // tuple of [the list of grid views, and the one that was last used]
    @Output() readonly dialogClose = new EventEmitter<[UserGridViewDto[], UserGridViewDto]>();

    @Output() readonly rowSelected = new EventEmitter<any>();
    @Output() readonly rowClicked = new EventEmitter<any>();
    @Output() readonly rowDataChanged = new EventEmitter<any>();
    @Output() readonly cellSelected = new EventEmitter<any>();
    @Output() readonly cellValueChanged = new EventEmitter<any>();
    @Output() readonly additionalActionTriggered = new EventEmitter<any>();
    @Output() readonly columnVisibilityChanged = new EventEmitter<any>();
    @Output() readonly columnRowGroupChanged = new EventEmitter<any>();

    // -- enrich if needed for future customExports
    @Output() readonly customExcelExport = new EventEmitter<any>();

    isNavigation = false;

    private destroy$ = new Subject();

    dialogRef: MatDialogRef<EnlargedGridDialogComponent, any>;

    constructor(public dialog: MatDialog,
        protected router: Router) { }

    ngOnInit() {
    }

    onOpenDialogButtonClicked() {
        this.dialogRef = this.dialog.open(EnlargedGridDialogComponent, {
            width: '90%',
            height: '90%',
            maxWidth: '99vw',
            maxHeight: '99vh',
            data: {
                gridOptions: this.gridOptions,
                gridPreferencesParameters: this.userPreferences,
                additionalActions: this.additionnalActions,
                hasRangeSelectionOption: this.hasRangeSelectionOption,
                summableColumns: this.summableColumns,
            },
            autoFocus: false,
        });

        this.router.events.pipe(
            takeUntil(this.destroy$),
        ).subscribe(() => {
            this.isNavigation = true;
            this.dialogRef.close();
        });

        // -- Ag grid Events
        this.dialogRef.componentInstance.rowClicked().pipe(
            takeUntil(this.destroy$),
        ).subscribe((selectedRow: any) => {
            this.rowClicked.emit(selectedRow);
        });

        this.dialogRef.componentInstance.rowSelected().pipe(
            takeUntil(this.destroy$),
        ).subscribe((selectedRow: any) => {
            this.rowSelected.emit(selectedRow);
        });

        this.dialogRef.componentInstance.rowDataChanged().pipe(
            takeUntil(this.destroy$),
        ).subscribe((selectedRow: any) => {
            this.rowDataChanged.emit(selectedRow);
        });

        this.dialogRef.componentInstance.cellClicked().pipe(
            takeUntil(this.destroy$),
        ).subscribe((selectedCell: any) => {
            this.cellSelected.emit(selectedCell);
        });

        this.dialogRef.componentInstance.cellValueChanged().pipe(
            takeUntil(this.destroy$),
        ).subscribe((selectedCell: any) => {
            this.cellValueChanged.emit(selectedCell);
        });

        this.dialogRef.componentInstance.columnRowGroupChanged().pipe(
            takeUntil(this.destroy$),
        ).subscribe((columnRow: any) => {
            this.columnRowGroupChanged.emit(columnRow);
        });

        this.dialogRef.componentInstance.columnVisibiltyChanged().pipe(
            takeUntil(this.destroy$),
        ).subscribe((column: any) => {
            this.columnVisibilityChanged.emit(column);
        });
        // --

        this.dialogRef.componentInstance.actionTriggered().pipe(
            takeUntil(this.destroy$),
        ).subscribe((actionTriggered: any) => {
            this.additionalActionTriggered.emit(actionTriggered);
        });

        this.dialogRef.componentInstance.customExport().pipe(
            takeUntil(this.destroy$),
        ).subscribe((value: [boolean, string]) => {
            switch (value[1]) {
                case '.xlsx':
                    this.customExcelExport.emit(value[0]);
                    break;
                default: console.error('export format not recognized: ' + value[1]);
            }
        });

        this.dialogRef.beforeClose().pipe(
            takeUntil(this.destroy$),
        ).subscribe(() => {
            if (!this.isNavigation) {
                const dialogGridOptions: agGrid.GridOptions = this.dialogRef.componentInstance.getGridOptions();
                // get the grid view to send to parent component
                this.dialogClose.emit(
                    [this.dialogRef.componentInstance.getGridViews(),
                    this.dialogRef.componentInstance.getCurrentGridView()]);

                // make sure the lines are the same - to treat cases
                this.gridOptions.api.setRowData(dialogGridOptions.rowData);
                this.gridOptions.rowData = dialogGridOptions.rowData;

                // make sure the lines are ticked if checkbox selection is set
                dialogGridOptions.api.getSelectedNodes().forEach((selectedNode) => {
                    const node = this.gridOptions.api.getRowNode(selectedNode.id);
                    node.setSelected(true);
                });

                // filter the data in case there is column filtering
                this.gridOptions.api.setFilterModel(dialogGridOptions.api.getFilterModel());
            }
        });

        this.dialogRef.afterClosed().pipe(
            takeUntil(this.destroy$),
        ).subscribe(() => {
            this.dialogRef = null;
            this.destroy$.next();
        });
    }

    mapSelectedRowInGridOptions(gridOptions: agGrid.GridOptions) {
        if (this.dialogRef && gridOptions.api) {
            this.dialogRef.componentInstance.getGridOptions().api.getSelectedNodes().forEach((selectedNode) => {
                const node = gridOptions.api.getRowNode(selectedNode.id);
                node.setSelected(true);
            });
        }
    }

    refreshGrid() {
        if (this.dialogRef) {
            this.dialogRef.componentInstance.refreshGrid();
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next();
    }
}
