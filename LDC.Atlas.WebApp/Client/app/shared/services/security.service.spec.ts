import { HttpClientTestingModule } from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { OAuthService, UrlHelperService } from 'angular-oauth2-oidc';
import { AuthorizationService } from '../../core/services/authorization.service';
import { DiscoveryService } from './discovery.service';
import { UserIdentityService } from './http-services/user-identity.service';
import { SecurityService } from './security.service';

describe('SecurityService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
                RouterTestingModule,
            ],
            providers: [
                SecurityService,
                UserIdentityService,
                OAuthService,
                UrlHelperService,
                AuthorizationService,
                DiscoveryService,
            ],
        });
    });

    it('should be created', inject([SecurityService], (service: SecurityService) => {
        expect(service).toBeTruthy();
    }));
});
