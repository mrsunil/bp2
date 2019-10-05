import { CommonModule, CurrencyPipe } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatButtonModule, MatCardModule, MatDialogModule } from '@angular/material';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { RouterModule } from '@angular/router';
import { AgGridModule } from 'ag-grid-angular';
import { TextMaskModule } from 'angular2-text-mask';
import { MaterialModule } from '../shared/material.module';
import { CustomDateAdapter } from '../shared/services/customDateAdapter';
import { ATLAS_DATE_FORMATS, SharedModule } from '../shared/shared.module';
import { CancelTradeDialogComponent } from './components/contract-physical-capture/cancel-trade-dialog/cancel-trade-dialog.component';
import { AddCostConfirmationDialogComponent } from './components/contract-physical-capture/costs-tab/add-cost-confirmation-dialog/add-cost-confirmation-dialog.component';
import { CostInvoiceMarkingDialogComponent } from './components/contract-physical-capture/costs-tab/cost-invoice-marking-dialog/cost-invoice-marking-dialog.component';
import { CostMatrixDialogComponent } from './components/contract-physical-capture/costs-tab/cost-matrix-dialog/cost-matrix-dialog.component';
import { ChildrenCostsComponent } from './components/contract-physical-capture/costs-tab/costs-to-adjust/components/children-costs/children-costs.component';
import { OverrideCostsDialogComponent } from './components/contract-physical-capture/costs-tab/costs-to-adjust/components/override-costs-dialog/override-costs-dialog.component';
import { ParentCostsComponent } from './components/contract-physical-capture/costs-tab/costs-to-adjust/components/parent-costs/parent-costs.component';
import { CostsToAdjustComponent } from './components/contract-physical-capture/costs-tab/costs-to-adjust/costs-to-adjust.component';
import { PhysicalContractCaptureFormCostsTabComponent } from './components/contract-physical-capture/costs-tab/physical-contract-capture-form-costs-tab.component';
import { AdjustWeightFormComponent } from './components/contract-physical-capture/form-components/adjust-weight-form-component/adjust-weight-form-component.component';
import { AllocationFormComponent } from './components/contract-physical-capture/form-components/allocation-form-component/allocation-form-component.component';
import { AllocationInfoFormComponentComponent } from './components/contract-physical-capture/form-components/allocation-info-form-component/allocation-info-form-component.component';
import { AmendmentAuditFormComponentComponent } from './components/contract-physical-capture/form-components/amendment-audit-form-component/amendment-audit-form-component.component';
import { BlInfoFormComponent } from './components/contract-physical-capture/form-components/bl-info-form-component/bl-info-form-component.component';
import { CashAgainstInvoiceFormComponentComponent } from './components/contract-physical-capture/form-components/cash-against-invoice-form-component/cash-against-invoice-form-component.component';
import { CharterFormComponentComponent } from './components/contract-physical-capture/form-components/charter-form-component/charter-form-component.component';
import { CommodityFormComponent } from './components/contract-physical-capture/form-components/commodity-form-component/commodity-form-component.component';
import { CounterpartyFormComponent } from './components/contract-physical-capture/form-components/counterparty-form-component/counterparty-form-component.component';
import { CurrentTradeFormComponent } from './components/contract-physical-capture/form-components/current-trade-form-component/current-trade-form-component.component';
import { DocumentStatusFormComponentComponent } from './components/contract-physical-capture/form-components/document-status-form-component/document-status-form-component.component';
import { HeaderFormComponent } from './components/contract-physical-capture/form-components/header-form-component/header-form-component.component';
import { InvoicingFormComponentComponent } from './components/contract-physical-capture/form-components/invoicing-form-component/invoicing-form-component.component';
import { LocationFormComponent } from './components/contract-physical-capture/form-components/location-form-component/location-form-component.component';
import { MemoFormComponent } from './components/contract-physical-capture/form-components/memo-form-component/memo-form-component.component';
import { PriceFormComponent } from './components/contract-physical-capture/form-components/price-form-component/price-form-component.component';
import { QuantityFormComponent } from './components/contract-physical-capture/form-components/quantity-form-component/quantity-form-component.component';
import { ShipmentInfoFormComponent } from './components/contract-physical-capture/form-components/shipment-info-form-component/shipment-info-form-component.component';
import { ShipmentPeriodFormComponent } from './components/contract-physical-capture/form-components/shipment-period-form/shipment-period-form.component';
import { TermsFormComponent } from './components/contract-physical-capture/form-components/terms-form-component/terms-form-component.component';
import { CostImpactWarningDialogComponent } from './components/contract-physical-capture/form-components/trade-merge/cost-impact-warning-dialog/cost-impact-warning-dialog.component';
import { MergeOptionsComponent } from './components/contract-physical-capture/form-components/trade-merge/merge-options/merge-options.component';
import { MergeValidationsComponent } from './components/contract-physical-capture/form-components/trade-merge/merge-validations/merge-validations.component';
import { TradeMergeComponent } from './components/contract-physical-capture/form-components/trade-merge/trade-merge.component';
import { TradesListComponent } from './components/contract-physical-capture/form-components/trade-merge/trades-list/trades-list.component';
import { TrancheSplitGridComponent } from './components/contract-physical-capture/form-components/tranche-split-grid/tranche-split-grid.component';
import { IntercoTradeDialogComponent } from './components/contract-physical-capture/interco-trade-dialog/interco-trade-dialog.component';
import { InteroStateBannerComponent } from './components/contract-physical-capture/interco-trade-dialog/intero-state-banner/intero-state-banner.component';
import { DetailedViewComponent } from './components/contract-physical-capture/invoice-marking-tab/components/detailed-view/detailed-view.component';
import { InvoiceStatusComponent } from './components/contract-physical-capture/invoice-marking-tab/components/invoice-status/invoice-status.component';
import { InvoiceTotalsComponent } from './components/contract-physical-capture/invoice-marking-tab/components/invoice-totals/invoice-totals.component';
import { InvoiceViewModeComponent } from './components/contract-physical-capture/invoice-marking-tab/components/invoice-view-mode/invoice-view-mode.component';
import { TopCardComponent } from './components/contract-physical-capture/invoice-marking-tab/components/top-card/top-card.component';
import { PhysicalContractCaptureFormInvoiceMarkingTabComponent } from './components/contract-physical-capture/invoice-marking-tab/physical-contract-capture-form-invoice-marking-tab.component';
import { PhysicalContractCaptureFormMainTabComponent } from './components/contract-physical-capture/main-tab/physical-contract-capture-form-main-tab.component';
import { SaveAsFavouriteDialogComponent } from './components/contract-physical-capture/save-as-favourite-dialog/save-as-favourite-dialog.component';
import { NewTrancheSplitAgGridComponent } from './components/contract-physical-capture/section-tab/new-tranche-split-ag-grid/new-tranche-split-ag-grid.component';
import { NewTrancheSplitFooterComponent } from './components/contract-physical-capture/section-tab/new-tranche-split-footer/new-tranche-split-footer.component';
import { NewTrancheSplitHeaderComponent } from './components/contract-physical-capture/section-tab/new-tranche-split-header/new-tranche-split-header.component';
import { PhysicalContractCaptureFormSectionTabComponent } from './components/contract-physical-capture/section-tab/physical-contract-capture-form-section-tab.component';
import { PhysicalContractCaptureFormStatusTabComponent } from './components/contract-physical-capture/status-tab/physical-contract-capture-form-status-tab.component';
import { TradeCapturePageComponent } from './components/contract-physical-capture/trade-capture-page.component';
import { TradeImageDialogComponent } from './components/contract-physical-capture/trade-image-dialog/trade-image-dialog.component';
import { TradeManagementMenuBarComponent } from './components/contract-physical-capture/trade-management-menu-bar/trade-management-menu-bar.component';
import { PhysicalContractCaptureFormTrafficTabComponent } from './components/contract-physical-capture/traffic-tab/physical-contract-capture-form-traffic-tab.component';
import { CostmatrixCreateComponent } from './components/costmatrices/components/costmatrix-create/costmatrix-create.component';
import { CostmatrixListComponent } from './components/costmatrices/components/costmatrix-list/costmatrix-list.component';
import { CostmatricesComponent } from './components/costmatrices/costmatrices.component';
import { CostmatrixMenuBarComponent } from './components/costmatrices/costmatrix-menu-bar/costmatrix-menu-bar.component';
import { FxDealsCaptureComponent } from './components/fx-deals/capture/fx-deals-capture.component';
import { BankFormComponent } from './components/fx-deals/form-components/bank-form-component/bank-form.component';
import { DealFormComponent } from './components/fx-deals/form-components/deal-form-comonent/deal-form.component';
import { DealTermsFormComponent } from './components/fx-deals/form-components/deal-terms-component/deal-terms-form.component';
import { FxDealHeaderFormComponent } from './components/fx-deals/form-components/header-form-component/fxdeal-header-form.component';
import { InternalMemoFormComponent } from './components/fx-deals/form-components/internal-memo-form-component/internal-memo-form.component';
import { RateEntryComponent } from './components/fx-deals/form-components/rate-entry-form-component/rate-entry-form.component';
import { SettlementDocumentsComponent } from './components/fx-deals/form-components/settlement-documents-component/settlement-documents.component';
import { FxDealsComponent } from './components/fx-deals/fx-deals.component';
import { BulkAllocationComponent } from './components/group-amendments/bulk-allocation/bulk-allocation.component';
import { BulkApprovalComponent } from './components/group-amendments/bulk-approval/bulk-approval.component';
import { BulkClosureComponent } from './components/group-amendments/bulk-closure/bulk-closure.component';
import { BulkDeallocationComponent } from './components/group-amendments/bulk-deallocation/bulk-deallocation.component';
import { BulkEditionComponent } from './components/group-amendments/bulk-edition/bulk-edition.component';
import { BulkUpdateCostsComponent } from './components/group-amendments/bulk-update-costs/bulk-update-costs.component';
import { GroupAmendmentsComponent } from './components/group-amendments/group-amendments.component';
import { GroupFunctionContractsComponent } from './components/group-functions/group-function-contracts/group-function-contracts.component';
import { GroupFunctionWarningComponent } from './components/group-functions/group-function-warning/group-function-warning.component';
import { GroupFunctionsComponent } from './components/group-functions/group-functions.component';
import { AllocationGridsComponent } from './components/group-functions/trade-bulk-allocation/allocation-grids/allocation-grids.component';
import { TradeBulkAllocationComponent } from './components/group-functions/trade-bulk-allocation/trade-bulk-allocation.component';
import { TradeBulkApprovalComponent } from './components/group-functions/trade-bulk-approval/trade-bulk-approval.component';
import { AgGridPopUpComponent } from './components/group-functions/trade-bulk-closure/ag-grid-pop-up/ag-grid-pop-up.component';
import { BulkClosureMatrixComponent } from './components/group-functions/trade-bulk-closure/bulk-closure-matrix/bulk-closure-matrix.component';
import { PopUpDialogComponentComponent } from './components/group-functions/trade-bulk-closure/dialog/pop-up-dialog-component.component';
import { SummaryClosureMatrixComponent } from './components/group-functions/trade-bulk-closure/summary/summary-closure-matrix.component';
import { TradeBulkClosureComponent } from './components/group-functions/trade-bulk-closure/trade-bulk-closure.component';
import { BulkDeAllocationSectionDialogComponent } from './components/group-functions/trade-bulk-deallocation/section-dialog/section-dialog.component';
import { TradeBulkDeallocationComponent } from './components/group-functions/trade-bulk-deallocation/trade-bulk-deallocation.component';
import { EditionMatrixComponent } from './components/group-functions/trade-bulk-edit/edition-matrix/edition-matrix.component';
import { MasterRowApplyComponent } from './components/group-functions/trade-bulk-edit/edition-matrix/master-row-apply/master-row-apply.component';
import { TradeBulkEditComponent } from './components/group-functions/trade-bulk-edit/trade-bulk-edit.component';
import { TradeBulkFieldsComponent } from './components/group-functions/trade-bulk-edit/trade-bulk-fields/trade-bulk-fields.component';
import { CostBulkUpdateSummaryComponent } from './components/group-functions/trade-cost-bulk-update/cost-bulk-update-summary/cost-bulk-update-summary.component';
import { SelectContractsComponent } from './components/group-functions/trade-cost-bulk-update/select-contracts/select-contracts.component';
import { TradeCostBulkUpdateComponent } from './components/group-functions/trade-cost-bulk-update/trade-cost-bulk-update.component';
import { AddCostsComponent } from './components/group-functions/trade-cost-bulk-update/update-costs/components/add-costs/add-costs.component';
import { EditCostsDialogComponent } from './components/group-functions/trade-cost-bulk-update/update-costs/components/edit-costs-dialog/edit-costs-dialog.component';
import { EditCostsComponent } from './components/group-functions/trade-cost-bulk-update/update-costs/components/edit-costs/edit-costs.component';
import { UpdateCostsComponent } from './components/group-functions/trade-cost-bulk-update/update-costs/update-costs.component';
import { SectionNewComponent } from './components/section-new/section-new.component';
import { AllocationTableFormComponent } from './components/trade-allocation/allocation-form-components/allocation-table-form-component/allocation-table-form-component.component';
import { HeaderAllocationFormComponent } from './components/trade-allocation/allocation-form-components/header-allocation-form-component/header-allocation-form-component.component';
import { SearchAllocationFormComponent } from './components/trade-allocation/allocation-form-components/search-allocation-form-component/search-allocation-form-component.component';
import { ShippingAllocationFormComponent } from './components/trade-allocation/allocation-form-components/shipping-allocation-form-component/shipping-allocation-form-component.component';
import { WarningAllocationFormComponent } from './components/trade-allocation/allocation-form-components/warning-allocation-form-component/warning-allocation-form-component.component';
import { TradeAllocationComponent } from './components/trade-allocation/trade-allocation.component';
import { TradeCostReportComponent } from './components/trade-cost-report/trade-cost-report.component';
import { TradePnlReportComponent } from './components/trade-pnl-report/trade-pnl-report.component';
import { TradesTabComponent } from './components/trades-tab/trades-tab.component';
import { TradesComponent } from './components/trades/trades.component';
import { BlockerWarningMessageComponent } from './dialog-boxes/blocker-warning-message/blocker-warning-message.component';
import { BulkApprovalDialogComponent } from './dialog-boxes/bulk-approval-dialog/bulk-approval-dialog.component';
import { SnapshotSelectionDialogBoxComponent } from './dialog-boxes/snapshot-selection/snapshot-selection-dialog-box.component';
import { TradeDeallocationDialogComponent } from './dialog-boxes/trade-deallocation/trade-deallocation-dialog-component.component';
import { FnoTradeDetailsResolver } from './fno-trade-details.resolver';
import { QuantityPipe } from './pipes/quantity.pipe';
import { TradingRoutingModule } from './trading.route';

@NgModule({
    imports: [
        CommonModule,
        MaterialModule,
        TradingRoutingModule,
        AgGridModule.withComponents([]),
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        SharedModule,
        MatCardModule,
        MatButtonModule,
        MatDialogModule,
        TextMaskModule,
    ],
    declarations: [
        TradesComponent,
        SectionNewComponent,
        TradeCapturePageComponent,
        PhysicalContractCaptureFormMainTabComponent,
        ShipmentPeriodFormComponent,
        QuantityFormComponent,
        LocationFormComponent,
        PriceFormComponent,
        HeaderFormComponent,
        CounterpartyFormComponent,
        CommodityFormComponent,
        MemoFormComponent,
        TermsFormComponent,
        PhysicalContractCaptureFormTrafficTabComponent,
        BlInfoFormComponent,
        AdjustWeightFormComponent,
        ShipmentInfoFormComponent,
        CurrentTradeFormComponent,
        AllocationFormComponent,
        PhysicalContractCaptureFormStatusTabComponent,
        AllocationInfoFormComponentComponent,
        AmendmentAuditFormComponentComponent,
        CashAgainstInvoiceFormComponentComponent,
        CharterFormComponentComponent,
        DocumentStatusFormComponentComponent,
        InvoicingFormComponentComponent,
        TradeDeallocationDialogComponent,
        PhysicalContractCaptureFormSectionTabComponent,
        TradeAllocationComponent,
        HeaderAllocationFormComponent,
        SearchAllocationFormComponent,
        WarningAllocationFormComponent,
        ShippingAllocationFormComponent,
        AllocationTableFormComponent,
        NewTrancheSplitAgGridComponent,
        NewTrancheSplitFooterComponent,
        NewTrancheSplitHeaderComponent,
        TrancheSplitGridComponent,
        PhysicalContractCaptureFormCostsTabComponent,
        PhysicalContractCaptureFormInvoiceMarkingTabComponent,
        InvoiceTotalsComponent,
        InvoiceStatusComponent,
        DetailedViewComponent,
        TradeManagementMenuBarComponent,
        InvoiceViewModeComponent,
        TopCardComponent,
        CostInvoiceMarkingDialogComponent,
        TradeImageDialogComponent,
        TradesTabComponent,
        CostmatricesComponent,
        CostmatrixCreateComponent,
        CostmatrixListComponent,
        CostMatrixDialogComponent,
        SnapshotSelectionDialogBoxComponent,
        TradePnlReportComponent,
        AddCostConfirmationDialogComponent,
        TradeCostReportComponent,
        BlockerWarningMessageComponent,
        CostmatrixMenuBarComponent,
        GroupFunctionsComponent,
        GroupFunctionContractsComponent,
        GroupAmendmentsComponent,
        BulkEditionComponent,
        BulkApprovalComponent,
        TradeBulkEditComponent,
        TradeBulkApprovalComponent,
        GroupFunctionWarningComponent,
        SaveAsFavouriteDialogComponent,
        BulkApprovalDialogComponent,
        EditionMatrixComponent,
        TradeBulkFieldsComponent,
        IntercoTradeDialogComponent,
        InteroStateBannerComponent,
        QuantityPipe,
        BulkUpdateCostsComponent,
        TradeCostBulkUpdateComponent,
        SelectContractsComponent,
        AddCostsComponent,
        UpdateCostsComponent,
        EditCostsComponent,
        EditCostsDialogComponent,
        MasterRowApplyComponent,
        BulkClosureComponent,
        TradeBulkClosureComponent,
        BulkClosureMatrixComponent,
        SummaryClosureMatrixComponent,
        AgGridPopUpComponent,
        PopUpDialogComponentComponent,
        CostBulkUpdateSummaryComponent,
        ParentCostsComponent,
        ChildrenCostsComponent,
        CancelTradeDialogComponent,
        BulkAllocationComponent,
        TradeBulkAllocationComponent,
        AllocationGridsComponent,
        CostsToAdjustComponent,
        FxDealsComponent,
        OverrideCostsDialogComponent,
        BulkDeallocationComponent,
        TradeBulkDeallocationComponent,
        BulkDeAllocationSectionDialogComponent,
        FxDealsCaptureComponent,
        FxDealHeaderFormComponent,
        DealTermsFormComponent,
        BankFormComponent,
        DealFormComponent,
        RateEntryComponent,
        InternalMemoFormComponent,
        TradeMergeComponent,
        TradesListComponent,
        MergeOptionsComponent,
        MergeValidationsComponent,
        SettlementDocumentsComponent,
        CostImpactWarningDialogComponent,
    ],
    providers: [CustomDateAdapter,
        { provide: MAT_DATE_LOCALE, useValue: 'en' },
        { provide: DateAdapter, useClass: CustomDateAdapter },
        { provide: MAT_DATE_FORMATS, useValue: ATLAS_DATE_FORMATS },
        FnoTradeDetailsResolver,
        CurrencyPipe,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    entryComponents: [
        SectionNewComponent,
        TradeDeallocationDialogComponent,
        CostInvoiceMarkingDialogComponent,
        TradeImageDialogComponent,
        CostMatrixDialogComponent, AddCostConfirmationDialogComponent,
        SnapshotSelectionDialogBoxComponent,
        TradePnlReportComponent,
        TradeCostReportComponent,
        BlockerWarningMessageComponent,
        SaveAsFavouriteDialogComponent,
        BulkApprovalDialogComponent,
        IntercoTradeDialogComponent,
        EditCostsDialogComponent,
        MasterRowApplyComponent,
        EditCostsDialogComponent,
        AgGridPopUpComponent,
        IntercoTradeDialogComponent,
        PopUpDialogComponentComponent,
        CancelTradeDialogComponent,
        OverrideCostsDialogComponent,
        BulkDeAllocationSectionDialogComponent,
        CostImpactWarningDialogComponent],
})
export class TradingModule { }
