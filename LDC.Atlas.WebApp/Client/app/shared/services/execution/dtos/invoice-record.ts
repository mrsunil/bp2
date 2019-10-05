import { DocumentRecord } from '../../../entities/document-record.entity';
import { InvoiceLineRecord } from '../../../entities/invoice-line-record.entity';
import { CostDirections } from '../../../enums/cost-direction.enum';
import { InvoiceTypes } from '../../../enums/invoice-type.enum';
import { QuantityToInvoiceType } from '../../../enums/quantity-to-invoice.enum';
import { TransactionDocumentTypes } from '../../../enums/transaction-document-type.enum';
import { TransactionRecord } from './invoice-transaction-record';

export class InvoiceRecord {
    invoiceId: number;
    invoiceLabel: string;
    externalInvoiceRef: string;
    counterpartyCode: string;
    totalGoodsValue: number; // totalPriceHT: number;
    totalInvoiceValue: number; // totalPriceTTC: number;
    invoiceDate: Date;
    dueDate: Date;
    currency: string;
    invoiceType: InvoiceTypes;
    paymentTerms: string;
    quantityToInvoiceType: QuantityToInvoiceType;
    companyId: string;
    template: string;
    externalInhouse: number;
    document: DocumentRecord;
    transaction: TransactionRecord;
    invoiceLines: InvoiceLineRecord[];
    authorizedForPosting: boolean;
    quantityToInvoice: number;
    transactionDocumentId: number;
    documentType: TransactionDocumentTypes;
    costDirection: CostDirections;
    decimalOption: number;
    invoiceTypeId: number;
    transactionDocumentTypeId: number;
    nominalAccountNumber: string;
    physicalDocumentId?: number;
    isDraft: boolean;
    bankAccountId: number;
    agreementDate: Date;

    c2CCode: string;
    nominalAlternativeAccount: boolean;
    costAlternativeCode: boolean;
    departmentAlternativeCode: string;
    taxInterfaceCode: boolean;

    pricingOptionId: number;
    settlementValue: number;
    documentReference: string;
}
