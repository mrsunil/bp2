import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TradingService } from '../http-services/trading.service';
import { MasterDataLoader } from '../../entities/data-loader';
import { Trader } from '../../entities/trader.entity';

@Injectable()
export class TradeContextualDataLoader implements MasterDataLoader {

    constructor(private tradingService: TradingService) { }

    getData(): Observable<Trader[]> {
        const list =this.tradingService.getAllTraders()
            .pipe(
                map((data) => {
                    return data.value;
                }),
            );
        return list;
    }
}
