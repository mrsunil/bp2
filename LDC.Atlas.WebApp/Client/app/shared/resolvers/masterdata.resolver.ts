import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { forkJoin as observableForkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MasterData } from '../entities/masterdata.entity';
import { MasterdataService } from '../services/http-services/masterdata.service';

@Injectable()
export class MasterDataResolver implements Resolve<MasterData> {
    constructor(private masterDataService: MasterdataService) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
        Observable<MasterData> {
        const masterdataList = route.data['masterdataList'] as string[];
        const masterdataWithoutCompanyList = route.data['masterdataWithoutCompanyList'] as string[];
        const company = route.params['company'];

        return observableForkJoin([
            this.masterDataService.getMasterData(masterdataList, company),
            this.masterDataService.getMasterData(masterdataWithoutCompanyList, company, true),
        ]).pipe(
            map((results) => {
                const masterdata = results[0];
                this.masterDataService.concatMasterdataWitoutCompany(results[1]);
                return masterdata;
            }));
    }
}
