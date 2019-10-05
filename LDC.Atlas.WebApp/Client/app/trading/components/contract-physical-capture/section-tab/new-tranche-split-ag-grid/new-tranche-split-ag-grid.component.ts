import { Component, EventEmitter, Inject, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import * as agGrid from 'ag-grid-community';
import * as _moment from 'moment';
import { Subscription } from 'rxjs';
import { CompanyManagerService } from '../../../../../core/services/company-manager.service';
import { CommonMethods } from '../../../../../execution/services/execution-cash-common-methods';
import { AgGridUserPreferencesComponent } from '../../../../../shared/components/ag-grid-user-preferences/ag-grid-user-preferences.component';
import { BaseFormComponent } from '../../../../../shared/components/base-form-component/base-form-component.component';
import { CellEditorDatePickerComponent } from '../../../../../shared/components/cell-editor-date-picker/cell-editor-date-picker.component';
import { CellEditorSelectComponent } from '../../../../../shared/components/cell-editor-select/cell-editor-select.component';
import { ConfirmationDialogComponent } from '../../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { AgContextualMenuAction } from '../../../../../shared/entities/ag-contextual-menu-action.entity';
import { AtlasAgGridParam } from '../../../../../shared/entities/atlas-ag-grid-param.entity';
import { AtlasNumber } from '../../../../../shared/entities/atlas-number.entity';
import { MasterData } from '../../../../../shared/entities/masterdata.entity';
import { Section } from '../../../../../shared/entities/section.entity';
import { WeightUnit } from '../../../../../shared/entities/weight-unit.entity';
import { ContractStatus } from '../../../../../shared/enums/contract-status.enum';
import { InvoicingStatus } from '../../../../../shared/enums/invoicing-status.enum';
import { SectionTypes } from '../../../../../shared/enums/section-type.enum';
import { TrancheSplitView } from '../../../../../shared/models/tranche-split-display-view';
import { AgGridService } from '../../../../../shared/services/ag-grid.service';
import { FormConfigurationProviderService } from '../../../../../shared/services/form-configuration-provider.service';
import { GridConfigurationProviderService } from '../../../../../shared/services/grid-configuration-provider.service';
import { TradingService } from '../../../../../shared/services/http-services/trading.service';
import { SnackbarService } from '../../../../../shared/services/snackbar.service';
import { UiService } from '../../../../../shared/services/ui.service';
import { AgContextualMenuComponent } from './../../../../../shared/components/ag-contextual-menu/ag-contextual-menu.component';
import { AgGridAutocompleteComponent } from './../../../../../shared/components/ag-grid/autocomplete/ag-grid-autocomplete.component';
import { ChildSectionsSearchResult } from './../../../../../shared/dtos/chilesection-search-result';
import { WINDOW } from './../../../../../shared/entities/window-injection-token';
import { SplitCreateAndAllocateService } from './../../../../../shared/services/split-create-and-allocate.service';
const moment = _moment;

@Component({
    selector: 'atlas-new-tranche-split-ag-grid',
    templateUrl: './new-tranche-split-ag-grid.component.html',
    styleUrls: ['./new-tranche-split-ag-grid.component.scss'],
})
export class NewTrancheSplitAgGridComponent extends BaseFormComponent implements OnInit, OnDestroy {
    @ViewChild('userPreferences') userPreferencesComponent: AgGridUserPreferencesComponent;

    sectionModel: Section;
    parentContractId: number;
    masterdata: MasterData;
    sectionType: number;
    isGridEditable: boolean = false;
    isGridEditableOnCondition: boolean = false;
    private physicalContractSectionSubscription: Subscription;
    childQuantityTranched = new AtlasNumber('0');
    rowModifiedIndex: number[] = [];
    shippingUserAction: string = 'shipping';
    selectedUserAction: string;
    quantityColumn: string = 'quantity';
    gridRowInvalidCount: number = 0;
    shippingStartColumn: string = 'deliveryPeriodStartDate';
    shippingEndColumn: string = 'deliveryPeriodEndDate';
    isSplitAllocated: boolean = false;
    @Input() childSections: ChildSectionsSearchResult[];
    @Output() readonly childQuantityConsumedEvent = new EventEmitter();
    @Output() readonly enableProceedButton = new EventEmitter();
    gridContext: NewTrancheSplitAgGridComponent;
    atlasAgGridParam: AtlasAgGridParam;
    newTrancheGridMenuActions: { [key: string]: string } = {
        addNewTranche: 'addLine',
        deleteTranche: 'delete',
    };
    newTrancheGridContextualMenuActions: AgContextualMenuAction[];
    childSectionList: TrancheSplitView[] = [];
    trancheGridOptions: agGrid.GridOptions;
    trancheGridCols: agGrid.ColDef[];
    componentId = 'tranchesAndSplitsGrid';
    hasGridSharing: boolean = false;
    maxLetter = 'Z';
    company: string;
    isValid: boolean;
    recordId: number = 0;
    quantityStyleChange: boolean = false;
    disableAddNewLine: boolean = false;
    errorMessage: string;
    isWeightConverted: boolean = false;

    gridComponents = {
        atrDate: CellEditorDatePickerComponent,
        atrSelect: CellEditorSelectComponent,
    };
    constructor(private route: ActivatedRoute,
        protected formConfigurationProvider: FormConfigurationProviderService,
        private splitCreateAndAllocateService: SplitCreateAndAllocateService,
        private companyManager: CompanyManagerService,
        protected dialog: MatDialog,
        protected tradingService: TradingService,
        protected snackbarService: SnackbarService,
        @Inject(WINDOW) private window: Window,
        private gridConfigurationProvider: GridConfigurationProviderService,
        private uiService: UiService,
        public gridService: AgGridService,
    ) {
        super(formConfigurationProvider);
    }

    ngOnInit() {
        this.masterdata = this.route.snapshot.data.masterdata;
        this.atlasAgGridParam = this.gridService.getAgGridParam();
        this.company = this.companyManager.getCurrentCompanyId();
        this.gridContext = this;
        this.setMenuAction();
        this.childSectionList = [];
        this.recordId = 0;

        this.gridConfigurationProvider.getConfiguration(this.company, this.componentId)
            .subscribe((configuration) => {
                // -- used later if this will become L&S maybe
                // this.columnConfiguration = configuration.columns;
                // this.configurationLoaded.emit();
                // this.initColumns(this.columnConfiguration);
                this.hasGridSharing = configuration.hasMultipleViewsPerUser;
            });

    }
    setMenuAction() {
        this.newTrancheGridContextualMenuActions = [
            {
                icon: 'delete',
                text: 'Delete',
                action: this.newTrancheGridMenuActions.deleteTranche,
            },
            {
                icon: 'add',
                text: 'Add New Line',
                disabled: this.disableAddNewLine,
                action: this.newTrancheGridMenuActions.addLine,
            },
        ];
    }

    assignValue(sectionModel: Section, sectionType: number) {
        this.isGridEditable = (sectionModel.allocatedTo === null);
        this.isGridEditableOnCondition = (sectionModel.allocatedTo === null);
        if ((sectionModel.invoicingStatusId === InvoicingStatus.Finalized
            || sectionModel.invoicingStatusId === InvoicingStatus.FinalInvoiceRequired)
            && sectionModel.allocatedTo === null) {
            this.isGridEditable = false;
            this.isGridEditableOnCondition = true;
        }
        this.sectionType = sectionType;
        this.sectionModel = sectionModel;
        this.childSectionList = [];
        this.initTrancheSplitGridCols();
        this.parentContractId = this.sectionModel.contractId;
        this.enableProceedButton.emit(true);
        this.trancheGridOptions.api.setRowData(this.childSectionList);
    }

    generateSectionNumberForTranche(latestSectionId: string): string {
        let firstCharacter: string;
        let alphabetToIncrement: string = 'A';
        const index: number = 4;
        firstCharacter = latestSectionId.charAt(0);
        if (firstCharacter !== '0') {
            let incrementNumber: number = firstCharacter.charCodeAt(0);
            incrementNumber = incrementNumber + 1;
            alphabetToIncrement = String.fromCharCode(incrementNumber);
        }
        if (alphabetToIncrement <= 'Z') {
            return alphabetToIncrement.padEnd(index, '0');
        }
        return '';
    }

    generateSectionNumberForSplit(latestSectionId: string): string {
        const startIndex: number = 1;
        const endIndex: number = 4;
        const numberToGenerate: number = Number(latestSectionId.substring(startIndex, endIndex)) + 1;
        let digitsToIncrement: string = numberToGenerate.toString();
        digitsToIncrement = digitsToIncrement.padStart(endIndex - startIndex, '0');
        return numberToGenerate > 999 ? '' : latestSectionId.charAt(0) + digitsToIncrement;
    }

    populateEntity(entity: any, childSections?: ChildSectionsSearchResult[]) {
        const section = entity as Section;
        this.isValid = true;
        // tslint:disable-next-line:prefer-conditional-expression
        if (childSections) {
            section.childSections = this.getSection(this.populateChildSection(entity, childSections));
        } else {
            section.childSections = this.getSection(this.populateChildSection());
        }
        return section;
    }

    populateChildSection(allocation?: Section, allocatedChildSections?: ChildSectionsSearchResult[]): TrancheSplitView[] {
        const section = allocation ? allocation : this.sectionModel;
        const child = allocatedChildSections ? allocatedChildSections : this.childSections;
        const physicalContractId: string = section.contractLabel.split('.')[0];
        let validationCount = 0;

        if (!this.isSplitAllocated) {
            this.childSectionList = this.childSectionList.filter((childSection) => childSection.isTouched === true);
            if (this.childSectionList.length > 0) {
                validationCount = this.childSectionList.filter((chidSection) =>
                    chidSection.deliveryPeriodStartDate > chidSection.deliveryPeriodEndDate).length;
            }
        }
        let childContractLabelId: string;
        let childSectionNumberId: string;

        if (validationCount === 0) {
            let sectionNumberId = this.sectionType === SectionTypes.Tranche ?
                this.splitCreateAndAllocateService.findLatestContractLabelForTranche(section, child) :
                this.splitCreateAndAllocateService.findLatestContractLabelForSplit(section, child);

            this.childSectionList.forEach((childSection) => {
                childSectionNumberId = this.sectionType === SectionTypes.Tranche ?
                    this.generateSectionNumberForTranche(sectionNumberId) : this.generateSectionNumberForSplit(sectionNumberId);
                if (childSectionNumberId.length > 0) {
                    childContractLabelId = physicalContractId + '.' + childSectionNumberId;
                    childSection.contractLabel = childContractLabelId;
                    childSection.sectionNumber = childSectionNumberId;
                    childSection.originalQuantity = childSection.quantity;
                    sectionNumberId = childSectionNumberId;
                } else {
                    this.errorMessage = this.sectionType === SectionTypes.Tranche ?
                        'More than 26 Tranches not allowed' :
                        'More than 999 Split not allowed';
                    this.isValid = false;
                }

            });
        } else {
            this.isValid = false;
        }

        return this.childSectionList;
    }

    reset() {
        this.childSectionList = [];
        this.onCellValueChanged(this);
    }

    ngOnDestroy(): void {
        if (this.physicalContractSectionSubscription) {
            this.physicalContractSectionSubscription.unsubscribe();
        }
    }

    getLetterFromNumber(letter: string): number {
        return letter.toLowerCase().charCodeAt(0) - 96;
    }

    addSplitOrTranches(numberOfLine: number, userAction: string, isSplitAllocated: boolean,
        allocation?: Section, allocatedChildSections?: ChildSectionsSearchResult[]) {
        this.setMenuAction();
        this.initTrancheSplitGridCols();
        let childQuantity = 0;
        this.isSplitAllocated = isSplitAllocated;
        let trancheLength;
        // tslint:disable-next-line:prefer-conditional-expression
        if (this.isSplitAllocated) {
            trancheLength = this.splitCreateAndAllocateService.findLatestContractLabelForTranche(allocation, allocatedChildSections);
        } else {
            trancheLength = this.splitCreateAndAllocateService.findLatestContractLabelForTranche(this.sectionModel, this.childSections);
        }
        if (this.sectionType === SectionTypes.Tranche && trancheLength.charAt(0) > this.maxLetter) {
            this.snackbarService.informationSnackBar('More than ' + this.getLetterFromNumber(this.maxLetter) +
                ' Tranches not allowed');
            return;
        }
        if (userAction === this.shippingUserAction && this.sectionType === SectionTypes.Tranche) {
            this.selectedUserAction = userAction;
            childQuantity = Math.floor((this.sectionModel.quantity / numberOfLine) * 100) / 100;
        }
        let startDeliveryDate: _moment.Moment = moment(this.sectionModel.deliveryPeriodStartDate);
        for (let count = 1; count <= numberOfLine; count++) {
            if (userAction === this.shippingUserAction && count === numberOfLine && this.sectionType === SectionTypes.Tranche) {
                const remainingQuantity: number = (this.sectionModel.quantity) - (childQuantity * (numberOfLine - 1));
                childQuantity = Math.round(remainingQuantity * 100) / 100;
            }
            this.recordId = this.recordId + 1;
            const rowDataItem = new TrancheSplitView(this.sectionModel, childQuantity, this.recordId, this.sectionType);
            if (userAction === this.shippingUserAction) {
                rowDataItem.isTouched = true;
                if (count === numberOfLine) {
                    rowDataItem.deliveryPeriodStartDate = moment(rowDataItem.deliveryPeriodEndDate).startOf('month').toDate();
                } else if (count === 1) {
                    rowDataItem.deliveryPeriodEndDate = moment(rowDataItem.deliveryPeriodStartDate).endOf('month').toDate();
                } else {
                    startDeliveryDate = startDeliveryDate.add(1, 'months');
                    rowDataItem.deliveryPeriodEndDate = startDeliveryDate.endOf('month').toDate();
                    rowDataItem.deliveryPeriodStartDate = startDeliveryDate.startOf('month').toDate();
                }
            }
            this.childSectionList.push(rowDataItem);
            this.trancheGridOptions.api.updateRowData({ add: [rowDataItem] });
            this.trancheGridOptions.columnApi.autoSizeAllColumns();
        }

        if (userAction === this.shippingUserAction) {
            this.onCellValueChanged(this);
        }
    }

    numberParser(params) {
        if (params.newValue) {
            const newValue = params.newValue.length > 0 ? parseFloat(params.newValue) : null;

            if (newValue) {
                return newValue;
            }
            params.newValue = 0;
            return 0;
        }
        return null;
    }

    quantityValidation(val) {
        this.childQuantityTranched = new AtlasNumber('0');
        this.childSectionList.forEach((element) => {
            if (this.sectionModel.weightUnitId === element.weightUnitId) {
                this.childQuantityTranched.plus(new AtlasNumber(element.quantity.toString()));
            } else {
                const conversionFactor: number = this.masterdata.weightUnits.find((commodities) =>
                    commodities.weightUnitId === element.weightUnitId).conversionFactor;
                const parentConversionFactor = this.masterdata.weightUnits.find((commodities) =>
                    commodities.weightUnitId === this.sectionModel.weightUnitId).conversionFactor;
                const convertedWeight = (element.quantity * conversionFactor) / parentConversionFactor;
                this.childQuantityTranched.plus(new AtlasNumber(convertedWeight.toString()));
            }
        });
        if (this.selectedUserAction === this.shippingUserAction) {
            this.childQuantityTranched = new AtlasNumber(this.childQuantityTranched.toString());
        }
        const conditionToHighlight = this.sectionModel.quantity - Number(this.childQuantityTranched);
        this.quantityStyleChange = true;
        if (val === 0) {
            return 'Quantity should not be 0';
        } else if (this.sectionModel.quantity < Number(this.childQuantityTranched)) {
            this.quantityStyleChange = true;
            return 'Child quantity cannot be more than the parent quantity';
        } else if (conditionToHighlight < 0) {
            this.quantityStyleChange = true;
            return 'Total child quantity cannot be more than the parent quantity';
        } else {
            this.quantityStyleChange = false;
            return null;
        }

    }

    onGridReady(params) {
        this.trancheGridOptions = params;
        this.trancheGridOptions.columnDefs = this.trancheGridCols;
        this.trancheGridOptions.columnApi.autoSizeAllColumns();

        window.onresize = () => {
            this.trancheGridOptions.columnApi.autoSizeAllColumns();
        };
    }

    onGridSizeChanged(params) {
        this.trancheGridOptions.columnApi.autoSizeAllColumns();
    }

    onCellValueChanged(event) {
        const rowIndex: number = event.rowIndex;
        if (event.colDef) {
            this.childSectionList[rowIndex].isTouched = true;
            const newValue: string = event.newValue;
            const columnChanged: string = event.colDef.field;
            const oldValue: any = this.sectionModel[columnChanged];
            if (columnChanged !== this.quantityColumn && columnChanged !== this.shippingStartColumn && newValue !== oldValue) {
                this.childSectionList[rowIndex].status = ContractStatus.Unapproved;
            }
            if ((columnChanged === this.shippingStartColumn || columnChanged === this.shippingEndColumn) && newValue !== oldValue) {
                if (this.childSectionList[rowIndex].deliveryPeriodStartDate > this.childSectionList[rowIndex].deliveryPeriodEndDate) {
                    this.snackbarService.throwErrorSnackBar('Shipping Start Date cannot be greater than Shipping End Date');
                }
            }
        }
        this.childQuantityValidation();

        if (this.rowModifiedIndex.indexOf(rowIndex) === -1) {
            this.rowModifiedIndex.push(rowIndex);
        }
    }

    childQuantityValidation() {
        this.childQuantityTranched = new AtlasNumber('0');
        this.childSectionList.forEach((element) => {
            if (this.sectionModel.weightUnitId === element.weightUnitId) {
                this.childQuantityTranched.plus(new AtlasNumber(element.quantity.toString()));
            } else {
                const conversionFactor: number = this.masterdata.weightUnits.find(
                    (commodities) => commodities.weightUnitId === element.weightUnitId).conversionFactor;
                const parentConversionFactor = this.masterdata.weightUnits.find(
                    (commodities) => commodities.weightUnitId === this.sectionModel.weightUnitId).conversionFactor;
                const convertedWeight = (element.quantity * conversionFactor) / parentConversionFactor;
                this.childQuantityTranched.plus(new AtlasNumber(convertedWeight.toString()));
                this.isWeightConverted = (Number(this.childQuantityTranched) > this.sectionModel.quantity) ? false : true;
            }
        });
        if (this.selectedUserAction === this.shippingUserAction) {
            this.childQuantityTranched = new AtlasNumber(this.childQuantityTranched.toString());
        }
        if (Number(this.childQuantityTranched) > this.sectionModel.quantity) {
            this.snackbarService.throwErrorSnackBar(this.sectionType === SectionTypes.Tranche ?
                'Cannot tranche more quantity than available parent quantity' :
                'Cannot split more quantity than available parent quantity');
        }
        this.disableAddNewLine = false;
        if ((this.sectionModel.quantity - Number(this.childQuantityTranched)) <= 0) {
            this.disableAddNewLine = true;
        }
        this.setMenuAction();
        this.initTrancheSplitGridCols();
        this.childQuantityConsumedEvent.emit({
            childQuantityConsumed: Number(this.childQuantityTranched),
            isWeightConverted: this.isWeightConverted,
        });
    }

    onQuantityCodeChanged(params) {
        const selectedQuantity = this.masterdata.weightUnits.find(
            (e) => e.weightUnitId === params.data.weightUnitId);
        if (selectedQuantity) {
            this.childQuantityValidation();
        }
    }

    initTrancheSplitGridCols() {
        this.trancheGridCols = [
            {
                headerName: 'Quantity',
                colId: 'quantity',
                field: 'quantity',
                type: 'numericColumn',
                editable: true,
                valueFormatter: this.quantityFormatter.bind(this),
                valueParser: this.numberParser,
                cellClassRules: {
                    'ag-grid-invalid-mandatory-field': (() => this.quantityStyleChange),
                    'ag-grid-valid-mandatory-field': (() => !this.quantityStyleChange),
                },

                tooltip: (params) => {
                    return this.quantityValidation(params.value);
                },
            },
            {
                headerName: 'Quantity Code',
                colId: 'quantityCode',
                field: 'weightUnitId',
                cellRendererFramework: AgGridAutocompleteComponent,
                cellRendererParams: {
                    context: {
                        componentParent: this,
                        gridEditable: this.isGridEditable,
                    },
                    options: this.masterdata.weightUnits,
                    valueProperty: 'weightUnitId',
                    codeProperty: 'weightCode',
                    displayProperty: 'description',
                    displayCode: true,
                    valueIsId: true,
                    isRequired: true,
                },
                onCellValueChanged: this.onQuantityCodeChanged.bind(this),
            },
            {
                headerName: 'Shipping Period Type',
                colId: 'periodTypeCode',
                field: 'periodTypeCode',
                editable: this.isGridEditableOnCondition,
                cellEditor: 'agRichSelectCellEditor',
                cellRenderer: this.periodTypeFormatter.bind(this),
                cellEditorParams: (params) => {
                    return {
                        values: this.masterdata.periodTypes.map((periodTypes) => periodTypes.periodTypeDescription),
                        displayPropertyName: 'periodTypeDescription',
                        valuePropertyName: 'periodTypeCode',
                        displayFormat: 'periodTypeDescription',
                    };
                },
            },
            {
                headerName: 'Shipping Start Date',
                colId: 'shippingStartDate',
                field: 'deliveryPeriodStartDate',
                editable: this.isGridEditable,
                valueFormatter: this.uiService.dateFormatter,
                cellEditor: 'atrDate',
            },
            {
                headerName: 'Shipping End Date',
                colId: 'shippingEndDate',
                field: 'deliveryPeriodEndDate',
                editable: this.isGridEditable,
                valueFormatter: this.uiService.dateFormatter,
                cellEditor: 'atrDate',
            },
            {
                headerName: 'Commodity 1',
                colId: 'commodity',
                field: 'commodityId',
                cellRendererFramework: AgGridAutocompleteComponent,
                cellRendererParams: {
                    context: {
                        componentParent: this,
                        gridEditable: this.isGridEditable,
                    },
                    options: this.masterdata.commodities,
                    valueProperty: 'commodityId',
                    codeProperty: 'principalCommodity',
                    displayProperty: 'description',
                    isRequired: true,
                    displayCode: true,
                    valueIsId: true,
                },
                onCellValueChanged: (params) => {
                    params.api.refreshCells();
                },
            },
            {
                headerName: 'Commodity 2',
                field: 'commodityId',
                colId: 'part2',
                editable: false,
                valueFormatter: this.commoditys2ValueFormatter,
            },
            {
                headerName: 'Commodity 3',
                field: 'commodityId',
                colId: 'part3',
                editable: false,
                valueFormatter: this.commoditys3ValueFormatter,
            },
            {
                headerName: 'Commodity 4',
                field: 'commodityId',
                colId: 'part4',
                valueFormatter: this.commoditys4ValueFormatter,
                editable: false,
            },
            {
                headerName: 'Commodity 5',
                field: 'commodityId',
                colId: 'part5',
                valueFormatter: this.commoditys5ValueFormatter,
                editable: false,
            },
            {
                headerName: 'Crop Year',
                colId: 'cropYear',
                field: 'cropYear',
                type: 'numericColumn',
                editable: this.isGridEditableOnCondition,
            },
            {
                headerName: 'Currency',
                colId: 'currency',
                field: 'currency',
                cellRendererFramework: AgGridAutocompleteComponent,
                cellRendererParams: {
                    context: {
                        componentParent: this,
                        gridEditable: this.isGridEditable,
                    },
                    options: this.masterdata.currencies,
                    valueProperty: 'currencyCode',
                    codeProperty: 'currencyCode',
                    displayProperty: 'description',
                    displayCode: true,
                    isRequired: true,
                },
                onCellValueChanged: (params) => {
                },
            },
            {
                headerName: 'Price Code',
                colId: 'priceCode',
                field: 'priceUnitId',
                cellRendererFramework: AgGridAutocompleteComponent,
                cellRendererParams: {
                    context: {
                        componentParent: this,
                        gridEditable: this.isGridEditable,
                    },
                    options: this.masterdata.priceUnits,
                    valueProperty: 'priceUnitId',
                    codeProperty: 'priceCode',
                    displayProperty: 'description',
                    displayCode: true,
                    isRequired: true,
                    valueIsId: true,
                },
                onCellValueChanged: (params) => {
                },
            },
            {
                headerName: 'Price',
                colId: 'price',
                field: 'price',
                type: 'numericColumn',
                editable: this.isGridEditable,
                valueFormatter: this.amountFormatter.bind(this),
            },
            {
                headerName: 'Port of origin',
                colId: 'portOrigin',
                field: 'portOfOrigin',
                cellRendererFramework: AgGridAutocompleteComponent,
                cellRendererParams: {
                    context: {
                        componentParent: this,
                        gridEditable: this.isGridEditableOnCondition,
                    },
                    options: this.masterdata.ports,
                    valueProperty: 'portCode',
                    codeProperty: 'portCode',
                    displayProperty: 'description',
                    displayCode: true,
                    isRequired: false,
                },
                onCellValueChanged: (params) => {
                },
            },
            {
                headerName: 'Port of destination',
                colId: 'portDestination',
                field: 'portOfDestination',
                cellRendererFramework: AgGridAutocompleteComponent,
                cellRendererParams: {
                    context: {
                        componentParent: this,
                        gridEditable: this.isGridEditableOnCondition,
                    },
                    options: this.masterdata.ports,
                    valueProperty: 'portCode',
                    codeProperty: 'portCode',
                    displayProperty: 'description',
                    displayCode: true,
                    isRequired: false,
                },
                onCellValueChanged: (params) => {
                },
            },
            {
                headerName: 'Contract Term',
                colId: 'contractTerm',
                field: 'contractTerms',
                cellRendererFramework: AgGridAutocompleteComponent,
                cellRendererParams: {
                    context: {
                        componentParent: this,
                        gridEditable: this.isGridEditable,
                    },
                    options: this.masterdata.contractTerms,
                    valueProperty: 'contractTermCode',
                    codeProperty: 'contractTermCode',
                    displayProperty: 'description',
                    displayCode: true,
                    isRequired: false,
                },
                onCellValueChanged: (params) => {
                },
            },
            {
                headerName: 'Contract Terms port',
                colId: 'contractTermsLocation',
                field: 'contractTermsLocation',
                cellRendererFramework: AgGridAutocompleteComponent,
                cellRendererParams: {
                    context: {
                        componentParent: this,
                        gridEditable: this.isGridEditableOnCondition,
                    },
                    options: this.masterdata.ports,
                    valueProperty: 'portCode',
                    codeProperty: 'portCode',
                    displayProperty: 'description',
                    displayCode: true,
                    isRequired: true,
                },
                onCellValueChanged: (params) => {
                },
            },
            {
                headerName: 'Arbitration',
                colId: 'arbitration',
                field: 'arbitration',
                cellRendererFramework: AgGridAutocompleteComponent,
                cellRendererParams: {
                    context: {
                        componentParent: this,
                        gridEditable: this.isGridEditableOnCondition,
                    },
                    options: this.masterdata.arbitrations,
                    valueProperty: 'arbitrationCode',
                    codeProperty: 'arbitrationCode',
                    displayProperty: 'description',
                    displayCode: true,
                },
                onCellValueChanged: (params) => {
                },
            },
            {
                headerName: 'Payment Term',
                colId: 'paymentTerms',
                field: 'paymentTerms',
                cellRendererFramework: AgGridAutocompleteComponent,
                cellRendererParams: {
                    context: {
                        componentParent: this,
                        gridEditable: this.isGridEditableOnCondition,
                    },
                    options: this.masterdata.paymentTerms,
                    valueProperty: 'paymentTermCode',
                    codeProperty: 'paymentTermCode',
                    displayProperty: 'description',
                    displayCode: true,
                    isRequired: true,
                },
                onCellValueChanged: (params) => {
                },
            },
            {
                headerName: 'Market Zone',
                colId: 'marketZone',
                field: 'marketSectorId',
                cellRendererFramework: AgGridAutocompleteComponent,
                cellRendererParams: {
                    context: {
                        componentParent: this,
                        gridEditable: this.isGridEditableOnCondition,
                    },
                    options: this.masterdata.businessSectors,
                    valueProperty: 'sectorId',
                    codeProperty: 'sectorCode',
                    displayProperty: 'description',
                    displayCode: true,
                    isRequired: false,
                    valueIsId: true,
                },
                onCellValueChanged: (params) => {
                },
            },
            {
                headerName: 'Client Reference',
                colId: 'clientReference',
                field: 'counterpartyReference',
                type: 'numericColumn',
                editable: this.isGridEditableOnCondition,
            },
            {
                headerName: '',
                cellRendererFramework: AgContextualMenuComponent,
                cellRendererParams: {
                    context: {
                        componentParent: this,
                    },
                    menuActions: this.newTrancheGridContextualMenuActions,
                },
                cellClass: 'ag-contextual-menu',
                width: 80,
            },
        ];
    }

    handleAction(action: string, tranche: TrancheSplitView) {
        switch (action) {
            case this.newTrancheGridMenuActions.addLine:
                const confirmAddLineDialog = this.dialog.open(ConfirmationDialogComponent, {
                    data: {
                        title: this.sectionType === SectionTypes.Tranche ? 'Tranche Addition' : 'Split Addition',
                        text: this.sectionType === SectionTypes.Tranche ?
                            'Are you sure you want to add a new tranche?' : 'Are you sure you want to add a new split?',
                        okButton: 'Add Line',
                        cancelButton: 'Cancel',
                    },
                });
                confirmAddLineDialog.afterClosed().subscribe((answer) => {
                    if (answer) {
                        this.addSplitOrTranches(1, 'addLines', false);
                    }
                });
                break;
            case this.newTrancheGridMenuActions.deleteTranche:
                const confirmDialog = this.dialog.open(ConfirmationDialogComponent, {
                    data: {
                        title: this.sectionType === SectionTypes.Tranche ? 'Tranche Deletion' : 'Split Deletion',
                        text: this.sectionType === SectionTypes.Tranche ?
                            'Are you sure you want to delete this tranche?' : 'Are you sure you want to delete this split?',
                        okButton: 'Delete anyway',
                        cancelButton: 'Cancel',
                    },
                });
                confirmDialog.afterClosed().subscribe((answer) => {
                    if (answer) {
                        this.trancheGridOptions.api.updateRowData({ remove: [tranche] });
                        this.childSectionList = this.childSectionList.filter((element) => tranche.id !== element.id);
                        this.onCellValueChanged(this);
                    }
                });
                break;
            default:
                break;
        }
    }

    getSection(trancheSplitList: TrancheSplitView[]): Section[] {
        let childSectionList: Section[];
        childSectionList = [];
        trancheSplitList.forEach((section) => {
            const childSection: Section = new Section();
            childSection.contractType = section.contractType;
            childSection.contractLabel = section.contractLabel;
            childSection.contractId = section.contractId;
            childSection.commodityId = section.commodityId;
            childSection.sectionNumber = section.sectionNumber;
            childSection.status = section.status;
            childSection.firstApprovalDateTime = section.firstApprovalDateTime;
            childSection.departmentId = section.departmentId;
            childSection.buyerCode = section.buyerCode;
            childSection.sellerCode = section.sellerCode;
            childSection.counterpartyReference = section.counterpartyReference;
            childSection.originalQuantity = section.originalQuantity;
            childSection.quantity = section.quantity;
            childSection.portOfOrigin = section.portOfOrigin;
            childSection.portOfDestination = section.portOfDestination;
            childSection.deliveryPeriodStartDate = section.deliveryPeriodStartDate;
            childSection.deliveryPeriodEndDate = section.deliveryPeriodEndDate;
            childSection.positionMonthType = section.positionMonthType;
            childSection.positionMonthIndex = section.positionMonthIndex;
            childSection.cropYear = section.cropYear;
            childSection.packingCode = section.packingCode;
            childSection.periodTypeId = section.periodTypeId;
            childSection.contractTerms = section.contractTerms;
            childSection.contractTermsLocation = section.contractTermsLocation;
            childSection.periodTypeId = section.periodTypeId;
            childSection.arbitration = section.arbitration;
            childSection.pricingMethod = section.pricingMethod;
            childSection.paymentTerms = section.paymentTerms;
            childSection.currencyCode = section.currency;
            childSection.price = section.price;
            childSection.blDate = section.blDate;
            childSection.allocatedToId = section.allocatedToId;
            childSection.allocatedTo = section.allocatedTo;
            childSection.allocationDate = section.allocationDate;
            childSection.assignedCharterReference = section.assignedCharterReference;
            childSection.charterAssignmentDate = section.charterAssignmentDate;
            childSection.createdBy = section.createdBy;
            childSection.creationDate = section.creationDate;
            childSection.lastModifiedBy = section.lastModifiedBy;
            childSection.lastModifiedDate = section.lastModifiedDate;
            childSection.header = section.header;
            childSection.sectionOriginId = section.sectionOriginId;
            childSection.contractLabelOrigin = section.contractLabelOrigin;
            childSection.premiumDiscountValue = section.premiumDiscountValue;
            childSection.premiumDiscountCurrency = section.premiumDiscountCurrency;
            childSection.premiumDiscountBasis = section.premiumDiscountBasis;
            childSection.memorandum = section.memorandum;
            childSection.contractedValue = section.contractedValue;
            childSection.weightUnitId = section.weightUnitId;
            childSection.priceUnitId = section.priceUnitId;
            childSection.marketSectorId = section.marketSectorId;
            childSection.sectionTypeId = section.sectionTypeId;
            childSection.costs = section.costs;
            childSection.currency = section.currency;
            childSectionList.push(childSection);
        });

        return childSectionList;
    }

    weightUnitDescriptionValueFormatter(params): string {
        if (params) {
            const weightUnit: WeightUnit = this.masterdata.weightUnits.find((weightUnits) =>
                weightUnits.weightUnitId === params);
            return weightUnit.description;
        }
    }

    periodTypeFormatter(params) {
        if (params.value && params.value.length === 1) {
            const periodType = params.context.masterdata.periodTypes.find((periodTypes) =>
                periodTypes.periodTypeCode === params.value);
            params.value = (periodType ? periodType.periodTypeDescription : '');
        }
        return params.value;
    }

    commoditys2ValueFormatter(params): string {
        if (params.value) {
            const commodity = params.context.masterdata.commodities.find((commodities) =>
                commodities.commodityId === params.value);
            params.value = (commodity ? commodity.part2 : '');
        }
        return params.value;
    }

    commoditys3ValueFormatter(params): string {
        if (params.value) {
            const commodity = params.context.masterdata.commodities.find((commodities) =>
                commodities.commodityId === params.value);
            params.value = (commodity ? commodity.part3 : '');
        }
        return params.value;
    }

    commoditys4ValueFormatter(params): string {
        if (params.value) {
            const commodity = params.context.masterdata.commodities.find((commodities) =>
                commodities.commodityId === params.value);
            params.value = (commodity ? commodity.part4 : '');
        }
        return params.value;
    }

    commoditys5ValueFormatter(params): string {
        if (params.value) {
            const commodity = params.context.masterdata.commodities.find((commodities) =>
                commodities.commodityId === params.value);
            params.value = (commodity ? commodity.part5 : '');
        }
        return params.value;
    }

    amountFormatter(param) {
        if (param.value) {
            const commonMethods = new CommonMethods();
            return commonMethods.getFormattedNumberValue(param.value, 2);
        }
    }

    quantityFormatter(param) {
        if (param.value) {
            const commonMethods = new CommonMethods();
            return commonMethods.getFormattedNumberValue(param.value, 3);
        }
    }

    onColumnVisibilityChanged(col) {
        this.userPreferencesComponent.onChangeColumnVisibility(col);
    }
}
