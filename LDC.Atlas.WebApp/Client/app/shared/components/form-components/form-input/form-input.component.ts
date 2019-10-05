import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UtilService } from '../../../services/util.service';
import { FormComponentBaseComponent } from '../form-component-base/form-component-base.component';

@Component({
    selector: 'atlas-form-input',
    templateUrl: './form-input.component.html',
    styleUrls: ['./form-input.component.scss'],
})

export class FormInputComponent extends FormComponentBaseComponent {

    @Input() defaultValue: string;
    @Input() hint: string;
    @Input() hasWarning: boolean;
    @Input() warningMessage: string;
    @Input() textMask: any;

    // tslint:disable-next-line:no-output-named-after-standard-event
    @Output() readonly blur = new EventEmitter();

    constructor(protected utils: UtilService) {
        super(utils);
    }

    onBlur(event) {
        this.blur.emit(event);
    }

    setViewMode(): void {
        if (this.isEditable) {
            if (this.fieldControl.value === '') {
                this.fieldControl.setValue('');
            }
            this.fieldControl.enable();
        } else {
            if (!this.fieldControl.value) {
                this.fieldControl.setValue('');
            }
            this.fieldControl.disable();
        }
    }
}
