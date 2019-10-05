import { Component, OnInit } from '@angular/core';
import { AtlasFormControl } from '../../../../../shared/entities/atlas-form-control';
import { Section } from '../../../../../shared/entities/section.entity';
import { SectionTypes } from '../../../../../shared/enums/section-type.enum';

@Component({
    selector: 'atlas-new-tranche-split-footer',
    templateUrl: './new-tranche-split-footer.component.html',
    styleUrls: ['./new-tranche-split-footer.component.scss'],
})
export class NewTrancheSplitFooterComponent implements OnInit {
    sectionModel: Section;
    parentContractNumberCtrl = new AtlasFormControl('ParentContract');
    quantityConsumedCtrl = new AtlasFormControl('QuantityConsumed');
    quantityConsumedLabel: string;
    isInputField: boolean = false;
    quantityAvailableCtrl = new AtlasFormControl('QuantityAvailable');
    constructor() { }

    ngOnInit() {
        this.parentContractNumberCtrl.disable();
        this.quantityConsumedCtrl.disable();
        this.quantityAvailableCtrl.disable();
    }

    assignValue(sectionModel: Section, sectionType: number) {
        this.quantityConsumedLabel = sectionType === SectionTypes.Tranche ? 'Quantity Tranched:' : 'Quantity Splitted:';
        const childQuantityConsumed: number = 0;
        this.sectionModel = sectionModel;
        this.parentContractNumberCtrl.patchValue(this.sectionModel.contractLabel);
        this.quantityConsumedCtrl.patchValue(this.formatQuantity(childQuantityConsumed));
        this.quantityAvailableCtrl.patchValue(this.formatQuantity(this.sectionModel.quantity));
    }
    formatQuantity(value: number) {
        if (value) {
            return new Intl.NumberFormat('en-US', { minimumFractionDigits: 3, maximumFractionDigits: 3 }).format(value);
        }
        return value;
    }
}
