import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthorizationService } from '../../../../../core/services/authorization.service';
import { CompanyManagerService } from '../../../../../core/services/company-manager.service';
import { BaseFormComponent } from '../../../../../shared/components/base-form-component/base-form-component.component';
import { inDropdownListValidator } from '../../../../../shared/directives/autocomplete-dropdown.directive';
import { AtlasFormControl } from '../../../../../shared/entities/atlas-form-control';
import { MasterDataProps } from '../../../../../shared/entities/masterdata-props.entity';
import { MasterData } from '../../../../../shared/entities/masterdata.entity';
import { WeightUnit } from '../../../../../shared/entities/weight-unit.entity';
import { SectionCompleteDisplayView } from '../../../../../shared/models/section-complete-display-view';
import { CustomNumberMask } from '../../../../../shared/numberMask';
import { FormConfigurationProviderService } from '../../../../../shared/services/form-configuration-provider.service';
import { MasterdataService } from '../../../../../shared/services/http-services/masterdata.service';
import { SecurityService } from '../../../../../shared/services/security.service';
import { TradeImageField } from '../../../../../shared/services/trading/dtos/tradeImageField';
import { nameof, UtilService } from '../../../../../shared/services/util.service';
import { PhysicalFixedPricedContract } from '../../../../entities/physical-fixed-priced-contract.entity';
import { AtlasNumber } from './../../../../../shared/entities/atlas-number.entity';
import { Section } from './../../../../../shared/entities/section.entity';
import { ContractStatus } from './../../../../../shared/enums/contract-status.enum';
import { PermissionLevels } from './../../../../../shared/enums/permission-level.enum';
import { biggerValue } from './quantity-form-control-validator.validator';

@Component({
    selector: 'atlas-custom-quantity-form-component',
    templateUrl: './quantity-form-component.component.html',
    styleUrls: ['./quantity-form-component.component.scss'],
})
export class QuantityFormComponent extends BaseFormComponent implements OnInit {
    @Output() readonly quantitySelected = new EventEmitter<number>();
    @Output() readonly quantityCodeSelected = new EventEmitter<WeightUnit>();

    isInputMode: boolean = true;
    quantityWarning: boolean = false;
    quantityContractedWarning: boolean = false;
    isSplitAndTranche = true;
    isTradeImage = false;
    isInputField = false;
    inputErrorMap: Map<string, string> = new Map();
    model: SectionCompleteDisplayView = new SectionCompleteDisplayView();
    section: Section = new Section();
    sectionId: number;
    tradeImageDetails: TradeImageField[] = [];
    isEdit: boolean = true;
    quantityToolTip: any = '';
    contractedQtyToolTip: any = '';
    weightUnitIdCtrl = new AtlasFormControl('WeightUnitId');
    quantityCtrl = new AtlasFormControl('Quantity');
    quantityContractedCtrl = new AtlasFormControl('OriginalQuantity');
    masterdata: MasterData;
    masterdataList: string[] = [MasterDataProps.WeightUnits];

    filteredQuantityCode: WeightUnit[];
    company: string;
    quantityPrivilege: boolean = false;
    quantityCodePrivilege: boolean = false;
    quantityContractedPrivilege: boolean = false;
    zeroQuantityContracted: string = '0.000';

    mask = CustomNumberMask(12, 10, true);

    constructor(
        protected route: ActivatedRoute,
        protected formBuilder: FormBuilder,
        protected utilService: UtilService,
        protected masterdataService: MasterdataService,
        private companyManager: CompanyManagerService,
        protected formConfigurationProvider: FormConfigurationProviderService,
        protected authorizationService: AuthorizationService,
        protected securityService: SecurityService,
    ) {
        super(formConfigurationProvider);
        this.inputErrorMap
            .set('required', 'Required *')
            .set(
                'min',
                'Quantity must be positive.',
            )
            .set(
                'inferiorValue',
                'Should be equal to or greater than Quantity',
            );
    }

    ngOnInit() {
        this.masterdataService
            .getMasterData(this.masterdataList)
            .subscribe((data) => {
                this.masterdata = data;

                this.filteredQuantityCode = this.masterdata.weightUnits;
                this.weightUnitIdCtrl.valueChanges.subscribe((input) => {

                    this.filteredQuantityCode = this.utilService.filterListforAutocomplete(
                        input,
                        this.masterdata.weightUnits,
                        ['weightCode', 'description'],
                    );
                });

                this.setValidators();
                this.bindConfiguration();
                this.quantityCodeSet();
            });
        const companyDetails = this.companyManager.getCurrentCompany();

        if (companyDetails) {
        const weightUnit = this.getWeightUnit(companyDetails.weightCode);
        if (weightUnit) {
            this.weightUnitIdCtrl.patchValue(weightUnit.weightUnitId);
            }
        }

        if (this.route.snapshot.data['isImage'] === true) {
            this.isTradeImage = true;
            this.isInputField = true;
            this.isSplitAndTranche = JSON.parse(this.route.snapshot.queryParams.splitAndTranche);
        }
        this.checkQuantityFormPrivileges();
    }

    getWeightUnit(weightUnitCode: string): WeightUnit {
        const weightUnit = this.masterdata.weightUnits.find ((weightUnits) =>
        weightUnits.weightCode === weightUnitCode);
        if (weightUnit) {
            return weightUnit;
        }
    }

    setValidators() {
        this.weightUnitIdCtrl.setValidators(
            Validators.compose([
                inDropdownListValidator(
                    this.masterdata.weightUnits,
                    nameof<WeightUnit>('weightUnitId'),
                ),
            ]));

        this.sectionId = Number(this.route.snapshot.paramMap.get('sectionId'));
        if (this.sectionId === 0) {
            this.formGroup.setValidators(biggerValue('quantityContractedCtrl', 'quantityCtrl'));
        }
    }

    onQuantityBlur(targetValue, isInit = false) {
        if (this.quantityCtrl.valid) {
            const res = this.quantityCtrl.value;

            // If contract is not approved and not splitted/tranched, then update quantity contracted
            if (this.isTradeImage || (this.section.status !== ContractStatus.Approved && !this.section.sectionOriginId &&
                (this.section.childSections && this.section.childSections.length === 0) && !isInit)) {
                this.quantityContractedCtrl.patchValue(targetValue);
            }

            this.quantitySelected.emit(res);
            this.quantityWarning = (this.quantityCtrl.valid)
                && (Number(this.quantityCtrl.value) === 0);
            this.quantityContractedWarning = (this.quantityContractedCtrl.valid)
                && (Number(this.quantityContractedCtrl.value) === 0) && (Number(this.quantityCtrl.value) === 0);

        }
        this.quantityContractedCtrl.updateValueAndValidity();
    }

    onContractedQuantityBlur(targetValue) {
        const res = this.quantityContractedCtrl.value;

        // If contract is not approved and not splitted/tranched, then update quantity
        if (this.isTradeImage || (this.section.status !== ContractStatus.Approved && !this.section.sectionOriginId &&
            this.section.childSections.length === 0)) {
            this.quantityCtrl.patchValue(targetValue);
            this.quantitySelected.emit(res);
            this.quantityWarning = (this.quantityCtrl.valid)
                && (Number(this.quantityCtrl.value) === 0);
        }
        this.quantityContractedWarning = (this.quantityContractedCtrl.valid)
            && (Number(this.quantityContractedCtrl.value) === 0) && (Number(this.quantityCtrl.value) === 0);
        this.quantityContractedCtrl.updateValueAndValidity();
        this.quantityCtrl.updateValueAndValidity();
    }

    formatQuantity(value: number) {
        if (value) {
            return new Intl.NumberFormat('en-US', { minimumFractionDigits: 3, maximumFractionDigits: 3 }).format(value);
        }
        return value;
    }
    formatEditQuantity(value: number) {
        if (value) {
            return new Intl.NumberFormat('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 10 }).format(value);
        }
        return value;
    }

    quantityCodeSet() {
        if (this.weightUnitIdCtrl.valid) {
            const res = this.weightUnitIdCtrl.value;
            const weightCode = this.masterdata.weightUnits.filter(
                (weightUnit) => weightUnit.weightUnitId === res,
            );
            this.quantityCodeSelected.emit(
                weightCode.length > 0 ? weightCode[0] : undefined,
            );
        }
    }

    isEqual(value1, value2) {
        return value1 && value2 && value1 === value2;
    }

    initForm(entity: Section, isEdit: boolean): any {
        this.isInputMode = isEdit;
        const childCount = entity.childSections ? entity.childSections.length : 0;
        this.section = entity;
        const tradeRecord = new SectionCompleteDisplayView(entity);
        this.model = tradeRecord;
        this.isEdit = isEdit;
        if (this.model.weightUnitId === 0) {
            this.model.weightUnitId = null;
        }
        if (this.model.weightUnitId != null) {
            this.formGroup.patchValue({ weightUnitIdCtrl: this.model.weightUnitId });
            this.quantityCodeSet();
        }
        if (this.model.originalQuantity != null) {
            const newOriginalValue = new AtlasNumber(this.model.originalQuantity.toString());
            this.formGroup.patchValue({
                quantityContractedCtrl: isEdit ?
                    this.formatEditQuantity(Number(newOriginalValue.toString())) :
                    this.formatQuantity(this.model.originalQuantity),
            });
            if (!this.quantityContractedCtrl.value) {
                this.quantityContractedCtrl.patchValue(this.zeroQuantityContracted);
            }
        }
        if (this.model.quantity != null) {
            const newValue = new AtlasNumber(this.model.quantity.toString());
            this.formGroup.patchValue({
                quantityCtrl: isEdit ?
                    this.formatEditQuantity(Number(newValue.toString())) :
                    this.formatQuantity(this.model.quantity),
            });
            this.onQuantityBlur(
                isEdit ? newValue.toString() : this.formatQuantity(this.model.quantity),
                true);
        }
        if (!this.quantityCtrl.value) {
            this.quantityCtrl.patchValue(this.zeroQuantityContracted);
        }
        if (!isEdit) {
            this.formGroup.disable();
            this.quantityToolTip = this.formatEditQuantity(this.model.quantity);
            this.contractedQtyToolTip = this.formatEditQuantity(this.model.originalQuantity);
        }
        if (!this.isSplitAndTranche) {
            this.quantityCtrl.enable();
            this.weightUnitIdCtrl.enable();
        }
        if (this.isTradeImage && !this.isSplitAndTranche) {
            if (this.model.quantity != null && childCount > 0) {
                const newValue = new AtlasNumber(this.model.quantity.toString());
                this.formGroup.patchValue({ quantityContractedCtrl: newValue.toString() });
            }
        }
        if (this.isTradeImage && this.isSplitAndTranche) {
            this.formGroup.disable();
        } else {
            if (this.model.invoiceReference &&
                this.authorizationService.getPermissionLevel(
                    this.company,
                    'Trades', 'Physicals', 'SuperTradeEdition',
                ) <= PermissionLevels.None) {
                this.weightUnitIdCtrl.disable();
            }
            if (this.model.allocatedTo || this.model.invoiceReference) {
                this.isInputMode = false;
            }
        }
        if (this.isTradeImage) {
            if (this.tradeImageDetails && this.tradeImageDetails.length > 0) {

                const checkWeightUnitIdIsImage = this.tradeImageDetails.find((e) => e.tradeFieldName === 'WeightUnitId');
                if (checkWeightUnitIdIsImage && !checkWeightUnitIdIsImage.isCopy) {
                    this.weightUnitIdCtrl.patchValue(null);
                }

                const checkQuantityIsImage = this.tradeImageDetails.find((e) => e.tradeFieldName === 'Quantity');
                if (checkQuantityIsImage && !checkQuantityIsImage.isCopy) {
                    this.quantityCtrl.patchValue(null);
                }

                const checkOriginalQuantityIsImage = this.tradeImageDetails.find((e) => e.tradeFieldName === 'OriginalQuantity');
                if (checkOriginalQuantityIsImage && !checkOriginalQuantityIsImage.isCopy) {
                    this.quantityContractedCtrl.patchValue(null);
                }
            }
            const isAllocateContract = JSON.parse(this.route.snapshot.queryParams.allocateContract);
            if (isAllocateContract) {
                this.quantityCtrl.disable();
                this.quantityContractedCtrl.disable();
            }
        }
        return entity;
    }

    displayQuantityUnit(weightUnitId: number): string {
        if (weightUnitId) {
            const selectedUnit = this.masterdata.weightUnits.filter(
                (weightUnit) => weightUnit.weightUnitId === weightUnitId,
            );

            if (selectedUnit.length > 0) {
                return selectedUnit[0].weightCode;
            }
        }

        return '';
    }

    populateEntity(entity: any): any {
        const section = entity as PhysicalFixedPricedContract;

        section.quantity = ((this.quantityCtrl.value === '' && !this.quantityCtrl.isRequired) ? 0 : this.quantityCtrl.value);
        section.weightUnitId = ((this.weightUnitIdCtrl.value === '' && !this.weightUnitIdCtrl.isRequired) ? 0 :
            this.weightUnitIdCtrl.value);
        section.originalQuantity = ((this.quantityCtrl.value === '' && !this.quantityCtrl.isRequired) ? 0 : this.quantityCtrl.value);

        return section;
    }

    getFormGroup() {
        this.formGroup = this.formBuilder.group(
            {
                weightUnitIdCtrl: this.weightUnitIdCtrl,
                quantityCtrl: this.quantityCtrl,
                quantityContractedCtrl: this.quantityContractedCtrl,
            },
        );
        return super.getFormGroup();
    }
    checkQuantityFormPrivileges() {
        this.company = this.route.snapshot.paramMap.get('company');
        this.securityService.isSecurityReady().subscribe(() => {
            if (this.authorizationService.isPrivilegeAllowed(this.company, 'Trades')
                && this.authorizationService.isPrivilegeAllowed(this.company, 'MainTab')) {
                this.quantityPrivilege = this.authorizationService.isPrivilegeAllowed(this.company, 'Quantity');
                this.quantityCodePrivilege = this.authorizationService.isPrivilegeAllowed(this.company, 'QuantityCode');
                this.quantityContractedPrivilege = this.authorizationService.isPrivilegeAllowed(this.company, 'QuantityContracted');
            }
        });
        if (!this.quantityPrivilege) {
            this.quantityCtrl.disable();
        }
        if (!this.quantityCodePrivilege) {
            this.weightUnitIdCtrl.disable();
        }
        if (!this.quantityContractedPrivilege) {
            this.quantityContractedCtrl.disable();
        }
    }

    onFocusOut() {
        if (this.filteredQuantityCode.length === 1 && this.filteredQuantityCode[0]['weightUnitId'] !== this.weightUnitIdCtrl.value) {
            // If there is only one option possible, select it
            this.weightUnitIdCtrl.setValue(this.filteredQuantityCode[0]['weightUnitId']);
            this.quantityCodeSet();
        }
    }
}
