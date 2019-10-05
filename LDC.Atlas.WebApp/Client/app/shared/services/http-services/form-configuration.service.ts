import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { CompanyManagerService } from '../../../core/services/company-manager.service';
import { ItemConfigurationProperties } from '../../entities/form-configuration.entity';
import { HttpRequestOptions } from '../../entities/http-services/http-request-options.entity';
import * as formConfiguration from '../../mocks/mock-form-configuration';
import { ApiCollection } from '../common/models';
import { HttpBaseService } from './http-base.service';

@Injectable({
    providedIn: 'root',
})
export class FormConfigurationService extends HttpBaseService {
    private readonly physicalControllerUrl = 'physicalcontracts';
    private readonly ManualJournalControllerUrl = 'ManualJournal';

    constructor(
        protected httpClient: HttpClient,
        private companyManager: CompanyManagerService,
    ) {
        super(httpClient);
    }

    public getFormConfiguration(
        formId: string,
    ): Observable<ApiCollection<ItemConfigurationProperties>> {
        const company: string = this.companyManager.getCurrentCompanyId();

        const options: HttpRequestOptions = new HttpRequestOptions();
        options.headers = this.defaultHttpHeaders;

        let queryParameters = new HttpParams();
        if (formId !== undefined && formId !== null) {
            queryParameters = queryParameters.set('formId', formId as any);
        }
        options.params = queryParameters;

        // For time being its calling trading service to get the configuration,
        // but it should call another API to make the calls generic for all the forms(Screens)
        return this.getMandatoryFieldsConfiguration(formId);
    }

    public getFieldsConfiguration(
        fieldIds: string[],
    ): Observable<ApiCollection<ItemConfigurationProperties>> {
        const company: string = this.companyManager.getCurrentCompanyId();

        const options: HttpRequestOptions = new HttpRequestOptions();
        options.headers = this.defaultHttpHeaders;

        return this.generateStaticConfiguration();
    }

    public getMandatoryFieldsConfiguration(formId: string): Observable<ApiCollection<ItemConfigurationProperties>> {
        const company: string = this.companyManager.getCurrentCompanyId();
        return this.get<ApiCollection<ItemConfigurationProperties>>(
            `${environment.tradeServiceLink}/${encodeURIComponent(String(company))}`
            + `/${this.physicalControllerUrl}/${encodeURIComponent(String(formId))}/getMandatoryFieldsConfiguration`);
    }

    public getMandatoryFieldsConfigurationForFinancial(): Observable<ApiCollection<ItemConfigurationProperties>> {
        const company: string = this.companyManager.getCurrentCompanyId();
        return this.get<ApiCollection<ItemConfigurationProperties>>(
            `${environment.executionServiceLink}/${encodeURIComponent(String(company))}`
            + `/${this.ManualJournalControllerUrl}/getMandatoryFieldsConfiguration`);
    }

    generateStaticConfiguration(): Observable<
        ApiCollection<ItemConfigurationProperties>
    > {
        let configuration = [];
        configuration = configuration.concat(
            formConfiguration.headerFields,
            formConfiguration.commodityFields,
            formConfiguration.counterpartiesFields,
            formConfiguration.quantityFields,
            formConfiguration.priceFields,
            formConfiguration.termsFields,
            formConfiguration.locationFields,
            formConfiguration.shipmentPeriodFields,
            formConfiguration.memorandumFields,
        );

        const config: ApiCollection<ItemConfigurationProperties> = {
            value: configuration,
        };

        return of(config);
    }
}
