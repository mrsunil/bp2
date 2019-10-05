import { Component, OnInit, ViewChild } from '@angular/core';
import { FxRatesSelectedType } from './../../../entities/fx-rates-selected-type.entity';
import { ForeignExchangeRatesGridComponent } from './cards/grid/foreign-exchange-rates-grid.component';
import { ConfirmationDialogComponent } from '../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material';

@Component({
    selector: 'atlas-foreign-exchange-rates',
    templateUrl: './foreign-exchange-rates.component.html',
    styleUrls: ['./foreign-exchange-rates.component.scss'],
})
export class ForeignExchangeRatesComponent implements OnInit {
    @ViewChild('grid') foreignExchangeRatesGridComponent: ForeignExchangeRatesGridComponent;
    editMode = false;

    constructor(protected dialog: MatDialog) { }

    ngOnInit() {
    }

    onSelectedViewParamsChanged(selectedViewParams: FxRatesSelectedType) {
        this.foreignExchangeRatesGridComponent.updateGrid(selectedViewParams);
    }

    onEditButtonClicked(editMode: boolean) {
        this.editMode = editMode;
    }

    onSaveButtonClicked() {
        this.editMode = false;
        this.foreignExchangeRatesGridComponent.onSaveButtonClicked();
    }

    onDiscardButtonClicked() {
        const confirmDiscardDialog = this.dialog.open(ConfirmationDialogComponent, {
            data: {
                title: 'Discard Changes',
                text: 'You have some modification pending. Close and lose changes?',
                okButton: 'Ok',
                cancelButton: 'Cancel',
            },
        });
        confirmDiscardDialog.afterClosed().subscribe((answer) => {
            if (answer) {
                this.editMode = false;
                this.foreignExchangeRatesGridComponent.onDiscardButtonClicked();
            }
        });


    }
}
