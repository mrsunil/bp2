import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatMenuTrigger } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { CompanyManagerService } from '../../../../core/services/company-manager.service';
import { ListAndSearchComponent } from '../../../../shared/components/list-and-search/list-and-search.component';
import { ListAndSearchFilter } from '../../../../shared/entities/list-and-search/list-and-search-filter.entity';
import { ListAndSearchFilterType } from '../../../../shared/enums/list-and-search-filter-type.enum';
import { AccountingEntriesDataLoader } from '../../../../shared/services/list-and-search/accountingEntries-data-loader';
import { TransactionDocumentTypes } from '../../../../shared/enums/transaction-document-type.enum';
import { PostingDocumentType } from '../../../../shared/enums/posting-document-type.enum';

@Component({
    selector: 'atlas-accounting-entries-component',
    providers: [AccountingEntriesDataLoader],
    templateUrl: './accounting-entries-component.component.html',
    styleUrls: ['./accounting-entries-component.component.scss'],
})
export class AccountingEntriesComponent implements OnInit {
    @ViewChild(MatMenuTrigger) columnMenuTrigger: MatMenuTrigger;
    @ViewChild('listAndSearchComponent') listAndSearchComponent: ListAndSearchComponent;
    gridCode = 'accountingEntriesGrid';
    company: string;
    yepDocumentType: string = 'Year End Document';
    documentReferenceCtrl: FormControl = new FormControl();
    contractNoCtrl: FormControl = new FormControl();
    additionalFilters: ListAndSearchFilter[] = [];
    matchFlag: string;
    documentReference: string;
    documentDeleted: string[];
    loadOnInit = false;

    constructor(private route: ActivatedRoute,
        private router: Router,
        private companyManager: CompanyManagerService,
        public dataLoader: AccountingEntriesDataLoader) { }

    ngOnInit() {
        this.company = this.route.snapshot.paramMap.get('company');
        this.route.queryParams.subscribe((params) => {
            this.matchFlag = (params['matchFlag']);
        });
        this.route.queryParams.subscribe((params) => {
            this.documentDeleted = (params['documentDeleted']);
        });
        this.documentReference = this.route.snapshot.paramMap.get('invoiceReference');

        if (this.documentReference && this.listAndSearchComponent && !this.loadOnInit) {
            // when document reference is specified, we need to load the data
            this.documentReferenceCtrl.setValue(this.documentReference);
            this.onQuickSearchButtonClicked();
        }
    }

    onDataLoadClicked(event){
        const yepData = event.filter((data)=> data.documentType === this.yepDocumentType);
        const otherDocData = event.filter((data)=> data.documentType != this.yepDocumentType);
        
        if(yepData){
            yepData.forEach((row) =>{
        if(row.documentDate.getDate() === 1){
            row.accountingPeriod = 'ADJ ' + 'Opening ' + row.documentDate.getFullYear();
            }
            else{
                row.accountingPeriod = 'ADJ ' + 'Closing ' + row.documentDate.getFullYear(); 
            }
            })
        }
        const finalData = [];
        finalData.push(otherDocData);
        finalData.push(yepData);
        this.listAndSearchComponent.agGridApi.setRowData(finalData);
    }

    onQuickSearchButtonClicked() {
        this.additionalFilters = [];
        const documentLabelField = this.listAndSearchComponent.columnConfiguration
            .find((column) => column.fieldName === 'DocumentReference');
        const sectionLabelField = this.listAndSearchComponent.columnConfiguration
            .find((column) => column.fieldName === 'SecondaryReference');
        const contractLabelField = this.listAndSearchComponent.columnConfiguration
            .find((column) => column.fieldName === 'ContractSectionCode');

        if (!this.listAndSearchComponent) {
            return;
        } else {
            if (this.documentReferenceCtrl.value && this.documentReferenceCtrl.value.toString().length > 0) {
                const filterDocsRef = new ListAndSearchFilter();
                let filterDocRef;
                let filterSecDocRef;
                if (documentLabelField) {
                    filterDocRef = new ListAndSearchFilter();
                    filterDocRef.fieldId = documentLabelField.fieldId;
                    filterDocRef.fieldName = documentLabelField.fieldName;
                    filterDocRef.predicate = {
                        filterType: ListAndSearchFilterType.Text,
                        operator: 'eq',
                        value1: this.documentReference ? this.documentReference + '%' : this.documentReferenceCtrl.value + '%',
                    };
                    filterDocRef.isActive = true;
                }
                if (sectionLabelField) {
                    filterSecDocRef = new ListAndSearchFilter();
                    filterSecDocRef.fieldId = sectionLabelField.fieldId;
                    filterSecDocRef.fieldName = sectionLabelField.fieldName;
                    filterSecDocRef.predicate = {
                        filterType: ListAndSearchFilterType.Text,
                        operator: 'eq',
                        value1: this.documentReferenceCtrl.value + '%',
                    };
                    filterSecDocRef.isActive = true;
                }
                if (documentLabelField || sectionLabelField) {
                    if (documentLabelField && sectionLabelField) {
                        filterDocsRef.logicalOperator = 'or';
                        filterDocsRef.clauses = [filterDocRef, filterSecDocRef];
                        this.additionalFilters.push(filterDocsRef);
                    } else {
                        this.additionalFilters.push(filterDocRef ? filterDocRef : filterSecDocRef);
                    }
                }

            }
            if (this.contractNoCtrl.value && contractLabelField) {
                const filterContractNo = new ListAndSearchFilter();
                filterContractNo.fieldId = contractLabelField.fieldId;
                filterContractNo.fieldName = contractLabelField.fieldName;
                filterContractNo.predicate = {
                    filterType: ListAndSearchFilterType.Text,
                    operator: 'eq',
                    value1: this.contractNoCtrl.value + '%',
                };
                filterContractNo.isActive = true;
                this.additionalFilters.push(filterContractNo);
            }
        }
        this.listAndSearchComponent.additionalFilters = this.additionalFilters;
        this.listAndSearchComponent.loadData(true);
    }

    getAccountingEntriesByMatchFlag() {
        if (this.matchFlag) {
            const MatchFlagLabelField = this.listAndSearchComponent.columnConfiguration
                .find((column) => column.fieldName === 'MatchFlag');
            const filterMatchFlagCode = new ListAndSearchFilter();
            filterMatchFlagCode.fieldId = MatchFlagLabelField.fieldId;
            filterMatchFlagCode.fieldName = MatchFlagLabelField.fieldName;
            filterMatchFlagCode.predicate = {
                filterType: ListAndSearchFilterType.Text,
                operator: 'eq',
                value1: this.matchFlag + '%',
            };
            filterMatchFlagCode.isActive = true;
            this.additionalFilters.push(filterMatchFlagCode);

        }

        if (this.documentReference && this.documentReference.length > 0) {
            this.documentReferenceCtrl.setValue(this.documentReference);
            const documentLabelField = this.listAndSearchComponent.columnConfiguration
                .find((column) => column.fieldName === 'DocumentReference');
            const sectionLabelField = this.listAndSearchComponent.columnConfiguration
                .find((column) => column.fieldName === 'SecondaryReference');
            if (this.documentReferenceCtrl.value && this.documentReferenceCtrl.value.toString().length > 0) {
                const filterDocsRef = new ListAndSearchFilter();
                let filterDocRef;
                let filterSecDocRef;
                if (documentLabelField) {
                    filterDocRef = new ListAndSearchFilter();
                    filterDocRef.fieldId = documentLabelField.fieldId;
                    filterDocRef.fieldName = documentLabelField.fieldName;
                    filterDocRef.predicate = {
                        filterType: ListAndSearchFilterType.Text,
                        operator: 'eq',
                        value1: this.documentReferenceCtrl.value + '%',
                    };
                    filterDocRef.isActive = true;
                }
                if (sectionLabelField) {
                    filterSecDocRef = new ListAndSearchFilter();
                    filterSecDocRef.fieldId = sectionLabelField.fieldId;
                    filterSecDocRef.fieldName = sectionLabelField.fieldName;
                    filterSecDocRef.predicate = {
                        filterType: ListAndSearchFilterType.Text,
                        operator: 'eq',
                        value1: this.documentReferenceCtrl.value + '%',
                    };
                    filterSecDocRef.isActive = true;
                }
                if (documentLabelField || sectionLabelField) {
                    if (documentLabelField && sectionLabelField) {
                        filterDocsRef.logicalOperator = 'or';
                        filterDocsRef.clauses = [filterDocRef, filterSecDocRef];
                        this.additionalFilters.push(filterDocsRef);
                    } else {
                        this.additionalFilters.push(filterDocRef ? filterDocRef : filterSecDocRef);
                    }
                }
                this.documentReference = null;
            }
        }
        this.listAndSearchComponent.additionalFilters = this.additionalFilters;
    }
    getAccountingEntriesByDocumentReference() {
        if (this.documentDeleted) {
            const documentReferenceLabelField = this.listAndSearchComponent.columnConfiguration
                .find((column) => column.fieldName === 'DocumentReference');
            const filterdocumentReference = new ListAndSearchFilter();
            filterdocumentReference.fieldId = documentReferenceLabelField.fieldId;
            filterdocumentReference.fieldName = documentReferenceLabelField.fieldName;
            filterdocumentReference.predicate = {
                filterType: ListAndSearchFilterType.Text,
                operator: 'in',
                value1: this.documentDeleted.toString(),
            };
            filterdocumentReference.isActive = true;
            this.additionalFilters.push(filterdocumentReference);
        }
    }

}
