import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Contact } from '../.././../../../shared/entities/contact.entity';
import { ContactDetailCardComponent } from './contact-detail-card/contact-detail-card.component';
import { ContactCardComponent } from './contact-list-card/contact-card.component';
import { TitleDesignation } from '../.././../../../shared/enums/title-designation';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { FormConfigurationProviderService } from '../.././../../../shared/services/form-configuration-provider.service';
import { BaseFormComponent } from '../.././../../../shared/components/base-form-component/base-form-component.component';

@Component({
    selector: 'atlas-counterparty-capture-form-contact-tab',
    templateUrl: './counterparty-capture-form-contact-tab.component.html',
    styleUrls: ['./counterparty-capture-form-contact-tab.component.scss']
})
export class CounterpartyCaptureFormContactTabComponent extends BaseFormComponent implements OnInit {

    newContact: boolean = false;
    contactToDisplay: Contact;
    updatedContact: Contact;
    contactListLength: number;
    counterPartyId: number;
    @Input() isViewMode: boolean = false;
    @ViewChild('contactDetailCardComponent') contactDetailCardComponent: ContactDetailCardComponent
    @ViewChild('contactCardComponent') contactCardComponent: ContactCardComponent;
    constructor(private route: ActivatedRoute, protected formBuilder: FormBuilder, protected formConfigurationProvider: FormConfigurationProviderService, ) { super(formConfigurationProvider); }

    ngOnInit() {
        this.contactListLength = this.contactCardComponent.contactData.length;
        this.counterPartyId = Number(this.route.snapshot.paramMap.get('counterpartyID'));
    }


    getFormGroup() {
        this.formGroup = this.formBuilder.group({
            contactDetailCardComponent: this.contactDetailCardComponent.getFormGroup(),
        });

        return super.getFormGroup();
    }


    onAddNewContactClicked(value: boolean) {
        if (value === true) {
            this.contactDetailCardComponent.newContactForm = true;
            this.contactDetailCardComponent.formGroup.reset();
            this.contactDetailCardComponent.contactListLength = this.contactCardComponent.contactData.length;
        }
    }
    onContactListClicked(contact: Contact) {
        if (contact) {
            this.contactToDisplay = contact;
            this.contactDetailCardComponent.editContact = true;
            this.contactDetailCardComponent.setContactInformationOnDisplayCard(this.contactToDisplay, this.contactCardComponent.isDeleteButtonEnabled);
            this.contactDetailCardComponent.contactListLength = this.contactCardComponent.contactData.length;
        }
    }
    onNewContactCreated(newContact: Contact) {
        if (newContact) {
            newContact.titleValue = TitleDesignation[newContact.title];
            this.contactCardComponent.updatingContactListOnEditing(newContact);
        }
    }
    onContactDeleted(deletedContact: Contact) {
        if (deletedContact) {
            this.contactCardComponent.updatingContactListOnDeletion(deletedContact);
        }

    }
    onCancelContact() {
        this.contactCardComponent.isContactListDataClicked = false;
        this.contactDetailCardComponent.isNewContact = true;
    }
}
