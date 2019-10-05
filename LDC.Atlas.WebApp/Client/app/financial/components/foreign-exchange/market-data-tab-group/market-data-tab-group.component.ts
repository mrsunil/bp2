import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CompanyManagerService } from '../../../../core/services/company-manager.service';

@Component({
    selector: 'atlas-market-data-tab-group',
    templateUrl: './market-data-tab-group.component.html',
    styleUrls: ['./market-data-tab-group.component.scss'],
})
export class MarketDataTabGroupComponent implements OnInit {
    routeLinks = [
        {
            label: 'EXCHANGE RATES',
            index: 0,
            privilege: 'Financials.AccountingEntries',
            link: '/' + this.companyManager.getCurrentCompanyId() + '/financial/fx/rates',
        },
        {
            label: 'REPORTS',
            link: '/' + this.companyManager.getCurrentCompanyId() + '/reporting/globalreports/historicalrates',
            index: 1,
            privilege: 'Financials',
        },
        {
            label: 'MARKET PRICES',
            index: 2,
            privilege: 'Financials.AccountingEntries.CreateDeleteMatchFlag',
        },
        {
            label: 'CASH MARKET PRICES',
            index: 3,
            privilege: 'Financials.POSTINGMGT',
        },
    ];
    activeLinkIndex = 0;
    company: string;

    constructor(private router: Router,
        private companyManager: CompanyManagerService,
        private route: ActivatedRoute) {
        this.activeLinkIndex = this.routeLinks.indexOf(this.routeLinks.find((tab) => this.router.url.includes(tab.link)));
    }

    ngOnInit() {
        this.company = this.route.snapshot.paramMap.get('company');
    }

    isActive(routeLink: any) {
        return this.activeLinkIndex === routeLink.index;
    }
    onExchangeButtonClicked() {
        this.router.navigate(['/' + this.companyManager.getCurrentCompanyId() + '/reporting/globalreports/historicalrates/']);

    }

}
