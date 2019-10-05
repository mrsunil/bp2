import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BaseFormComponent } from '../../../../shared/components/base-form-component/base-form-component.component';
import { AtlasFormControl } from '../../../../shared/entities/atlas-form-control';
import { FormConfigurationProviderService } from '../../../../shared/services/form-configuration-provider.service';


@Component({
  selector: 'atlas-quantity-invoice-form-component',
  templateUrl: './quantity-invoice-form-component.component.html',
  styleUrls: ['./quantity-invoice-form-component.component.scss']
})
export class QuantityInvoiceFormComponentComponent extends BaseFormComponent implements OnInit {

	constructor(protected formBuilder: FormBuilder,
		protected formConfigurationProvider: FormConfigurationProviderService) {
		super(formConfigurationProvider);
	}

	ngOnInit() {
	}
	getFormGroup() {
		this.formGroup = this.formBuilder.group({

		});
		return super.getFormGroup();
	}

}
