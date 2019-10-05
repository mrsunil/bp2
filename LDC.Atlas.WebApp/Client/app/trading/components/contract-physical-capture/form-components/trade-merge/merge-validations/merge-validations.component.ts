import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Route } from '@angular/router';
import { BaseFormComponent } from '../../../../../../shared/components/base-form-component/base-form-component.component';
import { FormConfigurationProviderService } from '../../../../../../shared/services/form-configuration-provider.service';
import { TradingService } from '../../../../../../shared/services/http-services/trading.service';
import { TradeMergeMessage } from '../../../../../../trading/entities/trade-merge-message.entity';

@Component({
    selector: 'atlas-merge-validations',
    templateUrl: './merge-validations.component.html',
    styleUrls: ['./merge-validations.component.scss'],
})
export class MergeValidationsComponent extends BaseFormComponent implements OnInit {

    @Output() readonly removeClick = new EventEmitter<any>();

    @Output() readonly mergeButtonEnabled = new EventEmitter<any>();
    @Output() readonly noWarningCardToButtonEnable = new EventEmitter<any>();
    @Output() readonly warningMessageOnDiffFields = new EventEmitter<any>();

    dataVersionId: number;
    showRestrictedMessageCard: boolean = false;
    showWarningMessageCard: boolean = false;

    blockingOrWarningSectionIds: number;
    isBlocking: boolean = false;
    isWarning: boolean = false;
    contractSectionCode: string;
    blockingInput: string[] = [];
    warningInput: string[] = [];
    blockingSectionIds: number;
    warningSectionIds: number;
    contractSectionCodeWarningList: TradeMergeMessage[] = [];
    contractSectionCodeBlockingList: TradeMergeMessage[] = [];

    warningMessageList: string[] = [];
    blockingMessageList: string[] = [];
    existingSectionIds: number[] = [];
    resultWarningOrBlcokingMessages: TradeMergeMessage[] = [];
    warningListWithDiffMessages: string[] = [];

    constructor(protected formConfigurationProvider: FormConfigurationProviderService,
        private tradingService: TradingService,
        private route: ActivatedRoute) {
        super(formConfigurationProvider);
    }

    ngOnInit() {
        this.dataVersionId = this.route.snapshot.params['dataVersionId'] ? Number(this.route.snapshot.params['dataVersionId']) : null;
    }

    removeCardOnUnCheck(event) {
        if (this.existingSectionIds && this.existingSectionIds.length > 0) {
            if (this.contractSectionCodeBlockingList && this.contractSectionCodeBlockingList.length > 0) {
                this.contractSectionCodeBlockingList = this.contractSectionCodeBlockingList.filter((item) =>
                    item.sectionId !== event);
            }
            if (this.contractSectionCodeWarningList && this.contractSectionCodeWarningList.length > 0) {
                this.contractSectionCodeWarningList = this.contractSectionCodeWarningList.filter((item) =>
                    item.sectionId !== event);
            }
            this.existingSectionIds = this.existingSectionIds.filter((item) => item !== event);
        }
    }

    getSelectedSectionIds(sectionIds: number[]) {
        if (sectionIds && sectionIds.length > 0) {
            this.tradingService.getSectionIdsForSelectedContractsToMerge(sectionIds, this.dataVersionId)
                .subscribe((data) => {
                    if (data && data.value.length > 0) {
                        this.resultWarningOrBlcokingMessages = data.value;
                        data.value.forEach((element) => {
                            this.blockingOrWarningSectionIds = element.sectionId;
                            this.contractSectionCode = element.contractSectionCode;
                            if (this.existingSectionIds && this.existingSectionIds.length === 0) {
                                this.existingSectionIds.push(element.sectionId);
                                this.setWarningOrBlockingMessages(element);
                            } else if (!this.existingSectionIds.includes(element.sectionId)) {
                                this.setWarningOrBlockingMessages(element);
                                this.existingSectionIds.push(element.sectionId);
                            }
                        });
                    } else if (data && data.value.length === 0) {
                        this.noWarningCardToButtonEnable.emit();
                    }
                });
        }
    }

    private setWarningOrBlockingMessages(element: TradeMergeMessage) {
        this.isBlocking = false;
        this.isWarning = false;

        const blockingMessage: TradeMergeMessage = this.resultWarningOrBlcokingMessages.find((result) =>
            result.sectionId === element.sectionId && result.isBlocking);
        if (blockingMessage) {
            this.isBlocking = blockingMessage.isBlocking;
        }

        const warningMessage: TradeMergeMessage = this.resultWarningOrBlcokingMessages.find((result) =>
            result.sectionId === element.sectionId && result.isWarning);

        if (warningMessage) {
            this.isWarning = warningMessage.isWarning;
        }

        if (this.isBlocking) {
            this.showRestrictedMessageCard = true;
            this.blockingInput = this.resultWarningOrBlcokingMessages.find((result) =>
                result.sectionId === element.sectionId && result.isBlocking).blockingOrWarningInput;
            this.blockingSectionIds = element.sectionId;
            const message = new TradeMergeMessage();
            message.contractSectionCode = element.contractSectionCode;
            message.blockingOrWarningInput = this.blockingInput;
            message.sectionId = element.sectionId;
            this.contractSectionCodeBlockingList.push(message);
            this.contractSectionCodeBlockingList = Array.from(new Set(this.contractSectionCodeBlockingList.map((contract) => contract)));
        }
        if (this.isWarning) {
            this.showWarningMessageCard = true;
            this.warningInput = this.resultWarningOrBlcokingMessages.find((result) =>
                result.sectionId === element.sectionId && result.isWarning).blockingOrWarningInput;
            const message = new TradeMergeMessage();
            message.contractSectionCode = element.contractSectionCode;
            message.blockingOrWarningInput = this.warningInput;
            message.sectionId = element.sectionId;
            this.contractSectionCodeWarningList.push(message);
            this.contractSectionCodeWarningList = Array.from(new Set(this.contractSectionCodeWarningList.map((contract) => contract)));
            this.warningSectionIds = element.sectionId;
        }
        this.mergeButtonEnabled.emit({
            blockingList: this.contractSectionCodeBlockingList,
            warningList: this.contractSectionCodeWarningList,
        });
        this.warningMessageOnDiffFields.emit({
            warningList: this.warningInput.toString(),
        });
    }

    onWarningRemoveButtonClicked(sectionId) {
        this.contractSectionCodeWarningList = this.contractSectionCodeWarningList.filter((item) => item.sectionId !== sectionId);
        this.removeClick.emit({
            blockingSectionId: null,
            warningSectionId: sectionId,
            warningList: this.contractSectionCodeWarningList,
            blockingList: this.contractSectionCodeBlockingList,
        });
    }

    onRestrictRemoveButtonClicked(sectionId) {
        this.contractSectionCodeBlockingList = this.contractSectionCodeBlockingList.filter((item) => item.sectionId !== sectionId);
        this.removeClick.emit({
            blockingSectionId: sectionId,
            warningSectionId: null,
            blockingList: this.contractSectionCodeBlockingList,
            warningList: this.contractSectionCodeWarningList,
        });
    }

    getNoSelectedRows() {
        if (this.showRestrictedMessageCard) {
            this.showRestrictedMessageCard = !this.showRestrictedMessageCard;
        }
        if (this.showWarningMessageCard) {
            this.showWarningMessageCard = !this.showWarningMessageCard;
        }
    }

}
