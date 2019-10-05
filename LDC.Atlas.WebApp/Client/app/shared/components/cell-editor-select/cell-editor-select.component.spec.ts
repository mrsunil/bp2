import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserModule } from '@angular/platform-browser';
import { CellEditorSelectComponent } from './cell-editor-select.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { MaterialModule } from "../../material.module";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('CellEditorSelectComponent', () => {
    let component: CellEditorSelectComponent;
    let fixture: ComponentFixture<CellEditorSelectComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CellEditorSelectComponent],
            imports: [
                BrowserModule,
                BrowserAnimationsModule,
                MaterialModule,
                FormsModule
            ],
            schemas: [
                CUSTOM_ELEMENTS_SCHEMA
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CellEditorSelectComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
