import { Injectable } from '@angular/core';
import { UtilService } from './util.service';

@Injectable()
export class AutocompleteService {

    constructor(
        protected util: UtilService) { }

    public setDescriptionByCodeAndFilterAutocomplete(value: string, descriptions: { [key: string]: string }, descriptionName: string, masterDataList: any[] = [],
        dataToFilter: any[] = [], propertyToCompare: string, propertyToDisplay: string, minLength: number = 0): any[] {
        if (value != null && value.length < minLength) {
            return [];
        }
        this.setDescriptionByCode(value, descriptions, descriptionName, masterDataList, propertyToCompare, propertyToDisplay);
        return value ? this.util.filterDictByValue(value, dataToFilter, propertyToCompare) : dataToFilter.slice();
    }

    public getDescriptionByCode(value: string, masterDataList: any[] = [], propertyToCompare, propertyToDisplay): string {
        if (value) {
            const ret = masterDataList.filter(
                (fieldVal) => fieldVal[propertyToCompare] ? fieldVal[propertyToCompare].toLowerCase().trim() === value.toLowerCase().trim() : false);
            if (ret.length > 0) {
                return ret[0][propertyToDisplay];
            }
        }
        return null;
    }

    public setDescriptionByCode(value: string, descriptions: { [key: string]: string }, descriptionName: string, masterDataList: any[], propertyToCompare: string, propertyToDisplay: string) {
        descriptions[descriptionName] = this.getDescriptionByCode(value, masterDataList, propertyToCompare, propertyToDisplay);
    }

    public getObjectFromCode(code: string, masterDataList: any[] = [], propertyToCompare: string): any {
        if (!code) {
            return null;
        }

        const ret = masterDataList.filter((md) => md[propertyToCompare].toLowerCase() === code.toLowerCase());
        if (ret.length > 0) {
            return ret[0];
        }

        return null;
    }

}
