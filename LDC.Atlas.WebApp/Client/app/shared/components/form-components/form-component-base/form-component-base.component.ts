import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { UtilService } from '../../../services/util.service';

@Component({
    selector: 'atlas-form-component-base',
    templateUrl: './form-component-base.component.html',
    styleUrls: ['./form-component-base.component.scss'],
})
export class FormComponentBaseComponent implements OnInit {
    private _isEditable: boolean;

    @Input() set isEditable(value: boolean) {
        this._isEditable = value;
        this.setViewMode();
    }

    get isEditable(): boolean {
        return this._isEditable;
    }

    @Input() fieldControl = new FormControl();
    @Input() errorMap: Map<string, string>;
    @Input() label: string;
    @Input() id: string | number;

    constructor(protected utils: UtilService) { }

    ngOnInit() { }

    getErrorMessage(): string {
        if (this.errorMap) {
            for (const [error, errorMessage] of Array.from(this.errorMap.entries())) {
                if (this.fieldControl.hasError(error)) {
                    return errorMessage;
                }
            }
        }
    }

    setViewMode() {
        this.isEditable ? this.fieldControl.enable() : this.fieldControl.disable();
    }

    isRequired() {
        return this.utils.isRequired(this.fieldControl);
    }
}
