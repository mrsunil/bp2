import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CompanyManagerService } from '../../../../../core/services/company-manager.service';
import { BaseFormComponent } from '../../../../../shared/components/base-form-component/base-form-component.component';
import { ContractFamilyToTradeMerge } from '../../../../../shared/entities/contract-family-to-trade-merge.entity';
import { LockFunctionalContext } from '../../../../../shared/entities/lock-functional-context.entity';
import { MergeContracts } from '../../../../../shared/entities/merge-contracts.entity';
import { ContractMergeOptions } from '../../../../../shared/enums/trade-merge-options.enum';
import { FormConfigurationProviderService } from '../../../../../shared/services/form-configuration-provider.service';
import { LockService } from '../../../../../shared/services/http-services/lock.service';
import { TradingService } from '../../../../../shared/services/http-services/trading.service';
import { SnackbarService } from '../../../../../shared/services/snackbar.service';
import { MergeOptionsComponent } from './merge-options/merge-options.component';
import { MergeValidationsComponent } from './merge-validations/merge-validations.component';
import { TradesListComponent } from './trades-list/trades-list.component';

@Component({
    selector: 'atlas-trade-merge',
    templateUrl: './trade-merge.component.html',
    styleUrls: ['./trade-merge.component.scss'],
})
export class TradeMergeComponent extends BaseFormComponent implements OnInit, OnDestroy {
    @ViewChild('tradesListComponent') tradesListComponent: TradesListComponent;
    @ViewChild('mergeValidationsComponent') mergeValidationsComponent: MergeValidationsComponent;
    @ViewChild('mergeOptionsComponent') mergeOptionsComponent: MergeOptionsComponent;

    company: string;
    contractLabel: string;
    sectionId: number;
    formComponents: BaseFormComponent[] = [];
    tradeMergeForm: FormGroup;
    displayMergeButton: boolean = true;
    dataVersionId?: number;
    selectedContractLabels: string;
    selectedSectionId: number[] = [];
    message: boolean = false;
    contract: MergeContracts[] = [];
    multipleMergeMessage: string;

    constructor(private router: Router,
        private route: ActivatedRoute,
        protected formBuilder: FormBuilder,
        protected tradingService: TradingService,
        protected formConfigurationProvider: FormConfigurationProviderService,
        protected companyManager: CompanyManagerService,
        protected lockService: LockService,
        protected snackbarService: SnackbarService,
    ) { super(formConfigurationProvider); }

    ngOnInit() {
        this.company = this.route.snapshot.params['company'];
        this.sectionId = this.route.snapshot.params['currentSection.sectionId'];
        this.dataVersionId = this.route.snapshot.params['dataVersionId'] ? Number(this.route.snapshot.params['dataVersionId']) : null;
        this.tradeMergeForm = this.formBuilder.group({
            tradesListComponent: this.tradesListComponent.getFormGroup(),
            mergeOptionsComponent: this.mergeOptionsComponent.getFormGroup(),
        });
        this.formComponents.push(this.mergeOptionsComponent, this.tradesListComponent);
        this.subscriptions.push(this.lockService.cleanSessionLocks().subscribe());
    }

    selectedSectionIds(event) {
        this.selectedSectionId = event.sectiondIds;
    }

    onDiscardButtonClicked() {
        for (let i = 0; i < this.selectedSectionId.length; i++) {
            const sectionId = this.selectedSectionId[i];
            this.subscriptions.push(this.lockService.unlockContract(sectionId, LockFunctionalContext.TradeMerge)
                .subscribe(() => {
                    this.selectedSectionId = this.selectedSectionId.filter((id) => id !== sectionId);
                }));
        }
        this.router.navigate(['/' + this.companyManager.getCurrentCompanyId() + '/trades/display/' +
            encodeURIComponent(String(this.sectionId))]);
    }

    onSelectionOfSelectedIds(event) {
        if (event.sectiondIds && event.sectiondIds.length > 0) {
            this.mergeValidationsComponent.getSelectedSectionIds(event.sectiondIds);
        }
    }

    messageOnCostPopup(event) {
        this.tradesListComponent.warningMessageForDiffFields(event.warningList);
    }

    onSelectedContractLabels(contracts: string) {
        this.selectedContractLabels = contracts;
    }

    onSelectedMergeToContractLabel(contractLabel: string) {
        this.contractLabel = contractLabel;
    }

    enableMergeOnNoWarning(event) {
        this.displayMergeButton = false;
    }

    enableMergeButton(event) {
        if (event.blockingList && event.blockingList.length > 0) {
            this.displayMergeButton = true;
        } else if (event.warningList && event.warningList.length > 0) {
            this.displayMergeButton = false;
        }
    }

    onRemoveClick(event) {
        if (event.blockingSectionId && event.warningSectionId === null) {
            this.tradesListComponent.disableSelectedRowClick(event.blockingSectionId);
            if (event.blockingList && event.blockingList.length > 0) {
                this.displayMergeButton = true;
            } else {
                this.displayMergeButton = false;
            }
        } else if (event.warningSectionId && event.blockingSectionId === null) {
            this.tradesListComponent.disableSelectedRowClick(event.warningSectionId);
            if (event.warningList && event.warningList.length > 0) {
                this.displayMergeButton = false;
                if (event.blockingList && event.blockingList.length > 0) {
                    this.displayMergeButton = true;
                }
            } else {
                this.displayMergeButton = true;
            }
        } else {
            this.displayMergeButton = false;
        }
    }

    onRemoveCardOnUncheck(event) {
        this.mergeValidationsComponent.removeCardOnUnCheck(event);
    }

    onNoRowsSelected() {
        this.mergeValidationsComponent.getNoSelectedRows();
        this.displayMergeButton = true;
    }

    onMergeOptionSelected(event) {
        this.tradesListComponent.mergeOption = event;
        this.tradesListComponent.onMergeOptionSelected(event);
    }

    onMultipleMergeOptionSelected(message: string) {
        this.multipleMergeMessage = message;
    }

    onMergeButtonClicked() {
        this.formComponents.forEach((comp) => {
            this.contract = comp.populateEntity(this.contract);
        });
        this.tradesListComponent.onDisplayWarningMessage(this.contract);
    }

    onShowMessage(event) {
        let messageText: string;
        this.message = event;
        if (this.message) {
            const isMultipleMerge = this.contract.find((trade) => trade.mergeOption === ContractMergeOptions.ContractParent);
            messageText = isMultipleMerge ? this.multipleMergeMessage :
                'The Trade ' + this.selectedContractLabels + ' is merged To Trade ' + this.contractLabel + '';

            this.subscriptions.push(this.tradingService
                .saveContractsToTradeMerge(this.contract, this.dataVersionId)
                .subscribe((data) => {
                    this.snackbarService.informationSnackBar(messageText);
                    this.router.navigate(['/' + this.companyManager.getCurrentCompanyId() + '/trades/display/' +
                        encodeURIComponent(String(this.sectionId))]);
                }));
        }
    }

    ngOnDestroy(): void {
        this.subscriptions.push(this.lockService.cleanSessionLocks().subscribe(() => {
            this.subscriptions.forEach((subscription: Subscription) => {
                subscription.unsubscribe();
            });
        }));
    }
}
