import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { inDropdownListValidator } from '../../directives/autocomplete-dropdown.directive';
import { AtlasFormControl } from '../../entities/atlas-form-control';
import { Commodity } from '../../entities/commodity.entity';
import { PagingOptions } from '../../entities/http-services/paging-options';
import { MasterDataProps } from '../../entities/masterdata-props.entity';
import { MasterdataService } from '../../services/http-services/masterdata.service';
import { CommoditySearchTerm } from '../../services/masterdata/dtos/commodity-search-term';
import { SnackbarService } from '../../services/snackbar.service';
import { nameof, UtilService } from '../../services/util.service';
import { ContextualSearchBaseLightBoxComponent } from '../contextual-search/base-light-box/contextual-search-base-light-box.component';

@Component({
    selector: 'atlas-commodity-input',
    templateUrl: './commodity-input.component.html',
    styleUrls: ['./commodity-input.component.scss'],
})
export class CommodityInputComponent implements OnInit, OnDestroy {

    fieldGroup: FormGroup;
    @Input() required: boolean = false;
    @Output() readonly optionSelected = new EventEmitter();

    @Input() isFromAllocationPage: boolean = false;

    isAutocompleteActivated: boolean = true;

    company: string;
    commodities: Commodity[];

    commodityPart1Ctrl = new AtlasFormControl('Cmy1');
    commodityPart1CompleteList: string[] = [];
    commodityPart1FilteredList: string[] = [];
    commodityPart1Validators: ValidatorFn[] = [];

    commodityPart2Ctrl = new FormControl('');
    commodityPart2CompleteList: string[] = [];
    commodityPart2FilteredList: string[] = [];
    commodityPart2Validators: ValidatorFn[] = [];
    labelCmy2: string = 'Cmy 2';

    commodityPart3Ctrl = new FormControl('');
    commodityPart3CompleteList: string[] = [];
    commodityPart3FilteredList: string[] = [];
    commodityPart3Validators: ValidatorFn[] = [];
    labelCmy3: string = 'Cmy 3';

    commodityPart4Ctrl = new FormControl('');
    commodityPart4CompleteList: string[] = [];
    commodityPart4FilteredList: string[] = [];
    commodityPart4Validators: ValidatorFn[] = [];
    labelCmy4: string = 'Cmy 4';

    commodityPart5Ctrl = new FormControl('');
    commodityPart5CompleteList: string[] = [];
    commodityPart5FilteredList: string[] = [];
    commodityPart5Validators: ValidatorFn[] = [];
    labelCmy5: string = 'Cmy 5';

    selectedCommodityCtrl = new FormControl();

    commodityErrorMap: Map<string, string> = new Map([['inDropdownList', 'Not in list']]);

    masterdataList: string[] = [MasterDataProps.Commodities];
    destroy$ = new Subject();
    gridId = 'commodityGrid';
    lightBoxTitle = 'Results for Commodity';
    isEditable = true;

    constructor(protected utils: UtilService,
        protected dialog: MatDialog,
        protected snackbarService: SnackbarService,
        protected formBuilder: FormBuilder,
        protected masterdataService: MasterdataService,
    ) { }

    ngOnInit() {

        this.masterdataService
            .getMasterData(this.masterdataList)
            .pipe(
                map((masterdata) => masterdata.commodities),
                takeUntil(this.destroy$),
            )
            .subscribe((commodities) => {
                this.commodities = commodities;
                this.initialize();
            });

    }

    initialize() {
        this.buildCommodityArrays();
        this.setValidators();
        if (this.selectedCommodityCtrl.value) {
            this.optionSelected.emit((this.selectedCommodityCtrl.value as Commodity).commodityId);
        }
    }

    initControlValidators() {
        this.commodityPart1Validators = [inDropdownListValidator(
            this.commodityPart1CompleteList,
            nameof<Commodity>('principalCommodity'),
            false,
            false,
        ), this.parentFormControlValid(this.selectedCommodityCtrl)];
        this.commodityPart2Validators = [inDropdownListValidator(
            this.commodityPart2CompleteList,
            nameof<Commodity>('part2'),
            false,
            false,
        ), this.parentFormControlValid(this.selectedCommodityCtrl)];
        this.commodityPart3Validators = [inDropdownListValidator(
            this.commodityPart3CompleteList,
            nameof<Commodity>('part3'),
            false,
            false,
        ), this.parentFormControlValid(this.selectedCommodityCtrl)];
        this.commodityPart4Validators = [inDropdownListValidator(
            this.commodityPart4CompleteList,
            nameof<Commodity>('part4'),
            false,
            false,
        ), this.parentFormControlValid(this.selectedCommodityCtrl)];
        this.commodityPart5Validators = [
            inDropdownListValidator(
                this.commodityPart5CompleteList,
                nameof<Commodity>('part5'),
                false,
                false,
            ),
            this.parentFormControlValid(this.selectedCommodityCtrl),
        ];
    }

    getFormGroup() {
        this.fieldGroup = this.formBuilder.group(
            {
                selectedCommodity: this.selectedCommodityCtrl,
                commodityPart1: this.commodityPart1Ctrl,
                commodityPart2: this.commodityPart2Ctrl,
                commodityPart3: this.commodityPart3Ctrl,
                commodityPart4: this.commodityPart4Ctrl,
                commodityPart5: this.commodityPart5Ctrl,
            },
        );

        return this.fieldGroup;
    }

    setValidators() {
        this.initControlValidators();
        if (this.required) {
            this.selectedCommodityCtrl.setValidators(Validators.required);
        }

        this.commodityPart1Ctrl.setValidators(
            Validators.compose(this.commodityPart1Validators),
        );

        this.commodityPart2Ctrl.setValidators(
            Validators.compose(this.commodityPart2Validators),
        );

        this.commodityPart3Ctrl.setValidators(
            Validators.compose(this.commodityPart3Validators),
        );

        this.commodityPart4Ctrl.setValidators(
            Validators.compose(this.commodityPart4Validators),
        );

        this.commodityPart5Ctrl.setValidators(
            Validators.compose(this.commodityPart5Validators),
        );
    }

    private buildCommodityArrays() {
        this.commodities.forEach((cmy: Commodity) => {
            // Commodity Part 1 should always be defined and is independant
            this.commodityPart1CompleteList = this.pushUniqueStringInArray(this.commodityPart1CompleteList, cmy.principalCommodity);
        });

        // Form Controls value changes
        // -- Part 1
        this.commodityPart1FilteredList = this.commodityPart1CompleteList;
        this.commodityPart1Ctrl.valueChanges.subscribe(() => {
            if (!this.isFromAllocationPage) {
                this.onCommodityChange('commodityPart1');
            }
        });

        // -- Part 2
        this.commodityPart2Ctrl.valueChanges.subscribe(() => {
            if (!this.isFromAllocationPage) {
                this.onCommodityChange('commodityPart2');
            }
        });

        // -- Part 3
        this.commodityPart3Ctrl.valueChanges.subscribe(() => {
            if (!this.isFromAllocationPage) {
                this.onCommodityChange('commodityPart3');
            }
        });

        // -- Part 4
        this.commodityPart4Ctrl.valueChanges.subscribe(() => {
            if (!this.isFromAllocationPage) {
                this.onCommodityChange('commodityPart4');
            }
        });

        // -- Part 5 : just filter the list
        this.commodityPart5Ctrl.valueChanges.subscribe(() => {
            if (!this.isFromAllocationPage) {
                this.onCommodityChange('commodityPart5');
            }
        });
    }

    onCommodityChange(controlName: string) {
        if (this.fieldGroup && this.fieldGroup.get(controlName) &&
            this.fieldGroup.value[controlName] === this.fieldGroup.get(controlName).value) {
            // Old value === new value
            return;
        }
        const valuePart1 = this.commodityPart1Ctrl.value ? this.commodityPart1Ctrl.value : '';
        const valuePart2 = this.commodityPart2Ctrl.value ? this.commodityPart2Ctrl.value : '';
        const valuePart3 = this.commodityPart3Ctrl.value ? this.commodityPart3Ctrl.value : '';
        const valuePart4 = this.commodityPart4Ctrl.value ? this.commodityPart4Ctrl.value : '';
        const valuePart5 = this.commodityPart5Ctrl.value ? this.commodityPart5Ctrl.value : '';
        switch (controlName) {
            case ('commodityPart1'): {
                this.commodityPart2Ctrl.reset();
                this.commodityPart1FilteredList = this.commodityPart1CompleteList.filter((cmy) => {
                    return cmy.toLocaleLowerCase().startsWith(valuePart1.toLocaleLowerCase());
                });
                this.commodityPart2CompleteList = this.getDistinctString(this.commodities
                    .filter((commodity) =>
                        (commodity.principalCommodity ?
                            commodity.principalCommodity : '').toLocaleLowerCase() === valuePart1.toLocaleLowerCase(),
                    )
                    .map((commodity) => commodity.part2 ? commodity.part2 : ''))
                    .sort();
            }
            // tslint:disable-next-line:no-switch-case-fall-through
            case ('commodityPart2'): {
                this.commodityPart3Ctrl.reset();
                this.commodityPart2FilteredList = this.commodityPart2CompleteList.filter((cmy) => {
                    return cmy.toLocaleLowerCase().startsWith(valuePart2.toLocaleLowerCase());
                });
                this.commodityPart3CompleteList = this.getDistinctString(this.commodities
                    .filter((commodity) =>
                        (commodity.principalCommodity ? commodity.principalCommodity : '').toLocaleLowerCase() === valuePart1.toLocaleLowerCase()
                        &&
                        (commodity.part2 ? commodity.part2 : '').toLocaleLowerCase() === valuePart2.toLocaleLowerCase(),
                    )
                    .map((commodity) => commodity.part3 ? commodity.part3 : ''))
                    .sort();
            }
            // tslint:disable-next-line:no-switch-case-fall-through
            case ('commodityPart3'): {
                this.commodityPart4Ctrl.reset();
                this.commodityPart3FilteredList = this.commodityPart3CompleteList.filter((cmy) => {
                    return cmy.toLocaleLowerCase().startsWith(valuePart3.toLocaleLowerCase());
                });
                this.commodityPart4CompleteList = this.getDistinctString(this.commodities
                    .filter((commodity) =>
                        (commodity.principalCommodity ? commodity.principalCommodity : '').toLocaleLowerCase() === valuePart1.toLocaleLowerCase()
                        &&
                        (commodity.part2 ? commodity.part2 : '').toLocaleLowerCase() === valuePart2.toLocaleLowerCase()
                        &&
                        (commodity.part3 ? commodity.part3 : '').toLocaleLowerCase() === valuePart3.toLocaleLowerCase(),
                    )
                    .map((commodity) => commodity.part4 ? commodity.part4 : ''))
                    .sort();
            }
            // tslint:disable-next-line:no-switch-case-fall-through
            case ('commodityPart4'): {
                this.commodityPart5Ctrl.reset();
                this.commodityPart4FilteredList = this.commodityPart4CompleteList.filter((cmy) => {
                    return cmy.toLocaleLowerCase().startsWith(valuePart4.toLocaleLowerCase());
                });
                this.commodityPart5CompleteList = this.getDistinctString(this.commodities
                    .filter((commodity) =>
                        (commodity.principalCommodity ? commodity.principalCommodity : '').toLocaleLowerCase() === valuePart1.toLocaleLowerCase()
                        &&
                        (commodity.part2 ? commodity.part2 : '').toLocaleLowerCase() === valuePart2.toLocaleLowerCase()
                        &&
                        (commodity.part3 ? commodity.part3 : '').toLocaleLowerCase() === valuePart3.toLocaleLowerCase()
                        &&
                        (commodity.part4 ? commodity.part4 : '').toLocaleLowerCase() === valuePart4.toLocaleLowerCase(),
                    )
                    .map((commodity) => commodity.part5 ? commodity.part5 : ''))
                    .sort();
            }
            // tslint:disable-next-line:no-switch-case-fall-through
            case ('commodityPart5'): {
                this.commodityPart5FilteredList = this.commodityPart5CompleteList.filter((cmy) => {
                    return cmy.toLocaleLowerCase().startsWith(valuePart5.toLocaleLowerCase());
                });
            }
        }
        this.getSelectedCommodity();
    }

    getDistinctString(list: string[]): string[] {
        const distinctList = [];
        list.forEach((item) => {
            if (distinctList.indexOf(item) === -1) {
                distinctList.push(item);
            }
        });
        return distinctList;
    }

    // todo: move this to utilService
    pushUniqueStringInArray(stringArray: string[], value: string): string[] {
        const myClonedArray: string[] = JSON.parse(JSON.stringify(stringArray));
        if (myClonedArray.lastIndexOf(value) === -1) {
            myClonedArray.push(value);
        }
        return myClonedArray.sort((str1, str2) => str1.localeCompare(str2));
    }

    getCommodity(): Commodity {
        return this.selectedCommodityCtrl.value;
    }

    searchForCommodities(): Observable<Commodity[]> {
        const searchTerm: CommoditySearchTerm = {
            principalCommodity: this.commodityPart1Ctrl.value,
            part2: this.commodityPart2Ctrl.value,
            part3: this.commodityPart3Ctrl.value,
            part4: this.commodityPart4Ctrl.value,
            part5: this.commodityPart5Ctrl.value,
        };
        const list = this.masterdataService.getCommodities(searchTerm, new PagingOptions())
            .pipe(
                map((data) => {
                    return data.value;
                }),
            );

        return list;
    }

    onExploreClicked(event) {
        const searchLightBox = this.dialog.open(ContextualSearchBaseLightBoxComponent, {
            data: {
                gridId: this.gridId,
                rowData$: this.searchForCommodities(),
            },
            width: '80%',
            height: '80%',
        });

        searchLightBox.afterClosed().subscribe((commodity: Commodity) => {
            if (commodity) {
                this.patchValue(commodity);
            }
        });

        if (event) {
            event.stopPropagation();
        }
    }

    patchValue(commodity: Commodity) {
        if (commodity) {
            this.commodityPart1Ctrl.patchValue(commodity.principalCommodity);
            this.commodityPart2Ctrl.patchValue(commodity.part2);
            this.commodityPart3Ctrl.patchValue(commodity.part3);
            this.commodityPart4Ctrl.patchValue(commodity.part4);
            this.commodityPart5Ctrl.patchValue(commodity.part5);
        }
        else {
            this.commodityPart1Ctrl.patchValue(null);
            this.commodityPart2Ctrl.patchValue(null);
            this.commodityPart3Ctrl.patchValue(null);
            this.commodityPart4Ctrl.patchValue(null);
            this.commodityPart5Ctrl.patchValue(null);
            this.selectedCommodityCtrl.patchValue(null);
        }

        if (this.isFromAllocationPage) {
            this.commodityPart2Ctrl.patchValue(commodity.part2 ? commodity.part2 : ' ');
            this.commodityPart3Ctrl.patchValue(commodity.part3 ? commodity.part3 : ' ');
            this.commodityPart4Ctrl.patchValue(commodity.part4 ? commodity.part4 : ' ');
            this.commodityPart5Ctrl.patchValue(commodity.part5 ? commodity.part5 : ' ');
            this.labelCmy2 = this.commodityPart2Ctrl.value !== ' ' ? 'Cmy 2' : 'Cmy';
            this.labelCmy3 = this.commodityPart3Ctrl.value !== ' ' ? 'Cmy 3' : 'Cmy';
            this.labelCmy4 = this.commodityPart4Ctrl.value !== ' ' ? 'Cmy 4' : 'Cmy';
            this.labelCmy5 = this.commodityPart5Ctrl.value !== ' ' ? 'Cmy 5' : 'Cmy';

            this.selectedCommodityCtrl.patchValue(commodity);
        }

        this.onSelectedCommodityValueChange();
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    private getSelectedCommodity() {
        this.selectedCommodityCtrl.patchValue(
            this.commodities.find((cmy: Commodity) => {
                return this.isEqualOrNull(cmy.principalCommodity, this.commodityPart1Ctrl.value)
                    && this.isEqualOrNull(cmy.part2, this.commodityPart2Ctrl.value)
                    && this.isEqualOrNull(cmy.part3, this.commodityPart3Ctrl.value)
                    && this.isEqualOrNull(cmy.part4, this.commodityPart4Ctrl.value)
                    && this.isEqualOrNull(cmy.part5, this.commodityPart5Ctrl.value);
            }),
        );
        this.setValidators();
        this.onSelectedCommodityValueChange();
    }

    isEqualOrNull(text1, text2) {
        const text1Trimed = text1 ? text1.trim() : '';
        const text2Trimed = text2 ? text2.trim() : '';
        return text1Trimed.toLocaleLowerCase() === text2Trimed.toLocaleLowerCase();
    }

    private onSelectedCommodityValueChange() {
        if (!this.selectedCommodityCtrl.value) {
            const errors = this.selectedCommodityCtrl.errors ? this.selectedCommodityCtrl.errors : {};
            if (this.required) {
                if (this.commodityPart1Ctrl.value || this.commodityPart2Ctrl.value ||
                    this.commodityPart3Ctrl.value || this.commodityPart4Ctrl.value || this.commodityPart5Ctrl.value) {
                    errors.invalidCommodity = true;
                } else {
                    errors.invalidCommodity = false;
                }
            } else {
                errors.invalidCommodity = false;
            }
            this.selectedCommodityCtrl.setErrors(errors);
        } else {
            this.selectedCommodityCtrl.setErrors(null);
            this.commodityPart1Ctrl.setErrors(null);
            this.commodityPart2Ctrl.setErrors(null);
            this.commodityPart3Ctrl.setErrors(null);
            this.commodityPart4Ctrl.setErrors(null);
            this.commodityPart5Ctrl.setErrors(null);
            if (this.selectedCommodityCtrl.value as Commodity) {
                this.optionSelected.emit((this.selectedCommodityCtrl.value as Commodity).commodityId);
            } else {
                this.optionSelected.emit(null);
            }
        }
        this.setValidators();
    }

    parentFormControlValid(formControl: FormControl): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } => {
            return (formControl.valid) ? null : { parentControlInvalid: true };
        };
    }

    getErrorMessage(): string {
        if (this.selectedCommodityCtrl.hasError('required')) {
            return 'Required*';
        } else if (!this.selectedCommodityCtrl.value && this.required) {
            return 'Please enter a valid commodity';
        }
        return '';
    }

    isRequired() {
        return !this.selectedCommodityCtrl.value && this.required && !this.selectedCommodityCtrl.hasError('required');
    }

    isEditableCommodityForm() {
        this.isEditable = this.selectedCommodityCtrl.enabled;
    }
}
