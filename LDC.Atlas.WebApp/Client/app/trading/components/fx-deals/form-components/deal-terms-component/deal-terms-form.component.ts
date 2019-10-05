import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { AtlasFormControl } from '../../../../../shared/entities/atlas-form-control';
import { UtilService, nameof } from '../../../../../shared/services/util.service';
import { inDropdownListValidator } from '../../../../../shared/directives/autocomplete-dropdown.directive';
import { FxTradeType } from '../../../../../shared/entities/fx-trade-type.entity';
import { Validators, FormBuilder } from '@angular/forms';
import { FormConfigurationProviderService } from '../../../../../shared/services/form-configuration-provider.service';
import { BaseFormComponent } from '../../../../../shared/components/base-form-component/base-form-component.component';
import { FxDealDetail } from '../../../../../shared/entities/fxdeal-detail.entity';
import { MasterData } from '../../../../../shared/entities/masterdata.entity';
import { ActivatedRoute } from '@angular/router';
import { isBeforeDate, isAfterDate, isDateBeforeControlDate } from '../../../../../shared/validators/date-validators.validator';
import { CompanyManagerService } from '../../../../../core/services/company-manager.service';
import { dateAfter } from '../../../contract-physical-capture/form-components/shipment-period-form/shipment-period-date-validator.validator';
import { RateEntryComponent } from '../rate-entry-form-component/rate-entry-form.component';
import * as moment from 'moment';

@Component({
    selector: 'atlas-deal-terms-form-',
    templateUrl: './deal-terms-form.component.html',
    styleUrls: ['./deal-terms-form.component.scss'],
})

export class DealTermsFormComponent extends BaseFormComponent implements OnInit {
    @Output() readonly dealTypeChange = new EventEmitter<boolean>();
    @Output() readonly maturityDateChange = new EventEmitter<boolean>();

    dealTypeCtrl = new AtlasFormControl('DealType');
    maturityDateCtrl = new AtlasFormControl('MaturityDate');
    contractDateCtrl = new AtlasFormControl('ContractDate');

    filteredFxTradeTypes: FxTradeType[];
    masterdata: MasterData;
    fxTrades: FxTradeType[];
    rateEntry: RateEntryComponent;
    maxDate = this.companyManager.getCurrentCompanyDate().toDate();

    contractDateErrorMap: Map<string, string> = new Map()
        .set('required', 'Required *')
        .set('isDateValid', 'The Contract date cannot be in the future');

    maturityDateErrorMap: Map<string, string> = new Map()
        .set('required', 'Required *')
        .set('isBeforeDateValid', 'The Maturity date cannot be previous to the Contract date');

    constructor(protected formConfigurationProvider: FormConfigurationProviderService,
        protected formBuilder: FormBuilder,
        protected utilService: UtilService,
        protected companyManager: CompanyManagerService,
        protected route: ActivatedRoute) {
        super(formConfigurationProvider);
    }

    ngOnInit() {

        this.masterdata = this.route.snapshot.data.masterdata;
        this.filteredFxTradeTypes = this.masterdata.fxTradeTypes;

        this.dealTypeCtrl.valueChanges.subscribe((input) => {
            this.filteredFxTradeTypes = this.utilService.filterListforAutocomplete(
                input,
                this.masterdata.fxTradeTypes,
                ['code', 'description'],
            );
        });
        if (this.route.snapshot.data.isCreate) {
            this.contractDateCtrl.setValue(this.companyManager.getCurrentCompanyDate());
        }
        if (this.filteredFxTradeTypes && this.filteredFxTradeTypes.length > 0) {
            this.dealTypeCtrl.setValue(this.filteredFxTradeTypes[0]);
        }
        this.setValidators();
    }


    setValidators() {

        this.contractDateCtrl.setValidators([
            Validators.required,
            isBeforeDate(this.companyManager.getCurrentCompanyDate()),
        ]);

        this.maturityDateCtrl.setValidators([
            Validators.required,
            isDateBeforeControlDate(this.contractDateCtrl.value),
        ]);

    }

    getFormGroup() {
        this.formGroup = this.formBuilder.group({
            maturityDateCtrl: this.maturityDateCtrl,
            contractDateCtrl: this.contractDateCtrl,
        });
           
        return super.getFormGroup();
    }
    initForm(fxDealDetail: FxDealDetail, isEdit: boolean) {
        if (fxDealDetail) {
            if (fxDealDetail.fxTradeTypeId && this.masterdata.fxTradeTypes && this.masterdata.fxTradeTypes.length > 0) {
                const selectedfxTrade = this.masterdata.fxTradeTypes.find((value) => value.fxTradeTypeId === fxDealDetail.fxTradeTypeId);
                if (selectedfxTrade) {
                    this.dealTypeCtrl.patchValue(selectedfxTrade.code);
                }
            }
            this.contractDateCtrl.patchValue(fxDealDetail.contractDate);
            this.maturityDateCtrl.patchValue(fxDealDetail.maturityDate);
            if (!isEdit) {
                this.disableFields();
            }
        }
    }

    disableFields() {
        this.dealTypeCtrl.disable();
        this.contractDateCtrl.disable();
        this.maturityDateCtrl.disable();
    }


    onBlankSelectionChanged() {
        let fxTradeType = this.filteredFxTradeTypes.find(x => x.code == this.dealTypeCtrl.value.code)
        if (fxTradeType && fxTradeType.isNdf) {
            this.dealTypeChange.emit(false);
        }
        else {
            this.dealTypeChange.emit(true);
        }
    }
    onDealTypeSelectionChanged(event) {
        let fxTradeType = this.filteredFxTradeTypes.find(x => x.code == this.dealTypeCtrl.value.code)
        if (fxTradeType && fxTradeType.isNdf) {
            this.dealTypeChange.emit(false);
        }
        else {
            this.dealTypeChange.emit(true);
        }
    }

    populateEntity(model: FxDealDetail) {
        model.contractDate = this.contractDateCtrl.value;
        model.maturityDate = this.maturityDateCtrl.value;
        if (!model.isEditMode) {
            model.fxTradeTypeId = this.getId(this.dealTypeCtrl.value.code);
        }
        else {
            if (this.dealTypeCtrl.value.code) {
                model.fxTradeTypeId = this.getId(this.dealTypeCtrl.value.code);
            }
            else {
                model.fxTradeTypeId = this.getId(this.dealTypeCtrl.value);
            }
        }
    }

    getId(code: string): number {
        const selectedCode = this.masterdata.fxTradeTypes.find(
            (selectedCode) => selectedCode.code === code);
        if (selectedCode) {
            return selectedCode.fxTradeTypeId;
        }
        return null;
    }

    onDateSelectionChanged(event) {
        this.maturityDateChange.emit(this.maturityDateCtrl.value);
        this.maturityDateCtrl.clearValidators();
        this.setValidators();
    }

    onContractDateChanged(event) {
        this.maturityDateCtrl.clearValidators();
        this.setValidators();
    }

}
