import { AbstractControl, ValidationErrors } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { ExecutionService } from '../../../shared/services/http-services/execution.service';

export class ExternalInvoiceReferenceAsyncValidator {
    static createValidator(executionService: ExecutionService) {
        return (control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
            if (control.value) {
                return executionService.checkExternalInvoiceReferenceExists(control.value).pipe(
                    map((res) => {
                        return res ? { notUnique: true } : null;
                    }),
                );
            }
            return of(null);
        };

    }
}
