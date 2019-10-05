import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSlideToggleChange } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseFormComponent } from '../../../../../shared/components/base-form-component/base-form-component.component';
import { AtlasFormControl } from '../../../../../shared/entities/atlas-form-control';
import { CreateCompany } from '../../../../../shared/entities/create-company.entity';
import { FormConfigurationProviderService } from '../../../../../shared/services/form-configuration-provider.service';

@Component({
    selector: 'atlas-transaction-data',
    templateUrl: './transaction-data.component.html',
    styleUrls: ['./transaction-data.component.scss'],
})
export class TransactionDataComponent extends BaseFormComponent implements OnInit {
    transactionDataCtrl = new AtlasFormControl('TransactionDataSelection');
    formComponents: BaseFormComponent[] = [];
    formGroup: FormGroup;
    isTransationalDataSelected: boolean = false;
    selectedCompany: string;

    constructor(protected formConfigurationProvider: FormConfigurationProviderService,
        private router: Router,
        private route: ActivatedRoute,
        protected formBuilder: FormBuilder) {
        super(formConfigurationProvider);
    }

    ngOnInit() {
        this.selectedCompany = (decodeURIComponent(this.route.snapshot.paramMap.get('companyId')));
    }

    populateEntity(entity: any): CreateCompany {
        const companyCreation = entity as CreateCompany;
        companyCreation.isTransactionDataSelected = this.isTransationalDataSelected;
        companyCreation.companyToCopy = this.selectedCompany;
        return companyCreation;
    }

    onTransactionDataToggleChange(value: MatSlideToggleChange) {
        this.isTransationalDataSelected = value.checked;
    }

    getFormGroup() {
        this.formGroup = this.formBuilder.group({
            transactionDataCtrl: this.transactionDataCtrl,
        });
        return super.getFormGroup();
    }

}
