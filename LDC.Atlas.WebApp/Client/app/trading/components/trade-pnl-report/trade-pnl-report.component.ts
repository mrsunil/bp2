import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { environment } from '../../../../environments/environment';
import { CompanyManagerService } from '../../../core/services/company-manager.service';
import { SSRSReportViewerComponent } from '../../../shared/components/ssrs-report-viewer/ssrsreport-viewer.component';
import { FreezeDisplayView } from '../../../shared/models/freeze-display-view';

@Component({
    selector: 'atlas-trade-pnl-report',
    templateUrl: './trade-pnl-report.component.html',
    styleUrls: ['./trade-pnl-report.component.scss'],
})
export class TradePnlReportComponent implements OnInit {
    company: string;
    parameters: any[] = [];
    dialogData: {
        contractSectionCode: number;
        dataVersionId: number;
    };

    reportServerUrl = environment.reportServerLink;
    reportPath = 'LDC Atlas/PnL/PnL_TradeCharter';
    @ViewChild('ssrsReportViewer') ssrsReportViewer: SSRSReportViewerComponent;

    constructor(public thisDialogRef: MatDialogRef<TradePnlReportComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { contractSectionCode: number, dataVersionId: number },
        protected companyManager: CompanyManagerService,
    ) {
        this.dialogData = data;
    }

    ngOnInit() {
        this.company = this.companyManager.getCurrentCompanyId();

        this.parameters = [
            { name: 'CompanyID', value: this.company },
            { name: 'ContractSectionCode', value: this.dialogData.contractSectionCode },
        ];

        if (this.dialogData.dataVersionId) {
            this.parameters.push({ name: 'Database', value: this.dialogData.dataVersionId });
        }

        this.ssrsReportViewer.generateReport(this.reportServerUrl, this.reportPath, this.parameters);
    }

    onCloseButtonClicked() {
        this.thisDialogRef.close(true);
    }
}
