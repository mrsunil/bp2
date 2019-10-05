import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MasterDataLoader } from '../../entities/data-loader';
import { MasterdataService } from '../http-services/masterdata.service';

import { CounterpartyTradeStatus } from '../../entities/counterparty-trade-status.entity';

@Injectable()
export class CounterpartyTradeStatusDataLoader implements MasterDataLoader {
    constructor(private masterDataService: MasterdataService) { }

    getData(): Observable<CounterpartyTradeStatus[]> {

        const list = this.masterDataService.getCounterpartyTradeStatus()
            .pipe(
                map((data) => {
                    return data.value;
                }),
            );

        return list;
    }
}