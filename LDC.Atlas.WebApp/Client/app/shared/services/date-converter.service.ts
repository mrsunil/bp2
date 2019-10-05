import { Injectable } from '@angular/core';
import { Moment } from 'moment';

@Injectable()
export class DateConverterService {

    constructor() { }

    dateToStringConverter(dateToConvert: Date, timeToZero: boolean = true): string {
        if (dateToConvert == null) {
            return null;
        }
        dateToConvert = new Date(dateToConvert);
        let date: Date;
        if (timeToZero) {
            date = new Date(Date.UTC(
                dateToConvert.getFullYear(),
                dateToConvert.getMonth(),
                dateToConvert.getDate(),
                0, 0, 0));
        } else {
            date = new Date(Date.UTC(
                dateToConvert.getFullYear(),
                dateToConvert.getMonth(),
                dateToConvert.getDate(),
                dateToConvert.getHours(),
                dateToConvert.getMinutes(),
                dateToConvert.getSeconds()));
        }
        return date.toISOString();
    }

    momentToUTC(dateMoment: Moment): Date {
        if (dateMoment === undefined) { return null; }
        if (dateMoment.toString() === '') { return null; }
        const date: Date = dateMoment.toDate();
        return new Date(Date.UTC(date.getFullYear(),
                                 date.getMonth(),
                                 date.getDate(),
                                 date.getHours(),
                                 date.getMinutes(),
                                 date.getSeconds(),
                                 date.getMilliseconds()));
    }

    toUTC(date: Date): Date {
        if (date === undefined) { return null; }
        if (date.toString() === '') { return null; }
        return new Date(Date.UTC(date.getFullYear(),
                                 date.getMonth(),
                                 date.getDate(),
                                 date.getHours(),
                                 date.getMinutes(),
                                 date.getSeconds(),
                                 date.getMilliseconds()));
    }

    correctDate(date: Date): Date {
        return new Date(date);
    }

}
