import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MasterDataLoader } from '../../entities/data-loader';
import { MasterdataService } from '../http-services/masterdata.service';

import { AddressType } from '../../entities/address-type.entity';

@Injectable()
export class AddressTypeDataLoader implements MasterDataLoader {
    constructor(private masterDataService: MasterdataService) { }

    getData(): Observable<AddressType[]> {

        const list = this.masterDataService.getAddressType()
            .pipe(
                map((data) => {
                    return data.value;
                }),
            );

        return list;
    }
}
