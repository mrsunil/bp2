import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BaseFormComponent } from '../../../../../shared/components/base-form-component/base-form-component.component';
import { Allocation } from '../../../../../shared/entities/allocation.entity';
import { AtlasFormControl } from '../../../../../shared/entities/atlas-form-control';
import { SectionReference } from '../../../../../shared/entities/section-reference.entity';
import { Section } from '../../../../../shared/entities/section.entity';
import { AllocateTradeOption } from '../../../../../shared/enums/allocate-trade-option-enum';
import { ContractTypes } from '../../../../../shared/enums/contract-type.enum';
import { InvoicingStatus } from '../../../../../shared/enums/invoicing-status.enum';
import { FormConfigurationProviderService } from '../../../../../shared/services/form-configuration-provider.service';
import { ExecutionService } from '../../../../../shared/services/http-services/execution.service';
import { PhysicalFixedPricedContract } from '../../../../../trading/entities/physical-fixed-priced-contract.entity';
import { TradeDataService } from '../../../../services/trade-data.service';
@Component({
    selector: 'atlas-allocation-form-component',
    templateUrl: './allocation-form-component.component.html',
    styleUrls: ['./allocation-form-component.component.scss'],
})
export class AllocationFormComponent extends BaseFormComponent implements OnInit {
    @Output() readonly checkLeaveStatusChange = new EventEmitter<any>();

    adjustAllocationToggleCtrl = new AtlasFormControl('adjustAllocationToggleCtrl');
    leaveStatusToggleCtrl = new AtlasFormControl('leaveStatusToggleCtrl');
    unallocationToggleCtrl = new AtlasFormControl('unallocationToggleCtrl');
    allocatedSectionCode: string;
    showAllocation: boolean;
    sectionId: number;
    allocatedSection: SectionReference;
    sectionModel: Section;
    isAdjustAllocationEnabled: boolean = false;
    dataVersionId: number;
    constructor(protected formConfigurationProvider: FormConfigurationProviderService, protected formBuilder: FormBuilder,
        private executionService: ExecutionService,
        private route: ActivatedRoute,
        private tradeDataService: TradeDataService) {
        super(formConfigurationProvider);
    }

    ngOnInit() {
        this.sectionId = Number(this.route.snapshot.paramMap.get('sectionId'));
        this.dataVersionId = this.route.snapshot.params['dataVersionId'] ? Number(this.route.snapshot.params['dataVersionId']) : null;
    }

    initForm(entity: any, isEdit: boolean): any {
        this.sectionModel = entity as Section;
        // if (!isEdit) {
        this.adjustAllocationToggleCtrl.disable();
        this.leaveStatusToggleCtrl.disable();
        this.unallocationToggleCtrl.disable();
        // }
        this.allocatedSection = entity.allocatedTo;
        return entity;
    }

    toggleAllocation() {
        if (this.adjustAllocationToggleCtrl.value) {
            this.leaveStatusToggleCtrl.setValue(false);
            this.unallocationToggleCtrl.setValue(false);
        }
        this.toggleLeaveStatus();
    }

    resetLeaveStatus(isChecked: boolean) {
        this.leaveStatusToggleCtrl.setValue(isChecked);
        if (isChecked) {
            this.adjustAllocationToggleCtrl.setValue(false);
            this.unallocationToggleCtrl.setValue(false);
        }
    }

    toggleLeaveStatus() {
        if (this.leaveStatusToggleCtrl.value) {
            this.adjustAllocationToggleCtrl.setValue(false);
            this.unallocationToggleCtrl.setValue(false);
        }
        this.checkLeaveStatusChange.emit(this.leaveStatusToggleCtrl.value);
    }

    toggleUnallocated() {
        if (this.unallocationToggleCtrl.value) {
            this.adjustAllocationToggleCtrl.setValue(false);
            this.leaveStatusToggleCtrl.setValue(false);
        }
        this.toggleLeaveStatus();
    }

    getFormGroup() {

        return super.getFormGroup();
    }

    resetControl() {
        this.adjustAllocationToggleCtrl.setValue(false);
        this.unallocationToggleCtrl.setValue(false);
        this.leaveStatusToggleCtrl.setValue(false);
        this.leaveStatusToggleCtrl.enable();
        this.unallocationToggleCtrl.enable();
        this.adjustAllocationToggleCtrl.enable();
    }

    resetControlonGreaterValue() {
        this.isAdjustAllocationEnabled = false;
        this.adjustAllocationToggleCtrl.setValue(false);
        this.leaveStatusToggleCtrl.setValue(false);
        this.unallocationToggleCtrl.setValue(false);
        this.adjustAllocationToggleCtrl.disable();
        this.leaveStatusToggleCtrl.disable();
        this.unallocationToggleCtrl.disable();

        if (this.sectionModel.allocatedTo) {
            if (this.isSaleOrPurchase(this.sectionModel.contractType)) {
                if (this.isTradeUninvoice(this.sectionModel)
                    && this.isAllocatedTradeUninvoice(this.sectionModel)) {
                    this.isAdjustAllocationEnabled = true;
                    this.adjustAllocationToggleCtrl.setValue(true);
                    this.adjustAllocationToggleCtrl.disable();
                    this.leaveStatusToggleCtrl.disable();
                    this.unallocationToggleCtrl.disable();
                }
            }
        }
    }

    resetControlonLowerValue() {
        this.isAdjustAllocationEnabled = false;
        this.adjustAllocationToggleCtrl.setValue(false);
        this.leaveStatusToggleCtrl.setValue(false);
        this.unallocationToggleCtrl.setValue(false);
        this.adjustAllocationToggleCtrl.disable();
        this.leaveStatusToggleCtrl.disable();
        this.unallocationToggleCtrl.disable();

        if (this.sectionModel.allocatedTo) {
            if (this.isSaleOrPurchase(this.sectionModel.contractType)) {
                if (this.isTradeUninvoice(this.sectionModel)
                    && this.isAllocatedTradeUninvoice(this.sectionModel)) {
                    this.adjustAllocationToggleCtrl.enable();
                    this.dataVersionId ? this.leaveStatusToggleCtrl.disable() : this.leaveStatusToggleCtrl.enable();
                    this.dataVersionId ? this.unallocationToggleCtrl.disable() : this.unallocationToggleCtrl.enable();
                    this.adjustAllocationToggleCtrl.setValue(true);
                } else if (this.isTradeUninvoice(this.sectionModel)
                    && this.isAllocatedTradeFinalInvoiceRequiredOrFinalized(this.sectionModel)) {
                    this.leaveStatusToggleCtrl.setValue(true);
                    this.dataVersionId ? this.leaveStatusToggleCtrl.disable() : this.leaveStatusToggleCtrl.enable();
                } else if (this.isTradeFinalInvoiceRequiredOrFinalized(this.sectionModel)
                    && this.isAllocatedTradeUninvoice(this.sectionModel)) {
                    this.leaveStatusToggleCtrl.setValue(true);
                    this.dataVersionId ? this.leaveStatusToggleCtrl.disable() : this.leaveStatusToggleCtrl.enable();
                } else if (this.isTradeFinalInvoiceRequiredOrFinalized(this.sectionModel)
                    && this.isAllocatedTradeFinalInvoiceRequiredOrFinalized(this.sectionModel)) {
                    this.leaveStatusToggleCtrl.setValue(true);
                    this.dataVersionId ? this.leaveStatusToggleCtrl.disable() : this.leaveStatusToggleCtrl.enable();
                }
            }
        }
    }

    isSaleOrPurchase(type: ContractTypes): boolean {
        if ((type === ContractTypes.Purchase
            || type === ContractTypes.Sale)) {
            return true;
        }
        return false;
    }

    isTradeFinalInvoiceRequiredOrFinalized(tradeRecord: Section): boolean {
        if (tradeRecord.invoicingStatusId === InvoicingStatus.FinalInvoiceRequired
            || tradeRecord.invoicingStatusId === InvoicingStatus.Finalized) {
            return true;
        }
        return false;
    }

    isTradeUninvoice(tradeRecord: Section): boolean {
        if (tradeRecord.invoicingStatusId === InvoicingStatus.Uninvoiced
            || tradeRecord.invoicingStatusId === null) {
            return true;
        }
        return false;
    }

    isAllocatedTradeFinalInvoiceRequiredOrFinalized(tradeRecord: Section): boolean {
        if (tradeRecord.allocatedTo.invoicingStatusId === InvoicingStatus.FinalInvoiceRequired
            || tradeRecord.allocatedTo.invoicingStatusId === InvoicingStatus.Finalized) {
            return true;
        }
        return false;
    }

    isAllocatedTradeUninvoice(tradeRecord: Section): boolean {
        if (tradeRecord.allocatedTo.invoicingStatusId === InvoicingStatus.Uninvoiced
            || tradeRecord.allocatedTo.invoicingStatusId === null) {
            return true;
        }
        return false;
    }

    populateEntity(entity: any): any {
        const section = entity as PhysicalFixedPricedContract;
        section.allocatedTo = this.allocatedSection;
        section.allocateTradeOptionId = AllocateTradeOption.NoAction;
        if (this.adjustAllocationToggleCtrl.value) {
            section.allocateTradeOptionId = AllocateTradeOption.AdjustAllocation;
        } else if (this.leaveStatusToggleCtrl.value) {
            section.allocateTradeOptionId = AllocateTradeOption.LeaveStatus;
        } else if (this.unallocationToggleCtrl.value) {
            section.allocateTradeOptionId = AllocateTradeOption.CreateUnallocatedResidualSplit;
        }
        return section;
    }

    allocationSelectionChecked(): boolean {
        if (this.showAllocation) {
            if ((this.adjustAllocationToggleCtrl.value) || (this.leaveStatusToggleCtrl.value) || (this.unallocationToggleCtrl.value)) {
                return false;
            }
            return true;
        }
        return false;
    }

}
