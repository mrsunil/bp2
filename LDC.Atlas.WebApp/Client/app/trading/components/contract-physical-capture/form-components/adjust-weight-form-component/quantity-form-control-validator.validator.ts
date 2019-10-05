import { ValidatorFn } from '@angular/forms';
import { AbstractControl } from "@angular/forms/src/model";



export function maximumValue(maxvalue: number): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
        const minValue = Number(String(control.value).replace(/,/gi, ''));
        if (minValue > maxvalue) {
            return { maximumValue: true };
        }
        return null;
    };
}

