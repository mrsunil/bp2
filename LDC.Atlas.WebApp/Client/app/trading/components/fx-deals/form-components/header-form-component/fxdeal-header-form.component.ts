import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AtlasFormControl } from '../../../../../shared/entities/atlas-form-control';
import { MasterData } from '../../../../../shared/entities/masterdata.entity';
import { MasterDataProps } from '../../../../../shared/entities/masterdata-props.entity';
import { DepartmentDataLoader } from '../../../../../shared/services/masterdata/department-data-loader';
import { Department } from '../../../../../shared/entities/department.entity';
import { UtilService, nameof } from '../../../../../shared/services/util.service';
import { TradingService } from '../../../../../shared/services/http-services/trading.service';
import { BaseFormComponent } from '../../../../../shared/components/base-form-component/base-form-component.component';
import { FormConfigurationProviderService } from '../../../../../shared/services/form-configuration-provider.service';
import { inDropdownListValidator } from '../../../../../shared/directives/autocomplete-dropdown.directive';
import { UserIdentityService } from '../../../../../shared/services/http-services/user-identity.service';
import { User } from '../../../../../shared/entities/user.entity';
import { ActivatedRoute } from '@angular/router';
import { Validators, FormBuilder } from '@angular/forms';
import { CompanyManagerService } from '../../../../../core/services/company-manager.service';
import { TradeContextualDataLoader } from '../../../../../shared/services/trading/trader-contextual-data-loader';
import { FxDealDetail } from '../../../../../shared/entities/fxdeal-detail.entity';
import { Company } from '../../../../../shared/entities/company.entity';
import { Counterparty } from '../../../../../shared/entities/counterparty.entity';
import { FxDealStatus } from '../../../../../shared/enums/fx-deals-status.enum';
import { FxDealDirection } from '../../../../../shared/enums/fx-deals-direction.enum';
import { Trader } from '../../../../../shared/entities/trader.entity';

@Component({
    selector: 'atlas-fxdeal-header-form',
    templateUrl: './fxdeal-header-form.component.html',
    styleUrls: ['./fxdeal-header-form.component.scss'],
    providers: [DepartmentDataLoader, TradeContextualDataLoader]

})

export class FxDealHeaderFormComponent extends BaseFormComponent implements OnInit {
    @Output() readonly documentDateSelected = new EventEmitter<Date>();

    traderCtrl = new AtlasFormControl('Trader');
    departmentCodeCtrl = new AtlasFormControl('Department');
    departmentDescriptionCtrl = new AtlasFormControl('DepartmentDescription');
    dealNoCtrl = new AtlasFormControl('DealNo');
    accountCtrl = new AtlasFormControl('Account');
    accountDescriptionCtrl = new AtlasFormControl('AccountDescription');
    createdByCtrl = new AtlasFormControl('CreatedBy');
    createdOnCtrl = new AtlasFormControl('CreatedOn');
    amendedByCtrl = new AtlasFormControl('AmendedBy');
    amendedOnCtrl = new AtlasFormControl('AmendedOn');

    masterdata: MasterData;
    masterdataList: string[] = [MasterDataProps.Departments];
    traderName: string;
    filteredDepartments: Department[];
    filteredTradeOwners: Trader[];
    traders: Trader[];
    isShow: boolean = false;
    isEditMode: boolean = false;
    date = false;
    counterpartyId: number;
    dealType: string;
    dealStatus: string;
    filteredCompany: Company[];
    filteredCounterparty: Counterparty[];
    company: string;
    fxDealId: number;
    showAmendedFields: boolean = false;
    showAuditInformation: boolean = false;

    departmentErrorMap: Map<string, string> = new Map()
        .set('required', 'Required *')
        .set('inDropdownList', 'Invalid entry. Department not in the list or not authorized.');

    departmentDescriptionErrorMap: Map<string, string> = new Map()
        .set('required', 'Required *')

    accountDescriptionErrorMap: Map<string, string> = new Map()
        .set('required', 'Required *')

    traderErrorMap: Map<string, string> = new Map()
        .set('required', 'Required *')
        .set('inDropdownList', 'Invalid entry. Trader not in the list or not authorized.');

    constructor(
        protected formBuilder: FormBuilder,
        public departmentDataLoader: DepartmentDataLoader,
        protected utilService: UtilService,
        protected tradingService: TradingService,
        protected formConfigurationProvider: FormConfigurationProviderService,
        protected userIdentityService: UserIdentityService,
        protected companyManager: CompanyManagerService,
        protected route: ActivatedRoute,
        public tradeContextualDataLoader: TradeContextualDataLoader, ) {
        super(formConfigurationProvider);
    }

    ngOnInit() {
        this.company = this.route.snapshot.paramMap.get('company');
        this.departmentDescriptionCtrl.disable();

        this.fxDealId = Number(this.route.snapshot.paramMap.get('fxDealId'));

        if (this.route.snapshot.data.isView) {
            this.isShow = true;
        }

        if (this.route.snapshot.data.isEdit) {
            this.isEditMode = true;
        }

        if (this.fxDealId) {
            this.showAuditInformation = true;
        }

        this.masterdata = this.route.snapshot.data.masterdata;
        this.filteredDepartments = this.masterdata.departments;
        this.filteredCompany = this.masterdata.companies;
        this.filteredCounterparty = this.masterdata.counterparties;

        this.departmentCodeCtrl.valueChanges.subscribe((input) => {
            this.filteredDepartments =
                this.utilService.filterListforAutocomplete(
                    input,
                    this.masterdata.departments,
                    ['departmentCode', 'description']);

        });

        this.tradeContextualDataLoader.getData().subscribe((traders) => {
            if (traders) {
                this.filteredTradeOwners = traders;
                this.traders = traders;
                this.traderCtrl.valueChanges.subscribe((input) => {
                    this.filteredTradeOwners = this.utilService.filterListforAutocomplete(
                        input,
                        this.traders,
                        ['samAccountName', 'displayName'],
                    );
                });
                this.tradeValidator();
            }
        });

        if (this.company) {
            let counterparty = this.filteredCompany.find((id) => id.companyId === this.company).counterpartyId;
            if (counterparty) {
                this.counterpartyId = counterparty;
                let counterpartyCode = this.filteredCounterparty.find((code) => code.counterpartyID === counterparty).counterpartyCode;
                if (counterpartyCode) {
                    this.accountCtrl.patchValue(counterpartyCode);
                }
                let counterpartyDescription = this.filteredCounterparty.find((code) => code.counterpartyID === counterparty).description;
                if (counterpartyDescription) {

                    this.accountDescriptionCtrl.patchValue(counterpartyDescription);
                }

            }
        }

        this.accountCtrl.disable();
        this.accountDescriptionCtrl.disable();
        this.dealNoCtrl.disable();
        this.createdByCtrl.disable();
        this.createdOnCtrl.disable();
        this.amendedByCtrl.disable();
        this.amendedOnCtrl.disable();
        this.setValidators();
    }

    setValidators() {
        this.departmentCodeCtrl.setValidators(
            Validators.compose([Validators.required,
            inDropdownListValidator(
                this.masterdata.departments,
                nameof<Department>('departmentCode'),
            ),
            ]),
        );

        this.departmentDescriptionCtrl.setValidators(Validators.required);

        this.accountCtrl.setValidators([Validators.required, Validators.maxLength(10)])
        this.accountDescriptionCtrl.setValidators([Validators.required, Validators.maxLength(200)])

    }

    tradeValidator() {
        this.traderCtrl.setValidators(
            Validators.compose([Validators.required,
            inDropdownListValidator(
                this.filteredTradeOwners,
                nameof<User>('displayName'),
            ),
            ]),
        );
    }

    getFormGroup() {
        this.formGroup = this.formBuilder.group({
            traderCtrl: this.traderCtrl,
            departmentCodeCtrl: this.departmentCodeCtrl,
            departmentDescriptionCtrl: this.departmentDescriptionCtrl,
            dealNoCtrl: this.dealNoCtrl,
            accountCtrl: this.accountCtrl,
            accountDescriptionCtrl: this.accountDescriptionCtrl,
        });
        return super.getFormGroup();
    }

    initForm(fxDealDetail: FxDealDetail, isEdit: boolean) {
        if (fxDealDetail) {
            this.dealType = FxDealDirection[fxDealDetail.dealDirectionId];
            this.dealStatus = FxDealStatus[fxDealDetail.fxDealStatusId];
            this.traderCtrl.patchValue(fxDealDetail.traderDisplayName);
            this.dealNoCtrl.patchValue(fxDealDetail.reference);
            this.createdByCtrl.patchValue(fxDealDetail.createdBy);
            this.createdOnCtrl.patchValue((fxDealDetail.createdDateTime) ? fxDealDetail.createdDateTime.toDateString() : '');
            if (fxDealDetail.modifiedBy && fxDealDetail.modifiedDateTime) {
                this.showAmendedFields = true;
                this.amendedByCtrl.patchValue(fxDealDetail.modifiedBy);
                this.amendedOnCtrl.patchValue((fxDealDetail.modifiedDateTime) ? fxDealDetail.modifiedDateTime.toDateString() : '');
            }
            this.departmentCodeCtrl.patchValue(fxDealDetail.departmentCode);
            if (fxDealDetail.departmentCode) {
                const description = this.filteredDepartments.find((value) => value.departmentCode === fxDealDetail.departmentCode).description;
                this.departmentDescriptionCtrl.patchValue(description);
            }
            if (!isEdit) {
                this.disableFields();
            }
        }
    }

    populateEntity(model: FxDealDetail) {
        if (!model.isEditMode) {
            model.departmentId = this.getDepartmentId(this.departmentCodeCtrl.value.departmentCode);
            model.traderId = this.traderCtrl.value.userId;
        }
        else {
            if (this.departmentCodeCtrl.value.departmentCode) {
                model.departmentId = this.getDepartmentId(this.departmentCodeCtrl.value.departmentCode);
            }
            else {
                model.departmentId = this.getDepartmentId(this.departmentCodeCtrl.value);
            }
            if (this.traderCtrl.value.userId) {
                model.traderId = this.traderCtrl.value.userId;
            }
            else {
                model.traderId = this.getTraderId(this.traderCtrl.value);
            }
        }
        model.counterpartyId = this.counterpartyId;
    }

    getDepartmentId(code: string): number {
        const selectedDepartment = this.masterdata.departments.find(
            (department) => department.departmentCode === code,
        );
        if (selectedDepartment) {
            return selectedDepartment.departmentId;
        }
        return null;
    }

    getTraderId(code: string): number {
        const selectedTrader = this.filteredTradeOwners.find(
            (value) => value.displayName === code,
        );
        if (selectedTrader) {
            return selectedTrader.userId;
        }
        return null;
    }

    disableFields() {
        this.traderCtrl.disable();
        this.dealNoCtrl.disable();
        this.accountCtrl.disable();
        this.departmentCodeCtrl.disable();
    }

    onValueChanged(value) {
        this.departmentDescriptionCtrl.patchValue(value.description);
    }

    onOptionSelected(value: Department) {
        const department = this.masterdata.departments.find(
            (item) => item.departmentCode === value.departmentCode,
        );
        if (department) {
            this.departmentDescriptionCtrl.patchValue(department.description);
        }
    }
}
