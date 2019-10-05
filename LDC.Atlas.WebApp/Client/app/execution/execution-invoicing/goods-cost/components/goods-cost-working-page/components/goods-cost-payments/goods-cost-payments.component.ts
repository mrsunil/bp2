import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import * as _moment from 'moment';
import { CompanyManagerService } from '../../../../../../../core/services/company-manager.service';
import { BaseFormComponent } from '../../../../../../../shared/components/base-form-component/base-form-component.component';
import { invoiceDateValidation } from '../../../../../../../shared/validators/date-validators.validator';
import { AtlasFormControl } from '../../../../../../../shared/entities/atlas-form-control';
import { PaymentTerm } from '../../../../../../../shared/entities/payment-term.entity';
import { CreditAgainstTypes } from '../../../../../../../shared/enums/credit-against-type.enum';
import { ContractsToInvoice } from '../../../../../../../shared/services/execution/dtos/contracts-to-invoice';
import { InvoiceRecord } from '../../../../../../../shared/services/execution/dtos/invoice-record';
import { FormConfigurationProviderService } from '../../../../../../../shared/services/form-configuration-provider.service';
import { MasterdataService } from '../../../../../../../shared/services/http-services/masterdata.service';
import { UtilService } from '../../../../../../../shared/services/util.service';
import { InvoiceSummaryRecord } from '../../../../../../../shared/services/execution/dtos/invoice-summary-record';
const moment = _moment;

@Component({
    selector: 'atlas-goods-cost-payments',
    templateUrl: './goods-cost-payments.component.html',
    styleUrls: ['./goods-cost-payments.component.scss']
})
export class GoodsCostPaymentsComponent extends BaseFormComponent implements OnInit {

    invoiceDueDateCtrl = new AtlasFormControl('invoiceCreationPaymentDueDate');
    invoicePayTermsCtrl = new AtlasFormControl('invoiceCreationPaymentTerms');

    invoiceDateSelected: Date = this.companyManager.getCurrentCompanyDate().toDate();
    invoiceDateChanged: Date;
    contracts: ContractsToInvoice[];
    paymentTermsDescription: string;
    masterDataPaymentTerms: PaymentTerm[];

    constructor(protected formBuilder: FormBuilder,
        protected masterdataService: MasterdataService,
        protected utilService: UtilService,
        protected route: ActivatedRoute,
        protected companyManager: CompanyManagerService,
        protected formConfigurationProvider: FormConfigurationProviderService) {
        super(formConfigurationProvider);
    }

    ngOnInit() {
        this.masterDataPaymentTerms = this.route.snapshot.data.masterdata.paymentTerms;
    }

    getFormGroup() {
        this.formGroup = this.formBuilder.group({
            invoiceDueDateCtrl: this.invoiceDueDateCtrl,
            invoicePayTermsCtrl: this.invoicePayTermsCtrl,
        });
        return super.getFormGroup();
    }

    contractToBeSelected(contracts: ContractsToInvoice[]) {
        this.contracts = contracts;
        if (this.masterDataPaymentTerms && this.contracts) {
            this.setPaymentTerm();
        }
    }

    setinvoiceDateSelected(invoiceDate: Date) {
        this.invoiceDateChanged = invoiceDate;
        this.invoiceDateSelected = moment(invoiceDate).toDate();
        if (this.contracts) {
            this.setPaymentTerm();
        }
    }

    setPaymentTerm() {
        let paymentDateToSet: Date = this.companyManager.getCurrentCompanyDate().toDate();
        let paymentTermToSet: string;
        let dateDiff: number | undefined;
        let canUpdatePayTermValue: boolean = true;
        if (!this.invoiceDateSelected) {
            this.invoiceDateSelected = paymentDateToSet;
        }
        this.contracts.forEach((contract, index) => {
            let calculateDate: any;
            const selectedPaymentTerms = this.masterDataPaymentTerms.filter(
                (payTerms) => payTerms.paymentTermCode === contract.paymentTermCode,
            );
            const selectedPaymentTerm = selectedPaymentTerms.length ? selectedPaymentTerms[0] : undefined;
            if (selectedPaymentTerm) {
                if (selectedPaymentTerm.creditAgainst === CreditAgainstTypes.ArrivalDate) {
                    calculateDate = moment(contract.arrivalDate);
                } else if (selectedPaymentTerm.creditAgainst === CreditAgainstTypes.BLDate) {
                    calculateDate = moment(contract.bLDate);
                } else if (selectedPaymentTerm.creditAgainst === CreditAgainstTypes.CurrentDate) {
                    calculateDate = this.companyManager.getCurrentCompanyDate();
                } else if (selectedPaymentTerm.creditAgainst === CreditAgainstTypes.InvoiceDate) {
                    calculateDate = moment(this.invoiceDateSelected);
                }
                calculateDate = moment(calculateDate).add('days', selectedPaymentTerm.creditDays);
                if (dateDiff) {
                    canUpdatePayTermValue = dateDiff > moment(calculateDate).diff(this.invoiceDateSelected) ? true : false;
                }
                if (canUpdatePayTermValue) {
                    paymentDateToSet = calculateDate.toDate();
                    paymentTermToSet = contract.paymentTermCode;
                    dateDiff = moment(calculateDate).diff(this.invoiceDateSelected);
                    this.paymentTermsDescription = selectedPaymentTerm.description;
                }
            }
        });
        if (paymentDateToSet) {
            this.invoiceDueDateCtrl.patchValue(paymentDateToSet);
            this.invoicePayTermsCtrl.patchValue(paymentTermToSet);
        }
    }

    onInvoiceDueDateSelected() {
        this.invoiceDueDateCtrl.clearValidators();
        this.invoiceDueDateCtrl.setValidators(
            Validators.compose([invoiceDateValidation(this.invoiceDueDateCtrl.value,
                moment(this.invoiceDateChanged)), Validators.required]));
        this.invoiceDueDateCtrl.updateValueAndValidity();
    }

    populateEntity(entity: InvoiceRecord): InvoiceRecord {
        const payments = entity as InvoiceRecord;
        payments.paymentTerms = this.invoicePayTermsCtrl.value;
        payments.dueDate = this.invoiceDueDateCtrl.value;
        return payments;
    }

    setPaymentFieldsForSummary(model) {
        this.invoicePayTermsCtrl.patchValue(model.paymentTerms);
        this.invoiceDueDateCtrl.patchValue(model.dueDate);
    }

    setValuesForSummaryFromGrid(summaryRecord: InvoiceSummaryRecord) {
        this.invoicePayTermsCtrl.patchValue(summaryRecord.paymentTermsCode);
        this.invoiceDueDateCtrl.patchValue(summaryRecord.dueDate);
    }
}
