import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormConfigurationProviderService } from './../../../../shared/services/form-configuration-provider.service';
import { SnackbarService } from './../../../../shared/services/snackbar.service';
import { UiService } from './../../../../shared/services/ui.service';

@Component({
    selector: 'atlas-document-upload-dialog-box',
    templateUrl: './document-upload-dialog-box.component.html',
    styleUrls: ['./document-upload-dialog-box.component.scss'],
})
export class DocumentUploadDialogBoxComponent implements OnInit {

    @Output() readonly documentSelected = new EventEmitter<File>();
    dialogData: {
        title: string,
    };

    dialogText = '';
    errorMessage = '';
    processMessage = '';
    isWorkInProgress = false;

    constructor(
        public thisDialogRef: MatDialogRef<DocumentUploadDialogBoxComponent>,
        @Inject(MAT_DIALOG_DATA) public data: {
            title: string,
        },
        protected snackbarService: SnackbarService,
        protected formConfigurationProvider: FormConfigurationProviderService,
        protected uiService: UiService,
    ) {
        this.dialogData = data;
        this.dialogText = 'Please upload your new document.';
        thisDialogRef.disableClose = true;
    }

    ngOnInit() {
    }

    onFileSelected(event) {
        if (event.target.files.length === 0) {
            return;
        }
        const file: File = event.target.files[0];
        this.documentSelected.emit(file);
        event.stopPropagation();
    }

    onDiscardButtonClicked() {
        this.thisDialogRef.close(false);
    }
}
