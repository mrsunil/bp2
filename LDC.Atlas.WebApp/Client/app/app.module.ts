import { APP_BASE_HREF, Location } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgProgressModule } from '@ngx-progressbar/core';
import { NgProgressHttpModule } from '@ngx-progressbar/http';
import { AgGridModule } from 'ag-grid-angular';
import { OAuthModule, OAuthService, OAuthStorage, UrlHelperService } from 'angular-oauth2-oidc';
import { CookieService } from 'ngx-cookie-service';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.route';
import { CoreModule } from './core/core.module';
import { AtlasStorage } from './core/services/atlas-storage';
import { DashboardModule } from './dashboard/dashboard.module';
import { HomeModule } from './home/home.module';
import { MdmModule } from './mdm/mdm.module';
import { WINDOW } from './shared/entities/window-injection-token';
import { CanDeactivateGuard } from './shared/guards/can-deactivate-guard.service';
import { httpInterceptorProviders } from './shared/http-interceptors';
import { MaterialModule } from './shared/material.module';
import { DiscoveryService } from './shared/services/discovery.service';
import { ATLAS_DATE_FORMATS, SharedModule } from './shared/shared.module';
import { AtlasTradingTranslationResolver } from './trading/resolvers/atlas-trading-translation.resolver';

declare var readCookie: (cookie: string) => string;

export function initializeApplicationPathRoot(): string {
    const basePath = decodeURIComponent(readCookie('EnvSuffix'));
    return basePath;
}

@NgModule({
    declarations: [
        AppComponent,
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        MaterialModule,
        HttpClientModule,
        SharedModule.forRoot(),
        OAuthModule.forRoot(),
        AppRoutingModule,
        HomeModule,
        MdmModule,
        DashboardModule,
        AgGridModule.withComponents([]),
        NgProgressModule.forRoot(),
        NgProgressHttpModule,
        FlexLayoutModule,
        CoreModule,
    ],
    providers: [
        {
            provide: APP_BASE_HREF,
            useFactory: initializeApplicationPathRoot,
            deps: [],
        },
        { provide: MAT_DATE_LOCALE, useValue: 'en' },
        { provide: MAT_DATE_FORMATS, useValue: ATLAS_DATE_FORMATS },
        { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
        { provide: DateAdapter, useClass: MomentDateAdapter },
        { provide: WINDOW, useValue: window },
        OAuthService,
        UrlHelperService,
        CookieService,
        httpInterceptorProviders,
        DiscoveryService,
        Location,
        CanDeactivateGuard,
        AtlasTradingTranslationResolver,
    ],
    bootstrap: [AppComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule { }
