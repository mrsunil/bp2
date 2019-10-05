import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BaseFormComponent } from '../../../../../shared/components/base-form-component/base-form-component.component';
import { AtlasFormControl } from '../../../../../shared/entities/atlas-form-control';
import { CounterpartyBankAccounts } from '../../../../../shared/entities/counterparty-bankaccounts.entity';
import { MasterData } from '../../../../../shared/entities/masterdata.entity';
import { CashRecord } from '../../../../../shared/services/execution/dtos/cash-record';
import { FormConfigurationProviderService } from '../../../../../shared/services/form-configuration-provider.service';
import { MasterdataService } from '../../../../../shared/services/http-services/masterdata.service';

@Component({
    selector: 'atlas-bank-information',
    templateUrl: './bank-information.component.html',
    styleUrls: ['./bank-information.component.scss'],
})
export class BankInformationComponent extends BaseFormComponent implements OnInit, OnDestroy {
    masterData: MasterData;
    bankCountryCtrl = new AtlasFormControl('BankAccount');
    bankCityCtrl = new AtlasFormControl('BankCity');
    bankSwiftCodeCtrl = new AtlasFormControl('BankSwiftCode');
    nccCtrl = new AtlasFormControl('NCC');
    ncsCtrl = new AtlasFormControl('NCS');
    bankBranchCtrl = new AtlasFormControl('BankBranch');
    bankZIPCodeCtrl = new AtlasFormControl('BankZIPCode');
    bankAccountDescriptionCtrl = new AtlasFormControl('BankAccountDescription');
    accountNoCtrl = new AtlasFormControl('AccountNo');
    accountCurrencyCtrl = new AtlasFormControl('AccountCurrency');
    externalReferenceCtrl = new AtlasFormControl('ExternalReference');
    bankTypeCtrl = new AtlasFormControl('BankType');
    bankAccountStatusCtrl = new AtlasFormControl('BankAccount');
    isEdit: boolean;

    filteredCounterPartyBankAccounts: CounterpartyBankAccounts[];

    constructor(
        protected formConfigurationProvider: FormConfigurationProviderService,
        private route: ActivatedRoute,
        protected masterdataService: MasterdataService,
        protected formBuilder: FormBuilder,
    ) {
        super(formConfigurationProvider);
    }

    ngOnInit() {
        this.masterData = this.route.snapshot.data.masterdata;

        this.formGroup = this.formBuilder.group({
            bankCountryCtrl: this.bankCountryCtrl,
            bankCityCtrl: this.bankCityCtrl,
            bankSwiftCodeCtrl: this.bankSwiftCodeCtrl,
            nccCtrl: this.nccCtrl,
            ncsCtrl: this.ncsCtrl,
            bankBranchCtrl: this.bankBranchCtrl,
            bankZIPCodeCtrl: this.bankZIPCodeCtrl,
            bankAccountDescriptionCtrl: this.bankAccountDescriptionCtrl,
            accountNoCtrl: this.accountNoCtrl,
            accountCurrencyCtrl: this.accountCurrencyCtrl,
            externalReferenceCtrl: this.externalReferenceCtrl,
            bankTypeCtrl: this.bankTypeCtrl,
            bankAccountStatusCtrl: this.bankAccountStatusCtrl,
        });
    }

    initForm(entity: CashRecord, isEdit: boolean): any {
        this.isEdit = isEdit;

        if (!isEdit) {
            this.formGroup.disable();
        }
    }

    setClientBankInformation(clientBankId: number, counterpartyId: number, currencyCode: string) {
        if (counterpartyId && currencyCode) {
            this.resetClientBankInformation();
            this.masterdataService.getCounterPartyBankAccounts(counterpartyId, currencyCode)
                .subscribe((data) => {
                    if (data.value && data.value.length > 0) {

                        const bankDetails = data.value.find((e) => e.bankAccountId === Number(clientBankId));
                        if (bankDetails) {
                            const bankCountry = this.masterData.countries.find((e) => e.countryId === bankDetails.bankCountryKey);

                            const bankType = this.masterData.bankTypes.find((e) => e.enumEntityId === bankDetails.bankTypeID);

                            const bankAccountStatus = this.masterData.bankAccountStatuses.find((e) => e.enumEntityId === bankDetails.bankAccountStatusID);

                            this.bankCountryCtrl.patchValue(bankCountry && bankCountry.description);
                            this.bankCityCtrl.patchValue(bankDetails.bankCity);
                            this.bankSwiftCodeCtrl.patchValue(bankDetails.bankSwiftCode);
                            this.nccCtrl.patchValue(bankDetails.nCC);
                            this.bankBranchCtrl.patchValue(bankDetails.bankBranch);
                            this.bankZIPCodeCtrl.patchValue(bankDetails.bankZIPCode);
                            this.bankAccountDescriptionCtrl.patchValue(bankDetails.bankAccountDesc);
                            this.accountNoCtrl.patchValue(bankDetails.accountNo);
                            this.accountCurrencyCtrl.patchValue(bankDetails.accountCCY);
                            this.externalReferenceCtrl.patchValue(bankDetails.externalReference);
                            this.bankTypeCtrl.patchValue(bankType && bankType.enumEntityValue);
                            this.bankAccountStatusCtrl.patchValue(bankAccountStatus && bankAccountStatus.enumEntityValue);
                            this.formGroup.disable();
                        }
                    }
                });
        }
    }

    resetClientBankInformation() {
        this.formGroup.reset();
    }
}
