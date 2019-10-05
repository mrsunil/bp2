import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as agGrid from 'ag-grid-community';
import { AgGridUserPreferencesComponent } from '../../../../../shared/components/ag-grid-user-preferences/ag-grid-user-preferences.component';
import { BaseFormComponent } from '../../../../../shared/components/base-form-component/base-form-component.component';
import { AtlasAgGridParam } from '../../../../../shared/entities/atlas-ag-grid-param.entity';
import { MasterData } from '../../../../../shared/entities/masterdata.entity';
import { UserGridPreferencesParameters } from '../../../../../shared/entities/user-grid-preferences-parameters.entity';
import { CashSelectionType } from '../../../../../shared/enums/cash-selection-type';
import { CashType } from '../../../../../shared/enums/cash-type.enum';
import { CharterDisplayView } from '../../../../../shared/models/charter-display-view';
import { FormatDatePipe } from '../../../../../shared/pipes/format-date-pipe.pipe';
import { AgGridService } from '../../../../../shared/services/ag-grid.service';
import { CashMatching } from '../../../../../shared/services/execution/dtos/cash-matching';
import { CashRecord } from '../../../../../shared/services/execution/dtos/cash-record';
import { CashSummaryGrid } from '../../../../../shared/services/execution/dtos/cash-summary-grid-record';
import { FormConfigurationProviderService } from '../../../../../shared/services/form-configuration-provider.service';
import { ExecutionService } from '../../../../../shared/services/http-services/execution.service';
import { UiService } from '../../../../../shared/services/ui.service';
import { CommonMethods } from '../../../../services/execution-cash-common-methods';

@Component({
    selector: 'atlas-invoice-grid-for-summary',
    templateUrl: './invoice-grid-for-summary.component.html',
    styleUrls: ['./invoice-grid-for-summary.component.scss'],
})
export class InvoiceGridForSummaryComponent extends BaseFormComponent implements OnInit {
    @ViewChild('userPreferences') userPreferencesComponent: AgGridUserPreferencesComponent;

    company: string;
    cashOption: boolean;
    cashTypeId: number;
    invoiceSummaryGridOptions: agGrid.GridOptions = {};
    invoiceSummaryGridColumns: agGrid.ColDef[];
    atlasAgGridParam: AtlasAgGridParam;
    gridColumnApi: agGrid.ColumnApi;
    invoiceSummaryGridRows: CashMatching[];
    cashSummaryvalues: CashSummaryGrid[];
    isGroupingEnabled: boolean = false;
    gridApi: agGrid.GridApi;
    documentTypePI: string = 'PI';
    documentTypeSI: string = 'SI';
    showGrid = true;
    charters: CharterDisplayView[];
    masterData: MasterData;

    gridPreferences: UserGridPreferencesParameters;

    constructor(protected formConfigurationProvider: FormConfigurationProviderService,
        protected formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private formatDate: FormatDatePipe,
        protected uiService: UiService,
        private executionService: ExecutionService,
        public gridService: AgGridService,
    ) {
        super(formConfigurationProvider);
    }

    ngOnInit() {
        this.atlasAgGridParam = this.gridService.getAgGridParam();
        this.cashTypeId = Number(this.route.snapshot.paramMap.get('cashTypeId'));
        this.cashOption = (this.cashTypeId === CashType.CashPayment ? true : false);
        this.initializeGridColumns();


        this.masterData = this.route.snapshot.data.masterdata;
    }
    onGridReady(params) {
        params.columnApi.autoSizeColumns();
        params.columnDefs = this.invoiceSummaryGridColumns;
        this.invoiceSummaryGridOptions = params;
        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;
        this.gridApi.showNoRowsOverlay();

        this.gridPreferences = null;
    }

    initializeGridColumns() {
        this.invoiceSummaryGridColumns = [
            {
                headerName: 'Document Reference',
                field: 'documentReference',
                colId: 'documentReference',
                pinned: 'left',
                hide: false,
            },
            {
                headerName: 'Secondary Document Reference',
                field: 'secondaryDocumentReference',
                colId: 'secondaryDocumentReference',
                hide: false,
            },
            {
                headerName: 'Document Date',
                field: 'documentDate',
                colId: 'documentDate',
                hide: false,
                valueFormatter: this.dateFormatter.bind(this),
            },
            {
                headerName: 'Value Date',
                field: 'valueDate',
                colId: 'valueDate',
                hide: false,
                valueFormatter: this.dateFormatter.bind(this),
            },
            {
                headerName: 'Department',
                field: 'departmentCode',
                colId: 'departmentCode',
                hide: false,
            },
            {
                headerName: 'External Reference',
                field: 'externalReference',
                colId: 'externalReference',
                hide: false,
            },
            {
                headerName: 'Narrative',
                field: 'narrative',
                colId: 'narrative',
                hide: false,
            },
            {
                headerName: 'Charter',
                field: 'charterCode',
                colId: 'charterCode',
                hide: false,
            },
            {
                headerName: 'Invoice Type',
                field: 'documentType',
                colId: 'documentType',
                hide: true,
            },
            {
                headerName: 'Amount',
                field: 'amount',
                type: 'numericColumn',
                colId: 'amount',
                hide: this.cashOption === false,
                valueGetter: this.getAmountValue,
                valueFormatter: this.amountFormatter.bind(this),
                pinned: 'right',
            },
            {
                headerName: 'Amount',
                field: 'amount',
                type: 'numericColumn',
                colId: 'amount',
                valueGetter: this.getAmountValueForReceipts,
                hide: this.cashOption === true,
                valueFormatter: this.amountFormatter.bind(this),
                pinned: 'right',
            },
            {
                headerName: 'Amount Paid',
                field: 'amountToBePaid',
                type: 'numericColumn',
                colId: 'amountToBePaid',
                hide: false,
                pinned: 'right',
                valueFormatter: this.amountFormatter.bind(this),
            },
            {
                headerName: 'Amount Paid in Diff CCY',
                field: 'amountPaidInDiffCcy',
                colId: 'amountPaidInDiffCcy',
                hide: true,
                valueFormatter: this.amountFormatter.bind(this),
                pinned: 'right',
            },
        ];
    }
    getAmountValueForReceipts(params) {
        const commonMethods = new CommonMethods();
        return params.data.amount *
            commonMethods.getSignedValueForDocumentAmountBasedOnDocumentTypeAndCostDirection
                (params.data.documentType, CashType.CashReceipt, params.data, true);
    }

    getAmountValue(params) {
        const commonMethods = new CommonMethods();
        return params.data.amount *
            commonMethods.getSignedValueForDocumentAmountBasedOnDocumentTypeAndCostDirection
                (params.data.documentType, CashType.CashPayment, params.data, true);
    }
    invoicesToBeSelected(invoices: CashMatching[]) {
        if (invoices.length > 0) {
            this.initializeGridColumns();
            const commonMethod = new CommonMethods();
            // fetch charter details
            this.executionService.getCharters()
                .subscribe((charterdata) => {
                    if (charterdata.value) {
                        this.charters = charterdata.value.map((charter) =>
                            new CharterDisplayView(charter));
                        invoices.forEach((item) => {
                            item.charterCode = commonMethod.getCharterReferenceBasedOnIdFromCharterList(item.charterId, this.charters);
                        });
                    }
                });
            invoices.forEach((item) => {
                item.departmentCode = commonMethod.getDepartmentCodeDescriptionBasedOnIdFromMasterData
                    (item.departmentId, this.masterData);
            });
            this.invoiceSummaryGridRows = invoices;

        }
    }
    dateFormatter(param) {
        if (param.value) { return this.formatDate.transform(param.value); }
    }

    amountFormatter(param) {
        if (param.value) {
            const commonMethods = new CommonMethods();
            return commonMethods.getFormattedNumberValue(param.value);
        }
    }
    invoicesToBeSelectedForSummary(invoices: CashMatching[], summaryRecord: CashSummaryGrid[]) {
        this.invoiceSummaryGridRows = this.getInvoicesForSummary(summaryRecord);
        this.initializeGridColumnsFromSummary();
    }
    getInvoicesForSummary(summaryRecord) {
        const invoices: CashMatching[] = [];
        if (summaryRecord) {
            const invoice = new CashMatching();
            invoice.documentReference = summaryRecord.documentReference;
            invoice.secondaryDocumentReference = summaryRecord.secondaryDocumentReference;
            invoice.documentDate = summaryRecord.documentDate;
            invoice.valueDate = summaryRecord.valueDate;
            invoice.documentNarrativeCode = summaryRecord.documentNarrativeCode;
            invoice.amount = summaryRecord.amount;
            invoice.amountToBePaid = summaryRecord.amountToBePaid;
            invoice.departmentId = summaryRecord.departmentId;
            invoice.currencyCode = summaryRecord.currencyCode;
            invoice.documentType = summaryRecord.documentType;
            invoices.push(invoice);
        }
        return invoices;
    }
    initializeGridColumnsFromSummary() {
        this.invoiceSummaryGridColumns = [
            {
                headerName: 'Document Reference',
                field: 'documentReference',
                colId: 'documentReference',
                hide: false,
            },
            {
                headerName: 'Secondary Document Reference',
                field: 'secondaryDocumentReference',
                colId: 'secondaryDocumentReference',
                hide: false,
            },
            {
                headerName: 'Document Date',
                field: 'documentDate',
                colId: 'documentDate',
                hide: false,
                valueFormatter: this.dateFormatter.bind(this),
            },
            {
                headerName: 'Value Date',
                field: 'valueDate',
                colId: 'valueDate',
                hide: false,
                valueFormatter: this.dateFormatter.bind(this),
            },
            {
                headerName: 'Department',
                field: 'departmentCode',
                colId: 'departmentCode',
                hide: false,
            },
            {
                headerName: 'External Reference',
                field: 'externalReference',
                colId: 'externalReference',
                hide: false,
            },
            {
                headerName: 'Narrative',
                field: 'narrative',
                colId: 'narrative',
                hide: false,
            },
            {
                headerName: 'Charter',
                field: 'charterCode',
                colId: 'charterCode',
                hide: false,
            },
            {
                headerName: 'Invoice Type',
                field: 'documentType',
                colId: 'documentType',
                hide: true,
            },
            {
                headerName: 'Amount',
                field: 'amount',
                colId: 'amount',
                hide: false,
                valueGetter: this.getAmountValue,
                valueFormatter: this.amountFormatter.bind(this),
                pinned: 'right',
            },
            {
                headerName: 'Amount Paid',
                field: 'amountToBePaid',
                colId: 'amountToBePaid',
                hide: false,
                valueFormatter: this.amountFormatter.bind(this),
                pinned: 'right',
            },

        ];
    }

    initForm(entity: CashRecord, isEdit: boolean): any {
        if (!entity.documentMatchings ||
            (entity.documentMatchings && entity.documentMatchings.length === 0)) {
            this.showGrid = false;
        } else {
            if (entity.cashTypeId === CashSelectionType.PaymentDifferentCurrency ||
                entity.cashTypeId === CashSelectionType.ReceiptDifferentCurrency) {
                this.invoicesToBeSelected(this.calculateAmountToBePaidinDifferenceCurrency(entity));
            } else {
                this.invoicesToBeSelected(entity.documentMatchings);
            }
        }
        return entity;

    }

    calculateAmountToBePaidinDifferenceCurrency(values: CashRecord) {

        if (values.documentMatchings && values.documentMatchings.length > 0) {
            values.documentMatchings.forEach((item) => item.amountPaidInDiffCcy =
                values.matchingRateType === 'M'
                    ? item.amountToBePaid * values.matchingRate
                    : item.amountToBePaid / values.matchingRate);
        }
        return values.documentMatchings;
    }
}
