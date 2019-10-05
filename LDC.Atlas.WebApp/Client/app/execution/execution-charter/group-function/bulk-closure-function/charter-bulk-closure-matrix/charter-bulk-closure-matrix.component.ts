import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import * as agGrid from 'ag-grid-community';
import { AuthorizationService } from '../../../../../core/services/authorization.service';
import { CompanyManagerService } from '../../../../../core/services/company-manager.service';
import { BaseFormComponent } from '../../../../../shared/components/base-form-component/base-form-component.component';
import { FormConfigurationProviderService } from '../../../../../shared/services/form-configuration-provider.service';
import { TradingService } from '../../../../../shared/services/http-services/trading.service';
import { SnackbarService } from '../../../../../shared/services/snackbar.service';
import { CharterBulkClosure } from '../../../../../shared/entities/charter-bulk-closure.entity';
import { CharterMatrixData } from './charter-matrix-data';
import { AgGridHyperlinkForCharterBulkClosureComponent } from '../../../ag-grid-hyperlink-for-charter-bulk-closure/ag-grid-hyperlink-for-charter-bulk-closure.component'
import { AgGridCharterStatusForCharterBulkClosureComponent } from '../../../ag-grid-charterstatus-for-charter-bulk-closure/ag-grid-charterstatus-for-charter-bulk-closure.component';
import { AtlasAgGridParam } from '../../../../../shared/entities/atlas-ag-grid-param.entity';
import { AgGridService } from '../../../../../shared/services/ag-grid.service';
import { AgGridHyperlinkComponent } from '../../../../../shared/components/ag-grid-hyperlink/ag-grid-hyperlink.component';
import { AssignedSectionToCharterBulkClosure } from '../../../../../shared/entities/assigned-section-to-charter-bulk-closure.entity';
import { SectionMatrixData } from './section-matrix-data'
@Component({
    selector: 'atlas-charter-bulk-closure-matrix',
    templateUrl: './charter-bulk-closure-matrix.component.html',
    styleUrls: ['./charter-bulk-closure-matrix.component.scss'],
})

export class CharterBulkClosureMatrixComponent extends BaseFormComponent implements OnInit {
    gridApi;
    gridColumnApi;
    gridParam;
    columnDefs;
    atlasAgGridParam: AtlasAgGridParam;
    rowData: any[] = [];
    getNodeChildDetails;
    tooltipMessage: string = 'Trade Status';
    selectAllCharterToClose: boolean;
    @Input() charterDetailsMatrix: CharterBulkClosure[];
    @Input() chartersLength: number;
    isGridReady: boolean = false;
    bulkClosureGridOptions: agGrid.GridOptions = {};
    gridContext = {
        gridEditable: false,
        componentParent: this,
    };
    @Output() readonly chartersClose = new EventEmitter<boolean>();
    @Output() readonly closeCharterGridReady = new EventEmitter<boolean>();
    chartersForConfirmClosure: CharterBulkClosure[];

    constructor(protected formConfigurationProvider: FormConfigurationProviderService,
        protected dialog: MatDialog,
        protected snackbarService: SnackbarService,
        protected companyManager: CompanyManagerService,
        protected router: Router,
        protected authorizationService: AuthorizationService,
        protected tradingService: TradingService,
        public gridService: AgGridService,
    ) {
        super(formConfigurationProvider);
    }

    ngOnInit() {
        this.getGridColumns();
        this.atlasAgGridParam = this.gridService.getAgGridParam();
    }

    ngAfterContentChecked() {
        if (this.charterDetailsMatrix.length === this.chartersLength && !this.isGridReady) {
            this.initializeRows();
        }
    }

    getGridColumns() {
        this.columnDefs = [
            {
                headerName: '',
                field: "rowHeader",
                colSpan: function (params) {
                    return params.data.charterId ? 5 : 1;
                },
                cellClass: function (params) {
                    let className: string;

                    if (params.data.charterId && params.data.category === 'red') {
                        className = 'disabled-checkbox cat-red';
                    }
                    if (params.data.charterId && params.data.category === 'green') {
                        className = 'cat-grn';
                    }
                    if (params.data.charterId && params.data.category === 'orange') {
                        className = 'cat-org';
                    }
                    return className;
                },
                cellRenderer: "agGroupCellRenderer",
                cellRendererParams: {
                    checkbox: (params) => {
                        if (params.data.sectionId) {
                            return false;
                        }
                        return true;
                    },
                    suppressCount: true,
                    innerRendererFramework: AgGridCharterStatusForCharterBulkClosureComponent,
                },

            },
            {
                headerName: "",
                field: "sectionDetails",
                cellRendererFramework: AgGridHyperlinkComponent,
                cellRendererParams: {
                    context: {
                        componentParent: this,
                    },
                },
            },
            {
                headerName: "Status",
                field: "message",
                cellStyle: (params) => {
                    if (params.value) {
                        if (params.data.message === 'Cost Accrual' || params.data.message === 'Invoices not cash matched') {
                            return { backgroundColor: 'LightSalmon', borderRadius: '2px !important;' };
                        }
                        if (params.data.message === 'Invoices not posted' || params.data.message === 'Cargo Accrual'
                            || params.data.message === 'No BL date, Unrealized Contract' || params.data.message === 'Trade is Already Blocked') {
                            return { backgroundColor: 'LightCoral', borderRadius: '2px !important;' };
                        }
                    }
                },
                cellRendererFramework: AgGridHyperlinkForCharterBulkClosureComponent,
                cellRendererParams: {
                    context: {
                        componentParent: this,
                    },
                },

                tooltip: (params) => {
                    if (params.data) {
                        if (params.data.message === 'Cost accrual') {
                            this.tooltipMessage = 'link to ‘cost’ tab';
                        }
                        else if (params.data.message === 'Invoices not cash matched') {
                            this.tooltipMessage = 'link to ‘Invoice marking’ tab';
                        }
                        else if (params.data.message === 'Cargo Accrual') {
                            this.tooltipMessage = 'link to ‘Invoice marking’ tab';
                        }
                        else if (params.data.message === 'Invoices not posted') {
                            this.tooltipMessage = 'link to ‘Invoice marking’ tab';
                        }

                        return this.tooltipMessage;
                    }

                },
            },
            {
                headerName: "Net accrual/ P&L value",
                field: "netAccuralPnLValue",
            },
            {
                headerName: "%Invoice",
                field: "percentageInvoice",
            }
        ];
        this.getNodeChildDetails = function getNodeChildDetails(rowItem) {
            if (rowItem.sectionsAssigned) {
                return {
                    group: true,
                    expanded: false,
                    children: rowItem.sectionsAssigned,
                    key: rowItem.charterId,
                    checkboxSelection: true
                };
            } else {
                return null;
            }
        };
    }

    initializeRows() {
        let treeStructuredCharter: CharterMatrixData[] = [];
        this.charterDetailsMatrix.forEach((charter) => {
            let charterTree: CharterMatrixData = new CharterMatrixData();
            charterTree.sectionsAssigned = [];
            let sectionTree: SectionMatrixData[] = [];
            charterTree.charterId = charter.charterId;
            charterTree.category = charter.category;
            charterTree.charterCode = charter.charterCode;
            charterTree.vesselName = charter.vesselName;
            charterTree.description = charter.description ? charter.description : '';
            if (charter.category === 'green') {
                charterTree.rowHeader = `${charterTree.charterCode} - Vessel : ${charterTree.vesselName} - Department : ${charterTree.description} - Allowed for closure`;
            }
            if (charter.category === 'orange') {
                charterTree.rowHeader = `${charterTree.charterCode} - Vessel : ${charterTree.vesselName} - Department : ${charterTree.description} - Risky for closure`;
            }
            if (charter.category === 'red') {
                charterTree.rowHeader = `${charterTree.charterCode} - Vessel : ${charterTree.vesselName} - Department : ${charterTree.description} - Unavailable for closure`;
            }
            if (charter.sectionsAssigned) {
                charter.sectionsAssigned.forEach((section) => {
                    sectionTree.push({
                        message: section.message,
                        category: section.category,
                        netAccuralPnLValue: this.getNetAccuralAndPnlValue(section),
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
        treeStructuredCharter.sort((compareTo, compareFrom) => {
            if (compareTo.category === 'green' && (compareFrom.category === 'orange' || compareFrom.category === 'red')) {
                return -1;
            }
            else if (compareTo.category === 'orange' && compareFrom.category === 'red') {
                return -1;
            }
            else {
                return 1;
            }
        });
        this.rowData = treeStructuredCharter;
        this.bulkClosureGridOptions = {
            context: this.gridContext,
            rowSelection: 'multiple',
        };
        this.isGridReady = true;
        this.autoSizeContractsGrid();
        this.closeCharterGridReady.emit(true);
    }

    getNetAccuralAndPnlValue(section: AssignedSectionToCharterBulkClosure): string {
        let result: string = '0';
        if (section.netAccuralPnLValue === 0) {
            if (section.costAssigned.length > 0) {
                for (let i = 0; i < section.costAssigned.length; i++) {
                    if (section.costAssigned[i].netAccrual !== 0 && result === '0') {
                        result = section.costAssigned[i].netAccrual.toString() + ' ' + section.costAssigned[i].currencyCode;
                    }
                }
            }
        }
        else {
            result = section.netAccuralPnLValue.toString() + ' ' + section.currencyCode;
        }
        return result;
    }

    onGridReady(params) {
        params.columnDefs = this.columnDefs;
        this.gridParam = params;
        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;
        this.gridApi.forEachNode((node) => {
            if (node.data.charterId && node.data.category === 'green') {
                node.setSelected(true);
            }
        });
        setTimeout(() => {
            this.gridParam.api.sizeColumnsToFit();
        });
    }

    onSelectionChanged(event) {
        this.gridApi.forEachNode((node) => {
            if (node.data.charterId && node.data.category === 'red') {
                node.setSelected(false);
                node.selectable = false;
            }
        });

        const chartersRowsForClosure = this.gridApi.getSelectedRows();
        if (chartersRowsForClosure.length > 0) {
            this.chartersClose.emit(true);
        }
        else {
            this.chartersClose.emit(false);
        }
        this.gridApi.refreshCells(event.data);
        this.chartersForConfirmClosure = chartersRowsForClosure;
        if (this.chartersForConfirmClosure.length === this.rowData.filter((c) => c.category !== 'red').length) {
            this.selectAllCharterToClose = true;
        }
        else {
            this.selectAllCharterToClose = false;
        }

    }

    autoSizeContractsGrid() {
        if (!this.gridApi) return;

        setTimeout(() => {
            this.gridApi.sizeColumnsToFit();
            this.gridApi.onRowHeightChanged();
        });
    }

    onSelectAllClicked(input: boolean) {
        this.gridApi.forEachNode((node) => {
            if (node.data.charterId && node.data.category === 'green') {
                node.setSelected(input);
            }
        });
    }

    hyperlinkClicked(rowSelected: SectionMatrixData, event) {
        const link = `${this.companyManager.getCurrentCompanyId()}/trades/display/${rowSelected.sectionId}`;
        window.open(link, '_blank');
    }
}