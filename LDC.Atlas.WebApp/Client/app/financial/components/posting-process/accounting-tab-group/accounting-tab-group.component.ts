import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthorizationService } from '../../../../core/services/authorization.service';
import { CompanyManagerService } from '../../../../core/services/company-manager.service';
import { GenericReportViewerComponent } from '../../../../shared/components/generic-report-viewer/generic-report-viewer.component';
import { PhysicalDocumentTemplate } from '../../../../shared/entities/document-template.entity';
import { DocumentService } from '../../../../shared/services/http-services/document.service';
import { SecurityService } from '../../../../shared/services/security.service';
@Component({
    selector: 'atlas-accounting-tab-group',
    templateUrl: './accounting-tab-group.component.html',
    styleUrls: ['./accounting-tab-group.component.scss'],
})
export class AccountingTabGroupComponent implements OnInit {
    editAccOrJournalDocumentPrivilege: boolean = true;
    editDocumentPrivilege: boolean = true;
    reverseDocumentPrivilege: boolean = true;
    documentActionsPrivilege: boolean = true;
    filteredTemplates: PhysicalDocumentTemplate[] = new Array<PhysicalDocumentTemplate>();
    routeLinks = [
        {
            label: 'Document Actions',
            index: 0,
            privilege: 'Financials.AccountingEntries',
            routeLinksChildren: [
                {
                    label: 'Create a document',
                    link: '/' + this.companyManager.getCurrentCompanyId() + '/financial/accounting/entry/new',
                    index: 0,
                    privilege: 'Financials.AccountingEntries.CreateEditDocument',
                },
                {
                    label: 'Edit a document',
                    link: '/' + this.companyManager.getCurrentCompanyId() + '/financial/edit/document/summary',
                    index: 1,
                    privilege: 'Financials.AccountingEntries.EditAccountingEntries',
                },
                {
                    label: 'Reverse document',
                    link: '/' + this.companyManager.getCurrentCompanyId() + '/financial/reverse/document',
                    index: 2,
                    privilege: 'Financials.AccountingEntries.ReverseDocument',
                },

            ],
        },
        {
            label: 'Create / Delete Match',
            link: '/' + this.companyManager.getCurrentCompanyId() + '/financial/create/matching',
            index: 1,
            privilege: 'Financials.AccountingEntries.CreateDeleteMatchFlag',
        },
        {
            label: 'Posting Management',
            link: '/' + this.companyManager.getCurrentCompanyId() + '/financial/posting/management',
            index: 2,
            privilege: 'Financials.POSTINGMGT',
        },
        {
            label: 'Interface Errors',
            link: '/' + this.companyManager.getCurrentCompanyId() + '/financial/accounting/errormanagement/',
            index: 3,
            privilege: 'Financials.InterfaceErrors',
        },
    ];
    activeLinkIndex = -1;
    company: string;

    constructor(private router: Router,
        private companyManager: CompanyManagerService,
        private authorizationService: AuthorizationService,
        protected securityService: SecurityService,
        private route: ActivatedRoute,
        protected dialog: MatDialog,
        protected documentService: DocumentService) {
        this.activeLinkIndex = this.routeLinks.indexOf(this.routeLinks.find((tab) => this.router.url.includes(tab.link)));
    }

    ngOnInit() {

        this.company = this.route.snapshot.paramMap.get('company');
        const documentType = 76;
        this.documentService.getTemplates(documentType, 'AccountingEntries').subscribe((templates) => {
            this.filteredTemplates = templates.value;
        });
        this.securityService.isSecurityReady().subscribe(() => {

            if (this.authorizationService.isPrivilegeAllowed(this.company, 'Financials')
                && this.authorizationService.isPrivilegeAllowed(this.company, 'AccountingEntries')) {
                this.editAccOrJournalDocumentPrivilege = this.authorizationService.isPrivilegeAllowed(this.company, 'CreateEditDocument');
                this.editDocumentPrivilege = this.authorizationService.isPrivilegeAllowed(this.company, 'EditAccountingEntries');
                this.reverseDocumentPrivilege = this.authorizationService.isPrivilegeAllowed(this.company, 'ReverseDocument');
                this.documentActionsPrivilege = (this.editAccOrJournalDocumentPrivilege
                    || this.editDocumentPrivilege || this.reverseDocumentPrivilege);
            }
        });
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

    isActive(routeLink: any) {
        return this.activeLinkIndex === routeLink.index;
    }

}
