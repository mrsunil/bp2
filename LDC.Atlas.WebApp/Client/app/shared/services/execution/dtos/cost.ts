import { InvoiceStatus } from '../../../enums/invoice-status.enum';

export class SearchCostForInvoicing {
	costType: string;
	supplierCode: string;
	charter: string;
	contractRef: string;

	constructor(costType: string, supplierCode: string, charter: string, contractRef: string) {
		this.costType = costType;
		this.supplierCode = supplierCode;
		this.charter = charter;
		this.contractRef = contractRef;
	}
}

export interface GetCostsRequest {
	costId: number;
	sectionId: number;
	contractLabel: string;
	costTypeCode: string;
	supplierCode: string;
	currency: string;
	rateType: number; // lumpSum / rate

	rate: number; // amount PMT
	pricingMethod: number;
	costDirection: number; // Pay / Rec
	quantity: number; // of the contract associated
	calculatedFullValue: number; // up to date full value of the cost

	charter: string; // the charter the contract is assigned to

	originalEstimatePMTValue: number; // original values that don't change once the cost/contract is approved
	originalEstimateFullValue: number; // original values that don't change once the cost/contract is approved

	amountInvoiced: number;
	amountToInvoice: number;

	invoiceStatus: InvoiceStatus;

	createdBy: string;
	creationDate: Date;
	lastModifiedBy: string;
	lastModifiedDate: Date;
}
