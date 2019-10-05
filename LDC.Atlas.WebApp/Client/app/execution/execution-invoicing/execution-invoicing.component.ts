import { AfterViewInit, Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { BaseFormComponent } from '../../shared/components/base-form-component/base-form-component.component';
import { InvoiceTypes } from '../../shared/enums/invoice-type.enum';
import { FormConfigurationProviderService } from '../../shared/services/form-configuration-provider.service';
import { ExecutionService } from '../../shared/services/http-services/execution.service';
import { SnackbarService } from '../../shared/services/snackbar.service';
import { CommercialComponent } from './commercial/commercial.component';
import { CostComponent } from './cost/cost.component';
import { GoodsCostComponent } from './goods-cost/goods-cost.component';
import { ReversalComponent } from './reversal/reversal.component';
import { WashoutComponent } from './washout/washout.component';
import { TitleService } from '../../shared/services/title.service';

@Component({
    selector: 'atlas-execution-invoicing',
    templateUrl: './execution-invoicing.component.html',
    styleUrls: ['./execution-invoicing.component.css'],
})

export class ExecutionInvoicingComponent extends BaseFormComponent implements OnInit, AfterViewInit {
    private formComponents: BaseFormComponent[] = [];

    @ViewChild('washoutComponent') washoutComponent: WashoutComponent;
    @ViewChild('commercialComponent') commercialComponent: CommercialComponent;
    @ViewChild('costComponent') costComponent: CostComponent;
    @ViewChild('goodsCostComponent') goodsCostComponent: GoodsCostComponent;
    @ViewChild('reversalComponent') reversalComponent: ReversalComponent;

    createInvoiceFormGroup: FormGroup;
    InvoiceTypes = InvoiceTypes;
    company: string;
    invoiceTypeId: number;
    invoiceLabel: string;
    invoiceId: number;
    selectedInvoiceId: number;
    isFromGrid: boolean = false;
    isSave: boolean = false;
    /*
	-----------------------------------------------------------------------------------------------------------------------------------
	GLOBAL FUNCTIONS
	-----------------------------------------------------------------------------------------------------------------------------------
	*/

    constructor(private executionService: ExecutionService,
        private route: ActivatedRoute,
        protected snackbarService: SnackbarService,
        private formBuilder: FormBuilder,
        protected dialog: MatDialog,
        protected formConfigurationProvider: FormConfigurationProviderService,
        private titleService: TitleService
    ) {
        super(formConfigurationProvider);
        this.invoiceTypeId = Number(decodeURIComponent(this.route.snapshot.paramMap.get('invoiceTypeId')));
    }

    ngOnInit() {
        this.company = this.route.snapshot.paramMap.get('company');
    }

    @HostListener('window:beforeunload', ['$event'])
    unloadNotification($event: any) {
        if (this.createInvoiceFormGroup.dirty) {
            $event.returnValue = true;
        }
    }

    canDeactivate() {
        if (this.commercialComponent) {
            if ((this.commercialComponent.commercialWorkingPageComponent.invoiceWorkingFormGroup.dirty || this.commercialComponent.commercialSelectionComponent.invoiceSelectionContractFormGroup.dirty) &&
                this.commercialComponent.stepper.selectedIndex !== 2) {
                return window.confirm("Leave an unsave form? \nYour changes won't be applied!");
            }
        }
        else if (this.costComponent) {
            if ((this.costComponent.costSelectionComponent.invoiceSelectionFormGroup.dirty || this.costComponent.costWorkingPageComponent.invoiceCostWorkingFormGroup.dirty) && this.isSave === false) {
                return window.confirm("Leave an unsave form? \nYour changes won't be applied!");
            }
        }
        else if (this.washoutComponent) {
            if ((this.washoutComponent.washoutSelectionComponent.invoiceSelectionFormGroup.dirty || this.washoutComponent.washoutWorkingPageComponent.invoiceWashoutWorkingFormGroup.dirty) && this.washoutComponent.isSaveClicked === false) {
                return window.confirm("Leave an unsave form? \nYour changes won't be applied!");
            }
        }
        else if (this.reversalComponent) {
            if (this.reversalComponent.reversalSelectionComponent.invoiceSelectionFormGroup.dirty && this.isSave === false) {
                return window.confirm("Leave an unsave form? \nYour changes won't be applied!");
            }
        }
        return true;
    }
    ngAfterViewInit() {
        if (this.invoiceTypeId === InvoiceTypes.Cost) {
            this.isSave = true;
            this.titleService.setTitle('Invoice Costs/Commissions Creation');
            this.createInvoiceFormGroup = this.formBuilder.group({
                costComponent: this.costComponent.getFormGroup(),
            });
            this.formComponents.push(this.costComponent);
        } else if (this.invoiceTypeId === InvoiceTypes.Washout) {
            this.titleService.setTitle('Washout Creation');
            this.createInvoiceFormGroup = this.formBuilder.group({
                washoutComponent: this.washoutComponent.getFormGroup(),
            });
            this.formComponents.push(this.washoutComponent);
        } else if (this.invoiceTypeId === InvoiceTypes.GoodsCostPurchase || this.invoiceTypeId === InvoiceTypes.GoodsCostSales) {
            this.titleService.setTitle('Invoice Goods & Cost  Creation');
            this.createInvoiceFormGroup = this.formBuilder.group({
                goodsCostComponent: this.goodsCostComponent.getFormGroup(),
            });
            this.formComponents.push(this.goodsCostComponent);
        } else if (this.invoiceTypeId === InvoiceTypes.Reversal) {
            this.isSave = true;
            this.titleService.setTitle('Invoice Reversal Creation');
            this.createInvoiceFormGroup = this.formBuilder.group({
                reversalComponent: this.reversalComponent.getFormGroup(),
            });
            this.formComponents.push(this.reversalComponent);
        } else {
            this.titleService.setTitle('Invoice Commercial Creation');
            this.createInvoiceFormGroup = this.formBuilder.group({
                commercialComponent: this.commercialComponent.getFormGroup(),
            });
            this.formComponents.push(this.commercialComponent);
        }
    }
}
