import { DatePipe } from '@angular/common';
import { Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import * as agGrid from 'ag-grid-community';
import { Subject } from 'rxjs';
import { concatMap, map, takeUntil } from 'rxjs/operators';
import { AuthorizationService } from '../../../../../core/services/authorization.service';
import { CompanyManagerService } from '../../../../../core/services/company-manager.service';
import { AgContextualMenuComponent } from '../../../../../shared/components/ag-contextual-menu/ag-contextual-menu.component';
import { AgGridHyperlinkComponent } from '../../../../../shared/components/ag-grid-hyperlink/ag-grid-hyperlink.component';
import { BaseFormComponent } from '../../../../../shared/components/base-form-component/base-form-component.component';
import { ConfirmationDialogComponent } from '../../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { GridEnlargementComponent } from '../../../../../shared/components/grid-enlargement/grid-enlargement.component';
import { AgContextualMenuAction } from '../../../../../shared/entities/ag-contextual-menu-action.entity';
import { AtlasAgGridParam } from '../../../../../shared/entities/atlas-ag-grid-param.entity';
import { AtlasContextualAction } from '../../../../../shared/entities/atlas-contextual-action.entity';
import { Charter } from '../../../../../shared/entities/charter.entity';
import { IsLocked } from '../../../../../shared/entities/is-locked.entity';
import { LockFunctionalContext } from '../../../../../shared/entities/lock-functional-context.entity';
import { LockResourceInformation } from '../../../../../shared/entities/lock-resource-information.entity';
import { UserGridPreferencesParameters } from '../../../../../shared/entities/user-grid-preferences-parameters.entity';
import { ContractStatus } from '../../../../../shared/enums/contract-status.enum';
import { ContractTypes } from '../../../../../shared/enums/contract-type.enum';
import { InvoicingStatus } from '../../../../../shared/enums/invoicing-status.enum';
import { PermissionLevels } from '../../../../../shared/enums/permission-level.enum';
import { PricingMethods } from '../../../../../shared/enums/pricing-method.enum';
import { AssignedSectionView } from '../../../../../shared/models/assigned-section-display-view';
import { FormatDatePipe } from '../../../../../shared/pipes/format-date-pipe.pipe';
import { AgGridService } from '../../../../../shared/services/ag-grid.service';
import { UserCompanyPrivilegeDto } from '../../../../../shared/services/authorization/dtos/user-company-privilege';
import { FormConfigurationProviderService } from '../../../../../shared/services/form-configuration-provider.service';
import { ExecutionService } from '../../../../../shared/services/http-services/execution.service';
import { LockService } from '../../../../../shared/services/http-services/lock.service';
import { SnackbarService } from '../../../../../shared/services/snackbar.service';
import { UiService } from '../../../../../shared/services/ui.service';
import { CommonMethods } from '../../../../services/execution-cash-common-methods';
import { DeassignSectionDialogComponent } from '../deassign-section-dialog/deassign-section-dialog.component';
import { ReassignContractAgGridComponent } from '../reassign-contract-ag-grid/reassign-contract-ag-grid.component';
import { AgGridUserPreferencesComponent } from './../../../../../shared/components/ag-grid-user-preferences/ag-grid-user-preferences.component';
import { User } from './../../../../../shared/entities/user.entity';
import { GroupFunctionTypes } from './../../../../../shared/enums/group-function-type';
import { CharterDisplayView } from './../../../../../shared/models/charter-display-view';
import { GridConfigurationProviderService } from './../../../../../shared/services/grid-configuration-provider.service';
import { SecurityService } from './../../../../../shared/services/security.service';

@Component({
    selector: 'atlas-assigned-contract-list-form-component',
    templateUrl: './assigned-contract-list-form-component.component.html',
    styleUrls: ['./assigned-contract-list-form-component.component.scss'],
    providers: [DatePipe],
})
export class AssignedContractListFormComponent extends BaseFormComponent implements OnInit, OnDestroy {
    @ViewChild('userPreferences') userPreferencesComponent: AgGridUserPreferencesComponent;
    @ViewChild('gridZoom') gridEnlargementComponent: GridEnlargementComponent;

    charterId: number;
    columnDefs: agGrid.ColDef[];
    gridApi: agGrid.GridApi;
    gridColumnApi: agGrid.ColumnApi;
    rowStyle: any;
    savingInProgress = false;
    sectionsAssigned: AssignedSectionView[];
    fullyInvoiceContract: AssignedSectionView[];
    isLoadingAssigned = true;
    dataLength = 0;
    rowSelection: string;
    masterdata: any = [];
    gridContext: AssignedContractListFormComponent;
    sectionsAssignedGridContextualMenuActions: AgContextualMenuAction[];
    sectionsAssignedMenuActions: { [key: string]: string } = {
        deleteAssignedContract: 'delete',
        reassignedContract: 'reassign',
    };
    model: Charter;
    isEdit: boolean = true;
    quickSumModeActivated = false;
    selectedColumnsArray: Array<{ 'name': string, 'sum': number }> = new Array();
    company: string;
    userActiveDirectoryName: string;
    checkExportedFormat: boolean = false;
    excelStyles: any;
    hasEmptyState: boolean = true;
    @Output() isContractAssigned = new EventEmitter<any>();
    @Output() readonly isReassignedButtonClicked = new EventEmitter();
    @ViewChild('atlasNewReassign') atlasNewReassign: ReassignContractAgGridComponent;
    bulkActionTypeId: GroupFunctionTypes;
    chartersList: CharterDisplayView[] = [];

    assignDeassignPrivilege: UserCompanyPrivilegeDto = {
        privilegeName: 'ChartersView',
        profileId: null,
        permission: PermissionLevels.ReadWrite,
        privilegeParentLevelOne: 'Charters',
        privilegeParentLevelTwo: 'ChartersView',
    };

    defaultColumnDisplay = {
        checkboxSelection: true,
        contractLabel: true,
        counterparty: true,
        quantity: true,
        departmentCode: true,
        commodity1: true,
        blDate: true,
        allocatedTo: true,
        invoiceRef: true,
    };

    allowedColumnsforQuickSum: string[];

    destroy$ = new Subject();
    resourcesInformation: LockResourceInformation[] = new Array<LockResourceInformation>();
    locking: number[] = [];
    unlocking: number[] = [];
    componentId: string = 'charterAssignedSectionsList';
    hasGridSharing: boolean = false;
    charterGridOptions: agGrid.GridOptions = {};

    defaultClass: string = 'ag-theme-material pointer-cursor';
    cellSelectionClass: string = 'ag-theme-material pointer-cursor cell-selection';
    classApplied: string;
    assignmentEmptyMessage: string = 'No contract has been assigned yet';
    sideReassignNavOpened: boolean;
    assignOrDeassignPrivilege: boolean;

    atlasAgGridParam: AtlasAgGridParam;
    gridPreferences: UserGridPreferencesParameters;
    gridZoomAdditionalActions: AtlasContextualAction[] = [];

    editingCharter: UserCompanyPrivilegeDto = {
        profileId: null,
        privilegeName: 'ChartersView',
        permission: PermissionLevels.ReadWrite,
        privilegeParentLevelOne: 'Charters',
        privilegeParentLevelTwo: null,
    };

    constructor(
        private companyManager: CompanyManagerService,
        private securityService: SecurityService,
        private route: ActivatedRoute,
        protected router: Router,
        private gridConfigurationProvider: GridConfigurationProviderService,
        private executionService: ExecutionService,
        protected formConfigurationProvider: FormConfigurationProviderService,
        private snackbarService: SnackbarService,
        private authorizationService: AuthorizationService,
        protected dialog: MatDialog,
        private datePipe: DatePipe,
        private formatDate: FormatDatePipe,
        private uiService: UiService,
        protected lockService: LockService,
        public gridService: AgGridService,
    ) {
        super(formConfigurationProvider);

        this.excelStyles = [
            {
                id: 'dateFormat',
                dataType: 'dateTime',
                numberFormat: {
                    format: 'dd/mm/yyyy',
                },
            },
        ];
        const currentUser: User = this.authorizationService.getCurrentUser();
        this.userActiveDirectoryName = currentUser ? currentUser.samAccountName : '';
        this.atlasAgGridParam = this.gridService.getAgGridParam();
    }

    ngOnInit() {
        this.company = this.route.snapshot.params['company'];
        this.charterId = this.route.snapshot.params['charterId'];
        this.masterdata = this.route.snapshot.data.masterdata;
        this.gridContext = this;
        this.classApplied = this.defaultClass;
        this.atlasNewReassign.charterId = this.charterId;
        this.init();
        this.initFavouriteColumns();

        this.securityService.isSecurityReady().pipe(
            concatMap(() => {
                return this.gridConfigurationProvider.getConfiguration(this.company, this.componentId);
            }),
        ).subscribe((configuration) => {

            this.hasGridSharing = configuration.hasMultipleViewsPerUser;
            this.gridPreferences = {
                company: this.company,
                gridId: this.componentId,
                gridOptions: this.charterGridOptions,
                sharingEnabled: this.hasGridSharing,
                showExport: true,
            };
            this.gridPreferences = new UserGridPreferencesParameters(this.gridPreferences);
            this.findAssignedContractsToCharter();
        });

    }

    toggleQuickSum() {
        this.onClearSelectionClicked();
        this.quickSumModeActivated = !this.quickSumModeActivated;
        this.quickSumModeActivated ? this.classApplied = this.cellSelectionClass : this.classApplied = this.defaultClass;
        this.selectedColumnsArray = [];
    }

    onClearSelectionClicked() {
        this.gridApi.clearRangeSelection();
        this.selectedColumnsArray = [];
    }

    closeReassignSideNav(value) {
        this.sideReassignNavOpened = false;
        this.isReassignedButtonClicked.emit(false);
        if (value) {
            this.findAssignedContractsToCharter();
            this.router.navigate(['/' + this.route.snapshot.paramMap.get('company') + '/execution/charter/details', this.charterId]);
        }

    }
    onRangeSelectionChanged(event) {

        this.selectedColumnsArray = [];
        const rangeSelections = this.gridApi.getRangeSelections();
        if (!rangeSelections || rangeSelections.length === 0) {
            return;
        }
        const firstRange = rangeSelections[0];
        const startRow = Math.min(firstRange.start.rowIndex, firstRange.end.rowIndex);
        const endRow = Math.max(firstRange.start.rowIndex, firstRange.end.rowIndex);
        const api = this.gridApi;
        let sum = 0;
        const selectedColumnsArray = this.selectedColumnsArray;
        const allowedColumnsforQuickSum = this.allowedColumnsforQuickSum;
        firstRange.columns.forEach((column) => {
            sum = 0;
            if (allowedColumnsforQuickSum.includes(column.getColDef().colId)) {
                for (let rowIndex = startRow; rowIndex <= endRow; rowIndex++) {
                    const rowModel = api.getModel();
                    const rowNode = rowModel.getRow(rowIndex);
                    const value = api.getValue(column, rowNode);
                    sum += Number(value);
                }

                selectedColumnsArray.push({ name: column.getColDef().headerName, sum });
            }
        });
        this.selectedColumnsArray = selectedColumnsArray;
    }

    onRowSelected(event) {
        if (event.data.allocatedTo) {
            let allocatedSection: AssignedSectionView;
            allocatedSection = this.sectionsAssigned.find((item: AssignedSectionView) =>
                item.contractLabel === event.data.allocatedTo);
            if (allocatedSection) {
                event.data.isChecked = !event.data.isChecked;
                this.gridApi.forEachNode((node) => {
                    if (node.data.contractLabel === allocatedSection.contractLabel) {
                        if (node.isSelected() && !event.data.isChecked) {
                            node.setSelected(event.data.isChecked);
                        } else if (!node.isSelected() && event.data.isChecked) {
                            node.setSelected(event.data.isChecked);
                        }
                    }
                });
            }
        }
        if (this.isEdit) {
            if (event.node.isSelected()) {

                this.lockService.isLockedContract(event.data.sectionId).pipe(takeUntil(this.destroy$)).subscribe((lock: IsLocked) => {
                    if (lock.isLocked) {
                        this.dialog.open(ConfirmationDialogComponent, {
                            data: {
                                title: 'Lock',
                                text: lock.message,
                                okButton: 'Got it',
                            },
                        });
                        this.gridApi.deselectNode(event.node);
                        this.locking = this.locking.filter((id) => id !== event.data.sectionId);
                    } else {
                        this.lockService.lockContract(event.data.sectionId, LockFunctionalContext.TradeDeassignment)
                            .pipe(takeUntil(this.destroy$))
                            .subscribe((lockState) => {
                                this.refeshResourceInformation();
                                this.locking = this.locking.filter((id) => id !== event.data.sectionId);
                            });

                    }
                });
            } else {
                if (!this.unlocking.includes(event.data.sectionId)) {
                    this.unlocking.push(event.data.sectionId);
                    this.refeshResourceInformation();
                    this.lockService.unlockContract(event.data.sectionId, LockFunctionalContext.TradeDeassignment)
                        .pipe(takeUntil(this.destroy$)).subscribe(() => {
                            this.unlocking = this.unlocking.filter((id) => id !== event.data.sectionId);
                        });
                }
            }
        }
    }

    refeshResourceInformation() {
        this.resourcesInformation = new Array<LockResourceInformation>();
        this.gridApi.forEachNode((node) => {
            if (node.isSelected()) {
                const resourceInformation = new LockResourceInformation();
                resourceInformation.resourceType = 'Contract';
                resourceInformation.resourceId = node.data.sectionId;
                resourceInformation.resourceCode = node.data.contractReference;
                this.resourcesInformation.push(resourceInformation);
            }
        });
    }

    init() {
        this.allowedColumnsforQuickSum = ['quantity', 'price'];
        this.sectionsAssignedGridContextualMenuActions = [
            {
                icon: 'delete',
                text: 'Deassign',
                action: this.sectionsAssignedMenuActions.deleteAssignedContract,
                disabled: this.isDisabled,
            },
            {
                icon: 'refresh',
                text: 'Reassign',
                action: this.sectionsAssignedMenuActions.reassignedContract,
            },
        ];
        this.initGridZoom();
    }

    isDisabled(params) {
        let deassignDisable = true;
        if (params.context.actionContext.isEdit) {
            deassignDisable = false;
        }
        return deassignDisable;
    }

    getSelectedRow() {
        let assignedSections: AssignedSectionView[];
        let allocatedSection: AssignedSectionView;
        assignedSections = this.gridApi.getSelectedRows();

        assignedSections.forEach((element: AssignedSectionView) => {
            if (element.contractType === ContractTypes.Sale && element.invoicingStatus === InvoicingStatus.Finalized) {
                element.reasonForDeassignment = 'Sales contract is 100% invoiced and cannot be de-assigned';
                element.isSaleFullyInvoiced = true;

            } else if (element.contractType === ContractTypes.Purchase && element.allocatedTo) {
                allocatedSection = this.sectionsAssigned.find((item: AssignedSectionView) => item.contractLabel === element.allocatedTo);
                if (allocatedSection.invoicingStatus === InvoicingStatus.Finalized) {
                    element.reasonForDeassignment =
                        'Purchase contract allocated to a Sales Contract which is 100% invoiced and cannot be de-assigned';
                    element.isSaleFullyInvoiced = true;

                }
            }
        });

        assignedSections.forEach((element: AssignedSectionView) => {
            if (element.allocatedTo) {
                allocatedSection = this.sectionsAssigned.find((item: AssignedSectionView) =>
                    item.contractLabel === element.allocatedTo && element.isSaleFullyInvoiced === false);
                if (allocatedSection) {
                    if (!assignedSections.includes(allocatedSection)) {
                        assignedSections.push(allocatedSection);
                    }
                }
            }
        });

        this.model.assignedSections = assignedSections.filter((section: AssignedSectionView) =>
            section.isSaleFullyInvoiced === false);
        this.fullyInvoiceContract = assignedSections.filter((section: AssignedSectionView) =>
            section.isSaleFullyInvoiced === true || section.reasonForDeassignment !== '');
    }

    initForm(entity: any, isEdit: boolean = false) {
        this.model = entity as Charter;
        this.isEdit = isEdit;
        if (isEdit) {
            this.isEdit = this.checkIfUserHasRequiredPrivileges(this.assignDeassignPrivilege);
        }
        this.initializeGridColumns();
        this.initGridZoom();
    }

    checkIfUserHasRequiredPrivileges(userCompanyPrivilege: UserCompanyPrivilegeDto) {
        if (this.authorizationService.isUserAllowedForCompany(this.company)) {
            const userPermissionLevel = this.authorizationService.getPermissionLevel(
                this.company,
                userCompanyPrivilege.privilegeParentLevelTwo,
                userCompanyPrivilege.privilegeParentLevelOne);
            if (userPermissionLevel < userCompanyPrivilege.permission) {
                return false;
            }
        }
        return true;
    }

    findAssignedContractsToCharter() {
        this.isLoadingAssigned = true;
        this.locking = [];
        this.resourcesInformation.forEach((resourceInformation) => {
            if (!this.unlocking.includes(resourceInformation.resourceId)) {
                this.unlocking.push(resourceInformation.resourceId);
                this.refeshResourceInformation();
                this.lockService.unlockContract(resourceInformation.resourceId, LockFunctionalContext.TradeDeassignment)
                    .pipe(takeUntil(this.destroy$))
                    .subscribe(() => {
                        this.unlocking = this.unlocking.filter((id) => id !== resourceInformation.resourceId);
                    });
            }
        });
        this.unlocking = [];
        this.resourcesInformation = new Array<LockResourceInformation>();

        this.executionService.getSectionsAssignedToCharter(this.charterId).pipe(
            map((data) => {
                this.sectionsAssigned = data.value.map((section) => {
                    section.counterparty = (section.contractType === ContractTypes.Purchase ? section.sellerCode : section.buyerCode);
                    return new AssignedSectionView(section);
                });
                this.initializeGridColumns();
                this.dataLength = this.sectionsAssigned.length;
                if (this.dataLength > 0) {
                    this.isContractAssigned.emit(true);
                    this.hasEmptyState = false;
                }

                if (this.charterGridOptions && this.charterGridOptions.api) {
                    this.charterGridOptions.api.setRowData(this.sectionsAssigned);
                    this.charterGridOptions.rowData = this.sectionsAssigned;
                    this.charterGridOptions.api.refreshView();

                    if (this.gridEnlargementComponent) {
                        this.gridEnlargementComponent.refreshGrid();
                    }
                }

                this.isLoadingAssigned = false;
            }))
            .subscribe();

    }

    hyperlinkClicked(rowSelected: AssignedSectionView, event) {
        this.router.navigate(['/' + this.companyManager.getCurrentCompanyId() + '/trades/display', rowSelected.sectionId]);
        event.preventDefault();
    }

    onGridReady(params) {
        this.gridApi = this.charterGridOptions.api;
        this.charterGridOptions.columnDefs = this.columnDefs;

        this.gridColumnApi = this.charterGridOptions.columnApi;
        this.gridService.sizeColumns(this.charterGridOptions);
    }

    onAddOrDeleteColumn(event) {
        this.userPreferencesComponent.onChangeColumnVisibility(event);
    }

    showOrHideColum(event, col: agGrid.ColDef) {
        this.gridColumnApi.setColumnVisible(col.colId, (col.hide || false));
        event.stopPropagation();
        return false;
    }

    initFavouriteColumns() {
        for (const key in this.defaultColumnDisplay) {
            this.defaultColumnDisplay[key] = false;
        }
        this.initializeGridColumns();
    }

    commodityDescriptionFormatter(params) {
        const commodity = params.context.masterdata.commodities.find((com) => com.commodityId === params.value);
        return commodity ? commodity.principalCommodity : '';
    }

    departmentDescriptionFormatter(params) {
        const department = params.context.masterdata.departments.find((dept) => dept.departmentId === params.value);
        return department ? department.departmentCode : '';
    }

    paymentTermCodeFormatter(params) {
        const paymentTerm = params.context.masterdata.paymentTerms.find((payment) => payment.paymentTermsCode === params.value);
        return paymentTerm ? paymentTerm.paymentTermsDescription : '';
    }

    contractStatusFormatter(params) {
        if (params.value === ContractStatus.Unapproved || params.value === ContractStatus.Invoiced
            || params.value === ContractStatus.Approved) {
            return ContractStatus[params.value] ? ContractStatus[params.value].toString() : '';
        }
    }

    pricingMethodIdFormatter(params) {
        if (params.value === PricingMethods.FnO || params.value === PricingMethods.Priced) {
            return PricingMethods[params.value] ? PricingMethods[params.value].toString() : '';
        }
    }

    initializeGridColumns() {
        this.columnDefs = [
            {
                headerName: '',
                headerCheckboxSelection: true,
                checkboxSelection: true,
                headerCheckboxSelectionFilteredOnly: true,
                lockPosition: true,
                hide: !this.isEdit,
                width: 80,
                maxWidth: 80,
            },
            {
                headerName: 'Contract Label',
                colId: 'contractLabel',
                field: 'contractLabel',
                cellRendererFramework: AgGridHyperlinkComponent,
                cellRendererParams: {
                    context: {
                        componentParent: this,
                    },
                },

            },
            {
                headerName: 'Counter Party',
                colId: 'counterparty',
                field: 'counterparty',

            },
            {
                headerName: 'Quantity',
                colId: 'quantity',
                field: 'quantity',
                type: 'numericColumn',
                valueFormatter: this.amountFormatter.bind(this),

            },
            {
                headerName: 'Department',
                colId: 'departmentCode',
                field: 'departmentCode',
            },
            {
                headerName: 'BL date',
                colId: 'blDate',
                field: 'blDate',
                cellClass: 'dateFormat',
                valueFormatter: (params) => this.uiService.dateFormatter(params),
            },
            {
                headerName: 'Allocation',
                colId: 'allocatedTo',
                field: 'allocatedTo',
            },
            {
                headerName: 'Invoice Ref',
                colId: 'invoiceRef',
                field: 'invoiceRef',
            },
            {
                headerName: 'Contract Date',
                colId: 'contractDate',
                field: 'contractDate',
                hide: !this.defaultColumnDisplay['contractDate'],
                cellClass: 'dateFormat',
                valueFormatter: (params) => this.uiService.dateFormatter(params),
            },
            {
                headerName: 'Pricing Method',
                colId: 'pricingMethodId',
                field: 'pricingMethodId',
                hide: !this.defaultColumnDisplay['pricingMethodId'],
                valueFormatter: this.pricingMethodIdFormatter,
            },
            {
                headerName: 'Status',
                colId: 'contractStatusCode',
                field: 'contractStatusCode',
                hide: !this.defaultColumnDisplay['ContractStatusCode'],
                valueFormatter: this.contractStatusFormatter,
            },
            {
                headerName: 'Last Amendment',
                colId: 'modifiedDateTime',
                field: 'modifiedDateTime',
                hide: !this.defaultColumnDisplay['modifiedDateTime'],
                cellClass: 'dateFormat',
                valueFormatter: (params) => this.uiService.dateFormatter(params),
            },
            {
                headerName: 'Amendment by',
                colId: 'modifiedBy',
                field: 'modifiedBy',
                hide: !this.defaultColumnDisplay['modifiedBy'],
            },
            {
                headerName: 'Price',
                colId: 'price',
                field: 'price',
                type: 'numericColumn',
                valueFormatter: this.amountFormatter.bind(this),
                hide: !this.defaultColumnDisplay['price'],
            },
            {
                headerName: 'Currency',
                colId: 'currency',
                field: 'currency',
                type: 'numericColumn',
                hide: !this.defaultColumnDisplay['currency'],
            },
            {
                headerName: 'Payment Terms',
                colId: 'paymentTermCode',
                field: 'paymentTermCode',
                hide: !this.defaultColumnDisplay['paymentTermCode'],
                valueFormatter: this.paymentTermCodeFormatter,
            },
            {
                headerName: 'Charter',
                colId: 'charterRef',
                field: 'charterRef',
                hide: !this.defaultColumnDisplay['charterRef'],
            },
            {
                headerName: 'Allocation Date',
                colId: 'allocatedDateTime',
                field: 'allocatedDateTime',
                hide: !this.defaultColumnDisplay['allocatedDateTime'],
                valueFormatter: this.uiService.dateFormatter,
            },
            {
                headerName: 'Amended By',
                colId: 'amendedBy',
                field: 'amendedBy',
                hide: !this.defaultColumnDisplay['amendedBy'],
            },
            {
                headerName: 'Amended On',
                colId: 'amendedOn',
                field: 'amendedOn',
                valueFormatter: this.uiService.dateFormatter,
                hide: !this.defaultColumnDisplay['amendedOn'],
            },
            {
                headerName: 'Arbitration Code',
                colId: 'arbitrationCode',
                field: 'arbitrationCode',
                hide: !this.defaultColumnDisplay['arbitrationCode'],
            },
            {
                headerName: 'Arbitration Description',
                colId: 'arbitrationDescription',
                field: 'arbitrationDescription',
                hide: !this.defaultColumnDisplay['arbitrationDescription'],
            },
            {
                headerName: 'Buyer',
                colId: 'buyerCode',
                field: 'buyerCode',
                hide: !this.defaultColumnDisplay['buyerCode'],
            },
            {
                headerName: 'Buyer Description',
                colId: 'buyerDescription',
                field: 'buyerDescription',
                hide: !this.defaultColumnDisplay['buyerDescription'],
            },
            {
                headerName: 'Cmy1',
                colId: 'commodity1',
                field: 'commodity1',
            },
            {
                headerName: 'Cmy2',
                colId: 'commodity2',
                field: 'commodity2',
                hide: !this.defaultColumnDisplay['commodity2'],
            },
            {
                headerName: 'Cmy3',
                colId: 'commodity3',
                field: 'commodity3',
                hide: !this.defaultColumnDisplay['commodity3'],
            },
            {
                headerName: 'Cmy4',
                colId: 'commodity4',
                field: 'commodity4',
                hide: !this.defaultColumnDisplay['commodity4'],
            },
            {
                headerName: 'Cmy5',
                colId: 'commodity5',
                field: 'commodity5',
                hide: !this.defaultColumnDisplay['commodity5'],
            },
            {
                headerName: 'Commodity Description',
                colId: 'commodityDescription',
                field: 'commodityDescription',
                hide: !this.defaultColumnDisplay['commodityDescription'],
            },
            {
                headerName: 'Company',
                colId: 'companyId',
                field: 'companyId',
                hide: !this.defaultColumnDisplay['pricingMethodId'],
            },
            {
                headerName: 'Contract Issued On',
                colId: 'contractIssuedOn',
                field: 'contractIssuedOn',
                valueFormatter: (params) => this.uiService.dateFormatter(params),
                hide: !this.defaultColumnDisplay['contractIssuedOn'],
            },
            {
                headerName: 'Contracted Quantity',
                colId: 'contractQuantity',
                field: 'contractQuantity',
                type: 'numericColumn',
                valueFormatter: this.amountFormatter.bind(this),
                hide: !this.defaultColumnDisplay['contractQuantity'],
            },
            {
                headerName: 'Contract Term',
                colId: 'contractTermCode',
                field: 'contractTermCode',
                hide: !this.defaultColumnDisplay['contractTermCode'],
            },
            {
                headerName: 'Contract Term Description',
                colId: 'contractTermDescription',
                field: 'contractTermDescription',
                hide: !this.defaultColumnDisplay['contractTermDescription'],
            },
            {
                headerName: 'Contract Term Port Code',
                colId: 'contractTermLocationPortCode',
                field: 'contractTermLocationPortCode',
                hide: !this.defaultColumnDisplay['contractTermLocationPortCode'],
            },
            {
                headerName: 'Contract Term Port Description',
                colId: 'contractTermLocationDescription',
                field: 'contractTermLocationDescription',
                hide: !this.defaultColumnDisplay['contractTermLocationDescription'],
            },
            {
                headerName: 'Created Date Time',
                colId: 'createdDateTime',
                field: 'createdDateTime',
                cellClass: 'dateFormat',
                valueFormatter: (params) => this.uiService.dateFormatter(params),
                hide: !this.defaultColumnDisplay['createdDateTime'],
            },
            {
                headerName: 'Contract Type',
                colId: 'displayContractType',
                field: 'displayContractType',
                hide: !this.defaultColumnDisplay['displayContractType'],
            },
            {
                headerName: 'Contract Value',
                colId: 'contractValue',
                field: 'contractValue',
                type: 'numericColumn',
                valueFormatter: this.amountFormatter.bind(this),
                hide: !this.defaultColumnDisplay['contractValue'],
            },
            {
                headerName: 'Counterparty Ref',
                colId: 'counterpartyRef',
                field: 'counterpartyRef',
                hide: !this.defaultColumnDisplay['counterpartyRef'],
            },
            {
                headerName: 'Created By',
                colId: 'createdBy',
                field: 'createdBy',
                hide: !this.defaultColumnDisplay['createdBy'],
            },
            {
                headerName: 'Crop Year',
                colId: 'cropYear',
                field: 'cropYear',
                hide: !this.defaultColumnDisplay['cropYear'],
            },
            {
                headerName: 'Currency Description',
                colId: 'currencyDescription',
                field: 'currencyDescription',
                hide: !this.defaultColumnDisplay['currencyDescription'],
            },
            {
                headerName: 'Delivery Period Start',
                colId: 'deliveryPeriodStart',
                field: 'deliveryPeriodStart',
                valueFormatter: (params) => this.uiService.dateFormatter(params),
                hide: !this.defaultColumnDisplay['deliveryPeriodStart'],
            },
            {
                headerName: 'Delivery Period End',
                colId: 'deliveryPeriodEnd',
                field: 'deliveryPeriodEnd',
                valueFormatter: (params) => this.uiService.dateFormatter(params),
                hide: !this.defaultColumnDisplay['deliveryPeriodEnd'],
            },
            {
                headerName: 'Department Description',
                colId: 'departmentDescription',
                field: 'departmentDescription',
                hide: !this.defaultColumnDisplay['pricingMethodId'],
            },
            {
                headerName: 'Grouping Number',
                colId: 'groupingNumber',
                field: 'groupingNumber',
                hide: !this.defaultColumnDisplay['groupingNumber'],
            },
            {
                headerName: 'Original Quantity',
                colId: 'originalQuantity',
                field: 'originalQuantity',
                type: 'numericColumn',
                valueFormatter: this.amountFormatter.bind(this),
                hide: !this.defaultColumnDisplay['originalQuantity'],
            },
            {
                headerName: 'Invoice Value',
                colId: 'invoiceValue',
                field: 'invoiceValue',
                type: 'numericColumn',
                valueFormatter: this.amountFormatter.bind(this),
                hide: !this.defaultColumnDisplay['invoiceValue'],
            },
            {
                headerName: 'Invoicing Status',
                colId: 'displayInvoicingStatus',
                field: 'displayInvoicingStatus',
                hide: !this.defaultColumnDisplay['displayInvoicingStatus'],
            },
            {
                headerName: 'Main Invoice Reference',
                colId: 'mainInvoiceReference',
                field: 'mainInvoiceReference',
                hide: !this.defaultColumnDisplay['mainInvoiceReference'],
            },
            {
                headerName: 'Main Invoice Date',
                colId: 'mainInvoiceDate',
                field: 'mainInvoiceDate',
                valueFormatter: (params) => this.uiService.dateFormatter(params),
                hide: !this.defaultColumnDisplay['mainInvoiceDate'],
            },
            {
                headerName: 'Memo',
                colId: 'memo',
                field: 'memo',
                hide: !this.defaultColumnDisplay['memo'],
            },
            {
                headerName: 'Other Reference',
                colId: 'otherReference',
                field: 'otherReference',
                hide: !this.defaultColumnDisplay['otherReference'],
            },
            {
                headerName: 'Parent',
                colId: 'parentContractLabel',
                field: 'parentContractLabel',
                hide: !this.defaultColumnDisplay['parentContractLabel'],
            },
            {
                headerName: 'Payment Date',
                colId: 'paymentDate',
                field: 'paymentDate',
                valueFormatter: (params) => this.uiService.dateFormatter(params),
                hide: !this.defaultColumnDisplay['paymentDate'],
            },
            {
                headerName: 'Payment Term Description',
                colId: 'paymentTermDescription',
                field: 'paymentTermDescription',
                hide: !this.defaultColumnDisplay['paymentTermDescription'],
            },
            {
                headerName: 'Percentage Invoiced',
                colId: 'percentageInvoiced',
                field: 'percentageInvoiced',
                hide: !this.defaultColumnDisplay['percentageInvoiced'],
            },
            {
                headerName: 'Period Type',
                colId: 'periodType',
                field: 'periodType',
                hide: !this.defaultColumnDisplay['periodType'],
            },
            {
                headerName: 'Contract Reference',
                colId: 'physicalContractCode',
                field: 'physicalContractCode',
                hide: !this.defaultColumnDisplay['physicalContractCode'],
            },
            {
                headerName: 'Port Of Origin',
                colId: 'portOfOrigin',
                field: 'portOfOrigin',
                hide: !this.defaultColumnDisplay['portOfOrigin'],
            },
            {
                headerName: 'Port Of Origin Description',
                colId: 'portOfOriginDescription',
                field: 'portOfOriginDescription',
                hide: !this.defaultColumnDisplay['portOfOriginDescription'],
            },
            {
                headerName: 'Port Of Destination',
                colId: 'portOfDestination',
                field: 'portOfDestination',
                hide: !this.defaultColumnDisplay['portOfDestination'],
            },
            {
                headerName: 'Port Of Destination Description',
                colId: 'portOfDestinationDescription',
                field: 'portOfDestinationDescription',
                hide: !this.defaultColumnDisplay['portOfDestinationDescription'],
            },
            {
                headerName: 'Position Month',
                colId: 'positionMonth',
                field: 'positionMonth',
                valueFormatter: (params) => this.uiService.dateFormatter(params),
                hide: !this.defaultColumnDisplay['positionMonth'],
            },
            {
                headerName: 'Position Type',
                colId: 'positionType',
                field: 'positionType',
                hide: !this.defaultColumnDisplay['positionType'],
            },
            {
                headerName: 'Price Unit Code',
                colId: 'priceCode',
                field: 'priceCode',
                hide: !this.defaultColumnDisplay['priceCode'],
            },
            {
                headerName: 'Price Unit Description',
                colId: 'priceUnitDescription',
                field: 'priceUnitDescription',
                hide: !this.defaultColumnDisplay['priceUnitDescription'],
            },
            {
                headerName: 'Quantity Code Invoiced',
                colId: 'quantityCodeInvoiced',
                field: 'quantityCodeInvoiced',
                hide: !this.defaultColumnDisplay['quantityCodeInvoiced'],
            },
            {
                headerName: 'Quantity Invoiced',
                colId: 'quantityInvoiced',
                field: 'quantityInvoiced',
                type: 'numericColumn',
                valueFormatter: this.amountFormatter.bind(this),
                hide: !this.defaultColumnDisplay['quantityInvoiced'],
            },
            {
                headerName: 'Seller',
                colId: 'sellerCode',
                field: 'sellerCode',
                hide: !this.defaultColumnDisplay['sellerCode'],
            },
            {
                headerName: 'Seller Description',
                colId: 'sellerDescription',
                field: 'sellerDescription',
                hide: !this.defaultColumnDisplay['sellerDescription'],
            },
            {
                headerName: 'Trader',
                colId: 'traderDisplayName',
                field: 'traderDisplayName',
                hide: !this.defaultColumnDisplay['pricingMethodId'],
            },
            {
                headerName: 'Vessel Name',
                colId: 'vesselName',
                field: 'vesselName',
                hide: !this.defaultColumnDisplay['vesselName'],
            },

            {
                headerName: 'Quantity Code',
                colId: 'weightUnitCode',
                field: 'weightUnitCode',
                hide: !this.defaultColumnDisplay['weightUnitCode'],
            },
            {
                headerName: 'Quantity Code Description',
                colId: 'weightUnitDescription',
                field: 'weightUnitDescription',
                hide: !this.defaultColumnDisplay['weightUnitDescription'],
            },
            {
                headerName: '',
                cellRendererFramework: AgContextualMenuComponent,
                cellRendererParams: {
                    context: {
                        componentParent: this,
                        actionContext: this.gridContext,
                    },
                    menuActions: this.sectionsAssignedGridContextualMenuActions,
                },
                cellClass: 'ag-contextual-menu',
                width: 80,
            },
        ];

        this.rowSelection = 'multiple';
        this.rowStyle = { 'border-bottom': '1px solid #e0e0e0 !important' };
    }

    onActionButtonClicked() {
        this.getSelectedRow();
        this.removeContractFromSection();
    }

    removeContractFromSection() {
        if (this.model.assignedSections.length > 0 || this.fullyInvoiceContract.length > 0) {
            const result = this.model;
            const deAssignSectionDialog = this.dialog.open(DeassignSectionDialogComponent, {
                data: { result, masterdata: this.masterdata, fullyInvoiceContract: this.fullyInvoiceContract },
            });
            deAssignSectionDialog.afterClosed().subscribe((charters: Charter) => {
                this.findAssignedContractsToCharter();
            });
        } else {
            this.snackbarService.informationSnackBar('No Contract Selected.');
        }

    }

    populateEntity(entity: any): any {
        const charter = entity as Charter;
        charter.assignedSections = this.gridApi ? this.gridApi.getSelectedRows() : [];
        charter.assignedSections.forEach((section) => {
            section.vessel = charter.vesselCode;
            section.portOrigin = charter.loadingLocationCode;
            section.portDestination = charter.dischargeLocationCode;
            const sectionAllocated = charter.assignedSections
                .find((assignedSection) => section.allocatedTo === assignedSection.contractLabel);
            if (!this.isSectionInvoicedOrUnallocatedSale(section)) {
                section.blDate = charter.blDate;
                if (sectionAllocated && !this.isSectionInvoicedOrUnallocatedSale(sectionAllocated)) {
                    sectionAllocated.blDate = charter.blDate;
                }
            }
            section.blRef = charter.blRef;
        });
        return charter;
    }

    isSectionInvoicedOrUnallocatedSale(section): boolean {
        if (section.invoiceRef && section.invoiceRef !== '') {
            return true;
        }
        // Sale not allocated will not be updated
        if (section.contractType === ContractTypes.Sale && section.allocatedTo === null) {
            return true;
        }
        return false;
    }

    handleAction(action: string, rowSelected: AssignedSectionView) {
        let allocatedSection: AssignedSectionView;
        const assignedSections: AssignedSectionView[] = [];

        this.model.assignedSections = [];
        switch (action) {

            case this.sectionsAssignedMenuActions.deleteAssignedContract:

                if (rowSelected.contractType === ContractTypes.Sale && rowSelected.invoicingStatus === InvoicingStatus.Finalized) {
                    rowSelected.reasonForDeassignment = 'Sales contract is 100% invoiced and cannot be de-assigned';
                    rowSelected.isSaleFullyInvoiced = true;

                }

                if (rowSelected.contractType === ContractTypes.Purchase && rowSelected.allocatedTo) {
                    allocatedSection = this.sectionsAssigned.find((item) =>
                        item.contractLabel === rowSelected.allocatedTo);
                    if (allocatedSection.invoicingStatus === InvoicingStatus.Finalized) {
                        rowSelected.reasonForDeassignment =
                            'Purchase contract allocated to a Sales Contract which is 100% invoiced and cannot be de-assigned';
                        rowSelected.isSaleFullyInvoiced = true;
                    }
                }

                assignedSections.push(rowSelected);

                if (rowSelected.allocatedTo && rowSelected.isSaleFullyInvoiced === false) {
                    allocatedSection = this.sectionsAssigned.find((item) =>
                        item.contractLabel === rowSelected.allocatedTo && item.isSaleFullyInvoiced === false);
                    if (allocatedSection) {
                        assignedSections.push(allocatedSection);
                    }
                }

                this.model.assignedSections = assignedSections.filter((section: AssignedSectionView) =>
                    section.isSaleFullyInvoiced === false);
                this.fullyInvoiceContract = assignedSections.filter((section: AssignedSectionView) =>
                    section.isSaleFullyInvoiced === true || section.reasonForDeassignment !== '');

                this.removeContractFromSection();

                break;
            case this.sectionsAssignedMenuActions.reassignedContract:
                if (this.isEdit) {
                    if (rowSelected.sectionId) {
                        this.lockContracts(rowSelected.sectionId);
                        if (rowSelected.allocatedToSectionId) {
                            this.lockContracts(rowSelected.allocatedToSectionId);
                        }
                    } else {
                        this.sideReassignNavOpened = true;
                        if (!this.unlocking.includes(rowSelected.sectionId)) {
                            this.unlocking.push(rowSelected.sectionId);
                            this.refeshResourceInformation();
                            this.lockService.unlockContract(rowSelected.sectionId, LockFunctionalContext.TradeReassignment)
                                .pipe(takeUntil(this.destroy$)).subscribe(() => {
                                    this.unlocking = this.unlocking.filter((id) => id !== rowSelected.sectionId);
                                });
                        }
                    }
                }
                this.sideReassignNavOpened = true;
                assignedSections.push(rowSelected);
                if (rowSelected.allocatedTo && rowSelected.isSaleFullyInvoiced === false) {
                    allocatedSection = this.sectionsAssigned.find((item) =>
                        item.contractLabel === rowSelected.allocatedTo && item.isSaleFullyInvoiced === false);
                    if (allocatedSection) {
                        assignedSections.push(allocatedSection);
                    }
                }

                this.model.assignedSections = assignedSections;

                this.atlasNewReassign.reassignCharterGridRows(this.model);
                break;
            default:  // throw Action not recognized exception
                break;
        }
    }

    goToChartersDetails(charterId: number) {
        this.router.navigate([this.route.snapshot.paramMap.get('company') +
            '/execution/charter/details', charterId, { warning: false }]);
    }

    amountFormatter(param) {
        if (param && param.value) {
            const commonMethods = new CommonMethods();
            if (param.colDef.colId.toLowerCase() === 'quantity' ||
                param.colDef.colId.toLowerCase() === 'contractquantity' || param.colDef.colId.toLowerCase() === 'originalquantity'
                || param.colDef.colId.toLowerCase() === 'quantityinvoiced') {
                return commonMethods.getFormattedNumberValue(param.value, 3);
            } else {
                return commonMethods.getFormattedNumberValue(param.value, 2);
            }
        }
    }

    initGridZoom() {
        this.gridZoomAdditionalActions = [];

        const addCostPrivilegeLevel =
            this.authorizationService.getPermissionLevel(
                this.company,
                this.editingCharter.privilegeName,
                this.editingCharter.privilegeParentLevelOne,
                this.editingCharter.privilegeParentLevelTwo);

        const hasAddCostPrivilege = addCostPrivilegeLevel >= PermissionLevels.ReadWrite;

        this.gridZoomAdditionalActions.push(
            new AtlasContextualAction(
                'Update Cost',
                false,
                'updateCost',
            ),
        );

        if (hasAddCostPrivilege) {
            this.gridZoomAdditionalActions.push(
                new AtlasContextualAction(
                    'Deassign',
                    () => !this.isEdit,
                    'deassign',
                ),
                new AtlasContextualAction(
                    'Reassign',
                    () => !this.isEdit,
                    'reassign',
                ),
            );
        }
    }

    handleGridZoomAction(action: string) {
        switch (action) {
            case 'deassign':
                this.gridEnlargementComponent.mapSelectedRowInGridOptions(this.charterGridOptions);
                this.onActionButtonClicked();
                break;
            case 'reassign':
                this.gridEnlargementComponent.mapSelectedRowInGridOptions(this.charterGridOptions);
                this.onReassignSideNavOpenClicked();
                break;
            case 'updateCost':
                this.gridEnlargementComponent.mapSelectedRowInGridOptions(this.charterGridOptions);
                this.onUpdateCostsButtonClicked();
                break;
            default: break;
        }
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    onReassignSideNavOpenClicked() {
        this.isReassignedButtonClicked.emit(true);
        this.reassignContractFromSection();
    }

    getAllSelectedRows() {
        let assignedSections: AssignedSectionView[];
        assignedSections = this.gridApi.getSelectedRows();
        this.model.assignedSections = assignedSections;
    }

    reassignContractFromSection() {
        this.getAllSelectedRows();
        if (this.model.assignedSections.length > 0 || this.fullyInvoiceContract.length > 0) {
            this.sideReassignNavOpened = true;
            this.atlasNewReassign.reassignCharterGridRows(this.model);
        } else {
            this.snackbarService.informationSnackBar('No Contract Selected.');
            this.sideReassignNavOpened = false;
        }
    }

    lockContracts(sectionId: number) {
        this.sideReassignNavOpened = false;
        this.lockService.isLockedContract(sectionId).pipe(takeUntil(this.destroy$)).subscribe((lock: IsLocked) => {
            if (lock.isLocked) {
                this.sideReassignNavOpened = false;
                this.dialog.open(ConfirmationDialogComponent, {
                    data: {
                        title: 'Lock',
                        text: lock.message,
                        okButton: 'Got it',
                    },
                });
                this.locking = this.locking.filter((id) => id !== sectionId);

            } else {
                this.lockService.lockContract(sectionId, LockFunctionalContext.TradeReassignment)
                    .pipe(takeUntil(this.destroy$))
                    .subscribe((lockState) => {
                        this.refeshResourceInformation();
                        this.locking = this.locking.filter((id) => id !== sectionId);
                    });
            }
        });
    }

    onUpdateCostsButtonClicked() {
        this.bulkActionTypeId = GroupFunctionTypes.Costs;
        this.router.navigate(['/' + this.companyManager.getCurrentCompanyId() +
            '/trades/bulkActions/costs/' + encodeURIComponent(String(this.bulkActionTypeId)) +
            '/' + encodeURIComponent(String(this.charterId))]);
    }
}
