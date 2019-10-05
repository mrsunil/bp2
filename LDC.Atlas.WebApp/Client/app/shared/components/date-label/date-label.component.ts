import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'atr-date-label',
    templateUrl: './date-label.component.html',
    styleUrls: ['./date-label.component.scss'],
})
export class DateLabelComponent implements OnInit {

    @Input() date: Date;
    @Input() dateFormat = 'dd MMM yyyy';

    constructor() { }

    ngOnInit() {
    }

}
