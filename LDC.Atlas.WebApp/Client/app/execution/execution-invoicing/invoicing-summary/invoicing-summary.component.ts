import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { BaseFormComponent } from '../../../shared/components/base-form-component/base-form-component.component';
import { InvoiceTypes } from '../../../shared/enums/invoice-type.enum';
import { InvoiceSummaryRecord } from '../../../shared/services/execution/dtos/invoice-summary-record';
import { FormConfigurationProviderService } from '../../../shared/services/form-configuration-provider.service';
import { ExecutionService } from '../../../shared/services/http-services/execution.service';
import { SnackbarService } from '../../../shared/services/snackbar.service';
import { TitleService } from '../../../shared/services/title.service';
import { CommercialSummaryComponent } from '../commercial/components/summary/commercial-summary.component';
import { CostSummaryComponent } from '../cost/components/summary/cost-summary.component';
import { GoodsCostSummaryComponent } from '../goods-cost/components/goods-cost-summary/goods-cost-summary.component';
import { WashoutSummaryComponent } from '../washout/components/washout-summary/washout-summary.component';

@Component({
    selector: 'atlas-invoicing-summary',
    templateUrl: './invoicing-summary.component.html',
    styleUrls: ['./invoicing-summary.component.scss'],
})
export class InvoicingSummaryComponent extends BaseFormComponent implements OnInit {
    private formComponents: BaseFormComponent[] = [];

    @ViewChild('commercialSummaryComponent') commercialSummaryComponent: CommercialSummaryComponent;
    @ViewChild('costSummaryComponent') costSummaryComponent: CostSummaryComponent;
    @ViewChild('goodsCostSummaryComponent') goodsCostSummaryComponent: GoodsCostSummaryComponent;
    @ViewChild('washoutSummaryComponent') washoutSummaryComponent: WashoutSummaryComponent;

    createInvoiceFormGroup: FormGroup;
    InvoiceTypes = InvoiceTypes;
    company: string;
    invoiceTypeId: number;
    originalInvoiceTypeId: number = 0;
    invoiceLabel: string;
    invoiceId: number;
    isFromGrid: boolean = false;
    summaryRecord: InvoiceSummaryRecord;
    defaultVATCode: string;
    isCreationMode: boolean = false;
    isLoading = true;
    invoiceTypeForReversal: number;

    constructor(private executionService: ExecutionService,
        private route: ActivatedRoute,
        protected snackbarService: SnackbarService,
        private formBuilder: FormBuilder,
        protected dialog: MatDialog,
        protected formConfigurationProvider: FormConfigurationProviderService,
        private titleService: TitleService,
    ) {
        super(formConfigurationProvider);
        this.invoiceId = Number(decodeURIComponent(this.route.snapshot.paramMap.get('invoiceId')));
    }

    ngOnInit() {
        this.company = this.route.snapshot.paramMap.get('company');
        this.route.queryParams.subscribe((params) => {
            this.invoiceTypeId = Number(params['invoiceType']);
            this.originalInvoiceTypeId = Number(params['originalInvoiceType']);
        });
        if (this.invoiceId && this.invoiceTypeId) {
            if (this.invoiceTypeId === InvoiceTypes.Reversal) {
                this.invoiceTypeForReversal = this.invoiceTypeId;
                this.invoiceTypeId = this.originalInvoiceTypeId;
            }
            this.launchSelectedInvoiceSummary();
            this.getInvoiceSetupByCompany();
        }
    }

    @HostListener('window:beforeunload', ['$event']) unloadNotification($event: any) {
        if (this.createInvoiceFormGroup.dirty) {
            $event.returnValue = true;
        }
    }

    launchSelectedInvoiceSummary() {
        this.subscriptions.push(this.executionService.
            getInvoiceById(this.invoiceId)
            .subscribe((data) => {
                data.originalInvoiceType = this.originalInvoiceTypeId;
                if (this.invoiceTypeId === InvoiceTypes.Reversal || this.invoiceTypeForReversal === InvoiceTypes.Reversal) {
                    data.invoiceDate = data.reversedDocumentDate;
                    data.invoiceType = InvoiceTypes.Reversal;
                }
                this.isLoading = false;
                this.titleService.setTitle(data.invoiceCode + ' - Invoice View');
                switch (this.invoiceTypeId) {
                    case InvoiceTypes.Purchase:
                    case InvoiceTypes.Sales:
                        this.commercialSummaryComponent.setSummaryFieldsFromGrid(data);
                        break;
                    case InvoiceTypes.Cost:
                    case InvoiceTypes.CostReceivable:
                    case InvoiceTypes.CostCreditNote:
                    case InvoiceTypes.CostDebitNote:
                        this.invoiceTypeId = Number(InvoiceTypes.Cost);
                        this.costSummaryComponent.setSummaryFieldsFromGrid(data);
                        break;
                    case InvoiceTypes.Washout:
                    case InvoiceTypes.WashoutDebitNote:
                        this.invoiceTypeId = Number(InvoiceTypes.Washout);
                        this.washoutSummaryComponent.setSummaryFieldsFromGrid(data);
                        break;
                    case InvoiceTypes.GoodsCostPurchase:
                    case InvoiceTypes.GoodsCostSales:
                        this.goodsCostSummaryComponent.setSummaryFieldsFromGrid(data);
                        break;
                    case InvoiceTypes.Cancelled:
                        this.invoiceTypeId = Number(InvoiceTypes.Washout);
                        this.washoutSummaryComponent.setSummaryFieldsFromGrid(data);
                        break;
                    default: // throw Action not recognized exception
                        break;
                }
            }));
    }

    getInvoiceSetupByCompany() {
        this.subscriptions.push(this.executionService.getInvoiceSetupByCompany()
            .subscribe((data) => {
                this.defaultVATCode = data.defaultVATCode;
            }));
    }

    isCommercial() {
        return this.invoiceTypeId === Number(InvoiceTypes.Purchase)
            || this.invoiceTypeId === Number(InvoiceTypes.Sales);
    }

    isCost() {
        return this.invoiceTypeId === Number(InvoiceTypes.Cost)
            || this.invoiceTypeId === Number(InvoiceTypes.CostReceivable)
            || this.invoiceTypeId === Number(InvoiceTypes.CostCreditNote)
            || this.invoiceTypeId === Number(InvoiceTypes.CostDebitNote);
    }

    isGoodsCost() {
        return this.invoiceTypeId === Number(InvoiceTypes.GoodsCostPurchase)
            || this.invoiceTypeId === Number(InvoiceTypes.GoodsCostSales);
    }

    isWashout() {
        return this.invoiceTypeId === Number(InvoiceTypes.Washout)
            || this.invoiceTypeId === Number(InvoiceTypes.WashoutDebitNote)
            || this.invoiceTypeId === Number(InvoiceTypes.Cancelled);
    }
}
