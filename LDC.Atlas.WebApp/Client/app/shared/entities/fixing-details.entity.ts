import { Moment } from 'moment';

export class FixingDetails {
    // From api server
    fixingDetailsId: number;
    fixingFamilyId: number;
    fixedDate: Moment;
    fixedNumberOfLots: number;
    fixedPrice: number;
    currencyCode: string;
    fixTypeCode: string;
    promptMonthDate: Moment;
    commodityCode: string;
    memo: string;
    company: string;

    // From frontend
    isNew: boolean;
    hasChanged: boolean = false;
}
