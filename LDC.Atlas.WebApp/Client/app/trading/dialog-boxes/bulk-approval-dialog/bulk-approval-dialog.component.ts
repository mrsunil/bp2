import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material';
import { ContractsForBulkFunctions } from '../../../shared/services/trading/dtos/contracts-for-bulk-functions';
import { TradingService } from '../../../shared/services/http-services/trading.service';
import { Router } from '@angular/router';
import { SnackbarService } from '../../../shared/services/snackbar.service';

@Component({
    selector: 'atlas-bulk-approval-dialog',
    templateUrl: './bulk-approval-dialog.component.html',
    styleUrls: ['./bulk-approval-dialog.component.scss']
})
export class BulkApprovalDialogComponent implements OnInit {
    selectedTrade: ContractsForBulkFunctions[] = [];
    lockedTrades: ContractsForBulkFunctions[] = [];
    interCoList: ContractsForBulkFunctions[] = [];
    protected selectedSectionIDs: number[] = [];
    bulkApprovalDialogData: {
        tradeSelectedList: ContractsForBulkFunctions[];
        lockedTrades: ContractsForBulkFunctions[];
        interCoList: ContractsForBulkFunctions[];
        company: string;
    };
    isApprovalEnabled: boolean;

    constructor(
        private router: Router,
        public bulkApprovalDialogRef: MatDialogRef<BulkApprovalDialogComponent>,
        protected snackbarService: SnackbarService,
        @Inject(MAT_DIALOG_DATA) public data: {
            company: string,
            tradeSelectedList: ContractsForBulkFunctions[],
            lockedTrades: ContractsForBulkFunctions[],
            interCoList: ContractsForBulkFunctions[];
        },
        protected tradingService: TradingService,
    ) {
        this.bulkApprovalDialogData = data;
    }

    ngOnInit() {
        this.selectedTrade = this.bulkApprovalDialogData.tradeSelectedList;
        this.lockedTrades = this.bulkApprovalDialogData.lockedTrades;
        this.interCoList = this.bulkApprovalDialogData.interCoList;
        if (this.selectedTrade.length > 0) {
            this.isApprovalEnabled = true;
        }

    }

    onSaveButtonClicked() {
        this.selectedTrade.forEach(element => {
            this.selectedSectionIDs.push(element.sectionId);
        });
        this.tradingService.bulkApproveSave(this.selectedSectionIDs)
            .subscribe(() => {
                this.snackbarService.informationSnackBar('Selected trades are approved');
                this.bulkApprovalDialogRef.close(true);
                this.router.navigate(['/' + this.bulkApprovalDialogData.company +
                    '/trades/groupfunctions']);
            },
                (error) => {
                    this.snackbarService.throwErrorSnackBar('Oops! An error ocurred');
                },
                () => {
                });

    }

    onDiscardButtonClick() {
        this.bulkApprovalDialogRef.close(false);
    }
}
