import { Component } from '@angular/core';
import { MatDialog } from '@angular/material';
import { SnackbarService } from '../../../../../services/snackbar.service';
import { UtilService } from '../../../../../services/util.service';
import { ContextualSearchUserPreferencesLightBoxComponent } from '../../../../contextual-search/base-light-box/contextual-search-user-preferences-light-box/contextual-search-user-preferences-light-box.component';
import { MasterdataInputComponent } from '../masterdata-input.component';

@Component({
    selector: 'atlas-masterdata-user-preferences-input',
    templateUrl: './../masterdata-input.component.html',
    styleUrls: ['./../masterdata-input.component.scss'],
})
export class MasterdataUserPreferencesInputComponent extends MasterdataInputComponent {

    constructor(protected utils: UtilService,
        protected dialog: MatDialog,
        protected snackbarService: SnackbarService,
    ) {
        super(utils, dialog, snackbarService);
    }

    openLightbox() {
        return this.dialog.open(ContextualSearchUserPreferencesLightBoxComponent, {
            data: {
                gridId: this.gridId,
                rowData$: this.getFilteredList(),
            },
            width: '80%',
            maxHeight: '80%',
        });
    }
}
