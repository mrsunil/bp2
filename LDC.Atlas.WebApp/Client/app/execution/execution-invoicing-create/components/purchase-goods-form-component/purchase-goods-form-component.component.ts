import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BaseFormComponent } from '../../../../shared/components/base-form-component/base-form-component.component';
import { AtlasFormControl } from '../../../../shared/entities/atlas-form-control';
import { InvoiceType } from '../../../../shared/entities/invoice-type.entity';
import { MasterData } from '../../../../shared/entities/masterdata.entity';
import { ContractTypes } from '../../../../shared/enums/contract-type.enum';
import { FormConfigurationProviderService } from '../../../../shared/services/form-configuration-provider.service';
import { MasterdataService } from '../../../../shared/services/http-services/masterdata.service';
import { SecurityService } from '../../../../shared/services/security.service';

@Component({
    selector: 'atlas-purchase-goods-form-component',
    templateUrl: './purchase-goods-form-component.component.html',
    styleUrls: ['./purchase-goods-form-component.component.scss'],
})
export class PurchaseGoodsFormComponentComponent extends BaseFormComponent implements OnInit {
    @Output() readonly purchaseOptionChecked = new EventEmitter<any>();
    purchaseInvoiceCtrl = new AtlasFormControl('purchaseInvoiceType');
    company: string;
    invoiceTypeMenuItems: InvoiceType[];
    masterData: MasterData = new MasterData();

    constructor(private securityService: SecurityService,
        private masterDataService: MasterdataService,
        private route: ActivatedRoute,
        protected formBuilder: FormBuilder,
        protected formConfigurationProvider: FormConfigurationProviderService) {
        super(formConfigurationProvider);
    }

    ngOnInit() {
        this.company = this.route.snapshot.paramMap.get('company');
        this.masterData = this.route.snapshot.data.masterdata;
        this.invoiceTypeMenuItems = this.masterData.invoiceTypes.filter(
            (contractCode) => contractCode.contractTypeCode === ContractTypes.Purchase);
    }
    OnChange($event, value, invoicetype) {
        this.purchaseOptionChecked.emit({
            purchaseOption: Number(invoicetype.invoiceTypeId),
            checked: Boolean(value),
        });
    }
    getFormGroup() {
        this.formGroup = this.formBuilder.group({
            purchaseInvoiceCtrl: this.purchaseInvoiceCtrl,
        });
        return super.getFormGroup();
    }
    purchaseOptionDisable() {
        this.purchaseInvoiceCtrl.disable();
    }
    purchaseOptionEnable() {
        this.purchaseInvoiceCtrl.enable();
    }
}
