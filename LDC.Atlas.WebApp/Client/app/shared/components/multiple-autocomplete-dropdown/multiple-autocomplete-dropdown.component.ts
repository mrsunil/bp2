import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatSelectChange } from '@angular/material';
import { UtilService } from '../../services/util.service';
import { FormComponentBaseComponent } from '../form-components/form-component-base/form-component-base.component';

@Component({
    selector: 'atlas-multiple-autocomplete-dropdown',
    templateUrl: './multiple-autocomplete-dropdown.component.html',
    styleUrls: ['./multiple-autocomplete-dropdown.component.scss'],
})

export class MultipleAutocompleteDropdownComponent extends FormComponentBaseComponent implements OnInit {
    @Input() options: any[] = [];
    @Input() allSelected: boolean = true;
    @Input() selectedOptions: any[] = [];
    @Input() allOptionsElement: any;
    @Input() displayCode = true; // if the codeProperty should be displayed with the displayProperty
    @Input() filterProperty: string;
    @Input() codeProperty: string;
    @Input() displayProperty: string; // property on which we'll be sorting the displayed array
    @Input() placeholder: string;
    @Input() placeholderFilter: string;
    @Input() elementName: string;
    @Input() fieldCtrl: FormControl = new FormControl('', [Validators.required]);

    @Output() readonly selectionChangedEvent = new EventEmitter<any>();

    filteredOptions: Array<{ element: any, hide: boolean }>;  // options filtered that is displayed to the user

    formCtrl: FormControl = new FormControl();

    displayAll: boolean = true; // if false, hide button "All" (used while filtering)

    size: number = 0;
    isLoading = true;

    constructor(protected utils: UtilService) {
        super(utils);
    }

    ngOnInit() {
        this.size = this.options ? this.options.length : 0;
        this.displayAll = !(this.size === 0);

        if (this.allSelected && this.options) {
            this.selectedOptions = this.options.map((o) => o);
        } else if (!this.selectedOptions) {
            this.selectedOptions = [];
        }
        this.initForm();
        this.isLoading = false;
    }

    // Called from parent component if the options are changed by the parent
    optionsChanged() {
        this.size = this.options ? this.options.length : 0;
        this.displayAll = !(this.size === 0);
        if (this.allSelected) {
            this.selectedOptions = this.options.map((o) => o);
        } else if (this.selectedOptions) {
            this.selectedOptions = this.selectedOptions.filter((selectedoption) => {
                return this.options.find((option) => option[this.codeProperty] === selectedoption[this.codeProperty]
                    && (!this.displayProperty || option[this.displayProperty] === selectedoption[this.displayProperty])) ? true : false;
            });
            if (this.fieldCtrl) {
                this.fieldCtrl.patchValue(this.selectedOptions);
                this.fieldCtrl.updateValueAndValidity();
            }
        } else {
            this.selectedOptions = [];
        }
        this.initSelected();
        this.initAutocomplete();
        const fakeEvent = new MatSelectChange(null, null);
        this.selectionChanged(fakeEvent);
    }

    initForm() {
        this.initSelected();
        this.initAutocomplete();
    }

    initSelected() {
        if (this.allSelected && this.options) {
            this.selectedOptions = this.options.map((o) => o);
            if (this.displayAll) {
                this.selectedOptions.push(this.allOptionsElement);
            }
        }
        if (this.fieldCtrl) {
            this.fieldCtrl.patchValue(this.selectedOptions);
        }
    }

    initAutocomplete() {
        if (this.options) {
            this.filteredOptions = this.options.map((option) => ({ element: option, hide: false }));
            this.sortFilteredOptions();
        }
    }

    sortFilteredOptions() {
        this.filteredOptions = this.filteredOptions.sort((obj1, obj2) => {
            if (obj1.element[this.codeProperty] < obj2.element[this.codeProperty]) {
                return -1;
            }
            if (obj1.element[this.codeProperty] > obj2.element[this.codeProperty]) {
                return 1;
            }
            return 0;
        });
    }

    getFormCtrl(): FormControl {
        return this.fieldCtrl;
    }

    resetSelected() {
        this.selectedOptions = this.allSelected ? this.options.map((o) => o) : [];
    }

    resetComponent() {
        this.allSelected = true;
        this.displayAll = !(this.options.length === 0);
        this.selectedOptions = this.options.map((o) => o);
        if (this.displayAll) {
            this.selectedOptions.push(this.allOptionsElement);
        }
        this.fieldCtrl.patchValue(this.selectedOptions);
        this.filteredOptions = this.options.map((option) => ({ element: option, hide: false }));
        this.sortFilteredOptions();
        this.filteredOptions = this.filteredOptions
            .filter((de) => de.element[this.codeProperty] !== this.allOptionsElement[this.codeProperty]);
    }

    getSelectedOptions(): any[] {
        this.selectedOptions = this.selectedOptions.sort((obj1, obj2) => {
            if (obj1[this.codeProperty] < obj2[this.codeProperty]) {
                return -1;
            }
            if (obj1[this.codeProperty] > obj2[this.codeProperty]) {
                return 1;
            }
            return 0;
        });
        return this.selectedOptions;
    }

    getOptions(dep: any[]): any[] {
        return dep;
    }

    // click on button 'all'
    toggleAll() {
        if (this.allSelected) {
            this.selectedOptions = [];
            this.fieldCtrl.patchValue([]);
            this.allSelected = false;
        } else {
            this.selectedOptions = this.options.map((o) => o);
            this.selectedOptions.push(this.allOptionsElement);
            this.fieldCtrl.patchValue(this.selectedOptions);
            this.allSelected = true;
        }
        this.filteredOptions = this.options
            .map((option) => ({ element: option, hide: false }));
        this.sortFilteredOptions();
        this.selectionChangedEvent.emit(this.selectedOptions);
    }

    // click of any option other than 'all'
    selectionChanged(event: MatSelectChange): void { // react to select even in the dropdown
        let isEmpty = false;
        if (event) {
            const optionsWithoutAll = this.fieldCtrl.value && this.allOptionsElement ? this.fieldCtrl.value.filter(
                (de) => de[this.codeProperty] !== this.allOptionsElement[this.codeProperty]) : [];
            this.selectedOptions = optionsWithoutAll;
            if (this.selectedOptions.length === this.size) {
                this.allSelected = true;
                if (this.displayAll) {
                    this.selectedOptions.push(this.allOptionsElement);
                }
            } else {
                this.allSelected = false;
                if (this.selectedOptions.length === 0) {
                    isEmpty = true;
                }
            }
            this.fieldCtrl.patchValue(this.selectedOptions);
        }
        this.selectionChangedEvent.emit(this.selectedOptions);
    }

    // autocomplete function
    onSearchChange(event): void {
        this.displayAll = event && this.options.length > 0 ? false : true;
        this.filteredOptions = this.options
            .map((option) => ({
                element: option,
                hide: !((this.displayProperty && option[this.displayProperty].toUpperCase().startsWith(event.toUpperCase()))
                    || option[this.codeProperty].toUpperCase().startsWith(event.toUpperCase())),
            }));
        this.sortFilteredOptions();
    }

    displayFn(): string {
        let res: string;
        let sortedArray: any[];
        const propertyToOrder = this.displayProperty ? this.displayProperty : this.codeProperty;
        if (this.fieldCtrl.value) {
            if (this.fieldCtrl.value.length > 1) {
                sortedArray = this.fieldCtrl.value;
                sortedArray = sortedArray.sort((obj1, obj2) => {
                    if (obj1[propertyToOrder] < obj2[propertyToOrder]) {
                        return -1;
                    }
                    if (obj1[propertyToOrder] > obj2[propertyToOrder]) {
                        return 1;
                    }
                    return 0;
                });
                res = (sortedArray ? sortedArray[0][propertyToOrder] : '');
                if (!sortedArray.includes(this.allOptionsElement)) {
                    const num = sortedArray.length - 1;
                    if (sortedArray.length === 2) {
                        res = res.concat(' and ', num.toString(), ' other');
                    } else if (sortedArray.length > 2) {
                        res = res.concat(' and ', num.toString(), ' others');
                    }
                } else {
                    res = this.allOptionsElement[this.displayProperty];
                }
            } else {
                const el = this.fieldCtrl.value[0];
                if (el) {
                    res = this.displayProperty ? el[this.displayProperty] : el[this.codeProperty];
                }
            }
        } else {
            res = this.placeholderFilter;
        }
        return res;
    }
}
