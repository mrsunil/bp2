import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { AgGridModule } from 'ag-grid-angular';
import { TextMaskModule } from 'angular2-text-mask';
import { MissingInvoicesDetailsComponent } from '../home/execution-dashboard/missing-invoices-details/missing-invoices-details.component';
import { AgGridCheckboxComponent } from '../shared/components/ag-grid-checkbox/ag-grid-checkbox.component';
import { ConfirmationDialogComponent } from '../shared/components/confirmation-dialog/confirmation-dialog.component';
import { MaterialModule } from '../shared/material.module';
import { CustomDateAdapter } from '../shared/services/customDateAdapter';
import { ATLAS_DATE_FORMATS, SharedModule } from '../shared/shared.module';
import { ContractAdviceGenerationComponent } from './document/contract-advice-generation/contract-advice-generation.component';
import { ContractAdviceGenerationSelectionFormComponent } from './document/contract-advice-generation/form-components/selection-form/selection-form.component';
import { DocumentUploadDialogBoxComponent } from './document/dialog-boxes/document-upload-dialog-box/document-upload-dialog-box.component';
import { DocumentListCardComponent } from './document/list/card/document-list-card.component';
import { DocumentListComponent } from './document/list/document-list.component';
import { ExecutionAllocationComponent } from './execution-allocation/execution-allocation.component';
import { AdditionalCostsFormComponent } from './execution-cash/execution-cash-create/cash-details/additional-costs/additional-costs.component';
import { AdditionalDetailsFormComponent } from './execution-cash/execution-cash-create/cash-details/additional-details/additional-details.component';
import { BankInformationComponent } from './execution-cash/execution-cash-create/cash-details/bank-information/bank-information.component';
import { CashDetailsFormComponent } from './execution-cash/execution-cash-create/cash-details/cash-details.component';
import { CounterpartyFormComponent } from './execution-cash/execution-cash-create/cash-details/counterparty-card/counterparty-card.component';
import { CurrencyInformationCardComponent } from './execution-cash/execution-cash-create/cash-details/currency-information-card/currency-information-card.component';
import { DocumentInformationFormComponent } from './execution-cash/execution-cash-create/cash-details/document-information/document-information.component';
import { PaymentOrderTemplateSelectionCardComponent } from './execution-cash/execution-cash-create/cash-details/template-selection-card/payment-order-template-selection-card.component';
import { CashWarningDialogComponentComponent } from './execution-cash/execution-cash-create/cash-dialog-component/cash-warning-dialog-component/cash-warning-dialog-component.component';
import { CashSelectionFormComponent } from './execution-cash/execution-cash-create/cash-selection/cash-selection.component';
import { PaymentDifferentClientComponent } from './execution-cash/execution-cash-create/cash-selection/payment-different-client/payment-different-client.component';
import { PaymentDifferentCurrencyComponent } from './execution-cash/execution-cash-create/cash-selection/payment-different-currency/payment-different-currency.component';
import { PaymentFullTransactionComponent } from './execution-cash/execution-cash-create/cash-selection/payment-full-transaction/payment-full-transaction.component';
import { ReceiptDifferentCurrencyComponent } from './execution-cash/execution-cash-create/cash-selection/receipt-different-currency/receipt-different-currency.component';
import { ReceiptFullTransactionComponent } from './execution-cash/execution-cash-create/cash-selection/receipt-full-transaction/receipt-full-transaction.component';
import { SimpleCashPaymentComponent } from './execution-cash/execution-cash-create/cash-selection/simple-cash-payment/simple-cash-payment.component';
import { SimpleCashReceiptComponent } from './execution-cash/execution-cash-create/cash-selection/simple-cash-receipt/simple-cash-receipt.component';
import { CashSummaryFormComponent } from './execution-cash/execution-cash-create/cash-summary/cash-summary.component';
import { InvoiceGridForSummaryComponent } from './execution-cash/execution-cash-create/cash-summary/invoice-grid-for-summary/invoice-grid-for-summary.component';
import { ExecutionCashCreateComponent } from './execution-cash/execution-cash-create/execution-cash-create.component';
import { InvoiceMatchingComponent } from './execution-cash/execution-cash-create/pick-transaction/invoice-matching/invoice-matching.component';
import { PickTransactionComponent } from './execution-cash/execution-cash-create/pick-transaction/pick-transaction.component';
import { ExecutionCashPaymentListPageComponent } from './execution-cash/execution-cash-payment-list-page/execution-cash-payment-list-page.component';
import { ExecutionCashComponent } from './execution-cash/execution-cash.component';
import { AgGridCharterStatusForCharterBulkClosureComponent } from './execution-charter/ag-grid-charterstatus-for-charter-bulk-closure/ag-grid-charterstatus-for-charter-bulk-closure.component';
import { AgGridHyperlinkForCharterBulkClosureComponent } from './execution-charter/ag-grid-hyperlink-for-charter-bulk-closure/ag-grid-hyperlink-for-charter-bulk-closure.component';
import { PurchaseAllocationComponentComponent } from './execution-charter/execution-charter-allocation-deallocation/allocation-form-components/purchase-allocation-component/purchase-allocation-component.component';
import { QuantityAllocationComponentComponent } from './execution-charter/execution-charter-allocation-deallocation/allocation-form-components/quantity-allocation-component/quantity-allocation-component.component';
import { SaleAllocationComponentComponent } from './execution-charter/execution-charter-allocation-deallocation/allocation-form-components/sale-allocation-component/sale-allocation-component.component';
import { ContractDeallocationDialogComponent } from './execution-charter/execution-charter-allocation-deallocation/contract-deallocation-dialog-component/contract-deallocation-dialog-component.component';
import { DeallocationComponentComponent } from './execution-charter/execution-charter-allocation-deallocation/deallocation-form-component/deallocation-component/deallocation-component.component';
import { ExecutionCharterAllocationDeallocationComponent } from './execution-charter/execution-charter-allocation-deallocation/execution-charter-allocation-deallocation.component';
import { ExecutionCharterAssignmentComponent } from './execution-charter/execution-charter-assignment/execution-charter-assignment.component';
import { AdditionalInformationFormComponent } from './execution-charter/execution-charter-creation-page/components/additional-information-form-component/additional-information-form-component.component';
import { AssignSectionDialogComponent } from './execution-charter/execution-charter-creation-page/components/assign-section-dialog/assign-section-dialog.component';
import { AssignedContractListFormComponent } from './execution-charter/execution-charter-creation-page/components/assigned-contract-list-form-component/assigned-contract-list-form-component.component';
import { CharterMenuBarComponent } from './execution-charter/execution-charter-creation-page/components/charter-menu-bar-component/charter-menu-bar-component.component';
import { CharterPnlReportComponent } from './execution-charter/execution-charter-creation-page/components/charter-pnl-report/charter-pnl-report.component';
import { CharterReportComponent } from './execution-charter/execution-charter-creation-page/components/charter-report/charter-report.component';
import { DeassignSectionDialogComponent } from './execution-charter/execution-charter-creation-page/components/deassign-section-dialog/deassign-section-dialog.component';
import { MainInformationFormComponent } from './execution-charter/execution-charter-creation-page/components/main-information-form-component/main-information-form-component.component';
import { MemoFormComponent } from './execution-charter/execution-charter-creation-page/components/memo-form-component/memo-form-component.component';
import { ReassignContractAgGridComponent } from './execution-charter/execution-charter-creation-page/components/reassign-contract-ag-grid/reassign-contract-ag-grid.component';
import { ReassignSectionDialogComponent } from './execution-charter/execution-charter-creation-page/components/reassign-section-dialog/reassign-section-dialog.component';
import { ShipmentFormComponent } from './execution-charter/execution-charter-creation-page/components/shipment-form-component/shipment-form-component.component';
import { TotalCardComponent } from './execution-charter/execution-charter-creation-page/components/total-card-component/total-card-component.component';
import { WarningComponent } from './execution-charter/execution-charter-creation-page/components/warning-component/warning-component.component';
import { ExecutionCharterCreationPageComponent } from './execution-charter/execution-charter-creation-page/execution-charter-creation-page.component';
import { ExecutionCharterDetailsComponent } from './execution-charter/execution-charter-details/execution-charter-details.component';
import { ExecutionCharterEditPageComponent } from './execution-charter/execution-charter-edit-page/execution-charter-edit-page.component';
import { ExecutionCharterListPageComponent } from './execution-charter/execution-charter-list-page/execution-charter-list-page.component';
import { CharterBulkClosureComponent } from './execution-charter/group-amendments/charter-bulk-closure/charter-bulk-closure.component';
import { ExecutionCharterGroupAmendmentsComponent } from './execution-charter/group-amendments/execution-charter-group-amendments.component';
import { CharterBulkClosureMatrixComponent } from './execution-charter/group-function/bulk-closure-function/charter-bulk-closure-matrix/charter-bulk-closure-matrix.component';
import { CharterBulkClosureSummaryComponent } from './execution-charter/group-function/bulk-closure-function/charter-bulk-closure-summary/charter-bulk-closure-summary.component';
import { CharterSelectionBulkClosureComponent } from './execution-charter/group-function/bulk-closure-function/charter-selection-bulk-closure/charter-selection-bulk-closure.component';
import { ExecutionCharterBulkClosureFunctionComponent } from './execution-charter/group-function/bulk-closure-function/execution-charter-bulk-closure-function.component';
import { ExecutionCharterGroupFunctionComponent } from './execution-charter/group-function/execution-charter-group-function.component';
import { CostFormComponentComponent } from './execution-invoicing-create/components/cost-form-component/cost-form-component.component';
import { PurchaseGoodsFormComponentComponent } from './execution-invoicing-create/components/purchase-goods-form-component/purchase-goods-form-component.component';
import { QuantityInvoiceFormComponentComponent } from './execution-invoicing-create/components/quantity-invoice-form-component/quantity-invoice-form-component.component';
import { ReversalFormComponent } from './execution-invoicing-create/components/reversal-form-component/reversal-form-component.component';
import { SalesGoodsFormComponentComponent } from './execution-invoicing-create/components/sales-goods-form-component/sales-goods-form-component.component';
import { WashoutFormComponent } from './execution-invoicing-create/components/washout-form-component/washout-form-component.component';
import { ExecutionInvoicingCreateComponent } from './execution-invoicing-create/execution-invoicing-create.component';
import { ExecutionInvoicingHomeComponent } from './execution-invoicing-home/execution-invoicing-home.component';
import { CommercialComponent } from './execution-invoicing/commercial/commercial.component';
import { CommercialSelectionComponent } from './execution-invoicing/commercial/components/commercial-selection/commercial-selection.component';
import { ContractSelectionFormComponent } from './execution-invoicing/commercial/components/commercial-selection/components/contract-selection-form-component/contract-selection-form-component.component';
import { InvoiceSelectionFormComponent } from './execution-invoicing/commercial/components/commercial-selection/components/invoice-selection-form-component/invoice-selection-form-component.component';
import { PricingOptionsComponent } from './execution-invoicing/commercial/components/commercial-selection/components/pricing-options/pricing-options.component';
import { CommercialSummaryComponent } from './execution-invoicing/commercial/components/summary/commercial-summary.component';
import { CommercialWorkingPageComponent } from './execution-invoicing/commercial/components/working-page/commercial-working-page.component';
import { AddCostTaxComponent } from './execution-invoicing/commercial/components/working-page/components/add-cost-tax/add-cost-tax.component';
import { AddCostTotalComponent } from './execution-invoicing/commercial/components/working-page/components/add-cost-total/add-cost-total.component';
import { AddCostComponent } from './execution-invoicing/commercial/components/working-page/components/add-cost/add-cost.component';
import { CommercialPaymentsComponent } from './execution-invoicing/commercial/components/working-page/components/payments-component/payments-component.component';
import { SelectionFormComponentComponent } from './execution-invoicing/commercial/components/working-page/components/selection-form-component/selection-form-component.component';
import { TaxesComponent } from './execution-invoicing/commercial/components/working-page/components/taxes-component/taxes-component.component';
import { CommercialValueOfGoodsComponent } from './execution-invoicing/commercial/components/working-page/components/value-of-goods-component/value-of-goods-component.component';
import { DocumentTemplateComponent } from './execution-invoicing/components/document-template/document-template.component';
import { ContractSearchComponent } from './execution-invoicing/cost/components/cost-selection/components/contract-search/contract-search.component';
import { CostInvoiceeOptionsComponent } from './execution-invoicing/cost/components/cost-selection/components/cost-invoicee-options/cost-invoicee-options.component';
import { InvoiceSelectionComponent } from './execution-invoicing/cost/components/cost-selection/components/invoice-selection/invoice-selection.component';
import { CostSelectionComponent } from './execution-invoicing/cost/components/cost-selection/cost-selection.component';
import { CostDocumentTemplateComponent } from './execution-invoicing/cost/components/cost-working-page/components/document-template/cost-document-template.component';
import { CostPaymentsComponent } from './execution-invoicing/cost/components/cost-working-page/components/payments/cost-payments.component';
import { InvoiceCostSelectedCostComponent } from './execution-invoicing/cost/components/cost-working-page/components/selected-cost/invoice-cost-selected-cost.component';
import { CostInvoiceSelectionComponent } from './execution-invoicing/cost/components/cost-working-page/components/selection/cost-invoice-selection.component';
import { InvoicingCostTaxesComponent } from './execution-invoicing/cost/components/cost-working-page/components/taxes/invoicing-cost-taxes.component';
import { CostWorkingPageComponent } from './execution-invoicing/cost/components/cost-working-page/cost-working-page.component';
import { CostSummaryComponent } from './execution-invoicing/cost/components/summary/cost-summary.component';
import { CostComponent } from './execution-invoicing/cost/cost.component';
import { ApportionDialogComponent } from './execution-invoicing/dialog-boxes/apportion-dialog/apportion-dialog.component';
import { BankAccountDialogComponent } from './execution-invoicing/dialog-boxes/bank-account-dialog/bank-account-dialog.component';
import { ExecutionInvoicingComponent } from './execution-invoicing/execution-invoicing.component';
import { GoodsCostContractsCostComponent } from './execution-invoicing/goods-cost/components/goods-cost-selection-cost/components/goods-cost-contracts-cost/goods-cost-contracts-cost.component';
import { GoodsCostSelectionCostComponent } from './execution-invoicing/goods-cost/components/goods-cost-selection-cost/goods-cost-selection-cost.component';
import { GoodsCostContractSearchComponent } from './execution-invoicing/goods-cost/components/goods-cost-selection/components/goods-cost-contract-search/goods-cost-contract-search.component';
import { GoodsCostInvoiceSelectionComponent } from './execution-invoicing/goods-cost/components/goods-cost-selection/components/goods-cost-invoice-selection/goods-cost-invoice-selection.component';
import { GoodsCostPricingOptionsComponent } from './execution-invoicing/goods-cost/components/goods-cost-selection/components/goods-cost-pricing-options/goods-cost-pricing-options.component';
import { GoodsCostSelectionComponent } from './execution-invoicing/goods-cost/components/goods-cost-selection/goods-cost-selection.component';
import { GoodsCostSummaryComponent } from './execution-invoicing/goods-cost/components/goods-cost-summary/goods-cost-summary.component';
import { GoodsCostAdditionalCostComponent } from './execution-invoicing/goods-cost/components/goods-cost-working-page/components/goods-cost-additional-cost/goods-cost-additional-cost.component';
import { GoodsCostDetailsComponent } from './execution-invoicing/goods-cost/components/goods-cost-working-page/components/goods-cost-details/goods-cost-details.component';
import { GoodsCostPaymentsComponent } from './execution-invoicing/goods-cost/components/goods-cost-working-page/components/goods-cost-payments/goods-cost-payments.component';
import { GoodsCostTaxCostComponent } from './execution-invoicing/goods-cost/components/goods-cost-working-page/components/goods-cost-tax-cost/goods-cost-tax-cost.component';
import { GoodsCostTaxGoodsComponent } from './execution-invoicing/goods-cost/components/goods-cost-working-page/components/goods-cost-tax-goods/goods-cost-tax-goods.component';
import { GoodsCostTotalComponent } from './execution-invoicing/goods-cost/components/goods-cost-working-page/components/goods-cost-total/goods-cost-total.component';
import { GoodsCostValueOfGoodsComponent } from './execution-invoicing/goods-cost/components/goods-cost-working-page/components/goods-cost-value-of-goods/goods-cost-value-of-goods.component';
import { GoodsCostWorkingPageComponent } from './execution-invoicing/goods-cost/components/goods-cost-working-page/goods-cost-working-page.component';
import { GoodsCostComponent } from './execution-invoicing/goods-cost/goods-cost.component';
import { HeaderComponent } from './execution-invoicing/header/header.component';
import { DocumentTemplateBaseComponent } from './execution-invoicing/invoicing-base-form/document-template-base/document-template-base.component';
import { InvoicingBaseFormComponent } from './execution-invoicing/invoicing-base-form/invoicing-base-form.component';
import { InvoicingSummaryComponent } from './execution-invoicing/invoicing-summary/invoicing-summary.component';
import { DocumentSearchComponent } from './execution-invoicing/reversal/components/reversal-selection/components/document-search/document-search.component';
import { DocumentTypeComponent } from './execution-invoicing/reversal/components/reversal-selection/components/document-type/document-type.component';
import { ReversalDocumentTemplateComponent } from './execution-invoicing/reversal/components/reversal-selection/components/reversal-document-template/reversal-document-template.component';
import { ReversalInvoiceSelectionComponent } from './execution-invoicing/reversal/components/reversal-selection/components/reversal-invoice-selection/reversal-invoice-selection.component';
import { ReversalSelectionComponent } from './execution-invoicing/reversal/components/reversal-selection/reversal-selection.component';
import { ReversalSummaryComponent } from './execution-invoicing/reversal/components/reversal-summary/reversal-summary.component';
import { ReversalComponent } from './execution-invoicing/reversal/reversal.component';
import { TotalAmountComponent } from './execution-invoicing/total-amount/total-amount.component';
import { DecimalsComponent } from './execution-invoicing/washout/components/washout-selection/components/decimals/decimals.component';
import { InvoiceTypeSelectionComponent } from './execution-invoicing/washout/components/washout-selection/components/invoice-type-selection/invoice-type-selection.component';
import { WashoutSearchComponent } from './execution-invoicing/washout/components/washout-selection/components/washout-search/washout-search.component';
import { WashoutSelectionComponent } from './execution-invoicing/washout/components/washout-selection/washout-selection.component';
import { WashoutSummaryComponent } from './execution-invoicing/washout/components/washout-summary/washout-summary.component';
import { AdditionalCostComponent } from './execution-invoicing/washout/components/washout-working-page/components/additional-cost/additional-cost.component';
import { InvoiceDocumentComponent } from './execution-invoicing/washout/components/washout-working-page/components/invoice-document/invoice-document.component';
import { WashoutPaymentsComponent } from './execution-invoicing/washout/components/washout-working-page/components/payments/payments.component';
import { SelectionComponent } from './execution-invoicing/washout/components/washout-working-page/components/selection/selection.component';
import { TaxCostsComponent } from './execution-invoicing/washout/components/washout-working-page/components/tax-costs/tax-costs.component';
import { TaxGoodsComponent } from './execution-invoicing/washout/components/washout-working-page/components/tax-goods/tax-goods.component';
import { WashoutValueOfGoodsComponent } from './execution-invoicing/washout/components/washout-working-page/components/value-of-goods/value-of-goods.component';
import { WashoutTotalComponent } from './execution-invoicing/washout/components/washout-working-page/components/washout-total/washout-total.component';
import { WashoutWorkingPageComponent } from './execution-invoicing/washout/components/washout-working-page/washout-working-page.component';
import { WashoutComponent } from './execution-invoicing/washout/washout.component';
import { ExecutionRoutingModule } from './execution.route';
import { ExecutionCashReceiptListPageComponent } from './execution-cash/execution-cash-receipt-list-page/execution-cash-receipt-list-page.component';
import { ContractTemplateSelecionComponent } from './document/contract-advice-generation/form-components/contract-template-selection/contract-template-selection.component';
import { TemplatesSidenavSelectorComponent } from './document/contract-advice-generation/form-components/templates-sidenav-selector/templates-sidenav-selector.component';
import { ContractTemplateListComponent } from './document/contract-advice-generation/form-components/contract-template-selection/contract-template-list/contract-template-list.component';

@NgModule({
    imports: [
        CommonModule,
        MaterialModule,
        ExecutionRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
        AgGridModule,
        TextMaskModule,
    ],
    entryComponents: [
        ConfirmationDialogComponent,
        AgGridCheckboxComponent,
        AssignSectionDialogComponent,
        DeassignSectionDialogComponent,
        BankAccountDialogComponent,
        ContractDeallocationDialogComponent,
        CharterPnlReportComponent,
        CharterReportComponent,
        DocumentUploadDialogBoxComponent,
        CashWarningDialogComponentComponent,
        ReassignSectionDialogComponent,
        ApportionDialogComponent,
        AgGridCharterStatusForCharterBulkClosureComponent,
        AgGridHyperlinkForCharterBulkClosureComponent,
    ],
    declarations: [
        ExecutionAllocationComponent,
        ExecutionInvoicingComponent,
        ExecutionCharterCreationPageComponent,
        ExecutionCharterListPageComponent,
        ExecutionCharterDetailsComponent,
        ExecutionCharterAssignmentComponent,
        MissingInvoicesDetailsComponent,
        ExecutionInvoicingHomeComponent,
        MainInformationFormComponent,
        ShipmentFormComponent,
        AdditionalInformationFormComponent,
        MemoFormComponent,
        TotalCardComponent,
        ExecutionCharterEditPageComponent,
        ContractAdviceGenerationComponent,
        ContractAdviceGenerationSelectionFormComponent,
        InvoiceSelectionFormComponent,
        ContractSelectionFormComponent,
        CommercialWorkingPageComponent,
        DocumentListComponent,
        DocumentListCardComponent,
        AssignSectionDialogComponent,
        AssignedContractListFormComponent,
        TaxesComponent,
        TotalAmountComponent,
        CommercialPaymentsComponent,
        WarningComponent,
        PricingOptionsComponent,
        ContractSelectionFormComponent,
        CommercialSummaryComponent,
        SelectionFormComponentComponent,
        CommercialValueOfGoodsComponent,
        DeassignSectionDialogComponent,
        ExecutionInvoicingCreateComponent,
        PurchaseGoodsFormComponentComponent,
        SalesGoodsFormComponentComponent,
        QuantityInvoiceFormComponentComponent,
        CostFormComponentComponent,
        CostSelectionComponent,
        InvoiceSelectionComponent,
        ExecutionCashComponent,
        ExecutionCashCreateComponent,
        CashSelectionFormComponent,
        CashDetailsFormComponent,
        CounterpartyFormComponent,
        AdditionalDetailsFormComponent,
        DocumentInformationFormComponent,
        ExecutionCashPaymentListPageComponent,
        ContractSearchComponent,
        CostInvoiceeOptionsComponent,
        CashSummaryFormComponent,
        HeaderComponent,
        CostWorkingPageComponent,
        CostInvoiceSelectionComponent,
        CostDocumentTemplateComponent,
        InvoicingCostTaxesComponent,
        CostPaymentsComponent,
        InvoiceCostSelectedCostComponent,
        PickTransactionComponent,
        InvoiceMatchingComponent,
        SimpleCashPaymentComponent,
        SimpleCashReceiptComponent,
        PaymentFullTransactionComponent,
        PaymentDifferentClientComponent,
        PaymentDifferentCurrencyComponent,
        ReceiptFullTransactionComponent,
        ReceiptDifferentCurrencyComponent,
        CostSummaryComponent,
        BankAccountDialogComponent,
        WashoutFormComponent,
        AdditionalCostsFormComponent,
        CharterMenuBarComponent,
        InvoiceGridForSummaryComponent,
        ReversalFormComponent,
        GoodsCostComponent,
        GoodsCostSelectionComponent,
        GoodsCostInvoiceSelectionComponent,
        GoodsCostContractSearchComponent,
        GoodsCostPricingOptionsComponent,
        GoodsCostWorkingPageComponent,
        WashoutComponent,
        CommercialComponent,
        CostComponent,
        DecimalsComponent,
        WashoutSearchComponent,
        WashoutSelectionComponent,
        WashoutWorkingPageComponent,
        InvoiceTypeSelectionComponent,
        AdditionalCostComponent,
        InvoiceDocumentComponent,
        WashoutPaymentsComponent,
        SelectionComponent,
        WashoutValueOfGoodsComponent,
        CommercialSelectionComponent,
        GoodsCostDetailsComponent,
        GoodsCostValueOfGoodsComponent,
        GoodsCostAdditionalCostComponent,
        GoodsCostTaxGoodsComponent,
        GoodsCostTaxCostComponent,
        GoodsCostPaymentsComponent,
        GoodsCostTotalComponent,
        GoodsCostSelectionCostComponent,
        GoodsCostContractsCostComponent,
        TaxGoodsComponent,
        TaxCostsComponent,
        ReversalComponent,
        ReversalSelectionComponent,
        ReversalInvoiceSelectionComponent,
        DocumentTypeComponent,
        DocumentSearchComponent,
        WashoutSummaryComponent,
        CurrencyInformationCardComponent,
        GoodsCostSummaryComponent,
        ReversalSummaryComponent,
        InvoicingSummaryComponent,
        WashoutTotalComponent,
        PaymentOrderTemplateSelectionCardComponent,
        ExecutionCharterAllocationDeallocationComponent,
        PurchaseAllocationComponentComponent,
        SaleAllocationComponentComponent,
        QuantityAllocationComponentComponent,
        DeallocationComponentComponent,
        ContractDeallocationDialogComponent,
        InvoicingBaseFormComponent,
        CharterPnlReportComponent,
        CharterReportComponent,
        DocumentUploadDialogBoxComponent,
        DocumentTemplateBaseComponent,
        BankInformationComponent,
        CashWarningDialogComponentComponent,
        DocumentTemplateComponent,
        ReversalDocumentTemplateComponent,
        ReassignContractAgGridComponent,
        ReassignSectionDialogComponent,
        ApportionDialogComponent,
        ExecutionCharterGroupAmendmentsComponent,
        CharterBulkClosureComponent,
        ExecutionCharterGroupFunctionComponent,
        ExecutionCharterBulkClosureFunctionComponent,
        CharterSelectionBulkClosureComponent,
        CharterBulkClosureMatrixComponent,
        CharterBulkClosureSummaryComponent,
        AgGridCharterStatusForCharterBulkClosureComponent,
        AgGridHyperlinkForCharterBulkClosureComponent,
        AddCostComponent,
        AddCostTaxComponent,
        AddCostTotalComponent,
        ExecutionCashReceiptListPageComponent,
        ContractTemplateSelecionComponent,
        TemplatesSidenavSelectorComponent,
        ContractTemplateListComponent,
    ],
    providers: [CustomDateAdapter,
        { provide: MAT_DATE_LOCALE, useValue: 'en' },
        { provide: DateAdapter, useClass: CustomDateAdapter },
        { provide: MAT_DATE_FORMATS, useValue: ATLAS_DATE_FORMATS },
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],

})
export class ExecutionModule { }
