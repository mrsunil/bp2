import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { CompanyManagerService } from '../../../../core/services/company-manager.service';
import { BaseFormComponent } from '../../../../shared/components/base-form-component/base-form-component.component';
import { ConfirmationDialogComponent } from '../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { AccountingSetup } from '../../../../shared/entities/accounting-setup.entity';
import { ReportType } from '../../../../shared/enums/report-type.enum';
import { FormConfigurationProviderService } from '../../../../shared/services/form-configuration-provider.service';
import { PreaccountingService } from '../../../../shared/services/http-services/preaccounting.service';
import { TitleService } from '../../../../shared/services/title.service';
import { EndOfMonthSelectionComponent } from '../generate-end-of-month/cards/end-of-month-selection/end-of-month-selection.component';
@Component({
    selector: 'atlas-generate-end-of-month',
    templateUrl: './generate-end-of-month.component.html',
    styleUrls: ['./generate-end-of-month.component.scss'],
})
export class GenerateEndOfMonthComponent extends BaseFormComponent implements OnInit {
    @ViewChild('endOfMonthSelectionComponent') EndOfMonthSelectionComponent: EndOfMonthSelectionComponent;
    formComponents: BaseFormComponent[] = [];
    subscriptions: Subscription[] = [];
    dataVersionId: number;
    snapShotSelectedDate: string;
    snapShotSelectedMonth: string;
    isPostingButtonEditable: boolean = false;
    accountingSetupModel: AccountingSetup;
    company: string;
    lastAccoutingDate: string;
    monthDifference: number;
    isPostingExist: boolean = true;
    createFormGroup: FormGroup;
    reportType: number;
    reportTypeDescription: string;
    isCompanyFrozen: boolean = false;
    constructor(protected formConfigurationProvider: FormConfigurationProviderService,
        private router: Router,
        protected formBuilder: FormBuilder,
        private route: ActivatedRoute,
        protected dialog: MatDialog,
        private preaccountingService: PreaccountingService,
        private companyManager: CompanyManagerService,
        private titleService: TitleService) {
        super(formConfigurationProvider);
    }

    ngOnInit() {
        this.company = this.route.snapshot.paramMap.get('company');
        this.titleService.setTitle(this.route.snapshot.data.title);
        this.subscriptions.push(this.preaccountingService.getAccountingSetupDetails()
            .subscribe((data) => {
                this.accountingSetupModel = data;
            }));
        this.createFormGroup = this.formBuilder.group({
            EndOfMonthSelectionComponent: this.EndOfMonthSelectionComponent.getFormGroup(),
        });

        this.formComponents.push(
            this.EndOfMonthSelectionComponent);
        this.isCompanyFrozen = this.companyManager.getCompany(this.company).isFrozen;
    }

    onDiscardButtonClicked() {
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
                this.createFormGroup.controls.EndOfMonthSelectionComponent.get('snapshotsCtrl').reset();
                this.createFormGroup.controls.EndOfMonthSelectionComponent.get('snapshotsCtrl').setValue(-1, 'Current Database');
            }
        });

    }

    onNextButtonClicked() {
        if (this.dataVersionId === 0) {
            this.isPostingButtonEditable = true;
            this.callSummaryRoute();
        } else {
            const momentLastMonthClosed: moment.Moment = moment(this.accountingSetupModel.lastMonthClosed);
            const momentSelectedDate: moment.Moment = moment(this.snapShotSelectedDate);
            this.monthDifference = momentSelectedDate.diff(momentLastMonthClosed, 'months');
            if (this.monthDifference <= 0) {
                this.isPostingButtonEditable = true;
                this.popupForAccounting();
            } else {
                this.isPostingButtonEditable = false;
                this.preaccountingService.
                    GetTADocmentDetails(this.dataVersionId, this.reportType).subscribe((message) => {
                        this.isPostingExist = message;
                        if (this.isPostingExist) {
                            this.popupForPosting();
                        } else {
                            this.callSummaryRoute();
                        }
                    });
            }
        }
    }

    onsnapshotTypeChange(model: any) {
        this.dataVersionId = model.dataVersionIdSelected;
    }
    onReportTypeSelected(model: any) {
        this.reportType = model.reportTypeSelected;
    }
    onReportTypeDescriptionSelected(model: any) {
        this.reportTypeDescription = model.reportTypeDescriptionSelected;
    }
    onsnapshotDate(model: any) {
        this.snapShotSelectedDate = model.snapshotSelectedDate;
    }

    onsnapshotMonth(model: string) {
        this.snapShotSelectedMonth = model;
    }
    popupForAccounting() {
        const confirmDiscardDialog = this.dialog.open(ConfirmationDialogComponent, {
            data: {
                text: 'This month is closed for accounting. No accounting transactions will be produced. Do you want to proceed?',
                okButton: 'CONFIRM',
                cancelButton: 'CANCEL',
            },
        });
        confirmDiscardDialog.afterClosed().subscribe((answer) => {
            if (answer) {
                this.callSummaryRoute();
            }
        });
    }

    popupForPosting() {
        const confirmDiscardDialog = this.dialog.open(ConfirmationDialogComponent, {
            data: {
                text: 'Posting for this month have already been created, do you want to proceed?',
                okButton: 'CONFIRM',
                cancelButton: 'CANCEL',
            },
        });
        confirmDiscardDialog.afterClosed().subscribe((answer) => {
            if (answer) {
                this.callSummaryRoute();
            }
        });
    }

    callSummaryRoute() {
        if (this.reportType !== ReportType.MTMOpenFx) {
            this.router.navigate(
                ['/' + this.companyManager.getCurrentCompanyId() + '/financial/cut-off/generate-end-of-month/summary'],
                {
                    queryParams: {
                        dataVersionId: this.dataVersionId,
                        reportTypeDescription: this.reportTypeDescription,
                        dataVersionDate: this.snapShotSelectedDate,
                        dataVersionMonth: this.snapShotSelectedMonth,
                        isPostingButtonEditable: this.isPostingButtonEditable,
                        reportType: this.reportType,

                    },
                    skipLocationChange: true,
                });
        } else {
            this.router.navigate(
                ['/' + this.companyManager.getCurrentCompanyId() + '/financial/cut-off/fx-deal-generate-end-of-month/summary'],
                {
                    queryParams: {
                        dataVersionId: this.dataVersionId,
                        reportTypeDescription: this.reportTypeDescription,
                        dataVersionDate: this.snapShotSelectedDate,
                        dataVersionMonth: this.snapShotSelectedMonth,
                        isPostingButtonEditable: this.isPostingButtonEditable,
                        reportType: this.reportType,
                    },
                    skipLocationChange: true,
                });
        }
    }

}
