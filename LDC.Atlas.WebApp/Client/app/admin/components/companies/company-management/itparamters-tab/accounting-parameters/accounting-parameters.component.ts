import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import * as agGrid from 'ag-grid-community';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { CompanyManagerService } from '../../../../../../core/services/company-manager.service';
import { BaseFormComponent } from '../../../../../../shared/components/base-form-component/base-form-component.component';
import { CellEditorNumericComponent } from '../../../../../../shared/components/cell-editor-numeric/cell-editor-numeric.component';
import { AccountingParameter } from '../../../../../../shared/entities/accounting-parameter.entity';
import { AtlasAgGridParam } from '../../../../../../shared/entities/atlas-ag-grid-param.entity';
import { AtlasFormControl } from '../../../../../../shared/entities/atlas-form-control';
import { MasterData } from '../../../../../../shared/entities/masterdata.entity';
import { WINDOW } from '../../../../../../shared/entities/window-injection-token';
import { ItParameterDocumentTypes } from '../../../../../../shared/enums/itparameter-documenttype.enum';
import { IntegerNumber } from '../../../../../../shared/numberMask';
import { AgGridService } from '../../../../../../shared/services/ag-grid.service';
import { CompanyConfigurationRecord } from '../../../../../../shared/services/configuration/dtos/company-configuration-record';
import { FormConfigurationProviderService } from '../../../../../../shared/services/form-configuration-provider.service';
import { ConfigurationService } from '../../../../../../shared/services/http-services/configuration.service';
import { SnackbarService } from '../../../../../../shared/services/snackbar.service';

@Component({
    selector: 'atlas-accounting-parameters',
    templateUrl: './accounting-parameters.component.html',
    styleUrls: ['./accounting-parameters.component.scss'],
})
export class AccountingParametersComponent extends BaseFormComponent implements OnInit, OnDestroy {
    accountingColumnDefs: agGrid.ColDef[];
    accountingGridOptions: agGrid.GridOptions = {};
    gridApi: agGrid.GridApi;
    gridColumnApi: agGrid.ColumnApi;
    atlasAgGridParam: AtlasAgGridParam;
    checkEdit: boolean = false;
    modifiedAccountingSetUpData: AccountingParameter[] = [];
    accountingRowData: AccountingParameter[] = [];
    yearCtrl = new AtlasFormControl('year');
    dailyDefault: moment.Moment;
    now: moment.Moment;
    currentCompany: string;
    companyId: string;
    isValidAccountingForm: boolean = true;
    subscription: Subscription[] = [];
    masterData: MasterData;
    isLoading: boolean;
    requiredString: string = 'Required*';
    gridComponents = {
        atlasNumeric: CellEditorNumericComponent,
    };
    private readonly nextNumberMessage = 'NextNumber must be greater than previous number';
    private readonly numberNotAvailableMessage = 'Next number cannot be empty';
    constructor(protected formConfigurationProvider: FormConfigurationProviderService,
        protected formBuilder: FormBuilder,
        @Inject(WINDOW) private window: Window,
        public gridService: AgGridService,
        protected configurationService: ConfigurationService,
        private route: ActivatedRoute,
        protected companyManager: CompanyManagerService,
        protected snackbarService: SnackbarService) {
        super(formConfigurationProvider);
        this.now = this.companyManager.getCurrentCompanyDate();
        this.dailyDefault = this.now.clone().subtract(1, 'days').endOf('day').subtract(1, 'seconds');
    }

    ngOnInit() {
        this.currentCompany = decodeURIComponent(this.route.snapshot.paramMap.get('company'));
        this.companyId = this.route.snapshot.paramMap.get('companyId');
        this.atlasAgGridParam = this.gridService.getAgGridParam();
        this.yearCtrl.setValue(this.dailyDefault);
        this.masterData = this.route.snapshot.data.masterdata;
        if (!this.companyId) {
            this.checkEdit = true;
            // bind description
            this.bindGridValuesForCreateCompany();
        }
    }

    bindGridValuesForCreateCompany() {
        this.accountingRowData = [];
        if (this.masterData.transactionDocumentType && this.masterData.transactionDocumentType.length > 0) {
            this.masterData.transactionDocumentType.forEach((a) => {
                const item = new AccountingParameter();
                item.transactionDocumentTypeId = a.transactionDocumentTypeId;
                item.description = this.bindDescription(a.transactionDocumentTypeId);
                item.nextNumber = 1;
                item.oldNumber = 1;
                if (item.description) {
                    this.accountingRowData.push(item);
                }
            });
        }
        if (this.gridApi) {
            this.gridApi.sizeColumnsToFit();
        }
        this.initializeGridColumns();
    }

    ngOnDestroy() {
        this.subscription.forEach((subscription) => {
            if (subscription) {
                subscription.unsubscribe();
            }
        });
    }

    initForm(entity: CompanyConfigurationRecord, isEdit: boolean) {
        this.checkEdit = isEdit;
        const accountingParameterSetup: AccountingParameter[] = entity.accountingParameters;
        this.initializeGridColumns();
        this.bindDocumentTypeDescription(accountingParameterSetup);
        return entity;
    }

    onGridReady(params) {
        params.columnDefs = this.accountingColumnDefs;
        this.accountingGridOptions = params;
        this.gridApi = this.accountingGridOptions.api;
        this.gridColumnApi = this.accountingGridOptions.columnApi;
        this.gridColumnApi.autoSizeAllColumns();
        this.window.onresize = () => {
            this.gridColumnApi.autoSizeAllColumns();
        };
    }

    initializeGridColumns() {
        this.accountingColumnDefs = [
            {
                headerName: 'Configurable Values',
                colId: 'description',
                field: 'description',
            },
            {
                headerName: 'Description',
                colId: 'nextNumber',
                field: 'nextNumber',
                editable: this.checkEdit,
                cellEditor: 'atlasNumeric',
                cellRenderer: this.requiredString,
                cellEditorParams: {
                    displayMask: IntegerNumber(),
                    isRightAligned: true,
                },
                type: 'numericColumn',
                onCellValueChanged: (params) => {
                    const oldNumber = params.data.oldNumber;
                    if (oldNumber) {
                        if (params.data.nextNumber < oldNumber) {
                            params.node.setDataValue('nextNumber', oldNumber);
                            this.snackbarService.throwErrorSnackBar(this.nextNumberMessage);
                        }
                        if (!params.data.nextNumber) {
                            params.node.setDataValue('nextNumber', oldNumber);
                            this.snackbarService.throwErrorSnackBar(this.numberNotAvailableMessage);
                        }
                    }
                },
            },
            {
                headerName: 'Old Number',
                colId: 'oldNumber',
                field: 'oldNumber',
                hide: true,
            },
            {
                headerName: 'TransactionDocumentTypeId',
                colId: 'transactionDocumentTypeId',
                field: 'transactionDocumentTypeId',
                hide: true,
            },
            {
                headerName: 'transactionDocumentTypeCompanySetupId',
                colId: 'transactionDocumentTypeCompanySetupId',
                field: 'transactionDocumentTypeCompanySetupId',
                hide: true,
            },
            {
                headerName: 'Year',
                colId: 'year',
                field: 'year',
                hide: true,
            },
        ];
    }

    populateEntity(entity: CompanyConfigurationRecord): CompanyConfigurationRecord {
        const companyConfiguration = entity;
        this.modifiedAccountingSetUpData = [];
        this.gridApi.forEachNode((rowdata) => {
            const item = new AccountingParameter();
            if (!rowdata.data.nextNumber || rowdata.data.nextNumber === 0) {
                this.isValidAccountingForm = false;
            }
            item.transactionDocumentTypeId = rowdata.data.transactionDocumentTypeId;
            item.transactionDocumentTypeCompanySetupId = rowdata.data.transactionDocumentTypeCompanySetupId;
            item.nextNumber = rowdata.data.nextNumber;
            item.year = Number(this.yearCtrl.value.year());
            this.modifiedAccountingSetUpData.push(item);
        });
        if (this.modifiedAccountingSetUpData && this.modifiedAccountingSetUpData.length > 0) {
            companyConfiguration.accountingParameters = this.modifiedAccountingSetUpData;
        }
        return companyConfiguration;
    }

    bindDocumentTypeDescription(accountingParameterSetup: AccountingParameter[]) {
        this.accountingRowData = [];
        if (accountingParameterSetup && accountingParameterSetup.length > 0) {
            this.yearCtrl.setValue(moment(new Date(accountingParameterSetup[0].year.toString())));
            accountingParameterSetup.forEach((accountingSetup) => {
                if (accountingSetup.nextNumber) {
                    if (accountingSetup.nextNumber > 0) {
                        accountingSetup.oldNumber = accountingSetup.nextNumber;
                    } else if (accountingSetup.nextNumber === 0) {
                        accountingSetup.oldNumber = 1;
                        accountingSetup.nextNumber = 1;
                    }
                }
                // add desciption for accounting Parameter
                const result = this.bindDescription(accountingSetup.transactionDocumentTypeId);
                if (result) {
                    accountingSetup.description = result;
                }
            });
        }
        // avoid rows which does not have description
        const data: AccountingParameter[] = [];
        accountingParameterSetup.forEach((item) => {
            if (item.description) {
                data.push(item);
            }
        });
        this.accountingRowData = data;
        (this.accountingRowData && this.gridApi) ? this.gridApi.hideOverlay() : this.gridApi.showNoRowsOverlay();
    }

    bindDescription(value: number): string {
        let result = null;
        switch (value) {
            case ItParameterDocumentTypes.PurchaseInvoice:
                result = 'Next number for Purchase invoice';
                break;
            case ItParameterDocumentTypes.SalesInvoice:
                result = 'Next number for Sales invoice';
                break;
            case ItParameterDocumentTypes.CreditNote:
                result = 'Next number for Credit notes';
                break;
            case ItParameterDocumentTypes.DebitNote:
                result = 'Next number for Debit notes';
                break;
            case ItParameterDocumentTypes.CashPay:
                result = 'Next number for Cash paid';
                break;
            case ItParameterDocumentTypes.CashReceipt:
                result = 'Next number for Cash received';
                break;
            case ItParameterDocumentTypes.TemporaryAdjustment:
                result = 'Next number for Temporary Adjustment';
                break;
            case ItParameterDocumentTypes.RegularJournal:
                result = 'Next number for Regular Journal';
                break;
            case ItParameterDocumentTypes.FxDealJournal:
                result = 'Next number for FX Deal Journal';
                break;
            case ItParameterDocumentTypes.YearEndDocument:
                result = 'Next number for Year End Document';
                break;
        }
        return result;
    }

    onChosenYearSelected(event: any) {
        const selectedValue: Date = event.toDate();
        if (selectedValue) {
            const selectedYear = selectedValue.getFullYear();
            if (selectedYear) {
                this.isLoading = true;
                if (this.companyId) {
                    this.accountingRowData = [];
                    this.subscription.push(this.configurationService.getAccountingParameterDetails(this.companyId, selectedYear)
                        .pipe(
                            finalize(() => {
                                this.isLoading = false;
                            }))
                        .subscribe((accountingParameterDetails: AccountingParameter[]) => {
                            if (accountingParameterDetails && accountingParameterDetails.length > 0) {
                                const accountingParameterSetup: AccountingParameter[] = accountingParameterDetails;
                                this.initializeGridColumns();
                                this.bindDocumentTypeDescription(accountingParameterSetup);
                            } else {
                                this.bindGridValuesForCreateCompany();
                            }
                        }));
                } else {
                    this.bindGridValuesForCreateCompany();
                    this.isLoading = false;
                }
            }
        }
    }
}
