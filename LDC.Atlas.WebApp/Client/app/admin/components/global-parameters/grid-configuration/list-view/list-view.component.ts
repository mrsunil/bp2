import { Component, OnInit, OnDestroy, AfterViewInit, Output, EventEmitter, Input } from '@angular/core';
import { GridConfigurationProperties } from '../../../../../shared/entities/grid-configuration.entity';
import { AtlasFormControl } from '../../../../../shared/entities/atlas-form-control';
import { ConfigurationService } from '../../../../../shared/services/http-services/configuration.service';
import { from, Subject, Observable } from 'rxjs';
import { map, mergeMap, takeUntil } from 'rxjs/operators';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ConfigurationType } from '../../../../../shared/enums/configuration-type.enum';
import { Router } from '@angular/router';
import { CompanyManagerService } from '../../../../../core/services/company-manager.service';

@Component({
    selector: 'atlas-list-view',
    templateUrl: './list-view.component.html',
    styleUrls: ['./list-view.component.scss']
})
export class ListViewComponent implements OnInit, OnDestroy {

    @Output() readonly viewSelected = new EventEmitter<GridConfigurationProperties>();
    @Input() configurationTypeId: number;

    gridViewList: GridConfigurationProperties[];
    filteredGridViewList: GridConfigurationProperties[];
    searchedValueCtrl = new AtlasFormControl('searchedValueCtrl');
    destroy$ = new Subject();
    searchForm: FormGroup;
    searchTerm: string;
    isListEmpty: boolean = false;
    isLoading: boolean = true;
    groupedData: any;

    constructor(private configurationService: ConfigurationService,
        protected router: Router,
        private formBuilder: FormBuilder,
        protected companyManager: CompanyManagerService,
    ) {

        this.searchForm = this.formBuilder.group({
            searchedValueCtrl: this.searchedValueCtrl,
        });
    }

    ngOnInit() {
        this.getAllGridViews(this.configurationTypeId);
    }

    onOpenGridConfiguration(gridView: GridConfigurationProperties) {
        if (gridView.configurationTypeId == ConfigurationType.List) {

            this.router.navigate(['/' + this.companyManager.getCurrentCompanyId()
                + '/admin/global-parameters/grid-configuration/list/display', gridView.gridId]);
        }
        else if (gridView.configurationTypeId == ConfigurationType.Contextual) {

            this.router.navigate(['/' + this.companyManager.getCurrentCompanyId()
                + '/admin/global-parameters/grid-configuration/contextual/display', gridView.gridId]);
        }
    }

    getAllGridViews(configurationTypeId: number) {
        this.configurationService.getGridConfigByConfigurationTypeId(configurationTypeId)
            .subscribe((data) => {
                this.gridViewList = data.value.map((gridView) => {
                    return gridView;
                });
                this.filteredGridViewList = this.gridViewList;
                this.groupedData = Object.values(this.groupByName(this.filteredGridViewList)).sort(this.compare);
                if (this.filteredGridViewList.length === 0) {
                    this.isListEmpty = true;
                }
                else {
                    this.isListEmpty = false;
                }

                this.isLoading = false;
            });


    }

    compare(a, b) {
        const genreA = a.group.toUpperCase();
        const genreB = b.group.toUpperCase();

        let comparison = 0;
        if (genreA > genreB) {
            comparison = 1;
        } else if (genreA < genreB) {
            comparison = -1;
        }
        return comparison;
    }

    groupByName(rawData): any {
        let data = rawData.reduce((r, e) => {
            // get first letter of name of current element
            let group = e.name[0];
            // if there is no property in accumulator with this letter create it
            if (!r[group]) r[group] = { group, children: [e] }
            // if there is push current element to children array for that letter
            else r[group].children.push(e);
            // return accumulator
            return r;
        }, {})

        return data;
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    onSearchButtonClicked() {
        this.searchTerm = this.searchForm.get('searchedValueCtrl').value.toUpperCase();
        if (!this.searchTerm) {
            this.filteredGridViewList = this.gridViewList;
            this.groupedData = Object.values(this.groupByName(this.filteredGridViewList)).sort(this.compare);
        }
        else {
            this.filteredGridViewList = this.gridViewList.filter(grid => grid.name.toUpperCase().includes(this.searchTerm));
            this.groupedData = Object.values(this.groupByName(this.filteredGridViewList)).sort(this.compare);
        }

        if (this.filteredGridViewList.length === 0) {
            this.isListEmpty = true;
        }
        else {
            this.isListEmpty = false;
        }
    }


}
