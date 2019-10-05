import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MasterDataLoader } from '../../entities/data-loader';
import { ExecutionService } from '../http-services/execution.service';
import { User } from '../../entities/user.entity';

@Injectable()
export class CharterManagerDataLoader implements MasterDataLoader {
    constructor(private executionService: ExecutionService) { }

    getData(): Observable<User[]> {
        const list = this.executionService.getAllCharterManagers()
            .pipe(
                map((data) => {
                    return data.value;
                }),
            );

        return list;
    }

}
