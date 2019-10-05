import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AgGridCheckboxComponent } from './ag-grid-checkbox.component';


describe('AgGridCheckboxComponent', () => {
    let component: AgGridCheckboxComponent;
    let fixture: ComponentFixture<AgGridCheckboxComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [AgGridCheckboxComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AgGridCheckboxComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    //   it('should create', () => {
    //     expect(component).toBeTruthy();
    //   });
});
