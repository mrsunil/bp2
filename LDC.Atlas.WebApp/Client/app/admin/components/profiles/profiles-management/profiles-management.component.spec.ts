import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { OAuthService, UrlHelperService } from 'angular-oauth2-oidc';
import { Privilege } from '../../../../shared/entities/privilege.entity';
import { PermissionLevels } from '../../../../shared/enums/permission-level.enum';
import { PrivilegeTypes } from '../../../../shared/enums/privilege-type.enum';
import { MaterialModule } from '../../../../shared/material.module';
import { DiscoveryService } from '../../../../shared/services/discovery.service';
import { SecurityService } from '../../../../shared/services/security.service';
import { SharedModule } from '../../../../shared/shared.module';
import { ProfilesManagementComponent } from './profiles-management.component';

describe('ProfilesManagementComponent', () => {
    let component: ProfilesManagementComponent;
    let fixture: ComponentFixture<ProfilesManagementComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
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
            schemas: [
                CUSTOM_ELEMENTS_SCHEMA,
            ],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ProfilesManagementComponent);
        component = fixture.componentInstance;

        component.privileges = [
            {
                privilegeId: 0,
                name: 'Trades',
                description: '',
                level: 1,
                parentId: null,
                type: null,
                permission: PermissionLevels.None,
                order: null,
            } as Privilege,
            {
                privilegeId: 1,
                name: 'Charters',
                description: '',
                level: 1,
                parentId: null,
                type: null,
                permission: PermissionLevels.None,
                order: null,
            } as Privilege,
            {
                privilegeId: 13,
                name: 'Physical Trades',
                description: '',
                level: 2,
                parentId: 0,
                type: null,
                permission: PermissionLevels.None,
                order: 1,
            } as Privilege,
            {
                privilegeId: 14,
                name: 'Futures Options Contracts',
                description: '',
                level: 2,
                parentId: 0,
                type: null,
                permission: PermissionLevels.None,
                order: 2,
            } as Privilege,
            {
                privilegeId: 26,
                name: 'Normal Charters',
                description: '',
                level: 2,
                parentId: 1,
                type: null,
                permission: PermissionLevels.None,
                order: 3,
            } as Privilege,
            {
                privilegeId: 63,
                name: 'Split',
                description: '',
                level: 3,
                parentId: 13,
                type: PrivilegeTypes.Action,
                permission: PermissionLevels.None,
                order: 4,
            } as Privilege,
            {
                privilegeId: 64,
                name: 'BLDate',
                description: '',
                level: 3,
                parentId: 13,
                type: PrivilegeTypes.Exception,
                permission: PermissionLevels.None,
                order: 5,

            } as Privilege,
        ];

        component.privilegeTree = component.buildPrivilegeTree(component.privileges);

        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should give Read permission to level 2 when level 1 selected', () => {
        component.selectPrivilege(component.privilegeTree[0]);
        // assert equal
        expect(component.privilegeTree[0].children[0].getPermission()).toEqual(PermissionLevels.Read);
    });

    it('should display 2 delete, copy, cancel and save buttons in edition', fakeAsync(() => {
        // Arrange
        component.isCreation = false;

        // Arrange
        tick();
        fixture.detectChanges();

        // Assert
        expect(fixture.debugElement.nativeElement.querySelectorAll('button').length).toEqual(5);
    }));

    it('should display save, copy and cancel buttons in creation', fakeAsync(() => {
        // Arrange
        component.isCreation = true;

        // Arrange
        tick();
        fixture.detectChanges();

        // Assert
        expect(fixture.debugElement.nativeElement.querySelectorAll('button').length).toEqual(3);
    }));

});
