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
    selector: 'atlas-sales-goods-form-component',
    templateUrl: './sales-goods-form-component.component.html',
    styleUrls: ['./sales-goods-form-component.component.scss'],
})
export class SalesGoodsFormComponentComponent extends BaseFormComponent implements OnInit {
    @Output() readonly salesOptionChecked = new EventEmitter<any>();
    salesInvoiceCtrl = new AtlasFormControl('salesInvoiceType');
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
            (contractCode) => contractCode.contractTypeCode === ContractTypes.Sale);
    }
    OnChange($event, value, invoicetype) {
        this.salesOptionChecked.emit({
            saleOption: Number(invoicetype.invoiceTypeId),
            checked: Boolean(value),
        });
    }
    getFormGroup() {
        this.formGroup = this.formBuilder.group({
            salesInvoiceCtrl: this.salesInvoiceCtrl,
        });
        return super.getFormGroup();
    }
    salesOptionDisable() {
        this.salesInvoiceCtrl.disable();
    }
    salesOptionEnable() {
        this.salesInvoiceCtrl.enable();
    }

}
