import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { CompanyManagerService } from '../../../core/services/company-manager.service';
import { AccountingFieldSetup } from '../../entities/accounting-field-setup.entity';
import { AccountingParameter } from '../../entities/accounting-parameter.entity';
import { AllocationSetUp } from '../../entities/allocation-set-up-entity';
import { ApplicationTable } from '../../entities/application-table.entity';
import { CompanyConfiguration } from '../../entities/company-configuration.entity';
import { Company } from '../../entities/company.entity';
import { CreateCompany } from '../../entities/create-company.entity';
import { DefaultAccountingSetup } from '../../entities/default-accounting-setup.entity';
import { FreezeCompany } from '../../entities/freeze-company.entity';
import { GridConfigurationProperties } from '../../entities/grid-configuration.entity';
import { HttpRequestOptions } from '../../entities/http-services/http-request-options.entity';
import { MandatoryTradeApprovalImageSetup } from '../../entities/mandatory-trade-fields';
import { TradeParameter } from '../../entities/trade-parameter.entity';
import { UserPreferenceResult } from '../../entities/user-preference-result.entity';
import { UserPreferences } from '../../entities/user-preferences.entity';
import { ApiCollection } from '../common/models';
import { CompanyConfigurationRecord } from '../configuration/dtos/company-configuration-record';
import { CreateFunctionalObjectCommand } from '../configuration/dtos/create-functional-object-command';
import { FunctionalObjectTableFields } from '../configuration/dtos/functional-object-table-fields';
import { IntercoNoIntercoUsers } from '../configuration/dtos/interco-no-interco-users';
import { UpdateFunctionalObjectCommand } from '../configuration/dtos/update-functional-object-command';
import { FunctionalObject } from './../../entities/functional-object.entity';
import { HttpBaseService } from './http-base.service';

@Injectable({
    providedIn: 'root',
})
export class ConfigurationService extends HttpBaseService {
    private readonly functionalObjectsControllerUrl = 'functionalobjects';
    private readonly applicationTablesControllerUrl = 'applicationtables';
    private readonly gridsControllerUrl = 'grids';
    private readonly companyConfigurationControllerUrl = 'companyconfiguration';
    private readonly companyCreationControllerUrl = 'companycreation';
    private readonly globalParametersControllerUrl = 'globalparameters';

    constructor(
        protected httpClient: HttpClient,
        private companyManager: CompanyManagerService,
    ) {
        super(httpClient);
    }

    getGridConfigByConfigurationTypeId(configurationTypeId: number): Observable<ApiCollection<GridConfigurationProperties>> {
        const company: string = this.companyManager.getCurrentCompanyId();

        const options: HttpRequestOptions = new HttpRequestOptions();
        options.headers = this.defaultHttpHeaders;

        return this.get<ApiCollection<GridConfigurationProperties>>(
            `${environment.configurationServiceLink}/${encodeURIComponent(String(company))}` +
            `/${this.gridsControllerUrl}/${configurationTypeId}/getGridConfigByConfigurationTypeId`);
    }

    public getGridColumnConfigurationByGridId(
        gridId: number,
    ): Observable<GridConfigurationProperties> {
        const company: string = this.companyManager.getCurrentCompanyId();

        return this.get<GridConfigurationProperties>(
            `${environment.configurationServiceLink}/${encodeURIComponent(company)}` +
            `/${this.gridsControllerUrl}/${gridId}/getGridConfigById`);
    }

    public getGridColumnConfiguration(
        gridCode: string,
    ): Observable<GridConfigurationProperties> {
        const company: string = this.companyManager.getCurrentCompanyId();

        return this.get<GridConfigurationProperties>(
            `${environment.configurationServiceLink}/${encodeURIComponent(company)}` +
            `/${this.gridsControllerUrl}/${gridCode}`);
    }

    updateGridColumnConfiguration(gridConfigurationProperties: GridConfigurationProperties): Observable<number> {
        const company: string = this.companyManager.getCurrentCompanyId();

        return this.post<number>(
            `${environment.configurationServiceLink}/${encodeURIComponent(company)}` +
            `/${this.gridsControllerUrl}/${gridConfigurationProperties.gridId}/updateGridConfig`, gridConfigurationProperties);
    }

    public getFunctionalObjects(): Observable<ApiCollection<FunctionalObject>> {
        return this.get<ApiCollection<FunctionalObject>>(
            `${environment.configurationServiceLink}/${this.functionalObjectsControllerUrl}`);
    }

    public searchFunctionalObjectsByName(name: string): Observable<ApiCollection<FunctionalObject>> {
        const options: HttpRequestOptions = new HttpRequestOptions();
        options.headers = this.defaultHttpHeaders;
        let queryParameters = new HttpParams();
        if (name !== undefined && name !== null) {
            queryParameters = queryParameters.set('name', name);
        }
        options.params = queryParameters;
        return this.get<ApiCollection<FunctionalObject>>(
            `${environment.configurationServiceLink}/${this.functionalObjectsControllerUrl}`,
            options);
    }

    public getFunctionalObjectById(functionalObjectId: number): Observable<FunctionalObject> {
        return this.get<FunctionalObject>(
            `${environment.configurationServiceLink}/${this.functionalObjectsControllerUrl}/${String(functionalObjectId)}`);
    }

    public checkFunctionalObjectExists(name: string, id?: number): Observable<boolean> {
        return this.post
            (`${environment.configurationServiceLink}/${this.functionalObjectsControllerUrl}/${id}/${name}`,
             {
                    headers: this.defaultHttpHeaders,
                    observe: 'response',
                });
    }

    public createFunctionalObject(name: string, tables: ApplicationTable[]): Observable<boolean> {
        const keys = this.getFunctionalObjectKeys(name, tables);

        const request: CreateFunctionalObjectCommand = {
            name,
            keys,
        };

        return this.post<any>(
            `${environment.configurationServiceLink}/${this.functionalObjectsControllerUrl}/create`, request);
    }

    public editFunctionalObject(id: number, name: string, tables: ApplicationTable[]): Observable<boolean> {
        const keys = this.getFunctionalObjectKeys(name, tables);

        const request: UpdateFunctionalObjectCommand = {
            id,
            name,
            keys,
        };

        return this.post<any>(
            `${environment.configurationServiceLink}/${this.functionalObjectsControllerUrl}/update`, request);
    }

    private getFunctionalObjectKeys(name: string, tables: ApplicationTable[]): FunctionalObjectTableFields[] {
        const keys: FunctionalObjectTableFields[] = [];

        for (let index = 0; index < tables.length; index++) {
            const fields = new FunctionalObjectTableFields();
            fields.tableId = tables[index].tableId;
            fields.fieldIds = tables[index].fields.map((field) => field.fieldId);
            keys.push(fields);
        }

        return keys;
    }

    public getAllApplicationTables(): Observable<ApplicationTable[]> {
        return this.get<ApplicationTable[]>(
            `${environment.configurationServiceLink}/${this.applicationTablesControllerUrl}`);
    }

    public getApplicationTableById(tableId: number): Observable<ApplicationTable> {
        return this.get<ApplicationTable>(
            `${environment.configurationServiceLink}/${this.applicationTablesControllerUrl}/${tableId}`);
    }

    getCompanyListDetails(company: string): Observable<Company[]> {
        return this.get<Company[]>(
            `${environment.configurationServiceLink}/${encodeURIComponent(String(company))}`
            + `/${this.companyConfigurationControllerUrl}/getcompanylistdetails`);
    }

    public updateCompanyConfiguration(companyConfiguration: CompanyConfiguration) {
        const company: string = companyConfiguration.companyId;
        const action = `${encodeURIComponent(String(company))}/${this.companyConfigurationControllerUrl}/updateCompanyConfiguration`;

        return this.patch(environment.configurationServiceLink + '/' + action, companyConfiguration);
    }

    createCompanyConfiguration(companyDetails: CompanyConfiguration) {
        const company: string = this.companyManager.getCurrentCompanyId();
        const action = `${encodeURIComponent(String(company))}/${this.companyCreationControllerUrl}/createcompanyconfiguration`;
        return this.post(environment.configurationServiceLink + '/' + action, companyDetails);
    }

    createUserPreference(userPreferenceDetails: UserPreferences) {
        const company: string = this.companyManager.getCurrentCompanyId();
        const action = `${encodeURIComponent(String(company))}/${this.globalParametersControllerUrl}/createuserpreference`;
        return this.post(environment.configurationServiceLink + '/' + action, userPreferenceDetails);
    }

    updateUserPreference(userPreferenceDetails: UserPreferences) {
        const company: string = this.companyManager.getCurrentCompanyId();
        const action = `${encodeURIComponent(String(company))}/${this.globalParametersControllerUrl}/updateuserpreference`;
        return this.post(environment.configurationServiceLink + '/' + action, userPreferenceDetails);
    }

    public getUserPreference(userId: number): Observable<UserPreferenceResult[]> {
        const company: string = this.companyManager.getCurrentCompanyId();
        return this.get<UserPreferenceResult[]>(
            `${environment.configurationServiceLink}/${encodeURIComponent(String(company))}`
            + `/${this.globalParametersControllerUrl}/getuserpreference` + '?userId=' + userId);
    }

    public deleteCompany(company: string) {
        const action = `${encodeURIComponent(String(company))}/${this.companyConfigurationControllerUrl}/deletecompany`;
        return this.delete(environment.configurationServiceLink + '/' + action);
    }

    public UpdateIsFrozenForCompany(company: string, freezeCompany: FreezeCompany) {
        const action = `${encodeURIComponent(String(company))}/${this.companyConfigurationControllerUrl}/updateisfrozenforcompany`;
        return this.patch(environment.configurationServiceLink + '/' + action, freezeCompany);
    }

    public checkCounterypartyExists(company: string): Observable<any> {
        return this.get<boolean>(
            `${environment.configurationServiceLink}/${encodeURIComponent(String(company))}`
            + `/${this.companyConfigurationControllerUrl}/checkcounterpartyexists`);
    }

    createCompanyByCopy(companyDetails: CreateCompany) {
        const company: string = this.companyManager.getCurrentCompanyId();
        const action = `${encodeURIComponent(String(company))}/${this.companyCreationControllerUrl}/createcompanybycopy`;
        return this.post(environment.configurationServiceLink + '/' + action, companyDetails);
    }

    public getCompanyConfigurationDetails(company: string, year: number): Observable<CompanyConfigurationRecord> {
        const options: HttpRequestOptions = new HttpRequestOptions();
        let queryParameters = new HttpParams();
        if (year !== undefined && year !== null) {
            queryParameters = queryParameters.set('year', year.toString());
        }
        options.params = queryParameters;

        return this.get<CompanyConfigurationRecord>(
            `${environment.configurationServiceLink}/${encodeURIComponent(String(company))}`
            + `/${this.companyConfigurationControllerUrl}/getcompanyconfiguration`, options);
    }

    public getAccountingParameterDetails(company: string, year: number): Observable<AccountingParameter[]> {
        const options: HttpRequestOptions = new HttpRequestOptions();
        let queryParameters = new HttpParams();
        if (year !== undefined && year !== null) {
            queryParameters = queryParameters.set('year', year.toString());
        }
        options.params = queryParameters;

        return this.get<AccountingParameter[]>(
            `${environment.configurationServiceLink}/${encodeURIComponent(String(company))}`
            + `/${this.companyConfigurationControllerUrl}/getaccountingparameters`, options);
    }

    public getTradeParameterDetails(company: string): Observable<TradeParameter[]> {
        return this.get<TradeParameter[]>(
            `${environment.configurationServiceLink}/${encodeURIComponent(String(company))}`
            + `/${this.companyConfigurationControllerUrl}/gettradingparameters`);
    }

    public getDefaultAccounting(company: string): Observable<DefaultAccountingSetup> {
        return this.get<DefaultAccountingSetup>(
            `${environment.configurationServiceLink}/${encodeURIComponent(String(company))}`
            + `/${this.companyConfigurationControllerUrl}/getdefaultaccounting`);
    }

    public checkTransationExistsByCompanyId(company: string): Observable<any> {
        return this.get<boolean>(
            `${environment.configurationServiceLink}/${encodeURIComponent(String(company))}`
            + `/${this.companyConfigurationControllerUrl}/checktransationexistsbycompanyid`);
    }

    public getAllocationSetUpByCompany(company: string): Observable<AllocationSetUp[]> {
        return this.get<AllocationSetUp[]>(
            `${environment.configurationServiceLink}/${encodeURIComponent(String(company))}`
            + `/${this.companyConfigurationControllerUrl}/getallocationsetup`);
    }

    public getInterCoNoInterCoUsers(company: string): Observable<IntercoNoIntercoUsers[]> {
        return this.get<IntercoNoIntercoUsers[]>(
            `${environment.configurationServiceLink}/${encodeURIComponent(String(company))}`
            + `/${this.companyConfigurationControllerUrl}/getinterconointercousers`);
    }

    public getAllocationSetUp(): Observable<AllocationSetUp[]> {
        const company: string = this.companyManager.getCurrentCompanyId();
        return this.get<AllocationSetUp[]>(
            `${environment.configurationServiceLink}/${encodeURIComponent(String(company))}`
            + `/${this.companyConfigurationControllerUrl}/getallocationsetup`);
    }

    public getMandatoryFieldsSetUp(): Observable<MandatoryTradeApprovalImageSetup[]> {
        const company: string = this.companyManager.getCurrentCompanyId();
        return this.get<MandatoryTradeApprovalImageSetup[]>(
            `${environment.configurationServiceLink}/${encodeURIComponent(String(company))}`
            + `/${this.companyConfigurationControllerUrl}/getmandatoryfieldsetup`);
    }

    public getMainAccountingSetup(): Observable<AccountingFieldSetup[]> {
        const company: string = this.companyManager.getCurrentCompanyId();
        return this.get<AccountingFieldSetup[]>(
            `${environment.configurationServiceLink}/${encodeURIComponent(String(company))}`
            + `/${this.companyConfigurationControllerUrl}/getmainaccountingsetup`);
    }

    // public getAccountingParameterSetUpByCompany(company: string, year: number, isCompanyCreation: boolean): Observable<AccountingParameter[]> {

    //     const options: HttpRequestOptions = new HttpRequestOptions();
    //     let queryParameters = new HttpParams();
    //     if (year !== undefined && year !== null) {
    //         queryParameters = queryParameters.set('year', year.toString());
    //     }
    //     queryParameters = queryParameters.set('isCompanyCreation', isCompanyCreation.toString());

    //     options.params = queryParameters;

    //     return this.get<AccountingParameter[]>(
    //         `${environment.configurationServiceLink}/${encodeURIComponent(String(company))}`
    //         + `/${this.companyConfigurationControllerUrl}/getaccountingparametersetup`, options);
    // }

    // public getTradeParameterSetUpByCompany(company: string, isCompanyCreation: boolean): Observable<TradeParameter[]> {

    //     const options: HttpRequestOptions = new HttpRequestOptions();
    //     let queryParameters = new HttpParams();
    //     queryParameters = queryParameters.set('isCompanyCreation', isCompanyCreation.toString());

    //     options.params = queryParameters;

    //     return this.get<TradeParameter[]>(
    //         `${environment.configurationServiceLink}/${encodeURIComponent(String(company))}`
    //         + `/${this.companyConfigurationControllerUrl}/gettradeparametersetup`, options);
    // }
}
