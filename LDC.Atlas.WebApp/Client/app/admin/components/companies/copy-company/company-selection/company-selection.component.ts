import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as agGrid from 'ag-grid-community';
import { CompanyManagerService } from '../../../../../core/services/company-manager.service';
import { AgGridUserPreferencesComponent } from '../../../../../shared/components/ag-grid-user-preferences/ag-grid-user-preferences.component';
import { BaseFormComponent } from '../../../../../shared/components/base-form-component/base-form-component.component';
import { AtlasAgGridParam } from '../../../../../shared/entities/atlas-ag-grid-param.entity';
import { Company } from '../../../../../shared/entities/company.entity';
import { AgGridService } from '../../../../../shared/services/ag-grid.service';
import { FormConfigurationProviderService } from '../../../../../shared/services/form-configuration-provider.service';
import { ConfigurationService } from '../../../../../shared/services/http-services/configuration.service';
import { SecurityService } from '../../../../../shared/services/security.service';

@Component({
    selector: 'atlas-company-selection',
    templateUrl: './company-selection.component.html',
    styleUrls: ['./company-selection.component.scss'],
})
export class CompanySelectionComponent extends BaseFormComponent implements OnInit {
    @ViewChild('userPreferences') userPreferencesComponent: AgGridUserPreferencesComponent;

    company: string;
    selectedCompany: string;
    companyGridCols: agGrid.ColDef[];
    gridApi: agGrid.GridApi;
    gridColumnApi: agGrid.ColumnApi;
    companyGridOptions: agGrid.GridOptions = {};
    companyGridRows: Company[];
    atlasAgGridParam: AtlasAgGridParam;
    isCompanySelected: boolean = false;
    gridContext = {
        gridEditable: true,
    };
    constructor(protected formConfigurationProvider: FormConfigurationProviderService,
        protected configurationService: ConfigurationService,
        public gridService: AgGridService,
        private router: Router,
        private companyManager: CompanyManagerService,
        private securityService: SecurityService,
        private route: ActivatedRoute,
    ) {
        super(formConfigurationProvider);
    }

    ngOnInit() {
        this.company = this.route.snapshot.params['company'];
        this.securityService.isSecurityReady().subscribe(() => {
            this.initCompanyGridColumns();
            this.getCompanies();
            this.atlasAgGridParam = this.gridService.getAgGridParam();
        });

    }
    onGridReady(params) {
        this.gridApi = params.api;
        params.columnDefs = this.companyGridCols;
        this.companyGridOptions = params;

        this.gridColumnApi = params.columnApi;
        this.gridColumnApi.autoSizeAllColumns();
        window.onresize = () => {
            this.gridColumnApi.autoSizeAllColumns();
        };
    }
    getCompanies() {
        this.configurationService.getCompanyListDetails(this.company).subscribe((companyListData) => {
            if (companyListData) {
                this.companyGridRows = companyListData;
            }
        });
    }

    initCompanyGridColumns() {
        this.companyGridOptions = {
            context: this.gridContext,
        };
        this.companyGridCols = [
            {
                headerName: '',
                colId: 'selection',
                headerCheckboxSelection: false,
                checkboxSelection: true,
                minWidth: 40,
                maxWidth: 40,
                pinned: 'left',
            },
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

    onColumnVisibilityChanged(column: any) {
        if (this.userPreferencesComponent) {
            this.userPreferencesComponent.onChangeColumnVisibility(column);
        }
        this.companyGridOptions.columnApi.autoSizeAllColumns();
    }

    onDiscardButtonClicked() {
        this.router.navigate(['/' + this.companyManager.getCurrentCompanyId() +
            '/admin/companies']);
    }
    onCopySelectedCompanyButtonClicked() {
        const selectedRow = this.gridApi.getSelectedRows();
        this.selectedCompany = selectedRow[0].companyId;
        this.router.navigate(['/' + this.companyManager.getCurrentCompanyId() +
            '/admin/companies/copy', this.selectedCompany]);
    }
    onSelectionChanged(event) {
        const selectedRows = this.gridApi.getSelectedRows();
        this.isCompanySelected = (selectedRows.length > 0) ? true : false;
    }

}
