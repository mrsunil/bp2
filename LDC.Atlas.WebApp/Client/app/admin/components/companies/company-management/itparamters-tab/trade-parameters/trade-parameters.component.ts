import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import * as agGrid from 'ag-grid-community';
import { BaseFormComponent } from '../../../../../../shared/components/base-form-component/base-form-component.component';
import { CellEditorNumericComponent } from '../../../../../../shared/components/cell-editor-numeric/cell-editor-numeric.component';
import { AtlasAgGridParam } from '../../../../../../shared/entities/atlas-ag-grid-param.entity';
import { CompanyConfiguration } from '../../../../../../shared/entities/company-configuration.entity';
import { MasterData } from '../../../../../../shared/entities/masterdata.entity';
import { TradeParameter } from '../../../../../../shared/entities/trade-parameter.entity';
import { WINDOW } from '../../../../../../shared/entities/window-injection-token';
import { ItParameterDocumentTypes } from '../../../../../../shared/enums/itparameter-documenttype.enum';
import { IntegerNumber } from '../../../../../../shared/numberMask';
import { AgGridService } from '../../../../../../shared/services/ag-grid.service';
import { CompanyConfigurationRecord } from '../../../../../../shared/services/configuration/dtos/company-configuration-record';
import { FormConfigurationProviderService } from '../../../../../../shared/services/form-configuration-provider.service';
import { SnackbarService } from '../../../../../../shared/services/snackbar.service';

@Component({
    selector: 'atlas-trade-parameters',
    templateUrl: './trade-parameters.component.html',
    styleUrls: ['./trade-parameters.component.scss'],
})
export class TradeParametersComponent extends BaseFormComponent implements OnInit {
    tradeColumnDefs: agGrid.ColDef[];
    tradeGridOptions: agGrid.GridOptions = {};
    gridApi: agGrid.GridApi;
    gridColumnApi: agGrid.ColumnApi;
    atlasAgGridParam: AtlasAgGridParam;
    checkEdit: boolean = false;
    modifiedTradeSetUpData: TradeParameter[] = [];
    tradeRowData: TradeParameter[] = [];
    currentCompany: string;
    companyId: string;
    requiredString: string = 'Required*';
    isValidTradeForm: boolean = true;
    masterData: MasterData;
    gridComponents = {
        atlasNumeric: CellEditorNumericComponent,
    };
    private readonly nextNumberMessage = 'NextNumber must be greater than previous number';
    private readonly numberNotAvailableMessage = 'Next Number cannot be empty';

    constructor(protected formConfigurationProvider: FormConfigurationProviderService,
        protected formBuilder: FormBuilder,
        @Inject(WINDOW) private window: Window,
        public gridService: AgGridService,
        private route: ActivatedRoute,
        protected snackbarService: SnackbarService) {
        super(formConfigurationProvider);
    }

    ngOnInit() {
        this.currentCompany = decodeURIComponent(this.route.snapshot.paramMap.get('company'));
        this.companyId = this.route.snapshot.paramMap.get('companyId');
        this.atlasAgGridParam = this.gridService.getAgGridParam();
        this.masterData = this.route.snapshot.data.masterdata;
        if (!this.companyId) {
            this.checkEdit = true;
            // bind description
            if (this.masterData.contractTypes && this.masterData.contractTypes.length > 0) {
                this.masterData.contractTypes.forEach((a) => {
                    const item = new TradeParameter();
                    item.contractTypeCode = a.enumEntityId;
                    item.description = this.bindDescription(a.enumEntityId);
                    item.nextNumber = 1;
                    item.oldNumber = 1;
                    if (item.description) {
                        this.tradeRowData.push(item);
                    }
                });
            }
            if (this.gridApi) {
                this.gridApi.sizeColumnsToFit();
            }
            this.initializeGridColumns();
        }
    }

    initForm(entity: CompanyConfigurationRecord, isEdit: boolean) {
        this.checkEdit = isEdit;
        const tradeNextNumberDetails = entity.tradeParameters;
        if (this.gridApi) {
            this.gridApi.sizeColumnsToFit();
        }
        this.initializeGridColumns();
        this.bindDocumentTypeDescription(tradeNextNumberDetails);
        return entity;
    }

    onGridReady(params) {
        params.columnDefs = this.tradeColumnDefs;
        this.tradeGridOptions = params;
        this.gridApi = this.tradeGridOptions.api;
        this.gridColumnApi = this.tradeGridOptions.columnApi;

        this.gridColumnApi.autoSizeAllColumns();
        this.window.onresize = () => {
            this.gridColumnApi.autoSizeAllColumns();
        };
    }

    initializeGridColumns() {
        this.tradeColumnDefs = [
            {
                headerName: 'Configurable Values',
                colId: 'description',
                field: 'description',
            },
            {
                headerName: 'Description',
                colId: 'nextNumber',
                field: 'nextNumber',
                editable: this.checkEdit,
                cellEditor: 'atlasNumeric',
                cellRenderer: this.requiredString,
                cellEditorParams: {
                    displayMask: IntegerNumber(),
                    isRightAligned: true,
                },
                type: 'numericColumn',
                onCellValueChanged: (params) => {
                    const oldNumber = params.data.oldNumber;
                    if (oldNumber) {
                        if (params.data.nextNumber < oldNumber) {
                            params.node.setDataValue('nextNumber', oldNumber);
                            this.snackbarService.throwErrorSnackBar(this.nextNumberMessage);
                        }
                        if (!params.data.nextNumber) {
                            params.node.setDataValue('nextNumber', oldNumber);
                            this.snackbarService.throwErrorSnackBar(this.numberNotAvailableMessage);
                        }
                    }
                },
            },
            {
                headerName: 'Old Number',
                colId: 'oldNumber',
                field: 'oldNumber',
                hide: true,
            },
            {
                headerName: 'ContractTypeCode',
                colId: 'contractTypeCode',
                field: 'contractTypeCode',
                hide: true,
            },
            {
                headerName: 'contractTypeCompanySetupId',
                colId: 'contractTypeCompanySetupId',
                field: 'contractTypeCompanySetupId',
                hide: true,
            },
        ];
    }

    populateEntity(entity: CompanyConfiguration): CompanyConfiguration {
        const companyConfiguration = entity;
        this.modifiedTradeSetUpData = [];
        this.gridApi.forEachNode((rowdata: agGrid.RowNode) => {
            const item = new TradeParameter();
            if (!rowdata.data.nextNumber || rowdata.data.nextNumber === 0) {
                this.isValidTradeForm = false;
            }
            item.contractTypeCode = rowdata.data.contractTypeCode;
            item.contractTypeCompanySetupId = rowdata.data.contractTypeCompanySetupId;
            item.nextNumber = rowdata.data.nextNumber;
            this.modifiedTradeSetUpData.push(item);
        });
        if (this.modifiedTradeSetUpData && this.modifiedTradeSetUpData.length > 0) {
            companyConfiguration.tradeParameters = this.modifiedTradeSetUpData;
        }
        return companyConfiguration;
    }

    bindDocumentTypeDescription(tradeNextNumberDetails: TradeParameter[]) {
        if (tradeNextNumberDetails) {
            tradeNextNumberDetails.forEach((tradeSetup) => {
                tradeSetup.oldNumber = tradeSetup.nextNumber;
                // add description for accounting Parameter
                const result = this.bindDescription(tradeSetup.contractTypeCode);
                if (result) {
                    tradeSetup.description = result;
                }
            });
            // avoid rows which does not have description
            const data: TradeParameter[] = [];
            tradeNextNumberDetails.forEach((item) => {
                if (item.description) {
                    data.push(item);
                }
            });
            this.tradeRowData = data;
        }
    }

    bindDescription(value: number): string {
        let result = null;
        switch (value) {
            case ItParameterDocumentTypes.Purchase:
                result = 'Next number for Purchase Contract';
                break;
            case ItParameterDocumentTypes.Sale:
                result = 'Next number for Sales Contract';
                break;
        }
        return result;
    }
}
