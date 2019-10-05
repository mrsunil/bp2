export class FreezeDisplayView {
    dataVersionId: number;
    freezeDate: string;
    actualfreezeDate: Date;
    dataVersionTypeId: number;

    constructor(dataVersionId: number, freezeDate: string, actualfreezeDate: Date = null, dataVersionTypeId: number = null) {
        this.dataVersionId = dataVersionId;
        this.freezeDate = freezeDate;
        this.actualfreezeDate = actualfreezeDate;
        this.dataVersionTypeId = dataVersionTypeId;
    }
}
