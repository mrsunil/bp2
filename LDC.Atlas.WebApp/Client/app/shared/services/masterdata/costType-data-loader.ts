import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CostType } from '../../entities/cost-type.entity';
import { MasterDataLoader } from '../../entities/data-loader';
import { PagingOptions } from '../../entities/http-services/paging-options';
import { ApiPaginatedCollection } from '../common/models';
import { MasterdataService } from '../http-services/masterdata.service';

@Injectable()
export class CostTypeDataLoader implements MasterDataLoader {
    constructor(private masterDataService: MasterdataService) { }

    getData(searchTerm: string,
        pagingOptions: PagingOptions): Observable<CostType[]> {

        const list = this.masterDataService.getCostTypes(searchTerm, pagingOptions)
            .pipe(
                map((data) => {
                    return data.value;
                }),
            );

        return list;
    }
}
