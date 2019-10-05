import { Component, OnInit, Inject, ViewChild, Input } from '@angular/core';
import { CashListReceiptDataLoader } from '../../../shared/services/list-and-search/cashList-receipt-data-loader';
import { DatePipe } from '@angular/common';
import { FormConfigurationProviderService } from '../../../shared/services/form-configuration-provider.service';
import { ExecutionService } from '../../../shared/services/http-services/execution.service';
import { UiService } from '../../../shared/services/ui.service';
import { ActivatedRoute } from '@angular/router';
import { MasterdataService } from '../../../shared/services/http-services/masterdata.service';
import { FormatDatePipe } from '../../../shared/pipes/format-date-pipe.pipe';
import { ExecutionActionsService } from '../../services/execution-actions.service';
import { AuthorizationService } from '../../../core/services/authorization.service';
import { WINDOW } from '../../../shared/entities/window-injection-token';
import { AgGridService } from '../../../shared/services/ag-grid.service';
import { AgGridUserPreferencesComponent } from '../../../shared/components/ag-grid-user-preferences/ag-grid-user-preferences.component';
import { ListAndSearchComponent } from '../../../shared/components/list-and-search/list-and-search.component';
import { AtlasFormControl } from '../../../shared/entities/atlas-form-control';
import { CashDisplayView } from '../../../shared/models/cash-display-view';
import { ColumnState } from 'ag-grid-community/dist/lib/columnController/columnController';
import { AtlasAgGridParam } from '../../../shared/entities/atlas-ag-grid-param.entity';
import { CharterDisplayView } from '../../../shared/models/charter-display-view';
import { MasterData } from '../../../shared/entities/masterdata.entity';
import { ListAndSearchFilter } from '../../../shared/entities/list-and-search/list-and-search-filter.entity';
import { CashSelectionType } from '../../../shared/enums/cash-selection-type';
import { CashSummary } from '../../../shared/entities/cash.entity';
import { ListAndSearchFilterType } from '../../../shared/enums/list-and-search-filter-type.enum';
import { BaseFormComponent } from '../../../shared/components/base-form-component/base-form-component.component';
import * as agGrid from 'ag-grid-community';
import { MasterDataProps } from '../../../shared/entities/masterdata-props.entity';

@Component({
    selector: 'atlas-execution-cash-receipt-list-page',
    templateUrl: './execution-cash-receipt-list-page.component.html',
    styleUrls: ['./execution-cash-receipt-list-page.component.scss'],
    providers: [DatePipe, CashListReceiptDataLoader],
})
export class ExecutionCashReceiptListPageComponent extends BaseFormComponent implements OnInit {
    @ViewChild('userPreferences') userPreferencesComponent: AgGridUserPreferencesComponent;
    @ViewChild('listAndSearchComponent') listAndSearchComponent: ListAndSearchComponent;

    gridApi: agGrid.GridApi;
    gridColumnApi: agGrid.ColumnApi;
    cashGridCols: agGrid.ColDef[];
    searchedValueCtrl = new AtlasFormControl('searchedValue');
    dataLength = 0;
    cashGridRows: CashDisplayView[] = [];
    cashTypeId: number;
    isLoading: boolean;
    savedColumnStates: ColumnState[];
    atlasAgGridParam: AtlasAgGridParam;
    userActiveDirectoryName: string;
    checkExportedFormat: boolean = false;
    company: string;
    formatType: string = 'en-US';
    excelStyles: any;
    cashGridOptions: agGrid.GridOptions = {
        enableSorting: true,
        enableFilter: true,
        suppressColumnVirtualisation: true,
        isExternalFilterPresent: () => true,
        doesExternalFilterPass: this.externalFilterPass.bind(this),
    };
    charters: CharterDisplayView[];
    masterData: MasterData;
    masterdataList: string[] = [
        MasterDataProps.Departments,
    ];
    gridCode = 'receiptList';
    additionalFilters: ListAndSearchFilter[] = [];
    defaultAdditionalFilters: ListAndSearchFilter[] = [];


    constructor(
        protected formConfigurationProvider: FormConfigurationProviderService,
        private executionService: ExecutionService,
        private uiService: UiService,
        private route: ActivatedRoute,
        protected masterdataService: MasterdataService,
        private formatDate: FormatDatePipe,
        protected executionActionsService: ExecutionActionsService,
        private authorizationService: AuthorizationService,
        private datePipe: DatePipe,
        @Inject(WINDOW) private window: Window,
        public gridService: AgGridService,
        public dataLoader: CashListReceiptDataLoader,

    ) {
        super(formConfigurationProvider);
        this.company = route.snapshot.paramMap.get('company');
        this.excelStyles = [
            {
                id: 'dateFormat',
                dataType: 'dateTime',
                numberFormat: {
                    format: 'dd/mm/yyyy',
                },
            },
        ];
        this.userActiveDirectoryName = this.authorizationService.getCurrentUser().samAccountName;
    }

    ngOnInit() {
        this.atlasAgGridParam = this.gridService.getAgGridParam();
        this.masterData = this.route.snapshot.data.masterdata;
    }

    externalFilterPass(node) {
        if (this.searchedValueCtrl.value) {
            const documentRef = node.data.documentReference.toUpperCase();
            return documentRef.toString().includes(this.searchedValueCtrl.value.toUpperCase());
        } else {
            return node.data.documentReference;
        }
    }

    getCashList() {
        this.initAdditionnalFilters();
    }

    onCashClicked(event) {
        let cashView: CashDisplayView = event.data;
        if ((cashView.cashTypeId === CashSelectionType.PaymentDifferentCurrency
            || cashView.cashTypeId === CashSelectionType.ReceiptDifferentCurrency)
            && cashView.paymentCashId) {
            // In case of cash diff ccy, we can only navigate to the payment cash
            const cash = new CashSummary();
            cash.cashId = cashView.paymentCashId;
            cash.costDirectionId = cashView.costDirectionId;
            cashView = new CashDisplayView(cash);
        }

        this.executionActionsService.displayCashSubject.next(cashView);
    }

    onCashRowClicked(event) {
        this.executionActionsService.displayCashSubject.next(event.data);
    }

    initAdditionnalFilters() {
        this.additionalFilters = [];
        if (this.listAndSearchComponent &&
            this.listAndSearchComponent.columnConfiguration &&
            this.listAndSearchComponent.columnConfiguration.length > 0) {

            const costDirectionId = this.listAndSearchComponent.columnConfiguration
                .find((column) => column.fieldName === 'CostDirectionId');

            const costDirectionIdfilter = new ListAndSearchFilter();
            costDirectionIdfilter.fieldId = costDirectionId.fieldId;
            costDirectionIdfilter.fieldName = costDirectionId.fieldName;

            costDirectionIdfilter.predicate = {
                filterType: ListAndSearchFilterType.Numeric,
                operator: 'eq',
                value1: this.cashTypeId.toString(),
            };

            costDirectionIdfilter.isActive = true;
            this.additionalFilters.push(costDirectionIdfilter);
            this.defaultAdditionalFilters = this.additionalFilters;
            this.listAndSearchComponent.waitBeforeLoadingData = false;
            this.listAndSearchComponent.additionalFilters = this.additionalFilters;
            this.listAndSearchComponent.loadData(true);
        } else {
            return;
        }
    }

    onSearchButtonClicked() {
        this.additionalFilters = this.defaultAdditionalFilters;

        const documentReferenceField = this.listAndSearchComponent.columnConfiguration
            .find((column) => column.fieldName === 'DocumentReference');

        const filter = new ListAndSearchFilter();
        filter.fieldId = documentReferenceField.fieldId;
        filter.fieldName = documentReferenceField.fieldName;
        filter.predicate = {
            filterType: ListAndSearchFilterType.Text,
            operator: 'eq',
            value1: this.searchedValueCtrl.value + '%',
        };
        filter.isActive = true;
        this.additionalFilters.push(filter);
        this.listAndSearchComponent.additionalFilters = this.additionalFilters;
        this.listAndSearchComponent.loadData(true);
    }
}
