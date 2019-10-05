import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthorizationService } from '../../core/services/authorization.service';
import { CompanyManagerService } from '../../core/services/company-manager.service';
import { BaseFormComponent } from '../../shared/components/base-form-component/base-form-component.component';
import { FABType } from '../../shared/components/floating-action-button/floating-action-button-type.enum';
import { FloatingActionButtonActions } from '../../shared/entities/floating-action-buttons-actions.entity';
import { CashType } from '../../shared/enums/cash-type.enum';
import { FormConfigurationProviderService } from '../../shared/services/form-configuration-provider.service';
import { SecurityService } from '../../shared/services/security.service';
import { SnackbarService } from '../../shared/services/snackbar.service';
import { TitleService } from '../../shared/services/title.service';
import { UtilService } from '../../shared/services/util.service';
import { ExecutionCashPaymentListPageComponent } from './execution-cash-payment-list-page/execution-cash-payment-list-page.component';
import { ExecutionCashReceiptListPageComponent } from './execution-cash-receipt-list-page/execution-cash-receipt-list-page.component';

@Component({
    selector: 'atlas-execution-cash',
    templateUrl: './execution-cash.component.html',
    styleUrls: ['./execution-cash.component.scss'],
})

export class ExecutionCashComponent extends BaseFormComponent implements OnInit, OnDestroy {
    @ViewChild('cashPaymentListComponent') cashPaymentListComponent: ExecutionCashPaymentListPageComponent;
    @ViewChild('cashReceiptListComponent') cashReceiptListComponent: ExecutionCashReceiptListPageComponent;

    cashOption: number;
    tabIndex: number;
    company: string;
    cpSimplePrivilege = false;
    cpPickTranPrivilege = false;
    cpDiffClientPrivilege = false;
    cpDiffCurrencyPrivilege = false;
    crSimplePrivilege = false;
    crPickTranPrivilege = false;
    crDiffCurrencyPrivilege = false;
    isCashPaymentMode = true;

    fabMenuActions: FloatingActionButtonActions[] = [];
    fabTitle: string;
    fabType: FABType;
    isLoaded: boolean = false;
    actionCreateCash: FloatingActionButtonActions = {
        icon: 'add',
        text: 'Create Cash',
        action: 'createCash',
        disabled: false,
        index: 0,
    };

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        protected formConfigurationProvider: FormConfigurationProviderService,
        public utilService: UtilService,
        protected snackbarService: SnackbarService,
        protected companyManager: CompanyManagerService,
        protected authorizationService: AuthorizationService,
        protected securityService: SecurityService,
        private titleService: TitleService,
    ) {
        super(formConfigurationProvider);
    }

    onCreateCashButtonClicked(cashOption) {
        this.router.navigate(['/' + this.companyManager.getCurrentCompanyId() +
            '/execution/cash/new/' + encodeURIComponent(cashOption)]);
    }

    onSelectedIndexChanged = (tabChangeEvent: number): void => {
        this.setCashType(tabChangeEvent);
    }

    ngOnInit() {
        this.company = this.route.snapshot.paramMap.get('company');
        this.tabIndex = 0;
        this.setCashType(this.tabIndex);

        this.securityService.isSecurityReady().subscribe(() => {
            if ((this.authorizationService.isPrivilegeAllowed(this.company, 'Cash') && this.authorizationService.isPrivilegeAllowed(this.company, 'CashPayment'))) {
                this.cpSimplePrivilege = this.authorizationService.isPrivilegeAllowed(this.company, 'CPSIMPLE');
                this.cpPickTranPrivilege = this.authorizationService.isPrivilegeAllowed(this.company, 'CPPICKTX');
                this.cpDiffClientPrivilege = this.authorizationService.isPrivilegeAllowed(this.company, 'CPDIFFCLI');
                this.cpDiffCurrencyPrivilege = this.authorizationService.isPrivilegeAllowed(this.company, 'CPDIFFCCY');
            }
            if ((this.authorizationService.isPrivilegeAllowed(this.company, 'Cash') && this.authorizationService.isPrivilegeAllowed(this.company, 'CashReceipt'))) {
                this.crSimplePrivilege = this.authorizationService.isPrivilegeAllowed(this.company, 'CRSIMPLE');
                this.crPickTranPrivilege = this.authorizationService.isPrivilegeAllowed(this.company, 'CRPICKTX');
                this.crDiffCurrencyPrivilege = this.authorizationService.isPrivilegeAllowed(this.company, 'CRDIFFCCY');
            }
        });
        this.updateFAB();

    }

    updateFAB() {
        this.initFABActions();
        this.isLoaded = true;
    }

    setCashType(tabIndex: number) {
        if (tabIndex === 0) {
            this.isCashPaymentMode = true;
            this.cashOption = CashType.CashPayment;
            this.cashPaymentListComponent.cashTypeId = this.cashOption;
            this.cashPaymentListComponent.getCashList();
            this.setTitle();
        } else if (tabIndex === 1) {
            this.isCashPaymentMode = false;
            this.cashOption = CashType.CashReceipt;
            this.cashReceiptListComponent.cashTypeId = this.cashOption;
            this.cashReceiptListComponent.getCashList();
            this.setTitle();
        }
        this.updateFAB();
    }

    setTitle() {
        if (this.cashOption === CashType.CashPayment) {
            this.titleService.setTitle('Cash Payments');
        } else if (this.cashOption === CashType.CashReceipt) {
            this.titleService.setTitle('Cash Receipts');
        }
    }

    initFABActions() {
        this.fabTitle = 'Create Cash Single Extended FAB';
        this.fabType = FABType.ExtendedSingleButton;

        this.fabMenuActions = [];

        if (this.cashOption === CashType.CashPayment) {
            if (this.cpSimplePrivilege || this.cpPickTranPrivilege || this.cpDiffClientPrivilege || this.cpDiffCurrencyPrivilege) {
                this.fabMenuActions.push(this.actionCreateCash);
            }
        }
        if (this.cashOption === CashType.CashReceipt) {
            if (this.crSimplePrivilege || this.crPickTranPrivilege || this.crDiffCurrencyPrivilege) {
                this.fabMenuActions.push(this.actionCreateCash);
            }
        }
    }

    onFabActionClicked(action: string) {
        this.onCreateCashButtonClicked(this.cashOption);
    }

}
