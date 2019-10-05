import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
    selector: '[atlas-number-decimals]',
})
export class NumberDecimalsDirective {

    el: ElementRef = null;
    constructor(element: ElementRef) {
        this.el = element;
    }
    @Input() maxdecimals: number = 0;
    @Input() positive: boolean = false;
    @Input() maxValue: number = undefined;

    @HostListener('change') onChangeHandler() {
        this.setMaxNumberOfDecimals();
        this.checkPositive();
        this.checkMaxValue();

    }

    @HostListener('document:keyup', ['$event']) onKeydownHandler(event: KeyboardEvent) {
        this.setMaxNumberOfDecimals();
        this.checkPositive();
        this.checkMaxValue();
    }

    setMaxNumberOfDecimals() {
        if (this.maxdecimals == null) { this.maxdecimals = 2; }
        if (this.el.nativeElement.value != null) {
            const valueString: string = String(this.el.nativeElement.value);
            const splits: string[] = valueString.split('.');
            if (splits.length > 1) {
                if (splits[1].length > this.maxdecimals) {
                    this.el.nativeElement.value = Number(valueString.substring(0, valueString.length - 1));
                }

            }
        }
    }

    checkPositive() {
        if (this.positive) {
            if (this.el.nativeElement.value != null) {
                if (Number(this.el.nativeElement.value) < 0) {
                    this.el.nativeElement.value = Number(this.el.nativeElement.value) * -1;
                }
            }
        }
    }

    checkMaxValue() {
        if (this.maxValue !== undefined) {
            if (this.el.nativeElement.value != null) {
                if (Number(this.el.nativeElement.value) > this.maxValue) {
                    this.el.nativeElement.value = this.maxValue;
                }
            }
        }
    }
}
