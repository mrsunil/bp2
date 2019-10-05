import { FormGroup, ValidatorFn } from '@angular/forms';

export function vesselSelectionValidator(cmyPart1CtrlName: string,
    cmyPart2CtrlName: number,
    cmyPart3CtrlName: string): ValidatorFn {
    return (abstractForm: FormGroup): { [key: string]: any } => {
        const cmyPart1Ctrl = abstractForm.get(cmyPart1CtrlName);
        const cmyPart2Ctrl = abstractForm.get(cmyPart2CtrlName.toString());
        const cmyPart3Ctrl = abstractForm.get(cmyPart3CtrlName);

        if (cmyPart1Ctrl.valid && cmyPart2Ctrl.valid && cmyPart3Ctrl.valid) {
            return null;
        }
        return { vesselInvalid: true };
    };
}
