import { AbstractControl, ValidationErrors } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { ConfigurationService } from '../../shared/services/http-services/configuration.service';

export class FunctionalObjectNameValidator {
    static createValidator(configurationService: ConfigurationService, id: number) {
        return (control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
            if (control.value) {
                return configurationService.checkFunctionalObjectExists(control.value, id).pipe(
                    map((res) => {
                        return res ? { notUnique: true } : null;
                    }),
                );
            }
            return of(null);
        };

    }
}
