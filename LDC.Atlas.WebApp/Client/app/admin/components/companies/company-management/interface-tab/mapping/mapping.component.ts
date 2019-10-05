import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import * as agGrid from 'ag-grid-community';
import { AgContextualMenuComponent } from '../../../../../../shared/components/ag-contextual-menu/ag-contextual-menu.component';
import { BaseFormComponent } from '../../../../../../shared/components/base-form-component/base-form-component.component';
import { AgContextualMenuAction } from '../../../../../../shared/entities/ag-contextual-menu-action.entity';
import { AtlasAgGridParam } from '../../../../../../shared/entities/atlas-ag-grid-param.entity';
import { AtlasFormControl } from '../../../../../../shared/entities/atlas-form-control';
import { CompanyConfiguration } from '../../../../../../shared/entities/company-configuration.entity';
import { MappingFields } from '../../../../../../shared/entities/mapping-entity';
import { AgGridService } from '../../../../../../shared/services/ag-grid.service';
import { FormConfigurationProviderService } from '../../../../../../shared/services/form-configuration-provider.service';

@Component({
    selector: 'atlas-mapping',
    templateUrl: './mapping.component.html',
    styleUrls: ['./mapping.component.scss'],
})
export class MappingComponent extends BaseFormComponent implements OnInit {
    @Output() readonly isSideNavOpened = new EventEmitter<boolean>();
    @Output() readonly discardChanges = new EventEmitter<any>();
    @Output() readonly saveMandatory = new EventEmitter();
    mappingGridContextualMenuActions: AgContextualMenuAction[];
    addNewLineCtrl = new AtlasFormControl('');
    mappingColumnDefs: agGrid.ColDef[];
    mappingGridOptions: agGrid.GridOptions = {};
    gridApi: agGrid.GridApi;
    gridColumnApi: agGrid.ColumnApi;
    atlasAgGridParam: AtlasAgGridParam;
    checkEdit: boolean;
    mappingSetUpData: MappingFields[] = [];
    mappingRowData: MappingFields[];

    mappingMenuActions: { [key: string]: string } = {
        deleteUser: 'delete',
    };
    currentCompany: string;
    companyId: string;

    constructor(protected formConfigurationProvider: FormConfigurationProviderService,
        private route: ActivatedRoute,
        public gridService: AgGridService,
        protected formBuilder: FormBuilder) {
        super(formConfigurationProvider);
        this.atlasAgGridParam = this.gridService.getAgGridParam();
    }

    ngOnInit() {
        this.currentCompany = decodeURIComponent(this.route.snapshot.paramMap.get('company'));
        this.companyId = this.route.snapshot.paramMap.get('companyId');
        this.populateMappingFieldList();
        this.init();
        if (!this.companyId) {
            this.checkEdit = true;
            this.initializeGridColumns();
        }
    }

    initForm(companyConfigurationRecord, isEdit) {
        this.checkEdit = isEdit;
        this.initializeGridColumns();
        return companyConfigurationRecord;
    }

    init() {
        this.mappingGridContextualMenuActions = [
            {
                icon: 'delete',
                text: 'Delete',
                action: this.mappingMenuActions.deleteMapping,
                disabled: ((params) => !this.checkEdit),
            },
        ];
    }

    onGridReady(params) {
        params.columnDefs = this.mappingColumnDefs;
        this.mappingGridOptions = params;
        this.gridApi = this.mappingGridOptions.api;
        this.gridColumnApi = this.mappingGridOptions.columnApi;

        this.gridColumnApi.autoSizeAllColumns();
        window.onresize = () => {
            this.gridColumnApi.autoSizeAllColumns();
        };
    }

    loadDefaultMappingFieldSetUpEditor() {
        const defaultMappingDataList = this.mappingSetUpData;
        this.mappingRowData = defaultMappingDataList.map((filter) => {
            return {
                interface: filter.interface,
                parameterName: filter.parameterName,
                initialValue: filter.initialValue,
                mapping: filter.mapping,
            };
        });
        if (this.gridApi) {
            if (this.gridApi) { this.gridApi.sizeColumnsToFit(); }
        }
    }

    initializeGridColumns() {
        this.mappingColumnDefs = [
            {
                headerName: 'Interface',
                colId: 'interface',
                field: 'interface',
                editable: this.checkEdit,
                width: 100,
            },
            {
                headerName: 'Parameter Name',
                colId: 'parameterName',
                field: 'parameterName',
                editable: this.checkEdit,
                width: 50,
            },
            {
                headerName: 'Initial Value',
                colId: 'initialValue',
                field: 'initialValue',
                editable: this.checkEdit,
                width: 40,
            },
            {
                headerName: 'Mapping',
                colId: 'mapping',
                field: 'mapping',
                editable: this.checkEdit,
                width: 40,
            },
            {
                headerName: ' ',
                cellRendererFramework: AgContextualMenuComponent,
                cellRendererParams: {
                    context: {
                        componentParent: this,
                        editable: this.checkEdit,
                    },
                    menuActions: this.mappingGridContextualMenuActions,
                },
                cellClass: 'ag-contextual-menu',
                maxWidth: 80,
            },
        ];
    }

    // mockup data- will be removed and replaced with API call
    populateMappingFieldList() {
        this.mappingSetUpData.push
            ({ interface: 'Accounting', parameterName: 'Doc Type', initialValue: 'Create reversal of Commercial', mapping: 'Regular' },
             { interface: 'Accounting', parameterName: 'Doc Type', initialValue: 'Create reversal of cost invoice', mapping: 'Regular' },
             { interface: 'Accounting', parameterName: 'Doc Type', initialValue: 'Commercial Invoice', mapping: 'Regular' },
             { interface: 'Accounting', parameterName: 'Doc Type', initialValue: 'Commercial Cost', mapping: 'Regular' },
             { interface: 'Accounting', parameterName: 'Doc Type', initialValue: 'Cost Invoice', mapping: 'Cost Invoice' },
             { interface: 'Accounting', parameterName: 'Doc Type', initialValue: 'Washout', mapping: 'Washout' });
    }

    onDiscardButtonClicked() {
        this.discardChanges.emit({ selectedOptionName: 'MappingComponent' });
    }

    onSaveButtonClicked() {
        this.mappingSetUpData = [];
        this.gridApi.forEachNode((rowdata) => {
            const mappingSetUpRow = new MappingFields();
            mappingSetUpRow.interface = rowdata.data.interface;
            mappingSetUpRow.parameterName = rowdata.data.parameterName;
            mappingSetUpRow.initialValue = rowdata.data.initialValue;
            mappingSetUpRow.mapping = rowdata.data.mapping;
            this.mappingSetUpData.push(mappingSetUpRow);
        });
        this.isSideNavOpened.emit(false);
        this.saveMandatory.emit();
    }

    populateEntity(entity: CompanyConfiguration): CompanyConfiguration {
        const companyConfiguration = entity;
        if (this.mappingSetUpData && this.mappingSetUpData.length > 0) {
            companyConfiguration.mappingSetup = this.mappingSetUpData;
        }
        return companyConfiguration;
    }

    onAddRowButtonClicked(numberOfLines: number) {
        for (let count = 1; count <= numberOfLines; count++) {
            const newItem = this.createNewRowData();
            this.gridApi.updateRowData({ add: [newItem] });
        }
        this.addNewLineCtrl.setValue('');
    }

    createNewRowData() {
        const newData = new MappingFields();
        newData.interface = '';
        newData.parameterName = '';
        newData.initialValue = '';
        newData.mapping = '';
        return newData;
    }
}
