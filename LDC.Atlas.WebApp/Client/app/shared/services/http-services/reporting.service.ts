import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Moment } from 'moment';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { CompanyManagerService } from '../../../core/services/company-manager.service';
import { ListAndSearchFilterDto } from '../../dtos/list-and-search/list-and-search-filter-dto.dto';
import { HttpRequestOptions } from '../../entities/http-services/http-request-options.entity';
import { LdrepManualAdjustmentRecords } from '../../entities/ldrep-manual-adjustment-records.entity';
import { LdrepManualAdjustment } from '../../entities/ldrep-manual-adjustment.entity';
import { ListAndSearchFilter } from '../../entities/list-and-search/list-and-search-filter.entity';
import { ApiCollection } from '../common/models';
import { PredicateReference } from '../reporting/dtos/predicate-reference';
import { ReportCriteriasRequest } from '../reporting/dtos/report-criterias-request';
import { HttpBaseService } from './http-base.service';

@Injectable({
    providedIn: 'root',
})
export class ReportingService extends HttpBaseService {
    private readonly reportPredicatesControllerUrl = 'reportpredicates';
    private readonly ldrepManualAdjustmentControllerUrl = 'ldrepmanualadjustment';
    private readonly PnlMovementControllerUrl = 'pnlmovement';

    constructor(protected http: HttpClient,
        private companyManager: CompanyManagerService) {
        super(http);
    }

    public createReportCriterias(gridId: string, filters: ListAndSearchFilter[]): Observable<PredicateReference> {
        const company: string = this.companyManager.getCurrentCompanyId();
        const filtersForColumns: ListAndSearchFilterDto[] = filters.map((filter) => {
            return new ListAndSearchFilterDto(filter);
        });
        const request: ReportCriteriasRequest = {
            gridName: gridId,
            clauses: { clauses: filtersForColumns },
        };

        return this.post<PredicateReference>(
            `${environment.reportingServiceLink}/${encodeURIComponent(String(company))}/${this.reportPredicatesControllerUrl}`, request);
    }

    public createUpdateLdrepManualAdjustment(adjustments: LdrepManualAdjustment): Observable<LdrepManualAdjustment> {
        const company: string = this.companyManager.getCurrentCompanyId();
        return this.post<LdrepManualAdjustment>(
            `${environment.reportingServiceLink}/${encodeURIComponent(String(company))}`
            + `/${this.ldrepManualAdjustmentControllerUrl}/createupdateadjustment`, adjustments);
    }

    public deleteLdrepManualAdjustments(ldrepManualAdjustment: LdrepManualAdjustment) {
        const company: string = this.companyManager.getCurrentCompanyId();

        const action = `${environment.reportingServiceLink}/${encodeURIComponent(String(company))}`
            + `/${this.ldrepManualAdjustmentControllerUrl}/deletemanualadjustment`;

        return this.post<LdrepManualAdjustment>(action, ldrepManualAdjustment);
    }

    public getAllLdrepManualAdjustments(fromDate: Date, toDate: Date): Observable<ApiCollection<LdrepManualAdjustmentRecords>> {
        const company: string = this.companyManager.getCurrentCompanyId();

        const options: HttpRequestOptions = new HttpRequestOptions();
        options.headers = this.defaultHttpHeaders;

        let queryParameters = new HttpParams();
        if (fromDate) {
            queryParameters = queryParameters.set('fromDate', fromDate.toISOString());
        }
        if (toDate) {
            queryParameters = queryParameters.set('toDate', toDate.toISOString());
        }

        options.params = queryParameters;

        return this.get<ApiCollection<LdrepManualAdjustmentRecords>>(
            `${environment.reportingServiceLink}/${encodeURIComponent(String(company))}`
            + `/${this.ldrepManualAdjustmentControllerUrl}/getldrepmanualadjustments`, options);
    }

    public getPnlMovementSummaryMessage(companyList: string[], dataVersionId: number[], compDataVersionId: number[]): Observable<string> {
        const company: string = this.companyManager.getCurrentCompanyId();
        const options: HttpRequestOptions = new HttpRequestOptions();
        options.headers = this.defaultHttpHeaders;

        let queryParameters = new HttpParams();
        if (companyList) {
            queryParameters = queryParameters.set('companyList', companyList.toString());
        }
        if (dataVersionId) {
            queryParameters = queryParameters.set('dataVersionIdList', dataVersionId.toString());
        }
        if (compDataVersionId) {
            queryParameters = queryParameters.set('compDataVersionIdList', compDataVersionId.toString());
        }
        options.params = queryParameters;
        return this.get<string>(
            `${environment.reportingServiceLink}/${encodeURIComponent(String(company))}`
            + `/${this.PnlMovementControllerUrl}`, options);
    }
}
