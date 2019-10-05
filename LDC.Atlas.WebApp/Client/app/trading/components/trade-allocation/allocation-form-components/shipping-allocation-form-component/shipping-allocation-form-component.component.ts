import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BaseFormComponent } from '../../../../../shared/components/base-form-component/base-form-component.component';
import { isPositive } from '../../../../../shared/directives/number-validators.directive';
import { AllocationTypes } from '../../../../../shared/entities/allocation-type.entity';
import { AtlasFormControl } from '../../../../../shared/entities/atlas-form-control';
import { MasterDataProps } from '../../../../../shared/entities/masterdata-props.entity';
import { MasterData } from '../../../../../shared/entities/masterdata.entity';
import { ShippingTypes } from '../../../../../shared/entities/shipping-type-entity';
import { WeightUnit } from '../../../../../shared/entities/weight-unit.entity';
import { AllocationType } from '../../../../../shared/enums/allocation-type.enum';
import { ShippingType } from '../../../../../shared/enums/shipping-type-enum';
import { SectionCompleteDisplayView } from '../../../../../shared/models/section-complete-display-view';
import { CustomNumberMask } from '../../../../../shared/numberMask';
import { AllocateSectionCommand } from '../../../../../shared/services/execution/dtos/allocate-section-command';
import { FormConfigurationProviderService } from '../../../../../shared/services/form-configuration-provider.service';
import { MasterdataService } from '../../../../../shared/services/http-services/masterdata.service';
import { UtilService } from '../../../../../shared/services/util.service';

@Component({
    selector: 'atlas-shipping-allocation-form-component',
    templateUrl: './shipping-allocation-form-component.component.html',
    styleUrls: ['./shipping-allocation-form-component.component.scss'],
})
export class ShippingAllocationFormComponent extends BaseFormComponent implements OnInit {

    dataVersionId: number;
    @Output() readonly isShippingFormInvalid = new EventEmitter();
    shippingTypeCtrl = new AtlasFormControl('shippingType');
    allocationSourceTypeCtrl = new AtlasFormControl('allocationSourceType');
    sourceQuantityCtrl = new AtlasFormControl('sourceQuantity');
    sourceQuantityCodeCtrl = new AtlasFormControl('sourceQuantityCode');
    allocationTargetTypeCtrl = new AtlasFormControl('allocationTargetType');
    targetQuantityCtrl = new AtlasFormControl('targetQuantity');
    targetQuantityCodeCtrl = new AtlasFormControl('targetQuantityCode');
    mask = CustomNumberMask(12, 10, true);
    shippingTypes: ShippingTypes[] = [];
    allocationSourceTypes: AllocationTypes[] = [];
    allocationTargetTypes: AllocationTypes[] = [];
    model: SectionCompleteDisplayView = new SectionCompleteDisplayView();
    masterData: MasterData = new MasterData();
    targetQuantity: number = 0;
    defaultQuantiy: number = 0;
    listOfMasterData = [
        MasterDataProps.WeightUnits,
    ];
    quantityUpdate: boolean = false;
    targetQuantityErrorMap: Map<string, string> = new Map();

    constructor(protected formConfigurationProvider: FormConfigurationProviderService,
        protected masterdataService: MasterdataService,
        private cdr: ChangeDetectorRef,
        protected utilService: UtilService,
        protected formBuilder: FormBuilder,
        protected route: ActivatedRoute) {
        super(formConfigurationProvider);
        this.dataVersionId = this.route.snapshot.params['dataVersionId'] ? Number(this.route.snapshot.params['dataVersionId']) : null;
        this.masterData = this.route.snapshot.data.masterdata;
        this.targetQuantityErrorMap
            .set('required', 'Required *')
            .set('isPositiveError', 'Quantity to allocate must be positive.')
            .set('min', ' Quantity cannot be zero.')
            .set('max', 'Cannot be greater than quantity available.');
    }

    ngOnInit() {
        for (const type in ShippingType) {
            if (typeof ShippingType[type] === 'number') {
                this.shippingTypes.push({ value: ShippingType[type] as any, shippingDescription: type });
            }
        }
        this.shippingTypeCtrl.patchValue(ShippingType.PurchaseToSale);
        for (const type in AllocationType) {
            if (typeof AllocationType[type] === 'number') {
                this.allocationSourceTypes.push({
                    value: AllocationType[type] as any,
                    allocationDescription: this.getDescription(AllocationType[type] as any, 'contract'),

                });
                this.allocationTargetTypes.push({
                    value: AllocationType[type] as any,
                    allocationDescription: this.getDescription(AllocationType[type] as any, 'contract'),
                });
            }
        }
        this.allocationSourceTypeCtrl.patchValue(AllocationType.SplitWhereNecessary);
        this.allocationTargetTypeCtrl.patchValue(AllocationType.SplitWhereNecessary);
        if (this.dataVersionId) {
            this.targetQuantityCtrl.disable();
        }
    }

    initForm(entity: any) {
        this.getQuantityData(entity);
        this.setValidators();
        this.cdr.detectChanges();
    }

    getQuantityData(entity: any) {
        if (entity) {
            this.model = new SectionCompleteDisplayView(entity);
            const weightUnit = this.masterData.weightUnits
                .filter((weightUnitItem: WeightUnit) => weightUnitItem.weightUnitId === this.model.weightUnitId);
            this.sourceQuantityCodeCtrl.setValue((weightUnit.length > 0) ? weightUnit[0].weightCode : '');
            this.sourceQuantityCtrl.setValue(this.model.quantity);
            this.defaultQuantiy = this.model.quantity;
        }
    }

    populateEntity(command: any): any {
        const allocateSection = command as AllocateSectionCommand;
        allocateSection.shippingType = this.shippingTypeCtrl.value ? this.shippingTypeCtrl.value : null;
        allocateSection.quantity = this.sourceQuantityCtrl.value ?
            Number(this.sourceQuantityCtrl.value.toString().replace(/,/g, '')) : null;
        allocateSection.allocationSourceType = this.allocationSourceTypeCtrl.value ? this.allocationSourceTypeCtrl.value : null;
        allocateSection.allocationTargetType = this.allocationTargetTypeCtrl.value ? this.allocationTargetTypeCtrl.value : null;
        return allocateSection;
    }

    getDescription(id: number, entityName: string): string {
        switch (id) {
            case AllocationType.SplitWhereNecessary:
                return 'Split ' + entityName + ' where necessary';
            case AllocationType.AdjustWhereNecessary:
                return 'Adjust ' + entityName + ' where necessary';
        }
    }

    contractRowSelected(quantityData: string[]) {
        if (quantityData.length > 1) {
            this.targetQuantity = Number(quantityData[0]);
            if (this.defaultQuantiy >= this.targetQuantity) {
                this.sourceQuantityCtrl.setValue(quantityData[0]);
                this.targetQuantityCtrl.setValue(quantityData[0]);
            } else if (this.defaultQuantiy < this.targetQuantity) {
                this.sourceQuantityCtrl.setValue(this.defaultQuantiy);
                this.targetQuantityCtrl.setValue(this.defaultQuantiy);
            }
            this.targetQuantityCodeCtrl.setValue(quantityData[1]);
        } else {
            this.targetQuantityCtrl.setValue('');
            this.targetQuantityCodeCtrl.setValue('');
        }
        this.setValidators();
    }

    getFormGroup() {
        this.formGroup = this.formBuilder.group({
            shippingTypeCtrl: this.shippingTypeCtrl,
            allocationSourceTypeCtrl: this.allocationSourceTypeCtrl,
            sourceQuantityCtrl: this.sourceQuantityCtrl,
            allocationTargetTypeCtrl: this.allocationTargetTypeCtrl,
            targetQuantityCtrl: this.targetQuantityCtrl,
            targetQuantityCodeCtrl: this.targetQuantityCodeCtrl,
        },
        );
        return super.getFormGroup();
    }

    setValidators() {
        this.sourceQuantityCtrl.setValidators(
            Validators.compose([isPositive()
                , Validators.required, Validators.min(0.0000000001), Validators.max(Number(this.model.quantity))]),
        );
        this.targetQuantityCtrl.setValidators(
            Validators.compose([isPositive(),
            Validators.required, Validators.min(0.0000000001),
            (control: AbstractControl) => Validators.max(Number(this.targetQuantity) > 0 ? Number(this.targetQuantity) : null)]),
        );
        this.targetQuantityCodeCtrl.setValidators(Validators.compose([Validators.required]));
    }

    updateQuantityValue(value) {
        if (value) {
            this.targetQuantityCtrl.setValue(value);
            this.sourceQuantityCtrl.setValue(value);
            const formattedTargetNumber = Number(this.targetQuantityCtrl.value.toString().replace(/,/g, ''));
            const formattedSourceNumber = Number(this.sourceQuantityCtrl.value.toString().replace(/,/g, ''));
            if (formattedTargetNumber > this.defaultQuantiy || formattedTargetNumber > this.targetQuantity) {
                this.targetQuantityCtrl.setErrors({ max: true });
            }
            if (formattedSourceNumber > this.defaultQuantiy || formattedSourceNumber > this.targetQuantity) {
                this.sourceQuantityCtrl.setErrors({ max: true });
            }
        }
        if (!this.formGroup.valid) {
            this.isShippingFormInvalid.emit(true);
        } else {
            this.isShippingFormInvalid.emit(false);
        }
        this.quantityUpdate = true;
    }
}
