import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthorizationService } from '../../../../../core/services/authorization.service';
import { BaseFormComponent } from '../../../../../shared/components/base-form-component/base-form-component.component';
import { AtlasFormControl } from '../../../../../shared/entities/atlas-form-control';
import { SectionCompleteDisplayView } from '../../../../../shared/models/section-complete-display-view';
import { FormConfigurationProviderService } from '../../../../../shared/services/form-configuration-provider.service';
import { SecurityService } from '../../../../../shared/services/security.service';
import { PhysicalFixedPricedContract } from '../../../../entities/physical-fixed-priced-contract.entity';
import { TradeImageField } from './../../../../../shared/services/trading/dtos/tradeImageField';

@Component({
    selector: 'atlas-memo-form-component',
    templateUrl: './memo-form-component.component.html',
    styleUrls: ['./memo-form-component.component.scss'],
})
export class MemoFormComponent extends BaseFormComponent implements OnInit {
    isInputField = true;
    model: SectionCompleteDisplayView = new SectionCompleteDisplayView();
    memoCtrl: AtlasFormControl = new AtlasFormControl('Memorandum');
    tradeImageDetails: TradeImageField[] = [];
    company: string;
    internalMemorandumPrivilege: boolean = false;

    constructor(
        protected formbuilder: FormBuilder,
        protected formConfigurationProvider: FormConfigurationProviderService,
        private route: ActivatedRoute,
        protected authorizationService: AuthorizationService,
        protected securityService: SecurityService,
    ) {
        super(formConfigurationProvider);
    }

    ngOnInit() {
        this.setValidators();
        this.bindConfiguration();
        this.checkInternalMemorandumPrivilege();
    }
    setValidators() {
        this.memoCtrl.setValidators(
            Validators.compose([Validators.maxLength(2000)]),
        );
        this.formGroup.updateValueAndValidity();
    }

    getFormGroup() {
        this.formGroup = this.formbuilder.group({
            memoCtrl: this.memoCtrl,
        });
        return super.getFormGroup();
    }

    initForm(entity: any, isEdit: boolean): any {
        const tradeRecord = new SectionCompleteDisplayView(entity);
        this.model = tradeRecord;
        this.isInputField = isEdit;

        if (this.model.memorandum != null) {
            this.formGroup.patchValue({ memoCtrl: this.model.memorandum });
        }
        if (!isEdit) {
            this.memoCtrl.disable();
        }
        if (this.route.snapshot.data['isImage'] === true) {
            if (this.tradeImageDetails && this.tradeImageDetails.length > 0) {
                if (!this.tradeImageDetails.filter((e) => e.tradeFieldName === 'Memorandum')[0].isEdit) {
                    this.memoCtrl.disable();
                }
                if (!this.tradeImageDetails.filter((e) => e.tradeFieldName === 'Memorandum')[0].isCopy) {
                    this.memoCtrl.patchValue(null);
                } else {
                    this.formGroup.patchValue({ memoCtrl: this.model.memorandum });
                }
            }
        }
        return entity;
    }

    populateEntity(entity: any) {
        const section = entity as PhysicalFixedPricedContract;

        section.memorandum = this.memoCtrl.value;

        return entity;
    }
    checkInternalMemorandumPrivilege() {
        this.company = this.route.snapshot.paramMap.get('company');
        this.securityService.isSecurityReady().subscribe(() => {
            if (this.authorizationService.isPrivilegeAllowed(this.company, 'Trades') && this.authorizationService.isPrivilegeAllowed(this.company, 'MainTab')) {
                this.internalMemorandumPrivilege = this.authorizationService.isPrivilegeAllowed(this.company, 'InternalMemorandum');
            }
        });
        if (!this.internalMemorandumPrivilege) {
            this.memoCtrl.disable();
        }
    }
}
