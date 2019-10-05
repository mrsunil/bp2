import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import * as moment from 'moment';
import { CompanyManagerService } from '../../core/services/company-manager.service';

@Injectable()
export class UtilService {
    constructor(protected companyManager: CompanyManagerService) { }

    public compareFn: ((f1: any, f2: any) => boolean) | null = this
        .compareByValue;

    public compareDateFn(f1: any, f2: any) {
        const f1Date: Date = new Date(f1);
        const f2Date: Date = new Date(f2);
        return (
            f1Date.getMonth() === f2Date.getMonth() &&
            f1Date.getFullYear() === f2Date.getFullYear()
        );
    }

    public compareByValue(f1: any, f2: any) {
        return f1 && f2 && f1.type === f2.type && f1.month === f2.month;
    }

    public filterDictByValue(
        value: string,
        list: any[],
        propertyToCompare: string = 'value',
    ) {
        if (value) {
            return list.filter(
                (item) =>
                    item[propertyToCompare]
                        .toLowerCase()
                        .indexOf(value.toLowerCase()) === 0,
            );
        }
        return null;
    }

    public filterCollectionByMultipleValues(list: any[], template: any): any {
        if (template) {
            return list.filter((item) => {
                return Object.keys(template).some(
                    (propertyName) =>
                        item[propertyName]
                            .toLowerCase()
                            .indexOf(template[propertyName].toLowerCase()) === 0,
                );
            });
        }
        return null;
    }

    public isNumber(o: number) {
        return !isNaN(o - 0) && o !== null;
    }

    public date1BeforeDate2(date1: any, date2: any) {
        return new Date(date2) > new Date(date1);
    }

    public isRequired(control: AbstractControl): boolean {
        if (control.validator) {
            // tslint:disable-next-line:no-object-literal-type-assertion
            const validator = control.validator({} as AbstractControl);
            if (validator && validator.required) {
                return true;
            }
        }

        return false;
    }

    public filterListforAutocomplete(
        input: string,
        list: any[],
        propertiesToCompare: string[],
        valueProperty?: string,
    ) {

        let filteredList = list;
        if (input) {
            filteredList = list.filter((item) => {
                let isValid = false;
                propertiesToCompare.forEach((prop) => {
                    isValid = isValid
                        || (item[prop] &&
                            (
                                (item[prop].toString().toLowerCase())
                                    .startsWith(input.toString().toLowerCase())
                                || (item[prop]).toString().startsWith(input[prop])
                                || (item[prop].toString().toLowerCase()) === (input.toString().toLowerCase())
                                || (item[prop]).toString() === (input[prop])
                            )
                        );
                });
                return isValid;
            });
            if (filteredList.length === 0 && valueProperty) {
                const selectedValue = list.find((item) => item[valueProperty] === input);
                if (selectedValue) {
                    filteredList = [selectedValue];
                }
            }
        }
        return filteredList;
    }

    public filterListforAutocompleteWithTechnicalId(
        input: string,
        list: any[],
        propertiesToCompare: string[],
        propertyForId: string,
    ) {

        let filteredList = this.filterListforAutocomplete(input, list, propertiesToCompare);

        filteredList = filteredList.concat(list.filter((item) => {
            return item[propertyForId] === input;
        }));

        return filteredList;
    }

    public convertToCamelCase(field: string) {
        let lastUpperCase = this.getLastUpperCase(field);
        lastUpperCase = lastUpperCase <= 0 ? 1 : lastUpperCase;

        return field.substring(0, lastUpperCase).toLowerCase() + field.substring(lastUpperCase);
    }

    public getLastUpperCase(word: string): number {
        for (let i = 0; i < word.length; i++) {
            if (word[i].match(/[A-Z]/) === null) {
                return i - 1;
            }
        }
    }

    // this function removes single error
    public removeError(control: AbstractControl, error: string) {
        const err = control.errors; // get control errors
        if (err) {
            delete err[error]; // delete your own error
            if (!Object.keys(err).length) { // if no errors left
                control.setErrors(null); // set control errors to null making it VALID
            } else {
                control.setErrors(err); // controls got other errors so set them back
            }
        }
    }

    public sameValue(firstFormControlName: string, secondFormControlName: string, allowEqual: boolean = true) {
        return (abstractForm: FormGroup): { [key: string]: any } => {
            const firstFormControl = abstractForm.get(firstFormControlName);
            const secondFormControl = abstractForm.get(secondFormControlName);

            if (firstFormControl && firstFormControl.value
                && secondFormControl && secondFormControl.value) {
                const res = (Number(firstFormControl.value) === Number(secondFormControl.value));
                if (!res) {
                    firstFormControl.setErrors({ checkValue: true });
                    secondFormControl.setErrors({ checkValue: true });
                    return { checkValue: true };
                } else {
                    this.removeError(firstFormControl, 'checkValue');
                    this.removeError(secondFormControl, 'checkValue');
                }

            }
            return null;
        };
    }

    public isInSameMonthOrAfter(date: moment.Moment): boolean {
        const now: moment.Moment = this.companyManager.getCurrentCompanyDate();
        return date.isSameOrAfter(now, 'month');
    }

    public updateFormGroupValidity(formGroup: FormGroup) {
        if (formGroup.controls) {
            Object.keys(formGroup.controls).forEach((controlName) => {
                const control = formGroup.controls[controlName] as FormGroup;
                this.updateFormGroupValidity(control);
            });
        }
        formGroup.updateValueAndValidity();
        formGroup.markAsTouched();
    }

    public sortArrayAlphabetically(array: any[], propertyToCompare: string[]) {
        if (array && propertyToCompare) {
            array.sort((current, next) => {
                propertyToCompare.forEach((property, index) => {
                    if (current[property] < next[property]) { return -1; }
                    if (current[property] > next[property]) { return 1; }
                });

                return 0;
            });
        }
    }

    public removeItemsFromArray(array: any[], itemsToRemove: any[], propertyToCompare?: string): void {
        if (array && itemsToRemove) {
            for (let i = array.length - 1; i >= 0; i--) {
                for (let j = 0; j < itemsToRemove.length; j++) {
                    const source = array[i];
                    const itemToRemove = itemsToRemove[j];

                    if (source &&
                        itemToRemove &&
                        source.hasOwnProperty(propertyToCompare) &&
                        itemToRemove.hasOwnProperty(propertyToCompare) &&
                        ((propertyToCompare &&
                            (source[propertyToCompare] === itemToRemove[propertyToCompare]))
                            ||
                            (!propertyToCompare &&
                                (source === itemToRemove)))) {
                        array.splice(i, 1);
                    }
                }
            }
        }
    }

    public getFileNameFromContentDisposition<T>(response: HttpResponse<T>): string {
        const contentDisposition = response.headers.get('Content-Disposition') || '';
        const matches = /filename=([^;]+)/ig.exec(contentDisposition);
        const fileName = (matches[1] || 'document').trim().replace(/"/g, '');
        return fileName;
    }
}

// this code has been copied from the security service
export function nameof<T>(key: keyof T, instance?: T): keyof T {
    return key;
}
