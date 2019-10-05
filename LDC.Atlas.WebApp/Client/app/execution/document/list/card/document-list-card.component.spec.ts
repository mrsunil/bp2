import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { CompanyManagerService } from '../../../../core/services/company-manager.service';
import { MaterialModule } from '../../../../shared/material.module';
import { DiscoveryService } from '../../../../shared/services/discovery.service';
import { SnackbarService } from '../../../../shared/services/snackbar.service';
import { DateConverterService } from './../../../../shared/services/date-converter.service';
import { UiService } from './../../../../shared/services/ui.service';
import { DocumentListCardComponent } from './document-list-card.component';

describe('DocumentListCardComponent', () => {
    let component: DocumentListCardComponent;
    let fixture: ComponentFixture<DocumentListCardComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [DocumentListCardComponent],
            imports: [
                BrowserAnimationsModule,
                MaterialModule,
                ReactiveFormsModule,
                HttpClientTestingModule,
                RouterTestingModule,
            ],
            providers: [
                DiscoveryService,
                CompanyManagerService,
                SnackbarService,
                UiService,
                DateConverterService,
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DocumentListCardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
