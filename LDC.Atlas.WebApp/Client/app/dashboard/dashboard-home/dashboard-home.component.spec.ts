import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardHomeComponent } from './dashboard-home.component';
import { MaterialModule } from '../../shared/material.module';

describe('DashboardHomeComponent', () => {
	let component: DashboardHomeComponent;
	let fixture: ComponentFixture<DashboardHomeComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [DashboardHomeComponent],
			imports: [
				MaterialModule
			],
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(DashboardHomeComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should be created', () => {
		expect(component).toBeTruthy();
	});
});
