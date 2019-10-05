import { TestBed, inject } from '@angular/core/testing';

import { CookiesService } from './cookies.service';
import { CookieService } from "ngx-cookie-service";

describe('CookieServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
        providers: [CookiesService,
            CookieService]
    });
  });

  it('should be created', inject([CookiesService], (service: CookiesService) => {
    expect(service).toBeTruthy();
  }));
});
