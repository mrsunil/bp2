import { InvoiceMarkingSearchResult } from "../dtos/invoice-marking";

export class Cost {
    costId: number;
    rowStatus: string;
    bestMatch: string;
    sectionId: number;
    costTypeCode: string;
    description: string;
    supplierCode: string;
    costDirectionId: number;
    currencyCode: string;
    rateTypeId: number;
    priceUnitId: number;
    rate: number;
    inPL: boolean;
    noAction: boolean;
    invoiceStatus: number;
    narrative: string;
    costMatrixLineId: number;
    originalEstimatedPMTValue: number;
    originalEstRateTypeId: number;
    originalEstPriceUnitId: number;
    originalEstCurrencyCode: string;
    originalEstRate: number;
    companyId: string;
    createdDateTime: Date;
    createdBy: string;
    modifiedDateTime: Date;
    modifiedBy: string;
    contextInformation: string;
    documentReference: string;
    documentDate: Date;
    invoicePercent: number;
    costMatrixName: string;
    costInvoiceMarkingLines: InvoiceMarkingSearchResult[];

}
