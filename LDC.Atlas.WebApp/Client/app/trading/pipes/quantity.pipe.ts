import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'quantity',
})
export class QuantityPipe implements PipeTransform {

    transform(value: number, args?: any): any {
        if (value) {
            return new Intl.NumberFormat('en-US', { minimumFractionDigits: 3, maximumFractionDigits: 3 }).format(value);
        }
        return '';
    }

}
