import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { AgGridModule } from 'ag-grid-angular';
import { MaterialModule } from '../shared/material.module';
import { ATLAS_DATE_FORMATS, SharedModule } from '../shared/shared.module';
import { BackgroundInterfaceErrorsComponent } from './components/background-interface-errors/background-interface-errors.component';
import { HiddenRoutingModule } from './hidden.route';
import { CustomFormInputsComponent } from './ux-components/custom-form-inputs/custom-form-inputs.component';
import { UxComponentsListComponent } from './ux-components/ux-components-list/ux-components-list.component';
import { ListSearchDialogComponent } from './ux-components/ux-components-list/ux-dialog-list-search.component';
import { DialogComponent } from './ux-components/ux-components-list/ux-dialog-text.component';
import { UxLayoutTemplateComponent } from './ux-components/ux-layout-template/ux-layout-template.component';

@NgModule({
    imports: [
        CommonModule,
        MaterialModule,
        SharedModule,
        AgGridModule.withComponents([]),
        HiddenRoutingModule,
        HttpClientModule,

    ],
    declarations: [
        UxComponentsListComponent,
        UxLayoutTemplateComponent,
        DialogComponent,
        CustomFormInputsComponent,
        ListSearchDialogComponent,
        BackgroundInterfaceErrorsComponent,
    ],
    entryComponents: [DialogComponent, ListSearchDialogComponent],
    providers: [
        { provide: MAT_DATE_LOCALE, useValue: 'en' },
        { provide: DateAdapter, useClass: MomentDateAdapter },
        { provide: MAT_DATE_FORMATS, useValue: ATLAS_DATE_FORMATS },
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HiddenModule { }
