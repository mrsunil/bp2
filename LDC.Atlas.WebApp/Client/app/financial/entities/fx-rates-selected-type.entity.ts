import * as moment from 'moment';
import { ForeignExchangeRateViewMode } from './../../shared/enums/foreign-exchange-rate-viewmode.enum';

export class FxRatesSelectedType {
    date: moment.Moment;
    type: ForeignExchangeRateViewMode;
    inactiveCurrencies: boolean;

    constructor() {
        this.date = moment.utc();
        this.type = ForeignExchangeRateViewMode.Spot;
        this.inactiveCurrencies = false;
    }
}
