import { AbstractControl, ValidationErrors } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { TradingService } from '../../shared/services/http-services/trading.service';

export class ContractReferenceAsyncValidator {
    static createValidator(tradingService: TradingService, dataVersionId?: number) {
        return (control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
            if (control.value) {
                return tradingService.checkContractReferenceExists(control.value, dataVersionId).pipe(
                    map((res) => {
                        return res ? { notUnique: true } : null;
                    }),
                );
            }
            return of(null);
        };

    }
}
