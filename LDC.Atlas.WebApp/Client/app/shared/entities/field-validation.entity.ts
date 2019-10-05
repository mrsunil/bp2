export class FieldValidation {
    required: Array<{ name: string }>;
    maxLength: Array<{ name: string, maxLength: number }>;
    shouldExist: Array<{ name: string, masterData: string, property?: string }>;
    unique: string[];

    constructor() {
        this.required = [];
        this.maxLength = [];
        this.shouldExist = [];
        this.unique = [];
    }

}
