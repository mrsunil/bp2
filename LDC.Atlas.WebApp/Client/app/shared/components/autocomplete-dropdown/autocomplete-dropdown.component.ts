import { Component, OnInit, Input, ViewChild, EventEmitter, Output } from "@angular/core";
import { MatAutocomplete } from "@angular/material"
import { Observable } from "rxjs";

@Component({
	selector: "atr-autocomplete-dropdown",
	exportAs: "autocompleteDropdown",
	templateUrl: "./autocomplete-dropdown.component.html",
	styleUrls: ["./autocomplete-dropdown.component.scss"]
})
export class AutocompleteDropdownComponent implements OnInit {

	@Input() list: Observable<any>;
	@Input() displayValue: Boolean = true;
	@Input() valueProperty: string;
	@Input() displayProperty: string;
	@ViewChild(MatAutocomplete) autocomplete: MatAutocomplete;
	@Output() selected = new EventEmitter<any>();

	ngOnInit() {
		if (!this.displayProperty)
			this.displayProperty = "viewValue";

		if (!this.valueProperty)
			this.valueProperty = "value";
	}

	onOptionSelected(e) {
		this.selected.emit(e);
	}
}
