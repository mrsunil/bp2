import { AfterViewInit, Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseFormComponent } from '../../../../shared/components/base-form-component/base-form-component.component';
import { CashSelectionType } from '../../../../shared/enums/cash-selection-type';
import { CashRecord } from '../../../../shared/services/execution/dtos/cash-record';
import { FormConfigurationProviderService } from '../../../../shared/services/form-configuration-provider.service';
import { AdditionalCostsFormComponent } from '../cash-details/additional-costs/additional-costs.component';
import { InvoiceMatchingComponent } from './invoice-matching/invoice-matching.component';

@Component({
    selector: 'atlas-pick-transaction',
    templateUrl: './pick-transaction.component.html',
    styleUrls: ['./pick-transaction.component.scss'],
})
export class PickTransactionComponent extends BaseFormComponent implements OnInit, AfterViewInit {
    @Output() readonly totalBalanceCalculated = new EventEmitter<any>();
    @Output() readonly cashDetailsDefaultValues = new EventEmitter<any>();
    @Output() readonly invoicesSelected = new EventEmitter<boolean>();
    @Output() readonly setNarrative = new EventEmitter<any>();
    @Output() readonly proceedClickedCashReceipt = new EventEmitter<any>();
    @Output() readonly totalAmountCalculated = new EventEmitter<any>();
    @ViewChild('invoiceMatchingComponent') invoiceMatchingComponent: InvoiceMatchingComponent;
    @ViewChild('additionalCostsFormComponent') additionalCostsPickTransactionComponent: AdditionalCostsFormComponent;
    @Output() readonly calculateTotalBalanceOnCostAmountEnter = new EventEmitter<any>();
    @Output() readonly AmountEnterOrInvoiceSelection = new EventEmitter<any>();

    formComponents: BaseFormComponent[] = [];
    totalBalance: number;
    totalAmount: number;
    counterpartyValue: string;
    departmentValue: number;
    currencyValue: string;
    clientNameValue: string;
    pickTransactionFormGroup: FormGroup;
    selectionValue: number;
    fxRateValue: number;
    bankCurrencyValue: string;
    roeTypeValue: string;
    isSave: boolean = false;
    constructor(
        private route: ActivatedRoute,
        private router: Router,
        protected formConfigurationProvider: FormConfigurationProviderService,
        protected formBuilder: FormBuilder,
    ) {
        super(formConfigurationProvider);
    }

    ngOnInit() {

    }

    ngAfterViewInit() {
        this.pickTransactionFormGroup = this.formBuilder.group({
            counterpartyFormComponent: this.invoiceMatchingComponent.getFormGroup(),
            additionalCostsFormComponent: this.additionalCostsPickTransactionComponent.getFormGroup(),
        });
        this.formComponents.push(this.invoiceMatchingComponent, this.additionalCostsPickTransactionComponent);
    }

    currencySelected(currency) {
        this.additionalCostsPickTransactionComponent.cashCurrency = currency;
    }
    onProceedClickedCashReceipt() {
        this.proceedClickedCashReceipt.emit();
    }
    onSetNarrative(narrative: string) {
        this.setNarrative.emit(narrative);
    }
    onTotalBalanceValueCalculated(value) {
        this.totalBalance = value;
        this.totalBalanceCalculated.emit({ balance: this.totalBalance });
    }
    onInvoiceAmountEntered(value) {
        this.totalAmount = value;
        this.totalAmountCalculated.emit({ amount: this.totalAmount });
    }
    onInvoiceSelected(invoicesSelected: boolean) {
        this.invoicesSelected.emit(invoicesSelected);

    }
    onInvoiceSearchValueEntered(model: any) {
        if (model) {
            this.counterpartyValue = model.counterparty;
            this.departmentValue = model.department;
            this.currencyValue = model.currency;
            this.clientNameValue = model.clientName;
            this.fxRateValue = model.fxRate;
            this.bankCurrencyValue = model.bankCurrency;
            this.roeTypeValue = model.roeType;
            this.cashDetailsDefaultValues.emit({
                counterparty: this.counterpartyValue,
                department: this.departmentValue,
                currency: this.currencyValue,
                clientName: this.clientNameValue,
                fxRate: this.fxRateValue,
                bankCurrency: this.bankCurrencyValue,
                roeType: this.roeTypeValue,
            });
        }
    }
    bindSelectedValue(value: number) {
        if (value !== 0) {
            this.selectionValue = value;
            this.invoiceMatchingComponent.cashTransactionId = value;
        }
    }

    populateEntity(model: CashRecord): any {
        if (model.childCashTypeId !== CashSelectionType.SimpleCashPayment &&
            model.childCashTypeId !== CashSelectionType.SimpleCashReceipt) {

            this.formComponents.forEach((comp) => {
                comp.populateEntity(model);
            });
        }
        return model;
    }

    initForm(entity: CashRecord, isEdit: boolean): any {
        this.formComponents.forEach((comp) => {
            if (comp) { comp.initForm(entity, isEdit); }
        });
        return entity;
    }

    calculateBalanceOnCostAmountEnter() {
        this.calculateTotalBalanceOnCostAmountEnter.emit();
    }

    clearControls() {
        this.invoiceMatchingComponent.clearAllControls();
        this.additionalCostsPickTransactionComponent.clearAdditonalCostGrid();
    }

    OnAmountEnterOrInvoiceSelection() {
        this.AmountEnterOrInvoiceSelection.emit();
    }

    clearAdditonalCostGrid() {
        this.additionalCostsPickTransactionComponent.clearAdditonalCostGrid();
    }
}
