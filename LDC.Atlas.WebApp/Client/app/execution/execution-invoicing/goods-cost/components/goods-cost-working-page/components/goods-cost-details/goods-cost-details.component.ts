import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import * as _moment from 'moment';
import { Moment } from 'moment';
import { CompanyManagerService } from '../../../../../../../core/services/company-manager.service';
import { BaseFormComponent } from '../../../../../../../shared/components/base-form-component/base-form-component.component';
import { AtlasFormControl } from '../../../../../../../shared/entities/atlas-form-control';
import { MasterData } from '../../../../../../../shared/entities/masterdata.entity';
import { ContractsToInvoice } from '../../../../../../../shared/services/execution/dtos/contracts-to-invoice';
import { InvoiceRecord } from '../../../../../../../shared/services/execution/dtos/invoice-record';
import { FormConfigurationProviderService } from '../../../../../../../shared/services/form-configuration-provider.service';
import { invoiceDateValidation } from '../../../../../../../shared/validators/date-validators.validator';
const moment = _moment;

@Component({
    selector: 'atlas-goods-cost-details',
    templateUrl: './goods-cost-details.component.html',
    styleUrls: ['./goods-cost-details.component.scss'],
})

export class GoodsCostDetailsComponent extends BaseFormComponent implements OnInit {
    @Output() readonly invoiceDateSelected = new EventEmitter<Date>();

    invoiceDateCtrl = new AtlasFormControl('InvoiceSelectionDate');
    invoiceTypeCtrl = new AtlasFormControl('InvoiceSelected');
    counterpartyCtrl = new AtlasFormControl('Counterparty');
    costCommissionCtrl = new AtlasFormControl('CostCommission');
    quantityInvoiceCtrl = new AtlasFormControl('QuantityInvoice');
    authorizePostingCtrl = new AtlasFormControl('AuthorizePosting');

    invoiceTypeId: number;
    invoiceTypeName: string;
    masterData: MasterData = new MasterData();
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
        this.invoiceDateCtrl.setValue(this.invoiceDate);
        this.invoiceDateSelected.emit(this.invoiceDateCtrl.value);
        this.invoiceTypeId = Number(decodeURIComponent(this.route.snapshot.paramMap.get('invoiceTypeId')));
        this.company = this.route.snapshot.paramMap.get('company');
        this.masterData = this.route.snapshot.data.masterdata;
        this.getData();
    }

    getData() {
        if (this.masterData) {
            const invoiceType = this.masterData.
                invoiceTypes.find((invoice) => invoice.invoiceTypeId === this.invoiceTypeId);
            if (invoiceType) {
                this.invoiceTypeName = invoiceType.name;
                this.invoiceTypeCtrl.patchValue(this.invoiceTypeName);
            }
        }
        if (this.isAuthorizeForPosting) {
            this.authorizePostingCtrl.setValue(this.isAuthorizeForPosting);
        } else {
            this.authorizePostingCtrl.setValue(false);
        }
    }

    setDefaultAuthorizeForPosting(defaultAuthorizeForPosting: boolean) {
        this.isAuthorizeForPosting = defaultAuthorizeForPosting ? true : false;
        this.authorizePostingCtrl.setValue(this.isAuthorizeForPosting);
    }

    contractToBeSelected(contracts: ContractsToInvoice[]) {
        if (contracts.length > 0) {
            const counterparty = this.masterData.counterparties.find(
                (item) => item.counterpartyCode === contracts[0].counterparty);
            if (counterparty) {
                this.counterpartyCtrl.patchValue(counterparty.description);
            }
            this.setInvoiceDate(contracts);
        }
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

    populateEntity(entity: InvoiceRecord): InvoiceRecord {
        const invoiceSelection = entity as InvoiceRecord;
        invoiceSelection.invoiceDate = this.invoiceDateCtrl.value;
        invoiceSelection.authorizedForPosting = this.authorizePostingCtrl.value;
        if (this.masterData) {
            const counterParty = this.masterData.counterparties.find(
                (counterParty) => counterParty.description === this.counterpartyCtrl.value);
            if (counterParty) {
                invoiceSelection.counterpartyCode = counterParty.counterpartyCode;
            }
        }
        return invoiceSelection;
    }

}
