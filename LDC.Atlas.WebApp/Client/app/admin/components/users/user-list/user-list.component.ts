import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import * as agGrid from 'ag-grid-community';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthorizationService } from '../../../../core/services/authorization.service';
import { CompanyManagerService } from '../../../../core/services/company-manager.service';
import { AgContextualMenuComponent } from '../../../../shared/components/ag-contextual-menu/ag-contextual-menu.component';
import { ConfirmationDialogComponent } from '../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { AgContextualMenuAction } from '../../../../shared/entities/ag-contextual-menu-action.entity';
import { IsLocked } from '../../../../shared/entities/is-locked.entity';
import { LockFunctionalContext } from '../../../../shared/entities/lock-functional-context.entity';
import { LockResourceInformation } from '../../../../shared/entities/lock-resource-information.entity';
import { UserListItemViewModel } from '../../../../shared/models/user-list-item-view-model';
import { AgGridService } from '../../../../shared/services/ag-grid.service';
import { LockService } from '../../../../shared/services/http-services/lock.service';
import { UserIdentityService } from '../../../../shared/services/http-services/user-identity.service';
import { SecurityService } from '../../../../shared/services/security.service';
import { SnackbarService } from '../../../../shared/services/snackbar.service';
import { AtlasAgGridParam } from '../../../../shared/entities/atlas-ag-grid-param.entity';
import { TitleService } from '../../../../shared/services/title.service';

@Component({
    selector: 'atlas-user-list',
    templateUrl: './user-list.component.html',
    styleUrls: ['./user-list.component.scss'],
    providers: [DatePipe],
})
export class UserListComponent implements OnInit, OnDestroy {
    isLoading = true;
    users: UserListItemViewModel[];

    userMenuActions: { [key: string]: string } = {
        toggleUser: 'toggle',
        deleteUser: 'delete',
    };

    userGridContextualMenuActions: AgContextualMenuAction[];
    userGridOptions: agGrid.GridOptions = {} as agGrid.GridOptions;
    userGridCols: agGrid.ColDef[];
    userGridRows: UserListItemViewModel[];
    gridApi: agGrid.GridApi;
    gridColumnApi: agGrid.ColumnApi;
    userActiveDirectoryName: string;
    company: string;
    screenName: string = 'UserManagement';
    destroy$ = new Subject();
    resourcesInformation: LockResourceInformation[] = new Array<LockResourceInformation>();
    atlasAgGridParam: AtlasAgGridParam;

    constructor(private securityService: SecurityService,
        private route: ActivatedRoute,
        private router: Router,
        private userIdentityService: UserIdentityService,
        private companyManager: CompanyManagerService,
        protected dialog: MatDialog,
        private snackbarService: SnackbarService,
        private datePipe: DatePipe,
        private authorizationService: AuthorizationService,
        protected lockService: LockService,
        public gridService: AgGridService,
        private titleService: TitleService,) {

        this.userActiveDirectoryName = this.authorizationService.getCurrentUser().samAccountName;
    }

    ngOnInit() {
        this.company = this.route.snapshot.params['company'];
        this.titleService.setTitle(this.route.snapshot.data.title);
        this.securityService.isSecurityReady().subscribe(() => {
            this.init();
            this.getUsers();
            this.initUserGridColumns();
        });

        // this.userGridOptions.getRowHeight = (params) => {
        //     return 30;
        // };

        this.atlasAgGridParam = this.gridService.getAgGridParam();
    }

    init() {
        this.userGridContextualMenuActions = [
            // {
            // 	icon: "lock_open",
            // 	text: "Toggle User Activation",
            // 	action: this.userMenuActions.deactivateUser
            // },
            {
                icon: 'delete',
                text: 'Delete',
                action: this.userMenuActions.deleteUser,
            },
        ];
    }

    getUsers() {
        this.userIdentityService.getAllUsers().subscribe((data) => {
            this.users = data.value.map((user) => {
                return new UserListItemViewModel(user);
            });

            this.userGridRows = this.users;
        });

    }
    OnExportButton() {
    }
    onExportButtonClickedAsExcel() {
        const now = new Date();
        const todayDate = this.datePipe.transform(now, 'yyyyMMdd_hhmm').toString().toUpperCase();
        const params = {
            fileName: todayDate + '_' + this.company + '_' + this.screenName + '_' + this.userActiveDirectoryName + '.xlsx',
        };
        this.gridApi.exportDataAsExcel(params);
    }
    onExportButtonClickedAsCSV() {
        const now = new Date();
        const todayDate = this.datePipe.transform(now, 'yyyyMMdd_hhmm').toString().toUpperCase();
        const params = {
            fileName: todayDate + '_' + this.company + '_' + this.screenName + '_' + this.userActiveDirectoryName + '.csv',
        };
        this.gridApi.exportDataAsCsv(params);
    }
    initUserGridColumns() {
        this.userGridCols = [
            {
                headerName: 'SAM Account Name',
                colId: 'samAccountName',
                field: 'samAccountName',
            },
            {
                headerName: 'User Principal Name',
                colId: 'userPrincipalName',
                field: 'userPrincipalName',
            },
            {
                headerName: 'First Name',
                colId: 'firstName',
                field: 'firstName',
            },
            {
                headerName: 'Last Name',
                colId: 'lastName',
                field: 'lastName',
            },
            {
                headerName: 'Email address',
                colId: 'email',
                field: 'email',
            },
            {
                headerName: 'Phone n°',
                colId: 'phoneNumber',
                field: 'phoneNumber',
            },
            {
                headerName: 'Location',
                colId: 'location',
                field: 'location',
            },
            {
                headerName: 'Activated',
                colId: 'isActivated',
                field: 'isActivated',
            },
            {
                headerName: '',
                colId: 'additionalActions',
                cellRendererFramework: AgContextualMenuComponent,
                cellRendererParams: {
                    context: {
                        componentParent: this,
                    },
                    menuActions: this.userGridContextualMenuActions,

                },
                cellClass: 'ag-contextual-menu',
                maxWidth: 80,
            },
        ];
    }

    onGridReady(params) {
        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;
        this.gridColumnApi.autoSizeAllColumns();
        window.onresize = () => {
            this.gridColumnApi.autoSizeAllColumns();
        };
    }

    handleAction(action: string, user: UserListItemViewModel) {
        switch (action) {
            case this.userMenuActions.toggleUser:
                break;
            case this.userMenuActions.deleteUser:

                this.lockService.isLockedUserAccount(user.id).pipe(takeUntil(this.destroy$)).subscribe((lock: IsLocked) => {
                    if (lock.isLocked) {
                        this.dialog.open(ConfirmationDialogComponent, {
                            data: {
                                title: 'Lock',
                                text: lock.message,
                                okButton: 'Got it',
                            },
                        });
                    } else {
                        this.lockService.lockUserAccount(user.id, LockFunctionalContext.UserAccountDeletion).pipe(takeUntil(this.destroy$)).subscribe((lockState) => {
                            this.startLockRefresh(user.id, user.samAccountName);
                            const confirmDialog = this.dialog.open(ConfirmationDialogComponent, {
                                data: {
                                    title: 'User Deletion',
                                    text: 'Deleting a user is permanent. You can create it again, but all his/her permissions will be gone.',
                                    okButton: 'Delete anyway',
                                    cancelButton: 'Cancel',
                                },
                            });
                            confirmDialog.afterClosed().subscribe((answer) => {
                                this.stopLockRefresh();
                                if (answer) {
                                    this.userIdentityService.deleteUser(user.id).subscribe(() => {
                                        this.snackbarService.informationSnackBar('User Deleted');
                                        this.getUsers();
                                    });
                                }
                                this.lockService.unlockUserAccount(user.id, LockFunctionalContext.UserAccountDeletion).pipe(takeUntil(this.destroy$)).subscribe();
                            });
                        });

                    }
                });
                break;
            default: // throw Action not recognized exception
                break;
        }
    }

    onNewUserButtonClicked() {
        this.router.navigate(['/' + this.companyManager.getCurrentCompanyId() + '/admin/users/new/']);
    }

    onUserCellClicked(event) {
        this.lockService.isLockedUserAccount(event.data.id).pipe(takeUntil(this.destroy$)).subscribe((lock: IsLocked) => {
            if (lock.isLocked) {
                this.dialog.open(ConfirmationDialogComponent, {
                    data: {
                        title: 'Lock',
                        text: lock.message,
                        okButton: 'Got it',
                    },
                });
            } else {
                if (event.column.colDef.colId !== 'additionalActions') {
                    this.router.navigate(['/' + this.companyManager.getCurrentCompanyId() +
                        '/admin/users/edit/', encodeURIComponent(event.data.userPrincipalName)]);
                }
            }
        });
    }

    startLockRefresh(userId: number, samAccountName: string) {
        this.resourcesInformation = new Array<LockResourceInformation>();
        const resourceInformation = new LockResourceInformation();
        resourceInformation.resourceType = 'User Account';
        resourceInformation.resourceId = userId;
        resourceInformation.resourceCode = samAccountName;
        resourceInformation.needRefresh = true;
        this.resourcesInformation.push(resourceInformation);
    }

    stopLockRefresh() {
        this.resourcesInformation = new Array<LockResourceInformation>();
    }

    ngOnDestroy(): void {
        this.stopLockRefresh();
        this.lockService.cleanSessionLocks().pipe(takeUntil(this.destroy$)).subscribe(() => {
            this.destroy$.next();
            this.destroy$.complete();
        });
    }
}
