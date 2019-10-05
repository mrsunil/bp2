import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { BaseFormComponent } from '../../../../../shared/components/base-form-component/base-form-component.component';
import { WarningMessageTypes } from '../../../../../shared/enums/warning-message-type.enum';
import { FormConfigurationProviderService } from '../../../../../shared/services/form-configuration-provider.service';
import { AllocationMessage } from '../../../../entities/allocation-message';

@Component({
    selector: 'atlas-warning-allocation-form-component',
    templateUrl: './warning-allocation-form-component.component.html',
    styleUrls: ['./warning-allocation-form-component.component.scss'],
})

export class WarningAllocationFormComponent extends BaseFormComponent implements OnInit {

    @Output() readonly restrictionRemoveClick = new EventEmitter<boolean>();

    allocationMessage: AllocationMessage[] = [];
    showAllowDescriptionCard: boolean = false;
    showRestrictedDescriptionCard: boolean = false;
    showWarningDescriptionCard: boolean = false;

    WarningMessage: string;
    restrictedWarningMessage: string;

    constructor(protected formConfigurationProvider: FormConfigurationProviderService) {
        super(formConfigurationProvider);
    }

    ngOnInit() {
    }

    validateWarningMessages(warningMessages: AllocationMessage[]) {
        let isValidTrade = true;
        this.resetAllDescriptionComponents();
        if (warningMessages.length > 0) {
            warningMessages.forEach((item) => {
                // trade is Restricted , so return isValid =false;
                if (item.errorTypeId === WarningMessageTypes.Restricted) {
                    this.showRestrictedDescriptionCard = true;
                    this.restrictedWarningMessage = item.message;
                    isValidTrade = false;
                } else if (item.errorTypeId === WarningMessageTypes.Warning) {
                    // trade is Warning, allocation can be done , so return isValid =true;
                    this.showWarningDescriptionCard = true;
                    this.WarningMessage = item.message;
                }
            });
            this.showAllowDescriptionCard = isValidTrade;
        }
        this.showAllowDescriptionCard = isValidTrade;
        return isValidTrade;
    }

    resetAllDescriptionComponents() {
        this.showAllowDescriptionCard = false;
        this.showRestrictedDescriptionCard = false;
        this.showWarningDescriptionCard = false;
    }

    onRestrictRemoveclicked() {
        this.showRestrictedDescriptionCard = !this.showRestrictedDescriptionCard;
        // reset ag grid.
        this.restrictionRemoveClick.emit(true);
    }
    onWarningRemoveButtonClicked() {
        this.showWarningDescriptionCard = !this.showWarningDescriptionCard;
    }
    showAllowWarningMessages() {
        this.showAllowDescriptionCard = true;
    }
}
