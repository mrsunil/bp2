import { Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { environment } from '../../../../../../environments/environment';
import { CompanyManagerService } from '../../../../../core/services/company-manager.service';
import { ContextualSearchMultipleAutocompleteSelectComponent } from '../../../../../shared/components/form-components/multiple-autocomplete-dropdown/contextual-search/contextual-search-multiple-autocomplete-select.component';
import { SSRSReportViewerComponent } from '../../../../../shared/components/ssrs-report-viewer/ssrsreport-viewer.component';
import { inDropdownListValidator } from '../../../../../shared/directives/autocomplete-dropdown.directive';
import { AtlasFormControl } from '../../../../../shared/entities/atlas-form-control';
import { Company } from '../../../../../shared/entities/company.entity';
import { Currency } from '../../../../../shared/entities/currency.entity';
import { Department } from '../../../../../shared/entities/department.entity';
import { Freeze } from '../../../../../shared/entities/freeze.entity';
import { MasterData } from '../../../../../shared/entities/masterdata.entity';
import { FreezeDisplayView } from '../../../../../shared/models/freeze-display-view';
import { ApiPaginatedCollection } from '../../../../../shared/services/common/models';
import { FormConfigurationProviderService } from '../../../../../shared/services/form-configuration-provider.service';
import { FreezeService } from '../../../../../shared/services/http-services/freeze.service';
import { SnackbarService } from '../../../../../shared/services/snackbar.service';
import { nameof } from '../../../../../shared/services/util.service';

@Component({
    selector: 'atlas-fx-exposure-report',
    templateUrl: './fx-exposure-report.component.html',
    styleUrls: ['./fx-exposure-report.component.scss'],
})
export class FxExposureReportComponent implements OnInit {
    @ViewChild('ssrsReportViewer') ssrsReportViewer: SSRSReportViewerComponent;
    @ViewChild('currencyDropdownComponent') currencyDropdownComponent: ContextualSearchMultipleAutocompleteSelectComponent;
    @ViewChild('departmentDropdownComponent') departmentDropdownComponent: ContextualSearchMultipleAutocompleteSelectComponent;

    fxExposureSnapshotCtrl = new FormControl();
    companySelect: string[] = ['companyId'];
    columnsListDisplayProperty: string[] = ['name'];

    snapshotList: FreezeDisplayView[] = [];
    currentSnapshot = new FreezeDisplayView(-1, 'CURRENT');
    company: string;
    parameters: any[] = [];
    toBeDownloaded: boolean = false;
    isViewRealizedPhysicals: boolean = false;
    isDisplay: boolean = false;
    isExcludeBankAccount: boolean = false;
    isExcludeGLAccount: boolean = false;
    masterData: MasterData;

    companyList: Company[] = [];
    currencyValue: Currency[];
    currencies: Currency[];
    departments: Department[] = [];
    filteredCompany: Company[] = [];
    selectedCompanies: string[] = [];
    filteredDepartments: Department[] = [];
    selectedFilteredDepartments: Department[] = [];
    reportServerUrl = environment.reportServerLink;
    reportPath = 'LDC Atlas/FxExposure/FxExposureSummary';
    reportPathForDownload = 'LDC Atlas/FxExposure/FxExposureDetailDownload';
    showError = false;

    destroy$ = new Subject();
    fxExpouserReportFormGroup: FormGroup;
    CurrencyAllOptions = {
        currencyCode: 'All',
    };
    allCurrenciesSelected = true;
    departmentAllOptions = {
        departmentCode: 'All',
        departmentId: 0,
    };
    allDepartmentsSelected = true;

    constructor(
        private freezeService: FreezeService,
        private snackbarService: SnackbarService,
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private companyManager: CompanyManagerService,
        protected formConfigurationProvider: FormConfigurationProviderService) {
        // super(formConfigurationProvider);
        this.company = this.route.snapshot.paramMap.get('company');

    }

    ngOnInit() {
        this.masterData = this.route.snapshot.data.masterdata;
        this.currencies = this.route.snapshot.data.masterdata.currencies;
        this.currencyDropdownComponent.options = this.currencies;
        this.currencyDropdownComponent.optionsChanged();
        this.filteredDepartments = this.masterData.departments;
        this.departmentDropdownComponent.options = this.filteredDepartments;
        this.departmentDropdownComponent.optionsChanged();
        this.loadSnapshots();
    }

    /*    getCompaniesList(): any[] {
            const options: Company[] = this.companyManager.getLoadedCompanies();
            return options;
        }*/

    // will be implemented when the db changes for company list is done .
    /*   onCompanySelected(data: object[]) {
           if (data) {
               this.selectedCompanies = [];
               if (data.length > 0) {
                   data.forEach((company) => { this.selectedCompanies.push(company['companyId']); });
               }
               this.reportCriterias.getDataForSelectedCompanies(this.selectedCompanies);
           }
       }*/

    initializeForm() {
        this.fxExpouserReportFormGroup = this.formBuilder.group({
        });

        this.setValidators();
        return this.fxExpouserReportFormGroup;
    }

    setValidators() {
        this.fxExposureSnapshotCtrl.setValidators(Validators.compose([
            inDropdownListValidator(
                this.snapshotList,
                nameof<FreezeDisplayView>('dataVersionId'),
            ),
            Validators.required,
        ]));
    }

    loadSnapshots() {
        this.freezeService.getFreezeList().pipe(
            map((data: ApiPaginatedCollection<Freeze>) => {
                return data.value.map((freeze) => {
                    return new FreezeDisplayView(
                        freeze.dataVersionId,
                        this.freezeService.toFormattedDate(freeze.dataVersionTypeId, freeze.freezeDate),
                        freeze.freezeDate,
                        freeze.dataVersionTypeId);
                });
            }),
            takeUntil(this.destroy$),
        ).subscribe((snapshots: FreezeDisplayView[]) => {
            this.snapshotList = snapshots;
            if (snapshots.length > 0) {
                this.fxExposureSnapshotCtrl.setValue(snapshots[0]);
            }
            this.snapshotList.unshift(this.currentSnapshot);
            this.initializeForm();
        });
    }

    onToggleDisplay() {
        this.isDisplay = !this.isDisplay;
    }
    onToggleExcludeBankAccount() {
        this.isExcludeBankAccount = !this.isExcludeBankAccount;
    }
    onToggleExcludeGLAccount() {
        this.isExcludeGLAccount = !this.isExcludeGLAccount;
    }
    onCurrencySelectionChanged(selectedCurrency: Currency[]) {
        this.currencyValue = selectedCurrency;
    }
    onDepartmentSelectionChange(selectedDepartment: Department[]) {
        this.departments = selectedDepartment;
    }
    onGenerateReportButtonClicked() {
        const snapshotId = (this.fxExposureSnapshotCtrl.value as FreezeDisplayView).dataVersionId;
        if (snapshotId !== -1 && this.selectedCompanies.length > 0) {
            const freezeDate = this.fxExposureSnapshotCtrl.value;
            this.freezeService.checkFreezeForSelectedDatabase(this.selectedCompanies, freezeDate['dataVersionTypeId'],
                freezeDate, null, null).subscribe((data: any) => {
                    if (data) {
                        let missingCompanyList: string;

                        if (data.missingCompany) {
                            this.showError = true;
                            missingCompanyList = data.missingCompany;
                        } else {
                            this.showError = false;
                        }
                        if (!this.showError) {
                            this.onGenerateReportParameter();
                            this.toBeDownloaded = false;
                            this.ssrsReportViewer.generateReport(this.reportServerUrl, this.reportPath, this.parameters);
                        } else {
                            this.snackbarService.throwErrorSnackBar('The freeze is not present in company '
                                + missingCompanyList + ' report cannot be generated');
                        }
                    }
                });
        } else {
            this.onGenerateReportParameter();
            this.toBeDownloaded = false;
            this.ssrsReportViewer.generateReport(this.reportServerUrl, this.reportPath, this.parameters);
        }
    }

    onGenerateExcelButtonClicked() {
        this.onGenerateReportParameter();
        this.toBeDownloaded = true;
        this.ssrsReportViewer.generateReport(this.reportServerUrl, this.reportPathForDownload, this.parameters);
    }

    onGenerateReportParameter() {
        const snapshotId = (this.fxExposureSnapshotCtrl.value as FreezeDisplayView).dataVersionId;

        this.parameters = [];

        this.parameters.push({ name: 'iCompanyName', value: this.route.snapshot.params.company });

        if (this.departments.length < this.filteredDepartments.length) {
            this.departments.forEach((department: Department) => {
                this.parameters.push({ name: 'iDepartmentId', value: department.departmentId });
            });
        }
        if (this.currencyValue && this.currencyValue.length < this.currencies.length) {
            this.currencyValue.forEach((currency: Currency) => {
                this.parameters.push({ name: 'iCurrencyCode', value: currency.currencyCode });
            });
        }
        if (snapshotId != -1) {
            this.parameters.push({ name: 'iDataVersionId', value: snapshotId });
        }
        if (this.isDisplay) {
            this.parameters.push({ name: 'iDisplayOpenRealised', value: 1 });
        }
        if (this.isExcludeBankAccount) {
            this.parameters.push({ name: 'iExcludeBankAccount', value: 1 });
        }
        if (this.isExcludeGLAccount) {
            this.parameters.push({ name: 'iExcludeGLAccount', value: 1 });
        }
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
