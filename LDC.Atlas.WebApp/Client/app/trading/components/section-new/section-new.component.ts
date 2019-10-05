import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Subscription } from 'rxjs';
import { isDifferencePositive, isPositive } from '../../../shared/directives/number-validators.directive';
import { Section } from '../../../shared/entities/section.entity';
import { ExecutionService } from '../../../shared/services/http-services/execution.service';
import { TradingService } from '../../../shared/services/http-services/trading.service';
import { SplitCreationResult } from '../../../shared/services/trading/dtos/section';

@Component({
    selector: 'atr-section-new',
    templateUrl: './section-new.component.html',
    styleUrls: ['./section-new.component.scss'],
})
export class SectionNewComponent implements OnInit {
    availableQuantityCtrl: FormControl;
    splitQuantityCtrl: FormControl;
    remainingQuantityCtrl: FormControl;
    splitForm: FormGroup;
    model: Section;
    savingInProgress = false;
    private splitCreationSubscription: Subscription;

    constructor(
        public thisDialogRef: MatDialogRef<SectionNewComponent>,
        @Inject(MAT_DIALOG_DATA) public data: Section,
        private fb: FormBuilder,
        private tradingService: TradingService,
        private executionService: ExecutionService) {
        this.model = data;
    }

    ngOnInit() {
        this.availableQuantityCtrl = new FormControl({ value: '', disabled: true }, [Validators.required]);
        this.remainingQuantityCtrl = new FormControl({ value: '', disabled: true }, Validators.compose([Validators.required]));
        this.splitQuantityCtrl = new FormControl({ value: '', disabled: false }, Validators.compose([Validators.required, isPositive(), isDifferencePositive(this.model.quantity)]));

        this.splitForm = this.fb.group({
            availableQuantityCtrl: this.availableQuantityCtrl,
            splitQuantityCtrl: this.splitQuantityCtrl,
            remainingQuantityCtrl: this.remainingQuantityCtrl,
        });

        this.splitForm.patchValue({
            availableQuantityCtrl: this.model.quantity,
            remainingQuantityCtrl: this.model.quantity,
        });

        this.splitQuantityCtrl.valueChanges.subscribe(
            (qty) => {
                this.remainingQuantityCtrl.setValue(this.availableQuantityCtrl.value - qty);
                if (this.availableQuantityCtrl.value - qty < 0) {
                    this.remainingQuantityCtrl.setErrors({ isPositiveError: true });
                } else {
                    this.remainingQuantityCtrl.setErrors({});
                }
            });

    }
    onCloseConfirm() {
        this.savingInProgress = true;
        if (this.splitForm.hasError) {
            this.model.quantity = this.splitQuantityCtrl.value;
            this.model.sectionOriginId = this.model.sectionId;
            this.model.sectionId = 0;

            this.splitCreationSubscription = this.tradingService.createSplit(this.model).subscribe(
                (data: SplitCreationResult[]) => {
                    if (data && data.length > 1) {
                    }
                    this.thisDialogRef.close(data);
                }, (error) => {
                    this.thisDialogRef.close(error);
                    throw (error);
                },
            );
        } else {
            this.savingInProgress = false;
        }
    }

    onCloseCancel() {
        this.thisDialogRef.close(null);
    }
    ngOnDestroy(): void {
        if (this.splitCreationSubscription) {
            this.splitCreationSubscription.unsubscribe();
        }
    }
}
