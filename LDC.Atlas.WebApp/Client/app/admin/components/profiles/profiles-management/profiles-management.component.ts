import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { mergeMap, takeUntil } from 'rxjs/operators';
import { CompanyManagerService } from '../../../../core/services/company-manager.service';
import { ConfirmationDialogComponent } from '../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { LockFunctionalContext } from '../../../../shared/entities/lock-functional-context.entity';
import { LockResourceInformation } from '../../../../shared/entities/lock-resource-information.entity';
import { PrivilegeNode } from '../../../../shared/entities/privilege-node.entity';
import { Privilege } from '../../../../shared/entities/privilege.entity';
import { ProfilePrivilege } from '../../../../shared/entities/profile-privilege.entity';
import { Profile } from '../../../../shared/entities/profile.entity';
import { PermissionLevels } from '../../../../shared/enums/permission-level.enum';
import { LockService } from '../../../../shared/services/http-services/lock.service';
import { UserIdentityService } from '../../../../shared/services/http-services/user-identity.service';
import { SecurityService } from '../../../../shared/services/security.service';
import { SnackbarService } from '../../../../shared/services/snackbar.service';
import { TitleService } from '../../../../shared/services/title.service';
import { UiService } from '../../../../shared/services/ui.service';

@Component({
    selector: 'atlas-profiles-management',
    templateUrl: './profiles-management.component.html',
    styleUrls: ['./profiles-management.component.scss'],
})
export class ProfilesManagementComponent implements OnInit, OnDestroy {
    isCreation: boolean = true;
    isCopy: boolean = false;
    isSave: boolean = false;
    title: string = 'Profile Creation';

    model: Profile;

    profileForm: FormGroup;
    profileNameCtrl: FormControl;
    profileDescriptionCtrl: FormControl;

    privileges: Privilege[];
    privilegeTree: PrivilegeNode[];
    unstructuredTree: PrivilegeNode[];
    destroy$ = new Subject();
    resourcesInformation: LockResourceInformation[] = new Array<LockResourceInformation>();

    constructor(
        protected securityService: SecurityService,
        protected userIdentityService: UserIdentityService,
        protected companyManager: CompanyManagerService,
        protected route: ActivatedRoute,
        protected router: Router,
        protected fb: FormBuilder,
        protected snackbarService: SnackbarService,
        protected dialog: MatDialog,
        protected uiService: UiService,
        protected lockService: LockService,
        protected titleService: TitleService,
    ) {
        this.model = new Profile();
        this.profileNameCtrl = new FormControl({ value: null, disabled: false }, [Validators.required]);
        this.profileDescriptionCtrl = new FormControl({ value: null, disabled: false }, [Validators.required]);
        this.profileForm = this.fb.group({
            profileNameCtrl: this.profileNameCtrl,
            profileDescriptionCtrl: this.profileDescriptionCtrl,
        });
    }

    ngOnInit() {
        this.securityService.isSecurityReady().pipe(
            mergeMap(() => {
                return this.route.data;
            }))
            .subscribe((data) => {
                this.isCreation = data.isCreation;
                if (this.isCreation) {
                    this.titleService.setTitle(this.route.snapshot.data.title);
                }
                this.getData();
            });
    }

    initForm() {
        this.profileNameCtrl.patchValue(this.model.name);
        this.profileDescriptionCtrl.patchValue(this.model.description);
        this.initializePrivileges();
    }

    initializePrivileges() {
        this.model.privileges.forEach((priv) => {
            const res = this.privileges.filter((pr) => pr.privilegeId === priv.privilegeId)[0];
            res.permission = priv.permission;
        });
    }

    canDeactivate() {
        if (this.profileForm.dirty && this.isSave === false) {
            return window.confirm('Leave an unsave form? \nYour changes won\'t be applied!');
        }
        return true;
    }

    @HostListener('window:beforeunload', ['$event']) unloadNotification($event: any) {
        if (this.profileForm.dirty) {
            $event.returnValue = true;
        }
    }

    getData() {

        this.userIdentityService.getAllPrivileges().subscribe((data) => {
            this.privileges = data.value;
            this.privilegeTree = this.buildPrivilegeTree(this.privileges);
            if (!this.isCreation) {
                this.title = '';
            }
            const id = +this.route.snapshot.paramMap.get('profileId');
            if (id) {

                if (!this.isCreation) {
                    this.lockService.lockUserProfile(id, LockFunctionalContext.UserProfileEdition).pipe(takeUntil(this.destroy$)).subscribe(
                        (data) => { },
                        (err) => {
                            this.dialog.open(ConfirmationDialogComponent, {
                                data: {
                                    title: 'Lock',
                                    text: err.error.detail,
                                    okButton: 'Got it',
                                },
                            });
                            this.goToPrivilegesList();
                        });
                }

                this.userIdentityService.getProfile(id).subscribe((result) => {
                    this.model = result;
                    this.titleService.setTitle(this.model.name + '- Profile Edition');
                    this.checkProfileNotAdmin();
                    this.prepareProfileForCopy();
                    this.initForm();
                    if (!this.isCreation) {
                        this.startLockRefresh(this.model.profileId, this.model.name);
                    }
                });
            }
        });
    }

    checkProfileNotAdmin() {
        if (this.model.name === 'Administrator') {
            this.snackbarService.throwErrorSnackBar('You cannot edit this profile');
            this.goToPrivilegesList();
        }
    }

    prepareProfileForCopy() {
        // defined in components that inherit management
    }

    buildPrivilegeTree(privilegeList: Privilege[]) {

        this.unstructuredTree = [];

        const tree: PrivilegeNode[] = [];
        const nodes = {};
        privilegeList.forEach((priv) => {
            const node = new PrivilegeNode();
            node.privilege = priv;
            node.children = [];
            node.privilege.permission = PermissionLevels.None;
            nodes[node.getId()] = node;

            this.unstructuredTree.push(node);
        });

        privilegeList.forEach((priv) => {
            if (priv.parentId != null) {
                nodes[priv.parentId].children.push(nodes[priv.privilegeId]);
            } else {
                tree.push(nodes[priv.privilegeId]);
            }
        });

        return tree;
    }

    isSelected(privilege: PrivilegeNode) {
        return (privilege.getPermission() > PermissionLevels.None);
    }

    selectPrivilege(privilege: PrivilegeNode) {
        this.isSave = true;
        if (privilege.getPermission() > PermissionLevels.None) {
            privilege.privilege.permission = PermissionLevels.None;
            privilege.children.forEach((priv) => {
                priv.privilege.permission = PermissionLevels.None;
            });
        } else {
            privilege.privilege.permission = PermissionLevels.ReadWrite;
            privilege.children.forEach((priv) => {
                priv.privilege.permission = PermissionLevels.Read;
            });

        }
    }

    onCopyProfileButtonClicked() {
        this.isSave = true;
        this.router.navigate(['/' + this.companyManager.getCurrentCompanyId() + '/admin/profiles/copy/' + this.model.profileId]);
    }

    onValidateButtonClicked() {
        this.isSave = true;
        if (this.profileForm.valid) {
            let isValid = false; // att least one level 2 and 1 level 1 has to be good

            const profilePrivileges: ProfilePrivilege[] = [];
            this.unstructuredTree.forEach((node) => {
                if (node.getPermission() > PermissionLevels.None) {
                    isValid = (node.getLevel() > PermissionLevels.None) || (isValid);

                    profilePrivileges.push({
                        privilegeId: node.getId(),
                        permission: node.getPermission(),

                    } as ProfilePrivilege);
                }
            });

            if (isValid && profilePrivileges.length > 0) {
                this.model.name = this.profileNameCtrl.value;
                this.model.description = this.profileDescriptionCtrl.value;
                this.model.privileges = profilePrivileges;

                if (this.isCreation) {
                    this.userIdentityService.saveProfile(this.model).subscribe(() => {
                        this.snackbarService.informationSnackBar('Profile Created');
                        this.goToPrivilegesList();
                    });
                } else {
                    this.userIdentityService.updateProfile(this.model).subscribe(() => {
                        this.snackbarService.informationSnackBar('Profile Updated');
                        this.goToPrivilegesList();
                    });
                }
            } else {
                this.snackbarService.throwErrorSnackBar('The form is not valid. Please check at least one privilege is selected.');
            }
        } else {
            this.snackbarService.throwErrorSnackBar('The form is not valid. Please fix the errors.');
        }
    }

    onCancelButtonClicked() {
        this.isSave = true;
        this.goToPrivilegesList();
    }

    goToPrivilegesList() {
        this.router.navigate(['/' + this.companyManager.getCurrentCompanyId() + '/admin/profiles']);
    }

    onDeleteButtonClicked() {
        this.isSave = true;
        if (this.model.numberOfUsers > 0) {
            this.dialog.open(ConfirmationDialogComponent, {
                data: {
                    title: 'Profile Deletion',
                    text: this.model.numberOfUsers + ' users are currently using this profile. You need to totally unassign the profile before deleting it.',
                    cancelButton: 'Got it !',
                },
            });
        } else {
            const confirmDialog = this.dialog.open(ConfirmationDialogComponent, {
                data: {
                    title: 'Profile Deletion',
                    text: 'Deleting a profile is permanent. You can create it again, but all its permissions will be gone.',
                    okButton: 'Delete anyway',
                    cancelButton: 'Cancel',
                },
            });
            confirmDialog.afterClosed().subscribe((answer) => {
                if (answer) {
                    this.userIdentityService.deleteProfile(this.model.profileId).subscribe(() => {
                        this.snackbarService.informationSnackBar('Profile Deleted');
                        this.goToPrivilegesList();
                    });
                }
            });
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
