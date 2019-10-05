import { Directive, HostListener, ElementRef, Input } from '@angular/core';
import { MatDatepickerInputEvent } from "@angular/material/datepicker";
import { Moment } from "moment";
import * as _moment from 'moment';
const moment = _moment;

@Directive({
	selector: '[atr-date-picker-local-date]'
})
export class DatepickerLocaldateDirective {
	el: ElementRef = null;
	constructor(element: ElementRef) {
		this.el = element;
	}

	@HostListener('dateChange', ['$event'])
	onDateValueChange(event: MatDatepickerInputEvent<Moment>) {


	}
}
