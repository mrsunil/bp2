import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { CompanyManagerService } from '../../../core/services/company-manager.service';
import { AccountingEntriesSearchResult } from '../../dtos/accountingEntries-search-result';
import { DocumentReferenceSearchResult } from '../../dtos/list-and-search/document-reference-search-result';
import { TransactionDocumentSearchResult } from '../../dtos/transaction-document-search-result';
import { TransactionReportSearchResult } from '../../dtos/transactionReport-search-result';
import { ListAndSearchRequest } from '../../entities/list-and-search/list-and-search-request.entity';
import { ApiPaginatedCollection } from '../common/models';
import { DateConverterService } from '../date-converter.service';
import { HttpBaseService } from './http-base.service';
import { AccountingImportReport } from '../../entities/accountingImportReport.entity';

@Injectable({
    providedIn: 'root',
})
export class AccountingDocumentService extends HttpBaseService {
    private readonly accountingDocumentsControllerUrl = 'AccountingDocuments';
    constructor(
        http: HttpClient,
        private dateConverter: DateConverterService,
        private companyManager: CompanyManagerService,
    ) {
        super(http);
    }
    search(request: ListAndSearchRequest):
        Observable<ApiPaginatedCollection<AccountingEntriesSearchResult>> {
        const company: string = this.companyManager.getCurrentCompanyId();

        return this.post<ApiPaginatedCollection<AccountingEntriesSearchResult>>(
            `${environment.preAccountingServiceLink}/${encodeURIComponent(String(company))}/${this.accountingDocumentsControllerUrl}/search`,
            request);
    }
    searchClientReport(request: ListAndSearchRequest):
        Observable<ApiPaginatedCollection<TransactionReportSearchResult>> {
        const company: string = this.companyManager.getCurrentCompanyId();

        return this.post<ApiPaginatedCollection<TransactionReportSearchResult>>(
            `${environment.preAccountingServiceLink}/${encodeURIComponent(String(company))}/${this.accountingDocumentsControllerUrl}/searchClientReport`, request);
    }
    searchNominalReport(request: ListAndSearchRequest):
        Observable<ApiPaginatedCollection<TransactionReportSearchResult>> {
        const company: string = this.companyManager.getCurrentCompanyId();

        return this.post<ApiPaginatedCollection<TransactionReportSearchResult>>(
            `${environment.preAccountingServiceLink}/${encodeURIComponent(String(company))}/${this.accountingDocumentsControllerUrl}/searchNominalReport`, request);
    }

    transactionDocumentContexuaSearch(request: ListAndSearchRequest): Observable<ApiPaginatedCollection<TransactionDocumentSearchResult>> {
        const company: string = this.companyManager.getCurrentCompanyId();

        return this.post<ApiPaginatedCollection<TransactionDocumentSearchResult>>(
            `${environment.preAccountingServiceLink}/${encodeURIComponent(String(company))}/${this.accountingDocumentsControllerUrl}/documentContextualSearch`, request);
    }

    documentReferenceContexuaSearch(request: ListAndSearchRequest, isReversalDocument: boolean = true): Observable<ApiPaginatedCollection<DocumentReferenceSearchResult>> {
        const company: string = this.companyManager.getCurrentCompanyId();

        return this.post<ApiPaginatedCollection<DocumentReferenceSearchResult>>(
            `${environment.preAccountingServiceLink}/${encodeURIComponent(String(company))}/${this.accountingDocumentsControllerUrl}/${isReversalDocument}/documentReferenceContextualSearch`, request);
    }

    fileUpload(file: File, isAccrualSelected: boolean = false, isMtmSelected: boolean = false): Observable<AccountingImportReport> {
        const formData = new FormData();
        formData.append('file', file, file.name);
        formData.append('isAccuralSelected', isAccrualSelected.toString());
        formData.append('isMTMSelected', isMtmSelected.toString());
        const company: string = this.companyManager.getCurrentCompanyId();
        return this.post(`${environment.preAccountingServiceLink}/${encodeURIComponent(String(company))}/${this.accountingDocumentsControllerUrl}` + '/fileupload', formData);
    }

}
