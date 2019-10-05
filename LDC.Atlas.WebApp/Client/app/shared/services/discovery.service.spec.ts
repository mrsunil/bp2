import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';
import { DiscoveryService } from './discovery.service';


describe('ConfigurationService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule
            ],
            providers: [
                DiscoveryService,
                HttpClient
            ]
        });
    });

  it('should be created', inject([DiscoveryService], (service: DiscoveryService) => {
    expect(service).toBeTruthy();
  }));
});
