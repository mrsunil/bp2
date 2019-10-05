import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormControl, ValidatorFn, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { of } from 'rxjs';
import { ContextualSearchMultipleSelectLightBoxComponent } from '../../../contextual-search/multiple-select-light-box/contextual-search-multiple-select-light-box.component';
import { ColumnConfigurationProperties } from './../../../../entities/grid-column-configuration.entity';
import { UtilService } from './../../../../services/util.service';
import { FormComponentBaseComponent } from './../../form-component-base/form-component-base.component';

@Component({
    selector: 'atlas-contextual-search-multiple-autocomplete-select',
    templateUrl: './contextual-search-multiple-autocomplete-select.component.html',
    styleUrls: ['./contextual-search-multiple-autocomplete-select.component.scss'],
})
export class ContextualSearchMultipleAutocompleteSelectComponent extends FormComponentBaseComponent implements OnInit {

    @Input() options: any[] = [];
    @Input() allSelected: boolean = true;
    @Input() selectedOptions: any[] = [];
    @Input() allOptionsElement: any;
    @Input() displayCode = true; // if the codeProperty should be displayed with the displayProperty, and after selection
    @Input() filterProperty: string;
    @Input() codeProperty: string;
    @Input() valueProperty: string;
    @Input() displayProperty: string; // property on which we'll be sorting the displayed array
    @Input() placeholder: string;
    @Input() placeholderFilter: string;
    @Input() elementName: string;
    @Input() isFieldRequired = true;

    @Output() readonly selectionChangedEvent = new EventEmitter<any>();

    filteredOptions: any[];  // options filtered that is displayed to the user

    fieldControl: FormControl = new FormControl('', [Validators.required]);
    filterControl: FormControl = new FormControl();

    displayAll: boolean = true; // if false, hide button "All" (used while filtering)

    size: number = 0;
    filteredOptionsSize: number = 0;
    isLoading = true;
    fakeOption = {};

    constructor(
        protected utils: UtilService,
        protected dialog: MatDialog,
    ) {
        super(utils);
    }

    ngOnInit() {
        this.size = this.options ? this.options.length : 0;
        if (this.isFieldRequired) {
            this.fieldControl.setValidators([this.validatorRequiredCustom()]);
        }
        this.initForm();
        this.isLoading = false;
    }

    initForm() {
        if (this.allSelected) {
            this.selectedOptions = this.options;
        }
        if (this.elementName !== 'Document Type') {
            this.setFilteredOptions();
        }
    }

    validatorRequiredCustom(): ValidatorFn {
        return ((control: AbstractControl): { [key: string]: any } => {
            let error = null;
            if (!this.selectedOptions || this.selectedOptions.length === 0) {
                error = { required: true };
            }
            return error;
        }).bind(this);
    }

    setFilteredOptions() {
        // filter the options
        const filterValue = this.filterControl.value ? this.filterControl.value.toUpperCase() : null;
        this.filteredOptions = filterValue ? this.options
            .filter((option) => (this.displayProperty
                && option[this.displayProperty].toUpperCase().startsWith(filterValue))
                || option[this.codeProperty].toUpperCase().startsWith(filterValue)) : this.options;
        this.sortFilteredOptions();
        this.filteredOptionsSize = this.filteredOptions.length;

        // Get only the first 7 options
        this.filteredOptions = this.filteredOptions.slice(0, 7);

        // Set selected
        const filteredOptionsSelected = this.filteredOptions.filter((option) => this.selectedOptions
            .find((selected) => selected[this.valueProperty] === option[this.valueProperty]));
        // check option 'all'
        if (this.displayAll && this.allSelected) {
            filteredOptionsSelected.unshift(this.allOptionsElement);
        }
        const valuesToPatch = this.valueProperty ?
            filteredOptionsSelected.map((option) => option[this.valueProperty]) : filteredOptionsSelected;

        // When the filtered options are not selected BUT there are otpions selected,
        // we need to add a fake value so that the field is not empty
        if (this.selectedOptions && this.selectedOptions.length > 0) {
            valuesToPatch.push(this.fakeOption);
        }
        this.fieldControl.patchValue(valuesToPatch);
    }

    sortFilteredOptions() {
        this.filteredOptions = this.filteredOptions.sort((obj1, obj2) => {
            if (obj1[this.codeProperty] < obj2[this.codeProperty]) {
                return -1;
            }
            if (obj1[this.codeProperty] > obj2[this.codeProperty]) {
                return 1;
            }
            return 0;
        });
    }

    // Called from parent component if the options are changed by the parent
    public optionsChanged() {
        this.size = this.options ? this.options.length : 0;
        this.displayAll = this.filterControl.value ? false : true;
        if (this.allSelected) {
            this.selectedOptions = this.options;
        } else if (this.selectedOptions) {
            this.selectedOptions = this.selectedOptions.filter((selectedoption) => {
                return this.options.find((option) => option[this.valueProperty] === selectedoption[this.valueProperty]) ? true : false;
            });
        } else {
            this.selectedOptions = [];
        }

        this.setFilteredOptions();
        if (this.fieldControl) {
            this.fieldControl.updateValueAndValidity();
        }
        this.selectionChangedEvent.emit(this.selectedOptions);
    }

    resetSelected() {
        this.selectedOptions = [];
        this.setFilteredOptions();
    }

    resetComponent() {
        this.allSelected = true;
        this.displayAll = true;
        this.selectedOptions = this.options; // by default, all are selected
        this.setFilteredOptions();
    }

    // click on button 'all'
    toggleAll() {
        this.allSelected = !this.allSelected;
        this.selectedOptions = this.allSelected ? this.options : [];
        this.setFilteredOptions();
        this.selectionChangedEvent.emit(this.selectedOptions);
    }

    // click of any option other than 'all'
    selectionChanged(value: string, event: Event): void { // react to select even in the dropdown
        if (this.selectedOptions.find((option) => option[this.valueProperty] === value)) {
            // remove the option
            this.selectedOptions = this.selectedOptions.filter((option) => option[this.valueProperty] !== value);
        } else {
            // add the option
            const newOption = this.options.find((option) => option[this.valueProperty] === value);
            this.selectedOptions.push(newOption);
        }
        this.allSelected = this.selectedOptions.length === this.options.length;
        this.setFilteredOptions();
        this.selectionChangedEvent.emit(this.selectedOptions);
        event.preventDefault();
    }

    // autocomplete function
    onSearchChange(event): void {
        this.displayAll = this.filterControl.value ? false : true;
        if (this.allSelected && this.filterControl.value && this.filterControl.value.length > 0) {
            this.allSelected = false;
            this.selectedOptions = [];
        }
        this.setFilteredOptions();
    }

    displayFn(): string {
        let res: string;
        const propertyToOrder = this.displayProperty && !this.displayCode ? this.displayProperty : this.codeProperty;
        if (this.allSelected) {
            res = this.allOptionsElement[propertyToOrder];
        } else if (this.selectedOptions) {
            this.selectedOptions = this.selectedOptions.sort((obj1, obj2) => {
                if (obj1[this.codeProperty] < obj2[this.codeProperty]) {
                    return -1;
                }
                if (obj1[this.codeProperty] > obj2[this.codeProperty]) {
                    return 1;
                }
                return 0;
            });
            if (this.selectedOptions.length > 0) {
                const el = this.selectedOptions[0];
                if (el) {
                    res = el[propertyToOrder];
                }
                if (this.selectedOptions.length > 1) {
                    const num = this.selectedOptions.length - 1;
                    if (this.selectedOptions.length === 2) {
                        res = res.concat(' and ', num.toString(), ' other');
                    } else if (this.selectedOptions.length > 2) {
                        res = res.concat(' and ', num.toString(), ' others');
                    }
                }
            }
        } else {
            res = this.placeholderFilter;
        }
        return res;
    }

    onExploreClicked(event) {
        const searchLightBox = this.openLightbox();
        searchLightBox.afterClosed().subscribe((answer) => {
            if (answer) {
                this.selectedOptions = answer;
                this.setFilteredOptions();
                this.selectionChangedEvent.emit(this.selectedOptions);
            }
        });
        if (event) {
            event.stopPropagation();
        }
    }

    openLightbox() {
        const gridConfig: ColumnConfigurationProperties[] = [
            {
                fieldId: 0,
                gridColumnId: 0,
                fieldName: this.codeProperty,
                friendlyName: this.elementName,
                filterType: null,
                gridType: null,
                optionSet: null,
                isVisible: true,
                isFilterable: false,
                isEditable: false,
                isSortable: false,
                sortOrder: null,
                sortOrderIndex: 0,
                groupName: null,
                isGroup: false,
                isResult: true,
            },
        ];
        if (this.displayProperty) {
            gridConfig.push({
                fieldId: 0,
                gridColumnId: 0,
                fieldName: this.displayProperty,
                friendlyName: '',
                filterType: null,
                gridType: null,
                optionSet: null,
                isVisible: true,
                isFilterable: false,
                isEditable: false,
                isSortable: false,
                sortOrder: null,
                sortOrderIndex: 0,
                groupName: null,
                isGroup: false,
                isResult: true,
            });
        }
        return this.dialog.open(ContextualSearchMultipleSelectLightBoxComponent, {
            data: {
                rowData$: of(this.options.map((option) => {
                    option.isSelected = this.selectedOptions
                        .find((selectedOption) => option[this.valueProperty] === selectedOption[this.valueProperty]) ? true : false;
                    return option;
                })),
                lightboxTitle: '',
                currentFilter: this.filterControl.value,
                gridConfig,
                valueProperty: this.valueProperty,
                codeProperty: this.codeProperty,
                displayProperty: this.displayProperty,
            },
            width: '80%',
            height: '80%',
        });
    }
}
