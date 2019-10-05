import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { CompanyManagerService } from '../../../core/services/company-manager.service';
import { BulkEditSearchResult } from '../../dtos/bulkEdit-search-result';
import { ReferentialCounterpartiesSearchResult } from '../../dtos/referential-Counterparties-search-result';
import { HttpRequestOptions } from '../../entities/http-services/http-request-options.entity';
import { ListAndSearchRequest } from '../../entities/list-and-search/list-and-search-request.entity';
import { ApiPaginatedCollection } from '../common/models';
import { HttpBaseService } from './http-base.service';

@Injectable({
    providedIn: 'root',
})

export class ReferentialCounterpartiesService extends HttpBaseService {
    private readonly clientDetailsControllerUrl = 'clientDetails';
    constructor(
        http: HttpClient,
        private companyManager: CompanyManagerService,
    ) {
        super(http);
    }
    search(request: ListAndSearchRequest, showDuplicateCounterpartyData: boolean): Observable<ApiPaginatedCollection<ReferentialCounterpartiesSearchResult>> {
        const company: string = this.companyManager.getCurrentCompanyId();
        const options: HttpRequestOptions = new HttpRequestOptions();
        options.headers = this.defaultHttpHeaders;
        let queryParameters = new HttpParams();
        queryParameters = queryParameters.set('showDuplicateCounterpartyData', showDuplicateCounterpartyData.toString());
        options.params = queryParameters;
        return this.post<ApiPaginatedCollection<ReferentialCounterpartiesSearchResult>>(
            `${environment.reportingServiceLink}/${encodeURIComponent(String(company))}/${this.clientDetailsControllerUrl}/search`, request, options);
    }

    getBulkEditdata(request: ListAndSearchRequest): Observable<ApiPaginatedCollection<BulkEditSearchResult>> {
        const company: string = this.companyManager.getCurrentCompanyId();

        return this.post<ApiPaginatedCollection<BulkEditSearchResult>>(
            `${environment.reportingServiceLink}/${encodeURIComponent(String(company))}/${this.clientDetailsControllerUrl}/getBulkEditdata`, request);
    }
}
