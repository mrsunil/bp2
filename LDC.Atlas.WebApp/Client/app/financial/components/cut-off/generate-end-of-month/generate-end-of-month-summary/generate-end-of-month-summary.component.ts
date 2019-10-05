import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthorizationService } from '../../../../../core/services/authorization.service';
import { CompanyManagerService } from '../../../../../core/services/company-manager.service';
import { BaseFormComponent } from '../../../../../shared/components/base-form-component/base-form-component.component';
import { FilterGem } from '../../../../../shared/entities/filter-gem.entity';
import { FilterValueGenerateEndMonth } from '../../../../../shared/entities/filter-value-generate-end-month.entity';
import { PermissionLevels } from '../../../../../shared/enums/permission-level.enum';
import { ReportType } from '../../../../../shared/enums/report-type.enum';
import { OverviewGenerateEndOfMonthDisplayView } from '../../../../../shared/models/overview-generate-end-of-month-display-view';
import { UserCompanyPrivilegeDto } from '../../../../../shared/services/authorization/dtos/user-company-privilege';
import { FormConfigurationProviderService } from '../../../../../shared/services/form-configuration-provider.service';
import { TitleService } from '../../../../../shared/services/title.service';
import { AssociatedClientDropdownComponent } from './associated-client-dropdown/associated-client-dropdown.component';
import { CharterDropdownComponent } from './charter-dropdown/charter-dropdown.component';
import { CostTypeDropdownComponent } from './cost-type-dropdown/cost-type-dropdown.component';
import { DepartmentDropdownComponent } from './department-dropdown/department-dropdown.component';
import { GenerateEndOfMonthTabGroupComponent } from './generate-end-of-month-tab-group/generate-end-of-month-tab-group.component';
@Component({
    selector: 'atlas-generate-end-of-month-summary',
    templateUrl: './generate-end-of-month-summary.component.html',
    styleUrls: ['./generate-end-of-month-summary.component.scss'],
})
export class GenerateEndOfMonthSummaryComponent extends BaseFormComponent implements OnInit {
    @ViewChild('generateEndOfMonthTabGroup') generateEndOfMonthTabGroupComponent: GenerateEndOfMonthTabGroupComponent;
    @ViewChild('departmentDropdownComponent') departmentDropdownComponent: DepartmentDropdownComponent;
    @ViewChild('charterDropdownComponent') charterDropdownComponent: CharterDropdownComponent;
    @ViewChild('costTypeDropdownComponent') costTypeDropdownComponent: CostTypeDropdownComponent;
    @ViewChild('associatedClientDropdownComponent') associatedClientDropdownComponent: AssociatedClientDropdownComponent;
    @Input() objects: FilterValueGenerateEndMonth[] = [];
    company: string;
    PermissionLevels = PermissionLevels;
    buttonEditable: boolean = false;
    buttonDisableForPrevilage: boolean = false;
    disableButton: boolean = false;
    isCurrentDatabase: boolean = true;
    isMappingError: boolean = true;
    isUnRealisedPhysical: boolean = true;
    dataVersionId: number;
    dataVersionDate: Date;
    dataVersionMonth: string;
    reportType: number;
    reportTypeDescription: string;
    selectedDepartments: FilterValueGenerateEndMonth[] = [];
    selectedCharter: FilterValueGenerateEndMonth[] = [];
    selectedCostType: FilterValueGenerateEndMonth[] = [];
    selectedAssociatedClient: FilterValueGenerateEndMonth[] = [];
    originalOverviewGridRows: OverviewGenerateEndOfMonthDisplayView[];
    originalDetailsGridRows: OverviewGenerateEndOfMonthDisplayView[];
    originalPostingsGridRows: OverviewGenerateEndOfMonthDisplayView[];
    tabIndex: number = 0;
    isFilterApplied: boolean = false;
    isPostingButtonDisable: boolean;
    constructor(protected formConfigurationProvider: FormConfigurationProviderService,
        private route: ActivatedRoute,
        private router: Router,
        private authorizationService: AuthorizationService,
        private companyManager: CompanyManagerService,
        private titleService: TitleService) {
        super(formConfigurationProvider);
    }
    generatePostingsPrivilege: UserCompanyPrivilegeDto = {
        profileId: null,
        privilegeName: 'GeneratePostings',
        permission: PermissionLevels.Read,
        privilegeParentLevelOne: 'Financials',
        privilegeParentLevelTwo: 'CutOff',
    };
    ngOnInit() {
        this.company = this.route.snapshot.paramMap.get('company');
        this.titleService.setTitle('Generate End of Month');
        this.buttonDisableForPrevilage = this.checkIfUserHasRequiredPrivileges(this.generatePostingsPrivilege);
        this.route.queryParams.subscribe((params) => {
            this.dataVersionId = Number(params['dataVersionId']);
            this.buttonEditable = (params['isPostingButtonEditable']).toLowerCase() === 'true' ? true : false;
            this.reportTypeDescription = (params['reportTypeDescription']);
            this.dataVersionDate = (params['dataVersionDate']);
            this.dataVersionMonth = (params['dataVersionMonth']);
            this.reportType = Number(params['reportType']);

        });
        if ((this.dataVersionDate === null
            || this.dataVersionDate === undefined)
            && (this.dataVersionMonth === 'Current Database'
                || this.dataVersionMonth === null
                || this.dataVersionMonth === undefined)
        ) {
            this.isCurrentDatabase = true;
        }
        else {
            this.isCurrentDatabase = false;
        }
        if (this.reportTypeDescription.indexOf('Unrealized') > 0) {
            this.isUnRealisedPhysical = true;
        }
        else {
            this.isUnRealisedPhysical = false;
        }
        this.dataVersionMonth = this.dataVersionMonth ? this.dataVersionMonth : 'Current Database';
        this.generateEndOfMonthTabGroupComponent.reportType = this.reportType;
        if (this.generateEndOfMonthTabGroupComponent.overviewTabComponent) {
            this.generateEndOfMonthTabGroupComponent.overviewTabComponent.dataVersionID = this.dataVersionId;
            this.generateEndOfMonthTabGroupComponent.overviewTabComponent.dataVersionDate = this.dataVersionDate;
            this.generateEndOfMonthTabGroupComponent.overviewTabComponent.dataVersionMonth = this.dataVersionMonth;
            this.generateEndOfMonthTabGroupComponent.overviewTabComponent.reportType = this.reportType;
            this.generateEndOfMonthTabGroupComponent.overviewTabComponent.reportTypeDescription = this.reportTypeDescription;
        }
        if (this.generateEndOfMonthTabGroupComponent.postingsTabComponent) {
            this.generateEndOfMonthTabGroupComponent.postingsTabComponent.dataVersionID = this.dataVersionId;
            this.generateEndOfMonthTabGroupComponent.postingsTabComponent.dataVersionMonth = this.dataVersionMonth;
            this.generateEndOfMonthTabGroupComponent.postingsTabComponent.reportType = this.reportType;
            this.generateEndOfMonthTabGroupComponent.postingsTabComponent.reportTypeDescription = this.reportTypeDescription;
        }
        if (this.generateEndOfMonthTabGroupComponent.postingsTabComponent) {
            this.generateEndOfMonthTabGroupComponent.detailsTabComponent.dataVersionID = this.dataVersionId;
            this.generateEndOfMonthTabGroupComponent.detailsTabComponent.dataVersionMonth = this.dataVersionMonth;
            this.generateEndOfMonthTabGroupComponent.detailsTabComponent.reportType = this.reportType;
            this.generateEndOfMonthTabGroupComponent.detailsTabComponent.reportTypeDescription = this.reportTypeDescription;
        }
        if (this.generateEndOfMonthTabGroupComponent.unrealizedPostingsTabComponent) {
            this.generateEndOfMonthTabGroupComponent.unrealizedPostingsTabComponent.dataVersionID = this.dataVersionId;
            this.generateEndOfMonthTabGroupComponent.unrealizedPostingsTabComponent.dataVersionMonth = this.dataVersionMonth;
            this.generateEndOfMonthTabGroupComponent.unrealizedPostingsTabComponent.reportType = this.reportType;
            this.generateEndOfMonthTabGroupComponent.unrealizedPostingsTabComponent.reportTypeDescription = this.reportTypeDescription;
        }
        if (this.generateEndOfMonthTabGroupComponent.unrealizedDetailsTabComponent) {
            this.generateEndOfMonthTabGroupComponent.unrealizedDetailsTabComponent.dataVersionID = this.dataVersionId;
            this.generateEndOfMonthTabGroupComponent.unrealizedDetailsTabComponent.dataVersionMonth = this.dataVersionMonth;
            this.generateEndOfMonthTabGroupComponent.unrealizedDetailsTabComponent.reportType = this.reportType;
            this.generateEndOfMonthTabGroupComponent.unrealizedDetailsTabComponent.reportTypeDescription = this.reportTypeDescription;
        }

        this.generateEndOfMonthTabGroupComponent.updateCurrentDatabaseBitValue(this.isCurrentDatabase);

        if (this.buttonDisableForPrevilage) {
            this.disableButton = true;
        } else {
            this.disableButton = this.buttonEditable;
        }
        if (this.reportType === ReportType.UnRealized) {
            this.generateEndOfMonthTabGroupComponent.overviewTabComponent.getTradeCostListPosting(this.dataVersionId);
        }
    }
    filtered(filter: FilterGem) {
        this.departmentDropdownComponent.objects = this.getDistinctString(filter.departmentCode);
        this.charterDropdownComponent.objects = this.getDistinctString(filter.charterCode);
        this.costTypeDropdownComponent.objects = this.getDistinctString(filter.costType);
        this.associatedClientDropdownComponent.objects = this.getDistinctString(filter.associatedClient);
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
    onDiscardButtonClicked() {
        this.router.navigate(['/' + this.companyManager.getCurrentCompanyId() + '/financial/cut-off/generate-end-of-month']);
    }
    onGeneratePostingsButtonClicked() {
        this.generateEndOfMonthTabGroupComponent.overviewTabComponent.onGenerateTADocument();
    }

    onSelectedIndexChanged1(tabIndex: number) {
        this.tabIndex = tabIndex;
    }

    onApplyButtonClicked() {
        if (this.departmentDropdownComponent.allSelected &&
            this.charterDropdownComponent.allSelected &&
            this.costTypeDropdownComponent.allSelected &&
            this.associatedClientDropdownComponent.allSelected) {
            this.isFilterApplied = false;
            this.generateEndOfMonthTabGroupComponent.isFilterApplied = false;

        } else {
            this.isFilterApplied = true;
            this.generateEndOfMonthTabGroupComponent.isFilterApplied = true;
        }
        this.selectedFilters();
        if (this.reportType === ReportType.Realized) {
            this.originalOverviewGridRows = this.generateEndOfMonthTabGroupComponent.overviewTabComponent.originalOverviewGridRows;
            this.originalDetailsGridRows = this.generateEndOfMonthTabGroupComponent.detailsTabComponent.originalDetailsGridRows;
            this.originalPostingsGridRows = this.generateEndOfMonthTabGroupComponent.postingsTabComponent.originalPostingsGridRows;

            switch (this.tabIndex) {
                case 0: {
                    this.generateEndOfMonthTabGroupComponent.
                        getFilteredData(0, this.applyFilter(this.originalOverviewGridRows));
                    this.generateEndOfMonthTabGroupComponent.overviewTabComponent.
                        calculateGrandTotal(this.applyFilter(this.originalOverviewGridRows));
                    break;
                }
                case 1: {
                    this.generateEndOfMonthTabGroupComponent.
                        getFilteredData(1, this.applyFilter(this.originalDetailsGridRows));
                    break;
                }
                case 2: {
                    this.generateEndOfMonthTabGroupComponent.
                        getFilteredData(2, this.applyFilter(this.originalPostingsGridRows));
                    break;
                }
            }
        } else {

            this.originalDetailsGridRows = this.generateEndOfMonthTabGroupComponent.unrealizedDetailsTabComponent.originalDetailsGridRows;
            this.originalPostingsGridRows = this.generateEndOfMonthTabGroupComponent.unrealizedPostingsTabComponent.originalPostingsGridRows;
            switch (this.tabIndex) {

                case 0: {
                    this.generateEndOfMonthTabGroupComponent.
                        getFilteredData(1, this.applyFilter(this.originalDetailsGridRows));
                    break;
                }
                case 1: {
                    this.generateEndOfMonthTabGroupComponent.
                        getFilteredData(2, this.applyFilter(this.originalPostingsGridRows));
                    break;
                }
            }

        }
    }
    selectedFilters() {
        this.selectedDepartments = this.departmentDropdownComponent.allSelected ? this.departmentDropdownComponent.objects :
            this.departmentDropdownComponent.selectedValues;
        this.selectedCharter = this.charterDropdownComponent.allSelected ? this.charterDropdownComponent.objects :
            this.charterDropdownComponent.selectedValues;
        this.selectedCostType = this.costTypeDropdownComponent.allSelected ? this.costTypeDropdownComponent.objects :
            this.costTypeDropdownComponent.selectedValues;
        this.selectedAssociatedClient = this.associatedClientDropdownComponent.allSelected ?
            this.associatedClientDropdownComponent.objects :
            this.associatedClientDropdownComponent.selectedValues;
    }
    applyFilter(filterRows: OverviewGenerateEndOfMonthDisplayView[]) {
        if (this.isFilterApplied) {
            const deptFilter: OverviewGenerateEndOfMonthDisplayView[] = [];
            const charterFilter: OverviewGenerateEndOfMonthDisplayView[] = [];
            const costTypeFilter: OverviewGenerateEndOfMonthDisplayView[] = [];
            const associatedClientFilter: OverviewGenerateEndOfMonthDisplayView[] = [];
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
                const charterCode = this.selectedCharter.find((y) => y.desc === x.charterCode);
                if (charterCode) {
                    if (x.charterCode === charterCode.desc) {
                        charterFilter.push(x);
                    }
                } else {
                    if (x.charterCode === null) {
                        charterFilter.push(x);
                    }
                }
            });

            filterRows = charterFilter;

            filterRows.filter((x) => {
                const costTypeCode = this.selectedCostType.find((y) => y.desc === x.costType);
                if (costTypeCode) {
                    if (x.costType === costTypeCode.desc) {
                        costTypeFilter.push(x);
                    }
                }
            });

            filterRows = costTypeFilter;
            filterRows.filter((x) => {
                const associatedClientCode = this.selectedAssociatedClient.find((y) => y.desc === x.associatedClient);
                if (associatedClientCode) {
                    if (x.associatedClient === associatedClientCode.desc) {
                        associatedClientFilter.push(x);
                    }
                } else {
                    if (x.associatedClient === null) {
                        associatedClientFilter.push(x);
                    }
                }
            });
            filterRows = associatedClientFilter;
            return filterRows;
        } else {
            filterRows = [];
            return filterRows;
        }
    }

    onDepartmentSelectionChanges() {
        const deptFilter: OverviewGenerateEndOfMonthDisplayView[] = [];
        const charterFilter: FilterValueGenerateEndMonth[] = [];
        const costTypeFilter: FilterValueGenerateEndMonth[] = [];
        const associatedClientFilter: FilterValueGenerateEndMonth[] = [];
        this.selectedFilters();
        this.originalOverviewGridRows = this.generateEndOfMonthTabGroupComponent.overviewTabComponent.originalOverviewGridRows;
        this.originalOverviewGridRows.filter((x) => {
            const deptCode = this.selectedDepartments.find((y) => y.desc === x.departmentCode);
            if (deptCode) {
                if (x.departmentCode === deptCode.desc) {
                    deptFilter.push(x);
                }
            }
        });

        this.charterDropdownComponent.formCtrl.reset();
        this.costTypeDropdownComponent.formCtrl.reset();
        this.associatedClientDropdownComponent.formCtrl.reset();
        let count = 1;
        deptFilter.forEach((x) => {
            if (x.charterCode) {
                const charter = new FilterValueGenerateEndMonth();
                charter.desc = x.charterCode;
                charter.value = count;
                charterFilter.push(charter);
            }
            if (x.costType) {
                const cost = new FilterValueGenerateEndMonth();
                cost.desc = x.costType;
                cost.value = count;
                costTypeFilter.push(cost);
            }
            if (x.associatedClient) {
                const client = new FilterValueGenerateEndMonth();
                client.desc = x.associatedClient;
                client.value = count;
                associatedClientFilter.push(client);
            }
            count = count + 1;
        });
        this.charterDropdownComponent.objects = this.getDistinctString(charterFilter);
        this.costTypeDropdownComponent.objects = this.getDistinctString(costTypeFilter);
        this.associatedClientDropdownComponent.objects = this.getDistinctString(associatedClientFilter);
        if (this.departmentDropdownComponent.allSelected) {
            this.charterDropdownComponent.setSelectedValue(true, this.getDistinctString(charterFilter));
            this.costTypeDropdownComponent.setSelectedValue(true, this.getDistinctString(costTypeFilter));
            this.associatedClientDropdownComponent.setSelectedValue(true, this.getDistinctString(associatedClientFilter));

        } else {
            this.charterDropdownComponent.setSelectedValue(false, this.getDistinctString(charterFilter));
            this.costTypeDropdownComponent.setSelectedValue(false, this.getDistinctString(costTypeFilter));
            this.associatedClientDropdownComponent.setSelectedValue(false, this.getDistinctString(associatedClientFilter));
        }

    }
    onCharterSelectionChanges() {
        const charterFilter: OverviewGenerateEndOfMonthDisplayView[] = [];
        const costTypeFilter: FilterValueGenerateEndMonth[] = [];
        const associatedClientFilter: FilterValueGenerateEndMonth[] = [];
        this.selectedFilters();
        this.originalOverviewGridRows = this.generateEndOfMonthTabGroupComponent.overviewTabComponent.originalOverviewGridRows;
        this.originalPostingsGridRows = this.generateEndOfMonthTabGroupComponent.postingsTabComponent.originalPostingsGridRows;
        this.originalOverviewGridRows.filter((x) => {
            const charterCode = this.selectedCharter.find((y) => y.desc === x.charterCode);
            if (charterCode) {
                if (x.charterCode === charterCode.desc) {
                    charterFilter.push(x);
                }
            }
        });
        this.originalPostingsGridRows.filter((x) => {
            const charterCode = this.selectedCharter.find((y) => y.desc === x.charterCode);
            if (charterCode) {
                if (x.charterCode === charterCode.desc) {
                    charterFilter.push(x);
                }
            }
        });
        this.costTypeDropdownComponent.formCtrl.reset();
        this.associatedClientDropdownComponent.formCtrl.reset();
        let count = 1;
        charterFilter.forEach((x) => {
            if (x.costType) {
                const cost = new FilterValueGenerateEndMonth();
                cost.desc = x.costType;
                cost.value = count;
                costTypeFilter.push(cost);
            }
            if (x.associatedClient) {
                const client = new FilterValueGenerateEndMonth();
                client.desc = x.associatedClient;
                client.value = count;
                associatedClientFilter.push(client);
            }
            count = count + 1;
        });
        this.costTypeDropdownComponent.objects = this.getDistinctString(costTypeFilter);
        this.associatedClientDropdownComponent.objects = this.getDistinctString(associatedClientFilter);
        if (this.charterDropdownComponent.allSelected) {
            this.costTypeDropdownComponent.setSelectedValue(true, this.getDistinctString(costTypeFilter));
            this.associatedClientDropdownComponent.setSelectedValue(true, this.getDistinctString(associatedClientFilter));

        } else {
            this.costTypeDropdownComponent.setSelectedValue(false, this.getDistinctString(costTypeFilter));
            this.associatedClientDropdownComponent.setSelectedValue(false, this.getDistinctString(associatedClientFilter));
        }
    }

    onCostTypeSelectionChanges() {
        const costTypeFilter: OverviewGenerateEndOfMonthDisplayView[] = [];
        const associatedClientFilter: FilterValueGenerateEndMonth[] = [];
        this.selectedFilters();
        this.originalOverviewGridRows = this.generateEndOfMonthTabGroupComponent.overviewTabComponent.originalOverviewGridRows;
        this.originalPostingsGridRows = this.generateEndOfMonthTabGroupComponent.postingsTabComponent.originalPostingsGridRows;
        this.originalOverviewGridRows.filter((x) => {
            const costTypeCode = this.selectedCostType.find((y) => y.desc === x.costType);
            if (costTypeCode) {
                if (x.costType === costTypeCode.desc) {
                    costTypeFilter.push(x);
                }
            }
        });
        this.originalPostingsGridRows.filter((x) => {
            const costTypeCode = this.selectedCostType.find((y) => y.desc === x.costType);
            if (costTypeCode) {
                if (x.costType === costTypeCode.desc) {
                    costTypeFilter.push(x);
                }
            }
        });

        this.associatedClientDropdownComponent.formCtrl.reset();
        let count = 1;
        costTypeFilter.forEach((x) => {
            if (x.associatedClient) {
                const client = new FilterValueGenerateEndMonth();
                client.desc = x.associatedClient;
                client.value = count;
                associatedClientFilter.push(client);
            }
            count = count + 1;
        });
        this.associatedClientDropdownComponent.objects = this.getDistinctString(associatedClientFilter);
        if (this.costTypeDropdownComponent.allSelected) {
            this.associatedClientDropdownComponent.setSelectedValue(true, this.getDistinctString(associatedClientFilter));

        } else {
            this.associatedClientDropdownComponent.setSelectedValue(false, this.getDistinctString(associatedClientFilter));
        }

    }

    onMappingErrorChange(value: boolean): void {
        this.isMappingError = value;
    }
}
