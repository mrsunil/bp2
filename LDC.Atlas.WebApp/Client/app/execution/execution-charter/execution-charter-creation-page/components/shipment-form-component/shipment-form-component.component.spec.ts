import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ShipmentFormComponent } from './shipment-form-component.component';


describe('ShipmentFormComponent', () => {
    let component: ShipmentFormComponent;
    let fixture: ComponentFixture<ShipmentFormComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ShipmentFormComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ShipmentFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });


});
