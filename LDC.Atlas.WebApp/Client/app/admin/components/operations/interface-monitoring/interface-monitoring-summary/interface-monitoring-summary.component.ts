import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSlideToggleChange } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import * as agGrid from 'ag-grid-community';
import * as _moment from 'moment';
import { finalize } from 'rxjs/operators';
import { AtlasTranslationService } from '../../../../../core/services/atlas-translation.service';
import { CompanyManagerService } from '../../../../../core/services/company-manager.service';
import { AgContextualMenuComponent } from '../../../../../shared/components/ag-contextual-menu/ag-contextual-menu.component';
import { BaseFormComponent } from '../../../../../shared/components/base-form-component/base-form-component.component';
import { AgContextualMenuAction } from '../../../../../shared/entities/ag-contextual-menu-action.entity';
import { AtlasAgGridParam } from '../../../../../shared/entities/atlas-ag-grid-param.entity';
import { AtlasFormControl } from '../../../../../shared/entities/atlas-form-control';
import { InterfaceMonitoringSummary } from '../../../../../shared/entities/interface-monitoring-summary.entity';
import { InterfaceTypes } from '../../../../../shared/entities/interface-type.entity';
import { MasterData } from '../../../../../shared/entities/masterdata.entity';
import { TransactionDetail } from '../../../../../shared/entities/transaction-detail.entity';
import { InterfaceStatus } from '../../../../../shared/enums/interface-status.enum';
import { InterfaceType } from '../../../../../shared/enums/interface-type.enum';
import { AgGridService } from '../../../../../shared/services/ag-grid.service';
import { ApiCollection } from '../../../../../shared/services/common/models';
import { CashRecord } from '../../../../../shared/services/execution/dtos/cash-record';
import { FormConfigurationProviderService } from '../../../../../shared/services/form-configuration-provider.service';
import { AccountingInterfaceService } from '../../../../../shared/services/http-services/accounting-interface.service';
import { AuditService } from '../../../../../shared/services/http-services/audit.service';
import { InterfaceService } from '../../../../../shared/services/http-services/interface.service';
import { PaymentRequestInterfaceService } from '../../../../../shared/services/http-services/payment-request-interface.service';
import { PaymentRequestInterfaceError } from '../../../../../shared/services/Interface/dto/payment-request-interface-error';
import { UpdateInterfaceError } from '../../../../../shared/services/Interface/dto/update-interface-error';
import { SnackbarService } from '../../../../../shared/services/snackbar.service';
import { UiService } from '../../../../../shared/services/ui.service';
import { UtilService } from '../../../../../shared/services/util.service';
import { dateTwoBeforeDateOne } from '../../../../../shared/validators/date-validators.validator';
import { AgGridButtonComponent } from '../../interface-monitoring/ag-grid-button/ag-grid-button.component';
import { MatDialog} from '@angular/material';
import { ConfirmationDialogComponent } from '../../../../../shared/components/confirmation-dialog/confirmation-dialog.component';

const moment = _moment;
@Component({
    selector: 'atlas-interface-monitoring-summary',
    templateUrl: './interface-monitoring-summary.component.html',
    styleUrls: ['./interface-monitoring-summary.component.scss'],
})
export class InterfaceMonitoringSummaryComponent extends BaseFormComponent implements OnInit {
    interfaceCtrl = new AtlasFormControl('Interface');
    fromDateCtrl = new AtlasFormControl('DateFrom');
    toDateCtrl = new AtlasFormControl('DateTo');
    businessIdCtrl = new AtlasFormControl('BusinessId');
    interfaceStatusCtrl = new AtlasFormControl('InterfaceStatus');
    statusCtrl = new AtlasFormControl('Status');
    interfaceMonitoringGridContextualMenuActions: AgContextualMenuAction[];
    masterData: MasterData;
    filteredInterfaceTypeList: InterfaceTypes[];
    filteredInterfaceStatusList: InterfaceStatus[];
    interfaceMonitoringSummaryColumnDefs: agGrid.ColDef[];
    interfaceMonitoringSummaryGridOptions: agGrid.GridOptions = {};
    gridApi: agGrid.GridApi;
    gridColumnApi: agGrid.ColumnApi;
    atlasAgGridParam: AtlasAgGridParam;
    interfaceMonitoringMenuActions: { [key: string]: string } = {
        resend: 'resend',
        detail: 'detail',
    };
    interfaceMonitoringSummarySetUpData: InterfaceMonitoringSummary[] = [];
    interfaceMonitoringSummaryRowData: InterfaceMonitoringSummary[] = [];
    filteredInterfaceMontitoringSummaryData: InterfaceMonitoringSummary[] = [];
    company: string;
    isLoading: boolean;
    sideNavOpened: boolean = false;
    message: string;
    disableMessageButton: boolean;
    fromDateErrorMap: Map<string, string> = new Map();
    toDateErrorMap: Map<string, string> = new Map();
    isInterface: boolean;

    constructor(protected formConfigurationProvider: FormConfigurationProviderService,
        private route: ActivatedRoute,
        protected utilService: UtilService,
        protected auditService: AuditService,
        protected interfaceService: InterfaceService,
        public gridService: AgGridService,
        protected formBuilder: FormBuilder,
        private atlasTranslationService: AtlasTranslationService,
        protected uiService: UiService,
        protected companyManager: CompanyManagerService,
        private accountingInterfaceService: AccountingInterfaceService,
        private paymentRequestInterfaceService: PaymentRequestInterfaceService,
        private snackbarService: SnackbarService,
        protected router: Router,
        protected dialog: MatDialog) {
        super(formConfigurationProvider);
        this.atlasAgGridParam = this.gridService.getAgGridParam();
        this.toDateErrorMap
            .set('isDateBeforeValid', 'Cannot be before From date');
        this.fromDateErrorMap
            .set('isDateBeforeValid', 'Cannot be after To date');
    }

    gridContext = {
        componentParent: this,
    };

    ngOnInit() {
        this.masterData = this.route.snapshot.data.masterdata;
        const currentDate = moment(this.companyManager.getCurrentCompanyDate());
        this.fromDateCtrl.setValue(currentDate);
        this.toDateCtrl.setValue(currentDate);
        this.filteredInterfaceType();
        this.filteredInterfaceStatus();
        this.init();
        this.initializeGridColumns();
        this.loadData();
        this.setValidators();
        this.company = this.route.snapshot.paramMap.get('company');
        this.disableMessageButton = false;
        this.subscriptions.push(this.interfaceService.getInterfaceActiveStatus()
            .subscribe((result) => {
                this.isInterface = result;
            }));
    }

    init() {
        this.interfaceMonitoringGridContextualMenuActions = [
            {
                icon: 'add',
                text: 'Details',
                action: this.interfaceMonitoringMenuActions.detail,
            },
            {
                icon: 'file_copy',
                text: 'Resend',
                action: this.interfaceMonitoringMenuActions.resend,
            },
        ];
    }

    handleAction(action: string, model: InterfaceMonitoringSummary) {
        switch (action) {
            case this.interfaceMonitoringMenuActions.detail:
                this.navigateToDetailsPage(model);
                break;
            case this.interfaceMonitoringMenuActions.resend:
                this.resendInterfaceMessage(model);
                break;
            default: this.assertUnreachable(action);
        }
    }

    assertUnreachable(x): never {
        throw new Error('Unknown action');
    }

    navigateToDetailsPage(model: InterfaceMonitoringSummary) {
        this.router.navigate(['/' + this.company + '/admin/operations/interface-monitoring/details'],
                             {
                queryParams: {
                    eventId: model.eventId,
                    interface: model.interface,
                    businessObject: model.businessObject,
                },
                skipLocationChange: true,
            });
    }

    getFormGroup() {
        this.formGroup = this.formBuilder.group({
            interfaceCtrl: this.interfaceCtrl,
            statusCtrl: this.statusCtrl,
            fromDateCtrl: this.fromDateCtrl,
            toDateCtrl: this.toDateCtrl,
            businessIdCtrl: this.businessIdCtrl,
            interfaceStatusCtrl: this.interfaceStatusCtrl,
        });
        this.setValidators();
        return super.getFormGroup();
    }

    filteredInterfaceType() {
        let interfaceTypeList: InterfaceTypes[] = [];
        this.filteredInterfaceTypeList = this.masterData.interfaceType;
        interfaceTypeList = this.filteredInterfaceTypeList;
        this.interfaceCtrl.valueChanges.subscribe((input) => {
            this.filteredInterfaceTypeList = this.utilService.filterListforAutocomplete(
                input,
                interfaceTypeList,
                ['interfaceType', 'interfaceTypeId'],
            );
        });
    }

    filteredInterfaceStatus() {
        let interfaceStatusList: InterfaceStatus[] = [];
        this.filteredInterfaceStatusList = this.masterData.interfaceStatus;
        interfaceStatusList = this.filteredInterfaceStatusList;
        this.statusCtrl.valueChanges.subscribe((input) => {
            this.filteredInterfaceStatusList = this.utilService.filterListforAutocomplete(
                input,
                interfaceStatusList,
                ['status', 'interfaceStatusId'],
            );
        });
    }

    onGridReady(params) {
        this.gridApi = this.interfaceMonitoringSummaryGridOptions.api;
        this.gridColumnApi = this.interfaceMonitoringSummaryGridOptions.columnApi;
        this.gridService.sizeColumns(this.interfaceMonitoringSummaryGridOptions);
        this.interfaceMonitoringSummaryGridOptions.columnDefs = this.interfaceMonitoringSummaryColumnDefs;
        this.atlasTranslationService.translateGridOptionsColDefs(this.interfaceMonitoringSummaryGridOptions)
            .subscribe(() => this.gridApi.refreshHeader());
    }

    onGridSizeChanged(params) {
        this.gridColumnApi = params.columnApi;
        this.gridService.sizeColumns(params);
    }

    initializeGridColumns() {
        this.interfaceMonitoringSummaryGridOptions = {
            context: this.gridContext,
        };
        this.interfaceMonitoringSummaryColumnDefs = [
            {
                colId: 'Interface',
                field: 'interface',

            },
            {
                colId: 'Company',
                field: 'companyId',

            },
            {
                colId: 'Business Id',
                field: 'documentReference',

            },
            {
                colId: 'Business Object',
                field: 'businessObject',

            },
            {
                colId: 'Status',
                field: 'status',

            },
            {
                colId: 'Status Date',
                field: 'statusDateTime',
                valueFormatter: this.uiService.dateFormatter,

            },
            {
                colId: 'Error',
                field: 'error',
                valueGetter: this.getError,
                cellRendererFramework: AgGridButtonComponent,
                cellRendererParams: {
                    context: {
                        componentParent: this,
                    },
                    disabled: this.disableMessageButton,
                    onButtonClicked: this.methodFromParent.bind(this),
                },
            },
            {
                headerName: '',
                cellRendererFramework: AgContextualMenuComponent,
                cellRendererParams: {
                    context: {
                        componentParent: this,
                    },
                    menuActions: this.interfaceMonitoringGridContextualMenuActions,
                },
                cellClass: 'ag-contextual-menu',
                maxWidth: 80,
            },
        ];
    }
    loadData() {
        this.subscriptions.push(this.auditService.getEvents().subscribe((data: ApiCollection<InterfaceMonitoringSummary>) => {
            if (data) {
                this.interfaceMonitoringSummaryRowData = data.value;
            }
        }));
    }

    methodFromParent(message: string) {
        this.sideNavOpened = true;
        this.message = message;
    }

    onDiscardButtonClick() {
        this.sideNavOpened = false;
    }

    onSideNavSaveButtonClick() {
        this.sideNavOpened = false;
    }
    setValidators() {
    if (this.toDateCtrl.value || this.fromDateCtrl.value) {
        this.toDateCtrl.setValidators(Validators.compose(
            [dateTwoBeforeDateOne(this.fromDateCtrl.value, this.toDateCtrl.value, true)]));
        this.fromDateCtrl.setValidators(Validators.compose(
            [dateTwoBeforeDateOne(this.fromDateCtrl.value, this.toDateCtrl.value, true)]));
        }
    }

    onDateSelectionChanged() {
        this.fromDateCtrl.clearValidators();
        this.toDateCtrl.clearValidators();
        this.setValidators();
    }

    onSearchButtonClick() {
        this.interfaceMonitoringSummaryRowData = [];
        const selectedInterfaceType = (this.interfaceCtrl.value) ? (this.interfaceCtrl.value.interfaceTypeId)
        : this.interfaceCtrl.value ;
        const selectedInterfaceStatus = (this.statusCtrl.value) ? (this.statusCtrl.value.interfaceStatusId)
            : this.statusCtrl.value;
        this.auditService.getSearchEvents(selectedInterfaceType, selectedInterfaceStatus,
                                          this.fromDateCtrl.value, this.toDateCtrl.value, this.businessIdCtrl.value)
                                          .pipe(
                                            finalize(() => {
                                                this.isLoading = false;
                                            })).
                    subscribe((data: ApiCollection<InterfaceMonitoringSummary>) => {
                    if (data) {
                        this.initializeGridColumns();
                        this.filteredInterfaceMontitoringSummaryData = data.value;
                        this.interfaceMonitoringSummaryRowData = this.filteredInterfaceMontitoringSummaryData;
                    }
                });
            }

    resendInterfaceMessage(model: InterfaceMonitoringSummary) {
        if (model) {
            if (model.status === InterfaceStatus[InterfaceStatus.Completed] || model.status === InterfaceStatus[InterfaceStatus.Signed] || model.status === InterfaceStatus[InterfaceStatus.Interfaced]) {
                const confirmDialog = this.dialog.open(ConfirmationDialogComponent, {
                    data: {
                        title: 'Resend Message',
                        text: 'The message has already been sent successfully. Are you sure you want to resend it ?',
                        okButton: 'Yes',
                        cancelButton: 'No',
                    },
                });
                confirmDialog.afterClosed().subscribe((answer) => {
                    if (answer) {
                            this.resendMessage(model);
                    }
                });

            } else {
                this.resendMessage(model);
            }
        }

    }

    resendMessage(model: InterfaceMonitoringSummary) {
        if (model.interface === InterfaceType[InterfaceType.AccountingInterface]) {
            this.auditService.getTransactionDoumentDetailsByAccountingId(model.sourceId, model.companyId).subscribe(
                (data: TransactionDetail) => {
                    if (data) {
                        const updateInterfaceError: UpdateInterfaceError[] = [];
                        const interfaceData: UpdateInterfaceError = new UpdateInterfaceError();
                        interfaceData.documentReference = model.documentReference;
                        interfaceData.accountingId = model.sourceId;
                        interfaceData.transactionDocumentId = data.transactionDocumentId;
                        interfaceData.transactionDocumentTypeId = data.transactionDocumentTypeId;
                        updateInterfaceError.push(interfaceData);

                        this.accountingInterfaceService.updateAccountingErrorStatus(updateInterfaceError,
                            InterfaceStatus[InterfaceStatus.InterfaceReady])
                            .subscribe((result) => {
                                if (result) {
                                    this.loadData();
                                    this.snackbarService.informationSnackBar('Document successfully sent to AX');
                                }
                            });
                    }
                });
        } else if (model.interface === InterfaceType[InterfaceType.PaymentRequestInterface]) {
            this.auditService.getCashDetailsByCashId(model.sourceId, model.companyId).subscribe(
                (data: CashRecord) => {
                    if (data) {
                        const interfaceData: PaymentRequestInterfaceError = new PaymentRequestInterfaceError();
                        interfaceData.documentReference = model.documentReference;
                        interfaceData.cashId = model.sourceId;
                        interfaceData.transactionDocumentId = data.transactionDocumentId;

                        this.paymentRequestInterfaceService.updatePaymentRequestErrorStatus(interfaceData,
                            InterfaceStatus[InterfaceStatus.ReadyToTransmit])
                            .subscribe((result) => {
                                if (result) {
                                    this.loadData();
                                    this.snackbarService.informationSnackBar('Document successfully sent to TRAX');
                                }
                            });
                    }
                });
        }
    }

    onInterfaceStatusChanged(value: MatSlideToggleChange) {
        this.isInterface = value.checked;
        this.subscriptions.push(this.interfaceService.startStopInterfaceProcess(this.isInterface)
            .subscribe((result) => {
                if (result) {
                    this.snackbarService.informationSnackBar('Interface Process is started successfully.');
                } else {
                    this.snackbarService.informationSnackBar('Interface Process is stopped successfully.');
                }

            }));
    }

    getError(params) {
        let error: string = '';
        if (params.data && params.data.status && ((params.data.status.indexOf('Transmit') !== -1) ||
        (params.data.status === InterfaceStatus.Rejected) || ((params.data.status === InterfaceStatus.Error)
        && (params.data.status === InterfaceStatus.NotPosted)))) {
            if (params.data.error) {
                const errorMessage: string = params.data.error;
                error =  errorMessage.length > 30 ? errorMessage.substr(0, 30) : errorMessage;
            }
      }
        return error;
    }
}
