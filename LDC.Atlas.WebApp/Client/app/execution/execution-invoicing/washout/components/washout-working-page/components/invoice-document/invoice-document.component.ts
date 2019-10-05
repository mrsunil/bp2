import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import * as _moment from 'moment';
import { CompanyManagerService } from '../../../../../../../core/services/company-manager.service';
import { AtlasFormControl } from '../../../../../../../shared/entities/atlas-form-control';
import { PhysicalDocumentTemplate } from '../../../../../../../shared/entities/document-template.entity';
import { ContractTypes } from '../../../../../../../shared/enums/contract-type.enum';
import { DocumentTypes } from '../../../../../../../shared/enums/document-type.enum';
import { InvoiceSourceType } from '../../../../../../../shared/enums/invoice-source-type.enum';
import { ContractsToWashoutInvoice } from '../../../../../../../shared/services/execution/dtos/contracts-to-washout-invoice';
import { InvoiceRecord } from '../../../../../../../shared/services/execution/dtos/invoice-record';
import { FormConfigurationProviderService } from '../../../../../../../shared/services/form-configuration-provider.service';
import { DocumentService } from '../../../../../../../shared/services/http-services/document.service';
import { ExecutionService } from '../../../../../../../shared/services/http-services/execution.service';
import { UtilService } from '../../../../../../../shared/services/util.service';
import { agreementDateValidation } from '../../../../../../../shared/validators/date-validators.validator';
import { DocumentTemplateBaseComponent } from '../../../../../../execution-invoicing/invoicing-base-form/document-template-base/document-template-base.component';

const moment = _moment;
@Component({
    selector: 'atlas-invoice-document',
    templateUrl: './invoice-document.component.html',
    styleUrls: ['./invoice-document.component.scss'],
})
export class InvoiceDocumentComponent extends DocumentTemplateBaseComponent implements OnInit {
    washoutAgreementDateCtrl = new AtlasFormControl('washoutAgreementDateCtrl');
    contractsToWashoutInvoice: ContractsToWashoutInvoice;
    isDateAfterValid: boolean;
    blDateTrade: Date;

    constructor(protected formBuilder: FormBuilder,
        protected documentService: DocumentService,
        protected executionService: ExecutionService,
        protected utilService: UtilService,
        protected companyManager: CompanyManagerService,
        protected formConfigurationProvider: FormConfigurationProviderService) {
        super(executionService, formConfigurationProvider);
    }

    ngOnInit() {
        this.subscriptions.push(this.documentService.getTemplates(DocumentTypes.InvoiceWashout).subscribe((templates) => {
            this.filteredTemplates = templates.value;
            this.invoiceTemplatesCtrl.valueChanges.subscribe((input) => {
                this.filteredTemplates =
                    this.utilService.filterListforAutocomplete(
                        input,
                        templates.value,
                        ['documentTemplateId', 'name']);

            });
            this.onExternalInHouseSelected();
            this.bindConfiguration();
            if ((this.filteredTemplates.length === 1) &&
                (this.invoiceExtInHouseCtrl.value === (InvoiceSourceType[InvoiceSourceType.Inhouse]))) {
                this.invoiceTemplatesCtrl.patchValue(this.filteredTemplates[0]);
                this.onInvoiceTemplateSelected();
            }

        }));
        this.invoiceSourceType = this.getInvoiceSourceTypeEnum();
        this.invoiceExtInHouseCtrl.patchValue(InvoiceSourceType[InvoiceSourceType.Inhouse]);
        this.washoutAgreementDateCtrl.patchValue(this.companyManager.getCurrentCompanyDate().toDate());
        this.setValidators();
        this.onChanges();
    }

    onAgreementDateChanged() {
        this.washoutAgreementDateCtrl.clearValidators();
        const agreementDate: _moment.Moment = moment(this.washoutAgreementDateCtrl.value);
        const currentDate = moment(this.companyManager.getCurrentCompanyDate());
        this.washoutAgreementDateCtrl.setValidators(
            Validators.compose([Validators.required, agreementDateValidation(agreementDate, currentDate)]));
        this.washoutAgreementDateCtrl.updateValueAndValidity();
    }

    getFormGroup() {
        this.formGroup = this.formBuilder.group({
            invoiceExtInHouseCtrl: this.invoiceExtInHouseCtrl,
            invoiceExtRefCtrl: this.invoiceExtRefCtrl,
            invoiceTemplatesCtrl: this.invoiceTemplatesCtrl,
            washoutAgreementDateCtrl: this.washoutAgreementDateCtrl,
        });
        return super.getFormGroup();
    }

    populateEntity(entity: InvoiceRecord): InvoiceRecord {
        const invoiceDocumentTemplate = entity;
        invoiceDocumentTemplate.template = this.invoiceTemplatesCtrl.value ?
            (this.invoiceTemplatesCtrl.value as PhysicalDocumentTemplate).path : null;
        invoiceDocumentTemplate.externalInhouse = this.invoiceExtInHouseCtrl.value;
        invoiceDocumentTemplate.externalInvoiceRef = this.invoiceExtRefCtrl.value;
        invoiceDocumentTemplate.agreementDate = this.washoutAgreementDateCtrl.value;
        return invoiceDocumentTemplate;
    }

    selectedWashoutContracts(contracts: ContractsToWashoutInvoice[]) {
        if (contracts.length > 0) {
            contracts = contracts.filter((contract) => contract.contractType === ContractTypes.Purchase);
            if (contracts.length > 0) {
                this.blDateTrade = (contracts[0].blDate != null) ? contracts[0].blDate :
                    (this.companyManager.getCurrentCompanyDate().toDate());
                this.washoutAgreementDateCtrl.patchValue(this.blDateTrade);
            }
        }
    }

}
