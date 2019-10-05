import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { OAuthService, UrlHelperService } from 'angular-oauth2-oidc';
import { MaterialModule } from '../../../shared/material.module';
import { DiscoveryService } from '../../../shared/services/discovery.service';
import { TradingService } from '../../../shared/services/http-services/trading.service';
import { SecurityService } from '../../../shared/services/security.service';
import { SharedModule } from '../../../shared/shared.module';
import { TradesComponent } from './trades.component';

describe('TradesComponent', () => {
    let component: TradesComponent;
    let fixture: ComponentFixture<TradesComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [TradesComponent],
            imports: [
                BrowserModule,
                BrowserAnimationsModule,
                MaterialModule,
                FormsModule,
                ReactiveFormsModule,
                RouterTestingModule,
                HttpClientTestingModule,
                SharedModule,
            ],
            providers: [
                SecurityService,
                TradingService,
                OAuthService,
                UrlHelperService,
                DiscoveryService,
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TradesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });
});
