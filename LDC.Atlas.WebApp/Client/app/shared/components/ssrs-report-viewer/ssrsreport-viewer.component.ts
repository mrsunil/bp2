import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
    selector: 'atlas-ssrsreport-viewer',
    templateUrl: './ssrsreport-viewer.component.html',
    styleUrls: ['./ssrsreport-viewer.component.scss'],
})

/* parameters eg:
[
    { name: 'Database', value: null },
    { name: 'TradeStatus', value: 4 },
    { name: 'IncludeGoods', value: 1 },
    { name: 'Company', value: 'e3' },
];
*/
export class SSRSReportViewerComponent {
    // for exemples: https://www.npmjs.com/package/ngx-ssrs-reportviewer
    reportPath: string;
    reportServer: string;
    parameters: any[] = [];

    @Input() showParameters?: string = 'false';
    @Input() language?: string = 'en-us';
    @Input() width?: number = 100;
    @Input() height?: number = 100;
    @Input() toolbar?: string = 'true';
    @Input() toBeDownloaded?: boolean = false;

    @Input() displayReport: boolean = false;

    @Output() readonly hasError = new EventEmitter<any>();

    reportUrl: SafeResourceUrl;

    @ViewChild('ssrsSubmissionForm') ssrsSubmissionForm: any;
    // private ssrsSubmissionForm: ElementRef;
    // @ViewChild('ssrsSubmissionForm') set content(content: ElementRef) {
    //     this.ssrsSubmissionForm = content;
    // }

    constructor(private sanitizer: DomSanitizer) {
    }

    public generateReport(reportServer: string, reportPath: string, parameters: any[]) {
        this.reportServer = reportServer;
        this.reportPath = reportPath;
        this.parameters = parameters;

        this.reportUrl = this.sanitizer
            .bypassSecurityTrustResourceUrl(this.reportServer + '?/'
                + this.reportPath);

        this.displayReport = (this.toBeDownloaded) ? false : true;
        setTimeout(() => {
            return this.ssrsSubmissionForm.nativeElement.submit();
        });
    }

}
