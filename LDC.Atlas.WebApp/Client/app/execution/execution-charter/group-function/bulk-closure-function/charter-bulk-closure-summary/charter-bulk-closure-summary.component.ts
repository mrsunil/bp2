import { Component, OnInit } from '@angular/core';
import { CharterBulkClosure } from '../../../../../shared/entities/charter-bulk-closure.entity';
import { CharterMatrixData } from '../charter-bulk-closure-matrix/charter-matrix-data';
import { SectionMatrixData } from '../charter-bulk-closure-matrix/section-matrix-data';
import * as agGrid from 'ag-grid-community';
import { AtlasAgGridParam } from '../../../../../shared/entities/atlas-ag-grid-param.entity';
import { AgGridService } from '../../../../../shared/services/ag-grid.service';

@Component({
    selector: 'atlas-charter-bulk-closure-summary',
    templateUrl: './charter-bulk-closure-summary.component.html',
    styleUrls: ['./charter-bulk-closure-summary.component.scss']
})
export class CharterBulkClosureSummaryComponent implements OnInit {

    chartersForSummary: CharterBulkClosure[] = [];
    columnDefs;
    rowData: any[] = [];
    bulkClosureGridOptions: agGrid.GridOptions = {};
    gridParams;
    gridContext = {
        gridEditable: false,
        componentParent: this,
    };
    getNodeChildDetails;
    gridApi;
    gridColumnApi;
    atlasAgGridParam: AtlasAgGridParam;

    constructor(public gridService: AgGridService, ) { }

    ngOnInit() {
        this.getGridColumns();
        this.atlasAgGridParam = this.gridService.getAgGridParam();
    }

    charterForClosureSummary(charters: CharterBulkClosure[]) {
        this.chartersForSummary = charters;
        this.initializeGridRows();
    }

    getGridColumns() {
        this.columnDefs = [
            {
                headerName: 'Closed Charters',
                field: "rowHeader",
                cellRenderer: "agGroupCellRenderer",

            }];
        this.getNodeChildDetails = this.getNodeChildDetailsForTreeData;
    }

    getNodeChildDetailsForTreeData(rowItem) {
        if (rowItem.sectionsAssigned) {
            return {
                group: true,
                expanded: true,
                children: rowItem.sectionsAssigned,
                key: rowItem.charterId
            };
        } else {
            return null;
        }
    };

    initializeGridRows() {
        let treeStructuredCharter: CharterMatrixData[] = [];
        this.chartersForSummary.forEach((charter) => {
            let charterTree: CharterMatrixData = new CharterMatrixData();
            charterTree.sectionsAssigned = [];
            let sectionTree: SectionMatrixData[] = [];
            charterTree.charterId = charter.charterId;
            charterTree.category = charter.category;
            charterTree.charterCode = charter.charterCode;
            charterTree.vesselName = charter.vesselName;
            charterTree.rowHeader = `${charter.charterCode} - ${charter.vesselName}`;
            if (charter.sectionsAssigned) {
                charter.sectionsAssigned.forEach((section) => {
                    sectionTree.push({
                        message: '',
                        category: section.category,
                        netAccuralPnLValue: section.netAccuralPnLValue,
                        percentageInvoice: section.percentageInvoice,
                        rowHeader: section.contractSectionCode,
                        sectionId: section.sectionId,
                        contractSectionCode: section.contractSectionCode,
                        sectionDetails: section.contractSectionCode
                    })
                })
                charterTree.sectionsAssigned = sectionTree;
            }
            treeStructuredCharter.push(charterTree);

        });

        this.rowData = treeStructuredCharter;
        this.bulkClosureGridOptions = {
            context: this.gridContext,
            rowHeight: 35,
        };
        this.autoSizeContractsGrid();
    }

    onGridReady(params) {
        params.columnDefs = this.columnDefs;
        this.gridParams = params;
        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;
        this.gridApi.showNoRowsOverlay();
        params.api.sizeColumnsToFit();
    }

    autoSizeContractsGrid() {
        if (!this.gridApi) return;

        setTimeout(() => {
            this.gridApi.sizeColumnsToFit();
            this.gridApi.onRowHeightChanged();
            this.gridApi.refreshCells(this.gridParams)
        });
    }

}
