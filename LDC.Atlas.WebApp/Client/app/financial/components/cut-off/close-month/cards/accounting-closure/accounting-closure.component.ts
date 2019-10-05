import { DatePipe } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { AuthorizationService } from '../../../../../../core/services/authorization.service';
import { CompanyManagerService } from '../../../../../../core/services/company-manager.service';
import { BaseFormComponent } from '../../../../../../shared/components/base-form-component/base-form-component.component';
import { AccountingSetup } from '../../../../../../shared/entities/accounting-setup.entity';
import { PermissionLevels } from '../../../../../../shared/enums/permission-level.enum';
import { UserCompanyPrivilegeDto } from '../../../../../../shared/services/authorization/dtos/user-company-privilege';
import { FormConfigurationProviderService } from '../../../../../../shared/services/form-configuration-provider.service';

@Component({
    providers: [DatePipe],
    selector: 'atlas-accounting-closure',
    templateUrl: './accounting-closure.component.html',
    styleUrls: ['./accounting-closure.component.scss'],
})
export class AccountingClosureComponent extends BaseFormComponent implements OnInit {

    @Output() readonly accountClosureUpdate = new EventEmitter<string[]>();
    accountingLastMonthClosed: Date;
    accountingClosablePeriod: Date;
    tempAccountingLastMonthClosed: Date;
    accountingSetupModel: AccountingSetup;
    isClosableMonthDisable: boolean = false;
    isLastMonthDisable = false;
    buttonEditable: boolean = false;
    openPeriodCounter: number = 0;
    company: string;
    PermissionLevels = PermissionLevels;
    constructor(protected formBuilder: FormBuilder,
        protected formConfigurationProvider: FormConfigurationProviderService,
        protected companyManager: CompanyManagerService,
        private datePipe: DatePipe,
        private route: ActivatedRoute,
        private authorizationService: AuthorizationService) {
        super(formConfigurationProvider);
    }
    editAccountingClosurePrivilege: UserCompanyPrivilegeDto = {
        profileId: null,
        privilegeName: 'CloseRevAcc',
        permission: PermissionLevels.Read,
        privilegeParentLevelOne: 'Financials',
        privilegeParentLevelTwo: 'CutOff',
    };
    ngOnInit() {
        this.company = this.route.snapshot.paramMap.get('company');
    }

    initForm(entity: any) {
        this.accountingSetupModel = entity as AccountingSetup;
        if (this.accountingSetupModel.lastMonthClosed != null) {
            this.accountingClosablePeriod = this.companyManager.getCurrentCompanyDate().toDate();
            this.accountingLastMonthClosed = moment(this.accountingSetupModel.lastMonthClosed).toDate();
            this.accountingClosablePeriod = moment(this.accountingLastMonthClosed).add(1, 'month').toDate();
            this.validateAccountingClosure();
        }
        this.openPeriodCounter = this.accountingSetupModel.openPeriodCounter;
        this.buttonEditable = this.checkIfUserHasRequiredPrivileges(this.editAccountingClosurePrivilege);
    }
    checkIfUserHasRequiredPrivileges(userCompanyPrivilege: UserCompanyPrivilegeDto) {
        if (this.authorizationService.isUserAllowedForCompany(this.company)) {
            const userPermissionLevel = this.authorizationService.getPermissionLevel(
                this.company,
                userCompanyPrivilege.privilegeName,
                userCompanyPrivilege.privilegeParentLevelOne,
                userCompanyPrivilege.privilegeParentLevelTwo);
            if (userPermissionLevel <= userCompanyPrivilege.permission) {
                return true;
            }
        }
        return false;
    }
    validateAccountingClosure() {
        if ((moment(this.accountingClosablePeriod).month() ===
            this.companyManager.getCurrentCompanyDate().month()) &&
            (moment(this.accountingClosablePeriod).year() ===
                this.companyManager.getCurrentCompanyDate().year())) {
            this.isClosableMonthDisable = true;
        }
        const reopenMonthAttempts = this.accountingSetupModel.numberOfOpenPeriod - this.accountingSetupModel.openPeriodCounter;
        if (reopenMonthAttempts === 1) {
            this.isLastMonthDisable = true;
        }
    }
    populateEntity(entity: any) {
        const accountingSetup = entity as AccountingSetup;
        accountingSetup.lastMonthClosed = this.tempAccountingLastMonthClosed ?
            this.tempAccountingLastMonthClosed : this.accountingLastMonthClosed;
        accountingSetup.openPeriodCounter = this.openPeriodCounter;
        return accountingSetup;
    }
    onUpdateAccountingSetup(isLastMonthClosed: boolean) {
        const accountingSetUpValidations: string[] = [];
        this.tempAccountingLastMonthClosed = this.companyManager.getCurrentCompanyDate().toDate();
        this.tempAccountingLastMonthClosed = (isLastMonthClosed ?
            moment(this.accountingLastMonthClosed).add(-1, 'month')
            : moment(this.accountingLastMonthClosed).add(1, 'month')).toDate();
        const warningMessage = isLastMonthClosed ? 'Do you want to reverse the closure of' + ' ' +
            this.datePipe.transform(this.accountingLastMonthClosed, 'MMM y') + ' ' + 'for accounting?' :
            'Do you want to close' + ' ' +
            this.datePipe.transform(this.accountingClosablePeriod, 'MMM y') + ' ' + 'for accounting?';
        const titleDialog = isLastMonthClosed ? 'Accounting Reverse' : 'Accounting Closure';
        accountingSetUpValidations.push(titleDialog);
        accountingSetUpValidations.push(warningMessage);
        accountingSetUpValidations.push(isLastMonthClosed ? 'accountingLastMonth' : 'accountingClosable');
        this.accountClosureUpdate.emit(accountingSetUpValidations);
        this.openPeriodCounter = isLastMonthClosed ? this.openPeriodCounter + 1 : 0;
    }
}
