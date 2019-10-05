import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseFormComponent } from '../../../../../../shared/components/base-form-component/base-form-component.component';
import { AtlasFormControl } from '../../../../../../shared/entities/atlas-form-control';
import { CompanyConfiguration } from '../../../../../../shared/entities/company-configuration.entity';
import { MasterData } from '../../../../../../shared/entities/masterdata.entity';
import { WeightUnit } from '../../../../../../shared/entities/weight-unit.entity';
import { CompanyConfigurationRecord } from '../../../../../../shared/services/configuration/dtos/company-configuration-record';
import { FormConfigurationProviderService } from '../../../../../../shared/services/form-configuration-provider.service';
import { UtilService } from '../../../../../../shared/services/util.service';

@Component({
    selector: 'atlas-details',
    templateUrl: './details.component.html',
    styleUrls: ['./details.component.scss'],
})
export class DetailsComponent extends BaseFormComponent implements OnInit {
    quantityCodeforReportingCtrl = new AtlasFormControl('QuantityCodeforReporting');
    model: CompanyConfigurationRecord;
    masterData: MasterData;
    filteredWeightUnits: WeightUnit[];

    constructor(protected formConfigurationProvider: FormConfigurationProviderService,
        protected formBuilder: FormBuilder,
        protected utilService: UtilService,
        private route: ActivatedRoute,
        private router: Router) {
        super(formConfigurationProvider);
    }

    ngOnInit() {
        this.masterData = this.route.snapshot.data.masterdata;
        this.filteredWeightUnits = this.masterData.weightUnits;
        this.filterWeightUnits();
    }

    getFormGroup() {
        this.formGroup = this.formBuilder.group({
            quantityCodeforReportingCtrl: this.quantityCodeforReportingCtrl,
        });
        return super.getFormGroup();
    }

    filterWeightUnits() {
        this.quantityCodeforReportingCtrl.valueChanges.subscribe((input) => {
            this.filteredWeightUnits = this.utilService.filterListforAutocomplete(
                input,
                this.masterData.weightUnits,
                ['weightCode', 'description'],
            );
            if (this.quantityCodeforReportingCtrl.valid) {
                this.weightCodeSelected(this.quantityCodeforReportingCtrl.value);
            }
        });
    }

    weightCodeSelected(value: WeightUnit) {
        if (value) {
            const selectedWeightUnit = this.masterData.weightUnits.find(
                (weightUnit) => weightUnit.weightCode === value.weightCode,
            );
            if (selectedWeightUnit) {
                this.quantityCodeforReportingCtrl.patchValue(selectedWeightUnit.weightCode);
            }
        }
    }

    initForm(companyConfigurationRecord, isEdit) {
        this.model = companyConfigurationRecord;

        if (this.model.companySetup) {
            this.quantityCodeforReportingCtrl.setValue(this.model.companySetup.weightCode);
        }
        if (!isEdit) {
            this.formGroup.disable();
        } else {
            this.formGroup.enable();
        }
        return companyConfigurationRecord;
    }

    populateEntity(entity: CompanyConfiguration): CompanyConfiguration {
        const companyConfiguration = entity;

        companyConfiguration.companySetup.weightUnitId = this.getWeightUnitIdFromCode(this.quantityCodeforReportingCtrl.value);

        return companyConfiguration;
    }

    getWeightUnitIdFromCode(weightUnitCode: string): number {
        const selectedWeightUnit = this.masterData.weightUnits.find(
            (weightUnit) => weightUnit.weightCode === weightUnitCode,
        );
        if (selectedWeightUnit) {
            return selectedWeightUnit.weightUnitId;
        }
    }
}
