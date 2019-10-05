import { Injectable } from '@angular/core';
import { ListAndSearchOperator } from '../list-and-search-operator.entity';
import { ListAndSearchPredicatePreset } from '../list-and-search-predicate-preset.entity';

@Injectable()
export class ListAndSearchNumericPredicatePresetProvider {
    private numericFilterPredicatePresets: ListAndSearchPredicatePreset;

    getPresets() {
        if (!this.numericFilterPredicatePresets) {
            this.buildPredicates();
        }

        return this.numericFilterPredicatePresets;
    }

    private buildPredicates() {
        this.numericFilterPredicatePresets = new ListAndSearchPredicatePreset();

        this.numericFilterPredicatePresets.operators = [];

        let numericOperator = new ListAndSearchOperator();
        numericOperator.operator = 'empty';
        numericOperator.symbole = 'Empty';
        numericOperator.validator = /^= empty$/;
        this.numericFilterPredicatePresets.operators.push(numericOperator);

        numericOperator = new ListAndSearchOperator();
        numericOperator.operator = 'notEmpty';
        numericOperator.symbole = 'Not Empty';
        numericOperator.validator = /^= not empty$/;
        this.numericFilterPredicatePresets.operators.push(numericOperator);

        numericOperator = new ListAndSearchOperator();
        numericOperator.operator = 'bt';
        numericOperator.symbole = 'Between';
        numericOperator.validator = /^(between) (-?[0-9]+(\.[0-9]+)?) and (-?[0-9]+(\.[0-9]+)?)$/;
        this.numericFilterPredicatePresets.operators.push(numericOperator);

        numericOperator = new ListAndSearchOperator();
        numericOperator.operator = 'eq';
        numericOperator.symbole = '=';
        numericOperator.validator = /^(=) (-?[0-9]+(\.[0-9]+)?)$/;
        this.numericFilterPredicatePresets.operators.push(numericOperator);

        numericOperator = new ListAndSearchOperator();
        numericOperator.operator = 'ne';
        numericOperator.symbole = '!=';
        numericOperator.validator = /^(!=) (-?[0-9]+(\.[0-9]+)?)$/;
        this.numericFilterPredicatePresets.operators.push(numericOperator);

        numericOperator = new ListAndSearchOperator();
        numericOperator.operator = 'gt';
        numericOperator.symbole = '>';
        numericOperator.validator = /^(>) (-?[0-9]+(\.[0-9]+)?)$/;
        this.numericFilterPredicatePresets.operators.push(numericOperator);

        numericOperator = new ListAndSearchOperator();
        numericOperator.operator = 'ge';
        numericOperator.symbole = '>=';
        numericOperator.validator = /^(>=) (-?[0-9]+(\.[0-9]+)?)$/;
        this.numericFilterPredicatePresets.operators.push(numericOperator);

        numericOperator = new ListAndSearchOperator();
        numericOperator.operator = 'lt';
        numericOperator.symbole = '<';
        numericOperator.validator = /^(<) (-?[0-9]+(\.[0-9]+)?)$/;
        this.numericFilterPredicatePresets.operators.push(numericOperator);

        numericOperator = new ListAndSearchOperator();
        numericOperator.operator = 'le';
        numericOperator.symbole = '<=';
        numericOperator.validator = /^(<=) (-?[0-9]+(\.[0-9]+)?)$/;
        this.numericFilterPredicatePresets.operators.push(numericOperator);

        this.numericFilterPredicatePresets.acceptedValues = [];
        this.numericFilterPredicatePresets.acceptedValues.push('.');
    }

}
