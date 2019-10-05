import { HttpClientTestingModule } from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppInsightsLoggerService } from './app-insights-logger.service';

describe('AppInsightsLoggerService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [AppInsightsLoggerService],
            imports: [
                RouterTestingModule,
                HttpClientTestingModule,
            ],
        });
    });

    it('should be created', inject([AppInsightsLoggerService], (service: AppInsightsLoggerService) => {
        expect(service).toBeTruthy();
    }));
});
