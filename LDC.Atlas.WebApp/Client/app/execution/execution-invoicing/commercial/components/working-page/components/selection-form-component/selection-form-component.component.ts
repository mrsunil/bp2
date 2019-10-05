import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import * as _moment from 'moment';
import { Moment } from 'moment';
import { CompanyManagerService } from '../../../../../../../core/services/company-manager.service';
import { BaseFormComponent } from '../../../../../../../shared/components/base-form-component/base-form-component.component';
import { invoiceDateValidation } from '../../../../../../../shared/validators/date-validators.validator';
import { AtlasFormControl } from '../../../../../../../shared/entities/atlas-form-control';
import { MasterData } from '../../../../../../../shared/entities/masterdata.entity';
import { ContractsToInvoice } from '../../../../../../../shared/services/execution/dtos/contracts-to-invoice';
import { InvoiceRecord } from '../../../../../../../shared/services/execution/dtos/invoice-record';
import { FormConfigurationProviderService } from '../../../../../../../shared/services/form-configuration-provider.service';
const moment = _moment;
@Component({
    selector: 'atlas-selection-form-component',
    templateUrl: './selection-form-component.component.html',
    styleUrls: ['./selection-form-component.component.scss'],
})
export class SelectionFormComponentComponent extends BaseFormComponent implements OnInit {
    @Output() readonly invoiceDateSelected = new EventEmitter<Date>();

    invoiceDateCtrl = new AtlasFormControl('InvoiceSelectionDate');
    invoiceTypeCtrl = new AtlasFormControl('InvoiceSelected');
    counterpartyCtrl = new AtlasFormControl('Counterparty');
    costCommissionCtrl = new AtlasFormControl('CostCommission');
    quantityInvoiceCtrl = new AtlasFormControl('QuantityInvoice');
    authorizePostingCtrl = new AtlasFormControl('AuthorizePosting');

    invoiceTypeId: number;
    invoiceTypeDescription: string;
    masterdata: MasterData = new MasterData();
    invoiceDate: Date = this.companyManager.getCurrentCompanyDate().toDate();
    dates: Date[];
    maxDate: Moment;
    isDateAfterValid: boolean;
    company: string;
    isAuthorizeForPosting: boolean;

    constructor(
        private route: ActivatedRoute,
        protected formBuilder: FormBuilder,
        protected companyManager: CompanyManagerService,
        protected formConfigurationProvider: FormConfigurationProviderService) {
        super(formConfigurationProvider);
    }

    ngOnInit() {
        this.invoiceDateCtrl.setValue(this.companyManager.getCurrentCompanyDate().toDate());
        this.invoiceDateSelected.emit(this.invoiceDateCtrl.value);
        this.invoiceTypeId = Number(decodeURIComponent(this.route.snapshot.paramMap.get('invoiceTypeId')));
        this.company = this.route.snapshot.paramMap.get('company');
        this.masterdata = this.route.snapshot.data.masterdata;
        this.getData();
    }

    getData() {
        this.invoiceTypeDescription = this.masterdata.
            invoiceTypes.find((x) => x.invoiceTypeId === this.invoiceTypeId).description;
        this.invoiceTypeCtrl.patchValue(this.invoiceTypeDescription);
        this.authorizePostingCtrl.setValue(this.isAuthorizeForPosting);
    }
    setDefaultAuthorizeForPosting(defaultAuthorizeForPosting: boolean) {
        this.isAuthorizeForPosting = defaultAuthorizeForPosting;
        this.authorizePostingCtrl.setValue(this.isAuthorizeForPosting);
    }
    contractToBeSelected(contracts: ContractsToInvoice[]) {
        if (contracts.length > 0) {
            this.counterpartyCtrl.patchValue(contracts[0].counterparty);
        }
        this.setInvoiceDate(contracts);
    }
    setInvoiceDate(contracts: ContractsToInvoice[]) {
        this.dates = Array.from(contracts, (x) => x.contractDate);
        const moments = this.dates.map((d) => moment(d)),
            maxDate = moment.max(moments);
        this.maxDate = maxDate;
    }
    onInvoiceDateSelected() {
        this.invoiceDate = new Date(this.invoiceDateCtrl.value);
        this.invoiceDateCtrl.clearValidators();
        this.isDateAfterValid = false;
        this.invoiceFutureValidation(this.invoiceDate);
        this.invoiceDateCtrl.setValidators(
            Validators.compose([invoiceDateValidation(this.invoiceDate, this.maxDate)]));
        this.invoiceDateCtrl.updateValueAndValidity();
        this.invoiceDateSelected.emit(this.invoiceDate);
    }

    getFormGroup() {
        this.formGroup = this.formBuilder.group({
            invoiceDateCtrl: this.invoiceDateCtrl,
            authorizePostingCtrl: this.authorizePostingCtrl,
        });
        return super.getFormGroup();
    }

    invoiceFutureValidation(invoiceDate) {
        const invoiceMoment: Moment = moment(invoiceDate);
        if (invoiceMoment.isAfter(this.companyManager.getCurrentCompanyDate())) {
            this.isDateAfterValid = true;
        }
    }
    populateEntity(entity: any): any {
        const invoiceSelection = entity as InvoiceRecord;
        invoiceSelection.invoiceDate = this.invoiceDateCtrl.value;
        invoiceSelection.counterpartyCode = this.counterpartyCtrl.value;
        invoiceSelection.authorizedForPosting = this.authorizePostingCtrl.value;
        return invoiceSelection;
    }
}
