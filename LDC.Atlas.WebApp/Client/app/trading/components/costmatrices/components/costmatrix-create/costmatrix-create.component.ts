import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatSidenav } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import * as agGrid from 'ag-grid-community';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthorizationService } from '../../../../../core/services/authorization.service';
import { AgContextualMenuComponent } from '../../../../../shared/components/ag-contextual-menu/ag-contextual-menu.component';
import { AgGridCheckboxComponent } from '../../../../../shared/components/ag-grid-checkbox/ag-grid-checkbox.component';
import { AgGridAutocompleteComponent } from '../../../../../shared/components/ag-grid/autocomplete/ag-grid-autocomplete.component';
import { AgGridContextualSearchComponent } from '../../../../../shared/components/ag-grid/contextual-search/ag-grid-contextual-search.component';
import { BaseFormComponent } from '../../../../../shared/components/base-form-component/base-form-component.component';
import { CellEditorNumericComponent } from '../../../../../shared/components/cell-editor-numeric/cell-editor-numeric.component';
import { CellEditorSelectComponent } from '../../../../../shared/components/cell-editor-select/cell-editor-select.component';
import { ConfirmationDialogComponent } from '../../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { FABType } from '../../../../../shared/components/floating-action-button/floating-action-button-type.enum';
import { AgContextualMenuAction } from '../../../../../shared/entities/ag-contextual-menu-action.entity';
import { AtlasAgGridParam } from '../../../../../shared/entities/atlas-ag-grid-param.entity';
import { AtlasFormControl } from '../../../../../shared/entities/atlas-form-control';
import { ContractTerm } from '../../../../../shared/entities/contract-term.entity';
import { CostDirection } from '../../../../../shared/entities/cost-direction.entity';
import { Counterparty } from '../../../../../shared/entities/counterparty.entity';
import { EnumEntity } from '../../../../../shared/entities/enum-entity.entity';
import { FloatingActionButtonActions } from '../../../../../shared/entities/floating-action-buttons-actions.entity';
import { PagingOptions } from '../../../../../shared/entities/http-services/paging-options';
import { LockFunctionalContext } from '../../../../../shared/entities/lock-functional-context.entity';
import { LockResourceInformation } from '../../../../../shared/entities/lock-resource-information.entity';
import { MasterDataProps } from '../../../../../shared/entities/masterdata-props.entity';
import { MasterData } from '../../../../../shared/entities/masterdata.entity';
import { PaymentTerm } from '../../../../../shared/entities/payment-term.entity';
import { Port } from '../../../../../shared/entities/port.entity';
import { RateType } from '../../../../../shared/entities/rate-type.entity';
import { Tag } from '../../../../../shared/entities/tag.entity';
import { CostDirections } from '../../../../../shared/enums/cost-direction.enum';
import { CostMatrixAction } from '../../../../../shared/enums/costmatrix-action.enum';
import { Gaps } from '../../../../../shared/enums/gaps.enum';
import { RateTypes } from '../../../../../shared/enums/rate-type.enum';
import { CustomNumberMask } from '../../../../../shared/numberMask';
import { AgGridService } from '../../../../../shared/services/ag-grid.service';
import { FormConfigurationProviderService } from '../../../../../shared/services/form-configuration-provider.service';
import { FeatureFlagService } from '../../../../../shared/services/http-services/feature-flag.service';
import { LockService } from '../../../../../shared/services/http-services/lock.service';
import { MasterdataService } from '../../../../../shared/services/http-services/masterdata.service';
import { TradingService } from '../../../../../shared/services/http-services/trading.service';
import { SnackbarService } from '../../../../../shared/services/snackbar.service';
import { TitleService } from '../../../../../shared/services/title.service';
import { Costmatrix } from '../../../../../shared/services/trading/dtos/costmatrix';
import { CostmatrixLine } from '../../../../../shared/services/trading/dtos/costmatrixLine';
import { UiService } from '../../../../../shared/services/ui.service';
import { TagField } from '../../../../entities/tag-field';
import { CostMatrixNameAsyncValidator } from '../../../../validators/costmatrix-name-async-validator.validator';

@Component({
    selector: 'atlas-costmatrix-create',
    templateUrl: './costmatrix-create.component.html',
    styleUrls: ['./costmatrix-create.component.scss'],
    providers: [DatePipe],
})
export class CostmatrixCreateComponent extends BaseFormComponent implements OnInit, OnDestroy {
    costsMenuActions: { [key: string]: string } = {
        deleteCostMatrixLine: 'delete',
    };
    costMatrix: Costmatrix[];
    parameters: Tag[];
    tagFields: Observable<TagField[]>;
    tagsList: TagField[];
    costmatrixGridOptions: agGrid.GridOptions = {};
    atlasAgGridParam: AtlasAgGridParam;
    costmatrixGridColumns: agGrid.ColDef[];
    costmatrixGridRows: CostmatrixLine[];
    costMatrixLines: CostmatrixLine[];
    private costMatrixId: number;
    isEdit = false;
    Description: string;
    isDirty: boolean = false;
    costmatricesGridContextualMenuActions: AgContextualMenuAction[];
    isSummaryView: boolean = false;
    formGroup: FormGroup;
    costMatrixAction: string;
    isSave: boolean = false;
    nameCtrl = new AtlasFormControl('Name');
    descriptionCtrl = new AtlasFormControl('Description');

    gridContext = {
        gridEditable: true,
    };
    gridComponents = {
        atlasSelect: CellEditorSelectComponent,
        atlasNumeric: CellEditorNumericComponent,
        atlasCheckbox: AgGridCheckboxComponent,
    };
    gridApi: agGrid.GridApi;
    gridColumnApi: agGrid.ColumnApi;
    isLoading: boolean;
    company: string;
    masterdataList: string[] = [MasterDataProps.CostTypes];
    masterdata: MasterData;
    rateTypes: RateType[];
    costDirections: CostDirection[];
    isDescription: boolean;
    isCostMatrixImage: boolean = false;
    isCostMatrixDisplay: boolean = false;
    originalCostMatrixId: number;
    destroy$ = new Subject();
    resourcesInformation: LockResourceInformation[] = new Array<LockResourceInformation>();
    gridName: string = 'CostMatrixEdit';
    userActiveDirectoryName: string;
    gaps = Gaps;
    paramsReady = false;
    costmatrixId: number;

    private contractTerms: ContractTerm[];
    private contractTypes: EnumEntity[];
    private counterparties: Counterparty[];
    private paymentTerms: PaymentTerm[];
    private ports: Port[];

    fabMenuActions: FloatingActionButtonActions[] = [];
    fabType: FABType = FABType.MiniFAB;
    fabTitle: string = 'COST MATRICES mini FAB';
    isLoaded: boolean = false;

    constructor(
        private formBuilder: FormBuilder,
        protected uiService: UiService,
        protected route: ActivatedRoute,
        protected snackbarService: SnackbarService,
        protected router: Router,
        protected masterdataService: MasterdataService,
        protected tradingService: TradingService,
        protected formConfigurationProvider: FormConfigurationProviderService,
        protected dialog: MatDialog,
        protected lockService: LockService,
        private titleService: TitleService,
        public gridService: AgGridService,
        private datePipe: DatePipe,
        private authorizationService: AuthorizationService,
        private featureFlagService: FeatureFlagService,
    ) {
        super(formConfigurationProvider);
        this.userActiveDirectoryName = this.authorizationService.getCurrentUser().samAccountName;
    }

    ngOnInit() {
        this.tagFields = this.getTagFields();
        this.tagFields.subscribe((val) => {
            this.tagsList = val;
        });
        this.parameters = null;
        this.isEdit = true;
        this.company = this.route.snapshot.paramMap.get('company');
        this.costmatrixId = this.route.snapshot.params['costmatrixId'];
        this.atlasAgGridParam = this.gridService.getAgGridParam();
        this.init();
        this.masterdata = this.route.snapshot.data.masterdata;
        this.rateTypes = [
            {
                code: RateTypes[RateTypes.Rate],
                description: '',
            },
            {
                code: RateTypes[RateTypes.Amount],
                description: '',
            },
            {
                code: RateTypes[RateTypes.Percent],
                description: '',
            },
        ];

        this.costDirections = [
            {
                costDirectionId: CostDirections.Payable,
                costDirection: 'Pay',
            },
            {
                costDirectionId: CostDirections.Receivable,
                costDirection: 'Receive',
            },
        ];
        this.initializeGridColumns();

        this.isCostMatrixImage = this.route.snapshot.data['isImage'];
        this.isCostMatrixDisplay = this.route.snapshot.data['isDisplay'];
        if (this.route.snapshot.url[1].path.toString() === 'edit') {
            this.costMatrixId = Number(this.route.snapshot.paramMap.get('costmatrixId'));
            this.isDirty = true;
            this.costMatrixAction = CostMatrixAction.Edit;
            this.gridContext.gridEditable = true;
        } else if (this.isCostMatrixImage) {
            this.costMatrixId = Number(this.route.snapshot.paramMap.get('originalCostMatrixId'));
            this.isDirty = false;
            this.costMatrixAction = CostMatrixAction.Image;
            this.gridContext.gridEditable = true;
        } else if (this.isCostMatrixDisplay) {
            this.costMatrixId = Number(this.route.snapshot.paramMap.get('costmatrixId'));
            this.gridContext.gridEditable = false;
            this.viewEditCostMatrix();
        } else {
            this.costMatrixAction = CostMatrixAction.Create;
            this.titleService.setTitle('Cost Matrix Creation');
        }
        if (this.costMatrixId && this.costMatrixId !== 0) {
            this.isLoading = true;
            this.viewEditCostMatrix();
        } else {
            this.isLoading = false;
        }
        this.initializeForm();
        this.setValidators();

        this.getCommodities();

        this.initFABActions();
    }

    initializeForm() {
        this.formGroup = this.formBuilder.group({
            nameCtrl: this.nameCtrl,
            descriptionCtrl: this.descriptionCtrl,
        });
    }

    canDeactivate() {
        if (this.formGroup.dirty && this.isSave === false) {
            return window.confirm('Leave an unsave form? \nYour changes won\'t be applied!');
        }
        return true;
    }

    viewEditCostMatrix() {
        this.featureFlagService.getFlagInfo(Gaps.gap003).subscribe((flagAuth) => {
            const matrix: Observable<Costmatrix> = this.tradingService.getCostmatricesListByCostmatrixId(this.costMatrixId);

            if (flagAuth && flagAuth.active) {
                const tags = this.tradingService.GetCostMatricesListWithTags(this.costMatrixId);
                this.subscriptions.push(
                    tags.subscribe((result) => {
                        this.getmatrix(matrix, result);
                    }),
                );
            } else {
                this.subscriptions.push(this.getmatrix(matrix, null));
            }
        });
    }

    getmatrix(matrix: Observable<Costmatrix>, result) {
        return matrix.subscribe((data) => {
            this.costMatrixLines = data.costMatrixLines;
            this.parameters = (result && result.length > 0) ? result[0].tags.sort((parameter1, parameter2) => parameter1.typeName.localeCompare(parameter2.typeName)) : null;
            if (this.isCostMatrixImage) {
                this.nameCtrl.patchValue(null);
                this.descriptionCtrl.patchValue(null);
                this.titleService.setTitle(data.name + ' - Cost Matrix Image');
            } else if (this.isCostMatrixDisplay) {
                this.nameCtrl.disable();
                this.descriptionCtrl.disable();
                this.nameCtrl.patchValue(data.name);
                this.descriptionCtrl.patchValue(data.description);
                this.titleService.setTitle(data.name + ' - Cost Matrix View');
            } else {
                this.lockService
                    .lockCostMatrix(this.costMatrixId, LockFunctionalContext.CostMatrixEdition)
                    .pipe(takeUntil(this.destroy$))
                    .subscribe(
                        (lockData) => {
                            this.startLockRefresh(this.costMatrixId, data.name);
                            this.titleService.setTitle(data.name + ' - Cost Matrix Edit');
                        },
                        (err) => {
                            this.dialog.open(ConfirmationDialogComponent, {
                                data: {
                                    title: 'Lock',
                                    text: err.error.detail,
                                    okButton: 'Got it',
                                },
                            });
                            this.goToCostMatrixHome();
                        },
                    );

                this.nameCtrl.disable();
                this.nameCtrl.patchValue(data.name);
                this.descriptionCtrl.patchValue(data.description);
            }
            this.initializeGridColumns();
            this.costMatrixLines.forEach((line) => {
                if (this.masterdata) {
                    const counterparty = this.masterdata.counterparties.find((e) => e.counterpartyID === line.supplierId);
                    if (counterparty) {
                        line.supplierCode = counterparty.counterpartyCode;
                    }

                    const costType = this.masterdata.costTypes.find((e) => e.costTypeId === line.costTypeId);
                    if (costType) {
                        line.costTypeCode = costType.costTypeCode;
                    }

                    const priceUnit = this.masterdata.priceUnits.find((e) => e.priceUnitId === line.priceUnitId);
                    if (priceUnit) {
                        line.priceCode = priceUnit.priceCode;
                    }
                }
                line.costDirection = this.costDirections.find((e) => e.costDirectionId === line.payReceive).costDirection;

                line.rateTypeCode = this.getRateTypeCodeFromID(line.rateType);
            });
            this.costmatrixGridRows = this.costMatrixLines;

            this.isLoading = false;
        });
    }

    onGridReady(params) {
        params.columnDefs = this.costmatrixGridColumns;
        this.costmatrixGridOptions = params;

        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;
        this.gridApi.showNoRowsOverlay();

        this.autoSizeContractsGrid();
    }

    autoSizeContractsGrid() {
        if (this.gridColumnApi !== undefined) {
            const allColumnIds = [];
            this.costmatrixGridColumns.forEach((columnDefs) => {
                allColumnIds.push(columnDefs.field);
            });
            this.gridColumnApi.autoSizeColumns(allColumnIds);
        }
    }

    onGridSizeChanged(params) {
        this.autoSizeContractsGrid();
    }

    initializeGridColumns() {
        this.costmatrixGridOptions = {
            context: this.gridContext,
        };
        this.costmatrixGridColumns = [
            {
                headerName: '',
                valueGetter: this.getRowStatus,
                lockPosition: true,
                hide: this.isCostMatrixDisplay,
            },
            {
                headerName: 'Cost type*',
                field: 'costTypeCode',
                colId: 'costTypeCode',
                cellRendererFramework: AgGridAutocompleteComponent,
                cellRendererParams: {
                    context: {
                        componentParent: this,
                    },
                    options: this.masterdata.costTypes
                        .filter((cost) => cost.isATradeCost === true)
                        .sort((a, b) => a.costTypeCode.localeCompare(b.costTypeCode)),
                    valueProperty: 'costTypeCode',
                    codeProperty: 'costTypeCode',
                    displayProperty: 'costTypeCode',
                    isRequired: true,
                },
                onCellValueChanged: (params) => {
                    const filteredCostType = this.masterdata.costTypes.find((e) => e.costTypeCode === params.data.costTypeCode);

                    if (filteredCostType) {
                        params.node.setDataValue('description', filteredCostType.name);
                        params.node.setDataValue('inPL', filteredCostType.inPNL);
                        params.node.setDataValue('noAct', filteredCostType.noAction);
                    }
                },
            },
            {
                headerName: 'Description',
                field: 'description',
                colId: 'description',
            },
            {
                headerName: 'Supplier',
                field: 'supplierCode',
                cellRendererFramework: AgGridContextualSearchComponent,
                cellRendererParams: (params) => {
                    return {
                        context: {
                            componentParent: this,
                            gridEditable: params.context.gridEditable,
                        },
                        gridId: 'counterpartiesGrid',
                        options: this.masterdata.counterparties,
                        displayProperty: 'counterpartyCode',
                        valueProperty: 'counterpartyCode',
                        lightBoxTitle: 'Results for Counterparty',
                        showContextualSearchIcon: params.context.gridEditable,
                    };
                },
                onCellValueChanged: this.onClientAccountSelected.bind(this),
            },
            {
                headerName: 'Pay/Rec*',
                field: 'costDirection',
                editable: this.isGridEditable,
                cellRenderer: this.requiredCell,
                cellEditor: 'agRichSelectCellEditor',
                cellEditorParams: {
                    values: this.costDirections.map((costDirection) => costDirection.costDirection),
                    displayPropertyName: 'costDirection',
                    valuePropertyName: 'costDirection',
                    displayFormat: 'costDirection',
                },
            },
            {
                headerName: 'Ccy*',
                field: 'currencyCode',
                colId: 'currencyCode',
                cellRendererFramework: AgGridAutocompleteComponent,
                cellRendererParams: {
                    context: {
                        componentParent: this,
                    },
                    options: this.masterdata.currencies,
                    valueProperty: 'currencyCode',
                    codeProperty: 'currencyCode',
                    displayProperty: 'description',
                    isRequired: true,
                },
                onCellValueChanged: (params) => { },
            },
            {
                headerName: 'Rate Type*',
                field: 'rateTypeCode',
                colId: 'rateTypeCode',
                editable: this.isGridEditable,
                cellRenderer: this.requiredCell.bind(this),
                cellEditor: 'agRichSelectCellEditor',
                cellEditorParams: {
                    values: this.rateTypes.map((rateType) => rateType.code),
                    valuePropertyName: 'code',
                    displayFormat: 'code',
                    context: this.masterdata,
                },
                onCellValueChanged: this.onRateTypeChange.bind(this),
            },
            {
                headerName: 'Price Code',
                field: 'priceCode',
                colId: 'priceCode',
                editable: this.isPriceCodeEditable,
                cellEditor: 'agRichSelectCellEditor',
                cellRenderer: this.priceCodeRequired.bind(this),
                cellEditorParams: {
                    values: this.masterdata.priceUnits.map((priceUnit) => priceUnit.priceCode),
                    displayPropertyName: 'description',
                    valuePropertyName: 'priceCode',
                    displayFormat: 'priceCode | description',
                },
            },
            {
                headerName: 'Rate/Amount',
                field: 'rateAmount',
                type: 'numericColumn',
                editable: this.isGridEditable,
                cellEditor: 'atlasNumeric',
                cellEditorParams: {
                    displayMask: CustomNumberMask(12, 10, false),
                    isRightAligned: false,
                },
            },
            {
                headerName: 'in P&L',
                field: 'inPL',
                colId: 'inPL',
                cellRenderer: 'atlasCheckbox',
                cellRendererParams: {
                    disabled: this.isGridCheckboxEditable,
                },
            },
            {
                headerName: 'No Act',
                field: 'noAct',
                colId: 'noAct',
                cellRenderer: 'atlasCheckbox',
                cellRendererParams: {
                    disabled: this.isGridCheckboxEditable,
                },
            },
            {
                headerName: 'Narrative',
                field: 'narrative',
                editable: this.isGridEditable,
                cellEditor: 'agLargeTextCellEditor',
                cellEditorParams: {
                    maxLength: 100,
                    rows: 3,
                    cols: 50,
                },
            },
            {
                headerName: '',
                cellRendererFramework: AgContextualMenuComponent,
                cellRendererParams: {
                    context: {
                        componentParent: this,
                        actionContext: this.gridContext,
                    },
                    menuActions: this.costmatricesGridContextualMenuActions,
                    hide: false,
                },
                cellClass: 'ag-contextual-menu',
                maxWidth: 80,
            },
        ];
    }

    isGridCheckboxEditable(params) {
        return !params.context.gridEditable;
    }

    getRowStatus(params) {
        return params.data.costMatrixLineId ? '' : 'N';
    }

    isGridEditable(params): boolean {
        return params.context.gridEditable;
    }

    isPriceCodeEditable(params): boolean {
        if (params.data.rateTypeCode === RateTypes[RateTypes.Rate]) {
            return params.context.gridEditable;
        } else {
            params.node.setDataValue('priceCode', '');
        }
    }

    onCellValueChanged(params) {
        if (params.oldValue !== params.newValue) {
            params.node.data.isDirty = true;
        }
    }

    requiredCell(params) {
        if (!params.value || params.value === '') {
            return '<div class=\'cost-cell-value-required\'>Required*</div>';
        }
        return params.value;
    }

    onCostTypeChange(params) {
        const filteredCostType = params.colDef.cellEditorParams.context.costTypes.find((e) => e.costTypeCode === params.data.costTypeCode);

        if (filteredCostType) {
            const costTypeDescription = filteredCostType.name;
            const inPNL = filteredCostType.inPNL;
            const noAction = filteredCostType.noAction;

            params.node.setDataValue('description', costTypeDescription);
            params.node.setDataValue('inPL', inPNL);
            params.node.setDataValue('noAct', noAction);
        }
    }

    onRateTypeChange(params) {
        if (params.newValue === RateTypes[RateTypes.Rate]) {
            this.priceCodeRequired(params);
        } else {
            this.isPriceCodeEditable(params);
        }
    }

    priceCodeRequired(params) {
        if ((!params.value || params.value === '') && params.data.rateTypeCode === RateTypes[RateTypes.Rate]) {
            params.node.setDataValue('priceCode', this.requiredCell(this));
        }
        return params.value;
    }

    onAddRowButtonClicked() {
        this.isSave = true;
        const newItem = this.createNewRowData();
        const res = this.gridApi.updateRowData({ add: [newItem] });
        this.gridColumnApi.autoSizeAllColumns();
    }

    onClientAccountSelected(params) {
        if (params.newValue && params.oldValue !== params.newValue && params.newValue) {
            const selectedClientAccount = this.masterdata.counterparties.find(
                (clientAccount) => clientAccount.counterpartyCode === params.newValue,
            );
            if (!selectedClientAccount) {
                this.snackbarService.throwErrorSnackBar('Not allowed : Client Account does not exist');
            }
        }
    }

    createNewRowData() {
        const newCostRow = new CostmatrixLine();
        return newCostRow;
    }

    onDiscardButtonClicked() {
        this.isSave = true;
        const confirmDialog = this.dialog.open(ConfirmationDialogComponent, {
            data: {
                title: 'Discard Changes',
                text: 'You have some modification pending. Close and lose changes?',
                okButton: 'Ok',
                cancelButton: 'Cancel',
            },
        });
        confirmDialog.afterClosed().subscribe((answer) => {
            if (answer) {
                this.goToCostMatrixHome();
            }
        });
    }

    onBackButtonClicked() {
        this.goToCostMatrixHome();
    }

    goToCostMatrixHome() {
        let tabIndex: number = 0;
        tabIndex = 1;
        this.router.navigate(['/' + this.company + '/trades'],
                             {
                queryParams: { index: tabIndex },
            });
    }

    goToCostMatrixViewMode(costmatrixId: number) {
        this.router.navigate(['/' + this.company + '/trades/costmatrix/display/' + encodeURIComponent(costmatrixId.toString())]);
    }

    getGridEditData(): Costmatrix {
        const costmatrix = new Costmatrix();
        costmatrix.costMatrixId = this.costMatrixId;
        costmatrix.description = this.descriptionCtrl.value;
        costmatrix.costMatrixLines = [];
        this.gridApi.forEachNode((rowData) => {
            if (rowData.data) {
                const costmatrixline = new CostmatrixLine();
                if (rowData.data.isDirty && this.isEdit) {
                    if (costmatrixline.costMatrixLineId !== 0) {
                        costmatrixline.costMatrixLineId = rowData.data.costMatrixLineId;
                    }
                    costmatrixline.costMatrixId = this.costMatrixId;

                    if (this.masterdata) {
                        const costType = this.masterdata.costTypes.find((e) => e.costTypeCode === rowData.data.costTypeCode);
                        if (costType) {
                            costmatrixline.costTypeId = costType.costTypeId;
                        }

                        const costTypeCode = this.masterdata.costTypes.find((e) => e.costTypeCode === rowData.data.costTypeCode);
                        if (costTypeCode) {
                            costmatrixline.description = costTypeCode.name;
                        }

                        const supplierCode = this.masterdata.counterparties.find((e) => e.counterpartyCode === rowData.data.supplierCode);
                        if (supplierCode) {
                            costmatrixline.supplierId = supplierCode.counterpartyID;
                        }

                        const priceUnit = this.masterdata.priceUnits.find((e) => e.priceCode === rowData.data.priceCode);
                        if (priceUnit) {
                            costmatrixline.priceUnitId = priceUnit.priceUnitId;
                        }
                    }

                    costmatrixline.payReceive = this.costDirections.find(
                        (e) => e.costDirection === rowData.data.costDirection,
                    ).costDirectionId;

                    costmatrixline.currencyCode = rowData.data.currencyCode;
                    costmatrixline.rateType = this.getRateTypeIdFromCode(rowData.data.rateTypeCode);

                    costmatrixline.rateAmount = rowData.data.rateAmount;
                    costmatrixline.inPL = rowData.data.inPL;
                    costmatrixline.noAct = rowData.data.noAct;
                    costmatrixline.narrative = rowData.data.narrative;
                    costmatrix.costMatrixLines.push(costmatrixline);
                }
            }
        });
        return costmatrix;
    }

    getGridData(): Costmatrix {
        const costmatrix = new Costmatrix();
        costmatrix.costMatrixLines = [];
        this.gridApi.forEachNode((rowData) => {
            if (rowData.data) {
                const costmatrixline = new CostmatrixLine();
                if (this.masterdata) {
                    const costType = this.masterdata.costTypes.find((e) => e.costTypeCode === rowData.data.costTypeCode);
                    if (costType) {
                        costmatrixline.costTypeId = costType.costTypeId;
                    }

                    const supplierCode = this.masterdata.counterparties.find((e) => e.counterpartyCode === rowData.data.supplierCode);
                    if (supplierCode) {
                        costmatrixline.supplierId = supplierCode.counterpartyID;
                    }

                    const priceUnit = this.masterdata.priceUnits.find((e) => e.priceCode === rowData.data.priceCode);
                    if (priceUnit) {
                        costmatrixline.priceUnitId = priceUnit.priceUnitId;
                    }
                }
                costmatrixline.description = rowData.data.description;
                costmatrixline.payReceive = this.costDirections.find((e) => e.costDirection === rowData.data.costDirection).costDirectionId;
                costmatrixline.currencyCode = rowData.data.currencyCode;
                costmatrixline.rateType = this.getRateTypeIdFromCode(rowData.data.rateTypeCode);
                costmatrixline.rateAmount = rowData.data.rateAmount;
                costmatrixline.inPL = rowData.data.inPL;
                costmatrixline.noAct = rowData.data.noAct;
                costmatrixline.narrative = rowData.data.narrative;
                costmatrix.costMatrixLines.push(costmatrixline);
            }
        });
        costmatrix.name = this.nameCtrl.value;
        costmatrix.description = this.descriptionCtrl.value;
        return costmatrix;
    }

    keepParamsReceived(taglist: Tag[], paramsSideNav: MatSidenav) {
        paramsSideNav.close();
        taglist = taglist.sort((parameter1, parameter2) => parameter1.typeName.localeCompare(parameter2.typeName));
        this.parameters = taglist;
    }

    onSaveButtonClicked() {
        this.isSave = true;
        if (!this.formGroup.valid || !this.validate()) {
            this.snackbarService.throwErrorSnackBar('Cost matrix is invalid. Please resolve the errors.');
        } else {
            const costmatrix: Costmatrix = this.isDirty ? this.getGridEditData() : this.getGridData();
            let operation: Observable<Costmatrix>;

            this.featureFlagService
                .getFlagInfo(Gaps.gap003)
                .subscribe(
                    (flagAuth) => {
                        if (flagAuth && flagAuth.active) {
                            costmatrix.tags = this.parameters;
                            operation = this.isDirty
                                ? this.tradingService.updateCostmatrixWithParameters(costmatrix)
                                : this.tradingService.createCostMatrixWithParameters(costmatrix);
                        } else {
                            operation = this.opertationSave(operation, costmatrix);
                        }
                    },
                    (error) => {
                        operation = this.opertationSave(operation, costmatrix);
                    },
                )
                .add(() => {
                    operation.subscribe((data) => {
                        this.snackbarService.informationSnackBar('Cost matrix details updated successfully');
                        this.goToCostMatrixViewMode(data ? data.costMatrixId : costmatrix.costMatrixId);
                    });
                });
        }
    }

    private opertationSave(operation: Observable<Costmatrix>, costmatrix: Costmatrix) {
        operation = this.isDirty ? this.tradingService.updateCostmatrix(costmatrix) : this.tradingService.createCostmatrix(costmatrix);
        return operation;
    }

    validate(): boolean {
        let isValid = true;
        this.gridApi.forEachNode((rowData) => {
            if (rowData.data.costTypeCode && rowData.data.costDirection && rowData.data.currencyCode && rowData.data.rateTypeCode) {
                if (rowData.data.rateTypeCode === 'Rate' && rowData.data.priceCode.includes('Required*')) {
                    isValid = false;
                }
            } else if (
                !(rowData.data.costTypeCode || rowData.data.costDirection || rowData.data.currencyCode || rowData.data.rateTypeCode)
            ) {
                isValid = false;
            } else if (
                !(rowData.data.costTypeCode && rowData.data.costDirection && rowData.data.currencyCode && rowData.data.rateTypeCode)
            ) {
                isValid = false;
            }
        });
        if (!(this.nameCtrl.value && this.descriptionCtrl.value)) {
            isValid = false;
        }
        return isValid;
    }

    setValidators() {
        this.descriptionCtrl.setValidators(Validators.compose([Validators.maxLength(60), Validators.required]));
        this.nameCtrl.setValidators(Validators.compose([Validators.maxLength(30), Validators.required]));
        this.nameCtrl.setAsyncValidators(CostMatrixNameAsyncValidator.createValidator(this.tradingService));
    }

    getRateTypeIdFromCode(code: string): number {
        const rateTypeId = RateTypes[code];
        return rateTypeId;
    }
    getRateTypeCodeFromID(id: number): string {
        const rateTypeCode = RateTypes[id];
        return rateTypeCode;
    }

    isDeleteDisabledWithPrivileges(params) {
        const costMatrixRow = params.data as CostmatrixLine;
        if (!costMatrixRow.costMatrixLineId) {
            return false;
        }
        let deleteDisable = true;
        if (params.context.actionContext.gridEditable) {
            deleteDisable = false;
        }
        return deleteDisable;
    }

    init() {
        this.costmatricesGridContextualMenuActions = [
            {
                icon: 'delete',
                text: 'Delete',
                action: this.costsMenuActions.deleteCostMatrixLine,
                disabled: this.isDeleteDisabledWithPrivileges,
            },
        ];
    }

    handleAction(action: string, costMatrixLine: CostmatrixLine) {
        switch (action) {
            case this.costsMenuActions.deleteCostMatrixLine:
                const confirmDialog = this.dialog.open(ConfirmationDialogComponent, {
                    data: {
                        title: 'CostMatrixLine Deletion',
                        text: 'Deleting a cost matrix line is permanent. Do you wish to proceed?',
                        okButton: 'Delete anyway',
                        cancelButton: 'Cancel',
                    },
                });
                const confirmationSubscription = confirmDialog.afterClosed().subscribe((answer) => {
                    if (answer) {
                        if (costMatrixLine.costMatrixLineId) {
                            const deleteConfirmationSubscription = this.tradingService
                                .deleteCostMatrixLine(costMatrixLine.costMatrixId, costMatrixLine.costMatrixLineId)
                                .subscribe(() => {
                                    this.snackbarService.informationSnackBar('Cost matrix line Deleted');
                                    this.viewEditCostMatrix();
                                });
                            this.subscriptions.push(deleteConfirmationSubscription);
                        } else {
                            this.gridApi.updateRowData({ remove: [costMatrixLine] });
                        }
                    }
                });
                this.subscriptions.push(confirmationSubscription);
                break;
            default:
                break;
        }
    }

    startLockRefresh(costMatrixId: number, costMatrixName: string) {
        this.resourcesInformation = new Array<LockResourceInformation>();
        const resourceInformation = new LockResourceInformation();
        resourceInformation.resourceType = 'Cost Matrix';
        resourceInformation.resourceId = costMatrixId;
        resourceInformation.resourceCode = costMatrixName;
        resourceInformation.needRefresh = true;
        this.resourcesInformation.push(resourceInformation);
    }

    stopLockRefresh() {
        this.resourcesInformation = new Array<LockResourceInformation>();
    }

    ngOnDestroy(): void {
        this.stopLockRefresh();
        this.lockService
            .cleanSessionLocks()
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                this.destroy$.next();
                this.destroy$.complete();
            });
    }

    getParamHeaders(format: string) {
        const now = new Date();
        const todayDate = this.datePipe
            .transform(now, 'yyyyMMdd_hhmm')
            .toString()
            .toUpperCase();
        const fileName = todayDate + '_' + this.company + '_' + this.gridName + '_' + this.userActiveDirectoryName + format;
        const name = this.nameCtrl.value;
        const description = this.descriptionCtrl.value;
        const isCsv: boolean = format === '.csv';
        const params: any = {
            fileName,
            customHeader: [],
        };
        if (!isCsv) {
            params.customHeader = [
                [
                    {
                        data: {
                            type: 'String',
                            value: 'Name',
                        },
                    },
                    {
                        data: {
                            type: 'String',
                            value: name,
                        },
                    },
                ],
                [
                    {
                        data: {
                            type: 'String',
                            value: 'Description',
                        },
                    },
                    {
                        data: {
                            type: 'String',
                            value: description,
                        },
                    },
                ],
                [],
            ];
        } else {
            params.customHeader = 'Name,' + name + '\r\nDescription,' + description + '\n';
        }
        return params;
    }

    onExportButtonClickedAsExcel() {
        const params = this.getParamHeaders('.xlsx');
        this.gridApi.exportDataAsExcel(params);
    }

    onExportButtonClickedAsCSV() {
        const params = this.getParamHeaders('.csv');
        this.gridApi.exportDataAsCsv(params);
    }

    openSideBar(drawer) {
        drawer.toggle();
    }

    /**
     * Recover the tagfields of the parameters table
     */
    getTagFields() {
        return this.tradingService.getTagFields();
    }

    paramsToChip(): string[] {
        let chip: string;
        const chips = new Array<string>();
        let typenameActual: string;
        if (this.tagsList && this.parameters) {
            this.parameters.forEach((param) => {
                if (param.typeName !== typenameActual && param.tagValueId !== null) {
                    const value = this.tagsList.find((a) => param.typeName === a.typeName);
                    if (value) {
                        const label = value.label;
                        chip = label + '=';
                        chip += this.searchValue(param.typeName, param.tagValueId);
                        typenameActual = param.typeName;
                        chips.push(chip);
                    }
                } else {
                    const value = this.tagsList.find((tag) => param.typeName === tag.typeName);
                    chip = chips.find((tag) => tag.startsWith(value.label));
                    chips.splice(chips.findIndex((tag) => tag.startsWith(value.label)), 1, (chip + ',' + this.searchValue(param.typeName, param.tagValueId)));
                }
            });
        }
        return chips.sort();
    }

    searchValue(typename: string, tagValueId: string): string {
        let paramName = '';
        let paramid = '';
        let list: any[];
        if (typename !== '' && typename !== undefined) {
            switch (typename) {
                case 'SectionDto.ContractTermCode':
                    paramName = 'displayName';
                    paramid = 'contractTermId';
                    list = this.contractTerms;
                    break;
                case 'TradeDto.Type':
                    paramName = 'enumEntityValue';
                    paramid = 'enumEntityId';
                    list = this.contractTypes;
                    break;
                case 'SectionDto.PaymentTermCode':
                    paramName = 'paymentTermCode';
                    paramid = 'paymentTermsId';
                    list = this.paymentTerms;
                    break;
                case 'SectionDto.CounterpartyReference':
                    paramName = 'counterpartyCode';
                    paramid = 'counterpartyID';
                    list = this.counterparties;
                    break;
                case 'SectionDto.PortDestinationCode':
                case 'SectionDto.PortOriginCode':
                    paramName = 'portCode';
                    paramid = 'portId';
                    list = this.ports;
                    break;
            }
            if (paramName !== '' && paramid !== '') {
                tagValueId = this.searchTagByid(tagValueId, list, paramName, paramid);
            }

        }

        return tagValueId;
    }

    private searchTagByid(tagValueId: string, list: any[], paramName: string, paramId: string): string {
        const tagsIds = tagValueId.split(',');
        const newTagValueId = new Array();

        tagsIds.forEach((id) => {
            const tag = list.find((val) => val[paramId] === Number(id));
            newTagValueId.push(tag[paramName]);
        });
        return newTagValueId.join();
    }

    getCommodities() {
        this.masterdataService.getContractTerms().subscribe((contractTerms) => {
            this.contractTerms = contractTerms.value;
            this.masterdataService.getContractTypes().subscribe((contractType) => {
                this.contractTypes = contractType.value;
                this.masterdataService.getCounterparties('', new PagingOptions()).subscribe((counterparty) => {
                    this.counterparties = counterparty.value;
                    this.masterdataService.getPaymentTerms('', new PagingOptions()).subscribe((paymentTerms) => {
                        this.paymentTerms = paymentTerms.value;
                        this.masterdataService.getPorts('', new PagingOptions()).subscribe((ports) => {
                            this.ports = ports.value;
                            this.paramsReady = true;
                        });
                    });
                });
            });
        });
    }

    // For FAB
    initFABActions() {
        this.fabMenuActions = [];

        const actionPrevious: FloatingActionButtonActions = {
            icon: 'keyboard_backspace',
            text: 'Discard',
            action: 'actionBack',
            disabled: false,
            index: 1,
        };
        const actionSave: FloatingActionButtonActions = {
            icon: 'save',
            text: 'Save',
            action: 'actionSave',
            disabled: false,
            index: 0,
        };
        const actionAdd: FloatingActionButtonActions = {
            icon: 'add',
            text: 'New Costmatrix',
            action: 'actionAdd',
            disabled: false,
            index: 1,
        };
        const actionEdit: FloatingActionButtonActions = {
            icon: 'edit',
            text: 'Edit the Costmatrix',
            action: 'actionEdit',
            disabled: false,
            index: 0,
        };

        if (this.isEdit && !this.isCostMatrixDisplay) {
            this.fabMenuActions.push(actionPrevious);
            this.fabMenuActions.push(actionSave);
        } else {
            this.fabMenuActions.push(actionAdd);
            this.fabMenuActions.push(actionEdit);
        }

        this.isLoaded = true;
    }

    onFabActionClicked(action: string) {
        switch (action) {
            case 'actionBack': {
                this.onBackButtonClicked();
                break;
            }
            case 'actionSave': {
                this.onSaveButtonClicked();
                break;
            }
            case 'actionAdd': {
                this.router.navigate(['/' + this.company + '/trades/costmatrix/create/']);
                break;
            }
            case 'actionEdit': {
                this.router.navigate(['/' + this.company + '/trades/costmatrix/edit/', this.costmatrixId]);
                break;
            }
        }
    }
}
