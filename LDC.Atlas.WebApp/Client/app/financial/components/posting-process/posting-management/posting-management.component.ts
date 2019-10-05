import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MatPaginator, MatSlideToggleChange, MatSort } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import * as agGrid from 'ag-grid-community';
import { interval, Subject, Subscription } from 'rxjs';
import { finalize, map, takeUntil } from 'rxjs/operators';
import { isNumber, isString } from 'util';
import { AuthorizationService } from '../../../../core/services/authorization.service';
import { CompanyManagerService } from '../../../../core/services/company-manager.service';
import { AgContextualMenuComponent } from '../../../../shared/components/ag-contextual-menu/ag-contextual-menu.component';
import { AgGridHyperlinkComponent } from '../../../../shared/components/ag-grid-hyperlink/ag-grid-hyperlink.component';
import { AgGridUserPreferencesComponent } from '../../../../shared/components/ag-grid-user-preferences/ag-grid-user-preferences.component';
import { ConfirmationDialogComponent } from '../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { AgContextualMenuAction } from '../../../../shared/entities/ag-contextual-menu-action.entity';
import { AtlasAgGridParam } from '../../../../shared/entities/atlas-ag-grid-param.entity';
import { AtlasFormControl } from '../../../../shared/entities/atlas-form-control';
import { Department } from '../../../../shared/entities/department.entity';
import { IsLocked } from '../../../../shared/entities/is-locked.entity';
import { LockFunctionalContext } from '../../../../shared/entities/lock-functional-context.entity';
import { LockResourceInformation } from '../../../../shared/entities/lock-resource-information.entity';
import { MasterData } from '../../../../shared/entities/masterdata.entity';
import { PermissionLevels } from '../../../../shared/enums/permission-level.enum';
import { PostingStatus } from '../../../../shared/enums/posting-status.enum';
import { PostingManagementDisplayView } from '../../../../shared/models/posting-management-display-view';
import { FormatDatePipe } from '../../../../shared/pipes/format-date-pipe.pipe';
import { AgGridService } from '../../../../shared/services/ag-grid.service';
import { UserCompanyPrivilegeDto } from '../../../../shared/services/authorization/dtos/user-company-privilege';
import { LockService } from '../../../../shared/services/http-services/lock.service';
import { PreaccountingService } from '../../../../shared/services/http-services/preaccounting.service';
import { SnackbarService } from '../../../../shared/services/snackbar.service';
import { TitleService } from '../../../../shared/services/title.service';
import { UiService } from '../../../../shared/services/ui.service';
import { UrlManagementService } from '../../../../shared/services/url-management.service';
import { AuthorizePostingDialogComponent } from '../authorize-posting-dialog/authorize-posting-dialog.component';
import { ListAndSearchFilter } from '../../../../shared/entities/list-and-search/list-and-search-filter.entity';
import { GridConfigurationProviderService } from '../../../../shared/services/grid-configuration-provider.service';
import { UserGridPreferencesParameters } from '../../../../shared/entities/user-grid-preferences-parameters.entity';
import { ColumnConfigurationProperties } from '../../../../shared/entities/grid-column-configuration.entity';
import { UtilService } from '../../../../shared/services/util.service';
import { FilterSetDisplayComponent } from '../../../../shared/components/filter-set-display/filter-set-display.component';
import { ListAndSearchFilterDto } from '../../../../shared/dtos/list-and-search/list-and-search-filter-dto.dto';
import { ExecutionActionsService } from '../../../../execution/services/execution-actions.service';

@Component({
    selector: 'atlas-posting-management',
    templateUrl: './posting-management.component.html',
    styleUrls: ['./posting-management.component.scss'],
    providers: [DatePipe],
})
export class PostingManagementComponent implements OnInit, OnDestroy {
    @ViewChild('userPreferences') userPreferencesComponent: AgGridUserPreferencesComponent;
    @ViewChild('filterSetDisplayComponent') filterSetDisplayComponent: FilterSetDisplayComponent;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    company: string;
    PostingManagementDisplay: PostingManagementDisplayView[];
    postingManagementGridColumns: agGrid.ColDef[];
    dataLength = 0;
    masterdata: MasterData;
    isHide: boolean = true;
    selected: string = '10';
    interval: Subscription;
    postingManagementGridOptions: agGrid.GridOptions = {};
    postingManagementGridRows: PostingManagementDisplayView[];
    postingManagementGridContextualMenuActions: AgContextualMenuAction[];
    editAccountingDocumentGridContextualMenuActions: AgContextualMenuAction[];
    gridApi: agGrid.GridApi;
    gridColumnApi: agGrid.ColumnApi;
    userActiveDirectoryName: string;
    rowSelection: string = 'multiple';
    refreshOptionsCtrl = new AtlasFormControl('pricingOptions');
    accountingDocuments: PostingManagementDisplayView[];
    isPostingProcessActive: boolean = false;
    isStopRefreshActive: boolean = false;
    postingProcessSubscription: Subscription;
    editDocumentMenuActions: { [key: string]: string } = {
        copyDocumentLine: 'view',
    };
    excelSheetName: string = 'Posting Management';
    excelStyles: any;
    isStopRefreshButtonDisable: boolean = false;
    isLoading = true;
    isRefreshing = false;
    isStartPostingaMgmtPrivilege: boolean = true;

    resourcesInformation: LockResourceInformation[] = new Array<LockResourceInformation>();
    locking: number[] = [];
    unlocking: number[] = [];
    destroy$ = new Subject();
    gridCode = "postingRecordsGrid";
    hasGridSharing = false;
    columnDefs: agGrid.ColDef[];
    columnConfiguration: ColumnConfigurationProperties[] = [];
    count: number = 0;
    savedFilters: ListAndSearchFilter[];
    filters: ListAndSearchFilter[] = [];

    atlasAgGridParam: AtlasAgGridParam;

    gridPreferences: UserGridPreferencesParameters = new UserGridPreferencesParameters();

    constructor(private route: ActivatedRoute,
        protected dialog: MatDialog,
        protected companyManager: CompanyManagerService,
        private formBuilder: FormBuilder,
        private urlManagementService: UrlManagementService,
        protected router: Router,
        private preaccountingService: PreaccountingService,
        private authorizationService: AuthorizationService,
        private snackbarService: SnackbarService,
        private uiService: UiService,
        public executionActionsService: ExecutionActionsService,
        private formatDate: FormatDatePipe,
        private datePipe: DatePipe,
        protected utilService: UtilService,
        protected lockService: LockService,
        public gridService: AgGridService,
        private titleService: TitleService,
        protected gridConfigurationProvider: GridConfigurationProviderService, ) {

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
        this.company = this.companyManager.getCurrentCompanyId();
        this.atlasAgGridParam = this.gridService.getAgGridParam();
    }

    editEstimatedColumnsPrivilege: UserCompanyPrivilegeDto = {
        profileId: null,
        privilegeName: 'POSTINGMGT',
        permission: PermissionLevels.ReadWrite,
        privilegeParentLevelOne: 'Financials',
        privilegeParentLevelTwo: null,
    };
    gridContext = {
        editPrivileges: false,
    };
    rowClassRules = {
        'ag-grid-row-gray-background': (params) => {
            if (params.data) {
                if (params.data.statusId === PostingStatus.Authorized) {
                    return true;
                } else {
                    return false;
                }
            }
        },
    };

    ngOnInit() {
        if (this.authorizationService.isPrivilegeAllowed(this.company, 'Financials')
            && this.authorizationService.isPrivilegeAllowed(this.company, 'POSTINGMGT')) {
            this.isStartPostingaMgmtPrivilege = this.authorizationService.isPrivilegeAllowed(this.company, 'STARTPOSTING');
            if (this.isStartPostingaMgmtPrivilege) {
                this.getStartStopPostingProcessActiveStatus();
            }
        }
        this.titleService.setTitle(this.route.snapshot.data.title);
        this.masterdata = this.route.snapshot.data.masterdata;
        this.refreshOptionsCtrl.patchValue(this.selected);
        this.loadGridConfiguration();
        this.getAllposingDocument();
        this.route.paramMap
            .pipe(
                map((params) => params.get('company')),
            )
            .subscribe((company) => {
                this.company = company;
            });

        const intervalValue = Number(this.refreshOptionsCtrl.value);
        this.init();
        this.refreshGrid(intervalValue);
    }

    init() {
        this.editAccountingDocumentGridContextualMenuActions = [
            {
                icon: 'content_copy',
                text: 'View Summary',
                action: this.editDocumentMenuActions.copyDocumentLine,
            },
        ];
    }

    handleAction(action: string, rowSelected: PostingManagementDisplayView) {
        switch (action) {
            case this.editDocumentMenuActions.copyDocumentLine:
                if (rowSelected.invoiceId) {
                    const invoiceOption = rowSelected.invoiceId.toString();
                    const invoiceType = rowSelected.invoiceTypeId;
                    this.router.navigate(
                        ['/' + this.companyManager.getCurrentCompanyId() +
                            '/execution/invoicing/summary/' + encodeURIComponent(invoiceOption)],
                        {
                            queryParams: { invoiceType },

                        });

                }
                if (rowSelected.cashId) {
                    const costDirectionId = rowSelected.costDirectionId;
                    const cashId = rowSelected.cashId;
                    this.router.navigate(
                        ['/' + this.companyManager.getCurrentCompanyId() + '/execution/cash/display/'
                            + costDirectionId + '/', cashId],
                    );
                }
                break;
            default: throw new Error('Unknown action');
        }

    }

    onGridReady(params) {
        params.columnDefs = this.postingManagementGridColumns;

        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;
        this.gridService.sizeColumns(this.postingManagementGridOptions);
    }
    onGridSizeChanged(params) {
        this.gridService.sizeColumns(params);
    }

    getAllposingDocument() {
        this.initView();

    }

    onFilterSetDetailsChange(filters: ListAndSearchFilter[]): void {
        this.executionActionsService.EditCriteriaRetainFilter = filters;
        this.filters = filters;
        if (this.count === 1) {
            this.filters = this.savedFilters;
            this.savedFilters = null;
            this.count = 0;
        }
        if (this.savedFilters && this.count === 0) {
            if (this.filterSetDisplayComponent) {
                this.count = 1;
                const localFilters: ListAndSearchFilterDto[] = this.savedFilters.map((filter: ListAndSearchFilter) => {
                    return new ListAndSearchFilterDto(filter);
                });
                this.filterSetDisplayComponent.loadFilters(localFilters);
            }
        } else {
            this.getAllposingDocument();
        }
    }

    loadGridConfiguration() {
        this.gridConfigurationProvider.getConfiguration(this.company, this.gridCode)
            .subscribe((configuration) => {
                this.columnConfiguration = configuration.columns;
                this.initColumns(this.columnConfiguration);
                this.hasGridSharing = configuration.hasMultipleViewsPerUser;

                this.gridPreferences = {
                    company: this.company,
                    gridId: this.gridCode,
                    gridOptions: this.postingManagementGridOptions,
                    sharingEnabled: this.hasGridSharing,
                };
            });
    }

    initColumns(configuration: ColumnConfigurationProperties[]) {
        this.columnDefs = [];
        this.columnDefs.push(
            {
                headerName: '',
                colId: 'selection',
                headerCheckboxSelection: true,
                checkboxSelection: true,
                pinned: 'left',
                minWidth: 40,
                maxWidth: 40,
            });

        const numericColumns: string[] = [];
        configuration.forEach((column) => {
            if (column.gridType === 'numeric') {
                numericColumns.push(column.fieldName.toLowerCase());
            }
        });
        
        this.columnDefs = this.columnDefs.concat(configuration.filter((config) => config.isResult) 
            .map((config) => {
            const columnDef: agGrid.ColDef = {
                colId: this.utilService.convertToCamelCase(config.fieldName),
                headerName: config.friendlyName,
                field: this.utilService.convertToCamelCase(config.fieldName),
                hide: !config.isVisible,
            };

            const formatter = this.uiService.getFormatterForType(config.gridType);
            if (formatter) {
                columnDef.valueFormatter = formatter;
            }

            const dateGetter = this.uiService.getterForDateType(config.gridType);
            if (dateGetter) {
                columnDef.cellClass = 'dateFormat';
                columnDef.valueGetter = dateGetter;
            }

            return columnDef;
        }));

        if (this.postingManagementGridOptions) {
            this.postingManagementGridOptions.columnDefs = this.columnDefs;
            if (this.postingManagementGridOptions.columnApi) {
                this.postingManagementGridOptions.columnApi.autoSizeAllColumns();
            }
        }
    }

    initView() {
        this.isRefreshing = true;
        this.stopLockRefresh();
        this.lockService.cleanSessionLocks().pipe(takeUntil(this.destroy$)).subscribe();
        const postingId: number = 1;
        if (this.filters) {
            const filters = this.filters.map((x) => ({ ...x }));
            this.preaccountingService.getAllPostingManagement(filters)
                .pipe(
                    finalize(() => {
                        this.isLoading = false;
                    }),
                )
                .subscribe((data) => {
                    this.postingManagementGridRows = data.value;
                    this.checkIfUserHasRequiredPrivileges(this.editEstimatedColumnsPrivilege);
                })

        }
    }

    onEditButtonClicked() {
        this.gridContext.editPrivileges = true;
    }

    checkIfUserHasRequiredPrivileges(userCompanyPrivilege: UserCompanyPrivilegeDto) {
        if (this.authorizationService.isUserAllowedForCompany(this.company)) {
            const userPermissionLevel = this.authorizationService.getPermissionLevel(
                this.company,
                userCompanyPrivilege.privilegeName,
                userCompanyPrivilege.privilegeParentLevelOne,
                userCompanyPrivilege.privilegeParentLevelTwo);
            if (userPermissionLevel >= userCompanyPrivilege.permission) {
                this.isHide = false;
            }
            this.dataLength = this.postingManagementGridRows.length;

        }
    }


    postingStatusFormatter(params) {
        if (params.value) {
            return PostingStatus[params.value].toString();
        }
    }

    toolTipValue(params) {
        return params.value;
    }

    departmentFormatter(params) {
        const department = this.masterdata.departments.find((dept) => dept.departmentId === params.value);
        return department ? department.description : '';
    }

    dateFormatterHour(params) {
        if (params.value) {
            const authorizedDate = new Date(params.value);
            return this.padStart(authorizedDate.getHours(), 2) + ':' + this.padStart(authorizedDate.getMinutes(), 2);
        }
        return '';
    }

    padStart(num: number, size: number): string {
        let s = num + '';
        while (s.length < size) {
            s = '0' + s;
        }
        return s;
    }

    currencyFormatter(params) {
        if (isNaN(params.value) || params.value === null) { return ''; }
        return new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(params.value);
    }

    onAuthorizeClicked() {
        this.interval.unsubscribe();
        this.accountingDocuments = this.postingManagementGridOptions.api.getSelectedRows();
        if (this.accountingDocuments.length > 0) {
            this.accountingDocuments.forEach((document) => {
                document.reason = '';
                if (document.statusId === PostingStatus.Authorized) {
                    document.reason = 'Accounting Document is already authorized.';
                } else if (document.total > 0) {
                    document.reason = 'Unbalanced document.';
                } else if (document.documentDate > this.companyManager.getCurrentCompanyDate().toDate()) {
                    document.reason = 'Future document date';
                }
            });

            const validateAccountingDocument = this.accountingDocuments.filter((doc) =>
                doc.reason !== '');
            const passedAccountingDocument = this.accountingDocuments.filter((doc) =>
                doc.reason === '');

            const accountingDocumentSectionDialog = this.dialog.open(AuthorizePostingDialogComponent, {
                panelClass: 'authorize-posting-dialog',
                data: { validateAccountingDocument, passedAccountingDocument },
            });
            accountingDocumentSectionDialog.afterClosed().subscribe(() => {
                this.initView();
                if (this.isStopRefreshButtonDisable === false) {
                    const intervalValue = Number(this.refreshOptionsCtrl.value);
                    this.refreshGrid(intervalValue);
                }
            });
        } else {
            this.snackbarService.informationSnackBar('No Contract Selected.');
        }

    }

    startLockRefresh(accountingId: number, documentReference: string) {
        this.resourcesInformation = new Array<LockResourceInformation>();
        const resourceInformation = new LockResourceInformation();
        resourceInformation.resourceType = 'Accounting Document';
        resourceInformation.resourceId = accountingId;
        resourceInformation.resourceCode = documentReference;
        resourceInformation.needRefresh = true;
        this.resourcesInformation.push(resourceInformation);
    }

    stopLockRefresh() {
        this.resourcesInformation = new Array<LockResourceInformation>();
    }

    ngOnDestroy(): void {
        this.interval.unsubscribe();
        this.stopLockRefresh();
        if (this.postingProcessSubscription) {
            this.postingProcessSubscription.unsubscribe();
        }
        this.lockService.cleanSessionLocks().pipe(takeUntil(this.destroy$)).subscribe(() => {
            this.destroy$.next();
            this.destroy$.complete();
        });
    }

    refreshOptionSelectionChanged(event) {
        this.isStopRefreshButtonDisable = false;
        this.isStopRefreshActive = false;
        this.interval.unsubscribe();
        this.refreshGrid(Number(event.selected));

    }
    refreshGrid(intervalValue) {
        const source = interval(intervalValue * 1000);
        this.interval = source.subscribe(() => {
            this.getAllposingDocument();
        });
    }

    onAddOrDeleteColumn(col) {
        this.userPreferencesComponent.onChangeColumnVisibility(col);
    }

    onRowClicked(rowSelected) {
        if (rowSelected.data) {
            this.router.navigate(['/' + this.urlManagementService.getCurrentCompanyId() + '/financial/posting/accountingdocument/viewedit', rowSelected.data.accountingId]);
        }
    }


    getStartStopPostingProcessActiveStatus() {
        this.postingProcessSubscription = this.preaccountingService.getPostingProcessStatus()
            .subscribe((result) => {
                this.isPostingProcessActive = result;
            }, (error) => {
                console.error(error);
                this.snackbarService.throwErrorSnackBar('Oops! An error ocurred');
            });

    }

    toggleStartStopPostingProcess() {
        this.isPostingProcessActive = !this.isPostingProcessActive;

        this.postingProcessSubscription = this.preaccountingService.startStopPostingProcess(this.isPostingProcessActive)
            .subscribe((result) => {
                if (result) {
                    this.snackbarService.throwErrorSnackBar('Posting Process is started successfully.');
                } else {
                    this.snackbarService.throwErrorSnackBar('Posting Process is stopped successfully.');
                }

            }, (error) => {
                console.error(error);
                this.snackbarService.throwErrorSnackBar('Oops! An error ocurred');
            });
    }

    toggleStartStopRefresh(stopRefreshToggleChangeEventObject: MatSlideToggleChange) {
        this.isStopRefreshActive = stopRefreshToggleChangeEventObject.checked;
        if (this.isStopRefreshActive) {
            this.interval.unsubscribe();
            if (this.postingProcessSubscription) {
                this.postingProcessSubscription.unsubscribe();
            }
            this.isStopRefreshButtonDisable = true;
        }
    }

    onRowSelected(event) {
        this.grantLock(Number(event.data.accountingId), event.node);
    }

    grantLock(accountingId: number, node: agGrid.RowNode) {
        if (node.isSelected()) {
            if (!this.locking.includes(accountingId)) {
                this.locking.push(accountingId);
                this.lockService.isLockedAccountingDocument(accountingId).pipe(takeUntil(this.destroy$)).subscribe((lock: IsLocked) => {
                    if (lock.isLocked) {
                        this.dialog.open(ConfirmationDialogComponent, {
                            data: {
                                title: 'Lock',
                                text: lock.message,
                                okButton: 'Got it',
                            },
                        });
                        this.postingManagementGridOptions.api.deselectNode(node);
                        this.locking = this.locking.filter((id) => id !== accountingId);
                    } else {
                        this.lockService.lockAccountingDocument(accountingId, LockFunctionalContext.AccountingDocumentAuthorizeForPosting).pipe(takeUntil(this.destroy$)).subscribe((lockState) => {
                            this.refeshResourceInformation();
                            this.locking = this.locking.filter((id) => id !== accountingId);
                        });

                    }
                });
            }
        } else {
            if (!this.unlocking.includes(accountingId)) {
                this.unlocking.push(accountingId);
                this.refeshResourceInformation();
                if (this.resourcesInformation.filter((rsc) => rsc.resourceId === accountingId).length === 0) {
                    this.lockService.unlockAccountingDocument(accountingId, LockFunctionalContext.AccountingDocumentAuthorizeForPosting).pipe(takeUntil(this.destroy$)).subscribe(() => {
                        node.setRowSelectable(true);
                        this.unlocking = this.unlocking.filter((id) => id !== accountingId);
                    });
                } else {
                    node.setRowSelectable(true);
                    this.unlocking = this.unlocking.filter((id) => id !== accountingId);
                }
            }
        }
    }

    refeshResourceInformation() {
        this.resourcesInformation = new Array<LockResourceInformation>();
        this.postingManagementGridOptions.api.forEachNode((node) => {
            if (node.isSelected()) {
                const resourceInformation = new LockResourceInformation();
                resourceInformation.resourceType = 'Accounting Document';
                resourceInformation.resourceId = node.data.accountingId;
                resourceInformation.resourceCode = node.data.documentReference;
                this.resourcesInformation.push(resourceInformation);
            }
        });
    }
}

