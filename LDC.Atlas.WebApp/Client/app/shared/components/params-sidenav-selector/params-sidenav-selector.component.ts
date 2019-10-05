import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material';
import * as agGrid from 'ag-grid-community';
import { Observable, of } from 'rxjs';
import { TagField } from '../../../trading/entities/tag-field';
import { ContractTerm } from '../../entities/contract-term.entity';
import { Counterparty } from '../../entities/counterparty.entity';
import { EnumEntity } from '../../entities/enum-entity.entity';
import { PagingOptions } from '../../entities/http-services/paging-options';
import { PaymentTerm } from '../../entities/payment-term.entity';
import { Port } from '../../entities/port.entity';
import { Tag } from '../../entities/tag.entity';
import { CostMatrixParametersFields } from '../../enums/costmatrix-parameters-fields.enum';
import { MasterdataService } from '../../services/http-services/masterdata.service';
import { CommoditySearchTerm } from '../../services/masterdata/dtos/commodity-search-term';
import { SnackbarService } from '../../services/snackbar.service';
import { AgGridCheckboxComponent } from '../ag-grid-checkbox/ag-grid-checkbox.component';
import { AgGridSelectComponent } from '../ag-grid-select/ag-grid-select.component';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';

@Component({
    selector: 'atlas-params-sidenav-selector',
    templateUrl: './params-sidenav-selector.component.html',
    styleUrls: ['./params-sidenav-selector.component.scss'],
})
export class ParamsSidenavSelectorComponent implements OnInit {
    static cmd1: string[];
    static cmd2: string[];
    static cmd3: string[];
    static cmd4: string[];
    static cmd5: string[];
    static contractTerms: ContractTerm[];
    static contractTypes: EnumEntity[];
    static counterparties: Counterparty[];
    static paymentTerms: PaymentTerm[];
    static ports: Port[];

    tagFieldList: TagField[];
    parametersPresaved: any;

    @Input() tagFields: Observable<TagField[]>;
    @Input() parameters: Tag[];
    @Output() readonly closeParamsSidenavSelector = new EventEmitter();
    @Input() paramsFormGroup: FormGroup = new FormGroup({});

    constructor(protected snackbarService: SnackbarService, protected masterdataService: MasterdataService, protected dialog: MatDialog) { }

    gridOptions: agGrid.GridOptions;
    gridApi: agGrid.GridApi;
    gridColumnApi: agGrid.ColumnApi;
    gridComponents = {
        atlasCheckbox: AgGridCheckboxComponent,
        atlasSelect: AgGridSelectComponent,
    };

    ngOnInit() {
        this.getCommodities();
        this.gridOptions = null;
    }

    onGridReady(params: agGrid.GridReadyEvent) {
        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;

        params.api.sizeColumnsToFit();

        this.tagFields.subscribe((rowData) => {
            params.api.setRowData(rowData);
            this.tagFields
                .subscribe((newRowData) => {
                    this.tagFieldList = newRowData;
                    params.api.setRowData(newRowData);
                })
                .add(() => {
                    this.createFormControls();
                    this.gridApi.refreshCells({ force: true });
                });
        });
    }

    createFormControls() {
        const columns = this.gridColumnApi.getAllColumns();

        this.gridApi.forEachNode((rowNode: agGrid.RowNode, index) => {
            columns
                .filter((column) => column.getColDef().field === 'value')
                .forEach(() => {
                    const key = this.tagFieldList[index].typeName;
                    const control = new FormControl();
                    let list = new Array();
                    if (this.parameters) {
                        list = this.parameters.filter((tag) => tag.typeName === this.tagFieldList[index].typeName)
                            .map((tag) => tag.tagValueId);
                    }

                    if (list.length > 0) {
                        control.setValue(list);
                    }
                    this.paramsFormGroup.addControl(key, control);
                    this.parametersPresaved = this.paramsFormGroup.value;
                });
        });
    }
    // Parameters
    /**
     * Returns the column definition for the sidebar-table of parameters
     */
    getParametersGridColDefinition(): agGrid.ColDef[] {
        return [
            {
                colId: 'templateId',
                headerName: 'templateId',
                field: 'value',
                hide: true,
                width: 300,
                maxWidth: 300,
            },
            {
                colId: 'value',
                headerName: 'Value',
                field: 'value',
                width: 400,
                maxWidth: 700,
                cellRenderer: 'atlasSelect',
                cellRendererParams(params) {
                    if (params.data.label === CostMatrixParametersFields.Cmy1) {
                        return {
                            options: ParamsSidenavSelectorComponent.cmd1,
                            labelField: null,
                            valueField: null,
                            key: 'Commodity.PrincipalCommodity',
                            gridId: 'commodityGrid',
                            modalHelperData: null,
                        };
                    }
                    if (params.data.label === CostMatrixParametersFields.Cmy2) {
                        return {
                            options: ParamsSidenavSelectorComponent.cmd2,
                            labelField: null,
                            valueField: null,
                            key: 'Commodity.Part2',
                            gridId: 'commodityGrid',
                            modalHelperData: null,
                        };
                    }
                    if (params.data.label === CostMatrixParametersFields.Cmy3) {
                        return {
                            options: ParamsSidenavSelectorComponent.cmd3,
                            labelField: null,
                            valueField: null,
                            key: 'Commodity.Part3',
                            gridId: 'commodityGrid',
                            modalHelperData: null,
                        };
                    }
                    if (params.data.label === CostMatrixParametersFields.Cmy4) {
                        return {
                            options: ParamsSidenavSelectorComponent.cmd4,
                            labelField: null,
                            valueField: null,
                            key: 'Commodity.Part4',
                            gridId: 'commodityGrid',
                            modalHelperData: null,
                        };
                    }
                    if (params.data.label === CostMatrixParametersFields.Cmy5) {
                        return {
                            options: ParamsSidenavSelectorComponent.cmd5,
                            labelField: null,
                            valueField: null,
                            key: 'Commodity.Part5',
                            gridId: 'commodityGrid',
                            modalHelperData: null,
                        };
                    }
                    if (params.data.label === CostMatrixParametersFields.ContractTerms) {
                        return {
                            options: ParamsSidenavSelectorComponent.contractTerms,
                            labelField: 'displayName',
                            valueField: 'contractTermId',
                            key: 'SectionDto.ContractTermCode',
                            gridId: null,
                            modalHelperData: null,
                        };
                    }
                    if (params.data.label === CostMatrixParametersFields.ContractType) {
                        return {
                            options: ParamsSidenavSelectorComponent.contractTypes,
                            labelField: 'enumEntityValue',
                            valueField: 'enumEntityId',
                            key: 'TradeDto.Type',
                            gridId: null,
                            modalHelperData: null,
                        };
                    }
                    if (params.data.label === CostMatrixParametersFields.Counterparty) {
                        return {
                            options: ParamsSidenavSelectorComponent.counterparties,
                            labelField: 'counterpartyCode',
                            valueField: 'counterpartyID',
                            key: 'SectionDto.CounterpartyReference',
                            gridId: 'counterpartiesGrid',
                            modalHelperData: of(ParamsSidenavSelectorComponent.counterparties),
                        };
                    }
                    if (params.data.label === CostMatrixParametersFields.PaymentTerms) {
                        return {
                            options: ParamsSidenavSelectorComponent.paymentTerms,
                            labelField: 'paymentTermCode',
                            valueField: 'paymentTermsId',
                            key: 'SectionDto.PaymentTermCode',
                            gridId: 'paymentTermsGrid',
                            modalHelperData: of(ParamsSidenavSelectorComponent.paymentTerms),
                        };
                    }
                    if (
                        params.data.label === CostMatrixParametersFields.PortOfDestination ||
                        params.data.label === CostMatrixParametersFields.PortOfOrigin
                    ) {
                        return {
                            options: ParamsSidenavSelectorComponent.ports,
                            labelField: 'portCode',
                            valueField: 'portId',
                            key:
                                params.data.label === CostMatrixParametersFields.PortOfDestination
                                    ? 'SectionDto.PortDestinationCode'
                                    : 'SectionDto.PortOriginCode',
                            gridId: 'portsGrid',
                            modalHelperData: of(ParamsSidenavSelectorComponent.ports),
                        };
                    }
                },
            },
            {
                headerName: 'Select',
                field: '',
                width: 300,
                maxWidth: 300,
            },
        ];
    }

    getContext() {
        return {
            formGroup: this.paramsFormGroup,
            createKey: this.createKey,
        };
    }

    createParametersObjectFromForm(): Tag[] {
        const keys = Object.keys(this.paramsFormGroup.value);

        const tagfields: Tag[] = new Array<Tag>();

        keys.forEach((key) => {
            let ids: string;
            if (this.paramsFormGroup.controls[key].enabled && this.paramsFormGroup.value[key]) {
                ids = this.paramsFormGroup.value[key].join();
                tagfields.push({ id: ids, tagValueId: ids, typeName: key });
            }
        });
        return tagfields;
    }

    onSaveButtonClicked() {
        if (this.paramsFormGroup.valid) {
            this.closeParamsSidenavSelector.emit(this.createParametersObjectFromForm());
            this.snackbarService.throwErrorSnackBar(
                'Parameters has beed added to the cost matrix. This changes will not prevail until you save the cost matrix',
            );
        } else {
            this.snackbarService.throwErrorSnackBar('Parameters are invalid. Please resolve the errors.');
        }
    } 

    onDiscardButtonClicked() {
        const confirmDialog = this.dialog.open(ConfirmationDialogComponent, {
            data: {
                title: 'Discard Changes',
                text: 'You have some modification pending. Close and lose changes?',
                okButton: 'Ok',
                cancelButton: 'Cancel',
            },
        });
        confirmDialog.afterClosed().subscribe((answer) => {
            if (answer) {
                this.paramsFormGroup.setValue(this.parametersPresaved);

                this.closeParamsSidenavSelector.emit(this.createParametersObjectFromForm());
            }
        });
    }
    private createKey(rowId: string, column: agGrid.Column): string {
        return `${rowId}${column.getColId()}`;
    }

    getCommodities() {
        const comodities = this.masterdataService
            .getCommodities(new CommoditySearchTerm(), new PagingOptions())
            .subscribe((commodities) => {
                ParamsSidenavSelectorComponent.cmd1 = [...new Set(commodities.value.map((x) => x.principalCommodity))].sort();
                ParamsSidenavSelectorComponent.cmd2 = [...new Set(commodities.value.map((x) => x.part2))].sort();
                ParamsSidenavSelectorComponent.cmd3 = [...new Set(commodities.value.map((x) => x.part3))].sort();
                ParamsSidenavSelectorComponent.cmd4 = [...new Set(commodities.value.map((x) => x.part4))].sort();
                ParamsSidenavSelectorComponent.cmd5 = [...new Set(commodities.value.map((x) => x.part5))].sort();
                this.masterdataService.getContractTerms().subscribe((contractTerms) => {
                    ParamsSidenavSelectorComponent.contractTerms = contractTerms.value;
                    this.masterdataService.getContractTypes().subscribe((contractType) => {
                        ParamsSidenavSelectorComponent.contractTypes = contractType.value;
                        this.masterdataService.getCounterparties('', new PagingOptions()).subscribe((counterparty) => {
                            ParamsSidenavSelectorComponent.counterparties = counterparty.value;
                            this.masterdataService.getPaymentTerms('', new PagingOptions()).subscribe((paymentTerms) => {
                                ParamsSidenavSelectorComponent.paymentTerms = paymentTerms.value;
                                this.masterdataService.getPorts('', new PagingOptions()).subscribe((ports) => {
                                    ParamsSidenavSelectorComponent.ports = ports.value;

                                    this.gridOptions = {
                                        columnDefs: this.getParametersGridColDefinition(),
                                        frameworkComponents: this.gridComponents,
                                        context: this.getContext(),
                                    };
                                });
                            });
                        });
                    });
                });
            });
    }
}
