import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatStepper } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { BulkApprovalDialogComponent } from '../../../../../app/trading/dialog-boxes/bulk-approval-dialog/bulk-approval-dialog.component';
import { CompanyManagerService } from '../../../../core/services/company-manager.service';
import { BaseFormComponent } from '../../../../shared/components/base-form-component/base-form-component.component';
import { IsLocked } from '../../../../shared/entities/is-locked.entity';
import { FormConfigurationProviderService } from '../../../../shared/services/form-configuration-provider.service';
import { LockService } from '../../../../shared/services/http-services/lock.service';
import { TradingService } from '../../../../shared/services/http-services/trading.service';
import { ChildTradeForSection } from '../../../../shared/services/trading/dtos/ChildTradesForSection';
import { ContractsForBulkFunctions } from '../../../../shared/services/trading/dtos/contracts-for-bulk-functions';
import { GroupFunctionContractsComponent } from '../group-function-contracts/group-function-contracts.component';
import { GroupFunctionWarningComponent } from '../group-function-warning/group-function-warning.component';

@Component({
    selector: 'atlas-trade-bulk-approval',
    templateUrl: './trade-bulk-approval.component.html',
    styleUrls: ['./trade-bulk-approval.component.scss'],
})
export class TradeBulkApprovalComponent extends BaseFormComponent implements OnInit {
    @ViewChild('stepper') stepper: MatStepper;
    @ViewChild('contractSelection') contractSelection: GroupFunctionContractsComponent;
    @ViewChild('groupFunctionWarning') groupFunctionWarning: GroupFunctionWarningComponent;

    formComponents: BaseFormComponent[] = [];
    company: string;
    bulkApprovalFormGroup: FormGroup;

    selectedApprovalList: ContractsForBulkFunctions[];
    interCoTradeList: ContractsForBulkFunctions[] = [];
    lockedTrades: ContractsForBulkFunctions[] = [];
    ChildTradeForSectionTrades: ContractsForBulkFunctions[] = [];
    childFilterList: number[] = [];
    subscriptions: Subscription[] = [];
    totalContractList: ContractsForBulkFunctions[] = [];
    ChildTradesList: ChildTradeForSection[] = [];
    isContractsNextDisabled: boolean;
    constructor(
        protected formConfigurationProvider: FormConfigurationProviderService,
        protected formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private companyManager: CompanyManagerService,
        public dialog: MatDialog,
        protected tradingService: TradingService,
        protected lockService: LockService,
    ) {
        super(formConfigurationProvider);
    }

    ngOnInit() {
        this.company = this.route.snapshot.paramMap.get('company');
        this.bulkApprovalFormGroup = this.formBuilder.group({
            contractSelection: this.contractSelection.getFormGroup(),
        });
        this.formComponents.push(this.contractSelection);
    }

    onDiscardButtonClicked() {
        this.router.navigate(['/' + this.companyManager.getCurrentCompanyId() + '/trades']);
    }

    onPreviousButtonClicked() {
        this.router.navigate(['/' + this.companyManager.getCurrentCompanyId() + '/trades/groupfunctions']);
    }

    onApproveButtonCliked() {
        let selectedList: ContractsForBulkFunctions[];
        selectedList = this.getSelectedApprovalList();
        this.lockedTrades = [];
        this.lockedTrades = selectedList.filter((id) => id.isLocked === true);
        selectedList = selectedList.filter((id) => id.isLocked === false);
        this.selectedApprovalList = [];
        this.totalContractList = [];
        this.selectedApprovalList = selectedList;
        const allTradeRows = this.contractSelection.totalContractList as ContractsForBulkFunctions[];
        this.totalContractList = allTradeRows;
        this.childFilterList = [];
        let childCountCheck = 0;
        this.interCoTradeList = [];
        let chkSubscribeState = false;
        if (selectedList.length > 0) {
            selectedList.forEach((selectedelement, index) => {
                this.subscriptions.push(
                    this.tradingService.getChildTradesForSection(selectedelement.sectionId)
                        .subscribe((data) => {
                            childCountCheck++;
                            if (data) {
                                let checkInterco: ChildTradeForSection[] = [];
                                const ChildTradesParentList = data.value as ChildTradeForSection[];
                                checkInterco = (ChildTradesParentList.filter((item) => item.sectionID === selectedelement.sectionId));
                                if (!checkInterco[0].isInterCo) {
                                    const childCount = (ChildTradesParentList.filter((item) => item.sectionID !== selectedelement.sectionId)).length;
                                    if (childCount > 0) {
                                        this.ChildTradesList = (ChildTradesParentList.filter((item) => item.sectionID !== selectedelement.sectionId));
                                        let checkCount = 0;
                                        for (let k = 0; k < this.ChildTradesList.length; k++) {
                                            chkSubscribeState = true;
                                            this.subscriptions.push(this.lockService.isLockedContract(this.ChildTradesList[k].sectionID).subscribe((lock: IsLocked) => {
                                                checkCount++;
                                                if (checkCount === childCount) {
                                                    chkSubscribeState = false;
                                                } else {
                                                    chkSubscribeState = true;
                                                }
                                                if (!lock.isLocked && !this.ChildTradesList[k].isInterCo) {
                                                    this.childFilterList.push(this.ChildTradesList[k].sectionID);
                                                    if ((selectedList.length === (childCountCheck)) && (checkCount === childCount)) {
                                                        this.openDialog();
                                                    }
                                                } else {
                                                    if ((selectedList.length === (childCountCheck)) && (checkCount === childCount)) {
                                                        this.openDialog();
                                                    }
                                                }
                                            }));

                                        }

                                    } else {
                                        if (selectedList.length === (childCountCheck) && (chkSubscribeState === false)) {
                                            this.openDialog();
                                        }
                                    }
                                } else {
                                    const interCo = this.totalContractList.filter((id) => id.sectionId === checkInterco[0].sectionID);
                                    interCo.forEach((element) => {
                                        this.interCoTradeList.push(element);
                                        this.selectedApprovalList = this.selectedApprovalList.filter((id) => id.sectionId !== element.sectionId);
                                    });
                                    if (selectedList.length === (childCountCheck)) {
                                        this.openDialog();
                                    }
                                }
                            }
                        }));
            });
        } else {
            this.openDialog();
        }
    }

    openDialog() {
        this.ChildTradeForSectionTrades = [];
        const childList = this.childFilterList;
        childList.forEach((element) => {
            const childTrades = (this.totalContractList.filter((item) => item.sectionId === element));
            childTrades.forEach((childelement) => {
                this.ChildTradeForSectionTrades.push(childelement);
            });
        });
        this.ChildTradeForSectionTrades.forEach((childelement) => {
            this.selectedApprovalList.push(childelement);
        });
        this.selectedApprovalList = this.selectedApprovalList.filter((el, i, a) => i === a.indexOf(el));

        const openDialog = this.dialog.open(BulkApprovalDialogComponent, {
            data: {
                company: this.company,
                tradeSelectedList: this.selectedApprovalList,
                lockedTrades: this.lockedTrades,
                interCoList: this.interCoTradeList,
            },
        });
    }

    getSelectedApprovalList() {
        let selectedApprovalList: ContractsForBulkFunctions[];
        this.formComponents.forEach((comp) => {
            selectedApprovalList = comp.populateEntity(selectedApprovalList);
        });
        return selectedApprovalList;
    }

    isContractSelected(contractSelected: boolean) {
        this.isContractsNextDisabled = contractSelected;
    }
}
