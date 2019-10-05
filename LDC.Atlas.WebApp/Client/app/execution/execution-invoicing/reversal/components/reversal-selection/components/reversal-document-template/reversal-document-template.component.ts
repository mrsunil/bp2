import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { InvoiceSourceType } from '../../../../../../../shared/enums/invoice-source-type.enum';
import { FormConfigurationProviderService } from '../../../../../../../shared/services/form-configuration-provider.service';
import { DocumentService } from '../../../../../../../shared/services/http-services/document.service';
import { ExecutionService } from '../../../../../../../shared/services/http-services/execution.service';
import { UtilService } from '../../../../../../../shared/services/util.service';
import { DocumentTemplateComponent } from '../../../../../components/document-template/document-template.component';

@Component({
    selector: 'atlas-reversal-document-template',
    templateUrl: './reversal-document-template.component.html',
    styleUrls: ['./reversal-document-template.component.scss'],
})
export class ReversalDocumentTemplateComponent extends DocumentTemplateComponent implements OnInit {

    constructor(protected formBuilder: FormBuilder,
        protected route: ActivatedRoute,
        protected documentService: DocumentService,
        protected utilService: UtilService,
        protected executionService: ExecutionService,
        protected formConfigurationProvider: FormConfigurationProviderService) {
        super(formBuilder,
            route,
            documentService,
            utilService,
            executionService,
            formConfigurationProvider);
    }

    getData() {
        this.invoiceExtInHouseCtrl.patchValue(InvoiceSourceType[InvoiceSourceType.Inhouse]);
    }
}
