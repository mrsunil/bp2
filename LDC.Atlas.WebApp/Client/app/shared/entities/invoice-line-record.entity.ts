
export class InvoiceLineRecord {
    sectionID: number;
    costID: number;
    invoiceID: number;
    lineNumber: number;
    quantity: string;
    weightUnitId: number;
    price: number;
    priceUnitId: number;
    currencyCode: string;
    vatCode: string;
    vatAmount: number;
    lineAmount: number;
    invoicePercent: number;
    authorizedForPosting: number;
    costTypeCode: string;
    costDirectionId: number;
    rateTypeId: number;
    contractType: number;
    narrative: string;
    inPL: boolean;
    noAct: boolean;
}
