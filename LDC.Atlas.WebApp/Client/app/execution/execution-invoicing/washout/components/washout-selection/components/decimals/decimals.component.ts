import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BaseFormComponent } from '../../../../../../../shared/components/base-form-component/base-form-component.component';
import { AtlasFormControl } from '../../../../../../../shared/entities/atlas-form-control';
import { MasterData } from '../../../../../../../shared/entities/masterdata.entity';
import { FormConfigurationProviderService } from '../../../../../../../shared/services/form-configuration-provider.service';
import { MasterdataService } from '../../../../../../../shared/services/http-services/masterdata.service';
import { UtilService } from '../../../../../../../shared/services/util.service';

@Component({
    selector: 'atlas-decimals',
    templateUrl: './decimals.component.html',
    styleUrls: ['./decimals.component.scss'],
})
export class DecimalsComponent extends BaseFormComponent implements OnInit {
    @Output() readonly decimalOptionSelected = new EventEmitter<any>();

    decimalOptionsCtrl = new AtlasFormControl('decimalOptions', 2);

    decimalOptions: number[] = [2, 3, 4, 5, 6, 7, 8, 9, 10];

    masterdata: MasterData;

    constructor(private route: ActivatedRoute, protected formBuilder: FormBuilder,
        protected masterdataService: MasterdataService,
        protected utilService: UtilService,
        protected formConfigurationProvider: FormConfigurationProviderService) {
        super(formConfigurationProvider);
    }

    ngOnInit() {
        this.masterdata = this.route.snapshot.data.masterdata;
        this.bindConfiguration();
        this.emitDecimalOptions();
    }

    onDecimalOptionSelected() {
        this.emitDecimalOptions();
    }
    getFormGroup() {
        this.formGroup = this.formBuilder.group({
            decimalOptionsCtrl: this.decimalOptionsCtrl,
        });
        return super.getFormGroup();
    }

    emitDecimalOptions() {
        this.decimalOptionSelected.emit({
            decimalOption: Number(this.decimalOptionsCtrl.value),
        });
    }
}
