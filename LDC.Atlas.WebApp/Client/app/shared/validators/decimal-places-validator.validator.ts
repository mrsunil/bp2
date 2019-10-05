import { ValidatorFn } from '@angular/forms/src/directives/validators';
import { AbstractControl } from '@angular/forms/src/model';
import * as _moment from 'moment';
import { Moment } from 'moment/moment';
const moment = _moment;

export function isNumberValid(quantity: any): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
        if (quantity != null) {
            const valueString: string = String(quantity);
            const splits: string[] = valueString.split('.');
            if (splits.length > 1) {
                if (splits[0].length > 12) {
                  return { isNumberOutOfRange: true };
                }
                else if(splits[0].length <= 12)
                {
                  if (splits[1].length > 10) {
                    return { isNumberOutOfRange: true };
                  }
                  else if(splits[1].length <= 10)
                  {
                    return null;
                  }
                }              
            }
            else{
              if (splits[0].length > 12) {
                return { isNumberOutOfRange: true };
              }
              else if (splits[0].length <= 12) {
                return null;
              }
            }
        }
    };
}



