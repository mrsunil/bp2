import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthorizationService } from '../../../../../core/services/authorization.service';
import { CompanyManagerService } from '../../../../../core/services/company-manager.service';
import { BaseFormComponent } from '../../../../../shared/components/base-form-component/base-form-component.component';
import { ConfirmationDialogComponent } from '../../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { FreezeCompany } from '../../../../../shared/entities/freeze-company.entity';
import { Freeze } from '../../../../../shared/enums/freeze.enum';
import { PermissionLevels } from '../../../../../shared/enums/permission-level.enum';
import { FormConfigurationProviderService } from '../../../../../shared/services/form-configuration-provider.service';
import { ConfigurationService } from '../../../../../shared/services/http-services/configuration.service';
import { SecurityService } from '../../../../../shared/services/security.service';
import { SnackbarService } from '../../../../../shared/services/snackbar.service';

@Component({
    selector: 'atlas-company-menu-bar',
    templateUrl: './company-menu-bar.component.html',
    styleUrls: ['./company-menu-bar.component.scss'],
})
export class CompanyMenuBarComponent extends BaseFormComponent implements OnInit {
    currentCompany: string;
    company: string;
    companyId: string;
    public selectedTab: number = 0;
    tabValue: string;
    offsetLeft: number;
    PermissionLevels = PermissionLevels;
    isDeleteButtonDisabled: boolean = true;
    createCompany: boolean = false;
    copyCompany: boolean = false;
    isEdit: boolean = false;
    isCopyCompany: boolean;
    freezeValue: string = '';
    freezeCompany = new FreezeCompany();

    constructor(protected formConfigurationProvider: FormConfigurationProviderService,
        private authorizationService: AuthorizationService,
        private securityService: SecurityService,
        protected snackbarService: SnackbarService,
        public dialog: MatDialog,
        private router: Router,
        protected configurationService: ConfigurationService,
        private companyManager: CompanyManagerService,
        private route: ActivatedRoute) {
        super(formConfigurationProvider);
    }

    ngOnInit() {
        this.currentCompany = decodeURIComponent(this.route.snapshot.paramMap.get('company'));
        this.companyId = this.route.snapshot.paramMap.get('companyId');
        this.isCopyCompany = (this.route.snapshot.data.isCopy) ? true : false;
        this.tabValue = this.route.snapshot.paramMap.get('tabIndex');
        if (!this.isCopyCompany) {
            if (this.companyId) {
                this.checkTransactionDataExistsForCompany(this.companyId);
            }
        }
        if (this.tabValue) {
            this.selectedTab = Number(this.tabValue);
        }

    }

    onDeleteCompanyButtonClicked() {
        if (this.currentCompany === this.companyId) {
            this.dialog.open(ConfirmationDialogComponent, {
                data: {
                    text: 'You cannot delete a company which you are in. Please access this company from another company and delete',
                    okButton: 'Ok',
                },
            });
        } else {
            this.onDeleteButtonDialog();
        }
    }

    getPosition(event) {
        this.selectedTab = event.index;
        return { offsetLeft: this.offsetLeft };
    }

    onFreezeUnfreezeButtonClicked(data) {
        if (this.freezeValue === Freeze.Freeze) {
            this.onFreezeButtonDialog();
        }
        if (this.freezeValue === Freeze.Unfreeze) {
            this.onUnfreezeButtonDialog();
        }
    }

    onFreezeButtonDialog() {
        const confirmFrozenDialog = this.dialog.open(ConfirmationDialogComponent, {
            data: {
                title: 'Freeze ' + this.companyId,
                text: 'User won\'t be able to edit configuration or create transactional data for this \n company anymore',
                okButton: 'FREEZE COMPANY',
                cancelButton: 'DISCARD',
            },
        });
        confirmFrozenDialog.afterClosed().subscribe((answer) => {
            if (answer) {
                this.freezeValue = Freeze.Unfreeze;
                this.freezeCompany.isFrozen = Freeze.Frozen;
                this.configurationService.UpdateIsFrozenForCompany(this.companyId, this.freezeCompany).subscribe(() => {
                    const messageText = 'The Company has been successfully frozen';
                    this.snackbarService.informationSnackBar(messageText);
                });
            }
        });
    }

    onUnfreezeButtonDialog() {
        const confirmUnfroezenDialog = this.dialog.open(ConfirmationDialogComponent, {
            data: {
                title: 'UnFreeze ' + this.companyId,
                text: 'Users will be able to edit configuration and create transactional data \nfor this company',
                okButton: 'UNFREEZE COMPANY',
                cancelButton: 'DISCARD',
            },
        });
        confirmUnfroezenDialog.afterClosed().subscribe((answer) => {
            if (answer) {
                this.freezeValue = Freeze.Freeze;
                this.freezeCompany.isFrozen = Freeze.Unfrozen;
                this.configurationService.UpdateIsFrozenForCompany(this.companyId, this.freezeCompany).subscribe(() => {
                    const messageText = 'The Company has been successfully unfrozen';
                    this.snackbarService.informationSnackBar(messageText);
                });
            }
        });
    }

    onDeleteButtonDialog() {
        const confirmDeletionDialog = this.dialog.open(ConfirmationDialogComponent, {
            data: {
                title: 'Delete ' + this.companyId,
                text: 'Deleting this company will de-assign all tha Master Data and remove its configuration',
                okButton: 'DELETE COMPANY',
                cancelButton: 'DISCARD',
            },
        });
        confirmDeletionDialog.afterClosed().subscribe((answer) => {
            if (answer) {
                const companyId = this.route.snapshot.paramMap.get('companyId');
                this.configurationService.deleteCompany(companyId).subscribe(() => {
                    const messageText = 'The Company is successfully deleted';
                    this.snackbarService.informationSnackBar(messageText);
                    this.router.navigate(['/' + this.companyManager.getCurrentCompanyId() + '/admin/companies']);
                });
            }
        });
    }

    checkTransactionDataExistsForCompany(companyId: string) {
        this.configurationService.checkTransationExistsByCompanyId(companyId).toPromise().then((data: boolean) => {
            this.isDeleteButtonDisabled = data;
        });
    }

}
