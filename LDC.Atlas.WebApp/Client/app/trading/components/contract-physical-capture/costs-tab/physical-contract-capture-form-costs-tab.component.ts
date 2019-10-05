import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import * as agGrid from 'ag-grid-community';
import { Observable } from 'rxjs';
import { concatMap } from 'rxjs/operators';
import { AuthorizationService } from '../../../../core/services/authorization.service';
import { CompanyManagerService } from '../../../../core/services/company-manager.service';
import { CommonMethods } from '../../../../execution/services/execution-cash-common-methods';
import { AgContextualMenuComponent } from '../../../../shared/components/ag-contextual-menu/ag-contextual-menu.component';
import { AgGridCheckboxComponent } from '../../../../shared/components/ag-grid-checkbox/ag-grid-checkbox.component';
import { AgGridAutocompleteComponent } from '../../../../shared/components/ag-grid/autocomplete/ag-grid-autocomplete.component';
import { AgGridContextualSearchComponent } from '../../../../shared/components/ag-grid/contextual-search/ag-grid-contextual-search.component';
import { BaseFormComponent } from '../../../../shared/components/base-form-component/base-form-component.component';
import { CellEditorNumericComponent } from '../../../../shared/components/cell-editor-numeric/cell-editor-numeric.component';
import { CellEditorSelectComponent } from '../../../../shared/components/cell-editor-select/cell-editor-select.component';
import { ConfirmationDialogComponent } from '../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { GridEnlargementComponent } from '../../../../shared/components/grid-enlargement/grid-enlargement.component';
import { AgContextualMenuAction } from '../../../../shared/entities/ag-contextual-menu-action.entity';
import { AtlasAgGridParam } from '../../../../shared/entities/atlas-ag-grid-param.entity';
import { AtlasContextualAction } from '../../../../shared/entities/atlas-contextual-action.entity';
import { AtlasFormControl } from '../../../../shared/entities/atlas-form-control';
import { CostDirection } from '../../../../shared/entities/cost-direction.entity';
import { Cost } from '../../../../shared/entities/cost.entity';
import { MasterData } from '../../../../shared/entities/masterdata.entity';
import { RateType } from '../../../../shared/entities/rate-type.entity';
import { Tag } from '../../../../shared/entities/tag.entity';
import { UserGridPreferencesParameters } from '../../../../shared/entities/user-grid-preferences-parameters.entity';
import { ContractStatus } from '../../../../shared/enums/contract-status.enum';
import { CostDirections } from '../../../../shared/enums/cost-direction.enum';
import { Gaps } from '../../../../shared/enums/gaps.enum';
import { PermissionLevels } from '../../../../shared/enums/permission-level.enum';
import { RateTypes } from '../../../../shared/enums/rate-type.enum';
import { SectionCompleteDisplayView } from '../../../../shared/models/section-complete-display-view';
import { CustomNumberMask } from '../../../../shared/numberMask';
import { FormatDatePipe } from '../../../../shared/pipes/format-date-pipe.pipe';
import { AgGridService } from '../../../../shared/services/ag-grid.service';
import { UserCompanyPrivilegeDto } from '../../../../shared/services/authorization/dtos/user-company-privilege';
import { FormConfigurationProviderService } from '../../../../shared/services/form-configuration-provider.service';
import { GridConfigurationProviderService } from '../../../../shared/services/grid-configuration-provider.service';
import { ExecutionService } from '../../../../shared/services/http-services/execution.service';
import { FeatureFlagService } from '../../../../shared/services/http-services/feature-flag.service';
import { MasterdataService } from '../../../../shared/services/http-services/masterdata.service';
import { TradingService } from '../../../../shared/services/http-services/trading.service';
import { SecurityService } from '../../../../shared/services/security.service';
import { SnackbarService } from '../../../../shared/services/snackbar.service';
import { Costmatrix } from '../../../../shared/services/trading/dtos/costmatrix';
import { CostmatrixLine } from '../../../../shared/services/trading/dtos/costmatrixLine';
import { PhysicalFixedPricedContract } from '../../../entities/physical-fixed-priced-contract.entity';
import { FlagInfo } from './../../../../shared/dtos/flag-info';
import { AddCostConfirmationDialogComponent } from './add-cost-confirmation-dialog/add-cost-confirmation-dialog.component';
import { CostInvoiceMarkingDialogComponent } from './cost-invoice-marking-dialog/cost-invoice-marking-dialog.component';
import { CostMatrixDialogComponent } from './cost-matrix-dialog/cost-matrix-dialog.component';
import { CostListDisplayView } from './costs-ag-grid-row';
@Component({
    selector: 'atlas-physical-contract-capture-form-costs-tab',
    templateUrl: './physical-contract-capture-form-costs-tab.component.html',
    styleUrls: ['./physical-contract-capture-form-costs-tab.component.scss'],
    providers: [DatePipe],
})
export class PhysicalContractCaptureFormCostsTabComponent extends BaseFormComponent implements OnInit {
    useCostMatrixCtrl = new AtlasFormControl('useCostMatrix');
    @ViewChild('gridZoom') gridEnlargementComponent: GridEnlargementComponent;
    @ViewChild('costMatrixDialogComponent') costMatrixDialogComponent: CostMatrixDialogComponent;
    @ViewChild('addCostConfirmationDialogComponent') addCostConfirmationDialogComponent: AddCostConfirmationDialogComponent;
    @Input() readonly commodityFormGroup: FormGroup;
    @Output() readonly noOfZeroCostRow = new EventEmitter<any>();
    @Output() readonly costInvoiced = new EventEmitter<any>();

    costsMenuActions: { [key: string]: string } = {
        deleteCost: 'delete',
        addCost: 'add',
        transferToSplits: 'transfer',
    };

    model: SectionCompleteDisplayView = new SectionCompleteDisplayView();
    costsGridContextualMenuActions: AgContextualMenuAction[];
    costsGridCols: agGrid.ColDef[];
    costsGridColsGap003: agGrid.ColDef[];
    costsGridRows: CostListDisplayView[] = [];
    costGridOptions: agGrid.GridOptions = {};
    gridApi: agGrid.GridApi;
    gridColumnApi: agGrid.ColumnApi;
    atlasAgGridParam: AtlasAgGridParam;
    masterdata: MasterData;
    rateTypes: RateType[] = [
        {
            code: RateTypes[RateTypes.Rate],
            description: '',
        },
        {
            code: RateTypes[RateTypes.Amount],
            description: '',
        },
        {
            code: RateTypes[RateTypes.Percent],
            description: '',
        },
    ];;
    company: string;
    costMatrix: Costmatrix[];
    costMatrixLine: CostmatrixLine[];
    filteredLines: CostmatrixLine[] = [];
    isSummaryView: boolean = false;
    importedCostMatrices: string = '';
    selectCostmatrix: string;
    costMatrixId: number;
    isTradeEdit: boolean = true;
    isZeroRowExist: boolean = false;
    contractAmountOnSelect: number;
    sectionId: number;
    isTransferToCostsEnabled: boolean = true;
    isCancelledTrade: boolean = false;
    formatType: string = 'en-US';
    editInPNLPrivilege: UserCompanyPrivilegeDto = {
        profileId: null,
        privilegeName: 'COSTSINP&L',
        permission: PermissionLevels.ReadWrite,
        privilegeParentLevelOne: 'Trades',
        privilegeParentLevelTwo: 'CostTab',
    };
    editNoActionPrivilege: UserCompanyPrivilegeDto = {
        profileId: null,
        privilegeName: 'COSTSNOACT',
        permission: PermissionLevels.ReadWrite,
        privilegeParentLevelOne: 'Trades',
        privilegeParentLevelTwo: 'CostTab',
    };
    deletePrivilege: UserCompanyPrivilegeDto = {
        profileId: null,
        privilegeName: 'COSTSDEL',
        permission: PermissionLevels.ReadWrite,
        privilegeParentLevelOne: 'Trades',
        privilegeParentLevelTwo: 'CostTab',
    };
    editEstimatedColumnsPrivilege: UserCompanyPrivilegeDto = {
        profileId: null,
        privilegeName: 'COSTSORIGEST',
        permission: PermissionLevels.ReadWrite,
        privilegeParentLevelOne: 'Trades',
        privilegeParentLevelTwo: 'CostTab',
    };

    editingCostGrid: UserCompanyPrivilegeDto = {
        profileId: null,
        privilegeName: 'EditingCostGrid',
        permission: PermissionLevels.ReadWrite,
        privilegeParentLevelOne: 'Trades',
        privilegeParentLevelTwo: 'CostTab',
    };
    editPercentageInvoicedPrivilege: UserCompanyPrivilegeDto = {
        profileId: null,
        privilegeName: 'EditPercentageInvoiced',
        permission: PermissionLevels.ReadWrite,
        privilegeParentLevelOne: 'Trades',
        privilegeParentLevelTwo: 'CostTab',
    };
    ifAuthorized: string;
    costDirections: CostDirection[] = [
        {
            costDirectionId: CostDirections.Payable,
            costDirection: 'Pay',
        },
        {
            costDirectionId: CostDirections.Receivable,
            costDirection: 'Receive',
        },
    ];
    gridComponents = {
        atlasSelect: CellEditorSelectComponent,
        atlasNumeric: CellEditorNumericComponent,
        atlasCheckbox: AgGridCheckboxComponent,
    };
    gridContext = {
        isContractApprovedOnce: false,
        contractStatus: '',
        gridEditable: true,
        editPrivileges: true,
        deletePrivileges: true,
        inPNLPrivileges: true,
        noACTPrivileges: true,
        percentageInvoiced: true,
    };
    hasRecommendCMGap: boolean;
    gaps = Gaps;
    isBestMatch: string;
    isTradeImage = false;
    userActiveDirectoryName: string;
    isImageCostChecked: boolean = true;
    isHideCost = true;
    dataVersionId: number;
    editingCostGridPrivilege: boolean = false;
    isImage = false;
    componentId: string = 'tradeCostList';
    zeroQuantity: boolean = false;
    priceCode: string;
    weightCode: string;
    PermissionLevels = PermissionLevels;

    gridPreferences: UserGridPreferencesParameters = new UserGridPreferencesParameters();
    gridZoomAdditionalActions: AtlasContextualAction[] = [];

    tagsList: any;
    flagAuth: FlagInfo;

    constructor(
        protected masterdataService: MasterdataService,
        protected formConfigurationProvider: FormConfigurationProviderService,
        protected formBuilder: FormBuilder,
        private companyManager: CompanyManagerService,
        protected dialog: MatDialog,
        private snackbarService: SnackbarService,
        protected tradingService: TradingService,
        protected executionService: ExecutionService,
        private authorizationService: AuthorizationService,
        private formatDate: FormatDatePipe,
        protected route: ActivatedRoute,
        protected router: Router,
        protected securityService: SecurityService,
        private gridConfigurationProvider: GridConfigurationProviderService,
        public gridService: AgGridService,
        protected featureFlagService: FeatureFlagService,
    ) {
        super(formConfigurationProvider);
        this.masterdata = this.route.snapshot.data.masterdata;
        this.getTagFields();
        this.userActiveDirectoryName = this.authorizationService.getCurrentUser().samAccountName;
    }

    ngOnInit() {
        this.sectionId = this.route.snapshot.params.sectionId;
        this.atlasAgGridParam = this.gridService.getAgGridParam();
        this.company = this.companyManager.getCurrentCompanyId();
        const companyDetails = this.companyManager.getCurrentCompany();
        this.priceCode = companyDetails.priceCode;
        this.weightCode = companyDetails.weightCode;
        this.checkGridEditPrivilege();
        this.dataVersionId = this.route.snapshot.params['dataVersionId'] ? Number(this.route.snapshot.params['dataVersionId']) : null;
        if (this.route.snapshot.data['isImage'] === true) {
            this.isImage = true;
            this.isHideCost = JSON.parse(this.route.snapshot.queryParams.imageEstimates);
        }

        this.init();

        this.bindConfiguration();

        this.featureFlagService.getFlagInfo(Gaps.gap003).subscribe(
            (flagAuth) => {
                this.flagAuth = flagAuth;

                this.isRecommendedCostMatrixGapActive();
                this.initCostsGridColumns();
            },
            (error) => {
                this.hasRecommendCMGap = false;
            },
        );

        this.securityService
            .isSecurityReady()
            .pipe(
                concatMap(() => {
                    return this.gridConfigurationProvider.getConfiguration(this.company, this.componentId);
                }),
            )
            .subscribe();
    }

    onGridReady(params) {
        this.costGridOptions = params;
        if (this.costsGridCols) {
            this.costGridOptions.columnDefs = this.costsGridCols;
        }
        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;

        this.gridService.sizeColumns(this.costGridOptions);
    }

    init() {
        this.costsGridContextualMenuActions = [
            {
                icon: 'delete',
                text: 'Delete',
                action: this.costsMenuActions.deleteCost,
                disabled: this.isDeleteDisabledWithPrivileges.bind(this),
            },
        ];
        this.importedCostMatrices = '';
        this.selectCostmatrix = '';

        this.gridPreferences = {
            company: this.company,
            gridId: this.componentId,
            gridOptions: this.costGridOptions,
            sharingEnabled: false, // this.hasGridSharing,
            showExport: true,
        };
    }

    handleAction(action: string, cost: CostListDisplayView = null) {
        switch (action) {
            case this.costsMenuActions.deleteCost:
                const confirmDialog = this.dialog.open(ConfirmationDialogComponent, {
                    data: {
                        title: 'Cost Deletion',
                        text: 'Deleting a cost is permanent. Do you wish to proceed?',
                        okButton: 'Delete anyway',
                        cancelButton: 'Cancel',
                    },
                });
                const confirmationSubscription = confirmDialog.afterClosed().subscribe((answer) => {
                    if (answer) {
                        if (cost.costId) {
                            const deleteConfirmationSubscription =
                                this.tradingService.deleteCost(cost.costId, cost.sectionId, this.dataVersionId)
                                    .subscribe(
                                        () => {
                                            this.snackbarService.informationSnackBar('Cost Deleted');
                                            this.getCosts(cost.sectionId);
                                        },
                                        (err) => {
                                            this.dialog.open(ConfirmationDialogComponent, {
                                                data: {
                                                    title: 'DELETION',
                                                    text: 'Cannot delete cost of this split',
                                                    okButton: 'Got it',
                                                },
                                            });
                                        });
                            this.subscriptions.push(deleteConfirmationSubscription);
                        } else {
                            this.gridApi.updateRowData({ remove: [cost] });
                        }
                    }
                });
                this.subscriptions.push(confirmationSubscription);
                break;
            case this.costsMenuActions.addCost:
                const newItem = this.createNewRowData();
                this.costsGridRows.push(newItem);
                this.gridApi.setRowData(this.costsGridRows);
                this.gridEnlargementComponent.refreshGrid();
                break;
            case this.costsMenuActions.transferToSplits:
                this.navigateToCostTransferPage();
                break;
            default:
                throw new Error('Unknown action: ' + action);
        }
    }

    isRecommendedCostMatrixGapActive() {
        if (this.flagAuth) {
            this.hasRecommendCMGap = this.flagAuth.active;
        }
    }

    getCosts(sectionId: number) {
        const getCostsSubscription = this.tradingService.getAllCosts(sectionId, this.dataVersionId).subscribe((data) => {
            this.costsGridRows = [];

            data.value.forEach((element) => {
                const displayCostRow = new CostListDisplayView(element, this.masterdata, this.costDirections);
                this.costsGridRows.push(displayCostRow);
                if (!this.importedCostMatrices.includes(element.costMatrixName)) {
                    this.importedCostMatrices = this.importedCostMatrices + element.costMatrixName + ' , ';
                }
            });
            this.gridApi.setRowData(this.costsGridRows);
            this.useCostMatrixCtrl.setValue(this.importedCostMatrices.trim().slice(0, -1));
        });

        this.subscriptions.push(getCostsSubscription);
    }

    populateEntity(entity: any) {
        const physicalFixedPricedContract = entity as PhysicalFixedPricedContract;
        physicalFixedPricedContract.costs = this.getGridData();
        return physicalFixedPricedContract;
    }

    validate(): boolean {
        let isValid = true;
        this.gridApi.forEachNode((rowData) => {
            if (rowData.data.isDirty) {
                if (!(rowData.data.costTypeCode && rowData.data.costDirection && rowData.data.currencyCode && rowData.data.rateTypeCode)) {
                    isValid = false;
                }
            }
        });
        return isValid;
    }

    initGridZoom() {
        // Transfer to Splits Button
        this.gridZoomAdditionalActions.push(
            new AtlasContextualAction(
                'Transfer to Splits',
                () => !this.isTransferToCostsEnabled,
                this.costsMenuActions.transferToSplits,
            ),
        );

        // -- Add Cost Button
        const addCostPrivilegeLevel = this.authorizationService.getPermissionLevel(
            this.company,
            this.editingCostGrid.privilegeName,
            this.editingCostGrid.privilegeParentLevelOne,
            this.editingCostGrid.privilegeParentLevelTwo,
        );

        const hasAddCostPrivilege = addCostPrivilegeLevel >= PermissionLevels.ReadWrite;

        if (hasAddCostPrivilege) {
            this.gridZoomAdditionalActions.push(
                new AtlasContextualAction(
                    'Add Cost',
                    () => !this.isTradeEdit,
                    this.costsMenuActions.addCost,
                )
            );
        }
    }

    initForm(entity: any, isEdit: boolean): any {
        const tradeRecord = new SectionCompleteDisplayView(entity);
        this.model = tradeRecord;
        this.isCancelledTrade = this.model.isCancelled;
        this.sectionId = this.model.sectionId;
        this.isTradeEdit = isEdit;
        let isContractApprovedOnce: boolean = false;
        isContractApprovedOnce = tradeRecord.firstApprovalDateTime ? true : false;
        let contractStatus: string;
        contractStatus = tradeRecord.status;
        this.isTransferToCostsEnabled =
            entity.childSections && entity.childSections.length > 0 && (entity.costs && entity.costs.length > 0) ? true : false;
        if (this.isHideCost) {
            const costsToAdd = [];
            this.model.costs.forEach((element) => {
                if (this.isImage) {
                    // estimates shouldn't get copied while imaging a trade
                    element.originalEstRate = null;
                    element.originalEstCurrencyCode = null;
                    element.originalEstPriceUnitId = null;
                    element.originalEstRateTypeId = null;
                    element.originalEstimatedPMTValue = null;
                }
                const displayCostRow = new CostListDisplayView(element, this.masterdata, this.costDirections);
                costsToAdd.push(displayCostRow);
                if (element.costMatrixName && !this.importedCostMatrices.includes(element.costMatrixName)) {
                    this.importedCostMatrices = this.importedCostMatrices + element.costMatrixName + ' , ';
                }
                if (displayCostRow.rate === 0) {
                    this.isZeroRowExist = true;
                }
            });
            this.costsGridRows = costsToAdd;
            this.useCostMatrixCtrl.setValue(this.importedCostMatrices.trim().slice(0, -1));
        }
        this.gridContext.isContractApprovedOnce = isContractApprovedOnce;
        this.gridContext.contractStatus = contractStatus;
        this.gridContext.gridEditable = isEdit && this.editingCostGridPrivilege ? true : false;
        this.gridContext.editPrivileges = this.checkIfUserHasRequiredPrivileges(this.editEstimatedColumnsPrivilege);
        this.gridContext.deletePrivileges = this.checkIfUserHasRequiredPrivileges(this.deletePrivilege);
        this.gridContext.inPNLPrivileges = this.checkIfUserHasRequiredPrivileges(this.editInPNLPrivilege);
        this.gridContext.percentageInvoiced = this.checkIfUserHasRequiredPrivileges(this.editPercentageInvoicedPrivilege);
        this.gridContext.noACTPrivileges = this.checkIfUserHasRequiredPrivileges(this.editNoActionPrivilege);
        if (this.isImage) {
            this.costMatrixId = this.route.snapshot.queryParams.costMatrixId;
            if (this.costMatrixId) {
                this.imageCostMatrixTrade(this.costMatrixId);
            }
        }
        this.noOfZeroCostRow.emit({
            isZeroRowExist: this.isZeroRowExist,
        });
        this.costInvoiced.emit(this.costsGridRows);

        // --
        this.initGridZoom();
        return entity;
    }

    checkIfUserHasRequiredPrivileges(userCompanyPrivilege: UserCompanyPrivilegeDto) {
        if (this.authorizationService.isUserAllowedForCompany(this.company)) {
            const userPermissionLevel = this.authorizationService.getPermissionLevel(
                this.company,
                userCompanyPrivilege.privilegeName,
                userCompanyPrivilege.privilegeParentLevelOne,
                userCompanyPrivilege.privilegeParentLevelTwo,
            );
            if (userPermissionLevel >= userCompanyPrivilege.permission) {
                return true;
            }
        }
        return false;
    }

    isGridEditable(params) {
        // cannot edit the data of a cost if it has been fully invoiced
        this.gridContext.editPrivileges = this.checkIfUserHasRequiredPrivileges(this.editingCostGrid);
        this.gridContext.gridEditable = this.gridContext.editPrivileges ? true : false;
        if (this.isCancelledTrade && params && params.colDef.field === 'costTypeCode') {
            const paramCostType = this.masterdata.costTypes.find((c) => c.costTypeCode === params.data.costTypeCode);
            if (
                (paramCostType !== null && !paramCostType.isACommission) ||
                (paramCostType.isACommission)
            ) {
                return false;
            }
        }

        return this.isColumnEditable(params);
    }

    isColumnEditable(params) {
        this.gridContext.gridEditable = this.isTradeEdit;
        return (
            this.gridContext.gridEditable &&
            (params.data.invoicePercent === undefined || params.data.invoicePercent < 100)
        );
    }

    isColumnEditableCheckingCostTypeAndCancelledTrade(params) {
        if (this.isCancelledTrade) {
            const paramCostType = this.masterdata.costTypes.find((c) => c.costTypeCode === params.data.costTypeCode);
            if (!paramCostType.isACommission) {
                return false;
            }
        }
        return true;
    }

    isGridColumnEditableWithPrivileges(params) {
        return (this.isColumnEditable(params) &&
            this.isColumnEditableCheckingCostTypeAndCancelledTrade(params) &&
            this.gridContext.editPrivileges
        );
    }

    isGridCheckboxEditableWithPrivileges(params) {
        return !this.isGridColumnEditableWithPrivileges(params);
    }

    isInPNLEditableWithPrivileges(params) {
        return !(this.isColumnEditable(params) && this.gridContext.inPNLPrivileges
            && this.isColumnEditableCheckingCostTypeAndCancelledTrade(params));
    }

    noACTEditableWithPrivileges(params) {
        return !(this.isColumnEditable(params) &&
            this.gridContext.noACTPrivileges);
    }

    isDeleteDisabledWithPrivileges(params) {
        const costRow = params.data as CostListDisplayView;
        if (!costRow.costId) {
            return false;
        }
        let deleteDisable = true;
        if (params.context.actionContext.gridEditable) {
            if (!params.context.isContractApprovedOnce) {
                deleteDisable = false;
            } else if (
                params.context.isContractApprovedOnce &&
                params.context.actionContext.deletePrivileges &&
                params.context.contractStatus === ContractStatus[ContractStatus.Approved]
            ) {
                deleteDisable = false;
            }
        }
        return deleteDisable && this.isColumnEditable(params) && !this.isColumnEditableCheckingCostTypeAndCancelledTrade(params);
    }

    getGridData(): Cost[] {
        const costs = new Array<Cost>();
        const masterdata = this.masterdata;
        const costDirections = this.costDirections;
        this.gridApi.forEachNode((rowData) => {
            const costData: CostListDisplayView = rowData.data;
            if (costData.isDirty || (this.isTradeImage && this.isImageCostChecked) || this.zeroQuantity) {
                costs.push(costData.getCost(masterdata, costDirections));
            }
        });
        return costs;
    }

    onCellValueChanged(params) {
        if (params.oldValue !== params.newValue) {
            params.node.data.isDirty = true;
            params.node.setDataValue('rowStatus', params.node.data.costId ? 'U' : 'N');
            this.gridColumnApi.autoSizeAllColumns();
        }
    }

    showCostInvoiceMarking(costId: number) {
        const openInvoiceMarkingCostDialog = this.dialog.open(CostInvoiceMarkingDialogComponent, {
            data: {
                masterdata: this.masterdata,
                costId,
                model: this.model,
                company: this.company,
                dataVersionId: this.dataVersionId,
            },
            width: '90%',
            height: '80%',
        });

        openInvoiceMarkingCostDialog.afterClosed().subscribe((result: boolean) => {
            if (result) {
                this.gridApi.stopEditing();
            }
        });
    }

    onAddRowButtonClicked() {
        if (this.model.originalQuantity === 0 || this.contractAmountOnSelect === 0) {
            this.snackbarService.throwErrorSnackBar('You Cannot Add costs to a contract with Zero Quantity');
        } else {
            const newItem = this.createNewRowData();

            this.costsGridRows.push(newItem);
            this.gridApi.setRowData(this.costsGridRows);

            this.gridColumnApi.autoSizeAllColumns();
        }
    }

    createNewRowData() {
        const newCostRow = new CostListDisplayView();
        newCostRow.isDirty = true;
        newCostRow.currencyCode = 'USD';
        newCostRow.rowStatus = 'N';
        return newCostRow;
    }

    initCostsGridColumns() {
        this.costGridOptions.context = this.gridContext;
        this.gridPreferences.gridOptions = this.costGridOptions;
        this.gridPreferences = new UserGridPreferencesParameters(this.gridPreferences);
        if (this.flagAuth.active === true) {
            this.costsGridCols = [
                {
                    headerName: '',
                    colId: 'rowStatus',
                    field: 'rowStatus',
                    width: 70,
                    minWidth: 70,
                    maxWidth: 70,
                    cellRenderer: (params) => {
                        if (params.value) {
                            return '<mat-chip-list><mat-chip class="status-flag-chip">' + params.value
                                + '</mat-chip></mat-chip-list>';
                        }
                        return '';
                    },
                },
                {
                    headerName: 'Best Match',
                    colId: 'bestMatch',
                    field: 'bestMatch',
                    cellRenderer: (params) => {
                        if (params.value) {
                            return '<mat-chip-list><mat-chip class="status-flag-chip">' + params.value +
                                '</mat-chip></mat-chip-list>';
                        }
                        return '';
                    },
                },
                {
                    colId: 'costId',
                    field: 'costId',
                    hide: true,
                },
                {
                    headerName: 'Cost Type*',
                    field: 'costTypeCode',
                    colId: 'costTypeCode',
                    cellRendererFramework: AgGridContextualSearchComponent,
                    cellRendererParams: (params) => {
                        return {
                            context: {
                                componentParent: this,
                                gridEditable: this.isGridEditable(params),
                            },
                            gridId: 'costTypesGrid',
                            options: this.masterdata.costTypes
                                .filter((cost) => cost.isATradeCost === true)
                                .sort((a, b) => a.costTypeCode.localeCompare(b.costTypeCode)),
                            valueProperty: 'costTypeCode',
                            displayProperty: 'costTypeCode',
                            lightBoxTitle: 'Results for Cost Type',
                            isRequired: true,
                            showContextualSearchIcon: this.isGridEditable(params),
                        };
                    },
                    onCellValueChanged: (params) => {
                        if (this.isTradeEdit) {
                            const filteredCostType = this.masterdata.costTypes.find((e) => e.costTypeCode === params.data.costTypeCode);

                            if (filteredCostType) {
                                params.node.setDataValue('description', filteredCostType.name);
                                params.node.setDataValue('inPL', filteredCostType.inPNL);
                                params.node.setDataValue('noAction', filteredCostType.noAction);
                            }
                        }
                    },
                },
                {
                    headerName: 'Description',
                    field: 'description',
                    width: 250,
                },
                {
                    headerName: 'Supplier',
                    field: 'supplierCode',
                    cellRendererFramework: AgGridContextualSearchComponent,
                    cellRendererParams: (params) => {
                        return {
                            context: {
                                componentParent: this,
                                gridEditable: this.isGridEditable(params),
                            },
                            gridId: 'counterpartiesGrid',
                            options: this.masterdata.counterparties,
                            isRequired: false,
                            displayProperty: 'counterpartyCode',
                            valueProperty: 'counterpartyCode',
                            descriptionProperty: 'description',
                            codeProperty: 'counterpartyCode',
                            lightBoxTitle: 'Results for Counterparty',
                            showContextualSearchIcon: this.isGridEditable(params),
                        };
                    },
                    onCellValueChanged: (params) => {
                        if ((params.data.supplierCode || params.data.supplierCode === '') && this.masterdata.counterparties) {
                            const selectedClientAccount = this.masterdata.counterparties.find(
                                (clientAccount) => clientAccount.counterpartyCode === params.data.supplierCode,
                            );
                            if (selectedClientAccount) {
                                params.node.data.isDirty = true;
                            } else if (params.data.supplierCode === '') {
                                params.node.data.isDirty = true;
                            }
                        }
                    },
                    width: 120,
                },
                {
                    headerName: 'Pay/Rec*',
                    field: 'costDirection',
                    editable: this.isGridEditable.bind(this),
                    cellRenderer: this.requiredCell,
                    cellEditor: 'agRichSelectCellEditor',
                    cellEditorParams: {
                        values: this.costDirections.map((costDirection) => costDirection.costDirection),
                        displayPropertyName: 'costDirection',
                        valuePropertyName: 'costDirection',
                        displayFormat: 'costDirection',
                    },
                    width: 120,
                },
                {
                    headerName: 'Currency*',
                    field: 'currencyCode',
                    colId: 'currencyCode',
                    cellRendererFramework: AgGridAutocompleteComponent,
                    cellRendererParams: (params) => {
                        return {
                            context: {
                                componentParent: this,
                                gridEditable: this.isGridEditable(params),
                            },
                            options: this.masterdata.currencies,
                            valueProperty: 'currencyCode',
                            codeProperty: 'currencyCode',
                            displayProperty: 'description',
                            isRequired: true,
                        };
                    },
                    onCellValueChanged: (params) => {
                        if (params.data.currencyCode && this.masterdata.currencies) {
                            const currencyCode = this.masterdata.currencies.find(
                                (currency) => currency.currencyCode === params.data.currencyCode,
                            );
                            if (currencyCode) {
                                params.node.setDataValue('currencyCode', params.data.currencyCode);
                                params.node.data.isDirty = true;
                            }
                        }
                    },
                    width: 120,
                },
                {
                    headerName: 'Rate Type*',
                    field: 'rateTypeCode',
                    editable: this.isGridEditable.bind(this),
                    cellRenderer: this.requiredCell,
                    cellEditor: 'agRichSelectCellEditor',
                    cellEditorParams: {
                        values: this.rateTypes.map((rateType) => rateType.code),
                        valuePropertyName: 'code',
                        displayFormat: 'code',
                        context: this.masterdata,
                    },
                    onCellValueChanged: this.onRateTypeChange.bind(this),
                    width: 120,
                },
                {
                    headerName: 'Price Code',
                    field: 'priceCode',
                    colId: 'priceCode',
                    editable: this.isPriceCodeEditable.bind(this),
                    cellEditor: 'agRichSelectCellEditor',
                    cellRenderer: this.priceCodeRequired.bind(this),
                    cellEditorParams: {
                        values: this.masterdata.priceUnits.map((priceUnit) => priceUnit.priceCode),
                        displayPropertyName: 'description',
                        valuePropertyName: 'priceCode',
                        displayFormat: 'priceCode | description',
                        context: this.masterdata,
                    },
                    width: 120,
                },
                {
                    headerName: 'Rate/Amount',
                    field: 'rate',
                    editable: this.isGridEditable.bind(this),
                    cellEditor: 'atlasNumeric',
                    type: 'numberColumn',
                    onCellValueChanged: this.onRateAmountChanged.bind(this),
                    cellEditorParams: {
                        displayMask: CustomNumberMask(12, 10, false),
                        isRightAligned: false,
                    },
                    valueFormatter: this.amountFormatter.bind(this),
                    width: 120,
                },
                {
                    headerName: 'Orig. Est. ' + this.priceCode,
                    field: 'originalEstimatedPMTValue',
                    type: 'numberColumn',
                    valueFormatter: this.amountFormatter.bind(this),
                    editable: this.isGridColumnEditableWithPrivileges.bind(this),
                    width: 120,
                },
                {
                    headerName: 'in P&L',
                    field: 'inPL',
                    colId: 'inPL',
                    cellRenderer: 'atlasCheckbox',
                    cellRendererParams: {
                        disabled: this.isInPNLEditableWithPrivileges.bind(this),
                        params: this.gridContext,
                    },
                    width: 120,
                },
                {
                    headerName: 'No Act',
                    field: 'noAction',
                    colId: 'noAction',
                    cellRenderer: 'atlasCheckbox',
                    cellRendererParams: {
                        disabled: this.noACTEditableWithPrivileges.bind(this),
                        params: this.gridContext,
                    },
                    width: 120,
                },
                {
                    headerName: 'Narrative',
                    field: 'narrative',
                    editable: this.isGridEditable.bind(this),
                    cellEditor: 'agLargeTextCellEditor',
                    cellEditorParams: {
                        maxLength: 100,
                        rows: 3,
                        cols: 50,
                    },
                    width: 120,
                },
                {
                    headerName: 'Matrix Name',
                    field: 'costMatrixName',
                    width: 120,
                },
                {
                    headerName: 'Orig.Est.Rate Type',
                    field: 'originalEstRateTypeCode',
                    editable: this.isGridColumnEditableWithPrivileges.bind(this),
                    width: 120,
                },
                {
                    headerName: 'Orig.Est.Price Code',
                    field: 'originalEstPriceCode',
                    editable: this.isGridColumnEditableWithPrivileges.bind(this),
                    width: 120,
                },
                {
                    headerName: 'Orig.Est.Currency',
                    field: 'originalEstCurrencyCode',
                    editable: this.isGridColumnEditableWithPrivileges.bind(this),
                    width: 120,
                },
                {
                    headerName: 'Orig.Est.Rate/Amount',
                    field: 'originalEstRate',
                    editable: this.isGridColumnEditableWithPrivileges.bind(this),
                    type: 'numericColumn',
                    tooltip: this.showCellValue.bind(this),
                    cellEditorParams: {
                        displayMask: CustomNumberMask(12, 10, false),
                        isRightAligned: false,
                    },
                    valueFormatter: this.amountFormatter.bind(this),
                    width: 120,
                },
                {
                    headerName: '%Invoiced',
                    field: 'invoicePercent',
                    editable: this.isPercentageInvoiceEditable.bind(this),
                    tooltip: this.showInvoiceDetails.bind(this),
                    width: 120,
                    type: 'numericColumn',
                },
                {
                    headerName: '',
                    cellRendererFramework: AgContextualMenuComponent,
                    cellRendererParams: (params) => {
                        return {
                            context: {
                                componentParent: this,
                                actionContext: this.gridContext,
                            },
                            isDisabled: !this.gridContext.gridEditable,
                            menuActions: this.costsGridContextualMenuActions,
                        };
                    },
                    cellClass: 'ag-contextual-menu',
                    width: 80,
                    maxWidth: 80,
                },
            ];

        } else {
            this.costsGridCols = [
                {
                    headerName: '',
                    colId: 'rowStatus',
                    field: 'rowStatus',
                    width: 70,
                    minWidth: 70,
                    maxWidth: 70,
                    cellRenderer: (params) => {
                        if (params.value) {
                            return '<mat-chip-list><mat-chip class="status-flag-chip">' + params.value
                                + '</mat-chip></mat-chip-list>';
                        }
                        return '';
                    },
                },
                {
                    colId: 'costId',
                    field: 'costId',
                    hide: true,
                },
                {
                    headerName: 'Cost Type*',
                    field: 'costTypeCode',
                    colId: 'costTypeCode',
                    cellRendererFramework: AgGridContextualSearchComponent,
                    cellRendererParams: (params) => {
                        return {
                            context: {
                                componentParent: this,
                                gridEditable: this.isGridEditable(params),
                            },
                            gridId: 'costTypesGrid',
                            options: this.masterdata.costTypes
                                .filter((cost) => cost.isATradeCost === true)
                                .sort((a, b) => a.costTypeCode.localeCompare(b.costTypeCode)),
                            valueProperty: 'costTypeCode',
                            displayProperty: 'costTypeCode',
                            lightBoxTitle: 'Results for Cost Type',
                            isRequired: true,
                            showContextualSearchIcon: this.isGridEditable(params),
                        };
                    },
                    onCellValueChanged: (params) => {
                        if (this.isTradeEdit) {
                            const filteredCostType = this.masterdata.costTypes
                                .find((e) => e.costTypeCode === params.data.costTypeCode);

                            if (filteredCostType) {
                                params.node.setDataValue('description', filteredCostType.name);
                                params.node.setDataValue('inPL', filteredCostType.inPNL);
                                params.node.setDataValue('noAction', filteredCostType.noAction);
                            }
                        }
                    },
                },
                {
                    headerName: 'Description',
                    field: 'description',
                    width: 250,
                },
                {
                    headerName: 'Supplier',
                    field: 'supplierCode',
                    cellRendererFramework: AgGridContextualSearchComponent,
                    cellRendererParams: (params) => {
                        return {
                            context: {
                                componentParent: this,
                                gridEditable: this.isGridEditable(params),
                            },
                            gridId: 'counterpartiesGrid',
                            options: this.masterdata.counterparties,
                            isRequired: false,
                            displayProperty: 'counterpartyCode',
                            valueProperty: 'counterpartyCode',
                            descriptionProperty: 'description',
                            codeProperty: 'counterpartyCode',
                            lightBoxTitle: 'Results for Counterparty',
                            showContextualSearchIcon: this.isGridEditable(params),
                        };
                    },
                    onCellValueChanged: (params) => {
                        if ((params.data.supplierCode || params.data.supplierCode === '') && this.masterdata.counterparties) {
                            const selectedClientAccount = this.masterdata.counterparties.find(
                                (clientAccount) => clientAccount.counterpartyCode === params.data.supplierCode,
                            );
                            if (selectedClientAccount) {
                                params.node.data.isDirty = true;
                            } else if (params.data.supplierCode === '') {
                                params.node.data.isDirty = true;
                            }
                        }
                    },
                    width: 120,
                },
                {
                    headerName: 'Pay/Rec*',
                    field: 'costDirection',
                    editable: this.isGridEditable.bind(this),
                    cellRenderer: this.requiredCell,
                    cellEditor: 'agRichSelectCellEditor',
                    cellEditorParams: {
                        values: this.costDirections.map((costDirection) => costDirection.costDirection),
                        displayPropertyName: 'costDirection',
                        valuePropertyName: 'costDirection',
                        displayFormat: 'costDirection',
                    },
                    width: 120,
                },
                {
                    headerName: 'Currency*',
                    field: 'currencyCode',
                    colId: 'currencyCode',
                    cellRendererFramework: AgGridAutocompleteComponent,
                    cellRendererParams: (params) => {
                        return {
                            context: {
                                componentParent: this,
                                gridEditable: this.isGridEditable(params),
                            },
                            options: this.masterdata.currencies,
                            valueProperty: 'currencyCode',
                            codeProperty: 'currencyCode',
                            displayProperty: 'description',
                            isRequired: true,
                        };
                    },
                    onCellValueChanged: (params) => {
                        if (params.data.currencyCode && this.masterdata.currencies) {
                            const currencyCode = this.masterdata.currencies.find(
                                (currency) => currency.currencyCode === params.data.currencyCode,
                            );
                            if (currencyCode) {
                                params.node.setDataValue('currencyCode', params.data.currencyCode);
                                params.node.data.isDirty = true;
                            }
                        }
                    },
                    width: 120,
                },
                {
                    headerName: 'Rate Type*',
                    field: 'rateTypeCode',
                    editable: this.isGridEditable.bind(this),
                    cellRenderer: this.requiredCell,
                    cellEditor: 'agRichSelectCellEditor',
                    cellEditorParams: {
                        values: this.rateTypes.map((rateType) => rateType.code),
                        valuePropertyName: 'code',
                        displayFormat: 'code',
                        context: this.masterdata,
                    },
                    onCellValueChanged: this.onRateTypeChange.bind(this),
                    width: 120,
                },
                {
                    headerName: 'Price Code',
                    field: 'priceCode',
                    colId: 'priceCode',
                    editable: this.isPriceCodeEditable.bind(this),
                    cellEditor: 'agRichSelectCellEditor',
                    cellRenderer: this.priceCodeRequired.bind(this),
                    cellEditorParams: {
                        values: this.masterdata.priceUnits.map((priceUnit) => priceUnit.priceCode),
                        displayPropertyName: 'description',
                        valuePropertyName: 'priceCode',
                        displayFormat: 'priceCode | description',
                        context: this.masterdata,
                    },
                    width: 120,
                },
                {
                    headerName: 'Rate/Amount',
                    field: 'rate',
                    editable: this.isGridEditable.bind(this),
                    cellEditor: 'atlasNumeric',
                    type: 'numberColumn',
                    onCellValueChanged: this.onRateAmountChanged.bind(this),
                    cellEditorParams: {
                        displayMask: CustomNumberMask(12, 10, false),
                        isRightAligned: false,
                    },
                    valueFormatter: this.amountFormatter.bind(this),
                    width: 120,
                },
                {
                    headerName: 'Orig. Est./' + this.weightCode,
                    field: 'originalEstimatedPMTValue',
                    type: 'numberColumn',
                    valueFormatter: this.amountFormatter.bind(this),
                    editable: this.isGridColumnEditableWithPrivileges.bind(this),
                    width: 120,
                },
                {
                    headerName: 'in P&L',
                    field: 'inPL',
                    colId: 'inPL',
                    cellRenderer: 'atlasCheckbox',
                    cellRendererParams: (params) => {
                        return {
                            disabled: this.isInPNLEditableWithPrivileges(params),
                            params: this.gridContext,
                        };
                    },
                    width: 120,
                },
                {
                    headerName: 'No Act',
                    field: 'noAction',
                    colId: 'noAction',
                    cellRenderer: 'atlasCheckbox',
                    cellRendererParams: (params) => {
                        return {
                            disabled: this.noACTEditableWithPrivileges(params),
                            params: this.gridContext,
                        };
                    },
                    width: 120,
                },
                {
                    headerName: 'Narrative',
                    field: 'narrative',
                    editable: this.isGridEditable.bind(this),
                    cellEditor: 'agLargeTextCellEditor',
                    cellEditorParams: {
                        maxLength: 100,
                        rows: 3,
                        cols: 50,
                    },
                    width: 120,
                },
                {
                    headerName: 'Matrix Name',
                    field: 'costMatrixName',
                    width: 120,
                },
                {
                    headerName: 'Orig.Est.Rate Type',
                    field: 'originalEstRateTypeCode',
                    editable: this.isGridColumnEditableWithPrivileges.bind(this),
                    width: 120,
                },
                {
                    headerName: 'Orig.Est.Price Code',
                    field: 'originalEstPriceCode',
                    editable: this.isGridColumnEditableWithPrivileges.bind(this),
                    width: 120,
                },
                {
                    headerName: 'Orig.Est.Currency',
                    field: 'originalEstCurrencyCode',
                    editable: this.isGridColumnEditableWithPrivileges.bind(this),
                    width: 120,
                },
                {
                    headerName: 'Orig.Est.Rate/Amount',
                    field: 'originalEstRate',
                    editable: this.isGridColumnEditableWithPrivileges.bind(this),
                    type: 'numericColumn',
                    tooltip: this.showCellValue.bind(this),
                    cellEditorParams: {
                        displayMask: CustomNumberMask(12, 10, false),
                        isRightAligned: false,
                    },
                    valueFormatter: this.amountFormatter.bind(this),
                    width: 120,
                },
                {
                    headerName: '%Invoiced',
                    field: 'invoicePercent',
                    editable: this.isPercentageInvoiceEditable.bind(this),
                    tooltip: this.showInvoiceDetails.bind(this),
                    width: 120,
                    type: 'numericColumn',
                },
                {
                    headerName: '',
                    cellRendererFramework: AgContextualMenuComponent,
                    cellRendererParams: (params) => {
                        return {
                            context: {
                                componentParent: this,
                                actionContext: this.gridContext,
                            },
                            isDisabled: !this.gridContext.gridEditable,
                            menuActions: this.costsGridContextualMenuActions,
                        };
                    },
                    cellClass: 'ag-contextual-menu',
                    width: 80,
                    maxWidth: 80,
                },
            ];
        }

        if (this.costGridOptions) {
            this.costGridOptions.columnDefs = this.costsGridCols;
        }
    }

    onClientAccountSelected(params) {
        if (params.newValue && params.oldValue !== params.newValue && params.newValue) {
            const selectedClientAccount = this.masterdata.counterparties.find(
                (clientAccount) => clientAccount.counterpartyCode === params.newValue,
            );
            if (!selectedClientAccount) {
                this.snackbarService.throwErrorSnackBar('Not allowed : Client Account does not exist');
            }
        }
    }

    onCellClicked(params) {
        if (!this.isTradeEdit) {
            const invoiceCell = 'invoicePercent';
            const costRow = params.data as CostListDisplayView;
            if (params.colDef.field === invoiceCell) {
                if (params.data.costId) {
                    this.showCostInvoiceMarking(costRow.costId);
                } else {
                    this.gridApi.stopEditing();
                }
            }
        }
    }

    amountFormatter(param) {
        if (param && param.value) {
            const commonMethods = new CommonMethods();
            return commonMethods.getFormattedNumberValue(param.value, 2);
        }
    }

    onCostTypeChange(params) {
        const filteredCostType = params.colDef.cellEditorParams.context.costTypes.find((e) => e.costTypeCode === params.data.costTypeCode);

        if (filteredCostType) {
            params.node.setDataValue('description', filteredCostType.name);
            params.node.setDataValue('inPL', filteredCostType.inPNL);
            params.node.setDataValue('noAction', filteredCostType.noAction);
        }
    }

    onRateTypeChange(params) {
        if (params.newValue === RateTypes[RateTypes.Rate]) {
            params.node.setDataValue('priceCode', this.priceCode);
        } else {
            params.node.setDataValue('priceCode', '');
        }
    }

    isPriceCodeEditable(params): boolean {
        if (this.isGridEditable(params)) {
            if (params.data.rateTypeCode === RateTypes[RateTypes.Rate]) {
                return this.gridContext.gridEditable;
            } else {
                params.node.setDataValue('priceCode', '');
                return !this.gridContext.gridEditable;
            }
        }
    }

    isPercentageInvoiceEditable(params): boolean {
        if (this.isTradeEdit) {
            if (params.data.invoicePercent > 0) {
                return this.gridContext.gridEditable && this.gridContext.percentageInvoiced;
            } else {
                params.node.setDataValue('invoicePercent', params.data.invoicePercent);
                return !this.gridContext.gridEditable;
            }
        }
    }

    priceCodeRequired(params) {
        if ((!params.value || params.value === '') && params.data.rateTypeCode === RateTypes[RateTypes.Rate]) {
            params.node.setDataValue('priceCode', this.requiredCell(this));
        }
        return params.value;
    }

    renderPriceUnit(params) {
        if (!params.value) {
            return '';
        }

        const priceCode = params.colDef.cellEditorParams.context.priceUnits.filter((e) => e.priceUnitId === params.value)[0].priceCode;
        return priceCode;
    }

    requiredCell(params) {
        if (!params.value || params.value === '') {
            return '<div class=\'cost-cell-value-required\'>Required *</div>';
        }
        return params.value;
    }

    showCellValue(params): string {
        if (params) {
            return params.value;
        }
    }

    showInvoiceDetails(params): string {
        if (params.data.invoicePercent && params.data.invoicePercent > 0) {
            return (
                'InvoiceReference: ' +
                params.data.documentReference +
                '  Invoice Date: ' +
                this.formatDate.transform(params.data.documentDate) +
                '  %Invoiced: ' +
                params.data.invoicePercent
            );
        }
    }

    onUseCostMatrixClicked() {
        const getSearchMatricesObservable = this.hasRecommendCMGap
            ? this.tradingService.searchCostMatrixListWithBestMatch(this.getTagParameters())
            : this.tradingService.getCostmatricesByCompanyId(this.company);

        getSearchMatricesObservable.subscribe(this.getCostMatrices());
    }

    private getCostMatrices() {
        return (data) => {
            this.costMatrix = data.value;
            if (this.costMatrix) {
                if (this.hasRecommendCMGap) {
                    const costMatrixIdWithBM = this.costMatrix.filter((itemCostMatrix: Costmatrix) => itemCostMatrix.bestMatch > 0);
                    const bestMatchIds = costMatrixIdWithBM.map((tag) => tag.costMatrixId);
                    const tagsToShow = this.getTagParameters();
                    if (bestMatchIds.length > 0) {
                        const tagValues: Observable<any> = this.tradingService.GetBulkCostMatricesListWithTags(bestMatchIds.toString());

                        tagValues.subscribe(
                            (result) => {
                                this.costMatrix.map((matrix) => {
                                    const value = result.find((tagvalue) => tagvalue.costMatrixId === matrix.costMatrixId);
                                    if (value) {
                                        matrix.tags = value.tags;
                                    }
                                });

                                this.costMatrix.map((matrix: Costmatrix) => {
                                    if (matrix.tags) {
                                        matrix.tags.map((value) => {
                                            let valuesIncluded: string = '';
                                            for (let i = 0; i < tagsToShow.length; i++) {
                                                if (value.tagValueId.includes(tagsToShow[i].id)) {
                                                    valuesIncluded += tagsToShow[i].id + ',';
                                                }
                                            }
                                            value.tagValueId = valuesIncluded;
                                        });
                                        matrix.tagsFormatted = this.paramsToChip(matrix.tags);
                                    }
                                });
                            },
                            (err) => {
                                console.log(err);
                            },
                            () => {
                                this.openDialogCostmatrices();
                            },
                        );
                    } else {
                        this.openDialogCostmatrices();
                    }
                } else {
                    this.openDialogCostmatrices();
                }
            }
        };
    }

    private openDialogCostmatrices() {
        const openCostMatrixDialog = this.dialog.open(CostMatrixDialogComponent, {
            data: {
                matrixData: this.costMatrix,
            },
            width: '45%',
        });
        openCostMatrixDialog.afterClosed().subscribe((matrixId) => {
            this.importMatrices(matrixId);
        });
    }

    paramsToChip(val: Tag[]): string[] {
        let chip: string = '';
        const chips = new Array<string>();
        let typenameActual: string;

        if (this.tagsList && val && val.length > 0) {
            val.forEach((param) => {
                if (param.typeName !== typenameActual && param.tagValueId !== null && param.tagValueId !== '') {
                    const value = this.tagsList.find((a) => param.typeName === a.typeName);
                    if (value) {
                        const label = value.label;
                        chip = label + '=';
                        chip += this.searchValue(param.typeName, param.tagValueId);
                        typenameActual = param.typeName;
                        chips.push(chip.substring(0, chip.length - 1));
                    }
                } else if (param.tagValueId !== '') {
                    chip += param.tagValueId + ',';
                    chips.push(chip.substring(0, chip.length - 1));
                }
            });
        }
        return chips;
    }

    searchValue(typename: string, tagValueId: string): string {
        let paramName = '';
        let paramid = '';
        let list: any[];
        if (typename !== '' && typename !== undefined) {
            switch (typename) {
                case 'SectionDto.ContractTermCode':
                    paramName = 'displayName';
                    paramid = 'contractTermId';
                    list = this.masterdata.contractTerms;
                    break;
                case 'TradeDto.Type':
                    paramName = 'enumEntityValue';
                    paramid = 'enumEntityId';
                    list = this.masterdata.contractTypes;
                    break;
                case 'SectionDto.PaymentTermCode':
                    paramName = 'paymentTermCode';
                    paramid = 'paymentTermsId';
                    list = this.masterdata.paymentTerms;
                    break;
                case 'SectionDto.CounterpartyReference':
                    paramName = 'counterpartyCode';
                    paramid = 'counterpartyID';
                    list = this.masterdata.counterparties;
                    break;
                case 'SectionDto.PortDestinationCode':
                case 'SectionDto.PortOriginCode':
                    paramName = 'portCode';
                    paramid = 'portId';
                    list = this.masterdata.ports;
                    break;
            }
            if (paramName !== '' && paramid !== '') {
                tagValueId = this.searchTagByid(tagValueId, list, paramName, paramid);
            }
        }

        return tagValueId;
    }

    private searchTagByid(tagValueId: string, list: any[], paramName: string, paramId: string): string {
        const tagsIds = tagValueId.split(',');
        const newTagValueId = new Array();

        tagsIds.forEach((id) => {
            const match = list.find((val) => val[paramId] === Number(id));
            if (match) {
                newTagValueId.push(match[paramName]);
            }
        });
        return newTagValueId.join();
    }

    getTagFields() {
        this.tradingService.getTagFields().subscribe((val) => (this.tagsList = val));
    }

    private getTagParameters() {
        const tagList = new Array<Tag>();
        const mainTab = this.commodityFormGroup.controls.mainTabComponent as FormGroup;
        const cmyGroup = mainTab.controls.commodityGroup as FormGroup;
        const cmyFormGroup = cmyGroup.controls.commodityFormGroup as FormGroup;
        const locationGroup = mainTab.controls.locationFormComponent as FormGroup;
        const contractTermsGroup = mainTab.controls.contractTermsFormGroup as FormGroup;

        if (cmyFormGroup.controls.commodityPart1.value) {
            const tag = new Tag(cmyFormGroup.controls.commodityPart1.value, 'Commodity.PrincipalCommodity');
            tagList.push(tag);
        }

        if (cmyFormGroup.controls.commodityPart2.value) {
            const tag: Tag = new Tag(cmyFormGroup.controls.commodityPart2.value, 'Commodity.Part2');
            tagList.push(tag);
        }

        if (cmyFormGroup.controls.commodityPart3.value) {
            const tag: Tag = new Tag(cmyFormGroup.controls.commodityPart3.value, 'Commodity.Part3');
            tagList.push(tag);
        }

        if (cmyFormGroup.controls.commodityPart4.value) {
            const tag: Tag = new Tag(cmyFormGroup.controls.commodityPart4.value, 'Commodity.Part4');
            tagList.push(tag);
        }

        if (cmyFormGroup.controls.commodityPart5.value) {
            const tag: Tag = new Tag(cmyFormGroup.controls.commodityPart5.value, 'Commodity.Part5');
            tagList.push(tag);
        }

        if (mainTab.value.termsGroup.contractTermsCtrl) {
            const tag: Tag = new Tag(mainTab.value.termsGroup.contractTermsCtrl.toString(), 'SectionDto.ContractTermCode');
            tagList.push(tag);
        }

        if (mainTab.value.counterpartyGroup.counterpartyReferenceCtrl) {
            const tag: Tag = new Tag(
                mainTab.value.counterpartyGroup.counterpartyReferenceCtrl.toString(),
                'SectionDto.CounterpartyReference',
            );
            tagList.push(tag);
        }

        if (mainTab.value.priceGroup.paymentTermsCtrl.paymentTermsId) {
            const tag: Tag = new Tag(mainTab.value.priceGroup.paymentTermsCtrl.paymentTermsId.toString(), 'SectionDto.PaymentTermCode');
            tagList.push(tag);
        }

        if (locationGroup.controls.portofOriginCtrl.value) {
            const tag: Tag = new Tag(
                locationGroup.controls.portofOriginCtrl.value.portId.toString(),
                'SectionDto.SectionDto.PortOriginCode',
            );
            tagList.push(tag);
        }

        if (locationGroup.controls.portofDestinationCtrl.value) {
            const tag: Tag = new Tag(
                locationGroup.controls.portofDestinationCtrl.value.portId.toString(),
                'SectionDto.PortDestinationCode',
            );
            tagList.push(tag);
        }

        return tagList;
    }

    imageCostMatrixTrade(matrixId: number) {
        this.tradingService.getCostmatricesListByCostmatrixId(matrixId).subscribe((data) => {
            if (data) {
                this.selectCostmatrix = data.name;
                data.costMatrixLines.filter((line) => {
                    data.costMatrixId = line.costMatrixId;
                    this.filteredLines = data.costMatrixLines;
                });
            }
            if (this.filteredLines && this.filteredLines.length > 0) {
                this.addCostMatrixLinesToCostGrid();
            }
        });
    }

    importMatrices(matrixId: number) {
        this.tradingService.getCostmatricesListByCostmatrixId(matrixId).subscribe((data) => {
            this.selectCostmatrix = data.name;
            this.isBestMatch = null;
            if (!this.importedCostMatrices.includes(data.name)) {
                this.importedCostMatrices = this.importedCostMatrices + data.name + ' , ';
            }
            this.useCostMatrixCtrl.setValue(this.importedCostMatrices.trim().slice(0, -1));
            data.costMatrixLines.filter((line) => {
                data.costMatrixId = line.costMatrixId;
                this.filteredLines = data.costMatrixLines;
            });
            if (this.filteredLines && this.filteredLines.length > 0) {
                if (this.hasRecommendCMGap) {
                    this.tradingService.searchCostMatrixListWithBestMatch(this.getTagParameters()).subscribe((listWithBM) => {
                        this.isBestMatch = listWithBM.value.find((e) => e.costMatrixId === data.costMatrixId).bestMatch > 0 ? 'BM' : null;
                        this.confirmCosts();
                    });
                } else {
                    this.confirmCosts();
                }
            }
        });
    }

    setCostMatrixLines(result: boolean) {
        const newGridRows: CostListDisplayView[] = [];
        const costsToBeRemoved: number[] = [];
        let sectionId: number = 0;
        if (result) {
            this.addCostMatrixLinesToCostGrid();
        } else {
            this.gridApi.forEachNode((rowData) => {
                if (rowData.data.invoicePercent === 100) {
                    newGridRows.push(rowData.data);
                } else {
                    costsToBeRemoved.push(rowData.data.costId);
                    sectionId = rowData.data.sectionId;
                }
            });
            if (sectionId && costsToBeRemoved) {
                const deleteConfirmationSubscription = this.tradingService
                    .deleteMultipleCost(costsToBeRemoved, sectionId, this.dataVersionId)
                    .subscribe(() => { });
                this.subscriptions.push(deleteConfirmationSubscription);
            }
            this.costsGridRows = newGridRows;

            this.addCostMatrixLinesToCostGrid();
        }
    }

    addCostMatrixLinesToCostGrid() {
        const newGridRows: Cost[] = [];
        this.filteredLines.forEach((rows) => {
            const costRow = new Cost();
            costRow.rowStatus = 'N';
            costRow.bestMatch = this.isBestMatch;
            costRow.costMatrixName = this.selectCostmatrix;
            costRow.costTypeCode = this.getCostTypeCodeFromId(rows.costTypeId, this.masterdata);
            costRow.description = rows.description;
            costRow.supplierCode = this.getSupplierCodeFromId(rows.supplierId, this.masterdata);
            costRow.costDirectionId = rows.payReceive;
            costRow.currencyCode = rows.currencyCode;
            costRow.rateTypeId = rows.rateType;
            costRow.priceUnitId = rows.priceUnitId;
            costRow.rate = rows.rateAmount;
            costRow.inPL = rows.inPL;
            costRow.noAction = rows.noAct;
            costRow.narrative = rows.narrative;
            costRow.costMatrixLineId = rows.costMatrixLineId;
            newGridRows.push(costRow);
        });
        newGridRows.forEach((e) => {
            const displayCostRow = new CostListDisplayView(e, this.masterdata, this.costDirections);
            displayCostRow.isDirty = true;
            this.gridApi.updateRowData({ add: [displayCostRow] });
        });
    }

    getCostTypeCodeFromId(id: number, masterdata: MasterData): string {
        const costTypeCode = masterdata.costTypes.find((e) => e.costTypeId === id);
        return costTypeCode ? costTypeCode.costTypeCode : null;
    }

    getSupplierCodeFromId(id, masterdata: MasterData) {
        const counterparty = masterdata.counterparties.find((e) => e.counterpartyID === id);
        return counterparty ? counterparty.counterpartyCode : null;
    }

    confirmCosts() {
        if (this.gridApi.getDisplayedRowCount() === 0) {
            this.addCostMatrixLinesToCostGrid();
        } else {
            const openConfirmCostsDialog = this.dialog.open(AddCostConfirmationDialogComponent);
            openConfirmCostsDialog.afterClosed().subscribe((result) => {
                this.setCostMatrixLines(result);
            });
        }
    }

    checkGridEditPrivilege() {
        this.securityService.isSecurityReady().subscribe(() => {
            if (
                this.authorizationService.isPrivilegeAllowed(this.company, 'Trades') &&
                this.authorizationService.isPrivilegeAllowed(this.company, 'CostTab')
            ) {
                this.editingCostGridPrivilege = this.authorizationService.isPrivilegeAllowed(this.company, 'EditingCostGrid');
            }
        });
    }

    onTabSelected() {
        if (this.costGridOptions) {
            this.gridService.sizeColumns(this.costGridOptions);
        }
    }

    navigateToCostTransferPage() {
        this.router.navigate(['/' + this.company + '/trades/transferCosts/' + encodeURIComponent(String(this.sectionId))]);
    }

    onRateAmountChanged(params) {
        if (params && params.data) {
            if (params.data.invoicePercent) {
                if (params.newValue) {
                    const invoicePercent = (params.data.invoicePercent * params.oldValue) / params.newValue;
                    if (invoicePercent > 100) {
                        params.data.invoicePercent = 100;
                    } else {
                        params.data.invoicePercent = invoicePercent;
                    }
                } else {
                    params.data.rate = params.oldValue;
                }
            }
        }
        if (this.gridApi) {
            this.gridApi.refreshCells(params.data);
        }
    }
}
