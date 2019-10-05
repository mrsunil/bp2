import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormConfigurationProviderService } from '../../services/form-configuration-provider.service';
import { SnackbarService } from '../../services/snackbar.service';
import { UiService } from '../../services/ui.service';

@Component({
    selector: 'atlas-file-upload-dialog-box',
    templateUrl: './file-upload-dialog-box.component.html',
    styleUrls: ['./file-upload-dialog-box.component.scss'],
})
export class FileUploadDialogBoxComponent implements OnInit {
    @Input() docType: string;
    @Output() readonly documentSelected = new EventEmitter<File>();

    constructor(
        protected snackbarService: SnackbarService,
        protected formConfigurationProvider: FormConfigurationProviderService,
        protected uiService: UiService,
    ) { }

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

}
