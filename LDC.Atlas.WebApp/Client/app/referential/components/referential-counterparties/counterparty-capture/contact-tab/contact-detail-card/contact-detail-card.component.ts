import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { AtlasFormControl } from '../../../../../../shared/entities/atlas-form-control'
import { BaseFormComponent } from '../../../../../../shared/components/base-form-component/base-form-component.component'
import { FormBuilder, Validators } from '@angular/forms';
import { FormConfigurationProviderService } from '../../../../../../shared/services/form-configuration-provider.service'
import { Contact } from '../../../../../../shared/entities/contact.entity';
import { TitleDesignation } from '../../../../../../shared/enums/title-designation';
import { TitleDesignationTypes } from '../../../../../../shared/entities/title-designation.entity';
import { SnackbarService } from '../../../../../../shared/services/snackbar.service'
import { ConfirmationDialogComponent } from '../../../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material';
import { UtilService, nameof } from '../../../../../../shared/services/util.service';
import { MasterdataService } from '../../../../../../shared/services/http-services/masterdata.service';
import { MasterDataProps } from '../../../../../../shared/entities/masterdata-props.entity';
import { MasterData } from '../../../../../../shared/entities/masterdata.entity';
import { Country } from '../../../../../../shared/entities/country.entity';
import { inDropdownListValidator } from '../../../../../../shared/directives/autocomplete-dropdown.directive'

@Component({
    selector: 'atlas-counterparty-contact-detail-card',
    templateUrl: './contact-detail-card.component.html',
    styleUrls: ['./contact-detail-card.component.scss']
})
export class ContactDetailCardComponent extends BaseFormComponent implements OnInit {
    @Output() readonly cancelContact = new EventEmitter<any>();
    contactNameCtrl = new AtlasFormControl('ContactName');
    titleDesignationCtrl = new AtlasFormControl('TitleDesignation');
    surNameCtrl = new AtlasFormControl('SurName');
    firstNameCtrl = new AtlasFormControl('FirstName');
    extraInitialsCtrl = new AtlasFormControl('ExtraInitials');
    jobTitleRelationShipCtrl = new AtlasFormControl('JobTitleRelationShip');
    domainCtrl = new AtlasFormControl('Domain');
    address1Ctrl = new AtlasFormControl('Address1');
    address2Ctrl = new AtlasFormControl('Address2');
    zipCodeCtrl = new AtlasFormControl('ZipCode');
    cityCtrl = new AtlasFormControl('City');
    countryCtrl = new AtlasFormControl('Country');
    emailAddressCtrl = new AtlasFormControl('EmailAddress');
    phoneNumberCtrl = new AtlasFormControl('PhoneNumber');
    mobilePhoneNumberCtrl = new AtlasFormControl('MobilePhoneNumber');
    privatePhoneNumberCtrl = new AtlasFormControl('PrivatePhoneNumber');
    communicationsCtrl = new AtlasFormControl('Communications');

    displayProperty: string = 'titleDesignation';
    selectProperties: string[] = ['titleDesignation'];
    options: TitleDesignationTypes[];
    titleToView: TitleDesignationTypes = new TitleDesignationTypes();

    newContactForm: boolean = false;
    contactToDisplay: Contact;
    @Output() contactCreated = new EventEmitter<Contact>();
    @Output() contactDeleted = new EventEmitter<Contact>();
    @Input() contactListLength: number;
    @Input() isViewMode: boolean = false;
    contactEmptyMessage: string = "Start by Selecting One";
    editContact: boolean = false;
    isEditMode: boolean = false;
    titleValue: string;
    isNewContact: boolean = true;
    filteredCountry: Country[];
    masterdata: MasterData;
    masterdataList: string[] = [
        MasterDataProps.Countries,
    ];
    @Input() counterPartyId: number;
    isDeleted: boolean = false;
    isDeleteDisabled: boolean = false;
    inputErrorMap: Map<string, string> = new Map();
    inputErrorMapforPhoneNumnber: Map<string, string> = new Map();
    inputErrorMapforJobTitleRelationShip: Map<string, string> = new Map();
    inputErrorMapforDomain: Map<string, string> = new Map();
    inputErrorMapforPrivatePhoneNumber: Map<string, string> = new Map();

    constructor(protected formBuilder: FormBuilder,
        protected formConfigurationProvider: FormConfigurationProviderService, protected snackbarService: SnackbarService,
        protected dialog: MatDialog,
        protected utilService: UtilService,
        protected masterdataService: MasterdataService,
    ) {
        super(formConfigurationProvider);
        this.inputErrorMap.set('maxlength', 'Maximum 10 digits Allowed');
        this.inputErrorMapforPhoneNumnber.set('maxlength', 'Maximum 16 digits Allowed');
        this.inputErrorMapforJobTitleRelationShip.set('maxlength', 'Maximum 50 digits Allowed');
        this.inputErrorMapforDomain.set('maxlength', 'Maximum 50 digits Allowed');
        this.inputErrorMapforPrivatePhoneNumber.set('maxlenght', 'Maximum 16 didgits Allowed');
    }

    ngOnInit() {
        this.isEditMode = true;

        if (!this.isEditMode) {
            this.formGroup.disable();
        }
        this.options = [
            {
                titleId: TitleDesignation.Mr,
                titleDesignation: 'Mr.',
            },
            {
                titleId: TitleDesignation.Mrs,
                titleDesignation: 'Mrs.',
            },
            {
                titleId: TitleDesignation.Ms,
                titleDesignation: 'Ms.',
            },
        ];
        this.masterdataService
            .getMasterData(this.masterdataList)
            .subscribe((data) => {
                this.masterdata = data;
                this.filteredCountry = this.masterdata.countries;
            });
        this.countryCtrl.valueChanges.subscribe((input) => {

            this.filteredCountry = this.utilService.filterListforAutocomplete(
                input,
                this.masterdata.countries,
                ['countryId', 'description'],
            );
        });
        this.setValidators();
    }

    getFormGroup() {
        this.formGroup = this.formBuilder.group({
            contactNameCtrl: this.contactNameCtrl,
            titleDesignationCtrl: this.titleDesignationCtrl,
            surNameCtrl: this.surNameCtrl,
            firstNameCtrl: this.firstNameCtrl,
            extraInitialsCtrl: this.extraInitialsCtrl,
            jobTitleRelationShipCtrl: this.jobTitleRelationShipCtrl,
            domainCtrl: this.domainCtrl,
            address1Ctrl: this.address1Ctrl,
            address2Ctrl: this.address2Ctrl,
            zipCodeCtrl: this.zipCodeCtrl,
            cityCtrl: this.cityCtrl,
            countryCtrl: this.countryCtrl,
            emailAddressCtrl: this.emailAddressCtrl,
            phoneNumberCtrl: this.phoneNumberCtrl,
            mobilePhoneNumberCtrl: this.mobilePhoneNumberCtrl,
            privatePhoneNumberCtrl: this.privatePhoneNumberCtrl,
            communicationsCtrl: this.communicationsCtrl,
        });

        return super.getFormGroup();
    }


    setValidators() {
        this.contactNameCtrl.setValidators(
            Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z ]*$')]),
        );
        this.firstNameCtrl.setValidators(
            Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z ]*$')])
        );
        this.jobTitleRelationShipCtrl.setValidators(
            Validators.compose([Validators.required, Validators.maxLength(50), Validators.pattern('^[a-zA-Z ]*$')])
        );
        this.domainCtrl.setValidators(
            Validators.compose([Validators.required, Validators.maxLength(50), Validators.pattern('^[a-zA-Z ]*$')])
        );
        this.phoneNumberCtrl.setValidators(
            Validators.compose([Validators.maxLength(16)])
        );
        this.privatePhoneNumberCtrl.setValidators(
            Validators.compose([Validators.required, Validators.maxLength(16)])
        );
        this.mobilePhoneNumberCtrl.setValidators(
            Validators.compose([Validators.required, Validators.maxLength(10)])
        );
        this.emailAddressCtrl.setValidators(
            Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.com')])
        );

        this.surNameCtrl.setValidators(
            Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z ]*$')])
        );

        this.communicationsCtrl.setValidators(
            Validators.compose([Validators.maxLength(2000)]),
        );

        this.extraInitialsCtrl.setValidators(
            Validators.compose([Validators.pattern('^[a-zA-Z ]*$')])
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
        this.formGroup.updateValueAndValidity();
    }

    phoneNoValidation(event: any) {
        const pattern = /[0-9]/;
        let inputChar = String.fromCharCode(event.charCode);
        if (!pattern.test(inputChar)) {
            event.preventDefault();
        }
    }
    deleteContact() {
        const confirmDiscardDialog = this.dialog.open(ConfirmationDialogComponent, {
            data: {
                title: 'Discard Changes',
                text: 'Do you confirm the deletion of Contact ' + this.contactNameCtrl.value,
                okButton: 'Yes',
                cancelButton: 'No',
            },
        });
        confirmDiscardDialog.afterClosed().subscribe((answer) => {
            if (answer) {
                this.contactDeleted.emit(this.contactToDisplay);
                this.formGroup.reset();
                this.newContactForm = false;
                this.editContact = false;
            }
        });

    }

    setContactInformationOnDisplayCard(contact: Contact, deletionFlag: boolean) {
        if (contact) {
            this.contactToDisplay = contact;
            if (contact.randomId) {
                this.isNewContact = false;
            }
            this.firstNameCtrl.patchValue(contact.firstName);
            if (contact.title) {
                this.titleDesignationCtrl.patchValue(this.options.find(item => item.titleId === contact.title));
            }
            this.contactNameCtrl.patchValue(contact.contactName);
            this.surNameCtrl.patchValue(contact.surname);
            this.extraInitialsCtrl.patchValue(contact.extraInitials);
            this.jobTitleRelationShipCtrl.patchValue(contact.jobRole);
            this.domainCtrl.patchValue(contact.domain);
            this.address1Ctrl.patchValue(contact.address1);
            this.address2Ctrl.patchValue(contact.address2);
            this.zipCodeCtrl.patchValue(contact.zipCode);
            if (contact.countryId) {
                this.countryCtrl.patchValue(this.filteredCountry.find(country => country.countryId === contact.countryId).description);
            }
            this.cityCtrl.patchValue(contact.city);
            this.emailAddressCtrl.patchValue(contact.email);
            this.phoneNumberCtrl.patchValue(contact.phoneNo);
            this.privatePhoneNumberCtrl.patchValue(contact.privatePhoneNo);
            this.mobilePhoneNumberCtrl.patchValue(contact.mobilePhoneNo);
            this.communicationsCtrl.patchValue(contact.communications);

        }
        if (deletionFlag = true) {
            this.newContactForm = false;
        }
    }

    onSaveButtonClicked() {
        if (this.formGroup.valid) {
            let contact = <Contact>{
                contactId: this.contactToDisplay ? this.contactToDisplay.contactId : null,
                randomId: this.isNewContact ? this.contactListLength + 1 : this.contactToDisplay.randomId,
                firstName: this.firstNameCtrl.value,
                title: this.titleDesignationCtrl.value ? this.titleDesignationCtrl.value.titleId : null,
                contactName: this.contactNameCtrl.value,
                surname: this.surNameCtrl.value,
                extraInitials: this.extraInitialsCtrl.value,
                jobRole: this.jobTitleRelationShipCtrl.value,
                domain: this.domainCtrl.value,
                address1: this.address1Ctrl.value,
                address2: this.address2Ctrl.value,
                zipCode: this.zipCodeCtrl.value,
                city: this.cityCtrl.value,
                countryId: this.countryCtrl.value ? this.filteredCountry.find(country => country.description === this.countryCtrl.value).countryId : '',
                email: this.emailAddressCtrl.value,
                phoneNo: this.phoneNumberCtrl.value,
                mobilePhoneNo: this.mobilePhoneNumberCtrl.value,
                privatePhoneNo: this.privatePhoneNumberCtrl.value,
                communications: this.communicationsCtrl.value,
                counterpartyId: this.counterPartyId,
                main: false,
                isDeleted: this.isDeleted,
            };
            this.contactCreated.emit(contact);
            this.formGroup.reset();
            this.isNewContact = true;
            this.newContactForm = false;
            this.editContact = false;
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
        this.newContactForm = false;
        this.editContact = false;
        this.cancelContact.emit();
    }
}
