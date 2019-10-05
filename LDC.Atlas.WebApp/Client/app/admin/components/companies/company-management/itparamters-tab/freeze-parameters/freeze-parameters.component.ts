import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import * as agGrid from 'ag-grid-community';
import { BaseFormComponent } from '../../../../../../shared/components/base-form-component/base-form-component.component';
import { CellEditorNumericComponent } from '../../../../../../shared/components/cell-editor-numeric/cell-editor-numeric.component';
import { AtlasAgGridParam } from '../../../../../../shared/entities/atlas-ag-grid-param.entity';
import { CompanyConfiguration } from '../../../../../../shared/entities/company-configuration.entity';
import { FreezeParameter } from '../../../../../../shared/entities/freeze-parameter.entity';
import { RetentionPolicy } from '../../../../../../shared/entities/retention-policy.entity';
import { WINDOW } from '../../../../../../shared/entities/window-injection-token';
import { IntegerNumber } from '../../../../../../shared/numberMask';
import { AgGridService } from '../../../../../../shared/services/ag-grid.service';
import { CompanyConfigurationRecord } from '../../../../../../shared/services/configuration/dtos/company-configuration-record';
import { FormConfigurationProviderService } from '../../../../../../shared/services/form-configuration-provider.service';

@Component({
    selector: 'atlas-freeze-parameters',
    templateUrl: './freeze-parameters.component.html',
    styleUrls: ['./freeze-parameters.component.scss'],
})
export class FreezeParametersComponent extends BaseFormComponent implements OnInit {
    freezeColumnDefs: agGrid.ColDef[];
    freezeGridOptions: agGrid.GridOptions = {};
    gridApi: agGrid.GridApi;
    gridColumnApi: agGrid.ColumnApi;
    atlasAgGridParam: AtlasAgGridParam;
    freezeParameter: FreezeParameter[];
    freezeRowData: FreezeParameter[];
    retentionPolicyResult: RetentionPolicy;
    retentionPolicy: RetentionPolicy;
    checkEdit: boolean = false;
    currentCompany: string;
    companyId: string;
    isCreate: boolean;
    dailyFreezeId: string = 'dailyFreezeRetention';
    weeklyFreezeId: string = 'weeklyFreezeRetention';
    monthlyFreezeId: string = 'monthlyFreezeRetention';
    gridComponents = {
        atlasNumeric: CellEditorNumericComponent,
    };

    constructor(protected formConfigurationProvider: FormConfigurationProviderService,
        protected formBuilder: FormBuilder,
        public gridService: AgGridService,
        @Inject(WINDOW) private window: Window,
        private route: ActivatedRoute) {
        super(formConfigurationProvider);
        this.atlasAgGridParam = this.gridService.getAgGridParam();
    }

    ngOnInit() {
        this.currentCompany = decodeURIComponent(this.route.snapshot.paramMap.get('company'));
        this.companyId = this.route.snapshot.paramMap.get('companyId');
        this.isCreate = false;
        if (!this.companyId) {
            this.isCreate = true;
            this.checkEdit = true;
            this.loadFreezeData();
            this.initializeGridColumns();
        }
    }

    initForm(companyConfigurationRecord: CompanyConfigurationRecord, isEdit: boolean) {
        this.retentionPolicy = companyConfigurationRecord.retentionPolicy;
        this.checkEdit = isEdit;
        this.loadFreezeData();
        this.initializeGridColumns();
        return companyConfigurationRecord;
    }

    onGridReady(params) {
        params.columnDefs = this.freezeColumnDefs;
        this.freezeGridOptions = params;
        this.gridApi = this.freezeGridOptions.api;
        this.gridColumnApi = this.freezeGridOptions.columnApi;

        this.gridColumnApi.autoSizeAllColumns();
        this.window.onresize = () => {
            this.gridColumnApi.autoSizeAllColumns();
        };
    }

    initializeGridColumns() {
        this.freezeColumnDefs = [
            {
                headerName: 'Configurable Values',
                colId: 'freezeLabel',
                field: 'freezeLabel',
            },
            {
                headerName: 'Description',
                colId: 'freezeValue',
                field: 'freezeValue',
                editable: this.checkEdit,
                cellEditor: 'atlasNumeric',
                cellEditorParams: {
                    displayMask: IntegerNumber(),
                    isRightAligned: true,
                },
                type: 'numericColumn',
            },
            {
                headerName: 'id',
                colId: 'freezeId',
                field: 'freezeId',
                hide: true,
            },
        ];
    }

    loadFreezeData() {
        this.freezeParameter = this.freezeRowData = [];
        this.freezeParameter.push(
            {
                freezeId: 'dailyFreezeRetention',
                freezeLabel: 'Daily Freeze Retention',
                freezeValue: (!this.isCreate) ? this.retentionPolicy.dailyFreezeRetention : 0,
            },
            {
                freezeId: 'weeklyFreezeRetention',
                freezeLabel: 'Weekly Freeze Retention',
                freezeValue: (!this.isCreate) ? this.retentionPolicy.weeklyFreezeRetention : 0,
            },
            {
                freezeId: 'monthlyFreezeRetention',
                freezeLabel: 'Monthly Freeze Retention',
                freezeValue: (!this.isCreate) ? this.retentionPolicy.monthlyFreezeRetention : 0,
            },
        );
        this.freezeRowData = this.freezeParameter;
    }

    getFreezeValuesToSave(): RetentionPolicy {
        const dailyFreeze = this.freezeParameter.find((e) => e.freezeId === this.dailyFreezeId);
        const weeklyFreeze = this.freezeParameter.find((e) => e.freezeId === this.weeklyFreezeId);
        const monthlyFreeze = this.freezeParameter.find((e) => e.freezeId === this.monthlyFreezeId);
        this.retentionPolicyResult = new RetentionPolicy();
        this.retentionPolicyResult.dailyFreezeRetention = (dailyFreeze) ? dailyFreeze.freezeValue : 0;
        this.retentionPolicyResult.weeklyFreezeRetention = (weeklyFreeze) ? weeklyFreeze.freezeValue : 0;
        this.retentionPolicyResult.monthlyFreezeRetention = (monthlyFreeze) ? monthlyFreeze.freezeValue : 0;
        return this.retentionPolicyResult;
    }

    populateEntity(entity: CompanyConfiguration): CompanyConfiguration {
        const companyConfiguration = entity;
        if (this.freezeParameter && this.freezeParameter.length > 0) {
            this.getFreezeValuesToSave();
            companyConfiguration.retentionPolicy.dailyFreezeRetention = this.retentionPolicyResult.dailyFreezeRetention;
            companyConfiguration.retentionPolicy.monthlyFreezeRetention = this.retentionPolicyResult.monthlyFreezeRetention;
            companyConfiguration.retentionPolicy.weeklyFreezeRetention = this.retentionPolicyResult.weeklyFreezeRetention;
        }
        return companyConfiguration;
    }

}
