import { Directive, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { FlagInfo } from '../dtos/flag-info';
import { FeatureFlagService } from '../services/http-services/feature-flag.service';

@Directive({
    selector: '[atlasFeatureFlag]',
})
export class FeatureFlagDirective implements OnInit {
    private isElseSection: boolean = false;
    private gapName: string = null;

    @Input() atlasFeatureFlag: string;
    set(value: string) {
        this.atlasFeatureFlag = value;
    }

    constructor(
        private templateRef: TemplateRef<any>,
        private viewContainer: ViewContainerRef,
        private featureFlagService: FeatureFlagService,
    ) {}

    ngOnInit(): void {
        this.parseGapName(this.atlasFeatureFlag);

        this.featureFlagService.getFlagInfo(this.gapName).subscribe(
            (data: FlagInfo) => {
                if (data && data.active === true) {
                    this.showMe(data.active);
                } else {
                    this.showMe(false);
                }
            },
            (error) => {
                this.showMe(false);
            },
        );
    }

    private parseGapName(appFlagValue: string) {
        const NOT_CHAR = '!';
        const splits = appFlagValue.split(NOT_CHAR);

        if (splits.length === 1 && splits[0] === appFlagValue) {
            // A gap is in the form of <GapName>
            this.isElseSection = false;
            this.gapName = appFlagValue;
        } else if (splits.length === 2 && splits[0].trim().length === 0) {
            // A gap is in the form of !<GapName>
            this.isElseSection = true;
            this.gapName = splits[1];
        } else {
            // Unexpected parsed gap name, use logger to warn and, perhaps show an error.
        }
    }

    private showMe(flagActive: boolean) {
        if (!this.isElseSection && flagActive) {
            this.viewContainer.createEmbeddedView(this.templateRef);
        } else {
            this.viewContainer.clear();
        }
    }
}
