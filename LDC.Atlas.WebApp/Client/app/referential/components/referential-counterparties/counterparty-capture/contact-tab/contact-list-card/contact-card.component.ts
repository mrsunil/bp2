import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Contact } from '../../../../../../shared/entities/contact.entity'
import { TitleDesignationTypes } from '../../../../../../shared/entities/title-designation.entity';
import { TitleDesignation } from '../../../../../../shared/enums/title-designation';

@Component({
    selector: 'atlas-counterparty-contact-card',
    templateUrl: './contact-card.component.html',
    styleUrls: ['./contact-card.component.scss']
})
export class ContactCardComponent implements OnInit {
    contactData: Contact[] = [];
    @Output() addNewContact = new EventEmitter<any>();
    @Output() contactDetails = new EventEmitter<any>();
    isContactListDataClicked: boolean = false;
    isDeleteButtonEnabled: boolean = false;
    @Input() isViewMode: boolean = false;
    options: TitleDesignationTypes[];

    constructor() { }

    ngOnInit() {
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
    }

    onOpenContact(contact: Contact) {
        this.isContactListDataClicked = true
        this.isDeleteButtonEnabled = true
        this.contactDetails.emit(contact);
    }

    onAddNewContact() {
        this.addNewContact.emit(true);
    }

    updatingContactListOnEditing(contactToBeUpdated: Contact) {
        if (contactToBeUpdated) {
            let index = -1
            index = this.contactData.findIndex(contact => contact.randomId === contactToBeUpdated.randomId);
            if (index != -1) {
                this.contactData.splice(index, 1, contactToBeUpdated);
            }
            else {
                this.contactData.push(contactToBeUpdated);
            }
        }
        this.isContactListDataClicked = false;
    }

    updatingContactListOnDeletion(contactToBeDeleted: Contact) {
        if (contactToBeDeleted) {
            let index = -1
            index = this.contactData.findIndex(contact => contact.randomId === contactToBeDeleted.randomId);
            if (index != -1) {
                contactToBeDeleted.isDeleted = true;
                contactToBeDeleted.isDeactivated = true;
            }
            else {
                return '';
            }
        }
        this.isContactListDataClicked = false;
    }

    onSetContactFavorite(contactFavorite: Contact) {
        if (contactFavorite && !this.isViewMode) {
            this.contactData.forEach((element) => {
                if (element.randomId === contactFavorite.randomId) {
                    element.isFavorite = true;
                }
                else {
                    element.isFavorite = false;
                }
            });
        }
        this.isContactListDataClicked = false;
    }

    populateValue() {
        if (this.contactData) {
            this.contactData.forEach((contact) => {
                if (contact.title) {
                    contact.titleValue = this.options.find((c) => c.titleId == contact.title).titleDesignation;
                }
            });
        }
    }
}