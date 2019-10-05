
import { Component, HostListener, Inject, OnDestroy, OnInit, Optional, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DATE_LOCALE, MatDialog } from '@angular/material';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MatMomentDateAdapterOptions } from '@angular/material-moment-adapter';
import { ActivatedRoute, Router } from '@angular/router';
import * as agGrid from 'ag-grid-community';
import * as moment from 'moment';
import { Subject, Subscription } from 'rxjs';
import { concatMap, finalize, map, takeUntil } from 'rxjs/operators';
import { AgGridCopyIconComponent } from '../../../shared/components/ag-grid-copy-icon/ag-grid-copy-icon.component';
import { ConfirmationDialogComponent } from '../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { FABType } from '../../../shared/components/floating-action-button/floating-action-button-type.enum';
import { ListAndSearchComponent } from '../../../shared/components/list-and-search/list-and-search.component';
import { AllocationSetUp } from '../../../shared/entities/allocation-set-up-entity';
import { AtlasAgGridParam } from '../../../shared/entities/atlas-ag-grid-param.entity';
import { AtlasFormControl } from '../../../shared/entities/atlas-form-control';
import { Charter } from '../../../shared/entities/charter.entity';
import { Counterparty } from '../../../shared/entities/counterparty.entity';
import { FloatingActionButtonActions } from '../../../shared/entities/floating-action-buttons-actions.entity';
import { IsLocked } from '../../../shared/entities/is-locked.entity';
import { ListAndSearchFilter } from '../../../shared/entities/list-and-search/list-and-search-filter.entity';
import { LockFunctionalContext } from '../../../shared/entities/lock-functional-context.entity';
import { LockResourceInformation } from '../../../shared/entities/lock-resource-information.entity';
import { SectionTraffic } from '../../../shared/entities/section-traffic.entity';
import { UserGridPreferencesParameters } from '../../../shared/entities/user-grid-preferences-parameters.entity';
import { ContractStatus } from '../../../shared/enums/contract-status.enum';
import { ContractTypes } from '../../../shared/enums/contract-type.enum';
import { ListAndSearchFilterType } from '../../../shared/enums/list-and-search-filter-type.enum';
import { WarningMessageTypes } from '../../../shared/enums/warning-message-type.enum';
import { AssignedSectionView } from '../../../shared/models/assigned-section-display-view';
import { AgGridService } from '../../../shared/services/ag-grid.service';
import { GridConfigurationProviderService } from '../../../shared/services/grid-configuration-provider.service';
import { ConfigurationService } from '../../../shared/services/http-services/configuration.service';
import { ExecutionService } from '../../../shared/services/http-services/execution.service';
import { LockService } from '../../../shared/services/http-services/lock.service';
import { UserIdentityService } from '../../../shared/services/http-services/user-identity.service';
import { CharterAssignmentSectionsDataLoader } from '../../../shared/services/list-and-search/charter-assignmentSections-data-loader';
import { CounterPartyDataLoader } from '../../../shared/services/masterdata/counterparty-data-loader';
import { SecurityService } from '../../../shared/services/security.service';
import { SnackbarService } from '../../../shared/services/snackbar.service';
import { SplitCreateAndAllocateService } from '../../../shared/services/split-create-and-allocate.service';
import { TitleService } from '../../../shared/services/title.service';
import { UtilService } from '../../../shared/services/util.service';
import { GetWarningMessages } from '../../../shared/validators/warning-messages-validator.validator';
import { AllocationMessage } from '../../../trading/entities/allocation-message';

@Component({
    selector: 'atlas-execution-charter-assignment',
    templateUrl: './execution-charter-assignment.component.html',
    styleUrls: ['./execution-charter-assignment.component.scss'],
    providers: [CharterAssignmentSectionsDataLoader, CounterPartyDataLoader],
})
export class ExecutionCharterAssignmentComponent implements OnInit, OnDestroy {
    @ViewChild('listAndSearchComponent') listAndSearchComponent: ListAndSearchComponent;
    private locale: string;
    private useUtc: boolean;
    gridApiSelected: agGrid.GridApi;
    gridColumnApiSelected: agGrid.ColumnApi;

    gridApiAssignedSection: agGrid.GridApi;
    gridColumnApiAssignedSection: agGrid.ColumnApi;

    selectedContractGridRows: AssignedSectionView[];
    selectedContractGridColumns: agGrid.ColDef[];

    assignedContractGridRows: AssignedSectionView[] = [];
    assignedContractGridColumns: agGrid.ColDef[];

    tempContractGridRows: AssignedSectionView[];

    selectedContractGridRowsAfterSearch: AssignedSectionView[];
    getAllocationWarningMessagesSubscription: Subscription[] = [];
    contractType: string;
    allocateToContractType: number;
    allocationMessage: AllocationMessage[] = [];
    isRevert = false;
    rowStyle: any;
    quantityColumn: string = 'quantity';
    company: string;
    charterId: number;
    charter = new Charter();
    formatType: string = 'en-US';
    searchForm: FormGroup;
    isLoading: boolean;
    isSave: boolean = false;
    isLoadingAssigned: boolean = true;
    hasSearched: boolean;
    searchTerm: string;
    charterReference: string;
    charterManager: string;
    charterDescription: string;
    vessel: string;
    transportType: string;
    masterdata: any;
    tooltipMessageOnQuantity: string;
    dataLength: number = 0;
    foundContractTitle: string;
    gridContext: ExecutionCharterAssignmentComponent;
    loadOnInit = false;

    destroy$ = new Subject();
    resourcesInformation: LockResourceInformation[] = new Array<LockResourceInformation>();
    locking: number[] = [];
    unlocking: number[] = [];
    isLoadingassign = false;
    sectionsGridOptions: agGrid.GridOptions = {};
    hasGridSharing: boolean = false;
    componentId: string = 'charterSectionToAssign';

    atlasAgGridParam: AtlasAgGridParam;

    fabMenuActions: FloatingActionButtonActions[] = [];
    fabTitle: string;
    fabType: FABType;

    isLoaded: boolean = false;

    defaultColumnDisplay = {
        checkboxSelection: true,
        contractLabel: true,
        commodityPart1: true,
        commodityPart2: true,
        commodityPart3: true,
        quantity: true,
        quantityUnit: true,
        shipmentPeriod: true,
        department: true,
        counterparty: true,
    };

    isPopupRequired: boolean = false;
    isWashoutRequired: boolean = false;

    allocationSetUpData: AllocationSetUp[] = [];
    additionalFilters: ListAndSearchFilter[] = [];
    dataVersionId: number;
    gridCode: string = 'charterSectionToAssign';
    searchContractReferenceCtrl = new AtlasFormControl('searchContractReferenceCtrl');
    filteredCounterPartyList: Counterparty[];
    counterPartyCtrl = new AtlasFormControl('CounterParty');
    commodity1Ctrl = new AtlasFormControl('commodity1Ctrl');

    contractSearchGridPreferences: UserGridPreferencesParameters;


    constructor(
        @Optional() @Inject(MAT_DATE_LOCALE)
        private dateLocale: string,
        @Optional() @Inject(MAT_MOMENT_DATE_ADAPTER_OPTIONS)
        private options: MatMomentDateAdapterOptions,
        private executionService: ExecutionService,
        private route: ActivatedRoute,
        private formBuilder: FormBuilder,
        private userIdentityService: UserIdentityService,
        private snackbarService: SnackbarService,
        private createSplitService: SplitCreateAndAllocateService,
        protected router: Router,
        protected lockService: LockService,
        protected dialog: MatDialog,
        private titleService: TitleService,
        private securityService: SecurityService,
        private gridConfigurationProvider: GridConfigurationProviderService,
        public gridService: AgGridService,
        protected configurationService: ConfigurationService,
        public dataLoader: CharterAssignmentSectionsDataLoader,
        protected utilService: UtilService,
        public counterpartyDataLoader: CounterPartyDataLoader,
    ) {
        this.locale = dateLocale || moment.locale();
        this.useUtc = this.options && this.options.useUtc;
    }

    ngOnInit() {
        this.charterId = Number(this.route.snapshot.paramMap.get('charterId'));
        this.company = this.route.snapshot.paramMap.get('company');
        this.dataVersionId = this.route.snapshot.paramMap.get('dataVersionId') ?
            Number(this.route.snapshot.paramMap.get('dataVersionId')) : null;
        this.masterdata = this.route.snapshot.data.masterdata;
        this.filteredCounterPartyList = this.masterdata.counterparties;
        this.counterPartyCtrl.valueChanges.subscribe((input) => {
            this.filterCounterParty(input);
        });
        this.gridContext = this;
        this.getCharter(this.charterId);
        this.onInitView();
        this.tempContractGridRows = [];
        this.initializeAssignmentGridColumns();
        this.initFavouriteColumns();
        this.securityService.isSecurityReady().pipe(
            concatMap(() => {
                return this.gridConfigurationProvider.getConfiguration(this.company, this.componentId);
            }),
        ).subscribe((configuration) => {

            this.hasGridSharing = configuration.hasMultipleViewsPerUser;
        });

        this.lockService.cleanSessionLocks().pipe(takeUntil(this.destroy$)).subscribe();

        this.atlasAgGridParam = this.gridService.getAgGridParam();
        this.getAllocationSetUpData(this.company);
        this.initFABActions();
        this.isLoaded = true;

    }

    filterCounterParty(input) {
        this.filteredCounterPartyList = this.utilService.filterListforAutocomplete(
            input,
            this.masterdata.counterparties,
            ['counterpartyCode', 'description'],
        );
        if (this.counterPartyCtrl.valid || !this.counterPartyCtrl.value) {
            this.onQuickSearchButtonClicked();
        }
    }

    canDeactivate() {
        if (this.isSave === false) {
            return window.confirm('Leave an unsave form? \nYour changes won\'t be applied!');
        }
        return true;
    }

    @HostListener('window:beforeunload', ['$event']) unloadNotification($event: any) {
        if (this.searchForm.dirty) {
            $event.returnValue = true;
        }
    }

    getCharter(charterId: number) {
        this.executionService.getCharterById(charterId).pipe(
            map((charter: Charter) => {
                this.charter = charter;
                this.charterReference = charter.charterCode;
                this.charterDescription = charter.description;
                this.updateCharterManager(charter.charterManagerId);
                if (charter.vesselCode) {
                    const vesselDetails = this.masterdata.vessels.find((x) => x.vesselName === charter.vesselCode);
                    if (vesselDetails) {
                        this.vessel = vesselDetails.description;
                    }
                }

                if (charter.transportTypeCode) {
                    const transportType = this.masterdata.transportTypes.find((x) =>
                        x.transportTypeCode === charter.transportTypeCode);
                    if (transportType) {
                        this.transportType = transportType.description;
                    }

                }
                this.titleService.setTitle(this.charterReference + ' - Trade Assignment');

            }))
            .subscribe();
    }

    updateCharterManager(userId: number) {
        if (userId) {
            this.userIdentityService.getAllUsers().subscribe((data) => {
                this.charterManager = data.value.find((user) => user.userId === userId).displayName;
            });
        }
    }

    onInitView() {
        this.isLoading = this.hasSearched = true;
        this.executionService.getSectionsToBeAssignToCharter().pipe(
            map((data) => {
                this.selectedContractGridRowsAfterSearch = this.selectedContractGridRows = data.value.map((section) => {
                    section.counterparty = (section.contractType === ContractTypes.Purchase ? section.sellerCode : section.buyerCode);

                    return new AssignedSectionView(section);
                });

                this.dataLength = this.selectedContractGridRows.length;
                this.foundContractTitle = 'Contract Found';
                if (this.dataLength > 1) {
                    this.foundContractTitle = 'Contracts Found';
                }
            }),
            finalize(() => {
                this.isLoadingAssigned = false;
            }))
            .subscribe();
    }

    onSearchTrade() {
        this.selectedContractGridRows = [];
        this.searchTerm = this.searchForm.get('searchContractReferenceCtrl').value;
        if (!this.searchTerm) {
            this.executionService.getSectionsToBeAssignToCharter().pipe(
                map((data) => {
                    this.selectedContractGridRows = data.value.map((section) => {
                        section.counterparty = (section.contractType === ContractTypes.Purchase ? section.sellerCode : section.buyerCode);

                        return new AssignedSectionView(section);
                    });

                    this.dataLength = this.selectedContractGridRows.length;
                    this.foundContractTitle = 'Contract Found';
                    if (this.dataLength > 1) {
                        this.foundContractTitle = 'Contracts Found';
                    }
                }),
                finalize(() => {
                    this.isLoadingAssigned = false;
                }))
                .subscribe();
        }
        this.isLoading = this.hasSearched = true;

        this.executionService.getSectionsToBeAssignToCharter(this.searchTerm).pipe(
            map((data) => {
                this.tempContractGridRows = data.value.map((section) => {
                    section.counterparty = (section.contractType === ContractTypes.Purchase ? section.sellerCode : section.buyerCode);
                    return new AssignedSectionView(section);
                });
                this.dataLength = this.tempContractGridRows.length;
                this.addNewRowInGrid();
                this.checkSearchedAllocatedContracts();
                this.foundContractTitle = 'Contract Found';
                if (this.dataLength > 1) {
                    this.foundContractTitle = 'Contracts Found';
                }
            }),
            finalize(() => {
                this.isLoadingAssigned = false;
                // this.removeAndAddRow();
            }))
            .subscribe();
    }

    removeAndAddRow() {
        const selectedRows = this.gridApiSelected.getSelectedRows();
        if (selectedRows.length === 0) {
            this.selectedContractGridRows = this.tempContractGridRows;
        } else if (this.selectedContractGridRows.length === 0) {
            this.selectedContractGridRows = this.tempContractGridRows;
        } else if (this.selectedContractGridRows.length > 0) {

            const uncheckedContract = this.selectedContractGridRows.filter((item) => selectedRows.indexOf(item) < 0);
            uncheckedContract.forEach((contract) => {
                const eventIndex = this.selectedContractGridRows.indexOf(contract);
                this.selectedContractGridRows.splice(eventIndex, 1);
                this.gridApiSelected.updateRowData({ remove: [contract] });
            });

        }
    }

    addNewRowInGrid() {
        if (this.tempContractGridRows.length > 0) {
            this.tempContractGridRows.forEach((contract) => {
                if (this.selectedContractGridRows.filter((item) => item.contractLabel === contract.contractLabel).length === 0) {
                    this.selectedContractGridRows.push(contract);
                    this.gridApiSelected.updateRowData({ add: [contract] });
                }
            });
        }

    }

    checkAndUnCheckSelectContracts(contractLabel: string, isChecked: boolean) {
        this.gridApiSelected.forEachNode((node) => {
            if (node.data.contractLabel === contractLabel) {
                if (node.isSelected() && !isChecked) {
                    node.setSelected(isChecked);
                } else if (!node.isSelected() && isChecked) {
                    node.setSelected(isChecked);
                }
            }
        });
    }

    removeSectionFromSelectedList(data: AssignedSectionView) {
        const eventIndex = this.assignedContractGridRows.indexOf(data);
        this.assignedContractGridRows.splice(eventIndex, 1);
        this.gridApiAssignedSection.updateRowData({ remove: [data] });
    }

    addSectionFromAssignedList(data: AssignedSectionView) {
        let allocatedSection: AssignedSectionView;

        allocatedSection = this.selectedContractGridRowsAfterSearch.find((item) =>
            item.allocatedTo && item.sectionId.toString() === data.allocatedTo);

        if (allocatedSection && allocatedSection.allocatedTo) {
            data.allocatedTo = allocatedSection.contractLabel;
        }

        const sectionFound: AssignedSectionView = this.assignedContractGridRows.find((item) => item.contractLabel === data.contractLabel);
        if (!sectionFound) {
            this.assignedContractGridRows.push(data);
            this.gridApiAssignedSection.updateRowData({ add: [data] });
        }
    }

    ngOnDestroy() {
        if (this.getAllocationWarningMessagesSubscription) {
            this.getAllocationWarningMessagesSubscription.forEach((subscription) => subscription.unsubscribe());
        }
        this.lockService.cleanSessionLocks().pipe(takeUntil(this.destroy$)).subscribe(() => {
            this.destroy$.next();
            this.destroy$.complete();
        });
    }

    rowSelected(event) {
        let allocatedSection: AssignedSectionView;
        let copiedSection: AssignedSectionView;

        if (this.assignedContractGridRows.filter((item) => item.contractLabel === event.data.contractLabel).length > 0 && !event.node.isSelected()) {
            copiedSection = this.assignedContractGridRows.find((item) => item.contractLabel === event.data.contractLabel);
            allocatedSection = this.assignedContractGridRows.find((item) => item.contractLabel === event.data.allocatedTo);
            copiedSection.editableAllocatedTo = true;

            this.removeSectionFromSelectedList(copiedSection);
            if (this.searchTerm && allocatedSection) {
                this.removeSectionFromSelectedList(allocatedSection);
            }
            if (allocatedSection) {
                allocatedSection.editableAllocatedTo = true;
                this.listAndSearchComponent.checkAndUnCheckSelectContracts(allocatedSection.contractLabel, false);
            }

            if (!this.unlocking.includes(event.data.sectionId)) {
                this.unlocking.push(event.data.sectionId);
                this.refeshResourceInformation();
                this.lockService.unlockContract(event.data.sectionId, LockFunctionalContext.TradeAssignment)
                    .pipe(takeUntil(this.destroy$)).subscribe(() => {
                        this.unlocking = this.unlocking.filter((id) => id !== event.data.sectionId);
                    });
            }

        } else if (event.node.isSelected()) {

            this.lockService.isLockedContract(event.data.sectionId).pipe(takeUntil(this.destroy$)).subscribe((lock: IsLocked) => {
                if (lock.isLocked) {
                    this.dialog.open(ConfirmationDialogComponent, {
                        data: {
                            title: 'Lock',
                            text: lock.message,
                            okButton: 'Got it',
                        },
                    });
                    this.gridApiSelected.deselectNode(event.node);
                    this.locking = this.locking.filter((id) => id !== event.data.sectionId);
                } else {
                    this.lockService.lockContract(event.data.sectionId, LockFunctionalContext.TradeAssignment)
                        .pipe(takeUntil(this.destroy$)).subscribe((lockState) => {
                            copiedSection = { ...event.data };
                            allocatedSection = this.selectedContractGridRowsAfterSearch
                                .find((item) => item.contractLabel === event.data.allocatedTo);
                            if (allocatedSection) {
                                copiedSection.quantity = (event.data.quantity < allocatedSection.quantity) ?
                                    event.data.quantity : allocatedSection.quantity;
                                copiedSection.originalQuantity = copiedSection.quantity;
                                copiedSection.editableAllocatedTo = false;
                                this.listAndSearchComponent.checkAndUnCheckSelectContracts(allocatedSection.contractLabel, true);
                            } else {
                                copiedSection.originalQuantity = copiedSection.quantity;
                                copiedSection.editableAllocatedTo = true;
                            }
                            this.addSectionFromAssignedList(copiedSection);
                            if (this.searchTerm && allocatedSection) {
                                this.addSectionFromAssignedList(allocatedSection);
                            }
                            this.refeshResourceInformation();
                            this.locking = this.locking.filter((id) => id !== event.data.sectionId);
                        });

                }
            });
        }
    }

    refeshResourceInformation() {
        this.resourcesInformation = new Array<LockResourceInformation>();
        if (this.gridApiSelected) {
            this.gridApiSelected.forEachNode((node) => {
                if (node.isSelected()) {
                    const resourceInformation = new LockResourceInformation();
                    resourceInformation.resourceType = 'Contract';
                    resourceInformation.resourceId = node.data.sectionId;
                    resourceInformation.resourceCode = node.data.contractReference;
                    this.resourcesInformation.push(resourceInformation);
                }
            });
        }
    }
    onAssignButtonClick() {

        const inValidSections: AssignedSectionView[] = this.assignedContractGridRows
            .filter((section: AssignedSectionView) => section.isValid === false || section.isValidAllocatedTo === false);

        if (inValidSections.length === 0) {
            const assignSectionList: AssignedSectionView[] = [];

            const modifiedSections: AssignedSectionView[] = this.assignedContractGridRows
                .filter((section) => section.isTouched === true);

            if (modifiedSections.length > 0) {

                if (modifiedSections.some((x) => x.isWashout === true)) {
                    this.isPopupRequired = true;
                    this.washoutConfirmationPopup();
                } else {
                    this.isWashoutRequired = false;
                    this.assignTrade();
                }
            } else {
                this.isWashoutRequired = false;
                this.assignTrade();
            }
        } else {
            this.snackbarService.throwErrorSnackBar('Form is invalid. Please resolve the errors.');
            this.isLoadingassign = false;
        }
    }

    assignTrade() {
        this.isLoadingassign = true;
        this.isSave = true;
        let sectionList: AssignedSectionView[];
        const inValidSections: AssignedSectionView[] = this.assignedContractGridRows
            .filter((section: AssignedSectionView) => section.isValid === false || section.isValidAllocatedTo === false);

        if (inValidSections.length === 0) {
            const assignCharterPromise = [];
            const assignSectionList: AssignedSectionView[] = [];

            const modifiedSections: AssignedSectionView[] = this.assignedContractGridRows
                .filter((section) => section.isTouched === true);
            if (modifiedSections.length > 0) {
                modifiedSections.forEach((section) => {
                    section.vessel = this.charter.vesselCode;
                    const allocatedSection = modifiedSections.find((element) => element.contractLabel === section.allocatedTo);
                    if (allocatedSection) {
                        section.quantity = section.quantity < allocatedSection.quantity ? section.quantity : allocatedSection.quantity;
                        if (!assignSectionList.includes(allocatedSection)) {
                            assignSectionList.push(section);
                        }
                    } else {

                        const allocationFound: AssignedSectionView = this.assignedContractGridRows
                            .find((element) => element.contractLabel === section.allocatedTo);
                        if (allocationFound) {
                            this.assignedContractGridRows.find((element) => element.contractLabel === section.allocatedTo).isTouched = true;
                        }
                        assignSectionList.push(section);
                    }
                });

                assignCharterPromise.push(this.createSplitService.createSplitOfAssignedSections(assignSectionList, this.charterId, this.isWashoutRequired));
            }

            sectionList = this.assignedContractGridRows.filter((section) =>
                !section.charterRef && !section.isTouched);

            const sectionTrafficList: SectionTraffic[] = [];
            if (sectionList.length > 0) {
                sectionList.forEach((element) => {

                    const sectionTrafiic: SectionTraffic = new SectionTraffic();

                    sectionTrafiic.sectionId = Number(element.sectionId);
                    sectionTrafiic.blDate = (element.blDate) ?
                        (this.useUtc) ?
                            moment.utc(element.blDate).locale(this.locale).toDate() :
                            moment(element.blDate).locale(this.locale).toDate()
                        : null;
                    sectionTrafiic.blReference = element.blRef;
                    sectionTrafiic.vesselCode = this.charter.vesselCode;
                    sectionTrafiic.portDestination = element.portDestination;
                    sectionTrafiic.portOrigin = element.portOrigin;
                    sectionTrafiic.marketSector = element.marketSector;
                    sectionTrafficList.push(sectionTrafiic);

                });
            }

            if (sectionList.length > 0) {
                assignCharterPromise.push(this.executionService.assignSectionsToCharter(this.charterId, sectionTrafficList).toPromise());
            }
            Promise.all(assignCharterPromise).then(() => {
                if (this.createSplitService.messageOnAllocation !== '') {
                    this.snackbarService.informationAndCopySnackBar(this.createSplitService.messageOnAllocation + 'and Selected contract(s) has been assigned to charter' + this.charter.charterCode, this.createSplitService.referenceGroupNumber);
                    this.createSplitService.messageOnAllocation = '';
                } else {
                    this.snackbarService.informationAndCopySnackBar('Selected contract(s) has been assigned to charter ' + this.charter.charterCode, this.charter.charterCode);
                }

                this.router.navigate(['/' + this.company
                    + '/execution/charter/details/', this.charterId]);
            });
        } else {
            this.snackbarService.throwErrorSnackBar('Form is invalid. Please resolve the errors.');
            this.isLoadingassign = false;
        }
    }

    onRefreshButtonClick() {
        if (this.isRevert) {
            this.selectedContractGridColumns.forEach((col: agGrid.ColDef) => {
                col.hide = !this.defaultColumnDisplay[col.colId];
                this.gridColumnApiSelected.setColumnVisible(col.colId, !col.hide);
                this.gridColumnApiSelected.moveColumns([col.colId], this.selectedContractGridColumns.length - 1);
            });
        }
    }

    onGridReadySelected(params) {
        this.sectionsGridOptions.columnDefs = this.selectedContractGridColumns;
        this.gridApiSelected = this.sectionsGridOptions.api;
        this.gridColumnApiSelected = this.sectionsGridOptions.columnApi;

        this.gridService.sizeColumns(this.sectionsGridOptions);
    }

    onGridReadyAssign(params) {
        this.gridApiAssignedSection = params.api;
        this.gridColumnApiAssignedSection = params.columnApi;
        window.onresize = () => {
            this.gridColumnApiAssignedSection.autoSizeAllColumns();
        };
        this.gridApiAssignedSection.sizeColumnsToFit();
    }

    onAddOrDeleteColumn(event) {
        const cols = this.selectedContractGridColumns.filter((col) => col.colId === event.column.colId);
        if (cols.length !== 1) { return; }
        cols[0].hide = !event.visible;
    }

    deleteAssignment(section: AssignedSectionView) {
        // Remove selected section from Assigned table
        const index = this.assignedContractGridRows.indexOf(section, 0);
        if (index > -1) {
            this.assignedContractGridRows.splice(index, 1);
        }
    }
    showOrHideColum(event, col: agGrid.ColDef) {
        this.gridColumnApiSelected.setColumnVisible(col.colId, (col.hide || false));
        event.stopPropagation();
        return false;
    }
    showOrHideColum1(event, col: agGrid.ColDef) {
        this.gridColumnApiAssignedSection.setColumnVisible(col.colId, (col.hide || false));
        event.stopPropagation();
        return false;
    }

    initFavouriteColumns() {
        for (const key in this.defaultColumnDisplay) {
            this.defaultColumnDisplay[key] = false;
        }
        
        this.initializeSelectedGridColumns();
        this.contractSearchGridPreferences = {
            showExport: false,
            company: this.company,
            gridId: this.componentId,
            gridOptions: this.sectionsGridOptions,
            sharingEnabled: this.hasGridSharing,
        };

        this.contractSearchGridPreferences = new UserGridPreferencesParameters(this.contractSearchGridPreferences);
    }

    onCellValueChanged(event) {
        const columnChanged: string = event.colDef.field;

        if ((event.colDef) && columnChanged === this.quantityColumn) {
            const newValue: number = Number(event.newValue);
            const oldValue: number = event.data.originalQuantity;
            event.data.isTouched = newValue !== oldValue ? true : false;

            if (!event.data.quantityStyleChangeForQuantity) {
                const contractLabel: string = event.data.contractLabel.toUpperCase();
                const allocatedContract: AssignedSectionView = this.assignedContractGridRows.find((row) =>
                    row.allocatedTo === contractLabel);
                if (allocatedContract) {
                    if (Number(event.data.quantity) < Number(allocatedContract.originalQuantity)) {
                        allocatedContract.quantity = event.data.quantity;
                        allocatedContract.highLightRow = true;
                        event.data.highLightRow = false;
                    } else {
                        event.data.quantity = allocatedContract.quantity;
                        event.data.highLightRow = false;
                    }

                    this.gridApiAssignedSection.updateRowData({ update: [allocatedContract] });
                    this.gridApiAssignedSection.updateRowData({ update: [event.data] });
                }
            } else {
                event.data.highLightRow = false;
            }
        }

        if (columnChanged === 'allocatedTo') {
            const allocatedToNewValue: string = event.newValue;
            const allocatedToOldValue: string = event.oldValue;
            if (!event.data.quantityStyleChangeForAllocatedTo) {
                if (allocatedToNewValue) {
                    const allocatedContract: AssignedSectionView = this.assignedContractGridRows.find((row) =>
                        row.contractLabel.toUpperCase() === allocatedToNewValue.toUpperCase());
                    if (allocatedContract) {
                        if (!allocatedContract.automatedChanged) {
                            if (Number(event.data.quantity) < Number(allocatedContract.originalQuantity)) {
                                allocatedContract.quantity = event.data.quantity;
                                allocatedContract.highLightRow = true;
                            } else if (Number(event.data.quantity) > Number(allocatedContract.originalQuantity)) {
                                event.data.quantity = allocatedContract.quantity;
                                event.data.highLightRow = true;
                            }

                            allocatedContract.allocatedTo = event.data.contractLabel;
                            allocatedContract.allocatedSectionId = event.data.sectionId;
                            event.data.allocatedSectionId = allocatedContract.sectionId;
                            event.data.automatedChanged = true;
                            event.data.isTouched = true;
                            allocatedContract.isTouched = true;
                            if (event.data.currency === allocatedContract.currency && event.data.counterparty === allocatedContract.counterparty) {
                                allocatedContract.isWashout = true;
                                event.data.isWashout = true;
                            }
                            this.gridApiAssignedSection.updateRowData({ update: [allocatedContract] });
                        }
                        allocatedContract.automatedChanged = false;
                    }
                } else {
                    const allocatedContract: AssignedSectionView = this.assignedContractGridRows.find((row) =>
                        row.contractLabel && allocatedToOldValue && row.contractLabel.toUpperCase() === allocatedToOldValue.toUpperCase());
                    if (allocatedContract) {
                        if (!allocatedContract.automatedChanged) {
                            allocatedContract.allocatedTo = '';
                            allocatedContract.quantity = allocatedContract.originalQuantity;
                            event.data.quantity = event.data.originalQuantity;
                            allocatedContract.highLightRow = false;
                            event.data.highLightRow = false;
                            event.data.automatedChanged = true;
                            event.data.isTouched = false;
                            allocatedContract.isTouched = false;
                            this.gridApiAssignedSection.updateRowData({ update: [allocatedContract] });
                        }
                        allocatedContract.automatedChanged = false;
                    }
                }
            }
        }
    }

    initializeSelectedGridColumns() {
        this.selectedContractGridColumns = [
            {
                headerName: 'Contract reference',
                colId: 'contractLabel',
                field: 'contractLabel',
                headerCheckboxSelection: true,
                checkboxSelection: true,
            },
            {
                headerName: 'Commodity part 1',
                colId: 'principalCommodity',
                field: 'commodityId',
                valueFormatter: this.commodityPart1Formatter.bind(this),

            },
            {
                headerName: 'Commodity part 2',
                colId: 'part2',
                field: 'commodityId',
                valueFormatter: this.commodityPart2Formatter.bind(this),
            },
            {
                headerName: 'Commodity part 3',
                colId: 'part3',
                field: 'commodityId',
                valueFormatter: this.commodityPart3Formatter.bind(this),
            },
            {
                headerName: 'Quantity',
                colId: 'quantity',
                field: 'quantity',
                type: 'numericColumn',
                valueFormatter: this.formatValue.bind(this),
            },
            {
                headerName: 'Weight code',
                colId: 'weightUnitId',
                field: 'weightUnitId',
                valueFormatter: this.weightCodeDescriptionFormatter.bind(this),
            },
            {
                headerName: 'Shipment period',
                colId: 'shipmentPeriod',
                field: 'shipmentPeriod',
            },
            {
                headerName: 'Dept',
                colId: 'departmentId',
                field: 'departmentId',
                valueFormatter: this.departmentDescriptionFormatter.bind(this),
            },
            {
                headerName: 'Counterparty',
                colId: 'counterparty',
                field: 'counterparty',
            },
            {
                headerName: 'Allocated contract',
                colId: 'allocatedTo',
                field: 'allocatedTo',
                valueFormatter: this.allocatedContractFormatter.bind(this),
            },
            {
                headerName: 'Approval Status',
                colId: 'contractStatusCode',
                field: 'contractStatusCode',
                valueFormatter: this.contractStatusFormatter.bind(this),
            },
        ];

        this.rowStyle = { 'border-bottom': '1px solid #e0e0e0 !important' };
    }

    commodityPart1Formatter(params) {
        if (params.value) {
            const commodity = params.context.masterdata.commodities.find((x) => x.commodityId === Number(params.value));
            return commodity ? commodity.principalCommodity : '';
        } else {
            return '';
        }
    }

    commodityPart2Formatter(params) {
        if (params.value) {
            const commodity = params.context.masterdata.commodities.find((x) => x.commodityId === Number(params.value));
            return commodity ? commodity.part2 : '';
        } else {
            return '';
        }
    }

    commodityPart3Formatter(params) {
        if (params.value) {
            const commodity = params.context.masterdata.commodities.find((x) => x.commodityId === Number(params.value));
            return commodity ? commodity.part3 : '';
        } else {
            return '';
        }
    }

    departmentDescriptionFormatter(params) {
        if (params.value) {
            const department = params.context.masterdata.departments.find((x) => x.departmentId === Number(params.value));
            return department ? department.description : '';
        } else if (params.data.departmentDescription) {
            return params.data.departmentDescription;
        } else {
            return '';
        }
    }

    weightCodeDescriptionFormatter(params) {
        if (params.value) {
            const weightUnits = params.context.masterdata.weightUnits.find((x) => x.weightUnitId === Number(params.value));
            return weightUnits ? weightUnits.weightCode : '';
        } else if (params.data.weightCode) {
            return params.data.weightCode;
        } else {
            return '';
        }
    }

    contractTypeFormatter(params) {
        return (Number(params.value) === ContractTypes.Purchase ? 'Purchase' : 'Sales');
    }

    contractStatusFormatter(params) {
        return ContractStatus[params.value].toString();
    }

    allocatedContractFormatter(params) {
        if (params.value) {
            let allocatedSection: AssignedSectionView;
            if (this.selectedContractGridRowsAfterSearch) {
                allocatedSection = this.selectedContractGridRowsAfterSearch.find((item) =>
                    item.allocatedTo && item.sectionId.toString() === params.value);
                if (allocatedSection) {
                    return allocatedSection.contractLabel;
                }
            }
        } else {
            return '';
        }
    }

    validateAllocatedTo(params): string {
        let toolTipMessage: string = '';
        params.data.quantityStyleChangeForAllocatedTo = false;
        params.data.isValidAllocatedTo = true;
        if (params.value) {
            const allocatedContract: AssignedSectionView = this.assignedContractGridRows.find((row) =>
                row.contractLabel && params.value.toUpperCase() === row.contractLabel.toUpperCase());
            params.data.isValidAllocatedTo = false;
            if (allocatedContract) {
                // Check both contract should different
                if ((params.data.contractType === ContractTypes.Purchase && allocatedContract.contractType === ContractTypes.Sale) ||
                    (params.data.contractType === ContractTypes.Sale && allocatedContract.contractType === ContractTypes.Purchase)) {

                    const filterSection: AssignedSectionView[] = this.assignedContractGridRows.filter((row) =>
                        row.allocatedTo && params.value.toUpperCase() === row.allocatedTo.toUpperCase());

                    // Check if there is already assigned Contract in bottom list
                    if (filterSection.length < 2) {
                        // Check if Department is same of both contract
                        if (allocatedContract.departmentId === params.data.departmentId) {
                            // Check for allocation Message
                            this.getAllocationWarningMessagesSubscription.
                                push(this.executionService.getWarningMessages(params.data.sectionId, allocatedContract.sectionId)
                                    .subscribe((data) => {

                                        this.allocationMessage = GetWarningMessages(data.value, this.allocationSetUpData);
                                        params.data.isValidAllocatedTo = true;
                                        toolTipMessage = null;
                                        if (this.allocationMessage.length > 0) {
                                            this.allocationMessage.forEach((element) => {
                                                if (element.errorTypeId === WarningMessageTypes.Restricted) {
                                                    toolTipMessage = 'Contracts cannot be allocated because the fields '
                                                        + this.allocationMessage.forEach((item) => item.message)
                                                        + ' are not matching';
                                                    params.data.quantityStyleChangeForAllocatedTo = true;
                                                    params.data.isValidAllocatedTo = false;
                                                }
                                            });
                                        }
                                    }));
                        } else {
                            toolTipMessage = 'To allocate contracts from different departments please use trade group allocation';
                            params.data.quantityStyleChangeForAllocatedTo = true;
                        }
                    } else {
                        toolTipMessage = 'This contract reference is already used in allocated contract column';
                        params.data.quantityStyleChangeForAllocatedTo = true;
                    }
                } else {
                    toolTipMessage = 'This contract reference does not correspond to the correct contract type';
                    params.data.quantityStyleChangeForAllocatedTo = true;
                }
            } else {
                toolTipMessage = 'Only selected contracts can be allocated together';
                params.data.quantityStyleChangeForAllocatedTo = true;
            }
        }
        return toolTipMessage;
    }

    initializeAssignmentGridColumns() {
        this.assignedContractGridColumns = [
            {
                headerName: 'Contract Type',
                colId: 'contractType',
                field: 'contractType',
                hide: true,
                suppressToolPanel: true,
                valueFormatter: this.contractTypeFormatter,
            },
            {
                headerName: 'Contract reference',
                checkboxSelection: true,
                field: 'contractLabel',
                suppressToolPanel: true,
            },
            {
                headerName: 'Quantity',
                colId: 'quantity',
                field: 'quantity',
                editable: true,
                suppressToolPanel: true,
                type: 'numericColumn',
                valueFormatter: this.formatValue.bind(this),
                cellClassRules: {
                    'ag-grid-invalid-mandatory-field': ((params) => params.data.quantityStyleChangeForQuantity),
                    'ag-grid-valid-mandatory-field': ((params) => !params.data.quantityStyleChangeForQuantity),
                    'ag-grid-bold-quantity-field': ((params) => params.data.highLightRow),

                },
                tooltip: (params) => {
                    return this.validateQuantity(params);
                },
            },
            {
                headerName: 'Weight code',
                colId: 'weightUnitId',
                field: 'weightUnitId',
                suppressToolPanel: true,
                valueFormatter: this.weightCodeDescriptionFormatter,
            },
            {
                headerName: 'Dept',
                colId: 'departmentId',
                suppressToolPanel: true,
                field: 'departmentId',
                valueFormatter: this.departmentDescriptionFormatter,
            },
            {
                headerName: 'Allocated contract',
                colId: 'allocatedTo',
                field: 'allocatedTo',
                tooltip: this.validateAllocatedTo.bind(this),
                editable: this.checkEditableForAllocatedContract.bind(this),
                valueFormatter: this.allocatedContractFormatter.bind(this),
                cellClassRules: {
                    'ag-grid-invalid-mandatory-field': ((params) => params.data.quantityStyleChangeForAllocatedTo),
                    'ag-grid-valid-mandatory-field': ((params) => !params.data.quantityStyleChangeForAllocatedTo),
                },

            },
            {
                headerName: 'Approval Status',
                colId: 'contractStatusCode',
                field: 'contractStatusCode',
                suppressToolPanel: true,
                valueFormatter: this.contractStatusFormatter,
            },
            {
                headerName: '',
                field: 'contractLabel',
                suppressToolPanel: true,
                cellRendererFramework: AgGridCopyIconComponent,
            },
        ];

    }
    formatValue(param) {
        if (isNaN(param.value) || param.value === null) { return ''; }
        return new Intl.NumberFormat(this.formatType, { minimumFractionDigits: 3, maximumFractionDigits: 3 }).format(param.value);
    }
    validateQuantity(params): string {
        params.data.quantityStyleChangeForQuantity = false;

        if (params.data.allocatedTo) {
            let allocatedSection: AssignedSectionView;
            let smallestQuantity: number;
            allocatedSection = this.assignedContractGridRows.find((item) => item.contractLabel === params.data.allocatedTo);
            if (allocatedSection && allocatedSection.isTouched) {
                smallestQuantity = (params.data.quantity > allocatedSection.originalQuantity) ?
                    allocatedSection.originalQuantity : params.data.quantity;
                if (Number(params.value) <= 0 || params.value > smallestQuantity) {
                    params.data.quantityStyleChangeForQuantity = true;
                    params.data.isValid = false;
                    this.tooltipMessageOnQuantity = 'Quantity should be greater than zero and less than or equal to ' + smallestQuantity;
                } else {
                    params.data.isValid = true;
                }
            }
        } else {

            this.tooltipMessageOnQuantity = null;
            params.data.quantityStyleChangeForQuantity = false;
            if ((Number(params.value) === 0 ||
                Number(params.value) < 0) && !params.data.charterRef) {
                this.tooltipMessageOnQuantity = 'Quantity can not be zero';
                params.data.quantityStyleChangeForQuantity = true;
                params.data.isValid = false;
            } else if (params.data.originalQuantity < Number(params.value)) {
                params.data.quantityStyleChangeForQuantity = true;
                params.data.isValid = false;
                this.tooltipMessageOnQuantity = 'Quantity can not be greater than the original quantity';
            } else {
                params.data.isValid = true;
            }

        }

        return this.tooltipMessageOnQuantity;

    }

    checkEditableForAllocatedContract(params): boolean {
        const rowData: AssignedSectionView = params.data;
        return rowData.editableAllocatedTo;
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
                this.router.navigate(['/' + this.company
                    + '/execution/charter/details/', this.charterId]);
            }
        });
    }

    checkSearchedAllocatedContracts() {

        this.gridApiSelected.forEachNode((node) => {
            if (node.data && node.data.contractLabel && this.assignedContractGridRows) {
                const contractLabel = node.data.contractLabel;
                const contractFound = this.assignedContractGridRows.find((contract) => contract.contractLabel === contractLabel);
                if (contractFound) {
                    node.setSelected(true);
                }
            }
        });

    }

    washoutConfirmationPopup() {
        if (this.isPopupRequired) {
            const confirmDiscardDialog = this.dialog.open(ConfirmationDialogComponent, {
                data: {
                    title: 'Washout Contract',
                    text: 'Do you want contract(s) to mark as washout?',
                    okButton: 'Yes',
                    cancelButton: 'No',
                },
            });
            confirmDiscardDialog.afterClosed().subscribe((answer) => {
                if (answer) {
                    this.isWashoutRequired = true;
                    this.assignTrade();
                } else {
                    this.isWashoutRequired = false;
                    this.assignTrade();
                }
            });

        } else {
            return this.isWashoutRequired;
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

    onQuickSearchButtonClicked() {
        this.additionalFilters = [];
        let searchCounterParty: string;
        if (this.counterPartyCtrl.value) {
            searchCounterParty = (this.counterPartyCtrl.value as Counterparty).counterpartyCode;
            if (!searchCounterParty) {
                searchCounterParty = this.counterPartyCtrl.value;
            }
        }
        const contractLabelField = this.listAndSearchComponent.columnConfiguration
            .find((column) => column.fieldName === 'ContractLabel');
        const counterpartyCodeField = this.listAndSearchComponent.columnConfiguration
            .find((column) => column.fieldName === 'Counterparty');
        const commodityField = this.listAndSearchComponent.columnConfiguration
            .find((column) => column.fieldName === 'PrincipalCommodity');
        if (!this.listAndSearchComponent) {
            return;
        } else {
            if (this.searchContractReferenceCtrl.value && contractLabelField) {
                const filter = new ListAndSearchFilter();
                filter.fieldId = contractLabelField.fieldId;
                filter.fieldName = contractLabelField.fieldName;
                filter.predicate = {
                    filterType: ListAndSearchFilterType.Text,
                    operator: 'eq',
                    value1: this.searchContractReferenceCtrl.value + '%',
                };
                filter.isActive = true;
                this.additionalFilters.push(filter);
            }
            if (this.counterPartyCtrl.value && counterpartyCodeField) {
                const filterCounterParty = new ListAndSearchFilter();
                filterCounterParty.fieldId = counterpartyCodeField.fieldId;
                filterCounterParty.fieldName = counterpartyCodeField.fieldName;
                filterCounterParty.predicate = {
                    filterType: ListAndSearchFilterType.Text,
                    operator: 'eq',
                    value1: searchCounterParty + '%',
                };
                filterCounterParty.isActive = true;
                this.additionalFilters.push(filterCounterParty);
            }
            if (this.commodity1Ctrl.value && commodityField) {
                const filterCommodity = new ListAndSearchFilter();
                filterCommodity.fieldId = commodityField.fieldId;
                filterCommodity.fieldName = commodityField.fieldName;
                filterCommodity.predicate = {
                    filterType: ListAndSearchFilterType.Text,
                    operator: 'eq',
                    value1: this.commodity1Ctrl.value + '%',
                };
                filterCommodity.isActive = true;
                this.additionalFilters.push(filterCommodity);
            }
        }
        this.listAndSearchComponent.additionalFilters = this.additionalFilters;
        this.listAndSearchComponent.loadData(true);
    }

    // For FAB
    initFABActions() {
        this.fabTitle = 'Assignment FAB mini';
        this.fabType = FABType.MiniFAB;
        const actionItemSave: FloatingActionButtonActions = {
            icon: 'check_circle',
            text: 'Assign',
            action: 'assign',
            disabled: false,
            index: 0,
        };
        const actionItemCancel: FloatingActionButtonActions = {
            icon: 'keyboard_backspace',
            text: 'Discard',
            action: 'discard',
            disabled: false,
            index: 1,
        };
        this.fabMenuActions.push(actionItemSave);
        this.fabMenuActions.push(actionItemCancel);
    }
    onFabActionClicked(action: string) {
        switch (action) {
            case 'assign': {
                this.onAssignButtonClick();
                break;
            }
            case 'discard': {
                this.onDiscardButtonClicked();
                break;
            }
        }
    }
}
