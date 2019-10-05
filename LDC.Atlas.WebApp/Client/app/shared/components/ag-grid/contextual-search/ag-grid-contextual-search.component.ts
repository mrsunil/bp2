import { Component, EventEmitter, Output } from '@angular/core';
import { Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import * as moment from 'moment';
import { of } from 'rxjs';
import { SnackbarService } from '../../../services/snackbar.service';
import { UtilService } from '../../../services/util.service';
import { inDropdownListValidator } from './../../../directives/autocomplete-dropdown.directive';
import { ContextualSearchBaseLightBoxComponent } from './../../contextual-search/base-light-box/contextual-search-base-light-box.component';
import { AgGridAutocompleteComponent } from './../autocomplete/ag-grid-autocomplete.component';

@Component({
    selector: 'atlas-ag-grid-contextual-search',
    templateUrl: './ag-grid-contextual-search.component.html',
    styleUrls: ['./ag-grid-contextual-search.component.scss'],
})
export class AgGridContextualSearchComponent extends AgGridAutocompleteComponent implements ICellRendererAngularComp {

    lightBoxTitle: string;
    dataLoader: any;
    gridId: any;

    maxOptionsDisplayed: number = 7;
    showContextualSearchIcon: boolean = true;

    filterContextualSearchFunction: ((value: any, options: any[], rowData: any) => any[]);
    errorMap: Map<string, string>;
    isDisabledField = false;

    @Output() readonly optionSelected = new EventEmitter<any>();
    @Output() readonly filteredOptionSet = new EventEmitter<any>();

    constructor(
        protected utils: UtilService,
        protected dialog: MatDialog,
        protected snackbarService: SnackbarService,
    ) {
        super(utils);
    }

    agInit(params: any): void {
        this.params = params;

        this.initAutocompleteVariables(params);
        this.initContextualSearchVariables(params);
        if (!this.params.context.gridEditable) {
            this.formControl.disable();
        } else {
            const validators = [inDropdownListValidator(this.options, this.valueProperty, true)];
            if (this.isRequired) {
                validators.push(Validators.required);
            }
            this.formControl.setValidators(Validators.compose(
                validators,
            ));
        }
    }

    initAutocompleteVariables(params): void {
        this.isRequired = params.isRequired;
        this.options = params.options;
        this.filteredOptions = params.options;
        this.valueProperty = params.valueProperty;
        this.codeProperty = params.codeProperty;
        this.displayProperty = params.displayProperty;
        this.descriptionProperty = params.descriptionProperty ? params.descriptionProperty : params.displayProperty;
        this.displayCode = params.displayCode ? params.displayCode : false;
        this.errorMap = params.errorMap;
        this.formControl.patchValue(this.params.data[this.params.colDef.field]);

        this.formControl.valueChanges.subscribe((input) => {
            this.params.oldValue = this.params.data[this.params.colDef.field]; // Needed for cellValueChanged on the grid
            this.onValueChanged(input);
            if (this.params.colDef.onCellValueChanged) {
                this.params.newValue = input; // Needed for cellValueChanged on the grid
                this.params.colDef.onCellValueChanged(this.params);
            }
        });
    }

    isDisabled(): boolean {
        let isDisabledField = this.isDisabledField;
        const context = this.params.context;
        const cellRendererParams = this.params.colDef.cellRendererParams;
        if (context.gridEditable !== undefined && context.gridEditable !== null) {
            isDisabledField = !context.gridEditable;
        }
        if (cellRendererParams) {
            if (cellRendererParams.disabled && typeof cellRendererParams.disabled === 'function') {
                isDisabledField = cellRendererParams.disabled();
            } else if (cellRendererParams.editable !== undefined && cellRendererParams.editable !== null) {
                isDisabledField = !cellRendererParams.editable;
            }
        }
        this.isDisabledField = isDisabledField; // we use a variable to avoid calling the function 5 times in the html

        if (!this.formControl.disabled && isDisabledField) {
            this.formControl.disable();
        } else if (this.formControl.disabled && !isDisabledField) {
            this.formControl.enable();
        }
        return isDisabledField;
    }

    initContextualSearchVariables(params): void {
        this.gridId = params.gridId;
        this.dataLoader = params.dataLoader;
        this.showContextualSearchIcon = params.showContextualSearchIcon;
        this.filterContextualSearchFunction = params.filterContextualSearchFunction;
    }

    onExploreClicked(event) {
        if (!this.gridId) {
            this.snackbarService.throwErrorSnackBar('This contextual grid is not configured');
            return;
        }
        const searchLightBox = this.openLightbox();
        searchLightBox.afterClosed().subscribe((answer) => {
            if (answer) {
                this.params.data[this.params.colDef.field] = this.displayProperty ?
                    answer[this.displayProperty] : answer;
                this.formControl.setValue(this.valueProperty ? answer[this.valueProperty] : answer);
            }
        });
        if (event) {
            event.stopPropagation();
        }
    }

    isPopup(): boolean {
        return true;
    }

    openLightbox() {
        return this.dialog.open(ContextualSearchBaseLightBoxComponent, {
            data: {
                lightboxTitle: this.lightBoxTitle,
                gridId: this.gridId,
                rowData$: of(this.getFilteredList(this.filter)),
            },
            width: '80%',
            height: '80%',
        });
    }

    getFilteredList(input = null) {
        if (!input && input !== '') {
            input = this.formControl.value;
        }

        if (this.filterContextualSearchFunction) {
            return this.filterContextualSearchFunction(input, this.options, this.params.data);
        } else {
            const properties = [];
            if (this.codeProperty) {
                properties.push(this.codeProperty);
            }
            if (this.displayProperty) {
                properties.push(this.displayProperty);
            }
            const options = this.utilService.filterListforAutocomplete(
                this.displayFn(input),
                this.options,
                properties,
                this.valueProperty,
            );

            // This code should not be in this generic component
            if (options) {
                options.forEach((value) => {
                    if (value.contractDate) {
                        value.contractDate = this.dateFormatter(value.contractDate);
                    }
                    if (value.authorizedOn) {
                        value.authorizedOn = this.dateFormatter(value.authorizedOn);
                    }
                });
            }
            return options;
        }
    }

    getLimitedNumberOfOptions(): any[] {
        let limitedNumberOfOptions = [];
        if (this.filteredOptions && this.showContextualSearchIcon) {
            limitedNumberOfOptions = this.filteredOptions.slice(0, this.maxOptionsDisplayed);
        }
        return limitedNumberOfOptions;
    }

    getNumberOfOptionsNotDisplayed(): number {
        if (this.filteredOptions) {
            const notDisplayedOptions = this.filteredOptions.length - this.getLimitedNumberOfOptions().length;
            return notDisplayedOptions > 0 ? notDisplayedOptions : 0;
        }
    }

    getCurrentValue(): string {
        const currentValue = this.formControl.value;
        return this.displayFn(currentValue);
    }

    getDisplayedValue(item: any) {
        if (!this.codeProperty && !this.valueProperty && !this.descriptionProperty) {
            return item;
        }
        if (this.codeProperty && this.valueProperty && this.descriptionProperty) {
            return item[this.codeProperty] + ' | ' + item[this.descriptionProperty];
        }
        return this.codeProperty ? item[this.codeProperty] : item[this.descriptionProperty];
    }
    dateFormatter(params) {
        const momentToFormat: moment.Moment = moment(params);
        const result = params ? momentToFormat.format('DD MMM YYYY').toUpperCase() : '';
        return result;
    }

    onInputClicked() {
        if (this.filterContextualSearchFunction) {
            this.filteredOptions = this.filterContextualSearchFunction(this.formControl.value, this.options, this.params.data);
            this.filteredOptionSet.emit(this.filteredOptions);
        }
    }

    getDescription() {
        const currentValue = this.formControl.value;
        if (this.displayProperty && this.descriptionProperty && this.displayProperty !== this.descriptionProperty && currentValue) {
            const object = this.valueProperty ? this.options.find((option) => option[this.valueProperty] === currentValue) : currentValue;
            if (object) {
                return object[this.descriptionProperty];
            }
        }
        return '';
    }
}
