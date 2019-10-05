import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { AtlasFormControl } from '../../../../../../shared/entities/atlas-form-control'
import { BaseFormComponent } from '../../../../../../shared/components/base-form-component/base-form-component.component';
import { FormConfigurationProviderService } from '../../../../../../shared/services/form-configuration-provider.service';
import { MasterdataService } from '../../../../../../shared/services/http-services/masterdata.service';
import { MasterData } from '../../../../../../shared/entities/masterdata.entity';
import { MasterDataProps } from '../../../../../../shared/entities/masterdata-props.entity';
import { Counterparty } from '../../../../../../shared/entities/counterparty.entity';
import { UtilService } from '../../../../../../shared/services/util.service';
import { FormBuilder, Validators } from '@angular/forms';
import { MdmCategory } from '../../../../../../shared/entities/mdm-Category.entity';
import { SnackbarService } from '../../../../../../shared/services/snackbar.service';
import { ActivatedRoute } from '@angular/router';
import { CounterpartyMdmCategory } from '../../../../../../shared/entities/counterparty-mdm-category.entity';
import { MdmCategoryAccountTypeMapping } from '../../../../../../shared/mdmCategory-account-mapping-entity';

@Component({
    selector: 'atlas-third-system-codes-card',
    templateUrl: './third-system-codes-card.component.html',
    styleUrls: ['./third-system-codes-card.component.scss']
})

export class ThirdSystemCodesCardComponent extends BaseFormComponent implements OnInit {
    mdmIdCtrl = new AtlasFormControl('MdmId');
    mdmCategoryCodeCtrl = new AtlasFormControl('MdmCategoryCode');
    c2cCodeCtrl = new AtlasFormControl('C2cCode');
    counterpartiesList: Counterparty[];
    counterpartiesListFiltered: Counterparty[];
    filteredMdmCategories: MdmCategory[];
    selectedMdmCategories: CounterpartyMdmCategory[];
    mdmCategories: MdmCategory[];
    checkedMdmCategories: MdmCategory[];
    mdmCategoriesSelect: string[] = ['mdmCategoryCode'];
    masterdata: MasterData;
    masterdataList: string[] = [
        MasterDataProps.Counterparties,
        MasterDataProps.MdmCategories
    ];
    @Input() isEditMode: boolean = false;
    isAdmin: boolean = false;
    inputErrorMap: Map<string, string> = new Map();
    numberErrorMap: Map<string, string> = new Map();
    counterPartyId: number;
    @Output() selectedMdmCodesOptions = new EventEmitter<any>();

    constructor(protected formBuilder: FormBuilder,
        protected formConfigurationProvider: FormConfigurationProviderService,
        protected utilService: UtilService,
        private route: ActivatedRoute,
        private snackbarService: SnackbarService,
        protected masterdataService: MasterdataService, ) {
        super(formConfigurationProvider);
        this.inputErrorMap.set('maxlength', 'Maximum 9 charcters Allowed');
        this.numberErrorMap.set('maxlength', 'Maximum 9 digits Allowed');
    }

    ngOnInit() {
        this.counterPartyId = Number(this.route.snapshot.paramMap.get('counterpartyID'));
        if (this.isEditMode && !this.isAdmin) {
            this.mdmIdCtrl.disable();
            this.mdmCategoryCodeCtrl.disable();
        }

        this.masterdataService
            .getMasterData(this.masterdataList)
            .subscribe((data) => {
                this.masterdata = data;
                this.filteredMdmCategories = this.masterdata.mdmCategories;
                this.mdmCategories = this.masterdata.mdmCategories;
            });

        this.setValidators();
    }

    setValidators() {
        this.c2cCodeCtrl.setValidators(
            Validators.compose([Validators.maxLength(9)]),
        );

        this.mdmIdCtrl.setValidators(
            Validators.compose([Validators.maxLength(9)]),
        );
    }

    mdmIdValidation(event: any) {
        const pattern = /[0-9]/;
        let inputChar = String.fromCharCode(event.charCode);
        if (!pattern.test(inputChar)) {
            event.preventDefault();
        }
    }

    onBlur() {
        if (this.mdmIdCtrl.value) {
            if (this.counterPartyId) {
                let mdmID = this.masterdata.counterparties.find((value) =>
                    value.mdmId === Number(this.mdmIdCtrl.value) &&
                    value.counterpartyID !== this.counterPartyId);
                if (mdmID) {
                    this.snackbarService.informationSnackBar('MDM ID should be unique');
                    this.mdmIdCtrl.patchValue(null);
                }
            }
            else {
                let mdmID = this.masterdata.counterparties.find((value) =>
                    value.mdmId === Number(this.mdmIdCtrl.value));
                if (mdmID) {
                    this.snackbarService.informationSnackBar('MDM ID should be unique');
                    this.mdmIdCtrl.patchValue(null);
                }
            }
        }
    }

    getValues(model: Counterparty) {
        model.mdmId = this.mdmIdCtrl.value;
    }

    getFormGroup() {
        this.formGroup = this.formBuilder.group({
            mdmIdCtrl: this.mdmIdCtrl,
            mdmCategoryCodeCtrl: this.mdmCategoryCodeCtrl,
            c2cCodeCtrl: this.c2cCodeCtrl,
        });

        return super.getFormGroup();
    }

    populateEntity(model: Counterparty) {
        model.c2CCode = this.c2cCodeCtrl.value;
        model.mdmId = this.mdmIdCtrl.value
        model.counterpartyMdmCategory = this.mdmCategoryCodeCtrl.value;
    }

    optionSelected(data: any) {
        this.selectedMdmCategories = [];
        data.forEach(element => {
            this.selectedMdmCategories.push(element);
        });

        this.selectedMdmCodesOptions.emit(this.selectedMdmCategories);
    }

    populateValue(model: Counterparty) {
        if (model.mdmId) {
            this.mdmIdCtrl.patchValue(model.mdmId);
        }
        this.masterdata = this.route.snapshot.data.masterdata;
        this.filteredMdmCategories = this.masterdata.mdmCategories;

        if (model.counterpartyMdmCategory) {
            this.checkedMdmCategories = [];
            this.selectedMdmCategories = [];
            model.counterpartyMdmCategory.forEach(element => {
                let mdmCategory = this.filteredMdmCategories.find((mdmCategory) => mdmCategory.mdmCategoryId === element.mdmCategoryID);
                if (mdmCategory) {
                    element.mdmCategoryCode = mdmCategory.mdmCategoryCode;
                    this.checkedMdmCategories.push(mdmCategory);
                    this.selectedMdmCategories.push(element);
                }
            });
            this.mdmCategoryCodeCtrl.patchValue(this.checkedMdmCategories);
        }
    }

}
