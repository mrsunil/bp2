import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IntercoTradeDialogComponent } from './interco-trade-dialog.component';

describe('IntercoTradeDialogComponent', () => {
  let component: IntercoTradeDialogComponent;
  let fixture: ComponentFixture<IntercoTradeDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IntercoTradeDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IntercoTradeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
