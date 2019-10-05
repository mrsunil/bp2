import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardHomeComponent } from './dashboard/dashboard-home/dashboard-home.component';
import { CompanyRedirectionComponent } from './home/company-redirection/company-redirection.component';
import { HomePageComponent } from './home/home-page/home-page.component';
import { ErrorPageComponent } from './shared/components/error-page/error-page.component';
import { SecurityGuard } from './shared/guards/security.guard';
import { CompanyDateResolver } from './shared/resolvers/company-date.resolver';
import { AtlasTradingTranslationResolver } from './trading/resolvers/atlas-trading-translation.resolver';
export const routes: Routes = [
    {
        path: '', pathMatch: 'full', component: CompanyRedirectionComponent,
    },
    {
        path: 'error/:status',
        component: ErrorPageComponent,
        data: { animation: 'error', title: 'Error', isHomePage: false, privilegeLevel1Name: null },
    },
    {
        path: ':company', redirectTo: ':company/home', pathMatch: 'full',
        resolve: {
            companyDate: CompanyDateResolver,
        },
    },
    {
        path: ':company/home',
        component: HomePageComponent,
        canActivate: [SecurityGuard],
        data: { animation: 'home', title: 'Home', isHomePage: true, privilegeLevel1Name: 'Home' },
        resolve: {
            companyDate: CompanyDateResolver,
        },
    },
    {
        path: ':company/dashboard',
        component: DashboardHomeComponent,
        canActivate: [SecurityGuard],
        data: { animation: 'dashboard', title: 'Dashboard', isHomePage: true, privilegeLevel1Name: null },
        resolve: {
            companyDate: CompanyDateResolver,
        },
    },
    {
        path: ':company/error/:status',
        component: ErrorPageComponent,
        data: { animation: 'error', title: 'Error', isHomePage: false, privilegeLevel1Name: null },
        resolve: {
            companyDate: CompanyDateResolver,
        },
    },
    {
        path: ':company/trades',
        loadChildren: './trading/trading.module#TradingModule',
        data: { title: 'Trades', isHomePage: true, privilegeLevel1Name: 'Trades' },
        resolve: {
            companyDate: CompanyDateResolver,
            tradingTranslation: AtlasTradingTranslationResolver,
        },
    },
    {
        path: ':company/execution',
        loadChildren: './execution/execution.module#ExecutionModule',
        data: { title: 'Execution', isHomePage: true, privilegeLevel1Name: null },
        resolve: {
            companyDate: CompanyDateResolver,
        },
    },
    {
        path: ':company/controlling',
        loadChildren: './controlling/controlling.module#ControllingModule',
        data: { title: 'Controlling', isHomePage: true, privilegeLevel1Name: null },
        resolve: {
            companyDate: CompanyDateResolver,
        },
    },
    {
        path: ':company/reporting',
        loadChildren: './reporting/reporting.module#ReportingModule',
        data: { title: 'Reports', isHomePage: true, privilegeLevel1Name: 'Reports' },
        resolve: {
            companyDate: CompanyDateResolver,
        },
    },
    {
        path: ':company/admin',
        loadChildren: './admin/admin.module#AdminModule',
        data: { title: 'Administration panel', isHomePage: true, privilegeLevel1Name: 'Administration' },
        resolve: {
            companyDate: CompanyDateResolver,
        },
    },

    {
        path: ':company/referential',
        loadChildren: './referential/referential.module#ReferentialModule',
        data: { title: 'Referential', isHomePage: true, privilegeLevel1Name: 'Referential' },
        resolve: {
            companyDate: CompanyDateResolver,
        },
    },
    {
        path: ':company/financial',
        loadChildren: './financial/financial.module#FinancialModule',
        data: { title: 'Financials', isHomePage: true, privilegeLevel1Name: 'Financials' },
        resolve: {
            companyDate: CompanyDateResolver,
        },
    },
    {
        path: ':company/hidden', loadChildren: './hidden/hidden.module#HiddenModule',
        resolve: {
            companyDate: CompanyDateResolver,
        },
    },

];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    providers: [],
})
export class AppRoutingModule { }
