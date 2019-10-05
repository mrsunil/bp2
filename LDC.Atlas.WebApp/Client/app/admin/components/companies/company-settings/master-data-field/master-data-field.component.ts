import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSlideToggleChange } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { BaseFormComponent } from '../../../../../shared/components/base-form-component/base-form-component.component';
import { AtlasFormControl } from '../../../../../shared/entities/atlas-form-control';
import { CreateCompany } from '../../../../../shared/entities/create-company.entity';
import { FormConfigurationProviderService } from '../../../../../shared/services/form-configuration-provider.service';
import { ConfigurationService } from '../../../../../shared/services/http-services/configuration.service';

@Component({
    selector: 'atlas-master-data-field',
    templateUrl: './master-data-field.component.html',
    styleUrls: ['./master-data-field.component.scss'],
})
export class MasterDataFieldComponent extends BaseFormComponent implements OnInit, OnDestroy {
    @Output() readonly isCounterpartyToggleEnabled = new EventEmitter<boolean>();
    masterDataCtrl = new AtlasFormControl('MasterData');
    formComponents: BaseFormComponent[] = [];
    formGroup: FormGroup;
    isCounterpartySelected: boolean = false;
    subscription: Subscription[] = [];
    selectedCompany: string;
    isCounterpartyExist: boolean;

    constructor(protected formConfigurationProvider: FormConfigurationProviderService,
        protected formBuilder: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        protected configurationService: ConfigurationService,
    ) {
        super(formConfigurationProvider);
    }

    ngOnInit() {
        this.selectedCompany = (decodeURIComponent(this.route.snapshot.paramMap.get('companyId')));
        this.subscription.push(this.configurationService.checkCounterypartyExists
            (this.selectedCompany).subscribe((data: boolean) => {
                if (data) {
                    this.isCounterpartyExist = this.isCounterpartySelected = data;
                    this.masterDataCtrl.setValue(this.isCounterpartyExist);
                    this.isCounterpartyToggleEnabled.emit(this.isCounterpartySelected);
                }
            }));
    }

    ngOnDestroy() {
        this.subscription.forEach((subscription) => {
            if (subscription) {
                subscription.unsubscribe();
            }
        });
    }

    populateEntity(entity: CreateCompany): CreateCompany {
        const companyCreation = entity;
        companyCreation.isCounterpartyRequired = this.isCounterpartySelected;
        return companyCreation;
    }

    getFormGroup() {
        this.formGroup = this.formBuilder.group({
            masterDataCtrl: this.masterDataCtrl,
        });
        return super.getFormGroup();
    }

    onCounterpartyToggleChange(value: MatSlideToggleChange) {
        this.isCounterpartySelected = value.checked;
        this.isCounterpartyToggleEnabled.emit(this.isCounterpartySelected);

    }

}
