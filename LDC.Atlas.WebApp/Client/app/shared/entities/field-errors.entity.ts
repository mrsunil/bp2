export class FieldErrors {
    empty: string[];
    tooLong: Array<{ name: string, maxLength: number }>;
    doesNotExists: Array<{ name: string, values: any[] }>;

    constructor() {
        this.empty = [];
        this.tooLong = [];
        this.doesNotExists = [];
    }

    concatDistinct(fieldError: FieldErrors) {
        fieldError.empty.forEach((error: string) => {
            if (!this.empty.find((err: string) => err === error)) {
                this.empty.push(error);
            }
        });
        fieldError.tooLong.forEach((error: { name: string, maxLength: number }) => {
            if (!this.tooLong.find((err: { name: string, maxLength: number }) => err.name === error.name)) {
                this.tooLong.push(error);
            }
        });
        fieldError.doesNotExists.forEach((error: { name: string, values: any[] }) => {
            const errorsForSameField = this.doesNotExists.find((err: { name: string, values: any[] }) => err.name === error.name);
            if (!errorsForSameField) {
                this.doesNotExists.push(error);
            } else {
                error.values.forEach((value) => {
                    if (errorsForSameField.values.indexOf(value) === -1) {
                        errorsForSameField.values.push(value);
                    }
                });
            }
        });
    }

    toString() {
        let errorMessage = '';
        if (this.empty.length > 0) {
            errorMessage += 'Those fields cannot be empty : ' + this.empty.join(', ') + '. ';
        }
        this.tooLong.forEach((error) => errorMessage += 'The ' + error.name + ' cannot be longer than '
            + error.maxLength + ' characters. ');
        this.doesNotExists.forEach((error) => errorMessage += '"' + error.values.map((value) => '"' + value + '"').join(', ')
            + '" are not valid ' + error.name + '. ');

        return errorMessage;
    }
}
