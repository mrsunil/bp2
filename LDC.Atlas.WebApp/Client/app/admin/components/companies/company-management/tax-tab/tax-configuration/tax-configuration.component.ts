import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSlideToggleChange } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { BaseFormComponent } from '../../../../../../shared/components/base-form-component/base-form-component.component';
import { AtlasFormControl } from '../../../../../../shared/entities/atlas-form-control';
import { CompanyConfiguration } from '../../../../../../shared/entities/company-configuration.entity';
import { MasterData } from '../../../../../../shared/entities/masterdata.entity';
import { TaxType } from '../../../../../../shared/entities/tax-Type.entity';
import { CompanyConfigurationRecord } from '../../../../../../shared/services/configuration/dtos/company-configuration-record';
import { FormConfigurationProviderService } from '../../../../../../shared/services/form-configuration-provider.service';
import { MasterdataService } from '../../../../../../shared/services/http-services/masterdata.service';
import { UtilService } from '../../../../../../shared/services/util.service';

@Component({
    selector: 'atlas-tax-configuration',
    templateUrl: './tax-configuration.component.html',
    styleUrls: ['./tax-configuration.component.scss'],
})
export class TaxConfigurationComponent extends BaseFormComponent implements OnInit {
    masterdata: MasterData = new MasterData();
    taxTypes: TaxType[];
    taxLabel: TaxType[];
    taxTypeCtrl = new AtlasFormControl('taxTypeCtrl');
    taxLabelCtrl = new AtlasFormControl('taxLabelCtrl');
    taxActiveCtrl = new AtlasFormControl('taxActiveCtrl');
    @Output() readonly sendTaxActive = new EventEmitter<boolean>();
    model: CompanyConfigurationRecord;

    constructor(
        protected formConfigurationProvider: FormConfigurationProviderService,
        protected formBuilder: FormBuilder,
        protected route: ActivatedRoute,
        protected utilService: UtilService,
        protected masterdataService: MasterdataService,
    ) { super(formConfigurationProvider); }

    ngOnInit() {
        this.masterdata = this.route.snapshot.data.masterdata;
        this.taxTypes = this.masterdata.taxTypes;
        this.taxLabel = this.masterdata.taxTypes.filter((item) => item.enumEntityValue !== 'Indian GST');
        this.taxActiveCtrl.setValue(false);
        this.sendTaxActive.emit(this.taxActiveCtrl.value);
        this.setValidators();
    }

    toggle(event: MatSlideToggleChange) {
        this.sendTaxActive.emit(event.checked);
    }

    getFormGroup() {
        this.formGroup = this.formBuilder.group({
            taxTypeCtrl: this.taxTypeCtrl,
            taxLabelCtrl: this.taxLabelCtrl,
            taxActiveCtrl: this.taxActiveCtrl,
        });
        return super.getFormGroup();
    }

    initForm(entity: CompanyConfigurationRecord, isEdit): CompanyConfigurationRecord {
        const companyConfiguration = entity;
        this.model = companyConfiguration;

        if (this.model.invoiceSetup) {
            this.sendTaxActive.emit(this.model.invoiceSetup.vatActive);
            this.taxActiveCtrl.setValue(this.model.invoiceSetup.vatActive);

            if (this.model.invoiceSetup.taxType !== null && this.model.invoiceSetup.taxType !== '') {
                this.taxTypeCtrl.setValue(this.model.invoiceSetup.taxType);
            }
            if (this.model.invoiceSetup.vatLabel !== null && this.model.invoiceSetup.vatLabel !== '') {
                this.taxLabelCtrl.setValue(this.model.invoiceSetup.vatLabel);
            }
        }
        if (!isEdit) {
            this.formGroup.disable();
        } else {
            this.formGroup.enable();
        }

        return entity;
    }

    populateEntity(entity: any): CompanyConfiguration {
        const companyConfiguration = entity as CompanyConfiguration;
        companyConfiguration.invoiceSetup.vatActive = this.taxActiveCtrl.value;
        if (this.taxTypeCtrl.value) {
            companyConfiguration.invoiceSetup.taxTypeId = (this.masterdata.taxTypes.find((i) =>
                i.enumEntityValue === this.taxTypeCtrl.value).enumEntityId);
        }
        companyConfiguration.invoiceSetup.vatLabel = this.taxLabelCtrl.value;
        return companyConfiguration;
    }

    setValidators() {
        this.taxTypeCtrl.setValidators([
            Validators.compose([Validators.required]),
        ]);
        this.taxLabelCtrl.setValidators([
            Validators.compose([Validators.required]),
        ]);
    }
}
