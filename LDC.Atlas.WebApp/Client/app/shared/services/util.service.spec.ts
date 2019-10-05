import { HttpClientTestingModule } from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { UtilService } from './util.service';

describe('UtilService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
                RouterTestingModule,
            ],
            providers: [UtilService],
        });
    });

    it('should be created', inject([UtilService], (service: UtilService) => {
        expect(service).toBeTruthy();
    }));
});
