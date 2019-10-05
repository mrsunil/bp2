import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CompanyManagerService } from '../../../../core/services/company-manager.service';
import { BaseFormComponent } from '../../../../shared/components/base-form-component/base-form-component.component';
import { FormConfigurationProviderService } from '../../../../shared/services/form-configuration-provider.service';

@Component({
    selector: 'atlas-cash-matching-home',
    templateUrl: './cash-matching-home.component.html',
    styleUrls: ['./cash-matching-home.component.scss'],
})
export class CashMatchingHomeComponent extends BaseFormComponent implements OnInit {

    routeLinks = [

        {
            label: 'Create Match',
            link: '/' + this.companyManager.getCurrentCompanyId() + '/financial/create/matching',
            index: 0,
        },
        {
            label: 'Delete Match',
            link: '/' + this.companyManager.getCurrentCompanyId() + '/financial/delete/matching',
            index: 1,
        },
    ];
    activeLinkIndex = -1;
    company: string;

    constructor(private router: Router,
        private companyManager: CompanyManagerService,
        protected formConfigurationProvider: FormConfigurationProviderService,
        private route: ActivatedRoute) {
        super(formConfigurationProvider);
        this.activeLinkIndex = this.routeLinks.indexOf(this.routeLinks.find((tab) => this.router.url.includes(tab.link)));
    }

    ngOnInit() {
        this.company = this.route.snapshot.paramMap.get('company');

    }
    isActive(routeLink: any) {
        return this.activeLinkIndex === routeLink.index;
    }

}
