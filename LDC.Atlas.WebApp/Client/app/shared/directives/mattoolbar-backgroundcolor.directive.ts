import { Directive, ElementRef, OnInit } from '@angular/core';
import { UiService } from '../services/ui.service';
@Directive({
    selector: '[matToolbarHighlight]',
})
export class HighlightDirective implements OnInit {
    element: ElementRef = null;
    envName: string;
    constructor(el: ElementRef, private uiService: UiService) {
        this.element = el;

    }
    ngOnInit() {
        this.envName = this.uiService.getStylesForEnvironments();
        switch (this.envName) {
            case '-dev': {
                return this.element.nativeElement.style.backgroundColor = '#FF9661';
            }
            case '-demo': {
                return this.element.nativeElement.style.backgroundColor = '#FFC65B';
            }
            case '-uat': {
                return this.element.nativeElement.style.backgroundColor = '#F46B72';
            }
            case '-training': {
                return this.element.nativeElement.style.backgroundColor = '#CB4D84';
            }
            case '-support': {
                return this.element.nativeElement.style.backgroundColor = '#90408D';
            }

            default: {
                return this.element.nativeElement.style.backgroundColor = '#185b9d';
            }

        }
    }
}
