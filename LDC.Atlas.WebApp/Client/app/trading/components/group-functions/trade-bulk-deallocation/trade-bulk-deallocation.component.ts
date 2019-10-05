import { Component, OnInit, ViewChild } from '@angular/core';
import { MatStepper, MatDialog } from '@angular/material';
import { GroupFunctionContractsComponent } from '../group-function-contracts/group-function-contracts.component';
import { FormGroup, FormBuilder } from '@angular/forms';
import { BaseFormComponent } from '../../../../shared/components/base-form-component/base-form-component.component';
import { FormConfigurationProviderService } from '../../../../shared/services/form-configuration-provider.service';
import { MasterData } from '../../../../shared/entities/masterdata.entity';
import { ActivatedRoute, Router } from '@angular/router';
import { GroupFunctionWarningComponent } from '../group-function-warning/group-function-warning.component';
import { BulkDeAllocationSectionDialogComponent } from './section-dialog/section-dialog.component';
import { ContractsForBulkFunctions } from '../../../../shared/services/trading/dtos/contracts-for-bulk-functions';
import { CompanyManagerService } from '../../../../core/services/company-manager.service';

@Component({
    selector: 'atlas-trade-bulk-deallocation',
    templateUrl: './trade-bulk-deallocation.component.html',
    styleUrls: ['./trade-bulk-deallocation.component.scss']
})

export class TradeBulkDeallocationComponent extends BaseFormComponent implements OnInit {
    @ViewChild('stepper') stepper: MatStepper;
    @ViewChild('contractSelection') contractSelection: GroupFunctionContractsComponent;
    @ViewChild('groupFunctionWarning') groupFunctionWarning: GroupFunctionWarningComponent;

    bulkDeAllocationForm: FormGroup;
    isContractsNextDisabled: boolean = true;
    company: string;
    dataVersionId: number;
    masterData: MasterData = new MasterData();
    formComponents: BaseFormComponent[] = [];

    constructor(protected formConfigurationProvider: FormConfigurationProviderService,
        private route: ActivatedRoute,
        protected formBuilder: FormBuilder,
        private router: Router,
        private companyManager: CompanyManagerService,
        protected dialog: MatDialog, ) {
        super(formConfigurationProvider);
    }

    ngOnInit() {
        this.masterData = this.route.snapshot.data.masterdata;
        this.company = this.route.snapshot.paramMap.get('company');
        this.dataVersionId = this.route.snapshot.paramMap.get('dataVersionId') ?
            Number(this.route.snapshot.paramMap.get('dataVersionId')) : null;
        this.bulkDeAllocationForm = this.formBuilder.group({
            contractSelection: this.contractSelection.getFormGroup(),
        });
        this.formComponents.push(this.contractSelection);
    }

    isContractSelected(contractSelected: boolean) {
        this.isContractsNextDisabled = !contractSelected;
    }

    onDeAllocationButtonClicked() {
        const selectedContracts = this.contractSelection.selectedContractsForBulkFunctions as ContractsForBulkFunctions[];
        const deAllocateSectionDialog = this.dialog.open(BulkDeAllocationSectionDialogComponent, {
            data: { selectedContracts, company: this.company, dataVersionId: this.dataVersionId },
        });
        deAllocateSectionDialog.afterClosed().subscribe((data) => {
            if (data) {
                this.contractSelection.getContractsToDeAllocation();
            }
        });
    }

    onContractSelectionDiscardButtonClicked() {
        this.router.navigate(['/' + this.companyManager.getCurrentCompanyId() + '/trades']);
    }
}
