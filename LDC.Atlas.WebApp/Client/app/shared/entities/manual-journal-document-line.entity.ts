export class ManualJournalLine {
    journalLineId: number;
    dataVersionId: number;
    journalDocumentId: number;
    accountReferenceId: number;
    clientAccountId: number;
    associatedAccountId: number;
    accountLineTypeId: number;
    costTypeId: number;
    amount: number;
    narrative: string;
    departmentId: number;
    secondaryDocumentReference: string;
    externalDocumentReference: string;
    sectionId: number;
    commodityId: string;
    quantity: number;
    costCenter: string;
    accrualNumber: number;
    charterId: number;
    fullAmount: number;
    fullQuantity: number;
    dealNumber: string;
    settlementCurrency: string;
    provinceId?: number;
    branchId?: number;

    constructor(manualLine: ManualJournalLine = null) {
        this.accountReferenceId = manualLine !== null ? manualLine.accountReferenceId : null;
        this.clientAccountId = manualLine !== null ? manualLine.clientAccountId : null;
        this.associatedAccountId = manualLine !== null ? manualLine.associatedAccountId : null;
        this.accountLineTypeId = manualLine !== null ? manualLine.accountLineTypeId : null;
        this.costTypeId = manualLine !== null ? manualLine.costTypeId : null;
        this.amount = manualLine !== null ? manualLine.amount : null;
        this.narrative = manualLine !== null ? manualLine.narrative : null;
        this.departmentId = manualLine !== null ? manualLine.departmentId : null;
        this.secondaryDocumentReference = manualLine !== null ? manualLine.secondaryDocumentReference : null;
        this.externalDocumentReference = manualLine !== null ? manualLine.externalDocumentReference : null;
        this.sectionId = manualLine !== null ? manualLine.sectionId : null;
        this.commodityId = manualLine !== null ? manualLine.commodityId : null;
        this.quantity = manualLine !== null ? manualLine.quantity : null;
        this.costCenter = manualLine !== null ? manualLine.costCenter : null;
        this.accrualNumber = manualLine !== null ? manualLine.accrualNumber : null;
        this.charterId = manualLine !== null ? manualLine.charterId : null;
        this.fullAmount = manualLine !== null ? manualLine.fullAmount : null;
        this.fullQuantity = manualLine !== null ? manualLine.fullQuantity : null;
        this.dealNumber = manualLine !== null ? manualLine.dealNumber : null;
        this.settlementCurrency = manualLine !== null ? manualLine.settlementCurrency : null;
        this.provinceId = manualLine !== null ? manualLine.provinceId : null;
        this.branchId = manualLine !== null ? manualLine.branchId : null;
    }
}
