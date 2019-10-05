import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, of as observableOf } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { TemplateManagement } from '../../../admin/entities/template-management.entity';
import { CompanyManagerService } from '../../../core/services/company-manager.service';
import { TagField } from '../../../trading/entities/tag-field';
import { TemplateWithTags } from '../../dtos/template-with-tags.dto';
import { TradeDocumentResult } from '../../dtos/trade-document-result';
import { PhysicalDocumentReference } from '../../entities/document-reference.entity';
import { PhysicalDocumentTemplate } from '../../entities/document-template.entity';
import { PhysicalDocumentType } from '../../entities/document-type.entity';
import { HttpRequestOptions } from '../../entities/http-services/http-request-options.entity';
import { ListAndSearchRequest } from '../../entities/list-and-search/list-and-search-request.entity';
import { Tag } from '../../entities/tag.entity';
import { TemplatesBestMatch } from '../../entities/templates-best-match.entity';
import { DocumentTypes } from '../../enums/document-type.enum';
import { ApiCollection, ApiPaginatedCollection } from '../common/models';
import { AssignContractAdviceCommand } from '../document/dtos/assign-contract-advice-command';
import { GenerateContractAdviceCommand } from '../document/dtos/generate-contract-advice-command';
import { UpdateDocumentCommand } from '../document/dtos/update-document-command.entity';
import { UploadDocumentCommand } from '../document/dtos/upload-document-command.entity';
import { PhysicalDocument } from './../../entities/document-generated.entity';
import { HttpBaseService } from './http-base.service';

@Injectable({
    providedIn: 'root',
})
export class DocumentService extends HttpBaseService {

    private readonly generatedDocumentControllerUrl = 'physicaldocuments';
    private readonly generatedDocumentTypesControllerUrl = 'physicaldocumenttypes';
    private readonly sectionsControllerUrl = 'sections';
    private readonly invoiceControllerUrl = 'invoices';
    private readonly cashControllerUrl = 'cash';
    private readonly templateManagementControllerUrl = 'templatemanagement';

    constructor(protected http: HttpClient,
        private companyManager: CompanyManagerService,
    ) {
        super(http);
    }

    getGeneratedDocuments(request: ListAndSearchRequest):
        Observable<ApiPaginatedCollection<TradeDocumentResult>> {
        const company: string = this.companyManager.getCurrentCompanyId();

        return this.post<ApiPaginatedCollection<TradeDocumentResult>>(
            `${environment.documentServiceLink}/${encodeURIComponent(String(company))}/${this.generatedDocumentControllerUrl}/documentGenerated`, request,
        );
    }

    getAllGeneratedDocuments(): Observable<ApiCollection<PhysicalDocument>> {
        const company: string = this.companyManager.getCurrentCompanyId();

        const options: HttpRequestOptions = new HttpRequestOptions();
        const queryParameters = new HttpParams();
        options.params = queryParameters;

        /*return this.get<ApiCollection<PhysicalDocument>>(
            `${environment.documentServiceLink}/${encodeURIComponent(company)}/${this.generatedDocumentControllerUrl}`, options);*/
        const result: ApiCollection<PhysicalDocument> = { value: [] };
        return observableOf(result);
    }

    getTemplates(documentType: number, module: string = 'module'): Observable<ApiCollection<PhysicalDocumentTemplate>> {
        const company: string = this.companyManager.getCurrentCompanyId();
        return this.get<ApiCollection<PhysicalDocumentTemplate>>(
            `${environment.documentServiceLink}/${encodeURIComponent(company)}/` +
            `${this.generatedDocumentTypesControllerUrl}/${documentType}/${module}/templates`);
    }

    getTemplateParameters(): Observable<ApiCollection<TagField>> {
        const company: string = this.companyManager.getCurrentCompanyId();
        return this.get<ApiCollection<TagField>>(
            `${environment.documentServiceLink}/${encodeURIComponent(company)}/${this.templateManagementControllerUrl}` +
            `/templateparameters`);
    }

    saveTemplatesParameters(tempalteTags: TemplateManagement[]) {
        const company: string = this.companyManager.getCurrentCompanyId();
        return this.post<TemplateManagement[]>(
            `${environment.documentServiceLink}/${encodeURIComponent(company)}/${this.templateManagementControllerUrl}`, tempalteTags);
    }

    deleteTemplatesParameters(entityId: string) {
        const company: string = this.companyManager.getCurrentCompanyId();
        return this.delete<TemplateManagement[]>(
            `${environment.documentServiceLink}/${encodeURIComponent(company)}/${this.templateManagementControllerUrl}/${entityId}`);
    }

    getTemplateManagement(): Observable<TemplateManagement[]> {
        const company: string = this.companyManager.getCurrentCompanyId();
        return this.get<TemplateManagement[]>(
            `${environment.documentServiceLink}/${encodeURIComponent(company)}/${this.templateManagementControllerUrl}`);
    }

    getGeneratedDocumentContent(physicalDocumentId: number, isDraft = false): Observable<HttpResponse<Blob>> {
        const company: string = this.companyManager.getCurrentCompanyId();

        const options: HttpRequestOptions = new HttpRequestOptions();
        options.responseType = 'blob';
        options.observe = 'response';

        return this.get(
            `${environment.documentServiceLink}/${encodeURIComponent(company)}/${this.generatedDocumentControllerUrl}` +
            (isDraft ? `/drafts/${physicalDocumentId}/content` : `/${physicalDocumentId}/content`),
            options);
    }

    getDocumentTypes(): Observable<ApiCollection<PhysicalDocumentType>> {
        const company: string = this.companyManager.getCurrentCompanyId();

        return this.get<ApiCollection<PhysicalDocumentType>>(
            `${environment.documentServiceLink}/${encodeURIComponent(company)}/${this.generatedDocumentTypesControllerUrl}`)
            .pipe(
                map((documents) => {
                    documents.value.map((doc: any) => {
                        doc.physicalDocumentTypeId = doc.physicalDocumentTypeId;
                        doc.physicalDocumentTypeLabel = doc.physicalDocumentTypeLabel;
                        return doc;
                    });
                    return documents;
                }),
            );
    }

    generateContractAdvice(
        sectionId: number,
        documentTemplatePath: string,
        isDraft: boolean = false): Observable<PhysicalDocumentReference> {
        const company: string = this.companyManager.getCurrentCompanyId();

        const command: GenerateContractAdviceCommand = {
            company,
            sectionId,
            documentTemplatePath,
        };

        if (isDraft) {
            return this.post<PhysicalDocumentReference>(
                `${environment.documentServiceLink}/${encodeURIComponent(company)}/${this.generatedDocumentControllerUrl}`
                + '/contractadvice/generate',
                command);
        } else {
            return this.post<PhysicalDocumentReference>(
                `${environment.tradeServiceLink}/${encodeURIComponent(company)}/${this.sectionsControllerUrl}/`
                + `${encodeURIComponent(String(sectionId))}/documents/generatecontractadvice`,
                command);
        }
    }

    assignContractAdviceToSection(
        sectionId: number,
        documentId: number,
        documentTemplatePath: string): Observable<PhysicalDocumentReference> {
        const company: string = this.companyManager.getCurrentCompanyId();

        const command: AssignContractAdviceCommand = {
            company,
            documentId,
            documentTemplatePath,
        };

        return this.post<PhysicalDocumentReference>(
            `${environment.tradeServiceLink}/${encodeURIComponent(company)}/${this.sectionsControllerUrl}/`
            + `${encodeURIComponent(String(sectionId))}/documents/assigncontractadvice`,
            command);
    }

    uploadDocument(
        recordId: number,
        physicalDocumentTypeId: number,
        documentTemplatePath: string,
        isDraft: boolean,
        file: File): Observable<PhysicalDocumentReference> {
        const company = this.companyManager.getCurrentCompanyId();
        const command: UploadDocumentCommand = {
            recordId,
            physicalDocumentTypeId,
            documentTemplatePath,
        };

        const formData = new FormData();
        formData.append('file', file, file.name);
        Object.keys(command).forEach((key) => formData.append(key, command[key]));

        const documentUrl = `${environment.documentServiceLink}/${encodeURIComponent(company)}/${this.generatedDocumentControllerUrl}`;
        return this.post<PhysicalDocumentReference>(documentUrl + (isDraft ? '/drafts/upload' : '/upload'), formData);
    }

    search(request: ListAndSearchRequest): Observable<ApiPaginatedCollection<PhysicalDocument>> {
        const company: string = this.companyManager.getCurrentCompanyId();

        return this.post<ApiPaginatedCollection<PhysicalDocument>>(
            `${environment.documentServiceLink}/${encodeURIComponent(String(company))}/${this.generatedDocumentControllerUrl}/search`,
            request);
    }

    getUpdateUrl(recordId: number, documentType: DocumentTypes): string {
        const company = this.companyManager.getCurrentCompanyId();
        const updateUrl = `${encodeURIComponent(String(recordId))}/documents/update`;
        switch (documentType) {
            case DocumentTypes.ContractAdvice:
                return `${environment.tradeServiceLink}/${encodeURIComponent(company)}/${this.sectionsControllerUrl}/`
                    + updateUrl;
            case DocumentTypes.InvoiceGoodsInvoice:
            case DocumentTypes.InvoiceCostsInvoice:
            case DocumentTypes.InvoiceGoodsCostInvoice:
            case DocumentTypes.InvoiceWashout:
            case DocumentTypes.InvoiceString:
            case DocumentTypes.InvoiceCircle:
            case DocumentTypes.InvoiceProvisional:
            case DocumentTypes.InvoiceFinal:
            case DocumentTypes.InvoicePrepayment:
            case DocumentTypes.InvoiceCancellation:
                return `${environment.executionServiceLink}/${encodeURIComponent(company)}/${this.invoiceControllerUrl}/`
                    + updateUrl;
            case DocumentTypes.CashSimpleCash:
            case DocumentTypes.CashPickByTransaction:
            case DocumentTypes.CashDifferentClient:
            case DocumentTypes.CashDifferentCurrency:
                return `${environment.executionServiceLink}/${encodeURIComponent(company)}/${this.cashControllerUrl}/`
                    + updateUrl;
            default:
                return null;
        }
    }

    updateDocument(originalDocument: PhysicalDocument,
        draftDocumentId: number): Observable<PhysicalDocumentReference> {
        const company = this.companyManager.getCurrentCompanyId();
        const command: UpdateDocumentCommand = {
            draftDocumentId,
            physicalDocumentId: originalDocument.physicalDocumentId,
            documentTemplatePath: originalDocument.documentName,
        };

        const updateUrl = this.getUpdateUrl(originalDocument.recordId, originalDocument.physicalDocumentType);
        if (updateUrl) {
            return this.post<PhysicalDocumentReference>(updateUrl, command);
        } else {
            return of(null);
        }
    }

    getContractAdviceTemplatesByTags(request: Tag[]): Observable<TemplatesBestMatch[]> {
        const company: string = this.companyManager.getCurrentCompanyId();

        return this.post<TemplatesBestMatch[]>(
            `${environment.documentServiceLink}/${encodeURIComponent(String(company))}/${
                this.generatedDocumentControllerUrl
            }/templates/contractadvice/tags`,
            request,
        );
    }

    listTemplatesWithTags(): Observable<TemplateWithTags[]> {
        const company: string = this.companyManager.getCurrentCompanyId();

        return this.get<TemplateWithTags[]>(
            `${environment.documentServiceLink}/${encodeURIComponent(company)}/${this.templateManagementControllerUrl}`);
    }
}
