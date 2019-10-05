import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as agGrid from 'ag-grid-community';
import { AgGridAutocompleteComponent } from '../../../../shared/components/ag-grid/autocomplete/ag-grid-autocomplete.component';
import { AgGridContextualSearchComponent } from '../../../../shared/components/ag-grid/contextual-search/ag-grid-contextual-search.component';
import { BulkEditSearchResult } from '../../../../shared/dtos/bulkEdit-search-result';
import { ReferentialCounterpartiesSearchResult } from '../../../../shared/dtos/referential-Counterparties-search-result';
import { AddressType } from '../../../../shared/entities/address-type.entity';
import { Company } from '../../../../shared/entities/company.entity';
import { CounterpartyTradeStatus } from '../../../../shared/entities/counterparty-trade-status.entity';
import { Counterparty } from '../../../../shared/entities/counterparty.entity';
import { Country } from '../../../../shared/entities/country.entity';
import { LdcRegion } from '../../../../shared/entities/ldc-region.entity';
import { MasterDataProps } from '../../../../shared/entities/masterdata-props.entity';
import { MasterData } from '../../../../shared/entities/masterdata.entity';
import { Province } from '../../../../shared/entities/province.entity';
import { StatusDescriptionTypes } from '../../../../shared/entities/status-description.entity';
import { StatusDescription } from '../../../../shared/enums/status-description';
import { MasterdataService } from '../../../../shared/services/http-services/masterdata.service';
import { CounterpartyApplyButtonComponent } from './apply/counterparty-apply-button.component';
import { SelectMultiDropdownComponent } from './select-multi-dropdown/select-multi-dropdown.component';

@Component({
    selector: 'atlas-counterparty-detail-component',
    templateUrl: './counterparty-detail-component.component.html',
    styleUrls: ['./counterparty-detail-component.component.scss'],
})
export class CounterpartyDetailComponentComponent implements OnInit {
    columnDefs: agGrid.ColDef[];
    agGridOptions: agGrid.GridOptions = {};
    agGridCols: agGrid.ColDef[];
    agGridApi: agGrid.GridApi;
    agGridColumnApi: agGrid.ColumnApi;
    editCounterpartyDocumentLines: BulkEditSearchResult[];
    countryList = new Array<string>();
    filteredLdcRegion: LdcRegion[];
    masterdata: MasterData;
    filteredCountry: Country[];
    filteredCounterpartyList: Counterparty[];
    headOfFamilyControl: Counterparty[];
    statusoptions: StatusDescriptionTypes[];
    titleToView: StatusDescriptionTypes = new StatusDescriptionTypes();
    isSummaryView: boolean = false;
    counterpartyTradeStatusList: CounterpartyTradeStatus[] = [];
    filteredProvince: Province[];
    filteredAddressType: AddressType[];
    columnName: any;
    flagOnChangeValue: boolean = false;
    bulkEditField: string = 'Bulk edit row';
    filteredCompanies: Company[] = [];
    selectedCompanies: Company[] = [];
    pinnedTopRowData: any;
    constructor(protected masterdataService: MasterdataService, private route: ActivatedRoute) { }

    ngOnInit() {
        this.masterdata = this.route.snapshot.data.masterdata;
        this.filteredCountry = this.masterdata.countries;
        this.filteredLdcRegion = this.masterdata.regions;
        this.filteredCounterpartyList = this.masterdata.counterparties;
        this.counterpartyTradeStatusList = this.masterdata.tradeStatus;
        this.filteredProvince = this.masterdata.provinces;
        this.filteredAddressType = this.masterdata.addressTypes;
        this.filteredCompanies = this.masterdata.companies;
        this.statusoptions = [
            {
                titleId: StatusDescription.StatusActive,
                StatusDescription: 'Active',
            },
            {
                titleId: StatusDescription.StatusInactive,
                StatusDescription: 'Inactive',
            },
        ];
        this.initializeGridColumns();
    }

    onGridReady(params) {
        this.agGridOptions = params;
        this.agGridOptions.columnDefs = this.agGridCols;
        this.agGridApi = this.agGridOptions.api;
        this.agGridColumnApi = this.agGridOptions.columnApi;
    }

    contractToBeSelected(contracts: BulkEditSearchResult[]) {
        this.editCounterpartyDocumentLines = contracts;
        this.agGridApi.sizeColumnsToFit();
        setTimeout(() => {
            this.agGridColumnApi.autoSizeAllColumns();
        })
    }

    requiredCell(params) {
        if (!params.value || params.value === '') {
            return '<div class=\'document-cell-value-required\'>Required*</div>';
        }

        return params.value;
    }

    notRequiredCell(params) {
        return params.value;
    }

    updateAllRow(rowData) {
        this.columnDefs.forEach((columnField) => {
            this.columnName = columnField.field;
            if (rowData[this.columnName] && rowData[this.columnName] != this.bulkEditField) {
                this.agGridApi.forEachNode((rowNode) => {
                    rowNode.setDataValue(this.columnName, rowData[this.columnName]);
                });
            }
        });
    }

    getPinnedTopData() {
        return [
            {
                rowStatus: 'Bulk edit row',
                accountReference: '',
                tradeStatusId: '',
                statusId: '',
                accountTitle: '',
                address1: '',
                address2: '',
                main: '',
                city: '',
                country: '',
                zipCode: '',
                mailEmailAddress: '',
                ldcRegion: '',
                province: '',
                addressType: '',
                headOfFamily: '',
                associatedCompanies: '',
                mdmId: '',
                mDMCategoryId: '',
                apply: ' ',
            },
        ];
    }

    onCellValueChanged(params) {
        if (params.colDef !== 'headOfFamily') {
            if (params.oldValue !== params.newValue) {
                params.node.data.isDirty = true;
                params.node.setDataValue('rowStatus', 'A');

            }
        }
    }

    initializeGridColumns() {
        this.columnDefs = [
            {
                headerName: 'Status',
                colId: 'rowStatus',
                field: 'rowStatus',
                editable: false,
                pinned: 'left',
                cellRenderer: (params) => {
                    if (params.value) {
                        return '<mat-chip-list><mat-chip style="background-color:green;color:white;text-overflow:clip;">' + params.value +
                            '</mat-chip></mat-chip-list>';
                    }

                    return '<mat-chip-list><mat-chip style="background-color:green;color:white;text-overflow:clip;">N</mat-chip></mat-chip-list>';
                },
                pinnedRowCellRenderer: (params) => {
                    if (params.value) {
                        return '<mat-chip-list><mat-chip style="background-color:white;color:black;text-overflow:clip;">' + 'Bulk Edit Row' +
                            '</mt-chip></mat-chip-list>';
                    }
                    return '';
                },
            },
            {
                headerName: 'Account Reference',
                colId: 'accountReference',
                field: 'accountReference',
                editable: true,
                cellStyle: (params) => {
                    if (params.node.rowPinned) {
                        return {
                            'background-color': 'lightgray',
                            'border-bottom': '2px solid blue !important'
                        };
                    }
                },
                cellRenderer: this.requiredCell,
                pinnedRowCellRenderer: this.notRequiredCell,
            },
            {
                headerName: 'Trade Status',
                colId: 'tradeStatusId',
                field: 'tradeStatusId',
                cellStyle: (params) => {
                    if (params.node.rowPinned) {
                        return {
                            'background-color': 'lightgray',
                            'border-bottom': '2px solid blue !important'
                        };
                    }
                },
                cellRendererFramework: AgGridAutocompleteComponent,
                cellRendererParams: {
                    context: {
                        componentParent: this,
                        gridEditable: true,
                    },
                    options: this.counterpartyTradeStatusList,
                    valueProperty: 'enumEntityId',
                    codeProperty: 'enumEntityId',
                    displayProperty: 'enumEntityValue',
                    isRequired: true,
                },
                pinnedRowCellRendererFramework: AgGridAutocompleteComponent,
                pinnedRowCellRendererParams: {
                    context: {
                        componentParent: this,
                        gridEditable: true,
                    },
                    options: this.counterpartyTradeStatusList,
                    valueProperty: 'enumEntityId',
                    codeProperty: 'enumEntityId',
                    displayProperty: 'enumEntityValue',

                },
                onCellValueChanged: (params) => {
                    if (params.data.tradeStatusId && this.masterdata.tradeStatus) {
                        const tradeStatusValue = this.masterdata.tradeStatus.find((tradeStatus) => tradeStatus.enumEntityId === params.data.tradeStatusId);
                        if (tradeStatusValue) {
                            params.node.setDataValue('tradeStatusId', tradeStatusValue.enumEntityId);
                            params.node.data.isDirty = true;
                            params.node.setDataValue('rowStatus', 'A');
                        }
                    }
                },
            },
            {
                headerName: 'Status',
                colId: 'statusId',
                field: 'statusId',
                cellStyle: (params) => {
                    if (params.node.rowPinned) {
                        return {
                            'background-color': 'lightgray',
                            'border-bottom': '2px solid blue !important'
                        };
                    }
                },
                cellRendererFramework: AgGridAutocompleteComponent,
                cellRendererParams: {
                    context: {
                        componentParent: this,
                        gridEditable: true,
                    },
                    options: this.statusoptions,
                    valueProperty: 'titleId',
                    codeProperty: 'titleId',
                    displayProperty: 'StatusDescription',
                    isRequired: true,
                },
                pinnedRowCellRendererFramework: AgGridAutocompleteComponent,
                pinnedRowCellRendererParams: {
                    context: {
                        componentParent: this,
                        gridEditable: true,
                    },
                    options: this.statusoptions,
                    valueProperty: 'titleId',
                    codeProperty: 'titleId',
                    displayProperty: 'StatusDescription',
                },
                onCellValueChanged: (params) => {
                    if (this.statusoptions) {
                        const StatusValue = this.statusoptions.find((status) => status.titleId === params.data.statusId);
                        if (StatusValue) {
                            params.node.setDataValue('statusId', StatusValue.titleId);
                            params.node.data.isDirty = true;
                            params.node.setDataValue('rowStatus', 'A');
                        }
                    }
                },
            },
            {
                headerName: 'Account title',
                colId: 'accountTitle',
                field: 'accountTitle',
                editable: true,
                cellStyle: (params) => {
                    if (params.node.rowPinned) {
                        return {
                            'background-color': 'lightgray',
                            'border-bottom': '2px solid blue !important'
                        };
                    }
                },
                cellRenderer: this.requiredCell,
                pinnedRowCellRenderer: this.notRequiredCell,
            },
            {
                headerName: 'Address 1',
                colId: 'address1',
                field: 'address1',
                editable: true,
                cellStyle: (params) => {
                    if (params.node.rowPinned) {
                        return {
                            'background-color': 'lightgray',
                            'border-bottom': '2px solid blue !important'
                        };
                    }
                },
            },
            {
                headerName: 'Address 2',
                colId: 'address2',
                field: 'address2',
                cellStyle: (params) => {
                    if (params.node.rowPinned) {
                        return {
                            'background-color': 'lightgray',
                            'border-bottom': '2px solid blue !important'
                        };
                    }
                },
                editable: true,
            },
            {
                headerName: 'Main',
                colId: 'main',
                field: 'main',
                cellStyle: (params) => {
                    if (params.node.rowPinned) {
                        return {
                            'background-color': 'lightgray',
                        };
                    }
                },

            },
            {
                headerName: 'City',
                colId: 'city',
                field: 'city',
                editable: true,
                cellStyle: (params) => {
                    if (params.node.rowPinned) {
                        return {
                            'background-color': 'lightgray',
                            'border-bottom': '2px solid blue !important'
                        };
                    }
                },
            },
            {
                headerName: 'Country Code',
                field: 'country',
                colId: 'country',
                cellStyle: (params) => {
                    if (params.node.rowPinned) {
                        return {
                            'background-color': 'lightgray',
                            'border-bottom': '2px solid blue !important'
                        };
                    }
                },
                cellRendererFramework: AgGridAutocompleteComponent,
                cellRendererParams: {
                    context: {
                        componentParent: this,
                        gridEditable: true,
                    },
                    options: this.filteredCountry,
                    valueProperty: 'countryCode',
                    codeProperty: 'countryCode',
                    displayProperty: 'description',
                    isRequired: (params) => {
                        return true;
                    },
                },
                pinnedRowCellRendererFramework: AgGridAutocompleteComponent,
                pinnedRowCellRendererParams: {
                    context: {
                        componentParent: this,
                        gridEditable: true,
                    },
                    options: this.filteredCountry,
                    valueProperty: 'countryCode',
                    codeProperty: 'countryCode',
                    displayProperty: 'description',
                },
                onCellValueChanged: (params) => {
                    if (params.data.country && this.masterdata.countries) {
                        const counterpartyCountryCode = this.masterdata.countries.find((counterpartyCountryCode) => counterpartyCountryCode.countryCode === params.data.country);
                        if (counterpartyCountryCode) {
                            params.node.setDataValue('country', counterpartyCountryCode.countryCode);
                            params.node.data.isDirty = true;
                            params.node.setDataValue('rowStatus', 'A');
                        }
                    }
                },
            },
            {
                headerName: 'Zip code',
                colId: 'zipCode',
                field: 'zipCode',
                editable: true,
                cellStyle: (params) => {
                    if (params.node.rowPinned) {
                        return {
                            'background-color': 'lightgray',
                            'border-bottom': '2px solid blue !important'
                        };
                    }
                },
            },
            {
                headerName: 'Main Email Address',
                colId: 'mailEmailAddress',
                field: 'mailEmailAddress',
                cellStyle: (params) => {
                    if (params.node.rowPinned) {
                        return {
                            'background-color': 'lightgray',
                        };
                    }
                },
            },
            {
                headerName: 'LDC Region',
                colId: 'ldcRegion',
                field: 'ldcRegion',
                cellStyle: (params) => {
                    if (params.node.rowPinned) {
                        return {
                            'background-color': 'lightgray',
                            'border-bottom': '2px solid blue !important'
                        };
                    }
                },
                cellRendererFramework: AgGridAutocompleteComponent,
                cellRendererParams: {
                    context: {
                        componentParent: this,
                        gridEditable: true,
                    },
                    options: this.filteredLdcRegion,
                    valueProperty: 'ldcRegionId',
                    codeProperty: 'ldcRegionId',
                    displayProperty: 'description',
                    isRequired: true,
                },
                pinnedRowCellRendererFramework: AgGridAutocompleteComponent,
                pinnedRowCellRendererParams: {
                    context: {
                        componentParent: this,
                        gridEditable: true,
                    },
                    options: this.filteredLdcRegion,
                    valueProperty: 'ldcRegionId',
                    codeProperty: 'ldcRegionId',
                    displayProperty: 'description',
                },
                onCellValueChanged: (params) => {
                    if (params.data.ldcRegion && this.masterdata.regions) {
                        const ldcRegion = this.masterdata.regions.find((e) => e.ldcRegionId === params.data.ldcRegion);
                        if (ldcRegion) {
                            params.node.setDataValue('ldcRegion', ldcRegion.ldcRegionId);
                            params.node.data.isDirty = true;
                            params.node.setDataValue('rowStatus', 'A');
                        }
                    }
                },
            },
            {
                headerName: 'Provinces',
                field: 'province',
                colId: 'province',
                cellStyle: (params) => {
                    if (params.node.rowPinned) {
                        return {
                            'background-color': 'lightgray',
                            'border-bottom': '2px solid blue !important'
                        };
                    }
                },
                cellRendererFramework: AgGridAutocompleteComponent,
                cellRendererParams: {
                    context: {
                        componentParent: this,
                        gridEditable: true,
                    },
                    options: this.filteredProvince,
                    valueProperty: 'provinceId',
                    codeProperty: 'provinceId',
                    displayProperty: 'description',

                },
                pinnedRowCellRendererFramework: AgGridAutocompleteComponent,
                pinnedRowCellRendererParams: {
                    context: {
                        componentParent: this,
                        gridEditable: true,
                    },
                    options: this.filteredProvince,
                    valueProperty: 'provinceId',
                    codeProperty: 'provinceId',
                    displayProperty: 'description',
                },
                onCellValueChanged: (params) => {
                    if (params.data.province && this.filteredProvince) {
                        const provinceValue = this.filteredProvince.find((province) => province.provinceId === params.data.province);
                        if (provinceValue) {
                            params.node.setDataValue('province', provinceValue.description);
                            params.node.data.isDirty = true;
                            params.node.setDataValue('rowStatus', 'A');
                        }
                    }
                },
            },
            {
                headerName: 'Address Type',
                field: 'addressType',
                colId: 'addressType',
                cellStyle: (params) => {
                    if (params.node.rowPinned) {
                        return {
                            'background-color': 'lightgray',
                            'border-bottom': '2px solid blue !important'
                        };
                    }
                },
                cellRendererFramework: AgGridAutocompleteComponent,
                cellRendererParams: {
                    context: {
                        componentParent: this,
                        gridEditable: true,
                    },
                    options: this.filteredAddressType,
                    valueProperty: 'enumEntityId',
                    codeProperty: 'enumEntityId',
                    displayProperty: 'enumEntityValue',
                    isRequired: true,

                },
                pinnedRowCellRendererFramework: AgGridAutocompleteComponent,
                pinnedRowCellRendererParams: {
                    context: {
                        componentParent: this,
                        gridEditable: true,
                    },
                    options: this.filteredAddressType,
                    valueProperty: 'enumEntityId',
                    codeProperty: 'enumEntityId',
                    displayProperty: 'enumEntityValue',
                },
                onCellValueChanged: (params) => {
                    if (params.data.addressType && this.filteredAddressType) {
                        const counterpartyAddressType = this.masterdata.addressTypes.find((counterpartyAddressType) => counterpartyAddressType.enumEntityId === params.data.addressType);
                        if (counterpartyAddressType) {
                            params.node.setDataValue('addressType', counterpartyAddressType.enumEntityValue);
                            params.node.data.isDirty = true;
                            params.node.setDataValue('rowStatus', 'A');
                        }
                    }
                },
            },

            {
                headerName: 'Head of Family',
                colId: 'headOfFamily',
                field: 'headOfFamily',
                cellStyle: (params) => {
                    if (params.node.rowPinned) {
                        return {
                            'background-color': 'lightgray',
                            'border-bottom': '2px solid blue !important'
                        };
                    }
                },
                cellRendererFramework: AgGridContextualSearchComponent,
                cellRendererParams: (params) => {
                    if (Number(params.value)) {
                        const value: Counterparty = this.masterdata.counterparties.find((headoffamilyvalue) =>
                            headoffamilyvalue.counterpartyID === Number(params.value));
                        params.setValue(value ? value.counterpartyCode : null);
                        params.data.rowStatus = 'N';
                        this.flagOnChangeValue = true;
                    }
                    return {
                        context: {
                            componentParent: this,
                            gridEditable: true,
                        },
                        gridId: 'counterpartiesGrid',
                        options: this.filteredCounterpartyList,
                        isRequired: false,
                        displayProperty: 'counterpartyCode',
                        valueProperty: 'counterpartyID',
                        lightBoxTitle: 'Results for Counterparty',
                        showContextualSearchIcon: !this.isSummaryView,
                    };
                },
                pinnedRowCellRendererFramework: AgGridContextualSearchComponent,
                pinnedRowCellRendererParams: (params) => {
                    return {
                        context: {
                            componentParent: this,
                            gridEditable: true,
                        },
                        gridId: 'counterpartiesGrid',
                        options: this.filteredCounterpartyList,
                        isRequired: false,
                        displayProperty: 'counterpartyCode',
                        valueProperty: 'counterpartyID',
                        lightBoxTitle: 'Results for Counterparty',
                        showContextualSearchIcon: !this.isSummaryView,
                    };
                },
                onCellValueChanged: (params) => {
                    if (!this.flagOnChangeValue) {
                        params.node.setDataValue('rowStatus', 'A');
                    }
                },
            },
            {
                headerName: 'Associated Companies',
                field: 'companyId',
                colId: 'companyId',
                cellStyle: (params) => {
                    if (params.node.rowPinned) {
                        return {
                            'background-color': 'lightgray',
                            'border-bottom': '2px solid blue !important'
                        };
                    }
                },
                cellRendererFramework: AgGridAutocompleteComponent,
                cellRendererParams: {
                    context: {
                        componentParent: this,
                        gridEditable: true,

                    },
                    options: this.filteredCompanies,
                    valueProperty: 'companyId',
                    codeProperty: 'companyId',
                    displayProperty: 'companyId',

                },
                pinnedRowCellRendererFramework: AgGridAutocompleteComponent,
                pinnedRowCellRendererParams: {
                    context: {
                        componentParent: this,
                        gridEditable: true,
                    },
                    options: this.filteredCompanies,
                    valueProperty: 'companyId',
                    codeProperty: 'companyId',
                    displayProperty: 'companyId',

                },
                onCellValueChanged: (params) => {
                    if (params.data.associatedCompanies && this.filteredCompanies) {
                        const associatedCompanies = this.filteredCompanies.find((associatedCompanies) => associatedCompanies.id === params.data.associatedCompanies);
                        if (associatedCompanies) {
                            params.node.setDataValue('companyId', associatedCompanies.companyId);
                            params.node.data.isDirty = true;
                            params.node.setDataValue('rowStatus', 'A');
                        }
                    }

                },
            },

            {
                headerName: 'MDM ID',
                colId: 'mdmId',
                field: 'mdmId',
                cellStyle: (params) => {
                    if (params.node.rowPinned) {
                        return {
                            'background-color': 'lightgray',
                        };
                    }
                },
            },
            {
                headerName: 'MDM Category Code',
                colId: 'mDMCategoryId',
                field: 'mDMCategoryId',
                cellStyle: (params) => {
                    if (params.node.rowPinned) {
                        return {
                            'background-color': 'lightgray',

                        };
                    }
                },
            },
            {
                headerName: '',
                colId: 'apply',
                field: 'apply',
                editable: false,
                pinned: 'right',
                suppressMenu: true,
                pinnedRowCellRendererFramework: CounterpartyApplyButtonComponent,
                pinnedRowCellRendererParams: {
                    context: {
                        componentParent: this,
                    },
                },
            },
        ];
        this.pinnedTopRowData = this.getPinnedTopData();
    }

}

