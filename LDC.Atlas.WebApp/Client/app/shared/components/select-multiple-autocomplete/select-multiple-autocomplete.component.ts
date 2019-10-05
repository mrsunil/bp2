import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '../../../../../node_modules/@angular/forms';
import { MatAutocompleteSelectedEvent, MatAutocompleteTrigger } from '../../../../../node_modules/@angular/material';

@Component({
    selector: 'atlas-select-multiple-autocomplete',
    templateUrl: './select-multiple-autocomplete.component.html',
    styleUrls: ['./select-multiple-autocomplete.component.scss'],
})
export class SelectMultipleAutocompleteComponent implements OnInit {

    @ViewChild('input', { read: MatAutocompleteTrigger }) autocompleteTrigger: MatAutocompleteTrigger;

    @Input() objects: any[] = [];
    @Input() displayCode = false;
    @Input() valueProperty: string;
    @Input() codeProperty: string;
    @Input() displayProperty: string;
    @Input() placeholder: string;
    @Input() selectedValues: any[] = [];
    @Input() controller: FormControl;

    filteredObjects: any[] = [];

    formGroup: FormGroup;
    formCtrl: FormControl;

    constructor() { }

    ngOnInit() {
        this.initForm();
    }

    initForm() {
        this.formCtrl = new FormControl();
        this.formGroup = new FormGroup({
            formCtrl: this.formCtrl,
        });
        this.setData();
    }

    setData() {
        this.initSelected();
        if (this.formCtrl !== undefined) {
            this.setValue();
            this.initAutocomplete();
        }
    }

    initSelected() {
        if (this.controller) {
            this.selectedValues = this.controller.value ? this.controller.value : [];
        } else {
            this.selectedValues = this.selectedValues
                .filter((v) => this.objects.map(
                    (o) => this.getProperty(o, this.valueProperty)).includes(this.getProperty(v, this.valueProperty)))
                .map((v) => this.objects.filter(
                    (o) => this.getProperty(o, this.valueProperty) === this.getProperty(v, this.valueProperty))[0]);
        }
    }

    initAutocomplete() {
        this.filteredObjects = this.objects;
        this.formCtrl.valueChanges.subscribe((value) => {
            let valueAsString: string = '';
            if (value) {
                valueAsString = typeof (value) === 'string' || !this.displayProperty ?
                    value.toLowerCase() : value[this.valueProperty];
            }
            this.filteredObjects = this.objects.filter((o: any) =>
                this.getProperty(o, this.displayProperty).toLowerCase().startsWith(valueAsString));
        });
    }

    selectionChanged(event: MatAutocompleteSelectedEvent): void {
        if (!event.option) { return; }
        const object = event.option.value;

        if (!this.isSelected(object)) {
            this.selectedValues.push(object);
            this.updateController();
        } else {
            this.deselect(object);
        }
    }

    updateController() {
        if (this.controller) {
            this.controller.setValue(this.selectedValues);
        }
    }

    isSelected(object: any) {
        return this.selectedValues.includes(object);
    }

    clearValueEvent() {
        this.formCtrl.setValue('');
    }

    setValueEvent(event, autocomplete) {
        if (!autocomplete.options.map((option) => option._element.nativeElement).includes(event.relatedTarget)) {
            this.setValue();
        }
    }

    setValue() {
        const value = this.selectedValues.map((s) => this.getDisplayValue(s)).sort().join(' ; ');
        this.formCtrl.setValue(value);
    }

    openAutocompletePanel() {
        this.autocompleteTrigger.openPanel();
    }

    deselect(value) {
        const index = this.selectedValues.indexOf(value);
        this.selectedValues.splice(index, 1);
        this.updateController();
    }

    getDisplayValue(object: any) {
        if (this.displayCode) {
            return this.getProperty(object, this.codeProperty) + ' | ' + this.getProperty(object, this.displayProperty);
        }
        return this.getProperty(object, this.displayProperty);
    }

    getProperty(object: any, property: string) {
        if (property) {
            return object[property];
        }
        return object;
    }
}
