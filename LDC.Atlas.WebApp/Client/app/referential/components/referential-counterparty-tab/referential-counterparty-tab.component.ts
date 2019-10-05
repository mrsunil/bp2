import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CompanyManagerService } from '../../../core/services/company-manager.service';
import { SecurityService } from '../../../shared/services/security.service';
import { AuthorizationService } from '../../../core/services/authorization.service';
import { PermissionLevels } from '../../../shared/enums/permission-level.enum';
import { DocumentService } from '../../../shared/services/http-services/document.service';
import { PhysicalDocumentTemplate } from '../../../shared/entities/document-template.entity';
import { GenericReportViewerComponent } from '../../../shared/components/generic-report-viewer/generic-report-viewer.component';
import { MatDialog } from '@angular/material';

@Component({
    selector: 'atlas-referential-counterparty-tab',
    templateUrl: './referential-counterparty-tab.component.html',
    styleUrls: ['./referential-counterparty-tab.component.scss']
})
export class ReferentialCounterpartyTabComponent implements OnInit {

    selectedCounterpartyDisplayVal: string;
    company: string;
    isEditCounterpartyPrivilege: boolean = false;
    @Output() readonly localViewMode = new EventEmitter();
    filteredTemplates: PhysicalDocumentTemplate[] = new Array<PhysicalDocumentTemplate>();


    constructor(private route: ActivatedRoute, private router: Router,
        protected securityService: SecurityService, private authorizationService: AuthorizationService,
        private companyManager: CompanyManagerService, protected documentService: DocumentService,
        protected dialog: MatDialog, ) {
    }

    ngOnInit() {
        this.company = this.route.snapshot.paramMap.get('company');
        this.selectedCounterpartyDisplayVal = 'Global view Mode';

        this.securityService.isSecurityReady().subscribe(() => {

            if (this.authorizationService.isPrivilegeAllowed(this.company, 'Referential')) {

                let permissionLevel: number;
                permissionLevel = this.authorizationService.getPermissionLevel(this.company, 'TradingAndExecution', 'Referential');
                if (permissionLevel == PermissionLevels.ReadWrite) {
                    this.isEditCounterpartyPrivilege = this.authorizationService.isPrivilegeAllowed(this.company, 'TradingAndExecution');
                }
            }
        });
        const documentType = 76;
        this.documentService.getTemplates(documentType, 'Counterparties').subscribe((templates) => {
            this.filteredTemplates = templates.value;
        });

    }
    onCreateCounterpartyButtonClicked() {
        this.router.navigate(['/' + this.companyManager.getCurrentCompanyId() + '/referential/counterparty/capture']);
    }
    onCreateBulkCounterpartyButtonClicked() {
        this.router.navigate([this.company + '/referential/tradeexecution/counterparties/bulkamendment']);
    }

    onSelectModeChanged(event: any) {
        this.localViewMode.emit(event);

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


}
