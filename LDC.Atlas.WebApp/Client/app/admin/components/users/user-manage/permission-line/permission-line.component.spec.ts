import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { OAuthService, UrlHelperService } from 'angular-oauth2-oidc';
import { TextMaskModule } from 'angular2-text-mask';
import { MaterialModule } from '../../../../../shared/material.module';
import { MockMasterdataService } from '../../../../../shared/mocks/mock-masterdata-service';
import { MasterdataService } from '../../../../../shared/services/http-services/masterdata.service';
import { SharedModule } from '../../../../../shared/shared.module';
import { DepartmentDropdownComponent } from './department-dropdown/department-dropdown.component';
import { PermissionLineComponent } from './permission-line.component';

describe('PermissionLineComponent', () => {
    let component: PermissionLineComponent;
    let fixture: ComponentFixture<PermissionLineComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PermissionLineComponent, DepartmentDropdownComponent],
            imports: [
                BrowserModule,
                BrowserAnimationsModule,
                MaterialModule,
                FormsModule,
                ReactiveFormsModule,
                RouterTestingModule,
                HttpClientTestingModule,
                SharedModule,
                TextMaskModule,
            ],
            providers: [
                OAuthService,
                UrlHelperService,
                [{ provide: MasterdataService, useClass: MockMasterdataService }],
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PermissionLineComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
