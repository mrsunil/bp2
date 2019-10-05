import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { environment } from '../../../../../environments/environment';
import { CompanyManagerService } from '../../../../core/services/company-manager.service';
import { SSRSReportViewerComponent } from '../../../../shared/components/ssrs-report-viewer/ssrsreport-viewer.component';

@Component({
    selector: 'atlas-custom-report-viewer',
    templateUrl: './custom-report-viewer.component.html',
    styleUrls: ['./custom-report-viewer.component.scss'],
})
export class CustomReportViewerComponent implements OnInit {
    company: string;
    parameters: any[] = [];
    dialogData: {
        reportName: string;
        reportPath: string;
        dataVersionId: number;
    };

    path: string;
    showParameters: boolean = true;
    reportServerUrl = environment.reportServerLink;
    @ViewChild('ssrsReportViewer') ssrsReportViewer: SSRSReportViewerComponent;

    constructor(public thisDialogRef: MatDialogRef<CustomReportViewerComponent>,
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

        this.path = this.dialogData.reportPath.substring(1);
        this.ssrsReportViewer.generateReport(this.reportServerUrl, this.path, this.parameters);
    }

    onCloseButtonClicked() {
        this.thisDialogRef.close(true);
    }
}
