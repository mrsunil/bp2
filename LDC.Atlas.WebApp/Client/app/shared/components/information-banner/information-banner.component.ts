import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'atlas-information-banner',
    templateUrl: './information-banner.component.html',
    styleUrls: ['./information-banner.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InformationBannerComponent implements OnInit {

    @Input() title: string;
    @Input() description: string;

    constructor() { }

    ngOnInit() {
    }

}
