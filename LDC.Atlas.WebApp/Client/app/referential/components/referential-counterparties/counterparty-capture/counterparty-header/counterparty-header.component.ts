import { Component, OnInit, Input } from '@angular/core';
import { BaseFormComponent } from '../.././../../../shared/components/base-form-component/base-form-component.component';
import { AtlasFormControl } from '../.././../../../shared/entities/atlas-form-control'
import { FormConfigurationProviderService } from '../.././../../../shared/services/form-configuration-provider.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Counterparty } from '../.././../../../shared/entities/counterparty.entity';

@Component({
    selector: 'atlas-counterparty-header',
    templateUrl: './counterparty-header.component.html',
    styleUrls: ['./counterparty-header.component.scss']
})

export class CounterpartyHeaderComponent extends BaseFormComponent implements OnInit {
    headerFormGroup: FormGroup;
    accountRefCtrl = new AtlasFormControl('AccountRef');
    accountTitleCtrl = new AtlasFormControl('AccountTitle');
    createdByCtrl = new AtlasFormControl('CreatedBy');
    creationDateCtrl = new AtlasFormControl('CreationDate');
    lastAmendedByCtrl = new AtlasFormControl('LastAmendedBy');
    modifiedDateCtrl = new AtlasFormControl('ModifiedDate');
    counterpartyStatusCtrl = new AtlasFormControl('counterpartyStatus');
    statusClassApplied: string;
    isDeactivated: boolean = false;
    @Input() isEditMode: boolean = false;
    isLocalViewMode: boolean = false;
    isAdmin: boolean = false;
    isShowLastAmendedBy: boolean = true;
    accountrefErrorMap: Map<string, string> = new Map()
        .set('required', 'Required*')
        .set('maxlength', 'Maximum 10 charcters Allowed');

    constructor(protected formBuilder: FormBuilder,
        protected formConfigurationProvider: FormConfigurationProviderService, ) {
        super(formConfigurationProvider);
    }

    ngOnInit() {
        if (this.isEditMode && this.isAdmin) {
            this.isLocalViewMode = true;
        }

        this.headerFormGroup = this.formBuilder.group({
            accountRefCtrl: this.accountRefCtrl,
            accountTitleCtrl: this.accountTitleCtrl,
            createdByCtrl: this.createdByCtrl,
            creationDateCtrl: this.creationDateCtrl,
            lastAmendedByCtrl: this.lastAmendedByCtrl,
            modifiedDateCtrl: this.modifiedDateCtrl
        });

        this.accountTitleCtrl.disable();
        this.createdByCtrl.disable();
        this.creationDateCtrl.disable();
        this.lastAmendedByCtrl.disable();
        this.modifiedDateCtrl.disable();

        if (this.isEditMode) {
            this.createdByCtrl.disable();
            this.creationDateCtrl.disable();
        }
        else {
            this.isLocalViewMode = true;
        }

        this.isLocalViewMode = false;
        this.setValidators();
        this.isShowLastAmendedBy = (this.lastAmendedByCtrl.value) ? true : false;
    }

    setValidators() {
        this.accountRefCtrl.setValidators(
            Validators.compose([Validators.required, Validators.maxLength(10)]),
        );

        this.formGroup.updateValueAndValidity();
    }

    getFormGroup() {
        this.formGroup = this.formBuilder.group({
            accountRefCtrl: this.accountRefCtrl,
            accountTitleCtrl: this.accountTitleCtrl,
            createdByCtrl: this.createdByCtrl,
            creationDateCtrl: this.creationDateCtrl,
            lastAmendedByCtrl: this.lastAmendedByCtrl,
            modifiedDateCtrl: this.modifiedDateCtrl
        });

        return super.getFormGroup();
    }

    onStatusChanged(event: any) {
        this.isDeactivated = (Number(event) == 0) ? false : true;
    }

    populateEntity(model: Counterparty) {
        model.counterpartyCode = this.accountRefCtrl.value;
        // model.createdBy = this.createdByCtrl.value;
        // model.createdDateTime = this.creationDateCtrl.value;
        model.isDeactivated = this.isDeactivated;
    }

    ngOnDestroy(): void {

    }
}
