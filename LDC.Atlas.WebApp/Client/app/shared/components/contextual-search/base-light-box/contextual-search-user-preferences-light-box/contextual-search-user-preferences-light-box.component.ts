import { Component, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Observable } from 'rxjs';
import { CompanyManagerService } from '../../../../../core/services/company-manager.service';
import { ColumnConfigurationProperties } from '../../../../entities/grid-column-configuration.entity';
import { AgGridService } from '../../../../services/ag-grid.service';
import { GridConfigurationProviderService } from '../../../../services/grid-configuration-provider.service';
import { MasterdataService } from '../../../../services/http-services/masterdata.service';
import { ContextualSearchBaseLightBoxComponent } from '../contextual-search-base-light-box.component';
import { UiService } from './../../../../services/ui.service';
import { UtilService } from './../../../../services/util.service';
import { AgGridUserPreferencesComponent } from './../../../ag-grid-user-preferences/ag-grid-user-preferences.component';

@Component({
    selector: 'atlas-contextual-search-user-preferences-light-box',
    templateUrl: './contextual-search-user-preferences-light-box.component.html',
    styleUrls: ['./contextual-search-user-preferences-light-box.component.scss'],
})
export class ContextualSearchUserPreferencesLightBoxComponent extends ContextualSearchBaseLightBoxComponent {
    company: string;
    @ViewChild('userPreferences') userPreferencesComponent: AgGridUserPreferencesComponent;

    constructor(
        public thisDialogRef: MatDialogRef<ContextualSearchBaseLightBoxComponent>,
        @Inject(MAT_DIALOG_DATA) public data: {
            lightboxTitle: string,
            gridId: string,
            rowData$: Observable<any[]>,
            multiselect?: boolean, // not exploited in this one yet
        },
        protected companyManager: CompanyManagerService,
        protected gridConfigurationProvider: GridConfigurationProviderService,
        protected masterdataService: MasterdataService,
        protected uiService: UiService,
        protected utilService: UtilService,
        public gridService: AgGridService,

    ) {
        super(thisDialogRef, data, companyManager, gridConfigurationProvider, masterdataService, uiService, utilService, gridService);
        this.company = this.companyManager.getCurrentCompanyId();
    }

    initColumns(configuration: ColumnConfigurationProperties[]) {
        this.columnDefs = configuration.map((config) => {
            return {
                colId: this.utilService.convertToCamelCase(config.fieldName),
                headerName: config.friendlyName,
                field: this.utilService.convertToCamelCase(config.fieldName),
                hide: !config.isVisible,
                filter: this.uiService.getFilterTypeForGridType(config.gridType),
                menuTabs: ['filterMenuTab', 'generalMenuTab'],
            };
        });
        if (this.gridOptions) {
            this.gridOptions.columnDefs = this.columnDefs;
            if (this.gridOptions.api) {
                this.gridOptions.api.setColumnDefs(this.columnDefs);
                if (this.gridOptions && this.gridOptions.api) { this.gridOptions.api.sizeColumnsToFit(); }
            }
        }
    }

    onColumnVisibilityChanged(col) {
        this.userPreferencesComponent.onChangeColumnVisibility(col);
    }
}
