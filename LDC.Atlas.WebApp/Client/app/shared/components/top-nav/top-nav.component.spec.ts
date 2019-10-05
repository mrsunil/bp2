import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserModule } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { OAuthService, UrlHelperService } from 'angular-oauth2-oidc';
import { AuthorizationService } from '../../../core/services/authorization.service';
import { DateConverterService } from '../../../shared/services/date-converter.service';
import { User } from '../../entities/user.entity';
import { MaterialModule } from '../../material.module';
import { MockUserIdentityService } from '../../mocks/mock-user-identity-service';
import { UserIdentityService } from '../../services/http-services/user-identity.service';
import { UiService } from '../../services/ui.service';
import { TopNavComponent } from './top-nav.component';

class MockAuthorizationService extends AuthorizationService {
    getCurrentUser() {
        const user: User = {
            userId: 1,
            azureObjectIdentifier: '1.2.840.113556.1.8000.999999',
            samAccountName: 'johndoe@test.com',
            userPrincipalName: 'johndoe@test.com',
            displayName: 'John Doe',
            firstName: 'John',
            lastName: 'Doe',
            email: 'johndoe@test.com',
            phoneNumber: '0723456789',
            location: 'France',
            favoriteLanguage: 'FR-fr',
            isDisabled: false,
            createdDateTime: new Date(),
            createdBy: 'Atlas',
            modifiedDateTime: new Date(),
            modifiedBy: 'Atlas',
            lastConnectionDateTime: new Date(),
            permissions: null,
        };
        return user;
    }
}

describe('TopNavComponent', () => {
    let component: TopNavComponent;
    let fixture: ComponentFixture<TopNavComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [TopNavComponent],
            imports: [
                BrowserModule,
                MaterialModule,
                RouterTestingModule,
                HttpClientTestingModule,
            ],
            providers: [
                [{ provide: UserIdentityService, useClass: MockUserIdentityService }],
                [{ provide: AuthorizationService, useClass: MockAuthorizationService }],
                [{ provide: UiService }],
                OAuthService,
                UrlHelperService,
                DateConverterService,
                UiService,
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TopNavComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });
});
