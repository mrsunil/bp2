import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { environment } from '../../../../../../../environments/environment';
import { CompanyManagerService } from '../../../../../../core/services/company-manager.service';
import { BaseFormComponent } from '../../../../../../shared/components/base-form-component/base-form-component.component';
import { ConfirmationDialogComponent } from '../../../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
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
import { ReportingService } from '../../../../../../shared/services/http-services/reporting.service';
import { SnackbarService } from '../../../../../../shared/services/snackbar.service';
import { TitleService } from '../../../../../../shared/services/title.service';
import { nameof } from '../../../../../../shared/services/util.service';
import { ReportCriteriasComponent } from '../../report-criterias/report-criterias.component';

@Component({
    selector: 'atlas-pnl-movement-report',
    templateUrl: './pnl-movement-report.component.html',
    styleUrls: ['./pnl-movement-report.component.scss'],
})

export class PnlMovementReportComponent extends BaseFormComponent implements OnInit {

    pnlSnapshotCtrl = new FormControl();
    pnlComparisonSnapshotCtrl = new FormControl();
    pnlcompanyCtrl = new AtlasFormControl('companySelect');
    columnstoSelectCtrl = new AtlasFormControl('columnsSelected');

    companySelect: string[] = ['companyId'];
    columnsListDisplayProperty: string[] = ['name'];

    comparisonDBOptions: string[];
    snapshotList: FreezeDisplayView[] = [];
    comparisonSnapshotList: FreezeDisplayView[] = [];
    currentSnapshot = new FreezeDisplayView(-1, 'CURRENT');
    blankSnapshot = new FreezeDisplayView(0, '');
    company: string;
    msg: string = '';
    isDifference: boolean = false;
    isViewRealizedPhysicals: boolean = false;
    contractLimit = 500;
    masterData: MasterData;
    missingCompanyList: string[];
    masterdataList: string[] = [
        MasterDataProps.Companies,
    ];
    companyList: Company[] = [];
    filteredCompany: Company[] = [];
    companiesSelectedList: string[] = [];
    columnsList: ColumnsList[] = [];
    showError = false;

    reportServerUrl = environment.reportServerLink;
    reportPath = 'LDC Atlas/PnL/PnLMovementSummary';
    reportPathForDownload = 'LDC Atlas/PnL/PnLMovementDetailDownload';

    parameters: any[] = [];
    toBeDownloaded: boolean = false;
    destroy$ = new Subject();
    pnlMovementReportFormGroup: FormGroup;
    @ViewChild('ssrsReportViewer') ssrsReportViewer: SSRSReportViewerComponent;
    @ViewChild('reportCriterias') reportCriterias: ReportCriteriasComponent;

    constructor(
        private freezeService: FreezeService,
        private snackbarService: SnackbarService,
        private reportingService: ReportingService,
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        protected dialog: MatDialog,
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

    companyOptionSelected(companiesSelected: string[]) {
        if (companiesSelected) {
            this.companiesSelectedList = [];
            if (companiesSelected.length >= 1) {
                companiesSelected.forEach((company) => { this.companiesSelectedList.push(company['companyId']); });
                this.pnlComparisonSnapshotCtrl.setValidators(
                    Validators.compose([Validators.required]),
                );
            } else {
                this.pnlComparisonSnapshotCtrl.setValidators(null);
                this.pnlComparisonSnapshotCtrl.patchValue(null);
                this.companiesSelectedList.length = 0;
            }
            this.reportCriterias.getDataForSelectedCompanies(this.companiesSelectedList);
        }
    }

    initializeForm() {
        this.pnlMovementReportFormGroup = this.formBuilder.group({
            pnlSnapshotCtrl: this.pnlSnapshotCtrl,
            pnlComparisonSnapshotCtrl: this.pnlComparisonSnapshotCtrl,
            pnlcompanyCtrl: this.pnlcompanyCtrl,
            columnstoSelectCtrl: this.columnstoSelectCtrl,
        });

        this.setValidators();
        return this.pnlMovementReportFormGroup;
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
            this.comparisonSnapshotList = this.snapshotList
                .filter((p) => (p.freezeDate !== 'CURRENT' && p.actualfreezeDate !== this.snapshotList[1].actualfreezeDate));
            this.comparisonSnapshotList.push(this.blankSnapshot);
            this.initializeForm();
        });
    }

    selectionChanged(value) {
        if (value.dataVersionId === -1) {
            this.comparisonSnapshotList = this.snapshotList
                .filter((p) => (p.freezeDate !== 'CURRENT'));
            this.comparisonSnapshotList.push(this.blankSnapshot);
        } else {
            if (this.snapshotList.filter((p) => (p.actualfreezeDate < value.actualfreezeDate)).length > 0) {
                this.comparisonSnapshotList = this.snapshotList
                    .filter((p) => (p.actualfreezeDate < value.actualfreezeDate));
                this.comparisonSnapshotList.push(this.blankSnapshot);
            } else {
                this.comparisonSnapshotList = this.snapshotList
                    .filter((p) => (p.actualfreezeDate < value.actualfreezeDate));
            }
        }
    }

    onToggleIncludeDifferences() {
        this.isDifference = !this.isDifference;
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
                this.parameters.push({ name: 'ProfitCenter', value: id });
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
                this.parameters.push({ name: 'ContractNumber', value: contract.sectionId });
            });
        }

        if (this.reportCriterias.charterIds.length === 0) {
            this.parameters.push({ name: 'isAllCharterSelected', value: 0 });
        } else if (!this.reportCriterias.charterDropdownComponent.allSelected) {
            this.reportCriterias.charterIds.forEach((id: number) => {
                this.parameters.push({ name: 'Charter', value: id });
            });
        }
        return parameters;
    }

    onGenerateReportButtonClicked() {
        if (this.validate()) {
            const freezeDate = this.pnlSnapshotCtrl.value;
            const comparisonDBDate = this.pnlComparisonSnapshotCtrl.value;
            if (this.companiesSelectedList.length > 0) {
                const snapshotId = (this.pnlSnapshotCtrl.value) ? (this.pnlSnapshotCtrl.value as FreezeDisplayView).dataVersionId : -1;
                const comparisonDatabaseId = (this.pnlComparisonSnapshotCtrl.value) ?
                    (this.pnlComparisonSnapshotCtrl.value as FreezeDisplayView).dataVersionId : -1;
                if (snapshotId !== -1 || comparisonDatabaseId !== -1) {
                    this.freezeService.checkFreezeForSelectedDatabase(this.companiesSelectedList, freezeDate['dataVersionTypeId'],
                        freezeDate, comparisonDBDate['dataVersionTypeId'], comparisonDBDate).
                        subscribe((data: any) => {
                            if (data) {
                                this.missingCompanyList = [];

                                this.showError = (data.missingCompany || data.comparisonMissingCompany) ? true : false;
                                if (data.missingCompany) {
                                    this.missingCompanyList.push(data.missingCompany);
                                }
                                if (data.comparisonMissingCompany) {
                                    this.missingCompanyList.push(data.comparisonMissingCompany);
                                }

                                if (!this.showError && this.missingCompanyList.length === 0) {
                                    this.CheckDataBaseForSelectedCompany(freezeDate, comparisonDBDate);
                                    this.onGenerateReportParameter();
                                    this.toBeDownloaded = false;
                                    this.ssrsReportViewer.generateReport(this.reportServerUrl, this.reportPath, this.parameters);

                                } else {
                                    this.snackbarService.throwErrorSnackBar('The freeze is not present in company '
                                        + this.missingCompanyList + ' report cannot be generated');
                                    this.msg = '';
                                    if (data.missingCompany) {
                                        this.msg = 'Snapshot not present in ' + data.missingCompany;

                                    }
                                    if (data.comparisonMissingCompany) {
                                        this.msg = (this.msg) ?
                                            this.msg + ' and Comparison db not present in ' + data.comparisonMissingCompany :
                                            'Comparison db not present in ' + data.comparisonMissingCompany;
                                    }
                                    this.snackbarService.throwErrorSnackBar(this.msg);

                                }
                            }
                        });
                }
            } else {
                this.CheckDataBaseForSelectedCompany(freezeDate, comparisonDBDate);
                this.onGenerateReportParameter();
                this.toBeDownloaded = false;
                this.ssrsReportViewer.generateReport(this.reportServerUrl, this.reportPath, this.parameters);
            }
        } else {
            this.snackbarService.throwErrorSnackBar(
                'Form is invalid. Please resolve the errors.',
            );

        }
    }

    CheckDataBaseForSelectedCompany(freezeDate: Date, comparisonDBDate: Date) {
        const snapshotId = (this.pnlSnapshotCtrl.value) ? (this.pnlSnapshotCtrl.value as FreezeDisplayView).dataVersionId : -1;
        const dataVersionIdList = [];
        const compdataVersionIdList = [];
        if (comparisonDBDate && comparisonDBDate['dataVersionTypeId']) {
            compdataVersionIdList.push(comparisonDBDate['dataVersionId']);
        }
        if (snapshotId !== -1) {
            if (freezeDate) {
                dataVersionIdList.push(freezeDate['dataVersionId']);
            }
            this.freezeService.getFreezeForSelectedCompany(this.companiesSelectedList,
                freezeDate['dataVersionTypeId'], freezeDate).
                subscribe((freezeDatas: any) => {
                    if (freezeDatas && freezeDatas.length > 0) {
                        freezeDatas.forEach((freezeData) => { dataVersionIdList.push(freezeData['dataVersionId']); });
                        this.freezeService.getFreezeForSelectedCompany(this.companiesSelectedList,
                            comparisonDBDate['dataVersionTypeId'], comparisonDBDate).
                            subscribe((compFreezeDatas: any) => {
                                if (compFreezeDatas && compFreezeDatas.length > 0) {
                                    compFreezeDatas.forEach((compFreezeData) => {
                                        compdataVersionIdList.push(compFreezeData['dataVersionId']);
                                    });
                                } else { this.getPnlMovementSummaryMessage(dataVersionIdList, compdataVersionIdList); }
                            });
                    } else { this.getPnlMovementSummaryMessage(dataVersionIdList, compdataVersionIdList); }
                });
        } else {
            if (comparisonDBDate && comparisonDBDate['dataVersionTypeId']) {
                this.freezeService.getFreezeForSelectedCompany(this.companiesSelectedList,
                    comparisonDBDate['dataVersionTypeId'], comparisonDBDate).
                    subscribe((compFreezeDatas: any) => {
                        if (compFreezeDatas && compFreezeDatas.length > 0) {
                            compFreezeDatas.forEach((compFreezeData) => {
                                compdataVersionIdList.push(compFreezeData['dataVersionId']);
                            });
                            this.getPnlMovementSummaryMessage(dataVersionIdList, compdataVersionIdList);
                        }
                    });
            }
        }
    }

    getPnlMovementSummaryMessage(dataVersionIdList: number[], compdataVersionIdList: number[]) {
        this.reportingService.getPnlMovementSummaryMessage(this.companiesSelectedList,
            dataVersionIdList, compdataVersionIdList).
            subscribe((message: string) => {
                if (message !== null) {
                    const openValidationDialog = this.dialog.open(ConfirmationDialogComponent, {
                        data: {
                            title: 'Warning',
                            text: message,
                            okButton: 'OK',
                            cancelButton: 'Cancel',
                        },
                    });
                    openValidationDialog.afterClosed().subscribe((answer) => {
                        if (answer) {
                            this.onGenerateReportParameter();
                            this.toBeDownloaded = false;
                            this.ssrsReportViewer.generateReport(this.reportServerUrl, this.reportPath, this.parameters);
                        }
                    });
                } else {
                    this.onGenerateReportParameter();
                    this.toBeDownloaded = false;
                    this.ssrsReportViewer.generateReport(this.reportServerUrl, this.reportPath, this.parameters);
                }
            });
    }

    onGenerateExcelButtonClicked() {
        if (this.validate()) {
            this.onGenerateReportParameter();
            this.toBeDownloaded = true;
            this.ssrsReportViewer.generateReport(this.reportServerUrl, this.reportPathForDownload, this.parameters);
        } else {
            this.snackbarService.throwErrorSnackBar(
                'Form is invalid. Please resolve the errors.',
            );

        }
    }

    onGenerateReportParameter() {
        let comparisonSnapshotId: number;
        {
            const snapshotId = (this.pnlSnapshotCtrl.value as FreezeDisplayView).dataVersionId;

            if (this.pnlComparisonSnapshotCtrl.value) {
                comparisonSnapshotId = (this.pnlComparisonSnapshotCtrl.value as FreezeDisplayView).dataVersionId;
            }
            const isIncludeDifferences = this.isDifference ? 1 : 0;
            const viewCharter = this.isViewRealizedPhysicals ? 'C' : 'N';
            const companiesList = (this.pnlcompanyCtrl.value as Company[]).map((status) => status.companyId);

            this.parameters = [
                { name: 'IncludeDifferenceOnly', value: isIncludeDifferences },
                { name: 'View', value: viewCharter },
            ];

            this.parameters = this.parameters.concat(this.getReportCriterias());

            if (snapshotId !== -1) {
                this.parameters.push({ name: 'Database', value: snapshotId });
            }

            if (comparisonSnapshotId && comparisonSnapshotId > 0) {
                this.parameters.push({ name: 'CompDatabase', value: comparisonSnapshotId });
            }

            if (this.columnstoSelectCtrl.value) {
                const columnsListIds = (this.columnstoSelectCtrl.value as ColumnsList[]).map((columns) => columns.value);
                columnsListIds.forEach((id: number) => {
                    this.parameters.push({ name: 'ColumnsTobeSelected', value: id });
                });
            }

            if (companiesList.length === 0) {
                this.parameters.push({ name: 'Company', value: this.company });
            } else {
                companiesList.push(this.company);
                companiesList.forEach((name: string) => {
                    this.parameters.push({ name: 'Company', value: name });
                });
            }
            this.parameters.push({ name: 'UserLoginCompany', value: this.company });
        }
    }

    isContractLimitReached(): boolean {
        if (this.reportCriterias.filteredContracts.length > this.contractLimit &&
            !this.reportCriterias.contractDropdownComponent.allSelected) {
            const confirmDialog = this.dialog.open(ConfirmationDialogComponent, {
                data: {
                    title: 'Limit has been reached',
                    text: `You cannot select more than ${this.contractLimit} contracts.`,
                    okButton: 'Got it',
                },
            });

            return false;
        }

        return true;
    }

    validate(): boolean {
        let isValid = true;
        if (!this.pnlSnapshotCtrl.value) {
            isValid = false;
        }
        if (this.companiesSelectedList.length !== 0) {
            const comparisonDBDate = this.pnlComparisonSnapshotCtrl.value;
            isValid = (comparisonDBDate && comparisonDBDate['dataVersionTypeId']) ? true : false;
        } else {
            isValid = true;
        }
        return isValid;

    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

}
