import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ExecutionCharterEditPageComponent } from './execution-charter-edit-page.component';


describe('ExecutionCharterEditPageComponent', () => {
    let component: ExecutionCharterEditPageComponent;
    let fixture: ComponentFixture<ExecutionCharterEditPageComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ExecutionCharterEditPageComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ExecutionCharterEditPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });


});
