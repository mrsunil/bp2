import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CompanyManagerService } from '../../../core/services/company-manager.service';
import { SectionTraffic } from '../../../../app/shared/entities/section-traffic.entity';
import { SplitType } from '../../../../app/shared/enums/split-type.enum';
import { SnackbarService } from '../../../../app/shared/services/snackbar.service';
import { AllocationMessage } from '../../../../app/trading/entities/allocation-message';
import { BaseFormComponent } from '../../../shared/components/base-form-component/base-form-component.component';
import { WarningMessageTypes } from '../../../shared/enums/warning-message-type.enum';
import { AllocatedTradeDisplayView } from '../../../shared/models/allocated-trade-display-view';
import { AllocateSectionCommand } from '../../../shared/services/execution/dtos/allocate-section-command';
import { FormConfigurationProviderService } from '../../../shared/services/form-configuration-provider.service';
import { ExecutionService } from '../../../shared/services/http-services/execution.service';
import { TradingService } from '../../../shared/services/http-services/trading.service';
import { SplitCreationResult } from '../../../shared/services/trading/dtos/section';
import { GetWarningMessages } from '../../../shared/validators/warning-messages-validator.validator';
import { PurchaseAllocationComponentComponent } from './allocation-form-components/purchase-allocation-component/purchase-allocation-component.component';
import { QuantityAllocationComponentComponent } from './allocation-form-components/quantity-allocation-component/quantity-allocation-component.component';
import { SaleAllocationComponentComponent } from './allocation-form-components/sale-allocation-component/sale-allocation-component.component';
import { ContractDeallocationDialogComponent } from './contract-deallocation-dialog-component/contract-deallocation-dialog-component.component';
import { DeallocationComponentComponent } from './deallocation-form-component/deallocation-component/deallocation-component.component';
import { LockService } from '../../../shared/services/http-services/lock.service';
import { IsLocked } from '../../../shared/entities/is-locked.entity';
import { ConfirmationDialogComponent } from '../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import * as agGrid from 'ag-grid-community';
import { LockFunctionalContext } from '../../../shared/entities/lock-functional-context.entity';
import { LockResourceInformation } from '../../../shared/entities/lock-resource-information.entity';
import { ContractTypes } from '../../../shared/enums/contract-type.enum';
import { TitleService } from '../../../shared/services/title.service';
import { ContractInvoiceType } from '../../../shared/enums/contract-invoice-type.enum';
import { AllocationSetUp } from '../../../shared/entities/allocation-set-up-entity';
import { ConfigurationService } from '../../../shared/services/http-services/configuration.service';

@Component({
    selector: 'atlas-execution-charter-allocation-deallocation',
    templateUrl: './execution-charter-allocation-deallocation.component.html',
    styleUrls: ['./execution-charter-allocation-deallocation.component.scss'],
})
export class ExecutionCharterAllocationDeallocationComponent extends BaseFormComponent implements OnInit, OnDestroy {
    @ViewChild('purchaseAllocationComponent') purchaseAllocationComponent: PurchaseAllocationComponentComponent;
    @ViewChild('saleAllocationComponent') saleAllocationComponent: SaleAllocationComponentComponent;
    @ViewChild('quantityAllocationComponent') quantityAllocationComponent: QuantityAllocationComponentComponent;
    @ViewChild('deallocationComponent') deallocationComponent: DeallocationComponentComponent;

    allocationMessage: AllocationMessage[] = [];
    contracts: AllocatedTradeDisplayView[] = [];
    allocationCharterFormGroup: FormGroup;

    formComponents: BaseFormComponent[] = [];
    isDisabled: boolean = true;
    isSave: boolean = false;
    message: string;
    errorCount: number = 0;
    allocateSectionSubscription: Subscription;
    splitResult: SplitCreationResult[];
    isDeallocationDisabled: boolean = true;
    charterId: number;
    resourcesInformation: LockResourceInformation[] = new Array<LockResourceInformation>();
    locking: number[] = [];
    unlocking: number[] = [];
    isLoadingassign: boolean = false;
    isSaleDataUpdated: boolean = false;
    isPurchaseDataUpdated: boolean = false;
    isTradesAvailableForWashout: boolean = false;
    allocationSetUpData: AllocationSetUp[] = [];
    company: string;


    constructor(private executionService: ExecutionService,
        private route: ActivatedRoute,
        protected snackbarService: SnackbarService,
        protected formConfigurationProvider: FormConfigurationProviderService,
        protected formBuilder: FormBuilder,
        protected companyManager: CompanyManagerService,
        protected router: Router,
        protected tradingService: TradingService,
        public dialog: MatDialog,
        protected lockService: LockService,
        private titleService: TitleService,
        protected configurationService: ConfigurationService, ) {
        super(formConfigurationProvider);
    }

    ngOnInit() {
        this.company = this.route.snapshot.paramMap.get('company');
        this.charterId = Number(this.route.snapshot.paramMap.get('charterId'));
        this.allocationCharterFormGroup = this.formBuilder.group({
            quantityGroup: this.quantityAllocationComponent.getFormGroup(),
        });
        this.formComponents.push(
            this.purchaseAllocationComponent,
            this.saleAllocationComponent,
            this.quantityAllocationComponent,
        );
        this.subscriptions.push(this.lockService.cleanSessionLocks().subscribe());
        this.titleService.setTitle('Trade Allocation/Deallocation')
        this.getAllocationSetUpData(this.company);
    }

    canDeactivate() {
        if (this.allocationCharterFormGroup.dirty && this.isSave === false) {
            return window.confirm("Leave an unsave form? \nYour changes won't be applied!");
        }
        return true;
    }

    allocationSuccessful() {
        this.quantityAllocationComponent.formGroup.reset();
    }

    onAllocateButtonClicked() {
        this.isLoadingassign = true;
        this.isSaleDataUpdated = false;
        this.isPurchaseDataUpdated = false;
        this.isDisabled = true;
        this.isSave = true;
        if (this.allocationCharterFormGroup.valid) {

            const allocationDetails = this.getAllocationDetails() as AllocateSectionCommand;
            this.checkWashoutContract(this.contracts);
            if (this.isTradesAvailableForWashout) {
                const confirmDiscardDialog = this.dialog.open(ConfirmationDialogComponent, {
                    data: {
                        title: 'Washout Contract',
                        text: 'Do you want to mark this contract as washout ?',
                        okButton: 'Yes',
                        cancelButton: 'No',
                    },
                });
                confirmDiscardDialog.afterClosed().subscribe((answer) => {
                    if (answer) {
                        allocationDetails.contractInvoiceTypeId = ContractInvoiceType.Washout;
                        this.onAllocation(allocationDetails);
                    }
                    else {
                        this.onAllocation(allocationDetails);
                    }
                });
            }
            else {
                this.onAllocation(allocationDetails);
            }



        }
    }

    onDiscardButtonClicked() {
        this.isSave = true;
        const confirmDiscardDialog = this.dialog.open(ConfirmationDialogComponent, {
            data: {
                title: 'Discard Changes',
                text: 'You have some modification pending. Close and lose changes?',
                okButton: 'Ok',
                cancelButton: 'Cancel',
            },
        });
        confirmDiscardDialog.afterClosed().subscribe((answer) => {
            if (answer) {
                this.router.navigate([this.route.snapshot.paramMap.get('company') +
                    '/execution/charter/details', this.charterId]);
            }
        });
    }

    onDeallocateButtonClicked() {
        this.isDeallocationDisabled = true;
        this.isSave = true;
        const contract = this.deallocationComponent.getSelectedRow()[0];
        if (contract) {
            this.openDeallocationDialog(contract.sectionId);
        }
    }
    openDeallocationDialog(sectionId: number): void {
        const dialogRef = this.dialog.open(ContractDeallocationDialogComponent, {
            disableClose: true,
            width: '250px',
            panelClass: 'trade-approval-dialog-class',
            backdropClass: 'trade-approval-dialog-background-class',
        });

        this.subscriptions.push(dialogRef.afterClosed().subscribe((result: boolean) => {
            if (result !== undefined) {
                this.subscriptions.push(this.executionService.deallocateContract(sectionId, result)
                    .subscribe((ok) => {
                        if (ok) {
                            this.snackbarService.throwErrorSnackBar(
                                'Trade has been successfully de-allocated',
                            );
                            this.updateContractData();
                            let selectedContracts = this.deallocationComponent.getSelectedRow();
                            this.cleanAllocationSelectedContracts();
                            this.refeshResourceInformation();
                            selectedContracts.forEach((selectedContract) => {
                                this.subscriptions.push(this.lockService.unlockContract(selectedContract.sectionId, LockFunctionalContext.Deallocation).subscribe());
                            })
                        }
                    }));
            } else {
                this.isDeallocationDisabled = false;
            }
        }));
    }

    validateContract() {
        this.errorCount = 0;
        const purchaseContract = this.purchaseAllocationComponent.getSelectedRow();
        const saleContract = this.saleAllocationComponent.getSelectedRow();
        if (purchaseContract && saleContract) {
            this.message = '';
            this.allocationMessage = [];
            this.contracts = [];
            this.contracts.push(purchaseContract);
            this.contracts.push(saleContract);
            this.quantityAllocationComponent.updateQuantityData(this.contracts);
            if (purchaseContract.departmentCode !== saleContract.departmentCode) {
                this.message = 'Department,';
                this.errorCount = this.errorCount + 1;
            }
            if (purchaseContract.weightCode !== saleContract.weightCode) {
                this.message = this.message + 'Quantity Code';
                this.errorCount = this.errorCount + 1;
            }
            if (this.message.length > 0) {
                this.message = this.message + ' ' + 'must be the same to perform allocation.';
            }
            this.allocateSectionSubscription =
                this.executionService.getWarningMessages(purchaseContract.sectionId, saleContract.sectionId)
                    .subscribe((data) => {
                        if (data.value.length > 1) {
                            this.allocationMessage = GetWarningMessages(data.value, this.allocationSetUpData);
                        }
                        if (this.allocationMessage.length > 0) {
                            this.allocationMessage.forEach((item) => {
                                if (item.errorTypeId === WarningMessageTypes.Restricted) {
                                    this.errorCount = this.errorCount + 1;
                                    this.message = this.message + ', ' + item.message;
                                }
                                if (item.errorTypeId === WarningMessageTypes.Warning) {
                                    this.message = this.message + ', ' + item.message;
                                }
                            });
                        }
                        this.displayErrorMessages();
                    });
        } else {
            this.contracts = [];
            this.quantityAllocationComponent.updateQuantityData(this.contracts);
            this.isDisabled = true;
        }
    }

    ngOnDestroy(): void {
        if (this.allocateSectionSubscription) {
            this.allocateSectionSubscription.unsubscribe();
        }
        this.subscriptions.push(this.lockService.cleanSessionLocks().subscribe(() => {
            this.subscriptions.forEach((subscription: Subscription) => {
                subscription.unsubscribe();
            });
        }));
    }

    displayErrorMessages() {
        if (this.message.length > 0) {
            this.message = this.message.replace(/^,|,$/g, '');
            this.snackbarService.throwErrorSnackBar(
                this.message,
            );
        }
        this.isDisabled = this.errorCount > 0 ? true : false;
    }

    getAllocationDetails() {
        let allocationDetails = new AllocateSectionCommand();
        this.formComponents.forEach((comp) => {
            allocationDetails = comp.populateEntity(allocationDetails);
        });
        return allocationDetails;
    }

    allocateTrade(allocationDetails: AllocateSectionCommand) {
        this.subscriptions.push(this.executionService
            .allocate(allocationDetails)
            .subscribe((data) => {
                const message = 'the trade' + ' ' + allocationDetails.sectionReference + ' ' +
                    ' has been properly allocated to ' + ' ' +
                    allocationDetails.allocatedSectionReference + ' ' + ' with the number ' + ' ' + data;
                this.snackbarService.informationAndCopySnackBar(message, message);
                this.updateContractData();
                this.cleanAllocationSelectedContracts();
                this.refeshResourceInformation();
                this.subscriptions.push(this.lockService.unlockContract(allocationDetails.sectionId, LockFunctionalContext.Deallocation).subscribe());
                this.subscriptions.push(this.lockService.unlockContract(allocationDetails.allocatedSectionId, LockFunctionalContext.Deallocation).subscribe());
                this.allocationSuccessful();
            }));
    }

    createSplitAndAllocate(sectionIds: number[], allocationDetails: AllocateSectionCommand) {
        const splitResult: SplitCreationResult[] = [];
        const splitIds: number[] = [];
        this.allocateSectionSubscription = this.tradingService
            .createSplitForContract(sectionIds, allocationDetails.quantity)
            .subscribe(((data) => {
                this.splitResult = data as SplitCreationResult[];
                if (this.splitResult.length > 0 && allocationDetails.splitType === SplitType.SourceSplit) {
                    allocationDetails.sectionId = this.splitResult[0].sectionId;
                    allocationDetails.sectionReference = this.splitResult[0].contractLabel;
                    splitIds.push(allocationDetails.sectionId);
                } else if (this.splitResult.length > 0 && allocationDetails.splitType === SplitType.TargetSplit) {
                    allocationDetails.allocatedSectionId = this.splitResult[0].sectionId;
                    allocationDetails.allocatedSectionReference = this.splitResult[0].contractLabel;
                    splitIds.push(allocationDetails.allocatedSectionId);
                } else {
                    if (this.splitResult.length > 1) {
                        allocationDetails.sectionId = this.splitResult[0].sectionId;
                        allocationDetails.allocatedSectionId = this.splitResult[1].sectionId;
                        allocationDetails.sectionReference = this.splitResult[0].contractLabel;
                        allocationDetails.allocatedSectionReference = this.splitResult[1].contractLabel;
                        splitIds.push(allocationDetails.sectionId);
                        splitIds.push(allocationDetails.allocatedSectionId);
                    }
                }
                this.assignSplitToCharter(splitIds, allocationDetails);
            }),
            );
    }
    
    assignSplitToCharter(splitIds: number[], allocationDetails: AllocateSectionCommand) {
        if (splitIds.length >= 1) {
            const sectionTrafficList = [];
            splitIds.forEach((splitId) => {
                sectionTrafficList.push(this.executionService.GetSectionTrafficDetails(splitId).toPromise());
            });
            Promise.all(sectionTrafficList).then((result) => {
                this.executionService.assignSectionsToCharter(this.charterId, result).subscribe(((data) => {
                    this.allocateTrade(allocationDetails);
                }));
            });
        } else {
            this.allocationSuccessful();
        }
    }

    validateDeallocationContract() {
        const contracts = this.deallocationComponent.getSelectedRow();
        this.isDeallocationDisabled = contracts.length > 2 ? true : false;
    }

    updateContractData() {
        this.purchaseAllocationComponent.getPurchaseTradesForAllocation();
        this.saleAllocationComponent.getSaleTradesForAllocation();
        this.deallocationComponent.getcontractsForDeallocation();
        this.refeshResourceInformation();
    }

    purchaseRowSelectedChange(event) {
        this.grantLock(Number(event.data.sectionId), event.node, ContractTypes.Purchase);
    }

    saleRowSelectedChange(event) {
        this.grantLock(Number(event.data.sectionId), event.node, ContractTypes.Sale);
    }

    rowDataUpdated(event) {
        if (event.salesDataUpdated) {
            this.isSaleDataUpdated = true;
        }
        if (event.purchaseDataUpdated) {
            this.isPurchaseDataUpdated = true;
        }
        if (this.isSaleDataUpdated && this.isPurchaseDataUpdated) {
            this.isLoadingassign = false;

        }

    }
    deallocationRowSelectedChange(event) {
        this.grantLock(Number(event.data.sectionId), event.node, null);
    }

    grantLock(sectionId: number, node: agGrid.RowNode, contractType: ContractTypes) {
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
                        if (contractType === null) {
                            this.deallocationComponent.gridApi.deselectNode(node);
                        }
                        else if (contractType === ContractTypes.Purchase) {
                            this.purchaseAllocationComponent.gridApi.deselectNode(node);
                        }
                        else if (contractType === ContractTypes.Sale) {
                            this.saleAllocationComponent.gridApi.deselectNode(node);
                        }
                        this.locking = this.locking.filter((id) => id !== sectionId);
                    } else {
                        let lockFunctionalContext = LockFunctionalContext.BulkAllocation;
                        if (contractType === null) {
                            lockFunctionalContext = LockFunctionalContext.BulkDeallocation;
                        }
                        this.subscriptions.push(this.lockService.lockContract(sectionId, lockFunctionalContext).subscribe((lockState) => {
                            this.refeshResourceInformation();
                            this.locking = this.locking.filter((id) => id !== sectionId);
                        }));

                    }
                }));
            }
        } else {
            if (!this.unlocking.includes(sectionId)) {
                this.unlocking.push(sectionId);
                this.refeshResourceInformation();
                let lockFunctionalContext = LockFunctionalContext.BulkAllocation;
                if (contractType === null) {
                    lockFunctionalContext = LockFunctionalContext.BulkDeallocation;
                }
                this.subscriptions.push(this.lockService.unlockContract(sectionId, lockFunctionalContext).subscribe(() => {
                    node.setRowSelectable(true);
                    this.unlocking = this.unlocking.filter((id) => id !== sectionId);
                }));
            }
        }
    }

    cleanAllocationSelectedContracts() {

        this.purchaseAllocationComponent.gridApi.forEachNode((node) => {
            if (node.isSelected()) {
                this.purchaseAllocationComponent.gridApi.deselectNode(node);
            }
        });
        this.saleAllocationComponent.gridApi.forEachNode((node) => {
            if (node.isSelected()) {
                this.saleAllocationComponent.gridApi.deselectNode(node);
            }
        });

    }

    refeshResourceInformation() {
        this.resourcesInformation = new Array<LockResourceInformation>();
        this.purchaseAllocationComponent.gridApi.forEachNode((node) => {
            if (node.isSelected()) {
                const resourceInformation = new LockResourceInformation();
                resourceInformation.resourceType = 'Contract';
                resourceInformation.resourceId = node.data.sectionId;
                resourceInformation.resourceCode = node.data.contractReference;
                this.resourcesInformation.push(resourceInformation);
            }
        });
        this.saleAllocationComponent.gridApi.forEachNode((node) => {
            if (node.isSelected()) {
                const resourceInformation = new LockResourceInformation();
                resourceInformation.resourceType = 'Contract';
                resourceInformation.resourceId = node.data.sectionId;
                resourceInformation.resourceCode = node.data.contractReference;
                this.resourcesInformation.push(resourceInformation);
            }
        });
        this.deallocationComponent.gridApi.forEachNode((node) => {
            if (node.isSelected()) {
                const resourceInformation = new LockResourceInformation();
                resourceInformation.resourceType = 'Contract';
                resourceInformation.resourceId = node.data.sectionId;
                resourceInformation.resourceCode = node.data.contractReference;
                this.resourcesInformation.push(resourceInformation);
            }
        });
    }
    disableAllocationButton(value) {
        this.isDisabled = (value) ? true : false;
    }
    checkWashoutContract(contract: AllocatedTradeDisplayView[]) {

        if (contract[0].counterparty === contract[1].counterparty && contract[0].currencyCode === contract[1].currencyCode) {
            this.isTradesAvailableForWashout = true;
        }
        else {
            this.isTradesAvailableForWashout = false;
        }
    }
    onAllocation(allocationDetails: AllocateSectionCommand) {
        if ((allocationDetails.quantity === allocationDetails.sourceQuantity) &&
            (allocationDetails.quantity === allocationDetails.targetQuantity)) {
            this.allocateTrade(allocationDetails);
        } else {
            const sectionIds: number[] = [];
            allocationDetails.splitType = (allocationDetails.sourceQuantity > allocationDetails.quantity) &&
                (allocationDetails.targetQuantity === allocationDetails.quantity) ? SplitType.SourceSplit :
                (allocationDetails.sourceQuantity === allocationDetails.quantity) &&
                    (allocationDetails.targetQuantity > allocationDetails.quantity) ? SplitType.TargetSplit : SplitType.Both;
            switch (allocationDetails.splitType) {
                case SplitType.SourceSplit:
                    sectionIds.push(allocationDetails.sectionId);
                    this.createSplitAndAllocate(sectionIds, allocationDetails);
                    break;
                case SplitType.TargetSplit:
                    sectionIds.push(allocationDetails.allocatedSectionId);
                    this.createSplitAndAllocate(sectionIds, allocationDetails);
                    break;
                case SplitType.Both:
                    sectionIds.push(allocationDetails.sectionId);
                    sectionIds.push(allocationDetails.allocatedSectionId);
                    this.createSplitAndAllocate(sectionIds, allocationDetails);
                    break;
            }
        }
    }

    // this method will fetch allocationsetupdata for a company
    getAllocationSetUpData(company: string) {
        this.configurationService.getAllocationSetUpByCompany(company)
            .subscribe((data) => {
                if (data && data.length > 0) {
                    this.allocationSetUpData = data;
                }
            });
    }
}
