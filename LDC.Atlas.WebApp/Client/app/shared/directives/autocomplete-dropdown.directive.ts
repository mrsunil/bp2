import { ValidatorFn } from '@angular/forms/src/directives/validators';
import { AbstractControl } from '@angular/forms/src/model';

export function inDropdownListValidator(
    list: any[] = [],
    propertyToCompare: string = 'value',
    allowEmpty: boolean = false,
    caseSensitive: boolean = true): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
        if (allowEmpty && control.value && control.value.length === 0) {
            return null;
        }
        const inList = list.find((x) => {
            if ((typeof control.value === 'string') || !control.value) {
                return isEqual(x[propertyToCompare], control.value, caseSensitive) ||
                    isEqual(x, control.value, caseSensitive);
            }

            return isEqual(x[propertyToCompare], control.value, caseSensitive)
                || isEqual(x, control.value, caseSensitive)
                || isEqual(x[propertyToCompare], control.value[propertyToCompare], caseSensitive);
        });
        return (inList || !control.value) ? null : { inDropdownList: true };
    };
}

function isEqual(text1: string, text2: string, caseSensitive: boolean): boolean {
    if (text1 && text2 && !caseSensitive) {
        return text1.toLocaleLowerCase() === text2.toLocaleLowerCase();
    }
    return text1 === text2;
}
