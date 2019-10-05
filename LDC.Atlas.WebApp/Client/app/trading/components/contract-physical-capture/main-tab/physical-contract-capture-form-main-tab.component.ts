import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BaseFormComponent } from '../../../../shared/components/base-form-component/base-form-component.component';
import { Commodity } from '../../../../shared/entities/commodity.entity';
import { WeightUnit } from '../../../../shared/entities/weight-unit.entity';
import { ContractTypes } from '../../../../shared/enums/contract-type.enum';
import { FormConfigurationProviderService } from '../../../../shared/services/form-configuration-provider.service';
import { TradeImageField } from '../../../../shared/services/trading/dtos/tradeImageField';
import { CommodityFormComponent } from '../form-components/commodity-form-component/commodity-form-component.component';
import { CounterpartyFormComponent } from '../form-components/counterparty-form-component/counterparty-form-component.component';
import { LocationFormComponent } from '../form-components/location-form-component/location-form-component.component';
import { MemoFormComponent } from '../form-components/memo-form-component/memo-form-component.component';
import { PriceFormComponent } from '../form-components/price-form-component/price-form-component.component';
import { QuantityFormComponent } from '../form-components/quantity-form-component/quantity-form-component.component';
import { TermsFormComponent } from '../form-components/terms-form-component/terms-form-component.component';

@Component({
    selector: 'atlas-physical-contract-capture-form-main-tab',
    templateUrl: './physical-contract-capture-form-main-tab.component.html',
    styleUrls: ['./physical-contract-capture-form-main-tab.component.scss'],
})
export class PhysicalContractCaptureFormMainTabComponent
    extends BaseFormComponent
    implements OnInit {
    @ViewChild('CounterpartyComponent') counterpartyComponent: CounterpartyFormComponent;
    @ViewChild('CommodityComponent') commodityComponent: CommodityFormComponent;
    @ViewChild('QuantityFormComponent') quantityComponent: QuantityFormComponent;
    @ViewChild('TermsFormComponent') termsComponent: TermsFormComponent;
    @ViewChild('PriceFormComponent') priceComponent: PriceFormComponent;
    @ViewChild('ShipmentPeriodFormComponent') shipmentPeriodComponent: TermsFormComponent;
    @ViewChild('LocationFormComponent') locationFormComponent: LocationFormComponent;
    @ViewChild('MemoComponent') memoComponent: MemoFormComponent;
    @Output() readonly updateTrafficTabQuantity = new EventEmitter<any>();
    @Output() readonly commodityBlockOrWarnMessage = new EventEmitter<any>();
    @Output() readonly portWarningMessage = new EventEmitter<any>();
    @Output() readonly shipmentWarningMessageEvent = new EventEmitter<any>();
    formComponents: BaseFormComponent[] = [];

    constructor(
        protected formBuilder: FormBuilder,
        protected formConfigurationProvider: FormConfigurationProviderService,
    ) {
        super(formConfigurationProvider);
    }

    ngOnInit() {
        this.formComponents.push(
            this.counterpartyComponent,
            this.commodityComponent,
            this.quantityComponent,
            this.termsComponent,
            this.priceComponent,
            this.shipmentPeriodComponent,
            this.locationFormComponent,
            this.memoComponent,
        );
    }

    contractTypeSelected(contractType: ContractTypes) {
        this.counterpartyComponent.contractTypeSelected(contractType);
    }

    contractDateSelected(contractDate: Date) {
        this.commodityComponent.contractDateSelected(contractDate);
    }

    commodityCodeSelected(commodity: Commodity) {
        this.priceComponent.commodityCodeSelected(commodity);
        this.termsComponent.commodityCodeSelected(commodity);
    }

    commBlockWarnMessage(isBlocking: any) {
        this.commodityBlockOrWarnMessage.emit(isBlocking);
    }

    portsWarningMessage(isPortWarning: any) {
        this.portWarningMessage.emit(isPortWarning);
    }

    shipmentWarningMessage(isShipmentWarning: any) {
        this.shipmentWarningMessageEvent.emit(isShipmentWarning);
    }

    initForm(entity: any, isEdit: boolean): any {
        this.formComponents.forEach((comp) => {
            entity = comp.initForm(entity, isEdit);
        });
        return entity;
    }

    populateEntity(entity: any): any {
        this.formComponents.forEach((comp) => {
            entity = comp.populateEntity(entity);
        });
        return entity;
    }

    quantitySelected(quantity: number) {
        this.priceComponent.quantityVal = quantity;
        this.priceComponent.setContractValue();
        this.updateTrafficTabQuantity.emit(quantity);

    }
    quantityCodeSelected(quantityCode: WeightUnit) {
        this.priceComponent.weightUnit = quantityCode;
        this.priceComponent.setContractValue();
    }

    getFormGroup() {
        this.formGroup = this.formBuilder.group({
            memoComponent: this.memoComponent.getFormGroup(),
            counterpartyGroup: this.counterpartyComponent.getFormGroup(),
            termsGroup: this.termsComponent.getFormGroup(),
            quantityGroup: this.quantityComponent.getFormGroup(),
            locationFormComponent: this.locationFormComponent.getFormGroup(),
            shipmentPeriodFormComponent: this.shipmentPeriodComponent.getFormGroup(),
            commodityGroup: this.commodityComponent.getFormGroup(),
            priceGroup: this.priceComponent.getFormGroup(),
        });

        return super.getFormGroup();
    }

    setTradeImageDetails(tradeImageDetails: TradeImageField[]) {
        this.commodityComponent.tradeImageDetails = tradeImageDetails;
        this.counterpartyComponent.tradeImageDetails = tradeImageDetails;
        this.locationFormComponent.tradeImageDetails = tradeImageDetails;
        this.memoComponent.tradeImageDetails = tradeImageDetails;
        this.priceComponent.tradeImageDetails = tradeImageDetails;
        this.quantityComponent.tradeImageDetails = tradeImageDetails;
        this.shipmentPeriodComponent.tradeImageDetails = tradeImageDetails;
        this.termsComponent.tradeImageDetails = tradeImageDetails;
    }
}
