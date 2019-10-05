import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { CompanyManagerService } from '../../../core/services/company-manager.service';
import { FlagInfo } from '../../dtos/flag-info';
import { HttpBaseService } from './http-base.service';

@Injectable({
    providedIn: 'root',
})
export class FeatureFlagService extends HttpBaseService {
    private maxTimeCache = 1000; // ms
    private responseCached;
    private lastRefresh: Date;

    private company: string = null;

    constructor(protected http: HttpClient, private companyManager: CompanyManagerService) {
        super(http);
    }

    public getFlagInfo(flagName: string): Observable<FlagInfo> {
        this.company = this.companyManager.getCurrentCompanyId();

        this.lastRefresh = this.lastRefresh ? this.lastRefresh : new Date(Date.now());
        const isExpired = this.lastRefresh.getMilliseconds() + this.maxTimeCache < Date.now();

        if (isExpired) {
            this.responseCached = this.http
                .get<FlagInfo>(
                    `${environment.configurationServiceLink}/${encodeURIComponent(String(this.company))}/featureflags/${flagName}`,
                )
                .pipe(
                    (res) => res,
                    catchError(this.handleError),
                );
            this.lastRefresh = new Date(Date.now());
        }
        return this.responseCached;
    }

    private handleError(error: HttpErrorResponse) {
        if (error.error instanceof ErrorEvent) {
            // A client-side or network error occurred. Handle it accordingly.
            console.error('An error occurred:', error.error.message);
        } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong,
            console.error(`Backend returned code ${error.status}, ` + `body was: ${error.error}`);
        }
        // return an observable with a user-facing error message
        return throwError('Something bad happened; please try again later.');
    }
}
