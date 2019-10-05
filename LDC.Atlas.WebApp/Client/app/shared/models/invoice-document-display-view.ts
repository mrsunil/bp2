import { InvoiceDocumentSearchResult } from "../services/preaccounting/dtos/invoice-document";
import * as _moment from "moment";
const moment = _moment;

export class InvoiceDocumentDisplayView {
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

	constructor(document?: InvoiceDocumentSearchResult) {
		if (document) {
			this.documentReference = document.documentReference;
			this.accountReference = document.accountReference;
			this.currency = document.currency;
            this.accountingPeriod = document.accountingPeriod;
            this.accountingPeriod = moment(new Date(document.accountingPeriod)).format("MMM YYYY").toString();
			this.amount = document.amount;
			this.vatCode = document.vatCode;
			this.expenseCode = document.expenseCode;
			this.contractNumber = document.contractNumber;
			this.department = document.department;
			this.matchFlag = document.matchFlag;
			this.documentDate = document.documentDate;
			this.paymentTerms = document.paymentTerms;
			this.valueDate = document.valueDate;
			this.acknowledgementDate = document.acknowledgementDate;
			this.status = document.status;
		}
	}
}
