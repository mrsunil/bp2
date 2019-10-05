import { Component, OnInit, ViewChild } from '@angular/core';
import { LdrepManualAdjustmentReportComponent } from './ldrep-manual-adjustment-report/ldrep-manual-adjustment-report.component';
import { PnlMovementReportComponent } from './pnl-movement-report/pnl-movement-report.component';
import { PnlReportComponent } from './pnl-report/pnl-report.component';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'atlas-pnl-reports',
    templateUrl: './pnl-reports.component.html',
    styleUrls: ['./pnl-reports.component.scss'],
})
export class PnlReportsComponent implements OnInit {
    @ViewChild('pnlReportComponent') pnlReportComponent: PnlReportComponent;
    @ViewChild('pnlMovementReportComponent') pnlMovementReportComponent: PnlMovementReportComponent;
    @ViewChild('ldrepManualAdjustmentReportComponent') ldrepManualAdjustmentReportComponent: LdrepManualAdjustmentReportComponent;

    public selectedTab: number = 0;
    company: string;


    constructor(private route: ActivatedRoute, ) { }

    ngOnInit() {
        this.company = this.route.snapshot.paramMap.get('company');
    }

    getPosition(event) {

    }
}
