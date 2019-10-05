import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { UserPreference } from '../../entities/userpreference.entity';
import { CreateUserPreferenceCommand } from '../user-configuration/dtos/user-configuration';
import { HttpBaseService } from './http-base.service';

@Injectable({
    providedIn: 'root',
})
export class UserConfigurationService extends HttpBaseService {
    constructor(
        protected http: HttpClient) {
        super(http);
    }

    // Deprecated
    createUserPreference(userPreference: UserPreference) {
        const createUserPreferenceRequest: CreateUserPreferenceCommand = {
            componentId: userPreference.componentId,
            columnConfig: userPreference.userFieldConfiguration,
        };
        return this.post(
            `${environment.configurationServiceLink}/UserConfiguration/${encodeURIComponent(userPreference.company)}`,
            createUserPreferenceRequest);
    }
    getUserPreferenceColumns(company: string, componentId: string): Observable<UserPreference> {
        return this.get<UserPreference>(
            `${environment.configurationServiceLink}/UserConfiguration/${encodeURIComponent(company)}`
            + '/' + encodeURIComponent(componentId));
    }
}
