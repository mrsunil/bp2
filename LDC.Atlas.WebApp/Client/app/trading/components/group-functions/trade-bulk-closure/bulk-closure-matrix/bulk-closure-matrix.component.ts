import { Component, OnInit, Output, EventEmitter, HostListener } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router, ChildActivationEnd } from '@angular/router';
import * as agGrid from 'ag-grid-community';
import { AuthorizationService } from '../../../../../core/services/authorization.service';
import { CompanyManagerService } from '../../../../../core/services/company-manager.service';
import { BaseFormComponent } from '../../../../../shared/components/base-form-component/base-form-component.component';
import { AtlasAgGridParam } from '../../../../../shared/entities/atlas-ag-grid-param.entity';
import { Company } from '../../../../../shared/entities/company.entity';
import { MasterData } from '../../../../../shared/entities/masterdata.entity';
import { TradePropertyPrivilege } from '../../../../../shared/entities/trade-property-privilege.entity';
import { Trader } from '../../../../../shared/entities/trader.entity';
import { AgGridService } from '../../../../../shared/services/ag-grid.service';
import { FormConfigurationProviderService } from '../../../../../shared/services/form-configuration-provider.service';
import { TradingService } from '../../../../../shared/services/http-services/trading.service';
import { SnackbarService } from '../../../../../shared/services/snackbar.service';
import { ContractsForBulkFunctions } from '../../../../../shared/services/trading/dtos/contracts-for-bulk-functions';
import { UiService } from '../../../../../shared/services/ui.service';
import { AgGridPopUpComponent } from '../ag-grid-pop-up/ag-grid-pop-up.component';
import { AgGridHyperlinkComponent } from '../../../../../shared/components/ag-grid-hyperlink/ag-grid-hyperlink.component';
import { ContractTypes } from '../../../../../shared/enums/contract-type.enum';
import { InvoicingStatus } from '../../../../../shared/enums/invoicing-status.enum';
import { PostingStatus } from '../../../../../shared/enums/posting-status.enum';
import { LockService } from '../../../../../shared/services/http-services/lock.service';
import { IsLocked } from '../../../../../shared/entities/is-locked.entity';
import { ContractsForBulkClosureFunctions } from '../../../../../shared/services/trading/dtos/contracts-for-bulk-closure-functions';
import { AtlasFormControl } from '../../../../../shared/entities/atlas-form-control';
import { LockFunctionalContext } from '../../../../../shared/entities/lock-functional-context.entity';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';


@Component({
    selector: 'atlas-bulk-closure-matrix',
    templateUrl: './bulk-closure-matrix.component.html',
    styleUrls: ['./bulk-closure-matrix.component.scss']
})

export class BulkClosureMatrixComponent extends BaseFormComponent implements OnInit {
    company: string;
    atlasAgGridParam: AtlasAgGridParam;
    gridApi: agGrid.GridApi;
    gridColumnApi: agGrid.ColumnApi;
    bulkClosureGridColumns: agGrid.ColDef[];
    bulkClosureGridOptions: agGrid.GridOptions = {};
    bulkClosureGridRows = [];
    bulkEditGridRows: ContractsForBulkFunctions[];
    contractsToedit: ContractsForBulkFunctions[];
    selectContractStatusValue: ContractsForBulkFunctions[];
    allContractStatusValue: ContractsForBulkFunctions[];
    traders: Trader[] = [];
    masterdata: MasterData;
    columnDefs: agGrid.ColDef[];
    copyselectedallocatedIds = [];
    companyConfiguration: Company;
    selectedallocatedIds = [];
    allocateClosureContract = [];
    duplicateAllocateClosureContract = [];
    selectedAllocatedValue = [];
    allocatedSection = [];
    tooltipMessage: string = '';
    availableClosure: string = "Contracts available for closure";
    riskyClosure: string = "Contracts risky for closure";
    unavailableClosure: string = "Contracts unavailable for closure";
    defaultDate = 'Mon Jan 01 0001';
    gridContext = {
        gridEditable: true,
        componentParent: this,
    };
    gridComponents = {
    };
    destroy$ = new Subject();
    selectedContractsClosureForBulkFunctions: ContractsForBulkClosureFunctions[];
    isContractClosureSelected: boolean = false;
    rowData: any;
    groupDefaultExpanded: any;
    getDataPath: any;
    autoGroupColumnDef: any;
    privileges: TradePropertyPrivilege;
    @Output() readonly contractClosureSelected = new EventEmitter<boolean>();

    constructor(protected formConfigurationProvider: FormConfigurationProviderService,
        private gridService: AgGridService,
        private uiService: UiService,
        private agGridService: AgGridService,
        protected dialog: MatDialog,
        protected snackbarService: SnackbarService,
        private route: ActivatedRoute,
        protected companyManager: CompanyManagerService,
        protected router: Router,
        protected lockService: LockService,
        protected authorizationService: AuthorizationService,
        protected tradingService: TradingService,
    ) {
        super(formConfigurationProvider);
    }

    ngOnInit() {
        this.masterdata = this.route.snapshot.data.masterdata;
        this.company = this.route.snapshot.paramMap.get('company');
        this.companyConfiguration = this.companyManager.getCompany(this.company);
        this.atlasAgGridParam = this.gridService.getAgGridParam();
        this.initializeGridColumns();
        this.initializeGridRows();
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
                    headerName: 'Status',
                    field: 'status',
                    colId: 'status',
                    cellClass: 'status-background-color',

                    cellStyle: (params) => {
                        if (params.value) {

                            if (params.data.contractLabel[0] == 'Contracts available for closure') {
                            }
                            if (params.data.contractLabel[0] == 'Contracts risky for closure') {
                                return { backgroundColor: '#fff2ec', borderRadius: '2px !important;' };
                            }
                            if (params.data.contractLabel[0] == 'Contracts unavailable for closure') {
                                return { backgroundColor: 'hsl(0, 70%, 82%)', borderRadius: '2px !important;' };
                            }
                        }

                    },
                    cellRendererFramework: AgGridPopUpComponent,
                    cellRendererParams: {
                        context: {
                            componentParent: this,
                        },
                    },

                    tooltip: (params) => {
                        if (params.data) {
                            if (params.data.status === 'Cost accrual') {
                                this.tooltipMessage = 'link to ‘cost’ tab';
                            }
                            else if (params.data.status === 'Invoices not cash matched') {
                                this.tooltipMessage = 'link to ‘Invoice marking’ tab';
                            }
                            else if (params.data.status === 'Cargo accrual') {
                                this.tooltipMessage = 'link to ‘Invoice marking’ tab';
                            }
                            else if (params.data.status === 'Invoices not posted') {
                                this.tooltipMessage = 'link to ‘Invoice marking’ tab';
                            }
                            else if (params.data.status === 'Unrealized physicals') {
                                this.tooltipMessage = 'Make the Qty 0 or change the Invoice type to close it';
                            }
                            else if (params.data.contractLabel[0] === 'Contracts available for closure') {
                                this.tooltipMessage = '';
                            }
                            else if (params.data.contractLabel[0] === 'Contracts risky for closure') {
                                this.tooltipMessage = '';
                            }
                            else if (params.data.contractLabel[0] === 'Contracts unavailable for closure') {
                                this.tooltipMessage = '';
                            }
                            return this.tooltipMessage;
                        }

                    },
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
                {
                    headerName: '',
                    field: 'sectionId',
                    colId: 'sectionId',
                    hide: true,
                },
            ];
    }

    onColumnVisibilityChanged(event: any) {
    }

    onSelectionChanged(event) {
        let obj;
        const selectedRows = this.gridApi.getSelectedRows();
        const allocatedRows = selectedRows;
        this.isContractClosureSelected = selectedRows.length > 0;
        this.contractClosureSelected.emit(this.isContractClosureSelected);
        this.gridApi.forEachNode((node) => {
            if (node.parent.key === 'Contracts unavailable for closure') {
                node.setSelected(false);
                node.selectable = false;
                Object.values(node.childrenMapped).forEach((childNode) => {
                    childNode.selectable = node.isSelected();
                    node.selectable = false;
                });
            }
            else if (node.key === 'Contracts unavailable for closure') {
                node.setSelected(false);
                node.selectable = false;
            }
            else if (node.isSelected()) {
                if (node.allChildrenCount) {
                    Object.values(node.childrenMapped).forEach((childNode) => {
                        childNode.setSelected(true)
                    });
                }
                else {
                    node.setSelected(true)
                }
            }
            else {
                if (node.allChildrenCount) {
                    Object.values(node.childrenMapped).forEach((childNode) => {
                        if (!childNode.isSelected()) {
                            childNode.setSelected(false)
                        }
                    });
                }
                else {
                    node.setSelected(false)
                }
            }
        });

        this.gridApi.refreshCells(event.data);

        allocatedRows.forEach((contract) => {
            if (contract.contractLabel[2]) {
                let element = this.selectContractStatusValue.find((section) =>
                    section.contractLabel == contract.contractLabel[2]);
                if (element) {
                    obj = {
                        contractLabel: ['', element.contractLabel, contract.contractLabel[1]],
                        status: null,
                        netaccrual: element.netAccrual,
                        invoice: element.invoicePercent,
                        sectionId: element.sectionId
                    };
                    selectedRows.push(obj);
                }
            }
        });
        this.selectedContractsClosureForBulkFunctions = selectedRows;
    }

    initializeGridRows() {
        let allocatedContractsList = [];
        allocatedContractsList = this.allContractStatusValue;
        this.selectedAllocatedValue = this.selectContractStatusValue;
        this.bulkClosureGridRows = [];
        if (this.selectedAllocatedValue) {
            this.selectedAllocatedValue.forEach((contract) => {
                let postingCount = 0;
                let costPostingCount = 0;
                let redTradesPostingCount = 0;
                let cashMatchCount = 0;
                let costCashMatchCount = 0;
                let isLock = false;
                let isRedLock = false;
                let isRedTrades = false;
                let lockMessage = '';
                let unInvoiceCost = null;
                let netAccrualVal = null;
                if (contract.invoices) {
                    contract.invoices.forEach((invoice) => {
                        if (invoice.postingStatusId !== PostingStatus.Posted) {
                            postingCount = postingCount + 1;
                        }
                        if (invoice.cashMatchPercentage !== 100) {
                            cashMatchCount = cashMatchCount + 1;
                        }
                    });
                }
                if (contract.costs && contract.costs.length > 0) {
                    unInvoiceCost = contract.costs.filter((cost) =>
                        cost.invoiceStatus === InvoicingStatus.Uninvoiced ||
                        cost.invoiceStatus === InvoicingStatus.FinalInvoiceRequired ||
                        cost.invoiceStatus === InvoicingStatus.Finalized);
                    contract.costs.forEach((cost) => {
                        if (cost.postingStatusId !== PostingStatus.Posted) {
                            costPostingCount = costPostingCount + 1;
                        }
                        if (cost.cashMatchPercentage !== 100) {
                            costCashMatchCount = costCashMatchCount + 1;
                        }
                    });
                }
                this.lockService.isLockedContract(contract.sectionId).pipe(takeUntil(this.destroy$)).subscribe((lock: IsLocked) => {
                    if (lock.isLocked) {
                        isLock = true;
                        lockMessage = lock.message;
                    }
                    else {
                        this.subscriptions.push(this.lockService.lockContract(contract.sectionId, LockFunctionalContext.TradeBulkClosure).subscribe((res) => { }));
                    }
                });
                let selectedContracts = this.selectedAllocatedValue.find((section) =>
                    section.contractLabel == contract.allocatedContractReference);
                if (selectedContracts) {
                    this.lockService.isLockedContract(selectedContracts.sectionId).pipe(takeUntil(this.destroy$)).subscribe((lock: IsLocked) => {
                        if (lock.isLocked) {
                            isRedLock = true;
                        }
                    });
                    selectedContracts.invoices.forEach((invoice) => {
                        if (invoice.postingStatusId !== PostingStatus.Posted) {
                            redTradesPostingCount = redTradesPostingCount + 1;
                        }
                    });
                    if (contract.contractTypeId === ContractTypes.Sale &&
                        (isRedLock || selectedContracts.blDate === null || selectedContracts.blDate === this.defaultDate ||
                            selectedContracts.invoicingStatusId === InvoicingStatus.Uninvoiced ||
                            selectedContracts.invoicingStatusId === InvoicingStatus.FinalInvoiceRequired ||
                            (selectedContracts.invoicingStatusId === InvoicingStatus.Finalized && redTradesPostingCount > 0)) && selectedContracts.costs.length === 0) {
                        isRedTrades = true;
                    }
                }

                if (contract.quantity === 0 || contract.isTradeCancelled === "Cancelled" ||
                    (contract.invoicingStatusId === InvoicingStatus.Finalized && postingCount === 0 &&
                        cashMatchCount === 0) && !isLock) {
                    let obj;
                    if (contract.costs.length > 0) {
                        if (unInvoiceCost !== null && unInvoiceCost.length === 0) {
                            if (contract.allocatedContractReference && allocatedContractsList.find((section) =>
                                section.contractLabel == contract.allocatedContractReference)) {
                                if (contract.contractTypeId === ContractTypes.Purchase || !selectedContracts ||
                                    isRedTrades) {
                                    let element = allocatedContractsList.find((section) =>
                                        section.contractLabel == contract.allocatedContractReference);
                                    if (element) {
                                        obj = {
                                            contractLabel: [this.availableClosure]
                                        };
                                        this.bulkClosureGridRows.push(obj);
                                        obj = {
                                            contractLabel: [this.availableClosure, contract.contractLabel],
                                            status: null,
                                            netaccrual: netAccrualVal,
                                            invoice: contract.invoicePercent,
                                            sectionId: contract.sectionId
                                        };
                                        this.bulkClosureGridRows.push(obj);
                                        obj = {
                                            contractLabel: [this.availableClosure, contract.contractLabel,
                                            element.contractLabel],
                                            status: null,
                                            netaccrual: netAccrualVal,
                                            invoice: element.invoicePercent,
                                            sectionId: element.sectionId
                                        };
                                        this.bulkClosureGridRows.push(obj);
                                    }
                                }
                            }
                            else {
                                obj = {
                                    contractLabel: [this.availableClosure]
                                };
                                this.bulkClosureGridRows.push(obj);
                                obj = {
                                    contractLabel: [this.availableClosure, contract.contractLabel],
                                    status: null,
                                    netaccrual: netAccrualVal,
                                    invoice: contract.invoicePercent,
                                    sectionId: contract.sectionId
                                };
                                this.bulkClosureGridRows.push(obj);
                            }
                        }
                        else if ((unInvoiceCost !== null && unInvoiceCost.length > 0 && contract.blDate !== null &&
                            contract.blDate !== this.defaultDate) || (contract.invoicingStatusId === InvoicingStatus.Finalized &&
                                postingCount === 0 && cashMatchCount > 0) && !isLock) {
                            let obj, riskyClosureStatus;
                            if ((unInvoiceCost !== null && unInvoiceCost.length > 0 && contract.blDate !== null &&
                                contract.blDate !== this.defaultDate) && costPostingCount > 0) {
                                riskyClosureStatus = 'Cost accrual';
                                contract.costs.sort((a, b) => new Date(b.invoiceDate).getTime() - new Date(a.invoiceDate).getTime());
                                netAccrualVal = contract.costs[0].netAccrual + ' ' + contract.costs[0].currencyCode;
                            }
                            else if ((unInvoiceCost !== null && unInvoiceCost.length > 0 && costPostingCount === 0 &&
                                costCashMatchCount > 0) || (contract.invoicingStatusId === InvoicingStatus.Finalized &&
                                    postingCount === 0 && cashMatchCount > 0)) {
                                riskyClosureStatus = 'Invoices not cash matched';
                            }
                            if (contract.allocatedContractReference && allocatedContractsList.find((section) =>
                                section.contractLabel == contract.allocatedContractReference)) {
                                if (contract.contractTypeId === ContractTypes.Purchase || !selectedContracts ||
                                    isRedTrades) {
                                    let element = allocatedContractsList.find((section) =>
                                        section.contractLabel == contract.allocatedContractReference);
                                    if (element) {
                                        let allocatedPostingCount = 0;
                                        let allocatedCostPostingCount = 0;
                                        let allocatedCashMatchCount = 0;
                                        let allocatedCostCashMatchCount = 0;
                                        let allocatedIsLock = false;
                                        let allocatedLockMessage = '';
                                        let allocatedUnInvoiceCost = null;
                                        let allocatedNetAccrualVal = null;
                                        let allocatedClosureStatus;
                                        let allocatedContractList = [];
                                        allocatedContractList = this.selectContractStatusValue;
                                        let allocatedContract =
                                            allocatedContractList.find((contract) =>
                                                contract.contractLabel == element.contractLabel
                                            );
                                        if (allocatedContract.invoices) {
                                            allocatedContract.invoices.forEach((invoice) => {
                                                if (invoice.postingStatusId !== PostingStatus.Posted) {
                                                    allocatedPostingCount = allocatedPostingCount + 1;
                                                }
                                                if (invoice.cashMatchPercentage !== 100) {
                                                    allocatedCashMatchCount = allocatedCashMatchCount + 1;
                                                }
                                            });
                                        }
                                        if (allocatedContract.costs && allocatedContract.costs.length > 0) {
                                            allocatedUnInvoiceCost = allocatedContract.costs.filter((cost) =>
                                                cost.invoiceStatus === InvoicingStatus.Uninvoiced ||
                                                cost.invoiceStatus === InvoicingStatus.FinalInvoiceRequired ||
                                                cost.invoiceStatus === InvoicingStatus.Finalized);
                                            allocatedContract.costs.forEach((cost) => {
                                                if (cost.postingStatusId !== PostingStatus.Posted) {
                                                    allocatedCostPostingCount = allocatedCostPostingCount + 1;
                                                }
                                                if (cost.cashMatchPercentage !== 100) {
                                                    allocatedCostCashMatchCount = allocatedCostCashMatchCount + 1;
                                                }
                                            });
                                        }
                                        this.lockService.isLockedContract(allocatedContract.sectionId).pipe(takeUntil(this.destroy$)).subscribe((lock: IsLocked) => {
                                            if (lock.isLocked) {
                                                allocatedIsLock = true;
                                                allocatedLockMessage = lock.message;
                                            }
                                            else {
                                                this.subscriptions.push(this.lockService.lockContract(allocatedContract.sectionId, LockFunctionalContext.TradeBulkClosure).subscribe((res) => { }));
                                            }
                                        });
                                        if ((allocatedUnInvoiceCost !== null && allocatedUnInvoiceCost.length > 0 && allocatedContract.blDate !== null &&
                                            allocatedContract.blDate !== this.defaultDate) || (allocatedContract.invoicingStatusId === InvoicingStatus.Finalized &&
                                                allocatedPostingCount === 0 && allocatedCashMatchCount > 0) && !allocatedIsLock) {
                                            if ((allocatedUnInvoiceCost !== null && allocatedUnInvoiceCost.length > 0 && allocatedContract.blDate !== null &&
                                                allocatedContract.blDate !== this.defaultDate) && allocatedCostPostingCount > 0) {
                                                allocatedClosureStatus = 'Cost accrual';
                                                allocatedContract.costs.sort((a, b) => new Date(b.invoiceDate).getTime() - new Date(a.invoiceDate).getTime());
                                                allocatedNetAccrualVal = allocatedContract.costs[0].netAccrual + ' ' + allocatedContract.costs[0].currencyCode;
                                            }
                                            else if ((allocatedUnInvoiceCost !== null && allocatedUnInvoiceCost.length > 0 && allocatedCostPostingCount === 0 &&
                                                allocatedCostCashMatchCount > 0) || (allocatedContract.invoicingStatusId === InvoicingStatus.Finalized &&
                                                    allocatedPostingCount === 0 && allocatedCashMatchCount > 0)) {
                                                allocatedClosureStatus = 'Invoices not cash matched';
                                            }
                                        }
                                        else if (allocatedIsLock || allocatedContract.blDate === null || allocatedContract.blDate === this.defaultDate ||
                                            allocatedContract.invoicingStatusId === InvoicingStatus.Uninvoiced ||
                                            allocatedContract.invoicingStatusId === InvoicingStatus.FinalInvoiceRequired ||
                                            (allocatedContract.invoicingStatusId === InvoicingStatus.Finalized && allocatedPostingCount > 0)) {
                                            if (allocatedIsLock) {
                                                allocatedClosureStatus = allocatedLockMessage;
                                            }
                                            else if (allocatedContract.blDate === null || allocatedContract.blDate === this.defaultDate) {
                                                allocatedClosureStatus = 'Unrealized physicals';
                                            }
                                            else if (allocatedContract.invoicingStatusId === InvoicingStatus.Uninvoiced ||
                                                allocatedContract.invoicingStatusId === InvoicingStatus.FinalInvoiceRequired) {
                                                allocatedClosureStatus = 'Cargo accrual';
                                                allocatedNetAccrualVal = allocatedContract.netAccrual + ' ' + allocatedContract.currencyCode;
                                            }
                                            else if (allocatedContract.invoicingStatusId === InvoicingStatus.Finalized && allocatedPostingCount > 0) {
                                                allocatedClosureStatus = 'Invoices not posted';
                                            }
                                        }
                                        obj = {
                                            contractLabel: [this.riskyClosure]
                                        };
                                        this.bulkClosureGridRows.push(obj);
                                        obj = {
                                            contractLabel: [this.riskyClosure, contract.contractLabel],
                                            status: riskyClosureStatus,
                                            netaccrual: netAccrualVal,
                                            invoice: contract.invoicePercent,
                                            sectionId: contract.sectionId
                                        };
                                        this.bulkClosureGridRows.push(obj);
                                        obj = {
                                            contractLabel: [this.riskyClosure, contract.contractLabel,
                                            element.contractLabel],
                                            status: allocatedClosureStatus,
                                            netaccrual: allocatedNetAccrualVal,
                                            invoice: allocatedContract.invoicePercent,
                                            sectionId: allocatedContract.sectionId
                                        };
                                        this.bulkClosureGridRows.push(obj);
                                    }
                                }
                            }
                            else {
                                obj = {
                                    contractLabel: [this.riskyClosure]
                                };
                                this.bulkClosureGridRows.push(obj);
                                obj = {
                                    contractLabel: [this.riskyClosure, contract.contractLabel],
                                    status: riskyClosureStatus,
                                    netaccrual: netAccrualVal,
                                    invoice: contract.invoicePercent,
                                    sectionId: contract.sectionId
                                };
                                this.bulkClosureGridRows.push(obj);
                            }
                        }
                    }
                    else {
                        if (contract.allocatedContractReference && allocatedContractsList.find((section) =>
                            section.contractLabel == contract.allocatedContractReference)) {
                            if (contract.contractTypeId === ContractTypes.Purchase || !selectedContracts ||
                                isRedTrades) {
                                let element = allocatedContractsList.find((section) =>
                                    section.contractLabel == contract.allocatedContractReference);
                                if (element) {
                                    obj = {
                                        contractLabel: [this.availableClosure]
                                    };
                                    this.bulkClosureGridRows.push(obj);
                                    obj = {
                                        contractLabel: [this.availableClosure, contract.contractLabel],
                                        status: null,
                                        netaccrual: netAccrualVal,
                                        invoice: contract.invoicePercent,
                                        sectionId: contract.sectionId
                                    };
                                    this.bulkClosureGridRows.push(obj);
                                    obj = {
                                        contractLabel: [this.availableClosure, contract.contractLabel,
                                        element.contractLabel],
                                        status: null,
                                        netaccrual: netAccrualVal,
                                        invoice: element.invoicePercent,
                                        sectionId: element.sectionId
                                    };
                                    this.bulkClosureGridRows.push(obj);
                                }
                            }
                        }
                        else {
                            obj = {
                                contractLabel: [this.availableClosure]
                            };
                            this.bulkClosureGridRows.push(obj);
                            obj = {
                                contractLabel: [this.availableClosure, contract.contractLabel],
                                status: null,
                                netaccrual: netAccrualVal,
                                invoice: contract.invoicePercent,
                                sectionId: contract.sectionId
                            };
                            this.bulkClosureGridRows.push(obj);
                        }

                    }

                }
                else if ((unInvoiceCost !== null && unInvoiceCost.length > 0 && contract.blDate !== null &&
                    contract.blDate !== this.defaultDate) || (contract.invoicingStatusId === InvoicingStatus.Finalized &&
                        postingCount === 0 && cashMatchCount > 0) && !isLock) {
                    let obj, riskyClosureStatus;
                    if ((unInvoiceCost !== null && unInvoiceCost.length > 0 && contract.blDate !== null &&
                        contract.blDate !== this.defaultDate) && costPostingCount > 0) {
                        riskyClosureStatus = 'Cost accrual';
                        contract.costs.sort((a, b) => new Date(b.invoiceDate).getTime() - new Date(a.invoiceDate).getTime());
                        netAccrualVal = contract.costs[0].netAccrual + ' ' + contract.costs[0].currencyCode;
                    }
                    else if ((unInvoiceCost !== null && unInvoiceCost.length > 0 && costPostingCount === 0 &&
                        costCashMatchCount > 0) || (contract.invoicingStatusId === InvoicingStatus.Finalized &&
                            postingCount === 0 && cashMatchCount > 0)) {
                        riskyClosureStatus = 'Invoices not cash matched';
                    }
                    if (contract.allocatedContractReference && allocatedContractsList.find((section) =>
                        section.contractLabel == contract.allocatedContractReference)) {
                        if (contract.contractTypeId === ContractTypes.Purchase || !selectedContracts ||
                            isRedTrades) {
                            let element = allocatedContractsList.find((section) =>
                                section.contractLabel == contract.allocatedContractReference);
                            if (element) {
                                let allocatedPostingCount = 0;
                                let allocatedCostPostingCount = 0;
                                let allocatedCashMatchCount = 0;
                                let allocatedCostCashMatchCount = 0;
                                let allocatedIsLock = false;
                                let allocatedLockMessage = '';
                                let allocatedUnInvoiceCost = null;
                                let allocatedNetAccrualVal = null;
                                let allocatedClosureStatus;
                                let allocatedContractList = [];
                                allocatedContractList = this.selectContractStatusValue;
                                let allocatedContract =
                                    allocatedContractList.find((contract) =>
                                        contract.contractLabel == element.contractLabel
                                    );
                                if (allocatedContract.invoices) {
                                    allocatedContract.invoices.forEach((invoice) => {
                                        if (invoice.postingStatusId !== PostingStatus.Posted) {
                                            allocatedPostingCount = allocatedPostingCount + 1;
                                        }
                                        if (invoice.cashMatchPercentage !== 100) {
                                            allocatedCashMatchCount = allocatedCashMatchCount + 1;
                                        }
                                    });
                                }
                                if (allocatedContract.costs && allocatedContract.costs.length > 0) {
                                    allocatedUnInvoiceCost = allocatedContract.costs.filter((cost) =>
                                        cost.invoiceStatus === InvoicingStatus.Uninvoiced ||
                                        cost.invoiceStatus === InvoicingStatus.FinalInvoiceRequired ||
                                        cost.invoiceStatus === InvoicingStatus.Finalized);
                                    allocatedContract.costs.forEach((cost) => {
                                        if (cost.postingStatusId !== PostingStatus.Posted) {
                                            allocatedCostPostingCount = allocatedCostPostingCount + 1;
                                        }
                                        if (cost.cashMatchPercentage !== 100) {
                                            allocatedCostCashMatchCount = allocatedCostCashMatchCount + 1;
                                        }
                                    });
                                }
                                this.lockService.isLockedContract(allocatedContract.sectionId).pipe(takeUntil(this.destroy$)).subscribe((lock: IsLocked) => {
                                    if (lock.isLocked) {
                                        allocatedIsLock = true;
                                        allocatedLockMessage = lock.message;
                                    }
                                    else {
                                        this.subscriptions.push(this.lockService.lockContract(allocatedContract.sectionId, LockFunctionalContext.TradeBulkClosure).subscribe((res) => { }));
                                    }
                                });
                                if ((allocatedUnInvoiceCost !== null && allocatedUnInvoiceCost.length > 0 && allocatedContract.blDate !== null &&
                                    allocatedContract.blDate !== this.defaultDate) || (allocatedContract.invoicingStatusId === InvoicingStatus.Finalized &&
                                        allocatedPostingCount === 0 && allocatedCashMatchCount > 0) && !allocatedIsLock) {
                                    if ((allocatedUnInvoiceCost !== null && allocatedUnInvoiceCost.length > 0 && allocatedContract.blDate !== null &&
                                        allocatedContract.blDate !== this.defaultDate) && allocatedCostPostingCount > 0) {
                                        allocatedClosureStatus = 'Cost accrual';
                                        allocatedContract.costs.sort((a, b) => new Date(b.invoiceDate).getTime() - new Date(a.invoiceDate).getTime());
                                        allocatedNetAccrualVal = allocatedContract.costs[0].netAccrual + ' ' + allocatedContract.costs[0].currencyCode;
                                    }
                                    else if ((allocatedUnInvoiceCost !== null && allocatedUnInvoiceCost.length > 0 && allocatedCostPostingCount === 0 &&
                                        allocatedCostCashMatchCount > 0) || (allocatedContract.invoicingStatusId === InvoicingStatus.Finalized &&
                                            allocatedPostingCount === 0 && allocatedCashMatchCount > 0)) {
                                        allocatedClosureStatus = 'Invoices not cash matched';
                                    }
                                }
                                else if (allocatedIsLock || allocatedContract.blDate === null || allocatedContract.blDate === this.defaultDate ||
                                    allocatedContract.invoicingStatusId === InvoicingStatus.Uninvoiced ||
                                    allocatedContract.invoicingStatusId === InvoicingStatus.FinalInvoiceRequired ||
                                    (allocatedContract.invoicingStatusId === InvoicingStatus.Finalized && allocatedPostingCount > 0)) {
                                    if (allocatedIsLock) {
                                        allocatedClosureStatus = allocatedLockMessage;
                                    }
                                    else if (allocatedContract.blDate === null || allocatedContract.blDate === this.defaultDate) {
                                        allocatedClosureStatus = 'Unrealized physicals';
                                    }
                                    else if (allocatedContract.invoicingStatusId === InvoicingStatus.Uninvoiced ||
                                        allocatedContract.invoicingStatusId === InvoicingStatus.FinalInvoiceRequired) {
                                        allocatedClosureStatus = 'Cargo accrual';
                                        allocatedNetAccrualVal = allocatedContract.netAccrual + ' ' + allocatedContract.currencyCode;
                                    }
                                    else if (allocatedContract.invoicingStatusId === InvoicingStatus.Finalized && allocatedPostingCount > 0) {
                                        allocatedClosureStatus = 'Invoices not posted';
                                    }
                                }
                                obj = {
                                    contractLabel: [this.riskyClosure]
                                };
                                this.bulkClosureGridRows.push(obj);
                                obj = {
                                    contractLabel: [this.riskyClosure, contract.contractLabel],
                                    status: riskyClosureStatus,
                                    netaccrual: netAccrualVal,
                                    invoice: contract.invoicePercent,
                                    sectionId: contract.sectionId
                                };
                                this.bulkClosureGridRows.push(obj);
                                obj = {
                                    contractLabel: [this.riskyClosure, contract.contractLabel,
                                    element.contractLabel],
                                    status: allocatedClosureStatus,
                                    netaccrual: allocatedNetAccrualVal,
                                    invoice: allocatedContract.invoicePercent,
                                    sectionId: allocatedContract.sectionId
                                };
                                this.bulkClosureGridRows.push(obj);
                            }
                        }
                    }
                    else {
                        obj = {
                            contractLabel: [this.riskyClosure]
                        };
                        this.bulkClosureGridRows.push(obj);
                        obj = {
                            contractLabel: [this.riskyClosure, contract.contractLabel],
                            status: riskyClosureStatus,
                            netaccrual: netAccrualVal,
                            invoice: contract.invoicePercent,
                            sectionId: contract.sectionId
                        };
                        this.bulkClosureGridRows.push(obj);
                    }
                }
                else if (isLock || contract.blDate === null || contract.blDate === this.defaultDate ||
                    contract.invoicingStatusId === InvoicingStatus.Uninvoiced ||
                    contract.invoicingStatusId === InvoicingStatus.FinalInvoiceRequired ||
                    (contract.invoicingStatusId === InvoicingStatus.Finalized && postingCount > 0)) {
                    let obj, unavailableClosureStatus;
                    if (isLock) {
                        unavailableClosureStatus = lockMessage;
                    }
                    else if (contract.blDate === null || contract.blDate === this.defaultDate) {
                        unavailableClosureStatus = 'Unrealized physicals';
                    }
                    else if (contract.invoicingStatusId === InvoicingStatus.Uninvoiced ||
                        contract.invoicingStatusId === InvoicingStatus.FinalInvoiceRequired) {
                        unavailableClosureStatus = 'Cargo accrual';
                        netAccrualVal = contract.netAccrual + ' ' + contract.currencyCode;
                    }
                    else if (contract.invoicingStatusId === InvoicingStatus.Finalized && postingCount > 0) {
                        unavailableClosureStatus = 'Invoices not posted';
                    }
                    obj = {
                        contractLabel: [this.unavailableClosure]
                    };
                    this.bulkClosureGridRows.push(obj);
                    obj = {
                        contractLabel: [this.unavailableClosure, contract.contractLabel],
                        status: unavailableClosureStatus,
                        netaccrual: netAccrualVal,
                        invoice: contract.invoicePercent,
                        sectionId: contract.sectionId
                    };
                    this.bulkClosureGridRows.push(obj);
                }

            });
        }
        this.bulkClosureGridRows.sort((compareTo, compareFrom) => {
            if (compareTo.contractLabel[0] == 'Contracts available for closure' && (compareFrom.contractLabel[0] == 'Contracts risky for closure' || compareFrom.contractLabel[0] == 'Contracts unavailable for closure')) {
                return -1;
            }
            else if (compareTo.contractLabel[0] == 'Contracts risky for closure' && compareFrom.contractLabel[0] == 'Contracts unavailable for closure') {
                return -1;
            }
            else {
                return 1;
            }
        });

        this.groupDefaultExpanded = -1;
        this.getDataPath = function (data) {
            return data.contractLabel;
        };

        this.autoGroupColumnDef = {
            headerName: "",
            cellRendererParams: {
                suppressCount: true,
                checkbox: true,
                innerRendererFramework: AgGridHyperlinkComponent,
            },
        };
        this.autoSizeContractsGrid();
    }

    @HostListener('window:beforeunload', ['$event'])
    unloadNotification(event) {
        this.lockService.cleanSessionLocks().subscribe(() => {
        });
    }

    ngOnDestroy(): void {
        this.lockService.cleanSessionLocks().subscribe(() => {
        });
    }

    ContractsForClosure(contracts: ContractsForBulkFunctions[], allContracts: ContractsForBulkFunctions[]) {
        this.bulkEditGridRows = contracts;
        this.selectContractStatus(this.bulkEditGridRows, allContracts);
        this.initializeGridRows();
        this.autoSizeContractsGrid();
    }

    selectContractStatus(selectedcontracts: ContractsForBulkFunctions[], allcontracts: ContractsForBulkFunctions[]) {
        this.selectContractStatusValue = selectedcontracts;
        this.allContractStatusValue = allcontracts;
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
            this.gridApi.forEachNode((node) => {
                if (node.key === 'Contracts available for closure') {
                    if (node.allChildrenCount) {
                        Object.values(node.childrenMapped).forEach((childNode) => {
                            childNode.setSelected(true)
                        });
                    }
                    else {
                        node.setSelected(true)
                    }
                }
            });
        });
    }

    hyperlinkClicked(rowSelected: ContractsForBulkFunctions, event) {
        const link = `${this.companyManager.getCurrentCompanyId()}/trades/display/${rowSelected.sectionId}`;
        window.open(link, '_blank');
    }
}
