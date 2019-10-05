import { CostDirections } from '../enums/cost-direction.enum';
import { RateTypes } from '../enums/rate-type.enum';
import { GetCostsRequest } from '../services/execution/dtos/cost';

export class CostInvoiceSearchDisplayView {
    costId: number;
    sectionId: number;
    contractLabel: string;
    costTypeCode: string;
    supplierCode: string;
    currency: string;
    rateType: string; // lumpSum / rate
    rateTypeSymbole: string;

    rate: number; // amount PMT
    rateAmount: number;

    pricingMethod: number;
    costDirection: string; // Pay / Rec
    costDirectionLabel: string;

    quantity: number; // of the contract associated
    calculatedFullValue: number; // up to date full value of the cost

    charterRef: string; // the charter the contract is assigned to

    originalEstimatePMTValue: number; // original values that don't change once the cost/contract is approved
    originalEstimateFullValue: number; // original values that don't change once the cost/contract is approved

    amountInvoiced: number;
    amountToInvoice: number;

    createdBy: string;
    creationDate: Date;
    lastModifiedBy: string;
    lastModifiedDate: Date;

    constructor(cost: GetCostsRequest) {
        this.costId = cost.costId;
        this.sectionId = cost.sectionId;
        this.contractLabel = cost.contractLabel;
        this.costTypeCode = cost.costTypeCode;
        this.supplierCode = cost.supplierCode;
        this.currency = cost.currency;
        this.rateType = RateTypes[cost.rateType];
        this.rateTypeSymbole = (cost.rateType === RateTypes.Unknown) ? 'Amount' : 'Rate';

        this.rate = cost.rate;
        this.rateAmount = (cost.rateType === RateTypes.Unknown) ? (cost.rate / cost.quantity) : cost.rate;
        this.charterRef = cost.charter;
        this.pricingMethod = cost.pricingMethod;
        this.costDirection = CostDirections[cost.costDirection];
        this.costDirectionLabel = (cost.costDirection === CostDirections.Payable) ? 'PAY' : 'REC';

        this.originalEstimatePMTValue = cost.originalEstimatePMTValue;
        this.originalEstimateFullValue = cost.originalEstimateFullValue;
        this.createdBy = cost.createdBy;
        this.creationDate = cost.creationDate;
        this.lastModifiedBy = cost.lastModifiedBy;
        this.lastModifiedDate = cost.lastModifiedDate;
        this.amountInvoiced = cost.amountInvoiced * (cost.costDirection === CostDirections.Payable ? -1 : 1);

        this.amountToInvoice = (cost.calculatedFullValue - cost.amountInvoiced) * (cost.costDirection === CostDirections.Payable ? -1 : 1);
        this.calculatedFullValue = cost.calculatedFullValue;
        this.quantity = cost.quantity;

        this.calculatedFullValue = cost.calculatedFullValue;
        this.calculatedFullValue = (cost.costDirection === CostDirections.Payable) ? (this.calculatedFullValue * -1) : this.calculatedFullValue;

    }

}
