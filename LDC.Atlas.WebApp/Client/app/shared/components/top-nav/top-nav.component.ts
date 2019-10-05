import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { AdminActionsService } from '../../../admin/services/admin-actions.service';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { AuthorizationService } from '../../../core/services/authorization.service';
import { CompanyManagerService } from '../../../core/services/company-manager.service';
import { UiService } from '../../services/ui.service';
@Component({
    selector: 'atr-top-nav',
    templateUrl: './top-nav.component.html',
    styleUrls: ['./top-nav.component.scss'],
})
export class TopNavComponent implements OnInit {

    isExpanded = false;
    pageTitle: string;
    entityLabel: string | number;
    isHomePage: boolean;
    privilegeLevel1Name: string;
    username: string;
    userInitials: string;
    selectedSearchCriteria: string;
    expanded = true;
    envName: string;
    foreGroundStyles: string = 'foreground-element';
    primaryEnv: string = '-primary';

    foreGroundClass: string;
    activeUrl: string = '';
    item: string;
    profilePictureClass: string;
    settingsClass: string;
    toolbarStyles: string = 'top-toolbar';
    profileStyle: string = 'profile-picture';
    settingsStyle: string = 'settings';
    company: string;
    isPanelOpen = false;
    versionNumber: string = environment.version;
    constructor(private uiService: UiService,
        private router: Router,
        private route: ActivatedRoute,
        private location: Location,
        private authorizationService: AuthorizationService,
        private authenticationService: AuthenticationService,
        private companyManager: CompanyManagerService,
        protected adminActionsService: AdminActionsService,
    ) {
        this.router.events.subscribe((path: any) => {
            this.activeUrl = path.url;
            this.setPageTitle();
        });
        const currentUser = this.authorizationService.getCurrentUser();
        this.username = currentUser.displayName;
        this.userInitials = ((currentUser.firstName ? currentUser.firstName.substring(0, 1) : '')
            + (currentUser.lastName ? currentUser.lastName.substring(0, 2) : '')).toUpperCase();
    }

    ngOnInit() {
        // set title first time app loads
        this.activeUrl = this.router.url;
        this.setPageTitle();
        this.envName = this.uiService.getStylesForEnvironments();
        this.profilePictureClass = this.profileStyle + this.envName;
        this.settingsClass = this.settingsStyle + this.envName;

        if (this.envName !== this.primaryEnv) {
            this.foreGroundClass = this.foreGroundStyles;
        } else {
            this.foreGroundClass = this.foreGroundStyles + this.envName;
        }
    }

    setPageTitle() {
        const originalRoute = this.router.routerState.root;
        let route = originalRoute;
        while (route.firstChild) {
            route = route.firstChild;
        }
        if (route.data) {
            route.data.subscribe((value) => {
                this.setTitleFromRouteData(value);
            });
        } else if (originalRoute.data) {
            originalRoute.data.subscribe((value) => {
                this.setTitleFromRouteData(value);
            });
        } else {
            this.pageTitle = '';
            this.isHomePage = false;
            this.privilegeLevel1Name = undefined;
        }
    }

    setTitleFromRouteData(dataValue): void {
        if (!dataValue) {
            this.pageTitle = '';
            this.entityLabel = '';
            this.isHomePage = false;
            return;
        }

        if (dataValue['overrideTitle']) {
            this.pageTitle = dataValue['overrideTitle'];
        } else if (dataValue['title']) {
            this.pageTitle = dataValue['title'];
        } else {
            this.pageTitle = '';
        }

        this.isHomePage = dataValue['isHomePage'] ? dataValue['isHomePage'] : false;
        this.privilegeLevel1Name = dataValue['privilegeLevel1Name'];
        this.entityLabel = '';
        this.uiService.getEntityLabelIfExists(this.activeUrl, dataValue).subscribe((data) => {
            this.entityLabel = data ? data : '';
        });
    }

    onLogout() {
        this.authenticationService.logout();
    }

    onLoadPreviousPageButtonClicked() {
        let visibleUrl = window.location.pathname;

        // You need to remove the root (ex: /dev4) from visibleUrl
        if (this.location['_baseHref']) {
            const baseHrefLength = this.location['_baseHref'].length;
            // if there is a root (ex: /dev4), it will be stored in this.location['_baseHref']
            if (baseHrefLength > 0 && visibleUrl.substring(0, baseHrefLength) === this.location['_baseHref']) {
                // We need to change visibleUrl to get the relative url
                visibleUrl = visibleUrl.substring(baseHrefLength, visibleUrl.length);
            }
        }

        // made changes to identify router state change when we are changing the url with skiplocationchnage
        // location.back was moving to location history page
        if (visibleUrl === this.activeUrl) {
            this.location.back();
        } else {
            this.router.navigateByUrl(visibleUrl);
        }
    }

    closePanel() {
        this.isPanelOpen = false;
    }
    navigate() {
        this.adminActionsService.userPreferenceSubject.next();
    }
}
