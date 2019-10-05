import { Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { BaseFormComponent } from '../../../../../shared/components/base-form-component/base-form-component.component';
import { inDropdownListValidator } from '../../../../../shared/directives/autocomplete-dropdown.directive';
import { AtlasFormControl } from '../../../../../shared/entities/atlas-form-control';
import { BankAccount } from '../../../../../shared/entities/bank-account.entity';
import { CounterpartyBankAccounts } from '../../../../../shared/entities/counterparty-bankaccounts.entity';
import { Counterparty } from '../../../../../shared/entities/counterparty.entity';
import { MasterDataProps } from '../../../../../shared/entities/masterdata-props.entity';
import { MasterData } from '../../../../../shared/entities/masterdata.entity';
import { NominalAccount } from '../../../../../shared/entities/nominal-account.entity';
import { CashSelectionType } from '../../../../../shared/enums/cash-selection-type';
import { CashType } from '../../../../../shared/enums/cash-type.enum';
import { CashRecord } from '../../../../../shared/services/execution/dtos/cash-record';
import { CashSetup } from '../../../../../shared/services/execution/dtos/cash-setup';
import { FormConfigurationProviderService } from '../../../../../shared/services/form-configuration-provider.service';
import { ExecutionService } from '../../../../../shared/services/http-services/execution.service';
import { MasterdataService } from '../../../../../shared/services/http-services/masterdata.service';
import { SnackbarService } from '../../../../../shared/services/snackbar.service';
import { nameof, UtilService } from '../../../../../shared/services/util.service';
import { CommonMethods } from '../../../../services/execution-cash-common-methods';
import { BankInformationComponent } from '../bank-information/bank-information.component';

@Component({
    selector: 'atlas-counterparty-card',
    templateUrl: './counterparty-card.component.html',
    styleUrls: ['./counterparty-card.component.scss'],
})
export class CounterpartyFormComponent extends BaseFormComponent implements OnInit, OnDestroy {
    @Output() readonly counterpartySearchValues = new EventEmitter<any>();
    @Output() readonly setClientBankInformation = new EventEmitter<any>();
    @ViewChild('bankInformationComponent') bankInformationComponent: BankInformationComponent;
    counterpartyCtrl = new AtlasFormControl('Counterparty');
    payerCtrl = new AtlasFormControl('Payer');
    clientBankCtrl = new AtlasFormControl('clientAccount');
    payeeCtrl = new AtlasFormControl('Payee');
    private nominalAccountDefaultSubscription: Subscription;

    filteredCounterPartyList: Counterparty[];
    filteredNominalAccountList: NominalAccount[];
    counterpartyValue: string;
    clientNameValue: string;
    masterData: MasterData;
    masterdataList: string[] = [
        MasterDataProps.Counterparties,
        MasterDataProps.NominalAccounts,
    ];

    CashType = CashType;
    cashTypeId: number;
    company: string;
    cashSetupModel: CashSetup = new CashSetup();

    counterpartyErrorMap: Map<string, string> = new Map()
        .set('required', 'Required *')
        .set('inDropdownList', 'Invalid entry. Client not in the list.');

    model: CashRecord;
    bankList: BankAccount[];
    filteredbankAccountList: BankAccount[];
    cashTransactionId: number;
    currencyValue: string;
    filteredCounterPartyBankAccounts: CounterpartyBankAccounts[];
    counterPartyBankAccountsList: CounterpartyBankAccounts[];
    counterpartyId: number;
    searchedCounterpartyCode: string;
    isEditable: boolean = false;
    cashCurrency: string;
    paymentCounterpartyCode: string;
    clientBankAccountNo: number;
    showHintForClientBank: boolean;
    savedCounterPartyBankAccounts: CounterpartyBankAccounts[];
    showHintForNoClientBankAccount: boolean;
    paymentCurrency: string;

    constructor(protected formConfigurationProvider: FormConfigurationProviderService,
        protected formBuilder: FormBuilder,
        protected masterdataService: MasterdataService,
        protected utilService: UtilService,
        private route: ActivatedRoute,
        private router: Router,
        protected executionService: ExecutionService,
        private snackbarService: SnackbarService,

    ) {
        super(formConfigurationProvider);
        this.cashTypeId = Number(decodeURIComponent(this.route.snapshot.paramMap.get('cashTypeId')));

    }

    ngOnInit() {
        this.company = this.route.snapshot.paramMap.get('company');
        this.masterData = this.route.snapshot.data.masterdata;
        this.filterCounterparties();
        this.setValidators();
        this.bindConfiguration();
        this.showHintForNoClientBankAccount = false;
        this.counterPartyBankAccountsList = [];
        this.clientBankCtrl.valueChanges.subscribe((input) => {
            this.filteredCounterPartyBankAccounts = this.utilService.filterListforAutocomplete(
                input,
                this.counterPartyBankAccountsList,
                ['accountNo', 'bankName'],
                'bankAccountId',
            );
        });
    }
    ngOnDestroy(): void {
        if (this.nominalAccountDefaultSubscription) {
            this.nominalAccountDefaultSubscription.unsubscribe();
        }
    }
    setValidators() {
        this.counterpartyCtrl.setValidators(
            Validators.compose([
                inDropdownListValidator(
                    this.masterData.counterparties,
                    nameof<Counterparty>('counterpartyCode'),
                ), Validators.required,
            ]),
        );
        this.payerCtrl.setValidators(
            Validators.compose([Validators.required]),
        );
        this.payeeCtrl.setValidators(
            Validators.compose([Validators.required]),
        );

        this.clientBankCtrl.setValidators([
            Validators.compose([Validators.required]),
        ]);
    }

    setBankAccountValidator() {
        this.clientBankCtrl.clearValidators();
        this.clientBankCtrl.setValidators(
            Validators.compose([
                inDropdownListValidator(
                    this.counterPartyBankAccountsList,
                    nameof<CounterpartyBankAccounts>('bankAccountId'),
                ),
                Validators.required,
            ]));
    }

    bindCounterpartyValues() {

        // check if transaction selected is for diff counterparty(diff client)
        if (this.cashTransactionId === CashSelectionType.PaymentDifferentClient) {
            // filter the counterparty except selected in last step.
            this.filterCounterparties();
        } else {

            if (this.counterpartyValue) {
                const counterparty = this.masterData.counterparties.filter(
                    (item) => item.counterpartyCode === this.counterpartyValue,
                );
                if (counterparty.length > 0) {
                    this.counterpartyCtrl.patchValue(counterparty[0]);
                }
            }
            this.formGroup.patchValue({ payeeCtrl: this.clientNameValue });
            this.counterpartyCtrl.disable();
            this.payeeCtrl.disable();
        }

    }

    onCounterpartyIdSelected(value: Counterparty) {
        this.clientBankCtrl.patchValue(null);
        if (this.bankInformationComponent) {
            this.bankInformationComponent.resetClientBankInformation();
        }
        const counterparty = this.masterData.counterparties.find(
            (item) => item.counterpartyCode === value.counterpartyCode,
        );
        if (counterparty) {
            this.counterpartyId = counterparty.counterpartyID;
            this.payeeCtrl.patchValue(counterparty.description);
            this.payerCtrl.patchValue(counterparty.description);
        }
        this.counterpartyValue = this.counterpartyCtrl.value;
        this.clientNameValue = this.payerCtrl.value;
        this.counterpartySearchValues.emit({
            counterparty: this.counterpartyValue,
            clientName: this.clientNameValue,
        });

        // in cash by Diff ccy , client bank details need to be fetch based on counterparty
        // and payment currency code
        // else on cash currency code.

        let nominalBankAccountCode: number = null;

        if (this.model && this.model.nominalBankAccountCode) {
            nominalBankAccountCode = this.model.nominalBankAccountCode;
        }

        if (this.cashTransactionId === CashSelectionType.ReceiptDifferentCurrency
        ) {
            if (this.paymentCurrency) {
                this.getCounterpartyBankAccounts(this.counterpartyId, this.paymentCurrency, nominalBankAccountCode, false);
            }
        }
        else {
            this.getCounterpartyBankAccounts(this.counterpartyId, this.currencyValue, nominalBankAccountCode, false);
        }
    }

    onNominalAccountSelected(accountNumber: string) {
        const selectedNominalAccount = this.masterData.nominalAccounts.filter(
            (nominalAccounts) => nominalAccounts.accountNumber === accountNumber,
        );
        if (selectedNominalAccount.length > 0) {
            this.payerCtrl.patchValue(selectedNominalAccount[0].shortDescription,
            );
        }
    }

    getFormGroup() {
        this.formGroup = this.formBuilder.group({
            counterpartyCtrl: this.counterpartyCtrl,
            payerCtrl: this.payerCtrl,
            clientBankCtrl: this.clientBankCtrl,
            payeeCtrl: this.payeeCtrl,
        });
        return super.getFormGroup();
    }

    populateEntity(entity: any): any {
        const cash = entity as CashRecord;

        if (this.cashTransactionId === CashSelectionType.PaymentDifferentClient) {
            const commonMethod = new CommonMethods();

            cash.counterpartyCode = this.searchedCounterpartyCode;
            if (this.counterpartyCtrl.value) {
                cash.paymentCounterPartyCode = (this.counterpartyCtrl.value as Counterparty).counterpartyCode;
            }
            cash.matchingCounterpartyId =
                commonMethod.getCounterpartyIdBasedOnCodeFromMasterData(this.searchedCounterpartyCode, this.masterData);
            cash.paymentCounterPartyId =
                commonMethod.getCounterpartyIdBasedOnCodeFromMasterData(cash.paymentCounterPartyCode, this.masterData);

        } else {
            if (this.counterpartyCtrl.value) {
                cash.counterpartyCode = (this.counterpartyCtrl.value as Counterparty).counterpartyCode;
            }
        }
        cash.payer = this.payerCtrl.value;
        if (this.clientBankCtrl.value) {
            cash.nominalBankAccountCode = this.clientBankCtrl.value;
        }
        cash.payee = this.payeeCtrl.value;

        return cash;
    }

    getCounterpartyCode() {
        if (this.counterpartyCtrl.value) {
            const value = this.counterpartyCtrl.value as Counterparty;
            return value.counterpartyCode;
        }
    }
    initForm(entity: CashRecord, isEdit: boolean): any {
        this.model = entity;
        this.cashTransactionId = this.model.cashTypeId;

        let counterpartyCode = this.model.counterpartyCode;
        if (this.model.paymentCounterPartyCode != null) {
            // If the payment counterparty code is set, then this is the one to use for payment selection
            // This situation occures only in "diff client" (otherwise, paymentCounterpartyCode is null)
            counterpartyCode = this.model.paymentCounterPartyCode;
        }
        if (counterpartyCode != null) {
            this.paymentCounterpartyCode = counterpartyCode;
            const counterparty = this.masterData.counterparties.filter(
                (item) => item.counterpartyCode === counterpartyCode,
            );
            if (counterparty.length > 0) {
                this.counterpartyCtrl.patchValue(counterparty[0]);
                this.counterpartyId = counterparty[0].counterpartyID;
                this.onCounterpartyIdSelected(counterparty[0]);
            }
            this.payeeCtrl.patchValue(this.model.ownerName);

        }

        if (this.model) {

            if (this.model.cashTypeId === CashSelectionType.PaymentDifferentCurrency ||
                this.model.cashTypeId === CashSelectionType.ReceiptDifferentCurrency) {
                this.currencyValue = this.model.matchingCurrency;
                this.paymentCurrency = this.model.currencyCode;
            } else {
                this.currencyValue = this.model.currencyCode;

            }
        }

        if (this.model.nominalAccountCode) {
            const nominalAccount = this.masterData.nominalAccounts.filter(
                (item) => item.accountNumber === this.model.nominalAccountCode,
            );

            // bind nominal bank account code depending
            if (this.model.nominalBankAccountCode) {

                this.getCounterpartyBankAccounts(this.counterpartyId,
                                                 this.model.currencyCode, this.model.nominalBankAccountCode, true);
            }

            this.payerCtrl.patchValue(this.model.ownerName);
        }
        if (this.model.nominalBankAccountCode) {
            this.clientBankCtrl.patchValue(this.model.nominalBankAccountCode);
            this.onClientBankEntered(this.model.nominalBankAccountCode, this.counterpartyId, this.model.currencyCode);
        }
        if (!isEdit) {
            this.formGroup.disable();
        }
        this.isEditable = isEdit;
        return entity;
    }

    // this method is to bind counterparty list to dropdown ,
    // 1. bind all counterparty for all kind of transaction except "for picking by tr diff client".
    // 2. bind all counterparty except the counterparty selected in "pick transaction" step for "for picking by tr diff client".
    filterCounterparties() {
        this.searchedCounterpartyCode = this.counterpartyValue;
        let counterpartyList: Counterparty[] = [];
        if (this.cashTransactionId === CashSelectionType.PaymentDifferentClient) {
            this.filteredCounterPartyList = this.masterData.counterparties.filter(
                (item) => item.counterpartyCode !== this.counterpartyValue,
            );
        } else {
            this.filteredCounterPartyList = this.masterData.counterparties;
        }
        counterpartyList = this.filteredCounterPartyList;
        this.counterpartyCtrl.valueChanges.subscribe((input) => {
            this.filteredCounterPartyList = this.utilService.filterListforAutocomplete(
                input,
                counterpartyList,
                ['counterpartyCode', 'description'],
            );
            if (this.counterpartyCtrl.valid) {
                this.onCounterpartyIdSelected(this.counterpartyCtrl.value);
            }
        });
        // in Edit mode , bind the payable counterparty details

        if (this.isEditable) {
            const counterparty = counterpartyList.find((e) =>
                e.counterpartyCode === this.paymentCounterpartyCode);

            if (counterparty) {
                this.onCounterpartyIdSelected(counterparty);
            }
        }
    }
    getCounterpartyBankAccounts(counterpartyId: number, currencyCode: string, nominalAccountId: number, isViewEdit: boolean) {
        if (counterpartyId && currencyCode) {

            this.masterdataService.getCounterPartyBankAccounts(counterpartyId, currencyCode)
                .subscribe((data) => {
                    if (data.value.length > 0) {
                        this.counterPartyBankAccountsList = data.value;
                        this.setBankAccountValidator();
                        this.filteredCounterPartyBankAccounts =
                            data.value.sort
                                ((a, b) => (a.bankName > b.bankName) ? 1 : -1);
                        this.savedCounterPartyBankAccounts = this.filteredCounterPartyBankAccounts;
                        // bind values in view/edit mode
                        if (this.model && this.model.nominalAccountCode) {
                            const clientBankAccount = this.filteredCounterPartyBankAccounts
                                .find((item) => item.bankAccountId === Number(nominalAccountId));
                            if (clientBankAccount) {
                                this.clientBankCtrl.patchValue(clientBankAccount.bankAccountId);
                            }
                            this.onClientBankEntered(nominalAccountId, counterpartyId, currencyCode);
                        } else if (this.filteredCounterPartyBankAccounts && this.filteredCounterPartyBankAccounts.length > 0) {
                            let defaultBankAccount;
                            this.filteredCounterPartyBankAccounts.forEach((bankAccount) => {
                                if (!defaultBankAccount && bankAccount.isBankAccountDefault) {
                                    defaultBankAccount = bankAccount;
                                }
                            });
                            if (defaultBankAccount) {
                                this.clientBankCtrl.patchValue(defaultBankAccount.bankAccountId);
                            }
                            if (data.value && data.value.length > 0 && defaultBankAccount) {
                                this.onClientBankEntered(data.value[0].bankAccountId, counterpartyId, currencyCode);
                            }

                        }
                        this.showHintForNoClientBankAccount = false;
                    } else {
                        this.clientBankCtrl.patchValue(null);
                        if (this.bankInformationComponent) {
                            this.bankInformationComponent.resetClientBankInformation();
                        }
                        this.filteredCounterPartyBankAccounts = [];
                        this.savedCounterPartyBankAccounts = [];
                        this.showHintForNoClientBankAccount = true;
                    }
                });
        }
    }

    onclientBankSelected(value: number) {
        if (this.savedCounterPartyBankAccounts) {
            const clientBank = this.savedCounterPartyBankAccounts.find((a) =>
                a.bankAccountId === value);

            if (clientBank) {
                this.onClientBankEntered(value, this.counterpartyId, this.currencyValue);
            }
        }
    }

    displayClientBank(value: any) {
        if (this.savedCounterPartyBankAccounts && value) {
            let clientBank;
            if (typeof value === 'number') {
                clientBank = this.savedCounterPartyBankAccounts.find((a) =>
                    a.bankAccountId === value);
            } else if (typeof value === 'string') {
                if (value.indexOf('|') >= 0) {
                    value = value.split('|')[0].trim();
                    clientBank = this.savedCounterPartyBankAccounts.find((a) =>
                        a.accountNo === value);
                }
            }

            if (clientBank) {
                return (clientBank.accountNo + ' | ' + clientBank.bankName);
            }
        }
        return '';
    }

    onClientBankEntered(clientBankId: number, counterpartyId: number, currencyCode: string) {
        if (!counterpartyId && !currencyCode) {
            this.setClientBankInformation.emit();
        } else {
            if (this.bankInformationComponent) {
                this.bankInformationComponent.setClientBankInformation(clientBankId, counterpartyId, currencyCode);
            }
        }
    }

    onClientBankRemoval() {
        if (!this.clientBankCtrl.value) {
            if (this.bankInformationComponent) {
                this.bankInformationComponent.resetClientBankInformation();
            }
        }
    }
}
