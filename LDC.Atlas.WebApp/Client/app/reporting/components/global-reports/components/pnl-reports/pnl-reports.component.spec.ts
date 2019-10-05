import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PnlReportsComponent } from './pnl-reports.component';

describe('PnlReportsComponent', () => {
  let component: PnlReportsComponent;
  let fixture: ComponentFixture<PnlReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PnlReportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PnlReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
