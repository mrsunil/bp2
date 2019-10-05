import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthorizationService } from '../../../../../core/services/authorization.service';
import { BaseFormComponent } from '../../../../../shared/components/base-form-component/base-form-component.component';
import { isPositive } from '../../../../../shared/directives/number-validators.directive';
import { AtlasFormControl } from '../../../../../shared/entities/atlas-form-control';
import { MasterDataProps } from '../../../../../shared/entities/masterdata-props.entity';
import { MasterData } from '../../../../../shared/entities/masterdata.entity';
import { WeightUnit } from '../../../../../shared/entities/weight-unit.entity';
import { ContractTypes } from '../../../../../shared/enums/contract-type.enum';
import { InvoiceTypes } from '../../../../../shared/enums/invoice-type.enum';
import { InvoicingStatus } from '../../../../../shared/enums/invoicing-status.enum';
import { SectionCompleteDisplayView } from '../../../../../shared/models/section-complete-display-view';
import { CustomNumberMask } from '../../../../../shared/numberMask';
import { FormConfigurationProviderService } from '../../../../../shared/services/form-configuration-provider.service';
import { MasterdataService } from '../../../../../shared/services/http-services/masterdata.service';
import { TradingService } from '../../../../../shared/services/http-services/trading.service';
import { SecurityService } from '../../../../../shared/services/security.service';
import { UtilService } from '../../../../../shared/services/util.service';
import { maximumValue } from './quantity-form-control-validator.validator';

@Component({
    selector: 'atlas-adjust-weight-form-component',
    templateUrl: './adjust-weight-form-component.component.html',
    styleUrls: ['./adjust-weight-form-component.component.scss'],
})
export class AdjustWeightFormComponent extends BaseFormComponent implements OnInit {
    isInputField = false;
    @Output() readonly checkQuantityChange = new EventEmitter<any>();
    isEdit = false;
    modelQuantity: string;
    isWashoutInvoiceGenerated: boolean = false;
    company: string;
    quantityForTrafficTabPrivilege: boolean = false;
    quantityCodeForTrafficTabPrivilege: boolean = false;
    isImage = false;
    quantityCtrl = new AtlasFormControl('Quantity');
    quantityCodeCtrl = new AtlasFormControl('QuantityCode');

    filteredWeightUnits: WeightUnit[];

    mask = CustomNumberMask(12, 10, false);

    masterdata: MasterData;
    masterdataList: string[] = [
        MasterDataProps.WeightUnits,
    ];

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

    ngOnInit() {
        this.masterdataService.getMasterData(this.masterdataList).subscribe((data) => {
            this.masterdata = data;
            if (this.route.snapshot.data['isImage'] === true) {
                this.isImage = true;
            }
            this.filteredWeightUnits = this.masterdata.weightUnits;
            this.quantityCodeCtrl.valueChanges.subscribe((input) => {
                this.filteredWeightUnits =
                    this.utilService.filterListforAutocomplete(input,
                        this.masterdata.weightUnits,
                        ['weightCode', 'description']);
            });

            this.setValidators();
        });
        this.checkAdjustWeightFormPrivileges();
    }

    updateQuantityValue(value: number): void {
        this.quantityCtrl.patchValue(value);
        if (this.quantityCtrl.valid && this.isEdit && this.modelQuantity) {
            let quantity: string = this.quantityCtrl.value;
            quantity = quantity.toString().replace(',', '');
        }
    }

    ifCheckQuantityChange() {

        if (this.quantityCtrl.valid && this.isEdit && this.modelQuantity) {
            let quantity: string = this.quantityCtrl.value;
            quantity = quantity.toString().replace(',', '');
            this.checkQuantityChange.emit({ newValue: Number(quantity), oldValue: Number(this.modelQuantity) });
        }
    }

    setValidators(maxQuantity: number = 0, condition: string = 'base') {
        switch (condition) {
            case 'base':
                this.quantityCtrl.setValidators(Validators.compose([isPositive()]));
                break;
            case 'max':
                this.quantityCtrl.setValidators(
                    Validators.compose([isPositive(), maximumValue(maxQuantity)]));
                break;
        }
        this.quantityCtrl.updateValueAndValidity();
    }

    getFormGroup() {
        this.formGroup = this.formBuilder.group({
            quantityCtrl: this.quantityCtrl,
            quantityCodeCtrl: this.quantityCodeCtrl,
        });
        return super.getFormGroup();
    }

    displayWeightUnit(weightUnitId: number): string {
        if (weightUnitId) {
            const selectedUnit = this.masterdata.weightUnits.find(
                (weightUnit) => weightUnit.weightUnitId === weightUnitId,
            );

            if (selectedUnit) {
                return selectedUnit.weightCode;
            }
        }
        return '';
    }

    initForm(entity: any, isEdit: boolean): any {
        this.isWashoutInvoiceGenerated = false;
        const tradeRecord = new SectionCompleteDisplayView(entity);
        this.applyQuantityValidator(tradeRecord);
        if (tradeRecord.quantity) {
            this.formGroup.patchValue({ quantityCtrl: isEdit ? tradeRecord.quantity : tradeRecord.quantity.toFixed(3) });
        }
        this.formGroup.patchValue({ quantityCodeCtrl: tradeRecord.weightUnitId });

        this.modelQuantity = tradeRecord.quantity.toString();
        this.isEdit = isEdit;

        if (!isEdit) {
            this.formGroup.disable({ emitEvent: false });
        }

        if (isEdit && !this.isImage && entity &&
            entity.allocatedTo &&
            entity.invoiceReference &&
            entity.invoiceTypeId === InvoiceTypes.Washout &&
            entity.invoicingStatusId === InvoicingStatus.Finalized &&
            entity.allocatedTo.invoicingStatusId === InvoicingStatus.Finalized) {
            this.isWashoutInvoiceGenerated = true;
        }

        return entity;
    }

    isSaleOrPurchase(type: string): boolean {
        if ((type === ContractTypes[ContractTypes.Purchase]
            || type === ContractTypes[ContractTypes.Sale])) {
            return true;
        }
        return false;
    }

    isTradeFinalInvoiceRequiredOrFinalized(tradeRecord: SectionCompleteDisplayView): boolean {
        if (tradeRecord.invoicingStatusId === InvoicingStatus.FinalInvoiceRequired
            || tradeRecord.invoicingStatusId === InvoicingStatus.Finalized) {
            return true;
        }
        return false;
    }

    isAllocatedTradeFinalInvoiceRequiredOrFinalized(tradeRecord: SectionCompleteDisplayView): boolean {
        if (tradeRecord.allocatedToInvoicingStatusId === InvoicingStatus.FinalInvoiceRequired
            || tradeRecord.allocatedToInvoicingStatusId === InvoicingStatus.Finalized) {
            return true;
        }
        return false;
    }

    isTradeUninvoice(tradeRecord: SectionCompleteDisplayView): boolean {
        if (tradeRecord.invoicingStatusId === InvoicingStatus.Uninvoiced
            || tradeRecord.invoicingStatusId === null) {
            return true;
        }
        return false;
    }

    isAllocatedTradeUninvoice(tradeRecord: SectionCompleteDisplayView): boolean {
        if (tradeRecord.allocatedToInvoicingStatusId === InvoicingStatus.Uninvoiced
            || tradeRecord.allocatedToInvoicingStatusId === null) {
            return true;
        }
        return false;
    }

    applyQuantityValidator(tradeRecord: SectionCompleteDisplayView) {
        if (this.isSaleOrPurchase(tradeRecord.type) && !this.isImage) {
            if (!(tradeRecord.allocatedTo)) {
                if (this.isTradeUninvoice(tradeRecord)) {
                    this.setValidators();
                } else if (this.isTradeFinalInvoiceRequiredOrFinalized(tradeRecord)) {
                    // Invoiced, Not Allocated => Purchase Contract
                    this.setValidators(tradeRecord.quantity, 'max');
                }
            } else {
                if (this.isTradeUninvoice(tradeRecord)
                    // Not Invoiced and Allocated to Uninvoice Sale Contract
                    && this.isAllocatedTradeUninvoice(tradeRecord)) {
                    this.setValidators();
                } else if (this.isTradeUninvoice(tradeRecord)
                    // No final invoice and allocted to invoiced sale contract
                    && this.isAllocatedTradeFinalInvoiceRequiredOrFinalized(tradeRecord)) {
                    this.setValidators(tradeRecord.quantity, 'max');
                } else if (this.isTradeFinalInvoiceRequiredOrFinalized(tradeRecord)
                    // Final invoice and allocted to un-invoiced sale contract
                    && this.isAllocatedTradeUninvoice(tradeRecord)) {
                    this.setValidators(tradeRecord.quantity, 'max');
                } else if (this.isTradeFinalInvoiceRequiredOrFinalized(tradeRecord)
                    // Final invoice and allocted to un-invoiced sale contract
                    && this.isAllocatedTradeFinalInvoiceRequiredOrFinalized(tradeRecord)) {
                    this.setValidators(tradeRecord.quantity, 'max');
                }
            }
        }
    }

    checkAdjustWeightFormPrivileges() {
        this.company = this.route.snapshot.paramMap.get('company');
        this.securityService.isSecurityReady().subscribe(() => {
            if (this.authorizationService.isPrivilegeAllowed(this.company, 'Trades') && this.authorizationService.isPrivilegeAllowed(this.company, 'TrafficTab')) {
                this.quantityForTrafficTabPrivilege = this.authorizationService.isPrivilegeAllowed(this.company, 'QuantityForTraffic');
                this.quantityCodeForTrafficTabPrivilege = this.authorizationService.isPrivilegeAllowed(this.company, 'QuantityCodeForTraffic');
            }
        });
        if (!this.quantityForTrafficTabPrivilege) {
            this.quantityCtrl.disable();
        }
        if (!this.quantityCodeForTrafficTabPrivilege) {
            this.quantityCodeCtrl.disable();
        }
    }
}
