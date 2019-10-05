import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin as observableForkJoin, Observable, of, of as observableOf } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { CompanyManagerService } from '../../../core/services/company-manager.service';
import { AddressType } from '../../entities/address-type.entity';
import { BulkCounterparty } from '../../entities/bulkedit-counterparty.entity';
import { Commodity } from '../../entities/commodity.entity';
import { CompanyActivation } from '../../entities/company-activation.entity';
import { CompanyBankAccounts } from '../../entities/company-bankaccounts.entity';
import { ContractTerm } from '../../entities/contract-term.entity';
import { CostPriceCode } from '../../entities/cost-price-code.entity';
import { CostType } from '../../entities/cost-type.entity';
import { CounterpartyBankAccounts } from '../../entities/counterparty-bankaccounts.entity';
import { CounterpartyTradeStatus } from '../../entities/counterparty-trade-status.entity';
import { Counterparty } from '../../entities/counterparty.entity';
import { Department } from '../../entities/department.entity';
import { PhysicalDocumentType } from '../../entities/document-type.entity';
import { EnumEntity } from '../../entities/enum-entity.entity';
import { HttpRequestOptions } from '../../entities/http-services/http-request-options.entity';
import { PagingOptions } from '../../entities/http-services/paging-options';
import { InvoiceStatus } from '../../entities/invoice-status.entity';
import { MasterDataDeletionResult } from '../../entities/masterdata-deletion-result.entity';
import { MasterDataProps } from '../../entities/masterdata-props.entity';
import { MasterData } from '../../entities/masterdata.entity';
import { PaymentTerm } from '../../entities/payment-term.entity';
import { Port } from '../../entities/port.entity';
import { PositionMonthType } from '../../entities/position-month-type.entity';
import { PricingOptions } from '../../entities/pricing-options.entity';
import { ProfitCenter } from '../../entities/profit-center.entity';
import { RateType } from '../../entities/rate-type.entity';
import { ToleranceType } from '../../entities/tolerance-type.entity';
import { TraderMasterData } from '../../entities/trader-masterdata.entity';
import { MdmCategoryAccountTypeMapping } from '../../mdmCategory-account-mapping-entity';
import { ApiCollection, ApiPaginatedCollection } from '../common/models';
import { CommoditySearchTerm } from '../masterdata/dtos/commodity-search-term';
import { CompanyAssignment } from './../../entities/company-assignment.entity';
import { TriStateCheckboxStatus } from './../../enums/tri-state-checkbox-status.enum';
import { ActivateMasterdataCommand } from './../execution/dtos/activate-masterdata-command';
import { AssignMasterdataCommand } from './../execution/dtos/assign-masterdata-command';
import { HttpBaseService } from './http-base.service';

@Injectable()
export class MasterdataService extends HttpBaseService {
    company = 'defaultValue';
    masterData: MasterData;
    private readonly counterpartiesController = 'counterparties';
    private readonly commoditiesController = 'commodities';
    private readonly CounterPartyBankAccountController = 'counterpartyBankAccounts';
    private readonly PaymentTermsController = 'paymentTerms';
    private readonly PortsController = 'ports';
    private readonly DepartmentsController = 'departments';
    private readonly costTypesController = 'costTypes';
    private readonly CompanyBankAccountController = 'companyBankAccounts';
    private readonly ProfitCentersController = 'profitCenters';
    private readonly ShippingStatusController = 'shippingTypes';
    private readonly ContractTermsController = 'contractTerms';
    private readonly ContractTypesController = 'contractTypes';
    private readonly CounterpartyController = 'counterparty';

    traders: TraderMasterData[] = [
        { traderCode: 'ATRCTRL1-TST', traderDescription: 'ATRCTRL1-TST - Controller User 1' },
        { traderCode: 'ATRCTRL2-TST', traderDescription: 'ATRCTRL2-TST - Controller User 2' },
        { traderCode: 'ATRCTRL3-TST', traderDescription: 'ATRCTRL3-TST - Controller User 3' },
        { traderCode: 'ATREXEC1-TST', traderDescription: 'ATREXEC1-TST - Execution User 1' },
        { traderCode: 'ATREXEC2-TST', traderDescription: 'ATREXEC2-TST - Execution User 2' },
        { traderCode: 'ATREXEC3-TST', traderDescription: 'ATREXEC3-TST - Execution User 3' },
        { traderCode: 'ATRPREAC1-TST', traderDescription: 'ATRPREAC1-TST - Pre-Accounting User 1' },
        { traderCode: 'ATRPREAC2-TST', traderDescription: 'ATRPREAC2-TST - Pre-Accounting User 2' },
        { traderCode: 'ATRPREAC3-TST', traderDescription: 'ATRPREAC3-TST - Pre-Accounting User 3' },
        { traderCode: 'ATRTRADE1-TST', traderDescription: 'ATRTRADE1-TST - Trade User 1' },
        { traderCode: 'ATRTRADE2-TST', traderDescription: 'ATRTRADE2-TST - Trade User 2' },
        { traderCode: 'ATRTRADE3-TST', traderDescription: 'ATRTRADE3-TST - Trade User 3' },
    ];

    PositionMonthTypes: PositionMonthType[] = [
        { value: 'START+3', positionMonthTypeCode: { type: 0, month: 3 }, positionMonthTypeDescription: 'Start + 3' },
        { value: 'START+2', positionMonthTypeCode: { type: 0, month: 2 }, positionMonthTypeDescription: 'Start + 2' },
        { value: 'START+1', positionMonthTypeCode: { type: 0, month: 1 }, positionMonthTypeDescription: 'Start + 1' },
        { value: 'START', positionMonthTypeCode: { type: 0, month: 0 }, positionMonthTypeDescription: 'Start' },
        { value: 'START-1', positionMonthTypeCode: { type: 0, month: -1 }, positionMonthTypeDescription: 'Start - 1' },
        { value: 'START-2', positionMonthTypeCode: { type: 0, month: -2 }, positionMonthTypeDescription: 'Start - 2' },
        { value: 'START-3', positionMonthTypeCode: { type: 0, month: -3 }, positionMonthTypeDescription: 'Start - 3' },
        { value: 'END+1', positionMonthTypeCode: { type: 1, month: 1 }, positionMonthTypeDescription: 'End + 1' },
        { value: 'END+2', positionMonthTypeCode: { type: 1, month: 2 }, positionMonthTypeDescription: 'End + 2' },
        { value: 'END+3', positionMonthTypeCode: { type: 1, month: 3 }, positionMonthTypeDescription: 'End + 3' },
        { value: 'END', positionMonthTypeCode: { type: 1, month: 0 }, positionMonthTypeDescription: 'End' },
        { value: 'END-1', positionMonthTypeCode: { type: 1, month: -1 }, positionMonthTypeDescription: 'End - 1' },
        { value: 'END-2', positionMonthTypeCode: { type: 1, month: -2 }, positionMonthTypeDescription: 'End - 2' },
        { value: 'END-3', positionMonthTypeCode: { type: 1, month: -3 }, positionMonthTypeDescription: 'End - 3' },
    ];

    toleranceTypes: ToleranceType[] = [
        { toleranceTypeCode: 1, toleranceTypeDescription: 'More/Less' },
        { toleranceTypeCode: 0, toleranceTypeDescription: 'No Tolerance' },
    ];

    rateTypes: RateType[] = [{ code: '0', description: 'Lump Sum' }, { code: '1', description: 'Rate' }];

    pricingOptions: PricingOptions[] = [
        { code: '1', description: 'Outright Average' },
        { code: '2', description: 'Outright Actual Price Per Split' },
        { code: '3', description: 'Group by commodity & Price' },
    ];

    invoiceStatus: InvoiceStatus[] = [
        { code: '1', description: 'Uninvoiced' },
        { code: '2', description: 'Final Invoice Required' },
        { code: '3', description: 'Finalized' },
    ];

    costPriceCodes: CostPriceCode[] = [{ code: '0', description: 'N/A' }, { code: '1', description: 'PMT' }];

    documentTypes: PhysicalDocumentType[] = [
        { physicalDocumentTypeId: 1, physicalDocumentTypeLabel: 'Purchase Invoice' },
        { physicalDocumentTypeId: 2, physicalDocumentTypeLabel: 'Sales Invoice' },
        { physicalDocumentTypeId: 3, physicalDocumentTypeLabel: 'Credit Note' },
        { physicalDocumentTypeId: 4, physicalDocumentTypeLabel: 'Debit Note' },
        { physicalDocumentTypeId: 5, physicalDocumentTypeLabel: 'Cash Pay' },
        { physicalDocumentTypeId: 6, physicalDocumentTypeLabel: 'Cash Receipt' },
        { physicalDocumentTypeId: 7, physicalDocumentTypeLabel: 'Temporary Adjustment' },
    ];

    booleanValues: EnumEntity[] = [{ enumEntityId: 0, enumEntityValue: 'False' }, { enumEntityId: 1, enumEntityValue: 'True' }];

    masterDataWithoutCompany: string[] = [MasterDataProps.CommodityTypes];

    constructor(protected http: HttpClient, private companyManager: CompanyManagerService) {
        super(http);
        this.initializeMasterData();
    }

    getMasterData(list: string[], company: string = null, withoutCompany = false): Observable<MasterData> {
        const observableList: Array<Observable<ApiCollection<any>>> = [];
        const filteredList: string[] = [];
        let currentCompany: string = company;
        if (!company) {
            currentCompany = this.companyManager.getCurrentCompanyId();
        }
        if (currentCompany) {
            if (currentCompany !== this.company) {
                this.company = currentCompany;
                this.initializeMasterData();
            }

            if (list) {
                for (let i = 0; i < list.length; i++) {
                    if (this.masterData[list[i]]) {
                        if (this.masterData[list[i]].length === 0) {
                            filteredList.push(list[i]);
                            observableList.push(
                                withoutCompany
                                    ? this.get<ApiCollection<any>>(
                                        `${environment.masterDataServiceLink}` + '/' + encodeURIComponent(list[i]),
                                    )
                                    : this.get<ApiCollection<any>>(
                                        `${environment.masterDataServiceLink}/${encodeURIComponent(String(this.company))}` +
                                        '/' +
                                        encodeURIComponent(list[i]),
                                    ),
                            );
                        }
                    } else {
                        console.log('The master data ' + list[i] + ' was not found');
                    }
                }
            }
        }

        if (observableList.length > 0) {
            return observableForkJoin(observableList).pipe(
                map((result) => {
                    for (let i = 0; i < filteredList.length; i++) {
                        this.masterData[filteredList[i]] = result[i].value;
                    }
                    return this.masterData;
                }),
            );
        } else {
            return observableOf(this.masterData);
        }
    }

    getFullMasterData(masterDataName: string,
        company: string = null,
        globalView: boolean,
        code?: string,
        description?: string): Observable<MasterData> {
        if (!company) {
            company = this.companyManager.getCurrentCompanyId();
        }
        if (masterDataName) {
            if (!this.masterData[masterDataName]) {
                console.log('The master data ' + masterDataName + ' was not found');
            } else {
                const options: HttpRequestOptions = new HttpRequestOptions();
                let path = `${environment.masterDataServiceLink}/`;

                if (!this.masterDataWithoutCompany.includes(masterDataName)) {
                    path += `${encodeURIComponent(String(this.company))}/`;
                }

                let queryParameters = new HttpParams();
                queryParameters = queryParameters.set('includeDeactivated', 'true');

                if (globalView) {
                    queryParameters = queryParameters.set('viewMode', 'Global');
                }

                if (code) {
                    queryParameters = queryParameters.set('code', code);
                }
                if (description) {
                    queryParameters = queryParameters.set('description', description);
                }

                options.params = queryParameters;

                const query = this.get<ApiCollection<any>>(path + encodeURIComponent(masterDataName), options);
                return query.pipe(
                    map((result) => {
                        const masterData = new MasterData();
                        masterData[masterDataName] = result.value;
                        return masterData;
                    }),
                );
            }
        }
    }

    updateMasterData(masterData: MasterData, masterDataName: string, globalView: boolean, company: string = null) {
        if (!company) {
            company = this.companyManager.getCurrentCompanyId();
        }
        if (masterDataName) {
            if (!masterData[masterDataName]) {
                console.error('The master data ' + masterDataName + ' was not found');
            } else {
                const path = this.getAPIPath(masterDataName, company);
                const request: any = {
                    masterDataList: masterData[masterDataName],
                };

                let uri = path + encodeURIComponent(masterDataName);

                if (globalView) {
                    uri += '/global';
                }

                return this.patch(uri, request);
            }
        }
    }

    createMasterData(masterData: MasterData, masterDataName: string, company: string = null) {
        if (!company) {
            company = this.companyManager.getCurrentCompanyId();
        }
        if (masterDataName) {
            if (!masterData[masterDataName]) {
                console.log('The master data ' + masterDataName + ' was not found');
            } else {
                const path = this.getAPIPath(masterDataName, company);
                const request: any = {
                    masterDataList: masterData[masterDataName],
                };

                const uri = `${path}${encodeURIComponent(masterDataName)}/global`;
                return this.post(uri, request);
            }
        }
    }

    deleteMasterData(masterDataIds: number[], masterDataName: string, company: string = null):
        Observable<ApiCollection<MasterDataDeletionResult>> {
        if (!company) {
            company = this.companyManager.getCurrentCompanyId();
        }
        if (masterDataName) {
            if (!this.masterData[masterDataName]) {
                console.log('The master data ' + masterDataName + ' was not found');
            } else {
                const path = this.getAPIPath(masterDataName, company);
                const body: any = {
                    masterDataList: masterDataIds,
                };

                return this.post(path + encodeURIComponent(masterDataName) + '/delete', body);
            }
        }
        return of(null);
    }

    getAPIPath(masterDataName: string, company: string = null) {
        let path = `${environment.masterDataServiceLink}/`;

        if (!this.masterDataWithoutCompany.includes(masterDataName)) {
            path += `${encodeURIComponent(String(company))}/`;
        }

        return path;
    }

    concatMasterdataWitoutCompany(masterDataToConcat: MasterData) {
        this.masterData.fxRates = masterDataToConcat.fxRates;
    }

    initializeMasterData() {
        this.masterData = new MasterData();
        this.masterData.traders = this.traders;
        this.masterData.positionMonthTypes = this.PositionMonthTypes;
        this.masterData.toleranceTypes = this.toleranceTypes;
        this.masterData.rateTypes = this.rateTypes;
        this.masterData.costPriceCodes = this.costPriceCodes;
        this.masterData.documentTypes = this.documentTypes;
        this.masterData.pricingOptions = this.pricingOptions;
        this.masterData.invoiceStatus = this.invoiceStatus;
        this.masterData.booleanValues = this.booleanValues;
    }

    getMasterDataAssignments(masterDataName: string, masterDataIds: number[], company: string = null): Observable<CompanyAssignment[]> {
        if (!company) {
            company = this.companyManager.getCurrentCompanyId();
        }
        if (masterDataName) {
            const path = this.getAPIPath(masterDataName, company);
            const request: any = {
                masterDataList: masterDataIds,
            };

            return this.post(path + encodeURIComponent(masterDataName) + '/assignments', request).pipe(
                map((result: any) => result.value as CompanyAssignment[]),
            );
        }
    }

    getMasterDataActivated(masterDataName: string, masterDataIds: number[], company: string = null): Observable<CompanyActivation[]> {
        if (!company) {
            company = this.companyManager.getCurrentCompanyId();
        }
        if (masterDataName) {
            const path = this.getAPIPath(masterDataName, company);
            const request: any = {
                masterDataList: masterDataIds,
            };

            return this.post(path + encodeURIComponent(masterDataName) + '/activations', request).pipe(
                map((result: any) => result.value as CompanyActivation[]),
            );
        }
    }

    assignMasterData(masterDataName: string, companyAssignments: CompanyAssignment[], masterdataIds: number[], company: string = null) {
        if (!company) {
            company = this.companyManager.getCurrentCompanyId();
        }
        if (masterDataName) {
            const path = this.getAPIPath(masterDataName, company);
            const request: any = this.mapToAssignMasterdataCommand(companyAssignments, masterdataIds);

            return this.post(path + encodeURIComponent(masterDataName) + '/assign', request);
        }
    }

    activateMasterData(masterDataName: string, companyActivations: CompanyActivation[], masterdataIds: number[], company: string = null) {
        if (!company) {
            company = this.companyManager.getCurrentCompanyId();
        }
        if (masterDataName) {
            const path = this.getAPIPath(masterDataName, company);
            const request: any = this.mapToActivateMasterdataCommand(companyActivations, masterdataIds);

            return this.post(path + encodeURIComponent(masterDataName) + '/activate', request);
        }
    }

    mapToAssignMasterdataCommand(companyAssignments: CompanyAssignment[], masterdataIds: number[]): AssignMasterdataCommand {
        const command: AssignMasterdataCommand = {
            masterdataList: masterdataIds,
            assignedCompanies: companyAssignments.filter((assignment) => assignment.assignmentState === TriStateCheckboxStatus.All)
                .map((assignment) => assignment.companyId),
            deassignedCompanies: companyAssignments.filter((assignment) => assignment.assignmentState === TriStateCheckboxStatus.None)
                .map((assignment) => assignment.companyId),
        };
        return command;
    }

    mapToActivateMasterdataCommand(companyActivations: CompanyActivation[], masterdataIds: number[]): ActivateMasterdataCommand {
        const command: ActivateMasterdataCommand = {
            masterdataList: masterdataIds,
            activatedCompanies: companyActivations.filter((activation) => activation.activationState === TriStateCheckboxStatus.None)
                .map((activation) => activation.companyId),
            deactivatedCompanies: companyActivations.filter((activation) => activation.activationState === TriStateCheckboxStatus.All)
                .map((activation) => activation.companyId),
        };
        return command;
    }

    getCounterparties(counterpartyCode: string, pagingOptions: PagingOptions): Observable<ApiPaginatedCollection<Counterparty>> {
        const company = this.companyManager.getCurrentCompanyId();
        const options: HttpRequestOptions = new HttpRequestOptions();
        options.headers = this.defaultHttpHeaders;
        let queryParameters = new HttpParams();

        if (counterpartyCode) {
            queryParameters = queryParameters.set('counterpartyCode', counterpartyCode);
        }
        if (pagingOptions.offset) {
            queryParameters = queryParameters.set('offset', String(pagingOptions.offset));
        }
        if (pagingOptions.limit) {
            queryParameters = queryParameters.set('limit', String(pagingOptions.limit));
        }

        options.params = queryParameters;
        return this.get<ApiPaginatedCollection<Counterparty>>(
            `${environment.masterDataServiceLink}/${encodeURIComponent(String(company))}/` + `${this.counterpartiesController}`,
            options,
        );
    }

    getCounterpartyById(counterpartyId): Observable<ApiPaginatedCollection<Counterparty>> {
        const company = this.companyManager.getCurrentCompanyId();
        const options: HttpRequestOptions = new HttpRequestOptions();
        options.headers = this.defaultHttpHeaders;

        return this.get<ApiPaginatedCollection<Counterparty>>(
            `${environment.masterDataServiceLink}/${encodeURIComponent(String(company))}/` +
            `${this.counterpartiesController}/${encodeURIComponent(String(counterpartyId))}`,
            options,
        );
    }

    getMdmCategoryAccountTypeMapping(): Observable<ApiPaginatedCollection<MdmCategoryAccountTypeMapping>> {
        const company = this.companyManager.getCurrentCompanyId();

        return this.get<ApiPaginatedCollection<MdmCategoryAccountTypeMapping>>(
            `${environment.masterDataServiceLink}/${encodeURIComponent(String(company))}/` + `${this.counterpartiesController}/mapping`,
        );
    }

    getAddressType(): Observable<ApiPaginatedCollection<AddressType>> {
        const company = this.companyManager.getCurrentCompanyId();

        return this.get<ApiPaginatedCollection<AddressType>>(
            `${environment.masterDataServiceLink}/${encodeURIComponent(String(company))}/` + `${this.counterpartiesController}/addressType`,
        );
    }

    getCounterpartyTradeStatus(): Observable<ApiPaginatedCollection<CounterpartyTradeStatus>> {
        const company = this.companyManager.getCurrentCompanyId();

        return this.get<ApiPaginatedCollection<CounterpartyTradeStatus>>(
            `${environment.masterDataServiceLink}/${encodeURIComponent(String(company))}/` +
            `${this.counterpartiesController}/counterpartyTradeStatus`,
        );
    }

    bulkUpdateCounterparty(bulkCounterparty: BulkCounterparty) {
        const company: string = this.companyManager.getCurrentCompanyId();
        return this.post(
            `${environment.masterDataServiceLink}/${encodeURIComponent(String(company))}` +
            `/${this.counterpartiesController}/bulkupdatecounterparties`,
            bulkCounterparty,
        );
    }

    addOrUpdateCounterparty(counterparty: Counterparty) {
        const company: string = this.companyManager.getCurrentCompanyId();
        return this.post(
            `${environment.masterDataServiceLink}/${encodeURIComponent(String(company))}` + `/${this.counterpartiesController}`,
            counterparty,
        );
    }

    getPaymentTerms(paymentTermsCode: string, pagingOptions: PagingOptions): Observable<ApiPaginatedCollection<PaymentTerm>> {
        const company = this.companyManager.getCurrentCompanyId();
        const options: HttpRequestOptions = new HttpRequestOptions();
        options.headers = this.defaultHttpHeaders;
        let queryParameters = new HttpParams();

        if (paymentTermsCode) {
            queryParameters = queryParameters.set('paymentTermCode', paymentTermsCode);
        }
        if (pagingOptions.offset) {
            queryParameters = queryParameters.set('offset', String(pagingOptions.offset));
        }
        if (pagingOptions.limit) {
            queryParameters = queryParameters.set('limit', String(pagingOptions.limit));
        }

        options.params = queryParameters;
        return this.get<ApiPaginatedCollection<PaymentTerm>>(
            `${environment.masterDataServiceLink}/${encodeURIComponent(String(company))}/` +
            `${this.PaymentTermsController}`,
            options);
    }

    getPorts(Ports: string, pagingOptions: PagingOptions): Observable<ApiPaginatedCollection<Port>> {
        const company = this.companyManager.getCurrentCompanyId();
        const options: HttpRequestOptions = new HttpRequestOptions();
        options.headers = this.defaultHttpHeaders;
        let queryParameters = new HttpParams();

        if (Ports) {
            queryParameters = queryParameters.set('portCode', Ports);
        }
        if (pagingOptions.offset) {
            queryParameters = queryParameters.set('offset', String(pagingOptions.offset));
        }
        if (pagingOptions.limit) {
            queryParameters = queryParameters.set('limit', String(pagingOptions.limit));
        }

        options.params = queryParameters;
        return this.get<ApiPaginatedCollection<Port>>(
            `${environment.masterDataServiceLink}/${encodeURIComponent(String(company))}/` +
            `${this.PortsController}`,
            options);

    }

    getDepartments(departmentCode: string, pagingOptions: PagingOptions): Observable<ApiPaginatedCollection<Department>> {
        const company = this.companyManager.getCurrentCompanyId();
        const options: HttpRequestOptions = new HttpRequestOptions();
        options.headers = this.defaultHttpHeaders;
        let queryParameters = new HttpParams();

        if (departmentCode) {
            queryParameters = queryParameters.set('departmentCode', departmentCode);
        }
        if (pagingOptions.offset) {
            queryParameters = queryParameters.set('offset', String(pagingOptions.offset));
        }
        if (pagingOptions.limit) {
            queryParameters = queryParameters.set('limit', String(pagingOptions.limit));
        }

        options.params = queryParameters;
        return this.get<ApiPaginatedCollection<Department>>(
            `${environment.masterDataServiceLink}/${encodeURIComponent(String(company))}/` + `${this.DepartmentsController}`,
            options,
        );
    }

    getCommodities(commoditySearchTerm: CommoditySearchTerm, pagingOptions: PagingOptions): Observable<ApiPaginatedCollection<Commodity>> {
        const company = this.companyManager.getCurrentCompanyId();
        const options: HttpRequestOptions = new HttpRequestOptions();
        options.headers = this.defaultHttpHeaders;
        let queryParameters = new HttpParams();

        if (commoditySearchTerm.principalCommodity) {
            queryParameters = queryParameters.set('principalCommodity', commoditySearchTerm.principalCommodity);
        }
        if (commoditySearchTerm.part2) {
            queryParameters = queryParameters.set('part2', commoditySearchTerm.part2);
        }
        if (commoditySearchTerm.part3) {
            queryParameters = queryParameters.set('part3', commoditySearchTerm.part3);
        }
        if (commoditySearchTerm.part4) {
            queryParameters = queryParameters.set('part4', commoditySearchTerm.part4);
        }
        if (commoditySearchTerm.part5) {
            queryParameters = queryParameters.set('part5', commoditySearchTerm.part5);
        }
        if (pagingOptions.offset) {
            queryParameters = queryParameters.set('offset', String(pagingOptions.offset));
        }
        if (pagingOptions.limit) {
            queryParameters = queryParameters.set('limit', String(pagingOptions.limit));
        }

        options.params = queryParameters;
        return this.get<ApiPaginatedCollection<Commodity>>(
            `${environment.masterDataServiceLink}/${encodeURIComponent(String(company))}/` + `${this.commoditiesController}`,
            options,
        );
    }

    getCounterPartyBankAccounts(counterparty: number, currency: string): Observable<ApiCollection<CounterpartyBankAccounts>> {
        const company = this.companyManager.getCurrentCompanyId();
        const options: HttpRequestOptions = new HttpRequestOptions();
        options.headers = this.defaultHttpHeaders;
        let queryParameters = new HttpParams();
        queryParameters = queryParameters.set('counterparty', counterparty.toString());
        queryParameters = queryParameters.set('currency', currency);
        options.params = queryParameters;
        return this.get<ApiCollection<CounterpartyBankAccounts>>(
            `${environment.masterDataServiceLink}/${encodeURIComponent(String(company))}/` + `${this.CounterPartyBankAccountController}`,
            options,
        );
    }

    getSpecificMasterdata(masterdata: string, company: string, force: boolean = false): Observable<any[]> {
        if (!force && this.masterData[masterdata].length > 0) {
            return of(this.masterData[masterdata]);
        } else {
            return this.get<ApiCollection<any>>(
                `${environment.masterDataServiceLink}/${encodeURIComponent(String(company))}` + '/' + encodeURIComponent(masterdata),
            ).pipe(
                map((data) => {
                    return data.value;
                }),
            );
        }
    }

    getCostTypes(costTypeCode: string, pagingOptions: PagingOptions): Observable<ApiPaginatedCollection<CostType>> {
        const company = this.companyManager.getCurrentCompanyId();
        const options: HttpRequestOptions = new HttpRequestOptions();
        options.headers = this.defaultHttpHeaders;
        let queryParameters = new HttpParams();

        if (costTypeCode) {
            queryParameters = queryParameters.set('costTypeCode', costTypeCode);
        }
        if (pagingOptions.offset) {
            queryParameters = queryParameters.set('offset', String(pagingOptions.offset));
        }
        if (pagingOptions.limit) {
            queryParameters = queryParameters.set('limit', String(pagingOptions.limit));
        }

        options.params = queryParameters;
        return this.get<ApiPaginatedCollection<CostType>>(
            `${environment.masterDataServiceLink}/${encodeURIComponent(String(company))}/` + `${this.costTypesController}`,
            options,
        );
    }

    getCompanyBankAccounts(currency: string): Observable<ApiCollection<CompanyBankAccounts>> {
        const company = this.companyManager.getCurrentCompanyId();
        const options: HttpRequestOptions = new HttpRequestOptions();
        options.headers = this.defaultHttpHeaders;
        let queryParameters = new HttpParams();
        queryParameters = queryParameters.set('currency', currency);
        options.params = queryParameters;
        return this.get<ApiCollection<CompanyBankAccounts>>(
            `${environment.masterDataServiceLink}/${encodeURIComponent(String(company))}/` + `${this.CompanyBankAccountController}`,
            options,
        );
    }

    getDepartmentsByCompanyId(companyId: string): Observable<ApiPaginatedCollection<Department>> {
        const company = this.companyManager.getCurrentCompanyId();
        const options: HttpRequestOptions = new HttpRequestOptions();
        options.headers = this.defaultHttpHeaders;
        return this.get<ApiPaginatedCollection<Department>>(
            `${environment.masterDataServiceLink}/${encodeURIComponent(String(company))}/` + `${this.DepartmentsController}`,
            options,
        );
    }

    getDepartmentsByCompanyIdInterco(companyId: string): Observable<ApiPaginatedCollection<Department>> {
        const options: HttpRequestOptions = new HttpRequestOptions();
        options.headers = this.defaultHttpHeaders;
        return this.get<ApiPaginatedCollection<Department>>(
            `${environment.masterDataServiceLink}/${encodeURIComponent(String(companyId))}/` + `${this.DepartmentsController}`,
            options,
        );
    }

    getDepartmentsForSelectedCompanyId(
        departmentCode: string,
        pagingOptions: PagingOptions,
        selectedCompanies: string[],
    ): Observable<ApiPaginatedCollection<Department>> {
        const company = this.companyManager.getCurrentCompanyId();
        const options: HttpRequestOptions = new HttpRequestOptions();
        options.headers = this.defaultHttpHeaders;
        let queryParameters = new HttpParams();
        queryParameters = queryParameters.set('selectedCompanies', selectedCompanies.toString());

        if (departmentCode) {
            queryParameters = queryParameters.set('departmentCode', departmentCode);
        }
        if (pagingOptions) {
            if (pagingOptions.offset) {
                queryParameters = queryParameters.set('offset', String(pagingOptions.offset));
            }
            if (pagingOptions.limit) {
                queryParameters = queryParameters.set('limit', String(pagingOptions.limit));
            }
        }
        options.params = queryParameters;

        return this.get<ApiPaginatedCollection<Department>>(
            `${environment.masterDataServiceLink}/${encodeURIComponent(String(company))}/` + `${this.DepartmentsController}`,
            options,
        );
    }

    getProfitCenterForSelectedCompanyId(selectedCompanies: string[]): Observable<ApiCollection<ProfitCenter>> {
        const company = this.companyManager.getCurrentCompanyId();
        const options: HttpRequestOptions = new HttpRequestOptions();
        options.headers = this.defaultHttpHeaders;
        let queryParameters = new HttpParams();
        queryParameters = queryParameters.set('selectedCompanies', selectedCompanies.toString());

        options.params = queryParameters;

        return this.get<ApiCollection<ProfitCenter>>(
            `${environment.masterDataServiceLink}/${encodeURIComponent(String(company))}/` + `${this.ProfitCentersController}`,
            options,
        );
    }

    getContractTerms(): Observable<ApiCollection<ContractTerm>> {
        const company = this.companyManager.getCurrentCompanyId();
        const options: HttpRequestOptions = new HttpRequestOptions();
        options.headers = this.defaultHttpHeaders;

        return this.get<ApiCollection<ContractTerm>>(
            `${environment.masterDataServiceLink}/${encodeURIComponent(String(company))}/` + `${this.ContractTermsController}`,
            options,
        );
    }

    getContractTypes(): Observable<ApiCollection<EnumEntity>> {
        const company = this.companyManager.getCurrentCompanyId();
        const options: HttpRequestOptions = new HttpRequestOptions();
        options.headers = this.defaultHttpHeaders;

        return this.get<ApiCollection<EnumEntity>>(
            `${environment.masterDataServiceLink}/${encodeURIComponent(String(company))}/` + `${this.ContractTypesController}`,
            options,
        );
    }
}
