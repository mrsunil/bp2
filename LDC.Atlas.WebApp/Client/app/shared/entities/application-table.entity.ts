import { ApplicationField } from './application-field.entity';

export class ApplicationTable {
    tableId: number;
    tableName: string;
    description: string;
    fields: ApplicationField[];

    constructor() {
        this.fields = [];
    }
}
