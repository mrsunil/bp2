import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';
import { UiService } from '../../shared/services/ui.service';

@Injectable()
export class ReferentialMasterDataTitleResolver implements Resolve<string> {
    constructor(
        protected uiService: UiService,
    ) { }

    resolve(route: ActivatedRouteSnapshot): Observable<string> {
        return of(this.uiService.getMasterDataFriendlyName(route.params['name']));
    }
}
