import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BaseFormComponent } from '../../../../../shared/components/base-form-component/base-form-component.component';
import { CommodityInputComponent } from '../../../../../shared/components/commodity-input/commodity-input.component';
import { AtlasFormControl } from '../../../../../shared/entities/atlas-form-control';
import { MasterDataProps } from '../../../../../shared/entities/masterdata-props.entity';
import { MasterData } from '../../../../../shared/entities/masterdata.entity';
import { ContractTypes } from '../../../../../shared/enums/contract-type.enum';
import { SectionCompleteDisplayView } from '../../../../../shared/models/section-complete-display-view';
import { FormatDatePipe } from '../../../../../shared/pipes/format-date-pipe.pipe';
import { AllocateSectionCommand } from '../../../../../shared/services/execution/dtos/allocate-section-command';
import { FormConfigurationProviderService } from '../../../../../shared/services/form-configuration-provider.service';

@Component({
    selector: 'atlas-header-allocation-form-component',
    templateUrl: './header-allocation-form-component.component.html',
    styleUrls: ['./header-allocation-form-component.component.scss'],
})

export class HeaderAllocationFormComponent extends BaseFormComponent implements OnInit {

    @ViewChild('commodityInput') commodityInput: CommodityInputComponent;
    commodityFormGroup: FormGroup;
    counterpartyCtrl = new AtlasFormControl('counterparty');
    counterReferenceNumberCtrl = new AtlasFormControl('counterparty');
    quantityValueCtrl = new AtlasFormControl('quantityValue');
    quantityCodeCtrl = new AtlasFormControl('quantityCode');
    priceCodeCtrl = new AtlasFormControl('priceCode');
    currencyValueCtrl = new AtlasFormControl('currencyValue');
    descriptionCtrl = new AtlasFormControl('description');
    shippingPeriodCtrl = new AtlasFormControl('shippingPeriod');
    model: SectionCompleteDisplayView = new SectionCompleteDisplayView();
    masterData: MasterData = new MasterData();
    listOfMasterData = [
        MasterDataProps.Counterparties,
        MasterDataProps.Commodities,
        MasterDataProps.Currencies,
        MasterDataProps.PriceUnits,
        MasterDataProps.WeightUnits,
    ];
    constructor(protected formBuilder: FormBuilder,
        protected formConfigurationProvider: FormConfigurationProviderService,
        private formatDate: FormatDatePipe,
        private route: ActivatedRoute,
    ) {
        super(formConfigurationProvider);
    }

    ngOnInit() {
        this.masterData = this.route.snapshot.data.masterdata;
    }

    populateEntity(command: any): any {
        const allocateSection = command as AllocateSectionCommand;
        allocateSection.sourceQuantity = this.quantityValueCtrl.value ? this.quantityValueCtrl.value : null;
        allocateSection.sectionReference = this.counterReferenceNumberCtrl.value ? this.counterReferenceNumberCtrl.value : null;
        return allocateSection;
    }

    initForm(entity: any): any {
        if (entity) {
            this.model = new SectionCompleteDisplayView(entity);
            this.counterReferenceNumberCtrl.setValue(this.model.reference);
            this.shippingPeriodCtrl.setValue(
                this.formatDate.transform(this.model.deliveryPeriodStart)
                + ' - ' +
                this.formatDate.transform(this.model.deliveryPeriodEnd));

            if (this.model.type === ContractTypes[ContractTypes.Purchase]) {
                this.counterpartyCtrl.setValue(this.model.sellerCode);
            } else if (this.model.type === ContractTypes[ContractTypes.Sale]) {
                this.counterpartyCtrl.setValue(this.model.buyerCode);
            }

            const description = this.masterData.counterparties
                .find((counterpartyitem) => counterpartyitem.counterpartyCode === this.counterpartyCtrl.value);
            this.descriptionCtrl.setValue(description ? description.description : '');

            const commodity = this.masterData.commodities.find((cmy) => {
                return cmy.commodityId === this.model.commodityId;
            });
            this.commodityInput.patchValue(commodity);
            this.commodityInput.getFormGroup().disable({ emitEvent: false });

            const price = this.masterData.priceUnits
                .find((priceunit) => priceunit.priceUnitId === this.model.priceUnitId);
            this.priceCodeCtrl.setValue(price ? price.priceCode : '');

            const weightUnit = this.masterData.weightUnits
                .find((weightUnitItem) => weightUnitItem.weightUnitId === this.model.weightUnitId);
            this.quantityCodeCtrl.setValue(weightUnit ? weightUnit.weightCode : '');
            this.quantityValueCtrl.setValue(this.model.quantity);
            this.currencyValueCtrl.setValue(this.model.currency);
        }
        this.commodityInput.isEditableCommodityForm();
    }
}
