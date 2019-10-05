import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BaseFormComponent } from '../../../../../../shared/components/base-form-component/base-form-component.component';
import { AtlasFormControl } from '../../../../../../shared/entities/atlas-form-control';
import { CompanyConfiguration } from '../../../../../../shared/entities/company-configuration.entity';
import { MasterData } from '../../../../../../shared/entities/masterdata.entity';
import { Vat } from '../../../../../../shared/entities/vat.entity';
import { CompanyConfigurationRecord } from '../../../../../../shared/services/configuration/dtos/company-configuration-record';
import { FormConfigurationProviderService } from '../../../../../../shared/services/form-configuration-provider.service';
import { MasterdataService } from '../../../../../../shared/services/http-services/masterdata.service';
import { UtilService } from '../../../../../../shared/services/util.service';

@Component({
    selector: 'atlas-default-taxes',
    templateUrl: './default-taxes.component.html',
    styleUrls: ['./default-taxes.component.scss'],
})
export class DefaultTaxesComponent extends BaseFormComponent implements OnInit {
    masterdata: MasterData = new MasterData();
    taxCosts: Vat[];
    taxGoods: Vat[];
    taxCostInvoicingCtrl = new AtlasFormControl('taxCostInvoicingCtrl');
    taxGoodsInvoicingCtrl = new AtlasFormControl('taxGoodsInvoicingCtrl');
    model: CompanyConfigurationRecord;
    taxStatus: boolean;

    constructor(
        protected formConfigurationProvider: FormConfigurationProviderService,
        protected formBuilder: FormBuilder,
        protected route: ActivatedRoute,
        protected utilService: UtilService,
        protected masterdataService: MasterdataService,
    ) { super(formConfigurationProvider); }

    ngOnInit() {
        this.masterdata = this.route.snapshot.data.masterdata;
        this.taxCosts = this.masterdata.vats;
        this.taxGoods = this.masterdata.vats;
    }

    getFormGroup() {
        this.formGroup = this.formBuilder.group({
            taxCostInvoicingCtrl: this.taxCostInvoicingCtrl,
            taxGoodsInvoicingCtrl: this.taxGoodsInvoicingCtrl,
        });
        return super.getFormGroup();
    }

    setValidations(taxStatus: boolean) {
        this.taxStatus = taxStatus;
        if (!this.taxStatus) {
            this.taxCostInvoicingCtrl.disable();
            this.taxGoodsInvoicingCtrl.disable();
            this.taxCostInvoicingCtrl.clearValidators();
            this.taxGoodsInvoicingCtrl.clearValidators();
        } else {
            this.taxCostInvoicingCtrl.enable();
            this.taxGoodsInvoicingCtrl.enable();
            this.taxGoodsInvoicingCtrl.setValidators(Validators.compose([Validators.required]));
            this.taxCostInvoicingCtrl.setValidators(Validators.compose([Validators.required]));
        }
        this.taxGoodsInvoicingCtrl.updateValueAndValidity();
        this.taxCostInvoicingCtrl.updateValueAndValidity();
    }

    initForm(entity: any, isEdit): any {
        const companyConfiguration = entity;
        this.model = companyConfiguration;

        if (this.model.invoiceSetup) {
            if (this.model.invoiceSetup.defaultCostVATCode !== null && this.model.invoiceSetup.defaultCostVATCode !== '') {
                this.taxCostInvoicingCtrl.setValue(this.model.invoiceSetup.defaultCostVATCode);
            }
            if (this.model.invoiceSetup.defaultVATCode !== null && this.model.invoiceSetup.defaultVATCode !== '') {
                this.taxGoodsInvoicingCtrl.setValue(this.model.invoiceSetup.defaultVATCode);
            }
        }
        if (!isEdit) {
            this.formGroup.disable();
        } else {
            this.formGroup.enable();
        }

        return entity;
    }
    populateEntity(entity: CompanyConfiguration): CompanyConfiguration {
        const companyConfiguration = entity as CompanyConfiguration;
        companyConfiguration.invoiceSetup.defaultCostVATCode = this.taxCostInvoicingCtrl.value;
        companyConfiguration.invoiceSetup.defaultVATCode = this.taxGoodsInvoicingCtrl.value;
        return companyConfiguration;
    }

}
