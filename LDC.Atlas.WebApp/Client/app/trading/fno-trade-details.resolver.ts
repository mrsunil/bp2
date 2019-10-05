
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { FixPricedSection } from '../shared/entities/fix-priced-section.entity';
import { FuturesOptionsPricedSection } from '../shared/entities/futures-options-priced-section.entity';
import { PricingMethods } from '../shared/enums/pricing-method.enum';
import { TradingService } from '../shared/services/http-services/trading.service';

@Injectable()
export class FnoTradeDetailsResolver implements Resolve<FuturesOptionsPricedSection | FixPricedSection> {
    constructor(private tradingService: TradingService) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
        Observable<FuturesOptionsPricedSection | FixPricedSection> {

        const sectionId = Number(route.params.sectionId);

        return this.tradingService.getSection(sectionId, PricingMethods.FnO);
    }
}
