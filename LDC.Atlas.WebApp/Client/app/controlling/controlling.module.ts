import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { AgGridModule } from 'ag-grid-angular';
import { MaterialModule } from '../shared/material.module';
import { ATLAS_DATE_FORMATS, SharedModule } from '../shared/shared.module';
import { ControllingRoutingModule } from './controlling.route';

@NgModule({
    imports: [
        CommonModule,
        AgGridModule.withComponents([]),
        ControllingRoutingModule,
        MaterialModule,
        SharedModule,
    ],
    providers: [
        { provide: MAT_DATE_LOCALE, useValue: 'en' },
        { provide: DateAdapter, useClass: MomentDateAdapter },
        { provide: MAT_DATE_FORMATS, useValue: ATLAS_DATE_FORMATS },
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ControllingModule { }
