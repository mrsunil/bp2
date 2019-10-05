import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { CompanyManagerService } from '../../core/services/company-manager.service';
import { CompanyTabIndex } from '../entities/company-tab-index';

@Injectable({
    providedIn: 'root',
})

export class AdminActionsService {

    public editCompanySubject = new Subject();
    public createCompanySubject = new Subject();
    public userPreferenceSubject = new Subject();

    constructor(
        private companyManager: CompanyManagerService,
        private router: Router) {
        this.editCompanySubject.subscribe((companyTabIndex: CompanyTabIndex) => {
            const companyId = companyTabIndex.companyId;
            const tabIndex = companyTabIndex.tabIndex;
            if (!companyId || tabIndex < 0) { return; }
            this.router.navigate(['/' + this.companyManager.getCurrentCompanyId() + '/admin/company-configuration/edit'
                , companyId, tabIndex]);
        });

        this.createCompanySubject.subscribe(() => {
            this.router.navigate(['/' + this.companyManager.getCurrentCompanyId() + '/admin/companies/create']);
        });
        this.userPreferenceSubject.subscribe(() => {
            this.router.navigate(['/' + this.companyManager.getCurrentCompanyId() + '/admin/global-parameters/user-preferences/']);
        });

    }
}
