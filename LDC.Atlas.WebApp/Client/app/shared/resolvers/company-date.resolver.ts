import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { concatMap } from 'rxjs/operators';
import { CompanyManagerService } from '../../core/services/company-manager.service';
import { SecurityService } from '../services/security.service';

@Injectable()
export class CompanyDateResolver
    implements Resolve<moment.Moment> {
    constructor(
        private companyManager: CompanyManagerService,
        private securityService: SecurityService,
    ) { }

    resolve(
        route: ActivatedRouteSnapshot,
    ): Observable<moment.Moment> {
        return this.securityService.isSecurityReady().pipe(
            concatMap(() => {
                const company = route.params['company'];
                this.companyManager.refreshCurrentCompany(company);
                return this.companyManager.refreshCompanyDate(company);
            }),
        );

    }
}
