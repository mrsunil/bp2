import { Component, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { interval, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CompanyManagerService } from '../../../core/services/company-manager.service';
import { ConfirmationDialogComponent } from '../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { LockResourceInformation } from '../../entities/lock-resource-information.entity';
import { LockService } from './../../services/http-services/lock.service';

@Component({
    selector: 'atlas-lock-interval',
    templateUrl: './lock-interval.component.html',
    styleUrls: ['./lock-interval.component.scss'],
})

export class LockIntervalComponent implements OnInit, OnDestroy {
    @Input() resourceId: number = null;
    @Input() resourceType: string = null;
    @Input() isEdit: boolean = false;
    @Input() resourceCode: string = null;
    @Input() resourcesInformation: LockResourceInformation[] = null;
    @Output() readonly lockLost = new EventEmitter<boolean>();

    companyId: string = null;
    destroy$ = new Subject();

    constructor(private route: ActivatedRoute,
        private lockService: LockService,
        private dialog: MatDialog,
        protected router: Router,
        protected companyManager: CompanyManagerService) { }

    ngOnInit() {

        this.companyId = this.route.snapshot.paramMap.get('company');
        const source = interval(15 * 1000);

        source.pipe(takeUntil(this.destroy$)).subscribe(() => {
            if (this.resourcesInformation !== null && this.resourcesInformation.length > 0) {
                this.lockService.refreshLockOwnership(this.resourcesInformation.filter((rsc) => rsc.needRefresh === true))
                    .pipe(
                        takeUntil(this.destroy$),
                    )
                    .subscribe((result) => {
                        this.resourcesInformation.forEach((rsc) => { rsc.needRefresh = true; });
                    }, (err) => {
                        if (err.error && err.error.type === 'https://ldc.com/atlas/lock-refresh-error' && err.error.detail !== '') {
                            this.dialog.open(ConfirmationDialogComponent, {
                                data: {
                                    title: 'Lock',
                                    text: err.error.detail,
                                    okButton: 'Got it',
                                },
                            });
                            //this.lockLost.emit()
                            this.router.navigate(['/' + this.companyManager.getCurrentCompanyId() + '/home']);
                        }
                    });
            }
            else {
                if (this.isSingleResource()) {
                    this.resourcesInformation = new Array<LockResourceInformation>();
                    const resourceInformation = new LockResourceInformation();
                    resourceInformation.resourceType = this.resourceType;
                    resourceInformation.resourceId = this.resourceId;
                    resourceInformation.resourceCode = this.resourceCode;
                    resourceInformation.needRefresh = true;

                    this.resourcesInformation.push(resourceInformation);
                }
            }
        });

    }

    isSingleResource(): boolean {

        return (this.isEdit && this.resourceId !== null);
    }

    @HostListener('window:beforeunload', ['$event']) unloadNotification($event: any) {
        // this.lockService.cleanSessionLocksSubject.next();
        this.lockService.cleanSessionLocks().subscribe();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
