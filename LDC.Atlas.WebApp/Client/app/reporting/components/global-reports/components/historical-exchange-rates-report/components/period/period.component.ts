import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import * as _moment from 'moment';
import { BaseFormComponent } from '../../../../../../../shared/components/base-form-component/base-form-component.component';
import { ForeignExchangeRateViewMode } from '../../../../../../../shared/enums/foreign-exchange-rate-viewmode.enum';
import { FreezeType } from '../../../../../../../shared/enums/freeze-type.enum';
import { FormConfigurationProviderService } from '../../../../../../../shared/services/form-configuration-provider.service';
import { isAfterDate, isDateBeforeControlDate } from '../../../../../../../shared/validators/date-validators.validator';
const moment = _moment;
import { CompanyManagerService } from '../../../../../../../core/services/company-manager.service';

@Component({
    selector: 'atlas-period',
    templateUrl: './period.component.html',
    styleUrls: ['./period.component.scss'],
})
export class PeriodComponent extends BaseFormComponent implements OnInit {
    @Output() readonly periodSelected = new EventEmitter<string>();
    @Output() readonly fromSelected = new EventEmitter<string>();
    @Output() readonly toSelected = new EventEmitter<string>();
    @Output() readonly showAllDatesSelected = new EventEmitter<boolean>();
    periodCtrl = new FormControl();
    fromCtrl = new FormControl();
    toCtrl = new FormControl();
    showAllDatesCtrl = new FormControl();
    formGroup: FormGroup;
    disableMonthly: boolean = true;
    disableDaily: boolean = true;
    FreezeType: FreezeType;
    setPeriodType: FreezeType;
    daily: FreezeType = FreezeType.Daily;
    monthly: FreezeType = FreezeType.Monthly;
    activateMonth: boolean = false;
    activateDay: boolean = true;
    dailyErrorMap: Map<string, string> = new Map();
    monthlyErrorMap: Map<string, string> = new Map();
    toDateErrorMap: Map<string, string> = new Map();
    fromDateSet: Date;
    constructor(private formBuilder: FormBuilder,
        formConfigurationProviderService: FormConfigurationProviderService,
        protected companyManager: CompanyManagerService) {
        super(formConfigurationProviderService);
    }

    ngOnInit() {
        this.getFormGroup();
        this.fromCtrl.disable();
        this.toCtrl.disable();
    }
    getFormGroup(): FormGroup {
        this.formGroup = this.formBuilder.group({
            periodCtrl: this.periodCtrl,
            fromCtrl: this.fromCtrl,
            toCtrl: this.toCtrl,
            showAllDatesCtrl: this.showAllDatesCtrl,
        });

        return this.formGroup;
    }
    setDefaultValues() {
        if (this.setPeriodType === this.daily) {
            this.activateMonth = false;
            this.activateDay = true;
        }
        if (this.setPeriodType === this.monthly) {
            this.activateDay = false;
            this.activateMonth = true;
        }
    }
    setDateValidators() {
        this.toCtrl.clearValidators();
        this.toCtrl.setValidators(Validators.compose(
            [(isDateBeforeControlDate(moment(this.fromDateSet))), isAfterDate(this.companyManager.getCurrentCompanyDate())]));
        this.toCtrl.updateValueAndValidity();
    }
    getRateSelected(rate: string) {
        this.disablePeriod(rate);
        this.setDefaultValues();
        this.formGroup.updateValueAndValidity();
        this.formGroup.reset();
    }
    disablePeriod(rate: string) {
        if (ForeignExchangeRateViewMode) {
            switch (rate) {
                case ForeignExchangeRateViewMode.Daily:
                    {
                        this.disableDaily = false;
                        this.disableMonthly = false;
                        this.fromCtrl.enable();
                        this.toCtrl.enable();
                        this.setPeriodType = this.daily;
                        this.periodCtrl.patchValue(this.daily);
                        this.fromCtrl.setValidators(
                            Validators.compose([Validators.required, isAfterDate(this.companyManager.getCurrentCompanyDate())]),
                        );
                        this.disableMonthly = true;
                        break;
                    }
                case ForeignExchangeRateViewMode.Monthly:
                    {
                        this.disableDaily = false;
                        this.disableMonthly = false;
                        this.fromCtrl.enable();
                        this.toCtrl.enable();
                        this.setPeriodType = this.monthly;
                        this.periodCtrl.patchValue(this.monthly);
                        this.fromCtrl.setValidators(
                            Validators.compose([Validators.required, isAfterDate(this.companyManager.getCurrentCompanyDate())]));
                        this.disableDaily = true;
                        break;
                    }
                case ForeignExchangeRateViewMode.Spot:
                    {
                        this.disableDaily = true;
                        this.disableMonthly = true;
                        this.fromCtrl.disable();
                        this.toCtrl.disable();
                        this.fromCtrl.disable();
                        this.toCtrl.disable();
                        this.setPeriodType = null;
                        this.fromCtrl.setValidators(null);
                        this.toCtrl.setValidators(null);
                        this.fromCtrl.patchValue(null);
                        this.toCtrl.patchValue(null);
                        break;
                    }
            }
            this.formGroup.updateValueAndValidity();
        }
    }
    onPeriodDataChanged(): void {
        this.periodCtrl.valueChanges.subscribe((periodValue) => {
            this.setDefaultValues();
            this.periodSelected.emit(periodValue);
        });
    }
    onFromChanged(): void {
        if (this.fromCtrl.value && this.fromCtrl.valid) {
            this.setDefaultValues();
            this.fromSelected.emit(this.fromCtrl.value);
            this.fromDateSet = this.fromCtrl.value;
        }
        this.setDateValidators();
    }
    onToChanged(): void {
        if (this.toCtrl.value && this.toCtrl.valid) {
            this.setDefaultValues();
            this.toSelected.emit(this.toCtrl.value);
        }
        this.setDateValidators();
        this.formGroup.updateValueAndValidity();
    }

    onShowAllDatesChanged(): void {
        if (this.showAllDatesCtrl.value && this.showAllDatesCtrl.valid) {
            this.showAllDatesSelected.emit(this.showAllDatesCtrl.value);
        }
    }

}
