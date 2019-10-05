import { Component, OnInit, Input } from '@angular/core';
export enum BannerStates {
    Success,
    Error,
    Warning,
    Information,
}
@Component({
    selector: 'atlas-intero-state-banner',
    templateUrl: './intero-state-banner.component.html',
    styleUrls: ['./intero-state-banner.component.scss']
})
export class InteroStateBannerComponent implements OnInit {

    @Input() state: BannerStates;
    @Input() title: string;
    @Input() description: string;
    icon: string;
    circleIconClass: string;

    constructor() {
    }

    ngOnInit() {
        this.setBannerStyle();
    }

    setBannerStyle() {
        switch (this.state) {
            case BannerStates.Success:
                this.icon = 'check_circle';
                this.circleIconClass = 'done';
                break;
            case BannerStates.Warning:
                this.icon = 'warning_outline';
                this.circleIconClass = 'warning-circle-icon';
                break;
            case BannerStates.Error:
                this.icon = 'remove_circle';
                this.circleIconClass = 'error-circle-icon';
                break;
            case BannerStates.Information:
                this.icon = 'info';
                this.circleIconClass = 'info-circle-icon';
                break;
        }
    }

}
