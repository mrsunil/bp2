import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import * as agGrid from 'ag-grid-community';
import { AgGridCheckboxComponent } from '../../../../../../../shared/components/ag-grid-checkbox/ag-grid-checkbox.component';
import { BaseFormComponent } from '../../../../../../../shared/components/base-form-component/base-form-component.component';
import { AtlasAgGridParam } from '../../../../../../../shared/entities/atlas-ag-grid-param.entity';
import { BulkCost } from '../../../../../../../shared/entities/bulk-edit-cost.entity';
import { ChildSectionsCostsToAdjust } from '../../../../../../../shared/entities/child-sections-costs-to-adjust.entity';
import { CostDirection } from '../../../../../../../shared/entities/cost-direction.entity';
import { MasterData } from '../../../../../../../shared/entities/masterdata.entity';
import { ParentCostsToAdjust } from '../../../../../../../shared/entities/parent-costs-to-adjust.entity';
import { RateType } from '../../../../../../../shared/entities/rate-type.entity';
import { AddOrOverride } from '../../../../../../../shared/enums/add-override.enum';
import { CostDirections } from '../../../../../../../shared/enums/cost-direction.enum';
import { InvoicingStatus } from '../../../../../../../shared/enums/invoicing-status.enum';
import { RateTypes } from '../../../../../../../shared/enums/rate-type.enum';
import { AgGridService } from '../../../../../../../shared/services/ag-grid.service';
import { FormConfigurationProviderService } from '../../../../../../../shared/services/form-configuration-provider.service';
import { TradingService } from '../../../../../../../shared/services/http-services/trading.service';
import { SnackbarService } from '../../../../../../../shared/services/snackbar.service';
import { OverrideCostsDialogComponent } from '../override-costs-dialog/override-costs-dialog.component';

@Component({
    selector: 'atlas-children-costs',
    templateUrl: './children-costs.component.html',
    styleUrls: ['./children-costs.component.scss'],
})
export class ChildrenCostsComponent extends BaseFormComponent implements OnInit {

    constructor(protected formConfigurationProvider: FormConfigurationProviderService,
        protected formBuilder: FormBuilder,
        private route: ActivatedRoute,
        protected tradingService: TradingService,
        public gridService: AgGridService, protected snackbarService: SnackbarService,
        protected dialog: MatDialog, private router: Router) {
        super(formConfigurationProvider);
    }

    gridContext = {
        gridEditable: true,
        componentParent: this,
        editPrivileges: true,
    };

    gridComponents = {
        atlasCheckbox: AgGridCheckboxComponent,
    };

    transferCostChildrenGridOptions: agGrid.GridOptions = {};
    atlasAgGridParam: AtlasAgGridParam;
    transferCostChildrenGridColumns: agGrid.ColDef[];
    gridApi: agGrid.GridApi;
    gridColumnApi: agGrid.ColumnApi;
    isLoading: boolean;
    componentId: string = 'ChildrenCostsGrid';
    hasGridSharing: boolean = false;
    masterdata: MasterData;
    company: string;
    costTypesLengthOfParentCosts: number;
    sectionId: number;
    dataVersionId: number;
    childrenCostTypeList: string[] = [];
    childrenCosts: string[] = [];
    childCostsGridRows: ChildSectionsCostsToAdjust[];
    costDynamicColumns: string[] = [];
    parentCosts: ParentCostsToAdjust[] = [];
    rateTypes: RateType[];
    costDirections: CostDirection[];
    selectedChildCosts: ChildSectionsCostsToAdjust[] = [];
    childCostsToOverride: ChildSectionsCostsToAdjust[] = [];
    parentCostsForOverrirde: ParentCostsToAdjust[] = [];
    childSectiodIdsForNewCosts: number[] = [];
    childrenCostWithoutDuplicate: ChildSectionsCostsToAdjust[] = [];
    totalQuantity: number = 0;
    allChildCosts: ChildSectionsCostsToAdjust[] = [];

    ngOnInit() {
        this.company = this.route.snapshot.paramMap.get('company');
        this.masterdata = this.route.snapshot.data.masterdata;
        this.sectionId = this.route.snapshot.params.sectionId;
        this.dataVersionId = this.route.snapshot.params['dataVersionId'] ? Number(this.route.snapshot.params['dataVersionId']) : null;
        this.atlasAgGridParam = this.gridService.getAgGridParam();

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

    }

    onGridReady(params) {
        this.gridApi = params.api;
        params.columnDefs = this.transferCostChildrenGridColumns;
        this.transferCostChildrenGridOptions = params;
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
            if (this.transferCostChildrenGridColumns) {
                this.transferCostChildrenGridColumns.forEach((columnDefs) => {
                    allColumnIds.push(columnDefs.field);
                });
            }
            this.gridColumnApi.autoSizeColumns(allColumnIds);
        }
    }

    setCostsAsColumnsToChildGrid(costTypes: string[]) {
        this.costTypesLengthOfParentCosts = costTypes.length;

        const getChildCostsSubscription =
            this.tradingService.getChildSectionsCostsToAdjust(this.sectionId, this.dataVersionId).subscribe((data) => {
                if (data.value) {
                    this.allChildCosts = data.value;
                    data.value.forEach((cost) => {
                        const existItem = this.childrenCostWithoutDuplicate.find((x) =>
                            ((x.costTypeCode === cost.costTypeCode) && x.sectionId === cost.sectionId));
                        if (!existItem) {
                            this.childrenCostWithoutDuplicate.push(cost);
                        }
                    });
                    this.childrenCosts = Array.from(new Set(this.childrenCostWithoutDuplicate.map((cost) => cost.costTypeCode)));

                    if (this.costTypesLengthOfParentCosts > 0) {
                        this.initializeGridColumnsForCostTypes(costTypes);
                    }
                    this.getGridData(costTypes);
                }
            });
        this.subscriptions.push(getChildCostsSubscription);
    }

    getGridData(costTypeCodes) {
        const costs: any[] = [];
        costTypeCodes.forEach((costType) => {
            this.childrenCostWithoutDuplicate.forEach((rowData) => {
                if (rowData.costTypeCode === costType) {
                    rowData[costType] = true;
                    rowData.costIds = [];
                    const existingRefNo = costs.findIndex((x) => x.contractReference === rowData.contractReference);
                    if (existingRefNo !== -1) {
                        costs[existingRefNo][costType] = true;
                        costs[existingRefNo].costIds.push(rowData.costId);
                    } else {
                        rowData.costIds.push(rowData.costId);
                        costs.push(rowData);
                    }
                } else if (rowData.costTypeCode === null) {
                    const existRefNo = costs.find((cost) => cost.contractReference === rowData.contractReference);
                    if (!existRefNo) {
                        costs.push(rowData);
                    }
                } else {
                    rowData[costType] = false;
                }
            });
        });
        this.childCostsGridRows = costs;
    }

    initializeGridColumnsForCostTypes(costTypes) {

        this.transferCostChildrenGridOptions = {
            context: this.gridContext,
        };
        this.transferCostChildrenGridColumns = [
            {
                headerCheckboxSelection: true,
                checkboxSelection: true,
            },
            {
                headerName: 'contract Reference',
                field: 'contractReference',
                colId: 'contractReference',
                hide: false,
                editable: false,
                width: 150,
            },
            {
                headerName: 'Quantity',
                colId: 'quantity',
                field: 'quantity',
                type: 'numericColumn',
                width: 120,
            },
            {
                headerName: 'Quantity Code',
                colId: 'quantityCode',
                field: 'quantityCode',
                width: 120,
            },
        ];

        costTypes.forEach((costType) => {
            const mappedColumn = {
                headerName: costType,
                colId: costType,
                field: costType,
                cellRenderer: 'atlasCheckbox',
                cellRendererParams: (params) => {
                    return {
                        disabled: true,
                        params: this.gridContext,
                    };
                },
            };
            this.transferCostChildrenGridColumns.push(mappedColumn);
        });

        if (this.transferCostChildrenGridOptions) {
            this.transferCostChildrenGridOptions.columnDefs = this.transferCostChildrenGridColumns;
            if (this.transferCostChildrenGridOptions.api) {
                this.transferCostChildrenGridOptions.api.setColumnDefs(this.transferCostChildrenGridColumns);
            }
        }
    }

    getFormGroup() {
        return super.getFormGroup();
    }

    addUpateCosts() {
        const selectedCosts: BulkCost[] = [];
        let childSectionIds: number[] = [];
        this.totalQuantity = 0;
        const costTypeCodesToOverride = [];
        const selectedRows = this.gridApi.getSelectedRows();
        this.selectedChildCosts = [];
        if (selectedRows && selectedRows.length > 0) {
            selectedRows.forEach((childCost) => {
                const costIds: number[] = childCost.costIds;
                if (costIds && costIds.length > 0) {
                    costIds.forEach((costId) => {
                        this.selectedChildCosts.push(this.allChildCosts.find((cost) => cost.costId === costId));
                    });
                }
            });

            childSectionIds = this.selectedChildCosts && this.selectedChildCosts.length > 0 ?
                Array.from(new Set(this.selectedChildCosts.map((cost) => cost.sectionId))) :
                selectedRows.map((cost) => cost.sectionId);

            // calculating the total quantity of all the splits/tranches for a section
            if (childSectionIds && childSectionIds.length > 0) {
                childSectionIds.forEach((sectionId) => {
                    this.totalQuantity += this.getQuantityBySectionId(sectionId);
                });
            }
            if (this.selectedChildCosts && this.selectedChildCosts.length > 0 && this.parentCosts && this.parentCosts.length > 0) {
                this.selectedChildCosts.forEach((childCost) => {
                    this.parentCosts.forEach((parentCost) => {
                        if (childCost.costTypeCode === parentCost.costTypeCode &&
                            childCost.costDirectionId === parentCost.costDirectionId) {
                            costTypeCodesToOverride.push(childCost.costTypeCode);
                            this.childCostsToOverride.push(childCost);
                            this.parentCostsForOverrirde.push(parentCost);
                        }
                    });
                });
                if (this.childCostsToOverride && this.childCostsToOverride.length > 0 &&
                    costTypeCodesToOverride && costTypeCodesToOverride.length > 0) {
                    const overrideDialog = this.dialog.open(OverrideCostsDialogComponent, {
                        width: '40%',
                        height: '40%',
                        data: {
                            confirmationMessage: 'Costs ' + costTypeCodesToOverride.toString() +
                                ' already exists. What do you want to do?',

                        },
                    });
                    overrideDialog.afterClosed().subscribe((result) => {
                        if (result === AddOrOverride.Add) {
                            this.getDataForNewCosts(childSectionIds, selectedCosts);
                        } else if (result === AddOrOverride.Override) {
                            this.getDataForOverrideCosts(selectedCosts);
                            if (this.childSectiodIdsForNewCosts && this.childSectiodIdsForNewCosts.length > 0) {
                                // Removing duplicates section ids
                                this.childSectiodIdsForNewCosts = Array.from(new Set(this.childSectiodIdsForNewCosts));
                                this.getDataForNewCosts(this.childSectiodIdsForNewCosts, selectedCosts);
                            }
                            this.getDataForParentCostsProrated(selectedCosts, this.parentCostsForOverrirde);
                        } else {
                            return;
                        }
                        this.saveCosts(selectedCosts);
                    });

                } else {
                    this.getDataForNewCosts(childSectionIds, selectedCosts);
                    this.getDataForParentCostsProrated(selectedCosts, this.parentCosts);
                    this.saveCosts(selectedCosts);
                }
            } else {
                this.getDataForNewCosts(childSectionIds, selectedCosts);
                this.getDataForParentCostsProrated(selectedCosts, this.parentCosts);
                this.saveCosts(selectedCosts);
            }

        } else {
            this.snackbarService.informationSnackBar('Please select a split/tranch to transfer costs.');
        }

    }

    getDataForOverrideCosts(selectedCosts: BulkCost[]) {
        this.childCostsToOverride.forEach((childCost) => {
            this.parentCostsForOverrirde.forEach((parentCost) => {
                if (childCost.invoicePercent > 0) {
                    this.childSectiodIdsForNewCosts.push(childCost.sectionId);
                } else {
                    if (childCost.costTypeCode === parentCost.costTypeCode &&
                        childCost.costDirectionId === parentCost.costDirectionId) {
                        const costToSave = new BulkCost();
                        costToSave.sectionId = childCost.sectionId;
                        costToSave.rowStatus = 'A';
                        costToSave.costId = childCost.costId;
                        costToSave.costTypeCode = childCost.costTypeCode;
                        costToSave.description = this.getCostTypeDescriptionFromId(childCost.costTypeCode);
                        costToSave.supplierCode = parentCost.supplierCode;
                        costToSave.currencyCode = parentCost.currencyCode;
                        costToSave.rateTypeId = this.getRateTypeIdFromCode(parentCost.rateTypeCode);
                        costToSave.priceUnitId = parentCost.priceUnitId ? parentCost.priceUnitId : (parentCost.priceCode ?
                            this.masterdata.priceUnits.find((priceUnit) =>
                                priceUnit.priceCode === parentCost.priceCode).priceUnitId : null);
                        costToSave.rate = parentCost.isProRated ?
                            ((childCost.quantity * parentCost.rate) / (this.totalQuantity + parentCost.quantity)) :
                            parentCost.rate;
                        costToSave.invoicingStatusId = childCost.invoicingStatusId;
                        costToSave.costDirectionId = parentCost.costDirection ?
                            this.costDirections.find((costDirection) =>
                                costDirection.costDirection === parentCost.costDirection).costDirectionId : null;
                        if (costToSave.rowStatus) {
                            selectedCosts.push(costToSave);
                        }
                    }
                }
            });
        });
    }

    getDataForNewCosts(childSectionIds: number[], selectedCosts: BulkCost[]) {
        childSectionIds.forEach((sectionId) => {
            this.parentCosts.forEach((cost) => {
                const costToSave = new BulkCost();
                costToSave.sectionId = sectionId;
                costToSave.rowStatus = 'N';
                costToSave.costTypeCode = cost.costTypeCode;
                costToSave.description = this.getCostTypeDescriptionFromId(cost.costTypeCode);
                costToSave.supplierCode = cost.supplierCode;
                costToSave.currencyCode = cost.currencyCode;
                costToSave.rateTypeId = this.getRateTypeIdFromCode(cost.rateTypeCode);
                costToSave.priceUnitId = cost.priceUnitId ? cost.priceUnitId : (cost.priceCode ?
                    this.masterdata.priceUnits.find((priceUnit) => priceUnit.priceCode === cost.priceCode).priceUnitId : null);
                costToSave.rate = cost.isProRated ? this.calculateProratedRate(sectionId, cost.rate, cost.quantity) : cost.rate;
                costToSave.invoicingStatusId = InvoicingStatus.Uninvoiced;
                costToSave.costDirectionId = cost.costDirection ?
                    this.costDirections.find((costDirection) => costDirection.costDirection === cost.costDirection).costDirectionId : null;
                if (costToSave.rowStatus) {
                    selectedCosts.push(costToSave);
                }
            });
        });
    }

    setParentData(parentCosts: ParentCostsToAdjust[]) {
        if (parentCosts && parentCosts.length > 0) {
            this.parentCosts = parentCosts;
        }
    }

    getRateTypeIdFromCode(code: string) {
        const rateTypeId = RateTypes[code];
        return rateTypeId;
    }

    getCostTypeDescriptionFromId(code: string): string {
        const descrption = this.masterdata.costTypes.find(
            (e) => e.costTypeCode === code);
        return descrption ? descrption.name : null;
    }

    saveCosts(costs: BulkCost[]) {
        const costTadIndex: string = '1';
        this.subscriptions.push(this.tradingService
            .saveBulkCost(costs)
            .subscribe((data) => {
                this.router.navigate(['/' + this.company + '/trades/display/' +
                    encodeURIComponent(String(this.sectionId)) + '/' + encodeURIComponent(costTadIndex)]);
                this.snackbarService.informationSnackBar('Costs updated successfully.');
            }));
    }

    calculateProratedRate(sectionId: number, rate: number, parentQuantity: number): number {
        const selectedCost = this.selectedChildCosts.find((cost) => cost.sectionId === sectionId);
        // if existing cost is getting prorated
        if (selectedCost) {
            const quantity: number = selectedCost.quantity;
            return (rate * quantity) / (this.totalQuantity + parentQuantity);
        } else {
            // if there is no cost in child trade, get the quantity of split using the section id for calculation
            const childSectionQuantity = this.allChildCosts.find((cost) => cost.sectionId === sectionId).quantity;
            if (childSectionQuantity) {
                return (rate * childSectionQuantity) / (this.totalQuantity + parentQuantity);
            }
        }
    }

    getDataForParentCostsProrated(selectedCosts: BulkCost[], parentCostsForProrata: ParentCostsToAdjust[]) {
        if (parentCostsForProrata && parentCostsForProrata.length > 0) {
            parentCostsForProrata.forEach((parentCost) => {
                const costToSave = new BulkCost();
                costToSave.sectionId = parentCost.sectionId;
                costToSave.rowStatus = 'A';
                costToSave.costId = parentCost.costId;
                costToSave.costTypeCode = parentCost.costTypeCode;
                costToSave.description = this.getCostTypeDescriptionFromId(parentCost.costTypeCode);
                costToSave.supplierCode = parentCost.supplierCode;
                costToSave.currencyCode = parentCost.currencyCode;
                costToSave.rateTypeId = this.getRateTypeIdFromCode(parentCost.rateTypeCode);
                costToSave.priceUnitId = parentCost.priceUnitId ? parentCost.priceUnitId : (parentCost.priceCode ?
                    this.masterdata.priceUnits.find((priceUnit) =>
                        priceUnit.priceCode === parentCost.priceCode).priceUnitId : null);
                costToSave.rate = parentCost.isProRated ?
                    ((parentCost.quantity * parentCost.rate) / (this.totalQuantity + parentCost.quantity)) :
                    parentCost.rate;
                costToSave.invoicingStatusId = parentCost.invoicingStatusId;
                costToSave.costDirectionId = parentCost.costDirection ?
                    this.costDirections.find((costDirection) =>
                        costDirection.costDirection === parentCost.costDirection).costDirectionId : null;
                if (costToSave.rowStatus) {
                    selectedCosts.push(costToSave);
                }
            });
        }

    }

    getQuantityBySectionId(sectionId: number): number {
        if (this.allChildCosts && this.allChildCosts.length > 0) {
            const section: ChildSectionsCostsToAdjust = this.allChildCosts.find((cost) => cost.sectionId === sectionId);
            if (section) {
                return section.quantity;
            }
        }
    }
}
