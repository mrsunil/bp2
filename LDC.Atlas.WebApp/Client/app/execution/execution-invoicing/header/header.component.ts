import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BaseFormComponent } from '../../../shared/components/base-form-component/base-form-component.component';
import { AtlasFormControl } from '../../../shared/entities/atlas-form-control';
import { MasterData } from '../../../shared/entities/masterdata.entity';
import { InvoiceSourceType } from '../../../shared/enums/invoice-source-type.enum';
import { InvoiceTypes } from '../../../shared/enums/invoice-type.enum';
import { QuantityToInvoiceType } from '../../../shared/enums/quantity-to-invoice.enum';
import { InvoiceRecord } from '../../../shared/services/execution/dtos/invoice-record';
import { FormConfigurationProviderService } from '../../../shared/services/form-configuration-provider.service';

@Component({
    selector: 'atlas-execution-invoicing-summary-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
})

export class HeaderComponent extends BaseFormComponent implements OnInit {
    @Input() isCreationMode: boolean;
    invoiceDateCtrl = new AtlasFormControl('invoiceDateCtrl');
    counterpartyCtrl = new AtlasFormControl('counterpartyCtrl');
    invoiceExtRefCtrl = new AtlasFormControl('invoiceExtRefCtrl');
    invoiceTypeCtrl = new AtlasFormControl('invoiceTypeCtrl');
    bankingInformationCtrl = new AtlasFormControl('bankingInformationCtrl');
    model: InvoiceRecord;
    invoiceLabel: string;
    invoiceType: string;
    externalHouse: string;
    quantityToInvoice: string;
    invoiceExternalReference: string;
    invoiceTypeId: number;
    reversalInvoiceTypeId: number;
    masterdata: MasterData = new MasterData();
    newInvoiceReference: string = '';

    constructor(protected formBuilder: FormBuilder,
        private route: ActivatedRoute,
        protected formConfigurationProvider: FormConfigurationProviderService) {
        super(formConfigurationProvider);
    }

    ngOnInit() {
        this.masterdata = this.route.snapshot.data.masterdata;
        this.bankingInformationCtrl.disable();
        this.reversalInvoiceTypeId = InvoiceTypes.Reversal;
        this.invoiceTypeId = Number(decodeURIComponent(this.route.snapshot.paramMap.get('invoiceTypeId')));
        const invoiceId = Number(decodeURIComponent(this.route.snapshot.paramMap.get('invoiceId')));
        if (invoiceId) {
            this.route.queryParams.subscribe((params) => {
                this.invoiceTypeId = Number(params['invoiceType']);
            });
        }
    }

    populateInvoiceRecord(record) {
        this.model = record;
        this.externalHouse = InvoiceTypes[String(this.model.externalInhouse)];
        this.invoiceLabel = this.model.invoiceLabel;
    }

    getFormGroup() {
        this.formGroup = this.formBuilder.group({
            invoiceDateCtrl: this.invoiceDateCtrl,
            counterpartyCtrl: this.counterpartyCtrl,
            invoiceExtRefCtrl: this.invoiceExtRefCtrl,
            invoiceTypeCtrl: this.invoiceTypeCtrl,
        });
        return super.getFormGroup();
    }

    setHeaderFieldsForSummary(model, bankAccounts) {
        if (model) {
            this.invoiceDateCtrl.patchValue(model.invoiceDate);
            this.counterpartyCtrl.patchValue(model.counterpartyCode);
            this.invoiceExtRefCtrl.patchValue(model.externalInvoiceRef);
            this.invoiceLabel = model.invoiceLabel;
            if (model.reversedInvoiceReference) {
                this.newInvoiceReference = model.reversedInvoiceReference;
            }
            this.externalHouse = InvoiceSourceType[model.externalInhouse];
            this.quantityToInvoice = QuantityToInvoiceType[model.quantityToInvoiceType];
            if (this.masterdata) {
                const invoiceType = this.masterdata.
                    invoiceTypes.find((invoice) => invoice.invoiceTypeId === Number(model.invoiceType));
                if (invoiceType) {
                    this.setInvoiceTypeForSummary(invoiceType, model);
                }
            }
            if (bankAccounts && model.bankAccountId) {
                const filteredBankAccounts = bankAccounts.filter((account) =>
                    account.bankAccountId === model.bankAccountId);
                (filteredBankAccounts.length > 0) ? this.bankingInformationCtrl.patchValue(filteredBankAccounts[0].bankName) :
                    null;
            } else if (model.bankAccountId) {
                this.bankingInformationCtrl.patchValue(model.bankAccountId);
            }
        }
    }

    setHeaderFieldsFromGrid(summaryRecord) {
        if (this.masterdata) {
            const invoiceType = this.masterdata.
                invoiceTypes.find((invoice) => invoice.invoiceTypeId === summaryRecord.invoiceType);
            if (invoiceType) {
                this.setInvoiceTypeForSummary(invoiceType, summaryRecord);
            }
        }
        this.invoiceDateCtrl.patchValue(summaryRecord.invoiceDate);
        this.counterpartyCtrl.patchValue(summaryRecord.counterparty);
        this.invoiceExtRefCtrl.patchValue(summaryRecord.externalInvoiceReference);
        this.bankingInformationCtrl.patchValue(summaryRecord.clientAccount);
        if (summaryRecord.reversedInvoiceReference) {
            this.newInvoiceReference = summaryRecord.reversedInvoiceReference;
        }
        this.invoiceLabel = summaryRecord.invoiceCode;
        this.externalHouse = InvoiceSourceType[summaryRecord.externalInhouse];
        this.quantityToInvoice = QuantityToInvoiceType[summaryRecord.quantityToInvoiceType];
    }

    setInvoiceTypeForSummary(invoiceType, summaryRecord) {
        this.invoiceType = (invoiceType.invoiceTypeId === InvoiceTypes.GoodsCostPurchase ||
            invoiceType.invoiceTypeId === InvoiceTypes.GoodsCostSales ||
            invoiceType.invoiceTypeId === InvoiceTypes.Washout) ? invoiceType.name : InvoiceTypes[Number(summaryRecord.invoiceType)];

        if (summaryRecord.invoiceType === InvoiceTypes.Cost ||
            summaryRecord.invoiceType === InvoiceTypes.CostReceivable ||
            summaryRecord.invoiceType === InvoiceTypes.CostCreditNote ||
            summaryRecord.invoiceType === InvoiceTypes.CostDebitNote) {
            this.invoiceType = InvoiceTypes[Number(InvoiceTypes.Cost)];
        }
    }
}
