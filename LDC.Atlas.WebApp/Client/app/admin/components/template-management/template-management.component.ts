import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import * as agGrid from 'ag-grid-community';
import { AgContextualMenuComponent } from '../../../shared/components/ag-contextual-menu/ag-contextual-menu.component';
import { AgGridCheckboxComponent } from '../../../shared/components/ag-grid-checkbox/ag-grid-checkbox.component';
import { AgGridMultipleAutocompleteComponent } from '../../../shared/components/ag-grid/ag-grid-multiple-autocomplete/ag-grid-multiple-autocomplete.component';
import { AgGridAutocompleteComponent } from '../../../shared/components/ag-grid/autocomplete/ag-grid-autocomplete.component';
import { ConfirmationDialogComponent } from '../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { AgContextualMenuAction } from '../../../shared/entities/ag-contextual-menu-action.entity';
import { Arbitration } from '../../../shared/entities/arbitration.entity';
import { AtlasAgGridParam } from '../../../shared/entities/atlas-ag-grid-param.entity';
import { Commodity } from '../../../shared/entities/commodity.entity';
import { ContractTerm } from '../../../shared/entities/contract-term.entity';
import { Counterparty } from '../../../shared/entities/counterparty.entity';
import { Department } from '../../../shared/entities/department.entity';
import { PhysicalDocumentTemplate } from '../../../shared/entities/document-template.entity';
import { EnumEntity } from '../../../shared/entities/enum-entity.entity';
import { MasterData } from '../../../shared/entities/masterdata.entity';
import { PaymentTerm } from '../../../shared/entities/payment-term.entity';
import { ProfitCenter } from '../../../shared/entities/profit-center.entity';
import { Tag } from '../../../shared/entities/tag.entity';
import { ContractTypes } from '../../../shared/enums/contract-type.enum';
import { AgGridService } from '../../../shared/services/ag-grid.service';
import { ApiCollection } from '../../../shared/services/common/models';
import { DocumentService } from '../../../shared/services/http-services/document.service';
import { SnackbarService } from '../../../shared/services/snackbar.service';
import { TagField } from '../../../trading/entities/tag-field';
import { TemplateManagementLine } from '../../entities/template-management-line';
import { TemplateManagement } from '../../entities/template-management.entity';

@Component({
    selector: 'atlas-template-management',
    templateUrl: 'template-management.component.html',
})

export class TemplateManagementComponent implements OnInit {

    // GRID
    gridApi: agGrid.GridApi;
    gridColumnApi: agGrid.ColumnApi;
    templateManagementGridOptions: agGrid.GridOptions = {};
    atlasAgGridParam: AtlasAgGridParam;
    templateManagementGridColumns: agGrid.ColDef[];
    tableRows: TemplateManagementLine[];
    gridComponents = {
        // entrycomponents for the table
        atlasCheckbox: AgGridCheckboxComponent,
    };
    // GRID - Menu
    contextualMenuActions: AgContextualMenuAction[];
    menuActions: { [key: string]: string } = {
        deleteLine: 'delete',
    };

    // DataVariables
    masterdata: MasterData;
    tagFields: TagField[];
    templates: PhysicalDocumentTemplate[];
    contractTypes: EnumEntity[];
    company: string;
    // Form
    formGroup: FormGroup;

    row;

    constructor(
        private gridService: AgGridService,
        private documentService: DocumentService,
        protected snackbarService: SnackbarService,
        protected route: ActivatedRoute,
        protected dialog: MatDialog,
        protected router: Router,
    ) { }

    ngOnInit() {
        const parametersObservable = this.documentService.getTemplateParameters();
        const TemplatesTagsObservable = this.documentService.getTemplateManagement();
        const tempaltesObservable = this.documentService.getTemplates(1, null);

        this.company = this.route.snapshot.paramMap.get('company');
        this.formGroup = new FormGroup({});
        this.atlasAgGridParam = this.gridService.getAgGridParam();
        this.masterdata = this.route.snapshot.data.masterdata;
        this.contractTypes = this.masterdata.contractTypes
            .filter((value) => value.enumEntityId === ContractTypes.Purchase || value.enumEntityId === ContractTypes.Sale);
        this.contextualMenuActions = [
            {
                icon: 'delete',
                text: 'Delete',
                action: this.menuActions.deleteLine,
            },
        ];

        parametersObservable.subscribe((apiReponse: ApiCollection<TagField>) => this.tagFields = apiReponse.value);
        TemplatesTagsObservable.subscribe((apiReponse: TemplateManagement[]) => {
            this.tableRows = new Array<TemplateManagementLine>();

            apiReponse.forEach((templateTags: TemplateManagement) => {
                this.row = this.mapTemplateToTable(templateTags);
                this.tableRows.push(this.row);
            });
        });
        tempaltesObservable.subscribe((templates) => {
            this.templates = templates.value;
            this.initializeGridColumns();
        });
    }

    initializeGridColumns() {

        this.templateManagementGridColumns = [
            {
                headerName: 'EntityID',
                field: 'entityId',
                colId: 'entityId',
                hide: true,
            },
            {
                headerName: 'Inactive',
                field: 'inactive',
                colId: 'inactive',
                cellRenderer: 'atlasCheckbox',
                cellRendererParams: {
                    disabled: false,
                },
            },
            {
                headerName: 'Profit Center*',
                field: 'profitCenter',
                colId: 'profitCenter',
                cellRendererFramework: AgGridMultipleAutocompleteComponent,
                cellRendererParams: {
                    context: {
                        componentParent: this,
                    },
                    options: this.masterdata.profitCenters
                        .sort((a, b) => a.profitCenterCode.localeCompare(b.profitCenterCode)),
                    valueProperty: 'profitCenterId',
                    codeProperty: 'profitCenterCode',
                    displayProperty: 'profitCenterCode',
                    allSelected: true,
                    isRequired: true,
                    allOptionsElement: {
                        profitCenterId: 0,
                        profitCenterCode: 'All',

                    },
                },
                onCellValueChanged: (params) => {
                    const filteredDepartments = this.masterdata.departments.filter((e) => {
                        return e.profitCenterId === params.data.profitCenter;
                    });

                    if (filteredDepartments && filteredDepartments.length > 0) {
                        this.masterdata.departments = filteredDepartments;
                    }
                },
            },
            {
                headerName: 'Department*',
                field: 'department',
                colId: 'department',
                cellRendererFramework: AgGridMultipleAutocompleteComponent,
                cellRendererParams: {
                    context: {
                        componentParent: this,
                    },
                    options: this.masterdata.departments
                        .sort((a, b) => a.departmentCode.localeCompare(b.departmentCode)),
                    valueProperty: 'departmentId',
                    codeProperty: 'departmentCode',
                    displayProperty: 'departmentCode',
                    allSelected: true,
                    isRequired: true,
                    allOptionsElement: {
                        departmentId: 0,
                        departmentCode: 'All',

                    },
                },
            },
            {
                headerName: 'Commodity*',
                field: 'commodity',
                colId: 'commodity',
                cellRendererFramework: AgGridMultipleAutocompleteComponent,
                cellRendererParams: {
                    options: this.removeDuplicates(this.masterdata.commodities, 'commodityType')
                        .sort((a, b) => a.commodityType.localeCompare(b.commodityType)),
                    valueProperty: 'commodityId',
                    codeProperty: 'commodityType',
                    displayProperty: 'commodityType',
                    allSelected: true,
                    isRequired: true,
                    allOptionsElement: {
                        commodityId: 0,
                        commodityType: 'All',
                    },
                },
            },
            {
                headerName: 'Contract type',
                field: 'contractType',
                colId: 'contractType',
                cellRendererFramework: AgGridMultipleAutocompleteComponent,
                cellRendererParams: {
                    context: {
                        componentParent: this,
                    },
                    options: this.contractTypes,
                    valueProperty: 'enumEntityId',
                    codeProperty: 'enumEntityValue',
                    displayProperty: 'enumEntityValue',
                    allSelected: true,
                    isRequired: true,
                    allOptionsElement: {
                        enumEntityId: null,
                        enumEntityValue: 'All',
                    },
                },
            },
            {
                headerName: 'Arbitration code',
                field: 'arbitrationCode',
                colId: 'arbitrationCode',
                cellRendererFramework: AgGridMultipleAutocompleteComponent,
                cellRendererParams: {
                    context: {
                        componentParent: this,
                    },
                    options: this.masterdata.arbitrations
                        .sort((a, b) => a.arbitrationCode.localeCompare(b.arbitrationCode)),
                    valueProperty: 'arbitrationId',
                    codeProperty: 'arbitrationCode',
                    displayProperty: 'arbitrationCode',
                    allSelected: true,
                    isRequired: true,
                    allOptionsElement: {
                        arbitrationId: 0,
                        arbitrationCode: 'All',
                    },
                },
            },
            {
                headerName: 'Contract Terms',
                field: 'contractTerms',
                colId: 'contractTerms',
                cellRendererFramework: AgGridMultipleAutocompleteComponent,
                cellRendererParams: {
                    context: {
                        componentParent: this,
                    },
                    options: this.masterdata.contractTerms
                        .sort((a, b) => a.contractTermCode.localeCompare(b.contractTermCode)),
                    valueProperty: 'contractTermId',
                    codeProperty: 'contractTermCode',
                    displayProperty: 'contractTermCode',
                    allSelected: true,
                    isRequired: true,
                    allOptionsElement: {
                        contractTermId: 0,
                        contractTermCode: 'All',
                    },
                },
            },
            {
                headerName: 'Payment Terms',
                field: 'paymentTerms',
                colId: 'paymentTerms',
                cellRendererFramework: AgGridMultipleAutocompleteComponent,
                cellRendererParams: {
                    context: {
                        componentParent: this,
                    },
                    options: this.masterdata.paymentTerms
                        .sort((a, b) => a.paymentTermCode.localeCompare(b.paymentTermCode)),
                    valueProperty: 'paymentTermsId',
                    codeProperty: 'paymentTermCode',
                    displayProperty: 'paymentTermCode',
                    allSelected: true,
                    isRequired: true,
                    allOptionsElement: {
                        paymentTermsId: 0,
                        paymentTermCode: 'All',
                    },
                },
            },
            {
                headerName: 'Counterparty',
                field: 'counterparty',
                colId: 'counterparty',
                cellRendererFramework: AgGridMultipleAutocompleteComponent,
                cellRendererParams: {
                    context: {
                        componentParent: this,
                    },
                    options: this.masterdata.counterparties
                        .sort((a, b) => a.counterpartyCode.localeCompare(b.counterpartyCode)),
                    valueProperty: 'counterpartyID',
                    codeProperty: 'counterpartyCode',
                    displayProperty: 'counterpartyCode',
                    allSelected: true,
                    isRequired: true,
                    allOptionsElement: {
                        counterpartyID: 0,
                        counterpartyCode: 'All',
                    },
                },
            },
            {
                headerName: 'Template Name',
                field: 'entityExternalId',
                colId: 'entityExternalId',
                cellRendererFramework: AgGridAutocompleteComponent,
                cellRendererParams: {
                    context: {
                        componentParent: this,
                        gridEditable: true,
                    },
                    options: this.templates.sort((a, b) => a.name.localeCompare(b.name)),
                    valueProperty: 'documentTemplateId',
                    codeProperty: 'name',
                    displayProperty: 'name',
                    isRequired: true,
                },
                onCellValueChanged: (params) => { },
            },
            {
                headerName: '',
                cellRendererFramework: AgContextualMenuComponent,
                cellRendererParams: {
                    context: {
                        componentParent: this,
                    },
                    menuActions: this.contextualMenuActions,
                    hide: false,
                },
                cellClass: 'ag-contextual-menu',
                maxWidth: 80,
            },
        ];
    }

    onGridReady(params) {
        params.columnDefs = this.templateManagementGridColumns;
        this.templateManagementGridOptions = params;

        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;
        this.gridApi.showNoRowsOverlay();
        this.gridService.sizeColumns(params);
    }

    onAddRowButtonClicked() {
        this.gridApi.updateRowData({ add: [new TemplateManagementLine()] });
        this.gridColumnApi.autoSizeAllColumns();
    }

    // TODO: this function can be useful througout the application; Move this to the util.service
    removeDuplicates(array: any[], key: string) {
        return array.filter((obj, index, self) =>
            index === self.findIndex((el) => (
                el[key] === obj[key]
            )),
        );
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
                this.goTotemplateManagementHome();
            }
        });
    }

    goTotemplateManagementHome() {
        this.router.navigate(['/' + this.company + '/admin']);
    }

    onSaveButtonClicked() {

        if (!this.formGroup.valid) {
            this.snackbarService.throwErrorSnackBar('Template\'s parameters are invalid. Please resolve the errors.');
        } else {
            const templateManagement: TemplateManagement[] = this.getGridData();
            this.documentService.saveTemplatesParameters(templateManagement).subscribe((response) => {
                this.snackbarService.throwErrorSnackBar('Saved successfully');
            });
        }
    }

    getGridData(): TemplateManagement[] {
        const templatesTags = new Array<TemplateManagement>();

        this.gridApi.forEachNode((rowData) => {
            if (rowData.data) {
                const templateTags: TemplateManagement = new TemplateManagement();
                templateTags.entityId = (rowData.data['entityId']) ? rowData.data['entityId'] : '-1';
                templateTags.entityExternalId = rowData.data['entityExternalId'];
                templateTags.isDeactivated = (rowData.data['inactive']) ? true : false;
                templateTags.tags = new Array<Tag>();

                templateTags.tags = templateTags.tags.concat(rowData.data['arbitrationCode'].map((a: Arbitration) => {
                    if (a) {
                        return new Tag(a.arbitrationId.toString(), 'Template.ArbitrationCode');
                    }
                }));
                templateTags.tags = templateTags.tags.concat(rowData.data['commodity'].map((c: Commodity) => {
                    if (c) {
                        return new Tag(c.commodityType, 'Template.Commodity');
                    }
                }));
                templateTags.tags = templateTags.tags.concat(rowData.data['contractTerms'].map((ct: ContractTerm) => {
                    if (ct) {
                        return new Tag(ct.contractTermId.toString(), 'Template.ContractTerms');
                    }
                }));
                templateTags.tags = templateTags.tags.concat(rowData.data['contractType'].map((cte: EnumEntity) => {
                    if (cte && cte.enumEntityId !== null) {
                        return new Tag(cte.enumEntityId.toString(), 'Template.ContractType');
                    }
                }));
                templateTags.tags = templateTags.tags.concat(rowData.data['counterparty'].map((cp: Counterparty) => {
                    if (cp) {
                        return new Tag(cp.counterpartyID.toString(), 'Template.Counterparty');
                    }
                }));
                templateTags.tags = templateTags.tags.concat(rowData.data['department'].map((d: Department) => {
                    if (d) {
                        return new Tag(d.departmentId.toString(), 'Template.Department');
                    }
                }));
                templateTags.tags = templateTags.tags.concat(rowData.data['paymentTerms'].map((p: PaymentTerm) => {
                    if (p) {
                        return new Tag(p.paymentTermsId.toString(), 'Template.PaymentTerms');
                    }
                }));
                templateTags.tags = templateTags.tags.concat(rowData.data['profitCenter'].map((pc: ProfitCenter) => {
                    if (pc) {
                        return new Tag(pc.profitCenterId.toString(), 'Template.ProfitCenter');
                    }
                }));
                templatesTags.push(templateTags);
            }
        });

        return templatesTags;
    }

    mapTemplateToTable(template: TemplateManagement): TemplateManagementLine {

        const line = new TemplateManagementLine();
        line.name = template.name;
        line.inactive = (template.isDeactivated) ? true : false;
        line.entityId = template.entityId;
        line.entityExternalId = template.entityExternalId;

        template.tags.forEach((tag: Tag) => {
            const pointToStartCut = tag.typeName.lastIndexOf('.') + 1;
            const tableName = tag.typeName.substring(pointToStartCut, tag.typeName.length);
            const property = this.lowerCaseFirstLetter(tableName);
            const value = this.searchValueIntoData(tableName, tag.tagValueId);
            if (!line[property]) {
                line[property] = new Array<any>();
            }
            line[property].push(value);
        });
        return line;
    }

    lowerCaseFirstLetter(variableName: string): string {
        return variableName.charAt(0).toLowerCase() + variableName.slice(1);
    }

    searchValueIntoData(table: string, idToSearch: any): any {
        let value: any;
        switch (table) {
            case 'ProfitCenter':
                value = this.masterdata.profitCenters.find((a) => a.profitCenterId.toString() === idToSearch);
                break;

            case 'Commodity':
                value = this.masterdata.commodities.find((a) => a.commodityType === idToSearch);
                break;

            case 'Department':
                value = this.masterdata.departments.find((a) => a.departmentId.toString() === idToSearch);
                break;

            case 'ContractType':
                value = this.masterdata.contractTypes.find((a) => a.enumEntityId.toString() === idToSearch);
                break;

            case 'ArbitrationCode':
                value = this.masterdata.arbitrations.find((a) => a.arbitrationId.toString() === idToSearch);

                break;
            case 'ContractTerms':
                value = this.masterdata.contractTerms.find((a) => a.contractTermId.toString() === idToSearch);
                break;

            case 'PaymentTerms':
                value = this.masterdata.paymentTerms.find((a) => a.paymentTermsId.toString() === idToSearch);
                break;

            case 'Counterparty':
                value = this.masterdata.counterparties.find((a) => a.counterpartyID.toString() === idToSearch);
                break;

            default:
                break;

        }
        return value;
    }

    handleAction(action: string, line: TemplateManagementLine) {
        switch (action) {
            case this.menuActions.deleteLine:
                const confirmDialog = this.dialog.open(ConfirmationDialogComponent, {
                    data: {
                        title: 'Template management Deletion',
                        text: 'Deleting a Template management line is permanent. Do you wish to proceed?',
                        okButton: 'Delete anyway',
                        cancelButton: 'Cancel',
                    },
                });
                confirmDialog.afterClosed().subscribe((answer) => {
                    if (answer) {
                        if (line.entityId && line.entityId !== '-1') {
                            this.documentService
                                .deleteTemplatesParameters(line.entityId)
                                .subscribe(() => {
                                    this.removeLine(line);
                                });
                        } else {
                            this.removeLine(line);
                        }
                    }
                });
                break;
            default:
                break;
        }
    }

    removeLine(line: TemplateManagementLine) {
        this.snackbarService.informationSnackBar('Template management line Deleted');
        this.gridApi.updateRowData({ remove: [line] });
        this.gridApi.refreshView();
    }
}
