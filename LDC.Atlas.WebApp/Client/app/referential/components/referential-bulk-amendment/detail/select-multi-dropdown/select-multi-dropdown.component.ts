import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { FormComponentBaseComponent } from '../../../../../shared/components/form-components/form-component-base/form-component-base.component';
import { UtilService } from '../../../../../shared/services/util.service';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent, MatSelectChange } from '@angular/material';

@Component({
    selector: 'atlas-select-multi-dropdown',
    templateUrl: './select-multi-dropdown.component.html',
    styleUrls: ['./select-multi-dropdown.component.scss']
})
export class SelectMultiDropdownComponent extends FormComponentBaseComponent implements ICellRendererAngularComp {

    isAutocompleteActivated: boolean = true;
    isSelectedValue: boolean;
    valueProperty: string;
    codeProperty: string;
    descriptionProperty: string;
    displayProperty: string;
    displayCode = false;
    colId: string;

    companyId: string;
    options: any[];
    filteredOptions: any[];
    isRequiredField: boolean = false;
    multiselect: boolean = false;
    onClickRefreshList = false;
    @Output() readonly optionSelected = new EventEmitter<any>();
    protected params: any;
    agInit(params: any): void {
        this.params = params;
        this.options = params.options;
        this.valueProperty = params.valueProperty;
        this.codeProperty = params.codeProperty;
        this.displayProperty = params.displayProperty;
        this.multiselect = params.multiselect,
            this.descriptionProperty = params.descriptionProperty ? params.descriptionProperty : params.displayProperty;
        this.displayCode = params.displayCode ? params.displayCode : false;
    }

    constructor(protected utils: UtilService) {
        super(utils);
    }
    refresh(params: any): boolean {
        return false;
    }

    onOptionSelected(selected: MatAutocompleteSelectedEvent) {
        this.optionSelected.emit(selected.option.value);

    }

    onSelectionChanged(selected: MatSelectChange) {
        this.optionSelected.emit(selected.value);
        this.fieldControl.setValue(selected.value);
        this.params.data[this.params.colDef.field] = this.fieldControl.value;

    }

    onBlur() {
        if (typeof this.fieldControl.value === 'string' && this.displayProperty) {
            const selectedValue = this.options
                .find((item) => item[this.displayProperty] === this.fieldControl.value);
            if (selectedValue && selectedValue !== this.fieldControl.value) {
                this.fieldControl.setValue(selectedValue);
                this.optionSelected.emit(selectedValue);
            }
        }
    }

    generateSelect(value: any) {
        if (!value) {
            return '';
        }
        const object = this.valueProperty ? this.options.find((option) => option[this.valueProperty] === value) : null;
        value = typeof value !== 'string' && this.displayProperty ? value[this.displayProperty] : value;
        if (object && this.displayCode && this.codeProperty) {
            return object[this.codeProperty];
        }
        return this.displayProperty && object ? object[this.displayProperty] : value;
    }
}

