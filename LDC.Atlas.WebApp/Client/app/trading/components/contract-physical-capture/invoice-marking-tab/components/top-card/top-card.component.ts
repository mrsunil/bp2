import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { BaseFormComponent } from '../../../../../../shared/components/base-form-component/base-form-component.component';
import { AtlasFormControl } from '../../../../../../shared/entities/atlas-form-control';
import { MasterDataProps } from '../../../../../../shared/entities/masterdata-props.entity';
import { MasterData } from '../../../../../../shared/entities/masterdata.entity';
import { ContractTypes } from '../../../../../../shared/enums/contract-type.enum';
import { SectionCompleteDisplayView } from '../../../../../../shared/models/section-complete-display-view';
import { FormConfigurationProviderService } from '../../../../../../shared/services/form-configuration-provider.service';
import { MasterdataService } from '../../../../../../shared/services/http-services/masterdata.service';

@Component({
    selector: 'atlas-physical-contract-capture-invoice-marking-top-card',
    templateUrl: './top-card.component.html',
    styleUrls: ['./top-card.component.scss'],
})
export class TopCardComponent extends BaseFormComponent implements OnInit {

    translationKeyPrefix: string = 'TRADING.TRADE_CAPTURE.INVOICE_MARKING_TAB.TOP_CARD.';

    commodityDescrCtrl = new AtlasFormControl('invoiceMarkingCommodityDescr');
    counterPartyCodeCtrl = new AtlasFormControl('invoiceMarkingCounterPartyCode');
    quantityCtrl = new AtlasFormControl('invoiceMarkingQuantity');
    pricingCtrl = new AtlasFormControl('invoiceMarkingPricing');
    shippingPeriodCtrl = new AtlasFormControl('invoiceMarkingShippingPeriod');
    tradeRecord: SectionCompleteDisplayView;
    masterdataList: string[] = [MasterDataProps.Commodities];
    private masterDataSubscription: Subscription;
    masterdata: MasterData;
    formattedQuantity: string;
    formattedPrice: string;

    constructor(protected formBuilder: FormBuilder,
        protected masterdataService: MasterdataService,
        protected route: ActivatedRoute,
        protected formConfigurationProvider: FormConfigurationProviderService) {
        super(formConfigurationProvider);
    }

    ngOnInit() {
        this.masterdata = this.route.snapshot.data.masterdata;
    }

    ngOnDestroy(): void {
        if (this.masterDataSubscription) {
            this.masterDataSubscription.unsubscribe();
        }
    }
    initForm(entity: any, isEdit: boolean) {
        this.tradeRecord = new SectionCompleteDisplayView(entity);

        if (this.tradeRecord.type === ContractTypes[ContractTypes.Purchase]) {
            this.counterPartyCodeCtrl.patchValue(this.tradeRecord.sellerCode);
        } else if (this.tradeRecord.type === ContractTypes[ContractTypes.Sale]) {
            this.counterPartyCodeCtrl.patchValue(this.tradeRecord.buyerCode);
        }
        this.quantityCtrl.patchValue(this.tradeRecord.quantity);

        this.formattedQuantity = this.formatValue(this.tradeRecord.quantity, 3, 3);

        this.shippingPeriodCtrl.patchValue(this.tradeRecord.shippingPeriod);
        const filteredCommodities = this.masterdata.commodities.filter((c) => c.commodityId === this.tradeRecord.commodityId);
        if (filteredCommodities.length > 0) {
            this.commodityDescrCtrl.patchValue(filteredCommodities[0].description);
        }
        const filteredWeightUnit = this.masterdata.weightUnits.filter((weight) => weight.weightUnitId === this.tradeRecord.weightUnitId);
        if (filteredWeightUnit.length > 0) {
            this.quantityCtrl.patchValue(this.formattedQuantity + '' + filteredWeightUnit[0].weightCode);
        }
        const filteredPriceCode = this.masterdata.priceUnits.filter((price) => price.priceUnitId === this.tradeRecord.priceUnitId);
        if (filteredPriceCode.length > 0) {
            this.formattedPrice = this.formatValue(this.tradeRecord.price, 2, 2);
            this.pricingCtrl.patchValue((this.tradeRecord.currency) + '' + (this.formattedPrice) + '' +
                (filteredPriceCode[0].priceCode));
        }
    }

    formatValue(amount: number, minimumFractionDigits: number, maximumFractionDigits: number): string {
        if (isNaN(amount) || amount === null) { return ''; }
        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits, maximumFractionDigits,
        }).format(amount);
    }

    getFormGroup() {
        this.formGroup = this.formBuilder.group({
            commodityDescrCtrl: this.commodityDescrCtrl,
            counterPartyCodeCtrl: this.counterPartyCodeCtrl,
            quantityCtrl: this.quantityCtrl,
            pricingCtrl: this.pricingCtrl,
            shippingPeriodCtrl: this.shippingPeriodCtrl,
        });
        return super.getFormGroup();
    }
}
