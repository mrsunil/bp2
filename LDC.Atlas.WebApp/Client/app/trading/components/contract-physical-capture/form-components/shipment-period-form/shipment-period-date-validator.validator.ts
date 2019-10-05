import { FormGroup, ValidatorFn } from '@angular/forms';
import { AbstractControlService } from '../../../../../shared/services/common/abstract-control.service';
import { isDateTwoBeforeDateOne } from '../../../../../shared/validators/date-validators.validator';
export function dateAfter(dateComparedFormControlName: string, referenceFormControlName: string, allowEqual: boolean = true): ValidatorFn {
    return (abstractForm: FormGroup): { [key: string]: any } => {
        const comparedDate = abstractForm.get(dateComparedFormControlName);
        const reference = abstractForm.get(referenceFormControlName);
        const res = isDateTwoBeforeDateOne(comparedDate.value, reference.value, true);
        if (!res) {
            AbstractControlService.addError(comparedDate, { key: 'isBeforeDate', value: true });
            return { isBeforeDate: true };
        } else {
            AbstractControlService.removeError(comparedDate, { key: 'isBeforeDate', value: true });
        }

        return null;
    };
}
