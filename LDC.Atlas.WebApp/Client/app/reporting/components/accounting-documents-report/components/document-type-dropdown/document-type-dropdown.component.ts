import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { SelectMultipleAutocompleteComponent } from '../../../../../shared/components/select-multiple-autocomplete/select-multiple-autocomplete.component';
import { transactionDocumentType } from '../../../../../shared/entities/transaction-document-type.entity';
import { FormConfigurationProviderService } from '../../../../../shared/services/form-configuration-provider.service';
import { ExecutionService } from '../../../../../shared/services/http-services/execution.service';
import { MasterdataService } from '../../../../../shared/services/http-services/masterdata.service';
import { UtilService } from '../../../../../shared/services/util.service';
import { ContextualSearchMultipleAutocompleteSelectComponent } from './../../../../../shared/components/form-components/multiple-autocomplete-dropdown/contextual-search/contextual-search-multiple-autocomplete-select.component';
import { MultipleAutocompleteDropdownComponent } from './../../../../../shared/components/multiple-autocomplete-dropdown/multiple-autocomplete-dropdown.component';

@Component({
    selector: 'atlas-document-type-dropdown',
    templateUrl: './document-type-dropdown.component.html',
    styleUrls: ['./document-type-dropdown.component.scss'],
})
export class DocumentTypeDropdownComponent extends SelectMultipleAutocompleteComponent implements OnInit {
    @ViewChild('documentTypeDropdownComponent') documentTypeDropdownComponent: ContextualSearchMultipleAutocompleteSelectComponent;
    @Output() readonly docTypeSelectionChanged = new EventEmitter<string[]>();
    allTransDocTypeOption: transactionDocumentType = {
        transactionDocumentTypeId: 0,
        label: 'All',
        description: 'All',
    };
    docTypeIds: string[] = [];
    documentType: transactionDocumentType[] = [];
    allDocumentTypeSelected = true;
    constructor(private formBuilder: FormBuilder,
        protected utilService: UtilService,
        private executionService: ExecutionService,
        private masterdataService: MasterdataService,
        private route: ActivatedRoute,
        protected formConfigurationProvider: FormConfigurationProviderService) { super(); }

    ngOnInit() {
        this.initdocumentStatus();
        this.initForm();
    }

    initdocumentStatus() {

        this.documentType = this.route.snapshot.data.masterdata.transactionDocumentType.filter((DocumentType) =>
            DocumentType.label !== 'MC');

        if (this.documentType && this.documentType.length > 8) {
            const swapRecord = this.documentType[6];
            this.documentType[6] = this.documentType[8];
            this.documentType[8] = swapRecord;
        }

        this.documentTypeDropdownComponent.options = this.documentType;
        this.documentTypeDropdownComponent.optionsChanged();
        this.initForm();
    }

    onDocumentTypeChanged(documentType: transactionDocumentType[]) {
        if (documentType) {
            if (this.documentTypeDropdownComponent.allSelected) {
                this.docTypeIds.push(this.allTransDocTypeOption.label);
            } else {
                this.docTypeIds = documentType.map((docType) => docType.label);
            }
        }
        this.docTypeSelectionChanged.emit(this.docTypeIds);
    }
}
