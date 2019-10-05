import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { SelectMultipleAutocompleteComponent } from '../../../../../../shared/components/select-multiple-autocomplete/select-multiple-autocomplete.component';
import { FilterValueGenerateEndMonth } from '../../../../../../shared/entities/filter-value-generate-end-month.entity';

@Component({
    selector: 'atlas-cost-type-dropdown',
    templateUrl: './cost-type-dropdown.component.html',
    styleUrls: ['./cost-type-dropdown.component.scss'],
})
export class CostTypeDropdownComponent extends SelectMultipleAutocompleteComponent implements OnInit {

    @Input() objects: FilterValueGenerateEndMonth[] = [];
    @Input() allSelected = true;
    @Output() readonly costTypeSelectionChanged = new EventEmitter();
    formCtrl = new FormControl();
    valueProperty: string = 'value';
    displayProperty: string = 'desc';
    allFilterOption: FilterValueGenerateEndMonth = {
        value: 0,
        desc: 'All',
    };
    valueIds: number[] = [];
    constructor(private route: ActivatedRoute) { super(); }

    ngOnInit() {
        if (this.allSelected) {
            this.selectedValues = this.objects.map((o) => o);
        }
        this.initForm();
        this.initCostType(true);
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
        this.costTypeSelectionChanged.emit();
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
    setSelectedValue(allSelected: boolean, costTypes: FilterValueGenerateEndMonth[]) {
        if (costTypes) {
            this.allSelected = allSelected;
            this.selectedValues = costTypes;
            this.setValue();
            this.filteredObjects = this.selectedValues;
        }
    }

    resetSelected() {
        this.selectedValues = this.allSelected ? this.objects.map((o) => o) : [];
    }

    initCostType(isLoad = false) {
        if (isLoad) {
            this.selectedValues = this.objects;
        }
        this.setData();
    }
}
