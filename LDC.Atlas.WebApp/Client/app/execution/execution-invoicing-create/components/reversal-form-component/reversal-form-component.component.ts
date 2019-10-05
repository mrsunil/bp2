import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BaseFormComponent } from '../../../../shared/components/base-form-component/base-form-component.component';
import { AtlasFormControl } from '../../../../shared/entities/atlas-form-control';
import { InvoiceType } from '../../../../shared/entities/invoice-type.entity';
import { MasterData } from '../../../../shared/entities/masterdata.entity';
import { InvoiceTypes } from '../../../../shared/enums/invoice-type.enum';
import { FormConfigurationProviderService } from '../../../../shared/services/form-configuration-provider.service';

@Component({
    selector: 'atlas-reversal-form-component',
    templateUrl: './reversal-form-component.component.html',
    styleUrls: ['./reversal-form-component.component.scss'],
})
export class ReversalFormComponent extends BaseFormComponent implements OnInit {
    @Output() readonly reversalOptionChecked = new EventEmitter<any>();
    reversalCtrl = new AtlasFormControl('reversalType');
    invoiceTypeMenuItems: InvoiceType[];
    masterData: MasterData;
    company: string;

    constructor(
        protected formBuilder: FormBuilder,
        private route: ActivatedRoute,
        protected formConfigurationProvider: FormConfigurationProviderService) {
        super(formConfigurationProvider);
    }

    ngOnInit() {
        this.company = this.route.snapshot.paramMap.get('company');
        this.masterData = this.route.snapshot.data.masterdata;
        this.invoiceTypeMenuItems = this.masterData.invoiceTypes
            .filter((invoiceType) => invoiceType.invoiceTypeId === InvoiceTypes.Reversal);
    }
    onInvoiceTypeChecked($event, value, invoiceType) {
        this.reversalOptionChecked.emit({
            reversalOption: Number(invoiceType.invoiceTypeId),
            checked: Boolean(value),
        });
    }
    getFormGroup() {
        this.formGroup = this.formBuilder.group({
            reversalCtrl: this.reversalCtrl,
        });
        return super.getFormGroup();
    }
    reversalOptionDisable() {
        this.reversalCtrl.disable();
    }
    reversalOptionEnable() {
        this.reversalCtrl.enable();
    }
}
