import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { CompanyManagerService } from '../../../core/services/company-manager.service';
import { GenericReportViewerComponent } from '../../../shared/components/generic-report-viewer/generic-report-viewer.component';
import { PhysicalDocumentTemplate } from '../../../shared/entities/document-template.entity';
import { DocumentService } from '../../../shared/services/http-services/document.service';

@Component({
    selector: 'atlas-admin-stepper',
    templateUrl: './stepper.component.html',
    styleUrls: ['./stepper.component.scss'],
})
export class StepperComponent implements OnInit {
    routeLinks = [
        {
            label: 'USER MANAGEMENT',
            link: '/' + this.companyManager.getCurrentCompanyId() + '/admin/users',
            index: 0,
            privilege: 'Administration.Users',
        },
        {
            label: 'PROFILE MANAGEMENT',
            link: '/' + this.companyManager.getCurrentCompanyId() + '/admin/profiles',
            index: 1,
            privilege: 'Administration.Profiles',
        },
    ];
    activeLinkIndex = -1;
    @Input() hasAddButton: boolean = false;
    @Input() buttonText: string = '';
    @Output() readonly buttonClicked = new EventEmitter<void>();
    company: string;
    filteredTemplates: PhysicalDocumentTemplate[] = new Array<PhysicalDocumentTemplate>();

    constructor(private router: Router, private companyManager: CompanyManagerService, private route: ActivatedRoute,
        protected dialog: MatDialog,
        protected documentService: DocumentService) {
        this.activeLinkIndex = this.routeLinks.indexOf(this.routeLinks.find((tab) => this.router.url.includes(tab.link)));
    }

    ngOnInit() {
        this.company = this.route.snapshot.paramMap.get('company');
        const documentType = 76;
        this.documentService.getTemplates(documentType, 'Users').subscribe((templates) => {
            this.filteredTemplates = templates.value;
        });
    }

    isActive(routeLink: any) {
        return this.activeLinkIndex === routeLink.index;
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
    onAddButtonClicked(): void {
        this.buttonClicked.emit();
    }
}
