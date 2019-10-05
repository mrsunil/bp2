import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BaseFormComponent } from '../../../../../shared/components/base-form-component/base-form-component.component';
import { InvoiceRecord } from '../../../../../shared/services/execution/dtos/invoice-record';
import { FormConfigurationProviderService } from '../../../../../shared/services/form-configuration-provider.service';
import { GoodsCostContractSearchComponent } from './components/goods-cost-contract-search/goods-cost-contract-search.component';
import { GoodsCostInvoiceSelectionComponent } from './components/goods-cost-invoice-selection/goods-cost-invoice-selection.component';
import { GoodsCostPricingOptionsComponent } from './components/goods-cost-pricing-options/goods-cost-pricing-options.component';

@Component({
    selector: 'atlas-goods-cost-selection',
    templateUrl: './goods-cost-selection.component.html',
    styleUrls: ['./goods-cost-selection.component.scss'],
})
export class GoodsCostSelectionComponent extends BaseFormComponent implements OnInit {
    @ViewChild('goodsCostPricingOptionsComponent') goodsCostPricingOptionsComponent: GoodsCostPricingOptionsComponent;
    @ViewChild('goodsCostInvoiceSelectionComponent') goodsCostInvoiceSelectionComponent: GoodsCostInvoiceSelectionComponent;
    @ViewChild('goodsCostContractSearchComponent') goodsCostContractSearchComponent: GoodsCostContractSearchComponent;

    @Output() readonly pricingAndDecimalOptionSelected = new EventEmitter<any>();
    @Output() readonly contractsSelected = new EventEmitter<boolean>();

    invoiceSelectionContractFormGroup: FormGroup;
    private formComponents: BaseFormComponent[] = [];

    constructor(protected formBuilder: FormBuilder,
        protected formConfigurationProvider: FormConfigurationProviderService) {
        super(formConfigurationProvider);
    }

    ngOnInit() {
        this.invoiceSelectionContractFormGroup = this.formBuilder.group({
            goodsCostInvoiceSelectionComponent: this.goodsCostInvoiceSelectionComponent.getFormGroup(),
            goodsCostContractSearchComponent: this.goodsCostContractSearchComponent.getFormGroup(),
            goodsCostPricingOptionsComponent: this.goodsCostPricingOptionsComponent.getFormGroup(),
        });
        this.formComponents.push(this.goodsCostInvoiceSelectionComponent, this.goodsCostContractSearchComponent,
            this.goodsCostPricingOptionsComponent);
    }

    onPricingAndDecimalOptionSelected(model: any) {
        this.pricingAndDecimalOptionSelected.emit({ pricingSelected: model.pricingOption, decimalOptionSelected: model.decimalOption });

    }

    onDifferentCommoditySelected({ differentCommoditySelected, differentPricesSelected }) {
        this.goodsCostPricingOptionsComponent.onDifferentCommoditySelected(differentCommoditySelected, differentPricesSelected);
    }

    onContractsSelected(contractsSelected: boolean) {
        this.contractsSelected.emit(contractsSelected);

    }

    populateEntity(model: InvoiceRecord): InvoiceRecord {
        this.formComponents.forEach((comp) => {
            comp.populateEntity(model);
        });
        return model;
    }

}
