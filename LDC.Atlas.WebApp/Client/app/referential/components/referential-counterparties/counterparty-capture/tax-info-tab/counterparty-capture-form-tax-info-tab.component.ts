import { Component, OnInit, Input } from '@angular/core';
import * as agGrid from 'ag-grid-community';
import { ActivatedRoute } from '@angular/router';
import { TaxListDisplayView } from './tax-ag-grid-row';
import { CounterpartyTax } from '../../../../../shared/entities/counterparty-tax.entity';
import { MasterdataService } from '../../../../../shared/services/http-services/masterdata.service';
import { MatDialog } from '@angular/material';
import { MasterData } from '../../../../../shared/entities/masterdata.entity';
import { AgGridAutocompleteComponent } from '../../../../../shared/components/ag-grid/autocomplete/ag-grid-autocomplete.component';
import { AgContextualMenuComponent } from '../../../../../shared/components/ag-contextual-menu/ag-contextual-menu.component';
import { AgContextualMenuAction } from '../../../../../shared/entities/ag-contextual-menu-action.entity';
import { ConfirmationDialogComponent } from '../../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { BaseFormComponent } from '../../../../../shared/components/base-form-component/base-form-component.component';
import { FormConfigurationProviderService } from '../../../../../shared/services/form-configuration-provider.service';
import { SnackbarService } from '../../../../../shared/services/snackbar.service';
import { TaxGridActionComponent } from './tax-grid-action/tax-grid-action.component';

@Component({
    selector: 'atlas-counterparty-capture-form-tax-info-tab',
    templateUrl: './counterparty-capture-form-tax-info-tab.component.html',
    styleUrls: ['./counterparty-capture-form-tax-info-tab.component.scss']
})

export class CounterpartyCaptureFormTaxInfoTabComponent extends BaseFormComponent implements OnInit {
    company: string;
    masterdata: MasterData;
    taxGridCols: agGrid.ColDef[];
    gridApi: agGrid.GridApi;
    gridColumnApi: agGrid.ColumnApi;
    taxGridOptions: agGrid.GridOptions = {};
    countryList = new Array<string>();
    gridContext = {
        gridEditable: true,
    };
    gridContext1 = {
        gridEditable: false,
    };
    checkIfFavorite: boolean = false;
    taxGridContextualMenuActions: AgContextualMenuAction[];
    taxMenuActions: { [key: string]: string } = {
        deleteTax: 'delete',
    };
    agGridOptions: agGrid.GridOptions = {};
    agGridCols: agGrid.ColDef[];
    sideNavOpened: boolean = false;
    counterpartyTaxes: CounterpartyTax[];
    isDeleteDisabled: boolean = false;
    @Input() isViewMode: boolean = false;

    constructor(private route: ActivatedRoute,
        protected formConfigurationProvider: FormConfigurationProviderService,
        protected masterdataService: MasterdataService,
        private snackbarService: SnackbarService,
        protected dialog: MatDialog, ) {
        super(formConfigurationProvider);
        this.taxGridOptions = {
            context: { componentParent: this },
        };
    }

    ngOnInit() {
        this.company = this.route.snapshot.params['company'];
        this.masterdata = this.route.snapshot.data.masterdata;
        this.masterdata.countries.forEach((element) => {
            this.countryList.push(element.countryCode);
        });
        this.init();
        this.initializeGridColumns();
        this.initTaxsGridRows();
    }

    init() {
        const newTaxRow = new TaxListDisplayView();
        this.taxGridContextualMenuActions = [
            {
                icon: 'delete',
                text: 'Delete',
                action: this.taxMenuActions.deleteTax,
                disabled: this.isDeleteDisabled,
            },
        ];
    }

    updateAllRow(rowIndex) {
        if (!this.isViewMode) {
            this.gridApi.forEachNode((rowNode, index) => {
                rowNode.setDataValue("main", false)
                if (index == rowIndex) {
                    rowNode.data.main = true;
                }
            });
        }
        this.gridApi.refreshView();
    }

    onGridReady(params) {
        this.agGridOptions = params;
        this.agGridOptions.columnDefs = this.agGridCols;
        this.gridApi = this.agGridOptions.api;
        this.gridColumnApi = this.agGridOptions.columnApi;
        this.gridColumnApi.autoSizeAllColumns();
    }

    onAddRowButtonClicked() {
        const newItem = this.createNewRowData();
        const res = this.gridApi.updateRowData({ add: [newItem] });
    }

    createNewRowData() {
        const newTaxRow = new TaxListDisplayView();
        return newTaxRow;
    }

    initTaxsGridRows() {
        if (this.counterpartyTaxes) {
            this.counterpartyTaxes = this.counterpartyTaxes.filter((p) => p.isDeactivated === false);
        }
    }

    isGridEditable(params) {
        return params.context.gridEditable;
    }

    requiredCell(params) {
        if (!params.value || params.value === '') {
            return '<div class=\'cost-cell-value-required\'>Required*</div>';
        }
        return params.value;
    }

    handleAction(action: string, tax: TaxListDisplayView) {
        switch (action) {

            case this.taxMenuActions.deleteTax:
                const confirmDialog = this.dialog.open(ConfirmationDialogComponent, {
                    data: {
                        title: 'Tax Deletion',
                        text: 'Do you confirm the deletion?',
                        okButton: 'Yes',
                        cancelButton: 'No',
                    },
                });
                const confirmationDeleteSubscription = confirmDialog.afterClosed().subscribe((answer) => {
                    if (answer) {
                        this.gridApi.updateRowData({ remove: [tax] });
                        this.taxGridOptions.api.refreshView();
                        this.counterpartyTaxes.forEach((row) => {
                            if (row.counterpartyTaxId === tax.counterpartyTaxId) {
                                row.isDeactivated = true;
                            }
                        })
                    }
                });
                this.subscriptions.push(confirmationDeleteSubscription);
                break;
            default: this.assertUnreachable(action);
        }
    }

    assertUnreachable(x): never {
        throw new Error('Unknown action');
    }

    initializeGridColumns() {
        this.taxGridOptions = {
            context: this.isViewMode ? this.gridContext1 : this.gridContext,
        };
        this.taxGridCols = [
            {
                headerName: 'VAT Registration',
                field: 'vatRegistrationNumber',
                colId: 'vatRegistrationNumber',
                width: 300,
                minWidth: 300,
                maxWidth: 300,
                editable: this.isViewMode ? false : true,
                cellRenderer: this.requiredCell,

            },
            {
                headerName: 'Country Code',
                field: 'countryId',
                colId: 'countryId',
                width: 600,
                minWidth: 600,
                maxWidth: 600,
                cellRendererFramework: AgGridAutocompleteComponent,
                cellRendererParams: {
                    context: {
                        componentParent: this,
                    },
                    options: this.masterdata.countries,
                    valueProperty: 'countryId',
                    codeProperty: 'description',
                    displayProperty: 'countryCode',
                    isRequired: (params) => {
                        return true;
                    },
                },
                onCellValueChanged: (params) => {
                },
            },
            {
                headerName: '',
                field: 'main',
                cellRendererFramework: TaxGridActionComponent,
                cellRendererParams: {
                    context: {
                        componentParent: this,
                    },
                },
                width: 100,
                minWidth: 100,
                maxWidth: 100,
            },
            {
                headerName: '',
                field: 'isDeactivated',
                colId: 'isDeactivated',
                hide: this.isViewMode ? true : false,
                cellRendererFramework: AgContextualMenuComponent,
                cellRendererParams: {
                    context: {
                        componentParent: this,
                        actionContext: this.isViewMode ? this.gridContext1 : this.gridContext,
                    },
                    menuActions: this.taxGridContextualMenuActions,
                },
                cellClass: 'ag-contextual-menu',
                width: 100,
                minWidth: 100,
                maxWidth: 100,
            },

        ];
    }

    validate(): boolean {
        let isValid = true;
        const counterpartyTaxesValidations = this.counterpartyTaxes;
        this.counterpartyTaxes = [];
        this.gridApi.forEachNode((rowData) => {
            if (!(rowData.data.vatRegistrationNumber && rowData.data.countryId)) {
                isValid = false;
            }
            else {
                let taxListDisplayView = new TaxListDisplayView();
                taxListDisplayView.counterpartyTaxId = rowData.data.counterpartyTaxId;
                taxListDisplayView.vatRegistrationNumber = rowData.data.vatRegistrationNumber;
                taxListDisplayView.countryId = rowData.data.countryId;
                taxListDisplayView.main = rowData.data.main;
                this.counterpartyTaxes.push(taxListDisplayView);
            }
        });

        if (counterpartyTaxesValidations && counterpartyTaxesValidations.length > 0 &&
            this.counterpartyTaxes && this.counterpartyTaxes.length > 0) {
            counterpartyTaxesValidations.forEach((obj) => {
                const objExists = this.counterpartyTaxes.find((cp) => cp.counterpartyTaxId === obj.counterpartyTaxId);
                if (!objExists && obj.isDeactivated) {
                    this.counterpartyTaxes.push(obj);
                }
            });
        }

        return isValid;
    }
}
