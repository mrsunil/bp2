import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BaseFormComponent } from '../../../../../shared/components/base-form-component/base-form-component.component';
import { FormConfigurationProviderService } from '../../../../../shared/services/form-configuration-provider.service';
import { GoodsCostInvoiceSelectionComponent } from '../goods-cost-selection/components/goods-cost-invoice-selection/goods-cost-invoice-selection.component';
import { GoodsCostContractsCostComponent } from './components/goods-cost-contracts-cost/goods-cost-contracts-cost.component';

@Component({
    selector: 'atlas-goods-cost-selection-cost',
    templateUrl: './goods-cost-selection-cost.component.html',
    styleUrls: ['./goods-cost-selection-cost.component.scss'],
})
export class GoodsCostSelectionCostComponent extends BaseFormComponent implements OnInit {

    private formComponents: BaseFormComponent[] = [];

    @ViewChild('goodsCostInvoiceSelectionComponent') goodsCostInvoiceSelectionComponent: GoodsCostInvoiceSelectionComponent;
    @ViewChild('goodsCostContractsCostComponent') goodsCostContractsCostComponent: GoodsCostContractsCostComponent;

    goodsCostSelectionCostFormGroup: FormGroup;

    constructor(protected formBuilder: FormBuilder,
        protected formConfigurationProvider: FormConfigurationProviderService) {
        super(formConfigurationProvider);
    }

    ngOnInit() {
        this.goodsCostSelectionCostFormGroup = this.formBuilder.group({
            goodsCostContractsCostComponent: this.goodsCostContractsCostComponent.getFormGroup(),
        });
        this.formComponents.push(this.goodsCostContractsCostComponent);
    }

}
