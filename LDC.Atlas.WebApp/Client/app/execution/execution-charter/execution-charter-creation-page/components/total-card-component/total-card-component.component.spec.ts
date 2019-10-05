import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TotalCardComponent } from './total-card-component.component';


describe('TotalCardComponent', () => {
    let component: TotalCardComponent;
    let fixture: ComponentFixture<TotalCardComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [TotalCardComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TotalCardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });


});
