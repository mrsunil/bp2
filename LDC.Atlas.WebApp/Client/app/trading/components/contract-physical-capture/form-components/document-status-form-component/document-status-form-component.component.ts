import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthorizationService } from '../../../../../core/services/authorization.service';
import { BaseFormComponent } from '../../../../../shared/components/base-form-component/base-form-component.component';
import { AtlasFormControl } from '../../../../../shared/entities/atlas-form-control';
import { SectionCompleteDisplayView } from '../../../../../shared/models/section-complete-display-view';
import { FormConfigurationProviderService } from '../../../../../shared/services/form-configuration-provider.service';
import { SecurityService } from '../../../../../shared/services/security.service';
import { PhysicalFixedPricedContract } from '../../../../entities/physical-fixed-priced-contract.entity';

@Component({
    selector: 'atlas-document-status-form-component',
    templateUrl: './document-status-form-component.component.html',
    styleUrls: ['./document-status-form-component.component.scss'],
})
export class DocumentStatusFormComponentComponent extends BaseFormComponent implements OnInit {

    lastDocumentIssuedDateCtrl = new AtlasFormControl('lastDocumentIssuedDateCtrl');
    otherReferenceCtrl = new AtlasFormControl('otherReferenceCtrl');
    model: SectionCompleteDisplayView;
    isTradeImage = false;
    company: string;
    contractIssuedOnPrivilege: boolean = false;
    otherReferencePrivilege: boolean = false;
    hasEmptyState: boolean = true;
    isEmpty: boolean = true;
    documentEmptyMessage: string = 'No document has been issued yet';
    lastEmailReceivedDateCtrl = new AtlasFormControl('lastEmailReceivedDateCtrl');
    contractReturnedDateCtrl = new AtlasFormControl('contractReturnedDateCtrl');
    contractSentDateCtrl = new AtlasFormControl('contractSentDateCtrl');

    constructor(protected formBuilder: FormBuilder,
        protected route: ActivatedRoute,
        protected formConfigurationProvider: FormConfigurationProviderService,
        protected authorizationService: AuthorizationService,
        protected securityService: SecurityService) {
        super(formConfigurationProvider);
    }

    ngOnInit() {
        if (this.route.snapshot.data['isImage'] === true) {
            this.isTradeImage = true;
        }
        this.checkDocumentStatusFormPrivileges();
    }
    getFormGroup() {
        this.formGroup = this.formBuilder.group({
            lastDocumentIssuedDateCtrl: this.lastDocumentIssuedDateCtrl,
            lastEmailReceivedDateCtrl: this.lastEmailReceivedDateCtrl,
            contractReturnedDateCtrl: this.contractReturnedDateCtrl,
            contractSentDateCtrl: this.contractSentDateCtrl,
            otherReferenceCtrl: this.otherReferenceCtrl,
        });
        return super.getFormGroup();
    }
    initForm(entity: any, isEdit: boolean) {
        const tradeRecord = new SectionCompleteDisplayView(entity);
        this.model = tradeRecord;

        if (this.model.lastDocumentIssuedDate != null) {
            this.formGroup.patchValue({ lastDocumentIssuedDateCtrl: this.model.lastDocumentIssuedDate });
            this.isEmpty = false;
        }
        if (this.model.lastEmailReceivedDate != null) {
            this.formGroup.patchValue({ lastEmailReceivedDateCtrl: this.model.lastEmailReceivedDate });
            this.isEmpty = false;
        }
        if (this.model.contractReturnedDate != null) {
            this.formGroup.patchValue({ contractReturnedDateCtrl: this.model.contractReturnedDate });
            this.isEmpty = false;
        }
        if (this.model.contractSentDate != null) {
            this.formGroup.patchValue({ contractSentDateCtrl: this.model.contractSentDate });
            this.isEmpty = false;
        }

        if (!isEdit) {
            this.formGroup.disable();
        }
        const reference = this.model.reference;
        if (this.isTradeImage) {
            this.otherReferenceCtrl.patchValue(reference);
            this.lastDocumentIssuedDateCtrl.disable();
            this.lastEmailReceivedDateCtrl.disable();
            this.contractReturnedDateCtrl.disable();
            this.contractSentDateCtrl.disable();
            this.isEmpty = false;
        } else if (this.model.otherReference) {
            this.otherReferenceCtrl.patchValue(this.model.otherReference);
            this.isEmpty = false;
        }
        this.hasEmptyState = this.isEmpty && !isEdit;
    }
    populateEntity(entity: any): any {
        const section = entity as PhysicalFixedPricedContract;
        section.lastDocumentIssuedDate = this.lastDocumentIssuedDateCtrl.value;
        section.lastEmailReceivedDate = this.lastEmailReceivedDateCtrl.value;
        section.contractReturnedDate = this.contractReturnedDateCtrl.value;
        section.contractSentDate = this.contractSentDateCtrl.value;
        section.otherReference = this.otherReferenceCtrl.value;
        return section;
    }
    checkDocumentStatusFormPrivileges() {
        this.company = this.route.snapshot.paramMap.get('company');
        this.securityService.isSecurityReady().subscribe(() => {
            if (this.authorizationService.isPrivilegeAllowed(this.company, 'Trades') && this.authorizationService.isPrivilegeAllowed(this.company, 'StatusTab')) {
                this.contractIssuedOnPrivilege = this.authorizationService.isPrivilegeAllowed(this.company, 'ContractIssuedOn');
                this.otherReferencePrivilege = this.authorizationService.isPrivilegeAllowed(this.company, 'OtherReference');

            }
        });
        if (!this.contractIssuedOnPrivilege) {
            this.lastDocumentIssuedDateCtrl.disable();
        }
        if (!this.otherReferencePrivilege) {
            this.otherReferenceCtrl.disable();
        }

    }
}
