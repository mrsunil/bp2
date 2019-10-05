import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BaseFormComponent } from '../../../../../../../shared/components/base-form-component/base-form-component.component';
import { AtlasFormControl } from '../../../../../../../shared/entities/atlas-form-control';
import { MasterData } from '../../../../../../../shared/entities/masterdata.entity';
import { InvoiceRecord } from '../../../../../../../shared/services/execution/dtos/invoice-record';
import { FormConfigurationProviderService } from '../../../../../../../shared/services/form-configuration-provider.service';
import { UtilService } from '../../../../../../../shared/services/util.service';

@Component({
    selector: 'atlas-reversal-invoice-selection',
    templateUrl: './reversal-invoice-selection.component.html',
    styleUrls: ['./reversal-invoice-selection.component.scss'],
})

export class ReversalInvoiceSelectionComponent extends BaseFormComponent implements OnInit {
    invoiceTypeSelectedCtrl = new AtlasFormControl('invoiceTypeSelected');
    costsCommissionTypeCtrl = new AtlasFormControl('costsCommissionSelection');
    quantityToInvoiceCtrl = new AtlasFormControl('quantityToInvoiceSelection');

    invoiceTypeId: number;
    invoiceTypeName: string;
    selectedInvoiceTypeId = Number(decodeURIComponent(this.route.snapshot.paramMap.get('invoiceTypeId')));
    contract: string = 'Contract';
    reversalInvoiceTypeName: string = 'Reversal';

    masterdata: MasterData = new MasterData();

    constructor(
        private route: ActivatedRoute,
        protected formBuilder: FormBuilder,
        protected utilService: UtilService,
        protected formConfigurationProvider: FormConfigurationProviderService) {
        super(formConfigurationProvider);
    }

    ngOnInit() {
        this.invoiceTypeId = Number(decodeURIComponent(this.route.snapshot.paramMap.get('invoiceTypeId')));
        this.masterdata = this.route.snapshot.data.masterdata;
        this.getData();
    }

    getData() {
        if (this.masterdata) {
            const invoiceType = this.masterdata.
                invoiceTypes.find((invoice) => invoice.invoiceTypeId === this.invoiceTypeId);
            if (invoiceType) {
                this.invoiceTypeName = invoiceType.name;
                this.invoiceTypeSelectedCtrl.patchValue(this.invoiceTypeName);
            }
        }
        this.costsCommissionTypeCtrl.disable();
        this.quantityToInvoiceCtrl.setValue(this.contract);
    }

    getFormGroup() {
        this.formGroup = this.formBuilder.group({
            invoiceTypeSelectedCtrl: this.invoiceTypeSelectedCtrl,
            costsCommissionTypeCtrl: this.costsCommissionTypeCtrl,
            quantityToInvoiceCtrl: this.quantityToInvoiceCtrl,
        });
        return super.getFormGroup();
    }

    populateEntity(entity: any): any {
        const invoiceType = entity as InvoiceRecord;
        invoiceType.invoiceType = this.invoiceTypeId;
        invoiceType.quantityToInvoice = this.quantityToInvoiceCtrl.value;
        return invoiceType;
    }
}
