import { HttpClientTestingModule } from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { OAuthService, UrlHelperService } from 'angular-oauth2-oidc';
import { CompanyManagerService } from '../../core/services/company-manager.service';
import { MasterdataService } from './http-services/masterdata.service';

describe('MasterdataService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
                RouterTestingModule,
            ],
            providers: [
                MasterdataService,
                OAuthService,
                UrlHelperService,
                CompanyManagerService,
            ],
        });
    });

    it('should be created', inject([MasterdataService], (service: MasterdataService) => {
        expect(service).toBeTruthy();
    }));
});
