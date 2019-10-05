import { Location } from '@angular/common';
import { ChangeDetectorRef, Component, HostListener, Inject, Input, OnDestroy, OnInit, Optional, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MAT_DATE_LOCALE } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import * as _moment from 'moment';
import { forkJoin, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { conformToMask } from 'text-mask-core';
import { AuthorizationService } from '../../../core/services/authorization.service';
import { CompanyManagerService } from '../../../core/services/company-manager.service';
import { BaseFormComponent } from '../../../shared/components/base-form-component/base-form-component.component';
import { ConfirmationDialogComponent } from '../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { FABType } from '../../../shared/components/floating-action-button/floating-action-button-type.enum';
import { AllocateSection } from '../../../shared/entities/allocate-section.entity';
import { Allocation } from '../../../shared/entities/allocation.entity';
import { IntercoField, IntercoValidation } from '../../../shared/entities/interco-validation.entity';
import { InvoiceMarkings } from '../../../shared/entities/invoice-markings.entity';
import { IsLocked } from '../../../shared/entities/is-locked.entity';
import { LockFunctionalContext } from '../../../shared/entities/lock-functional-context.entity';
import { LockResourceInformation } from '../../../shared/entities/lock-resource-information.entity';
import { MasterDataProps } from '../../../shared/entities/masterdata-props.entity';
import { SectionTraffic } from '../../../shared/entities/section-traffic.entity';
import { Section } from '../../../shared/entities/section.entity';
import { AllocateTradeOption } from '../../../shared/enums/allocate-trade-option-enum';
import { CharterStatus } from '../../../shared/enums/charter-status.enum';
import { ContractInvoiceType } from '../../../shared/enums/contract-invoice-type.enum';
import { ContractStatus } from '../../../shared/enums/contract-status.enum';
import { ContractTypes } from '../../../shared/enums/contract-type.enum';
import { CurrentTradeOption } from '../../../shared/enums/current-trade-option-enum';
import { PermissionLevels } from '../../../shared/enums/permission-level.enum';
import { PricingMethods } from '../../../shared/enums/pricing-method.enum';
import { SectionTypes } from '../../../shared/enums/section-type.enum';
import { FormatDatePipe } from '../../../shared/pipes/format-date-pipe.pipe';
import { UserCompanyPrivilegeDto } from '../../../shared/services/authorization/dtos/user-company-privilege';
import { ExecutionService } from '../../../shared/services/http-services/execution.service';
import { LockService } from '../../../shared/services/http-services/lock.service';
import { MasterdataService } from '../../../shared/services/http-services/masterdata.service';
import { TradingService } from '../../../shared/services/http-services/trading.service';
import { SnackbarService } from '../../../shared/services/snackbar.service';
import { TitleService } from '../../../shared/services/title.service';
import { TrancheSplitCreationResult } from '../../../shared/services/trading/dtos/section';
import { BlockerWarningMessageComponent } from '../../dialog-boxes/blocker-warning-message/blocker-warning-message.component';
import { TradeDeallocationDialogComponent } from '../../dialog-boxes/trade-deallocation/trade-deallocation-dialog-component.component';
import { CancelTrade } from '../../entities/cancel-trade.entity';
import { PhysicalFixedPricedContract } from '../../entities/physical-fixed-priced-contract.entity';
import { SectionReference } from '../../entities/section-reference';
import { SectionTabIndex } from '../../entities/section-tab-index';
import { TradeImage } from '../../entities/trade-image.entity';
import { TradeActionsService } from '../../services/trade-actions.service';
import { TradeDataService } from '../../services/trade-data.service';
import { SaveAsFavouriteDialogComponent } from '../contract-physical-capture/save-as-favourite-dialog/save-as-favourite-dialog.component';
import { TradeImageDialogComponent } from '../contract-physical-capture/trade-image-dialog/trade-image-dialog.component';
import { ChildSectionsSearchResult } from './../../../shared/dtos/chilesection-search-result';
import { InvoiceMarkingSearchResult } from './../../../shared/dtos/invoice-marking';
import { AccountingSetup } from './../../../shared/entities/accounting-setup.entity';
import { AtlasNumber } from './../../../shared/entities/atlas-number.entity';
import { Company } from './../../../shared/entities/company.entity';
import { FloatingActionButtonActions } from './../../../shared/entities/floating-action-buttons-actions.entity';
import { Freeze } from './../../../shared/entities/freeze.entity';
import { InvoiceLineRecord } from './../../../shared/entities/invoice-line-record.entity';
import { MasterData } from './../../../shared/entities/masterdata.entity';
import { Vessel } from './../../../shared/entities/vessel.entity';
import { CostDirections } from './../../../shared/enums/cost-direction.enum';
import { DiscountBasis } from './../../../shared/enums/discount-basis.enum';
import { DiscountTypes } from './../../../shared/enums/discount-type.enum';
import { InvoiceTypes } from './../../../shared/enums/invoice-type.enum';
import { InvoicingStatus } from './../../../shared/enums/invoicing-status.enum';
import { PostingStatus } from './../../../shared/enums/posting-status.enum';
import { QuantityToInvoiceType } from './../../../shared/enums/quantity-to-invoice.enum';
import { ShippingType } from './../../../shared/enums/shipping-type-enum';
import { TransactionDocumentTypes } from './../../../shared/enums/transaction-document-type.enum';
import { CustomNumberMask } from './../../../shared/numberMask';
import { ApiPaginatedCollection } from './../../../shared/services/common/models';
import { ChildSectionsToSplit } from './../../../shared/services/execution/dtos/child-sections-to-split';
import { InvoiceRecord } from './../../../shared/services/execution/dtos/invoice-record';
import { DocumentService } from './../../../shared/services/http-services/document.service';
import { FreezeService } from './../../../shared/services/http-services/freeze.service';
import { PreaccountingService } from './../../../shared/services/http-services/preaccounting.service';
import { SplitCreateAndAllocateService } from './../../../shared/services/split-create-and-allocate.service';
import { TradeImageField } from './../../../shared/services/trading/dtos/tradeImageField';
import { nameof, UtilService } from './../../../shared/services/util.service';
import { CancelTradeDialogComponent } from './cancel-trade-dialog/cancel-trade-dialog.component';
import { CostListDisplayView } from './costs-tab/costs-ag-grid-row';
import { PhysicalContractCaptureFormCostsTabComponent } from './costs-tab/physical-contract-capture-form-costs-tab.component';
import { HeaderFormComponent } from './form-components/header-form-component/header-form-component.component';
import { IntercoTradeDialogComponent } from './interco-trade-dialog/interco-trade-dialog.component';
import { PhysicalContractCaptureFormInvoiceMarkingTabComponent } from './invoice-marking-tab/physical-contract-capture-form-invoice-marking-tab.component';
import { PhysicalContractCaptureFormMainTabComponent } from './main-tab/physical-contract-capture-form-main-tab.component';
import { NewTrancheSplitAgGridComponent } from './section-tab/new-tranche-split-ag-grid/new-tranche-split-ag-grid.component';
import { NewTrancheSplitFooterComponent } from './section-tab/new-tranche-split-footer/new-tranche-split-footer.component';
import { NewTrancheSplitHeaderComponent } from './section-tab/new-tranche-split-header/new-tranche-split-header.component';
import { PhysicalContractCaptureFormSectionTabComponent } from './section-tab/physical-contract-capture-form-section-tab.component';
import { PhysicalContractCaptureFormStatusTabComponent } from './status-tab/physical-contract-capture-form-status-tab.component';
import { TradeManagementMenuBarComponent } from './trade-management-menu-bar/trade-management-menu-bar.component';
import { PhysicalContractCaptureFormTrafficTabComponent } from './traffic-tab/physical-contract-capture-form-traffic-tab.component';

const moment = _moment;
@Component({
    selector: 'atlas-trade-capture-page',
    templateUrl: './trade-capture-page.component.html',
    styleUrls: ['./trade-capture-page.component.scss'],
    providers: [TradeDataService],
})
export class TradeCapturePageComponent implements OnInit, OnDestroy {
    @ViewChild('headerComponent') headerComponent: HeaderFormComponent;
    @ViewChild('tradeManagementMenuBarComponent') tradeManagementMenuBarComponent: TradeManagementMenuBarComponent;
    @ViewChild('invoiceMarkingTabComponent') invoiceMarkingTabComponent: PhysicalContractCaptureFormInvoiceMarkingTabComponent;
    @ViewChild('mainTabComponent') mainTabComponent: PhysicalContractCaptureFormMainTabComponent;
    @ViewChild('trafficTabComponent') trafficTabComponent: PhysicalContractCaptureFormTrafficTabComponent;
    @ViewChild('statusTabComponent') statusTabComponent: PhysicalContractCaptureFormStatusTabComponent;
    @ViewChild('sectionTabComponent') sectionTabComponent: PhysicalContractCaptureFormSectionTabComponent;
    @ViewChild('newTrancheSplitHeaderComponent') newTrancheSplitHeaderComponent: NewTrancheSplitHeaderComponent;
    @ViewChild('newTrancheSplitAgGridComponent') newTrancheSplitAgGridComponent: NewTrancheSplitAgGridComponent;
    @ViewChild('newTrancheSplitFooterComponent') newTrancheSplitFooterComponent: NewTrancheSplitFooterComponent;
    @ViewChild('costsTabComponent') costsTabComponent: PhysicalContractCaptureFormCostsTabComponent;
    private contractId: number;
    public contractLabel: string;
    private formComponents: BaseFormComponent[] = [];
    private model: PhysicalFixedPricedContract;
    private tradeImageModel: PhysicalFixedPricedContract;
    private sectionTrafficModel: SectionTraffic;
    private invoiceMarking: InvoiceMarkings[] = [];
    private invoiceStatusId: number;
    public sectionId: number;
    public selectedTab: number = 0;
    public tabValue: string;
    public isDiscard = true;
    subscriptions: Subscription[] = [];
    sideNavOpened: boolean;
    masterdata: MasterData;
    sideNavScreen: number;
    sectionModel: Section;
    tragetSectionModel: Section;
    childSectionsSearchResult: ChildSectionsSearchResult[];
    private allocateSectionSubscription: Subscription;
    allocationModel: Allocation;
    captureFormGroup: FormGroup;
    saveInProgress = false;
    isShow: boolean = false;
    isEdit = false;
    isTradeImage = false;
    isLoading = true;
    onValidationState = false;
    offsetLeft: number;
    originalQuantity: number;
    trafficTabQuantity: number;
    quantityTrafficSplit: number;
    contractRefs = new Array();
    isApprovalBannerDisplayed: boolean = false;
    blockCommodityMessage: boolean = false;
    warnCommodityMessage: boolean = false;
    isChangedPortOfOrigin = false;
    isChangedPortOfDestination = false;
    isChangedPositionType = false;
    portOfOriginColumnName;
    portOfDestinationColumnName;
    positionTypeColumnName;
    CommodityPart1Name;
    CommodityPart2Name;
    CommodityPart3Name;
    CommodityPart4Name;
    CommodityPart5Name;
    dataVersionId: number;
    editAllowed: boolean = true;
    resourcesInformation: LockResourceInformation[] = new Array<
        LockResourceInformation
        >();
    company: string;
    isSave: boolean = false;
    childFlag: number = 0;
    childQuantity: number = 0;
    copyCostInChild = false;
    totalInvoiceValuePercent: number = 0;
    isZeroCostRow: boolean;
    isFirstApproval: boolean = false;
    isMenuBarVisible: boolean = true;
    isWeightConvertedForSplit: boolean = false;
    isimageAllocate: boolean = false;
    imageAllocateModel: PhysicalFixedPricedContract;
    isEditOnAllocate: boolean = false;
    // REFACTO : isInterco IS ALSO IN MODEL. NO NEED TO DUPLICATE INFORMATION
    isInterco: boolean = false;
    isValidIntercoCounterparty: boolean = false;
    childQuantityConsumed: number;
    counterpartyCompaniesForManaulInterco: Company[];
    tradeQuantity: number;
    intercoValidation: IntercoValidation;
    sectionToClose = new Array();
    intercoCounterParty: string;
    @Input() isClosed: boolean = undefined;
    isSectionCancelled: boolean = false;
    totalInvoicePercent: number;
    quantityToBeCompared: number = 0;
    costWithInvoice: CostListDisplayView;
    tradeCanBeApproved: boolean = true;
    tradeImageDetails: TradeImageField[];

    // -- FAB Management
    createTradeActionPrivilege: UserCompanyPrivilegeDto = {
        profileId: null,
        privilegeName: 'CreateTrade',
        permission: PermissionLevels.ReadWrite,
        privilegeParentLevelOne: 'Trades',
        privilegeParentLevelTwo: 'Physicals',
    };

    editTradeActionPrivilege: UserCompanyPrivilegeDto = {
        profileId: null,
        privilegeName: 'Physicals',
        permission: PermissionLevels.ReadWrite,
        privilegeParentLevelOne: 'Trades',
        privilegeParentLevelTwo: null,
    };

    fabMenuActions: FloatingActionButtonActions[] = [];
    fabTitle: string;
    fabType: FABType;
    isSaveActionDisabled =
        this.saveInProgress || (this.isShow && !this.isEdit && !this.isTradeImage);
    isSplitSaveDisabled: boolean = false;

    constructor(
        private executionService: ExecutionService,
        private cdr: ChangeDetectorRef,
        private route: ActivatedRoute,
        protected formBuilder: FormBuilder,
        protected snackbarService: SnackbarService,
        protected tradingService: TradingService,
        protected companyManager: CompanyManagerService,
        protected router: Router,
        protected tradeActionsService: TradeActionsService,
        public dialog: MatDialog,
        protected utilService: UtilService,
        private location: Location,
        protected lockService: LockService,
        protected freezeService: FreezeService,
        protected preaccountingService: PreaccountingService,
        private formatDate: FormatDatePipe,
        private titleService: TitleService,
        private splitCreateAndAllocateService: SplitCreateAndAllocateService,
        private tradeDataService: TradeDataService,
        private documentService: DocumentService,
        private authorizationService: AuthorizationService,
        private masterDataService: MasterdataService,
        @Optional() @Inject(MAT_DATE_LOCALE) private dateLocale?: string,
    ) { }

    ngOnInit() {
        // trade actions subscriptions
        this.company = this.route.snapshot.paramMap.get('company');
        this.masterdata = this.route.snapshot.data.masterdata;

        this.subscriptions.push(
            this.tradeActionsService.deallocateSectionSubject.subscribe(() => {
                this.onDeallocateTradeButtonClicked();
            }),
            this.tradeActionsService.approveSectionSubject.subscribe(() => {
                this.onApproveSectionButtonClicked();
            }),
            this.tradeActionsService.unApproveSectionSubject.subscribe(() => {
                this.onUnApproveSectionButtonClicked();
            }),

            this.tradeActionsService.tradeImageSubject.subscribe(() => {
                this.onImageButtonClicked();
            }),

            this.tradeActionsService.tradeSaveAsFavouriteSubject.subscribe(() => {
                this.onSaveAsFavoriteClicked();
            }),
            this.tradeActionsService.deleteSectionSubject.subscribe(() => {
                this.onDeleteSectionButtonClicked();
            }),
            this.tradeActionsService.reOpenSectionSubject.subscribe(() => {
                this.onReopenSectionButtonClicked();
            }),
            this.tradeActionsService.closeSectionSubject.subscribe(() => {
                this.onCloseSectionButtonClicked(null, null, false, null);
            }),
            this.tradeActionsService.cancelSectionSubject.subscribe(() => {
                this.onCancelTradeButtonClicked();
            }),
            this.tradeActionsService.reverseCancelSectionSubject.subscribe(() => {
                this.onReverseCancelTradeButtonClicked();
            }),
        );

        this.captureFormGroup = this.formBuilder.group({
            headerGroup: this.headerComponent.getFormGroup(),
            mainTabComponent: this.mainTabComponent.getFormGroup(),
            invoiceMarkingTabComponent: this.invoiceMarkingTabComponent.getFormGroup(),
            statusTabComponent: this.statusTabComponent.getFormGroup(),
            sectionTabComponent: this.sectionTabComponent.getFormGroup(),
            trafficTabComponent: this.trafficTabComponent.getFormGroup(),
            newTrancheHeaderComponent: this.sectionTabComponent.getFormGroup(),
            newTrancheAgGridComponent: this.sectionTabComponent.getFormGroup(),
            newTrancheFooterComponent: this.sectionTabComponent.getFormGroup(),
            costsTabComponent: this.costsTabComponent.getFormGroup(),
        });

        this.formComponents.push(
            this.headerComponent,
            this.mainTabComponent,
            this.sectionTabComponent,
            this.statusTabComponent,
            this.trafficTabComponent,
            this.invoiceMarkingTabComponent,
            this.costsTabComponent,
        );
        this.cdr.detectChanges();

        this.sectionId = Number(this.route.snapshot.paramMap.get('sectionId'));
        this.dataVersionId = this.route.snapshot.paramMap.get('dataVersionId')
            ? Number(this.route.snapshot.paramMap.get('dataVersionId'))
            : null;
        this.tradeDataService.setSectionData(this.sectionId, this.dataVersionId);
        if (this.dataVersionId) {
            this.editAllowed = false;
            this.subscriptions.push(
                forkJoin([
                    this.freezeService.getFreezeByDataVersionId(this.dataVersionId).pipe(
                        map((freeze: Freeze) => {
                            return moment(freeze.freezeDate);
                        }),
                    ),
                    this.preaccountingService.getAccountingSetupDetails().pipe(
                        map((setup: AccountingSetup) => {
                            return moment(setup.lastMonthClosed);
                        }),
                    ),
                ]).subscribe((result: [_moment.Moment, _moment.Moment]) => {
                    const freezeDate = result[0];
                    const closedMonthDate = result[1];
                    this.editAllowed =
                        freezeDate.year() > closedMonthDate.year() ||
                        (freezeDate.year() === closedMonthDate.year() &&
                            freezeDate.month() > closedMonthDate.month());
                }),
            );
        }
        this.getTradeFavoriteDetails();

        if (this.sectionId !== 0) {
            this.viewEditTrade();
        } else {
            this.initFABActions(); // This method !! cannot !! be called anywhere; please cherche for comment A001
            this.isLoading = false;
            this.isMenuBarVisible = true;
            this.titleService.setTitle('Trade Capture');
        }
    }

    onShipmentStatusUpdate(shippingStatus: string) {
        if (shippingStatus === 'Cancelled') {
            this.statusTabComponent.charterComponent.updateOnlyShippingState();
        }
    }

    getTradeFavoriteDetails() {
        const favoriteId = Number(this.route.snapshot.queryParams.favoriteId);
        if (favoriteId) {
            this.subscriptions.push(
                this.tradingService
                    .getTradeFavoriteById(favoriteId)
                    .subscribe((data: Section) => {
                        const favouriteData = data;
                        this.contractTypeSelected(favouriteData.contractType);
                        this.formComponents.forEach((comp) => {
                            comp.initForm(favouriteData, true);
                        });
                    }),
            );
        }
    }

    canDeactivate() {
        if (this.isSave === false) {
            if (
                this.captureFormGroup.dirty ||
                this.isTradeImage ||
                this.invoiceMarkingTabComponent.invoiceViewModeComponent
                    .viewDocumentTypeCtrl.dirty
            ) {
                return window.confirm(
                    'Leave an unsave form? \nYour changes won\'t be applied!',
                );
            }
            this.costsTabComponent.gridApi.forEachNode((rowData) => {
                if (rowData.data && rowData.data.isDirty) {
                    return window.confirm(
                        'Leave an unsave form? \nYour changes won\'t be applied!',
                    );
                }
            });
            this.trafficTabComponent.formComponents.forEach((comp) => {
                if (comp.formGroup && comp.formGroup.dirty) {
                    return window.confirm(
                        'Leave an unsave form? \nYour changes won\'t be applied!',
                    );
                }
            });
        }
        return true;
    }

    @HostListener('window:beforeunload', ['$event']) unloadNotification(
        $event: any,
    ) {
        if (
            this.captureFormGroup.dirty ||
            this.isTradeImage ||
            this.invoiceMarkingTabComponent.invoiceViewModeComponent
                .viewDocumentTypeCtrl.dirty
        ) {
            $event.returnValue = true;
        }
        this.costsTabComponent.gridApi.forEachNode((rowData) => {
            if (rowData.data && rowData.data.isDirty) {
                $event.returnValue = true;
            }
        });
        this.trafficTabComponent.formComponents.forEach((comp) => {
            if (comp.formGroup && comp.formGroup.dirty) {
                $event.returnValue = true;
            }
        });
    }

    viewEditTrade() {
        if (this.route.snapshot.data.isEdit) {
            this.isEdit = true;
            this.isMenuBarVisible = true;
            this.startLockRefresh();
            this.tabValue = this.route.snapshot.paramMap.get('tabIndex');
            if (this.tabValue) {
                this.selectedTab = Number(this.tabValue);
            }
        } else if (this.route.snapshot.data['isImage'] === true) {
            const allocateContract = JSON.parse(
                this.route.snapshot.queryParams.allocateContract,
            );
            this.isimageAllocate = allocateContract;
            this.isEdit = true;
            this.isTradeImage = true;
            this.stopLockRefresh();
        }
        if (this.isEdit && !this.isTradeImage) {
            this.isMenuBarVisible = false;
            this.subscriptions.push(
                this.lockService
                    .lockContract(this.sectionId, LockFunctionalContext.TradeEdit)
                    .subscribe(
                        (data) => {
                            this.loadTradeData();
                        },
                        (err) => {
                            const confirmDialog = this.dialog.open(
                                ConfirmationDialogComponent,
                                {
                                    data: {
                                        title: 'Lock',
                                        text: err.error.detail,
                                        okButton: 'Got it',
                                    },
                                },
                            );
                            this.tradeActionsService.displaySectionAfterEditSubject.next(
                                new SectionTabIndex(this.sectionId, this.selectedTab),
                            );
                        },
                    ),
            );
        } else {
            this.isMenuBarVisible = false;
            if (this.isTradeImage) {
                this.tradingService.getTradeImageFieldsByCompany()
                    .subscribe((data) => {
                        this.tradeImageDetails = data.value;
                        this.mainTabComponent.setTradeImageDetails(this.tradeImageDetails);
                        this.headerComponent.tradeImageDetails = this.tradeImageDetails;
                        this.loadTradeData();
                    });
            } else {
                this.loadTradeData();
            }
        }
    }

    updateTrafficTabQuantity(quantity: number) {
        this.tradeQuantity = quantity;
        this.trafficTabComponent.adjustWeightComponent.updateQuantityValue(
            quantity,
        );
        this.setContractAmountToCostTab(quantity);
    }

    // REFACTO : Should be in COST TAB
    setContractAmountToCostTab(quantity: number) {
        this.costsTabComponent.zeroQuantity = true;
        this.costsTabComponent.contractAmountOnSelect = quantity;
        if (this.isEdit) {
            if (this.sectionModel.costs) {
                const costFilteredByAmount = this.sectionModel.costs.filter(
                    (cost) =>
                        cost.rateTypeId === 1 &&
                        cost.invoicePercent === 0 &&
                        !(cost.rate === 0),
                );
                if (
                    Number(quantity) === 0 &&
                    this.sectionModel.costs.length > 0 &&
                    costFilteredByAmount.length > 0 &&
                    this.isEdit &&
                    this.costsTabComponent.zeroQuantity
                ) {
                    const confirmDialog = this.dialog.open(ConfirmationDialogComponent, {
                        data: {
                            title: 'Update Cost',
                            text: 'Do you want to update the estimates for Amount as well  ?',
                            okButton: 'Yes',
                            cancelButton: 'No',
                        },
                    });

                    confirmDialog.afterClosed().subscribe((answer) => {
                        if (answer) {
                            costFilteredByAmount.forEach((cost) => {
                                cost.rate = quantity;
                            });
                            this.costsTabComponent.gridApi.forEachNode((rowNode) => {
                                if (
                                    rowNode.data.rateTypeCode === 'Amount' &&
                                    !(rowNode.data.invoicePercent === 100)
                                ) {
                                    const data = rowNode.data;
                                    data.rate = quantity;
                                }
                            });
                        } else {
                            this.mainTabComponent.quantityComponent.quantityCtrl.patchValue(
                                null,
                            );
                        }
                    });
                } else {
                    this.costsTabComponent.gridApi.refreshCells();
                }
            }
        }
    }

    // Should be in main TAB
    commodityBlockOrWarnMessage(block: any) {
        this.blockCommodityMessage = block.isCommodityBlockerChanged;
        this.warnCommodityMessage = block.isCommodityWarningChanged;
        this.CommodityPart1Name = block.isChangedCmyPart1;
        this.CommodityPart2Name = block.isChangedCmyPart2;
        this.CommodityPart3Name = block.isChangedCmyPart3;
        this.CommodityPart4Name = block.isChangedCmyPart4;
        this.CommodityPart5Name = block.isChangedCmyPart5;
    }

    portWarningMessage(portWarn: any) {
        this.isChangedPortOfOrigin = portWarn.portOfOriginChanged;
        this.isChangedPortOfDestination = portWarn.portOfDestinationChanged;
        this.portOfOriginColumnName = portWarn.portOfOriginColumn;
        this.portOfDestinationColumnName = portWarn.portOfDestinationColumn;
    }

    shipmentWarningMessage(portWarn: any) {
        this.isChangedPositionType = portWarn.positionTypeChanged;
        this.positionTypeColumnName = portWarn.positionTypeColumnName;
    }

    loadTradeData() {
        this.tabValue = this.route.snapshot.paramMap.get('tabIndex');
        if (this.tabValue) {
            this.selectedTab = Number(this.tabValue);
        }

        const getSection = this.dataVersionId
            ? this.tradingService.getSection(this.sectionId, 0, this.dataVersionId)
            : this.tradingService.getSection(this.sectionId, 0);
        this.subscriptions.push(
            getSection.subscribe((data) => {
                this.sectionModel = data;
                if (this.sectionModel) {
                this.isSectionCancelled = this.sectionModel.isCancelled;
                }
                if (!this.isTradeImage) {
                    if (this.isSectionCancelled && this.route.snapshot.data.isEdit) {
                        this.selectedTab = 1;
                    }
                    if (this.sectionModel.isClosed === true) {
                        this.isClosed = true;
                    }
                } else {
                    this.sectionModel.isCancelled = false;
                    this.sectionModel.isClosed = false;
                    this.sectionModel.blDate = null;
                }
                this.originalQuantity = data.quantity;
                this.quantityTrafficSplit = data.quantity;
                this.contractId = data.contractId;
                this.contractLabel = data.contractLabel;
                if (data.firstApprovalDateTime === null) {
                    this.isFirstApproval = true;
                }
                if (
                    this.sectionModel.allocatedTo &&
                    this.sectionModel.allocatedTo.sectionId
                ) {
                    this.tradingService
                        .getSection(
                            this.sectionModel.allocatedTo.sectionId,
                            PricingMethods.Priced,
                            this.dataVersionId,
                        )
                        .subscribe((targetData) => {
                            this.tragetSectionModel = targetData;
                        });
                }
                // disabling condition for SuperTradeEdition for Cost Invoice
                if (
                    data.invoiceReference &&
                    (data.invoiceTypeId === InvoiceTypes.Cost ||
                        data.invoiceTypeId === InvoiceTypes.CostReceivable ||
                        data.invoiceTypeId === InvoiceTypes.CostCreditNote ||
                        data.invoiceTypeId === InvoiceTypes.CostDebitNote)
                ) {
                    data.invoiceReference = null;
                }

                this.tradingService
                    .getChildSections(this.sectionId, this.dataVersionId)
                    .subscribe((childSections: ChildSectionsSearchResult[]) => {
                        this.childSectionsSearchResult = childSections;
                        this.sectionModel.childSections = childSections.map(
                            (childSectionResult) => {
                                const childSection = new Section();
                                childSection.setSectionFromChildSectionsSearchResult(
                                    childSectionResult,
                                    this.sectionModel.sectionId,
                                );
                                return childSection;
                            },
                        );

                        if (this.isEdit) {
                            this.startLockRefresh();
                        }
                        if (this.isTradeImage) {
                            this.stopLockRefresh();
                            this.titleService.setTitle(this.contractLabel + ' - Imaging');
                        } else if (this.isEdit && !this.isTradeImage) {
                            this.stopLockRefresh();
                            this.titleService.setTitle(this.contractLabel + ' - Edit Trade');
                        } else {
                            this.titleService.setTitle(this.contractLabel + ' - Trade View');
                        }
                        if (this.route.snapshot.queryParams.showTradeImage) {
                            this.openTradeImageDialog();
                        }
                        if (this.route.snapshot.queryParams.showSaveTradeAsFavourite) {
                            this.openSaveAsFavouriteDialog();
                        }
                        this.formComponents.forEach((comp) => {
                            comp.initForm(data, this.isEdit);
                        });
                        this.isShow = true;

                        const selectedCounterparty = this.mainTabComponent
                            .counterpartyComponent.selectedCounterparty;
                        if (selectedCounterparty) {
                            this.companyManager
                                .getConfiguration(selectedCounterparty.counterpartyID)
                                .subscribe((data) => {
                                    if (data.length > 0 && data[0].isCounterpartyGroupAccount) {
                                        this.isValidIntercoCounterparty = true;
                                        this.counterpartyCompaniesForManaulInterco = data;
                                    }
                                });
                        }
                        this.initFABActions(); // This method !! cannot !! be called anywhere; please cherche for comment A001
                        this.isLoading = false;
                    });

                this.contractTypeSelected(this.sectionModel.contractType);
                this.checkIntercoTrade(this.sectionModel);
                this.checkIfTradeCanBeApproved(this.sectionModel);
                this.statusTabComponent.invoicingComponent.setContractInvoiceType(
                    this.sectionModel.contractInvoiceTypeId,
                );
                this.changeDepartmentIfDefault(this.sectionModel);
            }),
        );
    }

    changeDepartmentIfDefault(sectionModel: Section) {
        const currentCompany = this.companyManager.getCurrentCompany();
        this.masterDataService.getMasterData([MasterDataProps.Companies], currentCompany.companyId).subscribe((data: MasterData) => {
            if (data) {
                const currentCompanyDetails = data.companies.find((o) => o.companyId === currentCompany.companyId);
                if (this.isEdit && (sectionModel.departmentId === currentCompanyDetails.defaultDepartmentId)) {
            this.snackbarService.throwErrorSnackBar(
                'Please change the department.',
            );
            return;
        }
    }
        });
    }

    checkIfTradeCanBeApproved(sectionModel: Section) {
        const currentCompany = this.companyManager.getCurrentCompany();
        this.masterDataService.getMasterData([MasterDataProps.Companies], currentCompany.companyId).subscribe((data: MasterData) => {
            if (data) {
                const currentCompanyDetails = data.companies.find((o) => o.companyId === currentCompany.companyId);
                this.tradeCanBeApproved = (currentCompanyDetails.defaultDepartmentId === sectionModel.departmentId) ?
            false : true;
            }
        });
    }

    contractTypeSelected(contractType: ContractTypes) {
        this.mainTabComponent.contractTypeSelected(contractType);
    }

    onSaveButtonClicked() {
        this.save();
    }

    save() {
        this.isSave = true;
        this.onValidationState = true;
        this.utilService.updateFormGroupValidity(this.captureFormGroup);

        if (this.captureFormGroup.pending) {
            this.captureFormGroup.statusChanges.subscribe(() => {
                if (this.onValidationState) {
                    this.onValidationState = false;
                    this.handleSave();
                }
            });
        } else {
            this.onValidationState = false;
            this.handleSave();
        }
    }

    handleSave() {
        if (!this.captureFormGroup.valid) {
            this.snackbarService.throwErrorSnackBar(
                'Form is invalid. Please resolve the errors.',
            );
            return;
        }

        if (!this.costsTabComponent.validate()) {
            this.snackbarService.throwErrorSnackBar(
                'Cost is invalid. Please review the cost tab to resolve the errors.',
            );
            return;
        }

        if (this.isEdit && !this.isTradeImage) {
            let isAnyCurrentToggleSelected: boolean = false;
            let isAnyAllocationCardCheckFailed: boolean = false;

            const local = this.dateLocale || moment.locale();
            // THIS DATE SHOULD BE REFACTORED
            const blDate = this.trafficTabComponent.blInfoComponent.blDateCtrl.value ? moment(this.trafficTabComponent.blInfoComponent.blDateCtrl.value, 'YYYY-MM-DD').toDate() : null;
            const bldate = (blDate) ? moment.utc(moment.parseZone(blDate).format('YYYY-MM-DD')).locale(local).toDate() : null;
            this.trafficTabComponent.blInfoComponent.blDateCtrl.setValue(bldate);

            isAnyCurrentToggleSelected = this.trafficTabComponent.currentTradeComponent.checkAnyToggleSelected();
            isAnyAllocationCardCheckFailed = this.trafficTabComponent.allocationComponent.allocationSelectionChecked();

            if (isAnyCurrentToggleSelected && isAnyAllocationCardCheckFailed) {
                this.snackbarService.throwErrorSnackBar(
                    'Please select an option for the allocated trade.',
                );
                return;
            }
        }

        this.saveInProgress = true;
        this.getPhysicalContractInfo();
        this.checkIfIntercoCounterpartyChanged(this.model);
    }

    saveTrade() {
        // REFACTO : DUPLICATION OF CODE
        if (this.model.allocatedTo && !this.isTradeImage) {
            if (
                (this.warnCommodityMessage ||
                    this.isChangedPortOfDestination ||
                    this.isChangedPortOfOrigin ||
                    this.isChangedPositionType ||
                    this.blockCommodityMessage) &&
                this.model.allocatedTo.sectionId !== this.sectionId
            ) {
                const confirmDialog = this.getWarningPopup();
                const confirmationSubscription = confirmDialog
                    .afterClosed()
                    .subscribe((answer) => {
                        if (!answer) {
                            return;
                        }
                        const blockerMessageAnswer = answer.blockerMessageAnswer;
                        const warningMessageAnswer = answer.warningMessageAnswer;

                        if (warningMessageAnswer === 'discard') {
                            this.saveInProgress = false;
                            this.isShow = false;
                            this.warnCommodityMessage = false;
                            this.isChangedPortOfDestination = false;
                            this.isChangedPortOfOrigin = false;
                            this.isChangedPositionType = false;
                            this.blockCommodityMessage = false;
                            return;
                            //  Go to trade edit page  //
                        } else if (
                            (blockerMessageAnswer === 'no' &&
                                warningMessageAnswer === 'ok') ||
                            (blockerMessageAnswer === 'no' && warningMessageAnswer === null)
                        ) {
                            this.tradeActionsService.displaySectionAfterEditSubject.next(
                                new SectionTabIndex(this.sectionId, this.selectedTab),
                            );
                            //  Go to trade view page  //
                        } else if (warningMessageAnswer === 'yes') {
                            this.callServiceToSave();
                        } else if (
                            blockerMessageAnswer === 'yes' &&
                            (warningMessageAnswer === null || warningMessageAnswer === 'no')
                        ) {
                            //  update Blocker in both contracts  //
                            this.callServiceToSave();
                        } else if (
                            warningMessageAnswer === 'no' &&
                            blockerMessageAnswer === null
                        ) {
                            //  one contract update//
                            this.callServiceToSave();
                        }
                    });
                this.subscriptions.push(confirmationSubscription);
            } else {
                this.callServiceToSave();
            }
        } else if (this.isTradeImage && this.isimageAllocate) {
            this.imageAllocateModel = this.model;
            if (
                this.warnCommodityMessage ||
                this.isChangedPortOfDestination ||
                this.isChangedPortOfOrigin ||
                this.isChangedPositionType ||
                this.blockCommodityMessage
            ) {
                const confirmDialog = this.getWarningPopup();
                const confirmationSubscription = confirmDialog
                    .afterClosed()
                    .subscribe((answer) => {
                        if (!answer) {
                            return;
                        }
                        const blockerMessageAnswer = answer.blockerMessageAnswer;
                        const warningMessageAnswer = answer.warningMessageAnswer;
                        this.imageAllocateModel.sectionId = this.sectionId;
                        if (warningMessageAnswer === 'discard') {
                            this.saveInProgress = false;
                            this.isShow = false;
                            this.warnCommodityMessage = false;
                            this.isChangedPortOfDestination = false;
                            this.isChangedPortOfOrigin = false;
                            this.isChangedPositionType = false;
                            this.blockCommodityMessage = false;
                            return;
                            //  Go to trade edit page  //
                        } else if (
                            (blockerMessageAnswer === 'no' &&
                                warningMessageAnswer === 'ok') ||
                            (blockerMessageAnswer === 'no' && warningMessageAnswer === null)
                        ) {
                            this.model.commodityId = this.sectionModel.commodityId;
                            this.createImageTrade();
                        } else if (warningMessageAnswer === 'yes') {
                            this.isEditOnAllocate = true;
                            this.callServiceToSave();
                        } else if (
                            warningMessageAnswer === 'no' &&
                            blockerMessageAnswer === null
                        ) {
                            //  one contract update
                            this.callServiceToSave();
                        }
                    });
                this.subscriptions.push(confirmationSubscription);
            } else {
                this.callServiceToSave();
            }
        } else {
            this.callServiceToSave();
        }
    }

    getWarningPopup() {
        return this.dialog.open(BlockerWarningMessageComponent, {
            data: {
                messageBlocker: this.blockCommodityMessage
                    ? ' The field ' +
                    [this.CommodityPart1Name, this.CommodityPart2Name].filter((text) => text).join(' ') +
                    ' ' +
                    ' you are changing has to be same within the allocation, do you want to update allocated trade ? '
                    : null,
                messageWarning:
                this.isChangedPortOfOrigin ||
                this.isChangedPositionType ||
                        this.isChangedPortOfDestination ||
                        this.warnCommodityMessage
                        ? ' The following field(s) ' +
                        [this.portOfOriginColumnName, this.portOfDestinationColumnName, this.positionTypeColumnName,
                            this.CommodityPart3Name, this.CommodityPart4Name, this.CommodityPart5Name].filter((text) => text).join(' ') +
                        ' ' +
                        ' will be different between your two allocated contracts. '
                        + 'Do you also want to update the allocated contract?'
                        : null,
                dyanamicMessageWarning:
                    this.isChangedPortOfOrigin ||
                    this.isChangedPositionType ||
                        this.isChangedPortOfDestination ||
                        this.warnCommodityMessage
                        ? ' The field ' +
                        [this.portOfOriginColumnName, this.portOfDestinationColumnName, this.positionTypeColumnName,
                            this.CommodityPart3Name, this.CommodityPart4Name, this.CommodityPart5Name].filter((text) => text).join(' ') +
                        ' ' +
                        ' are warning and would not be updated'
                        : null,
            },
        });
    }

    callServiceToSave() {
        // call the trading service with correct DTO

        // REFACTO : ALL WARNING SHOULD BE AT THE SAME PLACE IN CODE
        if (this.sectionId && !this.isTradeImage) {
            if (Number(this.model.quantity) === 0) {
                const confirmDialog = this.dialog.open(ConfirmationDialogComponent, {
                    data: {
                        text: 'Quantity is 0. Do you want to save?',
                        okButton: 'SAVE ANYWAY',
                        cancelButton: 'CANCEL',
                    },
                });
                const confirmationSubscription = confirmDialog
                    .afterClosed()
                    .subscribe((answer) => {
                        if (answer) {
                            this.updatePhysicalContract();
                        } else {
                            this.saveInProgress = false;
                        }
                    });
            } else {
                this.updatePhysicalContract();
            }
        } else if (this.isTradeImage) {
            this.model.numberOfContracts = Number(
                this.route.snapshot.queryParams.numberOfContract,
            );
            const childSection = this.sectionModel.childSections.length;
            const splitAndTranche = JSON.parse(
                this.route.snapshot.queryParams.splitAndTranche,
            );
            this.model = this.checkFieldsToBeCopied(this.model);
            if (splitAndTranche && childSection > 0) {
                const quantity = Number(this.model.quantity) + this.childQuantity;
                this.model.quantity = quantity.toString();
                this.model.childSections = this.overwriteSplitAndTranche(
                    this.model.childSections,
                );
            }
            if (this.model.costs.length > 0) {
                this.createImageTrade();
            } else {
                const confirmDialog = this.dialog.open(ConfirmationDialogComponent, {
                    data: {
                        title: 'Trade without a cost',
                        text: 'No Costs have been added to this contract.',
                        okButton: 'SAVE ANYWAY',
                        cancelButton: 'ADD COSTS',
                    },
                });
                const confirmationSubscription = confirmDialog
                    .afterClosed()
                    .subscribe((answer) => {
                        if (answer) {
                            this.createImageTrade();
                        } else {
                            if (Number(this.model.quantity) > 0) {
                                this.saveInProgress = false;
                                this.selectedTab = 1;
                            } else {
                                this.snackbarService.throwErrorSnackBar(
                                    'You Cannot Add costs to a contract with Zero Quantity',
                                );
                                this.saveInProgress = false;
                            }
                        }
                    });
                this.subscriptions.push(confirmationSubscription);
            }
        } else {
            if (this.model.costs.length > 0) {
                const selectedCounterparty = this.mainTabComponent.counterpartyComponent
                    .selectedCounterparty;
                if (selectedCounterparty) {
                    this.companyManager
                        .getConfiguration(selectedCounterparty.counterpartyID)
                        .subscribe((data) => {
                            if (data.length > 0 && data[0].isCounterpartyGroupAccount) {
                                this.intercoModel(data);
                            } else {
                                this.createTrade();
                            }
                        });
                } else {
                    this.createTrade();
                }
            } else {
                const confirmDialog = this.dialog.open(ConfirmationDialogComponent, {
                    data: {
                        title: 'Trade without a cost',
                        text: 'No Costs have been added to this contract.',
                        okButton: 'SAVE ANYWAY',
                        cancelButton: 'ADD COSTS',
                    },
                });
                const confirmationSubscription = confirmDialog
                    .afterClosed()
                    .subscribe((answer) => {
                        if (answer) {
                            const selectedCounterparty = this.mainTabComponent
                                .counterpartyComponent.selectedCounterparty;
                            if (selectedCounterparty) {
                                this.companyManager
                                    .getConfiguration(selectedCounterparty.counterpartyID)
                                    .subscribe((data) => {
                                        if (data.length > 0 && data[0].isCounterpartyGroupAccount) {
                                            this.intercoModel(data);
                                        } else {
                                            this.createTrade();
                                        }
                                    });
                            } else {
                                this.createTrade();
                            }
                        } else {
                            if (Number(this.model.quantity) > 0) {
                                this.saveInProgress = false;
                                this.selectedTab = 1;
                            } else {
                                this.snackbarService.throwErrorSnackBar(
                                    'You Cannot Add costs to a contract with Zero Quantity',
                                );
                                this.saveInProgress = false;
                            }
                        }
                    });
                this.subscriptions.push(confirmationSubscription);
            }
        }
    }

    createImageTrade() {
        const isAllocateContract = JSON.parse(
            this.route.snapshot.queryParams.allocateContract,
        );
        if (isAllocateContract && this.isEditOnAllocate) {
            this.tradingService
                .updatePhysicalContract(this.sectionId, this.imageAllocateModel)
                .subscribe(() => {
                    this.subscriptions.push(
                        this.tradingService
                            .createPhysicalFixedPricedContract(this.model)
                            .subscribe(
                                (data: string[]) => {
                                    // Refato : This should be done in api
                                    this.tradingService
                                        .getChildSections(
                                            data[0]['sectionId'],
                                            this.dataVersionId,
                                        )
                                        .subscribe(
                                            (childSections: ChildSectionsSearchResult[]) => {
                                                this.allocateTrade(data, childSections);
                                            },
                                        );
                                },
                                (err) => {
                                    this.saveInProgress = false;
                                    throw err;
                                },
                            ),
                    );
                });
        } else {
            this.subscriptions.push(
                this.tradingService
                    .createPhysicalFixedPricedContract(this.model)
                    .subscribe(
                        (data: string[]) => {
                            if (!isAllocateContract) {
                                for (const val of data) {
                                    this.contractRefs.push(val['contractLabel']);
                                }
                                const contracts = this.contractRefs.join(', ');
                                this.snackbarService.informationAndCopySnackBar(
                                    'The following trades were imaged: ' + contracts,
                                    contracts,
                                );
                                this.tradeActionsService.displaySectionSubject.next(
                                    data[0]['sectionId'],
                                );
                            } else {
                                this.tradingService
                                    .getChildSections(data[0]['sectionId'], this.dataVersionId)
                                    .subscribe((childSections: ChildSectionsSearchResult[]) => {
                                        this.allocateTrade(data, childSections);
                                    });
                            }
                        },
                        (err) => {
                            this.saveInProgress = false;
                            throw err;
                        },
                    ),
            );
        }
    }

    assignCharterToAllocatedContract(sectionId: number, charterId: number) {
        // REFACTO : should be done in API
        const assignCharterPromise = [];
        this.executionService
            .GetSectionTrafficDetails(sectionId, this.dataVersionId)
            .subscribe((data: SectionTraffic) => {
                if (data) {
                    const sectionTrafficList: SectionTraffic[] = [];
                    sectionTrafficList.push(data);
                    if (!this.dataVersionId) {
                        assignCharterPromise.push(
                            this.executionService
                                .assignSectionsToCharter(charterId, sectionTrafficList)
                                .toPromise(),
                        );
                    }
                }
            });
    }

    assignCharter(allocationDetails: AllocateSection[]) {
        // REFACTO : should be done in API
        allocationDetails.forEach((allocationDetail) => {
            this.tradingService
                .getSection(allocationDetail.sectionId, 0, this.dataVersionId)
                .subscribe((data: Section) => {
                    if (data && data.charterId) {
                        this.assignCharterToAllocatedContract(
                            allocationDetail.allocatedSectionId,
                            data.charterId,
                        );
                    }
                });
        });
    }

    allocateTrade(
        allocatedTradeData: string[],
        allocationChildSections: ChildSectionsSearchResult[],
    ) {
        const allocationDetails = this.getAllocationDetails(
            allocatedTradeData,
            allocationChildSections,
        );
        const contractLabel = this.sectionModel.contractLabel.split('.')[0];
        this.allocateSectionSubscription = this.executionService
            .allocateImageSections(allocationDetails)
            .subscribe(
                (data) => {
                    this.assignCharter(allocationDetails);
                    const message =
                        'The trade ' +
                        allocationDetails[0].allocatedSectionReference +
                        ' has been imaged and  allocated to ' +
                        contractLabel +
                        ' with the number ' +
                        data;
                    this.snackbarService.informationAndCopySnackBar(message, message);

                    if (this.dataVersionId) {
                        this.tradeActionsService.displaySectionInSnapshotSubject.next(
                            new SectionReference(
                                allocationDetails[0].sectionId,
                                this.dataVersionId,
                            ),
                        );
                    } else {
                        this.tradeActionsService.displaySectionSubject.next(
                            allocationDetails[0].allocatedSectionId,
                        );
                    }
                },
                (err) => {
                    this.saveInProgress = false;
                    throw err;
                },
            );
    }

    getAllocationDetails(
        allocatedTradeData: string[],
        allocationChildSections: ChildSectionsSearchResult[],
    ) {
        const allocateSectionModel: AllocateSection[] = [];
        const allocationDetails = new AllocateSection();
        allocationDetails.sectionId = this.sectionId;
        allocationDetails.allocatedSectionId = allocatedTradeData[0]['sectionId'];
        allocationDetails.allocatedSectionReference =
            allocatedTradeData[0]['contractLabel'];
        allocationDetails.dataVersionId = this.dataVersionId;
        allocationDetails.quantity = Number(
            this.model.quantity.toString().replace(/,/g, ''),
        );
        allocationDetails.shippingType = ShippingType.PurchaseToSale;
        allocateSectionModel.push(allocationDetails);

        // Child Allocation Details
        const splitAndTranche = JSON.parse(
            this.route.snapshot.queryParams.splitAndTranche,
        );
        if (splitAndTranche && allocationChildSections.length > 0) {
            for (let i = 0; i < allocationChildSections.length; i++) {
                const allocateSectionElement: AllocateSection = new AllocateSection();
                allocateSectionElement.sectionId = this.sectionModel.childSections[
                    i
                ].sectionId;
                allocateSectionElement.allocatedSectionId =
                    allocationChildSections[i].sectionId;
                allocateSectionElement.quantity = this.sectionModel.childSections[
                    i
                ].quantity;
                allocateSectionElement.shippingType = ShippingType.PurchaseToSale;
                allocateSectionElement.dataVersionId = this.dataVersionId;
                allocateSectionModel.push(allocateSectionElement);
            }
        }
        return allocateSectionModel;
    }

    checkFieldsToBeCopied(
        model: PhysicalFixedPricedContract,
    ): PhysicalFixedPricedContract {
        model.status = ContractStatus.Unapproved;
        model.dataVersionId = this.dataVersionId;
        model.blDate = null;
        model.createdBy = null;
        model.creationDate = null;
        model.modifiedByUserId = null;
        model.lastModifiedBy = null;
        model.lastModifiedDate = null;
        model.allocatedTo = null;
        model.allocateTradeOptionId = 0;
        model.invoiceStatus = null;
        model.firstApprovalTime = null;
        if (this.sectionModel.childSections.length > 0) {
            this.childQuantity = 0;
            for (const section of this.sectionModel.childSections) {
                this.childQuantity += Number(section.quantity);
            }
        }

        return model;
    }

    createTrade() {
        this.model.dataVersionId = this.dataVersionId;
        if (this.model.isInterco) {
            this.model.intercoContractType =
                this.model.type === ContractTypes.Purchase
                    ? ContractTypes.Sale
                    : ContractTypes.Purchase;
            this.model.intercoBuyerCode = this.model.sellerCode;
            this.model.intercoSellerCode = this.model.buyerCode;
            const code =
                this.model.type === ContractTypes.Purchase
                    ? this.model.sellerCode
                    : this.model.buyerCode;
            this.model.intercoCosts = this.model.costs.filter(
                (cost) => cost.supplierCode === code,
            );
            if (this.model.intercoCosts) {
                this.model.intercoCosts.forEach((cost) => {
                    cost.costDirectionId = cost.costDirectionId === 1 ? 2 : 1;
                });
            }
        }

        this.subscriptions.push(
            this.tradingService
                .createPhysicalFixedPricedContract(this.model)
                .subscribe(
                    (data) => {
                        let messageText =
                            'Contract created with reference: ' + data[0]['contractLabel'];
                        let copyText = data[0]['contractLabel'];
                        if (this.isInterco) {
                            messageText =
                                messageText +
                                ', Interco Contract created with reference: ' +
                                data[1]['contractLabel'];
                            copyText = copyText + data[1]['contractLabel'];
                        }
                        this.snackbarService.informationAndCopySnackBar(
                            messageText,
                            copyText,
                        );

                        if (this.dataVersionId) {
                            this.tradeActionsService.displaySectionInSnapshotSubject.next({
                                sectionId: data[0]['sectionId'],
                                dataVersionId: this.dataVersionId,
                            });
                        } else {
                            this.tradeActionsService.displaySectionSubject.next(
                                data[0]['sectionId'],
                            );
                        }
                    },
                    (err) => {
                        this.saveInProgress = false;
                        throw err;
                    },
                ),
        );
    }

    overwriteValueIfDifferentValue(objectToCopy, objectToCompareBeforeCopy, fieldName: string, objectToUpdate) {
        if (objectToCopy[fieldName] !== objectToCompareBeforeCopy[fieldName]) {
            objectToUpdate[fieldName] = objectToCopy[fieldName];
        }
    }

    overwriteValuesIfDifferentValue(objectToCopy, objectToCompareBeforeCopy, fieldNames: string[], objectToUpdate) {
        fieldNames.forEach((fieldName) =>
            this.overwriteValueIfDifferentValue(objectToCopy, objectToCompareBeforeCopy, fieldName, objectToUpdate));
    }

    overwriteValueIfDefined(ojectToCheck, fieldName: string, objectToUpdate) {
        if (ojectToCheck[fieldName]) {
            objectToUpdate[fieldName] = ojectToCheck[fieldName];
        }
    }

    overwriteValuesIfDefined(ojectToCheck, fieldNames: string[], objectToUpdate) {
        fieldNames.forEach((fieldName) =>
            this.overwriteValueIfDefined(ojectToCheck, fieldName, objectToUpdate));
    }

    overwriteSplitAndTranche(childSections: Section[]): Section[] {
        if (this.route.snapshot.queryParams.costMatrixId) {
            this.copyCostInChild = true;
        }
        this.tradeImageModel = new PhysicalFixedPricedContract();
        // comparing the values from original model
        const fieldsToOverride = [
            nameof<PhysicalFixedPricedContract>('counterpartyReference'),
            nameof<PhysicalFixedPricedContract>('sellerCode'),
            nameof<PhysicalFixedPricedContract>('buyerCode'),
            nameof<PhysicalFixedPricedContract>('commodityId'),
            nameof<PhysicalFixedPricedContract>('cropYear'),
            nameof<PhysicalFixedPricedContract>('currencyCode'),
            nameof<PhysicalFixedPricedContract>('price'),
            nameof<PhysicalFixedPricedContract>('paymentTerms'),
            nameof<PhysicalFixedPricedContract>('contractTerms'),
            nameof<PhysicalFixedPricedContract>('contractTermsLocation'),
            nameof<PhysicalFixedPricedContract>('arbitration'),
            nameof<PhysicalFixedPricedContract>('periodTypeId'),
            nameof<PhysicalFixedPricedContract>('positionMonthType'),
            nameof<PhysicalFixedPricedContract>('deliveryPeriodStartDate'),
            nameof<PhysicalFixedPricedContract>('deliveryPeriodEndDate'),
            nameof<PhysicalFixedPricedContract>('portOfOrigin'),
            nameof<PhysicalFixedPricedContract>('portOfDestination'),
            nameof<PhysicalFixedPricedContract>('memorandum'),
        ];
        this.overwriteValuesIfDifferentValue(
            this.model, this.sectionModel, fieldsToOverride, this.tradeImageModel);

        if (Number(this.model.priceUnitId) !== this.sectionModel.priceUnitId) {
            this.tradeImageModel.priceUnitId = this.model.priceUnitId;
        }
        if (this.model.traderId !== this.sectionModel.header.traderId) {
            this.tradeImageModel.traderId = this.model.traderId;
        }
        if (
            this.model.discountPremiumValue !== this.sectionModel.premiumDiscountValue
        ) {
            this.tradeImageModel.discountPremiumValue = this.model.discountPremiumValue;
        }
        if (this.model.marketSectorId) {
            if (
                Number(this.model.marketSectorId) !== this.sectionModel.marketSectorId
            ) {
                this.tradeImageModel.marketSectorId = this.model.marketSectorId;
            }
        }
        childSections = this.sectionModel.childSections;
        for (const section of childSections) {
            section.contractType = this.model.type;

            const fieldsToOverrideIfDefined = [
                nameof<PhysicalFixedPricedContract>('counterpartyReference'),
                nameof<PhysicalFixedPricedContract>('commodityId'),
                nameof<PhysicalFixedPricedContract>('buyerCode'),
                nameof<PhysicalFixedPricedContract>('sellerCode'),
                nameof<PhysicalFixedPricedContract>('cropYear'),
                nameof<PhysicalFixedPricedContract>('currencyCode'),
                nameof<PhysicalFixedPricedContract>('originalQuantity'),
                nameof<PhysicalFixedPricedContract>('price'),
                nameof<PhysicalFixedPricedContract>('traderId'),
                nameof<PhysicalFixedPricedContract>('paymentTerms'),
                nameof<PhysicalFixedPricedContract>('contractTerms'),
                nameof<PhysicalFixedPricedContract>('contractTermsLocation'),
                nameof<PhysicalFixedPricedContract>('arbitration'),
                nameof<PhysicalFixedPricedContract>('periodTypeId'),
                nameof<PhysicalFixedPricedContract>('positionMonthType'),
                nameof<PhysicalFixedPricedContract>('deliveryPeriodStartDate'),
                nameof<PhysicalFixedPricedContract>('deliveryPeriodEndDate'),
                nameof<PhysicalFixedPricedContract>('portOfOrigin'),
                nameof<PhysicalFixedPricedContract>('portOfDestination'),
                nameof<PhysicalFixedPricedContract>('memorandum'),
            ];
            this.overwriteValuesIfDefined(this.tradeImageModel, fieldsToOverrideIfDefined, section);

            if (this.tradeImageModel.priceUnitId) {
                section.priceUnitId = Number(this.tradeImageModel.priceUnitId);
            }
            if (this.tradeImageModel.marketSectorId) {
                section.marketSectorId = Number(this.tradeImageModel.marketSectorId);
            }
            if (this.copyCostInChild) {
                section.costs = this.model.costs;
            }
            section.contractDate = this.model.contractDate;
            section.status = ContractStatus.Unapproved;
            section.blDate = null;
            section.allocatedTo = null;
            section.allocatedToId = null;
            section.allocationDate = null;
        }
        return childSections;
    }

    contractDateSelected(contractDate: Date) {
        this.mainTabComponent.contractDateSelected(contractDate);
        this.trafficTabComponent.contractDateSelected(contractDate);
    }

    getPhysicalContractInfo() {
        this.model = new PhysicalFixedPricedContract();

        this.formComponents.forEach((comp) => {
            this.model = comp.populateEntity(this.model);
        });

        if (!this.isEdit && this.model.isInterco && !this.model.departmentId) {
            const currentCompany = this.masterdata.companies.filter((e) => e.companyId === this.company)[0];
            this.model.departmentId = currentCompany.defaultDepartmentId;
        }

        this.model.costs.forEach((cost) => {
            if (cost.costId) {
                this.executionService
                    .getInvoiceMarkingsForCost(cost.costId, this.dataVersionId)
                    .subscribe(
                        (data: ApiPaginatedCollection<InvoiceMarkingSearchResult>) => {
                            let invoiceMarkingGridRows = [];
                            invoiceMarkingGridRows = data.value;
                            this.getTotalInvoiceValue(invoiceMarkingGridRows);
                            const costInvoicePercent =
                                (cost.invoicePercent * 100) / this.totalInvoicePercent;
                            invoiceMarkingGridRows.forEach((costMarkingLines) => {
                                costMarkingLines.invoicePercent =
                                    (costInvoicePercent * costMarkingLines.invoicePercent) / 100;
                            });
                            cost.costInvoiceMarkingLines = invoiceMarkingGridRows;
                        },
                    );
            }
        });
    }

    getTotalInvoiceValue(invoiceMarkingGridRows: InvoiceMarkingSearchResult[]) {
        this.totalInvoicePercent = 0;
        if (invoiceMarkingGridRows) {
            invoiceMarkingGridRows.forEach((invoiceMarking) => {
                this.totalInvoicePercent += invoiceMarking.invoicePercent;
            });
        }
    }

    onAddCostsButtonClicked() {
        if (this.tradeQuantity > 0) {
            this.isSave = true;
            this.selectedTab = 1;
            this.costsTabComponent.handleAction(
                this.costsTabComponent.costsMenuActions.addCost,
            );
        } else {
            this.snackbarService.throwErrorSnackBar(
                'You Cannot Add costs to a contract with Zero Quantity',
            );
        }
    }

    sideNavChangeCalled(sectionType: number) {
        this.sideNavOpened = true;
        this.sideNavScreen = sectionType;
        this.newTrancheSplitAgGridComponent.assignValue(
            this.sectionModel,
            sectionType,
        );
        this.newTrancheSplitFooterComponent.assignValue(
            this.sectionModel,
            sectionType,
        );
        this.newTrancheSplitHeaderComponent.assignSectionType(sectionType);
    }

    addSplitOrTranchesCalled(result: number) {
        this.newTrancheSplitAgGridComponent.addSplitOrTranches(
            result,
            'addLines',
            false,
        );
    }

    newTrancheShippingCalled(toggleShippingSelected: boolean) {
        if (toggleShippingSelected) {
            let noOfShippments = 0;
            const deliveryPeriodStartDate = moment(
                this.sectionModel.deliveryPeriodStartDate,
            );
            const deliveryPeriodEndDate = moment(
                this.sectionModel.deliveryPeriodEndDate,
            );
            noOfShippments =
                deliveryPeriodEndDate.month() -
                deliveryPeriodStartDate.month() +
                12 * (deliveryPeriodEndDate.year() - deliveryPeriodStartDate.year());
            this.newTrancheSplitAgGridComponent.addSplitOrTranches(
                noOfShippments + 1,
                'shipping',
                false,
            );
        } else {
            this.newTrancheSplitAgGridComponent.reset();
        }
    }

    childQuantityConsumedCalled(model) {
        if (model) {
            this.newTrancheSplitHeaderComponent.showAddline = true;
            if (this.sectionModel.quantity - model.childQuantityConsumed <= 0) {
                this.newTrancheSplitHeaderComponent.showAddline = false;
            }
            // if the weight code of parent and child trade for split is different
            // then the correct weight of the quantity to be updated in parent trade
            // after weight conversion
            if (model.isWeightConverted) {
                this.isWeightConvertedForSplit = model.isWeightConverted;
                // setting quantity of parent after creating a split with different
                // weight code
                this.childQuantityConsumed = model.childQuantityConsumed;
            }
            this.newTrancheSplitFooterComponent.quantityConsumedCtrl.patchValue(
                this.formatQuantity(model.childQuantityConsumed),
            );
            this.newTrancheSplitFooterComponent.quantityAvailableCtrl.patchValue(
                this.formatQuantity(
                    Number(
                        new AtlasNumber(this.sectionModel.quantity.toString())
                            .plus(-model.childQuantityConsumed)
                            .toString(),
                    ),
                ),
            );
        }
    }

    formatQuantity(value: number) {
        // REFACTO : Write a generic method / use it if exists
        if (value) {
            return new Intl.NumberFormat('en-US', {
                minimumFractionDigits: 3,
                maximumFractionDigits: 3,
            }).format(value);
        }
        return value;
    }

    enableProceedButtonCalled(enableProceedButton: boolean) {
        if (enableProceedButton) {
            this.newTrancheSplitHeaderComponent.showAddline = true;
        }
    }

    onDiscardButtonClick() {
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
                this.newTrancheSplitAgGridComponent.disableAddNewLine = false;
                this.newTrancheSplitHeaderComponent.showAddline = true;
                this.sideNavOpened = false;
            }
        });
    }

    onSideNavSaveButtonClick() {
        if (!this.isSplitSaveDisabled) {
            this.isSplitSaveDisabled = true;
            let quantityAvailable: number = 0;
            const errorQuantity: string =
                'Form is invalid. Please resolve the errors';
            this.newTrancheSplitAgGridComponent.populateEntity(this.sectionModel);
            if (this.newTrancheSplitAgGridComponent.isValid) {
                quantityAvailable = this.newTrancheSplitFooterComponent
                    .quantityAvailableCtrl.value
                    ? this.newTrancheSplitFooterComponent.quantityAvailableCtrl.value
                        .split(',')
                        .join('')
                    : this.newTrancheSplitFooterComponent.quantityAvailableCtrl.value;
                if (quantityAvailable >= 0) {
                    const quantityCheck =
                        this.sectionModel.childSections.filter(
                            (childSection) => childSection.quantity === 0,
                        ).length > 0;
                    const checkNewLineAdded =
                        this.sectionModel.childSections.filter(
                            (childElement) => childElement.sectionId === undefined,
                        ).length > 0;
                    if (!quantityCheck) {
                        if (checkNewLineAdded) {
                            if (this.sideNavScreen === SectionTypes.Split) {
                                this.executionService
                                    .getAllocationBySectionId(this.sectionId, this.dataVersionId)
                                    .subscribe((data: Allocation) => {
                                        if (data) {
                                            this.allocationModel = data;
                                            this.splitAllocation();
                                        } else {
                                            this.createTrancheSplit();
                                        }
                                    });
                            } else {
                                this.createTrancheSplit();
                            }
                        }
                    } else {
                        this.snackbarService.informationSnackBar(errorQuantity);
                        this.isSplitSaveDisabled = false;
                    }
                } else {
                    this.snackbarService.informationSnackBar(errorQuantity);
                    this.isSplitSaveDisabled = false;
                }
            } else {
                this.snackbarService.throwErrorSnackBar(
                    this.newTrancheSplitAgGridComponent.errorMessage
                        ? this.newTrancheSplitAgGridComponent.errorMessage
                        : errorQuantity,
                );
                this.isSplitSaveDisabled = false;
            }
        }
    }

    createTrancheSplit() {
        this.sectionModel.dataVersionId = this.dataVersionId;
        this.sectionModel.childSections.forEach((element) => {
            element.contractedValue = this.setContractValue(
                element,
                element.quantity,
            );
        });

        this.subscriptions.push(
            this.tradingService
                .createTrancheSplit(this.sectionModel, this.sideNavScreen)
                .subscribe(
                    (data) => {
                        this.lockService
                            .unlockContract(this.sectionId, this.getLockFunctionalContext())
                            .subscribe();
                        if (this.allocationModel) {
                            // REFACTO : should be done in API
                            this.allocateSections(data);
                        }

                        this.tradeActionsService.displaySectionAfterEditSubject.next(
                            new SectionTabIndex(
                                data.map((result) => result.sectionId)[0],
                                this.selectedTab,
                            ),
                        );
                        if (this.isWeightConvertedForSplit) {
                            this.sectionModel.quantity =
                                this.sectionModel.quantity - this.childQuantityConsumed;
                            this.tradingService
                                .updatePhysicalContract(
                                    this.contractId,
                                    this.convertToPhysicalFixedPricedContract(this.sectionModel),
                                    this.isWeightConvertedForSplit,
                                )
                                .subscribe();
                        }
                    },
                    (error) => {
                        console.error(error);
                        this.isSplitSaveDisabled = false;
                        this.snackbarService.throwErrorSnackBar('Oops! An error ocurred');
                    },
                ),
        );
    }

    setContractValue(sectionModel: Section, quantityValue: number): string {
        let quantityVal: number;
        quantityVal = quantityValue;
        const mask = CustomNumberMask(12, 10, true);
        if (this.masterdata === undefined) {
            return;
        }
        const weightCodeConversion = this.masterdata.weightUnits.find(
            (weightUnit) => weightUnit.weightUnitId === sectionModel.weightUnitId,
        ).conversionFactor;
        const selectedPriceUnit = this.masterdata.priceUnits.filter(
            (priceUnit) => priceUnit.priceUnitId === sectionModel.priceUnitId,
        );
        const priceCodeConversion =
            selectedPriceUnit.length > 0
                ? selectedPriceUnit[0].conversionFactor
                : undefined;

        if (
            !weightCodeConversion ||
            !priceCodeConversion ||
            !quantityValue ||
            !sectionModel.price
        ) {
            sectionModel.contractedValue = '';
            return;
        }
        const contractPrice = sectionModel.price.toString().replace(/,/g, '');
        let contractPriceDecimal: AtlasNumber = new AtlasNumber(contractPrice);
        const quantity = quantityVal.toString().replace(/,/g, '');
        const quantityDecimal: AtlasNumber = new AtlasNumber(quantity);

        if (
            sectionModel.premiumDiscountTypeId !== undefined &&
            sectionModel.currencyCode !== sectionModel.premiumDiscountCurrency &&
            sectionModel.premiumDiscountTypeId !== undefined
        ) {
            // discountPremiumValue exists

            let discountPremiumContractedPrice: number | AtlasNumber = 0;
            const discountPremiumSign =
                (sectionModel.premiumDiscountTypeId as DiscountTypes) ===
                    DiscountTypes.Discount
                    ? -1
                    : 1;

            if (
                (sectionModel.premiumDiscountBasis as DiscountBasis) ===
                DiscountBasis.Rate
            ) {
                discountPremiumContractedPrice =
                    sectionModel.premiumDiscountValue * discountPremiumSign;
            } else if (
                (sectionModel.premiumDiscountBasis as DiscountBasis) ===
                DiscountBasis.Percent
            ) {
                discountPremiumContractedPrice = contractPriceDecimal.times(
                    (sectionModel.premiumDiscountValue * discountPremiumSign) / 100,
                );
            }
            contractPriceDecimal = contractPriceDecimal.plus(
                discountPremiumContractedPrice,
            );
        }

        const contractValue = contractPriceDecimal
            .times(quantityDecimal)
            .times(weightCodeConversion * priceCodeConversion)
            .toString();

        const contractValueFormatted = conformToMask(contractValue, mask, {
            guide: false,
        }).conformedValue;
        sectionModel.contractedValue = contractValueFormatted;
        return sectionModel.contractedValue;
    }

    getContractValue(sectionModelOrig: Section, quantityValue: number): string {
        // REFACTO : duplicate code with setContractValue
        const sectionModel = sectionModelOrig;
        let quantityVal;
        quantityVal = quantityValue;
        const mask = CustomNumberMask(12, 10, true);
        if (this.masterdata === undefined) {
            return;
        }
        const weightCodeConversion = this.masterdata.weightUnits.find(
            (weightUnit) => weightUnit.weightUnitId === sectionModel.weightUnitId,
        ).conversionFactor;
        const selectedPriceUnit = this.masterdata.priceUnits.filter(
            (priceUnit) => priceUnit.priceUnitId === sectionModel.priceUnitId,
        );
        const priceCodeConversion =
            selectedPriceUnit.length > 0
                ? selectedPriceUnit[0].conversionFactor
                : undefined;

        if (
            !weightCodeConversion ||
            !priceCodeConversion ||
            !quantityValue ||
            !sectionModel.price
        ) {
            sectionModel.contractedValue = '';
            return;
        }
        const contractPrice = sectionModel.price.toString().replace(/,/g, '');
        let contractPriceDecimal: AtlasNumber = new AtlasNumber(contractPrice);
        const quantity = quantityVal.toString().replace(/,/g, '');
        const quantityDecimal: AtlasNumber = new AtlasNumber(quantity);

        if (
            sectionModel.premiumDiscountTypeId !== undefined &&
            sectionModel.currencyCode !== sectionModel.premiumDiscountCurrency &&
            sectionModel.premiumDiscountTypeId !== undefined
        ) {
            // discountPremiumValue exists

            let discountPremiumContractedPrice: number | AtlasNumber = 0;
            const discountPremiumSign =
                (sectionModel.premiumDiscountTypeId as DiscountTypes) ===
                    DiscountTypes.Discount
                    ? -1
                    : 1;

            if (
                (sectionModel.premiumDiscountBasis as DiscountBasis) ===
                DiscountBasis.Rate
            ) {
                discountPremiumContractedPrice =
                    sectionModel.premiumDiscountValue * discountPremiumSign;
            } else if (
                (sectionModel.premiumDiscountBasis as DiscountBasis) ===
                DiscountBasis.Percent
            ) {
                discountPremiumContractedPrice = contractPriceDecimal.times(
                    (sectionModel.premiumDiscountValue * discountPremiumSign) / 100,
                );
            }
            contractPriceDecimal = contractPriceDecimal.plus(
                discountPremiumContractedPrice,
            );
        }

        const contractValue = contractPriceDecimal
            .times(quantityDecimal)
            .times(weightCodeConversion * priceCodeConversion)
            .toString();

        const contractValueFormatted = conformToMask(contractValue, mask, {
            guide: false,
        }).conformedValue;
        sectionModel.contractedValue = contractValueFormatted;
        return sectionModel.contractedValue;
    }

    getPosition(event) {
        this.selectedTab = event.index;

        if (event.tab.textLabel === 'CONTRACT STATUS') {
            const index = event.index;
            const eleRef = document.getElementsByClassName('mat-tab-label-content');
            const el = eleRef[index].parentElement;

            this.offsetLeft = el.offsetLeft;
            this.offsetLeft = this.offsetLeft - 50;
        }

        switch (this.selectedTab) {
            case 1:
                this.costsTabComponent.onTabSelected();
                break;
            case 4:
                this.sectionTabComponent.onTabSelected();
                break;
            case 5:
                this.invoiceMarkingTabComponent.onTabSelected();
                break;
        }
        return { offsetLeft: this.offsetLeft };
    }

    splitAllocation() {
        // REFACTO : SHOULD BE DONE IN API
        let allocatedSectionModel: Section;
        this.subscriptions.push(
            this.tradingService
                .getSection(
                    this.allocationModel.allocatedSectionId,
                    0,
                    this.dataVersionId,
                )
                .subscribe((data) => {
                    allocatedSectionModel = data;
                    if (allocatedSectionModel) {
                        this.tradingService
                            .getChildSections(
                                this.allocationModel.allocatedSectionId,
                                this.dataVersionId,
                            )
                            .subscribe(
                                (allocatedChildSections: ChildSectionsSearchResult[]) => {
                                    this.newTrancheSplitAgGridComponent.assignValue(
                                        allocatedSectionModel,
                                        this.sideNavScreen,
                                    );

                                    this.newTrancheSplitAgGridComponent.addSplitOrTranches(
                                        this.sectionModel.childSections.length,
                                        'addLines',
                                        true,
                                        allocatedSectionModel,
                                        allocatedChildSections,
                                    );

                                    this.newTrancheSplitAgGridComponent.populateEntity(
                                        allocatedSectionModel,
                                        allocatedChildSections,
                                    );

                                    let index = 0;

                                    this.sectionModel.childSections.forEach((obj) => {
                                        allocatedSectionModel.childSections[index].quantity =
                                            obj.quantity;
                                        allocatedSectionModel.childSections[
                                            index
                                        ].originalQuantity = obj.quantity;
                                        index++;
                                    });

                                    allocatedSectionModel.childSections.forEach((childSection) =>
                                        this.sectionModel.childSections.push(childSection),
                                    );
                                    this.createTrancheSplit();
                                },
                            );
                    } else {
                        allocatedSectionModel.childSections.forEach((childSection) =>
                            this.sectionModel.childSections.push(childSection),
                        );
                        this.createTrancheSplit();
                    }
                }),
        );
    }

    allocateSections(result) {
        const midLength: number = result.length / 2;
        const allocateSectionModel: AllocateSection[] = [];
        for (let i = 0; i < midLength; i++) {
            const allocateSectionElement: AllocateSection = new AllocateSection();
            allocateSectionElement.sectionId = result[i].sectionId;
            allocateSectionElement.allocatedSectionId =
                result[i + midLength].sectionId;
            allocateSectionElement.quantity = this.sectionModel.childSections[
                i + midLength
            ].quantity;
            allocateSectionElement.shippingType = this.allocationModel.transferShippingOptionId;
            allocateSectionElement.dataVersionId = this.dataVersionId;
            allocateSectionModel.push(allocateSectionElement);
        }

        this.executionService
            .allocateSections(allocateSectionModel)
            .subscribe(() => {
                this.snackbarService.informationSnackBar(
                    'Split Allocated Successfully',
                );
            });
    }

    contractStatusChanged(contractStatus: ContractStatus) {
        this.headerComponent.contractStatusChanged(contractStatus);
        this.sectionTabComponent.contractStatusChanged(contractStatus);
    }

    quantityValueUpdate(quantity) {
        if (quantity >= 0) {
            this.mainTabComponent.quantityComponent.quantityCtrl.patchValue(quantity);
            this.mainTabComponent.quantityComponent.quantityContractedCtrl.patchValue(
                quantity,
            );
            this.mainTabComponent.quantityComponent.onQuantityBlur(quantity);
            this.trafficTabQuantity = quantity;
            this.quantityTrafficSplit = quantity;
        }

        let isAnyCurrentToggleSelected: boolean = false;
        let isAnyAllocationCardCheckFailed: boolean = false;
        let allocatedSectionCode: string;

        allocatedSectionCode = this.trafficTabComponent.allocationComponent
            .allocatedSectionCode;
        isAnyCurrentToggleSelected = this.trafficTabComponent.currentTradeComponent.checkAnyToggleSelected();
        isAnyAllocationCardCheckFailed = this.trafficTabComponent.allocationComponent.allocationSelectionChecked();

        if (
            allocatedSectionCode &&
            allocatedSectionCode.toString().trim().length > 0
        ) {
            this.isEdit =
                isAnyCurrentToggleSelected || !isAnyAllocationCardCheckFailed
                    ? true
                    : false;
        } else {
            this.isEdit = isAnyCurrentToggleSelected ? true : false;
        }

        if (this.isEdit && !this.isTradeImage) {
            this.startLockRefresh();
        } else {
            this.stopLockRefresh();
        }
    }

    // -- (De)Allocation Code
    onDeallocateTradeButtonClicked() {
        this.openDeallocationDialog();
    }

    openDeallocationDialog(): void {
        this.subscriptions.push(
            this.lockService
                .isLockedContract(this.sectionModel.sectionId)
                .subscribe((lock: IsLocked) => {
                    if (lock.isLocked) {
                        this.dialog.open(ConfirmationDialogComponent, {
                            data: {
                                title: 'Lock',
                                text: lock.message,
                                okButton: 'Got it',
                            },
                        });
                    } else {
                        this.subscriptions.push(
                            this.lockService
                                .lockContract(
                                    this.sectionModel.sectionId,
                                    LockFunctionalContext.Deallocation,
                                )
                                .subscribe((lockState) => {
                                    const dialogRef = this.dialog.open(
                                        TradeDeallocationDialogComponent,
                                        {
                                            disableClose: true,
                                        },
                                    );

                                    this.subscriptions.push(
                                        dialogRef.afterClosed().subscribe((result: boolean) => {
                                            if (result !== undefined) {
                                                this.subscriptions.push(
                                                    this.executionService
                                                        .deallocateContract(
                                                            this.sectionModel.sectionId,
                                                            result,
                                                            this.dataVersionId,
                                                        )
                                                        .subscribe((ok) => {
                                                            if (ok) {
                                                                this.snackbarService.throwErrorSnackBar(
                                                                    'Trade has been successfully de-allocated',
                                                                );
                                                                this.tradeManagementMenuBarComponent.updateDeallocationInfo();
                                                            }
                                                            this.lockService.cleanSessionLocks().subscribe();
                                                        }),
                                                );
                                            } else {
                                                this.lockService.cleanSessionLocks().subscribe();
                                            }
                                        }),
                                    );
                                }),
                        );
                    }
                }),
        );
    }

    // -- Approve
    onApproveSectionButtonClicked() {
        if (!this.tradeCanBeApproved) {
            this.snackbarService.throwErrorSnackBar('You cannot approve a contract with default department');
            return;
        }

        if (this.dataVersionId) {
            this.snackbarService.informationSnackBar(
                'You cannot approve a contract in a freeze',
            );
            return;
        }
        if (this.isFirstApproval === true && this.isZeroCostRow === true) {
            const confirmDiscardDialog = this.dialog.open(
                ConfirmationDialogComponent,
                {
                    data: {
                        text:
                            'There are some costs lines with zero values, do you still want to proceed with the first approval of the trade?',
                        okButton: 'YES',
                        cancelButton: 'NO',
                    },
                },
            );
            confirmDiscardDialog.afterClosed().subscribe((answer) => {
                if (answer) {
                    this.subscriptions.push(
                        this.tradingService
                            .approveSection(this.sectionModel.sectionId)
                            .subscribe((ok) => {
                                if (ok) {
                                    this.sectionModel.status = ContractStatus.Approved;
                                    this.headerComponent.contractStatusChanged(
                                        ContractStatus.Approved,
                                    );
                                    this.tradeManagementMenuBarComponent.contractStatusChanged(
                                        ContractStatus.Approved,
                                    );
                                    this.isApprovalBannerDisplayed = true;
                                    this.costsTabComponent.getCosts(this.sectionModel.sectionId);
                                    this.isFirstApproval = false;
                                }
                            }),
                    );
                }
            });
        } else {
            this.subscriptions.push(
                this.tradingService
                    .approveSection(this.sectionModel.sectionId)
                    .subscribe((ok) => {
                        if (ok) {
                            this.sectionModel.status = ContractStatus.Approved;
                            this.headerComponent.contractStatusChanged(
                                ContractStatus.Approved,
                            );
                            this.sectionTabComponent.contractStatusChanged(
                                ContractStatus.Approved,
                            );
                            this.tradeManagementMenuBarComponent.contractStatusChanged(
                                ContractStatus.Approved,
                            );
                            this.isApprovalBannerDisplayed = true;
                            this.costsTabComponent.getCosts(this.sectionModel.sectionId);
                        }
                    }),
            );
        }
    }

    // --UnApprove
    onUnApproveSectionButtonClicked() {
        if (this.dataVersionId) {
            this.snackbarService.informationSnackBar(
                'You cannot Unapprove a contract in a freeze',
            );
            return;
        }
        if (this.totalInvoiceValuePercent === 100) {
            const confirmDiscardDialog = this.dialog.open(
                ConfirmationDialogComponent,
                {
                    data: {
                        text: 'Trade is already 100% invoiced. Do you want to Unapprove?',
                        okButton: 'CONFIRM',
                        cancelButton: 'CANCEL',
                    },
                },
            );
            confirmDiscardDialog.afterClosed().subscribe((answer) => {
                if (answer) {
                    this.subscriptions.push(
                        this.tradingService
                            .unapproveSection(this.sectionModel.sectionId)
                            .subscribe((ok) => {
                                if (ok) {
                                    this.sectionModel.status = ContractStatus.Unapproved;

                                    this.headerComponent.contractStatusChanged(
                                        ContractStatus.Unapproved,
                                    );
                                    this.tradeManagementMenuBarComponent.contractStatusChanged(
                                        ContractStatus.Unapproved,
                                    );
                                    this.isApprovalBannerDisplayed = false;
                                }
                            }),
                    );
                }
            });
        } else {
            this.subscriptions.push(
                this.tradingService
                    .unapproveSection(this.sectionModel.sectionId)
                    .subscribe((ok) => {
                        if (ok) {
                            this.sectionModel.status = ContractStatus.Unapproved;

                            this.headerComponent.contractStatusChanged(
                                ContractStatus.Unapproved,
                            );
                            this.tradeManagementMenuBarComponent.contractStatusChanged(
                                ContractStatus.Unapproved,
                            );
                            this.isApprovalBannerDisplayed = false;
                        }
                    }),
            );
        }
    }

    // Delete
    onDeleteSectionButtonClicked() {
        const tradePopUpTitle = 'Trade Deletion';
        let errorMessage;
        if (
            this.sectionModel.quantity !== null &&
            this.sectionModel.quantity > 0 &&
            (!this.statusTabComponent.invoicingComponent.invoicePercentage
                || this.statusTabComponent.invoicingComponent.invoicePercentage === 0
                || this.costWithInvoice)
        ) {
            errorMessage = 'Not allowed. Quantity is not equal to zero.'
        } else if (
            this.statusTabComponent.invoicingComponent.invoicePercentage > 0 ||
            this.costWithInvoice
        ) {
            errorMessage = 'Not allowed. ' + this.headerComponent.contractReference + ' is invoiced';
        } else if (
            this.sectionModel.childSections !== null &&
            this.sectionModel.childSections.length > 0 &&
            this.sectionModel.sectionOriginId === 0
        ) {
            errorMessage = 'Not allowed to delete a parent trade.';
        } else if (
            this.sectionModel.allocatedTo !== null &&
            this.sectionModel.allocatedToId !== null
        ) {
            errorMessage = 'Not allowed. ' + this.sectionModel.contractLabel + ' is allocated to ' +
            this.sectionModel.allocatedTo.contractLabel;
        }

        if (errorMessage) {
            this.dialog.open(ConfirmationDialogComponent, {
                data: {
                    title: tradePopUpTitle,
                    text: errorMessage,
                    okButton: 'Ok',
                },
            });
        } else {
            const confirmDialog = this.dialog.open(ConfirmationDialogComponent, {
                data: {
                    title: tradePopUpTitle,
                    text:
                        'Trade will be deleted. This action is irreversible. Continue with deletion?',
                    okButton: 'Delete anyway',
                    cancelButton: 'Cancel',
                },
            });
            confirmDialog.afterClosed().subscribe((answer) => {
                if (answer) {
                    this.subscriptions.push(
                        this.tradingService
                            .deleteSection(this.sectionModel.sectionId)
                            .subscribe((ok) => {
                                if (ok) {
                                    this.router.navigate([
                                        this.companyManager.getCurrentCompanyId() + '/trades',
                                    ]);
                                }
                            }),
                    );
                }
            });
        }
    }

    invoicePercentOfCost(costData: CostListDisplayView[]) {
        this.costWithInvoice = costData.find((inv) => inv.invoicePercent > 0);
    }

    onCloseSectionButtonClicked(
        sectionModel: Section,
        invoiceModel: InvoiceMarkingSearchResult[],
        isAllocatedTrade: boolean,
        sectionCancelDetails: CancelTrade,
    ) {
        const unpostedTradeInvoiceStatusList = new Array();
        const cashUnMatchedInvoiceTradeList = new Array();
        let invoiceMarkingGridRows: InvoiceMarkingSearchResult[];
        let allocatedTradeValid: boolean = true;

        const closeSectionModel: Section =
            sectionModel === null ? this.sectionModel : sectionModel;

        invoiceMarkingGridRows =
            invoiceModel === null
                ? this.invoiceMarkingTabComponent.detailedViewComponent
                    .invoiceMarkingGridRows
                : invoiceModel;

        invoiceMarkingGridRows.forEach((x) => {
            if (x.postingStatusId !== PostingStatus.Posted) {
                unpostedTradeInvoiceStatusList.push(x);
            }
            if (
                x.cashMatchDate === null ||
                x.cashMatchDate.toDateString() ===
                this.invoiceMarkingTabComponent.detailedViewComponent.defaultDate
            ) {
                cashUnMatchedInvoiceTradeList.push(x);
            }
        });
        const invoicePercentage =
            invoiceMarkingGridRows.length > 0
                ? invoiceMarkingGridRows.reduce((a, b) => {
                    return a + b.invoicePercent;
                },                              0)
                : 0;
        const costFilteredByInvoiceStatus = closeSectionModel.costs.filter(
            (cost) => cost.invoiceStatus === InvoicingStatus.Uninvoiced,
        );

        let confirmPopupData = {};
        let confirmSectionCloseSuccess: boolean = true;

        // Trade is invoiced and
        // No cash unmatched invoices, No unposted invoice and No uninvoced trade
        if ((
            invoiceMarkingGridRows.length > 0 &&
            invoicePercentage === 100 &&
            unpostedTradeInvoiceStatusList.length === 0 &&
            cashUnMatchedInvoiceTradeList.length === 0 &&
            (costFilteredByInvoiceStatus === null ||
                costFilteredByInvoiceStatus.length === 0)
        ) || ((
            closeSectionModel.quantity === 0 ||
            closeSectionModel.contractInvoiceTypeId ===
            ContractInvoiceType.Cancellation
        ))) {
            confirmPopupData = {
                data: {
                    title: 'Close Trade',
                    text: 'You are about to close this trade. Continue?',
                    okButton: 'YES',
                    cancelButton: 'NO',
                },
            };
        } else if (
            closeSectionModel.invoicingStatusId !== InvoicingStatus.Finalized
        ) {
            confirmPopupData = {
                data: {
                    title: 'Blocking - Close Trade',
                    text: 'Not allowed: Trade is not final invoiced.',
                    okButton: 'Ok',
                },
            };
            confirmSectionCloseSuccess = false;
            if (isAllocatedTrade) {
                allocatedTradeValid = false;
            }
        } else if (unpostedTradeInvoiceStatusList.length > 0) {
            confirmPopupData = {
                data: {
                    title: 'Blocking - Close Trade',
                    text: 'Not allowed: invoices are unposted.',
                    okButton: 'Ok',
                },
            };
            confirmSectionCloseSuccess = false;
            if (isAllocatedTrade) {
                allocatedTradeValid = false;
            }
        } else if (
            closeSectionModel.blDate === null ||
            closeSectionModel.blDate.toDateString() ===
            this.invoiceMarkingTabComponent.detailedViewComponent.defaultDate
        ) {
            confirmPopupData = {
                data: {
                    title: 'Blocking - Close Trade',
                    text:
                        'Not allowed. The trade is unrealized physicals. Make the Quantity 0 or change the shipping status to close it.',
                    okButton: 'Ok',
                },
            };
            confirmSectionCloseSuccess = false;
            if (isAllocatedTrade) {
                allocatedTradeValid = false;
            }
        } else if (costFilteredByInvoiceStatus.length > 0) {
            confirmPopupData = {
                data: {
                    title: 'Warning - Close Trade',
                    text: 'Trade has cost accrual. Continue with closure?',
                    okButton: 'YES',
                    cancelButton: 'NO',
                },
            };
        } else if (
            unpostedTradeInvoiceStatusList.length === 0 &&
            cashUnMatchedInvoiceTradeList.length > 0
        ) {
            confirmPopupData = {
                data: {
                    title: 'Warning - Close Trade',
                    text: 'Invoice(s) are not cash matched. Continue with closure?',
                    okButton: 'YES',
                    cancelButton: 'NO',
                },
            };
        }

        if (!confirmSectionCloseSuccess) {
            const alertCloseDialog = this.dialog.open(
                ConfirmationDialogComponent,
                confirmPopupData,
            );
            if (isAllocatedTrade) {
                alertCloseDialog.afterClosed().subscribe((answer) => {
                    this.closeTrades(this.sectionToClose, sectionCancelDetails);
                });
            } else if (
                sectionCancelDetails !== null &&
                sectionCancelDetails.isSectionClosed
            ) {
                alertCloseDialog.afterClosed().subscribe((answer) => {
                    this.cancelTrades(sectionCancelDetails);
                });
            }
        } else {
            const confirmCloseDialog = this.dialog.open(
                ConfirmationDialogComponent,
                confirmPopupData,
            );
            confirmCloseDialog.afterClosed().subscribe((answer) => {
                if (answer && !isAllocatedTrade) {
                    this.sectionToClose.push({
                        sectionId: closeSectionModel.sectionId,
                        sectionCode: closeSectionModel.contractLabel,
                    });

                    if (
                        closeSectionModel.allocatedTo !== null &&
                        !closeSectionModel.allocatedTo.isClosed
                    ) {
                        const confirmCloseAllocationDialog = this.dialog.open(
                            ConfirmationDialogComponent,
                            {
                                data: {
                                    text:
                                        'Do you want to close allocation ' +
                                        closeSectionModel.allocatedTo.contractLabel,
                                    okButton: 'YES',
                                    cancelButton: 'NO',
                                },
                            },
                        );
                        confirmCloseAllocationDialog.afterClosed().subscribe((answer) => {
                            if (answer) {
                                let allocatedSectionModel: Section;
                                let allocatedSectionInvoiceMarkingGridRows: InvoiceMarkingSearchResult[];

                                this.subscriptions.push(
                                    this.lockService
                                        .isLockedContract(closeSectionModel.allocatedTo.sectionId)
                                        .subscribe((lock: IsLocked) => {
                                            if (lock.isLocked) {
                                                const allocationTradeLockPopup = this.dialog.open(
                                                    ConfirmationDialogComponent,
                                                    {
                                                        data: {
                                                            title: 'Lock',
                                                            text: lock.message,
                                                            okButton: 'Got it',
                                                        },
                                                    },
                                                );
                                                allocationTradeLockPopup
                                                    .afterClosed()
                                                    .subscribe((answer) => {
                                                        this.closeTrades(
                                                            this.sectionToClose,
                                                            sectionCancelDetails,
                                                        );
                                                    });
                                            } else {
                                                this.tradingService
                                                    .getSection(
                                                        closeSectionModel.allocatedTo.sectionId,
                                                        0,
                                                        this.dataVersionId,
                                                    )
                                                    .subscribe((data) => {
                                                        allocatedSectionModel = data;
                                                        if (
                                                            data.invoiceReference &&
                                                            (data.invoiceTypeId === InvoiceTypes.Cost ||
                                                                data.invoiceTypeId ===
                                                                InvoiceTypes.CostReceivable ||
                                                                data.invoiceTypeId ===
                                                                InvoiceTypes.CostCreditNote ||
                                                                data.invoiceTypeId ===
                                                                InvoiceTypes.CostDebitNote)
                                                        ) {
                                                            data.invoiceReference = null;
                                                        }
                                                        this.executionService
                                                            .getInvoiceDetailsBySection(
                                                                closeSectionModel.allocatedTo.sectionId,
                                                                this.childFlag,
                                                                this.dataVersionId,
                                                            )
                                                            .subscribe(
                                                                (
                                                                    data: ApiPaginatedCollection<
                                                                        InvoiceMarkingSearchResult
                                                                        >,
                                                                ) => {
                                                                    allocatedSectionInvoiceMarkingGridRows = this.invoiceMarkingTabComponent.detailedViewComponent.getDocumentTypeForGrid(
                                                                        data.value,
                                                                    );
                                                                    for (const rows of allocatedSectionInvoiceMarkingGridRows) {
                                                                        rows.cashMatchDate = this.invoiceMarkingTabComponent.detailedViewComponent.isDateNull(
                                                                            rows.cashMatchDate,
                                                                        )
                                                                            ? null
                                                                            : rows.cashMatchDate;
                                                                    }

                                                                    this.executionService
                                                                        .GetSectionTrafficDetails(
                                                                            closeSectionModel.allocatedTo.sectionId,
                                                                            this.dataVersionId,
                                                                        )
                                                                        .subscribe((data: SectionTraffic) => {
                                                                            // REFACTO : Why getSectionTraffic details ??
                                                                            if (data) {
                                                                                this.onCloseSectionButtonClicked(
                                                                                    allocatedSectionModel,
                                                                                    allocatedSectionInvoiceMarkingGridRows,
                                                                                    true,
                                                                                    null,
                                                                                );
                                                                            }
                                                                        });
                                                                },
                                                            );
                                                    });
                                            }
                                        }),
                                );
                            } else {
                                this.closeTrades(this.sectionToClose, sectionCancelDetails);
                            }
                        });
                    } else {
                        this.closeTrades(this.sectionToClose, sectionCancelDetails);
                    }
                } else if (answer && allocatedTradeValid) {
                    this.sectionToClose.push({
                        sectionId: closeSectionModel.sectionId,
                        sectionCode: closeSectionModel.contractLabel,
                    });
                    this.closeTrades(this.sectionToClose, sectionCancelDetails);
                } else if (
                    sectionCancelDetails !== null &&
                    sectionCancelDetails.isSectionClosed
                ) {
                    this.cancelTrades(sectionCancelDetails);
                }
            });
        }
    }

    private closeTrades(
        sectionIToClose: any[],
        sectionCancelDetails: CancelTrade,
    ) {
        const sectionIdsToClose = new Array();
        sectionIToClose.forEach((element) => {
            sectionIdsToClose.push(element.sectionId);
        });
        this.subscriptions.push(
            this.tradingService
                .closeSection(sectionIdsToClose, this.childFlag, this.dataVersionId)
                .subscribe((ok) => {
                    if (ok) {
                        const title =
                            sectionIToClose.length > 1
                                ? sectionIToClose[0].sectionCode +
                                ' and ' +
                                sectionIToClose[1].sectionCode +
                                ' are now closed.'
                                : sectionIToClose[0].sectionCode + ' is now closed.';
                        const closeInfoPopup = this.dialog.open(
                            ConfirmationDialogComponent,
                            {
                                data: {
                                    title: 'Trade Closed',
                                    text: title,
                                    okButton: 'Ok',
                                },
                            },
                        );
                        closeInfoPopup.afterClosed().subscribe((answer) => {
                            if (!this.dataVersionId) {
                                if (
                                    sectionCancelDetails !== null &&
                                    sectionCancelDetails.isSectionClosed
                                ) {
                                    this.cancelTrades(sectionCancelDetails);
                                } else {
                                    this.router.navigate([
                                        this.companyManager.getCurrentCompanyId() +
                                        '/trades/display/' +
                                        this.sectionId,
                                    ]);
                                }
                            } else {
                                this.router.navigate([
                                    this.companyManager.getCurrentCompanyId() +
                                    '/trades/snapshot/' +
                                    this.dataVersionId +
                                    '/display/' +
                                    this.sectionId,
                                ]);
                            }
                        });
                    }
                }),
        );
    }

    onReopenSectionButtonClicked() {
        if (
            this.sectionModel.assignedCharterReference === null ||
            this.sectionModel.charterStatusId === null ||
            this.sectionModel.charterStatusId === CharterStatus.Open
        ) {
            const sectionsToReOpen = new Array();
            sectionsToReOpen.push({
                sectionId: this.sectionModel.sectionId,
                sectionCode: this.sectionModel.contractLabel,
            });

            if (
                this.sectionModel.allocatedTo != null &&
                this.sectionModel.allocatedTo.isClosed
            ) {
                const confirmReopenDialog = this.dialog.open(
                    ConfirmationDialogComponent,
                    {
                        data: {
                            title: 'Reopen Trade',
                            text:
                                'This contract is allocated to contract ' +
                                this.sectionModel.allocatedTo.contractLabel +
                                ', Do you wish to reopen this contract too? ',
                            okButton: 'YES',
                            cancelButton: 'NO',
                        },
                    },
                );
                confirmReopenDialog.afterClosed().subscribe((answer) => {
                    if (answer) {
                        sectionsToReOpen.push({
                            sectionId: this.sectionModel.allocatedTo.sectionId,
                            sectionCode: this.sectionModel.allocatedTo.contractLabel,
                        });
                    }
                    this.reopenTrades(sectionsToReOpen);
                });
            } else {
                this.reopenTrades(sectionsToReOpen);
            }
        } else if (this.sectionModel.charterStatusId === CharterStatus.Closed) {
            this.dialog.open(ConfirmationDialogComponent, {
                data: {
                    title: 'Blocking - Reopen Trade',
                    text:
                        'Not allowed. Trade assigned to closed Charter ' +
                        this.sectionModel.assignedCharterReference +
                        '.',
                    okButton: 'Ok',
                },
            });
        }
    }

    private reopenTrades(sectionToReopen: any[]) {
        const sectionIdsToReopen = new Array();
        sectionToReopen.forEach((element) => {
            sectionIdsToReopen.push(element.sectionId);
        });
        this.subscriptions.push(
            this.tradingService
                .reOpenSection(sectionIdsToReopen, this.dataVersionId)
                .subscribe((ok) => {
                    if (ok) {
                        // REFACTO ? Same code as closeTrades function
                        const title =
                            sectionToReopen.length > 1
                                ? sectionToReopen[0].sectionCode +
                                ' and ' +
                                sectionToReopen[1].sectionCode +
                                ' are now reopend'
                                : sectionToReopen[0].sectionCode + ' is now reopened.';
                        const reopenInfoPopup = this.dialog.open(
                            ConfirmationDialogComponent,
                            {
                                data: {
                                    title: 'Trade Reopened',
                                    text: title,
                                    okButton: 'Ok',
                                },
                            },
                        );
                        reopenInfoPopup.afterClosed().subscribe((answer) => {
                            if (!this.dataVersionId) {
                                this.router.navigate([
                                    this.companyManager.getCurrentCompanyId() +
                                    '/trades/display/' +
                                    this.sectionId,
                                ]);
                            } else {
                                this.router.navigate([
                                    this.companyManager.getCurrentCompanyId() +
                                    '/trades/snapshot/' +
                                    this.dataVersionId +
                                    '/display/' +
                                    this.sectionId,
                                ]);
                            }
                        });
                    }
                }),
        );
    }

    onCloseApprovalBannerClicked() {
        this.isApprovalBannerDisplayed = false;
    }

    onGenerateButtonClicked() {
        this.tradeActionsService.contractAdviceSubject.next(
            this.sectionModel.sectionId,
        );
    }

    ngOnDestroy(): void {
        if (this.isEdit) {
            this.stopLockRefresh();
            this.lockService
                .unlockContract(this.sectionId, LockFunctionalContext.TradeEdit)
                .subscribe();
        }

        this.subscriptions.forEach((subscription: Subscription) => {
            subscription.unsubscribe();
        });
    }

    createSplitForDecreaseQuantity(
        tradeSplitCreationOnQuantityAdjust: boolean,
        alloatedTradeSplitCreationOnQuantityAdjust: boolean,
        allocationOfTrades: boolean,
    ) {
        const sectionIds: number[] = [];
        const contractedValues: string[] = [];
        const splitQuantity = this.originalQuantity - this.quantityTrafficSplit;

        if (tradeSplitCreationOnQuantityAdjust) {
            sectionIds.push(this.model.sectionId);
            contractedValues.push(
                this.setContractValue(this.sectionModel, splitQuantity),
            );
        }

        if (this.model.allocatedTo && alloatedTradeSplitCreationOnQuantityAdjust) {
            sectionIds.push(this.model.allocatedTo.sectionId);
            contractedValues.push(
                this.setContractValue(this.tragetSectionModel, splitQuantity),
            );
        }

        this.tradingService
            .createSplitForContract(
                sectionIds,
                splitQuantity,
                this.dataVersionId,
                contractedValues,
            )
            .subscribe((data) => {
                if (data) {
                    const splitResult = data as TrancheSplitCreationResult[];
                    if (splitResult.length > 0) {
                        // Section traffic update
                        if (this.sectionModel.charterId) {
                            const sectionTrafficList: SectionTraffic[] = [];
                            splitResult.forEach((element) => {
                                const sectionTraffic: SectionTraffic = new SectionTraffic();
                                sectionTraffic.sectionId = element.sectionId;
                                sectionTraffic.blDate = this.trafficTabComponent.blInfoComponent
                                    .blDateCtrl.value
                                    ? new Date(
                                        this.trafficTabComponent.blInfoComponent.blDateCtrl.value,
                                    )
                                    : null;
                                sectionTraffic.blReference = this.trafficTabComponent.blInfoComponent.blReferenceCtrl.value;
                                sectionTraffic.vesselCode = this.trafficTabComponent
                                    .shipmentInfoComponent.vesselCtrl.value
                                    ? this.trafficTabComponent.shipmentInfoComponent.vesselCtrl
                                        .value.vesselName
                                    : null;
                                sectionTraffic.shippingStatusCode = this.trafficTabComponent
                                    .shipmentInfoComponent.shippingStatusCtrl.value
                                    ? this.trafficTabComponent.shipmentInfoComponent.shippingStatus.find(
                                        (shipping) =>
                                            shipping.description ===
                                            this.trafficTabComponent.shipmentInfoComponent
                                                .shippingStatusCtrl.value,
                                    ).shippingStatusCode
                                    : null;

                                sectionTraffic.dataVersionId = this.dataVersionId;
                                sectionTrafficList.push(sectionTraffic);
                            });

                            // REFACTO : Assign section to charter should be done in API
                            this.subscriptions.push(
                                this.executionService
                                    .assignSectionsToCharter(
                                        this.sectionModel.charterId,
                                        sectionTrafficList,
                                    )
                                    .pipe(map(() => { }))
                                    .subscribe(),
                            );
                        }

                        // Section costs
                        const childSections: ChildSectionsToSplit[] = data.map(
                            (sectionCreated) =>
                                new ChildSectionsToSplit(
                                    sectionCreated.sectionId,
                                    splitQuantity,
                                ),
                        );
                        // REFACTO : split costs should be done in API
                        this.tradingService
                            .splitCostsForSection(this.model.sectionId, childSections)
                            .subscribe(() => { });

                        // Section allocated update
                        if (this.model.allocatedTo) {
                            // REFACTO : allocation should be done in API
                            if (allocationOfTrades) {
                                this.executionService
                                    .getAllocationBySectionId(
                                        this.model.sectionId,
                                        this.dataVersionId,
                                    )
                                    .subscribe((allocatedResult: Allocation) => {
                                        const allocateSectionModel: AllocateSection[] = [];
                                        const allocateSectionElement: AllocateSection = new AllocateSection();
                                        allocateSectionElement.sectionId = splitResult[0].sectionId;
                                        allocateSectionElement.allocatedSectionId =
                                            splitResult[1].sectionId;
                                        allocateSectionElement.quantity = splitQuantity;
                                        allocateSectionElement.shippingType =
                                            allocatedResult.transferShippingOptionId;
                                        allocateSectionElement.dataVersionId = this.dataVersionId;
                                        allocateSectionModel.push(allocateSectionElement);
                                        this.executionService
                                            .allocateSections(allocateSectionModel)
                                            .subscribe(() => {
                                                this.snackbarService.informationSnackBar(
                                                    splitResult[0].contractLabel +
                                                    ' and ' +
                                                    splitResult[1].contractLabel +
                                                    ' have been created and allocated ',
                                                );
                                            });
                                    });
                            } else if (splitResult.length > 1) {
                                const message =
                                    splitResult[0].contractLabel +
                                    ' and ' +
                                    splitResult[1].contractLabel +
                                    ' have been created without allocation ';
                                this.snackbarService.informationAndCopySnackBar(
                                    message,
                                    message,
                                );
                            } else {
                                this.snackbarService.informationAndCopySnackBar(
                                    splitResult[0].contractLabel + ' has been created ',
                                    splitResult[0].contractLabel,
                                );
                            }
                            this.tradeActionsService.displaySectionAfterEditSubject.next(
                                new SectionTabIndex(this.sectionId, this.selectedTab),
                            );
                        } else {
                            this.snackbarService.informationAndCopySnackBar(
                                splitResult[0].contractLabel + ' created not allocated',
                                splitResult[0].contractLabel,
                            );
                        }

                        this.tradeActionsService.displaySectionAfterEditSubject.next(
                            new SectionTabIndex(this.sectionId, this.selectedTab),
                        );
                    }
                }
            });
    }

    // --Trade Image
    onImageButtonClicked() {
        this.openTradeImageDialog();
    }

    // --Save Trade As Favourite
    onSaveAsFavoriteClicked() {
        this.openSaveAsFavouriteDialog();
    }

    openSaveAsFavouriteDialog() {
        const company = this.route.snapshot.paramMap.get('company');
        this.dialog.open(SaveAsFavouriteDialogComponent, {
            data: {
                title: this.sectionModel.contractLabel,
                sectionId: this.sectionId,
                companyId: company,
            },
            width: '50%',
        });
    }

    openTradeImageDialog(): void {
        const company = this.route.snapshot.paramMap.get('company');
        const parentSectionNumber =
            this.sectionModel.sectionNumber === '0000' ? true : false;
        const isAllocateContractDisabled =
            this.sectionModel.allocatedTo === null &&
                this.sectionModel.quantity !== 0 &&
                this.sectionModel.status !== ContractStatus.Unapproved
                ? false
                : true;
        const tradeImageDialog = this.dialog.open(TradeImageDialogComponent, {
            data: {
                title: this.sectionModel.contractLabel,
                type: ContractTypes[this.sectionModel.contractType],
                companyId: company,
                childContracts: this.childSectionsSearchResult.filter(
                    (val) => val.sectionOriginId === this.sectionModel.sectionId,
                ).length,
                parentTrade: parentSectionNumber,
                isAllocateContractDisabled,
                childContractDetails: this.sectionModel.childSections,
                isCancelledTrade: this.sectionModel.isCancelled,
            },
            width: '700px',
        });

        this.subscriptions.push(
            tradeImageDialog.afterClosed().subscribe((result: TradeImage) => {
                if (result !== undefined) {
                    this.subscriptions.push(
                        this.tradingService
                            .getSection(this.sectionId, PricingMethods.Priced)
                            .subscribe((data: Section) => {
                                this.formComponents.forEach((comp) => {
                                    comp.initForm(data, this.isEdit);
                                });
                            }),
                    );
                    if (result.numberOfContracts > 1) {
                        this.router.navigate(
                            [
                                this.companyManager.getCurrentCompanyId() + '/trades/image',
                                this.sectionModel.sectionId,
                                result.numberOfContracts,
                            ],
                            {
                                queryParams: {
                                    numberOfContract: result.numberOfContracts,
                                    type: result.type,
                                    splitAndTranche: result.trancheAndSplit,
                                    imageEstimates: result.imageEstimates,
                                    costMatrixId: result.costMatrixId,
                                    //tradeImageDetails: JSON.stringify(result.tradeImageField),
                                    allocateContract: result.allocateContract,
                                },
                                skipLocationChange: true,
                            },
                        );
                    } else {
                        this.router.navigate(
                            [
                                this.companyManager.getCurrentCompanyId() + '/trades/image',
                                this.sectionModel.sectionId,
                            ],
                            {
                                queryParams: {
                                    numberOfContract: result.numberOfContracts,
                                    type: result.type,
                                    splitAndTranche: result.trancheAndSplit,
                                    imageEstimates: result.imageEstimates,
                                    costMatrixId: result.costMatrixId,
                                    //tradeImageDetails: JSON.stringify(result.tradeImageField),
                                    allocateContract: result.allocateContract,
                                },
                                skipLocationChange: true,
                            },
                        );
                    }
                }
            }),
        );
    }

    updateAllocatedTradeQuantity() {
        // REFACTO : Should be done in API
        if (this.model.allocatedTo) {
            const allocatedSectionId = this.model.allocatedTo.sectionId;
            let allocatedSectionModel: PhysicalFixedPricedContract;
            this.tradingService
                .getSection(allocatedSectionId, 0, this.dataVersionId)
                .subscribe((data) => {
                    this.tradingService
                        .getChildSections(allocatedSectionId, this.dataVersionId)
                        .subscribe((childSections: ChildSectionsSearchResult[]) => {
                            this.childSectionsSearchResult = childSections;
                            data.childSections = childSections.map((childSectionResult) => {
                                const childSection = new Section();
                                childSection.setSectionFromChildSectionsSearchResult(
                                    childSectionResult,
                                    this.sectionModel.sectionId,
                                );
                                return childSection;
                            });
                            allocatedSectionModel = this.convertToPhysicalFixedPricedContract(
                                data,
                            );
                            this.tradingService
                                .updatePhysicalContract(data.contractId, allocatedSectionModel)
                                .subscribe(() => {
                                    this.tradingService
                                        .unapproveSection(allocatedSectionId)
                                        .subscribe((ok) => {
                                            if (ok) {
                                                if (this.dataVersionId) {
                                                    this.tradeActionsService.displaySectionInSnapshotSubject.next(
                                                        new SectionReference(
                                                            this.sectionId,
                                                            this.dataVersionId,
                                                        ),
                                                    );
                                                } else {
                                                    this.tradeActionsService.displaySectionAfterEditSubject.next(
                                                        new SectionTabIndex(
                                                            this.sectionId,
                                                            this.selectedTab,
                                                        ),
                                                    );
                                                }
                                                this.snackbarService.informationSnackBar(
                                                    this.sectionModel.contractLabel +
                                                    ' quantity has been adjusted. ' +
                                                    data.contractLabel +
                                                    ' quantity has been adjusted.',
                                                );
                                            }
                                        });
                                });
                        });
                });
        }
    }

    convertToPhysicalFixedPricedContract(
        section: Section,
    ): PhysicalFixedPricedContract {
        let physicalFixedPricedContract = new PhysicalFixedPricedContract();
        this.formComponents.forEach((comp) => {
            comp.initForm(section, this.isEdit);
        });
        this.formComponents.forEach((comp) => {
            physicalFixedPricedContract = comp.populateEntity(
                physicalFixedPricedContract,
            );
        });
        physicalFixedPricedContract.previousQuantity = section.quantity;
        physicalFixedPricedContract.quantity = this.isWeightConvertedForSplit
            ? section.quantity.toString()
            : this.quantityTrafficSplit.toString();
        physicalFixedPricedContract.originalQuantity = this.quantityTrafficSplit;
        physicalFixedPricedContract.sectionId = section.sectionId;
        physicalFixedPricedContract.dataVersionId = this.dataVersionId;
        return physicalFixedPricedContract;
    }

    onCancelButtonClicked() {
        this.isSave = true;
        this.lockService
            .unlockContract(this.sectionId, LockFunctionalContext.TradeEdit)
            .subscribe();
        this.location.back();
    }

    setCashMatchDate(cashMatchDate: any) {
        if (cashMatchDate) {
            cashMatchDate = this.formatDate.transform(cashMatchDate);
            this.statusTabComponent.cashAgainstInvoiceComponent.hasEmptyState = false;
            this.statusTabComponent.cashAgainstInvoiceComponent.cashMatchDateCtrl.patchValue(
                cashMatchDate,
            );
        }
    }
    onBlDateUpdated(blUpdatedDate) {
        this.statusTabComponent.charterComponent.setBlDate(blUpdatedDate);
    }

    onSplitTranchesSideNavOpenedChanged(event) {
        const lockFunctionalContext = this.getLockFunctionalContext();
        if (this.sideNavOpened) {
            this.subscriptions.push(
                this.lockService
                    .lockContract(this.sectionModel.sectionId, lockFunctionalContext)
                    .subscribe(
                        () => {
                            this.startLockRefresh();
                        },
                        (err) => {
                            const confirmDialog = this.dialog.open(
                                ConfirmationDialogComponent,
                                {
                                    data: {
                                        title: 'Lock',
                                        text: err.error.detail,
                                        okButton: 'Got it',
                                    },
                                },
                            );
                            this.tradeActionsService.displaySectionAfterEditSubject.next(
                                new SectionTabIndex(this.sectionId, this.selectedTab),
                            );
                        },
                    ),
            );
        } else if (!this.isEdit) {
            this.stopLockRefresh();
            this.subscriptions.push(
                this.lockService
                    .unlockContract(this.sectionModel.sectionId, lockFunctionalContext)
                    .subscribe(),
            );
        }
    }

    getLockFunctionalContext(): LockFunctionalContext {
        let lockFunctionalContext = LockFunctionalContext.TradeTranche;
        if (this.sideNavScreen === SectionTypes.Split) {
            lockFunctionalContext = LockFunctionalContext.TradeSplit;
        }
        return lockFunctionalContext;
    }

    startLockRefresh() {
        this.resourcesInformation = new Array<LockResourceInformation>();
        const resourceInformation = new LockResourceInformation();
        resourceInformation.resourceType = 'Contract';
        resourceInformation.resourceId = this.sectionId;
        resourceInformation.resourceCode = this.contractLabel;
        resourceInformation.needRefresh = true;
        this.resourcesInformation.push(resourceInformation);
    }

    stopLockRefresh() {
        this.resourcesInformation = new Array<LockResourceInformation>();
    }
    onTotalInvoiceValue(model: any) {
        this.totalInvoiceValuePercent = 0;
        this.totalInvoiceValuePercent = model.totalInvoiceValuePercent;
    }

    changeStatusForAllocatedContract(allocatedSectionId: number) {
        this.subscriptions.push(
            this.tradingService.unapproveSection(allocatedSectionId).subscribe(
                (data) => { },
                (error) => {
                    console.error(error);
                },
            ),
        );
    }
    zeroCosRowWarning(model: any) {
        this.isZeroCostRow = model.isZeroRowExist;
    }

    onShowDiscard() {
        this.isSave = true;
        this.location.back();
    }

    onShowSave() {
        this.save();
    }

    onDiscardButtonClicked() {
        this.onShowDiscard();
    }

    onTotalValuesCalculated(model: any) {
        this.statusTabComponent.totalValuesCalculated(model);
    }

    // -- Comment A001
    // To initialize this component and have the actions proposed to the user, we need to understand which mode the user is in
    // Creation / Edition-> Save; Cancel
    // View Mode -> Edit, Previous
    // The mode in which the user is in is set IN SPECIFIC PLACES IN THE CODE.
    // This method can only be called AFTER THE MODE HAS BEEN SET
    initFABActions() {
        this.fabTitle = 'Trade Add/Edit FAB mini';
        this.fabType = FABType.MiniFAB;

        const actionItemSave: FloatingActionButtonActions = {
            icon: 'save',
            text: 'Save',
            action: 'save',
            disabled: false,
            index: 2,
        };
        const actionItemCancel: FloatingActionButtonActions = {
            icon: 'keyboard_backspace',
            text: 'Cancel',
            action: 'cancel',
            disabled: false,
            index: 3,
        };

        const actionItemEdit: FloatingActionButtonActions = {
            icon: 'edit',
            text: 'Edit Trade',
            action: 'editTrade',
            index: 0,
            disabled: this.isClosed ? true : false,
        };

        const actionItemCreate: FloatingActionButtonActions = {
            icon: 'add',
            text: 'Create Trade',
            action: 'createTrade',
            index: 1,
            disabled: false,
        };

        if (this.isShow && !this.isEdit) {
            const createTradePrivilegeLevel = this.authorizationService.getPermissionLevel(
                this.company,
                this.createTradeActionPrivilege.privilegeName,
                this.createTradeActionPrivilege.privilegeParentLevelOne,
                this.createTradeActionPrivilege.privilegeParentLevelTwo,
            );

            const hasCreateTradePrivilege =
                createTradePrivilegeLevel >= this.createTradeActionPrivilege.permission;
            if (hasCreateTradePrivilege) {
                this.fabMenuActions.push(actionItemCreate);
            }

            const editTradePrivilegeLevel = this.authorizationService.getPermissionLevel(
                this.company,
                this.editTradeActionPrivilege.privilegeName,
                this.editTradeActionPrivilege.privilegeParentLevelOne,
                this.editTradeActionPrivilege.privilegeParentLevelTwo,
            );

            const hasEditTradePrivilege =
                editTradePrivilegeLevel >= this.editTradeActionPrivilege.permission;
            if (hasEditTradePrivilege) {
                this.fabMenuActions.push(actionItemEdit);
            }
        } else {
            this.fabMenuActions.push(actionItemCancel);
            actionItemSave.disabled = this.isSaveActionDisabled;
            this.fabMenuActions.push(actionItemSave);
        }
    }

    onFabActionClicked(action: string) {
        switch (action) {
            case 'save': {
                this.onSaveButtonClicked();
                break;
            }
            case 'cancel': {
                this.onCancelButtonClicked();
                break;
            }
            case 'createTrade': {
                this.onNewTradeButtonClicked();
                break;
            }
            case 'editTrade': {
                this.onEditTradeButtonClicked();
                break;
            }
        }
    }

    onNewTradeButtonClicked() {
        if (this.dataVersionId) {
            this.tradeActionsService.newTradeInSnapshotSubject.next(
                this.dataVersionId,
            );
        } else {
            this.tradeActionsService.newTradeSubject.next();
        }
    }

    onEditTradeButtonClicked() {
        this.subscriptions.push(
            this.lockService
                .isLockedContract(this.sectionId)
                .subscribe((lock: IsLocked) => {
                    if (lock.isLocked) {
                        this.dialog.open(ConfirmationDialogComponent, {
                            data: {
                                title: 'Lock',
                                text: lock.message,
                                okButton: 'Got it',
                            },
                        });
                    } else {
                        if (this.dataVersionId) {
                            const sectionInformation = new SectionReference(
                                this.sectionId,
                                this.dataVersionId,
                                this.selectedTab,
                            );
                            this.tradeActionsService.editSectionInSnapshotSubject.next(
                                sectionInformation,
                            );
                        } else {
                            const sectionInformation = new SectionTabIndex(
                                this.sectionId,
                                this.selectedTab,
                            );
                            this.tradeActionsService.editSectionSubject.next(
                                sectionInformation,
                            );
                        }
                    }
                }),
        );
    }

    updatePhysicalContract() {
        let tradeSplitCreationOnQuantityAdjust: boolean = false;
        let adjustAllocatedTradeQuantityAdjusted = false;
        let currentTradeQuantityAdjusted = false;
        let alloatedTradeSplitCreationOnQuantityAdjust: boolean = false;
        let isSplitCreated: boolean = false;
        let allocationOfTrades = false;
        this.subscriptions.push(
            this.lockService
                .validateContractOperation(
                    LockFunctionalContext.TradeEdit,
                    this.sectionModel.sectionId,
                    this.model.allocatedTo,
                )
                .subscribe((lockErrors) => {
                    if (lockErrors != null && lockErrors !== '') {
                        this.saveInProgress = false;
                        this.snackbarService.informationSnackBar(lockErrors);
                        return;
                    } else {
                        this.model.sectionId = this.sectionId;
                        this.model.invoiceReference = this.sectionModel.invoiceReference;
                        if (this.trafficTabQuantity) {
                            this.model.quantity = this.trafficTabQuantity.toString();
                        }
                        if (this.isEdit) {
                            this.sectionTrafficModel = new SectionTraffic();
                            this.sectionTrafficModel.sectionId = this.sectionId;
                            this.sectionTrafficModel.contractDate = this.model.contractDate;
                            this.sectionTrafficModel.blDate = this.trafficTabComponent.blInfoComponent.blDateCtrl.value;
                            this.sectionTrafficModel.blReference = this.trafficTabComponent.blInfoComponent.blReferenceCtrl.value;
                            const selectedVessel: Vessel = this.trafficTabComponent
                                .shipmentInfoComponent.vesselCtrl.value;
                            this.sectionTrafficModel.vesselCode = selectedVessel
                                ? selectedVessel.vesselName
                                : null;
                            this.sectionTrafficModel.shippingStatusCode = this
                                .trafficTabComponent.shipmentInfoComponent.shippingStatusCtrl
                                .value
                                ? this.trafficTabComponent.shipmentInfoComponent.shippingStatus.find(
                                    (shipping) =>
                                        shipping.description ===
                                        this.trafficTabComponent.shipmentInfoComponent
                                            .shippingStatusCtrl.value,
                                ).shippingStatusCode
                                : null;
                            this.model.previousQuantity = this.sectionModel.quantity;

                            if (
                                this.originalQuantity !== Number(this.model.quantity) &&
                                (this.model.type === ContractTypes.Purchase ||
                                    this.sectionModel.contractType === ContractTypes.Sale)
                            ) {
                                if (!this.model.allocatedTo) {
                                    if (
                                        this.model.currentTradeOptionId ===
                                        CurrentTradeOption.CreateUnallocatedResidualSplit
                                    ) {
                                        tradeSplitCreationOnQuantityAdjust = true;
                                        this.model.quantity = this.originalQuantity.toString();
                                    } else if (
                                        this.model.currentTradeOptionId ===
                                        CurrentTradeOption.AdjustContract
                                    ) {
                                        currentTradeQuantityAdjusted = true;
                                        adjustAllocatedTradeQuantityAdjusted = false;
                                        this.model.contractedValue = this.getContractValue(
                                            this.sectionModel,
                                            Number(this.model.quantity),
                                        );
                                    }
                                } else {
                                    switch (this.model.currentTradeOptionId) {
                                        case CurrentTradeOption.AdjustContract:
                                            if (
                                                this.model.allocateTradeOptionId ===
                                                AllocateTradeOption.AdjustAllocation
                                            ) {
                                                currentTradeQuantityAdjusted = true;
                                                adjustAllocatedTradeQuantityAdjusted = true;
                                                this.model.contractedValue = this.getContractValue(
                                                    this.sectionModel,
                                                    Number(this.model.quantity),
                                                );
                                            } else if (
                                                this.model.allocateTradeOptionId ===
                                                AllocateTradeOption.CreateUnallocatedResidualSplit
                                            ) {
                                                currentTradeQuantityAdjusted = true;
                                                alloatedTradeSplitCreationOnQuantityAdjust = true;
                                            }
                                            break;
                                        case CurrentTradeOption.CreateAllocatedResidualSplit:
                                            if (
                                                this.model.allocateTradeOptionId ===
                                                AllocateTradeOption.LeaveStatus
                                            ) {
                                                tradeSplitCreationOnQuantityAdjust = true;
                                                alloatedTradeSplitCreationOnQuantityAdjust = true;
                                                allocationOfTrades = true;
                                                this.model.quantity = this.originalQuantity.toString();
                                            }
                                            break;
                                        case CurrentTradeOption.CreateUnallocatedResidualSplit:
                                            if (
                                                this.model.allocateTradeOptionId ===
                                                AllocateTradeOption.CreateUnallocatedResidualSplit
                                            ) {
                                                tradeSplitCreationOnQuantityAdjust = true;
                                                alloatedTradeSplitCreationOnQuantityAdjust = true;
                                                this.model.quantity = this.originalQuantity.toString();
                                            } else if (
                                                this.model.allocateTradeOptionId ===
                                                AllocateTradeOption.AdjustAllocation
                                            ) {
                                                tradeSplitCreationOnQuantityAdjust = true;
                                                adjustAllocatedTradeQuantityAdjusted = true;
                                                this.model.quantity = this.originalQuantity.toString();
                                            }
                                            break;
                                    }
                                }
                            }

                            this.invoiceMarking = this.model.invoices;
                            this.invoiceStatusId = this.model.invoiceStatus;
                            this.model.dataVersionId = this.dataVersionId;
                            this.sectionTrafficModel.dataVersionId = this.dataVersionId;
                            isSplitCreated =
                                tradeSplitCreationOnQuantityAdjust ||
                                alloatedTradeSplitCreationOnQuantityAdjust;

                            const selectedCounterparty = this.mainTabComponent
                                .counterpartyComponent.selectedCounterparty;
                            if (selectedCounterparty) {
                                this.companyManager
                                    .getConfiguration(selectedCounterparty.counterpartyID)
                                    .subscribe((data) => {
                                        if (data.length > 0 && data[0].isCounterpartyGroupAccount) {
                                            this.intercoModelForEdit(
                                                isSplitCreated,
                                                currentTradeQuantityAdjusted,
                                                adjustAllocatedTradeQuantityAdjusted,
                                                tradeSplitCreationOnQuantityAdjust,
                                                alloatedTradeSplitCreationOnQuantityAdjust,
                                                allocationOfTrades,
                                                data,
                                            );
                                        } else {
                                            this.updateContractDetails(
                                                isSplitCreated,
                                                currentTradeQuantityAdjusted,
                                                adjustAllocatedTradeQuantityAdjusted,
                                                tradeSplitCreationOnQuantityAdjust,
                                                alloatedTradeSplitCreationOnQuantityAdjust,
                                                allocationOfTrades,
                                            );
                                        }
                                    });
                            } else {
                                this.updateContractDetails(
                                    isSplitCreated,
                                    currentTradeQuantityAdjusted,
                                    adjustAllocatedTradeQuantityAdjusted,
                                    tradeSplitCreationOnQuantityAdjust,
                                    alloatedTradeSplitCreationOnQuantityAdjust,
                                    allocationOfTrades,
                                );
                            }
                        } else {
                            this.model.dataVersionId = this.dataVersionId;
                            this.subscriptions.push(
                                this.tradingService
                                    .updatePhysicalContract(this.contractId, this.model)
                                    .subscribe(
                                        (res) => {
                                            const result = res[0];

                                            let messageText =
                                                'Contract updated with reference: ' +
                                                this.contractLabel;
                                            let copyText = this.contractLabel;
                                            if (result && result[0] && result[0].contractLabel) {
                                                messageText =
                                                    messageText +
                                                    ', Interco Contract created with reference: ' +
                                                    result[0].contractLabel;
                                                copyText = copyText + result[0].contractLabel;
                                            }
                                            this.snackbarService.informationAndCopySnackBar(
                                                messageText,
                                                copyText,
                                            );

                                            if (this.dataVersionId) {
                                                this.tradeActionsService.displaySectionInSnapshotSubject.next(
                                                    new SectionReference(
                                                        this.sectionId,
                                                        this.dataVersionId,
                                                    ),
                                                );
                                            } else {
                                                this.tradeActionsService.displaySectionAfterEditSubject.next(
                                                    new SectionTabIndex(this.sectionId, this.selectedTab),
                                                );
                                            }
                                            this.subscriptions.push(
                                                this.lockService
                                                    .unlockContract(
                                                        this.sectionModel.sectionId,
                                                        LockFunctionalContext.TradeEdit,
                                                    )
                                                    .subscribe(),
                                            );
                                        },
                                        (err) => {
                                            this.saveInProgress = false;
                                            throw err;
                                        },
                                    ),
                            );
                        }
                    }
                }),
        );
    }

    updateContractDetails(
        isSplitCreated,
        currentTradeQuantityAdjusted,
        adjustAllocatedTradeQuantityAdjusted,
        tradeSplitCreationOnQuantityAdjust,
        alloatedTradeSplitCreationOnQuantityAdjust,
        allocationOfTrades,
    ) {
        const updates = [
            this.tradingService.updatePhysicalContract(
                this.contractId,
                this.model,
                isSplitCreated,
            ),
            this.executionService.updateSectionTraffic(this.sectionTrafficModel),
            this.executionService.updateInvoiceMarkingDetails(
                this.sectionModel.sectionId,
                this.invoiceMarking,
                this.invoiceStatusId,
                this.dataVersionId,
            ),
        ];
        this.subscriptions.push(
            forkJoin(updates).subscribe(
                (res) => {
                    const result = res[0];
                    if (currentTradeQuantityAdjusted && !this.dataVersionId) {
                        this.subscriptions.push(
                            this.tradingService
                                .unapproveSection(this.sectionModel.sectionId)
                                .subscribe((ok) => {
                                    if (ok) {
                                        this.sectionModel.status = ContractStatus.Unapproved;
                                        this.headerComponent.contractStatusChanged(
                                            ContractStatus.Unapproved,
                                        );
                                        if (this.sectionModel.allocatedToId && !isSplitCreated) {
                                            this.changeStatusForAllocatedContract(
                                                this.sectionModel.allocatedToId,
                                            );
                                        }
                                    }
                                }),
                        );
                    }
                    if (
                        this.originalQuantity !== Number(this.model.quantity) &&
                        (this.model.type === ContractTypes.Purchase ||
                            this.sectionModel.contractType === ContractTypes.Sale)
                    ) {
                        if (!adjustAllocatedTradeQuantityAdjusted) {
                            this.snackbarService.informationAndCopySnackBar(
                                this.sectionModel.contractLabel +
                                ' quantity has been adjusted.',
                                this.sectionModel.contractLabel,
                            );
                        }
                    } else {
                        let messageText =
                            'Contract updated with reference: ' + this.contractLabel;
                        let copyText = this.contractLabel;
                        if (result && result[0] && result[0].contractLabel) {
                            messageText =
                                messageText +
                                ', Interco Contract created with reference: ' +
                                result[0].contractLabel;
                            copyText = copyText + result[0].contractLabel;
                        }
                        this.snackbarService.informationAndCopySnackBar(
                            messageText,
                            copyText,
                        );
                    }
                    if (adjustAllocatedTradeQuantityAdjusted) {
                        this.updateAllocatedTradeQuantity();
                        if (
                            tradeSplitCreationOnQuantityAdjust ||
                            alloatedTradeSplitCreationOnQuantityAdjust
                        ) {
                            this.createSplitForDecreaseQuantity(
                                tradeSplitCreationOnQuantityAdjust,
                                alloatedTradeSplitCreationOnQuantityAdjust,
                                allocationOfTrades,
                            );
                        }
                    } else if (
                        tradeSplitCreationOnQuantityAdjust ||
                        alloatedTradeSplitCreationOnQuantityAdjust
                    ) {
                        if (this.model.allocatedTo && !isSplitCreated) {
                            this.changeStatusForAllocatedContract(
                                this.model.allocatedTo.sectionId,
                            );
                        }
                        this.createSplitForDecreaseQuantity(
                            tradeSplitCreationOnQuantityAdjust,
                            alloatedTradeSplitCreationOnQuantityAdjust,
                            allocationOfTrades,
                        );
                    } else {
                        if (this.dataVersionId) {
                            this.tradeActionsService.displaySectionInSnapshotSubject.next(
                                new SectionReference(this.sectionId, this.dataVersionId),
                            );
                        } else {
                            this.tradeActionsService.displaySectionAfterEditSubject.next(
                                new SectionTabIndex(this.sectionId, this.selectedTab),
                            );
                        }
                    }
                    this.subscriptions.push(
                        this.lockService
                            .unlockContract(
                                this.sectionModel.sectionId,
                                LockFunctionalContext.TradeEdit,
                            )
                            .subscribe(),
                    );
                },
                (err) => {
                    this.saveInProgress = false;
                    throw err;
                },
            ),
        );
    }

    intercoModel(companies) {
        this.populateIntercoFields(this.model);
        const confirmDialog = this.dialog.open(IntercoTradeDialogComponent, {
            width: '45%',
            maxHeight: '750px',
            data: {
                counterpartyCompanies: companies,
                intercoValidation: this.intercoValidation,
            },
        });
        const confirmationSubscription = confirmDialog
            .afterClosed()
            .subscribe((intercoData) => {
                if (intercoData && intercoData.isInterco && !intercoData.isCancelled) {
                    this.isInterco = true;
                    this.model.isInterco = this.isInterco;
                    this.model.intercoCompanyId = intercoData.companyId;
                    this.model.intercoDepartmentId = intercoData.departmentId;
                    this.model.intercoTraderId = intercoData.traderId;
                    this.createTrade();
                } else if (
                    intercoData &&
                    !intercoData.isInterco &&
                    !intercoData.isCancelled
                ) {
                    this.createTrade();
                } else {
                    this.saveInProgress = false;
                }
            });
        this.subscriptions.push(confirmationSubscription);
    }

    intercoModelForEdit(
        isSplitCreated,
        currentTradeQuantityAdjusted,
        adjustAllocatedTradeQuantityAdjusted,
        tradeSplitCreationOnQuantityAdjust,
        alloatedTradeSplitCreationOnQuantityAdjust,
        allocationOfTrades,
        companies,
    ) {
        if (
            !this.sectionModel.isInterCo &&
            this.sectionModel.invoicingStatusId === InvoicingStatus.Uninvoiced &&
            !this.sectionModel.sectionOriginId
        ) {
            this.populateIntercoFields(this.model);
            const confirmDialog = this.dialog.open(IntercoTradeDialogComponent, {
                width: '45%',
                maxHeight: '750px',
                data: {
                    counterpartyCompanies: companies,
                    intercoValidation: this.intercoValidation,
                },
            });

            const confirmationSubscription = confirmDialog
                .afterClosed()
                .subscribe((intercoData) => {
                    if (
                        intercoData &&
                        intercoData.isInterco &&
                        !intercoData.isCancelled
                    ) {
                        this.isInterco = true;
                        this.model.isInterco = this.isInterco;
                        this.model.intercoCompanyId = intercoData.companyId;
                        this.model.intercoDepartmentId = intercoData.departmentId;
                        this.model.intercoTraderId = intercoData.traderId;

                        this.updateContractDetails(
                            isSplitCreated,
                            currentTradeQuantityAdjusted,
                            adjustAllocatedTradeQuantityAdjusted,
                            tradeSplitCreationOnQuantityAdjust,
                            alloatedTradeSplitCreationOnQuantityAdjust,
                            allocationOfTrades,
                        );
                    } else if (
                        intercoData &&
                        !intercoData.isInterco &&
                        !intercoData.isCancelled
                    ) {
                        this.updateContractDetails(
                            isSplitCreated,
                            currentTradeQuantityAdjusted,
                            adjustAllocatedTradeQuantityAdjusted,
                            tradeSplitCreationOnQuantityAdjust,
                            alloatedTradeSplitCreationOnQuantityAdjust,
                            allocationOfTrades,
                        );
                    } else {
                        this.saveInProgress = false;
                    }
                });
            this.subscriptions.push(confirmationSubscription);
        } else {
            this.updateContractDetails(
                isSplitCreated,
                currentTradeQuantityAdjusted,
                adjustAllocatedTradeQuantityAdjusted,
                tradeSplitCreationOnQuantityAdjust,
                alloatedTradeSplitCreationOnQuantityAdjust,
                allocationOfTrades,
            );
        }
    }

    onManualIntercoCreation(event: any) {
        if (event) {
            const selectedCounterparty = this.mainTabComponent.counterpartyComponent
                .selectedCounterparty;
            this.companyManager
                .getConfiguration(selectedCounterparty.counterpartyID)
                .subscribe((data) => {
                    if (data.length > 0 && data[0].isCounterpartyGroupAccount) {
                        this.populateIntercoFieldsForDetails(this.sectionModel);
                        const confirmDialog = this.dialog.open(
                            IntercoTradeDialogComponent,
                            {
                                width: '45%',
                                maxHeight: '750px',
                                data: {
                                    counterpartyCompanies: data,
                                    intercoValidation: this.intercoValidation,
                                },
                            },
                        );

                        const confirmationSubscription = confirmDialog
                            .afterClosed()
                            .subscribe((intercoData) => {
                                if (
                                    intercoData &&
                                    intercoData.isInterco &&
                                    !intercoData.isCancelled
                                ) {
                                    this.isInterco = true;
                                    const intercoModel = {
                                        isInterco: this.isInterco,
                                        intercoCompanyId: intercoData.companyId,
                                        intercoDepartmentId: intercoData.departmentId,
                                        intercoTraderId: intercoData.traderId,
                                        sectionId: this.sectionModel.sectionId,
                                        dataVersionId: this.sectionModel.dataVersionId,
                                    };
                                    this.createIntercoContract(intercoModel);
                                }
                            });
                        this.subscriptions.push(confirmationSubscription);
                    }
                });
        }
    }

    createIntercoContract(intercoModel: any) {
        this.tradingService.createManualInterco(intercoModel).subscribe(
            (data) => {
                const messageText =
                    'Interco Contract created with reference: ' +
                    intercoModel.intercoCompanyId +
                    '/' +
                    data[0]['contractLabel'];
                const copyText = data[0]['contractLabel'];
                this.snackbarService.informationAndCopySnackBar(messageText, copyText);

                data[0]['sectionId'] = intercoModel.sectionId;
                this.tradeActionsService.displaySectionSubject.next(
                    data[0]['sectionId'],
                );
            },
            (err) => {
                this.saveInProgress = false;
                throw err;
            },
        );
    }

    populateIntercoFields(model: PhysicalFixedPricedContract) {
        this.intercoValidation = new IntercoValidation();
        this.intercoValidation.companyId = this.company;

        this.intercoValidation.intercoFields = [];
        // REFACTO : Find a better why to do (solution without warning)
        this.intercoValidation.intercoFields.push({
            groupId: 1,
            type: 'section',
            name: 'CommodityId',
            value: model.commodityId ? model.commodityId.toString() : null,
        } as IntercoField);
        this.intercoValidation.intercoFields.push({
            groupId: 1,
            type: 'section',
            name: 'ContractTermId',
            value: model.contractTerms,
        } as IntercoField);
        this.intercoValidation.intercoFields.push({
            groupId: 1,
            type: 'section',
            name: 'CurrencyCode',
            value: model.currencyCode,
        } as IntercoField);
        this.intercoValidation.intercoFields.push({
            groupId: 1,
            type: 'section',
            name: 'PaymentTermId',
            value: model.paymentTerms,
        } as IntercoField);
        this.intercoValidation.intercoFields.push({
            groupId: 1,
            type: 'section',
            name: 'PeriodTypeId',
            value: model.periodTypeId ? model.periodTypeId.toString() : null,
        } as IntercoField);
        this.intercoValidation.intercoFields.push({
            groupId: 1,
            type: 'section',
            name: 'Price',
            value: model.price ? model.price.toString() : null,
        } as IntercoField);
        this.intercoValidation.intercoFields.push({
            groupId: 1,
            type: 'section',
            name: 'WeightUnitId',
            value: model.weightUnitId ? model.weightUnitId.toString() : null,
        } as IntercoField);
        this.intercoValidation.intercoFields.push({
            groupId: 1,
            type: 'section',
            name: 'PriceUnitId',
            value: model.priceUnitId ? model.priceUnitId.toString() : null,
        } as IntercoField);

        let groupId = 2;
        const selectedCounterparty = this.mainTabComponent.counterpartyComponent
            .selectedCounterparty;
        const costs = model.costs.filter(
            (c) => c.supplierCode === selectedCounterparty.counterpartyCode,
        );
        if (costs && costs.length > 0) {
            costs.forEach((cost) => {
                this.intercoValidation.intercoFields.push({
                    groupId,
                    type: 'cost',
                    name: 'CostTypeCode',
                    mappingName: 'costTypeCode',
                    value: cost.costTypeCode ? cost.costTypeCode.toString() : null,
                } as IntercoField);
                this.intercoValidation.intercoFields.push({
                    groupId,
                    type: 'cost',
                    name: 'CurrencyCode',
                    value: cost.currencyCode,
                } as IntercoField);
                groupId++;
            });
        }
    }

    populateIntercoFieldsForDetails(model: Section) {
        this.intercoValidation = new IntercoValidation();
        this.intercoValidation.companyId = this.company;

        this.intercoValidation.intercoFields = [];
        this.intercoValidation.intercoFields.push({
            groupId: 1,
            type: 'section',
            name: 'CommodityId',
            value: model.commodityId ? model.commodityId.toString() : null,
        } as IntercoField);
        this.intercoValidation.intercoFields.push({
            groupId: 1,
            type: 'section',
            name: 'ContractTermId',
            value: model.contractTerms,
        } as IntercoField);
        this.intercoValidation.intercoFields.push({
            groupId: 1,
            type: 'section',
            name: 'CurrencyCode',
            value: model.currencyCode,
        } as IntercoField);
        this.intercoValidation.intercoFields.push({
            groupId: 1,
            type: 'section',
            name: 'PaymentTermId',
            value: model.paymentTerms,
        } as IntercoField);
        this.intercoValidation.intercoFields.push({
            groupId: 1,
            type: 'section',
            name: 'PeriodTypeId',
            value: model.periodTypeId ? model.periodTypeId.toString() : null,
        } as IntercoField);
        this.intercoValidation.intercoFields.push({
            groupId: 1,
            type: 'section',
            name: 'Price',
            value: model.price ? model.price.toString() : null,
        } as IntercoField);
        this.intercoValidation.intercoFields.push({
            groupId: 1,
            type: 'section',
            name: 'WeightUnitId',
            value: model.weightUnitId ? model.weightUnitId.toString() : '',
        } as IntercoField);
        this.intercoValidation.intercoFields.push({
            groupId: 1,
            type: 'section',
            name: 'PriceUnitId',
            value: model.priceUnitId ? model.priceUnitId.toString() : null,
        } as IntercoField);

        let groupId = 2;
        const selectedCounterparty = this.mainTabComponent.counterpartyComponent
            .selectedCounterparty;
        const costs = model.costs.filter(
            (c) => c.supplierCode === selectedCounterparty.counterpartyCode,
        );
        if (costs && costs.length > 0) {
            costs.forEach((cost) => {
                this.intercoValidation.intercoFields.push({
                    groupId,
                    type: 'cost',
                    name: 'CostTypeCode',
                    mappingName: 'costTypeCode',
                    value: cost.costTypeCode ? cost.costTypeCode.toString() : null,
                } as IntercoField);
                this.intercoValidation.intercoFields.push({
                    groupId,
                    type: 'cost',
                    name: 'CurrencyCode',
                    value: cost.currencyCode,
                } as IntercoField);
                groupId++;
            });
        }
    }

    checkIntercoTrade(sectionModel: Section) {
        if (sectionModel.isInterCo) {
            this.intercoCounterParty =
                sectionModel.contractType === ContractTypes.Purchase
                    ? sectionModel.sellerCode
                    : sectionModel.buyerCode;
        }
    }

    checkIfIntercoCounterpartyChanged(model: PhysicalFixedPricedContract) {
        if (this.intercoCounterParty && this.isEdit && !this.isTradeImage) {
            const newCounterparty =
                model.type === ContractTypes.Purchase
                    ? model.sellerCode
                    : model.buyerCode;
            if (this.intercoCounterParty !== newCounterparty) {
                const confirmDialog = this.dialog.open(ConfirmationDialogComponent, {
                    data: {
                        title: 'Interco Contract',
                        text:
                            'This is an interco contract. If you proceed, it would no longer be an interco contract.',
                        okButton: 'Continue',
                        cancelButton: 'Cancel',
                    },
                });
                confirmDialog.afterClosed().subscribe((answer) => {
                    if (answer) {
                        this.model.isInterco = true;
                        this.model.isRemoveInterco = true;

                        this.sectionModel.isInterCo = true;
                        this.sectionModel.isRemoveInterco = true;
                        this.saveTrade();
                    } else {
                        this.saveInProgress = false;
                    }
                });
            } else {
                this.saveTrade();
            }
        } else {
            this.saveTrade();
        }
    }

    onCancelTradeButtonClicked() {
        const confirmDialog = this.dialog.open(CancelTradeDialogComponent, {
            width: '80%',
            maxHeight: '750px',
            data: {
                sectionModel: this.sectionModel,
            },
        });
        confirmDialog.afterClosed().subscribe((cancelTradeModel: CancelTrade) => {
            if (cancelTradeModel) {
                this.sectionModel.blDate = cancelTradeModel.cancellationDate;
                if (cancelTradeModel.isSectionClosed) {
                    this.sectionModel.contractInvoiceTypeId =
                        ContractInvoiceType.Cancellation;
                    this.onCloseSectionButtonClicked(null, null, false, cancelTradeModel);
                } else {
                    this.cancelTrades(cancelTradeModel);
                }
            }
        });
    }

    private cancelTrades(sectionCancelDetails: CancelTrade) {
        this.tradingService
            .cancelSection(
                [this.sectionModel.sectionId],
                sectionCancelDetails.cancellationDate,
                this.childFlag,
                this.dataVersionId,
            )
            .subscribe((ok) => {
                if (ok) {
                    const title = `Trade ${this.sectionModel.contractLabel} is now cancelled`;
                    this.dialog
                        .open(ConfirmationDialogComponent, {
                            data: {
                                title: 'Trade Cancelled',
                                text: title,
                                okButton: 'Ok',
                            },
                        })
                        .afterClosed()
                        .subscribe((answer) => {
                            const messageGenerating = 'Generating invoice... Please wait.';
                            this.snackbarService.informationSnackBar(messageGenerating);
                            this.generateInvoiceLines(sectionCancelDetails);
                        });
                }
            });
    }

    private generateInvoiceLines(sectionCancelTradeDetails: CancelTrade) {
        const invoiceRecord = new InvoiceRecord();

        invoiceRecord.agreementDate = sectionCancelTradeDetails.cancellationDate;
        invoiceRecord.authorizedForPosting = true;
        invoiceRecord.costDirection =
            sectionCancelTradeDetails.costType === sectionCancelTradeDetails.costTypeForCancellationLoss
                ? CostDirections.Payable
                : CostDirections.Receivable;
        invoiceRecord.counterpartyCode = sectionCancelTradeDetails.counterParty;
        invoiceRecord.currency = sectionCancelTradeDetails.currency;
        invoiceRecord.dueDate = sectionCancelTradeDetails.dueDate;
        invoiceRecord.externalInhouse = sectionCancelTradeDetails.externalInternal;
        invoiceRecord.externalInvoiceRef = sectionCancelTradeDetails.narrative;
        invoiceRecord.invoiceDate = sectionCancelTradeDetails.cancellationDate;
        invoiceRecord.invoiceType = InvoiceTypes.Cancelled;
        invoiceRecord.paymentTerms = this.sectionModel.paymentTerms;
        invoiceRecord.template = sectionCancelTradeDetails.template;
        invoiceRecord.totalGoodsValue = sectionCancelTradeDetails.quantity;
        invoiceRecord.totalInvoiceValue = 0;
        invoiceRecord.settlementValue = Number(
            sectionCancelTradeDetails.settlementValue,
        );

        const invoiceLine = new InvoiceLineRecord();
        invoiceLine.contractType = this.sectionModel.contractType;
        invoiceLine.currencyCode = this.sectionModel.currencyCode;
        invoiceLine.invoicePercent = 100;
        invoiceLine.lineAmount = Number(sectionCancelTradeDetails.settlementValue);
        invoiceLine.lineNumber = 1;
        invoiceLine.price = this.sectionModel.price;
        invoiceLine.quantity = sectionCancelTradeDetails.quantity.toString();
        invoiceLine.sectionID = this.sectionId;
        if (this.masterdata.vats && this.masterdata.vats.length > 0) {
            invoiceLine.vatCode = this.masterdata.vats[0].vatCode;
        }
        invoiceRecord.invoiceLines = new Array<InvoiceLineRecord>();
        invoiceRecord.invoiceLines.push(invoiceLine);

        this.executionService
            .createInvoice(invoiceRecord)
            .subscribe((invoice: InvoiceRecord) => {
                if (invoice) {
                    const messageGenerated =
                        'Invoice ' + invoice.documentReference + ' generated successfully.';
                    this.snackbarService.informationAndCopySnackBar(
                        messageGenerated,
                        messageGenerated,
                    );
                    this.router.navigate([
                        this.companyManager.getCurrentCompanyId() +
                        '/trades/display/' +
                        this.sectionId,
                    ]);
                }
            },         (error) => {
                this.snackbarService.throwErrorSnackBar(error.error.detail);
            });
    }

    onReverseCancelTradeButtonClicked() {
        const invoiceMarkingDetails = this.statusTabComponent.invoicingComponent.invoiceMarkingDetails;
        this.dialog.open(ConfirmationDialogComponent, {
            data: {
                title: 'Trade Reverse Cancellation',
                text: 'You are about to reverse cancellation. Continue?',
                okButton: 'Yes',
                cancelButton: 'No',
            },
        }).afterClosed().subscribe((answer) => {
            if (answer) {
                this.tradingService.reverseCancelSection(
                    this.sectionModel.sectionId,
                    this.childFlag,
                    this.dataVersionId,
                ).subscribe((ok) => {
                    if (ok) {
                    const title = `Trade ${this.sectionModel.contractLabel}' is now Reversed`;
                    this.dialog.open(ConfirmationDialogComponent, {
                        data: {
                            title: 'Trade Reverse Cancelled',
                            text: title,
                            okButton: 'Ok',
                        },
                    }).afterClosed().subscribe((answer) => {
                        const messageGenerated = 'Reversing invoice...';
                        this.snackbarService.informationAndCopySnackBar(
                            messageGenerated,
                            messageGenerated,
                        );
                        const invoiceRecord = new InvoiceRecord();
                        invoiceRecord.documentType = TransactionDocumentTypes.Original;
                        invoiceRecord.externalInhouse = invoiceMarkingDetails.externalInhouse;
                        invoiceRecord.externalInvoiceRef = 'reverseCancel';
                        invoiceRecord.invoiceDate = invoiceMarkingDetails.invoiceDate;
                        invoiceRecord.documentReference = invoiceMarkingDetails.invoiceCode;
                        invoiceRecord.invoiceType = InvoiceTypes.Reversal;
                        invoiceRecord.isDraft = false;
                        invoiceRecord.quantityToInvoice = QuantityToInvoiceType.Contract;
                        invoiceRecord.transactionDocumentId = invoiceMarkingDetails.transactionDocumentId;
                        invoiceRecord.transactionDocumentTypeId = invoiceMarkingDetails.transactionDocumentTypeId;
                        invoiceRecord.invoiceId = invoiceMarkingDetails.invoiceId;

                        this.executionService.createInvoice(invoiceRecord).subscribe((ok) => {
                            if (ok) {
                                const messageGenerated = 'Invoice reversed successfully.';
                                this.snackbarService.informationAndCopySnackBar(
                                    messageGenerated,
                                    messageGenerated,
                                );
                                this.router.navigate([
                                    this.companyManager.getCurrentCompanyId() +
                                    '/trades/display/' +
                                    this.sectionId,
                                ]);
                            }
                        });
                    });
                }
            });
        }
        });
    }
}
