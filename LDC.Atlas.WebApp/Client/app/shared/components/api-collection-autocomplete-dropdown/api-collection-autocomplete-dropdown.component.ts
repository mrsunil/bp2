import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatAutocomplete } from '@angular/material';
import { Observable } from 'rxjs';
import { ApiCollection } from '../../services/common/models';

@Component({
    selector: 'atlas-api-collection-autocomplete-dropdown',
    exportAs: 'apiCollectionAutocompleteDropdown',
    templateUrl: './api-collection-autocomplete-dropdown.component.html',
    styleUrls: ['./api-collection-autocomplete-dropdown.component.scss'],
})
export class ApiCollectionAutocompleteDropdownComponent implements OnInit {

    @Input() apiCollection: Observable<ApiCollection<any>>;
    @Input() displayValue: true;
    @Input() valueProperty: string;
    @Input() displayProperty: string;
    @ViewChild(MatAutocomplete) autocomplete: MatAutocomplete;
    @Output() selected = new EventEmitter<any>();

    ngOnInit() {
        if (!this.displayProperty) {
            this.displayProperty = 'viewValue';
        }

        if (!this.valueProperty) {
            this.valueProperty = 'value';
        }
    }

	onOptionSelected(e) {
        this.selected.emit(e.option.value);
	}

	display(e) {
		return e ? e[this.displayProperty] : e;
	}
}
