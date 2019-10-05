export class AllocationMessage {
    errorTypeId: number;
    message: string;
    portOriginId: number;
    portDestinationId: number;
    principalCommodity: string;
    part2: string;
    part3: string;
    part4: string;
    part5: string;
    charterId: number;

    arbitrationId: number;
    buyerId: number;
    contractDate: Date;
    contractedValue: number;
    contractStatusCode: number;
    contractTermLocationId: number;
    counterpartyRef: string;
    cropYear: number;
    currencyCode: string;
    deliveryPeriodEnd: Date;
    deliveryPeriodStart: Date;
    departmentId: number;
    firstApprovalDateTime: Date;
    marketSectorId: number;
    memorandum: string;
    monthPositionIndex: number;
    originalQuantity: number;
    paymentTermId: number;
    periodTypeId: number;
    physicalContractCode: string;
    positionMonthType: number;
    premiumDiscountBasis: number;
    premiumDiscountCurrency: string;
    premiumDiscountValue: number;
    price: number;
    pricingMethodId: number;
    quantity: number;
    sellerId: number;
    shippingPeriod: boolean;
    traderId: number;
    type: number;

}
