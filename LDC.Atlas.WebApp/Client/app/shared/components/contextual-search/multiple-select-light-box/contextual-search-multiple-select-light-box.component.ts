import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ContextualSearchBaseLightBoxComponent } from '../base-light-box/contextual-search-base-light-box.component';
import { CompanyManagerService } from './../../../../core/services/company-manager.service';
import { ColumnConfigurationProperties } from './../../../entities/grid-column-configuration.entity';
import { AgGridService } from './../../../services/ag-grid.service';
import { GridConfigurationProviderService } from './../../../services/grid-configuration-provider.service';
import { MasterdataService } from './../../../services/http-services/masterdata.service';
import { UiService } from './../../../services/ui.service';
import { UtilService } from './../../../services/util.service';

@Component({
    selector: 'atlas-contextual-search-multiple-select-light-box',
    templateUrl: './contextual-search-multiple-select-light-box.component.html',
    styleUrls: ['./contextual-search-multiple-select-light-box.component.scss'],
})
export class ContextualSearchMultipleSelectLightBoxComponent
    extends ContextualSearchBaseLightBoxComponent implements OnInit, OnDestroy {

    filterControl: FormControl = new FormControl();
    filteredRow: any[] = [];
    dataHasChanged: boolean = false;
    headerCheckBoxSelection = false;

    constructor(
        public thisDialogRef: MatDialogRef<ContextualSearchBaseLightBoxComponent>,
        @Inject(MAT_DIALOG_DATA) public data: {
            gridId: string,
            rowData$: Observable<any[]>,
            lightboxTitle: string,
            currentFilter: string,
            valueProperty: string,
            codeProperty: string,
            displayProperty: string,
            gridConfig: ColumnConfigurationProperties[],
            multiselect: boolean,
        },
        protected companyManager: CompanyManagerService,
        protected gridConfigurationProvider: GridConfigurationProviderService,
        protected masterdataService: MasterdataService,
        protected uiService: UiService,
        protected utilService: UtilService,
        public gridService: AgGridService,
    ) {
        super(
            thisDialogRef,
            {
                gridId: '',
                rowData$: data.rowData$,
                multiselect: true,
            },
            companyManager, gridConfigurationProvider,
            masterdataService, uiService, utilService, gridService);

        this.lightboxTitle = data.lightboxTitle;
        this.data.multiselect = true;
    }

    ngOnInit() {
        this.rowData = [];
        this.data.rowData$
            .pipe(
                takeUntil(this.destroy$),
            ).subscribe((data) => {
                this.rowData = data;
                this.filterData();
            });
        this.initColumns(this.data.gridConfig);
        this.filterControl.valueChanges.pipe(
            takeUntil(this.destroy$),
        ).subscribe(() => {
            this.filterData();
        });
        this.filterControl.setValue(this.data.currentFilter);
    }

    filterData() {
        const value = this.filterControl.value;
        this.filteredRow = value ? this.rowData.filter((row) =>
            row[this.data.codeProperty].startsWith(value)
            || (this.data.displayProperty && row[this.data.displayProperty].startsWith(value))) : this.rowData;
        if (this.gridOptions && this.gridOptions.api) {
            this.gridOptions.api.setRowData(this.filteredRow);
            // this.gridOptions.api.redrawRows();
            this.gridOptions.api.forEachNode((node) => {
                const data = this.rowData.find((row) => row[this.data.valueProperty] === node.data[this.data.valueProperty]);
                if (data && data.isSelected) {
                    node.setSelected(true);
                }
            });
            this.dataHasChanged = true;
        }
    }

    onRowSelected(event) {
        this.rowData.filter((row) => row[this.data.valueProperty] === event.node.data[this.data.valueProperty])
            .forEach((row) => row.isSelected = event.node.selected);
    }

    onRowDataChanged() {
        if (this.gridOptions && this.gridOptions.api && this.dataHasChanged) {
            this.gridOptions.api.forEachNode((node) => {
                const data = this.rowData.find((row) => row[this.data.valueProperty] === node.data[this.data.valueProperty]);
                if (data && data.isSelected) {
                    node.setSelected(true);
                }
            });
            this.dataHasChanged = false;
        }
    }

    onGridReady(params) {
        this.gridOptions = params;
        this.gridOptions.columnDefs = this.columnDefs;
        this.gridOptions.api.forEachNode((node) => {
            if (node.data.isSelected) {
                node.setSelected(true);
            }
        });
        this.gridApi = this.gridOptions.api;
        this.gridColumnApi = this.gridOptions.columnApi;

        if (this.gridApi) { this.gridApi.sizeColumnsToFit(); }

        window.onresize = () => {
            if (this.gridApi) { this.gridApi.sizeColumnsToFit(); }
        };
    }

    onRowClicked(event) {
        // Do nothing
    }

    onMultipleSelectConfirmButtonClicked() {
        this.thisDialogRef.close(this.rowData.filter((option) => option.isSelected));
    }
}
