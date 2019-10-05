import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MasterDataLoader } from '../../entities/data-loader';
import { PagingOptions } from '../../entities/http-services/paging-options';
import { ApiPaginatedCollection } from '../common/models';
import { MasterdataService } from '../http-services/masterdata.service';
import { Port } from '../../entities/port.entity';

@Injectable()
export class PortsDataLoader implements MasterDataLoader {
    constructor(private masterDataService: MasterdataService) { }

    getData(searchTerm: string,
        pagingOptions: PagingOptions): Observable<Port[]> {

        const list = this.masterDataService.getPorts(searchTerm, pagingOptions)
            .pipe(
                map((data) => {
                    return data.value;
                }),
            );

        return list;
    }
}
