import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BaseFormComponent } from '../../../../../shared/components/base-form-component/base-form-component.component';
import { inDropdownListValidator } from '../../../../../shared/directives/autocomplete-dropdown.directive';
import { isGreatherThanZero, isPositive } from '../../../../../shared/directives/number-validators.directive';
import { AtlasFormControl } from '../../../../../shared/entities/atlas-form-control';
import { Currency } from '../../../../../shared/entities/currency.entity';
import { MasterData } from '../../../../../shared/entities/masterdata.entity';
import { CashSelectionType } from '../../../../../shared/enums/cash-selection-type';
import { ConvertToNumber, CustomNumberMask } from '../../../../../shared/numberMask';
import { CashMatching } from '../../../../../shared/services/execution/dtos/cash-matching';
import { CashRecord } from '../../../../../shared/services/execution/dtos/cash-record';
import { FormConfigurationProviderService } from '../../../../../shared/services/form-configuration-provider.service';
import { ExecutionService } from '../../../../../shared/services/http-services/execution.service';
import { MasterdataService } from '../../../../../shared/services/http-services/masterdata.service';
import { SnackbarService } from '../../../../../shared/services/snackbar.service';
import { nameof, UtilService } from '../../../../../shared/services/util.service';
import { CommonMethods } from '../../../../services/execution-cash-common-methods';

@Component({
    selector: 'atlas-currency-information-card',
    templateUrl: './currency-information-card.component.html',
    styleUrls: ['./currency-information-card.component.scss'],
})
export class CurrencyInformationCardComponent extends BaseFormComponent implements OnInit {
    @Output() readonly roeTypeSelected = new EventEmitter<any>();
    @Output() readonly fxRateEntered = new EventEmitter<any>();
    @Output() readonly bankCurrencySelected = new EventEmitter<any>();
    @Output() readonly amountSearchValue = new EventEmitter<any>();
    bankCurrencyCtrl = new AtlasFormControl('Currency');
    fxRateCtrl = new AtlasFormControl('FXRate');
    divideMultiplyCtrl = new AtlasFormControl('Divide');
    multiplyCtrl = new AtlasFormControl('Multiply');
    amountCtrl = new AtlasFormControl('Amount');
    fxRateValue: number;
    bankCurrencyValue: string;
    currencyChangeStatus: boolean;
    filteredCurrencyList: Currency[];
    masterData: MasterData;
    cashTypeId: number;
    company: string;
    isFxRateValid: boolean = false;
    currencyValue: string;
    currencyRoeType: string;
    finalFxRate: number;
    roeType: string;
    tolarence: number;
    cashSelectionModel: CashMatching;
    actualFxrateValue: number;
    cashTransactionId: number;
    currencyFrom: string;
    currencyTo: string;

    mask = CustomNumberMask(12, 10, false);
    amount: number;
    isEditable: boolean;

    bankCurrencyErrorMap: Map<string, string> = new Map();
    fxRateErrorMap: Map<string, string> = new Map();
    amountErrorMap: Map<string, string> = new Map();
    commonMethods: any;

    constructor(protected formConfigurationProvider: FormConfigurationProviderService,
        protected formBuilder: FormBuilder,
        protected masterdataService: MasterdataService,
        protected utilService: UtilService,
        private snackbarService: SnackbarService,
        private executionService: ExecutionService,
        private route: ActivatedRoute,
    ) {
        super(formConfigurationProvider);
        this.cashTypeId = Number(decodeURIComponent(this.route.snapshot.paramMap.get('cashTypeId')));
        this.bankCurrencyErrorMap.set('required', ' Required *');
        this.fxRateErrorMap.set('required', ' Required *');
        this.amountErrorMap.set('required', ' Required *')
            .set('isPositiveError', 'Amount must be positive')
            .set('isGreatherThanZeroError', 'Amount must be greater than zero');
    }

    ngOnInit() {
        this.company = this.route.snapshot.paramMap.get('company');
        this.masterData = this.route.snapshot.data.masterdata;
        this.setValidators();
        this.bindConfiguration();
        this.filterBankCurrencies();
        this.isEditable = false;
        this.commonMethods = new CommonMethods();
    }

    filterBankCurrencies() {
        let bankCurrencyList: Currency[] = [];

        if (this.currencyValue) {
            this.filteredCurrencyList = this.masterData.currencies.filter(
                (item) => item.currencyCode !== this.currencyValue,
            );
        } else {
            this.filteredCurrencyList = this.masterData.currencies;
        }

        bankCurrencyList = this.filteredCurrencyList;
        this.bankCurrencyCtrl.valueChanges.subscribe((input) => {
            this.filteredCurrencyList = this.utilService.filterListforAutocomplete(
                input,
                bankCurrencyList,
                ['currencyCode', 'description'],
            );
            if (this.bankCurrencyCtrl.valid) {
                this.onBankCurrencyEntered(this.bankCurrencyCtrl.value);
            }
        });
    }
    onBankCurrencyEntered(bankCurrency: Currency) {
        if (!bankCurrency) {
            return;
        }
        this.bankCurrencyValue = bankCurrency.currencyCode;

        if (this.currencyValue === bankCurrency.currencyCode) {
            this.snackbarService.throwErrorSnackBar('Both the currencies cannot be USD');
            this.bankCurrencyCtrl.reset();
            this.fxRateCtrl.reset();
        } else if (this.currencyValue !== 'USD' && bankCurrency.currencyCode !== 'USD') {
            this.snackbarService.throwErrorSnackBar('One of the currency Must be USD');
            this.bankCurrencyCtrl.reset();
        } else {
            this.currencyFrom = this.currencyValue;
            this.currencyTo = (this.bankCurrencyCtrl.value as Currency).currencyCode;

            if (!this.isEditable) {
                this.executionService.getForeignExchangeRateByCurrency(this.currencyFrom, this.currencyTo).subscribe((data) => {
                    if (data) {
                        this.cashSelectionModel = data;

                        this.fxRateCtrl.setValue(this.cashSelectionModel.rate);
                        this.divideMultiplyCtrl.patchValue(this.cashSelectionModel.roeType);
                        this.roeType = this.cashSelectionModel.roeType;
                        this.actualFxrateValue = ConvertToNumber(this.fxRateCtrl.value);
                        this.tolarence = this.fxRateCtrl.value * 0.1;
                        this.bankCurrencySelected.emit({
                            bankCurrency: this.bankCurrencyValue,
                            initialFxRate: this.actualFxrateValue,
                            initialRoeType: this.roeType,
                        });
                        this.isFxRateValid = ConvertToNumber(this.amountCtrl.value) > 0 ? true : false;
                    } else {
                        this.fxRateCtrl.reset();
                        this.divideMultiplyCtrl.reset();
                        this.amountCtrl.reset();
                        this.snackbarService.throwErrorSnackBar('FX Rate details not available for these currencies.');
                    }
                });
            }
            // in edit mode, once all model data is binde to controls , than user can select different currency
            // this can be done by changing flag value to false; which enable new service call for different ccy to select.
            this.isEditable = false;
        }
    }

    onDivideMultiplyToggleChanges(type) {
        if (this.roeType === 'D') {
            this.roeType = 'M';
            this.roeTypeSelected.emit({ finalRoeType: this.roeType });
        } else if (this.roeType === 'M') {
            this.roeType = 'D';
            this.roeTypeSelected.emit({ finalRoeType: this.roeType });
        }
    }
    setValidators() {
        this.bankCurrencyCtrl.setValidators(
            Validators.compose([
                inDropdownListValidator(
                    this.masterData.currencies,
                    nameof<Currency>('currencyCode'),
                ),
            ]),
        );
        this.fxRateCtrl.setValidators(
            Validators.compose([Validators.required]));

        this.amountCtrl.setValidators(
            Validators.compose([isPositive(), Validators.required, isGreatherThanZero()]),
        );
    }
    bindCurrencyValues() {
        const currency = this.masterData.currencies.filter(
            (item) => item.currencyCode === this.bankCurrencyValue,
        );
        this.formGroup.patchValue({
            bankCurrencyCtrl: currency[0],
            fxRateCtrl: this.fxRateValue,
            amountCtrl: this.commonMethods.getFormattedNumberValue(this.amount),
        });
        this.bankCurrencyCtrl.disable();
        this.fxRateCtrl.disable();
        this.divideMultiplyCtrl.disable();
        this.amountCtrl.disable();
    }
    onDivideOptionSelected() {
        if (this.roeType === 'D') {
            return true;
        } else { return false; }
    }
    onMultiplyOptionSelected() {
        if (this.roeType === 'M') {
            return true;
        } else {
            return false;
        }
    }
    onFxRateEntered(event) {
        const tolerance = (this.actualFxrateValue * 0.1);
        const minFxRate = this.actualFxrateValue - tolerance;
        const maxFxRate = this.actualFxrateValue + tolerance;
        const updatedFxRate = this.fxRateCtrl.value;
        this.isFxRateValid = (this.fxRateCtrl.value !== '' && this.fxRateCtrl.value > 0)
            ? true : false;

        if ((updatedFxRate > maxFxRate) || (updatedFxRate < minFxRate)) {
            this.isFxRateValid = false;
            this.snackbarService.throwErrorSnackBar(
                'FX Rate difference should be within 10% threshold.',
            );
        } else {
            this.isFxRateValid = true;
        }
        this.finalFxRate = this.fxRateCtrl.value;
        this.fxRateEntered.emit({ finalFxRate: this.finalFxRate });
    }

    getFormGroup() {
        this.formGroup = this.formBuilder.group({
            bankCurrencyCtrl: this.bankCurrencyCtrl,
            fxRateCtrl: this.fxRateCtrl,
            divideMultiplyCtrl: this.divideMultiplyCtrl,
            amountCtrl: this.amountCtrl,
        });
        return super.getFormGroup();
    }

    populateEntity(entity: CashRecord): CashRecord {
        if (entity.childCashTypeId === CashSelectionType.ReceiptDifferentCurrency
            || entity.childCashTypeId === CashSelectionType.PaymentDifferentCurrency) {
            entity.currencyCode = (this.bankCurrencyCtrl.value as Currency).currencyCode;
            entity.matchingRate = this.fxRateCtrl.value;
            entity.matchingRateType = this.divideMultiplyCtrl.value;
            entity.amount = this.amountCtrl.value;
        }
        return entity;
    }

    initForm(entity: CashRecord, isEdit: boolean): any {
        if (entity.cashTypeId === CashSelectionType.PaymentDifferentCurrency ||
            entity.cashTypeId === CashSelectionType.ReceiptDifferentCurrency) {
            this.currencyValue = entity.matchingCurrency;
            this.filterBankCurrencies();
            this.bankCurrencyCtrl.patchValue(entity.currencyCode);
            this.fxRateCtrl.patchValue(entity.matchingRate);
            this.divideMultiplyCtrl.patchValue(entity.matchingRateType);
            this.amountCtrl.patchValue(this.commonMethods.getFormattedNumberValue(entity.amount));
            this.bankCurrencySelected.emit({
                bankCurrency: entity.currencyCode,
                initialFxRate: entity.matchingRate,
                initialRoeType: entity.matchingRateType,
            });
        }
        if (!isEdit) {
            this.formGroup.disable();
        }
        // this is used to avoid service call while in display/edit mode
        this.isEditable = true;
        return entity;
    }

    onAmountValueEntered(amount) {
        if (this.amountCtrl.value) {
            this.amount = ConvertToNumber(this.amountCtrl.value);
            if (this.amount === 0) {
                this.amountCtrl.patchValue('');
            }
            this.isFxRateValid = this.amount > 0 ? true : false;
            this.amountSearchValue.emit({ amount: this.amount });
        }
    }
}
