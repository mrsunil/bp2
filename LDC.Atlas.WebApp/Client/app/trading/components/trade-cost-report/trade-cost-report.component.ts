import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { environment } from '../../../../environments/environment';
import { CompanyManagerService } from '../../../core/services/company-manager.service';
import { SSRSReportViewerComponent } from '../../../shared/components/ssrs-report-viewer/ssrsreport-viewer.component';
import { TradeStatus } from '../../../shared/entities/trade-status.entity';
import { ContractStatus } from '../../../shared/enums/contract-status.enum';

@Component({
    selector: 'atlas-trade-cost-report',
    templateUrl: './trade-cost-report.component.html',
    styleUrls: ['./trade-cost-report.component.scss'],
})
export class TradeCostReportComponent implements OnInit {

    company: string;
    parameters: any[] = [];
    includeGoods: false;
    constractStatusList: TradeStatus[] = [];
    tradeStatus: number;
    dialogData: {
        sectionId: number;
        contractStatus: ContractStatus;
        dataVersionId: number;
    };

    reportServerUrl = environment.reportServerLink;
    reportPath = 'LDC Atlas/TradeCost/TradeCost';
    @ViewChild('ssrsReportViewer') ssrsReportViewer: SSRSReportViewerComponent;

    constructor(public thisDialogRef: MatDialogRef<TradeCostReportComponent>,
        @Inject(MAT_DIALOG_DATA) public data: {
            sectionId: number,
            contractStatus: ContractStatus,
            dataVersionId: number,
        },
        protected companyManager: CompanyManagerService,
    ) {
        this.dialogData = data;
        this.constractStatusList = TradeStatus.getStatusList();
    }

    ngOnInit() {
        this.company = this.companyManager.getCurrentCompanyId();
        const goodsIncluded = this.includeGoods ? 1 : 0;
        let tradeStatus: TradeStatus;

        if (this.constractStatusList && this.dialogData.contractStatus) {
            const status: string = this.dialogData.contractStatus !== ContractStatus.Closed ?
                'Open' : 'Closed';
            tradeStatus = this.constractStatusList.find((e) => e.name === status);
        }

        this.parameters = [
            { name: 'Company', value: this.company },
            { name: 'SectionId', value: this.dialogData.sectionId },
            { name: 'IncludeGoods', value: goodsIncluded },
        ];

        if (tradeStatus) {
            this.parameters.push({ name: 'TradeStatus', value: tradeStatus.value });
        }

        if (this.dialogData.dataVersionId) {
            this.parameters.push({ name: 'Database', value: this.dialogData.dataVersionId });
        }

        if (this.company) {
            this.parameters.push({ name: 'UserLoginCompany', value: this.company });
        }

        this.ssrsReportViewer.generateReport(this.reportServerUrl, this.reportPath, this.parameters);
    }

    onCloseButtonClicked() {
        this.thisDialogRef.close(true);
    }
}
