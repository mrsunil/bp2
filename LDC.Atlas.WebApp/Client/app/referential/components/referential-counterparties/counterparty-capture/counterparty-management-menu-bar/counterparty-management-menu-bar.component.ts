import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { CompanyManagerService } from '../../../../../core/services/company-manager.service';
import { GenericReportViewerComponent } from '../../../../../shared/components/generic-report-viewer/generic-report-viewer.component';
import { PhysicalDocumentTemplate } from '../../../../../shared/entities/document-template.entity';
import { DocumentService } from '../../../../../shared/services/http-services/document.service';

@Component({
    selector: 'atlas-counterparty-management-menu-bar',
    templateUrl: './counterparty-management-menu-bar.component.html',
    styleUrls: ['./counterparty-management-menu-bar.component.scss'],
})
export class CounterpartyManagementMenuBarComponent implements OnInit {

    isEditCounterpartyPrivilege: boolean = false;
    counterpartyID: number;
    @Input() isCreateMode: boolean = false;
    @Input() isViewMode: boolean = false;
    @Output() readonly localViewMode = new EventEmitter();
    @Output() readonly saveMethod = new EventEmitter();
    isAdmin: boolean = false;
    selectedCounterpartyDisplayVal: boolean = true;
    filteredTemplates: PhysicalDocumentTemplate[] = new Array<PhysicalDocumentTemplate>();

    constructor(private route: ActivatedRoute, private router: Router,
        private companyManager: CompanyManagerService,
        protected documentService: DocumentService,
        protected dialog: MatDialog) { }

    ngOnInit() {
        this.counterpartyID = Number(this.route.snapshot.paramMap.get('counterpartyID'));
        const documentType = 76;
        this.documentService.getTemplates(documentType, 'Counterparties').subscribe((templates) => {
            this.filteredTemplates = templates.value;
        });
    }

    onEditCounterPartyButtonClicked() {
        this.router.navigate(['/' + this.companyManager.getCurrentCompanyId() + '/referential/counterparty/edit', this.counterpartyID]);
    }

    onDiscardButtonClicked() {
        this.router.navigate(['/' + this.companyManager.getCurrentCompanyId() + '/referential/counterparty/display', this.counterpartyID]);
    }

    onSaveCounterPartyButtonClicked() {
        this.saveMethod.emit(true);
    }

    OnReportClick(data: any) {

        const openTradepnlReportDialog = this.dialog.open(GenericReportViewerComponent, {
            data:
            {
                reportName: data.name,
                reportPath: data.path,
            },
            width: '90%',
            height: '90%',
        });

    }

    onViewModeChanged(event: any) {
        if (!this.isAdmin) {
            this.localViewMode.emit(event);
        }
    }
}
