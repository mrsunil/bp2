import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { FormConfigurationProviderService } from '../../../../../shared/services/form-configuration-provider.service';
import { BaseFormComponent } from '../../../../../shared/components/base-form-component/base-form-component.component';


@Component({
    selector: 'atlas-add-cost-confirmation-dialog',
    templateUrl: './add-cost-confirmation-dialog.component.html',
    styleUrls: ['./add-cost-confirmation-dialog.component.scss']
})
export class AddCostConfirmationDialogComponent extends BaseFormComponent implements OnInit {
    costConfirmation: boolean;
    constructor(public thisDialogRef: MatDialogRef<AddCostConfirmationDialogComponent>,
        //   @Inject(MAT_DIALOG_DATA) public data: { matrixData: Costmatrix[] },
        protected dialog: MatDialog,
        protected formConfigurationProvider: FormConfigurationProviderService, ) {
        super(formConfigurationProvider);
    }

    ngOnInit() {
    }
    onAllCostsButtonClicked() {
        this.costConfirmation = true;
        this.thisDialogRef.close(this.costConfirmation);
    }
    onActualizedCostsButtonClicked() {
        this.costConfirmation = false;
        this.thisDialogRef.close(this.costConfirmation);
    }

}
