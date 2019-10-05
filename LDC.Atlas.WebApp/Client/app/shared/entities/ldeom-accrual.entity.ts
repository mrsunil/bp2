export class LdeomAccrual {
    departmentCode: number;
    departmentDescription: string;
    contractLabel: string;
    costType: string;
    quantity: number;
    currency: string;
    fullValue: number;
    invoicedValue: number;
    accrueAmount: number;
    associatedClient: string;
    charterReference: string;

    isHeaderLine(): boolean {
        return this.departmentDescription && this.contractLabel === null;
    }

    isTotalHeaderLine(): boolean {
        return this.departmentDescription === null && this.costType === null;
    }

    isTotalLine(): boolean {
        return this.costType && this.contractLabel === null;
    }

    constructor(ac: LdeomAccrual) {
        this.departmentCode = ac.departmentCode;
        this.departmentDescription = ac.departmentDescription;
        this.contractLabel = ac.contractLabel;
        this.costType = ac.costType;
        this.quantity = ac.quantity;
        this.currency = ac.currency;
        this.fullValue = ac.fullValue;
        this.invoicedValue = ac.invoicedValue;
        this.accrueAmount = ac.accrueAmount;
        this.associatedClient = ac.associatedClient;
        this.charterReference = ac.charterReference;
    }
}
