import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material';
import { BaseFormComponent } from '../../../../shared/components/base-form-component/base-form-component.component';
import { FormConfigurationProviderService } from '../../../../shared/services/form-configuration-provider.service';
import { DateFormatComponent } from './date-format/date-format.component';
import { LanguageComponent } from './language/language.component';

@Component({
    selector: 'atlas-user-preferences',
    templateUrl: './user-preferences.component.html',
    styleUrls: ['./user-preferences.component.scss'],
})
export class UserPreferencesComponent extends BaseFormComponent implements OnInit {
    @ViewChild('languageSideNav') languageSideNav: MatSidenav;
    @ViewChild('dateFormatSideNav') dateFormatSideNav: MatSidenav;
    @ViewChild('languageComponent') languageComponent: LanguageComponent;
    @ViewChild('dateFormatComponent') dateFormatComponent: DateFormatComponent;
    languagePreferenceComponent: string = 'LanguageComponent';
    dateFormatPreferenceComponent: string = 'DateFormatComponent';

    constructor(protected formConfigurationProvider: FormConfigurationProviderService,
    ) { super(formConfigurationProvider); }

    ngOnInit() {
    }
    onLanguageTabClicked() {
        this.languageSideNav.open();
    }
    onDateFormatTabClicked() {
        this.dateFormatSideNav.open();
    }
    onDiscardButtonClicked(value) {
        if (value.selectedOptionName === this.languagePreferenceComponent) {
            this.languageSideNav.close();
        }
        if (value.selectedOptionName === this.dateFormatPreferenceComponent) {
            this.dateFormatSideNav.close();
        }

    }

}
