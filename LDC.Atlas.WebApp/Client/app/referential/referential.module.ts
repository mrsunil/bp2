import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { AgGridModule } from 'ag-grid-angular';
import { MaterialModule } from '../shared/material.module';
import { ATLAS_DATE_FORMATS, SharedModule } from '../shared/shared.module';
import { CounterpartyApplyButtonComponent } from './components/referential-bulk-amendment/detail/apply/counterparty-apply-button.component';
import { CounterpartyDetailComponentComponent } from './components/referential-bulk-amendment/detail/counterparty-detail-component.component';
import { SelectMultiDropdownComponent } from './components/referential-bulk-amendment/detail/select-multi-dropdown/select-multi-dropdown.component';
import { CounterpartyListComponentComponent } from './components/referential-bulk-amendment/list/counterparty-list-component.component';
import { ReferentialBulkAmendmentComponentComponent } from './components/referential-bulk-amendment/referential-bulk-amendment-component.component';
import { CounterpartySummaryComponentComponent } from './components/referential-bulk-amendment/summary/counterparty-summary-component.component';
import { CounterpartyAddressCardComponent } from './components/referential-counterparties/counterparty-capture/address-tab/address-card/counterparty-address-card.component';
import { CounterpartyAddressDetailCardComponent } from './components/referential-counterparties/counterparty-capture/address-tab/address-detail-card/counterparty-address-detail-card.component';
import { CounterpartyCaptureFormAddressTabComponent } from './components/referential-counterparties/counterparty-capture/address-tab/counterparty-capture-form-address-tab.component';
import { CounterpartyBankAccountDetailsComponent } from './components/referential-counterparties/counterparty-capture/bank-account-tab/bank-account-details/counterparty-bank-account-details.component';
import { CounterpartyBankAccountListComponent } from './components/referential-counterparties/counterparty-capture/bank-account-tab/bank-account-list/counterparty-bank-account-list.component';
import { CounterpartyCaptureFormBankAccountTabComponent } from './components/referential-counterparties/counterparty-capture/bank-account-tab/counterparty-capture-form-bank-account-tab.component';
import { ContactDetailCardComponent } from './components/referential-counterparties/counterparty-capture/contact-tab/contact-detail-card/contact-detail-card.component';
import { ContactCardComponent } from './components/referential-counterparties/counterparty-capture/contact-tab/contact-list-card/contact-card.component';
import { CounterpartyCaptureFormContactTabComponent } from './components/referential-counterparties/counterparty-capture/contact-tab/counterparty-capture-form-contact-tab.component';
import { CounterpartyCaptureComponent } from './components/referential-counterparties/counterparty-capture/counterparty-capture.component';
import { CounterpartyHeaderComponent } from './components/referential-counterparties/counterparty-capture/counterparty-header/counterparty-header.component';
import { CounterpartyManagementMenuBarComponent } from './components/referential-counterparties/counterparty-capture/counterparty-management-menu-bar/counterparty-management-menu-bar.component';
import { AlternateMailingCardComponent } from './components/referential-counterparties/counterparty-capture/main-tab/alternate-mailing-card/alternate-mailing-card.component';
import { CounterpartyCaptureFormMainTabComponent } from './components/referential-counterparties/counterparty-capture/main-tab/counterparty-capture-form-main-tab.component';
import { CustomerDefaultCardComponent } from './components/referential-counterparties/counterparty-capture/main-tab/customer-default-card/customer-default-card.component';
import { AssociatedCounterpartiesCompanyComponent } from './components/referential-counterparties/counterparty-capture/main-tab/information-card/associated-company/associated-counterparties-company.component';
import { InformationCardComponent } from './components/referential-counterparties/counterparty-capture/main-tab/information-card/information-card.component';
import { MainAddressCardComponent } from './components/referential-counterparties/counterparty-capture/main-tab/main-address-card/main-address-card.component';
import { ThirdSystemCodesCardComponent } from './components/referential-counterparties/counterparty-capture/main-tab/third-system-codes-card/third-system-codes-card.component';
import { CounterpartyCaptureFormReportTabComponent } from './components/referential-counterparties/counterparty-capture/report-tab/counterparty-capture-form-report-tab.component';
import { CounterpartyCaptureFormTaxInfoTabComponent } from './components/referential-counterparties/counterparty-capture/tax-info-tab/counterparty-capture-form-tax-info-tab.component';
import { TaxGridActionComponent } from './components/referential-counterparties/counterparty-capture/tax-info-tab/tax-grid-action/tax-grid-action.component';
import { ReferentialCounterpartiesComponent } from './components/referential-counterparties/referential-counterparties.component';
import { ReferentialCounterpartyTabComponent } from './components/referential-counterparty-tab/referential-counterparty-tab.component';
import { AssignMasterdataDialogBoxComponent } from './components/referential-master-data-component/assign-masterdata-dialog-box/assign-masterdata-dialog-box.component';
import { ReferentialMasterDataComponentComponent } from './components/referential-master-data-component/referential-master-data-component.component';
import { ReferentialMasterDataMenuComponentComponent } from './components/referential-master-data-menu-component/referential-master-data-menu-component.component';
import { TradingAndExecutionComponentComponent } from './components/trading-and-execution-component/trading-and-execution-component.component';
import { ReferentialRoutingModule } from './referential.route';
import { ReferentialMasterDataTitleResolver } from './resolvers/referential-master-data-title.resolver';

@NgModule({
    imports: [
        CommonModule,
        MaterialModule,
        ReferentialRoutingModule,
        AgGridModule.withComponents([]),
        SharedModule,
    ],
    entryComponents: [
        TaxGridActionComponent,
        SelectMultiDropdownComponent,
        CounterpartyApplyButtonComponent,
        AssociatedCounterpartiesCompanyComponent,
        AssignMasterdataDialogBoxComponent,
    ],
    declarations: [
        ReferentialMasterDataMenuComponentComponent,
        TradingAndExecutionComponentComponent,
        ReferentialCounterpartiesComponent,
        ReferentialCounterpartyTabComponent,
        CounterpartyCaptureComponent,
        CounterpartyCaptureFormMainTabComponent,
        CounterpartyCaptureFormAddressTabComponent,
        CounterpartyCaptureFormContactTabComponent,
        CounterpartyCaptureFormBankAccountTabComponent,
        CounterpartyCaptureFormTaxInfoTabComponent,
        CounterpartyCaptureFormReportTabComponent,
        CounterpartyAddressCardComponent,
        CounterpartyAddressDetailCardComponent,
        ContactCardComponent,
        ContactDetailCardComponent,
        CounterpartyBankAccountListComponent,
        TaxGridActionComponent,
        CounterpartyApplyButtonComponent,
        CounterpartyBankAccountDetailsComponent,
        TaxGridActionComponent,
        InformationCardComponent,
        MainAddressCardComponent,
        ThirdSystemCodesCardComponent,
        AlternateMailingCardComponent,
        CustomerDefaultCardComponent,
        CounterpartyHeaderComponent,
        CounterpartyManagementMenuBarComponent,
        AssociatedCounterpartiesCompanyComponent,
        CounterpartyBankAccountDetailsComponent,
        ReferentialMasterDataComponentComponent,
        ReferentialBulkAmendmentComponentComponent,
        CounterpartyListComponentComponent,
        CounterpartyDetailComponentComponent,
        CounterpartySummaryComponentComponent,
        CounterpartyApplyButtonComponent,
        SelectMultiDropdownComponent,
        AssignMasterdataDialogBoxComponent,
    ],
    providers: [
        { provide: MAT_DATE_LOCALE, useValue: 'en' },
        { provide: DateAdapter, useClass: MomentDateAdapter },
        { provide: MAT_DATE_FORMATS, useValue: ATLAS_DATE_FORMATS },
        ReferentialMasterDataTitleResolver,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ReferentialModule { }
