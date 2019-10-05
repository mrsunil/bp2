import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfigurationType } from '../../../../shared/enums/configuration-type.enum';
import { CompanyManagerService } from '../../../../core/services/company-manager.service';
import { TitleService } from '../../../../shared/services/title.service';
import { SecurityService } from '../../../../shared/services/security.service';
import { AuthorizationService } from '../../../../core/services/authorization.service';

@Component({
    selector: 'atlas-grid-configuration',
    templateUrl: './grid-configuration.component.html',
    styleUrls: ['./grid-configuration.component.scss']
})

export class GridConfigurationComponent implements OnInit {
    routeLinks = [
        {
            label: 'Lists',
            link: '/' + this.companyManager.getCurrentCompanyId() + '/admin/global-parameters/grid-configuration/list/display',
            index: 0,
            title: 'List Configuration',
            privilege: 'Administration.GlobalParameters.ListConfig',
        },
        {
            label: 'Contextual Search',
            link: '/' + this.companyManager.getCurrentCompanyId() + '/admin/global-parameters/grid-configuration/contextual/display',
            index: 1,
            title: 'List Configuration',
            privilege: 'Administration.GlobalParameters.ContextualSearchConfig',
        },
    ];

    activeLinkIndex = -1;
    gridType: number;
    isViewMode: boolean;
    isEditMode: boolean;
    company: string;
    isAdmin: boolean = false;

    constructor(private router: Router,
        private companyManager: CompanyManagerService,
        private route: ActivatedRoute,
        protected securityService: SecurityService, private authorizationService: AuthorizationService,
        private titleService: TitleService) {
        this.activeLinkIndex = this.routeLinks.indexOf(this.routeLinks.find((tab) => this.router.url.includes(tab.link)));
    }

    ngOnInit() {
        this.company = this.route.snapshot.params['company'];
        this.titleService.setTitle('List Configuration');
        this.isViewMode = true;
        this.isEditMode = false;

        this.securityService.isSecurityReady().subscribe(() => {
            if (this.authorizationService.isAdministrator(this.company)) {
                this.isAdmin = true;
            }
        });
    }

    onSelectedIndexChanged = (tabChangeEvent: number): void => {
        this.setGridType(tabChangeEvent);
    }

    setGridType(tabIndex: number) {
        this.gridType = (tabIndex === 0 ? ConfigurationType.List : ConfigurationType.Contextual);
    }

    isActive(routeLink: any) {
        if (this.activeLinkIndex === routeLink.index) {
            this.titleService.setTitle(this.routeLinks[this.activeLinkIndex].title);
        }
        return this.activeLinkIndex === routeLink.index;
    }
}
