import { ContractStatus } from '../enums/contract-status.enum';
import { ContractTypes } from '../enums/contract-type.enum';
import { PositionMonthTypes } from '../enums/position-month-type.enum';
import { PricingMethods } from '../enums/pricing-method.enum';
import { ChildSectionsSearchResult } from './../dtos/chilesection-search-result';
import { Cost } from './cost.entity';
import { SectionReference } from './section-reference.entity';
import { Trade } from './trade.entity';
import { ContractInvoiceType } from '../enums/contract-invoice-type.enum';

export class Section {
    constructor() {
        this.childSections = new Array<Section>();
        this.costs = new Array<Cost>();
    }
    contractType: ContractTypes;
    sectionId: number;
    contractId: number;
    physicalContractId: number;
    contractLabel: string;
    sectionNumber: string;
    status: ContractStatus;
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
    counterpartyReference: string;
    commodityId: number;
    originalQuantity: number;
    quantity: number;
    weightUnitId: number;
    portOfOrigin: string;
    portOfDestination: string;
    deliveryPeriodStartDate: Date;
    deliveryPeriodEndDate: Date;
    positionMonthType: PositionMonthTypes;
    positionMonthIndex: number;
    positionMonth: Date;
    cropYear: number;
    cropYearTo: number;
    packingCode: string;
    contractTerms: string;
    contractTermsLocation: string;
    periodTypeCode: string;
    periodTypeId: number;
    arbitration: string;
    marketSectorId: number;
    pricingMethod: PricingMethods;
    paymentTerms: string;
    currencyCode: string;
    priceUnitId: number;
    price: number;
    blDate: Date;
    allocatedToId: number;
    allocatedTo: SectionReference;
    allocationDate: Date;
    assignedCharterReference: string;
    charterAssignmentDate: Date;
    createdBy: string;
    creationDate: Date;
    lastModifiedBy: string;
    lastModifiedDate: Date;
    header: Trade<Section>;
    sectionOriginId: number;
    contractLabelOrigin?: string;
    childSections: Section[];
    costs: Cost[];
    premiumDiscountTypeId?: number;
    premiumDiscountValue: number;
    premiumDiscountCurrency: string;
    premiumDiscountBasis: number;
    memorandum: string;
    contractedValue: string;
    sectionTypeId: number;
    contractDate: Date;
    charterId?: number;
    invoiceReference: string;
    shippingPeriod: string;
    invoicingStatusId: number;
    invoiceTypeId: number;
    lastDocumentIssuedDate: Date;
    dataVersionId: number;
    otherReference: string;
    isInterCo: boolean;
    isRemoveInterco: boolean;
    traderId: number;
    charterStatusId: number;
    contractSentDate: Date;
    lastEmailReceivedDate: Date;
    contractReturnedDate: Date;
    currency: string;
    isClosed: boolean;
    isCancelled: boolean;
    contractInvoiceTypeId: ContractInvoiceType;
    invoiceDate: Date;
    estimatedMaturityDate: Date;
    totalInvoiceQuantity: number;
    totalInvoiceValue: number;
    totalInvoicePercent: number;

    public setSectionFromChildSectionsSearchResult(
        childSectionResult: ChildSectionsSearchResult,
        sectionOriginId?: number): void {
        this.sectionId = childSectionResult.sectionId;
        this.contractId = childSectionResult.sectionId;
        this.contractLabel = childSectionResult.contractLabel;
        this.sectionNumber = childSectionResult.contractLabel.split('.')[1];
        this.status = ContractStatus[childSectionResult.status];
        this.counterpartyReference = childSectionResult.counterpartyReference;
        this.quantity = childSectionResult.quantity;
        this.deliveryPeriodStartDate = childSectionResult.deliveryPeriodStartDate;
        this.positionMonthIndex = childSectionResult.positionMonthIndex;
        this.contractTerms = childSectionResult.contractTerm;
        this.contractTermsLocation = childSectionResult.contractTermsLocation;
        this.pricingMethod = PricingMethods[childSectionResult.pricingMethod];
        this.paymentTerms = childSectionResult.paymentTerm;
        this.currencyCode = childSectionResult.currency;
        this.price = childSectionResult.price;
        this.blDate = childSectionResult.blDate;
        this.assignedCharterReference = childSectionResult.assignedCharterReference;
        this.lastModifiedBy = childSectionResult.lastModifiedBy;
        this.sectionOriginId = sectionOriginId;
        this.contractLabelOrigin = childSectionResult.contractLabel;
        this.contractDate = childSectionResult.contractDate;
        this.physicalContractId = childSectionResult.physicalContractId;
        this.creationDate = childSectionResult.createdDateTime;
        this.createdBy = childSectionResult.createdBy;
        this.lastModifiedDate = childSectionResult.modifiedDateTime;
        this.lastModifiedBy = childSectionResult.modifiedBy;
        this.contractType = childSectionResult.contractType;
        this.contractId = childSectionResult.contractId;
        this.sectionNumber = childSectionResult.sectionNumber;
        this.firstApprovalDateTime = childSectionResult.firstApprovalDateTime;
        this.departmentId = childSectionResult.departmentId;
        this.buyerCode = childSectionResult.buyerCode;
        this.sellerCode = childSectionResult.sellerCode;
        this.commodityId = childSectionResult.commodityId;
        this.originalQuantity = childSectionResult.originalQuantity;
        this.weightUnitId = childSectionResult.weightUnitId;
        this.portOfOrigin = childSectionResult.portOriginCode;
        this.portOfDestination = childSectionResult.portDestinationCode;
        this.positionMonthType = childSectionResult.positionMonthType;
        this.allocationDate = childSectionResult.allocationDate;
        this.charterAssignmentDate = childSectionResult.charterAssignmentDate;
        this.creationDate = childSectionResult.creationDate;
        this.lastModifiedDate = childSectionResult.lastModifiedDate;
        this.cropYear = childSectionResult.cropYear;
        this.packingCode = childSectionResult.packingCode;
        this.paymentTerms = childSectionResult.paymentTermCode;
        this.periodTypeCode = childSectionResult.periodTypeCode;
        this.priceUnitId = childSectionResult.priceUnitId;
        this.arbitration = childSectionResult.arbitrationCode;
        this.premiumDiscountTypeId = childSectionResult.premiumDiscountTypeId;
        this.premiumDiscountValue = childSectionResult.premiumDiscountValue;
        this.premiumDiscountCurrency = childSectionResult.premiumDiscountCurrency;
        this.premiumDiscountBasis = childSectionResult.premiumDiscountBasis;
        this.contractedValue = childSectionResult.contractedValue;
        this.sectionTypeId = childSectionResult.sectionTypeId;
        this.portOfOrigin = childSectionResult.portOfOrigin;
        this.portOfDestination = childSectionResult.portOfDestination;
        this.deliveryPeriodEndDate = childSectionResult.deliveryPeriodEndDate;
        this.contractTerms = childSectionResult.contractTerms;
        this.periodTypeId = childSectionResult.periodTypeId;
        this.paymentTerms = childSectionResult.paymentTerms;
        this.cropYearTo = childSectionResult.cropYearTo;
        this.arbitration = childSectionResult.arbitration;
        this.positionMonth = childSectionResult.positionMonth;
        this.charterId = childSectionResult.charterId;
        this.invoiceReference = childSectionResult.invoiceReference;
        this.otherReference = childSectionResult.otherReference;
        this.shippingPeriod = childSectionResult.shippingPeriod;
        this.periodTypeId = childSectionResult.periodTypeId;
        this.invoicingStatusId = childSectionResult.invoicingStatusId;
        this.invoiceTypeId = childSectionResult.invoiceTypeId;
        this.currency = childSectionResult.currency;
        this.estimatedMaturityDate = childSectionResult.estimatedMaturityDate;
    }
}