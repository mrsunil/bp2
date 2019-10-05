import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import * as agGrid from 'ag-grid-community';
import { forkJoin, Observable, Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { CompanyManagerService } from '../../../../core/services/company-manager.service';
import { AgGridService } from '../../../services/ag-grid.service';
import { MasterdataService } from '../../../services/http-services/masterdata.service';
import { AtlasAgGridParam } from './../../../entities/atlas-ag-grid-param.entity';
import { ColumnConfigurationProperties } from './../../../entities/grid-column-configuration.entity';
import { GridConfigurationProviderService } from './../../../services/grid-configuration-provider.service';
import { UiService } from './../../../services/ui.service';
import { UtilService } from './../../../services/util.service';

@Component({
    selector: 'atlas-contextual-search-base-light-box',
    templateUrl: './contextual-search-base-light-box.component.html',
    styleUrls: ['./contextual-search-base-light-box.component.scss'],
})
export class ContextualSearchBaseLightBoxComponent implements OnInit, OnDestroy {
    gridOptions: agGrid.GridOptions;
    gridApi: agGrid.GridApi;
    gridColumnApi: agGrid.ColumnApi;
    gridId: string;
    company: string;
    lightboxTitle: string;
    rowData: any[];
    atlasAgGridParam: AtlasAgGridParam;
    isLoading = true;
    destroy$ = new Subject();

    columnDefs: agGrid.ColDef[];
    rowSelection = 'single';
    headerCheckBoxSelection = true;

    constructor(
        public thisDialogRef: MatDialogRef<ContextualSearchBaseLightBoxComponent>,

        @Inject(MAT_DIALOG_DATA) public data: {
            gridId: string,
            rowData$: Observable<any[]>,
            multiselect?: boolean, // this parameter is used mainly for list and search picklist

        },
        protected companyManager: CompanyManagerService,
        protected gridConfigurationProvider: GridConfigurationProviderService,
        protected masterdataService: MasterdataService,
        protected uiService: UiService,
        protected utilService: UtilService,
        public gridService: AgGridService,
    ) {
        this.atlasAgGridParam = this.gridService.getAgGridParam();
        this.gridId = data.gridId;
        this.company = this.companyManager.getCurrentCompanyId();
    }

    initColumns(configuration: ColumnConfigurationProperties[]) {
        this.columnDefs = [];
        if (this.data.multiselect) {
            this.rowSelection = 'multiple';
            this.columnDefs.push(
                {
                    headerName: '',
                    colId: 'selection',
                    headerCheckboxSelection: this.headerCheckBoxSelection,
                    checkboxSelection: true,
                    maxWidth: 50,
                    pinned: 'left',
                });
        }
        this.columnDefs = this.columnDefs.concat(configuration.map((config: ColumnConfigurationProperties) => {
            return {
                headerName: config.friendlyName,
                field: this.utilService.convertToCamelCase(config.fieldName),
                hide: !config.isVisible,
                filter: this.uiService.getFilterTypeForGridType(config.gridType),
            };
        }));

        if (this.gridApi) {
            if (this.gridApi) { this.gridApi.sizeColumnsToFit(); }
        }
        if (this.gridOptions) {
            this.gridOptions.columnDefs = this.columnDefs;
        }
    }

    ngOnInit() {
        forkJoin([this.data.rowData$,
        this.gridConfigurationProvider.getConfiguration(this.company, this.gridId)])
            .pipe(
                finalize(() => {
                    this.isLoading = false;
                }),
                takeUntil(this.destroy$),
            )
            .subscribe(([data, configuration]) => {
                this.rowData = data;
                this.lightboxTitle = configuration.name;
                const columnConfiguration: ColumnConfigurationProperties[] = configuration.columns;
                this.initColumns(columnConfiguration);
            });
    }

    onGridReady(params) {
        this.gridOptions = params;
        this.gridOptions.columnDefs = this.columnDefs;
        this.gridApi = this.gridOptions.api;
        this.gridColumnApi = this.gridOptions.columnApi;

        if (this.gridApi) {
            this.gridApi.setRowData(this.rowData);
            this.refreshSelectedColumns();
            this.gridApi.sizeColumnsToFit();
        }

        window.onresize = () => {
            if (this.gridApi) { this.gridApi.sizeColumnsToFit(); }
        };
    }

    onGridSizeChanged(params) {
        this.gridColumnApi = params.columnApi;
        if (this.gridOptions && this.gridOptions.api) { this.gridOptions.api.sizeColumnsToFit(); }
    }

    onRowClicked(event) {
        if (!this.data.multiselect) {
            this.thisDialogRef.close(event.data);
        }
    }

    getMainMenuItems(params) {
        return this.uiService.getMainMenuItems(params);
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    onMultipleSelectConfirmButtonClicked() {
        const selectedItems = this.gridApi.getSelectedRows();
        this.thisDialogRef.close(selectedItems);
    }

    refreshSelectedColumns() {
        if (this.data.multiselect && this.gridApi) {
            this.gridApi.forEachNode((node) => {
                node.setSelected(node.data['isSelected'] ? true : false);
            });
        }
    }
}
