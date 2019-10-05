import { ValidatorFn } from '@angular/forms/src/directives/validators';
import { AbstractControl } from '@angular/forms/src/model';
import * as _moment from 'moment';
import { Moment } from 'moment/moment';
import { cropYearValidation } from '../../trading/Library/trading-businessrules';
const moment = _moment;

export function isCropYearValid(contractDate: Moment): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
        let error = null;
        let result = 1;
        if (control.value && contractDate && control.valid) {
            const reg = new RegExp(/[0-9]{4}/g);
            const years = String(control.value).match(reg);
            result = cropYearValidation(years, contractDate);
        }
        if (result < 1) {
            switch (result) {
                case 0:
                    error = { isFirstYearGreater: true };
                    break;
                case -1:
                    error = { isYearOutOfRange: true };
                    break;
            }
        }
        return error;
    };
}
