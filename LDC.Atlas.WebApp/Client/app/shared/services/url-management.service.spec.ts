import { TestBed, inject } from '@angular/core/testing';

import { UrlManagementService } from './url-management.service';
import { Router } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";

describe('UrlManagementService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule],
            providers: [UrlManagementService]
        });
    });

    it('should be created', inject([UrlManagementService], (service: UrlManagementService) => {
        expect(service).toBeTruthy();
    }));
});
