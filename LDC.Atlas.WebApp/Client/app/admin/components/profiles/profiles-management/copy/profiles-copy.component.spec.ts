import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { OAuthService, UrlHelperService } from 'angular-oauth2-oidc';
import { MaterialModule } from '../../../../../shared/material.module';
import { DiscoveryService } from '../../../../../shared/services/discovery.service';
import { SecurityService } from '../../../../../shared/services/security.service';
import { SharedModule } from '../../../../../shared/shared.module';
import { ProfilesManagementComponent } from '../profiles-management.component';
import { ProfilesCopyComponent } from './profiles-copy.component';

describe('ProfilesCopyComponent', () => {
    let component: ProfilesCopyComponent;
    let fixture: ComponentFixture<ProfilesCopyComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                ProfilesCopyComponent,
                ProfilesManagementComponent,
            ],
            imports: [
                MaterialModule,
                FormsModule,
                RouterTestingModule,
                SharedModule,
                BrowserModule,
                BrowserAnimationsModule,
                HttpClientTestingModule,
            ],
            providers: [
                SecurityService,
                UrlHelperService,
                OAuthService,
                DiscoveryService,
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ProfilesCopyComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should display cancel, save buttons', fakeAsync(() => {
        // Arrange
        component.isCreation = true;

        // Arrange
        tick();
        fixture.detectChanges();

        // Assert
        expect(fixture.debugElement.nativeElement.querySelectorAll('button').length).toEqual(2);
    }));
});
