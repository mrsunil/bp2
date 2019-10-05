import { Injectable } from '@angular/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import * as moment from 'moment';
import { AuthorizationService } from '../../core/services/authorization.service';
import { SecurityService } from '../../shared/services/security.service';
import { ConfigurationService } from './http-services/configuration.service';

@Injectable()
export class CustomDateAdapter extends MomentDateAdapter {
    // this is the default date set to the system
    customDateFormat: string = 'DD/MM/YYYY';
    constructor(private securityService: SecurityService,
        protected configurationService: ConfigurationService,
        private authorizationService: AuthorizationService) {
        super('en-US');
    }

    public format(date: moment.Moment, displayFormat: string): string {
        this.getdateFormat();
        return date.locale('en-US').format(this.customDateFormat);
    }

    async getdateFormat() {
        await this.securityService.isSecurityReady().toPromise();
        const currentUser = this.authorizationService.getCurrentUser();
        const userPreferences = await this.configurationService
            .getUserPreference(currentUser.userId).toPromise();
        if (userPreferences && userPreferences.length > 0) {
            this.customDateFormat = userPreferences[0].dateFormat.toString();
        }
    }
}
