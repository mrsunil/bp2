import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, Optional } from '@angular/core';
import { MAT_DATE_LOCALE } from '@angular/material';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MatMomentDateAdapterOptions } from '@angular/material-moment-adapter';
import * as moment from 'moment';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Company } from '../../shared/entities/company.entity';
import { ApiPaginatedCollection } from '../../shared/services/common/models';
import { HttpBaseService } from '../../shared/services/http-services/http-base.service';
import { UrlManagementService } from '../../shared/services/url-management.service';

@Injectable({
    providedIn: 'root',
})
export class CompanyManagerService extends HttpBaseService {
    private currentCompany: Company;
    private userLoadedCompanies: Company[] = null;
    private locale: string;
    private useUtc: boolean;

    constructor(protected http: HttpClient,
        private urlManager: UrlManagementService,
        @Optional() @Inject(MAT_DATE_LOCALE)
        private dateLocale: string,
        @Optional() @Inject(MAT_MOMENT_DATE_ADAPTER_OPTIONS)
        private options: MatMomentDateAdapterOptions) {
        super(http);
        this.locale = dateLocale || moment.locale();
        this.useUtc = this.options && this.options.useUtc;
    }

    initialize(companyIdList: string[]): Observable<void> {
        if (!this.userLoadedCompanies) {
            this.userLoadedCompanies = [];
            const observableList: Array<Observable<Company>> = [];

            companyIdList.forEach((companyId: string) => {
                observableList.push(this.get<Company>(
                    `${environment.masterDataServiceLink}/${encodeURIComponent(companyId)}`
                    + '/Companies/' + encodeURIComponent(companyId)));
            });

            if (observableList.length > 0) {
                return forkJoin(observableList).pipe(
                    map((companies: Company[]) => {
                        this.userLoadedCompanies = companies;
                        this.userLoadedCompanies.forEach((comp) => {
                            comp.lastDateRefresh = moment().subtract(1, 'days');
                        });
                    }));
            }
            return of(null);
        }
        return of(null);
    }

    getCurrentCompanyId(): string {
        return this.currentCompany ? this.currentCompany.companyId : '';
    }

    getCurrentCompany(): Company {
        return this.currentCompany;
    }

    getCompany(companyId: string): Company {
        return this.userLoadedCompanies.find((company: Company) => company.companyId === companyId);
    }

    getLoadedCompanies(): Company[] {
        return this.userLoadedCompanies;
    }

    changeCurrentCompany(companyId: string) {
        if (companyId !== this.currentCompany.companyId) {
            const companyIndex = this.userLoadedCompanies.findIndex((company: Company) => company.companyId === companyId);
            if (companyIndex > -1) {
                this.urlManager.navigateToCompany(companyId, this.currentCompany.companyId);
                this.currentCompany = this.userLoadedCompanies[companyId];
                // trigger company change event?
            }
        }
        /*
        else{
            // trigger no access to selected company
        }
        */
    }

    private getCompanyDate(companyId: string) {
        return this.get<Date>(
            `${environment.masterDataServiceLink}/${encodeURIComponent(companyId)}`
            + '/Companies/' + encodeURIComponent(companyId) + '/date');
    }

    refreshCompanyDate(companyId: string = null): Observable<moment.Moment> {
        const compId = companyId ? companyId : this.currentCompany.companyId;
        const companyToRefresh = this.userLoadedCompanies.find((comp) => comp.companyId === compId);
        // if (companyToRefresh && companyToRefresh.lastDateRefresh.diff(moment(), 'days') !== 0) {
        return this.getCompanyDate(compId).pipe(
            map((compDate) => {
                companyToRefresh.companyDate = (this.useUtc) ?
                    moment.utc(compDate).locale(this.locale) :
                    moment(compDate).locale(this.locale);
                companyToRefresh.lastDateRefresh = moment();
                return of(companyToRefresh.companyDate);
            }),
            catchError((error) => {
                console.error(error);
                return of(null);
            }));
        // }
        // return of(null);
    }

    getCurrentCompanyDate(): moment.Moment {
        const currentCompany = this.userLoadedCompanies.find((company: Company) => company.companyId === this.currentCompany.companyId);
        let res: moment.Moment = null;
        if (currentCompany && currentCompany.activeDate !== null && currentCompany.activeDate !== undefined) {
            res = (this.useUtc) ?
                moment.utc(currentCompany.activeDate).locale(this.locale) :
                moment(currentCompany.activeDate).locale(this.locale);
        } else {
            res = (this.currentCompany && this.useUtc) ?
                moment(this.currentCompany.companyDate).utc().startOf('day').locale(this.locale) :
                moment(this.currentCompany.companyDate).startOf('day').locale(this.locale);
        }
        return res;
    }

    refreshCurrentCompany(compId: string = null) {

        const companyId = compId ? compId :
            this.urlManager.getCurrentCompanyId();

        if (companyId && (!this.currentCompany || this.currentCompany.companyId !== companyId)) {
            this.currentCompany = this.userLoadedCompanies.find((comp) => {
                return comp.companyId === companyId;
            });
        }

        return this.currentCompany ? this.currentCompany.companyId : '';
    }

    resetToCompany(companyId: string) {
        this.urlManager.resetToCompany(companyId);
        this.currentCompany = this.userLoadedCompanies.find((comp) => {
            return comp.companyId === companyId;
        });
    }

    getConfiguration(counterpartyId: number) {
        const company = this.getCurrentCompanyId();
        const apiUrl = `${environment.masterDataServiceLink}/${encodeURIComponent(company)}`
            + '/Companies/getConfiguration/' + encodeURIComponent(counterpartyId.toString());

        const list = this.get<ApiPaginatedCollection<Company>>(apiUrl)
            .pipe(
                map((data) => {
                    return data.value;
                }),
            );
        return list;
    }

    public checkCompanyNameExists(companyname: string) {
        const company = this.getCurrentCompanyId();
        {
            return this.http
                .head(`${environment.masterDataServiceLink}/${encodeURIComponent(company)}` + '/Companies/' + companyname, {
                    headers: this.defaultHttpHeaders,
                    observe: 'response',
                })
                .pipe(map((resp) => resp.status === 200));
        }
    }
}
