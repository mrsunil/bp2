import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CopyPrivilegesDialogComponent } from './copy-privileges-dialog.component';

describe('CopyPrivilegesDialogComponent', () => {
  let component: CopyPrivilegesDialogComponent;
  let fixture: ComponentFixture<CopyPrivilegesDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CopyPrivilegesDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CopyPrivilegesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
});
