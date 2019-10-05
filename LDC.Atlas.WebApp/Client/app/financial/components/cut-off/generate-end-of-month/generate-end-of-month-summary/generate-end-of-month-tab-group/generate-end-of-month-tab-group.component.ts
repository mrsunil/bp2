import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FilterGem } from '../../../../../../shared/entities/filter-gem.entity';
import { ReportType } from '../../../../../../shared/enums/report-type.enum';
import { OverviewGenerateEndOfMonthDisplayView } from '../../../../../../shared/models/overview-generate-end-of-month-display-view';
import { DetailsTabComponent } from '../tabs/details-tab/details-tab.component';
import { OverviewTabComponent } from '../tabs/overview-tab/overview-tab.component';
import { PostingsTabComponent } from '../tabs/postings-tab/postings-tab.component';
import { TradeCostMonthEndMappingErrors } from '../../../../../../shared/entities/tradecost-monthend-mappingerrors-entity';

@Component({
    selector: 'atlas-generate-end-of-month-tab-group',
    templateUrl: './generate-end-of-month-tab-group.component.html',
    styleUrls: ['./generate-end-of-month-tab-group.component.scss'],
})
export class GenerateEndOfMonthTabGroupComponent implements OnInit {
    @ViewChild('overviewTabComponent') overviewTabComponent: OverviewTabComponent;
    @ViewChild('detailsTabComponent') detailsTabComponent: DetailsTabComponent;
    @ViewChild('postingsTabComponent') postingsTabComponent: PostingsTabComponent;
    @ViewChild('unrealizedDetailsTabComponent') unrealizedDetailsTabComponent: DetailsTabComponent;
    @ViewChild('unrealizedPostingsTabComponent') unrealizedPostingsTabComponent: PostingsTabComponent;
    @Output() readonly filtered = new EventEmitter<FilterGem>();
    @Output() readonly stopPosting = new EventEmitter<boolean>();
    @Output() readonly applyButton = new EventEmitter();
    @Output() readonly tabIndexNumber = new EventEmitter();
    @Output() readonly mappingErrorChange = new EventEmitter<boolean>();
    isFilterApplied: boolean = false;
    tabIndex: number = 0;
    isCurrentDataBase = false;
    company: string;
    reportType: number;
    showErrorBanners: boolean = false;
    costTypeMappingErrorMessages: string[] = [];
    departmentMappingErrorMessages: string[] = [];
    nominalAccountMappingErrorMessages: string[] = [];
    clientAccountMappingErrorMessages: string[] = [];

    constructor(private route: ActivatedRoute) {
    }

    ngOnInit() {
        this.company = this.route.snapshot.paramMap.get('company');
        if (this.reportType === ReportType.Realized) {
            this.onSelectedButtonChanged(this.tabIndex);
        }
        else {
            this.onSelectedButtonChanged(this.tabIndex + 1);
        }
    }

    isOverviewEnable() {
        return ((this.reportType === ReportType.Realized) ? false : true);
    }

    filteredGrid(filter: FilterGem) {
        this.filtered.emit(filter);
    }

    disableGeneratePosting(generateMonthPosting: boolean) {
        this.stopPosting.emit(generateMonthPosting);
    }

    applyButtonClicked() {
        this.applyButton.emit();
    }

    onSelectedIndexChanged(value: number) {
        this.tabIndex = value;
        this.tabIndexNumber.emit(this.tabIndex);
        if (this.reportType === ReportType.Realized) {
            this.onSelectedButtonChanged(this.tabIndex);
        }
        else {
            this.onSelectedButtonChanged(this.tabIndex + 1);
        }
    }

    onSelectedButtonChanged(tabIndex: number) {
        switch (tabIndex) {
            case 0:
                this.overviewTabComponent.getTradeCostListOverview(null, this.isFilterApplied);
                break;
            case 1:
                if (this.reportType === ReportType.Realized) {
                    this.detailsTabComponent.getTradeCostListDetails(null, this.isFilterApplied);
                }
                else if (this.reportType === ReportType.UnRealized) {
                    this.unrealizedDetailsTabComponent.getTradeCostListDetails(null, this.isFilterApplied);
                }
                break;
            case 2:
                if (this.reportType === ReportType.Realized) {
                    this.postingsTabComponent.getTradeCostListPostings(null, this.isFilterApplied);
                }
                else if (this.reportType === ReportType.UnRealized) {
                    this.unrealizedPostingsTabComponent.getTradeCostListPostings(null, this.isFilterApplied);
                }
                break;
        }
    }

    getFilteredData(tabIndex: number, filteredGridRows?: OverviewGenerateEndOfMonthDisplayView[]) {
        switch (tabIndex) {
            case 0:
                this.overviewTabComponent.getTradeCostListOverview(filteredGridRows, this.isFilterApplied);
                break;
            case 1:
                if (this.reportType === ReportType.Realized) {
                    this.detailsTabComponent.getTradeCostListDetails(filteredGridRows, this.isFilterApplied);
                }
                else if (this.reportType === ReportType.UnRealized) {
                    this.unrealizedDetailsTabComponent.getTradeCostListDetails(filteredGridRows, this.isFilterApplied);
                }
                break;
            case 2:
                if (this.reportType === ReportType.Realized) {
                    this.postingsTabComponent.getTradeCostListPostings(filteredGridRows, this.isFilterApplied);
                }
                else if (this.reportType === ReportType.UnRealized) {
                    this.unrealizedPostingsTabComponent.getTradeCostListPostings(filteredGridRows, this.isFilterApplied);
                }
                break;
        }
    }

    generateMappingErrorForMonthEnd(tradeCostMonthEndMappingErrors: TradeCostMonthEndMappingErrors[]): void {
        var mappingErrors = tradeCostMonthEndMappingErrors.filter((t) => t.isMappingError);
        this.clientAccountMappingErrorMessages = [];
        this.departmentMappingErrorMessages = [];
        this.costTypeMappingErrorMessages = [];
        this.nominalAccountMappingErrorMessages = [];
        if (mappingErrors && mappingErrors.length > 0) {
            var errorMessage: string = '';
            mappingErrors.forEach(e => {
                if (e.c2CCodeIsInMappingError) {
                    this.clientAccountMappingErrorMessages.push(e.accountingDocumentLineClientAccount);
                }
                if (e.costAlternativeCodeIsInMappingError) {
                    this.costTypeMappingErrorMessages.push(e.accountingDocumentLineCostTypeCode);
                }
                if (e.departmentAlternativeCodeIsInMappingError) {
                    this.departmentMappingErrorMessages.push(e.accountingDocumentLineDepartmentCode);
                }
                if (e.nominalAlternativeAccountIsInMappingError) {
                    this.nominalAccountMappingErrorMessages.push(e.accountingDocumentLineAccountReference);
                }
            });

            if (this.clientAccountMappingErrorMessages.length > 0) {
                this.clientAccountMappingErrorMessages = this.clientAccountMappingErrorMessages.filter((x, i, a) => x && a.indexOf(x) === i);
            }
            if (this.costTypeMappingErrorMessages.length > 0) {
                this.costTypeMappingErrorMessages = this.costTypeMappingErrorMessages.filter((x, i, a) => x && a.indexOf(x) === i);
            }
            if (this.departmentMappingErrorMessages.length > 0) {
                this.departmentMappingErrorMessages = this.departmentMappingErrorMessages.filter((x, i, a) => x && a.indexOf(x) === i);
            }
            if (this.nominalAccountMappingErrorMessages.length > 0) {
                this.nominalAccountMappingErrorMessages = this.nominalAccountMappingErrorMessages.filter((x, i, a) => x && a.indexOf(x) === i);
            }

            if (this.clientAccountMappingErrorMessages.length > 0
                || this.costTypeMappingErrorMessages.length > 0
                || this.departmentMappingErrorMessages.length > 0
                || this.nominalAccountMappingErrorMessages.length > 0) {
                this.showErrorBanners = true;
            }
            else {
                this.showErrorBanners = false;
            }
        }
        else {
            this.showErrorBanners = false;
        }
        
        this.mappingErrorChange.emit(this.showErrorBanners);
    }

    onWarningRemoveButtonClicked(params) {
        if (params) {
            params.currentTarget.parentElement.parentElement.remove();
        }
    }

    updateCurrentDatabaseBitValue(value: boolean): void {
        this.isCurrentDataBase = value;
    }
}
