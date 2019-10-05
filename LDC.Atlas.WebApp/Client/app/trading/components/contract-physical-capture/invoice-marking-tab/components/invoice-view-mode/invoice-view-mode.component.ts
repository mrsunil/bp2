import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatSlideToggleChange } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { AuthorizationService } from '../../../../../../core/services/authorization.service';
import { BaseFormComponent } from '../../../../../../shared/components/base-form-component/base-form-component.component';
import { AtlasFormControl } from '../../../../../../shared/entities/atlas-form-control';
import { MasterData } from '../../../../../../shared/entities/masterdata.entity';
import { PermissionLevels } from '../../../../../../shared/enums/permission-level.enum';
import { ViewDocumentType } from '../../../../../../shared/enums/view-document-type.enum';
import { ViewMode } from '../../../../../../shared/enums/view-mode.enum';
import { UserCompanyPrivilegeDto } from '../../../../../../shared/services/authorization/dtos/user-company-privilege';
import { FormConfigurationProviderService } from '../../../../../../shared/services/form-configuration-provider.service';
import { UtilService } from '../../../../../../shared/services/util.service';

@Component({
    selector: 'atlas-invoice-view-mode',
    templateUrl: './invoice-view-mode.component.html',
    styleUrls: ['./invoice-view-mode.component.scss'],
})
export class InvoiceViewModeComponent extends BaseFormComponent implements OnInit {

    translationKeyPrefix: string = 'TRADING.TRADE_CAPTURE.INVOICE_MARKING_TAB.VIEW_MODE.';

    constructor(private route: ActivatedRoute,
        protected formBuilder: FormBuilder,
        protected utilService: UtilService,
        private authorizationService: AuthorizationService,
        protected formConfigurationProvider: FormConfigurationProviderService,
    ) {
        super(formConfigurationProvider);
    }
    @Output() readonly documentTypeSelected = new EventEmitter<string[]>();
    @Output() readonly editToggleChanged = new EventEmitter<boolean>();
    showDetailsCtrl = new AtlasFormControl('showDetailsCtrl');
    viewDocumentTypeCtrl = new AtlasFormControl('viewDocumentTypeCtrl');
    toggleText: string = this.translationKeyPrefix + 'INACTIVE';

    viewModeTrades: string[];
    viewDocumentTypes: string[];
    masterdata: MasterData;
    company: string;
    isEdit = false;
    viewModeFilters: string[];

    editEstimatedColumnsPrivilege: UserCompanyPrivilegeDto = {
        profileId: null,
        privilegeName: 'Trades',
        permission: PermissionLevels.ReadWrite,
        privilegeParentLevelOne: 'Physical',
        privilegeParentLevelTwo: null,
    };

    editPrivileges = {
        buttonEditable: true,
    };

    ngOnInit() {
        this.masterdata = this.route.snapshot.data.masterdata;
        this.bindConfiguration();
        this.viewDocumentTypes = this.getDocumentTypesEnumArray();
        this.viewModeTrades = this.getViewModeEnumArray();
        this.viewDocumentTypeCtrl.patchValue(ViewDocumentType.All);
        this.showDetailsCtrl.patchValue(ViewMode.ThisTrade);
        this.company = this.route.snapshot.paramMap.get('company');
    }

    getDocumentTypesEnumArray(): string[] {
        const viewModeEnum = Object.values(ViewDocumentType);
        return viewModeEnum;
    }

    getViewModeEnumArray(): string[] {
        const viewModeObjectEnum = Object.values(ViewMode);
        return viewModeObjectEnum;
    }

    onDocumentTypeChange(value) {
        this.viewModeFilters = [this.showDetailsCtrl.value, value.source.triggerValue];
        this.documentTypeSelected.emit(this.viewModeFilters);
    }

    onViewModeChange(value) {
        this.viewModeFilters = [value.source.triggerValue, this.viewDocumentTypeCtrl.value];
        this.documentTypeSelected.emit(this.viewModeFilters);
    }

    initForm(entity: any, isEdit: boolean): any {
        this.isEdit = isEdit;
        this.editPrivileges.buttonEditable = this.checkIfUserHasRequiredPrivileges(this.editEstimatedColumnsPrivilege);
        return entity;
    }

    checkIfUserHasRequiredPrivileges(userCompanyPrivilege: UserCompanyPrivilegeDto) {
        if (this.authorizationService.isUserAllowedForCompany(this.company)) {
            const userPermissionLevel = this.authorizationService.getPermissionLevel(
                this.company,
                userCompanyPrivilege.privilegeName,
                userCompanyPrivilege.privilegeParentLevelOne,
                userCompanyPrivilege.privilegeParentLevelTwo);
            if (userPermissionLevel >= userCompanyPrivilege.permission) {
                return true;
            }
        }
        return false;
    }

    onChange(value: MatSlideToggleChange) {
        if (value.checked) {
            this.toggleText = this.translationKeyPrefix + 'ACTIVE';
            this.editToggleChanged.emit(true);
        } else {
            this.toggleText = this.translationKeyPrefix + 'INACTIVE';
            this.editToggleChanged.emit(false);
        }
    }
}
