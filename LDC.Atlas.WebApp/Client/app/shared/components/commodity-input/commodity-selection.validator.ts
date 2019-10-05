import { FormGroup, ValidatorFn } from '@angular/forms';

export function commoditySelectionValidator(cmyPart1CtrlName: string,
    cmyPart2CtrlName: string,
    cmyPart3CtrlName: string,
    cmyPart4CtrlName: string,
    cmyPart5CtrlName: string): ValidatorFn {
    return (abstractForm: FormGroup): { [key: string]: any } => {
        const cmyPart1Ctrl = abstractForm.get(cmyPart1CtrlName);
        const cmyPart2Ctrl = abstractForm.get(cmyPart2CtrlName);
        const cmyPart3Ctrl = abstractForm.get(cmyPart3CtrlName);
        const cmyPart4Ctrl = abstractForm.get(cmyPart4CtrlName);
        const cmyPart5Ctrl = abstractForm.get(cmyPart5CtrlName);

        if (cmyPart1Ctrl.valid && cmyPart2Ctrl.valid && cmyPart3Ctrl.valid && cmyPart4Ctrl.valid && cmyPart5Ctrl.valid) {
            return null;
        }
        return { commodityInvalid: true };
    };
}
