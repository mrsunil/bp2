import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MasterDataProps } from '../shared/entities/masterdata-props.entity';
import { SecurityGuard } from '../shared/guards/security.guard';
import { CompanyDateResolver } from '../shared/resolvers/company-date.resolver';
import { FormConfigurationResolver } from '../shared/resolvers/form-configuration.resolver';
import { MasterDataResolver } from '../shared/resolvers/masterdata.resolver';
import { AccountingDocumentsReportComponent } from './components/accounting-documents-report/accounting-documents-report.component';
import { CustomReportsComponent } from './components/custom-reports/custom-reports.component';
import { AuditReportComponent } from './components/global-reports/components/audit-report/audit-report.component';
import { ClientReportComponent } from './components/global-reports/components/client-report/client-report.component';
import { FxExposureReportComponent } from './components/global-reports/components/fx-exposure-report/fx-exposure-report.component';
import { HistoricalExchangeRatesReportComponent } from './components/global-reports/components/historical-exchange-rates-report/historical-exchange-rates-report.component';
import { NewBizReportComponent } from './components/global-reports/components/new-biz-report/new-biz-report.component';
import { NominalReportComponent } from './components/global-reports/components/nominal-report/nominal-report.component';
import { PnlMovementReportComponent } from './components/global-reports/components/pnl-reports/pnl-movement-report/pnl-movement-report.component';
import { PnlReportsComponent } from './components/global-reports/components/pnl-reports/pnl-reports.component';
import { TradeCostMovementReportComponent } from './components/global-reports/components/trade-cost-movement-report/trade-cost-movement-report.component';
import { TradeCostReportComponent } from './components/global-reports/components/trade-cost-report/trade-cost-report.component';
import { TradeReportComponent } from './components/global-reports/components/trade-report/trade-report.component';
import { GlobalReportsComponent } from './components/global-reports/global-reports.component';
import * as Reporting from './home/home.component';
import { LdeomComponent } from './ldeom/ldeom.component';

export const routes: Routes = [
    {
        path: '',
        component: Reporting.HomeComponent,
        canActivate: [SecurityGuard],
        resolve: {
            companyDate: CompanyDateResolver,
        },
    },
    {
        path: 'ldeom',
        component: LdeomComponent,
        canActivate: [SecurityGuard],
        data: {
            animation: 'ldeom',
            title: 'Ldeom',
            isHomePage: false,
            privilegeLevel1Name: null,
        },
        resolve: {
            companyDate: CompanyDateResolver,
        },
    },
    {
        path: 'globalreports',
        component: GlobalReportsComponent,
        canActivate: [SecurityGuard],
        data: {
            animation: 'globalreports', title: 'Global Reports', isHomePage: false, privilegeLevel1Name: null,
            authorizations: [
                {
                    privilegeName: 'GlobalReports',
                    permission: 1,
                    parentLevelOne: 'Reports',
                },
            ],
        },
        resolve: {
            companyDate: CompanyDateResolver,
        },
    },
    {
        path: 'globalreports/accountingdocumentsreport',
        component: AccountingDocumentsReportComponent,
        canActivate: [SecurityGuard],
        data: {
            animation: 'accountingdocumentsreport',
            title: 'Accounting Documents Report',
            formId: 'AccDocReport',
            isHomePage: false, privilegeLevel1Name: null,
            masterdataList: [
                MasterDataProps.TransactionDocumentType,
                MasterDataProps.TransactionDocumentStatus,
            ],
        },
        resolve: {
            masterdata: MasterDataResolver,
            companyDate: CompanyDateResolver,
        },
    },
    {
        path: 'customreports',
        component: CustomReportsComponent,
        canActivate: [SecurityGuard],
        data: {
            animation: 'customreports', title: 'Custom Reports', isHomePage: false, privilegeLevel1Name: null,
            // authorizations: [
            //     {
            //         privilegeName: 'CustomReports',
            //         permission: 1,
            //         parentLevelOne: 'Reports',
            //     },
            // ],
            masterdataList: [
                MasterDataProps.Companies,
            ],
        },
        resolve: {
            companyDate: CompanyDateResolver,
            masterdata: MasterDataResolver,
        },
    },
    {
        path: 'globalreports/tradecost',
        component: TradeCostReportComponent,
        canActivate: [SecurityGuard],
        data: {
            animation: 'tradecost',
            title: 'Trade Cost Report',
            isHomePage: false,
            privilegeLevel1Name: null,
            masterdataList: [
                MasterDataProps.Companies,
            ],
            authorizations: [
                {
                    privilegeName: 'TradeCostReport',
                    permission: 1,
                    parentLevelOne: 'GlobalReports',
                    parentLevelTwo: 'Reports',
                },
            ],
        },
        resolve: {
            companyDate: CompanyDateResolver,
            masterdata: MasterDataResolver,
        },

    },
    {
        path: 'globalreports/tradecostmovement',
        component: TradeCostMovementReportComponent,
        canActivate: [SecurityGuard],
        data: {
            animation: 'tradecostmovement',
            title: 'Trade Cost Movement Report',
            isHomePage: false,
            privilegeLevel1Name: null,
            masterdataList: [
                MasterDataProps.Companies,
            ],
        },
        resolve: {
            companyDate: CompanyDateResolver,
            masterdata: MasterDataResolver,
        },

    },
    {
        path: 'globalreports/newbiz',
        component: NewBizReportComponent,
        canActivate: [SecurityGuard],
        data: {
            animation: 'newBiz',
            title: 'New Biz Report',
            isHomePage: false,
            masterdataList: [
                MasterDataProps.Departments,
                MasterDataProps.WeightUnits,
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
        path: 'globalreports/pnlreports',
        component: PnlReportsComponent,
        canActivate: [SecurityGuard],
        data: {
            formId: 'PnlReports',
            animation: 'pnlreports',
            title: 'P&L Reports',
            isHomePage: false,
            privilegeLevel1Name: null,
            masterdataList: [
                MasterDataProps.Departments,
                MasterDataProps.ProfitCenters,
                MasterDataProps.Companies,
                MasterDataProps.PNLTypes,
                MasterDataProps.Commodities,
            ],
            authorizations: [
                {
                    privilegeName: 'PLReport',
                    permission: 1,
                    parentLevelOne: 'GlobalReports',
                    parentLevelTwo: 'Reports',
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
        path: 'globalreports/pnlmovementreport',
        component: PnlMovementReportComponent,
        canActivate: [SecurityGuard],
        data: {
            animation: 'pnlmovementreport',
            title: 'P&L Movement Report',
            isHomePage: false,
            privilegeLevel1Name: null,
            masterdataList: [
                MasterDataProps.Departments,
                MasterDataProps.ProfitCenters,
                MasterDataProps.Companies,
            ],
            authorizations: [
                {
                    privilegeName: 'PLMovementReport',
                    permission: 1,
                    parentLevelOne: 'GlobalReports',
                    parentLevelTwo: 'Reports',
                },
            ],
        },
        resolve: {
            masterdata: MasterDataResolver,
            companyDate: CompanyDateResolver,
        },
    },
    {
        path: 'globalreports/audit',
        component: AuditReportComponent,
        canActivate: [SecurityGuard],
        data: {
            animation: 'auditreport',
            title: 'Audit report',
            isHomePage: false,
            privilegeLevel1Name: null,
            authorizations: [
                {
                    privilegeName: 'AuditReport',
                    permission: 1,
                    parentLevelTwo: 'Reports',
                    parentLevelOne: 'GlobalReports',
                },
            ],
        },
        resolve: {
            companyDate: CompanyDateResolver,
        },
    },
    {
        path: 'globalreports/trade',
        component: TradeReportComponent,
        canActivate: [SecurityGuard],
        data: {
            animation: 'tradereport',
            title: 'Trade Report',
            formId: 'TradeReport',
            isHomePage: false,
            privilegeLevel1Name: null,
            masterdataList: [
                MasterDataProps.WeightUnits,
            ],
        },
        resolve: {
            masterdata: MasterDataResolver,
            formConfiguration: FormConfigurationResolver,
            companyDate: CompanyDateResolver,
        },
    },
    {
        path: 'globalreports/trade/:counterPartyId',
        component: TradeReportComponent,
        canActivate: [SecurityGuard],
        data: {
            animation: 'tradereport',
            title: 'Trade Report',
            formId: 'TradeReport',
            isHomePage: false,
            privilegeLevel1Name: null,
            masterdataList: [
                MasterDataProps.WeightUnits,
                MasterDataProps.Counterparties,
            ],
            authorizations: [
                {
                    privilegeName: 'TradeReport',
                    permission: 1,
                    parentLevelTwo: 'Reports',
                    parentLevelOne: 'GlobalReports',
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
        path: 'globalreports/clientreport',
        component: ClientReportComponent,
        canActivate: [SecurityGuard],
        data: {
            formId: 'ClientReport',
            animation: 'clientreport',
            title: 'Client Transaction report',
            isHomePage: false,
            privilegeLevel1Name: null,
            masterdataList: [
                MasterDataProps.Counterparties,
                MasterDataProps.Departments,
                MasterDataProps.Currencies,
                MasterDataProps.CostTypes,
            ],
        },
        resolve: {
            masterdata: MasterDataResolver,
            companyDate: CompanyDateResolver,
            formConfiguration: FormConfigurationResolver,
        },
    },
    {
        path: 'globalreports/clientreport/:counterPartyId',
        component: ClientReportComponent,
        canActivate: [SecurityGuard],
        data: {
            formId: 'ClientReport',
            animation: 'clientreport',
            title: 'Client Transaction report',
            isHomePage: false,
            privilegeLevel1Name: null,
            masterdataList: [
                MasterDataProps.Counterparties,
                MasterDataProps.Departments,
            ],
            authorizations: [
                {
                    privilegeName: 'ClientTransactionReport',
                    permission: 1,
                    parentLevelTwo: 'Reports',
                    parentLevelOne: 'GlobalReports',
                },
            ],
        },
        resolve: {
            masterdata: MasterDataResolver,
            companyDate: CompanyDateResolver,
            formConfiguration: FormConfigurationResolver,
        },
    },
    {
        path: 'globalreports/nominalreport',
        component: NominalReportComponent,
        canActivate: [SecurityGuard],
        data: {
            formId: 'NominalReport', animation: 'nominalreport', title: 'Nominal Ledger Transactional Report',
            isHomePage: false, privilegeLevel1Name: null,
            authorizations: [
                {
                    privilegeName: 'NominalReport',
                    permission: 1,
                    parentLevelTwo: 'Reports',
                    parentLevelOne: 'GlobalReports',
                },
            ],
            masterdataList: [
                MasterDataProps.Currencies,
                MasterDataProps.NominalAccounts,
            ],
        },
        resolve: {
            masterdata: MasterDataResolver,
            companyDate: CompanyDateResolver,
            formConfiguration: FormConfigurationResolver,

        },
    },

    {
        path: 'globalreports/historicalrates',
        component: HistoricalExchangeRatesReportComponent,
        canActivate: [SecurityGuard],
        data: {
            animation: 'historicalrates',
            title: 'Historical Exchange Rate Report',
            isHomePage: false,
            privilegeLevel1Name: null,
            masterdataList: [
                MasterDataProps.Currencies,
            ],
        },
        resolve: {
            companyDate: CompanyDateResolver,
            masterdata: MasterDataResolver,
        },

    },

    {
        path: 'globalreports/fxexposurerate',
        component: FxExposureReportComponent,
        canActivate: [SecurityGuard],
        data: {
            animation: 'fxexposurerate',
            title: 'Fx Exposure Report',
            isHomePage: false,
            privilegeLevel1Name: null,
            authorizations: [
                {
                    privilegeName: 'FxExposureReport',
                    permission: 2,
                    parentLevelOne: 'Reports',
                    parentLevelTwo: 'GlobalReports',
                },
            ],

            masterdataList: [
                MasterDataProps.Currencies,
                MasterDataProps.Departments,
            ],
        },
        resolve: {
            companyDate: CompanyDateResolver,
            masterdata: MasterDataResolver,
        },

    },

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ReportingRoutingModule { }
