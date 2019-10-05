import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { AgGridModule } from 'ag-grid-angular';
import { MaterialModule } from '../shared/material.module';
import { ATLAS_DATE_FORMATS, SharedModule } from '../shared/shared.module';
import { AccountingDocumentsReportComponent } from './components/accounting-documents-report/accounting-documents-report.component';
import { DocumentStatusDropdownComponent } from './components/accounting-documents-report/components/document-status-dropdown/document-status-dropdown.component';
import { DocumentTypeDropdownComponent } from './components/accounting-documents-report/components/document-type-dropdown/document-type-dropdown.component';
import { CustomReportViewerComponent } from './components/custom-reports/custom-report-viewer/custom-report-viewer.component';
import { CustomReportsComponent } from './components/custom-reports/custom-reports.component';
import { AuditReportComponent } from './components/global-reports/components/audit-report/audit-report.component';
import { ClientReportComponent } from './components/global-reports/components/client-report/client-report.component';
import { DetailComponent } from './components/global-reports/components/client-report/tabs/detail/detail.component';
import { OverviewComponent } from './components/global-reports/components/client-report/tabs/overview/overview.component';
import { FxExposureReportComponent } from './components/global-reports/components/fx-exposure-report/fx-exposure-report.component';
import { CriteraComponent } from './components/global-reports/components/historical-exchange-rates-report/components/critera/critera.component';
import { PeriodComponent } from './components/global-reports/components/historical-exchange-rates-report/components/period/period.component';
import { SortByComponent } from './components/global-reports/components/historical-exchange-rates-report/components/sort-by/sort-by.component';
import { HistoricalExchangeRatesReportComponent } from './components/global-reports/components/historical-exchange-rates-report/historical-exchange-rates-report.component';
import { NewBizReportComponent } from './components/global-reports/components/new-biz-report/new-biz-report.component';
import { NominalReportComponent } from './components/global-reports/components/nominal-report/nominal-report.component';
import { DetailTabComponent } from './components/global-reports/components/nominal-report/tabs/detail-tab/detail-tab.component';
import { OverviewTabComponent } from './components/global-reports/components/nominal-report/tabs/overview-tab/overview-tab.component';
import { LdrepManualAdjustmentReportComponent } from './components/global-reports/components/pnl-reports/ldrep-manual-adjustment-report/ldrep-manual-adjustment-report.component';
import { PnlMovementReportComponent } from './components/global-reports/components/pnl-reports/pnl-movement-report/pnl-movement-report.component';
import { PnlReportComponent } from './components/global-reports/components/pnl-reports/pnl-report/pnl-report.component';
import { PnlReportsComponent } from './components/global-reports/components/pnl-reports/pnl-reports.component';
import { ValidationDialogComponent } from './components/global-reports/components/pnl-reports/validation-dialog/validation-dialog.component';
import { ReportCriteriasComponent } from './components/global-reports/components/report-criterias/report-criterias.component';
import { TradeCostMovementReportComponent } from './components/global-reports/components/trade-cost-movement-report/trade-cost-movement-report.component';
import { TradeCostReportComponent } from './components/global-reports/components/trade-cost-report/trade-cost-report.component';
import { TradeReportComponent } from './components/global-reports/components/trade-report/trade-report.component';
import { GlobalReportsComponent } from './components/global-reports/global-reports.component';
import { HomeComponent } from './home/home.component';
import { LdeomComponent } from './ldeom/ldeom.component';
import { ReportingRoutingModule } from './reporting.route';

@NgModule({
    imports: [
        CommonModule,
        MaterialModule,
        ReportingRoutingModule,
        AgGridModule.withComponents([]),
        SharedModule,
    ],
    entryComponents: [
        ValidationDialogComponent,
        CustomReportViewerComponent,
    ],
    declarations: [
        HomeComponent,
        GlobalReportsComponent,
        LdeomComponent,
        TradeCostReportComponent,
        PnlReportComponent,
        PnlMovementReportComponent,
        ReportCriteriasComponent,
        AuditReportComponent,
        ClientReportComponent,
        TradeReportComponent,
        TradeCostMovementReportComponent,
        NominalReportComponent,
        FxExposureReportComponent,
        HistoricalExchangeRatesReportComponent,
        CriteraComponent,
        PeriodComponent,
        SortByComponent,
        NewBizReportComponent,
        PnlReportsComponent,
        LdrepManualAdjustmentReportComponent,
        AccountingDocumentsReportComponent,
        DocumentStatusDropdownComponent,
        DocumentTypeDropdownComponent,
        ValidationDialogComponent,
        OverviewComponent,
        DetailComponent,
        DetailTabComponent,
        OverviewTabComponent,
        CustomReportsComponent,
        CustomReportViewerComponent,
    ],
    providers: [
        { provide: MAT_DATE_LOCALE, useValue: 'en' },
        { provide: DateAdapter, useClass: MomentDateAdapter },
        { provide: MAT_DATE_FORMATS, useValue: ATLAS_DATE_FORMATS },
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ReportingModule { }
