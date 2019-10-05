import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { ErrorPageComponent } from './error-page.component';
import { BrowserModule } from '@angular/platform-browser';
import { MaterialModule } from '../../material.module';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { Observable, of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';

describe('ErrorPageComponent', () => {
  let component: ErrorPageComponent;
  let fixture: ComponentFixture<ErrorPageComponent>;

	let routeStub = {
		params: of(
			{
				company: "s4",
				status: "500"
			}
		),
		snapshot: {
			data: {},
			paramMap: convertToParamMap(
				{
					company: "s4",
					status: "500"
				}
			)
		}
	};

  beforeEach(async(() => {
    TestBed.configureTestingModule({
		declarations: [ErrorPageComponent],
		imports: [
			BrowserModule,
			MaterialModule,
			RouterTestingModule,
			//SharedModule
		],
		providers: [
			{ provide: ActivatedRoute, useValue: routeStub }
		],
		schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
