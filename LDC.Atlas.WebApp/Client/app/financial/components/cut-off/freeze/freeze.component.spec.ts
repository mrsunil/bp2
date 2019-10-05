import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { CompanyManagerService } from '../../../../core/services/company-manager.service';
import { MaterialModule } from '../../../../shared/material.module';
import { SharedModule } from '../../../../shared/shared.module';
import { FreezeComponent } from './freeze.component';


describe('FreezeComponent', () => {
    let component: FreezeComponent;
    let fixture: ComponentFixture<FreezeComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [FreezeComponent],
            imports: [
                BrowserModule,
                BrowserAnimationsModule,
                MaterialModule,
                RouterTestingModule,
                HttpClientTestingModule,
                SharedModule,
            ],
            providers: [
                CompanyManagerService,
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(FreezeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
