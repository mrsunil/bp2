import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BaseFormComponent } from '../../../../../shared/components/base-form-component/base-form-component.component';
import { DocumentTemplateSelectedEvent } from '../../../../../shared/document-template-event.entity';
import { InvoiceReversalSearchResult } from '../../../../../shared/dtos/invoice-reversal';
import { ReversalRowSelection } from '../../../../../shared/entities/reversal-row-selection.entity';
import { DocumentTypes } from '../../../../../shared/enums/document-type.enum';
import { FormConfigurationProviderService } from '../../../../../shared/services/form-configuration-provider.service';
import { DocumentSearchComponent } from './components/document-search/document-search.component';
import { DocumentTypeComponent } from './components/document-type/document-type.component';
import { ReversalDocumentTemplateComponent } from './components/reversal-document-template/reversal-document-template.component';
import { ReversalInvoiceSelectionComponent } from './components/reversal-invoice-selection/reversal-invoice-selection.component';

@Component({
    selector: 'atlas-reversal-selection',
    templateUrl: './reversal-selection.component.html',
    styleUrls: ['./reversal-selection.component.scss'],
})
export class ReversalSelectionComponent extends BaseFormComponent implements OnInit {
    private formComponents: BaseFormComponent[] = [];
    @Output() readonly templateSelected = new EventEmitter<DocumentTemplateSelectedEvent>();
    @Output() readonly rowSelected = new EventEmitter<ReversalRowSelection>();
    @ViewChild('invoiceSelectionComponent') invoiceSelectionComponent: ReversalInvoiceSelectionComponent;
    @ViewChild('documentSearchComponent') documentSearchComponent: DocumentSearchComponent;
    @ViewChild('documentTypeComponent') documentTypeComponent: DocumentTypeComponent;
    @ViewChild('documentTemplateComponent') documentTemplateComponent: ReversalDocumentTemplateComponent;
    invoiceSelectionFormGroup: FormGroup;
    DocumentTypes = DocumentTypes;
    isTemplateEnabled: boolean;

    constructor(protected formBuilder: FormBuilder,
        protected formConfigurationProvider: FormConfigurationProviderService) {
        super(formConfigurationProvider);
    }

    ngOnInit() {
        this.invoiceSelectionFormGroup = this.formBuilder.group({
            invoiceSelectionComponent: this.invoiceSelectionComponent.getFormGroup(),
            documentSearchComponent: this.documentSearchComponent.getFormGroup(),
            documentTypeComponent: this.documentTypeComponent.getFormGroup(),
            documentTemplateComponent: this.documentTemplateComponent.getFormGroup(),
        });
        this.formComponents.push(
            this.invoiceSelectionComponent,
            this.documentSearchComponent,
            this.documentTypeComponent,
            this.documentTemplateComponent);
    }
    documentTypeSelected(documentTypeId: number) {
        this.documentTypeComponent.documentTypeCtrl.patchValue(documentTypeId);
    }

    documentDateSelected(documentDate: Date) {
        this.documentTypeComponent.documentDateSelected(documentDate);
    }
    onRowSelected(row: ReversalRowSelection) {
        this.updateInhouseExternalStatus(row.data);
        this.documentTypeComponent.rowSelected(row.isRowSelected);
        this.rowSelected.emit(row);
    }
    populateEntity(model: any): any {
        this.formComponents.forEach((comp) => {
            comp.populateEntity(model);
        });
        return model;
    }

    onTemplateSelected(event: DocumentTemplateSelectedEvent) {
        this.templateSelected.emit(event);
    }

    updateInhouseExternalStatus(data: InvoiceReversalSearchResult) {
        if (data) {
            this.isTemplateEnabled = data.hasPhysicalDocument;
            if (this.documentTemplateComponent) {
                this.documentTemplateComponent.updateInhouseExternalStatus(data.invoiceTypeId);
            }
        } else {
            this.isTemplateEnabled = false;
        }
    }
}
