
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { CompanyManagerService } from '../../../core/services/company-manager.service';
import { Company } from '../../entities/company.entity';
import { CookiesProps, CookiesService } from '../../services/cookies.service';
import { UiService } from '../../services/ui.service';

@Component({
    selector: 'atlas-company-picker',
    templateUrl: './company-picker.component.html',
    styleUrls: ['./company-picker.component.scss'],
})
export class CompanyPickerComponent implements OnInit {

    company: string;
    envName: string;
    foreGroundStyles: string = 'foreground-element';
    primaryEnv: string = '-primary';
    companySelectionForm = new FormGroup({
        selectedCompanyCtrl: new FormControl(),
    });

    companies: Company[] = [];
    currentCompany: string;
    isPanelOpen = false;
    foreGroundClass: string;
    constructor(
        private router: Router,
        private uiService: UiService,
        private cookiesService: CookiesService,
        private companyManager: CompanyManagerService) { }

    ngOnInit() {
        this.companies = this.companyManager.getLoadedCompanies();
        this.envName = this.uiService.getStylesForEnvironments();

        if (this.envName !== this.primaryEnv) {
            this.foreGroundClass = this.foreGroundStyles;
        } else {
            this.foreGroundClass = this.foreGroundStyles + this.envName;
        }

        this.router.events.pipe(
            filter((event) => event instanceof NavigationEnd))
            .subscribe((event: NavigationEnd) => {
                this.company = this.companyManager.getCurrentCompanyId();
                if (this.company) {
                    this.cookiesService.setCookie(CookiesProps.currentCompany, this.company);
                }
            });
    }

    selectedCompanyChanged(company: Company) {
        this.companyManager.changeCurrentCompany(company.companyId);
    }

    closePanel() {
        this.isPanelOpen = false;
    }

}
