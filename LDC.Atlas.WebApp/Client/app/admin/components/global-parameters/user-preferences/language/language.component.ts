import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthorizationService } from '../../../../../core/services/authorization.service';
import { BaseFormComponent } from '../../../../../shared/components/base-form-component/base-form-component.component';
import { Language } from '../../../../../shared/entities/language.entity';
import { MasterData } from '../../../../../shared/entities/masterdata.entity';
import { UserPreferenceResult } from '../../../../../shared/entities/user-preference-result.entity';
import { UserPreferencesSetup } from '../../../../../shared/entities/user-preferences-setup.entity';
import { UserPreferences } from '../../../../../shared/entities/user-preferences.entity';
import { FormConfigurationProviderService } from '../../../../../shared/services/form-configuration-provider.service';
import { ConfigurationService } from '../../../../../shared/services/http-services/configuration.service';
import { SnackbarService } from '../../../../../shared/services/snackbar.service';

@Component({
    selector: 'atlas-language',
    templateUrl: './language.component.html',
    styleUrls: ['./language.component.scss'],
})
export class LanguageComponent extends BaseFormComponent implements OnInit, OnDestroy {
    @Output() readonly discardChanges = new EventEmitter<any>();
    @Output() readonly saveMandatory = new EventEmitter();
    company: string;
    languageList: Language[];
    subscription: Subscription[] = [];
    userPreferencesSetup: UserPreferencesSetup;
    userPreferenceDetails: UserPreferences;
    languageSelected: number;
    isUserPreferencesEditable: boolean;
    userId: number;
    isUserPreferenceExist: boolean = false;
    userPreferenceResult: UserPreferenceResult;
    masterData: MasterData = new MasterData();

    constructor(protected formConfigurationProvider: FormConfigurationProviderService,
        private route: ActivatedRoute,
        private authorizationService: AuthorizationService,
        protected configurationService: ConfigurationService,
        protected snackbarService: SnackbarService,
    ) { super(formConfigurationProvider); }

    ngOnInit() {
        this.company = this.route.snapshot.params['company'];
        this.userId = this.authorizationService.getCurrentUser().userId;
        this.getUserPreference();
        this.masterData = this.route.snapshot.data.masterdata;
        this.languageList = this.masterData.languagePreference;
    }

    onLanguageChanged(data) {
        this.userPreferenceDetails = new UserPreferences();
        this.userPreferencesSetup = new UserPreferencesSetup();
        this.userPreferencesSetup.userId = Number(this.userId);
        this.userPreferencesSetup.favouriteLanguageId = data.value;
        this.userPreferenceDetails.userPreferencesSetup = this.userPreferencesSetup;
    }

    onSaveButtonClicked() {
        this.saveMandatory.emit();
        this.saveUserPreference();
    }

    onDiscardButtonClicked() {
        this.discardChanges.emit({ selectedOptionName: 'LanguageComponent' });
    }

    saveUserPreference() {
        this.subscription.push(this.configurationService.getUserPreference(this.userId).subscribe((data: UserPreferenceResult[]) => {
            if (data && data.length > 0) {
                this.subscription.push(this.configurationService.updateUserPreference
                    (this.userPreferenceDetails).subscribe(() => {
                        this.snackbarService.informationSnackBar('Favourite language succesfully updated');
                    }));
            } else {
                this.subscription.push(this.configurationService.createUserPreference
                    (this.userPreferenceDetails).subscribe(() => {
                        this.snackbarService.informationSnackBar('Favourite language succesfully created');
                    }));
            }
        }));
    }

    getUserPreference() {
        this.subscription.push(this.configurationService.getUserPreference(this.userId).subscribe((data: UserPreferenceResult[]) => {
            if (data && data.length > 0) {
                this.isUserPreferenceExist = true;
                const favouriteLanguage = data[0].favouriteLanguage;
                const languageItem = this.languageList.find((x) => x.enumEntityValue === favouriteLanguage);
                this.languageSelected = languageItem.enumEntityId;
            }
        }));
    }

    ngOnDestroy() {
        this.subscription.forEach((subscription) => {
            if (subscription) {
                subscription.unsubscribe();
            }
        });
    }

}
