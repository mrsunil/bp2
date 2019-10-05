import { SelectionModel } from "@angular/cdk/collections";
import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Filter } from '../../../shared/entities/filter.entity';
import { MissingInvoicesDisplayView } from '../../../shared/models/missing-invoices-display-view';
import { TitleService } from '../../../shared/services/title.service';

@Component({
    selector: 'atr-missing-invoices-details',
    templateUrl: './missing-invoices-details.component.html',
    styleUrls: ['./missing-invoices-details.component.scss'],
})

export class MissingInvoicesDetailsComponent implements OnInit {
    constructor(private fb: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private titleService: TitleService) {

        this.createForm();

    }
    company: string;

    missingInvoicesForm: FormGroup;

    selectionManager = new SelectionModel<MissingInvoicesDisplayView>(true, []);
    selectionDisplayedColumns = ['contractRef', 'entityFilter', 'department', 'counterparty', 'vessel', 'transportFilter', 'blDate', 'period', 'commodity', 'quantity', 'total', 'price', 'priceDiff', 'lots', 'user', 'selection'];
    selectionDataSource: MatTableDataSource<MissingInvoicesDisplayView>;

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    dealType: string = '';

    missingInvoices: MissingInvoicesDisplayView[] = [
        // new MissingInvoicesDisplayView(126, 'P00126.000', '751', 'LDC', 'Vessel', new Date("12/12/2017"), 'D', 'BAG', 1000, 0.2, 100, 100, 1, 'ATRCTRL2', 'S4', 1, 'BULK', 'P'),
        // new MissingInvoicesDisplayView(127, 'P00127.000', '1260', 'LDC', 'Vessel', new Date("12/12/2017"), 'D', 'BAR', 3000, 0.2, 100, 100, 1, 'ATRCTRL3', 'A1', 1, 'BULK', 'P'),
        // new MissingInvoicesDisplayView(128, 'S00128.000', '799', 'ABBEYS01.P', 'Vessel', new Date("12/12/2017"), 'S', 'BAR', 100, 0.2, 100, 100, 1, 'ATRCTRL3', 'A8', 1, 'BULK', 'S'),
        // new MissingInvoicesDisplayView(129, 'P00129.000', '2270', 'LDC', 'Vessel', new Date("12/12/2017"), 'D', 'BIO', 5500, 0.2, 100, 100, 1, 'ATREXEC1', 'A1', 1, 'BULK', 'P'),
        // new MissingInvoicesDisplayView(130, 'S00130.000', '2270', 'ABDSRL01.P', 'Vessel', new Date("12/12/2017"), 'D', 'BIO', 6000, 0.2, 100, 100, 1, 'ATRCTRL3', 'A8', 1, 'BULK', 'S'),
        // new MissingInvoicesDisplayView(131, 'P00131.000', '2270', 'LDC', 'Vessel', new Date("12/12/2017"), 'S', 'BIO', 6050, 0.2, 100, 100, 1, 'ATRCTRL3', 'A1', 1, 'BULK', 'P'),
        // new MissingInvoicesDisplayView(132, 'P00132.000', '2270', 'LDC', 'Vessel', new Date("12/12/2017"), 'D', 'BIO', 7000, 0.2, 100, 100, 1, 'ATRCTRL3', 'A8', 1, 'BULK', 'P'),
        // new MissingInvoicesDisplayView(135, 'S00135.000', '1020', 'ACEGRA01.P', 'Vessel', new Date("12/12/2017"), 'D', 'BAG', 100, 0.2, 100, 100, 1, 'ATRCTRL1', 'S4', 1, 'BULK', 'S'),
        new MissingInvoicesDisplayView(18, 'S00028.000', '5540', 'AGENCI03.P', 'Vessel', new Date('12/12/2017'), 'D', 'BIO_OP', 8000, 0.2, 100, 100, 1, 'ATREXEC1', 'S4', 1, 'BULK', 'Sales'),
        new MissingInvoicesDisplayView(19, 'P00029.000', '5530', 'LDC', 'Vessel', new Date('12/12/2017'), 'D', 'BIO_OP', 8001, 0.2, 100, 100, 1, 'ATREXEC1', 'A1', 1, 'BULK', 'Purchases'),
        new MissingInvoicesDisplayView(20, 'P00030.000', '799', 'LDC', 'Vessel', new Date('12/12/2017'), 'D', 'CRN_UY', 134, 0.2, 100, 100, 1, 'ATRCTRL2', 'A8', 1, 'BULK', 'Purchases'),
        new MissingInvoicesDisplayView(21, 'P00031.000', '2020', 'LDC', 'Vessel', new Date('12/12/2017'), 'D', 'CME_BR', 4000, 0.2, 100, 100, 1, 'ATRCTRL2', 'A1', 1, 'BULK', 'Purchases'),
        new MissingInvoicesDisplayView(22, 'S00032.000', '1020', 'ABDSRL01.P', 'Vessel', new Date('12/12/2017'), 'D', 'BAR_AR', 807, 0.2, 100, 100, 1, 'ATRCTRL3', 'A8', 1, 'BULK', 'Sales'),
        new MissingInvoicesDisplayView(23, 'S00033.000', '6680', 'ABBEYS01.P', 'Vessel', new Date('12/12/2017'), 'D', 'BAG_UY', 909, 0.2, 100, 100, 1, 'ATRCTRL3', 'A1', 1, 'BULK', 'Sales'),
        new MissingInvoicesDisplayView(24, 'P00034.000', '3020', 'LDC', 'Vessel', new Date('12/12/2017'), 'S', 'BAR_AR', 980, 0.2, 100, 100, 1, 'ATRCTRL3', 'A1', 1, 'BULK', 'Purchases'),
        new MissingInvoicesDisplayView(25, 'P00035.000', '1210', 'LDC', 'Vessel', new Date('12/12/2017'), 'S', 'BIO_AR', 600, 0.2, 100, 100, 1, 'ATRCTRL3', 'A8', 1, 'BULK', 'Purchases'),
        new MissingInvoicesDisplayView(26, 'P00036.000', '751', 'LDC', 'Vessel', new Date('12/12/2017'), 'D', 'BAG_AR', 125, 0.2, 100, 100, 1, 'ATRCTRL1', 'S4', 1, 'BULK', 'Purchases'),

    ];

    filtersApplied: Filter[] = [];

    resultsAfterFiltering: MissingInvoicesDisplayView[] = [];

    selectedRowReference: string = '';

    createForm() {
        this.missingInvoicesForm = this.fb.group({
            entityFilterCtrl: '',
            platformFilterCtrl: '',
            blDateFilterCtrl: '',
            transportFilterCtrl: '',
            contractTypeFilterCtrl: '',
            userFilterCtrl: '',
        });
    }

    ngOnInit() {
        this.company = this.route.snapshot.paramMap.get('company');
        this.titleService.setTitle(this.route.snapshot.data.title);
        this.selectionDataSource = new MatTableDataSource(this.missingInvoices);
        this.selectionDataSource.paginator = this.paginator;
        this.selectionDataSource.sort = this.sort;
        this.dealType = String(this.route.snapshot.paramMap.get('dealType'));
        if (this.dealType != 'null') {
            let ctrl: AbstractControl = this.missingInvoicesForm.get('contractTypeFilterCtrl');
            ctrl.setValue([this.dealType]);
            this.contractTypeFilterChange();
        }
    }

    removeFilters(filterId: string) {
        this.filtersApplied = this.filtersApplied.filter((f) => f.filterId !== filterId);
        this.applyFilters();
    }
    addFilters(filterId: string, filters: string[]) {
        this.removeFilters(filterId);
        this.filtersApplied.push(new Filter(filterId, filters));
        this.applyFilters();
    }
    applyFilters() {
        this.resultsAfterFiltering = this.missingInvoices;
        this.applyEntityFilter();
        this.applyContractTypeFilter();
        this.selectionDataSource = new MatTableDataSource(this.resultsAfterFiltering);
        this.selectionDataSource.paginator = this.paginator;
        this.selectionDataSource.sort = this.sort;
    }
    filterChange(controlName: string) {
        let selectedValues: string[] = this.missingInvoicesForm.get(controlName).value;
        if (selectedValues.length === 0) { this.removeFilters(controlName); } else {
            this.addFilters(controlName, selectedValues);
        }
    }
    applyEntityFilter() {
        let selectedEntities: string[] = this.missingInvoicesForm.get('entityFilterCtrl').value;
        if (selectedEntities.length !== 0) {
            this.resultsAfterFiltering = this.resultsAfterFiltering.filter((m) => selectedEntities.includes(m.entityFilter));
        }
    }
    applyContractTypeFilter() {
        let selectedEntities: string[] = this.missingInvoicesForm.get('contractTypeFilterCtrl').value;
        if (selectedEntities.length !== 0) {
            this.resultsAfterFiltering = this.resultsAfterFiltering.filter((m) => selectedEntities.includes(m.contractTypeFilter));
        }
    }

    entityFilterChange() {
        let selectedEntities: string[] = this.missingInvoicesForm.get('entityFilterCtrl').value;
        if (selectedEntities.length === 0) {
            this.selectionDataSource = new MatTableDataSource(this.missingInvoices);
        } else {
            this.selectionDataSource = new MatTableDataSource(this.missingInvoices.filter((m) => selectedEntities.includes(m.entityFilter)));
        }
        this.selectionDataSource.paginator = this.paginator;
        this.selectionDataSource.sort = this.sort;
    }

    contractTypeFilterChange() {
        // let selectedValues: string[] = this.missingInvoicesForm.get("contractTypeFilterCtrl").value;
        // if (selectedValues.length == 0) { this.removeFilters("contractTypeFilterCtrl"); }
        // else {
        // 	this.addFilters("contractTypeFilterCtrl", selectedValues)
        // }
        let selectedEntities: string[] = this.missingInvoicesForm.get('contractTypeFilterCtrl').value;
        if (selectedEntities.length === 0) {
            this.selectionDataSource = new MatTableDataSource(this.missingInvoices);
        } else {
            this.selectionDataSource = new MatTableDataSource(this.missingInvoices.filter((m) => selectedEntities.includes(m.contractTypeFilter)));
        }
        this.selectionDataSource.paginator = this.paginator;
        this.selectionDataSource.sort = this.sort;
    }

    contractSelected(row: any) {
        if (this.selectionManager.isSelected(row)) {
            this.selectionManager.clear();
            this.selectedRowReference = '';
        } else {
            this.selectionManager.clear();
            this.selectionManager.toggle(row);
            this.selectedRowReference = row;
        }
    }

    proceedButtonClicked() {
        this.router.navigate(['/' + this.company + '/execution/invoicing/contract', String(this.selectionManager.selected[0].sectionID)]);
        // this.router.navigate(['/execution/invoicing/workingpage', String(this.selectionManager.selected[0].sectionID)]);
        // this.router.navigate(['/execution/invoicing/contract', this.selectionManager.selected[0].sectionID]);
    }
}
