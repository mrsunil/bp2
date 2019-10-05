import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { CompanyManagerService } from '../../../core/services/company-manager.service';
import { PhysicalFixedPricedContract } from '../../../trading/entities/physical-fixed-priced-contract.entity';
import { TagField } from '../../../trading/entities/tag-field';
import { TradeMergeMessage } from '../../../trading/entities/trade-merge-message.entity';
import { TradeFavoriteDetail } from '../../../trading/entities/tradeFavoriteDetail.entity';
import { AllocatedTradeSearchResult } from '../../dtos/allocated-trade';
import { ChildSectionsSearchResult } from '../../dtos/chilesection-search-result';
import { FxDealSearchResult } from '../../dtos/fxDeal-search-result';
import { ListAndSearchFilterDto } from '../../dtos/list-and-search/list-and-search-filter-dto.dto';
import { SectionSearchResult } from '../../dtos/section-search-result';
import { TradeReportResult } from '../../dtos/trade-report-result';
import { Bulkapproval } from '../../entities/bulk-approval.entity';
import { BulkCost } from '../../entities/bulk-edit-cost.entity';
import { CancelSectionStatusCommand } from '../../entities/cancel-section-command.entity';
import { ChildSectionsCostsToAdjust } from '../../entities/child-sections-costs-to-adjust.entity';
import { ContractFamilyToTradeMerge } from '../../entities/contract-family-to-trade-merge.entity';
import { Cost } from '../../entities/cost.entity';
import { Counterparty } from '../../entities/counterparty.entity';
import { FixPricedSection } from '../../entities/fix-priced-section.entity';
import { FuturesOptionsPricedSection } from '../../entities/futures-options-priced-section.entity';
import { FxDealGenerateEndOfMonth } from '../../entities/fx-deal-generate-end-of-month.entity';
import { FxDealCreateResponse } from '../../entities/fxdeal-create-response.entity';
import { FxDealDetail } from '../../entities/fxdeal-detail.entity';
import { HttpRequestOptions } from '../../entities/http-services/http-request-options.entity';
import { IntercoValidation } from '../../entities/interco-validation.entity';
import { ListAndSearchFilter } from '../../entities/list-and-search/list-and-search-filter.entity';
import { ListAndSearchRequest } from '../../entities/list-and-search/list-and-search-request.entity';
import { MergeAllowedForContracts } from '../../entities/merge-allowed-for-contract.entity';
import { MergeContracts } from '../../entities/merge-contracts.entity';
import { OverviewGenerateEndOfMonth } from '../../entities/overview-generate-end-of-month.entity';
import { ParentCostsToAdjust } from '../../entities/parent-costs-to-adjust.entity';
import { PhysicalTradeBulkEdit } from '../../entities/physical-trade-bulk-edit';
import { Section } from '../../entities/section.entity';
import { Tag } from '../../entities/tag.entity';
import { TradeConfiguration } from '../../entities/trade-configuration-entity';
import { Trade } from '../../entities/trade.entity';
import { Trader } from '../../entities/trader.entity';
import { User } from '../../entities/user.entity';
import { PricingMethods } from '../../enums/pricing-method.enum';
import { SectionTypes } from '../../enums/section-type.enum';
import { ApiCollection, ApiPaginatedCollection } from '../common/models';
import { DateConverterService } from '../date-converter.service';
import { ChildSectionsToSplit } from '../execution/dtos/child-sections-to-split';
import { ChildTradeForSection } from '../trading/dtos/ChildTradesForSection';
import { ContractsForBulkFunctions } from '../trading/dtos/contracts-for-bulk-functions';
import { Costmatrix } from '../trading/dtos/costmatrix';
import { SaveBulkCostsCommand } from '../trading/dtos/save-bulk-cost-command';
import { SaveTradeMergeCommand } from '../trading/dtos/save-trade-merge-command';
import { BulkSplitCreationDetails, SplitCreationDetails, SplitCreationResult, TrancheSplitCreationResult } from '../trading/dtos/section';
import { TradeFavourite } from '../trading/dtos/tradeFavourite';
import { TradeFieldsForBulkEdit } from '../trading/dtos/tradeFieldsForBulkEdit';
import { TradeImageField } from '../trading/dtos/tradeImageField';
import { HttpBaseService } from './http-base.service';

@Injectable({
    providedIn: 'root',
})
export class TradingService extends HttpBaseService {
    private readonly tradersControllerUrl = 'Traders';
    private readonly sectionsControllerUrl = 'sections';
    private readonly physicalControllerUrl = 'physicalcontracts';
    private readonly costmatricesControllerUrl = 'costmatrices';
    private readonly fxDealsControllerUrl = 'fxDeals';
    private readonly sectionsMergeControllerUrl = 'sectionsmerge';
    private readonly TagFieldsControllerUrl = 'tagfields';
    private readonly tradefavoritesControllerUrl = 'tradefavorites';

    constructor(http: HttpClient, private dateConverter: DateConverterService, private companyManager: CompanyManagerService) {
        super(http);
    }

    getAll(): Observable<ApiPaginatedCollection<SectionSearchResult>> {
        const company: string = this.companyManager.getCurrentCompanyId();

        return this.get<ApiPaginatedCollection<SectionSearchResult>>(
            `${environment.tradeServiceLink}/${encodeURIComponent(String(company))}/${this.sectionsControllerUrl}`,
        );
    }

    getTradesForAllocation(request: ListAndSearchRequest): Observable<ApiPaginatedCollection<AllocatedTradeSearchResult>> {
        const company: string = this.companyManager.getCurrentCompanyId();

        return this.post<ApiPaginatedCollection<AllocatedTradeSearchResult>>(
            `${environment.tradeServiceLink}/${encodeURIComponent(String(company))}/${this.physicalControllerUrl}/Allocate`,
            request);
    }

    searchContractsToAllocate(filters: ListAndSearchFilter[],
        offset?: number,
        limit?: number): Observable<any> {

        const filtersForColumns: ListAndSearchFilterDto[] = filters.map((filter) => {
            return new ListAndSearchFilterDto(filter);
        });

        const request: ListAndSearchRequest = {
            clauses: { clauses: filtersForColumns },
            offset,
            limit,
        };

        const list = this.getTradesForAllocation(request)
            .pipe(
                map((data) => {
                    return data.value;
                }),
            );

        return list;
    }

    getTradeCostList(
        reportType: number,
        tabType: number,
        dataVersionId: number,
    ): Observable<ApiPaginatedCollection<OverviewGenerateEndOfMonth>> {
        const company: string = this.companyManager.getCurrentCompanyId();
        const options: HttpRequestOptions = new HttpRequestOptions();
        let queryParameters = new HttpParams();
        if (tabType) {
            queryParameters = queryParameters.set('tabType', tabType.toString());
        }
        if (dataVersionId) {
            queryParameters = queryParameters.set('dataVersionId', dataVersionId.toString());
        }
        if (reportType) {
            queryParameters = queryParameters.set('reportType', reportType.toString());
        }
        options.params = queryParameters;
        return this.get<ApiPaginatedCollection<OverviewGenerateEndOfMonth>>(
            `${environment.tradeServiceLink}/${encodeURIComponent(String(company))}/${this.sectionsControllerUrl}/summary`,
            options,
        );
    }

    getCostMatrixId(costMatrixId: number): Observable<Costmatrix> {
        const company: string = this.companyManager.getCurrentCompanyId();
        return this.get<Costmatrix>(
            `${environment.tradeServiceLink}/${encodeURIComponent(String(company))}/${this.costmatricesControllerUrl}` +
                `/${encodeURIComponent(String(costMatrixId))}` +
                `/costmatrixlistedit`,
        );
    }

    // get the contacts for bulk edit
    searchContractsForBulkEdit(filters: ListAndSearchFilter[], offset?: number, limit?: number): Observable<any> {
        const filtersForColumns: ListAndSearchFilterDto[] = filters.map((filter) => {
            return new ListAndSearchFilterDto(filter);
        });

        const dataversionId = filters.find((f) => f.fieldName === 'DataVersionId');

        const request: ListAndSearchRequest = {
            clauses: { clauses: filtersForColumns },
            offset,
            limit,
            dataVersionId: dataversionId ? Number(dataversionId.predicate.value1) : null,
        };

        const list = this.search(request).pipe(
            map((data) => {
                return data.value;
            }),
        );

        return list;
    }

    getSection(
        sectionId: number,
        pricingMethod: PricingMethods,
        dataVersionId?: number,
    ): Observable<FixPricedSection | FuturesOptionsPricedSection> {
        const company: string = this.companyManager.getCurrentCompanyId();

        const options: HttpRequestOptions = new HttpRequestOptions();
        let queryParameters = new HttpParams();
        if (dataVersionId) {
            queryParameters = queryParameters.set('dataVersionId', dataVersionId.toString());
        }
        options.params = queryParameters;

        const apiUrl: string =
            `${environment.tradeServiceLink}/${encodeURIComponent(String(company))}/${this.sectionsControllerUrl}` +
            '/' +
            `${encodeURIComponent(String(sectionId))}`;

        switch (pricingMethod) {
            case PricingMethods.Priced:
                return this.get<FixPricedSection>(apiUrl, options);

            case PricingMethods.FnO:
                return this.get<FuturesOptionsPricedSection>(apiUrl, options);

            default:
                return null;
        }
    }

    checkContractReferenceExists(contractRef: string, dataVersionId?: number) {
        const company: string = this.companyManager.getCurrentCompanyId();

        let queryParameters = new HttpParams();
        if (dataVersionId) {
            queryParameters = queryParameters.set('dataVersionId', dataVersionId.toString());
        }

        const apiUrl = `${encodeURIComponent(String(company))}/${this.physicalControllerUrl}`;
        return this.http
            .head(`${environment.tradeServiceLink}/${apiUrl}/` + contractRef, {
                headers: this.defaultHttpHeaders,
                observe: 'response',
                params: queryParameters,
            })
            .pipe(map((resp) => resp.status === 200));
    }

    createPhysicalFixedPricedContract(contract: PhysicalFixedPricedContract) {
        const company: string = this.companyManager.getCurrentCompanyId();
        const action = `${encodeURIComponent(String(company))}/${this.physicalControllerUrl}/`;

        return this.post(environment.tradeServiceLink + '/' + action, contract);
    }

    updatePhysicalContract(physicalContractId: number, physicalContract: PhysicalFixedPricedContract, isSplitCreated: boolean = false) {
        const company: string = this.companyManager.getCurrentCompanyId();
        physicalContract.isSplitCreated = isSplitCreated;
        const action = `/${encodeURIComponent(String(company))}/${this.physicalControllerUrl}/${physicalContractId}`;

        return this.patch(environment.tradeServiceLink + action, physicalContract);
    }

    public PhysicalTradeBulkEdit(physicalTradeBulkEdit: PhysicalTradeBulkEdit) {
        const company: string = this.companyManager.getCurrentCompanyId();
        return this.patch(
            `${environment.tradeServiceLink}/${encodeURIComponent(String(company))}` +
                `/${this.physicalControllerUrl}/physicaltradebulkedit`,
            physicalTradeBulkEdit,
        );
    }

    createSplitForContract(
        sectionIds: number[],
        quantity: number,
        dataVersionId?: number,
        contractedValues?: string[],
    ): Observable<TrancheSplitCreationResult[]> {
        const company: string = this.companyManager.getCurrentCompanyId();
        const splitDetails = new SplitCreationDetails();
        splitDetails.sectionIds = sectionIds;
        splitDetails.quantity = quantity;
        splitDetails.contractedValues = contractedValues;
        splitDetails.dataVersionId = dataVersionId;
        const action = `/${encodeURIComponent(String(company))}/${this.physicalControllerUrl}/splitcontract`;
        return this.post<TrancheSplitCreationResult[]>(environment.tradeServiceLink + action, splitDetails);
    }

    createBulkSplitForContract(
        sectionId: number,
        quantities: number[],
        dataVersionId?: number,
        contractedValues?: string[],
    ): Observable<TrancheSplitCreationResult[]> {
        const company: string = this.companyManager.getCurrentCompanyId();
        const splitDetails = new BulkSplitCreationDetails();
        splitDetails.sectionId = sectionId;
        splitDetails.quantity = quantities;
        splitDetails.contractedValues = contractedValues;
        splitDetails.dataVersionId = dataVersionId;
        const action = `/${encodeURIComponent(String(company))}/${this.physicalControllerUrl}/bulksplitcontract`;
        return this.post<TrancheSplitCreationResult[]>(environment.tradeServiceLink + action, splitDetails);
    }

    deleteCost(costId: number, sectionId: number, dataVersionId: number) {
        const company: string = this.companyManager.getCurrentCompanyId();

        let queryParameters = new HttpParams();
        if (dataVersionId) {
            queryParameters = queryParameters.set('dataVersionId', dataVersionId.toString());
        }

        return this.http
            .delete<any>(
                `${environment.tradeServiceLink}/${encodeURIComponent(String(company))}` +
                    `/${this.sectionsControllerUrl}/${encodeURIComponent(String(sectionId))}/costs/${encodeURIComponent(String(costId))}`,
                {
                    params: queryParameters,
                    observe: 'response',
                },
            )
            .pipe(map((resp) => resp.ok));
    }

    deleteMultipleCost(costId: number[], sectionId: number, dataVersionId: number) {
        const company: string = this.companyManager.getCurrentCompanyId();

        const request = { costIds: costId, dataVersionId };

        return this.http
            .post<any>(
                `${environment.tradeServiceLink}/${encodeURIComponent(String(company))}` +
                    `/${this.sectionsControllerUrl}/${encodeURIComponent(String(sectionId))}/costs/delete`,
                request,
                {
                    observe: 'response',
                },
            )
            .pipe(map((resp) => resp.ok));
    }

    getAllCosts(sectionId: number, dataVersionId: number): Observable<ApiCollection<Cost>> {
        const company: string = this.companyManager.getCurrentCompanyId();

        const options: HttpRequestOptions = new HttpRequestOptions();
        let queryParameters = new HttpParams();
        if (dataVersionId) {
            queryParameters = queryParameters.set('dataVersionId', dataVersionId.toString());
        }
        options.params = queryParameters;

        return this.get<ApiCollection<Cost>>(
            `${environment.tradeServiceLink}/${encodeURIComponent(String(company))}` +
                `/${this.sectionsControllerUrl}/${encodeURIComponent(String(sectionId))}/costs`,
            options,
        );
    }

    createTrancheSplit(section: Section, sectionType: number): Observable<TrancheSplitCreationResult[]> {
        const company: string = this.companyManager.getCurrentCompanyId();
        const trancheAction = `${encodeURIComponent(String(company))}/${this.physicalControllerUrl}/tranche/`;
        const splitAction = `${encodeURIComponent(String(company))}/${this.physicalControllerUrl}/split/`;
        const action = sectionType === SectionTypes.Tranche ? trancheAction : splitAction;

        return this.post<TrancheSplitCreationResult[]>(environment.tradeServiceLink + '/' + action, section);
    }

    createSplit(section: Section): Observable<SplitCreationResult[]> {
        const company: string = this.companyManager.getCurrentCompanyId();
        const action = `${encodeURIComponent(String(company))}/${this.physicalControllerUrl}/split/`;

        return this.post<SplitCreationResult[]>(environment.tradeServiceLink + '/' + action, section);
    }

    splitCostsForSection(sectionOriginId: number, childSections: ChildSectionsToSplit[]) {
        const company: string = this.companyManager.getCurrentCompanyId();

        const request = {
            sectionOriginId,
            childSections,
            company,
        };

        return this.http
            .post<any>(
                `${environment.tradeServiceLink}/${encodeURIComponent(String(company))}/${this.sectionsControllerUrl}` +
                    `/${encodeURIComponent(String(sectionOriginId))}/costs/split`,
                request,
                {
                    observe: 'response',
                },
            )
            .pipe(map((resp) => resp.ok));
    }

    public approveSection(sectionId: number): Observable<boolean> {
        const company: string = this.companyManager.getCurrentCompanyId();

        const request = {
            sectionId,
        };

        return this.http
            .post<any>(
                `${environment.tradeServiceLink}/${encodeURIComponent(String(company))}/${this.sectionsControllerUrl}` +
                    `/${encodeURIComponent(String(sectionId))}/approve`,
                request,
                {
                    observe: 'response',
                },
            )
            .pipe(map((resp) => resp.ok));
    }

    public unapproveSection(sectionId: number): Observable<boolean> {
        const company: string = this.companyManager.getCurrentCompanyId();

        return this.http
            .post<any>(
                `${environment.tradeServiceLink}/${encodeURIComponent(String(company))}/${this.sectionsControllerUrl}` +
                    `/${encodeURIComponent(String(sectionId))}/unapprove`,
                null,
                {
                    observe: 'response',
                },
            )
            .pipe(map((resp) => resp.ok));
    }

    public deleteSection(sectionId: number): Observable<boolean> {
        const company: string = this.companyManager.getCurrentCompanyId();

        return this.http
            .post<any>(
                `${environment.tradeServiceLink}/${encodeURIComponent(String(company))}/${this.sectionsControllerUrl}` +
                    `/${encodeURIComponent(String(sectionId))}/delete`,
                null,
                {
                    observe: 'response',
                },
            )
            .pipe(map((resp) => resp.ok));
    }

    public closeSection(sectionIds: number[], childFlag?: number, dataVersionId?: number): Observable<boolean> {
        const company: string = this.companyManager.getCurrentCompanyId();
        const request = { dataVersionId };

        return this.http
            .post<any>(
                `${environment.tradeServiceLink}/${encodeURIComponent(String(company))}/${this.sectionsControllerUrl}` +
                    `/${encodeURIComponent(String(sectionIds.toString()))}/close`,
                request,
                {
                    observe: 'response',
                },
            )
            .pipe(map((resp) => resp.ok));
    }

    public getAssigedSectionDetailsToCloseCharter(sectionIds: number[]): Observable<any> {
        const company: string = this.companyManager.getCurrentCompanyId();

        return this.get<any>(
            `${environment.tradeServiceLink}/${encodeURIComponent(String(company))}/${this.sectionsControllerUrl}` +
                `/${encodeURIComponent(String(sectionIds.toString()))}/closesectiondetails`,
        );
    }

    public cancelSection(sectionIds: number[], cancellationDate: Date, childFlag?: number, dataVersionId?: number): Observable<boolean> {
        const company: string = this.companyManager.getCurrentCompanyId();
        const cancelSectionDetail = new CancelSectionStatusCommand();
        cancelSectionDetail.blDate = cancellationDate;
        cancelSectionDetail.sectionIds = sectionIds;

        return this.http
            .post<any>(
                `${environment.tradeServiceLink}/${encodeURIComponent(String(company))}/${this.sectionsControllerUrl}` + `/cancel`,
                cancelSectionDetail,
                {
                    observe: 'response',
                },
            )
            .pipe(map((resp) => resp.ok));
    }

    public reverseCancelSection(sectionId: number, childFlag?: number, dataVersionId?: number): Observable<boolean> {
        const company: string = this.companyManager.getCurrentCompanyId();

        return this.http
            .post<any>(
                `${environment.tradeServiceLink}/${encodeURIComponent(String(company))}/${this.sectionsControllerUrl}` +
                    `/${encodeURIComponent(String(sectionId.toString()))}/reversecancel`,
                null,
                {
                    observe: 'response',
                },
            )
            .pipe(map((resp) => resp.ok));
    }

    public reOpenSection(sectionIds: number[], dataVersionId?: number): Observable<boolean> {
        const company: string = this.companyManager.getCurrentCompanyId();
        const request = { dataVersionId };

        return this.http
            .post<any>(
                `${environment.tradeServiceLink}/${encodeURIComponent(String(company))}/${this.sectionsControllerUrl}` +
                    `/${encodeURIComponent(String(sectionIds))}/open`,
                request,
                {
                    observe: 'response',
                },
            )
            .pipe(map((resp) => resp.ok));
    }

    private correctTrade(tr: Trade<FixPricedSection>): Trade<FixPricedSection> {
        const trade: Trade<FixPricedSection> = tr;
        // -- Correcting Date Format
        if (trade.contractDate) {
            const contractDate = new Date(trade.contractDate as any);
            trade.contractDate = contractDate;
        }

        if (trade.lastModifiedDate) {
            const lastModifiedDate = new Date(trade.lastModifiedDate as any);
            trade.lastModifiedDate = lastModifiedDate;
        }

        if (trade.creationDate) {
            const creationDate = new Date(trade.creationDate as any);
            trade.creationDate = creationDate;
        }

        if (trade.blDate) {
            const blDate = new Date(trade.blDate as any);
            trade.blDate = blDate;
        }

        // -- Correcting Tolerance for display
        trade.toleranceValue = trade.toleranceValue * 100;
        return trade;
    }

    private transformData(data: Array<Trade<FixPricedSection>>): Array<Trade<FixPricedSection>> {
        data.forEach((d) => {
            this.correctTrade(d);
        });
        return data;
    }

    getAllTraders(): Observable<ApiCollection<Trader>> {
        const company: string = this.companyManager.getCurrentCompanyId();

        return this.get<ApiCollection<Trader>>(
            `${environment.tradeServiceLink}/${encodeURIComponent(String(company))}/${this.tradersControllerUrl}`,
        );
    }

    findTradersByName(name: string): Observable<ApiCollection<Trader>> {
        const company: string = this.companyManager.getCurrentCompanyId();
        const options: HttpRequestOptions = new HttpRequestOptions();
        let queryParameters = new HttpParams();
        if (name) {
            queryParameters = queryParameters.set('name', name);
        }
        options.params = queryParameters;

        return this.get<ApiCollection<Trader>>(
            `${environment.tradeServiceLink}/${encodeURIComponent(String(company))}/${this.tradersControllerUrl}`,
            options,
        );
    }

    getCostmatricesByCompanyId(company: string): Observable<ApiPaginatedCollection<Costmatrix>> {
        return this.get<ApiPaginatedCollection<Costmatrix>>(
            `${environment.tradeServiceLink}/${encodeURIComponent(String(company))}/${this.costmatricesControllerUrl}`,
        );
    }

    searchCostMatrixListWithBestMatch(request: Tag[]): Observable<ApiPaginatedCollection<Costmatrix>> {
        const company: string = this.companyManager.getCurrentCompanyId();

        return this.post<ApiPaginatedCollection<Costmatrix>>(
            `${environment.tradeServiceLink}/${encodeURIComponent(String(company))}/${
                this.costmatricesControllerUrl
            }/include-bestmatch`,
            request,
        );
    }

    getCostmatricesListByCostmatrixId(costMatrixId: number): Observable<Costmatrix> {
        const company: string = this.companyManager.getCurrentCompanyId();
        return this.get<Costmatrix>(
            `${environment.tradeServiceLink}/${encodeURIComponent(String(company))}/${this.costmatricesControllerUrl}` +
                `/${encodeURIComponent(String(costMatrixId))}`,
        );
    }

    GetCostMatricesListWithTags(costMatrixId: number): Observable<any> {
        const company: string = this.companyManager.getCurrentCompanyId();
        return this.get<any>(
            `${environment.tradeServiceLink}/${encodeURIComponent(String(company))}/${this.costmatricesControllerUrl}` +
                `/tags?costMatrixIds=${encodeURIComponent(String(costMatrixId))}`,
        );
    }

    GetBulkCostMatricesListWithTags(ids: string): Observable<any> {
        const company: string = this.companyManager.getCurrentCompanyId();
        const filter = `${environment.tradeServiceLink}/${encodeURIComponent(String(company))}/${this.costmatricesControllerUrl}` +
        `/tags?costMatrixIds=${ids}`;
        return this.get<any>(filter);
    }

    search(request: ListAndSearchRequest): Observable<ApiPaginatedCollection<SectionSearchResult>> {
        const company: string = this.companyManager.getCurrentCompanyId();

        return this.post<ApiPaginatedCollection<SectionSearchResult>>(
            `${environment.tradeServiceLink}/${encodeURIComponent(String(company))}/${this.sectionsControllerUrl}/search`,
            request,
        );
    }

    bankBrokerContextualSearch(request: ListAndSearchRequest): Observable<ApiPaginatedCollection<Counterparty>> {
        const company: string = this.companyManager.getCurrentCompanyId();

        return this.post<ApiPaginatedCollection<Counterparty>>(
            `${environment.tradeServiceLink}/${encodeURIComponent(String(company))}/${
                this.fxDealsControllerUrl
            }/bankBrokerContextualSearch`,
            request,
        );
    }

    createFxDeal(fxDetail: FxDealDetail): Observable<FxDealDetail> {
        const company: string = this.companyManager.getCurrentCompanyId();
        const action = `${encodeURIComponent(String(company))}/${this.fxDealsControllerUrl}`;

        return this.post(environment.tradeServiceLink + '/' + action, fxDetail);
    }

    reverseFxDeal(fxDealId: number): Observable<FxDealCreateResponse[]> {
        const company: string = this.companyManager.getCurrentCompanyId();

        return this.post(
            `${environment.tradeServiceLink}/${encodeURIComponent(String(company))}/${this.fxDealsControllerUrl}` +
                `/${encodeURIComponent(String(fxDealId))}/reverse`,
            null,
        );
    }

    settleFxDeal(fxDealId: number): Observable<FxDealCreateResponse[]> {
        const company: string = this.companyManager.getCurrentCompanyId();

        return this.post(
            `${environment.tradeServiceLink}/${encodeURIComponent(String(company))}/${this.fxDealsControllerUrl}` +
                `/${encodeURIComponent(String(fxDealId))}/settle`,
            null,
        );
    }

    updateFxDeal(fxDealId: number, fxDetail: FxDealDetail): Observable<FxDealDetail> {
        const company: string = this.companyManager.getCurrentCompanyId();
        const action = `${encodeURIComponent(String(company))}/${this.fxDealsControllerUrl}/${fxDealId}`;

        return this.patch(environment.tradeServiceLink + '/' + action, fxDetail);
    }

    getTradeReportData(request: ListAndSearchRequest): Observable<ApiPaginatedCollection<TradeReportResult>> {
        const company: string = this.companyManager.getCurrentCompanyId();

        return this.post<ApiPaginatedCollection<TradeReportResult>>(
            `${environment.tradeServiceLink}/${encodeURIComponent(String(company))}/${this.sectionsControllerUrl}/getTradeReportData`,
            request,
        );
    }

    public createCostmatrix(costmatrix: Costmatrix): Observable<Costmatrix> {
        const company: string = this.companyManager.getCurrentCompanyId();
        const action = `${encodeURIComponent(String(company))}/${this.costmatricesControllerUrl}/`;

        return this.post(environment.tradeServiceLink + '/' + action, costmatrix);
    }

    public createCostMatrixWithParameters(costmatrix: Costmatrix): Observable<Costmatrix> {
        const company: string = this.companyManager.getCurrentCompanyId();
        const action = `${encodeURIComponent(String(company))}/${this.costmatricesControllerUrl}/include-parameters`;

        return this.post(environment.tradeServiceLink + '/' + action, costmatrix);
    }

    public updateCostmatrix(costmatrix: Costmatrix): Observable<Costmatrix> {
        const company: string = this.companyManager.getCurrentCompanyId();
        const action = `${encodeURIComponent(String(company))}/${this.costmatricesControllerUrl}/${encodeURIComponent(
            String(costmatrix.costMatrixId),
        )}`;

        return this.patch(environment.tradeServiceLink + '/' + action, costmatrix);
    }

    public updateCostmatrixWithParameters(costmatrix: Costmatrix): Observable<Costmatrix> {
        const company: string = this.companyManager.getCurrentCompanyId();
        const action = `${encodeURIComponent(String(company))}/${this.costmatricesControllerUrl}/${encodeURIComponent(
            String(costmatrix.costMatrixId),
        )}`;

        return this.post(environment.tradeServiceLink + '/' + action, costmatrix);
    }

    public deleteCostMatrix(costMatrixId: number) {
        const company: string = this.companyManager.getCurrentCompanyId();

        return this.http
            .delete<any>(
                `${environment.tradeServiceLink}/${encodeURIComponent(String(company))}` +
                    `/${this.costmatricesControllerUrl}/${encodeURIComponent(String(costMatrixId))}`,
                {
                    observe: 'response',
                },
            )
            .pipe(map((resp) => resp.ok));
    }

    public deleteCostMatrixLine(costMatrixId: number, costMatrixLineId: number) {
        const company: string = this.companyManager.getCurrentCompanyId();

        return this.http
            .delete<any>(
                `${environment.tradeServiceLink}/${encodeURIComponent(String(company))}` +
                    `/${this.costmatricesControllerUrl}/${encodeURIComponent(String(costMatrixId))}/${encodeURIComponent(
                        String(costMatrixLineId),
                    )}`,
                {
                    observe: 'response',
                },
            )
            .pipe(map((resp) => resp.ok));
    }

    public checkCostMatrixNameExists(name: string) {
        {
            const company: string = this.companyManager.getCurrentCompanyId();
            const apiUrl = `${encodeURIComponent(String(company))}/${this.costmatricesControllerUrl}`;

            return this.http
                .head(`${environment.tradeServiceLink}/${apiUrl}/` + name, {
                    headers: this.defaultHttpHeaders,
                    observe: 'response',
                })
                .pipe(map((resp) => resp.status === 200));
        }
    }

    public getTradeImageFieldsByCompany(): Observable<ApiCollection<TradeImageField>> {
        const company: string = this.companyManager.getCurrentCompanyId();

        return this.get<ApiCollection<TradeImageField>>(
            `${environment.tradeServiceLink}/${encodeURIComponent(String(company))}` + `/${this.sectionsControllerUrl}/imageField`,
        );
    }

    getTradeChildSections(request: ListAndSearchRequest): Observable<ApiCollection<ChildSectionsSearchResult>> {
        const company: string = this.companyManager.getCurrentCompanyId();

        return this.post<ApiCollection<ChildSectionsSearchResult>>(
            `${environment.tradeServiceLink}/${encodeURIComponent(String(company))}/` +
                `${this.sectionsControllerUrl}/getTradeChildSections`,
            request,
        );
    }

    getChildSections(sectionId: number, dataVersionId?: number): Observable<ChildSectionsSearchResult[]> {
        const company: string = this.companyManager.getCurrentCompanyId();

        const options: HttpRequestOptions = new HttpRequestOptions();
        let queryParameters = new HttpParams();
        if (dataVersionId) {
            queryParameters = queryParameters.set('dataVersionId', dataVersionId.toString());
        }
        options.params = queryParameters;

        return this.get<ApiCollection<ChildSectionsSearchResult>>(
            `${environment.tradeServiceLink}/${encodeURIComponent(String(company))}/` + `${this.sectionsControllerUrl}/${sectionId}/childs`,
            options,
        ).pipe(map((data: ApiCollection<ChildSectionsSearchResult>) => data.value));
    }

    public getTradeConfigurationDetails(): Observable<TradeConfiguration> {
        const company: string = this.companyManager.getCurrentCompanyId();
        return this.get<TradeConfiguration>(
            `${environment.tradeServiceLink}/${encodeURIComponent(String(company))}` + `/${this.sectionsControllerUrl}/tradeConfiguration`,
        );
    }

    createTradeFavorite(tradeFavorite: TradeFavoriteDetail) {
        const company: string = this.companyManager.getCurrentCompanyId();
        const action = `${encodeURIComponent(String(company))}/${this.tradefavoritesControllerUrl}`;
        return this.post(environment.tradeServiceLink + '/' + action, tradeFavorite);
    }

    checkTradeFavoriteNameExists(tradeFavoriteName: string) {
        {
            const company: string = this.companyManager.getCurrentCompanyId();
            const apiUrl = `${encodeURIComponent(String(company))}/${this.tradefavoritesControllerUrl}`;

            return this.http
                .head(`${environment.tradeServiceLink}/${apiUrl}/${encodeURIComponent(String(tradeFavoriteName))}`, {
                    headers: this.defaultHttpHeaders,
                    observe: 'response',
                })
                .pipe(map((resp) => resp.status === 200));
        }
    }

    // get Trades for bulk edit
    getTradesForBulkEdit(selectedSectionIds: number[]): Observable<ApiCollection<ContractsForBulkFunctions>> {
        const company: string = this.companyManager.getCurrentCompanyId();
        const options: HttpRequestOptions = new HttpRequestOptions();
        let queryParameters = new HttpParams();

        queryParameters = queryParameters.set('selectedSectionIds', selectedSectionIds.toString());

        options.params = queryParameters;
        return this.get<ApiCollection<ContractsForBulkFunctions>>(
            `${environment.tradeServiceLink}/${encodeURIComponent(String(company))}` + `/${this.sectionsControllerUrl}/tradebulkedit`,
            options,
        );
    }

    // get Trades for bulk closure
    getTradesForBulkClosure(selectedSectionIds: number[]): Observable<ApiCollection<ContractsForBulkFunctions>> {
        const company: string = this.companyManager.getCurrentCompanyId();
        const options: HttpRequestOptions = new HttpRequestOptions();
        let queryParameters = new HttpParams();

        queryParameters = queryParameters.set('selectedSectionIds', selectedSectionIds.toString());

        options.params = queryParameters;
        return this.get<ApiCollection<ContractsForBulkFunctions>>(
            `${environment.tradeServiceLink}/${encodeURIComponent(String(company))}` + `/${this.sectionsControllerUrl}/tradebulkclosure`,
            options,
        );
    }

    public bulkApproveSave(sectionIDList: number[]): Observable<boolean> {
        const company: string = this.companyManager.getCurrentCompanyId();

        const bulkapprovaldetails = new Bulkapproval();
        bulkapprovaldetails.companyId = company;
        bulkapprovaldetails.sectionIds = sectionIDList;

        const action = `/${encodeURIComponent(String(company))}/${this.sectionsControllerUrl}/bulkapprovaloftrades`;

        return this.http.post<any>(environment.tradeServiceLink + action, bulkapprovaldetails);
    }

    deleteFavorite(favoriteId: number) {
        const company: string = this.companyManager.getCurrentCompanyId();

        return this.http
            .delete<any>(
                `${environment.tradeServiceLink}/${encodeURIComponent(String(company))}` +
                `/${this.tradefavoritesControllerUrl}/${encodeURIComponent(String(favoriteId))}`,
                {
                    observe: 'response',
                },
            )
            .pipe(map((resp) => resp.ok));
    }

    getFavoritesByUserId(): Observable<ApiPaginatedCollection<TradeFavourite>> {
        const company: string = this.companyManager.getCurrentCompanyId();
        return this.get<ApiPaginatedCollection<TradeFavourite>>(
            `${environment.tradeServiceLink}/${encodeURIComponent(String(company))}/${this.tradefavoritesControllerUrl}`,
        );
    }

    getTradeFavoriteById(tradeFavoriteId: number): Observable<Section> {
        const company: string = this.companyManager.getCurrentCompanyId();
        return this.get<Section>(
            `${environment.tradeServiceLink}/${encodeURIComponent(String(company))}` +
            `/${this.tradefavoritesControllerUrl}/${encodeURIComponent(String(tradeFavoriteId))}`,
        );
    }

    getChildTradesForSection(sectionId: number): Observable<ApiCollection<ChildTradeForSection>> {
        const company: string = this.companyManager.getCurrentCompanyId();
        return this.http.get<ApiCollection<ChildTradeForSection>>(
            `${environment.tradeServiceLink}/${encodeURIComponent(String(company))}` +
                `/${this.sectionsControllerUrl}/${encodeURIComponent(String(sectionId))}/getChildTradesForSection`,
        );
    }

    getTradeFieldsForBulkEdit(): Observable<ApiCollection<TradeFieldsForBulkEdit>> {
        const company: string = this.companyManager.getCurrentCompanyId();
        const options: HttpRequestOptions = new HttpRequestOptions();
        const queryParameters = new HttpParams();

        options.params = queryParameters;

        return this.get<ApiCollection<TradeFieldsForBulkEdit>>(
            `${environment.tradeServiceLink}/${encodeURIComponent(String(company))}` +
            `/${this.sectionsControllerUrl}/tradefieldsforbulkedit`,
            options,
        );
    }

    getCostForSelectedContracts(sectionIds: number[]): Observable<ApiCollection<BulkCost>> {
        const company: string = this.companyManager.getCurrentCompanyId();
        const options: HttpRequestOptions = new HttpRequestOptions();
        let queryParameters = new HttpParams();

        queryParameters = queryParameters.set('sectionIds', sectionIds.toString());

        options.params = queryParameters;

        return this.get<ApiCollection<BulkCost>>(
            `${environment.tradeServiceLink}/${encodeURIComponent(String(company))}` +
                `/${this.sectionsControllerUrl}/getcostsforcontracts`,
            options,
        );
    }

    saveBulkCost(bulkCosts: BulkCost[]): Observable<ApiCollection<BulkCost>> {
        const company: string = this.companyManager.getCurrentCompanyId();
        const command = this.mapToSaveBulkCostsCommand(bulkCosts);
        const action = `/${encodeURIComponent(String(company))}/${this.sectionsControllerUrl}/addupdateordeletecostsinbulk`;

        return this.http.post<ApiCollection<BulkCost>>(environment.tradeServiceLink + action, command);
    }

    validateIntercoFields(intercoValidation: IntercoValidation): Observable<IntercoValidation> {
        const obj: any = { intercoValidation };
        const company: string = this.companyManager.getCurrentCompanyId();
        const action = `/${encodeURIComponent(String(company))}/${this.physicalControllerUrl}/validateIntercoFields`;
        return this.post<IntercoValidation>(environment.tradeServiceLink + action, obj);
    }

    createManualInterco(intercoModel: any): Observable<boolean> {
        const companyId: string = this.companyManager.getCurrentCompanyId();

        const action = `/${encodeURIComponent(String(companyId))}/${this.physicalControllerUrl}/
            ${intercoModel.sectionId}/createManualInterco`;
        return this.post<any>(environment.tradeServiceLink + action, intercoModel);
    }

    private mapToSaveBulkCostsCommand(costs: BulkCost[]): SaveBulkCostsCommand {
        const command = new SaveBulkCostsCommand();
        command.costs = costs;
        return command;
    }

    getParentCostsToAdjust(sectionId: number, dataVersionId: number): Observable<ApiCollection<ParentCostsToAdjust>> {
        const company: string = this.companyManager.getCurrentCompanyId();

        const options: HttpRequestOptions = new HttpRequestOptions();
        let queryParameters = new HttpParams();
        if (dataVersionId) {
            queryParameters = queryParameters.set('dataVersionId', dataVersionId.toString());
        }
        options.params = queryParameters;

        return this.get<ApiCollection<ParentCostsToAdjust>>(
            `${environment.tradeServiceLink}/${encodeURIComponent(String(company))}` +
                `/${this.sectionsControllerUrl}/${encodeURIComponent(String(sectionId))}/parentcoststoadjust`,
            options,
        );
    }

    getChildSectionsCostsToAdjust(sectionId: number, dataVersionId: number): Observable<ApiCollection<ChildSectionsCostsToAdjust>> {
        const company: string = this.companyManager.getCurrentCompanyId();

        const options: HttpRequestOptions = new HttpRequestOptions();
        let queryParameters = new HttpParams();
        if (dataVersionId) {
            queryParameters = queryParameters.set('dataVersionId', dataVersionId.toString());
        }
        options.params = queryParameters;

        return this.get<ApiCollection<ChildSectionsCostsToAdjust>>(
            `${environment.tradeServiceLink}/${encodeURIComponent(String(company))}` +
                `/${this.sectionsControllerUrl}/${encodeURIComponent(String(sectionId))}/childsectioncoststoadjust`,
            options,
        );
    }

    fxDealSearch(request: ListAndSearchRequest): Observable<ApiPaginatedCollection<FxDealSearchResult>> {
        const company: string = this.companyManager.getCurrentCompanyId();

        return this.post<ApiPaginatedCollection<FxDealSearchResult>>(
            `${environment.tradeServiceLink}/${encodeURIComponent(String(company))}/${this.fxDealsControllerUrl}/search`,
            request,
        );
    }

    getContextualDataForContractMerge(sectionId: number, dataVersionId?: number): Observable<MergeAllowedForContracts> {
        const company: string = this.companyManager.getCurrentCompanyId();
        const options: HttpRequestOptions = new HttpRequestOptions();
        let queryParameters = new HttpParams();
        if (dataVersionId) {
            queryParameters = queryParameters.set('dataVersionId', dataVersionId.toString());
        }
        options.params = queryParameters;
        return this.get<MergeAllowedForContracts>(
            `${environment.tradeServiceLink}/${encodeURIComponent(String(company))}` +
                `/${this.sectionsMergeControllerUrl}/contextualdataforcontractmerge/${encodeURIComponent(String(sectionId))}`,
            options,
        );
    }

    getfxDealById(fxDealById: number): Observable<FxDealDetail> {
        const company: string = this.companyManager.getCurrentCompanyId();

        return this.get<FxDealDetail>(
            `${environment.tradeServiceLink}/${encodeURIComponent(String(company))}` +
                `/${this.fxDealsControllerUrl}/${encodeURIComponent(String(fxDealById))}`,
        );
    }

    deleteFxDeal(fxDealById: number) {
        const company: string = this.companyManager.getCurrentCompanyId();

        return this.delete(
            `${environment.tradeServiceLink}/${encodeURIComponent(String(company))}` +
                `/${this.fxDealsControllerUrl}/${encodeURIComponent(String(fxDealById))}`,
        );
    }

    getContractFamilyOfSectionToMerge(sectionId: number, dataVersionId?: number): Observable<ApiCollection<ContractFamilyToTradeMerge>> {
        const company: string = this.companyManager.getCurrentCompanyId();
        const options: HttpRequestOptions = new HttpRequestOptions();
        let queryParameters = new HttpParams();
        if (dataVersionId) {
            queryParameters = queryParameters.set('dataVersionId', dataVersionId.toString());
        }
        options.params = queryParameters;

        return this.get<ApiCollection<ContractFamilyToTradeMerge>>(
            `${environment.tradeServiceLink}/${encodeURIComponent(String(company))}` +
                `/${this.sectionsMergeControllerUrl}/getcontractfamilyformerge/${encodeURIComponent(String(sectionId))}`,
            options,
        );
    }

    getSectionIdsForSelectedContractsToMerge(sectionIds: number[], dataVersionId?: number): Observable<ApiCollection<TradeMergeMessage>> {
        const company: string = this.companyManager.getCurrentCompanyId();
        const options: HttpRequestOptions = new HttpRequestOptions();
        let queryParameters = new HttpParams();
        queryParameters = queryParameters.set('sectionIds', sectionIds.toString());
        if (dataVersionId) {
            queryParameters.append('dataVersionId', dataVersionId.toString());
        }
        options.params = queryParameters;

        return this.get<ApiCollection<TradeMergeMessage>>(
            `${environment.tradeServiceLink}/${encodeURIComponent(String(company))}`
            + `/${this.sectionsMergeControllerUrl}/contextualdataforselectedcontractmerge/`,
            options);
    }

    saveContractsToTradeMerge(tradeMerge: MergeContracts[], dataVersionId: number): Observable<boolean> {
        const company: string = this.companyManager.getCurrentCompanyId();
        const command = this.mapToSaveMergeContractsCommand(tradeMerge, dataVersionId);
        const action = `/${encodeURIComponent(String(company))}/${this.sectionsMergeControllerUrl}/mergecontracts`;

        return this.http
            .post(environment.tradeServiceLink + action, command, {
                observe: 'response',
            })
            .pipe(map((resp) => resp.ok));
    }

    getFxDealForMonthEnd(dataVersionId: number): Observable<ApiPaginatedCollection<FxDealGenerateEndOfMonth>> {
        const company: string = this.companyManager.getCurrentCompanyId();
        const options: HttpRequestOptions = new HttpRequestOptions();
        let queryParameters = new HttpParams();
        if (dataVersionId) {
            queryParameters = queryParameters.set('dataVersionId', dataVersionId.toString());
        }
        options.params = queryParameters;
        return this.get<ApiPaginatedCollection<FxDealGenerateEndOfMonth>>(
            `${environment.tradeServiceLink}/${encodeURIComponent(String(company))}/${this.sectionsControllerUrl}/fxEndOfMonthData`,
            options,
        );
    }

    private mapToSaveMergeContractsCommand(contractToMerge: MergeContracts[], dataVersionId): SaveTradeMergeCommand {
        const command = new SaveTradeMergeCommand();
        command.mergeContracts = contractToMerge;
        command.dataVersionId = dataVersionId;
        return command;
    }

    getTagFields(): Observable<TagField[]> {
        const company: string = this.companyManager.getCurrentCompanyId();

        return this.get<TagField[]>(
            `${environment.tradeServiceLink}/${encodeURIComponent(String(company))}/${this.TagFieldsControllerUrl}`,
        );
    }
}
