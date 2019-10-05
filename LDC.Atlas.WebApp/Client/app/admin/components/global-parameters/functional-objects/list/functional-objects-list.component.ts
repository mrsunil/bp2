import { Component, HostListener, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as agGrid from 'ag-grid-community';
import { AgGridService } from '../../../../../shared/services/ag-grid.service';
import { AgGridUserPreferencesComponent } from './../../../../../shared/components/ag-grid-user-preferences/ag-grid-user-preferences.component';
import { AtlasAgGridParam } from './../../../../../shared/entities/atlas-ag-grid-param.entity';
import { FunctionalObject } from './../../../../../shared/entities/functional-object.entity';
import { ColumnConfigurationProperties } from './../../../../../shared/entities/grid-column-configuration.entity';
import { WINDOW } from './../../../../../shared/entities/window-injection-token';
import { ApiCollection } from './../../../../../shared/services/common/models';
import { ConfigurationService } from './../../../../../shared/services/http-services/configuration.service';
import { TitleService } from './../../../../../shared/services/title.service';
import { UiService } from './../../../../../shared/services/ui.service';
import { UrlManagementService } from './../../../../../shared/services/url-management.service';

@Component({
    selector: 'atlas-functional-objects-list',
    templateUrl: './functional-objects-list.component.html',
    styleUrls: ['./functional-objects-list.component.scss'],
})
export class FunctionalObjectsListComponent implements OnInit {
    @ViewChild('userPreferences') userPreferencesComponent: AgGridUserPreferencesComponent;

    agGridOptions: agGrid.GridOptions = {};
    columnDefs: agGrid.ColDef[] = [
        {
            headerName: 'Name',
            field: 'functionalObjectName',
            colId: 'functionalObjectName',
            width: 300,
            minWidth: 300,
            maxWidth: 300,
        },
        {
            headerName: 'Tables',
            colId: 'tables',
            valueGetter: this.tableValueGetter,
            width: 700,
            minWidth: 700,
            maxWidth: 700,
        },
    ];
    rowData: FunctionalObject[] = [];
    functionalObjects: FunctionalObject[] = [];
    agGridApi: agGrid.GridApi;
    agGridColumnApi: agGrid.ColumnApi;
    atlasAgGridParam: AtlasAgGridParam;
    isLoading = true;
    columnConfiguration: ColumnConfigurationProperties[] = [];
    company: string;

    nameCtrl: FormControl;

    constructor(private uiService: UiService,
        @Inject(WINDOW) private window: Window,
        private configurationService: ConfigurationService,
        private urlManagementService: UrlManagementService,
        private router: Router,
        private route: ActivatedRoute,
        public gridService: AgGridService,
        private titleService: TitleService,
    ) {

    }

    ngOnInit() {
        this.company = this.route.snapshot.paramMap.get('company');
        this.titleService.setTitle(this.route.snapshot.data.title);
        this.atlasAgGridParam = this.gridService.getAgGridParam();
        this.initSearchForm();
        this.loadData();
    }

    @HostListener('window:beforeunload', ['$event']) unloadNotification($event: any) {
        if (this.nameCtrl.dirty) {
            $event.returnValue = true;
        }
    }

    initSearchForm() {
        this.nameCtrl = new FormControl();
    }

    loadData() {
        this.configurationService.getFunctionalObjects().subscribe((functionalObj: ApiCollection<FunctionalObject>) => {
            this.functionalObjects = functionalObj.value;
            this.rowData = this.functionalObjects;
            this.isLoading = false;
        });
    }

    onGridReady(params) {
        this.agGridOptions = params;
        this.agGridOptions.columnDefs = this.columnDefs;
        this.agGridApi = this.agGridOptions.api;
        this.agGridColumnApi = this.agGridOptions.columnApi;
        this.agGridColumnApi.autoSizeAllColumns();
        this.window.onresize = () => {
            this.agGridColumnApi.autoSizeAllColumns();
        };
    }

    onCreateFuncObjectButtonClicked() {
        this.router.navigate(['/' + this.urlManagementService.getCurrentCompanyId() + '/admin/global-parameters/functional-object/new']);
    }

    onColumnVisibilityChanged(col) {
        this.userPreferencesComponent.onChangeColumnVisibility(col);
    }

    tableValueGetter(params: agGrid.ValueGetterParams) {
        const col: FunctionalObject = params.data;
        return col.tables ? col.tables.map((table) => table.tableName).join(', ') : '';
    }

    onFilterButtonClicked() {
        this.rowData = this.functionalObjects
            .filter((obj) => {
                return obj.functionalObjectName
                    ? (obj.functionalObjectName.toLowerCase().indexOf(
                        this.nameCtrl.value ? this.nameCtrl.value.toLowerCase() : '') > -1)
                    : false;
            });
    }

    onRowClicked(event) {
        const functionalObjectId = event.data.functionalObjectId;
        this.router.navigate(['/' + this.urlManagementService.getCurrentCompanyId() + '/admin/global-parameters/functional-object/details', functionalObjectId]);
    }
}
