import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ListAndSearchFilter } from '../../../shared/entities/list-and-search/list-and-search-filter.entity';
import { FxDealDataLoader } from '../../../shared/services/list-and-search/fxDeal-data-loader';
import { ListAndSearchComponent } from './../../../shared/components/list-and-search/list-and-search.component';
import { ListAndSearchFilterType } from './../../../shared/enums/list-and-search-filter-type.enum';
import { CompanyManagerService } from '../../../core/services/company-manager.service';

@Component({
    selector: 'atlas-fx-deals',
    templateUrl: './fx-deals.component.html',
    styleUrls: ['./fx-deals.component.scss'],
    providers: [FxDealDataLoader],
})
export class FxDealsComponent implements OnInit {
    @ViewChild('listAndSearchComponent') listAndSearchComponent: ListAndSearchComponent;
    dealCtrl: FormControl = new FormControl();
    gridCode = 'fxDealList';
    company: string;
    dataVersionId: number;
    additionalFilters: ListAndSearchFilter[] = [];


    constructor(private route: ActivatedRoute,
        public dataLoader: FxDealDataLoader,
        protected companyManager: CompanyManagerService,
        protected router: Router) { }

    ngOnInit() {
        this.company = this.route.snapshot.paramMap.get('company');
        this.dataVersionId = this.route.snapshot.paramMap.get('dataVersionId') ?
            Number(this.route.snapshot.paramMap.get('dataVersionId')) : null;
    }

    onQuickSearchButtonClicked() {
        const DealNumberField = this.listAndSearchComponent.columnConfiguration
            .find((column) => column.fieldName === 'DealNumber');
        if (!this.dealCtrl.value || !this.listAndSearchComponent ||
            !DealNumberField) {
            return;
        }
        const filter = new ListAndSearchFilter();
        filter.fieldId = DealNumberField.fieldId;
        filter.fieldName = DealNumberField.fieldName;
        filter.predicate = {
            filterType: ListAndSearchFilterType.Text,
            operator: 'eq',
            value1: this.dealCtrl.value + '%',
        };
        filter.isActive = true;
        this.additionalFilters = [filter];
        this.listAndSearchComponent.additionalFilters = this.additionalFilters;
        this.listAndSearchComponent.loadData(true);
    }
    onCreateFxDealButtonClicked() {
        this.router.navigate([this.companyManager.getCurrentCompanyId() + '/trades/fxdeal/capture']);
    }
    onFxDealClicked(event) {
        this.router.navigate([this.companyManager.getCurrentCompanyId() + '/trades/fxdeal/display/' + event.data.fxDealId]);
    }
}
