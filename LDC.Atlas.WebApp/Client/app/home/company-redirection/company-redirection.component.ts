import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../core/services/authentication.service';
import { CompanyManagerService } from '../../core/services/company-manager.service';
import { CookiesProps, CookiesService } from '../../shared/services/cookies.service';
import { SecurityService } from '../../shared/services/security.service';

@Component({
    selector: 'atlas-company-redirection',
    templateUrl: './company-redirection.component.html',
    styleUrls: ['./company-redirection.component.scss'],
})
export class CompanyRedirectionComponent implements OnInit {

    constructor(private cookieService: CookiesService,
        private securityService: SecurityService,
        private authenticationService: AuthenticationService,
        private companyManager: CompanyManagerService,
        private router: Router) { }

    ngOnInit() {
        this.securityService.isSecurityReady().subscribe(() => {
            let defaultComp = this.cookieService.getCookie(CookiesProps.currentCompany);
            if (!defaultComp) {
                const companyList = this.companyManager.getLoadedCompanies();
                defaultComp = (companyList.length > 0) ? companyList[0].companyId : null;
            }
            if (this.authenticationService.state) {
                this.router.navigateByUrl(decodeURIComponent(this.authenticationService.state));
            } else if (defaultComp) {
                this.companyManager.resetToCompany(defaultComp);
            }
        });
    }
}
