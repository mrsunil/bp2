import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BaseFormComponent } from '../../../../shared/components/base-form-component/base-form-component.component';
import { CashTypes } from '../../../../shared/entities/cash-type.entity';
import { MasterData } from '../../../../shared/entities/masterdata.entity';
import { CashSelectionType } from '../../../../shared/enums/cash-selection-type';
import { CashType } from '../../../../shared/enums/cash-type.enum';
import { CashRecord } from '../../../../shared/services/execution/dtos/cash-record';
import { FormConfigurationProviderService } from '../../../../shared/services/form-configuration-provider.service';
import { PaymentDifferentClientComponent } from './payment-different-client/payment-different-client.component';
import { PaymentDifferentCurrencyComponent } from './payment-different-currency/payment-different-currency.component';
import { PaymentFullTransactionComponent } from './payment-full-transaction/payment-full-transaction.component';
import { ReceiptDifferentCurrencyComponent } from './receipt-different-currency/receipt-different-currency.component';
import { ReceiptFullTransactionComponent } from './receipt-full-transaction/receipt-full-transaction.component';
import { SimpleCashPaymentComponent } from './simple-cash-payment/simple-cash-payment.component';
import { SimpleCashReceiptComponent } from './simple-cash-receipt/simple-cash-receipt.component';

@Component({
    selector: 'atlas-cash-selection-form-component',
    templateUrl: './cash-selection.component.html',
    styleUrls: ['./cash-selection.component.scss'],
})
export class CashSelectionFormComponent extends BaseFormComponent implements OnInit {

    @Output() readonly checkBoxValueChange = new EventEmitter<boolean>();
    @Output() readonly cashOptionSelected = new EventEmitter<any>();
    @ViewChild('simpleCashPayment') simpleCashPayment: SimpleCashPaymentComponent;
    @ViewChild('paymentFullTransaction') paymentFullTransaction: PaymentFullTransactionComponent;
    @ViewChild('paymentDifferentClient') paymentDifferentClient: PaymentDifferentClientComponent;
    @ViewChild('paymentDifferentCurrency') paymentDifferentCurrency: PaymentDifferentCurrencyComponent;
    @ViewChild('simpleCashReceipt') simpleCashReceipt: SimpleCashReceiptComponent;
    @ViewChild('receiptFullTransaction') receiptFullTransaction: ReceiptFullTransactionComponent;
    @ViewChild('receiptDifferentCurrency') receiptDifferentCurrency: ReceiptDifferentCurrencyComponent;

    CashType = CashType;
    cashTypeId: number;
    cashSelectionOption: number;
    company: string;
    cashListTypes: CashTypes[];
    masterData: MasterData = new MasterData();
    cashTypes: CashTypes;
    constructor(protected formConfigurationProvider: FormConfigurationProviderService,
        private route: ActivatedRoute,
        protected formBuilder: FormBuilder) {
        super(formConfigurationProvider);
        this.cashTypeId = Number(decodeURIComponent(this.route.snapshot.paramMap.get('cashTypeId')));
    }

    ngOnInit() {
        this.company = this.route.snapshot.paramMap.get('company');
    }

    onChange(value) {
        this.checkBoxValueChange.emit(!value.checked);
    }
    onSimpleCashPaymentOptionChecked(cashType) {
        this.cashSelectionOption = cashType.simpleCashPaymentOption;
        this.cashOptionSelected.emit({ option: this.cashSelectionOption, checked: cashType.checked });
        if (cashType.checked) {
            if (this.paymentDifferentClient) {
                this.paymentDifferentClient.paymentDifferentClientDisable();
            }
            if (this.paymentDifferentCurrency) {
                this.paymentDifferentCurrency.paymentDifferentCurrencyDisable();
            }
            if (this.paymentFullTransaction) {
                this.paymentFullTransaction.paymentFullTransactionDisable();
            }
        } else {
            if (this.paymentDifferentClient) {
                this.paymentDifferentClient.paymentDifferentClientEnable();
            }
            if (this.paymentDifferentCurrency) {
                this.paymentDifferentCurrency.paymentDifferentCurrencyEnable();
            }
            if (this.paymentFullTransaction) {
                this.paymentFullTransaction.paymentFullTransactionEnable();
            }
        }
    }
    onPaymentFullTransactionOptionChecked(cashType) {
        this.cashSelectionOption = cashType.paymentFullTransactionOption;
        this.cashOptionSelected.emit({ option: this.cashSelectionOption, checked: cashType.checked });
        if (cashType.checked) {
            if (this.paymentDifferentClient) {
                this.paymentDifferentClient.paymentDifferentClientDisable();
            }
            if (this.paymentDifferentCurrency) {
                this.paymentDifferentCurrency.paymentDifferentCurrencyDisable();
            }
            if (this.simpleCashPayment) {
                this.simpleCashPayment.simpleCashPaymentDisable();
            }
        } else {
            if (this.paymentDifferentClient) {
                this.paymentDifferentClient.paymentDifferentClientEnable();
            }
            if (this.paymentDifferentCurrency) {
                this.paymentDifferentCurrency.paymentDifferentCurrencyEnable();
            }
            if (this.simpleCashPayment) {
                this.simpleCashPayment.simpleCashPaymentEnable();
            }
        }
    }
    onPaymentDifferentClientOptionChecked(cashType) {
        this.cashSelectionOption = cashType.paymentDifferentClientOption;
        this.cashOptionSelected.emit({ option: this.cashSelectionOption, checked: cashType.checked });
        if (cashType.checked) {
            if (this.simpleCashPayment) {
                this.simpleCashPayment.simpleCashPaymentDisable();
            }
            if (this.paymentDifferentCurrency) {
                this.paymentDifferentCurrency.paymentDifferentCurrencyDisable();
            }
            if (this.paymentFullTransaction) {
                this.paymentFullTransaction.paymentFullTransactionDisable();
            }
        } else {
            if (this.simpleCashPayment) {
                this.simpleCashPayment.simpleCashPaymentEnable();
            }
            if (this.paymentDifferentCurrency) {
                this.paymentDifferentCurrency.paymentDifferentCurrencyEnable();
            }
            if (this.paymentFullTransaction) {
                this.paymentFullTransaction.paymentFullTransactionEnable();
            }
        }
    }
    onPaymentDifferentCurrencyOptionChecked(cashType) {
        this.cashSelectionOption = cashType.paymentDifferentCurrencyOption;
        this.cashOptionSelected.emit({ option: this.cashSelectionOption, checked: cashType.checked });
        if (cashType.checked) {
            if (this.simpleCashPayment) {
                this.simpleCashPayment.simpleCashPaymentDisable();
            }
            if (this.paymentDifferentClient) {
                this.paymentDifferentClient.paymentDifferentClientDisable();
            }
            if (this.paymentFullTransaction) {
                this.paymentFullTransaction.paymentFullTransactionDisable();
            }

        } else {
            if (this.simpleCashPayment) {
                this.simpleCashPayment.simpleCashPaymentEnable();
            }
            if (this.paymentDifferentClient) {
                this.paymentDifferentClient.paymentDifferentClientEnable();
            }
            if (this.paymentFullTransaction) {
                this.paymentFullTransaction.paymentFullTransactionEnable();
            }
        }
    }
    onSimpleCashReceiptOptionChecked(cashType) {
        this.cashSelectionOption = cashType.simpleCashReceiptOption;
        this.cashOptionSelected.emit({ option: this.cashSelectionOption, checked: cashType.checked });
        if (cashType.checked) {
            if (this.receiptDifferentCurrency) {
                this.receiptDifferentCurrency.receiptDifferentCurrencyDisable();
            }
            if (this.receiptFullTransaction) {
                this.receiptFullTransaction.receiptFullTransactionDisable();
            }
        } else {
            if (this.receiptDifferentCurrency) {
                this.receiptDifferentCurrency.receiptDifferentCurrencyEnable();
            }
            if (this.receiptFullTransaction) {
                this.receiptFullTransaction.receiptFullTransactionEnable();
            }
        }
    }
    onReceiptFullTransactionOptionChecked(cashType) {
        this.cashSelectionOption = cashType.receiptFullTransactionOption;
        this.cashOptionSelected.emit({ option: this.cashSelectionOption, checked: cashType.checked });
        if (cashType.checked) {
            if (this.receiptDifferentCurrency) {
                this.receiptDifferentCurrency.receiptDifferentCurrencyDisable();
            }
            if (this.simpleCashReceipt) {
                this.simpleCashReceipt.simpleCashReceiptDisable();
            }
        } else {
            if (this.receiptDifferentCurrency) {
                this.receiptDifferentCurrency.receiptDifferentCurrencyEnable();
            }
            if (this.simpleCashReceipt) {
                this.simpleCashReceipt.simpleCashReceiptEnable();
            }
        }
    }
    onReceiptDifferentCurrencyOptionChecked(cashType) {
        this.cashSelectionOption = cashType.receiptDifferentCurrencyOption;
        this.cashOptionSelected.emit({ option: this.cashSelectionOption, checked: cashType.checked });
        if (cashType.checked) {
            if (this.receiptFullTransaction) {
                this.receiptFullTransaction.receiptFullTransactionDisable();
            }
            if (this.simpleCashReceipt) {
                this.simpleCashReceipt.simpleCashReceiptDisable();
            }
        } else {
            if (this.receiptFullTransaction) {
                this.receiptFullTransaction.receiptFullTransactionEnable();
            }
            if (this.simpleCashReceipt) {
                this.simpleCashReceipt.simpleCashReceiptEnable();
            }
        }
    }

    initForm(entity: CashRecord, isEdit: boolean): any {

        return entity;
    }

    bindSelectedCashTypeSelection(value: number, costDirectId: number) {

        if (value) {
            const selectedCashType = Number(value);
            const cashTypeList = costDirectId === CashType.CashPayment ?
                this.simpleCashPayment.getCashTypes()
                : this.simpleCashReceipt.getCashTypes();
            this.cashTypes = cashTypeList.find((item) => item.cashTypeId === selectedCashType);

            switch (selectedCashType) {
                case CashSelectionType.SimpleCashPayment: {
                    this.simpleCashPayment.onChange(null, true, this.cashTypes);
                    break;
                }
                case CashSelectionType.SimpleCashReceipt: {
                    this.simpleCashReceipt.onChange(null, true, this.cashTypes);
                    break;
                }
                case CashSelectionType.PaymentDifferentClient: {
                    this.paymentDifferentClient.onChange(null, true, this.cashTypes);
                    break;
                }
                case CashSelectionType.PaymentDifferentCurrency: {
                    this.paymentDifferentCurrency.onChange(null, true, this.cashTypes);
                    break;
                }
                case CashSelectionType.PaymentFullPartialTransaction: {
                    this.paymentFullTransaction.onChange(null, true, this.cashTypes);
                    break;
                }
                case CashSelectionType.ReceiptDifferentCurrency: {
                    this.receiptDifferentCurrency.onChange(null, true, this.cashTypes);
                    break;
                }
                case CashSelectionType.ReceiptFullPartialTransaction: {
                    this.receiptFullTransaction.onChange(null, true, this.cashTypes);
                    break;
                }
                default: {
                    // statements;
                    break;
                }
            }
        }
    }

}
