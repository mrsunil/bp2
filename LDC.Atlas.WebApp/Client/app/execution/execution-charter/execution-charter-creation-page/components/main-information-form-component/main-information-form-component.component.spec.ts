import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MainInformationFormComponent } from './main-information-form-component.component';


describe('MainInformationFormComponent', () => {
    let component: MainInformationFormComponent;
    let fixture: ComponentFixture<MainInformationFormComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [MainInformationFormComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(MainInformationFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });


});
