import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BankInformationComponent } from './bank-information.component';

describe('BankInformationComponent', () => {
  let component: BankInformationComponent;
  let fixture: ComponentFixture<BankInformationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BankInformationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BankInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
