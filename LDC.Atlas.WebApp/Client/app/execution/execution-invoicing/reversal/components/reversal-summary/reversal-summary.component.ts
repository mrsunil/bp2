import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { BaseFormComponent } from '../../../../../shared/components/base-form-component/base-form-component.component';
import { InvoiceSetupResult } from '../../../../../shared/dtos/invoice-setup-result';
import { InvoiceTypes } from '../../../../../shared/enums/invoice-type.enum';
import { InvoiceSummaryRecord } from '../../../../../shared/services/execution/dtos/invoice-summary-record';
import { FormConfigurationProviderService } from '../../../../../shared/services/form-configuration-provider.service';
import { SnackbarService } from '../../../../../shared/services/snackbar.service';
import { CommercialSummaryComponent } from '../../../commercial/components/summary/commercial-summary.component';
import { CostSummaryComponent } from '../../../cost/components/summary/cost-summary.component';
import { GoodsCostSummaryComponent } from '../../../goods-cost/components/goods-cost-summary/goods-cost-summary.component';
import { WashoutSummaryComponent } from '../../../washout/components/washout-summary/washout-summary.component';

@Component({
    selector: 'atlas-reversal-summary',
    templateUrl: './reversal-summary.component.html',
    styleUrls: ['./reversal-summary.component.scss'],
})
export class ReversalSummaryComponent extends BaseFormComponent implements OnInit {

    @ViewChild('commercialSummaryComponent') commercialSummaryComponent: CommercialSummaryComponent;
    @ViewChild('costSummaryComponent') costSummaryComponent: CostSummaryComponent;
    @ViewChild('goodsCostSummaryComponent') goodsCostSummaryComponent: GoodsCostSummaryComponent;
    @ViewChild('washoutSummaryComponent') washoutSummaryComponent: WashoutSummaryComponent;
    @Input() isCreationMode: boolean;
    @Input() invoiceTypeId: number = 0;
    createInvoiceFormGroup: FormGroup;
    InvoiceTypes = InvoiceTypes;
    company: string;
    invoiceLabel: string;
    invoiceId: number;
    selectedInvoiceId: number;
    isFromGrid: boolean = false;
    summaryRecord: InvoiceSummaryRecord;
    defaultVATCode: string;

    constructor(private route: ActivatedRoute,
        protected snackbarService: SnackbarService,
        protected dialog: MatDialog,
        protected formConfigurationProvider: FormConfigurationProviderService,
    ) {
        super(formConfigurationProvider);
        this.invoiceId = Number(decodeURIComponent(this.route.snapshot.paramMap.get('invoiceId')));
    }

    ngOnInit() {
    }

    populateInvoiceRecord(
        invoice: InvoiceSummaryRecord,
        invoiceSetup: InvoiceSetupResult) {
        this.defaultVATCode = invoiceSetup.defaultVATCode;
        if (invoice) {
            switch (this.invoiceTypeId) {
                case InvoiceTypes.Purchase:
                    this.commercialSummaryComponent.setSummaryFieldsFromGrid(invoice);
                    break;
                case InvoiceTypes.Sales:
                    this.commercialSummaryComponent.setSummaryFieldsFromGrid(invoice);
                    break;
                case InvoiceTypes.GoodsCostPurchase:
                    this.goodsCostSummaryComponent.setSummaryFieldsFromGrid(invoice);
                    break;
                case InvoiceTypes.GoodsCostSales:
                    this.goodsCostSummaryComponent.setSummaryFieldsFromGrid(invoice);
                    break;
                case InvoiceTypes.Cost:
                case InvoiceTypes.CostReceivable:
                case InvoiceTypes.CostDebitNote:
                case InvoiceTypes.CostCreditNote:
                    this.costSummaryComponent.setSummaryFieldsFromGrid(invoice);
                    break;
                case InvoiceTypes.Washout:
                    this.washoutSummaryComponent.setSummaryFieldsFromGrid(invoice);
                    break;
                default: // throw Action not recognized exception
                    break;
            }
        }
    }
}
