export interface InvoiceDocumentSearchResult {
	documentReference: string;
	accountReference: string;
	currency: string;
	accountingPeriod: string;
	amount: number;
	vatCode: string;
	expenseCode: string;
	contractNumber: string;
	department: string;
	matchFlag: string;
	documentDate: Date;
	paymentTerms: string;
	valueDate: Date;
	acknowledgementDate: Date;
	status: string;
}
