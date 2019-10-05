import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { BaseFormComponent } from '../../../../../shared/components/base-form-component/base-form-component.component';
import { CompanyConfiguration } from '../../../../../shared/entities/company-configuration.entity';
import { MasterData } from '../../../../../shared/entities/masterdata.entity';
import { CompanyConfigurationRecord } from '../../../../../shared/services/configuration/dtos/company-configuration-record';
import { FormConfigurationProviderService } from '../../../../../shared/services/form-configuration-provider.service';
import { ConfigurationService } from '../../../../../shared/services/http-services/configuration.service';
import { AccountingParametersComponent } from './accounting-parameters/accounting-parameters.component';
import { FreezeParametersComponent } from './freeze-parameters/freeze-parameters.component';
import { TradeParametersComponent } from './trade-parameters/trade-parameters.component';

@Component({
    selector: 'atlas-itparameters-tab',
    templateUrl: './itparameters-tab.component.html',
    styleUrls: ['./itparameters-tab.component.scss'],
})
export class ItparametersTabComponent extends BaseFormComponent implements OnInit {
    @ViewChild('accountingParameterComponent') accountingParameterComponent: AccountingParametersComponent;
    @ViewChild('tradeParameterComponent') tradeParameterComponent: TradeParametersComponent;
    @ViewChild('freezeParameterComponent') freezeParameterComponent: FreezeParametersComponent;
    formComponents: BaseFormComponent[] = [];
    companyConfigurationRecord: CompanyConfigurationRecord;
    masterData: MasterData;
    company: string;
    isEdit: boolean;
    currentCompany: string;
    subscriptions: Subscription[] = [];

    constructor(protected formConfigurationProvider: FormConfigurationProviderService,
        private route: ActivatedRoute,
        protected dialog: MatDialog,
        protected formBuilder: FormBuilder,
        protected configurationService: ConfigurationService) { super(formConfigurationProvider); }

    ngOnInit() {
        this.company = this.route.snapshot.paramMap.get('companyId');
        this.masterData = this.route.snapshot.data.masterdata;
        this.formComponents.push(
            this.accountingParameterComponent,
            this.tradeParameterComponent,
            this.freezeParameterComponent,
        );
        this.currentCompany = decodeURIComponent(this.route.snapshot.paramMap.get('company'));
    }

    initForm(companyConfigurationRecord: CompanyConfigurationRecord, isEdit): CompanyConfigurationRecord {
        this.companyConfigurationRecord = companyConfigurationRecord;
        this.formComponents.forEach((comp) => {
            comp.initForm(companyConfigurationRecord, isEdit);
        });
        return companyConfigurationRecord;
    }

    populateEntity(entity: CompanyConfiguration): CompanyConfiguration {
        this.formComponents.forEach((comp) => {
            entity = comp.populateEntity(entity);
        });
        return entity;
    }
}
