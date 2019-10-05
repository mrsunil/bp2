import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BaseFormComponent } from '../../../../../../../shared/components/base-form-component/base-form-component.component';
import { ContextualSearchMultipleAutocompleteSelectComponent } from '../../../../../../../shared/components/form-components/multiple-autocomplete-dropdown/contextual-search/contextual-search-multiple-autocomplete-select.component';
import { Currency } from '../../../../../../../shared/entities/currency.entity';
import { MasterData } from '../../../../../../../shared/entities/masterdata.entity';
import { ForeignExchangeRateViewMode } from '../../../../../../../shared/enums/foreign-exchange-rate-viewmode.enum';
import { FormConfigurationProviderService } from '../../../../../../../shared/services/form-configuration-provider.service';

@Component({
    selector: 'atlas-critera',
    templateUrl: './critera.component.html',
    styleUrls: ['./critera.component.scss'],
})
export class CriteraComponent extends BaseFormComponent implements OnInit {
    @ViewChild('currencyDropdownComponent') currencyDropdownComponent: ContextualSearchMultipleAutocompleteSelectComponent;
    monthEndCtrl: FormControl;
    formGroup: FormGroup;
    monthEndList = [];
    dropDownValue: string;
    masterdata: MasterData;
    currencyValue: Currency[];
    currencies: Currency[];
    selectedRate: any;
    foreignExchangeRateViewMode: ForeignExchangeRateViewMode;
    @Output() readonly rateSelected = new EventEmitter<string>();
    @Output() readonly currencySelected = new EventEmitter<Currency[]>();
    CurrencyAllOptions = {
        currencyCode: 'All',
    };
    allCurrenciesSelected = true;
    constructor(private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        formConfigurationProvider: FormConfigurationProviderService,
    ) {
        super(formConfigurationProvider);
    }

    ngOnInit() {
        this.getFormGroup();
        this.monthEndList = this.getMonthEndList();
        this.monthEndCtrl.patchValue(this.monthEndList[0]);
        this.initCurrencies();
        this.onChanges();
    }

    getFormGroup() {
        this.formGroup = this.formBuilder.group({
            monthEndCtrl: this.monthEndCtrl,
        });
        this.initControls();
        return super.getFormGroup();
    }

    initControls() {
        this.monthEndCtrl = new FormControl('', [Validators.required]);
    }

    initCurrencies() {
        this.currencies = this.route.snapshot.data.masterdata.currencies;
        this.currencyDropdownComponent.options = this.currencies;
        this.currencyDropdownComponent.optionsChanged();
    }

    getMonthEndList(): any[] {
        const options = [];
        const fxRateEnumArray = Object.keys(ForeignExchangeRateViewMode).map((key) => {
            return {
                id: key,
                value: ForeignExchangeRateViewMode[key],
            };
        });
        fxRateEnumArray.forEach((fxRateEnumValue) => {
            options.push(fxRateEnumValue);
        });

        return options;
    }
    onCurrencySelectionChanged(selectedCurrency: Currency[]) {
        this.currencySelected.emit(selectedCurrency);
        this.currencyValue = selectedCurrency;
    }
    onChanges(): void {
        this.monthEndCtrl.valueChanges.subscribe((value) => {
            this.rateSelected.emit(value.value);
            this.selectedRate = value;
        });
    }
}
