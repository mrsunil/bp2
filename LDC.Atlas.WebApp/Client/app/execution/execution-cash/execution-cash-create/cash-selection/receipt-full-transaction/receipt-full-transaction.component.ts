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
    selector: 'atlas-receipt-full-transaction',
    templateUrl: './receipt-full-transaction.component.html',
    styleUrls: ['./receipt-full-transaction.component.scss'],
})
export class ReceiptFullTransactionComponent extends BaseFormComponent implements OnInit {
    @Output() readonly receiptFullTransactionOptionChecked = new EventEmitter<any>();

    receiptFullTransactionCtrl = new AtlasFormControl('ReceiptFullTransaction');

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
            (cashtype) => cashtype.cashTypeId === CashSelectionType.ReceiptFullPartialTransaction);
        this.checked = false;
    }
    onChange($event, value, cashTypes) {
        this.checked = Boolean(value);
        this.receiptFullTransactionOptionChecked.emit({
            receiptFullTransactionOption: Number(cashTypes.cashTypeId),
            checked: Boolean(value),
        });
    }
    getFormGroup() {
        this.formGroup = this.formBuilder.group({
            receiptFullTransactionCtrl: this.receiptFullTransactionCtrl,

        });
        return super.getFormGroup();
    }
    receiptFullTransactionDisable() {
        this.receiptFullTransactionCtrl.disable();
    }
    receiptFullTransactionEnable() {
        this.receiptFullTransactionCtrl.enable();
    }

}
