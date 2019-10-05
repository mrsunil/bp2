import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { CompanyManagerService } from '../../../core/services/company-manager.service';
import { AccountingDocumentStatusToDeletedCommand } from '../../entities/accounting-document-status-deleted.entity';
import { AccountingSetup } from '../../entities/accounting-setup.entity';
import { HttpRequestOptions } from '../../entities/http-services/http-request-options.entity';
import { PostingManagement } from '../../entities/posting-management.entity';
import { StartStopPostingProcessCommand } from '../../entities/posting-process-start-stop.entity';
import { ReversalAccountingDocument } from '../../entities/reversal-accounting-document.entity';
import { TransactionDetail } from '../../entities/transaction-detail.entity';
import { PostingManagementDisplayView } from '../../models/posting-management-display-view';
import { ApiCollection, ApiPaginatedCollection } from '../common/models';
import { DocumentMatching } from '../execution/dtos/document-matching';
import { AccountingDocumentStatusCommand } from '../preaccounting/dtos/accounting-document-status-command';
import { AccountingDocumentStatusDtoCommand } from '../preaccounting/dtos/accounting-document-status-dto-command';
import { CreateAccountingDocumentCommand } from '../preaccounting/dtos/create-accounting-document-command';
import { DocumentMatchingRecord } from '../preaccounting/dtos/document-matching-record';
import { HttpBaseService } from './http-base.service';
import { ProcessMessage } from '../../../hidden/entities/process-message.entity';
import { ProcessStatus } from '../../entities/process-status.entity';
import { DateConverterService } from '../date-converter.service';
import { ListAndSearchRequest } from '../../entities/list-and-search/list-and-search-request.entity';
import { ListAndSearchFilter } from '../../entities/list-and-search/list-and-search-filter.entity';
import { ListAndSearchFilterDto } from '../../dtos/list-and-search/list-and-search-filter-dto.dto';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class PreaccountingService extends HttpBaseService {
    private readonly accountingDocumentControllerUrl = 'accountingdocuments';
    private readonly accountingSetUpControllerUrl = 'accountingsetup';
    constructor(protected http: HttpClient,
        private companyManager: CompanyManagerService,
        private dateConverter: DateConverterService) {
        super(http);
    }

    public authorizeForPosting(lstPostingManagement: PostingManagementDisplayView[]): Observable<void> {
        const company: string = this.companyManager.getCurrentCompanyId();
        const action = `${encodeURIComponent(String(company))}/${
            this.accountingDocumentControllerUrl}/authorizeforposting`;
        const command = this.mapToAuthorizeForPostingCommand(lstPostingManagement);
        return this.post(environment.preAccountingServiceLink + '/' + action, command);
    }

    private mapToCreateAccoutingDocumentCommand(documentID: number): CreateAccountingDocumentCommand {
        const command = new CreateAccountingDocumentCommand();
        command.docId = documentID;
        return command;
    }

    private mapToUpdateAccountingDocumentStatusCommand(): AccountingDocumentStatusDtoCommand {
        const command = new AccountingDocumentStatusDtoCommand();
        const accountingDocuments: AccountingDocumentStatusCommand[] = [];
        command.accountingDocuments = accountingDocuments;
        return command;
    }

    private mapToAuthorizeForPostingCommand(lstPostingManagement: PostingManagementDisplayView[]): AccountingDocumentStatusDtoCommand {
        const command = new AccountingDocumentStatusDtoCommand();
        const accountingDocument: AccountingDocumentStatusCommand[] = [];
        lstPostingManagement.forEach((element) => {
            const object = new AccountingDocumentStatusCommand();
            object.accountingId = element.accountingId;
            object.statusId = element.statusId;
            accountingDocument.push(object);
        });
        command.accountingDocuments = accountingDocument;
        return command;
    }

    getAccountingDocForPosting(request: ListAndSearchRequest): Observable<ApiPaginatedCollection<PostingManagement>> {
        const company: string = this.companyManager.getCurrentCompanyId();

        return this.post<ApiPaginatedCollection<PostingManagement>>(
            `${environment.preAccountingServiceLink}/${encodeURIComponent(String(company))}/${this.accountingDocumentControllerUrl}` +
            `/postingManagement`,
            request);
    }

    getAllPostingManagement(filters: ListAndSearchFilter[],
        offset?: number,
        limit?: number): Observable<ApiPaginatedCollection<any>> {

        const filtersForColumns: ListAndSearchFilterDto[] = filters.map((filter) => {
            return new ListAndSearchFilterDto(filter);
        });

        const request: ListAndSearchRequest = {
            clauses: { clauses: filtersForColumns },
            offset,
            limit,
        };

        const list = this.getAccountingDocForPosting(request)
            .pipe(
                map((data) => {
                    return data;
                }),
            );

        return list;
    }

    public getAccoutingDocumentData(accountingId: number): Observable<ApiPaginatedCollection<PostingManagement>> {
        const company: string = this.companyManager.getCurrentCompanyId();

        return this.http.get<ApiPaginatedCollection<PostingManagement>>(
            `${environment.preAccountingServiceLink}/${encodeURIComponent(String(company))}`
            + `/${this.accountingDocumentControllerUrl}/${encodeURIComponent(String(accountingId))}`);
    }

    getAccoutingDocumentDataList(request: ListAndSearchRequest): Observable<ApiPaginatedCollection<any>> {
        const company: string = this.companyManager.getCurrentCompanyId();

        return this.post<ApiPaginatedCollection<any>>(
            `${environment.preAccountingServiceLink}/${encodeURIComponent(String(company))}/${this.accountingDocumentControllerUrl}/accountingDocumentData`,
            request);
    }

    getAccoutingLinesData(request: ListAndSearchRequest): Observable<ApiPaginatedCollection<any>> {
        const company: string = this.companyManager.getCurrentCompanyId();

        return this.post<ApiPaginatedCollection<any>>(
            `${environment.preAccountingServiceLink}/${encodeURIComponent(String(company))}/${this.accountingDocumentControllerUrl}/accountingLinesData`,
            request);
    }

    public getAccoutingLinesAllData(accountingId: number): Observable<ApiPaginatedCollection<ReversalAccountingDocument>> {
        const company: string = this.companyManager.getCurrentCompanyId();

        return this.http.get<ApiPaginatedCollection<ReversalAccountingDocument>>(
            `${environment.preAccountingServiceLink}/${encodeURIComponent(String(company))}`
            + `/${this.accountingDocumentControllerUrl}/accountingLinesAllData/${encodeURIComponent(String(accountingId))}`);
    }

    public getAccoutingDocumentAllData(docRefId: number): Observable<ApiPaginatedCollection<PostingManagement>> {
        const company: string = this.companyManager.getCurrentCompanyId();

        return this.http.get<ApiPaginatedCollection<PostingManagement>>(
            `${environment.preAccountingServiceLink}/${encodeURIComponent(String(company))}`
            + `/${this.accountingDocumentControllerUrl}/accoutingDocData/${encodeURIComponent(String(docRefId))}`);
    }

    public getTransactionDetail(accountingId: number): Observable<ApiPaginatedCollection<TransactionDetail>> {
        const company: string = this.companyManager.getCurrentCompanyId();

        return this.http.get<ApiPaginatedCollection<TransactionDetail>>(
            `${environment.preAccountingServiceLink}/${encodeURIComponent(String(company))}`
            + `/${this.accountingDocumentControllerUrl}/transactionDetail/${encodeURIComponent(String(accountingId))}`);
    }

    updateAccoutingDocuments(accountingDocument: PostingManagement, isAuthorizedControlenabled: boolean) {
        const company: string = this.companyManager.getCurrentCompanyId();
        const action = `${encodeURIComponent(String(company))}/${this.accountingDocumentControllerUrl}/${isAuthorizedControlenabled}/updateaccountingdocument/`;

        return this.post(environment.preAccountingServiceLink + '/' + action, accountingDocument);
    }

    public deleteAccountingDocument(accountingDocumentStatusToDeleted: AccountingDocumentStatusToDeletedCommand): Observable<void> {
        const company: string = this.companyManager.getCurrentCompanyId();
        const action = `${encodeURIComponent(String(company))}/${
            this.accountingDocumentControllerUrl}/statustodeleted`;

        return this.post(environment.preAccountingServiceLink + '/' + action, accountingDocumentStatusToDeleted);
    }

    public startStopPostingProcess(isActive: boolean): Observable<boolean> {
        const company: string = this.companyManager.getCurrentCompanyId();
        const command = new StartStopPostingProcessCommand();
        command.isActive = isActive;
        const action = `${encodeURIComponent(String(company))}/${this.accountingDocumentControllerUrl}/startstopposting/`;
        return this.post(environment.preAccountingServiceLink + '/' + action, command);
    }

    public GetTADocmentDetails(dataVersionId: number, reportType: number): Observable<boolean> {
        const company: string = this.companyManager.getCurrentCompanyId();
        const options: HttpRequestOptions = new HttpRequestOptions();
        let queryParameters = new HttpParams();

        if (dataVersionId !== undefined && dataVersionId !== null) {
            queryParameters = queryParameters.set('dataVersionId', dataVersionId as any);
        }
        if (reportType !== undefined && reportType !== null) {
            queryParameters = queryParameters.set('reportType', reportType as any);
        }
        options.params = queryParameters;
        return this.http.get<boolean>(
            `${environment.preAccountingServiceLink}/${encodeURIComponent(String(company))}`
            + `/${this.accountingSetUpControllerUrl}/GetTADocDetail/`,
            options);
    }
    public getAccountingSetupDetails() {
        const company: string = this.companyManager.getCurrentCompanyId();
        return this.http.get<AccountingSetup>(
            `${environment.preAccountingServiceLink}/${encodeURIComponent(String(company))}`
            + `/${this.accountingSetUpControllerUrl}`);
    }
    updateAccountingSetupDetails(accountingSetup: AccountingSetup) {
        const company: string = this.companyManager.getCurrentCompanyId();
        const action = `${encodeURIComponent(String(company))}/${
            this.accountingSetUpControllerUrl}/`;

        return this.post(environment.preAccountingServiceLink + '/' + action, accountingSetup);
    }
    public getPostingProcessStatus(): Observable<boolean> {
        const company: string = this.companyManager.getCurrentCompanyId();
        const action = `${encodeURIComponent(String(company))}/${this.accountingDocumentControllerUrl}/postingactivestatus/`;
        return this.get(environment.preAccountingServiceLink + '/' + action);
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
            `${environment.preAccountingServiceLink}/${encodeURIComponent(String(company))}`
            + `/${this.accountingDocumentControllerUrl}/getdocumentsformatching`,
            options);
    }

    // Create match flag
    public createMatchFlag(documents: DocumentMatchingRecord): Observable<DocumentMatchingRecord> {
        const company: string = this.companyManager.getCurrentCompanyId();
        return this.post<DocumentMatchingRecord>(
            `${environment.executionServiceLink}/
            ${encodeURIComponent(String(company))}/${this.accountingDocumentControllerUrl}/`, documents);
    }

    getErrorMessages(processNameList: string[], statusList: number[], dateBegin: Date, dateEnd: Date, userName: string): Observable<ProcessMessage[]> {
        const company: string = this.companyManager.getCurrentCompanyId();

        const options: HttpRequestOptions = new HttpRequestOptions();
        let queryParameters = new HttpParams();

        queryParameters = queryParameters.set('company', company);
        queryParameters = queryParameters.set('statusList', statusList.toString());
        queryParameters = queryParameters.set('processNameList', processNameList as any);

        if (dateBegin) {
            queryParameters = queryParameters.set(
                'dateBegin',
                this.dateConverter.dateToStringConverter(dateBegin));
        }
        if (dateEnd) {
            queryParameters = queryParameters.set(
                'dateEnd',
                this.dateConverter.dateToStringConverter(dateEnd));
        }
        queryParameters = queryParameters.set('userName', userName);
        options.params = queryParameters;

        return this.get<ProcessMessage[]>(
            `${environment.preAccountingServiceLink}/${encodeURIComponent(String(company))}/${this.accountingDocumentControllerUrl}/getErrorMessages`, options);
    }

    updateProcessRetry(messageId: number) {
        const company: string = this.companyManager.getCurrentCompanyId();
        const options: HttpRequestOptions = new HttpRequestOptions();
        const action = `/${encodeURIComponent(String(company))}/${this.accountingDocumentControllerUrl}/${messageId}`;

        return this.patch(environment.preAccountingServiceLink + action, options);

    }
}
