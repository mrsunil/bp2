import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BaseFormComponent } from '../../../../../shared/components/base-form-component/base-form-component.component';
import { inDropdownListValidator } from '../../../../../shared/directives/autocomplete-dropdown.directive';
import { AtlasFormControl } from '../../../../../shared/entities/atlas-form-control';
import { Company } from '../../../../../shared/entities/company.entity';
import { DefaultAccountingSetup } from '../../../../../shared/entities/default-accounting-setup.entity';
import { FxDealDetail } from '../../../../../shared/entities/fxdeal-detail.entity';
import { FxDealRoeType } from '../../../../../shared/entities/fxdeal-roe-type.entity';
import { MasterData } from '../../../../../shared/entities/masterdata.entity';
import { NominalAccount } from '../../../../../shared/entities/nominal-account.entity';
import { SpotRoeType } from '../../../../../shared/enums/spot-roe-type.enum';
import { FourDigitsDecimalNegativeNumberMask } from '../../../../../shared/numberMask';
import { FormConfigurationProviderService } from '../../../../../shared/services/form-configuration-provider.service';
import { ConfigurationService } from '../../../../../shared/services/http-services/configuration.service';
import { nameof, UtilService } from '../../../../../shared/services/util.service';

@Component({
    selector: 'atlas-rate-entry',
    templateUrl: './rate-entry-form.component.html',
    styleUrls: ['./rate-entry-form.component.scss'],
})

export class RateEntryComponent extends BaseFormComponent implements OnInit {
    spotROECtrl = new AtlasFormControl('SpotROE');
    fwPointsCtrl = new AtlasFormControl('FwPoints');
    mdCtrl = new AtlasFormControl('Md');
    dealNominalAccountCtrl = new AtlasFormControl('DealNominalAccount');
    settledNominalAccountCtrl = new AtlasFormControl('SettledNominalAccount');
    ndfAgreedRateCtrl = new AtlasFormControl('NdfAgreedRate');
    ndfAgreedDateCtrl = new AtlasFormControl('NdfAgreedDate');
    nominalAccounts: NominalAccount[];
    filteredSettledNominalAccounts: NominalAccount[];
    filteredDealtNominalAccounts: NominalAccount[];
    filteredNominalAccounts: NominalAccount[];
    filteredRoeTypes: FxDealRoeType[];
    roeTypes: FxDealRoeType[];
    masterdata: MasterData;
    defaultNominalAccountDeal: string;
    defaultNominalAccountSettlement: string;
    company: string;
    filteredCompany: Company[];
    mask = FourDigitsDecimalNegativeNumberMask();
    tradedROEValue: number;
    settledAmount: number;
    fxRateValue: number;
    isWarningDisplay: boolean = false;
    ndfChange: boolean = true;

    @Output() readonly valueSelected = new EventEmitter<number>();
    @Output() readonly roeTypeSelected = new EventEmitter<number>();
    @Output() readonly settledAmountValuePassed = new EventEmitter<number>();

    dealNominalAccountErrorMap: Map<string, string> = new Map()

        .set('required', 'Required *')
        .set('inDropdownList', 'Invalid entry. Department not in the list or not authorized.');

    settledNominalAccountErrorMap: Map<string, string> = new Map()
        .set('required', 'Required *')
        .set('inDropdownList', 'Invalid entry. Department not in the list or not authorized.');

    spotRoeErrorMap: Map<string, string> = new Map()
        .set('required', 'Required *');

    constructor(protected utilService: UtilService,
        protected formBuilder: FormBuilder,
        protected route: ActivatedRoute,
        protected formConfigurationProvider: FormConfigurationProviderService,
        protected configurationService: ConfigurationService) {
        super(formConfigurationProvider);
    }

    ngOnInit() {
        this.ndfAgreedDateCtrl.disable();
        this.masterdata = this.route.snapshot.data.masterdata;
        this.filteredNominalAccounts = this.masterdata.nominalAccounts.filter((e) => e.bankAccount === true);
        this.filteredNominalAccounts = this.filteredNominalAccounts.map(
            (nominal) => {
                nominal.accountNumber = nominal.accountNumber;
                nominal.mainAccountTitle = nominal.shortDescription;
                return nominal;
            });
        this.company = this.route.snapshot.paramMap.get('company');

        this.filteredSettledNominalAccounts = this.filteredNominalAccounts;
        this.filteredDealtNominalAccounts = this.filteredNominalAccounts;

        this.getRoeTypes();

        this.filteredRoeTypes = this.roeTypes;
        this.mdCtrl.valueChanges.subscribe((input) => {
            this.filteredRoeTypes =
                this.utilService.filterListforAutocomplete(
                    input,
                    this.roeTypes,
                    ['code', 'description']);
        });

        this.dealNominalAccountCtrl.valueChanges.subscribe((input) => {
            this.filteredDealtNominalAccounts = this.utilService.filterListforAutocomplete(
                input,
                this.filteredNominalAccounts,
                ['accountNumber', 'mainAccountTitle'],
            );
        });

        this.settledNominalAccountCtrl.valueChanges.subscribe((input) => {
            this.filteredSettledNominalAccounts = this.utilService.filterListforAutocomplete(
                input,
                this.filteredNominalAccounts,
                ['accountNumber', 'mainAccountTitle'],
            );
        });

        this.filteredCompany = this.masterdata.companies;

        this.setValidators();

        if (this.route.snapshot.data.isCreate) {
        this.getDefaultNominalAccount();
        }
    }

    getDefaultNominalAccount() {
        this.configurationService.getDefaultAccounting(this.company)
            .subscribe((defaultAccountingResult: DefaultAccountingSetup) => {
                if (defaultAccountingResult) {

                    const dealAccountItem = this.filteredNominalAccounts.find((x) => x.accountNumber
                        === defaultAccountingResult.dealNominalAccount);

                    const settlementAccountItem = this.filteredNominalAccounts.find((x) => x.accountNumber
                        === defaultAccountingResult.settlementNominalAccount);

                    this.defaultNominalAccountDeal = dealAccountItem ? dealAccountItem.accountNumber : null;
                    this.defaultNominalAccountSettlement = settlementAccountItem ? settlementAccountItem.accountNumber : null;

                    this.dealNominalAccountCtrl.setValue(this.defaultNominalAccountDeal);
                    this.settledNominalAccountCtrl.setValue(this.defaultNominalAccountSettlement);

                }
            });
    }

    getRoeTypes() {
        this.roeTypes = [];
        const FxDealRoeTypeM: FxDealRoeType = { code: 'M', description: 'M' };
        this.roeTypes.push(FxDealRoeTypeM);
        const FxDealRoeTypeD: FxDealRoeType = { code: 'D', description: 'D' };
        this.roeTypes.push(FxDealRoeTypeD);
    }

    setValidators() {
        this.spotROECtrl.setValidators(Validators.required);
        this.settledNominalAccountCtrl.setValidators(
            Validators.compose([Validators.required,
            inDropdownListValidator(
                this.masterdata.nominalAccounts,
                nameof<NominalAccount>('accountNumber'),
            ),
            ]),
        );

        this.dealNominalAccountCtrl.setValidators(
            Validators.compose([Validators.required,
            inDropdownListValidator(
                this.masterdata.nominalAccounts,
                nameof<NominalAccount>('accountNumber'),
            ),
            ]),
        );

        this.mdCtrl.setValidators(
            Validators.compose([Validators.required,
            inDropdownListValidator(
                this.roeTypes,
                nameof<FxDealRoeType>('code'),
            ),
            ]),
        );
    }

    getFormGroup() {
        this.formGroup = this.formBuilder.group({
            dealNominalAccountCtrl: this.dealNominalAccountCtrl,
            fwPointsCtrl: this.fwPointsCtrl,
            mdCtrl: this.mdCtrl,
            spotROECtrl: this.spotROECtrl,
            settledNominalAccountCtrl: this.settledNominalAccountCtrl,
            ndfAgreedRateCtrl: this.ndfAgreedRateCtrl,
            ndfAgreedDateCtrl: this.ndfAgreedDateCtrl,
        });
        return super.getFormGroup();
    }

    initForm(fxDealDetail: FxDealDetail, isEdit: boolean) {
        if (fxDealDetail) {
            if (!isEdit) {
                this.disableFields();
            }
            this.spotROECtrl.patchValue(fxDealDetail.spotRate);
            this.fwPointsCtrl.patchValue(fxDealDetail.fwPoints);
            this.ndfAgreedRateCtrl.patchValue(fxDealDetail.ndfAgreedRate);
            this.ndfAgreedDateCtrl.patchValue(fxDealDetail.ndfAgreedDate);
            this.mdCtrl.patchValue(fxDealDetail.spotRateType);
            if (fxDealDetail.spotRate) {
                const spotROEValue = this.getFinalValue(fxDealDetail.spotRate.toString());
                const fwPointsValue = this.getFinalValue(fxDealDetail.fwPoints.toString());
                const amountValue = this.getFinalValue(fxDealDetail.amount.toString());

                this.tradedROEValue = spotROEValue + fwPointsValue;
                if (this.tradedROEValue) {
                    this.valueSelected.emit(this.tradedROEValue);
                    if (fxDealDetail.amount && fxDealDetail.spotRateType) {
                        if (fxDealDetail.spotRateType === SpotRoeType.Division) {

                            this.settledAmount = amountValue / this.tradedROEValue;
                        } else {
                            this.settledAmount = amountValue * this.tradedROEValue;
                        }

                        this.settledAmountValuePassed.emit(this.settledAmount);
                    }
                }
            }
            if (fxDealDetail.nominalAccountId) {
                const nominalAccount = this.filteredNominalAccounts.find((value) => value.nominalAccountId === fxDealDetail.nominalAccountId).accountNumber;
                if (nominalAccount) {
                    this.dealNominalAccountCtrl.patchValue(nominalAccount);
                }
            }

            if (fxDealDetail.settlementNominalAccountId) {
                const settlementAccount = this.filteredSettledNominalAccounts.find((value) => value.nominalAccountId === fxDealDetail.settlementNominalAccountId).accountNumber;
                if (settlementAccount) {
                    this.settledNominalAccountCtrl.patchValue(settlementAccount);
                }
            }

        }
    }

    disableFields() {
        this.spotROECtrl.disable();
        this.fwPointsCtrl.disable();
        this.ndfAgreedRateCtrl.disable();
        this.ndfAgreedDateCtrl.disable();
        this.mdCtrl.disable();
        this.dealNominalAccountCtrl.disable();
        this.settledNominalAccountCtrl.disable();
    }

    populateEntity(model: FxDealDetail) {
        model.spotRate = this.spotROECtrl.value;
        model.spotRateType = this.mdCtrl.value;
        model.fwPoints = this.fwPointsCtrl.value;
        if (!model.fwPoints) {
            model.fwPoints = 0;
        }
        model.ndfAgreedRate = this.ndfAgreedRateCtrl.value;
        model.ndfAgreedDate = this.ndfAgreedDateCtrl.value;
        if (!model.isEditMode) {
            if (this.dealNominalAccountCtrl.value.accountNumber) {
                model.nominalAccountId = this.getAccountId(this.dealNominalAccountCtrl.value.accountNumber);
            } else {
                model.nominalAccountId = this.getAccountId(this.dealNominalAccountCtrl.value);
            }
            if (this.settledNominalAccountCtrl.value.accountNumber) {
                model.settlementNominalAccountId = this.getAccountId(this.settledNominalAccountCtrl.value.accountNumber);
            } else {
                model.settlementNominalAccountId = this.getAccountId(this.settledNominalAccountCtrl.value);
            }
        } else {
            if (this.dealNominalAccountCtrl.value.accountNumber) {
                model.nominalAccountId = this.getAccountId(this.dealNominalAccountCtrl.value.accountNumber);
            } else {
                model.nominalAccountId = this.getAccountId(this.dealNominalAccountCtrl.value);
            }

            if (this.settledNominalAccountCtrl.value.accountNumber) {
                model.settlementNominalAccountId = this.getAccountId(this.settledNominalAccountCtrl.value.accountNumber);
            } else {
                model.settlementNominalAccountId = this.getAccountId(this.settledNominalAccountCtrl.value);
            }
        }
    }

    getAccountId(code: string): number {
        const selectedId = this.masterdata.nominalAccounts.find(
            (accountId) => accountId.accountNumber === code,
        );
        if (selectedId) {
            return selectedId.nominalAccountId;
        }
        return null;
    }

    displayMD(code: string): string {
        if (code) {
            const selectedMD = this.filteredRoeTypes.find((md) => md.code === code);
            if (selectedMD) {
                return selectedMD.description;
            }
        }
        return '';
    }

    onTradedROECalculation() {
        if (this.spotROECtrl.value) {

            const spotRoeValue = this.getFinalValue(this.spotROECtrl.value);
            this.checkWarningMessage(spotRoeValue);

            if (!this.fwPointsCtrl.value) {
                this.tradedROEValue = spotRoeValue;
            } else {
                const fwPointsValue = this.getFinalValue(this.fwPointsCtrl.value);
                this.tradedROEValue = spotRoeValue + fwPointsValue;
            }

            this.valueSelected.emit(this.tradedROEValue);
        }
    }

    onSettledAmountCalculation(targetValue) {
        if (this.mdCtrl.valid) {
            this.roeTypeSelected.emit(targetValue);
        }
    }

    checkWarningMessage(spotRoeValue: number) {
        if (spotRoeValue && this.fxRateValue) {
            let value = spotRoeValue - this.fxRateValue;
            if (value < 0) {
                value = Math.abs(value);
            }

            const fxRate = 0.05 * this.fxRateValue;
            this.isWarningDisplay = false;

            if (value > fxRate) {
                this.isWarningDisplay = true;
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
