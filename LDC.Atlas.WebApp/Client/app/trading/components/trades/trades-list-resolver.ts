import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { Observable } from "rxjs";
import { SectionSearchResult } from '../../../shared/dtos/section-search-result';
import { TradingService } from "../../../shared/services/http-services/trading.service";
import { SecurityService } from "../../../shared/services/security.service";

@Injectable()
export class TradesListResolver implements Resolve<SectionSearchResult[]> {
    isLoading: boolean;

    constructor(private securityService: SecurityService, private tradingService: TradingService, private router: Router) {
        this.isLoading = true;
    }

    resolve(route: ActivatedRouteSnapshot): Observable<SectionSearchResult[]> {
        this.securityService.isSecurityReady().subscribe(() => {
            const trades = this.tradingService.getAll();
            this.isLoading = false;
            return trades;
        });

        return null;
    }
}
