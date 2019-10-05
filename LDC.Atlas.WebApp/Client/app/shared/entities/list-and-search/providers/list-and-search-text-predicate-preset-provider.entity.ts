import { Injectable } from '@angular/core';
import { ListAndSearchOperator } from '../list-and-search-operator.entity';
import { ListAndSearchPredicatePreset } from '../list-and-search-predicate-preset.entity';

@Injectable()
export class ListAndSearchTextPredicatePresetProvider {
    private textFilterPredicatePresets: ListAndSearchPredicatePreset;

    getPresets() {
        if (!this.textFilterPredicatePresets) {
            this.buildPredicates();
        }

        return this.textFilterPredicatePresets;
    }

    private buildPredicates() {
        this.textFilterPredicatePresets = new ListAndSearchPredicatePreset();

        this.textFilterPredicatePresets.operators = [];

        let textOperator = new ListAndSearchOperator();
        textOperator.operator = 'empty';
        textOperator.symbole = 'Empty';
        textOperator.validator = /^= empty$/;
        this.textFilterPredicatePresets.operators.push(textOperator);

        textOperator = new ListAndSearchOperator();
        textOperator.operator = 'notEmpty';
        textOperator.symbole = 'Not Empty';
        textOperator.validator = /^= not empty$/;
        this.textFilterPredicatePresets.operators.push(textOperator);

        textOperator = new ListAndSearchOperator();
        textOperator.operator = 'eq';
        textOperator.symbole = '=';
        textOperator.validator = /^(=) (%?[^%]+%?)$/;
        this.textFilterPredicatePresets.operators.push(textOperator);

        textOperator = new ListAndSearchOperator();
        textOperator.operator = 'ne';
        textOperator.symbole = '!=';
        textOperator.validator = /^(!=) (%?[^%]+%?)$/;
        this.textFilterPredicatePresets.operators.push(textOperator);

        textOperator = new ListAndSearchOperator();
        textOperator.operator = 'in';
        textOperator.symbole = 'in';
        textOperator.validator = /^(in) (([^, ]*, )*[^, ]*)$/;
        this.textFilterPredicatePresets.operators.push(textOperator);

        this.textFilterPredicatePresets.acceptedValues = [];
        this.textFilterPredicatePresets.acceptedValues.push('.');
    }

}
