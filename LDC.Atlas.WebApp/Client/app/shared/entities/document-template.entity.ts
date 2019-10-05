export class PhysicalDocumentTemplate {
    documentTemplateId: number;
    name: string;
    path: string;
    description: string;
    createdDateTime: Date;
    createdBy: string;
    modifiedDateTime: Date;
    modifiedBy: string;
    // added for custom reports
    linkedMenu: string;
    company: string;
}
