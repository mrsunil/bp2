import { AbstractControl, ValidationErrors } from '@angular/forms';

export class AbstractControlService {

    constructor() { }

    static addError(control: AbstractControl, err: { key: string, value: boolean }) {
        let controlErrors: ValidationErrors = control.errors;
        if (!controlErrors || !(err.key in controlErrors)) {
            if (!controlErrors) {
                controlErrors = {};
            }
            controlErrors[err.key] = true;
            control.setErrors(controlErrors);
        }
    }

    static removeError(control: AbstractControl, err: { key: string, value: boolean }) {
        const controlErrors: ValidationErrors = control.errors;
        const newErrorList: ValidationErrors = {};
        if (controlErrors) {
            for (const key of Object.keys(controlErrors)) {
                if (key !== err.key) {
                    newErrorList[key] = true;
                }
            }
            control.setErrors(newErrorList);
        }
    }
}
