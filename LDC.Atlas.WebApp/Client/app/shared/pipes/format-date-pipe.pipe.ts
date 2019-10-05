import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({ name: 'formatDate' })
export class FormatDatePipe implements PipeTransform {
    transform(value: Date): string {
        return (value == null) ? null : moment(new Date(value)).format('DD MMM YYYY').toString().toUpperCase();
    }
    transformdate(value: Date): string {
        return (value == null) ? null : moment(new Date(value)).format('DD/MM/YYYY').toString().toUpperCase();
    }
    transformtime(value: Date): string {
        return (value == null) ? null : moment(new Date(value)).format('hh:mm:ss').toString().toUpperCase();
    }
    transformTimeWithoutSeconds(value: Date): string {
        return (value == null) ? null : moment(new Date(value)).format('hh:mm').toString().toUpperCase();
    }
}
