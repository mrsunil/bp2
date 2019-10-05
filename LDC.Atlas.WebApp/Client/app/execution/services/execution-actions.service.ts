import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { CompanyManagerService } from '../../core/services/company-manager.service';
import { CashRecord } from '../../shared/services/execution/dtos/cash-record';
import { ListAndSearchFilter } from '../../shared/entities/list-and-search/list-and-search-filter.entity';

@Injectable({
    providedIn: 'root',
})

export class ExecutionActionsService {

    public editCashSubject = new Subject();
    public displayCashSubject = new Subject();
    public charterGroupFunctionsSubject = new Subject();
    public EditCriteriaRetainFilter: ListAndSearchFilter[];

    constructor(
        private companyManager: CompanyManagerService,
        private router: Router) {

        this.editCashSubject.subscribe((value: CashRecord) => {
            this.router.navigate(
                ['/' + this.companyManager.getCurrentCompanyId() + '/execution/cash/edit/'
                    + value.costDirectionId + '/', value.cashId],
            );
        });

        this.displayCashSubject.subscribe((value: CashRecord) => {
            this.router.navigate(
                ['/' + this.companyManager.getCurrentCompanyId() + '/execution/cash/display/'
                    + value.costDirectionId + '/', value.cashId],
            );
        });

        this.charterGroupFunctionsSubject.subscribe(() => {
            this.router.navigate([this.companyManager.getCurrentCompanyId() + '/execution/charter/groupfunctions']);
        });

    }

}
