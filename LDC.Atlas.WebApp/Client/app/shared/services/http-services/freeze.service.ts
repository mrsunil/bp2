import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { CompanyManagerService } from '../../../core/services/company-manager.service';
import { FreezeSearchForCompany } from '../../entities/freeze-search-for-company.entity';
import { Freeze } from '../../entities/freeze.entity';
import { FreezeType } from '../../enums/freeze-type.enum';
import { ApiPaginatedCollection } from '../common/models';
import { CreateFreezeCommand } from '../freeze/dtos/create-freeze-command';
import { HttpRequestOptions } from './../../entities/http-services/http-request-options.entity';
import { HttpBaseService } from './http-base.service';

@Injectable({
    providedIn: 'root',
})
export class FreezeService extends HttpBaseService {

    private readonly freezeControllerUrl = 'Freezes';

    constructor(
        protected httpClient: HttpClient,
        private companyManager: CompanyManagerService,
    ) {
        super(httpClient);
    }

    public getFreezeList(
        dateFrom: Date = null,
        dateTo: Date = null,
        freezeType: FreezeType = null,
    ): Observable<ApiPaginatedCollection<Freeze>> {
        const company: string = this.companyManager.getCurrentCompanyId();

        const options: HttpRequestOptions = new HttpRequestOptions();
        let queryParameters = new HttpParams();
        if (dateFrom) {
            queryParameters = queryParameters.set('dateFrom', dateFrom.toISOString());
        }
        if (dateTo) {
            queryParameters = queryParameters.set('dateTo', dateTo.toISOString());
        }
        if (freezeType) {
            queryParameters = queryParameters.set('dataVersionTypeId', freezeType.toString());
        }
        options.params = queryParameters;

        return this.get<ApiPaginatedCollection<Freeze>>(
            `${environment.freezeServiceLink}/${encodeURIComponent(company)}/${this.freezeControllerUrl}`, options);
    }

    public getFreezeByDataVersionId(dataVersionId: number): Observable<Freeze> {
        const company: string = this.companyManager.getCurrentCompanyId();

        return this.get<Freeze>(
            // tslint:disable-next-line:max-line-length
            `${environment.freezeServiceLink}/${encodeURIComponent(company)}/${this.freezeControllerUrl}/${encodeURIComponent(String(dataVersionId))}`);
    }

    public checkFreezeExists(dataVersionType: FreezeType, freezeDate: Date): Observable<boolean> {
        const company: string = this.companyManager.getCurrentCompanyId();

        const apiUrl = `${encodeURIComponent(String(company))}/${this.freezeControllerUrl}`;
        return this.http.head(
            `${environment.freezeServiceLink}/${apiUrl}/${Number(dataVersionType)}` +
            `/${freezeDate.toUTCString()}`,
            {
                headers: this.defaultHttpHeaders,
                observe: 'response',
            })
            .pipe(map((resp) => resp.status === 200));
    }

    public createFreeze(dataVersionTypeId: FreezeType, freezeDate: Date): Observable<any> {
        const company: string = this.companyManager.getCurrentCompanyId();
        const request: CreateFreezeCommand = {
            company,
            dataVersionTypeId,
            freezeDate,
        };

        return this.post<any>(
            `${environment.freezeServiceLink}/${encodeURIComponent(company)}/${this.freezeControllerUrl}`, request);
    }

    public deleteFreeze(dataVersionId: number) {
        const company: string = this.companyManager.getCurrentCompanyId();

        return this.delete(
            // tslint:disable-next-line:max-line-length
            `${environment.freezeServiceLink}/${encodeURIComponent(company)}/${this.freezeControllerUrl}/${encodeURIComponent(String(dataVersionId))}`);
    }

    public recalculateFreeze(dataVersionId: number, recalculateAccEntries: boolean = true) {
        const company: string = this.companyManager.getCurrentCompanyId();

        const options: HttpRequestOptions = new HttpRequestOptions();
        let queryParameters = new HttpParams();
        queryParameters = queryParameters.set('recalculateAccEntries', recalculateAccEntries.toString());
        options.params = queryParameters;

        return this.post(
            `${environment.freezeServiceLink}/${encodeURIComponent(company)}/` +
            `${this.freezeControllerUrl}/${encodeURIComponent(String(dataVersionId))}/recalculate`,
            null, options);
    }

    public toFormattedDate(dataVersionTypeId: FreezeType, date: Date) {
        const momentToFormat: moment.Moment = moment(date);

        switch (dataVersionTypeId) {
            case FreezeType.Monthly:
                return momentToFormat.format('MMM YYYY').toUpperCase();
            case FreezeType.Daily:
                return momentToFormat.format('DD MMM YYYY').toUpperCase();
            case FreezeType.Current:
                return 'CURRENT';
            default:
                return '';
        }
    }

    public checkFreezeForSelectedDatabase(companyList: string[], dataVersionTypeId: FreezeType, freezeDate: Date,
        comparisonDataVersionTypeId: FreezeType, comparisonDbDate: Date): Observable<FreezeSearchForCompany> {
        const company: string = this.companyManager.getCurrentCompanyId();

        const options: HttpRequestOptions = new HttpRequestOptions();
        let queryParameters = new HttpParams();
        if (companyList) {
            queryParameters = queryParameters.set('companyList', companyList.toString());
        }
        if (dataVersionTypeId) {
            queryParameters = queryParameters.set('dataVersionTypeId', (freezeDate['dataVersionId'] !== -1) ?
                dataVersionTypeId.toString() : '');
        }
        if (freezeDate) {
            queryParameters = queryParameters.set('freezeDate', (freezeDate['dataVersionId'] !== -1) ?
                freezeDate['freezeDate'].toString() : '');
        }
        if (comparisonDataVersionTypeId) {
            queryParameters = queryParameters.set('comparisonDataVersionTypeId', comparisonDataVersionTypeId.toString());
        }
        if (comparisonDbDate) {
            queryParameters = queryParameters.set('comparisonDbDate', comparisonDbDate['freezeDate'].toString());
        }
        options.params = queryParameters;

        return this.get<FreezeSearchForCompany>(
            `${environment.freezeServiceLink}/${encodeURIComponent(company)}/` +
            `${this.freezeControllerUrl}/checkFreezeForMultipleCompanies`,
            options);
    }

    public getFreezeForSelectedCompany(companyList: string[], dataVersionTypeId: FreezeType, freezeDate: Date): Observable<Freeze> {
        const company: string = this.companyManager.getCurrentCompanyId();

        const options: HttpRequestOptions = new HttpRequestOptions();
        let queryParameters = new HttpParams();
        if (companyList) {
            queryParameters = queryParameters.set('companyList', companyList.toString());
        }
        if (dataVersionTypeId) {
            queryParameters = queryParameters.set('dataVersionTypeId', (freezeDate['dataVersionId'] !== -1) ?
                dataVersionTypeId.toString() : '');
        }
        if (freezeDate) {
            queryParameters = queryParameters.set('freezeDate', (freezeDate['dataVersionId'] !== -1) ?
                freezeDate['actualfreezeDate'].toString() : '');
        }
        options.params = queryParameters;
        return this.get<Freeze>(
            `${environment.freezeServiceLink}/${encodeURIComponent(company)}/` +
            `${this.freezeControllerUrl}/getFreezesForSelectedCompanies`,
            options);
    }
}
