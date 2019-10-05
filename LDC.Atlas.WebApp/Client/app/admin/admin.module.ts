import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatButtonModule, MatCardModule, MatDialogModule } from '@angular/material';
import { NgProgressModule } from '@ngx-progressbar/core';
import { NgProgressHttpModule } from '@ngx-progressbar/http';
import { AgGridModule } from 'ag-grid-angular';
import { TextMaskModule } from 'angular2-text-mask';
import { AgGridMultipleAutocompleteDepartmentComponent } from '../shared/components/ag-grid/ag-grid-multiple-autocomplete-department/ag-grid-multiple-autocomplete-department.component';
import { AgGridMultipleAutocompleteComponent } from '../shared/components/ag-grid/ag-grid-multiple-autocomplete/ag-grid-multiple-autocomplete.component';
import { MaterialModule } from '../shared/material.module';
import { CustomDateAdapter } from '../shared/services/customDateAdapter';
import { ATLAS_DATE_FORMATS, SharedModule } from '../shared/shared.module';
import { AdminRoutingModule } from './admin.route';
import { CompanyListComponent } from './components/companies/company-list/company-list.component';
import { AccountingTabComponent } from './components/companies/company-management/accounting-tab/accounting-tab.component';
import { DefaultAccountComponent } from './components/companies/company-management/accounting-tab/default-account/default-account.component';
import { DefaultCostTypeComponent } from './components/companies/company-management/accounting-tab/default-cost-type/default-cost-type.component';
import { MainAccountingComponent } from './components/companies/company-management/accounting-tab/main-accounting/main-accounting.component';
import { OthersComponent } from './components/companies/company-management/accounting-tab/others/others.component';
import { CompanyManagementComponent } from './components/companies/company-management/company-management.component';
import { CompanyMenuBarComponent } from './components/companies/company-management/company-menu-bar/company-menu-bar.component';
import { HeaderFormComponent } from './components/companies/company-management/header-form/header-form.component';
import { AccountingInterfaceComponent } from './components/companies/company-management/interface-tab/accounting-interface/accounting-interface.component';
import { DmsComponent } from './components/companies/company-management/interface-tab/dms/dms.component';
import { InterfaceTabComponent } from './components/companies/company-management/interface-tab/interface-tab.component';
import { MappingComponent } from './components/companies/company-management/interface-tab/mapping/mapping.component';
import { TreasurySystemComponent } from './components/companies/company-management/interface-tab/treasury-system/treasury-system.component';
import { DefaultPaymentTermsComponent } from './components/companies/company-management/invoice-tab/default-payment-terms/default-payment-terms.component';
import { InvoiceTabComponent } from './components/companies/company-management/invoice-tab/invoice-tab.component';
import { TresholdCostAmountComponent } from './components/companies/company-management/invoice-tab/treshold-cost-amount/treshold-cost-amount.component';
import { AccountingParametersComponent } from './components/companies/company-management/itparamters-tab/accounting-parameters/accounting-parameters.component';
import { FreezeParametersComponent } from './components/companies/company-management/itparamters-tab/freeze-parameters/freeze-parameters.component';
import { ItparametersTabComponent } from './components/companies/company-management/itparamters-tab/itparameters-tab.component';
import { TradeParametersComponent } from './components/companies/company-management/itparamters-tab/trade-parameters/trade-parameters.component';
import { CompanyManagementMainTabComponent } from './components/companies/company-management/main-tab/company-management-main-tab.component';
import { DefaultBrokerComponent } from './components/companies/company-management/main-tab/default-broker/default-broker.component';
import { DetailsComponent } from './components/companies/company-management/main-tab/details/details.component';
import { IdentityComponent } from './components/companies/company-management/main-tab/identity/identity.component';
import { LocationComponent } from './components/companies/company-management/main-tab/location/location.component';
import { AllocationSetUpComponent } from './components/companies/company-management/physicals-tab/allocation-set-up/allocation-set-up.component';
import { MandatoryTradeApprovalComponent } from './components/companies/company-management/physicals-tab/mandatory-trade-approval/mandatory-trade-approval.component';
import { PhysicalsMainComponent } from './components/companies/company-management/physicals-tab/physicals-main/physicals-main.component';
import { PhysicalsTabComponent } from './components/companies/company-management/physicals-tab/physicals-tab.component';
import { DefaultTaxesComponent } from './components/companies/company-management/tax-tab/default-taxes/default-taxes.component';
import { TaxConfigurationComponent } from './components/companies/company-management/tax-tab/tax-configuration/tax-configuration.component';
import { TaxTabComponent } from './components/companies/company-management/tax-tab/tax-tab.component';
import { MasterDataFieldComponent } from './components/companies/company-settings/master-data-field/master-data-field.component';
import { TransactionDataComponent } from './components/companies/company-settings/transaction-data/transaction-data.component';
import { UserAccountComponent } from './components/companies/company-settings/user-account/user-account.component';
import { UserPrivilegesComponent } from './components/companies/company-settings/user-privileges/user-privileges.component';
import { CompanySelectionComponent } from './components/companies/copy-company/company-selection/company-selection.component';
import { CopyCompanyComponent } from './components/companies/copy-company/copy-company.component';
import { MasterRowApplyComponent } from './components/companies/master-row-apply/master-row-apply.component';
import { ConfigurationInterfaceComponent } from './components/global-parameters/configuration-interface/configuration-interface.component';
import { FunctionalObjectDetailsComponent } from './components/global-parameters/functional-objects/details/functional-object-details.component';
import { FunctionalObjectComponent } from './components/global-parameters/functional-objects/functional-object.component';
import { FunctionalObjectsListComponent } from './components/global-parameters/functional-objects/list/functional-objects-list.component';
import { GlobalParametersComponent } from './components/global-parameters/global-parameters.component';
import { ContextualSearchComponent } from './components/global-parameters/grid-configuration/contextual-search/contextual-search.component';
import { ContextualViewDetailsComponent } from './components/global-parameters/grid-configuration/contextual-search/details/contextual-view-details.component';
import { GridConfigurationComponent } from './components/global-parameters/grid-configuration/grid-configuration.component';
import { ListViewDetailsComponent } from './components/global-parameters/grid-configuration/list-search/details/list-view-details.component';
import { ListAndSearchComponent } from './components/global-parameters/grid-configuration/list-search/list-search.component';
import { ListViewComponent } from './components/global-parameters/grid-configuration/list-view/list-view.component';
import { LockManagementListComponent } from './components/global-parameters/lock-management/list/lock-management-list.component';
import { DateFormatComponent } from './components/global-parameters/user-preferences/date-format/date-format.component';
import { LanguageComponent } from './components/global-parameters/user-preferences/language/language.component';
import { UserPreferencesComponent } from './components/global-parameters/user-preferences/user-preferences.component';
import { HomeComponent } from './components/home/home.component';
import { InterfaceBuilderDetailsComponent } from './components/operations/interface-builder/details/interface-builder-details.component';
import { AgGridButtonComponent } from './components/operations/interface-monitoring/ag-grid-button/ag-grid-button.component';
import { InterfaceMonitoringDetailsComponent } from './components/operations/interface-monitoring/interface-monitoring-details/interface-monitoring-details.component';
import { InterfaceMonitoringSummaryComponent } from './components/operations/interface-monitoring/interface-monitoring-summary/interface-monitoring-summary.component';
import { OperationsComponent } from './components/operations/operations.component';
import { PrivilegeTreeComponent } from './components/profiles/privilege-tree/privilege-tree.component';
import { ProfilesListContextualMenuComponent } from './components/profiles/profiles-list/contextual-menu/profiles-list-contextual-menu.component';
import { ProfilesListComponent } from './components/profiles/profiles-list/profiles-list.component';
import { ProfilesCopyComponent } from './components/profiles/profiles-management/copy/profiles-copy.component';
import { ProfilesManagementComponent } from './components/profiles/profiles-management/profiles-management.component';
import { StepperComponent } from './components/stepper/stepper.component';
import { TemplateManagementComponent } from './components/template-management/template-management.component';
import { UserListComponent } from './components/users/user-list/user-list.component';
import { AgGridDepartmentComponent } from './components/users/user-manage/ag-grid-department/ag-grid-department.component';
import { CopyPrivilegesDialogComponent } from './components/users/user-manage/copy-privileges-dialog/copy-privileges-dialog.component';
import { DepartmentDropdownComponent } from './components/users/user-manage/permission-line/department-dropdown/department-dropdown.component';
import { PermissionLineComponent } from './components/users/user-manage/permission-line/permission-line.component';
import { UserManageComponent } from './components/users/user-manage/user-manage.component';
import { UserSearchComponent } from './components/users/user-search/user-search.component';

@NgModule({
    imports: [
        CommonModule,
        MaterialModule,
        SharedModule,
        AdminRoutingModule,
        AgGridModule.withComponents([]),
        NgProgressModule.forRoot(),
        NgProgressHttpModule,
        MatCardModule,
        MatButtonModule,
        MatDialogModule,
        TextMaskModule,
    ],

    declarations: [
        UserManageComponent,
        UserListComponent,
        HomeComponent,
        UserSearchComponent,
        StepperComponent,
        ProfilesListComponent,
        ProfilesManagementComponent,
        PrivilegeTreeComponent,
        PermissionLineComponent,
        ProfilesCopyComponent,
        ProfilesListContextualMenuComponent,
        CopyPrivilegesDialogComponent,
        DepartmentDropdownComponent,
        AgGridDepartmentComponent,
        GlobalParametersComponent,
        FunctionalObjectsListComponent,
        FunctionalObjectComponent,
        LockManagementListComponent,
        FunctionalObjectDetailsComponent,
        CompanyListComponent,
        CompanyManagementComponent,
        CompanyManagementMainTabComponent,
        InvoiceTabComponent,
        DefaultPaymentTermsComponent,
        TresholdCostAmountComponent,
        TaxTabComponent,
        TaxConfigurationComponent,
        DefaultTaxesComponent,
        GridConfigurationComponent,
        ListAndSearchComponent,
        ContextualSearchComponent,
        ListViewComponent,
        ListViewDetailsComponent,
        ContextualViewDetailsComponent,
        IdentityComponent,
        LocationComponent,
        DetailsComponent,
        CopyCompanyComponent,
        CompanySelectionComponent,
        MandatoryTradeApprovalComponent,
        AllocationSetUpComponent,
        PhysicalsTabComponent,
        PhysicalsMainComponent,
        MasterDataFieldComponent,
        UserPrivilegesComponent,
        TransactionDataComponent,
        UserAccountComponent,
        AccountingTabComponent,
        MainAccountingComponent,
        DefaultAccountComponent,
        DefaultCostTypeComponent,
        MasterRowApplyComponent,
        InterfaceTabComponent,
        MappingComponent,
        AccountingInterfaceComponent,
        DmsComponent,
        TreasurySystemComponent,
        ItparametersTabComponent,
        TradeParametersComponent,
        FreezeParametersComponent,
        AccountingParametersComponent,
        HeaderFormComponent,
        CompanyMenuBarComponent,
        InterfaceBuilderDetailsComponent,
        OperationsComponent,
        UserPreferencesComponent,
        LanguageComponent,
        DateFormatComponent,
        InterfaceMonitoringSummaryComponent,
        ConfigurationInterfaceComponent,
        TemplateManagementComponent,
        DefaultBrokerComponent,
        InterfaceMonitoringDetailsComponent,
        AgGridButtonComponent,
        OthersComponent,
    ],
    entryComponents: [
        ProfilesListContextualMenuComponent,
        CopyPrivilegesDialogComponent,
        AgGridDepartmentComponent,
        AgGridMultipleAutocompleteComponent,
        AgGridMultipleAutocompleteDepartmentComponent,
        PhysicalsMainComponent,
        MasterRowApplyComponent,
        AgGridButtonComponent,
    ],
    providers: [CustomDateAdapter,
        { provide: MAT_DATE_LOCALE, useValue: 'en' },
        { provide: DateAdapter, useClass: CustomDateAdapter },
        { provide: MAT_DATE_FORMATS, useValue: ATLAS_DATE_FORMATS },
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AdminModule { }
