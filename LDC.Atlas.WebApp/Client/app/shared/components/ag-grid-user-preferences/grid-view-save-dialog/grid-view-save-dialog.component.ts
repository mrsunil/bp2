import { Component, HostListener, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import { AuthorizationService } from '../../../../core/services/authorization.service';
import { UserGridViewDto } from '../../../dtos/user-grid-view-dto.dto';
import { GridConfigurationService } from '../../../services/http-services/grid-configuration.service';
import { SnackbarService } from '../../../services/snackbar.service';
import { GridViewNameValidator } from '../../../validators/grid-view-name.validator';

@Component({
    selector: 'atlas-grid-view-save-dialog',
    templateUrl: './grid-view-save-dialog.component.html',
    styleUrls: ['./grid-view-save-dialog.component.scss'],
})
export class GridViewSaveDialogComponent implements OnInit {
    // close values: -1 cancel, 0 save, 1 update

    gridView: UserGridViewDto;
    gridViewList: UserGridViewDto[];
    gridCode: string;
    company: string;

    gridViewNameCtrl: FormControl;
    shareWithAllUsersCtrl: FormControl;

    isLoading: boolean = false;
    isOwner: boolean = true;

    constructor(public dialogRef: MatDialogRef<GridViewSaveDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: {
            company: string;
            gridCode: string;
            gridView: UserGridViewDto,
            gridViewList: UserGridViewDto[]
        },
        protected gridConfigurationService: GridConfigurationService,
        protected snackbarService: SnackbarService,
        protected formBuilder: FormBuilder,
        protected authorizationService: AuthorizationService,
        protected dialog: MatDialog) {

        this.gridView = this.data.gridView;
        this.gridViewList = this.data.gridViewList;
        this.gridCode = this.data.gridCode;
        this.company = this.data.company;
    }

    ngOnInit() {
        if (!this.gridView.isDefault) {
            this.gridViewNameCtrl = new FormControl(this.gridView.name, Validators.required);
            this.shareWithAllUsersCtrl = new FormControl(this.gridView.isSharedWithAllUsers);
        } else {
            this.gridViewNameCtrl = new FormControl('', Validators.required);
            this.shareWithAllUsersCtrl = new FormControl(false);
        }
        this.isOwner = this.gridView.createdBy === this.authorizationService.getCurrentUser().samAccountName;
        this.onNameOrSharingOptionChanged();
    }

    @HostListener('window:beforeunload', ['$event']) unloadNotification($event: any) {
        if (this.gridViewNameCtrl.dirty || this.shareWithAllUsersCtrl.dirty) {
            $event.returnValue = true;
        }
    }

    checkNameInLocalList() {
        const gridViewWithSameName = this.gridViewList ?
            this.gridViewList.find((gridView) =>
                gridView.name === this.gridViewNameCtrl.value
                && gridView.gridViewId !== this.gridView.gridViewId
                && !gridView.isSharedWithAllUsers) :
            null;

        if (gridViewWithSameName) {
            this.gridViewNameCtrl.setErrors({ notUnique: true });
        }
    }

    onNameOrSharingOptionChanged() {
        if (!this.shareWithAllUsersCtrl.value) {
            this.checkNameInLocalList();
        } else if (this.gridView.name !== this.gridViewNameCtrl.value) {
            this.gridViewNameCtrl.clearAsyncValidators();
            this.gridViewNameCtrl.setAsyncValidators(
                GridViewNameValidator.createValidator(this.gridConfigurationService, this.gridCode),
            );
            this.gridViewNameCtrl.updateValueAndValidity();
        }
    }

    onSaveButtonClicked(responseCode: number = 0) {
        if (this.gridViewNameCtrl.valid) {
            this.gridView.name = this.gridViewNameCtrl.value;
            this.gridView.isSharedWithAllUsers = this.shareWithAllUsersCtrl.value;
            this.dialogRef.close(responseCode);
        }
    }
    onDiscardButtonClicked() {
        this.dialogRef.close();
    }
}
