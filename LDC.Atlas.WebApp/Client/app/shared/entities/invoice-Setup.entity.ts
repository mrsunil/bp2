export class InvoiceSetup {
    invoiceSetupId: number;
    vatActive: boolean;
    vatLabel: string;
    defaultVATCode: string;
    tolerancePercentage: number;
    authorizedForPosting: boolean;
    companyId: string;
    paymentTermId: number;
    thresholdCostAmount: number;
    defaultCostVATCode: string;
    taxTypeId: number;
}
