import { Injectable } from '@angular/core';
import { WebStorageService } from './web-storage.service';

@Injectable({
    providedIn: 'root',
})
export class BaseConfigurationProviderService<T> {
    protected configuration: Map<string, Map<string, T>> = new Map();
    protected currentConfiguration: T;
    protected storageEnabled = true;

    constructor(protected storageService: WebStorageService) { }

    protected saveToMemory(
        companyId: string,
        resourceId: string,
        config: T,
    ) {
        if (!this.isCompanyExists(companyId)) {
            this.configuration.set(companyId, new Map());
        }
        this.configuration.get(companyId).set(resourceId, config);
        this.currentConfiguration = config;
    }

    protected isCompanyExists(companyId: string) {
        if (companyId) {
            return this.configuration.has(companyId);
        }
        return false;
    }

    protected isConfigurationExists(companyId: string, resourceId: string) {
        if (companyId && resourceId && this.isCompanyExists(companyId)) {
            return this.configuration.get(companyId).has(resourceId);
        }
        return false;
    }

    protected getConfigurationFromStorage(
        companyId: string,
        resourceId: string,
        key: string,
    ): T {
        if (this.storageEnabled && this.storageService.isInStorage(key)) {
            const data = this.storageService.loadFromStorage(key) as T;
            this.configuration.clear();
            this.saveToMemory(companyId, resourceId, data);
            return data;
        }

        return null;
    }
}
