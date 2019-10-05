import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { BaseFormComponent } from '../../../../../../shared/components/base-form-component/base-form-component.component';
import { AtlasFormControl } from '../../../../../../shared/entities/atlas-form-control';
import { Freeze } from '../../../../../../shared/entities/freeze.entity';
import { FreezeDisplayView } from '../../../../../../shared/models/freeze-display-view';
import { ApiPaginatedCollection } from '../../../../../../shared/services/common/models';
import { FormConfigurationProviderService } from '../../../../../../shared/services/form-configuration-provider.service';
import { FreezeService } from '../../../../../../shared/services/http-services/freeze.service';
import { monthEndReportType } from '../../../../../../shared/entities/month-end-report-type.entity'

@Component({
    selector: 'atlas-end-of-month-selection',
    templateUrl: './end-of-month-selection.component.html',
    styleUrls: ['./end-of-month-selection.component.scss'],
})
export class EndOfMonthSelectionComponent extends BaseFormComponent implements OnInit {
    @Output() readonly snapshotTypeSelected = new EventEmitter<any>();
    @Output() readonly snapshotDate = new EventEmitter<any>();
    @Output() readonly snapshotMonth = new EventEmitter<string>();
    @Output() readonly reportTypeSelected = new EventEmitter<any>();
    @Output() readonly reportTypeDescriptionSelected = new EventEmitter<any>();
    snapshotsCtrl = new AtlasFormControl('snapshots');
    reportTypeCtrl = new AtlasFormControl('reportType');
    formGroup: FormGroup;
    selectedDB = 'Current Database';
    selectedType = 'Realised Physicals';
    snapshotList: FreezeDisplayView[] = [];
    currentSnapshot = new FreezeDisplayView(-1, 'Current Database');
    reportType: monthEndReportType;
    snapshotErrorMap: Map<string, string> = new Map<string, string>();
    destroy$ = new Subject();
    reportTypeList: monthEndReportType[];
    reportTypeErrorMap: Map<string, string> = new Map<string, string>();
    constructor(protected formConfigurationProvider: FormConfigurationProviderService,
        private freezeService: FreezeService,
        private formBuilder: FormBuilder,
        private route: ActivatedRoute
    ) {
        super(formConfigurationProvider);
    }

    ngOnInit() {
        this.loadSnapshots();
        this.snapshotTypeSelected.emit({ dataVersionIdSelected: 0 });
        this.reportTypeList = this.route.snapshot.data.masterdata.monthEndReportType;
        this.reportTypeSelected.emit({ reportTypeSelected: this.route.snapshot.data.masterdata.monthEndReportType[0].enumEntityId });
        this.reportTypeDescriptionSelected.emit({ reportTypeDescriptionSelected: this.route.snapshot.data.masterdata.monthEndReportType[0].enumEntityValue });
    }
    getFormGroup() {
        this.formGroup = this.formBuilder.group({
            snapshotsCtrl: this.snapshotsCtrl,
            reportTypeCtrl: this.reportTypeCtrl,
        });
        return super.getFormGroup();
    }
    initializeForm() {
        this.formGroup = this.formBuilder.group({
            snapshotsCtrl: this.snapshotsCtrl,
            reportTypeCtrl: this.reportTypeCtrl,
        });
        this.setDefaultValues();

        return this.formGroup;
    }
    setDefaultValues() {
        this.snapshotsCtrl.patchValue(this.currentSnapshot);
        this.reportTypeCtrl.patchValue(this.route.snapshot.data.masterdata.monthEndReportType[0]);
    }
    loadSnapshots() {
        this.freezeService.getFreezeList().pipe(
            map((data: ApiPaginatedCollection<Freeze>) => {
                return data.value.filter((freeze) => freeze.dataVersionTypeId === 2).map((freeze) => {
                    return new FreezeDisplayView(
                        freeze.dataVersionId,
                        this.freezeService.toFormattedDate(freeze.dataVersionTypeId, freeze.freezeDate),
                        freeze.freezeDate);
                });
            }),
            takeUntil(this.destroy$),
        ).subscribe((snapshots: FreezeDisplayView[]) => {
            this.snapshotList = snapshots;
            this.snapshotList.unshift(this.currentSnapshot);
            this.initializeForm();
        });

    }

    onSnapshotSelected(value: FreezeDisplayView) {
        this.snapshotTypeSelected.emit({ dataVersionIdSelected: value.dataVersionId });
        this.snapshotDate.emit({ snapshotSelectedDate: value.actualfreezeDate });
        this.snapshotMonth.emit(value.freezeDate);

    }

    onReportTypeSelected(value: monthEndReportType) {
        this.reportTypeSelected.emit({ reportTypeSelected: value.enumEntityId });
        this.reportTypeDescriptionSelected.emit({ reportTypeDescriptionSelected: value.enumEntityValue });
    }
}
