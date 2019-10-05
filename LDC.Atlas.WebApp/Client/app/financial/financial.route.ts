import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WarningErrorMsgDialogComponent } from '../financial/components/foreign-exchange/warning-error-msg-dialog/warning-error-msg-dialog.component';
import { MasterDataProps } from '../shared/entities/masterdata-props.entity';
import { CanDeactivateGuard } from '../shared/guards/can-deactivate-guard.service';
import { SecurityGuard } from '../shared/guards/security.guard';
import { CompanyDateResolver } from '../shared/resolvers/company-date.resolver';
import { FormConfigurationResolver } from '../shared/resolvers/form-configuration.resolver';
import { MasterDataResolver } from '../shared/resolvers/masterdata.resolver';
import { CreateMatchFlagComponent } from './components/cash-matching/create-match-flag/create-match-flag.component';
import { DeleteMatchFlagComponent } from './components/cash-matching/delete-match-flag/delete-match-flag.component';
import { CloseMonthComponent } from './components/cut-off/close-month/close-month.component';
import { FreezeComponent } from './components/cut-off/freeze/freeze.component';
import { FreezeRecalculateComponent } from './components/cut-off/freeze/recalculate/freeze-recalculate.component';
import { GenerateEndOfMonthSummaryComponent } from './components/cut-off/generate-end-of-month/generate-end-of-month-summary/generate-end-of-month-summary.component';
import { FxDealMonthEndSummaryComponent } from './components/cut-off/generate-end-of-month/generate-end-of-month-summary/tabs/fx-deal-month-end-summary/fx-deal-month-end-summary.component';
import { GenerateEndOfMonthComponent } from './components/cut-off/generate-end-of-month/generate-end-of-month.component';
import { GenerateEndOfYearComponent } from './components/cut-off/generate-end-of-year/generate-end-of-year.component';
import { ForeignExchangeRatesComponent } from './components/foreign-exchange/rates/foreign-exchange-rates.component';
import * as Financial from './components/home/home.component';
import { AccountingErrorManagementComponent } from './components/interface/accounting-error-management/accounting-error-management.component';
import { AccountingCreationComponent } from './components/posting-process/accounting-creation/accounting-creation.component';
import { AccountingEditSummaryComponent } from './components/posting-process/accounting-edit/accounting-edit-summary/accounting-edit-summary.component';
import { AccountingEditComponent } from './components/posting-process/accounting-edit/accounting-edit.component';
import { AccountingEntriesComponent } from './components/posting-process/accounting-entries-component/accounting-entries-component.component';
import { ManualJournalAccrualViewComponent } from './components/posting-process/accounting-entries-component/manual-journal-accrual-view/manual-journal-accrual-view.component';
import { AccountingDocumentInformationComponent } from './components/posting-process/posting-management/accounting-document-information-component/accounting-document-information-component.component';
import { PostingManagementComponent } from './components/posting-process/posting-management/posting-management.component';
import { ReverseDocumentSummaryComponent } from './components/posting-process/reverse-document/reverse-document-summary/reverse-document-summary.component';
import { ReverseDocumentComponent } from './components/posting-process/reverse-document/reverse-document.component';
export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'home',
    },
    {
        path: 'home',
        component: Financial.HomeComponent,
        canActivate: [SecurityGuard],
        resolve: {
            companyDate: CompanyDateResolver,
        },
    },
    {
        path: 'accounting/entries',
        component: AccountingEntriesComponent,
        canActivate: [SecurityGuard],
        data:
        {
            animation: 'AccountingEntries',
            title: 'Financials', isHomePage: true, privilegeLevel1Name: 'Financials',
        },
        resolve: {
            companyDate: CompanyDateResolver,
        },
    },
    {
        path: 'accounting/entries/:invoiceReference',
        component: AccountingEntriesComponent,
        canActivate: [SecurityGuard],
        data:
        {
            animation: 'AccountingEntries',
            title: 'Financials', isHomePage: false, privilegeLevel1Name: 'Financials',
        },
        resolve: {
            companyDate: CompanyDateResolver,
        },
    },
    {
        path: 'fx/rates',
        component: ForeignExchangeRatesComponent,
        canActivate: [SecurityGuard],
        data:
        {
            animation: 'ForeignExchangeRates',
            title: 'Financials', isHomePage: true, privilegeLevel1Name: 'Financials',
            authorizations: [
                {
                    privilegeName: 'Financials',
                    permission: 1,
                    parentLevelOne: 'MarketData',
                    parentLevelTwo: null,
                },
            ],
        },
        resolve: {
            companyDate: CompanyDateResolver,
        },
    },
    {
        path: 'cut-off/close-month',
        component: CloseMonthComponent,
        canActivate: [SecurityGuard],
        data:
        {
            animation: 'CloseMonth',
            title: 'Close Month',
            isHomePage: false,
            privilegeLevel1Name: null,
        },
        resolve: {
            companyDate: CompanyDateResolver,
        },
    },
    {
        path: 'cut-off/generate-end-of-month',
        component: GenerateEndOfMonthComponent,
        canActivate: [SecurityGuard],
        data:
        {
            animation: 'GenerateEndOfMonth',
            title: 'Generate End of Month',
            isHomePage: false,
            privilegeLevel1Name: null,
            masterdataList: [
                MasterDataProps.MonthEndReportType,
            ],
        },
        resolve: {
            masterdata: MasterDataResolver,
            companyDate: CompanyDateResolver,
        },
    },
    {
        path: 'cut-off/generate-end-of-year',
        component: GenerateEndOfYearComponent,
        canActivate: [SecurityGuard],
        data:
        {
            animation: 'GenerateEndOfYear',
            title: 'Generate End of Year',
            isHomePage: false,
            privilegeLevel1Name: null,
            masterdataList: [
                MasterDataProps.MonthEndReportType,
                MasterDataProps.NominalAccounts,
                MasterDataProps.Departments,
            ],
        },
        resolve: {
            masterdata: MasterDataResolver,
            companyDate: CompanyDateResolver,
        },
    },
    {
        path: 'cut-off/generate-end-of-month/summary',
        component: GenerateEndOfMonthSummaryComponent,
        canActivate: [SecurityGuard],
        resolve: {
            companyDate: CompanyDateResolver,
        },
    },
    {
        path: 'cut-off/freeze',
        component: FreezeComponent,
        canActivate: [SecurityGuard],
        data:
        {
            animation: 'FreezeView',
            title: 'View frozen database', isHomePage: false, privilegeLevel1Name: null,
            isNew: false,
            authorizations: [
                {
                    privilegeName: 'FrozenDatabase',
                    permission: 2,
                    parentLevelOne: 'CutOff',
                    parentLevelTwo: 'Financials',
                },
            ],
        },
        resolve: {
            companyDate: CompanyDateResolver,
        },
    },
    {
        path: 'cut-off/freeze/new',
        component: FreezeComponent,
        canActivate: [SecurityGuard],
        data:
        {
            animation: 'Freeze',
            title: 'Financials', isHomePage: true, privilegeLevel1Name: 'Financials',
            isNew: true,
            authorizations: [
                {
                    privilegeName: 'CutOff',
                    permission: 1,
                    parentLevelOne: 'Financials',
                },
            ],
        },
        resolve: {
            companyDate: CompanyDateResolver,
        },
    },
    {
        path: 'cut-off/freeze/recalculate',
        component: FreezeRecalculateComponent,
        canActivate: [SecurityGuard],
        data:
        {
            animation: 'Freeze',
            title: 'Financials', isHomePage: true, icon: 'Financials',
            authorizations: [
                {
                    privilegeName: 'RecalculateFrozenDatabase',
                    permission: 2,
                    parentLevelOne: 'CutOff',
                    parentLevelTwo: 'Financials',
                },
            ],
        },
        resolve: {
            companyDate: CompanyDateResolver,
        },
    },
    {
        path: 'posting/management',
        component: PostingManagementComponent,
        canActivate: [SecurityGuard],
        canDeactivate: [CanDeactivateGuard],
        data:
        {
            animation: 'PostingmanagementView',
            title: 'Posting Management', isHomePage: false, privilegeLevel1Name: null,
            authorizations: [
                {
                    privilegeName: 'POSTINGMGT',
                    permission: 1,
                    parentLevelOne: 'Financials',
                    privilegeParentLevelTwo: null,
                },
            ],
            masterdataList: [
                MasterDataProps.Departments,
            ],
        },
        resolve: {
            masterdata: MasterDataResolver,
            companyDate: CompanyDateResolver,
        },
    },
    {
        path: 'reverse/document',
        component: ReverseDocumentComponent,
        canActivate: [SecurityGuard],
        canDeactivate: [CanDeactivateGuard],
        data:
        {
            animation: 'reverseDocument',
            formId: 'reverseDocument',
            title: 'Reverse Document', isHomePage: false, icon: '',
            authorizations: [
                {
                    privilegeName: 'ReverseDocument',
                    permission: 2,
                    parentLevelOne: 'Financials',
                    privilegeParentLevelTwo: 'AccountingEntries',
                },
            ],
            masterdataList: [
                MasterDataProps.Departments,
                MasterDataProps.Counterparties,
                MasterDataProps.Currencies,
                MasterDataProps.CostTypes,
                MasterDataProps.Commodities,
                MasterDataProps.PaymentTerms,
                MasterDataProps.Vats,
                MasterDataProps.AccountLineType,
            ],
        },
        resolve: {
            masterdata: MasterDataResolver,
            formConfiguration: FormConfigurationResolver,
            companyDate: CompanyDateResolver,
        },
    },
    {
        path: 'create/matching',
        component: CreateMatchFlagComponent,
        canActivate: [SecurityGuard],
        canDeactivate: [CanDeactivateGuard],
        data:
        {
            animation: 'createMatching',
            formId: 'cashMatching',
            title: 'Create Match Flag', isHomePage: false, privilegeLevel1Name: null,
            masterdataList: [
                MasterDataProps.Departments,
                MasterDataProps.Counterparties,
                MasterDataProps.Currencies,
                MasterDataProps.Companies,
            ],
        },
        resolve: {
            masterdata: MasterDataResolver,
            formConfiguration: FormConfigurationResolver,
            companyDate: CompanyDateResolver,
        },
    },
    {
        path: 'delete/matching',
        component: DeleteMatchFlagComponent,
        canActivate: [SecurityGuard],
        canDeactivate: [CanDeactivateGuard],
        data:
        {
            animation: 'cashmatching',
            formId: 'cashMatching',
            title: 'Delete Match Flag', isHomePage: false, privilegeLevel1Name: null,
            masterdataList: [
                MasterDataProps.Departments,
                MasterDataProps.Counterparties,
                MasterDataProps.Currencies,
                MasterDataProps.Companies,
            ],
        },
        resolve: {
            masterdata: MasterDataResolver,
            formConfiguration: FormConfigurationResolver,
            companyDate: CompanyDateResolver,
        },
    },
    {
        path: 'posting/accountingdocument/viewedit/:accountingId',
        component: AccountingDocumentInformationComponent,
        canActivate: [SecurityGuard],
        canDeactivate: [CanDeactivateGuard],
        data:
        {
            animation: 'AccountDocumentView',
            title: 'Accounting Document', isHomePage: false, privilegeLevel1Name: null,
            authorizations: [
                {
                    privilegeName: 'AccountingEntries',
                    permission: 1,
                    parentLevelOne: 'Financials',
                    privilegeParentLevelTwo: null,
                },
            ],
            masterdataList: [
                MasterDataProps.Departments,
                MasterDataProps.Currencies,
                MasterDataProps.CostTypes,
                MasterDataProps.Vats,
                MasterDataProps.Commodities,
                MasterDataProps.PaymentTerms,
                MasterDataProps.Counterparties,
                MasterDataProps.Commodities,
                MasterDataProps.NominalAccounts,
                MasterDataProps.AccountLineType,
                MasterDataProps.PaymentTerms,
                MasterDataProps.Vats,
                MasterDataProps.Province,
            ],
        },
        resolve: {
            masterdata: MasterDataResolver,
            companyDate: CompanyDateResolver,
        },
    },
    {
        path: 'accounting/entry/new',
        component: AccountingCreationComponent,
        canActivate: [SecurityGuard],
        canDeactivate: [CanDeactivateGuard],
        data:
        {
            animation: 'CreateEntries',
            title: 'Create document', isHomePage: false, privilegeLevel1Name: null,
            authorizations: [
                {
                    privilegeName: 'CreateEditDocument',
                    permission: 2,
                    parentLevelOne: 'Financials',
                    privilegeParentLevelTwo: 'AccountingEntries',
                },
            ],
            masterdataList: [
                MasterDataProps.Currencies,
                MasterDataProps.Departments,
                MasterDataProps.Counterparties,
                MasterDataProps.CostTypes,
                MasterDataProps.Commodities,
                MasterDataProps.NominalAccounts,
                MasterDataProps.AccountLineType,
                MasterDataProps.Province,
                MasterDataProps.Branches
            ],
        },
        resolve: {
            masterdata: MasterDataResolver,
            companyDate: CompanyDateResolver,
        },
    },

    {
        path: 'edit/document/summary',
        component: AccountingEditSummaryComponent,
        canActivate: [SecurityGuard],
        data:
        {
            animation: 'editDocumentSummary',
            formId: 'editDocumentSummary',
            title: 'Edit Document Summary', isHomePage: false, icon: '',
            masterdataList: [
                MasterDataProps.Departments,
                MasterDataProps.Counterparties,
                MasterDataProps.Currencies,
                MasterDataProps.CostTypes,
                MasterDataProps.Commodities,
                MasterDataProps.NominalAccounts,
                MasterDataProps.PaymentTerms,
                MasterDataProps.Vats,
            ],
            authorizations: [
                {
                    privilegeName: 'EditAccountingEntries',
                    permission: 2,
                    parentLevelOne: 'Financials',
                    privilegeParentLevelTwo: 'AccountingEntries',
                },
            ],
        },
        resolve: {
            masterdata: MasterDataResolver,
            formConfiguration: FormConfigurationResolver,
            companyDate: CompanyDateResolver,
        },
    },

    {
        path: 'edit/document/:accountingId',
        component: AccountingEditComponent,
        canActivate: [SecurityGuard],
        canDeactivate: [CanDeactivateGuard],
        data:
        {
            animation: 'editDocument',
            title: 'Edit Document', isHomePage: false, privilegeLevel1Name: null,
            masterdataList: [
                MasterDataProps.Departments,
                MasterDataProps.Currencies,
                MasterDataProps.CostTypes,
                MasterDataProps.Vats,
                MasterDataProps.Commodities,
                MasterDataProps.PaymentTerms,
                MasterDataProps.Counterparties,
                MasterDataProps.Commodities,
                MasterDataProps.NominalAccounts,
                MasterDataProps.AccountLineType,
                MasterDataProps.PaymentTerms,
                MasterDataProps.Vats,
            ],
        },
        resolve: {
            masterdata: MasterDataResolver,
            companyDate: CompanyDateResolver,
        },
    },

    {
        path: 'financial/fx/rates/',
        component: WarningErrorMsgDialogComponent,
        canActivate: [SecurityGuard],
        data:
        {
            animation: 'WarningErrorMsgDialogComponent',
            title: 'Warning Error Management', isHomePage: false, privilegeLevel1Name: null,
        },
        resolve: {
            companyDate: CompanyDateResolver,
        },
    },

    {
        path: 'accounting/errormanagement',
        component: AccountingErrorManagementComponent,
        canActivate: [SecurityGuard],
        data:
        {
            animation: 'AccountingErrorManagement',
            title: 'Accounting Error Management', isHomePage: false, privilegeLevel1Name: null,
        },
        resolve: {
            companyDate: CompanyDateResolver,
        },
    },
    {
        path: 'accounting/entry/view/:accountingId',
        component: ManualJournalAccrualViewComponent,
        canActivate: [SecurityGuard],
        canDeactivate: [CanDeactivateGuard],
        data:
        {
            animation: 'ManualJournalAccrualView',
            title: 'Manual Journal Accrual View', isHomePage: false, privilegeLevel1Name: null,
            authorizations: [
                {
                    privilegeName: 'AccountingEntries',
                    permission: 1,
                    parentLevelOne: 'Financials',
                    privilegeParentLevelTwo: null,
                },
            ],
            masterdataList: [
                MasterDataProps.Departments,
                MasterDataProps.Currencies,
                MasterDataProps.CostTypes,
                MasterDataProps.Vats,
                MasterDataProps.Commodities,
                MasterDataProps.PaymentTerms,
                MasterDataProps.Counterparties,
                MasterDataProps.Commodities,
                MasterDataProps.NominalAccounts,
                MasterDataProps.AccountLineType,
                MasterDataProps.PaymentTerms,
                MasterDataProps.Vats,
            ],
        },
        resolve: {
            masterdata: MasterDataResolver,
            companyDate: CompanyDateResolver,
        },
    },
    {
        path: 'reverse/document/summary/:transactionDocumentId',
        component: ReverseDocumentSummaryComponent,
        canActivate: [SecurityGuard],
        canDeactivate: [CanDeactivateGuard],
        data: {
            animation: 'reverseDocument',
            title: 'Reverse Summary', isHomePage: false, privilegeLevel1Name: null,
            formId: 'ReverseSummary',
            masterdataList: [
                MasterDataProps.Departments,
                MasterDataProps.Counterparties,
                MasterDataProps.Currencies,
                MasterDataProps.CostTypes,
                MasterDataProps.Commodities,
                MasterDataProps.PaymentTerms,
                MasterDataProps.Vats,
                MasterDataProps.AccountLineType,
            ],
            authorizations: [
                {
                    privilegeName: 'ReverseDocument',
                    permission: 2,
                    parentLevelOne: 'Financials',
                    privilegeParentLevelTwo: 'AccountingEntries',
                },
            ],
        },
        resolve: {
            masterdata: MasterDataResolver,
            formConfiguration: FormConfigurationResolver,
            companyDate: CompanyDateResolver,
        },
    },
    {
        path: 'cut-off/fx-deal-generate-end-of-month/summary',
        component: FxDealMonthEndSummaryComponent,
        canActivate: [SecurityGuard],
        resolve: {
            companyDate: CompanyDateResolver,
        },
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: [],
})
export class FinancialRoutingModule { }
