import { HttpClientTestingModule } from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CompanyManagerService } from '../../core/services/company-manager.service';
import { FilterProviderService } from './filter-provider.service';

describe('FilterProviderService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
                RouterTestingModule,
            ],
            providers: [
                FilterProviderService,
                CompanyManagerService,
            ],
        });
    });

    it('should be created', inject([FilterProviderService], (service: FilterProviderService) => {
        expect(service).toBeTruthy();
    }));
});
