export interface AllocatedTradeSearchResult {
    physicalContractCode: string;
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
}
