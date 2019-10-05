import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material';
import * as agGrid from 'ag-grid-community';
import { AgGridCheckboxComponent } from '../../../../../../shared/components/ag-grid-checkbox/ag-grid-checkbox.component';
import { ConfirmationDialogComponent } from '../../../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { TemplateWithTags } from '../../../../../../shared/dtos/template-with-tags.dto';
import { AtlasAgGridParam } from '../../../../../../shared/entities/atlas-ag-grid-param.entity';
import { AgGridService } from '../../../../../../shared/services/ag-grid.service';
import { SnackbarService } from '../../../../../../shared/services/snackbar.service';

@Component({
    selector: 'atlas-contract-template-list',
    templateUrl: './contract-template-list.component.html',
    styleUrls: ['./contract-template-list.component.scss'],
})
export class ContractTemplateListComponent implements OnInit {
    @Output() readonly closeTemplatesSidenavSelector = new EventEmitter();
    @Input() templatesGridRows: TemplateWithTags[];

    sideTemplateNavOpened: boolean;
    selectedTemplateId: number;

    gridOptions: agGrid.GridOptions;
    gridApi: agGrid.GridApi;
    gridColumnApi: agGrid.ColumnApi;
    gridComponents = {
        atlasCheckbox: AgGridCheckboxComponent,
    };
    atlasAgGridParam: AtlasAgGridParam;
    isSaveDisabled: boolean;

    colDefinition = [];

    constructor(
        public gridService: AgGridService,
        protected dialog: MatDialog,
    ) { }

    ngOnInit() {
        this.getTemplatesGridColDefinition();
        this.selectedTemplateId = 0;
        this.isSaveDisabled = true;
        this.atlasAgGridParam = this.gridService.getAgGridParam();

        this.gridOptions = {
            columnDefs: this.colDefinition,
            frameworkComponents: this.gridComponents,
            context: this.getContext(),
        };
    }

    onGridReady(params: agGrid.GridReadyEvent) {
        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;

        params.api.sizeColumnsToFit();
        this.gridColumnApi.resetColumnState();
    }

    getTemplatesGridColDefinition() {
        this.colDefinition = [
            {
                colId: 'entityId',
                headerName: 'templateId',
                field: 'entityId',
                hide: true,
            },
            {
                colId: 'name',
                headerName: 'Template Name',
                field: 'name',
                width: 300,
                maxWidth: 300,
                tooltip: (params) => {
                    return params.data.name;
                },
            },
            {
                colId: 'value',
                headerName: 'Value',
                field: 'value',
                width: 400,
                maxWidth: 700,
                tooltip: (params) => {
                    if (params.data.tags) {
                        return this.joinTagNames(params.data.tags);
                    }
                },
                valueGetter: (params) => {
                    if (params.data.tags) {
                        return this.joinTagNames(params.data.tags);
                    }
                },
            },
            {
                headerName: 'Select',
                colId: 'isSelected',
                field: 'isSelected',
                width: 200,
                cellRendererFramework: AgGridCheckboxComponent,
                onCellValueChanged: (params) => {
                    this.templatesGridRows.map((template) => {
                        template.isSelected = template.entityId === params.data.entityId && params.data.isSelected;
                    });

                    this.isSaveDisabled = !params.data.isSelected;

                    if (params.data.isSelected) {
                        this.selectedTemplateId = params.data.entityId;
                    }

                    this.gridColumnApi.resetColumnState();
                },
            },
        ];
    }

    joinTagNames(tags): string {
        const names = tags.map((tag) => tag.typeName);
        return names.join(', ');
    }

    getContext() {
        return {
            createKey: this.createKey,
        };
    }

    onDiscardButtonClick() {
        this.closeTemplatesSidenavSelector.emit(0);
    }

    onSideNavSaveButtonClick() {
        this.closeTemplatesSidenavSelector.emit(this.selectedTemplateId);
    }

    private createKey(rowId: string, column: agGrid.Column): string {
        return `${rowId}${column.getColId()}`;
    }
}
