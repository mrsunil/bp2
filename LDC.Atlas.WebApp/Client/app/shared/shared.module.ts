import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AgGridModule } from 'ag-grid-angular';
import { TextMaskModule } from 'angular2-text-mask';
import { AgContextualMenuComponent } from './components/ag-contextual-menu/ag-contextual-menu.component';
import { AgGridAccrualNumberComponent } from './components/ag-grid-accrual-number/ag-grid-accrual-number.component';
import { AgGridCheckboxComponent } from './components/ag-grid-checkbox/ag-grid-checkbox.component';
import { AgGridCopyIconComponent } from './components/ag-grid-copy-icon/ag-grid-copy-icon.component';
import { AgGridHyperlinkForAccountentriesComponent } from './components/ag-grid-hyperlink-for-accountentries/ag-grid-hyperlink-for-accountentries.component';
import { AgGridHyperlinkForTradechildsectionsComponent } from './components/ag-grid-hyperlink-for-tradechildsections/ag-grid-hyperlink-for-tradechildsections.component';
import { AgGridHyperlinkComponent } from './components/ag-grid-hyperlink/ag-grid-hyperlink.component';
import { AgGridListAndSearchPicklistFieldComponent } from './components/ag-grid-list-and-search-picklist-field/ag-grid-list-and-search-picklist-field.component';
import { AgGridSelectComponent } from './components/ag-grid-select/ag-grid-select.component';
import { AgGridUserPreferencesComponent } from './components/ag-grid-user-preferences/ag-grid-user-preferences.component';
import { GridViewSaveDialogComponent } from './components/ag-grid-user-preferences/grid-view-save-dialog/grid-view-save-dialog.component';
import { AgGridMultipleAutocompleteDepartmentComponent } from './components/ag-grid/ag-grid-multiple-autocomplete-department/ag-grid-multiple-autocomplete-department.component';
import { AgGridMultipleAutocompleteComponent } from './components/ag-grid/ag-grid-multiple-autocomplete/ag-grid-multiple-autocomplete.component';
import { AgGridAutocompleteComponent } from './components/ag-grid/autocomplete/ag-grid-autocomplete.component';
import { AgGridCheckboxTriStateComponent } from './components/ag-grid/checkbox-tri-state/ag-grid-checkbox-tri-state.component';
import { AgGridContextualSearchComponent } from './components/ag-grid/contextual-search/ag-grid-contextual-search.component';
import { ApiCollectionAutocompleteDropdownComponent } from './components/api-collection-autocomplete-dropdown/api-collection-autocomplete-dropdown.component';
import { AutocompleteDropdownComponent } from './components/autocomplete-dropdown/autocomplete-dropdown.component';
import { BaseFormComponent } from './components/base-form-component/base-form-component.component';
import { CellEditorDatePickerComponent } from './components/cell-editor-date-picker/cell-editor-date-picker.component';
import { CellEditorMonthDatePickerComponent } from './components/cell-editor-month-date-picker/cell-editor-month-date-picker.component';
import { CellEditorAtlasNumericComponent } from './components/cell-editor-numeric/cell-editor-atlas-numeric/cell-editor-atlas-numeric.component';
import { CellEditorNumericComponent } from './components/cell-editor-numeric/cell-editor-numeric.component';
import { CellEditorSelectComponent } from './components/cell-editor-select/cell-editor-select.component';
import { CellEditorYearPickerComponent } from './components/cell-editor-year-picker/cell-editor-year-picker.component';
import { ChipListComponent } from './components/chip-list/chip-list.component';
import { CommodityInputComponent } from './components/commodity-input/commodity-input.component';
import { CompanyPickerComponent } from './components/company-picker/company-picker.component';
import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.component';
import { ContextualSearchBaseLightBoxComponent } from './components/contextual-search/base-light-box/contextual-search-base-light-box.component';
import { ContextualSearchUserPreferencesLightBoxComponent } from './components/contextual-search/base-light-box/contextual-search-user-preferences-light-box/contextual-search-user-preferences-light-box.component';
import { ContextualSearchMultipleSelectLightBoxComponent } from './components/contextual-search/multiple-select-light-box/contextual-search-multiple-select-light-box.component';
import { ContractStatusLabelComponent } from './components/contract-status-label/contract-status-label.component';
import { DateLabelComponent } from './components/date-label/date-label.component';
import { DocumentGenerationConfirmationDialogBoxComponent } from './components/document-generation-confirmation-dialog-box/document-generation-confirmation-dialog-box.component';
import { EmptyStateComponent } from './components/empty-state/empty-state.component';
import { ErrorPageComponent } from './components/error-page/error-page.component';
import { FavouritesListDisplayComponent } from './components/favourites-list-display/favourites-list-display.component';
import { FileUploadDialogBoxComponent } from './components/file-upload-dialog-box/file-upload-dialog-box.component';
import { FilterSetDisplayComponent } from './components/filter-set-display/filter-set-display.component';
import { FilterSetEditDialogComponent } from './components/filter-set-display/filter-set-edit-dialog/filter-set-edit-dialog.component';
import { FilterSetEditorComponent } from './components/filter-set-editor/filter-set-editor.component';
import { FloatingActionButtonComponent } from './components/floating-action-button/floating-action-button.component';
import { DatePickerComponent } from './components/form-components/date-picker/date-picker.component';
import { MonthDatePickerComponent } from './components/form-components/date-picker/month-date-picker/month-date-picker.component';
import { YearPickerComponent } from './components/form-components/date-picker/year-picker/year-picker.component';
import { DropdownSelectListComponent } from './components/form-components/dropdown-select-list/dropdown-select-list.component';
import { DropdownSelectComponent } from './components/form-components/dropdown-select/dropdown-select.component';
import { FormComponentBaseComponent } from './components/form-components/form-component-base/form-component-base.component';
import { FormInputComponent } from './components/form-components/form-input/form-input.component';
import { FormToggleComponent } from './components/form-components/form-toggle/form-toggle.component';
import { MasterdataInputComponent } from './components/form-components/masterdata/masterdata-input/masterdata-input.component';
import { MasterdataUserPreferencesInputComponent } from './components/form-components/masterdata/masterdata-input/masterdata-user-preferences-input/masterdata-user-preferences-input.component';
import { ContextualSearchMultipleAutocompleteSelectComponent } from './components/form-components/multiple-autocomplete-dropdown/contextual-search/contextual-search-multiple-autocomplete-select.component';
import { GenericReportViewerComponent } from './components/generic-report-viewer/generic-report-viewer.component';
import { EnlargedGridDialogComponent } from './components/grid-enlargement/enlarged-grid-dialog/enlarged-grid-dialog.component';
import { GridEnlargementComponent } from './components/grid-enlargement/grid-enlargement.component';
import { InformationBannerComponent } from './components/information-banner/information-banner.component';
import { ListAndSearchContextualMenuComponent } from './components/list-and-search/list-and-search-contextual-menu.component';
import { ListAndSearchComponent } from './components/list-and-search/list-and-search.component';
import { LockIntervalComponent } from './components/lock-interval/lock-interval.component';
import { MultipleAutocompleteDropdownComponent } from './components/multiple-autocomplete-dropdown/multiple-autocomplete-dropdown.component';
import { ParamsListComponent } from './components/params-list/params-list.component';
import { ParamsSidenavSelectorComponent } from './components/params-sidenav-selector/params-sidenav-selector.component';
import { PicklistComponent } from './components/picklist/picklist.component';
import { PrivilegeLevel1IconComponent } from './components/privilege-level1-icon/privilege-level1-icon.component';
import { RowSelectionButton } from './components/row-selection-button/row-selection-button.component';
import { SelectMultipleAutocompleteComponent } from './components/select-multiple-autocomplete/select-multiple-autocomplete.component';
import { SideNavComponent } from './components/side-nav/side-nav.component';
import { SSRSReportViewerComponent } from './components/ssrs-report-viewer/ssrsreport-viewer.component';
import { SumColumntotalComponent } from './components/sum-columntotal/sum-columntotal.component';
import { TopNavComponent } from './components/top-nav/top-nav.component';
import { UserAvatarComponent } from './components/user-avatar/user-avatar.component';
import { VesselContextualSearchComponent } from './components/vessel-contextual-search/vessel-contextual-search.component';
import { WarningBannerComponent } from './components/warning-banner/warning-banner.component';
import { FeatureFlagDirective } from './directives/app-flag.directive';
import { AuthorizedDirective } from './directives/authorization.directive';
import { DatepickerLocaldateDirective } from './directives/datepicker-localdate.directive';
import { HighlightDirective } from './directives/mattoolbar-backgroundcolor.directive';
import { NumberDecimalsDirective } from './directives/number-decimals.directive';
import { SignNumberDirective } from './directives/sign-number.directive';
import { SpecialCharacterDirective } from './directives/special-character.directive';
import { ListAndSearchDatePredicatePresetProvider } from './entities/list-and-search/providers/list-and-search-date-predicate-preset-provider.entity';
import { ListAndSearchNumericPredicatePresetProvider } from './entities/list-and-search/providers/list-and-search-numeric-predicate-preset-provider.entity';
import { ListAndSearchPicklistPredicatePresetProvider } from './entities/list-and-search/providers/list-and-search-picklist-predicate-preset-provider.entity';
import { ListAndSearchTextPredicatePresetProvider } from './entities/list-and-search/providers/list-and-search-text-predicate-preset-provider.entity';
import { SecurityGuard } from './guards/security.guard';
import { MaterialModule } from './material.module';
import { FormatDatePipe } from './pipes/format-date-pipe.pipe';
import { UserInitialsPipePipe } from './pipes/user-initials-pipe.pipe';
import { CompanyDateResolver } from './resolvers/company-date.resolver';
import { FormConfigurationResolver } from './resolvers/form-configuration.resolver';
import { MasterDataResolver } from './resolvers/masterdata.resolver';
import { AgGridService } from './services/ag-grid.service';
import { AutocompleteService } from './services/autocomplete.service';
import { CookiesService } from './services/cookies.service';
import { DateConverterService } from './services/date-converter.service';
import { DocumentPopupService } from './services/document-popup.service';
import { FilterProviderService } from './services/filter-provider.service';
import { FilterService } from './services/filter-service.service';
import { FormConfigurationProviderService } from './services/form-configuration-provider.service';
import { GridConfigurationProviderService } from './services/grid-configuration-provider.service';
import { ControllingService } from './services/http-services/controlling.service';
import { ExecutionService } from './services/http-services/execution.service';
import { ForeignExchangeService } from './services/http-services/foreign-exchange.service';
import { FormConfigurationService } from './services/http-services/form-configuration.service';
import { MasterdataService } from './services/http-services/masterdata.service';
import { PreaccountingService } from './services/http-services/preaccounting.service';
import { TradingService } from './services/http-services/trading.service';
import { UserIdentityService } from './services/http-services/user-identity.service';
import { AccountingEntriesDataLoader } from './services/list-and-search/accountingEntries-data-loader';
import { ClientReportDataLoader } from './services/list-and-search/clientReport-data-loader';
import { DocumentDataLoader } from './services/list-and-search/document-data-loader';
import { InvoiceDataLoader } from './services/list-and-search/invoice-data-loader';
import { NominalReportDataLoader } from './services/list-and-search/nominalReport-data-loader';
import { TradeDataLoader } from './services/list-and-search/trade-data-loader';
import { SecurityService } from './services/security.service';
import { SnackbarService } from './services/snackbar.service';
import { SplitCreateAndAllocateService } from './services/split-create-and-allocate.service';
import { TitleService } from './services/title.service';
import { TradeEditService } from './services/trade-edit.service';
import { UiService } from './services/ui.service';
import { UrlManagementService } from './services/url-management.service';
import { UtilService } from './services/util.service';

export const ATLAS_DATE_FORMATS = {
    parse: {
        dateInput: 'DD/MM/YYYY',
    },
    display: {
        dateInput: 'DD/MM/YYYY',
        monthYearLabel: 'MMM YYYY',
        dateA11yLabel: 'DD/MM/YYYY',
        monthYearA11yLabel: 'MMM YYYY',
    },
};

@NgModule({
    imports: [
        CommonModule,
        MaterialModule,
        FormsModule,
        RouterModule,
        TextMaskModule,
        AgGridModule.withComponents([]),
        FormsModule,
        ReactiveFormsModule,
    ],
    exports: [
        SideNavComponent,
        TopNavComponent,
        DateLabelComponent,
        ContractStatusLabelComponent,
        DatepickerLocaldateDirective,
        HighlightDirective,
        SignNumberDirective,
        AuthorizedDirective,
        NumberDecimalsDirective,
        FeatureFlagDirective,
        AutocompleteDropdownComponent,
        ConfirmationDialogComponent,
        CellEditorDatePickerComponent,
        CellEditorMonthDatePickerComponent,
        CellEditorYearPickerComponent,
        CellEditorSelectComponent,
        CellEditorNumericComponent,
        CellEditorAtlasNumericComponent,
        CompanyPickerComponent,
        FormsModule,
        ReactiveFormsModule,
        UserAvatarComponent,
        RowSelectionButton,
        FormInputComponent,
        DatePickerComponent,
        MonthDatePickerComponent,
        FormToggleComponent,
        DropdownSelectComponent,
        DropdownSelectListComponent,
        MasterdataInputComponent,
        MasterdataUserPreferencesInputComponent,
        ApiCollectionAutocompleteDropdownComponent,
        UserInitialsPipePipe,
        FormatDatePipe,
        SelectMultipleAutocompleteComponent,
        SpecialCharacterDirective,
        ListAndSearchComponent,
        ChipListComponent,
        FilterSetDisplayComponent,
        FilterSetEditorComponent,
        AgGridUserPreferencesComponent,
        AgGridCopyIconComponent,
        AgGridListAndSearchPicklistFieldComponent,
        CommodityInputComponent,
        VesselContextualSearchComponent,
        EmptyStateComponent,
        SSRSReportViewerComponent,
        SumColumntotalComponent,
        PicklistComponent,
        PrivilegeLevel1IconComponent,
        InformationBannerComponent,
        LockIntervalComponent,
        WarningBannerComponent,
        GridViewSaveDialogComponent,
        FileUploadDialogBoxComponent,
        FavouritesListDisplayComponent,
        MultipleAutocompleteDropdownComponent,
        ContextualSearchMultipleAutocompleteSelectComponent,
        ParamsListComponent,
        ParamsSidenavSelectorComponent,
        FloatingActionButtonComponent,
        GridEnlargementComponent,
        EnlargedGridDialogComponent,
        TranslateModule,
        YearPickerComponent,
        GenericReportViewerComponent,
    ],
    declarations: [
        SideNavComponent,
        TopNavComponent,
        DateLabelComponent,
        ContractStatusLabelComponent,
        DatepickerLocaldateDirective,
        HighlightDirective,
        SignNumberDirective,
        AuthorizedDirective,
        NumberDecimalsDirective,
        FeatureFlagDirective,
        AutocompleteDropdownComponent,
        ConfirmationDialogComponent,
        CellEditorDatePickerComponent,
        CellEditorMonthDatePickerComponent,
        CellEditorYearPickerComponent,
        CellEditorSelectComponent,
        CellEditorNumericComponent,
        CellEditorAtlasNumericComponent,
        CompanyPickerComponent,
        ErrorPageComponent,
        UserAvatarComponent,
        AgContextualMenuComponent,
        RowSelectionButton,
        FormComponentBaseComponent,
        FormInputComponent,
        DatePickerComponent,
        MonthDatePickerComponent,
        FormToggleComponent,
        DropdownSelectComponent,
        DropdownSelectListComponent,
        ApiCollectionAutocompleteDropdownComponent,
        UserInitialsPipePipe,
        FormatDatePipe,
        SelectMultipleAutocompleteComponent,
        SpecialCharacterDirective,
        AgGridCheckboxComponent,
        AgGridSelectComponent,
        AgGridHyperlinkComponent,
        AgGridListAndSearchPicklistFieldComponent,
        ContextualSearchBaseLightBoxComponent,
        MasterdataInputComponent,
        MasterdataUserPreferencesInputComponent,
        BaseFormComponent,
        ContextualSearchUserPreferencesLightBoxComponent,
        MasterdataUserPreferencesInputComponent,
        ListAndSearchComponent,
        ListAndSearchContextualMenuComponent,
        ChipListComponent,
        FilterSetDisplayComponent,
        FilterSetEditorComponent,
        AgGridUserPreferencesComponent,
        AgGridCopyIconComponent,
        CommodityInputComponent,
        VesselContextualSearchComponent,
        EmptyStateComponent,
        SSRSReportViewerComponent,
        SumColumntotalComponent,
        PicklistComponent,
        FilterSetEditDialogComponent,
        InformationBannerComponent,
        DocumentGenerationConfirmationDialogBoxComponent,
        AgGridContextualSearchComponent,
        PrivilegeLevel1IconComponent,
        AgGridAccrualNumberComponent,
        LockIntervalComponent,
        WarningBannerComponent,
        AgGridHyperlinkForAccountentriesComponent,
        GridViewSaveDialogComponent,
        AgGridAutocompleteComponent,
        FileUploadDialogBoxComponent,
        FavouritesListDisplayComponent,
        AgGridHyperlinkForTradechildsectionsComponent,
        MultipleAutocompleteDropdownComponent,
        AgGridMultipleAutocompleteComponent,
        AgGridMultipleAutocompleteDepartmentComponent,
        ContextualSearchMultipleSelectLightBoxComponent,
        ContextualSearchMultipleAutocompleteSelectComponent,
        ParamsListComponent,
        ParamsSidenavSelectorComponent,
        FloatingActionButtonComponent,
        GridEnlargementComponent,
        EnlargedGridDialogComponent,
        YearPickerComponent,
        GenericReportViewerComponent,
        AgGridCheckboxTriStateComponent,
    ],
    providers: [
        TradingService,
        ExecutionService,
        ControllingService,
        PreaccountingService,
        DateConverterService,
        MasterDataResolver,
        SecurityGuard,
        UserIdentityService,
        ForeignExchangeService,
        UrlManagementService,
        CookiesService,
        TitleService,
        SnackbarService,
        UtilService,
        UiService,
        AutocompleteService,
        FormConfigurationService,
        FormConfigurationResolver,
        CompanyDateResolver,
        FormConfigurationProviderService,
        GridConfigurationProviderService,
        UserInitialsPipePipe,
        FilterService,
        FormatDatePipe,
        TradeDataLoader,
        AccountingEntriesDataLoader,
        InvoiceDataLoader,
        ListAndSearchTextPredicatePresetProvider,
        ListAndSearchNumericPredicatePresetProvider,
        ListAndSearchDatePredicatePresetProvider,
        ListAndSearchPicklistPredicatePresetProvider,
        FilterProviderService,
        SplitCreateAndAllocateService,
        InvoiceDataLoader,
        DocumentDataLoader,
        DocumentPopupService,
        ClientReportDataLoader,
        NominalReportDataLoader,
        { provide: MAT_DATE_LOCALE, useValue: 'en' },
        { provide: DateAdapter, useClass: MomentDateAdapter },
        { provide: MAT_DATE_FORMATS, useValue: ATLAS_DATE_FORMATS },
        AgGridService,
        TradeEditService,
    ],
    entryComponents: [
        CellEditorDatePickerComponent,
        CellEditorMonthDatePickerComponent,
        CellEditorYearPickerComponent,
        CellEditorSelectComponent,
        CellEditorNumericComponent,
        CellEditorAtlasNumericComponent,
        AgContextualMenuComponent,
        RowSelectionButton,
        ConfirmationDialogComponent,
        ContextualSearchBaseLightBoxComponent,
        ContextualSearchUserPreferencesLightBoxComponent,
        AgGridCheckboxComponent,
        AgGridSelectComponent,
        AgGridCheckboxTriStateComponent,
        AgGridHyperlinkForAccountentriesComponent,
        AgGridHyperlinkComponent,
        AgGridUserPreferencesComponent,
        AgGridCopyIconComponent,
        FilterSetEditDialogComponent,
        ListAndSearchContextualMenuComponent,
        DocumentGenerationConfirmationDialogBoxComponent,
        AgGridContextualSearchComponent,
        AgGridAccrualNumberComponent,
        AgGridListAndSearchPicklistFieldComponent,
        AgGridAutocompleteComponent,
        GridViewSaveDialogComponent,
        AgGridHyperlinkForTradechildsectionsComponent,
        ContextualSearchMultipleAutocompleteSelectComponent,
        ContextualSearchMultipleSelectLightBoxComponent,
        EnlargedGridDialogComponent,
        GenericReportViewerComponent,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SharedModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: SharedModule,
            providers: [SecurityService, MasterdataService],
        };
    }
}
