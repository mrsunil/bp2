import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { CounterpartyBankAccountListComponent } from './bank-account-list/counterparty-bank-account-list.component';
import { CounterpartyBankAccountDetailsComponent } from './bank-account-details/counterparty-bank-account-details.component';
import { CounterpartyBankAccountDetails } from '../../../../../shared/entities/counterparty-bank-account-details.entity';
import { BankTypes } from '../../../../../shared/enums/bank-type.enum';
import { Status } from '../../../../../shared/enums/status.enum';

@Component({
    selector: 'atlas-counterparty-capture-form-bank-account-tab',
    templateUrl: './counterparty-capture-form-bank-account-tab.component.html',
    styleUrls: ['./counterparty-capture-form-bank-account-tab.component.scss']
})
export class CounterpartyCaptureFormBankAccountTabComponent implements OnInit {
    @ViewChild('bankAccountListComponent') bankAccountListComponent: CounterpartyBankAccountListComponent;
    @ViewChild('bankAccountDetailsComponent') bankAccountDetailsComponent: CounterpartyBankAccountDetailsComponent;
    bankAccountListLength: number;
    bankAccountDisplay: CounterpartyBankAccountDetails;
    bankAccountUpdate: CounterpartyBankAccountDetails;
    @Input() isViewMode: boolean = false;

    constructor() { }

    ngOnInit() {
        this.bankAccountListLength = this.bankAccountListComponent.bankAccountsData.length;

    }

    onSetBankAccountData(newBankAccount: CounterpartyBankAccountDetails) {
        if (newBankAccount) {
            newBankAccount.evalue = BankTypes[newBankAccount.bankTypeID]
            newBankAccount.stausValue = Status[newBankAccount.bankAccountStatusID]
            this.bankAccountListComponent.updatingBankAccountListOnEditing(newBankAccount);
        }
    }
    addNewBankAccount(addNewData: boolean) {
        if (addNewData) {
            this.bankAccountDetailsComponent.newBankAccountForm = true;
            this.bankAccountDetailsComponent.bankAccountFormGroup.reset();
            this.bankAccountDetailsComponent.bankAccountIntermediary1FormGroup.reset();
            this.bankAccountDetailsComponent.bankAccountIntermediary2FormGroup.reset();
            this.bankAccountDetailsComponent.bankAccountListLength = this.bankAccountListComponent.bankAccountsData.length;
            this.bankAccountDetailsComponent.bankAccountStatusCtrl.patchValue('1');
        }
    }
    setBankAccount(data: CounterpartyBankAccountDetails) {
        if (data) {
            this.bankAccountDisplay = data;
            this.bankAccountDetailsComponent.editBankAccount = true;

            this.bankAccountDetailsComponent.getBankAccountData(this.bankAccountDisplay, this.bankAccountListComponent.isDeleteBankAccountDisabled);
            this.bankAccountDetailsComponent.bankAccountListLength = this.bankAccountListComponent.bankAccountsData.length;
        }
    }

    onBankAccountDeleted(deletedBankAccount: CounterpartyBankAccountDetails) {
        if (deletedBankAccount) {
            this.bankAccountListComponent.deletingBankAccountListOnDeletion(deletedBankAccount);
        }
    }
    onCancelBankAccountData() {
        this.bankAccountListComponent.isAddNewBankAccountDisabled = false;
        this.bankAccountDetailsComponent.isNewBankAccount = true;
    }
}
