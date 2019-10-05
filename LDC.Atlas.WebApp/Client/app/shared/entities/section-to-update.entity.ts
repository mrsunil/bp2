
export class SectionToUpdate {
    sectionId: number;
    departmentId: number;
    buyerCounterpartyId: number;
    sellerCounterpartyId: number;
    counterpartyReference: string;
    commodityId: number;
    cropYear: string;
    cropYearFrom: number;
    cropYearTo: number;
    weightUnitId: number;
    quantity: number;
    contractTermId: number;
    portTermId: number;
    arbitrationId: number;
    currencyCode: string;
    priceUnitId: number;
    contractPrice: number;
    contractValue: number;
    paymentTermId: number;
    premiumDiscountBasis: number;
    premiumDiscountCurrency: string;
    premiumDiscountTypeId: number;
    premiumDiscountValue: number;
    periodTypeId: number;
    deliveryPeriodStart: Date;
    deliveryPeriodEnd: Date;
    positionMonthType: number;
    monthPositionIndex: number;
    portOriginId: number;
    portDestinationId: number;
    businessSectorId: number;
    memorandum: string;
    vesselId: number;
    blDate: Date;
    blReference: string;
    otherReference: string;
    contractIssuedDate: Date;
    isBlDateUpdatable: boolean;
    contractDate: Date; // Added the Field for handling C# validations
    contractStatusCode: number;
    invoicingStatusId: number;
}
