import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BaseFormComponent } from '../../../../../../../shared/components/base-form-component/base-form-component.component';
import { AtlasFormControl } from '../../../../../../../shared/entities/atlas-form-control';
import { MasterData } from '../../../../../../../shared/entities/masterdata.entity';
import { FormConfigurationProviderService } from '../../../../../../../shared/services/form-configuration-provider.service';
import { UtilService } from '../../../../../../../shared/services/util.service';
import { InvoiceRecord } from '../../../../../../../shared/services/execution/dtos/invoice-record';

@Component({
    selector: 'atlas-invoice-type-selection',
    templateUrl: './invoice-type-selection.component.html',
    styleUrls: ['./invoice-type-selection.component.scss'],
})
export class InvoiceTypeSelectionComponent extends BaseFormComponent implements OnInit {

    invoiceTypeSelectedCtrl = new AtlasFormControl('invoiceWashoutTypeSelected');
    invoiceTypeDescription: string;
    masterdata: MasterData = new MasterData();
    invoiceTypeId: number;

    constructor(
        private route: ActivatedRoute,
        protected formBuilder: FormBuilder,
        protected utilService: UtilService,
        protected formConfigurationProvider: FormConfigurationProviderService) {
        super(formConfigurationProvider);
    }

    ngOnInit() {
        this.masterdata = this.route.snapshot.data.masterdata;
        this.getData();
    }

    getData() {
        this.invoiceTypeId = Number(decodeURIComponent(this.route.snapshot.paramMap.get('invoiceTypeId')));
        this.invoiceTypeDescription = this.masterdata.
            invoiceTypes.find((invoiceType) => invoiceType.invoiceTypeId === this.invoiceTypeId).name;
        this.invoiceTypeSelectedCtrl.patchValue(this.invoiceTypeDescription);
    }

    getFormGroup() {
        this.formGroup = this.formBuilder.group({
            invoiceTypeSelectedCtrl: this.invoiceTypeSelectedCtrl,
        });
        return super.getFormGroup();
    }

    populateEntity(entity: InvoiceRecord): InvoiceRecord {
        const invoiceType = entity as InvoiceRecord;
        invoiceType.invoiceType = this.invoiceTypeId;
        return invoiceType;
    }
}
