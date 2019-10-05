import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BackgroundInterfaceErrorsComponent } from './background-interface-errors.component';

describe('BackgroundInterfaceErrorsComponent', () => {
  let component: BackgroundInterfaceErrorsComponent;
  let fixture: ComponentFixture<BackgroundInterfaceErrorsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BackgroundInterfaceErrorsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BackgroundInterfaceErrorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
