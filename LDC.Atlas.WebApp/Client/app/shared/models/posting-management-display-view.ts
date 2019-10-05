import { AccountingDocumentLine } from '../entities/accounting-document-line.entity';
import { PostingManagement } from '../entities/posting-management.entity';
import { PostingDocumentType } from '../enums/posting-document-type.enum';
import { PostingStatus } from '../enums/posting-status.enum';

export class PostingManagementDisplayView {
    accountingId: number;
    documentReference: string;
    documentDate: Date;
    associatedAcc: string;
    statusId: PostingStatus;
    errorMessage: string;
    amount: number;
    currency: string;
    departmentId: number;
    authorizedOn: Date;
    authorizedAt: string;
    authorizedBy: string;
    createdDateTime: Date;
    createdBy: string;
    modifiedDateTime: Date;
    modifiedBy: string;
    valueDate: Date;
    glDate: Date;
    accountingPeriod: Date;
    currencyCode: string;
    reason: string;
    total: number;
    transactionDocumentTypeId: PostingDocumentType;

    accountingDocumentLines: AccountingDocumentLine[];
    isAmountValid: boolean;
    isStatuoryAmountValid: boolean;
    isFunctionalAmountValid: boolean;
    isEditable: boolean;
    toInterface: boolean;
    originalValueDate: Date;
    dmsId: number;
    invoiceId: number;
    invoiceTypeId: number;
    cashId: number;
    costDirectionId: number;

    authorizedDate: Date;
    localAuthorizedDate: Date;
    taTypeId: number;
    journalLineId: number;
    provinceId: number;
    settlementCurrency: string;
    dealNumber: string;

    constructor(postingManagement: PostingManagement) {
        if (postingManagement) {
            this.accountingId = postingManagement.accountingId;
            this.documentReference = postingManagement.documentReference;
            this.documentDate = postingManagement.documentDate;
            this.associatedAcc = postingManagement.associatedAcc;
            this.statusId = postingManagement.statusId;
            this.errorMessage = postingManagement.errorMessage;
            this.amount = postingManagement.amount;
            this.currency = postingManagement.currencyCode;
            this.departmentId = postingManagement.departmentId;
            this.authorizedOn = postingManagement.localAuthorizedDate;
            this.authorizedDate = postingManagement.authorizedDate;
            this.localAuthorizedDate = postingManagement.localAuthorizedDate;
            const localAuthorizedDate: Date = postingManagement.localAuthorizedDate as Date;
            this.authorizedAt = localAuthorizedDate ? localAuthorizedDate.toISOString() : null;
            this.authorizedBy = postingManagement.authorizedBy;
            this.createdDateTime = postingManagement.createdDateTime;
            this.createdBy = postingManagement.createdBy;
            this.modifiedDateTime = postingManagement.modifiedDateTime;
            this.modifiedBy = postingManagement.modifiedBy;
            this.valueDate = postingManagement.valueDate;
            this.glDate = postingManagement.glDate;
            this.accountingPeriod = postingManagement.accountingPeriod;
            this.currencyCode = postingManagement.currencyCode;
            this.total = postingManagement.total;
            this.reason = '';
            this.accountingDocumentLines = postingManagement.accountingDocumentLines;
            this.isAmountValid = true;
            this.isFunctionalAmountValid = true;
            this.isStatuoryAmountValid = true;
            this.transactionDocumentTypeId = postingManagement.transactionDocumentTypeId;
            this.originalValueDate = postingManagement.originalValueDate;
            this.dmsId = postingManagement.dmsId;
            this.toInterface = postingManagement.toInterface;
            this.invoiceId = postingManagement.invoiceId;
            this.invoiceTypeId = postingManagement.invoiceTypeId;
            this.cashId = postingManagement.cashId;
            this.costDirectionId = postingManagement.costDirectionId;
            this.taTypeId = postingManagement.taTypeId;
            this.dealNumber = postingManagement.dealNumber;
            this.journalLineId = postingManagement.journalLineId;
            this.settlementCurrency = postingManagement.settlementCurrency;
        }
    }
}
