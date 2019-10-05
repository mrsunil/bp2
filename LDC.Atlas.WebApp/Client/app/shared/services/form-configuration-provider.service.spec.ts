import { HttpClientTestingModule } from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CompanyManagerService } from '../../core/services/company-manager.service';
import { FormConfigurationProviderService } from './form-configuration-provider.service';
import { FormConfigurationService } from './http-services/form-configuration.service';

describe('FormConfigurationProviderService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
                RouterTestingModule,
            ],
            providers: [
                FormConfigurationService,
                CompanyManagerService,
            ],
        });
    });

    it('should be created', inject([FormConfigurationProviderService], (service: FormConfigurationProviderService) => {
        expect(service).toBeTruthy();
    }));
});
