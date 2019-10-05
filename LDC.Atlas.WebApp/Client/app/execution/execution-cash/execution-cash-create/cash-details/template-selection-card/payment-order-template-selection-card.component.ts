import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { CashSelectionType } from '../../../../../shared/enums/cash-selection-type';
import { BaseFormComponent } from './../../../../../shared/components/base-form-component/base-form-component.component';
import { AtlasFormControl } from './../../../../../shared/entities/atlas-form-control';
import { PhysicalDocumentTemplate } from './../../../../../shared/entities/document-template.entity';
import { DocumentTypes } from './../../../../../shared/enums/document-type.enum';
import { FormConfigurationProviderService } from './../../../../../shared/services/form-configuration-provider.service';
import { DocumentService } from './../../../../../shared/services/http-services/document.service';
import { UtilService } from './../../../../../shared/services/util.service';

@Component({
    selector: 'atlas-payment-order-template-selection-card',
    templateUrl: './payment-order-template-selection-card.component.html',
    styleUrls: ['./payment-order-template-selection-card.component.scss'],
})
export class PaymentOrderTemplateSelectionCardComponent extends BaseFormComponent implements OnInit, OnDestroy {
    templatesCtrl = new AtlasFormControl('templateCtrl');

    filteredTemplates: PhysicalDocumentTemplate[] = [];

    @Output() readonly templateSelected = new EventEmitter<boolean>();

    constructor(protected formBuilder: FormBuilder,
        protected documentService: DocumentService,
        protected utilService: UtilService,
        protected formConfigurationProvider: FormConfigurationProviderService) {
        super(formConfigurationProvider);
    }

    ngOnInit() { }

    mapCashDocumentType(cashSelectionType: CashSelectionType): DocumentTypes {
        switch (cashSelectionType) {
            case CashSelectionType.SimpleCashPayment:
            case CashSelectionType.SimpleCashReceipt:
                return DocumentTypes.CashSimpleCash;
            case CashSelectionType.PaymentDifferentClient:
                return DocumentTypes.CashDifferentClient;
            case CashSelectionType.PaymentDifferentCurrency:
            case CashSelectionType.ReceiptDifferentCurrency:
                return DocumentTypes.CashDifferentCurrency;
            case CashSelectionType.PaymentFullPartialTransaction:
            case CashSelectionType.ReceiptFullPartialTransaction:
                return DocumentTypes.CashPickByTransaction;
            default:
                console.error('Invalid cash selection type: %s', cashSelectionType);
                break;
        }
    }

    SetCashType(cashTypeId: number): any {
        const documentType = this.mapCashDocumentType(cashTypeId);
        this.subscriptions.push(this.documentService.getTemplates(documentType).subscribe((templates) => {
            this.filteredTemplates = templates.value;
            this.templatesCtrl.valueChanges.subscribe((input) => {
                this.filteredTemplates =
                    this.utilService.filterListforAutocomplete(
                        input,
                        this.filteredTemplates,
                        ['documentTemplateId', 'name']);
            });
        }));
    }

    getFormGroup() {
        this.formGroup = this.formBuilder.group({
            invoiceTemplatesCtrl: this.templatesCtrl,
        });
        return super.getFormGroup();
    }

    onTemplateSelected() {
        this.templateSelected.emit(this.templatesCtrl.value ? true : false);
    }

    populateEntity(entity: any): any {
        entity.template = this.templatesCtrl.value ? (this.templatesCtrl.value as PhysicalDocumentTemplate).path : null;
        return entity;
    }

}
