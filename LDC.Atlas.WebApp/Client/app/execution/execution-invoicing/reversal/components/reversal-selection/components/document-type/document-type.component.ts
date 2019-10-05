import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import * as _moment from 'moment';
import { Moment } from 'moment';
import { BaseFormComponent } from '../../../../../../../shared/components/base-form-component/base-form-component.component';
import { AtlasFormControl } from '../../../../../../../shared/entities/atlas-form-control';
import { PhysicalDocumentType } from '../../../../../../../shared/entities/document-type.entity';
import { TransactionDocumentTypes } from '../../../../../../../shared/enums/transaction-document-type.enum';
import { InvoiceRecord } from '../../../../../../../shared/services/execution/dtos/invoice-record';
import { FormConfigurationProviderService } from '../../../../../../../shared/services/form-configuration-provider.service';
import { MasterdataService } from '../../../../../../../shared/services/http-services/masterdata.service';
import { UtilService } from '../../../../../../../shared/services/util.service';
import { documentDateValidation } from '../../../../../../../shared/validators/date-validators.validator';
const moment = _moment;

@Component({
    selector: 'atlas-document-type',
    templateUrl: './document-type.component.html',
    styleUrls: ['./document-type.component.scss'],
})
export class DocumentTypeComponent extends BaseFormComponent implements OnInit {

    documentDateCtrl = new AtlasFormControl('reversalDocumentDate', '', Validators.required);
    documentTypeCtrl = new AtlasFormControl('reversalDocumentType');

    masterDataDocumentType: PhysicalDocumentType[];
    documentDate: Moment;

    constructor(protected formBuilder: FormBuilder,
        protected masterdataService: MasterdataService,
        protected utilService: UtilService,
        protected route: ActivatedRoute,
        protected formConfigurationProvider: FormConfigurationProviderService) {
        super(formConfigurationProvider);
    }

    ngOnInit() {
        this.masterDataDocumentType = [
            {
                physicalDocumentTypeId: TransactionDocumentTypes.Original,
                physicalDocumentTypeLabel: TransactionDocumentTypes[TransactionDocumentTypes.Original],
            },
            {
                physicalDocumentTypeId: TransactionDocumentTypes['CN/DN'],
                physicalDocumentTypeLabel: TransactionDocumentTypes[TransactionDocumentTypes['CN/DN']],
            },
        ];
    }

    getFormGroup() {
        this.formGroup = this.formBuilder.group({
            documentDateCtrl: this.documentDateCtrl,
            documentTypeCtrl: this.documentTypeCtrl,
        });
        return super.getFormGroup();
    }

    documentDateSelected(documentDate: Date) {
        if (!documentDate) {
            this.documentDateCtrl.patchValue('');
            this.documentDateCtrl.clearValidators();
        } else {
            this.documentDate = moment(documentDate);
            this.documentDateCtrl.patchValue(documentDate);
        }
    }
    rowSelected(rowSelection: boolean) {
        if (!rowSelection) {
            this.documentTypeCtrl.patchValue('');
        } else {
            this.documentTypeCtrl.patchValue(TransactionDocumentTypes.Original);
            this.documentTypeCtrl.updateValueAndValidity();
        }
    }
    onDocumentDateSelected() {
        const invoiceDate = new Date(this.documentDateCtrl.value);
        this.documentDateCtrl.clearValidators();
        this.documentDateCtrl.setValidators(
            Validators.compose([Validators.required, documentDateValidation(invoiceDate, this.documentDate)]));
        this.documentDateCtrl.updateValueAndValidity();
    }

    populateEntity(entity: InvoiceRecord): InvoiceRecord {
        const invoiceDetails = entity as InvoiceRecord;
        invoiceDetails.documentType = this.documentTypeCtrl.value;
        invoiceDetails.invoiceDate = this.documentDateCtrl.value;
        return invoiceDetails;
    }
}
