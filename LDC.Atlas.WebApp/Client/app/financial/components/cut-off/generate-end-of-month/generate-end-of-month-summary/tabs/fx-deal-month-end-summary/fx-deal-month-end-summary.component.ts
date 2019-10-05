import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthorizationService } from '../../../../../../../core/services/authorization.service';
import { CompanyManagerService } from '../../../../../../../core/services/company-manager.service';
import { FilterGem } from '../../../../../../../shared/entities/filter-gem.entity';
import { FilterValueGenerateEndMonth } from '../../../../../../../shared/entities/filter-value-generate-end-month.entity';
import { PermissionLevels } from '../../../../../../../shared/enums/permission-level.enum';
import { FxDealGenerateEndOfMonthDisplayView } from '../../../../../../../shared/models/fx-deal-generate-end-of-month-display-view';
import { UserCompanyPrivilegeDto } from '../../../../../../../shared/services/authorization/dtos/user-company-privilege';
import { TradingService } from '../../../../../../../shared/services/http-services/trading.service';
import { DealNumberDropdownComponent } from '../../deal-number-dropdown/deal-number-dropdown.component';
import { DealtCurrencyDropdownComponent } from '../../dealt-currency-dropdown/dealt-currency-dropdown.component';
import { DepartmentDropdownComponent } from '../../department-dropdown/department-dropdown.component';
import { SettlementCurrencyDropdownComponent } from '../../settlement-currency-dropdown/settlement-currency-dropdown.component';
import { DetailTabFxDealMonthEndComponent } from '../details-tab/fx-deal-details-month-end/fx-deal-month-end.component';
import { PostingTabFxDealMonthEndComponent } from '../postings-tab/fx-deal-postings-month-end/fx-deal-month-end.component';
import { FXDealMonthEndTemporaryAdjustmentListCommand } from '../../../../../../../shared/services/execution/dtos/fxdeal-month-end-temporary-adjustment-list-command';
import { ExecutionService } from '../../../../../../../shared/services/http-services/execution.service';
import { SnackbarService } from '../../../../../../../shared/services/snackbar.service';
import { Subscription } from 'rxjs';
import { TradeCostMonthEndMappingErrors } from '../../../../../../../shared/entities/tradecost-monthend-mappingerrors-entity';

@Component({
    selector: 'atlas-fx-deal-month-end-summary',
    templateUrl: './fx-deal-month-end-summary.component.html',
    styleUrls: ['./fx-deal-month-end-summary.component.scss'],
})
export class FxDealMonthEndSummaryComponent implements OnInit {
    @ViewChild('fxDealPosting') fxDealPosting: PostingTabFxDealMonthEndComponent;
    @ViewChild('fxDealDetail') fxDealDetail: DetailTabFxDealMonthEndComponent;
    @ViewChild('departmentDropdownComponent') departmentDropdownComponent: DepartmentDropdownComponent;
    @ViewChild('dealNumberDropdownComponent') dealNumberDropdownComponent: DealNumberDropdownComponent;
    @ViewChild('dealtCurrencyDropdownComponent') dealtCurrencyDropdownComponent: DealtCurrencyDropdownComponent;
    @ViewChild('settlementCurrencyDropdownComponent') settlementCurrencyDropdownComponent: SettlementCurrencyDropdownComponent;
    @Output() readonly tabIndexNumber = new EventEmitter();
    @Output() readonly disableGeneratePosting = new EventEmitter<boolean>();
    company: string;
    PermissionLevels = PermissionLevels;
    buttonEditable: boolean = false;
    buttonDisableForPrevilage: boolean = false;
    disableButton: boolean = false;
    dataVersionId: number;
    dataVersionDate: Date;
    dataVersionMonth: string;
    currentDataBase: string ='Current Database';
    reportType: number;
    reportTypeDescription: string;
    tabIndex: number = 0;
    isFilterApplied: boolean = false;
    isPostingButtonDisable: boolean;
    filterModel: FilterGem;
    generatePosting: boolean = true;
    selectedDepartments: FilterValueGenerateEndMonth[] = [];
    selectedDealNumbers: FilterValueGenerateEndMonth[] = [];
    selectedDealtCurrencies: FilterValueGenerateEndMonth[] = [];
    selectedSettlementCurrencies: FilterValueGenerateEndMonth[] = [];
    monthEndData: FxDealGenerateEndOfMonthDisplayView[] = [];
    private generateMonthEndSubscription: Subscription;
    isCurrentDatabase: boolean = true;
    isMappingError: boolean = false;
    costTypeMappingErrorMessages: string[];
    departmentMappingErrorMessages: string[];
    nominalAccountMappingErrorMessages: string[];
    clientAccountMappingErrorMessages: string[];

    constructor(private route: ActivatedRoute,
        private router: Router,
        private executionService: ExecutionService,
        private snackbarService: SnackbarService,
        private authorizationService: AuthorizationService,
        private companyManager: CompanyManagerService,
        private tradingService: TradingService) { }
    generatePostingsPrivilege: UserCompanyPrivilegeDto = {
        profileId: null,
        privilegeName: 'GeneratePostings',
        permission: PermissionLevels.Read,
        privilegeParentLevelOne: 'Financials',
        privilegeParentLevelTwo: 'CutOff',
    };
    ngOnInit() {
        this.company = this.route.snapshot.paramMap.get('company');
        this.buttonDisableForPrevilage = this.checkIfUserHasRequiredPrivileges(this.generatePostingsPrivilege);
        this.route.queryParams.subscribe((params) => {
            this.dataVersionId = Number(params['dataVersionId']);
            this.buttonEditable = (params['isPostingButtonEditable']).toLowerCase() === 'true' ? true : false;
            this.reportTypeDescription = (params['reportTypeDescription']);
            this.dataVersionDate = (params['dataVersionDate']);
            this.dataVersionMonth = (params['dataVersionMonth']);
            this.reportType = Number(params['reportType']);
        });
        this.dataVersionMonth = this.dataVersionMonth ? this.dataVersionMonth : 'Current Database';
        if (this.buttonDisableForPrevilage) {
            this.disableButton = true;
        } else {
            this.disableButton = this.buttonEditable;
        }
        if ((this.dataVersionDate === null
            || this.dataVersionDate === undefined)
            && (this.dataVersionMonth === this.currentDataBase
                || this.dataVersionMonth === null
                || this.dataVersionMonth === undefined)
        ) {
            this.isCurrentDatabase = true;
        }
        else {
            this.isCurrentDatabase = false;
        }
        this.getMonthEndFxDealDetails();
        if (this.fxDealDetail) {
            this.fxDealDetail.dataVersionId = this.dataVersionId;
            this.fxDealDetail.dataVersionMonth = this.dataVersionMonth;
            this.fxDealDetail.reportType = this.reportType;
            this.fxDealDetail.reportTypeDescription = this.reportTypeDescription;
        }
        if (this.fxDealPosting) {
            this.fxDealPosting.dataVersionID = this.dataVersionId;
            this.fxDealPosting.dataVersionMonth = this.dataVersionMonth;
            this.fxDealPosting.reportType = this.reportType;
            this.fxDealPosting.reportTypeDescription = this.reportTypeDescription;
        }
    }

    onWarningRemoveButtonClicked(params) {
        if (params) {
            params.currentTarget.parentElement.parentElement.remove();
        }
    }

    getMonthEndFxDealDetails() {
        this.tradingService.getFxDealForMonthEnd(this.dataVersionId)
            .subscribe((data) => {
                const result = [] = data.value;
                this.monthEndData = data.value;
                if (this.monthEndData.length>0) {
                    this.generateMappingErrorForMonthEnd(this.monthEndData[0].fxDealMonthEndMappingErrors);
                }
                this.fxDealDetail.prepareData(data.value);
                this.fxDealPosting.prepareData(data.value);
                this.filterModel = new FilterGem();
                let count = 1;
                this.filterModel.departmentCode = [];
                this.filterModel.dealCurrency = [];
                this.filterModel.settlementCurrency = [];
                this.filterModel.dealNumber = [];
                result.forEach((x) => {
                    if (x.departmentCode) {
                        const dept = new FilterValueGenerateEndMonth();
                        dept.desc = x.departmentCode;
                        dept.value = count;
                        this.filterModel.departmentCode.push(dept);
                    }
                    if (x.dealCurrency) {
                        const dealCurrency = new FilterValueGenerateEndMonth();
                        dealCurrency.desc = x.dealCurrency;
                        dealCurrency.value = count;
                        this.filterModel.dealCurrency.push(dealCurrency);
                    }
                    if (x.settlementCurrency) {
                        const settlementCurrency = new FilterValueGenerateEndMonth();
                        settlementCurrency.desc = x.settlementCurrency;
                        settlementCurrency.value = count;
                        this.filterModel.settlementCurrency.push(settlementCurrency);
                    }
                    if (x.dealNumber) {
                        const dealNumber = new FilterValueGenerateEndMonth();
                        dealNumber.desc = x.dealNumber;
                        dealNumber.value = count;
                        this.filterModel.dealNumber.push(dealNumber);
                    }
                    count = count + 1;
                });
                this.filtered(this.filterModel);
            });
    }

    selectedFilters() {
        this.selectedDepartments = this.departmentDropdownComponent.allSelected ? this.departmentDropdownComponent.objects :
            this.departmentDropdownComponent.selectedValues;
        this.selectedDealNumbers = this.dealNumberDropdownComponent.allSelected ? this.dealNumberDropdownComponent.objects :
            this.dealNumberDropdownComponent.selectedValues;
        this.selectedDealtCurrencies = this.dealtCurrencyDropdownComponent.allSelected ? this.dealtCurrencyDropdownComponent.objects :
            this.dealtCurrencyDropdownComponent.selectedValues;
        this.selectedSettlementCurrencies = this.settlementCurrencyDropdownComponent.allSelected ?
            this.settlementCurrencyDropdownComponent.objects :
            this.settlementCurrencyDropdownComponent.selectedValues;
    }

    applyFilter(filterRows: FxDealGenerateEndOfMonthDisplayView[]) {
        if (this.isFilterApplied) {
            const deptFilter: FxDealGenerateEndOfMonthDisplayView[] = [];
            const dealNoFilter: FxDealGenerateEndOfMonthDisplayView[] = [];
            const dealCcyFilter: FxDealGenerateEndOfMonthDisplayView[] = [];
            const settlementCcyFilter: FxDealGenerateEndOfMonthDisplayView[] = [];
            filterRows.filter((x) => {
                const deptCode = this.selectedDepartments.find((y) => y.desc === x.departmentCode);
                if (deptCode) {
                    if (x.departmentCode === deptCode.desc) {
                        deptFilter.push(x);
                    }
                }
            });
            filterRows = deptFilter;
            filterRows.filter((x) => {
                const dealNumber = this.selectedDealNumbers.find((y) => y.desc === x.dealNumber);
                if (dealNumber) {
                    if (x.dealNumber === dealNumber.desc) {
                        dealNoFilter.push(x);
                    }
                } else {
                    if (x.dealNumber === null) {
                        dealNoFilter.push(x);
                    }
                }
            });
            filterRows = dealNoFilter;
            filterRows.filter((x) => {
                const dealCurrency = this.selectedDealtCurrencies.find((y) => y.desc === x.dealCurrency);
                if (dealCurrency) {
                    if (x.dealCurrency === dealCurrency.desc) {
                        dealCcyFilter.push(x);
                    }
                }
            });
            filterRows = dealCcyFilter;
            filterRows.filter((x) => {
                const settlementCurrency = this.selectedSettlementCurrencies.find((y) => y.desc === x.settlementCurrency);
                if (settlementCurrency) {
                    if (x.settlementCurrency === settlementCurrency.desc) {
                        settlementCcyFilter.push(x);
                    }
                } else {
                    if (x.settlementCurrency === null) {
                        settlementCcyFilter.push(x);
                    }
                }
            });
            filterRows = settlementCcyFilter;
            return filterRows;
        } else {
            filterRows = this.monthEndData;
            return filterRows;
        }
    }

    onDepartmentSelectionChanges() {
        const deptFilter: FxDealGenerateEndOfMonthDisplayView[] = [];
        const dealNoFilter: FilterValueGenerateEndMonth[] = [];
        const dealCcyFilter: FilterValueGenerateEndMonth[] = [];
        const settlementCcyFilter: FilterValueGenerateEndMonth[] = [];
        this.selectedFilters();
        this.monthEndData.filter((x) => {
            const deptCode = this.selectedDepartments.find((y) => y.desc === x.departmentCode);
            if (deptCode) {
                if (x.departmentCode === deptCode.desc) {
                    deptFilter.push(x);
                }
            }
        });

        this.dealNumberDropdownComponent.formCtrl.reset();
        this.dealtCurrencyDropdownComponent.formCtrl.reset();
        this.settlementCurrencyDropdownComponent.formCtrl.reset();
        let count = 1;
        deptFilter.forEach((x) => {
            if (x.dealNumber) {
                const dealNo = new FilterValueGenerateEndMonth();
                dealNo.desc = x.dealNumber;
                dealNo.value = count;
                dealNoFilter.push(dealNo);
            }
            if (x.dealCurrency) {
                const dealCcy = new FilterValueGenerateEndMonth();
                dealCcy.desc = x.dealCurrency;
                dealCcy.value = count;
                dealCcyFilter.push(dealCcy);
            }
            if (x.settlementCurrency) {
                const settlementCcy = new FilterValueGenerateEndMonth();
                settlementCcy.desc = x.settlementCurrency;
                settlementCcy.value = count;
                settlementCcyFilter.push(settlementCcy);
            }
            count = count + 1;
        });
        this.dealNumberDropdownComponent.objects = this.getDistinctString(dealNoFilter);
        this.dealtCurrencyDropdownComponent.objects = this.getDistinctString(dealCcyFilter);
        this.settlementCurrencyDropdownComponent.objects = this.getDistinctString(settlementCcyFilter);
        if (this.departmentDropdownComponent.allSelected) {
            this.dealNumberDropdownComponent.setSelectedValue(true, this.getDistinctString(dealNoFilter));
            this.dealtCurrencyDropdownComponent.setSelectedValue(true, this.getDistinctString(dealCcyFilter));
            this.settlementCurrencyDropdownComponent.setSelectedValue(true, this.getDistinctString(settlementCcyFilter));
        } else {
            this.dealNumberDropdownComponent.setSelectedValue(false, this.getDistinctString(dealNoFilter));
            this.dealtCurrencyDropdownComponent.setSelectedValue(false, this.getDistinctString(dealCcyFilter));
            this.settlementCurrencyDropdownComponent.setSelectedValue(false, this.getDistinctString(settlementCcyFilter));
        }
    }

    onDealNumberSelectionChanges() {
        const dealCurrencyFilter: FxDealGenerateEndOfMonthDisplayView[] = [];
        const settlementCurrencyFilter: FilterValueGenerateEndMonth[] = [];
        const dealNumberFilter: FilterValueGenerateEndMonth[] = [];
        this.selectedFilters();
        this.monthEndData.filter((x) => {
            const dealCurrency = this.selectedDealtCurrencies.find((y) => y.desc === x.dealCurrency);
            if (dealCurrency) {
                if (x.dealCurrency === dealCurrency.desc) {
                    dealCurrencyFilter.push(x);
                }
            }
        });
        this.settlementCurrencyDropdownComponent.formCtrl.reset();
        this.dealNumberDropdownComponent.formCtrl.reset();
        let count = 1;
        dealCurrencyFilter.forEach((x) => {
            if (x.settlementCurrency) {
                const settlementCcy = new FilterValueGenerateEndMonth();
                settlementCcy.desc = x.settlementCurrency;
                settlementCcy.value = count;
                settlementCurrencyFilter.push(settlementCcy);
            }
            if (x.dealNumber) {
                const dealNo = new FilterValueGenerateEndMonth();
                dealNo.desc = x.dealNumber;
                dealNo.value = count;
                dealNumberFilter.push(dealNo);
            }
            count = count + 1;
        });
        this.settlementCurrencyDropdownComponent.objects = this.getDistinctString(settlementCurrencyFilter);
        this.dealNumberDropdownComponent.objects = this.getDistinctString(dealNumberFilter);
        if (this.dealtCurrencyDropdownComponent.allSelected) {
            this.settlementCurrencyDropdownComponent.setSelectedValue(true, this.getDistinctString(settlementCurrencyFilter));
            this.dealNumberDropdownComponent.setSelectedValue(true, this.getDistinctString(dealNumberFilter));

        } else {
            this.settlementCurrencyDropdownComponent.setSelectedValue(false, this.getDistinctString(settlementCurrencyFilter));
            this.dealNumberDropdownComponent.setSelectedValue(false, this.getDistinctString(dealNumberFilter));
        }
    }

    onSettlementCurrencySelectionChanges() {
        const settlementCurrencyFilter: FxDealGenerateEndOfMonthDisplayView[] = [];
        const dealNumberFilter: FilterValueGenerateEndMonth[] = [];
        this.selectedFilters();
        this.monthEndData.filter((x) => {
            const settlementCcy = this.selectedSettlementCurrencies.find((y) => y.desc === x.settlementCurrency);
            if (settlementCcy) {
                if (x.settlementCurrency === settlementCcy.desc) {
                    settlementCurrencyFilter.push(x);
                }
            }
        });

        this.dealNumberDropdownComponent.formCtrl.reset();
        let count = 1;
        settlementCurrencyFilter.forEach((x) => {
            if (x.dealNumber) {
                const dealNo = new FilterValueGenerateEndMonth();
                dealNo.desc = x.dealNumber;
                dealNo.value = count;
                dealNumberFilter.push(dealNo);
            }
            count = count + 1;
        });
        this.dealNumberDropdownComponent.objects = this.getDistinctString(dealNumberFilter);
        if (this.settlementCurrencyDropdownComponent.allSelected) {
            this.dealNumberDropdownComponent.setSelectedValue(true, this.getDistinctString(dealNumberFilter));

        } else {
            this.dealNumberDropdownComponent.setSelectedValue(false, this.getDistinctString(dealNumberFilter));
        }
    }

    checkIfUserHasRequiredPrivileges(userCompanyPrivilege: UserCompanyPrivilegeDto) {
        if (this.authorizationService.isUserAllowedForCompany(this.company)) {
            const userPermissionLevel = this.authorizationService.getPermissionLevel(
                this.company,
                userCompanyPrivilege.privilegeName,
                userCompanyPrivilege.privilegeParentLevelOne,
                userCompanyPrivilege.privilegeParentLevelTwo);
            if (userPermissionLevel <= userCompanyPrivilege.permission) {
                return true;
            }
        }
        return false;
    }

    onSelectedIndexChanged(value: number) {
        this.tabIndex = value;
        this.tabIndexNumber.emit(this.tabIndex);
    }

    filtered(filter: FilterGem) {
        this.departmentDropdownComponent.objects = this.getDistinctString(filter.departmentCode);
        this.dealNumberDropdownComponent.objects = this.getDistinctString(filter.dealNumber);
        this.dealtCurrencyDropdownComponent.objects = this.getDistinctString(filter.dealCurrency);
        this.settlementCurrencyDropdownComponent.objects = this.getDistinctString(filter.settlementCurrency);
    }
    stopPosting(generateMonthPosting: boolean) {
        this.disableButton = generateMonthPosting;
    }

    getDistinctString(list: FilterValueGenerateEndMonth[]): FilterValueGenerateEndMonth[] {
        const distinctList = [];
        const filteredList: FilterValueGenerateEndMonth[] = [];
        list.forEach((item) => {
            if (distinctList.indexOf(item.desc) === -1) {
                distinctList.push(item.desc);
                filteredList.push(item);
            }
        });
        return filteredList;
    }

    onDiscardButtonClicked() {
        this.router.navigate(['/' + this.companyManager.getCurrentCompanyId() + '/financial/cut-off/generate-end-of-month']);
    }

    onGeneratePostingsButtonClicked() {
        this.onGenerateFxDealDocument();
    }

    onGenerateFxDealDocument() {
        if (this.monthEndData && this.monthEndData.length > 0) {
            const genetateMonthEndTACommand = new FXDealMonthEndTemporaryAdjustmentListCommand();
            genetateMonthEndTACommand.dataVersionId = this.dataVersionId;
            genetateMonthEndTACommand.dataVersionDate = this.dataVersionDate;
            genetateMonthEndTACommand.reportType = this.reportType;
            this.generateMonthEndSubscription = this.executionService
                .SaveFxDealMonthEndTemporaryAdjustment(genetateMonthEndTACommand)
                .subscribe(((data) => {
                    this.disableGeneratePosting.emit(this.generatePosting);
                    this.snackbarService.informationAndCopySnackBar('The following Accrual and autoreversal have been created:' + data.monthEndTAReferenceNumber, data.monthEndTAReferenceNumber);
                }),
                );

        } else {
            this.snackbarService.informationSnackBar('Please wait! Data is loading...');
        }
    }

    onSelectedIndexChanged1(tabIndex: number) {
        this.tabIndex = tabIndex;
    }

    onApplyButtonClicked() {
        if (this.departmentDropdownComponent.allSelected &&
            this.dealNumberDropdownComponent.allSelected &&
            this.dealtCurrencyDropdownComponent.allSelected &&
            this.settlementCurrencyDropdownComponent.allSelected) {
            this.isFilterApplied = false;
        } else {
            this.isFilterApplied = true;
        }
        this.selectedFilters();
        const filteredData = this.applyFilter(this.monthEndData);
        this.fxDealDetail.prepareData(filteredData);
        this.fxDealPosting.prepareData(filteredData);
    }

    generateMappingErrorForMonthEnd(tradeCostMonthEndMappingErrors: TradeCostMonthEndMappingErrors[]): void {
        var mappingErrors = tradeCostMonthEndMappingErrors.filter((mappingError) => mappingError.isMappingError);
        this.clientAccountMappingErrorMessages = [];
        this.departmentMappingErrorMessages = [];
        this.costTypeMappingErrorMessages = [];
        this.nominalAccountMappingErrorMessages = [];
        if (mappingErrors && mappingErrors.length > 0) {
            mappingErrors.forEach(error => {
                if (error.c2CCodeIsInMappingError) {
                    this.clientAccountMappingErrorMessages.push(error.accountingDocumentLineClientAccount);
                }
                if (error.costAlternativeCodeIsInMappingError) {
                    this.costTypeMappingErrorMessages.push(error.accountingDocumentLineCostTypeCode);
                }
                if (error.departmentAlternativeCodeIsInMappingError) {
                    this.departmentMappingErrorMessages.push(error.accountingDocumentLineDepartmentCode);
                }
                if (error.nominalAlternativeAccountIsInMappingError) {
                    this.nominalAccountMappingErrorMessages.push(error.accountingDocumentLineAccountReference);
                }
            });

            if (this.clientAccountMappingErrorMessages.length > 0) {
                this.clientAccountMappingErrorMessages = this.clientAccountMappingErrorMessages.filter((x, i, a) => x && a.indexOf(x) === i);
                this.isMappingError = true;
            }
            if (this.costTypeMappingErrorMessages.length > 0) {
                this.costTypeMappingErrorMessages = this.costTypeMappingErrorMessages.filter((x, i, a) => x && a.indexOf(x) === i);
                this.isMappingError = true;
            }
            if (this.departmentMappingErrorMessages.length > 0) {
                this.departmentMappingErrorMessages = this.departmentMappingErrorMessages.filter((x, i, a) => x && a.indexOf(x) === i);
                this.isMappingError = true;
            }
            if (this.nominalAccountMappingErrorMessages.length > 0) {
                this.nominalAccountMappingErrorMessages = this.nominalAccountMappingErrorMessages.filter((x, i, a) => x && a.indexOf(x) === i);
                this.isMappingError = true;
            }
        }
    }
}
