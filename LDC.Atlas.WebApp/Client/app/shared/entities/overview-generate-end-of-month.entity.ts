import { TradeCostMonthEndMappingErrors } from './tradecost-monthend-mappingerrors-entity';

export class OverviewGenerateEndOfMonth {
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
    isOriginal: number;
    businessSectorCode: string;
    tradeCostMonthEndMappingErrors: TradeCostMonthEndMappingErrors[];
}
