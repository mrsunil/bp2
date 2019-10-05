import { Cost } from '../../shared/entities/cost.entity';
import { InvoiceMarkings } from '../../shared/entities/invoice-markings.entity';
import { SectionReference } from '../../shared/entities/section-reference.entity';
import { Section } from '../../shared/entities/section.entity';
import { ContractInvoiceType } from '../../shared/enums/contract-invoice-type.enum';
import { ContractStatus } from '../../shared/enums/contract-status.enum';
import { ContractTypes } from '../../shared/enums/contract-type.enum';
import { DiscountBasis } from '../../shared/enums/discount-basis.enum';
import { DiscountTypes } from '../../shared/enums/discount-type.enum';
import { InvoicingStatus } from '../../shared/enums/invoicing-status.enum';
import { PositionMonthTypes } from '../../shared/enums/position-month-type.enum';
import { PricingMethods } from '../../shared/enums/pricing-method.enum';
import { ToleranceTypes } from '../../shared/enums/tolerance-type.enum';

export class PhysicalFixedPricedContract {
    company: string;
    dataVersionId: number;
    contractReference: string;
    createdBy: string;
    contractDate: Date;
    status: ContractStatus;
    type: ContractTypes;
    firstApprovalTime: Date;
    departmentId: number;
    traderId: number;
    buyerCode: string;
    sellerCode: string;
    commodityId: number;
    quantity: string;
    weightUnitId: number; // quantityUnit: string;
    cropYear: number;
    cropYearTo: number;
    toleranceType: ToleranceTypes;
    toleranceMin: number;
    toleranceMax: number;
    tolerancePourcentage: number;
    contractTerms: string;
    contractTermsLocation: string;
    portOfOrigin: string;
    portOfDestination: string;
    deliveryPeriodStartDate: Date;
    deliveryPeriodEndDate: Date;
    periodType: string;
    periodTypeId: number;
    positionMonthType: PositionMonthTypes;
    positionMonthIndex: number;
    arbitration: string;
    marketSectorId: string;
    pricingMethod: PricingMethods;
    paymentTerms: string;
    priceUnitId: string;
    price: number;
    blDate: Date;
    currencyCode: string;
    counterpartyReference: string;
    contractedValue: string;
    memorandum: string;
    sectionId: number;
    lastModifiedBy: string;
    lastModifiedDate: Date;
    createdByUserId: number;
    modifiedByUserId: number;
    contractInvoiceTypeId: ContractInvoiceType;

    // -- Discount Premium Fields
    discountPremiumType?: DiscountTypes;
    discountPremiumBasis?: DiscountBasis;
    discountPremiumCurrency?: string;
    discountPremiumValue?: number;
    costs: Cost[] = [];
    invoices: InvoiceMarkings[] = [];
    invoiceStatus: InvoicingStatus;
    creationDate: Date;
    allocatedTo: SectionReference;
    invoiceReference: string;
    previousQuantity: number;
    lastDocumentIssuedDate: Date;
    currentTradeOptionId: number;
    allocateTradeOptionId: number;
    numberOfContracts: number;
    childSections: Section[];
    originalQuantity: number;
    otherReference: string;
    contractSentDate: Date;
    lastEmailReceivedDate: Date;
    contractReturnedDate: Date;

    //Interco Trade
    isInterco: boolean;
    intercoContractType: ContractTypes;
    intercoCompanyId: string;
    intercoBuyerCode: string;
    intercoSellerCode: string;
    intercoDepartmentId?: number;
    intercoTraderId?: number;
    isRemoveInterco: boolean;
    intercoCosts: Cost[] = [];
    isSplitCreated: boolean;

    estimatedMaturityDate: Date;
    invoiceDate: Date;
}
