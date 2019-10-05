import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
	selector: '[sign-number]'
})
export class SignNumberDirective {

	el: ElementRef = null;
	constructor(element: ElementRef) {
		this.el = element;
	}
	@Input() maxdecimals: number;
	@Input() positive: boolean = false; 


	@HostListener('change') onChangeHandler() {
		this.setMaxNumberOfDecimals();
		this.checkPositive();
		this.addPlusSign();
	}

	@HostListener('onfocusout') onFocusOutHandler() {
		this.setMaxNumberOfDecimals();
		this.checkPositive();
		this.addPlusSign(); 
	}

	@HostListener('document:keyup', ['$event']) onKeydownHandler(event: KeyboardEvent) {
		this.setMaxNumberOfDecimals();
		this.checkPositive();
		this.addPlusSign();
	}

	setMaxNumberOfDecimals() {
		if (this.maxdecimals == null) this.maxdecimals = 2;
		if (this.el.nativeElement.value != null) {
			let valueString: string = String(this.el.nativeElement.value);
			let splits: string[] = valueString.split('.');
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

	addPlusSign() {
		if (this.el.nativeElement.value != null) {
			if (Number(this.el.nativeElement.value) > 0) {
				if (!this.el.nativeElement.value.startWith("+"))
					this.el.nativeElement.value = "+" + Number(this.el.nativeElement.value);
			}
		}
	}
}
