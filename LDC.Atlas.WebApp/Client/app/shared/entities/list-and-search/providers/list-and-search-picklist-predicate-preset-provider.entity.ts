
import { Injectable } from '@angular/core';
import { ListAndSearchOperator } from '../list-and-search-operator.entity';
import { ListAndSearchPredicatePreset } from '../list-and-search-predicate-preset.entity';

@Injectable()
export class ListAndSearchPicklistPredicatePresetProvider {
    private picklistFilterPredicatePresets: ListAndSearchPredicatePreset;

    getPresets() {
        if (!this.picklistFilterPredicatePresets) {
            this.buildPredicates();
        }

        return this.picklistFilterPredicatePresets;
    }

    protected buildPredicates() {
        this.picklistFilterPredicatePresets = new ListAndSearchPredicatePreset();

        this.picklistFilterPredicatePresets.operators = [];

        let picklistOperator = new ListAndSearchOperator();
        picklistOperator.operator = 'empty';
        picklistOperator.symbole = 'Empty';
        picklistOperator.validator = /^= empty$/;
        this.picklistFilterPredicatePresets.operators.push(picklistOperator);

        picklistOperator = new ListAndSearchOperator();
        picklistOperator.operator = 'notEmpty';
        picklistOperator.symbole = 'Not Empty';
        picklistOperator.validator = /^= not empty$/;
        this.picklistFilterPredicatePresets.operators.push(picklistOperator);

        picklistOperator = new ListAndSearchOperator();
        picklistOperator.operator = 'eq';
        picklistOperator.symbole = '=';
        picklistOperator.validator = /^(=) (%?[^%]+%?)$/;
        this.picklistFilterPredicatePresets.operators.push(picklistOperator);

        picklistOperator = new ListAndSearchOperator();
        picklistOperator.operator = 'ne';
        picklistOperator.symbole = '!=';
        picklistOperator.validator = /^(!=) (%?[^%]+%?)$/;
        this.picklistFilterPredicatePresets.operators.push(picklistOperator);

        picklistOperator = new ListAndSearchOperator();
        picklistOperator.operator = 'in';
        picklistOperator.symbole = 'in';
        picklistOperator.validator = /^(in) (([^, ]*, )*[^, ]*)$/;
        this.picklistFilterPredicatePresets.operators.push(picklistOperator);

        this.picklistFilterPredicatePresets.acceptedValues = [];
        this.picklistFilterPredicatePresets.acceptedValues.push('.');

    }

}
