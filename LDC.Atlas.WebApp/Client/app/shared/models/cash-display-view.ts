import { CashSummary } from '../entities/cash.entity';
import { CashSelectionType } from '../enums/cash-selection-type';
import { CashType } from '../enums/cash-type.enum';
import { InterfaceStatus } from '../enums/interface-status.enum';
import { PostingStatus } from '../enums/posting-status.enum';

export class CashDisplayView {

    cashId: number;
    cashTypeId: number;
    currencyCode: string;
    amount: number;
    counterPartyCode: string;
    nominalAccountCode: string;
    documentDate: Date;
    valueDate: Date;
    costTypeCode: string;
    costDirectionId: number;
    departmentId: number;
    narrative: string;
    charterId: number;
    status: string;
    errorMessage: string;
    companyId: string;
    transactionDocumentId: number;
    traxStatus: string;
    authorizedForPosting: boolean;
    counterpartyDocumentReference: string;
    documentReference: string;
    nominalBankAccountCode: string;
    ownerName: string;
    physicalDocumentId: number;
    transactionDocumentTypeId: number;
    counterpartyOrNominalAccountCode: string;
    departmentDescription: string;
    charterCode: string;
    documentType: string;
    matchingAmount: number;
    postingStatus: number;
    paymentCashId: number;

    constructor(cash?: CashSummary) {
        if (cash) {
            this.cashId = cash.cashId;
            this.cashTypeId = cash.cashTypeId;
            this.currencyCode = cash.currencyCode;
            this.counterPartyCode = cash.counterPartyCode;
            this.nominalAccountCode = cash.nominalAccountCode;
            this.documentDate = cash.documentDate;
            this.valueDate = cash.valueDate;
            this.costTypeCode = cash.costTypeCode;
            this.costDirectionId = cash.costDirectionId;
            this.departmentId = cash.departmentId;
            this.narrative = cash.narrative;
            this.charterId = cash.charterId;
            this.status = this.getPostingStatus(cash.postingStatus);
            this.transactionDocumentId = cash.transactionDocumentId;
            this.authorizedForPosting = cash.authorizedForPosting;
            this.counterpartyDocumentReference = cash.counterpartyDocumentReference;
            this.documentReference = cash.documentReference;
            this.nominalBankAccountCode = cash.nominalBankAccountCode;
            this.ownerName = cash.ownerName;
            this.physicalDocumentId = cash.physicalDocumentId;
            this.transactionDocumentTypeId = cash.transactionDocumentTypeId;
            this.counterpartyOrNominalAccountCode = (this.costDirectionId === CashType.CashPayment ?
                cash.counterPartyCode : cash.nominalAccountCode);

            this.departmentDescription = cash.departmentDescription;
            this.documentType = this.getDocumentType(this.cashTypeId);
            this.charterCode = cash.charterCode;
            this.amount = cash.cashTypeId === CashSelectionType.PaymentDifferentCurrency ||
                cash.cashTypeId === CashSelectionType.ReceiptDifferentCurrency ?
                cash.matchingAmount : cash.amount;
            this.traxStatus = this.getTraxStatus(cash.traxStatus);
            this.errorMessage = cash.errorMessage;
            this.paymentCashId = cash.paymentCashId;
        }
    }

    getDocumentType(value: number) {

        // these return values are taken from/defined in FS.
        if (value !== 0) {
            if (value === CashSelectionType.SimpleCashPayment ||
                value === CashSelectionType.SimpleCashReceipt) {
                return 'Simple Cash';
            } else
                if (value === CashSelectionType.PaymentDifferentClient) {
                    return 'Diff Cli';
                } else
                    if (value === CashSelectionType.PaymentFullPartialTransaction ||
                        value === CashSelectionType.ReceiptFullPartialTransaction) {
                        return 'Pick Tx';
                    } else
                        if (value === CashSelectionType.PaymentDifferentCurrency ||
                            value === CashSelectionType.ReceiptDifferentCurrency) {
                            return 'Diff Ccy';
                        }

        }
    }
    getTraxStatus(traxStatus: number) {
        switch (traxStatus) {
            case InterfaceStatus.ReadyToTransmit:
                return 'Ready To Transmit';
                break;
            case InterfaceStatus.StandBy:
                return 'Stand By';
                break;
            case InterfaceStatus.TransmitError:
                return 'Transmit Error';
                break;
            default:
                return InterfaceStatus[traxStatus];
                break;
        }
    }
    getPostingStatus(postingStatus: number) {
        switch (postingStatus) {
            case PostingStatus.Authorized:
                return 'Authorized';
            case PostingStatus.Deleted:
                return 'Deleted';
            case PostingStatus.Held:
                return 'Held';
            case PostingStatus.Incomplete:
                return 'Incomplete';
            case PostingStatus.MappingError:
                return 'Mapping Error';
            case PostingStatus.Posted:
                return 'Posted';
        }
    }
}
