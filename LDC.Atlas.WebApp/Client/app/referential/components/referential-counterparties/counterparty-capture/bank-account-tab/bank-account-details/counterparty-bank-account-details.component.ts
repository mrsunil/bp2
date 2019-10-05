import { Component, OnInit, EventEmitter, Output, Input, ViewChild, HostListener } from '@angular/core';
import { AtlasFormControl } from '../../../../../../shared/entities/atlas-form-control';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormConfigurationProviderService } from '../../../../../../shared/services/form-configuration-provider.service'
import { BaseFormComponent } from '../../../../../../shared/components/base-form-component/base-form-component.component'
import { CounterpartyBankAccountDetails } from '../../../../../../shared/entities/counterparty-bank-account-details.entity';
import { BankTypes } from '../../../../../../shared/enums/bank-type.enum';
import { BankType } from '../../../../../../shared/entities/bank-type.entity';
import { SnackbarService } from '../../../../../../shared/services/snackbar.service';
import { MatDialog } from '@angular/material';
import { ConfirmationDialogComponent } from '../../../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { MasterDataProps } from '../../../../../../shared/entities/masterdata-props.entity';
import { Country } from '../../../../../../shared/entities/country.entity';
import { MasterdataService } from '../../../../../../shared/services/http-services/masterdata.service';
import { MasterData } from '../../../../../../shared/entities/masterdata.entity';
import { UtilService, } from '../../../../../../shared/services/util.service';
import { Currency } from '../../../../../../shared/entities/currency.entity';
import { CounterpartyBankAccountIntermediary } from '../../../../../../shared/entities/counterparty-bank-account-intermediary.entity';
import { BankNccType } from '../../../../../../shared/entities/bank-ncc-type.entity';

@Component({
    selector: 'atlas-counterparty-bank-account-details',
    templateUrl: './counterparty-bank-account-details.component.html',
    styleUrls: ['./counterparty-bank-account-details.component.scss']
})
export class CounterpartyBankAccountDetailsComponent extends BaseFormComponent implements OnInit {
    @Output() readonly setBankAccountData = new EventEmitter<any>();
    @Output() readonly deleteBankAccountData = new EventEmitter<any>();
    @Output() readonly cancelBankAccountData = new EventEmitter<any>();
    @Input() bankAccountListLength: number;
    bankAccountFormGroup: FormGroup;
    bankAccountIntermediary1FormGroup: FormGroup;
    bankAccountIntermediary2FormGroup: FormGroup;
    bankAccountDisplay: CounterpartyBankAccountDetails;
    panelOpenState = false;
    bankType: BankType[];
    bankNccTypes: BankNccType[];
    isNewBankAccount: boolean = true;
    newBankAccountForm: boolean = false;
    editBankAccount: boolean = false;
    bankCountry: Country[];
    bankIntermediary1Country: Country[];
    bankIntermediary2Country: Country[];
    accountCurrency: Currency[];
    accountIntermediary1Currency: Currency[];
    accountIntermediary2Currency: Currency[];
    masterdata: MasterData;
    bankAccountEmptyMessage: string = "Start by Selecting One";
    bankStatus: number = 1;
    bankAccountName: string;

    bankAccountStatusCtrl = new AtlasFormControl('bankAccountStatus');
    bankNameCtrl = new AtlasFormControl('bankName');
    bankAccountDescriptionCtrl = new AtlasFormControl('bankAccountDescription');
    addressLine1Ctrl = new AtlasFormControl('addressLine1');
    addressLine2Ctrl = new AtlasFormControl('addressLine2');
    addressLine3Ctrl = new AtlasFormControl('addressLine3');
    addressLine4Ctrl = new AtlasFormControl('addressLine4');
    zipCodeCtrl = new AtlasFormControl('zipCode');
    cityCtrl = new AtlasFormControl('city');
    countryCtrl = new AtlasFormControl('country');
    bankSWIFTCodeCtrl = new AtlasFormControl('bankSWIFTCode');
    accountCcyCtrl = new AtlasFormControl('accountCcy');
    bankTypeCtrl = new AtlasFormControl('bankType');
    bankNoCtrl = new AtlasFormControl('bankNo');
    bankBranchCtrl = new AtlasFormControl('bankBranch');
    accountNoCtrl = new AtlasFormControl('accountNo');
    bankNccTypeCtrl = new AtlasFormControl('bankNccType');
    nccCtrl = new AtlasFormControl('ncc');
    ncsCtrl = new AtlasFormControl('ncs');
    fedABACtrl = new AtlasFormControl('fedABA');
    chipsCtrl = new AtlasFormControl('chips');
    bankPhoneNumberCtrl = new AtlasFormControl('bankPhoneNumber');
    bankFaxNumberCtrl = new AtlasFormControl('bankFaxNumber');
    bankTelexNumberCtrl = new AtlasFormControl('bankTelexNumber');
    interfaceCodeCtrl = new AtlasFormControl('interfaceCode');

    bankIntermediary1AccountDescriptionCtrl = new AtlasFormControl('bankIntermediary1AccountDescription');
    intermediary1BankNameCtrl = new AtlasFormControl('intermediary1BankName');
    intermediary1AddressLine1Ctrl = new AtlasFormControl('intermediary1AddressLine1');
    intermediary1AddressLine2Ctrl = new AtlasFormControl('intermediary1AddressLine2');
    intermediary1AddressLine3Ctrl = new AtlasFormControl('intermediary1AddressLine3');
    intermediary1AddressLine4Ctrl = new AtlasFormControl('intermediary1AddressLine4');
    intermediary1ZipCodeCtrl = new AtlasFormControl('intermediary1ZipCode');
    intermediary1BankTypeCtrl = new AtlasFormControl('intermediary1BankType');
    intermediary1BankNoCtrl = new AtlasFormControl('intermediary1BankNo');
    intermediary1CityCtrl = new AtlasFormControl('intermediary1City');
    intermediary1CountryCtrl = new AtlasFormControl('intermediary1Country');
    intermediary1AccountNoCtrl = new AtlasFormControl('intermediary1AccountNo');
    intermediary1AccountCcyCtrl = new AtlasFormControl('intermediary1AccountCcy');
    intermediary1BankSWIFTCodeCtrl = new AtlasFormControl('intermediary1BankSWIFTCode');
    bankName1Ctrl = new AtlasFormControl('bankName1');
    intermediary1BankBranchCtrl = new AtlasFormControl('intermediary1BankBranch');
    intermediary1FEDABACtrl = new AtlasFormControl('intermediary1FEDABA');
    intermediary1ChipsCtrl = new AtlasFormControl('intermediary1Chips');
    intermediary1NCCCtrl = new AtlasFormControl('intermediary1NCC');
    intermediary1NCSCtrl = new AtlasFormControl('intermediary1NCS');
    bankIntermediary1OrderCtrl = new AtlasFormControl('bankIntermediary1Order');
    intermediary1BankNccTypeCtrl = new AtlasFormControl('intermediary1BankNccType');

    bankIntermediary2AccountDescriptionCtrl = new AtlasFormControl('bankIntermediary2AccountDescription');
    intermediary2BankNameCtrl = new AtlasFormControl('intermediary2BankName');
    intermediary2AddressLine1Ctrl = new AtlasFormControl('intermediary2AddressLine1');
    intermediary2AddressLine2Ctrl = new AtlasFormControl('intermediary2AddressLine2');
    intermediary2AddressLine3Ctrl = new AtlasFormControl('intermediary2AddressLine3');
    intermediary2AddressLine4Ctrl = new AtlasFormControl('intermediary2AddressLine4');
    intermediary2ZipCodeCtrl = new AtlasFormControl('intermediary2ZipCode');
    intermediary2BankTypeCtrl = new AtlasFormControl('intermediary2BankType');
    intermediary2BankNoCtrl = new AtlasFormControl('intermediary2BankNo');
    intermediary2CityCtrl = new AtlasFormControl('intermediary2City');
    intermediary2CountryCtrl = new AtlasFormControl('intermediary2Country');
    intermediary2AccountNoCtrl = new AtlasFormControl('intermediary2AccountNo');
    intermediary2AccountCcyCtrl = new AtlasFormControl('intermediary2AccountCcy');
    intermediary2BankSWIFTCodeCtrl = new AtlasFormControl('intermediary2BankSWIFTCode');
    bankName2Ctrl = new AtlasFormControl('bankName2');
    intermediary2BankBranchCtrl = new AtlasFormControl('intermediary2BankBranch');
    intermediary2FEDABACtrl = new AtlasFormControl('intermediary2FEDABA');
    intermediary2ChipsCtrl = new AtlasFormControl('intermediary2Chips');
    intermediary2NCCCtrl = new AtlasFormControl('intermediary2NCC');
    intermediary2NCSCtrl = new AtlasFormControl('intermediary2NCS');
    bankIntermediary2OrderCtrl = new AtlasFormControl('bankIntermediary2Order');
    intermediary2BankNccTypeCtrl = new AtlasFormControl('intermediary2BankNccType');

    masterdataList: string[] = [
        MasterDataProps.Countries,
        MasterDataProps.BankTypes,
        MasterDataProps.BankNccTypes,
        MasterDataProps.Currencies,
    ];

    bankTypeDisplayProperty: string = 'enumEntityValue';
    bankTypeSelectProperties: string[] = ['enumEntityValue'];
    bankTypeOptions = this.bankType;

    bankIntermediary1OrderDisplayProperty: string = 'bankIntermediaryOrder';
    bankIntermediary1OrderSelectProperties: string[] = ['bankIntermediaryOrder'];
    bankIntermediary1OrderOptions = new Array<any>(
        { bankIntermediaryOrder: '1' },
        { bankIntermediaryOrder: '2' },
    );

    bankIntermediary2OrderDisplayProperty: string = 'bankIntermediaryOrder';
    bankIntermediary2OrderSelectProperties: string[] = ['bankIntermediaryOrder'];
    bankIntermediary2OrderOptions = new Array<any>(
        { bankIntermediaryOrder: '1' },
        { bankIntermediaryOrder: '2' },
    );

    isDeleteDisabled: boolean = false;
    @Input() isViewMode: boolean = false;

    constructor(protected formBuilder: FormBuilder,
        protected formConfigurationProvider: FormConfigurationProviderService,
        protected snackbarService: SnackbarService,
        protected dialog: MatDialog,
        protected utilService: UtilService,
        protected masterdataService: MasterdataService,
    ) {
        super(formConfigurationProvider);
    }

    ngOnInit() {
        this.initializeForm();

        if (this.isViewMode) {
            this.bankAccountFormGroup.disable();
            this.bankAccountIntermediary1FormGroup.disable();
            this.bankAccountIntermediary2FormGroup.disable();
        }

        this.masterdataService
            .getMasterData(this.masterdataList)
            .subscribe((data) => {
                this.masterdata = data;
                this.bankTypeOptions = this.masterdata.bankTypes;
                this.bankIntermediary1Country = this.masterdata.countries;
                this.bankCountry = this.masterdata.countries;
                this.bankIntermediary1Country = this.masterdata.countries;
                this.bankIntermediary2Country = this.masterdata.countries;
                this.accountCurrency = this.masterdata.currencies;
                this.accountIntermediary1Currency = this.masterdata.currencies;
                this.accountIntermediary2Currency = this.masterdata.currencies;
                this.countryCtrl.valueChanges.subscribe((input) => {
                    this.bankCountry = this.utilService.filterListforAutocomplete(
                        input,
                        this.masterdata.countries,
                        ['countryId', 'description'],
                    );
                });

                this.intermediary1CountryCtrl.valueChanges.subscribe((input) => {
                    this.bankIntermediary1Country = this.utilService.filterListforAutocomplete(
                        input,
                        this.masterdata.countries,
                        ['countryId', 'description'],
                    );
                });

                this.intermediary2CountryCtrl.valueChanges.subscribe((input) => {
                    this.bankIntermediary2Country = this.utilService.filterListforAutocomplete(
                        input,
                        this.masterdata.countries,
                        ['countryId', 'description'],
                    );
                });

                this.accountCcyCtrl.valueChanges.subscribe((input) => {
                    this.accountCurrency = this.utilService.filterListforAutocomplete(
                        input,
                        this.masterdata.currencies,
                        ['currencyCode', 'description'],
                    );
                });

                this.intermediary1AccountCcyCtrl.valueChanges.subscribe((input) => {
                    this.accountIntermediary1Currency = this.utilService.filterListforAutocomplete(
                        input,
                        this.masterdata.currencies,
                        ['currencyCode', 'description'],
                    );
                });

                this.intermediary2AccountCcyCtrl.valueChanges.subscribe((input) => {
                    this.accountIntermediary2Currency = this.utilService.filterListforAutocomplete(
                        input,
                        this.masterdata.currencies,
                        ['currencyCode', 'description'],
                    );
                });
            });



        this.setValidators();
    }

    initializeForm() {
        this.bankAccountFormGroup = this.formBuilder.group(
            {
                bankAccountStatusCtrl: this.bankAccountStatusCtrl,
                bankNameCtrl: this.bankNameCtrl,
                bankAccountDescriptionCtrl: this.bankAccountDescriptionCtrl,
                addressLine1Ctrl: this.addressLine1Ctrl,
                addressLine2Ctrl: this.addressLine2Ctrl,
                addressLine3Ctrl: this.addressLine3Ctrl,
                addressLine4Ctrl: this.addressLine4Ctrl,
                zipCodeCtrl: this.zipCodeCtrl,
                cityCtrl: this.cityCtrl,
                countryCtrl: this.countryCtrl,
                bankSWIFTCodeCtrl: this.bankSWIFTCodeCtrl,
                accountCcyCtrl: this.accountCcyCtrl,
                bankTypeCtrl: this.bankTypeCtrl,
                bankNoCtrl: this.bankNoCtrl,
                bankBranchCtrl: this.bankBranchCtrl,
                accountNoCtrl: this.accountNoCtrl,
                nccCtrl: this.nccCtrl,
                ncsCtrl: this.ncsCtrl,
                fedABACtrl: this.fedABACtrl,
                chipsCtrl: this.chipsCtrl,
                bankPhoneNumberCtrl: this.bankPhoneNumberCtrl,
                bankFaxNumberCtrl: this.bankFaxNumberCtrl,
                bankTelexNumberCtrl: this.bankTelexNumberCtrl,
            },
        );
        this.bankAccountIntermediary1FormGroup = this.formBuilder.group(
            {
                bankIntermediary1AccountDescriptionCtrl: this.bankIntermediary1AccountDescriptionCtrl,
                intermediary1BankNameCtrl: this.intermediary1BankNameCtrl,
                intermediary1AddressLine1Ctrl: this.intermediary1AddressLine1Ctrl,
                intermediary1AddressLine2Ctrl: this.intermediary1AddressLine2Ctrl,
                intermediary1AddressLine3Ctrl: this.intermediary1AddressLine3Ctrl,
                intermediary1AddressLine4Ctrl: this.intermediary1AddressLine4Ctrl,
                intermediary1ZipCodeCtrl: this.intermediary1ZipCodeCtrl,
                intermediary1BankTypeCtrl: this.intermediary1BankTypeCtrl,
                intermediary1BankNoCtrl: this.intermediary1BankNoCtrl,
                intermediary1CityCtrl: this.intermediary1CityCtrl,
                intermediary1CountryCtrl: this.intermediary1CountryCtrl,
                intermediary1AccountNoCtrl: this.intermediary1AccountNoCtrl,
                intermediary1AccountCcyCtrl: this.intermediary1AccountCcyCtrl,
                intermediary1BankSWIFTCodeCtrl: this.intermediary1BankSWIFTCodeCtrl,
                bankName1Ctrl: this.bankName1Ctrl,
                intermediary1BankBranchCtrl: this.intermediary1BankBranchCtrl,
                intermediary1FEDABACtrl: this.intermediary1FEDABACtrl,
                intermediary1ChipsCtrl: this.intermediary1ChipsCtrl,
                intermediary1NCCCtrl: this.intermediary1NCCCtrl,
                intermediary1NCSCtrl: this.intermediary1NCSCtrl,
                bankIntermediary1OrderCtrl: this.bankIntermediary1OrderCtrl,
            },
        );
        this.bankAccountIntermediary2FormGroup = this.formBuilder.group(
            {
                bankIntermediary2AccountDescriptionCtrl: this.bankIntermediary2AccountDescriptionCtrl,
                intermediary2BankNameCtrl: this.intermediary2BankNameCtrl,
                intermediary2AddressLine1Ctrl: this.intermediary2AddressLine1Ctrl,
                intermediary2AddressLine2Ctrl: this.intermediary2AddressLine2Ctrl,
                intermediary2AddressLine3Ctrl: this.intermediary2AddressLine3Ctrl,
                intermediary2AddressLine4Ctrl: this.intermediary2AddressLine4Ctrl,
                intermediary2ZipCodeCtrl: this.intermediary2ZipCodeCtrl,
                intermediary2BankTypeCtrl: this.intermediary2BankTypeCtrl,
                intermediary2BankNoCtrl: this.intermediary2BankNoCtrl,
                intermediary2CityCtrl: this.intermediary2CityCtrl,
                intermediary2CountryCtrl: this.intermediary2CountryCtrl,
                intermediary2AccountNoCtrl: this.intermediary2AccountNoCtrl,
                intermediary2AccountCcyCtrl: this.intermediary2AccountCcyCtrl,
                intermediary2BankSWIFTCodeCtrl: this.intermediary2BankSWIFTCodeCtrl,
                bankName2Ctrl: this.bankName2Ctrl,
                intermediary2BankBranchCtrl: this.intermediary2BankBranchCtrl,
                intermediary2FEDABACtrl: this.intermediary2FEDABACtrl,
                intermediary2ChipsCtrl: this.intermediary2ChipsCtrl,
                intermediary2NCCCtrl: this.intermediary2NCCCtrl,
                intermediary2NCSCtrl: this.intermediary2NCSCtrl,
                bankIntermediary2OrderCtrl: this.bankIntermediary2OrderCtrl,
            },
        );
    }

    setValidators() {
        this.bankNameCtrl.setValidators(
            Validators.compose([Validators.required]),
        );
        this.bankNoCtrl.setValidators(
            Validators.compose([Validators.required]),
        );
        this.countryCtrl.setValidators(
            Validators.compose([Validators.required]),
        );
        this.bankSWIFTCodeCtrl.setValidators(
            Validators.compose([Validators.required]),
        );
        this.accountCcyCtrl.setValidators(
            Validators.compose([Validators.required]),
        );
        this.accountNoCtrl.setValidators(
            Validators.compose([Validators.required]),
        );
        this.bankTypeCtrl.setValidators(
            Validators.compose([Validators.required]),
        );

        this.bankNameCtrl.setValidators(
            Validators.compose([Validators.maxLength(40)]),
        );
        this.bankAccountDescriptionCtrl.setValidators(
            Validators.compose([Validators.maxLength(160)]),
        );
        this.addressLine1Ctrl.setValidators(
            Validators.compose([Validators.maxLength(160)]),
        );
        this.addressLine2Ctrl.setValidators(
            Validators.compose([Validators.maxLength(160)]),
        );

        this.intermediary1BankNameCtrl.setValidators(
            Validators.compose([Validators.maxLength(40)]),
        );
        this.bankIntermediary1AccountDescriptionCtrl.setValidators(
            Validators.compose([Validators.maxLength(160)]),
        );
        this.intermediary1AddressLine1Ctrl.setValidators(
            Validators.compose([Validators.maxLength(160)]),
        );
        this.intermediary1AddressLine2Ctrl.setValidators(
            Validators.compose([Validators.maxLength(160)]),
        );

        this.intermediary2BankNameCtrl.setValidators(
            Validators.compose([Validators.maxLength(40)]),
        );
        this.bankIntermediary2AccountDescriptionCtrl.setValidators(
            Validators.compose([Validators.maxLength(160)]),
        );
        this.intermediary2AddressLine1Ctrl.setValidators(
            Validators.compose([Validators.maxLength(160)]),
        );
        this.intermediary2AddressLine2Ctrl.setValidators(
            Validators.compose([Validators.maxLength(160)]),
        );

        this.bankAccountFormGroup.updateValueAndValidity();
    }

    bankAccountStatusChanged() {
        this.bankStatus = this.bankAccountStatusCtrl.value;
    }

    saveBankAccount() {
        let bankAccount = <CounterpartyBankAccountDetails>{
            bankAccountId: this.bankAccountDisplay ? this.bankAccountDisplay.bankAccountId : null,
            randomId: this.isNewBankAccount ? this.bankAccountListLength + 1 : this.bankAccountDisplay.randomId,
            bankAccountStatusID: this.bankStatus,
            bankName: this.bankNameCtrl.value,
            bankAccountDesc: this.bankAccountDescriptionCtrl.value,
            bankAddressLine1: this.addressLine1Ctrl.value,
            bankAddressLine2: this.addressLine2Ctrl.value,
            bankAddressLine3: this.addressLine3Ctrl.value,
            bankAddressLine4: this.addressLine4Ctrl.value,
            bankZIPCode: this.zipCodeCtrl.value,
            bankCity: this.cityCtrl.value,
            bankCountryKey: this.countryCtrl.value ? this.bankCountry.find(country => country.description === this.countryCtrl.value).countryId : '',
            bankSwiftCode: this.bankSWIFTCodeCtrl.value,
            accountCCY: this.accountCcyCtrl.value ? this.accountCurrency.find(currency => currency.description === this.accountCcyCtrl.value).currencyCode : '',
            bankTypeID: this.bankTypeCtrl.value ? this.bankTypeCtrl.value.enumEntityId : '',
            bankKey: this.bankNoCtrl.value,
            bankBranch: this.bankBranchCtrl.value,
            accountNo: this.accountNoCtrl.value,
            ncc: this.nccCtrl.value,
            ncs: this.ncsCtrl.value,
            fedaba: this.fedABACtrl.value,
            chips: this.chipsCtrl.value,
            interfaceCode: this.interfaceCodeCtrl.value,
            bankPhoneNo: this.bankPhoneNumberCtrl.value,
            bankFaxNo: this.bankFaxNumberCtrl.value,
            bankTelexNo: this.bankTelexNumberCtrl.value,
            externalReference: "",
            mdmID: null,
            counterpartyId: this.bankAccountDisplay ? this.bankAccountDisplay.counterpartyId : null,
            bankAccountDefault: false,
            bankAccountIntermediary: false,
            bankNccType: this.bankNccTypeCtrl.value,
            isDeactivated: (this.bankStatus == 1) ? false : true,
            tempBankAccountId: this.isNewBankAccount ? this.bankAccountListLength + 1 : this.bankAccountDisplay.tempBankAccountId,
        };

        bankAccount.bankAccountIntermediary1 = <CounterpartyBankAccountIntermediary>{
            bankAccountIntermediaryId: this.bankAccountDisplay ? this.bankAccountDisplay.bankAccountIntermediary1 ? this.bankAccountDisplay.bankAccountIntermediary1.bankAccountIntermediaryId : null : null,
            intermediaryId: this.bankAccountDisplay ? this.bankAccountDisplay.bankAccountIntermediary1 ? this.bankAccountDisplay.bankAccountIntermediary1.intermediaryId : null : null,
            bankAccountId: this.bankAccountDisplay ? this.bankAccountDisplay.bankAccountIntermediary1 ? this.bankAccountDisplay.bankAccountIntermediary1.bankAccountId : null : null,
            parentBankAccountId: bankAccount.bankAccountId,
            bankAccountDesc: this.bankIntermediary1AccountDescriptionCtrl.value,
            bankName: this.intermediary1BankNameCtrl.value,
            bankAddressLine1: this.intermediary1AddressLine1Ctrl.value,
            bankAddressLine2: this.intermediary1AddressLine2Ctrl.value,
            bankAddressLine3: this.intermediary1AddressLine3Ctrl.value,
            bankAddressLine4: this.intermediary1AddressLine4Ctrl.value,
            bankZIPCode: this.intermediary1ZipCodeCtrl.value,
            bankCity: this.intermediary1CityCtrl.value,
            bankCountryKey: this.intermediary1CountryCtrl.value ? this.bankIntermediary1Country.find(country => country.description === this.intermediary1CountryCtrl.value).countryId : '',
            accountNo: this.intermediary1AccountNoCtrl.value,
            accountCCY: this.intermediary1AccountCcyCtrl.value ? this.accountIntermediary1Currency.find(currency => currency.description === this.intermediary1AccountCcyCtrl.value).currencyCode : '',
            bankTypeID: this.intermediary1BankTypeCtrl.value ? this.intermediary1BankTypeCtrl.value.enumEntityId : '',
            bankKey: this.intermediary1BankNoCtrl.value,
            bankAccountStatusID: this.bankStatus,
            externalReference: "",
            mdmID: null,
            counterpartyId: bankAccount.counterpartyId,
            bankAccountDefault: false,
            bankAccountIntermediary: false,
            bankSwiftCode: this.intermediary1BankSWIFTCodeCtrl.value,
            bankBranch: this.intermediary1BankBranchCtrl.value,
            fedaba: this.intermediary1FEDABACtrl.value,
            chips: this.intermediary1ChipsCtrl.value,
            ncc: this.intermediary1NCCCtrl.value,
            ncs: this.intermediary1NCSCtrl.value,
            order: this.bankIntermediary1OrderCtrl.value ? this.bankIntermediary1OrderCtrl.value.bankIntermediaryOrder : '',
            bankNccType: this.intermediary1BankNccTypeCtrl.value,
            tempParentBankAccountId: this.isNewBankAccount ? this.bankAccountListLength + 1 : this.bankAccountDisplay.tempBankAccountId,
        };

        bankAccount.bankAccountIntermediary2 = <CounterpartyBankAccountIntermediary>{
            bankAccountIntermediaryId: this.bankAccountDisplay ? this.bankAccountDisplay.bankAccountIntermediary2 ? this.bankAccountDisplay.bankAccountIntermediary2.bankAccountIntermediaryId : null : null,
            intermediaryId: this.bankAccountDisplay ? this.bankAccountDisplay.bankAccountIntermediary2 ? this.bankAccountDisplay.bankAccountIntermediary2.intermediaryId : null : null,
            bankAccountId: this.bankAccountDisplay ? this.bankAccountDisplay.bankAccountIntermediary2 ? this.bankAccountDisplay.bankAccountIntermediary2.bankAccountId : null : null,
            parentBankAccountId: bankAccount.bankAccountId,
            bankAccountDesc: this.bankIntermediary2AccountDescriptionCtrl.value,
            bankName: this.intermediary2BankNameCtrl.value,
            bankAddressLine1: this.intermediary2AddressLine1Ctrl.value,
            bankAddressLine2: this.intermediary2AddressLine2Ctrl.value,
            bankAddressLine3: this.intermediary2AddressLine3Ctrl.value,
            bankAddressLine4: this.intermediary2AddressLine4Ctrl.value,
            bankZIPCode: this.intermediary2ZipCodeCtrl.value,
            bankCity: this.intermediary2CityCtrl.value,
            bankCountryKey: this.intermediary2CountryCtrl.value ? this.bankIntermediary2Country.find(country => country.description === this.intermediary2CountryCtrl.value).countryId : '',
            accountNo: this.intermediary2AccountNoCtrl.value,
            accountCCY: this.intermediary2AccountCcyCtrl.value ? this.accountIntermediary2Currency.find(currency => currency.description === this.intermediary2AccountCcyCtrl.value).currencyCode : '',
            bankTypeID: this.intermediary2BankTypeCtrl.value ? this.intermediary2BankTypeCtrl.value.enumEntityId : '',
            bankKey: this.intermediary2BankNoCtrl.value,
            bankAccountStatusID: this.bankStatus,
            externalReference: "",
            mdmID: null,
            counterpartyId: bankAccount.counterpartyId,
            bankAccountDefault: false,
            bankAccountIntermediary: false,
            bankSwiftCode: this.intermediary2BankSWIFTCodeCtrl.value,
            bankBranch: this.intermediary2BankBranchCtrl.value,
            fedaba: this.intermediary2FEDABACtrl.value,
            chips: this.intermediary2ChipsCtrl.value,
            ncc: this.intermediary2NCCCtrl.value,
            ncs: this.intermediary2NCSCtrl.value,
            order: this.bankIntermediary2OrderCtrl.value ? this.bankIntermediary2OrderCtrl.value.bankIntermediaryOrder : '',
            bankNccType: this.intermediary2BankNccTypeCtrl.value,
            tempParentBankAccountId: this.isNewBankAccount ? this.bankAccountListLength + 1 : this.bankAccountDisplay.tempBankAccountId,
        };
        this.setBankAccountData.emit(bankAccount);
    }

    @HostListener('window:beforeunload', ['$event']) unloadNotification($event: any) {
        if (this.bankAccountFormGroup.dirty ||
            this.bankAccountIntermediary1FormGroup.dirty ||
            this.bankAccountIntermediary2FormGroup.dirty) {
            const confirmDiscardDialog = this.dialog.open(ConfirmationDialogComponent, {
                data: {
                    title: 'Discard Changes',
                    text: 'Do you want to save the details',
                    okButton: 'Yes',
                    cancelButton: 'No',
                },
            });
            confirmDiscardDialog.afterClosed().subscribe((answer) => {
                if (answer) {
                    this.onBankAccountSaveButtonClick();
                }
            });
            $event.returnValue = true;
        }
    }

    onBankAccountDeleteButtonClick() {
        const confirmDiscardDialog = this.dialog.open(ConfirmationDialogComponent, {
            data: {
                title: 'Discard Changes',
                text: 'Do you confirm the deletion of Bank Account ' + this.bankName1Ctrl.value,
                okButton: 'Yes',
                cancelButton: 'No',
            },
        });
        confirmDiscardDialog.afterClosed().subscribe((answer) => {
            if (answer) {
                this.deleteBankAccountData.emit(this.bankAccountDisplay);
                this.bankAccountFormGroup.reset();
                this.bankAccountIntermediary1FormGroup.reset();
                this.bankAccountIntermediary2FormGroup.reset();
                this.newBankAccountForm = false;
                this.editBankAccount = false;
            }
        });
    }

    onBankIntermediary1AccountDeleteButtonClick() {
        const confirmDiscardDialog = this.dialog.open(ConfirmationDialogComponent, {
            data: {
                title: 'Discard Changes',
                text: 'Do you confirm the deletion of Bank Account ' + this.intermediary1BankNameCtrl.value,
                okButton: 'Yes',
                cancelButton: 'No',
            },
        });
        confirmDiscardDialog.afterClosed().subscribe((answer) => {
            if (answer) {
                this.bankAccountIntermediary1FormGroup.reset();
            }
        });
    }

    onBankIntermediary2AccountDeleteButtonClick() {
        const confirmDiscardDialog = this.dialog.open(ConfirmationDialogComponent, {
            data: {
                title: 'Discard Changes',
                text: 'Do you confirm the deletion of Bank Account ' + this.intermediary2BankNameCtrl.value,
                okButton: 'Yes',
                cancelButton: 'No',
            },
        });
        confirmDiscardDialog.afterClosed().subscribe((answer) => {
            if (answer) {
                this.bankAccountIntermediary2FormGroup.reset();
            }
        });
    }

    onBankAccountSaveButtonClick() {
        if (this.bankAccountFormGroup.valid &&
            this.bankAccountIntermediary1FormGroup.valid &&
            this.bankAccountIntermediary2FormGroup.valid) {
            this.saveBankAccount();
            this.bankAccountFormGroup.reset();
            this.bankAccountIntermediary1FormGroup.reset();
            this.bankAccountIntermediary2FormGroup.reset();
            this.newBankAccountForm = false;
            this.editBankAccount = false;
        }
        else {
            this.snackbarService.throwErrorSnackBar(
                'Form is invalid. Please resolve the errors.',
            );
            return;
        }
    }

    onBankAccountCancelButtonClick() {
        this.bankAccountFormGroup.reset();
        this.bankAccountIntermediary1FormGroup.reset();
        this.bankAccountIntermediary2FormGroup.reset();
        this.newBankAccountForm = false;
        this.editBankAccount = false;
        this.cancelBankAccountData.emit();
    }

    getBankAccountData(data: CounterpartyBankAccountDetails, deletionFlag: boolean) {
        if (data) {
            this.bankAccountDisplay = data;
            this.bankAccountName = this.bankAccountDisplay.bankName;
            if (data.randomId) {
                this.isNewBankAccount = false;
            }
            if (data.isDeactivated) {
                data.bankAccountStatusID = 2;
            }
            else {
                data.bankAccountStatusID = 1;
            }

            this.bankAccountStatusCtrl.patchValue(data.bankAccountStatusID);
            this.bankStatus = data.bankAccountStatusID;
            this.bankNameCtrl.patchValue(data.bankName);
            this.bankAccountDescriptionCtrl.patchValue(data.bankAccountDesc);
            this.addressLine1Ctrl.patchValue(data.bankAddressLine1);
            this.addressLine2Ctrl.patchValue(data.bankAddressLine2);
            this.addressLine3Ctrl.patchValue(data.bankAddressLine3);
            this.addressLine4Ctrl.patchValue(data.bankAddressLine4);
            this.zipCodeCtrl.patchValue(data.bankZIPCode);
            this.cityCtrl.patchValue(data.bankCity);
            if (data.bankCountryKey) {
                this.countryCtrl.patchValue(this.bankCountry.find(country => country.countryId === data.bankCountryKey).description);
            }
            this.bankSWIFTCodeCtrl.patchValue(data.bankSwiftCode);
            if (data.accountCCY) {
                this.accountCcyCtrl.patchValue(this.accountCurrency.find(currency => currency.currencyCode === data.accountCCY).description);
            }
            this.bankTypeCtrl.patchValue(this.bankTypeOptions.find(item => item.enumEntityId === data.bankTypeID));
            this.bankNoCtrl.patchValue(data.bankKey);
            this.bankBranchCtrl.patchValue(data.bankBranch);
            this.accountNoCtrl.patchValue(data.accountNo);
            this.nccCtrl.patchValue(data.ncc);
            this.ncsCtrl.patchValue(data.ncs);
            this.fedABACtrl.patchValue(data.fedaba);
            this.chipsCtrl.patchValue(data.chips);
            this.interfaceCodeCtrl.patchValue(data.interfaceCode);
            this.bankPhoneNumberCtrl.patchValue(data.bankPhoneNo);
            this.bankFaxNumberCtrl.patchValue(data.bankFaxNo);
            this.bankTelexNumberCtrl.patchValue(data.bankTelexNo);
            this.bankNccTypeCtrl.patchValue(data.bankNccType);

            this.bankIntermediary1AccountDescriptionCtrl.patchValue(data.bankAccountIntermediary1.bankAccountDesc);
            this.intermediary1BankNameCtrl.patchValue(data.bankAccountIntermediary1.bankName);
            this.intermediary1AddressLine1Ctrl.patchValue(data.bankAccountIntermediary1.bankAddressLine1);
            this.intermediary1AddressLine2Ctrl.patchValue(data.bankAccountIntermediary1.bankAddressLine2);
            this.intermediary1AddressLine3Ctrl.patchValue(data.bankAccountIntermediary1.bankAddressLine3);
            this.intermediary1AddressLine4Ctrl.patchValue(data.bankAccountIntermediary1.bankAddressLine4);
            this.intermediary1ZipCodeCtrl.patchValue(data.bankAccountIntermediary1.bankZIPCode);
            this.intermediary1BankTypeCtrl.patchValue(this.bankTypeOptions.find(item => item.enumEntityId === data.bankTypeID));
            this.intermediary1BankNoCtrl.patchValue(data.bankAccountIntermediary1.bankKey);
            this.intermediary1CityCtrl.patchValue(data.bankAccountIntermediary1.bankCity);
            if (data.bankAccountIntermediary1.bankCountryKey) {
                this.intermediary1CountryCtrl.patchValue(this.bankIntermediary1Country.find(country => country.countryId === data.bankAccountIntermediary1.bankCountryKey).description);
            }
            this.intermediary1AccountNoCtrl.patchValue(data.bankAccountIntermediary1.accountNo);
            if (data.bankAccountIntermediary1.accountCCY) {
                this.intermediary1AccountCcyCtrl.patchValue(this.accountIntermediary1Currency.find(currency => currency.currencyCode === data.bankAccountIntermediary1.accountCCY).description);
            }
            this.intermediary1BankSWIFTCodeCtrl.patchValue(data.bankAccountIntermediary1.bankSwiftCode);
            this.bankName1Ctrl.patchValue(data.bankName);
            this.intermediary1BankBranchCtrl.patchValue(data.bankAccountIntermediary1.bankBranch);
            this.intermediary1FEDABACtrl.patchValue(data.bankAccountIntermediary1.fedaba);
            this.intermediary1ChipsCtrl.patchValue(data.bankAccountIntermediary1.chips);
            this.intermediary1BankNccTypeCtrl.patchValue(data.bankAccountIntermediary1.bankNccType);
            this.intermediary1NCCCtrl.patchValue(data.bankAccountIntermediary1.ncc);
            this.intermediary1NCSCtrl.patchValue(data.bankAccountIntermediary1.ncs);
            this.bankIntermediary1OrderCtrl.patchValue(this.bankIntermediary1OrderOptions[data.bankAccountIntermediary1.order - 1]);

            this.bankIntermediary2AccountDescriptionCtrl.patchValue(data.bankAccountIntermediary2.bankAccountDesc);
            this.intermediary2BankNameCtrl.patchValue(data.bankAccountIntermediary2.bankName);
            this.intermediary2AddressLine1Ctrl.patchValue(data.bankAccountIntermediary2.bankAddressLine1);
            this.intermediary2AddressLine2Ctrl.patchValue(data.bankAccountIntermediary2.bankAddressLine2);
            this.intermediary2AddressLine3Ctrl.patchValue(data.bankAccountIntermediary2.bankAddressLine3);
            this.intermediary2AddressLine4Ctrl.patchValue(data.bankAccountIntermediary2.bankAddressLine4);
            this.intermediary2ZipCodeCtrl.patchValue(data.bankAccountIntermediary2.bankZIPCode);
            this.intermediary2BankTypeCtrl.patchValue(this.bankTypeOptions.find(item => item.enumEntityId === data.bankTypeID));
            this.intermediary2BankNoCtrl.patchValue(data.bankAccountIntermediary2.bankKey);
            this.intermediary2CityCtrl.patchValue(data.bankAccountIntermediary2.bankCity);
            if (data.bankAccountIntermediary2.bankCountryKey) {
                this.intermediary2CountryCtrl.patchValue(this.bankIntermediary2Country.find(country => country.countryId === data.bankAccountIntermediary2.bankCountryKey).description);
            }
            this.intermediary2AccountNoCtrl.patchValue(data.bankAccountIntermediary2.accountNo);
            if (data.bankAccountIntermediary2.accountCCY) {
                this.intermediary2AccountCcyCtrl.patchValue(this.accountIntermediary2Currency.find(currency => currency.currencyCode === data.bankAccountIntermediary2.accountCCY).description);
            }
            this.intermediary2BankSWIFTCodeCtrl.patchValue(data.bankAccountIntermediary2.bankSwiftCode);
            this.bankName1Ctrl.patchValue(data.bankName);
            this.intermediary2BankBranchCtrl.patchValue(data.bankAccountIntermediary2.bankBranch);
            this.intermediary2FEDABACtrl.patchValue(data.bankAccountIntermediary2.fedaba);
            this.intermediary2ChipsCtrl.patchValue(data.bankAccountIntermediary2.chips);
            this.intermediary2BankNccTypeCtrl.patchValue(data.bankAccountIntermediary2.bankNccType);
            this.intermediary2NCCCtrl.patchValue(data.bankAccountIntermediary2.ncc);
            this.intermediary2NCSCtrl.patchValue(data.bankAccountIntermediary2.ncs);
            this.bankIntermediary2OrderCtrl.patchValue(this.bankIntermediary2OrderOptions[data.bankAccountIntermediary2.order - 1]);
        }
        if (deletionFlag = true) {
            this.newBankAccountForm = false;
        }
    }
}
