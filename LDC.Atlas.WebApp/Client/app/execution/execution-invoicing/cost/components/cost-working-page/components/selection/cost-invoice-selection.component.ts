import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import * as _moment from 'moment';
import { Moment } from 'moment';
import { CompanyManagerService } from '../../../../../../../core/services/company-manager.service';
import { BaseFormComponent } from '../../../../../../../shared/components/base-form-component/base-form-component.component';
import { AtlasFormControl } from '../../../../../../../shared/entities/atlas-form-control';
import { MasterData } from '../../../../../../../shared/entities/masterdata.entity';
import { ContractsToCostInvoice } from '../../../../../../../shared/services/execution/dtos/contracts-to-cost-invoice';
import { InvoiceRecord } from '../../../../../../../shared/services/execution/dtos/invoice-record';
import { FormConfigurationProviderService } from '../../../../../../../shared/services/form-configuration-provider.service';
import { invoiceDateValidation } from '../../../../../../../shared/validators/date-validators.validator';

const moment = _moment;

@Component({
    selector: 'atlas-cost-invoice-selection',
    templateUrl: './cost-invoice-selection.component.html',
    styleUrls: ['./cost-invoice-selection.component.scss'],
})
export class CostInvoiceSelectionComponent extends BaseFormComponent implements OnInit {
    @Output() readonly invoiceDateSelected = new EventEmitter<Date>();

    costInvoiceDateCtrl = new AtlasFormControl('CostInvoiceDateCtrl');
    counterpartyCtrl = new AtlasFormControl('CounterParty');
    costInvoiceTypeCtrl = new AtlasFormControl('InvoiceType');
    authorizePostingCtrl = new AtlasFormControl('AuthorizeForPosting');
    company: string;
    invoiceTypeDescription: string;
    invoiceSelectDescription: string;
    masterdata: MasterData = new MasterData();
    selectedGroup: string;
    costInvoiceTypeName: string = 'Cost';

    invoiceDate: Date = this.companyManager.getCurrentCompanyDate().toDate();
    dates: Date[];
    maxDate: Moment;
    isDateAfterValid: boolean;
    constructor(
        private route: ActivatedRoute,
        protected formBuilder: FormBuilder,
        protected companyManager: CompanyManagerService,
        protected formConfigurationProvider: FormConfigurationProviderService) {
        super(formConfigurationProvider);
    }

    ngOnInit() {
        this.costInvoiceDateCtrl.setValue(this.companyManager.getCurrentCompanyDate().toDate());
        this.invoiceDateSelected.emit(this.costInvoiceDateCtrl.value);
        this.masterdata = this.route.snapshot.data.masterdata;
        this.getData();
    }
    getData() {
        this.costInvoiceTypeCtrl.patchValue(this.costInvoiceTypeName);
    }

    setDefaultAuthorizeForPosting(defaultAuthorizeForPosting: boolean) {
        this.authorizePostingCtrl.setValue(defaultAuthorizeForPosting);
    }

    getFormGroup() {
        this.formGroup = this.formBuilder.group({
            costInvoiceDateCtrl: this.costInvoiceDateCtrl,
            counterpartyCtrl: this.counterpartyCtrl,
            costInvoiceTypeCtrl: this.costInvoiceTypeCtrl,
            authorizePostingCtrl: this.authorizePostingCtrl,
        });
        return super.getFormGroup();
    }
    contractToBeSelected(costContracts: ContractsToCostInvoice[]) {
        this.setInvoiceDate(costContracts);
    }
    setInvoiceDate(costContracts: ContractsToCostInvoice[]) {
        this.dates = Array.from(costContracts, (contracts) => contracts.contractDate);
        const moments = this.dates.map((date) => moment(date)),
            maxDate = moment.max(moments);
        this.maxDate = maxDate;
    }
    onCostInvoiceDateSelected() {
        this.invoiceDate = new Date(this.costInvoiceDateCtrl.value);
        this.costInvoiceDateCtrl.clearValidators();
        this.isDateAfterValid = false;
        this.invoiceFutureValidation(this.invoiceDate);
        this.costInvoiceDateCtrl.setValidators(
            Validators.compose([invoiceDateValidation(this.invoiceDate, this.maxDate)]));
        this.costInvoiceDateCtrl.updateValueAndValidity();
        this.invoiceDateSelected.emit(this.invoiceDate);
    }
    invoiceFutureValidation(invoiceDate) {
        const invoiceMoment: Moment = moment(invoiceDate);
        if (invoiceMoment.isAfter(this.companyManager.getCurrentCompanyDate())) {
            this.isDateAfterValid = true;
        }
    }
    populateEntity(entity: InvoiceRecord): InvoiceRecord {
        const invoiceSelection = entity;
        invoiceSelection.invoiceDate = this.costInvoiceDateCtrl.value;
        invoiceSelection.authorizedForPosting = this.authorizePostingCtrl.value;
        return invoiceSelection;
    }

    onUserSupplierValueChanged(userSupplier) {
        const selectedCounterparty = this.masterdata.counterparties.find(
            (counterparty) => counterparty.counterpartyCode === userSupplier,
        );
        if (selectedCounterparty) {
            const cpDescription = selectedCounterparty.description;
            const cpSelected = userSupplier.concat('|').concat(cpDescription);
            this.counterpartyCtrl.setValue(cpSelected);
        }
    }
}
