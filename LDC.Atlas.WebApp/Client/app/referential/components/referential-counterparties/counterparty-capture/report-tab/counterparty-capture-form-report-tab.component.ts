import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { CompanyManagerService } from '../../../../../../app/core/services/company-manager.service';

@Component({
    selector: 'atlas-counterparty-capture-form-report-tab',
    templateUrl: './counterparty-capture-form-report-tab.component.html',
    styleUrls: ['./counterparty-capture-form-report-tab.component.scss']
})
export class CounterpartyCaptureFormReportTabComponent implements OnInit {
    @Input() counterPartyId: number;
    @Input() isCreateMode: boolean = false;
    constructor(private companyManager: CompanyManagerService,
        private router: Router
    ) { }

    ngOnInit() {
    }

    navigateCListReport() {
        this.router.navigate(['/' + this.companyManager.getCurrentCompanyId() +
            '/reporting/globalreports/clientreport', this.counterPartyId]);
    }

    navigateTradeReport() {
        this.router.navigate(['/' + this.companyManager.getCurrentCompanyId() +
            '/reporting/globalreports/trade', this.counterPartyId]);
    }

}
