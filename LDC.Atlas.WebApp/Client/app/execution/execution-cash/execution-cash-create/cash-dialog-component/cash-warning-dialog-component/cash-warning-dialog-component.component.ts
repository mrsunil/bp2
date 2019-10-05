import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import { BaseFormComponent } from '../../../../../shared/components/base-form-component/base-form-component.component';
import { FormConfigurationProviderService } from '../../../../../shared/services/form-configuration-provider.service';
import { ExecutionCashCreateComponent } from '../../execution-cash-create.component';

@Component({
    selector: 'atlas-cash-warning-dialog-component',
    templateUrl: './cash-warning-dialog-component.component.html',
    styleUrls: ['./cash-warning-dialog-component.component.scss']
})
export class CashWarningDialogComponentComponent extends BaseFormComponent implements OnInit {

    dialogData: {
        title: string,
        text: string,
        okButton: string,
        cancelButton: string;
        editButton: string;
    };
    constructor(protected formBuilder: FormBuilder,
        public thisDialogRef: MatDialogRef<ExecutionCashCreateComponent>,
        protected dialog: MatDialog,
        @Inject(MAT_DIALOG_DATA) public data:
            {
                title: string,
                text: string,
                okButton: string,
                cancelButton: string;
                editButton: string;
            },


        protected formConfigurationProvider: FormConfigurationProviderService,
    ) {
        super(formConfigurationProvider);
        this.dialogData = data;


    }
    ngOnInit() {
    }

    onCloseConfirm() {
        this.thisDialogRef.close(true);
    }

    onCloseCancel() {
        this.thisDialogRef.close(false);
    }
    onCloseEdit() {
        this.thisDialogRef.close(false);
    }

}
