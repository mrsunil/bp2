import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'atlas-warning-component',
    templateUrl: './warning-component.component.html',
    styleUrls: ['./warning-component.component.scss'],
})
export class WarningComponent implements OnInit {
    @Input() icon: string;
    @Input() title: string;
    @Input() message: string;
    @Input() isActionDisplayed: boolean = false;
    constructor() { }

    ngOnInit() {

    }
}
