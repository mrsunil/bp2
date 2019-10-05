import { Component, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'atlas-warning-banner',
    templateUrl: './warning-banner.component.html',
    styleUrls: ['./warning-banner.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WarningBannerComponent implements OnInit {
    @Input() title: string;
    @Input() description: string;

    constructor() { }

    ngOnInit() {
    }

}
