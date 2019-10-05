import { HttpClient, HttpResponse } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { CompanyManagerService } from '../../../../core/services/company-manager.service';
import { ListAndSearchFilterDto } from '../../../dtos/list-and-search/list-and-search-filter-dto.dto';
import { HttpRequestOptions } from '../../../entities/http-services/http-request-options.entity';
import { ListAndSearchFilter } from '../../../entities/list-and-search/list-and-search-filter.entity';
import { ListAndSearchRequest } from '../../../entities/list-and-search/list-and-search-request.entity';
import { WINDOW } from '../../../entities/window-injection-token';
import { UtilService } from '../../util.service';
import { ListAndSearchExportBase } from './list-and-search-export-base';

@Injectable({
    providedIn: 'root',
})
export class ListAndSearchExportAdapter extends ListAndSearchExportBase {
    private gridUrls: Map<string, string>;
    private readonly sectionsControllerUrl = 'sections';
    private readonly companyToken = '__COMPANY__';

    constructor(protected httpClient: HttpClient,
        protected utilService: UtilService,
        @Inject(WINDOW) protected window: Window,
        private companyManager: CompanyManagerService) {
        super(httpClient, utilService, window);
        this.initializeGridMap();
    }

    sendExportRequest(
        gridCode: string,
        filters: ListAndSearchFilter[],
        dataVersionId?: number,
        gridViewId?: number): Observable<HttpResponse<Blob>> {
        const filtersForColumns: ListAndSearchFilterDto[] = filters.map((filter) => {
            return new ListAndSearchFilterDto(filter);
        });

        const request: ListAndSearchRequest = {
            clauses: { clauses: filtersForColumns },
            dataVersionId,
            gridViewId,
        };

        const options: HttpRequestOptions = new HttpRequestOptions();
        options.responseType = 'blob';
        options.observe = 'response';

        return this.post(
            this.getUrlByGridCode(gridCode),
            request,
            options);
    }

    private getUrlByGridCode(gridCode: string): string {
        const companyId = this.companyManager.getCurrentCompanyId();
        const url = this.gridUrls.get(gridCode);
        return url.replace(this.companyToken, companyId);
    }

    private initializeGridMap() {
        this.gridUrls = new Map<string, string>([
            ['tradeList',
                `${environment.tradeServiceLink}/${this.companyToken}/${this.sectionsControllerUrl}/search/export`],
        ]);
    }
}
