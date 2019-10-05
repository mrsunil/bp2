import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CellEditorNumericComponent } from './cell-editor-numeric.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MaterialModule } from '../../material.module';
import { BrowserModule } from '@angular/platform-browser';
import { TextMaskModule } from 'angular2-text-mask';
import { SharedModule } from '../../shared.module';
import { FormsModule } from '@angular/forms';

describe('CellEditorNumericComponent', () => {
	let component: CellEditorNumericComponent;
	let fixture: ComponentFixture<CellEditorNumericComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [CellEditorNumericComponent],
			imports: [
				BrowserModule,
				MaterialModule,
				FormsModule,
				TextMaskModule
			],
			schemas: [
				CUSTOM_ELEMENTS_SCHEMA
			]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(CellEditorNumericComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
