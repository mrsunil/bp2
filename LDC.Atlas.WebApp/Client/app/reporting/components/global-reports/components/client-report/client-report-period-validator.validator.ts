import { FormGroup, ValidatorFn } from '@angular/forms';
import * as _moment from 'moment';
const moment = _moment;

export function beforeFromDate(fromFormControlName: string, toFormControlName: string, allowEqual: boolean = true): ValidatorFn {
    return (abstractForm: FormGroup): { [key: string]: any } => {
        const fromFormControl = abstractForm.get(fromFormControlName);
        const toFormControl = abstractForm.get(toFormControlName);
        if (fromFormControl && fromFormControl.value
            && toFormControl && toFormControl.value) {
            const isDatebeforeFrom = fromFormControl.value.format('YYYY-MM-DD') > toFormControl.value.format('YYYY-MM-DD')
                ? true : false;
            if (isDatebeforeFrom) {
                toFormControl.setErrors({ isClientDateBeforeValid: true });
                return { isClientDateBeforeValid: true };
            } else {
                toFormControl.setErrors(null);
                return null;
            }
        }
        return null;
    };
}
