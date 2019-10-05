import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BaseFormComponent } from '../../../../shared/components/base-form-component/base-form-component.component';
import { AtlasFormControl } from '../../../../shared/entities/atlas-form-control';
import { InvoiceType } from '../../../../shared/entities/invoice-type.entity';
import { MasterData } from '../../../../shared/entities/masterdata.entity';
import { InvoiceTypes } from '../../../../shared/enums/invoice-type.enum';
import { FormConfigurationProviderService } from '../../../../shared/services/form-configuration-provider.service';
import { SecurityService } from '../../../../shared/services/security.service';

@Component({
    selector: 'atlas-cost-form-component',
    templateUrl: './cost-form-component.component.html',
    styleUrls: ['./cost-form-component.component.scss'],
})
export class CostFormComponentComponent extends BaseFormComponent implements OnInit {
    @Output() readonly costOptionChecked = new EventEmitter<any>();

    costInvoiceCtrl = new AtlasFormControl('costInvoiceType');
    invoiceTypeMenuItems: InvoiceType[];
    masterData: MasterData;
    company: string;

    constructor(private securityService: SecurityService,
        protected formBuilder: FormBuilder,
        private route: ActivatedRoute,
        protected formConfigurationProvider: FormConfigurationProviderService) {
        super(formConfigurationProvider);
    }

    ngOnInit() {

        this.company = this.route.snapshot.paramMap.get('company');
        this.masterData = this.route.snapshot.data.masterdata;
        this.invoiceTypeMenuItems = this.masterData.invoiceTypes.filter((invoicetype) => invoicetype.invoiceTypeId === InvoiceTypes.Cost);
    }
    onInvoiceTypeChecked($event, value, invoicetype) {
        this.costOptionChecked.emit({
            costOption: Number(invoicetype.invoiceTypeId),
            checked: Boolean(value),
        });
    }
    getFormGroup() {
        this.formGroup = this.formBuilder.group({
            costInvoiceCtrl: this.costInvoiceCtrl,
        });
        return super.getFormGroup();
    }
    costOptionDisable() {
        this.costInvoiceCtrl.disable();
    }
    costOptionEnable() {
        this.costInvoiceCtrl.enable();
    }
}
