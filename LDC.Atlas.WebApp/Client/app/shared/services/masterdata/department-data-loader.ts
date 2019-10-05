import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MasterDataLoader } from '../../entities/data-loader';
import { Department } from '../../entities/department.entity';
import { PagingOptions } from '../../entities/http-services/paging-options';
import { ApiPaginatedCollection } from '../common/models';
import { MasterdataService } from '../http-services/masterdata.service';

@Injectable()
export class DepartmentDataLoader implements MasterDataLoader {
    constructor(private masterDataService: MasterdataService) { }

    getData(searchTerm: string,
        pagingOptions: PagingOptions): Observable<Department[]> {

        const list = this.masterDataService.getDepartments(searchTerm, pagingOptions)
            .pipe(
                map((data) => {
                    return data.value;
                }),
            );

        return list;
    }
}
