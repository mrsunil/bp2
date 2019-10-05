import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatStepper } from '@angular/material';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { CompanyManagerService } from '../../../../core/services/company-manager.service';
import { BaseFormComponent } from '../../../../shared/components/base-form-component/base-form-component.component';
import { ConfirmationDialogComponent } from '../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { BulkCost } from '../../../../shared/entities/bulk-edit-cost.entity';
import { PermissionLevels } from '../../../../shared/enums/permission-level.enum';
import { FormConfigurationProviderService } from '../../../../shared/services/form-configuration-provider.service';
import { TradingService } from '../../../../shared/services/http-services/trading.service';
import { ContractsForBulkFunctions } from '../../../../shared/services/trading/dtos/contracts-for-bulk-functions';
import { CostBulkUpdateSummaryComponent } from './cost-bulk-update-summary/cost-bulk-update-summary.component';
import { SelectContractsComponent } from './select-contracts/select-contracts.component';
import { UpdateCostsComponent } from './update-costs/update-costs.component';

@Component({
    selector: 'atlas-trade-cost-bulk-update',
    templateUrl: './trade-cost-bulk-update.component.html',
    styleUrls: ['./trade-cost-bulk-update.component.scss'],
})
export class TradeCostBulkUpdateComponent extends BaseFormComponent implements OnInit {
    @ViewChild('stepper') stepper: MatStepper;
    @ViewChild('selectContractsComponent') selectContractsComponent: SelectContractsComponent;
    @ViewChild('updateCostsComponent') updateCostsComponent: UpdateCostsComponent;
    @ViewChild('CostBulkUpdateSummaryComponent') CostBulkUpdateSummaryComponent: CostBulkUpdateSummaryComponent;

    currentStep: number = 0;
    isContractsNextDisabled: boolean = true;
    formComponents: BaseFormComponent[] = [];
    bulkCostUpdateForm: FormGroup;
    company: string;
    PermissionLevels = PermissionLevels;

    constructor(protected formConfigurationProvider: FormConfigurationProviderService,
        protected formBuilder: FormBuilder,
        private route: ActivatedRoute,
        protected dialog: MatDialog,
        private router: Router,
        private companyManager: CompanyManagerService,
        protected tradingService: TradingService) {
        super(formConfigurationProvider);
    }

    ngOnInit() {
        this.company = this.route.snapshot.paramMap.get('company');
        this.bulkCostUpdateForm = this.formBuilder.group({
            selectContractsComponent: this.selectContractsComponent.getFormGroup(),
            updateCostsComponent: this.updateCostsComponent.getFormGroup(),
        });
        this.formComponents.push(this.selectContractsComponent, this.updateCostsComponent);
    }

    onChangeStepAction(event) {
        this.currentStep = event.selectedIndex;
    }

    onContractSelectionDiscardButtonClicked() {
        if (this.isContractsNextDisabled) {
            this.router.navigate(['/' + this.companyManager.getCurrentCompanyId() + '/trades']);
        } else {
            this.discardButtonDialog();
        }
    }

    isContractSelected(contractSelected: boolean) {
        this.isContractsNextDisabled = !contractSelected;
    }

    onContractSelectionNextButtonClicked() {
        const contracts: ContractsForBulkFunctions[] = this.selectContractsComponent.getSelectedContracts();
        const quantity: number = this.selectContractsComponent.getSelectedContractQuantity();
        if (contracts) {
            const sectionIds: number[] = contracts.map((contract) => contract.sectionId);
            this.updateCostsComponent.addCostsComponent.setCostsBySectionIds(contracts, quantity);
            this.updateCostsComponent.editCostsComponent.setCostsBySectionIds(sectionIds);
        }
        this.stepper.next();
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

    onFieldSelectionPreviousButtonClicked() {
        this.stepper.previous();
    }

    onSaveButtonClicked() {

        let costs: BulkCost[] = [];
        this.formComponents.forEach((comp) => {
            costs = comp.populateEntity(costs);
        });

        this.subscriptions.push(this.tradingService
            .saveBulkCost(costs)
            .subscribe(
                (data) => {
                    const contractsToSummary: BulkCost[] = this.updateCostsComponent.editCostsComponent.getGridData().
                        filter((cost) => cost.rowStatus !== 'N' && cost.rowStatus !== 'D');
                    if (contractsToSummary) {
                        if (data.value) {
                            data.value.forEach((cost) => {
                                contractsToSummary.push(cost);
                            });
                        }
                        this.CostBulkUpdateSummaryComponent.setCosts(contractsToSummary);
                    }
                    this.stepper.next();
                },
                (err) => {

                    throw err;
                }));

    }

    onInvoiceButtonClicked() {
        this.CostBulkUpdateSummaryComponent.invoiceSelectedCosts();
    }
}
