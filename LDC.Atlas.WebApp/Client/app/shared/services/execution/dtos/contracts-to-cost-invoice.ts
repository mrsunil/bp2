
export class ContractsToCostInvoice {
    costId: number;
    sectionId: number;
    contractReference: string;
    principalCommodity: string;
    supplierCode: string;
    contractTermCode: string;
    charterReference: string;
    quantity: string;
    weightCode: string;
    costTypeCode: string;
    costDirection: string;
    currencyCode: string;
    rate: number;
    narrative: string;
    originalEstimatedRate: number;
    contractDate: Date;
    rateTypeCode: string;
    price: number;
    weightConversionFactor: number;
    priceConversionFactor: number;
    commodity: string;
    commodity2: string;
    commodity3: string;
    commodity4: string;
    commodity5: string;
    invoicedAmount: number;
    rateConversionFactor: number;

    // -- not coming from API
    costAmountToInvoice: number;
    invoicePercent: number;
    costAmount: number;
    vatCode: string;
    vatAmount: number;
    invoicedPercentage: number;
    quantityToInvoice: number;
    originalQuantity: string;

}
