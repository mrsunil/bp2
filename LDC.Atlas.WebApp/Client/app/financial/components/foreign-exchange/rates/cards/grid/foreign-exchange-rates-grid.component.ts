import { DatePipe } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { CellValueChangedEvent, ColDef, ColumnApi, GridOptions } from 'ag-grid-community';
import { finalize, map } from 'rxjs/operators';
import { AuthorizationService } from '../../../../../../core/services/authorization.service';
import { FormatDatePipe } from '../../../../../../shared/pipes/format-date-pipe.pipe';
import { AgGridService } from '../../../../../../shared/services/ag-grid.service';
import { CellEditorAtlasNumericComponent } from './../../../../../../shared/components/cell-editor-numeric/cell-editor-atlas-numeric/cell-editor-atlas-numeric.component';
import { ConfirmationDialogComponent } from './../../../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { AtlasAgGridParam } from './../../../../../../shared/entities/atlas-ag-grid-param.entity';
import { AtlasNumber } from './../../../../../../shared/entities/atlas-number.entity';
import { ForeignExchangeRateDisplayView } from './../../../../../../shared/entities/foreign-exchange-rate-display-view.entity';
import { ForeignExchangeRate } from './../../../../../../shared/entities/foreign-exchange/foreign-exchange-rate.entity';
import { ForeignExchangeRateCreationMode } from './../../../../../../shared/enums/foreign-exchange-rate-creationmode.enum';
import { ForeignExchangeRateViewMode } from './../../../../../../shared/enums/foreign-exchange-rate-viewmode.enum';
import { PermissionLevels } from './../../../../../../shared/enums/permission-level.enum';
import { CustomNumberMask } from './../../../../../../shared/numberMask';
import { ApiCollection } from './../../../../../../shared/services/common/models';
import { ForeignExchangeService } from './../../../../../../shared/services/http-services/foreign-exchange.service';
import { SnackbarService } from './../../../../../../shared/services/snackbar.service';
import { UiService } from './../../../../../../shared/services/ui.service';
import { FxRatesSelectedType } from './../../../../../entities/fx-rates-selected-type.entity';

@Component({
    selector: 'atlas-foreign-exchange-rates-grid',
    templateUrl: './foreign-exchange-rates-grid.component.html',
    styleUrls: ['./foreign-exchange-rates-grid.component.scss'],
    providers: [DatePipe],
})
export class ForeignExchangeRatesGridComponent implements OnInit {
    selectedViewParams: FxRatesSelectedType = new FxRatesSelectedType();
    company: string;
    editMode = false;

    @Output() readonly editClicked = new EventEmitter<boolean>();

    // Grid variables
    atlasAgGridParam: AtlasAgGridParam;
    gridOptions: GridOptions;
    columnApi: ColumnApi;
    userActiveDirectoryName: string;
    checkExportedFormat: boolean = false;
    excelStyles: any;
    PermissionLevels = PermissionLevels;
    gridComponents = {
        atlasNumericCellEditor: CellEditorAtlasNumericComponent,
    };
    cellEditorParamsPositif = {
        displayMask: CustomNumberMask(12, 10, false),
        isRightAligned: false,
    };
    cellEditorParamsPositifAndNegatif = {
        displayMask: CustomNumberMask(12, 10, true),
        isRightAligned: false,
    };
    rowClassRules = {
        bold: (params) => {
            return params.data.highlight;
        },
    };

    columnDefs: ColDef[] = [
        {
            headerName: 'Currency',
            colId: 'currencyCode',
            field: 'currencyCode',
        },
        {
            headerName: 'Description',
            colId: 'description',
            field: 'currencyDescription',
        },
        {
            headerName: 'Rate Type',
            colId: 'rateType',
            field: 'rateType',
        },
        {
            headerName: 'Date',
            colId: 'date',
            field: 'date',
            valueFormatter: (params) => this.uiService.dateFormatter(params),
            cellClass: 'dateFormat',
            valueGetter: (params) => {
                const dateFormat: FormatDatePipe = this.formatDate;
                const val = dateFormat.transformdate(params.data.date);

                if (val) {
                    if (val.indexOf('/') < 0) {
                        return val;
                    } else {
                        const split = val.split('/');
                        return split[2] + '-' + split[1] + '-' + split[0];
                    }
                }
            },
        },
        {
            headerName: 'ROE to USD',
            colId: 'exchangeRate',
            field: 'exchangeRate',
            cellEditor: 'atlasNumericCellEditor',
            cellEditorParams: this.cellEditorParamsPositif,
            editable: this.isCellEditable.bind(this),
            cellStyle: { textAlign: 'left' },
        },
        {
            headerName: '1 month',
            colId: 'oneMonthForwardPeriodPoints',
            field: 'oneMonthForwardPeriodPoints',
            cellEditor: 'atlasNumericCellEditor',
            cellEditorParams: this.cellEditorParamsPositifAndNegatif,
            editable: this.isCellEditable.bind(this),
            cellStyle: { textAlign: 'left' },
        },
        {
            headerName: '2 month',
            colId: 'twoMonthsForwardPeriodPoints',
            field: 'twoMonthsForwardPeriodPoints',
            cellEditor: 'atlasNumericCellEditor',
            cellEditorParams: this.cellEditorParamsPositifAndNegatif,
            editable: this.isCellEditable.bind(this),
            cellStyle: { textAlign: 'left' },
        },
        {
            headerName: '3 month',
            colId: 'threeMonthsForwardPeriodPoints',
            field: 'threeMonthsForwardPeriodPoints',
            cellEditor: 'atlasNumericCellEditor',
            cellEditorParams: this.cellEditorParamsPositifAndNegatif,
            editable: this.isCellEditable.bind(this),
            cellStyle: { textAlign: 'left' },
        },
        {
            headerName: '6 month',
            colId: 'sixMonthsForwardPeriodPoints',
            field: 'sixMonthsForwardPeriodPoints',
            cellEditor: 'atlasNumericCellEditor',
            cellEditorParams: this.cellEditorParamsPositifAndNegatif,
            editable: this.isCellEditable.bind(this),
            cellStyle: { textAlign: 'left' },
        },
        {
            headerName: '1 year',
            colId: 'oneYearForwardPeriodPoints',
            field: 'oneYearForwardPeriodPoints',
            cellEditor: 'atlasNumericCellEditor',
            cellEditorParams: this.cellEditorParamsPositifAndNegatif,
            editable: this.isCellEditable.bind(this),
            cellStyle: { textAlign: 'left' },
        },
        {
            headerName: '2 year',
            colId: 'twoYearForwardPeriodPoints',
            field: 'twoYearForwardPeriodPoints',
            cellEditor: 'atlasNumericCellEditor',
            cellEditorParams: this.cellEditorParamsPositifAndNegatif,
            editable: this.isCellEditable.bind(this),
            cellStyle: { textAlign: 'left' },
        },
        {
            headerName: 'Time',
            colId: 'time',
            field: 'time',
        },
        {
            headerName: 'Creation Mode',
            colId: 'creationMode',
            field: 'creationMode',
        },
        {
            headerName: 'Last Amended by',
            colId: 'lastAmendmentBy',
            field: 'lastAmendmentBy',
        },
        {
            headerName: 'Last Amended on',
            colId: 'lastAmendmentOn',
            field: 'lastAmendmentOn',
            valueFormatter: this.uiService.dateFormatter,
            cellClass: 'dateFormat',
            valueGetter: (params) => {
                const dateFormat: FormatDatePipe = this.formatDate;
                const val = dateFormat.transformdate(params.data.lastAmendmentOn);

                if (val) {
                    if (val.indexOf('/') < 0) {
                        return val;
                    } else {
                        const split = val.split('/');
                        return split[2] + '-' + split[1] + '-' + split[0];
                    }
                }
            },
        },
    ];

    fxRates: ForeignExchangeRateDisplayView[] = [];
    rowData: ForeignExchangeRateDisplayView[] = [];
    ForeignExchangeRateViewMode = ForeignExchangeRateViewMode;

    isLoading = true;

    constructor(private uiService: UiService,
        private foreignExchangeService: ForeignExchangeService,
        private route: ActivatedRoute,
        private snackbarService: SnackbarService,
        private formatDate: FormatDatePipe,
        private datePipe: DatePipe,
        protected dialog: MatDialog,
        private authorizationService: AuthorizationService,
        public gridService: AgGridService,
    ) {
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
        this.company = route.snapshot.paramMap.get('company');
    }

    ngOnInit() {
        this.atlasAgGridParam = this.gridService.getAgGridParam();
    }

    onGridReady(params) {
        params.columnDefs = this.columnDefs;
        this.gridOptions = params;
        this.gridOptions.api.setRowData(this.rowData);
        this.columnApi = params.columnApi;

        this.autoSizeGridHeader();
    }

    autoSizeGridHeader() {
        this.columnApi.autoSizeColumns(this.columnDefs.map((column) => column.field));
    }

    onGridSizeChanged(params) {
        this.autoSizeGridHeader();
    }

    updateGrid(selectedViewParams: FxRatesSelectedType): void {
        const dataHasToBeLoaded = this.selectedViewParams.date !== selectedViewParams.date ||
            this.selectedViewParams.type !== selectedViewParams.type;
        this.selectedViewParams = selectedViewParams;
        if (dataHasToBeLoaded) {
            this.getData();
        } else {
            this.viewChanged();
        }
    }

    /* dateHide(): void {
         if (this.gridOptions && this.gridOptions.columnApi) {
             this.columnDefs.filter((column) => column.colId === 'date')
                 .map((column) => column.hide = this.selectedViewParams.type === ForeignExchangeRateViewMode.Daily);
             this.gridOptions.columnApi.setColumnVisible('date', this.selectedViewParams.type !== ForeignExchangeRateViewMode.Daily);
         }
     }*/

    getData(dataToHilight: ForeignExchangeRate[] = []) {
        this.isLoading = true;
        this.rowData = [];
        this.foreignExchangeService.getForeignExchangeRates(this.selectedViewParams.date.toDate(), this.selectedViewParams.type, this.selectedViewParams.inactiveCurrencies)
            .pipe(
                map((result: ApiCollection<ForeignExchangeRate>) => {
                    this.fxRates = result.value
                        .map((foreignExchangeRate: ForeignExchangeRate) => {
                            const rateLoaded = new ForeignExchangeRateDisplayView(foreignExchangeRate);
                            if (dataToHilight.filter((data) => data.currencyCode === rateLoaded.currencyCode).length > 0) {
                                rateLoaded.highlight = true;
                            }
                            return rateLoaded;
                        });
                }),
                finalize(() => {
                    this.isLoading = false;
                })).subscribe(() => {
                    this.viewChanged();
                });
    }

    viewChanged() {
        this.rowData = !this.selectedViewParams.inactiveCurrencies ?
            this.fxRates.filter((rate) => !rate.isInactive) : this.fxRates;

        if (this.gridOptions && this.gridOptions.api) {
            this.gridOptions.api.setRowData(this.rowData);
        }
    }

    isCellEditable(params): boolean {
        if (!this.editMode || params.colDef.colId === 'exchangeRate') {
            return this.editMode;
        }

        let result = false;

        const rowData: ForeignExchangeRateDisplayView = params.data;
        if (rowData.exchangeRate) {
            const exchangeRate = new AtlasNumber(rowData.exchangeRate);
            if (exchangeRate.strictlyBiggerThan(0)) {
                result = true;
            }

        }
        return result;
    }

    onEditButtonClicked() {
        this.editMode = !this.editMode;
        this.editClicked.emit(this.editMode);
        if (this.editMode) {
            this.viewChanged();
        } else {
            this.getData();
        }
    }

    onSaveButtonClicked() {
        this.editMode = false;

        const rowsToSave: ForeignExchangeRate[] = this.rowData
            .filter((row: ForeignExchangeRateDisplayView) => row.isTouched)
            .map((row: ForeignExchangeRateDisplayView) => {
                const rate: ForeignExchangeRate = {
                    currencyCode: row.currencyCode,
                    currencyDescription: row.currencyDescription,
                    currencyRoeType: row.rateType,
                    date: this.selectedViewParams.date.toDate(),
                    rate: row.exchangeRate,
                    fwdMonth1: row.oneMonthForwardPeriodPoints,
                    fwdMonth2: row.twoMonthsForwardPeriodPoints,
                    fwdMonth3: row.threeMonthsForwardPeriodPoints,
                    fwdMonth6: row.sixMonthsForwardPeriodPoints,
                    fwdYear1: row.oneYearForwardPeriodPoints,
                    fwdYear2: row.twoYearForwardPeriodPoints,
                    currencyIsDeactivated: row.isInactive,
                    createdBy: null,
                    createdDateTime: null,
                    modifiedBy: null,
                    modifiedDateTime: null,
                    creationMode: ForeignExchangeRateCreationMode[ForeignExchangeRateCreationMode.Manual],
                    time: null,
                };
                return rate;
            });

        this.foreignExchangeService.importForeignExchangeRates(rowsToSave).subscribe(() => {
            this.getData(rowsToSave);
        });
    }

    onDiscardButtonClicked() {
        const confirmDiscardDialog = this.dialog.open(ConfirmationDialogComponent, {
            data: {
                title: 'Discard Changes',
                text: 'You have some modification pending. Close and lose changes?',
                okButton: 'Ok',
                cancelButton: 'Cancel',
            },
        });
        confirmDiscardDialog.afterClosed().subscribe((answer) => {
            if (answer) {
                this.editMode = false;
                this.getData();
            }
        });
    }

    onCellValueChanged(event: CellValueChangedEvent) {
        const row = event.data;
        const isBiggerThanZero = (new AtlasNumber(row.exchangeRate)).strictlyBiggerThan(0);

        if (!row.exchangeRate || !isBiggerThanZero) {
            row.oneMonthForwardPeriodPoints = null;
            row.oneYearForwardPeriodPoints = null;
            row.sixMonthsForwardPeriodPoints = null;
            row.threeMonthsForwardPeriodPoints = null;
            row.twoMonthsForwardPeriodPoints = null;
            row.twoYearForwardPeriodPoints = null;
        }
        row.isTouched = true;

        this.gridOptions.api.setRowData(this.fxRates);
    }
    onExportButtonClickedAsExcel() {
        const screenName: string = 'FX Rates';
        const now = new Date();
        const todayDate = this.datePipe.transform(now, 'yyyyMMdd_hhmm').toString().toUpperCase();
        const params = {
            fileName: todayDate + '_' + this.company + '_' + screenName + '_' + this.userActiveDirectoryName + '.xlsx',
        };
        this.gridOptions.api.exportDataAsExcel(params);
    }
    onExportButtonClickedAsCSV() {
        const screenName: string = 'FX Rates';
        const now = new Date();
        const todayDate = this.datePipe.transform(now, 'yyyyMMdd_hhmm').toString().toUpperCase();
        const params = {
            fileName: todayDate + '_' + this.company + '_' + screenName + '_' + this.userActiveDirectoryName + '.csv',
        };
        this.gridOptions.api.exportDataAsCsv(params);
    }
}
