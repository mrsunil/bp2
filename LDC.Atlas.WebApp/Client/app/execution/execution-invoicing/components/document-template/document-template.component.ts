import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PhysicalDocumentTemplate } from '../../../../shared/entities/document-template.entity';
import { DocumentTypes } from '../../../../shared/enums/document-type.enum';
import { InvoiceSourceType } from '../../../../shared/enums/invoice-source-type.enum';
import { InvoiceTypes } from '../../../../shared/enums/invoice-type.enum';
import { InvoiceRecord } from '../../../../shared/services/execution/dtos/invoice-record';
import { DocumentService } from '../../../../shared/services/http-services/document.service';
import { UtilService } from '../../../../shared/services/util.service';
import { DocumentTemplateBaseComponent } from '../../invoicing-base-form/document-template-base/document-template-base.component';
import { FormConfigurationProviderService } from './../../../../shared/services/form-configuration-provider.service';
import { ExecutionService } from './../../../../shared/services/http-services/execution.service';

@Component({
    selector: 'atlas-document-template',
    templateUrl: './document-template.component.html',
    styleUrls: ['./document-template.component.scss'],
})
export class DocumentTemplateComponent extends DocumentTemplateBaseComponent implements OnInit {
    @Input() documentType: DocumentTypes;

    constructor(protected formBuilder: FormBuilder,
        protected route: ActivatedRoute,
        protected documentService: DocumentService,
        protected utilService: UtilService,
        protected executionService: ExecutionService,
        protected formConfigurationProvider: FormConfigurationProviderService) {
        super(executionService, formConfigurationProvider);
    }

    ngOnInit() {
        this.subscriptions.push(this.documentService.getTemplates(this.documentType).subscribe((templates) => {
            this.filteredTemplates = templates.value;
            this.invoiceTemplatesCtrl.valueChanges.subscribe((input) => {
                this.filteredTemplates =
                    this.utilService.filterListforAutocomplete(
                        input,
                        templates.value,
                        ['documentTemplateId', 'name']);

            });
            this.setValidators();
            this.onExternalInHouseSelected();
            this.bindConfiguration();
            if ((this.filteredTemplates.length === 1) &&
                (this.invoiceExtInHouseCtrl.value === (InvoiceSourceType[InvoiceSourceType.Inhouse]))) {
                this.invoiceTemplatesCtrl.patchValue(this.filteredTemplates[0]);
                this.onInvoiceTemplateSelected();
            }

        }));
        this.onChanges();
        this.invoiceSourceType = this.getInvoiceSourceTypeEnum();
        this.getData();
    }

    getFormGroup() {
        this.formGroup = this.formBuilder.group({
            invoiceTemplatesCtrl: this.invoiceTemplatesCtrl,
            invoiceExtRefCtrl: this.invoiceExtRefCtrl,
            invoiceExtInHouseCtrl: this.invoiceExtInHouseCtrl,
        });
        return super.getFormGroup();
    }

    populateEntity(entity: InvoiceRecord): InvoiceRecord {
        const invoiceDocumentTemplate = entity as InvoiceRecord;
        invoiceDocumentTemplate.template = this.invoiceTemplatesCtrl.value ?
            (this.invoiceTemplatesCtrl.value as PhysicalDocumentTemplate).path : null;
        invoiceDocumentTemplate.externalInhouse = this.invoiceExtInHouseCtrl.value;
        invoiceDocumentTemplate.externalInvoiceRef = this.invoiceExtRefCtrl.value;
        return invoiceDocumentTemplate;
    }

    getData() {
        const invoiceTypeId = Number(decodeURIComponent(this.route.snapshot.paramMap.get('invoiceTypeId')));
        this.updateInhouseExternalStatus(invoiceTypeId);
    }
}
