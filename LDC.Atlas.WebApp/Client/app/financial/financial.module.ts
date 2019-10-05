import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DateAdapter, MatButtonModule, MatCardModule, MatDialogModule, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { RouterModule } from '@angular/router';
import { AgGridModule } from 'ag-grid-angular';
import { TextMaskModule } from 'angular2-text-mask';
import { AgGridAccrualNumberComponent } from '../shared/components/ag-grid-accrual-number/ag-grid-accrual-number.component';
import { AgGridContextualSearchComponent } from '../shared/components/ag-grid/contextual-search/ag-grid-contextual-search.component';
import { MasterdataInputComponent } from '../shared/components/form-components/masterdata/masterdata-input/masterdata-input.component';
import { MaterialModule } from '../shared/material.module';
import { ATLAS_DATE_FORMATS, SharedModule } from '../shared/shared.module';
import { CashMatchingDialogComponent } from './components/cash-matching/cash-matching-dialog/cash-matching-dialog/cash-matching-dialog.component';
import { DeleteMatchingDialogComponent } from './components/cash-matching/cash-matching-dialog/delete-matching-dialog/delete-matching-dialog.component';
import { DocumentDateDialogComponent } from './components/cash-matching/cash-matching-dialog/document-date-dialog/document-date-dialog.component';
import { PaymentDocumentDateDialogComponent } from './components/cash-matching/cash-matching-dialog/payment-document-date-dialog/payment-document-date-dialog.component';
import { CashMatchingHomeComponent } from './components/cash-matching/cash-matching-home/cash-matching-home.component';
import { CreateMatchFlagComponent } from './components/cash-matching/create-match-flag/create-match-flag.component';
import { DeleteMatchFlagComponent } from './components/cash-matching/delete-match-flag/delete-match-flag.component';
import { AccountingClosureComponent } from './components/cut-off/close-month/cards/accounting-closure/accounting-closure.component';
import { OperationsClosureComponent } from './components/cut-off/close-month/cards/operations-closure/operations-closure.component';
import { CloseMonthComponent } from './components/cut-off/close-month/close-month.component';
import { CloseMonthEditDialogComponent } from './components/cut-off/close-month/dialog-boxes/close-month-edit-dialog/close-month-edit-dialog.component';
import { CloseMonthWarningDialogComponent } from './components/cut-off/close-month/dialog-boxes/close-month-warning-dialog/close-month-warning-dialog.component';
import { FreezeGridComponent } from './components/cut-off/freeze/cards/grid/freeze-grid.component';
import { FreezeHeaderFilterComponent } from './components/cut-off/freeze/cards/header-filter/freeze-header-filter.component';
import { FreezeHeaderComponent } from './components/cut-off/freeze/cards/header/freeze-header.component';
import { FreezeComponent } from './components/cut-off/freeze/freeze.component';
import { FreezeRecalculateComponent } from './components/cut-off/freeze/recalculate/freeze-recalculate.component';
import { EndOfMonthSelectionComponent } from './components/cut-off/generate-end-of-month/cards/end-of-month-selection/end-of-month-selection.component';
import { AssociatedClientDropdownComponent } from './components/cut-off/generate-end-of-month/generate-end-of-month-summary/associated-client-dropdown/associated-client-dropdown.component';
import { CharterDropdownComponent } from './components/cut-off/generate-end-of-month/generate-end-of-month-summary/charter-dropdown/charter-dropdown.component';
import { CostTypeDropdownComponent } from './components/cut-off/generate-end-of-month/generate-end-of-month-summary/cost-type-dropdown/cost-type-dropdown.component';
import { DepartmentDropdownComponent } from './components/cut-off/generate-end-of-month/generate-end-of-month-summary/department-dropdown/department-dropdown.component';
import { GenerateEndOfMonthSummaryComponent } from './components/cut-off/generate-end-of-month/generate-end-of-month-summary/generate-end-of-month-summary.component';
import { GenerateEndOfMonthTabGroupComponent } from './components/cut-off/generate-end-of-month/generate-end-of-month-summary/generate-end-of-month-tab-group/generate-end-of-month-tab-group.component';
import { DetailsTabComponent } from './components/cut-off/generate-end-of-month/generate-end-of-month-summary/tabs/details-tab/details-tab.component';
import { DetailTabFxDealMonthEndComponent } from './components/cut-off/generate-end-of-month/generate-end-of-month-summary/tabs/details-tab/fx-deal-details-month-end/fx-deal-month-end.component';
import { FxDealMonthEndSummaryComponent } from './components/cut-off/generate-end-of-month/generate-end-of-month-summary/tabs/fx-deal-month-end-summary/fx-deal-month-end-summary.component';
import { OverviewTabComponent } from './components/cut-off/generate-end-of-month/generate-end-of-month-summary/tabs/overview-tab/overview-tab.component';
import { PostingTabFxDealMonthEndComponent } from './components/cut-off/generate-end-of-month/generate-end-of-month-summary/tabs/postings-tab/fx-deal-postings-month-end/fx-deal-month-end.component';
import { PostingsTabComponent } from './components/cut-off/generate-end-of-month/generate-end-of-month-summary/tabs/postings-tab/postings-tab.component';
import { GenerateEndOfMonthComponent } from './components/cut-off/generate-end-of-month/generate-end-of-month.component';
import { GenerateEndOfYearComponent } from './components/cut-off/generate-end-of-year/generate-end-of-year.component';
import { MarketDataTabGroupComponent } from './components/foreign-exchange/market-data-tab-group/market-data-tab-group.component';
import { ForeignExchangeRatesGridComponent } from './components/foreign-exchange/rates/cards/grid/foreign-exchange-rates-grid.component';
import { ForeignExchangeRatesSelectTypesComponent } from './components/foreign-exchange/rates/cards/select-types/foreign-exchange-rates-select-types.component';
import { ForeignExchangeRatesComponent } from './components/foreign-exchange/rates/foreign-exchange-rates.component';
import { WarningErrorMsgDialogComponent } from './components/foreign-exchange/warning-error-msg-dialog/warning-error-msg-dialog.component';
import { HomeComponent } from './components/home/home.component';
import { AccountingErrorManagementComponent } from './components/interface/accounting-error-management/accounting-error-management.component';
import { FunctionalErrorsComponent } from './components/interface/functional-errors/functional-errors.component';
import { TechnicalErrorsComponent } from './components/interface/technical-errors/technical-errors.component';
import { AccountingCreationComponent } from './components/posting-process/accounting-creation/accounting-creation.component';
import { AccountingEditBaseComponent } from './components/posting-process/accounting-edit-base/accounting-edit-base.component';
import { AccountingEditSummaryComponent } from './components/posting-process/accounting-edit/accounting-edit-summary/accounting-edit-summary.component';
import { AccountingEditComponent } from './components/posting-process/accounting-edit/accounting-edit.component';
import { AccountingEntriesComponent } from './components/posting-process/accounting-entries-component/accounting-entries-component.component';
import { ManualJournalAccrualViewComponent } from './components/posting-process/accounting-entries-component/manual-journal-accrual-view/manual-journal-accrual-view.component';
import { AccountingTabGroupComponent } from './components/posting-process/accounting-tab-group/accounting-tab-group.component';
import { AuthorizePostingDialogComponent } from './components/posting-process/authorize-posting-dialog/authorize-posting-dialog.component';
import { AccountingDocumentInformationComponent } from './components/posting-process/posting-management/accounting-document-information-component/accounting-document-information-component.component';
import { PostingManagementComponent } from './components/posting-process/posting-management/posting-management.component';
import { ReverseDocumentCreateComponent } from './components/posting-process/reverse-document/reverse-document-create/reverse-document-create.component';
import { ReverseDocumentSummaryComponent } from './components/posting-process/reverse-document/reverse-document-summary/reverse-document-summary.component';
import { ReverseDocumentComponent } from './components/posting-process/reverse-document/reverse-document.component';
import { FinancialTabGroupComponent } from './components/tab-group/financial-tab-group.component';
import { FinancialRoutingModule } from './financial.route';
import { DealtCurrencyDropdownComponent } from './components/cut-off/generate-end-of-month/generate-end-of-month-summary/dealt-currency-dropdown/dealt-currency-dropdown.component';
import { SettlementCurrencyDropdownComponent } from './components/cut-off/generate-end-of-month/generate-end-of-month-summary/settlement-currency-dropdown/settlement-currency-dropdown.component';
import { DealNumberDropdownComponent } from './components/cut-off/generate-end-of-month/generate-end-of-month-summary/deal-number-dropdown/deal-number-dropdown.component';

import { AccountingFileUploadDialogBoxComponent } from './components/posting-process/accounting-file-upload/accounting-file-upload-dialog-box/accounting-file-upload-dialog-box.component';
import { AccountingWarningErrorMsgDialogComponent } from './components/posting-process/accounting-creation/accounting-warning-error-msg-dialog/accounting-warning-error-msg-dialog.component';
import { GenerateEndOfYearWarningMessageComponent } from './components/cut-off/generate-end-of-year/cards/generate-end-of-year-warning-message/generate-end-of-year-warning-message.component';

@NgModule({
    imports: [
        CommonModule,
        MaterialModule,
        FinancialRoutingModule,
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
    entryComponents: [
        AccountingDocumentInformationComponent,
        CloseMonthEditDialogComponent,
        CloseMonthWarningDialogComponent,
        AuthorizePostingDialogComponent,
        AccountingFileUploadDialogBoxComponent,
        CashMatchingDialogComponent,
        PaymentDocumentDateDialogComponent,
        DocumentDateDialogComponent,
        DeleteMatchingDialogComponent,
        AgGridContextualSearchComponent,
        AgGridAccrualNumberComponent,
        MasterdataInputComponent,
        AccountingWarningErrorMsgDialogComponent,
        GenerateEndOfYearWarningMessageComponent,

    ],
    declarations: [
        HomeComponent,
        ForeignExchangeRatesComponent,
        ForeignExchangeRatesSelectTypesComponent,
        ForeignExchangeRatesGridComponent,
        FinancialTabGroupComponent,
        FreezeComponent,
        FreezeHeaderComponent,
        FreezeGridComponent,
        PostingManagementComponent,
        AccountingEntriesComponent,
        AccountingTabGroupComponent,
        AccountingCreationComponent,
        CloseMonthComponent,
        OperationsClosureComponent,
        AccountingClosureComponent,
        AccountingDocumentInformationComponent,
        CloseMonthEditDialogComponent,
        CloseMonthWarningDialogComponent,
        AuthorizePostingDialogComponent,
        AccountingFileUploadDialogBoxComponent,
        GenerateEndOfMonthComponent,
        EndOfMonthSelectionComponent,
        GenerateEndOfMonthSummaryComponent,
        OverviewTabComponent,
        DetailsTabComponent,
        PostingsTabComponent,
        CashMatchingHomeComponent,
        CreateMatchFlagComponent,
        DeleteMatchFlagComponent,
        CashMatchingDialogComponent,
        DocumentDateDialogComponent,
        GenerateEndOfMonthTabGroupComponent,
        ReverseDocumentComponent,
        ReverseDocumentCreateComponent,
        ReverseDocumentSummaryComponent,
        FreezeRecalculateComponent,
        FreezeHeaderFilterComponent,
        DeleteMatchingDialogComponent,
        DepartmentDropdownComponent,
        CharterDropdownComponent,
        CostTypeDropdownComponent,
        AssociatedClientDropdownComponent,
        AccountingEditComponent,
        AccountingEditSummaryComponent,
        PaymentDocumentDateDialogComponent,
        AccountingErrorManagementComponent,
        FunctionalErrorsComponent,
        TechnicalErrorsComponent,
        ManualJournalAccrualViewComponent,
        MarketDataTabGroupComponent,
        WarningErrorMsgDialogComponent,
        AccountingEditBaseComponent,
        GenerateEndOfYearComponent,
        DetailTabFxDealMonthEndComponent,
        PostingTabFxDealMonthEndComponent,
        FxDealMonthEndSummaryComponent,
        AccountingWarningErrorMsgDialogComponent,
        DealtCurrencyDropdownComponent,
        SettlementCurrencyDropdownComponent,
        DealNumberDropdownComponent,
        GenerateEndOfYearWarningMessageComponent,
    ],
    providers: [
        { provide: MAT_DATE_LOCALE, useValue: 'en' },
        { provide: DateAdapter, useClass: MomentDateAdapter },
        { provide: MAT_DATE_FORMATS, useValue: ATLAS_DATE_FORMATS },
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class FinancialModule { }
