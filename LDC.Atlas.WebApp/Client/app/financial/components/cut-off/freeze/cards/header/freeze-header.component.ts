import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { Observable, of, throwError } from 'rxjs';
import { delay, finalize, mergeMap, retryWhen } from 'rxjs/operators';
import { CompanyManagerService } from '../../../../../../core/services/company-manager.service';
import { FreezeType } from '../../../../../../shared/enums/freeze-type.enum';
import { PermissionLevels } from '../../../../../../shared/enums/permission-level.enum';
import { FreezeService } from '../../../../../../shared/services/http-services/freeze.service';
import { isBeforeDate } from '../../../../../../shared/validators/date-validators.validator';
import { ConfirmationDialogComponent } from './../../../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { SnackbarService } from './../../../../../../shared/services/snackbar.service';

@Component({
    selector: 'atlas-freeze-header',
    templateUrl: './freeze-header.component.html',
    styleUrls: ['./freeze-header.component.scss'],
})
export class FreezeHeaderComponent implements OnInit {
    @Output() readonly freezeCreated = new EventEmitter<void>();

    now: moment.Moment;
    dailyDefault: moment.Moment;
    monthlyDefault: moment.Moment;
    dateCtrl = new FormControl();
    freezeTypeCtrl = new FormControl();
    FreezeType = FreezeType;
    company: string;
    dailyErrorMap: Map<string, string> = new Map();
    monthlyErrorMap: Map<string, string> = new Map();
    formGroup: FormGroup;
    isSaving = false;
    defaultDataVersionType: FreezeType = FreezeType.Daily;
    PermissionLevels = PermissionLevels;
    errorMessageReversed: string = 'A freeze database already exists. Do you wish to proceed and supersede? Please check if the accounting documents associated to the TA have been properly interfaced in order to avoid loss of any information. (Interface status has to be ‘cancelled’ or ‘completed’).';
    constructor(
        protected formBuilder: FormBuilder,
        protected route: ActivatedRoute,
        private freezeService: FreezeService,
        private dialog: MatDialog,
        protected companyManager: CompanyManagerService,
        private snackbarService: SnackbarService,
    ) {
        this.company = this.route.snapshot.paramMap.get('company');
        this.dailyErrorMap
            .set('isDateValid', 'Cannot freeze for date greather or equal than today.');
        this.monthlyErrorMap
            .set('isDateValid', 'Cannot freeze for unclosed periods.');
        this.now = this.companyManager.getCurrentCompanyDate();
        this.dailyDefault = this.now.clone().subtract(1, 'days').endOf('day').subtract(1, 'seconds');
        this.monthlyDefault = this.getLastClosedPeriod();
    }

    ngOnInit() {
        this.getFormGroup();
        const isFrozen: boolean = this.companyManager.getCompany(this.company).isFrozen;
    }

    getFormGroup(): FormGroup {
        this.formGroup = this.formBuilder.group({
            dateCtrl: this.dateCtrl,
            freezeTypeCtrl: this.freezeTypeCtrl,
        });

        this.setValidators();
        this.setDefaultValues();

        return this.formGroup;
    }

    setDefaultValues(): void {
        this.dateCtrl.setValue(this.dailyDefault);
        this.freezeTypeCtrl.setValue(this.defaultDataVersionType);
        this.onDataVersionTypeChanged(this.defaultDataVersionType);
    }

    setValidators() {
        if (this.freezeTypeCtrl.value === FreezeType.Daily) {
            this.dateCtrl.setValidators(
                [isBeforeDate(this.companyManager.getCurrentCompanyDate().clone().subtract(1, 'days').endOf('day'), true),
                Validators.required]);
        } else {
            this.dateCtrl.setValidators([
                isBeforeDate(this.companyManager.getCurrentCompanyDate(), true, true),
                Validators.required]);
        }
    }

    onSaveButtonClicked() {
        if (!this.dateCtrl.valid && this.dateCtrl.hasError('isDateValid')) {
            this.snackbarService.throwErrorSnackBar(
                'Cannot freeze for date greater than current date',
            );
            return;
        }

        this.dateCtrl.disable();
        this.isSaving = true;
        this.freezeService.checkFreezeExists(this.freezeTypeCtrl.value as FreezeType, this.getSelectedFreezeDate()).pipe(
            finalize(() => {
                this.dateCtrl.enable();
            }),
        ).subscribe((freeze) => {
            if (freeze) {
                const confirmDialog = this.dialog.open(ConfirmationDialogComponent, {
                    data: {
                        title: 'Freeze Creation',
                        text: 'Snapshot already exists for this date/month. Do you wish to proceed and overwrite ?',
                        okButton: 'Yes',
                        cancelButton: 'No',
                    },
                });
                confirmDialog.afterClosed().subscribe((answer) => {
                    if (answer) {
                        this.createFreeze();
                    } else {
                        this.isSaving = false;
                    }
                });
            } else {
                this.createFreeze();
            }
        });
    }

    getSelectedFreezeDate(): Date {
        const freezeDate = this.dateCtrl.value;
        if (this.freezeTypeCtrl.value === FreezeType.Monthly) {
            freezeDate.endOf('month').subtract(1, 'seconds');
        }
        const dateWithoutTimeZone: Date = freezeDate.toDate();
        dateWithoutTimeZone.setUTCHours(0, 0, 0, 0);
        return dateWithoutTimeZone;
    }

    delayedRetry(delayMs: number, maxRetry = 1) {
        let retries = maxRetry;

        return (src: Observable<any>) => {
            return src.pipe(
                retryWhen((errors: Observable<any>) => errors.pipe(
                    delay(delayMs),
                    mergeMap((error) => retries-- > 0 ? of(error) : throwError(error)),
                )),
            );
        };
    }

    createFreeze() {
        const freezeDate = this.getSelectedFreezeDate();

        this.isSaving = true;
        this.freezeService.createFreeze(
            this.freezeTypeCtrl.value as FreezeType, freezeDate).pipe(
                this.delayedRetry(1, 0),
                finalize(() => {
                    this.isSaving = false;
                }),
            ).subscribe(
                (monthEnd) => {
                    if (monthEnd) {
                        if (monthEnd[0].isMonthEnd && monthEnd[0].isReversed) {
                            const confirmDialog = this.dialog.open(ConfirmationDialogComponent, {
                                data: {
                                    title: 'TA Refreeze Creation',
                                    text: this.errorMessageReversed,
                                    okButton: 'Proceed',
                                    cancelButton: 'Cancel',
                                },
                            });
                            confirmDialog.afterClosed().subscribe((answer) => {
                                if (answer) {
                                    this.freezeService.createFreeze(this.freezeTypeCtrl.value as FreezeType, freezeDate).subscribe(() => {
                                        this.snackbarService.informationSnackBar('The Refreeze has been created');
                                    });

                                } else {
                                    this.isSaving = false;
                                }
                            });
                        }
                    } else {
                        this.snackbarService.informationSnackBar('The freeze has been created');
                        this.freezeCreated.emit();
                    }
                },
                (err) => {
                    if (err.status === 504) {
                        // Timeout
                        this.dialog.open(ConfirmationDialogComponent, {
                            data: {
                                title: 'Freeze in progress',
                                text: 'The creation of the freeze is taking a long time and is still in progress. '
                                    + 'Please refresh in some time to see your freeze in the list.',
                                okButton: 'Got it',
                            },
                        });

                    } else {
                        this.dialog.open(ConfirmationDialogComponent, {
                            data: {
                                title: 'Error',
                                text: err.error.detail && err.error.detail.length > 0 ?
                                    err.error.detail : 'Error during the completion of the freeze creation',
                                okButton: 'Got it',
                            },
                        });
                    }
                    this.freezeCreated.emit();
                },
            );
    }

    onDataVersionTypeChanged(dataVersionType: FreezeType) {
        this.setValidators();
        switch (dataVersionType) {
            case FreezeType.Daily:
                this.dateCtrl.patchValue(this.dailyDefault);
                break;
            case FreezeType.Monthly:
                this.dateCtrl.patchValue(this.monthlyDefault);
                break;
            default:
                break;
        }
    }

    // Last closed period for operations. This is the last month which has been closed for any operations to be done by the user.
    // It's the previous month currently. In the future it might come from the DB.
    private getLastClosedPeriod(): moment.Moment {
        const dateNow = this.now.clone();
        return dateNow.subtract(1, 'months').endOf('month').subtract(1, 'seconds');
    }
}
