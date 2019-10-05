import { TradeSearchResult } from '../dtos/trade';
import { ContractStatus } from '../enums/contract-status.enum';
import { ContractTypes } from '../enums/contract-type.enum';
import { PricingMethods } from './../enums/pricing-method.enum';

export class TradePartialDisplayView {
    contractLabel: string;
    type: string;
    pricingMethodLabel: string;
    pricingMethodId: number;
    status: string;
    commodityCode: string;
    paymentTermCode: string;
    departmentCode: string;

    quantity: number;
    weightCode: string;
    price: number;
    currencyCode: string;
    contractValue: number;

    contractDate: Date;
    lastModifiedDate: Date;
    lastModifiedBy: string;
    blDate: Date;

    sectionId: number;
    allocatedTo: string;
    charter: string;
    parentRef: string;

    invoicedQuantity: number;
    invoicedQuantityUnit: string;
    invoiceValue: number;
    valuationPrice: number;

    constructor(trade?: TradeSearchResult) {
        if (trade) {
            this.contractLabel = trade.contractLabel;
            this.type = ContractTypes[trade.type];
            this.pricingMethodId = trade.pricingMethodId;
			this.pricingMethodLabel = PricingMethods[trade.pricingMethodId];
            this.status = ContractStatus[trade.status];
            this.commodityCode = trade.commodityCode;
            this.paymentTermCode = trade.paymentTermCode;
            this.departmentCode = trade.departmentCode;

            this.quantity = trade.quantity;
            this.weightCode = trade.weightCode;
            this.price = trade.price;
            this.currencyCode = trade.currencyCode;
            this.contractValue = trade.contractValue;

            this.contractDate = trade.contractDate;
            this.lastModifiedDate = trade.modifiedDateTime;
            this.lastModifiedBy = trade.modifiedBy;

            this.sectionId = trade.sectionId;
            this.allocatedTo = trade.allocatedTo;
            this.charter = trade.charterCode;
            this.parentRef = trade.parentRef;
        }

    }

}
