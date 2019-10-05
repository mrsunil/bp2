import { QuantityToInvoiceType } from '../../../../shared/enums/quantity-to-invoice.enum';
import { InvoiceTypes } from '../../../enums/invoice-type.enum';
import { InvoiceSummaryLineRecord } from './invoice-summary-line-record';

export class InvoiceSummaryRecord {
    invoiceCode: string;
    invoiceDate: Date;
    invoiceType: InvoiceTypes;
    counterparty: string;
    paymentTermsCode: string;
    dueDate: Date;
    externalInvoiceReference: string;
    externalInhouse: string;
    currency: string;
    totalInvoiceValue: number;
    ModifiedDateTime: Date;
    QuantityToInvoiceType: QuantityToInvoiceType;
    summaryLines: InvoiceSummaryLineRecord[];
    reversedInvoiceReference: string;
    clientAccount: string;
    reversedDocumentDate: Date;
    originalInvoiceType: InvoiceTypes;
}
