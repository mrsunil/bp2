import { Injectable } from '@angular/core';
import { ListAndSearchOperator } from '../list-and-search-operator.entity';
import { ListAndSearchPredicatePreset } from '../list-and-search-predicate-preset.entity';

@Injectable()
export class ListAndSearchDatePredicatePresetProvider {
    private dateFilterPredicatePresets: ListAndSearchPredicatePreset;

    getPresets() {
        if (!this.dateFilterPredicatePresets) {
            this.buildPredicates();
        }

        return this.dateFilterPredicatePresets;
    }
    // allows following formats: 1/1/0001  01/01/1000 31/12/9999 and sadly 31/02/0010
    // ((([0-2]?\d{1})|([3][0,1]{1}))\/((0?\d{1})|(1[0-2]{1}))\/(([1]{1}[9]{1}[9]{1}\d{1})|([2-9]{1}\d{3})))

    private buildPredicates() {
        this.dateFilterPredicatePresets = new ListAndSearchPredicatePreset();

        this.dateFilterPredicatePresets.operators = [];

        let dateOperator = new ListAndSearchOperator();
        dateOperator.operator = 'empty';
        dateOperator.symbole = 'Empty';
        dateOperator.validator = /^= empty$/;
        this.dateFilterPredicatePresets.operators.push(dateOperator);

        dateOperator = new ListAndSearchOperator();
        dateOperator.operator = 'notEmpty';
        dateOperator.symbole = 'Not Empty';
        dateOperator.validator = /^= not empty$/;
        this.dateFilterPredicatePresets.operators.push(dateOperator);

        dateOperator = new ListAndSearchOperator();
        dateOperator.operator = 'eq';
        dateOperator.symbole = 'Yesterday';
        dateOperator.validator = /^(=) (yesterday)$/;
        this.dateFilterPredicatePresets.operators.push(dateOperator);

        dateOperator = new ListAndSearchOperator();
        dateOperator.operator = 'eq';
        dateOperator.symbole = 'Today';
        dateOperator.validator = /^(=) (today)$/;
        this.dateFilterPredicatePresets.operators.push(dateOperator);

        dateOperator = new ListAndSearchOperator();
        dateOperator.operator = 'bt';
        dateOperator.symbole = 'Between';
        dateOperator.validator = /^(between) (.+) (and) (.+)$/;
        this.dateFilterPredicatePresets.operators.push(dateOperator);

        dateOperator = new ListAndSearchOperator();
        dateOperator.operator = 'eq';
        dateOperator.symbole = '=';
        dateOperator.validator = /^(=) (.+)$/;
        this.dateFilterPredicatePresets.operators.push(dateOperator);

        dateOperator = new ListAndSearchOperator();
        dateOperator.operator = 'ne';
        dateOperator.symbole = '!=';
        dateOperator.validator = /^(!=) (.+)$/;
        this.dateFilterPredicatePresets.operators.push(dateOperator);

        dateOperator = new ListAndSearchOperator();
        dateOperator.operator = 'gt';
        dateOperator.symbole = '>';
        dateOperator.validator = /^(>) (.+)$/;
        this.dateFilterPredicatePresets.operators.push(dateOperator);

        dateOperator = new ListAndSearchOperator();
        dateOperator.operator = 'ge';
        dateOperator.symbole = '>=';
        dateOperator.validator = /^(>=) (.+)$/;
        this.dateFilterPredicatePresets.operators.push(dateOperator);

        dateOperator = new ListAndSearchOperator();
        dateOperator.operator = 'lt';
        dateOperator.symbole = '<';
        dateOperator.validator = /^(<) (.+)$/;
        this.dateFilterPredicatePresets.operators.push(dateOperator);

        dateOperator = new ListAndSearchOperator();
        dateOperator.operator = 'le';
        dateOperator.symbole = '<=';
        dateOperator.validator = /^(<=) (.+)$/;
        this.dateFilterPredicatePresets.operators.push(dateOperator);

        this.dateFilterPredicatePresets.acceptedValues = [];
        this.dateFilterPredicatePresets.acceptedValues.push('.');
    }

}
