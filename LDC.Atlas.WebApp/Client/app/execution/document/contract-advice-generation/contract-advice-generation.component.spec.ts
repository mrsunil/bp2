import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { CompanyManagerService } from '../../../core/services/company-manager.service';
import { WINDOW } from '../../../shared/entities/window-injection-token';
import { MaterialModule } from '../../../shared/material.module';
import { SecurityService } from '../../../shared/services/security.service';
import { SnackbarService } from '../../../shared/services/snackbar.service';
import { DiscoveryService } from './../../../shared/services/discovery.service';
import { DocumentListComponent } from './../list/document-list.component';
import { ContractAdviceGenerationComponent } from './contract-advice-generation.component';
import { ContractAdviceGenerationSelectionFormComponent } from './form-components/selection-form/selection-form.component';

describe('ContractAdviceGenerationComponent', () => {
    let component: ContractAdviceGenerationComponent;
    let fixture: ComponentFixture<ContractAdviceGenerationComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ContractAdviceGenerationComponent,
                ContractAdviceGenerationSelectionFormComponent,
                DocumentListComponent],
            imports: [
                BrowserAnimationsModule,
                MaterialModule,
                ReactiveFormsModule,
                HttpClientTestingModule,
                RouterTestingModule,
            ],
            providers: [
                SecurityService,
                DiscoveryService,
                [{
                    provide: ActivatedRoute,
                    useValue:
                    {
                        snapshot: {
                            data: {
                                animation: 'documentGeneration',
                                title: 'Document Generation',
                                documentType: 'Contract Advice',
                            },
                        },
                    },
                }],
                CompanyManagerService,
                SnackbarService,
                { provide: WINDOW, useValue: window },
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ContractAdviceGenerationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

});
