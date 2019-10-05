import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { CompanyManagerService } from '../../../core/services/company-manager.service';
import { LdeomAccrual } from '../../entities/ldeom-accrual.entity';
import { LdeomAggregation } from '../../entities/ldeom-aggregation.entity';
import { HttpBaseService } from './http-base.service';

@Injectable({
    providedIn: 'root',
})
export class ControllingService extends HttpBaseService {

    private readonly valuationControllerUrl = 'Valuation';
    private readonly reportingControllerUrl = 'Reporting';

    constructor(protected http: HttpClient,
        private companyManager: CompanyManagerService) {
        super(http);
    }

    getAccrualsForLdeomReport(): Observable<LdeomAccrual[]> {
        const company: string = this.companyManager.getCurrentCompanyId();

        const accruals: Observable<LdeomAccrual[]> =
            this.get<LdeomAccrual[]>(`${environment.controllingServiceLink}/${this.reportingControllerUrl}` +
                `/${encodeURIComponent(String(company))}/Ldeom/Accruals/`);
        return accruals;
    }

    getAggregationsForLdeomReport(): Observable<LdeomAggregation[]> {
        const company: string = this.companyManager.getCurrentCompanyId();

        return this.get<LdeomAggregation[]>(
            `${environment.controllingServiceLink}/${this.reportingControllerUrl}` +
            `/${encodeURIComponent(String(company))}/Ldeom/Aggregations/`);
    }
}
