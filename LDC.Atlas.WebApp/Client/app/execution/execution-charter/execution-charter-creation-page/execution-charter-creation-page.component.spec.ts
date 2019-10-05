import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterTestingModule } from '@angular/router/testing';
import { OAuthService, UrlHelperService } from 'angular-oauth2-oidc';
import { MaterialModule } from '../../../shared/material.module';
import { DiscoveryService } from "../../../shared/services/discovery.service";
import { DateConverterService } from '../../../shared/services/date-converter.service';
import { ExecutionService } from '../../../shared/services/http-services/execution.service';
import { MasterdataService } from "../../../shared/services/http-services/masterdata.service";
import { TradingService } from '../../../shared/services/http-services/trading.service';
import { SecurityService } from '../../../shared/services/security.service';
import { SharedModule } from "../../../shared/shared.module";
import { ExecutionCharterCreationPageComponent } from './execution-charter-creation-page.component';

describe('ExecutionCharterCreationPageComponent', () => {
    let component: ExecutionCharterCreationPageComponent;
    let fixture: ComponentFixture<ExecutionCharterCreationPageComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ExecutionCharterCreationPageComponent],
            imports: [
                BrowserModule,
                BrowserAnimationsModule,
                MaterialModule,
                CommonModule,
                FormsModule,
                ReactiveFormsModule,
                HttpClientTestingModule,
                RouterTestingModule,
                SharedModule,
            ],
            providers: [
                SecurityService,
                MasterdataService,
                TradingService,
                ExecutionService,
                OAuthService,
                UrlHelperService,
                DateConverterService,
                DiscoveryService
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ExecutionCharterCreationPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });


});
