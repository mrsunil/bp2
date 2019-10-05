import { DatePipe } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import * as agGrid from 'ag-grid-community';
import { Subject } from 'rxjs';
import { AuthorizationService } from '../../../core/services/authorization.service';
import { AgGridUserPreferencesComponent } from '../../../shared/components/ag-grid-user-preferences/ag-grid-user-preferences.component';
import { SSRSReportViewerComponent } from '../../../shared/components/ssrs-report-viewer/ssrsreport-viewer.component';
import { AgContextualMenuAction } from '../../../shared/entities/ag-contextual-menu-action.entity';
import { AtlasAgGridParam } from '../../../shared/entities/atlas-ag-grid-param.entity';
import { AtlasFormControl } from '../../../shared/entities/atlas-form-control';
import { Company } from '../../../shared/entities/company.entity';
import { PhysicalDocumentTemplate } from '../../../shared/entities/document-template.entity';
import { EnumEntity } from '../../../shared/entities/enum-entity.entity';
import { MasterData } from '../../../shared/entities/masterdata.entity';
import { WINDOW } from '../../../shared/entities/window-injection-token';
import { FunctionalArea } from '../../../shared/enums/functional-area.enum';
import { PermissionLevels } from '../../../shared/enums/permission-level.enum';
import { AgGridService } from '../../../shared/services/ag-grid.service';
import { UserCompanyPrivilegeDto } from '../../../shared/services/authorization/dtos/user-company-privilege';
import { DocumentService } from '../../../shared/services/http-services/document.service';
import { SecurityService } from '../../../shared/services/security.service';
import { UiService } from '../../../shared/services/ui.service';
import { CustomReportViewerComponent } from './custom-report-viewer/custom-report-viewer.component';

@Component({
    selector: 'atlas-custom-reports',
    templateUrl: './custom-reports.component.html',
    styleUrls: ['./custom-reports.component.scss'],
    providers: [DatePipe],
})
export class CustomReportsComponent implements OnInit, OnDestroy {
    @ViewChild('userPreferences') userPreferencesComponent: AgGridUserPreferencesComponent;
    @ViewChild('ssrsReportViewer') ssrsReportViewer: SSRSReportViewerComponent;
    isLoading: boolean = true;
    company: string;
    gridCode = 'customReportList';
    userActiveDirectoryName: string;
    atlasAgGridParam: AtlasAgGridParam;
    searchedValueCtrl = new AtlasFormControl('searchedValue');
    companyGridContextualMenuActions: AgContextualMenuAction[];
    customReportGridOptions: agGrid.GridOptions = {};
    customReportGridCols: agGrid.ColDef[];
    gridApi: agGrid.GridApi;
    gridColumnApi: agGrid.ColumnApi;
    destroy$ = new Subject();
    masterdata: MasterData;
    parameters: any[] = [];
    dialogData: {
        contractSectionCode: number;
        dataVersionId: number;
    };
    customReportGridRows: PhysicalDocumentTemplate[];
    filteredCustomReports: PhysicalDocumentTemplate[];
    customReportList: PhysicalDocumentTemplate[];
    customReportReadPrivilege: UserCompanyPrivilegeDto = {
        privilegeName: '',
        profileId: null,
        permission: PermissionLevels.Read,
        privilegeParentLevelOne: '',
        privilegeParentLevelTwo: null,
    };
    functionalAreas: EnumEntity[];

    constructor(
        private securityService: SecurityService,
        private route: ActivatedRoute,
        private datePipe: DatePipe,
        protected dialog: MatDialog,
        public gridService: AgGridService,
        @Inject(WINDOW) private window: Window,
        private authorizationService: AuthorizationService,
        protected documentService: DocumentService,
        protected uiService: UiService,
    ) {
        this.userActiveDirectoryName = this.authorizationService.getCurrentUser().samAccountName;
    }

    ngOnInit() {
        this.company = this.route.snapshot.params['company'];

        this.functionalAreas = [
            {
                enumEntityId: null,
                enumEntityValue: FunctionalArea[FunctionalArea.AccountingEntries],
            },
            {
                enumEntityId: null,
                enumEntityValue: FunctionalArea[FunctionalArea.Charters],
            },
            {
                enumEntityId: null,
                enumEntityValue: FunctionalArea[FunctionalArea.Trades],
            },
            {
                enumEntityId: null,
                enumEntityValue: FunctionalArea[FunctionalArea.Counterparties],
            },
            {
                enumEntityId: null,
                enumEntityValue: FunctionalArea[FunctionalArea.NominalAccountLedger],
            },
            {
                enumEntityId: null,
                enumEntityValue: FunctionalArea[FunctionalArea.Users],
            },
            {
                enumEntityId: null,
                enumEntityValue: FunctionalArea[FunctionalArea.Vessels],
            },
        ];

        this.masterdata = this.route.snapshot.data.masterdata;
        this.securityService.isSecurityReady().subscribe(() => {
            this.initCustomReportGridColumns();
            this.getReportList();
            this.atlasAgGridParam = this.gridService.getAgGridParam();
        });
    }

    onGridReady(params) {
        this.gridApi = params.api;
        params.columnDefs = this.customReportGridCols;
        this.customReportGridOptions = params;

        this.gridColumnApi = params.columnApi;
        this.gridColumnApi.autoSizeAllColumns();
        window.onresize = () => {
            this.gridColumnApi.autoSizeAllColumns();
        };
    }

    onCustomReportRowClicked(event) {
        const openTradepnlReportDialog = this.dialog.open(CustomReportViewerComponent, {
            data:
            {
                reportName: event.data.name,
                reportPath: event.data.path,
            },
            width: '90%',
            height: '90%',
        });
    }

    initCustomReportGridColumns() {
        this.customReportGridCols = [
            {
                headerName: 'Report name',
                colId: 'name',
                field: 'name',
                minWidth: 150,
                maxWidth: 150,
            },
            {
                headerName: 'Report description',
                colId: 'description',
                field: 'description',
                tooltip: this.showCellValue.bind(this),
                valueFormatter: this.descriptionFormatter.bind(this),
            },
            {
                headerName: 'Report creator',
                colId: 'createdBy',
                field: 'createdBy',
            },
            {
                headerName: 'Linked menu',
                colId: 'linkedMenu',
                field: 'linkedMenu',
            },
            {
                headerName: 'Company',
                colId: 'company',
                field: 'company',
            },
            {
                headerName: 'Date of creation',
                colId: 'createdDateTime',
                field: 'createdDateTime',
                valueFormatter: this.uiService.dateFormatter,
            },
            {
                headerName: 'Date of modification',
                colId: 'modifiedDateTime',
                field: 'modifiedDateTime',
                valueFormatter: this.uiService.dateFormatter,
            },
        ];
    }

    showCellValue(params): string {
        if (params) {
            return params.value;
        }
    }

    descriptionFormatter(params): string {
        if (params && params.value) {
            if (params.value.length > 10) {
                return params.value.substring(0, 10);
            }
        }
    }

    checkIfUserHasRequiredPrivileges(userCompanyPrivilege: UserCompanyPrivilegeDto) {
        if (this.authorizationService.isUserAllowedForCompany(this.company)) {
            const userPermissionLevel = this.authorizationService.getPermissionLevel(
                this.company,
                userCompanyPrivilege.privilegeName,
                userCompanyPrivilege.privilegeParentLevelTwo,
                userCompanyPrivilege.privilegeParentLevelOne);
            if (userPermissionLevel < userCompanyPrivilege.permission) {
                return false;
            }
        }
        return true;
    }

    getReportList() {
        // temporarily hardcoded
        const documentType = 76;
        this.documentService.getTemplates(documentType).subscribe((data) => {
            if (data) {
                for (let i = 0; i < data.value.length; i++) {
                    const split = data.value[i].path.split('/');
                    data.value[i].company = split[2];
                    data.value[i].linkedMenu = split[3];
                }

                // If user has access to particular company
                // then only related reports will be visible for user
                const companyListByAccess: string[] = [];
                companyListByAccess.push('mc');
                this.masterdata.companies.forEach((company) => {
                    const isCompanyAccess: boolean = true;
                    if (this.authorizationService.isUserAllowedForCompany(company.companyId)) {
                        companyListByAccess.push(company.companyId);
                    }
                });

                // If user has privilege for particular functional area
                // then only related reports will be visible for user
                const functionalAreaByAccess: string[] = [];
                this.functionalAreas.forEach((area) => {
                    if (area.enumEntityValue === FunctionalArea[FunctionalArea.Trades]
                        || area.enumEntityValue === FunctionalArea[FunctionalArea.Charters]) {
                        this.customReportReadPrivilege.privilegeParentLevelOne = area.enumEntityValue;
                        this.customReportReadPrivilege.privilegeParentLevelTwo = null;
                    } else if (area.enumEntityValue === FunctionalArea[FunctionalArea.Counterparties]
                        || area.enumEntityValue === FunctionalArea[FunctionalArea.NominalAccountLedger]
                        || area.enumEntityValue === FunctionalArea[FunctionalArea.Vessels]) {
                        this.customReportReadPrivilege.privilegeParentLevelOne = 'MasterData';
                        this.customReportReadPrivilege.privilegeParentLevelTwo = null;
                    } else if (area.enumEntityValue === FunctionalArea[FunctionalArea.AccountingEntries]) {
                        this.customReportReadPrivilege.privilegeParentLevelOne = 'Financials';
                        this.customReportReadPrivilege.privilegeParentLevelTwo = area.enumEntityValue;
                    } else if (area.enumEntityValue === FunctionalArea[FunctionalArea.Users]) {
                        this.customReportReadPrivilege.privilegeParentLevelOne = 'Administration';
                        this.customReportReadPrivilege.privilegeParentLevelTwo = area.enumEntityValue;
                    }

                    this.customReportReadPrivilege.privilegeName = (area.enumEntityValue === FunctionalArea[FunctionalArea.Counterparties]
                        || area.enumEntityValue === FunctionalArea[FunctionalArea.NominalAccountLedger]
                        || area.enumEntityValue === FunctionalArea[FunctionalArea.Vessels])
                        ? 'MasterData' : area.enumEntityValue;

                    if (this.checkIfUserHasRequiredPrivileges(this.customReportReadPrivilege)) {
                        functionalAreaByAccess.push(area.enumEntityValue);
                    }
                });

                this.customReportList = data.value;
                this.customReportGridRows = this.customReportList.filter((a) =>
                    companyListByAccess.includes(a.company) && functionalAreaByAccess.includes(a.linkedMenu));

                if (this.gridApi) {
                    if (this.gridApi) { this.gridApi.sizeColumnsToFit(); }
                }

                this.isLoading = false;
            }
        });
    }

    onSearchButtonClicked() {
        const reportName = this.searchedValueCtrl.value;
        this.filteredCustomReports = reportName ?
            this.customReportList.filter((column) => column.name.toLowerCase().includes(reportName.toLowerCase()))
            : this.customReportList;
        this.customReportGridRows = this.filteredCustomReports;
        this.isLoading = false;
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    onGridSizeChanged(params) {
        this.gridColumnApi = params.columnApi;
        this.gridColumnApi.autoSizeAllColumns();
    }

    onColumnVisibilityChanged(column: any) {
        if (this.userPreferencesComponent) {
            this.userPreferencesComponent.onChangeColumnVisibility(column);
        }
        this.customReportGridOptions.columnApi.autoSizeAllColumns();
    }

    showOrHideColum(event, col: agGrid.ColDef) {
        const cols = this.customReportGridCols.filter((colf) => colf.colId === col.colId);
        if (cols.length === 1) {
            cols[0].hide = !(col.hide || false);

            this.gridColumnApi.setColumnVisible(col.colId, !cols[0].hide);
        }
        event.stopPropagation();
        return false;
    }

    onRefreshButtonClicked() {
        this.gridColumnApi.resetColumnState();
        this.customReportGridCols.forEach((colf) => {
            colf.hide = !this.gridColumnApi.getColumn(colf.colId).isVisible();
        });
        this.customReportGridOptions.columnApi.autoSizeAllColumns();
    }
}
