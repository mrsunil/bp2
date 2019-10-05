import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { ItemConfigurationProperties } from '../entities/form-configuration.entity';
import { FormConfigurationProviderService } from '../services/form-configuration-provider.service';

@Injectable()
export class FormConfigurationResolver
    implements Resolve<ItemConfigurationProperties[]> {
    constructor(
        private configurationProvider: FormConfigurationProviderService,
    ) { }

    resolve(
        route: ActivatedRouteSnapshot,
    ): Observable<ItemConfigurationProperties[]> {
        const company = route.params['company'];
        const formId = route.data.formId;
        return this.configurationProvider.getConfiguration(company, formId);
    }
}
