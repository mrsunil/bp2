import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { DocumentGenerationConfirmationDialogBoxComponent } from '../components/document-generation-confirmation-dialog-box/document-generation-confirmation-dialog-box.component';
import { DocumentPopupButtonSettings } from '../entities/document-popup-button-settings.entity';
import { ProblemDetail } from '../entities/problem-detail.entity';
import { DocumentEntityTypes } from '../enums/document-entity-type.enum';

@Injectable()
export class DocumentPopupService {
    constructor(private dialog: MatDialog) { }

    showDocumentGenerationPopup(title: string,
        entityName: string,
        buttonSettings: DocumentPopupButtonSettings,
        hasBrowseButton = true,
        useEntityNameInButtons = true): MatDialogRef<DocumentGenerationConfirmationDialogBoxComponent> {
        const dialog = this.dialog.open(DocumentGenerationConfirmationDialogBoxComponent, {
            data: {
                title,
                hasBrowseButton,
                entityName,
                useEntityNameInButtons,
                buttonSettings,
            },
        });

        return dialog;
    }

    startDialogWork(dialog: MatDialogRef<DocumentGenerationConfirmationDialogBoxComponent>, message: string) {
        if (dialog) {
            dialog.componentInstance.isWorkInProgress = true;
            dialog.componentInstance.processMessage = message;
        }
    }

    finishDialogWork(dialog: MatDialogRef<DocumentGenerationConfirmationDialogBoxComponent>) {
        if (dialog) {
            dialog.componentInstance.processMessage = '';
            dialog.componentInstance.isWorkInProgress = false;
        }
    }

    getEntityName(entity: DocumentEntityTypes): string {
        switch (entity) {
            case DocumentEntityTypes.Contract:
                return 'contract advice';
            case DocumentEntityTypes.Invoice:
                return 'invoice';
            case DocumentEntityTypes.Cash:
                return 'payment order';
            default:
                return 'document';
        }
    }

    getGenericErrorMessage(entity: DocumentEntityTypes): string {
        return 'The selected document format does not allow ' +
            'to add the Document reference. The '
            + this.getEntityName(entity) + ' has not been created. '
            + 'Please repeat the operation with another document or choose another option.';
    }

    getSizeError(entity: DocumentEntityTypes): string {
        return 'The size of the selected document has to be inferior to 3MB. ' +
            'The ' + this.getEntityName(entity) + 'has not been created. ' +
            'Please repeat the operation with another document or choose another option.';
    }

    getErrorMessage(error: HttpErrorResponse, entity: DocumentEntityTypes): string {
        if (error.status === 413) {
            return this.getSizeError(entity);
        } else {
            const errorContent = error ? error.error : null;
            const errorDetail = errorContent as ProblemDetail;
            return errorDetail ? errorDetail.detail : this.getGenericErrorMessage(entity);
        }
    }
}
