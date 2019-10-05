import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpBaseService } from '../../../shared/services/http-services/http-base.service';
import { ProcessMessage } from '../../entities/process-message.entity';
import { MasterdataService } from '../../../shared/services/http-services/masterdata.service';
import { PreaccountingService } from '../../../shared/services/http-services/preaccounting.service';
import { AgGridService } from '../../../shared/services/ag-grid.service';
import { AtlasAgGridParam } from '../../../shared/entities/atlas-ag-grid-param.entity';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MasterDataProps } from '../../../shared/entities/masterdata-props.entity';
import { MasterData } from '../../../shared/entities/masterdata.entity';
import { ProcessStatus } from '../../../shared/entities/process-status.entity';
import { FormControl } from '@angular/forms';
import { AgContextualMenuAction } from '../../../shared/entities/ag-contextual-menu-action.entity';
import { AgContextualMenuComponent } from '../../../shared/components/ag-contextual-menu/ag-contextual-menu.component';
import { UserListItemViewModel } from '../../../shared/models/user-list-item-view-model';
import { SnackbarService } from '../../../shared/services/snackbar.service';

@Component({
    selector: 'atlas-background-interface-errors',
    templateUrl: './background-interface-errors.component.html',
    styleUrls: ['./background-interface-errors.component.scss']
})
export class BackgroundInterfaceErrorsComponent extends HttpBaseService implements OnInit {

    private readonly accountingDocumentsControllerUrl = 'AccountingDocuments';

    userGridContextualMenuActions: AgContextualMenuAction[];
    userMenuActions: { [key: string]: string } = {
        launchRetry: 'retry',
    };

    processMessageGridRows: ProcessMessage[];
    processMessageGridColumns: any;
    atlasAgGridParam: AtlasAgGridParam;

    dateBegin: Date = new Date();
    dateEnd: Date = new Date();

    formCtrlName: FormControl = new FormControl();
    allProcessName: string[];

    formCtrlStatus: FormControl = new FormControl();
    status: ProcessStatus;
    loadingStatus: boolean = false;
    allStatus: ProcessStatus[] = [];

    masterData: MasterData = new MasterData();

    isFiltered: boolean = false;

    selectedProcessName: string[]
    userName: string;
    statusList: number[];

    constructor(protected http: HttpClient, private snackbarService: SnackbarService, private preaccountingService: PreaccountingService, private masterdataService: MasterdataService, public gridService: AgGridService) {
        super(http);
    }

    ngOnInit() {
        this.atlasAgGridParam = this.gridService.getAgGridParam();
        this.userGridContextualMenuActions = [
            {
                icon: 'settings_backup_restore',
                text: 'Launch Retry',
                action: this.userMenuActions.launchRetry,
            },
        ];
        this.processMessageGridColumns = [
            { headerName: 'Name', field: 'name' },
            { headerName: 'Content', field: 'content' },
            { headerName: 'CreatedDateTime', field: 'createdDateTime' },
            { headerName: 'Status', field: 'status' },
            { headerName: 'Retry', field: 'retry' },
            {
                headerName: '',
                cellRendererFramework: AgContextualMenuComponent,
                cellRendererParams: {
                    context: {
                        componentParent: this,
                    },
                    menuActions: this.userGridContextualMenuActions,

                },
            },
            { headerName: 'Error', field: 'error' }
        ];
        this.initFilterName();
        this.initFilterStatus();
        this.dateBegin.setFullYear(1, 1, 1);
        this.dateEnd.setFullYear(9000, 12, 12);
    }

    handleAction(action: string, message: ProcessMessage) {
        switch (action) {
            case this.userMenuActions.launchRetry:
                if (message) {
                    if (message.messageId) {
                        console.log(message);
                        this.preaccountingService.updateProcessRetry(message.messageId).subscribe(() => {
                            this.snackbarService.informationSnackBar('Process has been reset successfully.');
                            this.loadData();
                        });
                }
                }
                break;
            default: // throw Action not recognized exception
                break;
        }
    }

    initFilterName() {
        this.allProcessName = [
            'AtlasPostingProcessor',
            'AtlasAuditProcessor',
            'AtlasPaymentRequestInterfaceProcessor',
            'AtlasAccountingDocumentProcessor',
            'AtlasAccountingInterfaceProcessor',
            'AtlasRecalculationProcessor'];
        this.formCtrlName.patchValue([]);
    }

    initFilterStatus() {
        this.masterdataService.getMasterData([MasterDataProps.ProcessStatuses]).subscribe((masterData: MasterData) => {
            this.allStatus = masterData.processStatuses;
            this.loadingStatus = true;
        });
    }

    onFilterButtonClicked() {
        this.isFiltered = true;
        this.loadData();
    }

    addDateEnd(type: string, event: MatDatepickerInputEvent<Date>) {
        this.dateEnd = event.value;
    }

    addDateBegin(type: string, event: MatDatepickerInputEvent<Date>) {
        this.dateBegin = event.value;
    }

    loadData() {
        if (!this.formCtrlStatus.value) {
            this.statusList = this.allStatus.map((option) => option.enumEntityId);
        } else {
            this.statusList = this.formCtrlStatus.value.map((option) => option.enumEntityId);
        }
        if (!this.formCtrlName.value || this.formCtrlName.value.length ==0){
            this.selectedProcessName = this.allProcessName;
        } else {
            this.selectedProcessName = this.formCtrlName.value;
        }

        this.preaccountingService.getErrorMessages(this.selectedProcessName, this.statusList, this.dateBegin, this.dateEnd, this.userName).subscribe((data) => {
            if (data) {
                this.processMessageGridRows = data;
            }
        });
    }
}
