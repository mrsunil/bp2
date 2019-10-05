import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseFormComponent } from '../../../../../shared/components/base-form-component/base-form-component.component';
import { AtlasFormControl } from '../../../../../shared/entities/atlas-form-control';
import { CashTypes } from '../../../../../shared/entities/cash-type.entity';
import { MasterData } from '../../../../../shared/entities/masterdata.entity';
import { CashSelectionType } from '../../../../../shared/enums/cash-selection-type';
import { CashType } from '../../../../../shared/enums/cash-type.enum';
import { FormConfigurationProviderService } from '../../../../../shared/services/form-configuration-provider.service';
import { MasterdataService } from '../../../../../shared/services/http-services/masterdata.service';

@Component({
    selector: 'atlas-payment-different-currency',
    templateUrl: './payment-different-currency.component.html',
    styleUrls: ['./payment-different-currency.component.scss'],
})
export class PaymentDifferentCurrencyComponent extends BaseFormComponent implements OnInit {
    @Output() readonly paymentDifferentCurrencyOptionChecked = new EventEmitter<any>();

    paymentDifferentCurrencyCtrl = new AtlasFormControl('PaymentDifferentCurrency');

    CashType = CashType;
    cashTypeId: number;
    company: string;
    cashTypes: CashTypes[];
    masterData: MasterData = new MasterData();
    checked: boolean;
    constructor(protected formConfigurationProvider: FormConfigurationProviderService,
        private route: ActivatedRoute,
        private masterDataService: MasterdataService,
        protected formBuilder: FormBuilder,
        private router: Router) {
        super(formConfigurationProvider);
        this.cashTypeId = Number(decodeURIComponent(this.route.snapshot.paramMap.get('cashTypeId')));
    }
    ngOnInit() {
        this.company = this.route.snapshot.paramMap.get('company');
        this.masterData = this.route.snapshot.data.masterdata;
        this.cashTypes = this.masterData.cashTypes.filter(
            (cashtype) => cashtype.cashTypeId === CashSelectionType.PaymentDifferentCurrency);
        this.checked = false;
    }
    onChange($event, value, cashTypes) {
        this.checked = Boolean(value);
        this.paymentDifferentCurrencyOptionChecked.emit({
            paymentDifferentCurrencyOption: Number(cashTypes.cashTypeId),
            checked: Boolean(value),
        });
    }
    getFormGroup() {
        this.formGroup = this.formBuilder.group({
            paymentDifferentCurrencyCtrl: this.paymentDifferentCurrencyCtrl,

        });
        return super.getFormGroup();
    }
    paymentDifferentCurrencyDisable() {
        this.paymentDifferentCurrencyCtrl.disable();
    }
    paymentDifferentCurrencyEnable() {
        this.paymentDifferentCurrencyCtrl.enable();
    }

}
