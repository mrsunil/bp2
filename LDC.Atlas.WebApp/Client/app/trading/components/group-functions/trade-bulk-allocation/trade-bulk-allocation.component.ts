import { Component, OnInit, ViewChild } from '@angular/core';
import { MatStepper, MatDialog } from '@angular/material';
import { BaseFormComponent } from '../../../../shared/components/base-form-component/base-form-component.component';
import { FormGroup, FormBuilder } from '@angular/forms';
import { FormConfigurationProviderService } from '../../../../shared/services/form-configuration-provider.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CompanyManagerService } from '../../../../core/services/company-manager.service';
import { TradingService } from '../../../../shared/services/http-services/trading.service';
import { ContractsForBulkFunctions } from '../../../../shared/services/trading/dtos/contracts-for-bulk-functions';
import { ConfirmationDialogComponent } from '../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { GroupFunctionWarningComponent } from '../group-function-warning/group-function-warning.component';
import { GroupFunctionContractsComponent } from '../group-function-contracts/group-function-contracts.component';
import { AllocationGridsComponent } from './allocation-grids/allocation-grids.component';
import { ContractTypes } from '../../../../shared/enums/contract-type.enum';
import { Section } from '../../../../shared/entities/section.entity';
import { AtlasNumber } from '../../../../shared/entities/atlas-number.entity';
import { DiscountBasis } from '../../../../shared/enums/discount-basis.enum';
import { conformToMask } from 'text-mask-core';
import { DiscountTypes } from '../../../../shared/enums/discount-type.enum';
import { CustomNumberMask } from '../../../../shared/numberMask';
import { MasterData } from '../../../../shared/entities/masterdata.entity';
import { TrancheSplitCreationResult } from '../../../../shared/services/trading/dtos/section';
import { AllocateSection } from '../../../../shared/entities/allocate-section.entity';
import { ExecutionService } from '../../../../shared/services/http-services/execution.service';
import { SnackbarService } from '../../../../shared/services/snackbar.service';
import { Subscription } from 'rxjs';
import { ContractInvoiceType } from '../../../../shared/enums/contract-invoice-type.enum';
import { AnimateShowChangeCellRenderer } from 'ag-grid-community';

@Component({
    selector: 'atlas-trade-bulk-allocation',
    templateUrl: './trade-bulk-allocation.component.html',
    styleUrls: ['./trade-bulk-allocation.component.scss']
})
export class TradeBulkAllocationComponent extends BaseFormComponent implements OnInit {

    @ViewChild('stepper') stepper: MatStepper;
    @ViewChild('contractSelection') contractSelection: GroupFunctionContractsComponent;
    @ViewChild('allocationGridsComponent') allocationGridsComponent: AllocationGridsComponent;
    @ViewChild('groupFunctionWarning') groupFunctionWarning: GroupFunctionWarningComponent;

    currentStep: number = 0;
    isContractsNextDisabled: boolean = true;
    formComponents: BaseFormComponent[] = [];
    bulkAllocationForm: FormGroup;
    disableSave: boolean = true;
    sectionModel: Section;
    masterData: MasterData = new MasterData();
    splitResult: TrancheSplitCreationResult[];
    subscription: Subscription[] = [];
    isLoading: boolean = false;
    constructor(protected formConfigurationProvider: FormConfigurationProviderService,
        protected formBuilder: FormBuilder,
        private route: ActivatedRoute,
        protected dialog: MatDialog,
        private router: Router,
        private executionService: ExecutionService,
        private companyManager: CompanyManagerService,
        protected snackbarService: SnackbarService,
        protected tradingService: TradingService) {
        super(formConfigurationProvider);
    }

    ngOnInit() {
        this.masterData = this.route.snapshot.data.masterdata;
        this.bulkAllocationForm = this.formBuilder.group({
            contractSelection: this.contractSelection.getFormGroup(),
            allocationGridsComponent: this.allocationGridsComponent.getFormGroup(),
        });
        this.formComponents.push(this.contractSelection, this.allocationGridsComponent);
    }

    onChangeStepAction(event) {
        this.currentStep = event.selectedIndex;
    }

    onContractSelectionDiscardButtonClicked() {
        if (this.isContractsNextDisabled) {
            this.router.navigate(['/' + this.companyManager.getCurrentCompanyId() + '/trades']);
        } else {
            this.discardButtonDialog();
        }
    }

    isContractSelected(contractSelected: boolean) {
        this.isContractsNextDisabled = !contractSelected;
    }

    onContractSelectionNextButtonClicked() {
        const selectedContracts = this.contractSelection.selectedContractsForBulkFunctions as ContractsForBulkFunctions[];
        this.allocationGridsComponent.contractPurchaseRows = selectedContracts.filter((contract) => contract.contractType === ContractTypes[0]);
        this.allocationGridsComponent.contractSalesRows = selectedContracts.filter((contract) => contract.contractType === ContractTypes[1]);
        this.stepper.next();
    }

    discardButtonDialog() {
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
                this.router.navigate(['/' + this.companyManager.getCurrentCompanyId() + '/trades']);
            }
        });
    }

    onFieldSelectionPreviousButtonClicked() {
        this.stepper.previous();
    }

    onAllocateButtonClicked() {
        //call create bulk split
        let sectionQuantities = [];
        const purchaseSelectedRows = this.allocationGridsComponent.gridApiPurchaseSelected.getSelectedRows();
        const saleSelectedRows = this.allocationGridsComponent.gridApiSaleSelected.getSelectedRows();
        if (purchaseSelectedRows && saleSelectedRows) {
            this.isLoading = true;
            if (purchaseSelectedRows.length === 1 && saleSelectedRows.length === 1) {
                this.oneToOneAllocation(purchaseSelectedRows, saleSelectedRows, sectionQuantities);
            }
            else if (purchaseSelectedRows.length == 1 && saleSelectedRows.length > 1) {
                saleSelectedRows.forEach((contract) => {
                    sectionQuantities.push(contract.quantity);

                });
                this.calculateContractValue(purchaseSelectedRows[0].sectionId, sectionQuantities, saleSelectedRows)
            }
            else if (saleSelectedRows.length == 1 && purchaseSelectedRows.length > 1) {
                purchaseSelectedRows.forEach((contract) => {
                    sectionQuantities.push(contract.quantity);
                });
                this.calculateContractValue(saleSelectedRows[0].sectionId, sectionQuantities, purchaseSelectedRows)
            }
        }

    }
    isSaveDisabled(params: boolean) {
        this.disableSave = params;
    }
    setContractValue(sectionModel: Section, quantityValue: number, formatValue = true): string {
        let quantityVal;
        quantityVal = quantityValue;
        const mask = CustomNumberMask(12, 10, true);
        if (this.masterData === undefined) {
            return;
        }
        const weightCodeConversion = this.masterData.weightUnits.
            find((weightUnit) => weightUnit.weightUnitId === sectionModel.weightUnitId).conversionFactor;
        const selectedPriceUnit = this.masterData.priceUnits.filter(
            (priceUnit) => priceUnit.priceUnitId === sectionModel.priceUnitId,
        );
        const priceCodeConversion =
            selectedPriceUnit.length > 0
                ? selectedPriceUnit[0].conversionFactor
                : undefined;

        if (!weightCodeConversion || !priceCodeConversion
            || !quantityValue
            || !sectionModel.price) {
            sectionModel.contractedValue = '';
            return;
        }
        const contractPrice = sectionModel.price.toString().replace(/,/g, '');
        let contractPriceDecimal: AtlasNumber = new AtlasNumber(contractPrice);
        const quantity = quantityVal.toString().replace(/,/g, '');
        const quantityDecimal: AtlasNumber = new AtlasNumber(quantity);

        if (sectionModel.premiumDiscountTypeId !== undefined &&
            sectionModel.currencyCode !== sectionModel.premiumDiscountCurrency &&
            sectionModel.premiumDiscountTypeId !== undefined) {
            // discountPremiumValue exists

            let discountPremiumContractedPrice: number | AtlasNumber = 0;
            const discountPremiumSign = ((sectionModel.premiumDiscountTypeId as DiscountTypes) === DiscountTypes.Discount ? -1 : 1);

            // tslint:disable-next-line:prefer-conditional-expression
            if ((sectionModel.premiumDiscountBasis as DiscountBasis) === DiscountBasis.Rate) {
                discountPremiumContractedPrice = sectionModel.premiumDiscountValue * discountPremiumSign;
            } else if ((sectionModel.premiumDiscountBasis as DiscountBasis) === DiscountBasis.Percent) {
                discountPremiumContractedPrice = contractPriceDecimal
                    .times((sectionModel.premiumDiscountValue * discountPremiumSign / 100));
            }
            contractPriceDecimal = contractPriceDecimal.plus(discountPremiumContractedPrice);
        }

        const contractValue = contractPriceDecimal.times(quantityDecimal).times(
            weightCodeConversion *
            priceCodeConversion).toString();

        if (formatValue) {
            const contractValueFormatted = conformToMask(contractValue, mask, { guide: false }).conformedValue;
            sectionModel.contractedValue = contractValueFormatted;
        } else {
            sectionModel.contractedValue = contractValue;
        }

        return sectionModel.contractedValue;

    }

    createSplitsAndAllocate(sectionId, quantities, contractValues, targetSelectedRows: ContractsForBulkFunctions[]) {
        targetSelectedRows = this.checkWashoutContracts(targetSelectedRows);
        this.creatingPopupForWashoutContract(targetSelectedRows, sectionId, quantities, contractValues)
    }


    allocateTrade(allocateSectionModel) {
        this.executionService.allocateSections(allocateSectionModel).subscribe(() => {
            this.contractSelection.getContractsToAllocation(true);
            this.snackbarService.informationSnackBar('Allocation  of selected contracts is done successfully');
            this.isLoading = false;
        });
    }

    calculateContractValue(sectionId, sectionQuantities, targetSelectedRows) {
        let sectionContractValues = [];
        this.tradingService.getSection(sectionId, 0)
            .subscribe((data) => {
                this.sectionModel = data;

                if (sectionQuantities) {
                    sectionQuantities.forEach((quantity) => {
                        let value = this.setContractValue(this.sectionModel, quantity, false);
                        sectionContractValues.push(value);
                    });
                    this.createSplitsAndAllocate(sectionId, sectionQuantities, sectionContractValues, targetSelectedRows);
                }
            });
    }
    oneToOneAllocation(purchaseSelectedRows, saleSelectedRows, sectionQuantities) {
        let sectionIds = [];
        let isWashoutContract: boolean = false;
        isWashoutContract = this.checkWashoutConditionForOneToOneAllocation(purchaseSelectedRows, saleSelectedRows);
        if (this.allocationGridsComponent.formGroup.valid) {
            if (purchaseSelectedRows[0].quantity === saleSelectedRows[0].quantity) {
                if (this.allocationGridsComponent.sourceQuantityCtrl.value === purchaseSelectedRows[0].quantity) {
                    const allocateSectionModel: AllocateSection[] = [];
                    const allocateSectionElement: AllocateSection = new AllocateSection();

                    if (isWashoutContract) {
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
                                allocateSectionElement.contractInvoiceTypeId = ContractInvoiceType.Washout;
                                this.onAllocationOfOnetoOneTrade(allocateSectionElement, purchaseSelectedRows, saleSelectedRows, allocateSectionModel);
                            }
                            else {
                                this.onAllocationOfOnetoOneTrade(allocateSectionElement, purchaseSelectedRows, saleSelectedRows, allocateSectionModel);
                            }
                        });
                    }
                    else {
                        this.onAllocationOfOnetoOneTrade(allocateSectionElement, purchaseSelectedRows, saleSelectedRows, allocateSectionModel);
                    }

                }
                else {
                    sectionIds.push(purchaseSelectedRows[0].sectionId, saleSelectedRows[0].sectionId);
                    let quantitity = this.allocationGridsComponent.sourceQuantityCtrl.value;
                    let washoutRequired: boolean = false;
                    if (isWashoutContract) {
                        this.popUpForOnetoOneAllocationForWashout(sectionIds, quantitity)
                    }
                    else {
                        this.calculateContractValueForSingleAllocation(sectionIds, quantitity, washoutRequired)
                    }
                }

            }

            else if (purchaseSelectedRows[0].quantity > saleSelectedRows[0].quantity) {
                if (saleSelectedRows[0].quantity === this.allocationGridsComponent.sourceQuantityCtrl.value) {
                    sectionQuantities.push(saleSelectedRows[0].quantity);
                    this.calculateContractValue(purchaseSelectedRows[0].sectionId, sectionQuantities, saleSelectedRows)
                }
                else {
                    sectionIds.push(purchaseSelectedRows[0].sectionId, saleSelectedRows[0].sectionId);
                    let quantitity = this.allocationGridsComponent.sourceQuantityCtrl.value;
                    let washoutRequired: boolean = false;
                    if (isWashoutContract) {
                        this.popUpForOnetoOneAllocationForWashout(sectionIds, quantitity)
                    }
                    else {
                        this.calculateContractValueForSingleAllocation(sectionIds, quantitity, washoutRequired)
                    }
                }
            }
            else if (purchaseSelectedRows[0].quantity < saleSelectedRows[0].quantity) {
                if (purchaseSelectedRows[0].quantity === this.allocationGridsComponent.sourceQuantityCtrl.value) {
                    sectionQuantities.push(purchaseSelectedRows[0].quantity);
                    this.calculateContractValue(saleSelectedRows[0].sectionId, sectionQuantities, purchaseSelectedRows)
                }
                else {
                    sectionIds.push(purchaseSelectedRows[0].sectionId, saleSelectedRows[0].sectionId);
                    let quantitity = this.allocationGridsComponent.sourceQuantityCtrl.value;
                    let washoutRequired: boolean = false;
                    if (isWashoutContract) {
                        this.popUpForOnetoOneAllocationForWashout(sectionIds, quantitity)
                    }
                    else {
                        this.calculateContractValueForSingleAllocation(sectionIds, quantitity, washoutRequired)
                    }
                }
            }
        }
        else {
            this.isLoading = false;
            this.snackbarService.informationSnackBar('Form is invalid. Please resolve the errors.');
        }

    }

    async createSplitOneToOneAndAllocate(sectionIds, quantitity, contractValues, washoutRequired: boolean) {
        this.tradingService.createSplitForContract(sectionIds, quantitity, null, contractValues)
            .subscribe(
                (data) => {
                    this.splitResult = data as TrancheSplitCreationResult[];
                    if (this.splitResult) {
                        const allocateSectionModel: AllocateSection[] = [];
                        const allocateSectionElement: AllocateSection = new AllocateSection();
                        allocateSectionElement.sectionId = this.splitResult[0].sectionId;
                        allocateSectionElement.allocatedSectionId = this.splitResult[1].sectionId;
                        allocateSectionElement.quantity = quantitity;
                        allocateSectionElement.shippingType = this.allocationGridsComponent.shippingTypeCtrl.value;
                        allocateSectionElement.dataVersionId = null;
                        if (washoutRequired) {
                            allocateSectionElement.contractInvoiceTypeId = ContractInvoiceType.Cancellation
                        }
                        allocateSectionModel.push(allocateSectionElement);
                        this.allocateTrade(allocateSectionModel);
                    }
                });
    }
    calculateContractValueForSingleAllocation(sectionIds, sectionQuantitity, washoutRequired: boolean) {
        let sectionContractValues = [];
        if (sectionIds && sectionIds.length > 0) {
            sectionIds.forEach((sectionId) => {
                this.subscription.push(this.tradingService.getSection(sectionId, 0)
                    .subscribe((data) => {
                        this.sectionModel = data;
                        const contractValue = this.setContractValue(this.sectionModel, sectionQuantitity, false)
                        sectionContractValues.push(contractValue);
                        if (sectionContractValues && sectionContractValues.length == 2) {
                            this.createSplitOneToOneAndAllocate(sectionIds, sectionQuantitity, sectionContractValues, washoutRequired);
                        }
                    }));
            });

        }
    }
    onNoMoreAllocationClicked() {
        this.router.navigate(['/' + this.companyManager.getCurrentCompanyId() + '/trades']);
    }
    resetAllocationGrids(params: boolean) {
        if (params) {
            let purchaseRowData = [];
            let saleRowData = [];
            const rowData = this.contractSelection.ContractGridRows;
            const saleSelectedContracts = this.allocationGridsComponent.contractSalesRows;
            const purchaseContracts = this.allocationGridsComponent.contractPurchaseRows;
            if (rowData && saleSelectedContracts && purchaseContracts) {
                rowData.forEach((data) => {
                    let saleContract = saleSelectedContracts.find((contract) => contract.sectionId === data.sectionId);
                    if (saleContract) {
                        saleRowData.push(data);
                    }
                    let purchaseContract = purchaseContracts.find((contract) => contract.sectionId === data.sectionId);
                    if (purchaseContract) {
                        purchaseRowData.push(data);
                    }


                });
                this.allocationGridsComponent.resetGrids(saleRowData, purchaseRowData)
            }

        }
    }


    checkWashoutContracts(targetSelectedRows: ContractsForBulkFunctions[]) {
        let code: string = ''
        if (this.sectionModel.contractType === ContractTypes.Purchase) {
            code = this.sectionModel.sellerCode;
        } else if (this.sectionModel.contractType === ContractTypes.Sale) {
            code = this.sectionModel.buyerCode;
        }
        targetSelectedRows.forEach((element) => {
            if (element.currencyCode === this.sectionModel.currencyCode && element.counterparty === code) {
                element.isWashout = true;
            }
            else {
                element.isWashout = false;
            }

        });
        return targetSelectedRows;
    }

    onSplitAndAllocation(sectionId, quantities, contractValues, targetSelectedRows: ContractsForBulkFunctions[], isWashoutRequire) {
        this.tradingService.createBulkSplitForContract(sectionId, quantities, null, contractValues)
            .subscribe(
                (data) => {
                    this.splitResult = data as TrancheSplitCreationResult[];
                    const allocateSectionModel: AllocateSection[] = [];
                    if (this.splitResult && this.splitResult.length > 0) {
                        for (let i = 0; i < this.splitResult.length; i++) {
                            const allocateSectionElement: AllocateSection = new AllocateSection();
                            allocateSectionElement.sectionId = this.splitResult[i].sectionId;
                            allocateSectionElement.allocatedSectionId = targetSelectedRows[i].sectionId;
                            allocateSectionElement.quantity = targetSelectedRows[i].quantity;
                            allocateSectionElement.shippingType = this.allocationGridsComponent.shippingTypeCtrl.value;
                            allocateSectionElement.dataVersionId = null;
                            if (isWashoutRequire && targetSelectedRows[i].isWashout) {
                                allocateSectionElement.contractInvoiceTypeId = ContractInvoiceType.Washout;
                            }
                            allocateSectionModel.push(allocateSectionElement);
                        }
                    }
                    this.allocateTrade(allocateSectionModel);
                });
    }

    creatingPopupForWashoutContract(targetSelectedRows, sectionId, quantities, contractValues) {
        let isWashoutRequired: boolean = false;
        let message: string = '';
        targetSelectedRows.forEach((element) => {
            if (element.isWashout) {
                message = message + ' , ' + element.contractLabel;
            }
        });
        if (message != '') {
            const confirmDiscardDialog = this.dialog.open(ConfirmationDialogComponent, {
                data: {
                    title: 'Washout Contract',
                    text: `Do you want to mark  ${message} contract as washout ?`,
                    okButton: 'Yes',
                    cancelButton: 'No',
                },
            });
            confirmDiscardDialog.afterClosed().subscribe((answer) => {
                if (answer) {
                    isWashoutRequired = true;
                    this.onSplitAndAllocation(sectionId, quantities, contractValues, targetSelectedRows, isWashoutRequired)
                }
                else {
                    isWashoutRequired = false;
                    this.onSplitAndAllocation(sectionId, quantities, contractValues, targetSelectedRows, isWashoutRequired)
                }
            });
        }
        else {
            isWashoutRequired = false;
            this.onSplitAndAllocation(sectionId, quantities, contractValues, targetSelectedRows, isWashoutRequired)
        }

    }
    checkWashoutConditionForOneToOneAllocation(purchaseSelectedRows: ContractsForBulkFunctions[], saleSelectedRows: ContractsForBulkFunctions[]) {
        if (purchaseSelectedRows[0].counterparty === saleSelectedRows[0].counterparty &&
            purchaseSelectedRows[0].currencyCode === saleSelectedRows[0].currencyCode) {
            return true;

        }
        else {
            return false;
        }
    }
    onAllocationOfOnetoOneTrade(allocateSectionElement: AllocateSection, purchaseSelectedRows: ContractsForBulkFunctions[],
        saleSelectedRows: ContractsForBulkFunctions[], allocateSectionModel: AllocateSection[]) {

        allocateSectionElement.sectionId = purchaseSelectedRows[0].sectionId;
        allocateSectionElement.allocatedSectionId = saleSelectedRows[0].sectionId;
        allocateSectionElement.quantity = purchaseSelectedRows[0].quantity;
        allocateSectionElement.shippingType = this.allocationGridsComponent.shippingTypeCtrl.value;
        allocateSectionElement.dataVersionId = null;
        allocateSectionModel.push(allocateSectionElement);
        this.allocateTrade(allocateSectionModel);
    }
    popUpForOnetoOneAllocationForWashout(sectionIds, quantitity) {
        let washoutRequired: boolean
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
                washoutRequired = true;
                this.calculateContractValueForSingleAllocation(sectionIds, quantitity, washoutRequired)
            }
            else {
                washoutRequired = false;
                this.calculateContractValueForSingleAllocation(sectionIds, quantitity, washoutRequired)
            }
        });



    }
}
