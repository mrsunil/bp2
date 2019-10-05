import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BaseFormComponent } from '../../../../../shared/components/base-form-component/base-form-component.component';
import { AtlasFormControl } from '../../../../../shared/entities/atlas-form-control';
import { Section } from '../../../../../shared/entities/section.entity';
import { ContractTypes } from '../../../../../shared/enums/contract-type.enum';
import { CurrentTradeOption } from '../../../../../shared/enums/current-trade-option-enum';
import { InvoicingStatus } from '../../../../../shared/enums/invoicing-status.enum';
import { SectionCompleteDisplayView } from '../../../../../shared/models/section-complete-display-view';
import { FormConfigurationProviderService } from '../../../../../shared/services/form-configuration-provider.service';
import { MasterdataService } from '../../../../../shared/services/http-services/masterdata.service';
import { TradingService } from '../../../../../shared/services/http-services/trading.service';
import { UtilService } from '../../../../../shared/services/util.service';
import { PhysicalFixedPricedContract } from '../../../../../trading/entities/physical-fixed-priced-contract.entity';

@Component({
    selector: 'atlas-current-trade-form-component',
    templateUrl: './current-trade-form-component.component.html',
    styleUrls: ['./current-trade-form-component.component.scss'],
})
export class CurrentTradeFormComponent extends BaseFormComponent implements OnInit {

    @Output() readonly checkAllocatedResidualSplitChange = new EventEmitter<any>();
    adjustWeightToggleCtrl = new AtlasFormControl('AdjustWeight');
    allocatedResidualSplitCtrl = new AtlasFormControl('AllocatedResidualSplit');
    allocatedResidualSplitDropDownCtrl = new AtlasFormControl('AllocatedResidualSplitDropDown');
    unallocatedResidualSplitCtrl = new AtlasFormControl('UnallocatedResidualSplit');

    model: SectionCompleteDisplayView = new SectionCompleteDisplayView();
    isAllocated: number;
    sectionModel: Section;
    dataVersionId: number;

    constructor(
        protected formBuilder: FormBuilder,
        protected masterdataService: MasterdataService,
        protected utilService: UtilService,
        protected tradingService: TradingService,
        protected formConfigurationProvider: FormConfigurationProviderService,
        private route: ActivatedRoute) {
        super(formConfigurationProvider);
    }

    ngOnInit() {
        this.allocatedResidualSplitDropDownCtrl.setValue('Leave status as is');
        this.dataVersionId = this.route.snapshot.params['dataVersionId'] ? Number(this.route.snapshot.params['dataVersionId']) : null;
    }

    initForm(entity: any, isEdit: boolean): any {
        this.sectionModel = entity as Section;
        // if (!isEdit) {
        this.adjustWeightToggleCtrl.disable();
        this.allocatedResidualSplitCtrl.disable();
        this.allocatedResidualSplitDropDownCtrl.disable();
        this.unallocatedResidualSplitCtrl.disable();

        // } else {
        //    if (!this.sectionModel.allocatedTo) {
        this.allocatedResidualSplitDropDownCtrl.disable();
        this.allocatedResidualSplitCtrl.disable();
        //    }
        // this.enableDisableControl();
        // }

        return entity;
    }

    resetControlOnHigherValue() {
        this.adjustWeightToggleCtrl.setValue(false);
        this.unallocatedResidualSplitCtrl.setValue(false);
        this.allocatedResidualSplitCtrl.setValue(false);
        this.allocatedResidualSplitDropDownCtrl.disable();
        this.unallocatedResidualSplitCtrl.disable();
        this.allocatedResidualSplitCtrl.disable();
        this.adjustWeightToggleCtrl.disable();
        this.enableDisableControl(true);
    }

    enableDisableControl(isQuantityIncrease: boolean) {
        if (this.isSaleOrPurchase(this.sectionModel.contractType)) {
            if (!(this.sectionModel.allocatedTo)) {
                if (this.isTradeUninvoice(this.sectionModel)) {
                    if (isQuantityIncrease) {
                        this.adjustWeightToggleCtrl.setValue(true);
                        this.adjustWeightToggleCtrl.enable();
                    } else {
                        this.adjustWeightToggleCtrl.setValue(true);
                        this.adjustWeightToggleCtrl.enable();
                        this.dataVersionId ? this.unallocatedResidualSplitCtrl.disable() : this.unallocatedResidualSplitCtrl.enable();
                    }
                } else if (this.isTradeFinalInvoiceRequiredOrFinalized(this.sectionModel)) {
                    if (!isQuantityIncrease) {
                        this.dataVersionId ? this.unallocatedResidualSplitCtrl.setValue(false) :
                            this.unallocatedResidualSplitCtrl.setValue(true);
                        this.dataVersionId ? this.unallocatedResidualSplitCtrl.disable() : this.unallocatedResidualSplitCtrl.enable();
                    }
                }
            } else {
                if (this.isTradeUninvoice(this.sectionModel)
                    && this.isAllocatedTradeUninvoice(this.sectionModel)) {
                    if (!isQuantityIncrease) {
                        this.adjustWeightToggleCtrl.setValue(true);
                        this.unallocatedResidualSplitCtrl.setValue(false);
                        this.allocatedResidualSplitCtrl.setValue(false);
                        this.allocatedResidualSplitDropDownCtrl.disable();
                        this.dataVersionId ? this.unallocatedResidualSplitCtrl.disable() : this.unallocatedResidualSplitCtrl.enable();
                        this.dataVersionId ? this.allocatedResidualSplitCtrl.disable() : this.allocatedResidualSplitCtrl.enable();
                        this.adjustWeightToggleCtrl.enable();
                    } else {
                        this.adjustWeightToggleCtrl.setValue(true);
                        this.adjustWeightToggleCtrl.enable();
                    }
                } else if (this.isTradeUninvoice(this.sectionModel)
                    && this.isAllocatedTradeFinalInvoiceRequiredOrFinalized(this.sectionModel) && !isQuantityIncrease) {
                    this.dataVersionId ? this.allocatedResidualSplitCtrl.setValue(false) :
                        this.allocatedResidualSplitCtrl.setValue(true);
                    this.dataVersionId ? this.allocatedResidualSplitCtrl.disable() : this.allocatedResidualSplitCtrl.enable();
                } else if (this.isTradeFinalInvoiceRequiredOrFinalized(this.sectionModel)
                    && this.isAllocatedTradeUninvoice(this.sectionModel) && !isQuantityIncrease) {
                    this.dataVersionId ? this.allocatedResidualSplitCtrl.disable() : this.allocatedResidualSplitCtrl.enable();
                    this.dataVersionId ? this.allocatedResidualSplitCtrl.setValue(false) :
                        this.allocatedResidualSplitCtrl.setValue(true);

                } else if (this.isTradeFinalInvoiceRequiredOrFinalized(this.sectionModel)
                    && this.isAllocatedTradeFinalInvoiceRequiredOrFinalized(this.sectionModel) && !isQuantityIncrease) {
                    this.allocatedResidualSplitCtrl.enable();
                    this.allocatedResidualSplitCtrl.setValue(true);
                }
            }
        }
    }

    resetControlonLowerValue() {

        this.adjustWeightToggleCtrl.setValue(false);
        this.unallocatedResidualSplitCtrl.setValue(false);
        this.allocatedResidualSplitCtrl.setValue(false);
        this.allocatedResidualSplitDropDownCtrl.disable();
        this.unallocatedResidualSplitCtrl.disable();
        this.allocatedResidualSplitCtrl.disable();
        this.adjustWeightToggleCtrl.disable();

        this.enableDisableControl(false);
    }

    resetAllocatedResidualSplit(isChecked: boolean) {

        this.allocatedResidualSplitCtrl.setValue(isChecked);
        this.allocatedResidualSplitDropDownCtrl.disable();
        if (isChecked) {
            this.adjustWeightToggleCtrl.setValue(false);
            this.unallocatedResidualSplitCtrl.setValue(false);
            this.dataVersionId ? this.allocatedResidualSplitDropDownCtrl.disable() : this.allocatedResidualSplitDropDownCtrl.enable();
        }

    }

    resetControl(isAllocated: number) {
        this.isAllocated = isAllocated;
        this.allocatedResidualSplitDropDownCtrl.disable();
        this.adjustWeightToggleCtrl.setValue(false);
        this.unallocatedResidualSplitCtrl.setValue(false);
        this.allocatedResidualSplitCtrl.setValue(false);
        this.adjustWeightToggleCtrl.enable();
        this.dataVersionId ? this.unallocatedResidualSplitCtrl.disable() : this.unallocatedResidualSplitCtrl.enable();
        this.dataVersionId ? this.allocatedResidualSplitCtrl.disable() : this.allocatedResidualSplitCtrl.enable();
        if (!isAllocated) {
            this.allocatedResidualSplitCtrl.disable();
        }
        // this.enableDisableControl();
    }

    toggleAdjustWeight() {
        if (this.adjustWeightToggleCtrl.value) {
            this.allocatedResidualSplitCtrl.setValue(false);
            this.unallocatedResidualSplitCtrl.setValue(false);
            this.allocatedResidualSplitDropDownCtrl.disable();
        }
        this.toggleAllocatedResidualSplit();
    }

    toggleAllocatedResidualSplit() {
        this.allocatedResidualSplitDropDownCtrl.disable();
        if (this.allocatedResidualSplitCtrl.value) {
            this.adjustWeightToggleCtrl.setValue(false);
            this.unallocatedResidualSplitCtrl.setValue(false);
            this.allocatedResidualSplitDropDownCtrl.enable();
        }

        this.checkAllocatedResidualSplitChange.emit(this.allocatedResidualSplitCtrl.value);
    }

    toggleUnallocatedResidualSplit() {
        if (this.unallocatedResidualSplitCtrl.value) {
            this.allocatedResidualSplitCtrl.setValue(false);
            this.adjustWeightToggleCtrl.setValue(false);
            this.allocatedResidualSplitDropDownCtrl.disable();
        }
        this.toggleAllocatedResidualSplit();
    }

    checkQuantityChange(quantity) {
        this.adjustWeightToggleCtrl.enable();
        this.adjustWeightToggleCtrl.setValue(true);

        this.allocatedResidualSplitCtrl.disable();
        this.allocatedResidualSplitDropDownCtrl.disable();

        if (quantity.newValue > quantity.oldValue) {
            this.unallocatedResidualSplitCtrl.disable();
        } else if (quantity.newValue < quantity.oldValue) {
            this.dataVersionId ? this.unallocatedResidualSplitCtrl.disable() : this.unallocatedResidualSplitCtrl.enable();
        }
    }

    checkAnyToggleSelected(): boolean {
        if ((this.adjustWeightToggleCtrl.value) || (this.allocatedResidualSplitCtrl.value) || (this.unallocatedResidualSplitCtrl.value)) {
            return true;
        }
        return false;
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
        section.currentTradeOptionId = CurrentTradeOption.NoAction;
        if (this.adjustWeightToggleCtrl.value) {
            section.currentTradeOptionId = CurrentTradeOption.AdjustContract;
        } else if (this.allocatedResidualSplitCtrl.value) {
            section.currentTradeOptionId = CurrentTradeOption.CreateAllocatedResidualSplit;
        } else if (this.unallocatedResidualSplitCtrl.value) {
            section.currentTradeOptionId = CurrentTradeOption.CreateUnallocatedResidualSplit;
        }
        return section;
    }

}
