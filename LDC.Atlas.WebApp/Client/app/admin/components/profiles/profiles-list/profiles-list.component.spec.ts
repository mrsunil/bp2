import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { OAuthService, UrlHelperService } from 'angular-oauth2-oidc';
import { MaterialModule } from '../../../../shared/material.module';
import { DiscoveryService } from '../../../../shared/services/discovery.service';
import { SecurityService } from '../../../../shared/services/security.service';
import { SharedModule } from '../../../../shared/shared.module';
import { ProfilesListComponent } from './profiles-list.component';

describe('ProfilesListComponent', () => {
    let component: ProfilesListComponent;
    let fixture: ComponentFixture<ProfilesListComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ProfilesListComponent],
            imports: [
                BrowserModule,
                BrowserAnimationsModule,
                MaterialModule,
                RouterTestingModule,
                HttpClientTestingModule,
                SharedModule,
            ],
            providers: [
                SecurityService,
                OAuthService,
                UrlHelperService,
                DiscoveryService,
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ProfilesListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
