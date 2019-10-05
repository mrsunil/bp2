import { ContractTypes } from '../enums/contract-type.enum';
import { PositionMonthTypes } from './../enums/position-month-type.enum';

// To do : there are duplicate informations in this object (exemple: ports)
// This is due to implementation of L&S without a L&S - changed during UAT
// Please refacto in Wave 1
export interface ChildSectionsSearchResult {
    contractLabel: string;
    sectionId: number;
    status: string;
    blDate: Date;
    allocatedTo: string;
    assignedCharterReference: string;
    department: string;
    departmentCode: string;
    counterpartyReference: string;
    counterparty: string;
    contractTerm: string;
    contractTermsLocation: string;
    commodityCode: string;
    commodityOrigin: string;
    commodityGrade: string;
    commodityLvl4: string;
    commodityLvl5: string;
    weightUnit: string;
    quantity: number;
    currency: string;
    priceUnit: string;
    price: number;
    paymentTerm: string;
    deliveryPeriodStartDate: Date;
    positionMonthIndex: number;
    contractDate: Date;
    pricingMethod: string;
    lastModifiedBy: string;
    physicalContractId: number;
    createdDateTime: Date;
    createdBy: string;
    modifiedDateTime: Date;
    modifiedBy: string;
    contractType: ContractTypes;
    contractId: number;
    sectionNumber: string;
    firstApprovalDateTime: Date;
    departmentId: number;
    buyerCode: string;
    buyerDescription: string;
    charterDescription: string;
    sellerDescription: string;
    paymentTermDescription: string;
    contractTermLocationDescription: string;
    currencyDescription: string;
    weightUnitDescription: string;
    priceUnitDescription: string;
    traderDisplayName: string;
    companyId: string;
    contractTermDescription: string;
    sellerCode: string;
    commodityId: number;
    originalQuantity: number;
    weightUnitId: number;
    toleranceMin: number;
    toleranceMax: number;
    portOriginCode: string;
    portDestinationCode: string;
    positionMonthType: PositionMonthTypes;
    allocationDate: Date;
    charterAssignmentDate: Date;
    creationDate: Date;
    lastModifiedDate: Date;
    finalInvoiceRequired: boolean;
    cropYear: number;
    packingCode: string;
    paymentTermCode: string;
    contractTermCode: string;
    periodTypeCode: string;
    priceUnitId: number;
    priceCode: string;
    arbitrationCode: string;
    premiumDiscountTypeId: number;
    premiumDiscountValue: number;
    premiumDiscountCurrency: string;
    premiumDiscountBasis: number;
    contractedValue: string;
    sectionTypeId: number;
    portOfOrigin: string;
    portOfDestination: string;
    deliveryPeriodEndDate: Date;
    contractTerms: string;
    periodType: string;
    paymentTerms: string;
    cropYearTo: number;
    arbitration: string;
    positionMonth: Date;
    charterId: number;
    invoiceReference: string;
    otherReference: string;
    shippingPeriod: string;
    periodTypeId: number;
    invoicingStatusId: number;
    invoiceTypeId: number;
    sectionOriginId: number;
    contractValue: number;
    memo: string;
    commodityDescription: string;
    arbitrationDescription: string;
    positionType: string;
    portOfOriginDescription: string;
    portOfDestinationDescription: string;
    groupingNumber: number;
    mainInvoiceReference: string;
    mainInvoiceDate: Date;
    percentageInvoiced: number;
    quantityCodeInvoiced: string;
    invoiceValue: number;
    paymentDate: Date;
    quantityInvoiced: number;
    invoicingStatus: string;
    amendedBy: string;
    amendedOn: Date;
    vesselName: string;
    bLReference: string;
    charterManager: string;
    counterpartyRef: string;
    contractIssuedOn: Date;
    contractTypeCode: string;
    allocatedSectionId: number;
    estimatedMaturityDate: Date;
}
