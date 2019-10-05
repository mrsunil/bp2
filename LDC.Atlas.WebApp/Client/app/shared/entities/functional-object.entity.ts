import { ApplicationTable } from './application-table.entity';

export class FunctionalObject {
    functionalObjectId: number;
    functionalObjectName: string;
    tables: ApplicationTable[];
    createdBy: string;
    createdDateTime: Date;
    modifiedBy: string;
    modifiedDateTime?: Date;

    constructor() {
        this.tables = [];
    }
}
