export interface InvoiceMarking {
    invoiceMarkingID: number;
    sectionReference: string;
    invoiceReference: string;
    quantity: number;
    currency: string;
    amount: number;
    dueDate: Date;
    externalInvoiceRef: string;
    paidAmount: number;
    paidPercentage: number;
    matchDate: Date;
    remainingAmount: number;
}
