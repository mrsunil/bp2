import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthorizationService } from '../../../../../../core/services/authorization.service';
import { BaseFormComponent } from '../../../../../../shared/components/base-form-component/base-form-component.component';
import { AtlasFormControl } from '../../../../../../shared/entities/atlas-form-control';
import { InvoiceStatus } from '../../../../../../shared/entities/invoice-status.entity';
import { MasterDataProps } from '../../../../../../shared/entities/masterdata-props.entity';
import { MasterData } from '../../../../../../shared/entities/masterdata.entity';
import { InvoiceStatus as InvoiceStatusEnum } from '../../../../../../shared/enums/invoice-status.enum';
import { PermissionLevels } from '../../../../../../shared/enums/permission-level.enum';
import { UserCompanyPrivilegeDto } from '../../../../../../shared/services/authorization/dtos/user-company-privilege';
import { FormConfigurationProviderService } from '../../../../../../shared/services/form-configuration-provider.service';
import { MasterdataService } from '../../../../../../shared/services/http-services/masterdata.service';
import { PhysicalFixedPricedContract } from '../../../../../entities/physical-fixed-priced-contract.entity';

@Component({
    selector: 'atlas-invoice-status',
    templateUrl: './invoice-status.component.html',
    styleUrls: ['./invoice-status.component.scss'],
})
export class InvoiceStatusComponent extends BaseFormComponent implements OnInit {

    translationKeyPrefix: string = 'TRADING.TRADE_CAPTURE.INVOICE_MARKING_TAB.INVOICING_STATUS.';

    constructor(protected formBuilder: FormBuilder,
        protected masterdataService: MasterdataService,
        private route: ActivatedRoute,
        private authorizationService: AuthorizationService,
        protected formConfigurationProvider: FormConfigurationProviderService) {
        super(formConfigurationProvider);
    }

    invoiceStatusCtrl = new AtlasFormControl('invoiceStatus');

    masterdata: MasterData;
    @Input() isEditToggle: boolean;
    invoiceStatusOptions: InvoiceStatus[];
    masterdataList: string[] = [
        MasterDataProps.InvoiceStatus,
    ];
    defaultInvoiceStatus: string;
    invoicedQuantityPercent: number;
    company: string;
    isEdit = false;

    editEstimatedColumnsPrivilege: UserCompanyPrivilegeDto = {
        profileId: null,
        privilegeName: 'Invoices',
        permission: PermissionLevels.ReadWrite,
        privilegeParentLevelOne: 'InvoiceCreation',
        privilegeParentLevelTwo: 'EditInvoicingMarkingStatus',
    };
    superTradeEditionPrivilege: UserCompanyPrivilegeDto = {
        profileId: null,
        privilegeName: 'SuperTradeEdition',
        permission: PermissionLevels.Read,
        privilegeParentLevelOne: 'Physicals',
        privilegeParentLevelTwo: 'Trades',
    };

    editPrivileges = {
        statusEditable: false,
        superTradeEdition: false,
    };

    ngOnInit() {
        this.masterdata = this.route.snapshot.data.masterdata;
        this.invoiceStatusOptions = this.masterdata.invoiceStatus;
        this.company = this.route.snapshot.paramMap.get('company');
        this.editPrivileges.statusEditable = this.checkIfUserHasRequiredPrivileges(this.editEstimatedColumnsPrivilege);
        this.editPrivileges.superTradeEdition = this.checkIfUserHasRequiredPrivileges(this.superTradeEditionPrivilege);
    }

    initForm(entity: any, isEdit: boolean): any {
        this.isEdit = isEdit;
        this.invoiceStatusCtrl.patchValue(entity.invoicingStatusId.toString());
        this.defaultInvoiceStatus = this.invoiceStatusCtrl.value;
        // If value is not available, add it
        if (!this.invoiceStatusOptions.find((invoiceStatus) => invoiceStatus.code === this.invoiceStatusCtrl.value)) {
            const currentInvoiceStatus = this.masterdata.invoiceStatus
                .find((invoiceStatus) => invoiceStatus.code === this.invoiceStatusCtrl.value);
            if (currentInvoiceStatus) {
                this.invoiceStatusOptions.push(currentInvoiceStatus);
            }
        }
        return entity;
    }

    populateEntity(entity: PhysicalFixedPricedContract): PhysicalFixedPricedContract {
        entity.invoiceStatus = this.invoiceStatusCtrl.value;
        return entity;
    }

    filterOptionList(model) {
        // If user has super trade edition privilege, he can put any invoice marking status
        if (this.editPrivileges.superTradeEdition) {
            return;
        }
        // Not invoiced
        if (!model.totalInvoiceValuePercent || model.totalInvoiceValuePercent === 0) {
            this.invoiceStatusOptions = this.masterdata.invoiceStatus.
                filter((invoiceStatus) => invoiceStatus.code === InvoiceStatusEnum.NotInvoiced.toString()
                    || invoiceStatus.code === this.invoiceStatusCtrl.value);
        } else if (model.totalInvoiceValuePercent < 100) {
            this.invoiceStatusOptions = this.masterdata.invoiceStatus.
                filter((invoiceStatus) => invoiceStatus.code !== InvoiceStatusEnum.NotInvoiced.toString()
                    || invoiceStatus.code === this.invoiceStatusCtrl.value);
        } else {
            // Fully invoiced
            this.invoiceStatusOptions = this.masterdata.invoiceStatus.
                filter((invoiceStatus) => invoiceStatus.code === InvoiceStatusEnum.FullyInvoiced.toString()
                    || invoiceStatus.code === this.invoiceStatusCtrl.value);
        }
    }

    setInvoiceStatusOnChange(totalValues) {
        if (totalValues.isDeleted) {
            this.setReversalInvoiceStatus(totalValues.totalQuantity, totalValues.isDeleted);
        } else {
            if (!this.invoiceStatusCtrl.value) {
                if (!totalValues.totalInvoiceValuePercent || totalValues.totalInvoiceValuePercent === 0) {
                    this.invoiceStatusCtrl.patchValue(InvoiceStatusEnum.NotInvoiced.toString());
                } else if (totalValues.totalInvoiceValuePercent < 100) {
                    // Has been invoiced, but not fully
                    this.invoiceStatusCtrl.patchValue(InvoiceStatusEnum.NotFullyInvoiced.toString());
                } else {
                    // Fully invoiced
                    this.invoiceStatusCtrl.patchValue(InvoiceStatusEnum.FullyInvoiced.toString());
                }
            }
            this.defaultInvoiceStatus = this.invoiceStatusCtrl.value;
            this.invoicedQuantityPercent = totalValues.totalQuantityPercent;
        }
        this.filterOptionList(totalValues);
    }

    setInvoiceStatusOnPageLoad(totalValues) {
        this.invoicedQuantityPercent = totalValues.totalQuantityPercent;
        this.filterOptionList(totalValues);
    }

    setReversalInvoiceStatus(totalQuantity: number, isDeleted: boolean) {
        if (isDeleted && !this.invoiceStatusCtrl.value) { // Value should come from backend, not calculated
            const finalInvoiceStatus: string = this.invoiceStatusCtrl.value;
            if (finalInvoiceStatus === InvoiceStatusEnum.NotFullyInvoiced.toString() ||
                finalInvoiceStatus === InvoiceStatusEnum.FullyInvoiced.toString()) {
                if (totalQuantity === 0) {
                    this.invoiceStatusCtrl.patchValue(InvoiceStatusEnum.NotInvoiced.toString());
                } else {
                    this.invoiceStatusCtrl.patchValue(InvoiceStatusEnum.NotFullyInvoiced.toString());
                }
            }
        }
    }

    checkIfUserHasRequiredPrivileges(userCompanyPrivilege: UserCompanyPrivilegeDto) {
        const userPermissionLevel = this.authorizationService.getPermissionLevel(
            this.company,
            userCompanyPrivilege.privilegeName,
            userCompanyPrivilege.privilegeParentLevelOne,
            userCompanyPrivilege.privilegeParentLevelTwo);
        if (userPermissionLevel >= userCompanyPrivilege.permission) {
            return true;
        }
        return false;
    }
}
