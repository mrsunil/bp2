import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BaseFormComponent } from '../../../../../../../shared/components/base-form-component/base-form-component.component';
import { AtlasFormControl } from '../../../../../../../shared/entities/atlas-form-control';
import { MasterDataProps } from '../../../../../../../shared/entities/masterdata-props.entity';
import { MasterData } from '../../../../../../../shared/entities/masterdata.entity';
import { Vat } from '../../../../../../../shared/entities/vat.entity';
import { FormConfigurationProviderService } from '../../../../../../../shared/services/form-configuration-provider.service';
import { MasterdataService } from '../../../../../../../shared/services/http-services/masterdata.service';
import { UtilService } from '../../../../../../../shared/services/util.service';
import { InvoiceSummaryLineRecord } from '../../../../../../../shared/services/execution/dtos/invoice-summary-line-record';

@Component({
    selector: 'atlas-goods-cost-tax-goods',
    templateUrl: './goods-cost-tax-goods.component.html',
    styleUrls: ['./goods-cost-tax-goods.component.scss']
})
export class GoodsCostTaxGoodsComponent extends BaseFormComponent implements OnInit {
    @Output() readonly selectedGoodsTaxCode = new EventEmitter<any>();

    invoiceGoodsVatCodeCtrl = new AtlasFormControl('invoiceCreationGoodsVatCode');
    invoiceVatRateCtrl = new AtlasFormControl('invoiceCreationVatRate');
    invoiceVatAmountCtrl = new AtlasFormControl('invoiceCreationVatAmount');

    filteredVatCodes: Vat[];

    masterdata: MasterData;
    masterdataList: string[] = [
        MasterDataProps.Vats,
    ];
    isInputField = false;
    defaultVatCode: string;

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
            this.invoiceGoodsVatCodeCtrl.valueChanges.subscribe((input) => {
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
        this.invoiceGoodsVatCodeCtrl.valueChanges.subscribe((val) => {
            this.selectedGoodsTaxCode.emit(this.invoiceGoodsVatCodeCtrl.value);
        });
    }

    setDefaultVatCode(defaultVatCode) {
        this.defaultVatCode = defaultVatCode;
        if (this.defaultVatCode) {
            const vatCode = this.masterdata.vats.filter((option) => option.vatCode === this.defaultVatCode);
            if (vatCode.length > 0) {
                this.invoiceGoodsVatCodeCtrl.patchValue(vatCode[0].vatCode);
                this.invoiceVatRateCtrl.patchValue(vatCode[0].rate);
                this.invoiceVatAmountCtrl.patchValue(vatCode[0].rate);
            }
        }
    }

    setDataForTaxGoods(summaryLines: InvoiceSummaryLineRecord[], defaultVATCode) {
        summaryLines.map((record) => {
            if (record.sectionId) {
                this.defaultVatCode = record.vatCode;
            }
        });
        if (!this.defaultVatCode) {
            this.defaultVatCode = defaultVATCode;
        }
        this.setDefaultVatCode(this.defaultVatCode);
    }

    getFormGroup() {
        this.formGroup = this.formBuilder.group({
            invoiceGoodsVatCodeCtrl: this.invoiceGoodsVatCodeCtrl,
            invoiceVatRateCtrl: this.invoiceVatRateCtrl,
            invoiceVatAmountCtrl: this.invoiceVatAmountCtrl,
        });

        return super.getFormGroup();
    }

    vatCodeSelected(vatCode: string) {
        const selectedVatCode = this.masterdata.vats.find((vat) => vat.vatCode === vatCode);
        this.invoiceVatRateCtrl.patchValue(
            selectedVatCode.rate,
        );
        this.invoiceVatAmountCtrl.patchValue(
            selectedVatCode.vatDescription,
        );
    }

}