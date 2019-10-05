import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectMultipleAutocompleteComponent } from './select-multiple-autocomplete.component';

describe('SelectMultipleAutocompleteComponent', () => {
  let component: SelectMultipleAutocompleteComponent;
  let fixture: ComponentFixture<SelectMultipleAutocompleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectMultipleAutocompleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectMultipleAutocompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

});
