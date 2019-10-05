import { TestBed } from '@angular/core/testing';

import { WebStorageService } from './web-storage.service';

describe('WebStorageService', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        const service: WebStorageService = TestBed.get(WebStorageService);
        expect(service).toBeTruthy();
    });
});
