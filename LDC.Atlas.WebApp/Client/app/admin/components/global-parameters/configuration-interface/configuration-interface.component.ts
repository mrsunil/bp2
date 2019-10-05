import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import * as agGrid from 'ag-grid-community';
import { WINDOW } from '../../../..//shared/entities/window-injection-token';
import { BaseFormComponent } from '../../../../shared/components/base-form-component/base-form-component.component';
import { AtlasAgGridParam } from '../../../../shared/entities/atlas-ag-grid-param.entity';
import { InterfaceSettings } from '../../../../shared/entities/interface-setting.entity';
import { AgGridService } from '../../../../shared/services/ag-grid.service';
import { FormConfigurationProviderService } from '../../../../shared/services/form-configuration-provider.service';
import { ConfigurationService } from '../../../../shared/services/http-services/configuration.service';

@Component({
    selector: 'atlas-configuration-interface',
    templateUrl: './configuration-interface.component.html',
    styleUrls: ['./configuration-interface.component.scss'],
})
export class ConfigurationInterfaceComponent extends BaseFormComponent implements OnInit {
    interfaceGridOptions: agGrid.GridOptions = {};
    interfaceColumnDefs: agGrid.ColDef[];
    gridApi: agGrid.GridApi;
    gridColumnApi: agGrid.ColumnApi;
    atlasAgGridParam: AtlasAgGridParam;
    interfaceRowData: InterfaceSettings[] = [];

    constructor(protected formConfigurationProvider: FormConfigurationProviderService,
        protected formBuilder: FormBuilder,
        public gridService: AgGridService,
        @Inject(WINDOW) private window: Window,
        protected route: ActivatedRoute,
        protected configurationService: ConfigurationService,
    ) {
        super(formConfigurationProvider);
        this.atlasAgGridParam = this.gridService.getAgGridParam();
    }

    ngOnInit() {
        this.initializeGridColumns();
        this.populateRowData();
    }

    // mockup data- will be removed and replaced with API call
    populateRowData() {
        this.interfaceRowData.push
            ({ interfaceName: 'AccountingInterface', esbUrl: 'https://esb-api-int.ldc.com ', esbUser: 'Test_api ' },
             { interfaceName: 'PaymentRequestInterface', esbUrl: 'https://esb-api-int.ldc.com ', esbUser: 'Test_api ' },
            );
    }

    onGridReady(params) {
        params.columnDefs = this.interfaceColumnDefs;
        this.interfaceGridOptions = params;
        this.gridApi = this.interfaceGridOptions.api;
        this.gridColumnApi = this.interfaceGridOptions.columnApi;

        this.gridColumnApi.autoSizeAllColumns();
        this.window.onresize = () => {
            this.gridColumnApi.autoSizeAllColumns();
        };

    }

    initializeGridColumns() {
        this.interfaceColumnDefs = [
            {
                headerName: 'Interface Name',
                colId: 'interfaceName',
                field: 'interfaceName',
            },
            {
                headerName: 'Esb_url',
                colId: 'esbUrl',
                field: 'esbUrl',
            },
            {
                headerName: 'Esb_user',
                colId: 'esbUser',
                field: 'esbUser',
            },
        ];
    }

}
