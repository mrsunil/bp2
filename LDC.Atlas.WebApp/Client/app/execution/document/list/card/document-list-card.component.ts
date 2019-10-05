import { HttpResponse } from '@angular/common/http';
import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as agGrid from 'ag-grid-community';
import { Subscription } from 'rxjs';
import { AgContextualMenuAction } from '../../../../shared/entities/ag-contextual-menu-action.entity';
import { PhysicalDocument } from '../../../../shared/entities/document-generated.entity';
import { WINDOW } from '../../../../shared/entities/window-injection-token';
import { AgGridService } from '../../../../shared/services/ag-grid.service';
import { UtilService } from '../../../../shared/services/util.service';
import { AtlasAgGridParam } from './../../../../shared/entities/atlas-ag-grid-param.entity';
import { DocumentService } from './../../../../shared/services/http-services/document.service';
import { SecurityService } from './../../../../shared/services/security.service';
import { UiService } from './../../../../shared/services/ui.service';
import { ListAndSearchFilter } from './../../../../shared/entities/list-and-search/list-and-search-filter.entity';
import { ListAndSearchComponent } from './../../../../shared/components/list-and-search/list-and-search.component';
import { TradeDocumentDataLoader } from './../../../../shared/services/list-and-search/trade-document-data-loader';

@Component({
    selector: 'atlas-document-list-card',
    templateUrl: './document-list-card.component.html',
    styleUrls: ['./document-list-card.component.scss'],
    providers: [TradeDocumentDataLoader],
})
export class DocumentListCardComponent implements OnInit, OnDestroy {
    @ViewChild('listAndSearchComponent') listAndSearchComponent: ListAndSearchComponent;
    documentMenuActions: { [key: string]: string } = {
        downloadDocument: 'download',
    };

    documentsCreated: PhysicalDocument[] = [];
    recordId: number;
    gridCode = 'physicalDocumentList';
    additionalFilters: ListAndSearchFilter[] = [];

    documentGridContextualMenuActions: AgContextualMenuAction[];
    documentGridOptions: agGrid.GridOptions = {};
    documentGridCols: agGrid.ColDef[];
    documentGridRows: PhysicalDocument[] = [];
    gridApi: agGrid.GridApi;
    gridColumnApi: agGrid.ColumnApi;
    atlasAgGridParam: AtlasAgGridParam;

    subscription: Subscription[] = [];
    company: string;

    constructor(private securityService: SecurityService,
        private documentService: DocumentService,
        private route: ActivatedRoute,
        protected uiService: UiService,
        private utilService: UtilService,
        public dataLoader: TradeDocumentDataLoader,
        @Inject(WINDOW) protected window: Window,
    ) { }

    ngOnInit() {
        this.company = this.route.snapshot.paramMap.get('company');
    }

    ngOnDestroy() {
        this.subscription.forEach((sub) => {
            if (sub) {
                sub.unsubscribe();
            }
        });
    }


    init() {
        this.documentGridContextualMenuActions = [
            {
                icon: '',
                text: 'Download',
                action: this.documentMenuActions.downloadDocument,
            },
        ];
    }


    handleAction(action: string, document: PhysicalDocument) {
        switch (action) {
            case this.documentMenuActions.downloadDocument:
                this.subscription.push(this.documentService.getGeneratedDocumentContent(document.physicalDocumentId)
                    .subscribe((response: HttpResponse<Blob>) => {
                        this.openGeneratedDocument(response);
                    }));
                break;
            default: // throw Action not recognized exception
                break;
        }
    }

    openGeneratedDocument(response: HttpResponse<Blob>) {
        const newBlob = new Blob([response.body],
            { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
        const data = this.window.URL.createObjectURL(newBlob);
        const link = document.createElement('a');
        link.href = data;
        link.download = this.utilService.getFileNameFromContentDisposition(response);
        link.click();
    }

    cancel() {
        this.documentGridRows.forEach((d) => d.isSelected = false);
    }

    versionNumberFormatter(param) {
        return param.value.toString().padStart(3, '0');
    }

}
