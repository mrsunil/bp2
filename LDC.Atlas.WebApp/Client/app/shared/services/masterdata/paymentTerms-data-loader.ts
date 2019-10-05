import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MasterDataLoader } from '../../entities/data-loader';
import { PagingOptions } from '../../entities/http-services/paging-options';
import { ApiPaginatedCollection } from '../common/models';
import { MasterdataService } from '../http-services/masterdata.service';

import { PaymentTerm } from '../../entities/payment-term.entity';

@Injectable()
export class PaymentTermsDataLoader implements MasterDataLoader {
    constructor(private masterDataService: MasterdataService) { }

    getData(searchTerm: string,
        pagingOptions: PagingOptions): Observable<PaymentTerm[]> {

        const list = this.masterDataService.getPaymentTerms(searchTerm, pagingOptions)
            .pipe(
                map((data) => {
                    return data.value;
                }),
            );

        return list;
    }
}
