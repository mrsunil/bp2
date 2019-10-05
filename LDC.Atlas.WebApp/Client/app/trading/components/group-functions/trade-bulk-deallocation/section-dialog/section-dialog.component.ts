import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ContractsForBulkFunctions } from '../../../../../shared/services/trading/dtos/contracts-for-bulk-functions';
import { BulkDeallocateSectionCommand } from '../../../../../shared/services/execution/dtos/bulk-deallocation-section-command';
import { DeallocateBulkSections } from '../../../../../shared/services/execution/dtos/deallocate-bulk-sections';
import { ExecutionService } from '../../../../../shared/services/http-services/execution.service';
import { SnackbarService } from '../../../../../shared/services/snackbar.service';

@Component({
    selector: 'atlas-section-dialog',
    templateUrl: './section-dialog.component.html',
    styleUrls: ['./section-dialog.component.scss']
})

export class BulkDeAllocationSectionDialogComponent implements OnInit {
    model: any;
    company: string;
    dataVersionId: number;

    constructor(public thisDialogRef: MatDialogRef<BulkDeAllocationSectionDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private executionService: ExecutionService,
        protected snackbarService: SnackbarService, ) {
        this.model = data;
        this.company = data.company;
        this.dataVersionId = data.dataVersionId;
        thisDialogRef.disableClose = true;
    }

    ngOnInit() {
        if (this.model) {
            this.model.selectedContracts.forEach((element) => {
                element.removeSectionTrafficInfo = true;
            });
        }
    }

    onSelectedContractClicked(section: ContractsForBulkFunctions) {
        const sectionFiltered: ContractsForBulkFunctions = this.model.selectedContracts.find((sec) =>
            sec.sectionId === section.sectionId);
        if (sectionFiltered) {
            sectionFiltered.removeSectionTrafficInfo = !sectionFiltered.removeSectionTrafficInfo;
            if (sectionFiltered.allocatedContractReference) {
                this.model.selectedContracts.forEach((element) => {
                    if (sectionFiltered.allocatedContractReference === element.contractLabel) {
                        element.removeSectionTrafficInfo = !element.removeSectionTrafficInfo;
                    }
                });
            }

        }
    }

    onDiscardButtonClicked() {
        this.thisDialogRef.close(null);
    }

    onDeAllocateButtonClicked() {
        let bulkDeallocateCommand: BulkDeallocateSectionCommand = new BulkDeallocateSectionCommand();
        bulkDeallocateCommand.deallocateBulkSections = [];
        bulkDeallocateCommand.company = this.company;
        bulkDeallocateCommand.dataVersionId = this.dataVersionId;
        this.model.selectedContracts.forEach((contract) => {
            let deAllocateBulkSection: DeallocateBulkSections = new DeallocateBulkSections();
            deAllocateBulkSection.reInstateTrafficDetails = contract.removeSectionTrafficInfo;
            deAllocateBulkSection.sectionId = contract.sectionId;
            bulkDeallocateCommand.deallocateBulkSections.push(deAllocateBulkSection);
        });
        this.executionService.deallocateBulkContract(bulkDeallocateCommand)
            .subscribe((ok) => {
                if (ok) {
                    this.snackbarService.throwErrorSnackBar(
                        'Trades has been successfully de-allocated',
                    );
                    this.thisDialogRef.close(true);
                }
            });
    }
}
