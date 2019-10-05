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
    selector: 'atlas-trade-cost-movement-report',
    templateUrl: './trade-cost-movement-report.component.html',
    styleUrls: ['./trade-cost-movement-report.component.scss'],
})
export class TradeCostMovementReportComponent implements OnInit, OnDestroy {
    snapshotsCtrl = new FormControl();
    contractStatusCtrl = new FormControl();
    comparisondbCtrl = new FormControl();
    tradeCostcompanyCtrl = new AtlasFormControl('companySelect');
    companySelect: string[] = ['companyId'];

    includeGoods = false;
    excludeNoMovement = false;
    constractStatusList: TradeStatus[] = [];
    contractStatusDisplayProperty: string[] = ['name'];
    snapshotList: FreezeDisplayView[] = [];
    comparisondbList: FreezeDisplayView[] = [];
    currentSnapshot = new FreezeDisplayView(-1, 'CURRENT', null, FreezeType.Current);
    company: string;
    gridCode = 'tradeCostReportGrid';
    columnConfiguration: ColumnConfigurationProperties[] = [];
    filters: ListAndSearchFilter[] = [];
    companyList: Company[] = [];
    filteredCompany: Company[] = [];
    companiesSelectedList: any[] = [];
    missingCompanyList: string[];
    masterData: MasterData;
    showError = false;

    contractStatusErrorMap: Map<string, string> = new Map<string, string>();
    snapshotErrorMap: Map<string, string> = new Map<string, string>();
    comparisondbErrorMap: Map<string, string> = new Map<string, string>();

    destroy$ = new Subject();
    formGroup: FormGroup;

    reportServerUrl = environment.reportServerLink;
    reportPath = 'LDC Atlas/TradeCost/TradeCostMovement';
    parameters: any[] = [];

    @ViewChild('ssrsReportViewer') ssrsReportViewer: SSRSReportViewerComponent;
    constructor(private freezeService: FreezeService,
        private formBuilder: FormBuilder,
        private snackbarService: SnackbarService,
        private gridConfigurationProvider: GridConfigurationProviderService,
        private companyManager: CompanyManagerService,
        private route: ActivatedRoute,
        private reportingService: ReportingService,
        private titleService: TitleService) {
        this.constractStatusList = TradeStatus.getStatusList();
        this.company = this.route.snapshot.paramMap.get('company');
    }

    ngOnInit() {
        this.masterData = this.route.snapshot.data.masterdata;
        this.companyList = this.getCompaniesList();
        this.filteredCompany = this.companyList.filter((event) => event.companyId !== this.company);
        this.tradeCostcompanyCtrl.patchValue(this.filteredCompany);

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
        if (companiesSelected && companiesSelected.length > 0) {
            this.companiesSelectedList = companiesSelected.map((comp: { companyId: any; }) => comp.companyId);
        } else {
        }
    }

    initializeForm() {
        this.formGroup = this.formBuilder.group({
            snapshotsCtrl: this.snapshotsCtrl,
            contractStatusCtrl: this.contractStatusCtrl,
            comparisondbCtrl: this.comparisondbCtrl,
            tradeCostcompanyCtrl: this.tradeCostcompanyCtrl,
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
        this.comparisondbCtrl.setValidators(Validators.compose([
            inDropdownListValidator(
                this.comparisondbList,
                nameof<FreezeDisplayView>('dataVersionId'),
            ),
            Validators.required,
        ]));
        this.snapshotErrorMap.set('required', 'Please enter a value');
        this.snapshotErrorMap.set('inDropdownList', 'Please enter a value  that\'s in the list');

        this.comparisondbCtrl.setValidators(Validators.required);
        this.comparisondbErrorMap.set('required', 'Please enter a value');
        this.comparisondbErrorMap.set('inDropdownList', 'Please enter a value  that\'s in the list');

        this.contractStatusCtrl.setValidators(Validators.required);
        this.contractStatusErrorMap.set('required', 'Please select at least one value');
    }

    setDefaultValues() {
        this.snapshotsCtrl.patchValue(this.currentSnapshot);
        this.contractStatusCtrl.patchValue(this.constractStatusList.filter((status) => status.name === 'Open'));
        this.comparisondbCtrl.patchValue(this.comparisondbList[0]);
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
            this.comparisondbList = this.snapshotList
                .filter((p) => (p.freezeDate !== 'CURRENT'));
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

        if (this.companiesSelectedList.length > 0) {
            const snapshotId = (this.snapshotsCtrl.value) ? (this.snapshotsCtrl.value as FreezeDisplayView).dataVersionId : -1;
            const comparisonDatabaseId = (this.comparisondbCtrl.value) ?
                (this.comparisondbCtrl.value as FreezeDisplayView).dataVersionId : -1;
            if (snapshotId !== -1 || comparisonDatabaseId !== -1) {
                const freezeDate = this.snapshotsCtrl.value;
                const comparisonDBDate = this.comparisondbCtrl.value;
                this.freezeService.checkFreezeForSelectedDatabase(this.companiesSelectedList, freezeDate['dataVersionTypeId'],
                    freezeDate, comparisonDBDate['dataVersionTypeId'], comparisonDBDate).subscribe((data: any) => {
                        if (data) {
                            this.missingCompanyList = [];

                            this.showError = (data.missingCompany || data.comparisonMissingCompany) ? true : false;
                            if (data.comparisonMissingCompany) {
                                this.missingCompanyList.push(data.comparisonMissingCompany);
                            }

                            if (!this.showError && this.missingCompanyList.length === 0) {
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
                                    + this.missingCompanyList + ' report cannot be generated');
                            }
                        }
                    });
            }
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
        const comparisondbtId = (this.comparisondbCtrl.value as FreezeDisplayView).dataVersionId;
        const goodsIncluded = this.includeGoods ? 1 : 0;
        const excludeNoMovement = this.excludeNoMovement ? 1 : 0;
        const contractStatusIds = (this.contractStatusCtrl.value as TradeStatus[]).map((status) => status.value);
        const companiesList = (this.tradeCostcompanyCtrl.value as Company[]).map((status) => status.companyId);

        this.parameters = [
            { name: 'IncludeGoods', value: goodsIncluded },
            { name: 'ExcludeNoMovement', value: excludeNoMovement },
        ];
        this.parameters = this.parameters.concat(additionalParameters);
        contractStatusIds.forEach((id: number) => {
            this.parameters.push({ name: 'TradeStatus', value: id });
        });
        if (snapshotId !== -1) {
            this.parameters.push({ name: 'Database', value: snapshotId });
        }
        this.parameters.push({ name: 'ComparisonDB', value: comparisondbtId });

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

    onNoCostMovementChanged(event: MatCheckboxChange) {
        this.excludeNoMovement = event.checked;
    }

    selectionChanged(value) {
        if (value.dataVersionId === -1) {
            this.comparisondbList = this.snapshotList
                .filter((p) => (p.freezeDate !== 'CURRENT'));
            this.comparisondbCtrl.patchValue(this.comparisondbList[0]);
        } else {
            if (this.snapshotList.filter((p) => (p.actualfreezeDate < value.actualfreezeDate)).length > 0) {
                this.comparisondbList = this.snapshotList
                    .filter((p) => (p.actualfreezeDate < value.actualfreezeDate));
                this.comparisondbCtrl.patchValue(this.comparisondbList[0]);
            } else {
                this.snackbarService.throwErrorSnackBar('No Database available for comparison database. Please select any other database.');
                this.comparisondbList = this.snapshotList
                    .filter((p) => (p.actualfreezeDate < value.actualfreezeDate));
                this.comparisondbCtrl.patchValue(this.comparisondbList[0]);
                this.comparisondbCtrl.setValidators(Validators.required);
            }
        }
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
