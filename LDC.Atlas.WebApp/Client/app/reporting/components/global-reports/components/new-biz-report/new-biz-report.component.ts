import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { environment } from '../../../../../../environments/environment';
import { CompanyManagerService } from '../../../../../core/services/company-manager.service';
import { BaseFormComponent } from '../../../../../shared/components/base-form-component/base-form-component.component';
import { SSRSReportViewerComponent } from '../../../../../shared/components/ssrs-report-viewer/ssrsreport-viewer.component';
import { inDropdownListValidator } from '../../../../../shared/directives/autocomplete-dropdown.directive';
import { AmendmentsType } from '../../../../../shared/entities/ammendments-type.entity';
import { AtlasFormControl } from '../../../../../shared/entities/atlas-form-control';
import { Department } from '../../../../../shared/entities/department.entity';
import { ColumnConfigurationProperties } from '../../../../../shared/entities/grid-column-configuration.entity';
import { ListAndSearchFilter } from '../../../../../shared/entities/list-and-search/list-and-search-filter.entity';
import { MasterDataProps } from '../../../../../shared/entities/masterdata-props.entity';
import { MasterData } from '../../../../../shared/entities/masterdata.entity';
import { NewBizDateTypes } from '../../../../../shared/entities/newBizDateTypes.entity';
import { NewBizNewContractsTypes } from '../../../../../shared/entities/newBizNewContractTypes.entity';
import { NewBizStyleTypes } from '../../../../../shared/entities/newBizStyleTypes.entity';
import { WeightUnit } from '../../../../../shared/entities/weight-unit.entity';
import { WINDOW } from '../../../../../shared/entities/window-injection-token';
import { NewBizSummaryDetails } from '../../../../../shared/enums/newbiz-summary-details.enum';
import { newBizDateType } from '../../../../../shared/enums/newBizDateType.enum';
import { newBizNewContractType } from '../../../../../shared/enums/newBizNewContractType-enum';
import { newBizStyleType } from '../../../../../shared/enums/newBizStyleType.enum';
import { FormConfigurationProviderService } from '../../../../../shared/services/form-configuration-provider.service';
import { GridConfigurationProviderService } from '../../../../../shared/services/grid-configuration-provider.service';
import { ReportingService } from '../../../../../shared/services/http-services/reporting.service';
import { PredicateReference } from '../../../../../shared/services/reporting/dtos/predicate-reference';
import { SnackbarService } from '../../../../../shared/services/snackbar.service';
import { nameof, UtilService } from '../../../../../shared/services/util.service';
import { dateAfter } from '../../../../../trading/components/contract-physical-capture/form-components/shipment-period-form/shipment-period-date-validator.validator';

@Component({
    selector: 'atlas-new-biz-report',
    templateUrl: './new-biz-report.component.html',
    styleUrls: ['./new-biz-report.component.scss'],
})
export class NewBizReportComponent extends BaseFormComponent implements OnInit, OnDestroy {

    destroy$ = new Subject();
    company: string;
    reportServerUrl = environment.reportServerLink;
    reportPath = 'LDC Atlas/Newbiz/NewBiz';
    parameters: any[] = [];
    newBizDateTypes: NewBizDateTypes[] = [];
    newBizStyleTypes: NewBizStyleTypes[] = [];
    newBiznewContractTypes: NewBizNewContractsTypes[] = [];
    amendmentsTypeList: AmendmentsType[] = [];
    amendmentsDisplayProperty: string[] = ['name'];
    contractDateCtrl = new AtlasFormControl('contractDateCtrl');
    newBizDateFromCtrl = new AtlasFormControl('newBizDateFromCtrl');
    newBizDateToCtrl = new AtlasFormControl('newBizDateToCtrl');
    newBizReportDepartmentCtrl = new AtlasFormControl('newBizReportDepartmentCtrl');
    styleCtrl = new AtlasFormControl('styleCtrl');
    newContractsCtrl = new AtlasFormControl('newContractsCtrl');
    amendmentsCtrl = new AtlasFormControl('amendmentsCtrl');
    amendmentSummaryCtrl = new AtlasFormControl('summary');
    amendmentDetailsCtrl = new AtlasFormControl('details');
    newBizReportFormGroup: FormGroup;
    now: moment.Moment;
    filteredDepartmentList: Department[];
    departmentErrorMap: Map<string, string> = new Map()
        .set('inDropdownList', 'Invalid entry. Department not in the list.');
    selectErrorMap: Map<string, string> = new Map();
    filteredQuantityCode: WeightUnit[] = [];
    amendmentsArray: AmendmentsType[] = [];
    masterData: MasterData;
    masterdataList: string[] = [MasterDataProps.WeightUnits];
    amendmentSummary: boolean = true;
    amendmentDetails: boolean = true;
    filters: ListAndSearchFilter[] = [];
    gridCode = 'newBizReportGrid';
    columnConfiguration: ColumnConfigurationProperties[] = [];
    @ViewChild('ssrsReportViewer') ssrsReportViewer: SSRSReportViewerComponent;

    constructor(
        private formBuilder: FormBuilder,
        private snackbarService: SnackbarService,
        private gridConfigurationProvider: GridConfigurationProviderService,
        private route: ActivatedRoute,
        private utilService: UtilService,
        private reportingService: ReportingService,
        protected formConfigurationProvider: FormConfigurationProviderService,
        private companyManager: CompanyManagerService,
        @Inject(WINDOW) private window: Window) {
        super(formConfigurationProvider);
        this.company = this.route.snapshot.paramMap.get('company');
        this.now = this.companyManager.getCurrentCompanyDate();
        this.amendmentsTypeList = AmendmentsType.getAmendmentsTypeList();
    }

    ngOnInit() {
        this.masterData = this.route.snapshot.data.masterdata;
        this.filteredDepartmentList = this.masterData.departments;
        this.filteredQuantityCode = this.masterData.weightUnits;

        for (const type in newBizDateType) {
            if (typeof newBizDateType[type] === 'number') {
                this.newBizDateTypes.push({ value: newBizDateType[type] as any, newBizDateTypesDescription: type });
            }
        }
        for (const type in newBizStyleType) {
            if (typeof newBizStyleType[type] === 'number') {
                this.newBizStyleTypes.push({ value: newBizStyleType[type] as any, newBizStyleTypesDescription: type });
            }
        }
        for (const type in newBizNewContractType) {
            if (typeof newBizNewContractType[type] === 'number') {
                this.newBiznewContractTypes.push({ value: newBizNewContractType[type] as any, newBizNewContractsTypesDescription: type });
            }
        }

        this.initializeForm();
        this.newBizReportDepartmentCtrl.valueChanges.subscribe((input) => {
            this.filteredDepartmentList = this.utilService.filterListforAutocomplete(
                input,
                this.masterData.departments,
                ['departmentCode', 'description'],
            );
        });
        this.amendmentDetailsCtrl.setValue(true);
        this.amendmentSummaryCtrl.setValue(true);
        this.loadGridConfiguration();
    }

    setDefaultValues() {
        this.contractDateCtrl.patchValue(newBizDateType.ContractDate);
        this.styleCtrl.patchValue(newBizStyleType.TradeNet);
        this.newContractsCtrl.patchValue(newBizNewContractType.PhysicalsFlatPriceContracts);
        const val = this.amendmentsTypeList.filter((status) => status.name === 'Physicals Amendments');
        this.amendmentsCtrl.patchValue(val);
    }

    initializeForm() {
        this.newBizReportFormGroup = this.formBuilder.group({
            contractDateCtrl: this.contractDateCtrl,
            newBizDateFromCtrl: this.newBizDateFromCtrl,
            newBizDateToCtrl: this.newBizDateToCtrl,
            newBizReportDepartmentCtrl: this.newBizReportDepartmentCtrl,
            styleCtrl: this.styleCtrl,
            newContractsCtrl: this.newContractsCtrl,
            amendmentsCtrl: this.amendmentsCtrl,
            amendmentSummaryCtrl: this.amendmentSummaryCtrl,
            amendmentDetailsCtrl: this.amendmentDetailsCtrl,
        },
            { validator: dateAfter('newBizDateToCtrl', 'newBizDateFromCtrl') });

        this.setDefaultValues();
        this.setValidators();
        return this.newBizReportFormGroup;
    }

    setValidators() {
        this.contractDateCtrl.setValidators(
            Validators.compose([Validators.required]),
        );
        this.newBizDateFromCtrl.setValidators(
            Validators.compose([Validators.required]),
        );
        this.newBizDateToCtrl.setValidators(
            Validators.compose([Validators.required]),
        );

        this.styleCtrl.setValidators(
            Validators.compose([Validators.required]),
        );

        this.newBizReportFormGroup.updateValueAndValidity();

        this.newBizReportDepartmentCtrl.setValidators(
            Validators.compose([
                inDropdownListValidator(
                    this.masterData.departments,
                    nameof<Department>('departmentCode'),
                    true,
                ),
            ]),
        );
    }

    onFXDealSelected(amendmentValue: any) {
        if (amendmentValue.value === newBizNewContractType.FXDeals) {
            const fxAmendmentsTypeList: AmendmentsType[] = new Array<AmendmentsType>();
            this.amendmentsTypeList = fxAmendmentsTypeList;
            this.amendmentsTypeList = AmendmentsType.getFXDealAmendmentsTypeList();
            const val = this.amendmentsTypeList.filter((status) => status.name === 'FX Deal Amendments');
            this.amendmentsCtrl.patchValue(val);
        } else {
            this.amendmentsTypeList = AmendmentsType.getAmendmentsTypeList();
            const val = this.amendmentsTypeList.filter((status) => status.name === 'Physicals Amendments');
            this.amendmentsCtrl.patchValue(val);
        }
        this.amendmentDetailsCtrl.enable();
        this.amendmentSummaryCtrl.enable();
    }

    selectionChanged(amendmentVal: string[]) {
        if (amendmentVal) {
            if (amendmentVal.length === 0) {
                this.amendmentDetailsCtrl.setValue(false);
                this.amendmentSummaryCtrl.setValue(false);
                this.amendmentDetailsCtrl.disable();
                this.amendmentSummaryCtrl.disable();
            } else {
                this.amendmentDetailsCtrl.enable();
                this.amendmentSummaryCtrl.enable();
            }
        }
    }

    onFilterSetChanged(filters: ListAndSearchFilter[]) {
        this.filters = filters;
        if (filters) {
            if (this.filters.length > 0) {
                this.onGenerateReportButtonClicked();
            }
        }
    }

    loadGridConfiguration() {
        this.gridConfigurationProvider.getConfiguration(this.company, this.gridCode)
            .subscribe((configuration) => {
                this.columnConfiguration = configuration.columns;
            });
    }

    onAmendmentSummaryChanged(event: MatCheckboxChange) {
        this.amendmentSummary = event.checked;
    }

    onAmendmentDetailsChanged(event: MatCheckboxChange) {
        this.amendmentDetails = event.checked;
    }

    getBasicParameters() {
        const dateFrom = (this.newBizDateFromCtrl.value as moment.Moment).format('YYYY-MM-DD');
        const dateTo = (this.newBizDateToCtrl.value as moment.Moment).format('YYYY-MM-DD');
        const department = this.newBizReportDepartmentCtrl.value ?
            (this.newBizReportDepartmentCtrl.value as Department).departmentId : '';
        const amendments = (this.amendmentsCtrl.value as AmendmentsType[]).map((status) => status.value);
        let options: number;
        if (this.amendmentSummary && this.amendmentDetails) {
            options = NewBizSummaryDetails.SummaryAndDetail;
        } else if (this.amendmentDetails) {
            options = NewBizSummaryDetails.Detail;
        } else if (this.amendmentSummary) {
            options = NewBizSummaryDetails.Summary;
        }

        const parameters: any[] = [
            { name: 'Company', value: this.company },
            { name: 'FromDate', value: dateFrom },
            { name: 'ToDate', value: dateTo },
        ];

        if (this.amendmentsCtrl.value && this.amendmentsCtrl.value.length !== 0) {
            this.parameters.push({ name: 'Options', value: options });
        }
        if (this.contractDateCtrl.value !== '') {
            this.parameters.push({ name: 'DateType', value: this.contractDateCtrl.value });
        }
        if (department !== '') {
            this.parameters.push({ name: 'Department', value: department });
        }

        if (this.styleCtrl.value !== '') { this.parameters.push({ name: 'Style', value: this.styleCtrl.value }); }

        if (this.newContractsCtrl.value !== '') { this.parameters.push({ name: 'NewContracts', value: this.newContractsCtrl.value }); }

        amendments.forEach((id: number) => {
            this.parameters.push({ name: 'Amendments', value: id });
        });
        return parameters;
    }

    onGenerateReportButtonClicked() {
        if (!this.newBizReportFormGroup.valid) {
            this.snackbarService.throwErrorSnackBar('Form is invalid. Please check the errors.');
            return;
        }

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

    generateReport(additionalParameters: any[] = []) {
        if (this.amendmentsCtrl.value) {
            if (this.amendmentsCtrl.value.length !== 0 && this.amendmentSummary === false && this.amendmentDetails === false) {
                this.snackbarService.throwErrorSnackBar(
                    'Select atleast one AmendmentReport from list',
                );
            } else {
                this.parameters = [];
                this.parameters = this.parameters.concat(additionalParameters);
                this.parameters = this.parameters.concat(
                    this.getBasicParameters());

                this.ssrsReportViewer.generateReport(this.reportServerUrl, this.reportPath, this.parameters);
            }
        }
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
