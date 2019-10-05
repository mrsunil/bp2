import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { AuthorizationService } from '../../../../../../core/services/authorization.service';
import { AccountingSetup } from '../../../../../../shared/entities/accounting-setup.entity';
import { AtlasFormControl } from '../../../../../../shared/entities/atlas-form-control';
import { PermissionLevels } from '../../../../../../shared/enums/permission-level.enum';
import { UserCompanyPrivilegeDto } from '../../../../../../shared/services/authorization/dtos/user-company-privilege';
import { ConfirmationDialogComponent } from '../../../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { MonthOptions } from '../../../../../../shared/entities/month-options.entity';
import * as moment from 'moment';
@Component({
    providers: [DatePipe],
    selector: 'atlas-close-month-edit-dialog',
    templateUrl: './close-month-edit-dialog.component.html',
    styleUrls: ['./close-month-edit-dialog.component.scss'],
})
export class CloseMonthEditDialogComponent implements OnInit {
    numberOfOpenPeriodsCtrl = new AtlasFormControl('numberOfOpenPeriods');
    youngestMonthCtrl = new AtlasFormControl('youngestMonth');
    numberOfOpenFinancialYearsCtrl = new AtlasFormControl('numberOfOpenFinancialYears');
    lastMonthFinancialYearCtrl = new AtlasFormControl('lastMonthFinancialYear');
    lastFinancialYearClosedCtrl = new AtlasFormControl('lastFinancialYearClosed');
    closeMonthDialogEdit: boolean = false;
    company: string;
    PermissionLevels = PermissionLevels;
    closeMonthDialogData: {
        model: AccountingSetup;
        company: string;
    };
    numberOfOpenPeriods: number[] = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
    numberOfOpenFinancialYears: number[] = [2, 3];
    lastMonthFinancialYears: MonthOptions[] = [
        { monthId: 1, description: 'Jan' },
        { monthId: 2, description: 'Feb' },
        { monthId: 3, description: 'Mar' },
        { monthId: 4, description: 'Apr' },
        { monthId: 5, description: 'May' },
        { monthId: 6, description: 'Jun' },
        { monthId: 7, description: 'Jul' },
        { monthId: 8, description: 'Aug' },
        { monthId: 9, description: 'Sep' },
        { monthId: 10, description: 'Oct' },
        { monthId: 11, description: 'Nov' },
        { monthId: 12, description: 'Dec' },
    ];
    accountingPeriods: Date[] = [];
    constructor(
        public closeMonthDialogRef: MatDialogRef<CloseMonthEditDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { model: AccountingSetup, company: string },
        private datePipe: DatePipe,
        protected dialog: MatDialog,
        private route: ActivatedRoute,
        private authorizationService: AuthorizationService,
    ) {
        this.closeMonthDialogData = data;
    }
    editClosureSettingsDialogPrivilege: UserCompanyPrivilegeDto = {
        profileId: null,
        privilegeName: 'EditClosureSettingsDialog',
        permission: PermissionLevels.Read,
        privilegeParentLevelOne: 'Financials',
        privilegeParentLevelTwo: 'CutOff',
    };

    ngOnInit() {

        if (this.closeMonthDialogData.model) {
            this.numberOfOpenPeriodsCtrl.patchValue(this.closeMonthDialogData.model.numberOfOpenPeriod);
            this.numberOfOpenFinancialYearsCtrl.patchValue(this.closeMonthDialogData.model.maximumNumberofOpenFinancialYears);
            this.lastMonthFinancialYearCtrl.patchValue(this.closeMonthDialogData.model.lastMonthofFinancialYear);

            if (this.closeMonthDialogData.model.lastFinancialYearClosed &&
                this.closeMonthDialogData.model.lastFinancialYearClosed !== 0
            ) {
                this.lastFinancialYearClosedCtrl.patchValue(this.closeMonthDialogData.model.lastFinancialYearClosed);
            }
            else {
                this.lastFinancialYearClosedCtrl.patchValue(moment(new Date()).year());
            }
            this.updateAccountingPeriods(this.closeMonthDialogData.model.numberOfOpenPeriod);
        }
        this.numberOfOpenPeriodsCtrl.valueChanges.subscribe((value: number) => {
            this.updateAccountingPeriods(value);
        });
        this.closeMonthDialogEdit = this.checkIfUserHasRequiredPrivileges(this.editClosureSettingsDialogPrivilege);
    }
    checkIfUserHasRequiredPrivileges(userCompanyPrivilege: UserCompanyPrivilegeDto) {
        if (this.authorizationService.isUserAllowedForCompany(this.closeMonthDialogData.company)) {
            const userPermissionLevel = this.authorizationService.getPermissionLevel(
                this.closeMonthDialogData.company,
                userCompanyPrivilege.privilegeName,
                userCompanyPrivilege.privilegeParentLevelOne,
                userCompanyPrivilege.privilegeParentLevelTwo);
            if (userPermissionLevel <= userCompanyPrivilege.permission) {
                return true;
            }
        }
        return false;
    }

    updateAccountingPeriods(numberOfMonths: number) {
        this.accountingPeriods = [];
        while (numberOfMonths !== 0) {
            this.accountingPeriods.push(new Date(new Date(this.closeMonthDialogData.model.lastMonthClosed).
                setMonth(new Date(this.closeMonthDialogData.model.lastMonthClosed).getMonth() + numberOfMonths)));
            numberOfMonths = numberOfMonths - 1;
        }
        this.youngestMonthCtrl.patchValue(this.datePipe.transform(this.accountingPeriods[0], 'MMM y'));
        this.accountingPeriods.reverse();
    }

    onDiscardButtonClick() {
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
                this.closeMonthDialogRef.close(false);
            }
        });

    }

    onSaveButtonClicked() {
        this.getClosureSettings();
        this.closeMonthDialogRef.close(this.closeMonthDialogData.model);
    }

    getClosureSettings() {
        this.closeMonthDialogData.model.numberOfOpenPeriod = this.numberOfOpenPeriodsCtrl.value ? this.numberOfOpenPeriodsCtrl.value : null;
        if (this.closeMonthDialogData.model !== this.numberOfOpenPeriodsCtrl.value) {
            this.closeMonthDialogData.model.openPeriodCounter = 0;
        }
        this.closeMonthDialogData.model.maximumNumberofOpenFinancialYears = this.numberOfOpenFinancialYearsCtrl.value ? this.numberOfOpenFinancialYearsCtrl.value : null;
        this.closeMonthDialogData.model.lastMonthofFinancialYear = this.lastMonthFinancialYearCtrl.value ? this.lastMonthFinancialYearCtrl.value : null;
        this.closeMonthDialogData.model.lastFinancialYearClosed = this.lastFinancialYearClosedCtrl.value ? this.lastFinancialYearClosedCtrl.value : null;
    }

}
