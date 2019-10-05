import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CellEditorDatePickerComponent } from './cell-editor-date-picker.component';
import { DateAdapter } from '@angular/material';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('CellEditorDatePickerComponent', () => {
	let component: StandardCellEditorDatePicker;
	let fixture: ComponentFixture<StandardCellEditorDatePicker>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [StandardCellEditorDatePicker],
			schemas: [
				CUSTOM_ELEMENTS_SCHEMA
			]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(StandardCellEditorDatePicker);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

@Component({
	template: '<atr-cell-editor-date-picker></atr-cell-editor-date-picker>'
})
class StandardCellEditorDatePicker {

}
