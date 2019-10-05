import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { AfterViewInit, ChangeDetectorRef, Component, HostListener, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MatStepper } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, of, Subscription, throwError } from 'rxjs';
import { catchError, finalize, mergeMap } from 'rxjs/operators';
import { CompanyManagerService } from '../../../core/services/company-manager.service';
import { BaseFormComponent } from '../../../shared/components/base-form-component/base-form-component.component';
import { ConfirmationDialogComponent } from '../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { DocumentGenerationConfirmationDialogBoxComponent } from '../../../shared/components/document-generation-confirmation-dialog-box/document-generation-confirmation-dialog-box.component';
import { AdditionalCost } from '../../../shared/entities/additional-cost.entity';
import { Company } from '../../../shared/entities/company.entity';
import { Currency } from '../../../shared/entities/currency.entity';
import { DocumentPopupButtonSettings } from '../../../shared/entities/document-popup-button-settings.entity';
import { PhysicalDocumentReference } from '../../../shared/entities/document-reference.entity';
import { MasterData } from '../../../shared/entities/masterdata.entity';
import { WINDOW } from '../../../shared/entities/window-injection-token';
import { CashSelectionType } from '../../../shared/enums/cash-selection-type';
import { CashStepperType } from '../../../shared/enums/cash-stepper-type.enum';
import { CashType } from '../../../shared/enums/cash-type.enum';
import { CostDirections } from '../../../shared/enums/cost-direction.enum';
import { DocumentEntityTypes } from '../../../shared/enums/document-entity-type.enum';
import { DocumentTypes } from '../../../shared/enums/document-type.enum';
import { GenerateDocumentActions } from '../../../shared/enums/generate-document-action.enum';
import { ConvertToNumber } from '../../../shared/numberMask';
import { DocumentPopupService } from '../../../shared/services/document-popup.service';
import { CashMatching } from '../../../shared/services/execution/dtos/cash-matching';
import { CashRecord } from '../../../shared/services/execution/dtos/cash-record';
import { CashSummaryGrid } from '../../../shared/services/execution/dtos/cash-summary-grid-record';
import { InvoiceForCashMatching } from '../../../shared/services/execution/dtos/invoice-for-cash';
import { DocumentService } from '../../../shared/services/http-services/document.service';
import { ExecutionService } from '../../../shared/services/http-services/execution.service';
import { ForeignExchangeService } from '../../../shared/services/http-services/foreign-exchange.service';
import { PreaccountingService } from '../../../shared/services/http-services/preaccounting.service';
import { SnackbarService } from '../../../shared/services/snackbar.service';
import { TitleService } from '../../../shared/services/title.service';
import { UtilService } from '../../../shared/services/util.service';
import { CommonMethods } from '../../services/execution-cash-common-methods';
import { AdditionalCostListDisplayView } from './cash-details/additional-costs/additional-cost-list-display-view';
import { CashDetailsFormComponent } from './cash-details/cash-details.component';
import { CashWarningDialogComponentComponent } from './cash-dialog-component/cash-warning-dialog-component/cash-warning-dialog-component.component';
import { CashSelectionFormComponent } from './cash-selection/cash-selection.component';
import { CashSummaryFormComponent } from './cash-summary/cash-summary.component';
import { PickTransactionComponent } from './pick-transaction/pick-transaction.component';

@Component({
    selector: 'atlas-execution-cash-create',
    templateUrl: './execution-cash-create.component.html',
    styleUrls: ['./execution-cash-create.component.scss'],
})
export class ExecutionCashCreateComponent implements OnInit, OnDestroy, AfterViewInit {
    private readonly postingWarning = 'Neither the "Authorize for Posting" nor "Transmit to Treasury System" toggle buttons are enabled.';
    private formComponents: BaseFormComponent[] = [];
    private saveCashSubscription: Subscription;
    private readonly popupButtonSettings: DocumentPopupButtonSettings = {
        createButtonText: 'Create Payment Order without modification',
        uploadButtonText: 'Upload and create payment order',
        createButtonTooltip: 'Generate the cash from Atlas',
        uploadButtonTooltip: 'Create a cash from the file you edited and saved from your computer',
    };
    currentStep: number = 0;
    isValid: boolean = false;
    cashFormGroup: FormGroup;
    company: string;
    isDisabled = true;
    masterdata: MasterData;
    costCurrency: string;
    fxRateValue: number;
    roeTypeValue: string;
    balance: number;
    selectionValue: number;
    invoiceRecord: CashSummaryGrid[];
    index: number;
    initialFxRateValue: number;
    finalFxRateValue: number;
    initialRoeType: string;
    isFxRateValid: boolean;
    finalRoeType: string;
    bankCurrency: string;
    totalAmount: number;
    model: CashRecord;
    invoiceForCashMatchingModel: InvoiceForCashMatching;
    totalbalance: number;
    documentTypePI: string = 'PI';
    documentTypeSI: string = 'SI';
    isDialogClosed: boolean;
    cashSteps: { [key: string]: number } = {
        cashCreationStep: 0,
        pickTransactionStep: 1,
        cashDetailsStep: 2,
        cashSummaryStep: 3,
    };
    cashTypeId: number;
    cashSelectionId: number;
    saveInProgress: boolean;
    cashType = CashType;
    cashSelectionType = CashSelectionType;
    transactionDocumentId: number;
    matchingChashId: number;
    mappingFields = new Array();
    isNewDoc: boolean = false;
    @ViewChild('stepper') stepper: MatStepper;
    @ViewChild('selectionFormComponent') selectionFormComponent: CashSelectionFormComponent;
    @ViewChild('cashDetailsFormComponent') cashDetailsFormComponent: CashDetailsFormComponent;
    @ViewChild('cashSummaryFormComponent') cashSummaryFormComponent: CashSummaryFormComponent;
    @ViewChild('pickTransactionComponent') pickTransactionComponent: PickTransactionComponent;

    cashId: number;
    subscriptions: Subscription[] = [];
    isEdit: boolean;
    documentReferenceNumber: string;
    hasPreviewDocument = false;
    hasTemplate = false;
    isCreation: boolean = true;

    companyConfiguration: Company;
    cashCurrencyRoeType: string;
    cashCurrencyRate: number;

    functionalStatutoryCurrencyRoeType: string = 'M';
    functionalStatutoryCurrenyRate: number = 1;

    isPreviousButtonDisabled: boolean;
    matchedDocumentReference: string;
    isSave: boolean = false;
    costDirectionId: number;
    previousCashDetails: InvoiceForCashMatching;
    isCompleted: boolean = false;
    isSimpleCashSelected: boolean = false;
    pickTransactionComponentInitial: any;
    private readonly postingWarningForReceipts = '"Authorise for Posting" toggle button is not ticked';
    private readonly postingWarningTitle = 'Warning Message';
    private readonly postingWarningTitleForReceipts = 'Cash without authorization';
    private readonly postingWarningWhenBothbuttonEnabled = 'Both the "Authorize for Posting" and "Transmit to Treasury System" toggle buttons can not be enabled.';

    constructor(
        private companyManager: CompanyManagerService,
        private cdr: ChangeDetectorRef,
        private route: ActivatedRoute,
        private router: Router,
        protected formBuilder: FormBuilder,
        private executionService: ExecutionService,
        private snackbarService: SnackbarService,
        private preAccountingService: PreaccountingService,
        protected dialog: MatDialog,
        private utilService: UtilService,
        @Inject(WINDOW) private window: Window,
        private documentService: DocumentService,
        private documentPopupService: DocumentPopupService,
        private foreignExchangeService: ForeignExchangeService,
        private titleService: TitleService,
    ) { }

    ngOnInit() {
        this.company = this.route.snapshot.paramMap.get('company');
        this.cashTypeId = Number(this.route.snapshot.paramMap.get('cashTypeId'));
        this.costDirectionId = this.cashTypeId;
        this.cashId = Number(this.route.snapshot.paramMap.get('cashId'));
        this.companyConfiguration = this.companyManager.getCompany(this.company);
        this.titleService.setTitle('Cash Creation');
        this.cashFormGroup = this.formBuilder.group({
            dummyFormControl: new FormControl(),
        });
        this.isPreviousButtonDisabled = false;
        this.getFxrateForFunctionalToStatutoryCurrencyConversion();
        this.masterdata = this.route.snapshot.data.masterdata;
        if (this.route.snapshot.url.length > 0 && this.route.snapshot.url[1].path.toString() === 'edit') {
            this.isEdit = true;
            this.populateCashDetails();
        }
        this.route.queryParams.subscribe((params) => {
            this.isNewDoc = (params['isNewDoc']);
            this.selectionValue = params['selectedCashTypeId'];
        });

    }

    ngAfterViewInit() {
        this.cashFormGroup = this.formBuilder.group({
            selectionFormComponent: this.selectionFormComponent.getFormGroup(),
            cashDetailsFormComponent: this.cashDetailsFormComponent.getFormGroup(),
            pickTransactionComponent: this.pickTransactionComponent.getFormGroup(),
        });
        this.formComponents.push(
            this.selectionFormComponent,
            this.cashDetailsFormComponent,
            this.pickTransactionComponent);

        if (this.isNewDoc) {
            this.bindSelectedCashTypeForNewDocument();
        }
        this.cdr.detectChanges();
    }

    canDeactivate() {
        this.assignPickTransactionIfNull();
        if ((this.cashDetailsFormComponent.createCashCurrencyFormGroup.dirty
            || this.cashDetailsFormComponent.createCashFormGroup.dirty
            || this.pickTransactionComponent.pickTransactionFormGroup.dirty) && this.isSave === false) {
            return window.confirm('Leave an unsave form? \nYour changes won\'t be applied!');
        }
        return true;
    }

    @HostListener('window:beforeunload', ['$event']) unloadNotification($event: any) {
        if ((this.cashDetailsFormComponent.createCashCurrencyFormGroup.dirty
            || this.cashDetailsFormComponent.createCashFormGroup.dirty
            || this.pickTransactionComponent.pickTransactionFormGroup.dirty) && this.isSave === false) {
            $event.returnValue = true;
        }
    }

    onChangeStepAction(event) {
        this.currentStep = event.selectedIndex;
    }

    assignPickTransactionIfNull() {
        if (!this.pickTransactionComponent) {
            this.pickTransactionComponent = this.pickTransactionComponentInitial;
        }
    }

    onCreateButtonClicked() {
        this.isSave = true;
        this.isCompleted = true;
        // Call service to create cash.
        if (this.isCashFormValid()
            && this.cashDetailsFormComponent.additionalCostsFormComponent.isAdditionalCostValid()) {
            if (this.hasTemplate && this.hasPreviewDocument) {
                this.createOrUpdateCash(true);
            } else {
                this.createOrUpdateCash();
            }
        } else {
            this.snackbarService.throwErrorSnackBar(
                'Form is invalid. Please resolve the errors.',
            );
        }
    }

    createOrUpdateCash(isDraft = false) {
        const cashRecord = this.generateCashRecord();
        if (this.isPostingAndTraxChecked(cashRecord)) {
            this.snackbarService.throwErrorSnackBar(this.postingWarningWhenBothbuttonEnabled);
            return;
        } else if (this.isPostingChecked(cashRecord) && !isDraft) {
            const dialog = this.showPostingWarning();
            dialog.afterClosed().subscribe((answer) => {
                if (answer) {
                    this.cashId ? this.updateCash(cashRecord) : this.createCash(cashRecord, isDraft);
                }
            });
        } else {
            this.cashId ? this.updateCash(cashRecord) : this.createCash(cashRecord, isDraft);
        }
    }

    showPostingWarning(): MatDialogRef<CashWarningDialogComponentComponent> {
        const dialog = this.dialog.open(CashWarningDialogComponentComponent, {
            data: {
                title: this.postingWarningTitle,
                text: this.cashTypeId === this.cashType.CashPayment ? this.postingWarning : this.postingWarningForReceipts,
                okButton: 'Save Anyway',
                cancelButton: 'Discard',
                editButton: 'Edit Cash',
            },
        });

        return dialog;
    }

    isPostingChecked(cashRecord: CashRecord): boolean {
        return (cashRecord.authorizedForPosting === false &&
            (cashRecord.toTransmitToTreasury === undefined || cashRecord.toTransmitToTreasury === false));
    }

    isPostingAndTraxChecked(cashRecord: CashRecord): boolean {
        return (cashRecord.authorizedForPosting === true && cashRecord.toTransmitToTreasury === true);
    }

    createCash(cashRecord: CashRecord, isDraft = false) {
        this.saveInProgress = true;
        let dialog: MatDialogRef<DocumentGenerationConfirmationDialogBoxComponent>;
        const messageGenerating = 'Generating payment order' + (isDraft ? ' preview' : '') + '... Please wait.';
        if (isDraft) {
            dialog = this.documentPopupService.showDocumentGenerationPopup('Payment order', 'payment order', this.popupButtonSettings);
            if (this.isPostingChecked(cashRecord)) {
                dialog.componentInstance.bannerDescription = this.postingWarning;
            }
            this.documentPopupService.startDialogWork(dialog, messageGenerating);
        } else {
            this.snackbarService.informationSnackBar(messageGenerating);
        }
        cashRecord.isDraft = isDraft;
        this.executionService.createCash(cashRecord)
            .pipe(
                mergeMap((cash: CashRecord) => {
                    const messageGenerated = (cash.physicalDocumentId ? 'Document' : 'Cash') + ' generated successfully';
                    if (dialog) {
                        dialog.componentInstance.processMessage = messageGenerated;
                    } else {
                        this.snackbarService.informationSnackBar(messageGenerated);
                    }
                    return combineLatest(
                        (cash.physicalDocumentId) ?
                            this.documentService.getGeneratedDocumentContent(cash.physicalDocumentId, isDraft)
                            : of(null),
                        of(cash));
                }),
                catchError((error) => {
                    if (dialog) {
                        dialog.close();
                    }

                    return throwError(error);
                }),
                finalize(() => {
                    this.saveInProgress = false;
                    this.documentPopupService.finishDialogWork(dialog);
                }),
            )
            .subscribe(([response, cash]) => {
                cash.documentMatchings = cashRecord.documentMatchings;
                if (!isDraft) {
                    this.afterCreateCash(cash);
                } else {
                    this.handleDialogEvents(cash, dialog);
                }
                if (response) {
                    this.downloadFile(response);
                }
            });
    }

    downloadFile(response: HttpResponse<Blob>) {
        const newBlob = new Blob(
            [response.body],
            { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
        const data = this.window.URL.createObjectURL(newBlob);
        const link = document.createElement('a');
        link.href = data;
        link.download = this.utilService.getFileNameFromContentDisposition(response);
        link.click();
    }

    handleDialogEvents(cashRecord: CashRecord,
        dialog: MatDialogRef<DocumentGenerationConfirmationDialogBoxComponent>) {

        this.subscriptions.push(dialog.componentInstance.documentSelected
            .subscribe((file: File) => {
                this.onFileSelected(dialog, cashRecord, file);
            }));

        this.subscriptions.push(dialog.afterClosed()
            .subscribe((answer) => {
                this.onDialogClosed(answer);
            }));
    }

    onFileSelected(dialog: MatDialogRef<DocumentGenerationConfirmationDialogBoxComponent>,
        cashRecord: CashRecord,
        file: File) {
        this.documentPopupService.startDialogWork(dialog, 'Uploading document...');
        const documentType = this.mapCashSelectionTypeToPhysicalDocumentType(cashRecord.childCashTypeId);
        this.subscriptions.push(this.documentService.uploadDocument(
            cashRecord.cashId,
            documentType,
            cashRecord.template,
            true,
            file)
            .pipe(
                mergeMap((document: PhysicalDocumentReference) => {
                    dialog.componentInstance.processMessage = 'Generating final document...';
                    const finalCash = this.generateCashRecord();
                    finalCash.physicalDocumentId = document.physicalDocumentId;
                    return this.executionService.createCash(finalCash);
                }),
                mergeMap((cash: CashRecord) => {
                    dialog.componentInstance.processMessage = 'Downloading final document...';
                    return combineLatest(this.documentService.getGeneratedDocumentContent(cash.physicalDocumentId), of(cash));
                }),
                finalize(() => {
                    this.documentPopupService.finishDialogWork(dialog);
                }),
            ).subscribe(
                ([response, cash]) => {
                    cash.documentMatchings = cashRecord.documentMatchings;
                    this.downloadFile(response);
                    this.afterCreateCash(cash);
                    dialog.close();
                },
                (error: HttpErrorResponse) => {
                    dialog.componentInstance.errorMessage = this.documentPopupService.getErrorMessage(error, DocumentEntityTypes.Cash);
                },
            ));
    }

    mapCashSelectionTypeToPhysicalDocumentType(cashSelectionType: CashSelectionType): DocumentTypes {
        switch (cashSelectionType) {
            case CashSelectionType.SimpleCashPayment:
            case CashSelectionType.SimpleCashReceipt:
                return DocumentTypes.CashSimpleCash;
            case CashSelectionType.PaymentFullPartialTransaction:
            case CashSelectionType.ReceiptFullPartialTransaction:
                return DocumentTypes.CashPickByTransaction;
            case CashSelectionType.PaymentDifferentCurrency:
            case CashSelectionType.ReceiptDifferentCurrency:
                return DocumentTypes.CashDifferentCurrency;
            case CashSelectionType.PaymentDifferentClient:
                return DocumentTypes.CashDifferentClient;
            default:
                console.error('Invalid cash selection type: %s', cashSelectionType);
        }
    }

    onDialogClosed(dialogAnswer: any) {
        if (dialogAnswer && dialogAnswer['buttonClicked']) {
            if (dialogAnswer['buttonClicked'] === GenerateDocumentActions.ConfirmDocumentGeneration) {
                const cashRecord = this.generateCashRecord();
                this.createCash(cashRecord);
            }
        }
    }

    generateCashRecord(): CashRecord {
        let cashRecord = new CashRecord();
        cashRecord.cashTypeId = this.cashTypeId;
        cashRecord.costDirectionId = this.cashTypeId;
        cashRecord.childCashTypeId = this.selectionValue;
        this.assignPickTransactionIfNull();
        const invoices = this.getSelectedInvoiceFromPickTransactionInvoiceList();
        cashRecord = this.getCreateCashInfo(cashRecord);
        cashRecord.ownerName = (this.cashTypeId === CashType.CashPayment ?
            cashRecord.payee : cashRecord.payer);
        cashRecord.nominalAccountCode = cashRecord.nominalAccountCode ? cashRecord.nominalAccountCode.toString() : '';
        // if cash is by diff ccy , assign cash ammount to MatchingAmount
        if (this.selectionValue === CashSelectionType.PaymentDifferentCurrency) {
            // Consider ex  With diff ccy USD=>EUR
            // amount will be in EUR
            // MatchedAmount will be in USD

            cashRecord.matchingAmount = cashRecord.amount;
            // To convert from EUR to USD we need to do opposite action for RateType
            // If matchingRateType === 'D' than we need to multiplt rate*matchedamount and visa varsa
            cashRecord.amount = cashRecord.matchingRateType === 'D' ?
                ConvertToNumber(cashRecord.amount) * cashRecord.matchingRate
                : ConvertToNumber(cashRecord.amount) / cashRecord.matchingRate;

            // As per TDD in CashPayments , additionalcost amount need to be deducted with total amount
            if (cashRecord.additionalCostDetails && cashRecord.additionalCostDetails.length > 0) {
                let totalAdditonalCostAmount = cashRecord.additionalCostDetails
                    .map((c) => c.amount)
                    .reduce((sum, current) => sum + current);
                cashRecord.matchingAmount -= totalAdditonalCostAmount;
                totalAdditonalCostAmount = cashRecord.matchingRateType === 'D' ?
                    ConvertToNumber(totalAdditonalCostAmount) * cashRecord.matchingRate
                    : ConvertToNumber(totalAdditonalCostAmount) / cashRecord.matchingRate;
                cashRecord.amount -= totalAdditonalCostAmount;

            }

        } else if (this.selectionValue === CashSelectionType.ReceiptDifferentCurrency) {
            cashRecord.matchingAmount = cashRecord.amount;
            // convert payment currency amount to matchec ccy amount
            const matchedAmount = cashRecord.matchingRateType === 'D' ?
                ConvertToNumber(cashRecord.amount) * cashRecord.matchingRate
                : ConvertToNumber(cashRecord.amount) / cashRecord.matchingRate;
            cashRecord.amount = ConvertToNumber(matchedAmount);
        }

        return cashRecord;
    }

    updateCash(cashRecord: CashRecord) {
        // Call service to update cash.
        this.saveInProgress = true;
        cashRecord.cashId = this.cashId;
        cashRecord.transactionDocumentId = this.transactionDocumentId;
        cashRecord.documentReference = this.documentReferenceNumber;
        cashRecord.matchedDocumentReference = this.matchedDocumentReference;
        cashRecord.matchingCashId = this.matchingChashId; // for different CCY
        this.saveCashSubscription = this.executionService.updateCash(cashRecord)
            .subscribe(
                (data) => {
                    this.snackbarService.informationAndCopySnackBar(
                        'Cash with document reference : ' + this.documentReferenceNumber + ' is updated', this.documentReferenceNumber);
                    cashRecord.cashTypeId = this.selectionValue;
                    this.cashSummaryFormComponent.populateCashRecord(cashRecord);
                    if (this.selectionValue === CashSelectionType.SimpleCashReceipt) {
                        this.stepper.selectedIndex = CashStepperType.ReceiptSummary;
                    } else {
                        this.stepper.next();
                    }
                },
                (error) => {
                    this.saveInProgress = false;
                    this.snackbarService.throwErrorSnackBar('Oops! An error ocurred');
                },
                () => {
                    this.saveInProgress = false;
                });
    }

    afterCreateCash(localCashRecord: CashRecord) {
        let cashIdToLoad = localCashRecord.cashId;
        // In case of diff ccy, we load the payment cash
        if (this.selectionValue === CashSelectionType.PaymentDifferentCurrency ||
            this.selectionValue === CashSelectionType.ReceiptDifferentCurrency) {
            cashIdToLoad = localCashRecord.paymentCashId;
        }
        this.subscriptions.push(this.executionService.getCashByCashId(cashIdToLoad)
            .subscribe((cashRecord) => {
                cashRecord.costAlternativeCode = localCashRecord.costAlternativeCode;
                cashRecord.departmentAlternativeCode = localCashRecord.departmentAlternativeCode;
                cashRecord.c2CCode = localCashRecord.c2CCode;
                cashRecord.nominalAlternativeAccount = localCashRecord.nominalAlternativeAccount;
                cashRecord.taxInterfaceCode = localCashRecord.taxInterfaceCode;

                if ((cashRecord.costAlternativeCode && cashRecord.departmentAlternativeCode && cashRecord.nominalAlternativeAccount
                    && cashRecord.c2CCode) || !cashRecord.authorizedForPosting) {
                    if (cashRecord.matchedDocumentReference !== null) {
                        this.snackbarService.informationAndCopySnackBar(
                            'Cash created with document reference: '
                            + cashRecord.documentReference + '/' + cashRecord.matchedDocumentReference,
                            cashRecord.documentReference + '/' + cashRecord.matchedDocumentReference);

                    } else {
                        this.snackbarService.informationAndCopySnackBar(
                            'Cash created with document reference: ' + cashRecord.documentReference, cashRecord.documentReference);
                    }
                } else {
                    if (!cashRecord.costAlternativeCode) {
                        this.mappingFields.push('"Cost Alternative Code"');
                    }
                    if (!cashRecord.departmentAlternativeCode) {
                        this.mappingFields.push('"Department Alternative Code"');
                    }
                    if (!cashRecord.nominalAlternativeAccount) {
                        this.mappingFields.push('"Nominal Account"');
                    }
                    // tax code implementation is not there currently
                    // if (!cashRecord.taxInterfaceCode) {
                    //     this.mappingFields.push('"Tax Code"');
                    // }
                    if (!cashRecord.c2CCode) {
                        this.mappingFields.push('"C2C code"');
                    }
                    const mappingErrorFields = this.mappingFields.join(', ');
                    const message = 'The document ' + cashRecord.documentReference +
                        ' will not be sent to the accounting interface because the accounting interface code for ' + mappingErrorFields
                        + ' is/are not filled in. Please contact the accountant';
                    this.snackbarService.informationAndCopySnackBar(message, message);
                }

                this.cashSummaryFormComponent.populateCashRecord(cashRecord);
                if (this.selectionValue === CashSelectionType.SimpleCashReceipt) {
                    this.stepper.selectedIndex = CashStepperType.ReceiptSummary;
                } else {
                    this.stepper.next();
                }
            }));
    }

    isCashFormValid(): boolean {
        if (this.selectionValue === CashSelectionType.ReceiptDifferentCurrency
            || this.selectionValue === CashSelectionType.PaymentDifferentCurrency) {
            if (this.cashDetailsFormComponent.createCashFormGroup.valid) {
                return true;
            }
        } else {

            if (this.cashDetailsFormComponent.createCashFormGroup.valid) {
                return true;
            }
        }
    }
    onNewDocumentClicked() {
        this.isSave = true;
        this.router.navigate(
            ['/' + this.companyManager.getCurrentCompanyId() +
                '/execution/cash/new/' + encodeURIComponent(this.cashTypeId.toString())],
            {
                queryParams: {
                    selectedCashTypeId: this.selectionValue,
                    isNewDoc: true,
                },
            });
    }
    onNewTransactionClicked() {
        this.isSave = true;
        this.router.navigate(['/' + this.companyManager.getCurrentCompanyId() +
            '/execution/cash/new/' + encodeURIComponent(this.cashTypeId.toString())]);
    }

    onInvoicesSelected(invoicesSelected: boolean) {
        this.isValid = invoicesSelected;
        this.isDisabled = !this.isValid;

        const invoices = this.getSelectedInvoiceFromPickTransactionInvoiceList();
        this.calculateBalanceWithCost(invoices);
    }
    getCreateCashInfo(cashRecord?: CashRecord): CashRecord {
        let cash: CashRecord = new CashRecord();

        if (cashRecord) {
            cash = cashRecord;
        }
        this.formComponents.forEach((comp) => {
            cash = comp.populateEntity(cash);
        });

        // add functionalcurrencycode and statutorycurrencycode based on company configration.
        cash.functionalCurrencyCode = this.companyConfiguration.functionalCurrencyCode;
        cash.statutoryCurrencyCode = this.companyConfiguration.statutoryCurrencyCode;
        cash.functionalToStatutoryCurrencyRoeType = this.functionalStatutoryCurrencyRoeType;
        cash.functionalToStatutoryCurrenyRate = this.functionalStatutoryCurrenyRate;

        return cash;
    }
    onDiscardButtonClicked() {
        this.isSave = true;
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
                this.router.navigate(['/' + this.companyManager.getCurrentCompanyId() + '/execution/cash']);
            }
        });
    }
    onDiscardButtonClickedForCashSelectionType() {
        this.isSave = true;
        this.router.navigate(['/' + this.companyManager.getCurrentCompanyId() + '/execution/cash']);

    }
    onPreviousButtonClicked() {
        this.isSave = true;
        this.isCompleted = false;
        this.isDisabled = false;
        if (this.selectionValue === CashSelectionType.SimpleCashPayment) {
            this.stepper.selectedIndex = CashStepperType.PaymentCashType;
        } else if (this.selectionValue === CashSelectionType.SimpleCashReceipt) {
            this.stepper.selectedIndex = CashStepperType.ReceiptCashType;
        } else {
            this.stepper.previous();
        }
    }
    onCheckBoxValueChange(value) {
        this.isDisabled = value;
    }
    onCashOptionSelected(option) {
        this.selectionValue = option.option;
        this.isDisabled = !option.checked;
    }

    onPaymentNextButtonClicked() {
        // clear grid data
        this.cashDetailsFormComponent.bindSelectedValue(this.selectionValue);
        this.cashDetailsFormComponent.documentInformationFormComponent.filterCurrencies();
        this.pickTransactionComponent.clearControls();
        this.pickTransactionComponent.bindSelectedValue(this.selectionValue);
        this.pickTransactionComponent.invoiceMatchingComponent.filterCurrencies();
        this.pickTransactionComponent.invoiceMatchingComponent.selectedValue = this.selectionValue;
        this.pickTransactionComponent.invoiceMatchingComponent.setSearchFieldsSize();
        if (this.selectionValue === CashSelectionType.SimpleCashPayment) {
            this.pickTransactionComponentInitial = this.pickTransactionComponent;
            this.isSimpleCashSelected = true;
            this.stepper.next();
        } else {
            this.isSimpleCashSelected = false;
            this.stepper.next();
        }
        this.cashDetailsFormComponent.bindSelectedValue(this.selectionValue);
        if (this.selectionValue === CashSelectionType.SimpleCashPayment) {
            if (this.cashDetailsFormComponent.additionalCostsFormComponent.gridColumnApi) {
                this.cashDetailsFormComponent.additionalCostsFormComponent.gridColumnApi.setColumnVisible('accountLineType', false);
            }
        }
        if (this.selectionValue === CashSelectionType.PaymentDifferentCurrency) {
            if (this.pickTransactionComponent.invoiceMatchingComponent.gridColumnApi) {
                this.pickTransactionComponent.invoiceMatchingComponent.gridColumnApi.setColumnVisible('amountPaidInDiffCcy', true);
            }

        }
    }
    onNextReceiptButtonClicked() {
        if (this.selectionValue === CashSelectionType.ReceiptDifferentCurrency ||
            this.selectionValue === CashSelectionType.ReceiptFullPartialTransaction) {
            this.cashDetailsFormComponent.additionalCostsFormComponent.showGrid = false;
            this.pickTransactionComponent.additionalCostsPickTransactionComponent.showGrid = true;
        } else {
            this.cashDetailsFormComponent.additionalCostsFormComponent.showGrid = true;
            this.pickTransactionComponent.additionalCostsPickTransactionComponent.showGrid = false;
        }
        this.cashDetailsFormComponent.bindSelectedValue(this.selectionValue);
        this.cashDetailsFormComponent.documentInformationFormComponent.filterCurrencies();
        if (this.selectionValue === CashSelectionType.SimpleCashReceipt) {
            if (this.cashDetailsFormComponent.additionalCostsFormComponent.gridColumnApi) {
                this.cashDetailsFormComponent.additionalCostsFormComponent.gridColumnApi.setColumnVisible('accountLineType', false);
            }
        }
        if (this.selectionValue === CashSelectionType.ReceiptDifferentCurrency) {
            this.cashDetailsFormComponent.documentInformationFormComponent.isDiffCurrency = true;
            this.cashDetailsFormComponent.updateValidatorForAmount();
        } else {
            this.cashDetailsFormComponent.documentInformationFormComponent.isDiffCurrency = false;
            this.cashDetailsFormComponent.updateValidatorForAmount();
        }

        this.pickTransactionComponent.additionalCostsPickTransactionComponent.selectionValue = this.selectionValue;
        this.pickTransactionComponent.invoiceMatchingComponent.setSearchFieldsSize();

        this.stepper.next();
    }
    validateFxRate(): boolean {
        return this.selectionValue === CashSelectionType.ReceiptDifferentCurrency
            ? this.cashDetailsFormComponent.currencyFormComponent.isFxRateValid ? true : false
            : true;
    }
    onNextButtonClicked() {
        this.isSave = true;
        this.isCompleted = true;
        const currentDetails: InvoiceForCashMatching = this.cashDetailsFormComponent.getInvoiceSearchValues();
        const isDetailsChanged = this.isDetailsChanged(currentDetails);
        this.saveCurrentDetails(isDetailsChanged, currentDetails);
        const isSearchRequired = this.pickTransactionComponent.invoiceMatchingComponent.isSearchRequired();

        if (this.isCashFormValid()
            && this.validateFxRate()) {
            if ((isDetailsChanged || isSearchRequired)) {
                this.pickTransactionComponent.invoiceMatchingComponent.bindCurrencyValue(
                    this.cashDetailsFormComponent.documentInformationFormComponent.currencyCtrl.value);

                this.pickTransactionComponent.bindSelectedValue(this.selectionValue);
                this.pickTransactionComponent.invoiceMatchingComponent.selectedValue = this.selectionValue;
                this.pickTransactionComponent.invoiceMatchingComponent.cashTypeId = this.cashTypeId;
                this.pickTransactionComponent.invoiceMatchingComponent.setSearchFieldsSize();

                const isDifferentCurrency = this.selectionValue === CashSelectionType.ReceiptDifferentCurrency
                    ? true : false;
                if (this.pickTransactionComponent.invoiceMatchingComponent.gridColumnApi) {
                    this.pickTransactionComponent.invoiceMatchingComponent.gridColumnApi
                        .setColumnVisible('amountPaidInDiffCcy', isDifferentCurrency);
                }

                if (this.selectionValue === CashSelectionType.SimpleCashReceipt) {
                    this.stepper.selectedIndex = CashStepperType.ReceiptSummary;
                } else {
                    this.stepper.next();
                }

                // check whther the previously selected counterparty , currency and amount are assigned .

                const previousCounterpartyCode = this.pickTransactionComponent.invoiceMatchingComponent.previousCounterpartyCode;
                const previousCurrencyCode = this.pickTransactionComponent.invoiceMatchingComponent.previousCurrencyCode;
                let previousPaymentCurrency = null;
                let previousFxRateValue = null;
                if (this.selectionValue === CashSelectionType.ReceiptDifferentCurrency) {
                    previousPaymentCurrency = this.pickTransactionComponent.invoiceMatchingComponent.previousPaymentCurrency;
                    previousFxRateValue = this.pickTransactionComponent.invoiceMatchingComponent.previousFxRateValue;

                }

                if (previousCounterpartyCode || previousCurrencyCode ||
                    previousPaymentCurrency || previousFxRateValue) {
                    // if matching  conditions are modified
                    if (previousCounterpartyCode !==
                        this.pickTransactionComponent.invoiceMatchingComponent.counterpartyCtrl.value
                        || previousCurrencyCode !==
                        this.pickTransactionComponent.invoiceMatchingComponent.currencyCtrl.value
                        ||
                        ((this.selectionValue === CashSelectionType.ReceiptDifferentCurrency) && (
                            previousPaymentCurrency !==
                            this.pickTransactionComponent.invoiceMatchingComponent.bankCurrencyCtrl.value
                            || previousFxRateValue !==
                            this.pickTransactionComponent.invoiceMatchingComponent.fxRateCtrl.value
                        ))
                    ) {

                        if (!this.isEdit) {
                            this.pickTransactionComponent.clearAdditonalCostGrid();
                        }
                        // than clear previous selection
                        this.pickTransactionComponent.invoiceMatchingComponent.isInvoiceSelected = false;
                        this.pickTransactionComponent.invoiceMatchingComponent.onSearchButtonClicked();

                    }
                } else {
                    this.pickTransactionComponent.invoiceMatchingComponent.isInvoiceSelected = false;
                    this.pickTransactionComponent.invoiceMatchingComponent.onSearchButtonClicked();
                }

                // if amount is changes than re calculate the amount based on invoices selected.
                const previousAmount = this.pickTransactionComponent.invoiceMatchingComponent.previousAmount;
                if (previousAmount) {

                    if (previousAmount !== this.pickTransactionComponent.invoiceMatchingComponent.totalAmount) {
                        this.pickTransactionComponent.invoiceMatchingComponent.
                            reCalculateTotalAmountBasedonUpdatedAmountValue();
                    }
                }

                // bind currency component from document information card to invoicemarkingcard.

                this.cashDetailsFormComponent.bindSelectedValue(this.selectionValue);
            } else {
                if (this.selectionValue === CashSelectionType.SimpleCashReceipt) {
                    this.stepper.selectedIndex = CashStepperType.ReceiptSummary;
                } else {
                    this.stepper.next();
                }
            }
        } else {
            this.snackbarService.throwErrorSnackBar(
                'Form is invalid. Please resolve the errors.',
            );
        }
    }

    // Cash Payment
    onMatchSelectedButtonClicked() {
        this.isSave = true;
        this.isCompleted = true;
        this.pickTransactionComponent.invoiceMatchingComponent.selectedValue = this.selectionValue;
        if (this.isValid) {
            if (this.isValidInvoiceList()) {
                if (this.pickTransactionComponent.additionalCostsPickTransactionComponent.isAdditionalCostValid()) {
                    this.InvoicesSelected();
                    const departmentId = this.getDepartmentIdFromSelectedInvoices();
                    if (this.totalbalance['balance']['value'] < 0) {
                        this.cashDetailsFormComponent.currencyFormComponent.amount = -(this.totalbalance['balance']['value']);
                        this.cashDetailsFormComponent.documentInformationFormComponent.bindDocumentValues();
                        this.cashDetailsFormComponent.counterpartyFormComponent.bindCounterpartyValues();
                        this.cashDetailsFormComponent.currencyFormComponent.bindCurrencyValues();
                        this.cashDetailsFormComponent.additionalCostsFormComponent.showGrid = false;
                        this.cashDetailsFormComponent.documentInformationFormComponent.bindDepartmentControl(departmentId);
                        if (this.selectionValue === CashSelectionType.PaymentDifferentCurrency) {
                            this.cashDetailsFormComponent.documentInformationFormComponent.isDiffCurrency = true;
                            this.cashDetailsFormComponent.updateValidatorForAmount();
                        } else {
                            this.cashDetailsFormComponent.documentInformationFormComponent.isDiffCurrency = false;
                            this.cashDetailsFormComponent.updateValidatorForAmount();
                        }

                        this.stepper.next();
                    } else {
                        this.snackbarService.throwErrorSnackBar(
                            'Balance must be less than Zero',
                        );
                    }
                } else {
                    this.snackbarService.throwErrorSnackBar(
                        'Cost is invalid. Please resolve the errors.',
                    );
                }
            } else {
                this.snackbarService.throwErrorSnackBar(
                    'Selected invoice has invalid values. Please resolve the errors.',
                );
            }
        } else {
            this.snackbarService.throwErrorSnackBar(
                'Select an invoice To match',
            );
        }

        this.pickTransactionComponent.invoiceMatchingComponent.getSelectedInvoices();
    }

    onCreateReceiptButtonClicked() {
        this.isSave = true;
        this.isCompleted = true;
        if (this.isValid) {
            if (this.isValidInvoiceList()) {
                if (this.pickTransactionComponent.additionalCostsPickTransactionComponent.isAdditionalCostValid()) {
                    if (this.selectionValue === CashSelectionType.ReceiptFullPartialTransaction
                        || this.selectionValue === CashSelectionType.ReceiptDifferentCurrency) {
                        const invoices = this.getSelectedInvoiceFromPickTransactionInvoiceList();
                        // this.calculateBalanceWithCost(invoices);
                    }
                    if (this.totalAmount && this.totalAmount['amount']['value'] === 0) {
                        this.onCreateButtonClicked();
                    } else {
                        this.snackbarService.throwErrorSnackBar(
                            'Balance must be equal to Zero',
                        );
                    }
                } else {
                    this.snackbarService.throwErrorSnackBar(
                        'Cost is invalid. Please resolve the errors.',
                    );
                }
            } else {
                this.snackbarService.throwErrorSnackBar(
                    'Selected invoice has invalid values. Please resolve the errors.',
                );
            }
        } else {
            this.snackbarService.throwErrorSnackBar(
                'Select an invoice To match',
            );
        }
    }

    onSetNarrative(narrative: string) {
        this.cashDetailsFormComponent.additionalDetailsFormComponent.setNarrative(narrative);
    }

    calculateTotalBalanceOnCostAmountEnter() {
        const invoices = this.getSelectedInvoiceFromPickTransactionInvoiceList();
        this.calculateBalanceWithCost(invoices);
    }

    calculateTotalBalanceOnCostAmountEnterInCashDetails() {
        // -- JEL - UAT 18774: Issue is we are using the same events and same variables for multiple processes and multiple components.
        // this makes it so the same code is executed where it pobably shouldn't (different screens using the same code)
        // To fix this issue, we are creating a seperate function for this card and for our case, we are not executing the code
        if (this.selectionValue !== CashSelectionType.SimpleCashReceipt && this.selectionValue !== CashSelectionType.SimpleCashPayment) {
            const invoices = this.getSelectedInvoiceFromPickTransactionInvoiceList();
            this.calculateBalanceWithCost(invoices);
        }
    }

    calculateAmountWithCostSimpleCPCI() {
        let totalCostAmount = 0;
        const costs = this.cashDetailsFormComponent.additionalCostsFormComponent.getGridData() as AdditionalCost[];
        if (costs.length > 0) {
            if (this.selectionValue === CashSelectionType.SimpleCashReceipt ||
                this.selectionValue === CashSelectionType.ReceiptFullPartialTransaction ||
                this.selectionValue === CashSelectionType.ReceiptDifferentCurrency) {
                totalCostAmount = costs.map((c) => (c.amount ? c.amount : 0) *
                    (c.costDirectionId === CostDirections.Payable ? -1 : 1)).reduce((sum, current) => sum + current);
            } else {
                totalCostAmount = costs.map((c) => (c.amount ? c.amount : 0) *
                    (c.costDirectionId === CostDirections.Payable ? 1 : -1)).reduce((sum, current) => sum + current);
            }
        }

        if (this.cashDetailsFormComponent.documentInformationFormComponent.cashAmountValue) {
            const amountWithCost = ConvertToNumber(this.cashDetailsFormComponent.documentInformationFormComponent.cashAmountValue)
                + totalCostAmount;
            this.cashDetailsFormComponent.documentInformationFormComponent.amountCtrl.patchValue(amountWithCost);
        }
    }

    calculateBalanceWithCost(invoices: CashMatching[]) {
        const commonMethods = new CommonMethods();
        if (this.selectionValue === CashSelectionType.SimpleCashReceipt || this.selectionValue === CashSelectionType.SimpleCashPayment) {
            this.calculateAmountWithCostSimpleCPCI();
        }

        let totalCostAmount = 0;
        const costs = this.pickTransactionComponent.additionalCostsPickTransactionComponent.getGridData() as AdditionalCost[];
        if (costs.length > 0) {
            totalCostAmount = costs.map(
                (c) =>
                    (c.amount ? c.amount : 0) *
                    ((c.costDirectionId === CostDirections.Payable && this.cashTypeId === CashType.CashPayment)
                        || ((c.costDirectionId === CostDirections.Receivable && this.cashTypeId === CashType.CashReceipt)) ? -1 : 1),
            )
                .reduce((sum, current) => sum + current);
        }
        if (this.cashTypeId === CashType.CashReceipt) {
            if (this.selectionValue === CashSelectionType.ReceiptFullPartialTransaction) {

                this.balance = this.pickTransactionComponent.invoiceMatchingComponent.totalAmount
                    + ((invoices && invoices.length > 0) ?
                        invoices.map((a) => (a.amountToBePaid ? a.amountToBePaid : 0)
                            * (commonMethods.getSignedValueForDocumentAmountBasedOnDocumentTypeAndCostDirection
                                (a.documentType, this.costDirectionId, a, false))).
                            reduce((sum, current) => sum + current)
                        : 0)
                    + totalCostAmount;
            } else if (this.selectionValue === CashSelectionType.ReceiptDifferentCurrency) {
                this.balance = ConvertToNumber(this.pickTransactionComponent.invoiceMatchingComponent.totalAmount)
                    + ((invoices && invoices.length > 0) ?
                        invoices.map((a) => a.amountPaidInDiffCcy
                            * (commonMethods.getSignedValueForDocumentAmountBasedOnDocumentTypeAndCostDirection
                                (a.documentType, this.costDirectionId, a, false)))
                            .reduce((sum, current) => sum + current) : 0)
                    + totalCostAmount;
            }

            this.pickTransactionComponent.invoiceMatchingComponent.invoiceAmount =
                ConvertToNumber(this.balance ? this.balance.toFixed(2) : this.balance);

            this.pickTransactionComponent.invoiceMatchingComponent.formattedInvoiceAmount = this.balance;

            if (this.totalAmount) {
                this.totalAmount['amount']['value'] = ConvertToNumber(this.balance.toFixed(2));
            }
        } else {
            if (this.selectionValue === CashSelectionType.PaymentFullPartialTransaction
                || this.selectionValue === CashSelectionType.PaymentDifferentClient) {

                this.balance = ((invoices && invoices.length > 0) ? invoices.map((a) => (a.amountToBePaid ? a.amountToBePaid : 0) *
                    (commonMethods.getSignedValueForDocumentAmountBasedOnDocumentTypeAndCostDirection
                        (a.documentType, this.costDirectionId, a, false)))
                    .reduce((sum, current) => sum + current) : 0)
                    + totalCostAmount;
            } else if (this.selectionValue === CashSelectionType.PaymentDifferentCurrency) {
                this.balance = ((invoices && invoices.length > 0) ? invoices.map((a) => a.amountPaidInDiffCcy *
                    (commonMethods.getSignedValueForDocumentAmountBasedOnDocumentTypeAndCostDirection
                        (a.documentType, this.costDirectionId, a, false)))
                    .reduce((sum, current) => sum + current) : 0)
                    + totalCostAmount;
            }
            const balanceWithDecimalValue = this.balance ? ConvertToNumber(this.balance.toFixed(2)) : this.balance;

            if (this.totalbalance) {
                this.totalbalance['balance'].value = balanceWithDecimalValue;
            }

            this.cashDetailsFormComponent.documentInformationFormComponent.amountValue =
                Math.abs(balanceWithDecimalValue);
            this.cashDetailsFormComponent
                .documentInformationFormComponent.amountOriginalCurrency = this.getAmountToBePaidInOriginalCurrency();
            this.pickTransactionComponent.invoiceMatchingComponent.totalBalance = balanceWithDecimalValue;
            if (balanceWithDecimalValue) {
                this.pickTransactionComponent.invoiceMatchingComponent.formattedBalance =
                    balanceWithDecimalValue.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    });
            }
        }
    }

    getAmountToBePaidInOriginalCurrency(): number {
        const originalAmounts = this.getSelectedInvoiceFromPickTransactionInvoiceList().map((invoice) => invoice.amountToBePaid);
        let totalOriginalAmount = 0;
        originalAmounts.filter((amount) => typeof (amount) === 'number') // remove null amounts
            .forEach((amount) => totalOriginalAmount += amount);
        return totalOriginalAmount;
    }

    onProceedClickedCashReceipt() {
        this.insertCostToAdjustBalance();
    }

    insertCostToAdjustBalance() {
        this.costCurrency = (this.selectionValue === CashSelectionType.ReceiptDifferentCurrency ||
            this.selectionValue === CashSelectionType.PaymentDifferentCurrency) ?
            this.pickTransactionComponent.additionalCostsPickTransactionComponent.cashCurrency
            : this.pickTransactionComponent.invoiceMatchingComponent.currencyValue;

        // this.costCurrency = this.pickTransactionComponent.invoiceMatchingComponent.currencyValue;

        const fxRate = this.costCurrency === 'USD' ?
            1 : (this.masterdata.fxRates.filter((e) => e.currencyCode === this.costCurrency)[0].rate
                ? this.masterdata.fxRates.filter((e) => e.currencyCode === this.costCurrency)[0].rate
                : 1);
        const totalBalance = this.pickTransactionComponent.invoiceMatchingComponent.invoiceAmount;
        let multiplyDivide: string;
        if (this.cashSelectionId === CashSelectionType.PaymentDifferentCurrency ||
            this.cashSelectionId === CashSelectionType.ReceiptDifferentCurrency) {
            const matchingCurrency = this.pickTransactionComponent.invoiceMatchingComponent.bankCurrencyValue;
            multiplyDivide = this.masterdata.currencies.filter((e) => e.currencyCode === matchingCurrency)[0].roeType;
        } else {
            multiplyDivide = this.masterdata.currencies.filter((e) => e.currencyCode === this.costCurrency)[0].roeType;
        }
        const totalBalanceInUSD = (multiplyDivide === 'M') ? totalBalance * Number(fxRate) : (totalBalance / Number(fxRate));
        if (this.selectionValue === CashSelectionType.ReceiptFullPartialTransaction
            || this.selectionValue === CashSelectionType.ReceiptDifferentCurrency) {
            if (totalBalanceInUSD !== 0 && totalBalanceInUSD < 100 && totalBalanceInUSD > -100) {
                const newCostRow = new AdditionalCostListDisplayView();
                newCostRow.isDirty = true;
                newCostRow.costDirection = this.pickTransactionComponent.invoiceMatchingComponent.invoiceAmount > 0
                    ? 'Receivable' : 'Payable';
                const costType = this.masterdata.costTypes.find((e) => e.costTypeCode === 'BANKOTH');
                if (costType) {
                    newCostRow.costTypeCode = this.masterdata.costTypes.filter((e) => e.costTypeCode === 'BANKOTH')[0].costTypeCode;
                    newCostRow.accountCode = costType.nominalAccountCode;
                    newCostRow.nominalAccountNumber = costType.nominalAccountCode;
                    newCostRow.accountLineType = costType.nominalAccountCode ? 'L' : 'B';
                }
                newCostRow.currencyCode = this.costCurrency;
                newCostRow.amount = Math.abs(this.pickTransactionComponent.invoiceMatchingComponent.invoiceAmount);

                if (this.pickTransactionComponent.additionalCostsPickTransactionComponent.gridApi) {
                    const res = this.pickTransactionComponent.additionalCostsPickTransactionComponent
                        .gridApi.updateRowData({ add: [newCostRow] });
                    // re-calculate the total balance here.
                    const invoices = this.getSelectedInvoiceFromPickTransactionInvoiceList();
                    this.calculateBalanceWithCost(invoices);
                }
            } else {
                this.snackbarService.throwErrorSnackBar(
                    'Cannot book the cash receipt, Total Balance left is greater than USD 100.',
                );
                return;
            }
        }
    }

    InvoicesSelected() {
        const invoices = this.getSelectedInvoiceFromPickTransactionInvoiceList();
        // this.calculateBalanceWithCost(invoices);
        if (invoices) {
            this.cashSummaryFormComponent.invoiceGridForSummaryComponent.invoicesToBeSelected(invoices);
        }
        this.cashSummaryFormComponent.invoiceForSummaryStep(invoices);
    }
    onTotalBalanceCalculated(balance) {
        this.totalbalance = balance;

        const invoices = this.getSelectedInvoiceFromPickTransactionInvoiceList();
        this.calculateBalanceWithCost(invoices);

        this.cashDetailsFormComponent.documentInformationFormComponent.amountValue = -(this.totalbalance['balance']['value']);
        this.cashDetailsFormComponent
            .documentInformationFormComponent.amountOriginalCurrency = this.getAmountToBePaidInOriginalCurrency();
    }
    onTotalAmountCalculated(amount) {
        this.totalAmount = amount;

        const invoices = this.getSelectedInvoiceFromPickTransactionInvoiceList();
        this.calculateBalanceWithCost(invoices);
    }
    onInvoiceSearchValuesEntered(model: any) {
        if (model) {
            this.cashDetailsFormComponent.documentInformationFormComponent.currencyValue = model.currency;
            this.cashDetailsFormComponent.documentInformationFormComponent.departmentValue = model.department;
            // in case of diff ccy option, bank informations need to be fetch based on counterparty and payment currency value.

            if (this.selectionValue === this.cashSelectionType.PaymentDifferentCurrency ||
                this.selectionValue === this.cashSelectionType.ReceiptDifferentCurrency) {
                this.cashDetailsFormComponent.counterpartyFormComponent.currencyValue = model.bankCurrency;
                this.cashDetailsFormComponent.documentInformationFormComponent.paymentCurrency = model.bankCurrency;
            } else {
                this.cashDetailsFormComponent.counterpartyFormComponent.currencyValue = model.currency;
            }

            this.cashDetailsFormComponent.documentInformationFormComponent.
                currencyValueChangeInPickTransactionScreen();
            this.cashDetailsFormComponent.counterpartyFormComponent.counterpartyValue = model.counterparty;
            this.cashDetailsFormComponent.counterpartyFormComponent.clientNameValue = model.clientName;
            this.cashDetailsFormComponent.currencyFormComponent.fxRateValue = model.fxRate;
            this.cashDetailsFormComponent.currencyFormComponent.currencyValue = model.currency;
            this.cashDetailsFormComponent.currencyFormComponent.bankCurrencyValue = model.bankCurrency;
            this.cashDetailsFormComponent.currencyFormComponent.roeType = model.roeType;
            this.cashDetailsFormComponent.currencyFormComponent.bindCurrencyValues();
        }
    }
    onCounterpartySearchValueEntered(model: any) {
        this.pickTransactionComponent.invoiceMatchingComponent.counterpartyValue = model.counterparty.counterpartyCode;
        this.pickTransactionComponent.invoiceMatchingComponent.clientNameValue = model.clientName;
        this.pickTransactionComponent.invoiceMatchingComponent.bindCounterpartyValues();
    }
    onCurrencySearchValueEntered(model: any) {
        if (model) {
            this.pickTransactionComponent.invoiceMatchingComponent.currencyValue = model.currency;
            this.pickTransactionComponent.additionalCostsPickTransactionComponent.cashCurrency = model.currency;
            this.cashDetailsFormComponent.additionalCostsFormComponent.currencySelected(model.currency);
            if (this.selectionValue === CashSelectionType.ReceiptFullPartialTransaction) {
                this.pickTransactionComponent.invoiceMatchingComponent.bindCurrencyValue(model.currency);
            }

            if (this.selectionValue === CashSelectionType.ReceiptDifferentCurrency) {
                this.cashDetailsFormComponent.currencyFormComponent.filterBankCurrencies();
            }
        }
    }
    onDepartmentSearchValueEntered(model: any) {
        this.pickTransactionComponent.invoiceMatchingComponent.departmentId = model.department;

    }
    onAmountSearchValueEntered(model: any) {
        if (model) {
            this.assignPickTransactionIfNull();
            this.pickTransactionComponent.invoiceMatchingComponent.totalAmount = model.amount;
            this.pickTransactionComponent.invoiceMatchingComponent.invoiceAmount = model.amount;
            this.pickTransactionComponent.invoiceMatchingComponent.formattedInvoiceAmount = model.amount;

            // MDU: removal of the call to this.calculateAmountWithCostSimpleCPCI() for simple cash
            // (receivable or payable) as it caused the amount to be always incremented with the costs
            // in edition, when entering / leaving the amount field
            // See bug 19484, commeent by Mathilde
        }
    }
    onCurrencyCardValuesEntered(model: any) {
        if (model) {
            this.initialFxRateValue = model.initialFxRate;
            this.initialRoeType = model.initialRoeType;
            this.bankCurrency = model.bankCurrency;
            this.pickTransactionComponent.invoiceMatchingComponent.fxRateValue = this.initialFxRateValue;
            this.pickTransactionComponent.invoiceMatchingComponent.roeType = this.initialRoeType;
            this.pickTransactionComponent.invoiceMatchingComponent.bankCurrencyValue = this.bankCurrency;
            this.pickTransactionComponent.invoiceMatchingComponent.bindCurrencyCardValues();
            this.pickTransactionComponent.additionalCostsPickTransactionComponent.cashCurrency = this.bankCurrency;
            this.cashDetailsFormComponent.counterpartyFormComponent.paymentCurrency = model.bankCurrency;
        }
    }
    onFinalRoeTypeEntered(model: any) {
        if (model) {
            this.finalRoeType = model.finalRoeType;
            this.roeTypeValue = this.finalRoeType ? this.finalRoeType : this.initialRoeType;
            this.pickTransactionComponent.invoiceMatchingComponent.roeType = this.roeTypeValue;
            this.pickTransactionComponent.invoiceMatchingComponent.divideMultiplyCtrl.setValue(this.roeTypeValue);
        }
    }
    onFinalFxRateValueEntered(model: any) {
        if (model) {
            this.finalFxRateValue = ConvertToNumber(model.finalFxRate);
            this.fxRateValue = (this.finalFxRateValue) ? this.finalFxRateValue : this.initialFxRateValue;
            this.pickTransactionComponent.invoiceMatchingComponent.fxRateValue = this.fxRateValue;
            this.pickTransactionComponent.invoiceMatchingComponent.bindCurrencyCardValues();
        }
    }

    onPreviewToggleSelected(hasPreviewDocument) {
        this.hasPreviewDocument = hasPreviewDocument;
    }

    onTemplateSelected(hasTemplate) {
        this.hasTemplate = hasTemplate;
    }

    ngOnDestroy(): void {
        if (this.saveCashSubscription) {
            this.saveCashSubscription.unsubscribe();
        }
    }

    populateCashDetails() {
        this.subscriptions.push(this.executionService.getCashByCashId(this.cashId)
            .subscribe((data) => {
                this.isPreviousButtonDisabled = true;
                this.model = data;
                this.documentReferenceNumber = this.model.documentReference;
                this.matchedDocumentReference = this.model.matchedDocumentReference;
                this.transactionDocumentId = this.model.transactionDocumentId;
                this.matchingChashId = this.model.matchingCashId;
                this.selectionValue = this.model.cashTypeId;
                this.formComponents.forEach((comp) => {
                    comp.initForm(data, this.isEdit);
                });

                if (this.model.cashTypeId === CashSelectionType.SimpleCashPayment) {
                    this.pickTransactionComponentInitial = this.pickTransactionComponent;
                    this.isSimpleCashSelected = true;
                    this.stepper.next();
                } else if (this.model.cashTypeId === CashSelectionType.SimpleCashReceipt) {
                    this.stepper.selectedIndex = CashStepperType.ReceiptDetails;
                } else {
                    this.stepper.selectedIndex = CashStepperType.PaymentPickTransaction;
                }

                if (this.model.costDirectionId === CashType.CashPayment) {
                    this.pickTransactionComponent.invoiceMatchingComponent.filterCurrencies();
                }
                if (this.model.cashTypeId === CashSelectionType.PaymentDifferentCurrency
                    || this.model.cashTypeId === CashSelectionType.ReceiptDifferentCurrency) {
                    if (this.pickTransactionComponent.invoiceMatchingComponent.gridColumnApi) {
                        this.pickTransactionComponent.invoiceMatchingComponent.gridColumnApi.setColumnVisible('amountPaidInDiffCcy', true);
                    }
                    this.cashDetailsFormComponent.documentInformationFormComponent.isDiffCurrency = true;
                    this.cashDetailsFormComponent.updateValidatorForAmount();
                } else {
                    this.cashDetailsFormComponent.documentInformationFormComponent.isDiffCurrency = false;
                    this.cashDetailsFormComponent.updateValidatorForAmount();
                }
            }));
    }

    // get fx rate for functionalCUrrency => statutorycurrency
    getFxrateForFunctionalToStatutoryCurrencyConversion() {

        if (this.companyConfiguration.statutoryCurrencyCode !== this.companyConfiguration.functionalCurrencyCode) {
            this.foreignExchangeService.getForeignExchangeRate(
                this.companyManager.getCurrentCompanyDate().toDate(),
                this.companyConfiguration.statutoryCurrencyCode)
                .subscribe((data) => {
                    if (data) {
                        this.functionalStatutoryCurrenyRate = ConvertToNumber(data.rate);
                        this.functionalStatutoryCurrencyRoeType = data.currencyRoeType;
                    }
                });
        }
    }
    onAmountEnterOrInvoiceSelection() {

        const invoices = this.getSelectedInvoiceFromPickTransactionInvoiceList();
        this.calculateBalanceWithCost(invoices);
    }

    isValidInvoiceList(): boolean {
        let isInvoiceListValid = true;
        const invoices = this.getSelectedInvoiceFromPickTransactionInvoiceList();
        // this.pickTransactionComponent.invoiceMatchingComponent
        //     .selectedInvoiceToMatch as CashMatching[];
        if (invoices && invoices.length > 0) {
            invoices.forEach((item) => {
                if (!Number(item.amountToBePaid)) {
                    isInvoiceListValid = false;
                }
            });
        }
        return isInvoiceListValid;
    }

    bindSelectedCashTypeForNewDocument() {
        // based on selected value(Cash Type), route to respective cash selectionpage and select the cash option
        // move to next step.

        this.selectionFormComponent.bindSelectedCashTypeSelection(this.selectionValue, this.costDirectionId);
        if (this.costDirectionId === CashType.CashPayment) {
            this.onPaymentNextButtonClicked();
        } else {
            this.onNextReceiptButtonClicked();
        }
    }
    onCloseButtonClicked() {
        this.isDialogClosed = false;
    }

    getSelectedInvoiceFromPickTransactionInvoiceList() {

        const selectedRows: any[] = [];
        if (this.pickTransactionComponent.invoiceMatchingComponent.gridApi) {
            this.pickTransactionComponent.invoiceMatchingComponent.gridApi.forEachNode((item) => {
                if (item.data.isChecked === true) {
                    selectedRows.push(item.data);
                }
            });

        }
        return selectedRows;
    }

    getformatedNumberWith2DecimalPoint(value: number) {
        if (value) {
            const floatValue = Math.round(value * 100) / 100;
            return value ? parseFloat(floatValue.toString()).toFixed(2) : value;
        }
    }

    onEditCalculateCashAmountWithoutCost() {
        let totalCostAmount = 0;
        const costs = this.cashDetailsFormComponent.additionalCostsFormComponent.getGridData() as AdditionalCost[];
        if (costs.length > 0) {
            if (this.selectionValue === CashSelectionType.SimpleCashReceipt ||
                this.selectionValue === CashSelectionType.ReceiptFullPartialTransaction ||
                this.selectionValue === CashSelectionType.ReceiptDifferentCurrency) {
                totalCostAmount = costs.map((c) => (c.amount ? c.amount : 0) *
                    (c.costDirectionId === CostDirections.Payable ? -1 : 1)).reduce((sum, current) => sum + current);
            } else {
                totalCostAmount = costs.map((c) => (c.amount ? c.amount : 0) *
                    (c.costDirectionId === CostDirections.Payable ? 1 : -1)).reduce((sum, current) => sum + current);
            }
        }

        this.cashDetailsFormComponent.documentInformationFormComponent.cashAmountValue =
            this.cashDetailsFormComponent.documentInformationFormComponent.cashAmountValue - totalCostAmount;
    }

    // This method is used to get the departmentId from selected documents.
    // If invoices are only in 1 dept, then defaulted to the dept. If multiple depts.,
    // then take the dept with maximum value. It can overwritten by the users in the next screen.

    getDepartmentIdFromSelectedInvoices() {
        let departmentId;
        const invoices = this.getSelectedInvoiceFromPickTransactionInvoiceList();

        if (invoices && invoices.length > 0) {

            if (invoices.length === 1) {
                departmentId = invoices[0].departmentId;
            } else {
                // logic implemented:
                // Choose the department linked to the document which has the
                // maximum absolute amount(amount selected by the user to be paid in the invoice selection page).
                // If two or more invoices has the same amount. Then department which has the document
                // posted recently has to be set as default.
                let maxInvoiceAmount = 0;
                let maxPostedDate: Date;
                let defaultDeptId = 0;
                invoices.forEach((invoice) => {
                    if (invoice.amountToBePaid > maxInvoiceAmount) {
                        maxInvoiceAmount = invoice.amountToBePaid;
                        defaultDeptId = invoice.departmentId;
                        maxPostedDate = invoice.postedDate;
                    } else if (invoice.amountToBePaid === maxInvoiceAmount) {
                        if (invoice.postedDate > maxPostedDate) {
                            defaultDeptId = invoice.departmentId;
                            maxPostedDate = invoice.postedDate;
                        }
                    }
                });
                departmentId = defaultDeptId;
            }
        }
        return departmentId;
    }

    private isDetailsChanged(currentDetails: InvoiceForCashMatching): boolean {
        if (!this.previousCashDetails) {
            return true;
        }

        if (this.previousCashDetails.amount === currentDetails.amount
            && this.previousCashDetails.currency === currentDetails.currency
            && this.previousCashDetails.departmentCode === currentDetails.departmentCode
            && this.previousCashDetails.counterpartyreference === currentDetails.counterpartyreference) {
            return false;
        }

        return true;
    }

    private saveCurrentDetails(isDetailsChanged: boolean, currentDetails: any) {
        if (isDetailsChanged) {
            this.previousCashDetails = currentDetails;
        }
    }
}
