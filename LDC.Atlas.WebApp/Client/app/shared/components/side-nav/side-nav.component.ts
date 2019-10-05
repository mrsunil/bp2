import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { CompanyManagerService } from '../../../core/services/company-manager.service';
import { SecurityService } from '../../services/security.service';
import { UiService } from '../../services/ui.service';

@Component({
    selector: 'atlas-side-nav',
    templateUrl: './side-nav.component.html',
    styleUrls: ['./side-nav.component.css'],
})
export class SideNavComponent implements OnInit {

    company: string = '';
    isExpanded: boolean = false;
    isCompanyFrozen: boolean = false;

    constructor(private securityService: SecurityService,
        private router: Router,
        private uiService: UiService,
        private companyManager: CompanyManagerService,
    ) {
    }

    ngOnInit() {
        this.router.events.pipe(
            filter((event) => event instanceof NavigationEnd))
            .subscribe((event: NavigationEnd) => {
                this.company = this.companyManager.getCurrentCompanyId();
                const currentCompany = this.company;
                this.isCompanyFrozen = this.companyManager.getCompany(currentCompany).isFrozen;
            });
    }

    toggleSideBar() {
        this.isExpanded = !this.isExpanded;
    }

    navigateToExternalLink(link: string) {
        window.open(link, '_blank');
    }

    isActive(instruction: any[]): boolean {
        return this.router.isActive(this.router.createUrlTree(instruction), false);
    }

}
