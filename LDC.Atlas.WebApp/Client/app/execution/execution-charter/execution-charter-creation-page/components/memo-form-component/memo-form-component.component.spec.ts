import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MemoFormComponent } from './memo-form-component.component';


describe('MemoFormComponent', () => {
    let component: MemoFormComponent;
    let fixture: ComponentFixture<MemoFormComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [MemoFormComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(MemoFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });


});
