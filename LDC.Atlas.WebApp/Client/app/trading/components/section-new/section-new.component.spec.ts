import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { OAuthService, UrlHelperService } from 'angular-oauth2-oidc';
import { MaterialModule } from '../../../shared/material.module';
import { MasterdataService } from '../../../shared/services/http-services/masterdata.service';
import { SecurityService } from '../../../shared/services/security.service';
import { SharedModule } from '../../../shared/shared.module';
import { SectionNewComponent } from './section-new.component';

describe('SectionNewComponent', () => {
    let component: SectionNewComponent;
    let fixture: ComponentFixture<SectionNewComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SectionNewComponent],
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
                MasterdataService,
                OAuthService,
                UrlHelperService,
                { provide: MatDialogRef, useValue: {} },
                { provide: MAT_DIALOG_DATA, useValue: [] },
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SectionNewComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
