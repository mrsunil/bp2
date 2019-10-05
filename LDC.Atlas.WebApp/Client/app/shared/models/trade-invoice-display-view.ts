import * as _moment from 'moment';
import { ContractTypes } from '../enums/contract-type.enum';
import { PricingMethods } from '../enums/pricing-method.enum';
import { InvoiceMarking } from '../services/execution/dtos/invoice-marking';
import { TradeForInvoiceSearchResult } from '../services/execution/dtos/trade';
const moment = _moment;

export class TradeInvoiceDisplayView {
    sectionID: number;
    reference: string;
    contractType = -1;
    CROrDB = '';
    commodityId: number;
    counterparty: string;
    contractTerms: string;
    charterReference: string;
    allocatedContract: string;
    quantity: number;
    quantityToInvoice: number;
    price: number;
    weightUnitId: number;
    currency: string;
    paymentTerms: string;
    priceUnitId: number;
    invoiceValue: number;
    pricingMethod: PricingMethods;

    constructor(trade?: TradeForInvoiceSearchResult) {
        if (trade) {
            this.sectionID = trade.sectionID;
            this.reference = trade.contractLabel;
            switch (trade.contractLabel.slice(0, 1)) {
                case 'P': {
                    this.contractType = ContractTypes.Purchase;
                    this.CROrDB = 'DB';
                    break;
                }
                case 'S': {
                    this.contractType = ContractTypes.Sale;
                    this.CROrDB = 'CR';
                    break;
                }
            }
            this.commodityId = trade.commodityId;
            this.counterparty = trade.sellerCode;
            this.contractTerms = trade.contractTerms;
            this.allocatedContract = trade.allocatedContract;
            this.quantity = trade.quantity;
            this.price = trade.price;
            this.weightUnitId = trade.weightUnitId;
            this.quantityToInvoice = trade.quantity;
            this.currency = trade.currency;
            this.charterReference = trade.charterReference;
            this.paymentTerms = trade.paymentTerms;
            this.priceUnitId = trade.priceUnitId;
            this.invoiceValue = trade.quantity * trade.price;
            this.pricingMethod = trade.pricingMethod;
        }
    }
}

export class InvoiceMarkingDisplayView {
    invoiceMarkingID: number;
    sectionReference: string;
    invoiceReference: string;
    quantity: number;
    currency: string;
    amount: number;
    dueDate: string;
    externalInvoiceRef: string;
    paidAmount: number;
    paidPercentage: number;
    matchDate: string;
    remainingAmount: number;

    constructor(invoiceMarking?: InvoiceMarking) {
        if (invoiceMarking) {
            this.invoiceMarkingID = invoiceMarking.invoiceMarkingID;
            this.sectionReference = invoiceMarking.sectionReference;
            this.invoiceReference = invoiceMarking.invoiceReference;
            this.quantity = invoiceMarking.quantity;
            this.currency = invoiceMarking.currency;
            this.amount = invoiceMarking.amount;
            this.dueDate = moment(new Date(invoiceMarking.dueDate)).format('MMM YYYY').toString();
            this.externalInvoiceRef = invoiceMarking.externalInvoiceRef;
            this.paidAmount = invoiceMarking.paidAmount;
            this.paidPercentage = invoiceMarking.paidPercentage;
            this.matchDate = (invoiceMarking.matchDate == null) ? null : moment(new Date(invoiceMarking.matchDate)).format('MMM YYYY').toString();
            this.remainingAmount = invoiceMarking.remainingAmount;
        }
    }
}
