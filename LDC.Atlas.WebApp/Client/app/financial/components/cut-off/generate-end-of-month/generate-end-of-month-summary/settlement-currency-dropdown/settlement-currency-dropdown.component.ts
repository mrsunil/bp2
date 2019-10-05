import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatAutocompleteSelectedEvent } from '@angular/material';
import { SelectMultipleAutocompleteComponent } from '../../../../../../shared/components/select-multiple-autocomplete/select-multiple-autocomplete.component';
import { AtlasFormControl } from '../../../../../../shared/entities/atlas-form-control';
import { FilterValueGenerateEndMonth } from '../../../../../../shared/entities/filter-value-generate-end-month.entity';

@Component({
    selector: 'atlas-settlement-currency-dropdown',
    templateUrl: './settlement-currency-dropdown.component.html',
    styleUrls: ['./settlement-currency-dropdown.component.scss'],
})
export class SettlementCurrencyDropdownComponent extends SelectMultipleAutocompleteComponent implements OnInit {

    @Input() objects: FilterValueGenerateEndMonth[] = [];
    @Input() allSelected = true;
    @Output() readonly settlementCurrencySelectionChanged = new EventEmitter();
    formCtrl = new AtlasFormControl('formControl');
    valueProperty: string = 'value';
    displayProperty: string = 'desc';
    allFilterOption: FilterValueGenerateEndMonth = {
        value: 0,
        desc: 'All',
    };
    valueIds: number[] = [];
    constructor() { super(); }

    ngOnInit() {
        if (this.allSelected) {
            this.selectedValues = this.objects.map((o) => o);
        }
        this.initForm();
        this.initSettlementCurrency(true);
    }

    initSettlementCurrency(isLoad = false) {
        if (isLoad) {
            this.selectedValues = this.objects;
        }
        this.setData();
    }

    selectionChanged(event: MatAutocompleteSelectedEvent): void {
        if (!event.option) { return; }
        const object = event.option.value;

        if (object === this.allFilterOption) {
            this.allSelected = !this.allSelected;
            this.resetSelected();
        } else {
            if (!this.isSelected(object)) {
                this.selectedValues.push(object);
            } else {
                this.deselect(object);
            }
            this.allSelected = this.selectedValues.length === this.objects.length;
        }
        this.settlementCurrencySelectionChanged.emit();
    }

    setValue() {
        this.valueIds = [];
        if (this.allSelected) {
            this.formCtrl.setValue(this.allFilterOption.desc);
        } else {
            this.formCtrl.setValue(this.selectedValues.map((s) => s[this.displayProperty].trim()).sort().join(', '));
        }
        for (const val of this.selectedValues) {
            this.valueIds.push(val['value']);
        }
    }

    resetSelected() {
        this.selectedValues = this.allSelected ? this.objects.map((o) => o) : [];
    }

    setSelectedValue(allSelected: boolean, settlementCurrency: FilterValueGenerateEndMonth[]) {
        if (settlementCurrency) {
            this.allSelected = allSelected;
            this.selectedValues = settlementCurrency;
            this.setValue();
            this.filteredObjects = this.selectedValues;
        }
    }
}
