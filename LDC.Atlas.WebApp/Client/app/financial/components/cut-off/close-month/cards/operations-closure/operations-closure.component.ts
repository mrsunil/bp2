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
    selector: 'atlas-operations-closure',
    templateUrl: './operations-closure.component.html',
    styleUrls: ['./operations-closure.component.scss'],
})
export class OperationsClosureComponent extends BaseFormComponent implements OnInit {
    @Output() readonly operationClosureUpdate = new EventEmitter<string[]>();
    operationsLastMonthClosed: Date;
    operationsClosablePeriod: Date;
    tempOperationsLastMonthClosed: Date;
    accountingSetupModel: AccountingSetup;
    isLastMonthDisable: boolean = false;
    isClosableMonthDisable: boolean = false;
    buttonReverseEditable: boolean = false;
    buttonCloseEditable: boolean = false;
    company: string;
    PermissionLevels = PermissionLevels;
    constructor(protected formBuilder: FormBuilder,
        private datePipe: DatePipe,
        protected formConfigurationProvider: FormConfigurationProviderService,
        protected companyManager: CompanyManagerService,
        private route: ActivatedRoute,
        private authorizationService: AuthorizationService) {
        super(formConfigurationProvider);
    }
    editOperationsReversePrivilege: UserCompanyPrivilegeDto = {
        profileId: null,
        privilegeName: 'ReverseOp',
        permission: PermissionLevels.Read,
        privilegeParentLevelOne: 'Financials',
        privilegeParentLevelTwo: 'CutOff',
    };
    editOperationsClosurePrivilege: UserCompanyPrivilegeDto = {
        profileId: null,
        privilegeName: 'CloseOp',
        permission: PermissionLevels.Read,
        privilegeParentLevelOne: 'Financials',
        privilegeParentLevelTwo: 'CutOff',
    };

    ngOnInit() {
        this.company = this.route.snapshot.paramMap.get('company');
    }

    initForm(entity: any) {
        this.accountingSetupModel = entity as AccountingSetup;
        if (this.accountingSetupModel.lastMonthClosedForOperation) {
            this.operationsClosablePeriod = this.companyManager.getCurrentCompanyDate().toDate();
            this.operationsLastMonthClosed = moment(this.accountingSetupModel.lastMonthClosedForOperation).toDate();
            this.operationsClosablePeriod = moment(this.operationsLastMonthClosed).
                add(1, 'month').toDate();
            this.validateOperationClosure();
        }
        this.buttonReverseEditable = this.checkIfUserHasRequiredPrivileges(this.editOperationsReversePrivilege);
        this.buttonCloseEditable = this.checkIfUserHasRequiredPrivileges(this.editOperationsClosurePrivilege);
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
    validateOperationClosure() {
        const lastMonthClosed = new Date(this.accountingSetupModel.lastMonthClosed);
        const lastMonthClosedForOperation = new Date(this.accountingSetupModel.lastMonthClosedForOperation);
        if ((lastMonthClosedForOperation.getMonth() === lastMonthClosed.getMonth()) &&
            (lastMonthClosedForOperation.getFullYear() === lastMonthClosed.getFullYear())) {
            this.isLastMonthDisable = true;
        }
        if ((moment(this.operationsClosablePeriod).month() ===
            this.companyManager.getCurrentCompanyDate().month()) &&
            (moment(this.operationsClosablePeriod).year() ===
                this.companyManager.getCurrentCompanyDate().year())) {
            this.isClosableMonthDisable = true;
        }
    }
    populateEntity(entity: any) {
        const accountingSetup = entity as AccountingSetup;
        accountingSetup.lastMonthClosedForOperation = this.tempOperationsLastMonthClosed ?
            this.tempOperationsLastMonthClosed : this.operationsLastMonthClosed;
        return accountingSetup;
    }
    onUpdateAccountingSetup(isLastMonthClosed: boolean) {
        const accountingSetUpValidations: string[] = [];
        this.tempOperationsLastMonthClosed = this.companyManager.getCurrentCompanyDate().toDate();
        this.tempOperationsLastMonthClosed = (isLastMonthClosed ?
            moment(this.operationsLastMonthClosed).add(-1, 'month')
            : moment(this.operationsLastMonthClosed).add(1, 'month')).toDate();
        const warningMessage = isLastMonthClosed ? 'Do you want to reverse the closure of' + ' ' +
            this.datePipe.transform(this.operationsLastMonthClosed, 'MMM y') + ' ' + 'for operations?' :
            'Do you want to close' + ' ' +
            this.datePipe.transform(this.operationsClosablePeriod, 'MMM y') + ' ' + 'for operations?';
        const titleDialog = isLastMonthClosed ? 'Operations reverse' : 'Operations Closure';
        accountingSetUpValidations.push(titleDialog);
        accountingSetUpValidations.push(warningMessage);
        accountingSetUpValidations.push(isLastMonthClosed ? 'oprtationLastMonth' : 'operationsClosable');
        this.operationClosureUpdate.emit(accountingSetUpValidations);
    }
}
