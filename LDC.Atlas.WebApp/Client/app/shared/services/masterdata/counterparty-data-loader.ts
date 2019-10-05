import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Counterparty } from '../../entities/counterparty.entity';
import { MasterDataLoader } from '../../entities/data-loader';
import { PagingOptions } from '../../entities/http-services/paging-options';
import { ApiPaginatedCollection } from '../common/models';
import { MasterdataService } from '../http-services/masterdata.service';

@Injectable()
export class CounterPartyDataLoader implements MasterDataLoader {
    constructor(private masterDataService: MasterdataService) { }

    getData(searchTerm: string,
        pagingOptions: PagingOptions): Observable<Counterparty[]> {

        const list = this.masterDataService.getCounterparties(searchTerm, pagingOptions)
            .pipe(
                map((data) => {
                    return data.value;
                }),
            );

        return list;
    }

    getDataById(counterpartyId): Observable<Counterparty[]> {

        const list = this.masterDataService.getCounterpartyById(counterpartyId)
            .pipe(
                map((data) => {
                    return data.value;
                }),
            );

        return list;
    }
}
