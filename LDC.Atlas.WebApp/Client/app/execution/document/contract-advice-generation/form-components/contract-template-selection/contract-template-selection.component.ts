import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatSidenav } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import * as agGrid from 'ag-grid-community';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/internal/operators/map';
import { TemplateManagementLine } from '../../../../../admin/entities/template-management-line';
import { TemplateManagement } from '../../../../../admin/entities/template-management.entity';
import { AgGridCheckboxComponent } from '../../../../../shared/components/ag-grid-checkbox/ag-grid-checkbox.component';
import { AgGridSelectComponent } from '../../../../../shared/components/ag-grid-select/ag-grid-select.component';
import { ConfirmationDialogComponent } from '../../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { TemplateWithTags } from '../../../../../shared/dtos/template-with-tags.dto';
import { AgContextualMenuAction } from '../../../../../shared/entities/ag-contextual-menu-action.entity';
import { AtlasAgGridParam } from '../../../../../shared/entities/atlas-ag-grid-param.entity';
import { PhysicalDocument } from '../../../../../shared/entities/document-generated.entity';
import { PhysicalDocumentTemplate } from '../../../../../shared/entities/document-template.entity';
import { FixPricedSection } from '../../../../../shared/entities/fix-priced-section.entity';
import { MasterData } from '../../../../../shared/entities/masterdata.entity';
import { Tag } from '../../../../../shared/entities/tag.entity';
import { TemplatesBestMatch } from '../../../../../shared/entities/templates-best-match.entity';
import { DocumentTypes } from '../../../../../shared/enums/document-type.enum';
import { AgGridService } from '../../../../../shared/services/ag-grid.service';
import { ApiCollection, ApiPaginatedCollection } from '../../../../../shared/services/common/models';
import { DocumentService } from '../../../../../shared/services/http-services/document.service';
import { TradingService } from '../../../../../shared/services/http-services/trading.service';
import { TagField } from '../../../../../trading/entities/tag-field';

@Component({
    selector: 'atlas-contract-template-selection',
    styleUrls: ['./contract-template-selection.component.css'],
    templateUrl: './contract-template-selection.component.html',
})
export class ContractTemplateSelecionComponent implements OnInit, OnDestroy {

    tagFieldList: TagField[];
    sectionId: number;

    gridComponents = {
        atlasCheckbox: AgGridCheckboxComponent,
    };

    templatesWithTags: TemplateWithTags[];

    masterdata: MasterData;
    tagFields: TagField[];
    tagsFromTrade: Tag[];

    templatesGridContextualMenuActions: AgContextualMenuAction[];
    templatesGridCols: agGrid.ColDef[];
    templatesGridRows = [];

    isLoading = false;
    selectedTemplateId: number;
    gridZoomAdditionalActions = [];
    sideTemplateNavOpened: boolean;
    trade: FixPricedSection;
    getContractAdviceTemplatesByTagsObservable: Observable<TemplatesBestMatch[]>;
    getTemplateManagementObservable: Observable<TemplateManagement[]>;
    tableRows: TemplateManagementLine[];

    documentTemplateCtrl: FormControl = new FormControl();
    physicalDocumentsTemplates: PhysicalDocumentTemplate[];

    templatesMenuActions: { [key: string]: string } = {
        loadTemplates: 'loadTemplates',
    };

    constructor(
        private route: ActivatedRoute,
        public gridService: AgGridService,
        protected dialog: MatDialog,
        private documentService: DocumentService,
        private tradingService: TradingService,
    ) { }

    templatesGridOptions: agGrid.GridOptions;
    gridApi: agGrid.GridApi;
    gridColumnApi: agGrid.ColumnApi;
    atlasAgGridParam: AtlasAgGridParam;

    onGridReady(params: agGrid.GridReadyEvent) {
        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;
    }

    ngOnInit() {
        this.sectionId = this.route.snapshot.params.recordId;
        this.masterdata = this.route.snapshot.data.masterdata;
        this.getTrade(this.sectionId);
        this.documentService.getTemplates(DocumentTypes.ContractAdvice).subscribe((response) => {
            this.physicalDocumentsTemplates = response.value;
        });
        const parametersObservable = this.documentService.getTemplateParameters();
        parametersObservable.subscribe((apiReponse: ApiCollection<TagField>) => {
            this.tagFields = apiReponse.value;

        });

        this.atlasAgGridParam = this.gridService.getAgGridParam();

        this.templatesGridOptions = {
            columnDefs: this.getTemplatesGridColDefinition(),
            frameworkComponents: this.gridComponents,
            context: this.getContext(),
        };
    }

    getTrade(tradeId: number) {
        this.tradingService.getSection(tradeId, 0).pipe(
            map((trade) => {
                this.trade = trade;
                this.getTagsFromTrade();
                this.getTemplateswithTags();
            }))
            .subscribe();
    }

    getTagsFromTrade() {
        this.tagsFromTrade = [];

        if (this.trade.departmentId && this.trade.departmentId !== 0) {
            const tag: Tag = new Tag(this.trade.departmentId.toString(), 'Template.Department');
            this.tagsFromTrade.push(tag);

            const profitCenterId = this.masterdata.departments.find((e) => {
                return (e.departmentId === this.trade.departmentId);
            }).profitCenterId;
            if (profitCenterId) {
                const tagProfitCenterTag: Tag = new Tag(profitCenterId.toString(), 'Template.ProfitCenter');
                this.tagsFromTrade.push(tagProfitCenterTag);
            }
        }
        if (this.trade.commodityId && this.trade.commodityId !== 0) {
            const principalCommodity = this.masterdata.commodities.find((e) => {
                return (e.commodityId === this.trade.commodityId);
            }).principalCommodity;
            const tag: Tag = new Tag(principalCommodity, 'Template.Commodity');
            this.tagsFromTrade.push(tag);
        }
        // TODO: Mode of transport (pending gap 170)
        if (this.trade.contractType) {
            const tag: Tag = new Tag(this.trade.contractType.toString(), 'Template.ContractType');
            this.tagsFromTrade.push(tag);
        }
        // TODO: Contract Type 2 (future specification)
        if (this.trade.arbitration) {
            const tag: Tag = new Tag(this.trade.arbitration.toString(), 'Template.ArbitrationCode');
            this.tagsFromTrade.push(tag);
        }
        if (this.trade.contractTerms) {
            const contractTermId = this.masterdata.contractTerms.find((e) => {
                return (e.contractTermCode === this.trade.contractTerms);
            }).contractTermId;
            const tag: Tag = new Tag(contractTermId.toString(), 'Template.ContractTerms');
            this.tagsFromTrade.push(tag);
        }
        if (this.trade.paymentTerms) {
            const paymentTermsId = this.masterdata.paymentTerms.find((e) => {
                return (e.paymentTermCode === this.trade.paymentTerms);
            }).paymentTermsId;
            const tag: Tag = new Tag(paymentTermsId.toString(), 'Template.PaymentTerms');
            this.tagsFromTrade.push(tag);
        }
        if (this.trade.counterpartyReference) {
            const tag: Tag = new Tag(this.trade.counterpartyReference.toString(), 'Template.Counterparty');
            this.tagsFromTrade.push(tag);
        }
    }

    private createKey(rowId: string, column: agGrid.Column): string {
        return `${rowId}${column.getColId()}`;
    }
    getContext() {
        return {
            createKey: this.createKey,
        };
    }

    assertUnreachable(action: string): never {
        throw new Error('Unknown action: ' + action);
    }

    ngOnDestroy() {

    }

    initForm() {

    }

    onLoadTemplatesClick() {
        this.documentService.listTemplatesWithTags()
            .subscribe((result) => {
                this.templatesWithTags = result.filter((template) => {
                    return !template.isDeactivated;
                });
                this.sideTemplateNavOpened = true;
            });
    }

    keepSelectedTemplateIdReceived(templateId: number, templateSideNav: MatSidenav) {
        templateSideNav.close();
        this.selectedTemplateId = templateId;
    }

    getTemplatesGridColDefinition(): agGrid.ColDef[] {
        return [
            {
                headerName: 'entityExternalId',
                field: 'entityExternalId',
                hide: true,
                width: 300,
                maxWidth: 300,
            },
            {
                headerName: 'Select',
                field: 'selected',
                colId: 'selected',
                width: 300,
                maxWidth: 300,
                cellRenderer: 'atlasCheckbox',
                cellRendererParams: {
                    disabled: false,
                },
                onCellValueChanged: (params) => {
                    if (params.data.selected) {
                        const match = this.physicalDocumentsTemplates.find((t) => t.documentTemplateId === params.data.entityExternalId);
                        this.documentTemplateCtrl.setValue([match]);
                    } else {
                        this.documentTemplateCtrl.setValue(undefined);
                    }
                },
            },
            {
                headerName: 'Template',
                field: 'name',
                width: 300,
                maxWidth: 300,
            },
            {
                headerName: 'Profit Center',
                field: 'profitCenter',
                width: 300,
                maxWidth: 300,
            },
            {
                headerName: 'Department',
                field: 'department',
                width: 300,
                maxWidth: 300,
            },
            {
                headerName: 'Commodity',
                field: 'commodity',
                width: 300,
                maxWidth: 300,
            },
            {
                headerName: 'Contract Type',
                field: 'contractType',
                width: 300,
                maxWidth: 300,
            },
            {
                headerName: 'Arbitration code',
                field: 'arbitrationCode',
                width: 300,
                maxWidth: 300,
            },
            {
                headerName: 'Contract Termns',
                field: 'contractTerms',
                width: 300,
                maxWidth: 300,
            },
            {
                headerName: 'Payment Termns',
                field: 'paymentTerms',
                width: 300,
                maxWidth: 300,
            },
            {
                headerName: 'Counterparty',
                field: 'counterparty',
                width: 300,
                maxWidth: 300,
            },
        ];
    }

    getTemplateswithTags() {
        this.getContractAdviceTemplatesByTagsObservable = this.documentService.getContractAdviceTemplatesByTags(this.tagsFromTrade);
        this.getContractAdviceTemplatesByTagsObservable.subscribe((data) => {
            this.getTemplateManagementObservable = this.documentService.getTemplateManagement();
            this.getTemplateManagementObservable.subscribe((dataTemplate) => {
                const templateLines = data.map((l) => {
                    return dataTemplate.find((bestMatch) => l.entityId === bestMatch.entityId);
                });

                this.mapToListValues(templateLines);
            });
        });
    }

    mapToListValues(templateLines: TemplateManagement[]) {
        this.tableRows = templateLines.map((response) => this.mapTemplateToTable(response));
        if (this.tableRows && this.tableRows.length === 1) {
            this.tableRows[0].selected = true;
        }
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
            const property = this.lowerCaseFirstFLetter(tableName);
            const value = this.searchValueIntoData(tableName, tag.tagValueId);
            if (!line[property]) {
                line[property] = '';
            }
            line[property] += value + ',';
        });
        return line;
    }

    lowerCaseFirstFLetter(variableName: string): string {
        return variableName.charAt(0).toLowerCase() + variableName.slice(1);
    }

    searchValueIntoData(table: string, idToSearch: any): any {
        let value: any;
        switch (table) {
            case 'ProfitCenter':
                value = this.masterdata.profitCenters.find((a) => a.profitCenterId.toString() === idToSearch).companyCode;
                break;

            case 'Commodity':
                value = this.masterdata.commodities.find((a) => a.commodityType === idToSearch).principalCommodity;
                break;

            case 'Department':
                value = this.masterdata.departments.find((a) => a.departmentId.toString() === idToSearch).departmentCode;
                break;

            case 'ContractType':
                value = this.masterdata.contractTypes.find((a) => a.enumEntityId.toString() === idToSearch).enumEntityValue;
                break;

            case 'ArbitrationCode':
                value = this.masterdata.arbitrations.find((a) => a.arbitrationId.toString() === idToSearch).arbitrationCode;

                break;
            case 'ContractTerms':
                value = this.masterdata.contractTerms.find((a) => a.contractTermId.toString() === idToSearch).contractTermCode;
                break;

            case 'PaymentTerms':
                value = this.masterdata.paymentTerms.find((a) => a.paymentTermsId.toString() === idToSearch).paymentTermCode;
                break;

            case 'Counterparty':
                value = this.masterdata.counterparties.find((a) => a.counterpartyID.toString() === idToSearch).counterpartyCode;
                break;

            default:
                break;

        }
        return value;
    }

    loadTemplatesGrid() {

    }
}
