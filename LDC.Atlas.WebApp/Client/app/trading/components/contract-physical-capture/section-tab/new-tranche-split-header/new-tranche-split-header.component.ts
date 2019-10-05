import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AtlasFormControl } from '../../../../../shared/entities/atlas-form-control';
import { Section } from '../../../../../shared/entities/section.entity';
import { SectionTypes } from '../../../../../shared/enums/section-type.enum';

@Component({
    selector: 'atlas-new-tranche-split-header',
    templateUrl: './new-tranche-split-header.component.html',
    styleUrls: ['./new-tranche-split-header.component.scss'],
})
export class NewTrancheSplitHeaderComponent implements OnInit {
    @Output() readonly addSplitOrTranchesEvent = new EventEmitter();
    @Output() readonly newTrancheShippingEvent = new EventEmitter();
    addNewLineCtrl = new AtlasFormControl('', 1);
    toggleShippingDeliveryCtrl: boolean = false;
    isSectionTypeTranche: boolean = false;
    title: string;
    public sectionModel: Section;
    showAddline: boolean = false;
    constructor() { }

    ngOnInit() {

    }

    assignSectionType(sectionType: number) {
        this.title = 'Split';
        this.isSectionTypeTranche = false;
        if (sectionType === SectionTypes.Tranche) {
            this.isSectionTypeTranche = true;
            this.title = 'Tranche';
        }
    }
    toggleBasedOnShippingDelivery() {
        this.toggleShippingDeliveryCtrl = !this.toggleShippingDeliveryCtrl;
        this.newTrancheShippingEvent.emit(this.toggleShippingDeliveryCtrl);
    }

    onProceedButtonClicked() {
        this.addSplitOrTranchesEvent.emit(this.addNewLineCtrl.value);
        this.addNewLineCtrl.patchValue('');
    }
}
