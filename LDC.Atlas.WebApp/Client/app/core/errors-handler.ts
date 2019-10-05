import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, Injectable, Injector, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { ProblemDetail } from '../shared/entities/problem-detail.entity';
import { SnackbarService } from '../shared/services/snackbar.service';
import { AppInsightsLoggerService } from './services/app-insights-logger.service';
import { CompanyManagerService } from './services/company-manager.service';

@Injectable()
export class ErrorsHandler implements ErrorHandler {
    problemDetail: ProblemDetail;

    constructor(
        private injector: Injector,
    ) { }

    handleError(error: Error | HttpErrorResponse) {
        // use injector for snackbar to avoid cyclic dependency
        const snackbarService = this.injector.get(SnackbarService);
        if (error instanceof HttpErrorResponse) {
            if (!navigator.onLine) {
                snackbarService.throwErrorSnackBar('No internet connection');
            } else {
                if (([500, 401].indexOf(error.status) > -1)
                    || ((error.status === 403)
                        && error.hasOwnProperty('displayAtlasErrorPage')
                        && error['displayAtlasErrorPage'] === true)) {
                    this.redirectToErrorPage(error.status);
                } else {
                    this.problemDetail = error.error as ProblemDetail;

                    // Handle Http Error (error.status === 403, 404...)
                    if (this.problemDetail != null && this.problemDetail.title !== undefined
                        && this.problemDetail.detail !== undefined) {

                        snackbarService.throwErrorSnackBar(this.problemDetail.title + ': ' + this.problemDetail.detail);
                    } else {
                        this.defaultErrorMessage(snackbarService);
                    }
                }
            }
        } else {
            this.defaultErrorMessage(snackbarService, error);
        }

        console.error('An error occured: ', error);
    }

    redirectToErrorPage(status: number) {
        const companyManagerService = this.injector.get(CompanyManagerService);
        const company = companyManagerService.getCurrentCompanyId();
        let link = 'error/' + status;
        if (company !== '') {
            link = company + '/' + link;
        }
        const ngZone = this.injector.get(NgZone);
        const router = this.injector.get(Router);
        ngZone.run(() => { router.navigate([link], { skipLocationChange: true }); });
    }

    defaultErrorMessage(snackbarService: SnackbarService, error?: Error) {
        if (!this.isTypeScriptError(error)) {
            snackbarService.throwErrorSnackBar('Something went wrong');
        }
        if (error) {
            const appInsightsLoggerService = this.injector.get(AppInsightsLoggerService);
            appInsightsLoggerService.logError(error);
        }
    }

    isTypeScriptError(error?: Error): boolean {
        if (error) {
            if (error.message.includes('of undefined')) {
                return true;
            }
        }
        return false;
    }
}
