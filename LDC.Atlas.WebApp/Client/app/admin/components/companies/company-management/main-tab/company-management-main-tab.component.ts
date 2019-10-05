import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthorizationService } from '../../../../../core/services/authorization.service';
import { BaseFormComponent } from '../../../../../shared/components/base-form-component/base-form-component.component';
import { FormConfigurationProviderService } from '../../../../../shared/services/form-configuration-provider.service';
import { SecurityService } from '../../../../../shared/services/security.service';
import { DefaultBrokerComponent } from './default-broker/default-broker.component';
import { DetailsComponent } from './details/details.component';
import { IdentityComponent } from './identity/identity.component';
import { LocationComponent } from './location/location.component';

@Component({
    selector: 'atlas-company-management-main-tab',
    templateUrl: './company-management-main-tab.component.html',
    styleUrls: ['./company-management-main-tab.component.scss'],
})
export class CompanyManagementMainTabComponent extends BaseFormComponent implements OnInit {
    @ViewChild('identityComponent') identityComponent: IdentityComponent;
    @ViewChild('locationComponent') locationComponent: LocationComponent;
    @ViewChild('detailsComponent') detailsComponent: DetailsComponent;
    @ViewChild('defaultBrokerComponent') defaultBrokerComponent: DefaultBrokerComponent;

    formComponents: BaseFormComponent[] = [];
    mainTabFormGroup: FormGroup;
    editMainTab: boolean;
    currentCompany: string;
    companyId: any;

    constructor(protected formConfigurationProvider: FormConfigurationProviderService,
        protected formBuilder: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private authorizationService: AuthorizationService,
        private securityService: SecurityService) { super(formConfigurationProvider); }

    ngOnInit() {
        this.currentCompany = decodeURIComponent(this.route.snapshot.paramMap.get('company'));
        this.companyId = this.route.snapshot.paramMap.get('companyId');
        this.formComponents.push(
            this.identityComponent,
            this.locationComponent,
            this.detailsComponent,
            this.defaultBrokerComponent,
        );
        this.securityService.isSecurityReady().subscribe(() => {
            if (this.authorizationService.isPrivilegeAllowed(this.currentCompany, 'Administration')
                && this.authorizationService.isPrivilegeAllowed(this.currentCompany, 'CompanyConfRead')) {
                this.editMainTab = this.authorizationService.isPrivilegeAllowed(this.currentCompany, 'CompanyConfEditMain');
            }
        });
    }

    getFormGroup() {
        this.mainTabFormGroup = this.formBuilder.group({
            identityGroup: this.identityComponent.getFormGroup(),
            locationGroup: this.locationComponent.getFormGroup(),
            detailsGroup: this.detailsComponent.getFormGroup(),
            defaultBrokerComponent: this.defaultBrokerComponent.getFormGroup(),
        });

        return super.getFormGroup();
    }

    initForm(companyConfigurationRecord: any, isEdit): any {
        this.formComponents.forEach((comp) => {
            companyConfigurationRecord = comp.initForm(companyConfigurationRecord, isEdit);
        });
        if (!this.editMainTab) {
            this.mainTabFormGroup.disable();
        }
        return companyConfigurationRecord;
    }

    populateEntity(entity: any): any {
        this.formComponents.forEach((comp) => {
            entity = comp.populateEntity(entity);
        });
        return entity;
    }
}
