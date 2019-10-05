import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthorizationService } from '../../../../../core/services/authorization.service';
import { BaseFormComponent } from '../../../../../shared/components/base-form-component/base-form-component.component';
import { inDropdownListValidator } from '../../../../../shared/directives/autocomplete-dropdown.directive';
import { AtlasFormControl } from '../../../../../shared/entities/atlas-form-control';
import { MasterDataProps } from '../../../../../shared/entities/masterdata-props.entity';
import { MasterData } from '../../../../../shared/entities/masterdata.entity';
import { SectionCompleteDisplayView } from '../../../../../shared/models/section-complete-display-view';
import { FormConfigurationProviderService } from '../../../../../shared/services/form-configuration-provider.service';
import { MasterdataService } from '../../../../../shared/services/http-services/masterdata.service';
import { SecurityService } from '../../../../../shared/services/security.service';
import { nameof, UtilService } from '../../../../../shared/services/util.service';
import { PhysicalFixedPricedContract } from '../../../../entities/physical-fixed-priced-contract.entity';
import { PeriodType } from './../../../../../shared/entities/period-type.entity';
import { PositionMonthTypes } from './../../../../../shared/enums/position-month-type.enum';
import { TradeImageField } from './../../../../../shared/services/trading/dtos/tradeImageField';
import { dateAfter } from './shipment-period-date-validator.validator';

@Component({
    selector: 'atlas-shipment-period-form',
    templateUrl: './shipment-period-form.component.html',
    styleUrls: ['./shipment-period-form.component.scss'],
})
export class ShipmentPeriodFormComponent extends BaseFormComponent implements OnInit {
    @Output() readonly shipmentWarningMessage = new EventEmitter<any>();
    model: SectionCompleteDisplayView = new SectionCompleteDisplayView();

    periodTypeCtrl = new AtlasFormControl('PeriodTypeId');
    periodFromCtrl = new AtlasFormControl('DeliveryPeriodStart');
    periodToCtrl = new AtlasFormControl('DeliveryPeriodEnd');
    positionTypeCtrl = new AtlasFormControl('PositionMonthType');
    filteredPeriodType: PeriodType[];
    tradeImageDetails: TradeImageField[] = [];

    masterdata: MasterData = new MasterData();
    masterdataList: string[] = [
        MasterDataProps.PositionMonthTypes,
        MasterDataProps.PeriodTypes,
    ];
    company: string;
    periodTypePrivilege: boolean = false;
    fromDatePrivilege: boolean = false;
    toDatePrivilege: boolean = false;
    positionTypePrivilege: boolean = false;
    isImage = false;

    isChangedPositionType = false;
    isChangedPositionTypeColumn;

    constructor(
        protected formBuilder: FormBuilder,
        protected masterdataService: MasterdataService,
        protected utilService: UtilService,
        protected formConfigurationProvider: FormConfigurationProviderService,
        protected route: ActivatedRoute,
        protected authorizationService: AuthorizationService,
        protected securityService: SecurityService,
    ) {
        super(formConfigurationProvider);
    }

    ngOnInit() {
        if (this.route.snapshot.data['isImage'] === true) {
            this.isImage = true;
        }
        this.masterdata = this.route.snapshot.data.masterdata;
        this.filteredPeriodType = this.masterdata.periodTypes;
        this.periodTypeCtrl.valueChanges.subscribe((input) => {
            this.filteredPeriodType =
                this.utilService.filterListforAutocompleteWithTechnicalId(
                    input,
                    this.masterdata.periodTypes,
                    ['periodTypeCode', 'periodTypeDescription'],
                    'periodTypeId');
        });
        this.setValidators();
        this.bindConfiguration();

        const startPositionMonthType = this.masterdata.positionMonthTypes
            .filter((position) => position.positionMonthTypeDescription === 'Start');
        if (startPositionMonthType.length > 0) {
            this.positionTypeCtrl.patchValue(startPositionMonthType[0].positionMonthTypeCode);
        }
        if (!this.isImage) {
            this.checkShipmentFormPrivileges();
        }

    }

    setValidators() {
        this.periodTypeCtrl.setValidators(
            Validators.compose([
                inDropdownListValidator(
                    this.masterdata.periodTypes,
                    nameof<PeriodType>('periodTypeId'),
                ),
            ]),
        );
    }

    displayPeriodType(periodTypeId: number): string {
        if (periodTypeId) {
            const selectedPeriod = this.filteredPeriodType.filter(
                (periodType) => periodType.periodTypeId === periodTypeId,
            );

            if (selectedPeriod.length > 0) {
                return selectedPeriod[0].periodTypeDescription;
            }
        }
        return '';
    }
    getFormGroup() {
        this.formGroup = this.formBuilder.group(
            {
                periodTypeCtrl: this.periodTypeCtrl,
                periodFromCtrl: this.periodFromCtrl,
                periodToCtrl: this.periodToCtrl,
                positionTypeCtrl: this.positionTypeCtrl,
            },
            { validator: dateAfter('periodToCtrl', 'periodFromCtrl') },
        );
        return super.getFormGroup();
    }

    initForm(entity: any, isEdit: boolean): any {
        const tradeRecord = new SectionCompleteDisplayView(entity);
        this.model = tradeRecord;

        if (this.model.periodTypeCode != null) {
            const periodTypeFiltered = this.masterdata.periodTypes.find((periodType) => {
                return periodType.periodTypeCode === this.model.periodTypeCode;
            });
            if (periodTypeFiltered) {
                this.model.periodTypeId = periodTypeFiltered.periodTypeId;
                this.formGroup.patchValue({ periodTypeCtrl: this.model.periodTypeId });
            }
        }
        if (this.model.deliveryPeriodStart != null) {
            this.formGroup.patchValue({ periodFromCtrl: this.model.deliveryPeriodStart });
        }
        if (this.model.deliveryPeriodEnd != null) {
            this.formGroup.patchValue({ periodToCtrl: this.model.deliveryPeriodEnd });
        }

        if (!isEdit) {
            this.formGroup.disable();
        } else if (this.model.blDate && !this.isImage) {
            this.periodFromCtrl.disable();
            this.periodToCtrl.disable();
        }
        if (this.isImage) {
            if (this.tradeImageDetails && this.tradeImageDetails.length > 0) {

                const checkPeriodTypeIdIsImage = this.tradeImageDetails.find((e) => e.tradeFieldName === 'PeriodTypeId');
                if (checkPeriodTypeIdIsImage && !checkPeriodTypeIdIsImage.isEdit) {
                    this.periodTypeCtrl.disable();
                }

                const checkDeliveryPeriodStartIsImage = this.tradeImageDetails.find((e) => e.tradeFieldName === 'DeliveryPeriodStart');
                if (checkDeliveryPeriodStartIsImage && !checkDeliveryPeriodStartIsImage.isEdit) {
                    this.periodFromCtrl.disable();
                    this.periodToCtrl.disable();
                }

                const checkPositionMonthTypeIsImage = this.tradeImageDetails.find((e) => e.tradeFieldName === 'PositionMonthType');
                if (checkPositionMonthTypeIsImage && !checkPositionMonthTypeIsImage.isEdit) {
                    this.positionTypeCtrl.disable();
                }

                const checkPeriodTypeIdIsCopy = this.tradeImageDetails.find((e) => e.tradeFieldName === 'PeriodTypeId');
                if (checkPeriodTypeIdIsCopy && !checkPeriodTypeIdIsCopy.isCopy) {
                    this.periodTypeCtrl.patchValue(null);
                }

                const checkDeliveryPeriodStartIsCopy = this.tradeImageDetails.find((e) => e.tradeFieldName === 'DeliveryPeriodStart');
                if (checkDeliveryPeriodStartIsCopy && !checkDeliveryPeriodStartIsCopy.isCopy) {
                    this.periodFromCtrl.patchValue(null);
                    this.periodToCtrl.patchValue(null);
                }
            }
        }
        if (this.model.positionMonthIndex != null) {

            const monthType = this.masterdata.positionMonthTypes.filter((position) =>
                position.positionMonthTypeDescription.startsWith(this.model.positionMonthType) &&
                position.positionMonthTypeCode.month === this.model.positionMonthIndex);
            if (monthType.length > 0) {
                this.formGroup.patchValue({ positionTypeCtrl: monthType[0].positionMonthTypeCode });
            }
        }
        return entity;
    }

    populateEntity(entity: any): any {
        const section = entity as PhysicalFixedPricedContract;

        section.periodTypeId = ((this.periodTypeCtrl.value === '' && !this.periodTypeCtrl.isRequired) ? 0 : this.periodTypeCtrl.value);
        section.deliveryPeriodStartDate = this.periodFromCtrl.value;
        section.deliveryPeriodEndDate = this.periodToCtrl.value;
        section.positionMonthType = Number(this.positionTypeCtrl.value.type);
        section.positionMonthIndex = Number(this.positionTypeCtrl.value.month);

        if (this.model.positionMonthType !== PositionMonthTypes[section.positionMonthType]) {
            this.isChangedPositionType = true;
            this.isChangedPositionTypeColumn = '[PositionMonthType]';
            this.warningEmitter();
        }

        return section;
    }

    warningEmitter() {
        this.shipmentWarningMessage.emit({
            positionTypeChanged: this.isChangedPositionType,
            positionTypeColumnName: this.isChangedPositionTypeColumn,
        });
    }

    checkShipmentFormPrivileges() {
        this.company = this.route.snapshot.paramMap.get('company');
        this.securityService.isSecurityReady().subscribe(() => {
            if (this.authorizationService.isPrivilegeAllowed(this.company, 'Trades') && this.authorizationService.isPrivilegeAllowed(this.company, 'MainTab')) {
                this.periodTypePrivilege = this.authorizationService.isPrivilegeAllowed(this.company, 'PeriodType');
                this.fromDatePrivilege = this.authorizationService.isPrivilegeAllowed(this.company, 'FromDate');
                this.toDatePrivilege = this.authorizationService.isPrivilegeAllowed(this.company, 'ToDate');
                this.positionTypePrivilege = this.authorizationService.isPrivilegeAllowed(this.company, 'PositionType');
            }
        });
        if (!this.periodTypePrivilege) {
            this.periodTypeCtrl.disable();
        }
        if (!this.fromDatePrivilege) {
            this.periodFromCtrl.disable();
        }
        if (!this.toDatePrivilege) {
            this.periodToCtrl.disable();
        }
        if (!this.positionTypePrivilege) {
            this.positionTypeCtrl.disable();
        }
    }
}
