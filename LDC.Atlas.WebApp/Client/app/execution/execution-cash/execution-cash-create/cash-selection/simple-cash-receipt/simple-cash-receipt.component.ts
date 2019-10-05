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
    selector: 'atlas-simple-cash-receipt',
    templateUrl: './simple-cash-receipt.component.html',
    styleUrls: ['./simple-cash-receipt.component.scss'],
})
export class SimpleCashReceiptComponent extends BaseFormComponent implements OnInit {
    @Output() readonly simpleCashReceiptOptionChecked = new EventEmitter<any>();

    simpleCashReceiptCtrl = new AtlasFormControl('SimpleCashreceipt');

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
            (cashtype) => cashtype.cashTypeId === CashSelectionType.SimpleCashReceipt);
        this.checked = false;
    }
    onChange($event, value, cashTypes) {
        this.checked = Boolean(value);
        this.simpleCashReceiptOptionChecked.emit({
            simpleCashReceiptOption: Number(cashTypes.cashTypeId),
            checked: Boolean(value),
        });
    }
    getFormGroup() {
        this.formGroup = this.formBuilder.group({
            simpleCashReceiptCtrl: this.simpleCashReceiptCtrl,

        });
        return super.getFormGroup();
    }
    simpleCashReceiptDisable() {
        this.simpleCashReceiptCtrl.disable();
    }
    simpleCashReceiptEnable() {
        this.simpleCashReceiptCtrl.enable();
    }
    getCashTypes() {
        return this.masterData.cashTypes;
    }

}
