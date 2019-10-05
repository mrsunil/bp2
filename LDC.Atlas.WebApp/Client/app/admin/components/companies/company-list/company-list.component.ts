import { DatePipe } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as agGrid from 'ag-grid-community';
import { Subject } from 'rxjs';
import { AdminActionsService } from '../../../../admin/services/admin-actions.service';
import { AuthorizationService } from '../../../../core/services/authorization.service';
import { CompanyManagerService } from '../../../../core/services/company-manager.service';
import { AgGridUserPreferencesComponent } from '../../../../shared/components/ag-grid-user-preferences/ag-grid-user-preferences.component';
import { AgContextualMenuAction } from '../../../../shared/entities/ag-contextual-menu-action.entity';
import { AtlasAgGridParam } from '../../../../shared/entities/atlas-ag-grid-param.entity';
import { Company } from '../../../../shared/entities/company.entity';
import { MasterData } from '../../../../shared/entities/masterdata.entity';
import { WINDOW } from '../../../../shared/entities/window-injection-token';
import { AgGridService } from '../../../../shared/services/ag-grid.service';
import { ConfigurationService } from '../../../../shared/services/http-services/configuration.service';
import { SecurityService } from '../../../../shared/services/security.service';

@Component({
    selector: 'atlas-company-list',
    templateUrl: './company-list.component.html',
    styleUrls: ['./company-list.component.scss'],
    providers: [DatePipe],
})
export class CompanyListComponent implements OnInit, OnDestroy {
    @ViewChild('userPreferences') userPreferencesComponent: AgGridUserPreferencesComponent;
    isLoading = true;
    company: string;
    gridCode = 'companyList';
    userActiveDirectoryName: string;
    atlasAgGridParam: AtlasAgGridParam;
    companyGridContextualMenuActions: AgContextualMenuAction[];
    companyGridOptions: agGrid.GridOptions = {};
    companyGridCols: agGrid.ColDef[];
    gridApi: agGrid.GridApi;
    gridColumnApi: agGrid.ColumnApi;
    destroy$ = new Subject();
    masterdata: MasterData;
    companyGridRows: Company[];

    constructor(
        private securityService: SecurityService,
        private route: ActivatedRoute,
        private router: Router,
        private datePipe: DatePipe,
        public gridService: AgGridService,
        @Inject(WINDOW) private window: Window,
        private authorizationService: AuthorizationService,
        private companyManager: CompanyManagerService,
        protected configurationService: ConfigurationService,
        protected adminActionsService: AdminActionsService,
    ) {
        this.userActiveDirectoryName = this.authorizationService.getCurrentUser().samAccountName;
    }

    ngOnInit() {
        this.company = this.route.snapshot.params['company'];

        this.masterdata = this.route.snapshot.data.masterdata;
        this.securityService.isSecurityReady().subscribe(() => {
            this.initCompanyGridColumns();
            this.getCompanies();
            this.atlasAgGridParam = this.gridService.getAgGridParam();
        });
    }

    onGridReady(params) {
        params.columnDefs = this.companyGridCols;
        this.companyGridOptions = params;
        this.gridApi = this.companyGridOptions.api;
        this.gridColumnApi = this.companyGridOptions.columnApi;

        this.gridColumnApi.autoSizeAllColumns();
        this.window.onresize = () => {
            this.gridColumnApi.autoSizeAllColumns();
        };
    }

    onCompanyRowClicked(event) {
        this.router.navigate(['/' + this.companyManager.getCurrentCompanyId() +
            '/admin/company-configuration/display/', encodeURIComponent(event.data.companyId)]);
    }

    initCompanyGridColumns() {
        this.companyGridCols = [
            {
                headerName: 'Company Id',
                colId: 'id',
                field: 'id',
                hide: true,
            },
            {
                headerName: 'Company Friendly Code',
                colId: 'companyId',
                field: 'companyId',
            },
            {
                headerName: 'Company Name',
                colId: 'description',
                field: 'description',
            },
            {
                headerName: 'Company Type',
                colId: 'companyType',
                field: 'companyType',
            },
            {
                headerName: 'Legal Entity',
                colId: 'legalEntityCode',
                field: 'legalEntityCode',
            },
            {
                headerName: 'LDC Regions',
                colId: 'ldcRegionCode',
                field: 'ldcRegionCode',
            },
        ];
    }

    getCompanies() {
        this.configurationService.getCompanyListDetails(this.company).subscribe((companyListData) => {
            if (companyListData) {
                this.companyGridRows = companyListData;
            }
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    onCreateFromScratchButtonClicked() {
        this.adminActionsService.createCompanySubject.next();
    }

    onCreateByCopyingButtonClicked() {
        this.router.navigate(['/' + this.companyManager.getCurrentCompanyId() +
            '/admin/companies/selection']);
    }

    onGridSizeChanged(params) {
        this.gridColumnApi = params.columnApi;
        this.gridColumnApi.autoSizeAllColumns();
    }

    onColumnVisibilityChanged(column: any) {
        if (this.userPreferencesComponent) {
            this.userPreferencesComponent.onChangeColumnVisibility(column);
        }
        this.companyGridOptions.columnApi.autoSizeAllColumns();
    }

    showOrHideColum(event, col: agGrid.ColDef) {
        const cols = this.companyGridCols.filter((colf) => colf.colId === col.colId);
        if (cols.length === 1) {
            cols[0].hide = !(col.hide || false);

            this.gridColumnApi.setColumnVisible(col.colId, !cols[0].hide);
        }
        event.stopPropagation();
        return false;
    }

    onRefreshButtonClicked() {
        this.gridColumnApi.resetColumnState();
        this.companyGridCols.forEach((colf) => {
            colf.hide = !this.gridColumnApi.getColumn(colf.colId).isVisible();
        });
        this.companyGridOptions.columnApi.autoSizeAllColumns();
    }
}
