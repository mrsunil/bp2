import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import * as _moment from 'moment';
import { conformToMask } from 'text-mask-core';
import { AuthorizationService } from '../../../../../core/services/authorization.service';
import { CompanyManagerService } from '../../../../../core/services/company-manager.service';
import { BaseFormComponent } from '../../../../../shared/components/base-form-component/base-form-component.component';
import { inDropdownListValidator } from '../../../../../shared/directives/autocomplete-dropdown.directive';
import { isPositive } from '../../../../../shared/directives/number-validators.directive';
import { AtlasFormControl } from '../../../../../shared/entities/atlas-form-control';
import { Commodity } from '../../../../../shared/entities/commodity.entity';
import { Currency } from '../../../../../shared/entities/currency.entity';
import { MasterDataProps } from '../../../../../shared/entities/masterdata-props.entity';
import { MasterData } from '../../../../../shared/entities/masterdata.entity';
import { PaymentTerm } from '../../../../../shared/entities/payment-term.entity';
import { PriceUnit } from '../../../../../shared/entities/price-unit.entity';
import { WeightUnit } from '../../../../../shared/entities/weight-unit.entity';
import { CreditAgainstTypes } from '../../../../../shared/enums/credit-against-type.enum';
import { DiscountBasis } from '../../../../../shared/enums/discount-basis.enum';
import { DiscountTypes } from '../../../../../shared/enums/discount-type.enum';
import { SectionCompleteDisplayView } from '../../../../../shared/models/section-complete-display-view';
import { CustomNumberMask } from '../../../../../shared/numberMask';
import { FormConfigurationProviderService } from '../../../../../shared/services/form-configuration-provider.service';
import { MasterdataService } from '../../../../../shared/services/http-services/masterdata.service';
import { SecurityService } from '../../../../../shared/services/security.service';
import { nameof, UtilService } from '../../../../../shared/services/util.service';
import { PhysicalFixedPricedContract } from '../../../../entities/physical-fixed-priced-contract.entity';
import { AtlasNumber } from './../../../../../shared/entities/atlas-number.entity';
import { PermissionLevels } from './../../../../../shared/enums/permission-level.enum';
import { PaymentTermsDataLoader } from './../../../../../shared/services/masterdata/paymentTerms-data-loader';
import { TradeImageField } from './../../../../../shared/services/trading/dtos/tradeImageField';

const moment = _moment;

@Component({
    selector: 'atlas-price-form-component',
    templateUrl: './price-form-component.component.html',
    styleUrls: ['./price-form-component.component.scss'],
    providers: [PaymentTermsDataLoader],
})
export class PriceFormComponent extends BaseFormComponent implements OnInit {
    DiscountType = DiscountTypes;
    DiscountBasis = DiscountBasis;
    selectedDiscPrem: DiscountTypes = undefined; // this variable is used to help unselect the prem/disc toggle

    isShow: boolean = false;
    isEdit: boolean = true;
    model: SectionCompleteDisplayView = new SectionCompleteDisplayView();

    isInputField = false;
    quantityVal;
    weightUnit: WeightUnit;

    currencyVal: any;
    discountPremiumValue: string;
    isTradeImage = false;
    company: string;
    currencyPrivilege: boolean = false;
    priceCodePrivilege: boolean = false;
    contractPricePrivilege: boolean = false;
    contractValuePrivilege: boolean = false;
    paymentTermsPrivilege: boolean = false;
    priceToolTip: any = '';
    contractValueToolTip: any = '';
    currencyCtrl = new AtlasFormControl('CurrencyCode');
    priceUnitIdCtrl = new AtlasFormControl('PricingMethodId');
    contractPriceCtrl = new AtlasFormControl('Price');
    contractValueCtrl = new AtlasFormControl('ContractedValue');
    paymentTermsCtrl = new AtlasFormControl('PaymentTermId');
    paymentTermsDescriptionCtrl = new AtlasFormControl('Description');

    discountPremiumCtrl = new AtlasFormControl('FlatPricePremiumOrDiscount');
    discountPremiumCurrencyCtrl = new AtlasFormControl('PremiumDiscountCurrency');
    discountPremiumTypeCtrl = new AtlasFormControl('Type');
    discountPremiumValueCtrl = new AtlasFormControl('PremiumDiscountValue', isPositive());

    estimatedMaturityDateCtrl = new AtlasFormControl('EstimatedMaturityDate');

    filteredCurrencyList: Currency[];
    filteredPriceCodeList: PriceUnit[];
    filteredPaymentTermsList: PaymentTerm[];
    filteredDiscPremCurrencyList: Currency[];
    tradeImageDetails: TradeImageField[] = [];

    masterdata: MasterData;
    masterdataList: string[] = [
        MasterDataProps.Currencies,
        MasterDataProps.PriceUnits,
        MasterDataProps.PaymentTerms,
    ];

    mask = CustomNumberMask(12, 10, true);

    paymentTermsErrorMap: Map<string, string> = new Map()
        .set('required', 'Payment Term is required')
        .set('inDropdownList', 'Value not in list.');
    isExpanded: boolean = true;
    startPositionMonthType: string = 'start';
    endPositionMonthType: string = 'end';

    constructor(
        protected route: ActivatedRoute,
        protected formBuilder: FormBuilder,
        protected masterdataService: MasterdataService,
        protected utilService: UtilService,
        protected companyManager: CompanyManagerService,
        protected formConfigurationProvider: FormConfigurationProviderService,
        public paymentTermsDataLoader: PaymentTermsDataLoader,
        protected authorizationService: AuthorizationService,
        protected securityService: SecurityService,
    ) {
        super(formConfigurationProvider);
    }

    ngOnInit() {
        this.masterdataService
            .getMasterData(this.masterdataList)
            .subscribe((data) => {
                this.masterdata = data;

                this.filteredCurrencyList = this.masterdata.currencies;
                this.currencyCtrl.valueChanges.subscribe((input) => {
                    this.filteredCurrencyList = this.utilService.filterListforAutocomplete(
                        input,
                        this.masterdata.currencies,
                        ['currencyCode', 'description'],
                    );
                });

                this.filteredPriceCodeList = this.masterdata.priceUnits;
                this.priceUnitIdCtrl.valueChanges.subscribe((input) => {
                    this.filteredPriceCodeList = this.utilService.filterListforAutocomplete(
                        input,
                        this.masterdata.priceUnits,
                        ['priceCode', 'description'],
                    );
                    this.setContractValue();
                });
                const companyDetails = this.companyManager.getCurrentCompany();

                if (companyDetails) {
                this.currencyCtrl.setValue(companyDetails.functionalCurrencyCode);
                }

                this.filteredPaymentTermsList = this.masterdata.paymentTerms;
                this.paymentTermsCtrl.valueChanges.subscribe((input) => {
                    this.filteredPaymentTermsList = this.utilService.filterListforAutocomplete(
                        input,
                        this.masterdata.paymentTerms,
                        ['paymentTermCode', 'description'],
                    );
                    if (this.paymentTermsCtrl.valid || !this.paymentTermsCtrl.value) {
                        this.onPaymentTermSelected(this.paymentTermsCtrl.value);
                    }
                });

                this.filteredDiscPremCurrencyList = this.masterdata.currencies;
                this.discountPremiumCurrencyCtrl.valueChanges.subscribe((input) => {
                    this.filteredDiscPremCurrencyList = this.utilService.filterListforAutocomplete(
                        input,
                        this.masterdata.currencies,
                        ['currencyCode', 'description'],
                    );
                });

                this.setValidators();
                this.bindConfiguration();
            });

        this.contractPriceCtrl.valueChanges.subscribe((v) =>
            this.setContractValue(),
        );
        this.discountPremiumCurrencyCtrl.valueChanges.subscribe((v) =>
            this.setContractValue(),
        );
        this.discountPremiumTypeCtrl.valueChanges.subscribe((v) => this.setContractValue());
        this.discountPremiumValueCtrl.valueChanges.subscribe((v) => this.setContractValue());
        this.currencyCtrl.valueChanges.subscribe((v) => this.setContractValue());
        this.contractValueCtrl.disable({ emitEvent: false });

        if (this.route.snapshot.data['isImage'] === true) {
            this.isTradeImage = true;
        }
        this.checkPriceFormPrivileges();
    }

    setValidators() {
        this.currencyCtrl.setValidators(
            Validators.compose([
                inDropdownListValidator(
                    this.masterdata.currencies,
                    nameof<Currency>('currencyCode'),
                ),
            ]),
        );

        this.priceUnitIdCtrl.setValidators(
            Validators.compose([
                inDropdownListValidator(
                    this.masterdata.priceUnits,
                    nameof<PriceUnit>('priceUnitId'),
                ),
            ]),
        );

        this.contractPriceCtrl.setValidators(
            Validators.compose([isPositive()]),
        );
        this.paymentTermsCtrl.setValidators(
            inDropdownListValidator(
                this.masterdata.paymentTerms,
                nameof<PaymentTerm>('paymentTermCode'),
            ),
        );

        this.discountPremiumCurrencyCtrl.setValidators(Validators.compose([
            inDropdownListValidator(this.masterdata.currencies, nameof<Currency>('currencyCode'))]));
        this.discountPremiumValueCtrl.setValidators(Validators.compose([Validators.min(0)]));

        this.setDiscountPremiumValidators();
    }

    getCurrency(currencyValue) {
        this.currencyVal = currencyValue;
    }

    onPaymentTermSelected(paymentTermCode: PaymentTerm) {
        if (!this.paymentTermsCtrl.valid || !paymentTermCode) {
            if (this.paymentTermsDescriptionCtrl.value) {
                this.paymentTermsDescriptionCtrl.patchValue('');
            }
            return;
        }
        const selectedPaymentTerm = this.masterdata.paymentTerms.find(
            (payTerm) => payTerm.paymentTermCode === paymentTermCode.paymentTermCode,
        );
        if (selectedPaymentTerm) {
            this.paymentTermsDescriptionCtrl.patchValue(
                selectedPaymentTerm.description,
            );

            this.formGroup.updateValueAndValidity();
        }
    }

    setContractValue() {
        if (this.masterdata === undefined) {
            return;
        }

        const weightCodeConversion = this.weightUnit
            ? this.weightUnit.conversionFactor
            : undefined;
        const selectedPriceUnit = this.masterdata.priceUnits.filter(
            (priceUnit) => priceUnit.priceUnitId === this.priceUnitIdCtrl.value,
        );
        const priceCodeConversion =
            selectedPriceUnit.length > 0
                ? selectedPriceUnit[0].conversionFactor
                : undefined;

        if (!weightCodeConversion || !priceCodeConversion
            || !(this.quantityVal || this.quantityVal === 0)
            || !this.contractPriceCtrl.value) {
            this.contractValueCtrl.setValue('');
            return;
        }
        const contractPrice = this.contractPriceCtrl.value.toString().replace(/,/g, '');
        let contractPriceDecimal: AtlasNumber = new AtlasNumber(contractPrice);
        const quantity = this.quantityVal.toString().replace(/,/g, '');
        const quantityDecimal: AtlasNumber = new AtlasNumber(quantity);

        if (this.discountPremiumCtrl.value !== undefined &&
            this.currencyCtrl !== this.discountPremiumCurrencyCtrl &&
            this.selectedDiscPrem !== undefined) {
            // discountPremiumValue exists

            if ((this.discountPremiumCtrl.value && this.selectedDiscPrem) != null) {
                this.isExpanded = true;
            }

            let discountPremiumContractedPrice: number | AtlasNumber = 0;
            const discountPremiumSign = ((this.discountPremiumCtrl.value as DiscountTypes) === DiscountTypes.Discount ? -1 : 1);
            // tslint:disable-next-line:prefer-conditional-expression
            if ((this.discountPremiumTypeCtrl.value as DiscountBasis) === DiscountBasis.Rate) {
                discountPremiumContractedPrice = this.discountPremiumValueCtrl.value * discountPremiumSign;
            } else if ((this.discountPremiumTypeCtrl.value as DiscountBasis) === DiscountBasis.Percent) {
                discountPremiumContractedPrice = contractPriceDecimal.bigNumber.toNumber()
                    * ((this.discountPremiumValueCtrl.value * discountPremiumSign / 100));
            }

            contractPriceDecimal = contractPriceDecimal.plus(discountPremiumContractedPrice);
        }

        const contractValue = contractPriceDecimal.times(quantityDecimal).times(
            weightCodeConversion *
            priceCodeConversion).toString();

        const contractValueFormatted = conformToMask(contractValue, this.mask, { guide: false }).conformedValue;

        this.contractValueCtrl.setValue(contractValueFormatted);
    }

    commodityCodeSelected(commodity: Commodity) {
        if (!this.currencyCtrl.value) {
            this.currencyCtrl.setValue(commodity.currency);
        }
        if (!this.priceUnitIdCtrl.value) {
            this.priceUnitIdCtrl.setValue(commodity.priceUnitId);
        }
        this.currencyCtrl.updateValueAndValidity();
        this.priceUnitIdCtrl.updateValueAndValidity();
    }

    onDiscPremToggleClicked(event) {
        const discountType = event.value as DiscountTypes;
        if (this.selectedDiscPrem !== undefined
            && discountType === this.selectedDiscPrem) {
            this.discountPremiumCtrl.setValue('');
            this.selectedDiscPrem = undefined;
        } else {
            this.selectedDiscPrem = discountType;
        }
        this.setDiscountPremiumValidators();
        this.discountPremiumCurrencyCtrl.reset();
        this.discountPremiumTypeCtrl.reset();
        this.discountPremiumValueCtrl.reset();
    }

    setDiscountPremiumValidators() {
        if (this.selectedDiscPrem || this.selectedDiscPrem === 0) {
            this.discountPremiumCurrencyCtrl.enable();
            this.discountPremiumTypeCtrl.enable();
            this.discountPremiumValueCtrl.enable();

        } else {
            this.discountPremiumCurrencyCtrl.disable();
            this.discountPremiumTypeCtrl.disable();
            this.discountPremiumValueCtrl.disable();
        }
    }

    initForm(entity: any, isEdit: boolean): any {
        this.isEdit = isEdit;
        this.isShow = !isEdit;

        const tradeRecord = new SectionCompleteDisplayView(entity);
        this.model = tradeRecord;
        if (this.model.priceUnitId === 0) {
            this.model.priceUnitId = null;
        }

        if (this.model.priceUnitId != null) {
            this.formGroup.patchValue({ priceUnitIdCtrl: this.model.priceUnitId });
        }
        if (this.model.currency != null) {
            this.formGroup.patchValue({ currencyCtrl: this.model.currency });
        }
        if (this.model.price != null) {
            this.formGroup.patchValue({
                contractPriceCtrl: isEdit ? this.model.price :
                    this.model.price.toFixed(4),
            });
        }

        if (this.model.paymentTerms != null) {
            const selectedPaymentTerm = this.masterdata.paymentTerms.find(
                (paymentTerms) => paymentTerms.paymentTermCode === this.model.paymentTerms,
            );
            if (selectedPaymentTerm) {
                this.filteredPaymentTermsList = [selectedPaymentTerm];
                this.paymentTermsCtrl.patchValue(selectedPaymentTerm);
                this.onPaymentTermSelected(selectedPaymentTerm);
            }
            if (this.model.estimatedMaturityDate) {
                this.estimatedMaturityDateCtrl.setValue(this.model.estimatedMaturityDate);
            } else {
                const creditDays = selectedPaymentTerm ? selectedPaymentTerm.creditDays : null;
                const creditAgainst = selectedPaymentTerm ? selectedPaymentTerm.creditAgainst : null;

                let maturityDate = this.companyManager.getCurrentCompanyDate().toDate();
                switch (creditAgainst) {
                    case CreditAgainstTypes.CurrentDate:
                        maturityDate = this.companyManager.getCurrentCompanyDate().toDate();
                        break;
                    case CreditAgainstTypes.ArrivalDate:
                        maturityDate = new Date(this.model.deliveryPeriodEnd.getTime());
                        break;
                    case CreditAgainstTypes.InvoiceDate:
                        maturityDate = this.model.invoiceDate ?
                            new Date(this.model.invoiceDate) :
                            this.calculateMaturityDateOnShippment();
                        break;
                    default:
                        // Need to call new Date(date) to avoid modifying the blDate when changing maturityDate
                        maturityDate = this.model.blDate ?
                            new Date(this.model.blDate) :
                            this.calculateMaturityDateOnShippment();
                        break;
                }
                maturityDate.setDate(maturityDate.getDate() + creditDays);
                this.estimatedMaturityDateCtrl.setValue(maturityDate);
            }
        }

        if (this.model.premiumDiscountBasis != null) {
            this.discountPremiumTypeCtrl.setValue(this.model.premiumDiscountBasis);
        }

        if (this.model.premiumDiscountCurrency != null) {
            this.discountPremiumCurrencyCtrl.setValue(this.model.premiumDiscountCurrency);
        }

        if (this.model.premiumDiscountValue != null) {
            this.discountPremiumValueCtrl.setValue(this.model.premiumDiscountValue);
        }

        this.selectedDiscPrem = this.model.premiumDiscountTypeId as DiscountTypes;
        this.setDiscountPremiumValidators();

        this.discountPremiumCtrl.setValue(this.model.premiumDiscountTypeId);

        if (this.model.contractedValue || this.model.contractedValue === '0') {

            this.formGroup.patchValue({
                contractValueCtrl: isEdit ?
                    this.formatpriceContractValue(Number(this.removeExponentialIfExist(this.model.contractedValue))) :
                    this.formatContractValue(Number(this.removeExponentialIfExist(this.model.contractedValue))),
            });
        }

        if (!isEdit) {
            this.formGroup.disable({ emitEvent: false });
            this.priceToolTip = this.formatpriceContractValue(this.model.price);
            this.contractValueToolTip = this.formatpriceContractValue(Number(this.model.contractedValue));
        } else if (this.isTradeImage) {
            if (this.tradeImageDetails && this.tradeImageDetails.length > 0) {

                this.handleFieldEditionForImage('CurrencyCode', this.currencyCtrl);
                this.handleFieldEditionForImage('PricingMethodId', this.priceUnitIdCtrl);
                this.handleFieldEditionForImage('Price', this.contractPriceCtrl);
                this.handleFieldEditionForImage('PaymentTermId', this.paymentTermsCtrl);
                this.handleFieldEditionForImage('PremiumDiscountBasis', this.discountPremiumCtrl);

                this.handleCopyForImage('CurrencyCode', [this.currencyCtrl]);
                this.handleCopyForImage('PriceUnitId', [this.priceUnitIdCtrl]);
                this.handleCopyForImage('Price', [this.contractPriceCtrl]);
                this.handleCopyForImage('PaymentTermId', [this.paymentTermsCtrl, this.paymentTermsDescriptionCtrl]);
                this.handleCopyForImage('PremiumDiscountCurrency', [this.discountPremiumCurrencyCtrl]);
                this.handleCopyForImage('PremiumDiscountValue', [this.discountPremiumValueCtrl]);
                this.handleCopyForImage('EstimatedMaturityDate', [this.estimatedMaturityDateCtrl]);
            }

        } else if (this.model.invoiceReference &&
            this.authorizationService.getPermissionLevel(this.company, 'Trades', 'Physicals', 'SuperTradeEdition') <= PermissionLevels.None) {
            this.currencyCtrl.disable({ emitEvent: false });
            this.contractPriceCtrl.disable({ emitEvent: false });
            this.priceUnitIdCtrl.disable({ emitEvent: false });
            this.discountPremiumCtrl.disable({ emitEvent: false });
            this.discountPremiumCurrencyCtrl.disable({ emitEvent: false });
            this.discountPremiumTypeCtrl.disable({ emitEvent: false });
            this.discountPremiumValueCtrl.disable({ emitEvent: false });
        }
        return entity;
    }
    
    handleCopyForImage(fieldName: string, fields: AtlasFormControl[]) {
        const fieldConfig = this.tradeImageDetails.find((e) => e.tradeFieldName === fieldName);
        if (fieldConfig && !fieldConfig.isCopy) {
            fields.forEach((field) => {
                field.patchValue(null);
            });
        }
    }

    handleFieldEditionForImage(fieldName: string, field: AtlasFormControl) {
        const fieldConfig = this.tradeImageDetails.find((e) => e.tradeFieldName === fieldName);
        if (fieldConfig && !fieldConfig.isEdit) {
            field.disable();
        } else {
            field.enable();
        }
    }

    calculateMaturityDateOnShippment() {
        let dateToConsider: Date = new Date();
        if (this.model.positionMonthType.toLowerCase() === this.startPositionMonthType.toLowerCase()) {
            dateToConsider = new Date(this.model.deliveryPeriodStart);
            return moment(dateToConsider.setMonth(dateToConsider.getMonth()
                + this.model.positionMonthIndex)).endOf('month').toDate();
        } else if (this.model.positionMonthType.toLowerCase() === this.endPositionMonthType.toLowerCase()) {
            dateToConsider = new Date(this.model.deliveryPeriodEnd);
            return moment(dateToConsider.setMonth(dateToConsider.getMonth()
                + this.model.positionMonthIndex)).endOf('month').toDate();
        }
    }

    removeExponentialIfExist(value) {
        if (value) {
            const newValue = new AtlasNumber(value);
            return newValue.toString();
        }
        return value;
    }

    formatContractValue(value: number) {
        if (value) {
            return new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
        }
        return value;
    }

    formatpriceContractValue(value: number) {
        if (value) {
            return new Intl.NumberFormat('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 10 }).format(value);
        }
        return value;
    }

    populateEntity(entity: any): any {
        const section = entity as PhysicalFixedPricedContract;

        section.currencyCode = this.currencyCtrl.value;
        section.priceUnitId = ((this.priceUnitIdCtrl.value === '' && !this.priceUnitIdCtrl.isRequired) ? 0 : this.priceUnitIdCtrl.value);

        section.price = ((this.contractPriceCtrl.value === '' && !this.contractPriceCtrl.isRequired) ? 0 : this.contractPriceCtrl.value);
        section.contractedValue = this.contractValueCtrl.value ? this.contractValueCtrl.value : 0;
        const paymentTermCode: PaymentTerm = this.paymentTermsCtrl.value;
        section.paymentTerms = paymentTermCode ? paymentTermCode.paymentTermCode : null;

        section.discountPremiumCurrency = this.discountPremiumCurrencyCtrl.value;
        section.discountPremiumType = (this.selectedDiscPrem !== undefined) ? (this.discountPremiumCtrl.value as DiscountTypes) : null;
        section.discountPremiumBasis = this.discountPremiumTypeCtrl.value ? this.discountPremiumTypeCtrl.value : null;
        section.discountPremiumValue = this.discountPremiumValueCtrl.value ? this.discountPremiumValueCtrl.value : null;
        section.estimatedMaturityDate = this.estimatedMaturityDateCtrl.value ? this.estimatedMaturityDateCtrl.value : null;
        section.invoiceDate = this.model.invoiceDate;
        return section;
    }

    getFormGroup() {
        this.formGroup = this.formBuilder.group({
            currencyCtrl: this.currencyCtrl,
            priceUnitIdCtrl: this.priceUnitIdCtrl,
            contractPriceCtrl: this.contractPriceCtrl,
            contractValueCtrl: this.contractValueCtrl,
            paymentTermsCtrl: this.paymentTermsCtrl,
            paymentTermsDescriptionCtrl: this.paymentTermsDescriptionCtrl,
            discountPremiumCtrl: this.discountPremiumCtrl,
            discountPremiumcurrencyCtrl: this.discountPremiumCurrencyCtrl,
            discountPremiumtypeCtrl: this.discountPremiumTypeCtrl,
            discountPremiumvalueCtrl: this.discountPremiumValueCtrl,
            estimatedMaturityDateCtrl: this.estimatedMaturityDateCtrl,
        });

        return super.getFormGroup();
    }

    displayPriceUnit(priceUnitId: number): string {
        if (priceUnitId) {
            const selectedUnit = this.masterdata.priceUnits.filter(
                (priceUnit) => priceUnit.priceUnitId === priceUnitId,
            );

            if (selectedUnit.length > 0) {
                return selectedUnit[0].priceCode;
            }
        }

        return '';
    }
    checkPriceFormPrivileges() {
        this.company = this.route.snapshot.paramMap.get('company');
        this.securityService.isSecurityReady().subscribe(() => {
            if (this.authorizationService.isPrivilegeAllowed(this.company, 'Trades')
                && this.authorizationService.isPrivilegeAllowed(this.company, 'MainTab')) {
                this.currencyPrivilege = this.authorizationService.isPrivilegeAllowed(this.company, 'Currency');
                this.priceCodePrivilege = this.authorizationService.isPrivilegeAllowed(this.company, 'PriceCode');
                this.contractPricePrivilege = this.authorizationService.isPrivilegeAllowed(this.company, 'ContractPrice');
                this.contractValuePrivilege = this.authorizationService.isPrivilegeAllowed(this.company, 'ContractValue');
                this.paymentTermsPrivilege = this.authorizationService.isPrivilegeAllowed(this.company, 'PaymentTerms');
            }
        });
        if (!this.currencyPrivilege) {
            this.currencyCtrl.disable();
        }
        if (!this.priceCodePrivilege) {
            this.priceUnitIdCtrl.disable();
        }
        if (!this.contractPricePrivilege) {
            this.contractPriceCtrl.disable();
        }
        if (!this.contractValuePrivilege) {
            this.contractValueCtrl.disable();
        }
        if (!this.paymentTermsPrivilege) {
            this.paymentTermsCtrl.disable();
            this.paymentTermsDescriptionCtrl.disable();
        }

    }
    onPanelClicked() {
        this.isExpanded = !this.isExpanded;
    }
}
