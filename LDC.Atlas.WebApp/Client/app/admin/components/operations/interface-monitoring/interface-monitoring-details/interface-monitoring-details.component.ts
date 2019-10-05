import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as agGrid from 'ag-grid-community';
import { AtlasTranslationService } from '../../../../../core/services/atlas-translation.service';
import { BaseFormComponent } from '../../../../../shared/components/base-form-component/base-form-component.component';
import { AtlasAgGridParam } from '../../../../../shared/entities/atlas-ag-grid-param.entity';
import { InterfaceMonitoringDetails } from '../../../../../shared/entities/interface-monitoring-details.entity';
import { AgGridService } from '../../../../../shared/services/ag-grid.service';
import { FormConfigurationProviderService } from '../../../../../shared/services/form-configuration-provider.service';
import { AuditService } from '../../../../../shared/services/http-services/audit.service';
import { UiService } from '../../../../../shared/services/ui.service';
import { AgGridButtonComponent } from '../../interface-monitoring/ag-grid-button/ag-grid-button.component';

@Component({
    selector: 'atlas-interface-monitoring-details',
    templateUrl: './interface-monitoring-details.component.html',
    styleUrls: ['./interface-monitoring-details.component.scss'],
})
export class InterfaceMonitoringDetailsComponent extends BaseFormComponent implements OnInit {

    gridApi: agGrid.GridApi;
    gridColumnApi: agGrid.ColumnApi;
    atlasAgGridParam: AtlasAgGridParam;
    interfaceMonitoringDetailsColumnDefs: agGrid.ColDef[];
    interfaceMonitoringDetailsGridOptions: agGrid.GridOptions = {};
    interfaceMonitoringDetailsRowData: InterfaceMonitoringDetails[] = [];
    interfaceName: string = '';
    businessObject: string = '';
    sideNavOpened: boolean = false;
    message: string;
    eventId: number;
    company: string;
    gridContext = {
        componentParent: this,
    };
    disableMessageButton: boolean;

    constructor(protected formConfigurationProvider: FormConfigurationProviderService,
        public gridService: AgGridService,
        protected auditService: AuditService,
        private route: ActivatedRoute,
        protected uiService: UiService,
        private atlasTranslationService: AtlasTranslationService) {
        super(formConfigurationProvider);
        this.atlasAgGridParam = this.gridService.getAgGridParam();
    }

    ngOnInit() {
        this.company = this.route.snapshot.params['company'];
        this.eventId = this.route.snapshot.queryParams['eventId'];
        this.interfaceName = this.route.snapshot.queryParams.interface;
        this.businessObject = this.route.snapshot.queryParams.businessObject;
        this.initializeGridColumns();
        this.getDetailsOfEvent(this.eventId);
        this.disableMessageButton = false;
    }

    onGridReady(params) {
        this.gridApi = this.interfaceMonitoringDetailsGridOptions.api;
        this.gridColumnApi = this.interfaceMonitoringDetailsGridOptions.columnApi;
        this.gridService.sizeColumns(this.interfaceMonitoringDetailsGridOptions);
        this.interfaceMonitoringDetailsGridOptions.columnDefs = this.interfaceMonitoringDetailsColumnDefs;
        this.atlasTranslationService.translateGridOptionsColDefs(this.interfaceMonitoringDetailsGridOptions)
            .subscribe(() => this.gridApi.refreshHeader());
    }

    onGridSizeChanged(params) {
        this.gridColumnApi = params.columnApi;
        this.gridService.sizeColumns(params);
    }

    initializeGridColumns() {
        this.interfaceMonitoringDetailsGridOptions = {
            context: this.gridContext,
        };
        this.interfaceMonitoringDetailsColumnDefs = [
            {
                colId: 'Action',
                field: 'action',
            },
            {
                colId: 'Message',
                field: 'message',
                cellRendererFramework: AgGridButtonComponent,
                cellRendererParams: {
                    context: {
                        componentParent: this,
                    },
                    onButtonClicked: this.methodFromParent.bind(this),
                },
            },
            {
                colId: 'Result Code',
                field: 'resultCode',
            },
            {
                colId: 'Result Message',
                field: 'resultMessage',
            },
            {
                colId: 'Created Date Time',
                field: 'createdDateTime',
                valueFormatter: this.uiService.dateFormatter,
            },
        ];
    }

    getDetailsOfEvent(eventId: number) {
        const getDetailsSubscription = this.auditService.getEventDetails(eventId, this.company).
            subscribe((data) => {
                if (data) {
                    this.interfaceMonitoringDetailsRowData = data.value;
                }
            });
        this.subscriptions.push(getDetailsSubscription);
    }

    methodFromParent(message: string) {
        this.sideNavOpened = true;
        this.message = message;
    }

    onDiscardButtonClick() {
        this.sideNavOpened = false;
    }

    onSideNavSaveButtonClick() {
        this.sideNavOpened = false;
    }
}
