// tslint:disable-next-line:no-implicit-dependencies
import * as _moment from 'moment';
import { conformToMask } from 'text-mask-core';
import { AtlasNumber } from '../../shared/entities/atlas-number.entity';
import { CreditAgainstTypes } from '../../shared/enums/credit-against-type.enum';
import { DiscountBasis } from '../../shared/enums/discount-basis.enum';
import { DiscountTypes } from '../../shared/enums/discount-type.enum';
import { CustomNumberMask } from '../../shared/numberMask';
const moment = _moment;
export function getContractValue(discountPremium, currency: string, selectedDiscPrem,
    discountPremiumType, weightCodeConversion: number, priceCodeConversion: number,
    contractPriceDecimal: AtlasNumber, quantityDecimal: AtlasNumber, discountPremiumValue, isExpanded: boolean) {
    const mask = CustomNumberMask(12, 10, true);
    if (discountPremium !== undefined &&
        currency !== discountPremium &&
        selectedDiscPrem !== undefined) {
        // discountPremiumValue exists

        if ((discountPremium && selectedDiscPrem) != null) {
            isExpanded = true;
        }

        let discountPremiumContractedPrice: number | AtlasNumber = 0;
        const discountPremiumSign = ((discountPremium as DiscountTypes) === DiscountTypes.Discount ? -1 : 1);

        // tslint:disable-next-line:prefer-conditional-expression
        if ((discountPremium as DiscountBasis) === DiscountBasis.Rate) {
            discountPremiumContractedPrice = discountPremiumValue * discountPremiumSign;
        } else if ((discountPremiumType as DiscountBasis) === DiscountBasis.Percent) {
            discountPremiumContractedPrice = contractPriceDecimal
                .times((discountPremiumValue * discountPremiumSign / 100));
        }

        contractPriceDecimal = contractPriceDecimal.plus(discountPremiumContractedPrice);

    }
    // tslint:disable-next-line:no-shadowed-variable
    const contractValue = contractPriceDecimal.times(quantityDecimal).times(
        weightCodeConversion *
        priceCodeConversion).toString();

    const contractValueFormatted = conformToMask(contractValue, mask, { guide: false }).conformedValue;
    return contractValueFormatted;
}

export function getMaturityDate(creditAgainst, creditDays, companyDate, blDate, positionMonth, deliveryPeriodEnd) {
    // tslint:disable-next-line:no-shadowed-variable
    let maturityDate = companyDate;
    switch (creditAgainst) {
        case CreditAgainstTypes.CurrentDate:
            maturityDate = companyDate;
            break;
        case CreditAgainstTypes.ArrivalDate:
            maturityDate = deliveryPeriodEnd;
            break;
        // case CreditAgainstTypes.InvoiceDate:
        // TODO:
        // Has dependency on invoicing functionality
        // break;
        default:
            // Need to call new Date(date) to avoid modifying the blDate when changing maturityDate
            maturityDate = blDate ?
                new Date(blDate) :
                moment(positionMonth).endOf('month').toDate();
            if (!blDate || !deliveryPeriodEnd) {
                creditDays = 0;
            }
            break;
    }

    maturityDate.setDate(maturityDate.getDate() + creditDays);
    return maturityDate;

}

export function cropYearValidation(years, contractDate): number {
    let result = 1;
    if (years) {
        if (years.length > 1) {
            if (Number(years[1]) < Number(years[0])) {
                result = 0;
            }
        }

        years.forEach((year) => {
            if (!isDateInRange(Number(year), contractDate.year() - 5, contractDate.year() + 5)) {
                result = -1;
            }
        });
    }
    return result;
}
function isDateInRange(value, start, stop) {
    return value >= start && value <= stop;
}
