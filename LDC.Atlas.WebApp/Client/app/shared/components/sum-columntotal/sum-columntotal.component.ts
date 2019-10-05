import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'atlas-sum-columntotal',
    templateUrl: './sum-columntotal.component.html',
    styleUrls: ['./sum-columntotal.component.scss'],
})
export class SumColumntotalComponent implements OnInit {
    totalSumShow: boolean = false;
    amountSum: number = 0;
    functionalCcySum: number = 0;
    statutoryCcySum: number = 0;
    functionalCcyTitle: string;
    statutoryCcyTitle: string;
    constructor() { }

    ngOnInit() {
    }

    formatValue(amount: number): string {
        if (isNaN(amount) || amount === null) { return ''; }
        return new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount);
    }

}
