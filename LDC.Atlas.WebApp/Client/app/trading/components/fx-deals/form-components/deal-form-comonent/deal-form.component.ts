import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { AtlasFormControl } from '../../../../../shared/entities/atlas-form-control';
import { Validators, FormBuilder } from '@angular/forms';
import { FxDealDirection } from '../../../../../shared/enums/fx-deals-direction.enum';
import { Currency } from '../../../../../shared/entities/currency.entity';
import { UtilService, nameof } from '../../../../../shared/services/util.service';
import { ActivatedRoute } from '@angular/router';
import { inDropdownListValidator } from '../../../../../shared/directives/autocomplete-dropdown.directive';
import { FormConfigurationProviderService } from '../../../../../shared/services/form-configuration-provider.service';
import { BaseFormComponent } from '../../../../../shared/components/base-form-component/base-form-component.component';
import { FxDealDetail } from '../../../../../shared/entities/fxdeal-detail.entity';
import { TwoDigitsDecimalNumberMask, FourDigitsDecimalNegativeNumberMask, ConvertToNumber } from '../../../../../shared/numberMask';
import { isGreatherThanZero } from '../../../../../shared/directives/number-validators.directive';
import { ForeignExchangeService } from '../../../../../shared/services/http-services/foreign-exchange.service';
import { CompanyManagerService } from '../../../../../core/services/company-manager.service';
import { Company } from '../../../../../shared/entities/company.entity';
import { SpotRoeType } from '../../../../../shared/enums/spot-roe-type.enum';

@Component({
    selector: 'atlas-deal-form',
    templateUrl: './deal-form.component.html',
    styleUrls: ['./deal-form.component.scss']
})

export class DealFormComponent extends BaseFormComponent implements OnInit {
    fxDealDirection = FxDealDirection;
    fxDealDirectionCtrl = new AtlasFormControl('fxDealDirection');
    currencyDealtCtrl = new AtlasFormControl('CurrencyDeal');
    tradedROECtrl = new AtlasFormControl('TradedROE');
    settlementCurrencyCtrl = new AtlasFormControl('SettlementCurrency');
    settledAmountCtrl = new AtlasFormControl('SettledAmount');
    dealtAmountCtrl = new AtlasFormControl('DealtAmount');
    dealtFilteredCurrencies: Currency[];
    settlementFilteredCurrency: Currency[];
    masterdata: any;
    dealDirectionId: number = 1;
    isDivideROEType: boolean;
    settledAmount: number;
    dealtRoeType: string;
    settlementRoeType: string;
    dealtExchangeRate: number;
    settlementExchangeRate: number;
    companyConfiguration: Company;
    fxRate: number;
    spotRate: number;
    isEditMode: boolean = false;
    mask = TwoDigitsDecimalNumberMask();
    masked = FourDigitsDecimalNegativeNumberMask();
    @Output() readonly defaultRoeTypeValuePassed = new EventEmitter<string>();
    @Output() readonly fxRateValuePassed = new EventEmitter<number>();
    @Output() readonly spotRoeWarningValuePassed = new EventEmitter<boolean>();

    currencyDealtErrorMap: Map<string, string> = new Map()
        .set('required', 'Required *')
        .set('inDropdownList', 'Invalid entry. Currency not in the list.');

    settlementCurrencyErrorMap: Map<string, string> = new Map()
        .set('required', 'Required *')
        .set('inDropdownList', 'Invalid entry. Currency not in the list.');

    constructor(protected utilService: UtilService,
        protected route: ActivatedRoute,
        protected formConfigurationProvider: FormConfigurationProviderService,
        private foreignExchangeService: ForeignExchangeService,
        private companyManager: CompanyManagerService,
        protected formBuilder: FormBuilder, ) {
        super(formConfigurationProvider);
    }

    ngOnInit() {
        this.masterdata = this.route.snapshot.data.masterdata;
        this.dealtFilteredCurrencies = this.masterdata.currencies;
        this.settlementFilteredCurrency = this.masterdata.currencies;
        if (this.route.snapshot.data.isEdit) {
            this.isEditMode = true;
        }
        this.settlementCurrencyCtrl.valueChanges.subscribe((input) => {
            this.settlementFilteredCurrency =
                this.utilService.filterListforAutocomplete(
                    input,
                    this.masterdata.currencies,
                    ['currencyCode', 'description']);
        });

        this.currencyDealtCtrl.valueChanges.subscribe((input) => {
            this.dealtFilteredCurrencies =
                this.utilService.filterListforAutocomplete(
                    input,
                    this.masterdata.currencies,
                    ['currencyCode', 'description']);
        });
        this.tradedROECtrl.disable();
        this.settledAmountCtrl.disable();
        this.setValidators();
    }

    setValidators() {
        this.dealtAmountCtrl.setValidators(Validators.required);
        this.dealtAmountCtrl.setValidators(
            Validators.compose([isGreatherThanZero()]),
        );

        this.settledAmountCtrl.setValidators(Validators.required);
        this.tradedROECtrl.setValidators(Validators.required);
        this.settlementCurrencyCtrl.setValidators(
            Validators.compose([Validators.required,
            inDropdownListValidator(
                this.masterdata.currencies,
                nameof<Currency>('currencyCode'),
            ),
            ]),
        );

        this.currencyDealtCtrl.setValidators(
            Validators.compose([Validators.required,
            inDropdownListValidator(
                this.masterdata.currencies,
                nameof<Currency>('currencyCode'),
            ),
            ]),
        );
    }

    getFormGroup() {
        this.formGroup = this.formBuilder.group({
            fxDealDirectionCtrl: this.fxDealDirectionCtrl,
            currencyDealtCtrl: this.currencyDealtCtrl,
            tradedROECtrl: this.tradedROECtrl,
            settlementCurrencyCtrl: this.settlementCurrencyCtrl,
            settledAmountCtrl: this.settledAmountCtrl,
            dealtAmountCtrl: this.dealtAmountCtrl,
        });
        return super.getFormGroup();
    }

    initForm(fxDealDetail: FxDealDetail, isEdit: boolean) {
        if (fxDealDetail) {
            this.currencyDealtCtrl.patchValue(fxDealDetail.currencyCode);
            this.settlementCurrencyCtrl.patchValue(fxDealDetail.settlementCurrencyCode);
            this.dealtAmountCtrl.patchValue(fxDealDetail.amount);
            this.fxDealDirectionCtrl.patchValue(fxDealDetail.dealDirectionId);

            if (isEdit) {
                this.spotRate = fxDealDetail.spotRate;

                if (fxDealDetail.currencyCode) {
                    const currency: Currency = <Currency>({ currencyCode: fxDealDetail.currencyCode })
                    this.onDealtRoeTypeValue(currency);
                }

                if (fxDealDetail.settlementCurrencyCode) {
                    const currencyCode: Currency = <Currency>({ currencyCode: fxDealDetail.settlementCurrencyCode })
                    this.onSettlementRoeTypeValue(currencyCode);
                }
            }

            if (!isEdit) {
                this.disableFields();
            }
        }
    }

    hideShowWarningMessage() {
        if (this.fxRate && this.spotRate) {
            let value = this.spotRate - this.fxRate;
            if (value < 0) {
                value = Math.abs(value);
            }
            const fxRate = 0.05 * this.fxRate;
            if (value > fxRate) {
                this.spotRoeWarningValuePassed.emit(true);
            }
            else {
                this.spotRoeWarningValuePassed.emit(false);
            }
        }
    }

    disableFields() {
        this.fxDealDirectionCtrl.disable();
        this.currencyDealtCtrl.disable();
        this.settlementCurrencyCtrl.disable();
        this.dealtAmountCtrl.disable();
        this.tradedROECtrl.disable();
        this.settledAmountCtrl.disable();
    }

    onStatusChanged(event: any) {
        if (event === FxDealDirection.Buy) {
            this.dealDirectionId = 1
        }
        else {
            this.dealDirectionId = 2;
        }
    }

    populateEntity(model: FxDealDetail) {
        model.dealDirectionId = this.dealDirectionId;
        model.amount = this.dealtAmountCtrl.value;
        if (!model.isEditMode) {
            model.currencyCode = this.currencyDealtCtrl.value.currencyCode;
            model.settlementCurrencyCode = this.settlementCurrencyCtrl.value.currencyCode;
        }
        else {
            if (this.currencyDealtCtrl.value.currencyCode) {
                model.departmentId = this.currencyDealtCtrl.value.currencyCode;
            }
            else {
                model.currencyCode = this.currencyDealtCtrl.value;
            }

            if (this.settlementCurrencyCtrl.value.currencyCode) {
                model.settlementCurrencyCode = this.settlementCurrencyCtrl.value.currencyCode;
            }
            else {
                model.settlementCurrencyCode = this.settlementCurrencyCtrl.value;
            }
        }
    }

    onSettledAmountCalculate() {
        if (this.dealtAmountCtrl.value && this.tradedROECtrl.value) {
            var dealtAmountValue = this.getFinalValue(this.dealtAmountCtrl.value.toString());

            if (this.isDivideROEType) {
                this.settledAmount = dealtAmountValue / Number(this.tradedROECtrl.value);
                this.settledAmountCtrl.patchValue(this.settledAmount);
            }
            else {
                this.settledAmount = dealtAmountValue * Number(this.tradedROECtrl.value);
                this.settledAmountCtrl.patchValue(this.settledAmount);
            }
        }
    }
    onDealtRoeTypeValue(value: Currency) {
        if (value.currencyCode) {
            this.foreignExchangeService.getForeignExchangeRate(
                this.companyManager.getCurrentCompanyDate().toDate(),
                value.currencyCode)
                .subscribe((data) => {
                    if (data) {
                        this.dealtExchangeRate = ConvertToNumber(data.rate);
                        this.dealtRoeType = data.currencyRoeType;
                        this.defaultRoeTypeCalculation();
                    }
                });
        }
    }
    onSettlementRoeTypeValue(value: Currency) {
        if (value.currencyCode) {
            this.foreignExchangeService.getForeignExchangeRate(
                this.companyManager.getCurrentCompanyDate().toDate(),
                value.currencyCode)
                .subscribe((data) => {
                    if (data) {
                        this.settlementExchangeRate = ConvertToNumber(data.rate);
                        this.settlementRoeType = data.currencyRoeType;
                        this.defaultRoeTypeCalculation();
                    }
                });
        }
    }
    defaultRoeTypeCalculation() {
        if (this.dealtRoeType && this.settlementRoeType &&
            this.dealtExchangeRate && this.settlementExchangeRate) {

            if (this.dealtRoeType === SpotRoeType.Multiplication &&
                this.settlementRoeType === SpotRoeType.Division) {
                this.defaultRoeTypeValuePassed.emit(this.dealtRoeType);
                this.fxRate = this.dealtExchangeRate * this.settlementExchangeRate;
                this.fxRateValuePassed.emit(this.fxRate);
            }

            if (this.dealtRoeType === SpotRoeType.Division &&
                this.settlementRoeType === SpotRoeType.Multiplication) {
                this.defaultRoeTypeValuePassed.emit(this.dealtRoeType);
                this.fxRate = this.dealtExchangeRate * this.settlementExchangeRate;
                this.fxRateValuePassed.emit(this.fxRate);
            }

            if (this.dealtRoeType === SpotRoeType.Multiplication &&
                this.settlementRoeType === SpotRoeType.Multiplication) {
                this.defaultRoeTypeValuePassed.emit(this.settlementRoeType);
                this.fxRate = this.dealtExchangeRate / this.settlementExchangeRate;
                this.fxRateValuePassed.emit(this.fxRate);
            }

            if (this.dealtRoeType === SpotRoeType.Division &&
                this.settlementRoeType === SpotRoeType.Division) {
                this.defaultRoeTypeValuePassed.emit('M');
                this.fxRate = this.settlementExchangeRate / this.dealtExchangeRate;
                this.fxRateValuePassed.emit(this.fxRate);
            }

            if (this.isEditMode) {
                this.hideShowWarningMessage();
            }
        }
    }

    getFinalValue(value: string): number {
        if (typeof (value) === 'string' && value.indexOf(',') > 0) {
            return Number(value.replace(/,/g, ''));
        }
        if (typeof (value) === 'string' && value.indexOf('_') > 0) {
            return Number(value.replace('_', ''));
        }
        return Number(value);
    }
}

