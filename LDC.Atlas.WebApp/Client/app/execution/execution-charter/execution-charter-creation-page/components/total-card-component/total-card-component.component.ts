import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { BaseFormComponent } from '../../../../../shared/components/base-form-component/base-form-component.component';
import { AssignedSection } from '../../../../../shared/entities/assigned-section.entity';
import { MasterData } from '../../../../../shared/entities/masterdata.entity';
import { ContractTypes } from '../../../../../shared/enums/contract-type.enum';
import { FormConfigurationProviderService } from '../../../../../shared/services/form-configuration-provider.service';
import { ExecutionService } from '../../../../../shared/services/http-services/execution.service';

@Component({
    selector: 'atlas-total-card-component',
    templateUrl: './total-card-component.component.html',
    styleUrls: ['./total-card-component.component.scss'],
})
export class TotalCardComponent extends BaseFormComponent implements OnInit {
    @Input() isCreate: boolean = true;

    charterPurchaseTotal: string;
    charterSalesTotal: string;
    charterId: number;
    purchaseQuantity = 0;
    salesQuantity = 0;
    sectionsAssigned: AssignedSection[];
    masterdata: MasterData;

    constructor(protected formbuilder: FormBuilder, protected route: ActivatedRoute,
        protected executionService: ExecutionService,
        protected formConfigurationProvider: FormConfigurationProviderService) {
        super(formConfigurationProvider);
    }

    ngOnInit() {
        this.charterId = this.route.snapshot.params['charterId'];
        this.masterdata = this.route.snapshot.data.masterdata;
    }

    getFormGroup() {
        this.formGroup = this.formbuilder.group({
            charterPurchaseTotal: this.charterPurchaseTotal,
            charterSalesTotal: this.charterSalesTotal,

        });

        return super.getFormGroup();
    }

    assignValueToControl(weightUnitId: number) {
        const weightUnitForConversion = this.masterdata.weightUnits.find((weightUnit) => weightUnit.weightUnitId === weightUnitId);
        this.executionService.getSectionsAssignedToCharter(this.charterId).pipe(
            map((data) => {
                this.sectionsAssigned = data.value;
                this.sectionsAssigned.forEach((element) => {
                    const weightCodeConversionForContract = this.masterdata.weightUnits.find((weightUnit) =>
                        weightUnit.weightUnitId === element.weightUnitId);
                    if (element.contractType === ContractTypes.Purchase) {
                        this.purchaseQuantity += (element.quantity * weightCodeConversionForContract.conversionFactor)
                            / weightUnitForConversion.conversionFactor;
                    } else if (element.contractType === ContractTypes.Sale) {
                        this.salesQuantity += (element.quantity * weightCodeConversionForContract.conversionFactor) /
                            weightUnitForConversion.conversionFactor;
                    }
                });
            }))
            .subscribe();
    }

}
