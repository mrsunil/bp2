import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import * as agGrid from 'ag-grid-community';
import { AuthorizationService } from '../../../../../core/services/authorization.service';
import { CompanyManagerService } from '../../../../../core/services/company-manager.service';
import { AtlasAgGridParam } from '../../../../../shared/entities/atlas-ag-grid-param.entity';
import { Company } from '../../../../../shared/entities/company.entity';
import { MasterData } from '../../../../../shared/entities/masterdata.entity';
import { Trader } from '../../../../../shared/entities/trader.entity';
import { AgGridService } from '../../../../../shared/services/ag-grid.service';
import { FormConfigurationProviderService } from '../../../../../shared/services/form-configuration-provider.service';
import { TradingService } from '../../../../../shared/services/http-services/trading.service';
import { SnackbarService } from '../../../../../shared/services/snackbar.service';
import { TradeEditService } from '../../../../../shared/services/trade-edit.service';
import { ContractsForBulkFunctions } from '../../../../../shared/services/trading/dtos/contracts-for-bulk-functions';
import { UiService } from '../../../../../shared/services/ui.service';
import { ContractsForBulkClosureFunctions } from '../../../../../shared/services/trading/dtos/contracts-for-bulk-closure-functions';



@Component({
    selector: 'atlas-summary-closure-matrix',
    templateUrl: './summary-closure-matrix.component.html',
    styleUrls: ['./summary-closure-matrix.component.scss']
})
export class SummaryClosureMatrixComponent implements OnInit {
    company: string;
    atlasAgGridParam: AtlasAgGridParam;
    gridApi: agGrid.GridApi;
    gridColumnApi: agGrid.ColumnApi;
    bulkClosureGridColumns: agGrid.ColDef[];
    bulkClosureGridOptions: agGrid.GridOptions = {};
    bulkClosureGridRows = [];
    bulkEditGridRows: ContractsForBulkFunctions[];
    bulkContractGridRows: ContractsForBulkClosureFunctions[];
    traders: Trader[] = [];
    masterdata: MasterData;
    columnDefs: agGrid.ColDef[];
    copyselectedallocatedIds = [];
    companyConfiguration: Company;
    gridContext = {
        gridEditable: true,
        componentParent: this,
    };
    gridComponents = {
    };
    constructor(
        private gridService: AgGridService,
        protected dialog: MatDialog,
        protected snackbarService: SnackbarService,
        private route: ActivatedRoute,
        protected companyManager: CompanyManagerService,
        protected authorizationService: AuthorizationService,
        protected tradingService: TradingService,
    ) { }


    ngOnInit() {
        this.masterdata = this.route.snapshot.data.masterdata;
        this.company = this.route.snapshot.paramMap.get('company');
        this.companyConfiguration = this.companyManager.getCompany(this.company);
        this.atlasAgGridParam = this.gridService.getAgGridParam();
        this.initializeGridColumns();
    }

    ContractsForClosureSummary(contracts: ContractsForBulkClosureFunctions[]) {
        this.bulkContractGridRows = contracts;
        this.initializeGridRows();
    }

    onColumnVisibilityChanged(event: any) {
    }

    isGridEditable(params): boolean {
        return params.context.gridEditable;
    }
    initializeGridColumns() {
        this.bulkClosureGridOptions = {
            context: this.gridContext,
        };

        this.bulkClosureGridColumns =
            [
                {
                    headerName: 'Contract',
                    field: 'contractLabel',
                    colId: 'contractLabel',
                },
                {
                    headerName: 'Status',
                    field: ' status',
                    colId: ' status',
                },
                {
                    headerName: 'Net accrual/P&L impact ',
                    field: 'netaccrual',
                    colId: 'netaccrual',
                },
                {
                    headerName: '%Invoice ',
                    field: 'invoice',
                    colId: 'invoice',
                },
            ];
    }

    initializeGridRows() {
        this.bulkClosureGridRows = [];
        let obj;
        this.bulkContractGridRows.forEach((contract) => {
            obj = {
                contractLabel: [contract.contractLabel[1]],
                netaccrual: contract.netaccrual,
                invoice: contract.invoice,
                status: contract.status,
            };
            this.bulkClosureGridRows.push(obj);
        });
    }

    onGridReady(params) {
        params.columnDefs = this.bulkClosureGridColumns;
        this.bulkClosureGridOptions = params;
        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;
        this.gridApi.showNoRowsOverlay();
        this.autoSizeContractsGrid();
    }

    autoSizeContractsGrid() {
        if (!this.gridApi) return;

        setTimeout(() => {
            this.gridApi.sizeColumnsToFit();
        });
    }
}
