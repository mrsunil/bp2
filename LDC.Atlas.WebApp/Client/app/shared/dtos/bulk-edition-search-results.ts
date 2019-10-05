export interface BulkEditionSearchResults {

    companyId: string;
    physicalContractCode: string;
    contractLabel: string;
    sectionId: number;
    contractDate: Date;
    traderDisplayName: string;
    status: string;
    departmentCode: string;
    departmentDescription: string;
    price: number;
    priceCode: string;
    priceUnitDescription: string;
    quantity: number;
    weightUnitCode: string;
    weightUnitDescription: string;
    contractQuantity: 0;
    currencyCode: string;
    currencyDescription: string;
    commodity1: string;
    commodity2: string;
    commodity3: string;
    commodity4: string;
    commodity5: string;
    contractTermCode: string;
    contractTermDescription: string;
    contractTermLocationPortCode: string;
    contractTermLocationDescription: string;
    paymentTermCode: string;
    paymentTermDescription: string;
    positionMonth: Date;
    sellerCode: string;
    sellerDescription: string;
    buyerCode: string;
    buyerDescription: string;
    counterparty: string;
    deliveryPeriodStart: Date;
    deliveryPeriodEnd: Date;
    charterReference: string;
    charterDescription: string;
    allocatedContractReference: string;

}
