import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthorizationService } from '../../../../../core/services/authorization.service';
import { BaseFormComponent } from '../../../../../shared/components/base-form-component/base-form-component.component';
import { DateFormat } from '../../../../../shared/entities/date-format.entity';
import { MasterData } from '../../../../../shared/entities/masterdata.entity';
import { UserPreferenceResult } from '../../../../../shared/entities/user-preference-result.entity';
import { UserPreferencesSetup } from '../../../../../shared/entities/user-preferences-setup.entity';
import { UserPreferences } from '../../../../../shared/entities/user-preferences.entity';
import { FormConfigurationProviderService } from '../../../../../shared/services/form-configuration-provider.service';
import { ConfigurationService } from '../../../../../shared/services/http-services/configuration.service';
import { SnackbarService } from '../../../../../shared/services/snackbar.service';

@Component({
    selector: 'atlas-date-format',
    templateUrl: './date-format.component.html',
    styleUrls: ['./date-format.component.scss'],
})
export class DateFormatComponent extends BaseFormComponent implements OnInit, OnDestroy {

    @Output() readonly discardChanges = new EventEmitter<any>();
    @Output() readonly saveMandatory = new EventEmitter();
    company: string;
    dateFormatList: DateFormat[];
    isUserPreferenceExist: boolean = false;
    dateFormatSelected: number;
    subscription: Subscription[] = [];
    userPreferenceSetUp: UserPreferencesSetup;
    userPreferenceDetails: UserPreferences;
    userId: number;
    masterData: MasterData = new MasterData();

    constructor(protected formConfigurationProvider: FormConfigurationProviderService,
        private route: ActivatedRoute,
        protected configurationService: ConfigurationService,
        private authorizationService: AuthorizationService,
        protected snackbarService: SnackbarService,
    ) { super(formConfigurationProvider); }

    ngOnInit() {
        this.company = this.route.snapshot.params['company'];
        this.userId = this.authorizationService.getCurrentUser().userId;
        this.getUserPreference();
        this.masterData = this.route.snapshot.data.masterdata;
        this.dateFormatList = this.masterData.dateFormatPreference;
    }

    onDateFormatChanged(data) {
        this.userPreferenceDetails = new UserPreferences();
        this.userPreferenceSetUp = new UserPreferencesSetup();
        this.userPreferenceSetUp.userId = Number(this.userId);
        this.userPreferenceSetUp.dateFormatId = data.value;
        this.userPreferenceDetails.userPreferencesSetup = this.userPreferenceSetUp;
    }

    onSaveButtonClicked() {
        this.saveUserPreference();
        this.saveMandatory.emit();
    }

    saveUserPreference() {
        this.subscription.push(this.configurationService.getUserPreference(this.userId).subscribe((data: UserPreferenceResult[]) => {
            if (data && data.length > 0) {
                this.subscription.push(this.configurationService.updateUserPreference
                    (this.userPreferenceDetails).subscribe(() => {
                        this.snackbarService.informationSnackBar('Date format succesfully updated');
                    }));
            } else {
                this.subscription.push(this.configurationService.createUserPreference
                    (this.userPreferenceDetails).subscribe(() => {
                        this.snackbarService.informationSnackBar('Date format succesfully created');
                    }));
            }
        }));
    }

    getUserPreference() {
        this.subscription.push(this.configurationService.getUserPreference(this.userId).subscribe((data: UserPreferenceResult[]) => {
            if (data && data.length > 0) {
                this.isUserPreferenceExist = true;
                const dateFormat = data[0].dateFormat;
                const dateFormatItem = this.dateFormatList.find((x) => x.enumEntityValue === dateFormat);
                this.dateFormatSelected = dateFormatItem.enumEntityId;
            }
        }));
    }

    onDiscardButtonClicked() {
        this.discardChanges.emit({ selectedOptionName: 'DateFormatComponent' });
    }

    ngOnDestroy() {
        this.subscription.forEach((subscription) => {
            if (subscription) {
                subscription.unsubscribe();
            }
        });
    }

}
