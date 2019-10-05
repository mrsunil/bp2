import { AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthorizationService } from '../../../../core/services/authorization.service';
import { CompanyManagerService } from '../../../../core/services/company-manager.service';
import { BaseFormComponent } from '../../../../shared/components/base-form-component/base-form-component.component';
import { ConfirmationDialogComponent } from '../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { FABType } from '../../../../shared/components/floating-action-button/floating-action-button-type.enum';
import { AtlasFormControl } from '../../../../shared/entities/atlas-form-control';
import { FloatingActionButtonActions } from '../../../../shared/entities/floating-action-buttons-actions.entity';
import { IsLocked } from '../../../../shared/entities/is-locked.entity';
import { LockFunctionalContext } from '../../../../shared/entities/lock-functional-context.entity';
import { LockResourceInformation } from '../../../../shared/entities/lock-resource-information.entity';
import { CashSelectionType } from '../../../../shared/enums/cash-selection-type';
import { CashType } from '../../../../shared/enums/cash-type.enum';
import { InterfaceStatus } from '../../../../shared/enums/interface-status.enum';
import { PermissionLevels } from '../../../../shared/enums/permission-level.enum';
import { PostingStatus } from '../../../../shared/enums/posting-status.enum';
import { CashMatching } from '../../../../shared/services/execution/dtos/cash-matching';
import { CashRecord } from '../../../../shared/services/execution/dtos/cash-record';
import { FormConfigurationProviderService } from '../../../../shared/services/form-configuration-provider.service';
import { ExecutionService } from '../../../../shared/services/http-services/execution.service';
import { LockService } from '../../../../shared/services/http-services/lock.service';
import { SecurityService } from '../../../../shared/services/security.service';
import { SnackbarService } from '../../../../shared/services/snackbar.service';
import { TitleService } from '../../../../shared/services/title.service';
import { ExecutionActionsService } from '../../../services/execution-actions.service';
import { AdditionalCostsFormComponent } from '../cash-details/additional-costs/additional-costs.component';
import { AdditionalDetailsFormComponent } from '../cash-details/additional-details/additional-details.component';
import { BankInformationComponent } from '../cash-details/bank-information/bank-information.component';
import { CounterpartyFormComponent } from '../cash-details/counterparty-card/counterparty-card.component';
import { CurrencyInformationCardComponent } from '../cash-details/currency-information-card/currency-information-card.component';
import { DocumentInformationFormComponent } from '../cash-details/document-information/document-information.component';
import { InvoiceGridForSummaryComponent } from './invoice-grid-for-summary/invoice-grid-for-summary.component';

@Component({
    selector: 'atlas-cash-summary-form-component',
    templateUrl: './cash-summary.component.html',
    styleUrls: ['./cash-summary.component.scss'],
})
export class CashSummaryFormComponent extends BaseFormComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('counterpartyFormComponent') counterpartyFormComponent: CounterpartyFormComponent;
    @ViewChild('additionalDetailsFormComponent') additionalDetailsFormComponent: AdditionalDetailsFormComponent;
    @ViewChild('documentInformationFormComponent') documentInformationFormComponent: DocumentInformationFormComponent;
    @ViewChild('invoiceGridForSummaryComponent') invoiceGridForSummaryComponent: InvoiceGridForSummaryComponent;
    @ViewChild('additionalCostsFormComponent') additionalCostsFormComponent: AdditionalCostsFormComponent;
    @ViewChild('currencyFormComponent') currencyFormComponent: CurrencyInformationCardComponent;
    @ViewChild('bankInformationComponent') bankInformationComponent: BankInformationComponent;

    @Input() isCreationMode: boolean = false;

    cashSummaryFormGroup: FormGroup;
    urgentPaymentSummaryCtrl = new AtlasFormControl('UrgentPaymentSummary');
    model: CashRecord;
    private formComponents: BaseFormComponent[] = [];
    docReference: string;
    invoices: CashMatching[];
    cashId: number;
    subscriptions: Subscription[] = [];
    isEdit = false;
    disabled: boolean;
    CashType = CashType;
    cashTypeId: number;
    showCurrencyComponent = false;
    hasCPTraxEditPrivilege: boolean = false;
    company: string;
    cashTypeIdPrivilege: number;
    canEdit = false;
    canCreate = false;
    destroy$ = new Subject();
    resourcesInformation: LockResourceInformation[] = new Array<LockResourceInformation>();
    traxStatusCtrl = new AtlasFormControl('TraxStatus');
    interfaceStatusCtrl = new AtlasFormControl('InterfaceStatus');
    postingStatusCtrl = new AtlasFormControl('PostingStatus');
    transmitTreasuryCtrl = new AtlasFormControl('TransmitTreasury');
    authorizePostingCtrl = new AtlasFormControl('AuthorizePosting');
    creationDateCtrl = new AtlasFormControl('creationDate');
    createdByCtrl = new AtlasFormControl('createdBy');
    isLoading = false;
    isCashReceipt = false;

    // properties for displaying cash details in header section
    showTraxStatus = false;
    showPostingStatus = false;
    showAccInterfaceStatus = false;
    isTraxStatusSuccess: boolean;
    isPostingStatusSuccess: boolean;
    isAccInterfaceStatusSuccess: boolean;
    traxStatus: string;
    postingStatus: string;
    accInterfaceStatus: string;
    errorMessage: string;

    fabMenuActions: FloatingActionButtonActions[] = [];
    fabTitle: string;
    fabType: FABType;
    isLoaded: boolean = false;

    constructor(protected formConfigurationProvider: FormConfigurationProviderService,
        private snackbarService: SnackbarService,
        protected dialog: MatDialog,
        protected formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private executionService: ExecutionService,
        private router: Router,
        private companyManager: CompanyManagerService,
        protected securityService: SecurityService,
        protected authorizationService: AuthorizationService,
        protected executionActionsService: ExecutionActionsService,
        protected lockService: LockService,
        private titleService: TitleService) {
        super(formConfigurationProvider);
        this.cashTypeId = Number(decodeURIComponent(this.route.snapshot.paramMap.get('cashTypeId')));
        this.company = this.route.snapshot.paramMap.get('company');
    }

    ngOnInit() {
        this.isTraxStatusSuccess = false;
        this.isPostingStatusSuccess = false;
        this.isAccInterfaceStatusSuccess = false;
    }

    // tslint:disable-next-line:use-life-cycle-interface
    ngAfterViewInit() {

        this.cashSummaryFormGroup = this.formBuilder.group({
            counterpartyFormComponent: this.counterpartyFormComponent.getFormGroup(),
            additionalDetailsFormComponent: this.additionalDetailsFormComponent.getFormGroup(),
            documentInformationFormComponent: this.documentInformationFormComponent.getFormGroup(),
            additionalCostsFormComponent: this.additionalCostsFormComponent.getFormGroup(),
            invoiceGridForSummaryComponent: this.invoiceGridForSummaryComponent.getFormGroup(),
            currencyFormComponent: this.currencyFormComponent.getFormGroup(),
            bankInformationComponent: this.bankInformationComponent.getFormGroup(),
        });
        this.cashSummaryFormGroup.disable();
        this.urgentPaymentSummaryCtrl.disable();
        this.createdByCtrl.disable();
        this.creationDateCtrl.disable();

        this.formComponents.push(
            this.counterpartyFormComponent,
            this.documentInformationFormComponent,
            this.additionalDetailsFormComponent,
            this.additionalCostsFormComponent,
            this.invoiceGridForSummaryComponent,
            this.currencyFormComponent,
            this.bankInformationComponent,
        );
        this.securityService.isSecurityReady().subscribe(() => {
            this.hasCPTraxEditPrivilege = this.authorizationService.isPrivilegeAllowed(this.company, 'CPTraxEdit');
        });

        this.cashId = Number(this.route.snapshot.paramMap.get('cashId'));
        if (this.cashId !== 0 && this.route.snapshot.url.length > 0
            && this.route.snapshot.url[1].path.toString() === 'display') {
            this.populateCashDetails();
        }
    }

    populateCashRecord(record) {
        this.model = record;
        this.isLoading = true;
        this.docReference = this.model.documentReference;
        this.titleService.setTitle(this.docReference + ' - Cash View');
        if (this.model.cashTypeId === CashSelectionType.PaymentDifferentCurrency ||
            this.model.cashTypeId === CashSelectionType.ReceiptDifferentCurrency) {
            this.docReference = this.docReference + ' / ' + this.model.matchedDocumentReference;
        }

        this.formComponents.forEach((comp) => {
            comp.initForm(this.model, false);
        });
        this.setAccountingLineTypeColumnVisibility();
        this.hideAmountInDifferentCurrencyColumn(this.model.childCashTypeId, this.model.currencyCode);
        this.disabled = this.model.urgentPayment;
        this.isLoading = false;
        this.authorizePostingCtrl.setValue(this.model.authorizedForPosting);
        this.transmitTreasuryCtrl.setValue(this.model.toTransmitToTreasury);
        this.urgentPaymentSummaryCtrl.setValue(this.model.urgentPayment);
        this.createdByCtrl.setValue(this.model.createdBy);
        this.creationDateCtrl.setValue(this.model.documentDate);
        this.bindDocumentStatusDetail(this.model);
    }

    populateCashDetails() {
        this.isLoading = true;
        this.subscriptions.push(this.executionService.getCashByCashId(this.cashId)
            .subscribe((data) => {
                this.model = data;
                this.interfaceStatusCtrl.setValue(this.getInterfaceStatus(this.model.interfaceStatus));
                this.traxStatusCtrl.setValue(this.getTraxStatus(this.model.traxStatus));
                this.postingStatusCtrl.setValue(this.getPostingStatus(this.model.status));
                this.authorizePostingCtrl.setValue(this.model.authorizedForPosting);
                this.transmitTreasuryCtrl.setValue(this.model.toTransmitToTreasury);
                this.createdByCtrl.setValue(this.model.createdBy);
                this.creationDateCtrl.setValue(this.model.documentDate);
                this.urgentPaymentSummaryCtrl.setValue(this.model.urgentPayment);
                this.cashTypeIdPrivilege = data.cashTypeId;
                if (this.cashTypeIdPrivilege) {
                    this.isAuthorized();
                }
                this.docReference = data.documentReference;
                this.titleService.setTitle(this.docReference + ' - Cash View');
                if (data.matchedDocumentReference) {
                    this.docReference = this.docReference + ' / ' + data.matchedDocumentReference;
                }
                this.formComponents.forEach((comp) => {
                    comp.initForm(data, this.isEdit);
                });
                this.setAccountingLineTypeColumnVisibility();
                this.additionalCostsFormComponent.isPanelExpanded = false;
                this.additionalDetailsFormComponent.isPanelExpanded = false;
                this.hideAmountInDifferentCurrencyColumn(this.model.cashTypeId, this.model.currencyCode);
                this.isLoading = false;
                this.initFABActions();
                this.bindDocumentStatusDetail(this.model);
            }));
    }

    populateInvoiceGrid(record) {
        this.populateInvoiceRecordFromGrid(record, this.invoices);
    }

    populateInvoiceRecordFromGrid(summaryRecord, invoices) {
        if (summaryRecord) {
            this.invoiceGridForSummaryComponent.invoicesToBeSelectedForSummary(invoices, summaryRecord);
        } else { this.invoiceGridForSummaryComponent.showGrid = false; }

    }

    invoiceForSummaryStep(invoices: CashMatching[]) {
        this.invoices = invoices;
    }
    onEditClicked() {
        this.lockService.isLockedCashDocument(this.model.cashId).pipe(takeUntil(this.destroy$)).subscribe((lock: IsLocked) => {
            if (lock.isLocked) {
                this.dialog.open(ConfirmationDialogComponent, {
                    data: {
                        title: 'Lock',
                        text: lock.message,
                        okButton: 'Got it',
                    },
                });
            } else {
                this.executionActionsService.editCashSubject.next(this.model);
            }
        });
    }
    onNewCashButtonClicked() {
        this.router.navigate(['/' + this.companyManager.getCurrentCompanyId() +
            '/execution/cash/new/' + encodeURIComponent(this.cashTypeId.toString())]);
    }

    onDeleteClicked() {

        this.lockService.isLockedCashDocument(this.model.cashId).pipe(takeUntil(this.destroy$)).subscribe((lock: IsLocked) => {
            if (lock.isLocked) {
                this.dialog.open(ConfirmationDialogComponent, {
                    data: {
                        title: 'Lock',
                        text: lock.message,
                        okButton: 'Got it',
                    },
                });
            } else {
                this.startLockRefresh(this.model.cashId, this.model.documentReference);
                this.lockService.lockCashDocument(this.model.cashId, LockFunctionalContext.CashDocumentDeletion)
                    .pipe(takeUntil(this.destroy$)).subscribe((lockState) => {

                        const confirmDialog = this.dialog.open(ConfirmationDialogComponent, {
                            data: {
                                title: 'Cash Deletion',
                                text: 'Deleting a cash is permanent. Do you wish to proceed?',
                                okButton: 'Delete anyway',
                                cancelButton: 'Cancel',
                            },
                        });
                        confirmDialog.afterClosed().subscribe((answer) => {
                            this.stopLockRefresh();
                            if (answer) {
                                this.executionService.deleteCash(this.model.cashId).subscribe(() => {
                                    this.snackbarService.informationSnackBar('Cash deleted successfully');
                                    this.router.navigate(['/' + this.companyManager.getCurrentCompanyId() + '/execution/cash']);
                                });
                            } else {
                                this.snackbarService.throwErrorSnackBar('You cannot delete this cash');
                            }
                            this.lockService.unlockCashDocument(this.model.cashId, LockFunctionalContext.CashDocumentDeletion)
                                .pipe(takeUntil(this.destroy$)).subscribe();
                        });
                    });
            }
        });
    }

    isDifferentCurrencyoptionSelected() {
        if (this.model) {
            return (this.model.cashTypeId === CashSelectionType.PaymentDifferentCurrency
                || this.model.cashTypeId === CashSelectionType.ReceiptDifferentCurrency) ? false : true;
        }
    }

    setAccountingLineTypeColumnVisibility() {
        if (this.model.cashTypeId === CashSelectionType.SimpleCashPayment
            || this.model.cashTypeId === CashSelectionType.SimpleCashReceipt) {
            if (this.additionalCostsFormComponent.gridColumnApi) {
                this.additionalCostsFormComponent.gridColumnApi.setColumnVisible('accountLineType', false);
            }
        }
    }

    hideAmountInDifferentCurrencyColumn(id: number, currency: string) {
        if (id === CashSelectionType.PaymentDifferentCurrency
            || id === CashSelectionType.ReceiptDifferentCurrency) {
            if (this.invoiceGridForSummaryComponent.gridColumnApi) {
                this.invoiceGridForSummaryComponent.gridColumnApi.setColumnVisible('amountPaidInDiffCcy', true);
                // Add cash currency to the header like  "Amount Paid In Diff Ccy (AED)"
                this.invoiceGridForSummaryComponent.invoiceSummaryGridOptions.api.getColumnDef('amountPaidInDiffCcy').headerName
                    = 'Amount Paid in Diff CCY ( ' + currency + ' )';
            }
        }
    }

    isAuthorized() {
        if (this.model.status === PostingStatus.Posted) {
            this.canEdit = false;
        } else {
            this.securityService.isSecurityReady().subscribe(() => {
                this.canEdit = false;
                this.canCreate = false;

                let privilegeNameLevel2 = '';
                let privilegeNameLevel3 = '';
                switch (this.cashTypeIdPrivilege) {
                    case 1:
                        privilegeNameLevel2 = 'CashPayment';
                        privilegeNameLevel3 = 'CPSIMPLE';
                        break;
                    case 2:
                        privilegeNameLevel2 = 'CashPayment';
                        privilegeNameLevel3 = 'CPPICKTX';
                        break;
                    case 3:
                        privilegeNameLevel2 = 'CashPayment';
                        privilegeNameLevel3 = 'CPDIFFCCY';
                        break;
                    case 4:
                        privilegeNameLevel2 = 'CashPayment';
                        privilegeNameLevel3 = 'CPDIFFCLI';
                        break;
                    case 5:
                        privilegeNameLevel2 = 'CashReceipt';
                        privilegeNameLevel3 = 'CRSIMPLE';
                        this.isCashReceipt = true;
                        break;
                    case 6:
                        privilegeNameLevel2 = 'CashReceipt';
                        privilegeNameLevel3 = 'CRPICKTX';
                        this.isCashReceipt = true;
                        break;
                    case 7:
                        privilegeNameLevel2 = 'CashReceipt';
                        privilegeNameLevel3 = 'CRDIFFCCY';
                        this.isCashReceipt = true;
                        break;
                }

                if (this.authorizationService.isPrivilegeAllowed(this.company, 'Cash') &&
                    this.authorizationService.isPrivilegeAllowed(this.company, privilegeNameLevel2, PermissionLevels.ReadWrite) &&
                    this.authorizationService.isPrivilegeAllowed(this.company, privilegeNameLevel3)) {

                    this.canCreate = true;
                    if (this.isCashReceipt) {
                        if (this.model.status === PostingStatus.MappingError || this.model.status === PostingStatus.Incomplete) {
                            this.canEdit = true;
                        }
                    } else {
                        // For cash payment, check trax
                        let traxReadOnly = true;

                        // If it's an error, it has not been transmitted to the bank, so you can modify; otherwise it's read-only
                        if (!this.model.traxStatus
                            || this.model.traxStatus === InterfaceStatus.ReadyToTransmit
                            || this.model.traxStatus === InterfaceStatus.TransmitError
                            || this.model.traxStatus === InterfaceStatus.Error
                            || this.model.traxStatus === InterfaceStatus.Rejected) {
                            traxReadOnly = false;
                        }

                        if (!traxReadOnly || this.hasCPTraxEditPrivilege) {
                            this.canEdit = true;
                        }
                    }
                }
            });
        }
    }

    startLockRefresh(cashId: number, documentReference: string) {
        this.resourcesInformation = new Array<LockResourceInformation>();
        const resourceInformation = new LockResourceInformation();
        resourceInformation.resourceType = 'Cash Document';
        resourceInformation.resourceId = cashId;
        resourceInformation.resourceCode = documentReference;
        resourceInformation.needRefresh = true;
        this.resourcesInformation.push(resourceInformation);
    }

    stopLockRefresh() {
        this.resourcesInformation = new Array<LockResourceInformation>();
    }

    ngOnDestroy(): void {
        this.stopLockRefresh();
        this.lockService.cleanSessionLocks().pipe(takeUntil(this.destroy$)).subscribe(() => {
            this.destroy$.next();
            this.destroy$.complete();
        });
    }
    getInterfaceStatus(interfaceStatus: number) {
        switch (interfaceStatus) {
            case InterfaceStatus.ReadyToTransmit:
                this.isAccInterfaceStatusSuccess = true;
                return 'Ready To Transmit';
                break;
            case InterfaceStatus.StandBy:
                this.isAccInterfaceStatusSuccess = true;
                return 'Stand By';
                break;
            case InterfaceStatus.TransmitError:
                this.isAccInterfaceStatusSuccess = false;
                return 'Transmit Error';
                break;
            case InterfaceStatus.Interfaced:
                this.isAccInterfaceStatusSuccess = true;
                return 'Interfaced';
                break;
            case InterfaceStatus.Error:
                this.isAccInterfaceStatusSuccess = false;
                return 'Error';
                break;
            case InterfaceStatus.Rejected:
                this.isAccInterfaceStatusSuccess = false;
                return 'Rejected';
                break;
            case InterfaceStatus.Signed:
                this.isAccInterfaceStatusSuccess = true;
                return 'Signed';
                break;
            case InterfaceStatus.NotPosted:
                this.isAccInterfaceStatusSuccess = false;
                return 'NotPosted';
                break;
            default:
                return InterfaceStatus[interfaceStatus];
                break;
        }
    }
    getTraxStatus(traxStatus: number) {
        switch (traxStatus) {
            case InterfaceStatus.ReadyToTransmit:
                this.isTraxStatusSuccess = true;
                return 'Ready To Transmit';
                break;
            case InterfaceStatus.StandBy:
                this.isTraxStatusSuccess = true;
                return 'Stand By';
                break;
            case InterfaceStatus.TransmitError:
                this.isTraxStatusSuccess = false;
                return 'Transmit Error';
                break;
            case InterfaceStatus.Interfaced:
                this.isTraxStatusSuccess = true;
                return 'Interfaced';
                break;
            case InterfaceStatus.Error:
                this.isTraxStatusSuccess = false;
                return 'Error';
                break;
            case InterfaceStatus.Rejected:
                this.isTraxStatusSuccess = false;
                return 'Rejected';
                break;
            case InterfaceStatus.Signed:
                this.isTraxStatusSuccess = true;
                return 'Signed';
                break;
            default:
                return InterfaceStatus[traxStatus];
                break;
        }
    }
    getPostingStatus(status: number) {
        switch (status) {
            case PostingStatus.Authorized:
                this.isPostingStatusSuccess = true;
                return 'Authorized';
                break;
            case PostingStatus.Deleted:
                this.isPostingStatusSuccess = true;
                return 'Deleted';
                break;
            case PostingStatus.Held:
                this.isPostingStatusSuccess = false;
                return 'Held';
                break;
            case PostingStatus.Incomplete:
                this.isPostingStatusSuccess = true;
                return 'Incomplete';
                break;
            case PostingStatus.MappingError:
                this.isPostingStatusSuccess = false;
                return 'MappingError';
                break;
            case PostingStatus.Posted:
                this.isPostingStatusSuccess = true;
                return 'Posted';
                break;
            default:
                return PostingStatus[status];
                break;
        }
    }

    bindDocumentStatusDetail(model: CashRecord) {
        // bind status details

        this.traxStatus = this.getTraxStatus(model.traxStatus);
        this.accInterfaceStatus = this.getInterfaceStatus(model.interfaceStatus);
        this.postingStatus = this.getPostingStatus(model.status);

        this.showTraxStatus = this.traxStatus ? true : false;
        this.showAccInterfaceStatus = this.accInterfaceStatus ? true : false;
        this.showPostingStatus = this.postingStatus ? true : false;

        this.errorMessage = model.interfaceErrorMessage ?
            model.interfaceErrorMessage : model.postingErrorMessage;
    }

    initFABActions() {
        this.fabTitle = 'Cash Mini FAB';
        this.fabType = FABType.MiniFAB;

        const actionNewCash: FloatingActionButtonActions = {
            icon: 'add',
            text: 'New',
            action: 'newCash',
            disabled: false,
            index: 0,
        };
        const actionEditCash: FloatingActionButtonActions = {
            icon: 'edit',
            text: 'Edit',
            action: 'editCash',
            disabled: false,
            index: 1,
        };
        const actionDeleteCash: FloatingActionButtonActions = {
            icon: 'delete',
            text: 'Delete',
            action: 'deleteCash',
            disabled: false,
            index: 2,
        };

        if (this.canCreate) {
            this.fabMenuActions.push(actionNewCash);
            if (this.canEdit) {
                this.fabMenuActions.push(actionEditCash);
                this.fabMenuActions.push(actionDeleteCash);
            }
        }
    }

    onFabActionClicked(action: string) {
        switch (action) {
            case 'newCash': {
                this.onNewCashButtonClicked();
                break;
            }
            case 'editCash': {
                this.onEditClicked();
                break;
            }
            case 'deleteCash': {
                this.onDeleteClicked();
                break;
            }
        }
    }
}
