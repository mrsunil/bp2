import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AdditionalInformationFormComponent } from './additional-information-form-component.component';


describe('AdditionalInformationFormComponent', () => {
    let component: AdditionalInformationFormComponent;
    let fixture: ComponentFixture<AdditionalInformationFormComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [AdditionalInformationFormComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AdditionalInformationFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

});
