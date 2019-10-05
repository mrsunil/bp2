import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef, Input } from '@angular/core';
import { CounterpartyAddress } from '../../../../../../shared/entities/counterparty-address.entity';
import { MasterData } from '../../../../../../shared/entities/masterdata.entity';
import { ActivatedRoute } from '@angular/router';
import { SnackbarService } from '../../../../../../shared/services/snackbar.service';

@Component({
    selector: 'atlas-counterparty-address-card',
    templateUrl: './counterparty-address-card.component.html',
    styleUrls: ['./counterparty-address-card.component.scss']
})
export class CounterpartyAddressCardComponent implements OnInit {

    data: any[] = [];
    counterpartyAddresses: CounterpartyAddress[] = [];

    @Output() readonly addNewAddress = new EventEmitter();
    @Output() readonly rowClicked = new EventEmitter();
    @ViewChild('button') button: ElementRef;
    isAddressListDataClicked: boolean = false;
    isDeleteButtonEnabled: boolean = false;
    @Input() isViewMode: boolean = false;
    masterdata: MasterData;

    constructor(private route: ActivatedRoute,
        private snackbarService: SnackbarService, ) {
    }

    ngOnInit() {
    }

    onNewAddressButtonClicked() {
        this.addNewAddress.emit(true);
    }

    onRowClicked(data: CounterpartyAddress) {
        if (data) {
            if (data.main && !this.isViewMode) {
                this.snackbarService.throwErrorSnackBar(
                    'Main address can only be edited in Main tab.',
                );
            }
            else {
                this.rowClicked.emit(data);
                this.isAddressListDataClicked = true;
                this.isDeleteButtonEnabled = true
            }
        }
    }

    updatingAddressListOnEditing(addressToBeUpdated: CounterpartyAddress) {
        if (addressToBeUpdated) {
            let index = -1
            index = this.counterpartyAddresses.findIndex(address => address.randomId === addressToBeUpdated.randomId);
            if (index != -1) {
                this.counterpartyAddresses.splice(index, 1, addressToBeUpdated);
            }
            else {
                this.counterpartyAddresses.push(addressToBeUpdated);
            }
        }
        this.isAddressListDataClicked = false;
    }

    updatingAddressListOnDeletion(addressToBeDeleted: CounterpartyAddress) {
        if (addressToBeDeleted) {
            let index = -1
            index = this.counterpartyAddresses.findIndex(address => address.randomId === addressToBeDeleted.randomId);
            if (index != -1) {
                addressToBeDeleted.isDeactivated = true;
                addressToBeDeleted.isDeleted = true;
            }
            else {
                return '';
            }
        }
        this.isAddressListDataClicked = false;
    }

    onSetAddressFavorite(addressFavorite: CounterpartyAddress) {
        if (addressFavorite && !this.isViewMode) {
            this.counterpartyAddresses.forEach((element) => {
                if (element.randomId === addressFavorite.randomId) {
                    element.main = !element.main;
                }
                else {
                    element.main = false;
                }
            });
        }
        this.isAddressListDataClicked = false;
    }

    populateValue() {
        this.masterdata = this.route.snapshot.data.masterdata;
        if (this.counterpartyAddresses) {
            this.counterpartyAddresses.forEach((address) => {
                if (address.addressTypeID) {
                    address.addressTypeCode = (this.masterdata.addressTypes.find((addressType) => addressType.enumEntityId === address.addressTypeID).enumEntityValue);
                    address.addresTypeName = address.addressTypeCode;
                }
            });
        }
    }
}
