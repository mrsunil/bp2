import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilesListContextualMenuComponent } from './profiles-list-contextual-menu.component';
import { BrowserModule } from '@angular/platform-browser';
import { MaterialModule } from '../../../../../shared/material.module';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('ProfilesListContextualMenuComponent', () => {
	let component: ProfilesListContextualMenuComponent;
	let fixture: ComponentFixture<ProfilesListContextualMenuComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ProfilesListContextualMenuComponent],
			imports: [
				BrowserModule,
				MaterialModule,
			],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ProfilesListContextualMenuComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
