import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { AgRendererComponent } from 'ag-grid-angular';
import { IAfterGuiAttachedParams } from 'ag-grid-community';
import { MultipleAutocompleteDropdownComponent } from '../../multiple-autocomplete-dropdown/multiple-autocomplete-dropdown.component';

@Component({
    selector: 'atlas-ag-grid-multiple-autocomplete',
    templateUrl: './ag-grid-multiple-autocomplete.component.html',
    styleUrls: ['./ag-grid-multiple-autocomplete.component.scss'],
})
export class AgGridMultipleAutocompleteComponent implements AgRendererComponent {

    @ViewChild('multipleAutocompleteDropdownComponent') multipleAutocompleteDropdownComponent: MultipleAutocompleteDropdownComponent;

    protected params: any;

    options: any[];
    allSelected: boolean;
    selectedOptions: any[];
    allOptionsElement: any;
    displayCode: boolean; // if the codeProperty should be displayed with the displayProperty
    filterProperty: string;
    codeProperty: string;
    displayProperty: string; // property on which we'll be sorting the displayed array
    placeholder: string;
    placeholderFilter: string;
    elementName: string;

    colId: string;
    formControl: FormControl;

    isRequiredField: boolean = false;

    constructor() {
    }

    refresh(params: any): boolean {
        return true;
    }
    afterGuiAttached?(params?: IAfterGuiAttachedParams): void {
    }

    agInit(params: any): void {
        this.params = params;

        this.formControl = new FormControl('', [Validators.required]);
        this.isRequiredField = params.isRequired;
        this.options = params.options;
        this.selectedOptions = params.selectedOptions;
        if (!params.selectedOptions && this.params.data[this.params.colDef.field]) {
            this.selectedOptions = this.params.data[this.params.colDef.field];
            this.allSelected = false;
        } else {
            this.allSelected = params.allSelected;
            this.selectedOptions = (this.allSelected) ? params.options : null;
        }
        this.allOptionsElement = params.allOptionsElement;
        this.displayCode = params.displayCode;
        this.codeProperty = params.codeProperty;
        this.displayProperty = params.displayProperty;
        this.placeholder = params.placeholder;
        this.placeholderFilter = params.placeholderFilter;
        this.elementName = params.elementName;
        this.formControl.patchValue(this.selectedOptions);
        this.onValueChanged(this.formControl.value);
    }

    onValueChanged(input: any) {
        this.params.data[this.params.colDef.field] = (this.formControl.valid) ? this.formControl.value : null;

    }
}
