import { AbstractControl, ValidationErrors } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { TradingService } from '../../shared/services/http-services/trading.service';

export class CostMatrixNameAsyncValidator {
    static createValidator(tradingService: TradingService) {
        return (control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
            if (control.value) {
                return tradingService.checkCostMatrixNameExists(control.value).pipe(
                    map((res) => {
                        return res ? { notUnique: true } : null;
                    }),
                );
            }
            return of(null);
        };

    }
}
