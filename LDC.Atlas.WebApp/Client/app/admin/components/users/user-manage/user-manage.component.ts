import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import * as agGrid from 'ag-grid-community';
import { Subject } from 'rxjs';
import { mergeMap, takeUntil } from 'rxjs/operators';
import { AuthorizationService } from '../../../../core/services/authorization.service';
import { CompanyManagerService } from '../../../../core/services/company-manager.service';
import { AgContextualMenuComponent } from '../../../../shared/components/ag-contextual-menu/ag-contextual-menu.component';
import { CellEditorSelectComponent } from '../../../../shared/components/cell-editor-select/cell-editor-select.component';
import { ConfirmationDialogComponent } from '../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { AgContextualMenuAction } from '../../../../shared/entities/ag-contextual-menu-action.entity';
import { AtlasAgGridParam } from '../../../../shared/entities/atlas-ag-grid-param.entity';
import { Company } from '../../../../shared/entities/company.entity';
import { Department } from '../../../../shared/entities/department.entity';
import { DirectoryUser } from '../../../../shared/entities/directory-user.entity';
import { LockFunctionalContext } from '../../../../shared/entities/lock-functional-context.entity';
import { LockResourceInformation } from '../../../../shared/entities/lock-resource-information.entity';
import { MasterData } from '../../../../shared/entities/masterdata.entity';
import { Profile } from '../../../../shared/entities/profile.entity';
import { UserPermission } from '../../../../shared/entities/user-permission.entity';
import { User } from '../../../../shared/entities/user.entity';
import { AgGridService } from '../../../../shared/services/ag-grid.service';
import { LockService } from '../../../../shared/services/http-services/lock.service';
import { UserIdentityService } from '../../../../shared/services/http-services/user-identity.service';
import { SecurityService } from '../../../../shared/services/security.service';
import { SnackbarService } from '../../../../shared/services/snackbar.service';
import { TitleService } from '../../../../shared/services/title.service';
import { UiService } from '../../../../shared/services/ui.service';
import { AgGridCheckboxComponent } from './../../../../shared/components/ag-grid-checkbox/ag-grid-checkbox.component';
import { AgGridMultipleAutocompleteDepartmentComponent } from './../../../../shared/components/ag-grid/ag-grid-multiple-autocomplete-department/ag-grid-multiple-autocomplete-department.component';
import { CopyPrivilegesDialogComponent } from './copy-privileges-dialog/copy-privileges-dialog.component';
import { PermissionLineComponent } from './permission-line/permission-line.component';

@Component({
    selector: 'atlas-user-manage',
    templateUrl: './user-manage.component.html',
    styleUrls: ['./user-manage.component.scss'],
    providers: [DatePipe],
})
export class UserManageComponent implements OnInit, OnDestroy {
    isCreation = false;
    submitLabel: string;
    isSave: boolean = false;
    title: string;
    userForm: FormGroup;
    favoriteLanguageCtrl: FormControl;
    managerSamAccountNameCtrl: FormControl;
    companyRoleCtrl : FormControl;
    isUserDisabledCtrl: FormControl;
    savingInProgress = false;
    masterData: MasterData = new MasterData();
    filteredCompanies: Company[];
    @ViewChildren('permissionLineComponent') permissionLineComponents: QueryList<PermissionLineComponent>;

    userInitials: string;
    profiles: Profile[] = [];
    gridApi: agGrid.GridApi;
    gridColumnApi: agGrid.ColumnApi;
    gridContext: UserManageComponent;
    checkExportedFormat: boolean = false;
    gridComponents = {
        atrSelect: CellEditorSelectComponent,
        atlasCheckbox: AgGridCheckboxComponent,
    };
    atlasAgGridParam: AtlasAgGridParam;
    model: User;
    userGridCols: agGrid.ColDef[];
    userGridContextualMenuActions: AgContextualMenuAction[];
    userMenuActions: { [key: string]: string } = {
        deleteUser: 'delete',
    };
    userActiveDirectoryName: string;
    company: string;
    masterdata: any = [];
    screenName: string = 'UserEdition';
    destroy$ = new Subject();
    isUserEdit: boolean = false;
    resourcesInformation: LockResourceInformation[] = new Array<LockResourceInformation>();

    constructor(private userIdentityService: UserIdentityService,
        private securityService: SecurityService,
        private route: ActivatedRoute,
        private router: Router,
        private fb: FormBuilder,
        private companyManager: CompanyManagerService,
        private snackbarService: SnackbarService,
        protected dialog: MatDialog,
        private uiService: UiService,
        private datePipe: DatePipe,
        private authorizationService: AuthorizationService,
        protected lockService: LockService,
        public gridService: AgGridService,
        private titleService: TitleService,
    ) {
        this.model = new User();
        this.model.userPrincipalName = decodeURIComponent(this.route.snapshot.paramMap.get('userId'));

        this.favoriteLanguageCtrl = new FormControl();
        this.companyRoleCtrl = new FormControl('companyRoleCtrl');
        this.managerSamAccountNameCtrl = new FormControl('managerSamAccountNameCtrl');
        this.isUserDisabledCtrl = new FormControl({ value: false });
        this.userForm = this.fb.group({
            managerSamAccountNameCtrl: this.managerSamAccountNameCtrl,
            companyRoleCtrl: this.companyRoleCtrl,
            favoriteLanguageCtrl: this.favoriteLanguageCtrl,
            isUserDisabledCtrl: this.isUserDisabledCtrl,
        });
        this.userActiveDirectoryName = this.authorizationService.getCurrentUser().samAccountName;
    }

    ngOnInit() {
        this.company = this.route.snapshot.params['company'];
        this.masterdata = this.route.snapshot.data.masterdata;
        this.atlasAgGridParam = this.gridService.getAgGridParam();
        this.securityService.isSecurityReady().pipe(
            mergeMap(() => {
                return this.route.data;
            }))
            .subscribe((data) => {
                this.userGridContextualMenuActions = [
                    {
                        icon: 'delete',
                        text: 'Delete',
                        action: this.userMenuActions.deleteUser,
                    },
                ];
                this.isCreation = data.isCreation;
                this.getData();
            });

        if(this.route.snapshot.data.isUserEdit) {
            this.isUserEdit = this.route.snapshot.data.isUserEdit;
        }
        
        this.disableControl(this.isUserEdit);
    }

    disableControl(isEditMode : boolean) {
        if(!isEditMode) {
            this.companyRoleCtrl.disable();
            this.managerSamAccountNameCtrl.disable();
        }
        else {
            this.companyRoleCtrl.enable();
            this.managerSamAccountNameCtrl.enable();
        }
    }

    canDeactivate() {
        if (this.userForm.dirty && this.isSave === false) {
            return window.confirm('Leave an unsave form? \nYour changes won\'t be applied!');
        }
        return true;
    }

    getData() {
        this.masterData = this.route.snapshot.data['masterdata'] as MasterData;
        this.filteredCompanies = this.masterData.companies;
        this.getUser();
    }

    getUser() {
        if (this.isCreation === true) {
            this.titleService.setTitle(this.route.snapshot.data.title);
            this.userIdentityService.getDirectoryUserById(this.model.userPrincipalName)
                .subscribe((data) => {
                    this.model = this.mapToUser(data);
                    if(this.model) {
                        this.managerSamAccountNameCtrl.setValue(this.model.managerSamAccountName);
                        this.companyRoleCtrl.setValue(this.model.companyRole);
                    }
                    this.initView();
                });
        } else {

            this.userIdentityService.getUserByUpn(this.model.userPrincipalName).subscribe((data) => {
                this.model = data;
                if(this.model) {
                    this.managerSamAccountNameCtrl.setValue(this.model.managerSamAccountName);
                    this.companyRoleCtrl.setValue(this.model.companyRole);
                }
                this.titleService.setTitle(this.model.displayName + '- User Edition');
                this.startLockRefresh(this.model.userId, this.model.samAccountName);
                this.lockService.lockUserAccount(this.model.userId, LockFunctionalContext.UserAccountEdition).pipe(takeUntil(this.destroy$)).subscribe(
                    (data) => { },
                    (err) => {
                        this.dialog.open(ConfirmationDialogComponent, {
                            data: {
                                title: 'Lock',
                                text: err.error.detail,
                                okButton: 'Got it',
                            },
                        });
                        this.goToUserList();
                    });
                this.initView();
            });
        }
    }

    initView() {
        this.userIdentityService.getAllProfiles().subscribe((data) => {
            this.profiles = data.value;
            this.permissionLineComponents.forEach((plc) => {
                plc.permissionList = this.model.permissions;
                plc.profiles = this.profiles;
                plc.initAutocomplete();
                plc.addValidators();
                this.initUserGridColumns();
            });
        });

        if (this.model.firstName !== null && this.model.lastName !== null) {
            this.userInitials = (this.model.firstName.substr(0, 1) + this.model.lastName.substr(0, 2)).toUpperCase();
        }
        this.favoriteLanguageCtrl.patchValue(this.model.favoriteLanguage);

        this.isUserDisabledCtrl.patchValue(!this.model.isDisabled);
        this.title = this.isCreation === true ? 'User Creation' : 'Edit User';
        this.submitLabel = this.isCreation === true ? 'CREATE USER' : 'SAVE';
    }

    onCancelButtonClicked() {
        this.isSave = true;
        this.goToUserList();
    }

    goToUserList() {
        this.router.navigate(['/' + this.companyManager.getCurrentCompanyId() + '/admin/users']);
    }

    onValidateButtonClicked() {
        this.isSave = true;
        this.savingInProgress = true;
        let isValidForm = true;
        if (!this.userForm.valid) {
            this.snackbarService.throwErrorSnackBar('Please fix errors before saving');
            this.savingInProgress = false;
            return;
        }

        this.model.permissions.forEach((element) => {
            if (isValidForm && ((!element.departments) || element.departments.length === 0) && !element.allDepartments) {

                isValidForm = false;
            }
        });

        if (!isValidForm) {
            this.snackbarService.throwErrorSnackBar('This permission is not valid');
            this.savingInProgress = false;
            return;
        }

        this.model.favoriteLanguage = this.favoriteLanguageCtrl.value;
        this.model.isDisabled = !this.isUserDisabledCtrl.value;
        this.model.companyRole = this.companyRoleCtrl.value;
        this.model.managerSamAccountName = this.managerSamAccountNameCtrl.value;
        this.model.permissions = this.getUpdatedPermissionsFromForm();

        if (this.isCreation) {
            this.userIdentityService.createUser(this.model)
                .subscribe(
                    () => {
                        this.snackbarService.informationSnackBar('User has been created successfully.');
                        this.goToUserList();
                    },
                    (error) => {
                        console.error(error);
                        this.snackbarService.throwErrorSnackBar('Oops! An error ocurred');
                    },
                    () => {
                        this.savingInProgress = false;
                    });
        } else {
            this.userIdentityService.updateUser(this.model)
                .subscribe(
                    () => {
                        this.snackbarService.informationSnackBar('User has been updated successfully.');
                        this.goToUserList();
                    },
                    (error) => {
                        console.error(error);
                        this.snackbarService.throwErrorSnackBar('Oops! An error ocurred');
                    },
                    () => {
                        this.savingInProgress = false;
                    });
        }
    }

    mapToUser(directoryUser: DirectoryUser): User {
        const user = new User();
        user.firstName = directoryUser.firstName;
        user.lastName = directoryUser.lastName;
        user.displayName = directoryUser.displayName;
        if (!user.displayName && user.lastName !== null && user.firstName !== null) {
            user.displayName = user.firstName + ' ' + user.lastName;
        }
        user.userPrincipalName = directoryUser.userPrincipalName;
        user.email = directoryUser.emailAddress;
        user.phoneNumber = directoryUser.phoneNumber ? directoryUser.phoneNumber : '';
        user.location = directoryUser.location ? directoryUser.location : '';
        user.userPrincipalName = directoryUser.userPrincipalName;
        user.samAccountName = directoryUser.samAccountName;
        user.azureObjectIdentifier = directoryUser.userId;
        user.favoriteLanguage = directoryUser.preferredLanguage ? directoryUser.preferredLanguage : '';
        user.managerSamAccountName = directoryUser.managerSamAccountName;
        user.companyRole = directoryUser.companyRole;
        
        return user;
    }

    removePermission(companyId: string) {
        this.model.permissions = this.model.permissions.filter((p) => p.companyId !== companyId);
        this.permissionLineComponents.filter((plc) => plc.isNew === true).forEach((plc) => {
            plc.permissionList = this.model.permissions;
            plc.initAutocomplete();
        });
    }

    getUpdatedPermissionsFromForm(): UserPermission[] {
        this.model.permissions.forEach((plc) => {
            const selectedProfile = this.profiles.find((p) => p.name === plc.profileName);
            plc.profileId = selectedProfile ? selectedProfile.profileId : null;
        });
        return this.model.permissions;
    }

    onCopyUserPermissionsButtonClicked(event: Event) {
        const copyPrivilegesDialog = this.dialog.open(CopyPrivilegesDialogComponent, {
            width: '560px',
        });
        copyPrivilegesDialog.afterClosed().subscribe((user: User) => {
            if (user) {
                this.userIdentityService.getUserById(user.userId).subscribe((data) => {
                    this.model.permissions = data.permissions;
                });
            }
        });
        event.stopPropagation();
    }

    onDeleteButtonClicked() {
        this.isSave = true;
        const confirmDialog = this.dialog.open(ConfirmationDialogComponent, {
            data: {
                title: 'User Deletion',
                text: 'Deleting a user is permanent. You can create it again, but all his/her permissions will be gone.',
                okButton: 'Delete anyway',
                cancelButton: 'Cancel',
            },
        });
        confirmDialog.afterClosed().subscribe((answer) => {
            if (answer) {
                this.userIdentityService.deleteUser(this.model.userId).subscribe(() => {
                    this.snackbarService.informationSnackBar('User Deleted');
                    this.goToUserList();
                });
            }
        });
    }
    OnExportButton() {
        const filteredDepartments: Department[] = this.masterdata.departments;
        if (!this.checkExportedFormat) {
            this.gridApi.forEachNode((node) => {
                if (!node.data.allDepartments) {
                    if (filteredDepartments && node.data.departments[0].departmentId) {
                        node.data.departments = filteredDepartments
                            .find((dept) => dept.departmentId === node.data.departments[0].departmentId).description;
                    }
                } else {
                    node.data.departments = 'All';
                }

            });
            this.checkExportedFormat = true;
        }
    }
    onExportButtonClickedAsExcel() {
        this.isSave = true;
        const now = new Date();
        const todayDate = this.datePipe.transform(now, 'yyyyMMdd_hhmm').toString().toUpperCase();
        const params = {
            fileName: todayDate + '_' + this.company + '_' + this.screenName + '_' + this.userActiveDirectoryName + '.xlsx',
        };
        this.gridApi.exportDataAsExcel(params);
    }
    onExportButtonClickedAsCSV() {
        this.isSave = true;
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
                headerName: 'Company',
                field: 'companyId',
            },
            {
                headerName: 'Profile',
                field: 'profileName',
                cellEditor: 'agRichSelectCellEditor',
                editable: true,
                cellEditorParams: {
                    values: this.profiles.map((profile) => profile.name),
                },
            },
            {
                headerName: 'Departments',
                field: 'departments',
                cellRendererFramework: AgGridMultipleAutocompleteDepartmentComponent,
                cellRendererParams: {
                    isRequired: true,
                    allOptionsElement: {
                        departmentId: 0,
                        departmentCode: 'All',
                        description: 'All',
                        profitCenterId: 0,
                    },
                    displayCode: true,
                    codeProperty: 'departmentCode',
                    displayProperty: 'description',
                    placeholder: null,
                    placeholderFilter: 'Department Name',
                    elementName: 'Department',
                },
            },
            {
                headerName: 'Trader',
                colId: 'isTrader',
                field: 'isTrader',
                cellRenderer: 'atlasCheckbox',
                cellRendererParams: {
                    params: this.gridContext,
                },
            },
            {
                headerName: 'Charter Manager',
                colId: 'isCharterManager',
                field: 'isCharterManager',
                cellRenderer: 'atlasCheckbox',
                cellRendererParams: {
                    params: this.gridContext,
                },
            },
            {
                headerName: '',
                cellRendererFramework: AgContextualMenuComponent,
                cellRendererParams: {
                    context: {
                        componentParent: this,
                    },
                    menuActions: this.userGridContextualMenuActions,

                },
                cellClass: 'ag-contextual-menu',
                width: 92,
            },

        ];

    }

    onGridReady(params) {
        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;

        this.gridColumnApi.autoSizeAllColumns();
        this.gridApi.doLayout();

        window.onresize = () => {
            this.gridColumnApi.autoSizeAllColumns();
            this.gridApi.doLayout();
        };
    }

    departmentFormatter(params) {
        if (params.data.allDepartments) {
            return 'All';
        } else {
            return params.data.departments.map((x) => x.description);
        }
    }

    handleAction(action: string, user: UserPermission) {
        switch (action) {
            case this.userMenuActions.deleteUser:
                const confirmDialog = this.dialog.open(ConfirmationDialogComponent, {
                    data: {
                        title: 'Permission Deletion',
                        text: 'Are you sure you want to delete this permission?',
                        okButton: 'Delete anyway',
                        cancelButton: 'Cancel',
                    },
                });
                confirmDialog.afterClosed().subscribe((answer) => {
                    if (answer) {
                        this.removePermission(user.companyId);
                    }
                });
                break;
            default:
                break;
        }
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
