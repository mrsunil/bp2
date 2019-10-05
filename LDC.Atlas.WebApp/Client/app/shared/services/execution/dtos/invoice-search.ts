export class InvoiceSearch {
    type: number;
    filterParameter: string;
    periodFromDate: Date;
    periodToDate: Date;
    costType: string;
    supplierCode: string;
    charter: string;

    constructor(type: number = -1, filterParameter: string = '', periodFromDate: Date = null, periodToDate: Date = null,
        costType: string = '', supplierCode: string = '', charter: string = '') {
        this.type = type;
        this.filterParameter = filterParameter;
        this.periodFromDate = periodFromDate;
        this.periodToDate = periodToDate;

    }
}
