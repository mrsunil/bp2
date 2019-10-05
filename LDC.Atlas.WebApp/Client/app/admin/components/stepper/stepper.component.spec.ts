import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserModule } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { OAuthService, UrlHelperService } from 'angular-oauth2-oidc';
import { MaterialModule } from '../../../shared/material.module';
import { SecurityService } from '../../../shared/services/security.service';
import { SharedModule } from '../../../shared/shared.module';
import { StepperComponent } from './stepper.component';


describe('StepperComponent', () => {
    let component: StepperComponent;
    let fixture: ComponentFixture<StepperComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [StepperComponent],
            imports: [
                BrowserModule,
                MaterialModule,
                RouterTestingModule,
                HttpClientTestingModule,
                SharedModule,
            ],
            providers: [
                SecurityService,
                OAuthService,
                UrlHelperService,
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(StepperComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
