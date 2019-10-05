import { AtlasNumber } from '../../../../shared/entities/atlas-number.entity';

export class CashSummaryGrid {
    documentMatchingId: number;
    associatedAccountCode: string;
    physicalContractCode: string;
    clientReference: string;
    contractSectionCode: string;
    paymentTermCode: string;
    quantity: number;
    accountReference: string;
    commodityId: string;
    documentNarrativeCode: string;
    amountToBePaid: number;
    accountLineTypeId: number;
    charterCode: string;
    costTypeCode: string;
    amount: number;
    departmentCode: string;
    departmentId: number;
    documentReference: string;
    secondaryDocumentReference: string;
    currencyCode: string;
    documentDate: Date;
    valueDate: Date;
    expenseCode: string;
    documentType: string;
    balance: AtlasNumber;
    invoiceGLDate: Date;
}
