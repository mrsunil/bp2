import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { BaseFormComponent } from '../../../../../shared/components/base-form-component/base-form-component.component';
import { isPositive } from '../../../../../shared/directives/number-validators.directive';
import { AtlasFormControl } from '../../../../../shared/entities/atlas-form-control';
import { AllocatedTradeDisplayView } from '../../../../../shared/models/allocated-trade-display-view';
import { CustomNumberMask } from '../../../../../shared/numberMask';
import { AllocateSectionCommand } from '../../../../../shared/services/execution/dtos/allocate-section-command';
import { FormConfigurationProviderService } from '../../../../../shared/services/form-configuration-provider.service';
import { UtilService } from '../../../../../shared/services/util.service';

@Component({
    selector: 'atlas-quantity-allocation-component',
    templateUrl: './quantity-allocation-component.component.html',
    styleUrls: ['./quantity-allocation-component.component.scss'],
})
export class QuantityAllocationComponentComponent extends BaseFormComponent implements OnInit {

    quantityCtrl = new AtlasFormControl('Quantity');
    quantityCodeCtrl = new AtlasFormControl('QuantityCode');
    @Output() readonly isQuantityFormInvalid = new EventEmitter();
    mask = CustomNumberMask(12, 10, true);
    quantityAvaliable: number = 0;

    constructor(protected formBuilder: FormBuilder,
        protected formConfigurationProvider: FormConfigurationProviderService,
        private cdr: ChangeDetectorRef,
        protected utilService: UtilService) {
        super(formConfigurationProvider);
    }

    ngOnInit() {
        this.setValidators();
        this.cdr.detectChanges();
    }
    setValidators() {

        this.quantityCtrl.setValidators(
            Validators.compose([isPositive()
                , Validators.required, Validators.min(0.0000000001),
            (control: AbstractControl) => Validators.max(Number(this.quantityAvaliable) > 0 ? Number(this.quantityAvaliable) : null)]),
        );
    }
    updateQuantityData(contracts: AllocatedTradeDisplayView[]) {
        if (contracts && contracts.length === 2) {
            this.quantityAvaliable = Number(contracts[0].quantity) <= Number(contracts[1].quantity) ?
                Number(contracts[0].quantity) :
                Number(contracts[1].quantity);
            this.quantityCtrl.setValue(this.quantityAvaliable.toFixed(3));
            if (contracts[0].weightCode === contracts[1].weightCode) {
                this.quantityCodeCtrl.setValue(contracts[0].weightCode);
            } else {
                this.quantityCodeCtrl.setValue('');
            }
        } else {
            this.quantityAvaliable = 0;
            this.quantityCtrl.setValue('');
            this.quantityCodeCtrl.setValue('');
        }
        this.setValidators();
    }
    getFormGroup() {
        this.formGroup = this.formBuilder.group({
            quantityCtrl: this.quantityCtrl,
            quantityCodeCtrl: this.quantityCodeCtrl,
        },
        );
        return super.getFormGroup();
    }
    populateEntity(command: any) {
        const allocateSection = command as AllocateSectionCommand;
        allocateSection.quantity = this.quantityCtrl.value ? Number(this.quantityCtrl.value.toString().replace(/,/g, '')) : null;
        return allocateSection;
    }

    resetQuantity() {
        this.quantityCtrl.setValue('');
        this.quantityCodeCtrl.setValue('');
    }

    checkQuantityValue() {
        if (this.quantityCtrl.value) {
            const formattedNumber = Number(this.quantityCtrl.value.toString().replace(/,/g, ''));
            if (formattedNumber > this.quantityAvaliable) {
                this.quantityCtrl.setErrors({ max: true });
            }
        }
        if (!this.formGroup.valid) {
            this.isQuantityFormInvalid.emit(true);
        } else {
            this.isQuantityFormInvalid.emit(false);
        }
    }
}
