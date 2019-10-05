import { Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatSlideToggleChange } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CompanyManagerService } from '../../../../core/services/company-manager.service';
import { BaseFormComponent } from '../../../../shared/components/base-form-component/base-form-component.component';
import { ConfirmationDialogComponent } from '../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { isGreatherThanZero, isPositive } from '../../../../shared/directives/number-validators.directive';
import { AtlasFormControl } from '../../../../shared/entities/atlas-form-control';
import { Counterparty } from '../../../../shared/entities/counterparty.entity';
import { Currency } from '../../../../shared/entities/currency.entity';
import { Department } from '../../../../shared/entities/department.entity';
import { LockFunctionalContext } from '../../../../shared/entities/lock-functional-context.entity';
import { LockResourceInformation } from '../../../../shared/entities/lock-resource-information.entity';
import { MasterData } from '../../../../shared/entities/masterdata.entity';
import { CashSelectionType } from '../../../../shared/enums/cash-selection-type';
import { CashType } from '../../../../shared/enums/cash-type.enum';
import { InterfaceType } from '../../../../shared/enums/interface-type.enum';
import { CashRecord } from '../../../../shared/services/execution/dtos/cash-record';
import { CashSetup } from '../../../../shared/services/execution/dtos/cash-setup';
import { InvoiceForCashMatching } from '../../../../shared/services/execution/dtos/invoice-for-cash';
import { FormConfigurationProviderService } from '../../../../shared/services/form-configuration-provider.service';
import { ExecutionService } from '../../../../shared/services/http-services/execution.service';
import { LockService } from '../../../../shared/services/http-services/lock.service';
import { AdditionalCostsFormComponent } from './additional-costs/additional-costs.component';
import { AdditionalDetailsFormComponent } from './additional-details/additional-details.component';
import { CounterpartyFormComponent } from './counterparty-card/counterparty-card.component';
import { CurrencyInformationCardComponent } from './currency-information-card/currency-information-card.component';
import { DocumentInformationFormComponent } from './document-information/document-information.component';
import { PaymentOrderTemplateSelectionCardComponent } from './template-selection-card/payment-order-template-selection-card.component';

@Component({
    selector: 'atlas-cash-details-form-component',
    templateUrl: './cash-details.component.html',
    styleUrls: ['./cash-details.component.scss'],
})
export class CashDetailsFormComponent extends BaseFormComponent implements OnInit, OnDestroy {
    private templateSelectionComponent: PaymentOrderTemplateSelectionCardComponent;
    @Output() readonly counterpartySearchValues = new EventEmitter<any>();
    @Output() readonly departmentSearchValue = new EventEmitter<any>();
    @Output() readonly currencySearchValue = new EventEmitter<any>();
    @Output() readonly amountSearchValue = new EventEmitter<any>();
    @Output() readonly currencyCardInitialValues = new EventEmitter<any>();
    @Output() readonly currencyCardFinalRowType = new EventEmitter<any>();
    @Output() readonly fxRateValueCalculated = new EventEmitter<any>();
    @Output() readonly previewToggleSelected = new EventEmitter<boolean>();
    @Output() readonly templateSelected = new EventEmitter<boolean>();
    @Output() readonly calculateTotalBalanceOnCostAmountEnter = new EventEmitter<any>();
    @Output() readonly calculateCashAmountWithoutCost = new EventEmitter<any>();
    @ViewChild('counterpartyFormComponent') counterpartyFormComponent: CounterpartyFormComponent;
    @ViewChild('additionalDetailsFormComponent') additionalDetailsFormComponent: AdditionalDetailsFormComponent;
    @ViewChild('documentInformationFormComponent') documentInformationFormComponent: DocumentInformationFormComponent;
    @ViewChild('additionalCostsFormComponent') additionalCostsFormComponent: AdditionalCostsFormComponent;
    @ViewChild('currencyFormComponent') currencyFormComponent: CurrencyInformationCardComponent;
    @ViewChild('templateSelectionComponent') set templateSelectionCard(templateSelectionCard: PaymentOrderTemplateSelectionCardComponent) {
        this.templateSelectionComponent = templateSelectionCard;
        if (this.formComponents.indexOf(templateSelectionCard) === -1) {
            this.formComponents.push(this.templateSelectionComponent);
        }
    }
    formComponents: BaseFormComponent[] = [];
    masterData: MasterData;
    CashType = CashType;
    cashTypeId: number;
    selectionValue: number;
    createCashFormGroup: FormGroup;
    createCashCurrencyFormGroup: FormGroup;
    counterpartyValue: string;
    clientNameValue: string;
    currencyvalue: string;
    departmentValue: number;
    amountValue: number;
    currencyRoeType: string;
    initialFxRateValue: number;
    finalFxRateValue: number;
    bankCurrencyValue: string;
    initialRoeTypeValue: string;
    finalRoeTypeValue: string;
    currencyChangeStatus: boolean;
    urgentPaymentCtrl = new AtlasFormControl('UrgentPayment');
    authorizePostingCtrl = new AtlasFormControl('AuthorizeForPosting');
    transmitTreasuryCtrl = new AtlasFormControl('TransmitToTreasury');
    previewDocumentCtrl = new AtlasFormControl('PreviewDocumentCtrl');
    message: true;
    cashSetupModel: CashSetup = new CashSetup();
    private cashDetailsDefaultSubscription: Subscription;
    warning: true;
    isAuthorizePosting: boolean;
    isTransmitTreasury: boolean;
    hasTemplate = false;
    isEdit: boolean;
    isSave: boolean = false;

    destroy$ = new Subject();
    resourcesInformation: LockResourceInformation[] = new Array<LockResourceInformation>();
    hideTransmitTreasury: boolean = false;
    isTraxInterfaceEnabled: boolean;

    constructor(protected formConfigurationProvider: FormConfigurationProviderService,
        protected formBuilder: FormBuilder,
        private route: ActivatedRoute,
        protected executionService: ExecutionService,
        protected lockService: LockService,
        protected dialog: MatDialog,
        private router: Router,
        private companyManager: CompanyManagerService,

    ) {
        super(formConfigurationProvider);
        this.cashTypeId = Number(decodeURIComponent(this.route.snapshot.paramMap.get('cashTypeId')));

    }

    ngOnInit() {
        this.masterData = this.route.snapshot.data.masterdata;

        this.createCashFormGroup = this.formBuilder.group({
            counterpartyFormComponent: this.counterpartyFormComponent.getFormGroup(),
            additionalDetailsFormComponent: this.additionalDetailsFormComponent.getFormGroup(),
            documentInformationFormComponent: this.documentInformationFormComponent.getFormGroup(),
        });
        this.createCashCurrencyFormGroup = this.formBuilder.group({
            currencyFormComponent: this.currencyFormComponent.getFormGroup(),
        });

        this.formComponents.push(
            this.documentInformationFormComponent,
            this.counterpartyFormComponent,
            this.additionalDetailsFormComponent,
            this.additionalCostsFormComponent,
            this.currencyFormComponent);

        if (this.route.snapshot.url.length > 0 && this.route.snapshot.url[1].path.toString() === 'new') {
            this.subscriptions.push(this.executionService.getInterfaceSetupDetails(InterfaceType.PaymentRequestInterface)
                .subscribe((data) => {
                    if (data) {
                        this.isTraxInterfaceEnabled = data.isActive;
                        if (data.isActive) {
                            this.isTransmitTreasury = true;
                            if (this.cashTypeId === CashType.CashReceipt) {
                                this.isTransmitTreasury = false;
                                this.transmitTreasuryCtrl.setValue(this.isTransmitTreasury);
                                this.counterpartyFormComponent.clientBankCtrl.clearValidators();
                                this.counterpartyFormComponent.showHintForClientBank = false;
                                this.isAuthorizePosting = true;
                            } else {
                                this.transmitTreasuryCtrl.setValue(this.isTransmitTreasury);
                                this.counterpartyFormComponent.clientBankCtrl.setValidators(Validators.compose([Validators.required]));
                                this.counterpartyFormComponent.showHintForClientBank = true;
                                this.isAuthorizePosting = false;
                            }
                            this.authorizePostingCtrl.setValue(this.isAuthorizePosting);
                        } else {
                            this.isAuthorizePosting = true;
                            this.authorizePostingCtrl.setValue(this.isAuthorizePosting);
                            this.transmitTreasuryCtrl.disable();
                            this.counterpartyFormComponent.clientBankCtrl.clearValidators();
                            this.counterpartyFormComponent.clientBankCtrl.setValidators(null);
                        }
                        this.counterpartyFormComponent.clientBankCtrl.updateValueAndValidity();
                    }

                    // hide TransmitTreasury when cash type is CI;

                    this.hideTransmitTreasury = this.cashTypeId === CashType.CashReceipt ? true : !this.isTraxInterfaceEnabled;
                }));
        }

        this.getValueToControl();
        this.urgentPaymentCtrl.setValue(false);
    }

    ngOnDestroy(): void {
        if (this.cashDetailsDefaultSubscription) {
            this.cashDetailsDefaultSubscription.unsubscribe();
        }
        this.stopLockRefresh();
        this.lockService.cleanSessionLocks().pipe(takeUntil(this.destroy$)).subscribe(() => {
            this.destroy$.next();
            this.destroy$.complete();
        });
    }

    getValueToControl() {
        if (this.cashTypeId === CashType.CashPayment) {
            if (this.authorizePostingCtrl.value === 0 && this.transmitTreasuryCtrl.value === 0) {
                this.warning = true;
            }
        }
    }

    onCounterpartySearchValuesEntered(model: any) {
        this.counterpartyValue = model.counterparty;
        this.clientNameValue = model.clientName;
        this.counterpartySearchValues.emit({
            counterparty: this.counterpartyValue,
            clientName: this.clientNameValue,
        });
    }

    calculateBalanceOnCostAmountEnter() {
        this.calculateTotalBalanceOnCostAmountEnter.emit();
    }

    onCurrencySearchValuesEntered(model: any) {
        if (model) {
            this.currencyvalue = model.currency;
            this.counterpartyFormComponent.cashCurrency = model.currency;
            this.currencyFormComponent.currencyValue = this.currencyvalue;
            this.currencyRoeType = model.currencyRoeType;
            this.currencyFormComponent.currencyRoeType = this.currencyRoeType;
            this.currencySearchValue.emit({ currency: this.currencyvalue });
            this.counterpartyFormComponent.currencyValue = this.currencyvalue;
        }
    }

    onCurrencyChange(model: any) {
        this.currencyChangeStatus = model.currencyStatus;
        this.currencyFormComponent.currencyChangeStatus = this.currencyChangeStatus;
        this.currencyFormComponent.bankCurrencyCtrl.reset();
        this.currencyFormComponent.fxRateCtrl.reset();
        this.counterpartyFormComponent.clientBankCtrl.patchValue(null);
        if (this.counterpartyFormComponent.bankInformationComponent) {
            this.counterpartyFormComponent.bankInformationComponent.resetClientBankInformation();
        }
        const currency = (this.selectionValue === CashSelectionType.PaymentDifferentCurrency ||
            this.selectionValue === CashSelectionType.ReceiptDifferentCurrency)
            ? model.paymentCurrency : model.currency;

        this.getClientBankDetails(currency);

    }

    onDepartmentSearchvalueEntered(model: any) {
        this.departmentValue = model.department;
        this.departmentSearchValue.emit({ department: this.departmentValue });
    }

    onAmountSearchValueEntered(model: any) {
        this.amountValue = model.amount;
        this.amountSearchValue.emit({ amount: this.amountValue });
        this.calculateDocAmountForCashReceiptDiffCurrency();
    }

    calculateDocAmountForCashReceiptDiffCurrency() {
        if (this.cashTypeId === CashType.CashReceipt
            && (this.selectionValue === CashSelectionType.PaymentDifferentCurrency ||
                this.selectionValue === CashSelectionType.ReceiptDifferentCurrency)) {
            if (this.amountValue && this.currencyFormComponent.fxRateCtrl.value
                && this.currencyFormComponent.fxRateCtrl.value !== 0
                && this.currencyFormComponent.divideMultiplyCtrl.value) {
                if (this.currencyFormComponent.divideMultiplyCtrl.value === 'D') {
                    this.documentInformationFormComponent.setDocAmountForCashReceiptDiffCurrency(
                        this.amountValue * this.currencyFormComponent.fxRateCtrl.value);
                } else if (this.currencyFormComponent.divideMultiplyCtrl.value === 'M') {
                    this.documentInformationFormComponent.setDocAmountForCashReceiptDiffCurrency(
                        this.amountValue / this.currencyFormComponent.fxRateCtrl.value);
                }
            } else {
                this.documentInformationFormComponent.setDocAmountForCashReceiptDiffCurrency(0);
            }
        }
    }

    onBankCurrencyEntered(model: any) {
        this.initialFxRateValue = model.initialFxRate;
        this.bankCurrencyValue = model.bankCurrency;
        this.initialRoeTypeValue = model.initialRoeType;
        this.currencyCardInitialValues.emit({
            bankCurrency: this.bankCurrencyValue,
            initialFxRate: this.initialFxRateValue,
            initialRoeType: this.initialRoeTypeValue,
        });
        this.getClientBankDetails(this.bankCurrencyValue);

        this.calculateDocAmountForCashReceiptDiffCurrency();
    }

    onRoeTypeChanged(model: any) {
        this.finalRoeTypeValue = model.finalRoeType;
        this.currencyCardFinalRowType.emit({
            finalRoeType: this.finalRoeTypeValue,
        });
    }

    onFxRateValueChanged(model: any) {
        this.finalFxRateValue = model.finalFxRate;
        this.fxRateValueCalculated.emit({ finalFxRate: this.finalFxRateValue });
    }

    getFormGroup() {
        this.formGroup = this.formBuilder.group({
            authorizePostingCtrl: this.authorizePostingCtrl,
            transmitTreasuryCtrl: this.transmitTreasuryCtrl,
            urgentPaymentCtrl: this.urgentPaymentCtrl,
        });
        return super.getFormGroup();
    }

    populateEntity(model: any): any {
        this.formComponents.forEach((comp) => {
            if (comp) { comp.populateEntity(model); }
        });
        model.authorizedForPosting = this.authorizePostingCtrl.value === '' ? false : this.authorizePostingCtrl.value;
        model.toTransmitToTreasury = this.transmitTreasuryCtrl.value === '' ? false : this.transmitTreasuryCtrl.value;
        model.urgentPayment = this.urgentPaymentCtrl.value;
        return model;

    }

    currencySelected(currency: any) {
        this.additionalCostsFormComponent.cashCurrency = currency;
        this.currencySearchValue.emit({ currencyvalue: currency });
    }

    initForm(entity: CashRecord, isEdit: boolean) {
        this.isEdit = isEdit;
        if (isEdit) {
            this.lockService.lockCashDocument(
                entity.cashId, LockFunctionalContext.CashDocumentEdition).pipe(takeUntil(this.destroy$)).subscribe(
                    (lockData) => {
                        this.startLockRefresh(entity.cashId, entity.documentReference);
                    },
                    (err) => {
                        this.dialog.open(ConfirmationDialogComponent, {
                            data: {
                                title: 'Lock',
                                text: err.error.detail,
                                okButton: 'Got it',
                            },
                        });
                        this.router.navigate(['/' + this.companyManager.getCurrentCompanyId() + '/execution/cash']);
                    });

            this.formComponents.forEach((comp) => {
                if (comp) { comp.initForm(entity, isEdit); }
            });
            this.authorizePostingCtrl.setValue(entity.authorizedForPosting);
            this.transmitTreasuryCtrl.setValue(entity.toTransmitToTreasury);
            this.isAuthorizePosting = entity.authorizedForPosting;
            this.isTransmitTreasury = entity.toTransmitToTreasury;
            this.urgentPaymentCtrl.setValue(entity.urgentPayment);
        }
        if (entity.cashTypeId === CashSelectionType.SimpleCashPayment ||
            entity.cashTypeId === CashSelectionType.SimpleCashReceipt) {
            if (this.additionalCostsFormComponent.gridColumnApi) {
                this.additionalCostsFormComponent.gridColumnApi.setColumnVisible('accountLineType', false);
            }
            this.additionalCostsFormComponent.showGrid = true;
        } else { this.additionalCostsFormComponent.showGrid = false; }
        this.selectionValue = entity.cashTypeId;
    }

    setNarrative(narrative: string) {
        this.additionalDetailsFormComponent.setNarrative(narrative);
    }

    isPickTransaction() {
        if (this.selectionValue === 1 || this.selectionValue === 5) {
            this.additionalCostsFormComponent.showGrid = true;
            return false;
        } else {
            return true;
        }
    }

    isDifferentCurrencyOptionSelected(): boolean {
        if (this.selectionValue === CashSelectionType.PaymentDifferentCurrency ||
            this.selectionValue === CashSelectionType.ReceiptDifferentCurrency) {
            return true;
        }
        return false;
    }

    bindSelectedValue(value: number) {
        if (value !== 0) {
            this.selectionValue = value;
            this.documentInformationFormComponent.cashTransactionId = value;
            this.counterpartyFormComponent.cashTransactionId = value;
            this.currencyFormComponent.cashTransactionId = value;

            if (this.templateSelectionComponent) {
                this.templateSelectionComponent.SetCashType(this.selectionValue);
            }
        }
    }

    onAuthorizePostingChanged(value: MatSlideToggleChange) {
        if (this.cashTypeId === CashType.CashPayment) {
            this.isAuthorizePosting = value.checked;

        }
    }

    onTransmitTreasuryChanged(value: MatSlideToggleChange) {
        this.isTransmitTreasury = value.checked;
        if (this.isTransmitTreasury) {
            this.counterpartyFormComponent.clientBankCtrl.setValidators(Validators.compose([Validators.required]));
            this.counterpartyFormComponent.showHintForClientBank = true;
        } else {
            this.counterpartyFormComponent.clientBankCtrl.clearValidators();
            this.counterpartyFormComponent.showHintForClientBank = false;
        }
        this.counterpartyFormComponent.clientBankCtrl.updateValueAndValidity();
    }

    onTemplateSelected(hasTemplate) {
        this.hasTemplate = hasTemplate;
        this.previewDocumentCtrl.setValue(this.hasTemplate);
        this.templateSelected.emit(hasTemplate);
        this.onPreviewToggleSelected();
    }

    onPreviewToggleSelected() {
        this.previewToggleSelected.emit(this.previewDocumentCtrl.value);
    }

    // update validator for controls based on value
    updateValidatorForAmount() {
        if (this.selectionValue === CashSelectionType.ReceiptDifferentCurrency) {
            this.createCashFormGroup.controls.
                documentInformationFormComponent.get('amountCtrl').clearValidators();
        } else {
            this.createCashFormGroup.controls.
                documentInformationFormComponent.get('amountCtrl').setValidators(
                    Validators.compose([isPositive(), Validators.required, isGreatherThanZero()]));
        }
        this.createCashFormGroup.controls.
            documentInformationFormComponent.get('amountCtrl').updateValueAndValidity();
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

    onSetClientBankInformation() {
        const counterpartyId = this.counterpartyFormComponent.counterpartyId;
        const currency = (this.documentInformationFormComponent.currencyCtrl.value as Currency).currencyCode;
        if (this.counterpartyFormComponent.bankInformationComponent) {
            this.counterpartyFormComponent.bankInformationComponent.setClientBankInformation(null, counterpartyId, currency);
        }
    }

    onEditCalculateCashAmountWithoutCost() {
        this.calculateCashAmountWithoutCost.emit();
    }

    getClientBankDetails(currency: string) {
        if (this.counterpartyFormComponent.bankInformationComponent) {
            this.counterpartyFormComponent.bankInformationComponent.resetClientBankInformation();
        }
        this.counterpartyFormComponent.filteredCounterPartyBankAccounts = [];
        const counterpartyDetail = this.counterpartyFormComponent.counterpartyCtrl.value;
        const counterparty = this.counterpartyFormComponent.masterData.counterparties.filter(
            (item) => item.counterpartyCode === counterpartyDetail.counterpartyCode,
        );
        if (counterparty.length > 0) {
            const counterpartyId = counterparty[0].counterpartyID;
            this.counterpartyFormComponent.getCounterpartyBankAccounts(
                counterpartyId, currency, null, false);
        }
    }

    getInvoiceSearchValues(): InvoiceForCashMatching {
        const searchValues: InvoiceForCashMatching = new InvoiceForCashMatching();
        searchValues.currency = (this.documentInformationFormComponent.currencyCtrl.value as Currency).currencyCode;
        searchValues.departmentCode = (this.documentInformationFormComponent.departmentCodeCtrl.value as Department).departmentCode;
        searchValues.amount = this.documentInformationFormComponent.amountCtrl.value;
        searchValues.counterpartyreference = (this.counterpartyFormComponent.counterpartyCtrl.value as Counterparty).counterpartyCode;
        return searchValues;
    }
}
