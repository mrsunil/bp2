export class InvoiceMarkings {
    invoiceMarkingId: number;
    sectionId: number;
    costId: number;
    contractReference: string;
    invoiceLineId: number;
    invoiceDate: Date;
    postingStatusId: number;
    quantity: number;
    currencyCode: string;
    invoiceAmount: number;
    documentType: string;
    sectionType: string;
    invoicePercent: number;
    dueDate: Date;
    paymentTermCode: string;
    paidAmount: number;
    customerReference: string;
    paidPercentage: string; // to not loose decimals, in the API it will be automatically converted to decimal
    cashMatchDate: Date;
    remainingAmount: number;
    companyId: string;
    contractValue: number;
    costType: string;
    invoiceReference: string;
    price: number;
}

export class InvoiceMarkingPercentLines {
    invoicePercent: number;
    invoiceLineId: number;
}