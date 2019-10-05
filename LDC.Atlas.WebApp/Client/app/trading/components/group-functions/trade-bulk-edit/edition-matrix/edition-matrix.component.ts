import { Component, EventEmitter, Inject, Input, OnInit, Optional, Output, ViewChild } from '@angular/core';
import { MAT_DATE_LOCALE } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import * as agGrid from 'ag-grid-community';
import * as moment from 'moment';
import { AuthorizationService } from '../../../../../core/services/authorization.service';
import { CompanyManagerService } from '../../../../../core/services/company-manager.service';
import { AgGridUserPreferencesComponent } from '../../../../../shared/components/ag-grid-user-preferences/ag-grid-user-preferences.component';
import { AgGridAutocompleteComponent } from '../../../../../shared/components/ag-grid/autocomplete/ag-grid-autocomplete.component';
import { AgGridContextualSearchComponent } from '../../../../../shared/components/ag-grid/contextual-search/ag-grid-contextual-search.component';
import { BaseFormComponent } from '../../../../../shared/components/base-form-component/base-form-component.component';
import { CellEditorDatePickerComponent } from '../../../../../shared/components/cell-editor-date-picker/cell-editor-date-picker.component';
import { CellEditorNumericComponent } from '../../../../../shared/components/cell-editor-numeric/cell-editor-numeric.component';
import { CellEditorSelectComponent } from '../../../../../shared/components/cell-editor-select/cell-editor-select.component';
import { AtlasAgGridParam } from '../../../../../shared/entities/atlas-ag-grid-param.entity';
import { AtlasNumber } from '../../../../../shared/entities/atlas-number.entity';
import { Commodity } from '../../../../../shared/entities/commodity.entity';
import { Company } from '../../../../../shared/entities/company.entity';
import { DiscountPremiumBasis } from '../../../../../shared/entities/discount-premium-basis.entity';
import { DiscountPremiumType } from '../../../../../shared/entities/discount-premium-type.entity';
import { EnumEntity } from '../../../../../shared/entities/enum-entity.entity';
import { IsLocked } from '../../../../../shared/entities/is-locked.entity';
import { MasterData } from '../../../../../shared/entities/masterdata.entity';
import { PhysicalContractToUpdate } from '../../../../../shared/entities/physical-contract-to-update.entity';
import { PhysicalTradeBulkEdit } from '../../../../../shared/entities/physical-trade-bulk-edit';
import { SectionToUpdate } from '../../../../../shared/entities/section-to-update.entity';
import { TradePropertyPrivilege } from '../../../../../shared/entities/trade-property-privilege.entity';
import { Trader } from '../../../../../shared/entities/trader.entity';
import { DateFormats } from '../../../../../shared/enums/date-format.enum';
import { DiscountBasis } from '../../../../../shared/enums/discount-basis.enum';
import { DiscountTypes } from '../../../../../shared/enums/discount-type.enum';
import { InvoiceStatus } from '../../../../../shared/enums/invoice-status.enum';
import { InvoicingStatus } from '../../../../../shared/enums/invoicing-status.enum';
import { PositionMonthTypes } from '../../../../../shared/enums/position-month-type.enum';
import { CustomNumberMask } from '../../../../../shared/numberMask';
import { AgGridService } from '../../../../../shared/services/ag-grid.service';
import { FormConfigurationProviderService } from '../../../../../shared/services/form-configuration-provider.service';
import { LockService } from '../../../../../shared/services/http-services/lock.service';
import { TradingService } from '../../../../../shared/services/http-services/trading.service';
import { SnackbarService } from '../../../../../shared/services/snackbar.service';
import { TradeEditService } from '../../../../../shared/services/trade-edit.service';
import { ContractsForBulkFunctions } from '../../../../../shared/services/trading/dtos/contracts-for-bulk-functions';
import { UiService } from '../../../../../shared/services/ui.service';
import { getCropYearValue } from '../../../../../trading/services/form-field-handler.service';
import { getContractValue, getMaturityDate } from '../../../../Library/trading-businessrules';
import { TradeActionsService } from '../../../../services/trade-actions.service';
import { PropertySelection } from './bulk-edit-property-selection';
import { MasterRowApplyComponent } from './master-row-apply/master-row-apply.component';

@Component({
    selector: 'atlas-edition-matrix',
    templateUrl: './edition-matrix.component.html',
    styleUrls: ['./edition-matrix.component.scss'],
})
export class EditionMatrixComponent extends BaseFormComponent implements OnInit {
    @ViewChild('userPreferences') userPreferencesComponent: AgGridUserPreferencesComponent;
    @Output() readonly blockingErrorMessage = new EventEmitter<any>();
    company: string;
    atlasAgGridParam: AtlasAgGridParam;
    gridApi: agGrid.GridApi;
    gridColumnApi: agGrid.ColumnApi;
    bulkEditGridColumns: agGrid.ColDef[];
    bulkEditGridOptions: agGrid.GridOptions = {};
    bulkEditGridRows: ContractsForBulkFunctions[];
    updatedSections: SectionToUpdate[] = [];
    updatedPhysicalContracts: PhysicalContractToUpdate[] = [];
    updatedContractRows: ContractsForBulkFunctions[] = [];
    updatedContracts: PhysicalTradeBulkEdit;
    filteredCommodityList: Commodity[];
    traders: Trader[] = [];
    filteredTradeOwners: Trader[];
    masterdata: MasterData;
    discountType: DiscountTypes;
    discountBasis: DiscountBasis;
    privileges: TradePropertyPrivilege;
    columnDefs: agGrid.ColDef[];
    requiredString: string = 'Required*';
    noErrorMessage: string = 'noError';
    ammendedStatus: string = 'A';
    validationError: boolean = false;
    companyConfiguration: Company;
    isSummaryView: boolean = false;
    pinnedTopRowData: any;
    isSaveInProgress: boolean;
    isRequiredCell: boolean;
    isCurrencyRequired: boolean;
    isValueChanged: boolean = false;
    gridContext = {
        gridEditable: true,
        componentParent: this,
    };
    columnName: any;
    rowValue: any;
    bulkEditField: string = 'Master Row';
    gridComponents = {
        atlasSelect: CellEditorSelectComponent,
        atlasNumeric: CellEditorNumericComponent,
        atlasDatePicker: CellEditorDatePickerComponent,
    };
    premiumDiscountBasis: DiscountPremiumBasis[];
    premiumDiscountType: DiscountPremiumType[];
    contractValueCalculated: number;

    dateFormat = {
        Date: DateFormats.Date,
    };
    errorMessage: string = 'Invalid Entry. Value not in list';
    isSave: boolean;
    colDefSelected: PropertySelection[] = [];
    @Input() lockedContracts: EnumEntity[] = [];

    constructor(protected formConfigurationProvider: FormConfigurationProviderService,
        private gridService: AgGridService,
        private uiService: UiService,
        protected snackbarService: SnackbarService,
        private route: ActivatedRoute,
        protected companyManager: CompanyManagerService,
        protected authorizationService: AuthorizationService,
        private tradeEditService: TradeEditService,
        private tradeActionService: TradeActionsService,
        protected tradingService: TradingService,
        private lockService: LockService,
        @Optional() @Inject(MAT_DATE_LOCALE) private dateLocale?: string,
    ) {
        super(formConfigurationProvider);
        this.populateListofFields();
    }

    ngOnInit() {
        this.masterdata = this.route.snapshot.data.masterdata;
        this.company = this.route.snapshot.paramMap.get('company');
        this.companyConfiguration = this.companyManager.getCompany(this.company);
        this.premiumDiscountType = [
            {
                discountPremiumTypeId: DiscountTypes.Discount,
                discountPremium: DiscountTypes[DiscountTypes.Discount],
            },
            {
                discountPremiumTypeId: DiscountTypes.Premium,
                discountPremium: DiscountTypes[DiscountTypes.Premium],
            },
        ];
        this.premiumDiscountBasis = [
            {
                discountPremiumBasis: DiscountBasis[DiscountBasis.Percent],
                discountPremiumBasisId: DiscountBasis.Percent,
            },
            {
                discountPremiumBasisId: DiscountBasis.Rate,
                discountPremiumBasis: DiscountBasis[DiscountBasis.Rate],
            },
        ];

        this.tradingService.getAllTraders()
            .subscribe((traders) => {
                this.traders = this.filteredTradeOwners = traders.value;
            });

        this.atlasAgGridParam = this.gridService.getAgGridParam();
        this.privileges = this.tradeActionService.getTradePropertyPrivileges();
        this.filteredCommodityList = this.masterdata.commodities;
        this.initializeGridColumns();
    }

    isGridEditable(params): boolean {

        return params.context.gridEditable;
    }

    requiredCell(params) {
        if (params.data.premiumDiscountTypeId) {
            return '<div class=\'bulk-edit-cell-value-required\'>Required*</div>';
        }
        return params.value;
    }

    initializeGridColumns() {
        this.bulkEditGridOptions = {
            context: this.gridContext,
            getRowStyle: this.isContractLockedRowStyle.bind(this),
        };
        this.bulkEditGridColumns =
            [
                {
                    headerName: '',
                    pinned: 'left',
                    colId: 'rowStatus',
                    field: 'rowStatus',
                    hide: true,
                    minWidth: 90,
                    maxWidth: 90,
                    editable: false,
                    suppressMenu: true,
                    pinnedRowCellRendererFramework: MasterRowApplyComponent,
                    pinnedRowCellRendererParams: {
                        context: {
                            componentParent: this,
                        },
                    },
                    cellRenderer: (params) => {
                        if (params.data.rowStatus) {
                            return '<mat-chip-list><mat-chip class="status-flag-chip-bulk-edit">' + params.data.rowStatus +
                                '</mat-chip></mat-chip-list>';
                        }
                        return '';
                    },
                    tooltip: (params) => {
                        return params.context.componentParent.getContractTooltipMessage(params);
                    },
                },
                {
                    headerName: 'Contract Reference',
                    field: 'contractLabel',
                    colId: 'contractLabel',
                    editable: false,
                    pinned: 'left',
                    cellClass: (params) => {
                        if (params.node.rowPinned) {
                            return 'pinnedRow';
                        }
                    },
                    tooltip: (params) => {
                        return params.context.componentParent.getContractTooltipMessage(params);
                    },
                },
                {
                    headerName: 'Approval Status',
                    field: 'status',
                    colId: 'status',
                    editable: false,
                    pinned: 'left',
                    cellClass: (params) => {
                        if (params.node.rowPinned) {
                            return 'pinnedRow';
                        }
                    },
                    tooltip: (params) => {
                        return params.context.componentParent.getContractTooltipMessage(params);
                    },
                },
                {
                    headerName: 'Allocated Section Id',
                    field: 'allocatedSectionId',
                    colId: 'allocatedSectionId',
                    hide: true,
                },
                {
                    headerName: 'Contract Type',
                    field: 'contractType',
                    colId: 'contractType',
                    hide: true,
                },
                {
                    headerName: 'Physical Contract Id',
                    field: 'physicalContractId',
                    colId: 'physicalContractId',
                    hide: true,
                },
                {
                    headerName: 'Section Id',
                    field: 'sectionId',
                    colId: 'sectionId',
                    hide: true,
                },
                {
                    headerName: 'Section Origin Id',
                    field: 'sectionOriginId',
                    colId: 'sectionOriginId',
                    hide: true,
                },
                {
                    headerName: 'Contract Date *',
                    field: 'contractDate',
                    colId: 'contractDate',
                    editable: (params) => this.tradeEditService.isGridCellEditable(params, this.privileges, this.lockedContracts),
                    hide: true,
                    cellEditor: 'atlasDatePicker',
                    valueFormatter: this.uiService.dateFormatter,
                    cellEditorParams: {
                        maxDate: this.companyManager.getCurrentCompanyDate(),
                        isRequired: true,
                    },
                    onCellValueChanged: (params) => {
                        if (params.newValue && params.oldValue !== params.newValue) {
                            this.setAmmendedStatus(params);
                            params.data.contractDateChange = true;
                            this.isValueChanged = true;
                        }
                    },
                    cellClass: (params) => {
                        if (params.node.rowPinned) {
                            return 'pinnedRow';
                        }
                        if ((params.context.componentParent.isSummaryView
                            && params.data.contractDateChange) || params.data.isCancelled || params.data.isClosed) {
                            return 'ag-grid-row-gray-background';
                        }
                        if ((!params.context.componentParent.isSummaryView
                            && params.data.isChildTrade) || params.data.isCancelled || params.data.isClosed) {
                            return 'ag-grid-disable-field';
                        }
                    },
                    tooltip: (params) => {
                        if (params.data.islocked) {
                            return params.data.lockMessage;
                        } else if (!params.context.componentParent.isSummaryView && params.data.sectionOriginId) {
                            params.data.isChildTrade = true;
                            return 'Not Allowed to Edit in Child Trade';
                        }
                    },
                },
                {
                    headerName: 'Trader *',
                    field: 'userId',
                    colId: 'userId',
                    hide: true,
                    cellClass: (params) => {
                        if (params.node.rowPinned) {
                            return 'pinnedRow';
                        }
                        if ((params.context.componentParent.isSummaryView && params.data.traderValueChanged)
                            || params.data.isCancelled || params.data.isClosed) {
                            return 'ag-grid-row-gray-background';
                        }
                        if ((!params.context.componentParent.isSummaryView
                            && params.data.isChildTrade) || params.data.isCancelled || params.data.isClosed) {
                            return 'ag-grid-disable-field';
                        }
                    },
                    pinnedRowCellRendererFramework: AgGridAutocompleteComponent,
                    pinnedRowCellRendererParams: (params) => {
                        return {
                            context: {
                                componentParent: this,
                                gridEditable: true,
                            },
                            options: this.traders,
                            valueProperty: 'userId',
                            codeProperty: 'samAccountName',
                            displayProperty: 'displayName',
                            displayCode: true,
                        };
                    },
                    cellRendererFramework: AgGridAutocompleteComponent,
                    cellRendererParams: (params) => {
                        return {
                            context: {
                                componentParent: this,
                                gridEditable: this.tradeEditService.isGridCellEditable(params, this.privileges, this.lockedContracts),
                            },
                            options: this.traders,
                            valueProperty: 'userId',
                            codeProperty: 'samAccountName',
                            displayProperty: 'displayName',
                            isRequired: true,
                        };
                    },
                    onCellValueChanged: (params) => {
                        if (params.data.userId !== params.value) {
                            if (params.data.userId) {
                                this.setAmmendedStatus(params);
                                params.data.traderValueChanged = true;
                            }
                        }
                    },
                    tooltip: (params) => {
                        if (params.data.islocked) {
                            return params.data.lockMessage;
                        } else if (!params.context.componentParent.isSummaryView && params.data.sectionOriginId) {
                            params.data.isChildTrade = true;
                            return 'Not Allowed to Edit in Child Trade';
                        }
                    },
                },
                {
                    headerName: 'Department Code*',
                    field: 'departmentId',
                    colId: 'departmentId',
                    hide: true,
                    cellClass: (params) => {
                        if (params.node.rowPinned) {
                            return 'pinnedRow';
                        }
                    },
                    pinnedRowCellRendererFramework: AgGridContextualSearchComponent,
                    pinnedRowCellRendererParams: (params) => {
                        return {
                            context: {
                                componentParent: this,
                                gridEditable: true,
                            },
                            gridId: 'departmentsGrid',
                            options: this.masterdata.departments,
                            valueProperty: 'departmentId',
                            codeProperty: 'departmentCode',
                            descriptionProperty: 'description',
                            displayProperty: 'departmentCode',
                            showContextualSearchIcon: true,
                        };
                    },
                    cellRendererFramework: AgGridContextualSearchComponent,
                    cellRendererParams: (params) => {
                        return {
                            context: {
                                componentParent: this,
                                gridEditable: this.tradeEditService.isGridCellEditable(params, this.privileges, this.lockedContracts),
                            },
                            gridId: 'departmentsGrid',
                            options: this.masterdata.departments,
                            displayProperty: 'departmentCode',
                            codeProperty: 'departmentCode',
                            descriptionProperty: 'description',
                            valueProperty: 'departmentId',
                            lightBoxTitle: 'Results for Departments',
                            isRequired: true,
                            showContextualSearchIcon: this.tradeEditService
                                .isGridCellEditable(params, this.privileges, this.lockedContracts),
                        };
                    },
                    cellClassRules: {
                        'ag-grid-disable-field': ((params) => (!params.context.componentParent.isSummaryView
                            && params.data.isInvoicedorAllocated) || params.data.isCancelled || params.data.isClosed),
                        'ag-grid-row-gray-background': ((params) => (params.context.componentParent.isSummaryView
                            && params.data.departmentValueChange) || params.data.isCancelled || params.data.isClosed),
                    },
                    onCellValueChanged: (params) => {
                        this.departmentDescriptionFormatter(params);
                        if (params.data.departmentId !== params.value) {
                            this.isValueChanged = true;
                            if (params.data.departmentId) {
                                params.node.setDataValue('departmentDescription', params.data.departmentDescription);
                                this.setAmmendedStatus(params);
                                params.data.departmentValueChange = true;
                            }
                        }
                    },
                    tooltip: (params) => {
                        if (!params.context.componentParent.isSummaryView) {
                            return params.data.invoicingAllocationConditionErrorMessage;
                        }
                    },
                },
                {
                    headerName: 'Department Description',
                    field: 'departmentDescription',
                    colId: 'departmentDescription',
                    cellRenderer: this.departmentDescriptionFormatter.bind(this),
                    cellClass: (params) => {
                        if (params.node.rowPinned) {
                            return 'pinnedRow';
                        }
                    },
                    cellClassRules: {
                        'ag-grid-disable-field': ((params) => (!params.context.componentParent.isSummaryView
                            && params.data.isInvoicedorAllocated) || params.data.isCancelled || params.data.isClosed),
                        'ag-grid-row-gray-background': ((params) => (params.context.componentParent.isSummaryView
                            && params.data.departmentValueChange) || params.data.isCancelled || params.data.isClosed),
                    },
                    tooltip: (params) => {
                        if (!params.context.componentParent.isSummaryView) {
                            return params.data.invoicingAllocationConditionErrorMessage;
                        }
                    },
                },
                {
                    headerName: 'Buyer Code *',
                    field: 'buyerCounterpartyId',
                    colId: 'buyerCounterpartyId',
                    hide: true,
                    cellClass: (params) => {
                        if (params.node.rowPinned) {
                            return 'pinnedRow';
                        }
                    },
                    pinnedRowCellRendererFramework: AgGridContextualSearchComponent,
                    pinnedRowCellRendererParams: (params) => {
                        return {
                            context: {
                                componentParent: this,
                                gridEditable: (!params.context.componentParent.isSummaryView
                                    && params.context.componentParent.privileges.buyerCodePrivilege),
                            },
                            gridId: 'counterpartiesGrid',
                            options: this.masterdata.counterparties,
                            codeProperty: 'counterpartyCode',
                            descriptionProperty: 'description',
                            valueProperty: 'counterpartyID',
                            displayProperty: 'counterpartyCode',
                            showContextualSearchIcon: (!params.context.componentParent.isSummaryView
                                && params.context.componentParent.privileges.buyerCodePrivilege),
                        };
                    },
                    cellRendererFramework: AgGridContextualSearchComponent,
                    cellRendererParams: (params) => {
                        return {
                            context: {
                                componentParent: this,
                                gridEditable: this.tradeEditService.isGridCellEditable(params, this.privileges, this.lockedContracts),
                            },
                            gridId: 'counterpartiesGrid',
                            options: this.masterdata.counterparties,
                            displayProperty: 'counterpartyCode',
                            codeProperty: 'counterpartyCode',
                            descriptionProperty: 'description',
                            valueProperty: 'counterpartyID',
                            lightBoxTitle: 'Results for Counterparty',
                            isRequired: true,
                            showContextualSearchIcon: this.tradeEditService
                                .isGridCellEditable(params, this.privileges, this.lockedContracts),
                        };
                    },
                    onCellValueChanged: (params) => {
                        this.buyerDescriptionFormatter(params);
                        if (params.data.buyerCounterpartyId !== params.value) {
                            if (params.data.buyerCounterpartyId) {
                                params.node.setDataValue('buyerDescription', params.data.buyerDescription);
                                this.setAmmendedStatus(params);
                                params.data.buyerValueChange = true;
                            }
                        }
                    },
                    cellClassRules: {
                        'ag-grid-disable-field': ((params) => !params.context.componentParent.isSummaryView &&
                            !params.context.componentParent.privileges.hasSuperTradePrivilege && (params.data.isInvoiced
                                || !params.context.componentParent.privileges.buyerCodePrivilege
                                || !params.data.isbuyerCounterpartyEditable)),
                        'ag-grid-row-gray-background': ((params) => params.context.componentParent.isSummaryView
                            && params.data.buyerValueChange),
                    },
                    tooltip: (params) => {
                        this.tradeEditService.isCounterpartyEditable(params);
                        if (!params.context.componentParent.isSummaryView
                            && !params.context.componentParent.privileges.hasSuperTradePrivilege) {
                            if (!params.context.componentParent.privileges.buyerCodePrivilege) {
                                return params.data.buyerErrorMessage;
                            } else if (!params.data.isbuyerCounterpartyEditable) {
                                return params.data.isbuyerCounterpartyErrorMessage;
                            } else {
                                return params.data.invoicingConditionErrorMessage;
                            }
                        }
                    },
                },
                {
                    headerName: 'Buyer Description',
                    field: 'buyerDescription',
                    colId: 'buyerDescription',
                    cellRenderer: this.buyerDescriptionFormatter.bind(this),
                    cellClassRules: {
                        'ag-grid-disable-field': ((params) => !params.context.componentParent.isSummaryView &&
                            !params.context.componentParent.privileges.hasSuperTradePrivilege && (params.data.isInvoiced
                                || !params.context.componentParent.privileges.buyerCodePrivilege
                                || !params.data.isbuyerCounterpartyEditable)),
                        'ag-grid-row-gray-background': ((params) => params.context.componentParent.isSummaryView
                            && params.data.buyerValueChange),
                    },
                    cellClass: (params) => {
                        if (params.node.rowPinned) {
                            return 'pinnedRow';
                        }
                    },
                    tooltip: (params) => {
                        if (!params.context.componentParent.isSummaryView
                            && !params.context.componentParent.privileges.hasSuperTradePrivilege) {
                            if (!params.context.componentParent.privileges.buyerCodePrivilege) {
                                return params.data.buyerErrorMessage;
                            } else if (!params.data.isbuyerCounterpartyEditable) {
                                return params.data.isbuyerCounterpartyErrorMessage;
                            } else {
                                return params.data.invoicingConditionErrorMessage;
                            }
                        }
                    },
                },
                {
                    headerName: 'Seller Code *',
                    field: 'sellerCounterpartyId',
                    colId: 'sellerCounterpartyId',
                    hide: true,
                    cellClass: (params) => {
                        if (params.node.rowPinned) {
                            return 'pinnedRow';
                        }
                    },
                    pinnedRowCellRendererFramework: AgGridContextualSearchComponent,
                    pinnedRowCellRendererParams: (params) => {
                        return {
                            context: {
                                componentParent: this,
                                gridEditable: (!params.context.componentParent.isSummaryView
                                    && params.context.componentParent.privileges.sellerCodePrivilege),
                            },
                            gridId: 'counterpartiesGrid',
                            options: this.masterdata.counterparties,
                            codeProperty: 'counterpartyCode',
                            descriptionProperty: 'description',
                            valueProperty: 'counterpartyID',
                            displayProperty: 'counterpartyCode',
                            showContextualSearchIcon: (!params.context.componentParent.isSummaryView
                                && params.context.componentParent.privileges.sellerCodePrivilege),
                        };
                    },
                    cellRendererFramework: AgGridContextualSearchComponent,
                    cellRendererParams: (params) => {
                        return {
                            context: {
                                componentParent: this,
                                gridEditable: this.tradeEditService.isGridCellEditable(params, this.privileges, this.lockedContracts),
                            },
                            gridId: 'counterpartiesGrid',
                            options: this.masterdata.counterparties,
                            displayProperty: 'counterpartyCode',
                            codeProperty: 'counterpartyCode',
                            descriptionProperty: 'description',
                            valueProperty: 'counterpartyID',
                            lightBoxTitle: 'Results for Counterparty',
                            isRequired: true,
                            showContextualSearchIcon: this.tradeEditService
                                .isGridCellEditable(params, this.privileges, this.lockedContracts),
                        };
                    },
                    onCellValueChanged: (params) => {
                        this.sellerDescriptionFormatter(params);
                        if (params.data.sellerCounterpartyId !== params.value) {
                            if (params.data.sellerCounterpartyId) {
                                params.node.setDataValue('sellerDescription', params.data.sellerDescription);
                                this.setAmmendedStatus(params);
                                params.data.sellerValueChange = true;
                            }
                        }
                    },
                    cellClassRules: {
                        'ag-grid-disable-field': ((params) => (!params.context.componentParent.isSummaryView &&
                            !params.context.componentParent.privileges.hasSuperTradePrivilege && (params.data.isInvoiced
                                || !params.context.componentParent.privileges.sellerCodePrivilege
                                || !params.data.isSellerCounterpartyEditable) || params.data.isCancelled || params.data.isClosed)),
                        'ag-grid-row-gray-background': ((params) => (params.context.componentParent.isSummaryView
                            && params.data.sellerValueChange) || params.data.isCancelled || params.data.isClosed),
                    },
                    tooltip: (params) => {
                        if (!params.context.componentParent.isSummaryView
                            && !params.context.componentParent.privileges.hasSuperTradePrivilege) {
                            this.tradeEditService.isGridCellEditable(params, this.privileges, this.lockedContracts);
                            if (!params.context.componentParent.privileges.sellerCodePrivilege) {
                                return params.data.sellerErrorMessage;
                            } else if (!params.data.isSellerCounterpartyEditable) {
                                return params.data.issellerCounterpartyErrorMessage;
                            } else {
                                return params.data.invoicingConditionErrorMessage;
                            }
                        }
                    },
                },
                {
                    headerName: 'Seller Description',
                    field: 'sellerDescription',
                    colId: 'sellerDescription',
                    cellRenderer: this.sellerDescriptionFormatter.bind(this),
                    cellClass: (params) => {
                        if (params.node.rowPinned) {
                            return 'pinnedRow';
                        }
                    },
                    cellClassRules: {
                        'ag-grid-disable-field': ((params) => !params.context.componentParent.isSummaryView &&
                            !params.context.componentParent.privileges.hasSuperTradePrivilege && (params.data.isInvoiced
                                || !params.context.componentParent.privileges.sellerCodePrivilege
                                || !params.data.isSellerCounterpartyEditable) || params.data.isCancelled || params.data.isClosed),
                        'ag-grid-row-gray-background': ((params) => params.context.componentParent.isSummaryView
                            && params.data.sellerValueChange || params.data.isCancelled || params.data.isClosed),
                    },
                    tooltip: (params) => {
                        if (!params.context.componentParent.isSummaryView
                            && !params.context.componentParent.privileges.hasSuperTradePrivilege) {
                            if (!params.context.componentParent.privileges.sellerCodePrivilege) {
                                return params.data.sellerErrorMessage;
                            } else if (!params.data.isSellerCounterpartyEditable) {
                                return params.data.issellerCounterpartyErrorMessage;
                            } else {
                                return params.data.invoicingConditionErrorMessage;
                            }
                        }
                    },
                },
                {
                    headerName: 'Counterparty Reference',
                    field: 'counterpartyReference',
                    colId: 'counterpartyReference',
                    hide: true,
                    editable: (params) => this.tradeEditService.isGridCellEditable(params, this.privileges, this.lockedContracts),
                    cellClass: (params) => {
                        if (params.node.rowPinned) {
                            return 'pinnedRow';
                        }
                    },
                    cellEditor: 'agLargeTextCellEditor',
                    cellEditorParams: {
                        maxLength: 40,
                        rows: 1,
                        cols: 50,
                    },
                    onCellValueChanged: (params) => {
                        if (params.data.counterpartyReference !== params.value) {
                            this.isValueChanged = true;
                        }
                        this.setAmmendedStatus(params);
                        params.data.counterpartyReferenceChange = true;
                    },
                    cellClassRules: {
                        'ag-grid-disable-field': ((params) => !params.context.componentParent.isSummaryView &&
                            !params.context.componentParent.privileges.counterPartyPrivilege
                            || params.data.isCancelled || params.data.isClosed),
                        'ag-grid-row-gray-background': ((params) => params.context.componentParent.isSummaryView
                            && params.data.counterpartyReferenceChange || params.data.isCancelled || params.data.isClosed),
                    },
                    tooltip: (params) => {
                        if (!params.context.componentParent.isSummaryView) {
                            if (!params.context.componentParent.privileges.counterPartyPrivilege) {
                                return params.data.counterpartyErrorMessage;
                            } else {
                                return null;
                            }
                        }
                    },
                },
                {
                    headerName: 'commodity1 *',
                    field: 'commodityId',
                    colId: 'commodityId',
                    hide: true,
                    cellClass: (params) => {
                        if (params.node.rowPinned) {
                            return 'pinnedRow';
                        }
                    },
                    pinnedRowCellRendererFramework: AgGridContextualSearchComponent,
                    pinnedRowCellRendererParams: (params) => {
                        return {
                            context: {
                                componentParent: this,
                                gridEditable: (!params.context.componentParent.isSummaryView
                                    && params.context.componentParent.privileges.counterPartyPrivilege),
                            },
                            gridId: 'commodityGrid',
                            options: this.filteredCommodityList,
                            codeProperty: 'principalCommodity',
                            descriptionProperty: 'description',
                            valueProperty: 'commodityId',
                            displayProperty: 'principalCommodity',
                            showContextualSearchIcon: (!params.context.componentParent.isSummaryView
                                && params.context.componentParent.privileges.counterPartyPrivilege),
                        };
                    },
                    cellRendererFramework: AgGridContextualSearchComponent,
                    cellRendererParams: (params) => {
                        return {
                            context: {
                                componentParent: this,
                                gridEditable: this.tradeEditService.isGridCellEditable(params, this.privileges, this.lockedContracts),
                            },
                            gridId: 'commodityGrid',
                            options: this.filteredCommodityList,
                            codeProperty: 'principalCommodity',
                            descriptionProperty: 'description',
                            displayProperty: 'principalCommodity',
                            valueProperty: 'commodityId',
                            lightBoxTitle: 'Results for Commodities',
                            isRequired: true,
                            showContextualSearchIcon: this.tradeEditService
                                .isGridCellEditable(params, this.privileges, this.lockedContracts),
                        };
                    },
                    cellClassRules: {
                        'ag-grid-disable-field': ((params) => !params.context.componentParent.isSummaryView &&
                            !params.context.componentParent.privileges.hasSuperTradePrivilege && (params.data.isInvoiced
                                || !params.context.componentParent.privileges.counterPartyPrivilege)
                            || params.data.isCancelled || params.data.isClosed),
                        'ag-grid-row-gray-background': ((params) => params.context.componentParent.isSummaryView
                            && params.data.commodityChange || params.data.isCancelled || params.data.isClosed),
                    },
                    tooltip: (params) => {
                        if (!params.context.componentParent.isSummaryView
                            && !params.context.componentParent.privileges.hasSuperTradePrivilege) {
                            if (!params.context.componentParent.privileges.counterPartyPrivilege) {
                                return params.data.commodityErrorMessage;
                            } else {
                                return params.data.invoicingConditionErrorMessage;
                            }
                        }
                    },
                    onCellValueChanged: (params) => {
                        if (params.data.commodityId !== params.value) {
                            this.isValueChanged = true;
                        }
                        this.tradeEditService.onCommodityValueChange
                            (params, 'principalCommodity', this.filteredCommodityList);
                    },
                },
                {
                    headerName: 'commodity2',
                    field: 'commodity2',
                    colId: 'commodity2',
                    cellRenderer: this.commodityValueGetter.bind(this),
                    cellClass: (params) => {
                        if (params.node.rowPinned) {
                            return 'pinnedRow';
                        }
                    },
                    cellClassRules: {
                        'ag-grid-disable-field': ((params) => !params.context.componentParent.isSummaryView &&
                            !params.context.componentParent.privileges.hasSuperTradePrivilege && (params.data.isInvoiced
                                || !params.context.componentParent.privileges.counterPartyPrivilege)
                            || params.data.isCancelled || params.data.isClosed),
                        'ag-grid-row-gray-background': ((params) => params.context.componentParent.isSummaryView
                            && params.data.commodityChange || params.data.isCancelled || params.data.isClosed),
                    },
                    tooltip: (params) => {
                        if (!params.context.componentParent.isSummaryView
                            && !params.context.componentParent.privileges.hasSuperTradePrivilege) {
                            if (!params.context.componentParent.privileges.counterPartyPrivilege) {
                                return params.data.commodityErrorMessage;
                            } else {
                                return params.data.invoicingConditionErrorMessage;
                            }
                        }
                    },
                    onCellValueChanged: (params) => {
                    },
                },
                {
                    headerName: 'commodity3',
                    field: 'commodity3',
                    colId: 'commodity3',
                    cellClass: (params) => {
                        if (params.node.rowPinned) {
                            return 'pinnedRow';
                        }
                    },
                    cellClassRules: {
                        'ag-grid-disable-field': ((params) => !params.context.componentParent.isSummaryView &&
                            !params.context.componentParent.privileges.hasSuperTradePrivilege && (params.data.isInvoiced
                                || !params.context.componentParent.privileges.counterPartyPrivilege)
                            || params.data.isCancelled || params.data.isClosed),
                        'ag-grid-row-gray-background': ((params) => params.context.componentParent.isSummaryView
                            && params.data.commodityChange || params.data.isCancelled || params.data.isClosed),
                    },
                    tooltip: (params) => {
                        if (!params.context.componentParent.isSummaryView
                            && !params.context.componentParent.privileges.hasSuperTradePrivilege) {
                            if (!params.context.componentParent.privileges.counterPartyPrivilege) {
                                return params.data.commodityErrorMessage;
                            } else {
                                return params.data.invoicingConditionErrorMessage;
                            }
                        }
                    },
                    onCellValueChanged: (params) => {
                    },
                },
                {
                    headerName: 'commodity4',
                    field: 'commodity4',
                    colId: 'commodity4',
                    cellClass: (params) => {
                        if (params.node.rowPinned) {
                            return 'pinnedRow';
                        }
                    },
                    cellClassRules: {
                        'ag-grid-disable-field': ((params) => !params.context.componentParent.isSummaryView &&
                            !params.context.componentParent.privileges.hasSuperTradePrivilege && (params.data.isInvoiced
                                || !params.context.componentParent.privileges.counterPartyPrivilege)
                            || params.data.isCancelled || params.data.isClosed),
                        'ag-grid-row-gray-background': ((params) => params.context.componentParent.isSummaryView
                            && params.data.commodityChange || params.data.isCancelled || params.data.isClosed),
                    },
                    tooltip: (params) => {
                        if (!params.context.componentParent.isSummaryView
                            && !params.context.componentParent.privileges.hasSuperTradePrivilege) {
                            if (!params.context.componentParent.privileges.counterPartyPrivilege) {
                                return params.data.commodityErrorMessage;
                            } else {
                                return params.data.invoicingConditionErrorMessage;
                            }
                        }
                    },
                    onCellValueChanged: (params) => {
                    },
                },
                {
                    headerName: 'commodity5',
                    field: 'commodity5',
                    colId: 'commodity5',
                    cellClass: (params) => {
                        if (params.node.rowPinned) {
                            return 'pinnedRow';
                        }
                    },
                    cellClassRules: {
                        'ag-grid-disable-field': ((params) => !params.context.componentParent.isSummaryView &&
                            !params.context.componentParent.privileges.hasSuperTradePrivilege && (params.data.isInvoiced
                                || !params.context.componentParent.privileges.counterPartyPrivilege)
                            || params.data.isCancelled || params.data.isClosed),
                        'ag-grid-row-gray-background': ((params) => params.context.componentParent.isSummaryView
                            && params.data.commodityChange || params.data.isCancelled || params.data.isClosed),
                    },
                    tooltip: (params) => {
                        if (!params.context.componentParent.isSummaryView
                            && !params.context.componentParent.privileges.hasSuperTradePrivilege) {
                            if (!params.context.componentParent.privileges.counterPartyPrivilege) {
                                return params.data.commodityErrorMessage;
                            } else {
                                return params.data.invoicingConditionErrorMessage;
                            }
                        }
                    },
                    onCellValueChanged: (params) => {
                    },
                },
                {
                    headerName: 'Crop Year',
                    field: 'cropYear',
                    colId: 'cropYear',
                    hide: true,
                    cellClass: (params) => {
                        if (params.node.rowPinned) {
                            return 'pinnedRow';
                        }
                    },
                    editable: (params) => this.tradeEditService.isGridCellEditable(params, this.privileges, this.lockedContracts),
                    onCellValueChanged: (params) => {
                        if (params.data.cropYear !== params.value) {
                            this.isValueChanged = true;
                        }
                        this.tradeEditService.isCropYearValid(params);
                        params.data.cropYearChange = true;
                    },
                    cellClassRules: {
                        'ag-grid-invalid-mandatory-field': ((params) => params.data.cropYearValidationMessage),
                        'ag-grid-disable-field': ((params) => !params.context.componentParent.isSummaryView
                            && !params.context.componentParent.privileges.cropYearPrivilege
                            || params.data.isCancelled || params.data.isClosed),
                        'ag-grid-row-gray-background': ((params) => params.context.componentParent.isSummaryView
                            && params.data.cropYearChange || params.data.isCancelled || params.data.isClosed),
                    },
                    tooltip: (params) => {
                        if (!params.context.componentParent.isSummaryView) {
                            if (!params.context.componentParent.privileges.cropYearPrivilege) {
                                return params.data.cropYearErrorMessage;
                            } else if (params.data.cropYearValidationMessage) {
                                return params.data.cropYearValidationMessage;
                            }
                        }
                    },
                },
                {
                    headerName: 'Quantity Code *',
                    field: 'weightUnitId',
                    colId: 'weightUnitId',
                    hide: true,
                },
                {
                    field: 'weightCodeConversion',
                    colId: 'weightCodeConversion',
                    hide: true,
                },
                {
                    headerName: 'Quantity *',
                    field: 'quantity',
                    colId: 'quantity',
                    hide: true,
                },
                {
                    headerName: 'Contract Term Code *',
                    field: 'contractTermId',
                    colId: 'contractTermId',
                    hide: true,
                    cellClass: (params) => {
                        if (params.node.rowPinned) {
                            return 'pinnedRow';
                        }
                    },
                    pinnedRowCellRendererFramework: AgGridAutocompleteComponent,
                    pinnedRowCellRendererParams: (params) => {
                        return {
                            context: {
                                componentParent: this,
                                gridEditable: (!params.context.componentParent.isSummaryView
                                    && params.context.componentParent.privileges.contractTermsPrivilege),
                            },
                            options: this.masterdata.contractTerms,
                            valueProperty: 'contractTermId',
                            codeProperty: 'contractTermCode',
                            displayProperty: 'description',
                            displayCode: true,
                        };
                    },
                    cellRendererFramework: AgGridAutocompleteComponent,
                    cellRendererParams: (params) => {
                        return {
                            context: {
                                componentParent: this,
                                gridEditable: this.tradeEditService.isGridCellEditable(params, this.privileges, this.lockedContracts),
                            },
                            options: this.masterdata.contractTerms,
                            valueProperty: 'contractTermId',
                            codeProperty: 'contractTermCode',
                            displayProperty: 'description',
                            isRequired: true,
                            displayCode: true,
                        };
                    },
                    onCellValueChanged: (params) => {
                        const filteredContractTerms = this.masterdata.contractTerms.find((e) =>
                            e.contractTermId === params.data.contractTermId);
                        if (filteredContractTerms) {
                            params.node.setDataValue('contractTermDescription', filteredContractTerms.description);
                            this.setAmmendedStatus(params);
                            params.data.contractTermChange = true;
                        }
                    },
                    cellClassRules: {
                        'ag-grid-disable-field': ((params) => !params.context.componentParent.isSummaryView &&
                            !params.context.componentParent.privileges.hasSuperTradePrivilege && (params.data.isInvoiced
                                || !params.context.componentParent.privileges.contractTermsPrivilege)
                            || params.data.isCancelled || params.data.isClosed),
                        'ag-grid-row-gray-background': ((params) => params.context.componentParent.isSummaryView
                            && params.data.contractTermChange || params.data.isCancelled || params.data.isClosed),
                    },
                    tooltip: (params) => {
                        if (!params.context.componentParent.isSummaryView
                            && !params.context.componentParent.privileges.hasSuperTradePrivilege) {
                            if (!params.context.componentParent.privileges.contractTermsPrivilege) {
                                return params.data.contractTermsErrorMessage;
                            } else {
                                return params.data.invoicingConditionErrorMessage;
                            }
                        }
                    },
                },
                {
                    headerName: 'Contract Term Description',
                    field: 'contractTermDescription',
                    colId: 'contractTermDescription',
                    cellRenderer: this.contractTermDescriptionFormatter.bind(this),
                    cellClass: (params) => {
                        if (params.node.rowPinned) {
                            return 'pinnedRow';
                        }
                    },
                    cellClassRules: {
                        'ag-grid-disable-field': ((params) => !params.context.componentParent.isSummaryView &&
                            !params.context.componentParent.privileges.hasSuperTradePrivilege && (params.data.isInvoiced
                                || !params.context.componentParent.privileges.contractTermsPrivilege)
                            || params.data.isCancelled || params.data.isClosed),
                        'ag-grid-row-gray-background': ((params) => params.context.componentParent.isSummaryView
                            && params.data.contractTermChange || params.data.isCancelled || params.data.isClosed),
                    },
                    tooltip: (params) => {
                        if (!params.context.componentParent.isSummaryView
                            && !params.context.componentParent.privileges.hasSuperTradePrivilege) {
                            if (!params.context.componentParent.privileges.contractTermsPrivilege) {
                                return params.data.contractTermsErrorMessage;
                            } else {
                                return params.data.invoicingConditionErrorMessage;
                            }
                        }
                    },
                },
                {
                    headerName: 'Port Terms *',
                    field: 'portTermId',
                    colId: 'portTermId',
                    hide: true,
                    cellClass: (params) => {
                        if (params.node.rowPinned) {
                            return 'pinnedRow';
                        }
                    },
                    pinnedRowCellRendererFramework: AgGridAutocompleteComponent,
                    pinnedRowCellRendererParams: (params) => {
                        return {
                            context: {
                                componentParent: this,
                                gridEditable: (!params.context.componentParent.isSummaryView
                                    && params.context.componentParent.privileges.portTermsPrivilege),
                            },
                            options: this.masterdata.ports,
                            valueProperty: 'portId',
                            codeProperty: 'portCode',
                            displayProperty: 'description',
                        };
                    },
                    cellRendererFramework: AgGridAutocompleteComponent,
                    cellRendererParams: (params) => {
                        return {
                            context: {
                                componentParent: this,
                                gridEditable: this.tradeEditService.isGridCellEditable(params, this.privileges, this.lockedContracts),
                            },
                            options: this.masterdata.ports,
                            valueProperty: 'portId',
                            codeProperty: 'portCode',
                            displayProperty: 'description',
                            isRequired: true,
                            displayCode: true,
                        };
                    },
                    onCellValueChanged: (params) => {
                        if (params.data.portTermId !== params.value) {
                            this.isValueChanged = true;
                        }
                        const filteredPortCode = params.context.componentParent.masterdata.ports.find((e) =>
                            e.portId === params.data.portTermId);
                        if (!params.data.portTermChange && (params.data.portTermId !== params.value)) {
                            if (filteredPortCode) {
                                this.setAmmendedStatus(params);
                                params.data.portTermChange = true;
                            }
                        }
                    },
                    cellClassRules: {
                        'ag-grid-disable-field': ((params) => !params.context.componentParent.isSummaryView &&
                            !params.context.componentParent.privileges.hasSuperTradePrivilege && (params.data.isInvoiced
                                || !params.context.componentParent.privileges.portTermsPrivilege)
                            || params.data.isCancelled || params.data.isClosed),
                        'ag-grid-row-gray-background': ((params) => params.context.componentParent.isSummaryView
                            && params.data.portTermChange || params.data.isCancelled || params.data.isClosed),
                    },
                    tooltip: (params) => {
                        if (!params.context.componentParent.isSummaryView
                            && !params.context.componentParent.privileges.hasSuperTradePrivilege) {
                            if (!params.context.componentParent.privileges.portTermsPrivilege) {
                                return params.data.portTermsErrorMessage;
                            } else {
                                return params.data.invoicingConditionErrorMessage;
                            }
                        }
                    },
                },
                {
                    headerName: 'Arbitration Code',
                    field: 'arbitrationId',
                    colId: 'arbitrationId',
                    hide: true,
                    cellClass: (params) => {
                        if (params.node.rowPinned) {
                            return 'pinnedRow';
                        }
                    },
                    pinnedRowCellRendererFramework: AgGridAutocompleteComponent,
                    pinnedRowCellRendererParams: (params) => {
                        return {
                            context: {
                                componentParent: this,
                                gridEditable: (!params.context.componentParent.isSummaryView
                                    && params.context.componentParent.privileges.arbitrationPrivilege),
                            },
                            options: this.masterdata.arbitrations,
                            valueProperty: 'arbitrationId',
                            codeProperty: 'arbitrationCode',
                            displayProperty: 'description',
                            displayCode: true,
                        };
                    },
                    cellRendererFramework: AgGridAutocompleteComponent,
                    cellRendererParams: (params) => {
                        return {
                            context: {
                                componentParent: this,
                                gridEditable: this.tradeEditService.isGridCellEditable(params, this.privileges, this.lockedContracts),
                            },
                            options: this.masterdata.arbitrations,
                            valueProperty: 'arbitrationId',
                            codeProperty: 'arbitrationCode',
                            displayProperty: 'description',
                            displayCode: true,
                        };
                    },
                    onCellValueChanged: (params) => {
                        if (params.data.arbitrationId !== params.value) {
                            this.isValueChanged = true;
                        }
                        const filteredArbitrationCode = this.masterdata.arbitrations.find((e) =>
                            e.arbitrationId === params.data.arbitrationId);
                        if (filteredArbitrationCode) {
                            params.node.setDataValue('arbitrationDescription', filteredArbitrationCode.description);
                            this.setAmmendedStatus(params);
                            params.data.arbitrationCodeChange = true;
                        }
                    },
                    cellClassRules: {
                        'ag-grid-disable-field': ((params) => !params.context.componentParent.isSummaryView
                            && !params.context.componentParent.privileges.arbitrationPrivilege
                            || params.data.isCancelled || params.data.isClosed),
                        'ag-grid-row-gray-background': ((params) => params.context.componentParent.isSummaryView
                            && params.data.arbitrationCodeChange || params.data.isCancelled || params.data.isClosed),
                    },
                    tooltip: (params) => {
                        if (!params.context.componentParent.isSummaryView) {
                            if (!params.context.componentParent.privileges.arbitrationPrivilege) {
                                return params.data.arbitrationErrorMessage;
                            } else {
                                return null;
                            }
                        }
                    },
                },
                {
                    headerName: 'Arbitration Description',
                    field: 'arbitrationDescription',
                    colId: 'arbitrationDescription',
                    cellRenderer: this.arbitrationDescriptionFormatter.bind(this),
                    cellClass: (params) => {
                        if (params.node.rowPinned) {
                            return 'pinnedRow';
                        }
                    },
                    cellClassRules: {
                        'ag-grid-disable-field': ((params) => !params.context.componentParent.isSummaryView
                            && !params.context.componentParent.privileges.arbitrationPrivilege
                            || params.data.isCancelled || params.data.isClosed),
                        'ag-grid-row-gray-background': ((params) => params.context.componentParent.isSummaryView
                            && params.data.arbitrationCodeChange || params.data.isCancelled || params.data.isClosed),
                    },
                    tooltip: (params) => {
                        if (!params.context.componentParent.isSummaryView) {
                            if (!params.context.componentParent.privileges.arbitrationPrivilege) {
                                return params.data.arbitrationErrorMessage;
                            } else {
                                return null;
                            }
                        }
                    },
                },
                {
                    headerName: 'Currency Code *',
                    field: 'currencyCode',
                    colId: 'currencyCode',
                    hide: true,
                    cellClass: (params) => {
                        if (params.node.rowPinned) {
                            return 'pinnedRow';
                        }
                    },
                    pinnedRowCellRendererFramework: AgGridAutocompleteComponent,
                    pinnedRowCellRendererParams: (params) => {
                        return {
                            context: {
                                componentParent: this,
                                gridEditable: (!params.context.componentParent.isSummaryView
                                    && params.context.componentParent.privileges.currencyPrivilege),
                            },
                            options: this.masterdata.currencies,
                            valueProperty: 'currencyCode',
                            codeProperty: 'currencyCode',
                            displayProperty: 'description',
                            displayCode: true,
                        };
                    },
                    cellRendererFramework: AgGridAutocompleteComponent,
                    cellRendererParams: (params) => {
                        return {
                            context: {
                                componentParent: this,
                                gridEditable: this.tradeEditService.isGridCellEditable(params, this.privileges, this.lockedContracts),
                            },
                            options: this.masterdata.currencies,
                            valueProperty: 'currencyCode',
                            codeProperty: 'currencyCode',
                            displayProperty: 'description',
                            isRequired: true,
                            displayCode: true,
                        };
                    },
                    onCellValueChanged: (params) => {
                        if (params.data.currencyCode !== params.value) {
                            this.isValueChanged = true;
                        }
                        const filteredCurrencyCode = this.masterdata.currencies.find((e) =>
                            e.currencyCode === params.data.currencyCode);
                        if (filteredCurrencyCode) {
                            this.contractValueCalculation(params);
                            params.node.setDataValue('currencyDescription', filteredCurrencyCode.description);
                            this.setAmmendedStatus(params);
                            params.data.currencyCodeChange = true;
                        }
                    },
                    cellClassRules: {
                        'ag-grid-disable-field': ((params) => !params.context.componentParent.isSummaryView &&
                            !params.context.componentParent.privileges.hasSuperTradePrivilege && (params.data.isInvoiced
                                || !params.context.componentParent.privileges.currencyPrivilege)
                            || params.data.isCancelled || params.data.isClosed),
                        'ag-grid-row-gray-background': ((params) => params.context.componentParent.isSummaryView
                            && params.data.currencyCodeChange || params.data.isCancelled || params.data.isClosed),
                    },
                    tooltip: (params) => {
                        if (!params.context.componentParent.isSummaryView
                            && !params.context.componentParent.privileges.hasSuperTradePrivilege) {
                            if (!params.context.componentParent.privileges.currencyPrivilege) {
                                return params.data.currencyErrorMessage;
                            } else {
                                return params.data.invoicingConditionErrorMessage;
                            }
                        }
                    },
                },
                {
                    headerName: 'Currency Description',
                    field: 'currencyDescription',
                    colId: 'currencyDescription',
                    cellRenderer: this.currencyDescriptionFormatter.bind(this),
                    cellClass: (params) => {
                        if (params.node.rowPinned) {
                            return 'pinnedRow';
                        }
                    },
                    cellClassRules: {
                        'ag-grid-disable-field': ((params) => !params.context.componentParent.isSummaryView &&
                            !params.context.componentParent.privileges.hasSuperTradePrivilege && (params.data.isInvoiced
                                || !params.context.componentParent.privileges.currencyPrivilege)
                            || params.data.isCancelled || params.data.isClosed),
                        'ag-grid-row-gray-background': ((params) => params.context.componentParent.isSummaryView
                            && params.data.currencyCodeChange || params.data.isCancelled || params.data.isClosed),
                    },
                    tooltip: (params) => {
                        if (!params.context.componentParent.isSummaryView
                            && !params.context.componentParent.privileges.hasSuperTradePrivilege) {
                            if (!params.context.componentParent.privileges.currencyPrivilege) {
                                return params.data.currencyErrorMessage;
                            } else {
                                return params.data.invoicingConditionErrorMessage;
                            }
                        }
                    },
                },
                {
                    headerName: 'Price Code *',
                    field: 'priceUnitId',
                    colId: 'priceUnitId',
                    hide: true,
                    cellClass: (params) => {
                        if (params.node.rowPinned) {
                            return 'pinnedRow';
                        }
                    },

                    pinnedRowCellRendererFramework: AgGridAutocompleteComponent,
                    pinnedRowCellRendererParams: (params) => {
                        return {
                            context: {
                                componentParent: this,
                                gridEditable: (params.context.componentParent.privileges.priceCodePrivilege),
                            },
                            options: this.masterdata.priceUnits,
                            valueProperty: 'priceUnitId',
                            codeProperty: 'priceCode',
                            displayProperty: 'description',
                        };
                    },
                    cellRendererFramework: AgGridAutocompleteComponent,
                    cellRendererParams: (params) => {
                        return {
                            context: {
                                componentParent: this,
                                gridEditable: this.tradeEditService.isGridCellEditable(params, this.privileges, this.lockedContracts),
                            },
                            options: this.masterdata.priceUnits,
                            valueProperty: 'priceUnitId',
                            codeProperty: 'priceCode',
                            displayProperty: 'description',
                            isRequired: true,
                        };
                    },
                    onCellValueChanged: (params) => {
                        const filteredPriceCode = this.masterdata.priceUnits.find((e) =>
                            e.priceUnitId === params.data.priceUnitId);
                        if (filteredPriceCode) {
                            if ((params.data.portTermId !== params.value)) {
                                this.contractValueCalculation(params);
                                this.setAmmendedStatus(params);
                                params.data.priceCodeChange = true;
                            }
                        }
                    },
                    cellClassRules: {
                        'ag-grid-disable-field': ((params) => !params.context.componentParent.isSummaryView &&
                            !params.context.componentParent.privileges.hasSuperTradePrivilege && (params.data.isInvoiced
                                || !params.context.componentParent.privileges.priceCodePrivilege)
                            || params.data.isCancelled || params.data.isClosed),
                        'ag-grid-row-gray-background': ((params) => params.context.componentParent.isSummaryView
                            && params.data.priceCodeChange || params.data.isCancelled || params.data.isClosed),
                    },
                    tooltip: (params) => {
                        if (!params.context.componentParent.isSummaryView
                            && !params.context.componentParent.privileges.hasSuperTradePrivilege) {
                            if (!params.context.componentParent.privileges.priceCodePrivilege) {
                                return params.data.priceCodeErrorMessage;
                            } else {
                                return params.data.invoicingConditionErrorMessage;
                            }
                        }
                    },
                },
                {
                    field: 'priceCodeConversion',
                    colId: 'priceCodeConversion',
                    hide: true,
                },
                {
                    headerName: 'Contract Price *',
                    field: 'contractPrice',
                    colId: 'contractPrice',
                    hide: true,
                    editable: (params) => this.tradeEditService.isGridCellEditable(params, this.privileges, this.lockedContracts),
                    cellEditor: 'atlasNumeric',
                    cellRenderer: this.requiredString,
                    cellEditorParams: {
                        displayMask: CustomNumberMask(12, 10, false),
                        isRightAligned: false,
                    },
                    cellClass: (params) => {
                        if (params.node.rowPinned) {
                            return 'pinnedRow';
                        }
                    },
                    pinnedRowCellRenderer: 'atlasNumeric',
                    pinnedRowCellRendererParams: {
                        displayMask: CustomNumberMask(12, 10, false),
                        isRightAligned: false,
                        editable: true,
                    },
                    onCellValueChanged: (params) => {
                        this.contractValueCalculation(params);
                        this.setAmmendedStatus(params);
                        params.data.contractPriceChange = true;
                    },
                    cellClassRules: {
                        'ag-grid-disable-field': ((params) => !params.context.componentParent.isSummaryView &&
                            !params.context.componentParent.privileges.hasSuperTradePrivilege && (params.data.isInvoiced
                                || !params.context.componentParent.privileges.contractPricePrivilege)
                            || params.data.isCancelled || params.data.isClosed),
                        'ag-grid-row-gray-background': ((params) => params.context.componentParent.isSummaryView
                            && params.data.contractPriceChange || params.data.isCancelled || params.data.isClosed),
                    },
                    tooltip: (params) => {
                        if (!params.context.componentParent.isSummaryView
                            && !params.context.componentParent.privileges.hasSuperTradePrivilege) {
                            if (!params.context.componentParent.privileges.contractPricePrivilege) {
                                return params.data.contractPriceErrorMessage;
                            } else {
                                return params.data.invoicingConditionErrorMessage;
                            }
                        }
                    },
                },
                {
                    headerName: 'Contract Value',
                    field: 'contractValue',
                    colId: 'contractValue',
                    hide: true,
                    editable: false,
                    valueFormatter: this.numberFormatter.bind(this),
                    cellClass: (params) => {
                        if (params.node.rowPinned) {
                            return 'pinnedRow';
                        }
                    },
                    cellClassRules: {
                        'ag-grid-disable-field': ((params) => !params.context.componentParent.isSummaryView && (params.data.isInvoiced
                            || !params.context.componentParent.privileges.contractValuePrivilege)
                            || params.data.isCancelled || params.data.isClosed),
                        'ag-grid-row-gray-background': ((params) => params.context.componentParent.isSummaryView
                            && params.data.contractValueChange || params.data.isCancelled || params.data.isClosed),
                    },
                },
                {
                    headerName: 'Payment Term Code *',
                    field: 'paymentTermsId',
                    colId: 'paymentTermsId',
                    hide: true,
                    cellClass: (params) => {
                        if (params.node.rowPinned) {
                            return 'pinnedRow';
                        }
                    },
                    pinnedRowCellRendererFramework: AgGridAutocompleteComponent,
                    pinnedRowCellRendererParams: (params) => {
                        return {
                            context: {
                                componentParent: this,
                                gridEditable: (!params.context.componentParent.isSummaryView
                                    && params.context.componentParent.privileges.paymentTermsPrivilege),
                            },
                            options: this.masterdata.paymentTerms,
                            valueProperty: 'paymentTermsId',
                            codeProperty: 'paymentTermCode',
                            displayProperty: 'description',
                            displayCode: true,
                        };
                    },
                    cellRendererFramework: AgGridAutocompleteComponent,
                    cellRendererParams: (params) => {
                        return {
                            context: {
                                componentParent: this,
                                gridEditable: this.tradeEditService.isGridCellEditable(params, this.privileges, this.lockedContracts),
                            },
                            options: this.masterdata.paymentTerms,
                            valueProperty: 'paymentTermsId',
                            codeProperty: 'paymentTermCode',
                            displayProperty: 'description',
                            isRequired: true,
                            editable: this.tradeEditService.isGridCellEditable(params, this.privileges, this.lockedContracts),
                        };
                    },
                    onCellValueChanged: (params) => {
                        if (params.data.paymentTermsId !== params.value) {
                            this.isValueChanged = true;
                        }
                        const filteredPaymentTerms = this.masterdata.paymentTerms.find((e) =>
                            e.paymentTermsId === params.data.paymentTermsId);
                        if (filteredPaymentTerms) {
                            this.setAmmendedStatus(params);
                            params.data.paymentTermChange = true;
                        }
                    },
                    cellClassRules: {
                        'ag-grid-disable-field': ((params) => !params.context.componentParent.isSummaryView
                            && !params.context.componentParent.privileges.paymentTermsPrivilege
                            || params.data.isCancelled || params.data.isClosed),
                        'ag-grid-row-gray-background': ((params) => params.context.componentParent.isSummaryView
                            && params.data.paymentTermChange || params.data.isCancelled || params.data.isClosed),
                    },
                    tooltip: (params) => {
                        if (!params.context.componentParent.isSummaryView) {
                            if (!params.context.componentParent.privileges.paymentTermsPrivilege) {
                                return params.data.paymentTermsErrorMessage;
                            } else {
                                return null;
                            }
                        }
                    },
                },
                {
                    headerName: 'Period Type *',
                    field: 'periodTypeDescription',
                    colId: 'periodTypeId',
                    hide: true,
                    editable: (params) => this.tradeEditService.isGridCellEditable(params, this.privileges, this.lockedContracts),
                    cellEditor: 'agRichSelectCellEditor',
                    cellEditorParams: () => {
                        return {
                            values: this.masterdata.periodTypes.map((basis) => basis.periodTypeDescription),
                            displayPropertyName: 'periodTypeDescription',
                            valuePropertyName: 'periodTypeId',
                        };
                    },
                    cellClass: (params) => {
                        if (params.node.rowPinned) {
                            return 'pinnedRow';
                        }
                    },
                    cellClassRules: {
                        'ag-grid-disable-field': ((params) => !params.context.componentParent.isSummaryView
                            && !params.context.componentParent.privileges.periodTypePrivilege
                            || params.data.isCancelled || params.data.isClosed),
                        'ag-grid-row-gray-background': ((params) => params.context.componentParent.isSummaryView
                            && params.data.periodTypePrivilege || params.data.isCancelled || params.data.isClosed),
                    },
                    onCellValueChanged: (params) => {
                        const filteredPeriodType = this.masterdata.periodTypes.find((e) =>
                            e.periodTypeDescription === params.newValue);
                        if (filteredPeriodType) {
                            params.node.setDataValue('periodTypeDescription', params.newValue);
                            this.setAmmendedStatus(params);
                            params.data.periodTypeChange = true;
                        }
                    },
                    tooltip: (params) => {
                        if (!params.context.componentParent.isSummaryView) {
                            if (!params.context.componentParent.privileges.periodTypePrivilege) {
                                return params.data.periodTypeErrorMessage;
                            } else {
                                return null;
                            }
                        }
                    },
                },
                {
                    headerName: 'Shipping Period Start *',
                    field: 'deliveryPeriodStart',
                    colId: 'deliveryPeriodStart',
                    hide: true,
                    editable: (params) => this.tradeEditService.isGridCellEditable(params, this.privileges, this.lockedContracts),
                    cellEditor: 'atlasDatePicker',
                    valueFormatter: this.uiService.dateFormatter,
                    cellEditorParams: {
                        isRequired: true,
                    },
                    cellClass: (params) => {
                        if (params.node.rowPinned) {
                            return 'pinnedRow';
                        }
                    },
                    onCellValueChanged: (params) => {
                        if (params.data.shipmentPeriodValidationStyleChange && (params.newValue && params.oldValue !== params.newValue)) {
                            this.setAmmendedStatus(params);
                            params.data.shipmentperiodChange = true;
                            this.isValueChanged = true;
                        }
                    },
                    cellClassRules: {
                        'ag-grid-invalid-mandatory-field': ((params) => !params.context.componentParent.isSummaryView
                            && !params.data.shipmentPeriodValidationStyleChange),
                        'ag-grid-disable-field': ((params) => !params.context.componentParent.isSummaryView
                            && (!params.data.isPeriodEditable || !params.context.componentParent.privileges.fromDatePrivilege)
                            || params.data.isCancelled || params.data.isClosed),
                        'ag-grid-row-gray-background': ((params) => params.context.componentParent.isSummaryView
                            && params.data.shipmentperiodChange || params.data.isCancelled || params.data.isClosed),
                    },
                    tooltip: (params) => {
                        if (!params.context.componentParent.isSummaryView) {
                            if (!params.context.componentParent.privileges.fromDatePrivilege) {
                                return params.data.fromDateErrorMessage;
                            } else {
                                return this.tradeEditService.ShipmentFromDateValidationMessage(params);
                            }
                        }
                    },
                },
                {
                    headerName: 'Shipping Period End *',
                    field: 'deliveryPeriodEnd',
                    colId: 'deliveryPeriodEnd',
                    hide: true,
                    editable: (params) => this.tradeEditService.isGridCellEditable(params, this.privileges, this.lockedContracts),
                    cellEditor: 'atlasDatePicker',
                    valueFormatter: this.uiService.dateFormatter,
                    cellEditorParams: {
                        isRequired: true,
                    },
                    cellClass: (params) => {
                        if (params.node.rowPinned) {
                            return 'pinnedRow';
                        }
                    },
                    cellClassRules: {
                        'ag-grid-invalid-mandatory-field': ((params) => !params.context.componentParent.isSummaryView
                            && !params.data.shipmentPeriodValidationStyleChange),
                        'ag-grid-disable-field': ((params) => !params.context.componentParent.isSummaryView
                            && (!params.data.isPeriodEditable || !params.context.componentParent.privileges.toDatePrivilege)
                            || params.data.isCancelled || params.data.isClosed),
                        'ag-grid-row-gray-background': ((params) => params.context.componentParent.isSummaryView
                            && params.data.shipmentToDateChange || params.data.isCancelled || params.data.isClosed),
                    },
                    onCellValueChanged: (params) => {
                        if (params.data.shipmentPeriodValidationStyleChange && (params.newValue && params.oldValue !== params.newValue)) {
                            this.setAmmendedStatus(params);
                            params.data.shipmentToDateChange = true;
                            this.isValueChanged = true;
                        }
                    },
                    tooltip: (params) => {
                        if (!params.context.componentParent.isSummaryView) {
                            if (!params.context.componentParent.privileges.toDatePrivilege) {
                                return params.data.toDateErrorMessage;
                            } else {
                                return this.tradeEditService.ShipmentToDateValidationMessage(params);
                            }
                        }
                    },
                },
                {
                    field: 'positionMonthType',
                    colId: 'positionMonthType',
                    hide: true,
                },
                {
                    field: 'monthPositionIndex',
                    colId: 'monthPositionIndex',
                    cellRenderer: this.positionMonthTypeFormatter.bind(this),
                    hide: true,
                },
                {
                    headerName: 'Position Month *',
                    field: 'positionMonthValue',
                    colId: 'positionMonthValue',
                    hide: true,
                    cellClass: (params) => {
                        if (params.node.rowPinned) {
                            return 'pinnedRow';
                        }
                    },
                    pinnedRowCellRendererFramework: AgGridAutocompleteComponent,
                    pinnedRowCellRendererParams: (params) => {
                        return {
                            context: {
                                componentParent: this,
                                gridEditable: (!params.context.componentParent.isSummaryView
                                    && params.context.componentParent.privileges.positionTypePrivilege),
                            },
                            options: this.masterdata.positionMonthTypes,
                            valueProperty: 'value',
                            codeProperty: 'value',
                            displayProperty: 'positionMonthTypeDescription',
                            displayCode: true,
                        };
                    },
                    cellRendererFramework: AgGridAutocompleteComponent,
                    cellRendererParams: (params) => {
                        return {
                            context: {
                                componentParent: this,
                                gridEditable: this.tradeEditService.isGridCellEditable(params, this.privileges, this.lockedContracts),
                            },
                            options: this.masterdata.positionMonthTypes,
                            valueProperty: 'value',
                            codeProperty: 'value',
                            displayProperty: 'positionMonthTypeDescription',
                            isRequired: false,
                            editable: this.tradeEditService.isGridCellEditable(params, this.privileges, this.lockedContracts),
                        };
                    },
                    onCellValueChanged: (params) => {
                        const filteredPositionMonth = params.context.componentParent.masterdata.positionMonthTypes.find((e) =>
                            e.value === params.data.positionMonthValue);
                        if (params.newValue && (params.data.positionMonthValue !== params.newValue)) {
                            if (filteredPositionMonth) {
                                this.setAmmendedStatus(params);
                                params.data.positionMonthChange = true;
                                params.data.positionMonthType = filteredPositionMonth.positionMonthTypeCode.type;
                                params.data.monthPositionIndex = filteredPositionMonth.positionMonthTypeCode.month;
                            }
                        }
                    },
                    cellClassRules: {
                        'ag-grid-disable-field': ((params) => !params.context.componentParent.isSummaryView
                            && !params.context.componentParent.privileges.positionTypePrivilege
                            || params.data.isCancelled || params.data.isClosed),
                        'ag-grid-row-gray-background': ((params) => params.context.componentParent.isSummaryView
                            && params.data.positionMonthChange || params.data.isCancelled || params.data.isClosed),
                    },
                    tooltip: (params) => {
                        if (!params.context.componentParent.isSummaryView) {
                            if (!params.context.componentParent.privileges.positionTypePrivilege) {
                                return params.data.positionTypeErrorMessage;
                            } else {
                                return null;
                            }
                        }
                    },
                },
                {
                    headerName: 'Port of Origin',
                    field: 'portOriginId',
                    colId: 'portOriginId',
                    hide: true,
                    cellClass: (params) => {
                        if (params.node.rowPinned) {
                            return 'pinnedRow';
                        }
                    },
                    pinnedRowCellRendererFramework: AgGridAutocompleteComponent,
                    pinnedRowCellRendererParams: (params) => {
                        return {
                            context: {
                                componentParent: this,
                                gridEditable: (params.context.componentParent.privileges.portOfOriginPrivilege),
                            },
                            options: this.masterdata.ports,
                            valueProperty: 'portId',
                            codeProperty: 'portCode',
                            displayProperty: 'description',
                        };
                    },
                    cellRendererFramework: AgGridAutocompleteComponent,
                    cellRendererParams: (params) => {
                        return {
                            context: {
                                componentParent: this,
                                gridEditable: this.tradeEditService.isGridCellEditable(params, this.privileges, this.lockedContracts),
                            },
                            options: this.masterdata.ports,
                            valueProperty: 'portId',
                            codeProperty: 'portCode',
                            displayProperty: 'description',
                            isRequired: false,
                        };
                    },
                    onCellValueChanged: (params) => {
                        const filteredPortOriginCode = this.masterdata.ports.find((e) =>
                            e.portId === params.data.portOriginId);
                        if (!params.data.portOfOriginChange && (params.data.portTermId !== params.value)) {
                            if (filteredPortOriginCode) {
                                this.setAmmendedStatus(params);
                                params.data.portOfOriginChange = true;
                            }
                        }
                    },
                    cellClassRules: {
                        'ag-grid-disable-field': ((params) => !params.context.componentParent.isSummaryView
                            && !params.context.componentParent.privileges.portOfOriginPrivilege
                            || params.data.isCancelled || params.data.isClosed),
                        'ag-grid-row-gray-background': ((params) => params.context.componentParent.isSummaryView
                            && params.data.portOfOriginChange || params.data.isCancelled || params.data.isClosed),
                    },
                    tooltip: (params) => {
                        if (!params.context.componentParent.isSummaryView) {
                            if (!params.context.componentParent.privileges.portOfOriginPrivilege) {
                                return params.data.portOfOriginErrorMessage;
                            } else {
                                return null;
                            }
                        }
                    },
                },
                {
                    headerName: 'Port Destination',
                    field: 'portDestinationId',
                    colId: 'portDestinationId',
                    hide: true,
                    cellClass: (params) => {
                        if (params.node.rowPinned) {
                            return 'pinnedRow';
                        }
                    },
                    pinnedRowCellRendererFramework: AgGridAutocompleteComponent,
                    pinnedRowCellRendererParams: (params) => {
                        return {
                            context: {
                                componentParent: this,
                                gridEditable: (params.context.componentParent.privileges.portOfDestinationPrivilege),
                            },
                            options: this.masterdata.ports,
                            valueProperty: 'portId',
                            codeProperty: 'portCode',
                            displayProperty: 'description',
                        };
                    },
                    cellRendererFramework: AgGridAutocompleteComponent,
                    cellRendererParams: (params) => {
                        return {
                            context: {
                                componentParent: this,
                                gridEditable: this.tradeEditService.isGridCellEditable(params, this.privileges, this.lockedContracts),
                            },
                            options: this.masterdata.ports,
                            valueProperty: 'portId',
                            codeProperty: 'portCode',
                            displayProperty: 'description',
                            isRequired: false,
                        };
                    },
                    onCellValueChanged: (params) => {
                        const filteredPortDestinationCode = this.masterdata.ports.find((e) =>
                            e.portId === params.data.portDestinationId);
                        if (!params.data.portTermChange && (params.data.portTermId !== params.value)) {
                            if (filteredPortDestinationCode) {
                                this.setAmmendedStatus(params);
                                params.data.portDestinationChange = true;
                            }
                        }
                    },
                    cellClassRules: {
                        'ag-grid-disable-field': ((params) => !params.context.componentParent.isSummaryView
                            && !params.context.componentParent.privileges.portOfDestinationPrivilege
                            || params.data.isCancelled || params.data.isClosed),
                        'ag-grid-row-gray-background': ((params) => params.context.componentParent.isSummaryView
                            && params.data.portDestinationChange || params.data.isCancelled || params.data.isClosed),
                    },
                    tooltip: (params) => {
                        if (!params.context.componentParent.isSummaryView) {
                            if (!params.context.componentParent.privileges.portOfDestinationPrivilege) {
                                return params.data.portOfDestinationErrorMessage;
                            } else {
                                return null;
                            }
                        }
                    },
                },
                {
                    headerName: 'Business Sector',
                    field: 'businessSectorId',
                    colId: 'businessSectorId',
                    hide: true,
                    cellClass: (params) => {
                        if (params.node.rowPinned) {
                            return 'pinnedRow';
                        }
                    },
                    pinnedRowCellRendererFramework: AgGridAutocompleteComponent,
                    pinnedRowCellRendererParams: (params) => {
                        return {
                            context: {
                                componentParent: this,
                                gridEditable: (!params.context.componentParent.isSummaryView
                                    && params.context.componentParent.privileges.businessSectorPrivilege),
                            },
                            options: this.masterdata.businessSectors,
                            valueProperty: 'sectorId',
                            codeProperty: 'sectorCode',
                            displayProperty: 'description',
                            displayCode: true,
                        };
                    },
                    cellRendererFramework: AgGridAutocompleteComponent,
                    cellRendererParams: (params) => {
                        return {
                            context: {
                                componentParent: this,
                                gridEditable: this.tradeEditService.isGridCellEditable(params, this.privileges, this.lockedContracts),
                            },
                            options: this.masterdata.businessSectors,
                            valueProperty: 'sectorId',
                            codeProperty: 'sectorCode',
                            displayProperty: 'description',
                            isRequired: false,
                            displayCode: true,
                        };
                    },
                    onCellValueChanged: (params) => {
                        const filteredBusinessSectorCode = this.masterdata.businessSectors.find((e) =>
                            e.sectorId === params.data.businessSectorId);
                        if (filteredBusinessSectorCode) {
                            params.node.setDataValue('businessSectorDescription', filteredBusinessSectorCode.description);
                            this.setAmmendedStatus(params);
                            params.data.businessSectorChange = true;
                        }
                    },
                    cellClassRules: {
                        'ag-grid-disable-field': ((params) => !params.context.componentParent.isSummaryView && (params.data.isInvoiced
                            || !params.context.componentParent.privileges.businessSectorPrivilege)
                            || params.data.isCancelled || params.data.isClosed),
                        'ag-grid-row-gray-background': ((params) => params.context.componentParent.isSummaryView
                            && params.data.businessSectorChange || params.data.isCancelled || params.data.isClosed),
                    },
                    tooltip: (params) => {
                        if (!params.context.componentParent.isSummaryView) {
                            if (!params.context.componentParent.privileges.businessSectorPrivilege) {
                                return params.data.businessSectorErrorMessage;
                            } else {
                                return params.data.invoicingConditionErrorMessage;
                            }
                        }
                    },
                },
                {
                    headerName: 'Business Sector Description',
                    field: 'businessSectorDescription',
                    colId: 'businessSectorDescription',
                    cellRenderer: this.businessSectorDescriptionFormatter.bind(this),
                    cellClass: (params) => {
                        if (params.node.rowPinned) {
                            return 'pinnedRow';
                        }
                    },
                    cellClassRules: {
                        'ag-grid-disable-field': ((params) => !params.context.componentParent.isSummaryView && (params.data.isInvoiced
                            || !params.context.componentParent.privileges.businessSectorPrivilege)
                            || params.data.isCancelled || params.data.isClosed),
                        'ag-grid-row-gray-background': ((params) => params.context.componentParent.isSummaryView
                            && params.data.businessSectorChange || params.data.isCancelled || params.data.isClosed),
                    },
                    tooltip: (params) => {
                        if (!params.context.componentParent.isSummaryView) {
                            if (!params.context.componentParent.privileges.businessSectorPrivilege) {
                                return params.data.businessSectorErrorMessage;
                            } else {
                                return params.data.invoicingConditionErrorMessage;
                            }
                        }
                    },
                },
                {
                    headerName: 'Internal Memorandum',
                    field: 'memorandum',
                    colId: 'memorandum',
                    hide: true,
                    editable: (params) => this.tradeEditService.isGridCellEditable(params, this.privileges, this.lockedContracts),
                    cellClass: (params) => {
                        if (params.node.rowPinned) {
                            return 'pinnedRow';
                        }
                    },
                    cellEditor: 'agLargeTextCellEditor',
                    cellEditorParams: {
                        maxLength: 2000,
                        rows: 8,
                        cols: 50,
                    },
                    onCellValueChanged: (params) => {
                        if (params.data.memorandum !== params.value) {
                            this.isValueChanged = true;
                        }
                        this.setAmmendedStatus(params);
                        params.data.memoValueChange = true;
                    },
                    cellClassRules: {
                        'ag-grid-disable-field': ((params) => !params.context.componentParent.isSummaryView
                            && !params.context.componentParent.privileges.memoPrivilege || params.data.isCancelled || params.data.isClosed),
                        'ag-grid-row-gray-background': ((params) => params.context.componentParent.isSummaryView
                            && params.data.memoValueChange || params.data.isCancelled || params.data.isClosed),
                    },
                    tooltip: (params) => {
                        if (!params.context.componentParent.isSummaryView) {
                            if (!params.context.componentParent.privileges.memoPrivilege) {
                                return params.data.memoErrorMessage;
                            } else {
                                return null;
                            }
                        }
                    },
                },
                {
                    headerName: 'Contract Issued Date',
                    field: 'contractIssuedDate',
                    colId: 'contractIssuedDate',
                    hide: true,
                    editable: (params) => this.tradeEditService.isGridCellEditable(params, this.privileges, this.lockedContracts),
                    cellEditor: 'atlasDatePicker',
                    cellClass: (params) => {
                        if (params.node.rowPinned) {
                            return 'pinnedRow';
                        }
                    },
                    valueFormatter: this.uiService.dateFormatter,
                    cellEditorParams: {
                        mode: DateFormats.Date,
                    },
                    onCellValueChanged: (params) => {
                        this.setAmmendedStatus(params);
                        params.data.contractIssuedDateChange = true;
                    },
                    cellClassRules: {
                        'ag-grid-disable-field': ((params) => !params.context.componentParent.isSummaryView
                            && !params.context.componentParent.privileges.contractIssuedOnPrivilege
                            || params.data.isCancelled || params.data.isClosed),
                        'ag-grid-row-gray-background': ((params) => params.context.componentParent.isSummaryView
                            && params.data.contractIssuedDateChange || params.data.isCancelled || params.data.isClosed),
                    },
                    tooltip: (params) => {
                        if (!params.context.componentParent.isSummaryView) {
                            if (!params.context.componentParent.privileges.contractIssuedOnPrivilege) {
                                return params.data.contractIssuedErrorMessage;
                            } else {
                                return null;
                            }
                        }
                    },
                },
                {
                    headerName: 'Other Reference',
                    field: 'otherReference',
                    colId: 'otherReference',
                    hide: true,
                    editable: (params) => this.tradeEditService.isGridCellEditable(params, this.privileges, this.lockedContracts),
                    cellClass: (params) => {
                        if (params.node.rowPinned) {
                            return 'pinnedRow';
                        }
                    },
                    cellEditor: 'agLargeTextCellEditor',
                    cellEditorParams: {
                        maxLength: 12,
                        rows: 1,
                        cols: 12,
                    },
                    onCellValueChanged: (params) => {
                        this.setAmmendedStatus(params);
                        params.data.otherReferenceChange = true;
                    },
                    cellClassRules: {
                        'ag-grid-disable-field': ((params) => !params.context.componentParent.isSummaryView
                            && !params.context.componentParent.privileges.otherReferencePrivilege
                            || params.data.isCancelled || params.data.isClosed),
                        'ag-grid-row-gray-background': ((params) => params.context.componentParent.isSummaryView
                            && params.data.otherReferenceChange || params.data.isCancelled || params.data.isClosed),
                    },
                    tooltip: (params) => {
                        if (!params.context.componentParent.isSummaryView) {
                            if (!params.context.componentParent.privileges.otherReferencePrivilege) {
                                return params.data.otherReferenceErrorMessage;
                            } else {
                                return null;
                            }
                        }
                    },
                },
                {
                    headerName: 'Vessel Name',
                    field: 'vesselId',
                    colId: 'vesselId',
                    hide: true,
                    cellClass: (params) => {
                        if (params.node.rowPinned) {
                            return 'pinnedRow';
                        }
                    },
                    pinnedRowCellRendererFramework: AgGridContextualSearchComponent,
                    pinnedRowCellRendererParams: (params) => {
                        return {
                            context: {
                                componentParent: this,
                                gridEditable: (!params.context.componentParent.isSummaryView
                                    && params.context.componentParent.privileges.vesselNamePrivilege),
                            },
                            gridId: 'vesselsGrid',
                            options: this.masterdata.vessels,
                            codeProperty: 'vesselName',
                            descriptionProperty: 'description',
                            valueProperty: 'vesselId',
                            displayProperty: 'vesselName',
                            showContextualSearchIcon: (!params.context.componentParent.isSummaryView
                                && params.context.componentParent.privileges.vesselNamePrivilege),
                        };
                    },
                    cellRendererFramework: AgGridContextualSearchComponent,
                    cellRendererParams: (params) => {
                        return {
                            context: {
                                componentParent: this,
                                gridEditable: this.tradeEditService.isGridCellEditable(params, this.privileges, this.lockedContracts),
                            },
                            gridId: 'vesselsGrid',
                            options: this.masterdata.vessels,
                            codeProperty: 'vesselName',
                            descriptionProperty: 'description',
                            displayProperty: 'vesselName',
                            valueProperty: 'vesselId',
                            lightBoxTitle: 'Results for Vessels',
                            isRequired: false,
                            showContextualSearchIcon: this.tradeEditService
                                .isGridCellEditable(params, this.privileges, this.lockedContracts),
                        };
                    },
                    onCellValueChanged: (params) => {
                        const filteredVessel = this.masterdata.vessels.find((e) =>
                            e.vesselId === params.data.vesselId);
                        if (filteredVessel) {
                            this.setAmmendedStatus(params);
                            params.data.vesselValueChange = true;
                        }
                    },
                    cellClassRules: {
                        'ag-grid-disable-field': ((params) => !params.context.componentParent.isSummaryView
                            && !params.context.componentParent.privileges.vesselNamePrivilege
                            || params.data.isCancelled || params.data.isClosed),
                        'ag-grid-row-gray-background': ((params) => params.context.componentParent.isSummaryView
                            && params.data.vesselValueChange || params.data.isCancelled || params.data.isClosed),
                    },
                    tooltip: (params) => {
                        if (!params.context.componentParent.isSummaryView) {
                            if (!params.context.componentParent.privileges.vesselNamePrivilege) {
                                return params.data.vesselNameErrorMessage;
                            } else {
                                return null;
                            }
                        }
                    },
                },
                {
                    headerName: 'BL Date',
                    field: 'blDate',
                    colId: 'blDate',
                    hide: true,
                    editable: (params) => this.tradeEditService.isGridCellEditable(params, this.privileges, this.lockedContracts),
                    cellEditor: 'atlasDatePicker',
                    valueFormatter: this.uiService.dateFormatter,
                    cellClass: (params) => {
                        if (params.node.rowPinned) {
                            return 'pinnedRow';
                        }
                    },
                    cellEditorParams: {
                        maxDate: this.companyManager.getCurrentCompanyDate(),
                        isRequired: false,
                    },
                    cellClassRules: {
                        'ag-grid-invalid-mandatory-field': ((params) => params.data.blDateValidationStyleChange),
                        'ag-grid-disable-field': ((params) => !params.context.componentParent.isSummaryView && (!params.data.isEditable
                                || !params.context.componentParent.privileges.blDatePrivilege)
                            || params.data.isCancelled || params.data.isClosed),
                        'ag-grid-warning-field': ((params) => !params.context.componentParent.isSummaryView && params.data.blDateWarning),
                        'ag-grid-row-gray-background': ((params) => params.context.componentParent.isSummaryView
                            && params.data.blDateChange || params.data.isCancelled || params.data.isClosed),
                    },
                    onCellValueChanged: this.onblDateValueChanged.bind(this),
                    tooltip: (params) => {
                        if (!params.context.componentParent.isSummaryView) {
                            if (!params.context.componentParent.privileges.blDatePrivilege) {
                                return params.data.blDateErrorMessage;
                            } else if (params.data.isInvoiced && !params.context.componentParent.privileges.hasSuperTradePrivilege) {
                                return params.data.invoicingConditionErrorMessage;
                            } else {
                                return this.tradeEditService.blDateValidation(params);
                            }
                        }
                    },
                },
                {
                    headerName: 'BL Reference',
                    field: 'blReference',
                    colId: 'blReference',
                    hide: true,
                    editable: (params) => this.tradeEditService.isGridCellEditable(params, this.privileges, this.lockedContracts),
                    cellClass: (params) => {
                        if (params.node.rowPinned) {
                            return 'pinnedRow';
                        }
                    },
                    cellEditor: 'agLargeTextCellEditor',
                    cellEditorParams: {
                        maxLength: 255,
                        rows: 4,
                        cols: 12,
                    },
                    onCellValueChanged: (params) => {
                        this.setAmmendedStatus(params);
                        params.data.blReferenceChange = true;
                    },
                    cellClassRules: {
                        'ag-grid-disable-field': ((params) => !params.context.componentParent.isSummaryView
                            && !params.context.componentParent.privileges.blReferencePrivilege
                            || params.data.isCancelled || params.data.isClosed),
                        'ag-grid-row-gray-background': ((params) => params.context.componentParent.isSummaryView
                            && params.data.blReferenceChange || params.data.isCancelled || params.data.isClosed),
                    },
                    tooltip: (params) => {
                        if (!params.context.componentParent.isSummaryView) {
                            if (!params.context.componentParent.privileges.blReferencePrivilege) {
                                return params.data.blReferenceErrorMessage;
                            } else {
                                return null;
                            }
                        }
                    },
                },
                {
                    headerName: 'Discount/Premium',
                    field: 'premiumDiscountTypeId',
                    colId: 'premiumDiscountTypeId',
                    hide: true,
                    editable: (params) => (this.tradeEditService.isGridCellEditable(params, this.privileges, this.lockedContracts))
                    && (params.context.componentParent.privileges.hasSuperTradePrivilege || !params.data.isInvoiced),
                    cellEditor: 'agRichSelectCellEditor',
                    cellEditorParams: () => {
                        return {
                            values: this.premiumDiscountType.map((basis) => basis.discountPremium),
                            displayPropertyName: 'discountPremium',
                            valuePropertyName: 'discountPremium',
                            displayFormat: 'discountPremium',
                        };
                    },
                    cellClass: (params) => {
                        if (params.node.rowPinned) {
                            return 'pinnedRow';
                        }
                    },
                    cellClassRules: {
                        'ag-grid-disable-field': ((params) => params.context.componentParent.isSummaryView ||
                            (!params.context.componentParent.privileges.hasSuperTradePrivilege && params.data.isInvoiced)
                            || (params.data.isCancelled
                            || params.data.isClosed)),
                        'ag-grid-row-gray-background': ((params) => params.context.componentParent.isSummaryView
                            && params.data.discountPremiumTypeChange || params.data.isCancelled
                            || params.data.isClosed),
                    },
                    onCellValueChanged: (params) => {
                        if (params.newValue && params.oldValue !== params.newValue) {
                            if (params.data.premiumDiscountTypeId) {
                                this.isRequiredCell = (params.data.premiumDiscountTypeId) ? true : false;
                                this.setAmmendedStatus(params);
                                params.data.discountPremiumTypeChange = true;
                                this.contractValueCalculation(params);
                            }
                            if (this.gridApi && params.data.premiumDiscountTypeId) {
                                this.gridApi.refreshCells({
                                    rowNodes: [params.node],
                                    force: true,
                                });
                            }
                        }
                    },
                    tooltip: (params) => {
                        if (!params.context.componentParent.isSummaryView
                            && !params.context.componentParent.privileges.hasSuperTradePrivilege) {
                            if (params.data.isInvoiced) {
                                return params.data.invoicingConditionErrorMessage;
                            }
                        }
                    },
                },
                {
                    headerName: 'D/P Ccy',
                    field: 'premiumDiscountCurrency',
                    colId: 'premiumDiscountCurrency',
                    hide: true,
                    cellClass: (params) => {
                        if (params.node.rowPinned) {
                            return 'pinnedRow';
                        }
                    },
                    pinnedRowCellRendererFramework: AgGridAutocompleteComponent,
                    pinnedRowCellRendererParams: (params) => {
                        return {
                            context: {
                                componentParent: this,
                                gridEditable: (!params.context.componentParent.isSummaryView),
                            },
                            options: this.masterdata.currencies,
                            valueProperty: 'currencyCode',
                            codeProperty: 'currencyCode',
                            displayProperty: 'description',
                            displayCode: true,
                        };
                    },
                    cellClassRules: {
                        'ag-grid-disable-field': ((params) => params.context.componentParent.isSummaryView ||
                            (!params.context.componentParent.privileges.hasSuperTradePrivilege && params.data.isInvoiced)
                            || (params.data.isCancelled
                            || params.data.isClosed)),
                        'ag-grid-row-gray-background': ((params) => params.context.componentParent.isSummaryView
                            && params.data.discountPremiumBasisChange || params.data.isCancelled
                            || params.data.isClosed),
                    },
                    cellRendererFramework: AgGridAutocompleteComponent,
                    cellRendererParams: (params) => {
                        return {
                            context: {
                                componentParent: this,
                                gridEditable: (!params.context.componentParent.isSummaryView
                                    && params.data.premiumDiscountTypeId
                                    ),
                            },
                            options: this.masterdata.currencies,
                            valueProperty: 'currencyCode',
                            codeProperty: 'currencyCode',
                            displayProperty: 'description',
                            isRequired: () => {
                                return this.isRequiredCell ? true : false;
                            },
                            displayCode: true,
                        };
                    },
                    onCellValueChanged: (params) => {
                    },
                    tooltip: (params) => {
                        if (!params.context.componentParent.isSummaryView
                            && !params.context.componentParent.privileges.hasSuperTradePrivilege) {
                            if (params.data.isInvoiced) {
                                return params.data.invoicingConditionErrorMessage;
                            }
                        }
                    },
                },
                {
                    headerName: 'D/P Type',
                    field: 'premiumDiscountBasis',
                    colId: 'premiumDiscountBasis',
                    hide: true,
                    editable: (params) => (!params.context.componentParent.isSummaryView
                        && params.data.premiumDiscountTypeId
                        ),
                    cellEditor: 'agRichSelectCellEditor',
                    cellEditorParams: {
                        values: this.premiumDiscountBasis.map((basis) => basis.discountPremiumBasis),
                        displayPropertyName: 'discountPremiumBasis',
                        valuePropertyName: 'discountPremiumBasis',
                        displayFormat: 'discountPremiumBasis',
                        isRequired: this.isRequiredCell,
                    },
                    cellClass: (params) => {
                        if (params.node.rowPinned) {
                            return 'pinnedRow';
                        }
                    },
                    pinnedRowCellRenderer: 'agRichSelectCellEditor',
                    pinnedRowCellRendererParams: {
                        values: this.premiumDiscountBasis.map((basis) => basis.discountPremiumBasis),
                        displayPropertyName: 'discountPremiumBasis',
                        valuePropertyName: 'discountPremiumBasis',
                        displayFormat: 'discountPremiumBasis',
                    },
                    cellClassRules: {
                        'ag-grid-disable-field': ((params) => params.context.componentParent.isSummaryView ||
                            (!params.context.componentParent.privileges.hasSuperTradePrivilege && params.data.isInvoiced)
                            || (params.data.isCancelled
                            || params.data.isClosed)),
                        'ag-grid-row-gray-background': ((params) => params.context.componentParent.isSummaryView
                            && params.data.discountPremiumBasisChange || params.data.isCancelled
                            || params.data.isClosed),
                    },
                    onCellValueChanged: (params) => {
                        if (params.newValue && params.oldValue !== params.newValue) {
                            if (params.data.premiumDiscountBasis) {
                                this.setAmmendedStatus(params);
                                params.data.discountPremiumBasisChange = true;
                            }
                        }
                    },
                    tooltip: (params) => {
                        if (!params.context.componentParent.isSummaryView
                            && !params.context.componentParent.privileges.hasSuperTradePrivilege) {
                            if (params.data.isInvoiced) {
                                return params.data.invoicingConditionErrorMessage;
                            }
                        }
                    },
                },
                {
                    headerName: 'D/P Value',
                    field: 'premiumDiscountValue',
                    colId: 'premiumDiscountValue',
                    hide: true,
                    editable: (params) => (!params.context.componentParent.isSummaryView
                        && params.data.premiumDiscountBasis
                        ),
                    cellEditor: 'atlasNumeric',
                    cellEditorParams: {
                        displayMask: CustomNumberMask(12, 10, false),
                        isRightAligned: false,
                        isRequired: this.isRequiredCell,
                    },
                    cellClass: (params) => {
                        if (params.node.rowPinned) {
                            return 'pinnedRow';
                        }
                    },
                    pinnedRowCellRenderer: 'atlasNumeric',
                    pinnedRowCellRendererParams: {
                        displayMask: CustomNumberMask(12, 10, false),
                        isRightAligned: true,
                    },
                    onCellValueChanged: (params) => {
                        if (params.data.premiumDiscountValue !== params.value) {
                            this.isValueChanged = true;
                        }
                        this.setAmmendedStatus(params);
                        params.data.discountPremiumValueChange = true;
                    },
                    cellClassRules: {
                        'ag-grid-disable-field': ((params) => params.context.componentParent.isSummaryView ||
                            (!params.context.componentParent.privileges.hasSuperTradePrivilege && params.data.isInvoiced)
                            || (params.data.isCancelled
                            || params.data.isClosed)),
                        'ag-grid-row-gray-background': ((params) => params.context.componentParent.isSummaryView
                            && params.data.discountPremiumValueChange || params.data.isCancelled
                            || params.data.isClosed),
                    },
                    tooltip: (params) => {
                        if (!params.context.componentParent.isSummaryView
                            && !params.context.componentParent.privileges.hasSuperTradePrivilege) {
                            if (params.data.isInvoiced) {
                                return params.data.invoicingConditionErrorMessage;
                            }
                        }
                    },
                },
                {
                    headerName: 'Maturity Date',
                    field: 'maturityDate',
                    colId: 'maturityDate',
                    hide: true,
                    editable: (params) => this.tradeEditService.isGridCellEditable(params, this.privileges, this.lockedContracts),
                    cellEditor: 'atlasDatePicker',
                    valueFormatter: this.uiService.dateFormatter,
                    cellEditorParams: {
                        isRequired: false,
                    },
                    cellClass: (params) => {
                        if (params.node.rowPinned) {
                            return 'pinnedRow';
                        }
                    },
                    cellClassRules: {
                        'ag-grid-disable-field': ((params) => params.context.componentParent.isSummaryView
                            && params.data.maturityDate || params.data.isCancelled || params.data.isClosed),
                        'ag-grid-row-gray-background': ((params) => params.context.componentParent.isSummaryView
                            && params.data.maturityDate || params.data.isCancelled || params.data.isClosed),
                    },
                    onCellValueChanged: (params) => {
                        if (params.newValue && params.oldValue !== params.newValue) {
                            this.setAmmendedStatus(params);
                        }
                    },
                },
                {
                    headerName: 'Invoicing Status',
                    field: 'invoicingStatus',
                    colId: 'invoicingStatus',
                    hide: true,
                    cellClass: (params) => {
                        if (params.node.rowPinned) {
                            return 'pinnedRow';
                        }
                    },
                    pinnedRowCellRendererFramework: AgGridAutocompleteComponent,
                    pinnedRowCellRendererParams: (params) => {
                        return {
                            context: {
                                componentParent: this,
                                gridEditable: (!params.context.componentParent.isSummaryView
                                    && params.context.componentParent.privileges.invoicingStatusPrivilege),
                            },
                            options: this.masterdata.invoiceStatus,
                            valueProperty: 'code',
                            displayProperty: 'description',
                        };
                    },
                    cellRendererFramework: AgGridAutocompleteComponent,
                    cellRendererParams: (params) => {
                        return {
                            context: {
                                componentParent: this,
                                gridEditable: this.tradeEditService.isGridCellEditable(params, this.privileges, this.lockedContracts),
                            },
                            options: this.masterdata.invoiceStatus,
                            valueProperty: 'code',
                            displayProperty: 'description',
                        };
                    },
                    onCellValueChanged: (params) => {
                        const filteredInvoiceStatus = this.masterdata.invoiceStatus.find((e) =>
                            e.code === params.data.invoicingStatus);
                        if (filteredInvoiceStatus) {
                            this.setAmmendedStatus(params);
                        }
                    },
                    cellClassRules: {
                        'ag-grid-disable-field': ((params) => !params.context.componentParent.isSummaryView
                            && !params.context.componentParent.privileges.invoicingStatusPrivilege
                            || params.data.isCancelled || params.data.isClosed),
                        'ag-grid-row-gray-background': ((params) => params.context.componentParent.isSummaryView
                            && params.data.invoicingStatusPrivilege || params.data.isCancelled || params.data.isClosed),
                    },
                    tooltip: (params) => {
                        if (!params.context.componentParent.isSummaryView) {
                            if (!params.context.componentParent.privileges.invoicingStatusPrivilege) {
                                return params.data.invoiceStatusErrorMessage;
                            } else {
                                return null;
                            }
                        }
                    },
                },
                {
                    headerName: 'isLocked',
                    field: 'isLocked',
                    colId: 'isLocked',
                    hide: true,
                },
                {
                    headerName: 'lockMessage',
                    field: 'lockMessage',
                    colId: 'lockMessage',
                    hide: true,
                },
                {
                    headerName: 'Invoice Status',
                    field: 'invoicingStatusId',
                    colId: 'invoicingStatusId',
                    hide: true,
                    valueFormatter: this.invoiceStatus.bind(this),
                },
                {
                    headerName: 'allocatedInvoiceStatus',
                    field: 'allocatedInvoiceStatus',
                    colId: 'allocatedInvoiceStatus',
                    hide: true,
                },
                {
                    headerName: 'Contract Sent Date',
                    field: 'contractSentDate',
                    colId: 'contractSentDate',
                    hide: true,
                    editable: (params) => this.tradeEditService.isGridCellEditable(params, this.privileges, this.lockedContracts),
                    cellEditor: 'atlasDatePicker',
                    cellClass: (params) => {
                        if (params.node.rowPinned) {
                            return 'pinnedRow';
                        }
                    },
                    valueFormatter: this.uiService.dateFormatter,
                    cellEditorParams: {
                        mode: DateFormats.Date,
                    },
                    cellClassRules: {
                        'ag-grid-disable-field': ((params) => params.context.componentParent.isSummaryView
                            && params.data.contractSentDateChange || params.data.isCancelled || params.data.isClosed),
                        'ag-grid-row-gray-background': ((params) => params.context.componentParent.isSummaryView
                            && params.data.contractSentDateChange || params.data.isCancelled || params.data.isClosed),
                    },
                    onCellValueChanged: (params) => {
                        this.setAmmendedStatus(params);
                        params.data.contractSentDateChange = true;
                    },
                },
                {
                    headerName: 'Contract Returned Date',
                    field: 'contractReturnedDate',
                    colId: 'contractReturnedDate',
                    hide: true,
                    editable: (params) => this.tradeEditService.isGridCellEditable(params, this.privileges, this.lockedContracts),
                    cellEditor: 'atlasDatePicker',
                    cellClass: (params) => {
                        if (params.node.rowPinned) {
                            return 'pinnedRow';
                        }
                    },
                    valueFormatter: this.uiService.dateFormatter,
                    cellEditorParams: {
                        mode: DateFormats.Date,
                    },
                    cellClassRules: {
                        'ag-grid-disable-field': ((params) => params.context.componentParent.isSummaryView
                            && params.data.contractReturnedDateChange || params.data.isCancelled || params.data.isClosed),
                        'ag-grid-row-gray-background': ((params) => params.context.componentParent.isSummaryView
                            && params.data.contractReturnedDateChange || params.data.isCancelled || params.data.isClosed),
                    },
                    onCellValueChanged: (params) => {
                        this.setAmmendedStatus(params);
                        params.data.contractReturnedDateChange = true;
                    },
                },
                {
                    headerName: 'Email Received Date',
                    field: 'lastEmailReceivedDate',
                    colId: 'lastEmailReceivedDate',
                    hide: true,
                    editable: (params) => this.tradeEditService.isGridCellEditable(params, this.privileges, this.lockedContracts),
                    cellEditor: 'atlasDatePicker',
                    cellClass: (params) => {
                        if (params.node.rowPinned) {
                            return 'pinnedRow';
                        }
                    },
                    valueFormatter: this.uiService.dateFormatter,
                    cellEditorParams: {
                        mode: DateFormats.Date,
                    },
                    cellClassRules: {
                        'ag-grid-disable-field': ((params) => params.context.componentParent.isSummaryView
                            && params.data.lastEmailReceivedDateChange || params.data.isCancelled || params.data.isClosed),
                        'ag-grid-row-gray-background': ((params) => params.context.componentParent.isSummaryView
                            && params.data.lastEmailReceivedDateChange || params.data.isCancelled || params.data.isClosed),
                    },
                    onCellValueChanged: (params) => {
                        this.setAmmendedStatus(params);
                        params.data.lastEmailReceivedDateChange = true;
                    },
                },
            ];
        this.pinnedTopRowData = this.getPinnedTopData();
    }

    numberFormatter(params) {
        if (isNaN(params.value) || params.value === null) { return ''; }
        return new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(params.value);
    }

    onblDateValueChanged(params) {

        if (params.newValue && params.oldValue !== params.newValue) {
            this.setAmmendedStatus(params);
            params.data.blDateChange = true;
            this.rowValue = params.data.blDate;
            const selectedSection = params.data.allocatedSectionId;
            if (selectedSection) {
                const filteredRow = this.bulkEditGridRows.find((e) =>
                    e.sectionId === selectedSection,
                );
                if (filteredRow) {
                    this.gridApi.forEachNode((rowData) => {
                        if (rowData.data.sectionId === selectedSection && rowData.data.invoicingStatusId === InvoicingStatus.Uninvoiced) {
                            rowData.setDataValue('blDate', this.rowValue);
                        }
                    });
                } else {
                    this.subscriptions.push(this.lockService.isLockedContract(selectedSection).subscribe((lock: IsLocked) => {
                        if (lock.isLocked) {
                            const oldBlDateValue = this.bulkEditGridRows.find((e) =>
                                e.sectionId === params.data.sectionId,
                            );
                            params.node.setDataValue('blDate', oldBlDateValue.blDate);
                        } else {
                            if (params.data.allocatedInvoiceStatus === InvoicingStatus.Uninvoiced) {
                                params.data.isBlDateUpdatable = true;
                            }
                        }
                    }));
                }
            }
        }
    }

    setAmmendedStatus(params) {
        params.node.setDataValue('rowStatus', this.ammendedStatus);
    }

    getPinnedTopData() {
        if (!this.isSummaryView) {
            return [
                {
                    rowstatus: '',
                    contractLabel: 'Master Row',
                    status: '',
                    contractDate: '',
                    userId: '',
                    departmentId: '',
                    departmentDescription: '',
                    buyerCounterpartyId: '',
                    buyerDescription: '',
                    sellerCounterpartyId: '',
                    sellerDescription: '',
                    counterpartyReference: '',
                    commodity1: '',
                    commodity2: '',
                    commodity3: '',
                    commodity4: '',
                    commodity5: '',
                    cropYear: '',
                    weightCodeConversion: '',
                    contractTermId: '',
                    contractTermDescription: '',
                    portTerm: '',
                    arbitrationCode: '',
                    arbitrationDescription: '',
                    currencyCode: '',
                    currencyDescription: '',
                    priceUnitId: '',
                    priceCodeConversion: '',
                    price: '',
                    contractValue: '',
                    paymentTermsId: '',
                    periodTypeId: '',
                    deliveryPeriodStart: '',
                    deliveryPeriodEnd: '',
                    positionMonthType: '',
                    portOrigin: '',
                    portDestination: '',
                    businessSector: '',
                    businessSectorDescription: '',
                    memorandum: '',
                    contractIssuedDate: '',
                    otherReference: '',
                    vesselId: '',
                    blDate: '',
                    blReference: '',
                    premiumDiscountBasis: '',
                    premiumDiscountCurrency: '',
                    premiumDiscountTypeId: '',
                    premiumDiscountValue: '',
                    maturityDate: '',
                    sectionId: '',
                    invoicingStatus: '',
                    allocatedSectionId: '',
                    contractType: '',
                    contractSentDate: '',
                    contractReturnedDate: '',
                    lastEmailReceivedDate: '',
                },
            ];
        }
    }

    onCellValueChanged(params) {
        if (params.oldValue !== params.newValue) {
            params.node.data.isDirty = true;
            this.gridColumnApi.autoSizeAllColumns();
            if (params.colDef) {
                if (params.colDef.colId === 'premiumDiscountTypeId') {
                    if (params.data && params.data.premiumDiscountValue === 0) {
                        params.node.setDataValue('premiumDiscountValue', this.requiredString);
                    }
                    if (params.data && !params.data.premiumDiscountBasis) {
                        params.node.setDataValue('premiumDiscountBasis', this.requiredString);
                    }
                }
            }
        }
    }
    onCellClicked(params) {
        if (this.bulkEditGridOptions.onCellClicked) {
            if (params.colDef.colId === 'premiumDiscountValue' ||
                params.colDef.colId === 'premiumDiscountBasis') {
                if (params.oldValue === 'Required*') {
                    params.node.setDataValue('premiumDiscountCurrency', '');
                    params.node.setDataValue('premiumDiscountValue', '');
                    params.node.setDataValue('premiumDiscountBasis', '');
                }
            }

        }
    }

    onSaveButtonClicked() {
        this.isSave = true;
        this.gridApi.stopEditing();
        const errorMessage = this.validateGridData();
        this.blockingErrorMessage.emit(errorMessage);
    }

    validateGridData() {
        let isRowDirty: boolean;
        let isRowDataValid: boolean;
        let errorMessage: string = this.noErrorMessage;
        this.gridApi.forEachNode((rowData) => {
            isRowDirty = true;
            isRowDataValid = false;
            this.columnDefs.forEach((column) => {
                if (!isRowDataValid) {
                    isRowDataValid = this.validateEmpty(column.colId, rowData);
                }
            });
            if (isRowDataValid) {
                if (this.isNullEmptyOrRequiredString(rowData.data.contractDate) ||
                    this.isNullEmptyOrRequiredString(rowData.data.userId) ||
                    this.isNullEmptyOrRequiredString(rowData.data.departmentId) ||
                    this.isNullEmptyOrRequiredString(rowData.data.buyerCounterpartyId) ||
                    this.isNullEmptyOrRequiredString(rowData.data.sellerCounterpartyId) ||
                    this.isNullEmptyOrRequiredString(rowData.data.commodityId) ||
                    this.isNullEmptyOrRequiredString(rowData.data.contractTermId) ||
                    this.isNullEmptyOrRequiredString(rowData.data.portTermId) ||
                    this.isNullEmptyOrRequiredString(rowData.data.currencyCode) ||
                    this.isNullEmptyOrRequiredString(rowData.data.priceUnitId) ||
                    this.isNullEmptyOrRequiredString(rowData.data.paymentTermsId) ||
                    this.isNullEmptyOrRequiredString(rowData.data.periodTypeId) ||
                    this.isNullEmptyOrRequiredString(rowData.data.deliveryPeriodStart) ||
                    this.isNullEmptyOrRequiredString(rowData.data.deliveryPeriodEnd) ||
                    rowData.data.contractPrice === this.requiredString || rowData.data.contractPrice === '' ||
                    rowData.data.premiumDiscountCurrency === this.requiredString ||
                    rowData.data.premiumDiscountTypeId === this.requiredString ||
                    rowData.data.validationError === true ||
                    rowData.data.premiumDiscountValue === this.requiredString) {
                    if (!(this.isNullEmptyOrRequiredString(rowData.data.contractDate) &&
                        this.isNullEmptyOrRequiredString(rowData.data.userId) &&
                        this.isNullEmptyOrRequiredString(rowData.data.departmentId) &&
                        this.isNullEmptyOrRequiredString(rowData.data.buyerCounterpartyId) &&
                        this.isNullEmptyOrRequiredString(rowData.data.sellerCounterpartyId) &&
                        this.isNullEmptyOrRequiredString(rowData.data.commodityId) &&
                        this.isNullEmptyOrRequiredString(rowData.data.contractTermId) &&
                        this.isNullEmptyOrRequiredString(rowData.data.portTermId) &&
                        this.isNullEmptyOrRequiredString(rowData.data.currencyCode) &&
                        this.isNullEmptyOrRequiredString(rowData.data.priceUnitId) &&
                        this.isNullEmptyOrRequiredString(rowData.data.paymentTermsId) &&
                        this.isNullEmptyOrRequiredString(rowData.data.periodTypeId) &&
                        this.isNullEmptyOrRequiredString(rowData.data.deliveryPeriodStart) &&
                        this.isNullEmptyOrRequiredString(rowData.data.deliveryPeriodEnd) &&
                        rowData.data.contractPrice !== this.requiredString &&
                        rowData.data.validationError === false &&
                        rowData.data.premiumDiscountCurrency !== this.requiredString &&
                        rowData.data.premiumDiscountTypeId !== this.requiredString &&
                        rowData.data.premiumDiscountValue !== this.requiredString)) {
                        errorMessage = 'Grid data is invalid. Please resolve the errors.';
                    }
                }
            }
        });
        return isRowDirty === true ? errorMessage : '';
    }

    isNullEmptyOrRequiredString(value) {
        return value === null || value === '' || value === this.requiredString;
    }

    validateEmpty(colId: string, rowData: any) {
        if (rowData.data[colId] && rowData.data[colId] !== null
            && rowData.data[colId].toString().trim() !== '' && rowData.data[colId] !== 'Required*') {
            return true;
        } else {
            return false;
        }
    }

    getGridData() {
        const updatedSections = new Array<SectionToUpdate>();
        const updatedPhysicalContracts = new Array<PhysicalContractToUpdate>();
        const updatedPhysicalTradeList = new Array<ContractsForBulkFunctions>();
        let isRowDataValid: boolean;
        this.gridApi.forEachNode((rowdata: agGrid.RowNode) => {
            isRowDataValid = false;
            this.columnDefs.forEach((column: agGrid.ColDef) => {
                if (column.colId === 'cropYear') {
                    this.validateCropYearValue(rowdata);
                }
                if (column.colId === 'premiumDiscountBasis') {
                    this.validateDiscountPremiumType(rowdata);
                }
                if (column.colId === 'premiumDiscountTypeId') {
                    this.validateDiscountPremiumBasis(rowdata);
                }
                if (column.colId === 'periodTypeId') {
                    rowdata.data.periodTypeId = this.validatePeriodType(rowdata);
                }
                if (column.colId === 'invoicingStatus') {
                    rowdata.data.invoicingStatusId = Number(rowdata.data.invoicingStatus);
                }
                if (column.colId === 'bldate' || column.colId === 'deliveryPeriodStart' || column.colId === 'deliveryPeriodEnd' ||
                    column.colId === 'contractIssuedDate' || column.colId === 'contractSentDate' || column.colId === 'contractReturnedDate'
                    || column.colId === 'lastEmailReceivedDate') {
                    this.validateDateFunctions(rowdata);
                }
                if (!isRowDataValid) {
                    isRowDataValid = this.validateEmpty(column.colId, rowdata);
                }
            });
            updatedSections.push(rowdata.data);
            updatedPhysicalContracts.push(rowdata.data);
            updatedPhysicalTradeList.push(rowdata.data);
        });
        const updatedContracts: PhysicalTradeBulkEdit = new PhysicalTradeBulkEdit(this.company, updatedPhysicalContracts, updatedSections);
        this.updatedContractRows = updatedPhysicalTradeList;
        return updatedContracts;
    }

    validatePeriodType(rowData) {
        const pertiodType = this.masterdata.periodTypes.find((x) => x.periodTypeDescription ===
            rowData.data.periodTypeDescription);
        if (pertiodType) {
            rowData.data.periodTypeId = pertiodType.periodTypeId;
        }
        return rowData.data.periodTypeId;
    }

    validateDateFunctions(rowdata) {
        const local = this.dateLocale || moment.locale();
        const blDateValue = rowdata.data.blDate ? moment(rowdata.data.blDate, 'YYYY-MM-DD').toDate() : null;
        rowdata.data.blDate = (blDateValue) ? moment.utc(moment.parseZone(blDateValue).format('YYYY-MM-DD')).locale(local) : null;
        const periodFromValue = rowdata.data.deliveryPeriodStart ? moment(rowdata.data.deliveryPeriodStart, 'YYYY-MM-DD').toDate() : null;
        rowdata.data.deliveryPeriodStart = moment.utc(moment.parseZone(periodFromValue).format('YYYY-MM-DD')).locale(local);
        const periodToValue = rowdata.data.deliveryPeriodEnd ? moment(rowdata.data.deliveryPeriodEnd, 'YYYY-MM-DD').toDate() : null;
        rowdata.data.deliveryPeriodEnd = moment.utc(moment.parseZone(periodToValue).format('YYYY-MM-DD')).locale(local);
        const contractIssuedDate = rowdata.data.contractIssuedDate ? moment(rowdata.data.contractIssuedDate, 'YYYY-MM-DD').toDate() : null;
        rowdata.data.contractIssuedDate = moment.utc(moment.parseZone(contractIssuedDate).format('YYYY-MM-DD')).locale(local);
        const contractSentDate = rowdata.data.contractSentDate ? moment(rowdata.data.contractSentDate, 'YYYY-MM-DD').toDate() : null;
        rowdata.data.contractSentDate = moment.utc(moment.parseZone(contractSentDate).format('YYYY-MM-DD')).locale(local);
        const contractReturnedDate = rowdata.data.contractReturnedDate
            ? moment(rowdata.data.contractReturnedDate, 'YYYY-MM-DD').toDate() : null;
        rowdata.data.contractReturnedDate = moment.utc(moment.parseZone(contractReturnedDate).format('YYYY-MM-DD')).locale(local);
        const lastEmailReceivedDate = rowdata.data.lastEmailReceivedDate
            ? moment(rowdata.data.lastEmailReceivedDate, 'YYYY-MM-DD').toDate() : null;
        rowdata.data.lastEmailReceivedDate = moment.utc(moment.parseZone(lastEmailReceivedDate).format('YYYY-MM-DD')).locale(local);
    }

    updateAllRow(rowData) {
        this.bulkEditGridColumns.forEach((x) => {
            this.columnName = x.field;
            let columnValue;
            const columnDefs = this.colDefSelected.find((item) => item.columnName === this.columnName);
            columnValue = (columnDefs) ? columnDefs.columnName : null;

            if (rowData[this.columnName] && rowData[this.columnName] !== this.bulkEditField) {
                this.gridApi.forEachNode((rowNode) => {
                    let isContractLocked = false;
                    if (this.lockedContracts) {
                        const lockedContract = this.lockedContracts.find((id) => id === rowNode.data.sectionId);
                        // selected contract is locked  by the user. So make grideditable to false;
                        if (lockedContract) {
                            isContractLocked = true;
                        }
                    }

                    if (!rowNode.data.isCancelled && !rowNode.data.isClosed && !isContractLocked) {
                        if (this.columnName === 'deliveryPeriodStart' || this.columnName === 'deliveryPeriodEnd') {
                            if (rowNode.data.blDate === null) {
                                rowNode.setDataValue(this.columnName, rowData[this.columnName]);
                            }
                        } else if (this.columnName === 'buyerCounterpartyId' || this.columnName === 'buyerDescription') {
                            if (rowNode.data.invoicingStatusId === InvoiceStatus.NotInvoiced) {
                                if (rowNode.data.contractType === 'Sale') {
                                    rowNode.setDataValue(this.columnName, rowData[this.columnName]);
                                }
                            }
                        } else if (this.columnName === 'sellerCounterpartyId' || this.columnName === 'sellerDescription') {
                            if (rowNode.data.invoicingStatusId === InvoiceStatus.NotInvoiced) {
                                if (rowNode.data.contractType === 'Purchase') {
                                    rowNode.setDataValue(this.columnName, rowData[this.columnName]);
                                }
                            }
                        } else if (this.columnName === 'contractDate' || this.columnName === 'userId') {
                            if (rowNode.data.sectionOriginId === null) {
                                rowNode.setDataValue(this.columnName, rowData[this.columnName]);
                            }
                        } else if (this.columnName === 'departmentId' || this.columnName === 'departmentDescription') {
                            if (rowNode.data.invoicingStatusId === InvoiceStatus.NotInvoiced) {
                                if (rowNode.data.allocatedSectionId === null) {
                                    rowNode.setDataValue(this.columnName, rowData[this.columnName]);
                                }
                            }
                        } else if (this.columnName === 'blDate') {
                            if (rowNode.data.invoicingStatusId === InvoiceStatus.NotInvoiced) {
                                if (rowNode.data.contractType === 'Purchase') {
                                    rowNode.setDataValue(this.columnName, rowData[this.columnName]);
                                } else if (rowNode.data.contractType === 'Sale' && rowNode.data.allocatedSectionId !== null) {
                                    rowNode.setDataValue(this.columnName, rowData[this.columnName]);
                                }
                            }
                        } else if (this.columnName === columnValue) {
                            if (rowNode.data.invoicingStatusId === InvoiceStatus.NotInvoiced) {
                                rowNode.setDataValue(this.columnName, rowData[this.columnName]);
                            }
                        } else {
                            if (this.columnName !== 'rowStatus') {
                                rowNode.setDataValue(this.columnName, rowData[this.columnName]);
                            }
                        }
                    }
                });
            }
        });
    }

    validateCropYearValue(rowdata) {
        if (rowdata.data.cropYear) {
            const cropYearValues = getCropYearValue(rowdata.data.cropYear);
            rowdata.data.cropYearFrom = cropYearValues.from;
            rowdata.data.cropYearTo = cropYearValues.to;
        }
    }

    validateDiscountPremiumBasis(rowdata) {
        if (rowdata.data.premiumDiscountBasis) {
            const value = this.premiumDiscountBasis.find(
                (basis) => basis.discountPremiumBasis === rowdata.data.premiumDiscountBasis);
            rowdata.data.premiumDiscountBasis = value.discountPremiumBasisId;
        }
    }

    validateDiscountPremiumType(rowdata) {
        if (rowdata.data.premiumDiscountTypeId) {
            const value = this.premiumDiscountType.find(
                (basis) => basis.discountPremium === rowdata.data.premiumDiscountTypeId);
            rowdata.data.premiumDiscountTypeId = value.discountPremiumTypeId;
        }
    }

    premiumDiscountBasisFormatter(params) {
        if (params.premiumDiscountBasis) {
            const selectedType = this.premiumDiscountBasis.find((x) =>
                x.discountPremiumBasisId === params.premiumDiscountBasis);
            params.premiumDiscountBasis = (selectedType ? selectedType.discountPremiumBasis : '');
        }
        return params.premiumDiscountBasis;
    }

    premiumDiscountTypeFormatter(params) {
        if (params.premiumDiscountTypeId) {
            const selectedType = this.premiumDiscountType.find((x) =>
                x.discountPremiumTypeId === params.premiumDiscountTypeId);
            params.premiumDiscountTypeId = (selectedType ? selectedType.discountPremium : '');
        }
        return params.premiumDiscountTypeId;
    }

    onGridReady(params) {
        params.columnApi.autoSizeAllColumns();
        params.columnDefs = this.bulkEditGridColumns;
        this.columnDefs = params.columnDefs;
        this.bulkEditGridOptions = params;
        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;
        this.gridApi.showNoRowsOverlay();
    }

    onColumnVisibilityChanged(col) {
        this.userPreferencesComponent.onChangeColumnVisibility(col);
        this.autoSizeContractsGrid();
    }

    autoSizeContractsGrid() {
        if (this.gridColumnApi) {
            this.gridColumnApi.autoSizeAllColumns();
        }
    }

    departmentDescriptionFormatter(params) {
        if (params.data.departmentId) {
            const departmentDescription = params.context.componentParent.masterdata.departments.find((department) =>
                department.departmentId === params.data.departmentId);
            params.data.departmentDescription = (departmentDescription ? departmentDescription.description : '');
        }
        return params.data.departmentDescription;
    }

    commodityValueGetter(params) {
        if (params.data.commodityId) {
            const commodityValues = params.context.componentParent.masterdata.commodities.find((commodity) =>
                commodity.commodityId === params.data.commodityId);
            params.data.commodity2 = (commodityValues ? commodityValues.part2 : '');
            params.data.commodity3 = (commodityValues ? commodityValues.part3 : '');
            params.data.commodity4 = (commodityValues ? commodityValues.part4 : '');
            params.data.commodity5 = (commodityValues ? commodityValues.part5 : '');
        }
        return params.data.commodity2;
    }

    positionMonthTypeFormatter(params) {
        if (params.data.positionMonthType !== null && params.data.positionMonthType !== undefined) {
            if (params.data.monthPositionIndex !== null && params.data.monthPositionIndex !== undefined) {
                const monthType = PositionMonthTypes[params.data.positionMonthType];
                const positionMonthValue = params.context.componentParent.masterdata.positionMonthTypes.filter((position) =>
                    position.positionMonthTypeDescription.startsWith(monthType) &&
                    position.positionMonthTypeCode.month === params.data.monthPositionIndex);
                params.node.setDataValue('positionMonthValue', positionMonthValue[0].value);
            }
        }
    }

    businessSectorDescriptionFormatter(params) {
        if (params.data.businessSectorId) {
            const businessSectorDescription = params.context.componentParent.masterdata.businessSectors.find((businessSector) =>
                businessSector.sectorId === params.data.businessSectorId);
            params.data.businessSectorDescription = (businessSectorDescription ? businessSectorDescription.description : '');
        }
        return params.data.businessSectorDescription;
    }

    buyerDescriptionFormatter(params) {
        if (params.data.buyerCounterpartyId) {
            const selectedBuyerCode = params.context.componentParent.masterdata.counterparties.find((buyer) =>
                buyer.counterpartyID === params.data.buyerCounterpartyId);
            params.data.buyerDescription = (selectedBuyerCode ? selectedBuyerCode.description : '');
        }
        return params.data.buyerDescription;
    }

    sellerDescriptionFormatter(params) {
        if (params.data.sellerCounterpartyId) {
            const selectedSellerCode = params.context.componentParent.masterdata.counterparties.find((seller) =>
                seller.counterpartyID === params.data.sellerCounterpartyId);
            params.data.sellerDescription = (selectedSellerCode ? selectedSellerCode.description : '');
        }
        return params.data.sellerDescription;
    }

    contractTermDescriptionFormatter(params) {
        if (params.data.contractTermId) {
            const contractTerms = params.context.componentParent.masterdata.contractTerms.find((contractTerm) =>
                contractTerm.contractTermId === params.data.contractTermId);
            params.data.contractTermDescription = (contractTerms ? contractTerms.description : '');
        }
        return params.data.contractTermDescription;
    }

    arbitrationDescriptionFormatter(params) {
        if (params.data.arbitrationId) {
            const arbitration = params.context.componentParent.masterdata.arbitrations.find((description) =>
                description.arbitrationId === params.data.arbitrationId,
            );
            params.data.arbitrationDescription = (arbitration ? arbitration.description : '');
        }
        return params.data.arbitrationDescription;

    }

    currencyDescriptionFormatter(params) {
        if (params.data.currencyCode) {
            const currency = params.context.componentParent.masterdata.currencies.find((description) =>
                description.currencyCode === params.data.currencyCode,
            );
            params.data.currencyDescription = (currency ? currency.description : '');
        }
        return params.data.currencyDescription;
    }

    selectedContractsToEdit(isSummaryView: boolean, contracts: ContractsForBulkFunctions[], privileges: TradePropertyPrivilege) {
        this.isSummaryView = isSummaryView;
        contracts.forEach((contract) => this.periodTypeFormatter(contract));
        this.bulkEditGridRows = contracts;
        contracts.forEach((contract) => this.bindValueToControls(contract));
        this.privileges = privileges;
        this.initializeGridColumns();
    }

    periodTypeFormatter(rowData) {
        if (rowData.periodTypeId) {
            const periodTypeDescription = this.masterdata.periodTypes.find((x) => x.periodTypeId ===
                rowData.periodTypeId);
            if (periodTypeDescription) {
                rowData.periodTypeDescription = periodTypeDescription.periodTypeDescription;
            }
        }
        return rowData.periodTypeDescription;
    }

    bindValueToControls(contract) {
        this.maturtiyDateCalculation(contract);
        this.premiumDiscountBasisFormatter(contract);
        this.premiumDiscountTypeFormatter(contract);
        if (contract.invoicingStatusId) {
            contract.invoicingStatus = contract.invoicingStatusId.toString();
        }
        // update islocked property
        if (this.lockedContracts) {
            const lockedContract = this.lockedContracts.find((item) => item.enumEntityId === contract.sectionId);
            // selected contract is locked  by the user.
            if (lockedContract) {
                contract.islocked = true;
                contract.lockMessage = lockedContract.enumEntityValue;
            }
        }
    }

    onContractPriceChage() {
        return true;
    }
    contractValueCalculation(params: any) {
        let priceCodeConversion: number;
        let weightCodeConversion: number;
        const contractPrice = params.data.contractPrice ? params.data.contractPrice.toString().replace(/,/g, '') : null;
        const contractPriceDecimal: AtlasNumber = new AtlasNumber(contractPrice);
        const quantity = params.data.quantity ? params.data.quantity.toString().replace(/,/g, '') : null;
        const quantityDecimal: AtlasNumber = new AtlasNumber(quantity);
        // weight Code Conversion calculation

        const filteredWeight = this.masterdata.weightUnits;
        const selectedWeight = filteredWeight.find((e) =>
            e.weightUnitId === params.data.weightUnitId || e.weightCode === params.data.weightUnitCode);
        if (selectedWeight) {
            weightCodeConversion = selectedWeight.conversionFactor;
        }

        // Price Code Conversion calculation

        const filteredPrice = this.masterdata.priceUnits;
        const selectedPrice = filteredPrice.find((e) =>
            e.priceUnitId === params.data.priceUnitId || e.priceUnitId === params.data.priceCode);
        if (selectedPrice) {
            priceCodeConversion = selectedPrice.conversionFactor;
        }

        const calculatedContractValue = getContractValue
            // tslint:disable-next-line:max-line-length
            (params.data.premiumDiscountBasis, params.data.currencyCode, params.data.premiumDiscountBasis, params.data.premiumDiscountTypeId, weightCodeConversion, priceCodeConversion, contractPriceDecimal, quantityDecimal, params.data.premiumDiscountValue, false);
        if (calculatedContractValue) {
            params.node.setDataValue('contractValue', calculatedContractValue);
        }
    }

    maturtiyDateCalculation(contract: ContractsForBulkFunctions) {
        let creditAgainst: string;
        let creditDays: number;
        const companyDate = this.companyManager.getCurrentCompanyDate().toDate();
        const filteredcreditAgainst = this.masterdata.paymentTerms;

        const selectedcreditAgainst = filteredcreditAgainst.find((e) =>
            e.paymentTermsId === contract.paymentTermsId);
        if (selectedcreditAgainst) {
            creditAgainst = selectedcreditAgainst.creditAgainst;
        }
        const filteredcreditDays = this.masterdata.paymentTerms;

        const selectedcreditDays = filteredcreditDays.find((e) =>
            e.paymentTermsId === contract.paymentTermsId);
        if (selectedcreditDays) {
            creditDays = selectedcreditAgainst.creditDays;
        }
        const deliveryPeriodStart = new Date(contract.deliveryPeriodStart);
        const deliveryPeriodEnd = new Date(contract.deliveryPeriodEnd);
        const calculatedMaturityDate =
            getMaturityDate(creditAgainst, creditDays, companyDate, contract.blDate, deliveryPeriodStart, deliveryPeriodEnd);
        if (calculatedMaturityDate) {
            contract.maturityDate = calculatedMaturityDate;
        }
    }

    // this will be removed and values will be fetched from DB once the configuration in step3 is completed
    populateListofFields() {
        this.colDefSelected.push({
            id: 1,
            columnName: 'departmentId',

        });
        this.colDefSelected.push({
            id: 2,
            columnName: 'departmentDescription',

        });
        this.colDefSelected.push({
            id: 3,
            columnName: 'buyerCounterpartyId',

        });
        this.colDefSelected.push({
            id: 4,
            columnName: 'buyerDescription',

        });
        this.colDefSelected.push({
            id: 5,
            columnName: 'sellerCounterpartyId',

        });
        this.colDefSelected.push({
            id: 6,
            columnName: 'sellerDescription',

        });
        this.colDefSelected.push({
            id: 7,
            columnName: 'commodityId',

        });
        this.colDefSelected.push({
            id: 8,
            columnName: 'commodity1',

        });
        this.colDefSelected.push({
            id: 9,
            columnName: 'commodity2',

        });
        this.colDefSelected.push({
            id: 10,
            columnName: 'commodity3',

        });
        this.colDefSelected.push({
            id: 11,
            columnName: 'commodity4',

        });
        this.colDefSelected.push({
            id: 12,
            columnName: 'commodity5',

        });
        this.colDefSelected.push({
            id: 16,
            columnName: 'contractTermId',

        });
        this.colDefSelected.push({
            id: 17,
            columnName: 'contractTermDescription',

        });
        this.colDefSelected.push({
            id: 18,
            columnName: 'portTermId',

        });
        this.colDefSelected.push({
            id: 20,
            columnName: 'currencyCode',

        });
        this.colDefSelected.push({
            id: 21,
            columnName: 'currencyDescription',

        });
        this.colDefSelected.push({
            id: 22,
            columnName: 'priceUnitId',

        });
        this.colDefSelected.push({
            id: 23,
            columnName: 'contractValue',

        });
        this.colDefSelected.push({
            id: 24,
            columnName: 'contractPrice',

        });
        this.colDefSelected.push({
            id: 25,
            columnName: 'premiumDiscountCurrency',

        });
        this.colDefSelected.push({
            id: 26,
            columnName: 'premiumDiscountTypeId',

        });
        this.colDefSelected.push({
            id: 27,
            columnName: 'premiumDiscountValue',

        });
        this.colDefSelected.push({
            id: 28,
            columnName: 'businessSectorId',

        });
        this.colDefSelected.push({
            id: 29,
            columnName: 'businessSectorDescription',

        });
        this.colDefSelected.push({
            id: 30,
            columnName: 'blDate',
        });
    }

    isContractLockedRowStyle(node) {
        if (node.data.islocked) {
            return { background: 'rgba(199, 194, 196, 0.5)', color: '#928D8F' };
        }
    }

    getContractTooltipMessage(params): string {
        if (params.data.islocked) {
            return params.data.lockMessage;
        }
    }
    invoiceStatus(params) {
        if (params.data.invoicingStatusId) {
            return InvoicingStatus[params.data.invoicingStatusId].toString();
        }
        return '';
    }
}
