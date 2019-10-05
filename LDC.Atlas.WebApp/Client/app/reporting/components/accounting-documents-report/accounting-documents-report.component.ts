import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { environment } from '../../../../environments/environment';
import { CompanyManagerService } from '../../../core/services/company-manager.service';
import { SSRSReportViewerComponent } from '../../../shared/components/ssrs-report-viewer/ssrsreport-viewer.component';
import { isBeforeDate } from '../../../shared/validators/date-validators.validator';
import { DocumentStatusDropdownComponent } from './components/document-status-dropdown/document-status-dropdown.component';
import { DocumentTypeDropdownComponent } from './components/document-type-dropdown/document-type-dropdown.component';

@Component({
    selector: 'atlas-accounting-documents-report',
    templateUrl: './accounting-documents-report.component.html',
    styleUrls: ['./accounting-documents-report.component.scss'],
})
export class AccountingDocumentsReportComponent implements OnInit {
    @ViewChild('ssrsReportViewer') ssrsReportViewer: SSRSReportViewerComponent;
    @ViewChild(DocumentTypeDropdownComponent) DocumentTypeDropdownComponent: 'DocumentTypeDropdownComponent';
    @ViewChild(DocumentStatusDropdownComponent) DocumentStatusDropdownComponent: 'DocumentStatusDropdownComponent';
    showDetails: boolean = true;
    reportFormGroup: FormGroup;
    enteredDateFromCtrl: FormControl;
    enteredDateToCtrl: FormControl;
    amendedDateFromCtrl: FormControl;
    amendeddDateToCtrl: FormControl;
    dateErrorMap: Map<string, string> = new Map();
    now: moment.Moment;
    reportServerUrl = environment.reportServerLink;
    reportPath = 'LDC Atlas/Accounting Documents/AccountingDocument';
    parameters: any[] = [];
    docTypeSelected: string[];
    docStatusselected: string[];
    company: string;
    showParameters: boolean = true;

    constructor(private formBuilder: FormBuilder,
        private companyManager: CompanyManagerService,
        private route: ActivatedRoute,
    ) {
        this.company = this.route.snapshot.paramMap.get('company');
        this.now = this.companyManager.getCurrentCompanyDate();
        this.dateErrorMap
            .set('isDateValid', 'The date cannot be in the future.');
    }

    ngOnInit() {
        this.initForm();
    }
    initForm() {
        this.initControls();
        this.reportFormGroup = this.formBuilder.group({
            amendedDateFromCtrl: this.amendedDateFromCtrl,
            amendeddDateToCtrl: this.amendeddDateToCtrl,
            enteredDateFromCtrl: this.enteredDateFromCtrl,
            enteredDateToCtrl: this.enteredDateToCtrl,
            DocumentStatusDropdownComponent: this.DocumentStatusDropdownComponent,
            DocumentTypeDropdownComponent: this.DocumentTypeDropdownComponent,
        });

    }

    initControls() {
        this.enteredDateFromCtrl = new FormControl(null, [isBeforeDate(this.companyManager.getCurrentCompanyDate(), true)]);
        this.enteredDateToCtrl = new FormControl(null, [isBeforeDate(this.companyManager.getCurrentCompanyDate(), true)]);
        this.amendedDateFromCtrl = new FormControl(null, [isBeforeDate(this.companyManager.getCurrentCompanyDate(), true)]);
        this.amendeddDateToCtrl = new FormControl(null, [isBeforeDate(this.companyManager.getCurrentCompanyDate(), true)]);

    }
    onGenerateReportButtonClicked() {
        if (this.reportFormGroup.valid) {
            if (this.docStatusselected.length === 1 && this.docStatusselected[0] === 'Posted(Today)') {
                this.initControls();
            }

            this.parameters = [];
            this.parameters = this.parameters.concat(
                this.getBasicParameters(),
            );
            this.ssrsReportViewer.generateReport(this.reportServerUrl, this.reportPath, this.parameters);
        }
    }
    getBasicParameters(): any[] {
        const docType = this.docTypeSelected;
        const docstatus = this.docStatusselected;
        const parameters: any[] = [
            { name: 'CompanyID', value: this.company },
        ];
        if ((this.docTypeSelected[0] !== 'All')) {
            this.docTypeSelected.forEach((type: string) => {
                parameters.push({ name: 'DocumentTypes', value: type });
            });
        }
        if ((this.docStatusselected[0] !== 'All')) {
            this.docStatusselected.forEach((status: string) => {
                parameters.push({ name: 'DocumentStatus', value: status });
            });
        }
        parameters.push({ name: 'ShowDetails', value: (this.showDetails === true ? 1 : 0) });

        if (this.enteredDateFromCtrl.valid && this.enteredDateFromCtrl.value) {
            const enteredFrom = (this.enteredDateFromCtrl.value as moment.Moment).format('YYYY-MM-DD');
            parameters.push({ name: 'DocumentsEnteredBetweenFrom', value: enteredFrom });
        }

        if (this.enteredDateToCtrl.valid && this.enteredDateToCtrl.value) {
            const enteredTo = (this.enteredDateToCtrl.value as moment.Moment).format('YYYY-MM-DD');
            parameters.push({ name: 'DocumentsEnteredBetweenTo', value: enteredTo });
        }

        if (this.amendedDateFromCtrl.valid && this.amendedDateFromCtrl.value) {
            const amendedFrom = (this.amendedDateFromCtrl.value as moment.Moment).format('YYYY-MM-DD');
            parameters.push({ name: 'DocumentsAmendedBetweenFrom', value: amendedFrom });
        }

        if (this.amendeddDateToCtrl.valid && this.amendeddDateToCtrl.value) {
            const amendeddTo = (this.amendeddDateToCtrl.value as moment.Moment).format('YYYY-MM-DD');
            parameters.push({ name: 'DocumentsAmendedBetweenTo', value: amendeddTo });
        }
        parameters.push({ name: 'isAllDocumentTypesSelected', value: (this.docTypeSelected[0] === 'All') ? 1 : 0 });

        parameters.push({ name: 'isAllDocumentStatusSelected', value: (this.docStatusselected[0] === 'All') ? 1 : 0 });

        return parameters;
    }

    onDocumentTypeSelectionChanged(docType: string[]) {

        this.docTypeSelected = docType;
    }
    onDocumentStatusSelectionChanged(docStatus: string[]) {
        this.docStatusselected = docStatus;
        if (this.docStatusselected.length === 1 && this.docStatusselected[0] === 'Posted(Today)') {
            this.initControls();
        }

    }
    onShowDetailsChanged(event: MatCheckboxChange) {
        this.showDetails = event.checked;
    }
}
