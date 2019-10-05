import { TradeCostMonthEndMappingErrors } from "./tradecost-monthend-mappingerrors-entity";

export class FxDealGenerateEndOfMonth {
    dealNumber: string;
    accrualNumber: number;
    costType: string;
    departmentCode: string;
    dealCurrency: string;
    settlementCurrency: string;
    associatedClient: string;
    dealAmount: number;
    settlementAmount: number;
    marketCcyRoeDealt: number;
    maturityDate: Date;
    marketCcyRoeSettlement: number;
    variationMargin: number;
    accountNumber: string;
    accountDescription: string;
    currencyCode: string;
    line1NominalAccountCode: string;
    line2NominalAccountCode: string;
    line1NominalAccountDesc: string;
    line2NominalAccountDesc: string;
    fxDealMonthEndMappingErrors: TradeCostMonthEndMappingErrors[];
}
