import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material';
import * as agGrid from 'ag-grid-community';
import { Observable, of } from 'rxjs';
import { AgGridCheckboxComponent } from '../../../../../shared/components/ag-grid-checkbox/ag-grid-checkbox.component';
import { AgGridSelectComponent } from '../../../../../shared/components/ag-grid-select/ag-grid-select.component';
import { ConfirmationDialogComponent } from '../../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { PagingOptions } from '../../../../../shared/entities/http-services/paging-options';
import { MasterdataService } from '../../../../../shared/services/http-services/masterdata.service';
import { CommoditySearchTerm } from '../../../../../shared/services/masterdata/dtos/commodity-search-term';
import { SnackbarService } from '../../../../../shared/services/snackbar.service';

@Component({
    selector: 'atlas-templates-sidenav-selector',
    templateUrl: './templates-sidenav-selector.component.html',
    styleUrls: ['./templates-sidenav-selector.component.scss'],
})
export class TemplatesSidenavSelectorComponent implements OnInit {
    @Output() readonly closeParamsSidenavSelector = new EventEmitter();
    @Input() paramsFormGroup: FormGroup = new FormGroup({});

    constructor(protected snackbarService: SnackbarService, protected masterdataService: MasterdataService, protected dialog: MatDialog) {}

    gridOptions: agGrid.GridOptions;
    gridApi: agGrid.GridApi;
    gridColumnApi: agGrid.ColumnApi;
    gridComponents = {
        atlasCheckbox: AgGridCheckboxComponent,
        atlasSelect: AgGridSelectComponent,
    };

    ngOnInit() {
        this.gridOptions = null;
    }

    onGridReady(params: agGrid.GridReadyEvent) {
        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;

        params.api.sizeColumnsToFit();
    }

    createFormControls() {
        const columns = this.gridColumnApi.getAllColumns();
    }
    // Parameters
    /**
     * Returns the column definition for the sidebar-table of parameters
     */
    getParametersGridColDefinition(): agGrid.ColDef[] {
        return [
            {
                colId: 'templateId',
                headerName: 'templateId',
                field: 'value',
                hide: true,
            },
            {
                colId: 'templateName',
                headerName: 'Template Name',
                field: 'value',
                width: 300,
                maxWidth: 300,
            },
            {
                colId: 'value',
                headerName: 'Value',
                field: 'value',
                width: 400,
                maxWidth: 700,
            },
            {
                headerName: 'Select',
                field: '',
                width: 300,
                maxWidth: 300,
            },
        ];
    }

    getContext() {
        return {
            formGroup: this.paramsFormGroup,
            createKey: this.createKey,
        };
    }

    onSaveButtonClicked() {
    }

    onDiscardButtonClicked() {

    }

    private createKey(rowId: string, column: agGrid.Column): string {
        return `${rowId}${column.getColId()}`;
    }

}
