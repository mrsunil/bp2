import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import * as agGrid from 'ag-grid-community';
import { BaseFormComponent } from '../../../../shared/components/base-form-component/base-form-component.component';
import { AtlasAgGridParam } from '../../../../shared/entities/atlas-ag-grid-param.entity';
import { InterfaceStatus } from '../../../../shared/enums/interface-status.enum';
import { PermissionLevels } from '../../../../shared/enums/permission-level.enum';
import { AgGridService } from '../../../../shared/services/ag-grid.service';
import { FormConfigurationProviderService } from '../../../../shared/services/form-configuration-provider.service';
import { AccountingInterfaceService } from '../../../../shared/services/http-services/accounting-interface.service';
import { AccountingInterfaceError } from '../../../../shared/services/Interface/dto/accounting-interface-error';
import { UpdateInterfaceError } from '../../../../shared/services/Interface/dto/update-interface-error';
import { SnackbarService } from '../../../../shared/services/snackbar.service';
import { UiService } from '../../../../shared/services/ui.service';

@Component({
    selector: 'atlas-technical-errors',
    templateUrl: './technical-errors.component.html',
    styleUrls: ['./technical-errors.component.scss'],
})
export class TechnicalErrorsComponent extends BaseFormComponent implements OnInit {
    interfaceErrorsGridOptions: agGrid.GridOptions = {};
    atlasAgGridParam: AtlasAgGridParam;
    interfaceErrorsGridColumns: agGrid.ColDef[];
    gridApi: agGrid.GridApi;
    gridColumnApi: agGrid.ColumnApi;
    isLoading: boolean;
    company: string;
    componentId: string = 'interfaceTechnicalErrors';
    interfaceErrorsGridRows: AccountingInterfaceError[];
    isAnyRowSelected: boolean = false;
    selectedDocRefs: AccountingInterfaceError;
    updateInterfaceError: UpdateInterfaceError[];
    technicalErrorForm: FormGroup;

    PermissionLevels = PermissionLevels;

    constructor(protected formConfigurationProvider: FormConfigurationProviderService,
        private accountingInterfaceService: AccountingInterfaceService,
        private route: ActivatedRoute,
        protected uiService: UiService,
        private snackbarService: SnackbarService,
        public gridService: AgGridService) {
        super(formConfigurationProvider);
        this.atlasAgGridParam = this.gridService.getAgGridParam();
    }

    ngOnInit() {
        this.company = this.route.snapshot.paramMap.get('company');
        this.isLoading = true;
        this.initializeGridColumns();
    }

    onGridReady(params) {
        params.columnDefs = this.interfaceErrorsGridColumns;
        this.interfaceErrorsGridOptions = params;
        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;
        this.gridApi.showNoRowsOverlay();
        this.autoSizeGrid();
    }

    onGridSizeChanged(params) {
        this.autoSizeGrid();
    }

    autoSizeGrid() {
        if (this.gridColumnApi) {
            const allColumnIds = [];
            if (this.interfaceErrorsGridColumns) {
                this.interfaceErrorsGridColumns.forEach((columnDefs) => {
                    allColumnIds.push(columnDefs.field);
                });
            }
            this.gridColumnApi.autoSizeColumns(allColumnIds);
        }
    }

    initializeGridColumns() {
        this.interfaceErrorsGridColumns = [
            {
                headerName: 'Document Reference',
                field: 'documentReference',
                colId: 'documentReference',
                hide: false,
                headerCheckboxSelection: true,
                checkboxSelection: true,
                minWidth: 200,
                maxWidth: 200,
            },
            {
                headerName: 'TransactionDocumentId',
                field: 'transactionDocumentId',
                colId: 'transactionDocumentId',
                hide: true,
            },
            {
                headerName: 'AccountingId',
                field: 'accountingId',
                colId: 'accountingId',
                hide: true,
            },
            {
                headerName: 'TransactionDocumentTypeId',
                field: 'transactionDocumentTypeId',
                colId: 'transactionDocumentTypeId',
                hide: true,
            },
            {
                headerName: 'Sent Date to BO',
                field: 'boInterfaceDate',
                colId: 'boInterfaceDate',
                hide: false,
            },
            {
                headerName: 'Received Date from BO',
                field: 'backInterfaceDate',
                colId: 'backInterfaceDate',
                valueFormatter: this.uiService.dateFormatter,
                cellEditor: 'atrDate',
                hide: false,
            },
            {
                headerName: 'Profile',
                field: 'profile',
                colId: 'profile',
                hide: false,
            },
            {
                headerName: 'BO Doc ID',
                field: 'boDocID',
                colId: 'boDocID',
                hide: false,
            },
            {
                headerName: 'BO Journal ID',
                field: 'boJournalID',
                colId: 'boJournalID',
                hide: false,
            },
            {
                headerName: 'InterfaceStatusId',
                field: 'interfaceStatusId',
                colId: 'interfaceStatusId',
                hide: true,
            },
            {
                headerName: 'Status',
                field: 'status',
                colId: 'status',
                hide: true,
            },
            {
                headerName: 'Accrual Number',
                field: 'accrualNumber',
                colId: 'accrualNumber',
                hide: false,
            },
            {
                headerName: 'Error Description',
                field: 'errorDescription',
                colId: 'errorDescription',
                hide: false,
            },
        ];
    }

    getTechnicalErrors(data: AccountingInterfaceError[]) {
        if (data) {
            this.interfaceErrorsGridRows = data;
            this.autoSizeGrid();
            this.isLoading = false;
        }
    }

    onSelectionChanged(event) {
        const selectedRows = this.gridApi.getSelectedRows();
        this.isAnyRowSelected = selectedRows.length > 0;
    }

    onRefreshButtonClicked() {
        this.getListOfErrors();
        this.snackbarService.informationSnackBar('Grid is refreshed with the latest data');
    }

    getListOfErrors() {
        this.accountingInterfaceService.listErrorsForErrorManagement()
            .subscribe((errorData) => {
                if (errorData) {
                    const technicalErrors = errorData.value.filter((errorRows) =>
                        errorRows.interfaceStatusId === InterfaceStatus.Rejected ||
                        errorRows.interfaceStatusId === InterfaceStatus.TransmitError);
                    this.getTechnicalErrors(technicalErrors);
                }
            });
    }

    onCancelButtonClicked() {
        this.updateAccountingErrorStatus(InterfaceStatus[InterfaceStatus.NotInterfaced]);
    }

    onResendButtonClicked() {
        this.updateAccountingErrorStatus(InterfaceStatus[InterfaceStatus.InterfaceReady]);
    }

    updateAccountingErrorStatus(status: string) {
        if (!this.isAnyRowSelected) {
            this.snackbarService.informationSnackBar('Select at least one accounting error to resend');
        } else {
            const selectedRows = this.gridApi.getSelectedRows();
            this.updateInterfaceError = selectedRows.map((item) => {
                return {
                    documentReference: item.documentReference, transactionDocumentId: item.transactionDocumentId,
                    accountingId: item.accountingId, transactionDocumentTypeId: item.transactionDocumentTypeId,
                };
            });

            this.isLoading = true;
            this.accountingInterfaceService.updateAccountingErrorStatus(this.updateInterfaceError, status)
                .subscribe((data) => {
                    if (data) {
                        this.accountingInterfaceService.listErrorsForErrorManagement()
                            .subscribe((errorData) => {
                                if (errorData) {
                                    const technicalErrors = errorData.value.filter((errorRows) =>
                                        errorRows.interfaceStatusId === InterfaceStatus.Rejected ||
                                        errorRows.interfaceStatusId === InterfaceStatus.TransmitError);
                                    this.getTechnicalErrors(technicalErrors);
                                }
                                if (status === InterfaceStatus[InterfaceStatus.Rejected]) {
                                    this.snackbarService.informationSnackBar('Document status is updated to Rejected');
                                } else {
                                    this.snackbarService.informationSnackBar('Document successfully sent to accounting interface');
                                }
                            });
                    }
                });
        }
    }
}
