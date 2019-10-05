import { OverviewGenerateEndOfMonth } from '../entities/overview-generate-end-of-month.entity';

export class OverviewGenerateEndOfMonthDisplayView {
    charterCode: string;
    costType: string;
    currencyCode: string;
    departmentCode: string;
    associatedClient: string;
    fullValue: number;
    invoicedAmount: number;
    accruedAmount: number;
    blDate: Date;
    percentageActualized: number;
    quantity: number;
    contractNumber: string;
    accrualNumber: number;
    accountNumber: string;
    description: string;
    sectionId: number;
    costId: number;
    accountLineTypeId: number;
    postingCostType: string;
    documentReference: string;
    documentDate: Date;
    inhouseOrExternal: string;
    businessSectorCode: string;
    constructor(CostTrade: OverviewGenerateEndOfMonth, reportType: number) {
        if (CostTrade) {
            this.costType = CostTrade.costType;
            this.charterCode = CostTrade.charterCode;
            this.currencyCode = CostTrade.currencyCode;
            this.departmentCode = CostTrade.departmentCode;
            this.associatedClient = CostTrade.associatedClient;
            this.fullValue = CostTrade.fullValue;
            this.invoicedAmount = CostTrade.invoicedAmount;
            this.accruedAmount = (reportType === 1) ? ((CostTrade.accountLineTypeId !== 3) ?
                (-1 * (CostTrade.fullValue - CostTrade.invoicedAmount)) : (CostTrade.fullValue - CostTrade.invoicedAmount))
                : ((CostTrade.isOriginal === 0 ? ((CostTrade.fullValue - CostTrade.invoicedAmount))
                    : (-1 * (CostTrade.fullValue - CostTrade.invoicedAmount))));
            this.blDate = CostTrade.blDate;
            this.percentageActualized = CostTrade.percentageActualized;
            this.quantity = CostTrade.quantity;
            this.contractNumber = CostTrade.contractNumber;
            this.accrualNumber = CostTrade.accrualNumber;
            this.accountNumber = CostTrade.accountNumber;
            this.description = CostTrade.description;
            this.sectionId = CostTrade.sectionId;
            this.costId = CostTrade.costId;
            this.accountLineTypeId = CostTrade.accountLineTypeId;
            this.postingCostType = CostTrade.postingCostType;
            this.documentReference = CostTrade.documentReference;
            this.documentDate = CostTrade.documentDate;
            this.inhouseOrExternal = CostTrade.inhouseOrExternal;
            this.businessSectorCode = CostTrade.businessSectorCode;
        }
    }

}
