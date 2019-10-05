import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserGridViewDto } from '../dtos/user-grid-view-dto.dto';
import { GridConfigurationService } from '../services/http-services/grid-configuration.service';

export class GridViewNameValidator {
    static createValidator(gridConfigurationService: GridConfigurationService, gridCode: string) {
        return (control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
            if (control.value) {
                return gridConfigurationService.isGridViewNameExists(control.value, gridCode).pipe(
                    map((res) => {
                        return res ? { notUnique: true } : null;
                    }),
                );
            }
            return of(null);
        };
    }
}

export function isGridViewSameNameExists(gridViewList: UserGridViewDto[], gridViewId: number, sharingEnabled: boolean): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
        if (control.value) {
            const gridViewWithSameName = gridViewList ?
                gridViewList.find((gridView) =>
                    gridView.name === control.value
                    && gridView.gridViewId !== gridViewId
                    && !gridView.isSharedWithAllUsers
                    && !sharingEnabled) :
                null;
            return gridViewWithSameName ? { notUnique: true } : null;
        }

        return null;
    };
}
