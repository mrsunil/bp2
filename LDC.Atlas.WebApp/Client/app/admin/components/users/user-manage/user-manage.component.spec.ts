import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, QueryList } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { OAuthService, UrlHelperService } from 'angular-oauth2-oidc';
import { of } from 'rxjs';
import { BrowserAnimationsModule } from '../../../../../../node_modules/@angular/platform-browser/animations';
import { CompanyManagerService } from '../../../../core/services/company-manager.service';
import { Company } from '../../../../shared/entities/company.entity';
import { MasterData } from '../../../../shared/entities/masterdata.entity';
import { MaterialModule } from '../../../../shared/material.module';
import { MockMasterdataService } from '../../../../shared/mocks/mock-masterdata-service';
import { MockSecurityService } from '../../../../shared/mocks/mock-security-service';
import { MockUserIdentityService } from '../../../../shared/mocks/mock-user-identity-service';
import { DiscoveryService } from '../../../../shared/services/discovery.service';
import { MasterdataService } from '../../../../shared/services/http-services/masterdata.service';
import { UserIdentityService } from '../../../../shared/services/http-services/user-identity.service';
import { SecurityService } from '../../../../shared/services/security.service';
import { SnackbarService } from '../../../../shared/services/snackbar.service';
import { SharedModule } from '../../../../shared/shared.module';
import { PermissionLineComponent } from './permission-line/permission-line.component';
import { UserManageComponent } from './user-manage.component';

describe('UserManageComponent', () => {
    let component: UserManageComponent;
    let fixture: ComponentFixture<UserManageComponent>;
    const companies: Company[] = [
        {
            companyId: 's4',
            description: '',
            activeDate: null,
            timezone: '',
            statutoryCurrencyCode: '',
            functionalCurrencyCode: '',
            companyDate: null,
            lastDateRefresh: null,
        },
        {
            companyId: 'e3',
            description: '',
            activeDate: null,
            timezone: '',
            statutoryCurrencyCode: '',
            functionalCurrencyCode: '',
            companyDate: null,
            lastDateRefresh: null,
        },
    ];

    const masterData: MasterData = new MasterData();
    masterData.companies = companies;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [UserManageComponent, PermissionLineComponent],
            imports: [
                MaterialModule,
                FormsModule,
                ReactiveFormsModule,
                RouterTestingModule,
                SharedModule,
                BrowserModule,
                BrowserAnimationsModule,
                HttpClientTestingModule,
            ],
            providers: [
                [{ provide: UserIdentityService, useClass: MockUserIdentityService }],
                [{
                    provide: ActivatedRoute,
                    useValue:
                    {
                        data: of({
                            isCreation: false,
                        }),
                        snapshot: {
                            data: {
                                masterdata: masterData,
                            },
                            paramMap: convertToParamMap({
                                userId: encodeURIComponent('johndoe@test.com'),
                            }),
                        },
                    },
                }],
                [{ provide: SecurityService, useClass: MockSecurityService }],
                [{ provide: MasterdataService, useClass: MockMasterdataService }],
                CompanyManagerService,
                UrlHelperService,
                OAuthService,
                SnackbarService,
                DiscoveryService,
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(UserManageComponent);
        component = fixture.componentInstance;
        component.permissionLineComponents = new QueryList<PermissionLineComponent>();
        fixture.detectChanges();
    });

    // TODO - recreate the tests by fixing the issue
    // _this.departmentDropdownComponent.setData is not a function - error from Karma tests
});
