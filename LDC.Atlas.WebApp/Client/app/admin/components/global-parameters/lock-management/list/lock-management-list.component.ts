import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as agGrid from 'ag-grid-community';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CompanyManagerService } from '../../../../../core/services/company-manager.service';
import { AgGridService } from '../../../../../shared/services/ag-grid.service';
import { AgGridUserPreferencesComponent } from './../../../../../shared/components/ag-grid-user-preferences/ag-grid-user-preferences.component';
import { AtlasAgGridParam } from './../../../../../shared/entities/atlas-ag-grid-param.entity';
import { ColumnConfigurationProperties } from './../../../../../shared/entities/grid-column-configuration.entity';
import { LockFunctionalContext } from './../../../../../shared/entities/lock-functional-context.entity';
import { Lock } from './../../../../../shared/entities/lock.entity';
import { WINDOW } from './../../../../../shared/entities/window-injection-token';
import { ApiCollection } from './../../../../../shared/services/common/models';
import { ConfigurationService } from './../../../../../shared/services/http-services/configuration.service';
import { LockService } from './../../../../../shared/services/http-services/lock.service';
import { TitleService } from './../../../../../shared/services/title.service';
import { UiService } from './../../../../../shared/services/ui.service';

@Component({
    selector: 'atlas-lock-management-list',
    templateUrl: './lock-management-list.component.html',
    styleUrls: ['./lock-management-list.component.scss'],
})
export class LockManagementListComponent implements OnInit, OnDestroy {
    @ViewChild('userPreferences') userPreferencesComponent: AgGridUserPreferencesComponent;

    agGridOptions: agGrid.GridOptions = {};
    columnDefs: agGrid.ColDef[] = [
        {
            headerName: 'Company',
            field: 'companyId',
            colId: 'companyId',
            headerCheckboxSelection: true,
            checkboxSelection: true,
        },
        {
            headerName: 'Owner',
            field: 'lockOwner',
            colId: 'lockOwner',
        },
        {
            headerName: 'Session',
            field: 'applicationSessionId',
            colId: 'applicationSessionId',
        },
        {
            headerName: 'Type',
            field: 'resourceType',
            colId: 'resourceType',
        },
        {
            headerName: 'Code',
            field: 'resourceCode',
            colId: 'resourceCode',
        },
        {
            headerName: 'Tech. Id',
            field: 'resourceId',
            colId: 'resourceId',
        },
        {
            headerName: 'Action',
            field: 'functionalContext',
            colId: 'functionalContext',
            valueFormatter: this.lockFunctionalContextFormatter,
        },
        {
            headerName: 'Acquisition Time',
            field: 'lockAcquisitionDateTime',
            colId: 'lockAcquisitionDateTime',
        },
    ];
    rowData: Lock[] = [];
    selectedLocks: Lock[] = [];
    locks: Lock[] = [];
    agGridApi: agGrid.GridApi;
    agGridColumnApi: agGrid.ColumnApi;
    atlasAgGridParam: AtlasAgGridParam;
    isLoading = true;
    columnConfiguration: ColumnConfigurationProperties[] = [];
    company: string;
    destroy$ = new Subject();

    nameCtrl: FormControl;

    constructor(private uiService: UiService,
        @Inject(WINDOW) private window: Window,
        private configurationService: ConfigurationService,
        private lockService: LockService,
        private companyManagerService: CompanyManagerService,
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

    lockFunctionalContextFormatter(params) {
        return LockFunctionalContext[params.value].toString();
    }

    initSearchForm() {
        this.nameCtrl = new FormControl();
    }

    loadData() {

        this.lockService.getLockList().pipe(
            takeUntil(this.destroy$),
        ).subscribe((lock: ApiCollection<Lock>) => {
            this.locks = lock.value;
            this.rowData = this.locks;
            this.isLoading = false;
        });
    }

    onGridReady(params) {
        this.agGridOptions = params;
        this.agGridOptions.columnDefs = this.columnDefs;
        this.agGridApi = this.agGridOptions.api;
        this.agGridColumnApi = this.agGridOptions.columnApi;
        if (this.agGridApi) { this.agGridApi.sizeColumnsToFit(); }
        this.window.onresize = () => {
            if (this.agGridApi) { this.agGridApi.sizeColumnsToFit(); }
        };
    }

    onCreateFuncObjectButtonClicked() {
        this.router.navigate(['/' + this.companyManagerService.getCurrentCompanyId() + '/admin/global-parameters/functional-object/new']);
    }

    onColumnVisibilityChanged(col) {
        this.userPreferencesComponent.onChangeColumnVisibility(col);
    }

    onDeleteButtonClick() {
        this.selectedLocks = this.agGridApi.getSelectedRows();
        if (this.selectedLocks && this.selectedLocks.length > 0) {
            const ids: number[] = new Array<number>();
            this.selectedLocks.forEach((l) => { ids.push(l.lockId); });
            this.lockService.deleteLocks(ids).pipe(
                takeUntil(this.destroy$),
            ).subscribe(() => { this.loadData(); });
        }
    }

    onRefreshButtonClick() {
        this.loadData();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
