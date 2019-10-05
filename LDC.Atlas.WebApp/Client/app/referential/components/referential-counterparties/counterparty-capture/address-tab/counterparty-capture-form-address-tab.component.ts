import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { CounterpartyAddressDetailCardComponent } from './address-detail-card/counterparty-address-detail-card.component';
import { CounterpartyAddressCardComponent } from './address-card/counterparty-address-card.component';
import { CounterpartyAddress } from '../../../../../shared/entities/counterparty-address.entity';
import { BaseFormComponent } from '../../../../../shared/components/base-form-component/base-form-component.component';
import { FormConfigurationProviderService } from '../../../../../shared/services/form-configuration-provider.service';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder } from '@angular/forms';

@Component({
    selector: 'atlas-counterparty-capture-form-address-tab',
    templateUrl: './counterparty-capture-form-address-tab.component.html',
    styleUrls: ['./counterparty-capture-form-address-tab.component.scss']
})
export class CounterpartyCaptureFormAddressTabComponent extends BaseFormComponent implements OnInit {

    @ViewChild('addressComponent') addressComponent: CounterpartyAddressCardComponent;
    @ViewChild('addressDetailComponent') addressDetailComponent: CounterpartyAddressDetailCardComponent;
    formComponents: BaseFormComponent[] = [];
    addressListLength: number;
    counterPartyId: number;
    @Input() isViewMode: boolean = false;

    constructor(protected formBuilder: FormBuilder, private route: ActivatedRoute, protected formConfigurationProvider: FormConfigurationProviderService,
    ) { super(formConfigurationProvider); }

    ngOnInit() {

        this.addressListLength = this.addressComponent.counterpartyAddresses.length;
        this.counterPartyId = Number(this.route.snapshot.paramMap.get('counterpartyID'));
    }

    getFormGroup() {
        this.formGroup = this.formBuilder.group({
            addressDetailComponent: this.addressDetailComponent.getFormGroup(),
        });

        return super.getFormGroup();
    }

    addNewAddressCalled(params) {
        if (params) {
            this.addressDetailComponent.formGroup.reset();
            this.addressDetailComponent.newAddressForm = true;
            this.addressDetailComponent.addressListLength = this.addressComponent.counterpartyAddresses.length;
        }
    }

    rowClickedCalled(counterpartyAddresses) {
        if (counterpartyAddresses) {
            this.addressDetailComponent.addressListLength = this.addressComponent.counterpartyAddresses.length;
            this.addressDetailComponent.editAddress = true;
            this.addressDetailComponent.initializeValues(counterpartyAddresses, this.addressComponent.isDeleteButtonEnabled);
        }
    }

    saveNewAddressCalled(address: CounterpartyAddress) {
        if (address) {
            this.addressComponent.updatingAddressListOnEditing(address);
        }
    }

    onAddressDeleted(deletedAddress: CounterpartyAddress) {
        if (deletedAddress) {
            this.addressComponent.updatingAddressListOnDeletion(deletedAddress);
        }
    }
    onCancelAddress() {
        this.addressComponent.isAddressListDataClicked = false;
        this.addressDetailComponent.isNewAddress = true;
    }
}
