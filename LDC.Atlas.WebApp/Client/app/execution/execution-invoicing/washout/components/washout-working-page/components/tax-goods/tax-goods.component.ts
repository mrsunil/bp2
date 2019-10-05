import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BaseFormComponent } from '../../../../../../../shared/components/base-form-component/base-form-component.component';
import { AtlasFormControl } from '../../../../../../../shared/entities/atlas-form-control';
import { MasterDataProps } from '../../../../../../../shared/entities/masterdata-props.entity';
import { MasterData } from '../../../../../../../shared/entities/masterdata.entity';
import { Vat } from '../../../../../../../shared/entities/vat.entity';
import { FormConfigurationProviderService } from '../../../../../../../shared/services/form-configuration-provider.service';
import { MasterdataService } from '../../../../../../../shared/services/http-services/masterdata.service';
import { UtilService } from '../../../../../../../shared/services/util.service';
import { ActivatedRoute } from '@angular/router';
import { InvoiceSummaryLineRecord } from '../../../../../../../shared/services/execution/dtos/invoice-summary-line-record';

@Component({
    selector: 'atlas-tax-goods',
    templateUrl: './tax-goods.component.html',
    styleUrls: ['./tax-goods.component.scss'],
})
export class TaxGoodsComponent extends BaseFormComponent implements OnInit {
    @Output() readonly selectedGoodsTaxCode = new EventEmitter<any>();

    goodsVatCodeCtrl = new AtlasFormControl('invoiceCreationGoodsVatCode');
    descriptionCtrl = new AtlasFormControl('invoiceCreationVatRate');
    vatAmountForGoodsCtrl = new AtlasFormControl('invoiceCreationVatAmount');

    filteredVatCodes: Vat[];

    masterdata: MasterData = new MasterData();
    masterdataList: string[] = [
        MasterDataProps.Vats,
    ];
    isInputField = false;
    defaultVatCode: string;

    constructor(private route: ActivatedRoute,
        protected formBuilder: FormBuilder,
        protected masterdataService: MasterdataService,
        protected utilService: UtilService,
        protected formConfigurationProvider: FormConfigurationProviderService) {
        super(formConfigurationProvider);
    }

    ngOnInit() {
        this.masterdata = this.route.snapshot.data.masterdata;
        if (this.masterdata) {
            this.filteredVatCodes = this.masterdata.vats;
            this.goodsVatCodeCtrl.valueChanges.subscribe((input) => {
                this.filteredVatCodes =
                    this.utilService.filterListforAutocomplete(input,
                        this.masterdata.vats,
                        ['vatCode', 'vatDescription']);
            });
            this.bindConfiguration();
        }
        this.onChanges();

    }

    onChanges(): void {
        this.goodsVatCodeCtrl.valueChanges.subscribe((val) => {
            this.selectedGoodsTaxCode.emit(this.goodsVatCodeCtrl.value);
        });
    }

    setDefaultVatCode(defaultVatCode) {
        this.defaultVatCode = defaultVatCode;
        if (this.defaultVatCode) {
            const vatCode = this.masterdata.vats.filter((option) => option.vatCode === this.defaultVatCode);
            if (vatCode.length > 0) {
                this.goodsVatCodeCtrl.patchValue(vatCode[0].vatCode);
                this.descriptionCtrl.patchValue(vatCode[0].vatDescription);
                this.vatAmountForGoodsCtrl.patchValue(vatCode[0].rate);
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
            goodsVatCodeCtrl: this.goodsVatCodeCtrl,
            descriptionCtrl: this.descriptionCtrl,
            vatAmountForGoodsCtrl: this.vatAmountForGoodsCtrl,
        });

        return super.getFormGroup();
    }

    vatCodeSelected(vatCode: string) {
        const selectedVatCode = this.masterdata.vats.find((vat) => vat.vatCode === vatCode);
        this.descriptionCtrl.patchValue(
            selectedVatCode.vatDescription,
        );
        this.vatAmountForGoodsCtrl.patchValue(
            selectedVatCode.rate,
        );
    }
}
