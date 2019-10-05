import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import * as _moment from 'moment';
import { Moment } from 'moment';
import { AuthorizationService } from '../../../../../core/services/authorization.service';
import { BaseFormComponent } from '../../../../../shared/components/base-form-component/base-form-component.component';
import { CommodityInputComponent } from '../../../../../shared/components/commodity-input/commodity-input.component';
import { AtlasFormControl } from '../../../../../shared/entities/atlas-form-control';
import { Commodity } from '../../../../../shared/entities/commodity.entity';
import { MasterDataProps } from '../../../../../shared/entities/masterdata-props.entity';
import { MasterData } from '../../../../../shared/entities/masterdata.entity';
import { SectionCompleteDisplayView } from '../../../../../shared/models/section-complete-display-view';
import { FormConfigurationProviderService } from '../../../../../shared/services/form-configuration-provider.service';
import { MasterdataService } from '../../../../../shared/services/http-services/masterdata.service';
import { TradingService } from '../../../../../shared/services/http-services/trading.service';
import { SecurityService } from '../../../../../shared/services/security.service';
import { UtilService } from '../../../../../shared/services/util.service';
import { isCropYearValid } from '../../../../../shared/validators/crop-year-validator.validator';
import { PhysicalFixedPricedContract } from '../../../../entities/physical-fixed-priced-contract.entity';
import { getCropYearValue } from '../../../../services/form-field-handler.service';
import { PermissionLevels } from './../../../../../shared/enums/permission-level.enum';
import { TradeImageField } from './../../../../../shared/services/trading/dtos/tradeImageField';
const moment = _moment;

@Component({
    selector: 'atlas-commodity-form-component',
    templateUrl: './commodity-form-component.component.html',
    styleUrls: ['./commodity-form-component.component.scss'],
})
export class CommodityFormComponent extends BaseFormComponent
    implements OnInit {

    @ViewChild('commodityInput') commodityInput: CommodityInputComponent;

    @Output() readonly commodityCodeSelected = new EventEmitter<Commodity>();
    @Output() readonly commBlockWarnMessage = new EventEmitter<any>();

    model: SectionCompleteDisplayView = new SectionCompleteDisplayView();
    isInputField = false;
    commodityPart1: string;
    commodityPart2: string;
    commodityPart3: string;
    commodityPart4: string;
    commodityPart5: string;
    newCommodityPart1: string;
    newCommodityPart2: string;
    newCommodityPart3: string;
    newCommodityPart4: string;
    newCommodityPart5: string;
    commodityBlockingMessage = false;
    commodityWarningMessage = false;
    isChangedcommodityPart1 = '';
    isChangedcommodityPart2 = '';
    isChangedcommodityPart3 = '';
    isChangedcommodityPart4 = '';
    isChangedcommodityPart5 = '';
    contractDate: Moment;
    tradeImageDetails: TradeImageField[] = [];

    commodityFormGroup: FormGroup;
    cropYearCtrl = new AtlasFormControl('CropYear');

    filteredCommodities: Commodity[];

    masterdata: MasterData;
    masterdataList: string[] = [MasterDataProps.Commodities];

    cropYearValidatorPattern = '^[0-9]{4}(\/[0-9]{4})?';
    company: string;
    commodityPrivilege: boolean = false;
    cropYearPrivilege: boolean = false;
    isImage = false;
    commodityInputRequired = new AtlasFormControl('CommodityId');

    constructor(
        protected formBuilder: FormBuilder,
        protected masterdataService: MasterdataService,
        protected tradingService: TradingService,
        protected utilService: UtilService,
        protected formConfigurationProvider: FormConfigurationProviderService,
        protected route: ActivatedRoute,
        protected authorizationService: AuthorizationService,
        protected securityService: SecurityService,
    ) {
        super(formConfigurationProvider);
    }

    contractDateSelected(contractDate: Date) {
        this.contractDate = contractDate ? moment(contractDate) : undefined;
        this.resetCropYearValidation();
    }

    ngOnInit() {
        const masterDataSubscription = this.masterdataService
            .getMasterData(this.masterdataList)
            .subscribe((data) => {
                this.masterdata = data;
                this.filteredCommodities = this.masterdata.commodities;
                this.setValidators();
                this.bindConfiguration();
            });
        if (this.route.snapshot.data['isImage'] === true) {
            this.isImage = true;
        }
        this.subscriptions.push(masterDataSubscription);
        this.checkCommodityCardPrivileges();
    }

    setValidators() {
        this.cropYearCtrl.setValidators(Validators.pattern(this.cropYearValidatorPattern));
    }

    onCommodityIdSelected(commodityId: number) {
        const selectedCommodity = this.masterdata.commodities.filter(
            (commodity) => commodity.commodityId === commodityId,
        )[0];
        this.commodityCodeSelected.emit(selectedCommodity);
    }

    resetCropYearValidation() {
        this.cropYearCtrl.clearValidators();
        this.cropYearCtrl.setValidators(
            Validators.compose([
                Validators.pattern(this.cropYearValidatorPattern),
                isCropYearValid(this.contractDate),
            ]),
        );
        this.cropYearCtrl.updateValueAndValidity();
        this.formGroup.updateValueAndValidity();
    }

    getFormGroup() {
        this.formGroup = this.formBuilder.group({
            commodityFormGroup: this.commodityInput.getFormGroup(),
            cropYearCtrl: this.cropYearCtrl,
        });
        return super.getFormGroup();
    }

    initForm(entity: any, isEdit: boolean): any {
        const tradeRecord = new SectionCompleteDisplayView(entity);
        this.model = tradeRecord;

        if (this.model.commodityId && this.masterdata && this.masterdata.commodities) {
            const commodity = this.masterdata.commodities.find((cmy) => {
                return cmy.commodityId === this.model.commodityId;
            });
            this.commodityPart1 = commodity.principalCommodity;
            this.commodityPart2 = commodity.part2;
            this.commodityPart3 = commodity.part3;
            this.commodityPart4 = commodity.part4;
            this.commodityPart5 = commodity.part5;
            this.commodityInput.patchValue(commodity);
            this.onCommodityIdSelected(this.model.commodityId);

        }
        if (this.model.cropYear) {
            this.model.cropYearTo ?
                this.formGroup.patchValue({ cropYearCtrl: this.model.cropYear + '/' + this.model.cropYearTo }) :
                this.formGroup.patchValue({ cropYearCtrl: this.model.cropYear });
        }
        if (!isEdit) {
            this.formGroup.disable({ emitEvent: false });
        } else {
            if (!this.isImage) {
                if (this.model.invoiceReference &&
                    this.authorizationService.getPermissionLevel
                        (this.company, 'Trades', 'Physicals', 'SuperTradeEdition') <= PermissionLevels.None) {
                    this.formGroup.get('commodityFormGroup').disable({ emitEvent: false });
                }
            }
        }
        if (this.isImage) {
            if (this.tradeImageDetails && this.tradeImageDetails.length > 0) {

                const checkCropYearIsImage = this.tradeImageDetails.find((e) => e.tradeFieldName === 'CropYear');
                if (checkCropYearIsImage) {
                    if (!checkCropYearIsImage.isEdit) {
                        this.cropYearCtrl.disable();
                    }
                    if (!checkCropYearIsImage.isCopy) {
                        this.cropYearCtrl.patchValue(null);
                    }
                }
                const checkCommodityIsImage = this.tradeImageDetails.find((e) => e.tradeFieldName === 'CommodityId');
                if (checkCommodityIsImage && !checkCommodityIsImage.isCopy) {
                    this.commodityInput.patchValue(null);
                }
            }
        }
        this.commodityInput.isEditableCommodityForm();
        return entity;
    }
    
    commodityEmitter() {
        this.commBlockWarnMessage.emit({
            isCommodityBlockerChanged: this.commodityBlockingMessage,
            isCommodityWarningChanged: this.commodityWarningMessage,
            isChangedCmyPart1: this.isChangedcommodityPart1,
            isChangedCmyPart2: this.isChangedcommodityPart2,
            isChangedCmyPart3: this.isChangedcommodityPart3,
            isChangedCmyPart4: this.isChangedcommodityPart4,
            isChangedCmyPart5: this.isChangedcommodityPart5,
        });
    }

    populateEntity(entity: any): any {
        const section = entity as PhysicalFixedPricedContract;
        if (this.commodityInputRequired.isRequired || this.commodityInput.getCommodity() != null) {
            this.newCommodityPart1 = this.commodityInput.getCommodity().principalCommodity;
            this.newCommodityPart2 = this.commodityInput.getCommodity().part2;
            this.newCommodityPart3 = this.commodityInput.getCommodity().part3;
            this.newCommodityPart4 = this.commodityInput.getCommodity().part4;
            this.newCommodityPart5 = this.commodityInput.getCommodity().part5;

            section.commodityId = this.commodityInput.getCommodity().commodityId;

            if (this.newCommodityPart1 !== this.commodityPart1 || this.newCommodityPart2 !== this.commodityPart2) {
                this.commodityBlockingMessage = true;
                if (this.newCommodityPart1 !== this.commodityPart1) {
                    this.isChangedcommodityPart1 = '[Cmy 1]';
                }
                if (this.newCommodityPart2 !== this.commodityPart2) {
                    this.isChangedcommodityPart2 = '[Cmy 2]';
                }
                this.commodityEmitter();
            } else if ((this.newCommodityPart1 === this.commodityPart1 && this.newCommodityPart2 === this.commodityPart2) &&
                (this.commodityPart3 !== this.newCommodityPart3 || this.commodityPart4 !== this.newCommodityPart4 ||
                    this.commodityPart5 !== this.newCommodityPart5)) {
                this.commodityWarningMessage = true;
                if (this.newCommodityPart3 !== this.commodityPart3) {
                    this.isChangedcommodityPart3 = '[Cmy 3]';
                }
                if (this.newCommodityPart4 !== this.commodityPart4) {
                    this.isChangedcommodityPart4 = '[Cmy 4]';
                }
                if (this.newCommodityPart5 !== this.commodityPart5) {
                    this.isChangedcommodityPart5 = '[Cmy 5]';
                }
                this.commodityEmitter();
            }
        } else {
            section.commodityId = 0;
        }

        if (this.cropYearCtrl.value) {
            const cropYearValues = getCropYearValue(this.cropYearCtrl
                .value as string);
            section.cropYear = cropYearValues.from;
            section.cropYearTo = cropYearValues.to;
        }

        return section;
    }
    checkCommodityCardPrivileges() {
        this.company = this.route.snapshot.paramMap.get('company');
        this.securityService.isSecurityReady().subscribe(() => {
            if (this.authorizationService.isPrivilegeAllowed(this.company, 'Trades')
                && this.authorizationService.isPrivilegeAllowed(this.company, 'MainTab')) {
                this.commodityPrivilege = this.authorizationService.isPrivilegeAllowed(this.company, 'Commodity');
                this.cropYearPrivilege = this.authorizationService.isPrivilegeAllowed(this.company, 'CropYear');
            }
        });
        if (!this.commodityPrivilege) {
            this.formGroup.get('commodityFormGroup').disable();
        }
        if (!this.cropYearPrivilege) {
            this.cropYearCtrl.disable();

        }

    }
}
