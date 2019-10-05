import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MaterialModule } from '../shared/material.module';
import { CustomDateAdapter } from '../shared/services/customDateAdapter';
import { ATLAS_DATE_FORMATS, SharedModule } from '../shared/shared.module';
import { PreAccountingRoutingModule } from './pre-accounting.route';

@NgModule({
    imports: [
        CommonModule,
        MaterialModule,
        PreAccountingRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
    ],
    declarations: [
    ],
    providers: [CustomDateAdapter,
        { provide: MAT_DATE_LOCALE, useValue: 'en' },
        { provide: DateAdapter, useClass: CustomDateAdapter },
        { provide: MAT_DATE_FORMATS, useValue: ATLAS_DATE_FORMATS },
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PreAccountingModule { }
