import { HttpClientTestingModule } from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CompanyManagerService } from '../../core/services/company-manager.service';
import { GridConfigurationProviderService } from './grid-configuration-provider.service';
import { GridConfigurationService } from './http-services/grid-configuration.service';

describe('GridConfigurationProviderService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
                RouterTestingModule,
            ],
            providers: [
                GridConfigurationService,
                CompanyManagerService,
            ],
        });
    });

    it('should be created', inject([GridConfigurationProviderService], (service: GridConfigurationProviderService) => {
        expect(service).toBeTruthy();
    }));
});
