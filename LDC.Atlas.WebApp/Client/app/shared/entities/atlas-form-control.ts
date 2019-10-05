import { AbstractControl, AbstractControlOptions, AsyncValidatorFn, FormControl, ValidatorFn, Validators } from '@angular/forms';

export class AtlasFormControl extends FormControl {
    private _id: string;
    private _validators: ValidatorFn[];
    private _asyncValidators: AsyncValidatorFn[];
    private _isRequired: boolean;

    public constructor(
        id: string,
        formState: any = '',
        validatorOrOpts?:
            | ValidatorFn
            | ValidatorFn[]
            | AbstractControlOptions
            | null,
        asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null,
    ) {
        super(formState, validatorOrOpts, asyncValidator);
        this._id = id;
        this._validators = [];
        this._asyncValidators = []; this._id = id;
        this._validators = [];
        this._asyncValidators = [];
        this._isRequired = false;
    }

    get id(): string {
        return this._id;
    }

    get validators() {
        return this._validators;
    }

    get asyncValidators() {
        return this._asyncValidators;
    }

    get isRequired() {
        return this._isRequired;
    }

    private addValidators<T>(validator: T | T[], collection: T[]) {
        if (Array.isArray(validator)) {
            validator.forEach((item) => {
                if (collection.indexOf(item) <= -1) {
                    collection.push(item);
                }
            });
        } else {
            const newValidator = validator as T;
            if (collection.indexOf(newValidator) <= -1) {
                collection.push(newValidator);
            }
        }
    }

    setValidators(newValidator: ValidatorFn | ValidatorFn[]) {
        if (newValidator) {
            this.addValidators<ValidatorFn>(newValidator, this._validators);
            super.setValidators(Validators.compose(this._validators));
            if (this.validator) {
                // tslint:disable-next-line:no-object-literal-type-assertion
                const validator = this.validator({} as AbstractControl);
                if (validator && validator.required) {
                    this._isRequired = true;
                }
            }
        }
        this.updateValueAndValidity();
    }

    setAsyncValidators(newValidator: AsyncValidatorFn | AsyncValidatorFn[]) {
        if (newValidator) {
            this.addValidators<AsyncValidatorFn>(newValidator, this._asyncValidators);
            super.setAsyncValidators(Validators.composeAsync(this._asyncValidators));
        }
    }

    clearValidators() {
        this._validators = [];
        super.clearValidators();
    }

    clearAsyncValidators() {
        this._asyncValidators = [];
        super.clearAsyncValidators();
    }
}
