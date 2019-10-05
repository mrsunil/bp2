import { Injectable } from '@angular/core';
import * as _moment from 'moment';
import { ListAndSearchFilterPredicate } from '../entities/list-and-search/list-and-search-filter-predicate.entity';
import { ListAndSearchFilter } from '../entities/list-and-search/list-and-search-filter.entity';
import { ListAndSearchOperator } from '../entities/list-and-search/list-and-search-operator.entity';
import { ListAndSearchPredicatePreset } from '../entities/list-and-search/list-and-search-predicate-preset.entity';
import { ListAndSearchDatePredicatePresetProvider } from '../entities/list-and-search/providers/list-and-search-date-predicate-preset-provider.entity';
import { ListAndSearchNumericPredicatePresetProvider } from '../entities/list-and-search/providers/list-and-search-numeric-predicate-preset-provider.entity';
import { ListAndSearchPicklistPredicatePresetProvider } from '../entities/list-and-search/providers/list-and-search-picklist-predicate-preset-provider.entity';
import { ListAndSearchTextPredicatePresetProvider } from '../entities/list-and-search/providers/list-and-search-text-predicate-preset-provider.entity';
import { ListAndSearchFilterType } from '../enums/list-and-search-filter-type.enum';
import { ListAndSearchKeyWords } from '../enums/list-and-search-keywords.enum';
const moment = _moment;

@Injectable({
    providedIn: 'root',
})

export class FilterService {
    filterPredicatesMap: Map<string, ListAndSearchPredicatePreset>
        = new Map<string, ListAndSearchPredicatePreset>();

    dateFormats: string[] = ['DD/MM/YYYY', 'DD MMM YYYY', 'DD-MM-YYYY'];

    constructor(textPredicatePresets: ListAndSearchTextPredicatePresetProvider,
        numericPredicatePresets: ListAndSearchNumericPredicatePresetProvider,
        datePredicatePresets: ListAndSearchDatePredicatePresetProvider,
        picklistPredicatePresets: ListAndSearchPicklistPredicatePresetProvider) {
        this.filterPredicatesMap.set(ListAndSearchFilterType.Text as string, textPredicatePresets.getPresets());
        this.filterPredicatesMap.set(ListAndSearchFilterType.Picklist as string, picklistPredicatePresets.getPresets());
        this.filterPredicatesMap.set(ListAndSearchFilterType.Numeric as string, numericPredicatePresets.getPresets());
        this.filterPredicatesMap.set(ListAndSearchFilterType.Date as string, datePredicatePresets.getPresets());
        this.filterPredicatesMap.set(ListAndSearchFilterType.OptionSet as string, textPredicatePresets.getPresets());
    }

    validateInput(input: string, filterType: ListAndSearchFilterType): ListAndSearchFilterPredicate {
        let validFilter: ListAndSearchFilterPredicate = null;
        const operators = this.filterPredicatesMap.get(filterType).operators;
        let i = -1;
        let validated = false;
        input = filterType === ListAndSearchFilterType.OptionSet ? '= ' + input : input;

        while (!validated && i < operators.length - 1) {
            i++;
            validated = RegExp(operators[i].validator, 'i').test(input);
        }
        if (validated) {
            const validOperator = operators[i];
            if (filterType === ListAndSearchFilterType.Date) {
                validFilter = this.processDateInput(input, validOperator);
            } else {
                validFilter = this.buildListAndSearchFilter(input, validOperator);
                validFilter.filterType = filterType;
            }
        }

        return validFilter;
    }

    private processDateInput(input: string, operator: ListAndSearchOperator): ListAndSearchFilterPredicate {

        let predicate = new ListAndSearchFilterPredicate();
        predicate.operator = operator.operator;
        predicate = this.getCaptureValueFromRegex(input, operator, predicate);
        let dateInputValidated: boolean = true;
        let specialWordValue1: boolean = false;
        let specialWordValue2: boolean = false;

        if (operator.operator !== ListAndSearchKeyWords.Empty
            && operator.operator !== ListAndSearchKeyWords.NotEmpty) {

            if (predicate.value1.toLocaleLowerCase() !== ListAndSearchKeyWords.Today &&
                predicate.value1.toLocaleLowerCase() !== ListAndSearchKeyWords.Yesterday) {
                specialWordValue1 = false;

                dateInputValidated = moment(predicate.value1, this.dateFormats, true).isValid();

            } else {
                specialWordValue1 = true;
                predicate.value1 = predicate.value1.toLocaleLowerCase();
            }
            // in case we are dealing with between operator
            if (dateInputValidated
                && predicate.value2) {
                if (predicate.value2.toLocaleLowerCase() !== ListAndSearchKeyWords.Today
                    && predicate.value2.toLocaleLowerCase() !== ListAndSearchKeyWords.Yesterday) {
                    specialWordValue2 = false;
                    dateInputValidated = moment(predicate.value2, this.dateFormats, true).isValid();
                } else {
                    specialWordValue2 = true;
                    predicate.value2 = predicate.value2.toLocaleLowerCase();
                }
            }
        }

        if (dateInputValidated) {
            predicate.value1 = specialWordValue1 ? predicate.value1 :
                moment(predicate.value1, this.dateFormats, true).format('DD MMM YYYY');
            predicate.value2 = specialWordValue2 ? predicate.value2 :
                moment(predicate.value2, this.dateFormats, true).format('DD MMM YYYY');
            return predicate;
        } else { return null; }
    }

    private buildListAndSearchFilter(input: string, operator: ListAndSearchOperator): ListAndSearchFilterPredicate {
        let predicate = new ListAndSearchFilterPredicate();
        predicate.operator = operator.operator;
        predicate = this.getCaptureValueFromRegex(input, operator, predicate);
        return predicate;
    }

    private getCaptureValueFromRegex(input: string,
        operator: ListAndSearchOperator,
        predicate: ListAndSearchFilterPredicate): ListAndSearchFilterPredicate {

        // this is defined for simple operators for now such as for text and numerics
        switch (operator.operator.toLocaleLowerCase()) {
            case 'empty':
            case 'notempty':
                predicate.value1 = '';
                break; // in these cases, the the value is emptry string
            case 'bt':
                // Array ["between 42.64 and 69.43", "between", "42.64", ".64", "69.43", ".43"]
                const valueArray = RegExp(operator.validator, 'i').exec(input);
                predicate.value1 = valueArray[2];
                predicate.value2 = valueArray[4];
                break;
            default: predicate.value1 = RegExp(operator.validator, 'i').exec(input)[2]; // [input, operator, value, ...]
        }

        return predicate;
    }

    getFilterCompleteStringValue(filter: ListAndSearchFilter): string {
        return filter.fieldFriendlyName + ' ' + this.getFilterStringValue(filter);
    }

    getFilterStringValue(filter: ListAndSearchFilter): string {
        let filterStringValue: string = '';
        if (filter.predicate.operator) {
            switch (filter.predicate.operator.toLocaleLowerCase()) {
                case 'empty':
                    filterStringValue = '= Empty';
                    break;
                case 'notempty':
                    filterStringValue = '= Not Empty ';
                    break;
                case 'bt':
                    filterStringValue = 'Between ' + filter.predicate.value1 + ' and ' + filter.predicate.value2;
                    break;
                case 'eq':
                    filterStringValue = '= ' + filter.predicate.value1;
                    filterStringValue = (filter.predicate.value1.toLocaleLowerCase() === 'today') ? '= Today' : filterStringValue;
                    filterStringValue = (filter.predicate.value1.toLocaleLowerCase() === 'yesterday') ? '= Yesterday' : filterStringValue;
                    break;
                case 'ne': filterStringValue = '!= ' + filter.predicate.value1;
                           break;
                case 'in': filterStringValue = 'in ' + filter.predicate.value1;
                           break;
                case 'gt': filterStringValue = '> ' + filter.predicate.value1;
                           break;
                case 'ge': filterStringValue = '>= ' + filter.predicate.value1;
                           break;
                case 'lt': filterStringValue = '< ' + filter.predicate.value1;
                           break;
                case 'le': filterStringValue = '<= ' + filter.predicate.value1;
                           break;
                default: filterStringValue = filter.predicate.operator + ' ' + filter.predicate.value1;
            }
        }

        return filterStringValue;

    }

}
