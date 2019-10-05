import { AllocatedTradeSearchResult } from '../dtos/allocated-trade';

export class AllocatedTradeDisplayView {
    contractLabel: string;
    commodityCode: string;
    quantity: number;
    weightCode: string;
    counterparty: string;
    shippingPeriod: string;
    departmentCode: string;
    sectionId: number;
    type: string;
    principalCommodity: string;
    commodityOrigin: string;
    commodityGrade: string;
    commodityLvl4: string;
    commodityLvl5: string;
    allocatedSectionId: number;
    currencyCode: string;

    constructor(allocatedTrade?: AllocatedTradeSearchResult) {
        if (allocatedTrade) {
            this.contractLabel = allocatedTrade.physicalContractCode;
            this.commodityCode = allocatedTrade.commodityCode;
            this.quantity = allocatedTrade.quantity;
            this.weightCode = allocatedTrade.weightCode;
            this.counterparty = allocatedTrade.counterparty;
            this.shippingPeriod = allocatedTrade.shippingPeriod;
            this.departmentCode = allocatedTrade.departmentCode;
            this.sectionId = allocatedTrade.sectionId;
            this.type = allocatedTrade.type;
            this.principalCommodity = allocatedTrade.principalCommodity;
            this.commodityOrigin = allocatedTrade.commodityOrigin;
            this.commodityGrade = allocatedTrade.commodityGrade;
            this.commodityLvl4 = allocatedTrade.commodityLvl4;
            this.commodityLvl5 = allocatedTrade.commodityLvl5;
            this.allocatedSectionId = allocatedTrade.allocatedSectionId;
            this.currencyCode = allocatedTrade.currencyCode;
        }
    }
}
