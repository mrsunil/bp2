import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import * as _moment from 'moment';
import { CompanyManagerService } from '../../../../../../../core/services/company-manager.service';
import { BaseFormComponent } from '../../../../../../../shared/components/base-form-component/base-form-component.component';
import { AtlasFormControl } from '../../../../../../../shared/entities/atlas-form-control';
import { MasterData } from '../../../../../../../shared/entities/masterdata.entity';
import { ContractsToWashoutInvoice } from '../../../../../../../shared/services/execution/dtos/contracts-to-washout-invoice';
import { InvoiceRecord } from '../../../../../../../shared/services/execution/dtos/invoice-record';
import { FormConfigurationProviderService } from '../../../../../../../shared/services/form-configuration-provider.service';
import { invoiceDateValidation } from '../../../../../../../shared/validators/date-validators.validator';
const moment = _moment;

@Component({
    selector: 'atlas-selection',
    templateUrl: './selection.component.html',
    styleUrls: ['./selection.component.scss'],
})
export class SelectionComponent extends BaseFormComponent implements OnInit {
    washoutInvoiceDateCtrl = new AtlasFormControl('WashoutInvoiceDateCtrl');
    counterpartyCtrl = new AtlasFormControl('WashoutCounterParty');
    washoutInvoiceTypeCtrl = new AtlasFormControl('WashoutInvoiceType');
    authorizePostingCtrl = new AtlasFormControl('WashoutAuthorizeForPosting');
    company: string;
    invoiceTypeDescription: string;
    invoiceSelectDescription: string;
    masterdata: MasterData = new MasterData();
    selectedGroup: string;
    invoiceDate: Date = this.companyManager.getCurrentCompanyDate().toDate();
    dates: Date[];
    maxDate: _moment.Moment;
    isDateAfterValid: boolean;
    @Output() readonly invoiceDateChanged = new EventEmitter<Date>();

    constructor(
        private route: ActivatedRoute,
        protected formBuilder: FormBuilder,
        protected companyManager: CompanyManagerService,
        protected formConfigurationProvider: FormConfigurationProviderService) {
        super(formConfigurationProvider);
    }

    ngOnInit() {
        this.washoutInvoiceDateCtrl.setValue(this.companyManager.getCurrentCompanyDate().toDate());
        this.masterdata = this.route.snapshot.data.masterdata;
        this.getData();
    }

    getData() {
        const invoiceTypeId = Number(decodeURIComponent(this.route.snapshot.paramMap.get('invoiceTypeId')));
        this.invoiceTypeDescription = this.masterdata.
            invoiceTypes.find((invoiceType) => invoiceType.invoiceTypeId === invoiceTypeId).name;
        this.washoutInvoiceTypeCtrl.patchValue(this.invoiceTypeDescription);
    }

    setDefaultAuthorizeForPosting(defaultAuthorizeForPosting: boolean) {
        this.authorizePostingCtrl.setValue(defaultAuthorizeForPosting);
    }

    getFormGroup() {
        this.formGroup = this.formBuilder.group({
            washoutInvoiceDateCtrl: this.washoutInvoiceDateCtrl,
            counterpartyCtrl: this.counterpartyCtrl,
            washoutInvoiceTypeCtrl: this.washoutInvoiceTypeCtrl,
            authorizePostingCtrl: this.authorizePostingCtrl,
        });
        return super.getFormGroup();
    }

    selectedWashoutContracts(washoutContracts: ContractsToWashoutInvoice[]) {
        this.setInvoiceDate(washoutContracts);
    }

    setInvoiceDate(washoutContracts: ContractsToWashoutInvoice[]) {
        this.dates = Array.from(washoutContracts, (contracts) => contracts.contractDate);
        const moments = this.dates.map((date) => moment(date)),
            maxDate = moment.max(moments);
        this.maxDate = maxDate;
    }
    counterPartySelected(counterPartySelected) {
        this.counterpartyCtrl.patchValue(this.masterdata.counterparties.find(
            (counterParty) => counterParty.counterpartyCode === counterPartySelected).description);
    }
    onWashoutInvoiceDateSelected() {
        this.invoiceDate = new Date(this.washoutInvoiceDateCtrl.value);
        this.washoutInvoiceDateCtrl.clearValidators();
        this.isDateAfterValid = false;
        this.invoiceFutureValidation(this.invoiceDate);
        this.washoutInvoiceDateCtrl.setValidators(
            Validators.compose([invoiceDateValidation(this.invoiceDate, this.maxDate)]));
        this.washoutInvoiceDateCtrl.updateValueAndValidity();
        if (this.washoutInvoiceDateCtrl.valid) {
        this.invoiceDateChanged.emit(this.washoutInvoiceDateCtrl.value);
        }
    }

    invoiceFutureValidation(invoiceDate) {
        const invoiceMoment: _moment.Moment = moment(invoiceDate);
        if (invoiceMoment.isAfter(this.companyManager.getCurrentCompanyDate())) {
            this.isDateAfterValid = true;
        }
    }

    populateEntity(entity: InvoiceRecord): InvoiceRecord {
        const invoiceSelection = entity;
        invoiceSelection.invoiceDate = this.washoutInvoiceDateCtrl.value;
        invoiceSelection.authorizedForPosting = this.authorizePostingCtrl.value;
        if (this.masterdata) {
            const requiredCounterParty = this.masterdata.counterparties.find(
                (counterParty) => counterParty.description === this.counterpartyCtrl.value);
            if (requiredCounterParty) {
                invoiceSelection.counterpartyCode = requiredCounterParty.counterpartyCode;
            }
        }
        return invoiceSelection;
    }
}
