import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormConfigurationProviderService } from '../../../../../../shared/services/form-configuration-provider.service';
import { BaseFormComponent } from '../../../../../../shared/components/base-form-component/base-form-component.component';

@Component({
    selector: 'atlas-generate-end-of-year-warning-message',
    templateUrl: './generate-end-of-year-warning-message.component.html',
    styleUrls: ['./generate-end-of-year-warning-message.component.scss']
})
export class GenerateEndOfYearWarningMessageComponent extends BaseFormComponent implements OnInit {
    isLoading = true;
    dialogData: any;
    documentsGenerated: string[] = [];
    constructor(public thisDialogRef: MatDialogRef<GenerateEndOfYearWarningMessageComponent>,
        protected formBuilder: FormBuilder,
        protected route: ActivatedRoute,
        @Inject(MAT_DIALOG_DATA) public data: any,
        protected formConfigurationProvider: FormConfigurationProviderService) {
        super(formConfigurationProvider);
        this.dialogData = data;
    }

    ngOnInit() {
        this.isLoading = false;
        if (this.dialogData && this.dialogData.length > 0) {
            this.documentsGenerated = this.dialogData;
        }
    }

    onOkButtonClicked() {
        this.thisDialogRef.close();
    }
}
