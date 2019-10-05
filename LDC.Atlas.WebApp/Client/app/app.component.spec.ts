import { APP_BASE_HREF, Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { BrowserModule } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
// import { AuthInterceptor } from "./shared/authInterceptor";
import { NgProgressModule } from '@ngx-progressbar/core';
import { NgProgressHttpModule } from '@ngx-progressbar/http';
import { OAuthModule, OAuthService, UrlHelperService } from 'angular-oauth2-oidc';
import { AppComponent } from './app.component';
import { AuthorizationService } from './core/services/authorization.service';
import { httpInterceptorProviders } from './shared/http-interceptors';
import { MaterialModule } from './shared/material.module';
import { AppInsightsLoggerService } from './core/services/app-insights-logger.service';
import { DiscoveryService } from './shared/services/discovery.service';
import { UserIdentityService } from './shared/services/http-services/user-identity.service';
import { SecurityService } from './shared/services/security.service';

describe('AppComponent', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                AppComponent,
            ],
            imports: [
                BrowserModule,
                MaterialModule,
                HttpClientTestingModule,
                OAuthModule,
                NgProgressModule.forRoot(),
                NgProgressHttpModule,
                RouterTestingModule,
            ],
            providers: [
                // { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
                OAuthService,
                SecurityService,
                UserIdentityService,
                UrlHelperService,
                AppInsightsLoggerService,
                httpInterceptorProviders,
                DiscoveryService,
                AuthorizationService,
                AppInsightsLoggerService,
                Location, { provide: LocationStrategy, useClass: PathLocationStrategy },
                { provide: APP_BASE_HREF, useValue: '/' },
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
    }));

    it('should create the app', async(() => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.debugElement.componentInstance;
        expect(app).toBeTruthy();
    }));

    it(`should have as title 'app'`, async(() => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.debugElement.componentInstance;
        expect(app.title).toEqual('app');
    }));

});
