import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { finalize, map } from 'rxjs/operators';
import { BaseFormComponent } from '../../../../../shared/components/base-form-component/base-form-component.component';
import { SectionSearchResult } from '../../../../../shared/dtos/section-search-result';
import { AtlasFormControl } from '../../../../../shared/entities/atlas-form-control';
import { Charter } from '../../../../../shared/entities/charter.entity';
import { Department } from '../../../../../shared/entities/department.entity';
import { MasterData } from '../../../../../shared/entities/masterdata.entity';
import { ProfitCenter } from '../../../../../shared/entities/profit-center.entity';
import { FormConfigurationProviderService } from '../../../../../shared/services/form-configuration-provider.service';
import { ExecutionService } from '../../../../../shared/services/http-services/execution.service';
import { MasterdataService } from '../../../../../shared/services/http-services/masterdata.service';
import { TradingService } from '../../../../../shared/services/http-services/trading.service';
import { UtilService } from '../../../../../shared/services/util.service';
import { ContextualSearchMultipleAutocompleteSelectComponent } from './../../../../../shared/components/form-components/multiple-autocomplete-dropdown/contextual-search/contextual-search-multiple-autocomplete-select.component';
import { MultipleAutocompleteDropdownComponent } from './../../../../../shared/components/multiple-autocomplete-dropdown/multiple-autocomplete-dropdown.component';

@Component({
    selector: 'atlas-report-criterias',
    templateUrl: './report-criterias.component.html',
    styleUrls: ['./report-criterias.component.scss'],
})

export class ReportCriteriasComponent extends BaseFormComponent implements OnInit {
    @ViewChild('departmentDropdownComponent') departmentDropdownComponent: ContextualSearchMultipleAutocompleteSelectComponent;
    @ViewChild('profitCenterDropdownComponent') profitCenterDropdownComponent: ContextualSearchMultipleAutocompleteSelectComponent;
    @ViewChild('contractDropdownComponent') contractDropdownComponent: ContextualSearchMultipleAutocompleteSelectComponent;
    @ViewChild('charterDropdownComponent') charterDropdownComponent: ContextualSearchMultipleAutocompleteSelectComponent;
    contractCodeCtrl = new FormControl('');
    charterCodeCtrl = new AtlasFormControl('charterCodeCriteria');
    filteredContracts: SectionSearchResult[] = [];
    selectedFilteredContracts: SectionSearchResult[];
    filteredCharters: Charter[] = [];
    charters: Charter[] = [];
    contracts: SectionSearchResult[] = [];
    masterdata: MasterData;
    reportCriteriaFormGroup: FormGroup;
    departments: Department[] = [];
    filteredDepartments: Department[] = [];
    selectedFilteredDepartments: Department[] = [];
    profitCenterIds: number[] = [];
    charterIds: number[] = [];
    charterDisplayProperty: string[] = ['name'];
    profitCenters: ProfitCenter[] = [];
    company: string;

    contractAllOptions = {
        contractLabel: 'All',
        sectionId: 0,
    };
    allContractSelected = true;

    departmentAllOptions = {
        departmentCode: 'All',
        departmentId: 0,
    };
    allDepartmentsSelected = true;

    charterAllOptions = {
        charterCode: 'All',
        charterId: 0,
    };
    allChartersSelected = true;

    profitCenterAllOptions = {
        profitCenterCode: 'All',
        profitCenterId: 0,
    };
    allProfitCentersSelected = true;
    iscompanySelected: boolean = false;
    isContractLoading: boolean;
    isCharterLoading: boolean;

    constructor(
        private formBuilder: FormBuilder,
        protected utilService: UtilService,
        private executionService: ExecutionService,
        private masterdataService: MasterdataService,
        private tradingService: TradingService,
        private route: ActivatedRoute,
        protected formConfigurationProvider: FormConfigurationProviderService) {
        super(formConfigurationProvider);

    }

    ngOnInit() {
        this.initializeForm();
        this.company = this.route.snapshot.paramMap.get('company');
        this.initContracts();
        this.initCharters();
        this.masterdata = this.route.snapshot.data.masterdata;
        this.departments = this.masterdata.departments;
        this.initProfitCenters();
    }

    initContracts() {
        this.isContractLoading = true;
        this.tradingService.getAll().pipe(
            finalize(() => {
                this.isContractLoading = false;
            }))
            .subscribe((contracts) => {
                this.contracts = contracts.value;
                this.onDepartmentSelectionChanged(this.filteredDepartments);
            });
    }

    initProfitCenters() {
        this.profitCenters = this.route.snapshot.data.masterdata.profitCenters.map((X) => ({ ...X }));
        this.profitCenters = this.profitCenters.map((profitCenter) => {
            profitCenter.profitCenterCode = this.company + ' - ' + profitCenter.profitCenterCode;
            return profitCenter;
        });
        this.profitCenterDropdownComponent.options = this.profitCenters;
        this.profitCenterDropdownComponent.optionsChanged();
        this.onprofitSelectionChanged(this.profitCenters);
    }

    onprofitSelectionChanged(profitCenters: ProfitCenter[]) {
        if (profitCenters) {
            this.profitCenterIds = profitCenters.map((profitCenter) => profitCenter.profitCenterId);
            if (this.departments.length > 0) {
                this.filteredDepartments = this.departments.map((X) => ({ ...X }));
                this.filteredDepartments = this.filteredDepartments.filter((department) => {
                    return this.profitCenterIds.includes(department.profitCenterId);
                });
                this.filteredDepartments = this.filteredDepartments.map((department) => {
                    department.departmentCode = department.companyCode + ' - ' + department.departmentCode;
                    return department;
                });
                this.departmentDropdownComponent.options = this.filteredDepartments;
                this.departmentDropdownComponent.optionsChanged();
            }
        }
    }

    initCharters() {
        this.charterIds = [];
        this.isCharterLoading = true;
        this.executionService.getCharters().pipe(
            finalize(() => {
                this.isCharterLoading = false;
            }))
            .subscribe((charters) => {
                this.charters = charters.value;
                for (const charter of this.charters) {
                    this.charterIds.push(charter['charterId']);
                }
                this.charters = this.charters.map((charter) => {
                    charter.charterCode = this.company + ' - ' + charter.charterCode;
                    return charter;
                });
                this.charterDropdownComponent.options = this.charters;
                this.charterDropdownComponent.optionsChanged();
            });
    }

    onDepartmentSelectionChanged(departments: Department[]) {
        this.selectedFilteredDepartments = departments ? departments : [];
        if (departments && !this.iscompanySelected) {
            const departmentsIds = departments.map((departmentList) => departmentList.departmentId);
            const filteredDepartments = this.masterdata.departments.filter((department) => {
                return departmentsIds.includes(department.departmentId);
            });
            const selectedDepartments = filteredDepartments.map((department) => department.departmentCode);

            this.filteredContracts = this.contracts.filter((contract) => {
                return selectedDepartments.includes(contract.departmentCode);
            });
            this.contractDropdownComponent.options = this.filteredContracts;
            this.contractDropdownComponent.optionsChanged();
        }
    }

    onContractSelectionChanged(contracts: SectionSearchResult[]) {
        this.selectedFilteredContracts = contracts ? contracts : [];
    }

    getDataForSelectedCompanies(selectedCompanies: string[]) {
        this.charterIds = [];
        this.iscompanySelected = selectedCompanies.length > 0 ? true : false;
        this.subscriptions.push(forkJoin([
            this.masterdataService.getProfitCenterForSelectedCompanyId(selectedCompanies).pipe(
                map((profitCenters: any) => {
                    return profitCenters.value;
                }),
            ),
            this.masterdataService.getDepartmentsForSelectedCompanyId('', null, selectedCompanies).pipe(
                map((departments: any) => {
                    return departments.value;
                }),
            ),
            this.executionService.getChartersForCompanies(selectedCompanies).pipe(
                map((charters: any) => {
                    return charters.value;
                }),
            )])
            .subscribe((result: [ProfitCenter[], Department[], Charter[]]) => {
                this.profitCenters = result[0];
                this.departments = result[1];
                this.charters = result[2];

                this.profitCenters = this.profitCenters.map((profitCenter) => {
                    profitCenter.profitCenterCode = profitCenter.companyCode + ' - ' + profitCenter.profitCenterCode;
                    return profitCenter;
                });
                this.profitCenterDropdownComponent.options = this.profitCenters;
                this.profitCenterDropdownComponent.optionsChanged();
                this.onprofitSelectionChanged(this.profitCenters);
                for (const charter of this.charters) {
                    this.charterIds.push(charter['charterId']);
                }
                this.charters = this.charters.map((charter) => {
                    charter.charterCode = charter.company + ' - ' + charter.charterCode;
                    return charter;
                });
                this.charterDropdownComponent.options = this.charters;
                this.charterDropdownComponent.optionsChanged();
                if (this.iscompanySelected) {
                    this.contractDropdownComponent.fieldControl.disable();
                } else {
                    this.contractDropdownComponent.fieldControl.enable();
                }
            }));
    }

    onCharterSelectionChanged(charters: Charter[]) {
        if (charters) {
            this.charterIds = charters.map((charter) => charter.charterId);
        }
    }

    initializeForm() {
        this.reportCriteriaFormGroup = this.formBuilder.group({
            contractCodeCtrl: this.contractCodeCtrl,
            charterCodeCtrl: this.charterCodeCtrl,
        });
        return super.getFormGroup();
    }

    getReportCriterias(
        params,
        profitCenterParam: string = 'RP_LDC_LDREP_PL_Profit_Center',
        departmentParam: string = 'RP_LDC_LDREP_PL_Department',
        contractNumberParam: string = 'RP_LDC_LDREP_PL_Contract_Number',
        charterParam: string = 'RP_LDC_LDREP_PL_CharterId',
    ): any {
        if (this.profitCenterIds.length === 0) {
            params.push({ name: 'isAllProfitCenterSelected', value: 0 });
        } else if (!this.profitCenterDropdownComponent.allSelected) {
            this.profitCenterIds.forEach((id: number) => {
                params.push({ name: profitCenterParam, value: id });
            });
        }

        if (this.selectedFilteredDepartments.length === 0) {
            params.push({ name: 'isAllDepartmentSelected', value: 0 });
        } else if (this.selectedFilteredDepartments.length < this.filteredDepartments.length) {
            this.selectedFilteredDepartments.forEach((department: Department) => {
                params.push({ name: departmentParam, value: department.departmentId });
            });
        }

        if (this.selectedFilteredContracts.length === 0) {
            params.push({ name: 'isAllContractNumberSelected', value: 0 });
        } else if (this.selectedFilteredContracts.length < this.filteredContracts.length) {
            this.selectedFilteredContracts.forEach((contract: SectionSearchResult) => {
                params.push({ name: contractNumberParam, value: contract.sectionId });
            });
        }

        if (this.charterIds.length === 0) {
            params.push({ name: 'isAllCharterSelected', value: 0 });
        } else if (!this.charterDropdownComponent.allSelected) {
            this.charterIds.forEach((id: number) => {
                params.push({ name: charterParam, value: id });
            });
        }
        return params;
    }

}
