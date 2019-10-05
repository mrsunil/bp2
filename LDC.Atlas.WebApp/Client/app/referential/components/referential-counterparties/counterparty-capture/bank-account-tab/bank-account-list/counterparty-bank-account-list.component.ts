import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { CounterpartyBankAccountDetails } from '../../../../../../shared/entities/counterparty-bank-account-details.entity';

@Component({
    selector: 'atlas-counterparty-bank-account-list',
    templateUrl: './counterparty-bank-account-list.component.html',
    styleUrls: ['./counterparty-bank-account-list.component.scss']
})
export class CounterpartyBankAccountListComponent implements OnInit {
    @Output() readonly addNewflag = new EventEmitter<any>();
    @Output() readonly setBankData = new EventEmitter<any>();
    bankAccountsData: CounterpartyBankAccountDetails[] = [];
    isAddNewBankAccountDisabled: boolean = false;
    isDeleteBankAccountDisabled: boolean = false;
    favoriteFlag: boolean = false;
    @Input() isViewMode: boolean = false;
    constructor() { }

    ngOnInit() {
    }

    onAddNewBankAccountButtonClick() {
        this.addNewflag.emit(true);
    }

    onSetBankAccountData(bankData: CounterpartyBankAccountDetails) {
        if (bankData) {
            this.isAddNewBankAccountDisabled = true;
            this.isDeleteBankAccountDisabled = true;
            this.setBankData.emit(bankData);
        }
    }

    updatingBankAccountListOnEditing(bankAccountUpdated: CounterpartyBankAccountDetails) {
        if (bankAccountUpdated) {
            let index = -1
            index = this.bankAccountsData.findIndex(bank => bank.randomId === bankAccountUpdated.randomId);
            if (this.bankAccountsData && this.bankAccountsData.length > 0) {
                bankAccountUpdated.counterpartyId = this.bankAccountsData[0].counterpartyId;
            }
            if (index != -1) {
                this.bankAccountsData.splice(index, 1, bankAccountUpdated);
            }
            else {
                this.bankAccountsData.push(bankAccountUpdated);
            }
        }
        this.isAddNewBankAccountDisabled = false;
    }

    deletingBankAccountListOnDeletion(bankAccountDeleted: CounterpartyBankAccountDetails) {
        if (bankAccountDeleted) {
            let index = -1
            index = this.bankAccountsData.findIndex(bank => bank.randomId === bankAccountDeleted.randomId);
            if (index != -1) {
                bankAccountDeleted.isDeleted = true;
            }
            else {
                return '';
            }
        }
        this.isAddNewBankAccountDisabled = false;
    }

    onSetBankAccountFavorite(bankAccountFavorite: CounterpartyBankAccountDetails) {
        if (bankAccountFavorite && !this.isViewMode) {
            this.bankAccountsData.forEach((element) => {
                if (element.bankKey === bankAccountFavorite.bankKey
                    && element.counterpartyId === bankAccountFavorite.counterpartyId && element.accountCCY === bankAccountFavorite.accountCCY) {
                    element.bankAccountDefault = !element.bankAccountDefault;
                }
                else if (element.accountCCY === bankAccountFavorite.accountCCY
                    && element.counterpartyId === bankAccountFavorite.counterpartyId) {
                    element.bankAccountDefault = false;
                }
            });
        }
        this.isAddNewBankAccountDisabled = false;
    }
}