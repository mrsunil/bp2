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
    selector: 'atlas-washout-form-component',
    templateUrl: './washout-form-component.component.html',
    styleUrls: ['./washout-form-component.component.scss'],
})
export class WashoutFormComponent extends BaseFormComponent implements OnInit {
    @Output() readonly washoutOptionChecked = new EventEmitter<any>();

    washoutCtrl = new AtlasFormControl('washoutType');
    invoiceTypeMenuItems: InvoiceType[];
    masterData: MasterData;
    company: string;

    constructor(protected formBuilder: FormBuilder,
        private route: ActivatedRoute,
        protected formConfigurationProvider: FormConfigurationProviderService) {
        super(formConfigurationProvider);
    }

    ngOnInit() {
        this.company = this.route.snapshot.paramMap.get('company');
        this.masterData = this.route.snapshot.data.masterdata;
        this.invoiceTypeMenuItems = this.masterData.invoiceTypes
            .filter((invoicetype) => invoicetype.invoiceTypeId === InvoiceTypes.Washout);
    }
    onInvoiceTypeChecked($event, value, invoiceType) {
        this.washoutOptionChecked.emit({
            washoutOption: Number(invoiceType.invoiceTypeId),
            checked: Boolean(value),
        });
    }
    getFormGroup() {
        this.formGroup = this.formBuilder.group({
            washoutCtrl: this.washoutCtrl,
        });
        return super.getFormGroup();
    }
    washoutOptionDisable() {
        this.washoutCtrl.disable();
    }
    washoutOptionEnable() {
        this.washoutCtrl.enable();
    }

}
