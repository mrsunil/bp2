import { DatePipe } from '@angular/common';
import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { environment } from '../../../../../../environments/environment';
import { BaseFormComponent } from '../../../../../shared/components/base-form-component/base-form-component.component';
import { SSRSReportViewerComponent } from '../../../../../shared/components/ssrs-report-viewer/ssrsreport-viewer.component';
import { Currency } from '../../../../../shared/entities/currency.entity';
import { ForeignExchangeRateViewMode } from '../../../../../shared/enums/foreign-exchange-rate-viewmode.enum';
import { FreezeType } from '../../../../../shared/enums/freeze-type.enum';
import { ReportSortType } from '../../../../../shared/enums/report-sort-type.enum';
import { FormConfigurationProviderService } from '../../../../../shared/services/form-configuration-provider.service';
import { SnackbarService } from '../../../../../shared/services/snackbar.service';
import { ReportCriteriasComponent } from '../report-criterias/report-criterias.component';
import { CriteraComponent } from './components/critera/critera.component';
import { PeriodComponent } from './components/period/period.component';
import { SortByComponent } from './components/sort-by/sort-by.component';

@Component({
    selector: 'atlas-historical-exchange-rates-report',
    templateUrl: './historical-exchange-rates-report.component.html',
    styleUrls: ['./historical-exchange-rates-report.component.scss'],
    providers: [DatePipe],
})
export class HistoricalExchangeRatesReportComponent extends BaseFormComponent implements OnInit {
    private formComponents: BaseFormComponent[] = [];
    @ViewChild('criteraComponent') historicalRatesCriteriaComponent: CriteraComponent;
    @ViewChild('periodComponent') historicalRatesPeriodComponent: PeriodComponent;
    @ViewChild('sortByComponent') historicalRatesSortByComponent: SortByComponent;
    @ViewChild('ssrsReportViewer') ssrsReportViewer: SSRSReportViewerComponent;
    @ViewChild('reportCriterias') reportCriterias: ReportCriteriasComponent;
    @Output() readonly rateSelected = new EventEmitter<string>();
    isGenerateButtonClicked: boolean = false;
    formGroup: FormGroup;
    selectedRate: string;
    selectedCurrency: Currency[];
    FreezeType: FreezeType;
    selectedPeriod: string;
    selectedFrom: string;
    selectedTo: string;
    selectedAllDates: boolean = false;
    selectedSortBy: string = ReportSortType[ReportSortType.Currency];
    ReportSortType = ReportSortType;
    reportServerUrl = environment.reportServerLink;
    reportPath = 'LDC Atlas/HistoricalFX Rate/HistoricalFXRate';
    parameters: any[] = [];
    monthly: string = FreezeType[FreezeType.Monthly];
    daily: string = FreezeType[FreezeType.Daily];
    spot: ForeignExchangeRateViewMode = ForeignExchangeRateViewMode[ForeignExchangeRateViewMode.Spot];
    constructor(
        protected datepipe: DatePipe,
        protected formBuilder: FormBuilder,
        protected formConfigurationProvider: FormConfigurationProviderService,
        protected snackbarService: SnackbarService,
    ) {
        super(formConfigurationProvider);
    }

    ngOnInit() {
        this.formGroup = this.formBuilder.group({
            criteraComponent: this.historicalRatesCriteriaComponent.getFormGroup(),
            periodComponent: this.historicalRatesPeriodComponent.getFormGroup(),
            sortByComponent: this.historicalRatesSortByComponent.getFormGroup(),
        });
        this.formComponents.push(
            this.historicalRatesCriteriaComponent,
            this.historicalRatesPeriodComponent,
            this.historicalRatesSortByComponent,
        );

    }

    onRateSelected(rateSelected: string) {
        this.selectedRate = rateSelected;
        this.historicalRatesPeriodComponent.getRateSelected(rateSelected);
        this.setFromFormat();
    }

    onCurrencySelected(currencySelected: Currency[]) {
        this.selectedCurrency = currencySelected;
    }

    onFromSelected(fromSelected: Date) {
        this.setFromFormat(fromSelected);
    }

    onToSelected(toSelected: Date) {
        this.setToFormat(toSelected);
    }

    onShowAllDatesSelected(allDatesSelected: boolean) {
        this.selectedAllDates = allDatesSelected;
    }

    onSortBySelected(sortBySelected: string) {
        this.selectedSortBy = ReportSortType[sortBySelected];
    }

    onPeriodSelected(periodSelected: string) {
        this.selectedPeriod = FreezeType[periodSelected];
    }

    onGenerateReportButtonClicked(isGenerateButtonClicked?: boolean) {
        if (this.formGroup.valid &&
            this.historicalRatesCriteriaComponent.currencyValue.length !== 0) {
            this.generateReport();
        } else {
            this.snackbarService.throwErrorSnackBar('Form is invalid. Please check the errors.');
        }
    }

    setFromFormat(from?: Date) {
        if (from) {
            this.selectedFrom = (this.selectedRate === this.monthly) ?
                this.datepipe.transform(from, 'MMM yyyy') : this.datepipe.transform(from, 'yyyy-MM-dd');
        } else {
            this.selectedFrom = null;
        }
    }
    setToFormat(to: Date) {
        if (to) {
            this.selectedTo = (this.selectedRate === this.monthly) ?
                this.datepipe.transform(to, 'MMM yyyy') : this.datepipe.transform(to, 'yyyy-MM-dd');
        } else {
            this.selectedTo = null;
        }
    }

    generateReport() {
        this.parameters = [
            { name: 'ShowAllDates', value: this.selectedAllDates },
            { name: 'SortBy', value: this.selectedSortBy },
        ];
        this.getReportCriteria();
        this.ssrsReportViewer.generateReport(this.reportServerUrl, this.reportPath, this.parameters);
    }

    getReportCriteria() {
        if (!this.historicalRatesCriteriaComponent.currencyDropdownComponent.allSelected) {
            this.historicalRatesCriteriaComponent.currencyValue.forEach((currency: Currency) => {
                this.parameters.push({ name: 'Currency', value: currency.currencyCode });
            });
        }
        if (this.selectedFrom) {
            this.parameters.push({ name: 'From', value: this.selectedFrom });
        }
        if (this.selectedTo) {
            this.parameters.push({ name: 'To', value: this.selectedTo });
        }
        if ((this.selectedRate) && (!(this.selectedRate === this.spot))) {
            this.parameters.push({ name: 'Period', value: this.selectedRate });
        }
    }
}
