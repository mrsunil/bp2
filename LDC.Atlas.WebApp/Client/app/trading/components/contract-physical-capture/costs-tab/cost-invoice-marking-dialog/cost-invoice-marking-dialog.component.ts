import { Component, HostListener, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatSlideToggleChange } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import * as agGrid from 'ag-grid-community';
import { AuthorizationService } from '../../../../../core/services/authorization.service';
import { AgContextualMenuComponent } from '../../../../../shared/components/ag-contextual-menu/ag-contextual-menu.component';
import { BaseFormComponent } from '../../../../../shared/components/base-form-component/base-form-component.component';
import { CellEditorDatePickerComponent } from '../../../../../shared/components/cell-editor-date-picker/cell-editor-date-picker.component';
import { CellEditorNumericComponent } from '../../../../../shared/components/cell-editor-numeric/cell-editor-numeric.component';
import { CellEditorSelectComponent } from '../../../../../shared/components/cell-editor-select/cell-editor-select.component';
import { ConfirmationDialogComponent } from '../../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { InvoiceMarkingSearchResult } from '../../../../../shared/dtos/invoice-marking';
import { AgContextualMenuAction } from '../../../../../shared/entities/ag-contextual-menu-action.entity';
import { AtlasAgGridParam } from '../../../../../shared/entities/atlas-ag-grid-param.entity';
import { InvoiceMarkings, InvoiceMarkingPercentLines } from '../../../../../shared/entities/invoice-markings.entity';
import { MasterData } from '../../../../../shared/entities/masterdata.entity';
import { PermissionLevels } from '../../../../../shared/enums/permission-level.enum';
import { PostingStatus } from '../../../../../shared/enums/posting-status.enum';
import { SectionCompleteDisplayView } from '../../../../../shared/models/section-complete-display-view';
import { CustomNumberMask } from '../../../../../shared/numberMask';
import { AgGridService } from '../../../../../shared/services/ag-grid.service';
import { UserCompanyPrivilegeDto } from '../../../../../shared/services/authorization/dtos/user-company-privilege';
import { ApiPaginatedCollection } from '../../../../../shared/services/common/models';
import { FormConfigurationProviderService } from '../../../../../shared/services/form-configuration-provider.service';
import { ExecutionService } from '../../../../../shared/services/http-services/execution.service';
import { SnackbarService } from '../../../../../shared/services/snackbar.service';
import { UiService } from '../../../../../shared/services/ui.service';
import { UtilService } from '../../../../../shared/services/util.service';
import { Route } from '@angular/compiler/src/core';

@Component({
    selector: 'atlas-cost-invoice-marking-dialog',
    templateUrl: './cost-invoice-marking-dialog.component.html',
    styleUrls: ['./cost-invoice-marking-dialog.component.scss'],
})
export class CostInvoiceMarkingDialogComponent extends BaseFormComponent implements OnInit {

    invoiceMarkingGridOptions: agGrid.GridOptions = {};
    invoicemarkingcolumnDefs: agGrid.ColDef[];
    isLoading: boolean;
    isEditable = false;
    toggleText: string = 'Inactive';
    defaultDate = 'Mon Jan 01 0001';
    gridApi: agGrid.GridApi;
    gridColumnApi: agGrid.ColumnApi;
    atlasAgGridParam: AtlasAgGridParam;
    invoiceMarkingGridRows: InvoiceMarkingSearchResult[];
    deleted: string = 'Deleted';
    saveInProgress = false;
    totalInvoicePercent: number;
    totalInvoiceTemp: number;
    count: number = 0;
    saveDisable: boolean = true;
    dataVersionId?: number;
    dialogData: {
        masterdata: MasterData,
        costId: number,
        model: SectionCompleteDisplayView,
        company: string,
        dataVersionId?: number,
    };
    gridComponents = {
        atlasSelect: CellEditorSelectComponent,
        atlasNumeric: CellEditorNumericComponent,
        atrDate: CellEditorDatePickerComponent,
    };
    invoiceMarkingCostGridContextualMenuActions: AgContextualMenuAction[];
    invoiceMarkingCostMenuActions: { [key: string]: string } = {
        deleteinvoiceMarkingCost: 'delete',
    };
    gridContext = {
        gridEditable: false,
    };
    editPrivileges = {
        buttonEditable: true,
    };

    constructor(public thisDialogRef: MatDialogRef<CostInvoiceMarkingDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: {
            masterdata: MasterData, costId: number,
            model: SectionCompleteDisplayView, company: string, dataVersionId?: number,
        },
        protected utilService: UtilService,
        private executionService: ExecutionService,
        private authorizationService: AuthorizationService,
        protected formConfigurationProvider: FormConfigurationProviderService,
        protected uiService: UiService,
        protected dialog: MatDialog,
        protected snackbarService: SnackbarService,
        protected router: Router,
        public gridService: AgGridService,
        private route: ActivatedRoute,

    ) {
        super(formConfigurationProvider);
        this.dialogData = data;
        this.atlasAgGridParam = this.gridService.getAgGridParam();
        this.isLoading = true;
        thisDialogRef.disableClose = true;
    }

    editEstimatedColumnsPrivilege: UserCompanyPrivilegeDto = {
        profileId: null,
        privilegeName: 'InvoiceMarkingGridEdit',
        permission: PermissionLevels.ReadWrite,
        privilegeParentLevelOne: 'Physicals',
        privilegeParentLevelTwo: 'Trades',
    };

    onGridReady(params) {
        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;
    }

    ngOnInit() {
        this.initializeGridColumns();
        this.getInvoiceMarkingsForCost();
        this.gridContext.gridEditable = false;
        this.dataVersionId = this.route.snapshot.paramMap.get('dataVersionId') ?
            Number(this.route.snapshot.paramMap.get('dataVersionId')) : null;
        this.editPrivileges.buttonEditable = this.checkIfUserHasRequiredPrivileges(this.editEstimatedColumnsPrivilege);
        this.init();
    }
    init() {
        this.invoiceMarkingCostGridContextualMenuActions = [
            {
                icon: 'delete',
                text: 'Delete',
                action: this.invoiceMarkingCostMenuActions.deleteinvoiceMarkingCost,
                disabled: this.isDeleteDisabled.bind(this),
            },
        ];
    }

    isDeleteDisabled(params) {
        if (this.authorizationService.isUserAllowedForCompany(this.dialogData.company)) {
            const userPermissionLevel = this.authorizationService.getPermissionLevel(
                this.dialogData.company,
                'DeleteCostInvoiceMarking',
                'InvoiceCreation',
                'Invoices');
            if (userPermissionLevel >= PermissionLevels.Read) {
                return false;
            }
        }
        return true;
    }

    @HostListener('window:beforeunload', ['$event']) unloadNotification($event: any) {
        if (this.formGroup.dirty) {
            $event.returnValue = true;
        }
    }

    onAddRowButtonClicked() {
        const newItem = this.createNewRowData();
        this.gridApi.updateRowData({ add: [newItem], addIndex: 0 });
    }

    createNewRowData() {
        const newData = new InvoiceMarkings();
        newData.contractReference = this.dialogData.model.reference;
        newData.invoicePercent = 100;
        return newData;
    }

    getGridData(): InvoiceMarkings[] {
        const invoices = new Array<InvoiceMarkings>();
        this.gridApi.forEachNode((rowData) => {
            if (rowData.data.isDirty) {
                rowData.data.sectionId = this.dialogData.model.sectionId;
                rowData.data.costId = this.dialogData.costId;
                invoices.push(rowData.data);
            }
        });
        return invoices;
    }

    getInvoiceMarkingsForCost() {
        this.subscriptions.push(
            this.executionService.getInvoiceMarkingsForCost(this.dialogData.costId, this.dialogData.dataVersionId)
                .subscribe((data: ApiPaginatedCollection<InvoiceMarkingSearchResult>) => {
                    this.invoiceMarkingGridRows = data.value;
                    for (const rows of this.invoiceMarkingGridRows) {
                        var invoiceMarkingCostGridRows = [];
                        invoiceMarkingCostGridRows = data.value;
                        this.getTotalInvoicePercentValue(invoiceMarkingCostGridRows)
                        if (rows.cashMatchDate) {
                            rows.cashMatchDate = (rows.cashMatchDate.toDateString() === this.defaultDate) ? null : rows.cashMatchDate;
                        }
                        if (rows.dueDate) {
                            rows.dueDate = (rows.dueDate.toDateString() === this.defaultDate) ? null : rows.dueDate;
                        }
                        rows.invoiceDate = (rows.invoiceDate.toDateString() === this.defaultDate) ? null : rows.invoiceDate;
                        rows.invoiceReference = rows.isDeleted ? this.deleted : rows.invoiceReference;
                    }
                    this.initializeGridColumns();
                    this.isLoading = false;
                }));
    }


    getTotalInvoicePercentValue(invoiceMarkingCostGridRows: InvoiceMarkingSearchResult[]) {
        this.totalInvoicePercent = 0;
        if (invoiceMarkingCostGridRows) {
            invoiceMarkingCostGridRows.forEach((invoiceMarking) => {
                this.totalInvoicePercent += invoiceMarking.invoicePercent;
            });
        }
    }

    initializeGridColumns() {
        this.invoiceMarkingGridOptions = {
            context: this.gridContext,
            rowSelection: 'multiple',
        };

        this.invoicemarkingcolumnDefs = [
            {
                colId: 'invoiceMarkingId',
                field: 'invoiceMarkingId',
                hide: true,
            },
            {
                headerName: 'Contract Reference',
                colId: 'contractReference',
                field: 'contractReference',
            },
            {
                headerName: 'Cost Type',
                colId: 'costType',
                field: 'costType',
                cellEditor: 'agRichSelectCellEditor',
                cellEditorParams: {
                    values: this.dialogData.masterdata.costTypes.map((costTypes) => costTypes.costTypeCode),
                },
            },
            {
                headerName: 'Invoice Reference',
                colId: 'invoiceReference',
                field: 'invoiceReference',
            },
            {
                headerName: 'Invoice Date',
                colId: 'invoiceDate',
                field: 'invoiceDate',
                valueFormatter: this.uiService.dateFormatter,
                cellEditor: 'atrDate',
            },
            {
                headerName: 'Currency',
                colId: 'currencyCode',
                field: 'currencyCode',
                cellEditor: 'agRichSelectCellEditor',
                cellEditorParams: {
                    values: this.dialogData.masterdata.currencies.map((currencies) => currencies.currencyCode),
                },
            },
            {
                headerName: 'Value',
                colId: 'invoiceAmount',
                field: 'invoiceAmount',
                cellEditor: 'atlasNumeric',
                cellEditorParams: {
                    displayMask: CustomNumberMask(12, 10, false),
                    isRightAligned: false
                },
            },
            {
                headerName: 'Percentage Invoiced',
                colId: 'invoicePercent',
                field: 'invoicePercent',
                cellEditor: 'atlasNumeric',
                editable: this.isPercentageInvoiceEditable.bind(this),
                type: 'numberColumn',
                onCellValueChanged: this.onPercentageInvoiceChange.bind(this),
                cellEditorParams: {
                    displayMask: CustomNumberMask(12, 10, false),
                    isRightAligned: false,
                },
                tooltip: () => {
                    return 'Percentage Invoiced should not be more than 100';
                },
            },
            {
                headerName: 'Paid Percentage',
                colId: 'paidPercentage',
                field: 'paidPercentage',
                type: 'numericColumn',
            },
            {
                headerName: 'Cash Match Date',
                colId: 'cashMatchDate',
                field: 'cashMatchDate',
                valueFormatter: this.uiService.dateFormatter,
            },
            {
                headerName: 'Posting Status',
                colId: 'postingStatusId',
                field: 'postingStatusId',
                valueFormatter: this.postingStatusFormatter.bind(this),
            },
            {
                headerName: '',
                cellRendererFramework: AgContextualMenuComponent,
                cellRendererParams: {
                    context: {
                        componentParent: this,
                        actionContext: this.gridContext,
                    },
                    menuActions: this.invoiceMarkingCostGridContextualMenuActions,
                },
                cellClass: 'ag-contextual-menu',
                maxWidth: 80,
            },
        ];
    }

    isGridEditable(params): boolean {
        return params.context.gridEditable;
    }
    onPercentageInvoiceChange(params) {
        if (this.count == 0) {
            this.totalInvoiceTemp = this.totalInvoicePercent;
            this.count++;
        }
        let totalInvoicevalue = this.totalInvoiceTemp + params.newValue - params.oldValue
        if (this.totalInvoicePercent == totalInvoicevalue) {
            this.saveDisable = false;
        } else {
            this.saveDisable = true;
            this.totalInvoiceTemp = totalInvoicevalue;
            this.snackbarService.informationSnackBar('The total sum of Invoice percentage does not matches with actual invoice percentage');
        }
    }

    onSaveAsInvoieMarkingDialogButtonClicked() {
        const invoiceMarkingPercentLines: InvoiceMarkingPercentLines[] = this.getInvoiceMarkingPercentLines();
        this.subscriptions.push(
            this.executionService.updateInvoiceMarkingLines(invoiceMarkingPercentLines, this.dataVersionId)
                .subscribe(() => {
                    this.thisDialogRef.close(true);
                    this.snackbarService.informationSnackBar('Cost invoice marking Percent updated successfully');
                }));
    }

    getInvoiceMarkingPercentLines(): InvoiceMarkingPercentLines[] {
        const invoicePercentLines: InvoiceMarkingPercentLines[] = [];
        this.invoiceMarkingGridRows.map((data) => {
            if (data) {
                const invoicePercentLine = new InvoiceMarkingPercentLines();
                invoicePercentLine.invoicePercent = data.invoicePercent;
                invoicePercentLine.invoiceLineId = data.invoiceLineId;
                invoicePercentLines.push(invoicePercentLine);
            }
        });
        return invoicePercentLines;
    }

    postingStatusFormatter(params) {
        if (params.value) {
            return PostingStatus[params.value].toString();
        }
        return '';
    }

    isPercentageInvoiceEditable(params): boolean {
        if (this.isEditable) {
            return params.context.gridEditable;
        }
        else {
            return !(params.context.gridEditable);
        }
    }

    onCellValueChanged(params) {
        if (params.oldValue !== params.newValue) {
            params.node.data.isDirty = true;
        }
        if (params.node.data.invoicePercent > 100) {
            params.node.setDataValue('invoicePercent', null);
        }
    }

    onChange(value: MatSlideToggleChange) {
        if (value.checked) {
            this.toggleText = 'Active';
            this.isEditable = true;
            this.gridContext.gridEditable = true;

        } else {
            this.toggleText = 'InActive';
            this.isEditable = false;
            this.gridContext.gridEditable = false;
        }
        this.initializeGridColumns();
    }

    onCloseButtonClicked() {
        this.thisDialogRef.close(true);
    }

    checkIfUserHasRequiredPrivileges(userCompanyPrivilege: UserCompanyPrivilegeDto) {
        const userPermissionLevel = this.authorizationService.getPermissionLevel(
            this.dialogData.company,
            userCompanyPrivilege.privilegeName,
            userCompanyPrivilege.privilegeParentLevelOne,
            userCompanyPrivilege.privilegeParentLevelTwo);
        if (userPermissionLevel >= userCompanyPrivilege.permission) {
            return true;
        }
    }

    handleAction(action: string, invoiceMarkings: InvoiceMarkings) {
        switch (action) {
            case this.invoiceMarkingCostMenuActions.deleteinvoiceMarkingCost:
                this.onRemoveSelectedButtonClicked(invoiceMarkings);
                break;
            default:
                break;
        }

    }

    onRemoveSelectedButtonClicked(invoiceMarkings: InvoiceMarkings) {
        if (invoiceMarkings.invoiceMarkingId) {
            const confirmDialog = this.dialog.open(ConfirmationDialogComponent, {
                data: {
                    title: 'Invoice Marking Cost Deletion',
                    text: 'Deleting a Invoice Marking Cost row is permanent. Do you wish to proceed?',
                    okButton: 'Delete anyway',
                    cancelButton: 'Cancel',
                },
            });

            confirmDialog.afterClosed().subscribe((answer) => {
                if (answer) {
                    if (invoiceMarkings.invoiceMarkingId) {
                        this.subscriptions.push(
                            this.executionService.deleteInvoiceMarking(invoiceMarkings.invoiceMarkingId).subscribe(() => {
                                this.snackbarService.informationSnackBar('Invoice Marking Cost Deleted');
                                this.gridApi.updateRowData({ remove: [invoiceMarkings] });
                            }));
                    } else {
                        this.gridApi.updateRowData({ remove: [invoiceMarkings] });
                    }
                }
            });
        } else {
            this.snackbarService.informationSnackBar('Please select a row to delete');
        }
    }

    onCostInvoiceMarkingRowClicked(event) {
        if (!this.isEditable) {
            this.thisDialogRef.close(true);
            this.router.navigate(
                ['/' + this.dialogData.company +
                    '/financial/accounting/entries/' + encodeURIComponent(event.data.invoiceReference)],
            );
        }

    }

}
