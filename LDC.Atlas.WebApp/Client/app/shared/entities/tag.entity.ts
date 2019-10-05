export class Tag {
    id: string;
    tagValueId: string;
    typeName: string;

    constructor(tagValueId: string, typeName: string) {
        this.id = tagValueId;
        this.tagValueId = tagValueId;
        this.typeName = typeName;
    }
}
