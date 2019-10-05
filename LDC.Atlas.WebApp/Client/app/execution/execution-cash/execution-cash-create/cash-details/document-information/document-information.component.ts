import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as _moment from 'moment';
import { Subscription } from 'rxjs';
import { CompanyManagerService } from '../../../../../core/services/company-manager.service';
import { BaseFormComponent } from '../../../../../shared/components/base-form-component/base-form-component.component';
import { inDropdownListValidator } from '../../../../../shared/directives/autocomplete-dropdown.directive';
import { isGreatherThanZero, isPositive } from '../../../../../shared/directives/number-validators.directive';
import { AtlasFormControl } from '../../../../../shared/entities/atlas-form-control';
import { BankAccount } from '../../../../../shared/entities/bank-account.entity';
import { Charter } from '../../../../../shared/entities/charter.entity';
import { CostType } from '../../../../../shared/entities/cost-type.entity';
import { Currency } from '../../../../../shared/entities/currency.entity';
import { Department } from '../../../../../shared/entities/department.entity';
import { MasterDataProps } from '../../../../../shared/entities/masterdata-props.entity';
import { MasterData } from '../../../../../shared/entities/masterdata.entity';
import { NominalAccount } from '../../../../../shared/entities/nominal-account.entity';
import { CashSelectionType } from '../../../../../shared/enums/cash-selection-type';
import { CashType } from '../../../../../shared/enums/cash-type.enum';
import { CharterDisplayView } from '../../../../../shared/models/charter-display-view';
import { ConvertToNumber, CustomNumberMask } from '../../../../../shared/numberMask';
import { CharterDataLoader } from '../../../../../shared/services/execution/charter-data-loader';
import { CashRecord } from '../../../../../shared/services/execution/dtos/cash-record';
import { CashSetup } from '../../../../../shared/services/execution/dtos/cash-setup';
import { InvoiceForCashMatching } from '../../../../../shared/services/execution/dtos/invoice-for-cash';
import { FormConfigurationProviderService } from '../../../../../shared/services/form-configuration-provider.service';
import { ExecutionService } from '../../../../../shared/services/http-services/execution.service';
import { MasterdataService } from '../../../../../shared/services/http-services/masterdata.service';
import { nameof, UtilService } from '../../../../../shared/services/util.service';
import { isGreaterThanNinetyDays } from '../../../../../shared/validators/date-validators.validator';
import { dateAfter } from '../../../../../trading/components/contract-physical-capture/form-components/shipment-period-form/shipment-period-date-validator.validator';
import { CommonMethods } from '../../../../services/execution-cash-common-methods';
const moment = _moment;

@Component({
    selector: 'atlas-document-information',
    templateUrl: './document-information.component.html',
    styleUrls: ['./document-information.component.scss'],
    providers: [CharterDataLoader],
})
export class DocumentInformationFormComponent extends BaseFormComponent implements OnInit, OnDestroy {
    @Input() isSummary = false;
    @Output() readonly currencySelected = new EventEmitter<any>();
    @Output() readonly currencySearchValue = new EventEmitter<any>();
    @Output() readonly departmentSearchValue = new EventEmitter<any>();
    @Output() readonly amountSearchValue = new EventEmitter<any>();
    @Output() readonly currencyChangeValue = new EventEmitter<any>();
    currencyCtrl = new AtlasFormControl('Currency');
    amountCtrl = new AtlasFormControl('Amount');
    amountOriginalCurrencyCtrl = new AtlasFormControl('AmountOriginalCurrency');
    departmentCodeCtrl = new AtlasFormControl('Department');
    docRefCtrl = new AtlasFormControl('DocumentReference');
    bankCtrl = new AtlasFormControl('Bank');
    docDateCtrl = new AtlasFormControl('DocumentDate');
    valueDateCtrl = new AtlasFormControl('ValueDate');
    costTypeCtrl = new AtlasFormControl('costType');
    charterCtrl = new AtlasFormControl('charter');
    nominalAccountCtrl = new AtlasFormControl('NominalAccount');
    accountDescriptionCtrl = new AtlasFormControl('AccountDescription');
    filteredNominalAccountList: NominalAccount[];
    nominalAccountListWithOnlyBankAccount: NominalAccount[];
    filteredCurrencyList: Currency[];
    filteredDepartments: Department[];
    filteredCostTypes: CostType[];
    company: string;
    charters: Charter[];
    filteredCharters: Charter[];
    cashSetupModel: CashSetup = new CashSetup();
    currencyValue: string;
    currencyRoeType: string;
    departmentValue: number;
    amountValue: number;
    amountOriginalCurrency: number;
    cashAmountValue: number;
    cashTypeId: number;
    private documentInfoDefaultSubscription: Subscription;
    documentMatchingModel: InvoiceForCashMatching;
    numberOfDays: number;
    selectionValue: number;
    currencyChangeStatus: boolean;
    masterData: MasterData;
    masterdataList: string[] = [
        MasterDataProps.Currencies,
        MasterDataProps.Departments,
        MasterDataProps.CostTypes,
    ];
    mask = CustomNumberMask(12, 10, false);

    model: CashRecord;

    filteredbankAccountList: BankAccount[];
    cashTransactionId: number;
    isDiffCurrency: boolean = false;
    filteredCharterList: Charter[];
    charterErrorMap: Map<string, string> = new Map();
    docDateErrorMap: Map<string, string> = new Map();
    valueDateErrorMap: Map<string, string> = new Map();
    amountErrorMap: Map<string, string> = new Map();
    nomAccountErrorMap: Map<string, string> = new Map();
    docRefErrorMap: Map<string, string> = new Map();
    currencyErrorMap: Map<string, string> = new Map();
    departementErrorMap: Map<string, string> = new Map();
    costTypeErrorMap: Map<string, string> = new Map();
    paymentCurrency: string;
    commonMethods: any;
    isEdit: boolean = false;

    // Enums used in html
    CashType = CashType;

    constructor(
        protected formBuilder: FormBuilder,
        protected masterdataService: MasterdataService,
        protected utilService: UtilService,
        protected formConfigurationProvider: FormConfigurationProviderService,
        private route: ActivatedRoute,
        private router: Router,
        protected executionService: ExecutionService,
        protected companyManager: CompanyManagerService,
        public charterDataLoader: CharterDataLoader,
    ) {
        super(formConfigurationProvider);
        this.cashTypeId = Number(decodeURIComponent(this.route.snapshot.paramMap.get('cashTypeId')));
        this.docDateErrorMap
            .set('required', 'Required *');
        this.valueDateErrorMap
            .set('required', 'Required *')
            .set('isBeforeDate', 'Cannot be before Document date')
            .set('isGreaterThanNinetyDays', ' Value Date should not be more than 90 days from Document date');
        this.amountErrorMap
            .set('required', 'Required *')
            .set('isPositiveError', 'Amount must be positive')
            .set('isGreatherThanZeroError', 'Amount must be greater than zero');
        this.nomAccountErrorMap
            .set('required', 'Required *');
        this.docRefErrorMap
            .set('maxlength', ' 2nd Document Reference should be at most 20 Characters long');
        this.currencyErrorMap
            .set('required', 'Required *')
            .set('inDropdownList', ' Value not in list');
        this.departementErrorMap
            .set('required', 'Required *')
            .set('inDropdownList', ' Value not in list');
        this.costTypeErrorMap
            .set('required', 'Required *')
            .set('inDropdownList', ' Value not in list');
    }

    ngOnInit() {
        this.isDiffCurrency = false;
        this.amountOriginalCurrencyCtrl.disable();
        this.company = this.route.snapshot.paramMap.get('company');
        this.masterData = this.route.snapshot.data.masterdata;
        this.filteredDepartments = this.masterData.departments;
        this.departmentCodeCtrl.valueChanges.subscribe((input) => {
            this.filteredDepartments = this.utilService.filterListforAutocomplete(
                input,
                this.masterData.departments,
                ['departmentCode', 'description'],
            );
        });

        const selectedCostTypes = this.masterData.costTypes.filter(
            (costTypes) => costTypes.isACashCost === true,
        );
        this.filteredCostTypes = selectedCostTypes;
        this.costTypeCtrl.valueChanges.subscribe((input) => {
            this.filteredCostTypes = this.utilService.filterListforAutocomplete(
                input,
                this.masterData.costTypes.filter(
                    (costTypes) => costTypes.isACashCost === true,
                ),
                ['costTypeCode', 'name'],
            );
        });
        this.populateCharterList();
        if (this.route.snapshot.url.length > 1 &&
            (this.route.snapshot.url[1].path.toString() !== 'edit'
                && this.route.snapshot.url[1].path.toString() !== 'display')) {
            this.documentInfoDefaultSubscription = this.executionService.getCashSetupDetails()
                .subscribe((data: CashSetup) => {
                    if (data) {
                        this.cashSetupModel = data;
                        const selectedCurrency = this.masterData.currencies.filter(
                            (currency) => currency.currencyCode === this.cashSetupModel.currencyCode,
                        );
                        if (selectedCurrency.length > 0) {
                            this.currencyRoeType = selectedCurrency[0].roeType;
                            this.currencyCtrl.patchValue(selectedCurrency[0].currencyCode);

                            this.currencySelected.emit(selectedCurrency[0].currencyCode);
                            this.currencySearchValue.emit({
                                currency: selectedCurrency[0].currencyCode,
                                currencyRoeType: this.currencyRoeType,
                            });
                        }

                        const selectedCostType = selectedCostTypes.filter(
                            (costType) => costType.costTypeCode === ((this.cashTypeId === CashType.CashPayment) ?
                                this.cashSetupModel.paymentCostTypeCode : this.cashSetupModel.receiptCostTypeCode),
                        );
                        this.costTypeCtrl.patchValue(selectedCostType[0].costTypeCode);

                        const nominalAccount = this.masterData.nominalAccounts.filter(
                            (e) => e.nominalAccountId === this.cashSetupModel.nominalAccountId && e.bankAccount === true);

                        if (nominalAccount.length > 0) {
                            this.nominalAccountCtrl.patchValue(nominalAccount[0].nominalAccountNumberFormated);
                            this.accountDescriptionCtrl.patchValue(nominalAccount[0].detailedDescription);
                        }
                    }
                });
            this.isEdit = true;
        }
        this.nominalAccountListWithOnlyBankAccount = this.masterData.nominalAccounts.filter((a) => a.bankAccount === true);
        this.filteredNominalAccountList = this.nominalAccountListWithOnlyBankAccount;
        this.nominalAccountCtrl.valueChanges.subscribe((input) => {
            this.filteredNominalAccountList = this.utilService.filterListforAutocomplete(
                input,
                this.nominalAccountListWithOnlyBankAccount,
                ['accountNumber', 'nominalAccountNumberFormated', 'detailedDescription'],
            );
        });

        this.docDateCtrl.setValue(this.companyManager.getCurrentCompanyDate());
        this.commonMethods = new CommonMethods();
        this.bindConfiguration();
    }

    bindDocumentValues() {
        const selectedCurrency = this.masterData.currencies.filter(
            (currency) => currency.currencyCode === this.currencyValue,
        );
        this.formGroup.patchValue({
            currencyCtrl: (selectedCurrency.length > 0) ? selectedCurrency[0].currencyCode : null,
            amountCtrl: this.commonMethods.getFormattedNumberValue(this.amountValue),
        });
        // This control is not part of the formControl, it's only informative
        this.amountOriginalCurrencyCtrl.patchValue(this.commonMethods.getFormattedNumberValue(this.amountOriginalCurrency));
        this.currencyCtrl.disable();
        this.amountCtrl.disable();
    }

    filterCurrencies() {
        let currencyList: Currency[] = [];
        this.filteredCurrencyList = this.masterData.currencies;
        currencyList = this.filteredCurrencyList;
        this.currencyCtrl.valueChanges.subscribe((input) => {
            this.filteredCurrencyList = this.utilService.filterListforAutocomplete(
                input,
                currencyList,
                ['currencyCode', 'description'],
            );
        });
    }

    setValidators() {
        this.currencyCtrl.setValidators(
            Validators.compose([
                inDropdownListValidator(
                    this.masterData.currencies,
                    nameof<Currency>('currencyCode'),
                ),
            ]),
        );

        this.departmentCodeCtrl.setValidators(
            Validators.compose([
                inDropdownListValidator(
                    this.masterData.departments,
                    nameof<Department>('departmentCode'),
                ),
            ]),
        );

        this.departmentCodeCtrl.setValidators(Validators.compose([Validators.required]));

        this.charterCtrl.setValidators(
            Validators.compose([
                inDropdownListValidator(
                    this.charters,
                    nameof<CharterDisplayView>('charterCode'),
                ),
            ]),
        );

        this.costTypeCtrl.setValidators(
            Validators.compose([
                inDropdownListValidator(
                    this.masterData.costTypes,
                    nameof<CostType>('costTypeCode'),
                ),
            ]),
        );

        this.nominalAccountCtrl.setValidators(
            Validators.compose([
                inDropdownListValidator(
                    this.nominalAccountListWithOnlyBankAccount,
                    nameof<NominalAccount>('nominalAccountNumberFormated'),
                ),
            ]),
        );

        this.costTypeCtrl.setValidators(
            Validators.compose([Validators.required]),
        );

        this.amountCtrl.setValidators(
            Validators.compose([isPositive(), Validators.required, isGreatherThanZero()]),
        );

        this.docRefCtrl.setValidators(
            Validators.compose([Validators.maxLength(20)]),
        );

        this.docDateCtrl.setValidators(
            Validators.compose([Validators.required]),
        );

        this.valueDateCtrl.setValidators(
            Validators.compose([Validators.required]),
        );

        this.nominalAccountCtrl.setValidators(
            Validators.compose([Validators.required]));
    }

    ngOnDestroy(): void {
        if (this.documentInfoDefaultSubscription) {
            this.documentInfoDefaultSubscription.unsubscribe();
        }
    }
    onCurrencyValueEntered(selectedCurrency: Currency) {
        this.currencySearchValue.emit({
            currency: selectedCurrency.currencyCode,
            currencyRoeType: selectedCurrency.roeType,
        });
        this.currencyChangeStatus = true;
        this.currencyChangeValue.emit({
            currencyStatus: this.currencyChangeStatus,
            currency: selectedCurrency.currencyCode,
        });
    }

    onAmountValueEntered() {
        this.amountValue = ConvertToNumber(this.amountCtrl.value);
        this.cashAmountValue = ConvertToNumber(this.amountCtrl.value);

        if (this.amountValue === 0) {
            this.amountCtrl.patchValue('');
        }
        this.amountSearchValue.emit({ amount: this.amountValue });
    }

    onDepartmentValueEntered(departmentValue) {
        this.departmentValue = this.departmentCodeCtrl.value;
        this.departmentSearchValue.emit({ department: this.departmentValue });
    }

    getFormGroup() {
        this.formGroup = this.formBuilder.group(
            {
                currencyCtrl: this.currencyCtrl,
                amountCtrl: this.amountCtrl,
                departmentCodeCtrl: this.departmentCodeCtrl,
                bankCtrl: this.bankCtrl,
                docRefCtrl: this.docRefCtrl,
                docDateCtrl: this.docDateCtrl,
                valueDateCtrl: this.valueDateCtrl,
                charterCtrl: this.charterCtrl,
                costTypeCtrl: this.costTypeCtrl,
                nominalAccountCtrl: this.nominalAccountCtrl,
                accountDescriptionCtrl: this.accountDescriptionCtrl,
            },
            {
                validator: Validators.compose([
                    dateAfter('valueDateCtrl', 'docDateCtrl'),
                    isGreaterThanNinetyDays('docDateCtrl', 'valueDateCtrl'),
                ]),
            },
        );
        return super.getFormGroup();
    }

    populateEntity(entity: any): any {
        const docInformation = entity as CashRecord;
        if (docInformation.childCashTypeId === CashSelectionType.PaymentDifferentCurrency ||
            docInformation.childCashTypeId === CashSelectionType.ReceiptDifferentCurrency) {
            docInformation.matchingCurrency = this.currencyCtrl.value;
        } else {
            docInformation.currencyCode = this.currencyCtrl.value;
        }

        docInformation.amount = this.amountCtrl.value;
        const department = this.getDepartmentDetail(this.masterData, (this.departmentCodeCtrl.value as Department).departmentId, true);

        if (department && department.length > 0) {
            docInformation.departmentId = department[0].departmentId;
        }
        docInformation.counterpartyDocumentReference = this.docRefCtrl.value;
        docInformation.clientBankAccount = this.bankCtrl.value;
        docInformation.documentDate = this.docDateCtrl.value;
        docInformation.valueDate = this.valueDateCtrl.value;
        docInformation.charterId = this.getCharterId(this.charterCtrl.value);
        docInformation.costTypeCode = this.costTypeCtrl.value;
        docInformation.charterReference = (this.charterCtrl.value as Charter).charterCode;
        docInformation.bankAccountCode = this.bankCtrl.value;
        const nominalDetail = this.getNominalAccountDetails(this.nominalAccountCtrl.value, false);
        if (nominalDetail) {
            docInformation.nominalAccountCode = nominalDetail.accountNumber;
        }
        return docInformation;
    }

    getCharterId(value: Charter) {
        const commonMethod = new CommonMethods();
        if (value) {
            if (this.charters && this.charters.length > 0) {
                return commonMethod.getCharterIdFromCharterList(value.charterCode, this.charters);
            } else {
                this.charterDataLoader.getData().subscribe((charter) => {
                    this.charters = charter;
                    return commonMethod.getCharterIdFromCharterList(value.charterCode, this.charters);
                });
            }
        }
    }

    initForm(entity: CashRecord, isEdit: boolean): any {
        this.model = entity;
        this.cashTransactionId = entity.cashTypeId;
        this.filterCurrencies();
        this.isEdit = isEdit;
        if (this.model.valueDate) {
            this.valueDateCtrl.setValue(this.model.valueDate);
        }
        if (this.model.documentDate) {
            this.docDateCtrl.setValue(this.model.documentDate);
        }
        this.amountCtrl.setValue(this.commonMethods.getFormattedNumberValue(this.model.amount));
        this.amountOriginalCurrencyCtrl.patchValue(this.commonMethods.getFormattedNumberValue(this.model.matchingAmount));

        this.cashAmountValue = this.amountCtrl.value;

        let selectedCurrency: Currency;
        if (this.model.cashTypeId === CashSelectionType.PaymentDifferentCurrency ||
            this.model.cashTypeId === CashSelectionType.ReceiptDifferentCurrency) {
            selectedCurrency = this.masterData.currencies.find(
                (currency) => currency.currencyCode === this.model.matchingCurrency);
        } else {
            selectedCurrency = this.masterData.currencies.find(
                (currency) => currency.currencyCode === this.model.currencyCode);
        }

        this.currencyCtrl.setValue(selectedCurrency.currencyCode);
        this.bankCtrl.patchValue(this.model.bankAccountCode);
        const department = this.getDepartmentDetail(this.masterData, this.model.departmentId, true);

        if (department && department.length > 0) {
            this.departmentCodeCtrl.patchValue(department[0].departmentCode);
        }

        this.docRefCtrl.setValue(this.model.counterpartyDocumentReference);
        if (this.model.charterId) {
            if (!this.charters) {
                this.charterDataLoader.getData().subscribe((charter) => {
                    this.charters = charter;
                    if (this.charters) {
                        this.populateCharter(this.model.charterId);
                    }
                });
            } else {
                this.populateCharter(this.model.charterId);
            }
        }
        if (this.model.nominalAccountCode) {
            const nominalCode = this.getNominalAccountDetails(this.model.nominalAccountCode, true);
            if (nominalCode) {
                this.nominalAccountCtrl.patchValue(nominalCode.nominalAccountNumberFormated);
                this.accountDescriptionCtrl.patchValue(nominalCode.detailedDescription);
            }
        }

        let costType: CostType;
        if (this.model.costTypeCode) {
            costType = this.masterData.costTypes.find(
                (cost) => cost.costTypeCode === this.model.costTypeCode);
        }
        this.costTypeCtrl.setValue(costType);

        if (!isEdit) {
            this.formGroup.disable();
        }
        // hide amount field for receipt diff ccy
        this.isDiffCurrency = (this.model.cashTypeId === CashSelectionType.ReceiptDifferentCurrency
            || this.model.cashTypeId === CashSelectionType.PaymentDifferentCurrency)
            ? true : false;

        return entity;
    }

    populateCharter(charterId: number) {
        const filteredCharters = this.charters.filter((item) => item.charterId === charterId);
        if (filteredCharters.length > 0) {
            this.charterCtrl.patchValue(
                filteredCharters[0]);
        }
    }

    bindSelectedTransactionValue(value: number) {
        this.cashTransactionId = value;
        return value;
    }

    getDepartmentDetail(masterData: MasterData, value: any, filterOnId: boolean) {
        const department = masterData.departments.filter((item) =>
            filterOnId ? item.departmentId === value : item.departmentCode === value);

        if (department.length > 0) {
            return department;
        }
    }

    getNominalAccountDetails(code: any, fetchFromAccountCode: boolean): NominalAccount {
        if (code) {
            const nominalCode = this.nominalAccountListWithOnlyBankAccount.find(
                (e) =>
                    (fetchFromAccountCode ? e.accountNumber === code

                        : e.nominalAccountNumberFormated === code.toString()),
            );
            if (nominalCode) {
                return nominalCode;
            }
        }
    }

    onDepartmentCodeSelected(departmentCode: string) {
        const selectedDepartments = this.masterData.departments.filter(
            (department) => department.departmentCode === departmentCode,
        );
        if (selectedDepartments.length > 0) {
            this.departmentValue = selectedDepartments[0].departmentId;
        }
    }
    getDescriptionOfAccount(value: NominalAccount) {
        const accountDetails = this.masterData.nominalAccounts.find(
            (item) => item.accountNumber === value.accountNumber,
        );
        if (accountDetails) {
            this.nominalAccountCtrl.patchValue(accountDetails.nominalAccountNumberFormated);
            this.accountDescriptionCtrl.patchValue(accountDetails.detailedDescription);
        }
    }

    onCharterSelected(charter: Charter) {
    }

    // populate charterlist to charter contexual search
    populateCharterList() {

        if (this.filteredCharters && this.filteredCharters.length > 0) {
            this.bindCharterControl();
        } else {
            this.charterDataLoader.getData().subscribe((charter) => {
                this.charters = charter.sort
                    ((a, b) => (a.charterCode > b.charterCode) ? 1 : -1);
                this.filteredCharters = this.charters;
                this.bindCharterControl();
            });
        }
    }

    bindCharterControl() {
        this.charterCtrl.valueChanges.subscribe((input) => {
            this.filteredCharters = this.utilService.filterListforAutocomplete(
                input,
                this.charters,
                ['charterCode', 'description'],
            );
        });
        if (this.charterCtrl.valid) {
            this.onCharterSelected(
                this.charterCtrl.value,
            );
        }
        this.setValidators();
    }

    // Emit the selected currency in pick trxn screen for cash Payment.
    // to filter client bank account based on selected currecny and counterparty.
    // in counterprty information component
    currencyValueChangeInPickTransactionScreen() {
        this.currencyChangeStatus = true;
        this.currencyChangeValue.emit({
            currencyStatus: this.currencyChangeStatus,
            currency: this.currencyValue,
            paymentCurrency: this.paymentCurrency,
        });
    }

    bindDepartmentControl(departmentId: number) {
        const department = this.getDepartmentDetail(this.masterData, departmentId, true);

        if (department && department.length > 0) {
            this.departmentCodeCtrl.patchValue(department[0]);
        }
    }

    setDocAmountForCashReceiptDiffCurrency(amount) {
        this.amountOriginalCurrency = amount;
        this.amountOriginalCurrencyCtrl.patchValue(this.commonMethods.getFormattedNumberValue(this.amountOriginalCurrency));
    }

}
