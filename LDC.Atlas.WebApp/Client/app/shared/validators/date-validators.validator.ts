
import { ValidatorFn } from '@angular/forms/src/directives/validators';
import { AbstractControl } from '@angular/forms/src/model';
import * as _moment from 'moment';
import { Moment } from 'moment/moment';
import { AbstractControlService } from '../services/common/abstract-control.service';
const moment = _moment;

export function isBeforeDate(dateCompared: Moment, allowNull: boolean = false, onlyMonth: boolean = false): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
        if (allowNull && (control.value == null || control.value === '')) { return null; }
        const controlValue: Moment = moment(control.value);
        const isBefore = onlyMonth ? controlValue.isBefore(dateCompared, 'month') : controlValue.isSameOrBefore(dateCompared);
        return (isBefore) ? null : { isDateValid: true };
    };
}

export function dateInInterval(dateMin: Date, dateMax: Date, allowNull: boolean = true): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
        return getErrorIfDateNotInInterval(control, dateMin, dateMax, allowNull);
    };
}

export function getErrorIfDateNotInInterval(control, dateMin: Date, dateMax: Date, allowNull: boolean = true) {
    if (allowNull && !control.value) {
        return { isDateValid: true };
    } else if (!allowNull && !control.value) {
        return null;
    }
    if (dateMin) {
        dateMin.setHours(0, 0, 0, 0);
    }
    if (dateMax != null) {
        dateMax.setHours(0, 0, 0, 0);
    }
    const momentMin: Moment = moment(dateMin);
    const momentMax: Moment = moment(dateMax);

    const isBefore = control.value.isBefore(momentMin);
    if (isBefore) {
        return { isDateValid: true };
    }

    const isAfter = control.value.isAfter(momentMax);
    if (isAfter) {
        return { isDateValid: true };
    }

    return null;
}

export function invoiceDateValidation(invoiceDate: Date, maxDate: Moment): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
        const invoiceMoment: Moment = moment(invoiceDate);
        if (invoiceMoment.isBefore(maxDate.format('LL'))) {
            return { isDateBeforeValid: true };
        }
    };
}

export function agreementDateValidation(agreementDate: Moment, currentDate: Moment): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
        if (agreementDate.isAfter(currentDate)) {
            return { isDateAfterCurrentDateValid: true };
        }
    };
}

export function documentDateValidation(invoiceDate: Date, maxDate: Moment): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
        const invoiceMoment: Moment = moment(invoiceDate);
        if (invoiceMoment.isBefore(maxDate.format('LL'))) {
            return { isDateBeforeValid: true };
        }
        if (invoiceMoment.isAfter(moment())) {
            return { isDateAfterValid: true };
        }
    };
}

export function numberOfDaysValidation(referenceFormControlName: Date, dateComparedFormControlName: Date) {
    if (referenceFormControlName && dateComparedFormControlName) {
        const timeDiff = Math.abs((referenceFormControlName as Date).valueOf() - (dateComparedFormControlName as Date).valueOf());
        const dayDifference = Math.ceil(timeDiff / (1000 * 3600 * 24));
        return dayDifference;
    }
}
export function isDateTwoBeforeDateOne(dateOne: Date, dateTwo: Date, allowEqual: boolean = false) {
    if (dateOne && dateTwo) {
        const dateOneValue = new Date(dateOne).toDateString();
        const dateTwoValue = new Date(dateTwo).toDateString();
        let result = new Date(dateTwoValue) < new Date(dateOneValue) ? true : null;
        if (!result && allowEqual) {
            result = (dateOneValue === dateTwoValue);
        }
        return result;
    }
}

export function isAfterDate(contractDate: Moment): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
        if (contractDate && control.value) {
            const controlValue = new Date(new Date(control.value).toDateString());
            const compareToValue = new Date(new Date(contractDate.toDate()).toDateString());
            const isDateAfter = controlValue > compareToValue ? true : false;
            if (isDateAfter) {
                return { isDateAfterValid: true };
            } else {
                return null;
            }
        } else {
            return null;
        }
    };
}

export function isDateBeforeControlDate(contractDate: Moment): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
        if (contractDate && control.value) {
            const controlValue = new Date(new Date(control.value).toDateString());
            const compareToValue = new Date(new Date(contractDate.toDate()).toDateString());
            const isDateBeforeControl = controlValue < compareToValue ? true : false;
            if (isDateBeforeControl) {
                return { isBeforeDateValid: true };
            } else {
                return null;
            }
        } else {
            return null;
        }
    };
}

export function isValidDateForSql(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
        const controlValue: Moment = moment(control.value);
        if (control.value !== undefined && control.value !== '') {
            const oldestValidDate = new Date();
            oldestValidDate.setFullYear(1753, 1, 1);
            oldestValidDate.setHours(0, 0, 0);
            const isDateBefore = controlValue.isBefore(moment(oldestValidDate));
            if (isDateBefore) {
                return { invalidDateForSql: true };
            } else {
                return null;
            }
        } else {
            return null;
        }
    };
}

export function dateTwoBeforeDateOne(dateOne: Date, dateTwo: Date, allowEqual: boolean = false): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
        if (isDateTwoBeforeDateOne(dateOne, dateTwo, allowEqual)) {
            return { isDateBeforeValid: true };
        }
    };
}

export function isGreaterThanNinetyDays(referenceFormControlName: string, dateComparedFormControlName: string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
        const comparedDate = control.get(dateComparedFormControlName);
        const reference = control.get(referenceFormControlName);
        const numberOfDays = numberOfDaysValidation(reference.value as Date, comparedDate.value as Date);
        if (numberOfDays > 90) {
            AbstractControlService.addError(comparedDate, { key: 'isGreaterThanNinetyDays', value: true });
            return { isGreaterThanNinetyDays: true };
        } else {
            AbstractControlService.removeError(comparedDate, { key: 'isGreaterThanNinetyDays', value: true });
        }
        return null;
    };
}
