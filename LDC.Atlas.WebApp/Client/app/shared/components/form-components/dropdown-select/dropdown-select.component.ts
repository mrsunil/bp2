import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatAutocompleteSelectedEvent, MatSelectChange } from '@angular/material';
import { UtilService } from '../../../services/util.service';
import { FormComponentBaseComponent } from '../form-component-base/form-component-base.component';

@Component({
    selector: 'atlas-dropdown-select',
    templateUrl: './dropdown-select.component.html',
    styleUrls: ['./dropdown-select.component.scss'],
})

export class DropdownSelectComponent extends FormComponentBaseComponent {

    @Input() options: any[] = [];
    @Input() selectProperties: string[] = null;
    @Input() displayProperty: string = null;
    @Input() isAutocompleteActivated: boolean;
    @Input() hint: string;
    @Input() multiselect: boolean;
    @Input() hasIcon: boolean = false;
    @Output() readonly optionSelected = new EventEmitter<any>();
    @Output() readonly panelOpened = new EventEmitter<boolean>();
    @Output() readonly onBlankSelected = new EventEmitter();
    panelSize: number = 344;

    constructor(protected utils: UtilService) {
        super(utils);
    }

    onOptionSelected(selected: MatAutocompleteSelectedEvent) {
        this.optionSelected.emit(selected.option.value);
    }

    onSelectionChanged(selected: MatSelectChange) {
        this.optionSelected.emit(selected.value);
    }

    onBlur() {
        if (typeof this.fieldControl.value === 'string' && this.displayProperty) {
            const selectedValue = this.options
                .find((item) => item[this.displayProperty] === this.fieldControl.value);
            if (selectedValue && selectedValue !== this.fieldControl.value) {
                this.fieldControl.setValue(selectedValue);
                this.optionSelected.emit(selectedValue);
            }
            if (this.fieldControl.value.toString().trim() == "") {
                this.onBlankSelected.emit();
            }
        }
    }

    generateDisplay(item: any): string {
        if (!item) {
            return '';
        }

        if (typeof item === 'string') {
            return item;
        }

        return this.displayProperty ? item[this.displayProperty] : item;
    }

    generateSelect(item: any): string {

        let display = '';
        if (this.selectProperties) {
            if (item) {
                const selectPropLength = this.selectProperties.length;
                for (let index = 0; index < selectPropLength; index++) {
                    display += item[this.selectProperties[index]];
                    if (index < selectPropLength - 1) {
                        display += ' | ';
                    }
                }
            }
        } else {
            display = item;
        }

        return display;
    }

    onOpenedChanged(isPanelOpened: boolean) {
        this.panelOpened.emit(isPanelOpened);
    }
}
