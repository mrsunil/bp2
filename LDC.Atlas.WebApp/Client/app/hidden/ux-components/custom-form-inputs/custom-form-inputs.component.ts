import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';
import { CompanyManagerService } from '../../../core/services/company-manager.service';
import { FixType } from '../../../shared/entities/fix-type.entity';
import { Vessel } from '../../../shared/entities/vessel.entity';
import { UtilService } from '../../../shared/services/util.service';
import { isBeforeDate } from '../../../shared/validators/date-validators.validator';

@Component({
    selector: 'atlas-test',
    templateUrl: './custom-form-inputs.component.html',
    styleUrls: ['./custom-form-inputs.component.scss'],
})
export class CustomFormInputsComponent implements OnInit {
    componentsFormTest: FormGroup;

    // Input
    isInputEditable: boolean = true;
    inputMode: string = 'Edit mode';
    inputControl: FormControl = new FormControl('', [
        Validators.minLength(5),
        Validators.email,
    ]); // Validators.required,
    inputErrorMap: Map<string, string> = new Map();
    customHint: string = 'This is a hint';
    inputLabel: FormControl = new FormControl('');
    isInputChecked: boolean;
    isInputWarning: boolean;

    // Toggle
    isToggleEditable: boolean = true;
    toggleMode: string = 'Edit mode';
    inputLabelForGroup: FormControl = new FormControl('Buttons');
    inputLabelForButton: FormControl = new FormControl('');
    toggleControl: FormControl = new FormControl('first value', [
        Validators.required,
    ]);
    valueLabelForButtons: Map<any, string> = new Map();

    // Date picker
    isDateEditable: boolean = true;
    dateMode: string = 'Edit mode';
    dateLabel: FormControl = new FormControl('');
    dateControl: FormControl = new FormControl({ value: '', disabled: false }, [
        Validators.required,
        isBeforeDate(this.companyManager.getCurrentCompanyDate()),
    ]);
    dateErrorMap: Map<string, string> = new Map();
    vesselErrorMap: Map<string, string> = new Map();
    isDateChecked: boolean;

    // Select
    isSelectEditable: boolean = true;
    selectMode: string = 'Edit mode';
    autocompleteDropdownMode: string = 'Autocomplete mode';
    selectLabel: FormControl = new FormControl('');
    selectControl: FormControl = new FormControl('', [Validators.required]); // dropdown: use inDropdownListValidator()  //[Validators.required]
    masterdataControl: FormControl = new FormControl('');
    selectOptions: FixType[];
    options: FixType[] = [];
    masterdataOptions: Vessel[] = [];
    filteredMasterdata: Vessel[];
    isAutocompleteActivated: boolean = true;
    selectErrorMap: Map<string, string> = new Map();
    isSelectChecked: boolean;
    displayProperty: string = 'code';
    selectProperties: string[] = ['code', 'description'];

    constructor(
        private formBuilder: FormBuilder,
        private utilService: UtilService,
        protected companyManager: CompanyManagerService,
    ) {
        this.inputErrorMap
            .set('required', 'Required *')
            .set(
                'minlength',
                'Input length should be at least 5 character long',
            )
            .set('email', 'Not a valid email');
        this.dateErrorMap
            .set('required', 'Required *')
            .set('isDateValid', 'The date cannot be in the future')
            .set(
                'minlength',
                'Input length should be at least 5 character long',
            );
        this.selectErrorMap
            .set('isDateValid', 'This date is invalid')
            .set('required', 'Required *');

        this.vesselErrorMap
            .set('required', 'Required *')
            .set('inDropdownList', 'Value not is list');
    }

    ngOnInit() {
        this.initializeForm();
        this.listenToChanges();
    }

    initializeForm() {
        this.componentsFormTest = this.formBuilder.group({
            inputControl: this.inputControl,
            toggleControl: this.toggleControl,
            dateControl: this.dateControl,
            selectControl: this.selectControl,
            masterdataControl: this.masterdataControl,
        });

        this.options = new Array<FixType>(
            { code: '01', description: 'Rice' },
            { code: '02', description: 'Grains' },
            { code: '03', description: 'Coffee' },
        );

        this.masterdataOptions = new Array<Vessel>(
            { vesselId: 1, vesselName: 'Toyota', description: 'Celica', flag: 1, built: '12', imo: '9161510', displayName: '12' },
            { vesselId: 1, vesselName: 'Ford', description: 'Mondeo', flag: 2, built: '13', imo: '8974192', displayName: '13' },
            { vesselId: 1, vesselName: 'Porsche', description: 'Boxter', flag: 3, built: '14', imo: '8502200', displayName: '14' },
        );
        this.filteredMasterdata = this.masterdataOptions;

        // Initialize two toggle buttons
        this.valueLabelForButtons.set('first value', 'first label');
        this.valueLabelForButtons.set('second value', 'second label');
        this.isInputChecked =
            this.inputControl.errors && this.inputControl.errors.required;
        this.isDateChecked =
            this.dateControl.errors && this.dateControl.errors.required;
        this.isSelectChecked =
            this.selectControl.errors && this.selectControl.errors.required;
    }

    listenToChanges() {
        this.selectControl.valueChanges
            .pipe(
                startWith(null),
                map((input) => {
                    if (
                        this.isAutocompleteActivated === true &&
                        input &&
                        !this.isInstanceOf(input)
                    ) {
                        return this.utilService.filterCollectionByMultipleValues(
                            this.options,
                            { code: input, description: input },
                        );
                    } else {
                        return this.options;
                    }
                }),
            ).subscribe((value) => this.selectOptions = value);

        this.masterdataControl.valueChanges
            .subscribe((input) => {
                this.filteredMasterdata = this.utilService.filterListforAutocomplete(
                    input,
                    this.masterdataOptions,
                    ['vesselCode', 'description']);
            });
    }

    getFilteredOptions(input: string): FixType[] {
        const options = this.options.filter((item) => {
            return (
                item.code.toLowerCase().startsWith(input.toLowerCase()) ||
                item.code.toLowerCase().startsWith(input.toLowerCase())
            );
        });
        return options;
    }

    isInstanceOf(obj: FixType): obj is FixType {
        // tslint:disable-next-line:no-angle-bracket-type-assertion
        return (<FixType>obj).code !== undefined;
    }

    changeModeInput() {
        this.isInputEditable = !this.isInputEditable;
        this.inputMode = this.isInputEditable ? 'Edit mode' : 'Display mode';
    }

    changeInputToRequired(event) {
        const value = event.checked;
        if (value) {
            this.inputControl.setValidators([
                Validators.required,
                Validators.minLength(5),
                Validators.email,
            ]);
        } else {
            this.inputControl.setValidators([
                Validators.minLength(5),
                Validators.email,
            ]);
        }

        this.inputControl.updateValueAndValidity();
    }

    changeModeToggle() {
        this.isToggleEditable = !this.isToggleEditable;
        this.toggleMode = this.isToggleEditable ? 'Edit mode' : 'Display mode';
    }

    addToggleButton(event) {
        this.valueLabelForButtons.set(
            this.inputLabelForButton.value,
            this.inputLabelForButton.value,
        );
        this.inputLabelForButton.setValue('');
    }

    changeModeDate() {
        this.isDateEditable = !this.isDateEditable;
        this.dateMode = this.isDateEditable ? 'Edit mode' : 'Display mode';
    }

    changeDatePickerToRequired(event) {
        const value = event.checked;
        if (value) {
            this.dateControl.setValidators([
                Validators.required,
                isBeforeDate(this.companyManager.getCurrentCompanyDate()),
            ]);
        } else {
            this.dateControl.setValidators([isBeforeDate(this.companyManager.getCurrentCompanyDate())]);
        }
        this.dateControl.updateValueAndValidity();
    }

    changeModeSelect() {
        this.isSelectEditable = !this.isSelectEditable;
        this.selectMode = this.isSelectEditable ? 'Edit mode' : 'Display mode';
    }

    changeModeAutocompleteDropdown() {
        this.isAutocompleteActivated = !this.isAutocompleteActivated;
        if (this.isAutocompleteActivated) {
            this.autocompleteDropdownMode = 'Autocomplete mode';
        } else {
            this.autocompleteDropdownMode = 'Dropdown mode';
        }
    }

    changeSelectToRequired(event) {
        const value = event.checked;
        if (value) {
            this.selectControl.setValidators([Validators.required]);
        } else {
            this.selectControl.clearValidators();
        }
        this.selectControl.updateValueAndValidity();
    }

    updateSelectFieldControl(value) {
        this.selectControl.setValue(value);
    }

    changeInputToWarning(event) {
        this.isInputWarning = event.checked ? true : false;
    }
}
