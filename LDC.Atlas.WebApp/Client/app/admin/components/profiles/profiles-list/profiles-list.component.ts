import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import * as agGrid from 'ag-grid-community';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthorizationService } from '../../../../core/services/authorization.service';
import { CompanyManagerService } from '../../../../core/services/company-manager.service';
import { ConfirmationDialogComponent } from '../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { AgContextualMenuAction } from '../../../../shared/entities/ag-contextual-menu-action.entity';
import { AtlasAgGridParam } from '../../../../shared/entities/atlas-ag-grid-param.entity';
import { IsLocked } from '../../../../shared/entities/is-locked.entity';
import { LockFunctionalContext } from '../../../../shared/entities/lock-functional-context.entity';
import { LockResourceInformation } from '../../../../shared/entities/lock-resource-information.entity';
import { Profile } from '../../../../shared/entities/profile.entity';
import { AgGridService } from '../../../../shared/services/ag-grid.service';
import { LockService } from '../../../../shared/services/http-services/lock.service';
import { UserIdentityService } from '../../../../shared/services/http-services/user-identity.service';
import { SecurityService } from '../../../../shared/services/security.service';
import { SnackbarService } from '../../../../shared/services/snackbar.service';
import { TitleService } from '../../../../shared/services/title.service';
import { ProfilesListContextualMenuComponent } from './contextual-menu/profiles-list-contextual-menu.component';

@Component({
    selector: 'atlas-profiles-list',
    templateUrl: './profiles-list.component.html',
    styleUrls: ['./profiles-list.component.scss'],
    providers: [DatePipe],
})
export class ProfilesListComponent implements OnInit, OnDestroy {

    profiles: Profile[];

    profileMenuActions: { [key: string]: string } = {
        copyProfile: 'copy',
        deleteProfile: 'delete',
    };

    profileGridContextualMenuActions: AgContextualMenuAction[];
    profileGridContextualMenuActionsForAdmin: AgContextualMenuAction[];
    profilesGridOptions: agGrid.GridOptions = {} as agGrid.GridOptions;
    profilesGridCols: agGrid.ColDef[];
    profilesGridRows: any[];
    gridApi: agGrid.GridApi;
    gridColumnApi: agGrid.ColumnApi;
    userActiveDirectoryName: string;
    company: string;
    screenName: string = 'Profile';
    destroy$ = new Subject();
    resourcesInformation: LockResourceInformation[] = new Array<LockResourceInformation>();

    atlasAgGridParam: AtlasAgGridParam;

    constructor(private securityService: SecurityService,
        private route: ActivatedRoute,
        private router: Router,
        private userIdentityService: UserIdentityService,
        private companyManagerService: CompanyManagerService,
        private snackbarService: SnackbarService,
        protected dialog: MatDialog,
        private datePipe: DatePipe,
        private authorizationService: AuthorizationService,
        protected lockService: LockService,
        public gridService: AgGridService,
        private titleService: TitleService) {

        this.userActiveDirectoryName = this.authorizationService.getCurrentUser().samAccountName;
    }

    ngOnInit() {
        this.company = this.route.snapshot.params['company'];
        this.titleService.setTitle(this.route.snapshot.data.title);
        this.securityService.isSecurityReady().subscribe(() => {
            this.init();
            this.getProfiles();
            this.initProfilesGridColumns();
            this.atlasAgGridParam = this.gridService.getAgGridParam();
        });

        // this.profilesGridOptions.getRowHeight = (params) => {
        //     return 30;
        // };
    }

    init() {
        this.profileGridContextualMenuActions = [
            {
                icon: 'content_copy',
                text: 'Copy',
                action: this.profileMenuActions.copyProfile,
            },
            {
                icon: 'delete',
                text: 'Delete',
                action: this.profileMenuActions.deleteProfile,
            },
        ];
    }

    getProfiles() {
        this.userIdentityService.getAllProfiles().subscribe((data) => {

            this.profiles = data.value;
            this.profilesGridRows = this.profiles;
        });

    }

    onGridReady(params) {
        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;
        this.gridColumnApi.autoSizeAllColumns();
        window.onresize = () => {
            this.gridColumnApi.autoSizeAllColumns();
        };
    }
    OnExportButton() {
    }
    onExportButtonClickedAsExcel() {
        const now = new Date();
        const todayDate = this.datePipe.transform(now, 'yyyyMMdd_hhmm').toString().toUpperCase();
        let params = {
            fileName: todayDate + '_' + this.company + '_' + this.screenName + '_' + this.userActiveDirectoryName + '.xlsx',
        };
        this.gridApi.exportDataAsExcel(params);
    }
    onExportButtonClickedAsCSV() {
        const now = new Date();
        const todayDate = this.datePipe.transform(now, 'yyyyMMdd_hhmm').toString().toUpperCase();
        let params = {
            fileName: todayDate + '_' + this.company + '_' + this.screenName + '_' + this.userActiveDirectoryName + '.csv',
        };
        this.gridApi.exportDataAsCsv(params);
    }
    initProfilesGridColumns() {
        this.profilesGridCols = [
            {
                headerName: 'Name',
                colId: 'name',
                field: 'name',
            },
            {
                headerName: 'Description',
                colId: 'description',
                field: 'description',
            },
            {
                headerName: 'NumberOfUsers',
                colId: 'numberOfUsers',
                field: 'numberOfUsers',
            },
            {
                headerName: '',
                colId: 'additionalActions',
                cellRendererFramework: ProfilesListContextualMenuComponent,
                cellRendererParams: {
                    context: {
                        componentParent: this,
                    },
                    menuActions: this.profileGridContextualMenuActions,
                },
                maxWidth: 80,
            },
        ];
    }

    handleAction(action: string, profile: Profile) {
        switch (action) {
            case this.profileMenuActions.copyProfile:
                this.router.navigate(['/' + this.companyManagerService.getCurrentCompanyId() +
                    '/admin/profiles/copy/', encodeURIComponent(String(profile.profileId))]);
                break;
            case this.profileMenuActions.deleteProfile:
                this.deleteProfile(profile);
                break;
            default: // throw Action not recognized exception
                break;
        }
    }

    onNewProfileButtonClicked() {
        this.router.navigate(['/' + this.companyManagerService.getCurrentCompanyId() + '/admin/profiles/new']);
    }

    deleteProfile(profile: Profile) {
        if (profile.name === 'Administrator') {
            this.snackbarService.throwErrorSnackBar('You cannot delete this profile');
            return;
        }

        if (profile.numberOfUsers > 0) {
            this.dialog.open(ConfirmationDialogComponent, {
                data: {
                    title: 'Profile Deletion',
                    text: profile.numberOfUsers + ' users are currently using this profile. ' +
                        'You need to totally unassign the profile before deleting it.',
                    cancelButton: 'Got it !',
                },
            });
        } else {
            this.lockService.isLockedUserProfile(profile.profileId).pipe(takeUntil(this.destroy$)).subscribe((lock: IsLocked) => {
                if (lock.isLocked) {
                    this.dialog.open(ConfirmationDialogComponent, {
                        data: {
                            title: 'Lock',
                            text: lock.message,
                            okButton: 'Got it',
                        },
                    });
                } else {
                    this.startLockRefresh(profile.profileId, profile.name);
                    this.lockService.lockUserProfile(profile.profileId, LockFunctionalContext.UserProfileDeletion).pipe(takeUntil(this.destroy$)).subscribe((lockState) => {
                        const confirmDialog = this.dialog.open(ConfirmationDialogComponent, {
                            data: {
                                title: 'Profile Deletion',
                                text: 'Deleting a profile is permanent. You can create it again, but all its permissions will be gone.',
                                okButton: 'Delete anyway',
                                cancelButton: 'Cancel',
                            },
                        });
                        confirmDialog.afterClosed().subscribe((answer) => {
                            this.stopLockRefresh();
                            if (answer) {
                                this.userIdentityService.deleteProfile(profile.profileId).subscribe(() => {
                                    this.snackbarService.informationSnackBar('Profile Deleted');
                                    this.getProfiles();
                                });
                            }
                            this.lockService.unlockUserProfile(profile.profileId, LockFunctionalContext.UserProfileDeletion).pipe(takeUntil(this.destroy$)).subscribe();
                        });
                    });
                }
            });
        }
    }

    onProfileCellClicked(event) {
        if (event.column.colDef.colId !== 'additionalActions') {
            this.router.navigate(['/' + this.companyManagerService.getCurrentCompanyId() +
                '/admin/profiles/edit/', encodeURIComponent(String(event.data.profileId))]);
        }
    }

    startLockRefresh(profileId: number, profileName: string) {
        this.resourcesInformation = new Array<LockResourceInformation>();
        const resourceInformation = new LockResourceInformation();
        resourceInformation.resourceType = 'User Profile';
        resourceInformation.resourceId = profileId;
        resourceInformation.resourceCode = profileName;
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
