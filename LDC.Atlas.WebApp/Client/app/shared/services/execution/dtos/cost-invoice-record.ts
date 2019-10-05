import { InvoiceTypes } from '../../../enums/invoice-type.enum';
import { TaxRecord } from './tax-record';

export class CostInvoiceRecord {
    invoiceCode: string;
    invoiceDate: Date;
    invoiceType: InvoiceTypes;
    counterparty: string;
    charterReference: string;
    paymentTermsCode: string;
    dueDate: Date;
    externalInvoiceReference: string;
    externalInhouse: string;
    principalCommodity: string;
    quantity: string;
    price: number;
    currencyCode: string;
    totalInvoiceValue: number;
    weightCode: string;
    modifiedDateTime: Date;
    sectionId: number;
    costId: number;
    lineNumber: number;
    vatCode: string;
    vatAvailable: TaxRecord[];
    lineAmount: number;
    vatDescription: string;
    rate: number;
    totalVatAmount: number;
    decimalOption: number;
    costDirection: string;
}
