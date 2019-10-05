import { Location } from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { CharterPnlReportComponent } from '../../../../../execution/execution-charter/execution-charter-creation-page/components/charter-pnl-report/charter-pnl-report.component';
import { CharterReportComponent } from '../../../../../execution/execution-charter/execution-charter-creation-page/components/charter-report/charter-report.component';
import { ConfirmationDialogComponent } from '../../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { AssignedSection } from '../../../../../shared/entities/assigned-section.entity';
import { IsLocked } from '../../../../../shared/entities/is-locked.entity';
import { LockFunctionalContext } from '../../../../../shared/entities/lock-functional-context.entity';
import { CharterStatus } from '../../../../../shared/enums/charter-status.enum';
import { ExecutionService } from '../../../../../shared/services/http-services/execution.service';
import { LockService } from '../../../../../shared/services/http-services/lock.service';
import { SnackbarService } from '../../../../../shared/services/snackbar.service';
import { AuthorizationService } from '../../../../../core/services/authorization.service';
import { SecurityService } from '../../../../../shared/services/security.service';
import { DocumentService } from '../../../../../shared/services/http-services/document.service';
import { PhysicalDocumentTemplate } from '../../../../../shared/entities/document-template.entity';
import { GenericReportViewerComponent } from '../../../../../shared/components/generic-report-viewer/generic-report-viewer.component';

@Component({
    selector: 'atlas-charter-menu-bar-component',
    templateUrl: './charter-menu-bar-component.component.html',
    styleUrls: ['./charter-menu-bar-component.component.scss'],
})
export class CharterMenuBarComponent implements OnInit, OnDestroy {
    @Input() menuDisable: boolean = undefined;
    @Output() readonly charterSaveAction = new EventEmitter<void>();
    destroy$ = new Subject();

    charterId: number;
    sectionsAssigned: AssignedSection[];
    company: string;
    charterStatus: string;
    public closeCharterSubject = new Subject();
    public openCharterSubject = new Subject();
    tradeClosePrivilege: boolean = false;
    filteredTemplates: PhysicalDocumentTemplate[] = new Array<PhysicalDocumentTemplate>();

    constructor(private router: Router,
        private route: ActivatedRoute,
        protected dialog: MatDialog,
        private executionService: ExecutionService,
        private snackbarService: SnackbarService,
        protected location: Location,
        protected lockService: LockService,
        protected authorizationService: AuthorizationService,
        protected documentService: DocumentService,
        protected securityService: SecurityService
    ) {
    }

    ngOnInit() {
        this.charterId = this.route.snapshot.params['charterId'];
        this.company = this.route.snapshot.params['company'];
        this.securityService.isSecurityReady().subscribe(() => {
            if (this.authorizationService.isPrivilegeAllowed(this.company, 'Trades')
                && this.authorizationService.isPrivilegeAllowed(this.company, 'Physicals')) {
                this.tradeClosePrivilege = this.authorizationService.isPrivilegeAllowed(this.company, 'CloseTrade');
            }
        });
        const documentType = 76;
        this.documentService.getTemplates(documentType, 'Charters').subscribe((templates) => {
            this.filteredTemplates = templates.value;
        });
    }

    onCopyButtonClicked() {
        this.router.navigate(['/' + this.company + '/execution/charter/new', this.charterId]);
    }
    OnReportClick(data: any) {

        const openTradepnlReportDialog = this.dialog.open(GenericReportViewerComponent, {
            data:
            {
                reportName: data.name,
                reportPath: data.path,
            },
            width: '90%',
            height: '90%',
        });
    }
    onAssignButtonClicked() {
        this.router.navigate(['/' + this.company + '/execution/charter/assignment', this.charterId]);

    }
    onDeleteButtonClicked() {

        this.lockService.isLockedCharter(this.charterId).pipe(
            takeUntil(this.destroy$),
        ).subscribe((lock: IsLocked) => {
            if (lock.isLocked) {

                this.dialog.open(ConfirmationDialogComponent, {
                    data: {
                        title: 'Lock',
                        text: lock.message,
                        okButton: 'Got it',
                    },
                });
            } else {

                this.lockService.lockCharter(this.charterId, LockFunctionalContext.CharterDeletion).pipe(
                    takeUntil(this.destroy$),
                )
                    .subscribe(
                        (data) => {
                            const confirmDialog = this.dialog.open(ConfirmationDialogComponent, {
                                data: {
                                    title: 'Charter Deletion',
                                    text: 'Deleting a charter is permanent. Do you wish to proceed?',
                                    okButton: 'Delete anyway',
                                    cancelButton: 'Cancel',
                                },
                            });
                            confirmDialog.afterClosed().subscribe(
                                (answer) => {
                                    if (answer) {
                                        this.executionService.getSectionsAssignedToCharter(this.charterId).pipe(
                                            map((data) => {
                                                this.sectionsAssigned = data.value;
                                                if (this.sectionsAssigned && this.sectionsAssigned.length > 0) {
                                                    this.snackbarService.informationSnackBar('Charter cannot be deleted as it has allocated/assigned contracts');
                                                } else {
                                                    this.deleteCharterPermanantly();
                                                }
                                            }))
                                            .subscribe();
                                    }
                                });
                        },
                        (err) => {
                            const confirmDialog = this.dialog.open(ConfirmationDialogComponent, {
                                data: {
                                    title: 'Lock',
                                    text: err.error.detail,
                                    okButton: 'Got it',
                                },
                            });
                        });

            }
        });

    }
    goToChartersList() {
        this.router.navigate(['/' + this.company + '/execution/charter']);
    }

    onPreviousPageNavigation() {
        this.location.back();
    }

    onSaveCharterClicked() {
        this.charterSaveAction.emit();
    }

    allocateDeallocate() {
        this.router.navigate(['/' + this.company + '/execution/charter/allocateDeallocate', this.charterId]);
    }

    onSeeDocumentButtonClicked() {
        this.menuDisable = true;
        this.router.navigate(
            [this.company + '/execution/document/list/', 'charter', this.charterId],
        );
    }

    onViewPnLButtonClicked() {
        const openPnlReportDialog = this.dialog.open(CharterPnlReportComponent, {
            data:
            {
                charterId: this.charterId,
            },
            width: '90%',
            height: '90%',
        });
    }

    onViewCharterReportButtonClicked() {
        const openCharterReportDialog = this.dialog.open(CharterReportComponent, {
            data:
            {
                charterId: this.charterId,
            },
            width: '90%',
            height: '90%',
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
    deleteCharterPermanantly() {
        this.executionService.deleteCharter(this.charterId).subscribe(() => {
            this.snackbarService.informationSnackBar('Charter deleted successfully');
            this.goToChartersList();
        });
        if (!this.menuDisable) {
            this.lockService.unlockCharter(
                this.charterId, LockFunctionalContext.CharterDeletion)
                .pipe(takeUntil(this.destroy$)).subscribe();
        }
    }

    onOpenButtonClicked() {
        this.openCharterSubject.next();
    }

    onCloseButtonClicked() {
        this.closeCharterSubject.next();
    }

    updateCharterMenu(charterStatusId: number) {
        this.charterStatus = CharterStatus[charterStatusId].toString();
    }
}
