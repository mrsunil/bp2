import { PricingMethods } from "../../../enums/pricing-method.enum";

export interface TradeForInvoiceSearchResult {
	contractID: number;
	sectionID: number;
	contractLabel: string;
	commodityId: number;
	sellerCode: string;
	contractTerms: string;
	charterReference: string;
	allocatedContract: string;
	quantity: number;
	quantityToInvoice: number;
	weightUnitId: number;
	price: number;
	currency: string;
	paymentTerms: string;
	priceUnitId: number;
	pricingMethod: PricingMethods;
}
