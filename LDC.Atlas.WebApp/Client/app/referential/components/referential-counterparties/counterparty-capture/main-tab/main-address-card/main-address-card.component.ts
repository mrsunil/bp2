import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { BaseFormComponent } from '../../../../../../shared/components/base-form-component/base-form-component.component';
import { inDropdownListValidator } from '../../../../../../shared/directives/autocomplete-dropdown.directive';
import { AddressType } from '../../../../../../shared/entities/address-type.entity';
import { AtlasFormControl } from '../../../../../../shared/entities/atlas-form-control';
import { CounterpartyAddress } from '../../../../../../shared/entities/counterparty-address.entity';
import { Counterparty } from '../../../../../../shared/entities/counterparty.entity';
import { Country } from '../../../../../../shared/entities/country.entity';
import { LdcRegion } from '../../../../../../shared/entities/ldc-region.entity';
import { MasterDataProps } from '../../../../../../shared/entities/masterdata-props.entity';
import { MasterData } from '../../../../../../shared/entities/masterdata.entity';
import { Province } from '../../../../../../shared/entities/province.entity';
import { FormConfigurationProviderService } from '../../../../../../shared/services/form-configuration-provider.service';
import { MasterdataService } from '../../../../../../shared/services/http-services/masterdata.service';
import { SnackbarService } from '../../../../../../shared/services/snackbar.service';
import { nameof, UtilService } from '../../../../../../shared/services/util.service';

@Component({
    selector: 'atlas-main-address-card',
    templateUrl: './main-address-card.component.html',
    styleUrls: ['./main-address-card.component.scss'],
})
export class MainAddressCardComponent extends BaseFormComponent implements OnInit {
    addressTypeNameCtrl = new AtlasFormControl('addressTypeNameCtrl');
    address1Ctrl = new AtlasFormControl('address1Ctrl');
    address2Ctrl = new AtlasFormControl('address2Ctrl');
    zipCodeCtrl = new AtlasFormControl('zipCodeCtrl');
    cityCtrl = new AtlasFormControl('cityCtrl');
    provinceCtrl = new AtlasFormControl('provinceCtrl');
    countryCtrl = new AtlasFormControl('countryCtrl');
    emailCtrl = new AtlasFormControl('emailCtrl');
    phoneNumberCtrl = new AtlasFormControl('phoneNumberCtrl');
    faxNumberCtrl = new AtlasFormControl('faxNumberCtrl');
    ldcRegionCtrl = new AtlasFormControl('ldcRegionCtrl');
    addressTypeCodeCtrl = new AtlasFormControl('addressTypeCodeCtrl');
    filteredProvince: Province[];
    filteredCountry: Country[];
    filteredLdcRegion: LdcRegion[];
    filteredAddressType: AddressType[];
    masterdata: MasterData;
    masterdataList: string[] = [
        MasterDataProps.Province,
        MasterDataProps.Ports,
        MasterDataProps.ContractTerms,
        MasterDataProps.AddressTypes,
    ];

    constructor(protected formBuilder: FormBuilder,
        protected formConfigurationProvider: FormConfigurationProviderService,
        protected dialog: MatDialog,
        private route: ActivatedRoute,
        private snackbarService: SnackbarService,
        protected utilService: UtilService,
        protected masterdataService: MasterdataService) {
        super(formConfigurationProvider);
    }

    ngOnInit() {
        this.masterdataService
            .getMasterData(this.masterdataList)
            .subscribe((data) => {
                this.masterdata = data;

                this.filteredProvince = this.masterdata.provinces;
                this.provinceCtrl.valueChanges.subscribe((input) => {

                    this.filteredProvince = this.utilService.filterListforAutocomplete(
                        input,
                        this.masterdata.provinces,
                        ['provinceId', 'description'],
                    );
                });

                this.filteredCountry = this.masterdata.countries;
                this.countryCtrl.valueChanges.subscribe((input) => {

                    this.filteredCountry = this.utilService.filterListforAutocomplete(
                        input,
                        this.masterdata.countries,
                        ['countryId', 'description'],
                    );
                });
                this.filteredAddressType = this.masterdata.addressTypes;
                this.addressTypeCodeCtrl.valueChanges.subscribe((input) => {

                    this.filteredAddressType = this.utilService.filterListforAutocomplete(
                        input,
                        this.masterdata.addressTypes,
                        ['enumEntityId', 'enumEntityValue'],
                    );
                });

                this.filteredLdcRegion = this.masterdata.regions;
                this.ldcRegionCtrl.valueChanges.subscribe((input) => {

                    this.filteredLdcRegion = this.utilService.filterListforAutocomplete(
                        input,
                        this.masterdata.regions,
                        ['ldcRegionCode', 'description'],
                    );
                });

                this.setValidators();

            });

        this.addressTypeNameCtrl.disable();

    }

    getFormGroup() {
        this.formGroup = this.formBuilder.group({
            addressTypeNameCtrl: this.addressTypeNameCtrl,
            address1Ctrl: this.address1Ctrl,
            address2Ctrl: this.address2Ctrl,
            zipCodeCtrl: this.zipCodeCtrl,
            cityCtrl: this.cityCtrl,
            provinceCtrl: this.provinceCtrl,
            countryCtrl: this.countryCtrl,
            emailCtrl: this.emailCtrl,
            phoneNumberCtrl: this.phoneNumberCtrl,
            faxNumberCtrl: this.faxNumberCtrl,
            ldcRegionCtrl: this.ldcRegionCtrl,
            addressTypeCodeCtrl: this.addressTypeCodeCtrl,
        });

        return super.getFormGroup();
    }

    numberValidation(event: any) {
        const pattern = /[0-9]/;
        const inputChar = String.fromCharCode(event.charCode);
        if (!pattern.test(inputChar)) {
            event.preventDefault();
        }
    }

    setValidators() {
        this.provinceCtrl.setValidators(
            Validators.compose([
                Validators.required,
                inDropdownListValidator(
                    this.masterdata.provinces,
                    nameof<Province>('description'),
                ),
            ]),
        );

        this.countryCtrl.setValidators(
            Validators.compose([
                Validators.required,
                inDropdownListValidator(
                    this.masterdata.countries,
                    nameof<Country>('description'),
                ),
            ]),
        );

        this.ldcRegionCtrl.setValidators(
            Validators.compose([
                Validators.required,
                inDropdownListValidator(
                    this.masterdata.regions,
                    nameof<LdcRegion>('ldcRegionCode'),
                ),
            ]),
        );

        this.addressTypeCodeCtrl.setValidators(
            Validators.compose([
                Validators.required,
                inDropdownListValidator(
                    this.masterdata.addressTypes,
                    nameof<AddressType>('enumEntityValue'),
                ),
            ]),
        );

        this.address1Ctrl.setValidators(
            Validators.compose([Validators.maxLength(60)]),
        );

        this.address2Ctrl.setValidators(
            Validators.compose([Validators.maxLength(60)]),
        );

        this.cityCtrl.setValidators(
            Validators.compose([Validators.maxLength(60)]),
        );

        this.zipCodeCtrl.setValidators(
            Validators.compose([Validators.maxLength(40)]),
        );

        this.emailCtrl.setValidators(Validators.compose
            ([Validators.email, Validators.maxLength(40)]),
        );

        this.faxNumberCtrl.setValidators(Validators.compose
            ([Validators.maxLength(40)]),
        );

        this.phoneNumberCtrl.setValidators(Validators.compose
            ([Validators.maxLength(10)]),
        );

        this.formGroup.updateValueAndValidity();
    }

    onSelectionChanged(event: any) {
        const addressType = this.masterdata.addressTypes.find(
            (addType) => addType.enumEntityValue === event.option.value,
        );
        if (addressType) {
            this.addressTypeNameCtrl.patchValue(addressType.enumEntityValue);
        } else {
            this.addressTypeNameCtrl.patchValue('');
        }
    }

    getCountryId(name: string): number {
        if (name) {
            const country = this.masterdata.countries.find(
                (cn) => cn.description === name,
            );

            if (country) {
                return country.countryId;
            }
        }
        return 0;
    }

    getAddressTypeCodeId(name: string): number {
        if (name) {
            const addressType = this.masterdata.addressTypes.find(
                (cn) => cn.enumEntityValue === name,
            );

            if (addressType) {
                return addressType.enumEntityId;
            }
        }
        return 0;
    }

    getLdcRegionId(name: string): number {
        if (name) {
            const ldcRegion = this.masterdata.regions.find(
                (cn) => cn.description === name,
            );

            if (ldcRegion) {
                return ldcRegion.ldcRegionId;
            }
        }
        return 0;
    }

    getProvinceId(name: string): number {
        if (name) {
            const province = this.masterdata.provinces.find(
                (p) => p.description === name,
            );

            if (province) {
                return province.provinceId;
            }
        }
        return 0;
    }

    updateEntity(model: Counterparty, mainAddress: any) {
        const counterpartyAddress: CounterpartyAddress = {} as CounterpartyAddress;
        counterpartyAddress.address1 = this.address1Ctrl.value;
        counterpartyAddress.address2 = this.address2Ctrl.value;
        counterpartyAddress.addressTypeID = this.getAddressTypeCodeId(this.addressTypeCodeCtrl.value);
        counterpartyAddress.addresTypeName = this.addressTypeNameCtrl.value;
        counterpartyAddress.zipCode = this.zipCodeCtrl.value;
        counterpartyAddress.city = this.cityCtrl.value;
        counterpartyAddress.provinceID = this.getProvinceId(this.provinceCtrl.value);
        counterpartyAddress.countryID = this.getCountryId(this.countryCtrl.value);
        counterpartyAddress.mail = this.emailCtrl.value;
        counterpartyAddress.phoneNo = this.phoneNumberCtrl.value;
        counterpartyAddress.faxNo = this.faxNumberCtrl.value;
        counterpartyAddress.ldcRegionId = this.getLdcRegionId(this.ldcRegionCtrl.value);
        counterpartyAddress.main = true;
        if (mainAddress) {
            counterpartyAddress.addressId = mainAddress.addressId;
            counterpartyAddress.randomId = mainAddress.randomId;
        }

        model.countryId = this.getCountryId(this.countryCtrl.value);
        model.provinceId = this.getProvinceId(this.provinceCtrl.value);

        model.counterpartyAddresses.push(counterpartyAddress);
    }

    populateValues(model: CounterpartyAddress) {
        this.masterdata = this.route.snapshot.data.masterdata;
        this.filteredLdcRegion = this.masterdata.regions;
        this.filteredAddressType = this.masterdata.addressTypes;

        if (model.ldcRegionId) {
            const ldcRegion = this.filteredLdcRegion.find((region) => region.ldcRegionId === model.ldcRegionId);
            if (ldcRegion) {
                model.ldcRegionCode = ldcRegion.ldcRegionCode;
            }
        }

        if (model.addressTypeID) {
            const address = this.filteredAddressType.find((addressType) => addressType.enumEntityId === model.addressTypeID);
            if (address) {
                model.addressTypeCode = address.enumEntityValue;
            }
        }
    }
}
