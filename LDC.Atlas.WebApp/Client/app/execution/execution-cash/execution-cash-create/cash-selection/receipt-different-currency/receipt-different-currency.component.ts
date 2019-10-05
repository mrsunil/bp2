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
    selector: 'atlas-receipt-different-currency',
    templateUrl: './receipt-different-currency.component.html',
    styleUrls: ['./receipt-different-currency.component.scss'],
})
export class ReceiptDifferentCurrencyComponent extends BaseFormComponent implements OnInit {
    @Output() readonly receiptDifferentCurrencyOptionChecked = new EventEmitter<any>();

    receiptDifferentCurrencyCtrl = new AtlasFormControl('ReceiptDifferentCurrency');

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
            (cashtype) => cashtype.cashTypeId === CashSelectionType.ReceiptDifferentCurrency);
        this.checked = false;
    }
    onChange($event, value, cashTypes) {
        this.checked = Boolean(value);
        this.receiptDifferentCurrencyOptionChecked.emit({
            receiptDifferentCurrencyOption: Number(cashTypes.cashTypeId),
            checked: Boolean(value),
        });
    }
    getFormGroup() {
        this.formGroup = this.formBuilder.group({
            receiptDifferentCurrencyCtrl: this.receiptDifferentCurrencyCtrl,

        });
        return super.getFormGroup();
    }
    receiptDifferentCurrencyDisable() {
        this.receiptDifferentCurrencyCtrl.disable();
    }
    receiptDifferentCurrencyEnable() {
        this.receiptDifferentCurrencyCtrl.enable();
    }

}
