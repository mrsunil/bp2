export class BulkCost {
    sectionId: number;
    contractReference: string;
    costTypeCode: string;
    costTypeId: number;
    description: string;
    supplierCode: string;
    costDirectionId: number;
    currencyCode: string;
    rateTypeId: number;
    priceUnitId: number;
    rate: number;
    inPL: boolean;
    noAction: boolean;
    narrative: string;
    companyId: string;
    invoicePercent: number;
    costMatrixName: string;
    isAddOrOverride: string;
    costMatrixLineId: number;
    rateTypeCode: string;
    priceCode: string;
    costDirection: string;
    rowStatus: string;
    costId: number;
    quantity: number;
    invoicingStatusId: number;
    isApproved: boolean;
    // used to identify to which contracts,
    // the newly added cost lines to added
    costIds: number[];
    updateOptions: string;
    isProRata: boolean;
    sectionIds: number[];
    isDelete: boolean;

}
