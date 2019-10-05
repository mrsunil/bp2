
export class InvoiceSummaryLineRecord {
    principalCommodity: string;
    quantity: number;
    price: number;
    weightUnitId: number;
    weightCode: string;
    modifiedDateTime: Date;
    sectionId: number;
    costId: number;
    lineNumber: number;
    vatId: number;
    vatCode: string;
    lineAmount: number;
    vatAmount: number;
    invoicePercent: number;
    costDirection: string;
    contractReference: string;
    costTypeCode: string;
    contractType: number;
}
