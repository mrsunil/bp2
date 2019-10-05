export class FindUnpaidInvoicesResult {
	public invoiceId: number;
	public invoiceLabel: string;
	public invoiceDate: Date;
	public currency: string;
	public valueDate: Date;
	public department: string;
	public departmentLabel: string;
	public amount: number;
	public operationType: string;
	public amountToPay: number;
	public counterparty: string;
	public description: string;
	public paymentTerms: string;
	public paymentTermsLabel: string;
}

export class InvoiceToPay {
	public invoiceId: number;
	public amountToPay: number;
}

