export interface InvoiceSetupResult {
    invoiceSetupId: number;
    vatActive: boolean;
    vatLabel: string;
    defaultVATCode: string;
    tolerancePercentage: number;
    authorizedForPosting: boolean;
    companyId: string;
    paymentTermCode: string;
    thresholdCostAmount: number;
    defaultCostVATCode: string;
    taxType: string;
}
