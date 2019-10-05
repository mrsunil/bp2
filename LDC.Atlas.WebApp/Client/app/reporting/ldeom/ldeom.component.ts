import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatStepper } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import * as agGrid from 'ag-grid-community';
import { ConfirmationDialogComponent } from '../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { AtlasAgGridParam } from '../../shared/entities/atlas-ag-grid-param.entity';
import { LdeomAccrual } from '../../shared/entities/ldeom-accrual.entity';
import { LdeomAggregation } from '../../shared/entities/ldeom-aggregation.entity';
import { AgGridService } from '../../shared/services/ag-grid.service';
import { LdeomPostingResult } from '../../shared/services/controlling/dtos/ldeom-posting';
import { ControllingService } from '../../shared/services/http-services/controlling.service';
import { SecurityService } from '../../shared/services/security.service';
import { SnackbarService } from '../../shared/services/snackbar.service';
import { TitleService } from '../../shared/services/title.service';

@Component({
    selector: 'atr-ldeom',
    templateUrl: './ldeom.component.html',
    styleUrls: ['./ldeom.component.scss'],
})
export class LdeomComponent implements OnInit {
    company: string;

    isLinear = false;
    // Accrual Table
    accrualFormGroup: FormGroup;
    accrualGridApi: agGrid.GridApi;
    accrualGridOptions: agGrid.GridOptions;
    accrualGridColumnApi: agGrid.ColumnApi;
    accrualGridCols: agGrid.ColDef[];
    accrualGridRows: LdeomAccrual[];
    accrualDomLayout = 'autoHeight';

    // Aggregation Table
    aggregationFormGroup: FormGroup;
    aggregationGridApi: agGrid.GridApi;
    aggregationGridColumnApi: agGrid.ColumnApi;
    aggregationGridCols: agGrid.ColDef[];
    aggregationGridRows: LdeomAggregation[];
    aggregationDomLayout = 'autoHeight';

    // Posting result
    postingResult: LdeomPostingResult = new LdeomPostingResult();

    atlasAgGridParam: AtlasAgGridParam;

    constructor(private securityService: SecurityService,
        private formBuilder: FormBuilder,
        private controllingService: ControllingService,
        private route: ActivatedRoute,
        private router: Router,
        private dialog: MatDialog,
        private snackbarService: SnackbarService,
        public gridService: AgGridService,
        private titleService: TitleService,
    ) {
        this.accrualGridOptions = {} as agGrid.GridOptions;
    }

    ngOnInit() {
        this.company = this.route.snapshot.paramMap.get('company');
        this.titleService.setTitle(this.route.snapshot.data.title);

        this.accrualFormGroup = this.formBuilder.group({
            empty: ['', Validators.required],
        });
        this.aggregationFormGroup = this.formBuilder.group({
            secondCtrl: ['', Validators.required],
        });

        this.securityService.isSecurityReady().subscribe(() => {
            this.getAccrualsData();
            this.initAccrualsGridColumns();

            this.getAggregationsData();
            this.initAggregationsGridColumns();

        });

        this.atlasAgGridParam = this.gridService.getAgGridParam();

        // this.accrualGridOptions.getRowHeight = params => {
        //     return 30;
        // }
    }

    getAccrualsData() {
        this.controllingService.getAccrualsForLdeomReport().subscribe((data) => {
            this.accrualGridRows = data.map((accrual) => {
                const ac = new LdeomAccrual(accrual);
                return new LdeomAccrual(ac);
            });
        });
    }

    getAggregationsData() {
        this.controllingService.getAggregationsForLdeomReport().subscribe((data) => {
            this.aggregationGridRows = data;

        });
    }

    initAccrualsGridColumns() {
        this.accrualGridCols = [
            {
                headerName: 'Department',
                field: 'departmentCode',
                cellClass: '',
                cellStyle: (params) => params.data.isHeaderLine() || params.data.isTotalHeaderLine() ? { 'line-height': '30px', 'font-weight': 'bold', 'overflow': 'visible', 'background-color': 'white !important' } : { 'line-height': '30px', 'background-color': 'white !important' },
                valueGetter: (params) => params.data.isTotalHeaderLine() ? 'Total Dept ' + params.data.departmentCode : params.data.isTotalLine() ? '' : params.data.isHeaderLine() ? params.data.departmentDescription : params.data.departmentCode,
                // colSpan(params) { return params.data.isHeaderLine() ? 2 : 1; }
            },
            {
                headerName: 'Contract',
                // valueGetter: params => this.showContractLabel(params.data),
                valueGetter: (params) => params.data.contractLabel,
                cellClass: '',
                cellStyle: { 'line-height': '30px', 'background-color': 'white !important' },
            },
            {
                headerName: 'Cost Type',
                field: 'costType',
                cellClass: '',
                cellStyle: { 'line-height': '30px', 'background-color': 'white !important' },
            },
            {
                headerName: 'Quantity',
                cellClass: '',
                valueGetter: (params) => params.data.isHeaderLine() || params.data.isTotalHeaderLine() ? '' : this.quantityFormatter(params.data.quantity),
                cellStyle: { 'textAlign': 'right', 'line-height': '30px', 'background-color': 'white !important' },
            },
            {
                headerName: 'Currency',
                field: 'currency',
                cellClass: '',
                cellStyle: { 'line-height': '30px', 'background-color': 'white !important' },
            },
            {
                headerName: 'Full Value',
                cellClass: '',
                valueGetter: (params) => params.data.isHeaderLine() || params.data.isTotalHeaderLine() ? '' : this.currencyFormatter(params.data.fullValue),
                cellStyle: { 'textAlign': 'right', 'line-height': '30px', 'background-color': 'white !important' },
            },
            {
                headerName: 'Invoiced',
                cellClass: '',
                valueGetter: (params) => params.data.isHeaderLine() || params.data.isTotalHeaderLine() ? '' : this.currencyFormatter(params.data.invoicedValue),
                cellStyle: { 'textAlign': 'right', 'line-height': '30px', 'background-color': 'white !important' },
            },
            {
                headerName: 'Accrue',
                cellClass: '',
                valueGetter: (params) => params.data.isHeaderLine() || params.data.isTotalHeaderLine() ? '' : this.currencyFormatter(params.data.accrueAmount),
                cellStyle: { 'textAlign': 'right', 'line-height': '30px', 'background-color': 'white !important' },
            },
            {
                headerName: 'Counterparty',
                field: 'associatedClient',
                cellClass: '',
                cellStyle: { 'line-height': '30px', 'background-color': 'white !important' },
            },
            {
                headerName: 'Charter',
                field: 'charterReference',
                cellClass: '',
                cellStyle: { 'line-height': '30px', 'background-color': 'white !important' },
            },
        ];
    }

    initAggregationsGridColumns() {
        this.aggregationGridCols = [
            {
                headerName: 'Account',
                field: 'accountReference',
                cellClass: '',
                cellStyle: { 'line-height': '30px' },
            },
            {
                headerName: 'Expense Code',
                field: 'expenseCode',
                cellClass: '',
                cellStyle: { 'line-height': '30px' },
            },
            {
                headerName: 'Dept',
                field: 'departmentCode',
                cellClass: '',
                cellStyle: { 'line-height': '30px' },
            },
            {
                headerName: 'Currency',
                field: 'currencyCode',
                cellClass: '',
                cellStyle: { 'line-height': '30px' },
            },
            {
                headerName: 'Amount',
                field: 'creditDebit',
                cellClass: '',
                valueGetter: (params) => new String(parseFloat(params.data.amount).toFixed(2)).concat(params.data.creditDebit === 'Credit'
                    ? ' CR'
                    : '   '),
                cellStyle: { 'textAlign': 'right', 'line-height': '30px' },
            },
            {
                headerName: 'Quantity',
                field: 'quantity',
                cellClass: '',
                cellStyle: { 'textAlign': 'right', 'line-height': '30px' },
                valueGetter: (params) => this.quantityFormatter(params.data.quantity),

            },
        ];
    }

    onAccrualGridReady(params) {
        this.accrualGridApi = params.api;
        this.accrualGridColumnApi = params.columnApi;
        this.accrualGridColumnApi.autoSizeAllColumns();

        window.onresize = () => {
            this.accrualGridColumnApi.autoSizeAllColumns();
        };
    }

    onAggregationGridReady(params) {
        this.aggregationGridApi = params.api;
        this.aggregationGridColumnApi = params.columnApi;
        this.aggregationGridColumnApi.autoSizeAllColumns();

        window.onresize = () => {
            this.aggregationGridColumnApi.autoSizeAllColumns();
        };
    }

    currencyFormatter(number) {
        if (isNaN(number) || number === null) { return ''; }
        return new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(number);
    }

    quantityFormatter(number) {
        if (isNaN(number) || number === null) { return ''; }
        return new Intl.NumberFormat('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 4 }).format(number);
    }

    showContractLabel(accrual) {
        return accrual.costType === 'Purchase' || accrual.costType === 'Sale' ? accrual.contractLabel : '';
    }

    goForward(stepper: MatStepper) {
        const confirmDialog = this.dialog.open(ConfirmationDialogComponent, {
            data: {
                title: 'LDEOM Posting',
                text: `Do you want to proceed?`,
                okButton: 'Yes',
                cancelButton: 'No',
            },
        });
        confirmDialog.afterClosed().subscribe((answer) => {
            if (answer) {
                this.createPosting();
                stepper.next();
            }
        });
    }

    createPosting() {
        this.snackbarService.throwErrorSnackBar('Ldeom Posting was not created. Functionnality is not implemented yet');
    }

    goToPreAccouting() {
        this.router.navigate(['/' + this.company + '/pre-accounting/search/' + this.postingResult.documentId]);
    }
}
