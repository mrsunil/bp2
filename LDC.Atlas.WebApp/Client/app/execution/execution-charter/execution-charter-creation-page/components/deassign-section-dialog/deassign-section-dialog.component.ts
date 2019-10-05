import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ConfirmationDialogComponent } from '../../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { AssignedSection } from '../../../../../shared/entities/assigned-section.entity';
import { Charter } from '../../../../../shared/entities/charter.entity';
import { IsLocked } from '../../../../../shared/entities/is-locked.entity';
import { AssignedSectionView } from '../../../../../shared/models/assigned-section-display-view';
import { ExecutionService } from '../../../../../shared/services/http-services/execution.service';
import { LockService } from '../../../../../shared/services/http-services/lock.service';
import { SnackbarService } from '../../../../../shared/services/snackbar.service';

@Component({
    selector: 'atlas-deassign-section-dialog',
    templateUrl: './deassign-section-dialog.component.html',
    styleUrls: ['./deassign-section-dialog.component.scss'],
})
export class DeassignSectionDialogComponent implements OnInit, OnDestroy {
    model: Charter;

    isTopCardVisible: boolean = true;
    isBottomCardVisible: boolean = true;
    removeSectionSubscription: Subscription;
    fullyInvoiceContract: AssignedSectionView[];
    destroy$ = new Subject();

    constructor(private snackbarService: SnackbarService,
        private router: Router,
        private route: ActivatedRoute,
        private executionService: ExecutionService,
        protected dialog: MatDialog,
        protected lockService: LockService,
        public thisDialogRef: MatDialogRef<DeassignSectionDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
        this.model = data.result;
        this.fullyInvoiceContract = data.fullyInvoiceContract;
    }

    ngOnInit() {
        this.fullyInvoiceContract.length > 0 ? this.isTopCardVisible = true : this.isTopCardVisible = false;
        this.model.assignedSections.length > 0 ? this.isBottomCardVisible = true : this.isBottomCardVisible = false;
        this.model.assignedSections.forEach((element) => {
            element.removeSectionTrafficInfo = true;
        });
    }

    onSelectedContractClicked(section: AssignedSection) {
        const sectionFiltered: AssignedSection = this.model.assignedSections.find((sec) =>
            sec.sectionId === section.sectionId);
        if (sectionFiltered) {
            this.model.assignedSections.find((sec) =>
                sec.sectionId === section.sectionId).removeSectionTrafficInfo = !section.removeSectionTrafficInfo;
        }
    }

    onDeassignButtonClicked() {

        let sectionList = this.model.assignedSections.map((section) => Number(section.sectionId));

        this.model.assignedSections.forEach((assignedSection) => {
            const allocatedSection = this.model.assignedSections.filter((sec) => sec.allocatedTo === assignedSection.contractLabel);
            this.lockService.isLockedContract(assignedSection.sectionId).pipe(takeUntil(this.destroy$)).subscribe((lock: IsLocked) => {
                if (lock.isLocked) {
                    this.dialog.open(ConfirmationDialogComponent, {
                        data: {
                            title: 'Lock',
                            text: lock.message,
                            okButton: 'Got it',
                        },
                    });
                    sectionList = sectionList.filter((id) => id !== assignedSection.sectionId);
                    if (allocatedSection && allocatedSection.length > 0) {
                        sectionList = sectionList.filter((id) => id !== allocatedSection[0].sectionId);
                    }
                } else if (allocatedSection && allocatedSection.length > 0) {
                    this.lockService.isLockedContract(allocatedSection[0].sectionId)
                        .pipe(takeUntil(this.destroy$)).subscribe((lock: IsLocked) => {
                            if (lock.isLocked) {
                                this.dialog.open(ConfirmationDialogComponent, {
                                    data: {
                                        title: 'Lock',
                                        text: lock.message,
                                        okButton: 'Got it',
                                    },
                                });
                                sectionList = sectionList.filter((id) => id !== allocatedSection[0].sectionId);
                            } else {
                                this.removeSectionSubscription = this.executionService
                                    .removeSectionFromCharter(this.model.charterId, [assignedSection.sectionId])
                                    .subscribe(() => {
                                        this.executionService.updateCharter(this.model, true)
                                            .subscribe(() => {
                                                this.snackbarService.informationSnackBar('Section has been de-assigned.');
                                                this.thisDialogRef.close(null);
                                            });
                                    });
                            }
                        });
                } else {

                    this.removeSectionSubscription = this.executionService
                        .removeSectionFromCharter(this.model.charterId, [assignedSection.sectionId])
                        .subscribe(
                            () => {
                                this.executionService.updateCharter(this.model, true)
                                    .subscribe(
                                        () => {
                                            this.snackbarService.informationSnackBar('Section has been de-assigned.');
                                            this.thisDialogRef.close(null);
                                        },
                                        (error) => {
                                            console.error(error);
                                            this.snackbarService.throwErrorSnackBar('Oops! An error ocurred');
                                        });
                            },
                            (error) => {
                                console.error(error);
                                this.snackbarService.throwErrorSnackBar('Oops! An error ocurred');
                                this.thisDialogRef.close(null);
                            });
                }
            });
        });
    }

    onDiscardButtonClicked() {
        this.thisDialogRef.close(null);
    }

    ngOnDestroy(): void {
        if (this.removeSectionSubscription) {
            this.removeSectionSubscription.unsubscribe();
        }
        this.destroy$.next();
        this.destroy$.complete();
    }
}
