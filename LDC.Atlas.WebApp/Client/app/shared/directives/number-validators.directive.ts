import { ValidatorFn } from "@angular/forms/src/directives/validators";
import { AbstractControl } from "@angular/forms/src/model";

export function isPositive(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
        if (Number(control.value) < 0) {
            return { isPositiveError: true };
        }
        return null;
    };
}

export function isDifferencePositive(calculatedValue: number): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
        if (Number(calculatedValue) - Number(control.value) < 0) {
            return { isDifferencePositiveError: true };
        }
        return null;
    };
}

export function isGreatherThanZero(): ValidatorFn {
	return (control: AbstractControl): { [key: string]: any } => {
		let value = control.value;
		if (!isNaN(value) && control.value != '' && (Number(value) <= 0)) {
			return { "isGreatherThanZeroError" : true };
		}
		return null;
	};
}

