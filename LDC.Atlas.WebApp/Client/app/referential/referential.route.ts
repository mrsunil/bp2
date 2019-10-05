import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MasterDataProps } from '../shared/entities/masterdata-props.entity';
import { PermissionLevels } from '../shared/enums/permission-level.enum';
import { CanDeactivateGuard } from '../shared/guards/can-deactivate-guard.service';
import { SecurityGuard } from '../shared/guards/security.guard';
import { CompanyDateResolver } from '../shared/resolvers/company-date.resolver';
import { FormConfigurationResolver } from '../shared/resolvers/form-configuration.resolver';
import { MasterDataResolver } from '../shared/resolvers/masterdata.resolver';
import { ReferentialBulkAmendmentComponentComponent } from './components/referential-bulk-amendment/referential-bulk-amendment-component.component';
import { CounterpartyCaptureComponent } from './components/referential-counterparties/counterparty-capture/counterparty-capture.component';
import { ReferentialCounterpartiesComponent } from './components/referential-counterparties/referential-counterparties.component';
import { ReferentialMasterDataComponentComponent } from './components/referential-master-data-component/referential-master-data-component.component';
import { ReferentialMasterDataMenuComponentComponent } from './components/referential-master-data-menu-component/referential-master-data-menu-component.component';
import { TradingAndExecutionComponentComponent } from './components/trading-and-execution-component/trading-and-execution-component.component';
import { ReferentialMasterDataTitleResolver } from './resolvers/referential-master-data-title.resolver';

export const routes: Routes = [
    {
        path: '',
        component: ReferentialMasterDataMenuComponentComponent,
        canActivate: [SecurityGuard],
        resolve: {
            companyDate: CompanyDateResolver,
        },
    },
    {
        path: 'tradeexecution',
        component: TradingAndExecutionComponentComponent,
        canActivate: [SecurityGuard],
        data: {
            animation: 'tradeexecution',
            title: 'Referential',
            isHomePage: false,
            privilegeLevel1Name: null,
            authorizations: [
                {
                    privilegeName: 'TradingAndExecution',
                    permission: PermissionLevels.Read,
                    parentLevelOne: 'Referential',
                },
            ],
        },
        resolve: {
            companyDate: CompanyDateResolver,
        },
    },
    {
        path: 'masterdata/counterparties',
        component: ReferentialCounterpartiesComponent,
        canActivate: [SecurityGuard],
        data:
        {
            animation: 'counterparties',
            title: 'Counterparties', isHomePage: false, privilegeLevel1Name: null,
            masterdataList: [
                MasterDataProps.Counterparties,
                MasterDataProps.Departments,
                MasterDataProps.AccountTypes,
                MasterDataProps.Countries,
                MasterDataProps.LdcRegion,

            ],
        },
        resolve: {
            formConfiguration: FormConfigurationResolver,
            masterdata: MasterDataResolver,
            companyDate: CompanyDateResolver,
        },
    },

    {
        path: 'tradeexecution/counterparties/bulkamendment',
        component: ReferentialBulkAmendmentComponentComponent,
        canActivate: [SecurityGuard],
        data:
        {
            animation: 'counterparties',
            title: 'Counterparties', isHomePage: true, privilegeLevel1Name: null,
            masterdataList: [
                MasterDataProps.Countries,
                MasterDataProps.Counterparties,
                MasterDataProps.Departments,
                MasterDataProps.AccountTypes,
                MasterDataProps.LdcRegion,
                MasterDataProps.TradeStatus,
                MasterDataProps.Province,
                MasterDataProps.AddressTypes,
                MasterDataProps.Companies,
            ],
            authorizations: [
                {
                    privilegeName: 'TradingAndExecution',
                    permission: 2,
                    parentLevelOne: 'Referential',
                    privilegeParentLevelTwo: null,
                },
            ],
        },
        resolve: {
            formConfiguration: FormConfigurationResolver,
            masterdata: MasterDataResolver,
            companyDate: CompanyDateResolver,
        },
    },

    {
        path: 'counterparty/display/:counterpartyID',
        component: CounterpartyCaptureComponent,
        canActivate: [SecurityGuard],
        canDeactivate: [CanDeactivateGuard],
        data: {
            animation: 'counterpartyDisplay',
            title: 'Counterparty View',
            formId: 'CounterPartyDisplay', isHomePage: false, privilegeLevel1Name: null,
            masterdataList: [
                MasterDataProps.AccountTypes,
                MasterDataProps.AddressTypes,
                MasterDataProps.Companies,
                MasterDataProps.ContractTerms,
                MasterDataProps.Counterparties,
                MasterDataProps.Countries,
                MasterDataProps.Currencies,
                MasterDataProps.Departments,
                MasterDataProps.LdcRegion,
                MasterDataProps.Province,
                MasterDataProps.TradeStatus,
                MasterDataProps.Traders,
                MasterDataProps.MdmCategories,
            ],
            authorizations: [
                {
                    privilegeName: 'TradingAndExecution',
                    permission: 1,
                    parentLevelOne: 'Referential',
                    privilegeParentLevelTwo: null,
                },
            ],
        },
        resolve: {
            masterdata: MasterDataResolver,
            formConfiguration: FormConfigurationResolver,
            companyDate: CompanyDateResolver,
        },
    },
    {
        path: 'counterparty/edit/:counterpartyID',
        component: CounterpartyCaptureComponent,
        canActivate: [SecurityGuard],
        canDeactivate: [CanDeactivateGuard],
        data: {
            animation: 'counterpartyDisplay',
            title: 'Counterparty Edit',
            formId: 'CounterPartyEdit', isHomePage: false, privilegeLevel1Name: null,
            masterdataList: [
                MasterDataProps.AccountTypes,
                MasterDataProps.AddressTypes,
                MasterDataProps.Companies,
                MasterDataProps.ContractTerms,
                MasterDataProps.Counterparties,
                MasterDataProps.Countries,
                MasterDataProps.Currencies,
                MasterDataProps.Departments,
                MasterDataProps.LdcRegion,
                MasterDataProps.Province,
                MasterDataProps.TradeStatus,
                MasterDataProps.Traders,
                MasterDataProps.MdmCategories,
            ],
            authorizations: [
                {
                    privilegeName: 'TradingAndExecution',
                    permission: 2,
                    parentLevelOne: 'Referential',
                    privilegeParentLevelTwo: null,
                },
            ],
        },
        resolve: {
            masterdata: MasterDataResolver,
            formConfiguration: FormConfigurationResolver,
            companyDate: CompanyDateResolver,
        },
    },
    {
        path: 'counterparty/capture',
        component: CounterpartyCaptureComponent,
        canActivate: [SecurityGuard],
        canDeactivate: [CanDeactivateGuard],
        data: {
            animation: 'counterpartyDisplay',
            title: 'Counterparty Create',
            formId: 'CounterPartyCapture', isHomePage: false, privilegeLevel1Name: null,
            masterdataList: [
                MasterDataProps.Counterparties,
                MasterDataProps.Province,
                MasterDataProps.Countries,
                MasterDataProps.LdcRegion,
                MasterDataProps.Currencies,
                MasterDataProps.ContractTerms,
                MasterDataProps.Companies,
                MasterDataProps.Counterparties,
                MasterDataProps.MdmCategories,
            ],
            authorizations: [
                {
                    privilegeName: 'TradingAndExecution',
                    permission: 2,
                    parentLevelOne: 'Referential',
                    privilegeParentLevelTwo: null,
                },
            ],
        },
        resolve: {
            masterdata: MasterDataResolver,
            formConfiguration: FormConfigurationResolver,
            companyDate: CompanyDateResolver,
        },
    },
    {
        path: 'masterdata/:name',
        component: ReferentialMasterDataComponentComponent,
        canActivate: [SecurityGuard],
        data: {
            formId: 'MasterDataCapture', isHomePage: false, privilegeLevel1Name: null,
            masterdataList: [],
        },
        resolve: {
            masterdata: MasterDataResolver,
            companyDate: CompanyDateResolver,
            overrideTitle: ReferentialMasterDataTitleResolver,
        },
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ReferentialRoutingModule { }
