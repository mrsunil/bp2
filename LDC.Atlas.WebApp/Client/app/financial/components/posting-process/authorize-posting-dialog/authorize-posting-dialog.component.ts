import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { PostingManagementDisplayView } from '../../../../shared/models/posting-management-display-view';
import { PreaccountingService } from '../../../../shared/services/http-services/preaccounting.service';
import { SnackbarService } from '../../../../shared/services/snackbar.service';

@Component({
    selector: 'atlas-authorize-posting-dialog',
    templateUrl: './authorize-posting-dialog.component.html',
    styleUrls: ['./authorize-posting-dialog.component.scss'],
})
export class AuthorizePostingDialogComponent implements OnInit {

    isTopCardVisible: boolean = true;
    isBottomCardVisible: boolean = true;
    authorizePostingSubscription: Subscription;
    validateAccountingDocument: PostingManagementDisplayView[];
    passedAccountingDocument: PostingManagementDisplayView[];

    constructor(private snackbarService: SnackbarService,
        private router: Router,
        private route: ActivatedRoute,
        private preaccountingService: PreaccountingService,
        public thisDialogRef: MatDialogRef<AuthorizePostingDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
        this.validateAccountingDocument = data.validateAccountingDocument;
        this.passedAccountingDocument = data.passedAccountingDocument;
    }

    ngOnInit() {
        this.isTopCardVisible = this.validateAccountingDocument.length === 0 ? false : true;
        this.isBottomCardVisible = this.passedAccountingDocument.length === 0 ? false : true;
    }

    onConfirmButtonClicked() {
        this.authorizePostingSubscription = this.preaccountingService.authorizeForPosting(this.passedAccountingDocument)
            .subscribe(() => {
            }, (error) => {
                console.error(error);
                this.snackbarService.throwErrorSnackBar('Oops! An error ocurred');
            });

        this.thisDialogRef.close(null);
    }

    onDiscardButtonClicked() {
        this.thisDialogRef.close(null);
    }

    ngOnDestroy(): void {
        if (this.authorizePostingSubscription) {
            this.authorizePostingSubscription.unsubscribe();
        }
    }

}
