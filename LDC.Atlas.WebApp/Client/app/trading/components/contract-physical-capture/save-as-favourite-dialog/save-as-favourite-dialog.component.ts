import { Component, Inject, OnInit } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import { ConfirmationDialogComponent } from '../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { AtlasFormControl } from '../../../../shared/entities/atlas-form-control';
import { Section } from '../../../../shared/entities/section.entity';
import { SectionCompleteDisplayView } from '../../../../shared/models/section-complete-display-view';
import { TradingService } from '../../../../shared/services/http-services/trading.service';
import { SnackbarService } from '../../../../shared/services/snackbar.service';
import { UtilService } from '../../../../shared/services/util.service';
import { TradeFavoriteDetail } from '../../../entities/tradeFavoriteDetail.entity';
@Component({
    selector: 'atlas-save-as-favourite-dialog',
    templateUrl: './save-as-favourite-dialog.component.html',
    styleUrls: ['./save-as-favourite-dialog.component.scss'],
})
export class SaveAsFavouriteDialogComponent implements OnInit {
    formGroup: FormGroup;
    company: string;
    nameCtrl = new AtlasFormControl('Name');
    descriptionCtrl = new AtlasFormControl('Description');
    saveButtonText = 'Save As Favourite';

    dialogData: {
        title: string,
        sectionId: number,
        companyId: string,
    };

    constructor(public thisDialogRef: MatDialogRef<SaveAsFavouriteDialogComponent>,

        protected utilService: UtilService,
        private tradingService: TradingService,
        protected dialog: MatDialog,
        private snackbarService: SnackbarService,
        protected formBuilder: FormBuilder,
        @Inject(MAT_DIALOG_DATA) public data: { title: string, sectionId: number, companyId: string },
    ) {
        this.dialogData = data;
        this.company = this.dialogData.companyId;
    }

    ngOnInit() {
        this.setValidators();
        this.formGroup = this.formBuilder.group({
            nameCtrl: this.nameCtrl,
            descriptionCtrl: this.descriptionCtrl,
        });
    }

    setValidators() {
        this.nameCtrl.setValidators(Validators.compose([
            Validators.required,
            Validators.maxLength(50),
            Validators.pattern(/^[a-zA-Z0-9!@#$%^&*()-_ ~`"'|]+$/),
        ]));
        this.descriptionCtrl.setValidators(Validators.compose([
            Validators.maxLength(150),
            Validators.pattern(/^[a-zA-Z0-9!@#$%^&*()-_ ~`"'|]+$/),
        ]));
    }

    onNameChanged($event) {
        if ($event.target.value) {
            this.tradingService.checkTradeFavoriteNameExists($event.target.value)
                .subscribe((result: boolean) => {
                    if (result) {
                        const confirmOverwriteDialog = this.dialog.open(ConfirmationDialogComponent, {
                            data: {
                                title: 'Favorite Name already exits',
                                text: 'The Name is already taken, please provide another name or ' +
                                    'do you want to override the existing favorite trade ? ',
                                okButton: 'Overwrite',
                                cancelButton: 'Cancel',
                            },
                        });
                        confirmOverwriteDialog.afterClosed().subscribe((answer) => {
                            if (answer) {
                                this.saveButtonText = 'Overwrite';
                                confirmOverwriteDialog.close();
                            }
                        });
                    }
                });
        }
    }

    onCloseButtonClicked() {
        this.thisDialogRef.close();
    }

    onSaveAsFavouriteButtonClicked() {
        if (this.formGroup.valid) {
            const tradeFavorite = new TradeFavoriteDetail();
            tradeFavorite.name = this.formGroup.value.nameCtrl;
            tradeFavorite.description = this.formGroup.value.descriptionCtrl;
            tradeFavorite.sectionId = this.dialogData.sectionId;
            this.tradingService.createTradeFavorite(tradeFavorite).subscribe((result) => {
                if (result) {
                    this.snackbarService.informationSnackBar('The trade has been successfully saved as favorite');
                    this.onCloseButtonClicked();
                }
            });
        }
    }
}
