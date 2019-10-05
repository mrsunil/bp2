import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { CompanyManagerService } from '../../../../../../core/services/company-manager.service';
import { FreezeType } from './../../../../../../shared/enums/freeze-type.enum';

@Component({
    selector: 'atlas-freeze-header-filter',
    templateUrl: './freeze-header-filter.component.html',
    styleUrls: ['./freeze-header-filter.component.scss'],
})
export class FreezeHeaderFilterComponent implements OnInit {

    @Output() readonly displayButtonClicked = new EventEmitter();
    @Input() readonly toogleText: string;

    now: moment.Moment;
    dailyDefault: moment.Moment;
    dailyFromDefault: moment.Moment;
    monthlyDefault: moment.Moment;
    monthlyFromDefault: moment.Moment;
    dateFromCtrl = new FormControl();
    dateToCtrl = new FormControl();
    freezeTypeCtrl = new FormControl();
    toggleFormControl = new FormControl(true);
    FreezeType = FreezeType;
    company: string;
    dailyErrorMap: Map<string, string> = new Map();
    monthlyErrorMap: Map<string, string> = new Map();
    formGroup: FormGroup;
    defaultDataVersionType: FreezeType = FreezeType.Daily;

    constructor(
        protected formBuilder: FormBuilder,
        protected route: ActivatedRoute,
        protected companyManager: CompanyManagerService,
    ) {
        this.company = this.route.snapshot.paramMap.get('company');
        this.now = this.companyManager.getCurrentCompanyDate();
        this.dailyDefault = this.now.clone().subtract(1, 'days').endOf('day').subtract(1, 'seconds');
        this.dailyFromDefault = this.now.clone().subtract(1, 'days').startOf('month');
        this.monthlyDefault = this.getLastClosedPeriod();
        this.monthlyFromDefault = this.getLastClosedPeriod(2);
    }

    ngOnInit() {
        this.getFormGroup();
    }

    getFormGroup(): FormGroup {
        this.formGroup = this.formBuilder.group({
            dateFromCtrl: this.dateFromCtrl,
            dateToCtrl: this.dateToCtrl,
            freezeTypeCtrl: this.freezeTypeCtrl,
        });

        this.setValidators();
        this.setDefaultValues();

        return this.formGroup;
    }

    setDefaultValues(): void {
        this.freezeTypeCtrl.setValue(this.defaultDataVersionType);
        this.onDataVersionTypeChanged(this.defaultDataVersionType);
    }

    setValidators() {
        if (this.freezeTypeCtrl.value === FreezeType.Daily) {
            this.dateFromCtrl.setValidators(
                Validators.required);
            this.dateToCtrl.setValidators(
                Validators.required);
        } else {
            this.dateFromCtrl.setValidators(
                Validators.required);
            this.dateToCtrl.setValidators(
                Validators.required);
        }
    }

    onDisplayButtonClicked() {
        this.displayButtonClicked.emit();
    }

    onDataVersionTypeChanged(dataVersionType: FreezeType) {
        this.setValidators();
        switch (dataVersionType) {
            case FreezeType.Daily:
                this.dateFromCtrl.patchValue(this.dailyFromDefault);
                this.dateToCtrl.patchValue(this.dailyDefault);
                break;
            case FreezeType.Monthly:
                this.dateFromCtrl.patchValue(this.monthlyFromDefault);
                this.dateToCtrl.patchValue(this.monthlyDefault);
                break;
            default:
                break;
        }
        this.displayButtonClicked.emit();
    }

    // Last closed period for operations. This is the last month which has been closed for any operations to be done by the user.
    // It's the previous month currently. In the future it might come from the DB.
    private getLastClosedPeriod(numberMonths: number = 1): moment.Moment {
        const dateNow = this.now.clone();
        return dateNow.subtract(numberMonths, 'months').endOf('month').subtract(1, 'seconds');
    }

    getDateFrom() {
        return this.dateFromCtrl.valid ? this.dateFromCtrl.value : null;
    }

    getDateTo() {
        const date = this.dateToCtrl.valid ? this.dateToCtrl.value : null;
        if (this.freezeTypeCtrl.value === FreezeType.Monthly && date) {
            return date.endOf('month').subtract(1, 'seconds');
        }
        return date;
    }
}
