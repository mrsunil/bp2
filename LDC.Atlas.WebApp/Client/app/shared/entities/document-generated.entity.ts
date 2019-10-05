import { DocumentStatus } from '../enums/document-status.enum';
import { DocumentTypes } from '../enums/document-type.enum';

export class PhysicalDocument {
    physicalDocumentId: number;
    documentName: string;
    versionNumber: number;
    createdBy: string;
    createdDateTime: Date;
    documentTemplate: string;
    isSelected = false;
    recordId: number;
    physicalDocumentType: DocumentTypes;
    physicalDocumentStatus: DocumentStatus;
}
