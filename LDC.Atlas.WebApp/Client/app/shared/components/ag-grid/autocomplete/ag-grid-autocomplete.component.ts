import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { AgRendererComponent } from 'ag-grid-angular';
import { IAfterGuiAttachedParams } from 'ag-grid-community';
import { inDropdownListValidator } from './../../../directives/autocomplete-dropdown.directive';
import { UtilService } from './../../../services/util.service';
import { DropdownSelectComponent } from './../../form-components/dropdown-select/dropdown-select.component';

@Component({
    selector: 'atlas-ag-grid-autocomplete',
    templateUrl: './ag-grid-autocomplete.component.html',
    styleUrls: ['./ag-grid-autocomplete.component.scss'],
})
export class AgGridAutocompleteComponent extends DropdownSelectComponent implements AgRendererComponent, OnInit {

    constructor(protected utilService: UtilService) {
        super(utilService);
    }

    isSelectedValue: boolean;
    valueProperty: string;
    codeProperty: string;
    descriptionProperty: string;
    displayProperty: string;
    displayCode = false;
    colId: string;

    formControl = new FormControl();
    companyId: string;
    options: any[];
    filteredOptions: any[];
    isRequiredField: boolean = false;

    onClickRefreshList = false;

    protected params: any;
    filterContextualSearchFunction: ((value: any, options: any[], rowData: any) => any[]);
    filter: string;

    ngOnInit() {
    }

    agInit(params: any): void {
        this.params = params;

        if (typeof params.isRequired === 'boolean') {
            this.isRequiredField = params.isRequired;
        }
        if (typeof params.isRequired === 'function') {
            const requiredFunc = params.isRequired;
            this.isRequiredField = requiredFunc(params);
        }

        this.options = params.options;
        this.valueProperty = params.valueProperty;
        this.codeProperty = params.codeProperty;
        this.displayProperty = params.displayProperty;
        this.descriptionProperty = params.descriptionProperty ? params.descriptionProperty : params.displayProperty;
        this.displayCode = params.displayCode ? params.displayCode : false;
        this.formControl.patchValue(this.params.data[this.params.colDef.field]);
        this.filterContextualSearchFunction = params.filterContextualSearchFunction;
        this.onValueChanged(this.formControl.value);

        if (!this.params.context.gridEditable) {
            this.formControl.disable();
        }
        if (this.params.colDef.cellRendererParams &&
            this.params.colDef.cellRendererParams.editable) {
            this.formControl.enable();
        }

        this.formControl.valueChanges.subscribe((input) => {
            this.onValueChanged(input);
            this.params.colDef.onCellValueChanged(this.params);
        });

        // Do not remove this code - even if error is not displayed, it is needed for the component behavior
        const validators = [inDropdownListValidator(this.options, this.valueProperty, true)];
        if (this.isRequired) {
            validators.push(Validators.required);
        }
        this.formControl.setValidators(Validators.compose(
            validators,
        ));
    }

    onValueChanged(input: any) {
        if (!input && input !== '') {
            input = this.filter;
        }
        // adding this code so that the contextual search filter options and autocomplete filter options remain in sink
        if (this.filterContextualSearchFunction) {
            this.options = this.filterContextualSearchFunction(this.formControl.value, this.options, this.params.data);
        }
        if (this.formControl.disabled) {
            return;
        }

        this.filteredOptions = this.getFilteredList(input);

        if (this.valueProperty && this.options && input) {
            let selected;
            if (this.codeProperty && this.codeProperty !== this.valueProperty) {
                selected = this.options.find((option) =>
                    option[this.codeProperty].toString().toLowerCase() === input.toString().toLowerCase());
            } else if (this.displayProperty && this.displayProperty !== this.valueProperty) {
                selected = this.options.find((option) =>
                    option[this.displayProperty].toString().toLowerCase() === input.toString().toLowerCase());
            }
            if (selected && selected[this.valueProperty] !== this.formControl.value) {
                this.formControl.setValue(selected[this.valueProperty]);
                return;
            }
        }

        if (this.formControl.valid) {
            this.params.data[this.params.colDef.field] = this.formControl.value;
        } else {
            this.params.data[this.params.colDef.field] = null;
        }
    }

    getFilteredList(input = null) {
        if (!input) {
            input = this.formControl.value;
        }

        const properties = [];
        if (this.codeProperty) {
            properties.push(this.codeProperty);
        }
        if (this.displayProperty) {
            properties.push(this.displayProperty);
        }
        return this.utilService.filterListforAutocomplete(
            this.displayFn(input),
            this.options,
            properties,
            this.valueProperty,
        );
    }

    onFocusOut() {
        this.filter = this.formControl.value;
        if (this.filteredOptions.length === 1 && this.options.length !== 1 && (this.isRequired || this.formControl.value)
            && this.filteredOptions[0][this.valueProperty] !== this.formControl.value) {
            // If there is only one option possible, select it
            this.formControl.setValue(this.filteredOptions[0][this.valueProperty]);
        }
        if (!this.formControl.valid) {
            this.params.data[this.params.colDef.field] = null;
            this.params.data.isDirty = true;
            this.formControl.patchValue(null);
        }
    }

    afterGuiAttached(params?: IAfterGuiAttachedParams): void {
    }

    refresh(params: any): boolean {
        return false;
    }

    selectionChanged(event: any): void {
        if (!event.option) { return; }
        const object = event.option.value;
    }

    displayFn(value: any) {
        if (!value && value !== 0) {
            return '';
        }
        const object = this.valueProperty ? this.options.find((option) => option[this.valueProperty] === value) : null;
        value = typeof value !== 'string' && this.displayProperty ? value[this.displayProperty] : value;
        if (object && this.displayCode && this.codeProperty) {
            return object[this.codeProperty];
        }
        return this.displayProperty && object ? object[this.displayProperty] : value;
    }

    onInputClicked() {
        // removed because it was causing issue. Might be added again in Wave1
        // if (this.onClickRefreshList) {
        //     this.filteredOptions = this.options;
        // }
    }
}
