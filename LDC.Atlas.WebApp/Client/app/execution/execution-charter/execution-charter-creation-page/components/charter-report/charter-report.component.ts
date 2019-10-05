import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { environment } from '../../../../../../environments/environment';
import { CompanyManagerService } from '../../../../../core/services/company-manager.service';
import { SSRSReportViewerComponent } from '../../../../../shared/components/ssrs-report-viewer/ssrsreport-viewer.component';
import { inDropdownListValidator } from '../../../../../shared/directives/autocomplete-dropdown.directive';
import { AtlasFormControl } from '../../../../../shared/entities/atlas-form-control';
import { Freeze } from '../../../../../shared/entities/freeze.entity';
import { FreezeDisplayView } from '../../../../../shared/models/freeze-display-view';
import { ApiPaginatedCollection } from '../../../../../shared/services/common/models';
import { FreezeService } from '../../../../../shared/services/http-services/freeze.service';
import { nameof } from '../../../../../shared/services/util.service';

@Component({
    selector: 'atlas-charter-report',
    templateUrl: './charter-report.component.html',
    styleUrls: ['./charter-report.component.scss'],
})
export class CharterReportComponent implements OnInit {

    charterSnapshotCtrl = new FormControl();
    snapshotList: FreezeDisplayView[] = [];
    includeClosedTradesCtrl = new AtlasFormControl('includeClosedTradesCtrl');
    currentSnapshot = new FreezeDisplayView(-1, 'CURRENT');
    charterReportFormGroup: FormGroup;
    company: string;
    closedTrades: boolean = false;
    parameters: any[] = [];
    charterId: number;
    dialogData: {
        charterId: number;
    };
    reportServerUrl = environment.reportServerLink;
    reportPath = 'LDC Atlas/Charter/Charter';
    destroy$ = new Subject();
    @ViewChild('ssrsReportViewer') ssrsReportViewer: SSRSReportViewerComponent;

    constructor(public thisDialogRef: MatDialogRef<CharterReportComponent>,
        private freezeService: FreezeService,
        private formBuilder: FormBuilder,
        @Inject(MAT_DIALOG_DATA) public data: { charterId: number },
        protected companyManager: CompanyManagerService,
    ) {
        this.dialogData = data;
    }

    ngOnInit() {
        this.charterId = Number(this.dialogData.charterId);
        this.company = this.companyManager.getCurrentCompanyId();
        this.loadSnapshots();
    }

    initializeForm() {
        this.charterReportFormGroup = this.formBuilder.group({
            charterSnapshotCtrl: this.charterSnapshotCtrl,
            includeClosedTradesCtrl: this.includeClosedTradesCtrl,
        });

        this.setValidators();
        return this.charterReportFormGroup;
    }

    setValidators() {
        this.charterSnapshotCtrl.setValidators(Validators.compose([
            inDropdownListValidator(
                this.snapshotList,
                nameof<FreezeDisplayView>('dataVersionId'),
            ),
            Validators.required,
        ]));
    }

    loadSnapshots() {
        this.freezeService.getFreezeList().pipe(
            map((data: ApiPaginatedCollection<Freeze>) => {
                return data.value.map((freeze) => {
                    return new FreezeDisplayView(
                        freeze.dataVersionId,
                        this.freezeService.toFormattedDate(freeze.dataVersionTypeId, freeze.freezeDate));
                });
            }),
            takeUntil(this.destroy$),
        ).subscribe((snapshots: FreezeDisplayView[]) => {
            this.snapshotList = snapshots;
            this.snapshotList.unshift(this.currentSnapshot);
            if (snapshots.length > 0) {
                this.charterSnapshotCtrl.setValue(snapshots[0]);
            }
            this.initializeForm();
        });
    }

    onIncludeClosedTradesChanged(event: MatCheckboxChange) {
        this.closedTrades = event.checked;
    }

    onCloseButtonClicked() {
        this.thisDialogRef.close(true);
    }

    onGenerateReportButtonClicked() {
        let snapshotId: number;
        const snapShotvalue = this.charterSnapshotCtrl.value as FreezeDisplayView;
        (snapShotvalue) ? snapshotId = snapShotvalue.dataVersionId : snapshotId = null;
        const iIncludeClosedTrades = this.closedTrades ? 1 : 0;
        this.parameters = [
            { name: 'Company', value: this.company },
            { name: 'CharterId', value: this.charterId },
            { name: 'iIncludeClosedTrades', value: iIncludeClosedTrades },
        ];
        if (snapshotId !== -1) {
            this.parameters.push({ name: 'Database', value: snapshotId });
        }
        this.ssrsReportViewer.generateReport(this.reportServerUrl, this.reportPath, this.parameters);
    }
}
