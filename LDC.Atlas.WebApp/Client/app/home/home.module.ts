import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { RouterModule } from '@angular/router';
import { ChartsModule } from 'ng2-charts';
import { AppRoutingModule } from '../app.route';
import { MaterialModule } from '../shared/material.module';
import { ATLAS_DATE_FORMATS, SharedModule } from '../shared/shared.module';
import { CompanyRedirectionComponent } from './company-redirection/company-redirection.component';
import { ExecutionDashboardComponent } from './execution-dashboard/execution-dashboard.component';
import { HomePageComponent } from './home-page/home-page.component';
import { TradingDashboardComponent } from './trading-dashboard/trading-dashboard.component';

@NgModule({
    imports: [
        CommonModule,
        MaterialModule,
        AppRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        SharedModule,
        ChartsModule,
    ],
    declarations: [
        ExecutionDashboardComponent,
        TradingDashboardComponent,
        HomePageComponent,
        CompanyRedirectionComponent,
    ],
    providers: [
        { provide: MAT_DATE_LOCALE, useValue: 'en' },
        { provide: DateAdapter, useClass: MomentDateAdapter },
        { provide: MAT_DATE_FORMATS, useValue: ATLAS_DATE_FORMATS },
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HomeModule { }
