import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { environment } from '../../../../../../../environments/environment';
import { CompanyManagerService } from '../../../../../../core/services/company-manager.service';
import { BaseFormComponent } from '../../../../../../shared/components/base-form-component/base-form-component.component';
import { SSRSReportViewerComponent } from '../../../../../../shared/components/ssrs-report-viewer/ssrsreport-viewer.component';
import { inDropdownListValidator } from '../../../../../../shared/directives/autocomplete-dropdown.directive';
import { SectionSearchResult } from '../../../../../../shared/dtos/section-search-result';
import { AtlasFormControl } from '../../../../../../shared/entities/atlas-form-control';
import { ColumnsList } from '../../../../../../shared/entities/columns.list';
import { Company } from '../../../../../../shared/entities/company.entity';
import { Department } from '../../../../../../shared/entities/department.entity';
import { Freeze } from '../../../../../../shared/entities/freeze.entity';
import { MasterDataProps } from '../../../../../../shared/entities/masterdata-props.entity';
import { MasterData } from '../../../../../../shared/entities/masterdata.entity';
import { FreezeDisplayView } from '../../../../../../shared/models/freeze-display-view';
import { ApiPaginatedCollection } from '../../../../../../shared/services/common/models';
import { FormConfigurationProviderService } from '../../../../../../shared/services/form-configuration-provider.service';
import { FreezeService } from '../../../../../../shared/services/http-services/freeze.service';
import { SnackbarService } from '../../../../../../shared/services/snackbar.service';
import { TitleService } from '../../../../../../shared/services/title.service';
import { nameof } from '../../../../../../shared/services/util.service';
import { ReportCriteriasComponent } from '../../report-criterias/report-criterias.component';

@Component({
    selector: 'atlas-pnl-report',
    templateUrl: './pnl-report.component.html',
    styleUrls: ['./pnl-report.component.scss'],
})
export class PnlReportComponent extends BaseFormComponent implements OnInit {

    pnlSnapshotCtrl = new FormControl();
    pnlcompanyCtrl = new AtlasFormControl('companySelect');
    columnstoSelectCtrl = new AtlasFormControl('columnsSelected');
    companySelect: string[] = ['companyId'];
    columnsListDisplayProperty: string[] = ['name'];

    snapshotList: FreezeDisplayView[] = [];
    currentSnapshot = new FreezeDisplayView(-1, 'CURRENT');
    company: string;
    parameters: any[] = [];
    toBeDownloaded: boolean = false;
    isViewRealizedPhysicals: boolean = false;
    masterData: MasterData;
    masterdataList: string[] = [
        MasterDataProps.Companies,
    ];
    companyList: Company[] = [];
    filteredCompany: Company[] = [];
    selectedCompanies: string[] = [];
    columnsList: ColumnsList[] = [];
    reportServerUrl = environment.reportServerLink;
    reportPath = 'LDC Atlas/PnL/PnL_Summary';
    reportPathForDownload = 'LDC Atlas/PnL/PnL_Detail_Excel';
    showError = false;

    destroy$ = new Subject();
    pnlReportFormGroup: FormGroup;
    @ViewChild('ssrsReportViewer') ssrsReportViewer: SSRSReportViewerComponent;
    @ViewChild('reportCriterias') reportCriterias: ReportCriteriasComponent;

    constructor(
        private freezeService: FreezeService,
        private snackbarService: SnackbarService,
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private companyManager: CompanyManagerService,
        protected formConfigurationProvider: FormConfigurationProviderService,
        private titleService: TitleService) {
        super(formConfigurationProvider);
        this.company = this.route.snapshot.paramMap.get('company');
        this.columnsList = ColumnsList.getColumnsList();

    }

    ngOnInit() {
        this.masterData = this.route.snapshot.data.masterdata;
        this.companyList = this.getCompaniesList();
        this.filteredCompany = this.companyList.filter((event) => event.companyId !== this.company);
        this.pnlcompanyCtrl.patchValue(this.filteredCompany);
        this.titleService.setTitle(this.route.snapshot.data.title);

        this.loadSnapshots();
    }

    getCompaniesList(): any[] {
        const options: Company[] = this.companyManager.getLoadedCompanies();
        return options;
    }

    // will be implemented when the db changes for company list is done .
    onCompanySelected(data: object[]) {
        if (data) {
            this.selectedCompanies = [];
            if (data.length > 0) {
                data.forEach((company) => { this.selectedCompanies.push(company['companyId']); });
            }
            this.reportCriterias.getDataForSelectedCompanies(this.selectedCompanies);
        }
    }

    initializeForm() {
        this.pnlReportFormGroup = this.formBuilder.group({
            pnlSnapshotCtrl: this.pnlSnapshotCtrl,
            pnlcompanyCtrl: this.pnlcompanyCtrl,
            columnstoSelectCtrl: this.columnstoSelectCtrl,

        });

        this.setValidators();
        return this.pnlReportFormGroup;
    }

    setValidators() {
        this.pnlSnapshotCtrl.setValidators(Validators.compose([
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
                this.pnlSnapshotCtrl.setValue(snapshots[0]);
            }
            this.snapshotList.unshift(this.currentSnapshot);
            this.initializeForm();
        });
    }

    onToggleViewRealizedPhysicals() {
        this.isViewRealizedPhysicals = !this.isViewRealizedPhysicals;
    }

    getReportCriterias(): any {
        const parameters: any[] = [];
        if (this.reportCriterias.profitCenterIds.length === 0) {
            this.parameters.push({ name: 'isAllProfitCenterSelected', value: 0 });
        } else if (!this.reportCriterias.profitCenterDropdownComponent.allSelected) {
            this.reportCriterias.profitCenterIds.forEach((id: number) => {
                this.parameters.push({ name: 'Profit_Center', value: id });
            });
        }

        if (this.reportCriterias.selectedFilteredDepartments.length === 0) {
            this.parameters.push({ name: 'isAllDepartmentSelected', value: 0 });
        } else if (this.reportCriterias.selectedFilteredDepartments.length < this.reportCriterias.filteredDepartments.length) {
            this.reportCriterias.selectedFilteredDepartments.forEach((department: Department) => {
                this.parameters.push({ name: 'Department', value: department.departmentId });
            });
        }

        if (this.reportCriterias.selectedFilteredContracts.length === 0) {
            this.parameters.push({ name: 'isAllContractNumberSelected', value: 0 });
        } else if (this.reportCriterias.selectedFilteredContracts.length < this.reportCriterias.filteredContracts.length) {
            this.reportCriterias.selectedFilteredContracts.forEach((contract: SectionSearchResult) => {
                this.parameters.push({ name: 'Contract_Number', value: contract.sectionId });
            });
        }

        if (this.reportCriterias.charterIds.length === 0) {
            this.parameters.push({ name: 'isAllCharterSelected', value: 0 });
        } else if (!this.reportCriterias.charterDropdownComponent.allSelected) {
            this.reportCriterias.charterIds.forEach((id: number) => {
                this.parameters.push({ name: 'CharterId', value: id });
            });
        }
        return parameters;
    }

    onGenerateReportButtonClicked() {
        const snapshotId = (this.pnlSnapshotCtrl.value as FreezeDisplayView).dataVersionId;
        if (snapshotId !== -1 && this.selectedCompanies.length > 0) {
            const freezeDate = this.pnlSnapshotCtrl.value;
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
        const snapshotId = (this.pnlSnapshotCtrl.value as FreezeDisplayView).dataVersionId;
        const viewCharter = this.isViewRealizedPhysicals ? 'C' : 'N';
        const companiesList = (this.pnlcompanyCtrl.value as Company[]).map((status) => status.companyId);

        this.parameters = [
            { name: 'View', value: viewCharter },
        ];

        this.parameters = this.parameters.concat(this.getReportCriterias());

        if (snapshotId !== -1) {
            this.parameters.push({ name: 'LeftDataVersion', value: snapshotId });
        }

        if (this.columnstoSelectCtrl.value) {
            const columnsListIds = (this.columnstoSelectCtrl.value as ColumnsList[]).map((columns) => columns.value);
            columnsListIds.forEach((id: number) => {
                this.parameters.push({ name: 'ColumnsTobeSelected', value: id });
            });
        }

        if (companiesList.length === 0) {
            this.parameters.push({ name: 'CompanyId', value: this.company });
        } else {
            companiesList.push(this.company);
            companiesList.forEach((name: string) => {
                this.parameters.push({ name: 'CompanyId', value: name });
            });
        }

        this.parameters.push({ name: 'UserLoginCompany', value: this.company });
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
