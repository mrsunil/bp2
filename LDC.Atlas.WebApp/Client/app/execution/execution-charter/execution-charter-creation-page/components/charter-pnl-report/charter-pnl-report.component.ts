import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { environment } from '../../../../../../environments/environment';
import { CompanyManagerService } from '../../../../../core/services/company-manager.service';
import { SSRSReportViewerComponent } from '../../../../../shared/components/ssrs-report-viewer/ssrsreport-viewer.component';
import { FreezeDisplayView } from '../../../../../shared/models/freeze-display-view';

@Component({
    selector: 'atlas-charter-pnl-report',
    templateUrl: './charter-pnl-report.component.html',
    styleUrls: ['./charter-pnl-report.component.scss'],
})
export class CharterPnlReportComponent implements OnInit {

    company: string;
    parameters: any[] = [];
    charterId: number;
    dialogData: {
        charterId: number;
    };
    reportServerUrl = environment.reportServerLink;
    reportPath = 'LDC Atlas/PnL/PnL_TradeCharter';
    @ViewChild('ssrsReportViewer') ssrsReportViewer: SSRSReportViewerComponent;

    constructor(public thisDialogRef: MatDialogRef<CharterPnlReportComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { charterId: number },
        protected companyManager: CompanyManagerService,
    ) {
        this.dialogData = data;
    }

    ngOnInit() {
        this.charterId = Number(this.dialogData.charterId);
        this.company = this.companyManager.getCurrentCompanyId();
        this.GenerateReport();
    }

    onCloseButtonClicked() {
        this.thisDialogRef.close(true);
    }

    GenerateReport() {
        this.parameters = [
            { name: 'CompanyID', value: this.company },
            { name: 'CharterId', value: this.charterId },
        ];
        this.ssrsReportViewer.generateReport(this.reportServerUrl, this.reportPath, this.parameters);
    }
}
