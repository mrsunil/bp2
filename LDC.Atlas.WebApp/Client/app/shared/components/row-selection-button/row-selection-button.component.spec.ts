import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserModule } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { OAuthService, UrlHelperService } from 'angular-oauth2-oidc';
import { MaterialModule } from '../../material.module';
import { SecurityService } from '../../services/security.service';
import { RowSelectionButton } from './row-selection-button.component';

describe('RowSelectionButton', () => {
    let component: RowSelectionButton;
    let fixture: ComponentFixture<RowSelectionButton>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                RowSelectionButton,
            ],
            imports: [
                BrowserModule,
                MaterialModule,
                RouterTestingModule,
                HttpClientTestingModule,
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
        fixture = TestBed.createComponent(RowSelectionButton);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
