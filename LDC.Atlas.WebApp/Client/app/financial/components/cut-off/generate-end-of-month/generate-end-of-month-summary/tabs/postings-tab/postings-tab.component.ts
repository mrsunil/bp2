import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as agGrid from 'ag-grid-community';
import { AuthorizationService } from '../../../../../../../core/services/authorization.service';
import { CompanyManagerService } from '../../../../../../../core/services/company-manager.service';
import { CommonMethods } from '../../../../../../../execution/services/execution-cash-common-methods';
import { BaseFormComponent } from '../../../../../../../shared/components/base-form-component/base-form-component.component';
import { AtlasAgGridParam } from '../../../../../../../shared/entities/atlas-ag-grid-param.entity';
import { TradeCostMonthEndMappingErrors } from '../../../../../../../shared/entities/tradecost-monthend-mappingerrors-entity';
import { UserGridPreferencesParameters } from '../../../../../../../shared/entities/user-grid-preferences-parameters.entity';
import { GenerateMonthEndEnum } from '../../../../../../../shared/enums/generate-month-end-type.enum';
import { ReportType } from '../../../../../../../shared/enums/report-type.enum';
import { OverviewGenerateEndOfMonthDisplayView } from '../../../../../../../shared/models/overview-generate-end-of-month-display-view';
import { AgGridService } from '../../../../../../../shared/services/ag-grid.service';
import { FormConfigurationProviderService } from '../../../../../../../shared/services/form-configuration-provider.service';
import { TradingService } from '../../../../../../../shared/services/http-services/trading.service';
import { UiService } from '../../../../../../../shared/services/ui.service';

@Component({
    selector: 'atlas-postings-tab',
    templateUrl: './postings-tab.component.html',
    styleUrls: ['./postings-tab.component.scss'],
    providers: [DatePipe],
})
export class PostingsTabComponent extends BaseFormComponent implements OnInit {

    @Input() filteredPostingsGridRows: OverviewGenerateEndOfMonthDisplayView[];
    @Output() readonly applyButtonClicked = new EventEmitter();
    @Output() readonly mappingError = new EventEmitter<TradeCostMonthEndMappingErrors[]>();
    postingsGridOptions: agGrid.GridOptions = {};
    atlasAgGridParam: AtlasAgGridParam;
    postingsGridColumns: agGrid.ColDef[];
    postingsGridRows: OverviewGenerateEndOfMonthDisplayView[];
    originalPostingsGridRows: OverviewGenerateEndOfMonthDisplayView[];
    gridApi: agGrid.GridApi;
    gridColumnApi: agGrid.ColumnApi;
    company: string;
    isLoading: boolean;
    length: number = 0;
    userActiveDirectoryName: string;
    dataVersionID: number;
    gridPreferencesParameters: UserGridPreferencesParameters;
    gridId: string = 'endOfMonthPostings';

    dataVersionMonth: string;
    reportType: number;
    reportTypeDescription: string;
    quantityWeightCode: string;
    constructor(protected formConfigurationProvider: FormConfigurationProviderService,
        protected uiService: UiService,
        private companyManager: CompanyManagerService,
        private tradingService: TradingService,
        private authorizationService: AuthorizationService,
        private datePipe: DatePipe,
        public gridService: AgGridService) {
        super(formConfigurationProvider);
        this.userActiveDirectoryName = this.authorizationService.getCurrentUser().samAccountName;
    }

    ngOnInit() {
        if (this.reportType !== ReportType.MTMOpenFx) {
            this.atlasAgGridParam = this.gridService.getAgGridParam();
            const companyDetails = this.companyManager.getCurrentCompany();
            this.quantityWeightCode = '(in ' + companyDetails.weightCode + ')';
            this.company = this.companyManager.getCurrentCompanyId();
            this.initializeGridColumns();
            this.initPostingsGridRows();

            this.gridPreferencesParameters = {
                company: this.company,
                gridId: this.gridId,
                gridOptions: null,
                savingEnabled: false,
                sharingEnabled: false,
                showExport: true,
                hasColumnHandling: false,
            };
        }
    }
    onGridReady(params) {
        this.postingsGridOptions.columnDefs = this.postingsGridColumns;
        this.gridApi = this.postingsGridOptions.api;
        this.gridColumnApi = this.postingsGridOptions.columnApi;
        this.gridApi.showNoRowsOverlay();
        this.autosizeColumns();
    }

    autosizeColumns() {
        if (this.postingsGridOptions) {
            this.gridService.sizeColumns(this.postingsGridOptions);
        }
    }

    initializeGridColumns() {
        this.postingsGridColumns = [
            {
                colId: 'sectionId',
                hide: true,
            },
            {
                colId: 'costId',
                hide: true,
            },
            {
                headerName: 'Accrual Number',
                field: 'accrualNumber',
                colId: 'accrualNumber',
                hide: false,
            },
            {
                headerName: 'Nom. Account',
                field: 'accountNumber',
                colId: 'accountNumber',
                hide: false,
                valueFormatter: this.stringFormatter.bind(this),
            },
            {
                headerName: 'Business Sector',
                field: 'businessSectorCode',
                colId: 'businessSectorCode',
                valueFormatter: this.stringFormatter.bind(this),
            },
            {
                headerName: 'Description',
                field: 'description',
                colId: 'description',
                hide: false,
            },
            {
                headerName: ' Cost Type',
                field: 'costType',
                colId: 'costType',
                hide: false,
                valueFormatter: this.stringFormatter.bind(this),
            },
            {
                headerName: 'Department',
                field: 'departmentCode',
                colId: 'departmentCode',
                hide: false,
                valueFormatter: this.stringFormatter.bind(this),
            },
            {
                headerName: 'Charter',
                field: 'charterCode',
                colId: 'charterCode',
                hide: false,
                valueFormatter: this.charterFormatter.bind(this),
            },
            {
                headerName: 'Contract',
                field: 'contractNumber',
                colId: 'contractNumber',
                hide: false,
                valueFormatter: this.contractFormatter.bind(this),
            },
            {
                headerName: 'Associated Account',
                field: 'associatedClient',
                colId: 'associatedClient',
                hide: false,
                valueFormatter: this.stringFormatter.bind(this),
            },
            {
                headerName: 'Currency',
                field: 'currencyCode',
                colId: 'currencyCode',
                hide: false,
                valueFormatter: this.currencyFormatter.bind(this),
            },
            {
                headerName: 'Amount',
                field: 'accruedAmount',
                colId: 'accruedAmount',
                hide: false,
                valueFormatter: this.amountFormatter.bind(this),
                cellStyle: { textAlign: 'right' },
            },
            {
                headerName: 'Quantity ' + this.quantityWeightCode,
                field: 'quantity',
                colId: 'quantity',
                hide: false,
                valueFormatter: this.quantityFormatter.bind(this),
                cellStyle: { textAlign: 'right' },
            },
            {
                headerName: 'Inhouse/External',
                field: 'inhouseOrExternal',
                colId: 'inhouseOrExternal',
                hide: (this.reportType !== 1) ? false : true,
                valueFormatter: this.charterFormatter.bind(this),
            },
        ];
    }

    initPostingsGridRows() {
        this.postingsGridRows = [];
    }

    getTradeCostListPostings(filteredPostingsGridRows?: OverviewGenerateEndOfMonthDisplayView[], isFilteredApplied: boolean = false) {
        if (filteredPostingsGridRows && isFilteredApplied === true) {
            this.postingsGridRows = filteredPostingsGridRows;
        } else {
            this.tradingService.getTradeCostList(this.reportType, GenerateMonthEndEnum.Postings, this.dataVersionID)
                .subscribe((data) => {
                    if (data && data.value.length > 0) {
                        const mappingErrorDetails = data.value[0].tradeCostMonthEndMappingErrors;
                        this.mappingError.emit(mappingErrorDetails);
                    }
                    this.postingsGridRows = data.value.map((CostTrade) => {
                        return new OverviewGenerateEndOfMonthDisplayView(CostTrade, this.reportType);
                    });
                    this.isLoading = false;
                    this.originalPostingsGridRows = this.postingsGridRows;
                    if (isFilteredApplied) {
                        this.applyButtonClicked.emit();
                    }
                });
        }
    }

    stringFormatter(param) {
        if (param.value) { return String(param.value).substr(0, 10); }
    }

    charterFormatter(param) {
        if (param.value) { return String(param.value).substr(0, 15); }
    }

    contractFormatter(param) {
        if (param.value) { return String(param.value).substr(0, 12); }
    }

    currencyFormatter(param) {
        if (param.value) { return String(param.value).substr(0, 3); }
    }

    amountFormatter(param) {
        if (param.value) {
            const commonMethods = new CommonMethods();
            return commonMethods.getFormattedNumberValue(param.value, 2);
        }
    }

    quantityFormatter(param) {
        if (param.value) {
            const commonMethods = new CommonMethods();
            return commonMethods.getFormattedNumberValue(param.value, 3);
        }
    }
}
