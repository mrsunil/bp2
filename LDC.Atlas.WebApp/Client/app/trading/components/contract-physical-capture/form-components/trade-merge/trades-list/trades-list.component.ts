import { Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Route } from '@angular/router';
import * as agGrid from 'ag-grid-community';
import { Subscription } from 'rxjs';
import { concatMap } from 'rxjs/operators';
import { AgGridUserPreferencesComponent } from '../../../../../../shared/components/ag-grid-user-preferences/ag-grid-user-preferences.component';
import { BaseFormComponent } from '../../../../../../shared/components/base-form-component/base-form-component.component';
import { ConfirmationDialogComponent } from '../../../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { AtlasAgGridParam } from '../../../../../../shared/entities/atlas-ag-grid-param.entity';
import { ContractFamilyToTradeMerge } from '../../../../../../shared/entities/contract-family-to-trade-merge.entity';
import { IsLocked } from '../../../../../../shared/entities/is-locked.entity';
import { LockFunctionalContext } from '../../../../../../shared/entities/lock-functional-context.entity';
import { LockResourceInformation } from '../../../../../../shared/entities/lock-resource-information.entity';
import { MasterData } from '../../../../../../shared/entities/masterdata.entity';
import { MergeContracts } from '../../../../../../shared/entities/merge-contracts.entity';
import { Port } from '../../../../../../shared/entities/port.entity';
import { TradeMergeOptions } from '../../../../../../shared/entities/trade-merge-options.entity';
import { DiscountTypes } from '../../../../../../shared/enums/discount-type.enum';
import { ContractMergeOptions } from '../../../../../../shared/enums/trade-merge-options.enum';
import { AgGridService } from '../../../../../../shared/services/ag-grid.service';
import { FormConfigurationProviderService } from '../../../../../../shared/services/form-configuration-provider.service';
import { GridConfigurationProviderService } from '../../../../../../shared/services/grid-configuration-provider.service';
import { LockService } from '../../../../../../shared/services/http-services/lock.service';
import { TradingService } from '../../../../../../shared/services/http-services/trading.service';
import { SecurityService } from '../../../../../../shared/services/security.service';
import { SnackbarService } from '../../../../../../shared/services/snackbar.service';
import { UiService } from '../../../../../../shared/services/ui.service';
import { TradeMergeMessage } from '../../../../../../trading/entities/trade-merge-message.entity';
import { CostImpactWarningDialogComponent } from '../cost-impact-warning-dialog/cost-impact-warning-dialog.component';

@Component({
    selector: 'atlas-trades-list',
    templateUrl: './trades-list.component.html',
    styleUrls: ['./trades-list.component.scss'],
})
export class TradesListComponent extends BaseFormComponent implements OnInit, OnDestroy {

    constructor(protected formConfigurationProvider: FormConfigurationProviderService,
        protected dialog: MatDialog,
        public gridService: AgGridService,
        private route: ActivatedRoute,
        private securityService: SecurityService,
        private uiService: UiService,
        private gridConfigurationProvider: GridConfigurationProviderService,
        protected lockService: LockService,
        protected tradingService: TradingService,
        protected snackbarService: SnackbarService) {
        super(formConfigurationProvider);
    }

    gridContext = {
        componentParent: this,
    };

    @ViewChild('userPreferences') userPreferencesComponent: AgGridUserPreferencesComponent;
    @Output() readonly selectedSectionIds = new EventEmitter<any>();
    @Output() readonly selectedContractLabels = new EventEmitter<string>();
    @Output() readonly mergeToContractLabel = new EventEmitter<string>();
    @Output() readonly noRowsSelected = new EventEmitter();
    @Output() readonly multipleMergeSelected = new EventEmitter<string>();
    @Output() readonly successMsg = new EventEmitter();
    @Output() readonly removeCardOnUnCheck = new EventEmitter<any>();

    tradesListToMergeGridOptions: agGrid.GridOptions = {};
    atlasAgGridParam: AtlasAgGridParam;
    tradesListToMergeGridColumns: agGrid.ColDef[];
    gridApi: agGrid.GridApi;
    gridColumnApi: agGrid.ColumnApi;
    isLoading: boolean;
    componentId: string = 'tradesListToMergeGrid';
    hasGridSharing: boolean = false;
    sectionId: number;
    dataVersionId: number;
    tradesListToMergeGridRows: ContractFamilyToTradeMerge[];
    masterdata: MasterData;
    dataLength: number = 0;
    selectedContractsForMerge: ContractFamilyToTradeMerge[];
    sectionIds: number[] = [];
    company: string;
    sectionIdSelectedToMerge: MergeContracts;
    sectionsSelectedToMerge: MergeContracts[] = [];
    sectionIdMergeTo: number;
    firstSelectedSplit: number;
    contractLabel: string;
    locking: number[] = [];
    unlocking: number[] = [];
    resourcesInformation: LockResourceInformation[] = new Array<LockResourceInformation>();
    contractVariable: string = 'Contract';
    mergeToHasCost: boolean;
    mergeFromsectionIdWithCost: string[] = [];
    mergeFromsectionIdWithInvoiced: string[] = [];
    mergeFromContractLabel: string[] = [];
    message: boolean = false;
    mergeOption: number = ContractMergeOptions.ContractHeader;
    MergeContracts;
    warningListForDiffFields: string = '';

    ngOnInit() {
        this.company = this.route.snapshot.params['company'];
        this.masterdata = this.route.snapshot.data.masterdata;
        this.sectionId = this.route.snapshot.params['currentSection.sectionId'];
        this.dataVersionId = this.route.snapshot.params['dataVersionId'] ? Number(this.route.snapshot.params['dataVersionId']) : null;
        this.atlasAgGridParam = this.gridService.getAgGridParam();
        this.getContractsFamily(this.sectionId);
        this.initializeGridColumns();

        this.securityService.isSecurityReady().pipe(
            concatMap(() => {
                return this.gridConfigurationProvider.getConfiguration(this.company, this.componentId);
            }),
        ).subscribe((configuration) => {

            this.hasGridSharing = configuration.hasMultipleViewsPerUser;
        });
        this.sectionIdMergeTo = this.sectionId;
        this.subscriptions.push(this.lockService.cleanSessionLocks().subscribe());
    }

    onGridReady(params) {
        this.gridApi = params.api;
        params.columnDefs = this.tradesListToMergeGridColumns;
        this.tradesListToMergeGridOptions = params;
        this.gridColumnApi = params.columnApi;

        this.gridColumnApi.autoSizeAllColumns();

        window.onresize = () => {
            this.gridColumnApi.autoSizeAllColumns();
        };

        this.gridApi.showNoRowsOverlay();
        this.autoSizeContractsGrid();
    }

    autoSizeContractsGrid() {
        if (this.gridColumnApi) {
            const allColumnIds = [];
            if (this.tradesListToMergeGridColumns) {
                this.tradesListToMergeGridColumns.forEach((columnDefs) => {
                    allColumnIds.push(columnDefs.field);
                });
            }
            this.gridColumnApi.autoSizeColumns(allColumnIds);
        }
    }

    initializeGridColumns() {
        this.tradesListToMergeGridOptions = {
            context: this.gridContext,
            getRowStyle: this.isContractToMergeRowStyle.bind(this),
            isRowSelectable: this.isMergeAllowed.bind(this),
        };

        this.tradesListToMergeGridColumns = [
            {
                headerCheckboxSelection: true,
                checkboxSelection: true,
            },
            {
                headerName: 'Contract Ref',
                field: 'contractSectionCode',
                colId: 'contractSectionCode',
                tooltip: (node) => {
                    if (!node.data.isMergeAllowed) {
                        return 'contract cannot be merged because: ' + node.data.message;
                    }
                },
            },
            {
                headerName: 'Parent Contract',
                field: 'parentContract',
                colId: 'parentContract',
            },
            {
                headerName: 'Department ',
                field: 'departmentCode',
                colId: 'departmentCode',
            },
            {
                headerName: 'Allocated',
                field: 'allocatedContract',
                colId: 'allocatedContract',
            },
            {
                headerName: 'CounterParty',
                field: 'counterpartyCode',
                colId: 'counterpartyCode',
            },
            {
                headerName: 'Quantity Code',
                colId: 'weightCode',
                field: 'weightCode',
            },
            {
                headerName: 'Quantity',
                colId: 'quantity',
                field: 'quantity',
                type: 'numericColumn',
            },
            {
                headerName: 'Cmy1',
                headerTooltip: 'Cmy1',
                field: 'principalCommodity',
                colId: 'principalCommodity',
            },
            {
                headerName: 'Cmy2',
                headerTooltip: 'Cmy2',
                field: 'part2',
                colId: 'part2',
            },
            {
                headerName: 'Cmy3',
                field: 'part3',
                colId: 'part3',
            },
            {
                headerName: 'Cmy4',
                field: 'part4',
                colId: 'part4',
            },
            {
                headerName: 'Cmy5',
                field: 'part5',
                colId: 'part5',
            },
            {
                headerName: 'Price Currency',
                field: 'currencyCode',
                colId: 'currencyCode',
            },
            {
                headerName: 'Price Code',
                field: 'priceCode',
                colId: 'priceCode',
            },
            {
                headerName: 'Price',
                colId: 'price',
                field: 'price',
                type: 'numericColumn',
            },
            {
                headerName: 'BL date',
                colId: 'bLDate',
                field: 'bLDate',
                valueFormatter: this.uiService.dateFormatter,
                cellEditor: 'atrDate',
            },
            {
                headerName: 'Charter Reference',
                colId: 'charterCode',
                field: 'charterCode',
            },
            {
                headerName: 'Price Premium/Discount',
                field: 'premiumDiscountValue',
                colId: 'premiumDiscountValue',
            },

            {
                headerName: 'Price Premium/Discount Currency',
                field: 'premiumDiscountCurrency',
                colId: 'premiumDiscountCurrency',
            },

            {
                headerName: 'Price Premium/Discount Rate/Amount',
                field: 'premiumDiscountCode',
                colId: 'premiumDiscountCode',
            },
            {
                headerName: 'Shipping Period',
                field: 'shippingPeriod',
                colId: 'shippingPeriod',
            },
            {
                headerName: 'Shipping Start Date',
                field: 'deliveryPeriodStart',
                colId: 'deliveryPeriodStart',
                valueFormatter: this.uiService.dateFormatter,
                cellEditor: 'atrDate',
            },
            {
                headerName: 'Shipping End Date',
                field: 'deliveryPeriodEnd',
                colId: 'deliveryPeriodEnd',
                valueFormatter: this.uiService.dateFormatter,
                cellEditor: 'atrDate',
            },
            {
                headerName: 'Port of origin',
                colId: 'portOriginCode',
                field: 'portOriginCode',
            },
            {
                headerName: 'Port of destination',
                colId: 'portDestinationCode',
                field: 'portDestinationCode',
            },
            {
                headerName: 'Contract Terms',
                colId: 'contractTermCode',
                field: 'contractTermCode',
            },
            {
                headerName: 'Payment Terms',
                colId: 'paymentTermCode',
                field: 'paymentTermCode',
            },
            {
                headerName: 'Arbitration Code',
                field: 'arbitrationCode',
                colId: 'arbitrationCode',
            },
        ];
    }

    onAddOrDeleteColumn(event) {
        this.userPreferencesComponent.onChangeColumnVisibility(event);
    }

    onSelectionChanged(event) {
        this.grantLock(Number(event.data.sectionId), event.node);

        if (this.gridApi.getSelectedRows().length === 0) {
            this.noRowsSelected.emit();
        }
        if (!event.node.isSelected()) {
            this.removeCardOnUnCheck.emit(event.data.sectionId);
        } else {
            this.selectedContractsForMerge = this.gridApi.getSelectedRows();

            if (this.selectedContractsForMerge.length === 1) {
                this.firstSelectedSplit = this.selectedContractsForMerge.map((contract) => contract.sectionId)[0];
            }
            if (this.selectedContractsForMerge && this.selectedContractsForMerge.length > 0) {
                this.sectionIds = this.selectedContractsForMerge.map((contract) => contract.sectionId);
                this.sectionIds.splice(0, 0, this.sectionIdMergeTo);

                this.selectedSectionIds.emit({
                    sectiondIds: this.sectionIds,
                });
                const contractLabels: string = this.selectedContractsForMerge.map((contract) => contract.contractSectionCode).join(',');
                this.selectedContractLabels.emit(contractLabels);
                if (this.mergeOption) {
                    this.onMergeOptionSelected(this.mergeOption);
                }
            } else {
                this.noRowsSelected.emit();
            }
        }
    }

    disableSelectedRowClick(sectionId: number) {
        if (sectionId) {
            this.gridApi.forEachNode((node) => {
                if (node.data.sectionId === sectionId) {
                    node.setSelected(false);
                }
            });
        }
    }

    isContractToMergeRowStyle(node) {
        if (!node.data.isMergeAllowed) {
            return { background: 'rgba(199, 194, 196, 0.5)', color: '#928D8F' };
        }
    }

    isMergeAllowed(node): boolean {
        if (node.data.isMergeAllowed) {
            if (node.data.parentContract === null) {
                return false;
            } else { return true; }
        } else {
            return (!node.data.isMergeAllowed) ? false : true;
        }
    }

    getContractsFamily(sectionId: number) {
        const getContractFamilySubscription = this.tradingService.getContractFamilyOfSectionToMerge(sectionId, this.dataVersionId).
            subscribe((data) => {
                data.value.forEach((contract) => {
                    contract.departmentCode = this.getDepartmentCodeFromId(contract.departmentId);
                    contract.weightCode = this.getWeightUnitCodeFromId(contract.weightUnitId);
                    contract.priceCode = this.getPriceCodeFromId(contract.priceUnitId);
                    contract.premiumDiscountCode = this.getPremiumDiscountCodeFromId(contract.premiumDiscountTypeId);
                    contract.portOriginCode = this.getPortOriginCodeFromId(contract.portOriginId);
                    contract.portDestinationCode = this.getPortDestinationCodeFromId(contract.portDestinationId);
                    contract.contractTermCode = this.getContractTermCodeFromId(contract.contractTermId);
                    contract.paymentTermCode = this.getPaymentTermCodeFromId(contract.paymentTermId);
                    contract.arbitrationCode = this.getArbitrationCodeFromId(contract.arbitrationId);
                    contract.counterpartyCode = this.getCounterpartyCodeFromId(contract.counterparty);
                });
                this.tradesListToMergeGridRows = data.value;
                this.dataLength = this.tradesListToMergeGridRows.length;
            });
        this.subscriptions.push(getContractFamilySubscription);
    }

    getDepartmentCodeFromId(id: number): string {
        const departmentCode = this.masterdata.departments.find(
            (deparment) => deparment.departmentId === id);
        return departmentCode ? departmentCode.departmentCode : null;
    }

    getWeightUnitCodeFromId(id: number): string {
        const weightCode = this.masterdata.weightUnits.find(
            (weight) => weight.weightUnitId === id);
        return weightCode ? weightCode.weightCode : null;
    }

    getPriceCodeFromId(id: number) {
        const priceCode = this.masterdata.priceUnits.find(
            (e) => e.priceUnitId === id);
        return priceCode ? priceCode.priceCode : '';
    }

    getPremiumDiscountCodeFromId(id: number) {
        const premiumDiscountCode = DiscountTypes[id];
        return premiumDiscountCode ? premiumDiscountCode : null;
    }

    getPortOriginCodeFromId(id: number) {
        const portOriginCode = this.masterdata.ports.find(
            (e) => e.portId === id);
        return portOriginCode ? portOriginCode.portCode : '';
    }

    getPortDestinationCodeFromId(id: number) {
        const portDestinationCode = this.masterdata.ports.find(
            (e) => e.portId === id);
        return portDestinationCode ? portDestinationCode.portCode : '';
    }

    getArbitrationCodeFromId(id: number) {
        const arbitrationCode = this.masterdata.arbitrations.find(
            (e) => e.arbitrationId === id);
        return arbitrationCode ? arbitrationCode.arbitrationCode : '';
    }

    getContractTermCodeFromId(id: number) {
        const contractTermCode = this.masterdata.contractTerms.find(
            (e) => e.contractTermId === id);
        return contractTermCode ? contractTermCode.contractTermCode : '';
    }

    getPaymentTermCodeFromId(id: number) {
        const paymentTermCode = this.masterdata.paymentTerms.find(
            (e) => e.paymentTermsId === id);
        return paymentTermCode ? paymentTermCode.paymentTermCode : '';
    }

    getFormGroup() {
        return super.getFormGroup();
    }

    onMergeOptionSelected(event) {
        this.mergeOption = event;
        this.sectionIdSelectedToMerge = new MergeContracts();
        this.sectionsSelectedToMerge = [];
        const selectedContractsToSave: ContractFamilyToTradeMerge[] = this.gridApi.getSelectedRows();

        if (event === ContractMergeOptions.ContractHeader) {
            this.sectionIdSelectedToMerge.mergeFromSectionIds = selectedContractsToSave.map((contract) => contract.sectionId);
            const rowNode = this.gridApi.getDisplayedRowAtIndex(0);
            if (rowNode) {
                this.sectionIdSelectedToMerge.mergeToSectionId = rowNode.data.sectionId;
                this.sectionIdMergeTo = rowNode.data.sectionId;
            }
            this.getContractLabelFromId(this.sectionIdSelectedToMerge.mergeToSectionId);
        } else if (event === ContractMergeOptions.ContractParent) {

            const parentSections: string[] = [];
            if (selectedContractsToSave && selectedContractsToSave.length > 0) {
                selectedContractsToSave.forEach((contract) => {
                    if (!parentSections.includes(contract.parentContract)) {
                        parentSections.push(contract.parentContract);
                    }
                });
                parentSections.forEach((parentSection) => {
                    const selectedSectionToMerge = new MergeContracts();
                    const parentContractSectionCode = this.tradesListToMergeGridRows.find((contract) =>
                        contract.contractSectionCode === parentSection);
                    if (parentContractSectionCode) {
                        selectedSectionToMerge.mergeToSectionId = parentContractSectionCode.sectionId;
                        selectedSectionToMerge.mergeFromSectionIds = selectedContractsToSave.filter((contract) =>
                            contract.parentContract === parentSection && contract.sectionId !== parentContractSectionCode.sectionId)
                            .map((selectedContract) => selectedContract.sectionId);
                        selectedSectionToMerge.mergeOption = event;
                        this.sectionsSelectedToMerge.push(selectedSectionToMerge);
                        this.sectionIds = selectedContractsToSave.filter((contract) =>
                            contract.parentContract === parentSection && contract.sectionId !== parentContractSectionCode.sectionId)
                            .map((selectedContract) => selectedContract.sectionId);
                        this.sectionIds.splice(0, 0, selectedSectionToMerge.mergeToSectionId);
                        this.selectedSectionIds.emit({
                            sectiondIds: this.sectionIds,
                        });
                    }
                });
                this.getSaveMessageForMergeOption();
            }

        } else if (event === ContractMergeOptions.FirstSelectedSplit) {
            const filterSelectedContracts = selectedContractsToSave.filter((contract) => contract.sectionId !== this.firstSelectedSplit);
            this.sectionIdSelectedToMerge.mergeFromSectionIds = filterSelectedContracts.map((contract) => contract.sectionId);
            this.sectionIdSelectedToMerge.mergeToSectionId = this.firstSelectedSplit;
            this.sectionIds = filterSelectedContracts.map((contract) => contract.sectionId);
            this.sectionIds.splice(0, 0, this.sectionIdSelectedToMerge.mergeToSectionId);

            if (this.sectionIds && this.sectionIds.length > 0) {
                if (this.sectionIds.length < 2) {
                    const messageText = 'Select atleast 2 splits to merge.';
                    this.snackbarService.informationSnackBar(messageText);
                } else {
                    this.selectedSectionIds.emit({
                        sectiondIds: this.sectionIds,
                    });
                }
            }
            if (this.sectionIdSelectedToMerge.mergeToSectionId) {
                this.getContractLabelFromId(this.sectionIdSelectedToMerge.mergeToSectionId);
            }
        }

    }

    getContractLabelFromId(mergeToSectionId: number) {
        const sectionId = this.tradesListToMergeGridRows.find((trade) =>
            trade.sectionId === Number(mergeToSectionId));
        if (sectionId) {
            this.contractLabel = sectionId.contractSectionCode;
            this.mergeToContractLabel.emit(this.contractLabel);
        }
    }

    onDisplayWarningMessage(selectedSectionId: MergeContracts[]) {
        let mergeToSectionId;
        const mergeFromSectionIds: number[] = [];
        if (selectedSectionId && selectedSectionId.length > 1) {
            selectedSectionId.forEach((element) => {
                mergeToSectionId = element.mergeToSectionId;
                element.mergeFromSectionIds.forEach((sectionId) => {
                    mergeFromSectionIds.push(sectionId);
                });

            });
        } else if (selectedSectionId && selectedSectionId.length === 1) {
            mergeToSectionId = selectedSectionId[0].mergeToSectionId;
            selectedSectionId[0].mergeFromSectionIds.forEach((sectionId) => {
                mergeFromSectionIds.push(sectionId);
            });
        }

        const sectionIdMergeTo = this.tradesListToMergeGridRows.find((trade) => trade.sectionId === Number(mergeToSectionId));
        mergeFromSectionIds.forEach((sectionId) => {
            const tradeList = this.tradesListToMergeGridRows.find((trade) => trade.sectionId === sectionId);
            if (tradeList) {
                if (tradeList.hasCost) {
                    this.mergeFromsectionIdWithCost.push(String(tradeList.sectionId));
                    this.mergeFromsectionIdWithCost.forEach((contractId) => {
                        const id = this.tradesListToMergeGridRows.find((trade) => trade.sectionId === Number(contractId));
                        if (id) {
                            this.mergeFromContractLabel.push(id.contractSectionCode);
                            this.mergeFromContractLabel = Array.from(new Set(this.mergeFromContractLabel.map((contract) => contract)));
                        }
                    });
                }
                if (tradeList.hasCost && tradeList.isInvoiced) {
                    this.mergeFromsectionIdWithInvoiced.push(String(tradeList.sectionId));
                    this.mergeFromsectionIdWithInvoiced.forEach((contractId) => {
                        const id = this.tradesListToMergeGridRows.find((trade) => trade.sectionId === Number(contractId));
                        if (id) {
                            this.mergeFromContractLabel.push(id.contractSectionCode);
                        }
                    });
                }
            }
        });
        if (sectionIdMergeTo) {
            this.mergeToHasCost = sectionIdMergeTo.hasCost;
        }
        if (this.mergeToHasCost && this.mergeFromsectionIdWithCost.length < 1) {
            const costWarningDialog = this.dialog.open(CostImpactWarningDialogComponent, {
                width: '40%',
                height: '40%',
                data: {
                    confirmationMessage: 'The cost of the following contracts will be dropped, please check the cost estimates and P&L impact',
                    contractReference: this.mergeFromContractLabel,
                    warningList: this.warningListForDiffFields,
                },
            });
            const confirmationSubscription = costWarningDialog.afterClosed().subscribe((result) => {
                if (result) {
                    this.message = result ? true : false;
                    this.successMsg.emit(this.message);
                    return;
                }
            });
            this.subscriptions.push(confirmationSubscription);
        }

        if (!this.mergeToHasCost && this.mergeFromsectionIdWithCost.length > 0) {
            const costWarningDialog = this.dialog.open(CostImpactWarningDialogComponent, {
                width: '40%',
                height: '40%',
                data: {
                    confirmationMessage: 'The cost of the following contracts will be dropped, please check the cost estimates and P&L impact',
                    contractReference: this.mergeFromContractLabel,
                    warningList: this.warningListForDiffFields,
                },
            });
            costWarningDialog.afterClosed().subscribe((result) => {
                if (result) {
                    this.message = result ? true : false;
                    this.successMsg.emit(this.message);
                    return;
                }
            });
        }

        if (!this.mergeToHasCost && this.mergeFromsectionIdWithInvoiced.length > 0) {
            const costWarningDialog = this.dialog.open(CostImpactWarningDialogComponent, {
                width: '40%',
                height: '40%',
                data: {
                    confirmationMessage: 'The cost of the following contracts will be updated, please check the cost estimates and P&L impact',
                    contractReference: this.mergeFromContractLabel,
                    warningList: this.warningListForDiffFields,
                },
            });
            costWarningDialog.afterClosed().subscribe((result) => {
                if (result) {
                    this.message = result ? true : false;
                    this.successMsg.emit(this.message);
                    return;
                }
            });
        }
        if (this.mergeToHasCost && this.mergeFromsectionIdWithCost.length > 0 ||
            !this.mergeToHasCost && this.mergeFromsectionIdWithCost.length < 1) {
            this.successMsg.emit(true);
        }
    }

    populateEntity(entity: MergeContracts[]) {
        if (this.mergeOption === ContractMergeOptions.ContractParent) {
            return this.sectionsSelectedToMerge;
        } else {
            const selectedContracts = entity;
            this.sectionIdSelectedToMerge.mergeOption = this.mergeOption;
            selectedContracts.push(this.sectionIdSelectedToMerge);
            return selectedContracts;
        }
    }

    grantLock(sectionId: number, node: agGrid.RowNode) {
        if (node.isSelected()) {
            if (!this.locking.includes(sectionId)) {
                this.locking.push(sectionId);
                this.subscriptions.push(this.lockService.isLockedContract(sectionId).subscribe((lock: IsLocked) => {
                    if (lock.isLocked) {
                        this.dialog.open(ConfirmationDialogComponent, {
                            data: {
                                title: 'Lock',
                                text: lock.message,
                                okButton: 'Got it',
                            },
                        });
                        this.tradesListToMergeGridOptions.api.deselectNode(node);
                        this.locking = this.locking.filter((id) => id !== sectionId);
                    } else {
                        this.subscriptions.push(
                            this.lockService.lockContract(sectionId, LockFunctionalContext.TradeMerge)
                                .subscribe(() => {
                                    this.refeshResourceInformation();
                                    this.locking = this.locking.filter((id) => id !== sectionId);
                                }));

                    }
                }));
            } else {
                if (!this.unlocking.includes(sectionId)) {
                    this.unlocking.push(sectionId);
                    this.refeshResourceInformation();
                    const sectionInfo = this.resourcesInformation.filter((rsc) => rsc.resourceId === sectionId);
                    if (sectionInfo && sectionInfo.length === 0) {
                        this.subscriptions.push(this.lockService.unlockContract(sectionId, LockFunctionalContext.TradeMerge)
                            .subscribe(() => {
                                node.setRowSelectable(true);
                                this.unlocking = this.unlocking.filter((id) => id !== sectionId);
                            }));
                    } else {
                        node.setRowSelectable(true);
                        this.unlocking = this.unlocking.filter((id) => id !== sectionId);
                    }
                }
            }
        }
    }

    warningMessageForDiffFields(warningList: string) {
        if (this.warningListForDiffFields) {
            if (this.warningListForDiffFields.length > 0) {
                this.warningListForDiffFields = this.warningListForDiffFields + ' , ' + warningList;
            } else {
                this.warningListForDiffFields = this.warningListForDiffFields + warningList;
            }
        } else {
            this.warningListForDiffFields = warningList;
        }
    }

    refeshResourceInformation() {
        this.resourcesInformation = new Array<LockResourceInformation>();
        this.tradesListToMergeGridOptions.api.forEachNode((node) => {
            if (node.isSelected()) {
                const resourceInformation = new LockResourceInformation();
                resourceInformation.resourceType = this.contractVariable;
                resourceInformation.resourceId = node.data.sectionId;
                resourceInformation.resourceCode = node.data.contractReference;
                this.resourcesInformation.push(resourceInformation);
            }
        });
    }

    ngOnDestroy(): void {
        this.subscriptions.push(this.lockService.cleanSessionLocks().subscribe(() => {
            this.subscriptions.forEach((subscription: Subscription) => {
                subscription.unsubscribe();
            });
        }));
    }

    getSaveMessageForMergeOption() {
        let mergeFromContractReference: string[] = [];
        let message: string = '';
        let mergeToSectionReference: string = '';
        if (this.sectionsSelectedToMerge) {
            this.sectionsSelectedToMerge.forEach((section) => {
                mergeToSectionReference = this.tradesListToMergeGridRows.find((trade) =>
                    trade.sectionId === Number(section.mergeToSectionId)).contractSectionCode;
                if (section.mergeFromSectionIds) {
                    mergeFromContractReference = [];
                    section.mergeFromSectionIds.forEach((contract) => {
                        mergeFromContractReference.push(this.tradesListToMergeGridRows.find((trade) =>
                            trade.sectionId === Number(contract)).contractSectionCode);
                    });
                }
                message = message + 'The Trade ' + mergeFromContractReference.toString() +
                    ' is merged to ' + mergeToSectionReference + '. ';
            });
            this.multipleMergeSelected.emit(message);
        }
    }

    getCounterpartyCodeFromId(id: number): string {
        const counterpartyCode = this.masterdata.counterparties.find(
            (counterParty) => counterParty.counterpartyID === id);
        return counterpartyCode ? counterpartyCode.counterpartyCode : null;
    }
}
