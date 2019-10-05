import { Component, Input } from '@angular/core';
import { MatAutocompleteSelectedEvent } from '@angular/material';
import { SelectMultipleAutocompleteComponent } from '../../../../../../shared/components/select-multiple-autocomplete/select-multiple-autocomplete.component';
import { Department } from '../../../../../../shared/entities/department.entity';

@Component({
    selector: 'atlas-department-dropdown',
    templateUrl: './department-dropdown.component.html',
    styleUrls: ['./department-dropdown.component.scss'],
})
export class DepartmentDropdownComponent extends SelectMultipleAutocompleteComponent {

    @Input() objects: Department[] = [];
    @Input() allSelected = true;
    displayCode = true;
    valueProperty: string = 'departmentId';
    codeProperty: string = 'departmentCode';
    displayProperty: string = 'description';
    placeholder: string = 'Department';
    allDepartmentsOption: Department = {
        departmentId: 0,
        departmentCode: 'All',
        description: 'All',
        profitCenterId: 0,
        companyId: 0,
        companyCode: null,
    };

    constructor() {
        super();
    }

    ngOnInit() {
        if (this.allSelected) {
            this.selectedValues = this.objects.map((o) => o);
        }
        this.initForm();
    }

    selectionChanged(event: MatAutocompleteSelectedEvent): void {
        if (!event.option) { return; }
        const object = event.option.value;

        if (object === this.allDepartmentsOption) {
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
    }

    setValue() {
        if (this.allSelected) {
            this.formCtrl.setValue(this.allDepartmentsOption.description);
        } else {
            this.formCtrl.setValue(this.selectedValues.map((s) => s[this.displayProperty].trim()).sort().join(', '));
        }
    }

    resetSelected() {
        this.selectedValues = this.allSelected ? this.objects.map((o) => o) : [];
    }
}
