import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MaterialModule } from '../../../shared/material.module';
import { ListAndSearchContextualMenuComponent } from './list-and-search-contextual-menu.component';

describe('ListAndSearchContextualMenuComponent', () => {
    let component: ListAndSearchContextualMenuComponent;
    let fixture: ComponentFixture<ListAndSearchContextualMenuComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ListAndSearchContextualMenuComponent],
            imports: [
                BrowserModule,
                MaterialModule,
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ListAndSearchContextualMenuComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
