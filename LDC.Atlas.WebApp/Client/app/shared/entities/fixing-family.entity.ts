import { FixingDetails } from './fixing-details.entity';

export class FixingFamily {
    fixingFamilyCode: number;
    fixTypeCode: string;
    commodityCode: string;
    promptMonthDate: Date;
    numberOfLots: number;
    currencyCode: string;
    priceCode: string;
    fixedLots: number;
    averagePrice: number;
    isFullyFixed: boolean;
    details: FixingDetails[];
}
