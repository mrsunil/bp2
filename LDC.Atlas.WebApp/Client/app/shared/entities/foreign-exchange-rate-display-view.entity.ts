import { ForeignExchangeRate } from './foreign-exchange/foreign-exchange-rate.entity';

export class ForeignExchangeRateDisplayView {
    currencyCode: string;
    currencyDescription: string;
    rateType: string;
    date: Date;
    exchangeRate: string;
    oneMonthForwardPeriodPoints: string;
    twoMonthsForwardPeriodPoints: string;
    threeMonthsForwardPeriodPoints: string;
    sixMonthsForwardPeriodPoints: string;
    oneYearForwardPeriodPoints: string;
    twoYearForwardPeriodPoints: string;
    isInactive: boolean;
    isTouched = false;
    highlight = false;
    lastAmendmentOn: Date;
    lastAmendmentBy: string;
    creationMode: string;
    time: string;

    constructor(foreignExchangeRate: ForeignExchangeRate) {
        this.currencyCode = foreignExchangeRate.currencyCode;
        this.rateType = foreignExchangeRate.currencyRoeType;
        this.date = foreignExchangeRate.date;
        this.exchangeRate = foreignExchangeRate.rate;
        this.oneMonthForwardPeriodPoints = foreignExchangeRate.fwdMonth1;
        this.twoMonthsForwardPeriodPoints = foreignExchangeRate.fwdMonth2;
        this.threeMonthsForwardPeriodPoints = foreignExchangeRate.fwdMonth3;
        this.sixMonthsForwardPeriodPoints = foreignExchangeRate.fwdMonth6;
        this.oneYearForwardPeriodPoints = foreignExchangeRate.fwdYear1;
        this.twoYearForwardPeriodPoints = foreignExchangeRate.fwdYear2;
        this.isInactive = foreignExchangeRate.currencyIsDeactivated;
        this.currencyDescription = foreignExchangeRate.currencyDescription;
        this.lastAmendmentOn = foreignExchangeRate.modifiedBy ? foreignExchangeRate.modifiedDateTime : foreignExchangeRate.createdDateTime;
        this.lastAmendmentBy = foreignExchangeRate.modifiedBy ? foreignExchangeRate.modifiedBy : foreignExchangeRate.createdBy;
        this.creationMode = foreignExchangeRate.creationMode;
        this.time = this.lastAmendmentOn ? this.lastAmendmentOn.toISOString().substr(11, 8) : '';
    }
}
