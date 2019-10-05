import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatSlideToggleChange } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { BaseFormComponent } from '../../../../../../shared/components/base-form-component/base-form-component.component';
import { AtlasFormControl } from '../../../../../../shared/entities/atlas-form-control';
import { FormConfigurationProviderService } from '../../../../../../shared/services/form-configuration-provider.service';

@Component({
    selector: 'atlas-dms',
    templateUrl: './dms.component.html',
    styleUrls: ['./dms.component.scss'],
})
export class DmsComponent extends BaseFormComponent implements OnInit {
    @Output() readonly isSideNavOpened = new EventEmitter<boolean>();
    @Output() readonly discardChanges = new EventEmitter<any>();
    @Output() readonly saveMandatory = new EventEmitter();
    @Output() readonly dmsInterfaceStatus = new EventEmitter();
    interfaceActiveCtrl = new AtlasFormControl('InterfaceActive');
    platformIdCtrl = new AtlasFormControl('PlatformId');
    platformLabelCtrl = new AtlasFormControl('PlatformLabel');
    regionIdCtrl = new AtlasFormControl('RegionId');
    regionLabelCtrl = new AtlasFormControl('RegionLabel');
    isIntefaceToggleChecked: boolean;
    checkEdit: boolean;
    interfaceActive: string;
    currentCompany: string;
    companyId: string;

    constructor(protected formConfigurationProvider: FormConfigurationProviderService,
        private route: ActivatedRoute,
        protected formBuilder: FormBuilder) { super(formConfigurationProvider); }

    ngOnInit() {
        this.currentCompany = decodeURIComponent(this.route.snapshot.paramMap.get('company'));
        this.companyId = this.route.snapshot.paramMap.get('companyId');
        if (!this.companyId) {
            this.checkEdit = true;
        }
        this.interfaceActive = (this.isIntefaceToggleChecked) ? 'Active' : 'InActive';
        this.dmsInterfaceStatus.emit(this.isIntefaceToggleChecked);
        if (!this.isIntefaceToggleChecked) {
            this.platformIdCtrl.disable();
            this.platformLabelCtrl.disable();
            this.regionIdCtrl.disable();
            this.regionLabelCtrl.disable();
        }
    }

    initForm(companyConfigurationRecord, isEdit) {
        this.checkEdit = isEdit;
        if (!isEdit) {
            this.formGroup.disable();
        } else {
            this.formGroup.enable();
        }
        return companyConfigurationRecord;
    }

    getFormGroup() {
        this.formGroup = this.formBuilder.group({
            interfaceActiveCtrl: this.interfaceActiveCtrl,
            platformIdCtrl: this.platformIdCtrl,
            platformLabelCtrl: this.platformLabelCtrl,
            regionIdCtrl: this.regionIdCtrl,
            regionLabelCtrl: this.regionLabelCtrl,
        });
        return super.getFormGroup();
    }

    onDiscardButtonClicked() {
        this.discardChanges.emit({ selectedOptionName: 'DmsComponent' });
    }

    onSaveButtonClicked() {
        this.isSideNavOpened.emit(false);
        this.saveMandatory.emit();
    }

    onInterfaceActiveToggleChanged(value: MatSlideToggleChange) {
        this.isIntefaceToggleChecked = value.checked;
        if (!this.isIntefaceToggleChecked) {
            this.platformIdCtrl.disable();
            this.platformLabelCtrl.disable();
            this.regionIdCtrl.disable();
            this.regionLabelCtrl.disable();
        } else {
            this.platformIdCtrl.enable();
            this.platformLabelCtrl.enable();
            this.regionIdCtrl.enable();
            this.regionLabelCtrl.enable();
        }

        this.dmsInterfaceStatus.emit(this.isIntefaceToggleChecked);
    }
}
