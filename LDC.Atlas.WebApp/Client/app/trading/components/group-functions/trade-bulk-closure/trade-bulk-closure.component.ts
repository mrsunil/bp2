
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatStepper } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, throwError } from 'rxjs';
import { CompanyManagerService } from '../../../../core/services/company-manager.service';
import { BaseFormComponent } from '../../../../shared/components/base-form-component/base-form-component.component';
import { ConfirmationDialogComponent } from '../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { TradePropertyPrivilege } from '../../../../shared/entities/trade-property-privilege.entity';
import { FormConfigurationProviderService } from '../../../../shared/services/form-configuration-provider.service';
import { TradingService } from '../../../../shared/services/http-services/trading.service';
import { TradeEditService } from '../../../../shared/services/trade-edit.service';
import { ContractsForBulkFunctions } from '../../../../shared/services/trading/dtos/contracts-for-bulk-functions';
import { TradeActionsService } from '../../../services/trade-actions.service';
import { GroupFunctionContractsComponent } from '../group-function-contracts/group-function-contracts.component';
import { GroupFunctionWarningComponent } from '../group-function-warning/group-function-warning.component';
import { BulkClosureMatrixComponent } from './bulk-closure-matrix/bulk-closure-matrix.component';
import { SummaryClosureMatrixComponent } from './summary/summary-closure-matrix.component';
import { catchError, finalize } from 'rxjs/operators';
import { ContractsForBulkClosureFunctions } from '../../../../shared/services/trading/dtos/contracts-for-bulk-closure-functions';
import { LockService } from '../../../../shared/services/http-services/lock.service';

@Component({
    selector: 'atlas-trade-bulk-closure',
    templateUrl: './trade-bulk-closure.component.html',
    styleUrls: ['./trade-bulk-closure.component.scss'],
})

export class TradeBulkClosureComponent extends BaseFormComponent implements OnInit, OnDestroy {
    @ViewChild('stepper') stepper: MatStepper;
    @ViewChild('contractSelection') contractSelection: GroupFunctionContractsComponent;
    @ViewChild('groupFunctionWarning') groupFunctionWarning: GroupFunctionWarningComponent;
    @ViewChild('closurematrix') closureMatrix: BulkClosureMatrixComponent;
    @ViewChild('summarymatrix') summaryMatrix: SummaryClosureMatrixComponent;

    formComponents: BaseFormComponent[] = [];
    selectedContractsForClosureFunctions: ContractsForBulkFunctions[];
    selectedContractsForClosureSummaryFunctions: ContractsForBulkClosureFunctions[];
    privileges: TradePropertyPrivilege;
    company: string;
    bulkEditionFormGroup: FormGroup;
    isContractsNextDisabled: boolean = true;
    isContractsClosureNextDisabled: boolean = true;
    currentStep: number = 0;
    selectedSectionIds: number[] = [];
    selectContractValue: any;
    isEditButtonClicked: boolean;
    fetchingInProgress: boolean;
    dataVersionId: number;
    childFlag: number = 0;
    private getTradesForSubscription: Subscription;

    constructor(
        protected formConfigurationProvider: FormConfigurationProviderService,
        protected formBuilder: FormBuilder,
        private route: ActivatedRoute,
        protected dialog: MatDialog,
        private router: Router,
        private companyManager: CompanyManagerService,
        private tradingService: TradingService,
        private tradeEditService: TradeEditService,
        protected lockService: LockService,
        private tradeActionService: TradeActionsService,
    ) {
        super(formConfigurationProvider);
    }

    ngOnInit() {
        this.company = this.route.snapshot.paramMap.get('company');
        this.dataVersionId = this.route.snapshot.paramMap.get('dataVersionId') ?
            Number(this.route.snapshot.paramMap.get('dataVersionId')) : null;
        this.bulkEditionFormGroup = this.formBuilder.group({
            contractSelection: this.contractSelection.getFormGroup(),
            closureMatrix: this.closureMatrix.getFormGroup(),
        });

        this.formComponents.push(this.contractSelection,
            this.closureMatrix);
    }

    onContractSelectionDiscardButtonClicked() {
        if (this.isContractsNextDisabled) {
            this.router.navigate(['/' + this.companyManager.getCurrentCompanyId() + '/trades']);
        } else {
            this.discardButtonDialog();
        }
    }

    onContractSelectionPreviousButtonClicked() {
        this.router.navigate(['/' + this.companyManager.getCurrentCompanyId() + '/trades/groupfunctions']);
    }

    contractsSelected(buttonClicked) {
        this.isEditButtonClicked = buttonClicked;
        const selectedContracts = this.contractSelection.selectedContractsForBulkFunctions as ContractsForBulkFunctions[];
        const privileges = this.tradeActionService.getTradePropertyPrivileges();
        this.privileges = privileges as TradePropertyPrivilege;
        this.selectedSectionIds = [];
        selectedContracts.forEach((element) => {
            this.selectedSectionIds.push(element.sectionId);
        });
        if (this.selectedSectionIds) {
            this.fetchingInProgress = false;
            this.subscriptions.push(this.tradingService.getTradesForBulkClosure(this.selectedSectionIds)
                .pipe(catchError((error) => {
                    return throwError(error);
                }),
                    finalize(() => {
                        this.fetchingInProgress = true;
                    })).subscribe((data) => {
                        if (data) {
                            this.selectedContractsForClosureFunctions = data.value;
                            this.closureMatrix.ContractsForClosure(this.selectedContractsForClosureFunctions, this.contractSelection.ContractGridRows);
                        }
                    }));
        }
    }

    afterContractsFetched() {
        this.closureMatrix.ContractsForClosure(this.selectedContractsForClosureFunctions, this.contractSelection.ContractGridRows);
        this.stepper.previous();
    }

    ngOnDestroy(): void {
        if (this.getTradesForSubscription) {
            this.getTradesForSubscription.unsubscribe();
        }
    }

    contractsClosureSelected() {
        const selectedContracts = this.closureMatrix.selectedContractsClosureForBulkFunctions as ContractsForBulkClosureFunctions[];
        this.selectedContractsForClosureSummaryFunctions = selectedContracts;

    }

    onClosureMatrixDiscardButtonClicked() {
        if (this.isContractsClosureNextDisabled) {
            this.router.navigate(['/' + this.companyManager.getCurrentCompanyId() + '/trades']);
        } else {
            this.discardButtonDialog();
        }
        this.lockService.cleanSessionLocks().subscribe(() => {
        });
    }

    discardButtonDialog() {
        const confirmDiscardDialog = this.dialog.open(ConfirmationDialogComponent, {
            data: {
                title: 'Discard Changes',
                text: 'You have some modification pending. Close and lose changes?',
                okButton: 'Ok',
                cancelButton: 'Cancel',
            },
        });
        confirmDiscardDialog.afterClosed().subscribe((answer) => {
            if (answer) {
                this.router.navigate(['/' + this.companyManager.getCurrentCompanyId() + '/trades']);
            }
        });
    }

    isContractSelected(contractSelected: boolean) {
        this.isContractsNextDisabled = !contractSelected;
    }

    isContractClosureSelected(contractClosureSelected: boolean) {
        this.isContractsClosureNextDisabled = !contractClosureSelected;
    }

    onContractSelectionNextButtonClicked() {
        this.contractsSelected(this.isEditButtonClicked = false);
        this.stepper.next();
    }

    onClosureMatrixPreviousButtonClicked() {
        this.stepper.previous();
        this.lockService.cleanSessionLocks().subscribe(() => {
        });
    }

    onClosureMatrixNextButtonClicked() {
        this.contractsClosureSelected();
        let sectionIds = [];
        this.selectedContractsForClosureSummaryFunctions.forEach((contract) => {
            sectionIds.push(contract.sectionId);
        });
        this.subscriptions.push(this.tradingService.closeSection(sectionIds, this.childFlag, this.dataVersionId)
            .subscribe((ok) => {
                if (ok) {
                    this.summaryMatrix.ContractsForClosureSummary(this.selectedContractsForClosureSummaryFunctions);
                    this.stepper.next();
                }
            }));
    }

    onChangeStepAction(event) {
        this.currentStep = event.selectedIndex;
    }
    onSummaryFinishClosureMatrixButtonClicked() {
        this.router.navigate(['/' + this.companyManager.getCurrentCompanyId() + '/trades']);
    }

    onContractSelectedDiscardButtonClicked() {
        this.contractSelection.gridApi.forEachNode((node) => {
            node.setSelected(false);

        });
        this.contractSelection.loadGridConfiguration();
        this.contractSelection.searchContractForm.reset();
    }
}
