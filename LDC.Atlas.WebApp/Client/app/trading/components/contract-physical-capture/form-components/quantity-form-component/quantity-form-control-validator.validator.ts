import { FormGroup, ValidatorFn } from '@angular/forms';

export function biggerValue(biggerFormControlName: string, smallerFormControlName: string, allowEqual: boolean = true): ValidatorFn {
    return (abstractForm: FormGroup): { [key: string]: any } => {
        const maxFormControl = abstractForm.get(biggerFormControlName);
        const minFormControl = abstractForm.get(smallerFormControlName);

        if (maxFormControl && maxFormControl.value
            && minFormControl && minFormControl.value) {
            const minValue = Number(String(minFormControl.value).replace(/,/gi, ''));
            const maxValue = Number(String(maxFormControl.value).replace(/,/gi, ''));

            let res = (maxValue > minValue);
            if (allowEqual) {
                res = res || (maxValue === minValue);
            }

            if (!res) {
                maxFormControl.setErrors({ inferiorValue: true });
                return { inferiorValue: true };
            }

        }
        return null;
    };
}
