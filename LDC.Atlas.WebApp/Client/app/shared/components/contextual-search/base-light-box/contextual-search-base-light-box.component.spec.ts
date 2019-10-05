import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { CompanyManagerService } from '../../../../core/services/company-manager.service';
import { DateConverterService } from '../../../../shared/services/date-converter.service';
import { MaterialModule } from '../../../material.module';
import { MasterdataService } from '../../../services/http-services/masterdata.service';
import { UiService } from '../../../services/ui.service';
import { GridConfigurationProviderService } from './../../../services/grid-configuration-provider.service';
import { UtilService } from './../../../services/util.service';
import { ContextualSearchBaseLightBoxComponent } from './contextual-search-base-light-box.component';

describe('ContextualSearchBaseLightBoxComponent', () => {
    let component: ContextualSearchBaseLightBoxComponent;
    let fixture: ComponentFixture<ContextualSearchBaseLightBoxComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ContextualSearchBaseLightBoxComponent],
            imports: [
                BrowserModule,
                MaterialModule,
                RouterTestingModule,
                HttpClientTestingModule,
            ],
            providers: [
                { provide: MatDialogRef, useValue: {} },
                { provide: MAT_DIALOG_DATA, useValue: { gridId: 'counterpartyList', rowData: of([]) } },
                CompanyManagerService,
                GridConfigurationProviderService,
                UiService,
                UtilService,
                DateConverterService,
                MasterdataService,
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ContextualSearchBaseLightBoxComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
