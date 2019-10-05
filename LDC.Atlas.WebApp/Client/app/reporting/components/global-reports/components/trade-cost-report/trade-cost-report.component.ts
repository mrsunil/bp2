import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { environment } from '../../../../../../environments/environment';
import { CompanyManagerService } from '../../../../../core/services/company-manager.service';
import { SSRSReportViewerComponent } from '../../../../../shared/components/ssrs-report-viewer/ssrsreport-viewer.component';
import { inDropdownListValidator } from '../../../../../shared/directives/autocomplete-dropdown.directive';
import { AtlasFormControl } from '../../../../../shared/entities/atlas-form-control';
import { Company } from '../../../../../shared/entities/company.entity';
import { Freeze } from '../../../../../shared/entities/freeze.entity';
import { ColumnConfigurationProperties } from '../../../../../shared/entities/grid-column-configuration.entity';
import { ListAndSearchFilter } from '../../../../../shared/entities/list-and-search/list-and-search-filter.entity';
import { MasterDataProps } from '../../../../../shared/entities/masterdata-props.entity';
import { MasterData } from '../../../../../shared/entities/masterdata.entity';
import { TradeStatus } from '../../../../../shared/entities/trade-status.entity';
import { FreezeType } from '../../../../../shared/enums/freeze-type.enum';
import { FreezeDisplayView } from '../../../../../shared/models/freeze-display-view';
import { ApiPaginatedCollection } from '../../../../../shared/services/common/models';
import { GridConfigurationProviderService } from '../../../../../shared/services/grid-configuration-provider.service';
import { FreezeService } from '../../../../../shared/services/http-services/freeze.service';
import { ReportingService } from '../../../../../shared/services/http-services/reporting.service';
import { PredicateReference } from '../../../../../shared/services/reporting/dtos/predicate-reference';
import { SnackbarService } from '../../../../../shared/services/snackbar.service';
import { TitleService } from '../../../../../shared/services/title.service';
import { nameof } from '../../../../../shared/services/util.service';

@Component({
    selector: 'atlas-trade-cost-report',
    templateUrl: './trade-cost-report.component.html',
    styleUrls: ['./trade-cost-report.component.scss'],
})
export class TradeCostReportComponent implements OnInit, OnDestroy {
    snapshotsCtrl = new FormControl();
    contractStatusCtrl = new FormControl();
    tradeCostCompanyCtrl = new AtlasFormControl('companySelect');
    companySelect: string[] = ['companyId'];

    masterData: MasterData;
    masterdataList: string[] = [
        MasterDataProps.Companies,
    ];
    includeGoods = false;
    constractStatusList: TradeStatus[] = [];
    contractStatusDisplayProperty: string[] = ['name'];
    snapshotList: FreezeDisplayView[] = [];
    currentSnapshot = new FreezeDisplayView(-1, 'CURRENT');
    company: string;
    gridCode = 'tradeCostReportGrid';
    columnConfiguration: ColumnConfigurationProperties[] = [];
    filters: ListAndSearchFilter[] = [];
    companyList: Company[] = [];
    filteredCompany: Company[] = [];
    companiesSelectedList: any[] = [];
    showError = false;

    contractStatusErrorMap: Map<string, string> = new Map<string, string>();
    snapshotErrorMap: Map<string, string> = new Map<string, string>();

    destroy$ = new Subject();
    formGroup: FormGroup;

    reportServerUrl = environment.reportServerLink;
    reportPath = 'LDC Atlas/TradeCost/TradeCost';
    parameters: any[] = [];

    @ViewChild('ssrsReportViewer') ssrsReportViewer: SSRSReportViewerComponent;

    constructor(
        private freezeService: FreezeService,
        private formBuilder: FormBuilder,
        private snackbarService: SnackbarService,
        private companyManager: CompanyManagerService,
        private gridConfigurationProvider: GridConfigurationProviderService,
        private route: ActivatedRoute,
        private router: Router,
        private reportingService: ReportingService,
        private titleService: TitleService) {
        this.constractStatusList = TradeStatus.getStatusList();
        this.company = this.route.snapshot.paramMap.get('company');
    }

    ngOnInit() {
        this.masterData = this.route.snapshot.data.masterdata;
        this.companyList = this.getCompaniesList();
        this.filteredCompany = this.companyList.filter((company) => company.companyId !== this.company);
        this.tradeCostCompanyCtrl.patchValue(this.filteredCompany);

        this.loadSnapshots();
        this.loadGridConfiguration();
        this.titleService.setTitle(this.route.snapshot.data.title);
    }

    getCompaniesList(): any[] {
        const options: Company[] = this.companyManager.getLoadedCompanies();
        return options;
    }

    companyOptionSelected(companiesSelected: any) {
        this.companiesSelectedList = [];
        if (companiesSelected) {
            if (companiesSelected.length > 0) {
                for (const val of companiesSelected) {
                    this.companiesSelectedList.push(val['companyId']);
                }
            } else {
            }
        }
    }

    initializeForm() {
        this.formGroup = this.formBuilder.group({
            snapshotsCtrl: this.snapshotsCtrl,
            contractStatusCtrl: this.contractStatusCtrl,
            tradeCostCompanyCtrl: this.tradeCostCompanyCtrl,
        });

        this.setValidators();
        this.setDefaultValues();

        return this.formGroup;
    }

    setValidators() {
        this.snapshotsCtrl.setValidators(Validators.compose([
            inDropdownListValidator(
                this.snapshotList,
                nameof<FreezeDisplayView>('dataVersionId'),
            ),
            Validators.required,
        ]));
        this.snapshotErrorMap.set('required', 'Please enter a value');
        this.snapshotErrorMap.set('inDropdownList', 'Please enter a value  that\'s in the list');

        this.contractStatusCtrl.setValidators(Validators.required);
        this.contractStatusErrorMap.set('required', 'Please select at least one value');
    }

    setDefaultValues() {
        this.snapshotsCtrl.patchValue(this.currentSnapshot);
        this.contractStatusCtrl.patchValue(this.constractStatusList.filter((status) => status.name === 'Open'));
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
            this.snapshotList.unshift(this.currentSnapshot);
            this.initializeForm();
        });
    }

    loadGridConfiguration() {
        this.gridConfigurationProvider.getConfiguration(this.company, this.gridCode)
            .subscribe((configuration) => {
                this.columnConfiguration = configuration.columns;
            });
    }

    onFilterSetChanged(filters: ListAndSearchFilter[]) {
        this.filters = filters;
        if (this.filters.length > 0) {
            this.onGenerateReportButtonClicked();
        }
    }

    onGenerateReportButtonClicked() {
        if (!this.formGroup || !this.formGroup.valid) {
            this.snackbarService.throwErrorSnackBar('Form is invalid. Please check the errors.');
            return;
        }
        const snapshotId = (this.snapshotsCtrl.value as FreezeDisplayView).dataVersionId;
        if (this.companiesSelectedList.length > 0 && snapshotId !== -1) {
            const freezeDate = this.snapshotsCtrl.value;
            this.freezeService.checkFreezeForSelectedDatabase(this.companiesSelectedList, freezeDate['dataVersionTypeId'],
                freezeDate, null, null).subscribe((data: any) => {
                    if (data) {
                        let missingCompanyList: string;

                        this.showError = data.missingCompany ? true : false;
                        if (data.missingCompany) {
                            missingCompanyList = data.missingCompany;
                        }

                        if (!this.showError) {
                            if (this.filters && this.filters.length > 0) {
                                this.reportingService.createReportCriterias(this.gridCode, this.filters).pipe(
                                    takeUntil(
                                        this.destroy$,
                                    )).subscribe((filterSetId: PredicateReference) => {
                                        const predicateId = [{ name: 'PredicateId', value: filterSetId.predicateId }];
                                        this.generateReport(predicateId);
                                    });
                            } else {
                                this.generateReport();
                            }
                        } else {
                            this.snackbarService.throwErrorSnackBar('The freeze is not present in company '
                                + missingCompanyList + ' report cannot be generated');
                        }
                    }
                });
        } else {
            if (this.filters && this.filters.length > 0) {
                this.reportingService.createReportCriterias(this.gridCode, this.filters).pipe(
                    takeUntil(
                        this.destroy$,
                    )).subscribe((filterSetId: PredicateReference) => {
                        const predicateId = [{ name: 'PredicateId', value: filterSetId.predicateId }];
                        this.generateReport(predicateId);
                    });
            } else {
                this.generateReport();
            }
        }

    }

    generateReport(additionalParameters: any[] = []) {
        const snapshotId = (this.snapshotsCtrl.value as FreezeDisplayView).dataVersionId;
        const goodsIncluded = this.includeGoods ? 1 : 0;
        const contractStatusIds = (this.contractStatusCtrl.value as TradeStatus[]).map((status) => status.value);
        const companiesList = (this.tradeCostCompanyCtrl.value as Company[]).map((status) => status.companyId);

        this.parameters = [
            { name: 'IncludeGoods', value: goodsIncluded },
        ];
        this.parameters = this.parameters.concat(additionalParameters);

        contractStatusIds.forEach((id: number) => {
            this.parameters.push({ name: 'TradeStatus', value: id });
        });

        if (snapshotId !== -1) {
            this.parameters.push({ name: 'Database', value: snapshotId });
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
        this.ssrsReportViewer.generateReport(this.reportServerUrl, this.reportPath, this.parameters);
    }

    onIncludeGoodsChanged(event: MatCheckboxChange) {
        this.includeGoods = event.checked;
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
