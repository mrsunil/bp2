import { Injectable } from '@angular/core';
import * as agGrid from 'ag-grid-community';
import { AtlasAgGridParam } from '../entities/atlas-ag-grid-param.entity';

@Injectable({
    providedIn: 'root',
})

export class AgGridService {

    atlasAgGridParam: AtlasAgGridParam;

    constructor() {
        this.atlasAgGridParam = new AtlasAgGridParam();
        this.atlasAgGridParam.rowHeight = 24;
        this.atlasAgGridParam.headerHeight = 48;
    }

    public getAgGridParam(): AtlasAgGridParam {
        return this.atlasAgGridParam;
    }

    public getGridDefaultRowHeight(): number {
        return this.atlasAgGridParam.rowHeight;
    }

    public sizeColumns(gridOptions: agGrid.GridOptions) {
        if (gridOptions) {
            if (gridOptions.columnApi) {
                gridOptions.columnApi.autoSizeAllColumns(); // to assure that all columns have a width before checking condition
            }

            if (gridOptions.api && gridOptions.api['gridPanel'] && gridOptions.api['gridPanel']['columnController']) {

                const availableWidth = gridOptions.api['gridPanel'].getWidthForSizeColsToFit();
                const columns = gridOptions.api['gridPanel']['columnController'].getAllDisplayedColumns();
                const usedWidth = gridOptions.api['gridPanel']['columnController'].getWidthOfColsInList(columns);

                if (gridOptions.api && usedWidth <= availableWidth) {
                    gridOptions.api.sizeColumnsToFit();
                }
            }
        }
    }
}
