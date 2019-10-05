export class TemplatesBestMatch {
    physicalDocumentId: string;
    bestMatch: number;
    name: string;
    description: string;
    entityId: string;

    constructor(physicalDocumentId: string, bestMatch: number, name: string, description: string, entityId: string) {
        this.physicalDocumentId = physicalDocumentId;
        this.bestMatch = bestMatch;
        this.name = name;
        this.description = description;
        this.entityId = entityId;
    }
}
