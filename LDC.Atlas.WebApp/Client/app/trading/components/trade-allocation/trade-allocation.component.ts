import { Component, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import * as _moment from 'moment';
import { forkJoin, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { conformToMask } from 'text-mask-core';
import { CompanyManagerService } from '../../../core/services/company-manager.service';
import { BaseFormComponent } from '../../../shared/components/base-form-component/base-form-component.component';
import { ConfirmationDialogComponent } from '../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { FABType } from '../../../shared/components/floating-action-button/floating-action-button-type.enum';
import { AtlasNumber } from '../../../shared/entities/atlas-number.entity';
import { FloatingActionButtonActions } from '../../../shared/entities/floating-action-buttons-actions.entity';
import { LockFunctionalContext } from '../../../shared/entities/lock-functional-context.entity';
import { MasterDataProps } from '../../../shared/entities/masterdata-props.entity';
import { MasterData } from '../../../shared/entities/masterdata.entity';
import { SectionTraffic } from '../../../shared/entities/section-traffic.entity';
import { Section } from '../../../shared/entities/section.entity';
import { AllocationType } from '../../../shared/enums/allocation-type.enum';
import { DiscountBasis } from '../../../shared/enums/discount-basis.enum';
import { DiscountTypes } from '../../../shared/enums/discount-type.enum';
import { PricingMethods } from '../../../shared/enums/pricing-method.enum';
import { SplitType } from '../../../shared/enums/split-type.enum';
import { AllocateSectionCommand } from '../../../shared/services/execution/dtos/allocate-section-command';
import { FormConfigurationProviderService } from '../../../shared/services/form-configuration-provider.service';
import { ExecutionService } from '../../../shared/services/http-services/execution.service';
import { LockService } from '../../../shared/services/http-services/lock.service';
import { TradingService } from '../../../shared/services/http-services/trading.service';
import { SnackbarService } from '../../../shared/services/snackbar.service';
import { TrancheSplitCreationResult } from '../../../shared/services/trading/dtos/section';
import { AllocationMessage } from '../../entities/allocation-message';
import { TradeActionsService } from '../../services/trade-actions.service';
import { AuthorizationService } from './../../../core/services/authorization.service';
import { AccountingSetup } from './../../../shared/entities/accounting-setup.entity';
import { Freeze } from './../../../shared/entities/freeze.entity';
import { ContractStatus } from './../../../shared/enums/contract-status.enum';
import { PermissionLevels } from './../../../shared/enums/permission-level.enum';
import { CustomNumberMask } from './../../../shared/numberMask';
import { FreezeService } from './../../../shared/services/http-services/freeze.service';
import { PreaccountingService } from './../../../shared/services/http-services/preaccounting.service';
import { SplitCreateAndAllocateService } from './../../../shared/services/split-create-and-allocate.service';
import { TitleService } from './../../../shared/services/title.service';
import { SectionReference } from './../../entities/section-reference';
import { AllocationTableFormComponent } from './allocation-form-components/allocation-table-form-component/allocation-table-form-component.component';
import { HeaderAllocationFormComponent } from './allocation-form-components/header-allocation-form-component/header-allocation-form-component.component';
import { ShippingAllocationFormComponent } from './allocation-form-components/shipping-allocation-form-component/shipping-allocation-form-component.component';
import { WarningAllocationFormComponent } from './allocation-form-components/warning-allocation-form-component/warning-allocation-form-component.component';
import { ContractTypes } from './../../../shared/enums/contract-type.enum';
import { ContractInvoiceType } from './../../../shared/enums/contract-invoice-type.enum';

@Component({
    selector: 'atlas-trade-allocation',
    templateUrl: './trade-allocation.component.html',
    styleUrls: ['./trade-allocation.component.scss'],
})
export class TradeAllocationComponent extends BaseFormComponent implements OnInit, OnDestroy {
    @ViewChild('headerAllocationComponent') headerAllocationComponent: HeaderAllocationFormComponent;
    @ViewChild('warningAllocationComponent') warningAllocationComponent: WarningAllocationFormComponent;
    @ViewChild('shippingAllocationComponent') shippingAllocationComponent: ShippingAllocationFormComponent;
    @ViewChild('allocationDetailsComponent') allocationDetailsComponent: AllocationTableFormComponent;

    formComponents: BaseFormComponent[] = [];
    sectionModel: Section;
    tragetSectionModel: Section;
    private sectionId: number;
    dataVersionId: number;
    company: string;
    sectionTrafficModel: SectionTraffic;
    private allocateSectionSubscription: Subscription;
    allocationFormGroup: FormGroup;
    splitResult: TrancheSplitCreationResult[];
    childFlag: number = 0;
    isDisabled: boolean = true;
    isSave: boolean = false;
    isShippingValid: boolean = false;
    allocationMessage: AllocationMessage[] = [];
    masterData: MasterData = new MasterData();
    listOfMasterData = [
        MasterDataProps.Counterparties,
        MasterDataProps.Commodities,
        MasterDataProps.Currencies,
        MasterDataProps.PriceUnits,
        MasterDataProps.WeightUnits,
    ];
    isTradeAvailableForWashout: boolean = false;
    // FAB
    fabMenuActions: FloatingActionButtonActions[] = [];
    fabTitle: string;
    fabType: FABType;
    isLoaded: boolean = false;

    constructor(
        protected formBuilder: FormBuilder,
        protected companyManager: CompanyManagerService,
        protected router: Router,
        private route: ActivatedRoute,
        private executionService: ExecutionService,
        private snackbarService: SnackbarService,
        protected formConfigurationProvider: FormConfigurationProviderService,
        protected tradingService: TradingService,
        public dialog: MatDialog,
        protected lockService: LockService,
        protected tradeActionsService: TradeActionsService,
        private freezeService: FreezeService,
        private preaccountingService: PreaccountingService,
        private authorizationService: AuthorizationService,
        private splitCreateAndAllocateService: SplitCreateAndAllocateService,
        private titleService: TitleService,
    ) {
        super(formConfigurationProvider);
    }

    ngOnInit() {
        this.masterData = this.route.snapshot.data.masterdata;
        this.titleService.setTitle(this.route.snapshot.data.title);
        this.sectionId = Number(this.route.snapshot.paramMap.get('sectionId'));
        this.dataVersionId = this.route.snapshot.params['dataVersionId'] ? Number(this.route.snapshot.params['dataVersionId']) : null;
        this.company = this.route.snapshot.paramMap.get('company');
        this.allocationFormGroup = this.formBuilder.group({
            shippingGroup: this.shippingAllocationComponent.getFormGroup(),
        });

        if (this.dataVersionId) {
            this.subscriptions.push(forkJoin([
                this.freezeService.getFreezeByDataVersionId(this.dataVersionId).pipe(
                    map((freeze: Freeze) => {
                        return _moment(freeze.freezeDate);
                    }),
                ),
                this.preaccountingService.getAccountingSetupDetails().pipe(
                    map((setup: AccountingSetup) => {
                        return _moment(setup.lastMonthClosed);
                    }),
                )])
                .subscribe((result: [_moment.Moment, _moment.Moment]) => {
                    const freezeDate = result[0];
                    const closedMonthDate = result[1];

                    if (freezeDate.year() < closedMonthDate.year() || (
                        freezeDate.year() === closedMonthDate.year() && freezeDate.month() <= closedMonthDate.month()
                    )) {
                        this.snackbarService.throwErrorSnackBar('You cannot allocate a trade in a freeze that is closed for accounting.');
                        if (this.dataVersionId) {
                            this.tradeActionsService.displaySectionInSnapshotSubject
                                .next(new SectionReference(this.sectionId, this.dataVersionId));
                        } else {
                            this.tradeActionsService.displaySectionSubject.next(this.sectionId);
                        }
                    }
                }));
        }

        this.formComponents.push(
            this.allocationDetailsComponent,
            this.headerAllocationComponent,
            this.warningAllocationComponent,
            this.shippingAllocationComponent,
        );
        this.lockContract();
        this.tradingService.getSection(this.sectionId, PricingMethods.Priced, this.dataVersionId)
            .subscribe((data) => {
                this.sectionModel = data;
                // Adding condition for this.dataVersionId as for a snapshot trade, we can allocate a trade even if it is not approved
                if (this.dataVersionId || this.sectionModel.status === ContractStatus.Approved ||
                    this.authorizationService.getPermissionLevel(
                        this.company, 'Trades', 'Physicals', 'SuperTradeEdition') <= PermissionLevels.None) {
                    this.formComponents.forEach((comp) => {
                        comp.initForm(data, false);
                    });
                } else {
                    if (this.dataVersionId) {
                        this.tradeActionsService.displaySectionInSnapshotSubject
                            .next(new SectionReference(this.sectionId, this.dataVersionId));
                    } else {
                        this.tradeActionsService.displaySectionSubject.next(this.sectionId);
                    }
                }

            });

        this.initFABActions();
        this.isLoaded = true;
    }

    canDeactivate() {
        if ((this.allocationFormGroup.dirty) && this.isSave === false) {
            if (this.shippingAllocationComponent.quantityUpdate === true) {
                return true;
            } else {
                return window.confirm('Leave an unsave form? \nYour changes won\'t be applied!');
            }
        }
        return true;
    }

    @HostListener('window:beforeunload', ['$event']) unloadNotification($event: any) {
        if (this.allocationFormGroup.dirty) {
            $event.returnValue = true;
        }
    }

    lockContract() {
        if (!this.dataVersionId) {
            this.subscriptions.push(this.lockService.lockContract(this.sectionId, LockFunctionalContext.Allocation)
                .subscribe(
                    () => { },
                    (err) => {
                        this.dialog.open(ConfirmationDialogComponent, {
                            data: {
                                title: 'Lock',
                                text: err.error.detail,
                                okButton: 'Got it',
                            },
                        });
                        if (this.dataVersionId) {
                            this.tradeActionsService.displaySectionInSnapshotSubject
                                .next(new SectionReference(this.sectionId, this.dataVersionId));
                        } else {
                            this.tradeActionsService.displaySectionSubject.next(this.sectionId);
                        }
                    }));
        }
    }

    validateWarningMessages(warningMessage: any) {
        if (warningMessage === 'ClearFilter' || warningMessage === 'ClearTradeSelection') {
            this.resetAllocation();
        } else if (warningMessage) {
            this.warningAllocationComponent.resetAllDescriptionComponents();
            if (warningMessage.length > 0) {

                const isValidTrade = this.warningAllocationComponent.validateWarningMessages(warningMessage);
                this.isDisabled = !isValidTrade;
            } else {
                this.isDisabled = false;
                this.warningAllocationComponent.showAllowWarningMessages();
            }
        }
        this.initFABActions();
    }

    disableAllocateButton(disable: boolean) {
        this.isDisabled = disable;
    }

    restrictionRemoveClick(removeRestrictClick: boolean) {
        if (removeRestrictClick) {
            this.allocationDetailsComponent.resetAllocationgrid();
            this.resetAllocation();
        }
    }

    resetAllocation() {
        this.warningAllocationComponent.resetAllDescriptionComponents();
        this.isDisabled = true;
    }

    onTradeAllocateButtonClicked() {
        this.isSave = true;
        if (this.allocationFormGroup.valid) {
            const allocationDetails = this.getAllocationDetails() as AllocateSectionCommand;
            if (this.isTradeAvailableForWashout) {
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
   
    updateSplitDetails(allocationDetails: AllocateSectionCommand) {
        const sectionIds: number[] = [];
        const contractedValues: string[] = [];
        switch (allocationDetails.splitType) {
            case SplitType.SourceSplit:
                sectionIds.push(allocationDetails.sectionId);
                contractedValues.push(this.setContractValue(this.sectionModel, allocationDetails.quantity, false));
                this.createSplitAndAllocate(sectionIds, allocationDetails, contractedValues);
                break;
            case SplitType.TargetSplit:
                contractedValues.push(this.setContractValue(this.tragetSectionModel, allocationDetails.quantity, false));
                sectionIds.push(allocationDetails.allocatedSectionId);
                this.createSplitAndAllocate(sectionIds, allocationDetails, contractedValues);
                break;
            case SplitType.Both:
                contractedValues.push(this.setContractValue(this.sectionModel, allocationDetails.quantity, false));
                contractedValues.push(this.setContractValue(this.tragetSectionModel, allocationDetails.quantity, false));
                sectionIds.push(allocationDetails.sectionId);
                sectionIds.push(allocationDetails.allocatedSectionId);
                this.createSplitAndAllocate(sectionIds, allocationDetails, contractedValues);
                break;
            case SplitType.None:
                this.allocateTrade(allocationDetails);
        }
    }
    
    createSplitAndAllocate(sectionIds: number[], allocationDetails: AllocateSectionCommand, contractedValues: string[]) {
        this.allocateSectionSubscription = this.tradingService
            .createSplitForContract(sectionIds, allocationDetails.quantity, null, contractedValues)
            .subscribe(
                (data) => {
                    this.splitResult = data as TrancheSplitCreationResult[];
                    const sectionId = sectionIds[0];
                    const splitResult = this.splitResult[0];
                    if (splitResult) {
                        if (allocationDetails.splitType === SplitType.SourceSplit) {
                            allocationDetails.sectionId = splitResult.sectionId;
                            allocationDetails.sectionReference = splitResult.contractLabel;

                        } else if (allocationDetails.splitType === SplitType.TargetSplit) {
                            allocationDetails.allocatedSectionId = splitResult.sectionId;
                            allocationDetails.allocatedSectionReference = splitResult.contractLabel;

                        } else if (this.splitResult.length > 1) {
                            allocationDetails.sectionId = splitResult.sectionId;
                            allocationDetails.allocatedSectionId = this.splitResult[1].sectionId;
                            allocationDetails.sectionReference = splitResult.contractLabel;
                            allocationDetails.allocatedSectionReference = this.splitResult[1].contractLabel;
                        }
                    }
                    this.allocateTrade(allocationDetails, true);
                },
                (err) => {
                    this.isSave = false;
                    throw err;
                },
            );
    }
    
    allocateTrade(allocationDetails: AllocateSectionCommand, status: boolean = false) {

        this.allocateSectionSubscription = this.executionService
            .allocate(allocationDetails)
            .subscribe(
                (data) => {
                    this.assignCharter(allocationDetails);
                    const message = 'The trade' + ' ' + allocationDetails.sectionReference + ' ' +
                        ' has been properly allocated to ' + ' ' +
                        allocationDetails.allocatedSectionReference + ' ' + ' with the number ' + ' ' + data;
                    this.isSave = false;
                    this.snackbarService.informationAndCopySnackBar(message, message);

                    if (this.dataVersionId) {
                        this.tradeActionsService.displaySectionInSnapshotSubject
                            .next(new SectionReference(allocationDetails.sectionId, this.dataVersionId));
                    } else {
                        this.tradeActionsService.displaySectionSubject.next(allocationDetails.sectionId);
                    }
                },
                (err) => {
                    this.isSave = false;
                    throw err;
                },
            );
    }

    getAllocationDetails() {
        let allocationDetails = new AllocateSectionCommand();
        allocationDetails.sectionId = this.sectionId;
        this.formComponents.forEach((comp) => {
            allocationDetails = comp.populateEntity(allocationDetails);
        });
        allocationDetails.dataVersionId = this.dataVersionId;
        return allocationDetails;
    }

    ngOnDestroy(): void {
        if (this.allocateSectionSubscription) {
            this.allocateSectionSubscription.unsubscribe();
        }
    }

    contractRowSelected(quantityData: string[]) {
        this.shippingAllocationComponent.contractRowSelected(quantityData);
    }

    assignCharterToAllocatedContract(sectionId: number, charterId: number) {
        const assignCharterPromise = [];
        this.executionService.GetSectionTrafficDetails(sectionId, this.dataVersionId)
            .subscribe((data: SectionTraffic) => {
                if (data) {
                    this.sectionTrafficModel = data;
                    this.sectionModel.sectionId = sectionId;
                    const sectionTrafficList: SectionTraffic[] = [];
                    sectionTrafficList.push(this.sectionTrafficModel);
                    if (!this.dataVersionId) {
                        assignCharterPromise.push(
                            this.executionService.assignSectionsToCharter(
                                charterId, sectionTrafficList).toPromise());
                    }
                }
            });
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
    assignCharterToParentContract(sectionIdAllocated: number, sectionIdParent: number) {
        this.tradingService.getSection(sectionIdAllocated, 0, this.dataVersionId)
            .subscribe((data: Section) => {
                if (data && data.charterId) {
                    this.assignCharterToAllocatedContract(sectionIdParent, data.charterId);
                }
            });
    }
    onTradeDiscardButtonClicked() {
        if (this.dataVersionId) {
            this.tradeActionsService.displaySectionInSnapshotSubject
                .next(new SectionReference(this.sectionId, this.dataVersionId));
        } else {
            this.tradeActionsService.displaySectionSubject.next(this.sectionId);
        }
    }
    assignCharter(allocationDetails: AllocateSectionCommand) {
        this.tradingService.getSection(allocationDetails.sectionId, 0, this.dataVersionId)
            .subscribe((data: Section) => {
                if (data && data.charterId) {
                    this.assignCharterToAllocatedContract(allocationDetails.allocatedSectionId, data.charterId);
                } else {
                    this.assignCharterToParentContract(allocationDetails.allocatedSectionId, allocationDetails.sectionId);
                }
            });

    }

    disableAllocationButton(value) {
        this.isShippingValid = (value) ? true : false;
    }

    counterpartyForContractRowSelected(allocatedCouterparty: string[]) {
        if (this.sectionModel.contractType === ContractTypes.Purchase) {
            if (this.sectionModel.sellerCode === allocatedCouterparty[0] && this.sectionModel.currencyCode === allocatedCouterparty[1]) {
                this.isTradeAvailableForWashout = true;
            }
            else {
                this.isTradeAvailableForWashout = false;
            }
        }
        if (this.sectionModel.contractType === ContractTypes.Sale) {
            if (this.sectionModel.buyerCode === allocatedCouterparty[0] && this.sectionModel.currencyCode === allocatedCouterparty[1]) {
                this.isTradeAvailableForWashout = true;
            }
            else {
                this.isTradeAvailableForWashout = false;
            }
        }

    }

    onAllocation(allocationDetails: AllocateSectionCommand) {
        if ((allocationDetails.quantity === allocationDetails.sourceQuantity) &&
            (allocationDetails.quantity === allocationDetails.targetQuantity)) {
            this.allocateTrade(allocationDetails);
        } else if (this.dataVersionId) {
            this.snackbarService.throwErrorSnackBar('In a snapshot, you can only allocate the full quantity of both trades');
        } else {
            if ((allocationDetails.allocationSourceType !== AllocationType.SplitWhereNecessary) &&
                (allocationDetails.allocationTargetType !== AllocationType.SplitWhereNecessary)) {
                this.allocateTrade(allocationDetails);
            } else {

                if ((allocationDetails.sourceQuantity > allocationDetails.quantity) &&
                    (allocationDetails.allocationTargetType === AllocationType.AdjustWhereNecessary ||
                        allocationDetails.targetQuantity === allocationDetails.quantity) &&
                    (allocationDetails.allocationSourceType === AllocationType.SplitWhereNecessary)) {
                    allocationDetails.splitType = SplitType.SourceSplit;
                } else if ((allocationDetails.allocationTargetType === AllocationType.SplitWhereNecessary) &&
                    (allocationDetails.targetQuantity > allocationDetails.quantity) &&
                    (allocationDetails.allocationSourceType === AllocationType.AdjustWhereNecessary ||
                        allocationDetails.sourceQuantity === allocationDetails.quantity)) {
                    allocationDetails.splitType = SplitType.TargetSplit;
                } else if ((allocationDetails.sourceQuantity > allocationDetails.quantity) &&
                    (allocationDetails.targetQuantity > allocationDetails.quantity) &&
                    (allocationDetails.allocationSourceType === AllocationType.SplitWhereNecessary) &&
                    (allocationDetails.allocationTargetType === AllocationType.SplitWhereNecessary)) {
                    allocationDetails.splitType = SplitType.Both;
                } else {
                    allocationDetails.splitType = SplitType.None;
                }
                this.tradingService.getSection(
                    allocationDetails.allocatedSectionId,
                    PricingMethods.Priced, this.dataVersionId)
                    .subscribe(
                        (data) => {
                            this.tragetSectionModel = data;
                            this.updateSplitDetails(allocationDetails);
                        },
                        (err) => {
                            this.isSave = false;
                            throw err;
                        });

            }
        }
    }
    // For FAB
    initFABActions() {
        this.fabMenuActions = [];
        this.fabTitle = 'Allocation FAB Mini';
        this.fabType = FABType.MiniFAB;
        const actionDiscard: FloatingActionButtonActions = {
            icon: 'keyboard_backspace',
            text: 'Discard',
            action: 'discardClick',
            disabled: false,
            index: 1,
        };
        const actionAllocate: FloatingActionButtonActions = {
            icon: 'swap_vert',
            text: 'Allocate',
            action: 'allocateClick',
            disabled: false,
            index: 0,
        };

        this.fabMenuActions.push(actionDiscard);

        actionAllocate.disabled = (this.isDisabled || this.isSave || this.isShippingValid);
        this.fabMenuActions.push(actionAllocate);
    }

    onFabActionClicked(action: string) {
        switch (action) {
            case 'allocateClick': {
                this.onTradeAllocateButtonClicked();
                break;
            }
            case 'discardClick': {
                this.onTradeDiscardButtonClicked();
                break;
            }
        }
    }

}
