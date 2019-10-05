import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import * as agGrid from 'ag-grid-community';
import { concatMap } from 'rxjs/operators';
import { AtlasTranslationService } from '../../../../../../core/services/atlas-translation.service';
import { AuthorizationService } from '../../../../../../core/services/authorization.service';
import { AgContextualMenuComponent } from '../../../../../../shared/components/ag-contextual-menu/ag-contextual-menu.component';
import { AgGridCheckboxComponent } from '../../../../../../shared/components/ag-grid-checkbox/ag-grid-checkbox.component';
import { AgGridUserPreferencesComponent } from '../../../../../../shared/components/ag-grid-user-preferences/ag-grid-user-preferences.component';
import { BaseFormComponent } from '../../../../../../shared/components/base-form-component/base-form-component.component';
import { CellEditorDatePickerComponent } from '../../../../../../shared/components/cell-editor-date-picker/cell-editor-date-picker.component';
import { CellEditorNumericComponent } from '../../../../../../shared/components/cell-editor-numeric/cell-editor-numeric.component';
import { CellEditorSelectComponent } from '../../../../../../shared/components/cell-editor-select/cell-editor-select.component';
import { ConfirmationDialogComponent } from '../../../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { InvoiceMarkingSearchResult } from '../../../../../../shared/dtos/invoice-marking';
import { AgContextualMenuAction } from '../../../../../../shared/entities/ag-contextual-menu-action.entity';
import { AtlasAgGridParam } from '../../../../../../shared/entities/atlas-ag-grid-param.entity';
import { InvoiceMarkings } from '../../../../../../shared/entities/invoice-markings.entity';
import { MasterData } from '../../../../../../shared/entities/masterdata.entity';
import { UserGridPreferencesParameters } from '../../../../../../shared/entities/user-grid-preferences-parameters.entity';
import { InvoiceTypes } from '../../../../../../shared/enums/invoice-type.enum';
import { PostingStatus } from '../../../../../../shared/enums/posting-status.enum';
import { ViewDocumentType } from '../../../../../../shared/enums/view-document-type.enum';
import { ViewModeBehaviour } from '../../../../../../shared/enums/view-mode-behaviour.enum';
import { SectionCompleteDisplayView } from '../../../../../../shared/models/section-complete-display-view';
import { CustomNumberMask } from '../../../../../../shared/numberMask';
import { AgGridService } from '../../../../../../shared/services/ag-grid.service';
import { ApiPaginatedCollection } from '../../../../../../shared/services/common/models';
import { FormConfigurationProviderService } from '../../../../../../shared/services/form-configuration-provider.service';
import { GridConfigurationProviderService } from '../../../../../../shared/services/grid-configuration-provider.service';
import { ExecutionService } from '../../../../../../shared/services/http-services/execution.service';
import { SecurityService } from '../../../../../../shared/services/security.service';
import { SnackbarService } from '../../../../../../shared/services/snackbar.service';
import { UiService } from '../../../../../../shared/services/ui.service';
import { UtilService } from '../../../../../../shared/services/util.service';
import { PhysicalFixedPricedContract } from '../../../../../entities/physical-fixed-priced-contract.entity';
import { PermissionLevels } from './../../../../../../shared/enums/permission-level.enum';

@Component({
    selector: 'atlas-detailed-view',
    templateUrl: './detailed-view.component.html',
    styleUrls: ['./detailed-view.component.scss'],
    providers: [DatePipe],
})
export class DetailedViewComponent extends BaseFormComponent implements OnInit, OnChanges {
    @ViewChild('userPreferences') userPreferencesComponent: AgGridUserPreferencesComponent;
    @Output() readonly setCashMatchDate = new EventEmitter<any>();

    translationKeyPrefix: string = 'TRADING.TRADE_CAPTURE.INVOICE_MARKING_TAB.DETAILED_VIEW.';

    deleteStringKey: string = this.translationKeyPrefix + 'DELETE';
    invoiceMarkingDeletionStringKey: string = this.translationKeyPrefix + 'INVOICE_MARKING_DELETION';
    irreversibleDeletionStringKey: string = this.translationKeyPrefix + 'IRREVERSIBLE_DELETION';
    deleteAnywayStringKey: string = this.translationKeyPrefix + 'DELETE_ANYWAY';
    cancelStringKey: string = this.translationKeyPrefix + 'CANCEL';
    rowDeletedStringKey: string = this.translationKeyPrefix + 'ROW_DELETED';
    toDeleteSelectionStringKey: string = this.translationKeyPrefix + 'TO_DELETE_SELECTION';
    warningNullQuantityStringKey: string = this.translationKeyPrefix + 'WARNING_NULL_QUANTITY';
    warningInvoicePercantageTooHighStringKey: string = this.translationKeyPrefix + 'WARNING_INVOICE_PERCENTAGE_TOO_HIGH';
    warningPaidPercentageTooHighStringKey: string = this.translationKeyPrefix + 'WARNING_PAID_PERCENTAGE_TOO_HIGH';

    // ressource map => keys = translation keys | values = translations in the current application language
    translationRessourceMap: Map<string, string> = new Map([
        [this.deleteStringKey, ''],
        [this.invoiceMarkingDeletionStringKey, ''],
        [this.irreversibleDeletionStringKey, ''],
        [this.deleteAnywayStringKey, ''],
        [this.cancelStringKey, ''],
        [this.rowDeletedStringKey, ''],
        [this.toDeleteSelectionStringKey, ''],
        [this.warningNullQuantityStringKey, ''],
        [this.warningInvoicePercantageTooHighStringKey, ''],
        [this.warningPaidPercentageTooHighStringKey, ''],
    ]);

    invoiceMarkingGridOptions: agGrid.GridOptions = {};
    invoicemarkingcolumnDefs: agGrid.ColDef[];
    invoiceMarkingGridRows: InvoiceMarkingSearchResult[];
    isLoading: boolean;
    sectionId?: number;
    gridApi: agGrid.GridApi;
    gridColumnApi: agGrid.ColumnApi;
    atlasAgGridParam: AtlasAgGridParam;
    totalQuantityPercent: number;
    totalInvoiceValue: number;
    totalInvoiceValuePercent: number;
    tradeRecord: SectionCompleteDisplayView;
    defaultDate = 'Mon Jan 01 0001';
    viewModeFilter: string;
    quantityCellEdited = false;
    invoiceAmountCellEdited = false;
    deleted: string = 'Deleted';
    isDeleted: boolean = false;
    invoiceMarkingToBeMatched: string;
    documentTypeFilter: string;
    invoiceStatusId: number;
    childFlag: number = 0;
    company: string;
    decimalOptionValue: number = 2;
    formatType: string = 'en-US';
    dataVersionId: number;
    @Input() documentType: string;
    @Input() isEditToggle: boolean;
    @Output() readonly totalValuesCalculated = new EventEmitter<any>();
    invoiceMarkingMenuActions: { [key: string]: string } = {
        deleteinvoiceMarking: 'delete',
    };
    invoiceMarkingGridContextualMenuActions: AgContextualMenuAction[];
    masterdata: MasterData = new MasterData();
    userActiveDirectoryName: string;

    hasGridSharing: boolean = false;
    componentId: string = 'invoiceMarkingsInContract';
    gridContext = {
        editMode: false,
    };

    gridComponents = {
        atlasSelect: CellEditorSelectComponent,
        atlasNumeric: CellEditorNumericComponent,
        atrDate: CellEditorDatePickerComponent,
        atlasCheckbox: AgGridCheckboxComponent,
    };

    gridPreferences: UserGridPreferencesParameters;

    constructor(private route: ActivatedRoute, protected formBuilder: FormBuilder,
        protected utilService: UtilService,
        private executionService: ExecutionService,
        protected formConfigurationProvider: FormConfigurationProviderService,
        protected uiService: UiService,
        protected dialog: MatDialog,
        protected snackbarService: SnackbarService,
        protected router: Router,
        private authorizationService: AuthorizationService,
        private datePipe: DatePipe,
        public gridService: AgGridService,
        private securityService: SecurityService,
        private gridConfigurationProvider: GridConfigurationProviderService,
        private atlasTranslationService: AtlasTranslationService,

    ) {
        super(formConfigurationProvider);
        this.atlasAgGridParam = this.gridService.getAgGridParam();
        this.isLoading = true;
        this.userActiveDirectoryName = this.authorizationService.getCurrentUser().samAccountName;
    }

    ngOnInit() {
        this.atlasTranslationService.getTranslatedRessourceMap(this.translationRessourceMap);
        this.invoiceMarkingGridContextualMenuActions = [
            {
                icon: 'delete',
                text: this.translationRessourceMap[this.deleteStringKey],
                action: this.invoiceMarkingMenuActions.deleteInvoiceMarking,
                disabled: this.isDeleteDisabled.bind(this),
            },
        ];
        this.sectionId = Number(this.route.snapshot.paramMap.get('sectionId'));
        this.company = this.route.snapshot.paramMap.get('company');
        this.masterdata = this.route.snapshot.data['masterdata'] as MasterData;
        this.dataVersionId = this.route.snapshot.params['dataVersionId'] ? Number(this.route.snapshot.params['dataVersionId']) : null;
        this.bindConfiguration();
        this.getInvoiceDetailsBySection(this.childFlag);
        this.initializeGridColumns();
        this.init();
    }

    initForm(entity: any, isEdit: boolean) {
        this.tradeRecord = new SectionCompleteDisplayView(entity);
        this.gridContext.editMode = false;
        this.calculateTotalValue();
    }

    onGridReady(params) {
        this.gridApi = this.invoiceMarkingGridOptions.api;
        this.gridColumnApi = this.invoiceMarkingGridOptions.columnApi;
        this.gridService.sizeColumns(this.invoiceMarkingGridOptions);
        this.invoiceMarkingGridOptions.columnDefs = this.invoicemarkingcolumnDefs;
        this.atlasTranslationService.translateGridOptionsColDefs(this.invoiceMarkingGridOptions)
            .subscribe(() => this.gridApi.refreshHeader());
    }

    onGridSizeChanged(params) {
        this.gridColumnApi = params.columnApi;
        this.gridService.sizeColumns(params);
    }

    onTabActive() {
        this.gridService.sizeColumns(this.invoiceMarkingGridOptions);
    }

    toInvoiceMarking(rawData: InvoiceMarkingSearchResult): InvoiceMarkings {
        const invoiceMarking: InvoiceMarkings = {
            cashMatchDate: rawData.cashMatchDate,
            companyId: this.company,
            contractReference: rawData.contractReference,
            costType: rawData.costType,
            currencyCode: rawData.currencyCode,
            customerReference: rawData.customerReference,
            documentType: rawData.documentType,
            dueDate: rawData.dueDate,
            invoiceAmount: rawData.invoiceAmount,
            invoiceDate: rawData.invoiceDate,
            invoiceLineId: rawData.invoiceLineId,
            invoiceMarkingId: rawData.invoiceMarkingId,
            invoicePercent: rawData.invoicePercent,
            costId: null,
            contractValue: 0, // not used here, but should not be null
            invoiceReference: rawData.invoiceReference,
            paidAmount: null,
            paidPercentage: rawData.paidPercentage,
            paymentTermCode: rawData.paymentTermCode,
            postingStatusId: rawData.postingStatusId,
            price: rawData.price,
            quantity: rawData.invoicedQuantity,
            remainingAmount: null,
            sectionId: rawData.sectionId,
            sectionType: rawData.sectionType,
        };

        return invoiceMarking;
    }

    getGridData(): InvoiceMarkings[] {
        const invoices = new Array<InvoiceMarkings>();
        this.gridApi.forEachNode((rowData) => {
            if (rowData.data.sectionId) {
                rowData.data.sectionId = this.sectionId;
                invoices.push(this.toInvoiceMarking(rowData.data));
            }
        });
        return invoices;
    }

    handleAction(action: string, invoiceMarkings: InvoiceMarkings) {
        switch (action) {
            case this.invoiceMarkingMenuActions.deleteInvoiceMarking:
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
                    title: this.translationRessourceMap[this.invoiceMarkingDeletionStringKey],
                    text: this.translationRessourceMap[this.irreversibleDeletionStringKey],
                    okButton: this.translationRessourceMap[this.deleteAnywayStringKey],
                    cancelButton: this.translationRessourceMap[this.cancelStringKey],
                },
            });

            confirmDialog.afterClosed().subscribe((answer) => {
                if (answer) {
                    if (invoiceMarkings.invoiceMarkingId) {
                        this.subscriptions.push(
                            this.executionService.deleteInvoiceMarking(invoiceMarkings.invoiceMarkingId).subscribe(() => {
                                this.snackbarService.informationSnackBar(this.translationRessourceMap[this.rowDeletedStringKey]);
                                this.gridApi.updateRowData({ remove: [invoiceMarkings] });
                            }));
                    } else {
                        this.gridApi.updateRowData({ remove: [invoiceMarkings] });
                    }
                    this.calculateTotalValue();
                }
            });
        } else {
            this.snackbarService.informationSnackBar(this.translationRessourceMap[this.toDeleteSelectionStringKey]);
        }
    }

    createNewRowData() {
        const newData = new InvoiceMarkings();
        newData.contractReference = this.tradeRecord.reference;
        return newData;
    }

    populateEntity(entity: any): any {
        const physicalFixedPricedContract = entity as PhysicalFixedPricedContract;
        this.securityService.isSecurityReady().pipe(
            concatMap(() => {
                return this.gridConfigurationProvider.getConfiguration(this.company, this.componentId);
            }),
        ).subscribe((configuration) => {
            this.hasGridSharing = configuration.hasMultipleViewsPerUser;
            physicalFixedPricedContract.invoices = this.getGridData();

            this.gridPreferences = {
                company: this.company,
                gridId: this.componentId,
                gridOptions: this.invoiceMarkingGridOptions,
                sharingEnabled: this.hasGridSharing,
            };
            this.gridPreferences = new UserGridPreferencesParameters(this.gridPreferences);
        });

        return physicalFixedPricedContract;
    }

    isDateNull(date: Date): boolean {
        return !date || date.toDateString() === this.defaultDate;
    }

    getInvoiceDetailsBySection(childFlag: any) {
        this.childFlag = childFlag;
        this.subscriptions.push(
            this.executionService.getInvoiceDetailsBySection(this.sectionId, this.childFlag, this.dataVersionId)
                .subscribe((data: ApiPaginatedCollection<InvoiceMarkingSearchResult>) => {
                    this.invoiceMarkingGridRows = this.getDocumentTypeForGrid(data.value);
                    for (const rows of this.invoiceMarkingGridRows) {
                        rows.cashMatchDate = this.isDateNull(rows.cashMatchDate) ? null : rows.cashMatchDate;
                        if (rows.cashMatchDate) {
                            this.setCashMatchDate.emit(rows.cashMatchDate.toDateString());
                        }
                        rows.dueDate = this.isDateNull(rows.dueDate) ? null : rows.dueDate;
                        rows.invoiceDate = this.isDateNull(rows.invoiceDate) ? null : rows.invoiceDate;
                        rows.invoiceReference = rows.isDeleted ? this.deleted : rows.invoiceReference;
                        if (rows.isDeleted) {
                            this.isDeleted = true;
                        }
                        this.invoiceStatusId = rows.invoicingStatusId;
                    }
                    this.calculateTotalValue();
                    this.isLoading = false;
                }));
    }

    postingStatusFormatter(params) {
        if (params.value) {
            return PostingStatus[params.value].toString();
        }
        return '';
    }

    onQuantityValueChanged(params) {
        if (params.data.quantity) {
            this.quantityCellEdited = true;
            this.calculateTotalValue();
        }
    }

    onInvoiceValueChanged(params) {
        if (params.data.invoiceAmount) {
            this.invoiceAmountCellEdited = true;
            this.calculateTotalValue();
        }
    }

    init() {
        this.invoiceMarkingGridContextualMenuActions = [
            {
                icon: 'delete',
                text: this.translationRessourceMap[this.deleteStringKey],
                action: this.invoiceMarkingMenuActions.deleteInvoiceMarking,
                disabled: this.isDeleteDisabled,
            },
        ];

    }

    isDeleteDisabled(params) {
        if (this.authorizationService.isUserAllowedForCompany(this.company)) {
            const userPermissionLevel = this.authorizationService.getPermissionLevel(
                this.company,
                'DeleteInvoiceMarking',
                'InvoiceCreation',
                'Invoices');
            if (userPermissionLevel >= PermissionLevels.Read) {
                return false;
            }
        }

        return true;
    }

    initializeGridColumns() {
        this.invoiceMarkingGridOptions = {
            context: this.gridContext,
            rowSelection: 'single',
        };

        this.invoicemarkingcolumnDefs = [
            {
                headerName: 'Section Id',
                colId: this.translationKeyPrefix + 'SECTION_ID',
                field: 'sectionId',
                hide: true,
            },
            {
                headerName: 'Contract Reference',
                colId: this.translationKeyPrefix + 'CONTRACT_REFERENCE',
                field: 'contractReference',
                minWidth: 150,
                maxWidth: 150,
            },

            {
                headerName: 'Invoice Reference',
                colId: this.translationKeyPrefix + 'INVOICE_REFERENCE',
                field: 'invoiceReference',
            },
            {
                headerName: 'Invoice Date',
                colId: this.translationKeyPrefix + 'INVOICE_DATE',
                field: 'invoiceDate',
                valueFormatter: this.uiService.dateFormatter,
                cellEditor: 'atrDate',
            },
            {
                headerName: 'Posting Status',
                colId: this.translationKeyPrefix + 'POSTING_STATUS',
                field: 'postingStatusId',
                valueFormatter: this.postingStatusFormatter.bind(this),
            },
            {
                headerName: 'Invoice Quantity',
                colId: this.translationKeyPrefix + 'INVOICE_QUANTITY',
                field: 'invoicedQuantity',
                type: 'numericColumn',
                cellEditor: 'atlasNumeric',
                valueFormatter: (params) => (this.decimalFormatter(
                    (!params.node.group ? params.data.invoicedQuantity : params.value),
                    this.decimalOptionValue,
                    this.formatType)),
                cellEditorParams: {
                    displayMask: CustomNumberMask(12, 10, false),
                    isRightAligned: false,
                },
                tooltip: () => {
                    return this.translationRessourceMap[this.warningNullQuantityStringKey];
                },
                onCellValueChanged: this.onQuantityValueChanged.bind(this),
            },
            {
                headerName: 'Currency',
                colId: this.translationKeyPrefix + 'CURRENCY',
                field: 'currencyCode',
                cellEditor: 'agRichSelectCellEditor',
                cellEditorParams: {
                    values: this.masterdata.currencies.map((currencies) => currencies.currencyCode),
                },
            },
            {
                headerName: 'Invoice Value',
                colId: this.translationKeyPrefix + 'INVOICE_VALUE',
                field: 'invoiceAmount',
                type: 'numericColumn',
                cellEditor: 'atlasNumeric',
                valueFormatter: (params) => (this.decimalFormatter(
                    (!params.node.group ? params.data.invoiceAmount : params.value),
                    this.decimalOptionValue,
                    this.formatType)),
                cellEditorParams: {
                    displayMask: CustomNumberMask(12, 10, false),
                    isRightAligned: false,
                },
                onCellValueChanged: this.onInvoiceValueChanged.bind(this),
            },
            {
                headerName: 'Percentage Invoice',
                colId: this.translationKeyPrefix + 'PERCENTAGE_INVOICE',
                field: 'invoicePercent',
                type: 'numericColumn',
                cellEditor: 'atlasNumeric',
                cellEditorParams: {
                    displayMask: CustomNumberMask(3, 3, false),
                    isRightAligned: false,
                },
                tooltip: () => {
                    return this.translationRessourceMap[this.warningInvoicePercantageTooHighStringKey];
                },
            },
            {
                headerName: 'Document Type',
                colId: this.translationKeyPrefix + 'DOC_TYPE',
                field: 'documentType',
            },
            {
                headerName: 'Due Date',
                colId: this.translationKeyPrefix + 'DUE_DATE',
                field: 'dueDate',
                valueFormatter: this.uiService.dateFormatter,
                cellEditor: 'atrDate',
            },
            {
                headerName: 'Payment Terms',
                colId: this.translationKeyPrefix + 'PAYMENT_TERMS',
                field: 'paymentTermCode',
                cellEditor: 'agRichSelectCellEditor',
                cellEditorParams: {
                    values: this.masterdata.paymentTerms.map((paymentTerms) => paymentTerms.paymentTermCode),
                },
            },
            {
                headerName: 'Customer Reference',
                colId: this.translationKeyPrefix + 'CUSTOMER_REF',
                field: 'customerReference',
            },
            {
                headerName: 'Main Invoice',
                colId: this.translationKeyPrefix + 'MAIN_INVOICE',
                field: 'mainInvoice',
                cellRenderer: 'atlasCheckbox',
                cellRendererParams: {
                    disabled: true,
                    params: this.gridContext,
                },
            },
            {
                headerName: 'Paid Percentage',
                colId: this.translationKeyPrefix + 'PAID_PERCENTAGE',
                field: 'paidPercentage',
                type: 'numericColumn',
                cellEditor: 'atlasNumeric',
                cellEditorParams: {
                    displayMask: CustomNumberMask(3, 2, false),
                    isRightAligned: false,
                },
                tooltip: () => {
                    return this.translationRessourceMap[this.warningPaidPercentageTooHighStringKey];
                },
            },
            {
                headerName: 'Cash Match Date',
                colId: this.translationKeyPrefix + 'CASH_MATCH_DATE',
                field: 'cashMatchDate',
                valueFormatter: this.uiService.dateFormatter,
                cellEditor: 'atrDate',
            },
            {
                headerName: '',
                cellRendererFramework: AgContextualMenuComponent,
                cellRendererParams: {
                    context: {
                        componentParent: this,
                        actionContext: this.gridContext,
                    },
                    menuActions: this.invoiceMarkingGridContextualMenuActions,
                },
                cellClass: 'ag-contextual-menu',
                maxWidth: 80,
            },
        ];
    }
    decimalFormatter(input, decimalOption: number, format: string) {
        const formattedInput = new Intl.NumberFormat(
            format,
            { minimumFractionDigits: decimalOption }).format(input);
        return formattedInput.toLocaleString();
    }

    getDocumentTypeForGrid(contracts: InvoiceMarkingSearchResult[]) {
        contracts.forEach((contract) => {
            const selectedDocumentType = this.masterdata.invoiceTypes.find((invoice) =>
                invoice.name === contract.documentType);
            if (selectedDocumentType) {
                if (selectedDocumentType.invoiceTypeId === InvoiceTypes.GoodsCostPurchase ||
                    selectedDocumentType.invoiceTypeId === InvoiceTypes.GoodsCostSales) {
                    contract.documentType = ViewDocumentType.Commercial;
                }
            }
        });
        return contracts;
    }

    calculateTotalValue() {
        let totalInvoicedQuantity = 0;
        this.totalQuantityPercent = 0;
        this.totalInvoiceValue = 0;
        this.totalInvoiceValuePercent = 0;
        if (this.invoiceMarkingGridRows) {
            if (this.invoiceMarkingGridRows.length > 0) {
                if (this.documentTypeFilter && this.documentTypeFilter !== ViewDocumentType['All']) {
                    this.invoiceMarkingGridRows = this.invoiceMarkingGridRows.filter((val) => val.documentType === this.documentTypeFilter);
                }
                let filterinvoiceMarkingGridRows = [];
                if (this.tradeRecord) {
                    filterinvoiceMarkingGridRows =
                        this.invoiceMarkingGridRows.filter((val) => val.contractReference === this.tradeRecord.reference);
                    filterinvoiceMarkingGridRows.forEach(
                        (row: InvoiceMarkingSearchResult) => {
                            if (row.invoiceReference !== this.deleted) {
                                totalInvoicedQuantity += row.invoicedQuantity;
                                this.totalInvoiceValue += row.invoiceAmount;
                            }
                        },
                    );
                    this.totalQuantityPercent = (totalInvoicedQuantity / this.tradeRecord.quantity) * 100;
                    this.totalInvoiceValuePercent = (this.totalInvoiceValue /
                        (this.tradeRecord.price * this.tradeRecord.quantity *
                            (filterinvoiceMarkingGridRows.length > 0 ?
                                filterinvoiceMarkingGridRows[0].priceConversionFactor
                                * filterinvoiceMarkingGridRows[0].weightConversionFactor
                                : 0))) * 100;
                }

                /* below code has to be removed once the SP changes are done to
                 update invoice marking table invoice line amount while reversal - start*/

                if (totalInvoicedQuantity === 0) {
                    this.totalInvoiceValue = 0;
                    this.totalInvoiceValuePercent = 0;
                }
            }
        }
        this.totalValuesCalculated.emit({
            totalQuantity: totalInvoicedQuantity,
            totalQuantityPercent: this.totalQuantityPercent,
            totalInvoiceValue: this.totalInvoiceValue,
            totalInvoiceValuePercent: this.totalInvoiceValuePercent,
            isDeleted: this.isDeleted,
            invoiceStatusId: this.invoiceStatusId,
        });
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.documentType) {
            if (changes.documentType.currentValue && changes.documentType.currentValue.length > 1) {
                this.viewModeFilter = changes.documentType.currentValue[0];
                this.documentTypeFilter = changes.documentType.currentValue[1];
            }
            if (this.sectionId) {
                this.getInvoiceDetailsBySection(ViewModeBehaviour[this.viewModeFilter]);
            }
        }

        if (this.sectionId) {
            this.getInvoiceDetailsBySection(this.childFlag);
        }
    }

    onDetailedViewRowClicked(event) {
        this.router.navigate([
            '/' + this.company +
            '/financial/accounting/entries/'
            + encodeURIComponent(event.data.invoiceReference)]);
    }

    onRefreshButtonClicked() {
        if (this.gridColumnApi) {
            this.gridColumnApi.resetColumnState();
            this.invoicemarkingcolumnDefs.forEach((colf) => {
                colf.hide = !this.gridColumnApi.getColumn(colf.colId).isVisible();
            });
            this.gridService.sizeColumns(this.invoiceMarkingGridOptions);
        }
    }

    showOrHideColum(event, col: agGrid.ColDef) {
        const cols = this.invoicemarkingcolumnDefs.filter((colf) => colf.colId === col.colId);
        if (cols.length === 1) {
            cols[0].hide = !(col.hide || false);

            this.gridColumnApi.setColumnVisible(col.colId, !cols[0].hide);
        }
        event.stopPropagation();
        return false;
    }

    onExportButtonClickedAsExcel() {
        let screenName: string;
        screenName = 'Invoice' + '' + 'Marking';
        const now = new Date();
        const todayDate = this.datePipe.transform(now, 'yyyyMMdd_hhmm').toString().toUpperCase();
        const params = {
            fileName: todayDate + '_' + this.company + '_' + screenName + '_' + this.userActiveDirectoryName + '.xlsx',
        };
        this.gridApi.exportDataAsExcel(params);
    }

    onExportButtonClickedAsCSV() {
        const screenName: string = 'Invoice' + '' + 'Marking';
        const now = new Date();
        const todayDate = this.datePipe.transform(now, 'yyyyMMdd_hhmm').toString().toUpperCase();
        const params = {
            fileName: todayDate + '_' + this.company + '_' + screenName + '_' + this.userActiveDirectoryName + '.csv',
        };
        this.gridApi.exportDataAsCsv(params);
    }

    onColumnVisibilityChanged(col) {
        this.userPreferencesComponent.onChangeColumnVisibility(col);
        this.autoSizeContractsGrid();
    }

    autoSizeContractsGrid() {
        if (this.invoiceMarkingGridOptions) {
            this.gridService.sizeColumns(this.invoiceMarkingGridOptions);
        }
    }

}
