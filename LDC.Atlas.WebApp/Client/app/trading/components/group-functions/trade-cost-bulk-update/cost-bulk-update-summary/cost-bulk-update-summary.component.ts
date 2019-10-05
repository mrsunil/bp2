import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as agGrid from 'ag-grid-community';
import { AuthorizationService } from '../../../../../core/services/authorization.service';
import { AgContextualMenuComponent } from '../../../../../shared/components/ag-contextual-menu/ag-contextual-menu.component';
import { AgGridCheckboxComponent } from '../../../../../shared/components/ag-grid-checkbox/ag-grid-checkbox.component';
import { AgGridUserPreferencesComponent } from '../../../../../shared/components/ag-grid-user-preferences/ag-grid-user-preferences.component';
import { AgGridAutocompleteComponent } from '../../../../../shared/components/ag-grid/autocomplete/ag-grid-autocomplete.component';
import { AgContextualMenuAction } from '../../../../../shared/entities/ag-contextual-menu-action.entity';
import { AtlasAgGridParam } from '../../../../../shared/entities/atlas-ag-grid-param.entity';
import { BulkCost } from '../../../../../shared/entities/bulk-edit-cost.entity';
import { CostDirection } from '../../../../../shared/entities/cost-direction.entity';
import { MasterData } from '../../../../../shared/entities/masterdata.entity';
import { RateType } from '../../../../../shared/entities/rate-type.entity';
import { CostDirections } from '../../../../../shared/enums/cost-direction.enum';
import { InvoiceTypes } from '../../../../../shared/enums/invoice-type.enum';
import { PermissionLevels } from '../../../../../shared/enums/permission-level.enum';
import { RateTypes } from '../../../../../shared/enums/rate-type.enum';
import { CustomNumberMask } from '../../../../../shared/numberMask';
import { AgGridService } from '../../../../../shared/services/ag-grid.service';
import { UserCompanyPrivilegeDto } from '../../../../../shared/services/authorization/dtos/user-company-privilege';
import { FormConfigurationProviderService } from '../../../../../shared/services/form-configuration-provider.service';
import { MasterdataService } from '../../../../../shared/services/http-services/masterdata.service';
import { TradingService } from '../../../../../shared/services/http-services/trading.service';

@Component({
    selector: 'atlas-cost-bulk-update-summary',
    templateUrl: './cost-bulk-update-summary.component.html',
    styleUrls: ['./cost-bulk-update-summary.component.scss'],
})
export class CostBulkUpdateSummaryComponent implements OnInit {
    gridContext = {
        gridEditable: true,
        componentParent: this,
        editPrivileges: true,
        deletePrivileges: true,
        inPNLPrivileges: true,
    };

    costsSummaryMenuActions: { [key: string]: string } = {
        invoiceCost: 'invoice',
    };

    gridComponents = {
        atlasCheckbox: AgGridCheckboxComponent,
    };

    invoicePrivilege: UserCompanyPrivilegeDto = {
        profileId: null,
        privilegeName: 'Invoice',
        permission: PermissionLevels.ReadWrite,
        privilegeParentLevelOne: 'Invoices',
        privilegeParentLevelTwo: 'InvoiceCreation',
    };

    @ViewChild('userPreferences') userPreferencesComponent: AgGridUserPreferencesComponent;
    costContractSummaryGridOptions: agGrid.GridOptions = {};
    componentId: string = 'UpdateBulkCostsSummaryGrid';
    atlasAgGridParam: AtlasAgGridParam;
    costContractSummaryGridColumns: agGrid.ColDef[];
    gridApi: agGrid.GridApi;
    gridColumnApi: agGrid.ColumnApi;
    isLoading: boolean;
    company: string;
    masterdata: MasterData;
    rateTypes: RateType[];
    costDirections: CostDirection[];
    costSummaryGridContextualMenuActions: AgContextualMenuAction[];
    hasGridSharing: boolean = false;
    costContractSummaryGridRows: BulkCost[];
    existingCostsToInvoice: BulkCost[];

    constructor(protected masterDataService: MasterdataService,
        private route: ActivatedRoute,
        protected formBuilder: FormBuilder,
        protected formConfigurationProvider: FormConfigurationProviderService,
        protected tradingService: TradingService,
        protected router: Router,
        public gridService: AgGridService,
        private authorizationService: AuthorizationService) {
    }

    ngOnInit() {
        this.masterdata = this.route.snapshot.data.masterdata;
        this.atlasAgGridParam = this.gridService.getAgGridParam();
        this.company = this.route.snapshot.paramMap.get('company');
        this.gridContext.gridEditable = this.checkIfUserHasRequiredPrivileges(this.invoicePrivilege);
        this.init();
        this.rateTypes = [
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
        ];

        this.costDirections = [
            {
                costDirectionId: CostDirections.Payable,
                costDirection: 'Pay',
            },
            {
                costDirectionId: CostDirections.Receivable,
                costDirection: 'Receive',
            },
        ];

        this.initializeGridColumns();
    }

    init() {
        this.costSummaryGridContextualMenuActions = [
            {
                icon: '',
                text: 'Invoice',
                action: this.costsSummaryMenuActions.invoiceCost,

            },
        ];
    }

    onGridReady(params) {
        this.gridApi = params.api;
        params.columnDefs = this.costContractSummaryGridColumns;
        this.costContractSummaryGridOptions = params;
        this.gridColumnApi = params.columnApi;

        this.gridColumnApi.autoSizeAllColumns();

        window.onresize = () => {
            this.gridColumnApi.autoSizeAllColumns();
        };

        this.gridApi.showNoRowsOverlay();
        this.autoSizeContractsGrid();
    }

    autoSizeContractsGrid() {
        if (this.gridColumnApi !== undefined) {
            const allColumnIds = [];
            if (this.costContractSummaryGridColumns) {
                this.costContractSummaryGridColumns.forEach((columnDefs) => {
                    allColumnIds.push(columnDefs.field);
                });
            }
            this.gridColumnApi.autoSizeColumns(allColumnIds);
        }
    }

    initializeGridColumns() {
        this.costContractSummaryGridOptions = {
            context: this.gridContext,
            getRowStyle: this.isCostInvoicedRowStyle.bind(this),
            isRowSelectable: this.isCostInvoiced.bind(this),
        };
        this.costContractSummaryGridColumns = [
            {
                width: 50,
                minWidth: 50,
                maxWidth: 50,
                headerCheckboxSelection: true,
                checkboxSelection: true,
                pinned: 'left',
            },
            {
                headerName: 'Status',
                colId: 'rowStatus',
                field: 'rowStatus',
                width: 100,
                minWidth: 100,
                maxWidth: 100,
                cellRenderer: (params) => {
                    if (params.value) {
                        return '<mat-chip-list><mat-chip class="status-flag-chip">' + params.value + '</mat-chip></mat-chip-list>';
                    }
                    return '';
                },
                pinned: 'left',
            },
            {
                headerName: 'contract Reference',
                field: 'contractReference',
                colId: 'contractReference',
                hide: false,
                editable: false,
            },
            {
                headerName: 'Cost type*',
                field: 'costTypeCode',
                colId: 'costTypeCode',
                cellRendererFramework: AgGridAutocompleteComponent,
                cellRendererParams: () => {
                    return {
                        options: this.masterdata.costTypes.filter((cost) => cost.isATradeCost === true)
                            .sort((a, b) => a.costTypeCode.localeCompare(b.costTypeCode)),
                        valueProperty: 'costTypeCode',
                        codeProperty: 'costTypeCode',
                        displayProperty: 'costTypeCode',
                    };
                },
            },
            {
                headerName: 'Description',
                field: 'description',
                colId: 'description',
            },
            {
                headerName: 'Matrix Name',
                field: 'costMatrixName',
                colId: 'costMatrixName',
                hide: false,
            },
            {
                headerName: 'Supplier',
                field: 'supplierCode',
                cellRendererParams: () => {
                    return {
                        gridId: 'counterpartiesGrid',
                        options: this.masterdata.counterparties,
                        isRequired: false,
                        displayProperty: 'counterpartyCode',
                        valueProperty: 'counterpartyCode',
                        lightBoxTitle: 'Results for Counterparty',
                    };
                },
            },
            {
                headerName: 'CCY',
                field: 'currencyCode',
                colId: 'currencyCode',
                cellRendererFramework: AgGridAutocompleteComponent,
                cellRendererParams: () => {
                    return {
                        options: this.masterdata.currencies,
                        valueProperty: 'currencyCode',
                        codeProperty: 'currencyCode',
                        displayProperty: 'description',
                        isRequired: true,

                    };
                },
                width: 120,
            },
            {
                headerName: 'Rate Type*',
                field: 'rateTypeCode',
                cellEditorParams: {
                    values: this.rateTypes.map((rateType) => rateType.code),
                    valuePropertyName: 'code',
                    displayFormat: 'code',
                    context: this.masterdata,
                },
                width: 120,
            },
            {
                headerName: 'Price Code',
                field: 'priceCode',
                colId: 'priceCode',
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
                headerName: 'Pay/Rec*',
                field: 'costDirection',
                cellEditorParams: {
                    values: this.costDirections.map((costDirection) => costDirection.costDirection),
                    displayPropertyName: 'costDirection',
                    valuePropertyName: 'costDirection',
                    displayFormat: 'costDirection',
                },

            },
            {
                headerName: 'Rate/Amount',
                field: 'rate',
                type: 'numberColumn',
                cellEditorParams: {
                    displayMask: CustomNumberMask(12, 10, false),
                    isRightAligned: false,
                },
            },
            {
                headerName: 'in P&L',
                field: 'inPL',
                colId: 'inPL',
                cellRenderer: 'atlasCheckbox',
                cellRendererParams: {
                    disabled: true,
                    params: this.gridContext,
                },

            },
            {
                headerName: 'No Act',
                field: 'noAction',
                colId: 'noAction',
                cellRenderer: 'atlasCheckbox',
                cellRendererParams: {
                    disabled: true,
                    params: this.gridContext,
                },

            },
            {
                headerName: '%Invoiced',
                field: 'invoicePercent',
                width: 120,
                type: 'numericColumn',
            },
            {
                pinned: 'right',
                cellRendererFramework: AgContextualMenuComponent,
                cellRendererParams: (params) => {
                    return {
                        context: {
                            componentParent: this,
                            actionContext: this.gridContext,
                        },
                        isDisabled: this.isInvoiceDisabled.bind(this),
                        menuActions: this.costSummaryGridContextualMenuActions,
                    };
                },
                cellClass: 'ag-contextual-menu',
                width: 40,
            },
        ];
    }

    getRateCodeFromId(id: number) {
        const rateCode = RateTypes[id];
        return rateCode;
    }

    getPriceCodeFromId(id: number) {
        const priceCode = this.masterdata.priceUnits.find(
            (e) => e.priceUnitId === id);
        return priceCode ? priceCode.priceCode : '';
    }

    getCostDirectionCodeFromId(id, costDirections: CostDirection[]) {
        const costDirection = costDirections.find(
            (e) => e.costDirectionId === id);
        return costDirection ? costDirection.costDirection : '';
    }

    getCostTypeDescriptionFromCode(code: string, masterdata: MasterData): string {
        const descrption = masterdata.costTypes.find(
            (e) => e.costTypeCode === code);
        return descrption ? descrption.name : null;
    }

    setCosts(costs: BulkCost[]) {
        if (costs) {
            costs.forEach((cost) => {
                cost.rateTypeCode = this.getRateCodeFromId(cost.rateTypeId);
                cost.costDirection = this.getCostDirectionCodeFromId(cost.costDirectionId, this.costDirections);
                cost.priceCode = this.getPriceCodeFromId(cost.priceUnitId);
                cost.description = this.getCostTypeDescriptionFromCode(cost.costTypeCode, this.masterdata);
            });
            this.costContractSummaryGridRows = costs;
        }
    }

    handleAction(action: string, cost: BulkCost) {
        switch (action) {
            case this.costsSummaryMenuActions.invoiceCost:
                if (cost.costId) {
                    this.router.navigate(
                        ['/' + this.company +
                            '/execution/invoicing/' + encodeURIComponent(InvoiceTypes.Cost.toString())],
                        {
                            queryParams: { costIds: cost.costId },

                        });

                }

                break;
            default: throw new Error('Unknown action');
        }
    }

    invoiceSelectedCosts() {
        const costs: BulkCost[] = this.gridApi.getSelectedRows();
        if (costs) {
            const selectedCostIds: number[] = [];
            costs.forEach((cost) => {
                selectedCostIds.push(cost.costId);
            });
            this.router.navigate(
                ['/' + this.company +
                    '/execution/invoicing/' + encodeURIComponent(InvoiceTypes.Cost.toString())],
                {
                    queryParams: { costIds: selectedCostIds },
                });
        }
    }

    isCostInvoicedRowStyle(node) {
        if (node.data.invoicePercent === 100 || !node.data.isApproved) {
            return { background: 'rgba(199, 194, 196, 0.5)', color: '#928D8F' };
        }
    }

    isCostInvoiced(node) {
        return (node.data.invoicePercent === 100 || !node.data.isApproved) ? false : true;
    }

    checkIfUserHasRequiredPrivileges(userCompanyPrivilege: UserCompanyPrivilegeDto) {
        if (this.authorizationService.isUserAllowedForCompany(this.company)) {
            const userPermissionLevel = this.authorizationService.getPermissionLevel(
                this.company,
                userCompanyPrivilege.privilegeName,
                userCompanyPrivilege.privilegeParentLevelOne,
                userCompanyPrivilege.privilegeParentLevelTwo);
            if (userPermissionLevel >= userCompanyPrivilege.permission) {
                return true;
            }
        }
        return false;
    }

    isInvoiceDisabled(node) {
        return (node.data.invoicePercent === 100 || !node.data.isApproved) ? true : false;
    }

}
