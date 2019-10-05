import { Directive, ElementRef, HostListener, Input } from '@angular/core';
@Directive({
    selector: '[specialIsAlphaNumeric]'
})
export class SpecialCharacterDirective {

    regexStr = '^[a-zA-Z0-9.]*$';
    @Input() isAlphaNumeric: boolean;

    constructor(private el: ElementRef) { }


    @HostListener('keypress', ['$event']) onKeyPress(event) {
        return new RegExp(this.regexStr).test(event.key);
    }

    @HostListener('paste', ['$event'])
    @HostListener('keyup', ['$event'])
    @HostListener('mouseout', ['$event'])
    onEvent(event) {
        this.el.nativeElement.value = this.el.nativeElement.value.replace(/[^A-Za-z0-9. ]/g, '').replace(/\s/g, '');
    }

    validateFields(event) {
        this.el.nativeElement.value = this.el.nativeElement.value.replace(/[^A-Za-z ]/g, '').replace(/\s/g, '');
        event.preventDefault();
    }
}