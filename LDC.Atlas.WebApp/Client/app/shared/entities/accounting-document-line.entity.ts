export class AccountingDocumentLine {
    accountReference: string;
    associatedAccountCode: string;
    accountLineType: string;
    costTypeId: number;
    amount: number;
    statutoryCurrency: number;
    functionalCurrency: number;
    narrative: string;
    departmentId: number;
    secondaryDocumentReference: string;
    extDocReference: string;
    clientReference: string;
    commodityId: number;
    quantity: number;
    charterId: number;
    costCenter: string;
    paymentTermId: number;
    vatId: number;
    accrualNumber: number;
    ///we ned to add AccountingLineId

    accountingDocumentLineId: number;
    accountReferenceId: number;
    clientAccountId: number;
    associatedAccountId: number;
    accountLineTypeId: number;
    sectionId: number;
    sectionReference: string;
    postingLineNumber: number;
    dealNumber: string;
    settlementCurrency: string;
    provinceId?: number;
    journalLineId?: number;
    postingLineId: number;

    constructor(accountingLine: AccountingDocumentLine = null) {
        if (accountingLine !== null) {
            this.accountingDocumentLineId = null;
            this.accountReferenceId = accountingLine.accountReferenceId;
            this.clientAccountId = accountingLine.clientAccountId;
            this.associatedAccountId = accountingLine.associatedAccountId;
            this.accountLineTypeId = accountingLine.accountLineTypeId;
            this.costTypeId = accountingLine.costTypeId;
            this.amount = accountingLine.amount;
            this.statutoryCurrency = accountingLine.statutoryCurrency;
            this.functionalCurrency = accountingLine.functionalCurrency;
            this.narrative = accountingLine.narrative;
            this.departmentId = accountingLine.departmentId;
            this.secondaryDocumentReference = accountingLine.secondaryDocumentReference;
            this.clientReference = accountingLine.clientReference;
            this.sectionId = accountingLine.sectionId;
            this.commodityId = accountingLine.commodityId;
            this.quantity = accountingLine.quantity;
            this.charterId = accountingLine.charterId;
            this.costCenter = accountingLine.costCenter;
            this.paymentTermId = accountingLine.paymentTermId;
            this.vatId = accountingLine.vatId;
            this.accrualNumber = accountingLine.accrualNumber;
            this.accountReference = accountingLine.accountReference;
            this.associatedAccountCode = accountingLine.associatedAccountCode;
            this.extDocReference = accountingLine.extDocReference;
            this.sectionReference = accountingLine.sectionReference;
            this.dealNumber = accountingLine.dealNumber;
            this.settlementCurrency = accountingLine.settlementCurrency;
            this.provinceId = accountingLine.provinceId;
            this.journalLineId = accountingLine.journalLineId;
            this.postingLineId = accountingLine.postingLineId;
        }
    }

}
