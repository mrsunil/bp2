import { HttpClientTestingModule } from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AutocompleteService } from './autocomplete.service';
import { UtilService } from './util.service';

describe('AutocompleteService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
                RouterTestingModule,
            ],
            providers: [AutocompleteService, UtilService],
        });
    });

    it('should be created', inject([AutocompleteService], (service: AutocompleteService) => {
        expect(service).toBeTruthy();
    }));
});
