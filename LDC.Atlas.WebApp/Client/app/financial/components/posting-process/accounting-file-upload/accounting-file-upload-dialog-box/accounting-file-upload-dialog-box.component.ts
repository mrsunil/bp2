import { Component, EventEmitter, Inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { SnackbarService } from '../../../../../shared/services/snackbar.service';
import { UiService } from '../../../../../shared/services/ui.service';
import { FormConfigurationProviderService } from '../../../../../shared/services/form-configuration-provider.service';
@Component({
    selector: 'atlas-accounting-file-upload-dialog-box',
    templateUrl: './accounting-file-upload-dialog-box.component.html',
    styleUrls: ['./accounting-file-upload-dialog-box.component.scss']
})
export class AccountingFileUploadDialogBoxComponent implements OnInit {
    @Input() docType: string;
    @Output() documentSelected = new EventEmitter<File>();

    constructor(protected snackbarService: SnackbarService,
        protected formConfigurationProvider: FormConfigurationProviderService,
        protected uiService: UiService,
    ) { }

    ngOnInit() {
    }

    onFileSelected(files: FileList) {
        if (files.length === 0) {
            return;
        }
        const file: File = files[0];
        this.documentSelected.emit(file);
        event.stopPropagation();
    }
}

