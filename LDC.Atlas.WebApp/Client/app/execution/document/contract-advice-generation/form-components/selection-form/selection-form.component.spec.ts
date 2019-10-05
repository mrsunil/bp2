import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { CompanyManagerService } from '../../../../../core/services/company-manager.service';
import { MaterialModule } from '../../../../../shared/material.module';
import { ContractAdviceGenerationSelectionFormComponent } from './selection-form.component';

describe('ContractAdviceGenerationSelectionFormComponent', () => {
    let component: ContractAdviceGenerationSelectionFormComponent;
    let fixture: ComponentFixture<ContractAdviceGenerationSelectionFormComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ContractAdviceGenerationSelectionFormComponent],
            imports: [
                BrowserAnimationsModule,
                MaterialModule,
                ReactiveFormsModule,
                HttpClientTestingModule,
                RouterTestingModule,
            ],
            providers: [
                CompanyManagerService,
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],

        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ContractAdviceGenerationSelectionFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
