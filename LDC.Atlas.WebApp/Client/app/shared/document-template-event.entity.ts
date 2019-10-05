import { PhysicalDocumentTemplate } from './entities/document-template.entity';

export class DocumentTemplateSelectedEvent {
    hasTemplate: boolean;
    template?: PhysicalDocumentTemplate;

    constructor(hasTemplate: boolean, template?: PhysicalDocumentTemplate) {
        this.hasTemplate = hasTemplate;
        if (template) {
            this.template = template;
        }
    }
}
