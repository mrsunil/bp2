import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { environment } from '../../../../environments/environment';
import { CompanyManagerService } from '../../../core/services/company-manager.service';
import { FreezeDisplayView } from '../../models/freeze-display-view';
import { SSRSReportViewerComponent } from '../ssrs-report-viewer/ssrsreport-viewer.component';
@Component({
    selector: 'atlas-trade-report-viewer',
    templateUrl: './generic-report-viewer.component.html',
    styleUrls: ['./generic-report-viewer.component.scss'],
})
export class GenericReportViewerComponent implements OnInit {
    company: string;
    parameters: any[] = [];
    reportPath: string;
    dialogData: {
        reportName: string;
        reportPath: string;
        dataVersionId: number;
    };
    showParameters: boolean = true;
    reportServerUrl = environment.reportServerLink;
    @ViewChild('ssrsReportViewer') ssrsReportViewer: SSRSReportViewerComponent;

    constructor(public thisDialogRef: MatDialogRef<GenericReportViewerComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { reportName: string, reportPath: string, dataVersionId: number },
        protected companyManager: CompanyManagerService,
    ) {
        this.dialogData = data;
    }

    ngOnInit() {
        this.company = this.companyManager.getCurrentCompanyId();

        this.parameters = [];

        if (this.dialogData.dataVersionId) {
            this.parameters.push({ name: 'Database', value: this.dialogData.dataVersionId });
        }
        this.reportPath = this.dialogData.reportPath.substring(1);
        this.ssrsReportViewer.generateReport(this.reportServerUrl, this.reportPath, this.parameters);
    }

    onCloseButtonClicked() {
        this.thisDialogRef.close(true);
    }
}
