import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Charter } from '../../entities/charter.entity';
import { MasterDataLoader } from '../../entities/data-loader';
import { ExecutionService } from '../http-services/execution.service';

@Injectable()
export class CharterDataLoader implements MasterDataLoader {
    constructor(private executionService: ExecutionService) { }

    getData(): Observable<Charter[]> {
        const list = this.executionService.getCharters()
            .pipe(
                map((data) => {
                    return data.value ? data.value.sort
                        ((a, b) => (a.charterCode > b.charterCode) ? 1 : -1) : data.value;
                }),
            );

        return list;
    }
}
