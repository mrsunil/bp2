import { DocumentTypes } from "../enums/document-type.enum";
import { DocumentStatus } from "../enums/document-status.enum";

export interface TradeDocumentResult {
    physicalDocumentId: number;
    documentName: string;
    versionNumber: number;
    createdBy: string;
    createdDateTime: Date;
    companyId: number;
    documentTemplate: string;
    recordId: number;
    physicalDocumentType: DocumentTypes;
    physicalDocumentStatus: DocumentStatus;
    tableId: number;
    mimeType: string;
}
