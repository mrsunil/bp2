import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AtlasFormControl } from '../../../../../../../shared/entities/atlas-form-control';
import { PhysicalDocumentTemplate } from '../../../../../../../shared/entities/document-template.entity';
import { CostDirections } from '../../../../../../../shared/enums/cost-direction.enum';
import { DocumentTypes } from '../../../../../../../shared/enums/document-type.enum';
import { InvoiceSourceType } from '../../../../../../../shared/enums/invoice-source-type.enum';
import { TransactionDocumentTypes } from '../../../../../../../shared/enums/transaction-document-type.enum';
import { InvoiceRecord } from '../../../../../../../shared/services/execution/dtos/invoice-record';
import { FormConfigurationProviderService } from '../../../../../../../shared/services/form-configuration-provider.service';
import { DocumentService } from '../../../../../../../shared/services/http-services/document.service';
import { ExecutionService } from '../../../../../../../shared/services/http-services/execution.service';
import { UtilService } from '../../../../../../../shared/services/util.service';
import { DocumentTemplateBaseComponent } from '../../../../../invoicing-base-form/document-template-base/document-template-base.component';

@Component({
    selector: 'atlas-cost-document-template',
    templateUrl: './cost-document-template.component.html',
    styleUrls: ['./cost-document-template.component.scss'],
})
export class CostDocumentTemplateComponent extends DocumentTemplateBaseComponent implements OnInit {
    docTypeCtrl = new AtlasFormControl('DocType');
    transactionDocumentType: string[];
    costDirections: CostDirections;
    constructor(protected formBuilder: FormBuilder,
        protected documentService: DocumentService,
        protected utilService: UtilService,
        protected executionService: ExecutionService,
        protected formConfigurationProvider: FormConfigurationProviderService) {
        super(executionService, formConfigurationProvider);
    }

    ngOnInit() {
        this.subscriptions.push(this.documentService.
            getTemplates(DocumentTypes.InvoiceCostsInvoice)
            .subscribe((templates) => {
                this.filteredTemplates = templates.value;
                this.invoiceTemplatesCtrl.valueChanges.subscribe((input) => {
                    this.filteredTemplates =
                        this.utilService.filterListforAutocomplete(input,
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
        this.transactionDocumentType = this.getTransactionDocumentTypeEnum();
        this.getData();
        this.docTypeCtrl.patchValue(TransactionDocumentTypes['PI/SI']);
    }
    getFormGroup() {
        this.formGroup = this.formBuilder.group({
            invoiceExtInHouseCtrl: this.invoiceExtInHouseCtrl,
            invoiceExtRefCtrl: this.invoiceExtRefCtrl,
            documentTemplateCtrl: this.invoiceTemplatesCtrl,
            docTypeCtrl: this.docTypeCtrl,
        });
        return super.getFormGroup();
    }

    getData() {
        if (this.costDirections === CostDirections.Payable) {
            this.invoiceExtInHouseCtrl.patchValue(InvoiceSourceType[InvoiceSourceType.External]);
        } else if (this.costDirections === CostDirections.Receivable) {
            this.invoiceExtInHouseCtrl.patchValue(InvoiceSourceType[InvoiceSourceType.Inhouse]);
        }
    }

    getTransactionDocumentTypeEnum(): string[] {
        const transactionDocumentTypeEnum = [];
        const objectEnum = Object.keys(TransactionDocumentTypes);
        const values = objectEnum.slice(0, objectEnum.length / 2);
        const keys = objectEnum.slice(objectEnum.length / 2);

        for (let i = 0; i < objectEnum.length / 2; i++) {
            if (Number(values[i]) !== TransactionDocumentTypes.Original) {
                transactionDocumentTypeEnum.push({ viewValue: keys[i], value: Number(values[i]) });
            }
        }
        return transactionDocumentTypeEnum;
    }

    populateEntity(entity: InvoiceRecord): InvoiceRecord {
        const invoiceDocumentTemplate = entity;
        invoiceDocumentTemplate.template = this.invoiceTemplatesCtrl.value ?
            (this.invoiceTemplatesCtrl.value as PhysicalDocumentTemplate).path : null;
        invoiceDocumentTemplate.externalInhouse = this.invoiceExtInHouseCtrl.value;
        invoiceDocumentTemplate.externalInvoiceRef = this.invoiceExtRefCtrl.value;
        invoiceDocumentTemplate.documentType = this.docTypeCtrl.value;
        return invoiceDocumentTemplate;
    }
}
