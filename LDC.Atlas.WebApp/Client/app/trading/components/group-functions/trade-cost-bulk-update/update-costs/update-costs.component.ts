import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthorizationService } from '../../../../../core/services/authorization.service';
import { CompanyManagerService } from '../../../../../core/services/company-manager.service';
import { BaseFormComponent } from '../../../../../shared/components/base-form-component/base-form-component.component';
import { FormConfigurationProviderService } from '../../../../../shared/services/form-configuration-provider.service';
import { SecurityService } from '../../../../../shared/services/security.service';
import { AddCostsComponent } from './components/add-costs/add-costs.component';
import { EditCostsComponent } from './components/edit-costs/edit-costs.component';

@Component({
    selector: 'atlas-update-costs',
    templateUrl: './update-costs.component.html',
    styleUrls: ['./update-costs.component.scss'],
})
export class UpdateCostsComponent extends BaseFormComponent implements OnInit {
    @ViewChild('addCostsComponent') addCostsComponent: AddCostsComponent;
    @ViewChild('editCostsComponent') editCostsComponent: EditCostsComponent;

    tradeCostBulkUpdateFormGroup: FormGroup;
    formComponents: BaseFormComponent[] = [];
    noActPrivilege: boolean = false;
    pnlPrivilege: boolean = false;

    constructor(protected formConfigurationProvider: FormConfigurationProviderService,
        private companyManager: CompanyManagerService,
        private authorizationService: AuthorizationService,
        private securityService: SecurityService,
        protected formBuilder: FormBuilder) {
        super(formConfigurationProvider);
    }

    ngOnInit() {
        this.tradeCostBulkUpdateFormGroup = this.formBuilder.group({
            editCostsComponent: this.editCostsComponent.getFormGroup(),
        });
        this.formComponents.push(this.editCostsComponent);
        this.getCostsPrivilege();
    }

    getFormGroup() {
        return super.getFormGroup();
    }

    OnNewCostsAdded($event) {
        if ($event) {
            this.editCostsComponent.setNewCosts($event.costs);
        }
    }

    populateEntity(model: any): any {
        this.formComponents.forEach((comp) => {
            comp.populateEntity(model);
        });
        return model;
    }

    getCostsPrivilege() {
        const company: string = this.companyManager.getCurrentCompanyId();
        this.securityService.isSecurityReady().subscribe(() => {
            if (this.authorizationService.isPrivilegeAllowed(company, 'Trades')
                && this.authorizationService.isPrivilegeAllowed(company, 'CostTab')) {
                this.noActPrivilege = this.authorizationService.isPrivilegeAllowed(company, 'COSTSNOACT');
                this.pnlPrivilege = this.authorizationService.isPrivilegeAllowed(company, 'COSTSINP&L');
            }
        });
    }

}
