import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthorizationService } from '../../../core/services/authorization.service';
import { CompanyManagerService } from '../../../core/services/company-manager.service';
import { FABType } from '../../../shared/components/floating-action-button/floating-action-button-type.enum';
import { FloatingActionButtonActions } from '../../../shared/entities/floating-action-buttons-actions.entity';
import { PermissionLevels } from '../../../shared/enums/permission-level.enum';
import { UserCompanyPrivilegeDto } from '../../../shared/services/authorization/dtos/user-company-privilege';
import { TitleService } from '../../../shared/services/title.service';

@Component({
    selector: 'atlas-financial-tab-group',
    templateUrl: './financial-tab-group.component.html',
    styleUrls: ['./financial-tab-group.component.scss'],
})
export class FinancialTabGroupComponent implements OnInit {

    routeLinks = [

        {
            label: 'ACCOUNTING ENTRIES',
            link: '/' + this.companyManager.getCurrentCompanyId() + '/financial/accounting/entries',
            index: 0,
            privilege: 'Financials',
            title: 'Financials - Accounting Entries',
        },
        {
            label: 'CUT-OFF',
            link: '/' + this.companyManager.getCurrentCompanyId() + '/financial/cut-off/freeze/new',
            index: 1,
            privilege: 'Financials.CutOff',
            title: 'Financials - Cut-Off',
        },
        {
            label: 'Market Data',
            link: '/' + this.companyManager.getCurrentCompanyId() + '/financial/fx/rates',
            index: 2,
            privilege: 'Financials.MarketData',
            title: 'Financials - Market Data',
        },

    ];
    activeLinkIndex = -1;
    company: string;
    PermissionLevels = PermissionLevels;
    buttonEditable: boolean = false;
    fabMenuActions: FloatingActionButtonActions[] = [];
    fabTitle: string;
    fabType: FABType;
    isLoaded: boolean = false;

    hasCreateFreezePrivilege: boolean = false;
    hasViewFrozenDBPrivilege: boolean = false;
    hasRecalculatePrivilege: boolean = false;
    hasGenEOfYPrivilege: boolean = false;

    @Input() hasAddButton: boolean = false;
    @Input() buttonText: string = '';
    @Output() readonly buttonClicked = new EventEmitter<void>();

    constructor(private router: Router,
        private companyManager: CompanyManagerService,
        private authorizationService: AuthorizationService,
        private route: ActivatedRoute,
        private titleService: TitleService) {
        this.activeLinkIndex = this.routeLinks.indexOf(this.routeLinks.find((tab) => this.router.url.includes(tab.link)));
    }
    editGenerateEndOfMonthPrivilege: UserCompanyPrivilegeDto = {
        profileId: null,
        privilegeName: 'GenerateEndOfMonth',
        permission: PermissionLevels.Read,
        privilegeParentLevelOne: 'Financials',
        privilegeParentLevelTwo: 'CutOff',
    };

    ngOnInit() {
        this.titleService.setTitle('Financials');
        this.company = this.route.snapshot.paramMap.get('company');
        this.buttonEditable = this.checkIfUserHasRequiredPrivileges(this.editGenerateEndOfMonthPrivilege);
        this.initFABActions();
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
    isActive(routeLink: any) {
        if (this.activeLinkIndex === routeLink.index) {
            this.titleService.setTitle(this.routeLinks[this.activeLinkIndex].title);
        }
        return this.activeLinkIndex === routeLink.index;
    }

    onAddButtonClicked(): void {
        this.buttonClicked.emit();
    }

    onFreezeButtonClicked() {
        this.router.navigate(['/' + this.companyManager.getCurrentCompanyId() + '/financial/cut-off/freeze/new']);
    }

    onFreezeViewButtonClicked() {
        this.router.navigate(['/' + this.companyManager.getCurrentCompanyId() + '/financial/cut-off/freeze']);
    }

    onFreezeRecalculateButtonClicked() {
        this.router.navigate(['/' + this.companyManager.getCurrentCompanyId() + '/financial/cut-off/freeze/recalculate']);
    }

    onCloseMonthButtonClicked() {
        this.router.navigate(['/' + this.companyManager.getCurrentCompanyId() + '/financial/cut-off/close-month']);
    }

    onGenerateEndOfMonthButtonClicked() {
        this.router.navigate(['/' + this.companyManager.getCurrentCompanyId() + '/financial/cut-off/generate-end-of-month']);
    }

    onGenerateEndOfYearButtonClicked() {
        this.router.navigate(['/' + this.companyManager.getCurrentCompanyId() + '/financial/cut-off/generate-end-of-year']);
    }

    initFABActions() {
        this.fabTitle = 'Cut-Off Actions';
        this.fabType = FABType.ExtendedMenu;

        const actionCreateFreeze: FloatingActionButtonActions = {
            icon: 'ac_unit',
            text: 'Create a freeze',
            action: 'createFreeze',
            disabled: false,
            index: 0,
        };

        const actionViewFrozenDB: FloatingActionButtonActions = {
            icon: 'ac_unit',
            text: 'View Frozen Database',
            action: 'viewFrozenDb',
            disabled: false,
            index: 1,
        };

        const actionRecalc: FloatingActionButtonActions = {
            icon: 'settings_backup_restore',
            text: 'Recalculate Frozen Database',
            action: 'recalculate',
            disabled: false,
            index: 2,
        };

        const actionClose: FloatingActionButtonActions = {
            icon: 'calendar_today',
            text: 'Close Month',
            action: 'closeMonth',
            disabled: false,
            index: 3,
        };

        const actionGenerateMonth: FloatingActionButtonActions = {
            icon: 'calendar_today',
            text: 'Generate End of Month',
            action: 'generateEOM',
            disabled: false,
            index: 4,
        };

        const actionGenerateYear: FloatingActionButtonActions = {
            icon: 'calendar_today',
            text: 'Generate End of Year',
            action: 'generateEOY',
            disabled: false,
            index: 5,
        };

        this.checkPrivileges();

        if (this.hasCreateFreezePrivilege) {
            this.fabMenuActions.push(actionCreateFreeze);
        }

        if (this.hasViewFrozenDBPrivilege) {
            this.fabMenuActions.push(actionViewFrozenDB);
        }

        if (this.hasRecalculatePrivilege) {
            this.fabMenuActions.push(actionRecalc);
        }

        this.fabMenuActions.push(actionClose);

        if (this.buttonEditable) {
            actionGenerateMonth.disabled = true;
        }
        this.fabMenuActions.push(actionGenerateMonth);

        if (this.hasGenEOfYPrivilege) {
            this.fabMenuActions.push(actionGenerateYear);
        }

        this.isLoaded = true;
    }

    checkPrivileges() {
        if (this.authorizationService.isPrivilegeAllowed(this.company, 'Financials')) {
            if (this.authorizationService.isPrivilegeAllowed(this.company, 'CreateFreeze', PermissionLevels.ReadWrite)) {
                this.hasCreateFreezePrivilege = true;
            }

            if (this.authorizationService.isPrivilegeAllowed(this.company, 'FrozenDatabase', PermissionLevels.ReadWrite)) {
                this.hasViewFrozenDBPrivilege = true;
            }

            if (this.authorizationService.isPrivilegeAllowed(this.company, 'RecalculateFrozenDatabase', PermissionLevels.ReadWrite)) {
                this.hasRecalculatePrivilege = true;
            }
            if (this.authorizationService.isPrivilegeAllowed(this.company, 'GenerateEndOfYear', PermissionLevels.ReadWrite)) {
                this.hasGenEOfYPrivilege = true;
            }
        }
    }

    onFabActionClicked(action: string) {
        switch (action) {
            case 'createFreeze': {
                this.onFreezeButtonClicked();
                break;
            }
            case 'viewFrozenDb': {
                this.onFreezeViewButtonClicked();
                break;
            }
            case 'recalculate': {
                this.onFreezeRecalculateButtonClicked();
                break;
            }
            case 'closeMonth': {
                this.onCloseMonthButtonClicked();
                break;
            }
            case 'generateEOM': {
                this.onGenerateEndOfMonthButtonClicked();
                break;
            }
            case 'generateEOY': {
                this.onGenerateEndOfYearButtonClicked();
                break;
            }
        }
    }
}
