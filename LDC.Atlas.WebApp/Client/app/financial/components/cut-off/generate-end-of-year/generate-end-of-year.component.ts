import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { MatDatepicker, MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import * as agGrid from 'ag-grid-community';
import * as _moment from 'moment';
import { CompanyManagerService } from '../../../../core/services/company-manager.service';
import { inDropdownListValidator } from '../../../../shared/directives/autocomplete-dropdown.directive';
import { AtlasAgGridParam } from '../../../../shared/entities/atlas-ag-grid-param.entity';
import { AtlasFormControl } from '../../../../shared/entities/atlas-form-control';
import { MasterData } from '../../../../shared/entities/masterdata.entity';
import { NominalAccount } from '../../../../shared/entities/nominal-account.entity';
import { YearEndProcessDisplayView } from '../../../../shared/models/year-end-process-display-view';
import { AgGridService } from '../../../../shared/services/ag-grid.service';
import { YearEndProcessCommand } from '../../../../shared/services/execution/year-end-process-command';
import { ExecutionService } from '../../../../shared/services/http-services/execution.service';
import { SnackbarService } from '../../../../shared/services/snackbar.service';
import { nameof } from '../../../../shared/services/util.service';
import { GenerateEndOfYearWarningMessageComponent } from './cards/generate-end-of-year-warning-message/generate-end-of-year-warning-message.component';

@Component({
    selector: 'atlas-generate-end-of-year',
    templateUrl: './generate-end-of-year.component.html',
    styleUrls: ['./generate-end-of-year.component.scss'],
})
export class GenerateEndOfYearComponent implements OnInit {
    yearCtrl = new AtlasFormControl('year');
    finalRunCtrl = new AtlasFormControl('finalRunCtrl');
    reserveAccountCtrl = new AtlasFormControl('reserveAccountCtrl');
    filteredNominalAccounts: NominalAccount[];
    filteredReserveAccounts: NominalAccount[];
    masterdata: MasterData;
    maxYear = new Date(2019, 12, 31);
    company: string;
    yearEndGridOptions: agGrid.GridOptions = {};
    yearEndGridRows: YearEndProcessDisplayView[];
    yearEndGridColumns: agGrid.ColDef[];
    gridColumnApi: agGrid.ColumnApi;
    atlasAgGridParam: AtlasAgGridParam;
    year: number;
    isDisplayButtonClicked: boolean = false;
    isFinalRunEnable: boolean = false;
    isCompanyFrozen: boolean = false;

    yearErrorMap: Map<string, string> = new Map()
        .set('required', 'Required *');

    reserveAccountErrorMap: Map<string, string> = new Map()
        .set('required', 'Required *')
        .set('inDropdownList', 'Invalid entry. Department not in the list or not authorized.');

    constructor(protected route: ActivatedRoute,
        private companyManager: CompanyManagerService,
        private executionService: ExecutionService,
        protected snackbarService: SnackbarService,
        protected dialog: MatDialog,
        public gridService: AgGridService) {
        this.company = this.companyManager.getCurrentCompanyId();
        this.atlasAgGridParam = this.gridService.getAgGridParam();
    }

    ngOnInit() {
        this.masterdata = this.route.snapshot.data.masterdata;
        let value: NominalAccount;
        value = this.masterdata.nominalAccounts.find((e) => e.accountNumber === '32001000');
        this.reserveAccountCtrl.patchValue(value.accountNumber);
        this.filteredNominalAccounts = this.masterdata.nominalAccounts.filter((e) => e.accountType !== 'P');
        this.filteredNominalAccounts = this.filteredNominalAccounts.map(
            (nominal) => {
                nominal.accountNumber = nominal.accountNumber;
                nominal.mainAccountTitle = nominal.shortDescription;
                return nominal;
            });

        this.filteredReserveAccounts = this.filteredNominalAccounts;
        this.setValidators();
        this.initializeGridColumns();
        this.isCompanyFrozen = this.companyManager.getCompany(this.company).isFrozen;
    }

    onFinalRunButtonClicked() {
        this.isFinalRunEnable = this.isFinalRunEnable ? false : true;
    }
    onGridReady(params) {

        this.yearEndGridOptions.api = params.api;
        this.gridColumnApi = params.columnApi;
        params.columnDefs = this.yearEndGridColumns;
        this.yearEndGridOptions = params;
        this.gridService.sizeColumns(params);
    }

    initializeGridColumns() {

        this.yearEndGridColumns = [
            {
                headerName: 'Nominal Account',
                field: 'accountNumber',
                colId: 'accountNumber',
                hide: false,
                editable: false,
            },

            {
                headerName: 'Account Description',
                field: 'mainAccountTitle',
                colId: 'mainAccountTitle',
                hide: false,
                editable: false,
            },
            {
                headerName: 'Ccy',
                field: 'currencyCode',
                colId: 'currencyCode',
                hide: false,
                editable: false,

            },
            {
                headerName: 'USD EQ',
                field: 'valueInFunctionalCurrency',
                colId: 'valueInFunctionalCurrency',
                hide: false,
                editable: false,
            },
            {
                headerName: 'CHF EQ',
                field: 'valueInStatutoryCurrency',
                colId: 'valueInStatutoryCurrency',
                type: 'numericColumn',
                hide: false,
                editable: false,
            },

            {
                headerName: 'Department',
                field: 'departmentId',
                colId: 'departmentId',
                hide: false,
                editable: false,
                valueFormatter: this.departmentFormatter.bind(this),
            },
        ];
    }

    departmentFormatter(params) {
        const department = this.masterdata.departments.find((dept) => dept.departmentId === params.value);
        return department ? department.description : '';
    }

    setValidators() {
        this.reserveAccountCtrl.setValidators(
            Validators.compose([Validators.required,
            inDropdownListValidator(
                this.masterdata.nominalAccounts,
                nameof<NominalAccount>('accountNumber'),
            ),
            ]),
        );
        this.yearCtrl.setValidators(Validators.required);
    }

    onDisplayPLClearanceButtonClicked() {

        if (this.yearCtrl.value) {
            this.year = this.yearCtrl.value._i.year;
            this.executionService
                .GetYearEndProcessLines(this.year)
                .subscribe(((data) => {
                    if (data.value) {
                        this.yearEndGridRows = data.value;
                        if (!this.isCompanyFrozen) {
                            this.isDisplayButtonClicked = true;

                        }

                    }
                }),
                );
        }
    }

    onPostingButtonClicked() {
        const yearEndProcessCommand = new YearEndProcessCommand();
        yearEndProcessCommand.year = this.year;
        yearEndProcessCommand.isFinalRun = this.isFinalRunEnable;
        if (this.reserveAccountCtrl.value) {
            const nominalAccount = this.filteredNominalAccounts.find((value) =>
                value.accountNumber === this.reserveAccountCtrl.value);
            if (nominalAccount) {
                yearEndProcessCommand.bsReserveAccountId = nominalAccount.nominalAccountId;
            }
        }
        this.executionService
            .GenerateYearEndProcessPostingReport(yearEndProcessCommand)
            .subscribe(((data) => {
                if (data) {
                    const accountingImportReportMsgDialog = this.dialog.open(GenerateEndOfYearWarningMessageComponent, {
                        data,
                        width: '80%',
                        height: '80%',
                    });
                }
            }),
            );
    }
}
