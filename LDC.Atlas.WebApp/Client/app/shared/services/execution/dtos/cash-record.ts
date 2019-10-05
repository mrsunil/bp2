import { AdditionalCost } from '../../../../shared/entities/additional-cost.entity';
import { CashMatching } from './cash-matching';
export class CashRecord {

    cashId: number;
    documentId: number;
    cashTypeId: number;
    nominalBankAccount: string;
    currencyCode: string;
    amount: number;
    counterpartyCode: string;
    counterPartyId: number;
    traxStatus: number;
    traxInterfaceStatus: string;
    interfaceStatus: number;
    nominalBankAccountCode: number;
    documentDate: Date;
    valueDate: Date;
    costTypeCode: string;
    bankAccountCode: string;
    costDirectionId: number;
    departmentId: number;
    documentReference: string;
    narrative: string;
    charterId: number;
    clientBankAccount: number;
    toTransmitToTreasury: boolean;
    payee: string;
    payer: string;
    authorizedForPosting: boolean;
    status: number;
    companyId: string;
    createdDateTime: Date;
    createdBy: string;
    modifiedDateTime: Date;
    modifiedBy: string;
    ownerName: string;
    nominalAccountCode: string;
    counterpartyDocumentReference: string;
    departmentCode: string;
    charterReference: string;
    additionalCostDetails: AdditionalCost[] = [];
    childCashTypeId: number;
    urgentPayment: boolean;
    documentMatchings: CashMatching[] = [];
    matchingCashId: number;
    matchingCurrency: string;
    matchingAmount: number;
    matchingRate: number;
    matchingRateType: string;
    matchingStatusId: number;
    matchFlagId: number;
    transactionDocumentId: number;
    matchedDocumentReference: string;
    physicalDocumentId?: number;
    isDraft: boolean;
    template: string;

    functionalCurrencyCode: string;
    statutoryCurrencyCode: string;

    functionalToStatutoryCurrenyRate: number;
    functionalToStatutoryCurrencyRoeType: string;

    cashCurrencyCode: string;
    cashCurrencyRoeType: string;
    cashCurrencyRate: number;

    c2CCode: string;
    nominalAlternativeAccount: boolean;
    costAlternativeCode: boolean;
    departmentAlternativeCode: string;
    taxInterfaceCode: string;

    // used for diff client
    matchingCounterpartyId: number;
    paymentCounterPartyCode: string;
    paymentCounterPartyId: number;
    counterPartyTransferId: number;

    interfaceErrorMessage: string;
    postingErrorMessage: string;

    paymentCashId: number;
}
