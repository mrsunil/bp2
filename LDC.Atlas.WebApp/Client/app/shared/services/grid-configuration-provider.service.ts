import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { GridConfigurationProperties } from './../entities/grid-configuration.entity';
import { BaseConfigurationProviderService } from './base-configuration-provider.service';
import { GridConfigurationService } from './http-services/grid-configuration.service';
import { WebStorageService } from './web-storage.service';

@Injectable({
    providedIn: 'root',
})
export class GridConfigurationProviderService extends BaseConfigurationProviderService<GridConfigurationProperties> {

    constructor(private configurationService: GridConfigurationService,
        protected storageService: WebStorageService) {
        super(storageService);
    }

    private generateStorageKey(companyId: string, formId: string): string {
        return `$atlas_grid_config_${companyId}_${formId}`;
    }

    public getConfiguration(
        companyId: string,
        gridId: string,
    ): Observable<GridConfigurationProperties> {
        if (companyId && gridId) {
            if (this.isConfigurationExists(companyId, gridId)) {
                return of(this.configuration.get(companyId).get(gridId));
            }

            const config = this.configurationService
                .getGridConfiguration(gridId)
                .pipe(
                    map((configuration) => {
                        this.configuration.clear();
                        this.saveToMemory(companyId, gridId, configuration);
                        return configuration;
                    },
                    ));
            return config;
        }
        return of();
    }

    public getGridIdForDataEntity(dataEntity: string) {
        switch (dataEntity) {
            default: return dataEntity + 'Grid';
        }

    }

}
