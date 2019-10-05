import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { CompanyManagerService } from '../../../../../core/services/company-manager.service';
import { LockService } from '../../../../../shared/services/http-services/lock.service';
import { UserIdentityService } from '../../../../../shared/services/http-services/user-identity.service';
import { SecurityService } from '../../../../../shared/services/security.service';
import { SnackbarService } from '../../../../../shared/services/snackbar.service';
import { TitleService } from '../../../../../shared/services/title.service';
import { UiService } from '../../../../../shared/services/ui.service';
import { ProfilesManagementComponent } from '../profiles-management.component';

@Component({
    selector: 'atlas-profiles-copy',
    templateUrl: './../profiles-management.component.html',
    styleUrls: ['./../profiles-management.component.scss'],
})
export class ProfilesCopyComponent extends ProfilesManagementComponent {
    title: string = 'Profile Copy';
    isCopy: boolean = true;
    constructor(protected securityService: SecurityService,
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
        super(
            securityService,
            userIdentityService,
            companyManager,
            route,
            router,
            fb,
            snackbarService,
            dialog,
            uiService,
            lockService,
            titleService);
    }

    checkProfileNotAdmin() {
        // You can copy the admin profile
    }

    prepareProfileForCopy() {
        this.model.profileId = null;
        this.model.name = '';
        this.model.description = '';
    }

}
