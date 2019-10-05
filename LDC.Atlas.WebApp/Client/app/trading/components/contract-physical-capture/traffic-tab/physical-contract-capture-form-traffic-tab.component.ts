import { Component, EventEmitter, HostListener, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BaseFormComponent } from '../../../../shared/components/base-form-component/base-form-component.component';
import { Section } from '../../../../shared/entities/section.entity';
import { FormConfigurationProviderService } from '../../../../shared/services/form-configuration-provider.service';
import { AdjustWeightFormComponent } from '../form-components/adjust-weight-form-component/adjust-weight-form-component.component';
import { AllocationFormComponent } from '../form-components/allocation-form-component/allocation-form-component.component';
import { BlInfoFormComponent } from '../form-components/bl-info-form-component/bl-info-form-component.component';
import { CurrentTradeFormComponent } from '../form-components/current-trade-form-component/current-trade-form-component.component';
import { ShipmentInfoFormComponent } from '../form-components/shipment-info-form-component/shipment-info-form-component.component';
import { Allocation } from '../../../../shared/entities/allocation.entity';
import { TradeDataService } from '../../../services/trade-data.service';

@Component({
    selector: 'atlas-physical-contract-capture-form-traffic-tab',
    templateUrl: './physical-contract-capture-form-traffic-tab.component.html',
    styleUrls: ['./physical-contract-capture-form-traffic-tab.component.scss'],
})
export class PhysicalContractCaptureFormTrafficTabComponent extends BaseFormComponent implements OnInit {

    @ViewChild('BlInfoComponent') blInfoComponent: BlInfoFormComponent;
    @ViewChild('AdjustWeightComponent') adjustWeightComponent: AdjustWeightFormComponent;
    @ViewChild('ShipmentInfoComponent') shipmentInfoComponent: ShipmentInfoFormComponent;
    @ViewChild('CurrentTradeComponent') currentTradeComponent: CurrentTradeFormComponent;
    @ViewChild('AllocationComponent') allocationComponent: AllocationFormComponent;
    @Output() readonly quantityValueUpdate = new EventEmitter<any>();
    @Output() readonly blDateUpdate = new EventEmitter<any>();
    @Output() readonly shipmentStatusUpdate = new EventEmitter<string>();
    formComponents: BaseFormComponent[] = [];
    showAllocation = false;
    allocatedTo: number;

    constructor(protected formBuilder: FormBuilder, protected formConfigurationProvider: FormConfigurationProviderService,private tradeDataService: TradeDataService,) {
        super(formConfigurationProvider);
    }

    ngOnInit() {
        this.formComponents.push(
            this.blInfoComponent,
            this.shipmentInfoComponent,
            this.adjustWeightComponent,
            this.currentTradeComponent,
            this.allocationComponent,
        );

        
    }

    contractDateSelected(contractDate: Date) {
        this.blInfoComponent.contractDateSelected(contractDate);
    }

    checkLeaveStatusChange(isChecked: boolean) {
        this.currentTradeComponent.resetAllocatedResidualSplit(isChecked);
        this.quantityValueUpdate.emit();
    }

    checkAllocatedResidualSplitChange(isChecked: boolean) {

        this.allocationComponent.resetLeaveStatus(isChecked);
        this.quantityValueUpdate.emit();
    }

    checkQuantityChange(quantity) {
        this.currentTradeComponent.resetControl(this.allocatedTo);

        if (this.allocatedTo) {
            this.allocationComponent.resetControl();
        }

        if (quantity.newValue >= 0) {
            if (quantity.oldValue > quantity.newValue) {
                this.currentTradeComponent.resetControlonLowerValue();
                if (this.allocatedTo) {
                    this.allocationComponent.resetControlonLowerValue();
                }
            } else if ((quantity.oldValue < quantity.newValue)) {
                this.currentTradeComponent.resetControlOnHigherValue();
                if (this.allocatedTo) {
                    this.allocationComponent.resetControlonGreaterValue();
                }
            }
        }
        this.quantityValueUpdate.emit(quantity.newValue);

    }

    checkShipmentStatusChange(value: string) {
        this.shipmentStatusUpdate.emit(value);
    }

    initForm(entity: any, isEdit: boolean): any {

        this.subscriptions.push(this.tradeDataService.getAllocationDetails()
        .subscribe((data: Allocation) => {
            if (data) {
                this.blInfoComponent.allocationModel = data;
                this.blInfoComponent.groupingNumberCtrl.setValue(this.blInfoComponent.allocationModel.groupNumber);
                this.blInfoComponent.isEmpty = false;
                this.blInfoComponent.hasEmptyState = this.blInfoComponent.isEmpty && !isEdit;
                this.allocationComponent.showAllocation = data ? true : false;
                this.allocationComponent.allocatedSectionCode = data ? data.allocatedSectionCode : '';
            }
            this.blInfoComponent.disableControl();
        }));

        this.formComponents.forEach((comp) => {
            entity = comp.initForm(entity, isEdit);
        });      

        const sectionModel = entity as Section;
        this.allocatedTo = sectionModel.allocatedToId;
        return entity;       

    }

    getFormGroup() {
        this.formGroup = this.formBuilder.group({
            blInfoComponent: this.blInfoComponent.getFormGroup(),
            shipmentInfoComponent: this.shipmentInfoComponent.getFormGroup(),
            adjustWeightComponent: this.adjustWeightComponent.getFormGroup(),
            allocationComponent: this.allocationComponent.getFormGroup(),
        });

        return super.getFormGroup();
    }

    populateEntity(entity: any): any {
        this.formComponents.forEach((comp) => {
            entity = comp.populateEntity(entity);
        });
        return entity;
    }
    onBlDateChanged(bldate) {
        this.blDateUpdate.emit(bldate);
    }
}
