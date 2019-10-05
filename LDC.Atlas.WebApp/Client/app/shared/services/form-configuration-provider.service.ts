import { CommentStmt } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { ItemConfigurationProperties } from '../entities/form-configuration.entity';
import { BaseConfigurationProviderService } from './base-configuration-provider.service';
import { ApiCollection } from './common/models';
import { FormConfigurationService } from './http-services/form-configuration.service';
import { WebStorageService } from './web-storage.service';

@Injectable({
    providedIn: 'root',
})
export class FormConfigurationProviderService extends BaseConfigurationProviderService<ItemConfigurationProperties[]> {
    protected storageEnabled = true;

    constructor(private configurationService: FormConfigurationService,
        protected storageService: WebStorageService) {
        super(storageService);
    }

    public getConfiguration(
        companyId: string,
        formId: string,
    ): Observable<ItemConfigurationProperties[]> {
        if (companyId && formId) {
            const storageKey = this.generateStorageKey(companyId, formId);

            if (this.isConfigurationExists(companyId, formId)) {
                return of(this.configuration.get(companyId).get(formId));
            }

            // As we are fetching data from cache here, if we make the changes in the configuration the cache
            // is not containing the new configuration as it does not update cache.
            // After discussion with Sowmya we will remove the Comments.

            // const data = this.getConfigurationFromStorage(companyId, formId, storageKey);
            // if (data) {
            //      return of(data);
            //   } else {
            const config = this.configurationService
                .getFormConfiguration(formId)
                .pipe(
                    map((configuration) => {
                        if (configuration.value === undefined || configuration.value === null) {
                            const configurationFields = [];
                            for (const index in configuration) {
                                configurationFields.push(configuration[index]);
                            }
                            const configFields: ApiCollection<ItemConfigurationProperties> = {
                                value: configurationFields,
                            };

                            this.storageService.saveToStorage(storageKey, configFields.value);
                            this.configuration.clear();
                            this.saveToMemory(companyId, formId, configFields.value);
                            return configFields.value;

                        } else {

                            this.storageService.saveToStorage(storageKey, configuration.value);
                            this.configuration.clear();
                            this.saveToMemory(companyId, formId, configuration.value);
                            return configuration.value;
                        }
                    },
                    ));
            return config;
            //  }
        }
    }

    public getFieldConfiguration(fieldId: string): ItemConfigurationProperties {
        return this.getElementConfiguration(fieldId);
    }

    public isFieldMandatory(fieldId: string): boolean {
        const configuration = this.getFieldConfiguration(fieldId);
        if (configuration) {
            return configuration.isMandatory;
        }
        return false;
    }

    public getFieldDefaultValue(fieldId: string): string {
        const configuration = this.getFieldConfiguration(fieldId);
        if (configuration) {
            return configuration.defaultValue;
        }

        return null;
    }

    public getFieldFormat(fieldId: string): string {
        const configuration = this.getFieldConfiguration(fieldId);
        if (configuration) {
            return configuration.format;
        }

        return null;
    }

    getElementConfiguration(id: string): ItemConfigurationProperties {
        return this.currentConfiguration.find((config) => config['id'] === id);
    }

    private generateStorageKey(companyId: string, formId: string): string {
        return `$atlas_form_config_${companyId}_${formId}`;
    }
}
