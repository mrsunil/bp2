import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CompanyManagerService } from '../../../../../core/services/company-manager.service';
import { BaseFormComponent } from '../../../../../shared/components/base-form-component/base-form-component.component';
import { BulkCost } from '../../../../../shared/entities/bulk-edit-cost.entity';
import { FormConfigurationProviderService } from '../../../../../shared/services/form-configuration-provider.service';
import { TradingService } from '../../../../../shared/services/http-services/trading.service';
import { ChildrenCostsComponent } from './components/children-costs/children-costs.component';
import { ParentCostsComponent } from './components/parent-costs/parent-costs.component';

@Component({
    selector: 'atlas-costs-to-adjust',
    templateUrl: './costs-to-adjust.component.html',
    styleUrls: ['./costs-to-adjust.component.scss'],
})
export class CostsToAdjustComponent extends BaseFormComponent implements OnInit {
    @ViewChild('parentCostsComponent') parentCostsComponent: ParentCostsComponent;
    @ViewChild('childrenCostsComponent') childrenCostsComponent: ChildrenCostsComponent;

    formComponents: BaseFormComponent[] = [];
    transferCostsToSplitsForm: FormGroup;
    sectionId: number;

    constructor(private router: Router,
        private companyManager: CompanyManagerService,
        protected route: ActivatedRoute, protected formBuilder: FormBuilder,
        protected formConfigurationProvider: FormConfigurationProviderService,
        protected tradingService: TradingService,
    ) { super(formConfigurationProvider); }

    ngOnInit() {
        this.sectionId = this.route.snapshot.params.sectionId;
        this.transferCostsToSplitsForm = this.formBuilder.group({
            childrenCostsComponent: this.childrenCostsComponent.getFormGroup(),
        });
        this.formComponents.push(this.childrenCostsComponent);
    }

    onCostTypesList($event) {
        this.childrenCostsComponent.setCostsAsColumnsToChildGrid($event.costTypes);
    }

    onDiscardButtonClicked() {
        this.router.navigate(['/' + this.companyManager.getCurrentCompanyId() + '/trades/display/' +
            encodeURIComponent(String(this.sectionId))]);
    }

    onSaveButtonClicked() {
        this.childrenCostsComponent.setParentData(this.parentCostsComponent.getGridData());
        this.childrenCostsComponent.addUpateCosts();
    }
}
