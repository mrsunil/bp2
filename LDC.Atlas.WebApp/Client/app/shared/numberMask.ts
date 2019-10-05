import createNumberMask from 'text-mask-addons/dist/createNumberMask';
import { isNumber } from 'util';

export function CreateMask(
    prefix: string = '',
    includeThousandsSeparator: boolean = true,
    allowDecimal: boolean = true,
    requireDecimal: boolean = true,
    decimalLimit: number = 2,
    allowNegative: false): any {

    return createNumberMask({
        prefix,
        includeThousandsSeparator,
        allowDecimal,
        requireDecimal,
        decimalLimit,
        allowNegative,
    });
}

export function TwoDigitsDecimalNumberMask(): any {
    return createNumberMask({
        prefix: '',
        includeThousandsSeparator: true,
        allowDecimal: true,
        requireDecimal: false,
        decimalLimit: 2,
    });
}

export function TwoDigitsDecimalNegativeNumberMask(): any {
    return createNumberMask({
        prefix: '',
        includeThousandsSeparator: true,
        allowDecimal: true,
        requireDecimal: false,
        decimalLimit: 2,
        allowNegative: true,
    });
}

export function FourDigitsDecimalNegativeNumberMask(): any {
    return createNumberMask({
        prefix: '',
        includeThousandsSeparator: true,
        allowDecimal: true,
        requireDecimal: false,
        decimalLimit: 4,
        allowNegative: true,

    });
}

export function CustomNumberMask(numberOfIntegers: number, numberOfDigits: number, negativeAllowed = false): any {
    return createNumberMask({
        prefix: '',
        includeThousandsSeparator: true,
        allowDecimal: true,
        requireDecimal: false,
        decimalLimit: numberOfDigits,
        allowNegative: negativeAllowed,
        integerLimit: numberOfIntegers,
    });
}

export function IntegerNumber(): any {
    return createNumberMask({
        prefix: '',
        suffix: '',
        includeThousandsSeparator: true,
        allowDecimal: false,
        decimalLimit: 0,
    });
}

export function AllIntegerNumber(): any {
    return createNumberMask({
        prefix: '',
        suffix: '',
        includeThousandsSeparator: true,
        allowDecimal: false,
        decimalLimit: 0,
        allowNegative: true,
    });
}

export function AllNumberMask(): any {
    return createNumberMask({
        prefix: '',
        suffix: '',
        includeThousandsSeparator: true,
        decimalSymbol: '.',
        thousandsSeparatorSymbol: ',',
        allowDecimal: true,
        decimalLimit: 20,
        integerLimit: 20,
        requireDecimal: false,
        allowNegative: true,
    });
}

export function ConvertToNumber(value: string | Number): number {
    if (isNumber(value)) {
        return value as number;
    }

    let localValue = String(value);
    if (localValue) {
        localValue = localValue.replace(/[^\d.-]/g, '');
        return Number(localValue);
    }
}

export function ConvertToNumberWithDecimal(value: string | Number): number {
    if (isNumber(value)) {
        return value as number;
    }
}
