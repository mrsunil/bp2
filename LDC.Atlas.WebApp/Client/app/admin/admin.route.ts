import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MasterDataProps } from '../shared/entities/masterdata-props.entity';
import { CanDeactivateGuard } from '../shared/guards/can-deactivate-guard.service';
import { SecurityGuard } from '../shared/guards/security.guard';
import { CompanyDateResolver } from '../shared/resolvers/company-date.resolver';
import { FormConfigurationResolver } from '../shared/resolvers/form-configuration.resolver';
import { MasterDataResolver } from '../shared/resolvers/masterdata.resolver';
import { CompanyListComponent } from './components/companies/company-list/company-list.component';
import { CompanyManagementComponent } from './components/companies/company-management/company-management.component';
import { CompanySelectionComponent } from './components/companies/copy-company/company-selection/company-selection.component';
import { CopyCompanyComponent } from './components/companies/copy-company/copy-company.component';
import { ConfigurationInterfaceComponent } from './components/global-parameters/configuration-interface/configuration-interface.component';
import { FunctionalObjectDetailsComponent } from './components/global-parameters/functional-objects/details/functional-object-details.component';
import { FunctionalObjectComponent } from './components/global-parameters/functional-objects/functional-object.component';
import { FunctionalObjectsListComponent } from './components/global-parameters/functional-objects/list/functional-objects-list.component';
import { GlobalParametersComponent } from './components/global-parameters/global-parameters.component';
import { ContextualSearchComponent } from './components/global-parameters/grid-configuration/contextual-search/contextual-search.component';
import { ListAndSearchComponent } from './components/global-parameters/grid-configuration/list-search/list-search.component';
import { LockManagementListComponent } from './components/global-parameters/lock-management/list/lock-management-list.component';
import { UserPreferencesComponent } from './components/global-parameters/user-preferences/user-preferences.component';
import * as Admin from './components/home/home.component';
import { InterfaceBuilderDetailsComponent } from './components/operations/interface-builder/details/interface-builder-details.component';
import { InterfaceMonitoringDetailsComponent } from './components/operations/interface-monitoring/interface-monitoring-details/interface-monitoring-details.component';
import { InterfaceMonitoringSummaryComponent } from './components/operations/interface-monitoring/interface-monitoring-summary/interface-monitoring-summary.component';
import { OperationsComponent } from './components/operations/operations.component';
import { ProfilesListComponent } from './components/profiles/profiles-list/profiles-list.component';
import { ProfilesCopyComponent } from './components/profiles/profiles-management/copy/profiles-copy.component';
import { ProfilesManagementComponent } from './components/profiles/profiles-management/profiles-management.component';
import { TemplateManagementComponent } from './components/template-management/template-management.component';
import { UserListComponent } from './components/users/user-list/user-list.component';
import { UserManageComponent } from './components/users/user-manage/user-manage.component';
import { UserSearchComponent } from './components/users/user-search/user-search.component';

export const routes: Routes = [
    {
        path: '',
        component: Admin.HomeComponent,
        canActivate: [SecurityGuard],
    },
    {
        path: 'users',
        component: UserListComponent,
        canActivate: [SecurityGuard],
        data: {
            animation: 'admin', title: 'Users', isHomePage: false, privilegeLevel1Name: null,
            authorizations: [
                {
                    privilegeName: 'Users',
                    permission: 1,
                    parentLevelOne: 'Administration',
                },
            ],
        },
    },
    {
        path: 'users/new',
        component: UserSearchComponent,
        canActivate: [SecurityGuard],
        canDeactivate: [CanDeactivateGuard],
        data: {
            animation: 'admin', title: 'User Creation', isHomePage: false, privilegeLevel1Name: null,
            authorizations: [
                {
                    privilegeName: 'Users',
                    permission: 2,
                    parentLevelOne: 'Administration',
                },
            ],
        },
    },
    {
        path: 'users/new/:userId',
        component: UserManageComponent,
        canActivate: [SecurityGuard],
        canDeactivate: [CanDeactivateGuard],
        data: {
            animation: 'admin', title: 'User Creation', isCreation: true, isHomePage: false, privilegeLevel1Name: null,
            authorizations: [
                {
                    privilegeName: 'Users',
                    permission: 2,
                    parentLevelOne: 'Administration',
                },
            ],
            masterdataList: [
                MasterDataProps.Departments,
                MasterDataProps.Companies,
            ],
        },
        resolve: {
            masterdata: MasterDataResolver,
        },
    },
    {
        path: 'users/edit/:userId',
        component: UserManageComponent,
        canActivate: [SecurityGuard],
        canDeactivate: [CanDeactivateGuard],
        data: {
            animation: 'admin', title: 'User Edition', isCreation: false, isHomePage: false, privilegeLevel1Name: null,
            isUserEdit: true,
            authorizations: [
                {
                    privilegeName: 'Users',
                    permission: 2,
                    parentLevelOne: 'Administration',
                },
            ],
            masterdataList: [
                MasterDataProps.Departments,
                MasterDataProps.Companies,
            ],
        },
        resolve: {
            masterdata: MasterDataResolver,
        },
    },
    {
        path: 'profiles',
        component: ProfilesListComponent,
        canActivate: [SecurityGuard],
        data: {
            animation: 'admin', title: 'Profiles', isHomePage: false, privilegeLevel1Name: null,
            authorizations: [
                {
                    privilegeName: 'Profiles',
                    permission: 1,
                    parentLevelOne: 'Administration',
                },
            ],
        },
    },
    {
        path: 'profiles/new',
        component: ProfilesManagementComponent,
        canActivate: [SecurityGuard],
        canDeactivate: [CanDeactivateGuard],
        data: {
            animation: 'admin', title: 'Profile Creation', isCreation: true, isHomePage: false, privilegeLevel1Name: null,
            authorizations: [
                {
                    privilegeName: 'Profiles',
                    permission: 2,
                    parentLevelOne: 'Administration',
                },
            ],
        },
    },
    {
        path: 'profiles/edit/:profileId',
        component: ProfilesManagementComponent,
        canActivate: [SecurityGuard],
        canDeactivate: [CanDeactivateGuard],
        data: {
            animation: 'admin', title: 'Profile Edition', isCreation: false, isHomePage: false, privilegeLevel1Name: null,
            authorizations: [
                {
                    privilegeName: 'Profiles',
                    permission: 2,
                    parentLevelOne: 'Administration',
                },
            ],
        },
    },
    {
        path: 'profiles/copy/:profileId',
        component: ProfilesCopyComponent,
        canActivate: [SecurityGuard],
        data: {
            animation: 'admin', title: 'Profile Copy', isCreation: true, isHomePage: false, privilegeLevel1Name: null,
            authorizations: [
                {
                    privilegeName: 'Profiles',
                    permission: 2,
                    parentLevelOne: 'Administration',
                },
            ],
        },
    },
    {
        path: 'global-parameters',
        component: GlobalParametersComponent,
        canActivate: [SecurityGuard],
        data: {
            animation: 'global-parameters', title: 'Global Parameters', isHomePage: false, privilegeLevel1Name: null,
            authorizations: [
                {
                    privilegeName: 'GlobalParameters',
                    permission: 1,
                    parentLevelOne: 'Administration',
                },
            ],
        },
    },
    {
        path: 'global-parameters/user-preferences',
        component: UserPreferencesComponent,
        canActivate: [SecurityGuard],
        data: {
            animation: 'false', title: 'User Settings', isHomePage: false, privilegeLevel1Name: null,
            masterdataList: [
                MasterDataProps.LanguagePreference,
                MasterDataProps.DateFormatPreference,
            ],
        },
        resolve: {
            masterdata: MasterDataResolver,
        },
    },
    {
        path: 'global-parameters/functional-object/list',
        component: FunctionalObjectsListComponent,
        canActivate: [SecurityGuard],
        data: {
            animation: 'functional-object-list', title: 'Audit\'s functional objects', isHomePage: false, privilegeLevel1Name: null,
            authorizations: [
                {
                    privilegeName: 'GlobalParameters',
                    permission: 1,
                    parentLevelOne: 'Administration',
                },
            ],
        },
    },
    {
        path: 'global-parameters/functional-object/new',
        component: FunctionalObjectComponent,
        canActivate: [SecurityGuard],
        canDeactivate: [CanDeactivateGuard],
        data: {
            animation: 'functional-object-creation', title: 'New functional object', isHomePage: false, privilegeLevel1Name: null,
            authorizations: [
                {
                    privilegeName: 'CreateFunctionalObject',
                    permission: 2,
                    parentLevelOne: 'Administration',
                    parentLevelTwo: 'GlobalParameters',
                },
            ],
        },
    },
    {
        path: 'global-parameters/functional-object/edit/:functionalObjectId',
        component: FunctionalObjectComponent,
        canActivate: [SecurityGuard],
        canDeactivate: [CanDeactivateGuard],
        data: {
            animation: 'functional-object-creation', title: 'Edit functional object', isHomePage: false, privilegeLevel1Name: null,
            authorizations: [
                {
                    privilegeName: 'CreateFunctionalObject',
                    permission: 2,
                    parentLevelOne: 'Administration',
                    parentLevelTwo: 'GlobalParameters',
                },
            ],
        },
    },
    {
        path: 'global-parameters/functional-object/details/:functionalObjectId',
        component: FunctionalObjectDetailsComponent,
        canActivate: [SecurityGuard],
        canDeactivate: [CanDeactivateGuard],
        data: {
            animation: 'functional-object-details', title: 'Display functional object', isHomePage: false, privilegeLevel1Name: null,
            authorizations: [
                {
                    privilegeName: 'GlobalParameters',
                    permission: 1,
                    parentLevelOne: 'Administration',
                },
            ],
        },
    },
    {
        path: 'global-parameters/configuration-interface',
        component: ConfigurationInterfaceComponent,
        canActivate: [SecurityGuard],
        canDeactivate: [CanDeactivateGuard],
        data: {
            animation: 'configuration-interface', title: 'Interface', isHomePage: false, privilegeLevel1Name: null,
            authorizations: [
                {
                    privilegeName: 'GlobalParameters',
                    permission: 1,
                    parentLevelOne: 'Administration',
                },
            ],
        },
    },
    {
        path: 'global-parameters/lock-management/list',
        component: LockManagementListComponent,
        canActivate: [SecurityGuard],
        data: {
            animation: 'lock-management-list', title: 'Lock Management', isHomePage: false, icon: '',
            authorizations: [
                {
                    privilegeName: 'GlobalParameters',
                    permission: 1,
                    parentLevelOne: 'Administration',
                },
            ],
        },
    },
    {
        path: 'companies',
        component: CompanyListComponent,
        canActivate: [SecurityGuard],
        data: {
            animation: 'admin', title: 'Companies', isHomePage: false, privilegeLevel1Name: null,
            masterdataList: [
                MasterDataProps.Departments,
                MasterDataProps.Companies,
            ],
        },
        resolve: {
            masterdata: MasterDataResolver,
        },
    },
    {
        path: 'company-configuration/display/:companyId',
        component: CompanyManagementComponent,
        canActivate: [SecurityGuard],
        data: {
            animation: 'companyConfigurationDisplay',
            formId: 'admin', title: 'Company Configuration Edition', isHomePage: false, privilegeLevel1Name: null,
            isEdit: false,
            masterdataList: [
                MasterDataProps.Departments,
                MasterDataProps.Companies,
                MasterDataProps.PaymentTerms,
                MasterDataProps.TaxTypes,
                MasterDataProps.Vats,
                MasterDataProps.WeightUnits,
                MasterDataProps.Countries,
                MasterDataProps.Currencies,
                MasterDataProps.Counterparties,
                MasterDataProps.LdcRegion,
                MasterDataProps.CompanyTypes,
                MasterDataProps.CompanyPlatforms,
                MasterDataProps.CompanyCropYearFormats,
                MasterDataProps.NominalAccounts,
                MasterDataProps.CostTypes,
                MasterDataProps.InterfaceType,
                MasterDataProps.TimeZones,
                MasterDataProps.TransactionDocumentType,
                MasterDataProps.Branches,
                MasterDataProps.Province,
                MasterDataProps.PriceUnits,
            ],
            authorizations: [
                {
                    privilegeName: 'Physicals',
                    permission: 1,
                    parentLevelOne: 'Trades',
                },
            ],
        },
        resolve: {
            masterdata: MasterDataResolver,
        },
    },
    {
        path: 'company-configuration/edit/:companyId/:tabIndex',
        component: CompanyManagementComponent,
        canActivate: [SecurityGuard],
        canDeactivate: [CanDeactivateGuard],
        data: {
            animation: 'admin', title: 'Company Configuration Edition',
            isHomePage: false, privilegeLevel1Name: null,
            formId: 'editCompanyConfiguration',
            isEdit: true,
            masterdataList: [
                MasterDataProps.Departments,
                MasterDataProps.Companies,
                MasterDataProps.PaymentTerms,
                MasterDataProps.TaxTypes,
                MasterDataProps.Vats,
                MasterDataProps.WeightUnits,
                MasterDataProps.Countries,
                MasterDataProps.Currencies,
                MasterDataProps.Counterparties,
                MasterDataProps.LdcRegion,
                MasterDataProps.CompanyTypes,
                MasterDataProps.CompanyPlatforms,
                MasterDataProps.Counterparties,
                MasterDataProps.CompanyCropYearFormats,
                MasterDataProps.NominalAccounts,
                MasterDataProps.CostTypes,
                MasterDataProps.InterfaceType,
                MasterDataProps.TimeZones,
                MasterDataProps.TransactionDocumentType,
                MasterDataProps.Branches,
                MasterDataProps.Province,
                MasterDataProps.PriceUnits,
            ],
        },
        resolve: {
            formConfiguration: FormConfigurationResolver,
            masterdata: MasterDataResolver,
            companyDate: CompanyDateResolver,
        },
    },
    {
        path: 'companies/create',
        component: CompanyManagementComponent,
        canActivate: [SecurityGuard],
        canDeactivate: [CanDeactivateGuard],
        data: {
            animation: 'admin', title: 'Create a company',
            isHomePage: false, privilegeLevel1Name: null,
            formId: 'createCompanyConfiguration',
            masterdataList: [
                MasterDataProps.Departments,
                MasterDataProps.Companies,
                MasterDataProps.PaymentTerms,
                MasterDataProps.TaxTypes,
                MasterDataProps.Vats,
                MasterDataProps.WeightUnits,
                MasterDataProps.Countries,
                MasterDataProps.Currencies,
                MasterDataProps.Counterparties,
                MasterDataProps.LdcRegion,
                MasterDataProps.CompanyTypes,
                MasterDataProps.CompanyPlatforms,
                MasterDataProps.CompanyCropYearFormats,
                MasterDataProps.NominalAccounts,
                MasterDataProps.CostTypes,
                MasterDataProps.InterfaceType,
                MasterDataProps.ContractTypes,
                MasterDataProps.TransactionDocumentType,
                MasterDataProps.TimeZones,
                MasterDataProps.Province,
                MasterDataProps.Branches,
                MasterDataProps.TransactionDocumentType,
                MasterDataProps.PriceUnits,
            ],
        },
        resolve: {
            formConfiguration: FormConfigurationResolver,
            masterdata: MasterDataResolver,
            companyDate: CompanyDateResolver,
        },
    },
    {
        path: 'companies/selection',
        component: CompanySelectionComponent,
        canActivate: [SecurityGuard],
        canDeactivate: [CanDeactivateGuard],
        data: {
            animation: 'admin', title: 'Copy Company', isHomePage: false, privilegeLevel1Name: null,
            formId: 'CopyCompany',
        },
        resolve: {
            masterdata: MasterDataResolver,
        },
    },
    {
        path: 'companies/copy/:companyId',
        component: CopyCompanyComponent,
        canActivate: [SecurityGuard],
        canDeactivate: [CanDeactivateGuard],
        data: {
            animation: 'admin',
            title: 'Copy Company',
            isHomePage: false, privilegeLevel1Name: null, isCopy: true,
            masterdataList: [
                MasterDataProps.Departments,
                MasterDataProps.Companies,
                MasterDataProps.PaymentTerms,
                MasterDataProps.TaxTypes,
                MasterDataProps.Vats,
                MasterDataProps.WeightUnits,
                MasterDataProps.Countries,
                MasterDataProps.Currencies,
                MasterDataProps.Counterparties,
                MasterDataProps.LdcRegion,
                MasterDataProps.CompanyTypes,
                MasterDataProps.CompanyPlatforms,
                MasterDataProps.NominalAccounts,
                MasterDataProps.CostTypes,
                MasterDataProps.CompanyCropYearFormats,
                MasterDataProps.InterfaceType,
                MasterDataProps.TimeZones,
                MasterDataProps.TransactionDocumentType,
                MasterDataProps.PriceUnits,
            ],
        },
        resolve: {
            masterdata: MasterDataResolver,
        },
    },
    {
        path: 'global-parameters/grid-configuration/list/display',
        component: ListAndSearchComponent,
        canActivate: [SecurityGuard],
        data: {
            animation: 'grid-configuration-list', title: 'List Configuration', isHomePage: false, icon: '',
            authorizations: [
                {
                    privilegeName: 'GlobalParameters',
                    permission: 1,
                    parentLevelOne: 'Administration',
                },
            ],
        },
    },

    {
        path: 'global-parameters/grid-configuration/list/display/:gridId',
        component: ListAndSearchComponent,
        canActivate: [SecurityGuard],
        data: {
            animation: 'grid-configuration-list', title: 'List Configuration', isHomePage: false, icon: '',
            authorizations: [
                {
                    privilegeName: 'GlobalParameters',
                    permission: 1,
                    parentLevelOne: 'Administration',
                },
            ],
        },
    },

    {
        path: 'global-parameters/grid-configuration/list/edit/:gridId',
        component: ListAndSearchComponent,
        canActivate: [SecurityGuard],
        data: {
            animation: 'grid-configuration-list', title: 'List Configuration', isHomePage: false, icon: '',
            authorizations: [
                {
                    privilegeName: 'GlobalParameters',
                    permission: 1,
                    parentLevelOne: 'Administration',
                },
            ],
        },
    },

    {
        path: 'global-parameters/grid-configuration/contextual/display/:gridId',
        component: ContextualSearchComponent,
        canActivate: [SecurityGuard],
        data: {
            animation: 'grid-configuration-list', title: 'List Configuration', isHomePage: false, icon: '',
            authorizations: [
                {
                    privilegeName: 'GlobalParameters',
                    permission: 1,
                    parentLevelOne: 'Administration',
                },
            ],
        },
    },

    {
        path: 'global-parameters/grid-configuration/contextual/display',
        component: ContextualSearchComponent,
        canActivate: [SecurityGuard],
        data: {
            animation: 'grid-configuration-list', title: 'List Configuration', isHomePage: false, icon: '',
            authorizations: [
                {
                    privilegeName: 'GlobalParameters',
                    permission: 1,
                    parentLevelOne: 'Administration',
                },
            ],
        },
    },

    {
        path: 'global-parameters/grid-configuration/contextual/edit/:gridId',
        component: ContextualSearchComponent,
        canActivate: [SecurityGuard],
        data: {
            animation: 'grid-configuration-list', title: 'List Configuration', isHomePage: false, icon: '',
            authorizations: [
                {
                    privilegeName: 'GlobalParameters',
                    permission: 1,
                    parentLevelOne: 'Administration',
                },
            ],
        },
    },

    {
        path: 'operations',
        component: OperationsComponent,
        canActivate: [SecurityGuard],
        data: {
            animation: 'operations', title: 'Operations', isHomePage: false, privilegeLevel1Name: null,
            authorizations: [
                {
                    privilegeName: 'GlobalParameters',
                    permission: 1,
                    parentLevelOne: 'Administration',
                },
            ],
        },
    },

    {
        path: 'operations/interface-builder/details',
        component: InterfaceBuilderDetailsComponent,
        canActivate: [SecurityGuard],
        data: {
            animation: 'interface-builder-details', title: 'Interface Builder', isHomePage: false, icon: '',
            masterdataList: [
                MasterDataProps.InterfaceType,
                MasterDataProps.InterfaceObjectType,
                MasterDataProps.Companies,
            ],
            authorizations: [
                {
                    privilegeName: 'InterfaceBuilder',
                    permission: 2,
                    parentLevelOne: 'Administration',
                    parentLevelTwo: 'Operations',
                },
            ],
        },
        resolve: {
            masterdata: MasterDataResolver,
        },
    },
    {
        path: 'operations/interface-monitoring',
        component: InterfaceMonitoringSummaryComponent,
        canActivate: [SecurityGuard],
        data: {
            animation: 'interface-monitoring-summary', title: 'Interface Monitoring', isHomePage: false, icon: '',
            masterdataList: [
                MasterDataProps.InterfaceType,
                MasterDataProps.InterfaceStatus,
            ],
            authorizations: [
                {
                    privilegeName: 'InterfaceMonitoring',
                    permission: 2,
                    parentLevelOne: 'Administration',
                    parentLevelTwo: 'Operations',
                },
            ],
        },
        resolve: {
            masterdata: MasterDataResolver,
        },
    },
    {
        path: 'templates-management',
        component: TemplateManagementComponent,
        // canActivate: [SecurityGuard],
        data: {
            animation: 'templates-management', title: 'Template Management', isHomePage: false, privilegeLevel1Name: null,
            masterdataList: [
                MasterDataProps.Departments,
                MasterDataProps.ProfitCenters,
                MasterDataProps.Commodities,
                // TODO GAP 170 : MasterDataProps.ModeOfTransport,
                MasterDataProps.ContractTypes,
                MasterDataProps.ContractTerms,
                MasterDataProps.Arbitrations,
                MasterDataProps.PaymentTerms,
                MasterDataProps.Counterparties,
            ],
            authorizations: [
                {
                    privilegeName: 'GlobalParameters',
                    permission: 1,
                    parentLevelOne: 'Administration',
                },
            ],
        },
        resolve: {
            masterdata: MasterDataResolver,
        },
    },
    {
        path: 'operations/interface-monitoring/details',
        component: InterfaceMonitoringDetailsComponent,
        canActivate: [SecurityGuard],
        data: {
            animation: 'interface-monitoring-details', title: 'Interface Monitoring', isHomePage: false, icon: '',
            masterdataList: [
                MasterDataProps.InterfaceType,
                MasterDataProps.InterfaceStatus,
            ],
            authorizations: [
                {
                    privilegeName: 'InterfaceMonitoring',
                    permission: 2,
                    parentLevelOne: 'Administration',
                    parentLevelTwo: 'Operations',
                },
            ],
        },
        resolve: {
            masterdata: MasterDataResolver,
        },
    },

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AdminRoutingModule { }
