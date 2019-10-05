import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ListAndSearchFilterDto } from '../../dtos/list-and-search/list-and-search-filter-dto.dto';
import { ListAndSearchRequest } from '../../entities/list-and-search/list-and-search-request.entity';
import { TradingService } from '../http-services/trading.service';
import { MasterDataLoader } from '../../entities/data-loader';
import { Counterparty } from '../../entities/counterparty.entity';

@Injectable()
export class BankBrokerContextualDataLoader implements MasterDataLoader {

    constructor(private tradingService: TradingService) { }

    getData(): Observable<Counterparty[]> {
        const filtersForColumns: ListAndSearchFilterDto[] = [];
        const request: ListAndSearchRequest = {
            clauses: { clauses: filtersForColumns },
        };
        const list = this.tradingService.bankBrokerContextualSearch(request)
            .pipe(
                map((data) => {
                    return data.value;
                }),
            );
        return list;
    }
}
