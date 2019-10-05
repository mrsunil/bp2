import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { PhysicalDocumentTemplate } from '../../../../../shared/entities/document-template.entity';
import { DocumentTypes } from '../../../../../shared/enums/document-type.enum';
import { SelectMultipleAutocompleteComponent } from './../../../../../shared/components/select-multiple-autocomplete/select-multiple-autocomplete.component';
import { DocumentService } from './../../../../../shared/services/http-services/document.service';

@Component({
    selector: 'atlas-contract-advice-generation-selection-form',
    templateUrl: './selection-form.component.html',
    styleUrls: ['./selection-form.component.scss'],
})
export class ContractAdviceGenerationSelectionFormComponent implements OnInit, OnDestroy {

    @ViewChild('selectTemplate') selectTemplateComponent: SelectMultipleAutocompleteComponent;

    documentTemplateCtrl: FormControl = new FormControl();
    documentTemplates: PhysicalDocumentTemplate[] = [];
    isLoading = true;
    subscription: Subscription[] = [];

    constructor(private route: ActivatedRoute,
        private documentService: DocumentService) { }

    ngOnInit() {
        this.subscription.push(this.documentService.getTemplates(DocumentTypes.ContractAdvice)
            .subscribe((template) => {
                this.documentTemplates = template.value;
                this.initForm();
                this.isLoading = false;
            }));
    }

    ngOnDestroy() {
        this.subscription.forEach((sub) => {
            if (sub) {
                sub.unsubscribe();
            }
        });
    }

    initForm() {
        this.documentTemplateCtrl.patchValue(undefined);
        this.selectTemplateComponent.initSelected();
        this.selectTemplateComponent.setValue();
    }
}
