import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { CompanyManagerService } from '../../core/services/company-manager.service';
import { BaseFormComponent } from '../../shared/components/base-form-component/base-form-component.component';
import { ConfirmationDialogComponent } from '../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { InvoiceTypes } from '../../shared/enums/invoice-type.enum';
import { FormConfigurationProviderService } from '../../shared/services/form-configuration-provider.service';
import { TitleService } from '../../shared/services/title.service';
import { InvoiceSelectionFormComponent } from '../execution-invoicing/commercial/components/commercial-selection/components/invoice-selection-form-component/invoice-selection-form-component.component';
import { CostFormComponentComponent } from './components/cost-form-component/cost-form-component.component';
import { PurchaseGoodsFormComponentComponent } from './components/purchase-goods-form-component/purchase-goods-form-component.component';
import { QuantityInvoiceFormComponentComponent } from './components/quantity-invoice-form-component/quantity-invoice-form-component.component';
import { ReversalFormComponent } from './components/reversal-form-component/reversal-form-component.component';
import { SalesGoodsFormComponentComponent } from './components/sales-goods-form-component/sales-goods-form-component.component';
import { WashoutFormComponent } from './components/washout-form-component/washout-form-component.component';

@Component({
    selector: 'atlas-execution-invoicing-create',
    templateUrl: './execution-invoicing-create.component.html',
    styleUrls: ['./execution-invoicing-create.component.scss'],
})
export class ExecutionInvoicingCreateComponent extends BaseFormComponent implements OnInit {

    private formComponents: BaseFormComponent[] = [];
    invoiceCreationFormGroup: FormGroup;
    invoiceOption: number;
    isPurchaseChecked: boolean = false;
    isSalesChecked: boolean = false;
    isCostChecked: boolean = false;
    isSave: boolean = false;
    isDisabled: boolean = true;

    @ViewChild('purchaseGoodsComponent') purchaseGoodsComponent: PurchaseGoodsFormComponentComponent;
    @ViewChild('quantityInvoiceComponent') quantityInvoiceComponent: QuantityInvoiceFormComponentComponent;
    @ViewChild('salesGoodsComponent') salesGoodsComponent: SalesGoodsFormComponentComponent;
    @ViewChild('invoiceSelectionFormComponent') invoiceSelectionFormComponent: InvoiceSelectionFormComponent;
    @ViewChild('costComponent') costComponent: CostFormComponentComponent;
    @ViewChild('washoutFormComponent') washoutFormComponent: WashoutFormComponent;
    @ViewChild('reversalFormComponent') reversalFormComponent: ReversalFormComponent;
    constructor(protected formBuilder: FormBuilder,
        protected formConfigurationProvider: FormConfigurationProviderService,
        private router: Router,
        protected dialog: MatDialog,
        private companyManager: CompanyManagerService,
        private titleService: TitleService) {
        super(formConfigurationProvider);
    }

    ngOnInit() {
        this.invoiceCreationFormGroup = this.formBuilder.group({
            purchaseGoodsComponent: this.purchaseGoodsComponent.getFormGroup(),
            quantityInvoiceComponent: this.quantityInvoiceComponent.getFormGroup(),
            salesGoodsComponent: this.salesGoodsComponent.getFormGroup(),
            costComponent: this.costComponent.getFormGroup(),
            washoutFormComponent: this.washoutFormComponent.getFormGroup(),
            reversalFormComponent: this.reversalFormComponent.getFormGroup(),
        });
        this.titleService.setTitle('New Invoice');
        this.formComponents.push(
            this.purchaseGoodsComponent,
            this.quantityInvoiceComponent,
            this.salesGoodsComponent,
            this.costComponent,
            this.washoutFormComponent,
            this.reversalFormComponent,
        );
    }

    @HostListener('window:beforeunload', ['$event'])
    unloadNotification($event: any) {
        if (this.invoiceCreationFormGroup.dirty) {
            $event.returnValue = true;
        }
    }

    canDeactivate() {
        if (this.invoiceCreationFormGroup.dirty && this.isSave === false) {
            return window.confirm('Leave an unsave form? \nYour changes won\'t be applied!');
        }
        return true;
    }

    onDiscardButtonClicked() {
        this.isSave = true;
        const confirmDiscardDialog = this.dialog.open(ConfirmationDialogComponent, {
            data: {
                title: 'Discard Changes',
                text: 'You have some modification pending. Close and lose changes?',
                okButton: 'Ok',
                cancelButton: 'Cancel',
            },
        });
        confirmDiscardDialog.afterClosed().subscribe((answer) => {
            if (answer) {
                this.router.navigate(['/' + this.companyManager.getCurrentCompanyId() + '/execution/invoicing/home']);
            }
        });
    }

    onNextButtonClicked(invoiceOption) {
            this.isSave = true;
            this.router.navigate(['/' + this.companyManager.getCurrentCompanyId() +
                '/execution/invoicing/' + encodeURIComponent(invoiceOption)]);
    }
    onPurchaseOptionChecked($event) {
        this.invoiceOption = $event.purchaseOption;
        this.isPurchaseChecked = false;
        if ($event.checked) {
            this.isPurchaseChecked = true;
            if (this.isPurchaseChecked || this.isCostChecked) {
                this.isDisabled = false;
            }
            if (this.isCostChecked) {
                this.invoiceOption = InvoiceTypes.GoodsCostPurchase;
            }
            this.salesGoodsComponent.salesOptionDisable();
            this.washoutFormComponent.washoutOptionDisable();
            this.reversalFormComponent.reversalOptionDisable();

        } else {
            if (this.isPurchaseChecked && this.isCostChecked) {
                this.isDisabled = true;
            } else if (this.isPurchaseChecked || this.isCostChecked) {
                this.isDisabled = false;
            } else {
                this.isDisabled = true;
            }
            this.salesGoodsComponent.salesOptionEnable();
            if (!this.isCostChecked) {
                this.washoutFormComponent.washoutOptionEnable();
                this.reversalFormComponent.reversalOptionEnable();
            }
        }
    }
    onSalesOptionChecked($event) {
        this.invoiceOption = $event.saleOption;
        this.isSalesChecked = false;
        if ($event.checked) {
            if (this.isCostChecked) {
                this.invoiceOption = InvoiceTypes.GoodsCostSales;
            }
            this.isSalesChecked = true;
            if (this.isSalesChecked || this.isCostChecked) {
                this.isDisabled = false;
            }
            this.purchaseGoodsComponent.purchaseOptionDisable();
            this.washoutFormComponent.washoutOptionDisable();
            this.reversalFormComponent.reversalOptionDisable();
        } else {
            if (this.isSalesChecked && this.isCostChecked) {
                this.isDisabled = true;
            } else if (this.isSalesChecked || this.isCostChecked) {
                this.isDisabled = false;
            } else {
                this.isDisabled = true;
            }
            this.purchaseGoodsComponent.purchaseOptionEnable();
            if (!this.isCostChecked) {
                this.washoutFormComponent.washoutOptionEnable();
                this.reversalFormComponent.reversalOptionEnable();
            }
        }
    }
    onCostsOptionChecked($event) {
        this.invoiceOption = $event.costOption;
        this.isCostChecked = false;
        if ($event.checked) {
            this.isCostChecked = true;
            if (this.isPurchaseChecked || this.isCostChecked) {
                this.isDisabled = false;
            }
            if (this.isSalesChecked) {
                this.invoiceOption = InvoiceTypes.GoodsCostSales;
                this.salesGoodsComponent.salesOptionEnable();
            } else if (this.isPurchaseChecked) {
                this.invoiceOption = InvoiceTypes.GoodsCostPurchase;
                this.purchaseGoodsComponent.purchaseOptionEnable();
            }
            this.washoutFormComponent.washoutOptionDisable();
            this.reversalFormComponent.reversalOptionDisable();
        } else {
            if (this.isPurchaseChecked && this.isCostChecked) {
                this.isDisabled = true;
            } else if (this.isPurchaseChecked || this.isCostChecked || this.isSalesChecked) {
                this.isDisabled = false;
            } else {
                this.isDisabled = true;
            }
            if (this.isSalesChecked) {
                this.enableSaleAndDisableOtherInvoiceOptions();
            } else if (this.isPurchaseChecked) {
                this.enablePurchaseAndDisableOtherInvoiceOptions();
            } else {
                this.enableAllInvoiceOptions();
            }
        }
    }

    enableAllInvoiceOptions() {
        this.purchaseGoodsComponent.purchaseOptionEnable();
        this.salesGoodsComponent.salesOptionEnable();
        this.washoutFormComponent.washoutOptionEnable();
        this.reversalFormComponent.reversalOptionEnable();
    }

    enablePurchaseAndDisableOtherInvoiceOptions() {
        this.invoiceOption = InvoiceTypes.Purchase;
        this.purchaseGoodsComponent.purchaseOptionEnable();
        this.salesGoodsComponent.salesOptionDisable();
        this.washoutFormComponent.washoutOptionDisable();
        this.reversalFormComponent.reversalOptionDisable();
    }

    enableSaleAndDisableOtherInvoiceOptions() {
        this.invoiceOption = InvoiceTypes.Sales;
        this.salesGoodsComponent.salesOptionEnable();
        this.purchaseGoodsComponent.purchaseOptionDisable();
        this.washoutFormComponent.washoutOptionDisable();
        this.reversalFormComponent.reversalOptionDisable();
    }

    onWashoutsOptionChecked($event) {
        this.invoiceOption = $event.washoutOption;
        if ($event.checked) {
            this.isDisabled = false;
            this.salesGoodsComponent.salesOptionDisable();
            this.purchaseGoodsComponent.purchaseOptionDisable();
            this.costComponent.costOptionDisable();
            this.reversalFormComponent.reversalOptionDisable();
        } else {
            this.isDisabled = true;
            this.salesGoodsComponent.salesOptionEnable();
            this.purchaseGoodsComponent.purchaseOptionEnable();
            this.costComponent.costOptionEnable();
            this.reversalFormComponent.reversalOptionEnable();
        }
    }
    onReversalOptionChecked($event) {
        this.invoiceOption = $event.reversalOption;
        if ($event.checked) {
            this.isDisabled = false;
            this.salesGoodsComponent.salesOptionDisable();
            this.purchaseGoodsComponent.purchaseOptionDisable();
            this.costComponent.costOptionDisable();
            this.washoutFormComponent.washoutOptionDisable();
        } else {
            this.isDisabled = true;
            this.salesGoodsComponent.salesOptionEnable();
            this.purchaseGoodsComponent.purchaseOptionEnable();
            this.costComponent.costOptionEnable();
            this.washoutFormComponent.washoutOptionEnable();
        }
    }
}
