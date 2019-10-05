import * as _moment from 'moment';
import { Cost } from '../entities/cost.entity';
import { Section } from '../entities/section.entity';
import { ContractStatus } from '../enums/contract-status.enum';
import { ContractTypes } from '../enums/contract-type.enum';
import { PositionMonthTypes } from '../enums/position-month-type.enum';
import { PricingMethods } from '../enums/pricing-method.enum';
const moment = _moment;

export class SectionCompleteDisplayView {
    // -- General Information
    sectionId: number;
    reference: string;
    type: string;
    contractDate: Date;
    departmentCode: string;
    departmentId: number;
    traderId: number;

    // -- Counterparty
    buyerCode: string;
    sellerCode: string;
    counterpartyReference: string;
    // -- Product
    commodityId: number;
    quantity: number;
    weightUnitId: number;
    cropYear: number;
    cropYearTo: number;
    originalQuantity: number;

    // -- Terms & Period &memorandum
    deliveryPeriodStart: Date;
    deliveryPeriodEnd: Date;
    contractTerms: string;
    contractTermsLocation: string;
    contractedValue: string;
    portOfOrigin: string;
    portOfDestination: string;
    memorandum: string;

    periodTypeCode: string; // Delivery default
    periodTypeId: number;
    positionMonthType: string;
    positionMonth: Date;
    positionMonthIndex: number;
    arbitration: string;
    marketSectorId: number;

    blDate: Date;
    allocatedTo: string;
    allocationDate: string;

    // -- Pricing
    pricingMethod: PricingMethods;
    pricingMethodAsString: string;
    paymentTerms: string;
    currency: string;
    priceUnitId: number;
    price: number;

    // Split
    sectionOriginId: number;
    contractLabelOrigin: string;

    // -- Status
    status: string;
    createdBy: string;
    creationDate: Date;
    lastModifiedBy: string;
    lastModifiedDate: Date;
    firstApprovalDateTime: Date;
    costs: Cost[];
    lastDocumentIssuedDate: Date;
    otherReference: string;
    contractSentDate: Date;
    lastEmailReceivedDate: Date;
    contractReturnedDate: Date;
    isClosed: boolean;
    isCancelled: boolean;

    // Charter
    assignedCharter: string;
    charterAssignmentDate: Date;
    // -- Futures and Options
    premiumDiscountTypeId?: number;
    premiumDiscountValue: number;
    premiumDiscountCurrency: string;
    premiumDiscountBasis: number;
    // -- Traffic
    invoiceReference: string;
    shippingPeriod: string;
    invoicingStatusId: number;
    allocatedToInvoicingStatusId: number;
    invoiceDate: Date;
    estimatedMaturityDate: Date;

    constructor(section?: Section) {
        if (section) {
            // -- General Information
            this.reference = section.contractLabel;
            if (section.header) {
                this.type = ContractTypes[section.header.type];
                this.contractDate = section.header.contractDate;
                this.traderId = section.header.traderId;
            } else {
                this.type = ContractTypes[section.contractType];
                this.traderId = section.traderId;
            }
            this.departmentId = section.departmentId;

            this.sectionId = section.sectionId;

            // -- Counterparty
            this.buyerCode = section.buyerCode;
            this.sellerCode = section.sellerCode;
            this.counterpartyReference = section.counterpartyReference;
            // -- Product
            this.commodityId = section.commodityId;
            this.quantity = section.quantity;
            this.weightUnitId = section.weightUnitId;
            this.cropYear = section.cropYear;
            this.cropYearTo = section.cropYearTo;
            this.originalQuantity = section.originalQuantity;

            // -- Terms & Period &Memorandum
            this.deliveryPeriodStart = section.deliveryPeriodStartDate;
            this.deliveryPeriodEnd = section.deliveryPeriodEndDate;
            this.contractTerms = section.contractTerms;
            this.contractTermsLocation = section.contractTermsLocation;
            this.contractedValue = section.contractedValue.toString();
            this.portOfOrigin = section.portOfOrigin;
            this.portOfDestination = section.portOfDestination;
            this.memorandum = section.memorandum;
            this.shippingPeriod = section.shippingPeriod;

            this.periodTypeCode = section.periodTypeCode;
            this.positionMonthType = PositionMonthTypes[section.positionMonthType];
            this.positionMonthIndex = section.positionMonthIndex;
            this.positionMonth = section.positionMonth;
            this.arbitration = section.arbitration;
            this.marketSectorId = section.marketSectorId;

            this.blDate = section.blDate;
            this.allocatedTo = (section.allocatedTo) ? section.allocatedTo.contractLabel : null;
            this.allocationDate = (section.allocationDate == null) ? null : moment(new Date(section.allocationDate))
                .format('DD MMM YYYY').toString();

            // -- Pricing
            this.pricingMethod = section.pricingMethod;
            this.pricingMethodAsString = PricingMethods[section.pricingMethod];
            this.paymentTerms = section.paymentTerms;
            this.currency = section.currencyCode;
            this.priceUnitId = section.priceUnitId;
            this.price = section.price;

            // -- Split
            this.sectionOriginId = (section.sectionOriginId == null) ? null : section.sectionOriginId;
            this.contractLabelOrigin = section.contractLabelOrigin;

            // -- Status
            this.status = ContractStatus[section.status];
            this.createdBy = section.createdBy;
            this.creationDate = section.creationDate;
            this.lastModifiedBy = section.lastModifiedBy;
            this.lastModifiedDate = section.lastModifiedDate;
            this.firstApprovalDateTime = section.firstApprovalDateTime;
            this.lastDocumentIssuedDate = section.lastDocumentIssuedDate;
            this.contractSentDate = section.contractSentDate;
            this.lastEmailReceivedDate = section.lastEmailReceivedDate;
            this.contractReturnedDate = section.contractReturnedDate;
            this.otherReference = section.otherReference;
            this.isClosed = section.isClosed;
            this.isCancelled = section.isCancelled;

            // -- Costs
            this.costs = section.costs;

            // charters
            this.charterAssignmentDate = section.charterAssignmentDate;
            this.assignedCharter = section.assignedCharterReference;

            // -- Futures and Options
            this.premiumDiscountTypeId = section.premiumDiscountTypeId;
            this.premiumDiscountValue = section.premiumDiscountValue;
            this.premiumDiscountCurrency = section.premiumDiscountCurrency;
            this.premiumDiscountBasis = section.premiumDiscountBasis;

            // -- Traffic
            this.invoiceReference = section.invoiceReference;
            this.invoicingStatusId = section.invoicingStatusId;
            this.invoiceDate = section.invoiceDate;
            if (section.allocatedTo) {
                this.allocatedToInvoicingStatusId = section.allocatedTo.invoicingStatusId;
            }
            this.estimatedMaturityDate = section.estimatedMaturityDate;
        }
    }
}
