import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { CompanyManagerService } from '../../../core/services/company-manager.service';
import { AllocationMessage } from '../../../trading/entities/allocation-message';
import { AllocatedTradeSearchResult } from '../../dtos/allocated-trade';
import { InvoiceMarkingSearchResult } from '../../dtos/invoice-marking';
import { InvoiceReversalSearchResult } from '../../dtos/invoice-reversal';
import { InvoiceSearchResult } from '../../dtos/invoice-search-result';
import { InvoiceSetupResult } from '../../dtos/invoice-setup-result';
import { TradeSearchResult } from '../../dtos/trade';
import { AllocateSection } from '../../entities/allocate-section.entity';
import { Allocation } from '../../entities/allocation.entity';
import { AssignedSection } from '../../entities/assigned-section.entity';
import { CashSummary } from '../../entities/cash.entity';
import { CharterBulkClosure } from '../../entities/charter-bulk-closure.entity';
import { Charter } from '../../entities/charter.entity';
import { CreateTransactionDocument } from '../../entities/create-transaction-document.entity';
import { HttpRequestOptions } from '../../entities/http-services/http-request-options.entity';
import { InvoiceMarkingDetails } from '../../entities/invoice-marking-status-tab.entity';
import { InvoiceMarkingPercentLines, InvoiceMarkings } from '../../entities/invoice-markings.entity';
import { ListAndSearchFilter } from '../../entities/list-and-search/list-and-search-filter.entity';
import { ListAndSearchRequest } from '../../entities/list-and-search/list-and-search-request.entity';
import { ManualJournalDocument } from '../../entities/manual-journal-document.entity';
import { SectionTraffic } from '../../entities/section-traffic.entity';
import { User } from '../../entities/user.entity';
import { ContractTypes } from '../../enums/contract-type.enum';
import { ApiCollection, ApiPaginatedCollection } from '../common/models';
import { DateConverterService } from '../date-converter.service';
import { AllocateSectionCommand } from '../execution/dtos/allocate-section-command';
import { AllocateSectionListCommand } from '../execution/dtos/allocate-section-list-command';
import { BulkDeallocateSectionCommand } from '../execution/dtos/bulk-deallocation-section-command';
import { BusinessSector } from '../execution/dtos/business-sector';
import { CashMatching } from '../execution/dtos/cash-matching';
import { CashRecord } from '../execution/dtos/cash-record';
import { CashSetup } from '../execution/dtos/cash-setup';
import { ContractsToCostInvoice } from '../execution/dtos/contracts-to-cost-invoice';
import { ContractsToInvoice } from '../execution/dtos/contracts-to-invoice';
import { ContractsToWashoutInvoice } from '../execution/dtos/contracts-to-washout-invoice';
import { GetCostsRequest, SearchCostForInvoicing } from '../execution/dtos/cost';
import { CreateCharterCommand } from '../execution/dtos/create-charter-command';
import { DocumentMatching } from '../execution/dtos/document-matching';
import { InterfaceSetup } from '../execution/dtos/interface-setup';
import { InvoiceForCashMatching } from '../execution/dtos/invoice-for-cash';
import { InvoiceHomeSearch } from '../execution/dtos/invoice-home-search';
import { InvoiceMarking } from '../execution/dtos/invoice-marking';
import { InvoiceMarkingListCommand } from '../execution/dtos/invoice-marking-list-command';
import { InvoiceMarkingPostingStatusCommand } from '../execution/dtos/invoice-marking-posting-status';
import { InvoiceRecord } from '../execution/dtos/invoice-record';
import { InvoiceSearch } from '../execution/dtos/invoice-search';
import { InvoiceSummaryRecord } from '../execution/dtos/invoice-summary-record';
import { ManualJournalCommand } from '../execution/dtos/manual-journal-command';
import { ManualJournalResponse } from '../execution/dtos/manual-journal-response';
import { MonthEndTemporaryAdjustmentListCommand } from '../execution/dtos/month-end-temporary-adjustment-list-command';
import { MonthEndTAResponse } from '../execution/dtos/month-end-temporary-adjustment-response';
import { FindUnpaidInvoicesResult } from '../execution/dtos/payment-order';
import { ReAssignSectionsCommand } from '../execution/dtos/reassign-sections-command';
import { RemoveAssignedSectionsCommand } from '../execution/dtos/remove-assigned-sections-command';
import { AssignSectionsRequest } from '../execution/dtos/section';
import { TradeForInvoiceSearchResult } from '../execution/dtos/trade';
import { TransactionCreationResponse } from '../execution/dtos/transaction-creation-response';
import { UpdateCharterCommand } from '../execution/dtos/update-charter-command';
import { DocumentMatchingRecord } from '../preaccounting/dtos/document-matching-record';
import { ListAndSearchFilterDto } from './../../dtos/list-and-search/list-and-search-filter-dto.dto';
import { HttpBaseService } from './http-base.service';
import { InvoiceMarkingPercentLinesCommand } from '../execution/dtos/Update-Invoice-Marking-Percent-Lines-Command';
import { YearEndProcess } from '../../dtos/year-end-process';
import { YearEndProcessResponse } from '../execution/year-end-process-response';
import { YearEndProcessCommand } from '../execution/year-end-process-command';
import { YearEndProcessReportResponse } from '../execution/year-end-process-report-response';
import { FXDealMonthEndTemporaryAdjustmentListCommand } from '../execution/dtos/fxdeal-month-end-temporary-adjustment-list-command';
import { FxDealMonthEndTAResponse } from '../execution/dtos/fxdeal-month-end-temporary-adjustment-response';

@Injectable({
    providedIn: 'root',
})
export class ExecutionService extends HttpBaseService {

    private readonly allocationControllerUrl = 'allocation';
    private readonly chartersControllerUrl = 'charters';
    private readonly charterManagerControllerUrl = 'chartermanagers';
    private readonly invoiceControllerUrl = 'invoices';
    private readonly cashControllerUrl = 'cash';
    private readonly manualJournalControllerUrl = 'manualJournal';
    private readonly manualDocumentMatchingControllerUrl = 'manualdocumentmatching';
    private readonly monthEndTemporaryAdjustmentControllerUrl = 'MonthEndTemporaryAdjustment';
    private readonly yearEndProcessControllerUrl = 'YearEndProcess';

    constructor(protected http: HttpClient,
        private dateConverter: DateConverterService,
        private companyManager: CompanyManagerService) {
        super(http);
    }

    // -- Allocation Methods
    public findContractToAllocate(originalsectionId: number, sectionLabelKeyword: string, pricingMethod: number)
        : Observable<ApiCollection<TradeSearchResult>> {
        const company: string = this.companyManager.getCurrentCompanyId();

        const options: HttpRequestOptions = new HttpRequestOptions();
        options.headers = this.defaultHttpHeaders;

        let queryParameters = new HttpParams();
        if (originalsectionId !== undefined && originalsectionId !== null) {
            queryParameters = queryParameters.set('originalsectionId', originalsectionId as any);
        }
        if (sectionLabelKeyword !== undefined && sectionLabelKeyword !== null) {
            queryParameters = queryParameters.set('sectionLabelKeyword', sectionLabelKeyword as any);
        }
        if (pricingMethod !== undefined && pricingMethod !== null) {
            queryParameters = queryParameters.set('pricingMethod', pricingMethod as any);
        }
        options.params = queryParameters;

        return this.get<ApiCollection<TradeSearchResult>>(
            `${environment.executionServiceLink}/${encodeURIComponent(String(company))}` +
            `/${this.allocationControllerUrl}/contractstoallocate`,
            options);
    }

    public allocate(allocatedSection: AllocateSectionCommand) {
        const company: string = this.companyManager.getCurrentCompanyId();
        const action = `/${encodeURIComponent(String(company))}/${this.allocationControllerUrl}/allocate/`;
        return this.post(environment.executionServiceLink + action, allocatedSection);
    }

    public allocateImageSections(allocatedSection: AllocateSection[]) {
        const command = this.mapToAssignedSectionsAllocationCommand(allocatedSection);
        const company: string = this.companyManager.getCurrentCompanyId();
        const action = `/${encodeURIComponent(String(company))}/${this.allocationControllerUrl}/imageAllocateSectionList/`;
        return this.post(environment.executionServiceLink + action, command);
    }

    // --Allocation Card Status Tab
    public getAllocationBySectionId(sectionId: number, dataVersionId?: number): Observable<Allocation> {
        const company: string = this.companyManager.getCurrentCompanyId();

        const options: HttpRequestOptions = new HttpRequestOptions();

        let queryParameters = new HttpParams();
        if (dataVersionId) {
            queryParameters = queryParameters.set('dataVersionId', dataVersionId.toString());
        }
        options.params = queryParameters;

        return this.get<Allocation>(
            `${environment.executionServiceLink}/${encodeURIComponent(String(company))}`
            + `/${this.allocationControllerUrl}/allocationbysection/${encodeURIComponent(String(sectionId))}`,
            options);
    }

    public GetSectionTrafficDetails(sectionId: number, dataVersionId?: number): Observable<SectionTraffic> {
        const company: string = this.companyManager.getCurrentCompanyId();

        const options: HttpRequestOptions = new HttpRequestOptions();

        let queryParameters = new HttpParams();
        if (dataVersionId) {
            queryParameters = queryParameters.set('dataVersionId', dataVersionId.toString());
        }
        options.params = queryParameters;

        return this.get<SectionTraffic>(
            `${environment.executionServiceLink}/${encodeURIComponent(String(company))}`
            + `/${this.allocationControllerUrl}/sectiontraffic/${encodeURIComponent(String(sectionId))}`,
            options);
    }

    // -- Invoicing Methods
    public findGoodsInvoices(invoiceRef: string): Observable<ApiPaginatedCollection<InvoiceHomeSearch>> {
        const company: string = this.companyManager.getCurrentCompanyId();

        const options: HttpRequestOptions = new HttpRequestOptions();
        options.headers = this.defaultHttpHeaders;

        let queryParameters = new HttpParams();
        if (invoiceRef !== undefined && invoiceRef !== null) {
            queryParameters = queryParameters.set('invoiceRef', invoiceRef as any);
        }
        options.params = queryParameters;

        return this.get<ApiPaginatedCollection<InvoiceHomeSearch>>(
            `${environment.executionServiceLink}/${encodeURIComponent(String(company))}/${this.invoiceControllerUrl}`,
            options);
    }

    public findGoodsContractToInvoice(invoiceSearch: InvoiceSearch): Observable<ApiCollection<TradeForInvoiceSearchResult>> {
        const company: string = this.companyManager.getCurrentCompanyId();

        const options: HttpRequestOptions = new HttpRequestOptions();
        options.headers = this.defaultHttpHeaders;

        let queryParameters = new HttpParams();

        queryParameters = queryParameters.set('type', invoiceSearch.type.toString() as any);
        queryParameters = queryParameters.set('filterParameter', invoiceSearch.filterParameter as any);

        if (invoiceSearch.periodFromDate != null && invoiceSearch.periodFromDate.toString() !== '') {
            queryParameters = queryParameters.set(
                'periodFromDate',
                this.dateConverter.dateToStringConverter(invoiceSearch.periodFromDate) as any);
        }
        if (invoiceSearch.periodToDate != null && invoiceSearch.periodToDate.toString() !== '') {
            queryParameters = queryParameters.set(
                'periodToDate',
                this.dateConverter.dateToStringConverter(invoiceSearch.periodToDate) as any);
        }
        options.params = queryParameters;

        return this.get<ApiCollection<TradeForInvoiceSearchResult>>(
            `${environment.executionServiceLink}/${encodeURIComponent(String(company))}/`
            + `${this.invoiceControllerUrl}/contractstoinvoice`,
            options);
    }

    public findCostsToInvoice(costSearchCriterias: SearchCostForInvoicing): Observable<ApiCollection<GetCostsRequest>> {
        const company: string = this.companyManager.getCurrentCompanyId();

        const options: HttpRequestOptions = new HttpRequestOptions();
        options.headers = this.defaultHttpHeaders;

        let queryParameters = new HttpParams();

        queryParameters = queryParameters.set('costType', costSearchCriterias.costType as any);
        queryParameters = queryParameters.set('supplierCode', costSearchCriterias.supplierCode as any);
        queryParameters = queryParameters.set('charter', costSearchCriterias.charter as any);
        queryParameters = queryParameters.set('contractRef', costSearchCriterias.contractRef as any);
        options.params = queryParameters;

        return this.get<ApiCollection<GetCostsRequest>>(
            `${environment.executionServiceLink}/${encodeURIComponent(String(company))}/${this.invoiceControllerUrl}/coststoInvoice`,
            options);
    }

    public findPurchaseGoodsContractToInvoiceBySectionId(sectionId: number): Observable<ApiCollection<TradeForInvoiceSearchResult>> {
        const company: string = this.companyManager.getCurrentCompanyId();

        const options: HttpRequestOptions = new HttpRequestOptions();
        options.headers = this.defaultHttpHeaders;

        let queryParameters = new HttpParams();
        queryParameters = queryParameters.set('type', String(ContractTypes.Purchase));

        options.params = queryParameters;

        return this.get<ApiCollection<TradeForInvoiceSearchResult>>(
            `${environment.executionServiceLink}/${encodeURIComponent(String(company))}`
            + `/${this.invoiceControllerUrl}/contractstoinvoice/${encodeURIComponent(String(sectionId))}`,
            options);
    }

    public findSaleGoodsContractToInvoiceBySectionId(sectionId: number): Observable<ApiCollection<TradeForInvoiceSearchResult>> {
        const company: string = this.companyManager.getCurrentCompanyId();

        const options: HttpRequestOptions = new HttpRequestOptions();
        options.headers = this.defaultHttpHeaders;

        let queryParameters = new HttpParams();
        queryParameters = queryParameters.set('type', String(ContractTypes.Sale));
        options.params = queryParameters;

        return this.get<ApiCollection<TradeForInvoiceSearchResult>>(
            `${environment.executionServiceLink}/${encodeURIComponent(String(company))}`
            + `/${this.invoiceControllerUrl}/contractstoinvoice/${encodeURIComponent(String(sectionId))}`,
            options);
    }

    public getInvoiceMarkingBySectionId(sectionId: number): Observable<ApiCollection<InvoiceMarking>> {
        const company: string = this.companyManager.getCurrentCompanyId();

        const options: HttpRequestOptions = new HttpRequestOptions();
        options.headers = this.defaultHttpHeaders;

        let queryParameters = new HttpParams();
        if (sectionId !== undefined && sectionId !== null) {
            queryParameters = queryParameters.set('sectionId', sectionId as any);
        }
        options.params = queryParameters;

        return this.get<ApiCollection<InvoiceMarking>>(
            `${environment.executionServiceLink}/${encodeURIComponent(String(company))}/invoicemarkings`,
            options);
    }

    public getCostInvoiceMarkingByCostId(costId: number): Observable<ApiCollection<InvoiceMarking>> {
        const company: string = this.companyManager.getCurrentCompanyId();

        const options: HttpRequestOptions = new HttpRequestOptions();
        options.headers = this.defaultHttpHeaders;

        let queryParameters = new HttpParams();
        if (costId !== undefined && costId !== null) {
            queryParameters = queryParameters.set('costId', costId as any);
        }
        options.params = queryParameters;

        return this.get<ApiCollection<InvoiceMarking>>(
            `${environment.executionServiceLink}/${encodeURIComponent(String(company))}/invoicemarkings`,
            options);
    }

    public invoiceContracts(invoice: InvoiceRecord): Observable<InvoiceRecord> {
        const company: string = this.companyManager.getCurrentCompanyId();

        return this.post<InvoiceRecord>(
            `${environment.executionServiceLink}/${encodeURIComponent(String(company))}/${this.invoiceControllerUrl}`,
            invoice);
    }

    public invoiceContractsAsDraft(invoice: InvoiceRecord): Observable<InvoiceRecord> {
        const company: string = this.companyManager.getCurrentCompanyId();

        return this.post<InvoiceRecord>(
            `${environment.executionServiceLink}/${encodeURIComponent(String(company))}/${this.invoiceControllerUrl}/drafts`,
            invoice);
    }

    public deleteDraftInvoice(invoiceId: number): Observable<boolean> {
        const company: string = this.companyManager.getCurrentCompanyId();

        return this.http.delete(
            `${environment.executionServiceLink}/${encodeURIComponent(String(company))}`
            + `/${this.invoiceControllerUrl}/drafts/${encodeURIComponent(String(invoiceId))}`,
            {
                observe: 'response',
            }).pipe(map((resp) => resp.ok));
    }

    public createManualJournal(manualJournal: ManualJournalDocument): Observable<ManualJournalResponse> {
        const company: string = this.companyManager.getCurrentCompanyId();
        let manualJournalCommand: ManualJournalCommand;
        manualJournalCommand = this.mapToManualJournalCommand(manualJournal);
        return this.post<ManualJournalDocument>(
            `${environment.executionServiceLink}/${encodeURIComponent(String(company))}/${this.manualJournalControllerUrl}`,
            manualJournalCommand);
    }

    public CreateTransactionDocument(createTransactionDocument: CreateTransactionDocument): Observable<TransactionCreationResponse> {
        const company: string = this.companyManager.getCurrentCompanyId();
        return this.post<TransactionCreationResponse>(
            `${environment.executionServiceLink}/${encodeURIComponent(String(company))}/${this.invoiceControllerUrl}/createtransactiondocument`,
            createTransactionDocument);
    }

    getContractsToInvoice(invoiceType: number): Observable<ApiCollection<ContractsToInvoice>> {

        const company: string = this.companyManager.getCurrentCompanyId();
        const options: HttpRequestOptions = new HttpRequestOptions();
        let queryParameters = new HttpParams();

        queryParameters = queryParameters.set('invoiceType', invoiceType.toString());

        options.params = queryParameters;

        return this.get<ApiCollection<ContractsToInvoice>>(
            `${environment.executionServiceLink}/${encodeURIComponent(String(company))}`
            + `/${this.invoiceControllerUrl}/contractstoinvoicebyinvoicetype`,
            options);
    }

    searchContractsToPurchaseInvoiceForCommercial(filters: ListAndSearchFilter[],
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

        const list = this.searchContractForCommercialPurchaseInvoice(request)
            .pipe(
                map((data) => {
                    return data.value;
                }),
            );

        return list;
    }

    searchContractsToSaleInvoiceForCommercial(filters: ListAndSearchFilter[],
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

        const list = this.searchContractForCommercialSaleInvoice(request)
            .pipe(
                map((data) => {
                    return data.value;
                }),
            );

        return list;
    }

    getCostContractsToInvoice(): Observable<ApiCollection<ContractsToCostInvoice>> {
        const company: string = this.companyManager.getCurrentCompanyId();
        const options: HttpRequestOptions = new HttpRequestOptions();

        return this.get<ApiCollection<ContractsToCostInvoice>>(
            `${environment.executionServiceLink}/${encodeURIComponent(String(company))}`
            + `/${this.invoiceControllerUrl}/costcontractsbyinvoicetype`,
            options);
    }

    searchContractsForCostInvoice(request: ListAndSearchRequest): Observable<ApiPaginatedCollection<ContractsToCostInvoice>> {
        const company: string = this.companyManager.getCurrentCompanyId();

        return this.post<ApiPaginatedCollection<ContractsToCostInvoice>>(
            `${environment.executionServiceLink}/${encodeURIComponent(String(company))}/${this.invoiceControllerUrl}`
            + `/costinvoice/search`,
            request);
    }

    getCostForSelectedContracts(sectionIds: number[]): Observable<ApiCollection<ContractsToCostInvoice>> {
        const company: string = this.companyManager.getCurrentCompanyId();
        const options: HttpRequestOptions = new HttpRequestOptions();
        let queryParameters = new HttpParams();

        queryParameters = queryParameters.set('sectionIds', sectionIds.toString());

        options.params = queryParameters;

        return this.get<ApiCollection<ContractsToCostInvoice>>(
            `${environment.executionServiceLink}/${encodeURIComponent(String(company))}`
            + `/${this.invoiceControllerUrl}/costsbysectionids`,
            options);
    }

    // get Business Sector for posting purpose
    getBusinessSectorForPosting() {
        const company: string = this.companyManager.getCurrentCompanyId();
        const options: HttpRequestOptions = new HttpRequestOptions();
        return this.get<BusinessSector>(
            `${environment.executionServiceLink}/${encodeURIComponent(String(company))}`
            + `/${this.invoiceControllerUrl}/businesssectorconfiguration`,
            options);
    }
    // get the allocated allocated contracts along with selected Washout Contracts
    public getAllocatedContractsForSelectedWashout(selectedSectionIds: number[]): Observable<ApiCollection<ContractsToWashoutInvoice>> {
        const company: string = this.companyManager.getCurrentCompanyId();
        const options: HttpRequestOptions = new HttpRequestOptions();
        let queryParameters = new HttpParams();

        queryParameters = queryParameters.set('selectedSectionIds', selectedSectionIds.toString());

        options.params = queryParameters;
        return this.get<ApiCollection<ContractsToWashoutInvoice>>(
            `${environment.executionServiceLink}/${encodeURIComponent(String(company))}`
            + `/${this.invoiceControllerUrl}/allocatedwashoutsbySectionids`,
            options);
    }

    // -- charters
    public getCharters(): Observable<ApiPaginatedCollection<Charter>> {
        const company: string = this.companyManager.getCurrentCompanyId();

        return this.get<ApiPaginatedCollection<Charter>>(
            `${environment.executionServiceLink}/${encodeURIComponent(String(company))}/${this.chartersControllerUrl}`);
    }

    charterSearch(request: ListAndSearchRequest): Observable<ApiPaginatedCollection<Charter>> {
        const company: string = this.companyManager.getCurrentCompanyId();

        return this.post<ApiPaginatedCollection<Charter>>(
            `${environment.executionServiceLink}/${encodeURIComponent(String(company))}/${this.chartersControllerUrl}/search`, request);
    }

    searchAssignSections(request: ListAndSearchRequest): Observable<ApiPaginatedCollection<AssignedSection>> {
        const company: string = this.companyManager.getCurrentCompanyId();

        return this.post<ApiPaginatedCollection<AssignedSection>>(
            `${environment.executionServiceLink}/${encodeURIComponent(String(company))}/${this.chartersControllerUrl}/searchCharterAssignmentSections`, request);
    }

    public getChartersForCompanies(selectedCompanies: string[]): Observable<ApiPaginatedCollection<Charter>> {
        const company: string = this.companyManager.getCurrentCompanyId();
        // selectedCompanies.push(company);

        const options: HttpRequestOptions = new HttpRequestOptions();
        let queryParameters = new HttpParams();

        queryParameters = queryParameters.set('selectedCompanies', selectedCompanies.toString());

        options.params = queryParameters;

        return this.get<ApiPaginatedCollection<Charter>>(
            `${environment.executionServiceLink}/${encodeURIComponent(String(company))}`
            + `/${this.chartersControllerUrl}`,
            options);
    }

    public createCharter(charter: Charter): Observable<Charter> {
        const command = this.mapToCreateCharterCommand(charter);
        const company: string = this.companyManager.getCurrentCompanyId();

        return this.post(
            `${environment.executionServiceLink}/${encodeURIComponent(String(company))}/${this.chartersControllerUrl}`,
            command);
    }

    public closeCharter(charterIds: number[], childFlag?: number, dataVersionId?: number): Observable<CharterBulkClosure[]> {
        const company: string = this.companyManager.getCurrentCompanyId();

        return this.http.post<CharterBulkClosure[]>(
            `${environment.executionServiceLink}/${encodeURIComponent(String(company))}/${this.chartersControllerUrl}`
            + `/${encodeURIComponent(String(charterIds.toString()))}/close`,
            null);
    }

    public openCharter(charterIds: number[], childFlag?: number, dataVersionId?: number): Observable<boolean> {
        const company: string = this.companyManager.getCurrentCompanyId();

        return this.http.post<any>(
            `${environment.executionServiceLink}/${encodeURIComponent(String(company))}/${this.chartersControllerUrl}`
            + `/${encodeURIComponent(String(charterIds.toString()))}/open`,
            null,
            {
                observe: 'response',
            }).pipe(
                map((resp) => resp.ok));
    }

    public updateCharter(charter: Charter, isDeassignSectionRequest: boolean): Observable<void> {
        const command = this.mapToUpdateCharterCommand(charter, isDeassignSectionRequest);
        const company: string = this.companyManager.getCurrentCompanyId();

        return this.patch(
            `${environment.executionServiceLink}/${encodeURIComponent(String(company))}`
            + `/${this.chartersControllerUrl}/${encodeURIComponent(String(charter.charterId))}`,
            command);
    }

    public getCharterByRef(charterRef: string): Observable<Charter> {
        const company: string = this.companyManager.getCurrentCompanyId();

        return this.get<Charter>(
            `${environment.executionServiceLink}/${encodeURIComponent(String(company))}`
            + `/${this.chartersControllerUrl}/${encodeURIComponent(charterRef)}`);
    }

    public checkCharterExistance(charterRef: string): Observable<HttpResponse<any>> {
        const company: string = this.companyManager.getCurrentCompanyId();
        return this.http.head(
            `${environment.executionServiceLink}/${encodeURIComponent(String(company))}/`
            + `${this.chartersControllerUrl}/${encodeURIComponent(charterRef)}`,
            {
                observe: 'response',
            });
    }

    public getCharterById(charterId: number): Observable<Charter> {
        const company: string = this.companyManager.getCurrentCompanyId();

        return this.get<Charter>(
            `${environment.executionServiceLink}/${encodeURIComponent(String(company))}`
            + `/${this.chartersControllerUrl}/${encodeURIComponent(String(charterId))}`);
    }

    public getCharterBySectionId(sectionId: number): Observable<Charter> {
        const company: string = this.companyManager.getCurrentCompanyId();

        return this.get<Charter>(
            `${environment.executionServiceLink}/${encodeURIComponent(String(company))}`
            + `/${this.chartersControllerUrl}/chartersbysection/${encodeURIComponent(String(sectionId))}`);
    }

    public findChartersByReference(reference: string): Observable<ApiPaginatedCollection<Charter>> {
        const company: string = this.companyManager.getCurrentCompanyId();

        const options: HttpRequestOptions = new HttpRequestOptions();
        options.headers = this.defaultHttpHeaders;

        let queryParameters = new HttpParams();
        if (reference !== undefined && reference !== null) {
            queryParameters = queryParameters.set('charterRef', reference as any);
        }
        options.params = queryParameters;

        return this.get<ApiPaginatedCollection<Charter>>(
            `${environment.executionServiceLink}/${encodeURIComponent(String(company))}/${this.chartersControllerUrl}`,
            options);
    }

    getAllCharterManagers(): Observable<ApiCollection<User>> {
        const company: string = this.companyManager.getCurrentCompanyId();

        return this.get<ApiCollection<User>>(
            `${environment.executionServiceLink}/${encodeURIComponent(String(company))}/${this.charterManagerControllerUrl}`,
        );
    }

    public assignSectionsToCharter(charterId: number, sectionTrafficList: SectionTraffic[]): Observable<Charter> {
        const company: string = this.companyManager.getCurrentCompanyId();

        const request: AssignSectionsRequest = new AssignSectionsRequest();
        request.charterId = charterId;
        request.sectionsTraffic = sectionTrafficList;

        return this.http.post<Charter>(
            `${environment.executionServiceLink}/${encodeURIComponent(String(company))}`
            + `/${this.chartersControllerUrl}/${encodeURIComponent(String(charterId))}/sections`,
            request);
    }

    public getSectionsToBeAssignToCharter(reference: string = null): Observable<ApiPaginatedCollection<AssignedSection>> {

        const company: string = this.companyManager.getCurrentCompanyId();
        const options: HttpRequestOptions = new HttpRequestOptions();
        let queryParameters = new HttpParams();
        if (reference !== undefined && reference !== null) {
            queryParameters = queryParameters.set('contractLabel', reference);
        }
        options.params = queryParameters;

        return this.http.get<ApiPaginatedCollection<AssignedSection>>(
            `${environment.executionServiceLink}/${encodeURIComponent(String(company))}`
            + `/${this.chartersControllerUrl}/sectionstoassign`,
            options);
    }

    public getSectionsAssignedToCharter(charterId: number): Observable<ApiPaginatedCollection<AssignedSection>> {
        const company: string = this.companyManager.getCurrentCompanyId();

        return this.http.get<ApiPaginatedCollection<AssignedSection>>(
            `${environment.executionServiceLink}/${encodeURIComponent(String(company))}`
            + `/${this.chartersControllerUrl}/${encodeURIComponent(String(charterId))}/sections`);
    }

    public removeSectionFromCharter(charterId: number, sectionsId: number[]): Observable<Charter> {
        const company: string = this.companyManager.getCurrentCompanyId();
        const command = this.mapToRemoveAssignedSectionsCommand(charterId, sectionsId);

        return this.http.post<Charter>(
            `${environment.executionServiceLink}/${encodeURIComponent(String(company))}`
            + `/${this.chartersControllerUrl}/${encodeURIComponent(String(charterId))}/sections/deassignsection`,
            command);
    }

    public reAssignSectionToCharter(charter: Charter, newCharter: Charter): Observable<Charter> {
        const company: string = this.companyManager.getCurrentCompanyId();
        const command = this.mapToReAssignSectionsCommand(charter, newCharter);

        return this.http.post<Charter>(
            `${environment.executionServiceLink}/${encodeURIComponent(String(company))}`
            + `/${this.chartersControllerUrl}/${encodeURIComponent(String(charter.charterId))}/sections/reassignsection`,
            command);
    }

    public deleteCharter(charterId: number): Observable<boolean> {
        const company: string = this.companyManager.getCurrentCompanyId();

        return this.http.delete<any>(
            `${environment.executionServiceLink}/${encodeURIComponent(String(company))}`
            + `/${this.chartersControllerUrl}/${encodeURIComponent(String(charterId))}`,
            {
                observe: 'response',
            }).pipe(map((resp) => resp.ok));
    }

    public deallocateContract(sectionId: number, reInstateTrafficDetails: any, dataVersionId?: number): Observable<boolean> {
        const company: string = this.companyManager.getCurrentCompanyId();

        const request = {
            sectionId,
            reInstateTrafficDetails,
            dataVersionId,
        };

        return this.http.post(
            `${environment.executionServiceLink}`
            + `/${encodeURIComponent(String(company))}/${this.allocationControllerUrl}`
            + `/deallocate/`,
            request,
            {
                headers: this.defaultHttpHeaders,
                observe: 'response',
            }).pipe(map((resp) => resp.ok));
    }

    public deallocateBulkContract(deAllocateBulkSectionCommand: BulkDeallocateSectionCommand): Observable<boolean> {
        const company: string = this.companyManager.getCurrentCompanyId();
        const request = deAllocateBulkSectionCommand;
        return this.http.post(
            `${environment.executionServiceLink}`
            + `/${encodeURIComponent(String(company))}/${this.allocationControllerUrl}`
            + `/bulkdeallocate/`,
            request,
            {
                headers: this.defaultHttpHeaders,
                observe: 'response',
            }).pipe(map((resp) => resp.ok));
    }

    public updatePostingStatus(transactionDocuemntId: number, postingStatus: number): Observable<void> {
        const company: string = this.companyManager.getCurrentCompanyId();
        const action = `${encodeURIComponent(String(company))}/${
            this.invoiceControllerUrl}/updatepostingstatus`;
        const command = this.mapToInvoiceMarkingPotingStatusCommand(transactionDocuemntId, postingStatus);

        return this.post(environment.executionServiceLink + '/' + action, command);
    }

    public createInvoice(invoice: InvoiceRecord): Observable<InvoiceRecord> {
        const company: string = this.companyManager.getCurrentCompanyId();
        const action = `${encodeURIComponent(String(company))}/${
            this.invoiceControllerUrl}/`;

        return this.post(environment.executionServiceLink + '/' + action, invoice);
    }

    public findUnpaidInvoices(searchCriteria: string): Observable<ApiPaginatedCollection<FindUnpaidInvoicesResult>> {
        const company: string = this.companyManager.getCurrentCompanyId();

        const options: HttpRequestOptions = new HttpRequestOptions();
        options.headers = this.defaultHttpHeaders;

        let queryParameters = new HttpParams();
        if (searchCriteria !== undefined && searchCriteria !== null) {
            queryParameters = queryParameters.set('searchCriteria', searchCriteria as any);
        }
        options.params = queryParameters;

        return this.http.get<ApiPaginatedCollection<FindUnpaidInvoicesResult>>(
            `${environment.executionServiceLink}/${encodeURIComponent(String(company))}/invoices/unpaid/`,
            options);
    }

    public allocateSections(allocatedSection: AllocateSection[]): Observable<void> {
        const command = this.mapToAssignedSectionsAllocationCommand(allocatedSection);
        const company: string = this.companyManager.getCurrentCompanyId();
        const action = `/${encodeURIComponent(String(company))}/${this.allocationControllerUrl}/allocateSectionList/`;
        return this.post(environment.executionServiceLink + action, command);
    }

    private mapToCreateCharterCommand(charter: Charter): CreateCharterCommand {
        const command = new CreateCharterCommand();
        command.charterId = charter.charterId;
        command.vesselId = charter.vesselId;
        command.description = charter.description;
        command.departureDate = charter.departureDate;
        command.dischargeLocation = charter.dischargeLocationCode;
        command.loadingLocation = charter.loadingLocationCode;
        command.reference = charter.charterCode;
        command.transportType = charter.transportTypeCode;
        command.arrivalDate = charter.arrivalDate;
        command.memo = charter.memo;
        command.charterManagerId = charter.charterManagerId;
        command.blRef = charter.blRef;
        command.blDate = charter.blDate;
        command.weightUnitId = charter.weightUnitId;
        command.currency = charter.currency;
        command.departmentId = charter.departmentId;
        return command;
    }
    private mapToUpdateCharterCommand(charter: Charter, isDeassignSectionRequest: boolean): UpdateCharterCommand {
        const command = new UpdateCharterCommand();
        command.charterId = charter.charterId;
        command.vesselId = charter.vesselId;
        command.description = charter.description;
        command.departureDate = charter.departureDate;
        command.dischargeLocation = charter.dischargeLocationCode;
        command.loadingLocation = charter.loadingLocationCode;
        command.reference = charter.charterCode;
        command.transportType = charter.transportTypeCode;
        command.arrivalDate = charter.arrivalDate;
        command.memo = charter.memo;
        command.charterManagerId = charter.charterManagerId;
        command.blRef = charter.blRef;
        command.blDate = charter.blDate;
        command.weightUnitId = charter.weightUnitId;
        command.currency = charter.currency;
        command.departmentId = charter.departmentId;
        command.isDeassignSectionRequest = isDeassignSectionRequest;
        command.marketSector = charter.marketSector;
        command.sectionsAssigned = this.mapAssignedContractsCommand(charter.assignedSections);
        return command;
    }

    private mapToRemoveAssignedSectionsCommand(charterId: number, sectionIds: number[]): RemoveAssignedSectionsCommand {
        const command = new RemoveAssignedSectionsCommand();
        command.charterId = charterId;
        command.sectionIds = sectionIds;
        return command;
    }

    private mapToReAssignSectionsCommand(charter: Charter, newCharter: Charter): ReAssignSectionsCommand {
        const command = new ReAssignSectionsCommand();
        command.newCharterId = newCharter.charterId;
        command.newCharterVesselCode = newCharter.vesselCode;
        command.charterId = charter.charterId;
        command.sectionsAssigned = this.mapAssignedContractsCommand(charter.assignedSections);

        return command;
    }

    private mapToAssignedSectionsAllocationCommand(allocateSections: AllocateSection[]): AllocateSectionListCommand {
        const command = new AllocateSectionListCommand();
        command.allocateSections = allocateSections;
        return command;
    }

    mapAssignedContractsCommand(assignedSections: AssignedSection[]) {
        return assignedSections.map((p) => ({
            contractType: p.contractType,
            blDate: p.blDate,
            sectionId: p.sectionId,
            contractLabel: p.contractLabel,
            buyerCode: p.buyerCode,
            sellerCode: p.sellerCode,
            counterparty: p.counterparty,
            quantity: p.quantity,
            weightUnitId: p.weightUnitId,
            commodityId: p.commodityId,
            allocatedTo: p.allocatedTo,
            sectionAllocated: p.sectionAllocated,
            price: p.price,
            priceUnitId: p.priceUnitId,
            currency: p.currency,
            charterRef: p.charterRef,
            assignedCharterReference: p.assignedCharterReference,
            assignmentDate: p.assignmentDate,
            vessel: p.vessel,
            groupNumber: p.groupNumber,
            portOrigin: p.portOrigin,
            marketSector: p.marketSector,
            portDestination: p.portDestination,
            blRef: p.blRef,
            invoiceRef: p.invoiceRef,
            invoicingStatus: p.invoicingStatus,
            pricingMethodId: p.pricingMethodId,
            contractStatusCode: p.contractStatusCode,
            modifiedDateTime: p.modifiedDateTime,
            amenmodifiedBydedBy: p.modifiedBy,
            paymentTermCode: p.paymentTermCode,
            shipmentPeriod: p.shipmentPeriod,
            departmentId: p.departmentId,
            createdDateTime: p.createdDateTime,
            modifiedBy: p.modifiedBy,
            removeSectionTrafficInfo: p.removeSectionTrafficInfo,
            contractBlDate: p.contractBlDate,
            allocatedSectionId: p.allocatedSectionId,
            allocatedDateTime: p.allocatedDateTime,
            amendedBy: p.amendedBy,
            amendedOn: p.amendedOn,
            arbitrationCode: p.arbitrationCode,
            arbitrationDescription: p.arbitrationDescription,
            buyerDescription: p.buyerDescription,
            commodity1: p.commodity1,
            commodity2: p.commodity2,
            commodity3: p.commodity3,
            commodity4: p.commodity4,
            commodity5: p.commodity5,
            commodityDescription: p.commodityDescription,
            companyId: p.companyId,
            contractIssuedOn: p.contractIssuedOn,
            contractQuantity: p.contractQuantity,
            contractTermCode: p.contractTermCode,
            contractTermDescription: p.contractTermDescription,
            contractTermLocationPortCode: p.contractTermLocationPortCode,
            contractTermLocationDescription: p.contractTermLocationDescription,
            contractValue: p.contractValue,
            counterpartyRef: p.counterpartyRef,
            contractDate: p.contractDate,
            createdBy: p.createdBy,
            cropYear: p.cropYear,
            currencyDescription: p.currencyDescription,
            deliveryPeriodStart: p.deliveryPeriodStart,
            deliveryPeriodEnd: p.deliveryPeriodEnd,
            departmentCode: p.departmentCode,
            departmentDescription: p.departmentDescription,
            groupingNumber: p.groupingNumber,
            displayContractType: p.displayContractType,
            invoiceValue: p.invoiceValue,
            displayInvoicingStatus: p.displayInvoicingStatus,
            mainInvoiceReference: p.mainInvoiceReference,
            mainInvoiceDate: p.mainInvoiceDate,
            memo: p.memo,
            otherReference: p.otherReference,
            parentContractLabel: p.parentContractLabel,
            paymentDate: p.paymentDate,
            paymentTermDescription: p.paymentTermDescription,
            percentageInvoiced: p.percentageInvoiced,
            periodType: p.periodType,
            physicalContractCode: p.physicalContractCode,
            portOfOrigin: p.portOfOrigin,
            portOfOriginDescription: p.portOfOriginDescription,
            portOfDestination: p.portOfDestination,
            portOfDestinationDescription: p.portOfDestinationDescription,
            positionMonth: p.positionMonth,
            positionType: p.positionType,
            originalQuantity: p.originalQuantity,
            priceCode: p.priceCode,
            priceUnitDescription: p.priceUnitDescription,
            quantityCodeInvoiced: p.quantityCodeInvoiced,
            quantityInvoiced: p.quantityInvoiced,
            weightUnitCode: p.weightUnitCode,
            sellerDescription: p.sellerDescription,
            traderDisplayName: p.traderDisplayName,
            vesselName: p.vesselName,
            weightUnitDescription: p.weightUnitDescription,
            allocatedToSectionId: p.allocatedToSectionId,
            principalCommodity: p.principalCommodity,
            part2: p.part2,
            part3: p.part3,
            WeightCode: p.WeightCode,
        }));
    }

    // this call is used to updated section traffic details from traffic tab .
    updateSectionTraffic(sectionTraffic: SectionTraffic) {
        const company: string = this.companyManager.getCurrentCompanyId();
        return this.patch(
            `${environment.executionServiceLink}/${encodeURIComponent(String(company))}/${this.chartersControllerUrl}`,
            sectionTraffic);
    }

    // This method will return all allocation warning messages.
    getWarningMessages(sectionId: number, allocatedSectionId: number): Observable<ApiCollection<AllocationMessage>> {
        const company: string = this.companyManager.getCurrentCompanyId();

        return this.get<ApiCollection<AllocationMessage>>(
            `${environment.executionServiceLink}/${encodeURIComponent(String(company))}`
            + `/${this.allocationControllerUrl}/getwarningmessages/${encodeURIComponent(String(sectionId))}`
            + `/${encodeURIComponent(String(allocatedSectionId))}`,

        );
    }

    search(request: ListAndSearchRequest): Observable<ApiPaginatedCollection<InvoiceSearchResult>> {
        const company: string = this.companyManager.getCurrentCompanyId();

        return this.post<ApiPaginatedCollection<InvoiceSearchResult>>(
            `${environment.executionServiceLink}/${encodeURIComponent(String(company))}/${this.invoiceControllerUrl}/search`,
            request);
    }

    searchContractForCommercialPurchaseInvoice(request: ListAndSearchRequest): Observable<ApiPaginatedCollection<InvoiceSearchResult>> {
        const company: string = this.companyManager.getCurrentCompanyId();

        return this.post<ApiPaginatedCollection<InvoiceSearchResult>>(
            `${environment.executionServiceLink}/${encodeURIComponent(String(company))}/${this.invoiceControllerUrl}` +
            `/contractstopurchaseinvoice/search`,
            request);
    }


    searchContractForCommercialSaleInvoice(request: ListAndSearchRequest): Observable<ApiPaginatedCollection<InvoiceSearchResult>> {
        const company: string = this.companyManager.getCurrentCompanyId();

        return this.post<ApiPaginatedCollection<InvoiceSearchResult>>(
            `${environment.executionServiceLink}/${encodeURIComponent(String(company))}/${this.invoiceControllerUrl}` +
            `/contractstosaleinvoice/search`,
            request);
    }

    public getInvoiceById(invoiceId: number): Observable<InvoiceSummaryRecord> {
        const company: string = this.companyManager.getCurrentCompanyId();

        return this.get<InvoiceSummaryRecord>(
            `${environment.executionServiceLink}/${encodeURIComponent(String(company))}`
            + `/${this.invoiceControllerUrl}/${encodeURIComponent(String(invoiceId))}`);
    }

    // get all cash List
    getCashList(costDirectionId: number): Observable<ApiPaginatedCollection<CashSummary>> {
        const company: string = this.companyManager.getCurrentCompanyId();

        const options: HttpRequestOptions = new HttpRequestOptions();
        options.headers = this.defaultHttpHeaders;

        let queryParameters = new HttpParams();
        if (costDirectionId !== undefined && costDirectionId !== null) {
            queryParameters = queryParameters.set('costDirectionId', costDirectionId as any);
        }
        options.params = queryParameters;

        return this.get<ApiPaginatedCollection<CashSummary>>(
            `${environment.executionServiceLink}/${encodeURIComponent(String(company))}/${this.cashControllerUrl}`,
            options);
    }

    // create cash
    public createCash(cash: CashRecord): Observable<CashRecord> {
        // create cash is basically unmaintainable as code execution is hard to follow and the same variables are used in many screens.
        // To fix issue with JL Lines, here we override de cash object passing in parameter the correct values,
        // and we avoid touching the code of the screens

        const finalCashRecord = { ...cash };
        finalCashRecord.documentMatchings.forEach((document) => {
            document.amountToBePaid = Math.abs(document.amountToBePaid) * Math.sign(document.amount);
        });

        const company: string = this.companyManager.getCurrentCompanyId();
        return this.post<CashRecord>(
            `${environment.executionServiceLink}/${encodeURIComponent(String(company))}/${this.cashControllerUrl}/`, finalCashRecord);
    }

    public getCashSetupDetails(): Observable<CashSetup> {
        const company: string = this.companyManager.getCurrentCompanyId();
        return this.get<CashSetup>(
            `${environment.executionServiceLink}/${encodeURIComponent(String(company))}`
            + `/${this.cashControllerUrl}/cashsetup`);
    }

    public getInterfaceSetupDetails(interfaceTypeId: number): Observable<InterfaceSetup> {
        const company: string = this.companyManager.getCurrentCompanyId();
        const options: HttpRequestOptions = new HttpRequestOptions();
        let queryParameters = new HttpParams();

        queryParameters = queryParameters.set('interfaceTypeId', interfaceTypeId as any);

        options.params = queryParameters;
        return this.get<InterfaceSetup>(
            `${environment.executionServiceLink}/${encodeURIComponent(String(company))}`
            + `/${this.invoiceControllerUrl}/interfacesetup`, options);
    }

    public getInvoiceSetupByCompany(): Observable<InvoiceSetupResult> {
        const company: string = this.companyManager.getCurrentCompanyId();

        return this.get<InvoiceSetupResult>(
            `${environment.executionServiceLink}/${encodeURIComponent(String(company))}`
            + `/${this.invoiceControllerUrl}/setup`);
    }

    // get invoice details for cash matching
    getInvoiceToMatch(counterpartyId: string, department: number, currency: string, isEdit: boolean
        , matchFlagId: number, documentReference: string): Observable<ApiCollection<CashMatching>> {
        const company: string = this.companyManager.getCurrentCompanyId();
        const options: HttpRequestOptions = new HttpRequestOptions();
        let queryParameters = new HttpParams();

        queryParameters = queryParameters.set('counterpartyId', counterpartyId.toString());
        if (department !== undefined && department !== null) {
            queryParameters = queryParameters.set('department', department as any);
        }
        queryParameters = queryParameters.set('currency', currency.toString());
        queryParameters = queryParameters.set('isEdit', isEdit ? 'true' : 'false');
        if (matchFlagId !== undefined && matchFlagId !== null) {
            queryParameters = queryParameters.set('matchFlagId', matchFlagId as any);
        }
        if (documentReference !== undefined && documentReference !== null) {
            queryParameters = queryParameters.set('documentReference', documentReference as any);
        }

        options.params = queryParameters;

        return this.get<ApiCollection<CashMatching>>(
            `${environment.executionServiceLink}/${encodeURIComponent(String(company))}`
            + `/${this.cashControllerUrl}/getinvoiceforcashmatching`,
            options);
    }
    getInvoiceToMatchByDocumentReference(docReference: string): Observable<ApiCollection<CashMatching>> {
        const company: string = this.companyManager.getCurrentCompanyId();
        const options: HttpRequestOptions = new HttpRequestOptions();
        let queryParameters = new HttpParams();

        queryParameters = queryParameters.set('docReference', docReference.toString());

        options.params = queryParameters;

        return this.get<ApiCollection<CashMatching>>(
            `${environment.executionServiceLink}/${encodeURIComponent(String(company))}`
            + `/${this.cashControllerUrl}/getinvoicebydocumentreference`,
            options);
    }

    getForeignExchangeRateByCurrency(currencyCodeFrom: string, currencyCodeTo: string): Observable<CashMatching> {
        const company = this.companyManager.getCurrentCompanyId();
        const options: HttpRequestOptions = new HttpRequestOptions();
        options.headers = this.defaultHttpHeaders;
        let queryParameters = new HttpParams();
        queryParameters = queryParameters.set('currencyCodeFrom', currencyCodeFrom);
        queryParameters = queryParameters.set('currencyCodeTo', currencyCodeTo);

        options.params = queryParameters;
        return this.get<CashMatching>(`${environment.executionServiceLink}/${encodeURIComponent(String(company))}`
            + `/${this.cashControllerUrl}/getfxrateforcash`,
            options);
    }

    // get invoice details by section
    public getInvoiceDetailsBySection(sectionId: number, childFlag?: number, dataVersionId?: number): Observable<ApiPaginatedCollection<InvoiceMarkingSearchResult>> {
        const company: string = this.companyManager.getCurrentCompanyId();

        const options: HttpRequestOptions = new HttpRequestOptions();
        options.headers = this.defaultHttpHeaders;
        let queryParameters = new HttpParams();
        queryParameters = childFlag ? queryParameters.set('childFlag', childFlag.toString()) : queryParameters.set('childFlag', '0');

        // queryParameters = queryParameters.set('childFlag', childFlag.toString());

        if (dataVersionId) {
            queryParameters = queryParameters.set('dataVersionId', dataVersionId.toString());
        }

        options.params = queryParameters;
        return this.get<ApiPaginatedCollection<InvoiceMarkingSearchResult>>(

            `${environment.executionServiceLink}/${encodeURIComponent(String(company))}`
            + `/${this.invoiceControllerUrl}/DetailsBySection/${encodeURIComponent(String(sectionId))}`, options);
    }

    getInvoiceMarkingDetailsByCompanyAndSectionId(sectionId: number, dataVersionId?: number) {
        const company: string = this.companyManager.getCurrentCompanyId();

        const options: HttpRequestOptions = new HttpRequestOptions();
        options.headers = this.defaultHttpHeaders;
        let queryParameters = new HttpParams();
        if (dataVersionId) {
            queryParameters = queryParameters.set('dataVersionId', dataVersionId.toString());
        }
        options.params = queryParameters;

        return this.get<InvoiceMarkingDetails>(
            `${environment.executionServiceLink}/${encodeURIComponent(String(company))}/${this.invoiceControllerUrl}`
            + `/InvoiceMarkingDetails/${encodeURIComponent(String(sectionId))}`,
            options);
    }

    // get invoice details by section
    public getInvoiceCostBySection(sectionId: number, dataVersionId?: number): Observable<ApiPaginatedCollection<InvoiceMarkingSearchResult>> {
        const company: string = this.companyManager.getCurrentCompanyId();

        const options: HttpRequestOptions = new HttpRequestOptions();
        options.headers = this.defaultHttpHeaders;
        let queryParameters = new HttpParams();
        if (dataVersionId) {
            queryParameters = queryParameters.set('dataVersionId', dataVersionId.toString());
        }
        options.params = queryParameters;

        return this.get<ApiPaginatedCollection<InvoiceMarkingSearchResult>>(
            `${environment.executionServiceLink}/${encodeURIComponent(String(company))}`
            + `/${this.invoiceControllerUrl}/InvoiceCostBySection/${encodeURIComponent(String(sectionId))}`, options);

    }

    // get invoice details by cost
    public getInvoiceDetailsByCost(costId: number): Observable<ApiPaginatedCollection<InvoiceMarkingSearchResult>> {
        const company: string = this.companyManager.getCurrentCompanyId();

        return this.get<ApiPaginatedCollection<InvoiceMarkingSearchResult>>(

            `${environment.executionServiceLink}/${encodeURIComponent(String(company))}`
            + `/${this.invoiceControllerUrl}/invoiceMarkingCost/${encodeURIComponent(String(costId))}`);

    }

    private mapToInvoiceMarkingPotingStatusCommand(
        transactionDocumentId: number, postingStatusId: number): InvoiceMarkingPostingStatusCommand {
        const command = new InvoiceMarkingPostingStatusCommand();
        command.transactionDocumentId = transactionDocumentId;
        command.postingStatusId = postingStatusId;
        return command;
    }

    private mapToInvoiceMarkingCommand(sectionId: number, invoices: InvoiceMarkings[], invoiceStatusId?: number, dataVersionId?: number,
        splitAction: boolean = false): InvoiceMarkingListCommand {
        const command = new InvoiceMarkingListCommand();
        command.sectionId = sectionId;
        command.invoices = invoices;
        command.invoiceStatusId = invoiceStatusId;
        command.splitAction = splitAction;
        command.dataVersionId = dataVersionId;
        return command;
    }

    // update invoice marking details
    public updateInvoiceMarkingDetails(sectionId: number, invoiceMarking: InvoiceMarkings[],
        invoiceStatusId: number, dataVersionId?: number,
        splitAction: boolean = false) {
        const company: string = this.companyManager.getCurrentCompanyId();
        const command = this.mapToInvoiceMarkingCommand(sectionId, invoiceMarking, invoiceStatusId, dataVersionId, splitAction);
        return this.patch<InvoiceMarkings[]>(
            `${environment.executionServiceLink}/${encodeURIComponent(String(company))}/${this.invoiceControllerUrl}`, command);
    }

    // update invoice marking percent lines.
    public updateInvoiceMarkingLines(invoiceMarkingLines: InvoiceMarkingPercentLines[], dataVersionId?: number) {
        const company: string = this.companyManager.getCurrentCompanyId();
        const command = this.mapToInvoiceMarkingPercentLinesCommand(invoiceMarkingLines, dataVersionId);
        return this.post<InvoiceMarkings[]>(
            `${environment.executionServiceLink}/${encodeURIComponent(String(company))}/${this.invoiceControllerUrl}`
            + `/invoicemarkinglines`,
            command);
    }

    public getCashByCashId(cashId: number): Observable<CashRecord> {
        const company: string = this.companyManager.getCurrentCompanyId();

        return this.get<CashRecord>(
            `${environment.executionServiceLink}/${encodeURIComponent(String(company))}`
            + `/${this.cashControllerUrl}/${encodeURIComponent(String(cashId))}`);
    }

    // update cash
    public updateCash(cash: CashRecord): Observable<CashRecord> {
        const company: string = this.companyManager.getCurrentCompanyId();

        const finalCashRecord = { ...cash };
        finalCashRecord.documentMatchings.forEach((document) => {
            document.amountToBePaid = Math.abs(document.amountToBePaid) * Math.sign(document.amount);
        });

        return this.patch<CashRecord>(
            `${environment.executionServiceLink}/${encodeURIComponent(String(company))}`
            + `/${this.cashControllerUrl}/${encodeURIComponent(String(cash.cashId))}`,
            finalCashRecord);
    }

    // get invoice marking for cost
    public getInvoiceMarkingsForCost(costId: number, dataVersionId?: number):
        Observable<ApiPaginatedCollection<InvoiceMarkingSearchResult>> {
        const company: string = this.companyManager.getCurrentCompanyId();

        const options: HttpRequestOptions = new HttpRequestOptions();
        options.headers = this.defaultHttpHeaders;
        let queryParameters = new HttpParams();
        if (dataVersionId) {
            queryParameters = queryParameters.set('dataVersionId', dataVersionId.toString());
        }
        options.params = queryParameters;

        return this.get<ApiPaginatedCollection<InvoiceMarkingSearchResult>>(
            `${environment.executionServiceLink}/${encodeURIComponent(String(company))}`
            + `/${this.invoiceControllerUrl}/invoiceMarkingCost/${encodeURIComponent(String(costId))}`,
            options);
    }

    public insertInvoiceMarkingCostDetails(invoiceMarking: InvoiceMarkings[]) {
        const company: string = this.companyManager.getCurrentCompanyId();
        const command = this.mapToInvoiceMarkingCommand(null, invoiceMarking);
        return this.post<InvoiceMarkings[]>(
            `${environment.executionServiceLink}/${encodeURIComponent(String(company))}/${this.invoiceControllerUrl}`
            + `/insertInvoiceMarkingCost`,
            command);
    }

    // delete invoice marking

    deleteInvoiceMarking(invoiceMarkingId: number) {
        const company: string = this.companyManager.getCurrentCompanyId();

        return this.http.delete<any>(
            `${environment.executionServiceLink}/${encodeURIComponent(String(company))}`
            + `/${this.invoiceControllerUrl}/deleteInvoiceMarking/${encodeURIComponent(String(invoiceMarkingId))}`,
            {
                observe: 'response',
            }).pipe(map((resp) => resp.ok));
    }

    // get washout contracts for invoicing
    getWashoutContractsToInvoice(): Observable<ApiCollection<ContractsToWashoutInvoice>> {
        const company: string = this.companyManager.getCurrentCompanyId();
        const options: HttpRequestOptions = new HttpRequestOptions();

        return this.get<ApiCollection<ContractsToWashoutInvoice>>(
            `${environment.executionServiceLink}/${encodeURIComponent(String(company))}`
            + `/${this.invoiceControllerUrl}/getwashoutcontracts`,
            options);
    }

    searchWashoutContractsToInvoice(request: ListAndSearchRequest): Observable<ApiPaginatedCollection<ContractsToWashoutInvoice>> {
        const company: string = this.companyManager.getCurrentCompanyId();

        return this.post<ApiPaginatedCollection<ContractsToWashoutInvoice>>(
            `${environment.executionServiceLink}/${encodeURIComponent(String(company))}/${this.invoiceControllerUrl}`
            + `/washoutcontracts/search`,
            request);
    }

    // get document reference id for search implementaion in cash
    public getDocumentReferenceList(): Observable<ApiCollection<InvoiceForCashMatching>> {
        const company: string = this.companyManager.getCurrentCompanyId();
        return this.get<ApiCollection<InvoiceForCashMatching>>(
            `${environment.executionServiceLink}/${encodeURIComponent(String(company))}`
            + `/${this.cashControllerUrl}/getdocumentreferencelist`);
    }

    public deleteCash(cashId: number) {
        const company: string = this.companyManager.getCurrentCompanyId();
        return this.http.delete<any>(
            `${environment.executionServiceLink}/${encodeURIComponent(String(company))}`
            + `/${this.cashControllerUrl}/${encodeURIComponent(String(cashId))}`,
            {
                observe: 'response',
            }).pipe(map((resp) => resp.ok));
    }

    public getInvoicesToReverse(): Observable<ApiPaginatedCollection<InvoiceReversalSearchResult>> {
        {
            const company: string = this.companyManager.getCurrentCompanyId();

            return this.get<ApiPaginatedCollection<InvoiceReversalSearchResult>>(

                `${environment.executionServiceLink}/${encodeURIComponent(String(company))}`
                + `/${this.invoiceControllerUrl}/InvoicesForReversal`);
        }
    }

    public searchInvoicesToReverse(request: ListAndSearchRequest): Observable<ApiPaginatedCollection<InvoiceReversalSearchResult>> {
        const company: string = this.companyManager.getCurrentCompanyId();

        return this.post<ApiPaginatedCollection<InvoiceReversalSearchResult>>(
            `${environment.executionServiceLink}/${encodeURIComponent(String(company))}/${this.invoiceControllerUrl}`
            + `/invoicereversal/search`,
            request);
    }

    public checkExternalInvoiceReferenceExists(externalInvoiceRef: string) {
        {
            const company: string = this.companyManager.getCurrentCompanyId();
            const apiUrl = `${encodeURIComponent(String(company))}/${this.invoiceControllerUrl}`;

            return this.http
                .head(`${environment.executionServiceLink}/${apiUrl}/` + externalInvoiceRef, {
                    headers: this.defaultHttpHeaders,
                    observe: 'response',
                })
                .pipe(map((resp) => resp.status === 200));
        }
    }

    private mapToManualJournalCommand(manualJournal: ManualJournalDocument): ManualJournalCommand {
        const command = new ManualJournalCommand();
        command.manualJournal = manualJournal;
        return command;
    }

    // get document reference id for search implementaion in create match flag
    // will handle both create and delete match flag
    public getDocumentReferenceValues(matchType: number): Observable<ApiCollection<DocumentMatching>> {
        const company: string = this.companyManager.getCurrentCompanyId();
        const options: HttpRequestOptions = new HttpRequestOptions();
        let queryParameters = new HttpParams();
        queryParameters = queryParameters.set('matchType', matchType.toString());
        options.params = queryParameters;
        return this.get<ApiCollection<DocumentMatching>>(
            `${environment.executionServiceLink}/${encodeURIComponent(String(company))}`
            + `/${this.manualDocumentMatchingControllerUrl}/getdocumentreferencelist`, options);
    }
    // to get the document details corresponding to the document reference
    getDocumentToMatchByDocumentReference(docReference: string): Observable<ApiCollection<DocumentMatching>> {
        const company: string = this.companyManager.getCurrentCompanyId();
        const options: HttpRequestOptions = new HttpRequestOptions();
        let queryParameters = new HttpParams();
        queryParameters = queryParameters.set('docReference', docReference.toString());
        options.params = queryParameters;
        return this.get<ApiCollection<DocumentMatching>>(
            `${environment.executionServiceLink}/${encodeURIComponent(String(company))}`
            + `/${this.manualDocumentMatchingControllerUrl}/getdocumentbydocumentreference`,
            options);
    }
    // get all the documents for document matching
    getDocumentsToMatch(counterpartyId: string, department: number, currency: string, isEdit: boolean
        , matchFlagId: number): Observable<ApiCollection<DocumentMatching>> {
        const company: string = this.companyManager.getCurrentCompanyId();
        const options: HttpRequestOptions = new HttpRequestOptions();
        let queryParameters = new HttpParams();

        queryParameters = queryParameters.set('counterpartyId', counterpartyId.toString());
        if (department !== undefined && department !== null) {
            queryParameters = queryParameters.set('department', department as any);
        }
        queryParameters = queryParameters.set('currency', currency.toString());
        queryParameters = queryParameters.set('isEdit', isEdit ? 'true' : 'false');
        if (matchFlagId !== undefined && matchFlagId !== null) {
            queryParameters = queryParameters.set('matchFlagId', matchFlagId as any);
        }

        options.params = queryParameters;

        return this.get<ApiCollection<DocumentMatching>>(
            `${environment.executionServiceLink}/${encodeURIComponent(String(company))}`
            + `/${this.manualDocumentMatchingControllerUrl}/getdocumentsformatching`,
            options);
    }
    public getMatchFlag(): Observable<ApiCollection<DocumentMatching>> {
        const company: string = this.companyManager.getCurrentCompanyId();
        return this.get<ApiCollection<DocumentMatching>>(
            `${environment.executionServiceLink}/${encodeURIComponent(String(company))}`
            + `/${this.manualDocumentMatchingControllerUrl}/getmatchflaglist`);
    }
    // get the list of documents corresponding to match flag
    getDocumentToUnmatchByMatchFlag(matchFlagCode: string): Observable<ApiCollection<DocumentMatching>> {
        const company: string = this.companyManager.getCurrentCompanyId();
        const options: HttpRequestOptions = new HttpRequestOptions();
        let queryParameters = new HttpParams();
        queryParameters = queryParameters.set('matchFlagCode', matchFlagCode.toString());
        options.params = queryParameters;
        return this.get<ApiCollection<DocumentMatching>>(
            `${environment.executionServiceLink}/${encodeURIComponent(String(company))}`
            + `/${this.manualDocumentMatchingControllerUrl}/getdocumentbymatchflag`,
            options);
    }
    // get all the documents for document matching
    getDocumentToUnmatch(counterpartyId: string, department: number, currency: string, documentReference: string, matchFlagCode: string):
        Observable<ApiCollection<DocumentMatching>> {
        const company: string = this.companyManager.getCurrentCompanyId();
        const options: HttpRequestOptions = new HttpRequestOptions();
        let queryParameters = new HttpParams();

        queryParameters = queryParameters.set('counterpartyId', counterpartyId.toString());
        if (department !== undefined && department !== null) {
            queryParameters = queryParameters.set('department', department as any);
        }
        queryParameters = queryParameters.set('currency', currency.toString());
        if (documentReference !== undefined && documentReference !== null) {
            queryParameters = queryParameters.set('documentReference', documentReference as any);
        }
        if (matchFlagCode !== undefined && matchFlagCode !== null) {
            queryParameters = queryParameters.set('matchFlagCode', matchFlagCode as any);
        }
        options.params = queryParameters;

        return this.get<ApiCollection<DocumentMatching>>(
            `${environment.executionServiceLink}/${encodeURIComponent(String(company))}`
            + `/${this.manualDocumentMatchingControllerUrl}/getdocumentsforunmatch`,
            options);
    }
    // get the document list for unmatch
    getDocumentToUnMatchbyDocumentReference(docReference: string): Observable<ApiCollection<DocumentMatching>> {
        const company: string = this.companyManager.getCurrentCompanyId();
        const options: HttpRequestOptions = new HttpRequestOptions();
        let queryParameters = new HttpParams();

        queryParameters = queryParameters.set('docReference', docReference.toString());

        options.params = queryParameters;

        return this.get<ApiCollection<DocumentMatching>>(
            `${environment.executionServiceLink}/${encodeURIComponent(String(company))}`
            + `/${this.manualDocumentMatchingControllerUrl}/getdocumenttounmatchbydocumentreference`,
            options);
    }
    // Create match flag
    public createMatchFlag(documents: DocumentMatchingRecord): Observable<DocumentMatchingRecord> {
        const company: string = this.companyManager.getCurrentCompanyId();
        return this.post<DocumentMatchingRecord>(
            `${environment.executionServiceLink}/${encodeURIComponent(String(company))}`
            + `/${this.manualDocumentMatchingControllerUrl}/creatematch`,
            documents);
    }
    // delete match flag
    public deleteMatchFlag(documents: DocumentMatchingRecord): Observable<DocumentMatchingRecord> {
        const company: string = this.companyManager.getCurrentCompanyId();

        return this.post<DocumentMatchingRecord>(
            `${environment.executionServiceLink}/${encodeURIComponent(String(company))}`
            + `/${this.manualDocumentMatchingControllerUrl}/deletematch`,
            documents);
    }
    public updateDocumentMatching(manualDocumentMatching: DocumentMatchingRecord): Observable<DocumentMatchingRecord> {
        const company: string = this.companyManager.getCurrentCompanyId();

        return this.patch<DocumentMatchingRecord>(
            `${environment.executionServiceLink}/${encodeURIComponent(String(company))}`
            + `/${this.manualDocumentMatchingControllerUrl}/${encodeURIComponent(String(manualDocumentMatching.matchFlagId))}`,
            manualDocumentMatching);
    }

    public GetPossibleAllocationByCharterAsync(charterId: number): Observable<ApiPaginatedCollection<AllocatedTradeSearchResult>> {
        const company: string = this.companyManager.getCurrentCompanyId();
        return this.http.get<ApiPaginatedCollection<AllocatedTradeSearchResult>>(
            `${environment.executionServiceLink}/${encodeURIComponent(String(company))}`
            + `/${this.allocationControllerUrl}/getPossibleAllocation/${encodeURIComponent(String(charterId))}`);
    }
    public GetPossibleDeallocationByCharterAsync(charterId: number): Observable<ApiPaginatedCollection<AllocatedTradeSearchResult>> {
        const company: string = this.companyManager.getCurrentCompanyId();
        return this.http.get<ApiPaginatedCollection<AllocatedTradeSearchResult>>(
            `${environment.executionServiceLink}/${encodeURIComponent(String(company))}`
            + `/${this.allocationControllerUrl}/getPossiblDeallocation/${encodeURIComponent(String(charterId))}`);
    }

    public SaveMonthEndTemporaryAdjustment(monthEndTemporaryAdjustmentListCommand: MonthEndTemporaryAdjustmentListCommand,
    ):
        Observable<MonthEndTAResponse> {
        const company: string = this.companyManager.getCurrentCompanyId();
        const action = `/${encodeURIComponent(String(company))}/${this.monthEndTemporaryAdjustmentControllerUrl}/saveMonthEnd/`;
        return this.post<MonthEndTAResponse>(environment.executionServiceLink + action, monthEndTemporaryAdjustmentListCommand);
    }

    public SaveFxDealMonthEndTemporaryAdjustment(fxDealMonthEndTemporaryAdjustmentListCommand: FXDealMonthEndTemporaryAdjustmentListCommand,
    ):
        Observable<FxDealMonthEndTAResponse> {
        const company: string = this.companyManager.getCurrentCompanyId();
        const action = `/${encodeURIComponent(String(company))}/${this.monthEndTemporaryAdjustmentControllerUrl}/saveFxDealMonthEnd/`;
        return this.post<FxDealMonthEndTAResponse>(environment.executionServiceLink + action, fxDealMonthEndTemporaryAdjustmentListCommand);
    }

    public GenerateYearEndProcessPostingReport(year: YearEndProcessCommand,
    ):
        Observable<YearEndProcessReportResponse> {
        const company: string = this.companyManager.getCurrentCompanyId();
        const action = `/${encodeURIComponent(String(company))}/${this.yearEndProcessControllerUrl}/generateposting/`;
        return this.post<YearEndProcessReportResponse>(environment.executionServiceLink + action, year);
    }

    public GetYearEndProcessLines(year: number): Observable<ApiPaginatedCollection<YearEndProcess>> {
        const company: string = this.companyManager.getCurrentCompanyId();
        return this.get<ApiPaginatedCollection<YearEndProcess>>(
            `${environment.executionServiceLink}/${encodeURIComponent(String(company))}`
            + `/${this.yearEndProcessControllerUrl}/displayPnLClearance/${encodeURIComponent(String(year))}`);
    }

    // list and search for Cash List
    searchCashPaymentList(request: ListAndSearchRequest): Observable<ApiPaginatedCollection<CashSummary>> {
        const company: string = this.companyManager.getCurrentCompanyId();

        return this.post<ApiPaginatedCollection<CashSummary>>(
            `${environment.executionServiceLink}/${encodeURIComponent(String(company))}/${this.cashControllerUrl}/search`,
            request);
    }
    searchCashReceiptList(request: ListAndSearchRequest): Observable<ApiPaginatedCollection<CashSummary>> {
        const company: string = this.companyManager.getCurrentCompanyId();

        return this.post<ApiPaginatedCollection<CashSummary>>(
            `${environment.executionServiceLink}/${encodeURIComponent(String(company))}/${this.cashControllerUrl}/searchReceipt`,
            request);
    }
    getAssignedSectionsForCharterList(charterIds: number[]): Observable<CharterBulkClosure[]> {
        const company: string = this.companyManager.getCurrentCompanyId();

        return this.http.get<CharterBulkClosure[]>(
            `${environment.executionServiceLink}/${encodeURIComponent(String(company))}` +
            `/${this.chartersControllerUrl}/${encodeURIComponent(String(charterIds))}/charterAssignedSections`);
    }

    private mapToInvoiceMarkingPercentLinesCommand(invoicesMarkingLines: InvoiceMarkingPercentLines[], dataVersionId: number): InvoiceMarkingPercentLinesCommand {
        const command = new InvoiceMarkingPercentLinesCommand();
        command.invoiceMarkingPercentLines = invoicesMarkingLines;
        command.dataVersionId = dataVersionId;
        return command;
    }

}
