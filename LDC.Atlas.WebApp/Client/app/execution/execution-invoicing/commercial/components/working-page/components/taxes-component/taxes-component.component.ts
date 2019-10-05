import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BaseFormComponent } from '../../../../../../../shared/components/base-form-component/base-form-component.component';
import { AtlasFormControl } from '../../../../../../../shared/entities/atlas-form-control';
import { MasterDataProps } from '../../../../../../../shared/entities/masterdata-props.entity';
import { MasterData } from '../../../../../../../shared/entities/masterdata.entity';
import { Vat } from '../../../../../../../shared/entities/vat.entity';
import { InvoiceSummaryRecord } from '../../../../../../../shared/services/execution/dtos/invoice-summary-record';
import { FormConfigurationProviderService } from '../../../../../../../shared/services/form-configuration-provider.service';
import { MasterdataService } from '../../../../../../../shared/services/http-services/masterdata.service';
import { UtilService } from '../../../../../../../shared/services/util.service';

@Component({
    selector: 'atlas-taxes-component',
    templateUrl: './taxes-component.component.html',
    styleUrls: ['./taxes-component.component.scss'],
})
export class TaxesComponent extends BaseFormComponent implements OnInit {
    @Output() readonly selectedGoodsTaxCode = new EventEmitter<any>();

    invoiceGoodsVatCodeCntrl = new AtlasFormControl('invoiceCreationGoodsVatCode');
    invoiceVatRateCntrl = new AtlasFormControl('invoiceCreationVatRate');
    invoiceVatAmountCntrl = new AtlasFormControl('invoiceCreationVatAmount');

    filteredVatCodes: Vat[];

    masterdata: MasterData;
    masterdataList: string[] = [
        MasterDataProps.Vats,
    ];
    isInputField = false;
    defaultVatCode: string;
    currencyCode: string;

    constructor(protected formBuilder: FormBuilder,
        protected masterdataService: MasterdataService,
        protected utilService: UtilService,
        protected formConfigurationProvider: FormConfigurationProviderService) {
        super(formConfigurationProvider);
    }

    ngOnInit() {
        this.masterdataService.getMasterData(this.masterdataList).subscribe((data) => {
            this.masterdata = data;
            this.filteredVatCodes = this.masterdata.vats;
            this.invoiceGoodsVatCodeCntrl.valueChanges.subscribe((input) => {
                this.filteredVatCodes =
                    this.utilService.filterListforAutocomplete(input,
                        this.masterdata.vats,
                        ['vatCode', 'vatDescription']);
            });
            this.bindConfiguration();
        });
        this.onChanges();
    }

    onChanges(): void {
        this.invoiceGoodsVatCodeCntrl.valueChanges.subscribe((val) => {
            this.selectedGoodsTaxCode.emit(this.invoiceGoodsVatCodeCntrl.value);
        });
    }

    setDefaultVatCode(defaultVatCode) {
        this.defaultVatCode = defaultVatCode;
        if (this.defaultVatCode) {
            const vatCode = this.masterdata.vats.filter((option) => option.vatCode === this.defaultVatCode);
            if (vatCode.length > 0) {
                this.invoiceGoodsVatCodeCntrl.patchValue(vatCode[0].vatCode);
                this.invoiceVatRateCntrl.patchValue(vatCode[0].rate);
                this.invoiceVatAmountCntrl.patchValue(vatCode[0].rate);
            }
        }
    }

    setDataForTaxGoods(summaryRecord: InvoiceSummaryRecord, defaultVATCode) {
        summaryRecord.summaryLines.map((record) => {
            (record.sectionId) ? this.defaultVatCode = record.vatCode : null;
        });
        (!this.defaultVatCode) ? this.defaultVatCode = defaultVATCode : null;
        (summaryRecord.currency) ? this.currencyCode = summaryRecord.currency : null;
        this.setDefaultVatCode(this.defaultVatCode);
    }

    getFormGroup() {
        this.formGroup = this.formBuilder.group({
            invoiceGoodsVatCodeCntrl: this.invoiceGoodsVatCodeCntrl,
            invoiceVatRateCntrl: this.invoiceVatRateCntrl,
            invoiceVatAmountCntrl: this.invoiceVatAmountCntrl,
        });

        return super.getFormGroup();
    }

    vatCodeSelected(vatCode: string) {
        const selectedVatCode = this.masterdata.vats.find((x) => x.vatCode === vatCode);
        this.invoiceVatRateCntrl.patchValue(
            selectedVatCode.rate,
        );
        this.invoiceVatAmountCntrl.patchValue(
            selectedVatCode.vatDescription,
        );
    }
}
