import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CompanyManagerService } from '../../../../core/services/company-manager.service';
import { BaseFormComponent } from '../../../../shared/components/base-form-component/base-form-component.component';
import { AccountingSetup } from '../../../../shared/entities/accounting-setup.entity';
import { PreaccountingService } from '../../../../shared/services/http-services/preaccounting.service';
import { TitleService } from '../../../../shared/services/title.service';
import { UrlManagementService } from '../../../../shared/services/url-management.service';
import { AccountingClosureComponent } from './cards/accounting-closure/accounting-closure.component';
import { OperationsClosureComponent } from './cards/operations-closure/operations-closure.component';
import { CloseMonthEditDialogComponent } from './dialog-boxes/close-month-edit-dialog/close-month-edit-dialog.component';
import { CloseMonthWarningDialogComponent } from './dialog-boxes/close-month-warning-dialog/close-month-warning-dialog.component';

@Component({
    selector: 'atlas-close-month',
    templateUrl: './close-month.component.html',
    styleUrls: ['./close-month.component.scss'],
})
export class CloseMonthComponent implements OnInit, OnDestroy {
    @ViewChild('accountingClosureComponent') accountingClosureComponent: AccountingClosureComponent;
    @ViewChild('operationsClosureComponent') operationsClosureComponent: OperationsClosureComponent;

    subscriptions: Subscription[] = [];
    private formComponents: BaseFormComponent[] = [];
    closeMonthsFormGroup: FormGroup;
    accountingSetupModel: AccountingSetup;
    private model: AccountingSetup;
    company: string;
    isCompanyFrozen: boolean;
    constructor(protected formBuilder: FormBuilder,
        protected router: Router,
        private route: ActivatedRoute,
        private preaccountingService: PreaccountingService,
        protected urlManagementService: UrlManagementService,
        private cdr: ChangeDetectorRef, public dialog: MatDialog,
        private titleService: TitleService, private companyManager: CompanyManagerService) { }

    ngOnInit() {
        this.company = this.route.snapshot.paramMap.get('company');
        this.titleService.setTitle(this.route.snapshot.data.title);
        this.closeMonthsFormGroup = this.formBuilder.group({
            accountingClosureComponent: this.accountingClosureComponent.getFormGroup(),
            operationsClosureComponent: this.operationsClosureComponent.getFormGroup(),
        });
        this.formComponents.push(
            this.accountingClosureComponent,
            this.operationsClosureComponent,
        );
        this.cdr.detectChanges();
        this.subscriptions.push(this.preaccountingService.getAccountingSetupDetails()
            .subscribe((data) => {
                this.accountingSetupModel = data;
                this.formComponents.forEach((comp) => {
                    comp.initForm(data);
                });
            }));
        this.isCompanyFrozen = this.companyManager.getCompany(this.company).isFrozen;
    }
    ngOnDestroy(): void {
        this.subscriptions.forEach((subscription: Subscription) => {
            subscription.unsubscribe();
        });
    }
    onUpdateAccountingSetup(validations: string[]) {
        if (validations.length > 1) {
            const openDialog = this.dialog.open(CloseMonthWarningDialogComponent, {
                data: {
                    title: validations[0],
                    text: validations[1],
                    okButton: 'Yes',
                    noButton: 'No',
                },
            });
            openDialog.afterClosed().subscribe((answer) => {
                if (answer) {
                    this.validateSetUpDetails(validations[2]);
                }
            });
        }
    }
    validateSetUpDetails(validation: string) {
        switch (validation) {
            case 'accountingClosable':
                if ((new Date(this.accountingSetupModel.lastMonthClosed).getMonth() ===
                    new Date(this.accountingSetupModel.lastMonthClosedForOperation).getMonth()) &&
                    (new Date(this.accountingSetupModel.lastMonthClosed).getFullYear() ===
                        new Date(this.accountingSetupModel.lastMonthClosedForOperation).getFullYear())) {
                    return this.showWarningMessage('Both accounting and operations period will be closed on this action.' +
                        'Do you want to proceed?');
                }
            default:
                this.saveAccountingSetUpDetails();
                break;
        }
    }
    showWarningMessage(message: string) {
        const warningDialog = this.dialog.open(CloseMonthWarningDialogComponent, {
            data: {
                text: message,
                okButton: 'Yes',
                noButton: 'No',
            },
        });
        warningDialog.afterClosed().subscribe((answer) => {
            if (answer) {
                this.saveAccountingSetUpDetails(null, true);
            }
        });
    }
    saveAccountingSetUpDetails(accountingSetup?: AccountingSetup, isClosableSame?: boolean) {
        this.getCloseMonthInfo();
        if (accountingSetup) {
            this.model.numberOfOpenPeriod = accountingSetup.numberOfOpenPeriod;
            this.model.openPeriodCounter = accountingSetup.openPeriodCounter;
            this.model.maximumNumberofOpenFinancialYears = accountingSetup.maximumNumberofOpenFinancialYears;
            this.model.lastMonthofFinancialYear = accountingSetup.lastMonthofFinancialYear;
            this.model.lastFinancialYearClosed = accountingSetup.lastFinancialYearClosed;
        }
        if (isClosableSame) {
            this.model.lastMonthClosedForOperation = this.model.lastMonthClosed;
        }
        this.model.lastMonthClosed = new Date(new Date(this.model.lastMonthClosed).
            setHours(this.model.lastMonthClosed.getHours() + 5, 30));
        this.model.lastMonthClosedForOperation = new Date(new Date(this.model.lastMonthClosedForOperation).
            setHours(this.model.lastMonthClosedForOperation.getHours() + 5, 30));
        this.subscriptions.push(this.preaccountingService.updateAccountingSetupDetails(this.model)
            .subscribe(
                () => {
                    this.router.navigate(['/' + this.urlManagementService.getCurrentCompanyId() + '/financial/cut-off/close-month']);
                },
                (err) => {
                    throw err;
                }));
    }
    getCloseMonthInfo() {
        this.model = new AccountingSetup();
        this.formComponents.forEach((comp) => {
            this.model = comp.populateEntity(this.model);
        });
        this.model.numberOfOpenPeriod = this.accountingSetupModel.numberOfOpenPeriod;
        this.model.maximumNumberofOpenFinancialYears = this.accountingSetupModel.maximumNumberofOpenFinancialYears;
        this.model.lastMonthofFinancialYear = this.accountingSetupModel.lastMonthofFinancialYear;
        this.model.lastFinancialYearClosed = this.accountingSetupModel.lastFinancialYearClosed;

    }

    onOpenClosureSettingsDialog() {
        const openDialog = this.dialog.open(CloseMonthEditDialogComponent, {
            data: {
                model: this.accountingSetupModel,
                company: this.company,
            },
        });
        openDialog.afterClosed().subscribe((answer) => {
            if (answer) {
                this.saveAccountingSetUpDetails(answer);
            }
        });
    }

}
