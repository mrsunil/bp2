import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import * as agGrid from 'ag-grid-community';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthorizationService } from '../../../../../../app/core/services/authorization.service';
import { CompanyManagerService } from '../../../../../../app/core/services/company-manager.service';
import { AgContextualMenuComponent } from '../../../../../shared/components/ag-contextual-menu/ag-contextual-menu.component';
import { AgGridCheckboxComponent } from '../../../../../shared/components/ag-grid-checkbox/ag-grid-checkbox.component';
import { BaseFormComponent } from '../../../../../shared/components/base-form-component/base-form-component.component';
import { CellEditorNumericComponent } from '../../../../../shared/components/cell-editor-numeric/cell-editor-numeric.component';
import { CellEditorSelectComponent } from '../../../../../shared/components/cell-editor-select/cell-editor-select.component';
import { ConfirmationDialogComponent } from '../../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { FlagInfo } from '../../../../../shared/dtos/flag-info';
import { AgContextualMenuAction } from '../../../../../shared/entities/ag-contextual-menu-action.entity';
import { AtlasAgGridParam } from '../../../../../shared/entities/atlas-ag-grid-param.entity';
import { IsLocked } from '../../../../../shared/entities/is-locked.entity';
import { LockFunctionalContext } from '../../../../../shared/entities/lock-functional-context.entity';
import { LockResourceInformation } from '../../../../../shared/entities/lock-resource-information.entity';
import { Tag } from '../../../../../shared/entities/tag.entity';
import { UserGridPreferencesParameters } from '../../../../../shared/entities/user-grid-preferences-parameters.entity';
import { Gaps } from '../../../../../shared/enums/gaps.enum';
import { FormatDatePipe } from '../../../../../shared/pipes/format-date-pipe.pipe';
import { AgGridService } from '../../../../../shared/services/ag-grid.service';
import { FormConfigurationProviderService } from '../../../../../shared/services/form-configuration-provider.service';
import { FeatureFlagService } from '../../../../../shared/services/http-services/feature-flag.service';
import { LockService } from '../../../../../shared/services/http-services/lock.service';
import { MasterdataService } from '../../../../../shared/services/http-services/masterdata.service';
import { TradingService } from '../../../../../shared/services/http-services/trading.service';
import { SecurityService } from '../../../../../shared/services/security.service';
import { SnackbarService } from '../../../../../shared/services/snackbar.service';
import { Costmatrix } from '../../../../../shared/services/trading/dtos/costmatrix';
import { MasterData } from './../../../../../shared/entities/masterdata.entity';

@Component({
    selector: 'atlas-costmatrix-list',
    templateUrl: './costmatrix-list.component.html',
    styleUrls: ['./costmatrix-list.component.scss'],
    providers: [DatePipe],
})
export class CostmatrixListComponent extends BaseFormComponent implements OnInit, OnDestroy {
    static i: number;
    costsMenuActions: { [key: string]: string } = {
        deleteCostMatrix: 'delete',
        editCostMatrix: 'edit',
        imageCostMatrix: 'image',
    };

    costGridOptions: agGrid.GridOptions;
    costsGridCols: agGrid.ColDef[];
    costsGridRows: Costmatrix[];
    gridApi: agGrid.GridApi;
    gridColumnApi: agGrid.ColumnApi;
    costmatricesGridContextualMenuActions: AgContextualMenuAction[];
    atlasAgGridParam: AtlasAgGridParam;
    company: string;
    costmatrix: Costmatrix[];
    isDirty: boolean;
    costmatrixId: number;
    searchCostMatrixName: string;
    searchCostMatrixDescription: string;
    searchCostMatrixForm: FormGroup;
    isLoading: boolean;
    isCostMatrixEditPrivilege = false;

    gridContext = {
        isContractApprovedOnce: false,
        deletePrivileges: true,
    };

    gridComponents = {
        atlasSelect: CellEditorSelectComponent,
        atlasNumeric: CellEditorNumericComponent,
        atlasCheckbox: AgGridCheckboxComponent,
    };
    userActiveDirectoryName: string;
    excelStyles: any;
    destroy$ = new Subject();
    resourcesInformation: LockResourceInformation[] = new Array<LockResourceInformation>();
    tagFields: any;
    tagsList: any;
    gridPreferencesParameters: UserGridPreferencesParameters;
    gridCode = 'costMatrixList';
    flagAuth: FlagInfo;
    masterdata: MasterData;

    constructor(
        private companyManager: CompanyManagerService,
        private route: ActivatedRoute,
        private router: Router,
        protected formConfigurationProvider: FormConfigurationProviderService,
        private tradingService: TradingService,
        private snackbarService: SnackbarService,
        protected dialog: MatDialog,
        private formBuilder: FormBuilder,
        private datePipe: DatePipe,
        private authorizationService: AuthorizationService,
        private formatDate: FormatDatePipe,
        protected lockService: LockService,
        protected securityService: SecurityService,
        public gridService: AgGridService,
        private masterdataService: MasterdataService,
        private featureFlagService: FeatureFlagService,
    ) {
        super(formConfigurationProvider);
        this.searchCostMatrixForm = this.formBuilder.group({
            searchCostMatrixNameCtrl: [''],
            searchCostMatrixDescriptionCtrl: [''],
        });
        this.excelStyles = [
            {
                id: 'dateFormat',
                dataType: 'dateTime',
                numberFormat: {
                    format: 'dd/mm/yyyy',
                },
            },
        ];
        this.userActiveDirectoryName = this.authorizationService.getCurrentUser().samAccountName;
    }

    ngOnInit() {
        this.masterdata = this.route.snapshot.data.masterdata;
        this.tagFields = this.getTagFields();
        this.tagFields.subscribe((val) => {
            this.tagsList = val;
        });
        this.atlasAgGridParam = this.gridService.getAgGridParam();
        this.company = this.route.snapshot.paramMap.get('company');
        this.securityService.isSecurityReady().subscribe(() => {

            if (this.authorizationService.isPrivilegeAllowed(this.company, 'Trades')
                && this.authorizationService.isPrivilegeAllowed(this.company, 'CostMatrices')) {
                this.isCostMatrixEditPrivilege = this.authorizationService.isPrivilegeAllowed(this.company, 'EditCostMatrices');
            }
        });
        this.costmatrixId = Number(this.route.snapshot.paramMap.get('costmatrixId'));
        this.isLoading = true;
        this.init();
        this.featureFlagService.getFlagInfo(Gaps.gap003).subscribe((flagAuth) => {
            this.flagAuth = flagAuth;
            this.initializeGridColumns();
            this.getCostMatrixList();
        });
    }

    initializeGridColumns() {
        if (this.flagAuth && this.flagAuth.active) {
            this.costsGridCols = [
                {
                    colId: 'name',
                    headerName: 'Name',
                    field: 'name',
                },
                {
                    colId: 'description',
                    headerName: 'Description',
                    field: 'description',
                },
                {
                    colId: 'tags',
                    headerName: 'Parameters',
                    cellStyle: { overflow: 'hidden' },
                    field: 'tags',
                    tooltip: (params) => {
                        if (params.data.tags) {
                            return this.paramsToChip(params.data.tags).join(' ');
                        }
                        return '';
                    },
                    valueGetter: (params) => {
                        if (params.data.tags) {
                            return this.paramsToChip(params.data.tags).join(' ');
                        }
                        return '';
                    },
                },
                {
                    colId: 'setupby',
                    headerName: 'Set up by',
                    field: 'createdBy',
                },
                {
                    colId: 'setupDate',
                    headerName: 'Set up date',
                    field: 'createdDateTime',
                    cellClass: 'dateFormat',
                    valueGetter: (params) => {
                        const dateFormat: FormatDatePipe = this.formatDate;
                        const val = dateFormat.transformdate(params.data.createdDateTime);

                        if (val && val.indexOf('/') < 0) {
                            return val;
                        }
                        const split = val.split('/');
                        return split[2] + '-' + split[1] + '-' + split[0];
                    },
                },
                {
                    colId: 'menu',
                    headerName: '',
                    cellRendererFramework: AgContextualMenuComponent,
                    cellRendererParams: {
                        context: {
                            componentParent: this,
                            actionContext: this.gridContext,
                        },
                        menuActions: this.costmatricesGridContextualMenuActions,
                        showIcon: this.isCostMatrixEditPrivilege,
                    },
                    cellClass: 'ag-contextual-menu',
                    width: 80,
                    minWidth: 80,
                    maxWidth: 80,
                },
            ];
        } else {
            this.costsGridCols = [
                {
                    colId: 'name',
                    headerName: 'Name',
                    field: 'name',
                },
                {
                    colId: 'description',
                    headerName: 'Description',
                    field: 'description',
                },
                {
                    colId: 'setupBy',
                    headerName: 'Set up by',
                    field: 'createdBy',
                },
                {
                    colId: 'setupDate',
                    headerName: 'Set up date',
                    field: 'createdDateTime',
                    cellClass: 'dateFormat',
                    valueGetter: (params) => {
                        const dateFormat: FormatDatePipe = this.formatDate;
                        const val = dateFormat.transformdate(params.data.createdDateTime);

                        if (val && val.indexOf('/') < 0) {
                            return val;
                        }
                        const split = val.split('/');
                        return split[2] + '-' + split[1] + '-' + split[0];
                    },
                },
                {
                    colId: 'menu',
                    headerName: '',
                    cellRendererFramework: AgContextualMenuComponent,
                    cellRendererParams: {
                        context: {
                            componentParent: this,
                            actionContext: this.gridContext,
                        },
                        menuActions: this.costmatricesGridContextualMenuActions,
                        showIcon: this.isCostMatrixEditPrivilege,
                    },
                    cellClass: 'ag-contextual-menu',
                    width: 80,
                    minWidth: 80,
                    maxWidth: 80,
                },
            ];
        }

        if (this.costGridOptions) {
            this.costGridOptions.columnDefs = this.costsGridCols;
        }
    }

    onSearchButtonClicked() {
        this.searchCostMatrixName = this.searchCostMatrixForm.get('searchCostMatrixNameCtrl').value.toUpperCase();
        this.searchCostMatrixDescription = this.searchCostMatrixForm.get('searchCostMatrixDescriptionCtrl').value.toUpperCase();
        if (!this.searchCostMatrixName && !this.searchCostMatrixDescription) {
            return;
        }
        if (this.costmatrix && this.costmatrix.length > 0) {
            const rows = this.costmatrix.filter(
                (item) =>
                    item.name
                        .toString()
                        .toUpperCase()
                        .includes(this.searchCostMatrixName) &&
                    item.description
                        .toString()
                        .toUpperCase()
                        .includes(this.searchCostMatrixDescription),
            );
            this.costsGridRows = rows;
        }
    }

    onGridReady(params) {
        this.costGridOptions = params;
        if (this.costsGridCols) {
            this.costGridOptions.columnDefs = this.costsGridCols;
        }
        this.gridApi = this.costGridOptions.api;
        this.gridColumnApi = this.costGridOptions.columnApi;

    }

    setColumnsToFitGrid() {
        this.gridApi.sizeColumnsToFit();
    }

    getCostMatrixList() {
        this.tradingService.getCostmatricesByCompanyId(this.company).subscribe((data) => {
            this.costmatrix = data.value;
            if (this.flagAuth && this.flagAuth.active) {
                CostmatrixListComponent.i = this.costmatrix.length;
                this.costmatrix.forEach((element) => {
                    this.tradingService.GetCostMatricesListWithTags(element.costMatrixId).subscribe(
                        (valsTags) => {
                            if (valsTags && valsTags.length > 0) {
                                element.tags = valsTags[0].tags as Tag[];
                                CostmatrixListComponent.i--;
                                if (CostmatrixListComponent.i === 0) {
                                    this.costsGridRows = this.costmatrix;
                                    this.isLoading = false;
                                }
                            }
                        },
                        (error) => {
                            CostmatrixListComponent.i--;
                        },
                    );
                });
            } else {
                this.costsGridRows = this.costmatrix;
                this.isLoading = false;
            }
        });
    }

    paramsToChip(val: Tag[]): string[] {
        let chip: string;
        const chips = new Array<string>();
        let typenameActual: string;
        if (this.tagsList && val) {
            val.forEach((param) => {
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
                    list = this.masterdata.contractTerms;
                    break;
                case 'TradeDto.Type':
                    paramName = 'enumEntityValue';
                    paramid = 'enumEntityId';
                    list = this.masterdata.contractTypes;
                    break;
                case 'SectionDto.PaymentTermCode':
                    paramName = 'paymentTermCode';
                    paramid = 'paymentTermsId';
                    list = this.masterdata.paymentTerms;
                    break;
                case 'SectionDto.CounterpartyReference':
                    paramName = 'counterpartyCode';
                    paramid = 'counterpartyID';
                    list = this.masterdata.counterparties;
                    break;
                case 'SectionDto.PortDestinationCode':
                case 'SectionDto.PortOriginCode':
                    paramName = 'portCode';
                    paramid = 'portId';
                    list = this.masterdata.ports;
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
            newTagValueId.push(list.find((val) => val[paramId] === Number(id))[paramName]);
        });
        return newTagValueId.join();
    }
    /**
     * Recover the tagfields of the parameters table
     */
    getTagFields() {
        return this.tradingService.getTagFields();
    }

    init() {
        this.costmatricesGridContextualMenuActions = [
            {
                icon: 'edit',
                text: 'Edit',
                action: this.costsMenuActions.editCostMatrix,
            },
            {
                icon: 'delete',
                text: 'Delete',
                action: this.costsMenuActions.deleteCostMatrix,
            },
            {
                icon: 'add',
                text: 'Image',
                action: this.costsMenuActions.imageCostMatrix,
            },
        ];

        this.gridPreferencesParameters = {
            company: this.company,
            gridId: this.gridCode,
            gridOptions: null,
            savingEnabled: false,
            sharingEnabled: false,
            showExport: true,
            hasColumnHandling: false,
        };
    }

    handleAction(action: string, costMatrix: Costmatrix) {
        switch (action) {
            case this.costsMenuActions.editCostMatrix:
                const costMatrixId = costMatrix.costMatrixId;
                this.lockService
                    .isLockedCostMatrix(costMatrix.costMatrixId)
                    .pipe(takeUntil(this.destroy$))
                    .subscribe((lock: IsLocked) => {
                        if (lock.isLocked) {
                            this.dialog.open(ConfirmationDialogComponent, {
                                data: {
                                    title: 'Lock',
                                    text: lock.message,
                                    okButton: 'Got it',
                                },
                            });
                        } else {
                            this.router.navigate(['/' + this.company + '/trades/costmatrix/edit/', costMatrixId]);
                        }
                    });

                break;

            case this.costsMenuActions.deleteCostMatrix:
                const costMatrixName = costMatrix.name;
                this.lockService
                    .isLockedCostMatrix(costMatrix.costMatrixId)
                    .pipe(takeUntil(this.destroy$))
                    .subscribe((lock: IsLocked) => {
                        if (lock.isLocked) {
                            this.dialog.open(ConfirmationDialogComponent, {
                                data: {
                                    title: 'Lock',
                                    text: lock.message,
                                    okButton: 'Got it',
                                },
                            });
                        } else {
                            this.startLockRefresh(costMatrix.costMatrixId, costMatrix.name);
                            this.lockService
                                .lockCostMatrix(costMatrix.costMatrixId, LockFunctionalContext.CostMatrixDeletion)
                                .pipe(takeUntil(this.destroy$))
                                .subscribe((lockState) => {
                                    const confirmDialog = this.dialog.open(ConfirmationDialogComponent, {
                                        data: {
                                            title: 'Delete ' + costMatrixName + ' ?',
                                            text: 'Deleting a cost matrix is permanent. Do you wish to proceed?',
                                            okButton: 'DELETE ANYWAY',
                                            cancelButton: 'DISCARD',
                                        },
                                    });
                                    const confirmationSubscription = confirmDialog.afterClosed().subscribe((answer) => {
                                        this.stopLockRefresh();
                                        if (answer) {
                                            if (costMatrix.costMatrixId) {
                                                const deleteConfirmationSubscription = this.tradingService
                                                    .deleteCostMatrix(costMatrix.costMatrixId)
                                                    .subscribe(() => {
                                                        this.snackbarService.informationSnackBar('CostMatrix Deleted');
                                                        this.getCostMatrixList();
                                                    });
                                                this.subscriptions.push(deleteConfirmationSubscription);
                                            } else {
                                                this.gridApi.updateRowData({ remove: [costMatrix] });
                                            }
                                        }
                                        this.lockService
                                            .unlockCostMatrix(costMatrix.costMatrixId, LockFunctionalContext.CostMatrixDeletion)
                                            .pipe(takeUntil(this.destroy$))
                                            .subscribe();
                                    });
                                    this.subscriptions.push(confirmationSubscription);
                                });
                        }
                    });
                break;

            case this.costsMenuActions.imageCostMatrix:
                const originalCostMatrixId = costMatrix.costMatrixId;
                this.router.navigate(['/' + this.company + '/trades/costmatrix/image/', originalCostMatrixId]);
                break;
            default:
                break;
        }
    }

    onCostMatrixRowClicked(event) {
        const costMatrixId = event.data.costMatrixId;
        this.router.navigate([
            '/' + this.companyManager.getCurrentCompanyId() + '/trades/costmatrix/display/' + encodeURIComponent(costMatrixId),
        ]);
    }

    onExportButtonClickedAsExcel() {
        const screenName: string = 'Cost Matrix List';
        const now = new Date();
        const todayDate = this.datePipe
            .transform(now, 'yyyyMMdd_hhmm')
            .toString()
            .toUpperCase();
        const params = {
            fileName: todayDate + '_' + this.company + '_' + screenName + '_' + this.userActiveDirectoryName + '.xlsx',
        };
        this.gridApi.exportDataAsExcel(params);
    }

    onExportButtonClickedAsCSV() {
        const screenName: string = 'Cost Matrix List';
        const now = new Date();
        const todayDate = this.datePipe
            .transform(now, 'yyyyMMdd_hhmm')
            .toString()
            .toUpperCase();
        const params = {
            fileName: todayDate + '_' + this.company + '_' + screenName + '_' + this.userActiveDirectoryName + '.csv',
        };
        this.gridApi.exportDataAsCsv(params);
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
}
