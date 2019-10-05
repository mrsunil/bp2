import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InteroStateBannerComponent } from './intero-state-banner.component';

describe('InteroStateBannerComponent', () => {
  let component: InteroStateBannerComponent;
  let fixture: ComponentFixture<InteroStateBannerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InteroStateBannerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InteroStateBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
