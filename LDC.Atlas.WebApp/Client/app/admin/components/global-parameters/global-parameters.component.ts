import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthorizationService } from '../../../core/services/authorization.service';
import { SecurityService } from '../../../shared/services/security.service';
import { TitleService } from '../../../shared/services/title.service';

@Component({
    selector: 'atlas-global-parameters',
    templateUrl: './global-parameters.component.html',
    styleUrls: ['./global-parameters.component.scss'],
})
export class GlobalParametersComponent implements OnInit {
    company: string;
    isPrivilege: boolean = false;
    isAdmin: boolean = false;
    isContextualPrivilege: boolean = false;

    constructor(private route: ActivatedRoute,
        private titleService: TitleService,
        protected securityService: SecurityService, private authorizationService: AuthorizationService,
        private router: Router) { }

    ngOnInit() {
        this.company = this.route.snapshot.paramMap.get('company');
        this.titleService.setTitle(this.route.snapshot.data.title);
        this.securityService.isSecurityReady().subscribe(() => {
            if (this.authorizationService.isPrivilegeAllowed(this.company, 'Administration')
                && this.authorizationService.isPrivilegeAllowed(this.company, 'GlobalParameters') &&
                this.authorizationService.isPrivilegeAllowed(this.company, 'ContextualSearchConfig') ||
                (this.authorizationService.isPrivilegeAllowed(this.company, 'ListConfig'))) {
                this.isPrivilege = true;
            }
            if (this.authorizationService.isAdministrator(this.company)) {
                this.isAdmin = true;
            }

            if (this.authorizationService.isPrivilegeAllowed(this.company, 'Administration')
                && this.authorizationService.isPrivilegeAllowed(this.company, 'GlobalParameters')) {
                if (this.authorizationService.isPrivilegeAllowed(this.company, 'ContextualSearchConfig')
                    && !this.authorizationService.isPrivilegeAllowed(this.company, 'ListConfig')) {
                    this.isContextualPrivilege = true;
                }
            }

        });
    }

    onNavigateButtonClicked(route: string) {
        this.router.navigate(['/' + this.company + route]);
    }

    onPrivilegeNavigationClicked() {
        if (this.isContextualPrivilege) {
            this.router.navigate(['/' + this.company + '/admin/global-parameters/grid-configuration/contextual/display']);
        } else {
            this.router.navigate(['/' + this.company + '/admin/global-parameters/grid-configuration/list/display']);
        }
    }
}
