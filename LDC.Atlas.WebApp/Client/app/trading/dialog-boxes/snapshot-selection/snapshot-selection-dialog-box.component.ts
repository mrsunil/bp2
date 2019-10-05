import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, ValidatorFn } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { Freeze } from './../../../shared/entities/freeze.entity';
import { FreezeType } from './../../../shared/enums/freeze-type.enum';
import { FreezeService } from './../../../shared/services/http-services/freeze.service';
import { SnackbarService } from './../../../shared/services/snackbar.service';
import { UiService } from './../../../shared/services/ui.service';

@Component({
    selector: 'atlas-snapshot-selection-dialog-box',
    templateUrl: './snapshot-selection-dialog-box.component.html',
    styleUrls: ['./snapshot-selection-dialog-box.component.scss'],
})
export class SnapshotSelectionDialogBoxComponent implements OnInit {
    snapshotCtrl: FormControl = new FormControl();
    snapshots: Freeze[];
    filteredSnapshots: Freeze[] = [];
    isLoading = true;

    constructor(public thisDialogRef: MatDialogRef<SnapshotSelectionDialogBoxComponent>,
        private freezeService: FreezeService,
        private uiService: UiService,
        private snackbarService: SnackbarService) { }

    ngOnInit() {
        this.freezeService.getFreezeList().subscribe((result) => {
            this.snapshots = result.value;
            this.filteredSnapshots = this.snapshots;
            this.isLoading = false;
        });

        this.snapshotCtrl.valueChanges.subscribe((input) => {
            this.filteredSnapshots = (typeof input === 'string' || !input) ? this.filterListforAutocomplete(
                input,
                this.snapshots,
            ) : this.snapshots;
        });
        this.snapshotCtrl.setValidators(
            this.inDropdownListValidator(),
        );
    }

    filterListforAutocomplete(
        input: string,
        list: Freeze[],
    ) {

        let filteredList = list;
        if (input) {
            filteredList = list.filter((item: Freeze) =>
                this.getSnapshotDate(item).toLowerCase().startsWith(input.toLowerCase()));
        }
        return filteredList;
    }

    inDropdownListValidator(): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } => {
            if (control.value) {
                const selectedSnapshot = typeof control.value === 'string' ? this.snapshots.find((snapshot) =>
                    this.getSnapshotDate(snapshot).toLowerCase() === control.value.toLowerCase()) : control.value;
                if (selectedSnapshot && selectedSnapshot.dataVersionId
                    && this.snapshots.find((snapshot) => snapshot.dataVersionId === selectedSnapshot.dataVersionId)) {
                    return;
                }
            }
            return { inDropdownList: true };
        };
    }

    onConfirmButtonClicked() {
        if (this.snapshotCtrl.value && this.snapshotCtrl.valid) {
            const selectedSnapshot: Freeze = this.snapshotCtrl.value;
            this.thisDialogRef.close(selectedSnapshot.dataVersionId);
        } else {
            this.snackbarService.throwErrorSnackBar('Please select a valid snapshot');
        }
    }

    onCancelButtonClicked() {
        this.thisDialogRef.close();
    }

    getSnapshotDate(snapshot: Freeze): string {
        if (!snapshot) {
            return '';
        }
        return (snapshot.dataVersionTypeId === FreezeType.Monthly) ?
            this.uiService.monthFormatter({ value: snapshot.freezeDate }) :
            this.uiService.dateFormatter({ value: snapshot.freezeDate });
    }
}
