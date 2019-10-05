import { YearEndProcess } from "../dtos/year-end-process";

export class YearEndProcessDisplayView {
    accountNumber: string;
    mainAccountTitle: string;
    currencyCode: string;
    valueInFunctionalCurrency: number;
    valueInStatutoryCurrency: number;
    departmentId: number;

    constructor(yearEndProcess?: YearEndProcess) {
        if (yearEndProcess) {
            this.accountNumber = yearEndProcess.accountNumber;
            this.mainAccountTitle = yearEndProcess.mainAccountTitle;
            this.currencyCode = yearEndProcess.currencyCode;
            this.valueInFunctionalCurrency = yearEndProcess.valueInFunctionalCurrency;
            this.valueInStatutoryCurrency = yearEndProcess.valueInStatutoryCurrency;
            this.departmentId = yearEndProcess.departmentId;
        }
    }
}
