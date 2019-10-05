import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MissingInvoicesDetailsComponent } from '../home/execution-dashboard/missing-invoices-details/missing-invoices-details.component';
import { MasterDataProps } from '../shared/entities/masterdata-props.entity';
import { PermissionLevels } from '../shared/enums/permission-level.enum';
import { CanDeactivateGuard } from '../shared/guards/can-deactivate-guard.service';
import { SecurityGuard } from '../shared/guards/security.guard';
import { CompanyDateResolver } from '../shared/resolvers/company-date.resolver';
import { FormConfigurationResolver } from '../shared/resolvers/form-configuration.resolver';
import { MasterDataResolver } from '../shared/resolvers/masterdata.resolver';
import { ContractAdviceGenerationComponent } from './document/contract-advice-generation/contract-advice-generation.component';
import { DocumentListComponent } from './document/list/document-list.component';
import { ExecutionAllocationComponent } from './execution-allocation/execution-allocation.component';
import { CashSummaryFormComponent } from './execution-cash/execution-cash-create/cash-summary/cash-summary.component';
import { ExecutionCashCreateComponent } from './execution-cash/execution-cash-create/execution-cash-create.component';
import { ExecutionCashComponent } from './execution-cash/execution-cash.component';
import { ExecutionCharterAllocationDeallocationComponent } from './execution-charter/execution-charter-allocation-deallocation/execution-charter-allocation-deallocation.component';
import { ExecutionCharterAssignmentComponent } from './execution-charter/execution-charter-assignment/execution-charter-assignment.component';
import { ExecutionCharterCreationPageComponent } from './execution-charter/execution-charter-creation-page/execution-charter-creation-page.component';
import { ExecutionCharterDetailsComponent } from './execution-charter/execution-charter-details/execution-charter-details.component';
import { ExecutionCharterEditPageComponent } from './execution-charter/execution-charter-edit-page/execution-charter-edit-page.component';
import { ExecutionCharterListPageComponent } from './execution-charter/execution-charter-list-page/execution-charter-list-page.component';
import { ExecutionCharterGroupAmendmentsComponent } from './execution-charter/group-amendments/execution-charter-group-amendments.component';
import { ExecutionCharterGroupFunctionComponent } from './execution-charter/group-function/execution-charter-group-function.component';
import { ExecutionInvoicingCreateComponent } from './execution-invoicing-create/execution-invoicing-create.component';
import { ExecutionInvoicingHomeComponent } from './execution-invoicing-home/execution-invoicing-home.component';
import { CommercialPaymentsComponent } from './execution-invoicing/commercial/components/working-page/components/payments-component/payments-component.component';
import { ExecutionInvoicingComponent } from './execution-invoicing/execution-invoicing.component';
import { InvoicingSummaryComponent } from './execution-invoicing/invoicing-summary/invoicing-summary.component';
export const routes: Routes = [
    {
        path: 'invoicing/missinginvoices/dealtype/:dealType',
        component: MissingInvoicesDetailsComponent,
        canActivate: [SecurityGuard],
        data: { animation: 'homeMissingInvoices', title: 'Missing Invoicing', isHomePage: false, privilegeLevel1Name: null },
        resolve: {
            companyDate: CompanyDateResolver,
        },
    },
    {
        path: 'invoicing/missinginvoices',
        component: MissingInvoicesDetailsComponent,
        canActivate: [SecurityGuard],
        data: { animation: 'homeMissingInvoices', title: 'Missing Invoicing', isHomePage: false, privilegeLevel1Name: null },
        resolve: {
            companyDate: CompanyDateResolver,
        },
    },
    {
        path: 'cash',
        component: ExecutionCashComponent,
        canActivate: [SecurityGuard],
        data: {
            animation: 'cashHomePage', title: 'Cash', isHomePage: true, privilegeLevel1Name: 'Cash',
            masterdataList: [
                MasterDataProps.Departments,
            ],
        },
        resolve: {
            formConfiguration: FormConfigurationResolver,
            masterdata: MasterDataResolver,
            companyDate: CompanyDateResolver,
        },
    },
    {
        path: 'cash/new/:cashTypeId',
        component: ExecutionCashCreateComponent,
        canActivate: [SecurityGuard],
        canDeactivate: [CanDeactivateGuard],
        data: {
            animation: 'cashCreatePage',
            title: 'Cash',
            isHomePage: true,
            privilegeLevel1Name: 'Cash',
            formId: 'cashCreatePage',
            masterdataWithoutCompanyList: [
                MasterDataProps.FxRates,
            ],
            masterdataList: [
                MasterDataProps.Counterparties,
                MasterDataProps.NominalAccounts,
                MasterDataProps.Departments,
                MasterDataProps.Currencies,
                MasterDataProps.CostTypes,
                MasterDataProps.CashTypes,
                MasterDataProps.PaymentTerms,
                MasterDataProps.Countries,
                MasterDataProps.BankTypes,
                MasterDataProps.BankAccountStatuses,
            ],
        },
        resolve: {
            formConfiguration: FormConfigurationResolver,
            masterdata: MasterDataResolver,
            companyDate: CompanyDateResolver,
        },
    },

    {
        path: 'allocation/:pricingMethod/:sectionId',
        component: ExecutionAllocationComponent,
        canActivate: [SecurityGuard],
        data: {
            animation: 'executionAllocate',
            title: 'Trade Allocation', isHomePage: false, privilegeLevel1Name: null,
            authorizations: [
                {
                    privilegeName: 'Allocate',
                    permission: 2,
                    parentLevelOne: 'Trades',
                    parentLevelTwo: 'Physicals',
                },

            ],
        },
        resolve: {
            companyDate: CompanyDateResolver,
        },
    },
    {
        path: 'invoicing/home',
        component: ExecutionInvoicingHomeComponent,
        canActivate: [SecurityGuard],
        data: {
            animation: 'executionInvoicingHome',
            title: 'Invoices',
            isHomePage: true,
            privilegeLevel1Name: 'Invoices',
            masterdataList: [
                MasterDataProps.InvoiceTypes,
                MasterDataProps.Counterparties,
            ],
            authorizations: [
                {
                    privilegeName: 'Invoices',
                    permission: PermissionLevels.Read,
                },
            ],
        },
        resolve: {
            masterdata: MasterDataResolver,
            companyDate: CompanyDateResolver,
        },
    },
    {
        path: 'invoicing/new',
        component: ExecutionInvoicingCreateComponent,
        canActivate: [SecurityGuard],
        canDeactivate: [CanDeactivateGuard],
        data: {
            animation: 'executionInvoicing',
            title: 'New Invoice', isHomePage: false, privilegeLevel1Name: null,
            formId: 'InvoiceCreation',
            masterdataList: [
                MasterDataProps.InvoiceTypes,
                MasterDataProps.PricingOptions,
                MasterDataProps.PaymentTerms,
                MasterDataProps.NominalAccounts,
            ],
            authorizations: [
                {
                    privilegeName: 'InvoiceCreation',
                    permission: PermissionLevels.Read,
                    parentLevelOne: 'Invoices',
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
        path: 'invoicing/:invoiceTypeId',
        component: ExecutionInvoicingComponent,
        canActivate: [SecurityGuard],
        canDeactivate: [CanDeactivateGuard],
        data: {
            animation: 'executionInvoicing',
            title: 'Invoice Creation', isHomePage: false, privilegeLevel1Name: null,
            formId: 'InvoiceCreation',
            masterdataList: [
                MasterDataProps.InvoiceTypes,
                MasterDataProps.PricingOptions,
                MasterDataProps.Counterparties,
                MasterDataProps.CostTypes,
                MasterDataProps.Vats,
                MasterDataProps.PaymentTerms,
                MasterDataProps.NominalAccounts,
                MasterDataProps.WeightUnits,
            ],
            authorizations: [
                {
                    privilegeName: 'InvoiceCreation',
                    permission: PermissionLevels.Read,
                    parentLevelOne: 'Invoices',
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
        path: 'invoicing/summary/:invoiceId',
        component: InvoicingSummaryComponent,
        canActivate: [SecurityGuard],
        data: {
            animation: 'executionInvoicing',
            title: 'Invoice Summary', isHomePage: false, privilegeLevel1Name: null,
            formId: 'InvoiceSummary',
            masterdataList: [
                MasterDataProps.InvoiceTypes,
                MasterDataProps.PricingOptions,
                MasterDataProps.Counterparties,
                MasterDataProps.CostTypes,
                MasterDataProps.Vats,
                MasterDataProps.PaymentTerms,
                MasterDataProps.NominalAccounts,
            ],
            authorizations: [
                {
                    privilegeName: 'InvoiceCreation',
                    permission: PermissionLevels.Read,
                    parentLevelOne: 'Invoices',
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
        path: 'invoicing/contract/:contractId',
        component: ExecutionInvoicingComponent,
        canActivate: [SecurityGuard],
        canDeactivate: [CanDeactivateGuard],
        data: {
            animation: 'executionInvoicing', isHomePage: false, privilegeLevel1Name: null,
            title: 'Contract Invoicing',
        },
        resolve: {
            companyDate: CompanyDateResolver,
        },
    },
    {
        path: 'charter',
        component: ExecutionCharterListPageComponent,
        canActivate: [SecurityGuard],
        data: {
            animation: 'executionCharter',
            title: 'Charter',
            isHomePage: true,
            privilegeLevel1Name: 'Charters',
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
        path: 'charter/new',
        component: ExecutionCharterCreationPageComponent,
        canActivate: [SecurityGuard],
        canDeactivate: [CanDeactivateGuard],
        data: {
            animation: 'executionCharter',
            title: 'New Creation', isHomePage: false, privilegeLevel1Name: null,
            masterdataList: [
                MasterDataProps.Departments,
                MasterDataProps.Ports,
                MasterDataProps.TransportTypes,
                MasterDataProps.Currencies,
                MasterDataProps.WeightUnits,
                MasterDataProps.Vessels,
            ],
            authorizations: [
                {
                    privilegeName: 'ChartersView',
                    permission: 2,
                    parentLevelOne: 'Charters',
                },
            ],
        },
        resolve: {
            masterdata: MasterDataResolver,
            companyDate: CompanyDateResolver,
        },
    },
    {
        path: 'charter/new/:charterId',
        component: ExecutionCharterCreationPageComponent,
        canActivate: [SecurityGuard],
        data: {
            animation: 'executionCharter', title: 'New Charter', isHomePage: false, privilegeLevel1Name: null,
            masterdataList: [
                MasterDataProps.Departments,
                MasterDataProps.Ports,
                MasterDataProps.TransportTypes,
                MasterDataProps.Currencies,
                MasterDataProps.WeightUnits,
                MasterDataProps.Vessels,
            ],
            authorizations: [
                {
                    privilegeName: 'ChartersView',
                    permission: 2,
                    parentLevelOne: 'Charters',
                },
            ],
        },
        resolve: {
            masterdata: MasterDataResolver,
            companyDate: CompanyDateResolver,
        },
    },
    {
        path: 'charter/edit/:charterId',
        component: ExecutionCharterEditPageComponent,
        canActivate: [SecurityGuard],
        canDeactivate: [CanDeactivateGuard],
        data: {
            animation: 'executionCharter', title: 'Edit Charter', isHomePage: false, privilegeLevel1Name: null,
            masterdataList: [
                MasterDataProps.Departments,
                MasterDataProps.Ports,
                MasterDataProps.TransportTypes,
                MasterDataProps.Currencies,
                MasterDataProps.WeightUnits,
                MasterDataProps.Vessels,
                MasterDataProps.PriceUnits,
                MasterDataProps.PaymentTerms,

            ],
            authorizations: [
                {
                    privilegeName: 'ChartersView',
                    permission: 2,
                    parentLevelOne: 'Charters',
                },
            ],
        },

        resolve: {
            masterdata: MasterDataResolver,
            companyDate: CompanyDateResolver,
        },
    },
    {
        path: 'charter/details/:charterId',
        component: ExecutionCharterDetailsComponent,
        canActivate: [SecurityGuard],
        data: {
            animation: 'executionCharter', title: 'Charter', isHomePage: false, privilegeLevel1Name: null,
            masterdataList: [
                MasterDataProps.Departments,
                MasterDataProps.Ports,
                MasterDataProps.TransportTypes,
                MasterDataProps.Currencies,
                MasterDataProps.WeightUnits,
                MasterDataProps.Vessels,
                MasterDataProps.Commodities,
                MasterDataProps.PriceUnits,
                MasterDataProps.PaymentTerms,

            ],
            authorizations: [
                {
                    privilegeName: 'ChartersView',
                    permission: 1,
                    parentLevelOne: 'Charters',
                    // parentLevelTwo: 'ChartersView',
                },
            ],
        },
        resolve: {
            masterdata: MasterDataResolver,
            companyDate: CompanyDateResolver,
        },
    },
    {
        path: 'charter/assignment/:charterId',
        component: ExecutionCharterAssignmentComponent,
        canActivate: [SecurityGuard],
        canDeactivate: [CanDeactivateGuard],
        data: {
            animation: 'executionCharter', isHomePage: false, privilegeLevel1Name: null,
            title: 'Assign contract(s) to charter',
            masterdataList: [
                MasterDataProps.TransportTypes,
                MasterDataProps.Vessels,
                MasterDataProps.Commodities,
                MasterDataProps.WeightUnits,
                MasterDataProps.Departments,
                MasterDataProps.Counterparties,
            ],
            authorizations: [
                {
                    privilegeName: 'ChartersView',
                    permission: 2,
                    parentLevelOne: 'Charters',
                },
            ],
        },
        resolve: {
            masterdata: MasterDataResolver,
            companyDate: CompanyDateResolver,

        },
    },
    {
        path: 'document/list',
        component: DocumentListComponent,
        canActivate: [SecurityGuard],
        data: {
            animation: 'documentList',
            title: 'Document List', isHomePage: true, icon: '',
        },
        resolve: {
            companyDate: CompanyDateResolver,
        },
    },
    {
        path: 'document/list/:entity/:recordId',
        component: DocumentListComponent,
        canActivate: [SecurityGuard],
        data: {
            animation: 'documentList',
            title: 'Document List', isHomePage: false, icon: '',
        },
        resolve: {
            companyDate: CompanyDateResolver,
        },
    },
    {
        path: 'charter/allocateDeallocate/:charterId',
        component: ExecutionCharterAllocationDeallocationComponent,
        canActivate: [SecurityGuard],
        canDeactivate: [CanDeactivateGuard],
        data: {
            animation: 'executionCharter', isHomePage: false, icon: '',
            title: 'Trade Allocation/Deallocation',
        },
        resolve: {
            masterdata: MasterDataResolver,
            companyDate: CompanyDateResolver,

        },
    },
    {
        path: 'document/generation/contractadvice/:recordId',
        component: ContractAdviceGenerationComponent,
        canActivate: [SecurityGuard],
        data: {
            animation: 'documentGeneration',
            title: 'Document Generation', isHomePage: false, privilegeLevel1Name: null,
            authorizations: [
                {
                    privilegeName: 'GenerateContractAdvice',
                    permission: 2,
                    parentLevelOne: 'Trades',
                    parentLevelTwo: 'Physicals',
                },
            ],
            masterdataList: [
                MasterDataProps.Arbitrations,
                MasterDataProps.Commodities,
                MasterDataProps.ContractTerms,
                MasterDataProps.Counterparties,
                MasterDataProps.Departments,
                MasterDataProps.PaymentTerms,
                MasterDataProps.ContractTypes,
                MasterDataProps.ProfitCenters,
            ],
        },
        resolve: {
            companyDate: CompanyDateResolver,
            masterdata: MasterDataResolver,
        },
    },
    {
        path: 'invoicing/:invoiceTypeId',
        component: CommercialPaymentsComponent,
        data: {
            animation: 'executionPaymentTerm',
            title: 'Payment Term', isHomePage: false, privilegeLevel1Name: null,
            paymentTerms: [MasterDataProps.PaymentTerms],
            masterdataList: [
                MasterDataProps.Arbitrations,
                MasterDataProps.Commodities,
                MasterDataProps.ContractTerms,
                MasterDataProps.Counterparties,
                MasterDataProps.Currencies,
                MasterDataProps.Departments,
                MasterDataProps.BusinessSectors,
                MasterDataProps.PaymentTerms,
                MasterDataProps.PeriodTypes,
                MasterDataProps.PositionMonthTypes,
                MasterDataProps.Ports,
                MasterDataProps.PriceUnits,
                MasterDataProps.WeightUnits,
                MasterDataProps.CostTypes,
                MasterDataProps.NominalAccounts,
            ],
        },
        resolve: {
            masterdata: MasterDataResolver,
            formConfiguration: FormConfigurationResolver,
            companyDate: CompanyDateResolver,
        },
    },
    {
        path: 'cash/display/:cashTypeId/:cashId',
        component: CashSummaryFormComponent,
        canActivate: [SecurityGuard],
        canDeactivate: [CanDeactivateGuard],
        data: {
            animation: 'executionCash', title: 'Cash Details',
            formId: 'cashSummaryPage', isHomePage: false, privilegeLevel1Name: null,
            masterdataList: [
                MasterDataProps.Counterparties,
                MasterDataProps.NominalAccounts,
                MasterDataProps.Departments,
                MasterDataProps.Currencies,
                MasterDataProps.CostTypes,
                MasterDataProps.PaymentTerms,
                MasterDataProps.Countries,
                MasterDataProps.BankTypes,
                MasterDataProps.BankAccountStatuses,

            ],

        },
        resolve: {
            formConfiguration: FormConfigurationResolver,
            masterdata: MasterDataResolver,
            companyDate: CompanyDateResolver,
        },
    },
    {
        path: 'cash/edit/:cashTypeId/:cashId',
        component: ExecutionCashCreateComponent,
        canDeactivate: [CanDeactivateGuard],
        data: {
            animation: 'executionCash', title: 'Edit Cash',
            formId: 'cashCreatePage', isHomePage: false, privilegeLevel1Name: null,
            masterdataWithoutCompanyList: [
                MasterDataProps.FxRates,
            ],
            masterdataList: [
                MasterDataProps.Counterparties,
                MasterDataProps.NominalAccounts,
                MasterDataProps.Departments,
                MasterDataProps.Currencies,
                MasterDataProps.CostTypes,
                MasterDataProps.PaymentTerms,
                MasterDataProps.Countries,
                MasterDataProps.BankTypes,
                MasterDataProps.BankAccountStatuses,

            ],
        },
        resolve: {
            masterdata: MasterDataResolver,
            companyDate: CompanyDateResolver,
        },
    },
    {
        path: 'charter/groupfunctions',
        component: ExecutionCharterGroupAmendmentsComponent,
        canActivate: [SecurityGuard],
        canDeactivate: [CanDeactivateGuard],
        data: {
            animation: 'groupFunctions',
            title: 'Group Functions',
            formId: 'GroupFunctions', isHomePage: false, privilegeLevel1Name: null,
            masterdataList: [
            ],

        },
        resolve: {
            masterdata: MasterDataResolver,
            formConfiguration: FormConfigurationResolver,
            companyDate: CompanyDateResolver,
        },
    },
    {
        path: 'charter/bulkActions/:bulkActionTypeId',
        component: ExecutionCharterGroupFunctionComponent,
        canActivate: [SecurityGuard],
        canDeactivate: [CanDeactivateGuard],
        data: {
            animation: 'bulkActions',
            title: 'Bulk Actions',
            isHomePage: false,
            privilegeLevel1Name: null,
            formId: 'GroupFunctions',
            masterdataList: [
                MasterDataProps.Departments,
            ],
        },
        resolve: {
            masterdata: MasterDataResolver,
            formConfiguration: FormConfigurationResolver,
            companyDate: CompanyDateResolver,
        },
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ExecutionRoutingModule { }
