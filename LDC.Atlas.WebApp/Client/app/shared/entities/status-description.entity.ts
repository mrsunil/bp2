export class StatusDescriptionTypes {
    titleId: number;
    StatusDescription: string;

    constructor(titleId: number = null, StatusDescription: string = null) {
        this.titleId = titleId;
        this.StatusDescription = StatusDescription;
    }
}