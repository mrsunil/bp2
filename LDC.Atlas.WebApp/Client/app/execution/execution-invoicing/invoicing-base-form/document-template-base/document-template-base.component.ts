import { Component, EventEmitter, Output } from '@angular/core';
import { Validators } from '@angular/forms';
import { DocumentTemplateSelectedEvent } from '../../../../shared/document-template-event.entity';
import { AtlasFormControl } from '../../../../shared/entities/atlas-form-control';
import { PhysicalDocumentTemplate } from '../../../../shared/entities/document-template.entity';
import { MasterData } from '../../../../shared/entities/masterdata.entity';
import { DocumentTypes } from '../../../../shared/enums/document-type.enum';
import { InvoiceSourceType } from '../../../../shared/enums/invoice-source-type.enum';
import { InvoiceTypes } from '../../../../shared/enums/invoice-type.enum';
import { BaseFormComponent } from './../../../../shared/components/base-form-component/base-form-component.component';
import { FormConfigurationProviderService } from './../../../../shared/services/form-configuration-provider.service';
import { ExecutionService } from './../../../../shared/services/http-services/execution.service';

@Component({
    selector: 'atlas-document-template-base',
    templateUrl: './document-template-base.component.html',
    styleUrls: ['./document-template-base.component.scss'],
})
export class DocumentTemplateBaseComponent extends BaseFormComponent {
    @Output() readonly templateSelected = new EventEmitter<DocumentTemplateSelectedEvent>();

    isUnique = true;
    invoiceTemplatesCtrl = new AtlasFormControl('invoiceCreationTemplate');
    invoiceExtRefCtrl = new AtlasFormControl('invoiceExternalReference');
    invoiceExtInHouseCtrl = new AtlasFormControl('invoiceExtInHouseInfo');

    filteredTemplates: PhysicalDocumentTemplate[] = [];
    masterdata: MasterData;
    selectedInvoiceTypeId: number;
    invoiceSourceType: string[];
    InvoiceTypes = InvoiceTypes;
    DocumentTypes = DocumentTypes;

    constructor(protected executionService: ExecutionService,
        protected formConfigurationProvider: FormConfigurationProviderService) {
        super(formConfigurationProvider);
    }

    checkUnicityOfExternalRef(val: string): void {
        if (val) {
            this.executionService.checkExternalInvoiceReferenceExists(val)
                .subscribe((isNotUnique: boolean) => {
                    this.isUnique = !isNotUnique;
                });
        } else {
            this.isUnique = true;
        }
    }

    getInvoiceSourceTypeEnum(): string[] {
        const myEnum = [];
        const objectEnum = Object.keys(InvoiceSourceType);
        const values = objectEnum.slice(0, objectEnum.length / 2);
        const keys = objectEnum.slice(objectEnum.length / 2);

        for (let i = 0; i < objectEnum.length / 2; i++) {
            myEnum.push({ viewValue: keys[i], value: values[i] });
        }
        return myEnum;
    }

    setValidators() {
        this.invoiceExtRefCtrl.setValidators(Validators.compose([Validators.maxLength(25)]));
        this.invoiceExtRefCtrl.valueChanges.subscribe((val) => {
            this.checkUnicityOfExternalRef(val);
        });
    }

    onExternalInHouseSelected() {
        if (this.invoiceExtInHouseCtrl.value === InvoiceSourceType[InvoiceSourceType.External]) {
            this.invoiceExtRefCtrl.setValidators(Validators.compose([Validators.required]));
            this.invoiceTemplatesCtrl.clearValidators();
            if (this.filteredTemplates.length === 1) {
                this.invoiceTemplatesCtrl.reset();
            }
        } else if (this.invoiceExtInHouseCtrl.value === InvoiceSourceType[InvoiceSourceType.Inhouse]) {
            this.invoiceTemplatesCtrl.setValidators(Validators.compose([Validators.required]));
            this.invoiceExtRefCtrl.clearValidators();
            this.setValidators();
            if (this.filteredTemplates.length === 1) {
                this.invoiceTemplatesCtrl.patchValue(this.filteredTemplates[0]);
            }
        }

        this.invoiceExtRefCtrl.updateValueAndValidity();
        this.invoiceTemplatesCtrl.updateValueAndValidity();
        this.formGroup.updateValueAndValidity();
        this.onInvoiceTemplateSelected();
    }

    onInvoiceTemplateSelected() {
        this.templateSelected.emit(this.invoiceTemplatesCtrl.value ?
            new DocumentTemplateSelectedEvent(true, this.invoiceTemplatesCtrl.value) :
            new DocumentTemplateSelectedEvent(false));
    }

    onChanges(): void {
        this.invoiceExtInHouseCtrl.valueChanges.subscribe((val) => {
            this.onExternalInHouseSelected();
        });
    }

    updateInhouseExternalStatus(invoiceType: InvoiceTypes) {
        if (invoiceType === InvoiceTypes.Sales
            || invoiceType === InvoiceTypes.GoodsCostSales
            || invoiceType === InvoiceTypes.Washout) {
            this.invoiceExtInHouseCtrl.patchValue(InvoiceSourceType[InvoiceSourceType.Inhouse]);
        } else if (invoiceType === InvoiceTypes.Purchase
            || invoiceType === InvoiceTypes.GoodsCostPurchase) {
            this.invoiceExtInHouseCtrl.patchValue(InvoiceSourceType[InvoiceSourceType.External]);
        }
    }
}
