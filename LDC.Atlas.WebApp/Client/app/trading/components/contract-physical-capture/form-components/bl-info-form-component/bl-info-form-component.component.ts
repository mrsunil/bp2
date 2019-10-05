import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as _moment from 'moment';
import { AuthorizationService } from '../../../../../core/services/authorization.service';
import { CompanyManagerService } from '../../../../../core/services/company-manager.service';
import { BaseFormComponent } from '../../../../../shared/components/base-form-component/base-form-component.component';
import { Allocation } from '../../../../../shared/entities/allocation.entity';
import { AtlasFormControl } from '../../../../../shared/entities/atlas-form-control';
import { SectionTraffic } from '../../../../../shared/entities/section-traffic.entity';
import { ContractTypes } from '../../../../../shared/enums/contract-type.enum';
import { SectionCompleteDisplayView } from '../../../../../shared/models/section-complete-display-view';
import { FormConfigurationProviderService } from '../../../../../shared/services/form-configuration-provider.service';
import { ExecutionService } from '../../../../../shared/services/http-services/execution.service';
import { SecurityService } from '../../../../../shared/services/security.service';
import { isAfterDate, isDateTwoBeforeDateOne } from '../../../../../shared/validators/date-validators.validator';
import { TradeDataService } from '../../../../services/trade-data.service';
import { PermissionLevels } from './../../../../../shared/enums/permission-level.enum';
const moment = _moment;

@Component({
    selector: 'atlas-bl-info-form-component',
    templateUrl: './bl-info-form-component.component.html',
    styleUrls: ['./bl-info-form-component.component.scss'],
})
export class BlInfoFormComponent extends BaseFormComponent implements OnInit {
    blDateCtrl = new AtlasFormControl('BlDate');
    blReferenceCtrl = new AtlasFormControl('BlReference');
    groupingNumberCtrl = new AtlasFormControl('GroupingNumber');
    company: string;
    allocationModel: Allocation = new Allocation();
    sectionId: number;
    isDisabled = true;
    sectionTrafficModel: SectionTraffic = new SectionTraffic();
    tradeRecord: SectionCompleteDisplayView;
    contractDate: Date;
    isTradeImage = false;
    dataVersionId: number;
    blDatePrivilege: boolean = false;
    blReferencePrivilege: boolean = false;
    groupingNumberPrivilege: boolean = false;
    hasEmptyState: boolean = true;
    isEmpty: boolean = true;
    blDateEmptyMessage: string = 'You can edit the trade to add one';
    isFormEdit: boolean = false;
    @Output() readonly blDateChanged = new EventEmitter<any>();

    constructor(
        protected formBuilder: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        protected formConfigurationProvider: FormConfigurationProviderService,
        private executionService: ExecutionService,
        protected companyManager: CompanyManagerService,
        protected authorizationService: AuthorizationService,
        protected securityService: SecurityService,
        private tradeDataService: TradeDataService,
    ) {
        super(formConfigurationProvider);
    }

    contractDateSelected(contractDate: Date) {
        this.contractDate = contractDate;

        this.resetBlDateValidation();
    }

    ngOnInit() {
        this.company = this.route.snapshot.paramMap.get('company');
        this.sectionId = Number(this.route.snapshot.paramMap.get('sectionId'));
        this.dataVersionId = this.route.snapshot.paramMap.get('dataVersionId') ?
            Number(this.route.snapshot.paramMap.get('dataVersionId')) : null;

        this.formGroup = this.formBuilder.group({
            blDateCtrl: this.blDateCtrl,
            blReferenceCtrl: this.blReferenceCtrl,
        });
        this.setValidators();
        if (this.route.snapshot.data['isImage'] === true) {
            this.isTradeImage = true;
        }
        this.checkblInfoFormPrivileges();
    }

    resetBlDateValidation() {
        this.blDateCtrl.clearValidators();
        this.blDateCtrl.setValidators(
            Validators.compose([isAfterDate(this.companyManager.getCurrentCompanyDate())]));
        this.blDateCtrl.updateValueAndValidity();
        this.formGroup.updateValueAndValidity();
    }

    setValidators() {
        this.blReferenceCtrl.setValidators(Validators.compose([Validators.maxLength(255)]));
    }

    getFormGroup() {
        this.formGroup = this.formBuilder.group({
            blDateCtrl: this.blDateCtrl,
            blReferenceCtrl: this.blReferenceCtrl,
            groupingNumberCtrl: this.groupingNumberCtrl,
        });
        return super.getFormGroup();
    }

    initForm(entity: any, isEdit: boolean): any {
        this.tradeRecord = new SectionCompleteDisplayView(entity);
        if (this.sectionId !== 0) {
            this.subscriptions.push(this.tradeDataService.getTrafficDetails()
                .subscribe((data: SectionTraffic) => {
                    if (data) {
                        this.sectionTrafficModel = data;
                        this.formGroup.patchValue({ blDateCtrl: this.sectionTrafficModel.blDate });
                        this.formGroup.patchValue({ blReferenceCtrl: this.sectionTrafficModel.blReference });
                        this.isEmpty = !this.sectionTrafficModel.blDate && !this.sectionTrafficModel.blReference;
                        this.hasEmptyState = this.isEmpty && !isEdit;
                        this.onBlDateChanged();
                    }
                }));           
        }
        if (!isEdit) {
            this.isFormEdit = false;
            this.formGroup.disable();
            if (this.tradeRecord.type === ContractTypes[ContractTypes.Sale]) {
                if (!this.tradeRecord.allocatedTo) {
                    this.blDateEmptyMessage = 'The trade needs to be allocated first';
                }
            }
        } else if (isEdit) {
            this.isFormEdit = true;
            if (this.tradeRecord.type === ContractTypes[ContractTypes.Sale]) {
                if (this.tradeRecord.allocatedTo === null) {
                    this.blDateCtrl.disable();
                    this.isDisabled = false;
                }
            } else if (this.isTradeImage) {
                this.blReferenceCtrl.disable();
                this.blDateCtrl.disable();
            }
            if (this.tradeRecord.invoiceReference && this.authorizationService.getPermissionLevel(
                this.company,
                'Trades', 'Physicals', 'SuperTradeEdition') <= PermissionLevels.None) {
                this.blDateCtrl.disable();
            }
            this.hasEmptyState = false;
        }
        return entity;
    }
    disableControl() {
        this.groupingNumberCtrl.disable();
    }
    isBLDateBeforeContractDate() {
        const result = isDateTwoBeforeDateOne(this.contractDate, this.blDateCtrl.value);
        if (result) {
            return result;
        }
    }
    onBlDateChanged() {
        if (this.blDateCtrl.valid && this.blDateCtrl.value) {
            this.blDateChanged.emit(this.blDateCtrl.value);
        }
    }
    checkblInfoFormPrivileges() {
        this.securityService.isSecurityReady().subscribe(() => {
            if (this.authorizationService.isPrivilegeAllowed(this.company, 'Trades')
                && this.authorizationService.isPrivilegeAllowed(this.company, 'TrafficTab')) {
                this.blDatePrivilege = this.authorizationService.isPrivilegeAllowed(this.company, 'BlDate');
                this.blReferencePrivilege = this.authorizationService.isPrivilegeAllowed(this.company, 'BlReference');
                this.groupingNumberPrivilege = this.authorizationService.isPrivilegeAllowed(this.company, 'GroupingNumber');
            }
        });
        if (!this.blDatePrivilege) {
            this.blDateCtrl.disable();
        }
        if (!this.blReferencePrivilege) {
            this.blReferenceCtrl.disable();
        }
        if (!this.groupingNumberPrivilege) {
            this.groupingNumberCtrl.disable();
        }
    }

    onSectionTrafficDetailsChanged(data: SectionTraffic, isEdit: boolean) {
        this.sectionTrafficModel = data;
        this.formGroup.patchValue({ blDateCtrl: this.sectionTrafficModel.blDate });
        this.formGroup.patchValue({ blReferenceCtrl: this.sectionTrafficModel.blReference });
        this.isEmpty = !this.sectionTrafficModel.blDate && !this.sectionTrafficModel.blReference;
        this.hasEmptyState = this.isEmpty && !isEdit;
        this.onBlDateChanged();
    }

}
