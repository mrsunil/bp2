import { AtlasNumber } from '../../../../shared/entities/atlas-number.entity';

export class CashMatching {
    documentMatchingId: number;
    associatedAccountCode: string;
    physicalContractCode: string;
    clientReference: string;
    contractSectionCode: string;
    paymentTermCode: string;
    quantity: number;
    amountPaidInDiffCcy: number;
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

    transactionDocumentId: number;
    authorizedForPosting: boolean;
    totalAmount: AtlasNumber;
    counterPartyId: number;
    paymentTermId: number;
    transactionDocumentTypeId: number;
    matchFlagId: number;
    isChecked: boolean;
    rate: number;

    externalReference: string;
    narrative: string;
    charterId: number;
    transactionDirectionId: number;
    amountInFunctionalCurrency: number;
    amountInStatutoryCurrency: number;
    roeType: string;
    currencyCodeFrom: string;
    currencyCodeTo: string;

    invoiceGLDate: Date;
    sourceJournalLineId: number;
    sourceInvoiceId: number;
    sourceCashLineId: number;
    postedDate: Date;
}
