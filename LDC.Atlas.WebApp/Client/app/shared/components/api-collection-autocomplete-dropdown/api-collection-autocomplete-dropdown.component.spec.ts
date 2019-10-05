import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ApiCollectionAutocompleteDropdownComponent } from './api-collection-autocomplete-dropdown.component';

describe('ApiCollectionAutocompleteDropdownComponent', () => {
    let component: ApiCollectionAutocompleteDropdownComponent;
    let fixture: ComponentFixture<ApiCollectionAutocompleteDropdownComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ApiCollectionAutocompleteDropdownComponent],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ApiCollectionAutocompleteDropdownComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
});
