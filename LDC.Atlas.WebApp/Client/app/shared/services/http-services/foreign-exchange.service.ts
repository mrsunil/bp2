import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ForeignExchangeRate } from '../../entities/foreign-exchange/foreign-exchange-rate.entity';
import { FxRateConvertResult } from '../../entities/foreign-exchange/fxrate-convert-result.entity';
import { HttpRequestOptions } from '../../entities/http-services/http-request-options.entity';
import { ManualImportWarningErrorMsg } from '../../entities/manualImport-warning-error-msg.entity';
import { ManualImportReport } from '../../entities/manualImportReport.entity';
import { ForeignExchangeRateCreationMode } from '../../enums/foreign-exchange-rate-creationmode.enum';
import { ForeignExchangeRateViewMode } from '../../enums/foreign-exchange-rate-viewmode.enum';
import { ApiCollection } from '../common/models';
import { ForeignExchangeRateDto } from '../foreign-exchange/dtos/foreign-exchange-rate';
import { HttpBaseService } from './http-base.service';

@Injectable({
    providedIn: 'root',
})
export class ForeignExchangeService extends HttpBaseService {

    private readonly fxrateControllerUrl = 'fxrates';

    constructor(
        protected http: HttpClient) {
        super(http);
    }

    getForeignExchangeRates(fxRateDate: Date, viewMode: ForeignExchangeRateViewMode, inactiveCurrencies: boolean): Observable<ApiCollection<ForeignExchangeRate>> {
        const options: HttpRequestOptions = new HttpRequestOptions();
        options.headers = this.defaultHttpHeaders;

        let queryParameters = new HttpParams();
        if (fxRateDate) {
            queryParameters = queryParameters.set('fxRateDate', fxRateDate.toISOString());
        }
        if (viewMode) {
            queryParameters = queryParameters.set('viewMode', viewMode);
        }
        queryParameters = queryParameters.set('inactiveCurrencies', inactiveCurrencies ? 'true' : 'false');
        options.params = queryParameters;

        const fxRates = this.get<ApiCollection<ForeignExchangeRate>>(`${environment.masterDataServiceLink}/fxrates`, options);
        return fxRates;
    }

    importForeignExchangeRates(fxRates: ForeignExchangeRate[]) {
        const fxRateDtos = fxRates.map((f) => {
            const foreignExchangeRateDto: ForeignExchangeRateDto = {
                currencyCode: f.currencyCode,
                date: f.date,
                rate: f.rate,
                fwdMonth1: f.fwdMonth1,
                fwdMonth2: f.fwdMonth2,
                fwdMonth3: f.fwdMonth3,
                fwdMonth6: f.fwdMonth6,
                fwdYear1: f.fwdYear1,
                fwdYear2: f.fwdYear2,
                creationModeId: f.creationMode === ForeignExchangeRateCreationMode[ForeignExchangeRateCreationMode.Manual]
                    ? ForeignExchangeRateCreationMode.Manual : 0,
            };
            return foreignExchangeRateDto;
        });

        return this.post(`${environment.masterDataServiceLink}/fxrates`, fxRateDtos);
    }

    convert(currencyCodeFrom: string, currencyCodeTo: string, value: string, fxRateDate?: Date): Observable<FxRateConvertResult> {
        const options: HttpRequestOptions = new HttpRequestOptions();
        options.headers = this.defaultHttpHeaders;

        let queryParameters = new HttpParams();
        queryParameters = queryParameters.set('currencyCodeFrom', currencyCodeFrom);
        queryParameters = queryParameters.set('currencyCodeTo', currencyCodeTo);
        queryParameters = queryParameters.set('value', value);
        if (fxRateDate) {
            queryParameters = queryParameters.set('fxRateDate', fxRateDate.toISOString());
        }

        options.params = queryParameters;

        const convertResult = this.get<FxRateConvertResult>(`${environment.masterDataServiceLink}/fxrates/convert`, options);
        return convertResult;
    }

    getForeignExchangeRate(fxRateDate: Date, currencyCode: string): Observable<ForeignExchangeRate> {
        const options: HttpRequestOptions = new HttpRequestOptions();
        options.headers = this.defaultHttpHeaders;

        let queryParameters = new HttpParams();
        queryParameters = queryParameters.set('fxRateDate', fxRateDate.toISOString());
        queryParameters = queryParameters.set('currencyCode', currencyCode);

        options.params = queryParameters;

        const fxRates = this.get<ForeignExchangeRate>(`${environment.masterDataServiceLink}/fxrates/foreignexchangerate`, options);
        return fxRates;
    }

    fileUpload(file: File): Observable<ManualImportReport> {
        const formData = new FormData();
        formData.append('file', file, file.name);

        return this.post(`${environment.masterDataServiceLink}/${this.fxrateControllerUrl}` + '/fileupload', formData);
    }

    confirmImport(importId: string) {
        return this.
            post(`${environment.masterDataServiceLink}/${this.fxrateControllerUrl}` + '/fileupload/' + `${importId}` + '/confirm', null);
    }

    cancelImport(importId: string) {
        return this.
            post(`${environment.masterDataServiceLink}/${this.fxrateControllerUrl}` + '/fileupload/' + `${importId}` + '/cancel', null);
    }
}
