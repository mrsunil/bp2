import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { ListAndSearchFilterDto } from '../dtos/list-and-search/list-and-search-filter-dto.dto';
import { BaseConfigurationProviderService } from './base-configuration-provider.service';
import { GridConfigurationService } from './http-services/grid-configuration.service';
import { WebStorageService } from './web-storage.service';

@Injectable({
    providedIn: 'root',
})
export class FilterProviderService extends BaseConfigurationProviderService<ListAndSearchFilterDto[]> {
    constructor(private configurationService: GridConfigurationService,
        protected storageService: WebStorageService) {
        super(storageService);
    }

    public getFilters(
        companyId: string,
        gridCode: string,
        filterSetId: number,
        forceRefresh = false,
    ): Observable<ListAndSearchFilterDto[]> {
        if (companyId && filterSetId) {
            const configurationId = filterSetId.toString();

            if (this.isConfigurationExists(companyId, configurationId) && !forceRefresh) {
                return of(this.configuration.get(companyId).get(configurationId));
            }

            const config = this.configurationService
                .getUserFilterSetById(gridCode, filterSetId)
                .pipe(
                    map((configuration) => {
                        const filters = configuration.filters;
                        this.saveToMemory(companyId, configurationId, filters);
                        return filters;
                    },
                    ));
            return config;
        }
        return of();
    }
}
