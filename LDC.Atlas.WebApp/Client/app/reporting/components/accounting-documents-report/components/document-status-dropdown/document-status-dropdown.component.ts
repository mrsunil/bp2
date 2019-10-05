import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { SelectMultipleAutocompleteComponent } from '../../../../../shared/components/select-multiple-autocomplete/select-multiple-autocomplete.component';
import { MasterData } from '../../../../../shared/entities/masterdata.entity';
import { transactionDocumentStatus } from '../../../../../shared/entities/transaction-document-status.entity';
import { FormConfigurationProviderService } from '../../../../../shared/services/form-configuration-provider.service';
import { ExecutionService } from '../../../../../shared/services/http-services/execution.service';
import { MasterdataService } from '../../../../../shared/services/http-services/masterdata.service';
import { UtilService } from '../../../../../shared/services/util.service';
import { ContextualSearchMultipleAutocompleteSelectComponent } from './../../../../../shared/components/form-components/multiple-autocomplete-dropdown/contextual-search/contextual-search-multiple-autocomplete-select.component';
import { MultipleAutocompleteDropdownComponent } from './../../../../../shared/components/multiple-autocomplete-dropdown/multiple-autocomplete-dropdown.component';

@Component({
    selector: 'atlas-document-status-dropdown',
    templateUrl: './document-status-dropdown.component.html',
    styleUrls: ['./document-status-dropdown.component.scss'],
})
export class DocumentStatusDropdownComponent extends SelectMultipleAutocompleteComponent implements OnInit {
    @ViewChild('documentStatusDropdownComponent') documentStatusDropdownComponent: ContextualSearchMultipleAutocompleteSelectComponent;
    @Output() readonly docStatusSelectionChanged = new EventEmitter<string[]>();

    allTransDocStatusOption: transactionDocumentStatus = {
        enumEntityId: 0,
        enumEntityValue: 'All',
    };
    postedTodayOption: transactionDocumentStatus = {
        enumEntityId: 100,
        enumEntityValue: 'Posted(Today)',
    };
    docStatusIds: string[] = [];
    documentStatus: transactionDocumentStatus[] = [];
    allDocumentStatusSelected = true;
    constructor(private formBuilder: FormBuilder,
        protected utilService: UtilService,
        private executionService: ExecutionService,
        private masterdataService: MasterdataService,
        private route: ActivatedRoute,
        protected formConfigurationProvider: FormConfigurationProviderService) { super(); }

    ngOnInit() {
        //  this.initializeForm();
        this.initdocumentStatus();
        this.initForm();
    }
    initdocumentStatus() {
        this.documentStatus = this.route.snapshot.data.masterdata.transactionDocumentStatus.filter((documentStatus) =>
            documentStatus.enumEntityValue !== 'Posted');
        this.documentStatusDropdownComponent.options = this.documentStatus;
        this.documentStatusDropdownComponent.options.push(this.postedTodayOption);
        this.documentStatusDropdownComponent.optionsChanged();  
    }

    onDocumentStatusChanged(documentStatus: transactionDocumentStatus[]) {
        if (documentStatus) {
            if (this.documentStatusDropdownComponent.allSelected) {
                this.docStatusIds.push(this.allTransDocStatusOption.enumEntityValue);
            } else {
                this.docStatusIds = documentStatus.map((documentStatu) => documentStatu.enumEntityValue);
             }
        }
        this.docStatusSelectionChanged.emit(this.docStatusIds);
    }

}
