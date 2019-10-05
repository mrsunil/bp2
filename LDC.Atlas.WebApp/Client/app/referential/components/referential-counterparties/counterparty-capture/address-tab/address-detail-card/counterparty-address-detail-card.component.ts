import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { AtlasFormControl } from '../../../../../../shared/entities/atlas-form-control';
import { FormBuilder, Validators } from '@angular/forms';
import { FormConfigurationProviderService } from '../../../../../../shared/services/form-configuration-provider.service';
import { BaseFormComponent } from '../../../../../../shared/components/base-form-component/base-form-component.component';
import { CounterpartyAddress } from '../../../../../../shared/entities/counterparty-address.entity';
import { ConfirmationDialogComponent } from '../../../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material';
import { SnackbarService } from '../../../../../../shared/services/snackbar.service';
import { inDropdownListValidator } from '../../../../../../shared/directives/autocomplete-dropdown.directive';
import { nameof, UtilService } from '../../../../../../shared/services/util.service';
import { MasterdataService } from '../../../../../../shared/services/http-services/masterdata.service';
import { MasterDataProps } from '../../../../../../shared/entities/masterdata-props.entity';
import { MasterData } from '../../../../../../shared/entities/masterdata.entity';
import { Province } from '../../../../../../shared/entities/province.entity';
import { Country } from '../../../../../../shared/entities/country.entity';
import { LdcRegion } from '../../../../../../shared/entities/ldc-region.entity';
import { AddressType } from '../../../../../../shared/entities/address-type.entity';

@Component({
    selector: 'atlas-counterparty-address-detail-card',
    templateUrl: './counterparty-address-detail-card.component.html',
    styleUrls: ['./counterparty-address-detail-card.component.scss']
})
export class CounterpartyAddressDetailCardComponent extends BaseFormComponent implements OnInit {
    @Output() readonly cancelAddress = new EventEmitter<any>();
    displayMessage: string = 'Start by selecting one';
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
    counterpartyAddress: CounterpartyAddress;
    addressData: CounterpartyAddress;
    isCreateOrEdit: boolean = false;
    @Output() readonly addedNewAddress = new EventEmitter();
    masterdata: MasterData;
    filteredProvince: Province[];
    filteredCountry: Country[];
    filteredLdcRegion: LdcRegion[];
    isNewAddress: boolean = true;
    @Input() addressListLength: number;
    @Output() addressDeleted = new EventEmitter<CounterpartyAddress>();
    newAddressForm: boolean = false;
    editAddress: boolean = false;
    @Input() counterPartyId: number;
    isDeactivated: boolean = false;
    isDeleteDisabled: boolean = false;
    filteredAddressType: AddressType[];
    @Input() isViewMode: boolean = false;
    isDeleted: boolean = false;
    masterdataList: string[] = [
        MasterDataProps.Province,
        MasterDataProps.Ports,
        MasterDataProps.ContractTerms,
        MasterDataProps.AddressTypes,
        MasterDataProps.LdcRegion,
    ];

    constructor(protected formBuilder: FormBuilder,
        protected formConfigurationProvider: FormConfigurationProviderService,
        protected dialog: MatDialog,
        private snackbarService: SnackbarService,
        protected utilService: UtilService,
        protected masterdataService: MasterdataService, ) {
        super(formConfigurationProvider);
    }
    ngOnInit() {
        this.masterdataService
            .getMasterData(this.masterdataList)
            .subscribe((data) => {
                this.masterdata = data;

                this.filteredAddressType = this.masterdata.addressTypes;
                this.addressTypeCodeCtrl.valueChanges.subscribe((input) => {

                    this.filteredAddressType = this.utilService.filterListforAutocomplete(
                        input,
                        this.masterdata.addressTypes,
                        ['enumEntityId', 'enumEntityValue'],
                    );
                });

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

                this.filteredLdcRegion = this.masterdata.regions;
                this.ldcRegionCtrl.valueChanges.subscribe((input) => {

                    this.filteredLdcRegion = this.utilService.filterListforAutocomplete(
                        input,
                        this.masterdata.regions,
                        ['ldcRegionId', 'description'],
                    );
                });

                this.setValidators();

            });

        this.addressTypeNameCtrl.disable();
    }

    initializeValues(counterpartyAddresses: CounterpartyAddress, deletionFlag: boolean) {
        this.addressData = counterpartyAddresses;
        if (counterpartyAddresses.randomId) {
            this.isNewAddress = false;
        }
        this.addressTypeNameCtrl.setValue(counterpartyAddresses.addresTypeName);
        this.address1Ctrl.setValue(counterpartyAddresses.address1);
        this.address2Ctrl.setValue(counterpartyAddresses.address2);
        this.zipCodeCtrl.setValue(counterpartyAddresses.zipCode);
        this.cityCtrl.setValue(counterpartyAddresses.city);
        if (counterpartyAddresses.provinceID) {
            this.provinceCtrl.setValue(this.filteredProvince.find((province) => province.provinceId === counterpartyAddresses.provinceID).description);
        }
        if (counterpartyAddresses.countryID) {
            this.countryCtrl.setValue(this.filteredCountry.find((country) => country.countryId === counterpartyAddresses.countryID).description);
        }
        this.emailCtrl.setValue(counterpartyAddresses.mail);
        this.phoneNumberCtrl.setValue(counterpartyAddresses.phoneNo);
        this.faxNumberCtrl.setValue(counterpartyAddresses.faxNo);
        if (counterpartyAddresses.addressTypeID) {
            this.addressTypeCodeCtrl.setValue(this.filteredAddressType.find((addressType) => addressType.enumEntityId === counterpartyAddresses.addressTypeID).enumEntityValue);
        }
        if (counterpartyAddresses.ldcRegionId) {
            this.ldcRegionCtrl.setValue(this.filteredLdcRegion.find((region) => region.ldcRegionId === counterpartyAddresses.ldcRegionId).description);
        }

        if (deletionFlag = true) {
            this.newAddressForm = false;
        }
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
            addressTypeCodeCtrl: this.addressTypeCodeCtrl
        });

        return super.getFormGroup();
    }

    numberValidation(event: any) {
        const pattern = /[0-9]/;
        let inputChar = String.fromCharCode(event.charCode);
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
                    nameof<LdcRegion>('description'),
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

        this.addressTypeCodeCtrl.setValidators(
            Validators.compose([
                Validators.required,
                inDropdownListValidator(
                    this.masterdata.addressTypes,
                    nameof<AddressType>('enumEntityValue'),
                ),
            ]),
        );
    }

    onSelectionChanged(event: any) {
        const addressType = this.masterdata.addressTypes.find(
            (addType) => addType.enumEntityValue === event.option.value,
        );
        if (addressType) {
            this.addressTypeNameCtrl.patchValue(addressType.enumEntityValue);
        }
        else {
            this.addressTypeNameCtrl.patchValue('');
        }
    }

    onDeleteButtonClicked() {
        const confirmDialog = this.dialog.open(ConfirmationDialogComponent, {
            data: {
                title: 'Discard Changes',
                text: 'Do you confirm the deletion of the address ' + this.addressTypeCodeCtrl.value,
                okButton: 'Yes',
                cancelButton: 'Cancel',
            },
        });
        confirmDialog.afterClosed().subscribe(
            (answer) => {
                if (answer) {
                    this.addressDeleted.emit(this.addressData);
                    this.formGroup.reset();
                    this.newAddressForm = false;
                    this.editAddress = false;
                }
            });
    }

    onSaveButtonClicked() {
        if (this.formGroup.valid) {
            let address = <CounterpartyAddress>{
                isDeactivated: this.isDeactivated,
                counterpartyId: this.counterPartyId,
                addressId: this.addressData ? this.addressData.addressId : null,
                randomId: this.isNewAddress ? this.addressListLength + 1 : this.addressData.randomId,
                addresTypeName: this.addressTypeNameCtrl.value,
                address1: this.address1Ctrl.value,
                address2: this.address2Ctrl.value,
                city: this.cityCtrl.value,
                countryID: this.countryCtrl.value ? this.filteredCountry.find((country) => country.description === this.countryCtrl.value).countryId : '',
                faxNo: this.faxNumberCtrl.value,
                mail: this.emailCtrl.value,
                phoneNo: this.phoneNumberCtrl.value,
                provinceID: this.provinceCtrl.value ? this.filteredProvince.find((province) => province.description === this.provinceCtrl.value).provinceId : '',
                zipCode: this.zipCodeCtrl.value,
                ldcRegionId: this.ldcRegionCtrl.value ? this.filteredLdcRegion.find((ldcRegion) => ldcRegion.description === this.ldcRegionCtrl.value).ldcRegionId : '',
                addressTypeID: this.addressTypeCodeCtrl.value ? this.filteredAddressType.find((addressType) => addressType.enumEntityValue === this.addressTypeCodeCtrl.value).enumEntityId : '',
                addressTypeCode: this.addressTypeCodeCtrl.value,
                isDeleted: this.isDeleted,
                main: false,
            };
            this.addedNewAddress.emit(address);
            this.isNewAddress = true;
            this.newAddressForm = false;
            this.editAddress = false;
            this.formGroup.reset();
        }
        else {
            this.snackbarService.throwErrorSnackBar(
                'Form is invalid. Please resolve the errors.',
            );
            return;
        }
    }

    onCancelButtonClicked() {
        this.formGroup.reset();
        this.newAddressForm = false;
        this.editAddress = false;
        this.cancelAddress.emit();
    }

}
